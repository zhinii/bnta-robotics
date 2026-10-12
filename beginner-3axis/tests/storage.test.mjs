import test from "node:test";
import assert from "node:assert/strict";
import { CONFIG } from "../model.mjs";
import {
  initialScene,
  teachingRoute,
  preflightProgram,
  preflightAction,
} from "../planner.mjs";
import {
  createLearningState,
  beginLessonAttempt,
  submitPrediction,
  submitReflection,
  submitAnswers,
  BODY_PLAN_ANSWERS,
} from "../lessons.mjs";
import {
  STORAGE_KEY,
  CONFIG_ID,
  createProgressPayload,
  validateProgressPayload,
  saveProgress,
  loadProgress,
  resetStoredProgress,
  exportPortfolio,
  portfolioBlobs,
  escapeHtml,
  validateStoredScene,
} from "../storage.mjs";
function memoryStore(initial = {}) {
  const map = new Map(Object.entries(initial)),
    calls = [];
  return {
    map,
    calls,
    getItem(key) {
      calls.push(["get", key]);
      return map.get(key) ?? null;
    },
    setItem(key, value) {
      calls.push(["set", key]);
      map.set(key, value);
    },
    removeItem(key) {
      calls.push(["remove", key]);
      map.delete(key);
    },
  };
}
function sampleProgram() {
  const scene = initialScene(),
    steps = teachingRoute(scene).map((s, i) => ({
      ...s,
      id: `step-${i}`,
      completionEvidenceId: `e-${i}`,
    })),
    plan = preflightProgram(scene, steps);
  assert.equal(plan.ok, true);
  return {
    kind: "bnta-3axis-program",
    version: 1,
    modelId: CONFIG.modelId,
    startScene: scene,
    steps,
    revision: 9,
    expectedEndScene: plan.value.endScene,
    validationStatus: "valid",
  };
}

test("P5-07 save/reload uses only new namespace, restores work with recording OFF and idle", () => {
  const store = memoryStore({ "bnta-cargo-progress": "original untouched" }),
    program = sampleProgram(),
    data = createProgressPayload(
      { program, language: "zh", scene: program.startScene },
      "2026-10-11T00:00:00Z",
    );
  data.recording = { enabled: true };
  data.execution = { status: "running" };
  assert.equal(saveProgress(data, store).ok, true);
  const loaded = loadProgress(store);
  assert.equal(loaded.ok, true);
  assert.equal(loaded.value.recording.enabled, false);
  assert.equal(loaded.value.execution.status, "idle");
  assert.equal(loaded.value.execution.plan, null);
  assert.equal(loaded.value.language, "zh");
  assert.equal(loaded.value.program.steps.length, 9);
  assert.equal(store.map.get("bnta-cargo-progress"), "original untouched");
  assert.ok(store.calls.every(([, key]) => key === STORAGE_KEY));
});
test("P5-07 corrupt, stale version and wrong model are retained and block accidental overwrite", () => {
  for (const bad of [
    "{broken",
    JSON.stringify({ ...createProgressPayload(), version: 99 }),
    JSON.stringify({ ...createProgressPayload(), modelId: "old" }),
  ]) {
    const store = memoryStore({ [STORAGE_KEY]: bad });
    assert.equal(loadProgress(store).ok, false);
    assert.equal(saveProgress(createProgressPayload(), store).ok, false);
    assert.equal(store.map.get(STORAGE_KEY), bad);
    assert.equal(resetStoredProgress(store).ok, false);
    assert.equal(store.map.get(STORAGE_KEY), bad);
    assert.equal(resetStoredProgress(store, { confirmed: true }).ok, true);
    assert.equal(store.map.has(STORAGE_KEY), false);
  }
});
test("P5-07 quota/privacy storage failures leave session usable and do not claim saved", () => {
  const state = createProgressPayload(),
    before = structuredClone(state),
    quota = memoryStore();
  quota.setItem = () => {
    throw new DOMException("Full", "QuotaExceededError");
  };
  const result = saveProgress(state, quota);
  assert.equal(result.ok, false);
  assert.equal(result.error.code, "STORAGE_UNAVAILABLE");
  assert.equal(result.error.details.reason, "writeFailed");
  assert.deepEqual(state, before);
  assert.equal(
    loadProgress({
      getItem() {
        throw new Error("privacy");
      },
    }).ok,
    false,
  );
  assert.equal(loadProgress(memoryStore()).empty, true);
});
test("P5-07 saved approach provenance is rechecked; geometrically stale evidence fails", () => {
  let scene = initialScene();
  for (const command of teachingRoute(scene).slice(0, 2)) {
    const r = preflightAction(scene, command);
    assert.equal(r.ok, true);
    scene = r.value.endScene;
  }
  assert.equal(validateStoredScene(scene), true);
  const corrupt = structuredClone(scene);
  corrupt.approachEvidence.endJoints[0] += 0.05;
  assert.equal(validateStoredScene(corrupt), false);
  const stale = structuredClone(scene);
  stale.obstacles.push({
    id: "new-obstacle",
    min: { x: 250, y: 250, z: 0 },
    max: { x: 260, y: 260, z: 10 },
  });
  assert.equal(validateStoredScene(stale), false);
});
test("P5-08 JSON/text include actual evidence and honest limits, optional name blank by default", async () => {
  let learning = submitPrediction(
    beginLessonAttempt(createLearningState(), "types"),
    '<script>alert("name")</script>',
  );
  learning = submitAnswers(learning, BODY_PLAN_ANSWERS);
  learning = submitReflection(
    learning,
    "<img src=x onerror=evil()> Learner-authored reflection.",
  );
  const result = exportPortfolio(
    { learning, program: sampleProgram() },
    "2026-10-11T12:00:00Z",
  );
  assert.equal(result.ok, true);
  const parsed = JSON.parse(result.value.json);
  assert.equal(parsed.learnerName, "");
  assert.equal(parsed.modelId, CONFIG.modelId);
  assert.equal(parsed.configId, CONFIG_ID);
  assert.equal(parsed.timestamp, "2026-10-11T12:00:00Z");
  assert.equal(parsed.program.steps.length, 9);
  assert.equal(parsed.lessonEvidence[0].status, "completedWithoutHints");
  assert.equal(parsed.lessonEvidence[1].status, "notStarted");
  assert.equal(parsed.evidenceEvents.length, 3);
  assert.match(parsed.verification.notVerified, /No screenshot/);
  assert.match(result.value.text, /Learner-authored reflection/);
  assert.equal(Object.hasOwn(parsed, "userId"), false);
  assert.equal(Object.hasOwn(parsed, "email"), false);
  assert.match(escapeHtml(result.value.text), /&lt;script&gt;/);
  assert.doesNotMatch(escapeHtml(result.value.text), /<script>/);
  const blobs = portfolioBlobs(result);
  assert.equal(blobs.value.text.type, "text/plain;charset=utf-8");
  assert.equal(await blobs.value.json.text(), result.value.json);
});
test("P5-08 invalid oversized learner names or fabricated current statuses are not silently invented", () => {
  assert.equal(exportPortfolio({ learnerName: "x".repeat(81) }).ok, false);
  assert.equal(
    validateProgressPayload({
      ...createProgressPayload(),
      learnerName: "x".repeat(81),
    }),
    false,
  );
  const result = exportPortfolio();
  assert.equal(result.ok, true);
  assert.ok(
    result.value.portfolio.lessonEvidence.every(
      (l) => l.status === "notStarted",
    ),
  );
});

