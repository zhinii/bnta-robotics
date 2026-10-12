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
const moves = [
  ...$("waypoints").querySelectorAll("button:not(.glossary-term)"),
];
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
  const term = $("lesson-vocabulary").querySelector(".glossary-term");
  assert.ok(term, `${id} vocabulary must contain tappable terms`);
  const beforeGlossary = structuredClone(saved());
  term.click();
  assert.equal($("lesson-definition").hidden, false);
  assert.ok($("lesson-definition").querySelector("p").textContent.length > 12);
  document.querySelector(".definition-close").click();
  assert.equal($("lesson-definition").hidden, true);
  assert.deepEqual(
    saved(),
    beforeGlossary,
    "Looking up a definition must not change learning evidence or the robot",
  );
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
  assert.equal(document.querySelector(".scene-card").hidden, true);
  assert.equal($("lesson-vocabulary").hidden, false);
  assert.equal(document.querySelectorAll(".phase-nav > button").length, 4);
  assert.deepEqual(
    [...document.querySelectorAll(".phase-nav > button")].map(
      (b) => b.textContent,
    ),
    ["Vocabulary", "Concept", "Demo", "Assessment"],
  );
  click("phase-understand");
  assert.equal($("lesson-vocabulary").hidden, true);
  assert.equal(document.querySelector(".scene-card").hidden, true);
  if (id === "types") {
    assert.equal($("lesson-content").querySelectorAll("details").length, 0);
    assert.equal($("course-focus-after-assessment").hidden, true);
    click("type-next");
    assert.match($("robot-slide-title").textContent, /gantry/);
    $("type-simulations").dispatchEvent(
      new w.MouseEvent("pointerdown", {
        bubbles: true,
        clientX: 250,
        clientY: 100,
        button: 0,
      }),
    );
    $("type-simulations").dispatchEvent(
      new w.MouseEvent("pointerup", {
        bubbles: true,
        clientX: 100,
        clientY: 103,
        button: 0,
      }),
    );
    assert.equal($("robot-slide-title").textContent, "SCARA");
    $("type-simulations").dispatchEvent(
      new w.KeyboardEvent("keydown", { bubbles: true, key: "ArrowLeft" }),
    );
    assert.match($("robot-slide-title").textContent, /gantry/);
  }
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
  if (id === "types") {
    assert.equal(document.querySelector(".scene-card").hidden, true);
    assert.equal($("type-simulations").hidden, false);
    assert.equal($("watch-example").closest(".example-pane").hidden, true);
    for (const button of document.querySelectorAll("button[data-robot-type]")) {
      button.click();
      click("type-reset");
      const progressBefore = $("robot-type-stage").dataset.progress;
      click("type-play");
      advance(4000);
      click("type-play");
      assert.notEqual($("robot-type-stage").dataset.progress, progressBefore);
      const paused = $("type-progress").value;
      advance(1500);
      assert.equal($("type-progress").value, paused);
      change("type-progress", "500");
      assert.equal($("type-progress").value, "500");
      click("type-reset");
      assert.equal($("type-progress").value, "0");
    }
    click("type-play");
    advance(500);
    click("phase-understand");
    advance(500);
    const paused = $("type-progress").value;
    advance(1500);
    assert.equal($("type-progress").value, paused);
    click("phase-watch");
  } else {
    assert.equal(document.querySelector(".scene-card").hidden, false);
    click("watch-example");
  }
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
    row.querySelector("button:not(.glossary-term)").click();
    advance(5000);
    click("demo-toggle");
  }
  click("phase-review");
  for (const [key, value] of Object.entries(answers))
    $("answer-form").querySelector(`[name="${key}"]`).value = value;
  $("answer-form").querySelector("button:not(.glossary-term)").click();
  reflect();
  done(id);
  if (id === "types") {
    assert.equal($("course-focus-after-assessment").hidden, false);
    assert.match(
      $("course-focus-after-assessment").textContent,
      /three-axis articulated arm/,
    );
    click("phase-watch");
    assert.equal($("course-focus-after-assessment").hidden, true);
  }
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
for (const button of [
  ...$("waypoints").querySelectorAll("button:not(.glossary-term)"),
].slice(0, 2)) {
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
  const buttons = [
    ...$("waypoints").querySelectorAll("button:not(.glossary-term)"),
  ];
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
let path = [...$("waypoints").querySelectorAll("button:not(.glossary-term)")];
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
$("answer-form").querySelector("button:not(.glossary-term)").click();
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
