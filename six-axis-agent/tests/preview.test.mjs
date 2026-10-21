import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,planActions,previewSteps,applyStep,clearPose,reverseSteps} from '../world.mjs';
import {askAgent,DEFAULTS,parseResponse} from '../agent.mjs';

test('preview records intermediate placements and never changes scene or undo input',()=>{
 const s=initialState(0,'desk'),before=structuredClone(s);
 const p=planActions(s,[{type:'transfer',object:'book',target:'shelf-left'},{type:'restore'}]);
 const preview=previewSteps(s,p.steps);
 assert.deepEqual(s,before);assert.deepEqual(preview.state,p.result);
 assert.ok(preview.destinations.some(o=>o.id==='book'&&o.position[2]===37));
 assert.ok(preview.destinations.some(o=>o.id==='book'&&o.position[2]===9));
 assert.ok(preview.path.length>2);assert.equal(preview.kind,'ready');
 const inverse=reverseSteps(s,p.steps);previewSteps(p.result,inverse);assert.deepEqual(s,before);
});
test('occupied placement identifies the actual blocker and failed action without moving',()=>{
 const s=initialState(0,'desk'),before=structuredClone(s);
 assert.throws(()=>planActions(s,[{type:'pick',object:'book'},{type:'place',target:'notebook-start'}]),e=>{
  assert.equal(e.message,'occupied');assert.equal(e.preview.blocker,'notebook');assert.equal(e.preview.actionIndex,1);
  assert.equal(e.preview.kind,'collision');assert.equal(e.preview.showArm,false);
  assert.equal(e.preview.destinations[0].id,'book');assert.deepEqual(e.preview.destinations[0].position.slice(0,2),s.objects.find(o=>o.id==='notebook').position.slice(0,2));return true;
 });assert.deepEqual(s,before);
});
test('red ghost is an actual rejected collision sample, unreachable targets have no invented arm pose',()=>{
 const s=initialState(0,'desk'),before=structuredClone(s);
 assert.throws(()=>planActions(s,[{type:'move',position:[210,200,100]}]),e=>{
  assert.equal(e.preview.kind,'collision');assert.equal(e.preview.showArm,true);
  const detail={};assert.equal(clearPose(e.preview.state.q,e.preview.state,e.detail.contact,detail),false);assert.equal(e.preview.blocker,detail.blocker);return true;
 });
 assert.throws(()=>planActions(s,[{type:'move',position:[330,0,320]}]),e=>{assert.equal(e.preview.kind,'reach');assert.equal(e.preview.showArm,false);assert.ok(e.preview.target);return true;});assert.deepEqual(s,before);
});
test('both pen/pencil beside requests work without specifying a side, including an already-held pencil',()=>{
 for(const [object,beside] of [['pen','pencil'],['pencil','pen']]){
  const s=initialState(0,'desk'),before=structuredClone(s),anchor=structuredClone(s.objects.find(o=>o.id===beside));
  const p=planActions(s,[{type:'transfer',object,beside}]);assert.deepEqual(s,before);
  assert.equal(p.result.held,null);assert.deepEqual(p.result.objects.find(o=>o.id===beside),anchor);
  assert.ok(Math.hypot(...p.result.objects.find(o=>o.id===object).position.slice(0,2).map((v,i)=>v-anchor.position[i]))<150);
 }
 const s=initialState(0,'desk');for(const step of planActions(s,[{type:'pick',object:'pencil'}]).steps)applyStep(s,step);
 assert.equal(planActions(s,[{type:'place',beside:'pen',side:'auto'}]).result.held,null);
 assert.equal(parseResponse('{"reply":"I will find a clear side.","actions":[{"type":"transfer","object":"pencil","beside":"pen"}]}').actions[0].beside,'pen');
});
test('yes cannot select a pen or pencil after an either/or clarification',async()=>{
 const response=await askAgent({...DEFAULTS,key:'fake-test-key'},{question:'yes',language:'en',scene:initialState(0,'desk'),history:[{role:'assistant',content:"I do not see penvil. Did you mean the blue pen or the yellow pencil?"}]},undefined,()=>{throw Error('must not guess via network');});
 assert.deepEqual(response.actions,[]);assert.match(response.reply,/Which object/);
});
test('one transient connection failure is retried, but authentication failures are not',async()=>{
 const config={...DEFAULTS,key:'fake-test-key'},input={question:'connection_check',language:'en',scene:initialState(0,'desk'),history:[]};let calls=0;
 const answer=await askAgent(config,input,undefined,async()=>{if(++calls===1)throw new TypeError('network');return {ok:true,json:async()=>({choices:[{message:{content:'{"reply":"Ready","actions":[]}'}}]})};});
 assert.equal(calls,2);assert.deepEqual(answer.actions,[]);calls=0;
 await assert.rejects(askAgent(config,input,undefined,async()=>{calls++;return {ok:false,status:401};}),/auth/);assert.equal(calls,1);
});
