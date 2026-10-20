import test from 'node:test';
import assert from 'node:assert/strict';
import {POST,OPTIONS} from '../server/relay-route.ts';
const url='https://relay.example/api/chat';
const headers={'Origin':'https://zhinii.github.io','Content-Type':'application/json','Authorization':'Bearer fake-relay-test-key','X-Alibaba-Base':'https://token-plan.maas.qianwenaiapi.com/compatible-mode/v1'};
test('relay preflight is restricted to the simulator origin',async()=>{
 const good=await OPTIONS(new Request(url,{method:'OPTIONS',headers}));assert.equal(good.status,204);assert.equal(good.headers.get('access-control-allow-origin'),headers.Origin);
 assert.equal((await OPTIONS(new Request(url,{method:'OPTIONS',headers:{Origin:'https://evil.example'}}))).status,403);
});
test('relay rejects arbitrary upstreams, missing credentials and oversized requests',async()=>{
 assert.equal((await POST(new Request(url,{method:'POST',headers:{...headers,'X-Alibaba-Base':'https://evil.example'},body:'{}'}))).status,400);
 assert.equal((await POST(new Request(url,{method:'POST',headers:{...headers,Authorization:''},body:'{}'}))).status,400);
 assert.equal((await POST(new Request(url,{method:'POST',headers,body:'x'.repeat(48001)}))).status,413);
});
test('relay bounds inference and returns only assistant content',async()=>{
 const original=globalThis.fetch;let seen;
 globalThis.fetch=async(url,init)=>{seen={url,...init};return Response.json({choices:[{message:{content:'{"reply":"Which block?","actions":[]}'}}],debug:'private provider detail'});};
 try{
 const response=await POST(new Request(url,{method:'POST',headers,body:JSON.stringify({model:'qwen3.8-flash',messages:[{role:'user',content:'pick'}],max_tokens:99999})}));
 assert.equal(response.status,200);assert.equal(JSON.parse(seen.body).max_tokens,900);assert.equal(seen.redirect,'error');assert.equal(seen.headers.Authorization,headers.Authorization);
 const result=await response.text();assert.ok(!result.includes('private'));assert.ok(!result.includes('fake-relay-test-key'));
 }finally{globalThis.fetch=original;}
});
