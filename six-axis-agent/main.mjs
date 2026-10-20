import { initialState, snapshot, planActions, applyStep } from './world.mjs';
import { askAgent, validateConnection, DEFAULTS } from './agent.mjs';
import { createScene } from './scene.mjs';

const $=id=>document.getElementById(id);
const words={
 en:{edition:'SIX AXIS / CONVERSATIONAL LAB',workspace:'YOUR WORKSPACE',headline:'A robot. A conversation.',orbit:'Drag to orbit · Scroll to zoom',simulation:'6-axis kinematic simulation',conversation:'TALK TO YOUR ROBOT',agent:'Robot assistant',suggestPick:'Pick up the red block',suggestAsk:'What can you do?',keyLabel:'Your Alibaba API key',settings:'Connection settings',keyNote:'Used for this tab only. Never added to the chat.',connect:'Connect ↗',send:'Send ↗',stop:'■ Stop',reconnect:'Change connection',hint:'Say what you want. The robot will ask if it needs more detail.',source:'About & source ↗',offline:'Not connected',online:'Qwen connected',you:'YOU',robot:'ROBOT',system:'WORKSPACE',welcome:'Hello. I’m your robot assistant.\n\nEnter your Alibaba API key below to connect. Then tell me what you would like the arm to do.',connected:'Connected. I can see three blocks and two placement pads. Try “pick up the red block”, or ask me what I can do.',connecting:'Connecting to Alibaba…',thinking:'Thinking…',planning:'Checking the movement…',moving:'Moving the arm…',empty:'Gripper empty',holding:'Holding the {color} block',red:'red',blue:'blue',yellow:'yellow',keyPlaceholder:'Paste your Alibaba API key',promptPlaceholder:'Tell the robot what to do…',messageLabel:'Message the robot',reset:'Reset scene',resetDone:'Scene reset. All three blocks are back in their starting positions.',stopped:'Stopped. The arm is holding its current position.',pickDone:'I’ve picked up the {color} block. Where would you like me to put it?',holdDone:'Done. I’m holding the {color} block. What would you like me to do next?',done:'Done. The movement is complete and the gripper is empty.',needConnection:'Enter your Alibaba API key below to connect.',auth:'The key was not accepted. Check that it matches this Alibaba endpoint, then reconnect.',quota:'Alibaba reports a rate or quota limit. Please try again later or check your account.',model:'Alibaba could not use this model or endpoint. Check Connection settings.',provider:'Alibaba is unavailable right now. Please try again.',response:'I couldn’t read a valid action from the AI. Nothing moved. Please try again.',network:'I couldn’t reach Alibaba. Check your connection. If the browser blocks this endpoint (CORS), a server connection will be needed.',timeout:'Alibaba took too long to respond. Nothing moved. Please try again.',credentials:'Enter an API key and a valid model name.',endpoint:'Use an HTTPS Alibaba API base URL, without a query string.',invalid:'I can’t carry out that action. Please describe one of the blocks or a placement pad.',unknown:'I can only pick up the red, blue or yellow block.',destination:'Which pad should I use: left or right?',angle:'That rotation exceeds the wrist range. Try a smaller angle.',blocked:'I can’t find a clear path for that move. Nothing moved.',reach:'I can’t reach that pose within the joint limits. Nothing moved.',occupied:'That pad already has a block. Choose the other pad or move that block first.',emptyError:'I’m not holding a block. Which one should I pick up?',holdingError:'I’m already holding a block. Where should I place it first?',webgl:'The 3D view could not start. Enable WebGL or try another browser.',sceneUnavailable:'The 3D view is unavailable, so robot commands are disabled.',change:'Enter your Alibaba key to connect again. The scene is unchanged.'},
 zh:{edition:'六轴 / 对话实验室',workspace:'你的工作台',headline:'一个机械臂，一场对话。',orbit:'拖动旋转视角 · 滚动缩放',simulation:'六轴运动学模拟',conversation:'与你的机械臂对话',agent:'机械臂助手',suggestPick:'拿起红色方块',suggestAsk:'你能做什么？',keyLabel:'你的阿里云 API 密钥',settings:'连接设置',keyNote:'仅在当前页面使用，不会加入聊天记录。',connect:'连接 ↗',send:'发送 ↗',stop:'■ 停止',reconnect:'更改连接',hint:'说出你的想法。需要更多细节时，机械臂会向你提问。',source:'说明与源码 ↗',offline:'未连接',online:'千问已连接',you:'你',robot:'机械臂',system:'工作台',welcome:'你好，我是你的机械臂助手。\n\n请在下方输入阿里云 API 密钥。连接后，告诉我你希望机械臂做什么。',connected:'连接成功。我能看到三个方块和两个放置区。试试说“拿起红色方块”，或问我能做什么。',connecting:'正在连接阿里云…',thinking:'正在思考…',planning:'正在检查运动路径…',moving:'机械臂正在移动…',empty:'夹爪为空',holding:'正在夹持{color}方块',red:'红色',blue:'蓝色',yellow:'黄色',keyPlaceholder:'在此粘贴阿里云 API 密钥',promptPlaceholder:'告诉机械臂你想做什么…',messageLabel:'向机械臂发送消息',reset:'重置场景',resetDone:'场景已重置。三个方块都已回到初始位置。',stopped:'已停止。机械臂保持当前位置。',pickDone:'我已经拿起{color}方块了。你想让我把它放在哪里？',holdDone:'完成。我正夹着{color}方块，接下来做什么？',done:'完成。运动已结束，夹爪为空。',needConnection:'请在下方输入阿里云 API 密钥进行连接。',auth:'密钥未被接受。请确认密钥与阿里云端点匹配，然后重新连接。',quota:'阿里云返回了速率或额度限制。请稍后重试或检查账户。',model:'阿里云无法使用此模型或端点，请检查连接设置。',provider:'阿里云暂时不可用，请稍后重试。',response:'AI 返回的动作格式无效。机械臂没有移动，请重试。',network:'无法连接阿里云。请检查网络。如果浏览器拦截此端点（CORS），则需要通过服务器连接。',timeout:'阿里云响应超时。机械臂没有移动，请重试。',credentials:'请输入 API 密钥和有效的模型名称。',endpoint:'请使用阿里云 HTTPS API 地址，不要包含查询参数。',invalid:'我无法执行这个动作。请描述一个方块或放置区。',unknown:'我只能拿起红色、蓝色或黄色方块。',destination:'你想使用左侧还是右侧放置区？',angle:'该旋转超出腕关节范围，请尝试较小角度。',blocked:'我找不到畅通的运动路径。机械臂没有移动。',reach:'该姿态超出了关节的运动范围。机械臂没有移动。',occupied:'该放置区已有方块。请选择另一个，或先移走那个方块。',emptyError:'我没有夹持方块。你想让我拿起哪一个？',holdingError:'我已经夹着一个方块。你希望我先把它放在哪里？',webgl:'无法启动三维视图。请启用 WebGL 或尝试其他浏览器。',sceneUnavailable:'三维视图不可用，机械臂指令已禁用。',change:'请重新输入阿里云密钥进行连接。场景保持不变。'}
};
let language='en'; try{language=localStorage.getItem('six-axis-language')==='zh'?'zh':'en';}catch{}
let state=initialState(),connection=null,busy=false,epoch=0,abort=null,history=[],activity='',view=null;
const t=(key,vars={})=>Object.entries(vars).reduce((s,[k,v])=>s.replaceAll('{'+k+'}',v),words[language][key]||key);
function add(role,content,{key,vars,error=false}={}) {
  const el=document.createElement('div');el.className='message '+role+(error?' error':'');
  const who=document.createElement('div');who.className='who';who.textContent=t(role==='user'?'you':role==='system'?'system':'robot');
  const body=document.createElement('div');body.className='body';body.textContent=content;
  el.append(who,body);if(key){el.dataset.key=key;el.dataset.vars=JSON.stringify(vars||{});}
  $('messages').append(el);$('messages').scrollTop=$('messages').scrollHeight;
  // Bound memory and DOM independently; no API key is ever added here.
  if($('messages').children.length>80)$('messages').firstElementChild.remove();
  return el;
}
function say(key,vars={},role='assistant',error=false){return add(role,t(key,vars),{key,vars,error});}
function remember(role,content){history.push({role,content});history=history.slice(-12);}
function render(){view?.update(state);$('scene-state').textContent=state.held?t('holding',{color:t(state.held)}):t('empty');}
function refresh(){
  document.documentElement.lang=language;
  document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  $('language').textContent=language==='en'?'中文':'English';$('language').setAttribute('aria-label',language==='en'?'Switch to Chinese':'切换至英文');
  $('reset').title=t('reset');$('reset').setAttribute('aria-label',t('reset'));
  $('api-key').placeholder=t('keyPlaceholder');$('prompt').placeholder=t('promptPlaceholder');$('prompt').setAttribute('aria-label',t('messageLabel'));
  $('api-key').hidden=!!connection;$('prompt').hidden=!connection;$('connection-options').hidden=!!connection;
  $('input-label').textContent=t(connection?'messageLabel':'keyLabel');$('input-label').htmlFor=connection?'prompt':'api-key';
  $('key-note').hidden=!!connection;$('reconnect').hidden=!connection;$('reconnect').disabled=busy;
  $('suggestions').hidden=!connection||busy||history.length>2;
  $('send').textContent=t(connection?'send':'connect');$('send').hidden=busy;$('stop').hidden=!busy;
  $('api-key').disabled=busy;$('prompt').disabled=busy;$('base-url').disabled=busy;$('model').disabled=busy;
  $('connection-state').textContent=t(connection?'online':'offline');$('connection-state').classList.toggle('online',!!connection);
  $('activity').textContent=activity?t(activity):'';
  document.querySelectorAll('.message[data-key]').forEach(el=>{const vars=JSON.parse(el.dataset.vars);if(vars.colorId)vars.color=t(vars.colorId);el.querySelector('.body').textContent=t(el.dataset.key,vars);});
  document.querySelectorAll('.message').forEach(el=>el.querySelector('.who').textContent=t(el.classList.contains('user')?'you':el.classList.contains('system')?'system':'robot'));
  view?.language(language);render();
}
function status(key){activity=key;refresh();}
function cancel(announce=true){epoch++;abort?.abort();abort=null;const wasBusy=busy;busy=false;activity='';if(announce&&wasBusy){say('stopped',{},'system');remember('assistant',t('stopped')+' '+JSON.stringify(snapshot(state)));}refresh();}
async function request(question,id){
  abort=new AbortController();const controller=abort;let timedOut=false;
  const timer=setTimeout(()=>{timedOut=true;controller.abort();},30000);
  try{return await askAgent(connection,{question,language,history,scene:snapshot(state)},controller.signal);}
  catch(error){if(id===epoch&&timedOut)throw Error('timeout');throw error;}
  finally{clearTimeout(timer);if(abort===controller)abort=null;}
}
async function animate(steps,id){
  for(const step of steps){
    if(id!==epoch)throw Error('cancelled');
    if(step.type!=='move'){applyStep(state,step);render();continue;}
    const from=[...state.q],fromYaw=state.yaw;
    await new Promise((resolve,reject)=>{let elapsed=0,previous=null;
      function frame(now){
        if(id!==epoch)return reject(Error('cancelled'));
        if(previous!==null)elapsed+=Math.min(50,now-previous);previous=now;
        const u=Math.min(1,elapsed/(step.seconds*1000));
        applyStep(state,{type:'move',q:from.map((v,i)=>v+(step.q[i]-v)*u),yaw:fromYaw+(step.yaw-fromYaw)*u});render();
        if(u===1)resolve();else requestAnimationFrame(frame);
      }requestAnimationFrame(frame);
    });
  }
}
function reportError(error){const key=error.message==='empty'?'emptyError':error.message==='holding'?'holdingError':words[language][error.message]?error.message:error instanceof TypeError?'network':'provider';say(key,{},'assistant',true);return t(key);}
async function connect(){
  const id=++epoch;busy=true;status('connecting');
  let candidate;
  try{
    candidate=validateConnection({base:$('base-url').value.trim(),model:$('model').value.trim(),key:$('api-key').value});
    // The key is removed from the input before any message is rendered.
    $('api-key').value='';
    abort=new AbortController();const controller=abort;let timedOut=false;
    const timeout=setTimeout(()=>{timedOut=true;controller.abort();},30000);
    let response;
    try{response=await askAgent(candidate,{question:'connection_check',language,history:[],scene:snapshot(state)},controller.signal);}
    catch(error){if(timedOut)throw Error('timeout');throw error;}finally{clearTimeout(timeout);}
    if(id!==epoch)return;
    if(response.actions.length)throw Error('response');
    connection=candidate;try{localStorage.setItem('six-axis-settings',JSON.stringify({base:candidate.base,model:candidate.model}));}catch{}
    say('connected');
  }catch(error){if(id===epoch)reportError(error);}
  finally{if(id===epoch){busy=false;activity='';abort=null;refresh();(connection?$('prompt'):$('api-key')).focus();}}
}
async function send(question){
  if(busy||!question.trim())return;
  if(!connection){say('needConnection');return;}
  if(!view){say('sceneUnavailable',{},'assistant',true);return;}
  const id=++epoch;busy=true;add('user',question);$('prompt').value='';status('thinking');
  try{
    const response=await request(question,id);if(id!==epoch)return;
    remember('user',question);
    if(!response.actions.length){add('assistant',response.reply);remember('assistant',response.reply);return;}
    status('planning');
    const plan=planActions(state,response.actions);if(id!==epoch)return;
    add('assistant',response.reply);remember('assistant',response.reply);status('moving');
    await animate(plan.steps,id);if(id!==epoch)return;
    const key=state.held?(response.actions.at(-1).type==='pick'?'pickDone':'holdDone'):'done';
    const vars=state.held?{color:t(state.held),colorId:state.held}:{};
    say(key,vars);remember('assistant',t(key,vars)+'\nExecution result: '+JSON.stringify(snapshot(state)));
  }catch(error){if(id===epoch)remember('assistant','Execution did not complete: '+reportError(error));}
  finally{if(id===epoch){busy=false;activity='';refresh();$('prompt').focus();}}
}
$('composer').addEventListener('submit',event=>{event.preventDefault();if(!busy){if(connection)void send($('prompt').value.trim());else void connect();}});
$('prompt').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();$('composer').requestSubmit();}});
$('stop').addEventListener('click',()=>cancel());
$('reset').addEventListener('click',()=>{cancel(false);state=initialState();history=[];view?.resetView();say('resetDone',{},'system');refresh();});
$('language').addEventListener('click',()=>{if(busy)cancel();language=language==='en'?'zh':'en';try{localStorage.setItem('six-axis-language',language);}catch{}refresh();});
$('reconnect').addEventListener('click',()=>{cancel(false);connection=null;$('api-key').value='';say('change');refresh();$('api-key').focus();});
document.querySelectorAll('[data-command]').forEach(button=>button.addEventListener('click',()=>void send(t(button.dataset.command==='pick'?'suggestPick':'suggestAsk'))));
try{const saved=JSON.parse(localStorage.getItem('six-axis-settings'));if(saved){$('base-url').value=saved.base||DEFAULTS.base;$('model').value=saved.model||DEFAULTS.model;}}catch{}
try{view=createScene($('scene'));}catch{$('render-error').hidden=false;$('render-error').textContent=t('webgl');}
say('welcome');refresh();
// Read-only snapshot for accessibility/automated behavior verification. No connection or key is exposed.
Object.defineProperty(window,'robotLabSnapshot',{value:()=>structuredClone({scene:snapshot(state),busy,connected:!!connection,language})});
