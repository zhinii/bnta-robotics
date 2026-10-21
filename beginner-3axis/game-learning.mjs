import { exerciseGoal } from "./exercises.mjs";
import { fk } from "./model.mjs";
import { observeLessonFlowEvent, validLessonFlow } from "./lesson-flow.mjs";
export const PAIR = (en, zh) => ({ en, zh });
export const GAME_LESSONS = [
  {
    id: "types",
    title: PAIR("Meet the robots", "认识机器人"),
    question: PAIR(
      "Which robot slides its tool along straight rails?",
      "哪种机器人的工具沿直线导轨移动？",
    ),
    options: [
      PAIR("Cartesian / gantry", "直角坐标 / 龙门"),
      PAIR("Articulated arm", "关节式机械臂"),
      PAIR("Delta", "并联机器人"),
    ],
    answer: 0,
    explain: PAIR(
      "A gantry uses straight sliding axes. This course uses a three-axis articulated arm: base, shoulder and elbow. Its gripper is a separate actuator.",
      "龙门机器人使用直线滑动轴。本课程使用三轴关节式机械臂：底座、肩部和肘部。夹爪是独立的执行器。",
    ),
    task: PAIR(
      "Watch one robot demonstration, then compare its motion with the arm.",
      "观看一个机器人演示，再与机械臂比较。",
    ),
    demo: "anatomy",
  },
  {
    id: "anatomy",
    title: PAIR("Parts in motion", "运动中的部件"),
    question: PAIR(
      "What happens when only the base joint turns?",
      "只转动底座关节时，会发生什么？",
    ),
    options: [
      PAIR("The links and tool turn around the base", "连杆和工具绕底座转动"),
      PAIR("Only the gripper closes", "只有夹爪闭合"),
      PAIR("The base slides across the table", "底座沿桌面滑动"),
    ],
    answer: 0,
    explain: PAIR(
      "J1 rotates the whole arm above the base. Links are rigid sections; joints connect them. Motors move them; the controller follows your program.",
      "J1带动底座上方的机械臂转动。连杆是刚性部件，关节连接它们。电机提供运动，控制器执行程序。",
    ),
    task: PAIR(
      "Choose Joints. Change J1 by at least 5° and press its Move button. Watch the tool.",
      "选择关节，把J1改变至少5°，点击对应移动按钮，观察工具。",
    ),
    demo: "anatomy",
  },
  {
    id: "coordinates",
    title: PAIR("Position & distance", "位置与距离"),
    question: PAIR(
      "Z changes from 80 to 100 mm. What is its displacement?",
      "Z从80变为100毫米，位移是多少？",
    ),
    options: [
      PAIR("+20 mm", "+20毫米"),
      PAIR("180 mm", "180毫米"),
      PAIR("20 degrees", "20度"),
    ],
    answer: 0,
    explain: PAIR(
      "Displacement is final minus initial position. XYZ uses millimetres; joint angles use degrees. Speed is path distance divided by elapsed time.",
      "位移＝终点位置减起点位置。XYZ用毫米，关节角度用度。速度＝路程÷时间。",
    ),
    task: PAIR(
      "Choose Jog, 10 mm, then Z+. Measure the actual change below.",
      "选择方向键、10毫米，再点Z+。在下方测量实际变化。",
    ),
    demo: "coordinates",
  },
  {
    id: "grip",
    title: PAIR("Grasp & feedback", "抓取与反馈"),
    question: PAIR(
      "The gripper is closed. Does that prove it holds an object?",
      "夹爪已闭合，是否证明夹住了物体？",
    ),
    options: [
      PAIR("No: check Object held", "不，要查看是否夹住物体"),
      PAIR("Yes, closed always means held", "是，闭合就代表夹住"),
    ],
    answer: 0,
    explain: PAIR(
      "A command is not proof of success. Contact and alignment determine whether the part is held. The simulator checks geometry, not forces or friction.",
      "指令不等于成功。接触和对齐决定是否夹住零件。模拟器检查几何，不模拟力或摩擦。",
    ),
    task: PAIR(
      "Open the gripper. Use the Source coordinates below the scene, move to the part, then Close. Check Object held.",
      "张开夹爪，按照场景下方的起点坐标移动到零件，再闭合。查看是否夹住物体。",
    ),
    demo: "grip",
  },
  {
    id: "program",
    title: PAIR("Build a sequence", "编写动作序列"),
    question: PAIR(
      "You moved the robot with Record OFF. Is the move in your program?",
      "录制关闭时移动机器人，这个动作在程序里吗？",
    ),
    options: [
      PAIR(
        "No. Enable Record before building steps",
        "不在，编写步骤前要开启录制",
      ),
      PAIR("Yes. Every movement is saved", "在，每次移动都会保存"),
    ],
    answer: 0,
    explain: PAIR(
      "Recording saves completed actions. Reset preserves the program. Test program restores its recorded starting scene and executes the steps.",
      "录制保存已完成的动作。重置保留程序。测试程序恢复录制起始场景，再执行步骤。",
    ),
    task: PAIR(
      "Turn Record ON. Make two moves, turn it OFF, then Test program. Use Steps to review the sequence.",
      "开启录制，移动两次，再关闭录制并测试程序。点击步骤查看序列。",
    ),
    demo: "program",
  },
  {
    id: "obstacle",
    title: PAIR("Plan around obstacles", "绕开障碍物"),
    question: PAIR(
      "The direct route is blocked. What should you change?",
      "直线路线被挡住，应如何修改？",
    ),
    options: [
      PAIR("Add clearance and an intermediate position", "增加间隙和中间位置"),
      PAIR("Keep pressing Move", "反复按移动"),
      PAIR("Disable the collision check", "关闭碰撞检查"),
    ],
    answer: 0,
    explain: PAIR(
      "The full robot and held object need clearance. The ghost previews the next pose; the path previews motion. A shorter route is not always possible.",
      "整个机器人和夹持物都需要空间。虚影预览下一姿态，路径预览运动。最短路线不一定可行。",
    ),
    task: PAIR(
      "Prepare the practice scene. Record a pickup, a route around the obstacle, and a release at Destination A. Test the whole program. It must finish with the part supported at A.",
      "准备练习场景，录制抓取、绕障和在目标A释放的全过程。测试整个程序，零件必须被A支撑。",
    ),
    demo: "obstacle",
  },
  {
    id: "design",
    title: PAIR("Solve a human problem", "解决实际问题"),
    question: PAIR(
      "Your test finishes. What proves the design meets its goal?",
      "测试结束，什么能证明设计达到了目标？",
    ),
    options: [
      PAIR(
        "Compare observed results with my criteria",
        "把观察结果与成功标准比较",
      ),
      PAIR("The Run button stopped", "运行按钮停止了"),
      PAIR("The robot looks impressive", "机器人看起来很酷"),
    ],
    answer: 0,
    explain: PAIR(
      "Use evidence from tests. A simulation can support an idea, but it does not prove that a real robot is safe or effective.",
      "使用测试证据。模拟可以支持想法，但不能证明真实机器人安全或有效。",
    ),
    task: PAIR(
      "Test a short recorded program. Then explain who it helps and what you would change in Design mode.",
      "测试一个简短的录制程序，再在设计模式中说明它帮助谁以及你将如何改进。",
    ),
    demo: "program",
  },
];
const HINTS = [
  [
    PAIR(
      "Think about the 3D printer example. Does its tool slide or swing?",
      "想想3D打印机：工具滑动还是摆动？",
    ),
    PAIR(
      "Look for perpendicular rails, rather than linked rotating arms.",
      "找互相垂直的导轨，而不是旋转连杆。",
    ),
  ],
  [
    PAIR(
      "Which parts are above J1? Watch whether they move together.",
      "哪些部件在J1上方？观察它们是否一起动。",
    ),
    PAIR(
      "A rotating base joint changes the direction of everything connected above it.",
      "底座关节旋转会改变上方相连部件的方向。",
    ),
  ],
  [
    PAIR(
      "Subtract the starting value from the final value.",
      "用终点值减去起点值。",
    ),
    PAIR(
      "Use 100 − 80. The unit is millimetres, not degrees.",
      "计算100减80，单位是毫米而不是度。",
    ),
  ],
  [
    PAIR(
      "A commanded action and its result are different pieces of information.",
      "发出的指令和实际结果是两种不同信息。",
    ),
    PAIR(
      "Closing in empty space does not create contact. Read Object held.",
      "在空处闭合不会接触物体，请看是否夹住。",
    ),
  ],
  [
    PAIR(
      "Look at the Record switch and the number of saved steps.",
      "看看录制开关和保存的步骤数量。",
    ),
    PAIR(
      "Exploring with Record OFF deliberately leaves the sequence unchanged.",
      "关闭录制时探索，程序序列有意保持不变。",
    ),
  ],
  [
    PAIR(
      "A destination can be reachable even when the direct route is blocked.",
      "目标可达，不代表直线路线畅通。",
    ),
    PAIR(
      "Compare a single crossing with separate lift, cross and lower movements.",
      "比较直接穿越与抬升、横移、下降三个动作。",
    ),
  ],
  [
    PAIR(
      "Return to the success criteria you wrote before testing.",
      "回看测试前写的成功标准。",
    ),
    PAIR(
      "A finished program is evidence of execution; the final object state is evidence about the goal.",
      "程序结束是执行证据，物体最终状态才说明目标情况。",
    ),
  ],
];
GAME_LESSONS.forEach((lesson, i) => (lesson.hints = HINTS[i]));
export const newGameState = () => ({
  version: 1,
  mode: "explore",
  lesson: 0,
  phase: "welcome",
  unit: 0,
  runs: [],
  active: null,
  history: [],
  design: { problem: "", criteria: "", reflection: "", versions: [] },
});
export function beginGameAttempt(state, index, eventFloor = 0) {
  const a = {
    id: `attempt-${Date.now()}-${state.runs.length}`,
    lesson: index,
    phase: "vocabulary",
    submissions: [],
    hintCount: 0,
    replays: 0,
    evidence: [],
    seen: [],
    eventFloor,
    prediction: "",
    reflection: "",
    acknowledged: false,
  };
  state.runs.push(a);
  state.active = a.id;
  state.lesson = index;
  state.phase = "vocabulary";
  state.unit = 0;
  return a;
}
export const activeGameAttempt = (s) => s.runs.find((a) => a.id === s.active);
export function submitGameAnswer(s, choice, token) {
  const a = activeGameAttempt(s),
    l = GAME_LESSONS[s.lesson];
  if (
    !a ||
    a.phase !== "check" ||
    (a.submissions.length && !a.acknowledged) ||
    !Number.isInteger(choice) ||
    !l.options[choice] ||
    a.submissions.some((x) => x.token === token) ||
    a.submissions.length >= 3 ||
    a.submissions.some((x) => x.correct)
  )
    return false;
  const correct = choice === l.answer;
  a.submissions.push({ choice, correct, token });
  a.acknowledged = false;
  a.assisted = !correct && a.submissions.length === 3;
  a.eventualCorrect = a.submissions.some((x) => x.correct);
  return true;
}
export function answerStats(s) {
  const answered = s.runs.filter((a) => a.submissions.length);
  return {
    answered: answered.length,
    correct: answered.filter((a) => a.submissions[0].correct).length,
    accuracy: answered.length
      ? answered.filter((a) => a.submissions[0].correct).length /
        answered.length
      : null,
  };
}
export function observeGameEvent(s, event) {
  const a = activeGameAttempt(s);
  if (a?.flow) return observeLessonFlowEvent(a, event);
  if (
    !a ||
    a.phase !== "operate" ||
    event.verified !== true ||
    (event.source !== "manual" && event.source !== "replay") ||
    Number(event.id?.replace("event-", "")) <= a.eventFloor ||
    a.seen.includes(event.id)
  )
    return false;
  a.seen.push(event.id);
  let ok = false;
  const id = GAME_LESSONS[a.lesson].id;
  if (id === "anatomy" && event.type === "MOVE_COMPLETED")
    ok =
      Math.abs(event.after.actualJoints[0] - event.before.actualJoints[0]) >=
      (5 * Math.PI) / 180 - 0.001;
  if (id === "coordinates" && event.type === "MOVE_COMPLETED") {
    const from = fk(event.before.actualJoints).C,
      to = fk(event.after.actualJoints).C;
    ok =
      Math.abs(to.z - from.z) >= 9.5 &&
      Math.hypot(to.x - from.x, to.y - from.y) < 0.5;
    if (ok)
      a.measurement = {
        from,
        to,
        distance: event.pathDistanceMm,
        seconds: event.simulatedDurationMs / 1000,
      };
  }
  if (id === "grip")
    ok =
      event.type === "OBJECT_ATTACHED" &&
      event.after.objects.some((o) => o.heldByGripper);
  if (["program", "design"].includes(id))
    ok =
      event.type === "RUN_COMPLETED" &&
      event.source === "replay" &&
      event.program.steps.filter((x) => x.type === "move").length >= 2;
  if (id === "obstacle")
    ok =
      event.type === "RUN_COMPLETED" &&
      event.source === "replay" &&
      exerciseGoal("obstacle", event.program, event.after);
  if (ok && !a.evidence.length)
    a.evidence.push({
      id: event.id,
      type: event.type,
      after: structuredClone(event.after),
    });
  return ok;
}
function legacyValidGameState(s) {
  return (
    s == null ||
    (s.version === 1 &&
      ["explore", "learn", "challenge", "design"].includes(s.mode) &&
      Number.isInteger(s.lesson) &&
      s.lesson >= 0 &&
      s.lesson < 7 &&
      Array.isArray(s.runs) &&
      s.runs.length <= 300 &&
      s.runs.every(
        (a) =>
          Number.isInteger(a.lesson) &&
          a.lesson >= 0 &&
          a.lesson < 7 &&
          Array.isArray(a.submissions) &&
          a.submissions.length <= 3 &&
          a.submissions.every(
            (x) =>
              Number.isInteger(x.choice) &&
              typeof x.correct === "boolean" &&
              x.correct === (x.choice === GAME_LESSONS[a.lesson].answer),
          ) &&
          Array.isArray(a.evidence) &&
          Array.isArray(a.seen),
      ) &&
      Array.isArray(s.history) &&
      s.history.length <= 300 &&
      s.design &&
      ["problem", "criteria", "reflection"].every(
        (k) => typeof s.design[k] === "string" && s.design[k].length <= 2000,
      ) &&
      Array.isArray(s.design.versions) &&
      s.design.versions.length <= 30)
  );
}

