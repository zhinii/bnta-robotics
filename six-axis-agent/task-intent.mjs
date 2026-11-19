import {referencedObjects} from './clarification.mjs?v=movement-20261119-1';

// A requested outcome is separate from a model's proposed sequence. In
// particular, releasing HERE and carrying OUTSIDE a surface are different jobs.
// Geometry selects the coordinates; students never need to supply X/Y.
export const OUTCOME_POLICY='A drop destination is an outcome, not just opening the gripper. Off a surface means carry the entire object beyond that surface before release. Drop here means release at the current gripper location. If an edge is unspecified choose a reachable clear edge; preserve an explicitly named edge. Never claim a landing location before the simulator checks it. taskGoal is a constraint inferred from the current request, not permission to move other objects. If it is ambiguous ask one short question and return no actions.';

export function taskGoal(question,scene,history=[]){
  // Questions about consequences are not requests to perform the action.
  if(/^\s*(?:what (?:would|will|happens)|how (?:does|would|do)|why|explain|如果|假如|为什么|会发生)/iu.test(question))return null;
  const verbs=[...question.matchAll(/\b(?:drop|release|let go|let .{0,25}fall)\b|扔|丢|掉下|松开/giu)];
  for(const verb of verbs){
    const before=question.slice(0,verb.index),clause=before.split(/[.!?;。！？；]|\b(?:but|instead)\b/iu).at(-1);
    if(/\b(?:not|never|don't|dont|do not|avoid|without)\b|不要|别|不能|不想/iu.test(clause))continue;
    const tail=question.slice(verb.index),spatial=/[\u3400-\u9fff]/u.test(verb[0])?clause+tail:tail,surface=/\b(?:shelf|organizer|organiser)\b|整理架|书架|搁板/iu.test(spatial)?'shelf':'desk';
    const outside=/\b(?:off|outside|beyond|over)\b.{0,45}\b(?:desk|table|shelf|organizer|organiser|edge)\b|\b(?:onto?|to) (?:the )?(?:floor|ground)\b|(?:桌|架).{0,15}(?:外|掉下)|(?:从|离开).{0,12}(?:桌|架)|(?:扔|丢|掉).{0,6}(?:下|出).{0,6}(?:桌|架)|(?:地上|地板)/iu.exec(spatial);
    if(!outside)continue;
    const edge=/\bfront\b|前沿|前边|前侧/iu.test(spatial)?'front':/\b(?:back|rear)\b|后沿|后边|后侧/iu.test(spatial)?'back':/\bleft\b|左/iu.test(spatial)?'left':/\bright\b|右/iu.test(spatial)?'right':'auto';
    let objects=referencedObjects(spatial.slice(0,outside.index),scene);
    if(!objects.length){
      const prefix=referencedObjects(before,scene);
      if(prefix.length===1)objects=prefix;
      else if(scene.held)objects=scene.objects.filter(o=>o.id===scene.held);
      else objects=referencedObjects(history.slice(-2).map(m=>m.content.split(/\n(?:Executed actions|Actual scene|Unexecuted request):/)[0]).join(' '),scene);
    }
    if(!objects.length)return null;
    return {kind:'outside-surface',surface,edge,objects:objects.map(o=>o.id)};
  }
  return null;
}

export function enforceTaskGoal(response,goal,scene,language='en'){
  // Respect a question/refusal. Never turn a no-action answer into movement.
  if(!goal||!response.actions.length)return response;
  const actions=response.actions.map(a=>({...a}));
  let held=scene.held;
  const releases=new Map();
  for(const [index,action] of actions.entries()){
    if(action.type==='pick')held=action.object;
    if(['transfer','place','drop','release'].includes(action.type)){
      const object=action.object||held;
      if(goal.objects.includes(object))releases.set(object,index);
      held=null;
    }
  }
  // A missing release or a different object is a contradictory proposal. Ask
  // for a repaired plan instead of executing the harmless-looking wrong task.
  if(goal.objects.some(id=>!releases.has(id)))throw Object.assign(Error('taskMismatch'),{detail:{goal,reason:'The proposal does not carry and release every requested object.'}});
  for(const [object,index] of releases){
    const {orientation,posture,approach}=actions[index];
    actions[index]={type:'drop',object,target:'current',clearOf:goal.surface,edge:goal.edge,...(orientation?{orientation}:{}),...(posture?{posture}:{}),...(approach?{approach}:{})};
  }
  const names=goal.objects.map(id=>{const o=scene.objects.find(o=>o.id===id);return language==='zh'?o.zh:o.name;}).join(language==='zh'?'和':' and ');
  const sides={front:['前','front'],back:['后','back'],left:['左','left'],right:['右','right']},side=sides[goal.edge]?.[language==='zh'?0:1];
  const surface=goal.surface==='desk'?(language==='zh'?'桌子':'desk'):(language==='zh'?'整理架':'shelf');
  const reply=language==='zh'?`我会把${names}移到${surface}${side?side+'边缘':'可到达的空边缘'}外，再松开夹爪。先看看预览。`:`I’ll carry the ${names} beyond ${side?'the '+side+' edge':'a reachable clear edge'} of the ${surface}, then let go. Check the preview first.`;
  return {...response,actions,reply,goal,after:undefined};
}

export function checkTaskOutcome(goal,result){
  if(!goal)return;
  const surface=goal.surface==='desk'?result.deskBounds:(()=>{const o=result.obstacles.find(o=>o.surface);return o&&{min:o.position.map((v,i)=>v-o.size[i]/2),max:o.position.map((v,i)=>v+o.size[i]/2)};})();
  if(!surface)throw Error('taskMismatch');
  const side={left:[0,-1],right:[0,1],front:[1,-1],back:[1,1]};
  for(const id of goal.objects){
    const object=result.objects.find(o=>o.id===id),b=object?.bounds;
    const clear=(axis,sign)=>sign<0?b.high[axis]<surface.min[axis]-.1:b.low[axis]>surface.max[axis]+.1;
    if(!b||result.held===id||!(goal.edge==='auto'?[0,1].some(i=>clear(i,-1)||clear(i,1)):clear(...side[goal.edge])))throw Object.assign(Error('taskMismatch'),{detail:{goal,object:id,reason:'The checked result still overlaps the requested surface or uses the wrong edge.'}});
  }
}

export function dropCompletion(actions,result,language='en',initialHeld=null){
  let held=initialHeld;const ids=new Set();
  for(const action of actions){if(action.type==='pick')held=action.object;if(['drop','release'].includes(action.type)){if(action.object||held)ids.add(action.object||held);held=null;}}
  if(!ids.size&&actions.some(a=>a.type==='release'))return null;
  return [...ids].map(id=>{
    const o=result.objects.find(o=>o.id===id);if(!o)return '';
    const support=[...result.objects,...result.obstacles].find(item=>item.id===o.support);
    const place=o.location==='floor'?(language==='zh'?'地板上':'the floor'):o.onShelf?(language==='zh'?'整理架上':'the shelf'):o.location==='desk'?(language==='zh'?'桌面上':'the desk'):support?(language==='zh'?support.zh+'上':'the '+support.name):null;
    return place?(language==='zh'?`${o.zh}已落在${place}。`:`The ${o.name} landed on ${place}.`):language==='zh'?`${o.zh}已松开；请查看场景中的落点。`:`I released the ${o.name}. Check its landing spot in the scene.`;
  }).filter(Boolean).join('\n')||null;
}
