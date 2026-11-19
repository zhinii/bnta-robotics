import test from 'node:test';
import assert from 'node:assert/strict';
import {askAgent,parseResponse} from '../agent.mjs';
import {initialState,snapshot} from '../world.mjs';
const scene=snapshot(initialState(0,'desk'));
const input={scene,history:[],language:'en'};
const noFetch=()=>{throw Error('ambiguous request must not call for a motion plan');};

test('unclear objects, pointing and axes ask one question before any motion in English and Chinese',async()=>{
  for(const [question,language,expected] of [
    ['pick up the book','en',/Which book/],['拿起书','zh',/红书还是蓝色/],
    ['move this one','en',/Which item/],['把那个放好','zh',/哪个物品/],
    ['rotate the pen 90 degrees','en',/which axis/],['把铅笔旋转90度','zh',/哪个轴/],
    ['nudge the red book right','en',/How far/]]){
    const reply=await askAgent({hosted:true},{...input,question,language},undefined,noFetch);
    assert.deepEqual(reply.actions,[]);assert.match(reply.reply,expected);
  }
});

test('a clarification reply cannot sneak in a pickup, pose or social action',()=>{
  for(const reply of ['Which book should I pick up?','你想移动哪本书？','What axis should I use?','Would you like a wave or a dance?']){
    assert.deepEqual(parseResponse(JSON.stringify({reply,actions:[{type:'pick',object:'book'}]})).actions,[]);
  }
  assert.deepEqual(parseResponse(JSON.stringify({reply:'Tell me how it should face.',needsInput:true,actions:[{type:'wave'}]})).actions,[]);
  assert.equal(parseResponse(JSON.stringify({reply:'I’ll pick up the red book.',actions:[{type:'pick',object:'book'}],after:'Where should I put it?'})).actions.length,1);
});

test('clear requests and contextual answers reach the model with clarification guidance',async()=>{
  for(const [question,history] of [
    ['put the red book on the shelf',[]],['hello',[]],
    ['move it left 10 mm',[{role:'user',content:'pick up the blue notebook'}]],
    ['the blue one',[{role:'user',content:'pick up the book'},{role:'assistant',content:'Which book—the red book or the blue notebook?'}]],
    ['X',[{role:'user',content:'rotate the pen 90 degrees'},{role:'assistant',content:'Around which axis: X, Y or Z?'}]]]){
    let called=false;
    await askAgent({hosted:true},{...input,question,history},undefined,async(_,init)=>{
      called=true;const task=JSON.parse(JSON.parse(init.body).messages.at(-1).content);
      assert.match(task.clarificationPolicy,/ONE short question/);
      assert.equal(task.question,question);
      return Response.json({choices:[{message:{content:'{"reply":"Ready.","actions":[]}'}}]});
    });assert.equal(called,true);
  }
});
