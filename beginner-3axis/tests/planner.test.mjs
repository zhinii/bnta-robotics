import test from "node:test";
import assert from "node:assert/strict";
import {
  initialScene,
  teachingRoute,
  preflightAction,
  preflightProgram,
  planMove,
  sceneAtJoints,
  validateInterval,
  clone,
  alignment,
  validateApproach,
} from "../planner.mjs";
import {
  fk,
  distance,
  add,
  scale,
  mix,
  degreesToRadians as rad,
} from "../model.mjs";
import { collisionReport } from "../geometry.mjs";
function carry(obstacle = false) {
  let s = initialScene({ obstacle });
  for (const a of teachingRoute(s).slice(0, 3)) {
    const r = preflightAction(s, a);
    assert.equal(r.ok, true, JSON.stringify(r.error));
    s = r.value.endScene;
  }
  return s;
}
test("P2-01 exact candidate route attaches, releases and retreats with obstacle", () => {
  for (const destination of ["destinationA", "destinationB"]) {
    const s = initialScene({ obstacle: true, destination }),
      r = preflightProgram(s, teachingRoute(s));
    assert.equal(r.ok, true, JSON.stringify(r.error));
    const o = r.value.endScene.objects[0],
      f = s.fixtures.find((f) => f.id === destination);
    assert.equal(o.heldByGripper, false);
    assert.equal(o.supportedByFixtureId, destination);
    assert.ok(distance(o.worldPosition, f.targetPosition) < 1e-8);
    assert.ok(alignment(o.worldForward, f.targetForward) < 1e-8);
    assert.equal(
      r.value.actions
        .flatMap((a) => a.events || [])
        .filter((e) => e.type === "OBJECT_ATTACHED").length,
      1,
    );
  }
});
test("P2-02 blocked direct carrying route is atomic", () => {
  const s = carry(true),
    before = clone(s),
    r = planMove(s, s.fixtures[1].targetPosition);
  assert.equal(r.ok, false);
  assert.equal(r.error.code, "PATH_BLOCKED");
  assert.deepEqual(s, before);
});
test("P2-03 full link and held part proxies are checked", () => {
  let s = initialScene(),
    p = fk(s.actualJoints),
    mid = mix(p.S, p.E, 0.5);
  s.obstacles = [
    {
      id: "link-only",
      min: add(mid, { x: -1, y: -1, z: -1 }),
      max: add(mid, { x: 1, y: 1, z: 1 }),
    },
  ];
  assert.equal(planMove(s, add(p.C, { x: 0, y: 0, z: 10 })).ok, false);
  s = carry();
  p = fk(s.actualJoints);
  const pt = add(p.C, scale(p.n, 5));
  s.obstacles = [
    {
      id: "part-only",
      min: add(pt, { x: -0.2, y: -0.2, z: -0.2 }),
      max: add(pt, { x: 0.2, y: 0.2, z: 0.2 }),
    },
  ];
  const r = collisionReport(s.actualJoints, s.objects, s, 0);
  assert.equal(r.ok, false);
  assert.equal(r.error.details.proxy, "part");
});
test("P2-04 swept envelope detects a thin crossing missed by endpoints", () => {
  const s = initialScene(),
    a = [-5, 60, -90].map(rad),
    b = [5, 60, -90].map(rad),
    p = fk([0, 60, -90].map(rad));
  s.objects = [];
  s.obstacles = [
    {
      id: "thin",
      min: { x: p.C.x - 1, y: -0.1, z: p.C.z - 1 },
      max: { x: p.C.x + 1, y: 0.1, z: p.C.z + 1 },
    },
  ];
  assert.equal(collisionReport(a, [], s, 0).ok, true);
  assert.equal(collisionReport(b, [], s, 0).ok, true);
  assert.equal(validateInterval(s, a, b).ok, false);
});
test("P2-05 invalid paths preserve input", () => {
  const s = initialScene(),
    before = clone(s);
  for (const target of [
    { x: 240, y: 0, z: 80 },
    { x: 300, y: 0, z: 80 },
    { x: 120, y: 0, z: -40 },
    { x: NaN, y: 0, z: 0 },
  ])
    assert.equal(planMove(s, target).ok, false);
  assert.deepEqual(s, before);
});
test("P2-06 grasp needs position and alignment, not approach history; no teleport", () => {
  let s = initialScene(),
    r = preflightAction(s, { type: "gripper", gripperState: "closed" });
  assert.equal(r.ok, true);
  assert.equal(r.value.endScene.objects[0].heldByGripper, false);
  s = sceneAtJoints(s, [-30, 45, -90].map(rad));
  assert.equal(
    preflightAction(s, { type: "gripper", gripperState: "closed" }).value
      .endScene.objects[0].heldByGripper,
    true,
  );
  const held = carry();
  assert.ok(
    distance(held.objects[0].worldPosition, s.objects[0].worldPosition) < 1e-10,
  );
  const stale = clone(held);
  stale.objects[0].heldByGripper = false;
  stale.objects[0].supportedByFixtureId = "source";
  stale.gripperState = "open";
  assert.equal(
    preflightAction(stale, { type: "gripper", gripperState: "closed" }).ok,
    true,
  );
});
test("P2-07 unsupported release and duplicate commands", () => {
  let s = carry(),
    up = add(fk(s.actualJoints).C, { x: 0, y: 0, z: 10 });
  s = planMove(s, up).value.endScene;
  const before = clone(s);
  assert.equal(
    preflightAction(s, { type: "gripper", gripperState: "open" }).error.code,
    "UNSUPPORTED_RELEASE",
  );
  assert.deepEqual(s, before);
  assert.equal(
    preflightAction(s, { type: "gripper", gripperState: "closed" }).value.noop,
    true,
  );
});
test("P2-08/09 full dry-run rejects late failure and is deterministic", () => {
  const s = initialScene(),
    steps = teachingRoute(s),
    before = clone(s),
    bad = [...steps.slice(0, 4), { type: "gripper", gripperState: "open" }];
  assert.equal(preflightProgram(s, bad).ok, false);
  assert.deepEqual(s, before);
  assert.deepEqual(preflightProgram(s, steps), preflightProgram(s, steps));
});
test("Approach provenance rejects corrupted shapes, endpoints and stale geometry", () => {
  let s = initialScene();
  for (const a of teachingRoute(s).slice(0, 2))
    s = preflightAction(s, a).value.endScene;
  for (const mutate of [
    (a) => delete a.samples,
    (a) => delete a.objectPose,
    (a) => delete a.endJoints,
    (a) => (a.endJoints = [1, 2, 3]),
    (a) => (a.startJoints = [1, 2, 3]),
    (a) => (a.samples[0] = [1, 2, 3]),
  ]) {
    const bad = clone(s);
    mutate(bad.approachEvidence);
    assert.equal(
      validateApproach(bad, bad.objects[0]).error.code,
      "GRASP_APPROACH_REQUIRED",
    );
  }
});
test("Finger actuation checks an obstacle between open and closed positions", () => {
  const s = initialScene(),
    p = fk(s.actualJoints);
  const pt = add(p.C, scale(p.u, 9.5));
  s.obstacles = [
    {
      id: "finger-sweep",
      min: add(pt, { x: -0.1, y: -0.1, z: -0.1 }),
      max: add(pt, { x: 0.1, y: 0.1, z: 0.1 }),
    },
  ];
  const before = clone(s);
  assert.equal(
    preflightAction(s, { type: "gripper", gripperState: "closed" }).ok,
    false,
  );
  assert.deepEqual(s, before);
});
