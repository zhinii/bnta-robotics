/** Read-only, Z-up millimetre rendering of the verified educational model. */
import * as THREE from "three";
import { OrbitControls } from "./vendor/three/examples/jsm/controls/OrbitControls.js";
import { CONFIG, fk, solveIk, finiteVec, add, scale } from "./model.mjs";
import { BASE, proxies as robotProxies } from "./geometry.mjs";
import { t } from "./i18n.mjs";

const COLOURS = Object.freeze({
  arm: 0xd3dae4,
  tool: 0x303b4e,
  joint: 0x466ce3,
  current: 0xc57428,
  target: 0x376be8,
  invalid: 0xb34237,
  part: 0xe39133,
  base: 0x354154,
  grid: 0xe1e4e9,
  source: 0x678291,
  destination: 0x376be8,
});
const Y = new THREE.Vector3(0, 1, 0);
const Z = new THREE.Vector3(0, 0, 1);
const point = (p) => new THREE.Vector3(p.x, p.y, p.z);
const plain = (p) => ({ x: p.x, y: p.y, z: p.z });
const mean = (a, b) => point(a).add(point(b)).multiplyScalar(0.5);
const material = (color, extra = {}) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: 0.38,
    metalness: 0.35,
    ...extra,
  });
const nameNode = (node, name, extra = {}) => {
  node.name = name;
  Object.assign(node.userData, extra);
  return node;
};

// A caller can supply translated values through update(..., {strings}). All DOM
// strings are assigned with textContent; no model/learner text is interpreted as HTML.
const SCENE_STRING_KEYS = Object.freeze([
  "current",
  "target",
  "invalid",
  "source",
  "destinationA",
  "destinationB",
  "base",
  "shoulder",
  "elbow",
  "yaw",
  "upper",
  "forearm",
  "gripper",
  "actuator",
  "controller",
  "unsupported",
  "canvas",
  "help",
  "held",
  "open",
  "closed",
  "yes",
  "no",
]);
export const sceneStrings = (language = "en") =>
  Object.fromEntries(
    SCENE_STRING_KEYS.map((key) => [key, t(language, `scene.${key}`)]),
  );
export const DEFAULT_SCENE_STRINGS = Object.freeze(sceneStrings());

function orientSegment(node, a, b) {
  node.position.copy(mean(a, b));
  const direction = point(b).sub(point(a));
  node.quaternion.setFromUnitVectors(
    Y,
    direction.lengthSq() ? direction.normalize() : Y,
  );
}

function makeCapsule(proxy, color, wire = false) {
  const length = point(proxy.a).distanceTo(point(proxy.b));
  const geometry = new THREE.CapsuleGeometry(proxy.radius, length, 4, 12);
  const mesh = new THREE.Mesh(
    geometry,
    material(
      color,
      wire
        ? {
            wireframe: true,
            transparent: true,
            opacity: 0.65,
            depthTest: false,
          }
        : {},
    ),
  );
  orientSegment(mesh, proxy.a, proxy.b);
  return mesh;
}

function makeBox(box, color, wire = false) {
  const size = point(box.max).sub(point(box.min));
  const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  const node = wire
    ? new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial({ color }),
      )
    : new THREE.Mesh(geometry, material(color));
  if (wire) geometry.dispose();
  node.position.copy(mean(box.min, box.max));
  return node;
}

function axisLine(a, b, color, dashed = false) {
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([point(a), point(b)]),
    dashed
      ? new THREE.LineDashedMaterial({ color, dashSize: 3, gapSize: 2 })
      : new THREE.LineBasicMaterial({ color }),
  );
  if (dashed) line.computeLineDistances();
  return line;
}

/** Idempotently dispose shared GPU resources once, including retired dynamic groups. */
export function disposeObject(root) {
  const geometries = new Set(),
    materials = new Set(),
    textures = new Set();
  root.traverse((node) => {
    if (node.geometry) geometries.add(node.geometry);
    for (const m of Array.isArray(node.material)
      ? node.material
      : [node.material]) {
      if (!m) continue;
      materials.add(m);
      for (const value of Object.values(m))
        if (value?.isTexture) textures.add(value);
    }
  });
  textures.forEach((t) => t.dispose());
  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => m.dispose());
}

function clearGroup(group) {
  disposeObject(group);
  group.clear();
}

/** Build an actual Three.js graph without creating a canvas or WebGL context.
 * This is also the graph inspected by numeric render tests; it is not a second model.
 */
