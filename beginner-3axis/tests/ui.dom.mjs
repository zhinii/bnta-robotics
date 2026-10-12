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
assert.equal($("record").checked, false);
assert.match($("scene").textContent, /WebGL2/);
assert.ok($("move").textContent);
const initial = $("current").textContent;
click("plus-z");
assert.equal($("current").textContent, initial);
click("move");
advance(3000);
assert.notEqual($("current").textContent, initial);
assert.equal(saved().program.steps.length, 0);
click("steps");
click("reset");
click("close-steps");
$("record").checked = true;
$("record").dispatchEvent(new w.Event("change"));
click("route-toggle");
const moves = [...$("waypoints").querySelectorAll("button")];
for (let i = 0; i < moves.length; i++) {
  moves[i].click();
  click("move");
  advance(30000);
  if (i === 1) click("close");
  if (i === 5) click("open");
}
assert.equal(saved().program.steps.length, 9);
assert.equal(saved().scene.objects[0].supportedByFixtureId, "destinationA");
$("record").checked = false;
$("record").dispatchEvent(new w.Event("change"));
click("steps");
click("reset");
click("close-steps");
click("run");
advance(400);
click("pause");
const paused = $("current").textContent;
advance(10000);
assert.equal($("current").textContent, paused);
assert.match($("run").textContent, /Resume/);
click("run");
advance(90000);
assert.equal(saved().program.steps.length, 9);
assert.equal(saved().scene.objects[0].supportedByFixtureId, "destinationA");
click("steps");
const name = $("program-list").querySelector("input");
name.value = "Renamed locally";
name.dispatchEvent(new w.Event("change"));
click("clear");
click("cancel-clear");
assert.equal(saved().program.steps.length, 9);
click("reset");
click("close-steps");
click("run");
advance(400);
click("stop");
const stopped = $("current").textContent;
advance(5000);
assert.equal($("current").textContent, stopped);
click("steps");
click("reset");
click("close-steps");
const stable = $("current").textContent;
change("target-x", "");
assert.equal($("move").disabled, true);
change("target-x", "300");
click("move");
advance(1000);
assert.equal($("current").textContent, stable);
const before = saved().scene;
$("language").value = "zh";
$("language").dispatchEvent(new w.Event("change"));
assert.equal($("run").textContent, "运行");
assert.deepEqual(saved().scene, before);
assert.equal(errors.length, 0, errors.map(String).join("\n"));
assert.ok(!document.body.textContent.includes("[units.mm]"));
// Exercise the actual UI-to-controller-to-learning wiring for all seven lessons.
$("language").value = "en";
$("language").dispatchEvent(new w.Event("change"));
click("learn");
const chooseLesson = (id) => {
  $("lesson-select").value = id;
  $("lesson-select").dispatchEvent(new w.Event("change"));
};
const predict = () => {
  click("phase-try");
  change(
    "prediction",
    "I predict the requested movement and will check actual feedback.",
  );
  click("save-prediction");
};
const reflect = () => {
  click("phase-review");
  change(
    "reflection",
    "I compared the actual result with my prediction and revised the sequence.",
  );
  click("save-reflection");
};
const done = (id) =>
  assert.ok(
    ["completedWithHelp", "completedWithoutHints", "transferPassed"].includes(
      saved().learning.lessons[id].status,
    ),
    `${id}: ${JSON.stringify(saved().learning.lessons[id].attempts.at(-1).checks)}`,
  );
