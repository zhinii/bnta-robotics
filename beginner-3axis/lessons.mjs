/** Deterministic learning evidence. This module never commands or changes a robot.
 * Controller events must carry verified before/after scene snapshots. Learner text
 * remains self-reported evidence; it is never graded for reasoning quality.
 */
import {
  CONFIG,
  fk,
  finiteVec,
  distance,
  dot,
  length,
  degreesToRadians,
} from "./model.mjs";
import { moveMeasurement, checkCalculation } from "./curriculum.mjs";

export const LEARNING_VERSION = 1;
export const MAX_TEXT_LENGTH = 1200;
export const MAX_EVIDENCE_EVENTS = 2000;
export const BODY_PLAN_ANSWERS = Object.freeze({
  articulated: "assembly",
  cartesian: "gantry",
  scara: "pickPlace",
  delta: "sorting",
  mobile: "delivery",
});
export const ANATOMY_ANSWERS = Object.freeze({
  base: "base",
  link: "upper-arm",
  joint: "shoulder",
  actuator: "actuator",
  endEffector: "gripper",
  controller: "controller",
});
export const INTERESTS = Object.freeze([
  "making",
  "coding",
  "design",
  "maths",
  "science",
  "helpingPeople",
]);
export const LESSONS = Object.freeze(
  [
    "types",
    "anatomy",
    "coordinates",
    "grip",
    "program",
    "obstacle",
    "design",
  ].map((id, i) =>
    Object.freeze({
      id,
      number: i + 1,
      titleKey: `lessons.${id}.title`,
      taskKey: `lessons.${id}.task`,
      hintKey: `lessons.${id}.hint`,
      exampleKey: `lessons.${id}.example`,
      hasTransfer: id === "obstacle",
    }),
  ),
);
export const LESSON_STATUSES = Object.freeze([
  "notStarted",
  "practicing",
  "completedWithHelp",
  "completedWithoutHints",
  "transferPassed",
]);
const clone = (x) => structuredClone(x);
// Optional fields omitted by a controller are not corrupted numeric telemetry.
const withoutUndefined = (value) =>
  Array.isArray(value)
    ? value.map((v) => (v === undefined ? null : withoutUndefined(v)))
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.entries(value)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, withoutUndefined(v)]),
        )
      : value;
const goodText = (x) =>
  typeof x === "string" && x.trim().length > 0 && x.length <= MAX_TEXT_LENGTH;
const normalId = (id) =>
  LESSONS.find(
    (l) =>
      l.id === id ||
      String(l.number) === String(id) ||
      `lesson-${l.number}` === id,
  )?.id;
const issue = (state, code, details = {}) => ({
  ...state,
  warning: { code, details },
});
const sceneOf = (event, which) => event[which]?.scene ?? event[which];
const jointsOk = (q) =>
  Array.isArray(q) && q.length === 3 && q.every(Number.isFinite);
const sceneOk = (s) =>
  s?.modelId === CONFIG.modelId &&
  jointsOk(s.actualJoints) &&
  Array.isArray(s.objects) &&
  Array.isArray(s.fixtures);
const verified = (e) =>
  e?.verified === true &&
  (typeof e.operationId === "number" || typeof e.operationId === "string") &&
  sceneOk(sceneOf(e, "before")) &&
  sceneOk(sceneOf(e, "after"));
const objectOf = (s, id = "part") => s?.objects?.find((o) => o.id === id);
const fixtureOf = (s, id) => s?.fixtures?.find((f) => f.id === id);
const closeTo = (a, b, tolerance = 0.1) =>
  finiteVec(a) && finiteVec(b) && distance(a, b) <= tolerance + 1e-8;
const aligned = (a, b, degrees = 10) =>
  finiteVec(a) &&
  finiteVec(b) &&
  length(a) > 0 &&
  length(b) > 0 &&
  dot(a, b) / (length(a) * length(b)) >=
    Math.cos((degrees * Math.PI) / 180) - 1e-10;
const sorted = (value) =>
  Array.isArray(value)
    ? value.map(sorted)
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((k) => [k, sorted(value[k])]),
        )
      : value;
const sameJson = (a, b) =>
  JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));
