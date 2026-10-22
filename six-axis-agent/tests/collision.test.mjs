import test from 'node:test';
import assert from 'node:assert/strict';
import {shape,box,cylinder,overlaps,broadOverlap,at,xyz,bounds} from '../collision.mjs';
import {objectShapes,objectGeometry,gripperGeometry,GRIPPER,projectedWidth} from '../shapes.mjs';
import {initialState,planActions,applyStep,graspWidth,clearPose,inHolder,reverseSteps,HOME} from '../world.mjs';
import {distance,toolPose} from '../kinematics.mjs';
import * as THREE from '../../beginner-3axis/vendor/three/build/three.module.js';

test('collision bounds match independently generated Three.js mesh vertices after rotation',()=>{
 const s=initialState(0,'desk'),rotation=xyz([23,-17,41]),position=[19,-34,82];
 for(const object of [...s.objects,...s.obstacles])for(const part of objectGeometry(object)){
  if(part.kind==='convex')continue;
  const geometry=part.kind==='box'?new THREE.BoxGeometry(...part.size):new THREE.CylinderGeometry(part.top,part.bottom,part.height,part.segments||40);
  const body=shape(part,position,rotation),r=body.rotation,p=body.position;
  geometry.applyMatrix4(new THREE.Matrix4().set(r[0],r[1],r[2],p[0],r[3],r[4],r[5],p[1],r[6],r[7],r[8],p[2],0,0,0,1));geometry.computeBoundingBox();
  for(let i=0;i<3;i++){
   assert.ok(Math.abs(geometry.boundingBox.min.getComponent(i)-body.low[i])<.0001,object.id+' lower extent');
   assert.ok(Math.abs(geometry.boundingBox.max.getComponent(i)-body.high[i])<.0001,object.id+' upper extent');
  }
  geometry.dispose();
 }
});

test('oriented books, round barrels and tapered tips leave their actual surrounding air free',()=>{
 const book=shape(box([2,20,2]),[0,0,0],xyz([0,0,45])),corner=shape(box([1,1,1]),[6,6,0]);
 assert.ok(broadOverlap(book,corner));assert.equal(overlaps(book,corner),false);
 assert.ok(overlaps(book,shape(box([1,1,1]),[-3,3,0])));
 const barrel=shape(cylinder(7,7,20)),outside=shape(box([1,1,1]),[6,0,6]);
 assert.ok(broadOverlap(barrel,outside));assert.equal(overlaps(barrel,outside),false);
 const tip=shape(cylinder(0,7,14));assert.equal(overlaps(tip,shape(box([1,1,1]),[5,5,0])),false);
 assert.ok(overlaps(tip,shape(box([1,1,1]),[.3,5,0])));
});

test('separation is symmetric and stays the same after a shared rotation and translation',()=>{
 const a=box([12,7,4]),b=box([3,6,9]),rotation=xyz([23,-36,71]);
 for(const position of [[0,0,0],[5,2,0],[10,0,0],[7.5,0,0]]){
  const first=shape(a),second=shape(b,position),hit=overlaps(first,second,.25);
  assert.equal(hit,overlaps(second,first,.25));
  const transformed=at([{...a},{...b,center:position}],[31,-7,98],rotation);
  assert.equal(overlaps(...transformed,.25),hit);
 }
 assert.equal(overlaps(shape(box([2,2,2])),shape(box([2,2,2]),[2,0,0])),false,'mere face contact is not penetration');
 assert.ok(overlaps(shape(box([2,2,2])),shape(box([2,2,2]),[2,0,0]),.5),'the requested clearance is still enforced');
});

test('the open holder, shelf underside, tilted laptop and lamp use separate physical parts',()=>{
 const s=initialState(0,'desk'),hit=(o,position,size=[2,2,2])=>objectShapes(o).some(p=>overlaps(shape(box(size),position),p));
 const holder=s.objects.find(o=>o.container);
 assert.equal(objectGeometry(holder).length,5);assert.equal(hit(holder,[140,65,20]),false);assert.ok(hit(holder,[159,65,20]));
 const shelf=s.obstacles.find(o=>o.id==='organizer');assert.equal(hit(shelf,[230,160,10]),false);assert.ok(hit(shelf,[230,160,25]));
 const laptop=s.obstacles.find(o=>o.id==='laptop');assert.equal(hit(laptop,[250,0,50]),false);assert.ok(hit(laptop,[250,10,50]));
 const lamp=s.obstacles.find(o=>o.id==='lamp');assert.equal(hit(lamp,[500,150,80]),false);assert.ok(hit(lamp,[480,150,80]));
});

