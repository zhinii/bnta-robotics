import test from "node:test";
import assert from "node:assert/strict";
import { requestGuide } from "../guide-ai.mjs";
import { GUIDE_COMMANDS, parseGuideCommand, suggestGuideCommands, validateGuideProposal } from "../guide-commands.mjs";
import { newGameState, validGameState } from "../game-learning.mjs";

test("saved Guide conversation and retry question are validated before restore", () => {
  const state = newGameState();
  state.dialogue = [{ role: "user", text: "Why did it fail?", at: new Date().toISOString() }];
  state.retryQuestion = "Why did it fail?";
  state.aiTurns = [{ role: "assistant", text: "Compare the target with the joint limits." }];
  assert.equal(validGameState(state), true);
  for (const bad of [
    { dialogue: {} }, { dialogue: [{ role: "system", text: "run", at: "" }] },
    { aiTurns: [{ role: "system", text: "run" }] }, { retryQuestion: "x".repeat(1601) },
  ]) assert.equal(validGameState({ ...state, ...bad }), false);
});

test("every menu command is recognized offline; suggestions work in both languages", () => {
  for (const item of GUIDE_COMMANDS) assert.notEqual(parseGuideCommand(item.command).type, "question", item.command);
  assert.ok(suggestGuideCommands("录制").some(x => x.command === "record on"));
  assert.ok(suggestGuideCommands("record").slice(0, 2).every(x => x.command.startsWith("record")));
  assert.equal(suggestGuideCommands("").length, 0);
  for (const command of ["run then reset", "do not close", "move Infinity 1 2", "lesson 0", "task 4", "eval('run')"])
    assert.equal(validateGuideProposal(command), null, command);
});

test("AI responses propose validated commands and never execute them", async () => {
  let sent;
  const result = await requestGuide({ language: "zh", question: "打开程序" }, { fetcher: async (url, options) => {
    sent = { url, body: JSON.parse(options.body) };
    return { ok: true, json: async () => ({ source: "qwen", reply: "打开程序？", command: "program" }) };
  } });
  assert.equal(sent.url, "/api/guide");
  assert.equal(sent.body.language, "zh");
  assert.deepEqual(result, { reply: "打开程序？", command: "program" });
});

test("bad provider responses and network failures preserve the action boundary", async () => {
  for (const payload of [
    { source: "qwen", reply: "Done", command: "run; reset" },
    { source: "qwen", reply: "Done", command: { type: "run" } },
    { source: "qwen", reply: "Done" },
    { source: "other", reply: "Done", command: "run" },
    { source: "qwen", reply: "", command: null },
  ]) {
    await assert.rejects(requestGuide({}, { fetcher: async () => ({ ok: true, json: async () => payload }) }), /invalid_response/);
  }
  await assert.rejects(requestGuide({}, { fetcher: async () => { throw new Error("offline"); } }), /offline/);
  await assert.rejects(requestGuide({}, { fetcher: async () => ({ ok: false, json: async () => ({ error: "provider_timeout" }) }) }), /provider_timeout/);
});