test("P5-07 unsafe physical snapshots are rejected without replacing retained raw data", () => {
  let held = initialScene();
  for (const command of teachingRoute(held).slice(0, 3)) {
    const r = preflightAction(held, command);
    assert.equal(r.ok, true);
    held = r.value.endScene;
  }
  assert.equal(validateStoredScene(held), true);
  const examples = [];
  const floor = initialScene();
  floor.actualJoints = [0, 0, -Math.PI / 2];
  examples.push(floor);
  const open = structuredClone(held);
  open.gripperState = "open";
  examples.push(open);
  const offset = structuredClone(held);
  offset.objects[0].relativePosition = { x: 100, y: 100, z: 100 };
  examples.push(offset);
  const inconsistent = structuredClone(held);
  inconsistent.objects[0].worldPosition.x += 1;
  examples.push(inconsistent);
  const bothSupported = structuredClone(held);
  bothSupported.objects[0].supportedByFixtureId = "source";
  examples.push(bothSupported);
  const unsupported = initialScene();
  unsupported.objects[0].supportedByFixtureId = null;
  examples.push(unsupported);
  for (const scene of examples) {
    assert.equal(validateStoredScene(scene), false);
    const raw = JSON.stringify(createProgressPayload({ scene })),
      store = memoryStore({ [STORAGE_KEY]: raw });
    assert.equal(loadProgress(store).ok, false);
    assert.equal(saveProgress(createProgressPayload(), store).ok, false);
    assert.equal(store.map.get(STORAGE_KEY), raw);
  }
});
test("P5-07 integration: delete final recorded step then save/reload retains empty program", async () => {
  const { Controller } = await import("../controller.mjs");
  const c = new Controller();
  c.setRecording(true);
  c.grip("closed");
  assert.equal(c.state.program.steps.length, 1);
  assert.equal(c.editProgram(0, "delete").ok, true);
  assert.equal(c.state.program.startScene, null);
  const store = memoryStore();
  assert.equal(
    saveProgress({ program: c.state.program, scene: c.state.scene }, store).ok,
    true,
  );
  const loaded = loadProgress(store);
  assert.equal(loaded.ok, true);
  assert.equal(loaded.value.program.steps.length, 0);
  assert.equal(loaded.value.program.startScene, null);
  assert.equal(loaded.value.recording.enabled, false);
});
test("P5-08 fabricated status or removed hint history is rejected instead of exported as success", () => {
  const bad = createLearningState();
  bad.lessons.types.status = "completedWithoutHints";
  assert.equal(exportPortfolio({ learning: bad }).ok, false);
  let learning = submitPrediction(
    beginLessonAttempt(createLearningState(), "types"),
    "Predict",
  );
  learning = submitAnswers(learning, BODY_PLAN_ANSWERS);
  learning = submitReflection(learning, "Reflect");
  learning.lessons.types.attempts[0].status = "transferPassed";
  assert.equal(exportPortfolio({ learning }).ok, false);
});
test("P5-08 readable Chinese export uses translated prose and preserves raw learner text as plain text", () => {
  const result = exportPortfolio({ language: "zh", learnerName: "小林" });
  assert.equal(result.ok, true);
  assert.match(result.value.text, /学习者姓名: 小林/);
  assert.match(result.value.text, /未验证内容/);
  assert.doesNotMatch(result.value.text, /Learner name:/);
});
test("P5-07 stale recorded expected endpoint is rejected before restore or export", () => {
  const program = sampleProgram();
  program.expectedEndScene.actualJoints[0] += 0.1;
  const payload = createProgressPayload({ program }),
    raw = JSON.stringify(payload),
    store = memoryStore({ [STORAGE_KEY]: raw });
  assert.equal(loadProgress(store).ok, false);
  assert.equal(store.map.get(STORAGE_KEY), raw);
  assert.equal(exportPortfolio({ program }).ok, false);
});
test("P5-07 an invalid Move does not poison subsequent learning persistence", async () => {
  const { Controller } = await import("../controller.mjs"),
    { recordLearningEvent } = await import("../lessons.mjs");
  let learning = beginLessonAttempt(createLearningState(), "coordinates");
  const c = new Controller({
    onEvent: (e) => {
      learning = recordLearningEvent(learning, e);
    },
  });
  c.editTarget("z", "");
  assert.equal(c.move().ok, false);
  const store = memoryStore();
  assert.equal(
    saveProgress(
      { program: c.state.program, scene: c.state.scene, learning },
      store,
    ).ok,
    true,
  );
  assert.equal(loadProgress(store).ok, true);
});
test("P5-07 approach made before recording survives a saved one-step Close program", async () => {
  const { Controller } = await import("../controller.mjs");
  const c = new Controller();
  for (const command of teachingRoute(c.state.scene).slice(0, 2)) {
    c.startAction(command);
    c.tick(1e6);
  }
  c.setRecording(true);
  c.grip("closed");
  assert.equal(c.state.program.steps.length, 1);
  const store = memoryStore();
  assert.equal(
    saveProgress({ program: c.state.program, scene: c.state.scene }, store).ok,
    true,
  );
  const loaded = loadProgress(store);
  assert.equal(loaded.ok, true);
  const restored = new Controller({ scene: loaded.value.scene });
  restored.state.program = loaded.value.program;
  restored.reset();
  assert.equal(restored.run().ok, true);
  restored.tick(1e6);
  assert.equal(restored.state.scene.objects[0].heldByGripper, true);
});

