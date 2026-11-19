// Real hosted-model scenarios. No keys or mocked AI responses.
// Run explicitly with BNTA_LIVE_SCENARIOS=1; output remains outside the repo.
import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {askAgent} from '../agent.mjs';
import {initialState,snapshot,planActions} from '../world.mjs';
import {checkTaskOutcome,dropCompletion} from '../task-intent.mjs';

if(process.env.BNTA_LIVE_SCENARIOS!=='1')throw Error('Set BNTA_LIVE_SCENARIOS=1 to use the real hosted AI.');
const scenarios=[
 {id:'off-desk',question:'Pick up the blue book and drop it off the desk.',expect:s=>assert.equal(s.objects.find(o=>o.id==='notebook').location,'floor')},
 {id:'off-front',question:'Drop the red book off the front edge of the desk.',expect:s=>{const o=s.objects.find(o=>o.id==='book');assert.equal(o.location,'floor');assert.ok(o.bounds.high[1]<s.deskBounds.min[1]);}},
 {id:'release-here',held:'notebook',question:'Drop it right here.',expect:s=>assert.equal(s.objects.find(o=>o.id==='notebook').location,'desk')},
 {id:'put-down',held:'notebook',question:'Put it down.',expect:s=>{assert.equal(s.held,null);assert.equal(s.objects.find(o=>o.id==='notebook').location,'desk');}},
 {id:'nudge-question',question:'Nudge the blue book to the right.',clarify:true},
 {id:'ambiguous-book',question:'Pick up the book.',clarify:true},
 {id:'measured-shift',question:'Move the blue pen 10 mm to the right.',expect:(s,b)=>assert.ok(Math.abs(s.objects.find(o=>o.id==='pen').position[0]-b.objects.find(o=>o.id==='pen').position[0]-10)<.2)},
 {id:'negative-drop',question:"Don't drop the blue book off the desk. Put it on the shelf.",expect:s=>assert.equal(s.objects.find(o=>o.id==='notebook').onShelf,true)},
 {id:'drop-on-laptop',question:'Pick up the red book and drop it on the laptop.',expect:s=>{const o=s.objects.find(o=>o.id==='book');assert.ok(o.position[2]>o.size[2]/2);assert.notEqual(o.location,'floor');}},
 {id:'chinese-drop',question:'拿起蓝色的书，把它从桌子前沿扔下去。',language:'zh',expect:s=>assert.equal(s.objects.find(o=>o.id==='notebook').location,'floor')},
 {id:'blocked-wall-edge',question:'Drop the red book off the back edge of the desk, by the wall.',reject:['blocked','reach','planningTimeout']},
 {id:'occupied-shelf',setup:[{type:'transfer',object:'notebook',target:'shelf'}],question:'Put the red book on the shelf too, in an empty spot.',expect:s=>{assert.equal(s.objects.find(o=>o.id==='book').onShelf,true);assert.equal(s.objects.find(o=>o.id==='notebook').onShelf,true);}},
 {id:'loaded-holder',setup:[{type:'transfer',object:'pen',target:'pen-holder'},{type:'transfer',object:'pencil',target:'pen-holder'}],question:'Put the holder on the shelf with the pen and pencil still inside.',expect:s=>{assert.equal(s.objects.find(o=>o.id==='pen-holder').onShelf,true);for(const id of ['pen','pencil'])assert.equal(s.objects.find(o=>o.id===id).location,'inside-holder');}},
 {id:'nudge-followup',question:'10 millimetres.',history:[{role:'user',content:'Nudge the blue book to the right.'},{role:'assistant',content:'How far should I move it?'}],expect:(s,b)=>assert.ok(Math.abs(s.objects.find(o=>o.id==='notebook').position[0]-b.objects.find(o=>o.id==='notebook').position[0]-10)<.2)},
 {id:'greeting',question:'hello, wave to me!',expect:(s,b)=>{assert.deepEqual(s.objects.map(o=>o.position),b.objects.map(o=>o.position));assert.equal(s.held,null);}},
 {id:'hypothetical',question:'What would happen if I dropped the blue book off the desk?',noMove:true},
];
const selected=process.env.BNTA_SCENARIOS?.split(',');
const results=[];
let browser,page,lastRequest=0;
if(process.env.BNTA_SCENARIO_BROWSER==='1'){
 const {chromium}=await import(process.env.BNTA_PLAYWRIGHT_PATH||'playwright');
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
 page=await browser.newPage();await page.goto('https://zhinii.github.io/bnta-robotics/six-axis-agent/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!!window.robotLabSnapshot&&!window.robotLabSnapshot().connecting,null,{timeout:110000});
}
for(const scenario of scenarios.filter(s=>!selected||selected.includes(s.id))){
 const entry={id:scenario.id,question:scenario.question};
 try{
  let state=initialState(0,'desk');
  if(scenario.setup)state=planActions(state,scenario.setup).result;
  if(scenario.held)state=planActions(state,[{type:'pick',object:scenario.held}]).result;
  const before=snapshot(state),started=performance.now();
  const response=await askAgent({hosted:true},{question:scenario.question,language:scenario.language||'en',history:scenario.history||[],scene:before},AbortSignal.timeout(45000),async(url,init)=>{
   const pause=6000-(Date.now()-lastRequest);if(pause>0)await new Promise(resolve=>setTimeout(resolve,pause));lastRequest=Date.now();
   const reply=page?await page.evaluate(async({url,body,headers})=>{const r=await fetch(url,{method:'POST',headers,body,signal:AbortSignal.timeout(35000)});return {status:r.status,body:await r.text()};},{url,body:init.body,headers:init.headers}).then(r=>new Response(r.body,{status:r.status})):await fetch(url,{...init,headers:{...init.headers,Origin:'https://zhinii.github.io'}});
   (entry.httpStatus||=[]).push(reply.status);
   if(reply.ok){const data=await reply.clone().json();(entry.rawReplies||=[]).push(data.choices?.[0]?.message?.content);}
   return reply;
  });
  entry.response=response;
  if(scenario.clarify||scenario.noMove){assert.equal(response.actions.length,0);if(scenario.clarify)assert.match(response.reply,/[?？]/u);}
  else{
   assert.ok(response.actions.length,'movement request must execute or explain a concrete constraint');
   let plan;try{plan=planActions(state,response.actions);}catch(error){if(scenario.reject?.includes(error.message)){entry.rejected={reason:error.message,detail:error.detail};entry.passed=true;results.push(entry);console.log(JSON.stringify(entry));continue;}throw error;}
   assert.ok(!scenario.reject,'this request must be rejected without passing through the wall');
   const after=snapshot(plan.result);checkTaskOutcome(response.goal,after);entry.completion=dropCompletion(response.actions,after,scenario.language||'en',before.held)||response.after;entry.after=after.objects.map(({id,position,location,onShelf,restingOn})=>({id,position,location,onShelf,restingOn}));
   entry.steps=plan.steps.length;scenario.expect(after,before);
  }
  entry.ms=Math.round(performance.now()-started);entry.passed=true;
 }catch(error){entry.passed=false;entry.error=error.message;entry.detail=error.detail;}
 results.push(entry);console.log(JSON.stringify(entry));
}
if(process.env.BNTA_SCENARIO_REPORT){await mkdir(path.dirname(process.env.BNTA_SCENARIO_REPORT),{recursive:true});await writeFile(process.env.BNTA_SCENARIO_REPORT,JSON.stringify(results,null,2));}
await browser?.close();
if(results.some(r=>!r.passed))process.exitCode=1;
