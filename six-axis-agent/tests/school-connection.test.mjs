import test from 'node:test';
import assert from 'node:assert/strict';
import {askAgent} from '../agent.mjs';
test('school mode sends to same-origin API without a browser credential or provider override',async()=>{
 let called=0;
 const reply=await askAgent({server:true},{question:'hello',language:'en',history:[],scene:{}},undefined,async(url,options)=>{
  called++;
  assert.equal(url,'/api/chat');
  assert.equal(options.headers.Authorization,undefined);
  assert.equal(options.headers['X-Alibaba-Base'],undefined);
  assert.equal(JSON.parse(options.body).model,undefined);
  return new Response(JSON.stringify({choices:[{message:{content:'{"reply":"Hello!","actions":[]}'}}]}));
 });
 assert.equal(called,1);assert.equal(reply.reply,'Hello!');
});
