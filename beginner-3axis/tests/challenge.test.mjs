import test from 'node:test';import assert from 'node:assert/strict';
import {initialWorld,pose,collision,atPose,applyAction,solvePosition,validateSequence,ChallengeController,distance,upgradeHandoffSteps} from '../challenge-model.mjs';
import {ikTool} from '../challenge-kinematics.mjs';import {words} from '../challenge-i18n.mjs';import {referenceProgram} from './challenge-fixtures.mjs';
const advance=(c,ms=60000)=>{for(let n=0;n<ms;n+=100)c.tick(100);};
test('each difficulty uses the specified physical joint counts and independent bases',()=>{assert.deepEqual(initialWorld('easy').arms.map(a=>a.q.length),[3]);assert.deepEqual(initialWorld('medium').arms.map(a=>a.q.length),[6]);assert.deepEqual(initialWorld('hard').arms.map(a=>a.q.length),[6,6]);for(const mode of ['easy','medium','hard'])assert.equal(collision(initialWorld(mode)),null);});
for(const mode of ['easy','medium','hard'])test(mode+' records a solvable program and completes only through real execution',()=>{const c=new ChallengeController(mode),program=referenceProgram(mode);for(const step of program)c.add(step);assert.equal(c.world.complete,false);assert.equal(c.run().ok,true);assert.equal(c.world.complete,false);advance(c);assert.equal(c.world.complete,true);assert.equal(c.world.part.owner,null);assert.ok(distance(c.world.part.position,c.world.destination)<4);assert.equal(c.running,false);});
test('preview never mutates the live pose or part, and real wrist roll changes orientation',()=>{const w=initialWorld('medium'),before=structuredClone(w),q=[...w.arms[0].q];q[5]+=30;const preview=atPose(w,'A',q);assert.deepEqual(w,before);assert.ok(distance(pose(preview.arms[0]).tip,pose(w.arms[0]).tip)<1e-8);assert.notDeepEqual(pose(preview.arms[0]).rotation,pose(w.arms[0]).rotation);});
test('unrotated carried part cannot cross the gate and rejected movement is atomic',()=>{let w=initialWorld('medium');const route=referenceProgram('medium');for(const s of route.slice(0,2))w=applyAction(w,s).end;const before=structuredClone(w),q=ikTool([220,110,130],w.arms[0].q,'nearest',[0,0,0]).q;assert.ok(q);assert.ok(['partCollision','obstacle'].includes(applyAction(w,{type:'move',arm:'A',q,kind:'xyz'}).error));assert.deepEqual(w,before);assert.equal(w.complete,false);});
test('B grips, A releases, then B moves; blocked movement never changes the shared grip',()=>{
 let w=initialWorld('hard');const route=referenceProgram('hard');
 assert.equal(applyAction(w,{type:'handoff',arm:'A'}).error,'handoffSteps');
 for(const step of route.slice(0,4))w=applyAction(w,step).end;
 assert.equal(applyAction(w,{type:'close',arm:'B'}).error,'handoffPosition');
 assert.equal(applyAction(w,{type:'open',arm:'A'}).error,'unsupported');
 w=applyAction(w,route[4]).end;const original=clonePart(w);
 w=applyAction(w,route[5]).end;assert.equal(w.part.owner,'A');assert.equal(w.part.receiver,'B');assert.ok(w.arms.every(a=>a.closed));assert.equal(w.evidence.handoff,false);
 const shared=structuredClone(w);
 for(const step of [route[7],route[8]])assert.equal(applyAction(w,step).error,'handoffLocked');
 assert.deepEqual(w,shared);assert.equal(applyAction(w,{type:'close',arm:'B'}).error,'alreadyClosed');
 w=applyAction(w,route[6]).end;assert.equal(w.part.owner,'B');assert.equal(w.part.receiver,null);assert.equal(w.arms[0].closed,false);assert.equal(w.arms[1].closed,true);assert.equal(w.evidence.handoff,true);assert.deepEqual(clonePart(w),original);
 assert.equal(applyAction(w,{type:'open',arm:'B'}).error,'unsupported');
 for(const step of route.slice(7))w=applyAction(w,step).end;assert.equal(w.complete,true);
});
function clonePart(w){return {position:[...w.part.position],rotation:[...w.part.rotation]};}
test('B can release a shared grip without completing or losing the handoff',()=>{
 const route=referenceProgram('hard');let w=initialWorld('hard');for(const step of route.slice(0,6))w=applyAction(w,step).end;const part=clonePart(w);
 w=applyAction(w,{type:'open',arm:'B'}).end;assert.equal(w.part.owner,'A');assert.equal(w.part.receiver,null);assert.equal(w.arms[0].closed,true);assert.equal(w.arms[1].closed,false);assert.equal(w.evidence.handoff,false);assert.deepEqual(clonePart(w),part);
 assert.equal(applyAction(w,{type:'close',arm:'B'}).end.part.receiver,'B');
});
test('replay stops at the premature B move, preserves both grips and freezes timing',()=>{
 const c=new ChallengeController('hard'),route=referenceProgram('hard');c.program=[...route.slice(0,6),route[8]];
 assert.equal(validateSequence('hard',c.program).error,'handoffLocked');assert.equal(c.run().ok,true);advance(c);
 assert.equal(c.lastError,'handoffLocked');assert.equal(c.lastErrorIndex,6);assert.equal(c.running,false);assert.equal(c.operation,null);assert.equal(c.world.part.receiver,'B');assert.equal(c.world.part.owner,'A');assert.ok(c.world.arms.every(a=>a.closed));assert.equal(c.world.complete,false);
 assert.equal(c.metrics.actions,6);assert.equal(c.metrics.moves,4);assert.equal(c.metrics.status,'timerInvalid');const stopped=structuredClone({world:c.world,metrics:c.metrics});advance(c);assert.deepEqual({world:c.world,metrics:c.metrics},stopped);
 assert.equal(c.execute({type:'open',arm:'A'}).ok,true);advance(c);assert.equal(c.world.part.owner,'B');assert.equal(c.world.part.receiver,null);
});
test('saved one-click handoffs expand to two explicit actions without mutating the file',()=>{
 const old=[{type:'handoff',arm:'A'}],before=structuredClone(old);assert.deepEqual(upgradeHandoffSteps('hard',old),[{type:'close',arm:'B'},{type:'open',arm:'A'}]);assert.deepEqual(old,before);
});
test('inter-arm collision is checked and impossible joints are rejected',()=>{const w=initialWorld('hard');w.arms[1].base=[...w.arms[0].base];w.arms[1].yaw=w.arms[0].yaw;w.arms[1].q=[...w.arms[0].q];assert.equal(collision(w),'armCollision');assert.equal(applyAction(initialWorld('medium'),{type:'move',arm:'A',q:[0,500,0,0,0,0]}).error,'limits');assert.ok(solvePosition(initialWorld('easy').arms[0],[9999,0,100]).error);});
test('pause freezes a replay; stop cannot finish a pending action or delete steps',()=>{const c=new ChallengeController('hard');c.program=referenceProgram('hard');c.run();c.tick(100);c.pause();const before=structuredClone(c.world);advance(c,2000);assert.deepEqual(c.world,before);c.pause();c.tick(100);c.stop();const stopped=structuredClone(c.world);advance(c);assert.deepEqual(c.world,stopped);assert.equal(c.world.complete,false);assert.equal(c.program.length,11);c.reset();assert.equal(c.program.length,11);});
test('preflight identifies the failing step without resetting the current world',()=>{const c=new ChallengeController();c.program=[{type:'close',arm:'A'}];const before=structuredClone(c.world);const r=c.run();assert.equal(r.index,0);assert.equal(r.error,'gripPosition');assert.deepEqual(c.world,before);assert.equal(c.running,false);});
test('all authored interface strings have nonempty EN/ZH pairs',()=>{assert.deepEqual(Object.keys(words.en),Object.keys(words.zh));for(const key of Object.keys(words.en)){assert.ok(words.en[key].length);assert.ok(words.zh[key].length);}assert.equal(words.en.jointNames.length,6);assert.equal(words.zh.jointNames.length,6);});

