import test from "node:test";
import assert from "node:assert/strict";
import { Controller } from "../controller.mjs";
import { initialScene, teachingRoute, clone } from "../planner.mjs";
import { fk, distance } from "../model.mjs";
import { sceneDifference } from "../program.mjs";
const finish = (c) => c.tick(1e9);
function recordRoute(c) {
  c.setRecording(true);
  for (const a of teachingRoute(c.state.scene)) {
    const r = c.startAction(a);
    assert.equal(r.ok, true, JSON.stringify(r.error));
    finish(c);
  }
  c.setRecording(false);
}
test("P4-01/02/03 preview, recording latch and no-ops", () => {
  const c = new Controller(),
    p = clone(c.state.scene);
  assert.equal(c.state.recording.enabled, false);
  c.editTarget("z", fk(p.actualJoints).C.z + 10);
  assert.deepEqual(c.state.scene, p);
  c.move();
  finish(c);
  assert.equal(c.state.program.steps.length, 0);
  c.setRecording(true);
  c.editTarget("z", fk(c.state.scene.actualJoints).C.z + 10);
  c.move();
  assert.equal(c.setRecording(false).error.code, "BUSY");
  finish(c);
  assert.equal(c.state.program.steps.length, 1);
  c.grip("closed");
  assert.equal(c.state.program.steps.length, 2);
  c.grip("closed");
  assert.equal(c.state.program.steps.length, 2);
  c.editTarget("x", "");
  assert.equal(c.move().ok, false);
  assert.equal(c.state.program.steps.length, 2);
});
test("P4-04 double operation lock produces one completion", () => {
  const c = new Controller();
  c.setRecording(true);
  c.editTarget("z", fk(c.state.scene.actualJoints).C.z + 10);
  assert.equal(c.move().ok, true);
  assert.equal(c.move().error.code, "BUSY");
  finish(c);
  assert.equal(
    c.state.events.filter((e) => e.type === "MOVE_COMPLETED").length,
    1,
  );
  assert.equal(c.state.program.steps.length, 1);
});
test("P4-05/08 record-reset-replay pause freezes exact pose", () => {
  const c = new Controller();
  recordRoute(c);
  assert.equal(c.state.program.steps.length, 9);
  const expected = clone(c.state.scene);
  c.reset();
  assert.equal(c.run().ok, true);
  assert.equal(c.run().error.code, "BUSY");
  c.tick(300);
  c.pause();
  const paused = clone(c.state.scene);
  c.tick(10000);
  assert.deepEqual(c.state.scene, paused);
  assert.equal(c.resume().ok, true);
  finish(c);
  assert.equal(c.state.execution.status, "completed");
  assert.equal(sceneDifference(c.state.scene, expected), null);
  assert.equal(c.state.program.steps.length, 9);
  assert.equal(
    c.state.events.filter((e) => e.type === "RUN_COMPLETED").length,
    1,
  );
});
test("P4-06/07 stop/reset invalidates old callbacks", () => {
  const c = new Controller();
  recordRoute(c);
  c.reset();
  c.run();
  const token = c.state.execution.operationId;
  c.tick(300, token);
  c.stop();
  const stopped = clone(c.state.scene);
  c.tick(1e9, token);
  assert.deepEqual(c.state.scene, stopped);
  assert.equal(c.resume().ok, false);
  assert.equal(c.run().error.code, "START_STATE_MISMATCH");
  c.reset();
  const reset = clone(c.state.scene);
  c.tick(1e9, token);
  assert.deepEqual(c.state.scene, reset);
  c.run();
  c.tick(300);
  c.pause();
  const old = c.state.execution.operationId;
  c.reset();
  const again = clone(c.state.scene);
  c.tick(1e9, old);
  assert.deepEqual(c.state.scene, again);
  assert.equal(c.state.program.steps.length, 9);
});
test("P4-09 start mismatch rejects, near-compatible actual start does not teleport", () => {
  const c = new Controller();
  recordRoute(c);
  assert.equal(c.run().error.code, "START_STATE_MISMATCH");
  c.reset();
  c.state.view = { camera: "changed" };
  c.state.scene.actualJoints[0] += 0.00001;
  const start = clone(c.state.scene.actualJoints);
  assert.equal(c.run().ok, true);
  c.tick(0);
  assert.deepEqual(c.state.scene.actualJoints, start);
});
test("P4-10 interrupted manual recording stores no partial command", () => {
  const c = new Controller();
  c.setRecording(true);
  c.editTarget("z", fk(c.state.scene.actualJoints).C.z + 10);
  c.move();
  c.tick(100);
  c.stop();
  assert.equal(c.state.program.steps.length, 0);
  assert.equal(c.state.recording.enabled, false);
  assert.equal(c.state.recording.blockedReason, "interrupted");
});
test("P4-11/12 clear cancel, edits revision, reset retains steps", () => {
  const c = new Controller();
  recordRoute(c);
  const steps = clone(c.state.program.steps);
  c.clearProgram(false);
  assert.deepEqual(c.state.program.steps, steps);
  c.editProgram(0, "rename", "My approach");
  assert.equal(c.state.program.steps[0].name, "My approach");
  const rev = c.state.program.revision;
  c.editProgram(2, "up");
  assert.equal(c.state.program.revision, rev + 1);
  c.reset();
  assert.equal(c.state.program.steps.length, 9);
  const pose = clone(c.state.scene);
  c.clearProgram(true);
  assert.equal(c.state.program.steps.length, 0);
  assert.deepEqual(c.state.scene, pose);
});
test("P4-13/14 invalid text and scene cancellation", () => {
  const c = new Controller();
  const before = clone(c.state.scene);
  c.editTarget("x", "");
  assert.equal(c.move().ok, false);
  assert.deepEqual(c.state.scene, before);
  c.editTarget("x", "Infinity");
  assert.equal(c.move().ok, false);
  c.state.language = "zh";
  assert.deepEqual(c.state.scene, before);
  c.syncTarget();
  c.editTarget("z", fk(c.state.scene.actualJoints).C.z + 10);
  c.move();
  const old = c.state.execution.operationId;
  c.changeScene(initialScene({ obstacle: true }));
  c.tick(1e9, old);
  assert.equal(c.state.scene.obstacles.length, 1);
  assert.equal(
    c.state.events.filter((e) => e.type === "MOVE_COMPLETED").length,
    0,
  );
});
test("P4-15 approach off, record Close, reset, replay preserves prerequisites", () => {
  const c = new Controller();
  for (const a of teachingRoute(c.state.scene).slice(0, 2)) {
    c.startAction(a);
    finish(c);
  }
  assert.equal(c.state.program.steps.length, 0);
  c.setRecording(true);
  assert.equal(c.grip("closed").ok, true);
  assert.ok(c.state.program.startScene.approachEvidence);
  assert.equal(c.state.program.steps.length, 1);
  c.setRecording(false);
  c.reset();
  assert.ok(c.state.scene.approachEvidence);
  assert.equal(c.run().ok, true);
  finish(c);
  assert.equal(c.state.scene.objects[0].heldByGripper, true);
  assert.equal(c.state.program.steps.length, 1);
});
test("Joint demo keeps other joints fixed and never records", () => {
  const c = new Controller();
  c.setRecording(true);
  const q = [...c.state.scene.actualJoints];
  const r = c.startAction({ type: "jointDemo", jointIndex: 0, angleRad: 0.1 });
  assert.equal(r.ok, true);
  c.tick(100);
  assert.equal(c.state.scene.actualJoints[1], q[1]);
  assert.equal(c.state.scene.actualJoints[2], q[2]);
  finish(c);
  assert.equal(c.state.program.steps.length, 0);
  assert.equal(
    c.state.events.filter((e) => e.type === "MOVE_COMPLETED").length,
    0,
  );
});
