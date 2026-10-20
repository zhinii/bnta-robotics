import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const {chromium}=await import(process.env.BNTA_PLAYWRIGHT_PATH||'playwright');
let server,base=process.env.BNTA_PREVIEW_URL;
if(!base){
 const root=fileURLToPath(new URL('../../',import.meta.url));
 server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));if(!file.startsWith(root))throw Error();const body=await readFile(file);res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':file.endsWith('.mjs')||file.endsWith('.js')?'text/javascript':'text/plain'});res.end(body);}catch{res.writeHead(404);res.end();}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base='http://127.0.0.1:'+server.address().port+'/six-axis-agent/';
}
const output=process.env.BNTA_SCREENSHOTS;if(output)await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:960}}),errors=[],seen=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.SpeechRecognition=class {constructor(){window.testSpeech=this;}start(){}stop(){this.onend?.();}abort(){this.onend?.();}};
 });
 await page.route('https://bnta-robot-lab-connection.zhinii.chatgpt.site/api/chat',async route=>{
  const data=route.request().postDataJSON(),q=JSON.parse(data.messages.findLast(m=>m.role==='user'&&m.content.startsWith('{')).content);seen.push(q);
  let response={reply:q.language==='zh'?'你想让我拿起哪一个物品？':'Which object do you mean: the book, eraser, glue stick, pencil case or ruler?',actions:[]};
  const tasks={
   'pick up the eraser':[{type:'pick',object:'eraser'}],
   'put it on the book':[{type:'place',target:'book'}],
   'undo that':[{type:'undo'}],
   'put it back where it started':[{type:'place',target:'start'}],
   'stack the school things':[{type:'pick',object:'pencilcase'},{type:'place',target:'book'},{type:'pick',object:'eraser'},{type:'place',target:'pencilcase'}],
   'put everything back':[{type:'restore'}],
   'do a dance for me':[{type:'dance',style:'lively'}],
   'make a new pose':[{type:'move',position:[220,30,160],orientation:[5,-5,20]}],
   'move through the divider':[{type:'move',position:[70,135,70]}],
   'pick up the ruler':[{type:'pick',object:'ruler'}]
  };
  if(q.question==='connection_check')response={reply:'Hello',actions:[]};
  else if(q.feedback)response={reply:'I cannot take that path because the tall divider is in the way. Please choose another destination or a higher intermediate pose.',actions:[]};
  else if(tasks[q.question])response={reply:'I will '+q.question+'.',actions:tasks[q.question]};
  else if(q.question==='fly')response={reply:'I cannot fly: my base is fixed to the table. Would you like me to wave instead?',actions:[]};
  else if(q.question==='slow'){await new Promise(resolve=>setTimeout(resolve,1200));response={reply:'I will pick the book.',actions:[{type:'pick',object:'book'}]};}
  await route.fulfill({json:{choices:[{message:{content:JSON.stringify(response)}}]}}).catch(()=>{});
 });
 await page.goto(base);await page.waitForFunction(()=>!!window.robotLabSnapshot);assert.equal(await page.locator('#render-error').isVisible(),false);assert.equal(await page.locator('#scene canvas').count(),1);
 if(output)await page.screenshot({path:output+'/desktop-school-connect.png'});
 await page.locator('#api-key').fill('fake-browser-test-key');await page.locator('#send').click();await page.waitForFunction(()=>window.robotLabSnapshot().connected&&!window.robotLabSnapshot().busy);
 assert.ok(!(await page.locator('#messages').innerText()).includes('fake-browser-test-key'));assert.ok(!(await page.evaluate(()=>JSON.stringify(localStorage))).includes('fake-browser-test-key'));
 const scene=()=>page.evaluate(()=>window.robotLabSnapshot().scene),initial=await scene();
 const send=async text=>{await page.locator('#prompt').fill(text);await page.locator('#send').click();await page.waitForFunction(()=>!window.robotLabSnapshot().busy,{},{timeout:90000});console.log('Checked command:',text);};
 await send('pick this up');assert.deepEqual(await scene(),initial);
 await page.locator('#mic').click();assert.equal(await page.evaluate(()=>window.testSpeech.lang),'en-US');
 await page.evaluate(()=>{window.testSpeech.onresult({results:[[{transcript:'pick up the eraser'}]]});window.testSpeech.onend();});
 assert.equal(await page.locator('#prompt').inputValue(),'pick up the eraser');assert.deepEqual(await scene(),initial);
 await send('pick up the eraser');assert.equal((await scene()).held,'eraser');assert.match(await page.locator('#messages').innerText(),/Where would you like me to put it/);
 if(output){await page.waitForTimeout(250);await page.screenshot({path:output+'/desktop-gripping-eraser.png'});}
 await send('put it on the book');assert.equal((await scene()).objects.find(o=>o.id==='eraser').position[2],28);
 await send('undo that');assert.equal((await scene()).held,'eraser');
 await send('put it back where it started');assert.deepEqual((await scene()).objects.find(o=>o.id==='eraser').position,initial.objects.find(o=>o.id==='eraser').origin);
 await send('stack the school things');assert.equal((await scene()).objects.find(o=>o.id==='eraser').position[2],58);
 if(output){await page.waitForTimeout(250);await page.screenshot({path:output+'/desktop-school-stack.png'});}
 await send('put everything back');for(const o of (await scene()).objects)assert.deepEqual(o.position,o.origin);
 await send('do a dance for me');await send('make a new pose');
 const beforeFailure=await scene();await send('move through the divider');assert.deepEqual(await scene(),beforeFailure);assert.match(await page.locator('#messages').innerText(),/tall divider.*another destination/);assert.ok(seen.at(-1).feedback);
 await send('fly');assert.deepEqual(await scene(),beforeFailure);
 await page.locator('#reset').click();await page.locator('#prompt').fill('pick up the ruler');await page.locator('#send').click();await page.locator('#activity').filter({hasText:'Moving'}).waitFor();await page.waitForTimeout(500);await page.locator('#stop').click();
 const stopped=await scene();assert.equal(stopped.canUndo,false);await page.waitForTimeout(300);assert.deepEqual(await scene(),stopped);
 await page.locator('#reset').click();await page.locator('#prompt').fill('slow');await page.locator('#send').click();await page.locator('#stop').click();await page.waitForTimeout(1400);assert.deepEqual((await scene()).objects,initial.objects);
 await page.locator('#new-scene').click();assert.notDeepEqual((await scene()).objects.map(o=>o.position),initial.objects.map(o=>o.position));
 await page.locator('#challenge').click();assert.ok((await page.locator('#prompt').inputValue()).length>20);
 await page.locator('#language').click();await page.locator('#mic').click();assert.equal(await page.evaluate(()=>window.testSpeech.lang),'zh-CN');
 await page.evaluate(()=>{window.testSpeech.onerror({error:'not-allowed'});window.testSpeech.onend();});assert.match(await page.locator('#messages').innerText(),/权限被拒绝/);
 await send('拿起物品');assert.equal(seen.at(-1).language,'zh');
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.ok(await page.locator('#send').isVisible());assert.ok(await page.locator('#mic').isVisible());
 if(output)await page.screenshot({path:output+'/mobile-school-chinese.png',fullPage:true});
 await page.reload();await page.waitForFunction(()=>!!window.robotLabSnapshot);assert.equal(await page.evaluate(()=>window.robotLabSnapshot().language),'zh');assert.equal(await page.evaluate(()=>window.robotLabSnapshot().connected),false);
 assert.deepEqual(errors,[]);console.log('PASS: school objects, stack/restore, undo, custom pose, dance, specific refusal feedback, Stop, random arrangements, EN/ZH dictation review and denied permission, mobile, key exclusion. Provider and speech responses were mocked.');
}finally{await browser.close();server?.close();}
