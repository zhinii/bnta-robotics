import { homeFor, ikTool, toolPose, valid, distance, transform, rotationFromEuler, multiply, JOINTS, orientationError } from './kinematics.mjs?v=vision-20261022-1';
import {at,shape,cylinder,bounds,overlaps,broadOverlap,xyz} from './collision.mjs?v=vision-20261022-1';
import {objectGeometry,objectShapes,objectBounds,gripperGeometry,armGeometry,projectedWidth,GRIPPER,GRIPPER_CONTACT} from './shapes.mjs?v=vision-20261022-1';

export const AREAS={left:[170,-230],right:[170,230],rear:[-280,0],front:[280,0]};
export const HOME=[210,0,150];
export const BLOCKS=['red','blue','yellow'];
// Robot-local coordinates: the mount is near the short edge, facing across the desk.
export const DESK={min:[-60,-215],max:[560,215]};
export const ORGANIZER={id:'organizer',name:'low organizer shelf',zh:'矮整理架',position:[230,160,14],size:[220,100,28],surface:true,fixed:true};
export const WRITING_TOOL={diameter:14,length:88};
const holderInside=WRITING_TOOL.diameter*2.5,holderWall=3,holderHeight=WRITING_TOOL.length/2;
export const PEN_HOLDER={id:'pen-holder',name:'square pen holder',zh:'方形笔筒',position:[140,65,holderHeight/2],size:[holderInside+2*holderWall,holderInside+2*holderWall,holderHeight],innerSize:[holderInside,holderInside],wall:holderWall,fixed:false,container:true,accepts:['pen','pencil'],slots:[[-8,-8],[8,8]],floor:4};
export const holderFor=s=>s.objects.find(o=>o.container)||s.obstacles.find(o=>o.container);
const holderFloor=h=>h.position[2]-h.size[2]/2+h.floor;
export function inHolder(s,o){
  const h=holderFor(s);if(!h||o.id===s.held||o.container)return false;
  const inverse=transpose(rotationFromEuler(h.rpy||[0,0,0])),local=transform(inverse,o.position.map((v,i)=>v-h.position[i])),rotation=multiply(inverse,rotationFromEuler(o.rpy||[0,0,0]));
  const size=[0,1,2].map(i=>o.size.reduce((sum,v,j)=>sum+Math.abs(rotation[i*3+j])*v,0));
  return [0,1].every(i=>Math.abs(local[i])+size[i]/2<=h.innerSize[i]/2+.05)&&Math.abs(local[2]-size[2]/2+h.size[2]/2-h.floor)<.5;
}
export const HOMES={
  'shelf-left':{name:'left shelf space',zh:'整理架左侧',position:[145,160,28]},
  'shelf-middle':{name:'middle shelf space',zh:'整理架中间',position:[195,160,28]},
  'shelf-right':{name:'right shelf space',zh:'整理架右侧',position:[245,160,28]},
};
export const CATALOG={
  'pen-holder':{...PEN_HOLDER,color:'#b98a67',stackable:false},
  book:{name:'red book',zh:'红色书本',size:[36,58,18],color:'#c85b4e',stackable:true},
  eraser:{name:'blue eraser',zh:'蓝色橡皮',size:[30,42,20],color:'#638fae',stackable:true},
  glue:{name:'yellow glue stick',zh:'黄色固体胶',size:[24,24,46],color:'#d9b84c',stackable:false},
  pencilcase:{name:'green pencil case',zh:'绿色笔袋',size:[34,60,30],color:'#71917a',stackable:true},
  ruler:{name:'wooden ruler',zh:'木尺',size:[18,90,16],color:'#c8a475',stackable:false},
  notebook:{name:'blue notebook',zh:'蓝色笔记本',size:[38,60,20],color:'#5c84a0',stackable:true},
  pen:{name:'blue pen',zh:'蓝色钢笔',size:[WRITING_TOOL.diameter,WRITING_TOOL.length,WRITING_TOOL.diameter],diameter:WRITING_TOOL.diameter,color:'#386a96',stackable:false},
  pencil:{name:'yellow pencil',zh:'黄色铅笔',size:[WRITING_TOOL.diameter,WRITING_TOOL.length,WRITING_TOOL.diameter],diameter:WRITING_TOOL.diameter,color:'#d6a547',stackable:false},
  clock:{name:'alarm clock',zh:'闹钟',size:[34,30,46],color:'#ce7e67',stackable:false},
  red:{name:'red block',zh:'红色方块',size:[36,36,36],color:'#ce6450',stackable:true},
  blue:{name:'blue block',zh:'蓝色方块',size:[36,36,36],color:'#628ca9',stackable:true},
  yellow:{name:'yellow block',zh:'黄色方块',size:[36,36,36],color:'#dab65b',stackable:true},
};
const rad=Math.PI/180;
const transpose=m=>[m[0],m[3],m[6],m[1],m[4],m[7],m[2],m[5],m[8]];
const identity=[1,0,0,0,1,0,0,0,1];
const euler=r=>{const pitch=Math.asin(Math.max(-1,Math.min(1,-r[6]))),lock=Math.abs(Math.cos(pitch))<1e-7;return [lock?0:Math.atan2(r[7],r[8]),pitch,lock?Math.atan2(-r[1],r[4]):Math.atan2(r[3],r[0])].map(v=>Math.abs(v)<1e-9?0:v/rad);};
function carriedPose(state,pose){
  const grip=state.grasp||{offset:[0,0,0],rotation:identity};
  return {position:transform(pose.rotation,grip.offset).map((v,i)=>v+pose.tip[i]),rotation:multiply(pose.rotation,grip.rotation)};
}
export function graspWidth(state){const o=state.objects.find(o=>o.id===state.held);return state.jawWidth??(o?projectedWidth(o,state.grasp?.rotation||identity):(state.approachWidth??GRIPPER.travelOpening));}
export const relativeBounds=(object,rpy=object.rpy||[0,0,object.yaw||0])=>bounds(at(objectGeometry(object),[0,0,0],rotationFromEuler(Array.isArray(rpy)?rpy:[0,0,rpy])));
export const footprint=(object,rpy)=>{const b=relativeBounds(object,rpy);return b.high.map((v,i)=>v-b.low[i]);};

export function objectPosture(object){
  const r=rotationFromEuler(object.rpy),axis=[0,1,2].find(i=>Math.abs(r[6+i])>.9999);
  if(axis===undefined)return 'tilted';
  const height=object.size[axis],dimensions=[...object.size].sort((a,b)=>a-b);
  return height===dimensions[0]?'flat':height===dimensions[2]?'short-edge':'long-edge';
}
export function restingFace(object){const r=rotationFromEuler(object.rpy);return ['book','notebook'].includes(object.id)&&r[6]>.999?'spine':objectPosture(object)==='flat'&&r[8]<-.999?'face-down':objectPosture(object);}
const stackSupport=o=>o.stackable&&objectPosture(o)==='flat';
export function postureOrientations(object,posture){
  if(posture==='spine')return [0,90,-90,180].map(yaw=>[0,-90,yaw]);
  if(posture==='face-down')return [0,90,-90,180].map(yaw=>[180,0,yaw]);
  const rank=posture==='flat'?0:posture==='long-edge'?1:2,axis=[0,1,2].sort((a,b)=>object.size[a]-object.size[b]||a-b)[rank];
  const options=axis===1?[[-90,0,90],[90,0,-90],[90,0,0],[-90,0,0],[-90,0,-90],[90,0,90],[-90,0,180],[90,0,180]]:axis===0?[[0,-90,0],[0,90,0],[0,-90,90],[0,90,-90],[0,-90,-90],[0,90,90],[0,-90,180],[0,90,180]]:[[0,0,0],[0,0,90],[0,0,-90],[0,0,180],[180,0,0],[180,0,90],[180,0,-90],[180,0,180]];
  if(objectPosture(object)===(posture==='upright'?'short-edge':posture))options.unshift([...object.rpy]);
  return options;
}
export function initialState(seed=0,kit='school') {
  let n=seed>>>0;
  const random=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};
  const ids=kit==='blocks'?BLOCKS:kit==='desk'?['book','notebook','pen','pencil']:['book','eraser','glue','pencilcase','ruler'];
  const positions=[-25,150,-150,70,-75].map(a=>{const angle=(a+(seed?(random()-.5)*12:0))*rad,r=seed?250+random()*15:260;return [Math.round(r*Math.cos(angle)),Math.round(r*Math.sin(angle))];});
  const solved=ikTool(HOME,homeFor(6),'nearest',[0,0,0]);if(!solved.q)throw Error('home');
  const deskPositions=[[170,-160],[245,-160],[75,-165],[60,95]];
  const placed=kit==='desk'?deskPositions.map(p=>p.map(v=>v+(seed?Math.round((random()-.5)*16):0))):positions;
  // Preserve approach space between the pencil and the fixed holder.
  if(kit==='desk'){
    placed[3][0]=Math.min(60,placed[3][0]);
    placed.forEach((p,index)=>p.forEach((v,axis)=>{const half=CATALOG[ids[index]].size[axis]/2;p[axis]=Math.max(DESK.min[axis]+half+2,Math.min(DESK.max[axis]-half-2,v));}));
  }
  return {q:solved.q,held:null,yaw:0,rpy:[0,0,0],seed,kit,objects:[...ids.map((id,i)=>({id,...structuredClone(CATALOG[id]),position:[...placed[i],-relativeBounds({...CATALOG[id],id},[0,0,0]).low[2]],origin:[...placed[i],-relativeBounds({...CATALOG[id],id},[0,0,0]).low[2]],yaw:0,rpy:[0,0,0]})),...(kit==='desk'?[{...structuredClone(CATALOG['pen-holder']),origin:[...PEN_HOLDER.position],rpy:[0,0,0],yaw:0}]:[])],
    homes:kit==='desk'?structuredClone(HOMES):{},
    obstacles:kit==='desk'?[structuredClone(ORGANIZER),{id:'laptop',name:'laptop',zh:'笔记本电脑',position:[250,-35,50],size:[125,125,100],fixed:true},{id:'lamp',name:'desk lamp',zh:'台灯',position:[480,150,90],size:[60,60,180],fixed:true},{id:'wall',name:'dorm room wall',zh:'宿舍墙壁',position:[250,225,-10],size:[1200,20,760],fixed:true}]:[{id:'tall divider',position:[70+(seed?Math.round(random()*20):0),135,55],size:[48,48,110]},{id:'low divider',position:[-60,-160,35],size:[65,40,70]}]};
}
export function blocksAbove(state,id) {
  const support=state.objects.find(o=>o.id===id),base=objectShapes(support),top=bounds(base).high[2];
  return state.objects.filter(o=>{
    if(o.id===id||o.id===state.held||support.container&&inHolder(state,o))return false;
    const b=objectBounds(o);if(b.low[2]<top-.25||b.low[2]>top+.5)return false;
    const lowered=at(objectGeometry(o),o.position.map((v,i)=>v-(i===2?.5:0)),rotationFromEuler(o.rpy));
    return lowered.some(a=>base.some(part=>overlaps(a,part)));
  });
}