for(const mode of ['easy','medium','hard'])test(mode+' replay time equals actual action durations at different frame rates',()=>{
 const program=referenceProgram(mode);let w=initialWorld(mode),expected=0;
 for(const step of program){const r=applyAction(w,step);expected+=r.duration;w=r.end;}
 for(const dt of [16,37,100]){const c=new ChallengeController(mode);c.program=program;c.run();for(let n=0;c.running&&n<10000;n++)c.tick(dt);
 assert.equal(c.metrics.status,'timerComplete');assert.ok(Math.abs(c.metrics.elapsed-expected)<1e-7);
 assert.equal(c.metrics.actions,program.length);assert.equal(c.metrics.moves,program.filter(s=>s.type==='move').length);
 assert.equal(c.metrics.steps.length,program.length);assert.ok(c.metrics.steps.every(s=>s.duration>0));
 }
});
test('timing excludes previews, manual execution, pauses, stopped time and invalid programs',()=>{
 const c=new ChallengeController(),route=referenceProgram('easy');c.execute(route[0]);advance(c);assert.equal(c.metrics.elapsed,0);
 c.program=route;c.run();c.tick(100);c.pause();const paused=structuredClone(c.metrics);advance(c);assert.deepEqual(c.metrics,paused);
 c.pause();c.tick(100);c.stop();const stopped=structuredClone(c.metrics);advance(c);assert.deepEqual(c.metrics,stopped);assert.equal(c.metrics.status,'timerStopped');assert.equal(c.metrics.moves,0);
 c.run();advance(c);assert.equal(c.metrics.status,'timerComplete');const time=c.metrics.elapsed;c.run();advance(c);assert.equal(c.metrics.elapsed,time);
 c.edit(0,'delete');assert.equal(c.metrics.elapsed,0);assert.ok(c.run().error);assert.equal(c.metrics.status,'timerInvalid');assert.equal(c.metrics.elapsed,0);
});
