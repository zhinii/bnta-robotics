import assert from "node:assert/strict";
import { practiceRoute } from "../curriculum.mjs";
import { teachingRoute } from "../planner.mjs";
const { chromium } = await import(process.env.BNTA_PLAYWRIGHT_PATH || process.argv[2] || "playwright");
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const errors = []; page.on("pageerror", e => errors.push(e.message));
  await page.route("**/api/guide/status", r => r.fulfill({ json: { configured: false } }));
  await page.goto(process.env.BNTA_PREVIEW_URL || "http://127.0.0.1:4216/beginner-3axis/");
  await page.locator('#options [data-command="lessons"]').waitFor();
  const send = async text => { await page.locator("#message").fill(text); await page.locator("#send").click(); };
  const state = () => page.evaluate(() => JSON.parse(localStorage.getItem("bnta:quest-course:v1")).course);
  const attempt = async () => { const s = await state(); return s.portfolio.find(a => a.id === s.active); };
  const ready = () => page.waitForFunction(() => !document.querySelector("#preview").disabled);
  const reset = async () => { await send("reset"); await page.locator('#options [data-command="reset confirmed"]').click(); };
  const route = async steps => {
    for (const s of steps) {
      await send(s.type === "move" ? `move ${s.targetMm.x} ${s.targetMm.y} ${s.targetMm.z}` : s.gripperState === "closed" ? "close" : "open");
      await ready();
    }
  };
  for (let number = 4; number <= 6; number++) {
    await send("lesson " + number); await send("tour"); await send("practice");
    await send("I predict that the approach and order determine whether the transfer succeeds.");
    assert.ok(await page.locator("#movement").isVisible(), "each new practice opens controls");
    if (number === 4) { await route(practiceRoute("grip", (await state()).scene)); assert.ok((await attempt()).flow.checks.lift10); }
    if (number === 5) {
      await reset(); await send("record on"); await route(teachingRoute((await state()).scene)); await send("record off"); await send("steps");
      assert.equal(await page.locator("#steps-list li").count(), 9);
      await send("step down 1"); await send("step up 2");
      await reset(); await send("run"); await send("pause"); await send("stop"); await reset(); await send("run");
      await page.waitForFunction(() => { const s = JSON.parse(localStorage.getItem("bnta:quest-course:v1")).course; return s.portfolio.find(a => a.id === s.active).flow.awaiting === "programNote"; });
      await send("I restored the start state so the same sequence could be replayed."); assert.ok((await attempt()).flow.checks.transfer);
    }
    if (number === 6) {
      await route(practiceRoute("obstacle", (await state()).scene)); assert.ok((await attempt()).flow.checks.blocked);
      assert.ok(await page.locator('#options [data-command="reflect"]').isVisible());
      await send("changed task"); await send("hint"); await send("back");
      assert.equal((await attempt()).flow.stage, "practice");
      assert.equal(await page.locator('.turn-commands [data-command^="use target"]').count(), 0);
      await send("record on"); await route(teachingRoute((await state()).scene)); await send("record off"); await reset(); await send("run");
      await page.waitForFunction(() => { const s = JSON.parse(localStorage.getItem("bnta:quest-course:v1")).course; return s.portfolio.find(a => a.id === s.active).flow.checks.deliveryB; });
    }
    await send("reflect"); await send("I checked the actual result and can explain how the steps changed it.");
    assert.equal((await attempt()).flow.stage, "complete"); console.log("Phone browser lesson " + number + " PASS");
  }
  await page.reload(); await page.locator('#options [data-command="next"]').waitFor();
  const restored = await state(); assert.equal(restored.portfolio.filter(a => a.flow.stage === "complete").length, 3);
  assert.equal(restored.program.steps.length, 9);
  assert.deepEqual(errors, []);
  console.log("Practical browser PASS: grasp, program editing, pause/stop, real replay, blocked route, unguided B, saved evidence and reload.");
} finally { await browser.close(); }
