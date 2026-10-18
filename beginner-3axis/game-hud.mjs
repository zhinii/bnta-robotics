// Game-style HUD layer (concept: World-of-Warcraft-inspired learning interface).
// Purely presentational: it observes the existing UI and mirrors state into
// NOVA's dialogue panel, the objective chip and the robot state chip. It never
// moves the robot, changes programs or grades anything.
import { EXERCISES } from "./exercises.mjs";

const $ = (sel, root = document) => root.querySelector(sel);
// rAF may be absent in non-browser harnesses (jsdom without pretendToBeVisual).
const raf =
  globalThis.requestAnimationFrame ?? ((fn) => setTimeout(fn, 0));

function lang() {
  const v = $("#language")?.value;
  return v === "zh" ? "zh" : "en";
}
const pick = (en, zh) => (lang() === "zh" ? zh : en);

// ---------- NOVA dialogue panel (restyles the existing coach card) ----------
function buildNovaPanel() {
  const coach = $(".coach-card");
  if (!coach || $(".nova-head", coach)) return;
  coach.classList.add("nova-panel");
  coach.setAttribute("open", "");
  const head = document.createElement("div");
  head.className = "nova-head";
  const img = document.createElement("img");
  img.src = new URL("./assets/nova-avatar.png", import.meta.url).href;
  img.alt = pick("NOVA, the panda lab guide", "熊猫向导 NOVA");
  img.width = 52;
  img.height = 52;
  const name = document.createElement("span");
  name.className = "nova-name";
  name.textContent = pick("NOVA · GUIDE", "NOVA · 向导");
  head.append(img, name);
  coach.appendChild(head);
}

// ---------- Objective chip (quest tracker) ----------
function buildObjectiveChip() {
  if ($("#hud-objective")) return;
  const chip = document.createElement("output");
  chip.id = "hud-objective";
  chip.setAttribute("aria-live", "polite");
  $("header")?.appendChild(chip);
}

function objectiveText() {
  const learningOn = $("#learning") && !$("#learning").hidden;
  const learn = $("#learn")?.getAttribute("aria-pressed") === "true";
  if (learn || learningOn) {
    const title = $("#task-title")?.textContent?.trim();
    return `◆ ${pick("LESSON", "课程")}${title ? " · " + title : ""}`;
  }
  const ex = EXERCISES.find((e) => e.id === document.body.dataset.exercise);
  if (ex && ex.id !== "sandbox")
    return `◆ ${pick("CHALLENGE", "挑战")} · ${lang() === "zh" ? ex.zh : ex.en}`;
  if (ex) return `◆ ${pick("OPEN DESIGN", "开放设计")} · ${lang() === "zh" ? ex.zh : ex.en}`;
  return `◆ ${pick("ROBOT LAB", "机器人实验室")}`;
}

// ---------- Robot state chip (party frame) ----------
function buildStateChip() {
  if ($("#hud-state")) return;
  const chip = document.createElement("output");
  chip.id = "hud-state";
  chip.setAttribute("aria-live", "polite");
  document.body.appendChild(chip);
}

function stateText() {
  const cur = $("#current")?.textContent?.trim();
  const joints = $("#joint-readout")?.textContent?.trim();
  const held = $("#held")?.textContent?.trim();
  return [cur, joints, held].filter(Boolean).join("  ·  ");
}

// ---------- Observers: mirror existing UI into the HUD ----------
function startHud() {
  buildNovaPanel();
  buildObjectiveChip();
  buildStateChip();

  let queued = false;
  const update = () => {
    queued = false;
    const obj = $("#hud-objective");
    if (obj) {
      const text = objectiveText();
      if (obj.textContent !== text) obj.textContent = text;
    }
    const st = $("#hud-state");
    if (st) {
      const text = stateText();
      if (st.textContent !== text) st.textContent = text;
    }
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    raf(update);
  };

  const watched = [
    $("#task-title"),
    $("#current"),
    $("#joint-readout"),
    $("#held"),
    $("#lesson-status"),
  ].filter(Boolean);
  for (const node of watched) {
    new MutationObserver(schedule).observe(node, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }
  for (const id of ["learn", "explore"]) {
    const btn = document.getElementById(id);
    if (btn)
      new MutationObserver(schedule).observe(btn, { attributes: true });
  }
  new MutationObserver(schedule).observe(document.body, {
    attributes: true,
    attributeFilter: ["data-exercise"],
  });
  $("#language")?.addEventListener("change", schedule);
  update();
}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", startHud, { once: true });
else startHud();
