// Uses the actual page, controller and storage. Providers are local test doubles.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
const { JSDOM } = await import(process.env.BNTA_JSDOM_PATH || "jsdom");
const dom = new JSDOM(readFileSync(new URL("../index.html", import.meta.url), "utf8"), {
  url: "http://localhost/beginner-3axis/", pretendToBeVisual: true,
});
const w = dom.window;
let now = 0, next = 0;
const callbacks = new Map();
w.requestAnimationFrame = fn => { callbacks.set(++next, fn); return next; };
w.cancelAnimationFrame = id => callbacks.delete(id);
w.matchMedia = () => ({ matches: false });
w.confirm = () => true;
w.HTMLCanvasElement.prototype.getContext = () => null;
w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
w.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new w.Event("close")); };
for (const k of ["window", "document", "localStorage", "HTMLElement", "HTMLCanvasElement", "Event"])
  globalThis[k] = k === "window" ? w : w[k];
globalThis.matchMedia = w.matchMedia;
globalThis.requestAnimationFrame = w.requestAnimationFrame;
globalThis.cancelAnimationFrame = w.cancelAnimationFrame;
let online = false, answer = { reply: "I can open Program.", command: "program" }, pending = null;
let requests = [];
globalThis.fetch = async (url, options) => {
  if (String(url).endsWith("/status")) return { ok: true, json: async () => ({ configured: online, source: "qwen" }) };
  requests.push(JSON.parse(options.body));
  if (!online) throw Error("offline");
  if (pending) return pending;
  return { ok: true, json: async () => ({ source: "qwen", ...answer }) };
};
const errors = [];
w.addEventListener("error", e => errors.push(e.error || e.message));
const hook = registerHooks({ resolve(specifier, context, next) {
  return specifier === "three" ? { url: new URL("../vendor/three/build/three.module.js", import.meta.url).href, shortCircuit: true } : next(specifier, context);
} });
await import("../main.mjs");
hook.deregister();
const $ = id => document.getElementById(id);
const settle = () => new Promise(resolve => setTimeout(resolve, 0));
const saved = () => JSON.parse(localStorage.getItem("bnta3axis:v1"));
function send(text) {
  $("guide-command").value = text;
  $("guide-composer").dispatchEvent(new w.Event("submit", { cancelable: true }));
}
function advance(ms = 20000) {
  for (let i = 0; i < ms; i += 100) {
    now += 100;
    const queue = [...callbacks.values()]; callbacks.clear();
    queue.forEach(fn => fn(now));
    if (i > 500 && $("game-stop").disabled) break;
  }
}
const panel = () => document.querySelector(".game-sheets").dataset.activePanel;
await settle();
assert.match($("guide-connection").textContent, /Offline/);
send("program"); assert.equal(panel(), "program");
assert.equal($("guide-composer").parentElement.className, "game-sheets");
send("controls"); assert.equal(panel(), "controls");
send("menu");
assert.ok([...document.querySelectorAll(".guide-menu-choice")].some(b => b.textContent === "All commands"));
send("target 150 0 140");
assert.equal($("target-x").value, "150");
const before = saved().scene.actualJoints;
send("Why might that be useful?");
assert.deepEqual(saved().scene.actualJoints, before);
assert.equal(requests.length, 0);
assert.ok($("guide-retry-question"));
online = true;
$("guide-retry-question").click(); await settle(); await settle();
assert.match($("guide-connection").textContent, /AI/);
assert.ok($("guide-confirm-command"));
assert.equal(panel(), "guide", "AI must not open Program without confirmation");
$("guide-confirm-command").click();
assert.equal(panel(), "program");

answer = { reply: "I can move to that position.", command: "move 150 0 140" };
send("Please go to the position we discussed."); await settle();
assert.deepEqual(saved().scene.actualJoints, before, "proposal must not move the robot");
$("guide-cancel-command").click();
assert.deepEqual(saved().scene.actualJoints, before);
send("Please go to that position."); await settle();
$("guide-confirm-command").click(); advance();
assert.notDeepEqual(saved().scene.actualJoints, before, "confirmed request uses real controller");
assert.ok(saved().game.dialogue.some(t => /Completed · TCP/.test(t.text)));

send("record on"); assert.equal(saved().recording?.enabled ?? $("record").checked, true);
send("record off"); assert.equal($("record").checked, false);
send("move 9000 0 0"); advance();
send("why");
assert.match($("game-guide").textContent, /reach|limit|range|target/i);

let release;
pending = new Promise(resolve => { release = resolve; });
send("Please open my recorded steps.");
send("language zh");
release({ ok: true, json: async () => ({ source: "qwen", reply: "Open Program?", command: "program" }) });
await settle(); pending = null;
assert.equal($("guide-confirm-command"), null, "changed context discards late proposals");
assert.equal(saved().language, "zh");
assert.match($("game-guide").textContent, /已改变/);

answer = { reply: "Open Program?", command: "program" };
send("请查看我的记录"); await settle();
assert.equal(requests.at(-1).language, "zh");
assert.ok($("guide-confirm-command"));
send("language en");
assert.equal($("guide-confirm-command"), null);

online = false;
send("Explain how the robot works."); await settle();
assert.match($("guide-connection").textContent, /Offline/);
assert.ok($("guide-retry-question"), "failed question remains retryable");
assert.equal(saved().game.retryQuestion, "Explain how the robot works.");
const { validGameState } = await import("../game-learning.mjs");
assert.equal(validGameState(saved().game), true, "the conversation and unanswered question can be restored");
send("jog"); assert.equal($("mode-jog").getAttribute("aria-pressed"), "true");
send("program"); assert.equal(panel(), "program");
send("stop"); assert.equal($("guide-confirm-command"), null);
send("language zh");
$("guide-command").value = "录制";
$("guide-command").dispatchEvent(new w.Event("input"));
assert.ok($("guide-suggestions").children.length >= 2);
$("guide-suggestions").firstChild.click();
assert.equal($("guide-command").value, "record on");
assert.equal($("record").checked, false, "suggestion fills input, not executes");
send("history");
assert.match(document.querySelector(".game-help-dialog").textContent, /Why might that be useful/);
assert.equal(errors.length, 0, errors.map(String).join("\n"));
console.log("Guide DOM PASS: offline operations, bilingual menus, confirmed AI movement, stale replies, failure fallback, retry and history.");
w.close();
