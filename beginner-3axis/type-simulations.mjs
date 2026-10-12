import { createRobotTypeScene } from "./robot-type-scene.mjs";
/** Interactive robot-type slide presentation.
 * Preview scenes are separate from the learner model. */
export const ROBOT_TYPES = [
  "articulated",
  "cartesian",
  "scara",
  "delta",
  "mobile",
];
export function createTypeSimulations(host) {
  let index = 0,
    progress = 0,
    playing = false,
    language = "en",
    active = false,
    phase = "understand",
    translate = null,
    renderer = null;
  const words = (en, zh) => (language === "zh" ? zh : en);
  const make = (tag, cls) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  };
  host.classList.add("robot-slides");
  host.tabIndex = 0;
  host.setAttribute("role", "region");
  host.setAttribute("aria-roledescription", "carousel");
  const top = make("div", "slide-heading"),
    counter = make("span", "slide-counter"),
    heading = make("h3");
  heading.id = "robot-slide-title";
  host.setAttribute("aria-labelledby", heading.id);
  top.append(counter, heading);
  const description = make("p", "robot-slide-description");
  const facts = make("div", "robot-slide-facts");
  const job = make("section"),
    jobTitle = make("h4"),
    jobCopy = make("p"),
    limit = make("section"),
    limitTitle = make("h4"),
    limitCopy = make("p");
  job.append(jobTitle, jobCopy);
  limit.append(limitTitle, limitCopy);
  facts.append(job, limit);
  const media = make("div", "robot-slide-media");
  const controls = make("div", "mechanism-controls"),
    play = make("button"),
    reset = make("button"),
    range = make("input"),
    label = make("label");
  play.id = "type-play";
  reset.id = "type-reset";
  range.id = "type-progress";
  range.type = "range";
  range.min = "0";
  range.max = "1000";
  range.step = "1";
  label.htmlFor = range.id;
  controls.append(play, reset, label, range);
  const stage = make("div", "robot-type-stage");
  stage.id = "robot-type-stage";
  const fallback = make("p", "robot-type-fallback");
  fallback.hidden = true;
  stage.append(fallback);
  const status = make("p", "mechanism-status");
  status.setAttribute("role", "status");
  const modelNote = make("p", "subtle");
  media.append(controls, stage, status, modelNote);
  const nav = make("nav", "robot-slide-nav"),
    previous = make("button"),
    next = make("button"),
    dots = make("div", "robot-slide-dots");
  previous.id = "type-previous";
  next.id = "type-next";
  counter.setAttribute("role", "status");
  const buttons = ROBOT_TYPES.map((type, i) => {
    const b = make("button");
    b.dataset.robotType = type;
    b.textContent = String(i + 1);
    b.onclick = () => select(i);
    dots.append(b);
    return b;
  });
  nav.append(previous, dots, next);
  const hint = make("p", "slide-swipe-hint");
  top.append(nav);
  host.append(top, hint, description, facts, media);
  const setText = (node, text) => {
    if (node.textContent !== text) node.textContent = text;
  };
  function select(i) {
    index = Math.max(0, Math.min(ROBOT_TYPES.length - 1, i));
    progress = 0;
    playing =
      active &&
      phase === "watch" &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;
    render();
  }
  previous.onclick = () => select(index - 1);
  next.onclick = () => select(index + 1);
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
  range.addEventListener("pointerdown", () => {
    playing = false;
    render();
  });
  let swipe = null;
  host.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest("button,input,select,a")) return;
    swipe = { x: e.clientX, y: e.clientY, id: e.pointerId };
  });
  host.addEventListener("pointerup", (e) => {
    if (!swipe || swipe.id !== e.pointerId) return;
    const dx = e.clientX - swipe.x,
      dy = e.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3)
      select(index + (dx < 0 ? 1 : -1));
  });
  host.addEventListener("pointercancel", () => (swipe = null));
  host.addEventListener("keydown", (e) => {
    if (e.target.matches("input,textarea,select")) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      select(index + (e.key === "ArrowRight" ? 1 : -1));
    }
  });
  function render() {
    const type = ROBOT_TYPES[index];
    const tr = (k) => (translate ? translate(`bodyPlans.${type}.${k}`) : type);
    setText(heading, tr("title"));
    setText(counter, `${index + 1} / ${ROBOT_TYPES.length}`);
    setText(description, tr("description"));
    setText(jobTitle, words("A useful job", "可以做什么"));
    setText(jobCopy, tr("job"));
    setText(limitTitle, words("What to consider", "需要考虑什么"));
    setText(limitCopy, tr("tradeoff"));
    facts.hidden = phase === "watch";
    media.hidden = phase !== "watch";
    setText(previous, "←");
    setText(next, "→");
    previous.setAttribute(
      "aria-label",
      words("Previous robot type", "上一种机器人"),
    );
    next.setAttribute("aria-label", words("Next robot type", "下一种机器人"));
    previous.disabled = index === 0;
    next.disabled = index === ROBOT_TYPES.length - 1;
    buttons.forEach((b, i) => {
      b.setAttribute("aria-current", String(i === index));
      b.setAttribute(
        "aria-label",
        translate
          ? translate(`bodyPlans.${ROBOT_TYPES[i]}.title`)
          : ROBOT_TYPES[i],
      );
    });
    setText(
      hint,
      words(
        "Swipe, use the arrows, or press ← / → to change robot.",
        "左右滑动、点击箭头，或按 ← / → 切换机器人。",
      ),
    );
    setText(
      play,
      playing
        ? words("Ⅱ Pause", "Ⅱ 暂停")
        : progress >= 1
          ? words("↻ Replay", "↻ 重播")
          : words("▶ Play", "▶ 播放"),
    );
    setText(reset, words("↺ Reset", "↺ 重置"));
    setText(label, words("Motion", "进度"));
    range.value = String(Math.round(progress * 1000));
    setText(
      modelNote,
      words(
        "Illustrative 3D motion: connected mechanisms and example jobs. Forces, payload and industrial accuracy are not simulated.",
        "3D运动示意：展示连接机构和工作实例，不模拟力、负载或工业精度。",
      ),
    );
    const phrases =
      type === "mobile"
        ? [
            words("Carry a parcel forward", "向前运送包裹"),
            words("Turn in place", "原地转向"),
            words("Deliver to the green station", "送往绿色站点"),
            words("Turn to face the next route", "转向下一条路线"),
          ]
        : type === "cartesian"
          ? [
              words("Print the first edge", "打印第一条边"),
              words("Change direction along the rails", "沿导轨改变方向"),
              words("Print the opposite edge", "打印对边"),
              words("Complete the outline", "完成轮廓"),
            ]
          : [
              words("Approach and collect the part", "接近并取件"),
              words("Lift and transfer the part", "抬起并搬运零件"),
              words(
                type === "scara"
                  ? "Insert the part vertically"
                  : "Place at the green station",
                type === "scara" ? "竖直放入零件" : "放到绿色站点",
              ),
              words("Return for the next part", "返回取下一件"),
            ];
    const message = phrases[Math.min(3, Math.floor(progress * 4))];
    if (status.textContent !== message) status.textContent = message;
    if (active && phase === "watch") {
      renderer ??= createRobotTypeScene(stage);
      fallback.hidden = renderer.available;
      setText(
        fallback,
        words(
          "This browser cannot display the 3D preview (WebGL2 unavailable). The concept slides and assessment remain available.",
          "此浏览器无法显示3D预览（WebGL2不可用）。仍可学习概念页并完成评估。",
        ),
      );
      stage.dataset.progress = String(progress);
      stage.dataset.robotType = type;
      renderer.draw(
        type,
        progress,
        `${heading.textContent}. ${message}. ${Math.round(progress * 100)}%`,
      );
    }
  }
  return {
    update(lang, visible, p = "watch", tr) {
      const entered = (!active && visible) || phase !== p;
      const changed = language !== lang || active !== visible || phase !== p;
      language = lang;
      active = visible;
      phase = p;
      translate = tr;
      if (!active) playing = false;
      else if (entered) {
        index = 0;
        progress = 0;
        playing =
          p === "watch" &&
          !matchMedia("(prefers-reduced-motion: reduce)").matches;
      }
      if (changed) render();
    },
    tick(ms) {
      if (!active || phase !== "watch" || !playing) return;
      progress = Math.min(1, progress + ms / 12000);
      if (progress === 1) playing = false;
      render();
    },
    get type() {
      return ROBOT_TYPES[index];
    },
    get progress() {
      return progress;
    },
  };
}
