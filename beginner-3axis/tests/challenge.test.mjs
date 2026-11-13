import test from 'node:test';import assert from 'node:assert/strict';
import {initialWorld,pose,collision,atPose,applyAction,solvePosition,validateSequence,ChallengeController,distance,upgradeHandoffSteps} from '../challenge-model.mjs';
import {ikTool} from '../challenge-kinematics.mjs';import {words} from '../challenge-i18n.mjs';import {referenceProgram} from './challenge-fixtures.mjs';
import {rotationFromEuler} from '../challenge-kinematics.mjs';
import {orientationError} from '../challenge-kinematics.mjs';
import {boxPanel} from '../challenge-wall.mjs';
const advance=(c,ms=60000)=>{for(let n=0;n<ms;n+=100)c.tick(100);};
test('manual recording cannot pass; only a complete replay of the unchanged program can',()=>{
 const c=new ChallengeController(),route=referenceProgram('easy');
 for(const step of route){assert.equal(c.execute(step).ok,true);advance(c);c.add(step);assert.equal(c.complete,false);}
 assert.equal(c.world.complete,true);assert.equal(c.metrics.elapsed,0);assert.equal(c.complete,false);
 c.run();assert.equal(c.complete,false);c.tick(100);c.pause();advance(c);assert.equal(c.complete,false);c.pause();advance(c);assert.equal(c.complete,true);
 c.edit(0,'delete');assert.equal(c.complete,false);c.program=route;c.run();advance(c);assert.equal(c.complete,true);
 c.program.push({type:'open',arm:'A'});assert.equal(c.complete,false,'direct program replacement invalidates proof');
 c.run();advance(c);assert.equal(c.complete,true);c.reset();assert.equal(c.complete,false);
});
test('completion waits for every recorded action, even after placement',()=>{
 const c=new ChallengeController();c.program=[...referenceProgram('easy'),{type:'open',arm:'A'}];c.run();
 while(c.metrics.actions<c.program.length-1)c.tick(100);assert.equal(c.world.complete,true);assert.equal(c.running,true);assert.equal(c.complete,false);c.stop();assert.equal(c.complete,false);
 c.run();advance(c);assert.equal(c.complete,true);assert.equal(c.metrics.actions,c.program.length);
});
test('medium has a 132 mm upright square: varied angles fit and all four edges still collide',()=>{
 const w=initialWorld('medium'),at=[215,0,180],tilted=rotationFromEuler([-90,-30,90]),level=rotationFromEuler([-90,0,90]);
 const hits=(p,r)=>w.obstacles.some(o=>boxPanel(p,r,w.part.size,o));
 assert.equal(w.wall.width,132);assert.equal(w.wall.height,132);assert.equal(w.wall.angle,0);
 assert.deepEqual(w.wall.opening,[[-66,114],[66,114],[66,246],[-66,246]]);
 assert.equal(hits(at,tilted),false);assert.equal(hits(at,level),false);
 assert.equal(hits(at,rotationFromEuler([-90,-90,90])),false);
 for(const point of [[215,0,250],[215,0,110],[215,70,180],[215,-70,180]])assert.equal(hits(point,level),true);
 assert.equal(Math.max(...w.obstacles.map(o=>o.max[2])),540);assert.ok(solvePosition(w.arms[0],[215,0,550]).error);
});
test('each difficulty uses the specified physical joint counts and independent bases',()=>{assert.deepEqual(initialWorld('easy').arms.map(a=>a.q.length),[3]);assert.deepEqual(initialWorld('medium').arms.map(a=>a.q.length),[6]);assert.deepEqual(initialWorld('hard').arms.map(a=>a.q.length),[6,6]);for(const mode of ['easy','medium','hard'])assert.equal(collision(initialWorld(mode)),null);});
for(const mode of ['easy','medium','hard'])test(mode+' records a solvable program and completes only through real execution',()=>{const c=new ChallengeController(mode),program=referenceProgram(mode);for(const step of program)c.add(step);assert.equal(c.world.complete,false);assert.equal(c.run().ok,true);assert.equal(c.world.complete,false);advance(c);assert.equal(c.world.complete,true);assert.equal(c.world.part.owner,null);assert.ok(distance(c.world.part.position,c.world.destination)<4);assert.equal(c.running,false);});
test('preview never mutates the live pose or part, and real wrist roll changes orientation',()=>{const w=initialWorld('medium'),before=structuredClone(w),q=[...w.arms[0].q];q[5]+=30;const preview=atPose(w,'A',q);assert.deepEqual(w,before);assert.ok(distance(pose(preview.arms[0]).tip,pose(w.arms[0]).tip)<1e-8);assert.notDeepEqual(pose(preview.arms[0]).rotation,pose(w.arms[0]).rotation);});
test('XYZ preview translates the draft wrist pose without executing or drifting its attitude',()=>{
 const w=initialWorld('medium'),before=structuredClone(w),arm=w.arms[0],reference=[...arm.q];reference[5]+=30;const start=pose(arm,reference);let seed=reference;
 for(let n=1;n<=10;n++){const target=start.tip.map((v,i)=>v+(i===0?n:0)),r=solvePosition(arm,target,reference,seed);assert.ok(r.q,r.error);assert.ok(distance(pose(arm,r.q).tip,target)<.12);assert.ok(Math.hypot(...orientationError(start.rotation,pose(arm,r.q).rotation))<.004);seed=r.q;}
 assert.deepEqual(w,before);assert.ok(Math.hypot(...orientationError(pose(arm).rotation,pose(arm,seed).rotation))>.4);
});
test('an off-centre carried part still hits the wall and rejected movement is atomic',()=>{let w=initialWorld('medium');const route=referenceProgram('medium');for(const s of route.slice(0,2))w=applyAction(w,s).end;const before=structuredClone(w),q=ikTool([220,110,130],w.arms[0].q,'nearest',[0,0,0]).q;assert.ok(q);assert.ok(['partCollision','obstacle'].includes(applyAction(w,{type:'move',arm:'A',q,kind:'xyz'}).error));assert.deepEqual(w,before);assert.equal(w.complete,false);});
test('B grips, A releases, then B moves; premature moves and releases plan a drop',()=>{
 let w=initialWorld('hard');const route=referenceProgram('hard');
 assert.equal(applyAction(w,{type:'handoff',arm:'A'}).error,'handoffSteps');
 for(const step of route.slice(0,4))w=applyAction(w,step).end;
 const miss=applyAction(w,{type:'close',arm:'B'});assert.ok(miss.end);assert.equal(miss.end.part.receiver,null);assert.equal(miss.end.arms[1].closed,true);
 assert.equal(applyAction(w,{type:'open',arm:'A'}).failure,'partDropped');
 for(const step of route.slice(4,6))w=applyAction(w,step).end;const original=clonePart(w);
 w=applyAction(w,route[6]).end;assert.equal(w.part.owner,'A');assert.equal(w.part.receiver,'B');assert.ok(w.arms.every(a=>a.closed));assert.equal(w.evidence.handoff,false);
 const shared=structuredClone(w);
 for(const step of [route[8],route[9]])assert.equal(applyAction(w,step).failure,'handoffDropped');
 assert.deepEqual(w,shared);assert.equal(applyAction(w,{type:'close',arm:'B'}).error,'alreadyClosed');
 w=applyAction(w,route[7]).end;assert.equal(w.part.owner,'B');assert.equal(w.part.receiver,null);assert.equal(w.arms[0].closed,false);assert.equal(w.arms[1].closed,true);assert.equal(w.evidence.handoff,true);assert.deepEqual(clonePart(w),original);
 assert.equal(applyAction(w,{type:'open',arm:'B'}).failure,'partDropped');
 for(const step of route.slice(8))w=applyAction(w,step).end;assert.equal(w.complete,true);
});
function clonePart(w){return {position:[...w.part.position],rotation:[...w.part.rotation]};}
test('B can release a shared grip without completing or losing the handoff',()=>{
 const route=referenceProgram('hard');let w=initialWorld('hard');for(const step of route.slice(0,7))w=applyAction(w,step).end;const part=clonePart(w);
 w=applyAction(w,{type:'open',arm:'B'}).end;assert.equal(w.part.owner,'A');assert.equal(w.part.receiver,null);assert.equal(w.arms[0].closed,true);assert.equal(w.arms[1].closed,false);assert.equal(w.evidence.handoff,false);assert.deepEqual(clonePart(w),part);
 assert.equal(applyAction(w,{type:'close',arm:'B'}).end.part.receiver,'B');
});
test('replay drops the part at a premature B move, fails and requires restart',()=>{
 const c=new ChallengeController('hard'),route=referenceProgram('hard');c.program=[...route.slice(0,7),route[9]];
 assert.equal(validateSequence('hard',c.program).failure,'handoffDropped');assert.equal(c.run().ok,true);advance(c);
 assert.equal(c.lastError,'handoffDropped');assert.equal(c.lastErrorIndex,7);assert.equal(c.running,false);assert.equal(c.operation,null);assert.equal(c.world.part.receiver,null);assert.equal(c.world.part.owner,null);assert.ok(c.world.arms.every(a=>!a.closed));assert.equal(c.world.failure,'handoffDropped');assert.equal(c.world.complete,false);
 assert.equal(c.metrics.actions,7);assert.equal(c.metrics.moves,5);assert.equal(c.metrics.status,'timerFailed');const stopped=structuredClone({world:c.world,metrics:c.metrics});advance(c);assert.deepEqual({world:c.world,metrics:c.metrics},stopped);
 assert.equal(c.execute({type:'open',arm:'A'}).error,'restartRequired');c.reset();assert.equal(c.world.failure,null);c.program=route;assert.equal(c.run().ok,true);advance(c);assert.equal(c.complete,true);
});
test('saved one-click handoffs expand to two explicit actions without mutating the file',()=>{
 const old=[{type:'handoff',arm:'A'}],before=structuredClone(old);assert.deepEqual(upgradeHandoffSteps('hard',old),[{type:'close',arm:'B'},{type:'open',arm:'A'}]);assert.deepEqual(old,before);
});
test('inter-arm collision is checked and impossible joints are rejected',()=>{const w=initialWorld('hard');w.arms[1].base=[...w.arms[0].base];w.arms[1].yaw=w.arms[0].yaw;w.arms[1].q=[...w.arms[0].q];assert.equal(collision(w),'armCollision');assert.equal(applyAction(initialWorld('medium'),{type:'move',arm:'A',q:[0,500,0,0,0,0]}).error,'limits');assert.ok(solvePosition(initialWorld('easy').arms[0],[9999,0,100]).error);});
test('pause freezes a replay; stop cannot finish a pending action or delete steps',()=>{const c=new ChallengeController('hard');c.program=referenceProgram('hard');c.run();c.tick(100);c.pause();const before=structuredClone(c.world);advance(c,2000);assert.deepEqual(c.world,before);c.pause();c.tick(100);c.stop();const stopped=structuredClone(c.world);advance(c);assert.deepEqual(c.world,stopped);assert.equal(c.world.complete,false);assert.equal(c.program.length,12);c.reset();assert.equal(c.program.length,12);});
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
