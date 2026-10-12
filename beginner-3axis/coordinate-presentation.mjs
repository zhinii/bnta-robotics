import { createScene } from "./scene.mjs";
import { initialScene } from "./planner.mjs";
import { fk, radiansToDegrees } from "./model.mjs";

// A lesson-sized view of the same model, never a second source of learning evidence.
export function createCoordinatePreview() {
  const figure = document.createElement("figure");
  figure.className = "coordinate-preview";
  const host = document.createElement("div");
  host.id = "coordinate-scene";
  const readout = document.createElement("figcaption");
  figure.append(host, readout);
  const rest = initialScene();
  let renderer;
  return {
    figure,
    update(state = rest, language = "en") {
      renderer ??= createScene(host);
      renderer.update(state, null, {
        language,
        anatomyOnly: true,
        coordinateLesson: true,
        toolLabels: false,
        labels: true,
        labelIds: ["J2", "J3"],
        namedLabels: true,
        axes: true,
        ghost: false,
        path: false,
        trail: false,
      });
      const p = fk(state.actualJoints).C;
      readout.textContent = `TCP · X ${p.x.toFixed(1)} · Y ${p.y.toFixed(1)} · Z ${p.z.toFixed(1)} mm\nJ1 ${radiansToDegrees(state.actualJoints[0]).toFixed(1)}° · J2 ${radiansToDegrees(state.actualJoints[1]).toFixed(1)}° · J3 ${radiansToDegrees(state.actualJoints[2]).toFixed(1)}°`;
    },
  };
}

export function paginateScenarios(root, language) {
  const cards = [...root.querySelectorAll(".scenario-card")];
  const nav = document.createElement("nav");
  nav.className = "anatomy-question-nav";
  const previous = document.createElement("button"),
    next = document.createElement("button"),
    counter = document.createElement("span");
  previous.id = "scenario-previous";
  next.id = "scenario-next";
  previous.textContent = language === "zh" ? "← 上一题" : "← Previous";
  next.textContent = language === "zh" ? "下一题 →" : "Next →";
  nav.append(previous, counter, next);
  root.prepend(nav);
  let index = 0;
  function show(i) {
    index = Math.max(0, Math.min(cards.length - 1, i));
    cards.forEach((card, j) => (card.hidden = j !== index));
    counter.textContent =
      language === "zh"
        ? `情境 ${index + 1} / ${cards.length}`
        : `Scenario ${index + 1} of ${cards.length}`;
    previous.disabled = index === 0;
    next.disabled = index === cards.length - 1;
  }
  previous.onclick = () => show(index - 1);
  next.onclick = () => show(index + 1);
  root.addEventListener("review-answer", (e) => {
    const i = cards.findIndex((card) => card.contains(e.target));
    if (i >= 0) show(i);
  });
  show(0);
}
