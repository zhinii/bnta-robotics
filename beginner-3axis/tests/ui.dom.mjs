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
click("learn");
assert.equal($("record").checked, false);
assert.match($("scene").textContent, /WebGL2/);
assert.ok($("move").textContent);
const initial = $("current").textContent;
for (const name of ["trail", "path"]) {
  assert.equal($(name).type, "checkbox");
  assert.ok($("scene").contains($(name)));
  click(name);
  assert.equal($(name).checked, false);
  assert.equal($(name).getAttribute("aria-pressed"), "false");
  click(name);
  assert.equal($(name).checked, true);
}
assert.equal($("current").textContent, initial);
assert.equal($("record").checked, false);
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
const { LESSON_UNITS } = await import("../lesson-units.mjs");
const { LessonDemo } = await import("../curriculum.mjs");
const chooseLesson = (id) => {
  if ($(`lesson-${id}`).getAttribute("aria-current") === "step")
    click("new-attempt");
  else click(`lesson-${id}`);
  if ($("lesson-switch-dialog").open) click("confirm-lesson-switch");
  assert.equal($("lesson-select").hidden, true);
  assert.equal(document.querySelectorAll(".lesson-navigation").length, 1);
  assert.equal(
    document.querySelectorAll(
      ".lesson-footer, #unit-next, #unit-previous, #type-next, #type-previous",
    ).length,
    0,
  );
  assert.ok(
    document.querySelector(".lesson-navigation").contains($("phase-next")),
  );
  assert.equal($("lesson-nav").children.length, 7);
  assert.equal($(`lesson-${id}`).getAttribute("aria-current"), "step");
  assert.equal(
    $("lesson-nav").querySelectorAll('[aria-current="step"]').length,
    1,
  );
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
  if (id !== "types") {
    click("phase-next");
    for (const [index, unit] of LESSON_UNITS[id].entries()) {
      assert.equal(document.body.dataset.phase, "understand");
      assert.ok($("lesson-unit").textContent.includes(unit.title.en));
      assert.equal($("lesson-content").hidden, true);
      click("watch-example");
      assert.equal(document.body.dataset.phase, "watch");
      assert.equal(document.querySelector(".scene-card").hidden, true);
      if (id !== "design") {
        const probe = new LessonDemo(id, unit.kind);
        assert.equal(
          $("lesson-demo-sequence").querySelectorAll("li").length,
          probe.commands.length,
        );
        probe.dispose();
        advance(32);
        assert.equal(
          $("lesson-demo-sequence").querySelectorAll('[aria-current="step"]')
            .length,
          1,
        );
        assert.match($("lesson-demo-sequence").textContent, /NOW 1/);
        assert.equal($("lesson-demo-sequence").dataset.state, "playing");
        if (index === 0) {
          click("stop-example");
          assert.equal($("stop-example").hidden, true);
          assert.equal($("watch-example").disabled, false);
          assert.equal($("lesson-demo-sequence").dataset.state, "stopped");
          assert.match(
            $("lesson-demo-sequence").textContent,
            /Example stopped/,
          );
          click("watch-example");
        }
      }
      {
        assert.equal(
          $(
            id === "anatomy"
              ? "anatomy-scene"
              : id === "coordinates"
                ? "coordinate-scene"
                : "task-preview-scene",
          ).closest("figure").hidden,
          false,
        );
        assert.equal($("phase-watch").hidden, true);
        advance(120000);
        if (id !== "design") {
          assert.match(
            $("lesson-demo-sequence").textContent,
            /Example complete/,
          );
          assert.equal($("lesson-demo-sequence").dataset.state, "done");
          assert.equal(
            $("lesson-demo-sequence").querySelectorAll(
              'li:not([data-state="complete"])',
            ).length,
            0,
          );
        }
        if (id === "coordinates" && index === 1)
          assert.match($("example-pane").textContent, /Worked example:.*mm\/s/);
      }
      assert.ok($("example-pane").textContent.includes(unit.demo.en));
      click("phase-next");
    }
    assert.equal(document.body.dataset.phase, "try");
    click("phase-vocabulary");
    click("phase-next");
    click("phase-vocabulary");
  }
};
const predict = () => {
  click("phase-try");
  const practical = ["grip", "program", "obstacle"].includes(
    saved().learning.currentLessonId,
  );
  if (practical) {
    assert.equal(
      $("lesson-practical").hidden,
      false,
      "See the task before writing",
    );
    assert.equal($("practical-prediction").hidden, false);
    assert.equal($("focused-controls").hidden, true);
    assert.equal($("assessment-operate").disabled, true);
    click("save-prediction");
    assert.match(
      $("practical-prediction-status").textContent,
      /Write your prediction/,
    );
    assert.equal(document.activeElement, $("prediction"));
  }
  change(
    "prediction",
    "I predict the requested movement and will check actual feedback.",
  );
  click("save-prediction");
  if (practical) {
    assert.equal($("practical-prediction").hidden, true);
    assert.equal($("focused-controls").hidden, false);
    assert.equal($("reflection-pane").hidden, true);
    assert.equal($("assessment-operate").disabled, false);
    const evidenceCount = saved().learning.evidenceEvents.length;
    click("assessment-predict");
    assert.equal($("prediction").readOnly, true);
    assert.equal($("save-prediction").hidden, true);
    click("return-to-operation");
    assert.equal($("focused-controls").hidden, false);
    assert.equal(
      saved().learning.evidenceEvents.length,
      evidenceCount,
      "Re-reading a prediction must not create new evidence",
    );
  }
};
const reflect = () => {
  click("phase-review");
  if (
    ["grip", "program", "obstacle"].includes(saved().learning.currentLessonId)
  ) {
    assert.equal($("reflection-pane").hidden, false);
    assert.equal($("reflection-pane").open, true);
    assert.ok(
      $("reflection").closest("label").querySelector("span").textContent
        .length > 35,
      "Question and answer box are one labelled field",
    );
    assert.equal($("save-reflection").textContent, "Save explanation");
  }
  change(
    "reflection",
    "I compared the actual result with my prediction and revised the sequence.",
  );
  click("save-reflection");
  if (
    ["grip", "program", "obstacle"].includes(saved().learning.currentLessonId)
  ) {
    assert.match($("practical-reflection-status").textContent, /saved/i);
  }
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
    id === "anatomy"
      ? ["Vocabulary", "Parts in motion", "Demo", "Assessment"]
      : ["Vocabulary", "Concept & example", "Demo", "Assessment"],
  );
  click("phase-understand");
  assert.equal($("lesson-vocabulary").hidden, true);
  assert.equal(document.querySelector(".scene-card").hidden, true);
  if (id === "types") {
    assert.equal($("lesson-content").querySelectorAll("details").length, 0);
    assert.equal($("course-focus-after-assessment").hidden, true);
    assert.equal($("robot-type-stage").dataset.robotType, "articulated");
    click("phase-next");
    assert.equal(document.body.dataset.phase, "understand");
    assert.equal($("robot-type-stage").dataset.robotType, "cartesian");
    $("type-simulations").dispatchEvent(
      new w.KeyboardEvent("keydown", { bubbles: true, key: "ArrowLeft" }),
    );
    assert.equal($("robot-type-stage").dataset.robotType, "articulated");
    for (const [index, type] of [
      "articulated",
      "cartesian",
      "scara",
      "delta",
      "mobile",
    ].entries()) {
      assert.equal(saved().learning.presentation.robotTypeIndex, index);
      assert.equal($("robot-type-stage").dataset.robotType, type);
      assert.equal(document.querySelector(".robot-slide-media").hidden, false);
      assert.equal(document.querySelector(".robot-slide-facts").hidden, false);
      click("type-play");
      advance(120000);
      click("phase-next");
    }
    assert.equal(document.body.dataset.phase, "try");
    click("phase-back");
    assert.equal(document.body.dataset.phase, "understand");
    assert.equal($("robot-type-stage").dataset.robotType, "mobile");
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
      assert.equal(document.body.dataset.phase, "understand");
      assert.equal(
        $("robot-type-stage").dataset.robotType,
        button.dataset.robotType,
      );
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
    click("phase-vocabulary");
    advance(500);
    const paused = $("type-progress").value;
    advance(1500);
    assert.equal($("type-progress").value, paused);
    click("phase-watch");
  } else {
    assert.equal(
      document.querySelector(".scene-card").hidden,
      id === "anatomy",
    );
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
    assert.equal($("anatomy-operation").hidden, false);
    click("anatomy-turn-plus");
    advance(5000);
  }
  click("phase-review");
  if (id === "types") {
    assert.equal($("assessment-demos").hidden, false);
    click("phase-try");
    assert.match(
      $("task-description").textContent,
      /five robot types and their 3D demos/,
    );
    const draft = $("answer-form").querySelector('[name="scenario-assembly"]');
    draft.value = "articulated";
    for (const b of $("assessment-demos").querySelectorAll("button")) {
      b.click();
      assert.equal(document.body.dataset.phase, "watch");
      assert.equal(
        $("robot-type-stage").dataset.robotType,
        b.dataset.revisitType,
      );
      assert.equal($("return-to-assessment").hidden, false);
      assert.match($("phase-next").textContent, /Return to assessment/);
      click(
        b.dataset.revisitType === "mobile"
          ? "phase-next"
          : "return-to-assessment",
      );
      assert.equal(document.body.dataset.phase, "try");
      assert.equal(
        $("answer-form").querySelector('[name="scenario-assembly"]').value,
        "articulated",
      );
    }
  }
  if (id === "types") {
    const form = $("answer-form");
    form.querySelector('[name="scenario-assembly"]').value = "articulated";
    form.querySelector('[name="scenario-gantry"]').value = "articulated";
    form.querySelector('[name="scenario-pickPlace"]').value = "scara";
    form.querySelector('[name="scenario-sorting"]').value = "";
    form.querySelector('[name="scenario-delivery"]').value = "mobile";
    click("submit-answers");
    assert.match($("answer-feedback-summary").textContent, /3 of 5 correct/);
    assert.equal(
      form.querySelectorAll('[data-answer-state="review"]').length,
      2,
    );
    assert.equal(
      form.querySelector('[name="scenario-assembly"]').value,
      "articulated",
    );
    form.querySelector('[name="scenario-gantry"]').value = "cartesian";
    form
      .querySelector('[name="scenario-gantry"]')
      .dispatchEvent(new w.Event("change"));
    assert.match($("answer-feedback-summary").textContent, /unsubmitted edits/);
  } else {
    assert.equal(
      $("anatomy-scene").dataset.labels,
      "base,upper,J2,actuator,gripper,controller",
    );
    assert.equal(
      [...document.querySelectorAll(".anatomy-question")].filter(
        (e) => !e.hidden,
      ).length,
      1,
    );
    assert.deepEqual(
      [...$("answer-form").querySelector('select[name="base"]').options].map(
        (o) => o.textContent,
      ),
      ["Choose A–F", "A", "B", "C", "D", "E", "F"],
    );
    click("anatomy-question-next");
    assert.match($("anatomy-question-counter").textContent, /2 of 6/);
    click("anatomy-question-previous");
    click("submit-answers");
    assert.match($("answer-feedback-summary").textContent, /0 of 6 correct/);
  }
  for (const [key, value] of Object.entries(answers))
    $("answer-form").querySelector(
      `[name="${id === "types" ? `scenario-${value}` : key}"]`,
    ).value = id === "types" ? key : value;
  if (id === "anatomy") {
    change("reflection", "A joint rotates, while a link connects joints.");
    click("save-reflection");
  }
  click("submit-answers");
  assert.match(
    $("answer-feedback-summary").textContent,
    id === "types" ? /5 of 5 correct/ : /6 of 6 correct/,
  );
  if (id === "anatomy") {
    assert.equal(
      $("phase-next").disabled,
      false,
      "Saving reflection before submitting matches must not block next lesson",
    );
  }
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
assert.equal($("coordinate-operation").hidden, false);
const startZ = Number($("lesson-z-target").value);
change("lesson-z-target", String(startZ + 10));
click("lesson-z-move");
advance(5000);
click("inspect-joints");
click("phase-review");
const measurementMove = saved()
  .learning.evidenceEvents.filter((e) => e.type === "MOVE_COMPLETED")
  .at(-1);