const PHASES = [
  "welcome",
  "vocabulary",
  "concept",
  "demo",
  "predict",
  "operate",
  "check",
  "reflect",
  "finish",
];
export function validGameState(s) {
  if (s == null) return true;
  if (
    !legacyValidGameState(s) ||
    !PHASES.includes(s.phase) ||
    !Number.isInteger(s.unit) ||
    s.unit < 0 ||
    s.unit > 10
  )
    return false;
  const text = (v) => typeof v === "string" && v.length <= 2000;
  const turnText = v => typeof v === "string" && v.length <= 4000;
  if (
    (s.retryQuestion !== undefined && (typeof s.retryQuestion !== "string" || s.retryQuestion.length > 1600)) ||
    (s.dialogue !== undefined && (!Array.isArray(s.dialogue) || s.dialogue.length > 150 ||
      !s.dialogue.every(t => t && ["user", "guide", "ai"].includes(t.role) && turnText(t.text) &&
        typeof t.at === "string" && t.at.length <= 40))) ||
    (s.aiTurns !== undefined && (!Array.isArray(s.aiTurns) || s.aiTurns.length > 30 ||
      !s.aiTurns.every(t => t && ["user", "assistant", "status"].includes(t.role) && turnText(t.text))))
  ) return false;
  if (
    !s.history.every(text) ||
    !s.runs.every(
      (a) =>
        validLessonFlow(a.flow) &&
        typeof a.id === "string" &&
        PHASES.includes(a.phase) &&
        text(a.prediction) &&
        text(a.reflection) &&
        Number.isInteger(a.eventFloor) &&
        a.eventFloor >= 0 &&
        Number.isInteger(a.hintCount) &&
        a.hintCount >= 0 &&
        Number.isInteger(a.replays) &&
        a.replays >= 0 &&
        a.seen.length <= 10000 &&
        a.seen.every((e) => typeof e === "string" && /^event-\d+$/.test(e)) &&
        a.submissions.every(
          (x) =>
            GAME_LESSONS[a.lesson].options[x.choice] &&
            typeof x.token === "string",
        ) &&
        new Set(a.submissions.map((x) => x.token)).size ===
          a.submissions.length,
    )
  )
    return false;
  if (
    new Set(s.runs.map((a) => a.id)).size !== s.runs.length ||
    (s.active != null && !s.runs.some((a) => a.id === s.active))
  )
    return false;
  if (s.design.phase && !["brief", "build", "finish"].includes(s.design.phase))
    return false;
  if (
    s.design.images &&
    (!Array.isArray(s.design.images) ||
      s.design.images.length > 3 ||
      !s.design.images.every(
        (i) =>
          typeof i.at === "string" &&
          typeof i.data === "string" &&
          i.data.startsWith("data:image/png;base64,") &&
          i.data.length < 4000000,
      ))
  )
    return false;
  return true;
}
