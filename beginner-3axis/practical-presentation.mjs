import { createScene } from "./scene.mjs";
import { initialScene, teachingRoute } from "./planner.mjs";
import { fk } from "./model.mjs";
import { demoStep } from "./demo-sequence.mjs";

const make = (tag, cls) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
};
export const PRACTICAL_LESSONS = ["grip", "program", "obstacle"];

export function createTaskPreview() {
  const figure = make("figure", "task-preview"),
    host = make("div", "task-scene"),
    readout = make("figcaption");
  host.id = "task-preview-scene";
  figure.append(host, readout);
  let renderer, lastLesson, lastReset;
  return {
    figure,
    host,
    update({
      state = initialScene(),
      target = null,
      language,
      lesson,
      trail = false,
      path = false,
      programPoints = [],
      programValid = true,
      resetKey = lesson,
    }) {
      renderer ??= createScene(host);
      if (lastReset !== resetKey) {
        renderer.clearTrail();
        lastReset = resetKey;
      }
      const p = fk(state.actualJoints).C;
      renderer.update(state, target ?? { parsed: p, valid: true }, {
        language,
        labels: false,
        toolLabels: false,
        axes: true,
        ghost: path,
        path,
        trail,
        programPoints,
        programValid,
      });
      readout.textContent = `${language === "zh" ? "当前 TCP" : "Current TCP"} · X ${p.x.toFixed(1)} · Y ${p.y.toFixed(1)} · Z ${p.z.toFixed(1)} mm`;
      if (lastLesson !== lesson) {
        lastLesson = lesson;
        renderer.home();
      }
    },
  };
}

