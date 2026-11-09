import test from 'node:test';
import assert from 'node:assert/strict';
import { applyStep, initialState, planActions, snapshot } from '../world.mjs';
import { createTimedChallenge, deskTargets, formatChallengeTime } from '../timed-challenge.mjs';
import { precisionCommand } from '../precision-command.mjs';

for(const [level,targets] of Object.entries(deskTargets))test(`${level}: all visual spots are reachable and replay reproduces the placement`,()=>{
  let now=0;
  const timed=createTimedChallenge(()=>now),start=initialState(0,'desk');
  timed.select(level);
  timed.start(start);
  assert.equal(timed.select('hard'),false);
  assert.equal(timed.beginReplay(),null);
  let state=start;
  for(const target of targets){
    const plan=planActions(state,[{type:'transfer',object:target.id,position:target.xy}]);
    timed.append(plan.steps);
    state=plan.result;
    now+=7000;
  }
  for(const target of targets)assert.deepEqual(state.objects.find(o=>o.id===target.id).position.slice(0,2),target.xy);
  assert.equal(timed.recording,true,'the student finishes recording, even after the placement is complete');
  timed.finish();
  assert.equal(timed.recording,false);
  assert.equal(timed.summary().moves,targets.length);
  assert.equal(timed.summary().attemptMs,7000*targets.length);
  now+=50000;
  const playback=timed.beginReplay();
  assert.deepEqual(playback.scene,start);
  for(const step of playback.steps){applyStep(playback.scene,step);now+=(step.seconds||0)*1000;}
  timed.endReplay();
  assert.deepEqual(snapshot(playback.scene),snapshot(state));
  assert.equal(timed.summary().replayComplete,true);
  assert.ok(timed.summary().replayMs>0);
  assert.ok(timed.summary().replayMs<timed.summary().attemptMs);
  assert.equal(timed.summary().moves,targets.length);
});

test('stop, replay and retry preserve separate clocks and do not grade a partial arrangement',()=>{
  let now=0;
  const timed=createTimedChallenge(()=>now),start=initialState(0,'desk');
  timed.start(start);
  const plan=planActions(start,[{type:'transfer',object:'book',target:'shelf-left'}]);
  timed.append([]);
  timed.append(plan.steps);
  now=15000;timed.finish();
  assert.equal(timed.summary().moves,1);
  timed.beginReplay();now+=1500;timed.endReplay({stopped:true});
  assert.equal(timed.summary().replayStopped,true);
  assert.equal(timed.summary().replayComplete,false);
  assert.equal(timed.summary().replayMs,1500);
  assert.equal(timed.summary().attemptMs,15000);
  timed.beginReplay();now+=3000;timed.endReplay();
  assert.equal(timed.summary().replayComplete,true);
  assert.equal(timed.summary().moves,1);
  assert.equal(formatChallengeTime(61234),'01:01.2');
  assert.equal(timed.select('medium'),true);
  assert.equal(timed.summary().moves,0);
  timed.select('easy');assert.equal(timed.summary().moves,1);
  timed.start(start);assert.equal(timed.summary().moves,0);
});

test('numbered spots and X/Y commands use exact locations without imposing a pose',()=>{
  const start=initialState(0,'desk');
  assert.deepEqual(precisionCommand('Put the red book at spot 1',start.q,'en',deskTargets.easy).actions,
    [{type:'transfer',object:'book',position:[145,160]}]);
  assert.deepEqual(precisionCommand('把蓝色笔记本放在 2 号位置',start.q,'zh',deskTargets.medium).actions,
    [{type:'transfer',object:'notebook',position:[195,160]}]);
  assert.deepEqual(precisionCommand('Place the pen holder at X 160 Y 65',start.q,'en').actions,
    [{type:'transfer',object:'pen-holder',position:[160,65]}]);
  assert.deepEqual(precisionCommand('把铅笔放在 X 105，Y 5',start.q,'zh').actions,
    [{type:'transfer',object:'pencil',position:[105,5]}]);
  assert.equal(precisionCommand('Put the red book at spot 4',start.q,'en',deskTargets.easy),null);
});

test('precise joint commands change only the named joint, preserve direction, and still check limits',()=>{
  const start=initialState(0,'desk');
  const request=precisionCommand('Rotate joint 1 90degrees clockwise',start.q,'en');
  assert.equal(request.actions[0].joints[0],start.q[0]-90);
  assert.deepEqual(request.actions[0].joints.slice(1),start.q.slice(1));
  assert.equal(precisionCommand('关节 1 逆时针旋转 90 度',start.q,'zh').actions[0].joints[0],start.q[0]+90);
  assert.equal(precisionCommand('could you wave?',start.q,'en'),null);
  assert.throws(()=>planActions(start,precisionCommand('rotate joint 1 250 degrees clockwise',start.q,'en').actions),/reach/);
});