const actualScene = (s) =>
  s && {
    modelId: s.modelId,
    actualJoints: s.actualJoints,
    gripperState: s.gripperState,
    objects: s.objects,
    fixtures: s.fixtures,
    obstacles: s.obstacles,
    approachEvidence: s.approachEvidence,
  };
function movedZ(before, after, amount = 10) {
  return (
    finiteVec(before) &&
    finiteVec(after) &&
    Math.abs(after.x - before.x) <= 0.1 + 1e-8 &&
    Math.abs(after.y - before.y) <= 0.1 + 1e-8 &&
    Math.abs(after.z - before.z - amount) <= 0.1 + 1e-8
  );
}
function actualAttach(e) {
  if (e.type !== "OBJECT_ATTACHED" || !verified(e)) return false;
  const a = objectOf(sceneOf(e, "before"), e.objectId),
    b = objectOf(sceneOf(e, "after"), e.objectId);
  return (
    a &&
    !a.heldByGripper &&
    b?.heldByGripper === true &&
    sceneOf(e, "after").gripperState === "closed" &&
    closeTo(a.worldPosition, b.worldPosition, 1e-6) &&
    aligned(a.worldForward, b.worldForward, 0.0001)
  );
}
export function releaseAtFixture(e, fixtureId = "destinationA") {
  if (e.type !== "OBJECT_RELEASED" || !verified(e)) return false;
  const before = objectOf(sceneOf(e, "before"), e.objectId),
    after = objectOf(sceneOf(e, "after"), e.objectId),
    f = fixtureOf(sceneOf(e, "after"), fixtureId);
  const yaw = { source: -30, destinationA: 30, destinationB: 45 }[fixtureId];
  if (yaw === undefined) return false;
  const expected = fk([yaw, 45, -90].map(degreesToRadians));
  if (
    !f ||
    !closeTo(f.targetPosition, expected.C, 1e-6) ||
    !aligned(f.targetForward, expected.e, 0.0001)
  )
    return false;
  return Boolean(
    before?.heldByGripper &&
      after &&
      !after.heldByGripper &&
      after.supportedByFixtureId === fixtureId &&
      f &&
      sceneOf(e, "after").gripperState === "open" &&
      closeTo(
        after.worldPosition,
        f.targetPosition,
        Math.min(f.toleranceMm ?? 2, 2),
      ) &&
      aligned(
        after.worldForward,
        f.targetForward,
        Math.min(f.alignmentDeg ?? 10, 10),
      ) &&
      closeTo(before.worldPosition, after.worldPosition, 1e-6),
  );
}
export function createLearningState() {
  return {
    kind: "bnta-3axis-learning",
    version: LEARNING_VERSION,
    modelId: CONFIG.modelId,
    currentLessonId: "types",
    sequence: 0,
    evidenceEvents: [],
    lessons: Object.fromEntries(
      LESSONS.map((l) => [
        l.id,
        { status: "notStarted", currentAttemptId: null, attempts: [] },
      ]),
    ),
    warning: null,
  };
}
export function currentAttempt(state, id = state.currentLessonId) {
  const lesson = state.lessons[normalId(id)];
  return lesson?.attempts.find((a) => a.id === lesson.currentAttemptId) ?? null;
}
/** Starting a new attempt preserves previous evidence and help usage. */
export function beginLessonAttempt(
  state,
  id,
  { transfer = false, programRevision = null } = {},
) {
  id = normalId(id);
  if (!id) return issue(state, "INVALID_LESSON");
  if (transfer && id !== "obstacle") return issue(state, "INVALID_TRANSFER");
  const next = clone(state),
    lesson = next.lessons[id],
    sequence = ++next.sequence;
  lesson.currentAttemptId = `${id}-attempt-${sequence}`;
  lesson.attempts.push({
    id: lesson.currentAttemptId,
    lessonId: id,
    transfer,
    prediction: "",
    reflection: "",
    answers: null,
    design: null,
    hintCount: 0,
    workedExampleCount: 0,
    evidenceEventIds: [],
    status: "practicing",
    startedSequence: sequence,
    programRevisionAtStart: programRevision,
    checks: {},
    measurements: [],
    transferResult: null,
  });
  if (lesson.status === "notStarted") lesson.status = "practicing";
  next.currentLessonId = id;
  next.warning = null;
  return next;
}
function ensureAttempt(state, id) {
  id = normalId(id ?? state.currentLessonId);
  return currentAttempt(state, id)
    ? { ...state, currentLessonId: id }
    : beginLessonAttempt(state, id);
}
function updateScore(state) {
  const attempt = currentAttempt(state);
  if (!attempt) return state;
  const result = evaluateLesson(state, state.currentLessonId);
  attempt.checks = result.checks;
  attempt.measurements = result.measurements;
  attempt.verifiedEvidenceIds = result.evidenceEventIds;
  attempt.status = result.status;
  attempt.transferResult = attempt.transfer
    ? {
        success: result.checks.deliveredToB === true,
        hintsUsed: attempt.hintCount,
        independent: result.status === "transferPassed",
      }
    : null;
  const lesson = state.lessons[state.currentLessonId];
  const ranks = LESSON_STATUSES;
  lesson.status = lesson.attempts.reduce(
    (best, a) =>
      ranks.indexOf(a.status) > ranks.indexOf(best) ? a.status : best,
    "practicing",
  );
  return state;
}
/** Duplicate stable event IDs are ignored. At the explicit cap, reject the new
 * evidence and ask for export; no old evidence is silently discarded. */
