import {operate,replay,record} from './challenge-browser-helpers.mjs';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {referenceProgram} from './challenge-fixtures.mjs';
import {enterChallenge,exportProgram} from './challenge-browser-helpers.mjs';
const {chromium}=await import(process.env.BNTA_PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const out=process.env.BNTA_SCREENSHOTS||'../../test-artifacts/explore-robots';await mkdir(out,{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true,isMobile:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.BNTA_PREVIEW_URL||'http://127.0.0.1:4225/beginner-3axis/');await page.locator('#axis-x').waitFor({state:'attached'});
 const send=s=>operate(page,s);
 const load=async data=>{await page.locator('#file').setInputFiles({name:'robot.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});};
 const selector=page.locator('#explore-robot');assert.equal(await selector.getAttribute('data-axes'),'6');await page.locator('#add-move').tap();const six=await exportProgram(page);assert.equal(six.axes,6);
 await page.locator('[data-robot-axes="3"]').click();assert.equal(await page.locator('#joint-inputs .joint').count(),3);assert.equal(await page.locator('#control-mode').isVisible(),false);assert.equal(await page.locator('#step-count').textContent(),'0');assert.match(await page.locator('#feedback').textContent(),/each robot keeps its own program/);
 await record(page);const route=referenceProgram('explore',3);
 for(const [i,s] of route.entries()){
  if(s.type==='move'){await send('joints '+s.q.join(' '));await page.locator('#move').tap();assert.equal(await page.locator('[data-robot-axes="3"]').isDisabled(),true);}else await page.locator(`[data-action="${s.type}"]`).tap();
  await page.waitForFunction(()=>!document.querySelector('#record').disabled);assert.equal(await page.locator('#step-count').textContent(),String(i+1));
  if(i===2)assert.match(await page.locator('#task-positions p').first().textContent(),/held/);
 }
 const placed=await page.locator('#task-positions').textContent();await record(page);await replay(page);assert.equal(await page.locator('[data-robot-axes="3"]').isDisabled(),true);await page.waitForFunction(()=>document.querySelector('#timer-status').dataset.status==='timerFinished');assert.equal(await page.locator('#task-positions').textContent(),placed);assert.equal(await page.locator('#completion').isVisible(),false);
 const three=await exportProgram(page);assert.equal(three.axes,3);assert.equal(three.steps.length,6);assert.equal(three.steps[0].q.length,3);
 await send('program');await page.screenshot({path:out+'/program-3-landscape.png'});await send('controls');
 await page.locator('#reset').tap();assert.equal(await selector.getAttribute('data-axes'),'3');assert.equal(await page.locator('#joint-inputs .joint').count(),3);assert.equal(await page.locator('#step-count').textContent(),'6');
 await page.locator('[data-robot-axes="6"]').click();assert.equal(await page.locator('#joint-inputs .joint').count(),6);assert.equal(await page.locator('#control-mode').isVisible(),true);assert.equal(await page.locator('#step-count').textContent(),'1');
 await send('机器人 3');assert.equal(await selector.getAttribute('data-axes'),'3');assert.equal(await page.locator('#step-count').textContent(),'6');await send('easy');assert.equal(await selector.isVisible(),false);await send('explore');assert.equal(await selector.getAttribute('data-axes'),'3');assert.equal(await page.locator('#step-count').textContent(),'6');
 // Legacy Explore exports used six axes; malformed/mismatched axes cannot replace a program.
 const legacy={...six};delete legacy.axes;await load(legacy);await page.waitForFunction(()=>document.querySelector('#explore-robot').dataset.axes==='6');assert.equal(await page.locator('#step-count').textContent(),'1');
 await load({...three,axes:6});await page.waitForFunction(()=>document.querySelector('#feedback').textContent.includes('not a valid'));assert.equal(await selector.getAttribute('data-axes'),'6');assert.equal(await page.locator('#step-count').textContent(),'1');
 await load({...three,axes:4});await page.waitForFunction(()=>document.querySelector('#file').value==='');assert.equal(await page.locator('#step-count').textContent(),'1');
 await load(three);await page.waitForFunction(()=>document.querySelector('#explore-robot').dataset.axes==='3');assert.equal(await page.locator('#step-count').textContent(),'6');
 for(const axes of ['3','6'])for(const [width,height] of [[1024,768],[768,1024],[390,844],[320,568]])for(const language of ['en','zh']){
  await page.setViewportSize({width,height});await page.locator('#language').selectOption(language);await send('controls');await page.locator(`[data-robot-axes="${axes}"]`).click();await page.locator('#reset').tap();
  const b=await selector.boundingBox();assert.ok(b.x>=0&&b.x+b.width<=width&&b.y>=0&&b.y+b.height<=height);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await page.locator('#command').count(),0);
  await page.screenshot({path:out+`/explore-${axes}-${width}-${language}.png`});
 }
 await page.setViewportSize({width:1024,height:768});await page.locator('#language').selectOption('en');
 for(const mode of ['medium','hard']){
  await enterChallenge(page,mode);assert.equal(await selector.isVisible(),false);
  for(const [width,height] of [[1024,768],[768,1024]]){await page.setViewportSize({width,height});await page.screenshot({path:out+`/${mode}-${width}.png`});}
 }
 await page.reload();await page.locator('#axis-x').waitFor({state:'attached'});assert.equal(await selector.getAttribute('data-axes'),'6');assert.equal(await page.locator('[data-mode="explore"]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#step-count').textContent(),'0');await page.locator('[data-robot-axes="3"]').click();assert.equal(await page.locator('#step-count').textContent(),'0');
 assert.deepEqual(errors,[]);console.log('Explore robots PASS: both original models, three-axis pick/carry/release/replay, separate session programs, reset, visible controls, legacy and typed file validation, reload, EN/ZH tablet/phone layouts; medium/hard visual review captured.');
}finally{await browser.close();}
