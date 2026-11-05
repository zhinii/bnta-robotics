import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {referenceProgram} from './challenge-fixtures.mjs';
const {chromium}=await import(process.env.BNTA_PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const out=process.env.BNTA_SCREENSHOTS||'../../test-artifacts/ipad-challenges';await mkdir(out,{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true,isMobile:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.BNTA_PREVIEW_URL||'http://127.0.0.1:4223/beginner-3axis/');await page.locator('#axis-x').waitFor();
 const send=async s=>{await page.locator('#command').fill(s);await page.locator('#command-form button').tap();};
 assert.equal(await page.locator('[data-mode="medium"]').isDisabled(),true);
 await send('medium');assert.equal(await page.locator('[data-mode="easy"]').getAttribute('aria-pressed'),'true');
 for(const mode of ['easy','medium','hard']){
  await page.locator(`[data-mode="${mode}"]`).tap();const route=referenceProgram(mode);
  for(const [name,size]of [['landscape',{width:1024,height:768}],['portrait',{width:768,height:1024}]]){
   await page.setViewportSize(size);
   for(const lang of ['en','zh']){
    await page.locator('#language').selectOption(lang);await page.waitForTimeout(150);
    for(const id of ['record','run','pause','command','move','stop']){
     const b=await page.locator('#'+id).boundingBox();assert.ok(b&&b.x>=0&&b.y>=0&&b.x+b.width<=size.width+1&&b.y+b.height<=size.height+1,mode+' '+name+' '+id+' visible');assert.ok(b.height>=44,id+' touch target');
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    const scene=await page.locator('#scene').boundingBox(),task=await page.locator('#task-card').boundingBox();assert.ok(scene.y>=task.y+task.height-1,'instructions do not cover scene');assert.ok(scene.height>=240);
    await page.screenshot({path:`${out}/${mode}-${name}-${lang}.png`});
   }
  }
  await page.setViewportSize({width:1024,height:768});await page.locator('#language').selectOption('en');await page.locator('#record').tap();
  for(const step of route){
   if(mode==='hard')await page.locator(`[data-arm="${step.arm}"]`).tap();
   if(step.type==='move'){await send('joints '+step.q.join(' '));await send('move');}else await send(step.type);
   await page.waitForFunction(()=>!document.querySelector('#move').disabled);
   assert.equal(await page.locator('#completion').isVisible(),false,'recording must never complete a challenge');
  }
  assert.equal(await page.locator('#step-count').textContent(),String(route.length));assert.equal(await page.locator('#replay-prompt').isVisible(),true);assert.equal(await page.locator('#next').isDisabled(),true);assert.equal(await page.locator('#replay-time').textContent(),'0.00 s');
  if(mode!=='hard')assert.equal(await page.locator(`[data-mode="${mode==='easy'?'medium':'hard'}"]`).isDisabled(),true);
  await page.locator('#record').tap();await page.locator('#run').tap();await page.locator('#pause').tap();const time=await page.locator('#replay-time').textContent();await page.waitForTimeout(200);assert.equal(await page.locator('#replay-time').textContent(),time);assert.equal(await page.locator('#completion').isVisible(),false);await page.locator('#pause').tap();
  await page.locator('#completion').waitFor({state:'visible',timeout:60000});assert.equal(await page.locator('#timer-status').getAttribute('data-status'),'timerComplete');assert.equal(await page.locator('#replay-actions').textContent(),`${route.length} / ${route.length}`);assert.equal(await page.locator('#next').isEnabled(),true);
  if(mode==='medium')assert.match(await page.locator('#checks').textContent(),/✓ Pass slot/);
  await page.screenshot({path:`${out}/${mode}-verified.png`});
  console.log(mode+': recorded real moves; manual placement unverified; paused replay frozen; full replay verified; next unlocked; EN/ZH and iPad orientations passed.');
 }
 // Editing and importing a claimed result cannot retain a completion certificate.
 await send('program');await page.locator('#steps li').last().getByRole('button',{name:/Remove/}).tap();assert.equal(await page.locator('#completion').isVisible(),false);
 await page.locator('#run').tap();await page.waitForFunction(()=>document.querySelector('#timer-status').dataset.status==='timerIncomplete');assert.equal(await page.locator('#completion').isVisible(),false);
 await page.locator('#file').setInputFiles({name:'claimed.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,mode:'easy',steps:referenceProgram('easy'),replay:{status:'timerComplete'}}))});assert.equal(await page.locator('#completion').isVisible(),false);
 await page.locator('#run').tap();await page.locator('#stop').tap();assert.equal(await page.locator('#completion').isVisible(),false);assert.equal(await page.locator('#timer-status').getAttribute('data-status'),'timerStopped');
 await page.reload();await page.locator('#axis-x').waitFor();assert.equal(await page.locator('#completion').isVisible(),false);assert.equal(await page.locator('[data-mode="medium"]').isEnabled(),false,'reload clears earned unlocks');assert.equal(await page.locator('[data-mode="explore"]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#step-count').textContent(),'0');
 assert.deepEqual(errors,[]);console.log('Editing, incomplete/stopped replay, untrusted imported score and reload checks passed; no page errors.');
}finally{await browser.close();}
