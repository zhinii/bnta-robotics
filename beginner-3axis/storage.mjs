/** Versioned device-only storage and locally generated portfolio exports.
 * No network, names from device accounts, identifiers, imports, or legacy keys.
 */
import {
  CONFIG,
  finiteVec,
  validateJointPose,
  fk,
  distance,
  length,
  add,
  success,
  failure,
} from "./model.mjs";
import { collisionReport } from "./geometry.mjs";
import {
  validateApproach,
  validateInterval,
  preflightProgram,
  worldVector,
  alignment,
} from "./planner.mjs";
import {
  LEARNING_VERSION,
  MAX_TEXT_LENGTH,
  MAX_EVIDENCE_EVENTS,
  LESSONS,
  LESSON_STATUSES,
  createLearningState,
  evaluateLesson,
} from "./lessons.mjs";
import { t } from "./i18n.mjs";
import { sceneDifference } from "./program.mjs";
export const STORAGE_KEY = "bnta3axis:v1";
export const STORAGE_VERSION = 1;
export const CONFIG_ID =
  "bnta-educational-3r-v1:H80:A120:B100:T20:elbowNegative";
export const MAX_STORAGE_CHARACTERS = 12000000;
export const MAX_PROGRAM_STEPS = 500;
const clone = (x) => structuredClone(x);
const problem = (reason, details = {}) => ({
  ...failure("STORAGE_UNAVAILABLE", { reason, ...details }),
  rawRetained: true,
});
const finiteTree = (value, depth = 0) => {
  if (depth > 30) return false;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string") return value.length <= MAX_STORAGE_CHARACTERS;
  if (value === null || typeof value === "boolean") return true;
  if (Array.isArray(value))
    return (
      value.length <= 20000 && value.every((v) => finiteTree(v, depth + 1))
    );
  return (
    value &&
    typeof value === "object" &&
    Object.getPrototypeOf(value) === Object.prototype &&
    Object.entries(value).every(
      ([key, v]) =>
        !["__proto__", "constructor", "prototype"].includes(key) &&
        finiteTree(v, depth + 1),
    )
  );
};
export function validateStoredScene(scene) {
  try {
    if (
      !scene ||
      scene.modelId !== CONFIG.modelId ||
      !validateJointPose(scene.actualJoints).ok ||
      !["open", "closed"].includes(scene.gripperState) ||
      !Array.isArray(scene.objects) ||
      scene.objects.length > 20 ||
      !Array.isArray(scene.fixtures) ||
      !Array.isArray(scene.obstacles)
    )
      return false;
    if (
      !scene.objects.every(
        (o) =>
          typeof o.id === "string" &&
          o.id.length <= 80 &&
          finiteVec(o.worldPosition) &&
          finiteVec(o.worldForward) &&
          typeof o.heldByGripper === "boolean" &&
          Number.isFinite(o.radiusMm) &&
          o.radiusMm > 0 &&
          (!o.heldByGripper ||
            (finiteVec(o.relativePosition) && finiteVec(o.relativeForward))),
      )
    )
      return false;
    if (
      !scene.fixtures.every(
        (f) =>
          typeof f.id === "string" &&
          finiteVec(f.targetPosition) &&
          finiteVec(f.targetForward) &&
          Number.isFinite(f.toleranceMm) &&
          Number.isFinite(f.alignmentDeg),
      )
    )
      return false;
    if (
      !scene.obstacles.every(
        (o) =>
          typeof o.id === "string" &&
          finiteVec(o.min) &&
          finiteVec(o.max) &&
          ["x", "y", "z"].every((a) => o.min[a] <= o.max[a]),
      )
    )
      return false;
    // Held transforms are part of the sweep-bound contract, not decorative metadata.
    const tool = fk(scene.actualJoints),
      held = scene.objects.filter((o) => o.heldByGripper);
    if (held.length > 1 || (held.length && scene.gripperState !== "closed"))
      return false;
    if (
      new Set(scene.objects.map((o) => o.id)).size !== scene.objects.length ||
      new Set(scene.fixtures.map((f) => f.id)).size !== scene.fixtures.length
    )
      return false;
    for (const object of scene.objects) {
      if (
        Math.abs(length(object.worldForward) - 1) > 1e-6 ||
        Math.abs(object.radiusMm - 6) > 1e-8
      )
        return false;
      if (object.heldByGripper) {
        if (
          object.supportedByFixtureId !== null ||
          length(object.relativePosition) > 2 + 1e-8 ||
          Math.abs(length(object.relativeForward) - 1) > 1e-6 ||
          distance(
            add(tool.C, worldVector(object.relativePosition, tool)),
            object.worldPosition,
          ) > 1e-6 ||
          distance(
            worldVector(object.relativeForward, tool),
            object.worldForward,
          ) > 1e-6
        )
          return false;
      } else {
        const support = scene.fixtures.find(
          (f) => f.id === object.supportedByFixtureId,
        );
        if (
          !support ||
          distance(object.worldPosition, support.targetPosition) >
            Math.min(2, support.toleranceMm) + 1e-8 ||
          alignment(object.worldForward, support.targetForward) >
            (Math.min(10, support.alignmentDeg) * Math.PI) / 180 + 1e-8 ||
          object.relativePosition != null ||
          object.relativeForward != null
        )
          return false;
      }
    }
    if (
      scene.fixtures.some(
        (f) =>
          Math.abs(length(f.targetForward) - 1) > 1e-6 ||
          f.toleranceMm <= 0 ||
          f.toleranceMm > 2 ||
          f.alignmentDeg <= 0 ||
          f.alignmentDeg > 10,
      )
    )
      return false;
    if (!collisionReport(scene.actualJoints, scene.objects, scene, 0.5).ok)
      return false;
    const a = scene.approachEvidence;
    if (a !== null && a !== undefined) {
      if (
        a.modelId !== CONFIG.modelId ||
        !Array.isArray(a.samples) ||
        a.samples.length < 2 ||
        a.samples.length > 10000 ||
        !a.samples.every((q) => validateJointPose(q).ok) ||
        !Array.isArray(a.startJoints) ||
        !Array.isArray(a.endJoints) ||
        a.startJoints.some((q, i) => Math.abs(q - a.samples[0][i]) > 1e-8) ||
        a.endJoints.some((q, i) => Math.abs(q - a.samples.at(-1)[i]) > 1e-8) ||
        a.endJoints.some(
          (q, i) => Math.abs(q - scene.actualJoints[i]) > 1e-8,
        ) ||
        distance(fk(a.endJoints).C, a.to) > 0.1
      )
        return false;
      if (a.objectId) {
        const o = scene.objects.find((o) => o.id === a.objectId);
        if (!o || !validateApproach(scene, o).ok) return false;
      } else
        for (let i = 1; i < a.samples.length; i++)
          if (!validateInterval(scene, a.samples[i - 1], a.samples[i]).ok)
            return false;
    }
    return true;
  } catch {
    return false;
  }
}
export function validateStoredProgram(program) {
  try {
    if (program === null) return true;
    if (
      !program ||
      program.kind !== "bnta-3axis-program" ||
      program.version !== 1 ||
      program.modelId !== CONFIG.modelId ||
      !Number.isInteger(program.revision) ||
      program.revision < 0 ||
      !Array.isArray(program.steps) ||
      program.steps.length > MAX_PROGRAM_STEPS
    )
      return false;
    if (program.steps.length === 0) return program.startScene === null;
    if (!validateStoredScene(program.startScene)) return false;
    const ids = new Set();
    for (const step of program.steps) {
      if (
        !step ||
        typeof step.id !== "string" ||
        ids.has(step.id) ||
        typeof step.name !== "string" ||
        step.name.length > MAX_TEXT_LENGTH ||
        step.modelId !== CONFIG.modelId ||
        typeof step.completionEvidenceId !== "string"
      )
        return false;
      ids.add(step.id);
      if (
        step.type === "move"
          ? !finiteVec(step.targetMm)
          : step.type !== "gripper" ||
            !["open", "closed"].includes(step.gripperState)
      )
        return false;
    }
    // Regenerate plans instead of trusting any persisted validation flag/cache.
    const result = preflightProgram(program.startScene, program.steps);
    // Intentionally edited invalid programs remain reviewable but cannot run.
    if (result.ok)
      return (
        validateStoredScene(program.expectedEndScene) &&
        sceneDifference(result.value.endScene, program.expectedEndScene) ===
          null
      );
    return (
      (program.validationStatus === "invalid" ||
        program.validation?.ok === false) &&
      program.expectedEndScene === null
    );
  } catch {
    return false;
  }
}
export function validateLearningState(learning) {
  try {
    if (
      !learning ||
      learning.kind !== "bnta-3axis-learning" ||
      learning.version !== LEARNING_VERSION ||
      learning.modelId !== CONFIG.modelId ||
      !Array.isArray(learning.evidenceEvents) ||
      learning.evidenceEvents.length > MAX_EVIDENCE_EVENTS ||
      !Number.isInteger(learning.sequence) ||
      !LESSONS.some((l) => l.id === learning.currentLessonId)
    )
      return false;
    const ids = new Set();
    for (const e of learning.evidenceEvents) {
      if (
        typeof e.id !== "string" ||
        ids.has(e.id) ||
        typeof e.type !== "string" ||
        !Number.isInteger(e.sequence) ||
        e.sequence > learning.sequence ||
        typeof e.attemptId !== "string"
      )
        return false;
      ids.add(e.id);
      if (
        ["PREDICTION_SUBMITTED", "REFLECTION_SUBMITTED"].includes(e.type) &&
        (typeof e.text !== "string" || e.text.length > MAX_TEXT_LENGTH)
      )
        return false;
    }
    const attemptIds = new Set();
    for (const { id } of LESSONS) {
      const lesson = learning.lessons?.[id];
      if (
        !lesson ||
        !LESSON_STATUSES.includes(lesson.status) ||
        !Array.isArray(lesson.attempts) ||
        lesson.attempts.length > MAX_EVIDENCE_EVENTS
      )
        return false;
      if (
        lesson.currentAttemptId !== null &&
        !lesson.attempts.some((a) => a.id === lesson.currentAttemptId)
      )
        return false;
      let best = "notStarted";
      for (const a of lesson.attempts) {
        if (
          typeof a.id !== "string" ||
          attemptIds.has(a.id) ||
          a.lessonId !== id ||
          typeof a.prediction !== "string" ||
          a.prediction.length > MAX_TEXT_LENGTH ||
          typeof a.reflection !== "string" ||
          a.reflection.length > MAX_TEXT_LENGTH ||
          !Number.isInteger(a.hintCount) ||
          a.hintCount < 0 ||
          !LESSON_STATUSES.includes(a.status) ||
          !Array.isArray(a.evidenceEventIds)
        )
          return false;
        attemptIds.add(a.id);
        const events = learning.evidenceEvents.filter(
          (e) => e.attemptId === a.id,
        );
        if (
          events.some((e) => e.lessonId !== id) ||
          events.length !== a.evidenceEventIds.length ||
          a.evidenceEventIds.some((eid, i) => eid !== events[i].id)
        )
          return false;
        const prediction = events
            .filter((e) => e.type === "PREDICTION_SUBMITTED")
            .at(-1),
          reflection = events
            .filter((e) => e.type === "REFLECTION_SUBMITTED")
            .at(-1);
        if (
          a.prediction !== (prediction?.text.trim() ?? "") ||
          a.reflection !== (reflection?.text.trim() ?? "") ||
          a.predictionSequence !== prediction?.sequence ||
          a.reflectionSequence !== reflection?.sequence ||
          a.hintCount !==
            events.filter((e) =>
              ["HINT_SHOWN", "WORKED_EXAMPLE_SHOWN"].includes(e.type),
            ).length ||
          a.workedExampleCount !==
            events.filter((e) => e.type === "WORKED_EXAMPLE_SHOWN").length
        )
          return false;
        const view = {
            ...learning,
            currentLessonId: id,
            lessons: {
              ...learning.lessons,
              [id]: { ...lesson, currentAttemptId: a.id },
            },
          },
          actual = evaluateLesson(view, id);
        if (a.status !== actual.status) return false;
        if (
          LESSON_STATUSES.indexOf(actual.status) > LESSON_STATUSES.indexOf(best)
        )
          best = actual.status;
      }
      if (lesson.status !== best) return false;
    }
    return learning.evidenceEvents.every((e) => attemptIds.has(e.attemptId));
  } catch {
    return false;
  }
}
export function createProgressPayload(
  {
    program = null,
    learning = createLearningState(),
    language = "en",
    learnerName = "",
    scene = null,
  } = {},
  now = new Date().toISOString(),
) {
  return {
    kind: "bnta-3axis-progress",
    version: STORAGE_VERSION,
    modelId: CONFIG.modelId,
    configId: CONFIG_ID,
    savedAt: now,
    language,
    learnerName,
    program: clone(program),
    learning: clone(learning),
    scene: scene ? clone(scene) : null,
  };
}
export function validateProgressPayload(payload) {
  try {
    return Boolean(
      payload &&
        payload.kind === "bnta-3axis-progress" &&
        payload.version === STORAGE_VERSION &&
        payload.modelId === CONFIG.modelId &&
        payload.configId === CONFIG_ID &&
        ["en", "zh"].includes(payload.language) &&
        typeof payload.savedAt === "string" &&
        typeof payload.learnerName === "string" &&
        payload.learnerName.length <= 80 &&
        finiteTree(payload) &&
        validateLearningState(payload.learning) &&
        validateStoredProgram(payload.program) &&
        (payload.scene === null || validateStoredScene(payload.scene)),
    );
  } catch {
    return false;
  }
}
function parseRaw(raw) {
  if (typeof raw !== "string" || raw.length > MAX_STORAGE_CHARACTERS)
    return problem("payloadTooLarge");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return problem("malformedJson");
  }
  if (!validateProgressPayload(parsed))
    return problem("unsupportedOrInvalidPayload");
  return success(parsed);
}
/** File import is validated fully before the UI replaces any current work. */
export function parseProgressFile(raw) {
  if (typeof raw !== "string" || raw.length > MAX_STORAGE_CHARACTERS)
    return problem("payloadTooLarge");
  try {
    const value = JSON.parse(raw);
    return parseRaw(
      JSON.stringify(
        value.kind === "bnta-3axis-portfolio" ? value.resume : value,
      ),
    );
  } catch {
    return problem("malformedJson");
  }
}
/** An absent argument resolves browser storage inside try/catch, including its
 * privacy-mode getter. Dependency injection permits deterministic Node tests. */
