import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,planActions,inHolder,previewSteps,reverseSteps,applyStep,clearPose} from '../world.mjs';
import {distance} from '../kinematics.mjs';
const fill=['pen','pencil'].map(object=>({type:'transfer',object,target:'pen-holder'}));
test('cup can move to the shelf before filling and tools can be retrieved and restored',()=>{
 const start=initialState(0,'desk');
 const p=planActions(start,[{type:'transfer',object:'pen-holder',target:'shelf-middle'},...fill]);
 const cup=p.result.objects.find(o=>o.container);
 assert.deepEqual(cup.position,[195,160,42]);
 for(const id of ['pen','pencil'])assert.ok(inHolder(p.result,p.result.objects.find(o=>o.id===id)));
 const restored=planActions(p.result,[{type:'restore'}]).result;
 for(const before of start.objects){const after=restored.objects.find(o=>o.id===before.id);assert.ok(distance(after.position,before.position)<.15,before.id);assert.ok(distance(after.rpy,before.rpy)<.02,before.id);}
});
test('filled cup carries both tools, previews them, and undo brings them back together',()=>{
 const start=planActions(initialState(0,'desk'),fill).result,before=structuredClone(start);
 const p=planActions(start,[{type:'transfer',object:'pen-holder',target:'shelf-middle'}]);
 assert.deepEqual(start,before);
 const preview=previewSteps(start,p.steps);
 for(const id of ['pen-holder','pen','pencil'])assert.ok(preview.destinations.some(o=>o.id===id));
 const replay=structuredClone(start);
 for(const step of p.steps){applyStep(replay,step);if(replay.held==='pen-holder')for(const id of ['pen','pencil'])assert.ok(inHolder(replay,replay.objects.find(o=>o.id===id)));}
 assert.ok(clearPose(replay.q,replay));
 for(const step of reverseSteps(start,p.steps))applyStep(replay,step);
 for(const object of start.objects)assert.ok(distance(replay.objects.find(o=>o.id===object.id).position,object.position)<.15,object.id);
});
test('tilting a held cup is rejected atomically with an upright explanation',()=>{
 const s=planActions(initialState(0,'desk'),[{type:'pick',object:'pen-holder'}]).result,before=structuredClone(s);
 assert.throws(()=>planActions(s,[{type:'rotate',axis:'x',angle:90}]),/cupUpright/);
 assert.deepEqual(s,before);
});
