import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import {referenceProgram} from './challenge-fixtures.mjs';
const {chromium}=await import(process.env.BNTA_PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const out=process.env.BNTA_SCREENSHOTS||'../../test-artifacts/explore';await mkdir(out,{recursive:true});
try{
 const context=await browser.newContext({viewport:{width:1024,height:768},isMobile:true,hasTouch:true}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>localStorage.removeItem('bnta:robot-challenges:v1'));
 await page.goto(process.env.BNTA_PREVIEW_URL||'http://127.0.0.1:4225/beginner-3axis/');await page.locator('#axis-x').waitFor();
 const send=async s=>{await page.locator('#command').fill(s);await page.locator('#command-form button').tap();};
 assert.equal(await page.locator('[data-mode="medium"]').isDisabled(),true);
 await page.locator('#add-move').tap();await page.locator('[data-mode="explore"]').tap();
 assert.equal(await page.locator('#step-count').textContent(),'0');assert.equal(await page.locator('#control-mode').isVisible(),true);assert.equal(await page.locator('#checks').isVisible(),false);assert.equal(await page.locator('#target-legend').isVisible(),false);assert.equal(await page.locator('#task-positions p').count(),3);assert.match(await page.locator('#task-description').textContent(),/No objective or score/);
 await page.screenshot({path:out+'/start-landscape.png'});
 const before=await page.locator('#tcp').textContent();await page.locator('#axis-x').fill('175');assert.equal(await page.locator('#tcp').textContent(),before);assert.equal(await page.locator('#task-card').isVisible(),false);assert.equal(await page.locator('#step-count').textContent(),'0');
 await page.locator('#record').tap();const route=referenceProgram('explore');
 for(const [i,step] of route.entries()){
  if(step.type==='move'){await send('joints '+step.q.join(' '));await page.locator('#move').tap();}else await page.locator(`[data-action="${step.type}"]`).tap();
  await page.waitForFunction(()=>!document.querySelector('#record').disabled);
  assert.equal(await page.locator('#step-count').textContent(),String(i+1));assert.equal(await page.locator('#completion').isVisible(),false);assert.equal(await page.locator('#failure').isVisible(),false);
  if(i===8)assert.match(await page.locator('#task-positions p').nth(1).textContent(),/Block 2.*held/);
  if(i===14)assert.match(await page.locator('#task-positions p').nth(0).textContent(),/Block 1.*held/);
 }
 const placed=await page.locator('#task-positions').textContent();await page.locator('#record').tap();await page.locator('#run').tap();await page.waitForFunction(()=>document.querySelector('#timer-status').dataset.status==='timerFinished');
 assert.equal(await page.locator('#task-positions').textContent(),placed);assert.equal(await page.locator('#completion').isVisible(),false);assert.equal(await page.locator('#replay-prompt').isVisible(),false);assert.match(await page.locator('#feedback').textContent(),/Keep exploring/);assert.equal(await page.locator('[data-mode="medium"]').isDisabled(),true);
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('bnta:robot-challenges:v1')));assert.deepEqual(stored.passed,[]);assert.equal(stored.programs.explore.length,route.length);assert.equal(stored.programs.easy.length,1);
 await send('program');await page.locator('.program-files summary').tap();const download=page.waitForEvent('download');await page.locator('#export').tap();const file=await (await download).path();const exported=JSON.parse(await readFile(file,'utf8'));assert.equal(exported.mode,'explore');assert.equal(exported.steps.length,17);
 await send('easy');assert.equal(await page.locator('#step-count').textContent(),'1');await page.locator('#file').setInputFiles(file);await page.waitForFunction(()=>document.querySelector('[data-mode="explore"]').getAttribute('aria-pressed')==='true');assert.equal(await page.locator('#step-count').textContent(),'17');
 for(const [width,height] of [[1024,768],[768,1024],[390,844],[320,568]])for(const language of ['en','zh']){
  await page.setViewportSize({width,height});await page.locator('#language').selectOption(language);await send('controls');await send(language==='en'?'explore':'探索');
  assert.equal(await page.locator('[data-mode="explore"]').getAttribute('aria-pressed'),'true');
  const geometry=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,visible:['tcp','target-tcp','command','record','run'].every(id=>{const r=document.getElementById(id).getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&r.width>0;})}));assert.equal(geometry.overflow,false);assert.equal(geometry.visible,true);
  await page.screenshot({path:out+`/explore-${width}-${language}.png`});
 }
 await page.locator('#language').selectOption('en');await send('explore');await page.locator('#reset').tap();assert.match(await page.locator('#task-positions p').nth(0).textContent(),/X 150.0.*Y -70.0.*Z 16.0/);assert.equal(await page.locator('#step-count').textContent(),'17');
 // Reload saved data in a new page without the clean-state init script.
 const reload=await page.context().newPage();await reload.goto(page.url());await reload.locator('#axis-x').waitFor();assert.equal(await reload.locator('[data-mode="explore"]').getAttribute('aria-pressed'),'true');assert.equal(await reload.locator('#step-count').textContent(),'17');await reload.close();
 assert.deepEqual(errors,[]);console.log('Explore browser PASS: unlocked, preview-only edits, three blocks, repeated pickups, recording/replay without a pass/fail gate, import/export, independent programs, reset/reload, EN/ZH iPad and phone layouts.');
}finally{await browser.close();}
