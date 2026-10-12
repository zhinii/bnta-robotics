import test from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fk, degreesToRadians as rad, distance, CONFIG } from "../model.mjs";
import { initialScene } from "../planner.mjs";
import { proxies } from "../geometry.mjs";

// Browsers use index.html's import map. Node's equivalent is confined to this
// test worker; the official vendor files and production import are unmodified.
const hook = registerHooks({
  resolve(specifier, context, next) {
    return specifier === "three"
      ? {
          url: new URL("../vendor/three/build/three.module.js", import.meta.url)
            .href,
          shortCircuit: true,
        }
      : next(specifier, context);
  },
});
const THREE = await import("three");
const {
  buildSceneGraph,
  updateSceneGraph,
  createCamera,
  fitCamera,
  disposeObject,
  createScene,
  sceneStrings,
} = await import("../scene.mjs");
hook.deregister();

const poses = [
  [0, 45, -90],
  [90, 45, -90],
  [0, 90, -90],
  [0, 30, -60],
  [0, 60, -90],
  [-30, 45, -90],
  [30, 45, -90],
  [45, 45, -90],
];
const plain = (v) => ({ x: v.x, y: v.y, z: v.z });
const near = (a, b, tolerance = 1e-8) =>
  assert.ok(
    distance(a, b) <= tolerance,
    `${JSON.stringify(a)} != ${JSON.stringify(b)}`,
  );

test("P3-01 numeric Three.js landmarks equal FK at all eight fixtures", () => {
  const graph = buildSceneGraph(),
    state = initialScene();
  for (const degrees of poses) {
    state.actualJoints = degrees.map(rad);
    const expected = fk(state.actualJoints);
    updateSceneGraph(graph, state, expected.C);
    for (const id of ["O", "S", "E", "F", "C"])
      near(
        plain(graph.landmarks[id].getWorldPosition(new THREE.Vector3())),
        expected[id],
        0.1,
      );
    near(
      plain(graph.current.getWorldPosition(new THREE.Vector3())),
      expected.C,
      0.1,
    );
    near(plain(graph.joints[1].position), expected.S);
    near(plain(graph.joints[2].position), expected.E);
    assert.ok(
      distance(plain(graph.current.position), expected.F) > 19.99,
      "TCP marker is not the flange",
    );
  }
  disposeObject(graph.scene);
});

test("P3 contact meshes retain exact capsule endpoints, radii and jaw gaps", () => {
  const graph = buildSceneGraph(),
    state = initialScene();
  for (const degrees of poses)
    for (const grip of ["open", "closed"]) {
      state.actualJoints = degrees.map(rad);
      state.gripperState = grip;
      updateSceneGraph(graph, state, fk(state.actualJoints).C, {
        proxies: true,
      });
      const contact = proxies(state.actualJoints, grip);
      for (const expected of contact) {
        const mesh = graph.links.get(expected.id),
          length = distance(expected.a, expected.b);
        assert.equal(mesh.geometry.parameters.radius, expected.radius);
        assert.ok(Math.abs(mesh.geometry.parameters.height - length) < 1e-10);
        near(
          plain(mesh.localToWorld(new THREE.Vector3(0, -length / 2, 0))),
          expected.a,
        );
        near(
          plain(mesh.localToWorld(new THREE.Vector3(0, length / 2, 0))),
          expected.b,
        );
      }
      const fingers = contact.filter((p) => p.id.startsWith("finger"));
      assert.ok(
        Math.abs(
          distance(fingers[0].a, fingers[1].a) -
            4 -
            (grip === "open" ? 18 : 12),
        ) < 1e-9,
      );
    }
  assert.equal(
    graph.objects.getObjectByName("part").geometry.parameters.radius,
    6,
  );
  assert.equal(graph.debug.visible, true);
  disposeObject(graph.scene);
});

test("P3-04 exactly three positioning joints and fixed e/u/n tool tilt", () => {
  const graph = buildSceneGraph(),
    state = initialScene();
  let count = 0;
  graph.scene.traverse((n) => {
    if (n.userData.positioningJoint) count++;
  });
  assert.equal(count, 3);
  for (const degrees of poses) {
    state.actualJoints = degrees.map(rad);
    const pose = fk(state.actualJoints);
    updateSceneGraph(graph, state, pose.C);
    near(
      plain(
        new THREE.Vector3(1, 0, 0).applyQuaternion(graph.toolFrame.quaternion),
      ),
      pose.e,
    );
    near(
      plain(
        new THREE.Vector3(0, 1, 0).applyQuaternion(graph.toolFrame.quaternion),
      ),
      pose.u,
    );
    near(
      plain(
        new THREE.Vector3(0, 0, 1).applyQuaternion(graph.toolFrame.quaternion),
      ),
      pose.n,
    );
    near(
      plain(
        new THREE.Vector3(0, 1, 0).applyQuaternion(graph.joints[0].quaternion),
      ),
      { x: 0, y: 0, z: 1 },
    );
  }
  disposeObject(graph.scene);
});

