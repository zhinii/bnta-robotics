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
    res.writeHead(200,{'Content-Type':types[path.extname(file)]});res.end(await readFile(file));
  }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
  browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
  const page=await browser.newPage({viewport:{width:1180,height:820},hasTouch:true}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  let providerCalls=0,failConnection=false;
  const routes={
    connection_check:[],
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
    if(failConnection&&task.question==='connection_check'){await route.fulfill({status:401,json:{error:{message:'Test authentication failure'}}});return;}
    await route.fulfill({json:{choices:[{message:{content:JSON.stringify({reply:'Ready.',actions:routes[task.question]})}}]}});
  });
  const $=id=>page.locator('#'+id);
  const snapshot=()=>page.evaluate(()=>{
    const value=window.robotLabSnapshot();delete value.scene.canUndo;return value;
  });
  const waitIdle=()=>page.waitForFunction(()=>!window.robotLabSnapshot().busy,null,{timeout:90000});
  const send=async command=>{
    await $('prompt').fill(command);await $('send').click();await $('preview-run').click({timeout:45000});await waitIdle();
  };
  const output=process.env.BNTA_SCREENSHOTS;
  if(output)await mkdir(output,{recursive:true});
  const shot=async name=>{if(output){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(output,name+'.png'),fullPage:true});}};
  const openReference=async level=>{
    if(await $('reference-tab').isVisible())await $('reference-tab').click();
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
  assert.equal(await $('timed-start').isEnabled(),true,'Start also connects a managed deployment');
  assert.equal(await $('composer').isVisible(),false);
  assert.equal(await $('reference-preview').isVisible(),true);
  await shot('01-landscape-ready');
  await $('timed-start').click();await waitIdle();
  const start=(await snapshot()).scene;
  assert.equal((await snapshot()).timed.recording,true);
  assert.equal((await snapshot()).connected,true);
  assert.equal(providerCalls,1);
  assert.equal(await $('timed-finish').isVisible(),true);
  assert.equal(await $('session-options').isVisible(),false);
  await shot('02-landscape-recording');

  // Exercise VisualViewport resizing on touch layouts. This is not a native iPad keyboard test.
  for(const [width,height,visibleHeight] of [[820,1180,650],[1180,820,390]]){
    await page.setViewportSize({width,height});await page.waitForTimeout(150);await $('prompt').focus();
    await page.evaluate(visibleHeight=>{
      Object.defineProperty(visualViewport,'height',{value:visibleHeight,configurable:true});
      Object.defineProperty(visualViewport,'offsetTop',{value:30,configurable:true});
      visualViewport.dispatchEvent(new Event('resize'));
    },visibleHeight);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'prompt');
    await page.waitForFunction(()=>document.body.classList.contains('is-typing'));
    assert.equal(await page.evaluate(()=>{
      const bottom=visualViewport.offsetTop+visualViewport.height;
      const input=document.getElementById('prompt').getBoundingClientRect(),send=document.getElementById('send').getBoundingClientRect();
      return input.top>=visualViewport.offsetTop&&send.bottom<=bottom+1;
    }),true,'input and Send fit above the simulated keyboard');
    await $('reference-tab').click();
    assert.equal(await $('reference-preview').isVisible(),true);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'prompt','tabs preserve typing focus');
    await $('desk-tab').click();
    if(output)await page.screenshot({path:path.join(output,'keyboard-'+width+'.png')});
    await page.evaluate(()=>{
      document.getElementById('prompt').blur();delete visualViewport.height;delete visualViewport.offsetTop;
      visualViewport.dispatchEvent(new Event('resize'));
    });
    await page.waitForFunction(()=>!document.body.classList.contains('is-typing'));
    assert.equal(await $('view-toggle').getAttribute('aria-pressed'),'false');
  }

  failConnection=true;await $('reconnect').click();await waitIdle();
  assert.equal((await snapshot()).connected,false);assert.equal(await $('connection-retry').isVisible(),true);
  failConnection=false;await $('connection-retry').click();await waitIdle();
  assert.equal((await snapshot()).connected,true);assert.deepEqual((await snapshot()).scene,start);
  assert.equal((await snapshot()).timed.recording,true);
  await page.setViewportSize({width:390,height:844});
  await openReference('easy');await page.keyboard.press('Escape');await $('desk-tab').click();
  await $('prompt').fill('Put the red book flat on the left side of the shelf.');await $('send').click();
  await page.waitForFunction(()=>document.activeElement.id==='preview-heading');
  assert.equal(await page.evaluate(()=>{
    const scene=document.getElementById('scene-stage').getBoundingClientRect(),run=document.getElementById('preview-run').getBoundingClientRect();
    return scene.top>=-1&&scene.bottom<innerHeight&&run.top>=scene.bottom&&run.bottom<=innerHeight;
  }),true,'phone shows the scene and Run movement together');
  if(output)await page.screenshot({path:path.join(output,'03-phone-movement-preview.png')});
  await $('preview-dismiss').click();await waitIdle();
  assert.equal((await snapshot()).timed.moves,0);assert.deepEqual((await snapshot()).scene,start);
  await send('Put the red book flat on the left side of the shelf.');
  await send('Put the blue notebook flat on the right side of the shelf.');
  await $('timed-finish').click();
  const finished=await snapshot();
  assert.equal(finished.timed.recording,false);assert.equal(finished.timed.moves,2);
  assert.equal(await $('composer').isVisible(),false);assert.equal(await $('timed-replay').isVisible(),true);
  assert.equal(await $('timed-edit').isVisible(),true);
  assert.equal(await $('timed-replay').evaluate(button=>{const r=button.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),true,'Play recording replaces Finish in view');
  await page.setViewportSize({width:820,height:1180});await shot('04-tablet-finished');
  await page.setViewportSize({width:1180,height:820});await shot('05-landscape-finished');
  const calls=providerCalls;
  await $('timed-replay').click();
  await page.waitForFunction(()=>window.robotLabSnapshot().timed.replayMs>200);
  await $('timed-pause').click();
  const paused=await snapshot();assert.equal(paused.timed.paused,true);
  await page.waitForTimeout(350);
  const still=await snapshot();assert.equal(still.timed.replayMs,paused.timed.replayMs);assert.deepEqual(still.scene,paused.scene);
  await shot('06-landscape-paused');
  await $('timed-pause').click();await shot('07-landscape-playback');await waitIdle();
  const replay=await snapshot();
  assert.equal(providerCalls,calls,'playback never contacts the AI');
  assert.equal(replay.timed.replayComplete,true);
  assert.equal(replay.timed.replayMs,replay.timed.totalMs);
  assert.equal(replay.timed.attemptMs,finished.timed.attemptMs);
  assert.deepEqual(replay.scene,finished.scene);
  assert.equal(await $('comparison-image').isVisible(),true);
  assert.equal(await $('comparison-image').evaluate(img=>img.complete&&img.naturalWidth===1000&&img.naturalHeight===680),true);
  await shot('08-landscape-comparison');
  await page.setViewportSize({width:820,height:1180});await shot('09-tablet-comparison');
  await $('reference-tab').click();assert.equal(await $('reference-preview').isVisible(),true);await $('desk-tab').click();
  await $('compare-toggle').click();assert.equal(await $('comparison-image').isVisible(),false);
  assert.deepEqual((await snapshot()).scene,replay.scene,'comparison changes only the view');

  // A stopped playback is not the editing starting point: edit must restore the saved final desk.
  await $('timed-replay').click();await page.waitForFunction(()=>window.robotLabSnapshot().timed.replayMs>200);
  await $('timed-stop').click();await waitIdle();
  assert.equal((await snapshot()).timed.replayStopped,true);
  assert.notDeepEqual((await snapshot()).scene,finished.scene);
  await $('timed-edit').click();
  assert.deepEqual((await snapshot()).scene,finished.scene);
  assert.equal((await snapshot()).timed.recording,true);
  await send('Move the pen 10 mm to the right.');
  await $('timed-finish').click();
  const edited=await snapshot();assert.equal(edited.timed.moves,3);assert.ok(edited.timed.attemptMs>finished.timed.attemptMs);
  await $('timed-replay').click();await waitIdle();assert.deepEqual((await snapshot()).scene,edited.scene);
  assert.equal(providerCalls,calls+1);

  await page.locator('[data-level="hard"]').click();assert.equal((await snapshot()).timed.moves,0);
  await openReference('hard');assert.match(await $('reference-clues').innerText(),/bound spine/);await page.keyboard.press('Escape');
  await page.locator('[data-level="easy"]').click();assert.deepEqual((await snapshot()).scene,edited.scene);
  await $('session-options').locator('summary').click();await $('timed-new').click();
  await $('reset-dialog').locator('[value="cancel"]').click();assert.equal((await snapshot()).timed.moves,3);
  await $('session-options').locator('summary').click();await $('timed-new').click();
  await $('reset-dialog').locator('[value="reset"]').click();
  await page.waitForFunction(()=>window.robotLabSnapshot().timed.attemptMs===null);
  const reset=await snapshot();assert.deepEqual(reset.scene,start);assert.equal(reset.timed.attemptMs,null);assert.equal(reset.timed.replayComplete,false);
  assert.equal(await $('timed-start').isVisible(),true);

  // Stopping a movement records only the executed trajectory; replay ends without a pose score.
  await $('timed-start').click();await $('prompt').fill('Rotate joint 1 90degrees clockwise');await $('send').click();await $('preview-run').click();
  await page.waitForFunction(()=>window.robotLabSnapshot().scene.joints[0]<-25);
  await $('stop').click();await waitIdle();
  const partial=await snapshot();assert.ok(partial.scene.joints[0]<-25&&partial.scene.joints[0]>-89);assert.equal(partial.timed.moves,1);
  await $('timed-finish').click();await $('timed-replay').click();await waitIdle();
  assert.deepEqual((await snapshot()).scene,partial.scene);assert.equal((await snapshot()).timed.replayComplete,true);
  await $('session-options').locator('summary').click();await $('timed-new').click();await page.keyboard.press('Escape');
  assert.equal((await snapshot()).timed.moves,1,'Escape must not reuse an earlier reset confirmation');
  await $('language').click();await page.setViewportSize({width:390,height:844});
  assert.match(await $('timed-replay').innerText(),/再次回放/);
  assert.match(await $('timed-status').innerText(),/对照/);
  await openReference('easy');assert.match(await $('reference-title').innerText(),/简单/);await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await shot('10-phone-chinese-review');
  await page.reload();await page.waitForFunction(()=>!!window.robotLabSnapshot);assert.equal((await snapshot()).timed.moves,0);
  assert.deepEqual(errors,[]);
  console.log('PASS: managed Start, references, touch keyboard viewport, movement approval, finish, pause/resume, offline replay, aligned comparison, saved-endpoint editing, per-level state, confirmed reset, partial movement replay and bilingual mobile UI.');
}finally{await browser?.close();server.close();}
