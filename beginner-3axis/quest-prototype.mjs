import { QuestEngine, pair, rootOptions, parseQuestCommand } from "./quest-engine.mjs";
import { Controller } from "./controller.mjs";
import { createScene } from "./scene.mjs";
import { fk } from "./model.mjs";
import { exerciseScene } from "./exercises.mjs";
import { t } from "./i18n.mjs";
import { requestGuide } from "./guide-ai.mjs";
const $ = id => document.getElementById(id), P = pair;
let engine, renderer, operationView = "controls", task = "sandbox", lastError = "", lastTurn = -1, saveWarning = false, lastDialogue = "";
const view = { trail: true, path: true, ghost: true, grid: true, axes: true, labels: false };
let restored = null;
const saveKey = document.body.dataset.course ? "bnta:quest-course:v1" : "bnta:quest-prototype:v1";
try { restored = JSON.parse(localStorage.getItem(saveKey)); } catch {}
const controller = new Controller({
  onChange: () => { renderRobot(); if (engine && !controller.busy) persist(); },
  onEvent: event => {
    if (!engine) return;
    engine.lessonAdapter?.event?.(event);
    if (["MOVE_REJECTED", "ACTION_REJECTED"].includes(event.type)) {
      lastError = event.error.code;
      engine.report(P(t("en", "error." + lastError, event.error.details || {}), t("zh", "error." + lastError, event.error.details || {})));
    }
    if (["MOVE_COMPLETED", "GRIPPER_CHANGED", "RUN_COMPLETED", "PAUSED", "STOPPED"].includes(event.type)) {
      const p = fk(controller.state.scene.actualJoints).C, held = controller.state.scene.objects.some(o => o.heldByGripper);
      engine.report(event.type === "MOVE_COMPLETED" || event.type === "GRIPPER_CHANGED" ?
        P("TCP: X " + p.x.toFixed(1) + " · Y " + p.y.toFixed(1) + " · Z " + p.z.toFixed(1) + " mm. Object held: " + (held ? "Yes" : "No") + ".",
          "工具中心：X " + p.x.toFixed(1) + " · Y " + p.y.toFixed(1) + " · Z " + p.z.toFixed(1) + " 毫米。夹持物体：" + (held ? "是" : "否") + "。") :
        { RUN_COMPLETED: P("Replay finished.", "回放完成。"), PAUSED: P("Replay paused.", "回放已暂停。"), STOPPED: P("Stopped. Your recorded steps are kept.", "已停止，录制步骤已保留。") }[event.type],
        event.type === "RUN_COMPLETED" ? "success" : "system");
    }
  },
});
engine = new QuestEngine({
  restored, agent: window.robotLabAgent || null, execute,
  snapshot: () => ({ task, tcp: fk(controller.state.scene.actualJoints).C, version: controller.state.scene.sceneVersion,
    target: controller.state.target.parsed, revision: controller.state.program.revision, status: controller.state.execution.status,
    recording: controller.state.recording.enabled, held: controller.state.scene.objects.some(o => o.heldByGripper),
    ...engine?.lessonAdapter?.context?.() }),
  onChange: () => { render(); persist(); },
});
renderer = createScene($("scene"), { language: engine.language });
function persist() {
  if (document.body.dataset.course && !engine.lessonAdapter) return;
  try { localStorage.setItem(saveKey, JSON.stringify(engine.stateForSave())); } catch {
    if (!saveWarning) { saveWarning = true; queueMicrotask(() => engine.report(P("Automatic saving is unavailable. Use Menu → Export progress to keep your work.", "无法自动保存。请使用菜单→导出进度保留你的工作。"))); }
  }
}
function result(r) {
  if (!r?.ok && r?.error && lastError !== r.error.code)
    engine.report(P(t("en", "error." + r.error.code, r.error.details || {}), t("zh", "error." + r.error.code, r.error.details || {})));
  lastError = ""; renderRobot(); return r;
}
function execute(cmd) {
  const c = controller;
  if (cmd.type === "stop") { engine.lessonAdapter?.stopDemo?.(); result(c.stop()); return; }
  if (cmd.type === "pause") { result(c.pause()); return; }
  if (cmd.type === "status") {
    engine.collapsed = false;
    const p = fk(c.state.scene.actualJoints).C;
    engine.post(P("Actual TCP: X " + p.x.toFixed(2) + " Y " + p.y.toFixed(2) + " Z " + p.z.toFixed(2) + " mm.\nRecorded steps: " + c.state.program.steps.length + ". Saved responses: " + engine.answers.length + ".",
      "当前工具中心：X " + p.x.toFixed(2) + " Y " + p.y.toFixed(2) + " Z " + p.z.toFixed(2) + " 毫米。\n已录制 " + c.state.program.steps.length + " 个步骤，已保存 " + engine.answers.length + " 条回答。"));
    engine.lessonAdapter?.status?.(); return;
  }
  if (cmd.type === "home") { renderer.home(); return; }
  if (cmd.type === "files") {
    const link = document.createElement("a"), url = URL.createObjectURL(new Blob([JSON.stringify(engine.stateForSave(), null, 2)], { type: "application/json" }));
    link.href = url; link.download = "robot-lab-progress.json"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    engine.post(P("Progress exported, including responses, programs and archived scenes.", "进度已导出，包含回答、程序和存档场景。")); return;
  }
  if (["trail", "path", "grid", "axes", "ghost"].includes(cmd.type)) {
    view[cmd.type] = !view[cmd.type]; renderRobot(); return;
  }
  if (cmd.type === "clear-trail") { renderer.clearTrail(); return; }
  if (cmd.type === "program" || cmd.type === "controls") {
    engine.lessonAdapter?.stopDemo?.();
    operationView = cmd.type === "program" ? "program" : "controls"; engine.collapsed = true; render(); return;
  }
  if (["explore", "reach", "transfer", "obstacle"].includes(cmd.type)) {
    if (c.busy) return result({ ok: false, error: { code: "BUSY" } });
    // Explore keeps the current scene/program; explicit exercise changes are confirmed if needed.
    if (cmd.type === "explore") {
      engine.lessonAdapter?.leave?.();
      engine.post(P("Explore freely. Preview a target, then Move. Use the header to return to the conversation.", "自由探索吧。先预览目标，再移动。点击标题栏可返回对话。")); return;
    }
    engine.lessonAdapter?.archiveProgram?.(); engine.lessonAdapter?.leave?.();
    c.clearProgram(true);
    task = cmd.type; c.changeScene(exerciseScene(task)); fillTarget();
    engine.post(P("Practice scene ready. Open Status for your position; movement results appear in this log.", "练习场景已准备好。“状态”可查看位置，操作结果会出现在日志中。")); return;
  }
  if (cmd.type === "reset") {
    engine.collapsed = false;
    engine.post(P("Reset the robot and objects to the start? Recorded steps will remain.", "将机器人和物体重置到起点？录制步骤会保留。"));
    engine.offer([{ command: "reset confirmed", label: P("Reset scene", "重置场景") }, { command: "menu", label: P("Keep current scene", "保留当前场景") }]); return;
  }
  if (cmd.type === "reset confirmed") { result(c.reset()); fillTarget(); engine.offer(rootOptions); return; }
  if (engine.awaiting) {
    engine.post(P("Save or cancel your response before operating. Stop is always available.", "请先保存或暂停回答，再进行操作。随时可以停止。")); return;
  }
  if (cmd.type === "edit-step") {
    if (c.busy) return result({ ok: false, error: { code: "BUSY" } });
    engine.lessonAdapter?.archiveProgram?.(); result(c.editProgram(cmd.index, cmd.operation)); render(); return;
  }
  if (engine.lessonAdapter?.canOperate?.(cmd) === false) return;
  if (["target", "move-target"].includes(cmd.type)) {
    if (c.busy) return result({ ok: false, error: { code: "BUSY" } });
    ["x", "y", "z"].forEach((axis, i) => c.editTarget(axis, cmd.values[i])); fillTarget();
    if (cmd.type === "target") { engine.post(P("Target preview ready. The robot has not moved.", "目标预览已更新，机器人尚未移动。")); return; }
  }
  if (cmd.type === "move" || cmd.type === "move-target") { result(c.move()); return; }
  if (cmd.type === "open" || cmd.type === "close") { result(c.grip(cmd.type === "open" ? "open" : "closed")); return; }
  if (cmd.type === "record-on" || cmd.type === "record-off") {
    const r = result(c.setRecording(cmd.type === "record-on"));
    if (r.ok) engine.report(cmd.type === "record-on" ? P("Recording on. Successful actions are saved.", "录制已开启，将保存成功执行的动作。") : P("Recording off.", "录制已关闭。")); return;
  }
  if (cmd.type === "run") {
    const r = result(c.run());
    if (r.ok) { engine.activity("playback", true); engine.report(P("Running your recorded program.", "正在运行录制的程序。")); } return;
  }
  engine.post(P("Open Help for the available commands.", "可打开帮助查看可用命令。"));
}
function fillTarget() { for (const axis of ["x", "y", "z"]) $(axis).value = Number(controller.state.target.draft[axis]).toFixed(2); }
function renderRobot() {
  if (!engine || !renderer) return;
  renderer.update(controller.state.scene, controller.state.target, { ...view, ...engine.lessonAdapter?.visual?.(), language: engine.language });
  const s = controller.state, p = fk(s.scene.actualJoints).C;
  $("actual").textContent = "TCP · X " + p.x.toFixed(1) + " Y " + p.y.toFixed(1) + " Z " + p.z.toFixed(1) + " mm · " +
    engine.text(P("Held: ", "夹持：")) + engine.text(s.scene.objects.some(o => o.heldByGripper) ? P("Yes", "是") : P("No", "否"));
  $("record").textContent = engine.text(s.recording.enabled ? P("● Record on", "● 录制开") : P("○ Record off", "○ 录制关"));
  $("record").setAttribute("aria-pressed", String(s.recording.enabled));
  document.querySelectorAll("#view-tools [aria-pressed]").forEach(b => b.setAttribute("aria-pressed", String(view[b.dataset.command])));
  const locked = !!engine.awaiting || !!engine.lessonAdapter?.demoActive?.();
  document.querySelectorAll("#movement input,#movement button,#record").forEach(e => e.disabled = locked || controller.busy);
  document.querySelectorAll('[data-command="pause"]').forEach(e => e.disabled = s.execution.status !== "running");
  document.querySelectorAll('[data-command="run"]').forEach(e => e.disabled = locked || !s.program.steps.length || ["movingManual", "running"].includes(s.execution.status));
}
function render() {
  if (!engine) return;
  if (engine.dialogue !== lastDialogue && /^(lesson:.*:practice:|restored-practice)/.test(engine.dialogue)) operationView = "controls";
  lastDialogue = engine.dialogue;
  document.documentElement.lang = engine.language; $("language").value = engine.language;
  for (const e of document.querySelectorAll("[data-en]")) e.textContent = engine.text(P(e.dataset.en, e.dataset.zh));
  $("chat-title").textContent = engine.text(P("Coach · Quest Log", "教练 · 任务日志"));
  $("chat-state").textContent = engine.text(engine.thinking ? P("Thinking", "思考中") : engine.agent ? P("AI ready", "AI就绪") : P("Offline", "离线"));
  $("toggle-icon").textContent = engine.collapsed ? "+" : "−";
  $("chat-toggle").setAttribute("aria-expanded", String(!engine.collapsed));
  $("chat-toggle").setAttribute("aria-label", engine.text(engine.collapsed ? P("Show conversation", "展开对话") : P("Show controls, keep input", "显示控制并保留输入框")));
  $("conversation").hidden = engine.collapsed; $("operation").hidden = !engine.collapsed;
  $("movement").hidden = operationView !== "controls"; $("program").hidden = operationView !== "program";
  const nearBottom = $("conversation").scrollHeight - $("conversation").scrollTop - $("conversation").clientHeight < 80;
  const nodes = engine.turns.map(turn => {
    const item = document.createElement("article"); item.className = "turn"; item.dataset.role = turn.role;
    const label = document.createElement("div"); label.className = "turn-label";
    const speaker = document.createElement("span");
    speaker.textContent = engine.text({ you: P("You", "你"), coach: P("Coach", "教练"), assistant: P("Assistant · AI", "助手 · AI"),
      quest: P("Quest", "任务"), success: P("Complete", "完成"), system: P("Robot", "机器人") }[turn.role]);
    const stamp = document.createElement("time"); stamp.dateTime = new Date(turn.at).toISOString();
    stamp.textContent = new Date(turn.at).toLocaleTimeString(engine.language === "zh" ? "zh-CN" : "en-GB", { hour: "2-digit", minute: "2-digit" });
    label.append(speaker, stamp); const content = document.createElement("p"); content.textContent = engine.text(turn.message);
    item.append(label, content);
    if (turn.choices) { const row = document.createElement("div"); row.className = "turn-commands"; turn.choices.forEach(o => row.append(choice(o))); item.append(row); }
    engine.lessonAdapter?.decorateTurn?.(item, turn);
    return item;
  });
  const oldScroll = $("conversation").scrollTop;
  $("conversation").replaceChildren(...nodes);
  if (nearBottom || lastTurn < 0) $("conversation").scrollTop = $("conversation").scrollHeight;
  else $("conversation").scrollTop = oldScroll;
  $("options").replaceChildren(...engine.options.map(choice));
  const latest = engine.turns.at(-1);
  if (latest?.id !== lastTurn) { lastTurn = latest?.id; $("announcement").textContent = engine.text(latest?.message); }
  $("message").placeholder = engine.text(engine.awaiting ? P("Your response · /ask for help", "你的回答 · /ask 提问") : P("Type a command or ask…", "输入命令或提问…"));
  $("send").textContent = engine.text(engine.awaiting ? P("Save", "保存") : P("Send", "发送"));
  if (engine.awaiting && !$("message").value && engine.draft) $("message").value = engine.draft;
  $("steps-list").replaceChildren(...controller.state.program.steps.map((step, i) => {
    const li = document.createElement("li");
    li.textContent = (i + 1) + ". " + (step.type === "move" ? "X " + step.targetMm.x.toFixed(1) + " Y " + step.targetMm.y.toFixed(1) + " Z " + step.targetMm.z.toFixed(1) + " mm" :
      engine.text(step.gripperState === "open" ? P("Open", "张开") : P("Close", "闭合")));
    const actions = document.createElement("div"); actions.className = "inline";
    for (const [action, label] of [["up", P("↑ Earlier", "↑ 提前")], ["down", P("↓ Later", "↓ 延后")], ["delete", P("Remove", "移除")]]) {
      const b = choice({ command: `step ${action} ${i + 1}`, label });
      b.disabled = controller.busy || !!engine.awaiting || (action === "up" && i === 0) || (action === "down" && i === controller.state.program.steps.length - 1);
      actions.append(b);
    }
    li.append(actions); return li;
  }));
  if (!controller.state.program.steps.length) $("steps-list").textContent = engine.text(P("No recorded steps yet.", "尚无录制步骤。"));
  renderRobot();
}
function choice(option) {
  const b = document.createElement("button"); b.type = "button"; b.textContent = engine.text(option.label); b.dataset.command = option.command;
  return b;
}
document.addEventListener("click", event => {
  const b = event.target.closest("[data-command]");
  if (b && !b.disabled) engine.submit("/" + b.dataset.command);
});
$("chat-toggle").onclick = () => { engine.toggle(); if (!engine.collapsed) $("conversation").scrollTop = $("conversation").scrollHeight; };
$("language").onchange = () => engine.submit("/language " + $("language").value);
$("record").onclick = () => engine.submit(controller.state.recording.enabled ? "/record off" : "/record on");
$("composer").onsubmit = async event => { event.preventDefault(); const text = $("message").value; $("message").value = ""; await engine.submit(text); if (!engine.awaiting) $("message").value = ""; render(); };
$("message").oninput = () => {
  const value = $("message").value, type = parseQuestCommand(value).type;
  if (engine.awaiting && !value.startsWith("/") && !["cancel", "stop", "pause", "status", "help", "language-en", "language-zh"].includes(type)) {
    engine.draft = value; persist();
  }
};
const targetCommand = prefix => prefix + " " + ["x", "y", "z"].map(axis => $(axis).value).join(" ");
$("preview").onclick = () => engine.submit(targetCommand("/target"));
$("target-form").onsubmit = event => { event.preventDefault(); engine.submit(targetCommand("/move")); };
let fullHeight = innerHeight;
function fitViewport() {
  const vv = window.visualViewport, typing = document.activeElement?.tagName === "INPUT";
  if (!typing) fullHeight = Math.max(fullHeight, innerHeight);
  const height = vv?.height || innerHeight;
  document.documentElement.style.setProperty("--height", height + "px");
  document.body.classList.toggle("keyboard", typing && height < fullHeight - 100);
}
window.visualViewport?.addEventListener("resize", fitViewport);
window.addEventListener("resize", fitViewport);
document.addEventListener("focusin", fitViewport); document.addEventListener("focusout", () => setTimeout(fitViewport, 0));
let last = 0, frame;
function tick(now) { const dt = Math.min(100, now - (last || now)); last = now; controller.tick(dt); engine.lessonAdapter?.tick?.(dt); frame = requestAnimationFrame(tick); }
fillTarget(); render(); fitViewport();
if (!document.body.dataset.course) {
engine.post(P("Dialogue prototype · no lessons loaded yet.\nThe robot is real: preview, move, grip and record through commands. Choose Help to test a typed response.",
  "对话原型 · 尚未加载课程。\n机器人控制已接通：可通过命令预览、移动、抓取和录制。选择“帮助”可测试文字回答。"), "quest");
engine.post(P("What would you like to do?", "你想做什么？")); engine.offer(rootOptions);
}
frame = requestAnimationFrame(tick);
window.addEventListener("pagehide", () => { cancelAnimationFrame(frame); controller.dispose(); renderer.dispose(); });
// Content is connected only by the course entry; this prototype imports no lesson content.
if (document.body.dataset.course) {
  const { connectQuestLessons } = await import("./quest-lessons.mjs");
  connectQuestLessons({ engine, controller, renderer, fillTarget, renderRobot, restored });
  // Same-origin optional service only. Static hosting never requires a provider.
  if (!engine.agent && !location.hostname.endsWith(".github.io")) {
    try {
      const response = await fetch("/api/guide/status", { signal: AbortSignal.timeout(3000) });
      if (response.ok && (await response.json()).configured) {
        engine.agent = { async respond(question, context) {
          const r = await requestGuide({ question, language: engine.language, lessonId: context.lessonId || "types", history: [], context }, { signal: AbortSignal.timeout(20000) });
          return { text: r.reply, command: r.command };
        } }; render();
      }
    } catch { /* Offline lesson flow needs no service. */ }
  }
}