export function recordLearningEvent(state, event) {
  if (!event || typeof event.type !== "string")
    return issue(state, "INVALID_EVIDENCE");
  if (event.id && state.evidenceEvents.some((e) => e.id === event.id))
    return state;
  if (state.evidenceEvents.length >= MAX_EVIDENCE_EVENTS)
    return issue(state, "EVIDENCE_LIMIT", { limit: MAX_EVIDENCE_EVENTS });
  let next = clone(ensureAttempt(state, event.lessonId));
  const attempt = currentAttempt(next);
  if (!attempt) return next;
  if (event.attemptId && event.attemptId !== attempt.id) return state;
  const sequence = ++next.sequence,
    id = event.id || `learning-${sequence}`;
  let safe;
  try {
    safe = withoutUndefined(clone(event));
  } catch {
    return issue(state, "INVALID_EVIDENCE");
  }
  safe.id = id;
  safe.sequence = sequence;
  safe.lessonId = next.currentLessonId;
  safe.attemptId = attempt.id;
  if (["PREDICTION_SUBMITTED", "REFLECTION_SUBMITTED"].includes(safe.type)) {
    if (!goodText(safe.text))
      return issue(state, "TEXT_REQUIRED", { maxLength: MAX_TEXT_LENGTH });
    if (safe.type === "PREDICTION_SUBMITTED") {
      attempt.prediction = safe.text.trim();
      attempt.predictionEventId = id;
      attempt.predictionSequence = sequence;
    } else {
      attempt.reflection = safe.text.trim();
      attempt.reflectionEventId = id;
      attempt.reflectionSequence = sequence;
    }
  }
  if (["HINT_SHOWN", "WORKED_EXAMPLE_SHOWN"].includes(safe.type)) {
    attempt.hintCount++;
    if (safe.type === "WORKED_EXAMPLE_SHOWN") attempt.workedExampleCount++;
  }
  if (safe.type === "ANSWERS_SUBMITTED") attempt.answers = clone(safe.answers);
  if (safe.type === "DESIGN_SUBMITTED") attempt.design = clone(safe.proposal);
  next.evidenceEvents.push(safe);
  attempt.evidenceEventIds.push(id);
  next.warning = null;
  return updateScore(next);
}
export function submitPrediction(state, text, id = state.currentLessonId) {
  return recordLearningEvent(ensureAttempt(state, id), {
    type: "PREDICTION_SUBMITTED",
    text,
  });
}
export function submitReflection(state, text, id = state.currentLessonId) {
  return recordLearningEvent(ensureAttempt(state, id), {
    type: "REFLECTION_SUBMITTED",
    text,
  });
}
export function submitAnswers(state, answers, id = state.currentLessonId) {
  id = normalId(id);
  const key =
    id === "types"
      ? BODY_PLAN_ANSWERS
      : id === "anatomy"
        ? ANATOMY_ANSWERS
        : null;
  if (!key || !answers || typeof answers !== "object" || Array.isArray(answers))
    return issue(state, "INVALID_ANSWERS");
  const selected = Object.fromEntries(
    Object.keys(key).map((k) => [
      k,
      typeof answers[k] === "string" ? answers[k] : "",
    ]),
  );
  const corrections = Object.entries(key)
    .filter(([k, v]) => selected[k] !== v)
    .map(([partId, expected]) => ({
      partId,
      selected: selected[partId],
      expected,
    }));
  return recordLearningEvent(ensureAttempt(state, id), {
    type: "ANSWERS_SUBMITTED",
    answers: selected,
    correct: corrections.length === 0,
    corrections,
  });
}
export function submitDesign(state, proposal) {
  const fields = ["interest", "job", "bodyPlan", "benefit", "limit"];
  if (
    !proposal ||
    !fields.every((k) => goodText(proposal[k])) ||
    !INTERESTS.includes(proposal.interest) ||
    !Object.hasOwn(BODY_PLAN_ANSWERS, proposal.bodyPlan)
  )
    return issue(state, "DESIGN_FIELDS_REQUIRED");
  return recordLearningEvent(ensureAttempt(state, "design"), {
    type: "DESIGN_SUBMITTED",
    proposal: Object.fromEntries(fields.map((k) => [k, proposal[k].trim()])),
    reasoningAssessment: "learner-authored; not automatically graded",
  });
}
export function noteHint(
  state,
  { workedExample = false, textKey = null, hintLevel = 1 } = {},
) {
  return recordLearningEvent(state, {
    type: workedExample ? "WORKED_EXAMPLE_SHOWN" : "HINT_SHOWN",
    textKey,
    hintLevel: Math.max(1, Math.min(3, hintLevel)),
  });
}

