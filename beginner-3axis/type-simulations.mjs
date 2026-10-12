/** Interactive, deterministic mechanism demonstrations. Screen coordinates are
 * illustrative, not dimensions or a physical dynamics model. */
export const ROBOT_TYPES = [
  "articulated",
  "cartesian",
  "scara",
  "delta",
  "mobile",
];
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const pointOn = (a, b, t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });
function elbow(base, tip, l1, l2, side = -1) {
  const dx = tip.x - base.x,
    dy = tip.y - base.y,
    d = Math.hypot(dx, dy);
  const along = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - along * along));
  return {
    x: base.x + (along * dx) / d - (side * h * dy) / d,
    y: base.y + (along * dy) / d + (side * h * dx) / d,
  };
}
export function mechanismFrame(type, progress) {
  const t = Math.max(0, Math.min(1, progress)),
    phase = Math.min(3, Math.floor(t * 4));
  const u = t === 1 ? 1 : smooth((t * 4) % 1);
  const travel = phase === 0 ? 0 : phase === 1 ? u : phase === 2 ? 1 : 1 - u;
  const source = { x: 330, y: 215 },
    destination = { x: 440, y: 135 };
  if (type === "mobile") {
    // Straight, turn in place, straight, turn back. No sideways translation.
    const heading =
      phase === 0
        ? 0
        : phase === 1
          ? (u * Math.PI) / 2
          : phase === 2
            ? Math.PI / 2
            : ((1 - u) * Math.PI) / 2;
    const p =
      phase === 0
        ? { x: lerp(145, 385, u), y: 245 }
        : phase === 1
          ? { x: 385, y: 245 }
          : phase === 2
            ? { x: 385, y: lerp(245, 105, u) }
            : { x: 385, y: 105 };
    return {
      type,
      t,
      phase,
      tip: p,
      heading,
      wheels: phase === 1 ? [-1, 1] : phase === 3 ? [1, -1] : [1, 1],
      source: { x: 145, y: 245 },
      destination: { x: 385, y: 105 },
    };
  }
  const tip = pointOn(source, destination, travel);
  if (type === "cartesian")
    return { type, t, phase, tip, source, destination, held: phase === 1 };
  if (type === "delta") {
    const platform = {
      x: lerp(270, 335, travel),
      y: 225 - (phase === 1 || phase === 3 ? 35 * Math.sin(Math.PI * u) : 0),
    };
    const anchors = [
      { x: 170, y: 60 },
      { x: 430, y: 60 },
    ];
    const ends = [
      { x: platform.x - 28, y: platform.y },
      { x: platform.x + 28, y: platform.y },
    ];
    return {
      type,
      t,
      phase,
      tip: platform,
      source: { x: 270, y: 225 },
      destination: { x: 335, y: 225 },
      held: phase === 1,
      chains: anchors.map((a, i) => [
        a,
        elbow(a, ends[i], 100, 120, i === 0 ? 1 : -1),
        ends[i],
      ]),
    };
  }
  const base = type === "scara" ? { x: 240, y: 190 } : { x: 270, y: 270 };
  return {
    type,
    t,
    phase,
    tip,
    base,
    joint: elbow(base, tip, 125, 105),
    source,
    destination,
    held: phase === 1,
    stroke: phase === 0 || phase === 2 ? Math.sin(Math.PI * u) * 38 : 0,
  };
}

