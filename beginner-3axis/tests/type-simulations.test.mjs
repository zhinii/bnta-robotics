import test from "node:test";
import assert from "node:assert/strict";
import { robotTypePose, distance3 } from "../robot-type-motion.mjs";
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-6, `${a} != ${b}`);
test("3D articulated and SCARA links remain connected with fixed lengths", () => {
  for (let i = 0; i <= 1000; i++) {
    const a = robotTypePose("articulated", i / 1000),
      s = robotTypePose("scara", i / 1000);
    close(distance3(a.base, a.joint), 80);
    close(distance3(a.joint, a.tip), 70);
    close(distance3(s.base, s.joint), 95);
    close(distance3(s.joint, [s.tip[0], 100, s.tip[2]]), 80);
  }
});
test("3D delta has three constrained chains connected to a level platform", () => {
  for (let i = 0; i <= 1000; i++) {
    const f = robotTypePose("delta", i / 1000);
    assert.equal(f.chains.length, 3);
    for (const { a, b, e } of f.chains) {
      close(distance3(a, b), 75);
      close(distance3(b, e), 125);
      close(e[1], f.tip[1] + 15);
    }
  }
});
test("rover turns in place and translates in its heading; gantry traces a closed print outline", () => {
  for (const phase of [1, 3]) {
    const a = robotTypePose("mobile", (phase + 0.1) / 4),
      b = robotTypePose("mobile", (phase + 0.9) / 4);
    close(distance3(a.tip, b.tip), 0);
    assert.notEqual(a.heading, b.heading);
  }
  for (const phase of [0, 2]) {
    const a = robotTypePose("mobile", (phase + 0.1) / 4),
      b = robotTypePose("mobile", (phase + 0.9) / 4);
    const dx = b.tip[0] - a.tip[0],
      dz = b.tip[2] - a.tip[2];
    close(dx * Math.sin(a.heading) + dz * Math.cos(a.heading), 0);
  }
  close(
    distance3(
      robotTypePose("cartesian", 0).tip,
      robotTypePose("cartesian", 1).tip,
    ),
    0,
  );
});
test("all five 3D motion paths are continuous at phase transitions", () => {
  for (const type of ["articulated", "cartesian", "scara", "delta", "mobile"]) {
    for (const t of [0.25, 0.5, 0.75])
      close(
        distance3(
          robotTypePose(type, t - 1e-8).tip,
          robotTypePose(type, t + 1e-8).tip,
        ),
        0,
      );
    if (["articulated", "scara", "delta"].includes(type)) {
      assert.equal(robotTypePose(type, 0.4).held, true);
      assert.equal(robotTypePose(type, 0.9).held, false);
      close(
        distance3(robotTypePose(type, 0).tip, robotTypePose(type, 1).tip),
        0,
      );
    }
  }
});
