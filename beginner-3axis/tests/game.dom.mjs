/** DOM integration only. No browser, pixels, layout, WebGL or touch acceptance claim. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
const { JSDOM } = await import(process.env.BNTA_JSDOM_PATH || "jsdom");
const html = readFileSync(new URL("../classic.html", import.meta.url), "utf8");
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
// Network is blocked for the entire DOM journey. Only the optional AI test
// substitutes a labelled local mock; no provider is contacted.
globalThis.fetch = async (url) => {
  if (process.env.BNTA_MOCK_AI === "1")
    return {
      ok: true,
      json: async () =>
        String(url).endsWith("/status")
          ? { configured: true, source: "qwen" }
          : {
              source: "qwen",
              reply: "Compare the observed tool position with your target. What would you change next?",
              command: null,
            },
    };
  throw new Error("offline test");
};
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
    if (elapsed >= 500 && document.getElementById("game-stop")?.disabled) break;
  }
}
const saved = () => JSON.parse(w.localStorage.getItem("bnta3axis:v1"));

const textButton = (text) => {
  const b = [...document.querySelectorAll("#game-guide button")].find(
    (b) => b.textContent === text,
  );
  assert.ok(b, "button " + text);
  b.click();
};
assert.equal(document.body.dataset.gameMode, "explore");
const panel = document.querySelector(".game-sheets");
assert.equal(panel.dataset.activePanel, "controls");
click("game-panel-program");
assert.ok($("steps-dialog").open);
assert.equal(panel.dataset.activePanel, "program");
click("game-panel-guide");
assert.equal($("steps-dialog").open, false);
assert.equal(panel.dataset.activePanel, "guide");
click("game-panel-controls");
assert.equal(panel.dataset.activePanel, "controls");
assert.ok(document.querySelector(".game-action-dock").contains($("move")));
assert.ok(document.querySelector(".game-action-dock").contains($("run")));
click("learn");
assert.equal(document.body.dataset.gameMode, "learn");
assert.equal(panel.dataset.activePanel, "guide");
textButton("Begin lesson");
assert.match($("game-guide").textContent, /Vocabulary/);
const activity = $("game-activity");
activity.value = "1";
activity.dispatchEvent(new w.Event("change"));
textButton("See the concept →");
textButton("Next concept →");
textButton("Next concept →");
textButton("Make a prediction →");

const input = document.querySelector("#game-guide textarea");
input.value = "The tool will rotate around the base.";
textButton("Save prediction & try");
assert.equal(saved().game.phase, "operate");
click("close");
advance(2000);
assert.ok(
  !document
    .querySelector("#game-guide")
    .textContent.includes("Required action recorded"),
);
click("mode-joints");

change("joint-1", "10");
click("joint-go-1");
advance(5000);
assert.match($("game-guide").textContent, /Required action recorded/);
textButton("Check understanding →");
textButton("Only the gripper closes");
textButton("Try again");
textButton("Only the gripper closes");
textButton("Try again");
textButton("Only the gripper closes");
assert.equal(
  [...document.querySelectorAll("#game-guide button")].find(
    (b) => b.textContent === "I understand →",
  ).disabled,
  true,
);
textButton("▶ Show explanation");
advance(120000);
textButton("I understand →");
const reflection = document.querySelector("#game-guide textarea");
reflection.value =
  "J1 rotates both links and the tool around the stationary base.";
textButton("Save evidence");
assert.match($("game-guide").textContent, /Assisted completion/);
assert.equal(saved().game.runs.at(-1).submissions.length, 3);
assert.equal(saved().game.runs.at(-1).evidence.length, 1);
click("explore");
click("game-save-position");
const program = structuredClone(saved().program);
click("learn");
activity.value = "0";
activity.dispatchEvent(new w.Event("change"));
textButton("See the concept →");
textButton("▶ Watch example");
advance(13000);
assert.equal(
  $("move").disabled,
  true,
  "demo models cannot operate learner arm",
);
textButton("Next concept →");
assert.deepEqual(saved().program, program);
click("game-design");
const fields = [...document.querySelectorAll("#game-guide textarea")];
fields[0].value = "Help students sort reusable classroom parts.";
fields[1].value = "Transfer one part into A and release it.";
for (const f of fields) f.dispatchEvent(new w.Event("change"));
textButton("Start designing");
const f = document.querySelector("#game-guide textarea");
f.value = "First trial only: the part is not delivered yet.";
f.dispatchEvent(new w.Event("change"));
textButton("Save design version");
textButton("Finish & reflect");
assert.equal(saved().game.design.phase, "finish");
assert.ok(saved().game.design.versions.length >= 1);
click("game-challenge");
activity.value = "reach";
activity.dispatchEvent(new w.Event("change"));
const confirm = [...document.querySelectorAll("dialog button")].find(
  (b) => b.textContent === "Set up task",
);
assert.ok(confirm);
confirm.click();
assert.equal(saved().exercise.taskId, "reach");

// Complete every remaining practical lesson via the same DOM controls.
const { teachingRoute } = await import("../planner.mjs");
const { GAME_LESSONS } = await import("../game-learning.mjs");
const moveTo = (p) => {
  click("mode-xyz");
  for (const axis of ["x", "y", "z"]) change("target-" + axis, String(p[axis]));
  click("move");
  advance(20000);
};
for (const index of [2, 3, 4, 5, 6]) {
  click("learn");
  activity.value = String(index);
  activity.dispatchEvent(new w.Event("change"));
  textButton("See the concept →");
  for (let n = 0; n < 8; n++) {
    const next = [...document.querySelectorAll("#game-guide button")].find(
      (b) => b.textContent === "Next concept →",
    );
    if (!next) break;
    next.click();
  }
  textButton("Make a prediction →");
  document.querySelector("#game-guide textarea").value =
    "I predict a reachable route if I leave clearance.";
  textButton("Save prediction & try");
  textButton("Prepare practice scene");
  click("game-confirm-practice");
  assert.equal(panel.dataset.activePanel, "controls");
  if (index === 2) {
    click("mode-jog");
    $("jog-step").value = "10";
    $("jog-step").dispatchEvent(new w.Event("change"));
    click("jog-z-plus");
    advance(5000);
  } else if (index === 3 || index === 5) {
    if (index === 5) click("record");
    for (const a of teachingRoute(saved().scene)) {
      if (a.type === "move") moveTo(a.targetMm);
      else {
        click(a.gripperState === "closed" ? "close" : "open");
        advance(500);
      }
    }
    if (index === 5) {
      click("run");
      advance(120000);
    }
  } else {
    click("record");
    moveTo({ x: 160, y: 0, z: 140 });
    moveTo({ x: 150, y: 20, z: 140 });
    click("run");
    advance(20000);
  }
  assert.match(
    $("game-guide").textContent,
    /Required action recorded/,
    `lesson ${index + 1} action`,
  );
  textButton("Check understanding →");
  textButton(GAME_LESSONS[index].options[0].en);
  textButton("I understand →");
  if (index === 2) {
    const m = saved().game.runs.at(-1).measurement,
      values = [m.to.z - m.from.z, m.distance, m.distance / m.seconds];
    [...document.querySelectorAll("#game-guide input")].forEach(
      (e, i) => (e.value = String(values[i])),
    );
    textButton("Check calculation");
  }
  document.querySelector("#game-guide textarea").value =
    "I compared the actual movement with my prediction and checked the final result.";
  textButton("Save evidence");
  assert.equal(saved().game.phase, "finish");
}
console.log("Game lessons 2–7 practical DOM journeys PASS");
if (process.env.BNTA_MOCK_AI === "1") {
  await new Promise((r) => setTimeout(r, 0));
  click("game-panel-guide");
  const before = JSON.stringify(saved().program),
    phase = saved().game.phase;
  const question = $("guide-command");
  question.value = "Why did this route work?";
  question.dispatchEvent(new w.Event("input"));
  $("guide-composer").dispatchEvent(new w.Event("submit", { cancelable: true }));
  await new Promise((r) => setTimeout(r, 0));
  assert.match(
    $("game-guide").textContent,
    /Compare the observed tool position/,
  );
  assert.equal(JSON.stringify(saved().program), before);
  assert.equal(saved().game.phase, phase);
}
assert.equal(errors.length, 0, errors.map(String).join("\n"));
console.log(
  "Game DOM: lesson progression, third-answer support, model/program preservation and design portfolio PASS",
);
