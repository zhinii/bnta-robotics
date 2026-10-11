import test from "node:test";
import assert from "node:assert/strict";
import { dictionaries, en, zh, supportedLanguages, t } from "../i18n.mjs";

const controls = [
  "move",
  "current",
  "target",
  "record",
  "reset",
  "clear",
  "run",
  "pause",
  "resume",
  "stop",
  "open",
  "close",
  "homeView",
  "steps",
  "cancel",
  "confirm",
  "closeDrawer",
  "save",
  "submit",
  "next",
  "previous",
  "hint",
  "example",
  "export",
  "exportJson",
  "exportText",
  "startDemo",
  "endDemo",
  "newAttempt",
  "transfer",
  "obstacle",
  "route",
  "increment",
  "increase",
  "decrease",
  "targetAxis",
  "jointAngle",
  "editStep",
  "deleteStep",
  "stepUp",
  "stepDown",
  "stepSize",
  "grid",
  "axes",
  "labels",
  "proxies",
  "jointDemo",
  "exitDemo",
  "moveJoint",
  "confirmClear",
  "rename",
  "up",
  "down",
  "delete",
  "previewWaypoint",
  "prediction",
  "savePrediction",
  "reflection",
  "saveReflection",
  "submitAnswers",
  "inspectJoints",
  "changedTarget",
  "workedExample",
  "learnerName",
  "interest",
  "job",
  "bodyPlan",
  "benefit",
  "limit",
  "saveDesign",
];
const errorCodes = [
  "INVALID_INPUT",
  "UNREACHABLE",
  "SINGULAR",
  "WORKSPACE_LIMIT",
  "JOINT_LIMIT",
  "NUMERICAL_FAILURE",
  "PATH_BLOCKED",
  "SELF_COLLISION",
  "FLOOR_COLLISION",
  "PATH_COMPLEXITY",
  "BUSY",
  "START_STATE_MISMATCH",
  "INVALID_PROGRAM",
  "GRASP_APPROACH_REQUIRED",
  "UNSUPPORTED_RELEASE",
  "STORAGE_UNAVAILABLE",
];
const placeholders = (text) =>
  [...text.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)]
    .map((match) => match[1])
    .sort();

test("P5-09 dictionaries have complete, non-empty English/Chinese key parity", () => {
  assert.deepEqual(supportedLanguages, ["en", "zh"]);
  assert.deepEqual(Object.keys(en).sort(), Object.keys(zh).sort());
  assert.ok(Object.keys(en).length >= 250);
  for (const language of supportedLanguages) {
    for (const [key, value] of Object.entries(dictionaries[language])) {
      assert.equal(typeof value, "string", `${language}.${key}`);
      assert.ok(value.trim().length > 0, `${language}.${key}`);
      assert.equal(t(language, key), value);
    }
  }
});

test("renderer labels, stable answer IDs, learner interests, and export fields are covered", () => {
  const groups = {
    scene: [
      "current",
      "target",
      "invalid",
      "source",
      "destinationA",
      "destinationB",
      "base",
      "shoulder",
      "elbow",
      "yaw",
      "upper",
      "forearm",
      "gripper",
      "actuator",
      "controller",
      "unsupported",
      "canvas",
      "help",
      "held",
      "open",
      "closed",
      "yes",
      "no",
    ],
    parts: [
      "base",
      "upper-arm",
      "shoulder",
      "actuator",
      "gripper",
      "controller",
    ],
    interests: [
      "making",
      "coding",
      "design",
      "maths",
      "science",
      "helpingPeople",
    ],
    bodyPlan: ["articulated", "cartesian", "scara", "delta", "mobile"],
    anatomy: ["base", "link", "joint", "actuator", "endEffector", "controller"],
    status: [
      "notStarted",
      "practicing",
      "completedWithHelp",
      "completedWithoutHints",
      "transferPassed",
      "sceneReset",
      "programKept",
      "recordOn",
      "recordOff",
      "heldYes",
      "heldNo",
      "pathChecked",
      "notVerified",
      "storageWarning",
      "noop",
      "ready",
      "busy",
    ],
    export: [
      "model",
      "config",
      "timestamp",
      "learnerName",
      "optionalBlank",
      "programSteps",
      "attempt",
      "transfer",
      "prediction",
      "notSupplied",
      "hints",
      "workedExamples",
      "status",
      "checks",
      "measurements",
      "reflection",
      "design",
      "changedTarget",
      "evidenceIds",
      "verified",
      "notVerified",
      "localOnly",
      "verifiedSummary",
      "notVerifiedSummary",
    ],
  };
  for (const [group, fields] of Object.entries(groups))
    for (const field of fields) {
      for (const language of supportedLanguages) {
        assert.ok(
          Object.hasOwn(dictionaries[language], `${group}.${field}`),
          `${language}: ${group}.${field}`,
        );
      }
    }
});