/** Focused controls use the same controller and evidence stream as Explore. */
export function createPracticeControls(api) {
  const root = make("section", "focused-controls");
  root.id = "focused-controls";
  const instruction = make("p", "practice-instruction");
  instruction.id = "practice-instruction";
  root.append(instruction);
  const coordinates = make("div", "focused-coordinates");
  const fields = {};
  for (const axis of ["x", "y", "z"]) {
    const label = make("label"),
      text = make("span"),
      input = make("input");
    text.textContent = `${axis.toUpperCase()} (mm)`;
    input.type = "number";
    input.step = "0.1";
    input.inputMode = "decimal";
    input.id = `practice-${axis}`;
    input.oninput = () => api.report(api.get().c.editTarget(axis, input.value));
    fields[axis] = input;
    label.append(text, input);
    coordinates.append(label);
  }
  const actions = make("div", "focused-actions"),
    buttons = {};
  for (const name of [
    "move",
    "open",
    "close",
    "reset",
    "steps",
    "run",
    "pause",
    "stop",
  ]) {
    const b = make("button", name === "move" ? "primary" : "");
    b.id = `practice-${name}`;
    // Existing handlers own persistence, errors and evidence; no second implementation.
    b.onclick = () =>
      document.getElementById(name === "reset" ? "quick-reset" : name).click();
    buttons[name] = b;
  }
  actions.append(buttons.move, buttons.open, buttons.close);
  const held = make("p", "practice-held");
  held.id = "practice-held";
  held.setAttribute("role", "status");
  const program = make("section", "focused-program");
  program.id = "focused-program";
  const recordLabel = make("label"),
    record = make("input"),
    recordText = make("span");
  record.type = "checkbox";
  record.id = "practice-record";
  record.onchange = () => {
    const original = document.getElementById("record");
    original.checked = record.checked;
    original.dispatchEvent(new document.defaultView.Event("change"));
  };
  recordLabel.append(record, recordText);
  const playback = make("div", "focused-actions");
  playback.append(
    buttons.reset,
    buttons.run,
    buttons.pause,
    buttons.stop,
    buttons.steps,
  );
  const setupNote = make("p", "practice-setup");
  setupNote.id = "practice-setup";
  root.append(setupNote);
  const reference = make("section", "transfer-reference");
  reference.id = "transfer-reference";
  root.append(reference);
  let referenceKey = "";
  const programNote = make("p", "subtle");
  programNote.id = "practice-program-note";
  program.append(recordLabel, playback, programNote);
  const feedback = make("p", "focused-feedback");
  feedback.id = "practice-feedback";
  feedback.setAttribute("role", "status");
  const views = make("div", "scene-view-options"),
    toggles = {};
  for (const name of ["trail", "path"]) {
    const label = make("label"),
      input = make("input"),
      span = make("span");
    input.type = "checkbox";
    input.checked = true;
    input.id = `practice-${name}`;
    input.onchange = () => api.render();
    toggles[name] = { input, span };
    label.append(input, span);
    views.append(label);
  }
  root.append(coordinates, actions, held, program, feedback);
  return {
    root,
    viewControls: views,
    views: () => ({
      trail: toggles.trail.input.checked,
      path: toggles.path.input.checked,
    }),
    update({ lesson, language, active }) {
      const { c, learning } = api.get(),
        zh = language === "zh";
      const a = learning.lessons[lesson]?.currentAttemptId;
      const attempt = learning.lessons[lesson]?.attempts.find(
        (item) => item.id === a,
      );
      instruction.textContent = attempt?.transfer
        ? zh
          ? "输入你选择的位置，再按“移动”。录制移动和夹爪动作来建立程序。"
          : "Enter your chosen position, then Move. Record movements and gripper actions to build your program."
        : zh
          ? "按蓝色步骤操作。“使用目标”只填入坐标；按“移动”才会移动机器人。"
          : "Follow the blue action. Use target fills the coordinates; Move operates the robot.";
      const events = learning.evidenceEvents.filter(
        (e) =>
          e.attemptId === a &&
          e.sequence > (attempt?.predictionSequence ?? Infinity),
      );
      setupNote.hidden = lesson !== "program" && !attempt?.transfer;
      setupNote.textContent = !events.some((e) => e.type === "SCENE_RESET")
        ? zh
          ? "先按重置，再开启录制。"
          : "First press Reset, then turn Record ON."
        : !c.state.program.steps.length && !c.state.recording.enabled
          ? zh
            ? "开启录制，再按下面的路线操作。"
            : "Turn Record ON, then follow the route below."
          : c.state.recording.enabled
            ? zh
              ? "录制中：每次成功移动和夹爪动作都会保存。"
              : "Recording: each successful movement and gripper action is saved."
            : zh
              ? "录制已关闭。重置，再运行程序。"
              : "Recording is OFF. Reset, then Run your program.";
      reference.hidden = !attempt?.transfer;
      if (attempt?.transfer) {
        setupNote.textContent = zh
          ? "独立任务：规划到B的路线并录制。关闭录制 → 重置 → 运行验证。"
          : "Independent task: plan and record your route to B. Record OFF → Reset → Run to test.";
        const key = `${a}:${language}`;
        if (referenceKey !== key) {
          referenceKey = key;
          reference.replaceChildren();
          const title = make("strong");
          title.textContent = zh ? "已知位置（毫米）" : "Given positions (mm)";
          const table = make("table"),
            head = make("tr");
          for (const text of [zh ? "位置" : "Position", "X", "Y", "Z"]) {
            const th = make("th");
            th.textContent = text;
            head.append(th);
          }
          table.append(head);
          const route = teachingRoute(c.state.scene);
          for (const [index, label] of [
            [0, zh ? "起点入口" : "Source entry"],
            [1, zh ? "抓取点" : "Pickup"],
            [5, zh ? "B入口" : "B entry"],
            [6, zh ? "B放置点" : "Place at B"],
          ]) {
            const row = make("tr"),
              th = make("th");
            th.scope = "row";
            th.textContent = label;
            row.append(th);
            for (const axis of ["x", "y", "z"]) {
              const td = make("td");
              td.textContent = route[index].targetMm[axis].toFixed(1);
              row.append(td);
            }
            table.append(row);
          }
          const note = make("p");
          note.textContent = zh
            ? "障碍顶部 Z = 100毫米。自行决定绕行位置和顺序。"
            : "Obstacle top: Z = 100 mm. Choose your own clearance positions and action order.";
          reference.append(title, table, note);
        }
      }
      for (const axis of ["x", "y", "z"]) {
        const draft =
          c.operation?.commands[c.operation.index]?.targetMm?.[axis] ??
          c.state.target.draft[axis];
        if (document.activeElement !== fields[axis])
          fields[axis].value = Number.isFinite(Number(draft))
            ? Number(draft).toFixed(1)
            : draft;
        fields[axis].disabled = c.busy || !active;
      }
      for (const name of Object.keys(buttons)) {
        const original = document.getElementById(
          name === "reset" ? "quick-reset" : name,
        );
        buttons[name].textContent = original.textContent;
        buttons[name].disabled = !active || original.disabled;
      }
      held.textContent = document.getElementById("held").textContent;
      feedback.textContent = document.getElementById("feedback").textContent;
      feedback.dataset.tone = document.getElementById("feedback").dataset.tone;
      program.hidden = lesson === "grip";
      record.checked = c.state.recording.enabled;
      record.disabled = !active || c.busy;
      recordText.textContent = zh
        ? `录制 ${record.checked ? "开" : "关"}`
        : `Record ${record.checked ? "ON" : "OFF"}`;
      programNote.textContent = zh
        ? `${c.state.program.steps.length}步 · 录制完成：关 → 重置 → 运行。试试暂停、继续和停止；重置后完整运行。`
        : `${c.state.program.steps.length} steps · After recording: OFF → Reset → Run. Try Pause, Resume and Stop; reset and run the whole sequence.`;
      if (c.operation?.source === "replay") {
        const op = c.operation,
          step = demoStep(op.commands[op.index], language);
        programNote.textContent = `${zh ? "播放步骤" : "Playing step"} ${op.index + 1} / ${op.commands.length} · ${step.title}`;
      }
      toggles.trail.span.textContent = zh ? "实际轨迹" : "Trail";
      toggles.path.span.textContent = zh ? "预期路径" : "Expected path";
    },
  };
}

