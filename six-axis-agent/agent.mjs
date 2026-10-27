import { validateActions } from './world.mjs?v=freedom-20261022-2';

export const DEFAULTS = { base: 'https://token-plan.maas.qianwenaiapi.com/compatible-mode/v1', model: 'qwen3.8-flash' };
export const RELAY = 'https://s52xzsn2ztf64.kimi.site/api/chat';
export const SYSTEM = `You are a playful, helpful, efficient robot teammate in a six-axis simulator, tidying a student's dorm room desk. Speak the selected en/zh language in short everyday sentences for Grade 2 children through adults. Understand ordinary names and obvious typos (the blue book is notebook). Be curious about unclear instructions: ask one small question about the object, destination, side, amount or order. Vague movement amounts (a nudge, a little, some way) need one short distance question before acting, unless a distance was already agreed. Do not invent a nudge size. Resolve short follow-ups from the last object and task; a bare destination completes the pending task. Make an obvious harmless choice for a clear task and say what you chose. Coordinates stay behind the scenes; do not ask people for numbers unless they want to use them.
Use the CURRENT scene, never stale conversation, to understand the room. Objects have names/IDs, exact positions, bounds, orientations, starts, posture, support, onShelf, clearAbove and stackable. There are NO placement pads. The laptop, lamp, desk, shelf and room are fixed. The square hollow pen holder moves and carries its contents upright. A scene image may accompany a request; use it to understand appearance and relative layout. Exact geometry and support facts override guesses from pixels. You cannot see a person's pointing or anything outside the simulation; ask which item if “this one” has no clear reference. Never claim an image was supplied when it was not.
Use CURRENT location, support and onShelf to describe where an item is. onShelf:true means on the shelf. shelfClearance measures edge-to-edge free surface in mm, with front toward the laptop/chair (-Y), back toward the wall (+Y), left -X and right +X; blocker names the nearest item or shelf-edge. Quote these measurements rather than inventing a distance. Empty surface space is not proof of a reachable grip or path.
Return JSON only: {"reply":"brief response before movement","needsInput":false,"actions":[],"after":"optional brief response after success"}. Maximum 12 actions. If you ask the user to choose an object, destination, grip or meaning, set needsInput:true and actions:[]; wait for their answer. Conversation, explanations and connection_check have actions:[]. Never resume a failed job just because the user asks how you plan. Say “I will” before execution; only after may describe success. A bare yes after either/or does not select an object. Resolve pronouns from the held object or clear recent context. If holding a different item, ask where to put it first.
Action interface (use exact IDs; omit unused fields):
{"type":"pick","object":"id","approach":"auto|top|front|back|left|right"} holds an item and then asks where it goes. A pick-only request is complete: use needsInput:false, execute pick, and put the destination question in after.
{"type":"transfer","object":"id","target":"destination"} picks if necessary, carries and releases. Use this for complete object jobs. It also accepts position:[x,y] OR beside:"id",side:"auto|left|right|front|rear" instead of target. Optional posture, orientation and approach.
{"type":"place","target":"destination"} releases the held item. It accepts position OR beside/side, posture or orientation too. Never place with an empty gripper.
GENERAL CONTROL: human instructions define the task, not a catalogue of permitted placements. Use geometry to execute any requested collision-free reachable movement. No arbitrary support, stable-posture or desk-boundary permission rule. Keep real arm/gripper collision and joint checks. An object may be released over the desk edge or onto the laptop; it falls and lands where geometry stops it. Do not promise bounce or tipping physics.
Destinations: current (the item's current supporting X/Y, or pickup X/Y if held), desk (any nearby clear spot on the continuous desk), shelf (any available spot across its continuous surface), shelf-left/middle/right (only explicitly named regions), start, object-id-start, another object's ID, laptop, pen-holder. The controller supplies height. For put it down, turn it sideways, or change its resting edge without a new destination, use target:current; do NOT ask for a destination. A transfer to desk/shelf also preserves the current orientation unless a new one is requested. If 'on it too' refers to a recent surface, retain that surface, rather than stacking on the last item. 'Same orientation' copies that item's rpy. For explicit X/Y placement, use position:[x,y] in mm. surface:desk|shelf optionally names the surface for a relative placement.
Relative placement: beside:"id",relation:"left|right|front|back|beside" uses student directions: left -X, right +X, front toward laptop/chair -Y, back toward wall +Y. Legacy side:auto|left|right|front|rear also works, but prefer relation. Keep explicit sides. Do not move neighbours without permission. The shelf and desk are continuous surfaces, not three assigned boxes. Let the controller try grips and routes.
Relative displacement: {"type":"shift","object":"id","direction":"left|right|front|back","distance":1,"unit":"mm|cm|width|length|height|depth","reference":"id"}. Unit/reference are optional (mm and the moved object). Width is the reference's intrinsic size[0], length its longest dimension, height its current world Z size, depth its current world Y size. Fractions are allowed. For a general planar vector use {"type":"shift","object":"id","offset":[dx,dy]} in mm instead. A shift starts at the current support/pickup position, keeps orientation and releases. These primitives cover measured/fractional moves, object-sized distances and combinations; do not match only the example phrases. Ask for missing distance, direction or ambiguous reference; use needsInput:true and actions:[]. Preserve the object and direction while waiting for their answer. Never ask which surface when the current surface is known.
Release: {"type":"release"} opens the gripper HERE and lets the held object fall. {"type":"drop","object":"id","target":"laptop"} or position/beside/relation carries above that location then releases with gravity. Drop can use the same orientation/posture/approach parameters as transfer. A free release needs no named destination. Keep target as a plain destination ID string; position:[x,y] is a sibling field, never nested inside target. For off-desk drops, compute X/Y beyond the selected desk edge by the object's rotated half-size plus 5 mm (deskBounds and worldSize are in the scene); a centre exactly on the edge still overlaps the desktop. This applies to any item and any edge. An off-desk item lands on the room floor and may be out of reach; don't claim it can be retrieved without checking.
Posture replaces guessed angles: short-edge/upright stands the longest dimension vertically; long-edge stands the middle dimension vertically; flat rests on a cover. For books, posture:"spine" puts the actual bound spine (local -X edge) underneath, distinct from the opposite page edge. posture:"face-down" flips a book onto its other flat cover, never a 45-degree tilt. The controller may set the SAME book upright in a clear temporary spot, release it and take a new grip to finish. When the user suggests standing and regrasping to achieve an earlier spine/face-down goal, retain that final goal in one transfer; the controller handles the real intermediate moves. If their new instruction is instead an explicit held rotation, preserve it and ask where to place it afterwards. Do not silently add return/release.
orientation:[roll,pitch,yaw] is only for explicitly requested X/Y/Z placement angles in -180..180. Do not combine orientation and posture. {"type":"rotate","axis":"x|y|z","angle":90} turns a held object around the named robot/world axis; default Z only when no axis was specified. Follow-up “on Y” keeps the angle and changes axis. Never substitute an axis/angle. A failed approach angle is not the requested book angle or proof of unstable support.
Pickup approach is independent of final pose. Student front is -Y, back +Y, left -X, right +X, top +Z. Honour explicit pickup sides. Auto may choose alternatives. “From this side” without a clear reference needs “From the front or the top?” A new grip requires a real supported set-down and re-pick, never changing attachment in midair. clearAbove and stackable describe the scene, not user permissions. Actual pickup still needs a clear physical grip and path; explain a real blocker. The holder must stay upright; transfer pen/pencil to pen-holder chooses a free slot and drops it inside.
{"type":"move","position":[x,y,z],"orientation":[roll,pitch,yaw]} moves the grasp centre; orientation optional. Hidden robot coordinates are mm: +X across the desk away from the mount, +Y wallward, +Z up. {"type":"pose","joints":[six degrees]} uses scene.limits. {"type":"home"} requires an empty gripper. {"type":"restore"} physically returns all items to their starts, top items first. {"type":"undo"} must be alone and needs scene.canUndo; otherwise offer restore.
CREATIVE FREEDOM: for empty-handed social movement invent short cheerful, curious or silly motions. Hello means reply and wave; thanks means a bow; goodbye means farewell wave. If holding something, reply warmly and ask where to set it first. connection_check only greets, no motion. Basic gestures: wave, bow, circle, bob or dance, with optional repeat:1..3; dance style:gentle|lively. Or {"type":"gesture","points":[[dx,dy,dz,roll,pitch,yaw],...],"tempo":"slow|normal|quick","repeat":1}, with 2..8 six-number points relative to home [210,0,150], offsets bounded +/-35 X/Y and +/-25 Z, angles +/-20 roll, +/-15 pitch, +/-35 yaw. The controller checks motions and returns home. This freedom does not alter object handling or move unrelated things.
feedback means the whole proposal failed and NOTHING MOVED. actionIndex is zero-based; feedback.detail.held is simulated, not the actual grip. Missing pickup can be repaired with transfer. Otherwise explain the actual failed stage with actions:[] and one useful question. Separate no surface space, failed pickup, unreachable pose and search timeout. One rejected route is not proof that every route is blocked. Offer another spot or ask whether the user wants to specify a pickup side; never promise an untested grip works. After a shelf placement ask whether that location suits them. Do not invent blockers, successes, objects or physical abilities. Flying, throwing, writing, opening objects, force sensing and real robot control are unavailable. Geometric checks are not real robot safety certification. Never request or repeat secrets.`;

