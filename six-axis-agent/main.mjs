import { initialState, snapshot, applyStep, CATALOG, objectPosture, restingFace, objectLocation, previewSteps, inHolder, footprint, graspWidth } from './world.mjs?v=recording-ui-20261111-1';
import { askAgent, validateConnection, DEFAULTS } from './agent.mjs?v=recording-ui-20261111-1';
import { createScene } from './scene.mjs?v=recording-ui-20261111-1';
import { createSpeech } from './speech.mjs?v=recording-ui-20261111-1';
import { words, challenges } from './i18n.mjs?v=recording-ui-20261111-1';
import { createTimedChallenge, formatChallengeTime } from './timed-challenge.mjs?v=recording-ui-20261111-1';
import { precisionCommand } from './precision-command.mjs?v=recording-ui-20261111-1';
import { setupKeyboardLayout } from './keyboard-layout.mjs?v=recording-ui-20261111-1';
import deployment from './deployment.mjs?v=recording-ui-20261111-1';
const serverMode=deployment?.mode==='school',hostedMode=deployment?.mode==='hosted',managedConnection=serverMode||hostedMode;

const $=id=>document.getElementById(id);
// API tokens are not website passwords. Keep Chrome's password-manager
// heuristics out of chat, with native masking as a fallback in older browsers.
if(!CSS.supports('-webkit-text-security','disc'))$('api-key').type='password';
let language='en';try{language=localStorage.getItem('six-axis-language')==='zh'?'zh':'en';}catch{}
let connectionFailed=false;
let state=initialState(0,'desk'),connection=null,busy=false,epoch=0,abort=null,history=[],activity='',view=null,undo=[],worker=null,workerReject=null,challengeIndex=0;
let previewData=null,previewResolve=null,settling=null;
const timed=createTimedChallenge();
let capture=null;
let comparing=false,keyboardWasTop=false;
const t=(key,vars={})=>Object.entries(vars).reduce((s,[k,v])=>s.replaceAll('{'+k+'}',v),words[language][key]||key);
const name=id=>CATALOG[id]?.[language==='zh'?'zh':'name']||state.obstacles.find(o=>o.id===id)?.[language==='zh'?'zh':'name']||({table:'桌面','robot arm':'机械臂','robot base':'机械臂底座','tall divider':'高挡板','low divider':'矮挡板'}[id]&&language==='zh'?{table:'桌面','robot arm':'机械臂','robot base':'机械臂底座','tall divider':'高挡板','low divider':'矮挡板'}[id]:id)||(language==='zh'?'物品':'item');
const perception=()=>({...snapshot(state),canUndo:undo.length>0});
const compactLayout=matchMedia('(max-width:900px)');
compactLayout.addEventListener('change',event=>{
  if(event.matches&&[$('prompt'),$('api-key')].includes(document.activeElement))document.activeElement.blur();
});
// Async replies must not reopen a phone keyboard or pull the page to the input.
function focusInput(element){if(!compactLayout.matches&&!navigator.maxTouchPoints&&!matchMedia('(pointer:coarse)').matches)element.focus({preventScroll:true});}
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
function renderTimedClocks(run=timed.summary()){
  const active=run.replaying||run.recording;
  const summary=run.replaying?formatChallengeTime(run.replayMs)+' / '+formatChallengeTime(run.totalMs):formatChallengeTime(run.attemptMs);
  for(const [id,value] of [['timed-attempt',formatChallengeTime(run.attemptMs)],['timed-playback',formatChallengeTime(run.replayMs)],
    ['timed-summary',active?summary:'']]){
    const el=$(id);if(el.textContent!==value)el.textContent=value;
  }
  $('timed-summary').hidden=!active;
  $('playback-progress').max=Math.max(1,run.totalMs);
  $('playback-progress').value=run.replayComplete?Math.max(1,run.totalMs):run.replayMs||0;
  const progress=t('playbackCommand',{current:run.command,count:run.moves});
  if($('playback-label').textContent!==progress)$('playback-label').textContent=progress;
}
let referenceKey='';
function renderReference(level){
  const key=language+':'+level;
  if(referenceKey===key)return;
  referenceKey=key;
  const levelName=t({easy:'timedEasy',medium:'timedMedium',hard:'timedHard'}[level]);
  const image='./reference-'+level+'.png?v='+document.body.dataset.version;
  $('reference-title').textContent=t('referenceTitle',{level:levelName});
  $('reference-preview').src=image;
  $('reference-image').src=image;
  const reference=words[language].references[level];
  for(const id of ['reference-image','reference-preview'])$(id).alt=reference.alt;
  for(const id of ['reference-clues','inline-clues'])$(id).replaceChildren(...reference.clues.map(clue=>{
      const item=document.createElement('li');item.textContent=clue;return item;
    }));
}
function renderTimed(){
  const run=timed.summary();
  const review=run.attemptMs!==null&&!run.recording&&!run.replaying;
  document.body.dataset.phase=run.replaying?'playing':run.recording?'recording':review?'review':'ready';
  const levels=document.querySelector('.timed-levels');levels.setAttribute('aria-label',t('timedDifficulty'));
  for(const button of levels.querySelectorAll('button')){
    button.setAttribute('aria-pressed',String(button.dataset.level===run.level));button.disabled=busy||run.recording||run.replaying;
  }
  $('timed-start').hidden=run.attemptMs!==null;$('timed-start').disabled=busy||!view;
  $('timed-start').textContent=t(activity==='connecting'?'connecting':'timedStart');
  $('connection-retry').hidden=!!connection||!managedConnection||!run.recording;
  $('connection-retry').disabled=busy;
  $('timed-finish').hidden=!run.recording;$('timed-finish').disabled=busy;
  $('timed-replay').hidden=!review||!run.moves;
  $('timed-replay').disabled=busy||!view;
  $('timed-replay').textContent=t(run.replayComplete?'timedAgain':'timedReplay');
  $('timed-edit').hidden=!review;$('timed-edit').disabled=busy||!run.canEdit;
  $('timed-new').hidden=!review;
  $('session-options').hidden=run.recording||run.replaying||busy;
  $('reset').hidden=run.attemptMs!==null;
  $('timed-pause').hidden=!run.replaying;
  $('timed-pause').textContent=t(run.paused?'timedResume':'timedPause');
  $('timed-stop').hidden=!run.replaying;
  $('playback-track').hidden=!run.replaying&&!run.replayStopped;
  $('timed-clocks').hidden=!review;
  $('playback-clock').hidden=run.replayMs===null;
  $('compare-toggle').hidden=!review||!view;
  $('compare-toggle').textContent=t(comparing?'backToScene':'compareDesks');
  $('comparison-image').alt=t('finalDesk');
  $('run-title').textContent=t(run.replaying?(run.paused?'timedPaused':'timedPlayingTitle'):run.recording?'timedRecordingLabel':run.replayComplete?'timedCompleteLabel':run.replayStopped?'timedStoppedTitle':review?'timedReviewTitle':'timedReadyTitle');
  renderReference(run.level);
  const statusKey=run.replaying?'timedPlaying':run.recording?'timedRecording':run.replayStopped?'timedStopped':run.replayComplete?'timedComplete':review?(run.moves?'timedSaved':'timedEmpty'):activity==='connecting'?'connecting':connectionFailed?'connectionRetry':'timedReady';
  const status=$('timed-status'),label=t(statusKey,{count:run.moves});
  if(status.textContent!==label)status.textContent=label;
  renderTimedClocks(run);
}
function refresh(){
  document.documentElement.lang=language;
  document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  $('language').textContent=language==='en'?'中文':'English';$('language').setAttribute('aria-label',language==='en'?'Switch to Chinese':'切换至英文');
  $('reset').title=t('reset');$('reset').setAttribute('aria-label',t('reset'));
  $('view-toggle').disabled=!view;$('view-toggle').textContent=t(view?.topView?'viewPerspective':'viewTop');$('view-toggle').setAttribute('aria-pressed',String(!!view?.topView));
  $('ruler-note').hidden=!view?.topView;
  $('api-key').placeholder=managedConnection?'':t('keyPlaceholder');$('prompt').placeholder=t(timed.level==='hard'?'promptPrecision':'promptPlacement');$('prompt').setAttribute('aria-label',t('messageLabel'));
  $('api-key').hidden=!!connection||managedConnection;$('prompt').hidden=!connection;$('connection-options').hidden=!!connection||managedConnection;
  $('input-label').textContent=t(connection?'messageLabel':'keyLabel');$('input-label').htmlFor=connection?'prompt':'api-key';
  $('input-label').classList.toggle('sr-only',!!connection);
  $('key-note').hidden=!!connection||activity==='connecting';$('reconnect').hidden=!connection;$('reconnect').disabled=busy;
  if(managedConnection){$('input-label').textContent=t(connection?'messageLabel':hostedMode?'hostedConnection':'schoolConnection');$('key-note').textContent=t(hostedMode?'hostedKeyNote':'schoolKeyNote');$('reconnect').textContent=t('schoolReconnect');}
  $('suggestions').hidden=!connection||busy;$('mic').hidden=!connection||busy;$('speech-note').hidden=!connection||!speech.active;
  $('mic').title=t(speech.active?'micStop':'mic');$('mic').setAttribute('aria-label',t(speech.active?'micStop':'mic'));$('mic').setAttribute('aria-pressed',String(speech.active));
  $('composer').hidden=timed.replaying||timed.summary().canEdit||(!connection&&managedConnection);
  $('send').textContent=t(connection?'send':'connect');$('send').disabled=busy||speech.active;
  $('stop').hidden=!busy||timed.replaying||previewData?.kind==='ready';$('stop').textContent=t('stopRobot');
  $('api-key').disabled=busy||!!connection;$('prompt').disabled=busy;$('base-url').disabled=busy;$('model').disabled=busy;
  const connectionLabel=connection?'online':activity==='connecting'?'connecting':connectionFailed?'cantConnect':'offline';
  $('connection-state').textContent=t(connectionLabel);
  if(managedConnection&&!connection){$('input-label').textContent=t(activity==='connecting'?'connecting':connectionFailed?'cantConnect':'hostedConnection');$('key-note').textContent=t(connectionFailed?'connectionRetry':hostedMode?'hostedKeyNote':'schoolKeyNote');}$('connection-state').classList.toggle('online',!!connection);
  $('activity').textContent=activity&&activity!=='connecting'&&!previewData?t(activity):'';
  $('preview-panel').hidden=!previewData;
  if(previewData){$('preview-panel').dataset.kind=previewData.kind;$('preview-heading').textContent=t(previewData.kind==='ready'?'previewReviewTitle':'previewBlockedTitle');$('preview-run').hidden=previewData.kind!=='ready';$('preview-dismiss').textContent=t(previewData.kind==='ready'?'previewCancel':'previewDismiss');$('preview-description').textContent=t(previewData.kind==='ready'?'previewReady':previewData.kind==='collision'?'previewCollision':previewData.kind==='reach'?'previewReach':'previewPlacement',{object:previewData.blocker?name(previewData.blocker):t('collisionSurface')});}
  document.querySelectorAll('.message[data-key]').forEach(el=>{const vars=JSON.parse(el.dataset.vars);if(vars.objectId)vars.object=name(vars.objectId);el.querySelector('.body').textContent=t(el.dataset.key,vars);});
  document.querySelectorAll('.message').forEach(el=>el.querySelector('.who').textContent=t(el.classList.contains('user')?'you':el.classList.contains('system')?'system':'robot')+(el.dataset.image?' · '+t('sceneImageUsed'):''));
  view?.language(language);render();renderTimed();
}
function status(key){activity=key;refresh();}
function clearPreview(){previewData=null;view?.clearPreview();}
function setPanel(panel){
  $('workbench').dataset.panel=panel;
  for(const button of $('view-tabs').querySelectorAll('button')){
    const selected=button.dataset.panel===panel;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;
  }
}
function compareDesk(enabled){
  comparing=enabled;
  $('workbench').classList.toggle('comparing',enabled);$('comparison-image').hidden=!enabled;
  if(enabled){view.update(state);$('comparison-image').src=view.comparison();}
  setPanel('desk');
}
function showStage(){if(compactLayout.matches)$('scene-stage').scrollIntoView({block:'start',behavior:'auto'});}
function showPreview(data){
  setPanel('desk');previewData=data;view?.preview(data);refresh();
  requestAnimationFrame(()=>{if(previewData===data){showStage();$('preview-heading').focus({preventScroll:true});}});
}
function review(steps){showPreview(previewSteps(state,steps));status('previewWaiting');return new Promise(resolve=>{previewResolve=resolve;});}
function commitStep(step){
  applyStep(state,step);
  if(capture){capture.steps.push(structuredClone(step));capture.partial=null;}
}
function finishCapture(){
  if(!capture)return;
  if(capture.partial)capture.steps.push(capture.partial);
  timed.append(capture.steps);capture=null;
}
function cancel(announce=true){
  if(settling){commitStep(settling);settling=null;render();}
  finishCapture();
  if(timed.replaying)timed.endReplay({stopped:true});
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
    const planner=new Worker(new URL('./planner-worker.mjs?v=recording-ui-20261111-1',import.meta.url),{type:'module'});worker=planner;
    const finish=()=>{clearTimeout(timer);planner.terminate();if(worker===planner){worker=null;workerReject=null;}};
    const timer=setTimeout(()=>{finish();reject(Error('planningTimeout'));},45000);
    workerReject=error=>{finish();reject(error);};
    planner.onmessage=({data})=>{finish();if(data.error)reject(Object.assign(Error(data.error.code),{detail:data.error.detail,action:data.error.action,preview:data.error.preview}));else resolve(data);};
    planner.onerror=()=>{finish();reject(Error('invalid'));};
    planner.postMessage({state:structuredClone(state),actions});
  });
}
function animateInterval(seconds,id,update){
  return new Promise((resolve,reject)=>{
    let previous=null,elapsed=0;
    const duration=seconds*1000;
    function frame(now){
      if(id!==epoch)return reject(Error('cancelled'));
      const delta=previous===null||timed.paused?0:Math.min(50,now-previous,duration-elapsed);
      previous=now;elapsed+=delta;
      if(timed.replaying)timed.advanceReplay(delta);
      update(elapsed/1000,duration===0?1:elapsed/duration);render();
      if(elapsed>=duration)resolve();else requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}
async function animate(steps,id){
  for(let index=0;index<steps.length;index++){
    const step=steps[index];
    if(id!==epoch)throw Error('cancelled');
    if(step.type==='fall'){
      const falling=(step.positions||[step]).map(item=>({...item,object:state.objects.find(o=>o.id===item.object)}));
      for(const item of falling)item.from=[...item.object.position];
      settling=step;
      await animateInterval(step.seconds,id,(elapsed,u)=>{
        for(const item of falling)item.object.position=item.from.map((value,i)=>value+(item.position[i]-value)*u*u);
        if(u===1){commitStep(step);settling=null;}
      });
      continue;
    }
    if(step.type==='preshape'){
      const from=graspWidth(state);
      await animateInterval(step.seconds??.08,id,(elapsed,u)=>{
        const sample={...step,width:from+(step.width-from)*u,seconds:elapsed};
        if(u===1)commitStep(step);
        else{applyStep(state,sample);if(capture&&elapsed>0)capture.partial=sample;}
      });
      continue;
    }
    if(step.type!=='move'){commitStep(step);render();continue;}
    const moves=[step];while(steps[index+1]?.type==='move')moves.push(steps[++index]);
    const duration=moves.reduce((seconds,move)=>seconds+move.seconds,0);
    let segment=0,segmentStart=0,from=[...state.q],fromRpy=[...state.rpy];
    await animateInterval(duration,id,(elapsed,u)=>{
      while(segment<moves.length&&(u===1||elapsed-segmentStart>=moves[segment].seconds)){
        const end=moves[segment];segmentStart+=end.seconds;commitStep(end);segment++;
        from=[...state.q];fromRpy=[...state.rpy];
      }
      if(segment===moves.length)return;
      const target=moves[segment],partial=elapsed-segmentStart,fraction=Math.min(1,partial/target.seconds);
      const sample={type:'move',q:from.map((value,i)=>value+(target.q[i]-value)*fraction),rpy:fromRpy.map((value,i)=>value+(target.rpy[i]-value)*fraction),seconds:partial};
      applyStep(state,sample);if(capture&&partial>0)capture.partial=sample;
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
  if(busy||timed.summary().canEdit||!question.trim())return;if(!connection){say('needConnection');return;}if(!view){say('sceneUnavailable',{},'assistant',true);return;}
  $('prompt').blur();
  speech.abort();clearPreview();const id=++epoch;busy=true;add('user',question);$('prompt').value='';status('thinking');
  const explicit=precisionCommand(question,state.q,language);
  let feedback,response,prepared,intention;
  try{
    for(let attempt=0;attempt<2;attempt++){
      response=explicit||await request(question,id,feedback);if(id!==epoch)return;
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
    if(timed.recording)capture={steps:[],partial:null};
    await animate(prepared.plan.steps,id);if(id!==epoch)return;
    finishCapture();
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
  finally{if(id===epoch){finishCapture();busy=false;activity='';refresh();focusInput($('prompt'));}}
}
async function startTimed(){
  if(busy||!view||timed.summary().attemptMs!==null)return;
  if(!connection){await connect();if(!connection)return;}
  speech.abort();clearPreview();
  compareDesk(false);state=initialState(0,'desk');undo=[];history=[];$('prompt').value='';view.resetView();
  timed.start(state);archiveExchange();say('resetDone',{},'system');refresh();$('run-title').focus({preventScroll:true});
}
async function replayTimed(){
  if(timed.replaying){cancel(false);return;}
  if(busy||!view)return;
  const run=timed.beginReplay();if(!run)return;
  speech.abort();clearPreview();compareDesk(false);state=run.scene;undo=[];history=[];view.resetView();
  const id=++epoch;busy=true;status('');showStage();$('timed-pause').focus({preventScroll:true});
  try{
    for(const [index,steps] of run.commands.entries()){
      timed.replayCommand(index+1);await animate(steps,id);
    }
    if(id===epoch){timed.endReplay();compareDesk(true);}
  }
  catch(error){if(id===epoch){timed.endReplay({stopped:true});reportError(error);}}
  finally{if(id===epoch){busy=false;activity='';refresh();}}
}
document.querySelectorAll('[data-level]').forEach(button=>button.addEventListener('click',()=>{
  if(!busy&&timed.select(button.dataset.level)){
    clearPreview();compareDesk(false);state=timed.savedScene()||initialState(0,'desk');undo=[];history=[];archiveExchange();view?.resetView();refresh();
  }
}));
$('view-toggle').addEventListener('click',()=>{if(view){view.setTopView(!view.topView);refresh();}});
$('compare-toggle').addEventListener('click',()=>{compareDesk(!comparing);refresh();});
$('reference-open').addEventListener('click',()=>$('reference-dialog').showModal());
for(const button of $('view-tabs').querySelectorAll('button')){
  button.addEventListener('pointerdown',event=>{if(document.body.classList.contains('is-typing'))event.preventDefault();});
  button.addEventListener('click',()=>setPanel(button.dataset.panel));
  button.addEventListener('keydown',event=>{
    const buttons=[...$('view-tabs').querySelectorAll('button')],index=buttons.indexOf(button);
    const next=event.key==='ArrowRight'?buttons[(index+1)%buttons.length]:event.key==='ArrowLeft'?buttons[(index+buttons.length-1)%buttons.length]:null;
    if(next){event.preventDefault();setPanel(next.dataset.panel);next.focus();}
  });
}
$('timed-start').addEventListener('click',startTimed);
$('connection-retry').addEventListener('click',()=>void connect());
$('timed-finish').addEventListener('click',()=>{
  if(!busy){$('prompt').blur();timed.finish(state);refresh();$('timed-replay').hidden?$('timed-edit').focus({preventScroll:true}):$('timed-replay').focus({preventScroll:true});}
});
$('timed-edit').addEventListener('click',()=>{
  if(busy)return;
  const saved=timed.edit();if(!saved)return;
  clearPreview();compareDesk(false);state=saved;undo=[];history=[];view.resetView();refresh();$('run-title').focus({preventScroll:true});
});
$('timed-pause').addEventListener('click',()=>{timed.pauseReplay();refresh();});
$('timed-stop').addEventListener('click',()=>cancel(false));
$('timed-replay').addEventListener('click',()=>void replayTimed());
setInterval(()=>{if(timed.recording||timed.replaying)renderTimedClocks();},100);
function submitMessage(){if(!busy&&!speech.active){if(connection)void send($('prompt').value.trim());else void connect();}}
$('send').addEventListener('click',submitMessage);
for(const id of ['prompt','api-key'])$(id).addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();submitMessage();}});
$('stop').addEventListener('click',()=>cancel());
$('preview-run').addEventListener('click',()=>{const resolve=previewResolve;previewResolve=null;clearPreview();refresh();$('stop').focus({preventScroll:true});resolve?.(true);});
$('preview-dismiss').addEventListener('click',()=>{const resolve=previewResolve;previewResolve=null;clearPreview();refresh();resolve?.(false);});
function arrange(seed,kit,message){cancel(false);compareDesk(false);state=initialState(seed,kit);undo=[];history=[];view?.resetView();say(message,{},'system');refresh();}
$('reset').addEventListener('click',()=>{if(!timed.recording&&!timed.replaying)arrange(state.seed,state.kit,'resetDone');});
$('timed-new').addEventListener('click',()=>{$('session-options').open=false;$('reset-dialog').returnValue='';$('reset-dialog').showModal();});
$('reset-dialog').addEventListener('close',()=>{
  if($('reset-dialog').returnValue==='reset'&&timed.clear()){arrange(0,'desk','resetDone');$('timed-start').focus({preventScroll:true});}
});
$('language').addEventListener('click',()=>{speech.abort();if(busy)cancel();language=language==='en'?'zh':'en';try{localStorage.setItem('six-axis-language',language);}catch{}refresh();});
$('reconnect').addEventListener('click',()=>{
  cancel(false);connection=null;$('api-key').value='';
  if(managedConnection){void connect();return;}
  say('change');refresh();focusInput($('api-key'));
});
$('mic').addEventListener('click',()=>speech.start($('prompt').value));
$('challenge').addEventListener('click',()=>{speech.abort();$('prompt').value=state.kit!=='blocks'?challenges[language][challengeIndex++%challenges[language].length]:(language==='en'?'Stack blue on red and yellow on blue, then put everything back.':'把蓝色方块放在红色上，再把黄色放在蓝色上，最后全部放回原位。');$('prompt').focus();});
document.querySelectorAll('[data-command]').forEach(button=>button.addEventListener('click',()=>void send(t(button.dataset.command==='pick'?'suggestPick':'suggestAsk'))));
try{const saved=JSON.parse(localStorage.getItem('six-axis-settings'));if(saved){$('base-url').value=saved.base||DEFAULTS.base;$('model').value=saved.model||DEFAULTS.model;}}catch{}
try{view=createScene($('scene'));}catch(error){$('render-error').hidden=false;$('render-error').textContent=t('webgl');}
setupKeyboardLayout({window,document,onChange:active=>{
  if(!view)return;
  if(active){keyboardWasTop=view.topView;view.setTopView(true);}
  else view.setTopView(keyboardWasTop);
  refresh();
}});
say('welcome');refresh();
Object.defineProperty(window,'robotLabSnapshot',{value:()=>structuredClone({scene:perception(),busy,connected:!!connection,language,listening:speech.active,timed:timed.summary()})});
