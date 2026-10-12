import { BODY_PLAN_ANSWERS, ANATOMY_ANSWERS } from "./lessons.mjs";

// These hints are curriculum content, available without a network or AI.
const HINTS = {
  assembly: [
    "Recall the demo with a fixed base and rotating shoulder and elbow. How did it reach from the tray to the fixture?",
    "回想固定底座、肩部和肘部转动的演示。它怎样从料盘伸到夹具？",
  ],
  gantry: [
    "Look for the demo where the tool slides along straight rails instead of swinging around joints.",
    "寻找工具沿直线导轨滑动，而不是绕关节摆动的演示。",
  ],
  pickPlace: [
    "Which demo used two links to move across the bench, then lowered a part straight into a hole?",
    "哪个演示用两根连杆在台面上方移动，再把部件竖直放进孔中？",
  ],
  sorting: [
    "Think of the mechanism suspended above the work area: several linked chains guide one lightweight tool.",
    "想想悬在工作区上方的机构：多条连杆链共同引导一个轻巧的工具。",
  ],
  delivery: [
    "Does only the tool move, or must the whole robot travel along the route?",
    "是只需要工具移动，还是整个机器人都要沿路线行驶？",
  ],
  base: [
    "Find the part that supports the arm on the table while the joints move.",
    "寻找关节运动时仍在桌面上支撑机械臂的部分。",
  ],
  link: [
    "A link is a rigid member between joints. Look for a solid arm section, not a pivot.",
    "连杆是连接关节的刚性构件。寻找机械臂的一段，而不是转动连接处。",
  ],
  joint: [
    "A joint is a movable connection. Where does one arm section rotate relative to another?",
    "关节是可动的连接处。机械臂的一段在哪里相对另一段转动？",
  ],
  actuator: [
    "Which part converts energy into motion, rather than deciding the order of commands?",
    "哪个部分把能量转化为运动，而不是决定指令的顺序？",
  ],
  endEffector: [
    "Look at the working end: which part touches or holds the object?",
    "看看工作的末端：哪个部分接触或夹住物体？",
  ],
  controller: [
    "Which part reads the program and sends commands to the moving hardware?",
    "哪个部分读取程序，并向运动机构发送指令？",
  ],
};

export function answerFeedback(id, attempt, language = "en") {
  if (!attempt?.answers || !["types", "anatomy"].includes(id)) return null;
  const expected =
    id === "types"
      ? Object.fromEntries(
          Object.entries(BODY_PLAN_ANSWERS).map(([robot, job]) => [job, robot]),
        )
      : ANATOMY_ANSWERS;
  const selected =
    id === "types"
      ? (attempt.scenarioAnswers ??
        Object.fromEntries(
          Object.entries(attempt.answers).map(([robot, job]) => [job, robot]),
        ))
      : attempt.answers;
  const rows = Object.entries(expected).map(([key, value]) => ({
    key,
    name: id === "types" ? `scenario-${key}` : key,
    selected: selected[key] || "",
    correct: selected[key] === value,
    hint: HINTS[key][language === "zh" ? 1 : 0],
  }));
  return {
    rows,
    correct: rows.filter((r) => r.correct).length,
    total: rows.length,
  };
}

export function attachAnswerFeedback(root, button, id, getAttempt, language) {
  const zh = language === "zh";
  const summary = document.createElement("div");
  summary.id = "answer-feedback-summary";
  summary.className = "answer-feedback-summary";
  summary.setAttribute("role", "status");
  summary.setAttribute("aria-live", "polite");
  summary.setAttribute("aria-atomic", "true");
  summary.tabIndex = -1;
  button.before(summary);
  const panels = [...root.querySelectorAll("select")].map((select) => {
    const card =
      select.closest(".scenario-card,.anatomy-question") ??
      select.closest("label");
    card.classList.add("answer-card");
    const message = document.createElement("p");
    message.id = `feedback-${select.name}`;
    message.className = "answer-feedback";
    message.hidden = true;
    card.append(message);
    select.setAttribute("aria-describedby", message.id);
    // A stale score must not look like a grade for an edited, unsubmitted answer.
    select.addEventListener("change", () => refresh());
    return { select, card, message };
  });
  function refresh(announce = false) {
    const result = answerFeedback(id, getAttempt(), language);
    summary.hidden = !result;
    if (!result) return;
    let dirty = false;
    for (const { select, card, message } of panels) {
      const row = result.rows.find((r) => r.name === select.name);
      const edited =
        (select.value === "—" ? "" : select.value) !== row.selected;
      dirty ||= edited;
      card.dataset.answerState = edited
        ? "edited"
        : row.correct
          ? "correct"
          : "review";
      message.hidden = false;
      message.textContent = edited
        ? zh
          ? "已修改 · 请重新提交以检查。"
          : "Edited · submit again to check."
        : row.correct
          ? zh
            ? "✓ 正确"
            : "✓ Correct"
          : `${zh ? "↻ 再想一想" : "↻ Take another look"}${row.selected ? "" : zh ? " · 请先选择" : " · choose an answer"}. ${zh ? "提示：" : "Hint: "}${row.hint}`;
    }
    summary.textContent = zh
      ? `回答已保存 — ${result.total}题中答对${result.correct}题。${dirty ? "有未提交的修改，请重新提交。" : result.correct === result.total ? "全部匹配正确！" : "查看标记的题目和提示，修改后再次提交。"}`
      : `Answers saved — ${result.correct} of ${result.total} correct. ${dirty ? "You have unsubmitted edits. Submit again to check them." : result.correct === result.total ? "All matches correct!" : "Review the marked answers and hints, then submit again."}`;
    if (
      ["anatomy", "types"].includes(id) &&
      !dirty &&
      result.correct < result.total
    ) {
      const numbers = result.rows
        .map((r, i) => (r.correct ? null : i + 1))
        .filter(Boolean)
        .join(", ");
      summary.textContent += zh
        ? ` 再看第${numbers}题。`
        : ` Take another look at questions ${numbers}.`;
    }
    summary.dataset.result =
      result.correct === result.total && !dirty ? "correct" : "review";
    if (announce) {
      summary.focus({ preventScroll: true });
      summary.scrollIntoView?.({ block: "nearest", behavior: "auto" });
    }
  }
  refresh();
  return { refresh };
}
