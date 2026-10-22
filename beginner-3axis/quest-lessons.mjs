import { pair as P, rootOptions } from "./quest-engine.mjs";
import { LessonDemo, practiceRoute, checkCalculation } from "./curriculum.mjs";
import { VOCABULARY } from "./lesson-vocabulary.mjs";
import { LESSON_UNITS } from "./lesson-units.mjs";
import { CORE_LESSONS, ROBOT_TYPES, startLessonFlow, validLessonFlow, observeLessonFlowEvent, lessonRequirements } from "./lesson-flow.mjs";
import { SCENARIOS, scenarioIllustration } from "./assessment-visuals.mjs";
import { createRobotTypeScene } from "./robot-type-scene.mjs";
import { initialScene } from "./planner.mjs";
import { t } from "./i18n.mjs";
import { validateStoredProgram, validateStoredScene } from "./storage.mjs";

const option = (command, en, zh) => ({ command, label: P(en, zh) });
const stageNames = { words: P("Explore words", "探索词汇"), tour: P("Guided tour", "导览"),
  practice: P("Practice", "练习"), reflection: P("Reflection", "反思"), complete: P("Complete", "完成") };
export function connectQuestLessons({ engine: e, controller: c, renderer, fillTarget, renderRobot, restored }) {
  const portfolio = [], archive = [];
  let attempt = null, unit = 0, demo = null, typeScene = null, type = null, elapsed = 0, demoDone = false, jobIndex = -1, visual = null;
  const world = document.getElementById("world"), host = document.createElement("div"), caption = document.createElement("div");
  host.className = "quest-visual"; host.hidden = true; caption.className = "quest-caption"; caption.hidden = true;
  world.append(host, caption);
  const lesson = () => CORE_LESSONS[attempt?.lesson ?? 0];
  const taskText = () => ({
    anatomy: P("Turn J1 by +10° or −10°. Observe which parts move with it, then reflect.", "将J1转动+10°或−10°，观察哪些部件随之运动，然后反思。"),
    coordinates: P("Keep X and Y unchanged, increase Z by 10 mm, and Move. Coach will report your measured numbers. Inspect joint changes; the calculation check is optional.", "保持X、Y不变，将Z增加10毫米后移动。教练将报告实测数值。可以查看关节变化，计算核对为可选活动。"),
    program: P("Reset → record on → perform the route → record off → reset → run. Review or reorder using Steps. Test Pause and Stop, then Reset and replay the full program. Finally choose Problem & improvement.", "重置→开启录制→执行路线→关闭录制→重置→运行。在“步骤”中查看或调整顺序。测试暂停和停止，再重置并完整回放。最后选择“问题与改进”。"),
  }[lesson().id] || lesson().task);
  const f = () => attempt?.flow;
  const independent = () => !!f()?.changed && !f().checks.deliveryB;
  const completedPractice = () => attempt?.lesson === 0 || lessonRequirements(attempt).filter(r =>
    r.key !== "calculated" && (r.key !== "deliveryB" || f().changed)).every(r => r.done);
  function keepProgram() {
    if (c.state.program.steps.length) archive.push({ at: Date.now(), program: structuredClone(c.state.program), scene: structuredClone(c.state.scene) });
    if (archive.length > 12) archive.shift();
  }
  function stopDemo() {
    demo?.dispose(); demo = null; type = null; visual = null; host.hidden = true; caption.hidden = true; renderRobot();
  }
  function showStep(stage, compact = false) {
    stopDemo(); f().stage = stage; f().awaiting = null; jobIndex = -1;
    e.awaiting = null; e.pendingPrompt = null; e.draft = "";
    e.activity("lesson:" + attempt.id + ":" + stage + ":" + !!f().changed, compact);
  }
  function questTitle() {
    e.post(P((attempt.lesson + 1) + " · " + lesson().title.en + "\n" + lesson().goal.en,
      (attempt.lesson + 1) + " · " + lesson().title.zh + "\n" + lesson().goal.zh), "quest");
    e.post(lesson().concept);
  }
  function words() {
    showStep("words");
    e.post(P("Explore any word. Tap it to read Coach's explanation and see its visual. You can start the tour whenever you are ready.",
      "可以按任意顺序探索词汇。点击查看教练讲解和对应视图。准备好后即可开始导览。"));
    wordOptions();
  }
  function wordOptions() {
    e.offer([...VOCABULARY[lesson().id].map((v, i) => option("word " + (i + 1), (f().visited.includes(v.en) ? "✓ " : "") + v.en, (f().visited.includes(v.en) ? "✓ " : "") + v.zh)),
      option("tour", "Start the tour →", "开始导览 →")]);
  }
  function word(index) {
    const term = VOCABULARY[lesson().id][index]; if (!term) return;
    if (!f().visited.includes(term.en)) f().visited.push(term.en);
    stopDemo();
    const map = { SCARA: "scara", Delta: "delta", Gantry: "cartesian", "Articulated arm": "articulated", "Mobile rover": "mobile" };
    if (map[term.en]) playType(map[term.en]);
    else {
      const joint = /base|joint|axis/i.test(term.en) ? 0 : /link|motor/i.test(term.en) ? 1 : /gripper|tool|effector/i.test(term.en) ? 2 : null;
      visual = { labels: true, namedLabels: true, focusJoint: joint, ghost: false };
      renderer.update(c.state.scene, c.state.target, { language: e.language, ...visual });
      caption.message = P(term.en, term.zh); caption.textContent = e.text(caption.message); caption.hidden = false;
    }
    e.post(P(term.en + " · " + term.meaning, term.zh + " · " + term.meaningZh));
    wordOptions();
  }
  function playType(id) {
    stopDemo(); type = id; elapsed = 0; demoDone = false; host.hidden = false;
    typeScene ??= createRobotTypeScene(host); typeScene.draw(type, 0, e.text(P(t("en", "bodyPlans." + type + ".title"), t("zh", "bodyPlans." + type + ".title"))));
  }
  function tour(index = 0) {
    if (independent()) return noHint();
    const total = attempt.lesson === 0 ? 5 : LESSON_UNITS[lesson().id].length;
    unit = Math.max(0, Math.min(total - 1, index));
    showStep("tour");
    e.activity("lesson:" + attempt.id + ":tour:" + unit);
    if (attempt.lesson === 0) {
      const id = ROBOT_TYPES[unit];
      e.post(P(t("en", "bodyPlans." + id + ".title") + "\n" + t("en", "bodyPlans." + id + ".description") + "\n" + t("en", "bodyPlans." + id + ".job"),
        t("zh", "bodyPlans." + id + ".title") + "\n" + t("zh", "bodyPlans." + id + ".description") + "\n" + t("zh", "bodyPlans." + id + ".job")));
      playType(id);
    } else {
      const item = LESSON_UNITS[lesson().id][unit];
      e.post(P(item.title.en + "\n" + item.concept.en + "\n" + item.demo.en,
        item.title.zh + "\n" + item.concept.zh + "\n" + item.demo.zh));
      demo = new LessonDemo(lesson().id, item.kind); demoDone = false;
    }
    e.offer([option("replay", "Replay ↻", "重播 ↻"), ...(unit ? [option("back", "← Back", "← 上一步")] : []),
      option("next", unit === total - 1 ? "Try it yourself →" : "Next →", unit === total - 1 ? "亲自尝试 →" : "下一步 →"),
      option("practice", "Skip to practice", "跳至练习")]);
  }
  function ask(kind, message) { f().awaiting = kind; e.prompt(kind, message); }
  function practice() {
    showStep("practice");
    if (attempt.lesson === 0) {
      f().setup = true;
      e.post(P("Explore the five robot bodies and replay their motion. You can also drive the lab arm using move X Y Z. Reflect when you are ready; the illustrated job matches are optional.",
        "探索五种机器人构型并重播其运动。也可以输入“移动 X Y Z”操作实验机械臂。准备好即可反思；图示工作匹配为可选活动。"));
      practiceOptions(); return;
    }
    if (!attempt.prediction) ask("prediction", lesson().prediction);
    else prepare();
  }
  function prepare(changed = false) {
    keepProgram();
    stopDemo(); f().setup = false;
    c.clearProgram(true);
    c.changeScene(initialScene({ obstacle: attempt.lesson === 5, destination: changed ? "destinationB" : "destinationA" }));
    f().setup = true; f().changed = changed; attempt.eventFloor = c.sequence; attempt.seen = [];
    if (!changed) { f().checks = {}; delete f().attachedAt; delete attempt.measurement; }
    showStep("practice", true); fillTarget();
    e.post(changed ? P("Optional independent route to B. Record and replay your route. Target shortcuts, hints and examples are paused. You may return to reflection without this extension.",
      "可选独立任务：录制并回放到B的路线。暂停目标快捷按钮、提示和示例。也可以不完成此拓展，直接返回反思。") : taskText());
    if (!changed && [3, 4, 5].includes(attempt.lesson)) targets();
    practiceOptions();
  }
  function targets() {
    if (independent()) return noHint();
    let targetNumber = 0;
    const names = { "Source approach": "接近起点", Pickup: "抓取位置", "Lift 10 mm": "抬高10毫米", "Lift to clearance": "抬高至净空高度",
      "Transfer above destination": "移动至终点上方", "Destination approach": "接近终点", Place: "放置", Retreat: "退回", "Test direct route": "测试直线路径" };
    const lines = [], zhLines = [], choices = [];
    for (const [i, step] of practiceRoute(lesson().id, c.state.scene).entries()) {
      if (step.type === "move") {
        targetNumber++;
        const p = step.targetMm, coordinates = "X " + p.x.toFixed(1) + " Y " + p.y.toFixed(1) + " Z " + p.z.toFixed(1) + " mm";
        lines.push((i + 1) + ". " + step.name + " · " + coordinates);
        zhLines.push((i + 1) + ". " + (names[step.name] || step.name) + " · " + coordinates);
        choices.push(option("use target " + targetNumber, "Preview " + (i + 1), "预览 " + (i + 1)));
      } else {
        lines.push((i + 1) + ". " + (step.gripperState === "closed" ? "Close; confirm Object held" : "Open to place"));
        zhLines.push((i + 1) + ". " + (step.gripperState === "closed" ? "闭合并确认已夹持" : "张开并放置"));
      }
    }
    e.post(P("Start with open jaws. Preview only fills your target; Move executes.\n" + lines.join("\n"),
      "从夹爪张开开始。预览只填写目标，点击移动才会执行。\n" + zhLines.join("\n")), "coach", { choices });
  }
  function practiceOptions() {
    if (f().stage !== "practice") return;
    const choices = [];
    if (attempt.lesson === 0) {
      ROBOT_TYPES.forEach((id, i) => choices.push(option("robot " + (i + 1), t("en", "bodyPlans." + id + ".title"), t("zh", "bodyPlans." + id + ".title"))));
      choices.push(option("jobs", "Match job examples (optional)", "匹配工作示例（可选）"));
    }
    if (attempt.lesson === 1) choices.push(option("j1 -10", "J1 −10°", "J1 −10°"), option("j1 +10", "J1 +10°", "J1 +10°"));
    if (attempt.measurement) choices.push(option("inspect", "Inspect joint changes", "查看关节变化"), option("calculate", "Explain & check (optional)", "解释与核对（可选）"));
    if (attempt.lesson === 4 && f().checks.transfer && !f().checks.problemNote) choices.push(option("program note", "Problem & improvement", "问题与改进"));
    if (attempt.lesson === 5 && f().checks.deliveryA && !f().changed) choices.push(option("changed task", "Optional: route to B", "可选：规划到B"));
    if (independent()) choices.push(option("skip extension", "Return to reflection", "返回反思"));
    if (completedPractice()) choices.push(option("reflect", "To reflection →", "进入反思 →"));
    choices.push(option("controls", "Controls", "控制"), option("status", "Progress", "进度"), option("menu", "Menu", "菜单"));
    e.offer(choices);
  }
  function noHint() { e.post(P("Use your own route for this optional independent attempt. Coordinates and controller feedback remain available.", "此可选独立任务请自行规划路线，仍可使用坐标和控制器反馈。")); return true; }
  function job() {
    const s = SCENARIOS[jobIndex];
    if (!s) { f().checks.jobs = "response"; e.post(P("Your choices are saved for discussion, without a score.", "选择已保存用于讨论，不评分。")); jobIndex = -1; practiceOptions(); return; }
    e.collapsed = false;
    e.post(P(s.prompt, s.promptZh), "coach", { scenario: s.id });
    e.offer(ROBOT_TYPES.map((id, i) => option("choose " + (i + 1), t("en", "bodyPlans." + id + ".title"), t("zh", "bodyPlans." + id + ".title"))));
  }
  function reflect() {
    if (!completedPractice()) { status(); return; }
    showStep("reflection"); ask("reflection", P("What did you learn?", "你学到了什么？"));
  }
  function status() {
    if (!attempt) return;
    const labels = { j1: P("Turn J1 by 10°", "J1转动10°"), up10: P("Move up 10 mm", "上移10毫米"), calculated: P("Calculation checked", "计算已核对"),
      attached: P("Actual grasp", "实际夹持"), lift10: P("Lift held part 10 mm", "夹持后抬高10毫米"), reset: P("Reset", "重置"),
      recordOn: P("Record on", "开启录制"), recordOff: P("Record off", "关闭录制"), paused: P("Pause replay", "暂停回放"),
      stopped: P("Stop replay", "停止回放"), transfer: P("Complete replay to A", "完整回放至A"), problemNote: P("Problem and improvement", "问题与改进"),
      blocked: P("Test blocked route", "测试受阻路线"), deliveryA: P("Deliver to A", "送达A"), deliveryB: P("Optional replay to B", "可选回放至B"), jobs: P("Optional job discussion", "可选工作讨论") };
    const requirements = lessonRequirements(attempt);
    e.post(P("Progress · " + stageNames[f().stage].en + "\n" + requirements.map(r => (r.done ? "✓ " : "○ ") + labels[r.key].en).join("\n"),
      "进度 · " + stageNames[f().stage].zh + "\n" + requirements.map(r => (r.done ? "✓ " : "○ ") + labels[r.key].zh).join("\n")));
  }
  const adapter = {
    command(text, cmd) {
      if (cmd.type === "lessons") {
        stopDemo(); e.activity("lessons"); e.collapsed = false;
        e.post(P("Choose a lesson. Each conversation moves through words, tour, practice and reflection.", "选择课程，每段对话依次经历词汇、导览、练习和反思。"), "quest");
        e.offer(CORE_LESSONS.map((l, i) => option("lesson " + (i + 1),
          (portfolio.some(a => a.lesson === i && a.flow.stage === "complete") ? "✓ " : "") + (i + 1) + " · " + l.title.en,
          (portfolio.some(a => a.lesson === i && a.flow.stage === "complete") ? "✓ " : "") + (i + 1) + " · " + l.title.zh)));
        return true;
      }
      if (cmd.type === "lesson") {
        if (!CORE_LESSONS[cmd.index]) { e.post(P("Choose lesson 1–6.", "请选择第1至6课。")); return true; }
        if (c.busy) { e.post(P("Stop the current motion before changing lessons.", "切换课程前请停止当前运动。")); return true; }
        attempt = { id: crypto.randomUUID(), lesson: cmd.index, prediction: "", reflection: "", eventFloor: c.sequence, seen: [], evidence: [] };
        startLessonFlow(attempt); portfolio.push(attempt); questTitle(); words(); return true;
      }
      if (!attempt) return false;
      const aliases = { 词汇: "words", 导览: "tour", 练习: "practice", 反思: "reflect", 变化任务: "changed task", 计算: "calculate",
        查看关节: "inspect", 重播: "replay", 问题与改进: "program note", 返回反思: "skip extension", 目标列表: "targets" };
      const action = aliases[text.toLowerCase()] || text.toLowerCase();
      if (c.busy && ["words", "tour", "practice", "reflect", "changed task", "skip extension", "replay", "next", "back"].includes(action)) {
        e.post(P("Stop or finish the current action first.", "请先停止或完成当前动作。")); return true;
      }
      if (independent() && (["back", "example", "hint"].includes(cmd.type) || ["words", "tour", "replay", "example", "hint", "targets"].includes(action) || /^(word|robot|use target) /.test(action))) return noHint();
      if (action === "words") { words(); return true; }
      if (action === "tour") { tour(); return true; }
      if (action === "practice") { practice(); return true; }
      if (action === "reflect") { reflect(); return true; }
      if (action === "replay" || cmd.type === "example") { tour(unit); return true; }
      if (cmd.type === "next") {
        if (f().stage === "words") tour();
        else if (f().stage === "tour") {
          const total = attempt.lesson === 0 ? 5 : LESSON_UNITS[lesson().id].length;
          if (unit + 1 < total) tour(unit + 1);
          else { e.post(P("That's the tour. Time to try it yourself.", "导览结束，现在亲自试试。")); practice(); }
        } else if (f().stage === "practice") reflect();
        else if (f().stage === "complete") e.submit(attempt.lesson < 5 ? "/lesson " + (attempt.lesson + 2) : "/lessons");
        return true;
      }
      if (cmd.type === "back") { if (f().stage === "tour" && unit) tour(unit - 1); else words(); return true; }
      if (cmd.type === "hint") { if (independent()) noHint(); else e.post(taskText()); return true; }
      if (action === "targets") { targets(); return true; }
      if (action === "changed task") { if (attempt.lesson === 5 && f().checks.deliveryA) prepare(true); return true; }
      if (action === "skip extension") { f().changed = false; reflect(); return true; }
      if (action === "program note") {
        if (f().checks.transfer) ask("programNote", P("One problem you hit, and how you improved it?", "你遇到了什么问题，又是怎样改进的？")); return true;
      }
      if (action === "inspect") {
        const m = attempt.measurement;
        if (m) e.post(P("Joint changes (degrees): ", "关节变化（度）："), "coach", { choices: [] }),
          e.post(P(m.beforeAngles.map((q, i) => "J" + (i + 1) + " " + (q * 180 / Math.PI).toFixed(1) + " → " + (m.afterAngles[i] * 180 / Math.PI).toFixed(1)).join(" · "),
            m.beforeAngles.map((q, i) => "J" + (i + 1) + " " + (q * 180 / Math.PI).toFixed(1) + " → " + (m.afterAngles[i] * 180 / Math.PI).toFixed(1)).join(" · ")));
        return true;
      }
      if (action === "calculate") {
        if (attempt.measurement) ask("calculation", P("Enter displacement (mm), distance (mm), and average speed (mm/s), separated by spaces. This optional check uses your measured move.", "依次输入位移（毫米）、路程（毫米）、平均速度（毫米/秒），用空格分隔。此可选核对使用你的实测移动。")); return true;
      }
      const wordMatch = action.match(/^(?:word|词汇)\s*(\d+)$/), robotMatch = action.match(/^(?:robot|机器人)\s*([1-5])$/);
      if (wordMatch) { word(Number(wordMatch[1]) - 1); return true; }
      if (robotMatch) { playType(ROBOT_TYPES[Number(robotMatch[1]) - 1]); return true; }
      const j1 = action.match(/^j1\s*([+-]10)$/);
      if (j1 && f().stage === "practice" && attempt.lesson === 1 && !e.awaiting) {
        stopDemo(); c.moveJoint(0, c.state.scene.actualJoints[0] + Number(j1[1]) * Math.PI / 180); return true;
      }
      const target = action.match(/^(?:use target|使用目标)\s*(\d+)$/);
      if (target && !independent() && f().setup) {
        const p = practiceRoute(lesson().id, c.state.scene).filter(s => s.type === "move")[Number(target[1]) - 1]?.targetMm;
        if (p) e.submit("/target " + p.x + " " + p.y + " " + p.z); return true;
      }
      if (action === "jobs" && attempt.lesson === 0 && f().stage === "practice") { jobIndex = 0; e.post(lesson().task); job(); return true; }
      const choice = action.match(/^(?:choose|选择)\s*([1-5])$/);
      if (choice && jobIndex >= 0) { f().jobs[SCENARIOS[jobIndex].id] = ROBOT_TYPES[Number(choice[1]) - 1]; jobIndex++; job(); return true; }
      return false;
    },
    answer(kind, text) {
      if (!attempt) return false;
      if (kind === "prediction") attempt.prediction = text;
      else if (kind === "reflection") attempt.reflection = text;
      else if (kind === "programNote") { f().programNote = text; f().checks.problemNote = "response"; }
      else if (kind === "calculation") {
        const v = text.split(/[\s,，]+/).map(Number), m = attempt.measurement;
        if (v.length !== 3 || !checkCalculation({ displacementZ: m.to.z - m.from.z, distanceMm: m.distance, speedMmS: m.distance / m.seconds },
          { displacement: v[0], distance: v[1], speed: v[2] })) {
          e.post(P("Try again using final Z − initial Z, path distance, then distance ÷ simulated seconds.", "请再试：终点Z−起点Z、路径路程、路程÷模拟秒数。")); return false;
        }
        f().calculation = text; f().checks.calculated = "response";
      }
      f().awaiting = null; return true;
    },
    afterAnswer(kind) {
      if (kind === "prediction") prepare();
      else if (kind === "reflection") {
        showStep("complete"); e.post(P("Lesson complete ✓ Your reflection is saved. No score.", "课程完成 ✓ 反思已保存，不评分。"), "success");
        e.offer([option("next", attempt.lesson < 5 ? "Next lesson →" : "Lessons", attempt.lesson < 5 ? "下一课 →" : "课程"), ...rootOptions]);
      } else {
        e.activity("lesson:" + attempt.id + ":practice:" + !!f().changed);
        e.post(kind === "calculation" ? P("Your calculation matches the measured move.", "计算与实测移动一致。") : P("Your problem and improvement are saved.", "问题与改进已保存。"), "success"); practiceOptions();
      }
    },
    event(event) {
      if (!attempt || !observeLessonFlowEvent(attempt, event)) return;
      if (event.type === "MOVE_COMPLETED" && attempt.measurement) {
        const m = attempt.measurement;
        e.post(P("Your actual move: displacement " + (m.to.z - m.from.z).toFixed(2) + " mm; path distance " + m.distance.toFixed(2) + " mm; simulated time " + m.seconds.toFixed(3) + " s; average speed " + (m.distance / m.seconds).toFixed(2) + " mm/s.",
          "你的实际移动：位移 " + (m.to.z - m.from.z).toFixed(2) + " 毫米；路程 " + m.distance.toFixed(2) + " 毫米；模拟时间 " + m.seconds.toFixed(3) + " 秒；平均速度 " + (m.distance / m.seconds).toFixed(2) + " 毫米/秒。"));
      }
      practiceOptions();
      if (attempt.lesson === 4 && f().checks.transfer && !f().checks.problemNote && !e.awaiting)
        ask("programNote", P("One problem you hit, and how you improved it?", "你遇到了什么问题，又是怎样改进的？"));
      if (completedPractice()) e.post(P("Practice verified. Reflect when you are ready.", "实践已验证，准备好即可反思。"), "success");
    },
    tick(dt) {
      if (demo) {
        demo.tick(dt); renderer.update(demo.controller.state.scene, demo.controller.state.target, { language: e.language, trail: true, path: true, labels: false, focusJoint: demo.commands[demo.index]?.jointIndex });
        if (demo.done && !demoDone) { demoDone = true; e.post(P("Demo finished. Replay it or continue when ready.", "演示结束，可以重播或继续。")); }
      }
      if (type) {
        elapsed += dt; typeScene.draw(type, Math.min(1, elapsed / 12000), e.text(P(t("en", "bodyPlans." + type + ".title"), t("zh", "bodyPlans." + type + ".title"))));
        if (elapsed >= 12000 && !demoDone) { demoDone = true; e.post(P("Demo finished. Continue at your own pace.", "演示结束，按自己的节奏继续。")); }
      }
    },
    stopDemo, demoActive: () => !!demo || !!type,
    visual: () => { if (caption.message) caption.textContent = e.text(caption.message); return visual; },
    pauseResponse() { if (attempt) f().awaiting = null; },
    resumeResponse(kind) { if (attempt) f().awaiting = kind; },
    archiveProgram: keepProgram,
    context: () => attempt ? { lesson: attempt.lesson, lessonId: lesson().id, lessonPhase: f().stage, prediction: attempt.prediction, checks: f().checks } : {},
    canOperate(cmd) {
      if (!attempt) return true;
      if (f().stage !== "practice" || !f().setup) {
        e.post(P("Choose Practice and save your prediction before operating.", "请选择练习并保存预测后再操作。")); return false;
      }
      stopDemo(); return true;
    },
    allowHelp: () => !independent(), status,
    leave() { stopDemo(); attempt = null; e.awaiting = null; e.pendingPrompt = null; },
    decorateTurn(item, turn) {
      if (independent()) item.querySelector(".turn-commands")?.remove();
      if (turn.scenario) item.append(scenarioIllustration(turn.scenario, e.text(P("Illustrated job", "工作图示"))));
    },
    save() { return { portfolio: portfolio.slice(-24), archive, scene: c.state.scene, initialScene: c.initialScene, program: c.state.program, active: attempt?.id || null, unit }; },
  };
  e.lessonAdapter = adapter;
  // Existing validated simulator files stay separate from the new conversation save.
  if (restored?.course && validateStoredScene(restored.course.scene) && validateStoredProgram(restored.course.program)) {
    c.state.scene = structuredClone(restored.course.scene); c.state.program = structuredClone(restored.course.program); c.syncTarget(); fillTarget();
    if (validateStoredScene(restored.course.initialScene)) c.initialScene = structuredClone(restored.course.initialScene);
    for (const a of (Array.isArray(restored.course.portfolio) ? restored.course.portfolio.slice(-24) : [])) {
      if (a && typeof a.id === "string" && CORE_LESSONS[a.lesson] && a.flow && validLessonFlow(a.flow) &&
          [a.prediction, a.reflection].every(x => typeof x === "string" && x.length <= 2000) && Array.isArray(a.evidence)) {
        a.eventFloor = c.sequence; a.seen = []; portfolio.push(a);
      }
    }
    for (const item of (Array.isArray(restored.course.archive) ? restored.course.archive.slice(-12) : []))
      if (validateStoredScene(item?.scene) && validateStoredProgram(item?.program)) archive.push(item);
    attempt = portfolio.find(a => a.id === restored.course.active) || null;
    unit = Number.isInteger(restored.course.unit) ? Math.max(0, Math.min(4, restored.course.unit)) : 0;
  }
  e.post(P("Welcome to Robot Lab. Choose a lesson, an exercise, or explore freely. Every lesson and robot command works offline.",
    "欢迎来到机器人实验室。请选择课程、练习或自由探索。对话中的所有教学流程均可离线使用。"), "quest");
  e.offer(rootOptions);
  if (attempt) {
    questTitle();
    const pending = restored.pendingPrompt;
    if (pending && ["prediction", "reflection", "programNote", "calculation"].includes(pending.kind) &&
        typeof pending.prompt?.en === "string" && typeof pending.prompt?.zh === "string") {
      e.pendingPrompt = pending; e.draft = typeof restored.draft === "string" ? restored.draft.slice(0, 2000) : "";
      ask(pending.kind, pending.prompt);
    } else if (f().stage === "practice") { e.activity("restored-practice", true); practiceOptions(); }
    else if (f().stage === "words") words();
    else if (f().stage === "tour") tour(unit);
    else if (f().stage === "reflection") reflect();
    else e.offer([option("next", "Next lesson →", "下一课 →"), ...rootOptions]);
    e.post(P("Saved progress restored. Recording and motion are paused; use Reset before replaying from the start.", "已恢复保存的进度。录制和运动均已暂停；从头回放前请重置。"));
  }
  return adapter;
}
