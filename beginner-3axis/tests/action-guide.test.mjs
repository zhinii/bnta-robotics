import test from "node:test";
import assert from "node:assert/strict";
import { Controller } from "../controller.mjs";
import { nextPracticeAction } from "../action-guide.mjs";
import { LessonDemo } from "../curriculum.mjs";
import { fk } from "../model.mjs";

test("Guidance follows actual setup, target, recording and replay without operating the robot", () => {
  const c = new Controller(),
    start = structuredClone(c.state.scene);
  const step = {
    type: "move",
    targetMm: { ...fk(start.actualJoints).C, z: 140 },
  };
  const guide = (complete = false) =>
    nextPracticeAction({
      state: c.state,
      events: c.state.events,
      step,
      complete,
      programLesson: true,
    });
  assert.equal(guide(), "reset");
  c.reset();
  const resetScene = structuredClone(c.state.scene);
  assert.equal(guide(), "record");
  c.setRecording(true);
  assert.equal(guide(), "target");
  for (const axis of ["x", "y", "z"]) c.editTarget(axis, step.targetMm[axis]);
  assert.equal(guide(), "move");
  assert.deepEqual(c.state.scene, resetScene);
  c.move();
  assert.equal(guide(), "watch");
  c.tick(10000);
  assert.equal(guide(true), "recordOff");
  c.setRecording(false);
  assert.equal(guide(true), "reset");
  c.reset();
  assert.equal(guide(true), "run");
  c.run();
  c.pause();
  assert.equal(guide(true), "run");
  c.run();
  c.tick(10000);
  assert.equal(guide(true), "review");
});

test("Recording example really records, restores its start and replays on its isolated controller", () => {
  const learner = new Controller(),
    before = structuredClone(learner.state);
  const demo = new LessonDemo("program");
  for (let n = 0; n < 2000 && !demo.done; n++) demo.tick(100);
  assert.equal(demo.error, null);
  assert.ok(demo.done);
  const events = demo.controller.state.events;
  assert.ok(events.some((e) => e.type === "TARGET_EDITED"));
  assert.ok(
    events.some((e) => e.type === "RUN_COMPLETED" && e.source === "replay"),
  );
  assert.equal(demo.controller.state.program.steps.length, 9);
  assert.equal(demo.controller.state.recording.enabled, false);
  assert.deepEqual(learner.state, before);
});
