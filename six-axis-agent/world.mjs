import { homeFor, ikTool, toolPose, valid, distance, transform, rotationFromEuler, JOINTS } from './kinematics.mjs?v=dorm-20261021-4';

export const AREAS={left:[170,-230],right:[170,230],rear:[-280,0],front:[280,0]};
export const HOME=[210,0,150];
export const BLOCKS=['red','blue','yellow'];
// Robot-local coordinates: the mount is near the short edge, facing across the desk.
export const DESK={min:[-60,-215],max:[560,215]};
export const ORGANIZER={id:'organizer',name:'low organizer shelf',zh:'矮整理架',position:[230,160,14],size:[220,100,28],surface:true,fixed:true};
export const HOMES={
  'shelf-left':{name:'left shelf space',zh:'整理架左侧',position:[145,160,28]},
  'shelf-middle':{name:'middle shelf space',zh:'整理架中间',position:[195,160,28]},
  'shelf-right':{name:'right shelf space',zh:'整理架右侧',position:[245,160,28]},
};
export const CATALOG={
  book:{name:'red book',zh:'红色书本',size:[36,58,18],color:'#c85b4e',stackable:true},
  eraser:{name:'blue eraser',zh:'蓝色橡皮',size:[30,42,20],color:'#638fae',stackable:true},
  glue:{name:'yellow glue stick',zh:'黄色固体胶',size:[24,24,46],color:'#d9b84c',stackable:false},
  pencilcase:{name:'green pencil case',zh:'绿色笔袋',size:[34,60,30],color:'#71917a',stackable:true},
  ruler:{name:'wooden ruler',zh:'木尺',size:[18,90,16],color:'#c8a475',stackable:false},
  notebook:{name:'blue notebook',zh:'蓝色笔记本',size:[38,60,20],color:'#5c84a0',stackable:true},
  pen:{name:'blue pen',zh:'蓝色钢笔',size:[14,82,16],color:'#386a96',stackable:false},
  pencil:{name:'yellow pencil',zh:'黄色铅笔',size:[14,88,16],color:'#d6a547',stackable:false},
  clock:{name:'alarm clock',zh:'闹钟',size:[34,30,46],color:'#ce7e67',stackable:false},
  red:{name:'red block',zh:'红色方块',size:[36,36,36],color:'#ce6450',stackable:true},
  blue:{name:'blue block',zh:'蓝色方块',size:[36,36,36],color:'#628ca9',stackable:true},
  yellow:{name:'yellow block',zh:'黄色方块',size:[36,36,36],color:'#dab65b',stackable:true},
};
const rad=Math.PI/180;
const footprint=(object,rpy=object.rpy||[0,0,object.yaw])=>{const r=rotationFromEuler(Array.isArray(rpy)?rpy:[0,0,rpy]);return [0,1,2].map(i=>object.size.reduce((sum,v,j)=>sum+Math.abs(r[i*3+j])*v,0));};
export function initialState(seed=0,kit='school') {
  let n=seed>>>0;
  const random=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};
  const ids=kit==='blocks'?BLOCKS:kit==='desk'?['book','notebook','pen','pencil','clock','eraser','pencilcase']:['book','eraser','glue','pencilcase','ruler'];
  const positions=[-25,150,-150,70,-75].map(a=>{const angle=(a+(seed?(random()-.5)*12:0))*rad,r=seed?250+random()*15:260;return [Math.round(r*Math.cos(angle)),Math.round(r*Math.sin(angle))];});
  const solved=ikTool(HOME,homeFor(6),'nearest',[0,0,0]);if(!solved.q)throw Error('home');
  const deskPositions=[[170,-160],[245,-160],[75,-165],[70,95],[135,0],[95,-70],[145,75]];
  const placed=kit==='desk'?deskPositions.map(p=>p.map(v=>v+(seed?Math.round((random()-.5)*16):0))):positions;
  return {q:solved.q,held:null,yaw:0,rpy:[0,0,0],seed,kit,objects:ids.map((id,i)=>({id,...structuredClone(CATALOG[id]),position:[...placed[i],CATALOG[id].size[2]/2],origin:[...placed[i],CATALOG[id].size[2]/2],yaw:0,rpy:[0,0,0]})),
    homes:kit==='desk'?structuredClone(HOMES):{},
    obstacles:kit==='desk'?[structuredClone(ORGANIZER),{id:'laptop',name:'laptop',zh:'笔记本电脑',position:[250,-35,50],size:[125,125,100],fixed:true},{id:'lamp',name:'desk lamp',zh:'台灯',position:[480,150,90],size:[60,60,180],fixed:true},{id:'wall',name:'dorm room wall',zh:'宿舍墙壁',position:[250,225,-10],size:[1200,20,760],fixed:true}]:[{id:'tall divider',position:[70+(seed?Math.round(random()*20):0),135,55],size:[48,48,110]},{id:'low divider',position:[-60,-160,35],size:[65,40,70]}]};
}
export function blocksAbove(state,id) {
  const support=state.objects.find(o=>o.id===id);
  return state.objects.filter(o=>o.id!==id&&o.id!==state.held&&[0,1].every(i=>Math.abs(o.position[i]-support.position[i])<(footprint(o)[i]+footprint(support)[i])/2-1)&&o.position[2]>support.position[2]+1);
}
export function snapshot(s) {
  return {joints:s.q.map(n=>+n.toFixed(2)),tool:toolPose(s.q).tip.map(n=>+n.toFixed(1)),orientation:[...(s.rpy||[0,0,s.yaw])],held:s.held,yaw:s.yaw,
    objects:s.objects.map(o=>({...structuredClone(o),clearAbove:blocksAbove(s,o.id).length===0})),obstacles:structuredClone(s.obstacles||[]),homes:structuredClone(s.homes||{}),tableAreas:s.kit==='desk'?Object.fromEntries(Object.entries(AREAS).filter(([,p])=>p.every((v,i)=>v>=DESK.min[i]&&v<=DESK.max[i]))):AREAS,
    context:s.kit==='desk'?'A messy desk in an ordinary student dorm room. The robot is clamped to one short side of the desk, facing across it, not mounted in its centre. The movable items and organizer are in front of the mount within its working area. The user decides where items belong and their order, including stacks or side-by-side arrangements on the low organizer. Shelf spaces are optional homes, not assigned categories. The bed, room, laptop, lamp and organizer are fixed.':'A tabletop practice scene.',
    ...(s.kit==='desk'?{deskBounds:DESK,robotMount:[0,0,0],viewerDirections:{left:'rear',right:'front',towardChair:'left',towardWall:'right'},layout:'The robot is on the short edge. The laptop is centred facing the chair. The low shelf runs along the wall-side long edge; shelf left-to-right follows increasing robot-local X.'}:{}),
    capabilities:['pick uncovered school objects','place on clear desk or organizer space, beside objects, at starts, or stack on flat objects','rotate held objects around X, Y or Z, preserving orientation when placed','restore starting positions and orientations','undo completed tasks','move and orient the tool','dance, wave, bow, circle or move up and down','home'],
    coordinates:'Robot-local mm and degrees; +X front of robot, -X behind robot, -Y robot left, +Y robot right, +Z up; position is gripper grasp centre. The whole dorm workstation is turned 90 degrees in the room and the +Y desk edge meets the wall.',limits:{position:[[-340,340],[-340,340],[8,330]],jointDegrees:JOINTS.map(j=>j.limits)},units:'mm/degrees'};
}
function segmentBox(a,b,box,padding=0) {
  let lo=0,hi=1;
  for(let i=0;i<3;i++){const min=box.position[i]-box.size[i]/2-padding,max=box.position[i]+box.size[i]/2+padding,d=b[i]-a[i];if(Math.abs(d)<1e-8){if(a[i]<min||a[i]>max)return false;}else{let x=(min-a[i])/d,y=(max-a[i])/d;if(x>y)[x,y]=[y,x];lo=Math.max(lo,x);hi=Math.min(hi,y);if(lo>hi)return false;}}
  return true;
}
function corners(tip,rotation,held) {
  const points=[];
  for(const x of [-35,35])for(const y of [-17,17])for(const z of [-7,41])points.push(transform(rotation,[x,y,z]).map((v,i)=>v+tip[i]));
  if(held)for(const x of [-held.size[0]/2,held.size[0]/2])for(const y of [-held.size[1]/2,held.size[1]/2])for(const z of [-held.size[2]/2,held.size[2]/2])points.push(transform(rotation,[x,y,z]).map((v,i)=>v+tip[i]));
  return points;
}
export function clearPose(q,state,contact=null,detail={}) {
  const blocked=(reason,blocker)=>{Object.assign(detail,{reason,blocker});return false;};
  if(!valid(q))return blocked('joint or table clearance limit');
  const pose=toolPose(q),tip=pose.tip,held=state.objects.find(o=>o.id===state.held),vertices=corners(tip,pose.rotation,held);
  if(vertices.some(p=>p[2]<-.3||Math.hypot(p[0],p[1])>400))return blocked('the gripper or held object would cross the tabletop or working envelope','table');
  if(Math.hypot(tip[0],tip[1])<85&&tip[2]<145)return blocked('the tool would enter the robot base','robot base');
  const bounds={position:[0,1,2].map(i=>(Math.min(...vertices.map(p=>p[i]))+Math.max(...vertices.map(p=>p[i])))/2),size:[0,1,2].map(i=>Math.max(...vertices.map(p=>p[i]))-Math.min(...vertices.map(p=>p[i])))};
  for(const obstacle of state.obstacles||[]){
    for(let i=1;i<pose.points.length;i++)if(segmentBox(pose.points[i-1],pose.points[i],obstacle,[20,17,13,11,10][i-1]+3))return blocked('an arm link would hit this obstacle',obstacle.id);
    const restingAboveSurface=obstacle.surface&&bounds.position[2]-bounds.size[2]/2>=obstacle.position[2]+obstacle.size[2]/2-.3;
    if(!restingAboveSurface&&[0,1,2].every(i=>Math.abs(bounds.position[i]-obstacle.position[i])<(bounds.size[i]+obstacle.size[i])/2+3))return blocked('the gripper or held object would hit this obstacle',obstacle.id);
  }
  for(const block of state.objects){
    if(block.id===state.held)continue;
    const envelope={position:block.position,size:footprint(block)};
    for(let i=1;i<pose.points.length;i++)if(segmentBox(pose.points[i-1],pose.points[i],envelope,[20,17,13,11,10][i-1]+2))return blocked('an arm link would hit this object',block.id);
    const aboveTop=tip[2]-block.position[2]>=(held?(footprint(held,pose.rpy)[2]+footprint(block)[2])/2-.3:footprint(block)[2]/2+8.5);
    if(block.id!==contact&&!aboveTop&&[0,1,2].every(i=>Math.abs(bounds.position[i]-envelope.position[i])<(bounds.size[i]+envelope.size[i])/2+3))return blocked('the tool or carried object would collide with this object',block.id);
  }
  return true;
}
const vector=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite);
export function validateActions(actions) {
  if(!Array.isArray(actions)||actions.length>12)throw Error('invalid');
  const schema={pick:['type','object'],transfer:['type','object','target','position','beside','side','orientation'],place:['type','target','position','beside','side','orientation'],rotate:['type','angle','axis'],move:['type','position','orientation'],pose:['type','joints'],home:['type'],dance:['type','style','repeat'],wave:['type','repeat'],bow:['type','repeat'],circle:['type','repeat'],bob:['type','repeat'],restore:['type'],undo:['type']};
  return actions.map(a=>{
    if(!a||typeof a!=='object'||Array.isArray(a)||!Object.hasOwn(schema,a.type)||Object.keys(a).some(k=>!schema[a.type].includes(k)))throw Error('invalid');
    if(['pick','transfer'].includes(a.type)&&!Object.hasOwn(CATALOG,a.object))throw Error('unknown');
    if(['place','transfer'].includes(a.type)){
      if(['target','position','beside'].filter(k=>k in a).length!==1)throw Error('destination');
      if('target'in a&&!Object.hasOwn(AREAS,a.target)&&!Object.hasOwn(HOMES,a.target)&&!Object.hasOwn(CATALOG,a.target)&&a.target!=='start'&&!Object.keys(CATALOG).some(c=>a.target===c+'-start'))throw Error('destination');
      if('position'in a&&(!Array.isArray(a.position)||a.position.length!==2||!a.position.every(Number.isFinite)||Math.hypot(...a.position)>330))throw Error('destination');
      if('beside'in a&&(!Object.hasOwn(CATALOG,a.beside)||!['left','right','front','rear'].includes(a.side)))throw Error('destination');
      if('side'in a&&!('beside'in a))throw Error('destination');
    }
    if(a.type==='rotate'&&(!Number.isFinite(a.angle)||Math.abs(a.angle)>180))throw Error('angle');
    if('axis'in a&&!['x','y','z'].includes(a.axis))throw Error('angle');
    if(a.type==='move'&&(!vector(a.position)||Math.hypot(...a.position.slice(0,2))>340||a.position[2]<8||a.position[2]>330))throw Error('reach');
    if('orientation'in a&&(!vector(a.orientation)||a.orientation.some(v=>Math.abs(v)>180)))throw Error('angle');
    if(a.type==='pose'&&(!Array.isArray(a.joints)||a.joints.length!==6||!valid(a.joints)))throw Error('reach');
    if('repeat'in a&&(!Number.isInteger(a.repeat)||a.repeat<1||a.repeat>3))throw Error('invalid');
    if('style'in a&&!['gentle','lively'].includes(a.style))throw Error('invalid');
    return structuredClone(a);
  });
}
export function planActions(state,actions) {
  validateActions(actions);
  const s=structuredClone(state),steps=[];
  function joints(q,rpy,seconds,contact=null){
    const count=Math.max(2,Math.ceil(Math.max(...q.map((v,i)=>Math.abs(v-s.q[i])))/.5));
    for(let i=1;i<=count;i++){const sample=s.q.map((v,j)=>v+(q[j]-v)*i/count),detail={tip:toolPose(sample).tip,contact};if(!clearPose(sample,s,contact,detail))throw Object.assign(Error('blocked'),{detail});}
    const step={type:'move',q:[...q],rpy:[...rpy],yaw:rpy[2],seconds};applyStep(s,step);steps.push(step);
    if(steps.length>4000)throw Error('invalid');
  }
  function move(point,rpy=s.rpy||[0,0,s.yaw],contact=null){
    const start=toolPose(s.q).tip,orientation=s.rpy||[0,0,s.yaw];
    const count=Math.max(1,Math.ceil(distance(start,point)/9),Math.ceil(Math.max(...rpy.map((v,i)=>Math.abs(v-orientation[i])))/5));
    for(let i=1;i<=count;i++){
      const target=start.map((v,j)=>v+(point[j]-v)*i/count),next=orientation.map((v,j)=>v+(rpy[j]-v)*i/count),result=ikTool(target,s.q,'nearest',next);
      if(!result.q)throw Object.assign(Error('reach'),{detail:{target,orientation:next,requestedPosition:point,requestedOrientation:rpy,solver:result.error}});
      const seconds=Math.max(.035,distance(toolPose(s.q).tip,toolPose(result.q).tip)/160,Math.max(...result.q.map((v,j)=>Math.abs(v-s.q[j])))/90);
      joints(result.q,next,seconds,contact);
    }
  }
  function cruiseTo(point,orientation=0,contact=null){
    const desired=Array.isArray(orientation)?orientation:[0,0,orientation];
    const saved=structuredClone(s),length=steps.length,current=toolPose(s.q).tip;
    const load=s.objects.find(o=>o.id===s.held),under=load?Math.max(footprint(load)[2],footprint(load,desired)[2])/2:8;
    const clearance=Math.max(145,...s.objects.filter(o=>o.id!==s.held).map(o=>o.position[2]+footprint(o)[2]/2+under+12),...(s.obstacles||[]).filter(o=>!o.fixed||o.surface).map(o=>o.position[2]+o.size[2]/2+under+12));
    const startingContact=!s.held?s.objects.find(o=>distance(o.position,current)<25)?.id:null;
    let failure;const attempts=[];
    // Try a direct elevated transfer, then routes around the base in both directions.
    for(const orientFirst of [true,false].slice(desired.some((v,i)=>Math.abs(v-saved.rpy[i])>.1)?0:1))for(const route of ['direct','short','long'])for(const level of [clearance,Math.max(clearance,160)]){
      Object.assign(s,structuredClone(saved));steps.length=length;
      try{
        if(orientFirst)move(current,desired,startingContact||contact);
        move([current[0],current[1],Math.max(level,current[2])],s.rpy,startingContact||contact);
        if(!orientFirst)move(toolPose(s.q).tip,desired);
        if(route==='direct')move([point[0],point[1],level],desired);
        else{
          const a=Math.atan2(current[1],current[0]),b=Math.atan2(point[1],point[0]);let delta=((b-a+3*Math.PI)%(2*Math.PI))-Math.PI;
          if(route==='long')delta+=delta>0?-2*Math.PI:2*Math.PI;
          const radius=Math.max(225,Math.hypot(...current.slice(0,2)),Math.hypot(...point.slice(0,2))),count=Math.ceil(Math.abs(delta)/.12);
          move([radius*Math.cos(a),radius*Math.sin(a),level],desired);
          for(let i=1;i<=count;i++)move([radius*Math.cos(a+delta*i/count),radius*Math.sin(a+delta*i/count),level],desired);
          move([point[0],point[1],level],desired);
        }
        move(point,desired,contact);return;
      }catch(error){failure=error;attempts.push({route,level,error:error.message,detail:error.detail});}
    }
    Object.assign(s,saved);steps.length=length;failure.attempts=attempts;throw failure;
  }
  function pick(id){
    if(s.held)throw Error('holding');const block=s.objects.find(o=>o.id===id);if(!block)throw Object.assign(Error('unknown'),{detail:{object:id}});if(blocksAbove(s,id).length)throw Object.assign(Error('covered'),{detail:{object:id,blocker:blocksAbove(s,id).at(-1).id}});
    cruiseTo(block.position,block.rpy||[0,0,block.yaw],id);const step={type:'grip',object:id};applyStep(s,step);steps.push(step);
    move([block.position[0],block.position[1],Math.max(140,block.position[2]+45)]);
  }
  function place(action){
    if(!s.held)throw Error('empty');if(action.target===s.held)throw Error('selfStack');
    const support=s.objects.find(o=>o.id===action.target),held=s.objects.find(o=>o.id===s.held);
    const rpy=action.orientation||s.rpy||[0,0,s.yaw],heldSize=footprint(held,rpy);
    if(support&&blocksAbove(s,support.id).length)throw Error('covered');
    const start=action.target==='start'?held:s.objects.find(o=>action.target===o.id+'-start');
    if(support&&(!support.stackable||heldSize[0]>footprint(support)[0]*1.35||heldSize[1]>footprint(support)[1]*1.35))throw Object.assign(Error('unstable'),{detail:{object:held.id,support:support.id,reason:'the support is not flat or wide enough for stable stacking'}});
    const anchor=s.objects.find(o=>o.id===action.beside);
    const home=s.homes?.[action.target];
    let xy=action.position||home?.position.slice(0,2)||AREAS[action.target];
    if(action.beside){if(!anchor||anchor.id===s.held)throw Error('destination');const axis=['left','right'].includes(action.side)?1:0,sign=['left','rear'].includes(action.side)?-1:1;xy=anchor.position.slice(0,2);xy[axis]+=sign*((heldSize[axis]+footprint(anchor)[axis])/2+35);}
    const surface=xy&&(s.obstacles||[]).find(o=>o.surface&&[0,1].every(i=>Math.abs(xy[i]-o.position[i])<(o.size[i]+heldSize[i])/2));
    if(surface&&![0,1].every(i=>Math.abs(xy[i]-surface.position[i])+heldSize[i]/2<=surface.size[i]/2-2))throw Object.assign(Error('destination'),{detail:{reason:'the object would overhang the organizer shelf; choose a different shelf space or place it beside the other object in another direction'}});
    if(anchor&&anchor.position[2]-footprint(anchor)[2]/2>1&&!surface)throw Object.assign(Error('destination'),{detail:{reason:'there is not enough shelf space on that side; choose another direction or a clear shelf space'}});
    const point=start?[...start.origin.slice(0,2),heldSize[2]/2]:(support?[support.position[0],support.position[1],support.position[2]+(footprint(support)[2]+heldSize[2])/2]:xy?[...xy,(surface?surface.position[2]+surface.size[2]/2:0)+heldSize[2]/2]:null);
    if(!point)throw Error('destination');
    if(s.kit==='desk'&&[0,1].some(i=>point[i]-heldSize[i]/2<DESK.min[i]+2||point[i]+heldSize[i]/2>DESK.max[i]-2))throw Object.assign(Error('destination'),{detail:{reason:'the item would extend beyond the desk edge; choose a position on the desk or organizer'}});
    if(s.objects.some(o=>o.id!==s.held&&o.id!==support?.id&&[0,1,2].every(i=>Math.abs(o.position[i]-point[i])<(footprint(o)[i]+heldSize[i])/2+(i===2?-.3:8))))throw Error('occupied');
    cruiseTo(point,rpy);
    const released=s.held,step={type:'release',position:[...point]};applyStep(s,step);steps.push(step);
    move([point[0],point[1],Math.max(140,point[2]+45)],rpy,released);
  }
  function restore(){
    const free=(p,b=s.objects.find(o=>o.id===s.held))=>!s.objects.some(o=>o.id!==b.id&&[0,1,2].every(i=>Math.abs(o.position[i]-p[i])<(footprint(o)[i]+b.size[i])/2+(i===2?-.3:8)));
    const buffer=()=>{
      const held=s.objects.find(o=>o.id===s.held),saved=structuredClone(s),length=steps.length;
      for(const target of [...Object.keys(s.homes||{}),...Object.keys(AREAS)]){
        const home=s.homes?.[target],point=home?[...home.position.slice(0,2),home.position[2]+held.size[2]/2]:[...AREAS[target],held.size[2]/2];
        if(!free(point))continue;
        try{place({target,orientation:[0,0,0]});return;}catch{Object.assign(s,structuredClone(saved));steps.length=length;}
      }
      throw Error('occupied');
    };
    for(let i=0;i<20;i++){
      if(s.held){const b=s.objects.find(o=>o.id===s.held);if(free(b.origin))place({target:'start',orientation:[0,0,0]});else buffer();}
      const remaining=s.objects.filter(o=>distance(o.position,o.origin)>.2||o.rpy.some(v=>Math.abs(v)>.1));
      if(!remaining.length){cruiseTo(HOME,0);return;}
      const available=remaining.filter(o=>!blocksAbove(s,o.id).length).sort((a,b)=>b.position[2]-a.position[2]);
      const ready=available.find(o=>free(o.origin,o));
      if(ready){pick(ready.id);place({target:'start',orientation:[0,0,0]});}else if(available.length){pick(available[0].id);buffer();}else throw Error('covered');
    }
    throw Error('blocked');
  }
  function rotate(action){
    if(!s.held)throw Error('empty');
    const saved=structuredClone(s),length=steps.length,p=toolPose(s.q).tip;
    const axis=action.axis||'z',rpy=[...s.rpy];rpy[{x:0,y:1,z:2}[axis]]+=action.angle;
    if(Math.abs(rpy[{x:0,y:1,z:2}[axis]])>180)throw Error('angle');
    let failure;
    // Turning is allowed to reposition the held item, but never changes the requested angle.
    for(const point of [[p[0],p[1],Math.max(p[2],140)],[150,0,120],[120,0,90],[190,0,90],[-210,0,150],[210,0,160]]){
      Object.assign(s,structuredClone(saved));steps.length=length;
      try{cruiseTo(point,s.rpy);move(toolPose(s.q).tip,rpy);return;}catch(error){failure=error;}
    }
    Object.assign(s,saved);steps.length=length;
    throw Object.assign(Error('rotation'),{detail:{axis,angle:action.angle,requestedOrientation:rpy,reason:failure.message,blocker:failure.detail?.blocker,attemptedTurningPositions:6}});
  }
  for(const [actionIndex,action] of actions.entries()){try{
    if(action.type==='pick')pick(action.object);
    else if(action.type==='transfer'){
      if(s.held&&s.held!==action.object)throw Object.assign(Error('holding'),{detail:{object:action.object,reason:'put down the currently held object before picking up a different one'}});
      if(!s.held)pick(action.object);
      place(action);
    }
    else if(action.type==='place')place(action);
    else if(action.type==='restore')restore();
    else if(action.type==='undo')throw Error('undoOnly');
    else if(action.type==='rotate')rotate(action);
    else if(action.type==='move')move(action.position,action.orientation||s.rpy);
    else if(action.type==='pose'){const rpy=toolPose(action.joints).rpy;joints(action.joints,rpy,Math.max(.4,Math.max(...action.joints.map((v,i)=>Math.abs(v-s.q[i])))/65));}
    else {
      if(s.held)throw Error('holding');cruiseTo(HOME,0);
      for(let repeat=0;repeat<(action.repeat||1);repeat++){
        if(action.type==='dance'){
          const amplitude=action.style==='lively'?45:28;
          for(const sign of [-1,1,-1,1])move([210,sign*amplitude,160],[0,sign*8,sign*25]);
          move([225,0,135],[0,10,0]);move(HOME,[0,0,0]);
        }else if(action.type==='wave'){
          move([190,0,160],[0,0,0]);for(const angle of [-15,15,-15,15])move([190,0,160],[angle,0,0]);move(HOME,[0,0,0]);
        }else if(action.type==='bow'){move([240,0,125],[0,15,0]);move(HOME,[0,0,0]);}
        else if(action.type==='circle'){for(let i=0;i<=24;i++){const angle=i*Math.PI/12;move([210+22*Math.cos(angle),22*Math.sin(angle),150],[0,0,0]);}move(HOME,[0,0,0]);}
        else if(action.type==='bob'){for(let i=0;i<2;i++){move([210,0,175],[0,0,0]);move([210,0,130],[0,0,0]);}move(HOME,[0,0,0]);}
      }
    }
  }catch(error){error.action=action;error.detail={...error.detail,actionIndex,held:s.held};throw error;}}
  return {steps,result:s};
}
export function applyStep(state,step){
  if(step.type==='move'){
    state.q=[...step.q];state.rpy=[...(step.rpy||[0,0,step.yaw])];state.yaw=state.rpy[2];
    if(state.held){const block=state.objects.find(o=>o.id===state.held);block.position=toolPose(state.q).tip;block.yaw=state.yaw;block.rpy=[...state.rpy];}
  }else if(step.type==='grip')state.held=step.object;
  else if(step.type==='release'){const block=state.objects.find(o=>o.id===state.held);block.position=[...step.position];if(step.rpy){block.rpy=[...step.rpy];block.yaw=step.rpy[2];}state.held=null;}
}
// Reverse the actual validated trajectory, including grasp/release events.
// The UI invalidates this history if a task is interrupted or the scene changes.
export function reverseSteps(state,steps){
  const s=structuredClone(state),inverse=[];
  for(const step of steps){
    if(step.type==='move')inverse.push({type:'move',q:[...s.q],rpy:[...s.rpy],yaw:s.yaw,seconds:step.seconds});
    else if(step.type==='grip'){const b=s.objects.find(o=>o.id===step.object);inverse.push({type:'release',position:[...b.position],rpy:[...b.rpy]});}
    else if(step.type==='release')inverse.push({type:'grip',object:s.held});
    applyStep(s,step);
  }
  return inverse.reverse();
}
