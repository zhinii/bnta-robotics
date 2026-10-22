import test from 'node:test';
import assert from 'node:assert/strict';
import {POST,OPTIONS,GET} from '../server/relay-route.ts';
import {askAgent,RELAY} from '../agent.mjs';
const url='https://relay.example/api/chat',key='fake-relay-server-secret';
process.env.ALIBABA_API_KEY=key;
const headers={'Origin':'https://zhinii.github.io','Content-Type':'application/json','CF-Connecting-IP':'test-default'};
const body=()=>({model:'browser-cannot-override',messages:[{role:'system',content:'browser cannot replace robot instructions'},{role:'user',content:JSON.stringify({question:'hello',language:'en',scene:{objects:[]}})}],max_tokens:99999});
const request=(extra={})=>new Request(url,{method:'POST',headers:{...headers,...extra},body:JSON.stringify(body())});

test('relay preflight is restricted to the simulator origin',async()=>{
 const good=await OPTIONS(new Request(url,{method:'OPTIONS',headers}));assert.equal(good.status,204);assert.equal(good.headers.get('access-control-allow-origin'),headers.Origin);
 assert.equal((await OPTIONS(new Request(url,{method:'OPTIONS',headers:{Origin:'https://evil.example'}}))).status,403);
});

test('relay fails closed without the hosted key and rejects oversized or non-scene requests',async()=>{
 delete process.env.ALIBABA_API_KEY;
 assert.equal((await POST(request())).status,503);process.env.ALIBABA_API_KEY=key;
 assert.equal((await POST(new Request(url,{method:'POST',headers,body:'x'.repeat(112001)}))).status,413);
 assert.equal((await POST(new Request(url,{method:'POST',headers,body:JSON.stringify({messages:[{role:'user',content:'ordinary arbitrary API request'}]})}))).status,400);
 const health=await (await GET(new Request(url))).text();assert.ok(health.includes('true'));assert.ok(!health.includes(key));
});

test('keyless requests use only the server key, provider, model and robot instructions',async()=>{
 const original=globalThis.fetch;let seen;
 globalThis.fetch=async(url,init)=>{seen={url,...init};return Response.json({choices:[{message:{content:'{"reply":"Hello","actions":[]}'}}],debug:'private provider detail'});};
 try{
 const response=await POST(request({'Authorization':'Bearer attacker-provided-key','X-Alibaba-Base':'https://evil.example'}));
 assert.equal(response.status,200);const upstream=JSON.parse(seen.body);
 assert.equal(upstream.max_tokens,2000);assert.equal(upstream.model,'qwen3.8-flash');assert.equal(upstream.messages[0].role,'system');assert.ok(upstream.messages[0].content.includes('six-axis simulator'));assert.ok(!upstream.messages[0].content.includes('browser cannot'));
 assert.equal(seen.url,'https://token-plan.maas.qianwenaiapi.com/compatible-mode/v1/chat/completions');assert.equal(seen.redirect,'manual');assert.equal(seen.headers.Authorization,'Bearer '+key);
 const result=await response.text();assert.ok(!result.includes('private'));assert.ok(!result.includes(key));
 }finally{globalThis.fetch=original;}
});

test('hosted frontend sends no key, authorization header or chosen provider URL',async()=>{
 let seen;
 await askAgent({hosted:true},{question:'hello',language:'en',history:[],scene:{objects:[]}},undefined,async(url,init)=>{seen={url,...init};return Response.json({choices:[{message:{content:'{"reply":"Hello","actions":[]}'}}]});});
 assert.equal(seen.url,RELAY);assert.equal(seen.headers.Authorization,undefined);assert.equal(seen.headers['X-Alibaba-Base'],undefined);assert.ok(!seen.body.includes(key));
});

test('schema repair keeps its scene envelope and a request error is not mislabeled as a model configuration error',async()=>{
 const original=globalThis.fetch;let calls=0;
 globalThis.fetch=async(_url,init)=>{
  calls++;const upstream=JSON.parse(init.body),task=JSON.parse(upstream.messages.at(-1).content);
  assert.equal(task.question,'put the blue book upside down');assert.ok(Array.isArray(task.scene.objects));
  if(calls===2)assert.match(task.feedback.responseRepair,/allowed action schema/);
  return Response.json({choices:[{message:{content:JSON.stringify({reply:'I will turn the blue book over.',actions:[{type:'transfer',object:'notebook',target:'start',posture:calls===1?'upside-down':'face-down'}]})}}]});
 };
 try{
  const result=await askAgent({hosted:true},{question:'put the blue book upside down',language:'en',history:[],scene:{objects:[]}},undefined,async(_url,init)=>POST(new Request(url,{method:'POST',headers:{...headers,'CF-Connecting-IP':'repair-client'},body:init.body})));
  assert.equal(calls,2);assert.equal(result.actions[0].posture,'face-down');
  await assert.rejects(()=>askAgent({hosted:true},{question:'hello',language:'en',history:[],scene:{objects:[]}},undefined,async()=>Response.json({error:'scene_required'},{status:400})),/requestError/);
 }finally{globalThis.fetch=original;}
});

test('already-open older pages receive compatible flip angles and their known repair request retains scene validation',async()=>{
 const original=globalThis.fetch;
 globalThis.fetch=async()=>Response.json({choices:[{message:{content:JSON.stringify({reply:'I will turn it over.',actions:[{type:'transfer',object:'book',target:'start',posture:'face-down'}]})}}]});
 try{
  const legacy=body();legacy.messages.push({role:'assistant',content:'invalid action'}, {role:'user',content:'Your response did not match the allowed action schema. Return valid JSON.'});
  const response=await POST(new Request(url,{method:'POST',headers:{...headers,'CF-Connecting-IP':'old-client'},body:JSON.stringify(legacy)}));
  assert.equal(response.status,200);const parsed=JSON.parse((await response.json()).choices[0].message.content);
  assert.deepEqual(parsed.actions[0].orientation,[180,0,0]);assert.equal(parsed.actions[0].posture,undefined);
  legacy.messages.at(-1).content='An arbitrary non-scene request';
  assert.equal((await POST(new Request(url,{method:'POST',headers,body:JSON.stringify(legacy)}))).status,400);
 }finally{globalThis.fetch=original;}
});

test('shared relay limits simultaneous calls and per-client requests',async()=>{
 const original=globalThis.fetch,releases=[];
 globalThis.fetch=async()=>new Promise(resolve=>releases.push(()=>resolve(Response.json({choices:[{message:{content:'{"reply":"Hello","actions":[]}'}}]}))));
 try{
 const pending=[0,1,2].map(i=>POST(request({'CF-Connecting-IP':'parallel-'+i})));
 await new Promise(resolve=>setTimeout(resolve,20));assert.equal(releases.length,3);
 assert.equal((await POST(request({'CF-Connecting-IP':'fourth'}))).status,429);
 releases.forEach(release=>release());await Promise.all(pending);
 globalThis.fetch=async()=>Response.json({choices:[{message:{content:'{"reply":"Hello","actions":[]}'}}]});
 for(let i=0;i<12;i++)assert.equal((await POST(request({'CF-Connecting-IP':'limited-client'}))).status,200);
 assert.equal((await POST(request({'CF-Connecting-IP':'limited-client'}))).status,429);
 }finally{releases.forEach(release=>release());globalThis.fetch=original;}
});