export function loadProgress(storage) {
  try {
    storage = storage ?? globalThis.localStorage;
    if (!storage) return problem("storageUnavailable");
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { ok: true, value: null, empty: true };
    const parsed = parseRaw(raw);
    if (!parsed.ok) return parsed;
    const value = clone(parsed.value);
    if (value.program)
      value.program.validationStatus = value.program.steps.length
        ? preflightProgram(value.program.startScene, value.program.steps).ok
          ? "valid"
          : "invalid"
        : "empty";
    return success({
      ...value,
      recording: { enabled: false, blockedReason: null },
      execution: { status: "idle", plan: null, operationId: 0 },
    });
  } catch (error) {
    return problem("readFailed", { name: error?.name ?? "Error" });
  }
}
export function saveProgress(data, storage) {
  try {
    storage = storage ?? globalThis.localStorage;
    if (!storage) return problem("storageUnavailable");
    // A malformed or unknown stored payload is preserved until explicit reset.
    const existing = storage.getItem(STORAGE_KEY);
    if (existing !== null) {
      const check = parseRaw(existing);
      if (!check.ok)
        return {
          ...check,
          error: {
            ...check.error,
            details: { ...check.error.details, writeBlocked: true },
          },
        };
    }
    const payload =
      data?.kind === "bnta-3axis-progress"
        ? clone(data)
        : createProgressPayload(data);
    if (!validateProgressPayload(payload)) return problem("invalidSessionData");
    const raw = JSON.stringify(payload);
    if (raw.length > MAX_STORAGE_CHARACTERS)
      return problem("payloadTooLarge", { limit: MAX_STORAGE_CHARACTERS });
    storage.setItem(STORAGE_KEY, raw);
    return success({ saved: true, key: STORAGE_KEY, savedAt: payload.savedAt });
  } catch (error) {
    return problem("writeFailed", { name: error?.name ?? "Error" });
  }
}
export function resetStoredProgress(storage, { confirmed = false } = {}) {
  if (!confirmed) return problem("confirmationRequired");
  try {
    storage = storage ?? globalThis.localStorage;
    if (!storage) return problem("storageUnavailable");
    storage.removeItem(STORAGE_KEY);
    return success({ reset: true });
  } catch (error) {
    return problem("resetFailed", { name: error?.name ?? "Error" });
  }
}
export function createStorage(storage) {
  return {
    load: () => loadProgress(storage),
    save: (data) => saveProgress(data, storage),
    reset: (options) => resetStoredProgress(storage, options),
  };
}
/** Plain text has no HTML interpretation. UI previews must use textContent.
 * The separately provided escape helper is only for an explicitly HTML preview. */
