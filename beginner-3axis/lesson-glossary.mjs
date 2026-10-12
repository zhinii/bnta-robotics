import { VOCABULARY } from "./lesson-vocabulary.mjs";
const ALIASES = {
  Robot: ["robots"],
  "Body plan": ["body plans", "构型", "形态"],
  "Articulated arm": ["articulated arms", "articulated", "关节式"],
  Gantry: ["Cartesian", "直角坐标式", "龙门式", "直角坐标"],
  Axis: ["axes"],
  Joint: ["joints"],
  Link: ["links"],
  "Motor / actuator": [
    "motor",
    "motors",
    "actuator",
    "actuators",
    "电机",
    "执行器",
  ],
  "Tool centre point (TCP)": [
    "TCP",
    "tool centre point",
    "tool center point",
    "工具中心点",
  ],
  "Coordinates: X, Y, Z": ["coordinates", "coordinate", "XYZ", "坐标"],
  "Joint angle": ["joint angles"],
  "Average speed": ["speed"],
  "End effector": ["end effectors"],
  Obstacle: ["obstacles"],
  Waypoint: ["waypoints"],
};
const entries = [
  ...new Map(
    Object.values(VOCABULARY)
      .flat()
      .map((e) => [e.en, e]),
  ).values(),
];
const escaped = (s) =>
  [...s].map((c) => ("\\^$.*+?()[]{}|".includes(c) ? "\\" + c : c)).join("");
export function createLessonGlossary(root) {
  let lang = "en",
    observer,
    queued = false,
    opener = null;
  const terms = new Map();
  for (const e of entries)
    for (const text of [e.en, e.zh, ...(ALIASES[e.en] || [])])
      terms.set(text.toLowerCase(), e);
  const pattern = [...terms.keys()]
    .sort((a, b) => b.length - a.length)
    .map((s) =>
      /[a-z]/i.test(s) ? `(?<![a-z])${escaped(s)}(?![a-z])` : escaped(s),
    )
    .join("|");
  const regex = new RegExp(pattern, "giu");
  const popup = document.createElement("div");
  popup.className = "glossary-popup";
  popup.id = "lesson-definition";
  popup.hidden = true;
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-labelledby", "definition-title");
  const title = document.createElement("strong");
  title.id = "definition-title";
  const definition = document.createElement("p"),
    closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "×";
  closeButton.className = "definition-close";
  popup.append(title, closeButton, definition);
  document.body.append(popup);
  function close(restore = false) {
    popup.hidden = true;
    if (restore && opener?.isConnected) opener.focus();
    opener = null;
  }
  closeButton.onclick = () => close(true);
  root.addEventListener("keydown", (e) => {
    if (
      (e.key === "Enter" || e.key === " ") &&
      e.target.matches(".glossary-term")
    ) {
      e.preventDefault();
      e.stopPropagation();
      e.target.click();
    }
  });
  root.addEventListener("click", (e) => {
    const term = e.target.closest(".glossary-term");
    if (!term) return;
    e.preventDefault();
    e.stopPropagation();
    const entry = entries.find((v) => v.en === term.dataset.glossaryKey);
    if (!entry) return;
    opener = term;
    title.textContent = entry[lang === "zh" ? "zh" : "en"];
    definition.textContent = entry[lang === "zh" ? "meaningZh" : "meaning"];
    closeButton.setAttribute(
      "aria-label",
      lang === "zh" ? "关闭释义" : "Close definition",
    );
    popup.hidden = false;
    const rect = term.getBoundingClientRect();
    popup.style.width = `${Math.min(330, window.innerWidth - 24)}px`;
    popup.style.left = `${Math.max(12, Math.min(rect.left, window.innerWidth - popup.offsetWidth - 12))}px`;
    popup.style.top = `${Math.max(12, Math.min(rect.bottom + 8, window.innerHeight - popup.offsetHeight - 12))}px`;
    closeButton.focus();
  });
  document.addEventListener("pointerdown", (e) => {
    if (
      !popup.hidden &&
      !popup.contains(e.target) &&
      !e.target.closest(".glossary-term")
    )
      close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !popup.hidden) {
      e.preventDefault();
      e.stopPropagation();
      close(true);
    }
  });
  window.addEventListener("resize", () => close());
  window.addEventListener(
    "pagehide",
    () => {
      observer?.disconnect();
      popup.remove();
    },
    { once: true },
  );
  function annotate() {
    queued = false;
    observer?.disconnect();
    const walker = document.createTreeWalker(
        root,
        document.defaultView.NodeFilter.SHOW_TEXT,
      ),
      nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const text of nodes) {
      if (
        !text.parentElement ||
        text.parentElement.closest(
          ".glossary-term,button,a,input,textarea,select,option,script,style,svg,canvas,summary,nav,[data-no-glossary],.section-head",
        )
      )
        continue;
      const value = text.nodeValue;
      regex.lastIndex = 0;
      const matches = [...value.matchAll(regex)];
      if (!matches.length) continue;
      const fragment = document.createDocumentFragment();
      let end = 0;
      for (const match of matches) {
        fragment.append(document.createTextNode(value.slice(end, match.index)));
        // A native button inside a label would steal the field's implicit label.
        const b = document.createElement("span");
        b.setAttribute("role", "button");
        b.tabIndex = 0;
        b.className = "glossary-term";
        b.textContent = match[0];
        b.dataset.glossaryKey = terms.get(match[0].toLowerCase()).en;
        b.setAttribute("aria-haspopup", "dialog");
        b.setAttribute("aria-controls", popup.id);
        fragment.append(b);
        end = match.index + match[0].length;
      }
      fragment.append(document.createTextNode(value.slice(end)));
      text.replaceWith(fragment);
    }
    observer?.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  }
  if (typeof window.MutationObserver === "function") {
    observer = new window.MutationObserver(() => {
      if (!queued) {
        queued = true;
        queueMicrotask(annotate);
      }
    });
    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  }
  return {
    update(language) {
      if (lang !== language) close();
      lang = language;
      annotate();
    },
    close,
    dispose() {
      observer?.disconnect();
      popup.remove();
    },
  };
}
