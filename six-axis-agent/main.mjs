import { initialState, snapshot, applyStep, CATALOG } from './world.mjs?v=dorm-20261021-1';
import { askAgent, validateConnection, DEFAULTS } from './agent.mjs?v=dorm-20261021-1';
import { createScene } from './scene.mjs?v=dorm-20261021-1';
import { createSpeech } from './speech.mjs?v=dorm-20261021-1';
import { words, challenges } from './i18n.mjs?v=dorm-20261021-1';

const $=id=>document.getElementById(id);
let language='en';try{language=localStorage.getItem('six-axis-language')==='zh'?'zh':'en';}catch{}
let state=initialState(0,'desk'),connection=null,busy=false,epoch=0,abort=null,history=[],activity='',view=null,undo=[],worker=null,workerReject=null,challengeIndex=0;
const t=(key,vars={})=>Object.entries(vars).reduce((s,[k,v])=>s.replaceAll('{'+k+'}',v),words[language][key]||key);
const name=id=>CATALOG[id]?.[language==='zh'?'zh':'name']||state.obstacles.find(o=>o.id===id)?.[language==='zh'?'zh':'name']||({table:'桌面','robot base':'机械臂底座','tall divider':'高挡板','low divider':'矮挡板'}[id]&&language==='zh'?{table:'桌面','robot base':'机械臂底座','tall divider':'高挡板','low divider':'矮挡板'}[id]:id);
const perception=()=>({...snapshot(state),canUndo:undo.length>0});
function add(role,content,{key,vars,error=false}={}){
  const el=document.createElement('div');el.className='message '+role+(error?' error':'');
  const who=document.createElement('div');who.className='who';who.textContent=t(role==='user'?'you':role==='system'?'system':'robot');
  const body=document.createElement('div');body.className='body';body.textContent=content;el.append(who,body);
  if(key){el.dataset.key=key;el.dataset.vars=JSON.stringify(vars||{});}
  $('messages').append(el);$('messages').scrollTop=$('messages').scrollHeight;
  requestAnimationFrame(()=>$('messages').scrollTop=$('messages').scrollHeight);
  if($('messages').children.length>80)$('messages').firstElementChild.remove();return el;
}
function say(key,vars={},role='assistant',error=false){return add(role,t(key,vars),{key,vars,error});}
function remember(role,content){history.push({role,content});history=history.slice(-12);}
const speech=createSpeech({
  Recognition:window.SpeechRecognition||window.webkitSpeechRecognition,language:()=>language,
  onText:text=>{$('prompt').value=text;},
  onState:active=>{activity=active?'listening':'';refresh();},
  onMessage:key=>{if(key==='speechReady'){$('activity').textContent=t(key);$('prompt').focus();}else say(key,{},'system');}
});
function render(){view?.update(state);$('scene-state').textContent=state.held?t('holding',{object:name(state.held)}):t('empty');}
function refresh(){
  document.documentElement.lang=language;
  document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  $('language').textContent=language==='en'?'中文':'English';$('language').setAttribute('aria-label',language==='en'?'Switch to Chinese':'切换至英文');
  $('reset').title=t('reset');$('reset').setAttribute('aria-label',t('reset'));
  $('kit').setAttribute('aria-label',language==='en'?'Objects on the table':'桌面物品');$('kit').value=state.kit;
  $('api-key').placeholder=t('keyPlaceholder');$('prompt').placeholder=t('promptPlaceholder');$('prompt').setAttribute('aria-label',t('messageLabel'));
  $('api-key').hidden=!!connection;$('prompt').hidden=!connection;$('connection-options').hidden=!!connection;
  $('input-label').textContent=t(connection?'messageLabel':'keyLabel');$('input-label').htmlFor=connection?'prompt':'api-key';
  $('key-note').hidden=!!connection;$('reconnect').hidden=!connection;$('reconnect').disabled=busy;
  $('suggestions').hidden=!connection||busy;$('mic').hidden=!connection||busy;$('speech-note').hidden=!connection;
  $('mic').title=t(speech.active?'micStop':'mic');$('mic').setAttribute('aria-label',t(speech.active?'micStop':'mic'));$('mic').setAttribute('aria-pressed',String(speech.active));
  $('send').textContent=t(connection?'send':'connect');$('send').hidden=busy;$('send').disabled=speech.active;$('stop').hidden=!busy;
  $('api-key').disabled=busy;$('prompt').disabled=busy;$('base-url').disabled=busy;$('model').disabled=busy;
  $('new-scene').disabled=busy;$('kit').disabled=busy;
  $('connection-state').textContent=t(connection?'online':'offline');$('connection-state').classList.toggle('online',!!connection);
  $('activity').textContent=activity?t(activity):'';
  document.querySelectorAll('.message[data-key]').forEach(el=>{const vars=JSON.parse(el.dataset.vars);if(vars.objectId)vars.object=name(vars.objectId);el.querySelector('.body').textContent=t(el.dataset.key,vars);});
  document.querySelectorAll('.message').forEach(el=>el.querySelector('.who').textContent=t(el.classList.contains('user')?'you':el.classList.contains('system')?'system':'robot'));
  view?.language(language);render();
}
function status(key){activity=key;refresh();}
function cancel(announce=true){
  epoch++;abort?.abort();abort=null;worker?.terminate();worker=null;workerReject?.(Error('cancelled'));workerReject=null;speech.abort();
  const wasBusy=busy;busy=false;activity='';
  if(wasBusy){undo=[];if(announce){say('stopped',{},'system');remember('assistant',t('stopped')+' '+JSON.stringify(perception()));}}
  refresh();
}
async function request(question,id,feedback){
  abort=new AbortController();const controller=abort;let timedOut=false;
  const timer=setTimeout(()=>{timedOut=true;controller.abort();},30000);
  try{return await askAgent(connection,{question,language,history,scene:perception(),feedback},controller.signal);}
  catch(error){if(id===epoch&&timedOut)throw Error('timeout');throw error;}
  finally{clearTimeout(timer);if(abort===controller)abort=null;}
}
function prepare(actions){
  if(actions.some(a=>a.type==='undo')){
    if(actions.length!==1)throw Error('undoOnly');if(!undo.length)throw Error('noUndo');
    return Promise.resolve({plan:{steps:undo.at(-1)},undoing:true});
  }
  return new Promise((resolve,reject)=>{
    const planner=new Worker(new URL('./planner-worker.mjs?v=dorm-20261021-1',import.meta.url),{type:'module'});worker=planner;
    const finish=()=>{clearTimeout(timer);planner.terminate();if(worker===planner){worker=null;workerReject=null;}};
    const timer=setTimeout(()=>{finish();reject(Error('blocked'));},15000);
    workerReject=error=>{finish();reject(error);};
    planner.onmessage=({data})=>{finish();if(data.error)reject(Object.assign(Error(data.error.code),{detail:data.error.detail,action:data.error.action}));else resolve(data);};
    planner.onerror=()=>{finish();reject(Error('invalid'));};
    planner.postMessage({state:structuredClone(state),actions});
  });
}
async function animate(steps,id){
  for(const step of steps){
    if(id!==epoch)throw Error('cancelled');
    if(step.type!=='move'){applyStep(state,step);render();continue;}
    const from=[...state.q],fromRpy=[...state.rpy];
    await new Promise((resolve,reject)=>{let elapsed=0,previous=null;
      function frame(now){
        if(id!==epoch)return reject(Error('cancelled'));
        if(previous!==null)elapsed+=Math.min(50,now-previous);previous=now;
        const u=Math.min(1,elapsed/(step.seconds*1000));
        applyStep(state,{type:'move',q:from.map((v,i)=>v+(step.q[i]-v)*u),rpy:fromRpy.map((v,i)=>v+(step.rpy[i]-v)*u)});render();
        if(u===1)resolve();else requestAnimationFrame(frame);
      }requestAnimationFrame(frame);
    });
  }
}
function reportError(error){
  const key=error.message==='empty'?'emptyError':error.message==='holding'?'holdingError':words[language][error.message]?error.message:error instanceof TypeError?'network':'provider';
  if(key==='blocked'&&error.detail?.blocker){const vars={object:name(error.detail.blocker),objectId:error.detail.blocker};say('blockedBy',vars,'assistant',true);return t('blockedBy',vars);}
  if(key==='rotation'){const vars={object:name(error.detail.held),axis:error.detail.axis.toUpperCase(),angle:error.detail.angle};say('rotation',vars,'assistant',true);return t('rotation',vars);}
  if(['reach','blocked'].includes(key)&&['place','transfer'].includes(error.action?.type)&&error.detail?.requestedOrientation?.slice(0,2).some(v=>Math.abs(v)>.1)){const vars={object:name(error.detail.held),angles:error.detail.requestedOrientation.map(v=>Math.round(v)).join('°, ')+'°'};say('tiltedPlacement',vars,'assistant',true);return t('tiltedPlacement',vars);}
  say(key,{},'assistant',true);return t(key);
}
async function connect(){
  const id=++epoch;busy=true;status('connecting');
  try{
    const candidate=validateConnection({base:$('base-url').value.trim(),model:$('model').value.trim(),key:$('api-key').value});$('api-key').value='';
    abort=new AbortController();const controller=abort;let timedOut=false;
    const timeout=setTimeout(()=>{timedOut=true;controller.abort();},30000);let response;
    try{response=await askAgent(candidate,{question:'connection_check',language,history:[],scene:perception()},controller.signal);}
    catch(error){if(timedOut)throw Error('timeout');throw error;}finally{clearTimeout(timeout);}
    if(id!==epoch)return;if(response.actions.length)throw Error('response');
    connection=candidate;try{localStorage.setItem('six-axis-settings',JSON.stringify({base:candidate.base,model:candidate.model}));}catch{}
    say('connected');
  }catch(error){if(id===epoch)reportError(error);}
  finally{if(id===epoch){busy=false;activity='';abort=null;refresh();(connection?$('prompt'):$('api-key')).focus();}}
}
async function send(question){
  if(busy||!question.trim())return;if(!connection){say('needConnection');return;}if(!view){say('sceneUnavailable',{},'assistant',true);return;}
  speech.abort();const id=++epoch;busy=true;add('user',question);$('prompt').value='';status('thinking');
  let feedback,response,prepared;
  try{
    for(let attempt=0;attempt<2;attempt++){
      response=await request(question,id,feedback);if(id!==epoch)return;
      if(!response.actions.length)break;
      status('planning');
      try{prepared=await prepare(response.actions);break;}
      catch(error){if(id!==epoch)return;if(attempt===1||error.message!=='empty')throw error;feedback={error:error.message,detail:error.detail,action:error.action,attempted:response.actions};status('replanning');}
    }
    if(id!==epoch)return;
    remember('user',question);
    if(!response.actions.length){add('assistant',response.reply);remember('assistant',response.reply);return;}
    add('assistant',response.reply);remember('assistant',response.reply);status('moving');
    await animate(prepared.plan.steps,id);if(id!==epoch)return;
    if(prepared.undoing)undo.pop();else{undo.push(prepared.inverse);undo=undo.slice(-8);}
    const last=response.actions.at(-1),key=state.held?(last.type==='pick'?'pickDone':'holdDone'):last.type==='restore'?'restoreDone':last.type==='undo'?'undoDone':['dance','wave','bow','circle','bob'].includes(last.type)?'danceDone':'done';
    const vars=state.held?{object:name(state.held),objectId:state.held}:{};
    const rotated=response.actions.some(a=>a.type==='rotate'||a.orientation);
    let completion=response.after||t(key,vars);
    if(rotated){
      const items=state.objects.filter(o=>o.id===state.held||o.rpy.some(v=>Math.abs(v)>.1));
      completion=items.length?items.map(o=>t(o.id===state.held?'orientationHeld':'orientationPlaced',{object:name(o.id),angles:o.rpy.map(v=>Math.round(v)).join('°, ')+'°'})).join('\n'):t(key,vars);
    }
    add('assistant',completion);
    remember('assistant',completion+'\nExecuted actions: '+JSON.stringify(response.actions)+'\nActual scene: '+JSON.stringify(perception()));
  }catch(error){if(id===epoch){remember('user',question);remember('assistant','Execution did not complete: '+reportError(error)+' '+JSON.stringify(perception()));}}
  finally{if(id===epoch){busy=false;activity='';refresh();$('prompt').focus();}}
}
$('composer').addEventListener('submit',event=>{event.preventDefault();if(!busy&&!speech.active){if(connection)void send($('prompt').value.trim());else void connect();}});
$('prompt').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();$('composer').requestSubmit();}});
$('stop').addEventListener('click',()=>cancel());
function arrange(seed,kit,message){cancel(false);state=initialState(seed,kit);undo=[];history=[];view?.resetView();say(message,{},'system');refresh();}
$('reset').addEventListener('click',()=>arrange(state.seed,state.kit,'resetDone'));
$('new-scene').addEventListener('click',()=>arrange(crypto.getRandomValues(new Uint32Array(1))[0]||1,state.kit,'newSceneDone'));
$('kit').addEventListener('change',()=>arrange(0,$('kit').value,'newSceneDone'));
$('language').addEventListener('click',()=>{speech.abort();if(busy)cancel();language=language==='en'?'zh':'en';try{localStorage.setItem('six-axis-language',language);}catch{}refresh();});
$('reconnect').addEventListener('click',()=>{cancel(false);connection=null;$('api-key').value='';say('change');refresh();$('api-key').focus();});
$('mic').addEventListener('click',()=>speech.start($('prompt').value));
$('challenge').addEventListener('click',()=>{speech.abort();$('prompt').value=state.kit!=='blocks'?challenges[language][challengeIndex++%challenges[language].length]:(language==='en'?'Stack blue on red and yellow on blue, then put everything back.':'把蓝色方块放在红色上，再把黄色放在蓝色上，最后全部放回原位。');$('prompt').focus();});
document.querySelectorAll('[data-command]').forEach(button=>button.addEventListener('click',()=>void send(t(button.dataset.command==='pick'?'suggestPick':'suggestAsk'))));
try{const saved=JSON.parse(localStorage.getItem('six-axis-settings'));if(saved){$('base-url').value=saved.base||DEFAULTS.base;$('model').value=saved.model||DEFAULTS.model;}}catch{}
try{view=createScene($('scene'));}catch(error){$('render-error').hidden=false;$('render-error').textContent=t('webgl');}
say('welcome');refresh();
Object.defineProperty(window,'robotLabSnapshot',{value:()=>structuredClone({scene:perception(),busy,connected:!!connection,language,listening:speech.active})});
