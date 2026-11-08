import {operate,replay,record} from './challenge-browser-helpers.mjs';
import {enterChallenge} from './challenge-browser-helpers.mjs';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {referenceProgram} from './challenge-fixtures.mjs';
import {initialWorld,applyAction} from '../challenge-model.mjs';
const {chromium}=await import(process.env.BNTA_PLAYWRIGHT_PATH||process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:850}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BNTA_PREVIEW_URL||'http://127.0.0.1:4223/beginner-3axis/');
 await page.locator('#joint-0').waitFor({state:'attached'});
 await enterChallenge(page,'easy');
 const send=s=>operate(page,s);
 const recordButton=page.locator('#record');assert.equal(await recordButton.getAttribute('aria-pressed'),'false');
 await record(page);assert.equal(await recordButton.getAttribute('aria-pressed'),'true');
 await send('target 147 -85 80');assert.equal(await page.locator('#step-count').textContent(),'0');
 await send('close');assert.equal(await page.locator('#step-count').textContent(),'0','rejected grips are not recorded');
 const route=referenceProgram('easy');let world=initialWorld(),duration=0;
 for(const step of route){
  const result=applyAction(world,step);world=result.end;duration+=result.duration;
  if(step.type==='move'){await send('joints '+step.q.join(' '));await send('move');}else await send(step.type);
  await page.waitForFunction(()=>!document.querySelector('#move').disabled);
 }
 assert.equal(await page.locator('#step-count').textContent(),String(route.length));
 assert.equal(await page.locator('#replay-time').textContent(),'0.00 s','manual recording is not replay timing');
 await record(page);await send('program');await replay(page);
 await page.waitForFunction(()=>parseFloat(document.querySelector('#replay-time').textContent)>0);
 await page.locator('#pause').click();const paused=await page.locator('#replay-time').textContent();
 await page.waitForTimeout(350);assert.equal(await page.locator('#replay-time').textContent(),paused);
 await page.locator('#pause').click();await page.waitForFunction(()=>!document.querySelector('#run').disabled);
 assert.equal(await page.locator('#replay-time').textContent(),(duration/1000).toFixed(2)+' s');
 assert.equal(await page.locator('#replay-moves').textContent(),'5 / 5');
 assert.equal(await page.locator('#replay-actions').textContent(),'7 / 7');
 assert.equal(await page.locator('#timer-status').getAttribute('data-status'),'timerComplete');
 assert.equal(await page.locator('.step-duration').count(),7);
 await page.locator('#language').selectOption('zh');assert.match(await recordButton.textContent(),/录制/);assert.match(await page.locator('#timer-status').textContent(),/有效成绩/);
 await page.locator('#language').selectOption('en');
 if(process.argv[3]){await mkdir(process.argv[3],{recursive:true});await page.screenshot({path:process.argv[3]+'/replay-result.png'});}
 await record(page);assert.equal(await page.locator('#step-count').textContent(),'0');assert.equal(await page.locator('#replay-time').textContent(),'0.00 s');
 await send('target 147 -85 130');await send('move');await page.locator('#stop').click();assert.equal(await page.locator('#step-count').textContent(),'0','interrupted movement is not a completed recorded move');
 await enterChallenge(page,'hard');
 for(const mode of ['easy','medium','hard']){
  await page.locator(`[data-mode="${mode}"]`).click();await page.setViewportSize({width:1280,height:850});
  if(process.argv[3])await page.screenshot({path:process.argv[3]+'/'+mode+'-detail.png'});
  await page.setViewportSize({width:390,height:844});
  for(const id of ['record','move','stop']){const box=await page.locator('#'+id).boundingBox();assert.ok(box&&box.height>=44,id+' accessible touch control on phone');}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if(process.argv[3])await page.screenshot({path:process.argv[3]+'/'+mode+'-phone.png'});
 }
 assert.deepEqual(errors,[]);console.log('Record browser PASS: full manual capture, excluded previews/rejections, exact replay timing, pause, move/action counts, bilingual result, fresh attempt, interrupted move, phone dashboard and 3D rendering.');
}finally{await browser.close();}
