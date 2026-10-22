import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,snapshot,planActions,validateActions,shiftPosition,dropStep,applyStep,objectLocation,FLOOR_Z} from '../world.mjs';
import {objectBounds} from '../shapes.mjs';
import {SYSTEM,askAgent} from '../agent.mjs';
test('vague amounts ask without moving, including after a previous measured move',async()=>{
 for(const question of ['nudge it right','move it a little to the left','shift it slightly','挪一点']){
  const r=await askAgent({hosted:true},{question,language:'en',scene:snapshot(initialState(0,'desk')),history:[{role:'user',content:'move the red book left by its own width'}]},undefined,()=>{throw Error('no request needed');});
  assert.deepEqual(r.actions,[]);assert.match(r.reply,/How far/);
 }
});
test('relative displacements support metric, fractional and object-sized distances without named homes',()=>{
 const s=initialState(0,'desk'),book=s.objects.find(o=>o.id==='book');
 for(const [direction,axis,sign] of [['left',0,-1],['right',0,1],['front',1,-1],['back',1,1]]){
  const p=shiftPosition(s,{object:'book',direction,distance:.5,unit:'width'});
  assert.equal(p[axis],book.position[axis]+sign*book.size[0]/2);
 }
 assert.deepEqual(shiftPosition(s,{object:'book',offset:[2.5,-1]}),[172.5,-161]);
 assert.equal(shiftPosition(s,{object:'book',direction:'right',distance:2,unit:'cm'})[0],190);
 assert.equal(shiftPosition(s,{object:'book',direction:'left',distance:1,unit:'length',reference:'pencil'})[0],82);
 assert.throws(()=>validateActions([{type:'shift',object:'book',direction:'right'}]),/distance/);
 assert.match(SYSTEM,/Do not invent a nudge size/);
});
test('current pose, desk and relative surface are semantic destinations, without arbitrary radius limits',()=>{
 assert.equal(validateActions([{type:'transfer',object:'book',posture:'flat'}])[0].target,'current');
 assert.equal(validateActions([{type:'transfer',object:'book',target:'book',posture:'spine'}])[0].target,'current');
 assert.equal(validateActions([{type:'transfer',object:'pen',target:'table'}])[0].target,'desk');
 const relative=validateActions([{type:'transfer',object:'pen',beside:'book',relation:'front',surface:'shelf'}])[0];
 assert.equal(relative.side,'left');assert.equal(relative.surface,'shelf');
 assert.doesNotThrow(()=>validateActions([{type:'transfer',object:'book',position:[500,-220]}]));
});
test('a checked relative move preserves the actual object pose and can be chained',()=>{
 const s=initialState(0,'desk'),before=structuredClone(s);
 const plan=planActions(s,[{type:'shift',object:'book',direction:'left',distance:1,unit:'width'},{type:'shift',object:'book',direction:'right',distance:1,unit:'cm'}]);
 const book=plan.result.objects.find(o=>o.id==='book');
 assert.ok(Math.abs(book.position[0]-144)<.15);assert.ok(Math.abs(book.position[1]+160)<.15);
 assert.deepEqual(s,before);assert.equal(plan.result.held,null);
});
test('released geometry lands on the finite desk, laptop or floor and holder contents travel together',()=>{
 const s=initialState(0,'desk'),book=s.objects.find(o=>o.id==='book');
 for(const [position,bottom] of [[[170,-160,140],0],[[250,-50,180],6.4],[[120,-280,140],FLOOR_Z]]){
  book.position=[...position];const step=dropStep(s,['book']);applyStep(s,step);
  assert.ok(Math.abs(objectBounds(book).low[2]-bottom)<.02,JSON.stringify(book.position));
  if(bottom===FLOOR_Z)assert.equal(objectLocation(s,book).location,'floor');
 }
 const holder=s.objects.find(o=>o.id==='pen-holder'),pen=s.objects.find(o=>o.id==='pen');
 holder.position=[120,-280,100];pen.position=[112,-288,126];pen.rpy=[90,0,0];
 const offset=pen.position.map((v,i)=>v-holder.position[i]);
 applyStep(s,dropStep(s,['pen-holder','pen']));assert.deepEqual(pen.position.map((v,i)=>v-holder.position[i]),offset);
});
test('release is actual gripper opening plus gravity, with no destination request or fake reverse fall',()=>{
 const s=initialState(0,'desk');
 const held=planActions(s,[{type:'pick',object:'book'}]).result;
 const p=planActions(held,[{type:'release'}]);assert.equal(p.result.held,null);
 assert.ok(p.steps.some(step=>step.type==='release'));assert.ok(p.steps.some(step=>step.type==='fall'));
 assert.ok(Math.abs(objectBounds(p.result.objects.find(o=>o.id==='book')).low[2])<.02);
 assert.throws(()=>planActions(s,[{type:'release'}]),/empty/);
});


