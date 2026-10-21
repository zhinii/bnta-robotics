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
  let response={reply:q.language==='zh'?'你想让我拿起哪一个物品？':'Which object do you mean: the red book, blue notebook, pen or pencil?',actions:[]};
  const tasks={
   'pick up the notebook':[{type:'pick',object:'notebook'}],
   'put it on the book':[{type:'place',target:'book'}],
   'undo that':[{type:'undo'}],
   'put it back where it started':[{type:'place',target:'start'}],
   'stack the school things':[{type:'pick',object:'book'},{type:'place',target:'shelf-left'},{type:'pick',object:'notebook'},{type:'place',target:'book'}],
   'put everything back':[{type:'restore'}],
   'do a dance for me':[{type:'dance',style:'lively'}],
   'make a new pose':[{type:'move',position:[220,30,160],orientation:[5,-5,20]}],
   'move toward the wall':[{type:'move',position:[210,200,100]}],
   'pick up the pencil':[{type:'pick',object:'pencil'}]
  };
  if(q.question==='connection_check')response={reply:'Hello',actions:[]};
  else if(q.feedback)response={reply:'I cannot take that path because the tall divider is in the way. Please choose another destination or a higher intermediate pose.',actions:[]};
  else if(tasks[q.question])response={reply:'I will '+q.question+'.',actions:tasks[q.question]};
  else if(q.question==='fly')response={reply:'I cannot fly: my base is fixed to the table. Would you like me to wave instead?',actions:[]};
  else if(q.question==='slow'){await new Promise(resolve=>setTimeout(resolve,1200));response={reply:'I will pick the book.',actions:[{type:'pick',object:'book'}]};}
  await route.fulfill({json:{choices:[{message:{content:JSON.stringify(response)}}]}}).catch(()=>{});
 });
 await page.goto(base);await page.waitForFunction(()=>!!window.robotLabSnapshot);assert.equal(await page.locator('#render-error').isVisible(),false);assert.equal(await page.locator('#scene canvas').count(),1);
 assert.equal((await page.evaluate(()=>window.robotLabSnapshot().scene)).objects.length,5);
 if(output)await page.screenshot({path:output+'/desktop-bedroom-connect.png'});
 assert.equal(await page.locator('#kit').count(),0);assert.equal(await page.locator('#new-scene').count(),0);assert.ok(!(await page.locator('header').innerText()).includes('BNTA'));
 await page.locator('#api-key').fill('fake-browser-test-key');await page.locator('#send').click();await page.waitForFunction(()=>window.robotLabSnapshot().connected&&!window.robotLabSnapshot().busy);
 assert.ok(!(await page.locator('#messages').innerText()).includes('fake-browser-test-key'));assert.ok(!(await page.evaluate(()=>JSON.stringify(localStorage))).includes('fake-browser-test-key'));
 const scene=()=>page.evaluate(()=>window.robotLabSnapshot().scene),initial=await scene();
 const send=async text=>{const before=await scene();await page.locator('#prompt').fill(text);await page.locator('#send').click();await page.waitForFunction(()=>!window.robotLabSnapshot().busy||!document.getElementById('preview-panel').hidden&&!document.getElementById('preview-run').hidden,{},{timeout:90000});if(await page.locator('#preview-run').isVisible()){assert.deepEqual(await scene(),before);await page.locator('#preview-run').click();}await page.waitForFunction(()=>!window.robotLabSnapshot().busy,{},{timeout:90000});console.log('Checked command:',text);};
 await send('pick this up');assert.deepEqual(await scene(),initial);
 await page.locator('#mic').click();assert.equal(await page.evaluate(()=>window.testSpeech.lang),'en-US');
 await page.evaluate(()=>{window.testSpeech.onresult({results:[[{transcript:'pick up the notebook'}]]});window.testSpeech.onend();});
 assert.equal(await page.locator('#prompt').inputValue(),'pick up the notebook');assert.deepEqual(await scene(),initial);
 await send('pick up the notebook');assert.equal((await scene()).held,'notebook');assert.match(await page.locator('#messages').innerText(),/Where would you like me to put it/);
 if(output){await page.waitForTimeout(250);await page.screenshot({path:output+'/desktop-gripping-notebook.png'});}
 await send('put it on the book');assert.equal((await scene()).objects.find(o=>o.id==='notebook').position[2],28);
 await send('undo that');assert.equal((await scene()).held,'notebook');
 await send('put it back where it started');assert.deepEqual((await scene()).objects.find(o=>o.id==='notebook').position,initial.objects.find(o=>o.id==='notebook').origin);
 await send('stack the school things');assert.equal((await scene()).objects.find(o=>o.id==='notebook').position[2],56);
 if(output){await page.waitForTimeout(250);await page.screenshot({path:output+'/desktop-school-stack.png'});}
 await send('put everything back');for(const o of (await scene()).objects)assert.deepEqual(o.position,o.origin);
 await send('do a dance for me');await send('make a new pose');
 const beforeFailure=await scene();await send('move toward the wall');assert.deepEqual(await scene(),beforeFailure);assert.equal(await page.locator('#preview-panel').getAttribute('data-kind'),'collision');assert.equal(await page.locator('#preview-run').isVisible(),false);assert.equal(seen.at(-1).feedback,undefined);
 await send('fly');assert.deepEqual(await scene(),beforeFailure);
 await page.locator('#reset').click();await page.locator('#prompt').fill('pick up the pencil');await page.locator('#send').click();await page.locator('#preview-run').click();await page.locator('#activity').filter({hasText:'Moving'}).waitFor();await page.waitForTimeout(500);await page.locator('#stop').click();
 const stopped=await scene();assert.equal(stopped.canUndo,false);await page.waitForTimeout(300);assert.deepEqual(await scene(),stopped);
 await page.locator('#reset').click();await page.locator('#prompt').fill('slow');await page.locator('#send').click();await page.locator('#stop').click();await page.waitForTimeout(1400);assert.deepEqual((await scene()).objects,initial.objects);
 await page.locator('#reset').click();assert.deepEqual((await scene()).objects,initial.objects);
 await page.locator('#challenge').click();assert.ok((await page.locator('#prompt').inputValue()).length>20);
 await page.locator('#language').click();await page.locator('#mic').click();assert.equal(await page.evaluate(()=>window.testSpeech.lang),'zh-CN');
 await page.evaluate(()=>{window.testSpeech.onerror({error:'not-allowed'});window.testSpeech.onend();});assert.match(await page.locator('#messages').innerText(),/权限被拒绝/);
 await send('拿起物品');assert.equal(seen.at(-1).language,'zh');
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.ok(await page.locator('#send').isVisible());assert.ok(await page.locator('#mic').isVisible());
 if(output)await page.screenshot({path:output+'/mobile-school-chinese.png',fullPage:true});
 await page.reload();await page.waitForFunction(()=>!!window.robotLabSnapshot);assert.equal(await page.evaluate(()=>window.robotLabSnapshot().language),'zh');assert.equal(await page.evaluate(()=>window.robotLabSnapshot().connected),false);
 assert.deepEqual(errors,[]);console.log('PASS: desk objects, preview before execution, collision feedback, simplified header, stack/restore, undo, custom pose, dance, Stop, EN/ZH dictation, mobile, key exclusion. Provider and speech responses were mocked.');
}finally{await browser.close();server?.close();}
