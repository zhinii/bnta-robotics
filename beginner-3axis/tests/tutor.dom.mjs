import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createAssessmentTutor, tutorTurns } from "../assessment-tutor.mjs";
import { Controller } from "../controller.mjs";
import {
  createLearningState,
  beginLessonAttempt,
  currentAttempt,
  submitReflection,
  submitPrediction,
  submitAnswers,
  recordLearningEvent,
  BODY_PLAN_ANSWERS,
} from "../lessons.mjs";
import { exportPortfolio, parseProgressFile } from "../storage.mjs";
const flush = () => new Promise((resolve) => setImmediate(resolve));
async function setup(online, responder) {
  const dom = new JSDOM(
    '<textarea id="prediction"></textarea><button id="save-prediction"></button><section id="answer-form"></section><section id="reflect"><textarea id="reflection"></textarea><button id="save-reflection"></button></section>',
  );
  globalThis.document = dom.window.document;
  const c = new Controller();
  let learning = beginLessonAttempt(createLearningState(), "coordinates"),
    tutor;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    if (url.endsWith("/status"))
      return {
        ok: true,
        json: async () => ({ source: "qwen", configured: online }),
      };
    calls.push(JSON.parse(options.body));
    return responder(options, calls.length);
  };
  const api = {
    get: () => ({ c, learning, language: "en" }),
    setLearning: (l) => (learning = l),
    persist: () => {},
    render: () => tutor?.render(true),
  };
  document.getElementById("save-reflection").onclick = () =>
    (learning = submitReflection(
      learning,
      document.getElementById("reflection").value,
    ));
  document.getElementById("save-prediction").onclick = () =>
    (learning = submitPrediction(
      learning,
      document.getElementById("prediction").value,
    ));
  tutor = createAssessmentTutor(api, document.getElementById("reflect"));
  await flush();
  tutor.render(true);
  return { api, c, tutor, calls, dom };
}
const offline = await setup(false, () => {
  throw Error("offline must not send");
});
document.getElementById("reflection").value =
  "Z describes height in millimetres.";
document.getElementById("save-reflection").click();
await flush();
assert.equal(
  currentAttempt(offline.api.get().learning).reflection,
  "Z describes height in millimetres.",
);
assert.equal(offline.calls.length, 0);
assert.match(
  document.getElementById("assessment-ai-status").textContent,
  /not connected/,
);
const online = await setup(true, async (options, n) => ({
  ok: true,
  json: async () => ({
    source: "qwen",
    feedback:
      n === 1
        ? "Angles use degrees; XYZ uses mm."
        : "Your revised units are correct.",
    question:
      n === 1 ? "What does Z describe?" : "How could you move up 10 mm?",
  }),
}));
document.getElementById("reflection").value = "Joint angles are in mm.";
document.getElementById("save-reflection").click();
await flush();
await flush();
assert.equal(online.calls.length, 1);
assert.match(
  document.querySelector(".tutor-dialogue").textContent,
  /Angles use degrees/,
);
document.getElementById("assessment-reply").value =
  "Z is the tool height in mm.";
document.getElementById("assessment-send").click();
await flush();
await flush();
assert.equal(online.calls.length, 2);
assert.ok(
  online.calls[1].history.some((t) => t.content.includes("Angles use degrees")),
);
assert.equal(tutorTurns(online.api.get().learning).length, 4);
const portfolio = exportPortfolio({
  program: online.c.state.program,
  scene: online.c.state.scene,
  learning: online.api.get().learning,
  language: "en",
});
assert.ok(portfolio.ok);
const restored = parseProgressFile(portfolio.value.json);
assert.ok(restored.ok);
assert.equal(tutorTurns(restored.value.learning).length, 4);
assert.match(portfolio.value.text, /AI_TUTOR_MESSAGE/);
assert.equal(
  currentAttempt(online.api.get().learning).checks?.movedUp10 ?? false,
  false,
);
const failure = await setup(true, async () => ({
  ok: false,
  json: async () => ({ error: "provider_timeout" }),
}));
document.getElementById("reflection").value =
  "Keep my reflection despite timeout.";
