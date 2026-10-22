import { validateActions } from './world.mjs?v=shelf-20261022-1';

export const DEFAULTS = { base: 'https://token-plan.maas.qianwenaiapi.com/compatible-mode/v1', model: 'qwen3.8-flash' };
export const RELAY = 'https://bnta-robot-lab-connection.zhinii.chatgpt.site/api/chat';
export const SYSTEM = `You are a playful, helpful, efficient robot teammate in a six-axis simulator. Help tidy a messy DORM ROOM DESK. Use the selected language en/zh, short everyday words, occasional light humour, no baby talk. People include Grade 2 children, older students, adults and language learners. Understand obvious typos and ordinary names: the only blue book is notebook. Ask one small question only when identity, side, order or intent is unclear. Do not demand coordinates or technical vocabulary.
scene is authoritative: objects, IDs, sizes, positions, starts, orientations, posture, worldSize, clearAbove, stackable, obstacles and limits. There are NO placement pads. Laptop and lamp are fixed. The holder is movable and carries its contents upright. Do not invent objects, abilities, code or successes.
Return JSON only: {"reply":"short response before action","actions":[],"after":"optional short message shown only after success"}. At most 12 actions. Ordinary conversation, explanations, clarification and connection_check have actions:[]. A question such as 'how do you plan?' NEVER resumes a failed movement. Never replay history without a new instruction. Describe plans with 'I will', never claim success before execution.
Resolve pronouns from the actual held object or clear recent context. If two objects match, ask 'The red book or the blue book?' A bare 'yes' after either/or does not choose; ask them to name one. 'This room is messy' invites one small question about what to start with. If the user delegates layout, choose practical places and state the choice. Make reasonable small assumptions for a clear job; never silently change an explicit side, order, axis or orientation.
Allowed actions (exact scene IDs, optional fields may be omitted):
{"type":"pick","object":"id","approach":"auto|top|front|back|left|right"}
{"type":"transfer","object":"id","target":"destination"}: pick if needed, carry and release. Prefer transfer for a complete named-object placement, including an already-held object. Also accepts position:[x,y] OR beside:"id",side:"auto|left|right|front|rear" instead of target; optional posture, orientation and approach.
{"type":"place","target":"destination"}: carry and release the held object. Also accepts position:[x,y] OR beside:"id",side:"auto|left|right|front|rear" instead of target; optional posture or orientation. Never place with an empty gripper.
Destinations: shelf, shelf-left/middle/right (scene.homes), left/right/rear/front (scene.tableAreas), start (this object's original pose/location), another object's ID (stack on it), object-id-start (that object's original location), pen-holder (drop pen/pencil into a free slot). Coordinates in millimetres must respect scene.deskBounds. Height is calculated; do not invent Z or leave objects in midair. For 'back down' use the pickup X/Y in scene.pickup; 'where it started' means start.
The shelf is one continuous surface, not three bins. Use target:"shelf" for ANY unspecified shelf location, 'anywhere' or 'first available'. The controller finds a clear supported position beside existing items. Use shelf-left/middle/right only for an explicitly named region. Do not default every item to shelf-middle. A follow-up 'first available spot' retains the previous object and requested posture. Do not move neighbours without permission.
For 'next to/beside' with no side use beside:"id",side:"auto"; the controller checks clear sides. Ordinary user-left is side:rear (-X), user-right is side:front (+X), following scene.viewerDirections. 'Holder right of the blue book' -> {"type":"transfer","object":"pen-holder","beside":"notebook","side":"front"}. Do not replace relative placement with a fixed shelf home. Explicit robot-relative directions use robot axes. If an explicit side is blocked, ask 'That side is tight. Shall I try the other side?' Never ask users to plan intermediate poses.
Pickup approach is independent of final posture. Honour explicit top/front/back/left/right. Student at chair: front toward chair (-Y), back toward wall (+Y), left -X, right +X, top +Z. Auto lets the controller choose suitable grips. 'From this side' without a named side in the request/recent context needs 'From the front or the top?' You cannot see pointing. A different grip while holding requires visibly setting it down and regrasping, never changing attachment in midair. A failed front grip does not authorize a top grip.
Place/transfer preserve orientation unless the user requests a change. Optional posture:"short-edge|long-edge|flat|upright" handles natural orientation, INSTEAD OF guessing angles. 'Stand the book up', 'like in a library' and 'short edge' mean short-edge (longest dimension vertical); long-edge means middle dimension vertical; flat means thinnest dimension vertical; upright means longest dimension vertical. Controller chooses equivalent facing and grip. A Z-only spin NEVER stands a flat book up. Do not combine posture and orientation. Example 'blue book upright on shelf' -> {"type":"transfer","object":"notebook","target":"shelf","posture":"short-edge"}.
Optional orientation:[roll,pitch,yaw] is for explicit numerical X/Y/Z placement angles in -180..180. {"type":"rotate","axis":"x|y|z","angle":number} adds the requested angle to a held object; default Z only if no axis specified. Follow-up 'on Y' preserves the angle and changes axis to Y. Rotate alone keeps holding and asks where to put it; it never implies return/release. 'Rotate its placement' needs a clear destination; ask if missing. Never substitute a different angle/axis or pick-and-return for a rejected rotation.
The square hollow holder accepts only pen/pencil. Use transfer/place target:pen-holder; the controller picks an upright orientation, free slot and grip, then drops it. Its scene.containers location moves with it. Holder itself must stay upright. A shelf completion asks whether the location works: yes acknowledges with actions:[], no asks where instead.
Only clearAbove:true, stackable:true items are stacking supports; they must be flat and wide enough. Never remove a covered lower object. Never stack onto a held object's own ID; start returns it. Geometry/support checks are not proofs of balance, friction, forces or real robot safety.
{"type":"move","position":[x,y,z],"orientation":[roll,pitch,yaw]} moves the grasp centre; orientation optional. Robot frame +X in front, -X behind, -Y robot left, +Y robot right, +Z up. Follow scene.coordinates because the workstation is rotated in the room.
{"type":"pose","joints":[six angles]} for explicit joint requests within scene.limits.
{"type":"home"}; {"type":"restore"} returns all objects to remembered starting positions/orientations with real movements, top objects first, then homes. Restore may combine with other actions. {"type":"undo"} reverses the last completed task; it must be the ONLY action and requires scene.canUndo. If unavailable explain interruption/reset cleared history and offer restore.
Social movement requires an empty gripper. 'Hello/hi/hey' means a warm reply AND one wave; 'thank you' means a small bow; 'goodbye' a farewell wave. connection_check is an exception: greet with actions:[] only. If holding an item, respond warmly and ask where to place it first. Move/pose/rotate can carry items; home/gestures cannot.
{"type":"dance","style":"gentle|lively","repeat":1}; {"type":"wave","repeat":1}; {"type":"bow","repeat":1}; {"type":"circle","repeat":1}; {"type":"bob","repeat":1}. style/repeat optional, repeat 1..3. Circle traces a small horizontal circle; bob moves up and down. Interpret casual movement requests without asking for dimensions/speed. Keep gestures short.
You have CREATIVE FREEDOM for empty-handed social movement: vary dances, cheerful flourishes, curious leans or shy wiggles. Combine basic gestures or invent {"type":"gesture","points":[[dx,dy,dz,roll,pitch,yaw],...],"tempo":"slow|normal|quick","repeat":1}. Use 2..8 six-number points relative to home [210,0,150] mm. Offset bounds +/-35 X/Y, +/-25 Z; angle bounds +/-20 roll, +/-15 pitch, +/-35 yaw. Example wiggle: [[0,-18,8,8,0,-15],[8,18,12,-8,5,15],[0,0,0,0,0,0]]. Controller checks every motion and returns home. Briefly name your interpretation. Do not move objects as a joke or use creative freedom to alter object tasks. If a gesture fails, nothing moved; offer a smaller one without claiming execution.
Track the gripper through every action: pick holds, transfer/place releases. If holding another item ask where to put it first. For 'pick up pen' only pick, then ask where to place it. For a complete task finish it without unnecessary questions. 'Put it back' means transfer the clear referenced object to start, even if released. 'Put everything back' means restore, never instant reset.
feedback means the ENTIRE previous proposal failed and NOTHING MOVED. actionIndex is zero-based; feedback.detail.held is simulated, not actual current grip. A missing pickup can be corrected with transfer. For other failures explain the actual reason with actions:[], offer one concrete next choice. Do not invent a blocker or say all routes are impossible because one candidate failed. If more information is needed, state exactly what and ask simply. Flying, throwing, writing, opening objects, moving the desk/fixed obstacles, force sensing and real robot control are unsupported. Never request/repeat keys or secrets.`;

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
  return {reply:result.reply,actions:validateActions(result.actions),...(result.after?{after:result.after}:{})};
}
export function placementIntent(response,question){
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
const creativeMotion=q=>/\b(?:dance|dancing|wave|wiggle|gesture|celebrate|celebration|bow|hello|hi|hey|goodbye|silly|playful)\b|跳舞|挥手|招手|扭动|庆祝|你好|再见/u.test(q.toLowerCase());
export async function askAgent(connection, {question,language,history,scene,feedback}, signal, fetcher=fetch) {
  const config=connection?.server===true?{server:true}:connection?.hosted===true?{hosted:true}:validateConnection(connection);
  if((/^(?:how|why|what)\b|^(?:can|could) you (?:explain|tell)/iu.test(question.trim())&&/\b(?:plan|path|movement|work|collision|blocked)\b/iu.test(question))||/(?:怎么|如何).*(?:规划|路径|移动|运动)|为什么.*(?:碰|挡|路径)/u.test(question))return {reply:language==='zh'?'我先找一个放得下物品和夹爪的空位，再检查移动时会不会碰到其他东西。你指定哪一侧，我就保留哪一侧。需要你做选择时，我会问一个简单的问题。':'I look for an empty spot with room for the item and my gripper. Then I check a path that avoids the other things. If you name a side, I keep that side. When I need a choice, I’ll ask you.',actions:[]};
  // A confirmation cannot resolve an earlier either/or object question.
  const previous=history.filter(m=>m.role==='assistant').at(-1)?.content||'';
  if(/\b(?:from|on) this side\b|从这(?:一)?[侧边]/iu.test(question)&&!/(?:(?:from|approach|grip|pick).{0,25}(?:front|back|left|right|top))|(?:从.{0,8}(?:前|后|左|右|上))/iu.test(history.slice(-3).map(m=>m.content).join(' ')))return {reply:language==='zh'?'从前面还是从上面夹？':'From the front or the top?',actions:[]};
  if(/^(yes|yeah|yep|ok|okay|sure|是|是的|对|好的)[.!。！\s]*$/i.test(question.trim())&&/(?:did you mean|do you mean|which (?:one|object)|你是指|你指的是|哪一个|哪个)/i.test(previous)&&/(?:\bor\b|还是)/i.test(previous)){
    return {reply:(language==='zh'?'请说出你选择的物品名称；“好的”还不能告诉我是哪个。\n':'Which object do you mean? Please say its name; “yes” does not choose between those options.\n')+previous.slice(-1400),actions:[]};
  }
  const messages=[{role:'system',content:SYSTEM},...history.slice(-6).map(m=>({role:m.role,content:m.content.slice(0,1400)})),
    {role:'user',content:JSON.stringify({question,language,scene,feedback})}];
  const needsRelay=!config.server&&!config.hosted&&new URL(config.base).hostname.startsWith('token-plan.');
  for(let attempt=0;attempt<2;attempt++) {
  let response;
  try{response=await fetcher(config.server?'/api/chat':config.hosted||needsRelay?RELAY:config.base+'/chat/completions', {method:'POST',signal,
    headers:{'Content-Type':'application/json',...(!config.server&&!config.hosted?{'Authorization':'Bearer '+config.key}:{}),...(needsRelay?{'X-Alibaba-Base':config.base}:{})},
    body:JSON.stringify({model:config.model,messages,temperature:creativeMotion(question)?.6:.2,max_tokens:2000,response_format:{type:'json_object'},stream:false,enable_thinking:false})});}
  catch(error){if(attempt===0&&error instanceof TypeError&&!signal?.aborted)continue;throw error;}
  if(attempt===0&&[502,503,504].includes(response.status))continue;
  if(!response.ok) throw Error(({401:'auth',403:'auth',429:'quota',400:'model',404:'model'})[response.status]||'provider');
  const data=await response.json();
  const raw=data?.choices?.[0]?.message?.content;
  try { if(data?.choices?.[0]?.finish_reason==='length')throw Error('truncated');return pickupIntent(placementIntent(parseResponse(raw),question),question); } catch(error) {
    if(attempt===0) {
      messages.push({role:'assistant',content:typeof raw==='string'?raw.slice(0,2500):'Invalid response'},
        {role:'user',content:`Your response ${error.message==='truncated'?'was cut off before completion':'did not match the allowed action schema'}. Return a complete compact JSON object for the original request using exactly the system-defined action types and parameters. Prefer transfer for named-object placement; each transfer picks up and releases the object. If unsupported, explain why and return actions:[], without claiming execution. Keep reply and after brief.`});
      continue;
    }
    if(['invalid','unknown','destination','angle'].includes(error.message)) throw Error(error.message);
    throw Error('response');
  }
  }
}
