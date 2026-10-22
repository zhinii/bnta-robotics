import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,planActions,validateActions,applyStep,clearPose,objectPosture,inHolder,reverseSteps} from '../world.mjs';
import {toolPose,distance,rotationFromEuler} from '../kinematics.mjs';
import {objectBounds} from '../shapes.mjs';
import {askAgent,placementIntent,pickupIntent,SYSTEM} from '../agent.mjs';

// Replay intermediate joint poses too: endpoints alone do not prove a clear route.
function checked(start,actions){
 const plan=planActions(start,actions),s=structuredClone(start);
 for(const step of plan.steps){
  if(step.type==='move')for(const u of [.25,.5,.75,1]){
   const q=s.q.map((v,i)=>v+(step.q[i]-v)*u),next=plan.steps[plan.steps.indexOf(step)+1];
   const contact=!s.held&&next?.type==='grip'?next.object:null;
   // Planned contact can also occur during the final approach or withdrawal;
   // the engine samples those paths at <=0.5 degrees with the named contact.
   if(!contact)assert.ok(clearPose(q,s)||clearPose(q,s,actions.find(a=>a.object)?.object));
  }
  applyStep(s,step);
 }
 assert.equal(s.held,plan.result.held);return plan.result;
}

test('occupied shelf searches separate gaps, carrying a pencil with the holder',()=>{
 let s=initialState(0,'desk');
 s=checked(s,[{type:'transfer',object:'notebook',target:'shelf-middle',posture:'short-edge'}]);
 const notebook=structuredClone(s.objects.find(o=>o.id==='notebook'));
 s=checked(s,[{type:'transfer',object:'pencil',target:'pen-holder'}]);
 s=checked(s,[{type:'transfer',object:'pen-holder',beside:'notebook',side:'front'}]);
 assert.ok(s.objects.find(o=>o.container).position[0]>notebook.position[0]);
 assert.ok(inHolder(s,s.objects.find(o=>o.id==='pencil')));
 s=checked(s,[{type:'transfer',object:'book',target:'shelf',posture:'short-edge'}]);
 assert.equal(objectPosture(s.objects.find(o=>o.id==='book')),'short-edge');
 const placed=objectBounds(s.objects.find(o=>o.id==='book'));assert.ok(Math.abs(placed.low[2]-28)<.001);assert.ok(placed.low[0]>=122&&placed.high[0]<=338,'a generic shelf task never spills onto the desk beside it');
 assert.deepEqual(s.objects.find(o=>o.id==='notebook').position,notebook.position);
 const before=structuredClone(s);
 assert.throws(()=>planActions(s,[{type:'transfer',object:'pen',target:'shelf-middle'}]),e=>['occupied','blocked'].includes(e.message));
 assert.deepEqual(s,before);
});

test('turn a flat book face down beside an upright book using a visible set-down and opposite-face regrasp',()=>{
 let s=initialState(0,'desk');
 s=checked(s,[{type:'transfer',object:'notebook',target:'shelf',posture:'short-edge'},{type:'transfer',object:'pencil',target:'pen-holder'}]);
 const before=structuredClone(s),actions=[{type:'transfer',object:'book',beside:'notebook',posture:'face-down'}],plan=planActions(s,actions);
 assert.deepEqual(s,before,'planning and previews never change the scene');
 const grips=plan.steps.filter(step=>step.type==='grip');assert.equal(grips.length,2);assert.ok(grips.every(step=>step.object==='book'));
 const firstRelease=plan.steps.findIndex(step=>step.type==='release'),secondGrip=plan.steps.findLastIndex(step=>step.type==='grip');assert.ok(firstRelease<secondGrip,'grasp changes only after a real release');
 const result=checked(s,actions),book=result.objects.find(o=>o.id==='book'),bounds=objectBounds(book);
 assert.equal(result.held,null);assert.equal(objectPosture(book),'flat');assert.ok(rotationFromEuler(book.rpy)[8]<-.999);
 assert.ok(Math.abs(bounds.low[2]-28)<.001,'the upside-down book rests on the shelf');assert.ok(bounds.low[0]>=122&&bounds.high[0]<=338);
 for(const object of before.objects.filter(o=>o.id!=='book'))assert.deepEqual(result.objects.find(o=>o.id===object.id),object);
 const reversed=structuredClone(plan.result);for(const step of reverseSteps(before,plan.steps))applyStep(reversed,step);
 for(const object of before.objects){const restored=reversed.objects.find(o=>o.id===object.id);assert.deepEqual(restored.position,object.position);assert.deepEqual(restored.rpy,object.rpy);}
});