test("Target ghost and planned path never move the robot or add a false actual trail", () => {
  const graph = buildSceneGraph(),
    state = initialScene();
  const before = structuredClone(state),
    current = fk(state.actualJoints).C;
  const target = { parsed: { ...current, z: current.z + 10 }, valid: true };
  updateSceneGraph(graph, state, target);
  assert.equal(graph.ghost.visible, true);
  assert.equal(graph.targetPath.visible, true);
  assert.equal(graph.trailPoints.length, 1);
  near(plain(graph.current.position), current);
  assert.deepEqual(state, before);
  updateSceneGraph(graph, state, { ...target, valid: false });
  assert.equal(
    graph.ghost.visible,
    true,
    "blocked target still has a visible warning ghost",
  );
  assert.equal(graph.trailPoints.length, 1);
  updateSceneGraph(graph, state, target, {
    ghost: false,
    path: false,
    trail: false,
  });
  assert.equal(graph.ghost.visible, false);
  assert.equal(graph.targetPath.visible, false);
  assert.equal(graph.trail.visible, false);
  disposeObject(graph.scene);
});

test("Worked example trails remain separate from the learner's actual movement trail", () => {
  const graph = buildSceneGraph(),
    state = initialScene();
  updateSceneGraph(graph, state, fk(state.actualJoints).C);
  state.actualJoints[0] += rad(10);
  updateSceneGraph(graph, state, fk(state.actualJoints).C);
  const learnerTrail = graph.trailPoints.map(plain);
  assert.equal(learnerTrail.length, 2);
  const demonstration = initialScene();
  updateSceneGraph(graph, demonstration, fk(demonstration.actualJoints).C, {
    demonstration: true,
  });
  demonstration.actualJoints[0] -= rad(15);
  updateSceneGraph(graph, demonstration, fk(demonstration.actualJoints).C, {
    demonstration: true,
  });
  assert.notDeepEqual(graph.trailPoints.map(plain), learnerTrail);
  updateSceneGraph(graph, state, fk(state.actualJoints).C);
  assert.deepEqual(graph.trailPoints.map(plain), learnerTrail);
  disposeObject(graph.scene);
});

test("P3-02/03 camera orbit, Home fit, toggles and target preview do not mutate scene", () => {
  const graph = buildSceneGraph(),
    state = initialScene({ obstacle: true });
  const before = structuredClone(state),
    pose = fk(state.actualJoints);
  const target = { parsed: { ...pose.C, z: pose.C.z + 10 }, valid: true };
  const targetBefore = structuredClone(target);
  updateSceneGraph(graph, state, target, {
    grid: false,
    axes: false,
    labels: false,
    proxies: true,
  });
  const camera = createCamera(1),
    controls = { target: new THREE.Vector3(), update() {} };
  fitCamera(camera, graph.worldBounds, controls, true);
  camera.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), 1);
  fitCamera(camera, graph.worldBounds, controls, true);
  assert.deepEqual(state, before);
  assert.deepEqual(target, targetBefore);
  near(plain(camera.up), { x: 0, y: 0, z: 1 });
  near(plain(graph.current.position), pose.C);
  near(plain(graph.target.position), target.parsed);
  assert.equal(graph.target.position.z - graph.current.position.z, 10);
  assert.equal(graph.grid.visible, false);
  assert.equal(graph.axes.visible, false);
  const invalid = {
    parsed: { x: 300, y: 0, z: 80 },
    valid: false,
    error: { code: "UNREACHABLE" },
  };
  updateSceneGraph(graph, state, invalid);
  assert.equal(graph.labels.find((l) => l.id === "target").key, "invalid");
  near(plain(graph.target.position), invalid.parsed);
  near(plain(graph.current.position), pose.C);
  assert.deepEqual(state, before);
  updateSceneGraph(graph, state, {
    parsed: { x: NaN, y: 0, z: 80 },
    valid: false,
  });
  assert.equal(graph.target.visible, false);
  assert.equal(graph.labels.find((l) => l.id === "target").key, "invalid");
  disposeObject(graph.scene);
});

