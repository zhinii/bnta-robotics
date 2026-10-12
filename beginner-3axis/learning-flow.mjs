import {
  createTaskPreview,
  createPracticeControls,
  PRACTICAL_LESSONS,
} from "./practical-presentation.mjs";
import { initialScene } from "./planner.mjs";
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
import { fk, distance, degreesToRadians, radiansToDegrees } from "./model.mjs";
import { createCoordinatePreview } from "./coordinate-presentation.mjs";
import { createAnatomyPreview } from "./anatomy-presentation.mjs";
import { createTypeSimulations, ROBOT_TYPES } from "./type-simulations.mjs";
import { createLessonGlossary } from "./lesson-glossary.mjs";
import { createAssessmentTutor } from "./assessment-tutor.mjs";
import { LESSON_UNITS } from "./lesson-units.mjs";
import { VOCABULARY } from "./lesson-vocabulary.mjs";
import { createDemoFocus } from "./demo-focus.mjs";
import { createDemoSequence, demoStep } from "./demo-sequence.mjs";

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
  const courseBridge = node("div", null, "course-robot");
  courseBridge.id = "course-focus-after-assessment";
  $("lesson-content").before(vocabulary, courseFocus);
  const typeHost = node("section", null, "type-simulations");
  typeHost.id = "type-simulations";
  $("lesson-content").after(typeHost);
  const typeSim = createTypeSimulations(typeHost, {
    advance: (direction) => advanceRobotType(direction),
    select: (index) => setPhase("understand", index),
  });
  const revisit = node("details", null, "assessment-demos");
  revisit.id = "assessment-demos";
  const revisitTitle = node("summary");
  const revisitButtons = node("div", null, "inline-actions");
  for (const [index, type] of ROBOT_TYPES.entries()) {
    const b = node("button");
    b.dataset.revisitType = type;
    b.onclick = () => {
      reviewingTypeDemo = true;
      assessmentReturnPhase = "try";
      setPhase("watch", index);
    };
    revisitButtons.append(b);
  }
  revisit.append(revisitTitle, revisitButtons);
  $("task-description").after(revisit);
  const returnToAssessment = node("button", null, "primary");
  returnToAssessment.id = "return-to-assessment";
  returnToAssessment.onclick = () => setPhase(assessmentReturnPhase);
  typeHost.after(returnToAssessment);
  const unitHost = node("section", null, "robot-slides lesson-unit");
  unitHost.id = "lesson-unit";
  unitHost.tabIndex = 0;
  const unitCounter = node("span", null, "slide-counter");
  const unitTitle = node("h3");
  const unitHeading = node("div", null, "slide-heading");
  unitHeading.append(unitCounter, unitTitle);
  const unitConcept = node("p", null, "robot-slide-description");
  unitHost.append(unitHeading, unitConcept);
  $("lesson-content").after(unitHost);
  unitHost.addEventListener("keydown", (e) => {
    if (
      !["ArrowLeft", "ArrowRight"].includes(e.key) ||
      e.target.closest("input,textarea,select")
    )
      return;
    e.preventDefault();
    advanceRobotType(e.key === "ArrowRight" ? 1 : -1);
  });
  let unitSwipe = null;
  unitHost.addEventListener("pointerdown", (e) => {
    if (e.button === 0 && !e.target.closest("button,.glossary-term"))
      unitSwipe = { x: e.clientX, y: e.clientY, id: e.pointerId };
  });
  unitHost.addEventListener("pointercancel", () => (unitSwipe = null));
  unitHost.addEventListener("pointerup", (e) => {
    if (!unitSwipe || e.pointerId !== unitSwipe.id) return;
    const dx = e.clientX - unitSwipe.x,
      dy = e.clientY - unitSwipe.y;
    unitSwipe = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3)
      advanceRobotType(dx < 0 ? 1 : -1);
  });
  const glossary = createLessonGlossary($("learning"));
  const assessmentNav = node("div", null, "assessment-nav");
  const predictStage = node("button");
  predictStage.id = "assessment-predict";
  let revisitPrediction = false;
  const operateStage = node("button"),
    reviewStage = node("button");
  operateStage.id = "assessment-operate";
  reviewStage.id = "phase-review";
  predictStage.onclick = () => {
    revisitPrediction = true;
    setPhase("try");
  };
  operateStage.onclick = () => {
    revisitPrediction = false;
    setPhase("try");
  };
  reviewStage.onclick = () => setPhase("review");
  assessmentNav.append(predictStage, operateStage, reviewStage);
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
  const exampleBody = node("div", null, "example-body");
  exampleBody.append(exampleText, demoActions, caption);
  const demoSequence = createDemoSequence("lesson-demo-sequence");
  exampleBody.append(demoSequence.root);
  example.append(exampleBody);
  const demoFocus = createDemoFocus(
    example,
    exampleBody,
    ".task-scene, #anatomy-scene, #coordinate-scene",
  );
  $("lesson-content").after(example);
  example.before(unitHost);
  const taskPreview = createTaskPreview();
  const taskControls = createPracticeControls(api);
  taskPreview.host.append(taskControls.viewControls);
  const practical = node("section", null, "lesson-practical");
  practical.id = "lesson-practical";
  practical.append(taskControls.root);
  const predictionRow = document.querySelector(".predict-row");
  const predictionHome = document.createComment(
    "Prediction form original position",
  );
  predictionRow.before(predictionHome);
  const practicalPrediction = node("section", null, "practical-prediction");
  practicalPrediction.id = "practical-prediction";
  const predictionHeading = node("h3"),
    practicalBrief = node("p"),
    writingHelp = node("p", null, "subtle");
  const predictionError = node("p", null, "writing-status");
  predictionError.id = "practical-prediction-status";
  predictionError.setAttribute("role", "status");
  const returnToOperation = node("button", null, "primary");
  returnToOperation.id = "return-to-operation";
  returnToOperation.onclick = () => {
    revisitPrediction = false;
    setPhase("try");
  };
  practicalPrediction.append(
    predictionHeading,
    practicalBrief,
    writingHelp,
    predictionError,
    returnToOperation,
  );
  practical.append(practicalPrediction);
  example.after(practical);
  const reviewEvidence = node("section", null, "review-evidence");
  reviewEvidence.id = "review-evidence";
  const reviewTitle = node("h3"),
    evidenceItems = node("div", null, "evidence-items");
  reviewEvidence.append(reviewTitle, evidenceItems);
  $("answer-form").before(reviewEvidence);
  let reviewSignature = "";
  const anatomyPreview = createAnatomyPreview();
  const coordinatePreview = createCoordinatePreview();
  const coordinateOperation = node("section", null, "coordinate-operation");
  coordinateOperation.id = "coordinate-operation";
  const coordinatePrompt = node("p");
  const coordinateControls = node("div", null, "coordinate-controls");
  const zLabel = node("label"),
    zText = node("span"),
    zInput = node("input");
  zInput.id = "lesson-z-target";
  zInput.type = "number";
  zInput.step = "0.1";
  zInput.inputMode = "decimal";
  zLabel.append(zText, zInput);
  const coordinateMove = node("button", null, "primary");
  coordinateMove.id = "lesson-z-move";
  const coordinateFeedback = node("p");
  coordinateFeedback.id = "coordinate-feedback";
  coordinateFeedback.setAttribute("role", "status");
  const jointComparison = node("p", null, "joint-comparison");
  jointComparison.id = "joint-comparison";
  coordinateControls.append(zLabel, coordinateMove, $("inspect-joints"));
  coordinateOperation.append(
    coordinatePrompt,
    coordinateControls,
    coordinateFeedback,
    jointComparison,
  );
  example.after(coordinateOperation);
  let coordinateAttempt = null,
    coordinateStart = null;
  coordinateMove.onclick = () => {
    const { c, language } = api.get();
    if (!zInput.value.trim() || !Number.isFinite(Number(zInput.value))) {
      coordinateFeedback.textContent =
        language === "zh"
          ? "请输入目标Z坐标。"
          : "Enter a target Z coordinate.";
      return;
    }
    c.setRecording(false);
    for (const axis of ["x", "y"]) c.editTarget(axis, coordinateStart[axis]);
    c.editTarget("z", zInput.value);
    const result = c.move();
    api.report(result);
    coordinateFeedback.textContent =
      result.ok === false
        ? language === "zh"
          ? "无法完成此次移动，请检查目标坐标。"
          : "This move could not start. Check the target coordinate."
        : language === "zh"
          ? "观察工具和关节。"
          : "Watch the tool and joints.";
  };
  const anatomyOperation = node("section", null, "anatomy-operation");
  anatomyOperation.id = "anatomy-operation";
  const anatomyInstruction = node("p");
  const anatomyReadout = node("output");
  anatomyReadout.id = "anatomy-joint-angle";
  const anatomyActions = node("div", null, "inline-actions");
  for (const direction of [-1, 1]) {
    const b = node("button", `${direction > 0 ? "+" : "−"}10°`, "primary");
    b.id = direction > 0 ? "anatomy-turn-plus" : "anatomy-turn-minus";
    b.onclick = () => {
      const { c } = api.get();
      c.setRecording(false);
      api.report(
        c.startAction({
          type: "jointDemo",
          jointIndex: 0,
          angleRad:
            c.state.scene.actualJoints[0] + degreesToRadians(direction * 10),
        }),
      );
    };
    anatomyActions.append(b);
  }
  anatomyOperation.append(anatomyInstruction, anatomyReadout, anatomyActions);
  example.after(anatomyOperation);
  const continueReason = node("button", null, "continue-reason");
  continueReason.id = "anatomy-continue-reason";
  continueReason.onclick = () => {
    const lessonId = api.get().learning.currentLessonId;
    const checks = evaluateLesson(api.get().learning).checks;
    if (PRACTICAL_LESSONS.includes(lessonId)) {
      if (
        Object.entries(checks).some(
          ([k, v]) => k !== "reflectionSuppliedAfterAttempt" && !v,
        )
      )
        setPhase("try");
      else {
        $("reflection").focus();
        $("reflection").scrollIntoView?.({ block: "center" });
      }
      return;
    }
    if (lessonId === "design") {
      (!checks.prediction
        ? $("prediction")
        : !checks.proposalFieldsSupplied
          ? $("answer-form")
          : $("reflection")
      ).scrollIntoView?.({ block: "center" });
      return;
    }
    if (
      !checks.prediction ||
      (api.get().learning.currentLessonId === "anatomy" &&
        !checks.jointOperated) ||
      (api.get().learning.currentLessonId === "coordinates" &&
        (!checks.committedTenMillimetresZ || !checks.multipleJointsInspected))
    )
      setPhase("try");
    else if (
      api.get().learning.currentLessonId === "coordinates" &&
      !checks.calculationVerified
    )
      $("calc-displacement").focus();
    else if (
      api.get().learning.currentLessonId !== "coordinates" &&
      !(checks.allPartsIdentified || checks.allBodyPlansMatched)
    )
      ($("answer-feedback-summary") ?? $("answer-form"))?.scrollIntoView?.({
        block: "center",
      });
    else {
      $("reflection").focus();
      $("reflection").scrollIntoView?.({ block: "center" });
    }
  };
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
  const writingStatus = node("p", null, "writing-status");
  writingStatus.id = "practical-reflection-status";
  writingStatus.setAttribute("role", "status");
  $("save-reflection").after(writingStatus);
  $("reflection").addEventListener("input", () => {
    if (PRACTICAL_LESSONS.includes(api.get().learning.currentLessonId))
      writingStatus.textContent =
        api.get().language === "zh"
          ? "尚未保存。写完后按“保存解释”。"
          : "Not saved yet. Choose Save explanation when you finish.";
  });
  const math = node("section", null, "math-pane");
  math.id = "math-pane";
  const mathTitle = node("h3"),
    measurementText = node("p");
  measurementText.id = "measurement";
  const measurementDiagram = node("div", null, "measurement-diagram");
  measurementDiagram.id = "measurement-diagram";
  math.append(mathTitle, measurementDiagram, measurementText);
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
  const tutor = createAssessmentTutor(api, reflection);
  const replayLesson = node("button");
  replayLesson.id = "assessment-replay-example";
  $("task-description").after(replayLesson);
  replayLesson.onclick = () => {
    reviewingTypeDemo = true;
    assessmentReturnPhase = phase;
    setPhase("watch");
  };
  const reasoning = node("p", null, "subtle");
  reflection.append(reasoning);
  const lessonFooter = node("div", null, "lesson-navigation"),
    back = node("button"),
    next = node("button", null, "primary");
  back.id = "phase-back";
  next.id = "phase-next";
  lessonFooter.append(back, next);
  $("learning").append(lessonFooter);
  lessonFooter.before(continueReason);
  lessonFooter.before(courseBridge);
  phaseNav.after(lessonFooter);
  lessonFooter.setAttribute("role", "navigation");
  lessonFooter.setAttribute("aria-label", "Lesson navigation / 课程导航");
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
  watchButton.onclick = () => {
    if (api.get().learning.currentLessonId !== "types" && phase !== "watch")
      setPhase("watch");
    startDemo();
  };
  stopButton.onclick = () => {
    endDemo();
    api.render();
  };
  back.onclick = () => {
    if (phase !== "review") advanceRobotType(-1);
    else setPhase(PHASES[Math.max(0, PHASES.indexOf(phase) - 1)]);
  };
  next.addEventListener("click", () => {
    const { learning } = api.get();
    if (
      PRACTICAL_LESSONS.includes(learning.currentLessonId) &&
      phase === "try" &&
      (!currentAttempt(learning)?.prediction || revisitPrediction)
    ) {
      if (currentAttempt(learning)?.prediction) {
        revisitPrediction = false;
        setPhase("try");
      } else $("save-prediction").click();
      return;
    }
    if (
      learning.currentLessonId === "types" &&
      phase === "watch" &&
      reviewingTypeDemo
    ) {
      setPhase(assessmentReturnPhase);
      return;
    }
    if (
      phase === "review" ||
      (phase === "try" &&
        ["types", "design"].includes(learning.currentLessonId))
    ) {
      const idx = LESSONS.findIndex((l) => l.id === learning.currentLessonId);
      if (idx < LESSONS.length - 1) api.startLesson(LESSONS[idx + 1].id);
      else $("export-json").click();
    } else if (["vocabulary", "understand", "watch"].includes(phase))
      advanceRobotType(1);
    else setPhase(PHASES[PHASES.indexOf(phase) + 1]);
  });
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
    for (const [key, expected] of [
      ["displacement", m?.displacementZ],
      ["distance", m?.distanceMm],
      ["speed", m?.speedMmS],
    ]) {
      const input = $(`calc-${key}`);
      const valid =
        input.value.trim() !== "" &&
        Number.isFinite(expected) &&
        Math.abs(Number(input.value) - expected) <= 0.15;
      input.setAttribute("aria-invalid", String(!valid));
      const label = input.closest("label");
      label.dataset.answerState = valid ? "correct" : "review";
      let feedback = label.querySelector("small");
      if (!feedback) {
        feedback = node("small");
        label.append(feedback);
      }
      feedback.textContent = valid
        ? language === "zh"
          ? "✓ 正确"
          : "✓ Correct"
        : language === "zh"
          ? "↻ 再想一想"
          : "↻ Take another look";
    }
    api.persist();
    api.render();
    $("answer-form").dispatchEvent(
      new document.defaultView.CustomEvent("assessment-submitted"),
    );
  };
  let robotTypeIndex = 0;
  let reviewingTypeDemo = false;
  let assessmentReturnPhase = "try";
  let phase = "vocabulary",
    lessonAttempt = null,
    lastLang = "",
    demo = null,
    lastDemoScene = null,
    lastDemoCaption = "",
    routeSignature = "";
  let demoScriptKey = "",
    demoCommands = [],
    demoIndex = -1,
    demoState = "ready";
  let vocabularyKey = "";
  function advanceRobotType(direction) {
    const id = api.get().learning.currentLessonId;
    if (LESSONS.some((l) => l.id === id)) {
      const count =
        id === "types" ? ROBOT_TYPES.length : LESSON_UNITS[id].length;
      const index =
        phase === "vocabulary"
          ? direction > 0
            ? 0
            : -1
          : ["try", "review"].includes(phase)
            ? count - 1
            : robotTypeIndex + direction;
      if (index < 0) setPhase("vocabulary", 0);
      else if (index >= count) setPhase("try", count - 1);
      else setPhase("understand", index);
      return;
    }
    const last =
      (id === "types" ? ROBOT_TYPES.length : LESSON_UNITS[id].length) * 2;
    const current =
      phase === "vocabulary"
        ? -1
        : ["try", "review"].includes(phase)
          ? last
          : robotTypeIndex * 2 + (phase === "watch" ? 1 : 0);
    const step = Math.max(-1, Math.min(last, current + direction));
    if (step < 0) setPhase("vocabulary", 0);
    else if (step === last) setPhase("try", last / 2 - 1);
    else setPhase(step % 2 ? "watch" : "understand", Math.floor(step / 2));
  }
  function setPhase(p, index = robotTypeIndex) {
    demoFocus.clear();
    if (p !== "try") revisitPrediction = false;
    const stayInConcept =
      LESSONS.some((l) => l.id === api.get().learning.currentLessonId) &&
      index === robotTypeIndex &&
      ["understand", "watch"].includes(p) &&
      ["understand", "watch"].includes(phase);
    glossary.close();
    endDemo(false);
    lastDemoScene = null;
    phase = p;
    if (p !== "watch") reviewingTypeDemo = false;
    robotTypeIndex = index;
    const { learning } = api.get();
    learning.presentation = {
      phase,
      lessonId: learning.currentLessonId,
      robotTypeIndex,
    };
    api.persist();
    api.render();
    if (stayInConcept) {
      (api.get().learning.currentLessonId === "types"
        ? typeHost
        : unitHost
      ).scrollIntoView?.({ block: "start", behavior: "instant" });
      return;
    }
    rail.scrollTo?.({ top: 0, behavior: "instant" });
    if (
      phase === "try" &&
      PRACTICAL_LESSONS.includes(api.get().learning.currentLessonId) &&
      currentAttempt(api.get().learning)?.prediction &&
      !revisitPrediction
    )
      $(
        matchMedia("(max-width: 700px)").matches
          ? "learning"
          : "lesson-practical",
      ).scrollIntoView?.({
        block: "start",
        behavior: "instant",
      });
    if (["vocabulary", "understand", "watch"].includes(phase))
      $("learning").scrollIntoView?.({ block: "start", behavior: "instant" });
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
    lastDemoScene = null;
    demo = new LessonDemo(
      learning.currentLessonId,
      LESSON_UNITS[learning.currentLessonId]?.[robotTypeIndex]?.kind,
    );
    demoCommands = demo.commands;
    demoIndex = -1;
    demoState = "playing";
    caption.textContent = copy(learning.currentLessonId, "demo", language);
    lastDemoCaption = "";
    api.render();
    demoFocus.focus();
  }
  function endDemo(announce = true) {
    if (demo) {
      demo.dispose();
      demo = null;
      demoState = "stopped";
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
      revisitPrediction = false;
      endDemo(false);
      demoScriptKey = "";
      lessonAttempt = key;
      lastDemoScene = null;
      reviewingTypeDemo = false;
      phase =
        learning.presentation?.lessonId === id
          ? learning.presentation.phase
          : "vocabulary";
      if (!PHASES.includes(phase)) phase = "vocabulary";
      const savedIndex =
        learning.presentation?.lessonId === id
          ? learning.presentation.robotTypeIndex
          : 0;
      robotTypeIndex = Number.isInteger(savedIndex)
        ? Math.max(
            0,
            Math.min(
              (id === "types" ? ROBOT_TYPES.length : LESSON_UNITS[id].length) -
                1,
              savedIndex,
            ),
          )
        : 0;
      caption.textContent = "";
      calcStatus.textContent = "";
      math.querySelectorAll("label").forEach((label) => {
        delete label.dataset.answerState;
        label.querySelector("small")?.remove();
        label.querySelector("input").removeAttribute("aria-invalid");
      });
      ["displacement", "distance", "speed"].forEach(
        (k) => ($(`calc-${k}`).value = ""),
      );
      const previousCalculation = learning.evidenceEvents
        .filter(
          (e) => e.attemptId === key && e.type === "CALCULATION_SUBMITTED",
        )
        .at(-1);
      if (id === "coordinates" && previousCalculation) {
        for (const name of ["displacement", "distance", "speed"])
          $(`calc-${name}`).value = previousCalculation.answers[name] ?? "";
        calcStatus.textContent = word(
          checkCalculation(
            latestMeasurement(learning),
            previousCalculation.answers,
          )
            ? "correct"
            : "retry",
          language,
        );
      }
    }
    document.body.dataset.mode = mode;
    document.body.dataset.phase = phase;
    const conceptual = ["types", "design"].includes(id);
    const assessment = phase === "review" || (phase === "try" && conceptual);
    revisit.hidden = id !== "types" || !assessment;
    revisitTitle.textContent =
      language === "zh" ? "重看本课演示" : "Revisit this lesson’s demos";
    for (const b of revisitButtons.children) {
      b.textContent = `▶ ${tr(`bodyPlans.${b.dataset.revisitType}.title`)}`;
    }
    returnToAssessment.hidden = phase !== "watch" || !reviewingTypeDemo;
    returnToAssessment.textContent =
      language === "zh" ? "返回评估 →" : "Return to assessment →";
    const sceneNeeded = mode === "explore";
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
    courseFocus.hidden = true;
    courseBridge.hidden = id !== "types" || !assessment || !score.complete;
    courseBridge.textContent =
      language === "zh"
        ? "机器人类型课程与评估已完成。接下来，本课程聚焦三轴关节式机械臂：J1底座旋转、J2肩关节、J3肘关节。夹爪独立开合，不算第四根定位轴。点击“下一课”认识它的部件。"
        : "Robot types lesson and assessment complete. From here, this course focuses on a three-axis articulated arm: J1 base rotation, J2 shoulder and J3 elbow. Opening and closing the gripper is a separate action, not a fourth positioning axis. Choose Next lesson to meet its parts.";
    courseFocus.textContent =
      language === "zh"
        ? "本课程聚焦这种机器人：三轴关节式机械臂。三个旋转关节定位工具，夹爪独立开合。点击“演示”观察它，再在后续操作中使用3D工作区。"
        : "Our course focuses on this robot: a three-axis articulated arm. Three rotating joints position its tool; the gripper opens and closes separately. See it in Demo, then use the 3D workspace for practical lessons.";
    typeHost.hidden =
      id !== "types" || !["understand", "watch"].includes(phase);
    typeSim.update(
      language,
      mode === "learn" && !typeHost.hidden,
      phase,
      tr,
      robotTypeIndex,
    );
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
      b.hidden =
        LESSONS.some((l) => l.id === id) && b.dataset.phase === "watch";
      if (id !== "anatomy" && b.dataset.phase === "understand")
        b.textContent = language === "zh" ? "概念与演示" : "Concept & example";
      if (id === "anatomy" && b.dataset.phase === "understand")
        b.textContent = language === "zh" ? "部件与演示" : "Parts in motion";
      b.setAttribute(
        "aria-current",
        String(
          b.dataset.phase === phase ||
            (LESSONS.some((l) => l.id === id) &&
              phase === "watch" &&
              b.dataset.phase === "understand") ||
            (phase === "review" && b.dataset.phase === "try"),
        ),
      );
      b.disabled = !!attempt?.transfer && b.dataset.phase === "watch";
    }
    goal.textContent = copy(id, "goal", language);
    brief.textContent = copy(id, "concept", language);
    brief.hidden = true;
    $("lesson-content").hidden = true;
    const unit = LESSON_UNITS[id]?.[robotTypeIndex];
    unitHost.hidden =
      id === "types" || !["understand", "watch"].includes(phase);
    if (unit) {
      unitCounter.textContent = `${robotTypeIndex + 1} / ${LESSON_UNITS[id].length}${id === "anatomy" ? "" : " · " + word(phase, language)}`;
      unitTitle.textContent = unit.title[language];
      unitConcept.textContent = unit.concept[language];
      unitConcept.hidden = false;
    }
    example.hidden = id === "types" || !["understand", "watch"].includes(phase);
    if (example.hidden) demoFocus.clear();
    example.dataset.playing = String(!!demo);
    const scriptKey = `${id}:${robotTypeIndex}`;
    if (!example.hidden && id !== "design") {
      if (demoScriptKey !== scriptKey) {
        demoFocus.clear();
        demoScriptKey = scriptKey;
        const preview = new LessonDemo(
          id,
          LESSON_UNITS[id]?.[robotTypeIndex]?.kind,
        );
        demoCommands = preview.commands;
        preview.dispose();
        demoIndex = -1;
        demoState = "ready";
      }
      demoSequence.update(
        demoCommands.map((command) => demoStep(command, language)),
        demoIndex,
        demoState,
        language,
      );
    }
    demoSequence.root.hidden = id === "design";
    example.classList.toggle("anatomy-example", id !== "types");
    coordinateOperation.hidden =
      id !== "coordinates" || phase !== "try" || !attempt?.prediction;
    coordinatePreview.figure.hidden =
      id !== "coordinates" ||
      phase === "vocabulary" ||
      phase === "review" ||
      (phase === "try" && !attempt?.prediction) ||
      mode !== "learn";
    if (!coordinatePreview.figure.hidden) {
      const parent = phase === "try" ? coordinateOperation : example;
      if (coordinatePreview.figure.parentElement !== parent)
        parent.prepend(coordinatePreview.figure);
      coordinatePreview.update(
        phase === "try"
          ? c.state.scene
          : (demo?.controller.state.scene ?? lastDemoScene ?? undefined),
        language,
      );
    }
    if (id === "coordinates" && coordinateAttempt !== key) {
      coordinateAttempt = key;
      const firstMove = learning.evidenceEvents.find(
        (e) => e.attemptId === key && e.type === "MOVE_COMPLETED" && e.verified,
      );
      coordinateStart = fk(
        firstMove?.before?.actualJoints ?? c.state.scene.actualJoints,
      ).C;
      zInput.value = coordinateStart.z.toFixed(1);
      coordinateFeedback.textContent = "";
    }
    if (id === "coordinates") {
      const m = latestMeasurement(learning);
      coordinatePrompt.textContent =
        language === "zh"
          ? `把工具抬高10毫米。起点Z = ${coordinateStart.z.toFixed(1)}毫米。计算目标Z并输入。X、Y保持不变。`
          : `Lift the tool 10 mm. Starting Z = ${coordinateStart.z.toFixed(1)} mm. Calculate and enter the target Z; X and Y stay fixed.`;
      zText.textContent =
        language === "zh" ? "目标 Z（毫米）" : "Target Z (mm)";
      coordinateMove.textContent = language === "zh" ? "移动" : "Move";
      coordinateMove.disabled = c.busy;
      zInput.disabled = c.busy;
      $("inspect-joints").disabled = !m || c.busy;
      jointComparison.hidden = !m || !score.checks.multipleJointsInspected;
      const event =
        m && learning.evidenceEvents.find((e) => e.id === m.eventId);
      if (event)
        jointComparison.textContent = event.before.actualJoints
          .map(
            (angle, i) =>
              `J${i + 1} ${radiansToDegrees(angle).toFixed(1)}° → ${radiansToDegrees(event.after.actualJoints[i]).toFixed(1)}°`,
          )
          .join(" · ");
      operateStage.textContent =
        language === "zh" ? "1 · 抬高工具" : "1 · Lift the tool";
      reviewStage.textContent =
        language === "zh" ? "2 · 测量与解释" : "2 · Measure & explain";
    }
    const taskLesson = PRACTICAL_LESSONS.includes(id);
    const planning =
      taskLesson &&
      phase === "try" &&
      (!attempt?.prediction || revisitPrediction);
    predictStage.hidden = !taskLesson;
    assessmentNav.classList.toggle("practical-stages", taskLesson);
    predictStage.textContent = language === "zh" ? "1 · 预测" : "1 · Predict";
    predictStage.setAttribute("aria-current", String(planning));
    operateStage.disabled = taskLesson && !attempt?.prediction;
    if (taskLesson) {
      operateStage.textContent = language === "zh" ? "2 · 操作" : "2 · Operate";
      reviewStage.textContent = language === "zh" ? "3 · 解释" : "3 · Explain";
      operateStage.setAttribute(
        "aria-current",
        String(phase === "try" && !planning),
      );
    }
    practical.hidden = !taskLesson || phase !== "try" || mode !== "learn";
    practicalPrediction.hidden = !planning;
    practical.classList.toggle("prediction-stage", planning);
    taskControls.root.hidden = planning;
    if (taskLesson) {
      if (predictionRow.parentElement !== practicalPrediction)
        practicalPrediction.insertBefore(predictionRow, predictionError);
      predictionHeading.textContent =
        language === "zh" ? "你的任务" : "Your task";
      practicalBrief.textContent = attempt?.transfer
        ? language === "zh"
          ? "独立规划、录制并测试到目标B的搬运。先说明你打算如何绕过障碍。"
          : "Independently plan, record and test a delivery to B. First predict how you will get around the obstacle."
        : copy(id, "goal", language);
      writingHelp.textContent = attempt?.prediction
        ? language === "zh"
          ? "这是操作前保存的预测。操作后可以在第3步比较实际结果。"
          : "This is your saved prediction. Compare it with the result in step 3."
        : language === "zh"
          ? "先在下面写一两句话。保存后会出现机器人操作控件。"
          : "Write one or two sentences below. Save to open the robot controls.";
      returnToOperation.hidden = !attempt?.prediction;
      returnToOperation.textContent =
        language === "zh" ? "返回操作 →" : "Return to operation →";
    } else if (predictionRow.parentElement !== predictionHome.parentElement)
      predictionHome.after(predictionRow);
    $("prediction").readOnly = taskLesson && !!attempt?.prediction;
    $("prediction").placeholder = taskLesson
      ? language === "zh"
        ? "在这里写下你的预测……"
        : "Write your prediction here…"
      : "";
    $("save-prediction").hidden = taskLesson && !!attempt?.prediction;
    $("save-prediction").textContent = taskLesson
      ? language === "zh"
        ? "保存预测并开始操作 →"
        : "Save prediction & operate →"
      : tr("control.savePrediction");
    taskPreview.figure.hidden =
      !(taskLesson || id === "design") ||
      phase === "vocabulary" ||
      (phase === "try" && !taskLesson) ||
      phase === "review" ||
      mode !== "learn";
    if (!taskPreview.figure.hidden) {
      const parent = phase === "try" ? practical : example;
      if (taskPreview.figure.parentElement !== parent)
        parent.prepend(taskPreview.figure);
      const state =
        phase === "try"
          ? c.state.scene
          : (demo?.controller.state.scene ??
            lastDemoScene ??
            initialScene({ obstacle: id === "obstacle" }));
      const activeTarget = c.operation?.commands[c.operation.index]?.targetMm;
      taskPreview.update({
        state,
        language,
        lesson: id,
        target:
          phase === "try"
            ? c.operation
              ? {
                  parsed: activeTarget ?? fk(state.actualJoints).C,
                  valid: true,
                }
              : {
                  parsed: c.state.target.parsed,
                  valid: !c.state.target.error,
                  error: c.state.target.error,
                }
            : null,
        ...taskControls.views(),
        programPoints:
          phase === "try" && c.state.program.startScene
            ? [
                fk(c.state.program.startScene.actualJoints).C,
                ...c.state.program.steps
                  .filter((step) => step.type === "move")
                  .map((step) => step.targetMm),
              ]
            : [],
        programValid: c.state.program.validationStatus !== "invalid",
        resetKey: `${key}:${phase === "try" ? (learning.evidenceEvents.findLast((e) => e.attemptId === attempt?.id && e.type === "SCENE_RESET")?.id ?? "start") : "example"}`,
      });
    }
    taskControls.update({
      lesson: id,
      language,
      active: !practical.hidden && !planning,
    });
    practical.dataset.playback = String(c.operation?.source === "replay");
    if (
      currentStep.parentElement !==
      (taskLesson ? taskControls.root : document.querySelector(".control-card"))
    )
      (taskLesson
        ? taskControls.root
        : document.querySelector(".control-card")
      ).insertBefore(
        currentStep,
        taskLesson
          ? taskControls.root.querySelector(".focused-coordinates")
          : document.querySelector(".control-card").firstChild,
      );
    reviewEvidence.hidden = !taskLesson || phase !== "review";
    if (!reviewEvidence.hidden) {
      reviewTitle.textContent =
        language === "zh" ? "你的实际测试" : "Your actual test";
      const signature = `${key}:${language}:${JSON.stringify(score.checks)}:${c.state.program.steps.length}`;
      if (signature !== reviewSignature) {
        reviewSignature = signature;
        evidenceItems.replaceChildren();
        const groups =
          id === "grip"
            ? [["actualObjectAttached"], ["objectLiftedTenMillimetres"]]
            : id === "program"
              ? [
                  [
                    "resetBeforeRecording",
                    "recordingEnabled",
                    "realRecordedActions",
                  ],
                  ["recordingTurnedOff", "resetAfterRecording"],
                  [
                    "replayStarted",
                    "replayPickedAndReleased",
                    "replayCompleted",
                  ],
                ]
              : attempt?.transfer
                ? [
                    ["newOrEditedProgram"],
                    [
                      "deliveredToB",
                      "destinationReallyChanged",
                      "replayCompleted",
                    ],
                    ["noHints"],
                  ]
                : [
                    ["directRouteRejectedWithoutMovement"],
                    ["sourceAndDestinationClearance"],
                    ["clearanceRouteDelivered"],
                  ];
        const completedLabels =
          id === "program"
            ? language === "zh"
              ? [
                  "从重置起点录制了动作",
                  "关闭录制并重置",
                  "重放完成：零件已放置",
                ]
              : [
                  "Actions recorded from a reset start",
                  "Recording OFF, then reset",
                  "Replay completed: part delivered",
                ]
            : null;
        for (const [index, group] of groups.entries()) {
          const passed = group.every((k) => score.checks[k]);
          const card = node("div", null, "evidence-card");
          card.dataset.complete = String(passed);
          card.append(
            node(
              "strong",
              `${passed ? "✓" : "○"} ${passed && completedLabels ? completedLabels[index] : tr(`checks.${group.find((k) => !score.checks[k]) ?? group[0]}`)}`,
            ),
          );
          if (!passed) {
            const b = node(
              "button",
              language === "zh" ? "返回操作 →" : "Return to practice →",
            );
            b.onclick = () => setPhase("try");
            card.append(b);
          }
          evidenceItems.append(card);
        }
      }
    }
    anatomyOperation.hidden =
      id !== "anatomy" || phase !== "try" || !attempt?.prediction;
    anatomyPreview.figure.hidden =
      id !== "anatomy" ||
      phase === "vocabulary" ||
      (phase === "try" && !attempt?.prediction) ||
      mode !== "learn";
    if (!anatomyPreview.figure.hidden) {
      const parent =
        phase === "review"
          ? $("answer-form")
          : phase === "try"
            ? anatomyOperation
            : example;
      if (anatomyPreview.figure.parentElement !== parent)
        parent.prepend(anatomyPreview.figure);
      anatomyPreview.update({
        language,
        unit: phase === "try" ? 0 : robotTypeIndex,
        state:
          phase === "try"
            ? c.state.scene
            : (demo?.controller.state.scene ?? lastDemoScene ?? undefined),
        assessment: phase === "review",
        focusJoint:
          demo?.commands[demo.index]?.jointIndex ??
          (phase === "try" ? 0 : undefined),
      });
    }
    anatomyInstruction.textContent =
      language === "zh"
        ? "转动J1，观察哪些部件一起移动。完成后进入“辨认与解释”。"
        : "Turn J1 and watch which parts move together. Then choose Identify & explain.";
    anatomyReadout.textContent = `J1 · ${radiansToDegrees(c.state.scene.actualJoints[0]).toFixed(0)}°`;
    for (const b of anatomyActions.children)
      b.disabled = c.busy || !attempt?.prediction;
    if (id === "anatomy") {
      operateStage.textContent =
        language === "zh" ? "1 · 试着转动关节" : "1 · Try a joint";
      reviewStage.textContent =
        language === "zh" ? "2 · 辨认与解释" : "2 · Identify & explain";
    }
    exampleText.textContent =
      unit?.demo[language] ?? copy(id, "demo", language);
    watchButton.textContent = word("watchNow", language);
    watchButton.disabled = c.busy || !!demo;
    stopButton.textContent = word("stopDemo", language);
    stopButton.hidden = !demo;
    $("task-description").textContent = copy(id, "task", language);
    $("task-description").hidden =
      taskLesson ||
      phase !== "try" ||
      (id !== "design" && !!attempt?.prediction);
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
    predictionRow.hidden = taskLesson
      ? !planning
      : phase !== "try" || !!attempt?.prediction;
    $("prediction").previousElementSibling.textContent = copy(
      id,
      "prediction",
      language,
    );
    predictionNote.textContent = word(
      attempt?.prediction ? "predictSaved" : "recordFirst",
      language,
    );
    if (conceptual)
      predictionNote.textContent =
        language === "zh"
          ? attempt?.prediction
            ? "回答已保存。请完成下方的评估与解释。"
            : "先说明你的选择及理由，再完成下方的评估。"
          : attempt?.prediction
            ? "Your response is saved. Complete the assessment and explanation below."
            : "Start with your choice and reasoning, then complete the assessment below.";
    predictionNote.hidden =
      taskLesson || phase !== "try" || !!attempt?.prediction;
    $("answer-form").hidden =
      !assessment || (conceptual && !attempt?.prediction);
    reflection.hidden =
      !assessment ||
      (conceptual && !attempt?.prediction) ||
      (["anatomy", "types"].includes(id) && !attempt?.answers) ||
      (id === "coordinates" && !score.checks.calculationVerified);
    const practicalComplete = Object.entries(score.checks)
      .filter(([k]) => k !== "reflectionSuppliedAfterAttempt")
      .every(([, v]) => v);
    if (taskLesson)
      reflection.hidden = phase !== "review" || !practicalComplete;
    if (id === "design" && !score.checks.proposalFieldsSupplied)
      reflection.hidden = true;
    reflectionPrompt.textContent = copy(id, "reflect", language);
    reflectionPrompt.hidden = taskLesson;
    reflection.classList.toggle("practical-reflection", taskLesson);
    if (taskLesson) reflection.open = true;
    reflection.querySelector("summary").textContent = taskLesson
      ? language === "zh"
        ? "解释你的结果"
        : "Explain your result"
      : tr("control.reflection");
    $("reflection").previousElementSibling.textContent = taskLesson
      ? copy(id, "reflect", language)
      : tr("control.reflection");
    $("reflection").placeholder = taskLesson
      ? language === "zh"
        ? "在这里描述你观察到的结果及其原因……"
        : "Write what you observed and why here…"
      : "";
    $("reflection").rows = taskLesson ? 4 : 2;
    $("save-reflection").textContent = taskLesson
      ? language === "zh"
        ? "保存解释"
        : "Save explanation"
      : tr("control.saveReflection");
    writingStatus.hidden = !taskLesson;
    if (taskLesson)
      writingStatus.textContent =
        attempt?.reflection && $("reflection").value === attempt.reflection
          ? language === "zh"
            ? "解释已保存，可进入下一课。"
            : "Explanation saved. You can continue to the next lesson."
          : "";
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
    if (conceptual && score.complete)
      pending.textContent =
        language === "zh"
          ? "评估证据已保存，请阅读下方总结。"
          : "Assessment evidence saved. Read the summary below.";
    pending.hidden = phase !== "try";
    taskGuide.hidden = true;
    if (routeSignature !== `${key}:${language}`) {
      routeSignature = `${key}:${language}`;
      renderRoute();
    }
    routeList.hidden =
      phase !== "try" || !attempt?.prediction || !!attempt?.transfer;
    routeDetails.hidden = routeList.hidden || !routeList.children.length;
    if (planning) routeDetails.hidden = true;
    routeSummary.textContent =
      language === "zh" ? "查看全部操作步骤" : "Show all practice steps";
    routeList
      .querySelectorAll("button:not(.glossary-term)")
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
        const original = activeStep.querySelector("button:not(.glossary-term)");
        if (original) {
          const use = node("button", word("use", language));
          use.id = "use-practice-target";
          use.onclick = () => original.click();
          currentStep.append(use);
        }
      }
      currentStep
        .querySelectorAll("button:not(.glossary-term)")
        .forEach((b) => (b.disabled = c.busy || !!demo));
    }
    math.hidden = phase !== "review" || id !== "coordinates";
    mathTitle.textContent = word("math", language);
    const m = latestMeasurement(learning);
    measurementText.textContent = m
      ? `${word("measured", language)}: Z ${m.from.z.toFixed(1)} → ${m.to.z.toFixed(1)} mm. ${word("time", language)}: ${m.seconds.toFixed(3)} s.`
      : word("noMeasure", language);
    measurementDiagram.hidden = !m;
    if (m) {
      const signature = `${m.eventId}:${language}`;
      if (measurementDiagram.dataset.signature !== signature) {
        measurementDiagram.dataset.signature = signature;
        measurementDiagram.replaceChildren();
        measurementDiagram.append(
          node(
            "span",
            `${language === "zh" ? "终点" : "Finish"} · Z ${m.to.z.toFixed(1)} mm`,
          ),
          node("span", "↑", "measurement-arrow"),
          node(
            "span",
            `${language === "zh" ? "起点" : "Start"} · Z ${m.from.z.toFixed(1)} mm`,
          ),
        );
      }
    }
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
    if (id === "types" && !assessment) {
      next.textContent =
        phase === "understand"
          ? language === "zh"
            ? "观看此机器人的演示 →"
            : "See this robot in action →"
          : phase === "watch"
            ? robotTypeIndex === ROBOT_TYPES.length - 1
              ? language === "zh"
                ? "开始评估 →"
                : "Go to assessment →"
              : `${tr(`bodyPlans.${ROBOT_TYPES[robotTypeIndex + 1]}.title`)} →`
            : word("next", language);
    }
    if (id !== "types" && ["understand", "watch"].includes(phase)) {
      next.textContent =
        phase === "understand"
          ? language === "zh"
            ? "查看此概念的演示 →"
            : "See this concept in action →"
          : robotTypeIndex < LESSON_UNITS[id].length - 1
            ? `${LESSON_UNITS[id][robotTypeIndex + 1].title[language]} →`
            : language === "zh"
              ? "开始评估 →"
              : "Go to assessment →";
    }
    next.disabled = assessment && !score.complete;
    if (taskLesson && phase === "try") {
      next.disabled = c.busy;
      next.textContent = planning
        ? attempt?.prediction
          ? returnToOperation.textContent
          : language === "zh"
            ? "开始操作 →"
            : "Begin operation →"
        : language === "zh"
          ? "查看结果并解释 →"
          : "Review & explain →";
    }
    if (id === "design" && assessment)
      next.textContent =
        language === "zh" ? "保存项目 JSON ↓" : "Save project JSON ↓";
    if (id === "anatomy" && phase === "try")
      next.textContent =
        language === "zh" ? "辨认与解释 →" : "Identify & explain →";
    if (
      LESSONS.some((l) => l.id === id) &&
      ["understand", "watch"].includes(phase)
    )
      next.textContent =
        robotTypeIndex <
        (id === "types" ? ROBOT_TYPES.length : LESSON_UNITS[id].length) - 1
          ? `${language === "zh" ? "下一节：" : "Next: "}${id === "types" ? tr(`bodyPlans.${ROBOT_TYPES[robotTypeIndex + 1]}.title`) : LESSON_UNITS[id][robotTypeIndex + 1].title[language]} →`
          : language === "zh"
            ? "开始评估 →"
            : "Start assessment →";
    continueReason.hidden =
      !LESSONS.some((l) => l.id === id) || !assessment || score.complete;
    if (!continueReason.hidden)
      continueReason.textContent = !score.checks.prediction
        ? language === "zh"
          ? "先到“试着转动关节”保存预测 →"
          : "First, save your prediction in Try a joint →"
        : !score.checks.jointOperated
          ? language === "zh"
            ? "还需亲自转动一次关节 →"
            : "Still needed: turn a joint yourself →"
          : !attempt?.answers
            ? language === "zh"
              ? "完成六题，然后提交答案。"
              : "Answer the six questions, then Submit answers."
            : !score.checks.allPartsIdentified
              ? language === "zh"
                ? "检查并修正标记的答案 →"
                : "Check and revise the marked answers →"
              : language === "zh"
                ? "保存你的解释，然后进入下一课 →"
                : "Save your explanation to continue →";
    if (!continueReason.hidden && id === "coordinates")
      continueReason.textContent = !score.checks.prediction
        ? language === "zh"
          ? "先保存预测 →"
          : "First, save a prediction →"
        : !score.checks.committedTenMillimetresZ
          ? language === "zh"
            ? "先完成抬高10毫米的移动 →"
            : "First, complete the 10 mm lift →"
          : !score.checks.multipleJointsInspected
            ? language === "zh"
              ? "观察移动前后的关节角度 →"
              : "Inspect the joint angles after your move →"
            : !score.checks.calculationVerified
              ? language === "zh"
                ? "完成并检查三个计算 →"
                : "Complete and check the three calculations →"
              : language === "zh"
                ? "保存解释即可继续 →"
                : "Save your explanation to continue →";
    if (!continueReason.hidden && id === "types")
      continueReason.textContent = !score.checks.prediction
        ? language === "zh"
          ? "先保存你的选择和理由 →"
          : "First, save your choice and reasoning →"
        : !score.checks.allBodyPlansMatched
          ? language === "zh"
            ? "完成五个情境并检查标记的答案 →"
            : "Complete the five scenarios and review marked answers →"
          : language === "zh"
            ? "保存解释即可继续 →"
            : "Save your explanation to continue →";
    if (
      !continueReason.hidden &&
      (PRACTICAL_LESSONS.includes(id) || id === "design")
    ) {
      const missing = Object.entries(score.checks).find(([, v]) => !v)?.[0];
      continueReason.textContent =
        missing === "reflectionSuppliedAfterAttempt"
          ? language === "zh"
            ? "保存你的解释即可继续 →"
            : "Save your explanation to continue →"
          : `${language === "zh" ? "下一步" : "Next"}: ${tr(`checks.${missing}`)} →`;
    }
    if (id === "coordinates" && phase === "try")
      next.textContent =
        language === "zh" ? "测量与解释 →" : "Measure & explain →";
    if (phase === "watch" && reviewingTypeDemo)
      next.textContent = returnToAssessment.textContent;
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
    replayLesson.hidden =
      id === "types" ||
      PRACTICAL_LESSONS.includes(id) ||
      id === "design" ||
      !["try", "review"].includes(phase) ||
      !!attempt?.transfer;
    replayLesson.textContent =
      language === "zh" ? "重看本课示例" : "Revisit this lesson’s example";
    tutor.render(
      mode === "learn" &&
        ["try", "review"].includes(phase) &&
        (["types", "design"].includes(id) || phase === "review"),
    );
    glossary.update(language);
    demoFocus.refresh();
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
      demoIndex = demo.index;
      demoState = demo.done
        ? demo.error && demo.error.code !== demo.commands.at(-1)?.expectedError
          ? "stopped"
          : "done"
        : "playing";
      const { language, tr } = api.get(),
        command = demo.commands[demo.index];
      let text = demo.done
        ? word("demoDone", language)
        : `${demo.index + 1}/${demo.commands.length} · ${command?.type === "gripper" ? tr(command.gripperState === "closed" ? "control.close" : "control.open") : command?.targetMm ? pos(command.targetMm) : (command?.name ?? "")}${demo.error ? " · " + tr(`error.${demo.error.code}`) : ""}`;
      if (demo.done && api.get().learning.currentLessonId === "coordinates") {
        const m = demo.controller.state.events
          .map(moveMeasurement)
          .filter(Boolean)
          .at(-1);
        if (m)
          text =
            language === "zh"
              ? `示例：${m.to.z.toFixed(1)} − ${m.from.z.toFixed(1)} = +${m.displacementZ.toFixed(1)}毫米；路程${m.distanceMm.toFixed(1)}毫米。${m.distanceMm.toFixed(1)} ÷ ${m.seconds.toFixed(3)}秒 ≈ ${m.speedMmS.toFixed(1)}毫米/秒。这是示例数据，评估将使用你自己的移动。`
              : `Worked example: ${m.to.z.toFixed(1)} − ${m.from.z.toFixed(1)} = +${m.displacementZ.toFixed(1)} mm; distance ${m.distanceMm.toFixed(1)} mm. ${m.distanceMm.toFixed(1)} ÷ ${m.seconds.toFixed(3)} s ≈ ${m.speedMmS.toFixed(1)} mm/s. These are example measurements; assessment uses your own move.`;
      }
      if (text !== lastDemoCaption) {
        caption.textContent = text;
        lastDemoCaption = text;
      }
      if (demo.done) {
        lastDemoScene = structuredClone(demo.controller.state.scene);
        demo.dispose();
        demo = null;
      }
      api.render();
    },
  };
}
