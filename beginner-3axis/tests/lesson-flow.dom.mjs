import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
const { JSDOM } = await import(process.env.BNTA_JSDOM_PATH || "jsdom");
const dom = new JSDOM(readFileSync(new URL("../index.html", import.meta.url), "utf8"), { url: "http://localhost/beginner-3axis/", pretendToBeVisual: true });
const w = dom.window, queue = new Map();
let now = 0, sequence = 0, apiCalls = 0;
w.requestAnimationFrame = fn => { queue.set(++sequence, fn); return sequence; };
w.cancelAnimationFrame = id => queue.delete(id);
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
globalThis.fetch = async (url, options) => {
  const online = process.env.BNTA_MOCK_AI === "1";
  if (String(url).endsWith("/status")) return { ok: true, json: async () => ({ configured: online, source: "qwen" }) };
  apiCalls++;
  assert.ok(online, "offline lessons must not request AI");
  const payload = JSON.parse(options.body);
  assert.ok(payload.context.lessonPhase);
  return { ok: true, json: async () => ({ source: "qwen", reply: "Test AI: compare the observed motion with your prediction.", command: null }) };
};
const errors = [];
w.addEventListener("error", e => errors.push(e.error || e.message));
const hook = registerHooks({ resolve(specifier, context, next) {
  return specifier === "three" ? { url: new URL("../vendor/three/build/three.module.js", import.meta.url).href, shortCircuit: true } : next(specifier, context);
} });
await import("../main.mjs"); hook.deregister();
const $ = id => document.getElementById(id);
const saved = () => JSON.parse(localStorage.getItem("bnta3axis:v1"));
const attempt = () => saved().game.runs.find(a => a.id === saved().game.active);
const settle = () => new Promise(r => setTimeout(r, 0));
function send(text) {
  $("guide-command").value = text;
  $("guide-composer").dispatchEvent(new w.Event("submit", { cancelable: true }));
}
function advance(ms = 40000) {
  for (let i = 0; i < ms; i += 100) {
    now += 100;
    const callbacks = [...queue.values()]; queue.clear(); callbacks.forEach(fn => fn(now));
  }
}
function button(command) {
  const b = [...document.querySelectorAll("[data-lesson-command]")].find(x => x.dataset.lessonCommand === command);
  assert.ok(b, "visible lesson action " + command);
  b.click();
}
function reset() {
  send("reset");
  const b = [...document.querySelectorAll(".game-help-dialog button")].find(x => x.textContent === "Reset scene");
  assert.ok(b); b.click();
}
function prepare() {
  send("prepare");
  if ($("lesson-confirm-prepare") && document.querySelector(".game-help-dialog").open) $("lesson-confirm-prepare").click();
}
function move(p) {
  send(`move ${p.x} ${p.y} ${p.z}`);
  advance(6000);
}
const { fk } = await import("../model.mjs");
const { practiceRoute } = await import("../curriculum.mjs");
const { teachingRoute } = await import("../planner.mjs");
const { parseProgressFile, exportPortfolio } = await import("../storage.mjs");
await settle();
for (let index = 0; index < 6; index++) {
  send(`lesson ${index + 1}`); button("begin");
  assert.equal(attempt().flow.stage, "words");
  assert.match($("game-guide").textContent, /1\/4/);
  send("word 1");
  assert.equal(attempt().flow.visited.length, 1);
  button("tour");
  assert.equal(attempt().flow.stage, "tour");
  $("game-panel-controls").click();
  advance(100);
  assert.equal(document.querySelector(".game-sheets").dataset.activePanel, "controls", "manual panel choice survives rendering");
  $("game-panel-guide").click();
  button("practice");
  assert.equal(attempt().flow.awaiting, "prediction");
  assert.equal(document.querySelector("#game-guide textarea"), null, "lesson answers use the shared composer");
  $("guide-command").value = "My draft prediction";
  $("guide-command").dispatchEvent(new w.Event("input"));
  send("/ask Which observation should I make?");
  await settle();
  assert.equal(attempt().prediction, "");
  assert.equal(attempt().flow.draft, "My draft prediction");
  send("cancel");
  assert.equal(attempt().flow.awaiting, null);
  send("answer");
  assert.equal($("guide-command").value, "My draft prediction");
  send("I predict the movement will follow the demonstrated path.");
  assert.ok(attempt().prediction);
  assert.equal(attempt().flow.awaiting, null);
  if (index === 0) {
    for (let i = 1; i <= 5; i++) send(`choose ${i}`);
    assert.equal(Object.keys(attempt().flow.jobs).length, 5);
  } else {
    prepare();
    assert.equal(attempt().flow.setup, true);
    if (index === 1) { button("j1 +10"); advance(2000); }
    if (index === 2) {
      const p = fk(saved().scene.actualJoints).C;
      move({ ...p, z: p.z + 10 });
      send("inspect");
      assert.match($("game-guide").textContent, /Joint changes/);
      send("calculate");
      assert.equal(attempt().flow.awaiting, "calculation");
      send("0 0 0");
      assert.equal(attempt().flow.awaiting, "calculation", "bad calculation must remain editable");
      const m = attempt().measurement;
      send(`${m.to.z - m.from.z} ${m.distance} ${m.distance / m.seconds}`);
      assert.ok(attempt().flow.checks.calculated);
    }
    if (index >= 3) {
      if (index === 4) { reset(); send("record on"); }
      const route = index === 3 ? practiceRoute("grip", saved().scene) :
        index === 5 ? practiceRoute("obstacle", saved().scene) : teachingRoute(saved().scene);
      for (const step of route) {
        if (step.type === "move") move(step.targetMm);
        else { send(step.gripperState === "closed" ? "close" : "open"); advance(300); }
      }
      if (index === 4) {
        send("record off"); reset();
        assert.equal($("run").textContent, "Run", "lesson playback must not advertise an automatic reset");
        send("run"); send("pause"); send("stop"); reset(); send("run"); advance(100000);
        assert.ok(attempt().flow.checks.transfer, JSON.stringify({ checks: attempt().flow.checks, scene: saved().scene, steps: saved().program?.steps, message: $("game-guide").textContent.slice(-1800) }));
        send("program note"); send("The start state differed; I reset and the next replay completed.");
      }
      if (index === 5) {
        assert.ok(attempt().flow.checks.blocked && attempt().flow.checks.deliveryA);
        send("changed task");
        if ($("lesson-confirm-prepare") && document.querySelector(".game-help-dialog").open) $("lesson-confirm-prepare").click();
        assert.equal(attempt().flow.changed, true);
        const beforeCalls = apiCalls;
        send("/ask Give me a route to B."); await settle();
        assert.equal(apiCalls, beforeCalls, "independent task gets no AI hints");
        send("tour");
        assert.equal(attempt().flow.stage, "practice", "tour cannot bypass the independent task");
        assert.equal(document.querySelector(".lesson-targets"), null, "no target shortcuts in independent task");
        send("record on");
        for (const step of teachingRoute(saved().scene)) {
          if (step.type === "move") move(step.targetMm);
          else { send(step.gripperState === "closed" ? "close" : "open"); advance(300); }
        }
        send("record off"); reset(); send("run"); advance(100000);
        assert.ok(attempt().flow.checks.deliveryB);
      }
    }
  }
  send("reflect");
  assert.equal(attempt().flow.awaiting, "reflection", `lesson ${index + 1} needs reflection`);
  send("I compared my prediction with the observed result and can explain the difference.");
  assert.equal(attempt().flow.stage, "complete");
  assert.match($("game-guide").textContent, /practice verified and reflection saved/);
  assert.equal(parseProgressFile(JSON.stringify(saved())).ok, true, "completed lesson remains exportable");
  console.log(`Lesson ${index + 1} four-stage DOM journey PASS`);
}
send("lessons");
assert.equal(document.querySelectorAll(".guide-menu-choice").length, 6);
assert.equal(saved().game.runs.filter(a => a.flow?.stage === "complete").length, 6);
assert.equal(apiCalls, process.env.BNTA_MOCK_AI === "1" ? 6 : 0);
const portfolio = exportPortfolio(saved());
assert.equal(portfolio.ok, true);
assert.match(portfolio.value.text, /Problem and improvement: The start state differed/);
assert.match(portfolio.value.text, /Job choices \(ungraded\): \{"assembly"/);
assert.ok(portfolio.value.text.includes("Calculation: " + saved().game.runs.find(a => a.lesson === 2 && a.flow)?.flow.calculation));
assert.equal(errors.length, 0, errors.map(String).join("\n"));
console.log(`Six conversational lessons PASS (${process.env.BNTA_MOCK_AI === "1" ? "mocked AI" : "offline"}). No scores, no separate lesson answer fields, real practical evidence and export roundtrips.`);
w.close();
