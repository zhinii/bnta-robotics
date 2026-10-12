import test from "node:test";
import assert from "node:assert/strict";
import { mechanismFrame, ROBOT_TYPES } from "../type-simulations.mjs";
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} != ${b}`);

test("articulated and SCARA demonstrations preserve link lengths throughout movement", () => {
  for (const type of ["articulated", "scara"])
    for (let i = 0; i <= 1000; i++) {
      const f = mechanismFrame(type, i / 1000);
      close(distance(f.base, f.joint), 125);
      close(distance(f.joint, f.tip), 105);
    }
});
test("delta chains stay connected to a level platform with fixed link lengths", () => {
  for (let i = 0; i <= 1000; i++) {
    const f = mechanismFrame("delta", i / 1000);
    for (const [a, b, c] of f.chains) {
      close(distance(a, b), 100);
      close(distance(b, c), 120);
    }
    close(f.chains[0][2].y, f.chains[1][2].y);
    close(distance(f.chains[0][2], f.chains[1][2]), 56);
  }
});
test("rover turns without translating and drives along its heading", () => {
  for (const phase of [1, 3]) {
    const a = mechanismFrame("mobile", (phase + 0.1) / 4),
      b = mechanismFrame("mobile", (phase + 0.9) / 4);
    close(distance(a.tip, b.tip), 0);
    assert.notEqual(a.heading, b.heading);
    assert.equal(a.wheels[0], -a.wheels[1]);
  }
  const a = mechanismFrame("mobile", 0.1),
    b = mechanismFrame("mobile", 0.2);
  close(a.tip.y, b.tip.y);
  assert.ok(b.tip.x > a.tip.x);
  const c = mechanismFrame("mobile", 0.6),
    d = mechanismFrame("mobile", 0.7);
  close(c.tip.x, d.tip.x);
  assert.ok(d.tip.y < c.tip.y);
});
test("mechanisms move continuously through phase boundaries and return without carrying cargo", () => {
  for (const type of ROBOT_TYPES) {
    for (const t of [0.25, 0.5, 0.75])
      close(
        distance(
          mechanismFrame(type, t - 1e-8).tip,
          mechanismFrame(type, t + 1e-8).tip,
        ),
        0,
      );
    if (type !== "mobile") {
      const first = mechanismFrame(type, 0),
        last = mechanismFrame(type, 1);
      close(distance(first.tip, last.tip), 0);
      assert.equal(mechanismFrame(type, 0.4).held, true);
      assert.equal(mechanismFrame(type, 0.9).held, false);
    }
  }
});