change("calc-displacement", "0");
click("check-calculation");
assert.match($("calculation-status").textContent, /final Z/);
assert.equal($("reflection-pane").hidden, true);
change("calc-displacement", "10");
change("calc-distance", "10");
change("calc-speed", String(10 / (measurementMove.simulatedDurationMs / 1000)));
click("check-calculation");
reflect();
done("coordinates");
chooseLesson("grip");
predict();
for (const name of ["trail", "path"]) {
  const toggle = $(`practice-${name}`);
  assert.ok($("task-preview-scene").contains(toggle));
  assert.equal($("focused-controls").contains(toggle), false);
  toggle.click();
  assert.equal(toggle.checked, false);
  toggle.click();
  assert.equal(toggle.checked, true);
}
for (let i = 0; i < 2; i++) {
  click("use-practice-target");
  click("practice-move");
  advance(30000);
}
click("practice-close");
change("practice-z", String(Number($("practice-z").value) + 10));
click("practice-move");
advance(5000);
reflect();
done("grip");
function resetUi() {
  click("practice-reset");
}
function recordUiRoute() {
  $("practice-record").checked = true;
  $("practice-record").dispatchEvent(new w.Event("change"));
  for (let i = 0; i < 7; i++) {
    click("use-practice-target");
    click("practice-move");
    advance(30000);
    if (i === 1) click("practice-close");
    if (i === 5) click("practice-open");
  }
  $("practice-record").checked = false;
  $("practice-record").dispatchEvent(new w.Event("change"));
  resetUi();
  click("practice-run");
  assert.equal($("lesson-practical").dataset.playback, "true");
  click("practice-pause");
  assert.equal(
    $("lesson-practical").dataset.playback,
    "true",
    "Paused playback keeps the enlarged view",
  );
  click("practice-run");
  advance(120000);
  assert.equal($("lesson-practical").dataset.playback, "false");
}
chooseLesson("program");
predict();
resetUi();
recordUiRoute();
reflect();
done("program");
click("phase-next");
assert.equal($("lesson-switch-dialog").open, true);
click("cancel-lesson-switch");
assert.equal(saved().learning.currentLessonId, "program");
assert.equal($("six-axis").hidden, false);
assert.match($("six-axis").textContent, /six-axis arm/);
chooseLesson("obstacle");
predict();
for (let i = 0; i < 2; i++) {
  click("use-practice-target");
  click("practice-move");
  advance(30000);
}
click("practice-close");
const blockedCurrent = $("current").textContent;
click("use-practice-target");
click("practice-move");
advance(1000);
assert.equal($("current").textContent, blockedCurrent);
for (let i = 0; i < 4; i++) {
  click("use-practice-target");
  click("practice-move");
  advance(30000);
}
click("practice-open");
click("use-practice-target");
click("practice-move");
advance(30000);
reflect();
done("obstacle");
click("changed-target");
predict();
assert.equal($("hint").disabled, true);
assert.equal($("transfer-reference").hidden, false);
assert.match($("transfer-reference").textContent, /Place at B/);
assert.equal($("waypoints").hidden, true);
assert.equal($("coach-text").textContent, "Ready");
const { initialScene, teachingRoute } = await import("../planner.mjs");
const routeB = teachingRoute(
  initialScene({ obstacle: true, destination: "destinationB" }),
);
$("practice-record").checked = true;
$("practice-record").dispatchEvent(new w.Event("change"));
for (const command of routeB) {
  if (command.type === "move") {
    for (const axis of ["x", "y", "z"])
      change(`practice-${axis}`, String(command.targetMm[axis]));
    click("practice-move");
    advance(30000);
  } else
    click(
      command.gripperState === "closed" ? "practice-close" : "practice-open",
    );
}
$("practice-record").checked = false;
$("practice-record").dispatchEvent(new w.Event("change"));
resetUi();
click("practice-run");
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
click("save-design");
assert.equal(document.activeElement.name, "job");
assert.match($("design-question").textContent, /Who needs help/);
assert.match($("design-feedback").textContent, /Complete/);
const proposal = {
  interest: "making",
  bodyPlan: "articulated",
  job: "Move components between fixtures",
  benefit: "Reach around the work area",
  limit: "Orientation follows the arm",
};
for (const [key, value] of Object.entries(proposal))
  $("answer-form").querySelector(`[name="${key}"]`).value = value;
click("save-design");
reflect();
done("design");
assert.equal($("phase-next").disabled, false);
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
