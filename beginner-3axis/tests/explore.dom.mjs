/** DOM integration only. No browser, pixels, layout, WebGL or touch acceptance claim. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
const { JSDOM } = await import(process.env.BNTA_JSDOM_PATH || "jsdom");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const dom = new JSDOM(html, {
    url: "http://localhost/bnta-robotics/beginner-3axis/",
    pretendToBeVisual: true,
  }),
  w = dom.window;
let now = 0,
  next = 0,
  callbacks = new Map();
w.requestAnimationFrame = (fn) => {
  callbacks.set(++next, fn);
  return next;
};
w.cancelAnimationFrame = (id) => callbacks.delete(id);
w.matchMedia = () => ({ matches: false });
w.confirm = () => true;
w.HTMLCanvasElement.prototype.getContext = () => null;
w.HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};
w.HTMLDialogElement.prototype.close = function () {
  this.open = false;
  this.dispatchEvent(new w.Event("close"));
};
for (const k of [
  "window",
  "document",
  "localStorage",
  "HTMLElement",
  "HTMLCanvasElement",
  "Event",
])
  globalThis[k] = k === "window" ? w : w[k];
globalThis.matchMedia = w.matchMedia;
globalThis.requestAnimationFrame = w.requestAnimationFrame;
globalThis.cancelAnimationFrame = w.cancelAnimationFrame;
const hook = registerHooks({
  resolve(specifier, context, next) {
    return specifier === "three"
      ? {
          url: new URL("../vendor/three/build/three.module.js", import.meta.url)
            .href,
          shortCircuit: true,
        }
      : next(specifier, context);
  },
});
const errors = [];
w.addEventListener("error", (e) => errors.push(e.error || e.message));
await import("../main.mjs");
hook.deregister();
const $ = (id) => w.document.getElementById(id),
  click = (id) => {
    assert.ok(!$(id).disabled, `${id} must be enabled`);
    $(id).click();
  },
  change = (id, value) => {
    $(id).value = value;
    $(id).dispatchEvent(new w.Event("input", { bubbles: true }));
  };
function advance(ms) {
  for (let elapsed = 0; elapsed < ms; elapsed += 100) {
    now += 100;
    const pending = [...callbacks.values()];
    callbacks.clear();
    pending.forEach((fn) => fn(now));
  }
}
const saved = () => JSON.parse(w.localStorage.getItem("bnta3axis:v1"));

assert.equal(document.body.dataset.mode, "explore");
assert.equal(document.body.dataset.exercise, "sandbox");
assert.equal($("learn").textContent, "Start lessons");
change("target-x", "999");
click("move");
assert.match($("feedback").textContent, /beyond/);
change("target-x", "163.9");
assert.doesNotMatch($("feedback").textContent, /beyond/);
assert.match($("feedback").textContent, /Path checked/);
click("exercise-reach");
click("explore");
assert.equal($("exercise-bar").hidden, false);
assert.equal($("record").checked, false);
assert.equal(saved().scene.objects.length, 0);
click("record");
change("target-z", "140");
click("move");
advance(16000);
const dest = saved().scene.fixtures.find(
  (f) => f.id === "destinationA",
).targetPosition;
for (const axis of ["x", "y", "z"])
  change("target-" + axis, String(dest[axis]));
click("move");
advance(16000);
assert.match($("run").textContent, /Reset & test/);
assert.equal(saved().program.steps.length, 2);
click("run");
assert.equal($("record").checked, false);
assert.match($("exercise-status").textContent, /Testing/);
assert.equal(Number($("target-z").value), 140);
advance(200);
click("pause");
assert.match($("exercise-status").textContent, /Paused/);
const paused = $("current").textContent;
advance(500);
assert.equal($("current").textContent, paused);
click("run");
advance(22000);
assert.match($("exercise-status").textContent, /Complete/);
assert.ok(saved().exercise.results.reach);
assert.equal(Number($("target-z").value), 80);
assert.equal(saved().program.steps.length, 2);
click("run");
advance(25000);
assert.equal(saved().program.steps.length, 2);
click("exercise-transfer");
assert.equal($("lesson-switch-dialog").open, true);
click("cancel-lesson-switch");
assert.equal(saved().program.steps.length, 2);
click("exercise-transfer");
click("confirm-lesson-switch");
assert.equal(saved().exercise.taskId, "transfer");
assert.equal(saved().program.steps.length, 0);
assert.ok(saved().exercise.results.reach);
const { teachingRoute } = await import("../planner.mjs");
for (const id of ["transfer", "obstacle"]) {
  if (id === "obstacle") {
    click("exercise-obstacle");
    click("confirm-lesson-switch");
  }
  const route = teachingRoute(saved().scene);
  click("record");
  for (const action of route) {
    if (action.type === "move") {
      for (const axis of ["x", "y", "z"])
        change("target-" + axis, String(action.targetMm[axis]));
      click("move");
      advance(18000);
    } else click(action.gripperState === "open" ? "open" : "close");
  }
  assert.equal(saved().program.steps.length, 9);
  click("run");
  advance(60000);
  assert.match($("exercise-status").textContent, /Complete/);
  assert.ok(saved().exercise.results[id]);
  assert.doesNotMatch($("feedback").textContent, /does not match/);
}
click("language");
$("language").value = "zh";
$("language").dispatchEvent(new w.Event("change"));
assert.match($("exercise-status").textContent, /已完成/);
assert.match($("exercise-obstacle").textContent, /绕开/);
click("learn");
assert.equal($("exercise-bar").hidden, true);
assert.equal(errors.length, 0, errors.join("\n"));
w.dispatchEvent(new w.Event("pagehide"));
console.log(
  "PASS: all three Explore tasks, recording, reset-and-test, pause/resume, repeat replay, cancel/confirm task switch, retained JSON results, Chinese labels, Learn separation. DOM only.",
);