test("P3 camera fitting preserves aspect and frames required fixtures across viewport ratios", () => {
  const graph = buildSceneGraph(),
    state = initialScene();
  updateSceneGraph(graph, state, fk(CONFIG.home).C);
  for (const [width, height] of [
    [360, 320],
    [390, 320],
    [844, 320],
    [768, 420],
    [850, 480],
  ]) {
    const camera = createCamera(width / height);
    fitCamera(camera, graph.worldBounds, null, true);
    camera.updateMatrixWorld(true);
    assert.equal(camera.aspect, width / height);
    for (const fixture of state.fixtures) {
      const p = new THREE.Vector3(
        fixture.targetPosition.x,
        fixture.targetPosition.y,
        fixture.targetPosition.z,
      ).project(camera);
      assert.ok(
        Math.abs(p.x) < 1 && Math.abs(p.y) < 1 && p.z > -1 && p.z < 1,
        `fixture clipped at ${width}×${height}`,
      );
    }
  }
  disposeObject(graph.scene);
});

test("P3 obstacle dimensions and abstract support fixture rendering agree with state", () => {
  const graph = buildSceneGraph(),
    state = initialScene({ obstacle: true });
  updateSceneGraph(graph, state, fk(CONFIG.home).C);
  const obstacle = graph.obstacles.children[0],
    size = obstacle.geometry.parameters;
  assert.equal(size.width, 30);
  assert.equal(size.height, 24);
  assert.equal(size.depth, 35);
  near(plain(obstacle.position), { x: 145, y: 0, z: 82.5 });
  for (const fixture of state.fixtures) {
    const node = graph.fixtures.getObjectByName(fixture.id);
    near(plain(node.position), fixture.targetPosition);
    assert.equal(node.userData.virtualSupport, true);
    assert.equal(node.children[0].material.wireframe, true);
  }
  disposeObject(graph.scene);
});

function fakeContainer() {
  const win = {
    devicePixelRatio: 1,
    requestAnimationFrame: () => 1,
    cancelAnimationFrame() {},
    addEventListener() {},
    removeEventListener() {},
  };
  const doc = {
    defaultView: win,
    createElement(tag) {
      return new Element(tag);
    },
  };
  class Element {
    constructor(tag) {
      this.tagName = tag;
      this.style = {};
      this.children = [];
      this.attributes = {};
      this.ownerDocument = doc;
      this.textContent = "";
    }
    append(...nodes) {
      for (const node of nodes) {
        this.children.push(node);
        node.parent = this;
      }
    }
    after(...nodes) {
      if (this.parent) this.parent.append(...nodes);
    }
    remove() {
      if (this.parent)
        this.parent.children = this.parent.children.filter((n) => n !== this);
    }
    setAttribute(key, value) {
      this.attributes[key] = value;
    }
    getContext() {
      return null;
    }
  }
  const parent = new Element("section"),
    container = new Element("div");
  parent.append(container);
  return container;
}

test("P3 WebGL2 failure returns accessible text state and an idempotent disposable API", () => {
  const container = fakeContainer(),
    renderer = createScene(container),
    state = initialScene(),
    before = structuredClone(state);
  assert.equal(renderer.supported, false);
  renderer.update(state, { parsed: fk(state.actualJoints).C, valid: true });
  const host = container.children[0];
  assert.equal(host.children[0].attributes.role, "status");
  assert.match(host.children[0].textContent, /WebGL2/);
  assert.match(host.children[1].textContent, /Current TCP: X 163.9/);
  assert.match(host.children[1].textContent, /Object held: no/i);
  renderer.home();
  assert.deepEqual(state, before);
  renderer.update(
    state,
    { parsed: fk(state.actualJoints).C, valid: true },
    { language: "zh" },
  );
  assert.match(host.children[0].textContent, /WebGL2/);
  assert.match(host.children[1].textContent, /当前/);
  renderer.dispose();
  renderer.dispose();
  assert.equal(container.children.length, 0);
});

test("P3 renderer dictionary covers both languages and GPU resources are disposed", () => {
  for (const language of ["en", "zh"])
    for (const [key, value] of Object.entries(sceneStrings(language)))
      assert.ok(value && value !== `scene.${key}`);
  const graph = buildSceneGraph();
  let geometryDisposals = 0,
    materialDisposals = 0;
  graph.links
    .get("upper")
    .geometry.addEventListener("dispose", () => geometryDisposals++);
  graph.links
    .get("upper")
    .material.addEventListener("dispose", () => materialDisposals++);
  disposeObject(graph.scene);
  assert.equal(geometryDisposals, 1);
  assert.equal(materialDisposals, 1);
});

test("P3 locally vendored Three.js r180 is pinned and copied without changes", () => {
  assert.equal(THREE.REVISION, "180");
  const root = new URL("../vendor/three/", import.meta.url),
    manifest = JSON.parse(
      readFileSync(new URL("PROVENANCE.json", root), "utf8"),
    );
  assert.equal(manifest.version, "0.180.0");
  for (const [file, expected] of Object.entries(manifest.files))
    assert.equal(
      "sha256:" +
        createHash("sha256")
          .update(readFileSync(new URL(file, root)))
          .digest("hex"),
      expected,
    );
});
