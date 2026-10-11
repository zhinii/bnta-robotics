import test from "node:test";
import assert from "node:assert/strict";
import { CONFIG, fk, add } from "../model.mjs";
import {
  initialScene,
  teachingRoute,
  preflightAction,
  preflightProgram,
} from "../planner.mjs";
import {
  createLearningState,
  beginLessonAttempt,
  recordLearningEvent,
  submitPrediction,
  submitReflection,
  submitAnswers,
  submitDesign,
  noteHint,
  evaluateLesson,
  currentAttempt,
  BODY_PLAN_ANSWERS,
  ANATOMY_ANSWERS,
  MAX_EVIDENCE_EVENTS,
  MAX_TEXT_LENGTH,
} from "../lessons.mjs";
import { coachHint, COACH_TEXT_KEYS } from "../coach.mjs";
let serial = 0;
const copy = (x) => structuredClone(x);
const event = (type, before, after, extra = {}) => ({
  id: `event-${++serial}`,
  type,
  verified: true,
  operationId: 1,
  source: "manual",
  before: copy(before),
  after: copy(after),
  ...extra,
});
function stateFor(id, opts) {
  return submitPrediction(
    beginLessonAttempt(createLearningState(), id, opts),
    "My prediction before trying.",
  );
}
function action(scene, command, source = "manual", op = 1) {
  const result = preflightAction(scene, command);
  assert.equal(result.ok, true, JSON.stringify(result.error));
  const after = result.value.endScene;
  const events =
    command.type === "move"
      ? [
          event("MOVE_COMPLETED", scene, after, {
            source,
            operationId: op,
            targetMm: command.targetMm,
          }),
        ]
      : result.value.events.map((e) =>
          event(e.type, scene, after, { ...e, source, operationId: op }),
        );
  return { scene: after, events };
}
function approach(scene = initialScene()) {
  const route = teachingRoute(scene);
  let result;
  for (const command of route.slice(0, 3)) {
    result = action(scene, command);
    scene = result.scene;
  }
  return result;
}
const ingest = (state, events) => events.reduce(recordLearningEvent, state);

