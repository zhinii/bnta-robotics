import test from "node:test";
import assert from "node:assert/strict";
import {
  newGameState,
  beginGameAttempt,
  submitGameAnswer,
  observeGameEvent,
  answerStats,
  validGameState,
} from "../game-learning.mjs";
import { Controller } from "../controller.mjs";
import {
  createProgressPayload,
  validateProgressPayload,
  parseProgressFile,
} from "../storage.mjs";
const ready = () => {
  const s = newGameState(),
    a = beginGameAttempt(s, 1);
  a.phase = s.phase = "check";
  return { s, a };
};
test("Game early correct ends submissions after one; empty score is unavailable", () => {
  const { s, a } = ready();
  assert.equal(answerStats(s).accuracy, null);
  assert.ok(submitGameAnswer(s, 0, "first"));
  a.acknowledged = true;
  assert.equal(submitGameAnswer(s, 1, "second"), false);
  assert.deepEqual(answerStats(s), { answered: 1, correct: 1, accuracy: 1 });
});
test("Game three wrong attempts become assisted; hint and replay do not count", () => {
  const { s, a } = ready();
  a.hintCount++;
  a.replays++;
  for (let i = 0; i < 3; i++) {
    assert.ok(submitGameAnswer(s, 1, "answer" + i));
    assert.equal(submitGameAnswer(s, 1, "answer" + i), false);
    a.acknowledged = true;
  }
  assert.equal(a.submissions.length, 3);
  assert.equal(a.assisted, true);
  assert.equal(a.eventualCorrect, false);
  assert.equal(submitGameAnswer(s, 0, "fourth"), false);
});
test("Game reload preserves first wrong, then correct, and separate practice runs", () => {
  let { s, a } = ready();
  submitGameAnswer(s, 1, "a");
  a.acknowledged = true;
  const payload = createProgressPayload({ game: s });
  assert.ok(validateProgressPayload(payload));
  s = parseProgressFile(JSON.stringify(payload)).value.game;
  a = s.runs[0];
  submitGameAnswer(s, 0, "b");
  assert.equal(answerStats(s).accuracy, 0);
  assert.equal(a.eventualCorrect, true);
  beginGameAttempt(s, 1);
  assert.equal(s.runs.length, 2);
  assert.equal(answerStats(s).answered, 1);
});
test("Game rejects stale, duplicate, wrong-action and wrong-step events", () => {
  const s = newGameState(),
    a = beginGameAttempt(s, 1, 5);
  a.phase = "operate";
  const c = new Controller();
  c.sequence = 10;
  c.grip("closed");
  const e = c.state.events.at(-1);
  assert.equal(observeGameEvent(s, e), false);
  c.moveJoint(0, 0.2);
  c.tick(1e9);
  const move = c.state.events.find((x) => x.type === "MOVE_COMPLETED");
  assert.equal(observeGameEvent(s, { ...move, id: "event-4" }), false);
  assert.equal(observeGameEvent(s, move), true);
  assert.equal(observeGameEvent(s, move), false);
  a.phase = "check";
  assert.equal(observeGameEvent(s, { ...move, id: "event-100" }), false);
  assert.equal(a.evidence.length, 1);
});
test("Save position preserves the live scene and emits a distinct event", () => {
  const c = new Controller(),
    before = structuredClone(c.state.scene);
  assert.ok(c.savePosition().ok);
  assert.deepEqual(c.state.scene, before);
  assert.equal(c.state.events.at(-1).type, "POSE_SAVED");
  assert.equal(c.state.program.steps.length, 1);
  c.reset();
  assert.equal(c.state.program.steps.length, 1);
  assert.ok(
    validateProgressPayload(
      createProgressPayload({ program: c.state.program, scene: c.state.scene }),
    ),
  );
});
test("Game rejects invalid answer indices, phases, ids and forged design snapshots", () => {
  const { s, a } = ready();
  a.submissions.push({ choice: 99, correct: false, token: "bad" });
  assert.equal(validGameState(s), false);
  a.submissions = [];
  s.phase = "unknown";
  assert.equal(validGameState(s), false);
  s.phase = "check";
  s.design.versions.push({ program: {}, scene: {} });
  assert.equal(
    validateProgressPayload(createProgressPayload({ game: s })),
    false,
  );
});

import {robotTypePose} from '../robot-type-motion.mjs';
test('Six-axis model has six fixed-length linked axes and actual wrist roll',()=>{const lengths=[55,80,65,28,18,22];for(let k=0;k<120;k++){const pose=robotTypePose('sixaxis',k/120);assert.equal(pose.axes.length,6);pose.points.slice(1).forEach((p,i)=>assert.ok(Math.abs(Math.hypot(...p.map((v,j)=>v-pose.points[i][j]))-lengths[i])<1e-8));}const a=robotTypePose('sixaxis',5/6),b=robotTypePose('sixaxis',(5+.25)/6);assert.ok(Math.hypot(...a.tip.map((v,i)=>v-b.tip[i]))<1e-8);assert.ok(Math.hypot(...a.side.map((v,i)=>v-b.side[i]))>.1);});
