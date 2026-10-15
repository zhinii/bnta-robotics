import { distance } from "./model.mjs";
import { sceneDifference } from "./program.mjs";

// Guidance describes the next control; it never operates or grades the robot.
export function nextPracticeAction({
  state,
  events,
  step,
  complete,
  programLesson,
}) {
  if (["running", "movingManual"].includes(state.execution.status))
    return "watch";
  if (state.execution.status === "paused") return "run";
  if (programLesson && !events.some((e) => e.type === "SCENE_RESET"))
    return "reset";
  if (programLesson && !complete && !state.recording.enabled) return "record";
  if (complete) {
    if (!programLesson) return "review";
    if (state.recording.enabled) return "recordOff";
    if (events.some((e) => e.type === "RUN_COMPLETED")) return "review";
    if (sceneDifference(state.scene, state.program.startScene)) return "reset";
    return "run";
  }
  if (step?.type === "gripper")
    return step.gripperState === "closed" ? "close" : "open";
  if (step?.targetMm)
    return state.target.parsed &&
      distance(state.target.parsed, step.targetMm) < 0.15
      ? "move"
      : "target";
  return "move";
}

export const ACTION_COPY = {
  reset: [
    "Next: Reset to the recorded start. Your steps are kept.",
    "下一步：重置到录制起点，步骤会保留。",
  ],
  record: [
    "Next: turn Record ON to save completed actions.",
    "下一步：开启录制，保存完成的动作。",
  ],
  recordOff: [
    "Next: turn Record OFF before testing.",
    "下一步：关闭录制，再测试程序。",
  ],
  target: [
    "Next: enter the target XYZ, or use its coordinates. This only previews.",
    "下一步：输入目标XYZ，或使用坐标。此时只是预览。",
  ],
  move: [
    "Next: press Move. Watch the robot reach the target.",
    "下一步：按移动，观察机器人到达目标。",
  ],
  close: [
    "Next: Close gripper, then check Object held.",
    "下一步：闭合夹爪，再检查是否夹住物体。",
  ],
  open: [
    "Next: Open gripper to release the part.",
    "下一步：张开夹爪，释放零件。",
  ],
  run: ["Next: Run your saved sequence.", "下一步：运行已保存的程序。"],
  watch: ["Watch the movement. Use Stop if needed.", "观察运动，必要时停止。"],
  review: [
    "Test finished. Use Review & explain above.",
    "测试完成，点击上方“查看结果并解释”。",
  ],
};