document.getElementById("save-reflection").click();
await flush();
await flush();
assert.match(currentAttempt(failure.api.get().learning).reflection, /Keep my/);
assert.equal(document.getElementById("assessment-retry").hidden, false);
assert.equal(
  tutorTurns(failure.api.get().learning).filter((t) => t.role === "assistant")
    .length,
  0,
);
document.getElementById("assessment-retry").click();
await flush();
await flush();
assert.equal(failure.calls.length, 2);
assert.equal(tutorTurns(failure.api.get().learning).length, 1);
const independent = await setup(true, () => {
  throw Error("independent work must not request feedback before testing");
});
independent.api.setLearning(
  beginLessonAttempt(independent.api.get().learning, "obstacle", {
    transfer: true,
  }),
);
independent.tutor.render(true);
document.getElementById("reflection").value = "I will test my own route first.";
document.getElementById("save-reflection").click();
await flush();
assert.equal(independent.calls.length, 0);
assert.match(
  currentAttempt(independent.api.get().learning).reflection,
  /own route/,
);
assert.match(
  document.getElementById("assessment-ai-status").textContent,
  /Independent task/,
);
let release;
const stale = await setup(
  true,
  () => new Promise((resolve) => (release = resolve)),
);
document.getElementById("reflection").value = "A previous lesson answer.";
document.getElementById("save-reflection").click();
await flush();
stale.api.setLearning(beginLessonAttempt(stale.api.get().learning, "grip"));
stale.tutor.render(true);
release({
  ok: true,
  json: async () => ({
    source: "qwen",
    feedback: "old response",
    question: "old question",
  }),
});
await flush();
await flush();
assert.equal(tutorTurns(stale.api.get().learning).length, 0);
const matching = await setup(true, async () => ({
  ok: true,
  json: async () => ({
    source: "qwen",
    feedback: "Compare the straight rails with rotating links.",
    question: "Which motion made the rectangle?",
  }),
}));
matching.api.setLearning(
  submitAnswers(
    beginLessonAttempt(matching.api.get().learning, "types"),
    BODY_PLAN_ANSWERS,
  ),
);
matching.tutor.render(true);
// Only a saved assessment submission requests feedback, not unrelated glossary clicks.
const unrelated = document.createElement("button");
document.getElementById("answer-form").append(unrelated);
unrelated.click();
await flush();
assert.equal(matching.calls.length, 0);
document
  .getElementById("answer-form")
  .dispatchEvent(new matching.dom.window.CustomEvent("assessment-submitted"));
await flush();
await flush();
assert.equal(matching.calls.length, 1);
assert.equal(matching.calls[0].context.answerCheck.correct, 5);
assert.match(
  document.querySelector(".tutor-dialogue").textContent,
  /straight rails/,
);
document.getElementById("assessment-reply").value =
  "The tool followed the rails.";
document.getElementById("assessment-send").click();
await flush();
await flush();
assert.equal(matching.calls.length, 2);
assert.equal(matching.calls[1].history.length, 2);
const calculations = await setup(true, async () => ({ok:true,json:async()=>({source:"qwen",feedback:"Use distance divided by time.",question:"What units does your answer have?"})}));
calculations.api.setLearning(recordLearningEvent(calculations.api.get().learning,{type:"CALCULATION_SUBMITTED",answers:{displacement:"10",distance:"10",speed:"30"},moveEventId:null,correct:false}));
document.getElementById("answer-form").dispatchEvent(new calculations.dom.window.CustomEvent("assessment-submitted"));
await flush(); await flush();
assert.equal(calculations.calls.length,1);
assert.deepEqual(calculations.calls[0].context.calculation,{displacement:"10",distance:"10",speed:"30"});
assert.equal(Boolean(calculations.calls[0].context.checks.calculationVerified),false,"AI feedback must not fabricate completed movement");
for (const item of [offline, online, failure, independent, stale, matching, calculations]) {
  item.c.dispose();
  item.dom.window.close();
}
console.log(
  "PASS: offline reflection; online automatic feedback and two-turn dialogue; JSON/text roundtrip; failure retains work; stale replies cannot enter another lesson. Controlled responses only, not live Qwen.",
);
