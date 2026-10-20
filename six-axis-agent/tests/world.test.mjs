import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,planActions,applyStep,validateActions,AREAS,HOME,clearPose,reverseSteps,snapshot} from '../world.mjs';
import {toolPose,distance} from '../kinematics.mjs';
import {parseResponse,askAgent,DEFAULTS,RELAY,SYSTEM} from '../agent.mjs';
import {createSpeech} from '../speech.mjs';
const run=(s,actions)=>{const plan=planActions(s,actions);for(const step of plan.steps)applyStep(s,step);return plan;};
const sameObjects=(a,b)=>{for(const object of a.objects){const other=b.objects.find(o=>o.id===object.id);assert.ok(distance(object.position,other.position)<.15,object.id);assert.ok(distance(object.rpy,other.rpy)<.02,object.id);}};
test('all five school objects can go to every table side and return to their own starts',()=>{
 for(const id of initialState().objects.map(o=>o.id))for(const target of Object.keys(AREAS)){
  const s=initialState(),before=structuredClone(s),plan=planActions(s,[{type:'pick',object:id},{type:'place',target}]);assert.deepEqual(s,before);
  for(const step of plan.steps)applyStep(s,step);
  const object=s.objects.find(o=>o.id===id);assert.deepEqual(object.position,[...AREAS[target],object.size[2]/2]);assert.equal(s.held,null);
  run(s,[{type:'restore'}]);sameObjects(s,before);assert.ok(distance(toolPose(s.q).tip,HOME)<.2);
 }
});
test('school tower stacks on flat supports, refuses a covered object, and fully restores',()=>{
 const s=initialState(),before=structuredClone(s);
 run(s,[{type:'pick',object:'pencilcase'},{type:'place',target:'book'},{type:'pick',object:'eraser'},{type:'place',target:'pencilcase'}]);
 assert.equal(s.objects.find(o=>o.id==='eraser').position[2],58);assert.throws(()=>planActions(s,[{type:'pick',object:'book'}]),/covered/);
 run(s,[{type:'restore'}]);sameObjects(s,before);
});
test('all six three-block tower orders restore without reset',()=>{
 for(const base of ['red','blue','yellow'])for(const middle of ['red','blue','yellow'].filter(c=>c!==base)){
  const top=['red','blue','yellow'].find(c=>c!==base&&c!==middle),s=initialState(0,'blocks'),before=structuredClone(s);
  run(s,[{type:'pick',object:middle},{type:'place',target:base},{type:'pick',object:top},{type:'place',target:middle}]);
  assert.equal(s.objects.find(o=>o.id===top).position[2],90);run(s,[{type:'restore'}]);sameObjects(s,before);
 }
});
test('seeded arrangements keep named rear objects reachable and reversible',()=>{
 for(const seed of [1,42,139,896,3470])for(const object of ['book','eraser','glue','pencilcase','ruler']){
  const s=initialState(seed),before=structuredClone(s),plan=planActions(s,[{type:'pick',object},{type:'place',target:'start'}]);
  assert.ok(s.objects.some(o=>o.position[0]<0));
  const inverse=reverseSteps(s,plan.steps);for(const step of [...plan.steps,...inverse])applyStep(s,step);sameObjects(s,before);assert.deepEqual(s.q,before.q);
 }
});
test('return supports held objects and occupied starting locations using a temporary table position',()=>{
 const s=initialState(),before=structuredClone(s);
 run(s,[{type:'pick',object:'book'},{type:'place',target:'front'},{type:'pick',object:'eraser'},{type:'place',target:'book-start'},{type:'pick',object:'book'},{type:'place',target:'eraser-start'}]);
 run(s,[{type:'restore'}]);sameObjects(s,before);
 run(s,[{type:'pick',object:'ruler'},{type:'restore'}]);sameObjects(s,before);
});
test('undo reverses a full task, including grasp/release and wrist rotation',()=>{
 for(const actions of [[{type:'pick',object:'eraser'}],[{type:'pick',object:'book'},{type:'rotate',angle:30},{type:'place',target:'front'}],[{type:'wave'},{type:'bow'}]]){
  const s=initialState(),before=structuredClone(s),plan=planActions(s,actions),inverse=reverseSteps(s,plan.steps);
  for(const step of [...plan.steps,...inverse])applyStep(s,step);sameObjects(s,before);assert.deepEqual(s.q,before.q);assert.equal(s.held,before.held);
 }
});
test('stopping preserves the actual carried object and a fresh restore can finish',()=>{
 const s=initialState(),before=structuredClone(s),plan=planActions(s,[{type:'pick',object:'eraser'}]),grip=plan.steps.findIndex(x=>x.type==='grip');
 for(const step of plan.steps.slice(0,grip+4))applyStep(s,step);assert.equal(s.held,'eraser');assert.ok(distance(s.objects[1].position,toolPose(s.q).tip)<.01);
 run(s,[{type:'restore'}]);sameObjects(s,before);
});
test('gestures, free tool orientation and explicit joint poses obey limits',()=>{
 for(const action of [{type:'dance'},{type:'dance',style:'lively',repeat:2},{type:'wave',repeat:2},{type:'bow'}]){
  const s=initialState(),objects=structuredClone(s.objects);run(s,[action]);assert.deepEqual(s.objects,objects);assert.ok(distance(toolPose(s.q).tip,HOME)<.2);
 }
 const s=initialState();run(s,[{type:'move',position:[220,30,160],orientation:[5,-5,20]}]);assert.ok(distance(toolPose(s.q).tip,[220,30,160])<.2);
 const joints=[...s.q];joints[5]+=10;run(s,[{type:'pose',joints}]);assert.deepEqual(s.q,joints);
});
test('arbitrary table placement and relative placement use each object size',()=>{
 const s=initialState();run(s,[{type:'pick',object:'book'},{type:'place',beside:'eraser',side:'front'}]);
 assert.ok(s.objects[0].position[0]>s.objects[1].position[0]);run(s,[{type:'restore'},{type:'pick',object:'eraser'},{type:'place',position:[250,25]}]);
 assert.deepEqual(s.objects[1].position,[250,25,10]);
});
test('rejected actions are atomic and report actionable collision or support details',()=>{
 const s=initialState(),before=structuredClone(s);
 assert.throws(()=>planActions(s,[{type:'pick',object:'book'},{type:'place',target:'glue'}]),e=>e.message==='unstable'&&e.detail.support==='glue');
 assert.deepEqual(s,before);
 assert.throws(()=>planActions(s,[{type:'move',position:[70,135,70]}]),e=>e.message==='blocked'&&!!e.detail.blocker);
 assert.deepEqual(s,before);
 const held=planActions(s,[{type:'pick',object:'book'}]).result;
 assert.throws(()=>planActions(held,[{type:'dance'}]),/holding/);assert.throws(()=>planActions(held,[{type:'place',target:'book'}]),/selfStack/);
 for(const actions of [[{type:'constructor'}],[{type:'eval',code:'x'}],[{type:'pick',object:'scissors'}],[{type:'move',position:[Infinity,0,0]}],[{type:'place',position:[1,2,200]}],[{type:'dance',repeat:100}],[{type:'place',target:'__proto__'}]])assert.throws(()=>validateActions(actions));
});
test('perception includes object identities, shapes, starts and obstacles without requiring vision',()=>{
 const s=snapshot(initialState());assert.equal(s.objects.length,5);assert.ok(s.objects.every(o=>o.name&&o.origin&&o.size));assert.equal(s.obstacles.length,2);assert.ok(s.tableAreas.rear);assert.match(SYSTEM,/NO placement pads/);
});
test('agent replies, schema repair, planning feedback, and credential transport are bounded',async()=>{
 assert.deepEqual(parseResponse('{"reply":"Which object?","actions":[]}'),{reply:'Which object?',actions:[]});
 let calls=0;
 const result=await askAgent({...DEFAULTS,key:'fake-test-key'},{question:'wave',language:'zh',history:Array.from({length:20},()=>({role:'user',content:'好'.repeat(2500)})),scene:snapshot(initialState()),feedback:{error:'blocked',detail:{blocker:'tall divider'}}},undefined,async(url,init)=>{
  assert.equal(url,RELAY);assert.ok(!init.body.includes('fake-test-key'));assert.ok(Buffer.byteLength(init.body)<48000);
  const data=JSON.parse(init.body);assert.ok(data.messages.length<=14);assert.equal(data.messages[0].content.length<12000,true);
  const input=JSON.parse(data.messages.findLast(m=>m.role==='user'&&m.content.startsWith('{')).content);assert.equal(input.feedback.error,'blocked');assert.equal(input.language,'zh');
  calls++;return {ok:true,json:async()=>({choices:[{message:{content:calls===1?'{"reply":"Hi","actions":[{"type":"fly"}]}':'{"reply":"I will wave.","actions":[{"type":"wave"}],"after":"Hello!"}'}}]})};
 });
 assert.equal(calls,2);assert.equal(result.after,'Hello!');assert.equal(result.actions[0].type,'wave');
});
test('microphone transcribes selected language for review and never executes a command',()=>{
 let instance,text='',active=false,messages=[];
 class Recognition{constructor(){instance=this;}start(){}stop(){this.onend();}abort(){this.onend?.();}}
 const speech=createSpeech({Recognition,language:()=> 'zh',onText:value=>text=value,onState:value=>active=value,onMessage:value=>messages.push(value)});
 speech.start();assert.equal(instance.lang,'zh-CN');assert.equal(active,true);instance.onresult({results:[[{transcript:'拿起橡皮'}]]});assert.equal(text,'拿起橡皮');instance.onend();assert.equal(active,false);assert.equal(messages.at(-1),'speechReady');
 speech.start();instance.onerror({error:'not-allowed'});instance.onend();assert.equal(messages.at(-1),'speechDenied');
 speech.start();const old=instance;speech.abort();old.onresult({results:[[{transcript:'ignored'}]]});assert.equal(text,'拿起橡皮');
 createSpeech({language:()=> 'en',onText(){},onState(){},onMessage:value=>messages.push(value)}).start();assert.equal(messages.at(-1),'speechUnavailable');
});
