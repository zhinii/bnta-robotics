import test from 'node:test';
import assert from 'node:assert/strict';
import {initializeConnection} from '../connection.mjs';
import {askAgent} from '../agent.mjs';

test('startup retries temporary host or browser failures with fresh independent signals',async()=>{
  const signals=[],attempts=[],delays=[];
  const result=await initializeConnection(async signal=>{
    signals.push(signal);
    if(signals.length===1)throw Error('provider');
    if(signals.length===2)throw new TypeError('Failed to fetch');
    return 'connected';
  },{onAttempt:n=>attempts.push(n),wait:async ms=>delays.push(ms)});
  assert.equal(result,'connected');assert.deepEqual(attempts,[1,2,3]);assert.deepEqual(delays,[2000,4000]);
  assert.equal(new Set(signals).size,3);
});

test('a stalled check is aborted and retried; an exhausted startup stops at three attempts',async()=>{
  const signals=[];
  const result=await initializeConnection(signal=>{
    signals.push(signal);return signals.length===1?new Promise(()=>{}):Promise.resolve('ok');
  },{timeoutMs:5,wait:async()=>{}});
  assert.equal(result,'ok');assert.equal(signals[0].aborted,true);assert.equal(signals[1].aborted,false);
  let calls=0;
  await assert.rejects(initializeConnection(async()=>{calls++;throw Error('provider');},{wait:async()=>{}}),/provider/);
  assert.equal(calls,3);
});

test('credentials, quota and model errors stop immediately, without repeated paid requests',async()=>{
  for(const reason of ['auth','quota','model','requestError','invalid']){
    let calls=0;
    await assert.rejects(initializeConnection(async()=>{calls++;throw Error(reason);},{wait:async()=>{throw Error('must not wait');}}),new RegExp(reason));
    assert.equal(calls,1);
  }
});

test('connection checks can disable hidden immediate retries and send no task context',async()=>{
  let calls=0;
  await assert.rejects(askAgent({hosted:true},{question:'connection_check',language:'en',history:[],scene:{objects:[]},retryTransport:false},undefined,async(_,init)=>{
    calls++;const task=JSON.parse(JSON.parse(init.body).messages.at(-1).content);
    assert.deepEqual(task.scene,{objects:[]});assert.equal(task.retryTransport,undefined);
    return new Response('Website access could not be verified.',{status:503});
  }),/provider/);
  assert.equal(calls,1);
});