export const escapeHtml = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        ch
      ],
  );
export function exportPortfolio(
  {
    program = null,
    learning = createLearningState(),
    learnerName = "",
    language = "en",
    scene = null,
  } = {},
  now = new Date().toISOString(),
) {
  if (
    typeof learnerName !== "string" ||
    learnerName.length > 80 ||
    !validateLearningState(learning) ||
    !validateStoredProgram(program)
  )
    return failure("INVALID_INPUT", { reason: "invalidPortfolio" });
  const lessonEvidence = LESSONS.map(({ id }) => ({
    lessonId: id,
    status: learning.lessons[id].status,
    attempts: clone(learning.lessons[id].attempts),
    currentChecks: evaluateLesson(learning, id),
  }));
  const textKey = (key) => t(language, `export.${key}`);
  const verification = {
    verified: textKey("verifiedSummary"),
    notVerified: textKey("notVerifiedSummary"),
    storage: textKey("localOnly"),
  };
  const portfolio = {
    kind: "bnta-3axis-portfolio",
    version: 1,
    modelId: CONFIG.modelId,
    configId: CONFIG_ID,
    modelConfig: {
      shoulderHeightMm: CONFIG.H,
      upperArmLengthMm: CONFIG.A,
      forearmLengthMm: CONFIG.B,
      fixedToolOffsetMm: CONFIG.T,
      branch: "elbowNegative",
    },
    timestamp: now,
    learnerName,
    program: clone(program),
    lessonEvidence,
    evidenceEvents: clone(learning.evidenceEvents),
    resume: createProgressPayload(
      { program, learning, learnerName, language, scene },
      now,
    ),
    verification,
  };
  const line = (key, value) => `${textKey(key)}: ${value}`;
  const lines = [
    t(language, "app.title"),
    line("model", CONFIG.modelId),
    line("config", CONFIG_ID),
    line("timestamp", now),
    line("learnerName", learnerName || textKey("optionalBlank")),
    line("programSteps", program?.steps?.length ?? 0),
    "",
  ];
  for (const lesson of lessonEvidence) {
    lines.push(
      `${t(language, `lessons.${lesson.lessonId}.title`)}: ${t(language, `status.${lesson.status}`)}`,
    );
    for (const a of lesson.attempts) {
      lines.push(
        `  ${line("attempt", a.id)}${a.transfer ? ` (${textKey("transfer")})` : ""}`,
        `  ${line("prediction", a.prediction || textKey("notSupplied"))}`,
        `  ${line("hints", a.hintCount)}; ${line("workedExamples", a.workedExampleCount)}`,
        `  ${line("status", t(language, `status.${a.status}`))}`,
        `  ${line("checks", JSON.stringify(a.checks))}`,
        `  ${line("measurements", JSON.stringify(a.measurements))}`,
        `  ${line("reflection", a.reflection || textKey("notSupplied"))}`,
      );
      if (a.design) lines.push(`  ${line("design", JSON.stringify(a.design))}`);
      for (const event of learning.evidenceEvents.filter(
        (e) =>
          e.attemptId === a.id &&
          ["CALCULATION_SUBMITTED", "IMAGE_CAPTURED"].includes(e.type),
      ))
        lines.push(`  ${event.type}: ${JSON.stringify(event)}`);
      if (a.transferResult)
        lines.push(
          `  ${line("changedTarget", JSON.stringify(a.transferResult))}`,
        );
      lines.push(`  ${line("evidenceIds", a.evidenceEventIds.join(", "))}`);
    }
    lines.push("");
  }
  lines.push(
    line("verified", verification.verified),
    line("notVerified", verification.notVerified),
    verification.storage,
  );
  return success({
    portfolio,
    json: JSON.stringify(portfolio, null, 2),
    text: lines.join("\n"),
    files: {
      json: "bnta-three-axis-portfolio.json",
      text: "bnta-three-axis-portfolio.txt",
    },
  });
}
export function portfolioBlobs(result) {
  if (!result?.ok) return result;
  return success({
    json: new Blob([result.value.json], {
      type: "application/json;charset=utf-8",
    }),
    text: new Blob([result.value.text], { type: "text/plain;charset=utf-8" }),
    files: result.value.files,
  });
}
