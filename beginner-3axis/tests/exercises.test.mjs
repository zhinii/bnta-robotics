import test from "node:test";
import assert from "node:assert/strict";
import { Controller } from "../controller.mjs";
import { fk } from "../model.mjs";
import { teachingRoute, clone } from "../planner.mjs";
import { sceneDifference } from "../program.mjs";
import {
  createExerciseState,
  exerciseScene,
  exerciseGoal,
  recordExerciseRun,
} from "../exercises.mjs";
import {
  createProgressPayload,
  validateProgressPayload,
  exportPortfolio,
  parseProgressFile,
} from "../storage.mjs";

function build(id) {
  const c = new Controller({ scene: exerciseScene(id) });
  c.setRecording(true);
  const route =
    id === "reach"
      ? [
          {
            type: "move",
            targetMm: { ...fk(c.state.scene.actualJoints).C, z: 140 },
          },
          {
            type: "move",
            targetMm: c.state.scene.fixtures.find(
              (f) => f.id === "destinationA",
            ).targetPosition,
          },
        ]
      : teachingRoute(c.state.scene);
  for (const action of route) {
    const r = c.startAction(action);
    assert.ok(r.ok, JSON.stringify(r.error));
    c.tick(1e9);
  }
  return c;
}
test("Explore resets explicitly before testing; replay never records duplicates; pause resumes in place", () => {
  const c = build("transfer"),
    before = clone(c.state.program);
  assert.ok(sceneDifference(c.state.scene, before.startScene));
  assert.ok(c.testProgram().ok);
  assert.equal(sceneDifference(c.state.scene, before.startScene), null);
  assert.equal(c.state.recording.enabled, false);
  c.tick(80);
  c.pause();
  const paused = clone(c.state.scene);
  assert.ok(c.testProgram().ok);
  assert.deepEqual(c.state.scene, paused);
  c.tick(1e9);
  assert.equal(c.state.execution.status, "completed");
  assert.deepEqual(c.state.program, before);
  assert.ok(c.testProgram().ok);
  c.tick(1e9);
  assert.deepEqual(c.state.program, before);
});
test("Invalid test leaves the scene and program intact; interrupted replay can restart", () => {
  const c = build("reach");
  c.testProgram();
  c.tick(100);
  c.stop();
  assert.ok(c.testProgram().ok);
  c.tick(1e9);
  c.state.program.steps[0].targetMm = { x: 9999, y: 0, z: 0 };
  const scene = clone(c.state.scene),
    program = clone(c.state.program);
  assert.equal(c.testProgram().ok, false);
  assert.deepEqual(c.state.scene, scene);
  assert.deepEqual(c.state.program, program);
});
test("Every exercise is solvable; only successful recorded replay awards completion and JSON retains evidence", () => {
  let exercise = createExerciseState();
  for (const taskId of ["reach", "transfer", "obstacle"]) {
    exercise = { ...exercise, taskId };
    const c = build(taskId);
    const manual = recordExerciseRun(
      exercise,
      c.state.events.find((e) => e.type === "MOVE_COMPLETED"),
    );
    assert.deepEqual(manual, exercise);
    assert.ok(c.testProgram().ok);
    c.tick(1e9);
    const event = c.state.events.findLast((e) => e.type === "RUN_COMPLETED");
    assert.ok(exerciseGoal(taskId, event.program, event.after));
    exercise = recordExerciseRun(exercise, event);
    assert.ok(exercise.results[taskId]);
    const payload = createProgressPayload({
      exercise,
      scene: c.state.scene,
      program: c.state.program,
    });
    assert.ok(validateProgressPayload(payload));
    const out = exportPortfolio({
      exercise,
      scene: c.state.scene,
      program: c.state.program,
    });
    assert.ok(out.ok);
    const restored = parseProgressFile(JSON.stringify(out.value.portfolio));
    assert.ok(restored.ok);
    assert.deepEqual(restored.value.exercise, exercise);
    const tampered = clone(payload);
    tampered.exercise.results[taskId].scene.actualJoints[0] += 0.1;
    assert.equal(validateProgressPayload(tampered), false);
  }
  assert.equal(Object.keys(exercise.results).length, 3);
  assert.equal(
    exerciseGoal(
      "obstacle",
      exercise.results.transfer.program,
      exercise.results.transfer.scene,
    ),
    false,
  );
});