export function buildSceneGraph() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1f3f6);
  const robot = nameNode(new THREE.Group(), "robot");
  const debug = nameNode(new THREE.Group(), "collisionProxies");
  const fixtures = nameNode(new THREE.Group(), "fixtures");
  const objects = nameNode(new THREE.Group(), "objects");
  const obstacles = nameNode(new THREE.Group(), "obstacles");
  const axes = nameNode(new THREE.Group(), "baseFixedAxes");
  scene.add(robot, debug, fixtures, objects, obstacles, axes);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x79888b, 2.1));
  const light = new THREE.DirectionalLight(0xffffff, 2.4);
  light.position.set(-150, -250, 500);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  Object.assign(light.shadow.camera, {
    left: -350,
    right: 350,
    top: 350,
    bottom: -350,
    near: 1,
    far: 1200,
  });
  light.shadow.bias = -0.0004;
  light.shadow.normalBias = 0.4;
  scene.add(light);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(620, 520),
    material(0xf0f2f5, { side: THREE.DoubleSide }),
  );
  floor.position.set(70, 10, -0.06);
  floor.name = "floor";
  floor.receiveShadow = true;
  scene.add(floor);
  const grid = nameNode(
    new THREE.GridHelper(500, 25, 0xc5d6dd, COLOURS.grid),
    "floorGrid",
  );
  // GridHelper is the sole Y-up-shaped primitive: rotate its plane into XY.
  // Robot coordinates and camera are already Z-up and never receive a conversion.
  grid.rotation.x = Math.PI / 2;
  grid.position.set(40, 0, 0.02);
  scene.add(grid);

  robot.add(
    nameNode(makeBox(BASE, COLOURS.base), "base", {
      anatomyId: "base",
      collisionProxy: "base",
    }),
  );
  const defaultProxies = robotProxies(CONFIG.home, "open");
  const links = new Map(),
    proxyMeshes = new Map();
  for (const p of defaultProxies) {
    const mesh = nameNode(
      makeCapsule(
        p,
        p.id === "upper" || p.id === "forearm" ? COLOURS.arm : COLOURS.tool,
      ),
      p.id,
      { collisionProxy: p.id },
    );
    links.set(p.id, mesh);
    robot.add(mesh);
    const outline = nameNode(makeCapsule(p, 0x9c407e, true), `proxy:${p.id}`);
    proxyMeshes.set(p.id, outline);
    debug.add(outline);
  }
  const shells = new Map();
  for (const [id, length, radius] of [
    ["upper", 92, 9],
    ["forearm", 76, 7.5],
  ]) {
    const shell = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.72, radius, length, 12),
      material(0xe0e5ed),
    );
    shell.name = `housing:${id}`;
    shell.userData.decorative = true;
    shells.set(id, shell);
    robot.add(shell);
  }
  const landmarks = {};
  for (const id of ["O", "S", "E", "F", "C"]) {
    landmarks[id] = nameNode(new THREE.Object3D(), `landmark:${id}`);
    robot.add(landmarks[id]);
  }
  // The three housings identify the only positioning joints. They are labelled
  // educational decorations, not extra collision/contact members or active axes.
  const joints = [
    new THREE.Mesh(
      new THREE.CylinderGeometry(10, 10, 5, 24),
      material(COLOURS.tool),
    ),
    new THREE.Mesh(
      new THREE.CylinderGeometry(10, 10, 12, 32),
      material(COLOURS.joint),
    ),
    new THREE.Mesh(
      new THREE.CylinderGeometry(10, 10, 12, 32),
      material(COLOURS.joint),
    ),
  ];
  joints.forEach((node, i) =>
    robot.add(
      nameNode(node, `J${i + 1}`, {
        positioningJoint: true,
        jointIndex: i,
        decorative: true,
      }),
    ),
  );
  // Visual joint covers are decorative, as documented; checked proxies stay unchanged.
  for (const joint of joints) {
    for (const sign of [-1, 1]) {
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(7.5, 7.5, 1.5, 32),
        material(0xe7ebf2),
      );
      cap.position.y = sign * 6.6;
      joint.add(cap);
      for (let i = 0; i < 4; i++) {
        const bolt = new THREE.Mesh(
          new THREE.SphereGeometry(0.9, 8, 6),
          material(0x283346),
        );
        bolt.position.set(
          Math.cos((i * Math.PI) / 2) * 5,
          sign * 7.5,
          Math.sin((i * Math.PI) / 2) * 5,
        );
        joint.add(bolt);
      }
    }
  }
  const baseBody = robot.getObjectByName("base");
  baseBody.visible = false;
  for (const [radius, height, z, colour] of [
    [18, 6, 3, 0x273244],
    [16, 50, 31, 0xd4dce8],
    [17, 6, 59, 0x273244],
  ]) {
    const housing = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, height, 40),
      material(colour),
    );
    housing.quaternion.setFromUnitVectors(Y, Z);
    housing.position.z = z;
    housing.userData.decorative = true;
    robot.add(housing);
  }
  joints[0].quaternion.setFromUnitVectors(Y, Z);
  joints[0].position.set(0, 0, 66);
  // A continuous turret neck connects the base swivel to the shoulder bearing.
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(7, 9, 17, 24),
    material(COLOURS.tool),
  );
  neck.quaternion.setFromUnitVectors(Y, Z);
  neck.position.z = 72.5;
  neck.name = "turretNeck";
  neck.userData.decorative = true;
  robot.add(neck);
  const actuator = nameNode(
    new THREE.Mesh(
      new THREE.CylinderGeometry(6, 6, 5, 18),
      material(COLOURS.tool, { wireframe: true }),
    ),
    "actuator",
    { anatomyId: "actuator", decorative: true },
  );
  robot.add(actuator);
  const controller = nameNode(
    makeBox(
      { min: { x: -43, y: -42, z: 0 }, max: { x: -23, y: -22, z: 21 } },
      0x627d8b,
      true,
    ),
    "controller",
    { anatomyId: "controller", decorative: true },
  );
  scene.add(controller);

  // The fixed frame is at the true TCP; local X/Y/Z = e/u/n.
  const toolFrame = nameNode(new THREE.Group(), "fixedToolFrame", {
    fixedMount: true,
  });
  robot.add(toolFrame);
  const toolArrow = new THREE.ArrowHelper(
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(),
    19,
    COLOURS.tool,
    4,
    2,
  );
  toolFrame.add(toolArrow);
  const current = nameNode(
    new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 12, 10),
      new THREE.MeshBasicMaterial({ color: COLOURS.current, depthTest: false }),
    ),
    "currentTCP",
  );
  current.renderOrder = 4;
  robot.add(current);
  const target = nameNode(
    new THREE.Mesh(
      new THREE.SphereGeometry(5, 12, 8),
      new THREE.MeshBasicMaterial({
        color: COLOURS.target,
        wireframe: true,
        depthTest: false,
      }),
    ),
    "targetGhost",
  );
  target.renderOrder = 5;
  scene.add(target);
  const targetCross = nameNode(new THREE.Group(), "targetCross");
  target.add(targetCross);
  targetCross.add(
    axisLine({ x: -8, y: 0, z: 0 }, { x: 8, y: 0, z: 0 }, COLOURS.target),
    axisLine({ x: 0, y: -8, z: 0 }, { x: 0, y: 8, z: 0 }, COLOURS.target),
    axisLine({ x: 0, y: 0, z: -8 }, { x: 0, y: 0, z: 8 }, COLOURS.target),
  );
  const targetPath = axisLine(
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 1 },
    COLOURS.target,
    true,
  );
  targetPath.name = "previewDisplacement";
  scene.add(targetPath);

  const axisOrigin = new THREE.Vector3(-65, -100, 1);
  for (const [id, vector, color] of [
    ["X", new THREE.Vector3(1, 0, 0), 0xbe4a3f],
    ["Y", new THREE.Vector3(0, 1, 0), 0x388447],
    ["Z", new THREE.Vector3(0, 0, 1), 0x3767be],
  ]) {
    axes.add(
      nameNode(
        new THREE.ArrowHelper(vector, axisOrigin, 36, color, 7, 3.5),
        `axis:${id}`,
      ),
    );
  }
  const graph = {
    scene,
    robot,
    links,
    landmarks,
    joints,
    actuator,
    toolFrame,
    current,
    target,
    targetPath,
    grid,
    axes,
    debug,
    proxyMeshes,
    fixtures,
    objects,
    obstacles,
    labels: [],
    lastScene: null,
    shells,
    worldBounds: new THREE.Box3(),
    fixtureSignature: null,
    obstacleSignature: null,
    objectSignature: null,
  };
  graph.ghost = nameNode(new THREE.Group(), "targetArmGhost");
  graph.ghostLinks = new Map();
  for (const p of defaultProxies) {
    const mesh = makeCapsule(p, COLOURS.target);
    mesh.material.transparent = true;
    mesh.material.opacity = 0.24;
    mesh.material.depthWrite = false;
    mesh.name = `ghost:${p.id}`;
    graph.ghostLinks.set(p.id, mesh);
    graph.ghost.add(mesh);
  }
  scene.add(graph.ghost);
  graph.trailPoints = [];
  graph.trail = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({
      color: 0xf27822,
      transparent: true,
      opacity: 0.95,
    }),
  );
  graph.trail.name = "actualToolTrail";
  scene.add(graph.trail);
  graph.programPath = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineDashedMaterial({
      color: COLOURS.target,
      dashSize: 3,
      gapSize: 2,
    }),
  );
  graph.programPath.name = "programExpectedPath";
  scene.add(graph.programPath);
  return graph;
}

