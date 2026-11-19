// Real AI browser check. BNTA_LOCAL_SOURCE=1 rehearses local files at the
// GitHub origin; omit it to verify the actual published assets end to end.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.BNTA_PLAYWRIGHT_PATH||'playwright');
const url=process.env.BNTA_LIVE_URL||'https://zhinii.github.io/bnta-robotics/six-axis-agent/';
const output=process.env.BNTA_SCREENSHOTS,root=fileURLToPath(new URL('../',import.meta.url));
if(output)await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
const report={url,localSource:process.env.BNTA_LOCAL_SOURCE==='1',checks:[],errors:[],network:[]};
try{
 const page=await browser.newPage({viewport:{width:1180,height:820}});
 page.on('pageerror',error=>report.errors.push(error.message));
 page.on('response',r=>{if(r.url().includes('/api/chat'))report.network.push(r.status());});
 if(report.localSource)await page.route('https://zhinii.github.io/bnta-robotics/six-axis-agent/**',async route=>{
  const name=decodeURIComponent(new URL(route.request().url()).pathname.split('/six-axis-agent/')[1]||'index.html'),file=path.resolve(root,name);
  if(!file.startsWith(root))return route.abort();
  try{const body=await readFile(file);await route.fulfill({body,contentType:file.endsWith('.html')?'text/html':file.endsWith('.mjs')?'text/javascript':file.endsWith('.css')?'text/css':'image/png'});}catch{await route.abort();}
 });
 const $=id=>page.locator('#'+id),snap=()=>page.evaluate(()=>window.robotLabSnapshot());
 const idle=()=>page.waitForFunction(()=>!window.robotLabSnapshot().busy&&!window.robotLabSnapshot().connecting,null,{timeout:110000});
 const shot=async name=>{if(output)await page.screenshot({path:path.join(output,name+'.png'),fullPage:true});};
 await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});await page.waitForFunction(()=>!!window.robotLabSnapshot);await idle();
 assert.equal((await snap()).connected,true,await $('messages').innerText());
 const version=await page.locator('body').getAttribute('data-version');report.version=version;
 for(const [language,command] of [['en','Pick up the blue book and drop it off the desk.'],['zh','拿起蓝色的书，把它从桌子前沿扔下去。']]){
  if((await snap()).language!==language)await $('language').click();
  if(language==='zh')await $('timed-start').click();
  const initial=(await snap()).scene;
  await $('prompt').fill(command);await $('send').click();
  await page.waitForFunction(()=>!window.robotLabSnapshot().busy||!document.getElementById('preview-panel').hidden,null,{timeout:90000});
  assert.equal(await $('preview-run').isVisible(),true,await $('messages').innerText());
  assert.deepEqual((await snap()).scene,initial,'preview cannot move the desk');await shot(language+'-preview');
  await $('preview-run').click();await idle();
  const actual=await snap(),object=actual.scene.objects.find(o=>o.id==='notebook');
  assert.equal(object.location,'floor');assert.equal(actual.scene.held,null);
  assert.match(await $('messages').locator('.latest-reply').innerText(),language==='en'?/landed on the floor/:/落在地板/);
  if(language==='en')assert.equal(actual.timed.attemptMs,null,'practice remains unrecorded');
  else assert.equal(actual.timed.moves,1,'a falling object is captured as one recorded command');
  report.checks.push({language,command,position:object.position,location:object.location,reply:await $('messages').locator('.latest-reply').innerText()});
  console.log('PASS',language,object.location);await shot(language+'-landed');
  if(language==='zh'){
   await $('timed-finish').click();const networkCount=report.network.length;
   await $('timed-replay').click();await idle();
   assert.equal((await snap()).scene.objects.find(o=>o.id==='notebook').location,'floor');
   assert.deepEqual((await snap()).scene.objects.map(o=>o.position),actual.scene.objects.map(o=>o.position));
   assert.equal(report.network.length,networkCount,'replay uses no AI calls');
   report.checks.push({recordedFallReplay:true});console.log('PASS recorded fall replay');await shot('recorded-fall-replay');continue;
  }
  await $('session-options').locator('summary').click();await $('reset').click();await idle();
  assert.equal((await snap()).scene.objects.find(o=>o.id==='notebook').location,'desk');
  if(await $('session-options').getAttribute('open')!==null)await $('session-options').locator('summary').click();
 }
 assert.deepEqual(report.errors,[]);report.passed=true;
}catch(error){report.passed=false;report.error=error.message;console.error(error);process.exitCode=1;}
finally{if(output)await writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));await browser.close();}
