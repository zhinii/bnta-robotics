import { parseGuideCommand } from "./guide-commands.mjs";
export const pair = (en, zh) => ({ en, zh });
export const rootOptions = [
  ["lessons", "📖 Lessons", "📖 课程"], ["exercises", "🎯 Exercises", "🎯 练习"],
  ["explore", "🎮 Free explore", "🎮 自由探索"], ["help", "❓ Help", "❓ 帮助"],
].map(([command, en, zh]) => ({ command, label: pair(en, zh) }));
const aliases = {
  下一步: "next", 上一步: "back", 练习: "exercises", 自由探索: "explore",
  张开: "open", 闭合: "close", 步骤: "steps", "录制 开": "record on", "录制 关": "record off",
  取消: "cancel", 继续回答: "answer", 测试对话: "try prompt", 确认: "confirm",
};
export function parseQuestCommand(text) {
  const normalized = text.trim().replace(/\s+/g, " ").toLowerCase();
  const command = aliases[normalized] || normalized;
  const edit = command.match(/^(?:step|步骤)\s+(up|down|delete|上移|下移|删除)\s+(\d+)$/);
  if (edit) return { type: "edit-step", operation: ({ 上移: "up", 下移: "down", 删除: "delete" })[edit[1]] || edit[1], index: Number(edit[2]) - 1 };
  if (["cancel", "answer", "try prompt", "confirm", "dismiss", "reset confirmed"].includes(command)) return { type: command };
  const lesson = command.match(/^(?:lesson|课程)\s*([1-6])$/);
  if (lesson) return { type: "lesson", index: Number(lesson[1]) - 1 };
  return parseGuideCommand(command);
}
// Dialogue state is independent of DOM, lesson content, and any AI provider.
export class QuestEngine {
  constructor({ execute, snapshot, onChange = () => {}, agent = null, restored = null }) {
    this.execute = execute; this.snapshot = snapshot; this.onChange = onChange; this.agent = agent;
    this.language = restored?.language === "zh" ? "zh" : "en";
    this.dialogue = "idle"; this.collapsed = false; this.epoch = 0;
    this.turns = []; this.options = rootOptions; this.answers = [];
    this.awaiting = null; this.pendingPrompt = null; this.draft = ""; this.proposal = null; this.thinking = false;
    this.lessonAdapter = null;
    if (restored && Array.isArray(restored.answers)) this.answers = restored.answers.slice(-50).filter(a => a && typeof a.text === "string" && a.text.length <= 2000);
    if (restored?.pendingPrompt?.kind === "prototype" && typeof restored.draft === "string") {
      this.pendingPrompt = { kind: "prototype", prompt: pair("What would you like to try in this prototype?", "你想在这个原型中尝试什么？") };
      this.draft = restored.draft.slice(0, 2000);
    }
  }
  text(value) { return typeof value === "string" ? value : value?.[this.language] || ""; }
  notify() { this.onChange(this); }
  post(message, role = "coach", extra = {}) {
    this.turns.push({ id: this.turns.length ? this.turns.at(-1).id + 1 : 1, role, message, at: Date.now(), ...extra });
    this.turns = this.turns.slice(-150); this.notify();
  }
  transition(kind, compact = false) {
    if (this.dialogue !== kind) { this.dialogue = kind; this.collapsed = compact; this.epoch++; this.proposal = null; }
    this.notify();
  }
  toggle() { this.collapsed = !this.collapsed; this.notify(); }
  offer(options) { this.options = options; this.notify(); }
  prompt(kind, message) {
    if (this.pendingPrompt?.kind !== kind) this.draft = "";
    this.pendingPrompt = { kind, prompt: message }; this.awaiting = kind;
    this.transition("prompt:" + kind);
    this.post(message);
    this.offer([{ command: "cancel", label: pair("Cancel response", "暂停回答") }]);
  }
  report(message, role = "system") { this.post(message, role); }
  activity(kind, compact = false) { this.transition(kind, compact); }
  stateForSave() { return { language: this.language, draft: this.draft, pendingPrompt: this.pendingPrompt, answers: this.answers,
    course: this.lessonAdapter?.save?.() }; }
  async submit(raw) {
    const input = raw.trim().slice(0, 2000);
    if (!input) return;
    this.post(pair(input, input), "you");
    const slash = input.startsWith("/");
    const text = slash ? input.slice(1).trim() : input;
    const cmd = parseQuestCommand(text);
    if (cmd.type.startsWith("language-")) {
      this.language = cmd.type === "language-zh" ? "zh" : "en"; this.epoch++; this.proposal = null;
      this.report(pair("Language changed. Your own words are kept as written.", "语言已切换。你写下的内容保持原样。")); return;
    }
    if (cmd.type === "stop" || cmd.type === "pause") {
      this.epoch++; this.proposal = null; this.execute(cmd); this.notify(); return;
    }
    if (cmd.type === "cancel") {
      this.lessonAdapter?.pauseResponse?.();
      this.awaiting = null; this.proposal = null; this.transition("paused-response");
      this.report(pair("Response paused; your draft is kept.", "回答已暂停，草稿已保留。"));
      this.offer([{ command: "answer", label: pair("Resume response", "继续回答") }, ...rootOptions]); return;
    }
    if (/^(ask|提问)\s+/i.test(text)) { await this.ask(text.replace(/^(ask|提问)\s+/i, "")); return; }
    if (cmd.type === "answer" && this.pendingPrompt) {
      this.lessonAdapter?.resumeResponse?.(this.pendingPrompt.kind);
      this.prompt(this.pendingPrompt.kind, this.pendingPrompt.prompt); return;
    }
    if (this.awaiting && !slash && !["help", "status"].includes(cmd.type)) {
      const kind = this.awaiting;
      const handled = this.lessonAdapter?.answer?.(kind, input);
      if (handled === false) { this.draft = input; this.notify(); return; }
      this.answers.push({ kind, text: input, at: Date.now() }); this.answers = this.answers.slice(-50);
      this.awaiting = null; this.pendingPrompt = null; this.draft = "";
      if (!handled) {
        this.transition("response-saved");
        this.post(pair("Response saved. This interaction check has no score.", "回答已保存。此交互测试不评分。"), "success");
        this.offer(rootOptions);
      } else this.lessonAdapter?.afterAnswer?.(kind);
      this.notify(); return;
    }
    if (cmd.type === "confirm" && this.proposal) {
      const proposal = this.proposal; this.proposal = null;
      if (proposal.epoch !== this.epoch || proposal.snapshot !== JSON.stringify(this.snapshot())) {
        this.report(pair("The robot or activity changed. Please ask again.", "机器人或活动已改变，请重新提出请求。")); return;
      }
      await this.submit("/" + proposal.command); return;
    }
    if (cmd.type === "dismiss") { this.proposal = null; this.offer(rootOptions); return; }
    if (this.lessonAdapter?.command?.(text, cmd)) return;
    if (["menu", "help"].includes(cmd.type)) {
      this.transition(cmd.type); this.collapsed = false;
      this.post(cmd.type === "menu" ? pair("What would you like to do?", "你想做什么？") :
        pair("Type commands or tap their matching choices. While answering, /ask requests help, /menu opens choices, and Cancel keeps your draft.\nMove: move X Y Z · target X Y Z · open · close\nProgram: record on/off · run · pause · stop · reset · steps\nNavigate: lessons · lesson N · exercises · explore · next · back · hint · status · language en/zh",
          "可以输入命令或点击对应选项。回答时，/ask 用于提问，/menu 打开菜单，取消会保留草稿。\n操作：移动 X Y Z · 目标 X Y Z · 张开 · 闭合\n程序：录制 开/关 · 运行 · 暂停 · 停止 · 重置 · 步骤\n导航：课程 · 课程 N · 练习 · 自由探索 · 下一步 · 上一步 · 提示 · 状态 · 中文/英语"));
      this.offer([...rootOptions, ...(this.pendingPrompt ? [{ command: "answer", label: pair("Resume response", "继续回答") }] : []),
        ...(this.lessonAdapter ? [{ command: "save", label: pair("Export progress", "导出进度") }] : [{ command: "try prompt", label: pair("Try a typed response", "测试文字回答") }])]); return;
    }
    if (cmd.type === "try prompt") {
      this.prompt("prototype", pair("What would you like to try in this prototype?", "你想在这个原型中尝试什么？")); return;
    }
    if (cmd.type === "lesson" || cmd.type === "lessons") {
      this.transition("lesson-slots"); this.collapsed = false;
      this.post(pair("Lesson content is not loaded in this prototype. This preview is for the conversation and controls.", "此原型尚未加载课程内容，当前可体验对话和控制。"), "quest");
      this.offer(rootOptions); return;
    }
    if (["next", "back", "hint"].includes(cmd.type)) {
      if (this.lessonAdapter) {
        this.post(pair("Choose a lesson to use its guided steps and hints.", "请选择课程，以使用对应的导览步骤和提示。")); this.offer(rootOptions); return;
      }
      this.post(pair("This is the interaction prototype. Try a response or explore the robot; the lesson sequence will be connected after this preview.", "这是交互原型。可以测试文字回答或探索机器人；展示原型后再连接课程流程。"));
      this.offer([{ command: "try prompt", label: pair("Try a typed response", "测试文字回答") }, ...rootOptions]); return;
    }
    if (cmd.type === "challenges") {
      this.transition("exercises");
      this.post(pair("Choose a practice scene.", "选择练习场景。"), "quest");
      this.offer([["reach a point", "Reach a point", "到达目标点"], ["pick and place", "Pick & place", "抓取放置"],
        ["avoid an obstacle", "Avoid an obstacle", "绕过障碍物"], ["explore", "Sandbox", "自由探索"]].map(([command, en, zh]) => ({ command, label: pair(en, zh) }))); return;
    }
    if (["explore", "controls", "reach", "transfer", "obstacle"].includes(cmd.type)) {
      this.transition("practice", true); this.collapsed = true;
      this.offer([{ command: "status", label: pair("Status", "状态") }, { command: "steps", label: pair("Steps", "步骤") }, ...rootOptions]);
    }
    if (cmd.type === "question") { await this.ask(input); return; }
    this.epoch++; this.proposal = null;
    this.execute(cmd); this.notify();
  }
  async ask(question) {
    if (this.lessonAdapter?.allowHelp?.() === false) {
      this.post(pair("Hints are paused for this independent attempt. Commands and controller feedback still work.", "独立尝试期间暂停提示，命令和控制器反馈仍可使用。")); return;
    }
    if (!this.agent?.respond || this.thinking) {
      this.post(pair("I can help offline through the choices and commands. Try Help or Status. Your answer draft is unchanged.", "离线时可以使用选项和命令。试试“帮助”或“状态”。回答草稿保持不变。"));
      this.offer(this.awaiting ? [{ command: "answer", label: pair("Return to my response", "返回回答") }, { command: "help", label: pair("Help", "帮助") }] : rootOptions); return;
    }
    const epoch = this.epoch, snapshot = JSON.stringify(this.snapshot());
    this.thinking = true; this.notify();
    try {
      const result = await this.agent.respond(question, { language: this.language, dialogue: this.dialogue, awaiting: this.awaiting, ...this.snapshot() });
      if (epoch !== this.epoch || snapshot !== JSON.stringify(this.snapshot())) {
        this.report(pair("The activity changed while the assistant was answering. Please ask again.", "助手回答期间活动已改变，请重新提问。")); return;
      }
      if (!result || typeof result.text !== "string" || result.text.length > 4000) throw Error("invalid reply");
      this.post(pair(result.text, result.text), "assistant");
      if (result.command) {
        if (parseQuestCommand(result.command).type === "question") throw Error("invalid command");
        this.proposal = { command: result.command, epoch, snapshot };
        this.offer([{ command: "confirm", label: pair("Confirm command", "确认命令") }, { command: "dismiss", label: pair("Dismiss", "取消建议") }]);
      }
    } catch {
      this.proposal = null;
      this.report(pair("The assistant is unavailable. Continue with offline commands; your draft is kept.", "助手暂不可用。可继续使用离线命令，草稿已保留。"));
    } finally { this.thinking = false; this.notify(); }
  }
}
