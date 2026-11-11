import {fillNumber} from './challenge-browser-helpers.mjs';
import {operate,replay,record} from './challenge-browser-helpers.mjs';
import assert from 'node:assert/strict';import {mkdir} from 'node:fs/promises';
import {referenceProgram} from './challenge-fixtures.mjs';import {initialWorld,pose} from '../challenge-model.mjs';
const {chromium}=await import(process.env.BNTA_PLAYWRIGHT_PATH||process.argv[2]||'playwright');
const url=process.env.BNTA_PREVIEW_URL||'http://127.0.0.1:4223/beginner-3axis/challenge.html',out=process.env.BNTA_SCREENSHOTS||process.argv[3];if(out)await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:850},acceptDownloads:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.locator('#joint-0').waitFor({state:'attached'});
 const send=s=>operate(page,s);
 assert.equal(await page.locator('canvas').count()>0,true);assert.equal(await page.getByText('Lessons',{exact:true}).count(),0);
 await page.locator('[data-mode="easy"]').click();
 await record(page);assert.equal(await page.locator('#record').getAttribute('aria-pressed'),'true');
 const before=await page.locator('#tcp').textContent();await fillNumber(page,'#axis-x','147');await fillNumber(page,'#axis-y','-85');await fillNumber(page,'#axis-z','80');assert.equal(await page.locator('#tcp').textContent(),before,'preview never moves actual arm');
 await page.locator('#move').click();assert.match(await page.locator('#feedback').textContent(),/Collision/);assert.equal(await page.locator('#tcp').textContent(),before);await send('target 147 -85 130');await send('move');await page.waitForFunction(()=>!document.querySelector('#move').disabled);await send('target 147 -85 80');await send('move');await page.waitForFunction(()=>!document.querySelector('#move').disabled);assert.match(await page.locator('#tcp').textContent(),/147.0.*-85.0.*80.0/);
 await page.locator('[data-action="close"]').click();await page.waitForFunction(()=>!document.querySelector('#move').disabled);assert.match(await page.locator('#checks').textContent(),/✓ Pick up/);
 await send('program');assert.equal(await page.locator('#steps li').count(),3);await page.locator('#clear').click();await page.locator('#reset').click();
 for(const mode of ['easy','medium','hard']){
  await page.locator(`[data-mode="${mode}"]`).click();const route=referenceProgram(mode),world=initialWorld(mode);
  assert.equal(await page.locator('#joint-inputs .joint').count(),mode==='easy'?3:6);
  for(const step of route){
   if(mode==='hard')await page.locator(`[data-arm="${step.arm}"]`).click();
   if(step.type==='move'){
    if(mode==='easy'){const a=world.arms[0],p=pose(a,step.q).tip;await send('target '+p.join(' '));}
    else await send('joints '+step.q.join(' '));
    await page.locator('#add-move').click();
   }else await send('add '+step.type);
  }
  await send('program');assert.equal(await page.locator('#steps li').count(),route.length);assert.equal(await page.locator('#completion').isVisible(),false);
  await replay(page);await page.locator('#completion').waitFor({state:'visible',timeout:60000});
  assert.match(await page.locator('#checks').textContent(),/✓ Place/);
  if(mode==='medium')assert.match(await page.locator('#checks').textContent(),/✓ Pass slot/);
  if(mode==='hard'){assert.match(await page.locator('#checks').textContent(),/✓ Transfer to B/);assert.equal(await page.locator('.arm-badge.b').count(),6);}
  await page.locator('#language').selectOption('zh');assert.match(await page.locator('#completion').textContent(),/挑战完成/);
  await send('控制');if(mode==='hard')await page.locator('[data-arm="B"]').click();
  for(const size of [{width:1280,height:850},{width:390,height:844},{width:320,height:568}]){
   await page.setViewportSize(size);const b=await page.evaluate(()=>({width:document.documentElement.scrollWidth,scene:document.querySelector('#world').getBoundingClientRect().height}));
   assert.ok(b.width<=size.width+1&&b.scene>=190,JSON.stringify(b));
   assert.ok(await page.locator('#stop').isVisible());assert.equal(await page.locator('#command').count(),0);
   if(out)await page.screenshot({path:out+'/'+mode+'-'+size.width+'.png'});
  }
  await page.locator('#language').selectOption('en');console.log(mode+' browser PASS: preview, authored program, actual completion, bilingual UI, desktop and two phone sizes');
 }
 await send('program');const count=await page.locator('#steps li').count();await replay(page);await page.locator('#pause').click();const paused=await page.locator('#tcp').textContent();await page.waitForTimeout(250);assert.equal(await page.locator('#tcp').textContent(),paused);await page.locator('#stop').click();assert.equal(await page.locator('#steps li').count(),count);assert.equal(await page.locator('#completion').isVisible(),false);
 const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;assert.equal(download.suggestedFilename(),'robot-challenge-hard.json');
 await page.locator('#file').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"version":1,"mode":"hard","steps":[{"type":"move","arm":"B","q":[0,999,0,0,0,0],"kind":"joints"}]}')});await page.waitForFunction(()=>document.querySelector('#feedback').textContent.includes('not a valid'));assert.equal(await page.locator('#steps li').count(),count);
 await page.reload();await page.locator('#axis-x').waitFor({state:'attached'});assert.equal(await page.locator('[data-mode="explore"]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#step-count').textContent(),'0');assert.equal(await page.locator('#completion').isVisible(),false);assert.equal(await page.locator('[data-mode="medium"]').isDisabled(),true);assert.equal(await page.locator('[data-mode="hard"]').isDisabled(),true);
 assert.deepEqual(errors,[]);console.log('Browser PASS: pause/stop, file export, reload, invalid import protection, no Guide; no page errors.');
}finally{await browser.close();}
