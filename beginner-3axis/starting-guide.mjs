// A brief first-visit welcome; never changes a scene or learner evidence.
export function createStartingGuides({ get, storage }) {
  if (storage === undefined) {
    try { storage = globalThis.localStorage; } catch { storage = null; }
  }
  const key = "robot-lab-3axis.welcome.v2";
  let dismissed = false;
  try { dismissed = storage?.getItem(key) === "seen"; } catch { /* Optional preference. */ }
  const node = (tag, id) => {
    const element = document.createElement(tag);
    if (id) element.id = id;
    return element;
  };
  const card = node("section", "welcome-overview");
  card.className = "welcome-overview";
  card.setAttribute("aria-labelledby", "welcome-title");
  const title = node("h2", "welcome-title");
  const label = node("label");
  label.textContent = "Language / 语言";
  const select = node("select", "welcome-language");
  for (const [value, text] of [["en", "English"], ["zh", "简体中文"]]) {
    const option = node("option");
    option.value = value;
    option.textContent = text;
    select.append(option);
  }
  label.append(select);
  select.onchange = () => {
    const original = document.getElementById("language");
    original.value = select.value;
    original.dispatchEvent(new Event("change", { bubbles: true }));
  };
  const list = node("ul");
  const action = node("button", "welcome-continue");
  action.className = "primary";
  action.onclick = () => {
    dismissed = true;
    card.hidden = true;
    try { storage?.setItem(key, "seen"); } catch { /* Session still works. */ }
    document.getElementById("plus-z")?.focus();
  };
  const heading = node("div");
  heading.className = "welcome-heading";
  heading.append(title, label);
  card.append(heading, list, action);
  document.getElementById("exercise-bar").before(card);
  let previous = "";
  return {
    render() {
      const { language, mode } = get();
      card.hidden = dismissed || mode === "learn";
      if (language === previous) return;
      previous = language;
      const zh = language === "zh";
      select.value = zh ? "zh" : "en";
      title.textContent = zh ? "欢迎来到 Robot Lab" : "Welcome to Robot Lab";
      action.textContent = zh ? "开始探索" : "Start exploring";
      const items = zh
        ? ["探索：控制三轴机械臂和夹爪。", "学习：通过短课、示例和练习认识机器人。", "编程与保存：录制动作、测试程序，用 JSON 导入或导出进度。"]
        : ["Explore: control a three-axis arm and gripper.", "Learn: short lessons, examples and exercises.", "Program & save: record moves, test sequences, and import or export progress as JSON."];
      list.replaceChildren(...items.map(text => { const li = node("li"); li.textContent = text; return li; }));
    },
  };
}
