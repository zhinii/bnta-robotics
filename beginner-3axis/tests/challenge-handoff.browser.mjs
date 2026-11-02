import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {referenceProgram} from './challenge-fixtures.mjs';
import {initialWorld} from '../challenge-model.mjs';
import {ikTool} from '../challenge-kinematics.mjs';
const {chromium}=await import(process.argv[2]||process.env.BNTA_PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const out=process.argv[3]||'../../test-artifacts/contact-failure';await mkdir(out,{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true,isMobile:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('bnta:robot-challenges:v1',JSON.stringify({version:1,challengeRevision:2,passed:['easy','medium'],mode:'hard'})));
 await page.goto(process.env.BNTA_PREVIEW_URL||'http://127.0.0.1:4223/beginner-3axis/');await page.locator('#joint-5').waitFor({state:'attached'});
 const send=async s=>{await page.locator('#command').fill(s);await page.locator('#command-form button').tap();};
 const idle=()=>page.waitForFunction(()=>!document.querySelector('#record').disabled);
 const act=async step=>{await page.locator(`[data-arm="${step.arm}"]`).tap();if(step.type==='move'){await send('joints '+step.q.join(' '));await send('move');}else await send(step.type);await idle();};
 const load=async steps=>{await page.locator('#file').setInputFiles({name:'handoff.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,mode:'hard',steps}))});await page.waitForFunction(()=>document.querySelector('#feedback').textContent.includes('Program restored'));};
 const route=referenceProgram('hard');
 // An awkward, offset pickup can be executed and recorded without snapping.
 await page.locator('#record').tap();const start=initialWorld('hard'),q=ikTool([100,-127,103],start.arms[0].q,'nearest',[20,10,25]).q;
 await act({type:'move',arm:'A',q,kind:'joints'});await act({type:'close',arm:'A'});assert.match(await page.locator('#checks').textContent(),/Holding: Arm A/);assert.equal(await page.locator('#step-count').textContent(),'2');assert.equal(await page.locator('#task-card').isVisible(),false);
 await page.screenshot({path:out+'/angled-pickup.png'});
 // Manual failure is saved, including the action which caused it.
 await page.locator('#reset').tap();await page.locator('#record').tap();for(const step of route.slice(0,6))await act(step);
 assert.match(await page.locator('#checks').textContent(),/Holding: A \+ B/);await act(route[8]);
 assert.equal(await page.locator('#failure').isVisible(),true);assert.match(await page.locator('#failure-reason').textContent(),/both arms were gripping/);assert.equal(await page.locator('#step-count').textContent(),'7');assert.equal(await page.locator('#record').getAttribute('aria-pressed'),'false');assert.equal(await page.locator('#move').isDisabled(),true);assert.equal(await page.locator('[data-action="close"]').isDisabled(),true);assert.equal(await page.locator('#completion').isVisible(),false);
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('bnta:robot-challenges:v1')).programs.hard);assert.deepEqual(stored,[...route.slice(0,6),route[8]]);
 await page.screenshot({path:out+'/manual-drop-en.png'});await page.locator('#language').selectOption('zh');assert.match(await page.locator('#failure-reason').textContent(),/零件掉落.*共同夹持/);await page.setViewportSize({width:768,height:1024});await page.screenshot({path:out+'/manual-drop-zh-portrait.png'});await page.locator('#language').selectOption('en');
 await page.locator('#restart').tap();assert.equal(await page.locator('#failure').isVisible(),false);assert.equal(await page.locator('#task-card').isVisible(),true);assert.equal(await page.locator('#step-count').textContent(),'7');
 // The same failed recording replays to the same action and freezes the timer.
 await page.locator('#run').tap();await page.waitForFunction(()=>document.querySelector('#timer-status').dataset.status==='timerFailed');assert.equal(await page.locator('#replay-actions').textContent(),'6 / 7');await send('program');assert.equal(await page.locator('#steps li.step-error').count(),1);assert.match(await page.locator('#feedback').textContent(),/Step 7: Part dropped/);
 const stopped=await page.locator('#replay-time').textContent();await page.waitForTimeout(200);assert.equal(await page.locator('#replay-time').textContent(),stopped);assert.equal(await page.locator('#next').isDisabled(),true);
 // No Close command, and a Close at the wrong location, both lead to a drop.
 for(const steps of [[...route.slice(0,5),route[6]],[...route.slice(0,4),{type:'close',arm:'B'},route[6]]]){
  await load(steps);await page.locator('#run').tap();await page.waitForFunction(()=>document.querySelector('#timer-status').dataset.status==='timerFailed');assert.match(await page.locator('#failure-reason').textContent(),/released without support/);assert.equal(await page.locator('#completion').isVisible(),false);
 }
 // A complete successful recording still requires replay to pass.
 await page.locator('#restart').tap();await send('controls');await page.locator('#record').tap();for(const step of route)await act(step);assert.equal(await page.locator('#completion').isVisible(),false);await page.locator('#record').tap();await page.locator('#run').tap();await page.locator('#completion').waitFor({state:'visible',timeout:25000});assert.equal(await page.locator('#replay-actions').textContent(),'11 / 11');assert.equal(await page.locator('#timer-status').getAttribute('data-status'),'timerComplete');await page.screenshot({path:out+'/successful-handoff.png'});
 await load([...route.slice(0,5),{type:'handoff',arm:'A'},...route.slice(7)]);assert.equal(await page.locator('#steps li').count(),11);assert.match(await page.locator('#steps li').nth(5).textContent(),/Arm BClose/);assert.match(await page.locator('#steps li').nth(6).textContent(),/Arm AOpen/);
 assert.deepEqual(errors,[]);console.log('Handoff browser PASS: angled pickup, recorded manual drop, bilingual restart, replay of missing/failed grip and missing release, frozen failure metrics, successful full recording/replay, legacy file migration.');
}finally{await browser.close();}
