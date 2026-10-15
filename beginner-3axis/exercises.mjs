import { fk, distance } from "./model.mjs";
import { clone, initialScene, preflightProgram } from "./planner.mjs";
import { sceneDifference } from "./program.mjs";

export const EXERCISES = [
  { id: "sandbox", en: "Explore", zh: "自由探索" },
  { id: "reach", en: "Reach a point", zh: "到达目标点" },
  { id: "transfer", en: "Pick & place", zh: "抓取与放置" },
  { id: "obstacle", en: "Avoid an obstacle", zh: "绕开障碍物" },
];
export const createExerciseState = () => ({ taskId: "sandbox", results: {} });
export function exerciseScene(id) {
  const scene = initialScene({ obstacle: id === "obstacle" });
  if (id === "reach") scene.objects = [];
  return scene;
}
export function exerciseGoal(id, program, finalScene) {
  if (
    id === "sandbox" ||
    !EXERCISES.some((t) => t.id === id) ||
    !program?.startScene ||
    !finalScene
  )
    return false;
  const start = program.startScene,
    expected = exerciseScene(id);
  if (
    JSON.stringify(start.obstacles) !== JSON.stringify(expected.obstacles) ||
    JSON.stringify(start.fixtures) !== JSON.stringify(expected.fixtures) ||
    start.destination !== "destinationA"
  )
    return false;
  if (program.steps.filter((s) => s.type === "move").length < 2) return false;
  const destination = expected.fixtures.find((f) => f.id === "destinationA");
  if (id === "reach")
    return (
      distance(fk(finalScene.actualJoints).C, destination.targetPosition) <= 2
    );
  const before = start.objects.find((o) => o.id === "part"),
    after = finalScene.objects.find((o) => o.id === "part");
  return (
    !!before &&
    before.supportedByFixtureId === "source" &&
    !before.heldByGripper &&
    !!after &&
    after.supportedByFixtureId === "destinationA" &&
    !after.heldByGripper &&
    distance(after.worldPosition, destination.targetPosition) <= 2 &&
    program.steps.some(
      (s) => s.type === "gripper" && s.gripperState === "closed",
    ) &&
    program.steps.some((s) => s.type === "gripper" && s.gripperState === "open")
  );
}
export function recordExerciseRun(state, event) {
  if (
    event.type !== "RUN_COMPLETED" ||
    event.source !== "replay" ||
    event.verified !== true ||
    !exerciseGoal(state.taskId, event.program, event.after)
  )
    return state;
  return {
    ...state,
    results: {
      ...state.results,
      [state.taskId]: {
        program: clone(event.program),
        scene: clone(event.after),
      },
    },
  };
}
export function validExerciseState(state, validProgram, validScene) {
  if (state == null) return true; // Older JSON files remain compatible.
  if (
    !EXERCISES.some((t) => t.id === state.taskId) ||
    !state.results ||
    typeof state.results !== "object" ||
    Array.isArray(state.results)
  )
    return false;
  return Object.entries(state.results).every(([id, result]) => {
    if (
      !validProgram(result?.program) ||
      !validScene(result?.scene) ||
      !exerciseGoal(id, result.program, result.scene)
    )
      return false;
    const replay = preflightProgram(
      result.program.startScene,
      result.program.steps,
    );
    return replay.ok && !sceneDifference(replay.value.endScene, result.scene);
  });
}
