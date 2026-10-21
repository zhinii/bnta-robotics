import test from "node:test";
import assert from "node:assert/strict";
import { Controller } from "../controller.mjs";
import { initialScene, teachingRoute } from "../planner.mjs";
import { practiceRoute } from "../curriculum.mjs";
import { fk } from "../model.mjs";
import { newGameState, beginGameAttempt, observeGameEvent } from "../game-learning.mjs";
import { startLessonFlow, practiceVerified, transferVerified } from "../lesson-flow.mjs";
import { createProgressPayload, parseProgressFile, validateProgressPayload } from "../storage.mjs";
function setup(index) {
  const s = newGameState(), a = beginGameAttempt(s, index), f = startLessonFlow(a);
  f.stage = "practice"; f.setup = true; a.phase = s.phase = "operate"; a.prediction = "My prediction.";
  const c = new Controller({ scene: initialScene({ obstacle: index === 5 }), onEvent: e => observeGameEvent(s, e) });
  return { s, a, f, c };
}
function action(c, command) {
  const result = c.startAction(command);
  if (command.expectedError) { assert.equal(result.error?.code, command.expectedError); return; }
  assert.equal(result.ok, true, JSON.stringify(result));
  c.tick(1e9);
}
test("coordinates requires +10 mm, not downward or larger moves; evidence records joint angles", () => {
  const { c, f, a } = setup(2);
  const p = fk(c.state.scene.actualJoints).C;
  action(c, { type: "move", targetMm: { ...p, z: p.z - 10 } });
  assert.equal(f.checks.up10, undefined);
  c.reset();
  action(c, { type: "move", targetMm: { ...p, z: p.z + 20 } });
  assert.equal(f.checks.up10, undefined);
  c.reset();
  action(c, { type: "move", targetMm: { ...p, z: p.z + 10 } });
  assert.ok(f.checks.up10);
  assert.equal(a.measurement.beforeAngles.length, 3);
  assert.equal(practiceVerified(a), false, "calculation still required");
});
test("anatomy requires a J1-only ten-degree change; grasp requires the ten-mm held lift", () => {
  const anatomy = setup(1);
  anatomy.c.moveJoint(0, 0.2); anatomy.c.tick(1e9);
  assert.equal(practiceVerified(anatomy.a), false);
  anatomy.c.moveJoint(0, 0.2 + Math.PI / 18); anatomy.c.tick(1e9);
  assert.equal(practiceVerified(anatomy.a), true);
  const { c, f, a } = setup(3);
  const route = practiceRoute("grip", c.state.scene);
  route.slice(0, 3).forEach(x => action(c, x));
  assert.ok(f.checks.attached);
  assert.equal(practiceVerified(a), false);
  action(c, route[3]);
  assert.equal(practiceVerified(a), true);
});
test("program requires a transfer after actual pause/stop; reset does not impersonate Stop", () => {
  const { c, f, a } = setup(4);
  c.reset(); c.setRecording(true);
  teachingRoute(c.state.scene).forEach(x => action(c, x));
  c.setRecording(false); c.reset(); c.run(); c.tick(1e9);
  assert.equal(f.checks.stopped, undefined);
  assert.equal(f.checks.transfer, undefined);
  c.reset(); c.run(); c.pause(); c.stop(); c.reset(); c.run(); c.tick(1e9);
  assert.ok(f.checks.paused && f.checks.stopped && f.checks.transfer);
  assert.equal(practiceVerified(a), false, "problem/improvement response still required");
  f.checks.problemNote = "response"; f.programNote = "I reset the scene before replay.";
  assert.equal(practiceVerified(a), true);
  const payload = createProgressPayload({ game: { ...newGameState(), runs: [a], active: a.id, lesson: 4, phase: "operate" }, program: c.state.program, scene: c.state.scene });
  assert.equal(validateProgressPayload(payload), true, "in-memory evidence must be persistable before JSON drops undefined fields");
  assert.equal(parseProgressFile(JSON.stringify(payload)).ok, true);
});
test("obstacle requires a rejected carrying route, delivery A and independent recorded replay to B", () => {
  const { c, f, a } = setup(5);
  practiceRoute("obstacle", c.state.scene).forEach(x => action(c, x));
  assert.ok(f.checks.blocked && f.checks.deliveryA);
  assert.equal(practiceVerified(a), false);
  c.changeScene(initialScene({ obstacle: true, destination: "destinationB" }));
  f.changed = true;
  a.eventFloor = c.sequence;
  c.setRecording(true);
  teachingRoute(c.state.scene).forEach(x => action(c, x));
  c.setRecording(false); c.reset(); c.run(); c.tick(1e9);
  assert.ok(f.checks.deliveryB);
  assert.equal(practiceVerified(a), true);
  assert.equal(transferVerified(c.state.program, c.state.scene, "destinationA", true), false);
});
test("drafts and completed old attempts survive roundtrip; demos and stale events cannot verify practice", () => {
  const { s, a, f, c } = setup(2);
  f.awaiting = "prediction"; f.draft = "I think J2 and J3 will move.";
  const result = parseProgressFile(JSON.stringify(createProgressPayload({ game: s })));
  assert.equal(result.ok, true);
  assert.equal(result.value.game.runs[0].flow.draft, f.draft);
  a.eventFloor = 100;
  const p = fk(c.state.scene.actualJoints).C;
  action(c, { type: "move", targetMm: { ...p, z: p.z + 10 } });
  assert.equal(f.checks.up10, undefined);
});
