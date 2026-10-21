// Shared by typed commands, discoverable menus and validated AI proposals.
// Questions and malformed commands never become robot actions.
export const GUIDE_COMMANDS = [
  ["lessons", "Learn · lessons", "学习 · 课程", "navigate"],
  ["explore", "Explore", "自由探索", "navigate"],
  ["challenges", "Challenges", "挑战任务", "navigate"],
  ["design", "Design a project", "设计项目", "navigate"],
  ["controls", "Open Controls", "打开控制", "navigate"],
  ["program", "Open Program · edit steps", "打开程序 · 编辑步骤", "navigate"],
  ["xyz", "XYZ controls · millimetres", "XYZ控制 · 毫米", "operate"],
  ["joints", "Joint controls · degrees", "关节控制 · 度", "operate"],
  ["jog", "Jog controls", "点动控制", "operate"],
  ["target 120 -80 100", "Preview XYZ target…", "预览XYZ目标…", "operate", true],
  ["move 120 -80 100", "Move to XYZ…", "移动至XYZ…", "operate", true],
  ["move", "Move to current target", "移动至当前目标", "operate"],
  ["open", "Open gripper", "张开夹爪", "operate"],
  ["close", "Close gripper", "闭合夹爪", "operate"],
  ["record on", "Turn recording on", "开启录制", "program"],
  ["record off", "Turn recording off", "关闭录制", "program"],
  ["save position", "Save current position", "记录当前位置", "program"],
  ["run", "Test / resume program", "测试或继续程序", "program"],
  ["pause", "Pause", "暂停", "program"],
  ["stop", "Stop", "停止", "program"],
  ["reset", "Reset scene…", "重置场景…", "program"],
  ["hint", "Hint for this activity", "当前活动提示", "help"],
  ["example", "Show lesson example", "观看课程示例", "help"],
  ["next", "Next lesson step", "课程下一步", "help"],
  ["back", "Previous lesson step", "课程上一步", "help"],
  ["why", "Explain the last failure", "解释最近的失败", "help"],
  ["status", "Robot and recording status", "机器人与录制状态", "help"],
  ["history", "Conversation history", "对话历史", "help"],
  ["files", "Save / load · export evidence", "保存或加载 · 导出证据", "files"],
  ["home", "Reset camera view", "恢复相机视角", "view"],
  ["grid", "Toggle grid", "切换网格", "view"],
  ["axes", "Toggle axes", "切换坐标轴", "view"],
  ["ghost", "Toggle target preview", "切换目标预览", "view"],
  ["trail", "Toggle actual trail", "切换实际轨迹", "view"],
  ["path", "Toggle expected path", "切换预计路径", "view"],
  ["clear trail", "Clear actual trail", "清除实际轨迹", "view"],
  ["language en", "English", "英语", "view"],
  ["language zh", "简体中文", "简体中文", "view"],
].map(([command, en, zh, group, draft = false]) => ({ command, en, zh, group, draft }));

export function suggestGuideCommands(input, language = "en", limit = 3) {
  const query = String(input).trim().toLowerCase();
  if (!query) return [];
  return GUIDE_COMMANDS.filter(item =>
    `${item.command} ${item.en} ${item.zh}`.toLowerCase().includes(query)
  ).sort((a, b) => Number(b.command.startsWith(query)) - Number(a.command.startsWith(query)))
    .slice(0, limit);
}

export function parseGuideCommand(input) {
  const text = String(input).trim().replace(/\s+/g, " ").toLowerCase();
  const aliases = {
    menu: "menu", options: "menu", 菜单: "menu", help: "help", 帮助: "help",
    lessons: "lessons", learn: "lessons", 学习: "lessons", 课程: "lessons",
    exercises: "challenges", challenges: "challenges", challenge: "challenges", 挑战: "challenges",
    explore: "explore", "free explore": "explore", 探索: "explore",
    design: "design", "my project": "design", 设计: "design",
    controls: "controls", 控制: "controls", program: "program", steps: "program", 程序: "program",
    xyz: "xyz", joints: "joints", 关节: "joints", jog: "jog", 点动: "jog",
    home: "home", "home view": "home", 恢复视角: "home",
    grid: "grid", 网格: "grid", axes: "axes", 坐标轴: "axes",
    ghost: "ghost", 目标预览: "ghost", trail: "trail", 实际轨迹: "trail",
    path: "path", 预计路径: "path", "clear trail": "clear-trail", 清除轨迹: "clear-trail",
    why: "why", "why did that fail?": "why", "why did that move fail?": "why", 为什么失败: "why", 失败原因: "why",
    "language en": "language-en", "language zh": "language-zh", 英语: "language-en", 中文: "language-zh",
    hint: "hint", 提示: "hint", example: "example", replay: "example", 示例: "example",
    next: "next", continue: "next", 继续: "next", back: "back", 返回: "back",
    open: "open", "open gripper": "open", 张开夹爪: "open",
    close: "close", "close gripper": "close", 闭合夹爪: "close",
    run: "run", test: "run", resume: "run", "run program": "run", 运行: "run",
    pause: "pause", 暂停: "pause", stop: "stop", 停止: "stop",
    move: "move", 移动: "move", "save position": "position", "add position": "position", 记录位置: "position",
    "record on": "record-on", 开启录制: "record-on", "record off": "record-off", 关闭录制: "record-off",
    reset: "reset", 重置: "reset", save: "files", export: "files", import: "files", files: "files", 保存: "files", 文件: "files",
    status: "status", 状态: "status", history: "history", 历史: "history",
    "reach a point": "reach", "pick and place": "transfer", "pick & place": "transfer", "avoid an obstacle": "obstacle",
    到达目标点: "reach", 抓取放置: "transfer", 绕过障碍物: "obstacle",
  };
  if (aliases[text]) return { type: aliases[text] };
  const lesson = text.match(/^(?:lesson|课程)\s*([1-7])$/);
  if (lesson) return { type: "lesson", index: Number(lesson[1]) - 1 };
  const task = text.match(/^(?:task|challenge|任务|挑战)\s*([1-3])$/);
  if (task) return { type: ["reach", "transfer", "obstacle"][Number(task[1]) - 1] };
  const coordinates = text.match(/^(move|target|移动|目标)\s+(?:x\s*=?\s*)?(-?\d+(?:\.\d+)?)\s*[,， ]\s*(?:y\s*=?\s*)?(-?\d+(?:\.\d+)?)\s*[,， ]\s*(?:z\s*=?\s*)?(-?\d+(?:\.\d+)?)$/);
  if (coordinates && coordinates.slice(2).every(v => Number.isFinite(Number(v))))
    return { type: /^(move|移动)$/.test(coordinates[1]) ? "move-target" : "target", values: coordinates.slice(2).map(Number) };
  return { type: "question", text: String(input).trim() };
}

export function validateGuideProposal(command) {
  if (typeof command !== "string" || !command.trim() || command.length > 200) return null;
  const parsed = parseGuideCommand(command);
  return parsed.type === "question" ? null : parsed;
}