test("all required controls, status readouts, error codes, and lesson fields exist in both languages", () => {
  const required = [
    "app.title",
    "mode.learn",
    "mode.explore",
    "language.label",
    "status.objectHeld",
    "status.gripper",
    "status.on",
    "status.off",
    "status.yes",
    "status.no",
    "status.simulated",
    "coach.title",
    "storage.unavailable",
    "portfolio.verified",
    "portfolio.notVerified",
    ...controls.map((key) => `control.${key}`),
    ...errorCodes.map((code) => `error.${code}`),
    ...[
      "types",
      "anatomy",
      "coordinates",
      "grip",
      "program",
      "obstacle",
      "design",
    ].flatMap((lesson) =>
      ["title", "task", "hint", "example"].map(
        (field) => `lessons.${lesson}.${field}`,
      ),
    ),
    ...[
      "notStarted",
      "practicing",
      "completedWithHelp",
      "completedWithoutHints",
      "transferPassed",
    ].map((status) => `learn.${status}`),
  ];
  for (const key of required)
    for (const language of supportedLanguages) {
      assert.ok(
        Object.hasOwn(dictionaries[language], key),
        `${language}: ${key}`,
      );
      assert.notEqual(t(language, key), `[${key}]`);
    }
});

test("body plans, job options, and anatomy provide teaching copy in both languages", () => {
  for (const plan of ["articulated", "cartesian", "scara", "delta", "mobile"]) {
    for (const field of ["title", "description", "job", "tradeoff"]) {
      for (const language of supportedLanguages)
        assert.ok(dictionaries[language][`bodyPlans.${plan}.${field}`]);
    }
  }
  for (const part of [
    "base",
    "link",
    "joint",
    "actuator",
    "endEffector",
    "controller",
    "sensor",
  ]) {
    for (const language of supportedLanguages) {
      assert.ok(dictionaries[language][`anatomy.${part}.title`]);
      assert.ok(dictionaries[language][`anatomy.${part}.description`]);
    }
  }
  for (const job of [
    "assembly",
    "gantry",
    "pickPlace",
    "sorting",
    "delivery",
  ]) {
    for (const language of supportedLanguages)
      assert.ok(dictionaries[language][`jobs.${job}`]);
  }
});

test("every live lesson check and final HTML label is translated", () => {
  const checkIds = [
    "prediction",
    "allBodyPlansMatched",
    "allPartsIdentified",
    "jointDistinctFromLink",
    "committedTenMillimetresZ",
    "multipleJointsInspected",
    "actualObjectAttached",
    "objectLiftedTenMillimetres",
    "realRecordedActions",
    "resetBeforeRecording",
    "resetAfterRecording",
    "recordingEnabled",
    "recordingTurnedOff",
    "replayStarted",
    "replayPickedAndReleased",
    "replayCompleted",
    "newOrEditedProgram",
    "deliveredToB",
    "destinationReallyChanged",
    "noHints",
    "directRouteRejectedWithoutMovement",
    "clearanceRouteDelivered",
    "sourceAndDestinationClearance",
    "proposalFieldsSupplied",
    "reflectionSuppliedAfterAttempt",
  ];
  const keys = [
    "scene.title",
    "route.title",
    "route.previewOnly",
    "control.frame",
    "units.mm",
    "demo.explanation",
    "help.title",
    "help.model",
    "help.fixtures",
    "help.collision",
    "help.noSafety",
    "portfolio.title",
    "next.delta",
    "next.target",
    "status.execution",
    "program.count",
    "program.invalid",
    "lesson.checks",
    "clear.question",
    ...checkIds.map((id) => `checks.${id}`),
  ];
  for (const language of supportedLanguages)
    for (const key of keys) {
      assert.ok(
        Object.hasOwn(dictionaries[language], key),
        `${language}: ${key}`,
      );
    }
  assert.equal(
    t("zh", "next.delta", { axis: "Z", amount: "+10" }),
    "下一步变化：Z +10 毫米",
  );
  assert.equal(
    t("en", "status.execution", { state: "Ready", step: 0 }),
    "Execution: Ready · Step 0",
  );
  assert.equal(
    t("zh", "clear.question", { count: 9 }),
    "清空全部 9 个录制步骤？",
  );
});

test("all approved scripted-coach ladders are translated and accurately state offline limits", () => {
  for (const topic of ["preview", "grip", "blocked", "start", "generic"]) {
    for (const level of [1, 2, 3]) {
      for (const language of supportedLanguages)
        assert.ok(dictionaries[language][`coach.${topic}${level}`]);
    }
  }
  assert.match(en["coach.unavailable"], /telemetry is unavailable/i);
  assert.match(zh["coach.unavailable"], /暂无已验证/);
  assert.equal(en["coach.title"], "Scripted coach");
  assert.match(en["coach.description"], /Offline/);
  assert.match(en["coach.description"], /never moves/);
  assert.match(en["coach.grip3"], /no active wrist/);
  assert.match(zh["coach.grip3"], /没有主动腕关节/);
  assert.match(en["learn.reflectionNote"], /not been automatically graded/);
});

