import {
  PHASES,
  copy,
  practiceRoute,
  LessonDemo,
  moveMeasurement,
  checkCalculation,
} from "./curriculum.mjs";
import {
  LESSONS,
  currentAttempt,
  evaluateLesson,
  recordLearningEvent,
} from "./lessons.mjs";
import { fk, distance } from "./model.mjs";
import { createTypeSimulations } from "./type-simulations.mjs";
import { VOCABULARY } from "./lesson-vocabulary.mjs";

const WORDS = {
  vocabulary: ["Vocabulary", "词汇"],
  understand: ["Concept", "概念"],
  watch: ["Demo", "演示"],
  try: ["Assessment", "评估"],
  review: ["Explain & check", "解释与检查"],
  next: ["Continue →", "继续 →"],
  back: ["← Back", "← 返回"],
  nextLesson: ["Next lesson →", "下一课 →"],
  watchNow: ["▶ Watch example", "▶ 观看示例"],
  stopDemo: ["■ End example", "■ 结束示例"],
  demoOnly: ["DEMONSTRATION · your work is unchanged", "演示 · 不改变你的作品"],
  demoDone: [
    "Example finished. Now try it yourself.",
    "示例结束，现在自己试一试。",
  ],
  demoStopped: [
    "Example ended. Your robot and program are restored.",
    "示例已结束，已恢复你的机器人和程序。",
  ],
  goal: ["Your goal", "学习目标"],
  recordFirst: [
    "Save your prediction before operating. It stays with your evidence.",
    "操作前保存预测，它将保留在学习证据中。",
  ],
  predictSaved: [
    "Prediction saved. Now operate the robot.",
    "预测已保存，现在操作机器人。",
  ],
  use: ["Use target", "使用目标"],
  testBlocked: [
    "Test direct route (should be blocked)",
    "测试直线路线（应受阻）",
  ],
  reset: ["Reset", "重置"],
  resetTip: [
    "Return robot and part to program start; keep all steps.",
    "机器人和零件回到程序起点，保留所有步骤。",
  ],
  practical: ["Practical checklist", "操作清单"],
  reviewReady: [
    "Practical work recorded. Review your evidence.",
    "已记录操作，请回顾学习证据。",
  ],
  remaining: ["Next evidence needed", "下一项所需证据"],
  reasoning: [
    "Teacher review: explanations are not automatically graded.",
    "解释由老师评阅，不自动判定理解程度。",
  ],
  math: ["Measure & calculate", "测量与计算"],
  noMeasure: [
    "Complete an actual move to collect measurements. Target edits and examples do not count.",
    "完成一次实际移动以获得测量数据，修改目标和观看示例不计入。",
  ],
  delta: ["Z displacement (mm)", "Z位移（毫米）"],
  length: ["Path distance (mm)", "路程（毫米）"],
  speed: ["Average speed (mm/s)", "平均速度（毫米/秒）"],
  calculate: ["Check calculation", "检查计算"],
  correct: [
    "✓ Calculations agree with this measured move.",
    "✓ 计算与本次测量一致。",
  ],
  retry: [
    "Use final Z − initial Z; for this straight vertical move, distance = |displacement|. Speed = distance ÷ time. Round to 1 decimal place.",
    "用终点Z减起点Z。本次竖直运动的路程＝位移绝对值；速度＝路程÷时间。保留一位小数。",
  ],
  measured: ["Actual completed move", "实际完成的移动"],
  time: ["Simulated time", "模拟时间"],
  model: [
    "The model checks geometry, joint limits and grasp alignment. It does not model gravity, friction, payload, impact or electrical circuits.",
    "模型检查几何、关节限位和抓取对齐，不模拟重力、摩擦、负载、撞击或电路。",
  ],
  guide: [
    "Offline guide · scripted, not AI",
    "离线指导 · 预设规则，非人工智能",
  ],
  screenshot: ["Save scene image", "保存场景图片"],
  captureFailed: [
    "Image unavailable in this browser. Use a device screenshot.",
    "此浏览器无法导出图片，请使用设备截图。",
  ],
  save: ["Save project JSON", "保存项目JSON"],
  restore: ["Open project JSON", "打开项目JSON"],
  fileNote: [
    "Keep your JSON file: it restores the robot, program and learning evidence. There is no server database. The browser copy is only a convenience.",
    "请保管JSON文件，它可恢复机器人、程序和学习证据。没有服务器数据库，浏览器副本只是便利缓存。",
  ],
  submitted: [
    "Saved. Use Assessment to check your evidence.",
    "已保存，可在“评估”查看证据。",
  ],
  lift: ["Lift 10 mm", "抬高10毫米"],
};
export const word = (key, language = "en") =>
  WORDS[key]?.[language === "zh" ? 1 : 0] ?? key;
