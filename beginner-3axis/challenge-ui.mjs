import { ChallengeController, initialWorld, armById, pose, limits, validJoints, solvePosition, planMove, clone, gripPoint, upgradeHandoffSteps } from './challenge-model.mjs?v=square-opening-1';
import { createChallengeScene } from './challenge-scene.mjs?v=square-opening-1';
import { text, words } from './challenge-i18n.mjs?v=square-opening-1';
import { CONFIG } from './model.mjs';
import { ARM, toolReachFor } from './challenge-kinematics.mjs';
import { createNumberPad } from './challenge-number-pad.mjs?v=square-opening-1';
const $=id=>document.getElementById(id),KEY='bnta:robot-challenges:v1',challenges=['easy','medium','hard'],modes=['explore',...challenges];
// Every visit is fresh. Remove only this app's legacy save, even if it is malformed.
try{localStorage.removeItem(KEY);}catch{}
let language='en',selected='A',tab='controls',controlMode='xyz',draft=null,previewError=null,view=null,controller=null,pending=null,lastProgramKey='',lastComplete=false;
let message={key:'ready',vars:{},error:false},programs={explore3:[],explore6:[],easy:[],medium:[],hard:[]},recording=false,exploreAxes=6;
let coordinateTarget=null,xyzReference=null,xyzSeed=null,introVisible=true,taskOpen=false,expandedStep=null;
let previewPlan=null,previewKey='';
let numberPad=null,padSnapshot=null;
const touchNumbers=window.matchMedia?window.matchMedia('(pointer: coarse)').matches:(navigator.maxTouchPoints||0)>0;
// Every challenge is selectable; completion still requires a verified replay.
const t=(key,vars)=>text(language,key,vars),arm=()=>armById(controller.world,selected);
const programSlot=(mode,axes)=>mode==='explore'?'explore'+axes:mode;
function validSteps(mode,steps,axes=6){
  if(!Array.isArray(steps)||steps.length>100)return false;const world=initialWorld(mode,axes);
  return steps.every(s=>s&&['move','open','close'].includes(s.type)&&armById(world,s.arm)&&
    (s.type!=='move'||(validJoints(armById(world,s.arm),s.q)&&['xyz','joints'].includes(s.kind))));
}
controller=new ChallengeController('explore',changed);
controller.program=clone(programs[programSlot(controller.world.mode,controller.world.arms[0].axes)]);
function rememberProgram(){programs[programSlot(controller.world.mode,controller.world.arms[0].axes)]=clone(controller.program);}
function say(key,vars={},error=false){message={key,vars,error};render();}
function report(result){if(result?.error){say(result.index===undefined?result.error:'programError',result.index===undefined?{}:{step:result.index+1,reason:result.error},true);return false;}return true;}
function changed(){
  if(!controller)return;
  if(pending&&!controller.operation&&!controller.running){const step=pending;pending=null;if(recording){const added=controller.add(step);if(added.error){recording=false;return say('recordFull',{},true);}}say(step.type==='close'&&controller.world.part.owner!==step.arm&&controller.world.part.receiver!==step.arm?'emptyGrip':controller.world.part.receiver?'sharedGrip':step.type==='open'&&step.arm==='A'&&controller.world.part.owner==='B'?'handed':{move:'moved',close:'closed',open:'opened'}[step.type]);rememberProgram();preview();}
  if(controller.complete&&!lastComplete){message={key:'complete',vars:{},error:false};rememberProgram();}
  else if(controller.world.complete&&!controller.busy&&!controller.complete&&!controller.lastError)message={key:controller.program.length?'replayRequired':'recordRequired',vars:{},error:false};
  if(controller.world.failure&&!controller.busy){recording=false;message={key:controller.world.failure,vars:{},error:true};}
  if(controller.lastError&&!controller.running){message=controller.lastErrorIndex===null?{key:controller.lastError,vars:{},error:true}:{key:'programError',vars:{step:controller.lastErrorIndex+1,reason:controller.lastError},error:true};}
  lastComplete=controller.complete;render();
}
function syncDraft(){draft=[...arm().q];coordinateTarget=null;xyzReference=[...draft];xyzSeed=[...draft];controlMode=arm().axes===3?'xyz':'joints';buildInputs();preview();}
function selectMode(mode,axes=exploreAxes){if(controller.busy){say('busy',{},true);return false;}rememberProgram();pending=null;recording=false;selected='A';introVisible=true;taskOpen=false;expandedStep=null;if(mode==='explore')exploreAxes=axes;controller.selectMode(mode,axes);controller.program=clone(programs[programSlot(mode,axes)]);tab='controls';lastProgramKey='';syncDraft();say('ready');$('panel-scroll').scrollTop=0;rememberProgram();return true;}
function selectTab(next){tab=next;render();$('panel-scroll').scrollTop=0;}
function selectControlMode(next){controlMode=next;if(!draft||!validJoints(arm(),draft))draft=[...arm().q];coordinateTarget=next==='xyz'?pose(arm(),draft).tip:null;xyzReference=[...draft];xyzSeed=[...draft];buildInputs();preview();}
function selectExploreRobot(axes){if(![3,6].includes(axes))return say('command',{},true);if(controller.world.mode==='explore'&&arm().axes===axes)return;if(selectMode('explore',axes))say('robotChanged',{axes});}
function selectArm(id){if(!armById(controller.world,id))return say('command',{},true);selected=id;syncDraft();render();$('panel-scroll').scrollTop=0;}
function buildInputs(){
  numberPad?.dismiss();padSnapshot=null;
  const a=arm(),q=draft&&validJoints(a,draft)?draft:a.q,p=controlMode==='xyz'&&coordinateTarget?coordinateTarget:pose(a,q).tip;
  const reach=a.axes===3?CONFIG.A+CONFIG.D:toolReachFor(a.axes),height=a.axes===3?CONFIG.H:ARM.base;
  $('xyz-inputs').replaceChildren(...['X','Y','Z'].map((axis,i)=>{
    const field=document.createElement('div'),label=document.createElement('label'),input=document.createElement('input'),slider=document.createElement('input');
    field.className='axis-field';label.textContent=axis;input.type='number';input.step='any';input.inputMode='decimal';input.id='axis-'+axis.toLowerCase();label.htmlFor=input.id;input.value=p[i].toFixed(2);
    slider.type='range';slider.id='axis-slider-'+axis.toLowerCase();slider.dataset.axis=axis;slider.step='.01';slider.min=String(i===2?0:a.base[i]-reach);slider.max=String(i===2?a.base[2]+height+reach:a.base[i]+reach);slider.dataset.min=slider.min;slider.dataset.max=slider.max;slider.value=input.value;
    syncXYZSlider(input,slider);
    input.oninput=()=>{syncXYZSlider(input,slider);readXYZ();};slider.oninput=()=>{input.value=slider.value;readXYZ();};
    field.append(label,input,slider);return field;
  }));
  $('joint-inputs').replaceChildren(...a.q.map((_,i)=>{const row=document.createElement('div');row.className='joint';const label=document.createElement('label');label.htmlFor='joint-'+i;const b=document.createElement('b');b.textContent='J'+(i+1);const name=document.createElement('span');name.dataset.jointName=i;name.textContent=words[language].jointNames[i];label.append(b,name);
    const slider=document.createElement('input'),number=document.createElement('input');slider.type='range';number.type='number';number.id='joint-'+i;slider.id='slider-'+i;
    for(const input of [slider,number]){input.min=limits(a)[i][0];input.max=limits(a)[i][1];input.step='.1';input.value=q[i].toFixed(1);input.setAttribute('aria-label','J'+(i+1)+' '+words[language].jointNames[i]);input.oninput=()=>{const value=input.value;const other=input===slider?number:slider;other.value=value;readJoints();};}
    row.append(label,slider,number);return row;}));
  document.querySelectorAll('#xyz-inputs input[type="number"],#joint-inputs input[type="number"]').forEach(input=>{
    input.readOnly=!!touchNumbers;input.inputMode=touchNumbers?'none':'decimal';
    const touchEntry=()=>{input.readOnly=true;input.inputMode='none';input.setAttribute('aria-controls','number-editor');input.setAttribute('aria-describedby','number-pad-help');};
    if(touchNumbers)touchEntry();
    // A mouse-equipped tablet/laptop can have a fine primary pointer and still
    // receive real touch taps. Suppress native focus before opening the editor.
    input.onpointerdown=e=>{if(e.pointerType==='touch'&&!input.readOnly){e.preventDefault();touchEntry();openNumberPad(input);}};
    input.onclick=()=>{if(input.readOnly)openNumberPad(input);};input.onkeydown=e=>{if(input.readOnly&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openNumberPad(input);}};
  });
}
function numberFields(){return [...document.querySelectorAll((controlMode==='xyz'?'#xyz-inputs':'#joint-inputs')+' input[type="number"]')].map((input,i)=>({input,short:controlMode==='xyz'?['X','Y','Z'][i]:'J'+(i+1),label:()=>controlMode==='xyz'?['X','Y','Z'][i]:'J'+(i+1)+' '+words[language].jointNames[i],unit:controlMode==='xyz'?'mm':'°',step:controlMode==='xyz'?1:.1}));}
function openNumberPad(input){
 if(controller.busy||controller.world.failure||numberPad.active)return;
 const fields=numberFields(),index=Math.max(0,fields.findIndex(f=>f.input===input));
 padSnapshot={draft:clone(draft),coordinateTarget:clone(coordinateTarget),xyzReference:clone(xyzReference),xyzSeed:clone(xyzSeed),previewError,values:fields.map(f=>f.input.value)};
 numberPad.open(fields,index);render();
}
function applyPadValues(values){
 numberFields().forEach((f,i)=>{f.input.value=values[i];const slider=controlMode==='xyz'?$('axis-slider-'+['x','y','z'][i]):$('slider-'+i);if(controlMode==='xyz')syncXYZSlider(f.input,slider);else slider.value=values[i];});
 if(controlMode==='xyz')readXYZ();else readJoints();
}
function finishNumberPad(cancelled){
 if(cancelled&&padSnapshot){const saved=padSnapshot;numberFields().forEach((f,i)=>{f.input.value=saved.values[i];const slider=controlMode==='xyz'?$('axis-slider-'+['x','y','z'][i]):$('slider-'+i);if(controlMode==='xyz')syncXYZSlider(f.input,slider);else slider.value=saved.values[i];});({draft,coordinateTarget,xyzReference,xyzSeed,previewError}=saved);previewKey='';}
 padSnapshot=null;render();
}
function syncXYZSlider(input,slider){const value=Number(input.value);if(!input.value.trim()||!Number.isFinite(value))return;slider.min=String(Math.min(Number(slider.dataset.min),value));slider.max=String(Math.max(Number(slider.dataset.max),value));slider.value=input.value;}
function readXYZ(){const values=['x','y','z'].map(axis=>$('axis-'+axis).value);if(values.some(v=>!v.trim()||!Number.isFinite(Number(v)))){coordinateTarget=null;draft=null;previewError='numbers';render();return;}introVisible=false;taskOpen=false;coordinateTarget=values.map(Number);const r=solvePosition(arm(),coordinateTarget,xyzReference||arm().q,xyzSeed||arm().q);draft=r.q||null;if(r.q)xyzSeed=[...r.q];previewError=r.error||null;preview();}
function readJoints(){coordinateTarget=null;xyzReference=null;xyzSeed=null;const values=arm().q.map((_,i)=>$('joint-'+i).value);draft=values.every(v=>v.trim()&&Number.isFinite(Number(v)))?values.map(Number):null;if(draft)introVisible=false;taskOpen=false;preview();}
function refreshPreview(){
  // Reuse execution's entire path check. Cache it across language/tab/status
  // renders, and never calculate a new manual preview during real movement.
  if(controller.busy)return;
  const key=JSON.stringify([controller.world,selected,draft,controlMode]);if(key===previewKey)return;previewKey=key;
  previewPlan=null;
  if(draft){if(validJoints(arm(),draft)){previewPlan=planMove(controller.world,selected,draft,controlMode,{preview:true});previewError=previewPlan.error||null;}else previewError='limits';}
  else previewError=previewError||'numbers';
}
function preview(){previewKey='';render();}
function execute(type){if(controller.busy)return say('busy',{},true);const step={arm:selected,type};if(type==='move'){if(!draft||!validJoints(arm(),draft))return say(previewError||'numbers',{},true);Object.assign(step,{q:[...draft],kind:controlMode});}pending=null;const r=controller.execute(step);if(!r.error){pending=clone(step);if(type==='move')introVisible=false;taskOpen=false;render();}report(r);}
function addStep(type){if(controller.busy)return say('busy',{},true);const step={type,arm:selected};if(type==='move'){if(!draft||!validJoints(arm(),draft))return say('limits',{},true);Object.assign(step,{q:[...draft],kind:controlMode});}if(type==='handoff')return say('handoffSteps',{},true);if(report(controller.add(step))){rememberProgram();say('programAdded');}}
function setRecording(on){
  if(controller.busy)return say('busy',{},true);
  if(on===recording)return;
  if(on){pending=null;controller.program=[];introVisible=true;taskOpen=false;controller.reset();syncDraft();}
  recording=on;tab=on?'controls':'program';expandedStep=null;rememberProgram();say(on?'recordOn':'recordOff');
}
function startProgram(){tab='program';if(controller.busy)return say('busy',{},true);pending=null;recording=false;if(report(controller.run())){introVisible=false;taskOpen=false;say('running',{step:1,total:controller.program.length,arm:controller.program[0].arm});}}
function stop(){numberPad?.dismiss();padSnapshot=null;pending=null;recording=false;controller.stop();say('stopped');}
function reset(){pending=null;recording=false;introVisible=true;taskOpen=false;controller.reset();syncDraft();say('resetDone');}
function formatPosition(p){return p.map((v,i)=>['X','Y','Z'][i]+' '+v.toFixed(1)).join(' · ')+' mm';}
function showCoordinates(id,key,p,armId){
  const label=t(key)+(controller.world.mode==='hard'?' · '+t(armId==='A'?'armA':'armB'):''),value=p?formatPosition(p):'X — · Y — · Z — mm',el=$(id),snapshot=label+'|'+value;
  if(el.dataset.value===snapshot)return;el.dataset.value=snapshot;
  const name=document.createElement('strong'),coordinates=document.createElement('span');name.textContent=label;coordinates.textContent=value;el.replaceChildren(name,document.createTextNode(' '),coordinates);
}
function render(){
  if(!controller)return;const world=controller.world,a=arm(),exploring=world.mode==='explore';document.documentElement.lang=language;$('language').value=language;
  refreshPreview();
  document.querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));
  document.querySelectorAll('[data-mode]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.mode===world.mode));b.disabled=controller.busy;b.title=t(b.dataset.mode+'Name');});
  document.querySelectorAll('[data-arm]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.arm===selected)));
  document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===tab)));
  $('explore-robot').hidden=!exploring;$('explore-robot').dataset.axes=String(exploreAxes);document.querySelectorAll('[data-robot-axes]').forEach(b=>{b.disabled=controller.busy;b.setAttribute('aria-pressed',String(Number(b.dataset.robotAxes)===exploreAxes));});$('explore-robot').setAttribute('aria-label',t('exploreRobot'));$('explore-robot').title=t('robotSwitchHelp');
  $('task-name').textContent=t(world.mode);$('task-summary').textContent=t(world.mode+'Summary');$('task-description').textContent=t(world.mode+'Task');$('locations-title').textContent=t(exploring?'objectLocations':'taskLocations');
  // Task information can be reopened without resetting the robot.
  $('task-card').hidden=!taskOpen;$('task-toggle').setAttribute('aria-expanded',String(taskOpen));$('checks').hidden=exploring;
  $('failure').hidden=!world.failure;$('failure-reason').textContent=world.failure?t(world.failure):'';
  $('arm-picker').hidden=world.mode!=='hard';
  $('controls-panel').hidden=tab!=='controls';$('program-panel').hidden=tab!=='program';$('xyz-inputs').hidden=controlMode!=='xyz';$('joint-inputs').hidden=controlMode!=='joints';
  $('controls-actions').hidden=tab!=='controls';$('coordinate-readout').hidden=tab!=='controls';$('playback-panel').hidden=tab!=='program';$('record-bar').hidden=tab!=='controls'&&!recording;$('show-program').hidden=tab==='program';
  $('control-title').textContent=t(controlMode);$('control-mode').hidden=a.axes===3;$('control-mode').setAttribute('aria-label',t('movementType'));document.querySelectorAll('[data-control]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.control===controlMode));b.disabled=controller.busy;});
  const targetPosition=controlMode==='xyz'?coordinateTarget:draft&&validJoints(a,draft)?pose(a,draft).tip:null;
  const replayStep=controller.running?controller.program[controller.index]:null,displayArm=replayStep?armById(world,replayStep.arm):a;
  const displayedTarget=replayStep?pose(displayArm,replayStep.type==='move'?replayStep.q:displayArm.q).tip:targetPosition||(draft&&validJoints(a,draft)?pose(a,draft).tip:null);
  showCoordinates('tcp','currentPosition',pose(displayArm).tip,displayArm.id);showCoordinates('target-tcp','currentTarget',displayedTarget,displayArm.id);
  $('target-tcp').classList.toggle('invalid',!controller.running&&!!previewError);
  document.querySelectorAll('[data-joint-name]').forEach(el=>el.textContent=words[language].jointNames[Number(el.dataset.jointName)]);
  document.querySelectorAll('#xyz-inputs input[type="range"]').forEach(el=>el.setAttribute('aria-label',t('coordinateSlider',{axis:el.dataset.axis})));
  $('preview-state').textContent=previewPlan?.collision&&!world.failure?t('collisionPreview',{reason:t(previewError)}):t(world.failure?'restartRequired':previewError||'previewShort');$('preview-state').className=world.failure||previewError?'error':'';
  $('open-number-pad').disabled=controller.busy||!!world.failure;$('open-number-pad').title=t('numberPad');$('open-number-pad').setAttribute('aria-label',t('numberPad'));
  numberPad?.update({context:t(selected==='A'?'armA':'armB')+' · '+t(controlMode==='xyz'?'xyzShort':'jointsShort'),warning:$('preview-state').textContent,error:!!previewError||!!world.failure});
  for(const id of ['move','add-move'])$(id).disabled=controller.busy||(id==='move'&&!!world.failure)||!draft||!validJoints(a,draft);
  document.querySelectorAll('#xyz-inputs input,#joint-inputs input,[data-action="open"],[data-action="close"]').forEach(el=>el.disabled=controller.busy||!!world.failure);
  $('record').disabled=controller.busy;$('record').setAttribute('aria-pressed',String(recording));$('record').textContent=t(recording?'finishRecord':'record');$('record').title=t('recordHelp');
  const metrics=controller.metrics;$('replay-time').textContent=(metrics.elapsed/1000).toFixed(2)+' s';$('replay-moves').textContent=metrics.moves+' / '+controller.program.filter(s=>s.type==='move').length;$('replay-actions').textContent=metrics.actions+' / '+controller.program.length;$('timer-status').textContent=t(metrics.status);$('timer-status').dataset.status=metrics.status;
  $('run').disabled=controller.busy||!controller.program.length;$('clear').disabled=controller.busy||!controller.program.length;$('append').disabled=controller.busy;
  $('attempt-stage').textContent=t(exploring?(controller.running?'stageReplaying':recording?'stageRecording':'exploreActiveName'):world.failure?'stageFailed':controller.complete?'stageVerified':controller.running?'stageReplaying':recording?'stageRecording':controller.program.length?'stageReplay':'stageRecord',{axes:a.axes});
  $('attempt-stage').dataset.stage=controller.complete?'verified':recording?'recording':'ready';
  $('pause').disabled=!controller.running;$('pause').textContent=t(controller.paused?'resume':'pause');$('import').disabled=controller.busy;$('export').disabled=controller.busy;
  const checks=[['picked','checkPick'],...(world.mode==='medium'?[['gate','checkGate']]:[]),...(world.mode==='hard'?[['handoff','checkHandoff']]:[]),['delivered','checkPlace']];
  $('checks').replaceChildren(...checks.map(([key,label])=>{const s=document.createElement('span');s.textContent=(world.evidence[key]?'✓ ':'○ ')+t(label);s.className=world.evidence[key]?'done':'';return s;}));
  if(world.part.owner){const held=document.createElement('span');held.textContent=world.part.receiver?t('holdingBoth'):t('holding',{arm:t(world.part.owner==='A'?'armA':'armB')});$('checks').append(held);}
  const verified=controller.complete;$('completion').hidden=!verified;$('next').disabled=!verified;$('next').textContent=t(world.mode==='hard'?'again':'next');
  $('replay-prompt').hidden=!world.complete||verified||controller.busy;$('replay-prompt').textContent=t(controller.program.length?'replayRequired':'recordRequired');
  $('locations').setAttribute('aria-label',t(exploring?'objectLocations':'taskLocations'));
  const positionsKey=world.mode+':'+language+(exploring?JSON.stringify(world.parts.map(p=>[p.id,p.owner,...p.position.map(v=>v.toFixed(1))])):'');
  if($('task-positions').dataset.value!==positionsKey){
    $('task-positions').dataset.value=positionsKey;$('task-positions').classList.toggle('exploring',exploring);
    const positions=exploring?world.parts.map(p=>[t('block',{n:p.id})+(p.owner?' · '+t('held'):''),p.position]):[[t('source'),world.mode==='hard'?[-132,-130,100]:world.source],[t('destination'),world.mode==='hard'?[142,130,100]:world.destination],...(world.wall?[[t('slotCentre'),world.wall.centre]]:[]),...(world.mode==='hard'?[[t('transferA'),[-42,0,160]],[t('transferB'),[42,0,160]]]:[])];
    $('task-positions').replaceChildren(...positions.map(([name,p])=>{const el=document.createElement('p'),label=document.createElement('strong'),values=document.createElement('span');label.textContent=name;values.textContent=formatPosition(p);el.append(label,document.createTextNode(' '),values);return el;}));
  }
  const programKey=JSON.stringify([controller.program,language,controller.index,controller.busy,controller.metrics.steps,controller.lastErrorIndex]);
  if(programKey!==lastProgramKey){lastProgramKey=programKey;renderProgram();}
  $('step-count').textContent=controller.program.length;
  const active=controller.running?{key:controller.paused?'paused':'running',vars:{step:controller.index+1,total:controller.program.length,arm:controller.program[controller.index]?.arm||''}}:message;
  $('feedback').textContent=t(active.key,{...active.vars,...(active.vars?.reason?{reason:t(active.vars.reason)}:{})});$('feedback').className=message.error&&!controller.running?'error':'';
  $('save-state').textContent=t('sessionOnly');
  view?.update(world,{language,selected,target:!world.failure&&!controller.busy&&draft&&validJoints(a,draft)?draft:null,targetPosition:world.failure||controller.busy?null:targetPosition,error:!controller.busy&&!!previewError,motion:world.failure||controller.busy?null:previewPlan,introVisible});
}
function renderProgram(){
  $('steps').replaceChildren(...controller.program.map((step,i)=>{
    const li=document.createElement('li');if(controller.running&&controller.index===i)li.className='current';if(controller.lastErrorIndex===i)li.className='step-error';
    const title=document.createElement('div');title.className='step-title';const index=document.createElement('span');index.className='step-number';index.textContent=i+1;
    const badge=document.createElement('span');badge.className='arm-badge'+(step.arm==='B'?' b':'');badge.textContent=step.arm;badge.title=t(step.arm==='A'?'armA':'armB');
    const name=document.createElement('strong');name.textContent=t(step.type);title.append(index,badge,name);
    const timing=controller.metrics.steps[i];if(timing){const time=document.createElement('small');time.className='step-duration';time.textContent=(timing.duration/1000).toFixed(2)+' s';time.title=t('stepTime',{seconds:(timing.duration/1000).toFixed(2)});title.append(time);}
    const more=document.createElement('button');more.className='step-menu';more.textContent='⋯';more.setAttribute('aria-label',t('stepOptions',{n:i+1}));more.setAttribute('aria-expanded',String(expandedStep===i));more.setAttribute('aria-controls','step-details-'+i);more.onclick=()=>{expandedStep=expandedStep===i?null:i;renderProgram();};title.append(more);li.append(title);
    const details=document.createElement('div');details.id='step-details-'+i;details.className='step-details';details.hidden=expandedStep!==i;
    if(step.q){const values=document.createElement('div');values.className='step-values';values.textContent=step.q.map((v,n)=>'J'+(n+1)+' '+v.toFixed(1)+'°').join(' · ');details.append(values);}
    const actions=document.createElement('div');actions.className='step-actions';for(const [kind,label]of [['show',t('show')],['up','↑'],['down','↓'],['delete','×']]){const b=document.createElement('button');b.type='button';b.textContent=label;b.title=t(kind==='delete'?'remove':kind);b.setAttribute('aria-label',b.title+' '+(i+1));b.disabled=controller.busy||(kind==='up'&&i===0)||(kind==='down'&&i===controller.program.length-1)||(kind==='show'&&!step.q);b.onclick=()=>{if(kind==='show'){introVisible=false;taskOpen=false;selected=step.arm;draft=[...step.q];controlMode=arm().axes===3||step.kind==='xyz'?'xyz':'joints';coordinateTarget=controlMode==='xyz'?pose(arm(),draft).tip:null;xyzReference=[...draft];xyzSeed=[...draft];tab='controls';buildInputs();preview();}else{expandedStep=null;controller.edit(i,kind);rememberProgram();}};actions.append(b);}details.append(actions);li.append(details);return li;
  }));if(!controller.program.length){const p=document.createElement('p');p.className='empty-program';p.textContent=t('emptyProgram');$('steps').append(p);}
}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>selectMode(b.dataset.mode));document.querySelectorAll('[data-arm]').forEach(b=>b.onclick=()=>selectArm(b.dataset.arm));document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>selectTab(b.dataset.tab));
document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>execute(b.dataset.action));
document.querySelectorAll('[data-robot-axes]').forEach(b=>b.onclick=()=>selectExploreRobot(Number(b.dataset.robotAxes)));
$('task-toggle').onclick=()=>{taskOpen=!taskOpen;render();};$('show-program').onclick=()=>selectTab('program');
$('language').onchange=()=>{language=$('language').value;rememberProgram();render();};$('move').onclick=()=>execute('move');$('add-move').onclick=()=>addStep('move');$('append').onclick=()=>addStep($('append-action').value);
document.querySelectorAll('[data-control]').forEach(b=>b.onclick=()=>selectControlMode(b.dataset.control));
$('record').onclick=()=>setRecording(!recording);$('stop').onclick=stop;$('reset').onclick=reset;$('restart').onclick=reset;$('home').onclick=()=>view.home();$('run').onclick=startProgram;$('pause').onclick=()=>controller.pause();$('clear').onclick=()=>{if(controller.busy)return;controller.program=[];controller.clearMetrics();recording=false;rememberProgram();say('clearDone');};
$('next').onclick=()=>{if(!controller.complete)return say('replayRequired',{},true);controller.world.mode==='hard'?reset():selectMode(modes[modes.indexOf(controller.world.mode)+1]);};
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({version:1,mode:controller.world.mode,...(controller.world.mode==='explore'?{axes:arm().axes}:{}),steps:controller.program,replay:controller.metrics},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='robot-challenge-'+controller.world.mode+(controller.world.mode==='explore'?'-'+arm().axes+'axis':'')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);say('saved');};
$('import').onclick=()=>$('file').click();$('file').onchange=async()=>{try{const file=$('file').files[0];if(!file)return;if(file.size>100000)throw Error();const data=JSON.parse(await file.text());const axes=data.axes??6;if(data.mode==='explore'&&![3,6].includes(axes))throw Error();data.steps=upgradeHandoffSteps(data.mode,data.steps);if(data.version!==1||!modes.includes(data.mode)||!validSteps(data.mode,data.steps,axes)||controller.busy)throw Error();if(!selectMode(data.mode,axes))return;controller.program=clone(data.steps);rememberProgram();tab='program';say('loaded');}catch{say('invalidFile',{},true);}finally{$('file').value='';}};
function fit(){document.documentElement.style.setProperty('--height',(window.visualViewport?.height||innerHeight)+'px');}
window.visualViewport?.addEventListener('resize',fit);window.addEventListener('resize',fit);
numberPad=createNumberPad({host:$('number-editor'),t,onInput:applyPadValues,onClose:finishNumberPad});
$('open-number-pad').onclick=()=>openNumberPad();
syncDraft();view=createChallengeScene($('scene'),language);render();fit();
let frame,last=0;function tick(now){const wasRunning=controller.running;controller.tick(Math.min(100,now-(last||now)));last=now;if(wasRunning&&!controller.running&&!controller.lastError){say(controller.world.mode==='explore'?'exploreReplayDone':controller.complete?'complete':'endIncomplete');rememberProgram();}frame=requestAnimationFrame(tick);}frame=requestAnimationFrame(tick);
window.addEventListener('pagehide',()=>{pending=null;cancelAnimationFrame(frame);view.dispose();});
// Back/forward cache restores JS memory too, so re-enter through the fresh startup.
window.addEventListener('pageshow',event=>{if(event.persisted)window.location.reload();});
