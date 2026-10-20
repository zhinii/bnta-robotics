import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,planActions,applyStep,validateActions,PADS,clearPose} from '../world.mjs';
import {toolPose,distance} from '../kinematics.mjs';
import {parseResponse,askAgent,DEFAULTS,RELAY,validateConnection} from '../agent.mjs';

test('all three blocks can be picked, placed on either pad and followed by home',()=>{
 for(const color of ['red','blue','yellow'])for(const target of ['left','right']){
  const s=initialState(),before=structuredClone(s);
  const p=planActions(s,[{type:'pick',object:color},{type:'place',target},{type:'home'}]);
  assert.deepEqual(s,before,'preflight must not mutate scene');
  for(const step of p.steps)applyStep(s,step);
  assert.equal(s.held,null);assert.deepEqual(s.objects.find(o=>o.id===color).position,PADS[target]);
  assert.ok(distance(toolPose(s.q).tip,[210,0,150])<.2);assert.equal(s.q.length,6);
 }
});
test('held object follows actual TCP and wrist rotation',()=>{
 const s=initialState();for(const step of planActions(s,[{type:'pick',object:'red'},{type:'rotate',angle:90}]).steps)applyStep(s,step);
 assert.equal(s.held,'red');assert.ok(distance(s.objects[0].position,toolPose(s.q).tip)<.001);assert.equal(s.yaw,90);
 assert.ok(Math.abs(s.q[5])>20,'wrist roll is actuated');assert.ok(clearPose(s.q,s));
});
test('occupied pads, duplicate picks, empty placement and unknown actions are refused atomically',()=>{
 const s=planActions(initialState(),[{type:'pick',object:'red'},{type:'place',target:'left'}]).result;
 const before=structuredClone(s);
 assert.throws(()=>planActions(s,[{type:'pick',object:'blue'},{type:'place',target:'left'}]),/occupied/);assert.deepEqual(s,before);
 assert.throws(()=>planActions(s,[{type:'place',target:'right'}]),/empty/);
 assert.throws(()=>planActions(s,[{type:'pick',object:'blue'},{type:'pick',object:'yellow'}]),/holding/);
 for(const a of [[{type:'eval',code:'x'}],[{type:'pick',object:'purple'}],[{type:'place',target:'__proto__'}],[{type:'rotate',angle:NaN}],[{type:'home',q:[1,2]}]])assert.throws(()=>validateActions(a));
});
test('a multi-pick plan retreats from the correct released cube',()=>{
 assert.doesNotThrow(()=>planActions(initialState(),[{type:'pick',object:'red'},{type:'place',target:'left'},{type:'pick',object:'blue'},{type:'place',target:'right'}]));
});
test('stopping mid-lift preserves held object and supports a fresh place plan',()=>{
 const s=initialState();const plan=planActions(s,[{type:'pick',object:'red'}]);const index=plan.steps.findIndex(x=>x.type==='grip');
 for(const step of plan.steps.slice(0,index+4))applyStep(s,step);
 assert.equal(s.held,'red');assert.ok(s.objects[0].position[2]>18);assert.ok(s.objects[0].position[2]<120);
 assert.doesNotThrow(()=>planActions(s,[{type:'place',target:'left'}]));
});
test('stopping immediately after release permits a clear retreat home',()=>{
 const s=initialState();const plan=planActions(s,[{type:'pick',object:'red'},{type:'place',target:'left'}]);
 const released=plan.steps.findIndex(x=>x.type==='release');for(const step of plan.steps.slice(0,released+1))applyStep(s,step);
 assert.equal(s.held,null);assert.doesNotThrow(()=>planActions(s,[{type:'home'}]));
});
test('AI reply is bounded, structured and cannot inject arbitrary commands',()=>{
 assert.deepEqual(parseResponse('```json\n{"reply":"Which block?","actions":[]}\n```'),{reply:'Which block?',actions:[]});
 assert.throws(()=>parseResponse('{"reply":"Done","actions":[{"type":"run","code":"alert(1)"}]}'));
 assert.throws(()=>parseResponse('{"reply":"Hello"}'));
});
test('Token Plan uses the designated relay with explicit language and actual scene; key stays out of messages',async()=>{
 let seen;
 const result=await askAgent({...DEFAULTS,key:'fake-test-key'},{question:'pick',language:'zh',history:[],scene:{held:'red'}},undefined,async(url,init)=>{
  seen={url,...init};return {ok:true,json:async()=>({choices:[{message:{content:'{"reply":"放在哪里？","actions":[]}'}}]})};
 });
 assert.equal(seen.url,RELAY);assert.equal(seen.headers['X-Alibaba-Base'],DEFAULTS.base);assert.ok(!seen.body.includes('fake-test-key'));
 const payload=JSON.parse(seen.body);assert.equal(JSON.parse(payload.messages.at(-1).content).language,'zh');assert.equal(result.actions.length,0);
 assert.throws(()=>validateConnection({...DEFAULTS,key:'test',base:'https://evil.example/api'}));
});
