import { Controller } from "./controller.mjs";
import {
  CONFIG,
  fk,
  solveIk,
  radiansToDegrees,
  degreesToRadians,
  distance,
} from "./model.mjs";
import { initialScene, teachingRoute, planMove, clone } from "./planner.mjs";
import { revalidateProgram } from "./program.mjs";
import { createScene } from "./scene.mjs";
import {
  LESSONS,
  BODY_PLAN_ANSWERS,
  ANATOMY_ANSWERS,
  INTERESTS,
  createLearningState,
  beginLessonAttempt,
  currentAttempt,
  recordLearningEvent,
  submitPrediction,
  submitReflection,
  submitAnswers,
  submitDesign,
  noteHint,
  evaluateLesson,
} from "./lessons.mjs";
import { coachHint } from "./coach.mjs";
import {
  loadProgress,
  saveProgress,
  createProgressPayload,
  exportPortfolio,
  portfolioBlobs,
} from "./storage.mjs";
import { t } from "./i18n.mjs";
import { createLearningFlow, word } from "./learning-flow.mjs";
import { parseProgressFile } from "./storage.mjs";
const $ = (id) => document.getElementById(id),
  el = (tag, text, cls) => {
    const e = document.createElement(tag);
    if (text !== undefined) e.textContent = text;
    if (cls) e.className = cls;
    return e;
  };
let learning = createLearningState(),
  language = "en",
  mode = "learn",
  demo = false,
  view = {
    grid: true,
    axes: true,
    labels: false,
    proxies: false,
    ghost: true,
    trail: true,
    path: true,
  },
  renderer,
  journey,
  uiReady = false,
  lastRevision = -1,
  lastProgramLanguage = "",
  selectedProgram = -1,
  lastFrame = null,
  frame,
  storageWarning = null,
  feedbackKey = "status.ready",
  feedbackParams = {},
  coachKey = "coach.preview.question";
