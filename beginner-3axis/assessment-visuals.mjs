/** Authored job illustrations: no external images, tracking, or implied photographs. */
const scenes = {
  assembly: `<rect x="30" y="70" width="300" height="65" rx="8" fill="#dce5ef"/><path d="M50 135v15m260-15v15"/><rect x="52" y="85" width="65" height="35" rx="5" fill="#ffd6a5"/><rect x="62" y="90" width="20" height="20" fill="#f29b38"/><rect x="238" y="78" width="60" height="45" rx="5" fill="#bce5d2"/><circle cx="269" cy="100" r="13" fill="none" stroke-dasharray="4 4"/><path d="M123 64Q185 18 248 64" stroke="#326bd7" marker-end="url(#arrow)"/>`,
  gantry: `<path d="M70 135V25h220v110M70 55h220" stroke-width="9"/><rect x="100" y="110" width="160" height="28" fill="#dce5ef"/><path d="M126 120h104v-26H126z" stroke="#ec9741" stroke-width="6"/><rect x="165" y="43" width="32" height="25" rx="4" fill="#4184dd"/><path d="M181 68v24M105 34h80" marker-end="url(#arrow)"/>`,
  pickPlace: `<path d="M25 136h310" stroke-width="8"/><rect x="70" y="91" width="220" height="37" rx="5" fill="#a8d6be"/><path d="M92 105h42v12h48v-14h45" stroke="#4d9b76"/><circle cx="244" cy="103" r="9" fill="#fff"/><rect x="226" y="25" width="36" height="27" rx="3" fill="#f2b34f"/><path d="M234 52v12m19-12v12M244 67v23" stroke="#326bd7" marker-end="url(#arrow)"/>`,
  sorting: `<rect x="22" y="77" width="215" height="52" rx="25" fill="#dce5ef"/><path d="M47 84v36m35-36v36m35-36v36m35-36v36m35-36v36m30-36v36" stroke="#b5c4d6"/><circle cx="70" cy="99" r="10" fill="#edb24b"/><circle cx="136" cy="99" r="10" fill="#edb24b"/><rect x="267" y="74" width="65" height="56" rx="5" fill="#bce5d2"/><path d="M154 72Q225 12 293 68" stroke="#326bd7" marker-end="url(#arrow)"/>`,
  delivery: `<path d="M30 15v130h300V15M105 15v35h145V15" fill="#e5edf4"/><path d="M55 115h105V75h130" stroke="#326bd7" stroke-width="4" stroke-dasharray="6 5" marker-end="url(#arrow)"/><rect x="45" y="75" width="42" height="32" rx="3" fill="#efba70"/><path d="M66 75v32"/><rect x="285" y="43" width="30" height="40" fill="#bce5d2"/>`,
};
export const SCENARIOS = [
  {
    id: "assembly",
    robot: "articulated",
    en: "Assembly bench",
    zh: "装配工作台",
    prompt:
      "A part must move from its tray into a fixture. Which robot from the demos fits this job?",
    promptZh: "把零件从料盘送到夹具中，演示中的哪种机器人适合？",
  },
  {
    id: "gantry",
    robot: "cartesian",
    en: "Print a rectangular outline",
    zh: "打印矩形轮廓",
    prompt:
      "A print head follows straight paths across a rectangular build area. Which body plan did you see doing this?",
    promptZh: "打印头在矩形区域沿直线运动，你看过哪种构型完成此任务？",
  },
  {
    id: "pickPlace",
    robot: "scara",
    en: "Fit an electronic component",
    zh: "安装电子部件",
    prompt:
      "Move across a workbench, then insert a part vertically. Which robot demonstrated this motion?",
    promptZh: "先在工作台上方平移，再竖直插入部件，哪种机器人演示过这个动作？",
  },
  {
    id: "sorting",
    robot: "delta",
    en: "Handle small, light items",
    zh: "搬运轻小物品",
    prompt:
      "Transfer light parts between collection stations from above. Which demo showed this job?",
    promptZh: "从上方在收集工位间搬运轻小零件，哪个演示展示了这个任务？",
  },
  {
    id: "delivery",
    robot: "mobile",
    en: "Deliver a parcel",
    zh: "运送包裹",
    prompt:
      "Carry a parcel along a route and turn towards a delivery station. Which robot can change its location?",
    promptZh: "沿路线运送包裹，再转向交付站点，哪种机器人可以改变自身位置？",
  },
];
export function scenarioIllustration(id, title) {
  const div = document.createElement("div");
  div.className = "scenario-picture";
  // Only authored strings from this module enter SVG markup; learner text is never interpolated.
  div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 160" aria-hidden="true"><defs><marker id="arrow-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#326bd7"/></marker></defs><rect width="360" height="160" rx="12" fill="#f1f5fa"/><g fill="none" stroke="#4d6178" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${(scenes[id] ?? scenes.assembly).replaceAll("url(#arrow)", `url(#arrow-${id})`)}</g></svg>`;
  div.setAttribute("role", "img");
  div.setAttribute("aria-label", title);
  return div;
}
