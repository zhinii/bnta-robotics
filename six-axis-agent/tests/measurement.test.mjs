import test from 'node:test';
import assert from 'node:assert/strict';
import {movementIntent} from '../agent.mjs';
import {initialState,planActions,snapshot} from '../world.mjs';
test('explicit metric measurements override model unit mistakes in either language',()=>{
 const response={reply:'Okay',actions:[{type:'shift',object:'book',direction:'right',distance:1,unit:'mm'}]};
 for(const [q,distance,unit] of [['一厘米',1,'cm'],['两厘米',2,'cm'],['半厘米',.5,'cm'],['二十五毫米',25,'mm'],['one centimetre',1,'cm'],['half a centimetre',.5,'cm'],['2.5 cm',2.5,'cm']]){
  const a=movementIntent(response,q).actions[0];assert.equal(a.distance,distance,q);assert.equal(a.unit,unit,q);
 }
});
test('an explicit off-desk goal clears the whole object before gravity releases it',()=>{
 for(const question of ['drop the red book off the front edge of the desk','把红书从桌子前边缘扔下去']){
  const response=movementIntent({reply:'Okay',actions:[{type:'drop',object:'book',position:[135,-220]}]},question);
  assert.equal(response.actions[0].clearOf,'desk');
  const p=planActions(initialState(0,'desk'),response.actions);assert.equal(snapshot(p.result).objects.find(o=>o.id==='book').location,'floor');
 }
});
