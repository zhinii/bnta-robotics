import test from "node:test";
import assert from "node:assert/strict";
import { assessmentSnapshot, requestAssessment } from "../assessment-tutor.mjs";
import { LESSON_UNITS } from "../lesson-units.mjs";
import { LessonDemo } from "../curriculum.mjs";
import { Controller } from "../controller.mjs";
import {
  createLearningState,
  beginLessonAttempt,
  submitAnswers,
  currentAttempt,
  BODY_PLAN_ANSWERS,
} from "../lessons.mjs";
import { answerFeedback } from "../answer-feedback.mjs";
import { exportPortfolio, parseProgressFile } from "../storage.mjs";

test("Offline feedback retains duplicate and blank scenario choices and supports older projects", () => {
  let learning = beginLessonAttempt(createLearningState(), "types");
  const choices = {
    assembly: "articulated",
    gantry: "articulated",
    pickPlace: "scara",
    sorting: "",
    delivery: "mobile",
  };
  const answers = Object.fromEntries(
    Object.entries(choices).map(([job, robot]) => [robot, job]),
  );
  learning = submitAnswers(learning, answers, "types", choices);
  const a = currentAttempt(learning),
    result = answerFeedback("types", a);
  assert.equal(result.correct, 3);
  assert.equal(result.total, 5);
  assert.equal(a.scenarioAnswers.gantry, "articulated");
  const c = new Controller();
  const exported = exportPortfolio({
    program: c.state.program,
    scene: c.state.scene,
    learning,
    language: "en",
  });
  assert.ok(exported.ok);
  const restored = parseProgressFile(exported.value.json);
  assert.ok(restored.ok);
  assert.deepEqual(
    currentAttempt(restored.value.learning).scenarioAnswers,
    a.scenarioAnswers,
  );
  c.dispose();
  assert.equal(result.rows.find((r) => r.key === "sorting").selected, "");
  assert.ok(
    result.rows.filter((r) => !r.correct).every((r) => r.hint.length > 20),
  );
  assert.equal(
    answerFeedback("types", { answers: BODY_PLAN_ANSWERS }).correct,
    5,
  );
  assert.match(answerFeedback("types", a, "zh").rows[0].hint, /底座/);
});
test("Every short concept has a bilingual, executable, isolated demo", () => {
  for (const [id, units] of Object.entries(LESSON_UNITS))
    for (const unit of units) {
      for (const field of ["title", "concept", "demo"])
        for (const lang of ["en", "zh"]) assert.ok(unit[field][lang]);
      const demo = new LessonDemo(id, unit.kind);
      let ticks = 0;
      while (!demo.done && ticks++ < 2000) demo.tick(100);
      assert.ok(demo.done, id + unit.kind);
      assert.ok(
        !demo.error ||
          (unit.kind === "blocked" && demo.error.code === "PATH_BLOCKED"),
      );
      assert.equal(
        demo.controller.state.program.steps.length,
        id === "program" ? 9 : 0,
      );
      demo.dispose();
    }
});
test("Tutor uses lesson and current evidence but does not include learner identity", () => {
  const c = new Controller();
  const learning = beginLessonAttempt(createLearningState(), "coordinates");
  const snapshot = assessmentSnapshot(
    { c, learning, language: "zh" },
    "reflection",
    "角度用毫米？",
  );
  assert.equal(snapshot.language, "zh");
  assert.equal(snapshot.lessonId, "coordinates");
  assert.equal(snapshot.recentActions.length, 0);
  assert.equal(snapshot.learnerName, undefined);
  assert.ok(snapshot.actual.tcp);
  c.dispose();
});
test("Adapter accepts only labelled Qwen feedback and keeps request history", async () => {
  let sent;
  const r = await requestAssessment(
    { question: "why", history: [{ role: "user", content: "My idea" }] },
    {
      fetcher: async (url, options) => {
        assert.equal(url, "/api/assessment");
        sent = JSON.parse(options.body);
        return {
          ok: true,
          json: async () => ({
            source: "qwen",
            feedback: "Angles use degrees.",
            question: "Which number locates the tool?",
          }),
        };
      },
    },
  );
  assert.equal(r.source, "qwen");
  assert.equal(sent.history[0].content, "My idea");
  await assert.rejects(
    requestAssessment(
      {},
      {
        fetcher: async () => ({
          ok: true,
          json: async () => ({ message: "pretend" }),
        }),
      },
    ),
    /invalid_response/,
  );
  await assert.rejects(
    requestAssessment(
      {},
      {
        fetcher: async () => ({
          ok: false,
          json: async () => ({ error: "provider_quota" }),
        }),
      },
    ),
    /provider_quota/,
  );
});
