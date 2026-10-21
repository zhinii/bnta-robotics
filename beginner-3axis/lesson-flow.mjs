import { COURSE } from "./curriculum.mjs";
import { fk, distance } from "./model.mjs";
import { initialScene } from "./planner.mjs";

// Independent switches: preserve optional layers without making them core lessons.
export const ASSESSMENTS_ENABLED = false;
export const DESIGN_ENABLED = false;
export const CORE_IDS = ["types", "anatomy", "coordinates", "grip", "program", "obstacle"];
export const ROBOT_TYPES = ["articulated", "cartesian", "scara", "delta", "mobile"];
const titles = [
  ["Meet robot types", "认识机器人类型"], ["Explore anatomy", "探索机器人结构"],
  ["Compare joints and XYZ", "比较关节与XYZ"], ["Move and grip", "移动与抓取"],
  ["Record and replay", "录制与回放"], ["Plan around an obstacle", "绕过障碍物"],
];
export const CORE_LESSONS = CORE_IDS.map((id, i) => ({
  id, ...COURSE[id], title: { en: titles[i][0], zh: titles[i][1] },
}));
export function startLessonFlow(attempt) {
  attempt.flow = {
    version: 1, stage: "words", awaiting: null, draft: "", visited: [], watched: [],
    setup: false, changed: false, checks: {}, jobs: {}, programNote: "", calculation: "",
  };
  return attempt.flow;
}
export function validLessonFlow(f) {
  if (f === undefined) return true; // Older saved attempts remain readable.
  return !!f && f.version === 1 &&
    ["words", "tour", "practice", "reflection", "complete"].includes(f.stage) &&
    [null, "prediction", "reflection", "programNote", "calculation"].includes(f.awaiting) &&
    typeof f.draft === "string" && f.draft.length <= 2000 &&
    ["programNote", "calculation"].every(k => typeof f[k] === "string" && f[k].length <= 2000) &&
    typeof f.setup === "boolean" && typeof f.changed === "boolean" &&
    ["visited", "watched"].every(k => Array.isArray(f[k]) && f[k].length <= 80 && f[k].every(x => typeof x === "string" && x.length < 100)) &&
    !!f.checks && typeof f.checks === "object" && !Array.isArray(f.checks) &&
    Object.keys(f.checks).length <= 30 && Object.values(f.checks).every(v => typeof v === "string" && v.length < 100) &&
    !!f.jobs && typeof f.jobs === "object" && !Array.isArray(f.jobs) &&
    Object.keys(f.jobs).length <= 5 && Object.values(f.jobs).every(v => ROBOT_TYPES.includes(v)) &&
    (f.attachedAt === undefined || (f.attachedAt && ["x", "y", "z"].every(k => Number.isFinite(f.attachedAt[k]))));
}
export function transferVerified(program, scene, destination, obstacle = false) {
  if (!program?.startScene || !scene || scene.destination !== destination) return false;
  const expected = initialScene({ obstacle, destination });
  const start = program.startScene, part = scene.objects.find(o => o.id === "part");
  return start.destination === destination &&
    JSON.stringify(start.obstacles) === JSON.stringify(expected.obstacles) &&
    JSON.stringify(start.fixtures) === JSON.stringify(expected.fixtures) &&
    start.objects.some(o => o.id === "part" && o.supportedByFixtureId === "source" && !o.heldByGripper) &&
    part?.supportedByFixtureId === destination && !part.heldByGripper &&
    distance(part.worldPosition, expected.fixtures.find(f => f.id === destination).targetPosition) <= 2 &&
    program.steps.filter(s => s.type === "move").length >= 2 &&
    ["open", "closed"].every(value => program.steps.some(s => s.type === "gripper" && s.gripperState === value));
}
export function lessonRequirements(attempt) {
  const f = attempt.flow, id = CORE_IDS[attempt.lesson];
  const requirements = {
    types: ["jobs"], anatomy: ["j1"], coordinates: ["up10", "calculated"],
    grip: ["attached", "lift10"], program: ["reset", "recordOn", "recordOff", "paused", "stopped", "transfer", "problemNote"],
    obstacle: ["blocked", "deliveryA", "deliveryB"],
  };
  return (requirements[id] || []).map(key => ({ key, done: !!f?.checks[key] }));
}
export const practiceVerified = attempt => lessonRequirements(attempt).length > 0 &&
  lessonRequirements(attempt).every(x => x.done);