const c = new Controller({
  onEvent: (event) => {
    if (["SCENE_RESET", "SCENE_CHANGED"].includes(event.type))
      renderer?.clearTrail();
    if (mode === "learn") learning = recordLearningEvent(learning, event);
    const map = {
      MOVE_COMPLETED: "status.moveComplete",
      OBJECT_ATTACHED: "status.attached",
      OBJECT_RELEASED: "status.released",
      SCENE_RESET: "status.reset",
      RUN_COMPLETED: "status.replayComplete",
      PROGRAM_CLEARED: "status.clear",
      STOPPED: "status.stopped",
    };
    if (map[event.type]) feedbackKey = map[event.type];
    if (uiReady && event.type !== "TARGET_EDITED") persist();
  },
  onChange: () => {
    if (uiReady) render();
  },
});
const tr = (key, params) => t(language, key, params);
function report(result) {
  if (!result?.ok) {
    feedbackKey =
      result?.error?.messageKey ||
      `error.${result?.error?.code || "INVALID_INPUT"}`;
    feedbackParams = result?.error?.details || {};
    // Honest state-triggered guidance, never a fabricated account of a move.
    if (uiReady && mode === "learn" && !currentAttempt(learning)?.transfer) {
      const hint = coachHint({
        telemetry: {
          verified: true,
          current: fk(c.state.scene.actualJoints).C,
          target: c.state.target.parsed,
          objectHeld: c.state.scene.objects.some((o) => o.heldByGripper),
          gripperState: c.state.scene.gripperState,
        },
        errorCode: result?.error?.code,
        priorHintLevel: 0,
        evidence: {
          eventIds: currentAttempt(learning)?.evidenceEventIds || [],
        },
      });
      $("coach-text").textContent = tr(hint.textKey);
      document.querySelector(".coach-card").open = true;
      learning = noteHint(learning, {
        textKey: hint.textKey,
        hintLevel: hint.hintLevel,
      });
    }
  } else if (result.value?.noop) feedbackKey = "status.noop";
  render();
  if (uiReady && result?.ok && !c.busy) persist();
  return result;
}
function persist() {
  if (c.busy) return;
  const r = saveProgress(
    createProgressPayload({
      program: c.state.program,
      scene: c.state.scene,
      learning,
      language,
      learnerName: $("learner-name")?.value || "",
    }),
  );
  storageWarning = r.ok ? null : r.error;
  if (uiReady)
    $("storage-status").textContent = tr(
      r.ok ? "status.saved" : "status.storageWarning",
    );
}
const saved = loadProgress();
if (saved.ok && saved.value) {
  const s = saved.value;
  language = s.language;
  learning = s.learning;
  if (s.scene) {
    c.state.scene = clone(s.scene);
    c.initialScene = initialScene({
      obstacle: s.scene.obstacles.some((o) => o.id === "lesson-obstacle"),
      destination: s.scene.destination || "destinationA",
    });
  }
  if (s.program) c.state.program = revalidateProgram(s.program);
  c.state.recording.enabled = false;
  c.syncTarget();
  $("learner-name").value = s.learnerName || "";
  c.sequence = Math.max(
    0,
    ...learning.evidenceEvents.map(
      (e) => Number(String(e.id).replace("event-", "")) || 0,
    ),
    ...c.state.program.steps.map(
      (s) => Number(String(s.completionEvidenceId).replace("event-", "")) || 0,
    ),
  );
} else if (!saved.ok) storageWarning = saved.error;
for (const axis of ["x", "y", "z"]) {
  const row = el("div", undefined, "coordinate-row"),
    label = el("label", axis.toUpperCase(), `axis-${axis}`);
  label.htmlFor = `target-${axis}`;
  const minus = el("button", "−"),
    input = el("input"),
    plus = el("button", "+");
  input.id = `target-${axis}`;
  input.type = "number";
  input.step = "any";
  input.inputMode = "decimal";
  minus.id = `minus-${axis}`;
  plus.id = `plus-${axis}`;
  minus.addEventListener("click", () => nudge(axis, -1));
  plus.addEventListener("click", () => nudge(axis, 1));
  input.addEventListener("input", () => {
    report(c.editTarget(axis, input.value));
    preview();
  });
  row.append(label, minus, input, plus);
  $("coordinates").append(row);
}
function nudge(axis, sign) {
  const value = c.state.target.parsed?.[axis];
  if (!Number.isFinite(value))
    return report({ ok: false, error: { code: "INVALID_INPUT" } });
  report(c.editTarget(axis, value + sign * Number($("step").value)));
  preview();
}
function preview() {
  const target = c.state.target.parsed;
  if (!target) {
    c.state.target.error = {
      code: "INVALID_INPUT",
      messageKey: "error.INVALID_INPUT",
    };
    render();
    return;
  }
  const r = planMove(c.state.scene, target);
  c.state.target.error = r.ok ? null : r.error;
  render();
}
function translate() {
  document.documentElement.lang = language === "zh" ? "zh-Hans" : "en";
  document
    .querySelectorAll("[data-i18n]")
    .forEach((e) => (e.textContent = tr(e.dataset.i18n)));
  $("language").value = language;
  $("lesson-select").replaceChildren(
    ...LESSONS.map((l) => {
      const o = el("option", tr(l.titleKey));
      o.value = l.id;
      return o;
    }),
  );
  $("lesson-select").value = learning.currentLessonId;
  renderAnswers();
  renderWaypoints();
  lastRevision = -1;
  render();
}
function formatPosition(p) {
  return ["x", "y", "z"]
    .map((k) => `${k.toUpperCase()} ${p[k].toFixed(1)}`)
    .join("   ");
}
function render() {
  if (!uiReady) return;
  const s = c.state,
    current = fk(s.scene.actualJoints).C,
    busy = c.busy;
  $("current").textContent = formatPosition(current);
  $("joint-readout").textContent = s.scene.actualJoints
    .map((q, i) => `J${i + 1} ${radiansToDegrees(q).toFixed(1)}°`)
    .join(" · ");
  const lastMove = [...learning.evidenceEvents, ...s.events]
    .filter(
      (e) =>
        e.type === "MOVE_COMPLETED" &&
        e.verified &&
        e.before?.actualJoints &&
        e.after?.actualJoints,
    )
    .at(-1);
  $("joint-deltas").hidden =
    mode !== "learn" || learning.currentLessonId !== "coordinates" || !lastMove;
  if (lastMove)
    $("joint-deltas").textContent = lastMove.after.actualJoints
      .map(
        (q, i) =>
          `J${i + 1}: ${radiansToDegrees(lastMove.before.actualJoints[i]).toFixed(2)}° → ${radiansToDegrees(q).toFixed(2)}°`,
      )
      .join(" · ");
  const displayedScene = journey?.demo?.controller.state.scene || s.scene;
  $("fixture-reference").textContent = displayedScene.fixtures
    .filter((f) => f.id === "source" || f.id === displayedScene.destination)
    .map(
      (f) => `${tr(`scene.${f.id}`)}: ${formatPosition(f.targetPosition)} mm`,
    )
    .join(" · ");
  for (const axis of ["x", "y", "z"]) {
    if (document.activeElement !== $(`target-${axis}`))
      $(`target-${axis}`).value =
        Number.isFinite(Number(s.target.draft[axis])) &&
        String(s.target.draft[axis]).trim() !== ""
          ? String(Math.round(Number(s.target.draft[axis]) * 10) / 10)
          : s.target.draft[axis];
    for (const sign of ["minus", "plus"]) {
      $(`${sign}-${axis}`).disabled = busy || demo;
      $(`${sign}-${axis}`).setAttribute(
        "aria-label",
        tr(sign === "plus" ? "control.increase" : "control.decrease", {
          axis: axis.toUpperCase(),
          increment: $("step").value,
        }),
      );
    }
    $(`target-${axis}`).disabled = busy || demo;
    $(`target-${axis}`).setAttribute(
      "aria-invalid",
      String(Boolean(s.target.error)),
    );
  }
  for (const id of ["move", "open", "close"]) $(id).disabled = busy || demo;
  $("move").disabled = busy || demo || !s.target.parsed;
  $("record").disabled = busy || demo;
  $("record").checked = s.recording.enabled;
  $("record-state").textContent = tr(
    s.recording.enabled ? "status.on" : "status.off",
  );
  $("record-note").hidden = !s.recording.blockedReason;
  $("record-note").textContent = s.recording.blockedReason
    ? tr("error.START_STATE_MISMATCH")
    : tr("status.pathChecked");
  $("steps").textContent = `${tr("control.steps")} ${s.program.steps.length}`;
  $("held").textContent =
    `${tr("status.gripper")}: ${tr(`status.${s.scene.gripperState}`)} · ${tr("status.objectHeld")}: ${tr(s.scene.objects.some((o) => o.heldByGripper) ? "status.yes" : "status.no")}`;
  $("run").textContent = tr(
    s.execution.status === "paused" ? "control.resume" : "control.run",
  );
  $("run").disabled =
    s.execution.status === "movingManual" ||
    s.execution.status === "running" ||
    demo ||
    !s.program.steps.length;
  $("pause").disabled = s.execution.status !== "running";
  $("drawer-run").textContent = $("run").textContent;
  $("drawer-run").disabled = $("run").disabled;
  $("drawer-pause").disabled = $("pause").disabled;
  $("drawer-stop").disabled = !busy;
  $("stop").disabled = !busy;
  $("reset").disabled = false;
  $("clear").disabled = busy || !s.program.steps.length;
  $("demo-toggle").disabled = busy;
  const target = s.target.parsed;
  $("next-action").textContent = s.target.error
    ? tr(s.target.error.messageKey || `error.${s.target.error.code}`)
    : target
      ? `${tr("control.target")}: ${["x", "y", "z"].map((k) => `${k.toUpperCase()} ${target[k] - current[k] >= 0 ? "+" : ""}${(target[k] - current[k]).toFixed(1)}`).join(" · ")} mm`
      : tr("error.INVALID_INPUT");
  $("feedback").textContent = busy
    ? `${tr(`status.${s.execution.status === "movingManual" ? "moving" : s.execution.status}`)} · ${tr("status.step", { current: s.execution.stepIndex + 1, total: s.execution.status === "movingManual" ? 1 : s.program.steps.length })}`
    : tr(feedbackKey, feedbackParams);
  if (journey?.demo) $("feedback").textContent = word("demoOnly", language);
  $("six-axis").hidden = ![...learning.evidenceEvents, ...s.events].some(
    (e) => e.type === "RUN_COMPLETED" && e.verified,
  );
  $("learning").hidden = mode !== "learn";
  $("learn").setAttribute("aria-pressed", String(mode === "learn"));
  $("explore").setAttribute("aria-pressed", String(mode === "explore"));
  if (renderer)
    renderer.update(
      journey?.demo?.controller.state.scene || s.scene,
      journey?.demo
        ? {
            parsed: fk(journey.demo.controller.state.scene.actualJoints).C,
            valid: true,
          }
        : target
          ? { parsed: target, valid: !s.target.error, error: s.target.error }
          : null,
      {
        ...view,
        language,
        demonstration: !!journey?.demo,
        focusJoint:
          journey?.demo?.commands[journey.demo.index]?.jointIndex ??
          view.focusJoint,
        programPoints:
          $("steps-dialog").open && s.program.startScene
            ? [
                fk(s.program.startScene.actualJoints).C,
                ...s.program.steps
                  .filter((step) => step.type === "move")
                  .map((step) => step.targetMm),
              ]
            : [],
        programValid: s.program.validationStatus !== "invalid",
      },
    );
  if (s.program.revision !== lastRevision || lastProgramLanguage !== language) {
    renderProgram();
    lastRevision = s.program.revision;
    lastProgramLanguage = language;
  }
  document
    .querySelectorAll("#program-list .step-actions button,#program-list input")
    .forEach((e) => (e.disabled = busy));
  document
    .querySelectorAll("#program-list li")
    .forEach((li, i) =>
      li.classList.toggle("active", busy && s.execution.stepIndex === i),
    );
  $("program-validation").textContent =
    s.program.validationStatus === "invalid"
      ? tr("program.invalid", {
          step: (s.program.validationError?.details?.stepIndex ?? 0) + 1,
          code: s.program.validationError?.code,
        })
      : tr("program.count", { count: s.program.steps.length });
  if (mode === "learn") {
    const l = LESSONS.find((l) => l.id === learning.currentLessonId),
      attempt = currentAttempt(learning),
      score = evaluateLesson(learning);
    $("task-title").textContent = tr(l.titleKey);
    $("task-description").textContent = tr(l.taskKey);
    $("lesson-status").textContent = learning.warning
      ? tr(`learning.${learning.warning.code}`, learning.warning.details)
      : `${tr(`status.${score.status}`)} · ${Object.entries(score.checks)
          .map(([k, v]) => `${v ? "✓" : "○"} ${tr(`checks.${k}`)}`)
          .join(" · ")}`;
    $("inspect-joints").hidden = l.id !== "coordinates";
    $("changed-target").hidden = l.id !== "obstacle";
    $("hint").disabled = Boolean(attempt?.transfer);
    $("route-toggle").disabled = Boolean(attempt?.transfer);
    if (attempt?.transfer) $("waypoints").hidden = true;
  }
  $("storage-status").textContent = tr(
    storageWarning ? "status.storageWarning" : "status.saved",
  );
  journey?.render();
  for (const id of [
    "export-json",
    "export-text",
    "capture-scene",
    "import-project",
  ])
    if ($(id)) $(id).disabled = busy || !!journey?.demo;
  if (journey?.demo) {
    for (const id of [
      "move",
      "open",
      "close",
      "record",
      "run",
      "drawer-run",
      "demo-toggle",
      "new-attempt",
      "lesson-select",
      "steps",
    ])
      $(id).disabled = true;
    document
      .querySelectorAll("#coordinates input,#coordinates button")
      .forEach((e) => (e.disabled = true));
    $("current").textContent = formatPosition(
      fk(journey.demo.controller.state.scene.actualJoints).C,
    );
    $("joint-readout").textContent =
      journey.demo.controller.state.scene.actualJoints
        .map((q, i) => `J${i + 1} ${radiansToDegrees(q).toFixed(1)}°`)
        .join(" · ");
  } else {
    $("new-attempt").disabled = busy;
    $("lesson-select").disabled = busy;
    $("steps").disabled = false;
  }
}
function renderProgram() {
  $("program-list").replaceChildren();
  c.state.program.steps.forEach((step, i) => {
    const li = el("li"),
      input = el("input");
    const select = el(
      "button",
      step.type === "move"
        ? `${tr("program.position")} ${i + 1}`
        : `${i + 1}. ${tr(step.gripperState === "open" ? "control.open" : "control.close")}`,
      "step-select",
    );
    select.setAttribute("aria-expanded", String(selectedProgram === i));
    select.addEventListener("click", () => {
      selectedProgram = i;
      renderProgram();
      if (step.type === "move" && !c.busy) {
        for (const axis of ["x", "y", "z"])
          c.editTarget(axis, step.targetMm[axis]);
        preview();
      }
    });
    input.value = step.nameIsDefault
      ? `${tr(step.type === "move" ? "control.move" : step.gripperState === "open" ? "control.open" : "control.close")} ${i + 1}`
      : step.name;
    input.maxLength = 80;
    input.setAttribute("aria-label", `${tr("control.rename")} ${i + 1}`);
    input.addEventListener("change", () =>
      report(c.editProgram(i, "rename", input.value)),
    );
    const detail = el(
        "p",
        step.type === "move"
          ? formatPosition(step.targetMm)
          : tr(step.gripperState === "open" ? "control.open" : "control.close"),
        "step-detail",
      ),
      actions = el("div", undefined, "step-actions");
    for (const operation of ["up", "down", "delete"]) {
      const b = el("button", tr(`control.${operation}`));
      b.addEventListener("click", () => {
        report(c.editProgram(i, operation));
        persist();
      });
      actions.append(b);
    }
    const expanded = el("div", undefined, "step-expanded");
    expanded.hidden = selectedProgram !== i;
    expanded.append(input, detail, actions);
    li.append(select, expanded);
    $("program-list").append(li);
  });
}
function renderWaypoints() {
  $("waypoints").replaceChildren();
  teachingRoute(c.state.scene).forEach((step, i) => {
    if (step.type !== "move") return;
    const b = el(
      "button",
      `${i + 1}. ${tr(`route.${["sourceApproach", "pickup", "", "sourceClearance", "destinationClearance", "destinationApproach", "place", "", "retreat"][i]}`)} · ${formatPosition(step.targetMm)}`,
    );
    b.addEventListener("click", () => {
      if (c.busy || demo) return;
      for (const axis of ["x", "y", "z"])
        c.editTarget(axis, step.targetMm[axis]);
      preview();
    });
    $("waypoints").append(b);
  });
}
function renderTeaching(id) {
  const root = $("lesson-content");
  root.replaceChildren();
  if (id === "types") {
    root.append(el("p", tr("bodyPlans.morphology")));
    for (const type of Object.keys(BODY_PLAN_ANSWERS)) {
      const item = el("details"),
        heading = el("summary", tr(`bodyPlans.${type}.title`));
      item.append(
        heading,
        ...["description", "job", "tradeoff"].map((k) =>
          el("p", tr(`bodyPlans.${type}.${k}`)),
        ),
      );
      root.append(item);
    }
    root.append(el("p", tr("bodyPlans.cobot")));
  } else if (id === "anatomy") {
    for (const part of [
      "base",
      "link",
      "joint",
      "actuator",
      "endEffector",
      "controller",
      "sensor",
    ]) {
      const item = el("details");
      item.append(
        el("summary", tr(`anatomy.${part}.title`)),
        el("p", tr(`anatomy.${part}.description`)),
      );
      root.append(item);
    }
    root.append(el("p", tr("status.simulated")));
  } else if (id === "coordinates") {
    root.append(el("p", tr("demo.explanation")));
  }
}
function selection(name, choices, labelKey) {
  const label = el("label"),
    text = el("span", tr(labelKey)),
    select = el("select");
  select.name = name;
  select.append(el("option", "—"));
  for (const [value, key] of choices) {
    const o = el("option", tr(key));
    o.value = value;
    select.append(o);
  }
  label.append(text, select);
  return label;
}
function renderAnswers() {
  const root = $("answer-form");
  root.replaceChildren();
  const id = learning.currentLessonId;
  renderTeaching(id);
  if (["types", "anatomy"].includes(id)) {
    const answers = id === "types" ? BODY_PLAN_ANSWERS : ANATOMY_ANSWERS,
      choices = Object.values(answers).map((v) => [
        v,
        `${id === "types" ? "jobs" : "parts"}.${v}`,
      ]);
    for (const part of Object.keys(answers))
      root.append(
        selection(
          part,
          choices,
          `${id === "types" ? "bodyPlan" : "anatomy"}.${part}`,
        ),
      );
    const b = el("button", tr("control.submitAnswers"));
    b.addEventListener("click", () => {
      const answers = Object.fromEntries(
        [...root.querySelectorAll("select")].map((e) => [e.name, e.value]),
      );
      learning = submitAnswers(learning, answers);
      persist();
      render();
    });
    root.append(b);
  } else if (id === "design") {
    root.append(
      selection(
        "interest",
        INTERESTS.map((v) => [v, `interests.${v}`]),
        "control.interest",
      ),
      selection(
        "bodyPlan",
        Object.keys(BODY_PLAN_ANSWERS).map((v) => [v, `bodyPlan.${v}`]),
        "control.bodyPlan",
      ),
    );
    for (const name of ["job", "benefit", "limit"]) {
      const label = el("label"),
        text = el("span", tr(`control.${name}`)),
        input = el("input");
      input.name = name;
      input.maxLength = 1200;
      label.append(text, input);
      root.append(label);
    }
    const b = el("button", tr("control.saveDesign"));
    b.addEventListener("click", () => {
      learning = submitDesign(
        learning,
        Object.fromEntries(
          [...root.querySelectorAll("input,select")].map((e) => [
            e.name,
            e.value,
          ]),
        ),
      );
      persist();
      render();
    });
    root.append(b);
  }
  const savedAnswers =
    currentAttempt(learning)?.[id === "design" ? "design" : "answers"];
  if (savedAnswers)
    for (const field of root.querySelectorAll("input,select")) {
      if (typeof savedAnswers[field.name] === "string")
        field.value = savedAnswers[field.name];
    }
}
function setMode(value) {
  if ($("steps-dialog").open) $("steps-dialog").close();
  journey?.endDemo(false);
  if (c.busy) c.stop();
  c.setRecording(false);
  mode = value;
  c.state.mode = value;
  if (mode === "learn" && !currentAttempt(learning)) {
    learning = beginLessonAttempt(learning, learning.currentLessonId);
    currentAttempt(learning).curriculumVersion = 2;
  }
  render();
  document.querySelector("header").scrollIntoView?.({ block: "start" });
}
function startLesson(id, { transfer = false } = {}) {
  journey?.endDemo(false);
  const resetsScene = !["types", "design"].includes(id);
  if (
    resetsScene &&
    c.state.program.steps.length &&
    !window.confirm(
      tr("clear.question", { count: c.state.program.steps.length }),
    )
  ) {
    $("lesson-select").value = learning.currentLessonId;
    return;
  }
  c.stop();
  c.setRecording(false);
  if (resetsScene) {
    if (c.state.program.steps.length) c.clearProgram(true);
    c.changeScene(
      initialScene({
        obstacle: id === "obstacle",
        destination: transfer ? "destinationB" : "destinationA",
      }),
    );
    renderer?.clearTrail();
  }
  view.focusJoint = undefined;
  learning = beginLessonAttempt(learning, id, {
    transfer,
    programRevision: c.state.program.revision,
  });
  currentAttempt(learning).curriculumVersion = 2;
  learning.presentation = {
    phase: transfer ? "try" : "vocabulary",
    lessonId: id,
  };
  view.labels = id === "anatomy";
  $("labels").checked = view.labels;
  $("prediction").value = "";
  $("reflection").value = "";
  $("coach-text").textContent = transfer
    ? tr("status.ready")
    : tr(`lessons.${id}.hint`);
  $("waypoints").hidden = true;
  $("lesson-select").value = id;
  demo = false;
  $("joint-controls").hidden = true;
  renderAnswers();
  renderWaypoints();
  persist();
  render();
}
$("move").addEventListener("click", () => report(c.move()));
$("open").addEventListener("click", () => report(c.grip("open")));
$("close").addEventListener("click", () => report(c.grip("closed")));
$("record").addEventListener("change", () =>
  report(c.setRecording($("record").checked)),
);
$("run").addEventListener("click", () => report(c.run()));
$("pause").addEventListener("click", () => report(c.pause()));
$("drawer-run").addEventListener("click", () => report(c.run()));
$("drawer-pause").addEventListener("click", () => report(c.pause()));
$("drawer-stop").addEventListener("click", () => report(c.stop()));
$("stop").addEventListener("click", () => report(c.stop()));
$("reset").addEventListener("click", () => {
  report(c.reset());
  persist();
});
$("learn").addEventListener("click", () => setMode("learn"));
$("explore").addEventListener("click", () => setMode("explore"));
$("language").addEventListener("change", () => {
  language = $("language").value;
  c.state.language = language;
  translate();
  persist();
});
$("step").addEventListener("change", render);
$("lesson-select").addEventListener("change", () =>
  startLesson($("lesson-select").value),
);
$("new-attempt").addEventListener("click", () =>
  startLesson(learning.currentLessonId),
);
$("changed-target").addEventListener("click", () =>
  startLesson("obstacle", { transfer: true }),
);
$("save-prediction").addEventListener("click", () => {
  learning = submitPrediction(learning, $("prediction").value);
  persist();
  render();
});
$("save-reflection").addEventListener("click", () => {
  learning = submitReflection(learning, $("reflection").value);
  persist();
  render();
});
$("inspect-joints").addEventListener("click", () => {
  learning = recordLearningEvent(learning, {
    type: "JOINTS_INSPECTED",
    joints: c.state.scene.actualJoints,
  });
  persist();
  render();
});
$("route-toggle").addEventListener("click", () => {
  if (mode === "learn") learning = noteHint(learning, { workedExample: true });
  $("waypoints").hidden = !$("waypoints").hidden;
  const l = LESSONS.find((l) => l.id === learning.currentLessonId);
  $("coach-text").textContent = tr(l.exampleKey);
  persist();
  render();
});
$("hint").addEventListener("click", () => {
  const hint = coachHint({
    telemetry: {
      verified: true,
      current: fk(c.state.scene.actualJoints).C,
      target: c.state.target.parsed,
      objectHeld: c.state.scene.objects.some((o) => o.heldByGripper),
      gripperState: c.state.scene.gripperState,
      previewEdited:
        distance(
          fk(c.state.scene.actualJoints).C,
          c.state.target.parsed || fk(c.state.scene.actualJoints).C,
        ) > 0.1,
    },
    lessonId: learning.currentLessonId,
    stageId: "practice",
    errorCode: c.state.target.error?.code,
    priorHintLevel: currentAttempt(learning)?.hintCount || 0,
    evidence: { eventIds: currentAttempt(learning)?.evidenceEventIds || [] },
  });
  coachKey = hint.textKey;
  $("coach-text").textContent = tr(coachKey);
  if (mode === "learn")
    learning = noteHint(learning, {
      hintLevel: hint.hintLevel,
      textKey: hint.textKey,
    });
  persist();
  render();
});
for (const key of ["grid", "axes", "ghost", "trail", "path"])
  $(key).addEventListener("click", () => {
    view[key] = !view[key];
    $(key).setAttribute("aria-pressed", String(view[key]));
    render();
  });
