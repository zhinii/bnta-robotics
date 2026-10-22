import { initialState, snapshot, applyStep, CATALOG, objectPosture, restingFace, objectLocation, previewSteps, inHolder, footprint, graspWidth } from './world.mjs?v=freedom-20261022-2';
import { askAgent, validateConnection, DEFAULTS } from './agent.mjs?v=freedom-20261022-2';
import { createScene } from './scene.mjs?v=freedom-20261022-2';
import { createSpeech } from './speech.mjs?v=freedom-20261022-2';
import { words, challenges } from './i18n.mjs?v=freedom-20261022-2';
import deployment from './deployment.mjs?v=freedom-20261022-2';
const serverMode=deployment?.mode==='school',hostedMode=deployment?.mode==='hosted',managedConnection=serverMode||hostedMode;

const $=id=>document.getElementById(id);
// API tokens are not website passwords. Keep Chrome's password-manager
// heuristics out of chat, with native masking as a fallback in older browsers.
if(!CSS.supports('-webkit-text-security','disc'))$('api-key').type='password';
let language='en';try{language=localStorage.getItem('six-axis-language')==='zh'?'zh':'en';}catch{}
let connectionFailed=false;
let state=initialState(0,'desk'),connection=null,busy=false,epoch=0,abort=null,history=[],activity='',view=null,undo=[],worker=null,workerReject=null,challengeIndex=0;
let previewData=null,previewResolve=null,settling=null;
const t=(key,vars={})=>Object.entries(vars).reduce((s,[k,v])=>s.replaceAll('{'+k+'}',v),words[language][key]||key);
const name=id=>CATALOG[id]?.[language==='zh'?'zh':'name']||state.obstacles.find(o=>o.id===id)?.[language==='zh'?'zh':'name']||({table:'桌面','robot arm':'机械臂','robot base':'机械臂底座','tall divider':'高挡板','low divider':'矮挡板'}[id]&&language==='zh'?{table:'桌面','robot arm':'机械臂','robot base':'机械臂底座','tall divider':'高挡板','low divider':'矮挡板'}[id]:id)||(language==='zh'?'物品':'item');
const perception=()=>({...snapshot(state),canUndo:undo.length>0});
const compactLayout=matchMedia('(max-width:900px)');
compactLayout.addEventListener('change',event=>{
  if(event.matches&&[$('prompt'),$('api-key')].includes(document.activeElement))document.activeElement.blur();
});
// Async replies must not reopen a phone keyboard or pull the page to the input.
function focusInput(element){if(!compactLayout.matches&&!matchMedia('(pointer:coarse)').matches)element.focus({preventScroll:true});}
function archiveExchange(){
  const log=$('messages'),archive=$('message-history');
  archive.append(...log.children);
  while(archive.children.length>76)archive.firstElementChild.remove();
  $('earlier-messages').hidden=!archive.children.length;
}
function add(role,content,{key,vars,error=false,image=false}={}){
  if(role==='user'||['connected','resetDone','change','schoolKeyNote','hostedKeyNote'].includes(key))archiveExchange();
  const el=document.createElement('div');el.className='message '+role+(error?' error':'');
  const who=document.createElement('div');who.className='who';who.textContent=t(role==='user'?'you':role==='system'?'system':'robot')+(image?' · '+t('sceneImageUsed'):'');if(image)el.dataset.image='true';
  const body=document.createElement('div');body.className='body';body.textContent=content;el.append(who,body);
  if(key){el.dataset.key=key;el.dataset.vars=JSON.stringify(vars||{});}
  $('messages').append(el);
  return el;
}
function say(key,vars={},role='assistant',error=false){return add(role,t(key,vars),{key,vars,error});}
function remember(role,content){history.push({role,content});history=history.slice(-12);}
const speech=createSpeech({
  Recognition:window.SpeechRecognition||window.webkitSpeechRecognition,language:()=>language,
  onText:text=>{$('prompt').value=text;},
  onState:active=>{activity=active?'listening':'';refresh();},
  onMessage:key=>{if(key==='speechReady'){$('activity').textContent=t(key);focusInput($('prompt'));}else say(key,{},'system');}
});
function onShelf(object){return objectLocation(state,object).onShelf;}
let inventoryKey='';
function render(){
  view?.update(state);$('scene-state').textContent=state.held?t('holding',{object:name(state.held)}):t('empty');
  const items=state.objects.map(o=>({id:o.id,color:o.color,location:o.id===state.held?'inventoryHeld':inHolder(state,o)?'inventoryHolder':onShelf(o)?'inventoryShelf':objectLocation(state,o).location==='floor'?'inventoryFloor':''}));
  const key=JSON.stringify([language,items]);if(key!==inventoryKey){inventoryKey=key;$('inventory-items').replaceChildren(...items.map(o=>{const li=document.createElement('li'),dot=document.createElement('i'),text=document.createElement('span');dot.style.background=o.color;dot.setAttribute('aria-hidden','true');text.textContent=name(o.id)+(o.location?' · '+t(o.location):'');li.append(dot,text);return li;}));}
}
function refresh(){
  document.documentElement.lang=language;
  document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  $('language').textContent=language==='en'?'中文':'English';$('language').setAttribute('aria-label',language==='en'?'Switch to Chinese':'切换至英文');
  $('reset').title=t('reset');$('reset').setAttribute('aria-label',t('reset'));
  $('api-key').placeholder=managedConnection?'':t('keyPlaceholder');$('prompt').placeholder=t('promptPlaceholder');$('prompt').setAttribute('aria-label',t('messageLabel'));
  $('api-key').hidden=!!connection||managedConnection;$('prompt').hidden=!connection;$('connection-options').hidden=!!connection||managedConnection;
  $('input-label').textContent=t(connection?'messageLabel':'keyLabel');$('input-label').htmlFor=connection?'prompt':'api-key';
  $('input-label').classList.toggle('sr-only',!!connection);
  $('key-note').hidden=!!connection||activity==='connecting';$('reconnect').hidden=!connection;$('reconnect').disabled=busy;
  if(managedConnection){$('input-label').textContent=t(connection?'messageLabel':hostedMode?'hostedConnection':'schoolConnection');$('key-note').textContent=t(hostedMode?'hostedKeyNote':'schoolKeyNote');$('reconnect').textContent=t('schoolReconnect');}
  $('suggestions').hidden=!connection||busy;$('mic').hidden=!connection||busy;$('speech-note').hidden=!connection||!speech.active;
  $('mic').title=t(speech.active?'micStop':'mic');$('mic').setAttribute('aria-label',t(speech.active?'micStop':'mic'));$('mic').setAttribute('aria-pressed',String(speech.active));
  $('send').textContent=t(connection?'send':'connect');$('send').hidden=busy;$('send').disabled=speech.active;$('stop').hidden=!busy;
  $('api-key').disabled=busy||!!connection;$('prompt').disabled=busy;$('base-url').disabled=busy;$('model').disabled=busy;
  const connectionLabel=connection?'online':activity==='connecting'?'connecting':connectionFailed?'cantConnect':'offline';
  $('connection-state').textContent=t(connectionLabel);
  if(managedConnection&&!connection){$('input-label').textContent=t(activity==='connecting'?'connecting':connectionFailed?'cantConnect':'hostedConnection');$('key-note').textContent=t(connectionFailed?'connectionRetry':hostedMode?'hostedKeyNote':'schoolKeyNote');}$('connection-state').classList.toggle('online',!!connection);
  $('activity').textContent=activity&&activity!=='connecting'&&!previewData?t(activity):'';
  $('preview-panel').hidden=!previewData;
  if(previewData){$('preview-panel').dataset.kind=previewData.kind;$('preview-run').hidden=previewData.kind!=='ready';$('preview-dismiss').textContent=t(previewData.kind==='ready'?'previewCancel':'previewDismiss');$('preview-description').textContent=t(previewData.kind==='ready'?'previewReady':previewData.kind==='collision'?'previewCollision':previewData.kind==='reach'?'previewReach':'previewPlacement',{object:previewData.blocker?name(previewData.blocker):t('collisionSurface')});}
  document.querySelectorAll('.message[data-key]').forEach(el=>{const vars=JSON.parse(el.dataset.vars);if(vars.objectId)vars.object=name(vars.objectId);el.querySelector('.body').textContent=t(el.dataset.key,vars);});
  document.querySelectorAll('.message').forEach(el=>el.querySelector('.who').textContent=t(el.classList.contains('user')?'you':el.classList.contains('system')?'system':'robot')+(el.dataset.image?' · '+t('sceneImageUsed'):''));
  view?.language(language);render();
}
function status(key){activity=key;refresh();}
function clearPreview(){previewData=null;view?.clearPreview();}
function showPreview(data){previewData=data;view?.preview(data);refresh();}
function review(steps){showPreview(previewSteps(state,steps));status('previewWaiting');return new Promise(resolve=>{previewResolve=resolve;});}
function cancel(announce=true){
  if(settling){applyStep(state,settling);settling=null;render();}
  const reviewing=!!previewResolve;previewResolve?.(false);previewResolve=null;clearPreview();
  epoch++;abort?.abort();abort=null;worker?.terminate();worker=null;workerReject?.(Error('cancelled'));workerReject=null;speech.abort();
  const wasBusy=busy;busy=false;activity='';
  if(wasBusy){if(!reviewing)undo=[];if(announce){const key=reviewing?'previewCancelled':'stopped';say(key,{},'system');remember('assistant',t(key)+' '+JSON.stringify(perception()));}}
  refresh();
}
async function request(question,id,feedback){
  abort=new AbortController();const controller=abort;let timedOut=false;
  const timer=setTimeout(()=>{timedOut=true;controller.abort();},30000);
    try{return await askAgent(connection,{question,language,history,scene:perception(),feedback,captureScene:()=>{status('looking');return view?.capture();}},controller.signal);}
  catch(error){if(id===epoch&&timedOut)throw Error('timeout');throw error;}
  finally{clearTimeout(timer);if(abort===controller)abort=null;}
}
function prepare(actions){
  if(actions.some(a=>a.type==='undo')){
    if(actions.length!==1)throw Error('undoOnly');if(!undo.length)throw Error('noUndo');
    return Promise.resolve({plan:{steps:undo.at(-1)},undoing:true});
  }
  return new Promise((resolve,reject)=>{
    const planner=new Worker(new URL('./planner-worker.mjs?v=freedom-20261022-2',import.meta.url),{type:'module'});worker=planner;
    const finish=()=>{clearTimeout(timer);planner.terminate();if(worker===planner){worker=null;workerReject=null;}};
    const timer=setTimeout(()=>{finish();reject(Error('planningTimeout'));},45000);
    workerReject=error=>{finish();reject(error);};
    planner.onmessage=({data})=>{finish();if(data.error)reject(Object.assign(Error(data.error.code),{detail:data.error.detail,action:data.error.action,preview:data.error.preview}));else resolve(data);};
    planner.onerror=()=>{finish();reject(Error('invalid'));};
    planner.postMessage({state:structuredClone(state),actions});
  });
}
async function animate(steps,id){
  for(let index=0;index<steps.length;index++){
    const step=steps[index];
    if(id!==epoch)throw Error('cancelled');
    if(step.type==='fall'){
      const falling=(step.positions||[step]).map(item=>({...item,object:state.objects.find(o=>o.id===item.object)}));
      for(const item of falling)item.from=[...item.object.position];settling=step;
      await new Promise((resolve,reject)=>{let start;
        function frame(now){if(id!==epoch)return reject(Error('cancelled'));start??=now;const u=Math.min(1,(now-start)/(step.seconds*1000));for(const item of falling)item.object.position=item.from.map((v,i)=>v+(item.position[i]-v)*u*u);render();if(u===1){applyStep(state,step);settling=null;resolve();}else requestAnimationFrame(frame);}requestAnimationFrame(frame);
      });continue;
    }
    if(step.type==='preshape'){
      const from=graspWidth(state);
      await new Promise((resolve,reject)=>{let previous=null,elapsed=0;function frame(now){
        if(id!==epoch)return reject(Error('cancelled'));
        if(previous!==null)elapsed+=Math.min(50,now-previous);previous=now;
        const u=Math.min(1,elapsed/((step.seconds||.08)*1000));applyStep(state,{...step,width:from+(step.width-from)*u});render();
        if(u===1)resolve();else requestAnimationFrame(frame);
      }requestAnimationFrame(frame);});continue;
    }
    if(step.type!=='move'){applyStep(state,step);render();continue;}
    const moves=[step];while(steps[index+1]?.type==='move')moves.push(steps[++index]);
    await new Promise((resolve,reject)=>{let segment=0,elapsed=0,previous=null,from=[...state.q],fromRpy=[...state.rpy];
      function frame(now){
        if(id!==epoch)return reject(Error('cancelled'));
        if(previous!==null)elapsed+=Math.min(50,now-previous);previous=now;
        while(segment<moves.length&&elapsed>=moves[segment].seconds*1000){
          const end=moves[segment];elapsed-=end.seconds*1000;applyStep(state,end);segment++;from=[...state.q];fromRpy=[...state.rpy];
        }
        if(segment===moves.length){render();resolve();return;}
        const target=moves[segment],u=Math.min(1,elapsed/(target.seconds*1000));
        applyStep(state,{type:'move',q:from.map((v,i)=>v+(target.q[i]-v)*u),rpy:fromRpy.map((v,i)=>v+(target.rpy[i]-v)*u)});render();requestAnimationFrame(frame);
      }requestAnimationFrame(frame);
    });
  }
}
function reportError(error){
  const managedError=managedConnection&&({auth:'managedAuth',model:'managedModel',network:'managedNetwork'})[error instanceof TypeError?'network':error.message];
  if(managedError){say(managedError,{},'assistant',true);return t(managedError);}
  if(error.preview&&error.message!=='planningTimeout')showPreview(error.preview);
  if(error.detail?.constraint==='deskEdge'){say('deskEdge',{},'assistant',true);return t('deskEdge');}
  const key=error.message==='empty'?'emptyError':error.message==='holding'?'holdingError':words[language][error.message]?error.message:error instanceof TypeError?'network':'provider';
  const errorObject=error.action?.object||error.detail?.object||error.detail?.held||state.held;
  if(key==='occupied'&&error.detail?.blocker){const vars={object:name(error.detail.blocker),objectId:error.detail.blocker};say('occupiedBy',vars,'assistant',true);return t('occupiedBy',vars);}
  if(key==='reach'&&error.detail?.approach&&error.detail.approach!=='auto'){const vars={side:t('approach'+error.detail.approach)};say('pickupSideReach',vars,'assistant',true);return t('pickupSideReach',vars);}
  if(['reach','blocked'].includes(key)&&error.detail?.stage==='pickup'){const vars={object:name(errorObject)};say('pickupFailed',vars,'assistant',true);return t('pickupFailed',vars);}
  if(key==='posture'&&error.detail?.blocker){const vars={object:name(error.detail.object),blocker:name(error.detail.blocker)};say('postureBlocked',vars,'assistant',true);return t('postureBlocked',vars);}
  if(key==='posture'&&error.detail?.reason==='reach'){const vars={object:name(error.detail.object)};say('postureReach',vars,'assistant',true);return t('postureReach',vars);}
  if(key==='blocked'&&error.detail?.blocker){const vars={object:name(error.detail.blocker),objectId:error.detail.blocker};say('blockedBy',vars,'assistant',true);return t('blockedBy',vars);}
  if(key==='rotation'){const vars={object:name(error.detail.held),axis:error.detail.axis.toUpperCase(),angle:error.detail.angle};say('rotation',vars,'assistant',true);return t('rotation',vars);}
  if(['reach','blocked'].includes(key)&&['place','transfer'].includes(error.action?.type)&&error.action?.orientation?.slice(0,2).some(v=>Math.abs(v)>.1)){const vars={object:name(errorObject),angles:error.action.orientation.map(v=>Math.round(v)).join('°, ')+'°'};say('tiltedPlacement',vars,'assistant',true);return t('tiltedPlacement',vars);}
  say(key,{},'assistant',true);return t(key);
}
async function connect(){
  const id=++epoch;connectionFailed=false;busy=true;status('connecting');
  try{
    const candidate=serverMode?{server:true}:hostedMode?{hosted:true}:validateConnection({base:$('base-url').value.trim(),model:$('model').value.trim(),key:$('api-key').value});$('api-key').value='';
    abort=new AbortController();const controller=abort;let timedOut=false;
    const timeout=setTimeout(()=>{timedOut=true;controller.abort();},30000);let response;
    try{response=await askAgent(candidate,{question:'connection_check',language,history:[],scene:perception()},controller.signal);}
    catch(error){if(timedOut)throw Error('timeout');throw error;}finally{clearTimeout(timeout);}
    if(id!==epoch)return;if(response.actions.length)throw Error('response');
    connection=candidate;if(!managedConnection)try{localStorage.setItem('six-axis-settings',JSON.stringify({base:candidate.base,model:candidate.model}));}catch{}
    say('connected');
  }catch(error){if(id===epoch){connectionFailed=true;reportError(error);}}
  finally{if(id===epoch){busy=false;activity='';abort=null;refresh();focusInput(connection?$('prompt'):managedConnection?$('send'):$('api-key'));}}
}
async function send(question){
  if(busy||!question.trim())return;if(!connection){say('needConnection');return;}if(!view){say('sceneUnavailable',{},'assistant',true);return;}
  speech.abort();clearPreview();const id=++epoch;busy=true;add('user',question);$('prompt').value='';status('thinking');
  let feedback,response,prepared,intention;
  try{
    for(let attempt=0;attempt<2;attempt++){
      response=await request(question,id,feedback);if(id!==epoch)return;
      if(response.imageStatus==='unavailable')say('visionUnavailable');
      if(!response.actions.length)break;
      status('planning');
      try{prepared=await prepare(response.actions);break;}
      catch(error){if(id!==epoch)return;if(attempt===1||error.message!=='empty')throw error;feedback={error:error.message,detail:error.detail,action:error.action,attempted:response.actions};status('replanning');}
    }
    if(id!==epoch)return;
    remember('user',question);
    const usedImage=response.imageStatus==='seen';
    if(!response.actions.length){add('assistant',response.reply,{image:usedImage});remember('assistant',response.reply);return;}
    intention=add('assistant',response.reply,{image:usedImage});remember('assistant',response.reply);
    if(!await review(prepared.plan.steps)){if(id===epoch){say('previewCancelled');remember('assistant',t('previewCancelled'));}return;}if(id!==epoch)return;status('moving');
    const touched=new Set([state.held,...prepared.plan.steps.filter(step=>step.type==='grip').map(step=>step.object)]);
    await animate(prepared.plan.steps,id);if(id!==epoch)return;
    if(prepared.undoing)undo.pop();else if(prepared.inverse){undo.push(prepared.inverse);undo=undo.slice(-8);}else undo=[];
    const last=response.actions.at(-1),key=state.held?(last.type==='pick'?'pickDone':'holdDone'):last.type==='restore'?'restoreDone':last.type==='undo'?'undoDone':['dance','wave','bow','circle','bob'].includes(last.type)?'danceDone':'done';
    const vars=state.held?{object:name(state.held),objectId:state.held}:{};
    const rotated=response.actions.some(a=>a.type==='rotate'||a.orientation||a.posture);
    let completion=response.after||t(key,vars);
    if(rotated){
      const items=state.objects.filter(o=>o.id===state.held||touched.has(o.id));
      const technical=response.actions.some(a=>a.type==='rotate'||a.orientation)||/\b(?:axis|degrees?)\b|轴|度/u.test(question);
      completion=last.type==='restore'?t('restoreDone'):items.length?items.map(o=>t(o.id===state.held?(technical?'postureHeld':'postureHeldSimple'):(technical?'posturePlaced':'posturePlacedSimple'),{object:name(o.id),posture:t('posture_'+restingFace(o)),angles:o.rpy.map(v=>Math.round(v)).join('°, ')+'°'})).join('\n'):t(key,vars);
    }
    if(!rotated&&response.actions.some(a=>a.target==='shelf'))completion=state.objects.filter(o=>touched.has(o.id)&&onShelf(o)&&!inHolder(state,o)).map(o=>t('placedOnShelf',{object:name(o.id)})).join('\n')||completion;
    if(last.type!=='restore'&&last.type!=='undo'&&state.objects.some(o=>touched.has(o.id)&&onShelf(o))&&!/[?？]/u.test(completion))completion+='\n'+t('shelfFollowup');
    intention?.remove();add('assistant',completion,{image:usedImage});
    remember('assistant',completion+'\nExecuted actions: '+JSON.stringify(response.actions)+'\nActual scene: '+JSON.stringify(perception()));
  }catch(error){if(id===epoch){remember('user',question);remember('assistant','Execution did not complete: '+reportError(error)+'\nUnexecuted request: '+JSON.stringify(response?.actions||[])+'\nActual scene: '+JSON.stringify(perception()));}}
  finally{if(id===epoch){busy=false;activity='';refresh();focusInput($('prompt'));}}
}
function submitMessage(){if(!busy&&!speech.active){if(connection)void send($('prompt').value.trim());else void connect();}}
$('send').addEventListener('click',submitMessage);
for(const id of ['prompt','api-key'])$(id).addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();submitMessage();}});
$('stop').addEventListener('click',()=>cancel());
$('preview-run').addEventListener('click',()=>{const resolve=previewResolve;previewResolve=null;clearPreview();refresh();resolve?.(true);});
$('preview-dismiss').addEventListener('click',()=>{const resolve=previewResolve;previewResolve=null;clearPreview();refresh();resolve?.(false);});
function arrange(seed,kit,message){cancel(false);state=initialState(seed,kit);undo=[];history=[];view?.resetView();say(message,{},'system');refresh();}
$('reset').addEventListener('click',()=>arrange(state.seed,state.kit,'resetDone'));
$('language').addEventListener('click',()=>{speech.abort();if(busy)cancel();language=language==='en'?'zh':'en';try{localStorage.setItem('six-axis-language',language);}catch{}refresh();});
$('reconnect').addEventListener('click',()=>{cancel(false);connection=null;$('api-key').value='';say(managedConnection?(hostedMode?'hostedKeyNote':'schoolKeyNote'):'change');refresh();focusInput(managedConnection?$('send'):$('api-key'));});
$('mic').addEventListener('click',()=>speech.start($('prompt').value));
$('challenge').addEventListener('click',()=>{speech.abort();$('prompt').value=state.kit!=='blocks'?challenges[language][challengeIndex++%challenges[language].length]:(language==='en'?'Stack blue on red and yellow on blue, then put everything back.':'把蓝色方块放在红色上，再把黄色放在蓝色上，最后全部放回原位。');$('prompt').focus();});
document.querySelectorAll('[data-command]').forEach(button=>button.addEventListener('click',()=>void send(t(button.dataset.command==='pick'?'suggestPick':'suggestAsk'))));
try{const saved=JSON.parse(localStorage.getItem('six-axis-settings'));if(saved){$('base-url').value=saved.base||DEFAULTS.base;$('model').value=saved.model||DEFAULTS.model;}}catch{}
try{view=createScene($('scene'));}catch(error){$('render-error').hidden=false;$('render-error').textContent=t('webgl');}
say('welcome');refresh();
Object.defineProperty(window,'robotLabSnapshot',{value:()=>structuredClone({scene:perception(),busy,connected:!!connection,language,listening:speech.active})});
