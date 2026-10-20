import assert from 'node:assert/strict';
import { mkdir,readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const { chromium }=await import(process.env.BNTA_PLAYWRIGHT_PATH||'playwright');
let server;
let base=process.env.BNTA_PREVIEW_URL;
if(!base){
 const root=fileURLToPath(new URL('../../',import.meta.url));
 server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));if(!file.startsWith(root))throw Error();const body=await readFile(file);res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':file.endsWith('.mjs')||file.endsWith('.js')?'text/javascript':'text/plain'});res.end(body);}catch{res.writeHead(404);res.end();}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base=`http://127.0.0.1:${server.address().port}/six-axis-agent/`;
}
const output=process.env.BNTA_SCREENSHOTS;
if(output)await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
const errors=[];
try {
 const page=await browser.newPage({viewport:{width:1440,height:960}});
 page.on('pageerror',e=>errors.push(e.message));
 let seen=[];
 await page.route('https://bnta-robot-lab-connection.zhinii.chatgpt.site/api/chat',async route=>{
  const request=route.request(),data=request.postDataJSON();const q=JSON.parse(data.messages.at(-1).content);seen.push(q);
  let response={reply:'Which block would you like me to pick up?',actions:[]};
  if(q.question==='connection_check')response={reply:'Connected',actions:[]};
  else if(q.question==='pick red')response={reply:'I will pick up the red block.',actions:[{type:'pick',object:'red'}]};
  else if(q.question==='left')response={reply:'I will place it on the left pad.',actions:[{type:'place',target:'left'}]};
  else if(q.question==='fly')response={reply:'I cannot fly. I can pick up a block.',actions:[]};
  else if(q.question==='invalid')response={reply:'Oops',actions:[{type:'execute',code:'x'}]};
  else if(q.question==='pick blue')response={reply:'I will pick up blue.',actions:[{type:'pick',object:'blue'}]};
  else if(q.question==='slow'){await new Promise(r=>setTimeout(r,1200));response={reply:'I will pick blue.',actions:[{type:'pick',object:'blue'}]};}
  else if(q.language==='zh')response={reply:'你想让我拿起哪个颜色的方块？',actions:[]};
  await route.fulfill({json:{choices:[{message:{content:JSON.stringify(response)}}]}}).catch(()=>{});
 });
 await page.goto(base);await page.waitForFunction(()=>!!window.robotLabSnapshot);
 assert.equal(await page.locator('#scene canvas').count(),1);assert.equal(await page.locator('#render-error').isVisible(),false);
 if(output)await page.screenshot({path:output+'/desktop-connect.png'});
 await page.locator('#api-key').fill('fake-browser-test-key');await page.locator('#send').click();
 await page.waitForFunction(()=>window.robotLabSnapshot().connected&&!window.robotLabSnapshot().busy);
 assert.ok(!(await page.locator('#messages').innerText()).includes('fake-browser-test-key'));
 assert.ok(!(await page.evaluate(()=>JSON.stringify(localStorage))).includes('fake-browser-test-key'));
 const initial=await page.evaluate(()=>window.robotLabSnapshot().scene);
 const send=async text=>{await page.locator('#prompt').fill(text);await page.locator('#send').click();await page.waitForFunction(()=>!window.robotLabSnapshot().busy,{},{timeout:20000});};
 await send('pick the block');assert.deepEqual(await page.evaluate(()=>window.robotLabSnapshot().scene),initial);
 await send('pick red');assert.equal((await page.evaluate(()=>window.robotLabSnapshot().scene)).held,'red');
 assert.match(await page.locator('#messages').innerText(),/Where would you like me to put it/);
 if(output)await page.screenshot({path:output+'/desktop-holding.png'});
 await send('left');let s=await page.evaluate(()=>window.robotLabSnapshot().scene);assert.equal(s.held,null);assert.deepEqual(s.objects[0].position,[175,-145,18]);
 assert.equal(seen.find(q=>q.question==='left').scene.held,'red');
 await send('fly');assert.deepEqual(await page.evaluate(()=>window.robotLabSnapshot().scene),s);
 await send('invalid');assert.deepEqual(await page.evaluate(()=>window.robotLabSnapshot().scene),s);
 await page.locator('#prompt').fill('pick blue');await page.locator('#send').click();await page.locator('#activity').filter({hasText:'Moving'}).waitFor();
 await page.waitForTimeout(500);await page.locator('#stop').click();
 const stopped=await page.evaluate(()=>window.robotLabSnapshot().scene);await page.waitForTimeout(300);assert.deepEqual(await page.evaluate(()=>window.robotLabSnapshot().scene),stopped);
 await page.locator('#reset').click();assert.deepEqual(await page.evaluate(()=>window.robotLabSnapshot().scene),initial);
 await page.locator('#prompt').fill('slow');await page.locator('#send').click();await page.locator('#stop').click();await page.waitForTimeout(1400);
 assert.deepEqual(await page.evaluate(()=>window.robotLabSnapshot().scene),initial);
 await page.locator('#language').click();await send('拿起方块');assert.equal(seen.at(-1).language,'zh');
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.ok(await page.locator('#send').isVisible());assert.ok(await page.locator('#prompt').isVisible());
 if(output)await page.screenshot({path:output+'/mobile-chinese.png',fullPage:true});
 await page.reload();await page.waitForFunction(()=>!!window.robotLabSnapshot);
 assert.equal(await page.evaluate(()=>window.robotLabSnapshot().language),'zh');assert.equal(await page.evaluate(()=>window.robotLabSnapshot().connected),false);
 await page.locator('#language').click();
 if(output)await page.screenshot({path:output+'/mobile-connect.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('PASS: real WebGL rendering; key excluded from chat/storage; ambiguity; pick/place; state-aware follow-up; refusal; invalid action; stop during movement/request; reset; Chinese language; mobile layout. Provider replies were mocked.');
} finally {await browser.close();server?.close();}
