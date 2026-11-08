import {operate,replay,record} from './challenge-browser-helpers.mjs';
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import {referenceProgram} from './challenge-fixtures.mjs';
const {chromium}=await import(process.env.BNTA_PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const out=process.env.BNTA_SCREENSHOTS||'../../test-artifacts/explore';await mkdir(out,{recursive:true});
try{
 const context=await browser.newContext({viewport:{width:1024,height:768},isMobile:true,hasTouch:true}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{if(!/^https?:$/.test(location.protocol))return;localStorage.setItem('bnta:robot-challenges:v1',JSON.stringify({version:1,challengeRevision:2,mode:'hard',language:'zh',passed:['easy','medium','hard'],programs:{explore:[{type:'open',arm:'A'}],easy:[{type:'open',arm:'A'}]}}));localStorage.setItem('unrelated-app','keep');});
 await page.goto(process.env.BNTA_PREVIEW_URL||'http://127.0.0.1:4225/beginner-3axis/');await page.locator('#axis-x').waitFor({state:'attached'});
 const send=s=>operate(page,s);
 assert.equal(await page.locator('[data-mode="explore"]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#step-count').textContent(),'0');assert.equal(await page.locator('#language').inputValue(),'en');assert.equal(await page.evaluate(()=>localStorage.getItem('bnta:robot-challenges:v1')),null);assert.equal(await page.evaluate(()=>localStorage.getItem('unrelated-app')),'keep');
 assert.equal(await page.locator('[data-mode="medium"]').isDisabled(),true);
 await page.locator('[data-mode="easy"]').tap();await page.locator('#add-move').tap();await page.locator('[data-mode="explore"]').tap();
 assert.equal(await page.locator('#step-count').textContent(),'0');assert.equal(await page.locator('#control-mode').isVisible(),true);assert.equal(await page.locator('#checks').isVisible(),false);assert.equal(await page.locator('#target-legend').isVisible(),false);assert.equal(await page.locator('#task-positions p').count(),3);assert.match(await page.locator('#task-description').textContent(),/No objective or score/);
 await page.screenshot({path:out+'/start-landscape.png'});
 const before=await page.locator('#tcp').textContent();await page.locator('[data-control="xyz"]').click();await page.locator('#axis-x').fill('175');assert.equal(await page.locator('#tcp').textContent(),before);assert.equal(await page.locator('#task-card').isVisible(),false);assert.equal(await page.locator('#step-count').textContent(),'0');
 await record(page);const route=referenceProgram('explore');
 for(const [i,step] of route.entries()){
  if(step.type==='move'){await send('joints '+step.q.join(' '));await page.locator('#move').tap();}else await page.locator(`[data-action="${step.type}"]`).tap();
  await page.waitForFunction(()=>!document.querySelector('#record').disabled);
  assert.equal(await page.locator('#step-count').textContent(),String(i+1));assert.equal(await page.locator('#completion').isVisible(),false);assert.equal(await page.locator('#failure').isVisible(),false);
  if(i===8)assert.match(await page.locator('#task-positions p').nth(1).textContent(),/Block 2.*held/);
  if(i===14)assert.match(await page.locator('#task-positions p').nth(0).textContent(),/Block 1.*held/);
 }
 const placed=await page.locator('#task-positions').textContent();await record(page);await replay(page);await page.waitForFunction(()=>document.querySelector('#timer-status').dataset.status==='timerFinished');
 assert.equal(await page.locator('#task-positions').textContent(),placed);assert.equal(await page.locator('#completion').isVisible(),false);assert.equal(await page.locator('#replay-prompt').isVisible(),false);assert.match(await page.locator('#feedback').textContent(),/Keep exploring/);assert.equal(await page.locator('[data-mode="medium"]').isDisabled(),true);
 assert.equal(await page.evaluate(()=>localStorage.getItem('bnta:robot-challenges:v1')),null,'recording and replay never write a browser save');
 await send('program');const download=page.waitForEvent('download');await page.locator('#export').tap();const file=await (await download).path();const exported=JSON.parse(await readFile(file,'utf8'));assert.equal(exported.mode,'explore');assert.equal(exported.steps.length,17);
 await send('easy');assert.equal(await page.locator('#step-count').textContent(),'1');await page.locator('#file').setInputFiles(file);await page.waitForFunction(()=>document.querySelector('[data-mode="explore"]').getAttribute('aria-pressed')==='true');assert.equal(await page.locator('#step-count').textContent(),'17');
 for(const [width,height] of [[1024,768],[768,1024],[390,844],[320,568]])for(const language of ['en','zh']){
  await page.setViewportSize({width,height});await page.locator('#language').selectOption(language);await send('controls');await send(language==='en'?'explore':'探索');
  assert.equal(await page.locator('[data-mode="explore"]').getAttribute('aria-pressed'),'true');
  const geometry=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,visible:['tcp','target-tcp','record','move'].every(id=>{const r=document.getElementById(id).getBoundingClientRect();return r.width>0&&r.height>0;})}));assert.equal(geometry.overflow,false);assert.equal(geometry.visible,true);
  await page.screenshot({path:out+`/explore-${width}-${language}.png`});
 }
 await page.locator('#language').selectOption('en');await send('explore');await page.locator('#reset').tap();assert.match(await page.locator('#task-positions p').nth(0).textContent(),/X 150.0.*Y -70.0.*Z 16.0/);assert.equal(await page.locator('#step-count').textContent(),'17');
 // Real reload from another mode clears every program, locale, timer and unlock.
 await send('easy');await page.locator('#language').selectOption('zh');await record(page);await send('target 147 -85 80');await page.locator('#move').tap();await page.waitForFunction(()=>!document.querySelector('#record').disabled);assert.equal(await page.locator('#step-count').textContent(),'1');
 await page.reload();await page.locator('#axis-x').waitFor({state:'attached'});
 const assertFresh=async target=>{
  assert.equal(await target.locator('[data-mode="explore"]').getAttribute('aria-pressed'),'true');assert.equal(await target.locator('#step-count').textContent(),'0');assert.equal(await target.locator('#language').inputValue(),'en');assert.equal(await target.locator('#record').getAttribute('aria-pressed'),'false');assert.equal(await target.locator('#replay-time').textContent(),'0.00 s');assert.equal(await target.locator('[data-mode="medium"]').isDisabled(),true);assert.equal(await target.locator('[data-mode="hard"]').isDisabled(),true);assert.equal(await target.locator('#completion').isVisible(),false);assert.equal(await target.locator('#task-card').isVisible(),false);assert.match(await target.locator('#task-positions p').nth(0).textContent(),/X 150.0.*Y -70.0.*Z 16.0/);
 };
 await assertFresh(page);assert.equal(await page.evaluate(()=>localStorage.getItem('bnta:robot-challenges:v1')),null);assert.equal(await page.evaluate(()=>localStorage.getItem('unrelated-app')),'keep');
 await send('easy');assert.equal(await page.locator('#step-count').textContent(),'0');await send('explore');await page.screenshot({path:out+'/fresh-reload.png'});
 // A new tab and history navigation also start fresh.
 const reload=await context.newPage();await reload.goto(page.url());await reload.locator('#axis-x').waitFor({state:'attached'});await assertFresh(reload);await reload.close();
 await send('easy');await page.locator('#add-move').tap();await page.goto('about:blank');await page.goBack();await page.locator('#axis-x').waitFor({state:'attached'});await assertFresh(page);
 // Storage can be blocked by browser privacy settings: startup still works.
 const privateContext=await browser.newContext();await privateContext.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}}));const privatePage=await privateContext.newPage();privatePage.on('pageerror',e=>errors.push(e.message));await privatePage.goto(page.url());await privatePage.locator('#axis-x').waitFor({state:'attached'});await assertFresh(privatePage);await privateContext.close();
 assert.deepEqual(errors,[]);console.log('Explore browser PASS: unlocked, preview-only edits, three blocks, repeated pickups, recording/replay without a pass/fail gate, import/export, independent programs, fresh load/reload/history with legacy or blocked storage, EN/ZH iPad and phone layouts.');
}finally{await browser.close();}
