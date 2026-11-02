import test from 'node:test';
import assert from 'node:assert/strict';
import {initialWorld,pose,applyAction,collision,graspContact,bounds,ChallengeController,gripperParts} from '../challenge-model.mjs';
import {ikTool,transform,rotationFromEuler} from '../challenge-kinematics.mjs';
import {boxesIntersect} from '../challenge-contact.mjs';
import {referenceProgram} from './challenge-fixtures.mjs';
const advance=c=>{for(let n=0;n<10000&&c.busy;n++)c.tick(100);};
const through=(route,n)=>{let w=initialWorld('hard');for(const step of route.slice(0,n)){const r=applyAction(w,step);assert.ok(r.end,r.error);w=r.end;}return w;};

test('offset pickups at compound wrist angles use jaw contact, preserve the part pose and match visible jaw spacing',()=>{
 for(const attitude of [[0,0,25],[20,0,0],[0,20,0],[20,10,25],[0,0,50]]){
  const w=initialWorld('hard'),arm=w.arms[0],q=ikTool([100,-127,103],arm.q,'nearest',attitude).q;assert.ok(q);arm.q=q;
  assert.equal(collision(w),null);assert.ok(graspContact(arm,w.part));const before=structuredClone(w.part);
  const r=applyAction(w,{type:'close',arm:'A'});assert.ok(r.end,r.error);assert.equal(r.end.part.owner,'A');
  assert.deepEqual(r.end.part.position,before.position);assert.deepEqual(r.end.part.rotation,before.rotation);
  const jaws=gripperParts(r.end.arms[0]).slice(-2);assert.ok(jaws.every(j=>!boxesIntersect(j,r.end.part)),'fingers stop at the part instead of passing through it');
 }
});
test('missing, too-wide and palm-only contacts cannot teleport the part into the jaws',()=>{
 const w=initialWorld('hard');assert.equal(graspContact(w.arms[0],w.part),null);const miss=applyAction(w,{type:'close',arm:'A'});assert.ok(miss.end);assert.equal(miss.end.part.owner,null);assert.equal(miss.end.arms[0].closed,true);
 for(const attitude of [[0,0,80],[0,0,90]]){
  const arm=w.arms[0];arm.q=ikTool([100,-127,103],arm.q,'nearest',attitude).q;assert.ok(arm.q);assert.equal(graspContact(arm,w.part),null);
 }
 const p=pose(w.arms[0]);w.part.position=p.tip.map((v,i)=>v+transform(p.rotation,[0,0,23])[i]);assert.equal(graspContact(w.arms[0],w.part),null);assert.equal(collision(w),'partCollision');
});
test('a wall in the finger closing sweep is detected even when both endpoint poses are clear',()=>{
 const route=referenceProgram('hard'),w=through(route,1),arm=w.arms[0],p=pose(arm),offset=transform(p.rotation,[0,18,3]);
 const point=p.tip.map((v,i)=>v+offset[i]);w.obstacles.push({min:point.map(v=>v-1),max:point.map(v=>v+1)});
 assert.equal(collision(w),null);const contact=graspContact(arm,w.part);assert.ok(contact);
 const closed=structuredClone(w);closed.arms[0].closed=true;closed.arms[0].jawY=contact.jawY;assert.equal(collision(closed),null);
 assert.equal(applyAction(w,{type:'close',arm:'A'}).error,'obstacle');
});
test('rotated collision boxes avoid AABB false positives and still detect real contact',()=>{
 const a={position:[0,0,0],rotation:rotationFromEuler([0,0,45]),size:[80,8,8]};
 assert.equal(boxesIntersect(a,{...a,position:[0,20,0]}),false);assert.equal(boxesIntersect(a,{...a,position:[0,3,0]}),true);
});
test('handoff accepts an offset, angled B grip and transfers without snapping the part',()=>{
 const route=referenceProgram('hard'),w=through(route,4),b=w.arms[1];
 b.q=ikTool([186,3,163],b.q,'nearest',[20,0,-160]).q;assert.ok(b.q);
 assert.equal(collision(w),null);const r=applyAction(w,{type:'close',arm:'B'});assert.ok(r.end,r.error);
 const part=structuredClone(r.end.part),released=applyAction(r.end,{type:'open',arm:'A'});assert.ok(released.end,released.error);
 assert.equal(released.end.part.owner,'B');assert.deepEqual(released.end.part.position,part.position);assert.deepEqual(released.end.part.rotation,part.rotation);
});
test('placement accepts an offset on the stand, while unsupported release fails',()=>{
 const route=referenceProgram('hard'),w=through(route,10);w.part.position[0]+=10;w.part.position[1]+=7;w.part.position[2]+=4;
 const r=applyAction(w,{type:'open',arm:'B'});assert.ok(r.end,r.error);assert.equal(r.end.complete,true);assert.equal(r.end.part.position[0],w.part.position[0]);assert.equal(r.end.part.position[1],w.part.position[1]);assert.ok(Math.abs(bounds(r.end.part.position,r.end.part.rotation,r.end.part.size).min[2]-93)<.001);
 const unsupported=through(route,7);assert.equal(applyAction(unsupported,{type:'open',arm:'B'}).failure,'partDropped');
});
test('a missing receiver grip replays up to the drop, with visible falling motion and no completion',()=>{
 const c=new ChallengeController('hard'),route=referenceProgram('hard');c.program=[...route.slice(0,5),route[6],...route.slice(7)];
 assert.equal(c.run().ok,true);while(!c.world.failure)c.tick(100);const height=c.world.part.position[2];c.tick(100);assert.ok(c.world.part.position[2]<height);
 advance(c);assert.equal(c.world.failure,'partDropped');assert.equal(c.complete,false);assert.equal(c.metrics.actions,5);assert.equal(c.lastErrorIndex,5);
 assert.equal(c.execute(route[0]).error,'restartRequired');assert.equal(c.execute({type:'close',arm:'A'}).error,'restartRequired');
 c.reset();assert.equal(c.world.failure,null);assert.equal(c.world.part.position[2],100);
});
test('stop cannot rescue a falling part; reset and replay start a new attempt',()=>{
 const c=new ChallengeController('hard'),route=referenceProgram('hard');c.world=through(route,4);
 assert.equal(c.execute({type:'open',arm:'A'}).ok,true);c.tick(50);c.stop();assert.equal(c.world.failure,'partDropped');assert.equal(c.world.part.owner,null);assert.ok(Math.abs(bounds(c.world.part.position,c.world.part.rotation,c.world.part.size).min[2])<.001);
 assert.equal(c.execute({type:'close',arm:'A'}).error,'restartRequired');c.program=route;assert.equal(c.run().ok,true);advance(c);assert.equal(c.complete,true);
});


test('a missed B close is recorded as an empty grip and the later A release drops the part',()=>{
 const c=new ChallengeController('hard'),route=referenceProgram('hard');c.program=[...route.slice(0,4),{type:'close',arm:'B'},{type:'open',arm:'A'}];assert.equal(c.run().ok,true);advance(c);assert.equal(c.world.failure,'partDropped');assert.equal(c.lastErrorIndex,5);assert.equal(c.metrics.actions,5);assert.equal(c.complete,false);
});
