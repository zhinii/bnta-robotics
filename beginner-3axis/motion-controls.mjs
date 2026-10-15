import { CONFIG, radiansToDegrees, degreesToRadians } from "./model.mjs";

// Shared movement UI for exploration and practical lesson work.
export function createMotionControls({
  root,
  coordinates,
  move,
  heading,
  c,
  report,
  preview,
  prefix = "",
}) {
  const make = (tag, cls) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  };
  let mode = "xyz",
    language = "en",
    locked = false,
    poseKey = "";
  const bar = make("nav", "motion-mode-bar");
  const note = make("p", "motion-mode-note");
  const joints = make("section", "joint-mode-controls");
  const jog = make("section", "jog-mode-controls");
  const tabs = {};
  for (const id of ["xyz", "joints", "jog"]) {
    const b = make("button");
    b.id = `${prefix}mode-${id}`;
    b.onclick = () => {
      mode = id;
      poseKey = "";
      update(language, locked);
    };
    bar.append(b);
    tabs[id] = b;
  }
  (heading || coordinates).before(bar, note);
  coordinates.after(joints, jog);
  const jointRows = CONFIG.limits.map((limits, i) => {
    const row = make("div", "motion-joint-row");
    const label = make("label");
    const range = make("input");
    const number = make("input");
    const go = make("button");
    range.type = "range";
    number.type = "number";
    number.id = `${prefix}joint-${i + 1}`;
    range.id = `${prefix}joint-slider-${i + 1}`;
    label.htmlFor = number.id;
    label.textContent = `J${i + 1} °`;
    for (const input of [range, number]) {
      input.min = radiansToDegrees(limits[0]);
      input.max = radiansToDegrees(limits[1]);
      input.step = "0.1";
      input.setAttribute("aria-label", `J${i + 1} °`);
    }
    range.oninput = () => {
      number.value = range.value;
    };
    number.oninput = () => {
      range.value = number.value;
    };
    go.id = `${prefix}joint-go-${i + 1}`;
    go.onclick = () =>
      report(
        c.moveJoint(
          i,
          number.value.trim() ? degreesToRadians(Number(number.value)) : NaN,
        ),
      );
    row.append(label, range, number, go);
    joints.append(row);
    return { range, number, go };
  });
  const jogHead = make("label", "jog-step");
  const jogText = make("span");
  const step = make("select");
  step.id = `${prefix}jog-step`;
  for (const n of [1, 5, 10]) {
    const option = make("option");
    option.value = n;
    option.textContent = `${n} mm`;
    step.append(option);
  }
  step.value = "5";
  jogHead.append(jogText, step);
  const pad = make("div", "jog-pad");
  const directions = [
    ["y", 1, "↑ Y+"],
    ["x", -1, "← X−"],
    ["x", 1, "X+ →"],
    ["y", -1, "↓ Y−"],
    ["z", 1, "↑ Z+"],
    ["z", -1, "↓ Z−"],
  ];
  for (const [axis, sign, text] of directions) {
    const button = make("button", `jog-${axis}${sign > 0 ? "plus" : "minus"}`);
    button.id = `${prefix}jog-${axis}-${sign > 0 ? "plus" : "minus"}`;
    button.textContent = text;
    button.onclick = () => report(c.jog(axis, sign * Number(step.value)));
    pad.append(button);
  }
  jog.append(jogHead, pad);
  function update(lang, disabled = false) {
    language = lang;
    locked = disabled;
    const zh = lang === "zh";
    const names = zh
      ? ["XYZ 坐标", "关节", "方向键"]
      : ["XYZ", "Joints", "Jog"];
    bar.setAttribute("aria-label", zh ? "移动方式" : "Movement mode");
    Object.entries(tabs).forEach(([id, b], i) => {
      b.textContent = names[i];
      b.setAttribute("aria-pressed", String(mode === id));
      b.disabled = disabled;
    });
    note.textContent =
      mode === "xyz"
        ? zh
          ? "世界坐标 · 毫米。输入目标，再按移动。"
          : "World position · mm. Set a target, then Move."
        : mode === "joints"
          ? zh
            ? "关节角度 · 度。每次转动一个关节。"
            : "Joint angles · degrees. Rotate one joint at a time."
          : zh
            ? "每按一次移动一格，沿世界坐标轴移动。"
            : "Each tap moves one step along a world axis.";
    coordinates.hidden = mode !== "xyz";
    if (heading) heading.hidden = mode !== "xyz";
    move.hidden = mode !== "xyz";
    joints.hidden = mode !== "joints";
    jog.hidden = mode !== "jog";
    jogText.textContent = zh ? "步长" : "Step";
    const key = c.state.scene.actualJoints.join(",");
    if (poseKey !== key) {
      poseKey = key;
      jointRows.forEach(({ range, number }, i) => {
        range.value = number.value = radiansToDegrees(
          c.state.scene.actualJoints[i],
        ).toFixed(1);
      });
    }
    jointRows.forEach(({ go }, i) => {
      go.textContent = zh ? "移动" : "Move";
      go.setAttribute(
        "aria-label",
        `${zh ? "移动关节" : "Move joint"} ${i + 1}`,
      );
    });
    joints
      .querySelectorAll("input,button")
      .forEach((e) => (e.disabled = disabled));
    jog
      .querySelectorAll("button,select")
      .forEach((e) => (e.disabled = disabled));
  }
  update("en");
  return { update };
}
