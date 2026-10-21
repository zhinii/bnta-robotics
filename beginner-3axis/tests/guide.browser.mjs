import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
const { chromium } = await import(process.env.BNTA_PLAYWRIGHT_PATH || "playwright");
const base = process.env.BNTA_PREVIEW_URL || "http://127.0.0.1:4217/beginner-3axis/";
const output = process.env.BNTA_SCREENSHOTS;
if (output) await mkdir(output, { recursive: true });
let server, browser;
const errors = [];
try {
  if (process.env.BNTA_PYTHON_PATH) {
    server = spawn(process.env.BNTA_PYTHON_PATH, ["server/serve.py", "--port", new URL(base).port], {
      env: { ...process.env, QIANWEN_API_KEY: "" }, windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
    });
    await new Promise((resolve, reject) => {
      server.stdout.once("data", resolve);
      server.once("error", reject);
      server.once("exit", code => reject(Error("Preview server exited " + code)));
    });
  }
  browser = await chromium.launch({ channel: "msedge", headless: true, args: ["--enable-webgl", "--ignore-gpu-blocklist"] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true });
  const page = await context.newPage();
  page.on("pageerror", e => errors.push(e.message));
  await page.goto(base);
  await page.locator("#guide-connection").filter({ hasText: "Offline" }).waitFor();
  const send = async text => { await page.locator("#guide-command").fill(text); await page.locator("#guide-send").click(); };
  const geometry = async () => page.evaluate(() => {
    const box = selector => {
      const r = document.querySelector(selector).getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom, right: r.right };
    };
    return { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth,
      scene: box("#scene"), composer: box("#guide-composer"), panel: box(".game-sheets"), tabs: box(".game-panel-tabs"),
      stop: box("#game-stop"), input: box("#guide-command") };
  });
  for (const size of [{ width: 1280, height: 800 }, { width: 390, height: 844 }, { width: 320, height: 568 }, { width: 844, height: 390 }, { width: 820, height: 1180 }]) {
    await page.setViewportSize(size);
    for (const panel of ["guide", "controls", "program"]) {
      await page.locator("#game-panel-" + panel).click();
      const g = await geometry();
      assert.ok(g.scrollWidth <= size.width + 1, "horizontal overflow " + JSON.stringify(g));
      assert.ok(g.composer.bottom <= size.height + 1 && g.composer.y >= 0, "composer offscreen " + JSON.stringify(g));
      assert.ok(g.input.width >= 100, "input too small " + JSON.stringify(g));
      assert.ok(g.scene.height >= 75 && g.scene.width > 100, "scene lost " + JSON.stringify(g));
      assert.ok(g.stop.height >= 44 && g.stop.right <= size.width, "Stop inaccessible " + JSON.stringify(g));
      if (size.width <= 599) assert.ok(g.scene.bottom <= g.panel.y + 1, "scene/panel overlap");
    }
    await send("menu");
    await page.getByRole("button", { name: "All commands", exact: true }).click();
    await page.locator("#guide-command-category").selectOption("operate");
    await page.getByRole("button", { name: "Preview XYZ target…", exact: true }).click();
    assert.equal(await page.locator("#guide-command").inputValue(), "target 120 -80 100");
    await page.locator("#guide-command").fill("");
    await send("help");
    if (output) await page.screenshot({ path: `${output}/guide-${size.width}x${size.height}.png` });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#guide-command").focus();
  await page.evaluate(() => {
    Object.defineProperty(window.visualViewport, "height", { value: 390, configurable: true });
    window.visualViewport.dispatchEvent(new Event("resize"));
  });
  const keyboardGeometry = await geometry();
  assert.ok(keyboardGeometry.composer.bottom <= 391, "composer should stay above keyboard");
  assert.ok(keyboardGeometry.scene.height > 50, "keyboard should retain robot context");
  await page.evaluate(() => {
    delete window.visualViewport.height;
    document.activeElement.blur();
    window.visualViewport.dispatchEvent(new Event("resize"));
  });
  await send("language zh");
  await send("menu");
  await page.getByRole("button", { name: "所有命令", exact: true }).click();
  await page.locator("#guide-command-category").selectOption("program");
  assert.equal(await page.locator("#language").inputValue(), "zh");
  if (output) await page.screenshot({ path: `${output}/guide-phone-zh.png` });
  await send("language en");
  // Exercise the new lesson panels on a real phone-sized WebGL viewport.
  for (let lesson = 1; lesson <= 6; lesson++) {
    await send(`/lesson ${lesson}`);
    await page.locator('[data-lesson-command="begin"]').click();
    await page.locator(".lesson-progress").filter({ hasText: "1/4" }).waitFor();
    await page.locator('[data-lesson-command="word 1"]').click();
    await page.locator('[data-lesson-command="tour"]').click();
    await page.locator(".lesson-progress").filter({ hasText: "2/4" }).waitFor();
    await page.locator("#game-panel-controls").click();
    assert.equal(await page.locator(".game-sheets").getAttribute("data-active-panel"), "controls");
    await page.locator("#game-panel-guide").click();
    await page.locator('[data-lesson-command="practice"]').click();
    await page.getByRole("button", { name: "Save response", exact: true }).waitFor();
    const g = await geometry();
    assert.ok(g.composer.bottom <= 845 && g.scene.height >= 75, "lesson prompt retains input and scene");
    assert.equal(await page.locator("#game-guide textarea").count(), 0);
    await page.locator("#guide-command").fill("My prediction draft");
    await page.reload();
    await page.getByRole("button", { name: "Save response", exact: true }).waitFor();
    assert.equal(await page.locator("#guide-command").inputValue(), "My prediction draft", "draft restores on reload");
    if (lesson === 3) {
      await send("language zh");
      assert.equal(await page.locator("#guide-command").inputValue(), "My prediction draft");
      if (output) await page.screenshot({ path: `${output}/lesson-prediction-zh.png` });
      await send("language en");
    }
    await send("I predict the motion will match the observed example.");
    if (lesson === 1) {
      if (output) await page.screenshot({ path: `${output}/lesson-jobs-phone.png` });
      for (let choice = 1; choice <= 5; choice++) await send(`choose ${choice}`);
    } else {
      await send("prepare");
      await page.reload();
      await page.locator("#game-panel-guide").click();
      if (lesson === 2) {
        await page.locator('[data-lesson-command="j1 +10"]').click();
        await page.waitForFunction(() => document.getElementById("game-stop").disabled);
      }
      if (lesson === 4) {
        await page.locator(".lesson-targets summary").click();
        if (output) await page.screenshot({ path: `${output}/lesson-grip-phone.png` });
      }
    }
    if (lesson <= 2) {
      await send("reflect");
      await send("I compared my prediction with the motion and can explain the result.");
      await page.locator(".guide-current-message").filter({ hasText: "Lesson complete" }).waitFor();
    }
  }
  await send("explore");
  await send("target 150 0 140");
  await send("move");
  await page.waitForFunction(() => document.getElementById("game-stop").disabled);
  await send("why");
  await send("This is an open-ended offline question.");
  await page.locator("#guide-retry-question").waitFor({ state: "visible" });

  // A labelled test double verifies both the proposal UI and mid-session outage.
  let available = true;
  await page.route("**/api/guide/status", route => route.fulfill({ json: { configured: available, source: "qwen" } }));
  await page.route("**/api/guide", route => available
    ? route.fulfill({ json: { source: "qwen", reply: "Test provider: open your saved program?", command: "program" } })
    : route.fulfill({ status: 504, json: { error: "provider_timeout" } }));
  await page.locator("#guide-retry-question").click();
  await page.locator("#guide-confirm-command").waitFor({ state: "visible" });
  assert.equal(await page.locator(".game-sheets").getAttribute("data-active-panel"), "guide");
  await page.locator("#guide-confirm-command").click();
  assert.equal(await page.locator(".game-sheets").getAttribute("data-active-panel"), "program");
  available = false;
  await send("Explain my program in plain language.");
  await page.locator("#guide-retry-question").waitFor({ state: "visible" });
  assert.match(await page.locator("#guide-connection").textContent(), /Offline/);
  await send("controls");
  assert.equal(await page.locator(".game-sheets").getAttribute("data-active-panel"), "controls");
  assert.deepEqual(errors, []);
  console.log("Browser PASS: desktop, phone 390/320, landscape, Chinese tablet/phone; persistent composer, scrollable menu, touch targets, real motion, AI confirmation and outage fallback. No page errors.");
} finally { await browser?.close(); server?.kill(); }
