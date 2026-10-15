import { radiansToDegrees } from "./model.mjs";

const titles = {
  "Source approach": ["Approach the part", "接近零件"],
  Pickup: ["Reach the pickup point", "到达抓取点"],
  "Lift to clearance": ["Lift to clearance height", "抬到净空高度"],
  "Transfer above destination": ["Carry to the destination", "搬到目标上方"],
  "Destination approach": ["Approach the destination", "接近目标"],
  Place: ["Reach the placement point", "到达放置点"],
  Retreat: ["Move away", "撤离"],
  "Lift 10 mm": ["Lift 10 mm", "抬高10毫米"],
  "+10 mm Z": ["Raise Z by 10 mm", "Z升高10毫米"],
  "Test direct route": ["Test the blocked route", "测试受阻路线"],
};
export function demoStep(command, language = "en") {
  const zh = language === "zh";
  const labels = {
    target: ["Enter XYZ · preview only", "输入XYZ · 仅预览"],
    reset: ["Reset · keep saved steps", "重置 · 保留步骤"],
    record: command.enabled
      ? ["Record ON", "开启录制"]
      : ["Record OFF", "关闭录制"],
    run: ["Run the saved program", "运行已保存程序"],
  };
  if (labels[command.type])
    return {
      title: labels[command.type][zh ? 1 : 0],
      detail: command.targetMm
        ? ["x", "y", "z"]
            .map((k) => `${k.toUpperCase()} ${command.targetMm[k].toFixed(1)}`)
            .join(" · ") + " mm"
        : "",
    };
  if (command.type === "gripper")
    return {
      title:
        command.gripperState === "closed"
          ? zh
            ? "闭合夹爪"
            : "Close the gripper"
          : zh
            ? "张开夹爪"
            : "Open the gripper",
      detail: zh
        ? "夹爪动作，不是新的定位轴"
        : "Gripper action; no positioning joint moves",
    };
  if (command.type === "jointDemo")
    return {
      title: zh
        ? `转动 J${command.jointIndex + 1}`
        : `Turn J${command.jointIndex + 1}`,
      detail: `${radiansToDegrees(command.angleRad).toFixed(0)}°`,
    };
  return {
    title:
      (command.type === "move" ? (zh ? "移动 · " : "Move · ") : "") +
      (titles[command.name]?.[zh ? 1 : 0] ?? command.name),
    detail: command.targetMm
      ? ["x", "y", "z"]
          .map((k) => `${k.toUpperCase()} ${command.targetMm[k].toFixed(1)}`)
          .join(" · ") + " mm"
      : "",
  };
}

/** A read-only sequence, synchronised to the actual demo command index. */
export function createDemoSequence(id) {
  const root = document.createElement("section");
  root.className = "demo-sequence";
  root.id = id;
  const status = document.createElement("p"),
    list = document.createElement("ol");
  status.className = "demo-step-status";
  status.setAttribute("role", "status");
  list.setAttribute("aria-label", "Example steps");
  root.append(status, list);
  let signature = "",
    previous = "",
    rows = [];
  return {
    root,
    update(steps, index, state = "ready", language = "en") {
      root.dataset.state = state;
      const zh = language === "zh";
      const key = JSON.stringify([steps, language]);
      if (signature !== key) {
        signature = key;
        list.replaceChildren();
        list.setAttribute("aria-label", zh ? "示例步骤" : "Example steps");
        rows = steps.map((step, i) => {
          const li = document.createElement("li"),
            n = document.createElement("span"),
            body = document.createElement("div"),
            title = document.createElement("strong"),
            detail = document.createElement("small");
          n.className = "demo-step-number";
          n.textContent = String(i + 1);
          title.textContent = step.title;
          detail.textContent = step.detail;
          body.append(title, detail);
          li.append(n, body);
          list.append(li);
          return li;
        });
      }
      const current = Math.max(0, Math.min(index, steps.length - 1));
      const message =
        state === "ready"
          ? zh
            ? "示例步骤 · 按“观看示例”开始"
            : "Example steps · press Watch example"
          : state === "done"
            ? zh
              ? "✓ 示例完成"
              : "✓ Example complete"
            : state === "stopped"
              ? zh
                ? "示例已停止"
                : "Example stopped"
              : `${zh ? "当前步骤" : "NOW"} ${current + 1} / ${steps.length} · ${steps[current]?.title ?? ""}`;
      if (status.textContent !== message) status.textContent = message;
      rows.forEach((row, i) => {
        row.dataset.state =
          state === "done" || i < index
            ? "complete"
            : i === index && state === "playing"
              ? "current"
              : "pending";
        row.setAttribute(
          "aria-current",
          row.dataset.state === "current" ? "step" : "false",
        );
      });
      const token = `${key}:${index}:${state}`;
      if (previous !== token && state === "playing" && rows[current]) {
        const row = rows[current];
        const rail = root.closest(".demo-focus-body");
        if (
          rail &&
          rail.scrollHeight > rail.clientHeight &&
          rail.clientHeight > 0
        ) {
          const rect = row.getBoundingClientRect(),
            bounds = rail.getBoundingClientRect();
          if (rect.bottom > bounds.bottom)
            rail.scrollTop += rect.bottom - bounds.bottom + 6;
          else if (rect.top < bounds.top + 44)
            rail.scrollTop -= bounds.top + 44 - rect.top + 6;
        }
        // Scroll only the list; never move the lesson or robot out of view.
        if (row.offsetTop < list.scrollTop) list.scrollTop = row.offsetTop;
        else if (
          row.offsetTop + row.offsetHeight >
          list.scrollTop + list.clientHeight
        )
          list.scrollTop = row.offsetTop + row.offsetHeight - list.clientHeight;
      }
      previous = token;
    },
  };
}