function fixtureMarker(f, active) {
  const group = nameNode(new THREE.Group(), f.id, { virtualSupport: true });
  group.position.copy(point(f.targetPosition));
  const color = f.id === "source" ? COLOURS.source : COLOURS.destination;
  const ring = new THREE.Mesh(
    new THREE.SphereGeometry(8, 12, 8),
    new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: active ? 0.6 : 0.25,
    }),
  );
  group.add(ring);
  const direction = point(f.targetForward).normalize();
  group.add(
    new THREE.ArrowHelper(
      direction,
      new THREE.Vector3().addScaledVector(direction, -26),
      20,
      color,
      4,
      2,
    ),
  );
  const vertical = axisLine(
    { x: 0, y: 0, z: -f.targetPosition.z },
    { x: 0, y: 0, z: -8 },
    color,
    true,
  );
  vertical.material.transparent = true;
  vertical.material.opacity = 0.25;
  group.add(vertical);
  return group;
}

/** Normalize only the display of a preview; never solve or modify robot state. */
export function previewState(target, current) {
  const value =
    target?.parsed ??
    target?.position ??
    target?.targetMm ??
    target?.value ??
    target;
  const finite = finiteVec(value);
  const valid = finite && target?.valid !== false && !target?.error;
  return {
    position: finite ? { ...value } : { ...current },
    finite,
    valid,
    error: target?.error || null,
  };
}

