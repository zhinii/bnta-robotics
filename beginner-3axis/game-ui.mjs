import { requestGuide } from "./guide-ai.mjs";
import { SCENARIOS, scenarioIllustration } from "./assessment-visuals.mjs";
import {
  GAME_LESSONS,
  PAIR,
  newGameState,
  beginGameAttempt,
  activeGameAttempt,
  submitGameAnswer,
  observeGameEvent,
  answerStats,
} from "./game-learning.mjs";
import { VOCABULARY } from "./lesson-vocabulary.mjs";
import { LESSON_UNITS } from "./lesson-units.mjs";
import { LessonDemo, checkCalculation, practiceRoute } from "./curriculum.mjs";
import { CORE_LESSONS, CORE_IDS, ROBOT_TYPES, ASSESSMENTS_ENABLED, DESIGN_ENABLED, startLessonFlow, practiceVerified, lessonRequirements } from "./lesson-flow.mjs";
import { createRobotTypeScene } from "./robot-type-scene.mjs";
import { fk } from "./model.mjs";
import { exerciseGoal, exerciseScene } from "./exercises.mjs";
import { initialScene } from "./planner.mjs";
import { GUIDE_COMMANDS, parseGuideCommand, suggestGuideCommands, validateGuideProposal } from "./guide-commands.mjs";
const $ = (id) => document.getElementById(id);
const n = (tag, text, cls) => {
  const e = document.createElement(tag);
  if (text) e.textContent = text;
  if (cls) e.className = cls;
  return e;
};
const TYPES = ROBOT_TYPES;
export function createGameUI(api) {
  let wasBlocked = false,
    notice = null,
    chatOpen = false,
    aiConfigured = false,
    aiPending = false,
    aiDraft = "";
  let frameCount = 0,
    frameStarted = performance.now();
  let state = api.initial || newGameState(),
    demo = null,
    typeScene = null,
    typeElapsed = 0,
    typePlaying = false,
    typeWatched = false,
    collapsed = false,
    lastKey = "",
    lastLog = "",
    rendering = false,
    revision = 0;
  const w = (en, zh) => (api.get().language === "zh" ? zh : en),
    pick = (x) => x?.[api.get().language] || x?.en || "";
  const c = api.get().c;
  state.dialogue ??= [];
  let guideMenu = null, lastNarration = "", dialogueRevision = 0;
  let pendingProposal = null, aiRequestId = 0, failedQuestion = state.retryQuestion || "", lastFailure = "";
  let wordFocus = null, showingComparison = false;
  const flowAttempt = () => state.mode === "learn" ? activeGameAttempt(state) : null;
  const currentFlow = () => flowAttempt()?.flow;
  const currentLesson = () => CORE_LESSONS[state.lesson] || GAME_LESSONS[state.lesson];
  const contextKey = () => JSON.stringify([
    state.mode, state.lesson, state.phase, state.active, api.get().language,
    c.state.scene.sceneVersion, c.state.program.revision, c.state.target,
    c.state.execution.status, c.state.recording.enabled,
    currentFlow()?.stage, currentFlow()?.awaiting, currentFlow()?.changed,
  ]);
  c.sequence = Math.max(
    c.sequence,
    ...state.runs.map(a => a.eventFloor),
    ...state.runs.flatMap((a) =>
      a.seen.map((id) => Number(id.replace("event-", "")) || 0),
    ),
  );
  document.body.classList.add("game-ui");
  const header = document.querySelector("header"),
    nav = header.querySelector("nav");
  const learn = $("learn"),
    explore = $("explore"),
    challenge = n("button"),
    design = n("button");
  challenge.id = "game-challenge";
  design.id = "game-design";
  nav.append(challenge, design);
  function selectMode(mode) {
    if (c.busy) return;
    if (mode === "design" && !DESIGN_ENABLED) {
      message(w("Design is preserved for a later release. Choose one of the six core lessons.", "设计功能保留到后续版本。请选择六节核心课程。"));
      lastKey = ""; render(); return;
    }
    notice = null;
    chatOpen = false;
    stopDemo();
    state.mode = mode;
    collapsed = false;
    lastKey = "";
    save();
    api.render();
  }
  for (const [button, mode] of [
    [learn, "learn"],
    [explore, "explore"],
    [challenge, "challenge"],
    [design, "design"],
  ])
    button.addEventListener(
      "click",
      (e) => {
        e.stopImmediatePropagation();
        selectMode(mode);
      },
      { capture: true },
    );
  const savePose = n("button");
  savePose.id = "game-save-position";
  savePose.onclick = () => {
    const result = c.savePosition();
    if (result.ok) {
      message(
        w(
          "Position saved. Inspect Steps before testing; an invalid route is highlighted there.",
          "位置已保存，测试前查看步骤，不能执行的路线会被标出。",
        ),
      );
      save();
      api.render();
    }
  };
  document.querySelector(".record-bar").append(savePose);
  const stop = n("button", "■ Stop", "game-stop");
  stop.id = "game-stop";
  stop.onclick = () => {
    pendingProposal = null;
    aiRequestId++;
    stopDemo();
    if (c.busy) c.stop();
    api.render();
  };
  header.append(stop);
  const strip = n("section", null, "game-objective"),
    title = n("strong"),
    objective = n("span"),
    activity = n("select");
  activity.id = "game-activity";
  activity.setAttribute("aria-label", "Activity / 活动");
  strip.append(title, activity, objective);
  document.querySelector("main").prepend(strip);
  const toggleControls = n("button", null, "game-controls-toggle");
  toggleControls.id = "game-controls-toggle";
  toggleControls.onclick = () => {
    const b = document.body.dataset.controlsCollapsed !== "true";
    document.body.dataset.controlsCollapsed = String(b);
    toggleControls.setAttribute("aria-expanded", String(!b));
  };
  header.append(toggleControls);
  const guide = n("section", null, "game-guide");
  guide.id = "game-guide";
  guide.setAttribute("aria-label", "Robot guide / 机器人向导");
  const gh = n("div", null, "game-guide-heading"),
    avatar = n("span", "● ●", "guide-avatar"),
    name = n("strong"),
    badge = n("small"),
    fold = n("button"),
    body = n("div", null, "game-guide-body"),
    line = n("p"),
    actions = n("div", null, "guide-actions"),
    tools = n("div", null, "guide-tools");
  fold.id = "game-guide-toggle";
  fold.onclick = () => {
    openPanel("controls");
  };
  gh.append(avatar, name, badge, fold);
  const demoCue = n("output", null, "game-demo-cue");
  demoCue.setAttribute("aria-live", "polite");
  demoCue.hidden = true;
  guide.append(gh, demoCue, body, actions, tools);
  const sheets = n("div", null, "game-sheets");
  sheets.append(guide, document.querySelector(".inspector"));
  document.querySelector("main").append(sheets);
  // One contextual workspace, with actions outside its scrolling content.
  let activePanel = "controls",
    panelContext = "",
    helpersExpanded = false;
  const panelTabs = n("nav", null, "game-panel-tabs"),
    panelCue = n("button", null, "game-panel-cue"),
    dock = n("div", null, "game-action-dock"),
    moveDock = n("div", null, "game-move-dock"),
    inspector = document.querySelector(".inspector"),
    program = $("steps-dialog"),
    panelButtons = {};
  panelTabs.setAttribute("aria-label", "Workspace panel / 工作面板");
  function openPanel(id) {
    if (id === "program") { $("steps").click(); return; }
    activePanel = id;
    if (program.open) program.close();
    collapsed = false;
    syncPanel();
  }
  panelCue.onclick = () => openPanel("guide");
  for (const id of ["guide", "controls", "program"]) {
    const b = n("button");
    b.id = `game-panel-${id}`;
    b.onclick = () => {
      if (id === "program") $("steps").click();
      else {
        activePanel = id;
        if (program.open) program.close();
        syncPanel();
      }
    };
    panelButtons[id] = b;
    panelTabs.append(b);
  }
  const helpToggle = n("button", "?", "game-help-toggle");
  helpToggle.id = "game-help-toggle";
  helpToggle.onclick = () => {
    helpersExpanded = !helpersExpanded;
    activePanel = "guide";
    if (program.open) program.close();
    collapsed = false;
    render();
  };
  // The guide owns navigation and help; no fourth workspace button.
  moveDock.append($("move"), document.querySelector(".switch-label"), savePose);
  dock.append(moveDock, document.querySelector(".playback-actions"));
  sheets.prepend(panelTabs, panelCue);
  sheets.append(program, dock);
  const composer = n("form", null, "guide-composer"),
    menuButton = n("button", "☰"),
    commandInput = n("input"),
    sendButton = n("button", "↑", "primary");
  composer.id = "guide-composer";
  menuButton.id = "guide-menu";
  menuButton.type = "button";
  menuButton.onclick = () => showMenu(guideMenu ? null : "main");
  commandInput.id = "guide-command";
  commandInput.maxLength = 1600;
  commandInput.autocomplete = "off";
  sendButton.type = "submit";
  sendButton.id = "guide-send";
  composer.append(menuButton, commandInput, sendButton);
  const suggestions = n("div", null, "guide-suggestions");
  suggestions.id = "guide-suggestions";
  suggestions.hidden = true;
  const connectionBadge = n("small", null, "guide-connection");
  connectionBadge.id = "guide-connection";
  connectionBadge.setAttribute("role", "status");
  panelTabs.append(connectionBadge);
  sheets.append(suggestions);
  sheets.append(composer);
  const announce = n("output", null, "guide-announcement");
  announce.setAttribute("aria-live", "polite");
  announce.setAttribute("aria-atomic", "true");
  sheets.append(announce);
  function updateSuggestions() {
    if (currentFlow()?.awaiting && !commandInput.value.startsWith("/")) {
      suggestions.hidden = true;
      return;
    }
    const matches = suggestGuideCommands(commandInput.value, api.get().language);
    suggestions.replaceChildren(...matches.map(item => {
      const b = n("button", pick(item));
      b.type = "button";
      b.onclick = () => {
        commandInput.value = item.command;
        suggestions.hidden = true;
        commandInput.focus();
      };
      return b;
    }));
    suggestions.hidden = !matches.length;
  }
  commandInput.addEventListener("input", updateSuggestions);
  commandInput.addEventListener("input", () => {
    const f = currentFlow();
    if (f?.awaiting && !/^(\/|stop$|cancel$|help$|language\s|停止$|取消$|帮助$)/i.test(commandInput.value)) {
      f.draft = commandInput.value; api.persist();
    }
  });
  commandInput.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      suggestions.hidden = true;
      commandInput.blur();
    }
  });
  let restingViewportHeight = window.innerHeight;
  function fitKeyboard() {
    const viewport = window.visualViewport;
    const editing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName);
    if (!editing) restingViewportHeight = window.innerHeight;
    const keyboard = !!viewport && editing && viewport.height < restingViewportHeight * 0.8;
    document.body.dataset.guideKeyboard = String(keyboard);
    document.body.style.setProperty("--guide-viewport", `${keyboard ? viewport.height : window.innerHeight}px`);
  }
  window.visualViewport?.addEventListener("resize", fitKeyboard);
  window.addEventListener("resize", fitKeyboard);
  document.addEventListener("focusin", fitKeyboard);
  document.addEventListener("focusout", () => setTimeout(fitKeyboard, 0));
  composer.onsubmit = (event) => {
    event.preventDefault();
    const text = commandInput.value.trim();
    if (!text) return;
    commandInput.value = "";
    suggestions.hidden = true;
    pendingProposal = null;
    guideMenu = null;
    notice = null;
    addTurn("user", text);
    submitGuideText(text);
    // Keep keyboard focus for successive commands; Escape dismisses it.
  };
  $("steps").addEventListener("click", () => {
    activePanel = "program";
    syncPanel();
  });
  program.addEventListener("close", () => {
    if (activePanel === "program") activePanel = "controls";
    syncPanel();
    panelButtons[activePanel].focus();
  });
  program.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && program.open) program.close();
  });
  function syncPanel() {
    sheets.dataset.activePanel = activePanel;
    document.body.dataset.workspacePanel = activePanel;
    helpToggle.setAttribute(
      "aria-label",
      w("Help and dialogue history", "帮助和对话记录"),
    );
    helpToggle.setAttribute("aria-expanded", String(helpersExpanded));
    tools.hidden = collapsed || !helpersExpanded;
    const readyForCheck =
      state.mode === "learn" &&
      state.phase === "operate" &&
      (currentFlow() ? practiceVerified(flowAttempt()) : activeGameAttempt(state)?.evidence.length);
    for (const [id, b] of Object.entries(panelButtons)) {
      b.textContent = w(
        { guide: "Guide", controls: "Controls", program: "Program" }[id],
        { guide: "向导", controls: "控制", program: "程序" }[id],
      );
      b.setAttribute("aria-pressed", String(id === activePanel));
      if (id === "guide" && readyForCheck) b.textContent += " ✓";
    }
    panelCue.textContent = demo
      ? demoCue.textContent
      : activePanel === "program"
        ? w(
            "Select a position to preview it. Test replays your saved sequence.",
            "选择位置查看预览。测试会回放已保存的动作序列。",
          )
        : state.mode === "learn"
          ? pick(currentLesson().task)
          : w(
              "Preview → Move. Record adds actions.",
              "预览 → 移动。开启录制可记录动作。",
            );
    if (notice && !demo) panelCue.textContent = notice;
    if (readyForCheck && !notice)
      panelCue.textContent = w(
        "✓ Action verified. Open Guide to continue the lesson.",
        "✓ 操作已验证。打开向导，继续课程。",
      );
    panelCue.dataset.tone = $("feedback").dataset.tone || "";
    panelCue.hidden = activePanel === "guide";
    panelCue.setAttribute("aria-label", w("Open guide: ", "打开向导：") + panelCue.textContent);
    menuButton.setAttribute("aria-label", w("Guide menu", "向导菜单"));
    menuButton.setAttribute("aria-expanded", String(!!guideMenu));
    commandInput.placeholder = aiConfigured ? w("Ask or give a command…", "提问或输入命令…") : w("Command… or tap menu", "输入命令…或点菜单");
    commandInput.setAttribute("aria-label", w("Message your guide", "给向导留言"));
    sendButton.textContent = "↑";
    sendButton.setAttribute("aria-label", w("Send message", "发送消息"));
    const awaiting = currentFlow()?.awaiting;
    if (awaiting) {
      if (!commandInput.value && currentFlow().draft) commandInput.value = currentFlow().draft;
      const label = w(
        { prediction: "Your prediction", reflection: "Your reflection", programNote: "Problem & improvement", calculation: "Displacement, distance, speed" }[awaiting],
        { prediction: "你的预测", reflection: "你的反思", programNote: "问题与改进", calculation: "位移、路程、平均速度" }[awaiting]);
      commandInput.placeholder = label + w(" · /ask for help", " · /ask 提问");
      commandInput.setAttribute("aria-label", label);
      sendButton.textContent = w("Save", "保存");
      sendButton.setAttribute("aria-label", w("Save response", "保存回答"));
    }
    connectionBadge.textContent = aiPending ? w("Thinking", "思考中") : aiConfigured ? "AI" : w("Offline", "离线");
    connectionBadge.title = aiConfigured ? w("AI connected · commands also work offline", "AI已连接 · 命令也可离线使用") : w("Offline guide · all simulator controls available", "离线向导 · 所有模拟器操作均可用");
    moveDock.hidden = activePanel !== "controls";
    dock.hidden = activePanel === "guide" && !c.busy;
    dock.querySelector(".playback-actions").hidden =
      activePanel !== "program" &&
      !["running", "paused"].includes(c.state.execution.status);
    document.body.dataset.robotRunning = String(
      c.busy || !!demo || typePlaying,
    );
    if (activePanel === "guide" && body.dataset.scrollLatest === "true" && body.clientHeight) {
      body.scrollTop += line.getBoundingClientRect().top - body.getBoundingClientRect().top - 6;
      delete body.dataset.scrollLatest;
    }
  }
  // View options share one corner; readouts occupy their own strip, never the robot.
  const sceneCard = document.querySelector(".scene-card"),
    sceneBar = n("div", null, "game-scene-bar"),
    view = n("details", null, "game-view-menu"),
    viewLabel = n("summary"),
    viewOptions = n("div", null, "game-view-options");
  view.append(viewLabel, viewOptions);
  viewOptions.append(document.querySelector(".scene-view-options"));
  for (const id of ["home", "ghost", "grid", "axes", "clear-trail"])
    viewOptions.append($(id));
  sceneBar.append(document.querySelector(".current-readout"), view);
  sceneCard.prepend(sceneBar);
  const history = n("dialog"),
    historyTitle = n("h2"),
    historyList = n("ol"),
    closeHistory = n("button", "×");
  history.className = "game-help-dialog";
  closeHistory.setAttribute("aria-label", "Close / 关闭");
  closeHistory.onclick = () => history.close();
  const modalStop = n("button", "■ Stop / 停止", "game-stop");
  modalStop.onclick = () => {
    stopDemo();
    if (c.busy) c.stop();
    history.close();
    api.render();
  };
  history.append(closeHistory, modalStop, historyTitle, historyList);
  document.body.append(history);
  const historyBtn = n("button"),
    hint = n("button"),
    replay = n("button");
  historyBtn.id = "guide-history";
  hint.id = "guide-hint";
  replay.id = "guide-replay";
  const ai = n("button");
  ai.id = "guide-ai";
  tools.append(historyBtn, hint, replay, ai);
  ai.onclick = () => { openPanel("guide"); commandInput.focus(); };
  async function checkConnection() {
    try {
      const r = await fetch("/api/guide/status", {
          signal: AbortSignal.timeout(4000),
        }),
        d = await r.json();
      aiConfigured = r.ok && d.configured === true && d.source === "qwen";
    } catch { aiConfigured = false; }
    lastKey = "";
    render();
    return aiConfigured;
  }
  Promise.resolve().then(checkConnection);
  historyBtn.onclick = () => {
    historyTitle.textContent = w("Dialogue history", "对话记录");
    historyList.replaceChildren(...state.dialogue.map(x => n("li", `${x.role === "user" ? w("You", "你") : x.role === "ai" ? "Pip · AI" : "Pip"}: ${x.text}`)));
    history.showModal();
  };
  let hintLevel = 0;
  hint.onclick = () => {
    if (currentFlow()?.changed && !currentFlow().checks.deliveryB) {
      message(w("Independent task B: test your own route using the visible coordinates.", "独立任务B：使用可见坐标测试自己的路线。"));
      return;
    }
    const a = activeGameAttempt(state);
    if (state.mode === "learn" && a) {
      a.hintCount++;
      message(
        a.hintCount === 1
          ? pick(currentLesson().task)
          : pick(currentLesson().concept || currentLesson().explain),
      );
    } else {
      hintLevel++;
      message(
        hintLevel === 1
          ? w(
              "Where does the preview first meet an obstruction? Compare the current TCP with your target before changing one coordinate.",
              "预览在哪里首先遇到障碍？修改坐标前比较当前位置与目标。",
            )
          : w(
              "Compare the current TCP with the Source coordinates. Preview the route before moving. Raise or move around an obstruction before crossing it.",
              "比较当前TCP与起点坐标，移动前检查预计路径。跨越障碍物前先抬高，或绕开障碍物。",
            ),
      );
    }
    save();
  };
  replay.onclick = () => {
    if (state.mode === "learn") executeCommand({ type: "example" });
    else
      message(
        w(
          "Use Steps to inspect the sequence, then Test program to replay it from its recorded start.",
          "点击步骤查看动作序列，再测试程序，从录制起点回放。",
        ),
      );
  };
  const exampleHost = n("div", null, "game-example");
  exampleHost.id = "game-example";
  exampleHost.hidden = true;
  $("scene").append(exampleHost);
  function save() {
    revision++;
    state.retryQuestion = failedQuestion;
    api.persist();
  }
  function log(text) {
    if (text && text !== lastLog) {
      state.history.push(String(text).slice(0, 2000));
      state.history = state.history.slice(-300);
      lastLog = text;
    }
  }
  function addTurn(role, text) {
    if (!text) return;
    state.dialogue.push({ role, text: String(text).slice(0, 4000), at: new Date().toISOString() });
    state.dialogue = state.dialogue.slice(-150);
    dialogueRevision++;
    api.persist();
  }
  function showMenu(menu) {
    guideMenu = menu;
    notice = null;
    chatOpen = false;
    lastKey = "";
    openPanel("guide");
    render();
  }
  function choose(label, fn) {
    const b = n("button", label, "guide-menu-choice");
    b.type = "button";
    b.onclick = () => {
      guideMenu = null;
      lastKey = "";
      fn();
    };
    body.append(b);
  }
  function renderMenu() {
    if (guideMenu === "main") {
      message(w("What would you like to do? Your work stays here when you switch panels.", "你想做什么？切换面板时会保留你的作品。"));
      choose(w("Lessons", "课程"), () => showMenu("lessons"));
      choose(w("Challenges", "挑战"), () => showMenu("challenges"));
      choose(w("Explore", "探索"), () => executeCommand({ type: "explore" }));
      if (DESIGN_ENABLED) choose(w("My project", "我的项目"), () => executeCommand({ type: "design" }));
      choose(w("Help", "帮助"), () => showMenu("help"));
      choose(w("Save / load", "保存 / 加载"), () => $("project-files").click());
      choose(w("All commands", "所有命令"), () => showMenu("commands"));
      choose(w("Check AI connection", "检查AI连接"), async () => {
        const connected = await checkConnection();
        message(connected ? w("AI connected. Questions use the school server; commands work locally.", "AI已连接。问题通过学校服务器回答，命令在本地执行。") : w("Offline guide ready. All controls, lessons and commands remain available.", "离线向导已就绪。所有控制、课程和命令均可用。"));
        lastKey = ""; render();
      });
      if (failedQuestion) choose(w("Retry saved question", "重试已保存的问题"), retryQuestion);
    } else if (guideMenu === "lessons") {
      message(w("Choose a lesson. Each has vocabulary, examples and a practical check.", "选择课程：每课包含词汇、示例和实践检查。"));
      CORE_LESSONS.forEach((lesson, index) => {
        const complete = state.runs.some(a => a.lesson === index && a.flow?.stage === "complete");
        choose(`${complete ? "✓ " : ""}${index + 1} · ${pick(lesson.title)}`, () => executeCommand({ type: "lesson", index }));
      });
    } else if (guideMenu === "challenges") {
      message(w("Choose a task to practise. You can ask for a hint at any time.", "选择练习任务。随时可以请求提示。"));
      for (const [type, en, zh] of [["reach", "Reach a point", "到达目标点"], ["transfer", "Pick & place", "抓取放置"], ["obstacle", "Avoid an obstacle", "绕过障碍物"]])
        choose(w(en, zh), () => executeCommand({ type }));
    } else if (guideMenu === "commands" || guideMenu.startsWith("commands:")) {
      message(w("Every command works offline. Coordinate choices fill the input for you to edit and send.", "所有命令均可离线使用。坐标选项会填入输入框，供你修改并发送。"));
      const group = guideMenu.split(":")[1] || "navigate";
      const groupLabel = n("label", w("Command category", "命令类别"));
      const categories = n("select");
      categories.id = "guide-command-category";
      for (const [value, en, zh] of [["navigate", "Modes & panels", "模式与面板"], ["operate", "Move & gripper", "移动与夹爪"], ["program", "Recording & playback", "录制与回放"], ["help", "Learning & help", "学习与帮助"], ["view", "View & language", "视图与语言"], ["files", "Save & export", "保存与导出"]]) {
        const option = n("option", w(en, zh)); option.value = value; categories.append(option);
      }
      categories.value = group;
      categories.onchange = () => showMenu("commands:" + categories.value);
      groupLabel.append(categories); body.append(groupLabel);
      for (const item of GUIDE_COMMANDS.filter(x => x.group === group)) {
        choose(pick(item), () => {
          if (item.draft) {
            commandInput.value = item.command;
            commandInput.focus();
            commandInput.select();
            showMenu(null);
          } else {
            addTurn("user", pick(item));
            executeCommand(parseGuideCommand(item.command));
          }
        });
      }
      if (group === "help" && currentFlow()) {
        for (const [command, en, zh] of [
          ["words", "Explore lesson words", "探索课程词汇"], ["tour", "Start guided tour", "开始导览"],
          ["practice", "Open practice", "打开练习"], ["prepare", "Prepare practice scene", "准备练习场景"],
          ["answer", "Resume response", "继续回答"], ["inspect", "Inspect joint changes", "查看关节变化"],
          ["calculate", "Explain & check calculation", "解释与核对计算"], ["program note", "Problem & improvement", "问题与改进"],
          ["changed task", "Independent task B", "独立任务B"], ["reflect", "Reflect on the lesson", "课程反思"],
        ]) choose(w(en, zh), () => submitGuideText("/" + command));
      }
    } else {
      message(w("Use the menu or type a command. All commands, lessons and practical checks work offline. Connected AI can explain and propose actions; you confirm before they run.", "可以使用菜单或输入命令。所有命令、课程和实践检查均可离线使用。连接AI后可获得解释与操作建议，确认后才会执行。"));
      choose(w("Hint", "提示"), () => { hint.click(); render(); });
      choose(w("Show example", "观看示例"), () => executeCommand({ type: "example" }));
      choose(w("History", "历史"), () => historyBtn.click());
      choose(w("Reset scene…", "重置场景…"), () => executeCommand({ type: "reset" }));
      choose(w("All commands", "所有命令"), () => showMenu("commands"));
      choose(w("Explain last failure", "解释最近的失败"), () => executeCommand({ type: "why" }));
    }
    button(w("Back to activity", "返回活动"), () => showMenu(null));
  }
  function executeCommand(command) {
    const type = command.type;
    const respond = (text) => { message(text); lastKey = ""; render(); save(); };
    if (state.mode === "learn" && currentFlow() && ["next", "back", "example"].includes(type) && handleLessonCommand(type)) return;
    if (type === "stop") { stop.click(); respond(w("Stopped. Your recorded steps are kept.", "已停止，录制步骤已保留。")); return; }
    if (type.startsWith("language-")) {
      $("language").value = type === "language-en" ? "en" : "zh";
      $("language").dispatchEvent(new Event("change", { bubbles: true }));
      updateSuggestions(); return;
    }
    if (["home", "grid", "axes", "ghost", "clear-trail"].includes(type)) {
      $(type).click();
      respond(w("View updated.", "视图已更新。")); return;
    }
    if (["trail", "path"].includes(type)) {
      $(type).click(); respond(w("View updated.", "视图已更新。")); return;
    }
    if (type === "why") {
      const event = [...c.state.events].reverse().find(e => ["MOVE_REJECTED", "ACTION_REJECTED"].includes(e.type));
      respond(event ? api.get().tr("error." + event.error.code, event.error.details || {}) : lastFailure || w("No rejected action in this session. Try Status to inspect the robot.", "当前会话没有被拒绝的操作。输入“状态”查看机器人。"));
      return;
    }
    if (["menu", "help", "lessons", "challenges"].includes(type)) { showMenu({ menu: "main", help: "help", lessons: "lessons", challenges: "challenges" }[type]); return; }
    if (["controls", "program"].includes(type)) { guideMenu = null; openPanel(type); return; }
    if (type === "files") { $("project-files").click(); return; }
    if (type === "history") { historyBtn.click(); return; }
    if (type === "status") {
      const p = fk(c.state.scene.actualJoints).C;
      const held = c.state.scene.objects.some(o => o.heldByGripper);
      respond(w(`TCP X ${p.x.toFixed(1)}, Y ${p.y.toFixed(1)}, Z ${p.z.toFixed(1)} mm. Gripper ${c.state.scene.gripperState}. Object held: ${held ? "Yes" : "No"}. ${c.state.program.steps.length} steps. Record ${c.state.recording.enabled ? "ON" : "OFF"}.`, `TCP X ${p.x.toFixed(1)}、Y ${p.y.toFixed(1)}、Z ${p.z.toFixed(1)} 毫米。夹持物体：${held ? "是" : "否"}。${c.state.program.steps.length}个步骤。录制${c.state.recording.enabled ? "开启" : "关闭"}。`)); return;
    }
    if (type === "hint") {
      if (currentFlow()?.changed && !currentFlow().checks.deliveryB) {
        respond(w("Independent task B: use the visible coordinates and test your own route. Hints resume after the task.", "独立任务B：使用可见坐标测试自己的路线，完成后恢复提示。"));
      } else { hint.click(); openPanel("guide"); render(); }
      return;
    }
    if (type === "question") {
      openPanel("guide");
      if (currentFlow()?.changed && !currentFlow().checks.deliveryB) {
        respond(w("During independent task B, route coaching is paused in both AI and offline modes. Commands, coordinates and controller feedback still work.", "独立任务B期间，AI和离线模式都暂停路线指导。命令、坐标与控制器反馈仍可使用。"));
        return;
      }
      if (aiConfigured && !aiPending) { aiDraft = command.text; sendAI(); }
      else {
        failedQuestion = command.text;
        respond(w(aiPending ? "AI is answering. This question is saved; use Retry saved question when ready. Commands still work." : "Question saved. Offline, choose a topic from Menu or type ‘hint’, ‘why’ or ‘lessons’. You can retry the question when AI connects.", aiPending ? "AI正在回答。此问题已保存，稍后可点“重试已保存的问题”。命令仍可使用。" : "问题已保存。离线时请在菜单选择主题，或输入“提示”“失败原因”“课程”。AI连接后可重试问题。"));
      }
      return;
    }
    if (c.busy && !["pause", "run"].includes(type)) { respond(w("The robot is moving or paused. Stop before changing the activity or target.", "机器人正在运动或已暂停。更改活动或目标前请先停止。")); return; }
    guideMenu = null;
    if (state.mode === "learn" && currentFlow() &&
        (!currentFlow().setup || currentFlow().awaiting || currentFlow().stage !== "practice") &&
        ["move", "move-target", "open", "close", "record-on", "record-off", "position", "run"].includes(type)) {
      respond(w("Finish the current teaching step and save your prediction before operating. Use /ask for help.", "请先完成当前教学步骤并保存预测，再进行操作。可用 /ask 提问。")); return;
    }
    if (["xyz", "joints", "jog"].includes(type)) {
      const control = $("mode-" + type);
      if (control && !control.disabled) { control.click(); openPanel("controls"); }
      else respond(w("Stop the example or current movement first.", "请先停止示例或当前运动。"));
      return;
    }
    if (["explore", "design"].includes(type)) { selectMode(type); return; }
    if (type === "lesson") {
      if (command.index >= 6 && !DESIGN_ENABLED) { respond(w("The six core lessons are available. Lesson 7 is deferred.", "六节核心课程已开放，第7课暂缓。")); return; }
      selectMode("learn"); activity.value = String(command.index); activity.onchange(); return;
    }
    if (["reach", "transfer", "obstacle"].includes(type)) { selectMode("challenge"); activity.value = type; activity.onchange(); return; }
    if (type === "example") {
      if (state.mode === "learn") { openPanel("guide"); watch(); }
      else respond(w("Examples are in Lessons. To replay your own sequence, open Program and Test.", "示例在课程中。回放自己的动作序列，请打开程序并测试。"));
      return;
    }
    if (["next", "back"].includes(type)) {
      lastKey = ""; render();
      const buttons = [...actions.querySelectorAll("button")];
      const candidate = type === "next" ? buttons.find(b => b.classList.contains("primary") && !/watch|example|观看|示例/i.test(b.textContent)) : buttons.find(b => /back|返回|上一/i.test(b.textContent));
      if (candidate && !candidate.disabled) candidate.click();
      else respond(w("Complete the current step or choose one of the replies in Guide.", "请完成当前步骤，或在向导中选择回复。"));
      return;
    }
    if (type === "reset") {
      historyTitle.textContent = w("Reset the scene?", "重置场景？");
      const confirm = n("button", w("Reset scene", "重置场景"));
      confirm.onclick = () => { history.close(); stopDemo(); $("reset").click(); respond(w("Scene reset. Your program is kept.", "场景已重置，程序已保留。")); };
      historyList.replaceChildren(n("li", w("This returns the robot and objects to the starting scene. Your program and learning evidence are kept.", "机器人和物体返回起始场景。程序和学习证据会保留。")), confirm);
      history.showModal(); return;
    }
    if (demo || !exampleHost.hidden) { respond(w("Stop the example before operating your robot.", "操作机器人前请先停止示例。")); return; }
    if (["target", "move-target"].includes(type)) {
      $("mode-xyz").click();
      ["x", "y", "z"].forEach((axis, index) => {
        const input = $(`target-${axis}`);
        input.value = command.values[index];
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      if (type === "target") { respond(w("Target preview updated. Choose Move to execute it.", "目标预览已更新，选择移动来执行。")); openPanel("controls"); return; }
    }
    if (["record-on", "record-off"].includes(type)) {
      $("record").checked = type === "record-on";
      $("record").dispatchEvent(new Event("change", { bubbles: true }));
      if (c.state.recording.enabled !== (type === "record-on")) respond($("feedback").textContent);
      else respond(w(type === "record-on" ? "Recording ON. Movement and gripper actions will be added." : "Recording OFF. You can experiment without adding steps.", type === "record-on" ? "录制已开启，将记录移动和夹爪动作。" : "录制已关闭，探索不会增加步骤。")); return;
    }
    const control = $({ "move-target": "move", position: "game-save-position", open: "open", close: "close", move: "move", run: "run", pause: "pause" }[type]);
    if (control && !control.disabled) {
      control.click();
      const feedback = $("feedback").textContent;
      if (feedback) respond(feedback);
      if (type === "run" || type === "pause") openPanel("program");
    } else respond(w("That action is not available yet. Open Controls or Program to see what is needed.", "该操作暂不可用。打开控制或程序查看需要完成的步骤。"));
  }
  function message(text) {
    if (!rendering) notice = text;
    line.textContent = text;
    if (announce.textContent !== text) announce.textContent = text;
    log(text);
    if (text && text !== lastNarration) {
      lastNarration = text;
      addTurn("guide", text);
    }
    const words = Object.values(VOCABULARY)
        .flat()
        .sort((a, b) => b.en.length - a.en.length),
      used = new Set();
    for (const v of words) {
      const term = api.get().language === "zh" ? v.zh : v.en;
      if (used.has(term.toLowerCase())) continue;
      used.add(term.toLowerCase());
      for (const child of [...line.childNodes]) {
        if (child.nodeType !== 3) continue;
        const raw = child.textContent,
          index = raw.toLowerCase().indexOf(term.toLowerCase());
        if (index < 0) continue;
        if (
          api.get().language !== "zh" &&
          (/[a-z]/i.test(raw[index - 1] || "") ||
            /[a-z]/i.test(raw[index + term.length] || ""))
        )
          continue;
        const b = n(
          "button",
          raw.slice(index, index + term.length),
          "vocabulary-term",
        );
        b.onclick = () => {
          historyTitle.textContent = term;
          historyList.replaceChildren(
            n("li", api.get().language === "zh" ? v.meaningZh : v.meaning),
          );
          history.showModal();
        };
        child.replaceWith(
          document.createTextNode(raw.slice(0, index)),
          b,
          document.createTextNode(raw.slice(index + term.length)),
        );
        break;
      }
    }
  }
  function button(text, fn, primary = false) {
    const b = n("button", text, primary ? "primary" : "");
    b.onclick = () => {
      addTurn("user", text);
      notice = null;
      fn();
    };
    b.disabled = c.busy;
    actions.append(b);
    return b;
  }
  function setPhase(phase) {
    notice = null;
    stopDemo();
    const a = activeGameAttempt(state);
    state.phase = phase;
    if (a) a.phase = phase;
    lastKey = "";
    save();
    render();
  }
  function stopDemo() {
    demo?.dispose();
    demo = null;
    typePlaying = false;
    exampleHost.hidden = true;
    wordFocus = null;
    showingComparison = false;
    api.renderer.clearTrail();
  }
  function watch() {
    if (c.busy) return;
    stopDemo();
    const a = activeGameAttempt(state);
    if (a) {
      a.examples ??= [];
      const key = state.unit;
      if (a.examples.includes(key) || state.phase === "check") a.replays++;
      else a.examples.push(key);
    }
    typeWatched = false;
    if (a?.assisted) a.explanationWatched = false;
    if (GAME_LESSONS[state.lesson].id === "types") {
      if (state.phase === "check") state.unit = 1; // The question asks about gantry rails.
      typeScene ??= createRobotTypeScene(exampleHost);
      exampleHost.hidden = false;
      typeElapsed = 0;
      typePlaying = true;
      typeScene.draw(
        showingComparison ? "sixaxis" : TYPES[state.unit % TYPES.length],
        0,
        w("Robot type demonstration", "机器人类型演示"),
      );
    } else
      demo = new LessonDemo(
        GAME_LESSONS[state.lesson].demo,
        state.phase === "check"
          ? GAME_LESSONS[state.lesson].id === "anatomy"
            ? "base"
            : "full"
          : LESSON_UNITS[GAME_LESSONS[state.lesson].id]?.[state.unit]?.kind ||
            "full",
      );
    save();
    render();
  }
  activity.onchange = () => {
    notice = null;
    stopDemo();
    if (state.mode === "learn") {
      const index = Number(activity.value);
      state.lesson = index;
      const previous = state.runs.filter((a) => a.lesson === index).at(-1);
      if (previous) {
        state.active = previous.id;
        state.phase = previous.phase;
      } else beginGameAttempt(state, index, c.sequence);
      state.unit = 0;
      save();
      render();
    } else {
      checkpoint("Before changing task");
      api.startExercise(activity.value);
      save();
      render();
    }
  };
  function checkpoint(label) {
    if (!c.state.program.steps.length) return;
    state.design.versions.push({
      label,
      at: new Date().toISOString(),
      program: structuredClone(c.state.program),
      scene: structuredClone(c.state.scene),
      problem: state.design.problem,
      criteria: state.design.criteria,
      reflection: state.design.reflection,
    });
    state.design.versions = state.design.versions.slice(-30);
  }
  function field(label, value, oninput) {
    const l = n("label", label);
    const input = n("textarea");
    input.rows = 2;
    input.maxLength = 2000;
    input.value = value || "";
    input.oninput = input.onchange = () => {
      oninput(input.value);
      api.persist();
    };
    l.append(input);
    body.append(l);
    return input;
  }
  function begin() {
    const a = beginGameAttempt(state, state.lesson, c.sequence);
    if (state.lesson < 6 && !ASSESSMENTS_ENABLED) startLessonFlow(a);
    save();
    render();
  }
  function lessonButton(en, zh, command, primary = false, parent = actions) {
    const b = n("button", w(en, zh), primary ? "primary" : "");
    b.dataset.lessonCommand = command;
    b.onclick = () => {
      addTurn("user", b.textContent);
      notice = null;
      submitGuideText("/" + command);
    };
    parent.append(b);
    return b;
  }
  function flowStage(stage) {
    const a = flowAttempt(), f = a?.flow;
    if (!f) return;
    stopDemo();
    f.stage = stage;
    f.awaiting = null;
    f.draft = "";
    commandInput.value = "";
    state.phase = a.phase = { words: "vocabulary", tour: "concept", practice: "operate", reflection: "reflect", complete: "finish" }[stage];
    notice = null;
    guideMenu = null;
    lastKey = "";
    save(); render();
  }
  function awaitResponse(kind) {
    const f = currentFlow();
    if (!f) return;
    f.awaiting = kind;
    commandInput.value = f.draft || "";
    guideMenu = null;
    notice = null;
    lastKey = "";
    openPanel("guide");
    save(); render();
    commandInput.focus();
  }
  function prepareLesson(changed = false) {
    const a = flowAttempt(), f = a?.flow;
    if (!f || c.busy || !a.prediction.trim()) return;
    const prepare = () => {
      if (c.busy) return;
      stopDemo();
      f.setup = false;
      checkpoint(changed ? "Before independent destination B" : "Before lesson practice");
      api.startExercise(a.lesson === 5 ? "obstacle" : "sandbox", false, true);
      if (changed) c.changeScene(initialScene({ obstacle: true, destination: "destinationB" }));
      a.eventFloor = c.sequence;
      a.seen = [];
      if (!changed) {
        f.checks = {}; a.evidence = []; delete a.measurement; delete f.attachedAt;
        f.programNote = ""; f.calculation = "";
      }
      f.changed = changed;
      f.setup = true;
      flowStage("practice");
      openPanel(a.lesson === 1 ? "guide" : "controls");
      api.render();
    };
    if (c.state.program.steps.length) {
      historyTitle.textContent = w("Prepare practice and keep a copy?", "保存副本并准备练习？");
      const yes = n("button", w("Keep a copy & prepare", "保存副本并准备"));
      yes.id = "lesson-confirm-prepare";
      yes.onclick = () => { history.close(); prepare(); };
      historyList.replaceChildren(n("li", w("Your current program is archived in this portfolio before setting up the scene.", "设置场景前，当前程序会保存在作品集中。")), yes);
      history.showModal();
    } else prepare();
  }
  function saveLessonResponse(text) {
    const a = flowAttempt(), f = a?.flow, kind = f?.awaiting;
    if (!kind || !text.trim()) return;
    if (kind === "prediction") {
      a.prediction = text;
      f.awaiting = null; f.draft = "";
      flowStage("practice");
      if (a.lesson === 0) f.setup = true;
      message(w("Prediction saved. Now test your idea.", "预测已保存。现在来验证想法。"));
    } else if (kind === "calculation") {
      const values = text.trim().split(/[,，;\s]+/).map(Number), m = a.measurement;
      if (values.length !== 3 || !m || !checkCalculation({
        displacementZ: m.to.z - m.from.z, distanceMm: m.distance, speedMmS: m.distance / m.seconds,
      }, Object.fromEntries(["displacement", "distance", "speed"].map((k, i) => [k, values[i]])))) {
        f.draft = text; commandInput.value = text;
        message(w("Try three numbers: displacement (mm), distance (mm), average speed (mm/s). Use final Z − initial Z, path distance, then distance ÷ simulated time. Round to 1 decimal place.", "请输入三个数：位移（毫米）、路程（毫米）、平均速度（毫米/秒）。位移＝终点Z−起点Z，速度＝路程÷模拟时间。保留一位小数。"));
        lastKey = ""; save(); render(); return;
      }
      f.calculation = text; f.checks.calculated = "response";
      f.awaiting = null; f.draft = "";
      message(w("Calculation checked against your actual move.", "计算已与实际移动数据核对。"));
    } else if (kind === "programNote") {
      f.programNote = text; f.checks.problemNote = "response";
      f.awaiting = null; f.draft = "";
      message(w("Problem and improvement saved.", "问题与改进已保存。"));
    } else if (kind === "reflection") {
      if (!practiceVerified(a)) {
        message(w("Reflection can be saved after the practical checks are complete.", "完成实践检查后可以保存反思。")); return;
      }
      a.reflection = text;
      flowStage("complete");
    }
    f.draft = "";
    commandInput.value = "";
    lastKey = "";
    save(); render();
  }
  function submitGuideText(raw) {
    const slash = raw.startsWith("/"), text = slash ? raw.slice(1).trim() : raw.trim();
    const f = currentFlow(), parsed = parseGuideCommand(text);
    // Help and Stop remain commands even while the composer is collecting an answer.
    if (/^(ask|提问)\s+/i.test(text)) {
      executeCommand({ type: "question", text: text.replace(/^(ask|提问)\s+/i, "") }); return;
    }
    if (/^(cancel|取消)$/i.test(text)) {
      if (f?.awaiting) { f.awaiting = null; commandInput.value = ""; }
      message(w("Answer entry paused. Choose Resume response to continue. Your draft is kept.", "回答已暂停。选择“继续回答”即可继续，草稿已保留。"));
      lastKey = ""; save(); render(); return;
    }
    if (["stop", "pause", "help", "status", "language-en", "language-zh"].includes(parsed.type)) {
      executeCommand(parsed); return;
    }
    if (f?.awaiting && !slash) { saveLessonResponse(text); return; }
    if (handleLessonCommand(text)) return;
    executeCommand(parsed);
  }
  function handleLessonCommand(text) {
    if (state.mode !== "learn" || state.lesson >= 6) return false;
    const a = flowAttempt(), f = a?.flow;
    const cmd = text.toLowerCase().trim();
    if (/^(begin|开始课程)$/.test(cmd)) { begin(); return true; }
    if (!f) return false;
    const aliases = { 词汇: "words", 导览: "tour", 练习: "practice", 准备: "prepare", 反思: "reflect", 继续回答: "answer", 变化任务: "changed task", 计算: "calculate", 查看关节: "inspect", 下一步: "next", 上一步: "back", 重播: "replay", 预测: "predict" };
    const action = aliases[cmd] || cmd;
    const refresh = () => { lastKey = ""; save(); render(); };
    if (f.changed && !f.checks.deliveryB &&
        (["words", "tour", "compare wrists", "replay", "example"].includes(action) || /^(word|词汇)\s/.test(action))) {
      message(w("Finish independent task B to resume examples, or Prepare practice to restart the guided task.", "完成独立任务B后恢复示例；也可以选择“准备练习”重新开始有指导的任务。"));
      refresh(); return true;
    }
    if (c.busy && (["words", "tour", "practice", "predict", "prepare", "changed task", "reflect", "identify", "identify & explain", "calculate", "program note", "next", "back", "replay", "example", "compare wrists"].includes(action) || /^(word|词汇|j1|use target|使用目标)\s/.test(action))) {
      message(w("Pause or stop the robot before changing the lesson step.", "更改课程步骤前，请暂停或停止机器人。"));
      refresh(); return true;
    }
    if (action === "words") { flowStage("words"); return true; }
    if (action === "tour") {
      const unvisited = (VOCABULARY[CORE_IDS[state.lesson]] || []).length - f.visited.length;
      flowStage("tour"); state.unit = 0; watch();
      if (unvisited > 0) { message(w("Some words are unexplored; you can return to them whenever you like.", "还有词汇未探索，你可以随时返回查看。")); refresh(); }
      return true;
    }
    if (action === "practice" || action === "predict") {
      flowStage("practice");
      if (!a.prediction.trim()) awaitResponse("prediction");
      return true;
    }
    if (action === "answer") {
      const kind = f.stage === "reflection" ? "reflection" : !a.prediction ? "prediction" :
        a.lesson === 2 && f.checks.up10 && !f.checks.calculated ? "calculation" : a.lesson === 4 ? "programNote" : "prediction";
      awaitResponse(kind); return true;
    }
    if (action === "prepare") { prepareLesson(false); return true; }
    if (action === "changed task") {
      if (a.lesson === 5 && f.checks.deliveryA && f.checks.blocked) prepareLesson(true);
      else { message(w("First test the blocked route and deliver to A.", "先测试受阻路线，并送达A。")); refresh(); }
      return true;
    }
    if (action === "reflect" || action === "identify" || action === "identify & explain") {
      if (practiceVerified(a)) { flowStage("reflection"); awaitResponse("reflection"); }
      else { message(w("Complete the remaining practical checks first. Your saved responses are kept.", "请先完成剩余实践检查，已保存的回答会保留。")); refresh(); }
      return true;
    }
    if (action === "calculate") {
      if (a.measurement && f.checks.up10) awaitResponse("calculation");
      return true;
    }
    if (action === "program note") {
      if (f.checks.transfer) awaitResponse("programNote");
      return true;
    }
    if (action === "inspect") {
      const m = a.measurement;
      message(m ? w("Joint changes (degrees): ", "关节变化（度）：") +
        m.beforeAngles.map((q, i) => `J${i + 1} ${(q * 180 / Math.PI).toFixed(1)} → ${(m.afterAngles[i] * 180 / Math.PI).toFixed(1)}`).join(" · ") :
        w("Make the +10 mm Z move first.", "请先完成Z上移10毫米。"));
      refresh(); return true;
    }
    if (["next", "back"].includes(action)) {
      if (f.stage === "tour") {
        const total = state.lesson === 0 ? TYPES.length : LESSON_UNITS[CORE_IDS[state.lesson]].length;
        if (action === "next" && state.unit >= total - 1) return handleLessonCommand("practice");
        state.unit = Math.max(0, Math.min(total - 1, state.unit + (action === "next" ? 1 : -1)));
        notice = null; watch();
      } else if (f.stage === "words") handleLessonCommand("tour");
      else if (f.stage === "practice") handleLessonCommand("reflect");
      else if (f.stage === "complete") {
        if (state.lesson < 5) executeCommand({ type: "lesson", index: state.lesson + 1 });
        else showMenu("lessons");
      }
      return true;
    }
    if (action === "replay" || action === "example") {
      if (f.changed) { message(w("Independent task: examples and route hints are paused until you finish B.", "独立任务：完成B前暂停示例和路线提示。")); refresh(); }
      else { notice = null; watch(); }
      return true;
    }
    if (action === "compare wrists") {
      stopDemo();
      showingComparison = true;
      typeScene ??= createRobotTypeScene(exampleHost);
      exampleHost.hidden = false; typeElapsed = 0; typePlaying = true;
      typeScene.draw("sixaxis", 0, w("Articulated comparison · added wrist axes", "关节式对比 · 增加腕轴"));
      message(w("This is another articulated arm, with wrist axes that can aim the tool. Our programming robot still has three positioning axes.", "这是另一种关节式机械臂，增加腕轴后可以控制工具朝向。我们的编程机器人仍只有三个定位轴。"));
      refresh(); return true;
    }
    const word = action.match(/^(?:word|词汇)\s*(\d+)$/);
    if (word) {
      const term = VOCABULARY[CORE_IDS[state.lesson]]?.[Number(word[1]) - 1];
      if (!term) return true;
      if (!f.visited.includes(term.en)) f.visited.push(term.en);
      stopDemo();
      const type = { SCARA: "scara", Delta: "delta", "Mobile rover": "mobile", "Articulated arm": "articulated", Gantry: "cartesian" }[term.en];
      if (type) {
        state.unit = TYPES.indexOf(type); typeScene ??= createRobotTypeScene(exampleHost);
        exampleHost.hidden = false; typeElapsed = 0; typePlaying = true;
        typeScene.draw(type, 0, pick(term));
      } else wordFocus = /joint|j1|axis/i.test(term.en) ? 0 : /shoulder|j2/i.test(term.en) ? 1 : /elbow|j3|link/i.test(term.en) ? 2 : null;
      message(api.get().language === "zh" ? term.meaningZh : term.meaning);
      refresh(); return true;
    }
    const job = action.match(/^(?:choose|选择)\s*([1-5])$/);
    if (job && a.lesson === 0 && f.stage === "practice" && a.prediction && !f.awaiting) {
      const scenario = SCENARIOS.find(x => !f.jobs[x.id]);
      if (scenario) f.jobs[scenario.id] = TYPES[Number(job[1]) - 1];
      if (SCENARIOS.every(x => f.jobs[x.id])) f.checks.jobs = "responses";
      // Choices are saved for discussion, not scored as right or wrong.
      refresh(); return true;
    }
    const joint = action.match(/^j1\s*([+-]10)(?:°)?$/);
    if (joint && a.lesson === 1 && f.setup && a.prediction && !f.awaiting) {
      stopDemo();
      const result = c.moveJoint(0, c.state.scene.actualJoints[0] + Number(joint[1]) * Math.PI / 180);
      if (!result.ok) message(api.get().tr("error." + result.error.code));
      api.render(); return true;
    }
    const target = action.match(/^(?:use target|使用目标)\s*(\d+)$/);
    if (target && f.setup && !f.changed && !f.awaiting) {
      const routes = practiceRoute(CORE_IDS[state.lesson], c.state.scene).filter(x => x.type === "move");
      const p = routes[Number(target[1]) - 1]?.targetMm;
      if (p) executeCommand({ type: "target", values: [p.x, p.y, p.z] });
      return true;
    }
    return false;
  }
  function renderLearn() {
    if (ASSESSMENTS_ENABLED && !currentFlow()) return renderLegacyLearn();
    if (state.lesson >= 6) {
      if (DESIGN_ENABLED) return renderLegacyLearn();
      message(w("Lesson 7 and graded assessments are deferred. Choose a core lesson from Menu.", "第7课与评分评估暂缓开放。请从菜单选择核心课程。"));
      return;
    }
    const lesson = CORE_LESSONS[state.lesson], a = flowAttempt(), f = a?.flow;
    if (!f) {
      message(pick(lesson.goal) + "\n\n" + pick(lesson.concept));
      lessonButton("Begin lesson", "开始课程", "begin", true);
      return;
    }
    const steps = ["words", "tour", "practice", "reflection"];
    const index = f.stage === "complete" ? 3 : steps.indexOf(f.stage);
    body.append(n("small", `${index + 1}/4 · ${w(["Words", "Guided tour", "Practice", "Reflection"][index], ["词汇", "导览", "练习", "反思"][index])}`, "lesson-progress"));
    if (f.stage === "words") {
      message(pick(lesson.goal) + "\n\n" + w("Explore the words in any order. Select one to see its meaning and a related view.", "按任意顺序探索词汇，点击查看含义与相关视图。"));
      const terms = n("div", null, "lesson-word-list");
      (VOCABULARY[lesson.id] || []).forEach((v, i) => {
        const label = (f.visited.includes(v.en) ? "✓ " : "") + (api.get().language === "zh" ? v.zh : v.en);
        lessonButton(label, label, `word ${i + 1}`, false, terms);
      });
      body.append(terms);
      lessonButton("Start the tour", "开始导览", "tour", true);
    } else if (f.stage === "tour") {
      const unit = LESSON_UNITS[lesson.id]?.[state.unit];
      message(state.lesson === 0 ? [pick(lesson.concept),
        api.get().tr(`bodyPlans.${TYPES[state.unit]}.description`), api.get().tr(`bodyPlans.${TYPES[state.unit]}.job`)].join("\n\n") :
        pick(unit?.concept || lesson.concept) + "\n\n" + pick(unit?.demo || lesson.demo));
      body.append(n("strong", state.lesson === 0 ? api.get().tr(`bodyPlans.${TYPES[state.unit]}.title`) : pick(unit?.title)));
      body.append(n("p", w("Demonstration only · your robot, program and evidence are preserved. Continue at your own pace.", "仅演示 · 保留你的机器人、程序与证据。按自己的节奏继续。"), "guide-note"));
      if (state.lesson === 0 && state.unit === 0) lessonButton("Compare wrist axes", "比较腕部轴", "compare wrists", false, body);
      lessonButton("Replay demo", "重播演示", "replay");
      lessonButton("Next", "下一步", "next", true);
      lessonButton("Skip to practice", "跳至练习", "practice");
    } else if (f.stage === "practice") {
      message(pick(lesson.task));
      if (!a.prediction) {
        if (!f.awaiting) body.append(n("p", pick(lesson.prediction)));
        if (!f.awaiting) lessonButton("Write prediction", "写下预测", "predict", true);
      } else if (state.lesson > 0 && !f.setup) {
        lessonButton("Prepare practice", "准备练习", "prepare", true);
      } else if (state.lesson === 0) {
        const scenario = SCENARIOS.find(x => !f.jobs[x.id]);
        if (scenario) {
          body.append(scenarioIllustration(scenario.id, pick(scenario)), n("p", api.get().language === "zh" ? scenario.promptZh : scenario.prompt));
          const choices = n("div", null, "lesson-job-choices");
          TYPES.forEach((type, i) => {
            const label = `${i + 1} · ${api.get().tr(`bodyPlans.${type}.title`)}`;
            lessonButton(label, label, `choose ${i + 1}`, false, choices);
          });
          body.append(choices, n("p", w("Your choices are saved for discussion. No score.", "选择会保存用于讨论，不评分。")));
        }
      } else {
        const labels = {
          j1: ["Turn only J1 by 10°", "仅转动J1 10°"], up10: ["Move upward exactly 10 mm", "准确上移10毫米"],
          calculated: ["Calculate from your move", "根据实际移动计算"], attached: ["Confirm Object held", "确认夹持物体"],
          lift10: ["Lift the held object 10 mm", "夹住物体后抬高10毫米"], reset: ["Reset starting scene", "重置起始场景"],
          recordOn: ["Record ON", "开启录制"], recordOff: ["Record OFF", "关闭录制"],
          paused: ["Pause a replay", "暂停回放"], stopped: ["Stop a replay", "停止回放"],
          transfer: ["Complete a recorded transfer to A", "完整回放搬运至A"], problemNote: ["Save problem and improvement", "保存问题与改进"],
          blocked: ["Test the blocked direct carrying route", "测试受阻直线搬运"], deliveryA: ["Revise and deliver to A", "改进并送达A"],
          deliveryB: ["Independently record and replay to B", "独立录制并回放至B"],
        };
        const checklist = n("ul", null, "lesson-checklist");
        for (const item of lessonRequirements(a)) checklist.append(n("li", (item.done ? "✓ " : "○ ") + w(...labels[item.key])));
        body.append(checklist);
        if (state.lesson === 1) {
          lessonButton("J1 −10°", "J1 −10°", "j1 -10");
          lessonButton("J1 +10°", "J1 +10°", "j1 +10");
        }
        if ([3, 4, 5].includes(state.lesson) && !f.changed) {
          const details = n("details", null, "lesson-targets");
          details.append(n("summary", w("Task targets · preview only", "任务目标 · 仅预览")));
          let targetNumber = 0;
          details.append(n("p", w("Start with open jaws. Preview each target, then press Move. Follow gripper actions in order.", "从夹爪张开开始。预览每个目标，再按移动，按顺序完成夹爪操作。")));
          const names = { "Source approach": "接近起点", Pickup: "抓取位置", "Lift 10 mm": "抬高10毫米",
            "Test direct route": "测试直线路径", "Lift to clearance": "抬高至安全高度", "Transfer above destination": "移至终点上方",
            "Destination approach": "接近终点", Place: "放置位置", Retreat: "退回" };
          practiceRoute(lesson.id, c.state.scene).forEach((step, i) => {
            const row = n("div");
            if (step.type === "move") {
              targetNumber++;
              const p = step.targetMm;
              row.append(n("span", `${i + 1} · ${w(step.name, names[step.name] || step.name)} · X ${p.x.toFixed(1)} Y ${p.y.toFixed(1)} Z ${p.z.toFixed(1)} mm`));
              lessonButton("Use target", "使用目标", `use target ${targetNumber}`, false, row);
            } else {
              row.append(n("span", `${i + 1} · ${step.gripperState === "closed" ? w("Close, then check Object held", "闭合夹爪并确认已夹持") : w("Open to place the part", "张开夹爪放下零件")}`));
              lessonButton(step.gripperState === "closed" ? "Close" : "Open", step.gripperState === "closed" ? "闭合" : "张开", step.gripperState === "closed" ? "close" : "open", false, row);
            }
            details.append(row);
          });
          body.append(details);
        }
        if (a.measurement) {
          const m = a.measurement;
          body.append(n("p", `Z ${m.from.z.toFixed(2)} → ${m.to.z.toFixed(2)} mm · ${w("Path", "路程")} ${m.distance.toFixed(2)} mm · ${w("Simulated time", "模拟时间")} ${m.seconds.toFixed(3)} s`));
          lessonButton("Inspect joint changes", "查看关节变化", "inspect");
          if (!f.checks.calculated) lessonButton("Explain & check", "解释与核对", "calculate", true);
        }
        if (state.lesson === 4 && f.checks.transfer && !f.checks.problemNote)
          lessonButton("Problem & improvement", "问题与改进", "program note", true);
        if (state.lesson === 5 && f.checks.deliveryA && !f.changed)
          lessonButton("Changed task · B", "变化任务 · B", "changed task", true);
        if (f.changed) body.append(n("p", w("Independent task B · target coordinates remain visible; route hints, examples and target shortcuts are paused.", "独立任务B · 保留目标坐标，暂停路线提示、示例与目标快捷按钮。")));
      }
      if (practiceVerified(a)) lessonButton(state.lesson === 1 ? "Identify & explain" : "Reflect", state.lesson === 1 ? "辨认与解释" : "反思", "reflect", true);
    } else if (f.stage === "reflection") {
      message(w("What did you learn?", "你学到了什么？") + "\n\n" + pick(lesson.reflect));
      if (!f.awaiting) lessonButton("Resume response", "继续回答", "answer", true);
    } else {
      message(w("✓ Lesson complete · practice verified and reflection saved.", "✓ 课程完成 · 实践已验证，反思已保存。"));
      body.append(n("p", a.reflection), n("p", w("Your explanation is saved for discussion; it has not been automatically graded.", "你的解释已保存用于讨论，未进行自动评分。")));
      lessonButton(state.lesson < 5 ? "Next lesson" : "Lessons", state.lesson < 5 ? "下一课" : "课程", "next", true);
      lessonButton("Free explore", "自由探索", "explore");
    }
    if (f.awaiting) {
      const prompt = {
        prediction: pick(lesson.prediction),
        reflection: w("What did you learn?", "你学到了什么？") + "\n" + pick(lesson.reflect),
        programNote: w("Describe one problem you encountered, what you changed, and what happened next.", "描述一个遇到的问题、做出的改进以及之后的结果。"),
        calculation: w("Enter displacement (mm), distance (mm), average speed (mm/s), separated by spaces. Use your measured data above.", "根据上方实测数据，依次输入位移（毫米）、路程（毫米）、平均速度（毫米/秒），用空格分隔。"),
      }[f.awaiting];
      message(prompt);
      body.append(n("p", w("Write in the Guide input below. /ask asks for help without saving an answer; Cancel keeps your draft.", "在下方向导输入框回答。/ask 可提问而不保存为答案；取消会保留草稿。"), "guide-note"));
      lessonButton("Cancel response", "暂停回答", "cancel");
    } else if (f.draft) lessonButton("Resume response", "继续回答", "answer");
  }
  function renderLegacyLearn() {
    const lesson = GAME_LESSONS[state.lesson],
      a = activeGameAttempt(state);
    if (!a || a.lesson !== state.lesson || state.phase === "welcome") {
      message(
        w(
          "I’ll introduce one idea, show an example, then let you try. Your predictions and actions become your evidence. Choose a lesson above, or begin here.",
          "我们先认识一个概念，观看示例，再亲自操作。预测和行动将作为学习证据。可以在上方选择课程，或从这里开始。",
        ),
      );
      button(w("Begin lesson", "开始课程"), begin, true);
      return;
    }
    const phases = [
        "vocabulary",
        "concept",
        "demo",
        "predict",
        "operate",
        "check",
        "reflect",
        "finish",
      ],
      progress = n(
        "small",
        `${phases.indexOf(state.phase) + 1}/8 · ${w({ vocabulary: "Vocabulary", concept: "Concept", demo: "Example", predict: "Predict", operate: "Your turn", check: "Check", reflect: "Reflect", finish: "Evidence" }[state.phase], { vocabulary: "词汇", concept: "概念", demo: "示例", predict: "预测", operate: "操作", check: "检查", reflect: "反思", finish: "证据" }[state.phase])}`,
      );
    body.prepend(progress);
    if (state.phase === "vocabulary") {
      message(
        w(
          "Tap a term to see its meaning. Then we’ll see it move.",
          "点击词汇查看含义，再观察运动。",
        ),
      );
      const terms = n("div", null, "guide-actions");
      for (const v of VOCABULARY[lesson.id] || []) {
        const b = n("button", api.get().language === "zh" ? v.zh : v.en);
        b.onclick = () =>
          message(api.get().language === "zh" ? v.meaningZh : v.meaning);
        terms.append(b);
      }
      body.append(terms);
      button(
        w("See the concept →", "了解概念 →"),
        () => setPhase("concept"),
        true,
      );
    }
    if (state.phase === "concept" || state.phase === "demo") {
      const units = LESSON_UNITS[lesson.id] || [],
        u = units[state.unit % Math.max(units.length, 1)];
      if (lesson.id === "types") {
        const type = TYPES[state.unit % TYPES.length];
        message(
          {
            articulated: w(
              "Rotating joints let an articulated arm reach around a workbench. A factory arm can assemble parts. This demonstration has three positioning axes; industrial arms often add wrist axes.",
              "关节式机械臂通过旋转关节伸向工作台周围，可用于工厂装配。本演示有三根定位轴，工业机械臂常增加腕轴。",
            ),
            cartesian: w(
              "A gantry slides along straight rails. A classroom 3D printer uses this kind of motion.",
              "龙门机器人沿直线导轨滑动，教室里的3D打印机使用这种运动方式。",
            ),
            scara: w(
              "This SCARA sweeps across a bench and lowers a peg into a hole. Similar robots assemble small electronics. This demo shows planar rotation and vertical motion; tool rotation is not demonstrated.",
              "SCARA在台面上方转动并把销钉放入孔中，可用于电子装配。本演示展示平面旋转和升降，未演示工具自转。",
            ),
            delta: w(
              "Three linked chains guide a lightweight tool from above. Delta robots can sort chocolates or packaged snacks.",
              "三条连杆链从上方引导轻巧的工具，并联机器人可分拣巧克力或包装零食。",
            ),
            sixaxis: w(
              "Six rotating axes include three wrist axes. Watch each joint move in turn. Extra wrist motion helps a factory robot aim a tool for welding or painting. Demonstration only; programming stays on the three-axis arm.",
              "六根旋转轴包括三根腕轴。依次观察各关节运动。额外腕部运动帮助工厂机器人瞄准焊接或喷漆位置。仅演示，编程仍使用三轴机械臂。",
            ),
            mobile: w(
              "A mobile robot moves its whole body. Think of a delivery robot travelling through a school corridor.",
              "移动机器人让整个机体移动，例如在学校走廊送物品的机器人。",
            ),
          }[type],
        );
      } else message(u ? pick(u.concept) : pick(lesson.explain));
      button(
        demo || typePlaying
          ? w("Restart example", "重新演示")
          : w("▶ Watch example", "▶ 观看示例"),
        () => {
          setPhase("demo");
          watch();
        },
        true,
      );
      body.prepend(
        n(
          "strong",
          lesson.id === "types"
            ? w(
                {
                  articulated: "Articulated · 3 positioning axes",
                  cartesian: "Gantry · 3 linear axes",
                  scara: "SCARA · planar rotation + vertical slide",
                  delta: "Delta · 3 translations",
                  sixaxis: "Articulated · 6 rotary axes",
                  mobile: "Mobile robot · driving & steering",
                }[TYPES[state.unit]],
                {
                  articulated: "关节式 · 3根定位轴",
                  cartesian: "龙门 · 3根直线轴",
                  scara: "SCARA · 平面旋转与竖直滑动",
                  delta: "Delta · 3方向平移",
                  sixaxis: "关节式 · 6根旋转轴",
                  mobile: "移动机器人 · 行驶与转向",
                }[TYPES[state.unit]],
              )
            : pick(u?.title),
        ),
      );
      const total =
        lesson.id === "types" ? TYPES.length : Math.max(units.length, 1);
      button(
        state.unit + 1 < total
          ? w("Next concept →", "下一概念 →")
          : w("Make a prediction →", "做出预测 →"),
        () => {
          stopDemo();
          if (state.unit + 1 < total) {
            state.unit++;
            setPhase("concept");
          } else setPhase("predict");
        },
      );
      if (demo || typePlaying)
        body.append(
          n(
            "p",
            w(
              "Demonstration only · your program is unchanged",
              "仅演示 · 你的程序保持不变",
            ),
            "guide-note",
          ),
        );
    }
    if (state.phase === "predict") {
      message(pick(lesson.question));
      const input = field(
        w("My prediction and why", "我的预测及原因"),
        a.prediction,
        (v) => (a.prediction = v),
      );
      button(
        w("Save prediction & try", "保存预测并尝试"),
        () => {
          if (!input.value.trim()) {
            message(
              w("Write a short prediction first.", "请先写一个简短预测。"),
            );
            return;
          }
          a.prediction = input.value;
          a.eventFloor = c.sequence;
          setPhase("operate");
        },
        true,
      );
    }
    if (state.phase === "operate") {
      message(pick(lesson.task));
      if (lesson.id !== "types")
        button(w("Prepare practice scene", "准备练习场景"), () => {
          if (c.busy) return;
          historyTitle.textContent = w(
            "Prepare practice scene?",
            "准备练习场景？",
          );
          const confirm = n(
            "button",
            w("Prepare and keep a copy", "保存副本并准备"),
            "primary",
          );
          confirm.id = "game-confirm-practice";
          const cancel = n("button", w("Keep working", "继续当前操作"));
          cancel.onclick = () => history.close();
          historyList.replaceChildren(
            n(
              "p",
              w(
                "Your current program will be archived in this portfolio before the practice scene resets.",
                "重置练习场景前，当前程序会先存入此作品集。",
              ),
            ),
            confirm,
            cancel,
          );
          confirm.onclick = () => {
            if (c.busy) return;
            history.close();
            checkpoint("Before lesson practice");
            c.setRecording(false);
            c.clearProgram(true);
            api.startExercise(
              lesson.id === "obstacle" ? "obstacle" : "sandbox",
              false,
              true,
            );
            a.eventFloor = c.sequence;
            save();
            api.render();
            activePanel = "controls";
            syncPanel();
          };
          history.showModal();
          cancel.focus();
        });
      if (lesson.id === "types") {
        button(w("Watch the comparison", "观看对比"), watch, true);
        if (typeWatched || a.typeWatched)
          button(
            w("I observed the motion →", "我已观察运动 →"),
            () => setPhase("check"),
            true,
          );
      } else {
        body.append(
          n(
            "p",
            a.evidence.length
              ? w("✓ Required action recorded", "✓ 已记录所需操作")
              : w(
                  "Waiting for the actual robot action—not a button click.",
                  "等待实际机器人动作，而不是仅点击按钮。",
                ),
            "guide-note",
          ),
        );
        if (a.evidence.length)
          button(
            w("Check understanding →", "检查理解 →"),
            () => setPhase("check"),
            true,
          );
      }
      if (a.measurement) {
        const m = a.measurement;
        body.append(
          n(
            "p",
            `Z ${m.from.z.toFixed(1)} → ${m.to.z.toFixed(1)} mm · ${m.distance.toFixed(1)} mm · ${m.seconds.toFixed(2)} s`,
          ),
        );
      }
    }
    if (state.phase === "check") {
      message(pick(lesson.question));
      if (lesson.id === "types")
        body.append(
          scenarioIllustration(
            "gantry",
            w("Remember the print-head example", "回想打印头演示"),
          ),
        );
      const last = a.submissions.at(-1);
      if (last && !a.acknowledged) {
        message(
          `${last.correct ? w("Correct. ", "正确。") : w("Take another look. ", "再想一想。")}${last.correct || a.assisted ? pick(lesson.explain) : pick(lesson.hints[Math.min(a.submissions.length - 1, 1)])}`,
        );
        if (a.assisted) {
          body.append(
            n(
              "p",
              w(
                "Three attempts used · continuing with support. Watch the explanation, then acknowledge it.",
                "已尝试三次 · 接下来在帮助下继续。观看解释后确认。",
              ),
            ),
          );
          button(w("▶ Show explanation", "▶ 观看解释"), watch);
        }
        const acknowledge = button(
          last.correct || a.assisted
            ? w("I understand →", "我明白了 →")
            : w("Try again", "再试一次"),
          () => {
            a.acknowledged = true;
            lastKey = "";
            if (last.correct || a.assisted) setPhase("reflect");
            else {
              save();
              render();
            }
          },
          true,
        );
        if (a.assisted && !a.explanationWatched) acknowledge.disabled = true;
      } else {
        lesson.options.forEach((opt, i) =>
          button(pick(opt), () => {
            if (submitGameAnswer(state, i, `${a.id}-${a.submissions.length}`)) {
              c.emit("ANSWER_SUBMITTED", {
                source: "assessment",
                attemptId: a.id,
                lessonId: lesson.id,
                choice: i,
                correct: i === lesson.answer,
                submission: a.submissions.length,
              });
              save();
              lastKey = "";
              render();
            }
          }),
        );
        body.append(
          n(
            "small",
            `${a.submissions.length}/3 ${w("submitted answers", "次已提交回答")}`,
          ),
        );
      }
    }
    if (state.phase === "reflect") {
      message(
        w(
          "What did you observe, and how did it compare with your prediction?",
          "你观察到了什么，与预测有何不同？",
        ),
      );
      if (
        lesson.id === "coordinates" &&
        a.measurement &&
        !a.calculationCorrect
      ) {
        const m = a.measurement;
        body.append(
          n(
            "p",
            `Z ${m.from.z.toFixed(1)} → ${m.to.z.toFixed(1)} mm; ${m.distance.toFixed(1)} mm / ${m.seconds.toFixed(3)} s`,
          ),
        );
        const values = {};
        for (const [key, label] of [
          ["displacement", w("Z displacement (mm)", "Z位移（毫米）")],
          ["distance", w("Distance (mm)", "路程（毫米）")],
          ["speed", w("Average speed (mm/s)", "平均速度（毫米/秒）")],
        ]) {
          const l = n("label", label),
            input = n("input");
          input.type = "number";
          input.step = "any";
          l.append(input);
          body.append(l);
          values[key] = input;
        }
        button(
          w("Check calculation", "检查计算"),
          () => {
            const answers = Object.fromEntries(
              Object.entries(values).map(([k, v]) => [k, v.value]),
            );
            a.calculations ??= [];
            const measurement = {
              ...m,
              displacementZ: m.to.z - m.from.z,
              distanceMm: m.distance,
              speedMmS: m.distance / m.seconds,
            };
            const correct = checkCalculation(measurement, answers);
            a.calculations.push({ answers, correct });
            a.calculationCorrect = correct;
            save();
            if (correct) render();
            else
              message(
                w(
                  "Try final Z minus initial Z; speed = distance ÷ time. Round to 1 decimal place.",
                  "用终点Z减起点Z；速度＝路程÷时间。保留一位小数。",
                ),
              );
          },
          true,
        );
        return;
      }
      const input = field(
        w("My explanation", "我的解释"),
        a.reflection,
        (v) => (a.reflection = v),
      );
      button(
        w("Save evidence", "保存证据"),
        () => {
          if (!input.value.trim()) {
            message(
              w(
                "Add one observation before saving.",
                "保存前请写一个观察结果。",
              ),
            );
            return;
          }
          a.reflection = input.value;
          setPhase("finish");
        },
        true,
      );
    }
    if (state.phase === "finish") {
      message(pick(lesson.explain));
      const stats = answerStats(state);
      body.append(
        n(
          "p",
          `${w("First-answer accuracy", "首次回答正确率")}: ${stats.correct}/${stats.answered} · ${a.assisted ? w("Assisted completion", "辅助完成") : a.hintCount || a.replays ? w("Completed with support", "在支持下完成") : w("Independent response", "独立回答")}. ${w("Practical evidence", "操作证据")}: ${a.evidence.length}. ${w("Explanations remain available for teacher review.", "解释保留供教师评阅。")}`,
        ),
      );
      button(
        w("Next lesson", "下一课"),
        () => {
          beginGameAttempt(state, (state.lesson + 1) % 7, c.sequence);
          save();
          render();
        },
        true,
      );
      button(w("Try a challenge", "尝试挑战"), () => selectMode("challenge"));
      button(w("New attempt", "新尝试"), begin);
      button(w("Export JSON", "导出JSON"), () => $("export-json").click());
    }
  }
  function restoreVersion(v) {
    if (c.busy || !v.program || !v.scene) return;
    if (
      !window.confirm(
        w(
          "Restore this saved version? Current work will be archived first.",
          "恢复此版本？当前作品将先归档。",
        ),
      )
    )
      return;
    checkpoint("Before restoring");
    c.setRecording(false);
    c.clearProgram(true);
    api.startExercise("sandbox", false, true);
    c.changeScene(structuredClone(v.scene));
    c.state.program = structuredClone(v.program);
    c.syncTarget();
    state.design.problem = v.problem || state.design.problem;
    state.design.criteria = v.criteria || state.design.criteria;
    state.design.reflection = v.reflection || "";
    save();
    api.render();
  }
  function renderDesign() {
    const phase = state.design.phase || "brief";
    message(
      w(
        "Design a robot solution for someone. Define success, test it, then explain what the evidence shows. This bench supports the existing source and destinations A/B; it is not a general physics editor.",
        "为他人设计机器人解决方案：定义成功标准，测试，再解释证据。本工作台支持现有起点和目标A/B，并非通用物理编辑器。",
      ),
    );
    if (phase === "brief") {
      field(
        w("Who does this help, and what problem?", "帮助谁 / 什么问题？"),
        state.design.problem,
        (v) => (state.design.problem = v),
      );
      field(
        w("What would count as success?", "什么算成功？"),
        state.design.criteria,
        (v) => (state.design.criteria = v),
      );
      button(
        w("Start designing", "开始设计"),
        () => {
          if (!state.design.problem.trim() || !state.design.criteria.trim()) {
            message(
              w(
                "Describe the problem and success criteria first.",
                "请先描述问题和成功标准。",
              ),
            );
            return;
          }
          state.design.phase = "build";
          save();
          render();
        },
        true,
      );
      return;
    }
    if (phase === "finish") {
      message(
        w(
          "Your design evidence is ready to export. Compare the results with your criteria; a completed run alone does not prove success.",
          "设计证据已可导出，请把结果与成功标准比较。仅运行结束不能证明成功。",
        ),
      );
      body.append(
        n("p", state.design.problem),
        n("p", state.design.criteria),
        n("p", state.design.reflection),
      );
      button(
        w("Export portfolio JSON", "导出作品集JSON"),
        () => $("export-json").click(),
        true,
      );
      button(w("Revise design", "修改设计"), () => {
        state.design.phase = "build";
        save();
        render();
      });
      return;
    }
    button(w("Set destination A", "设为目标A"), () => arrange("destinationA"));
    button(w("Set destination B", "设为目标B"), () => arrange("destinationB"));
    field(
      w("Test result / next change", "测试结果 / 下次改进"),
      state.design.reflection,
      (v) => (state.design.reflection = v),
    );
    button(
      w("Save design version", "保存设计版本"),
      () => {
        if (!state.design.problem.trim() || !state.design.criteria.trim()) {
          message(
            w(
              "Describe the problem and success criteria first.",
              "请先描述问题和成功标准。",
            ),
          );
          return;
        }
        checkpoint(`Design ${state.design.versions.length + 1}`);
        if (!c.state.program.steps.length)
          state.design.versions.push({
            label: "Idea",
            problem: state.design.problem,
            criteria: state.design.criteria,
            reflection: state.design.reflection,
          });
        save();
        lastKey = "";
        render();
      },
      true,
    );
    button(w("Finish & reflect", "完成并反思"), () => {
      if (!state.design.reflection.trim()) {
        message(
          w(
            "Write what the test showed first, including any limits.",
            "请先写测试结果，包括不足。",
          ),
        );
        return;
      }
      checkpoint("Portfolio evidence");
      state.design.phase = "finish";
      save();
      render();
    });
    button(w("Save scene image", "保存场景图片"), () => {
      const image = api.renderer.capture();
      if (!image) {
        message(
          w(
            "Image unavailable: the 3D renderer is not ready.",
            "3D尚未就绪，无法保存图片。",
          ),
        );
        return;
      }
      state.design.images ??= [];
      state.design.images.push({ at: new Date().toISOString(), data: image });
      state.design.images = state.design.images.slice(-3);
      save();
      message(
        w(
          "Scene image added to the JSON portfolio (latest 3 images).",
          "场景图片已加入JSON作品集（最近3张）。",
        ),
      );
    });
    if (state.design.versions.some((v) => v.program)) {
      const versions = n("select");
      versions.setAttribute(
        "aria-label",
        w("Saved design version", "已保存设计版本"),
      );
      const blank = n("option", w("Restore a saved version…", "恢复保存版本…"));
      blank.value = "";
      versions.append(blank);
      state.design.versions.forEach((v, i) => {
        if (v.program) {
          const o = n("option", `${i + 1} · ${v.label}`);
          o.value = String(i);
          versions.append(o);
        }
      });
      versions.onchange = () => {
        if (versions.value !== "")
          restoreVersion(state.design.versions[Number(versions.value)]);
      };
      body.append(versions);
    }
    body.append(
      n(
        "p",
        `${state.design.versions.length} ${w("saved versions · partial results are valid; simulation does not certify a physical robot.", "个保存版本 · 部分成功也有价值，模拟不能认证实体机器人。")}`,
      ),
    );
  }
  function arrange(destination) {
    if (c.busy) return;
    if (
      !window.confirm(
        w(
          "Set up a new design scene? Your current program is archived in the JSON portfolio before this change.",
          "设置新的设计场景？修改前将把当前程序存入JSON作品集归档。",
        ),
      )
    )
      return;
    checkpoint("Before scene arrangement");
    c.setRecording(false);
    if (c.state.program.steps.length) c.clearProgram(true);
    api.startExercise("sandbox", false, true);
    c.changeScene(initialScene({ destination }));
    c.initialScene = structuredClone(c.state.scene);
    c.syncTarget();
    save();
    api.render();
  }
  function renderChallenge() {
    const { exercise } = api.get(),
      result = exercise.results[exercise.taskId],
      pass =
        result &&
        JSON.stringify(result.program.steps) ===
          JSON.stringify(c.state.program.steps) &&
        exerciseGoal(exercise.taskId, c.state.program, c.state.scene);
    message(
      pass
        ? w(
            "Your recorded test met this task’s criteria. Compare your route with another idea, or explain why it worked.",
            "你的录制测试达到了任务标准。可比较另一条路线，或解释成功原因。",
          )
        : exercise.taskId === "sandbox"
          ? w(
              "Choose one of the three missions above. Your program is archived before setting up a different scene.",
              "在上方选择三项任务之一，换场景前先归档当前程序。",
            )
          : exercise.taskId === "reach"
            ? w(
                "Reach Destination A. Record at least two moves, then Test program. Your tool must finish within 2 mm of the displayed target. The gripper is not needed.",
                "到达目标A。录制至少两次移动，再测试程序。工具最终需在目标2毫米以内，无需夹爪。",
              )
            : w(
                "Pick up the part from Source and release it on Destination A. Record at least two moves plus Close and Open, then test. Keep the arm and held part clear of obstacles. A supported release within 2 mm completes the mission.",
                "从起点抓取零件，在目标A释放。录制至少两次移动及闭合、张开，再测试。机械臂和零件均需避开障碍，释放后由A支撑且误差不超过2毫米即完成。",
              ),
    );
    button(w("Task coordinates & hints", "任务坐标与提示"), () => {
      const source = $("exercise-reference");
      historyTitle.textContent = w("Task reference", "任务参考");
      historyList.replaceChildren();
      for (const row of source.querySelectorAll("div > div")) {
        const label = row.querySelector("span"),
          original = row.querySelector("button");
        if (!label || !original) continue;
        const li = n("li"),
          fill = n("button", w("Fill target", "填入目标"));
        fill.disabled = c.busy;
        fill.onclick = () => {
          original.click();
          history.close();
        };
        li.append(n("p", label.textContent), fill);
        historyList.append(li);
      }
      const tip = source.querySelector("p");
      if (tip) historyList.append(n("li", tip.textContent));
      history.showModal();
    });
    button(w("Review program", "查看程序"), () => $("steps").click(), true);
    if (pass) {
      button(w("Retry this mission", "重试任务"), () => {
        checkpoint("Before retry");
        api.startExercise(exercise.taskId, true);
      });
    }
    if (pass) {
      state.challengeReflections ??= {};
      field(
        w("Why did your route work?", "路线为什么成功？"),
        state.challengeReflections[exercise.taskId],
        (v) => (state.challengeReflections[exercise.taskId] = v),
      );
    }
  }
  async function sendAI() {
    if (currentFlow()?.changed && !currentFlow().checks.deliveryB) {
      message(w("AI coaching resumes after independent task B. Commands and controller feedback remain available.", "完成独立任务B后恢复AI指导。命令与控制器反馈仍可使用。"));
      lastKey = ""; render(); return;
    }
    if (!aiConfigured || aiPending || !aiDraft.trim()) return;
    const question = aiDraft.trim(),
      attempt = activeGameAttempt(state),
      key = contextKey(),
      requestId = ++aiRequestId,
      lessonId =
        state.mode === "learn" ? GAME_LESSONS[state.lesson].id : "design";
    state.aiTurns ??= [];
    const history = state.aiTurns
      .filter(t => ["user", "assistant"].includes(t.role))
      .slice(-6)
      .map((t) => ({ role: t.role, content: t.text }));
    state.aiTurns.push({ role: "user", text: question });
    state.aiTurns = state.aiTurns.slice(-30);
    if (attempt) attempt.hintCount++;
    aiDraft = "";
    if (failedQuestion === question) failedQuestion = "";
    pendingProposal = null;
    aiPending = true;
    save();
    render();
    try {
      const result = await requestGuide(
        {
          lessonId,
          language: api.get().language,
          question,
          history,
          context: {
            goal: state.mode === "learn" ? pick(currentLesson().goal || currentLesson().task) : objective.textContent,
            mode: state.mode,
            lessonPhase: currentFlow()?.stage || state.phase,
            awaitingResponse: currentFlow()?.awaiting || null,
            practicalChecks: currentFlow()?.checks || {},
            task: state.mode === "learn" ? pick(currentLesson().task) : undefined,
            measurement: attempt?.measurement,
            calculation: currentFlow()?.calculation,
            programNote: currentFlow()?.programNote,
            actual: {
              tcp: fk(c.state.scene.actualJoints).C,
              gripperState: c.state.scene.gripperState,
              objectHeld: c.state.scene.objects.some((o) => o.heldByGripper),
            },
            program: c.state.program.steps.slice(0, 30),
            prediction: attempt?.prediction,
            reflection: attempt?.reflection,
            recentActions: c.state.events.slice(-8).map((e) => ({
              id: e.id,
              type: e.type,
              error: e.error?.code,
              verified: e.verified,
            })),
            limits:
              "Geometry only. No forces or gravity. Do not award completion. Propose at most one command; the user must confirm.",
          },
        },
        { signal: AbortSignal.timeout(30000) },
      );
      if (requestId === aiRequestId) {
        state.aiTurns.push({
          role: "assistant",
          text: result.reply,
          source: "qwen",
        });
        state.aiTurns = state.aiTurns.slice(-30);
        addTurn("ai", result.reply);
        notice = result.reply;
        if (result.command) {
          if (contextKey() === key) pendingProposal = { command: result.command, key };
          else notice = w("The activity or robot changed while AI was answering. Its proposed action was discarded. Please ask again.", "AI回答期间活动或机器人状态已改变，操作建议已取消。请重新提问。");
        }
      }
    } catch {
      if (requestId !== aiRequestId) return;
      aiConfigured = false;
      failedQuestion ||= question;
      notice = w("AI is unavailable. Your question is saved. Use Menu or Hint to continue offline.", "AI暂不可用。问题已保存，可使用菜单或提示继续离线学习。");
      addTurn("guide", notice);
      state.aiTurns.push({
        role: "status",
        text: w(
          "AI is unavailable. Your question is saved. Use the offline Hint or return to your activity.",
          "AI暂不可用，问题已保存。可以使用离线提示或返回活动。",
        ),
      });
    } finally {
      state.aiTurns = (state.aiTurns || []).slice(-30);
      aiPending = false;
      save();
      lastKey = "";
      render();
    }
  }
  async function retryQuestion() {
    if (aiPending || !failedQuestion) return;
    const question = failedQuestion;
    if (await checkConnection()) { aiDraft = question; sendAI(); }
    else {
      message(w("AI is still unavailable. Your question is kept; offline commands are ready.", "AI仍不可用。问题已保留，离线命令可以正常使用。"));
      lastKey = ""; render();
    }
  }
  function renderChat() {
    message(
      w(
        "AI discussion uses the school server. Proposed commands need your confirmation; completion comes from simulator checks.",
        "AI对话通过学校服务器进行。建议命令需要你的确认，完成状态由模拟器检查决定。",
      ),
    );
    for (const turn of state.aiTurns || [])
      body.append(
        n(
          "p",
          `${turn.role === "assistant" ? "AI" : turn.role === "user" ? w("You", "你") : w("Status", "状态")}: ${turn.text}`,
        ),
      );
    field(w("Your question", "你的问题"), aiDraft, (v) => (aiDraft = v));
    button(
      aiPending ? w("Thinking…", "思考中…") : w("Send to AI", "发送给AI"),
      sendAI,
      true,
    ).disabled = aiPending;
    button(w("Back to activity", "返回活动"), () => {
      chatOpen = false;
      lastKey = "";
      render();
    });
  }
  function render() {
    if (rendering) return;
    rendering = true;
    const { language, exercise } = api.get(),
      lesson = currentLesson();
    document.body.dataset.gameMode = state.mode;
    $("project-files").textContent = w("Files", "文件");
    $("project-files").setAttribute(
      "aria-label",
      w("Save or load a project", "保存或加载项目"),
    );
    $("project-files").title = w(
      "Save / load project JSON",
      "保存 / 加载项目JSON",
    );
    header.querySelector("nav").hidden = true;
    $("project-files").hidden = true;
    const f = currentFlow();
    const context = `${state.mode}:${state.lesson}:${state.phase}:${f?.awaiting || ""}:${f?.setup}:${f?.changed}`;
    if (panelContext !== context) {
      panelContext = context;
      if (program.open) program.close();
      activePanel = state.mode === "explore" || (f?.stage === "practice" && f.setup && !f.awaiting && state.lesson > 1) ? "controls" : "guide";
    }
    viewLabel.textContent = w("View", "视图");
    learn.textContent = w("Learn", "学习");
    explore.textContent = w("Explore", "探索");
    challenge.textContent = w("Challenge", "挑战");
    design.textContent = w("Design", "设计");
    [learn, explore, challenge, design].forEach((b, i) =>
      b.setAttribute(
        "aria-pressed",
        String(["learn", "explore", "challenge", "design"][i] === state.mode),
      ),
    );
    savePose.textContent = w("＋ Position", "＋ 位置");
    savePose.disabled = c.busy;
    stop.textContent = w("■ Stop", "■ 停止");
    stop.disabled = !c.busy && !demo && !typePlaying;
    toggleControls.textContent = w("Controls", "控制");
    toggleControls.hidden = true;
    demoCue.hidden = !demo;
    if (demo) {
      const command = demo.commands[demo.index];
      const label = !command
        ? w("Starting example", "开始演示")
        : command.type === "target"
          ? w("Enter XYZ target", "输入XYZ目标")
          : command.type === "move"
            ? w("Move to target", "移动到目标")
            : command.type === "jointDemo"
              ? `J${command.jointIndex + 1} · ${((command.angleRad * 180) / Math.PI).toFixed(0)}°`
              : command.type === "record"
                ? w(
                    command.enabled ? "Record ON" : "Record OFF",
                    command.enabled ? "开启录制" : "关闭录制",
                  )
                : command.type === "gripper"
                  ? w(
                      command.gripperState === "open"
                        ? "Open gripper"
                        : "Close gripper",
                      command.gripperState === "open" ? "张开夹爪" : "闭合夹爪",
                    )
                  : command.type === "reset"
                    ? w("Reset scene", "重置场景")
                    : w("Replay the recorded sequence", "回放录制的程序");
      demoCue.textContent = `${w("Example", "示例")} ${Math.max(1, demo.index + 1)}/${demo.commands.length} · ${label}${demo.error ? " · " + api.get().tr("error." + demo.error.code) : ""}`;
    }
    document.body.dataset.gamePhase = state.phase;
    title.textContent =
      state.mode === "learn"
        ? pick(lesson.title)
        : w(
            {
              explore: "Robot workshop",
              challenge: "Your mission",
              design: "Your design",
            }[state.mode],
            {
              explore: "机器人工作坊",
              challenge: "你的任务",
              design: "你的设计",
            }[state.mode],
          );
    objective.textContent =
      demo || typePlaying
        ? w(
            "Example playing · your work is preserved",
            "演示播放中 · 保留你的作品",
          )
        : c.busy
          ? w(
              "Robot moving · Stop is always available",
              "机器人运动中 · 随时可停止",
            )
          : state.mode === "challenge"
            ? w(
                c.state.recording.enabled
                  ? "Recording route"
                  : "Plan → record → test",
                c.state.recording.enabled ? "录制路线" : "规划 → 录制 → 测试",
              )
            : w(
                "Three positioning axes · gripper is separate",
                "三个定位轴 · 夹爪独立开合",
              );
    activity.disabled = c.busy;
    activity.hidden = !["learn", "challenge"].includes(state.mode);
    const options =
      state.mode === "learn"
        ? CORE_LESSONS.map((l, i) => [String(i), `${i + 1} · ${pick(l.title)}`])
        : [
            ["sandbox", w("Choose a mission…", "选择任务…")],
            ["reach", w("1 · Reach a point", "1 · 到达目标点")],
            ["transfer", w("2 · Pick & place", "2 · 抓取放置")],
            ["obstacle", w("3 · Avoid an obstacle", "3 · 绕过障碍物")],
          ];
    const optionKey = state.mode + language;
    if (activity.dataset.options !== optionKey) {
      activity.replaceChildren(
        ...options.map(([value, label]) => {
          const o = n("option", label);
          o.value = value;
          return o;
        }),
      );
      activity.dataset.options = optionKey;
    }
    activity.value =
      state.mode === "learn" ? String(state.lesson) : exercise.taskId;
    name.textContent = w("Pip · your guide", "Pip · 你的向导");
    badge.textContent = aiConfigured ? w("AI connected", "AI已连接") : w("Offline guide", "离线向导");
    ai.textContent = aiConfigured
      ? w("Ask AI", "问AI")
      : w("AI offline", "AI离线");
    ai.disabled = !aiConfigured;
    fold.textContent = collapsed ? "+" : "−";
    fold.setAttribute(
      "aria-label",
      collapsed
        ? w("Expand guide", "展开向导")
        : w("Collapse guide", "收起向导"),
    );
    fold.setAttribute("aria-expanded", String(!collapsed));
    body.hidden = tools.hidden = actions.hidden = collapsed;
    guide.dataset.collapsed = String(collapsed);
    historyBtn.textContent = w("History", "历史");
    hint.textContent = w("Hint", "提示");
    replay.textContent = w("Replay / help", "重看 / 帮助");
    const a = activeGameAttempt(state),
      key = [
        chatOpen,
        aiPending,
        aiConfigured,
        !!pendingProposal,
        failedQuestion,
        f?.stage,
        f?.awaiting,
        f?.setup,
        f?.changed,
        state.mode,
        language,
        state.lesson,
        state.phase,
        state.unit,
        revision,
        a?.evidence.length,
        a?.typeWatched,
        exercise.taskId,
        !!exercise.results[exercise.taskId],
        !!demo,
        typePlaying,
        c.state.program.revision,
        c.state.scene.sceneVersion,
        c.state.execution.status,
      ].join(":");
    if (lastKey !== key) {
      lastKey = key;
      body.scrollTop = 0;
      body.replaceChildren(line);
      actions.replaceChildren();
      if (guideMenu) renderMenu();
      else if (chatOpen) renderChat();
      else if (state.mode === "learn") renderLearn();
      else if (state.mode === "challenge") renderChallenge();
      else if (state.mode === "design") renderDesign();
      else {
        message(
          w(
            "Welcome to your robot workshop. Choose XYZ, Joints or Jog in Controls. Keep Record OFF while experimenting. Start a lesson whenever you are ready.",
            "欢迎来到机器人工作坊。在控制中选择XYZ、关节或方向键。探索时请关闭录制，准备好后随时开始课程。",
          ),
        );
        button(
          w("Start learning", "开始学习"),
          () => selectMode("learn"),
          true,
        );
        button(w("Try a challenge", "尝试挑战"), () => selectMode("challenge"));
      }
      if (notice) message(notice);
      if (pendingProposal) {
        const proposal = pendingProposal;
        const card = n("div", null, "guide-proposal");
        card.id = "guide-proposal";
        card.append(n("strong", w("Proposed command", "建议命令")), n("code", proposal.command));
        const confirm = n("button", w("Execute command", "执行命令"), "primary");
        confirm.id = "guide-confirm-command";
        confirm.onclick = () => {
          pendingProposal = null;
          const parsed = validateGuideProposal(proposal.command);
          if (proposal.key !== contextKey() || !parsed) {
            message(w("The robot or activity changed. Ask again before executing this action.", "机器人或活动已改变，请重新提问后再执行。"));
          } else {
            notice = null;
            addTurn("user", w("Confirmed: ", "已确认：") + proposal.command);
            executeCommand(parsed);
          }
          lastKey = ""; render();
        };
        const cancel = n("button", w("Cancel", "取消"));
        cancel.id = "guide-cancel-command";
        cancel.onclick = () => { pendingProposal = null; message(w("Proposal cancelled.", "已取消建议。")); lastKey = ""; render(); };
        card.append(confirm, cancel); body.append(card);
      }
      if (failedQuestion && !guideMenu) {
        const retry = n("button", aiPending ? w("Question saved", "问题已保存") : w("Retry saved question", "重试已保存的问题"));
        retry.id = "guide-retry-question";
        retry.disabled = aiPending;
        retry.onclick = retryQuestion;
        body.append(retry);
      }
      const transcript = n("div", null, "guide-transcript");
      transcript.setAttribute("aria-label", w("Earlier conversation", "之前的对话"));
      const earlier = state.dialogue.at(-1)?.text === line.textContent ? state.dialogue.slice(0, -1) : state.dialogue;
      for (const turn of earlier.slice(-60)) {
        const item = n("div", null, "guide-turn");
        item.dataset.role = turn.role;
        item.append(n("small", turn.role === "user" ? w("You", "你") : turn.role === "ai" ? "Pip · AI" : "Pip"), n("p", turn.text));
        transcript.append(item);
      }
      body.prepend(transcript);
      line.classList.add("guide-current-message");
      // Keep the current instruction in view; older dialogue remains above it.
      body.dataset.scrollLatest = "true";
    }
    const blocked = !!demo || !exampleHost.hidden || (state.mode === "learn" && f &&
      (!f.setup || !!f.awaiting || f.stage !== "practice"));
    if (wasBlocked && !blocked) {
      wasBlocked = false;
      api.render();
    }
    wasBlocked = blocked;
    document.body.dataset.gameDemo = String(!!demo || !exampleHost.hidden);
    document.body.dataset.typeDemo = String(!exampleHost.hidden);
    if (blocked)
      document
        .querySelectorAll(
          ".control-card button,.control-card input,.control-card select,.game-move-dock button,.game-move-dock input",
        )
        .forEach((x) => (x.disabled = true));
    if (demo) {
      const ds = demo.controller.state;
      api.renderer.update(
        ds.scene,
        { ...ds.target, valid: true },
        {
          language,
          ghost: false,
          trail: true,
          path: true,
          labels: false,
          demonstration: true,
          focusJoint: demo.commands[demo.index]?.jointIndex,
        },
      );
      $("current").textContent = Object.entries(fk(ds.scene.actualJoints).C)
        .map(([k, v]) => `${k.toUpperCase()} ${v.toFixed(1)}`)
        .join(" · ");
    } else if (wordFocus !== null) {
      api.renderer.update(c.state.scene, { ...c.state.target, valid: true }, {
        language, ghost: false, trail: false, path: false, labels: true, focusJoint: wordFocus,
      });
    }
    syncPanel();
    rendering = false;
  }
  return {
    render,
    get state() {
      return state;
    },
    restore(value) {
      aiRequestId++;
      pendingProposal = null;
      failedQuestion = value?.retryQuestion || "";
      stopDemo();
      state = value || newGameState();
      state.dialogue ??= [];
      lastNarration = "";
      guideMenu = null;
      c.sequence = Math.max(
        c.sequence,
        ...state.runs.map((a) => a.eventFloor),
        ...state.runs.flatMap((a) =>
          a.seen.map((id) => Number(id.replace("event-", "")) || 0),
        ),
      );
      lastKey = "";
    },
    onEvent(event) {
      if (["MOVE_REJECTED", "ACTION_REJECTED"].includes(event.type)) {
        lastFailure = api.get().tr("error." + event.error.code, event.error.details || {});
        message(
          api.get().tr("error." + event.error.code, event.error.details || {}),
        );
        collapsed = false;
        lastKey = "";
      } else if (
        event.type === "TARGET_EDITED" ||
        event.type === "MOVE_COMPLETED"
      ) {
        notice = null;
        lastKey = "";
      }
      if (["MOVE_COMPLETED", "GRIPPER_CHANGED", "RUN_COMPLETED"].includes(event.type)) {
        const p = fk(c.state.scene.actualJoints).C;
        const held = c.state.scene.objects.some(o => o.heldByGripper);
        const outcome = event.type === "RUN_COMPLETED"
          ? w("Program replay finished. Goal checks are shown in your activity.", "程序回放结束，目标检查结果显示在当前活动中。")
          : w(`Completed · TCP X ${p.x.toFixed(1)}, Y ${p.y.toFixed(1)}, Z ${p.z.toFixed(1)} mm. Gripper ${c.state.scene.gripperState}. Object held: ${held ? "Yes" : "No"}.`,
              `已完成 · TCP X ${p.x.toFixed(1)}、Y ${p.y.toFixed(1)}、Z ${p.z.toFixed(1)} 毫米。夹爪${c.state.scene.gripperState === "open" ? "张开" : "闭合"}。夹持物体：${held ? "是" : "否"}。`);
        addTurn("guide", outcome);
        announce.textContent = outcome;
        lastKey = "";
      }
      if (state.mode === "learn" && observeGameEvent(state, event)) {
        lastKey = "";
        save();
      }
      if (state.mode === "design" && event.type === "RUN_COMPLETED") {
        state.design.versions.push({
          label: "Test",
          at: new Date().toISOString(),
          program: structuredClone(event.program),
          scene: structuredClone(event.after),
          problem: state.design.problem,
          criteria: state.design.criteria,
          reflection: state.design.reflection,
          completed: true,
          goalVerified: false,
        });
        state.design.versions = state.design.versions.slice(-30);
      }
    },
    tick(ms) {
      frameCount++;
      const measuredNow = performance.now();
      if (measuredNow - frameStarted > 5000) {
        document.body.dataset.measuredUiFps = (
          (frameCount * 1000) /
          (measuredNow - frameStarted)
        ).toFixed(1);
        frameCount = 0;
        frameStarted = measuredNow;
      }
      if (demo) {
        demo.tick(ms);
        if (demo.done) {
          const a = activeGameAttempt(state);
          if (a?.flow?.stage === "tour" && !a.flow.watched.includes(String(state.unit)))
            a.flow.watched.push(String(state.unit));
          if (a?.assisted) a.explanationWatched = true;
          demo.dispose();
          demo = null;
          save();
          message(
            w(
              "Example complete. Continue when ready.",
              "示例完成，准备好后继续。",
            ),
          );
        }
        api.render();
      }
      if (typePlaying) {
        typeElapsed += ms;
        typeScene.draw(
          showingComparison ? "sixaxis" : TYPES[state.unit % TYPES.length],
          Math.min(typeElapsed / 12000, 1),
          w("Demonstration only", "仅演示"),
        );
        if (typeElapsed >= 12000) {
          typePlaying = false;
          typeWatched = true;
          const a = activeGameAttempt(state);
          if (a) {
            a.typeWatched = true;
            if (a.assisted) a.explanationWatched = true;
            if (a.flow?.stage === "tour" && !a.flow.watched.includes(String(state.unit)))
              a.flow.watched.push(String(state.unit));
          }
          save();
          render();
        }
      }
    },
    stopDemo,
  };
}
