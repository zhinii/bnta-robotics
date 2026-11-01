import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {initialWorld,pose,distance} from '../challenge-model.mjs';
import {orientationError} from '../challenge-kinematics.mjs';
const {chromium}=await import(process.env.BNTA_PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const out=process.env.BNTA_SCREENSHOTS||'../../test-artifacts/xyz-preview';await mkdir(out,{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true,isMobile:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{if(!localStorage.getItem('bnta:robot-challenges:v1'))localStorage.setItem('bnta:robot-challenges:v1',JSON.stringify({version:1,challengeRevision:2,passed:['easy'],mode:'medium'}));});
 await page.goto(process.env.BNTA_PREVIEW_URL||'http://127.0.0.1:4223/beginner-3axis/');await page.locator('#joint-5').waitFor({state:'attached'});
 const send=async s=>{await page.locator('#command').fill(s);await page.locator('#command-form button').tap();};
 await page.locator('#record').tap();await page.locator('#control-mode').tap();
 const actual=await page.locator('#tcp').textContent();
 for(const [axis,value]of [['x','130'],['y','-100'],['z','110']]){
  await page.locator('#axis-'+axis).fill(value);assert.equal(await page.locator('#axis-slider-'+axis).inputValue(),value);assert.equal(await page.locator('#tcp').textContent(),actual);assert.equal(await page.locator('#step-count').textContent(),'0');
 }
 assert.match(await page.locator('#target-tcp').textContent(),/X 130.0.*Y -100.0.*Z 110.0/);assert.equal(await page.locator('#move').isEnabled(),true);
 await page.screenshot({path:out+'/typed-valid.png'});
 await page.locator('#axis-z').fill('220');assert.match(await page.locator('#target-tcp').textContent(),/Z 220.0/);assert.equal(await page.locator('#move').isDisabled(),true);assert.match(await page.locator('#preview-state').textContent(),/red target.*wrist angle/);assert.equal(await page.locator('#tcp').textContent(),actual);
 await page.screenshot({path:out+'/typed-unreachable.png'});
 await page.locator('#language').selectOption('zh');assert.match(await page.locator('#preview-state').textContent(),/手腕角度.*红色目标/);await page.setViewportSize({width:768,height:1024});await page.screenshot({path:out+'/typed-unreachable-zh-portrait.png'});await page.locator('#language').selectOption('en');
 await page.locator('#axis-z').fill('110');assert.equal(await page.locator('#move').isEnabled(),true);await page.locator('#axis-slider-z').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#axis-z').inputValue(),await page.locator('#axis-slider-z').inputValue());assert.equal(await page.locator('#tcp').textContent(),actual);
 await page.locator('#move').tap();await page.waitForFunction(()=>!document.querySelector('#move').disabled);assert.match(await page.locator('#tcp').textContent(),/X 130.0.*Y -100.0.*Z 110.0/);assert.equal(await page.locator('#step-count').textContent(),'1');
 // A draft joint rotation must remain when coordinates are edited before Move.
 await page.locator('#language').selectOption('en');await page.locator('#reset').tap();const arm=initialWorld('medium').arms[0],q=[...arm.q];q[5]+=30;
 await send('joints '+q.join(' '));await page.locator('#control-mode').tap();const p=pose(arm,q).tip;p[0]+=10;
 await page.locator('#axis-x').fill(String(p[0]));await page.locator('#axis-y').fill(String(p[1]));await page.locator('#axis-z').fill(String(p[2]));
 assert.equal(await page.locator('#tcp').textContent(),actual);await page.locator('#add-move').tap();const step=await page.evaluate(()=>JSON.parse(localStorage.getItem('bnta:robot-challenges:v1')).programs.medium.at(-1));
 assert.equal(step.kind,'xyz');assert.ok(distance(pose(arm,step.q).tip,p)<.12);assert.ok(Math.hypot(...orientationError(pose(arm,q).rotation,pose(arm,step.q).rotation))<.004);
 // Chat coordinates use the same preview and preserve an unreachable target.
 await send('target 130 -100 220');assert.match(await page.locator('#target-tcp').textContent(),/Z 220.0/);assert.equal(await page.locator('#tcp').textContent(),actual);
 assert.deepEqual(errors,[]);console.log('XYZ browser PASS: typed X/Y/Z and sliders preview without motion/recording; unreachable target retained with bilingual feedback; recovery and Move record correctly; draft wrist orientation preserved; iPad layouts and chat target covered.');
}finally{await browser.close();}