/** Read-only update. All object poses are supplied by the controller, never grasped here. */
export function updateSceneGraph(graph, state, target, options = {}) {
  const pose = fk(state.actualJoints);
  for (const [id, node] of Object.entries(graph.landmarks))
    node.position.copy(point(pose[id]));
  for (const p of robotProxies(state.actualJoints, state.gripperState)) {
    orientSegment(graph.links.get(p.id), p.a, p.b);
    if (graph.shells.has(p.id)) {
      const shell = graph.shells.get(p.id);
      shell.position.copy(mean(p.a, p.b));
      shell.quaternion.setFromUnitVectors(
        Y,
        point(p.b).sub(point(p.a)).normalize(),
      );
    }
    orientSegment(graph.proxyMeshes.get(p.id), p.a, p.b);
    // Copy exact contact geometry for numeric verification; no mutable model references.
    graph.links.get(p.id).userData.proxy = structuredClone(p);
  }
  graph.joints[1].position.copy(point(pose.S));
  graph.joints[2].position.copy(point(pose.E));
  graph.joints[1].quaternion.setFromUnitVectors(Y, point(pose.u));
  graph.joints[2].quaternion.setFromUnitVectors(Y, point(pose.u));
  graph.joints.forEach((joint, i) =>
    joint.material.color.setHex(
      options.focusJoint === i
        ? 0x1cb568
        : i === 0
          ? COLOURS.tool
          : COLOURS.joint,
    ),
  );
  graph.joints[0].quaternion
    .setFromUnitVectors(Y, Z)
    .premultiply(
      new THREE.Quaternion().setFromAxisAngle(Z, state.actualJoints[0]),
    );
  graph.actuator.position.copy(point(add(pose.S, scale(pose.u, 10))));
  graph.actuator.quaternion.setFromUnitVectors(Y, point(pose.u));
  graph.toolFrame.position.copy(point(pose.C));
  const basis = new THREE.Matrix4().makeBasis(
    point(pose.e),
    point(pose.u),
    point(pose.n),
  );
  graph.toolFrame.quaternion.setFromRotationMatrix(basis);
  graph.current.position.copy(point(pose.C));
  const preview = previewState(target, pose.C);
  const ghostPose = preview.finite
    ? solveIk(preview.position, state.actualJoints)
    : null;
  graph.ghost.visible =
    (options.ghost ?? true) &&
    !!ghostPose?.ok &&
    point(preview.position).distanceTo(point(pose.C)) > 0.5;
  if (graph.ghost.visible)
    for (const p of robotProxies(ghostPose.value, state.gripperState)) {
      const mesh = graph.ghostLinks.get(p.id);
      orientSegment(mesh, p.a, p.b);
      mesh.material.color.setHex(
        preview.valid ? COLOURS.target : COLOURS.invalid,
      );
    }
  if (graph.trailMode !== !!options.demonstration) {
    if (!graph.trailMode) graph.learnerTrail = graph.trailPoints;
    graph.trailPoints = options.demonstration ? [] : graph.learnerTrail || [];
    graph.trailMode = !!options.demonstration;
    graph.trail.geometry.dispose();
    graph.trail.geometry = new THREE.BufferGeometry().setFromPoints(
      graph.trailPoints,
    );
  }
  const lastTrail = graph.trailPoints.at(-1);
  if (!lastTrail || lastTrail.distanceTo(point(pose.C)) > 0.15) {
    graph.trailPoints.push(point(pose.C));
    if (graph.trailPoints.length > 1800) graph.trailPoints.shift();
    graph.trail.geometry.dispose();
    graph.trail.geometry = new THREE.BufferGeometry().setFromPoints(
      graph.trailPoints,
    );
  }
  graph.trail.visible = (options.trail ?? true) && graph.trailPoints.length > 1;
  const programSignature = JSON.stringify(options.programPoints || []);
  if (graph.programSignature !== programSignature) {
    graph.programSignature = programSignature;
    graph.programPath.geometry.dispose();
    graph.programPath.geometry = new THREE.BufferGeometry().setFromPoints(
      (options.programPoints || []).map(point),
    );
    graph.programPath.computeLineDistances();
  }
  graph.programPath.visible =
    (options.path ?? true) && options.programPoints?.length > 1;
  graph.programPath.material.color.setHex(
    options.programValid === false ? COLOURS.invalid : COLOURS.target,
  );
  graph.target.position.copy(point(preview.position));
  graph.target.visible =
    preview.finite && point(preview.position).distanceTo(point(pose.C)) > 0.5;
  const previewColour = preview.valid ? COLOURS.target : COLOURS.invalid;
  graph.target.traverse((node) => {
    if (node.material?.color) node.material.color.setHex(previewColour);
  });
  graph.targetPath.visible =
    (options.path ?? true) &&
    preview.finite &&
    point(preview.position).distanceTo(point(pose.C)) > 0.05;
  const positions = graph.targetPath.geometry.attributes.position;
  positions.setXYZ(0, pose.C.x, pose.C.y, pose.C.z);
  positions.setXYZ(
    1,
    preview.position.x,
    preview.position.y,
    preview.position.z,
  );
  positions.needsUpdate = true;
  graph.targetPath.geometry.computeBoundingSphere();
  graph.targetPath.computeLineDistances();
  graph.targetPath.material.color.setHex(previewColour);
  graph.grid.visible = options.grid ?? true;
  graph.axes.visible = options.axes ?? true;
  graph.debug.visible = options.proxies ?? false;

  const fixtureSignature = JSON.stringify([state.fixtures, state.destination]);
  if (fixtureSignature !== graph.fixtureSignature) {
    clearGroup(graph.fixtures);
    for (const fixture of state.fixtures || [])
      graph.fixtures.add(
        fixtureMarker(
          fixture,
          fixture.id === "source" || fixture.id === state.destination,
        ),
      );
    graph.fixtureSignature = fixtureSignature;
  }
  const obstacleSignature = JSON.stringify(state.obstacles);
  if (obstacleSignature !== graph.obstacleSignature) {
    clearGroup(graph.obstacles);
    for (const box of state.obstacles || []) {
      const mesh = nameNode(makeBox(box, 0xc7795b), box.id, {
        collisionObstacle: true,
      });
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry),
        new THREE.LineBasicMaterial({ color: 0x855542 }),
      );
      mesh.add(edges);
      graph.obstacles.add(mesh);
    }
    graph.obstacleSignature = obstacleSignature;
  }
  const objectSignature = JSON.stringify(
    (state.objects || []).map((o) => [o.id, o.radiusMm]),
  );
  if (objectSignature !== graph.objectSignature) {
    clearGroup(graph.objects);
    for (const object of state.objects || []) {
      const mesh = nameNode(
        new THREE.Mesh(
          new THREE.SphereGeometry(object.radiusMm, 20, 14),
          material(COLOURS.part),
        ),
        object.id,
        { radiusMm: object.radiusMm },
      );
      // A short painted diameter makes a spherical part's stored forward direction visible.
      const marker = axisLine(
        { x: 0, y: 0, z: 0 },
        { x: object.radiusMm + 0.2, y: 0, z: 0 },
        0x573914,
      );
      mesh.add(marker);
      graph.objects.add(mesh);
    }
    graph.objectSignature = objectSignature;
  }
  for (const object of state.objects || []) {
    const mesh = graph.objects.getObjectByName(object.id);
    mesh.position.copy(point(object.worldPosition));
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(1, 0, 0),
      point(object.worldForward).normalize(),
    );
  }

  graph.labels = [
    {
      id: "base",
      key: "base",
      point: { x: -20, y: 0, z: 20 },
      offset: [-34, 10],
      anatomy: true,
    },
    {
      id: "J1",
      key: "yaw",
      point: { x: 0, y: 0, z: 66 },
      offset: [-10, 18],
      anatomy: true,
    },
    {
      id: "J2",
      key: "shoulder",
      point: pose.S,
      offset: [-22, -20],
      anatomy: true,
    },
    { id: "J3", key: "elbow", point: pose.E, offset: [0, -21], anatomy: true },
    {
      id: "upper",
      key: "upper",
      point: plain(mean(pose.S, pose.E)),
      offset: [-35, 0],
      anatomy: true,
    },
    {
      id: "forearm",
      key: "forearm",
      point: plain(mean(pose.E, pose.F)),
      offset: [10, -17],
      anatomy: true,
    },
    {
      id: "gripper",
      key: "gripper",
      point: pose.F,
      offset: [0, 30],
      anatomy: true,
    },
    {
      id: "actuator",
      key: "actuator",
      point: plain(graph.actuator.position),
      offset: [-38, 39],
      anatomy: true,
    },
    {
      id: "controller",
      key: "controller",
      point: { x: -33, y: -32, z: 21 },
      offset: [-8, 19],
      anatomy: true,
    },
    {
      id: "current",
      key: "current",
      point: pose.C,
      offset: [12, 7],
      always: true,
    },
    {
      id: "target",
      key: preview.valid ? "target" : "invalid",
      point: preview.position,
      offset: [16, -20],
      always:
        point(preview.position).distanceTo(point(pose.C)) > 0.5 ||
        !preview.valid,
      invalid: !preview.valid,
    },
    ...(state.fixtures || []).map((f) => ({
      id: f.id,
      key: f.id,
      point: f.targetPosition,
      offset: [0, 23],
      fixture: true,
      dim: f.id !== "source" && f.id !== state.destination,
    })),
    ...["X", "Y", "Z"].map((axis, i) => ({
      id: `axis:${axis}`,
      text: axis,
      point: {
        x: -65 + (i === 0 ? 44 : 0),
        y: -100 + (i === 1 ? 44 : 0),
        z: 1 + (i === 2 ? 44 : 0),
      },
      offset: [0, 0],
      axis: true,
    })),
  ];
  // Bounds include required fixtures and current geometry, not enormous/invalid drafts.
  graph.worldBounds.makeEmpty();
  for (const p of [
    pose.O,
    pose.S,
    pose.E,
    pose.F,
    pose.C,
    { x: -65, y: -100, z: 0 },

    ...(state.fixtures || []).map((f) => f.targetPosition),
  ])
    graph.worldBounds.expandByPoint(point(p));
  for (const box of state.obstacles || []) {
    graph.worldBounds.expandByPoint(point(box.min));
    graph.worldBounds.expandByPoint(point(box.max));
  }
  graph.worldBounds.expandByScalar(18);
  graph.worldBounds.framePoints = [
    pose.O,
    pose.S,
    pose.E,
    pose.F,
    pose.C,
    { x: -65, y: -100, z: 44 },
    ...(state.fixtures || []).map((f) => f.targetPosition),
    ...(state.obstacles || []).flatMap((b) => [b.min, b.max]),
  ].flatMap((p) =>
    [-18, 18].flatMap((x) =>
      [-18, 18].flatMap((y) =>
        [-18, 18].map((z) => new THREE.Vector3(p.x + x, p.y + y, p.z + z)),
      ),
    ),
  );
  graph.robot.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });
  graph.scene.updateMatrixWorld(true);
  graph.lastScene = {
    pose,
    preview,
    gripperState: state.gripperState,
    objectHeld: (state.objects || []).some((o) => o.heldByGripper),
  };
  return graph.lastScene;
}