for (const key of ["labels", "proxies"])
  $(key).addEventListener("change", () => {
    view[key] = $(key).checked;
    render();
  });
$("home").addEventListener("click", () => renderer?.home());
$("clear-trail").addEventListener("click", () => renderer?.clearTrail());
$("steps").addEventListener("click", () => {
  $("steps-dialog").setAttribute("open", "");
  document.body.dataset.panel = "program";
  render();
  $("close-steps").focus();
});
$("close-steps").addEventListener("click", () => $("steps-dialog").close());
$("steps-dialog").addEventListener("close", () => {
  document.body.dataset.panel = "";
  render();
  $("steps").focus();
});
$("clear").addEventListener("click", () => {
  $("confirm-text").textContent = tr("clear.question", {
    count: c.state.program.steps.length,
  });
  $("confirm-dialog").showModal();
  $("cancel-clear").focus();
});
$("cancel-clear").addEventListener("click", () => $("confirm-dialog").close());
$("confirm-clear").addEventListener("click", () => {
  report(c.clearProgram(true));
  $("confirm-dialog").close();
  persist();
});
$("confirm-dialog").addEventListener("close", () =>
  ($("clear").disabled ? $("close-steps") : $("clear")).focus(),
);
$("demo-toggle").addEventListener("click", () => {
  if (c.busy) return;
  if (!demo && c.state.program.steps.length) {
    report({ ok: false, error: { code: "START_STATE_MISMATCH" } });
    return;
  }
  demo = !demo;
  c.setRecording(false);
  $("joint-controls").hidden = !demo;
  $("demo-toggle").textContent = tr(
    demo ? "control.exitDemo" : "control.jointDemo",
  );
  if (demo) renderJointControls();
  else {
    c.syncTarget();
    preview();
  }
  render();
});
function renderJointControls() {
  $("joint-controls").replaceChildren();
  c.state.scene.actualJoints.forEach((q, i) => {
    const row = el("div", undefined, "joint-row"),
      label = el("label", `J${i + 1}`),
      range = el("input"),
      number = el("input"),
      button = el("button", tr("control.moveJoint"));
    range.type = "range";
    number.type = "number";
    for (const e of [range, number]) {
      e.min = radiansToDegrees(CONFIG.limits[i][0]);
      e.max = radiansToDegrees(CONFIG.limits[i][1]);
      e.step = ".1";
      e.value = radiansToDegrees(q).toFixed(1);
      e.setAttribute("aria-label", `J${i + 1} ${tr("unit.degrees")}`);
    }
    range.addEventListener("input", () => (number.value = range.value));
    number.addEventListener("input", () => (range.value = number.value));
    button.addEventListener("click", () => {
      view.focusJoint = i;
      if (number.value.trim() === "")
        return report({ ok: false, error: { code: "INVALID_INPUT" } });
      report(
        c.startAction({
          type: "jointDemo",
          jointIndex: i,
          angleRad: degreesToRadians(Number(number.value)),
        }),
      );
    });
    row.append(label, range, number, button);
    $("joint-controls").append(row);
  });
}
function download(kind) {
  const r = portfolioBlobs(
    exportPortfolio({
      program: c.state.program,
      learning,
      language,
      learnerName: $("learner-name").value,
      scene: c.state.scene,
    }),
  );
  if (!r.ok) return report(r);
  const url = URL.createObjectURL(r.value[kind]),
    a = el("a");
  a.href = url;
  a.download = r.value.files[kind];
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$("export-json").addEventListener("click", () => download("json"));
$("export-text").addEventListener("click", () => download("text"));
$("learner-name").addEventListener("change", persist);
renderer = createScene($("scene"));
if (!currentAttempt(learning)) {
  learning = beginLessonAttempt(learning, learning.currentLessonId);
  currentAttempt(learning).curriculumVersion = 2;
}
journey = createLearningFlow({
  get: () => ({ c, learning, language, mode, tr }),
  setLearning: (value) => (learning = value),
  startLesson,
  report,
  persist,
  render,
  preview,
});
document.querySelector(".attribution").before($("steps-dialog"));
$("program-validation").before(
  $("steps-dialog").querySelector(".dialog-footer"),
);
const viewMore = el("details", undefined, "view-more"),
  viewSummary = el("summary", "⋯");
viewSummary.setAttribute("aria-label", "View options / 视图选项");
viewMore.append(viewSummary, $("grid"), $("axes"), $("clear-trail"));
document.querySelector(".view-tools").append(viewMore);
// File-based progress and image evidence; no service or student database.
const importButton = el("button"),
  fileInput = el("input"),
  imageButton = el("button"),
  fileNote = el("p", undefined, "subtle");
importButton.id = "import-project";
imageButton.id = "capture-scene";
fileInput.id = "project-file";
fileInput.type = "file";
fileInput.accept = ".json,application/json";
fileInput.hidden = true;
document
  .querySelector(".portfolio-content")
  .append(importButton, fileInput, imageButton, fileNote);
const translateFiles = () => {
  importButton.textContent = word("restore", language);
  imageButton.textContent = word("screenshot", language);
  fileNote.textContent = word("fileNote", language);
  $("export-json").textContent = word("save", language);
};
$("language").addEventListener("change", translateFiles);
importButton.onclick = () => {
  if (!c.busy) fileInput.click();
};
fileInput.onchange = async () => {
  const file = fileInput.files[0];
  if (!file) return;
  if (c.busy || file.size > 12000000) {
    $("storage-status").textContent = tr("error.INVALID_INPUT");
    return;
  }
  const result = parseProgressFile(await file.text());
  if (!result.ok) {
    $("storage-status").textContent =
      language === "zh"
        ? "文件无效或版本不受支持。当前工作未改变。"
        : "Invalid or unsupported project file. Your current work is unchanged.";
    fileInput.value = "";
    return;
  }
  if (
    (c.state.program.steps.length || learning.evidenceEvents.length) &&
    !window.confirm(
      language === "zh"
        ? "打开此文件将替换当前工作，请先导出需要保留的项目。继续？"
        : "Opening this file replaces current work. Export anything you want to keep first. Continue?",
    )
  )
    return;
  journey.endDemo(false);
  c.stop();
  if (c.state.program.steps.length) c.clearProgram(true);
  const data = result.value;
  renderer.clearTrail();
  c.changeScene(data.scene || initialScene());
  c.initialScene = initialScene({
    obstacle: !!data.scene?.obstacles.length,
    destination: data.scene?.destination || "destinationA",
  });
  if (data.program) c.state.program = revalidateProgram(data.program);
  learning = data.learning;
  language = data.language;
  $("learner-name").value = data.learnerName;
  c.sequence = Math.max(
    c.sequence,
    ...learning.evidenceEvents.map(
      (e) => Number(String(e.id).replace("event-", "")) || 0,
    ),
  );
  c.setRecording(false);
  c.syncTarget();
  lastRevision = -1;
  demo = false;
  $("joint-controls").hidden = true;
  $("prediction").value = currentAttempt(learning)?.prediction || "";
  $("reflection").value = currentAttempt(learning)?.reflection || "";
  translate();
  translateFiles();
  persist();
  fileInput.value = "";
};
imageButton.onclick = () => {
  const image = renderer.capture();
  if (!image) {
    $("storage-status").textContent = word("captureFailed", language);
    return;
  }
  const filename = `robot-lab-${learning.currentLessonId}-${Date.now()}.png`,
    a = el("a");
  const bytes = Uint8Array.from(atob(image.split(",")[1]), (character) =>
    character.charCodeAt(0),
  );
  const imageUrl = URL.createObjectURL(
    new Blob([bytes], { type: "image/png" }),
  );
  a.href = imageUrl;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
  if (mode === "learn" && !journey.demo)
    learning = recordLearningEvent(learning, {
      type: "IMAGE_CAPTURED",
      filename,
      actualScene: clone(c.state.scene),
      note: "Scene image download requested; keep the separate PNG file. Not an assessment of understanding.",
    });
  persist();
  render();
};
uiReady = true;
$("prediction").value = currentAttempt(learning)?.prediction || "";
$("reflection").value = currentAttempt(learning)?.reflection || "";
translate();
translateFiles();
$("coach-text").textContent = tr(`lessons.${learning.currentLessonId}.hint`);
render();
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
function animate(now) {
  const delta = lastFrame === null ? 0 : Math.min(now - lastFrame, 100);
  lastFrame = now;
  journey?.tick(delta);
  if (c.operation && c.state.execution.status !== "paused") {
    c.tick(reduced ? 1e9 : delta);
    if (!c.busy) persist();
  }
  frame = requestAnimationFrame(animate);
}
frame = requestAnimationFrame(animate);
window.addEventListener(
  "pagehide",
  () => {
    cancelAnimationFrame(frame);
    c.dispose();
    renderer?.dispose();
  },
  { once: true },
);
