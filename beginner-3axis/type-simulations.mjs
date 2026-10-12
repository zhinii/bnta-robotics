import { createRobotTypeScene } from "./robot-type-scene.mjs";
import { createDemoSequence } from "./demo-sequence.mjs";
import { createDemoFocus } from "./demo-focus.mjs";
import { robotTypePose } from "./robot-type-motion.mjs";
/** Interactive robot-type slide presentation.
 * Preview scenes are separate from the learner model. */
export const ROBOT_TYPES = [
  "articulated",
  "cartesian",
  "scara",
  "delta",
  "mobile",
];
export function createTypeSimulations(host, navigation) {
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
  const familiar = make("section", "familiar-example"),
    familiarTitle = make("h4"),
    familiarCopy = make("p");
  familiar.append(familiarTitle, familiarCopy);
  facts.insertBefore(familiar, limit);
  const media = make("div", "robot-slide-media");
  const controls = make("div", "mechanism-controls"),
    play = make("button", "primary"),
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
  const figure = make("figure", "type-demo-figure");
  const demoBody = make("div", "type-demo-body");
  figure.append(stage);
  demoBody.append(controls, status, modelNote);
  media.append(figure, demoBody);
  const sequence = createDemoSequence("type-demo-sequence");
  demoBody.insertBefore(sequence.root, modelNote);
  const demoFocus = createDemoFocus(media, demoBody, ".robot-type-stage");
  const nav = make("nav", "robot-slide-nav"),
    dots = make("div", "robot-slide-dots");
  counter.setAttribute("role", "status");
  const buttons = ROBOT_TYPES.map((type, i) => {
    const b = make("button");
    b.dataset.robotType = type;
    b.textContent = String(i + 1);
    b.onclick = () => select(i);
    dots.append(b);
    return b;
  });
  nav.append(dots);
  const hint = make("p", "slide-swipe-hint");
  top.append(nav);
  const content = make("div", "robot-type-content");
  const explanation = make("div", "robot-type-explanation");
  explanation.append(description, facts);
  content.append(media, explanation);
  host.append(top, hint, content);
  const setText = (node, text) => {
    if (node.textContent !== text) node.textContent = text;
  };
  function select(i) {
    navigation.select(Math.max(0, Math.min(ROBOT_TYPES.length - 1, i)));
  }
  play.onclick = () => {
    if (progress >= 1) progress = 0;
    playing = !playing;
    render();
    if (playing) demoFocus.focus();
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
    if (
      e.button !== 0 ||
      e.target.closest("button,input,select,a,.glossary-term")
    )
      return;
    swipe = { x: e.clientX, y: e.clientY, id: e.pointerId };
  });
  host.addEventListener("pointerup", (e) => {
    if (!swipe || swipe.id !== e.pointerId) return;
    const dx = e.clientX - swipe.x,
      dy = e.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3)
      navigation.advance(dx < 0 ? 1 : -1);
  });
  host.addEventListener("pointercancel", () => (swipe = null));
  host.addEventListener("keydown", (e) => {
    if (e.target.matches("input,textarea,select")) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      navigation.advance(e.key === "ArrowRight" ? 1 : -1);
    }
  });
  function render() {
    const type = ROBOT_TYPES[index];
    const tr = (k) => (translate ? translate(`bodyPlans.${type}.${k}`) : type);
    setText(heading, tr("title"));
    setText(
      counter,
      `${index + 1} / ${ROBOT_TYPES.length} · ${phase === "watch" ? words("Demo", "演示") : words("Concept", "概念")}`,
    );
    setText(description, tr("description"));
    setText(jobTitle, words("A useful job", "可以做什么"));
    setText(jobCopy, tr("job"));
    setText(familiarTitle, words("Where you might meet one", "生活中的例子"));
    setText(familiarCopy, tr("familiar"));
    setText(limitTitle, words("What to consider", "需要考虑什么"));
    setText(limitCopy, tr("tradeoff"));
    facts.hidden = false;
    media.hidden = false;
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
        "Watch this robot at work, then move to the next type.",
        "观看这类机器人的工作示例，再查看下一种。",
      ),
    );
    setText(
      play,
      playing
        ? words("Ⅱ Pause", "Ⅱ 暂停")
        : progress >= 1
          ? words("↻ Replay", "↻ 重播")
          : words("▶ Watch example", "▶ 观看示例"),
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
          : type === "delta"
            ? [
                words(
                  "Lower the cup and switch suction on",
                  "降低吸盘，开启吸力",
                ),
                words(
                  "Lift clear, then carry to the tray",
                  "先抬高，再移到托盘上方",
                ),
                words(
                  "Lower into the tray and release",
                  "降低到托盘中，释放物品",
                ),
                words(
                  "Lift the empty tool and return",
                  "抬起空吸盘，返回取件位置",
                ),
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
    let message = phrases[Math.min(3, Math.floor(progress * 4))];
    if (type === "delta") {
      const pose = robotTypePose(type, progress);
      const stages = {
        approach: words(
          "Lower straight onto the snack packet.",
          "竖直降低，接近零食包装。",
        ),
        pickup: pose.vacuumOn
          ? words(
              "Suction ON · packet attached to the cup.",
              "吸力开启 · 包装已吸附在吸盘上。",
            )
          : words(
              "Cup in contact · switch suction on before lifting.",
              "吸盘已接触 · 抬起前开启吸力。",
            ),
        lift: words(
          "Lift the packet clear of the conveyor.",
          "抬起包装，离开传送带。",
        ),
        transfer: words(
          "Carry the packet above the tray · platform stays level.",
          "将包装移到托盘上方 · 平台保持水平。",
        ),
        lower: words(
          "Lower vertically into the tray · suction stays ON.",
          "竖直放入托盘 · 吸力保持开启。",
        ),
        place: words(
          "Packet resting on the tray · ready to release.",
          "包装已放稳在托盘上 · 准备释放。",
        ),
        release: words(
          "Suction OFF · packet stays on the tray.",
          "吸力关闭 · 包装留在托盘中。",
        ),
        withdraw: words(
          "Lift the empty cup before moving sideways.",
          "先抬起空吸盘，再横向移动。",
        ),
        return: words(
          "Return above the conveyor · the packed item stays behind.",
          "返回传送带上方 · 已放好的物品留在托盘中。",
        ),
      };
      message = stages[pose.motionStage];
    }
    sequence.update(
      phrases.map((title) => ({ title, detail: "" })),
      progress ? Math.min(3, Math.floor(progress * 4)) : -1,
      progress === 1 ? "done" : playing || progress > 0 ? "playing" : "ready",
      language,
    );
    host.dataset.playing = String(playing);
    if (status.textContent !== message) status.textContent = message;
    if (active) {
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
    update(lang, visible, p = "watch", tr, selectedIndex = 0) {
      const entered =
        (!active && visible) || phase !== p || index !== selectedIndex;
      const changed =
        language !== lang ||
        active !== visible ||
        phase !== p ||
        index !== selectedIndex;
      index = selectedIndex;
      language = lang;
      active = visible;
      phase = p;
      translate = tr;
      if (!active) playing = false;
      else if (entered) {
        progress = 0;
        playing =
          p === "watch" &&
          !matchMedia("(prefers-reduced-motion: reduce)").matches;
      }
      if (changed) render();
      if (entered || !active) demoFocus.clear();
      if (entered && playing) demoFocus.focus();
    },
    tick(ms) {
      if (!active || !playing) return;
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
