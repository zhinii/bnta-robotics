import { createScene } from "./scene.mjs";
import { initialScene } from "./planner.mjs";

export const ANATOMY_MARKERS = [
  { part: "base", label: "A", value: "base", id: "base", key: "base" },
  { part: "link", label: "B", value: "upper-arm", id: "upper", key: "upper" },
  { part: "joint", label: "C", value: "shoulder", id: "J2", key: "shoulder" },
  {
    part: "actuator",
    label: "D",
    value: "actuator",
    id: "actuator",
    key: "actuator",
  },
  {
    part: "endEffector",
    label: "E",
    value: "gripper",
    id: "gripper",
    key: "gripper",
  },
  {
    part: "controller",
    label: "F",
    value: "controller",
    id: "controller",
    key: "controller",
  },
];
const unitLabels = [
  ["base", "J1"],
  ["J2", "J3", "upper", "forearm"],
  ["controller", "actuator", "gripper"],
];
export function createAnatomyPreview() {
  const figure = document.createElement("figure");
  figure.className = "anatomy-preview";
  const host = document.createElement("div");
  host.id = "anatomy-scene";
  const caption = document.createElement("figcaption");
  figure.append(host, caption);
  let renderer,
    signature = "";
  const rest = initialScene();
  return {
    figure,
    update({
      state = rest,
      unit = 0,
      language,
      assessment = false,
      focusJoint,
    }) {
      renderer ??= createScene(host);
      const ids = assessment
        ? ANATOMY_MARKERS.map((m) => m.id)
        : unitLabels[unit];
      host.dataset.labels = ids.join(",");
      caption.textContent = assessment
        ? language === "zh"
          ? "用模型上的A–F回答。电机与控制器为教学示意。"
          : "Use labels A–F to answer. Motor and controller are teaching illustrations."
        : language === "zh"
          ? "拖动查看 · 只标出本概念的部件"
          : "Drag to inspect · labels show only this concept";
      renderer.update(state, null, {
        language,
        labels: true,
        namedLabels: true,
        labelIds: ids,
        anatomyOnly: true,
        axes: false,
        ghost: false,
        path: false,
        trail: false,
        labelLayout: {
          base: [0.24, 0.72],
          J1: [0.2, 0.53],
          upper: [0.32, 0.18],
          J2: [0.16, 0.43],
          J3: [0.65, 0.16],
          forearm: [0.83, 0.31],
          actuator: [0.47, 0.87],
          controller: [0.16, 0.89],
          gripper: [0.85, 0.61],
        },
        focusJoint,
        strings: assessment
          ? Object.fromEntries(ANATOMY_MARKERS.map((m) => [m.key, m.label]))
          : {},
      });
      const next = `${assessment}:${unit}`;
      if (signature !== next) {
        signature = next;
        renderer.home();
      }
    },
  };
}

export function buildAnatomyQuestions(root, tr, language) {
  const zh = language === "zh";
  const navigation = document.createElement("nav");
  navigation.className = "anatomy-question-nav";
  navigation.setAttribute("aria-label", zh ? "结构问题" : "Anatomy questions");
  const previous = document.createElement("button"),
    next = document.createElement("button"),
    counter = document.createElement("span");
  previous.textContent = zh ? "← 上一题" : "← Previous";
  next.textContent = zh ? "下一题 →" : "Next →";
  previous.id = "anatomy-question-previous";
  next.id = "anatomy-question-next";
  counter.id = "anatomy-question-counter";
  navigation.append(previous, counter, next);
  root.append(navigation);
  const cards = ANATOMY_MARKERS.map((marker) => {
    const card = document.createElement("section");
    card.className = "anatomy-question answer-card";
    const label = document.createElement("label"),
      title = document.createElement("span"),
      select = document.createElement("select");
    const partName =
      marker.part === "base"
        ? zh
          ? "底座"
          : "base"
        : tr(`anatomy.${marker.part}`).toLowerCase();
    title.textContent = zh
      ? `哪个字母标出${partName}？`
      : `Which letter marks the ${partName}?`;
    select.name = marker.part;
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = zh ? "选择A–F" : "Choose A–F";
    select.append(blank);
    for (const choice of ANATOMY_MARKERS) {
      const o = document.createElement("option");
      o.value = choice.value;
      o.textContent = choice.label;
      select.append(o);
    }
    label.append(title, select);
    card.append(label);
    root.append(card);
    return card;
  });
  let index = 0;
  function show(i) {
    index = Math.max(0, Math.min(cards.length - 1, i));
    cards.forEach((card, j) => (card.hidden = j !== index));
    counter.textContent = zh
      ? `第${index + 1}题 / 共6题`
      : `Question ${index + 1} of 6`;
    previous.disabled = index === 0;
    next.disabled = index === cards.length - 1;
  }
  previous.onclick = () => show(index - 1);
  next.onclick = () => show(index + 1);
  show(0);
}