const { BODY_PLAN_ANSWERS, ANATOMY_ANSWERS } = await import("../lessons.mjs");
for (const [id, answers] of [
  ["types", BODY_PLAN_ANSWERS],
  ["anatomy", ANATOMY_ANSWERS],
]) {
  chooseLesson(id);
  assert.ok(
    $("lesson-content").textContent.includes(
      id === "types" ? "Morphology" : "physical sensors",
    ),
  );
  if (id === "types")
    assert.ok($("lesson-content").textContent.includes("Cobot"));
  for (const details of $("lesson-content").querySelectorAll("details"))
    details.open = true;
  predict();
  click("phase-watch");
  const exampleBefore = structuredClone(saved());
  click("watch-example");
  advance(120000);
  assert.deepEqual(
    saved().program,
    exampleBefore.program,
    "demonstrations must not write learner programs",
  );
  assert.deepEqual(
    saved().scene,
    exampleBefore.scene,
    "demonstrations must not move learner robot",
  );
  click("phase-try");
  if (id === "anatomy") {
    click("demo-toggle");
    const row = $("joint-controls").querySelector(".joint-row");
    row.querySelector('input[type="number"]').value = "10";
    row.querySelector("button").click();
    advance(5000);
    click("demo-toggle");
  }
  click("phase-review");
  for (const [key, value] of Object.entries(answers))
    $("answer-form").querySelector(`[name="${key}"]`).value = value;
  $("answer-form").querySelector("button").click();
  reflect();
  done(id);
}
chooseLesson("coordinates");
predict();
click("plus-z");
click("move");
advance(5000);
click("inspect-joints");
click("phase-review");
const measurementMove = saved()
  .learning.evidenceEvents.filter((e) => e.type === "MOVE_COMPLETED")
  .at(-1);
change("calc-displacement", "10");
change("calc-distance", "10");
change("calc-speed", String(10 / (measurementMove.simulatedDurationMs / 1000)));
click("check-calculation");
reflect();
done("coordinates");
chooseLesson("grip");
predict();
click("route-toggle");
for (const button of [...$("waypoints").querySelectorAll("button")].slice(
  0,
  2,
)) {
  button.click();
  click("move");
  advance(30000);
}
click("close");
click("plus-z");
click("move");
advance(5000);
reflect();
done("grip");
function resetUi() {
  click("steps");
  click("reset");
  click("close-steps");
}
function recordUiRoute() {
  $("record").checked = true;
  $("record").dispatchEvent(new w.Event("change"));
  if ($("waypoints").hidden) click("route-toggle");
  const buttons = [...$("waypoints").querySelectorAll("button")];
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].click();
    click("move");
    advance(30000);
    if (i === 1) click("close");
    if (i === 5) click("open");
  }
  $("record").checked = false;
  $("record").dispatchEvent(new w.Event("change"));
  resetUi();
  click("run");
  advance(120000);
}
chooseLesson("program");
predict();
resetUi();
recordUiRoute();
reflect();
done("program");
assert.equal($("six-axis").hidden, false);
assert.match($("six-axis").textContent, /six-axis arm/);
chooseLesson("obstacle");
predict();
click("route-toggle");
let path = [...$("waypoints").querySelectorAll("button")];
for (const button of path.slice(0, 2)) {
  button.click();
  click("move");
  advance(30000);
}
click("close");
const blockedCurrent = $("current").textContent;
path[5].click();
click("move");
advance(1000);
assert.equal($("current").textContent, blockedCurrent);
for (const button of path.slice(2, 6)) {
  button.click();
  click("move");
  advance(30000);
}
click("open");
path[6].click();
click("move");
advance(30000);
reflect();
done("obstacle");
click("changed-target");
predict();
assert.equal($("hint").disabled, true);
assert.equal($("waypoints").hidden, true);
assert.equal($("coach-text").textContent, "Ready");
const { initialScene, teachingRoute } = await import("../planner.mjs");
const routeB = teachingRoute(
  initialScene({ obstacle: true, destination: "destinationB" }),
);
$("record").checked = true;
$("record").dispatchEvent(new w.Event("change"));
for (const command of routeB) {
  if (command.type === "move") {
    for (const axis of ["x", "y", "z"])
      change(`target-${axis}`, String(command.targetMm[axis]));
    click("move");
    advance(30000);
  } else click(command.gripperState === "closed" ? "close" : "open");
}
$("record").checked = false;
$("record").dispatchEvent(new w.Event("change"));
resetUi();
click("run");
advance(120000);
reflect();
assert.equal(saved().learning.lessons.obstacle.status, "transferPassed");
assert.equal(saved().scene.objects[0].supportedByFixtureId, "destinationB");
const completedProgram = saved().program;
const completedScene = saved().scene;
chooseLesson("design");
assert.deepEqual(
  saved().program,
  completedProgram,
  "design reflection retains the tested program",
);
assert.deepEqual(
  saved().scene,
  completedScene,
  "design reflection retains the actual result",
);
predict();
click("phase-review");
const proposal = {
  interest: "making",
  bodyPlan: "articulated",
  job: "Move components between fixtures",
  benefit: "Reach around the work area",
  limit: "Orientation follows the arm",
};
for (const [key, value] of Object.entries(proposal))
  $("answer-form").querySelector(`[name="${key}"]`).value = value;
