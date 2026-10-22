import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,planActions,reverseSteps,applyStep,previewSteps,snapshot,inHolder,footprint,clearPose} from '../world.mjs';
import {distance} from '../kinematics.mjs';

test('desk inventory has five movable items including an open square holder',()=>{
 const s=initialState(0,'desk');
 assert.deepEqual(s.objects.map(o=>o.id),['book','notebook','pen','pencil','pen-holder']);
 const h=snapshot(s).containers[0];
 assert.equal(h.fixed,false);assert.deepEqual(h.accepts,['pen','pencil']);assert.deepEqual(h.contents,[]);
 assert.equal(h.size[2],s.objects.find(o=>o.id==='pencil').size[1]/2);
 assert.deepEqual(h.innerSize,[35,35]);assert.equal(h.innerSize[0],2.5*s.objects.find(o=>o.id==='pencil').diameter);
 assert.equal(h.size[0]-h.innerSize[0],2*h.wall);assert.equal(h.position[2],h.size[2]/2);
 assert.ok(h.slots[0][0]*h.slots[1][0]<0&&h.slots[0][1]*h.slots[1][1]<0,'slots are diagonally opposite');
 for(const [x,y] of h.slots)assert.ok(Math.abs(x)+8<h.innerSize[0]/2&&Math.abs(y)+8<h.innerSize[1]/2);

});

test('holder contents must fit inside both inner walls',()=>{
 const s=initialState(0,'desk'),h=s.objects.find(o=>o.container),pen=s.objects.find(o=>o.id==='pen');
 pen.rpy=[-90,0,0];pen.position=[h.position[0],h.position[1],h.floor+44];
 assert.ok(inHolder(s,pen));
 pen.position[0]+=27;pen.position[1]+=27;
 assert.ok(!inHolder(s,pen),'a tool outside the inner walls is not inside the holder');
});

test('both insertion orders drop into separate slots, preview settled poses, and physically undo or restore',()=>{
 for(const order of [['pen','pencil'],['pencil','pen']]){
 const s=initialState(0,'desk'),before=structuredClone(s);
 const p=planActions(s,order.map(object=>({type:'transfer',object,target:'pen-holder'})));
 assert.deepEqual(s,before);
 assert.equal(p.steps.filter(x=>x.type==='fall').length,2);
 assert.deepEqual(snapshot(p.result).containers[0].contents,['pen','pencil']);
 assert.ok(!JSON.stringify(snapshot(p.result)).includes('retrievalPath'),'internal joint routes must not bloat AI scene context');
 assert.ok(clearPose(p.result.q,p.result),'the final empty gripper must clear both stored tools without contact exemptions');
 assert.ok(planActions(p.result,[{type:'transfer',object:'book',target:'shelf-left'}]).steps.length,'a shelf task must work immediately after the drops');
 const preview=previewSteps(s,p.steps);
 for(const id of ['pen','pencil']){
  const object=p.result.objects.find(o=>o.id===id),ghost=preview.destinations.find(o=>o.id===id);
  assert.ok(inHolder(p.result,object));assert.deepEqual(ghost.position,object.position);
  assert.equal(footprint(object)[2],Math.max(...object.size));
  const index=p.steps.findIndex(x=>x.type==='fall'&&x.object===id);
  assert.equal(p.steps[index-1].type,'release');assert.ok(p.steps[index-1].position[2]>object.position[2]);
 }
 const back=structuredClone(p.result),inverse=reverseSteps(s,p.steps);
 assert.ok(inverse?.some(step=>step.type==='grip'),'undo must retrieve, not levitate, the released items');
 for(const step of inverse)applyStep(back,step);
 const restored=planActions(p.result,[{type:'restore'}]).result;
 for(const candidate of [back,restored])for(const object of s.objects){const actual=candidate.objects.find(o=>o.id===object.id);assert.ok(distance(actual.position,object.position)<.15);assert.ok(distance(actual.rpy,object.rpy)<.02);}
 }
});

test('each writing tool can be dropped from an existing grip and retrieved',()=>{
 for(const object of ['pen','pencil']){
  let s=initialState(0,'desk');s=planActions(s,[{type:'pick',object}]).result;
  s=planActions(s,[{type:'place',target:'pen-holder'}]).result;
  assert.ok(inHolder(s,s.objects.find(o=>o.id===object)));
  const retrieved=planActions(s,[{type:'pick',object}]).result;assert.equal(retrieved.held,object);
 }
});

test('books and an explicitly flat pen cannot be dropped into the holder',()=>{
 const s=initialState(0,'desk'),before=structuredClone(s);
 assert.throws(()=>planActions(s,[{type:'transfer',object:'book',target:'pen-holder'}]),/holderFit/);
 assert.throws(()=>planActions(s,[{type:'transfer',object:'pen',target:'pen-holder',orientation:[0,0,0]}]),/holderFit/);
 assert.throws(()=>planActions(s,[{type:'transfer',object:'pen',target:'pen-holder',posture:'flat'}]),/holderFit/);
 assert.deepEqual(s,before);
});

test('the laptop keyboard remains solid while the air above it is usable',()=>{
 const s=initialState(0,'desk');
 assert.ok(planActions(s,[{type:'move',position:[250,-60,55]}]).steps.length);
 assert.throws(()=>planActions(s,[{type:'move',position:[250,-60,8]}]),e=>e.message==='blocked'&&e.detail.blocker==='laptop');
});