test("Legacy matching progress is validated and re-scored without losing evidence", () => {
  let learning = beginLessonAttempt(createLearningState(), "types");
  learning = submitPrediction(learning, "The robot shape should suit the job.");
  learning = submitReflection(
    learning,
    "I compared the tasks and chose the mechanisms that fit.",
  );
  learning = submitAnswers(learning, BODY_PLAN_ANSWERS, "types");
  const payload = createProgressPayload({ learning });
  const a = payload.learning.lessons.types.attempts.at(-1);
  a.status = "practicing";
  payload.learning.lessons.types.status = "practicing";
  assert.equal(validateProgressPayload(payload), false);
  const rawEvents = JSON.stringify(payload.learning.evidenceEvents);
  const store = memoryStore({ [STORAGE_KEY]: JSON.stringify(payload) });
  const restored = loadProgress(store);
  assert.equal(restored.ok, true);
  assert.equal(
    restored.value.learning.lessons.types.attempts.at(-1).status,
    "completedWithoutHints",
  );
  assert.equal(
    JSON.stringify(restored.value.learning.evidenceEvents),
    rawEvents,
  );
  const forged = createProgressPayload({ learning: createLearningState() });
  forged.learning.lessons.types.status = "completedWithoutHints";
  assert.equal(
    loadProgress(memoryStore({ [STORAGE_KEY]: JSON.stringify(forged) })).ok,
    false,
  );
});