export function createCamera(aspect = 1) {
  const camera = new THREE.PerspectiveCamera(39, aspect, 0.5, 4000);
  camera.up.set(0, 0, 1);
  camera.position.set(390, -490, 330);
  return camera;
}

/** Fit a sphere around the required scene bounds without changing any model state. */
export function fitCamera(camera, bounds, controls, resetDirection = false) {
  if (bounds.isEmpty()) return;
  const centre = bounds.getCenter(new THREE.Vector3());
  const radius = bounds.getSize(new THREE.Vector3()).length() / 2;
  const vertical = THREE.MathUtils.degToRad(camera.fov / 2);
  const horizontal = Math.atan(Math.tan(vertical) * camera.aspect);

  const oldTarget = controls?.target || centre;
  const direction = resetDirection
    ? new THREE.Vector3(1.05, -1.6, 0.95).normalize()
    : camera.position.clone().sub(oldTarget).normalize();
  if (!direction.lengthSq()) direction.set(1.05, -1.6, 0.95).normalize();
  const right = new THREE.Vector3()
    .crossVectors(camera.up, direction)
    .normalize();
  if (!right.lengthSq()) right.set(1, 0, 0);
  const up = new THREE.Vector3().crossVectors(direction, right).normalize();
  let distance = 1;
  const framePoints =
    bounds.framePoints ||
    [bounds.min.x, bounds.max.x].flatMap((x) =>
      [bounds.min.y, bounds.max.y].flatMap((y) =>
        [bounds.min.z, bounds.max.z].map((z) => new THREE.Vector3(x, y, z)),
      ),
    );
  for (const p of framePoints) {
    const d = p.clone().sub(centre);
    distance = Math.max(
      distance,
      d.dot(direction) + Math.abs(d.dot(right)) / (Math.tan(horizontal) * 0.88),
      d.dot(direction) + Math.abs(d.dot(up)) / (Math.tan(vertical) * 0.88),
    );
  }
  camera.position.copy(centre).addScaledVector(direction, distance);
  camera.near = 0.5;
  camera.far = Math.max(2500, distance + radius * 8);
  camera.lookAt(centre);
  camera.updateProjectionMatrix();
  if (controls) {
    controls.target.copy(centre);
    controls.minDistance = radius * 0.8;
    controls.maxDistance = Math.max(distance * 3, 1000);
    controls.update();
  }
}

