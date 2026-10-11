import test from "node:test";
import assert from "node:assert/strict";
import {
  CONFIG,
  fk,
  solveIk,
  validateJointPose,
  degreesToRadians as rad,
  distance,
  dot,
  length,
  cross,
  vec,
} from "../model.mjs";
import { segmentDistance, capsuleAabb, capsule } from "../geometry.mjs";
const fixtures = [
  [
    [0, 45, -90],
    [169.705627485, 0, 80],
  ],
  [
    [90, 45, -90],
    [0, 169.705627485, 80],
  ],
  [
    [0, 90, -90],
    [120, 0, 200],
  ],
  [
    [0, 30, -60],
    [207.846096908, 0, 80],
  ],
  [
    [0, 60, -90],
    [163.923048454, 0, 123.923048454],
  ],
  [
    [-30, 45, -90],
    [146.969384567, -84.852813742, 80],
  ],
  [
    [30, 45, -90],
    [146.969384567, 84.852813742, 80],
  ],
  [
    [45, 45, -90],
    [120, 120, 80],
  ],
];
test("P1-01/07 independent FK and IK fixtures use radians", () => {
  for (const [degrees, xyz] of fixtures) {
    const q = degrees.map(rad),
      p = fk(q);
    assert.ok(distance(p.C, vec(...xyz)) < 1e-6);
    const solved = solveIk(p.C);
    assert.equal(solved.ok, true);
    solved.value.forEach((v, i) => assert.ok(Math.abs(v - q[i]) < 1e-8));
  }
});
test("P1-02/03 lengths and right-handed fixed frame", () => {
  for (const [d] of fixtures) {
    const p = fk(d.map(rad));
    for (const [a, b, l] of [
      [p.S, p.E, 120],
      [p.E, p.F, 100],
      [p.F, p.C, 20],
    ])
      assert.ok(Math.abs(distance(a, b) - l) < 1e-10);
    for (const a of [p.e, p.u, p.n]) assert.ok(Math.abs(length(a) - 1) < 1e-10);
    assert.ok(Math.abs(dot(p.e, p.u)) < 1e-10);
    assert.ok(Math.abs(dot(p.e, p.n)) < 1e-10);
    assert.ok(Math.abs(dot(p.u, p.n)) < 1e-10);
    assert.ok(distance(cross(p.e, p.u), p.n) < 1e-10);
  }
});
test("P1-04 200 admissible seeded poses, seed 20261011", () => {
  let seed = 20261011,
    count = 0,
    skipped = 0;
  const random = () => (seed = (1664525 * seed + 1013904223) >>> 0) / 2 ** 32;
  for (let attempts = 0; count < 200 && attempts < 10000; attempts++) {
    const q = CONFIG.limits.map(([a, b]) => a + (b - a) * random());
    if (!validateJointPose(q).ok) {
      skipped++;
      continue;
    }
    const p = fk(q),
      ik = solveIk(p.C);
    assert.equal(ik.ok, true);
    ik.value.forEach((v, i) => assert.ok(Math.abs(v - q[i]) < 1e-8));
    assert.ok(distance(p.C, fk(ik.value).C) < 1e-6);
    count++;
  }
  assert.equal(count, 200);
  console.log(`seeded: ${count} admissible; ${skipped} explicitly skipped`);
});
test("P1-05 structured errors and input immutability", () => {
  const cases = [
    [vec(300, 0, 80), "UNREACHABLE"],
    [vec(240, 0, 80), "SINGULAR"],
    [vec(0, 0, 200), "SINGULAR"],
    [vec(20, 0, 80), "WORKSPACE_LIMIT"],
    [
      vec(170 * Math.cos(rad(170)), 170 * Math.sin(rad(170)), 80),
      "JOINT_LIMIT",
    ],
    [vec(NaN, 0, 0), "INVALID_INPUT"],
    [vec(Infinity, 0, 0), "INVALID_INPUT"],
    [{}, "INVALID_INPUT"],
    [vec("", 0, 0), "INVALID_INPUT"],
    [null, "INVALID_INPUT"],
  ];
  for (const [p, code] of cases) {
    const before = structuredClone(p);
    assert.equal(solveIk(p).error.code, code);
    assert.deepEqual(p, before);
  }
  assert.ok(distance(fk([0, 0, -90].map(rad)).C, vec(120, 0, -40)) < 1e-8);
});
test("P1-06 continuous small vertical path has one branch", () => {
  let previous = CONFIG.home;
  const p = fk(previous).C;
  for (let i = 0; i <= 100; i++) {
    const result = solveIk({ ...p, z: p.z + i / 10 }, previous);
    assert.equal(result.ok, true);
    assert.ok(result.value[2] < 0);
    result.value.forEach((v, j) => assert.ok(Math.abs(v - previous[j]) < 0.02));
    previous = result.value;
  }
  assert.ok(distance(fk(previous).C, { ...p, z: p.z + 10 }) < 1e-6);
});
test("P1-08 conservative helper reference cases", () => {
  const v = vec;
  assert.equal(
    segmentDistance(v(0, 0, 0), v(10, 0, 0), v(5, -5, 0), v(5, 5, 0)),
    0,
  );
  assert.equal(
    segmentDistance(v(0, 0, 0), v(10, 0, 0), v(0, 3, 0), v(10, 3, 0)),
    3,
  );
  assert.equal(
    segmentDistance(v(0, 0, 0), v(0, 0, 0), v(0, 3, 0), v(0, 3, 0)),
    3,
  );
  const box = { min: v(0, 0, 0), max: v(10, 10, 10) };
  assert.equal(
    capsuleAabb(capsule("a", v(-5, 5, 5), v(15, 5, 5), 0), box),
    true,
  );
  assert.equal(
    capsuleAabb(capsule("a", v(-5, -1, 5), v(15, -1, 5), 1), box),
    true,
  );
  assert.equal(
    capsuleAabb(capsule("a", v(-5, -2, 5), v(15, -2, 5), 1), box),
    false,
  );
});
