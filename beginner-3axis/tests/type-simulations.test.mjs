import test from "node:test";
import assert from "node:assert/strict";
import {
  robotTypePose,
  distance3,
  DELTA_GEOMETRY,
} from "../robot-type-motion.mjs";
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
      close(distance3(a, b), DELTA_GEOMETRY.upperLength);
      close(distance3(b, e), DELTA_GEOMETRY.lowerLength);
      close(e[1], f.tip[1] + DELTA_GEOMETRY.platformOffset);
    }
  }
});
test("SCARA inserts and withdraws vertically with fingers above the socket", () => {
  for (let i = 0; i <= 1000; i++) {
    const p = robotTypePose("scara", i / 1000);
    // Rendered finger tips are 2 mm above the TCP, radius 3 mm;
    // the socket tops out at 15.98 mm. Even the lowest finger clears it.
    assert.ok(p.tip[1] + 2 - 3 > 15.98);
    if (p.held) close(distance3(p.object, p.tip), 0);
    if (p.phase === 2) {
      close(p.tip[0], p.destination[0]);
      close(p.tip[2], p.destination[2]);
    }
    if (p.tip[1] < 61 && p.phase === 3) {
      close(p.tip[0], p.destination[0]);
      close(p.tip[2], p.destination[2]);
    }
    if (p.phase === 1 && p.tip[1] < 61) {
      close(p.tip[0], p.source[0]);
      close(p.tip[2], p.source[2]);
    }
  }
});
test("Delta paired rods remain parallel with fixed spacing and clear the overhead housing", () => {
  let previous;
  for (let i = 0; i <= 2000; i++) {
    const pose = robotTypePose("delta", i / 2000);
    for (const [index, chain] of pose.chains.entries()) {
      const [left, right] = chain.rods;
      for (const r of chain.rods)
        close(distance3(r.from, r.to), DELTA_GEOMETRY.lowerLength);
      close(
        distance3(left.from, right.from),
        2 * DELTA_GEOMETRY.rodHalfSpacing,
      );
      close(distance3(left.to, right.to), 2 * DELTA_GEOMETRY.rodHalfSpacing);
      for (let axis = 0; axis < 3; axis++)
        close(
          left.to[axis] - left.from[axis],
          right.to[axis] - right.from[axis],
        );
      // This example must not fold an upper arm up into the drive housing,
      // approach a vertical singularity, or jump between IK branches.
      assert.ok(
        chain.upperAngle > 0 && chain.upperAngle < (80 * Math.PI) / 180,
      );
      if (previous)
        assert.ok(
          Math.abs(chain.upperAngle - previous.chains[index].upperAngle) < 0.03,
        );
    }
    previous = pose;
  }
});
test("Delta contacts before pickup, carries continuously and leaves its load on the tray", () => {
  let previous = robotTypePose("delta", 0),
    pickups = 0,
    releases = 0;
  for (let i = 1; i <= 4000; i++) {
    const p = robotTypePose("delta", i / 4000);
    assert.ok(
      distance3(previous.object, p.object) < 1,
      "packet must not teleport",
    );
    assert.equal(p.vacuumOn, p.held);
    if (p.held) close(distance3(p.object, p.tip), 0);
    if (p.held && !previous.held) {
      pickups++;
      close(distance3(p.tip, p.source), 0);
    }
    if (!p.held && previous.held) {
      releases++;
      close(distance3(p.object, p.destination), 0);
    }
    const horizontal = Math.hypot(
      p.tip[0] - previous.tip[0],
      p.tip[2] - previous.tip[2],
    );
    if (horizontal > 1e-6)
      assert.ok(
        p.tip[1] - 6 > 36,
        "held packet must clear the tray rim during lateral travel",
      );
    if (p.motionStage === "approach" || p.motionStage === "lift") {
      close(p.tip[0], p.source[0]);
      close(p.tip[2], p.source[2]);
    }
    if (["lower", "place", "release", "withdraw"].includes(p.motionStage)) {
      close(p.tip[0], p.destination[0]);
      close(p.tip[2], p.destination[2]);
    }
    previous = p;
  }
  assert.equal(pickups, 1);
  assert.equal(releases, 1);
  close(distance3(previous.object, previous.destination), 0);
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