/**
 * Create a renderer. Failure returns the same safe view-only API plus text state.
 * @param {HTMLElement} container
 * @param {{onViewChange?:function,strings?:Object}} options
 */
export function createScene(container, options = {}) {
  if (!container?.ownerDocument)
    throw new TypeError("createScene requires a container element");
  const doc = container.ownerDocument,
    win = doc.defaultView;
  let strings = {
    ...sceneStrings(options.language),
    ...(options.strings || {}),
  };
  const host = doc.createElement("div");
  host.className = "robot-scene-renderer";
  Object.assign(host.style, {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: "240px",
    overflow: "hidden",
  });
  container.append(host);
  const note = doc.createElement("p");
  note.className = "scene-renderer-note";
  note.textContent = strings.help;
  Object.assign(note.style, {
    margin: ".55rem .2rem 0",
    fontSize: ".75rem",
    color: "#516c7b",
    lineHeight: "1.5",
  });
  const anatomyLegend = doc.createElement("div");
  anatomyLegend.className = "scene-anatomy-legend";
  anatomyLegend.setAttribute("role", "list");
  Object.assign(anatomyLegend.style, {
    display: "flex",
    flexWrap: "wrap",
    gap: ".35rem .8rem",
    margin: ".55rem .2rem 0",
    fontSize: ".72rem",
    lineHeight: "1.5",
    color: "#355565",
  });
  // Keep explanations in normal document flow, outside a fixed-height scene viewport.
  container.after(anatomyLegend, note);
  const status = doc.createElement("p");
  status.className = "scene-text-state";
  const fallback = doc.createElement("p");
  fallback.className = "scene-renderer-fallback";
  fallback.setAttribute("role", "status");
  fallback.textContent = strings.unsupported;
  let renderer,
    controls,
    graph,
    camera,
    resizeObserver,
    frame = 0,
    disposed = false,
    failed = false;
  let currentOptions = {},
    didFit = false,
    layoutWidth = 1,
    layoutHeight = 1,
    legendSignature = "";
  const labelElements = new Map();
  const labelLayer = doc.createElement("div");
  labelLayer.className = "scene-label-layer";
  labelLayer.setAttribute("aria-hidden", "true");
  Object.assign(labelLayer.style, {
    position: "absolute",
    inset: "0",
    pointerEvents: "none",
    overflow: "hidden",
  });

  function fail() {
    if (disposed || failed) return;
    failed = true;
    if (frame) win.cancelAnimationFrame(frame);
    frame = 0;
    controls?.dispose();
    renderer?.domElement.removeEventListener("webglcontextlost", lostContext);
    renderer?.dispose();
    renderer?.domElement.remove();
    labelLayer.remove();
    anatomyLegend.hidden = true;
    Object.assign(host.style, {
      height: "auto",
      minHeight: "180px",
      padding: "1rem",
      boxSizing: "border-box",
    });
    host.append(fallback, status);
  }
  function lostContext(event) {
    event.preventDefault();
    fail();
  }
  function requestRender() {
    if (disposed || failed || frame) return;
    frame = win.requestAnimationFrame(draw);
  }
  function draw() {
    frame = 0;
    if (disposed || failed) return;
    try {
      camera.updateMatrixWorld();
      renderer.render(graph.scene, camera);
      const occupied = [];
      for (const label of graph.labels) {
        let element = labelElements.get(label.id);
        if (!element) {
          element = doc.createElement("span");
          element.className = "scene-label";
          element.dataset.partId = label.id;
          Object.assign(element.style, {
            position: "absolute",
            maxWidth: "160px",
            fontSize: ".72rem",
            fontWeight: "650",
            lineHeight: "1.2",
            whiteSpace: "nowrap",
            color: "#26495b",
            background: "rgba(255,255,255,.92)",
            padding: "2px 4px",
            borderRadius: "3px",
            transform: "translate(-50%, -50%)",
          });
          labelLayer.append(element);
          labelElements.set(label.id, element);
        }
        const anatomyIndex =
          graph.labels
            .filter((item) => item.anatomy)
            .findIndex((item) => item.id === label.id) + 1;
        element.textContent = label.anatomy
          ? label.id === `J${(currentOptions.focusJoint ?? -2) + 1}`
            ? strings[label.key]
            : String(anatomyIndex)
          : label.text || strings[label.key] || label.key;
        element.title = strings[label.key] || label.text || "";
        if (label.anatomy)
          Object.assign(element.style, {
            border: "1px solid #9fbac7",
            borderRadius: "50%",
            minWidth: "18px",
            textAlign: "center",
            padding: "2px",
          });
        element.style.color = label.invalid
          ? "#a23129"
          : label.id === "current"
            ? "#92511a"
            : label.id === "target"
              ? "#007b82"
              : "#26495b";
        element.style.opacity = label.dim ? ".55" : "1";
        const position = point(label.point).project(camera);
        const visible =
          (label.always ||
            (label.axis && (currentOptions.axes ?? true)) ||
            (label.anatomy && (currentOptions.labels ?? true)) ||
            (label.fixture && !label.dim)) &&
          position.z >= -1 &&
          position.z <= 1 &&
          Math.abs(position.x) < 1.1 &&
          Math.abs(position.y) < 1.1;
        element.hidden = !visible;
        const x = ((position.x + 1) * layoutWidth) / 2 + label.offset[0];
        const y = ((-position.y + 1) * layoutHeight) / 2 + label.offset[1];
        const w = element.offsetWidth || 22,
          h = element.offsetHeight || 18;
        const left = Math.max(w / 2 + 6, Math.min(layoutWidth - w / 2 - 6, x));
        let top = Math.max(h / 2 + 6, Math.min(layoutHeight - h / 2 - 6, y));
        if (visible) {
          for (let n = 0; n < 10; n++) {
            if (
              !occupied.some(
                (r) =>
                  Math.abs(r.x - left) < (r.w + w) / 2 + 4 &&
                  Math.abs(r.y - top) < (r.h + h) / 2 + 4,
              )
            )
              break;
            top += h + 5;
            if (top > layoutHeight - h / 2 - 6)
              top = Math.max(h / 2 + 6, y - (n + 1) * (h + 5));
          }
          occupied.push({ x: left, y: top, w, h });
        }
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
      }
      for (const [id, element] of labelElements)
        if (!graph.labels.some((label) => label.id === id)) {
          element.remove();
          labelElements.delete(id);
        }
    } catch {
      fail();
    }
  }
  function resize() {
    if (disposed || failed) return;
    const rect = host.getBoundingClientRect();
    layoutWidth = Math.max(1, rect.width || container.clientWidth || 640);
    layoutHeight = Math.max(160, rect.height || 360);
    renderer.setSize(layoutWidth, layoutHeight, false);
    camera.aspect = layoutWidth / layoutHeight;
    camera.updateProjectionMatrix();
    if (graph.lastScene) {
      const firstFit = !didFit;
      didFit = true;
      fitCamera(camera, graph.worldBounds, controls, firstFit);
    }
    requestRender();
  }
  function update(state, target, view = {}) {
    if (disposed) return;
    currentOptions = { ...view };
    strings = {
      ...sceneStrings(view.language ?? options.language),
      ...(options.strings || {}),
      ...(view.strings || {}),
    };
    note.textContent = strings.help;
    note.hidden = true;
    fallback.textContent = strings.unsupported;
    anatomyLegend.hidden = !(view.labels ?? true) || failed;
    const pose = fk(state.actualJoints),
      preview = previewState(target, pose.C);
    const format = (p) =>
      `X ${p.x.toFixed(1)} · Y ${p.y.toFixed(1)} · Z ${p.z.toFixed(1)} mm`;
    status.textContent = `${strings.current}: ${format(pose.C)}. ${preview.valid ? strings.target : strings.invalid}: ${preview.finite ? format(preview.position) : "—"}. ${strings.gripper}: ${strings[state.gripperState] || state.gripperState}. ${strings.held}: ${strings[(state.objects || []).some((o) => o.heldByGripper) ? "yes" : "no"]}.`;
    if (failed) return;
    renderer.domElement.setAttribute(
      "aria-label",
      `${strings.canvas} ${status.textContent}`,
    );
    updateSceneGraph(graph, state, target, view);
    const nextLegendSignature = JSON.stringify(strings);
    if (legendSignature !== nextLegendSignature) {
      anatomyLegend.replaceChildren(
        ...graph.labels
          .filter((label) => label.anatomy)
          .map((label, index) => {
            const item = doc.createElement("span");
            item.setAttribute("role", "listitem");
            item.dataset.partId = label.id;
            item.textContent = `${index + 1}. ${strings[label.key] || label.key}`;
            return item;
          }),
      );
      legendSignature = nextLegendSignature;
    }
    if (!didFit) resize();
    requestRender();
  }
  function viewChanged() {
    requestRender();
    options.onViewChange?.({
      cameraPosition: plain(camera.position),
      cameraTarget: plain(controls.target),
    });
  }
  function home() {
    if (disposed || failed || !graph.lastScene) return;
    fitCamera(camera, graph.worldBounds, controls, true);
    requestRender();
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    if (frame) win.cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    win?.removeEventListener("resize", resize);
    controls?.removeEventListener("change", viewChanged);
    controls?.dispose();
    renderer?.domElement.removeEventListener("webglcontextlost", lostContext);
    if (graph) disposeObject(graph.scene);
    renderer?.dispose();
    host.remove();
    note.remove();
    anatomyLegend.remove();
    labelElements.clear();
  }
  try {
    graph = buildSceneGraph();
    camera = createCamera();
    const canvas = doc.createElement("canvas");
    const context = canvas.getContext("webgl2", {
      antialias: true,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!context) throw new Error("WEBGL2_UNAVAILABLE");
    renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true });
    renderer.setPixelRatio(Math.min(win.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.setAttribute("aria-label", strings.canvas);
    renderer.domElement.tabIndex = 0;
    Object.assign(renderer.domElement.style, {
      display: "block",
      width: "100%",
      height: "100%",
      outlineOffset: "-4px",
    });
    host.append(renderer.domElement, labelLayer);
    renderer.domElement.addEventListener("webglcontextlost", lostContext);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = true;
    controls.screenSpacePanning = false;
    controls.minPolarAngle = 0.12;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.addEventListener("change", viewChanged);
    // Scoped to this focusable canvas: no global arrow-key handler steals editing/scrolling.
    controls.listenToKeyEvents(renderer.domElement);
    if (win.ResizeObserver) {
      resizeObserver = new win.ResizeObserver(resize);
      resizeObserver.observe(host);
    } else win.addEventListener("resize", resize);
    resize();
  } catch {
    fail();
  }
  return {
    update,
    home,
    clearTrail() {
      if (graph) {
        graph.trailPoints = [];
        graph.learnerTrail = [];
        graph.trail.geometry.dispose();
        graph.trail.geometry = new THREE.BufferGeometry();
        requestRender();
      }
    },
    capture() {
      if (failed || disposed) return null;
      renderer.render(graph.scene, camera);
      return renderer.domElement.toDataURL("image/png");
    },
    dispose,
    resize,
    get supported() {
      return !failed && !disposed;
    },
    getLandmarks() {
      return graph?.lastScene
        ? Object.fromEntries(
            Object.entries(graph.landmarks).map(([id, node]) => [
              id,
              plain(node.getWorldPosition(new THREE.Vector3())),
            ]),
          )
        : null;
    },
    getViewState() {
      return camera && controls
        ? {
            cameraPosition: plain(camera.position),
            cameraTarget: plain(controls.target),
          }
        : null;
    },
  };
}