// Semantic scene facts use the same transformed geometry as collision checks.
// Distances describe free surface space, never proof of a reachable grasp/path.
export function objectLocation(s,o,seen=new Set()){
  if(o.id===s.held)return {location:'gripper',support:null,onShelf:false};
  if(seen.has(o.id))return {location:'unknown',support:null,onShelf:false};
  seen.add(o.id);
  const holder=holderFor(s);
  if(holder&&inHolder(s,o))return {location:'inside-holder',support:holder.id,onShelf:objectLocation(s,holder,seen).onShelf};
  const b=objectBounds(o),shelf=s.obstacles.find(item=>item.surface);
  const withinShelf=shelf&&[0,1].every(i=>b.low[i]>=shelf.position[i]-shelf.size[i]/2-.3&&b.high[i]<=shelf.position[i]+shelf.size[i]/2+.3)&&b.low[2]>=shelf.position[2]+shelf.size[2]/2-.3;
  const support=s.objects.find(item=>{
    if(item.id===o.id||item.id===s.held||item.container)return false;
    const other=objectBounds(item);return Math.abs(b.low[2]-other.high[2])<.5&&[0,1].every(i=>b.low[i]<other.high[i]&&b.high[i]>other.low[i]);
  });
  if(support)return {location:'on-object',support:support.id,onShelf:!!withinShelf&&objectLocation(s,support,seen).onShelf};
  if(withinShelf&&Math.abs(b.low[2]-(shelf.position[2]+shelf.size[2]/2))<.5)return {location:'shelf',support:shelf.id,onShelf:true};
  if(Math.abs(b.low[2])<.5)return {location:'desk',support:'desk',onShelf:false};
  return {location:'unsupported',support:null,onShelf:false};
}
export function shelfSpace(s,o){
  const shelf=s.obstacles.find(item=>item.surface);if(!shelf||!objectLocation(s,o).onShelf||inHolder(s,o))return null;
  const b=objectBounds(o),edge={low:shelf.position.map((v,i)=>v-shelf.size[i]/2),high:shelf.position.map((v,i)=>v+shelf.size[i]/2)},result={};
  for(const [name,axis,sign] of [['front',1,-1],['back',1,1],['left',0,-1],['right',0,1]]){
    let mm=Math.max(0,sign<0?b.low[axis]-edge.low[axis]:edge.high[axis]-b.high[axis]),blocker='shelf-edge';
    for(const item of s.objects){
      if(item.id===o.id||item.id===s.held||!objectLocation(s,item).onShelf)continue;
      const other=objectBounds(item),cross=1-axis;
      if(other.low[cross]>=b.high[cross]||other.high[cross]<=b.low[cross]||other.low[2]>=b.high[2]-.2||other.high[2]<=b.low[2]+.2)continue;
      const gap=sign<0?b.low[axis]-other.high[axis]:other.low[axis]-b.high[axis];
      if(gap>=-.2&&gap<mm){mm=Math.max(0,gap);blocker=item.id;}
    }
    result[name]={mm:+mm.toFixed(1),blocker};
  }
  return result;
}
export function shelfCandidates(s,object,orientation){
  const shelf=s.obstacles.find(o=>o.surface);if(!shelf)return [];
  const b=relativeBounds(object,orientation),low=shelf.position.slice(0,2).map((v,i)=>v-shelf.size[i]/2+2-b.low[i]),high=shelf.position.slice(0,2).map((v,i)=>v+shelf.size[i]/2-2-b.high[i]);
  const axes=low.map((v,i)=>[v,high[i],shelf.position[i]]);
  for(const home of Object.values(s.homes||{}))axes[0].push(home.position[0]);
  axes[1].push(shelf.position[1]-18,shelf.position[1]+18);
  for(const item of s.objects.filter(o=>o.id!==object.id&&!(object.container&&inHolder(s,o)))){
    const occupied=objectBounds(item);if(occupied.high[2]<shelf.position[2]+shelf.size[2]/2+.2)continue;
    for(const axis of [0,1])for(const gap of [1,10,20,35])axes[axis].push(occupied.high[axis]+gap-b.low[axis],occupied.low[axis]-gap-b.high[axis]);
  }
  for(const axis of [0,1])for(let v=low[axis];v<=high[axis];v+=20)axes[axis].push(v);
  const unique=axes.map((values,i)=>[...new Set(values.map(v=>+v.toFixed(3)))].filter(v=>v>=low[i]-.001&&v<=high[i]+.001));
  const preferred=[160,142,178],xs=[...new Set([...Object.values(s.homes||{}).map(h=>h.position[0]),...unique[0]])];
  const ys=[...new Set([...preferred,...unique[1].sort((a,b)=>Math.abs(a-shelf.position[1])-Math.abs(b-shelf.position[1]))])];
  return ys.filter(y=>y>=low[1]-.001&&y<=high[1]+.001).flatMap(y=>xs.filter(x=>x>=low[0]-.001&&x<=high[0]+.001).map(x=>[x,y]));
}

