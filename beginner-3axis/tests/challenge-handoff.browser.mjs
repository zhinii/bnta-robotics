import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {referenceProgram} from './challenge-fixtures.mjs';
const {chromium}=await import(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:850}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4223/beginner-3axis/');await page.locator('#joint-0').waitFor({state:'attached'});
 const send=async s=>{await page.locator('#command').fill(s);await page.locator('#command-form button').click();};
 const act=async step=>{await page.locator(`[data-arm="${step.arm}"]`).click();if(step.type==='move'){await send('joints '+step.q.join(' '));await send('move');}else await send(step.type);await page.waitForFunction(()=>!document.querySelector('#move').disabled);};
 await send('hard');assert.equal(await page.locator('#handoff').count(),0);await page.locator('#record').click();const route=referenceProgram('hard');
 for(const step of route.slice(0,6))await act(step);
 assert.match(await page.locator('#checks').textContent(),/Holding: A \+ B/);assert.equal(await page.locator('#step-count').textContent(),'6');
 const heldTCP=await page.locator('#tcp').textContent();await act(route[8]);
 assert.match(await page.locator('#feedback').textContent(),/Error: both arms/);assert.equal(await page.locator('#tcp').textContent(),heldTCP);assert.equal(await page.locator('#step-count').textContent(),'6');
 await page.locator('#language').selectOption('zh');assert.match(await page.locator('#feedback').textContent(),/错误：两臂/);await page.locator('#language').selectOption('en');
 if(process.argv[3]){await mkdir(process.argv[3],{recursive:true});await page.screenshot({path:process.argv[3]+'/manual-shared-grip-error.png'});}
 await act(route[6]);assert.match(await page.locator('#checks').textContent(),/Holding: Arm B/);
 for(const step of route.slice(8))await act(step);assert.equal(await page.locator('#completion').isVisible(),true);
 await page.locator('#record').click();await send('program');
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('bnta:robot-challenges:v1')).programs.hard);
 assert.equal(stored.length,10);assert.deepEqual(stored.slice(5,7),[{type:'close',arm:'B'},{type:'open',arm:'A'}]);
 await page.locator('#run').click();await page.waitForFunction(()=>!document.querySelector('#run').disabled);assert.equal(await page.locator('#timer-status').getAttribute('data-status'),'timerComplete');assert.equal(await page.locator('#replay-actions').textContent(),'10 / 10');
 // Remove A's release. The replay must reach the shared grip and stop on step 7.
 const bad=[...route.slice(0,6),route[8]];
 const load=async steps=>{await page.locator('#file').setInputFiles({name:'handoff.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,mode:'hard',steps}))});await page.waitForFunction(()=>document.querySelector('#feedback').textContent.includes('Program restored'));};
 await load(bad);await page.locator('#run').click();await page.waitForFunction(()=>document.querySelector('#feedback').textContent.includes('Step 7: Error'));
 assert.match(await page.locator('#checks').textContent(),/Holding: A \+ B/);assert.equal(await page.locator('#steps li.step-error').count(),1);assert.equal(await page.locator('#replay-actions').textContent(),'6 / 7');assert.equal(await page.locator('#timer-status').getAttribute('data-status'),'timerInvalid');
 const stopped=await page.locator('#replay-time').textContent();await page.waitForTimeout(250);assert.equal(await page.locator('#replay-time').textContent(),stopped);assert.equal(await page.locator('#completion').isVisible(),false);
 if(process.argv[3])await page.screenshot({path:process.argv[3]+'/replay-stopped-error.png'});
 // Earlier files are migrated into visible steps, never executed atomically.
 await load([...route.slice(0,5),{type:'handoff',arm:'A'},...route.slice(7)]);assert.equal(await page.locator('#steps li').count(),11);assert.match(await page.locator('#steps li').nth(5).textContent(),/Arm BClose/);assert.match(await page.locator('#steps li').nth(6).textContent(),/Arm AOpen/);
 await page.reload();await page.locator('#joint-0').waitFor({state:'attached'});await send('program');assert.equal(await page.locator('#steps li').count(),11);
 assert.deepEqual(errors,[]);console.log('Handoff browser PASS: separate grips/releases, manual move blocked, bilingual error, recovery and complete recording/replay, runtime stop at step 7, frozen timer, highlighted error and old-file migration.');
}finally{await browser.close();}