test("learning validation and evidence-cap warnings are complete and preserve prior evidence honestly", () => {
  const codes = [
    "TEXT_REQUIRED",
    "EVIDENCE_LIMIT",
    "INVALID_ANSWERS",
    "DESIGN_FIELDS_REQUIRED",
    "INVALID_EVIDENCE",
    "INVALID_LESSON",
    "INVALID_TRANSFER",
  ];
  for (const language of supportedLanguages)
    for (const code of codes) {
      assert.ok(Object.hasOwn(dictionaries[language], `learning.${code}`));
    }
  assert.match(en["learning.TEXT_REQUIRED"], /1–1,200 characters/);
  assert.match(zh["learning.TEXT_REQUIRED"], /1 至 1,200 个字符/);
  assert.match(en["learning.EVIDENCE_LIMIT"], /earlier evidence has been kept/);
  assert.match(zh["learning.EVIDENCE_LIMIT"], /先前的证据已保留/);
});

test("Chinese uses the specification’s exact technical glossary", () => {
  const expected = {
    threeAxisArm: "三轴关节式机械臂",
    base: "底座",
    shoulderJoint: "肩关节",
    elbowJoint: "肘关节",
    joint: "关节",
    link: "连杆",
    actuator: "执行器",
    endEffector: "末端执行器",
    gripper: "夹爪",
    controller: "控制器",
    sensor: "传感器",
    tcp: "工具中心点",
    current: "当前",
    target: "目标",
    millimetres: "毫米",
    recordProgram: "录制程序",
    resetScene: "重置场景",
    clearProgram: "清空程序",
    run: "运行",
    pause: "暂停",
    resume: "继续",
    stop: "停止",
    bodyPlan: "机器人构型",
    morphology: "形态",
  };
  for (const [key, value] of Object.entries(expected))
    assert.equal(zh[`glossary.${key}`], value);
  for (const key of controls)
    assert.match(zh[`control.${key}`], /[\u3400-\u9fff]/, key);
});

test("interpolation placeholders have parity and preserve zero, negatives, and Chinese text", () => {
  for (const key of Object.keys(en))
    assert.deepEqual(placeholders(en[key]), placeholders(zh[key]), key);
  assert.equal(
    t("en", "control.increase", { axis: "Z", increment: 10 }),
    "Increase target Z by 10 millimetres",
  );
  assert.equal(
    t("zh", "control.increase", { axis: "Z", increment: 10 }),
    "将目标 Z 增加 10 毫米",
  );
  assert.equal(
    t("en", "program.move", { x: 0, y: -5, z: 130 }),
    "Move to (0, -5, 130) mm",
  );
  assert.equal(
    t("zh", "program.move", { x: 0, y: -5, z: 130 }),
    "移动至（0，-5，130）毫米",
  );
  assert.equal(t("zh", "program.count", { count: 0 }), "0 个步骤");
  assert.equal(t("en", "program.count", {}), "{count} steps");
  assert.equal(t("en", "program.count", null), "{count} steps");
  assert.equal(
    t("en", "program.count", Object.create({ count: 5 })),
    "{count} steps",
  );
});

test("missing keys stay visible without cross-language fallback or prototype leakage", () => {
  assert.equal(t("zh", "missing.translation"), "[missing.translation]");
  assert.equal(t("en", "missing.translation"), "[missing.translation]");
  assert.equal(t("zh", "toString"), "[toString]");
  assert.equal(t("zh", "__proto__"), "[__proto__]");
  assert.equal(t("unsupported", "control.move"), "Move");
  assert.equal(t("__proto__", "control.move"), "Move");
});

test("translation is immutable, state-independent plain text and never executes learner input", () => {
  assert.ok(Object.isFrozen(en));
  assert.ok(Object.isFrozen(zh));
  assert.ok(Object.isFrozen(dictionaries));
  assert.ok(Object.isFrozen(supportedLanguages));
  const params = { axis: "<img src=x onerror=alert(1)>", increment: 10 };
  const before = structuredClone(params);
  assert.equal(
    t("zh", "control.increase", params),
    "将目标 <img src=x onerror=alert(1)> 增加 10 毫米",
  );
  assert.deepEqual(params, before);
  assert.throws(() => {
    en["control.move"] = "Changed";
  }, TypeError);
  const physicalState = {
    actualJoints: [0, 1, -1],
    gripperState: "open",
    steps: [{ type: "move", targetMm: { x: 160, y: 0, z: 130 } }],
  };
  const original = structuredClone(physicalState);
  for (const language of ["en", "zh", "en"])
    for (const key of controls) t(language, `control.${key}`, physicalState);
  assert.deepEqual(physicalState, original);
});