export function buildDesignQuestions(root, language) {
  const zh = language === "zh";
  const fields = [...root.querySelectorAll(":scope > label")];
  const groups = [["job"], ["bodyPlan"], ["benefit", "limit"], ["interest"]];
  const prompts = zh
    ? [
        "谁需要帮助？你想让机器人做什么？",
        "哪种结构适合这个动作？",
        "说明一个好处和一个限制。",
        "哪一部分让你想继续探索？",
      ]
    : [
        "Who needs help, and what should the robot do?",
        "Which body plan fits that movement?",
        "Describe one benefit and one limitation.",
        "What would you like to explore further?",
      ];
  const nav = make("nav", "anatomy-question-nav"),
    prev = make("button"),
    next = make("button"),
    counter = make("span");
  prev.id = "design-previous";
  next.id = "design-next";
  prev.textContent = zh ? "← 上一项" : "← Previous";
  next.textContent = zh ? "下一项 →" : "Next →";
  nav.append(prev, counter, next);
  const prompt = make("h3");
  prompt.id = "design-question";
  root.prepend(nav, prompt);
  let index = 0;
  function show(i) {
    index = Math.max(0, Math.min(3, i));
    fields.forEach(
      (label) =>
        (label.hidden = !groups[index].includes(
          label.querySelector("input,select").name,
        )),
    );
    counter.textContent = `${index + 1} / 4`;
    prompt.textContent = prompts[index];
    prev.disabled = index === 0;
    next.disabled = index === 3;
  }
  prev.onclick = () => show(index - 1);
  next.onclick = () => show(index + 1);
  show(0);
  return {
    showMissing(name) {
      show(groups.findIndex((g) => g.includes(name)));
    },
  };
}