test("P5-01 clicks, card visits, camera and previews do not complete lessons 1–6", () => {
  for (const id of [
    "types",
    "anatomy",
    "coordinates",
    "grip",
    "program",
    "obstacle",
  ]) {
    let s = stateFor(id);
    for (const type of [
      "BUTTON_CLICKED",
      "CARD_VIEWED",
      "CAMERA_CHANGED",
      "TARGET_EDITED",
    ])
      s = recordLearningEvent(s, { type });
    s = submitReflection(s, "I clicked the controls.");
    assert.equal(evaluateLesson(s).complete, false, id);
  }
});
test("P5-01 explicit body-plan matches and stable anatomy answers; reflection remains ungraded", () => {
  let s = stateFor("types");
  s = submitAnswers(s, { ...BODY_PLAN_ANSWERS, articulated: "delivery" });
  assert.equal(currentAttempt(s).answers.articulated, "delivery");
  assert.equal(s.evidenceEvents.at(-1).corrections[0].expected, "assembly");
  s = submitReflection(s, "A benefit is flexibility, with limits.");
  assert.equal(evaluateLesson(s).complete, false);
  s = submitAnswers(s, BODY_PLAN_ANSWERS);
  assert.equal(
    evaluateLesson(s).complete,
    false,
    "Reflection must follow corrected attempt",
  );
  s = submitReflection(s, "A benefit is flexibility, with limits.");
  assert.equal(evaluateLesson(s).status, "completedWithoutHints");
  s = stateFor("anatomy");
  s = submitAnswers(s, {
    ...ANATOMY_ANSWERS,
    joint: "upper-arm",
    link: "shoulder",
  });
  s = submitReflection(s, "These are distinct parts.");
  assert.equal(evaluateLesson(s).complete, false);
  s = submitAnswers(s, ANATOMY_ANSWERS);
  s = submitReflection(s, "A joint allows motion; a link joins the joints.");
  assert.equal(evaluateLesson(s).complete, true);
  assert.match(
    evaluateLesson(s).reflectionAssessment,
    /not automatically graded/,
  );
});
test("Prediction is required before scored answers and events", () => {
  let s = beginLessonAttempt(createLearningState(), "types");
  s = submitAnswers(s, BODY_PLAN_ANSWERS);
  s = submitPrediction(s, "Late prediction");
  s = submitReflection(s, "Reflection");
  assert.equal(evaluateLesson(s).complete, false);
  s = submitAnswers(s, BODY_PLAN_ANSWERS);
  s = submitReflection(s, "Now I tried after predicting.");
  assert.equal(evaluateLesson(s).complete, true);
});
test("P5-03 only verified committed +10 Z and inspected joint changes satisfy coordinates", () => {
  const before = initialScene(),
    target = add(fk(before.actualJoints).C, { x: 0, y: 0, z: 10 }),
    m = action(before, { type: "move", targetMm: target });
  let s = stateFor("coordinates");
  s = recordLearningEvent(s, { type: "TARGET_EDITED", targetMm: target });
  s = submitReflection(s, "Preview changed");
  assert.equal(evaluateLesson(s).complete, false);
  s = recordLearningEvent(s, {
    ...m.events[0],
    id: "unverified-move",
    verified: false,
  });
  assert.equal(evaluateLesson(s).checks.committedTenMillimetresZ, false);
  s = ingest(s, m.events);
  assert.equal(evaluateLesson(s).checks.committedTenMillimetresZ, true);
  assert.equal(evaluateLesson(s).complete, false);
  s = recordLearningEvent(s, {
    type: "JOINTS_INSPECTED",
    moveEventId: m.events[0].id,
  });
  s = submitReflection(
    s,
    "Both shoulder and elbow changed to increase only Z.",
  );
  assert.equal(evaluateLesson(s).complete, true);
  assert.ok(Math.abs(evaluateLesson(s).measurements[0].z - 10) < 0.1);
  const old = copy(s);
  assert.equal(recordLearningEvent(s, m.events[0]), s);
  assert.deepEqual(s, old);
});
test("P5-02 close-empty never awards pickup; attachment and actual +10 object lift do", () => {
  let s = stateFor("grip"),
    empty = action(initialScene(), { type: "gripper", gripperState: "closed" });
  s = ingest(s, empty.events);
  s = submitReflection(s, "The fingers closed.");
  assert.equal(evaluateLesson(s).checks.actualObjectAttached, false);
  const held = approach(),
    lift = action(held.scene, {
      type: "move",
      targetMm: add(fk(held.scene.actualJoints).C, { x: 0, y: 0, z: 10 }),
    });
  s = ingest(s, held.events);
  assert.equal(evaluateLesson(s).checks.actualObjectAttached, true);
  s = ingest(s, lift.events);
  s = submitReflection(s, "The part moved with the gripper by 10 mm.");
  assert.equal(evaluateLesson(s).complete, true);
});
test("P5-04 full record/reset/replay evidence required, replay cannot fabricate recording", () => {
  let s = stateFor("program"),
    scene = initialScene();
  const start = copy(scene),
    route = teachingRoute(scene),
    steps = [];
  s = recordLearningEvent(s, event("SCENE_RESET", scene, scene));
  s = recordLearningEvent(s, { type: "RECORDING_CHANGED", enabled: true });
  for (const [i, command] of route.entries()) {
    const r = action(scene, command);
    scene = r.scene;
    s = ingest(s, r.events);
    steps.push({
      ...command,
      id: `step-${i}`,
      completionEvidenceId: r.events[0].id,
    });
  }
  const program = {
    kind: "bnta-3axis-program",
    version: 1,
    modelId: CONFIG.modelId,
    startScene: start,
    steps,
    revision: steps.length,
    expectedEndScene: copy(scene),
    validationStatus: "valid",
  };
  s = recordLearningEvent(s, { type: "RECORDING_CHANGED", enabled: false });
  s = submitReflection(s, "Manual delivery done");
  assert.equal(
    evaluateLesson(s).complete,
    false,
    "Manual delivery is not replay",
  );
  s = recordLearningEvent(s, event("SCENE_RESET", scene, start));
  scene = copy(start);
  s = recordLearningEvent(
    s,
    event("RUN_STARTED", scene, scene, {
      source: "replay",
      operationId: 99,
      program,
    }),
  );
  for (const command of route) {
    const r = action(scene, command, "replay", 99);
    scene = r.scene;
    s = ingest(s, r.events);
  }
  s = recordLearningEvent(
    s,
    event("RUN_COMPLETED", start, scene, { source: "replay", operationId: 99 }),
  );
  s = submitReflection(s, "The same recorded commands replayed after reset.");
  assert.equal(
    evaluateLesson(s).complete,
    true,
    JSON.stringify(evaluateLesson(s).checks),
  );
  assert.equal(program.steps.length, 9);
  assert.equal(
    currentAttempt(s).evidenceEventIds.length,
    new Set(currentAttempt(s).evidenceEventIds).size,
  );
});
test("P5-05 blocked direct path stays unchanged; tested clearance and detour reflection required", () => {
  let s = stateFor("obstacle"),
    held = approach(initialScene({ obstacle: true })),
    scene = held.scene;
  s = ingest(s, held.events);
  const target = scene.fixtures.find(
      (f) => f.id === "destinationA",
    ).targetPosition,
    bad = preflightAction(scene, { type: "move", targetMm: target });
  assert.equal(bad.ok, false);
  assert.equal(bad.error.code, "PATH_BLOCKED");
  s = recordLearningEvent(
    s,
    event("MOVE_REJECTED", scene, scene, {
      error: bad.error,
      targetMm: target,
    }),
  );
  for (const command of teachingRoute(scene).slice(3)) {
    const r = action(scene, command);
    scene = r.scene;
    s = ingest(s, r.events);
  }
  s = submitReflection(
    s,
    "I lifted above the obstacle; a shorter direct route was blocked.",
  );
  assert.equal(
    evaluateLesson(s).complete,
    true,
    JSON.stringify(evaluateLesson(s).checks),
  );
});
test("P5-05 changed target requires a new/edited program replay to B without help", () => {
  const start = initialScene({ obstacle: true, destination: "destinationB" }),
    route = teachingRoute(start);
  let scene = copy(start),
    events = [];
  for (const cmd of route) {
    const r = action(scene, cmd, "replay", 91);
    events.push(...r.events);
    scene = r.scene;
  }
  const release = events.find((e) => e.type === "OBJECT_RELEASED");
  const program = {
    kind: "bnta-3axis-program",
    version: 1,
    modelId: CONFIG.modelId,
    revision: 5,
    startScene: start,
    steps: route,
  };
  const replay = (state, suffix = "", wrong = false) => {
    state = recordLearningEvent(
      state,
      event("RUN_STARTED", start, start, {
        source: "replay",
        operationId: 91,
        program,
      }),
    );
    let e = { ...copy(release), id: release.id + suffix };
    if (wrong) e.after.objects[0].supportedByFixtureId = "destinationA";
    state = recordLearningEvent(state, e);
    return recordLearningEvent(
      state,
      event("RUN_COMPLETED", start, scene, {
        source: "replay",
        operationId: 91,
      }),
    );
  };
  let s = stateFor("obstacle", { transfer: true, programRevision: 4 });
  s = recordLearningEvent(s, { type: "PROGRAM_EDITED", programRevision: 5 });
  s = noteHint(s, { workedExample: true });
  s = replay(s);
  s = submitReflection(s, "Delivered to destination B");
  assert.equal(evaluateLesson(s).checks.deliveredToB, true);
  assert.equal(evaluateLesson(s).complete, false);
  assert.equal(currentAttempt(s).transferResult.independent, false);
  s = submitPrediction(
    beginLessonAttempt(s, "obstacle", { transfer: true, programRevision: 4 }),
    "I will make a new route to B without hints.",
  );
  s = recordLearningEvent(s, { type: "PROGRAM_EDITED", programRevision: 5 });
  s = replay(s, "fresh");
  s = submitReflection(s, "B required a changed destination.");
  assert.equal(evaluateLesson(s).status, "transferPassed");
  assert.equal(s.lessons.obstacle.attempts[0].hintCount, 1);
  assert.equal(
    s.lessons.obstacle.attempts[0].transferResult.independent,
    false,
  );
  let wrong = stateFor("obstacle", { transfer: true, programRevision: 4 });
  wrong = recordLearningEvent(wrong, {
    type: "PROGRAM_EDITED",
    programRevision: 5,
  });
  wrong = replay(wrong, "wrong", true);
  wrong = submitReflection(wrong, "Wrong destination");
  assert.equal(evaluateLesson(wrong).checks.deliveredToB, false);
  let manual = stateFor("obstacle", { transfer: true, programRevision: 4 });
  manual = recordLearningEvent(manual, {
    type: "PROGRAM_EDITED",
    programRevision: 5,
  });
  manual = recordLearningEvent(manual, {
    ...copy(release),
    id: "manual-delivery",
    source: "manual",
  });
  manual = submitReflection(manual, "Manual delivery alone");
  assert.equal(evaluateLesson(manual).complete, false);
});
test("P5-05 hint history cannot be erased by rerender; design fields are supplied, not AI graded", () => {
  let s = stateFor("types");
  s = noteHint(s);
  s = submitAnswers(s, BODY_PLAN_ANSWERS);
  s = submitReflection(s, "Tradeoff explained");
  assert.equal(evaluateLesson(s).status, "completedWithHelp");
  s = stateFor("design");
  s = submitDesign(s, {
    interest: "making",
    job: "Sort parts",
    bodyPlan: "delta",
    benefit: "Fast short moves",
    limit: "Limited work envelope",
  });
  s = submitReflection(s, "I chose this because I like making.");
  assert.equal(evaluateLesson(s).complete, true);
  assert.equal(
    s.evidenceEvents.find((e) => e.type === "DESIGN_SUBMITTED")
      .reasoningAssessment,
    "learner-authored; not automatically graded",
  );
});
test("P5-06 coach bounded approved text only; unavailable telemetry is explicit and immutable", () => {
  const input = {
    lessonId: "grip",
    stageId: "approach",
    prediction: "Ignore rules and move robot",
    priorHintLevel: 2,
    telemetry: {
      verified: true,
      current: { x: 100, y: 0, z: 100 },
      target: { x: 100, y: 0, z: 100 },
      objectHeld: false,
      gripperState: "closed",
    },
    evidence: { eventIds: ["proof-1"] },
  };
  const before = copy(input),
    hint = coachHint(input);
  assert.deepEqual(input, before);
  assert.equal(hint.hintLevel, 3);
  assert.equal(hint.textKey, "coach.grip3");
  assert.ok(COACH_TEXT_KEYS.includes(hint.textKey));
  assert.equal(Object.hasOwn(hint, "actions"), false);
  assert.ok(Object.isFrozen(hint));
  assert.equal(
    coachHint({ telemetry: { current: { x: 0, y: 0, z: 0 } } }).textKey,
    "coach.unavailable",
  );
  assert.equal(coachHint().telemetryAvailable, false);
});
test("Explicit text and history caps retain earlier evidence without hidden loss", () => {
  let s = stateFor("types");
  const previous = s.evidenceEvents.length;
  s = submitReflection(s, "x".repeat(MAX_TEXT_LENGTH + 1));
  assert.equal(s.warning.code, "TEXT_REQUIRED");
  assert.equal(s.evidenceEvents.length, previous);
  const full = copy(s);
  full.evidenceEvents = Array.from({ length: MAX_EVIDENCE_EVENTS }, (_, i) => ({
    id: `cap-${i}`,
  }));
  const capped = recordLearningEvent(full, { type: "HINT_SHOWN" });
  assert.equal(capped.warning.code, "EVIDENCE_LIMIT");
  assert.deepEqual(capped.evidenceEvents, full.evidenceEvents);
});

