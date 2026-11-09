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
    'Move the pen 10 mm to the right.':[{type:'shift',object:'pen',direction:'right',distance:10,unit:'mm'}],
    'Put the red book flat on the left side of the shelf.':[{type:'transfer',object:'book',target:'shelf-left'}],
    'Put the blue notebook flat on the right side of the shelf.':[{type:'transfer',object:'notebook',target:'shelf-right'}],
  };
  await page.route(RELAY,async route=>{
    providerCalls++;
    const task=JSON.parse(route.request().postDataJSON().messages.at(-1).content);
    assert.ok(Object.hasOwn(routes,task.question),task.question);
    assert.equal(task.scene.placementTargets,undefined);
    assert.equal(route.request().headers().authorization,undefined);
    await route.fulfill({json:{choices:[{message:{content:JSON.stringify({reply:'Ready.',actions:routes[task.question]})}}]}});
  });
  const $=id=>page.locator('#'+id);
  const snapshot=()=>page.evaluate(()=>window.robotLabSnapshot());
  const waitIdle=()=>page.waitForFunction(()=>!window.robotLabSnapshot().busy,null,{timeout:60000});
  const send=async(command,button='preview-run')=>{
    await $('prompt').fill(command);await $('send').click();await $(button).click({timeout:45000});await waitIdle();
  };
  const openReference=async(level)=>{
    await $('reference-open').click();
    await page.waitForFunction(level=>{
      const img=document.getElementById('reference-image');
      return img.src.includes('reference-'+level+'.png')&&img.complete&&img.naturalWidth===1000;
    },level);
    assert.equal(await $('reference-dialog').isVisible(),true);
  };
  await page.goto('http://127.0.0.1:'+server.address().port+'/six-axis-agent/');
  await page.waitForFunction(()=>!!window.robotLabSnapshot);
  assert.equal(await $('render-error').isVisible(),false);
  assert.equal(await $('ruler-note').isVisible(),false);
  assert.equal(await page.locator('#timed-goals').count(),0);
  assert.equal(await page.locator('#target-key,.target-number').count(),0);
  assert.equal(await $('timed-start').isEnabled(),false);
  await openReference('easy');
  assert.match(await $('reference-title').innerText(),/Easy reference/);
  await page.keyboard.press('Escape');
  await page.locator('[data-level="medium"]').click();
  await openReference('medium');
  assert.match(await $('reference-clues').innerText(),/short edge/);
  await $('reference-dialog').getByRole('button',{name:'Close'}).click();
  await page.locator('[data-level="easy"]').click();
  await $('send').click();await waitIdle();assert.equal((await snapshot()).connected,true);
  const start=(await snapshot()).scene;
  await $('view-toggle').click();
  assert.equal(await $('ruler-note').innerText(),'Each tick is 10 mm');
  await send('Move the pen 10 mm to the right.');
  const pen=scene=>scene.objects.find(object=>object.id==='pen');
  assert.deepEqual(pen((await snapshot()).scene).position,[pen(start).position[0]+10,...pen(start).position.slice(1)]);
  await send('Rotate joint 1 30 degrees clockwise');assert.notDeepEqual((await snapshot()).scene.joints,start.joints);
  await $('timed-start').click();
  assert.deepEqual((await snapshot()).scene,start);
  assert.equal(await $('ruler-note').isVisible(),false);
  assert.equal(await $('reset').isEnabled(),false);
  await $('prompt').fill('Put the red book flat on the left side of the shelf.');await $('send').click();
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
  await send('Put the red book flat on the left side of the shelf.');
  await send('Put the blue notebook flat on the right side of the shelf.');
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
  assert.match(await $('timed-status').innerText(),/Compare your desk with the reference image/);
  assert.equal(await page.evaluate(()=>{
    const clocks=document.getElementById('timed-clocks').getBoundingClientRect();
    return clocks.top>=0&&clocks.bottom<=innerHeight;
  }),true,'the playback result times stay with the scene on a phone');
  await page.setViewportSize({width:820,height:1180});
  await $('view-toggle').click();
  assert.equal(await $('view-toggle').getAttribute('aria-pressed'),'true');
  assert.equal(await $('view-toggle').innerText(),'3D view');
  if(output)await page.screenshot({path:path.join(output,'tablet-replay-result.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await $('scene-stage').scrollIntoViewIfNeeded();
  if(output)await $('scene-stage').screenshot({path:path.join(output,'phone-rulers.png')});

  await page.locator('[data-level="hard"]').click();
  await $('timed-start').click();
  const beforeReference=await snapshot();
  await page.setViewportSize({width:390,height:844});
  await openReference('hard');
  assert.match(await $('reference-clues').innerText(),/bound spine/);
  assert.match(await $('reference-clues').innerText(),/20 mm/);
  if(output)await page.screenshot({path:path.join(output,'phone-hard-reference.png')});
  await $('reference-dialog').getByRole('button',{name:'Close'}).click();
  assert.deepEqual((await snapshot()).scene,beforeReference.scene);
  assert.equal((await snapshot()).timed.recording,true);
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
  await $('view-toggle').click();
  assert.equal(await $('ruler-note').innerText(),'每小格 10 毫米');
  assert.match(await page.locator('[data-level="hard"][aria-pressed="true"]').innerText(),/困难/);
  assert.match(await $('timed-status').innerText(),/对照参考图/);
  await openReference('hard');
  assert.match(await $('reference-title').innerText(),/困难/);
  assert.match(await $('reference-clues').innerText(),/毫米/);
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.reload();await page.waitForFunction(()=>!!window.robotLabSnapshot);
  assert.equal((await snapshot()).timed.moves,0);
  assert.deepEqual(errors,[]);
  console.log('PASS: 10 mm shift and bilingual ruler legend, three finished references, phone movement approval, timed reset, manual finish, offline replay and partial stop replay.');
}finally{await browser?.close();server.close();}
