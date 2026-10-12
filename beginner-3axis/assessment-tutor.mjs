import {
  currentAttempt,
  evaluateLesson,
  recordLearningEvent,
} from "./lessons.mjs";
import { copy, moveMeasurement } from "./curriculum.mjs";
import { fk } from "./model.mjs";
import { answerFeedback } from "./answer-feedback.mjs";

export function assessmentSnapshot({ learning, c, language }, field, response) {
  const attempt = currentAttempt(learning);
  const events = learning.evidenceEvents.filter(
    (e) => e.attemptId === attempt?.id,
  );
  return {
    lessonId: learning.currentLessonId,
    language,
    field,
    response: response.slice(0, 4000),
    prompt: copy(
      learning.currentLessonId,
      field === "prediction" ? "prediction" : "reflect",
      language,
    ),
    goal: copy(learning.currentLessonId, "goal", language),
    submittedAnswers: attempt?.answers ?? null,
    scenarioAnswers: attempt?.scenarioAnswers ?? null,
    answerCheck: answerFeedback(learning.currentLessonId, attempt, language),
    calculation:
      events.filter((e) => e.type === "CALCULATION_SUBMITTED").at(-1)
        ?.answers ?? null,
    design: attempt?.design ?? null,
    checks: evaluateLesson(learning).checks,
    actual: {
      tcp: fk(c.state.scene.actualJoints).C,
      gripperState: c.state.scene.gripperState,
      objectHeld: c.state.scene.objects.some((o) => o.heldByGripper),
    },
    program: c.state.program.steps.slice(0, 30).map((s) => ({
      type: s.type,
      targetMm: s.targetMm,
      gripperState: s.gripperState,
    })),
    recentActions: events
      .filter((e) => e.verified || e.type === "MOVE_REJECTED")
      .slice(-8)
      .map((e) => ({
        id: e.id,
        type: e.type,
        verified: e.verified === true,
        errorCode: e.error?.code,
        measurement: moveMeasurement(e),
      })),
    limits:
      "Geometry, joint limits, path clearance and grasp alignment only; no gravity/friction/force/impact. Client evidence is not independently verified by AI.",
  };
}
export function tutorTurns(learning) {
  const attempt = currentAttempt(learning);
  return learning.evidenceEvents
    .filter(
      (e) =>
        e.attemptId === attempt?.id &&
        e.type === "AI_TUTOR_MESSAGE" &&
        ["user", "assistant"].includes(e.role) &&
        typeof e.text === "string",
    )
    .slice(-24);
}
export async function requestAssessment(
  payload,
  { fetcher = globalThis.fetch, signal } = {},
) {
  const response = await fetcher("/api/assessment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("unavailable");
  }
  if (!response.ok) throw new Error(data.error || "unavailable");
  if (
    data.source !== "qwen" ||
    typeof data.feedback !== "string" ||
    typeof data.question !== "string" ||
    !data.feedback.trim() ||
    !data.question.trim()
  )
    throw new Error("invalid_response");
  return {
    source: "qwen",
    feedback: data.feedback.slice(0, 2600),
    question: data.question.slice(0, 600),
  };
}
export function createAssessmentTutor(api, parent) {
  const el = (tag, cls) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  };
  const root = el("section", "assessment-tutor");
  root.id = "assessment-tutor";
  const heading = el("h3"),
    status = el("p", "subtle"),
    notice = el("p", "subtle"),
    log = el("div", "tutor-dialogue"),
    label = el("label"),
    labelText = el("span"),
    input = el("textarea"),
    actions = el("div", "inline-actions"),
    send = el("button"),
    retry = el("button");
  status.id = "assessment-ai-status";
  status.setAttribute("role", "status");
  log.setAttribute("aria-label", "Assessment dialogue / 评估对话");
  input.id = "assessment-reply";
  input.rows = 3;
  input.maxLength = 1200;
  labelText.id = "assessment-reply-label";
  input.setAttribute("aria-labelledby", labelText.id);
  send.id = "assessment-send";
  retry.id = "assessment-retry";
  label.append(labelText, input);
  actions.append(send, retry);
  root.append(heading, status, notice, log, label, actions);
  parent.after(root);
  let configured = false,
    checking = true,
    pending = false,
    error = "",
    controller = null,
    key = "",
    signature = "",
    last = null;
  const w = (en, zh) => (api.get().language === "zh" ? zh : en);
  const connection = (async () => {
    try {
      const response = await fetch("/api/assessment/status", {
        signal: AbortSignal.timeout(4000),
      });
      const data = await response.json();
      configured =
        response.ok && data.configured === true && data.source === "qwen";
    } catch {}
    checking = false;
    render();
  })();
  function record(role, text, extra = {}) {
    api.setLearning(
      recordLearningEvent(api.get().learning, {
        type: "AI_TUTOR_MESSAGE",
        role,
        text: text.slice(0, 4000),
        source: role === "assistant" ? "qwen" : "learner",
        ...extra,
      }),
    );
    api.persist();
  }
  async function discuss(field, response, repeated = false) {
    if (!response.trim() || pending) return;
    const current = api.get().learning;
    const requestedAttemptId = currentAttempt(current)?.id;
    if (
      currentAttempt(current)?.transfer &&
      !evaluateLesson(current).checks.deliveredToB
    )
      return;
    await connection;
    if (currentAttempt(api.get().learning)?.id !== requestedAttemptId) return;
    if (!configured) {
      error = "";
      render();
      return;
    }
    if (pending) return;
    const initial = api.get(),
      attemptId = currentAttempt(initial.learning)?.id;
    const context = assessmentSnapshot(initial, field, response);
    const history = tutorTurns(initial.learning)
      .slice(-6)
      .map((e) => ({ role: e.role, content: e.text.slice(0, 2000) }));
    const question =
      field === "dialogue"
        ? response
        : initial.language === "zh"
          ? "请评价我的这份回答，并帮我改进理解。"
          : "Please evaluate this response and help me improve my understanding.";
    if (!repeated) record("user", response, { field });
    last = { field, response };
    pending = true;
    error = "";
    controller = new AbortController();
    const activeController = controller;
    const timer = setTimeout(() => activeController.abort(), 30000);
    render();
    try {
      const result = await requestAssessment(
        {
          lessonId: initial.learning.currentLessonId,
          language: initial.language,
          question,
          context,
          history,
        },
        { signal: activeController.signal },
      );
      if (
        currentAttempt(api.get().learning)?.id !== attemptId ||
        controller !== activeController
      )
        return;
      if (!currentAttempt(api.get().learning)?.transfer)
        api.setLearning(
          recordLearningEvent(api.get().learning, {
            type: "HINT_SHOWN",
            source: "qwen",
            note: "Assessment dialogue feedback; not a completion decision.",
          }),
        );
      record("assistant", result.feedback + "\n\n" + result.question, {
        field,
        evidenceIds: context.recentActions.map((e) => e.id),
      });
      input.value = "";
      error = "";
    } catch (e) {
      if (
        currentAttempt(api.get().learning)?.id === attemptId &&
        controller === activeController
      )
        error = e.name === "AbortError" ? "provider_timeout" : e.message;
    } finally {
      clearTimeout(timer);
      if (controller === activeController) {
        pending = false;
        controller = null;
        api.render();
      }
    }
  }
  send.onclick = () => discuss("dialogue", input.value);
  retry.onclick = () => last && discuss(last.field, last.response, true);
  document.getElementById("save-prediction").addEventListener("click", () => {
    const value = document.getElementById("prediction").value;
    if (currentAttempt(api.get().learning)?.prediction === value.trim())
      discuss("prediction", value);
  });
  document.getElementById("save-reflection").addEventListener("click", () => {
    const value = document.getElementById("reflection").value;
    if (currentAttempt(api.get().learning)?.reflection === value.trim())
      discuss("reflection", value);
  });
  document
    .getElementById("answer-form")
    .addEventListener("assessment-submitted", () => {
      const a = currentAttempt(api.get().learning);
      const calculation = api
        .get()
        .learning.evidenceEvents.filter(
          (e) => e.attemptId === a?.id && e.type === "CALCULATION_SUBMITTED",
        )
        .at(-1)?.answers;
      if (a?.answers || a?.design || calculation)
        discuss(
          "answers",
          JSON.stringify(
            a.scenarioAnswers || a.answers || a.design || calculation,
          ),
        );
    });
  function render(visible) {
    const { learning, language } = api.get(),
      attempt = currentAttempt(learning);
    if (key !== attempt?.id) {
      controller?.abort();
      controller = null;
      pending = false;
      error = "";
      last = null;
      input.value = "";
      key = attempt?.id;
      signature = "";
    }
    if (visible !== undefined) root.hidden = !visible;
    const independent =
      attempt?.transfer && !evaluateLesson(learning).checks.deliveredToB;
    heading.textContent = w("Feedback & dialogue", "反馈与对话");
    status.textContent = independent
      ? w(
          "Independent task: save your thinking now. AI discussion becomes available after your delivery test.",
          "独立任务：现在保存思考，完成搬运测试后可与AI讨论。",
        )
      : checking
        ? w(
            "Checking AI connection… Your response can still be saved.",
            "正在检查AI连接……仍可保存回答。",
          )
        : pending
          ? w(
              "Response saved. Qwen is reading your answer…",
              "回答已保存，Qwen正在阅读……",
            )
          : error
            ? w(
                "Your response is saved. AI feedback is unavailable right now. Retry or continue without AI.",
                "回答已保存，AI反馈暂不可用。可以重试，或不使用AI继续。",
              )
            : configured
              ? w(
                  "Qwen connected · Save a response for feedback, then reply below.",
                  "Qwen已连接：保存回答后获得反馈，再在下方继续讨论。",
                )
              : w(
                  "AI is not connected here. Save your reflection and export your project JSON for teacher review.",
                  "此处未连接AI。请保存反思并导出项目JSON，供老师查看。",
                );
    notice.textContent = w(
      "When connected, your response and relevant simulator evidence are sent to Qwen. Do not include personal details. AI feedback may be wrong; it cannot complete a task for you. Dialogue is kept in your local JSON portfolio.",
      "连接后会把回答及相关仿真证据发送给Qwen，请勿填写个人信息。AI反馈可能出错，不会替你完成任务。对话保存在本地JSON作品集中。",
    );
    notice.hidden = !configured || independent;
    const turns = tutorTurns(learning),
      sig = JSON.stringify(turns) + language;
    if (sig !== signature) {
      signature = sig;
      log.replaceChildren();
      for (const t of turns) {
        const bubble = el("article", `tutor-message ${t.role}`),
          name = el("strong"),
          text = el("p");
        name.textContent =
          t.role === "user"
            ? w("You", "你")
            : w("Qwen · feedback", "Qwen · 反馈");
        text.textContent = t.text;
        bubble.append(name, text);
        log.append(bubble);
      }
    }
    log.hidden = !turns.length;
    label.hidden = !configured || independent;
    actions.hidden = !configured || independent;
    input.disabled = pending;
    labelText.textContent = w(
      "Your reply or revised explanation",
      "你的回复或修改后的解释",
    );
    send.textContent = pending
      ? w("Reading…", "阅读中……")
      : w("Send reply", "发送回复");
    send.disabled = pending;
    retry.textContent = w("Retry feedback", "重试反馈");
    retry.hidden = !error;
    retry.disabled = pending;
  }
  return { render, discuss };
}
