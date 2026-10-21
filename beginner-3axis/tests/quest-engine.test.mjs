import test from "node:test";
import assert from "node:assert/strict";
import { QuestEngine, pair, parseQuestCommand } from "../quest-engine.mjs";
function make(agent) {
  const actions = [], robot = { x: 0 };
  const engine = new QuestEngine({ execute: c => actions.push(c), snapshot: () => ({ ...robot }), agent });
  return { engine, actions, robot };
}
test("English and Chinese operational commands share the same meanings", () => {
  for (const [a, b] of [["exercises", "练习"], ["next", "下一步"], ["back", "上一步"], ["record on", "录制 开"],
    ["record off", "录制 关"], ["steps", "步骤"], ["cancel", "取消"], ["move 1 2 3", "移动 1 2 3"]])
    assert.deepEqual(parseQuestCommand(a), parseQuestCommand(b));
});
test("manual collapse survives narration but resets at an activity transition", () => {
  const { engine } = make();
  engine.activity("tour"); engine.toggle(); assert.equal(engine.collapsed, true);
  engine.report(pair("Update", "更新")); engine.activity("tour"); assert.equal(engine.collapsed, true);
  engine.activity("reflection"); assert.equal(engine.collapsed, false);
});
test("prompt drafts survive help, cancel, resume and language changes; Stop is never captured", async () => {
  const { engine, actions } = make();
  await engine.submit("try prompt"); engine.draft = "my draft";
  await engine.submit("/ask explain"); assert.equal(engine.answers.length, 0);
  await engine.submit("stop"); assert.equal(actions.at(-1).type, "stop");
  await engine.submit("cancel"); assert.equal(engine.draft, "my draft");
  await engine.submit("answer"); assert.equal(engine.awaiting, "prototype");
  await engine.submit("中文"); assert.equal(engine.language, "zh");
  await engine.submit("我的回答"); assert.equal(engine.answers[0].text, "我的回答");
  assert.equal(engine.awaiting, null);
});
test("AI proposals require confirmation and become invalid when robot state changes", async () => {
  const { engine, actions, robot } = make({ respond: async () => ({ text: "Proposed move.", command: "move 150 0 140" }) });
  await engine.submit("Please move"); assert.equal(actions.length, 0);
  robot.x = 1; await engine.submit("confirm"); assert.equal(actions.length, 0);
  await engine.submit("Please move"); await engine.submit("confirm"); assert.equal(actions.at(-1).type, "move-target");
});
test("provider failure retains the pending answer and offline commands", async () => {
  const { engine, actions } = make({ respond: async () => { throw Error("offline"); } });
  await engine.submit("try prompt"); engine.draft = "draft";
  await engine.submit("/ask why"); assert.equal(engine.draft, "draft"); assert.equal(engine.thinking, false);
  await engine.submit("/status"); assert.equal(actions.at(-1).type, "status");
});