export function snapshot(s) {
  return {joints:s.q.map(n=>+n.toFixed(2)),tool:toolPose(s.q).tip.map(n=>+n.toFixed(1)),orientation:[...(s.rpy||[0,0,s.yaw])],held:s.held,yaw:s.yaw,gripper:{opening:graspWidth(s),maxOpening:GRIPPER.maxOpening,clearancePerSide:GRIPPER.clearance},pickup:s.pickup?structuredClone(s.pickup):null,
    containers:[...s.objects,...s.obstacles].filter(o=>o.container).map(h=>({...structuredClone(h),contents:s.objects.filter(o=>inHolder(s,o)).map(o=>o.id)})),
    objects:s.objects.map(({retrievalPath,lastGraspQ,motionHints,targetRpy,...o})=>({...structuredClone(o),...objectLocation(s,o),bounds:objectBounds(o),shelfClearance:shelfSpace(s,o),posture:objectPosture(o),restingOn:restingFace(o),worldSize:footprint(o),stackable:stackSupport(o),clearAbove:blocksAbove(s,o.id).length===0})),obstacles:structuredClone(s.obstacles||[]),homes:structuredClone(s.homes||{}),tableAreas:s.kit==='desk'?Object.fromEntries(Object.entries(AREAS).filter(([,p])=>p.every((v,i)=>v>=DESK.min[i]&&v<=DESK.max[i]))):AREAS,
    context:s.kit==='desk'?'A messy desk in an ordinary student dorm room. The robot is clamped to one short side of the desk, facing across it, not mounted in its centre. The movable items and organizer are in front of the mount within its working area. The user decides where items belong and their order, including stacks or side-by-side arrangements on the low organizer. Shelf spaces are optional homes, not assigned categories. The bed, room, laptop, lamp and organizer are fixed.':'A tabletop practice scene.',
    ...(s.kit==='desk'?{deskBounds:DESK,robotMount:[0,0,0],viewerDirections:{left:'rear',right:'front',towardChair:'left',towardWall:'right'},layout:'The robot is on the short edge. The laptop is centred facing the chair. The low shelf runs along the wall-side long edge; shelf left-to-right follows increasing robot-local X.'}:{}),
    capabilities:['pick uncovered school objects','place on clear desk or organizer space, beside objects, at starts, or stack on flat objects','rotate held objects around X, Y or Z, preserving orientation when placed','restore starting positions and orientations','undo completed tasks','move and orient the tool','dance, wave, bow, circle or move up and down','home'],
    coordinates:'Robot-local mm and degrees; +X front of robot, -X behind robot, -Y robot left, +Y robot right, +Z up; position is gripper grasp centre. The whole dorm workstation is turned 90 degrees in the room and the +Y desk edge meets the wall.',limits:{position:[[-340,340],[-340,340],[8,330]],jointDegrees:JOINTS.map(j=>j.limits)},units:'mm/degrees'};
}
const COLLISION_GAP=.5,CONTACT_TOLERANCE=.2;
const cupGrips=[{cup:true,rpy:[0,0,0],height:6},...[60,70].flatMap(roll=>[{cup:true,rpy:[roll,0,0],height:16,back:12},{cup:true,rpy:[-roll,0,180],height:16,back:12}]),...[[90,0,0],[-90,0,180],[90,0,-90],[-90,0,90],[90,0,90],[-90,0,-90],[-90,0,0],[90,0,180]].map(rpy=>({cup:true,rpy,height:22,back:6}))];
const baseParts=[cylinder(46,46,12,[0,0,6],null,{rotation:xyz([90,0,0])}),cylinder(26,26,54,[0,0,38],null,{rotation:xyz([90,0,0])}),cylinder(30,30,6,[0,0,18],null,{rotation:xyz([90,0,0])})].map(p=>shape(p));
function carriedShapes(state,pose){
  const held=state.objects.find(o=>o.id===state.held);if(!held)return [];
  const carried=carriedPose(state,pose),parts=at(objectGeometry(held),carried.position,carried.rotation).map(p=>({...p,owner:held.id,body:'load'}));
  for(const item of state.cargo||[]){const object=state.objects.find(o=>o.id===item.id),position=transform(carried.rotation,item.offset).map((v,i)=>v+carried.position[i]),rotation=multiply(carried.rotation,item.rotation);parts.push(...at(objectGeometry(object),position,rotation).map(p=>({...p,owner:object.id,body:'load'})));}
  return parts;
}
export function clearPose(q,state,contact=null,detail={}) {
  const blocked=(reason,blocker,body)=>{Object.assign(detail,{reason,blocker,...(body?{part:body.part.role||body.part.part||body.body}:{})});return false;};
  if(!valid(q))return blocked('joint or table clearance limit');
  const pose=toolPose(q),held=state.objects.find(o=>o.id===state.held),carried=carriedPose(state,pose);
  if(held?.container&&Math.abs(carried.rotation[8]-1)>.0001)return blocked('keep the holder upright so its contents stay inside',held.id);
  const tool=at(gripperGeometry(graspWidth(state)),pose.tip,pose.rotation).map(p=>({...p,body:'gripper'})),load=carriedShapes(state,pose),arm=armGeometry(pose).map(p=>({...shape(p),body:'arm'})),moving=[...tool,...load,...arm];
  for(const body of moving)if(body.low[2]<-CONTACT_TOLERANCE)return blocked('this physical part would cross the tabletop','table',body);
  for(const body of [...tool,...load]){
    if(Math.max(...[body.low[0],body.high[0]].flatMap(x=>[body.low[1],body.high[1]].map(y=>Math.hypot(x,y))))>400)return blocked('the tool or carried object would leave the working envelope','table',body);
    if(baseParts.some(part=>overlaps(body,part,COLLISION_GAP)))return blocked('this physical part would touch the robot base','robot base',body);
  }
  // Actual grasp contacts may touch, but the palm and wrist may not pass
  // through a held object. Contents keep their own separate physical shapes.
  for(const body of tool)for(const item of load){
    const margin=['finger','pad'].includes(body.part.role)?-CONTACT_TOLERANCE:COLLISION_GAP;
    if(overlaps(body,item,margin))return blocked('the gripper body would intersect the carried object',item.owner,body);
  }
  for(const body of arm)for(const item of load)if(overlaps(body,item,COLLISION_GAP))return blocked('an arm part would intersect the carried object',item.owner,body);
  const fixed=[...(state.obstacles||[]),...state.objects.filter(o=>o.id!==state.held&&!state.cargo?.some(item=>item.id===o.id))];
  const movingBounds=bounds(moving);
  for(const object of fixed){
    const parts=objectShapes(object),objectBox=bounds(parts);if(!broadOverlap(movingBounds,objectBox,COLLISION_GAP))continue;
    for(const body of moving){
      if(!broadOverlap(body,objectBox,COLLISION_GAP))continue;
      for(const part of parts){
        let margin=COLLISION_GAP;
        const graspContact=object.id===contact&&body.body==='gripper'&&['finger','pad'].includes(body.part.role);
        const supported=body.body==='load'&&body.low[2]>=part.high[2]-CONTACT_TOLERANCE;
        if(graspContact||supported)margin=-CONTACT_TOLERANCE;
        if(overlaps(body,part,margin))return blocked(body.body==='arm'?'an arm part would touch this object':'this gripper or carried-object part would touch this object',object.id,body);
      }
    }
  }
  return true;
}
const vector=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite);
export function validateActions(actions) {
  if(!Array.isArray(actions)||actions.length>12)throw Error('invalid');
  const schema={pick:['type','object','approach'],transfer:['type','object','target','position','beside','side','orientation','posture','approach'],place:['type','target','position','beside','side','orientation','posture'],rotate:['type','angle','axis'],move:['type','position','orientation'],pose:['type','joints'],home:['type'],dance:['type','style','repeat'],wave:['type','repeat'],bow:['type','repeat'],circle:['type','repeat'],bob:['type','repeat'],gesture:['type','points','tempo','repeat'],restore:['type'],undo:['type']};
  return actions.map(a=>{
    if(!a||typeof a!=='object'||Array.isArray(a)||!Object.hasOwn(schema,a.type)||Object.keys(a).some(k=>!schema[a.type].includes(k)))throw Error('invalid');
    if(['pick','transfer'].includes(a.type)&&!Object.hasOwn(CATALOG,a.object))throw Error('unknown');
    if('approach'in a&&!['auto','top','front','back','left','right'].includes(a.approach))throw Error('invalid');
    if(['place','transfer'].includes(a.type)){
      if(['target','position','beside'].filter(k=>k in a).length!==1)throw Error('destination');
      if('target'in a&&!Object.hasOwn(AREAS,a.target)&&!Object.hasOwn(HOMES,a.target)&&!Object.hasOwn(CATALOG,a.target)&&!['start','shelf','pen-holder'].includes(a.target)&&!Object.keys(CATALOG).some(c=>a.target===c+'-start'))throw Error('destination');
      if('position'in a&&(!Array.isArray(a.position)||a.position.length!==2||!a.position.every(Number.isFinite)||Math.hypot(...a.position)>330))throw Error('destination');
      if('beside'in a&&(!Object.hasOwn(CATALOG,a.beside)||(a.side!==undefined&&!['auto','left','right','front','rear'].includes(a.side))))throw Error('destination');
      if('side'in a&&!('beside'in a))throw Error('destination');
    }
    if(a.type==='rotate'&&(!Number.isFinite(a.angle)||Math.abs(a.angle)>180))throw Error('angle');
    if('axis'in a&&!['x','y','z'].includes(a.axis))throw Error('angle');
    if(a.type==='move'&&(!vector(a.position)||Math.hypot(...a.position.slice(0,2))>340||a.position[2]<8||a.position[2]>330))throw Error('reach');
    if('orientation'in a&&(!vector(a.orientation)||a.orientation.some(v=>Math.abs(v)>180)))throw Error('angle');
    if('posture'in a&&(!['flat','short-edge','long-edge','upright','face-down','spine'].includes(a.posture)||'orientation'in a||a.posture==='spine'&&!['book','notebook',undefined].includes(a.object)))throw Error('angle');
    if(a.type==='pose'&&(!Array.isArray(a.joints)||a.joints.length!==6||!valid(a.joints)))throw Error('reach');
    if('repeat'in a&&(!Number.isInteger(a.repeat)||a.repeat<1||a.repeat>3))throw Error('invalid');
    if('style'in a&&!['gentle','lively'].includes(a.style))throw Error('invalid');
    if(a.type==='gesture'&&(!Array.isArray(a.points)||a.points.length<2||a.points.length>8||a.points.some(p=>!Array.isArray(p)||p.length!==6||p.some((v,i)=>!Number.isFinite(v)||Math.abs(v)>[35,35,25,20,15,35][i]))))throw Error('invalid');
    if('tempo'in a&&!['slow','normal','quick'].includes(a.tempo))throw Error('invalid');
    return structuredClone(a);
  });
}
export function planActions(state,actions,options={}) {
  validateActions(actions);
  const s=structuredClone(state),steps=[];let destination=null,simpleSearch=false,deadline=Infinity,candidateDeadline=Infinity;
  const requestDeadline=performance.now()+(options.maxPlanningMs??35000);
  const checkBudget=()=>{const now=performance.now();if(now>deadline)throw Error('planningTimeout');if(now>candidateDeadline)throw Error('candidateBudget');};
  function diagnostic(kind,detail={},q=null){
    const ghost=structuredClone(s);
    if(q)applyStep(ghost,{type:'move',q,rpy:toolPose(q).rpy});
    return {kind,state:ghost,showArm:!!q,blocker:detail.blocker||null,target:detail.target||detail.requestedPosition||null,destinations:destination?[structuredClone(destination)]:[],path:[]};
  }
  function joints(q,rpy,seconds,contact=null){
    checkBudget();
    const count=Math.max(2,Math.ceil(Math.max(...q.map((v,i)=>Math.abs(v-s.q[i])))/.5));
    for(let i=1;i<=count;i++){if(i%16===0)checkBudget();const sample=s.q.map((v,j)=>v+(q[j]-v)*i/count),detail={tip:toolPose(sample).tip,contact};if(!clearPose(sample,s,contact,detail))throw Object.assign(Error('blocked'),{detail,preview:diagnostic('collision',detail,sample)});}
    const step={type:'move',q:[...q],rpy:[...rpy],yaw:rpy[2],seconds};applyStep(s,step);steps.push(step);
    if(steps.length>4000)throw Error('invalid');
  }
  function jointDetour(goal,contact){
    const start=[...s.q],until=Math.min(performance.now()+(simpleSearch?450:1000),deadline,candidateDeadline),trees=[[{q:start,parent:-1}],[{q:goal,parent:-1}]];
    let seed=731;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
    const metric=(a,b)=>Math.max(...a.map((v,i)=>Math.abs(v-b[i])));
    const free=(a,b)=>{const count=Math.max(1,Math.ceil(metric(a,b)/5));for(let i=1;i<=count;i++)if(!clearPose(a.map((v,j)=>v+(b[j]-v)*i/count),s,contact))return false;return true;};
    const extend=(tree,target)=>{
      let near=0;for(let i=1;i<tree.length;i++)if(distance(tree[i].q,target)<distance(tree[near].q,target))near=i;
      const from=tree[near].q,d=metric(from,target),q=from.map((v,i)=>v+(target[i]-v)*Math.min(1,25/d));
      if(!free(from,q))return null;tree.push({q,parent:near});return {index:tree.length-1,reached:d<=25};
    };
    const trace=(tree,index)=>{const path=[];while(index!==-1){path.push(tree[index].q);index=tree[index].parent;}return path;};
    for(let iteration=0;iteration<220&&performance.now()<until;iteration++){
      const side=iteration%2,a=trees[side],b=trees[1-side],u=random();
      const sample=iteration%5===0?b[0].q:JOINTS.map((joint,i)=>Math.max(joint.limits[0],Math.min(joint.limits[1],start[i]+(goal[i]-start[i])*u+(random()-.5)*160)));
      const added=extend(a,sample);if(!added)continue;
      let linked;for(let n=0;n<20&&performance.now()<until;n++){linked=extend(b,a[added.index].q);if(!linked||linked.reached)break;}
      if(!linked?.reached)continue;
      const left=trace(a,added.index),right=trace(b,linked.index),path=side===0?[...left.reverse(),...right.slice(1)]:[...right.reverse(),...left.slice(1)];
      // The coarse search only suggests a route. Execution accepts it only
      // after joints() checks every segment at <=0.5 degree intervals.
      const saved=structuredClone(s),length=steps.length;
      try{for(const q of path.slice(1))joints(q,toolPose(q).rpy,Math.max(.1,metric(s.q,q)/90),contact);return true;}
      catch(error){Object.assign(s,saved);steps.length=length;if(['candidateBudget','planningTimeout'].includes(error.message))throw error;}
    }
    return false;
  }
  function opening(width,contact=null){
    if(width<0||width>GRIPPER.maxOpening+.001)throw Error('grasp');
    const from=graspWidth(s),count=Math.max(1,Math.ceil(Math.abs(width-from)/.5));
    const previous=s.jawWidth;
    for(let i=1;i<=count;i++){
      s.jawWidth=from+(width-from)*i/count;const detail={contact};
      if(!clearPose(s.q,s,contact,detail)){s.jawWidth=previous;throw Object.assign(Error('blocked'),{detail,preview:diagnostic('collision',detail,s.q)});}
    }
    const step={type:'preshape',width,seconds:Math.max(.06,Math.abs(width-from)/GRIPPER.jawSpeed)};applyStep(s,step);steps.push(step);
  }
  function closeForTravel(){
    if(graspWidth(s)===GRIPPER.travelOpening)return;
    const saved=structuredClone(s),length=steps.length;
    try{opening(GRIPPER.travelOpening);return;}catch(error){
      Object.assign(s,structuredClone(saved));steps.length=length;
      // Stop can leave empty jaws resting around an item before attachment.
      // Withdraw before closing, rather than squeezing through that item.
      const pose=toolPose(s.q),back=transform(pose.rotation,[0,0,32]);
      const contact=s.objects.find(o=>distance(o.position,pose.tip)<Math.max(...o.size)/2+12)?.id;
      try{move(pose.tip.map((v,i)=>v+back[i]),s.rpy,contact);opening(GRIPPER.travelOpening);return;}
      catch{Object.assign(s,saved);steps.length=length;throw error;}
    }
  }
  function move(point,rpy=s.rpy||[0,0,s.yaw],contact=null){
    checkBudget();
    const start=toolPose(s.q).tip,orientation=s.rpy||[0,0,s.yaw];
    const holder=holderFor(s),precise=holder&&[start,point].every(p=>Math.hypot(p[0]-holder.position[0],p[1]-holder.position[1])<80&&p[2]<holder.position[2]+holder.size[2]/2+100);
    const count=Math.max(1,Math.ceil(distance(start,point)/(precise?1:9)),Math.ceil(Math.max(...rpy.map((v,i)=>Math.abs(v-orientation[i])))/(precise?1:5)));
    for(let i=1;i<=count;i++){
      checkBudget();
      const target=start.map((v,j)=>v+(point[j]-v)*i/count),next=orientation.map((v,j)=>v+(rpy[j]-v)*i/count),result=ikTool(target,s.q,'nearest',next);
      if(!result.q){const detail={target,orientation:next,requestedPosition:point,requestedOrientation:rpy,solver:result.error};throw Object.assign(Error('reach'),{detail,preview:diagnostic('reach',detail)});}
      const seconds=Math.max(.008,distance(toolPose(s.q).tip,toolPose(result.q).tip)/160,Math.max(...result.q.map((v,j)=>Math.abs(v-s.q[j])))/90);
      joints(result.q,next,seconds,contact);
    }
  }
  function remembered(object,point,rpy){
    for(const hint of object.motionHints||[]){const pose=toolPose(hint.q);if(distance(pose.tip,point)<.2&&Math.hypot(...orientationError(rotationFromEuler(rpy),pose.rotation))<.005)return hint.q;}
    return null;
  }
  function finishMove(point,rpy,contact=null,goal=null){
    const saved=structuredClone(s),length=steps.length;
    try{move(point,rpy,contact);return;}catch(error){
      if(!goal)throw error;
      Object.assign(s,saved);steps.length=length;
      // A known endpoint is only a seed, never permission to skip a swept check.
      joints(goal,rpy,Math.max(.1,Math.max(...goal.map((v,i)=>Math.abs(v-s.q[i])))/90),contact);
    }
  }
  function cruiseTo(point,orientation=0,contact=null,goal=null){
    const desired=Array.isArray(orientation)?orientation:[0,0,orientation];
    const saved=structuredClone(s),length=steps.length,current=toolPose(s.q).tip;
    if(goal){
      try{joints(goal,desired,Math.max(.1,Math.max(...goal.map((v,i)=>Math.abs(v-s.q[i])))/90),contact);return;}
      catch(error){Object.assign(s,structuredClone(saved));steps.length=length;if(['candidateBudget','planningTimeout'].includes(error.message))throw error;}
      // A straight vertical lift can be impossible with a tilted wrist even
      // when both endpoints are reachable. Try clear joint-space waypoints;
      // every segment uses the same fine swept collision check as any move.
      for(const [via,rpy] of [[HOME,[0,0,0]],[HOME,desired],[HOME,saved.rpy],[[120,-60,160],[0,0,0]]]){
        checkBudget();Object.assign(s,structuredClone(saved));steps.length=length;
        const solved=ikTool(via,s.q,'nearest',rpy,q=>clearPose(q,s,contact),false);if(!solved.q)continue;
        try{joints(solved.q,rpy,.8,contact);joints(goal,desired,Math.max(.1,Math.max(...goal.map((v,i)=>Math.abs(v-s.q[i])))/90),contact);return;}
        catch(error){Object.assign(s,structuredClone(saved));steps.length=length;if(['candidateBudget','planningTimeout'].includes(error.message))throw error;}
      }
      if(!s.objects.find(o=>o.id===s.held)?.container&&jointDetour(goal,contact))return;
    }
    const load=s.objects.find(o=>o.id===s.held),underAt=rpy=>{const r=rotationFromEuler(rpy),pose=carriedPose(s,{tip:[0,0,0],rotation:r});return load?footprint(load,euler(pose.rotation))[2]/2-pose.position[2]:8;},under=Math.max(underAt(s.rpy),underAt(desired));
    const clearance=Math.max(145,...s.objects.filter(o=>o.id!==s.held).map(o=>o.position[2]+footprint(o)[2]/2+under+12),...(s.obstacles||[]).filter(o=>!o.fixed||o.surface).map(o=>o.position[2]+o.size[2]/2+under+12));
    const startingContact=!s.held?s.objects.find(o=>distance(o.position,current)<25)?.id:null;
    let failure;const attempts=[];
    // Try a direct elevated transfer, then routes around the base in both directions.
    const changing=desired.some((v,i)=>Math.abs(v-saved.rpy[i])>.1);
    const levels=[...new Set([...(load?.container?[Math.max(current[2],point[2])+20]:[]),...(changing&&!load&&contact==='pen-holder'?[190]:[]),clearance,Math.max(clearance,160),...(changing||load&&s.grasp?.offset.some(v=>Math.abs(v)>20)?[180,160,145,120]:[])])];
    for(const turnAt of (changing?(simpleSearch?['source','destination']:['source','destination','central','home','raised']):['raised']))for(const route of (simpleSearch?['direct']:['direct','home','short','long']))for(const level of (simpleSearch?levels.slice(0,1):levels)){
      checkBudget();
      Object.assign(s,structuredClone(saved));steps.length=length;
      try{
        if(turnAt==='source')move(current,desired,startingContact||contact);
        move([current[0],current[1],Math.max(level,current[2])],s.rpy,startingContact||contact);
        if(turnAt==='raised')move(toolPose(s.q).tip,desired);
        if(turnAt==='home'){move(HOME,s.rpy);turn(desired);}
        if(turnAt==='central'){move([120,0,90],s.rpy);turn(desired);}
        const travel=turnAt==='destination'?s.rpy:desired;
        if(route==='direct')move([point[0],point[1],level],travel);
        else if(route==='home'){move(HOME,travel);move([point[0],point[1],level],travel);}
        else{
          const a=Math.atan2(current[1],current[0]),b=Math.atan2(point[1],point[0]);let delta=((b-a+3*Math.PI)%(2*Math.PI))-Math.PI;
          if(route==='long')delta+=delta>0?-2*Math.PI:2*Math.PI;
          const radius=Math.max(225,Math.hypot(...current.slice(0,2)),Math.hypot(...point.slice(0,2))),count=Math.ceil(Math.abs(delta)/.12);
          move([radius*Math.cos(a),radius*Math.sin(a),level],travel);
          for(let i=1;i<=count;i++)move([radius*Math.cos(a+delta*i/count),radius*Math.sin(a+delta*i/count),level],travel);
          move([point[0],point[1],level],travel);
        }
        if(turnAt==='destination')turn(desired);
        finishMove(point,desired,contact,goal);return;
      }catch(error){failure=error;attempts.push({route,level,error:error.message,detail:error.detail});}
    }
    Object.assign(s,saved);steps.length=length;failure.attempts=attempts;throw failure;
  }
  function turn(desired){
    const saved=structuredClone(s),length=steps.length;let failure;
    for(const order of [null,[2,1,0],[0,1,2]]){
      Object.assign(s,structuredClone(saved));steps.length=length;
      try{if(!order)move(toolPose(s.q).tip,desired);else for(const axis of order){const rpy=[...s.rpy];rpy[axis]=desired[axis];move(toolPose(s.q).tip,rpy);}return;}catch(error){failure=error;}
    }
    Object.assign(s,saved);steps.length=length;
    // A checked joint route can turn a held load too, when a Cartesian turn
    // at a fixed grasp centre crosses an unreachable intermediate pose.
    const solved=ikTool(toolPose(s.q).tip,s.q,'nearest',desired,q=>clearPose(q,s),false);
    if(solved.q){try{joints(solved.q,desired,.6);return;}catch(error){failure=error;Object.assign(s,structuredClone(saved));steps.length=length;}if(jointDetour(solved.q,null))return;}
    throw failure;
  }
  function approachChoices(approach){
    // Directions are from the student at the chair, rather than robot axes.
    if(approach==='top')return [0,90,-90,180].map(yaw=>({yaw}));
    const yaw={front:0,back:180,left:-90,right:90}[approach];
    return yaw===undefined?null:[{rpy:[90,0,yaw],sideGrip:true},{rpy:[70,0,yaw],sideGrip:true},{rpy:[60,0,yaw],sideGrip:true},{rpy:[45,0,yaw],sideGrip:true}];
  }
  function pick(id,choice=null,approach='auto'){
    if(s.held)throw Error('holding');const block=s.objects.find(o=>o.id===id);if(!block)throw Object.assign(Error('unknown'),{detail:{object:id}});if(blocksAbove(s,id).length)throw Object.assign(Error('covered'),{detail:{object:id,blocker:blocksAbove(s,id).at(-1).id}});
    const saved=structuredClone(s),length=steps.length;let failure;
    const tilted=block.rpy.slice(0,2).some(v=>Math.abs(v)>.1);
    const explicit=approachChoices(approach);
    for(const candidate of (choice?[choice]:explicit|| (block.container?cupGrips:[...(inHolder(s,block)&&holderFloor(holderFor(s))>4.5?[{yaw:((holderFor(s).rpy[2]-45+540)%360)-180}]:[]),...(inHolder(s,block)?[block.rpy,euler(multiply(rotationFromEuler(block.rpy),rotationFromEuler([0,0,180]))),[90,0,0],[-90,0,0],[90,0,180],[-90,0,180]].map(rpy=>({grasp:{rotation:multiply(transpose(rotationFromEuler(rpy)),rotationFromEuler(block.rpy)),offset:transform(transpose(rotationFromEuler(rpy)),[0,0,-22])}})):[]),...(block.lastGrasp?[{grasp:block.lastGrasp}]:[]),...(tilted?[null,{yaw:0},{yaw:90},{yaw:-90},{yaw:180}]:[null]),...approachChoices('front')]))){
      Object.assign(s,structuredClone(saved));steps.length=length;
      try{
        checkBudget();
        const object=s.objects.find(o=>o.id===id),rpy=candidate?.grasp?euler(multiply(rotationFromEuler(object.rpy),transpose(candidate.grasp.rotation))):candidate?.cup?euler(multiply(rotationFromEuler(object.rpy),rotationFromEuler(candidate.rpy))):candidate?.rpy|| (candidate?[0,0,candidate.yaw]:object.rpy),point=[...object.position];
        if(candidate?.grasp){const offset=transform(rotationFromEuler(rpy),candidate.grasp.offset);for(let i=0;i<3;i++)point[i]-=offset[i];}
        else if(candidate?.cup){point[2]+=candidate.height;if(candidate.back){const back=transform(rotationFromEuler(rpy),[0,0,candidate.back]);for(let i=0;i<3;i++)point[i]+=back[i];}}
        else if(candidate?.sideGrip){
          const direction=transform(rotationFromEuler(rpy),[0,0,1]),box=objectBounds(object),extent=Math.abs(direction[0])*footprint(object)[0]/2+Math.abs(direction[1])*footprint(object)[1]/2;
          for(let i=0;i<2;i++)point[i]+=direction[i]*Math.max(0,extent-8);
          const tool=bounds(at(gripperGeometry(0),[0,0,0],rotationFromEuler(rpy)));
          point[2]=Math.max(point[2],box.low[2]-tool.low[2]+GRIPPER.clearance);
          if(candidate.upperGrip)point[2]=Math.max(point[2],box.high[2]-(candidate.upperInset??10));
        }
        else if(!candidate){const local=relativeBounds(object,[0,0,0]),lift=Math.max(0,local.high[2]-GRIPPER_CONTACT.bodyBottom+GRIPPER.clearance,local.low[2]-GRIPPER_CONTACT.fingerBottom+GRIPPER.clearance),shift=transform(rotationFromEuler(rpy),[0,0,lift]);for(let i=0;i<3;i++)point[i]+=shift[i];}
        else if(candidate){point[2]+=Math.max(0,footprint(object)[2]/2-9,objectBounds(object).low[2]-GRIPPER_CONTACT.fingerBottom+GRIPPER.clearance-point[2]);if(candidate.edge){const axis=candidate.edgeAxis??1,local=[0,0,0];local[axis]=candidate.edge*(candidate.edgeDistance??Math.max(0,object.size[axis]/2-10));const shift=transform(rotationFromEuler(object.rpy),local);for(let i=0;i<3;i++)point[i]+=shift[i];}}

        const inverse=transpose(rotationFromEuler(rpy)),grasp={rotation:multiply(inverse,rotationFromEuler(object.rpy)),offset:transform(inverse,object.position.map((v,i)=>v-point[i]))};
        const width=projectedWidth(object,grasp.rotation);
        if(width+2*GRIPPER.clearance>GRIPPER.maxOpening+.001)throw Error('grasp');
        const known=remembered(object,point,rpy),endpoint=known?{q:known}:ikTool(point,s.q,'nearest',rpy,candidate?.upperGrip?q=>clearPose(q,{...s,jawWidth:width+2*GRIPPER.clearance},id):null,!candidate?.upperGrip);
        if(candidate?.sideGrip&&!endpoint.q)throw Object.assign(Error('reach'),{detail:{object:id,approach,requestedPosition:point,requestedOrientation:rpy,reason:'this pickup side cannot be reached at the current object location'}});
        if(endpoint.q){const detail={};if(!clearPose(endpoint.q,{...s,jawWidth:width+2*GRIPPER.clearance},id,detail)&&(simpleSearch||!['arm link','joint','joint cap'].includes(detail.part)))throw Object.assign(Error('blocked'),{detail,preview:diagnostic('collision',detail,endpoint.q)});}
        // Closed fingers travel to a clear pre-grasp. For an upright item,
        // descending from above avoids pushing the wrist into a shelf leg.
        const graspGoal=known||endpoint.q;
        const back=transform(rotationFromEuler(rpy),[0,0,candidate?.upperGrip?16:32]),backPoint=point.map((v,i)=>v+back[i]);
        const closed=bounds(at(gripperGeometry(0),point,rotationFromEuler(rpy)));
        const top=Math.max(...[...s.objects,...s.obstacles].filter(o=>{const b=objectBounds(o);return [0,1].every(i=>closed.low[i]<b.high[i]+1&&closed.high[i]>b.low[i]-1);}).map(o=>objectBounds(o).high[2]));
        const above=[point[0],point[1],Math.max(point[2]+32,top-(closed.low[2]-point[2])+GRIPPER.clearance)];
        const approaches=candidate?.upperGrip?[backPoint,above]:tilted||object.container?[above,backPoint]:[backPoint,above],resting=structuredClone(s),restLength=steps.length;
        for(const [index,pregrasp] of approaches.entries()){
          if(index&&distance(pregrasp,approaches[0])<.2)continue;
          Object.assign(s,structuredClone(resting));steps.length=restLength;
          try{
            closeForTravel();
            if(distance(toolPose(s.q).tip,pregrasp)>.2||rpy.some((v,i)=>Math.abs(v-s.rpy[i])>.1)){const approach=ikTool(pregrasp,graspGoal||s.q,'nearest',rpy,q=>clearPose(q,s),!candidate?.upperGrip);cruiseTo(pregrasp,rpy,null,approach.q||null);}
            opening(width+2*GRIPPER.clearance);finishMove(point,rpy,id,graspGoal);opening(width,id);
            const step={type:'grip',object:id,grasp,pickup:{position:[...object.position],rpy:[...object.rpy]}};applyStep(s,step);steps.push(step);
            move([point[0],point[1],point[2]+(candidate?.upperGrip?16:32)]);return;
          }catch(error){failure=error;if(['planningTimeout','candidateBudget'].includes(error.message))throw error;}
        }
        throw failure;
      }catch(error){failure=error;if(['planningTimeout','candidateBudget'].includes(error.message))throw error;}
    }
    Object.assign(s,saved);steps.length=length;if(failure)failure.detail={...failure.detail,stage:'pickup',object:id,approach};throw failure;
  }
  function locate(action,held=s.objects.find(o=>o.id===s.held)){
    if(!held)throw Error('empty');if(action.target===held.id)throw Error('selfStack');
    const support=s.objects.find(o=>o.id===action.target&&!o.container);
    const rpy=action.orientation||held.targetRpy||held.rpy,heldSize=footprint(held,rpy),heldBounds=relativeBounds(held,rpy),bottom=-heldBounds.low[2];
    const holder=action.target==='pen-holder'?holderFor(s):null;
    if(action.target==='pen-holder'&&!holder)throw Error('destination');
    if(holder&&(!holder.accepts.includes(held.id)||objectPosture({...held,rpy})!=='short-edge'))throw Error('holderFit');
    if(holder&&holder.rpy.slice(0,2).some(v=>Math.abs(v)>.1))throw Error('cupUpright');
    const slots=holder?holder.slots.map(p=>transform(rotationFromEuler(holder.rpy||[0,0,0]),[...p,0]).map((v,i)=>v+holder.position[i]).slice(0,2)):[];
    const slot=slots.find(p=>!s.objects.some(o=>o.id!==held.id&&!o.container&&Math.hypot(o.position[0]-p[0],o.position[1]-p[1])<20));
    if(holder&&!slot)throw Error('holderFull');
    if(support&&blocksAbove(s,support.id).length)throw Error('covered');
    const start=action.target==='start'?held:s.objects.find(o=>action.target===o.id+'-start');
    if(support&&(!stackSupport(support)||heldSize[0]>footprint(support)[0]*1.35||heldSize[1]>footprint(support)[1]*1.35))throw Object.assign(Error('unstable'),{detail:{object:held.id,support:support.id,reason:'the support is not flat or wide enough for stable stacking'}});
    const anchor=s.objects.find(o=>o.id===action.beside);
    const home=s.homes?.[action.target];
    let xy=action.position||home?.position.slice(0,2)||AREAS[action.target];
    if(action.beside){if(!anchor||anchor.id===held.id)throw Error('destination');const axis=['left','right'].includes(action.side)?1:0,sign=['left','rear'].includes(action.side)?-1:1;xy=anchor.position.slice(0,2);xy[axis]+=sign*((heldSize[axis]+footprint(anchor)[axis])/2+(action.spacing??1));}
    const surface=xy&&(s.obstacles||[]).find(o=>o.surface&&[0,1].every(i=>Math.abs(xy[i]-o.position[i])<(o.size[i]+heldSize[i])/2));
    const point=holder?[...slot,holderFloor(holder)+bottom]:start?[...start.origin.slice(0,2),bottom]:(support?[support.position[0],support.position[1],objectBounds(support).high[2]+bottom]:xy?[...xy,(surface?surface.position[2]+surface.size[2]/2:0)+bottom]:null);
    if(!point)throw Error('destination');
    destination={...structuredClone(held),position:[...point],rpy:[...rpy]};
    if(surface&&![0,1].every(i=>Math.abs(xy[i]-surface.position[i])+heldSize[i]/2<=surface.size[i]/2-2))throw Object.assign(Error('shelfEdge'),{preview:diagnostic('placement')});
    if(anchor&&anchor.position[2]-footprint(anchor)[2]/2>1&&!surface)throw Object.assign(Error('shelfEdge'),{preview:diagnostic('placement')});
    if(s.kit==='desk'&&[0,1].some(i=>point[i]-heldSize[i]/2<DESK.min[i]+2||point[i]+heldSize[i]/2>DESK.max[i]-2))throw Object.assign(Error('destination'),{preview:diagnostic('placement'),detail:{constraint:'deskEdge',reason:'the item would extend beyond the desk edge; choose a position on the desk or organizer'}});
    const placedShapes=at(objectGeometry(held),point,rotationFromEuler(rpy));
    const occupant=s.objects.find(o=>o.id!==held.id&&!(held.container&&inHolder(s,o))&&!s.cargo?.some(c=>c.id===o.id)&&placedShapes.some(a=>objectShapes(o).some(b=>overlaps(a,b,a.low[2]>=b.high[2]-.2?-.2:COLLISION_GAP))));
    if(occupant){const detail={blocker:occupant.id};throw Object.assign(Error('occupied'),{detail,preview:diagnostic('collision',detail)});}
    // Release 30 mm above the rim: the higher approach clears the laptop
    // when the cup is on the shelf and keeps the preferred grip retrievable.
    const releasePoint=holder?[point[0],point[1],point[2]+holder.size[2]+30-holder.floor]:point;
    return {held,rpy,holder,point,releasePoint};
  }
  function place(action){
    checkBudget();
    const {held,rpy,holder,point,releasePoint}=locate(action);
    if(holder){
      // Check each actual writing-tool part throughout the fall, including
      // the tapered tip. The holder opening is empty space, not a solid box.
      const others=[...s.objects.filter(o=>o.id!==s.held),...s.obstacles].map(o=>({object:o,parts:objectShapes(o)}));
      const count=Math.ceil(releasePoint[2]-point[2]);
      for(let i=0;i<=count;i++){
        const position=[point[0],point[1],point[2]+(releasePoint[2]-point[2])*i/count],parts=at(objectGeometry(held),position,rotationFromEuler(rpy));
        const blocker=others.find(o=>parts.some(a=>o.parts.some(b=>overlaps(a,b,a.low[2]>=b.high[2]-.2?-.2:COLLISION_GAP))));
        if(blocker){const detail={blocker:blocker.object.id,reason:'this physical part would touch the object during the drop'};throw Object.assign(Error('blocked'),{detail,preview:diagnostic('collision',detail)});}
      }
    }
    const toolR=multiply(rotationFromEuler(rpy),transpose(s.grasp?.rotation||identity)),toolRpy=euler(toolR),offset=transform(toolR,s.grasp?.offset||[0,0,0]),graspPoint=releasePoint.map((v,i)=>v-offset[i]);
    // Check fixed gripper bodies at the requested endpoint before asking IK
    // to solve it. A different arm branch cannot make the housing narrower.
    const endTool=at(gripperGeometry(Math.min(GRIPPER.maxOpening,graspWidth(s)+2*GRIPPER.clearance)),graspPoint,toolR);
    const fixed=s.objects.filter(o=>o.id!==s.held&&!s.cargo?.some(c=>c.id===o.id)).concat(s.obstacles);
    for(const obstacle of fixed)if(endTool.some(a=>objectShapes(obstacle).some(b=>overlaps(a,b,COLLISION_GAP)))){
      const detail={blocker:obstacle.id,reason:'the gripper needs more room at this placement'};throw Object.assign(Error('blocked'),{detail,preview:diagnostic('collision',detail)});
    }
    const known=remembered(held,graspPoint,toolRpy),probe={...s,jawWidth:Math.min(GRIPPER.maxOpening,graspWidth(s)+2*GRIPPER.clearance)},endpointDetail={};
    const endpoint=known&&clearPose(known,probe)?{q:known}:ikTool(graspPoint,s.q,'nearest',toolRpy,q=>{checkBudget();return clearPose(q,probe,null,endpointDetail);},action.posture!=='face-down');
    if(!endpoint.q&&endpointDetail.blocker)throw Object.assign(Error('blocked'),{detail:endpointDetail,preview:diagnostic('collision',endpointDetail)});
    if(endpoint.error==='solve'){const detail={requestedPosition:graspPoint,requestedOrientation:rpy,reason:'the requested object pose cannot be reached with this grip'};throw Object.assign(Error('reach'),{detail,preview:diagnostic('reach',detail)});}
    if(endpoint.q){
      const probe={...s,jawWidth:Math.min(GRIPPER.maxOpening,graspWidth(s)+2*GRIPPER.clearance)},detail={};
      if(!clearPose(endpoint.q,probe,null,detail)&&(simpleSearch||!['arm link','joint','joint cap'].includes(detail.part)))throw Object.assign(Error('blocked'),{detail,preview:diagnostic('collision',detail,endpoint.q)});
    }
    const approachStart=steps.length,approachPose={q:[...s.q],rpy:[...s.rpy],seconds:.1};
    cruiseTo(graspPoint,toolRpy,null,endpoint.q||known);
    // Include the turning approach too, so withdrawal ends clear of the cup
    // instead of stopping beside the newly upright item.
    const approach=holder?[...steps.slice(Math.max(0,steps.findLastIndex(step=>step.type==='grip')+1),approachStart).filter(step=>step.type==='move'),approachPose,...steps.slice(approachStart).filter(step=>step.type==='move')]:null;
    const released=s.held;opening(Math.min(GRIPPER.maxOpening,graspWidth(s)+2*GRIPPER.clearance));
    if(holder){
      const pose=toolPose(s.q),robot=[...at(gripperGeometry(graspWidth(s)),pose.tip,pose.rotation),...armGeometry(pose).map(p=>shape(p))],count=Math.ceil(releasePoint[2]-point[2]);
      for(let i=0;i<=count;i++){
        const position=[point[0],point[1],releasePoint[2]-(releasePoint[2]-point[2])*i/count],parts=at(objectGeometry(held),position,rotationFromEuler(rpy));
        if(parts.some(a=>robot.some(b=>overlaps(a,b,COLLISION_GAP)))){
          const detail={blocker:'robot arm',reason:'the released object would touch the gripper or arm during the fall'},preview=diagnostic('collision',detail,s.q);
          preview.state.held=null;preview.state.grasp=null;preview.state.cargo=[];
          const sample=preview.state.objects.find(o=>o.id===released);sample.position=position;sample.rpy=[...rpy];preview.destinations=[structuredClone(sample)];
          throw Object.assign(Error('blocked'),{detail,preview});
        }
      }
    }
    const step={type:'release',position:[...releasePoint],rpy:[...rpy]};applyStep(s,step);steps.push(step);
    if(holder){
      const fall={type:'fall',object:released,position:[...point],seconds:.3};applyStep(s,fall);steps.push(fall);
    }
    const saved=structuredClone(s),length=steps.length;
    let withdrawn=false,failure;
    const tip=toolPose(s.q).tip,back=transform(rotationFromEuler(s.rpy),[0,0,32]);
    for(const point of [tip.map((v,i)=>v+back[i]),[tip[0],tip[1],tip[2]+32],[tip[0],tip[1],Math.max(140,tip[2]+50)]]){
      Object.assign(s,structuredClone(saved));steps.length=length;
      try{move(point,s.rpy,released);opening(GRIPPER.travelOpening);withdrawn=true;break;}catch(error){failure=error;}
    }
    if(!withdrawn){
      Object.assign(s,structuredClone(saved));steps.length=length;
      if(holder){for(const pose of approach.slice(0,-1).reverse())joints(pose.q,pose.rpy,pose.seconds,distance(toolPose(s.q).tip,graspPoint)<50?released:null);opening(GRIPPER.travelOpening);}
      else throw failure;
    }
  }

  function arrange(action){
    const previous=simpleSearch,previousBudget=candidateDeadline;
    try{return arrangeWithSearch(action);}finally{simpleSearch=previous;candidateDeadline=previousBudget;}
  }
  function arrangeWithSearch(action){
    if(action.target==='pen-holder'&&!action.orientation&&!action.posture)action={...action,posture:'short-edge'};
    const saved=structuredClone(s),length=steps.length,id=action.object||s.held;
    if(!id)throw Error('empty');if(s.held&&s.held!==id)throw Error('holding');
    const object=s.objects.find(o=>o.id===id);if(!object)throw Error('unknown');
    if(action.posture==='spine'&&!['book','notebook'].includes(id))throw Error('angle');
    if(action.target==='pen-holder'&&!['pen','pencil'].includes(id))throw Error('holderFit');
    if(action.target==='pen-holder'&&['flat','long-edge'].includes(action.posture))throw Error('holderFit');
    const orientations=action.posture?postureOrientations(object,action.posture):object.container&&!action.orientation?[0,90,-90,180].map(delta=>[0,0,((object.rpy[2]+delta+540)%360)-180]):[action.orientation||object.targetRpy||object.rpy];
    if(action.target==='pen-holder'&&!action.orientation)orientations.unshift([90,0,0]);
    if(object.container&&(action.posture&&action.posture!=='flat'||action.orientation?.slice(0,2).some(v=>Math.abs(v)>.1)))throw Error('cupUpright');
    const wasStored=inHolder(saved,object)||(saved.held===id&&saved.pickup&&inHolder({...saved,held:null},{...object,...saved.pickup}));
    const holderTask=action.target==='pen-holder'||wasStored;
    let failure;
    // Reject occupied/unsupported destinations before doing any IK or pickup.
    // All clear gaps and requested-equivalent facings get a short-path attempt
    // before the planner spends time on detours for one candidate.
    const placements=[];
    for(const orientation of orientations){
      let locations=[action];
      if(action.target==='shelf'){
        locations=shelfCandidates(s,object,orientation).map(position=>{const a={...action,position};delete a.target;return a;});
      }else if(action.beside){
        const sides=!action.side||action.side==='auto'?['front','rear','left','right']:[action.side];
        locations=sides.flatMap(side=>[1,2,4,6,8,10,12,18,24,35,45,60].map(spacing=>({...action,side,spacing})));
      }
      for(const [rank,location] of locations.entries()){
        const candidate={...location,orientation,rank};
        try{locate(candidate,object);placements.push(candidate);}catch(error){failure=error;}
      }
    }
    placements.sort((a,b)=>a.rank-b.rank);
    if(!placements.length)throw Object.assign(action.posture?Error('posture'):failure||Error('destination'),action.posture?{preview:failure?.preview,detail:{object:id,posture:action.posture,reason:failure?.message,blocker:failure?.detail?.blocker}}:{});
    if(wasStored&&holderFloor(holderFor(saved))>4.5&&action.target!=='pen-holder'&&orientations.every(rpy=>rpy.slice(0,2).every(v=>Math.abs(v)<.1))){
      // At shelf height a top grip clears the laptop, but cannot lay a long
      // tool flat on the desk. Set it upright in a checked clear buffer and
      // visibly take a side grip before the final placement.
      for(const position of [[140,0],[120,-90],[100,-70]]){
        Object.assign(s,structuredClone(saved));steps.length=length;
        try{
          if(!s.held)pick(id,{yaw:((holderFor(saved).rpy[2]-45+540)%360)-180});
          place({position,orientation:object.rpy});
          const resting=structuredClone(s),restLength=steps.length;
          for(const rpy of [[90,0,0],[-90,0,180],[90,0,90],[-90,0,-90],[-90,0,0],[90,0,180]]){
            Object.assign(s,structuredClone(resting));steps.length=restLength;
            const inverse=transpose(rotationFromEuler(rpy)),staged=s.objects.find(o=>o.id===id);
            try{
              pick(id,{grasp:{rotation:multiply(inverse,rotationFromEuler(staged.rpy)),offset:transform(inverse,[0,0,-22])}});
              arrange(action);return;
            }catch(error){failure=error;}
          }
        }catch(error){failure=error;}
      }
      Object.assign(s,structuredClone(saved));steps.length=length;
    }
    // Try the current grip first. If necessary, put this same object on its
    // previous support and visibly regrasp it; attachment never changes in air.
    const edgeDistance=Math.max(0,20-object.size[0]/2);
    const reverseGrip={grasp:{rotation:rotationFromEuler([0,0,180]),offset:[0,0,0]}};
    const flipped=action.posture==='face-down'||action.orientation&&rotationFromEuler(action.orientation)[8]<-.99,spine=action.posture==='spine';
    if((flipped||spine)&&['book','notebook'].includes(id)&&objectPosture(object)==='flat'&&!action.staged&&(!action.approach||action.approach==='auto')){
      // A top grip cannot release an inverted book: its wrist would be under
      // the support. Stand this same item in a checked clear staging spot,
      // release it, then grip its opposite face. Choose a facing that exposes
      // that face to the arm; the first reachable upright pose is not enough.
      const staging=[...(spine||id==='notebook'?[{target:'shelf-left',posture:'short-edge'},{position:object.position.slice(0,2),posture:'short-edge'}]:[]),...[[[160,-110],[90,0,90]],[[120,-110],[90,0,0]],[[195,160],[90,0,90]]].map(([position,orientation])=>({position,orientation}))];
      for(const stage of staging){
        Object.assign(s,structuredClone(saved));steps.length=length;
        const previousDeadline=deadline;deadline=Math.min(deadline,performance.now()+7000);
        try{arrange({type:'transfer',object:id,...stage,staged:true});arrange({...action,staged:true});return;}
        catch(error){if(error.message==='planningTimeout'&&performance.now()>previousDeadline)throw error;failure=error;}
        finally{deadline=previousDeadline;}
      }
      Object.assign(s,structuredClone(saved));steps.length=length;
    }
    const sideChoices=['back','left','right','front'].flatMap(approachChoices);
    // Work backward from a downward final grip. On a standing book this may
    // require a side pickup, so the palm ends above its final supporting face.
    const supportingGrips=objectPosture(object)!=='flat'?orientations.flatMap(final=>[0,90,-90,180].map(yaw=>({rpy:euler(multiply(multiply(rotationFromEuler(object.rpy),transpose(rotationFromEuler(final))),rotationFromEuler([0,0,yaw]))),sideGrip:true,upperGrip:true}))).filter((choice,index,all)=>all.findIndex(c=>distance(c.rpy,choice.rpy)<.01)===index).flatMap(choice=>[10,-2,4].map(upperInset=>({...choice,upperInset}))):[];
    const choices=approachChoices(action.approach)|| (object.container?cupGrips:flipped||spine?[...supportingGrips,...(flipped&&objectPosture(object)!=='flat'?[0,-20,-30,-45,20,30].map(delta=>({rpy:euler(multiply(rotationFromEuler(object.rpy),rotationFromEuler([180+delta,0,0]))),sideGrip:true,upperGrip:true})):[]),...sideChoices]:action.posture==='long-edge'?[{yaw:90,edgeAxis:0,edge:1,edgeDistance},{yaw:90,edgeAxis:0,edge:-1,edgeDistance},{yaw:90},{yaw:-90},null,{yaw:0,edge:1},{yaw:0,edge:-1},{yaw:180}]:[...(['book','notebook'].includes(id)&&['short-edge','upright'].includes(action.posture)&&(!saved.held||action.target==='start')?[{yaw:0,edge:1},{yaw:0,edge:-1}]:[]),null,reverseGrip,{yaw:0,edge:1},{yaw:0,edge:-1},{yaw:90},{yaw:-90},{yaw:180},...sideChoices]);
    // Try clear endpoints and short transfers for every grip before spending
    // time on long detours for one grip. The full route family remains a fallback.
    const pickups=new Map();
    const attempts=object.container?choices.flatMap(choice=>[true,false].map(fast=>({fast,choice}))):[true,false].flatMap(fast=>choices.map(choice=>({fast,choice})));
    // Before setting a held item down just to change grip, try its current grip
    // with the complete route family. This avoids needless release/re-pick cycles.
    if(saved.held&&!action.approach)attempts.unshift({fast:false,choice:null});
    for(const {fast,choice} of attempts){
      candidateDeadline=Infinity;checkBudget();
      simpleSearch=fast;
      Object.assign(s,structuredClone(saved));steps.length=length;
      try{
        if(pickups.has(choice)){const cached=pickups.get(choice);Object.assign(s,structuredClone(cached.state));steps.push(...cached.steps);}
        else{
          if(choice&&s.held){const rest=s.pickup;if(!rest)continue;place({position:rest.position.slice(0,2),orientation:rest.rpy});}
          if(!s.held)pick(id,choice);
          pickups.set(choice,{state:structuredClone(s),steps:steps.slice(length)});
        }
        const grasped=structuredClone(s),graspLength=steps.length;
        for(const candidate of placements)for(const stagedTurn of (holderTask&&!object.container?[false,true]:[false])){
          candidateDeadline=Infinity;checkBudget();candidateDeadline=performance.now()+(fast?1500:3000);
          Object.assign(s,structuredClone(grasped));steps.length=graspLength;
          try{
            const orientation=candidate.orientation;
            if(stagedTurn)for(const axis of [2,1,0]){const delta=orientation[axis]-s.objects.find(o=>o.id===id).rpy[axis];if(Math.abs(delta)>.1)rotate({axis:['x','y','z'][axis],angle:delta});}
            place(candidate);return;
          }catch(error){options.onAttempt?.({choice,candidate,error:error.message,detail:error.detail});if(error.message==='planningTimeout')throw error;if(error.message!=='candidateBudget')failure=error;}
        }
      }catch(error){options.onAttempt?.({choice,phase:fast?'short':'detour',error:error.message,detail:error.detail,pickup:!pickups.has(choice)});if(error.message==='planningTimeout')throw error;if(error.message!=='candidateBudget')failure=error;}
      // A different grasp can clear an obstacle without changing the object's
      // requested orientation or destination.
    }
    Object.assign(s,saved);steps.length=length;
    if(action.posture)throw Object.assign(Error('posture'),{preview:failure?.preview,detail:{object:id,posture:action.posture,reason:failure?.message,blocker:failure?.detail?.blocker,explanation:failure?.detail?.reason}});
    throw failure;
  }
  function restore(){
    // The taller box leaves a clear upper grip on its tools. Unpack it at
    // its current location before returning the empty box to its exact start.
    const free=(p,b=s.objects.find(o=>o.id===s.held))=>{const parts=at(objectGeometry(b),p,identity);return !s.objects.some(o=>o.id!==b.id&&parts.some(a=>objectShapes(o).some(part=>overlaps(a,part,a.low[2]>=part.high[2]-.2?-.2:COLLISION_GAP))));};
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
      if(s.held){const b=s.objects.find(o=>o.id===s.held);if(free(b.origin))arrange({target:'start',orientation:[0,0,0]});else buffer();}
      const remaining=s.objects.filter(o=>distance(o.position,o.origin)>.2||o.rpy.some(v=>Math.abs(v)>.1));
      if(!remaining.length){cruiseTo(HOME,0);return;}
      const available=remaining.filter(o=>!blocksAbove(s,o.id).length).sort((a,b)=>inHolder(s,a)&&inHolder(s,b)?a.position[1]-b.position[1]:b.position[2]-a.position[2]);
      const ready=available.find(o=>free(o.origin,o));
      if(ready){arrange({object:ready.id,target:'start',orientation:[0,0,0]});}else if(available.length){pick(available[0].id);buffer();}else throw Error('covered');
    }
    throw Error('blocked');
  }
  function rotate(action){
    if(!s.held)throw Error('empty');
    const saved=structuredClone(s),length=steps.length,p=toolPose(s.q).tip;
    const axis=action.axis||'z',object=s.objects.find(o=>o.id===s.held),delta=[0,0,0];delta[{x:0,y:1,z:2}[axis]]=action.angle;
    const rpy=euler(multiply(rotationFromEuler(delta),rotationFromEuler(object.targetRpy||object.rpy)));
    if(object.container&&rpy.slice(0,2).some(v=>Math.abs(v)>.1))throw Error('cupUpright');
    if(Math.abs(rpy[{x:0,y:1,z:2}[axis]])>180)throw Error('angle');
    let failure;
    // First use the clearance already created by pickup. Do not force every
    // horizontal wrist pose to climb to 140 mm before it is allowed to turn.
    try{turn(euler(multiply(rotationFromEuler(rpy),transpose(s.grasp?.rotation||identity))));s.objects.find(o=>o.id===s.held).targetRpy=[...rpy];return;}catch(error){failure=error;Object.assign(s,structuredClone(saved));steps.length=length;}
    // Turning is allowed to reposition the held item, but never changes the requested angle.
    for(const point of [[p[0],p[1],Math.max(p[2],140)],[150,0,120],[120,0,90],[190,0,90],[-210,0,150],[210,0,160],[160,-125,155],[130,-160,155]]){
      Object.assign(s,structuredClone(saved));steps.length=length;
      try{cruiseTo(point,s.rpy);turn(euler(multiply(rotationFromEuler(rpy),transpose(s.grasp?.rotation||identity))));s.objects.find(o=>o.id===s.held).targetRpy=[...rpy];return;}catch(error){failure=error;}
    }
    Object.assign(s,saved);steps.length=length;
    throw Object.assign(Error('rotation'),{preview:failure?.preview,detail:{axis,angle:action.angle,requestedOrientation:rpy,reason:failure.message,blocker:failure.detail?.blocker,attemptedTurningPositions:8}});
  }
  for(const [actionIndex,action] of actions.entries()){destination=null;deadline=Math.min(requestDeadline,performance.now()+(action.type==='restore'?35000:options.actionPlanningMs??20000));candidateDeadline=Infinity;try{
    if(action.type==='pick')pick(action.object,null,action.approach);
    else if(action.type==='transfer'){
      if(s.held&&s.held!==action.object)throw Object.assign(Error('holding'),{detail:{object:action.object,reason:'put down the currently held object before picking up a different one'}});
      arrange(action);
    }
    else if(action.type==='place')arrange(action);
    else if(action.type==='restore')restore();
    else if(action.type==='undo')throw Error('undoOnly');
    else if(action.type==='rotate')rotate(action);
    else if(action.type==='move')move(action.position,action.orientation||s.rpy);
    else if(action.type==='pose'){const rpy=toolPose(action.joints).rpy;joints(action.joints,rpy,Math.max(.4,Math.max(...action.joints.map((v,i)=>Math.abs(v-s.q[i])))/65));}
    else {
      if(s.held)throw Error('holding');cruiseTo(HOME,0);
      for(let repeat=0;repeat<(action.repeat||1);repeat++){
        if(action.type==='gesture'){
          const first=steps.length;
          for(const point of action.points)move(HOME.map((v,i)=>v+point[i]),point.slice(3));
          move(HOME,[0,0,0]);
          const factor={slow:1.35,normal:1,quick:.75}[action.tempo||'normal'];
          for(const step of steps.slice(first))if(step.type==='move')step.seconds*=factor;
        }else if(action.type==='dance'){
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
  }catch(error){error.action=action;error.detail={...error.detail,actionIndex,held:s.held};if(!error.preview&&destination)error.preview=diagnostic('placement');if(error.preview)error.preview.actionIndex=actionIndex;throw error;}}
  return {steps,result:s};
}
// Replay on a copy: previews never modify the live scene or undo history.
export function previewSteps(state,steps){
  const s=structuredClone(state),destinations=[],path=[toolPose(s.q).tip];
  for(const [i,step] of steps.entries()){const held=s.held,cargo=(s.cargo||[]).map(o=>o.id);applyStep(s,step);if(step.type==='move')path.push(toolPose(s.q).tip);if(step.type==='release'&&steps[i+1]?.type!=='fall')destinations.push(...[held,...cargo].map(id=>structuredClone(s.objects.find(o=>o.id===id))));if(step.type==='fall')destinations.push(structuredClone(s.objects.find(o=>o.id===step.object)));}
  if(s.held)destinations.push(...[s.held,...(s.cargo||[]).map(o=>o.id)].map(id=>structuredClone(s.objects.find(o=>o.id===id))));
  return {kind:'ready',state:s,showArm:true,destinations,path};
}
function rememberConfiguration(object,q){
  object.motionHints||=[];
  if(object.motionHints.some(hint=>distance(hint.q,q)<.05))return;
  if(object.motionHints.length>=4)object.motionHints.splice(1,1);
  object.motionHints.push({q:[...q]});
}
export function applyStep(state,step){
  if(step.type==='preshape'){state.jawWidth=step.width;state.approachWidth=step.width;}
  else if(step.type==='fall'){const object=state.objects.find(o=>o.id===step.object);object.position=[...step.position];}
  else if(step.type==='move'){
    state.q=[...step.q];state.rpy=[...(step.rpy||[0,0,step.yaw])];state.yaw=state.rpy[2];
    if(state.held){const block=state.objects.find(o=>o.id===state.held),pose=carriedPose(state,toolPose(state.q));block.position=pose.position;block.rpy=euler(pose.rotation);block.targetRpy=euler(multiply(rotationFromEuler(state.rpy),state.grasp?.rotation||identity));block.yaw=block.rpy[2];for(const item of state.cargo||[]){const load=state.objects.find(o=>o.id===item.id);load.position=transform(pose.rotation,item.offset).map((v,i)=>v+block.position[i]);load.rpy=euler(multiply(pose.rotation,item.rotation));load.yaw=load.rpy[2];delete load.retrievalPath;delete load.lastGraspQ;}}
  }else if(step.type==='grip'){rememberConfiguration(state.objects.find(o=>o.id===step.object),state.q);state.held=step.object;state.grasp=structuredClone(step.grasp||{offset:[0,0,0],rotation:identity});state.pickup=structuredClone(step.pickup||null);state.jawWidth=projectedWidth(state.objects.find(o=>o.id===step.object),state.grasp.rotation);const cup=state.objects.find(o=>o.id===step.object);state.cargo=cup.container?state.objects.filter(o=>inHolder(state,o)).map(o=>({id:o.id,offset:transform(transpose(rotationFromEuler(cup.rpy)),o.position.map((v,i)=>v-cup.position[i])),rotation:multiply(transpose(rotationFromEuler(cup.rpy)),rotationFromEuler(o.rpy))})):[];}
  else if(step.type==='release'){state.approachWidth=state.jawWidth??Math.min(GRIPPER.maxOpening,graspWidth(state)+2*GRIPPER.clearance);state.jawWidth=state.approachWidth;const block=state.objects.find(o=>o.id===state.held);rememberConfiguration(block,state.q);delete block.targetRpy;block.lastGrasp=structuredClone(state.grasp);delete block.lastGraspQ;delete block.retrievalPath;block.position=[...step.position];if(step.rpy){block.rpy=[...step.rpy];block.yaw=step.rpy[2];}for(const item of state.cargo||[]){const load=state.objects.find(o=>o.id===item.id),r=rotationFromEuler(block.rpy);load.position=transform(r,item.offset).map((v,i)=>v+block.position[i]);load.rpy=euler(multiply(r,item.rotation));load.yaw=load.rpy[2];}state.held=null;state.grasp=null;state.cargo=[];}
}
// Reverse the actual validated trajectory, including grasp/release events.
// The UI invalidates this history if a task is interrupted or the scene changes.
export function reverseSteps(state,steps,options={}){
  if(steps.some(step=>step.type==='fall')){
    // Gravity is not reversible. Plan a real retrieval and replacement instead
    // of replaying the fall upward without a grip.
    const end=structuredClone(state);for(const step of steps)applyStep(end,step);
    const changed=state.objects.filter(o=>{const b=end.objects.find(b=>b.id===o.id);return distance(o.position,b.position)>.1||distance(o.rpy,b.rpy)>.1;});
    if(state.held)return null;
    changed.sort((a,b)=>{const x=end.objects.find(o=>o.id===a.id),y=end.objects.find(o=>o.id===b.id);return inHolder(end,x)&&inHolder(end,y)?x.position[1]-y.position[1]:y.position[2]-x.position[2];});
    try{
      const plan=planActions(end,[...changed.map(o=>({type:'transfer',object:o.id,position:o.position.slice(0,2),orientation:o.rpy})),{type:'home'},{type:'pose',joints:state.q}],options);
      if(state.objects.some(o=>{const restored=plan.result.objects.find(b=>b.id===o.id);return distance(o.position,restored.position)>.15||distance(o.rpy,restored.rpy)>.02;}))return null;
      return plan.steps;
    }catch{return null;}
  }
  const s=structuredClone(state),inverse=[];
  for(const step of steps){
    if(step.type==='preshape')inverse.push({type:'preshape',width:graspWidth(s),seconds:step.seconds});
    else if(step.type==='move')inverse.push({type:'move',q:[...s.q],rpy:[...s.rpy],yaw:s.yaw,seconds:step.seconds});
    else if(step.type==='grip'){const b=s.objects.find(o=>o.id===step.object);inverse.push({type:'release',position:[...b.position],rpy:[...b.rpy]});}
    else if(step.type==='release')inverse.push({type:'grip',object:s.held,grasp:structuredClone(s.grasp),pickup:structuredClone(s.pickup)});
    applyStep(s,step);
  }
  return inverse.reverse();
}