$("answer-form").querySelector("button").click();
reflect();
done("design");
const downloads = [];
w.HTMLAnchorElement.prototype.click = function () {
  downloads.push(this.download);
};
click("export-json");
click("export-text");
assert.deepEqual(downloads, [
  "bnta-three-axis-portfolio.json",
  "bnta-three-axis-portfolio.txt",
]);
assert.equal(errors.length, 0, errors.map(String).join("\n"));
console.log(
  "PASS: complete seven-lesson DOM journey, actual obstacle rejection, destination-B no-hint recorded replay, both local export actions.",
);
assert.ok(!$("plus-z").getAttribute("aria-label").includes("{"));
assert.equal($("steps-dialog").getAttribute("aria-labelledby"), "steps-title");
assert.equal(
  $("confirm-dialog").getAttribute("aria-labelledby"),
  "confirm-title",
);
chooseLesson("obstacle");
predict();
const restoreRaw = w.localStorage.getItem("bnta3axis:v1");
const lastId = Math.max(
  ...saved().learning.evidenceEvents.map(
    (e) => Number(String(e.id).replace("event-", "")) || 0,
  ),
);
w.dispatchEvent(new w.Event("pagehide"));
const reload = new JSDOM(html, {
    url: "http://localhost/bnta-robotics/beginner-3axis/",
    pretendToBeVisual: true,
  }),
  rw = reload.window;
rw.requestAnimationFrame = w.requestAnimationFrame;
rw.cancelAnimationFrame = w.cancelAnimationFrame;
rw.matchMedia = w.matchMedia;
rw.confirm = () => true;
rw.HTMLCanvasElement.prototype.getContext = () => null;
rw.HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};
rw.HTMLDialogElement.prototype.close = function () {
  this.open = false;
  this.dispatchEvent(new rw.Event("close"));
};
rw.localStorage.setItem("bnta3axis:v1", restoreRaw);
rw.localStorage.setItem("bnta-cargo-progress", "original-app-sentinel");
for (const k of [
  "window",
  "document",
  "localStorage",
  "HTMLElement",
  "HTMLCanvasElement",
  "Event",
])
  globalThis[k] = k === "window" ? rw : rw[k];
await import("../main.mjs?restore-case=1");
const r$ = (id) => rw.document.getElementById(id);
assert.equal(
  r$("prediction").value,
  JSON.parse(restoreRaw).learning.lessons.obstacle.attempts.at(-1).prediction,
);
r$("learn").click();
r$("steps").click();
r$("reset").click();
r$("close-steps").click();
const restored = JSON.parse(rw.localStorage.getItem("bnta3axis:v1"));
assert.equal(restored.scene.obstacles.length, 1);
assert.equal(restored.learning.currentLessonId, "obstacle");
assert.equal(r$("record").checked, false);
assert.ok(
  restored.learning.evidenceEvents.some(
    (e) => e.id.startsWith("event-") && Number(e.id.slice(6)) > lastId,
  ),
);
assert.equal(
  rw.localStorage.getItem("bnta-cargo-progress"),
  "original-app-sentinel",
);
rw.dispatchEvent(new rw.Event("pagehide"));
console.log(
  "PASS: DOM reload/reset restores obstacle lesson, preserves legacy storage, keeps recording OFF and uses fresh evidence IDs; teaching copy and dialog labels present.",
);
console.log(
  "PASS: DOM integration (fallback, preview/commit, 9-step record/reset/replay, pause/resume, stop/reset, rename/cancel-clear, invalid input, language state preservation). NOT browser/layout/WebGL acceptance.",
);