export function observeLessonFlowEvent(attempt, event) {
  const f = attempt.flow;
  if (!f || f.stage !== "practice" || f.awaiting || !f.setup || !attempt.prediction.trim() ||
      event.verified !== true || !["manual", "replay"].includes(event.source) ||
      Number(event.id?.replace("event-", "")) <= attempt.eventFloor || attempt.seen.includes(event.id)) return false;
  attempt.seen.push(event.id);
  const id = CORE_IDS[attempt.lesson], checks = f.checks;
  const mark = key => { checks[key] = event.id; };
  const before = JSON.stringify(checks);
  if (id === "anatomy" && event.type === "MOVE_COMPLETED" && event.source === "manual") {
    const delta = event.after.actualJoints.map((q, i) => q - event.before.actualJoints[i]);
    if (Math.abs(Math.abs(delta[0]) - Math.PI / 18) < 0.0002 && Math.abs(delta[1]) + Math.abs(delta[2]) < 0.00001) mark("j1");
  }
  if (id === "coordinates" && event.type === "MOVE_COMPLETED" && event.source === "manual") {
    const from = fk(event.before.actualJoints).C, to = fk(event.after.actualJoints).C;
    if (Math.abs(to.z - from.z - 10) <= 0.05 && Math.hypot(to.x - from.x, to.y - from.y) <= 0.05) {
      mark("up10");
      delete checks.calculated;
      attempt.measurement = { from, to, distance: event.pathDistanceMm, seconds: event.simulatedDurationMs / 1000,
        beforeAngles: event.before.actualJoints, afterAngles: event.after.actualJoints };
    }
  }
  if (id === "grip" && event.source === "manual") {
    if (event.type === "OBJECT_ATTACHED" && event.after.objects.some(o => o.heldByGripper)) {
      mark("attached"); f.attachedAt = fk(event.after.actualJoints).C;
    }
    if (event.type === "MOVE_COMPLETED" && f.attachedAt && event.after.objects.some(o => o.heldByGripper)) {
      const p = fk(event.after.actualJoints).C;
      if (Math.abs(p.z - f.attachedAt.z - 10) <= 0.05 && Math.hypot(p.x - f.attachedAt.x, p.y - f.attachedAt.y) <= 0.05) mark("lift10");
    }
  }
  if (id === "program") {
    if (event.type === "SCENE_RESET") mark("reset");
    if (event.type === "RECORDING_CHANGED") mark(event.enabled ? "recordOn" : "recordOff");
    if (event.type === "PAUSED" && event.source === "replay") mark("paused");
    if (event.type === "STOPPED" && event.wasReplay && event.reason === "user") mark("stopped");
    if (event.type === "RUN_COMPLETED" && event.source === "replay" && checks.paused && checks.stopped &&
        transferVerified(event.program, event.after, "destinationA")) mark("transfer");
  }
  if (id === "obstacle") {
    if (!f.changed && event.type === "MOVE_REJECTED" && event.error?.code === "PATH_BLOCKED" &&
        event.before.objects.some(o => o.heldByGripper) &&
        distance(event.targetMm, event.before.fixtures.find(x => x.id === "destinationA").targetPosition) < 0.05) mark("blocked");
    if (!f.changed && checks.blocked && event.type === "OBJECT_RELEASED" &&
        event.after.objects.some(o => o.supportedByFixtureId === "destinationA" && !o.heldByGripper)) mark("deliveryA");
    if (f.changed && event.type === "RUN_COMPLETED" && event.source === "replay" &&
        transferVerified(event.program, event.after, "destinationB", true)) mark("deliveryB");
  }
  if (JSON.stringify(checks) === before) return false;
  attempt.evidence.push({ id: event.id, type: event.type,
    ...(event.after ? { after: structuredClone(event.after) } : {}) });
  attempt.evidence = attempt.evidence.slice(-40);
  return true;
}