test('front and top grips are distinct and an unreachable explicit front grip never silently changes',()=>{
 const s=initialState(0,'desk');
 const top=planActions(s,[{type:'pick',object:'book',approach:'top'}]);
 assert.ok(Math.abs(toolPose(top.result.q).rpy[0])<1);
 const central=initialState(0,'desk');central.objects.find(o=>o.id==='book').position=[160,0,9];
 const front=checked(central,[{type:'pick',object:'book',approach:'front'}]);
 assert.ok(toolPose(front.q).rotation[5]<-.7,'wrist faces the chair rather than down');
 const before=structuredClone(s);
 assert.throws(()=>planActions(s,[{type:'pick',object:'book',approach:'front'}]),e=>e.message==='reach'&&e.detail.approach==='front');
 assert.deepEqual(s,before);
});

test('original gestures accept bounded variations, collision-check them and leave all objects in place',()=>{
 const s=initialState(0,'desk');
 for(const points of [[[0,-18,8,8,0,-15],[8,18,12,-8,5,15],[0,0,0,0,0,0]],[[15,0,15,0,-8,12],[-15,0,-10,0,8,-12]]]){
  const result=checked(s,[{type:'gesture',points,tempo:'quick'}]);
  assert.deepEqual(result.objects,s.objects);assert.ok(distance(toolPose(result.q).tip,[210,0,150])<.2);
 }
 assert.throws(()=>validateActions([{type:'gesture',points:[[0,0,0,0,0,0],[80,0,0,0,0,0]]}]),/invalid/);
 const held=topHeld(s);assert.throws(()=>planActions(held,[{type:'gesture',points:[[0,0,0,0,0,0],[10,0,0,0,0,0]]}]),/holding/);
 function topHeld(s){return planActions(s,[{type:'pick',object:'book'}]).result;}
});

test('plain and misspelled shelf commands preserve explicit regions and relative sides',()=>{
 const response={reply:'I will move it.',actions:[{type:'transfer',object:'book',target:'shelf-middle',posture:'short-edge'}]};
 for(const q of ['put it on the shelf','first available spot on teh hself','放在书架的空位'])assert.equal(placementIntent(response,q).actions[0].target,'shelf');
 for(const q of ['put it on the middle shelf','left side of the shelf','放在书架左侧'])assert.equal(placementIntent(response,q).actions[0].target,'shelf-middle');
 const beside={reply:'Okay',actions:[{type:'transfer',object:'pen-holder',beside:'notebook',side:'front'}]};
 assert.deepEqual(placementIntent(beside,'on the shelf right of the book'),beside);
 assert.equal(pickupIntent(response,'pick up the book from the front').actions[0].approach,'front');
 assert.equal(pickupIntent(response,'从上面夹起书').actions[0].approach,'top');
 const face=placementIntent({...response,actions:[{type:'transfer',object:'book',beside:'notebook',orientation:[45,0,0]}]},'put the red book upside down next to the blue one');
 assert.equal(face.actions[0].posture,'face-down');assert.equal(face.actions[0].orientation,undefined);
});

test('questions and unreferenced pointing never replay a failed job, while creative requests reach the model',async()=>{
 const base={language:'en',history:[{role:'user',content:'put holder next to book'},{role:'assistant',content:'That spot is occupied.'}],scene:{objects:[]}};
 for(const question of ['how do you plan','pick up the book from this side']){
  const response=await askAgent({hosted:true},{...base,question},undefined,()=>{throw Error('must not make a request');});
  assert.deepEqual(response.actions,[]);assert.ok(response.reply.endsWith('?')||response.reply.includes('empty spot'));
 }
 await askAgent({hosted:true},{...base,question:'do a playful dance'},undefined,async(_,init)=>{
  const body=JSON.parse(init.body);assert.equal(body.temperature,.6);assert.match(body.messages[0].content,/CREATIVE FREEDOM/);
  return Response.json({choices:[{message:{content:'{"reply":"A little wiggle!","actions":[{"type":"gesture","points":[[0,-18,8,8,0,-15],[8,18,12,-8,5,15]]}]}'}}]});
 });
 assert.ok(SYSTEM.length<12000);
});

test('a valid greeting gesture during connection check never moves or rejects a working connection',async()=>{
 const reply=await askAgent({hosted:true},{question:'connection_check',language:'en',history:[],scene:{objects:[]}},undefined,async()=>Response.json({choices:[{message:{content:'{"reply":"Hello!","actions":[{"type":"wave"}]}'}}]}));
 assert.deepEqual(reply.actions,[]);
});