test('only fingers entering a low gap need to fit; the housing is checked at its own height',()=>{
 const low=[-1,1].map(side=>shape(box([10,40,24]),[side*20.5,0,0]));
 const blocked=(width,objects)=>at(gripperGeometry(width),[0,0,0]).some(part=>objects.some(o=>overlaps(part,o,.5)));
 assert.equal(blocked(14,low),false,'a 31 mm gap clears fingers holding a 14 mm tool');
 assert.equal(blocked(20,low),true,'wider fingers must not pass through the same gap');
 const tall=[-1,1].map(side=>shape(box([10,40,60]),[side*20.5,0,20]));
 assert.equal(blocked(0,tall),true,'closing the fingers does not shrink the fixed housing');
});

test('writing tools are picked once each, jaws travel closed, and each opening has only 1 mm per side',()=>{
 const start=initialState(0,'desk'),before=structuredClone(start),plan=planActions(start,['pen','pencil'].map(object=>({type:'transfer',object,target:'pen-holder'})));
 assert.deepEqual(start,before);assert.deepEqual(plan.steps.filter(s=>s.type==='grip').map(s=>s.object),['pen','pencil']);
 assert.equal(plan.steps.filter(s=>s.type==='release').length,2);assert.equal(plan.steps.filter(s=>s.type==='fall').length,2);
 assert.ok(plan.steps.reduce((n,s)=>n+(s.seconds||0),0)<30,'the task must not retrace full approaches or home between tools');
 const replay=structuredClone(start);let afterFirstDrop=false,closedTravel=false;
 for(const step of plan.steps){
  if(step.type==='move')for(const fraction of [.25,.5,.75,1]){
   const q=replay.q.map((v,i)=>v+(step.q[i]-v)*fraction),detail={};
   assert.ok(clearPose(q,replay,null,detail),JSON.stringify(detail));
  }
  const beforeGrip=step.type==='grip'?graspWidth(replay):null;
  if(step.type==='move'&&!replay.held&&graspWidth(replay)===0)closedTravel=true;
  applyStep(replay,step);
  if(step.type==='grip')assert.ok(Math.abs(beforeGrip-projectedWidth(replay.objects.find(o=>o.id===step.object),replay.grasp.rotation))<1e-7);
  if(step.type==='preshape'&&step.width>0&&!replay.held){
   const next=plan.steps.slice(plan.steps.indexOf(step)+1).find(s=>s.type==='grip');
   if(next){const object=replay.objects.find(o=>o.id===next.object),width=projectedWidth(object,next.grasp.rotation);assert.ok(step.width<=width+2*GRIPPER.clearance+1e-7);}
  }
  if(step.type==='fall')afterFirstDrop=true;
  if(step.type==='move'&&afterFirstDrop&&!replay.held)assert.ok(distance(toolPose(replay.q).tip,HOME)>.5,'no automatic return home after a drop');
 }
 assert.ok(closedTravel);assert.equal(graspWidth(replay),0);
 for(const id of ['pen','pencil'])assert.ok(inHolder(replay,replay.objects.find(o=>o.id===id)));
});

test('beside placements reserve physical finger clearance instead of a blanket 35 mm gap',()=>{
 const start=initialState(0,'desk'),plan=planActions(start,[{type:'transfer',object:'pencil',beside:'pen',side:'front'}]);
 const pen=plan.result.objects.find(o=>o.id==='pen'),pencil=plan.result.objects.find(o=>o.id==='pencil');
 const gap=bounds(objectShapes(pencil)).low[0]-bounds(objectShapes(pen)).high[0];
 assert.ok(gap>=.5&&gap<=12,`actual gap was ${gap}`);assert.ok(clearPose(plan.result.q,plan.result));
 const inverse=reverseSteps(start,plan.steps),back=structuredClone(plan.result);for(const step of inverse)applyStep(back,step);
 for(const object of start.objects)assert.ok(distance(back.objects.find(o=>o.id===object.id).position,object.position)<.15);
 assert.equal(graspWidth(back),graspWidth(start));
});

test('a pickup stopped during jaw closure can withdraw and resume without squeezing through the object',()=>{
 const s=initialState(0,'desk'),first=planActions(s,[{type:'pick',object:'book'}]),grip=first.steps.findIndex(step=>step.type==='grip');
 for(const step of first.steps.slice(0,grip))applyStep(s,step);
 assert.equal(s.held,null);assert.ok(graspWidth(s)>0);const before=structuredClone(s);
 const resumed=planActions(s,[{type:'pick',object:'book'}]);assert.deepEqual(s,before);assert.equal(resumed.result.held,'book');
 assert.ok(resumed.steps.findIndex(step=>step.type==='move')<resumed.steps.findIndex(step=>step.type==='preshape'&&step.width===0),'withdraw before closing into the object');
});

test('tall objects are gripped above their centre so the carriers clear their upper surface',()=>{
 for(const [kit,id] of [['school','glue'],['blocks','blue']]){
  const start=initialState(0,kit),plan=planActions(start,[{type:'pick',object:id}]),grip=plan.steps.find(step=>step.type==='grip');
  assert.ok(grip.grasp.offset[2]<0,'raise the grasp instead of ignoring a carrier collision');
  assert.ok(clearPose(plan.result.q,plan.result));
 }
});
