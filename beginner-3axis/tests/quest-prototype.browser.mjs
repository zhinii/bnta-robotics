import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const { chromium } = await import(process.env.BNTA_PLAYWRIGHT_PATH || process.argv[2] || "playwright");
const url = process.env.BNTA_PREVIEW_URL || "http://127.0.0.1:4216/beginner-3axis/quest-prototype.html";
const out = process.env.BNTA_SCREENSHOTS;
if (out) await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, hasTouch: true });
  const errors = []; page.on("pageerror", e => errors.push(e.message));
  await page.goto(url);
  const send = async text => { await page.locator("#message").fill(text); await page.locator("#send").click(); };
  await page.locator("#options button").first().waitFor();
  await send("help"); await page.locator('#options [data-command="try prompt"]').click();
  await page.locator("#message").fill("My draft");
  await send("/ask hello");
  assert.equal(await page.locator("#message").inputValue(), "My draft");
  await send("cancel"); await send("answer");
  assert.equal(await page.locator("#message").inputValue(), "My draft");
  await page.locator("#language").selectOption("zh");
  assert.equal(await page.locator("#message").inputValue(), "My draft");
  await send("我的原型回答"); await send("自由探索");
  await send("目标 150 0 140"); await send("录制 开"); await send("移动");
  await page.waitForFunction(() => document.querySelector("#actual").textContent.includes("Z 140.0"));
  await send("录制 关"); await send("步骤");
  assert.equal(await page.locator("#steps-list li").count(), 1);
  await send("重置"); await page.locator('#options [data-command="reset confirmed"]').click();
  await send("运行"); await send("暂停"); await send("停止");
  await send("重置"); await page.locator('#options [data-command="reset confirmed"]').click();
  await send("运行");
  await page.locator("#conversation").getByText("回放完成。", { exact: true }).waitFor({ state: "attached" });
  await send("language en"); await send("menu");
  for (const size of [{ width: 1280, height: 800 }, { width: 390, height: 844 }, { width: 320, height: 568 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(size);
    for (const collapsed of [false, true]) {
      if ((await page.locator("#chat-toggle").getAttribute("aria-expanded") === "false") !== collapsed) await page.locator("#chat-toggle").click();
      const geometry = await page.evaluate(() => {
        const c = document.querySelector("#composer").getBoundingClientRect(), s = document.querySelector("#scene").getBoundingClientRect();
        return { bottom: c.bottom, width: document.documentElement.scrollWidth, scene: s.height };
      });
      assert.ok(geometry.bottom <= size.height + 1 && geometry.width <= size.width + 1, JSON.stringify(geometry));
      assert.ok(geometry.scene >= 100);
      assert.ok(await page.locator("#message").isVisible());
    }
    await page.locator("#chat-toggle").click();
    if (out) await page.screenshot({ path: out + "/prototype-" + size.width + ".png" });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await send("try prompt"); await page.locator("#message").focus();
  await page.evaluate(() => { Object.defineProperty(visualViewport, "height", { value: 390, configurable: true }); visualViewport.dispatchEvent(new Event("resize")); });
  assert.ok((await page.locator("#composer").boundingBox()).y < 350);
  assert.deepEqual(errors, []);
  console.log("Prototype browser PASS: real movement, recording, replay, pause/stop, paired commands, draft preservation, all four layouts, collapse, input and keyboard viewport. No page errors.");
} finally { await browser.close(); }
