import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,planActions,reverseSteps,applyStep,postureOrientations,restingFace} from '../world.mjs';
import {rotationFromEuler,multiply,orientationError} from '../kinematics.mjs';
import {objectBounds} from '../shapes.mjs';
import {placementIntent} from '../agent.mjs';

test('both books rest on their actual bound spine at their original place with real regrasping and reversible motion',()=>{
 for(const id of ['notebook','book']){
  const s=initialState(0,'desk'),before=structuredClone(s),plan=planActions(s,[{type:'transfer',object:id,target:'start',posture:'spine'}]),object=plan.result.objects.find(o=>o.id===id);
  assert.deepEqual(s,before);assert.equal(restingFace(object),'spine');assert.ok(rotationFromEuler(object.rpy)[6]>.999);assert.ok(Math.abs(objectBounds(object).low[2])<.001);assert.deepEqual(object.position.slice(0,2),object.origin.slice(0,2));
  assert.equal(plan.steps.filter(step=>step.type==='grip').length,2);assert.ok(plan.steps.findIndex(step=>step.type==='release')<plan.steps.findLastIndex(step=>step.type==='grip'));
  for(const other of before.objects.filter(o=>o.id!==id))assert.deepEqual(plan.result.objects.find(o=>o.id===other.id),other);
  const reversed=structuredClone(plan.result);for(const step of reverseSteps(before,plan.steps))applyStep(reversed,step);
  for(const original of before.objects){const restored=reversed.objects.find(o=>o.id===original.id);assert.deepEqual(restored.position,original.position);assert.deepEqual(restored.rpy,original.rpy);}
 }
});
test('spine is distinct from the opposite page edge, and a spine command never becomes a guessed tilt',()=>{
 const book=initialState(0,'desk').objects[0];for(const rpy of postureOrientations(book,'spine'))assert.ok(rotationFromEuler(rpy)[6]>.999);
 const response=placementIntent({reply:'I will stand it on its spine.',actions:[{type:'transfer',object:'notebook',target:'start',orientation:[45,0,0]}]},'put the blue book on its spine');
 assert.equal(response.actions[0].posture,'spine');assert.equal(response.actions[0].orientation,undefined);
 const flat={reply:'I will lay it flat.',actions:[{type:'transfer',object:'notebook',target:'start',posture:'flat'}]};
 assert.deepEqual(placementIntent(flat,"don't put the blue book on its spine; lay it flat"),flat);
 assert.deepEqual(placementIntent(flat,"do not put it upside down; lay it flat"),flat);
 assert.throws(()=>planActions(initialState(0,'desk'),[{type:'transfer',object:'pen',target:'start',posture:'spine'}]),/angle/);
});
test('an X rotation after a Z turn composes around the named world axis rather than adding an Euler field',()=>{
 const plan=planActions(initialState(0,'desk'),[{type:'pick',object:'book'},{type:'rotate',axis:'z',angle:90},{type:'rotate',axis:'x',angle:90}]),actual=rotationFromEuler(plan.result.objects.find(o=>o.id==='book').rpy),expected=multiply(rotationFromEuler([90,0,0]),rotationFromEuler([0,0,90]));
 assert.ok(Math.hypot(...orientationError(expected,actual))<.004);assert.equal(plan.result.held,'book');
});
