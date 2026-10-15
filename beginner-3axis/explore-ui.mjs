import { EXERCISES, exerciseGoal } from "./exercises.mjs";
import { sceneDifference } from "./program.mjs";
import { teachingRoute } from "./planner.mjs";

export function createExploreUI(api) {
  const node = (tag, id) => {
    const e = document.createElement(tag);
    if (id) e.id = id;
    return e;
  };
  const bar = node("section", "exercise-bar"),
    nav = node("nav", "exercise-nav"),
    status = node("output", "exercise-status"),
    goal = node("p", "exercise-goal"),
    note = node("p", "exercise-progress"),
    reference = node("details", "exercise-reference"),
    summary = node("summary"),
    references = node("div"),
    restart = node("button", "exercise-restart");
  const row = node("div");
  row.className = "exercise-heading";
  row.append(nav, status, restart);
  bar.append(row, goal, note, reference);
  reference.append(summary, references);
  document.querySelector(".workspace").before(bar);
  const buttons = EXERCISES.map((task, index) => {
    const b = node("button", `exercise-${task.id}`);
    b.onclick = () => api.start(task.id);
    nav.append(b);
    return b;
  });
  restart.onclick = () => api.start(api.get().exercise.taskId, true);
  let referenceKey = "";
  function render() {
    const { c, exercise, mode, language } = api.get(),
      s = c.state,
      zh = language === "zh",
      w = (en, cn) => (zh ? cn : en);
    bar.hidden = mode !== "explore";
    if (bar.hidden) return;
    const id = exercise.taskId;
    document.body.dataset.exercise = id;
    nav.setAttribute("aria-label", w("Exercises", "练习任务"));
    EXERCISES.forEach((t, i) => {
      const b = buttons[i];
      b.textContent = `${exercise.results[t.id] ? "✓ " : ""}${i ? i + " · " : ""}${zh ? t.zh : t.en}`;
      b.setAttribute("aria-current", String(id === t.id));
      b.dataset.complete = String(!!exercise.results[t.id]);
      b.disabled = c.busy;
    });
    restart.textContent = "↺";
    restart.title = w("Restart this task", "重新开始此任务");
    restart.setAttribute("aria-label", restart.title);
    restart.disabled = c.busy;
    const recent = [...s.events]
      .reverse()
      .find((e) => e.type === "RUN_COMPLETED");
    const currentPass =
      recent &&
      recent.program.revision === s.program.revision &&
      exerciseGoal(id, recent.program, recent.after);
    let phase =
      s.execution.status === "running"
        ? "testing"
        : s.execution.status === "paused"
          ? "paused"
          : s.execution.status === "movingManual"
            ? "moving"
            : s.execution.status === "completed" && currentPass
              ? "complete"
              : s.execution.status === "completed"
                ? "revise"
                : s.execution.status === "stopped"
                  ? "stopped"
                  : "programming";
    if (
      exercise.results[id] &&
      phase === "programming" &&
      !sceneDifference(s.scene, exercise.results[id].scene) &&
      JSON.stringify(exercise.results[id].program.steps) ===
        JSON.stringify(s.program.steps)
    )
      phase = "complete";
    if (id === "sandbox" && !["testing", "paused", "moving"].includes(phase))
      phase = s.recording.enabled ? "programming" : "exploring";
    const phases = {
      exploring: w("Exploring · not recording", "探索中 · 未录制"),
      programming: w("Programming", "编程中"),
      testing: w("Testing", "测试中"),
      paused: w("Paused", "已暂停"),
      moving: w("Moving", "移动中"),
      complete: w("Complete", "已完成"),
      revise: w("Revise & test again", "修改后再测试"),
      stopped: w("Stopped", "已停止"),
    };
    status.textContent = phases[phase];
    status.dataset.phase = phase;
    document.body.dataset.exercisePlayback = String(
      ["testing", "paused"].includes(phase),
    );
    goal.textContent =
      id === "sandbox"
        ? s.recording.enabled
          ? w(
              "Record is ON: completed moves and gripper changes are saved. Turn it off to experiment.",
              "录制已开启：完成的移动和夹爪动作将保存。关闭录制即可自由尝试。",
            )
          : w(
              "Choose XYZ, Joints or Jog to move. Record is OFF; start lessons when ready.",
              "选择XYZ、关节或方向键来移动。录制已关闭；准备好再开始课程。",
            )
        : id === "reach"
          ? w(
              "Record 2+ moves to Destination A, then test.",
              "录制至少两次移动到目标A，再测试。",
            )
          : id === "transfer"
            ? w(
                "Program a pickup at Source and a release at A.",
                "编写程序：起点抓取，在A处释放。",
              )
            : w(
                "Program a delivery to A around the obstacle.",
                "编写程序，绕过障碍物将零件送到A。",
              );
    const changed =
      s.program.steps.length && sceneDifference(s.scene, s.program.startScene);
    note.textContent =
      phase === "complete"
        ? w(
            "✓ Your recorded program completed this task. Try another task or improve your sequence.",
            "✓ 你的程序已完成任务。可以尝试其他任务，或改进程序。",
          )
        : phase === "revise"
          ? w(
              "The program ran, but the task goal is not met yet. Check its final position and gripper actions.",
              "程序已运行，但尚未达成目标。请检查终点位置和夹爪动作。",
            )
          : s.recording.enabled
            ? w(
                "● Recording — completed moves and gripper changes are added.",
                "● 录制中 — 完成的移动和夹爪动作会加入程序。",
              )
            : changed
              ? w(
                  "Reset & test restores the recorded starting scene and plays your sequence. Steps are kept.",
                  "“重置并测试”会恢复录制起始场景，再播放程序。步骤保留。",
                )
              : w(
                  "Turn Record on to build a sequence. Record off lets you experiment without adding steps.",
                  "开启录制来编写程序；关闭录制可自由尝试，不会增加步骤。",
                );
    note.hidden = !["complete", "revise"].includes(phase);
    summary.textContent = w(
      id === "sandbox"
        ? "Help · pickup coordinates"
        : "Task reference · coordinates & hints",
      id === "sandbox" ? "帮助 · 抓取坐标" : "任务参考 · 坐标与提示",
    );
    const key = `${id}:${language}:${s.scene.destination}:${JSON.stringify(s.scene.fixtures)}`;
    if (key !== referenceKey) {
      referenceKey = key;
      references.replaceChildren();
      const route = teachingRoute(s.scene),
        indices = id === "reach" ? [6] : [0, 1, 5, 6];
      const names = {
        0: w("Before pickup", "抓取前"),
        1: w("Pickup", "抓取点"),
        5: w("Before placement", "放置前"),
        6: w("Destination A", "目标A"),
      };
      for (const i of indices) {
        const r = node("div"),
          label = node("span"),
          b = node("button");
        const target = route[i].targetMm;
        label.textContent = `${names[i]} · ${["x", "y", "z"].map((k) => `${k.toUpperCase()} ${target[k].toFixed(1)}`).join(" · ")} mm`;
        b.textContent = w("Use target", "使用坐标");
        b.onclick = () => {
          api.target(target);
          reference.open = false;
          document.getElementById("target-x").focus({ preventScroll: true });
        };
        r.append(label, b);
        references.append(r);
      }
      const hint = node("p");
      hint.textContent =
        id === "reach"
          ? w(
              "You choose the intermediate point. The ghost and expected path preview the move; Move executes it.",
              "中间点由你决定。虚影和预计路径用于预览，点击“移动”才会执行。",
            )
          : w(
              "Move to Pickup with the gripper open, then Close. “Before pickup” is one possible approach, not a required checkpoint. Avoid obstacles and release at the destination.",
              "张开夹爪，移动到抓取点，再闭合。“抓取前”只是一个参考位置，并非必经点。避开障碍物，在目标处释放。",
            );
      references.append(hint);
    }
    references.querySelectorAll("button").forEach((b) => (b.disabled = c.busy));
  }
  return { render };
}