/** Evaluate only actual, post-prediction events for this one attempt. The result
 * exposes checks so the UI explains exactly what is still missing. */
export function evaluateLesson(state, id = state.currentLessonId) {
  id = normalId(id);
  const attempt = currentAttempt(state, id);
  if (!attempt)
    return {
      status: "notStarted",
      complete: false,
      checks: { prediction: false },
      evidenceEventIds: [],
      measurements: [],
    };
  const events = state.evidenceEvents.filter((e) => e.attemptId === attempt.id),
    scored = events.filter(
      (e) => e.sequence > (attempt.predictionSequence ?? Infinity),
    );
  const checks = { prediction: goodText(attempt.prediction) },
    evidence = [],
    measurements = [];
  const take = (e) => {
    if (e && !evidence.includes(e.id)) evidence.push(e.id);
    return Boolean(e);
  };
  if (id === "types" || id === "anatomy") {
    const key = id === "types" ? BODY_PLAN_ANSWERS : ANATOMY_ANSWERS;
    const answer = scored.find(
      (e) =>
        e.type === "ANSWERS_SUBMITTED" &&
        Object.entries(key).every(([k, v]) => e.answers?.[k] === v),
    );
    checks[id === "types" ? "allBodyPlansMatched" : "allPartsIdentified"] =
      take(answer);
    if (id === "anatomy")
      checks.jointDistinctFromLink = Boolean(
        answer && answer.answers.joint !== answer.answers.link,
      );
    if (id === "anatomy" && attempt.curriculumVersion >= 2)
      checks.jointOperated = take(
        scored.find(
          (e) =>
            e.type === "JOINT_DEMO_COMPLETED" &&
            verified(e) &&
            e.source === "manual" &&
            sceneOf(e, "before").actualJoints.some(
              (q, i) =>
                Math.abs(q - sceneOf(e, "after").actualJoints[i]) > 1e-6,
            ),
        ),
      );
  }
  if (id === "coordinates") {
    const move = scored.find(
      (e) =>
        e.type === "MOVE_COMPLETED" &&
        verified(e) &&
        movedZ(
          fk(sceneOf(e, "before").actualJoints).C,
          fk(sceneOf(e, "after").actualJoints).C,
        ) &&
        sceneOf(e, "before").actualJoints.filter(
          (q, i) => Math.abs(q - sceneOf(e, "after").actualJoints[i]) > 1e-8,
        ).length > 1,
    );
    checks.committedTenMillimetresZ = take(move);
    const inspected =
      move &&
      scored.find(
        (e) =>
          e.type === "JOINTS_INSPECTED" &&
          e.sequence > move.sequence &&
          (e.moveEventId === move.id || e.moveEventId == null),
      );
    checks.multipleJointsInspected = take(inspected);
    if (attempt.curriculumVersion >= 2)
      checks.calculationVerified = take(
        move &&
          scored.find(
            (e) =>
              e.type === "CALCULATION_SUBMITTED" &&
              e.moveEventId === move.id &&
              checkCalculation(moveMeasurement(move), e.answers),
          ),
      );
    if (move) {
      const a = fk(sceneOf(move, "before").actualJoints).C,
        b = fk(sceneOf(move, "after").actualJoints).C;
      measurements.push({
        type: "actualTcpDeltaMm",
        x: b.x - a.x,
        y: b.y - a.y,
        z: b.z - a.z,
        jointDeltasRad: sceneOf(move, "after").actualJoints.map(
          (q, i) => q - sceneOf(move, "before").actualJoints[i],
        ),
      });
    }
  }
  if (id === "grip") {
    const attached = scored.find(actualAttach);
    checks.actualObjectAttached = take(attached);
    const lifted =
      attached &&
      scored.find(
        (e) =>
          e.sequence > attached.sequence &&
          e.type === "MOVE_COMPLETED" &&
          verified(e) &&
          objectOf(sceneOf(e, "before"), attached.objectId)?.heldByGripper &&
          objectOf(sceneOf(e, "after"), attached.objectId)?.heldByGripper &&
          movedZ(
            objectOf(sceneOf(e, "before"), attached.objectId).worldPosition,
            objectOf(sceneOf(e, "after"), attached.objectId).worldPosition,
          ),
      );
    checks.objectLiftedTenMillimetres = take(lifted);
    if (lifted) {
      const a = objectOf(
          sceneOf(lifted, "before"),
          attached.objectId,
        ).worldPosition,
        b = objectOf(sceneOf(lifted, "after"), attached.objectId).worldPosition;
      measurements.push({
        type: "actualObjectDeltaMm",
        objectId: attached.objectId,
        x: b.x - a.x,
        y: b.y - a.y,
        z: b.z - a.z,
      });
    }
  }
  if (id === "program") {
    const runs = scored.filter(
      (e) =>
        e.type === "RUN_STARTED" &&
        verified(e) &&
        e.program?.kind === "bnta-3axis-program" &&
        e.program.modelId === CONFIG.modelId &&
        sceneOk(e.program.startScene) &&
        e.program.steps?.length > 0,
    );
    const replaySucceeded = (run) => {
      const attachment = scored.find(
          (e) =>
            e.sequence > run.sequence &&
            e.source === "replay" &&
            e.operationId === run.operationId &&
            actualAttach(e),
        ),
        release =
          attachment &&
          scored.find(
            (e) =>
              e.sequence > attachment.sequence &&
              e.source === "replay" &&
              e.operationId === run.operationId &&
              e.objectId === attachment.objectId &&
              releaseAtFixture(e, "destinationA"),
          );
      return (
        release &&
        scored.some(
          (e) =>
            e.sequence > release.sequence &&
            e.type === "RUN_COMPLETED" &&
            verified(e) &&
            e.operationId === run.operationId &&
            e.source === "replay",
        )
      );
    };
    const run = runs.find(replaySucceeded) ?? runs.at(-1);
    const manual = run
      ? scored.filter(
          (e) =>
            e.sequence < run.sequence &&
            e.source === "manual" &&
            verified(e) &&
            ["MOVE_COMPLETED", "GRIPPER_CHANGED"].includes(e.type) &&
            run.program.steps.some(
              (step) => step.completionEvidenceId === e.id,
            ),
        )
      : [];
    const recorded =
      run &&
      run.program.steps.every(
        (s) =>
          typeof s.completionEvidenceId === "string" &&
          manual.some((e) => e.id === s.completionEvidenceId),
      );
    checks.realRecordedActions = Boolean(recorded);
    if (recorded) manual.forEach(take);
    const first = manual[0],
      last = manual.at(-1),
      resetBefore =
        first &&
        scored.find(
          (e) =>
            e.type === "SCENE_RESET" &&
            verified(e) &&
            e.sequence < first.sequence,
        ),
      resetAfter =
        last &&
        scored.find(
          (e) =>
            e.type === "SCENE_RESET" &&
            verified(e) &&
            e.sequence > last.sequence &&
            e.sequence < run.sequence,
        );
    checks.resetBeforeRecording = take(resetBefore);
    checks.resetAfterRecording = take(resetAfter);
    checks.recordingEnabled = take(
      first &&
        scored.find(
          (e) =>
            e.type === "RECORDING_CHANGED" &&
            e.enabled === true &&
            e.sequence < first.sequence,
        ),
    );
    checks.recordingTurnedOff = take(
      last &&
        scored.find(
          (e) =>
            e.type === "RECORDING_CHANGED" &&
            e.enabled === false &&
            e.sequence > last.sequence &&
            e.sequence < run.sequence,
        ),
    );
    checks.replayStarted = take(run);
    const attached =
      run &&
      scored.find(
        (e) =>
          e.sequence > run.sequence &&
          e.source === "replay" &&
          e.operationId === run.operationId &&
          actualAttach(e),
      );
    const release =
      attached &&
      scored.find(
        (e) =>
          e.sequence > attached.sequence &&
          e.source === "replay" &&
          e.operationId === run.operationId &&
          e.objectId === attached.objectId &&
          releaseAtFixture(e, "destinationA"),
      );
    checks.replayPickedAndReleased = take(attached) && take(release);
    checks.replayCompleted = take(
      release &&
        scored.find(
          (e) =>
            ["RUN_COMPLETED", "PROGRAM_COMPLETED"].includes(e.type) &&
            verified(e) &&
            e.sequence > release.sequence &&
            e.operationId === run.operationId &&
            e.source === "replay",
        ),
    );
  }
  if (id === "obstacle") {
    if (attempt.transfer) {
      const edited = scored.find(
        (e) =>
          ["PROGRAM_EDITED", "PROGRAM_CLEARED"].includes(e.type) &&
          (e.programRevision ?? e.program?.revision) !==
            attempt.programRevisionAtStart,
      );
      const runs = scored.filter(
        (e) =>
          e.type === "RUN_STARTED" &&
          verified(e) &&
          e.program?.kind === "bnta-3axis-program" &&
          e.program.modelId === CONFIG.modelId &&
          sceneOk(e.program.startScene) &&
          e.program.steps?.length &&
          ((attempt.programRevisionAtStart !== null &&
            e.program.revision !== attempt.programRevisionAtStart) ||
            edited),
      );
      const run =
        runs.find((candidate) => {
          const release = scored.find(
            (e) =>
              e.sequence > candidate.sequence &&
              e.source === "replay" &&
              e.operationId === candidate.operationId &&
              releaseAtFixture(e, "destinationB"),
          );
          return (
            release &&
            scored.some(
              (e) =>
                e.sequence > release.sequence &&
                e.type === "RUN_COMPLETED" &&
                verified(e) &&
                e.source === "replay" &&
                e.operationId === candidate.operationId,
            )
          );
        }) ?? runs.at(-1);
      checks.newOrEditedProgram = take(run);
      if (edited) take(edited);
      const release =
        run &&
        scored.find(
          (e) =>
            e.sequence > run.sequence &&
            e.source === "replay" &&
            e.operationId === run.operationId &&
            releaseAtFixture(e, "destinationB"),
        );
      checks.deliveredToB = take(release);
      checks.destinationReallyChanged = Boolean(
        release &&
          fixtureOf(sceneOf(release, "after"), "destinationA") &&
          distance(
            fixtureOf(sceneOf(release, "after"), "destinationA").targetPosition,
            fixtureOf(sceneOf(release, "after"), "destinationB").targetPosition,
          ) > 2,
      );
      checks.replayCompleted = take(
        release &&
          scored.find(
            (e) =>
              ["RUN_COMPLETED", "PROGRAM_COMPLETED"].includes(e.type) &&
              verified(e) &&
              e.source === "replay" &&
              e.operationId === run.operationId &&
              e.sequence > release.sequence,
          ),
      );
      checks.noHints = attempt.hintCount === 0;
    } else {
      const rejected = scored.find((e) => {
        if (
          !["MOVE_REJECTED", "ACTION_REJECTED"].includes(e.type) ||
          !verified(e) ||
          e.error?.code !== "PATH_BLOCKED" ||
          !sameJson(
            actualScene(sceneOf(e, "before")),
            actualScene(sceneOf(e, "after")),
          )
        )
          return false;
        const before = sceneOf(e, "before"),
          source = fixtureOf(before, "source"),
          dest = fixtureOf(before, "destinationA");
        return (
          before.obstacles?.some(
            (o) =>
              o.id === "lesson-obstacle" &&
              closeTo(o.min, { x: 130, y: -12, z: 65 }, 1e-8) &&
              closeTo(o.max, { x: 160, y: 12, z: 100 }, 1e-8),
          ) &&
          before.objects.some((o) => o.heldByGripper) &&
          source &&
          dest &&
          closeTo(fk(before.actualJoints).C, source.targetPosition, 2) &&
          closeTo(e.targetMm ?? e.target, dest.targetPosition, 0.1)
        );
      });
      checks.directRouteRejectedWithoutMovement = take(rejected);
      const release =
        rejected &&
        scored.find(
          (e) =>
            e.sequence > rejected.sequence &&
            releaseAtFixture(e, "destinationA"),
        );
      checks.clearanceRouteDelivered = take(release);
      const clearance =
        rejected &&
        release &&
        scored.filter(
          (e) =>
            e.sequence > rejected.sequence &&
            e.sequence < release.sequence &&
            e.type === "MOVE_COMPLETED" &&
            verified(e) &&
            objectOf(sceneOf(e, "after"))?.heldByGripper,
        );
      checks.sourceAndDestinationClearance = Boolean(
        clearance &&
          ["source", "destinationA"].every((fixtureId) =>
            clearance.some((e) => {
              const s = sceneOf(e, "after"),
                f = fixtureOf(s, fixtureId);
              return (
                f &&
                closeTo(
                  fk(s.actualJoints).C,
                  { ...f.targetPosition, z: f.targetPosition.z + 50 },
                  0.1,
                )
              );
            }),
          ),
      );
      if (checks.sourceAndDestinationClearance) clearance.forEach(take);
      if (clearance?.length)
        measurements.push({
          type: "verifiedRouteDistanceMm",
          distance: clearance.reduce(
            (sum, e) =>
              sum +
              distance(
                fk(sceneOf(e, "before").actualJoints).C,
                fk(sceneOf(e, "after").actualJoints).C,
              ),
            0,
          ),
          note: "Sum of completed straight TCP segment lengths in the clearance portion; not a dynamics measurement.",
        });
    }
  }
  if (id === "design")
    checks.proposalFieldsSupplied = take(
      scored.find(
        (e) =>
          e.type === "DESIGN_SUBMITTED" &&
          e.proposal &&
          ["interest", "job", "bodyPlan", "benefit", "limit"].every((k) =>
            goodText(e.proposal[k]),
          ) &&
          INTERESTS.includes(e.proposal.interest) &&
          Object.hasOwn(BODY_PLAN_ANSWERS, e.proposal.bodyPlan),
      ),
    );
  const lastEvidence = Math.max(
    0,
    ...evidence.map(
      (eventId) => events.find((e) => e.id === eventId)?.sequence ?? 0,
    ),
  );
  checks.reflectionSuppliedAfterAttempt =
    goodText(attempt.reflection) &&
    (attempt.reflectionSequence ?? 0) > lastEvidence &&
    lastEvidence > 0;
  const complete = Object.values(checks).every(Boolean),
    status = complete
      ? attempt.transfer
        ? "transferPassed"
        : attempt.hintCount
          ? "completedWithHelp"
          : "completedWithoutHints"
      : "practicing";
  return {
    status,
    complete,
    checks,
    evidenceEventIds: evidence,
    measurements,
    reflectionAssessment:
      "supplied by learner; reasoning quality is not automatically graded",
  };
}
