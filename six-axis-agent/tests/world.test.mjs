import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,planActions,applyStep,validateActions,AREAS,HOME,HOMES,DESK,clearPose,reverseSteps,snapshot,objectPosture,postureOrientations} from '../world.mjs';
import {toolPose,distance} from '../kinematics.mjs';
import {parseResponse,askAgent,DEFAULTS,RELAY,SYSTEM} from '../agent.mjs';
import {createSpeech} from '../speech.mjs';
const run=(s,actions)=>{const plan=planActions(s,actions);for(const step of plan.steps)applyStep(s,step);return plan;};
const sameObjects=(a,b)=>{for(const object of a.objects){const other=b.objects.find(o=>o.id===object.id);assert.ok(distance(object.position,other.position)<.15,object.id);assert.ok(distance(object.rpy,other.rpy)<.02,object.id);}};
test('all desk objects stand upright on the shelf with geometric support, undo and restore',()=>{
 for(const id of initialState(0,'desk').objects.map(o=>o.id)){
  const s=initialState(0,'desk'),before=structuredClone(s),p=run(s,[{type:'transfer',object:id,target:'shelf-middle',posture:'short-edge'}]),o=s.objects.find(o=>o.id===id);
  assert.equal(objectPosture(o),'short-edge',id);
  assert.equal(o.position[2],28+Math.max(...o.size)/2,id);
  const inverse=reverseSteps(before,p.steps),back=structuredClone(s);for(const step of inverse)applyStep(back,step);sameObjects(back,before);assert.equal(back.held,null);
  run(s,[{type:'restore'}]);sameObjects(s,before);
 }
});
test('held notebook can stand on its short edge at pickup or shelf and undo returns the same grip',()=>{
 for(const target of ['start','shelf-left']){
  const s=initialState(0,'desk');run(s,[{type:'pick',object:'notebook'}]);const before=structuredClone(s);
  const p=run(s,[{type:'place',target,posture:'short-edge'}]);assert.equal(objectPosture(s.objects.find(o=>o.id==='notebook')),'short-edge');
  for(const step of reverseSteps(before,p.steps))applyStep(s,step);sameObjects(s,before);assert.equal(s.held,'notebook');assert.deepEqual(s.grasp,before.grasp);
 }
});
test('both books can rest on the long edge and be laid flat again without a yaw-only substitute',()=>{
 for(const id of ['book','notebook']){
  const s=initialState(0,'desk'),before=structuredClone(s);run(s,[{type:'transfer',object:id,target:'shelf-middle',posture:'long-edge'}]);
  const o=s.objects.find(o=>o.id===id);assert.equal(objectPosture(o),'long-edge');assert.equal(o.position[2],28+[...o.size].sort((a,b)=>a-b)[1]/2);
  run(s,[{type:'restore'}]);sameObjects(s,before);
 }
 const book=initialState().objects[0];assert.equal(objectPosture({...book,rpy:[0,0,90]}),'flat');
 for(const orientation of postureOrientations(book,'short-edge'))assert.equal(objectPosture({...book,rpy:orientation}),'short-edge');
 assert.throws(()=>validateActions([{type:'place',target:'start',posture:'short-edge',orientation:[0,0,90]}]),/angle/);
 assert.equal(parseResponse('{"reply":"I will stand it up.","actions":[{"type":"transfer","object":"notebook","target":"shelf-left","posture":"short-edge"}]}').actions[0].posture,'short-edge');
});
test('upright books are not advertised as broad stacking supports and blocked posture tasks are atomic',()=>{
 const s=initialState(0,'desk');run(s,[{type:'transfer',object:'book',target:'shelf-middle',posture:'short-edge'}]);const before=structuredClone(s);
 assert.equal(snapshot(s).objects.find(o=>o.id==='book').stackable,false);
 assert.throws(()=>planActions(s,[{type:'transfer',object:'notebook',target:'book'}]),/unstable/);assert.deepEqual(s,before);
 assert.throws(()=>planActions(s,[{type:'transfer',object:'notebook',target:'rear',posture:'short-edge'}]),/posture/);assert.deepEqual(s,before);
});
test('90 degree X, Y and Z turns preserve the requested axis and can restore or undo',()=>{
 for(const [axis,index] of [['x',0],['y',1],['z',2]]){
  const s=initialState(0,'desk'),before=structuredClone(s),actions=[{type:'pick',object:'book'},{type:'rotate',axis,angle:90}];
  const plan=planActions(s,actions),inverse=reverseSteps(s,plan.steps);
  for(const step of plan.steps)applyStep(s,step);
  const expected=[0,0,0];expected[index]=90;
  assert.deepEqual(s.objects[0].rpy,expected);assert.equal(s.held,'book');
  assert.ok(distance(toolPose(s.q).rpy,expected)<.3);
  const restored=planActions(s,[{type:'restore'}]).result;sameObjects(restored,before);assert.equal(restored.held,null);
  for(const step of inverse)applyStep(s,step);sameObjects(s,before);assert.deepEqual(s.q,before.q);
 }
});
test('placing preserves rotation and an impossible tilted placement rejects the entire task',()=>{
 const s=initialState(0,'desk'),before=structuredClone(s);
 run(s,[{type:'pick',object:'book'},{type:'rotate',axis:'z',angle:90},{type:'place',target:'start'}]);
 assert.deepEqual(s.objects[0].rpy,[0,0,90]);assert.deepEqual(s.objects[0].position,s.objects[0].origin);assert.equal(s.held,null);
 run(s,[{type:'restore'}]);sameObjects(s,before);
 assert.throws(()=>planActions(s,[{type:'pick',object:'book'},{type:'rotate',axis:'x',angle:90},{type:'place',target:'start'}]),e=>['reach','blocked'].includes(e.message)&&e.action.type==='place');
 sameObjects(s,before);assert.equal(s.held,null);
 assert.throws(()=>validateActions([{type:'rotate',axis:'w',angle:90}]),/angle/);
 assert.deepEqual(parseResponse('{"reply":"I will turn it.","actions":[{"type":"rotate","axis":"y","angle":90}]}').actions,[{type:'rotate',axis:'y',angle:90}]);
});
test('dorm desk objects reach all organizer spaces and restore around the fixed laptop and lamp',()=>{
 for(const id of initialState(0,'desk').objects.map(o=>o.id))for(const target of Object.keys(HOMES)){
  const s=initialState(0,'desk'),before=structuredClone(s);run(s,[{type:'transfer',object:id,target}]);
  const object=s.objects.find(o=>o.id===id);assert.deepEqual(object.position,[...HOMES[target].position.slice(0,2),28+object.size[2]/2]);
  run(s,[{type:'restore'}]);sameObjects(s,before);assert.deepEqual(s.obstacles,before.obstacles);
 }
});
test('user-selected stacks and side-by-side orders preserve shelf height and can be reversed',()=>{
 for(const [base,top]of [['book','notebook'],['notebook','book']]){
  const s=initialState(0,'desk'),before=structuredClone(s);
  const p=planActions(s,[{type:'transfer',object:base,target:'shelf-middle'},{type:'transfer',object:top,target:base}]);
  const inverse=reverseSteps(s,p.steps);for(const step of p.steps)applyStep(s,step);
  assert.equal(s.objects.find(o=>o.id===top).position[2],28+s.objects.find(o=>o.id===base).size[2]+s.objects.find(o=>o.id===top).size[2]/2);
  for(const step of inverse)applyStep(s,step);sameObjects(s,before);
 }
 const s=initialState(0,'desk');run(s,[{type:'transfer',object:'pen',target:'shelf-middle'},{type:'transfer',object:'pencil',beside:'pen',side:'rear'}]);
 assert.equal(s.objects.find(o=>o.id==='pencil').position[2],36);assert.ok(s.objects.find(o=>o.id==='pencil').position[0]<s.objects.find(o=>o.id==='pen').position[0]);
 assert.throws(()=>planActions(s,[{type:'transfer',object:'book',beside:'pencil',side:'rear'}]),e=>e.message==='shelfEdge'&&e.preview.kind==='placement');
 run(s,[{type:'restore'}]);sameObjects(s,initialState(0,'desk'));
 assert.throws(()=>planActions(s,[{type:'move',position:[150,210,120]}]),/blocked/);
 assert.throws(()=>validateActions([{type:'pick',object:'laptop'}]),/unknown/);
});
test('side mount, desk edges and laptop are shared by perception and planning',()=>{
 const s=initialState(0,'desk'),scene=snapshot(s);
 assert.ok(-DESK.min[0]<(DESK.max[0]-DESK.min[0])*.2);
 assert.ok(DESK.max[0]-DESK.min[0]>DESK.max[1]-DESK.min[1],'mount must be on the short edge');
 assert.equal(s.obstacles.find(o=>o.id==='laptop').position[0],(DESK.min[0]+DESK.max[0])/2);
 assert.equal(scene.viewerDirections.left,'rear');
 assert.deepEqual(scene.robotMount,[0,0,0]);assert.deepEqual(scene.deskBounds,DESK);assert.equal(scene.tableAreas.rear,undefined);
 assert.equal(scene.obstacles.find(o=>o.id==='laptop').fixed,true);assert.equal(scene.obstacles.some(o=>o.id==='computer'),false);
 const wall=scene.obstacles.find(o=>o.id==='wall');assert.equal(wall.position[1]-wall.size[1]/2,DESK.max[1]);assert.equal(wall.fixed,true);
 assert.ok(s.objects.every(o=>o.position[0]>0));
 assert.throws(()=>planActions(s,[{type:'transfer',object:'book',target:'rear'}]),e=>e.message==='destination'&&e.detail.reason.includes('desk edge'));
});
test('restore can undo swapped starts on the narrow desk using a clear shelf space',()=>{
 const s=initialState(0,'desk'),before=structuredClone(s);
 run(s,[{type:'transfer',object:'book',target:'shelf-left'},{type:'transfer',object:'notebook',target:'book-start'},{type:'transfer',object:'book',target:'notebook-start'}]);
 run(s,[{type:'restore'}]);sameObjects(s,before);
});
test('bedroom gestures and randomized arrangements remain reachable',()=>{
 for(const type of ['wave','bow','dance','circle','bob']){const s=initialState(0,'desk'),before=structuredClone(s);run(s,[{type}]);sameObjects(s,before);assert.ok(distance(toolPose(s.q).tip,HOME)<.2);}
 for(const seed of [42,139,896])for(const object of initialState(0,'desk').objects.map(o=>o.id)){const s=initialState(seed,'desk'),before=structuredClone(s);run(s,[{type:'transfer',object,target:'shelf-middle'},{type:'restore'}]);sameObjects(s,before);}
 const scene=snapshot(initialState(0,'desk'));assert.equal(Object.keys(scene.homes).length,3);assert.equal(scene.obstacles.filter(o=>o.fixed).length,5);assert.match(scene.context,/user decides/i);
});
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
test('named transfers pick up, place and re-pick for a round trip, including an already-held object',()=>{
 for(const held of [false,true]){
  const s=initialState(),before=structuredClone(s);
  if(held)run(s,[{type:'pick',object:'eraser'}]);
  const plan=run(s,[{type:'transfer',object:'eraser',target:'book'},{type:'transfer',object:'eraser',target:'start'}]);
  sameObjects(s,before);assert.equal(s.held,null);
  assert.equal(plan.steps.filter(step=>step.type==='grip').length,held?1:2);
  assert.equal(plan.steps.filter(step=>step.type==='release').length,2);
 }
 const s=initialState(),before=structuredClone(s);
 run(s,[{type:'transfer',object:'pencilcase',target:'book'},{type:'transfer',object:'eraser',target:'pencilcase'},{type:'restore'}]);sameObjects(s,before);
 run(s,[{type:'transfer',object:'book',beside:'eraser',side:'front'},{type:'transfer',object:'book',position:[280,0]},{type:'restore'}]);sameObjects(s,before);
 run(s,[{type:'pick',object:'book'}]);
 assert.throws(()=>planActions(s,[{type:'transfer',object:'eraser',target:'start'}]),e=>e.message==='holding'&&e.detail.held==='book');
});
test('failed multistep feedback identifies the simulated gripper and failed step without executing anything',()=>{
 const s=initialState(),before=structuredClone(s);
 assert.throws(()=>planActions(s,[{type:'transfer',object:'eraser',target:'book'},{type:'place',target:'start'}]),e=>e.message==='empty'&&e.detail.actionIndex===1&&e.detail.held===null);
 assert.deepEqual(s,before);
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
  const data=JSON.parse(init.body);assert.ok(data.messages.length<=14);assert.equal(data.messages[0].content.length<12000,true);assert.deepEqual(data.response_format,{type:'json_object'});assert.equal(data.max_tokens,2000);
  const input=JSON.parse(data.messages.findLast(m=>m.role==='user'&&m.content.startsWith('{')).content);assert.equal(input.feedback.error,'blocked');assert.equal(input.language,'zh');
  calls++;return {ok:true,json:async()=>({choices:[{message:{content:calls===1?'{"reply":"Hi","actions":[{"type":"fly"}]}':'{"reply":"I will wave.","actions":[{"type":"wave"}],"after":"Hello!"}'}}]})};
 });
 assert.equal(calls,2);assert.equal(result.after,'Hello!');assert.equal(result.actions[0].type,'wave');
});
test('truncated model output is retried before any plan is accepted',async()=>{
 let calls=0;
 const result=await askAgent({...DEFAULTS,key:'fake-test-key'},{question:'wave',language:'en',history:[],scene:snapshot(initialState())},undefined,async()=>({ok:true,json:async()=>({choices:[{finish_reason:++calls===1?'length':'stop',message:{content:' {"reply":"I will wave.","actions":[{"type":"wave"}]} '}}]})}));
 assert.equal(calls,2);assert.equal(result.actions[0].type,'wave');
 assert.equal(parseResponse(' \n```json\n{"reply":"Hello","actions":[]}\n```\n').reply,'Hello');
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
