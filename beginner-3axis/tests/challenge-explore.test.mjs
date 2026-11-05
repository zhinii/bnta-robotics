import test from 'node:test';
import assert from 'node:assert/strict';
import {initialWorld,applyAction,solvePosition,collision,atPose,bounds,ChallengeController,validateSequence} from '../challenge-model.mjs';
import {referenceProgram} from './challenge-fixtures.mjs';
const advance=c=>{for(let n=0;n<10000&&c.busy;n++)c.tick(100);};
const pickFirst=()=>{let w=initialWorld('explore');for(const s of referenceProgram('explore').slice(0,4))w=applyAction(w,s).end;return w;};
const move=(w,p)=>{const r=solvePosition(w.arms[0],p);assert.ok(r.q,r.error);return applyAction(w,{type:'move',arm:'A',q:r.q,kind:'xyz'});};
test('Explore has an unobstructed six-axis arm and three independently graspable blocks',()=>{
 const w=initialWorld('explore');assert.equal(w.arms.length,1);assert.equal(w.arms[0].axes,6);assert.equal(w.parts.length,3);assert.equal(collision(w),null);assert.deepEqual(w.obstacles,[]);assert.equal(w.wall,null);
 for(const part of w.parts){const r=solvePosition(w.arms[0],part.position);assert.ok(r.q,r.error);const near=atPose(w,'A',r.q),closed=applyAction(near,{type:'close',arm:'A'});assert.ok(closed.end,closed.error);assert.equal(closed.end.part.id,part.id);assert.equal(closed.end.part.owner,'A');assert.equal(closed.end.parts.filter(p=>p.owner).length,1);assert.equal(closed.end.part,closed.end.parts.find(p=>p.id===part.id));}
});
test('free placement and repeat pickup work without targets, failure or challenge completion',()=>{
 let w=initialWorld('explore');const route=referenceProgram('explore');
 for(const step of route){const r=applyAction(w,step);assert.ok(r.end,r.error);w=r.end;assert.equal(w.failure,null);assert.equal(w.complete,false);}
 assert.equal(w.parts[0].owner,null);assert.ok(Math.abs(w.parts[0].position[0]-230)<.5);assert.ok(Math.abs(w.parts[1].position[0]-150)<.5);assert.deepEqual(w.parts[2].position,[150,70,16]);
 for(const part of w.parts)assert.ok(Math.abs(bounds(part.position,part.rotation,part.size).min[2])<.001);
});
test('a released block rests on another block, and moving through it is rejected',()=>{
 let w=pickFirst();const colliding=move(w,[210,0,16]);assert.equal(colliding.error,'partCollision');
 w=move(w,[210,0,100]).end;const r=applyAction(w,{type:'open',arm:'A'});assert.ok(r.settling);assert.equal(r.end.failure,null);assert.ok(Math.abs(bounds(r.end.part.position,r.end.part.rotation,r.end.part.size).min[2]-32)<.02);assert.deepEqual(r.end.parts[1].position,[210,0,16]);
});
test('recording/replay retains all blocks, reports a finished replay and never awards a pass',()=>{
 const c=new ChallengeController('explore'),route=referenceProgram('explore');
 for(const step of route){assert.equal(c.execute(step).ok,true);advance(c);c.add(step);}const manuallyPlaced=structuredClone(c.world.parts);
 assert.equal(c.complete,false);assert.equal(validateSequence('explore',route).end.complete,false);assert.equal(c.run().ok,true);advance(c);
 assert.deepEqual(c.world.parts,manuallyPlaced);assert.equal(c.metrics.status,'timerFinished');assert.equal(c.metrics.actions,route.length);assert.ok(c.metrics.elapsed>0);assert.equal(c.verifiedProgram,null);assert.equal(c.complete,false);
 c.reset();assert.deepEqual(c.world.parts,initialWorld('explore').parts);assert.equal(c.program.length,route.length);
});
test('an empty close is harmless, and stopping a release leaves the block on a surface',()=>{
 const c=new ChallengeController('explore');assert.equal(c.execute({type:'close',arm:'A'}).ok,true);advance(c);assert.equal(c.world.part.owner,null);assert.equal(c.world.failure,null);
 c.world=pickFirst();assert.equal(c.execute({type:'open',arm:'A'}).ok,true);c.tick(20);c.stop();assert.equal(c.world.failure,null);assert.equal(c.world.part.owner,null);assert.ok(Math.abs(bounds(c.world.part.position,c.world.part.rotation,c.world.part.size).min[2])<.001);
});
