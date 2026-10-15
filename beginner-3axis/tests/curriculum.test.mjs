import test from "node:test";
import assert from "node:assert/strict";
import {
  COURSE,
  LessonDemo,
  moveMeasurement,
  checkCalculation,
} from "../curriculum.mjs";
import { Controller } from "../controller.mjs";
import { initialScene } from "../planner.mjs";
import { proxies, segmentDistance, collisionReport } from "../geometry.mjs";
import { CONFIG, fk } from "../model.mjs";
import {
  exportPortfolio,
  parseProgressFile,
  createProgressPayload,
} from "../storage.mjs";

test("Every lesson has a bilingual goal, concept, example, prediction, task and reflection", () => {
  for (const lesson of Object.values(COURSE))
    for (const field of [
      "goal",
      "concept",
      "demo",
      "prediction",
      "task",
      "reflect",
    ])
      for (const lang of ["en", "zh"])
        assert.ok(lesson[field][lang].length > 10);
});
test("All seven demonstrations execute through the real planner, including the expected collision rejection", () => {
  for (const id of Object.keys(COURSE)) {
    const demo = new LessonDemo(id);
    let n = 0;
    while (!demo.done && n++ < 2000) demo.tick(100);
    assert.ok(demo.done, `${id} finishes`);
    assert.ok(!demo.error, `${id}: ${demo.error?.code}`);
    assert.equal(
      demo.controller.state.program.steps.length,
      id === "program" ? 9 : 0,
      "only the recording example records into its isolated controller",
    );
    if (["types", "program", "obstacle", "design"].includes(id))
      assert.equal(
        demo.controller.state.scene.objects[0].supportedByFixtureId,
        "destinationA",
      );
    demo.dispose();
  }
});
test("Each gripper finger is mechanically connected to the palm by a collision-checked bridge", () => {
  for (const state of ["open", "closed"]) {
    const all = proxies(CONFIG.home, state),
      bridge = all.find((p) => p.id === "jawBridge"),
      palm = all.find((p) => p.id === "palm");
    assert.ok(bridge);
    for (const p of [palm, ...all.filter((p) => p.id.startsWith("finger"))])
      assert.ok(
        segmentDistance(p.a, p.b, bridge.a, bridge.b) <=
          p.radius + bridge.radius,
      );
    const scene = initialScene();
    const mid = {
      x: (bridge.a.x + bridge.b.x) / 2,
      y: (bridge.a.y + bridge.b.y) / 2,
      z: (bridge.a.z + bridge.b.z) / 2,
    };
    scene.obstacles = [
      {
        id: "bridge-blocker",
        min: { x: mid.x - 1, y: mid.y - 1, z: mid.z - 1 },
        max: { x: mid.x + 1, y: mid.y + 1, z: mid.z + 1 },
      },
    ];
    assert.equal(collisionReport(CONFIG.home, [], scene).ok, false);
  }
});
test("Math evidence comes from completed motion with model time, not previews or invented answers", () => {
  const c = new Controller();
  const initial = fk(c.state.scene.actualJoints).C;
  c.editTarget("z", initial.z + 10);
  assert.equal(moveMeasurement(c.state.events.at(-1)), null);
  c.move();
  c.tick(10000);
  const event = c.state.events.find((e) => e.type === "MOVE_COMPLETED"),
    m = moveMeasurement(event);
  assert.ok(Math.abs(m.displacementZ - 10) < 1e-8);
  assert.ok(Math.abs(m.distanceMm - 10) < 0.01);
  assert.ok(m.seconds > 0);
  assert.equal(
    checkCalculation(m, { displacement: "", distance: 10, speed: m.speedMmS }),
    false,
  );
  assert.equal(
    checkCalculation(m, { displacement: 10, distance: 10, speed: m.speedMmS }),
    true,
  );
  assert.equal(
    checkCalculation(m, { displacement: 10, distance: 10, speed: 999 }),
    false,
  );
});
test("Exported portfolio restores a validated scene and program; bad files do not pass", () => {
  const c = new Controller();
  c.setRecording(true);
  c.editTarget("z", fk(CONFIG.home).C.z + 10);
  c.move();
  c.tick(10000);
  const result = exportPortfolio({
    program: c.state.program,
    scene: c.state.scene,
  });
  assert.ok(result.ok);
  const parsed = parseProgressFile(result.value.json);
  assert.ok(parsed.ok);
  assert.deepEqual(parsed.value.scene, c.state.scene);
  assert.deepEqual(parsed.value.program, c.state.program);
  assert.equal(parseProgressFile("{bad").ok, false);
  const bad = createProgressPayload();
  bad.scene = { actualJoints: [Infinity, 0, 0] };
  assert.equal(parseProgressFile(JSON.stringify(bad)).ok, false);
});
