import test from 'node:test';
import assert from 'node:assert/strict';
import {askAgent,needsSceneImage,parseResponse} from '../agent.mjs';
import {POST} from '../server/relay-route.ts';
const image={data:'data:image/jpeg;base64,/9j/2Q==',width:2,height:2},url='https://relay.example/api/chat',headers={'Origin':'https://zhinii.github.io','Content-Type':'application/json','CF-Connecting-IP':'vision-test'};
process.env.ALIBABA_API_KEY='fake-vision-key';process.env.ALIBABA_VISION_MODEL='qwen3.7-plus';
const body=()=>({model:'untrusted-model',messages:[{role:'system',content:'posture:"spine" posture:"face-down"'},{role:'user',content:JSON.stringify({question:'look at the book',language:'en',scene:{objects:[]}})}],scene_image:image});
const post=b=>POST(new Request(url,{method:'POST',headers,body:JSON.stringify(b)}));
test('routine commands send no screenshot; a visual question captures only one compact scene image',async()=>{
 let captures=0;const captureScene=()=>{captures++;return {...image,frame:{width:2,height:2,objects:[{id:'book',pixel:[1,1]}]}};};
 const input={language:'en',history:[],scene:{objects:[]},captureScene};
 for(const question of ['put the red book on the shelf','look at the red book']){
  await askAgent({hosted:true},{...input,question},undefined,async(_,init)=>{
   const sent=JSON.parse(init.body);assert.equal(!!sent.scene_image,question.startsWith('look'));
   if(sent.scene_image){assert.equal(sent.scene_image.frame,undefined);assert.equal(JSON.parse(sent.messages.at(-1).content).scene.view.objects[0].id,'book');}
   return Response.json({choices:[{message:{content:'{"reply":"Ready","actions":[]}'}}],perception:{imageStatus:'seen'}});
  });
 }
 assert.equal(captures,1);assert.equal(needsSceneImage('hello'),false);
});
test('an unavailable vision model is remembered for this connection instead of retrying images on every command',async()=>{
 const connection={hosted:true};let captures=0;
 for(let i=0;i<2;i++){
  const response=await askAgent(connection,{question:'look at this book',language:'en',history:[],scene:{objects:[]},captureScene:()=>{captures++;return image;}},undefined,async(_,init)=>{
   assert.equal(!!JSON.parse(init.body).scene_image,i===0);
   return Response.json({choices:[{message:{content:'{"reply":"I can use the exact positions.","actions":[]}'}}],...(i===0?{perception:{imageStatus:'unavailable'}}:{})});
  });assert.deepEqual(response.actions,[]);
 }assert.equal(captures,1);
});
test('a destination clarification cannot execute a placement, while a pickup can ask where to place it next',()=>{
 const reply='I will stand the blue book on its spine. Where should I place it: on the shelf or back on the desk?';
 assert.deepEqual(parseResponse(JSON.stringify({reply,actions:[{type:'transfer',object:'notebook',target:'start',posture:'spine'}]})).actions,[]);
 assert.deepEqual(parseResponse(JSON.stringify({reply:'Which side?',needsInput:true,actions:[{type:'pick',object:'book'}]})).actions,[]);
 assert.equal(parseResponse(JSON.stringify({reply:'I will pick it up. Where should I put it?',actions:[{type:'pick',object:'book'}]})).actions[0].type,'pick');
});
test('relay accepts only bounded inline scene images and owns the vision model and API key',async()=>{
 const original=globalThis.fetch;let sent;
 globalThis.fetch=async(_,init)=>{sent=JSON.parse(init.body);return Response.json({choices:[{message:{content:'{"reply":"I see a book.","actions":[]}'}}]});};
 try{
  const response=await post(body());assert.equal(response.status,200);assert.equal(sent.model,'qwen3.7-plus');assert.equal(sent.messages.at(-1).content[1].image_url.url,image.data);assert.equal((await response.json()).perception.imageStatus,'seen');
  for(const bad of [{...image,data:'https://evil.example/image.jpg'},{...image,width:513},{...image,data:'data:image/jpeg;base64,'+'x'.repeat(64000)}])assert.equal((await post({...body(),scene_image:bad})).status,400);
 }finally{globalThis.fetch=original;}
});
test('unsupported image access falls back once to geometry with an explicit status instead of a model-settings error',async()=>{
 const original=globalThis.fetch,calls=[];
 globalThis.fetch=async(_,init)=>{const sent=JSON.parse(init.body);calls.push(sent);return calls.length===1?Response.json({error:'not enabled'},{status:404}):Response.json({choices:[{message:{content:'{"reply":"I can use the positions.","actions":[]}'}}]});};
 try{const response=await post(body());assert.equal(response.status,200);const result=await response.json();assert.equal(result.perception.imageStatus,'unavailable');assert.equal(calls.length,2);assert.equal(calls[1].model,'qwen3.8-flash');assert.equal(typeof calls[1].messages.at(-1).content,'string');}
 finally{globalThis.fetch=original;}
});
