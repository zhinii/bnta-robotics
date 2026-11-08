import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {operate,record,replay} from './challenge-browser-helpers.mjs';
import {referenceProgram} from './challenge-fixtures.mjs';
const {chromium}=await import(process.env.BNTA_PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const out=process.env.BNTA_SCREENSHOTS||'../../test-artifacts/gripper-collisions';await mkdir(out,{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true,isMobile:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BNTA_PREVIEW_URL||'http://127.0.0.1:4225/beginner-3axis/');await page.locator('#joint-5').waitFor();
 const idle=()=>page.waitForFunction(()=>!document.querySelector('#record').disabled);
 for(const axes of [3,6]){
  await page.locator(`[data-robot-axes="${axes}"]`).click();await record(page);
  // Close on empty space, then try to drive the closed fingers into Block 1.
  await operate(page,'close');await idle();const actual=await page.locator('#tcp').textContent(),objects=await page.locator('#task-positions').textContent();
  await operate(page,`target 150 -70 ${axes===3?24:16}`);
  assert.match(await page.locator('#preview-state').textContent(),/Collision/);
  assert.equal(await page.locator('#target-tcp').evaluate(el=>el.classList.contains('invalid')),true);
  await operate(page,'move');await idle();assert.match(await page.locator('#feedback').textContent(),/Collision/);
  assert.equal(await page.locator('#tcp').textContent(),actual);assert.equal(await page.locator('#task-positions').textContent(),objects);assert.equal(await page.locator('#step-count').textContent(),'1');
  await page.screenshot({path:`${out}/${axes}-axis-blocked-en.png`});
  await page.locator('#language').selectOption('zh');assert.match(await page.locator('#preview-state').textContent(),/不能穿过物体/);assert.match(await page.locator('#feedback').textContent(),/碰撞/);
  await page.screenshot({path:`${out}/${axes}-axis-blocked-zh.png`});await page.locator('#language').selectOption('en');
  // An imported/authored collision cannot bypass the same checks during replay.
  await page.locator('#add-move').click();await record(page);await replay(page);
  assert.equal(await page.locator('#timer-status').getAttribute('data-status'),'timerInvalid');assert.match(await page.locator('#feedback').textContent(),/Step 2: Collision/);assert.equal(await page.locator('#replay-actions').textContent(),'0 / 2');assert.equal(await page.locator('#completion').isVisible(),false);
  // Real open-jaw approaches still pick, carry, release, and replay successfully.
  const steps=referenceProgram('explore',axes);await page.locator('#file').setInputFiles({name:'safe.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,mode:'explore',axes,steps}))});
  await page.waitForFunction(n=>document.querySelector('#step-count').textContent===String(n),steps.length);await replay(page);await page.waitForFunction(()=>document.querySelector('#timer-status').dataset.status==='timerFinished');assert.equal(await page.locator('#replay-actions').textContent(),`${steps.length} / ${steps.length}`);
 }
 // The endpoint is clear, but a direct sideways approach crosses a finger into
 // the object. The move is rejected before motion and before any recording.
 await page.locator('[data-mode="easy"]').click();await record(page);const before=await page.locator('#tcp').textContent();await operate(page,'target 147 -85 80');await operate(page,'move');
 assert.match(await page.locator('#feedback').textContent(),/Collision/);assert.equal(await page.locator('#tcp').textContent(),before);assert.equal(await page.locator('#step-count').textContent(),'0');
 assert.deepEqual(errors,[]);console.log('Collision browser PASS: both robot types reject closed-finger penetration; red bilingual preview/error; actual pose/objects/recording unchanged; replay cannot bypass collisions; safe pickup/release works; clear-endpoint path collision blocked.');
}finally{await browser.close();}