const $ = (id) => document.getElementById(id);
const node = (tag, text, cls) => {
  const e = document.createElement(tag);
  if (text) e.textContent = text;
  if (cls) e.className = cls;
  return e;
};
const pos = (p) =>
  ["x", "y", "z"]
    .map((k) => `${k.toUpperCase()} ${p[k].toFixed(1)}`)
    .join(" · ") + " mm";
const routeKeys = [
  "sourceApproach",
  "pickup",
  "",
  "sourceClearance",
  "destinationClearance",
  "destinationApproach",
  "place",
  "",
  "retreat",
];

export function createLearningFlow(api) {
  const rail = node("div", null, "inspector");
  document.querySelector(".workspace").append(rail);
  rail.append(
    $("learning"),
    document.querySelector(".control-card"),
    document.querySelector(".route-card"),
    document.querySelector(".coach-card"),
    $("six-axis"),
    document.querySelector(".portfolio"),
    document.querySelector(".attribution"),
  );
  const phaseNav = node("nav", null, "phase-nav");
  phaseNav.setAttribute("aria-label", "Lesson phase / 课程阶段");
  for (const p of PHASES.filter((p) => p !== "review")) {
    const b = node("button");
    b.dataset.phase = p;
    b.id = `phase-${p}`;
    b.onclick = () => setPhase(p);
    phaseNav.append(b);
  }
  $("task-title").before(phaseNav);
  const vocabulary = node("dl", null, "vocabulary-grid");
  vocabulary.id = "lesson-vocabulary";
  const courseFocus = node("p", null, "course-robot");
  $("lesson-content").before(vocabulary, courseFocus);
  const typeHost = node("section", null, "type-simulations");
  typeHost.id = "type-simulations";
  $("lesson-content").after(typeHost);
  const typeSim = createTypeSimulations(typeHost);
  const assessmentNav = node("div", null, "assessment-nav");
  const operateStage = node("button"),
    reviewStage = node("button");
  operateStage.id = "assessment-operate";
  reviewStage.id = "phase-review";
  operateStage.onclick = () => setPhase("try");
  reviewStage.onclick = () => setPhase("review");
  assessmentNav.append(operateStage, reviewStage);
  phaseNav.after(assessmentNav);
  const goal = node("p", null, "lesson-goal");
  $("task-title").after(goal);
  const brief = node("p");
  $("lesson-content").before(brief);
  const example = node("div", null, "example-pane");
  example.id = "example-pane";
  const exampleText = node("p"),
    watchButton = node("button", null, "primary"),
    stopButton = node("button"),
    caption = node("p", null, "demo-caption");
  watchButton.id = "watch-example";
  stopButton.id = "stop-example";
  caption.id = "demo-caption";
  caption.setAttribute("role", "status");
  const demoActions = node("div", null, "inline-actions");
  demoActions.append(watchButton, stopButton);
  example.append(exampleText, demoActions, caption);
  $("lesson-content").after(example);
  const taskGuide = node("div", null, "practice-guide");
  taskGuide.id = "practice-guide";
  const routeList = node("ol", null, "practice-route");
  routeList.id = "practice-route";
  const routeDetails = node("details", null, "route-details"),
    routeSummary = node("summary");
  routeDetails.append(routeSummary, routeList);
  const currentStep = node("div", null, "practice-current");
  currentStep.id = "practice-current";
  document.querySelector(".control-card").prepend(currentStep);
  const pending = node("p", null, "next-evidence");
  pending.id = "next-evidence";
  pending.setAttribute("role", "status");
  const predictionNote = node("p", null, "subtle");
  predictionNote.id = "prediction-note";
  $("task-description").after(predictionNote, taskGuide, routeDetails, pending);
  const reflection = $("reflection").closest("details");
  reflection.id = "reflection-pane";
  reflection.open = true;
  const reflectionPrompt = node("p");
  reflection.prepend(reflectionPrompt);
  const math = node("section", null, "math-pane");
  math.id = "math-pane";
  const mathTitle = node("h3"),
    measurementText = node("p");
  measurementText.id = "measurement";
  math.append(mathTitle, measurementText);
  for (const [id, key] of [
    ["displacement", "delta"],
    ["distance", "length"],
    ["speed", "speed"],
  ]) {
    const label = node("label"),
      span = node("span"),
      input = node("input");
    input.type = "number";
    input.step = "any";
    input.inputMode = "decimal";
    input.id = `calc-${id}`;
    label.append(span, input);
    label.dataset.word = key;
    math.append(label);
  }
  const calcButton = node("button");
  calcButton.id = "check-calculation";
  const calcStatus = node("p");
  calcStatus.id = "calculation-status";
  calcStatus.setAttribute("role", "status");
  math.append(calcButton, calcStatus);
  reflection.before(math);
  const reasoning = node("p", null, "subtle");
  reflection.append(reasoning);
  const lessonFooter = node("div", null, "lesson-footer"),
    back = node("button"),
    next = node("button", null, "primary");
  back.id = "phase-back";
  next.id = "phase-next";
  lessonFooter.append(back, next);
  $("learning").append(lessonFooter);
  const ribbon = node("p", null, "lesson-ribbon");
  ribbon.id = "lesson-ribbon";
  document.querySelector(".scene-card").append(ribbon);
  const demoBadge = node("span", null, "demo-badge");
  demoBadge.id = "demo-badge";
  $("scene").before(demoBadge);
  const reset = node("button");
  reset.id = "quick-reset";
  document.querySelector(".record-bar").append(reset);
  reset.onclick = () => api.report(api.get().c.reset());
  const modelNote = node("p", null, "subtle");
  document.querySelector(".coach-card").append(modelNote);
  watchButton.onclick = () => startDemo();
  stopButton.onclick = () => endDemo();
  back.onclick = () => setPhase(PHASES[Math.max(0, PHASES.indexOf(phase) - 1)]);
  next.onclick = () => {
    const { learning } = api.get();
    if (
      phase === "review" ||
      (phase === "try" &&
        ["types", "design"].includes(learning.currentLessonId))
    ) {
      const idx = LESSONS.findIndex((l) => l.id === learning.currentLessonId);
      if (idx < LESSONS.length - 1) api.startLesson(LESSONS[idx + 1].id);
    } else setPhase(PHASES[PHASES.indexOf(phase) + 1]);
  };
  calcButton.onclick = () => {
    const { learning, language } = api.get();
    const m = latestMeasurement(learning),
      answers = Object.fromEntries(
        ["displacement", "distance", "speed"].map((k) => [
          k,
          $(`calc-${k}`).value,
        ]),
      );
    const correct = checkCalculation(m, answers);
    api.setLearning(
      recordLearningEvent(learning, {
        type: "CALCULATION_SUBMITTED",
        moveEventId: m?.eventId ?? null,
        answers,
        correct,
      }),
    );
    calcStatus.textContent = word(correct ? "correct" : "retry", language);
    api.persist();
    api.render();
  };
  let phase = "vocabulary",
    lessonAttempt = null,
    lastLang = "",
    demo = null,
    lastDemoCaption = "",
    routeSignature = "";
  let vocabularyKey = "";
  function setPhase(p) {
    endDemo(false);
    phase = p;
    const { learning } = api.get();
    learning.presentation = { phase, lessonId: learning.currentLessonId };
    api.persist();
    api.render();
    rail.scrollTo?.({ top: 0, behavior: "instant" });
  }
  function latestMeasurement(learning) {
    const a = currentAttempt(learning);
    return (
      learning.evidenceEvents
        .filter(
          (e) =>
            e.attemptId === a?.id &&
            e.sequence > (a?.predictionSequence ?? Infinity),
        )
        .map(moveMeasurement)
        .filter(Boolean)
        .find(
          (m) =>
            Math.abs(m.displacementZ - 10) < 0.1 &&
            Math.abs(m.to.x - m.from.x) < 0.1 &&
            Math.abs(m.to.y - m.from.y) < 0.1,
        ) ?? null
    );
  }
  function startDemo() {
    const { c, learning, language } = api.get();
    if (c.busy) return;
    demo?.dispose();
    demo = new LessonDemo(learning.currentLessonId);
    caption.textContent = copy(learning.currentLessonId, "demo", language);
    lastDemoCaption = "";
    api.render();
  }
  function endDemo(announce = true) {
    if (demo) {
      demo.dispose();
      demo = null;
      if (announce)
        caption.textContent = word("demoStopped", api.get().language);
    }
  }
  function renderRoute() {
    const { c, learning, language, tr } = api.get(),
      id = learning.currentLessonId,
      attempt = currentAttempt(learning);
    routeList.replaceChildren();
    if (!["grip", "program", "obstacle"].includes(id) || attempt?.transfer)
      return;
    const route = practiceRoute(id, c.state.scene);
    route.forEach((step, i) => {
      const li = node("li"),
        name = step.expectedError
          ? word("testBlocked", language)
          : id === "grip" && i === 3
            ? word("lift", language)
            : step.type === "gripper"
              ? tr(
                  step.gripperState === "closed"
                    ? "control.close"
                    : "control.open",
                )
              : tr(
                  `route.${routeKeys[step.expectedError ? 6 : id === "obstacle" && i > 3 ? i - 1 : i]}`,
                );
      li.append(node("strong", name));
      if (step.targetMm) {
        li.append(node("small", pos(step.targetMm)));
        const b = node("button", word("use", language));
        b.dataset.routeIndex = i;
        b.onclick = () => {
          if (c.busy || demo) return;
          for (const axis of ["x", "y", "z"])
            c.editTarget(axis, step.targetMm[axis]);
          api.preview();
        };
        li.append(b);
      }
      routeList.append(li);
    });
  }
  function render() {
    const { c, learning, language, mode, tr } = api.get(),
      id = learning.currentLessonId,
      attempt = currentAttempt(learning),
      score = evaluateLesson(learning);
    const key = attempt?.id ?? id;
    if (key !== lessonAttempt) {
      endDemo(false);
      lessonAttempt = key;
      phase =
        learning.presentation?.lessonId === id
          ? learning.presentation.phase
          : "vocabulary";
      if (!PHASES.includes(phase)) phase = "vocabulary";
      caption.textContent = "";
      calcStatus.textContent = "";
      ["displacement", "distance", "speed"].forEach(
        (k) => ($(`calc-${k}`).value = ""),
      );
    }
    document.body.dataset.mode = mode;
    document.body.dataset.phase = phase;
    const conceptual = ["types", "design"].includes(id);
    const assessment = phase === "review" || (phase === "try" && conceptual);
    const sceneNeeded =
      mode === "explore" ||
      (id !== "types" &&
        (phase === "watch" || (phase === "try" && !conceptual)));
    document.body.dataset.lessonScene = String(sceneNeeded);
    document.documentElement.dataset.lessonScene = String(sceneNeeded);
    document.body.dataset.lesson = id;
    document.querySelector(".scene-card").hidden = !sceneNeeded;
    document.querySelector(".playback").hidden =
      !sceneNeeded || (mode === "learn" && phase === "watch");
    vocabulary.hidden = phase !== "vocabulary";
    if (vocabularyKey !== `${id}:${language}`) {
      vocabularyKey = `${id}:${language}`;
      vocabulary.replaceChildren();
      for (const entry of VOCABULARY[id] || []) {
        const card = node("div", null, "vocabulary-term");
        card.append(
          node("dt", entry[language === "zh" ? "zh" : "en"]),
          node("dd", entry[language === "zh" ? "meaningZh" : "meaning"]),
        );
        vocabulary.append(card);
      }
    }
    courseFocus.hidden =
      phase !== "understand" || !["types", "anatomy"].includes(id);
    courseFocus.textContent =
      language === "zh"
        ? "本课程聚焦这种机器人：三轴关节式机械臂。三个旋转关节定位工具，夹爪独立开合。点击“演示”观察它，再在后续操作中使用3D工作区。"
        : "Our course focuses on this robot: a three-axis articulated arm. Three rotating joints position its tool; the gripper opens and closes separately. See it in Demo, then use the 3D workspace for practical lessons.";
    typeHost.hidden = id !== "types" || phase !== "watch";
    typeSim.update(language, mode === "learn" && !typeHost.hidden);
    assessmentNav.hidden = !["try", "review"].includes(phase) || conceptual;
    operateStage.textContent =
      language === "zh" ? "1 · 实际操作" : "1 · Operate";
    reviewStage.textContent =
      language === "zh" ? "2 · 解释与检查" : "2 · Explain & check";
    operateStage.setAttribute("aria-current", String(phase === "try"));
    reviewStage.setAttribute("aria-current", String(phase === "review"));
    demoBadge.hidden = !demo;
    demoBadge.textContent = word("demoOnly", language);
    $("learning").dataset.phase = phase;
    for (const b of phaseNav.children) {
      b.textContent = word(b.dataset.phase, language);
      b.setAttribute(
        "aria-current",
        String(
          b.dataset.phase === phase ||
            (phase === "review" && b.dataset.phase === "try"),
        ),
      );
      b.disabled = !!attempt?.transfer && b.dataset.phase === "watch";
    }
    goal.textContent = copy(id, "goal", language);
    brief.textContent = copy(id, "concept", language);
    brief.hidden = phase !== "understand";
    $("lesson-content").hidden = phase !== "understand";
    example.hidden = phase !== "watch" || id === "types";
    exampleText.textContent = copy(id, "demo", language);
    watchButton.textContent = word("watchNow", language);
    watchButton.disabled = c.busy || !!demo;
    stopButton.textContent = word("stopDemo", language);
    stopButton.hidden = !demo;
    $("task-description").textContent = copy(id, "task", language);
    $("task-description").hidden = phase !== "try";
    if (attempt?.transfer) {
      const route = practiceRoute("program", c.state.scene);
      goal.textContent =
        language === "zh"
          ? "独立变化任务：把零件送到目标B。"
          : "Independent changed task: deliver the part to B.";
      $("task-description").textContent =
        language === "zh"
          ? `自己决定动作顺序，录制并运行到B的程序。障碍物顶部Z=100毫米。已知夹具入口：起点 ${pos(route[0].targetMm)}；B ${pos(route[5].targetMm)}。选取合适的绕行高度。关闭录制→重置→运行验证，最后说明改进。`
          : `Choose your own action order; record and replay a delivery to B. Obstacle top: Z = 100 mm. Given fixture entry points: Source ${pos(route[0].targetMm)}; B ${pos(route[5].targetMm)}. Choose clearance positions. Record OFF → Reset → Run to test; explain your changes.`;
      watchButton.disabled = true;
    }
    document.querySelector(".predict-row").hidden =
      phase !== "try" || !!attempt?.prediction;
    $("prediction").previousElementSibling.textContent = copy(
      id,
      "prediction",
      language,
    );
    predictionNote.textContent = word(
      attempt?.prediction ? "predictSaved" : "recordFirst",
      language,
    );
    predictionNote.hidden = phase !== "try";
    $("answer-form").hidden =
      !assessment || (conceptual && !attempt?.prediction);
    reflection.hidden = !assessment || (conceptual && !attempt?.prediction);
    reflectionPrompt.textContent = copy(id, "reflect", language);
    reasoning.textContent = word("reasoning", language);
    $("lesson-status").hidden = !assessment;
    $("inspect-joints").hidden = phase !== "try" || id !== "coordinates";
    $("changed-target").hidden =
      id !== "obstacle" || phase !== "review" || !score.complete;
    const nextCheck = Object.entries(score.checks).find(
      ([k, v]) => !v && k !== "reflectionSuppliedAfterAttempt",
    );
    pending.textContent = nextCheck
      ? `${word("remaining", language)}: ${tr(`checks.${nextCheck[0]}`)}`
      : word("reviewReady", language);
    pending.hidden = phase !== "try";
    taskGuide.hidden = true;
    if (routeSignature !== `${key}:${language}`) {
      routeSignature = `${key}:${language}`;
      renderRoute();
    }
    routeList.hidden =
      phase !== "try" || !attempt?.prediction || !!attempt?.transfer;
    routeDetails.hidden = routeList.hidden || !routeList.children.length;
    routeSummary.textContent =
      language === "zh" ? "查看全部操作步骤" : "Show all practice steps";
    routeList
      .querySelectorAll("button")
      .forEach((b) => (b.disabled = c.busy || !!demo));
    // Only committed actions after prediction mark a practical route item done.
    const events = learning.evidenceEvents.filter(
      (e) =>
        e.attemptId === attempt?.id &&
        e.sequence > (attempt?.predictionSequence ?? Infinity) &&
        e.source === "manual",
    );
    const route = practiceRoute(id, c.state.scene);
    let cursor = 0;
    for (const [i, li] of [...routeList.children].entries()) {
      const step = route[i];
      let index = -1;
      if (step)
        index = events.findIndex(
          (e, j) =>
            j >= cursor &&
            e.verified &&
            (step.expectedError
              ? e.type === "MOVE_REJECTED" &&
                e.error?.code === step.expectedError
              : step.type === "move"
                ? e.type === "MOVE_COMPLETED" &&
                  distance(fk(e.after.actualJoints).C, step.targetMm) < 0.2
                : e.type === "GRIPPER_CHANGED" &&
                  e.after.gripperState === step.gripperState),
        );
      li.classList.toggle("done", index >= 0);
      if (index >= 0) cursor = index + 1;
    }
    const activeStep = [...routeList.children].find(
      (li) => !li.classList.contains("done"),
    );
    currentStep.hidden =
      mode !== "learn" ||
      phase !== "try" ||
      !attempt?.prediction ||
      !!attempt?.transfer ||
      !activeStep;
    if (activeStep) {
      const index = [...routeList.children].indexOf(activeStep),
        signature = `${key}:${language}:${index}`;
      if (currentStep.dataset.signature !== signature) {
        currentStep.dataset.signature = signature;
        currentStep.replaceChildren();
        const text = node("div");
        text.append(
          node(
            "strong",
            `${index + 1}. ${activeStep.querySelector("strong").textContent}`,
          ),
        );
        if (activeStep.querySelector("small"))
          text.append(
            node("small", activeStep.querySelector("small").textContent),
          );
        currentStep.append(text);
        const original = activeStep.querySelector("button");
        if (original) {
          const use = node("button", word("use", language));
          use.id = "use-practice-target";
          use.onclick = () => original.click();
          currentStep.append(use);
        }
      }
      currentStep
        .querySelectorAll("button")
        .forEach((b) => (b.disabled = c.busy || !!demo));
    }
    math.hidden = phase !== "review" || id !== "coordinates";
    mathTitle.textContent = word("math", language);
    const m = latestMeasurement(learning);
    measurementText.textContent = m
      ? `${word("measured", language)}: Z ${m.from.z.toFixed(1)} → ${m.to.z.toFixed(1)} mm. ${word("time", language)}: ${m.seconds.toFixed(3)} s. ${word("retry", language)}`
      : word("noMeasure", language);
    math
      .querySelectorAll("label")
      .forEach(
        (l) =>
          (l.firstElementChild.textContent = word(l.dataset.word, language)),
      );
    calcButton.textContent = word("calculate", language);
    calcButton.disabled = !m;
    back.textContent = word("back", language);
    back.disabled = phase === "vocabulary";
    next.textContent = word(assessment ? "nextLesson" : "next", language);
    next.disabled = assessment && (!score.complete || id === "design");
    reset.textContent = word("reset", language);
    reset.title = word("resetTip", language);
    reset.disabled = !!demo;
    ribbon.hidden = mode !== "learn" || phase !== "try";
    ribbon.textContent = `${tr(`lessons.${id}.title`)} · ${activeStep && attempt?.prediction && !attempt.transfer ? activeStep.querySelector("strong").textContent : nextCheck ? word("remaining", language) + ": " + tr(`checks.${nextCheck[0]}`) : word("reviewReady", language)}`;
    document.querySelector(".coach-card > summary").textContent = word(
      "guide",
      language,
    );
    modelNote.textContent = word("model", language);
    if (lastLang !== language) {
      lastLang = language;
    }
  }
  return {
    render,
    endDemo,
    get demo() {
      return demo;
    },
    get phase() {
      return phase;
    },
    tick(ms) {
      typeSim.tick(ms);
      if (!demo) return;
      demo.tick(ms);
      const { language, tr } = api.get(),
        command = demo.commands[demo.index];
      const text = demo.done
        ? word("demoDone", language)
        : `${demo.index + 1}/${demo.commands.length} · ${command?.type === "gripper" ? tr(command.gripperState === "closed" ? "control.close" : "control.open") : command?.targetMm ? pos(command.targetMm) : (command?.name ?? "")}${demo.error ? " · " + tr(`error.${demo.error.code}`) : ""}`;
      if (text !== lastDemoCaption) {
        caption.textContent = text;
        lastDemoCaption = text;
      }
      if (demo.done) {
        demo.dispose();
        demo = null;
      }
      api.render();
    },
  };
}
