import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const { chromium } = await import(process.env.BNTA_PLAYWRIGHT_PATH || process.argv[2] || "playwright");
const url = process.env.BNTA_PREVIEW_URL || "http://127.0.0.1:4216/beginner-3axis/", out = process.env.BNTA_SCREENSHOTS || process.argv[3];
if (out) await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true, acceptDownloads: true });
  const page = await context.newPage(), errors = []; page.on("pageerror", e => errors.push(e.message));
  let ai = false, failAI = false, calls = 0;
  await page.route("**/api/guide/status", r => r.fulfill({ json: { configured: ai } }));
  await page.route("**/api/guide", r => { calls++; return failAI ? r.fulfill({ status: 503, json: { error: "unavailable" } }) : r.fulfill({ json: { source: "qwen", reply: "Preview the requested position first.", command: "target 150 0 140" } }); });
  await page.goto(url); await page.locator("#conversation").getByText("Welcome to Robot Lab.", { exact: false }).waitFor();
  const send = async text => { await page.locator("#message").fill(text); await page.locator("#send").click(); };
  const click = async command => page.locator(`#options [data-command="${command}"]`).click();
  const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem("bnta:quest-course:v1")));
  const attempt = async () => { const s = (await saved()).course; return s.portfolio.find(a => a.id === s.active); };
  await click("lessons"); await click("lesson 1"); await click("word 3");
  assert.ok(await page.locator(".quest-visual canvas").isVisible());
  await click("tour"); await click("next"); await click("back");
  await click("practice"); await click("robot 4"); await click("reflect");
  await send("I compared rotating arms with sliding rails."); assert.equal((await attempt()).flow.stage, "complete");
  await click("next"); await click("tour"); await click("practice");
  await page.locator("#message").fill("All links above J1 turn together.");
  await page.reload(); await page.locator("#message").waitFor();
  await page.waitForFunction(() => document.querySelector("#message").value.includes("All links"));
  await send("/ask Can you help?"); assert.equal((await saved()).draft, "All links above J1 turn together.");
  await send("cancel"); await send("answer"); await page.locator("#language").selectOption("zh");
  assert.equal(await page.locator("#message").inputValue(), "All links above J1 turn together.");
  await send("J1上方的连杆一起转动。"); await click("j1 +10");
  await page.waitForFunction(() => { const s = JSON.parse(localStorage.getItem("bnta:quest-course:v1")).course; return s.portfolio.find(a => a.id === s.active).flow.checks.j1; });
  await click("reflect"); await send("底座支撑机械臂，关节驱动连杆。");
  await click("next"); await send("导览"); await send("下一步"); await click("practice"); await send("Z增加，工具上移，多个关节会变化。");
  const z = Number(await page.locator("#z").inputValue()); await page.locator("#z").fill((z + 10).toFixed(2));
  await page.locator('#target-form button[type="submit"]').click();
  await page.waitForFunction(() => document.querySelector("#conversation").textContent.includes("你的实际移动：位移 10.00")).catch(async error => {
    throw new Error(error.message + "\n" + (await page.locator("#conversation").textContent()).slice(-2600) + "\n" + JSON.stringify(await attempt()));
  });
  await click("reflect"); await send("工具沿直线移动，但多个关节一起变化。");
  for (const size of [{ width: 1280, height: 800 }, { width: 390, height: 844 }, { width: 320, height: 568 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(size); await send("菜单");
    for (let i = 0; i < 2; i++) {
      const bounds = await page.evaluate(() => ({ composer: document.querySelector("#composer").getBoundingClientRect().bottom, width: document.documentElement.scrollWidth, scene: document.querySelector("#scene").getBoundingClientRect().height }));
      assert.ok(bounds.composer <= size.height + 1 && bounds.width <= size.width + 1 && bounds.scene >= 100, JSON.stringify(bounds));
      assert.ok(await page.locator("#message").isVisible()); await page.locator("#chat-toggle").click();
    }
    if (out) await page.screenshot({ path: out + "/course-" + size.width + ".png" });
  }
  await page.setViewportSize({ width: 390, height: 844 }); await send("课程 4"); await send("practice");
  await page.locator("#message").fill("Open jaws leave space around the part.");
  await page.evaluate(() => { Object.defineProperty(visualViewport, "height", { value: 390, configurable: true }); visualViewport.dispatchEvent(new Event("resize")); });
  assert.ok((await page.locator("#composer").boundingBox()).y < 350);
  ai = true; await page.reload(); await page.waitForFunction(() => document.querySelector("#chat-state").textContent.includes("AI"));
  await send("/ask Preview a point"); await click("confirm");
  assert.equal((await attempt()).prediction, "", "AI confirmation cannot submit an answer");
  assert.equal((await saved()).draft, "Open jaws leave space around the part.");
  failAI = true; await send("/ask Explain again");
  await page.locator("#conversation").getByText("助手暂不可用。", { exact: false }).waitFor();
  assert.equal((await saved()).draft, "Open jaws leave space around the part.");
  await send("张开夹爪留出接近空间。"); await send("停止"); assert.equal((await attempt()).flow.setup, true);
  await send("菜单"); const downloadEvent = page.waitForEvent("download"); await click("save"); const download = await downloadEvent;
  assert.equal(download.suggestedFilename(), "robot-lab-progress.json"); assert.equal(calls, 2);
  assert.deepEqual(errors, []);
  console.log("Course browser PASS: real WebGL types and arm, lessons 1–3 completed, lesson 4 draft/reload, EN/ZH, AI confirmation/outage, export, four layouts and keyboard viewport. No page errors.");
} finally { await browser.close(); }
