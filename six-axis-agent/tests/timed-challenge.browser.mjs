import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdir,readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {RELAY} from '../agent.mjs';

const {chromium}=await import(process.env.BNTA_PLAYWRIGHT_PATH||'playwright');
const root=fileURLToPath(new URL('../../',import.meta.url));
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.png':'image/png'};
const server=createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
    if(!file.startsWith(root)||!types[path.extname(file)])throw Error('path');
    const data=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]});res.end(data);
  }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
  browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  let providerCalls=0;
  const routes={
    'connection_check':[],
    'Put the red book flat on the left shelf spot.':[{type:'transfer',object:'book',target:'shelf-left'}],
    'Put the blue notebook flat on the right shelf spot.':[{type:'transfer',object:'notebook',target:'shelf-right'}],
  };
  await page.route(RELAY,async route=>{
    providerCalls++;
    const task=JSON.parse(route.request().postDataJSON().messages.at(-1).content);
    assert.ok(Object.hasOwn(routes,task.question),task.question);
    assert.equal(route.request().headers().authorization,undefined);
    await route.fulfill({json:{choices:[{message:{content:JSON.stringify({reply:'Ready.',actions:routes[task.question]})}}]}});
  });
  const $=id=>page.locator('#'+id);
  const snapshot=()=>page.evaluate(()=>window.robotLabSnapshot());
  const waitIdle=()=>page.waitForFunction(()=>!window.robotLabSnapshot().busy,null,{timeout:60000});
  const send=async(command,button='preview-run')=>{
    await $('prompt').fill(command);await $('send').click();await $(button).click({timeout:45000});await waitIdle();
  };
  await page.goto('http://127.0.0.1:'+server.address().port+'/six-axis-agent/');
  await page.waitForFunction(()=>!!window.robotLabSnapshot);
  assert.equal(await $('render-error').isVisible(),false);
  assert.equal(await page.locator('#timed-goals').count(),0);
  assert.equal(await page.locator('#target-key li').count(),2);
  assert.equal(await $('timed-start').isEnabled(),false);
  await $('send').click();await waitIdle();assert.equal((await snapshot()).connected,true);
  const start=(await snapshot()).scene;
  await send('Rotate joint 1 30 degrees clockwise');assert.notDeepEqual((await snapshot()).scene.joints,start.joints);
  await $('timed-start').click();
  assert.deepEqual((await snapshot()).scene,start);
  assert.equal(await $('reset').isEnabled(),false);
  await $('prompt').fill('Put the red book flat on the left shelf spot.');await $('send').click();
  await page.waitForFunction(()=>document.activeElement.id==='preview-heading');
  const phoneReview=await page.evaluate(()=>{
    const scene=document.getElementById('scene-stage').getBoundingClientRect(),run=document.getElementById('preview-run').getBoundingClientRect();
    return scene.top>=0&&scene.bottom<innerHeight&&run.top>=scene.bottom&&run.bottom<=innerHeight;
  });
  assert.equal(phoneReview,true,'the phone keeps the whole scene and Run movement in view');
  const output=process.env.BNTA_SCREENSHOTS;
  if(output){await mkdir(output,{recursive:true});await page.screenshot({path:path.join(output,'phone-movement-review.png')});}
  await $('preview-dismiss').click();await waitIdle();
  assert.equal((await snapshot()).timed.moves,0);
  assert.deepEqual((await snapshot()).scene,start);
  await send('Put the red book flat on the left shelf spot.');
  await send('Put the blue notebook flat on the right shelf spot.');
  assert.equal((await snapshot()).timed.recording,true);
  await $('timed-finish').click();
  const finished=await snapshot();
  assert.equal(finished.timed.recording,false);
  assert.equal(finished.timed.moves,2);
  assert.ok(finished.timed.attemptMs>0);
  assert.equal(finished.timed.replayMs,null);
  const calls=providerCalls;
  await $('timed-replay').click();
  assert.equal(await $('composer').isVisible(),false);
  assert.equal(await $('stop').innerText(),'Stop replay');
  await waitIdle();
  const replay=await snapshot();
  assert.equal(providerCalls,calls);
  assert.equal(replay.timed.replayComplete,true);
  assert.equal(replay.timed.attemptMs,finished.timed.attemptMs);
  assert.ok(replay.timed.replayMs>0);
  assert.deepEqual(replay.scene.objects,finished.scene.objects);
  assert.deepEqual(replay.scene.joints,finished.scene.joints);
  assert.match(await $('timed-status').innerText(),/Compare the objects/);
  assert.equal(await page.evaluate(()=>{
    const clocks=document.getElementById('timed-clocks').getBoundingClientRect();
    return clocks.top>=0&&clocks.bottom<=innerHeight;
  }),true,'the playback result times stay with the scene on a phone');
  await page.setViewportSize({width:820,height:1180});
  await $('view-toggle').click();
  assert.equal(await $('view-toggle').getAttribute('aria-pressed'),'true');
  assert.equal(await $('view-toggle').innerText(),'3D view');
  if(output)await page.screenshot({path:path.join(output,'tablet-replay-result.png'),fullPage:true});

  await page.locator('[data-level="hard"]').click();
  assert.equal(await page.locator('#target-key li').count(),5);
  assert.match(await $('target-key').innerText(),/X 154 · Y 152/);
  await $('timed-start').click();
  await $('prompt').fill('Rotate joint 1 90degrees clockwise');await $('send').click();await $('preview-run').click();
  await page.waitForFunction(()=>window.robotLabSnapshot().scene.joints[0]<-25);
  await page.evaluate(()=>document.getElementById('stop').click());
  const partial=await snapshot();
  assert.ok(partial.scene.joints[0]<-25&&partial.scene.joints[0]>-89);
  assert.equal(partial.timed.moves,1);
  await $('timed-finish').click();await $('timed-replay').click();await waitIdle();
  const partialReplay=await snapshot();
  assert.equal(providerCalls,calls);
  assert.equal(partialReplay.timed.replayComplete,true,'replay completion does not require an arrangement or final pose');
  assert.equal(partialReplay.timed.moves,1);
  assert.deepEqual(partialReplay.scene.joints,partial.scene.joints);
  await $('language').click();await page.setViewportSize({width:390,height:844});
  assert.match(await page.locator('[data-level="hard"][aria-pressed="true"]').innerText(),/困难/);
  assert.match(await $('timed-status').innerText(),/对照编号/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.reload();await page.waitForFunction(()=>!!window.robotLabSnapshot);
  assert.equal((await snapshot()).timed.moves,0);
  assert.deepEqual(errors,[]);
  console.log('PASS: visual targets, phone approval with the scene in view, timed reset, manual finish, offline replay, top view, partial stop replay, bilingual layouts.');
}finally{await browser?.close();server.close();}
