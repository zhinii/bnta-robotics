import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { JSDOM } from "jsdom";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
assert.equal(html, readFileSync(new URL("../quest-lab.html", import.meta.url), "utf8"), "course preview matches the default entry");
const dom = new JSDOM(html, { url: "http://localhost/beginner-3axis/", pretendToBeVisual: true });
const w = dom.window, queue = new Map(); let now = 0, sequence = 0, calls = 0;
w.HTMLCanvasElement.prototype.getContext = () => null;
w.requestAnimationFrame = fn => { queue.set(++sequence, fn); return sequence; };
w.cancelAnimationFrame = id => queue.delete(id);
for (const k of ["window", "document", "localStorage", "location", "HTMLElement", "HTMLCanvasElement", "Event"])
  globalThis[k] = k === "window" ? w : w[k];
globalThis.innerHeight = 800; globalThis.requestAnimationFrame = w.requestAnimationFrame; globalThis.cancelAnimationFrame = w.cancelAnimationFrame;
const online = process.env.BNTA_MOCK_AI === "1";
globalThis.fetch = async (url, options) => {
  if (String(url).endsWith("/status")) return { ok: true, json: async () => ({ configured: online }) };
  calls++; assert.ok(online, "offline flow never requires AI");
  const payload = JSON.parse(options.body); assert.ok(payload.context.lessonPhase && payload.lessonId);
  return { ok: true, json: async () => ({ source: "qwen", reply: "Compare the real motion with your prediction.", command: null }) };
};
const hook = registerHooks({ resolve(s, c, next) { return s === "three" ? { url: new URL("../vendor/three/build/three.module.js", import.meta.url).href, shortCircuit: true } : next(s, c); } });
await import("../quest-prototype.mjs"); hook.deregister();
const $ = id => document.getElementById(id), saved = () => JSON.parse(localStorage.getItem("bnta:quest-course:v1"));
const state = () => saved().course, attempt = () => state().portfolio.find(a => a.id === state().active);
async function send(text) { $("message").value = text; $("composer").dispatchEvent(new w.Event("submit", { cancelable: true })); await new Promise(r => setTimeout(r, 0)); }
function advance(ms = 8000) { for (let i = 0; i < ms; i += 100) { now += 100; const callbacks = [...queue.values()]; queue.clear(); callbacks.forEach(fn => fn(now)); } }
async function move(p) { await send(`move ${p.x} ${p.y} ${p.z}`); advance(); }
async function route(steps) { for (const s of steps) { if (s.type === "move") await move(s.targetMm); else { await send(s.gripperState === "closed" ? "close" : "open"); advance(300); } } }
async function reset() { await send("/reset"); await send("/reset confirmed"); }
const { fk } = await import("../model.mjs"), { practiceRoute } = await import("../curriculum.mjs"), { teachingRoute } = await import("../planner.mjs");
for (let i = 0; i < 6; i++) {
  await send(`lesson ${i + 1}`); assert.equal(attempt().flow.stage, "words");
  await send("word 1"); assert.equal(attempt().flow.visited.length, 1);
  await send("tour"); advance(500); assert.equal(attempt().flow.stage, "tour");
  await send("practice");
  if (i === 0) {
    for (let n = 1; n <= 5; n++) { await send(`robot ${n}`); advance(500); }
    await send("jobs"); assert.ok(document.querySelector(".scenario-picture svg"));
    for (let n = 1; n <= 5; n++) await send(`choose ${n}`);
  } else {
    assert.equal(attempt().flow.awaiting, "prediction");
    $("message").value = "My draft prediction"; $("message").dispatchEvent(new w.Event("input"));
    await send("/ask What should I observe?"); assert.equal(saved().draft, "My draft prediction");
    await send("cancel"); assert.equal(attempt().flow.awaiting, null);
    await send("answer"); assert.equal($("message").value, "My draft prediction");
    await send("I predict the movement follows the demonstrated path."); assert.equal(attempt().flow.setup, true);
    if (i === 1) { await send("j1 +10"); advance(); assert.ok(attempt().flow.checks.j1); }
    if (i === 2) {
      const p = fk(state().scene.actualJoints).C; await move({ ...p, z: p.z + 10 });
      assert.ok(attempt().flow.checks.up10); assert.match($("conversation").textContent, /Your actual move: displacement 10.00/);
      await send("inspect"); await send("calculate"); await send("0 0 0"); assert.equal(attempt().flow.awaiting, "calculation");
      const m = attempt().measurement; await send(`${m.to.z - m.from.z} ${m.distance} ${m.distance / m.seconds}`); assert.ok(attempt().flow.checks.calculated);
    }
    if (i === 3) { await route(practiceRoute("grip", state().scene)); assert.ok(attempt().flow.checks.lift10); }
    if (i === 4) {
      await reset(); await send("record on"); await route(teachingRoute(state().scene)); await send("record off");
      await send("steps"); assert.equal($("steps-list").children.length, 9);
      await reset(); await send("run"); await send("pause"); await send("stop"); await reset(); await send("run"); advance(100000);
      assert.ok(attempt().flow.checks.transfer, JSON.stringify(attempt().flow.checks));
      assert.equal(attempt().flow.awaiting, "programNote"); await send("I corrected the starting scene by resetting.");
    }
    if (i === 5) {
      await route(practiceRoute("obstacle", state().scene)); assert.ok(attempt().flow.checks.blocked && attempt().flow.checks.deliveryA);
      assert.ok(document.querySelector('#options [data-command="reflect"]'), "B is optional");
      await send("changed task"); assert.equal(attempt().flow.changed, true);
      const before = calls; await send("/ask Give me the B route"); await send("tour"); assert.equal(calls, before);
      assert.equal(attempt().flow.stage, "practice");
      const target = state().scene.target; await send("use target 1"); assert.deepEqual(state().scene.target, target);
      await send("record on"); await route(teachingRoute(state().scene)); await send("record off"); await reset(); await send("run"); advance(100000);
      assert.ok(attempt().flow.checks.deliveryB, JSON.stringify(attempt().flow.checks));
    }
  }
  await send("reflect"); assert.equal(attempt().flow.awaiting, "reflection", "lesson " + (i + 1));
  await send("I learned from comparing the demonstration and my own action."); assert.equal(attempt().flow.stage, "complete");
  console.log("Lesson " + (i + 1) + " PASS: words, tour, verified practice, saved reflection");
}
assert.equal(state().portfolio.filter(a => a.flow.stage === "complete").length, 6);
assert.equal(calls, online ? 5 : 0);
await send("lesson 7"); assert.match($("conversation").textContent, /Choose lesson 1–6/);
console.log(`Six lessons PASS (${online ? "mocked AI" : "offline"}); optional B, actual evidence, draft recovery and bilingual content.`);
w.close();
