/** DOM check for the game HUD layer only. Runs game-hud.mjs against the real index.html. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const { JSDOM } = await import(process.env.BNTA_JSDOM_PATH || "jsdom");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const dom = new JSDOM(html, {
    url: "http://localhost/bnta-robotics/beginner-3axis/",
    pretendToBeVisual: true,
  }),
  w = dom.window;
for (const k of ["document", "localStorage", "HTMLElement", "Event", "MutationObserver"])
  globalThis[k] = w[k];
globalThis.window = w;

await import("../game-hud.mjs");
const d = w.document;

const coach = d.querySelector(".coach-card");
assert.ok(coach, "coach card exists");
assert.ok(coach.classList.contains("nova-panel"), "coach card becomes the NOVA panel");
assert.ok(coach.open, "NOVA panel starts open like a dialogue box");
const avatar = d.querySelector(".nova-head img");
assert.ok(avatar, "NOVA avatar is injected");
assert.match(avatar.src, /nova-avatar\.png$/);
assert.equal(d.querySelector(".nova-name").textContent, "NOVA · GUIDE");

const objective = d.getElementById("hud-objective");
assert.ok(objective, "objective chip exists");
assert.match(objective.textContent, /◆/);

const state = d.getElementById("hud-state");
assert.ok(state, "robot state chip exists");

// Switching modes updates the objective text.
d.getElementById("learn").setAttribute("aria-pressed", "true");
d.getElementById("task-title").textContent = "Joints and axes";
await new Promise((r) => setTimeout(r, 30));
assert.match(objective.textContent, /LESSON · Joints and axes/);

// Explore exercise selection labels the objective as a challenge.
d.getElementById("learn").setAttribute("aria-pressed", "false");
w.document.body.dataset.exercise = "transfer";
await new Promise((r) => setTimeout(r, 30));
assert.match(objective.textContent, /CHALLENGE · Pick & place/);

// The sandbox maps to open design.
w.document.body.dataset.exercise = "sandbox";
await new Promise((r) => setTimeout(r, 30));
assert.match(objective.textContent, /OPEN DESIGN · Explore/);

console.log("game-hud DOM checks passed");