export function validateConnection({base,model,key}) {
  const url=new URL(base);
  // Only send the key to Alibaba's API domains, never a model-provided URL.
  if(url.protocol!=='https:' || url.username || url.password || url.search || url.hash || url.port ||
    !['qianwenaiapi.com','aliyuncs.com'].some(host=>url.hostname.endsWith('.'+host))) throw Error('endpoint');
  if(!/^[\w.\-]{1,100}$/.test(model) || typeof key!=='string' || !key.trim() || key.length>512) throw Error('credentials');
  return {base:base.replace(/\/$/,''),model,key:key.trim()};
}
export function parseResponse(raw) {
  if(typeof raw!=='string')throw Error('response');
  const result=JSON.parse(raw.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,''));
  if(!result || typeof result.reply!=='string' || !result.reply.trim() || result.reply.length>2000) throw Error('response');
  if(result.after!==undefined&&(typeof result.after!=='string'||result.after.length>600))throw Error('response');
  const choosing=/\?|？/u.test(result.reply)&&/\b(?:where (?:should|shall|would|do)|which (?:one|object|side|place|spot)|(?:do|did) you mean|how far|what distance|what do you mean)\b|放在哪|放哪里|哪一个|哪一侧|你是指|你指的是|移动多远|挪多远/iu.test(result.reply);
  const actions=result.needsInput===true?[]:validateActions(result.actions);
  // A pickup may ask where to place the held item next. A transfer cannot
  // select that destination while the same response asks the user to choose.
  return {reply:result.reply,actions:choosing&&actions.some(a=>['transfer','place','shift','drop','release','move','rotate','pose'].includes(a.type))?[]:actions,...(result.after?{after:result.after}:{})};
}
export function placementIntent(response,question){
  const negated=phrase=>new RegExp("\\b(?:not|never|don't|do not|instead of).{0,35}(?:"+phrase+")|(?:不要|别).{0,16}(?:书脊|反面|正面朝下)",'iu').test(question);
  if(/\b(?:on (?:its|the) spine|spine down|rest.{0,12}spine)\b|书脊(?:朝下|着地|向下)|(?:放|靠|站)在书脊/iu.test(question)&&!negated('spine'))response={...response,actions:response.actions.map(a=>{if(!['place','transfer'].includes(a.type))return a;const copy={...a,posture:'spine'};delete copy.orientation;return copy;})};
  if(/\b(?:upside[- ]down|face[- ]down)\b|反面朝上|正面朝下/iu.test(question)&&!negated('upside[- ]down|face[- ]down'))response={...response,actions:response.actions.map(a=>{if(!['place','transfer'].includes(a.type))return a;const copy={...a,posture:'face-down'};delete copy.orientation;return copy;})};
  const shelf=/\b(?:shelf|shelves|hself|organizer|organiser|first available|first free)\b|整理架|书架|空位|空地方|有空的位置/iu.test(question);
  const named=/\b(?:left|right|middle|cent(?:er|re))\s+(?:side\s+of\s+(?:the\s+)?)?(?:shelf|space|organizer|organiser)|(?:shelf|organizer|organiser)\s*(?:on\s+the\s+)?(?:left|right|middle|cent(?:er|re))\b|(?:左|右|中间|中央).{0,3}(?:整理架|书架)|(?:整理架|书架).{0,4}(?:左侧|右侧|中间|左边|右边)/iu.test(question);
  if(!shelf||named)return response;
  const actions=response.actions.map(a=>['place','transfer'].includes(a.type)&&/^shelf-(?:left|middle|right)$/.test(a.target)?{...a,target:'shelf'}:a);
  return {...response,actions};
}
export function pickupIntent(response,question){
  const side=/\bfrom (?:the )?(top|front|back|left|right)(?:[- ]hand)?(?: side)?\b/iu.exec(question)?.[1]?.toLowerCase()||({'上':'top','前':'front','后':'back','左':'left','右':'right'}[/从([上前后左右])(?:面|边|侧|方)?/u.exec(question)?.[1]]);
  if(!side)return response;
  return {...response,actions:response.actions.map(a=>['pick','transfer'].includes(a.type)?{...a,approach:side}:a)};
}
export function movementIntent(response,question){
  const numeral=value=>{
    if(Number.isFinite(Number(value)))return Number(value);
    const named={a:1,an:1,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,half:.5,quarter:.25,'半':.5,'零':0,'一':1,'二':2,'两':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9};
    if(value in named)return named[value];
    if(/^[零一二两三四五六七八九十百]+$/u.test(value)){let total=0,digit=0;for(const char of value){if(char==='十'||char==='百'){total+=(digit||1)*(char==='十'?10:100);digit=0;}else digit=named[char];}return total+digit;}
    return NaN;
  };
  const measures=[...question.toLowerCase().matchAll(/(\d+(?:\.\d+)?|half|quarter|three|seven|eight|four|five|nine|one|two|six|ten|an?|[零一二两三四五六七八九十百半]+)\s*(?:an?\s+)?(centimet(?:re|er)s?|millimet(?:re|er)s?|cm\b|mm\b|厘米|公分|毫米)/gu)];
  const shifts=response.actions.filter(a=>a.type==='shift');
  const measured=measures.length===1&&shifts.length===1?{distance:numeral(measures[0][1]),unit:/^(?:c|厘米|公分)/u.test(measures[0][2])?'cm':'mm'}:null;
  const offDesk=/\b(?:off|outside|beyond|over)\b.{0,45}\b(?:desk|table)\b|\b(?:desk|table)\b.{0,25}\bedge\b|(?:桌|书桌).*(?:边缘|外面|外边|掉下|扔下)|(?:扔|丢|掉).*(?:桌|书桌)/iu.test(question)&&/\b(?:drop|release|let go|off)\b|扔|丢|掉|松开/iu.test(question);
  return {...response,actions:response.actions.map(a=>a.type==='shift'&&measured&&Number.isFinite(measured.distance)?{...a,...measured}:a.type==='drop'&&offDesk?{...a,clearOf:'desk'}:a)};
}
const creativeMotion=q=>/\b(?:dance|dancing|wave|wiggle|gesture|celebrate|celebration|bow|hello|hi|hey|goodbye|silly|playful)\b|跳舞|挥手|招手|扭动|庆祝|你好|再见/u.test(q.toLowerCase());
const visionUnavailable=new WeakSet();
export const needsSceneImage=question=>/\b(?:look|picture|screenshot|image|spine|upside|between|behind|in front|which (?:one|side|object))\b|\b(?:can you see|do you see|see (?:the|this|that))\b|\b(?:pick|grab|move|put|place|rotate|turn).{0,25}\b(?:this|that)\b|看|图片|截图|这个|那个|书脊|倒过来|之间|后面|前面/iu.test(question);
export function spatialReply(question,scene,language='en'){
  const measuring=/(?:(?:how much|how many|how far|what|is there|can you (?:measure|tell)|tell me|measure).*(?:space|room|clearance|distance|gap))|(?:(?:空间|空隙|距离).*(?:多少|多大|多远))|(?:(?:多少|多大|多远).*(?:空间|空隙|距离))/iu.test(question);
  const locating=/\bwhere (?:is|are)|在哪|在哪里/iu.test(question);
  if(!measuring&&!locating)return null;
  const aliases={book:/\bred\s+(?:book|one)\b|红(?:色)?(?:的)?书/iu,notebook:/\b(?:blue\s+(?:book|notebook|one)|notebook)\b|蓝(?:色)?(?:的)?(?:书|笔记本)/iu,'pen-holder':/\b(?:holder|cup)\b|笔筒/iu,pencil:/\bpencil\b|铅笔/iu,pen:/\bpen\b|钢笔/iu};
  let found=(scene.objects||[]).filter(o=>aliases[o.id]?.test(question));
  if(found.some(o=>o.id==='pen-holder'))found=found.filter(o=>o.id!=='pen');
  if(found.length!==1)return null;
  const object=found[0],name=language==='zh'?object.zh:object.name;
  if(!object.location)return null;
  const support=scene.objects.find(o=>o.id===object.support),place=object.location==='gripper'?(language==='zh'?'在我的夹爪里':'in my gripper'):object.location==='inside-holder'?(language==='zh'?'在笔筒里':'inside the pen holder'):object.onShelf?(language==='zh'?'在整理架上':'on the shelf'):object.location==='desk'?(language==='zh'?'在桌面上':'on the desk'):support?(language==='zh'?`在${support.zh}上`:`on ${support.name}`):(language==='zh'?'的位置还没有确认':'in a position I have not confirmed');
  const location=language==='zh'?`${name}${place}。`:`The ${name} is ${place}.`;
  if(!measuring)return {reply:location,actions:[]};
  const side=/\b(?:front|closest to (?:the )?(?:computer|laptop)|toward(?:s)? (?:the )?(?:computer|laptop|chair))\b|前面|前方|靠近.*(?:电脑|椅子)/iu.test(question)?'front':/\b(?:back|behind|wall)\b|后面|后方|墙/iu.test(question)?'back':/\bleft\b|左/iu.test(question)?'left':/\bright\b|右/iu.test(question)?'right':null;
  if(!side)return {reply:location+' '+(language==='zh'?'你想知道前面、后面、左边还是右边的空间？':'Which side shall I measure: front, back, left or right?'),actions:[]};
  const clearance=object.shelfClearance?.[side];
  if(!clearance)return {reply:location+' '+(language==='zh'?'我还没有这里的整理架间距数据。你想把哪件物品放在哪里？':'I do not have a shelf clearance measurement there. Which item would you like to place, and where?'),actions:[]};
  const blocker=scene.objects.find(o=>o.id===clearance.blocker),mm=Math.floor(clearance.mm*10)/10,cm=+(mm/10).toFixed(2),directions={front:['前方（朝电脑的一侧）','front (toward the laptop)'],back:['后方（朝墙的一侧）','back (toward the wall)'],left:['左侧','left'],right:['右侧','right']},toward=directions[side][language==='zh'?0:1];
  return {reply:location+' '+(language==='zh'?`从它的${toward}边缘到${blocker?blocker.zh:'整理架边缘'}有 ${mm} 毫米（${cm} 厘米）。这是表面间距；还要检查物品、夹爪和移动路径是否放得下。你想放哪件物品？`:`There is ${mm} mm (${cm} cm) from its ${toward} edge to ${blocker?`the ${blocker.name}`:'the shelf edge'}. That is surface space; I still need to check the item, gripper and path. What would you like to put there?`),actions:[]};
}
export async function askAgent(connection, {question,language,history,scene,feedback,captureScene}, signal, fetcher=fetch) {
  const config=connection?.server===true?{server:true}:connection?.hosted===true?{hosted:true}:validateConnection(connection);
  // Qualitative amounts are not measurements. Keep the task in conversation,
  // ask once, and let the next answer supply its missing parameter.
  const vagueAmount=/\b(?:nudge|slightly|a (?:little|tiny) (?:bit|amount)|a little|a bit|small (?:amount|step|distance))\b|稍微|挪一点|移动一点|挪一挪/iu.test(question);
  const measuredAmount=/(?:\d|\b(?:half|quarter|third|width|length|height|depth|centimet(?:re|er)|millimet(?:re|er)|cm|mm|same distance|as far)\b)|半|四分之一|厘米|毫米|一样远|宽度|长度/u.test(question);
  if(vagueAmount&&!measuredAmount)return {reply:language==='zh'?'你想移动多远？可以说几厘米，或物品宽度的几分之一。':'How far should I move it? You can use centimetres or a fraction of the object’s width.',actions:[]};
  const spatial=spatialReply(question,scene,language);if(spatial)return spatial;
  if((/^(?:how|why|what)\b|^(?:can|could) you (?:explain|tell)/iu.test(question.trim())&&/\b(?:plan|path|movement|work|collision|blocked)\b/iu.test(question))||/(?:怎么|如何).*(?:规划|路径|移动|运动)|为什么.*(?:碰|挡|路径)/u.test(question))return {reply:language==='zh'?'我先找一个放得下物品和夹爪的空位，再检查移动时会不会碰到其他东西。你指定哪一侧，我就保留哪一侧。需要你做选择时，我会问一个简单的问题。':'I look for an empty spot with room for the item and my gripper. Then I check a path that avoids the other things. If you name a side, I keep that side. When I need a choice, I’ll ask you.',actions:[]};
  // A confirmation cannot resolve an earlier either/or object question.
  const previous=history.filter(m=>m.role==='assistant').at(-1)?.content||'';
  if(/\b(?:from|on) this side\b|从这(?:一)?[侧边]/iu.test(question)&&!/(?:(?:from|approach|grip|pick).{0,25}(?:front|back|left|right|top))|(?:从.{0,8}(?:前|后|左|右|上))/iu.test(history.slice(-3).map(m=>m.content).join(' ')))return {reply:language==='zh'?'从前面还是从上面夹？':'From the front or the top?',actions:[]};
  if(/^(yes|yeah|yep|ok|okay|sure|是|是的|对|好的)[.!。！\s]*$/i.test(question.trim())&&/(?:did you mean|do you mean|which (?:one|object)|你是指|你指的是|哪一个|哪个)/i.test(previous)&&/(?:\bor\b|还是)/i.test(previous)){
    return {reply:(language==='zh'?'请说出你选择的物品名称；“好的”还不能告诉我是哪个。\n':'Which object do you mean? Please say its name; “yes” does not choose between those options.\n')+previous.slice(-1400),actions:[]};
  }
  const messages=[{role:'system',content:SYSTEM},...history.slice(-6).map(m=>({role:m.role,content:m.content.slice(0,1400)})),
    {role:'user',content:JSON.stringify({question,language,scene,feedback})}];
  let sceneImage=null;
  if((config.server||config.hosted)&&captureScene&&!visionUnavailable.has(connection)&&needsSceneImage(question))try{const captured=await captureScene();if(captured){const {frame,...image}=captured;sceneImage=image;if(frame)messages.at(-1).content=JSON.stringify({question,language,scene:{...scene,view:frame},feedback});}}catch{}
  const needsRelay=!config.server&&!config.hosted&&new URL(config.base).hostname.startsWith('token-plan.');
  for(let attempt=0;attempt<2;attempt++) {
  let response;
  try{response=await fetcher(config.server?'/api/chat':config.hosted||needsRelay?RELAY:config.base+'/chat/completions', {method:'POST',signal,
    headers:{'Content-Type':'application/json',...(!config.server&&!config.hosted?{'Authorization':'Bearer '+config.key}:{}),...(needsRelay?{'X-Alibaba-Base':config.base}:{})},
    body:JSON.stringify({model:config.model,messages,...(sceneImage?{scene_image:sceneImage}:{}),temperature:creativeMotion(question)?.6:.2,max_tokens:2000,response_format:{type:'json_object'},stream:false,enable_thinking:false})});}
  catch(error){if(attempt===0&&error instanceof TypeError&&!signal?.aborted)continue;throw error;}
  if(attempt===0&&[502,503,504].includes(response.status))continue;
  if(!response.ok){
    const detail=typeof response.json==='function'?await response.json().catch(()=>null):null;
    if(response.status===400&&['scene_required','request','content_type','body'].includes(detail?.error))throw Error('requestError');
    throw Error(({401:'auth',403:'auth',429:'quota',400:'model',404:'model'})[response.status]||'provider');
  }
  const data=await response.json();
  if(data.perception?.imageStatus==='unavailable'){visionUnavailable.add(connection);sceneImage=null;}
  const raw=data?.choices?.[0]?.message?.content;
  try { if(data?.choices?.[0]?.finish_reason==='length')throw Error('truncated');const parsed=movementIntent(pickupIntent(placementIntent(parseResponse(raw),question),question),question);return {...parsed,...(data.perception?.imageStatus?{imageStatus:data.perception.imageStatus}:{}),...(question==='connection_check'?{actions:[]}:{})}; } catch(error) {
    if(attempt===0) {
      messages.push({role:'assistant',content:typeof raw==='string'?raw.slice(0,2500):'Invalid response'},
        {role:'user',content:JSON.stringify({question,language,scene,feedback:{...feedback,responseRepair:`Your response ${error.message==='truncated'?'was cut off before completion':'did not match the allowed action schema'}. Return a complete compact JSON object for this original request using exactly the system-defined action types and parameters. Prefer transfer for named-object placement; each transfer picks up and releases the object. If unsupported, explain why and return actions:[], without claiming execution. Keep reply and after brief.`}})});
      continue;
    }
    if(['invalid','unknown','destination','angle'].includes(error.message)) throw Error(error.message);
    throw Error('response');
  }
  }
}