const TEXT = {
  articulated: [
    "Articulated arm",
    "关节式机械臂",
    "Side view: rotating joints move connected links. Watch both angles change while the tool travels. Base rotation is not shown in this view.",
    "侧视图：旋转关节带动连杆，观察工具移动时两个关节角度的变化。此视图不展示底座旋转。",
  ],
  cartesian: [
    "Cartesian / gantry",
    "直角坐标／龙门式",
    "The carriage slides along perpendicular rails. Each sliding axis changes one direction.",
    "滑块沿互相垂直的导轨移动，每根直线轴控制一个方向。",
  ],
  scara: [
    "SCARA",
    "SCARA机器人",
    "Two rotating joints reach across the bench; a separate vertical stroke inserts the part. Top view + side inset.",
    "两个旋转关节在工作台上定位，独立的竖直行程插入零件。俯视图＋侧面小图。",
  ],
  delta: [
    "Delta / parallel",
    "Delta／并联机器人",
    "Linked arms share one moving platform. Both chains must change together. This side view shows two of the three chains.",
    "连杆共同连接一个运动平台，必须协调运动。此侧视图展示三组支链中的两组。",
  ],
  mobile: [
    "Mobile rover",
    "移动机器人",
    "Equal wheel speeds move straight. Opposite wheel speeds turn the body in place; it cannot slide sideways.",
    "两轮同速向前走，两轮反向使车体原地转向，不能直接横移。",
  ],
};
const NS = "http://www.w3.org/2000/svg";
const svgEl = (tag, attrs = {}) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
};
export function createTypeSimulations(host) {
  let selected = "articulated",
    progress = 0,
    playing = false,
    language = "en",
    active = false;
  const picker = document.createElement("div");
  picker.className = "type-picker";
  picker.setAttribute("role", "group");
  const buttons = ROBOT_TYPES.map((type) => {
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.robotType = type;
    b.onclick = () => {
      selected = type;
      progress = 0;
      playing = false;
      render();
    };
    picker.append(b);
    return b;
  });
  const heading = document.createElement("h3"),
    description = document.createElement("p");
  const stage = svgEl("svg", {
    viewBox: "0 0 600 340",
    role: "img",
    class: "mechanism-stage",
  });
  const controls = document.createElement("div");
  controls.className = "mechanism-controls";
  const play = document.createElement("button"),
    reset = document.createElement("button"),
    range = document.createElement("input"),
    label = document.createElement("label");
  play.id = "type-play";
  reset.id = "type-reset";
  range.id = "type-progress";
  range.type = "range";
  range.min = "0";
  range.max = "1000";
  range.step = "1";
  label.htmlFor = range.id;
  controls.append(play, reset, label, range);
  const status = document.createElement("p");
  status.className = "mechanism-status";
  status.setAttribute("role", "status");
  const bridge = document.createElement("div");
  bridge.className = "course-robot";
  const note = document.createElement("p");
  note.className = "subtle";
  host.append(
    picker,
    heading,
    description,
    controls,
    stage,
    status,
    bridge,
    note,
  );
  play.onclick = () => {
    if (progress >= 1) progress = 0;
    playing = !playing;
    render();
  };
  reset.onclick = () => {
    playing = false;
    progress = 0;
    render();
  };
  range.oninput = () => {
    playing = false;
    progress = Number(range.value) / 1000;
    render();
  };
  const words = (en, zh) => (language === "zh" ? zh : en);
  function render() {
    const f = mechanismFrame(selected, progress),
      ink = "#334155",
      accent = "#2563eb";
    buttons.forEach((b, i) => {
      b.textContent = TEXT[ROBOT_TYPES[i]][language === "zh" ? 1 : 0];
      b.setAttribute("aria-pressed", String(selected === ROBOT_TYPES[i]));
    });
    picker.setAttribute("aria-label", words("Robot type", "机器人类型"));
    heading.textContent = TEXT[selected][language === "zh" ? 1 : 0];
    description.textContent = TEXT[selected][language === "zh" ? 3 : 2];
    stage.setAttribute(
      "aria-label",
      `${heading.textContent}: ${Math.round(progress * 100)}%. ${description.textContent}`,
    );
    stage.setAttribute(
      "viewBox",
      selected === "articulated"
        ? "190 55 325 275"
        : selected === "delta"
          ? "105 25 390 290"
          : selected === "mobile"
            ? "85 25 420 290"
            : "35 15 540 310",
    );
    stage.replaceChildren();
    const line = (a, b, color = ink, width = 12) =>
      stage.append(
        svgEl("line", {
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
          stroke: color,
          "stroke-width": width,
          "stroke-linecap": "round",
        }),
      );
    const circle = (p, r = 10, color = accent) =>
      stage.append(
        svgEl("circle", {
          cx: p.x,
          cy: p.y,
          r,
          fill: color,
          stroke: "white",
          "stroke-width": 3,
        }),
      );
    const rect = (x, y, w, h, fill, rx = 5) =>
      stage.append(svgEl("rect", { x, y, width: w, height: h, fill, rx }));
    const text = (p, s) => {
      const e = svgEl("text", {
        x: p.x,
        y: p.y,
        fill: ink,
        "font-size": 14,
        "text-anchor": "middle",
      });
      e.textContent = s;
      stage.append(e);
    };
    for (let x = 40; x < 600; x += 40)
      line({ x, y: 25 }, { x, y: 305 }, "#e2e8f0", 1);
    for (let y = 25; y < 320; y += 40)
      line({ x: 35, y }, { x: 565, y }, "#e2e8f0", 1);
    for (const [p, s] of [
      [f.source, "A"],
      [f.destination, "B"],
    ]) {
      circle(p, 21, "#dce8f8");
      text({ x: p.x, y: p.y + 40 }, s);
    }
    if (selected === "mobile") {
      const group = svgEl("g", {
        transform: `translate(${f.tip.x} ${f.tip.y}) rotate(${(-f.heading * 180) / Math.PI})`,
      });
      group.append(
        svgEl("rect", {
          x: -31,
          y: -23,
          width: 62,
          height: 46,
          rx: 12,
          fill: ink,
        }),
      );
      for (const y of [-29, 23])
        group.append(
          svgEl("rect", {
            x: -19,
            y,
            width: 38,
            height: 6,
            rx: 2,
            fill: accent,
          }),
        );
      group.append(svgEl("path", { d: "M 0 -9 L 19 0 L 0 9 Z", fill: "#fff" }));
      stage.append(group);
      text({ x: 170, y: 55 }, words("Left wheel", "左轮") + ": " + f.wheels[0]);
      text(
        { x: 425, y: 55 },
        words("Right wheel", "右轮") + ": " + f.wheels[1],
      );
    } else {
      if (selected === "cartesian") {
        for (const y of [55, 270]) line({ x: 90, y }, { x: 510, y }, ink, 8);
        line({ x: f.tip.x, y: 55 }, { x: f.tip.x, y: 270 }, "#94a3b8", 14);
        rect(f.tip.x - 18, f.tip.y - 16, 36, 32, accent);
        text({ x: 300, y: 35 }, words("X rail", "X导轨"));
        text({ x: 65, y: 170 }, "Y");
      } else if (selected === "delta") {
        line({ x: 130, y: 55 }, { x: 470, y: 55 }, ink, 12);
        for (const [a, b, c] of f.chains) {
          line(a, b, ink, 12);
          line(b, c, accent, 6);
          circle(a);
          circle(b, 8);
        }
        line(
          { x: f.tip.x - 28, y: f.tip.y },
          { x: f.tip.x + 28, y: f.tip.y },
          ink,
          12,
        );
      } else {
        if (selected === "articulated")
          line(f.base, { x: f.base.x, y: 303 }, ink, 18);
        circle(f.base, 27, ink);
        line(f.base, f.joint, ink, 19);
        line(f.joint, f.tip, "#64748b", 15);
        circle(f.base, 13);
        circle(f.joint, 13);
        if (selected === "scara") {
          rect(492, 72, 65, 154, "#e2e8f0");
          line({ x: 525, y: 90 }, { x: 525, y: 150 + f.stroke }, accent, 9);
          rect(512, 153 + f.stroke, 26, 10, ink);
          text({ x: 525, y: 248 }, words("Z stroke", "Z行程"));
        } else line({ x: 240, y: 307 }, { x: 300, y: 307 }, ink, 9);
      }
      const cargo = f.held ? f.tip : progress < 0.5 ? f.source : f.destination;
      rect(cargo.x - 8, cargo.y - 8, 16, 16, "#f59e0b", 2);
      if (selected === "articulated") {
        const u = progress === 1 ? 1 : smooth((progress * 4) % 1);
        const gap =
          f.phase === 0
            ? lerp(17, 10, u)
            : f.phase === 1
              ? 10
              : f.phase === 2
                ? lerp(10, 17, u)
                : 17;
        line({ x: f.tip.x, y: f.tip.y - 18 }, f.tip, accent, 4);
        line(
          { x: f.tip.x - gap, y: f.tip.y - 18 },
          { x: f.tip.x + gap, y: f.tip.y - 18 },
          ink,
          4,
        );
        for (const side of [-1, 1])
          line(
            { x: f.tip.x + side * gap, y: f.tip.y - 18 },
            { x: f.tip.x + side * gap, y: f.tip.y + 8 },
            ink,
            4,
          );
      } else circle(f.tip, 7, accent);
    }
    range.value = String(Math.round(progress * 1000));
    play.textContent = playing
      ? words("Ⅱ Pause", "Ⅱ 暂停")
      : words("▶ Play", "▶ 播放");
    reset.textContent = words("↺ Reset", "↺ 重置");
    label.textContent = words("Motion", "运动进度");
    const phases =
      selected === "mobile"
        ? [
            words("Drive straight", "直行"),
            words("Turn in place", "原地转向"),
            words("Drive to B", "驶向B"),
            words("Turn back", "转回"),
          ]
        : [
            words("Pick up at A", "在A取件"),
            words("Transfer to B", "搬运到B"),
            words("Place at B", "在B放件"),
            words("Return empty", "空载返回"),
          ];
    const message = `${phases[f.phase]} · ${Math.round(progress * 100)}%`;
    if (status.textContent !== message) status.textContent = message;
    bridge.textContent = words(
      "Our course robot: a three-axis articulated arm, with a separate gripper. Next, you will meet its parts and operate it in 3D.",
      "本课程使用：三轴关节式机械臂，夹爪独立开合。接下来将认识它的部件，并在3D场景中操作。",
    );
    note.textContent = words(
      "Simplified motion models, not industrial robot performance or physics. Scrub the motion bar to compare how the parts move.",
      "这些是简化运动模型，不代表工业机器人性能或物理效果。拖动进度条，比较各部件如何运动。",
    );
  }
  render();
  return {
    update(lang, visible) {
      const changed = language !== lang || active !== visible;
      language = lang;
      active = visible;
      if (!active) playing = false;
      if (changed) render();
    },
    tick(ms) {
      if (!active || !playing) return;
      progress = Math.min(1, progress + ms / 10000);
      if (progress === 1) playing = false;
      render();
    },
    get type() {
      return selected;
    },
    get progress() {
      return progress;
    },
  };
}
