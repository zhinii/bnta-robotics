// Explicit live verification: uses the real hosted AI and never mocks requests.
// BNTA_LIVE_URL must name the release being verified. Optional BNTA_BROWSER=msedge.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const url=process.env.BNTA_LIVE_URL;
if(!url||new URL(url).origin!=='https://zhinii.github.io')throw Error('Set BNTA_LIVE_URL to the live GitHub release to verify.');
const {chromium}=await import(process.env.BNTA_PLAYWRIGHT_PATH||'playwright');
const channel=process.env.BNTA_BROWSER||'chrome',output=process.env.BNTA_SCREENSHOTS;
if(output)await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel,headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
const report={url,channel,checks:[],requests:[],errors:[]};
try{
  const page=await browser.newPage({viewport:{width:1180,height:820},hasTouch:true});
  page.on('pageerror',error=>report.errors.push(error.message));
  page.on('request',request=>{
    if(!request.url().includes('/api/chat')||request.method()!=='POST')return;
    const body=request.postDataJSON(),task=JSON.parse(body.messages.at(-1).content);
    report.requests.push({question:task.question,at:Date.now(),scene:task.scene,history:body.messages.filter(m=>m.role!=='system').slice(0,-1)});
    console.log('Live request:',task.question);
  });
  const $=id=>page.locator('#'+id);
  const snap=()=>page.evaluate(()=>{const s=window.robotLabSnapshot();delete s.scene.canUndo;return s;});
  const idle=()=>page.waitForFunction(()=>!window.robotLabSnapshot().connecting&&!window.robotLabSnapshot().busy,null,{timeout:110000});
  const checks=()=>report.requests.filter(r=>r.question==='connection_check').length;
  const record=(name,detail={})=>{report.checks.push({name,...detail});console.log('PASS:',name,JSON.stringify(detail));};
  const shot=async name=>{if(output){await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(200);await page.screenshot({path:path.join(output,name+'.png'),fullPage:true});}};
  const send=async command=>{
    const before=(await snap()).scene;
    await $('prompt').fill(command);await $('send').click();
    await page.waitForFunction(()=>!window.robotLabSnapshot().busy||!document.getElementById('preview-run').hidden&& !document.getElementById('preview-panel').hidden,null,{timeout:90000});
    if(!await $('preview-run').isVisible())throw Error('No movement preview: '+await $('messages').innerText());
    assert.deepEqual((await snap()).scene,before,'preview must not execute');
    await shot('02-preview');await $('preview-run').click();await idle();
  };
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>!!window.robotLabSnapshot);
  await page.locator('[data-level=hard]').click();await $('language').click();
  await page.locator('[data-level=easy]').click();await $('language').click();
  await idle();const initial=await snap();
  assert.equal(initial.connected,true,'automatic connection: '+await $('messages').innerText());
  assert.equal(initial.timed.attemptMs,null);assert.equal(initial.timed.moves,0);
  record('automatic connection without Reconnect, despite level and language changes',{attempts:initial.connectionAttempt});
  await shot('01-connected-desktop');
  if(output)await $('scene-stage').screenshot({path:path.join(output,'scene-only.png')});
  const connectionChecks=checks();
  await $('prompt').fill('pick up the book');await $('send').click();await idle();
  assert.match(await $('messages').innerText(),/Which book/);assert.deepEqual((await snap()).scene,initial.scene);
  await page.setViewportSize({width:390,height:844});await shot('03-clarification-phone');
  await page.setViewportSize({width:820,height:1180});await $('prompt').focus();
  await page.evaluate(()=>{
    Object.defineProperty(visualViewport,'height',{value:650,configurable:true});
    visualViewport.dispatchEvent(new Event('resize'));
  });
  await page.waitForFunction(()=>document.body.classList.contains('is-typing'));
  report.review={questionHiddenWhileTyping:!await $('messages').isVisible()};
  if(output)await page.screenshot({path:path.join(output,'03b-keyboard-question-hidden.png')});
  await page.evaluate(()=>{document.getElementById('prompt').blur();delete visualViewport.height;visualViewport.dispatchEvent(new Event('resize'));});
  await page.waitForFunction(()=>!document.body.classList.contains('is-typing'));
  await page.setViewportSize({width:1180,height:820});
  await send('Move the blue pen 10 mm to the right.');
  const practiced=await snap();assert.notDeepEqual(practiced.scene.objects,initial.scene.objects);
  assert.equal(practiced.timed.attemptMs,null);assert.equal(practiced.timed.moves,0);assert.equal(practiced.connected,true);
  record('real AI command executed before recording without starting timer');await shot('04-practice-desktop');
  await page.setViewportSize({width:820,height:1180});await shot('05-practice-tablet');
  await page.setViewportSize({width:1180,height:820});await $('timed-start').click();
  const started=await snap();assert.deepEqual(started.scene,initial.scene);assert.equal(started.timed.recording,true);
  assert.equal(started.timed.moves,0);assert.equal(started.connected,true);assert.equal(checks(),connectionChecks);
  record('Start recording resets scene and timer while preserving connection');await shot('06-recording');
  await send('Move the yellow pencil 10 mm to the left.');
  const recorded=await snap();assert.equal(recorded.timed.moves,1);
  const recordedRequest=report.requests.findLast(r=>r.question==='Move the yellow pencil 10 mm to the left.');
  assert.equal(recordedRequest.history.length,0,'Start clears practice conversation context');
  assert.equal(checks(),connectionChecks,'task/recording must not reconnect');
  await $('timed-finish').click();const saved=await snap();await shot('07-saved');
  const calls=report.requests.length;await $('timed-replay').click();await idle();
  assert.deepEqual((await snap()).scene,saved.scene);assert.equal(report.requests.length,calls);
  assert.equal((await snap()).connected,true);record('recorded move replays correctly without any API call');await shot('08-replay');
  await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.robotLabSnapshot);await idle();
  assert.equal((await snap()).connected,true);assert.equal((await snap()).timed.attemptMs,null);
  record('second page load reconnects automatically without button click');
  assert.deepEqual(report.errors,[]);report.passed=true;
}catch(error){report.passed=false;report.failure=error.message;console.error(error);process.exitCode=1;}
finally{
  if(output)await writeFile(path.join(output,'live-report-'+channel+'.json'),JSON.stringify(report,null,2));
  await browser.close();
}
