import test from 'node:test';
import assert from 'node:assert/strict';
import { applyStep, initialState, inHolder, objectLocation, planActions, restingFace, snapshot } from '../world.mjs';
import { createTimedChallenge, formatChallengeTime } from '../timed-challenge.mjs';
import { precisionCommand } from '../precision-command.mjs';
import { referenceArrangements } from './reference-arrangements.mjs';

for(const [level,actions] of Object.entries(referenceArrangements))test(`${level}: the reference arrangement is reachable and replay reproduces it`,()=>{
  let now=0;
  const timed=createTimedChallenge(()=>now),start=initialState(0,'desk');
  timed.select(level);
  timed.start(start);
  assert.equal(timed.select('hard'),false);
  assert.equal(timed.beginReplay(),null);
  let state=start;
  for(const action of actions){
    const plan=planActions(state,[action]);
    timed.append(plan.steps);
    state=plan.result;
    now+=7000;
  }
  const item=id=>state.objects.find(o=>o.id===id);
  const book=item('book'),notebook=item('notebook');
  assert.equal(objectLocation(state,book).onShelf,true);
  assert.equal(objectLocation(state,notebook).onShelf,true);
  assert.equal(book.position[0]<notebook.position[0],level!=='hard');
  assert.equal(restingFace(book),{easy:'flat',medium:'short-edge',hard:'face-down'}[level]);
  assert.equal(restingFace(notebook),level==='hard'?'spine':'flat');
  assert.equal(inHolder(state,item('pen')),level==='medium');
  assert.equal(inHolder(state,item('pencil')),level==='hard');
  if(level==='hard'){
    assert.deepEqual(item('pen-holder').position.slice(0,2),[160,65]);
    assert.deepEqual(item('pen').position.slice(0,2),[95,-135]);
    assert.deepEqual(item('pen').rpy,[0,0,90]);
  }
  assert.equal(timed.recording,true,'the student finishes recording, even after the placement is complete');
  timed.finish(state);
  assert.equal(timed.recording,false);
  assert.equal(timed.summary().moves,actions.length);
  assert.equal(timed.summary().attemptMs,7000*actions.length);
  now+=50000;
  const playback=timed.beginReplay();
  assert.deepEqual(playback.scene,start);
  for(const step of playback.steps){applyStep(playback.scene,step);now+=(step.seconds||0)*1000;}
  timed.endReplay();
  assert.deepEqual(snapshot(playback.scene),snapshot(state));
  assert.equal(timed.summary().replayComplete,true);
  assert.ok(timed.summary().replayMs>0);
  assert.ok(timed.summary().replayMs<timed.summary().attemptMs);
  assert.equal(timed.summary().moves,actions.length);
});

test('stop, replay and retry preserve separate clocks and do not grade a partial arrangement',()=>{
  let now=0;
  const timed=createTimedChallenge(()=>now),start=initialState(0,'desk');
  timed.start(start);
  const plan=planActions(start,[{type:'transfer',object:'book',target:'shelf-left'}]);
  timed.append([]);
  timed.append(plan.steps);
  now=15000;timed.finish(plan.result);
  assert.equal(timed.summary().moves,1);
  timed.beginReplay();now+=1500;timed.advanceReplay(1500);timed.endReplay({stopped:true});
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

test('X/Y commands remain available independently of the reference arrangement',()=>{
  const start=initialState(0,'desk');
  assert.deepEqual(precisionCommand('Place the pen holder at X 160 Y 65',start.q,'en').actions,
    [{type:'transfer',object:'pen-holder',position:[160,65]}]);
  assert.deepEqual(precisionCommand('把铅笔放在 X 105，Y 5',start.q,'zh').actions,
    [{type:'transfer',object:'pencil',position:[105,5]}]);
  assert.equal(precisionCommand('Put the red book at spot 1',start.q,'en'),null);
});

test('pausing freezes replay time and editing restores the saved endpoint with the earlier moves',()=>{
  let now=0;
  const timed=createTimedChallenge(()=>now),start={objects:[{position:[0,0,0]}]};
  const end={objects:[{position:[10,0,0]}]};
  timed.start(start);timed.append([{type:'move',seconds:2}]);
  now=5000;timed.finish(end);
  const replay=timed.beginReplay();
  replay.scene.objects[0].position[0]=3;
  timed.advanceReplay(500);timed.pauseReplay();now=100000;timed.advanceReplay(1000);
  assert.equal(timed.summary().replayMs,500);
  assert.equal(timed.paused,true);
  assert.equal(timed.edit(),null);
  timed.pauseReplay();timed.advanceReplay(500);timed.endReplay({stopped:true});
  assert.equal(timed.summary().replayMs,1000);
  assert.deepEqual(timed.savedScene(),end);
  const edited=timed.edit();
  assert.deepEqual(edited,end);
  edited.objects[0].position[0]=12;
  assert.deepEqual(timed.savedScene(),end,'editing works on a copy of the saved scene');
  timed.append([{type:'move',seconds:1}]);now+=2000;timed.finish(edited);
  assert.equal(timed.summary().attemptMs,7000,'review and playback time are excluded from solve time');
  assert.equal(timed.summary().moves,2);
  assert.equal(timed.summary().replayMs,null);
  const again=timed.beginReplay();
  assert.deepEqual(again.scene,start);assert.equal(again.commands.length,2);
  timed.endReplay();assert.equal(timed.summary().replayMs,3000);
  assert.equal(timed.clear(),true);
  assert.equal(timed.summary().attemptMs,null);
  assert.equal(timed.summary().replayComplete,false);
  assert.equal(timed.savedScene(),null);
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