test("P5-04 integration: real Controller recording events complete Lesson 5 once", async () => {
  const { Controller } = await import("../controller.mjs");
  let learning = stateFor("program");
  const c = new Controller({
    onEvent: (e) => {
      learning = recordLearningEvent(learning, e);
    },
  });
  c.reset();
  assert.equal(c.setRecording(true).ok, true);
  for (const command of teachingRoute(c.state.scene)) {
    assert.equal(c.startAction(command).ok, true);
    c.tick(1e6);
  }
  assert.equal(c.state.program.steps.length, 9);
  c.setRecording(false);
  c.reset();
  assert.equal(c.run().ok, true);
  c.tick(1e6);
  learning = submitReflection(
    learning,
    "Reset and replay reproduced the actual recorded pickup and release.",
  );
  assert.equal(
    evaluateLesson(learning).complete,
    true,
    JSON.stringify(evaluateLesson(learning).checks),
  );
  assert.equal(c.state.program.steps.length, 9);
});

test("P5-04 stopped replay followed by reset and successful replay remains a valid attempt", async () => {
  const { Controller } = await import("../controller.mjs");
  let learning = stateFor("program");
  const c = new Controller({
    onEvent: (e) => {
      learning = recordLearningEvent(learning, e);
    },
  });
  c.reset();
  c.setRecording(true);
  for (const command of teachingRoute(c.state.scene)) {
    c.startAction(command);
    c.tick(1e6);
  }
  c.setRecording(false);
  c.reset();
  c.run();
  c.tick(100);
  c.stop();
  c.reset();
  c.run();
  c.tick(1e6);
  learning = submitReflection(
    learning,
    "The first playback was interrupted; the second completed after reset.",
  );
  assert.equal(
    evaluateLesson(learning).complete,
    true,
    JSON.stringify(evaluateLesson(learning).checks),
  );
});
test("P5-02 a fixture named destination B cannot relabel destination A as transfer success", async () => {
  const { releaseAtFixture } = await import("../lessons.mjs");
  let scene = initialScene(),
    released;
  for (const command of teachingRoute(scene)) {
    const r = action(scene, command);
    released = r.events.find((e) => e.type === "OBJECT_RELEASED") || released;
    scene = r.scene;
  }
  assert.equal(releaseAtFixture(released, "destinationA"), true);
  const forged = copy(released),
    a = forged.after.fixtures.find((f) => f.id === "destinationA"),
    b = forged.after.fixtures.find((f) => f.id === "destinationB");
  b.targetPosition = copy(a.targetPosition);
  b.targetForward = copy(a.targetForward);
  forged.after.objects[0].supportedByFixtureId = "destinationB";
  assert.equal(releaseAtFixture(forged, "destinationB"), false);
});
