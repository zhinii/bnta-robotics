import { homeFor, ikTool, toolPose, valid, distance, transform, rotationFromEuler, multiply, JOINTS } from './kinematics.mjs?v=holder-20261022-1';

export const AREAS={left:[170,-230],right:[170,230],rear:[-280,0],front:[280,0]};
export const HOME=[210,0,150];
export const BLOCKS=['red','blue','yellow'];
// Robot-local coordinates: the mount is near the short edge, facing across the desk.
export const DESK={min:[-60,-215],max:[560,215]};
export const ORGANIZER={id:'organizer',name:'low organizer shelf',zh:'矮整理架',position:[230,160,14],size:[220,100,28],surface:true,fixed:true};
export const WRITING_TOOL={diameter:14,length:88};
const holderInside=WRITING_TOOL.diameter*2.5,holderWall=3,holderHeight=WRITING_TOOL.length/2;
export const PEN_HOLDER={id:'pen-holder',name:'square pen holder',zh:'方形笔筒',position:[140,65,holderHeight/2],size:[holderInside+2*holderWall,holderInside+2*holderWall,holderHeight],innerSize:[holderInside,holderInside],wall:holderWall,fixed:false,container:true,accepts:['pen','pencil'],slots:[[-8,-8],[8,8]],floor:4};
const holderPartCache=new Map();
export function holderParts(holder){
  const key=JSON.stringify([holder.position,holder.size,holder.wall,holder.floor,holder.rpy]);
  if(holderPartCache.has(key))return holderPartCache.get(key);
  const [w,l,h]=holder.size,t=holder.wall,rotation=rotationFromEuler(holder.rpy||[0,0,0]);
  // Four solid walls and a floor share their exact dimensions with the mesh.
  const parts=[...[-1,1].map(side=>({offset:[side*(w-t)/2,0,0],size:[t,l,h]})),...[-1,1].map(side=>({offset:[0,side*(l-t)/2,0],size:[w-2*t,t,h]})),{offset:[0,0,-h/2+holder.floor/2],size:[w-2*t,l-2*t,holder.floor],surface:true}].map(({offset,size,surface})=>({position:transform(rotation,offset).map((v,i)=>v+holder.position[i]),size:[0,1,2].map(i=>size.reduce((sum,v,j)=>sum+Math.abs(rotation[i*3+j])*v,0)),...(surface?{surface:true}:{})}));
  holderPartCache.set(key,parts);return parts;
}
export const holderFor=s=>s.objects.find(o=>o.container)||s.obstacles.find(o=>o.container);
const holderFloor=h=>h.position[2]-h.size[2]/2+h.floor;
export function inHolder(s,o){
  const h=holderFor(s);if(!h||o.id===s.held||o.container)return false;
  const inverse=transpose(rotationFromEuler(h.rpy||[0,0,0])),local=transform(inverse,o.position.map((v,i)=>v-h.position[i])),rotation=multiply(inverse,rotationFromEuler(o.rpy||[0,0,0]));
  const size=[0,1,2].map(i=>o.size.reduce((sum,v,j)=>sum+Math.abs(rotation[i*3+j])*v,0));
  return [0,1].every(i=>Math.abs(local[i])+size[i]/2<=h.innerSize[i]/2+.05)&&Math.abs(local[2]-size[2]/2+h.size[2]/2-h.floor)<.5;
}
export function obstacleParts(object){
  if(object.container)return holderParts(object).map(part=>({...part,id:object.id}));
  if(object.id==='laptop'){
    const [x,y,z]=object.position,bottom=z-object.size[2]/2;
    // Keyboard base and a conservative envelope of the rendered tilted lid.
    // The air above the keyboard is not a solid obstacle.
    return [{id:object.id,position:[x,y-7,bottom+3.5],size:[125,110,7]},
      {id:object.id,position:[x,y+45,bottom+49],size:[127,24,90]}];
  }
  return [object];
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
  pen:{name:'blue pen',zh:'蓝色钢笔',size:[WRITING_TOOL.diameter,WRITING_TOOL.length,16],diameter:WRITING_TOOL.diameter,color:'#386a96',stackable:false},
  pencil:{name:'yellow pencil',zh:'黄色铅笔',size:[WRITING_TOOL.diameter,WRITING_TOOL.length,16],diameter:WRITING_TOOL.diameter,color:'#d6a547',stackable:false},
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
export function graspWidth(state){const o=state.objects.find(o=>o.id===state.held);return o?.container?o.size[0]:o?o.size.reduce((sum,v,i)=>sum+Math.abs((state.grasp?.rotation||identity)[i])*v,0):(state.approachWidth??51);}
export const footprint=(object,rpy=object.rpy||[0,0,object.yaw])=>{const r=rotationFromEuler(Array.isArray(rpy)?rpy:[0,0,rpy]);return [0,1,2].map(i=>object.size.reduce((sum,v,j)=>sum+Math.abs(r[i*3+j])*v,0));};
export function objectPosture(object){
  const r=rotationFromEuler(object.rpy),axis=[0,1,2].find(i=>Math.abs(r[6+i])>.9999);
  if(axis===undefined)return 'tilted';
  const height=object.size[axis],dimensions=[...object.size].sort((a,b)=>a-b);
  return height===dimensions[0]?'flat':height===dimensions[2]?'short-edge':'long-edge';
}
const stackSupport=o=>o.stackable&&objectPosture(o)==='flat';
export function postureOrientations(object,posture){
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
  return {q:solved.q,held:null,yaw:0,rpy:[0,0,0],seed,kit,objects:[...ids.map((id,i)=>({id,...structuredClone(CATALOG[id]),position:[...placed[i],CATALOG[id].size[2]/2],origin:[...placed[i],CATALOG[id].size[2]/2],yaw:0,rpy:[0,0,0]})),...(kit==='desk'?[{...structuredClone(CATALOG['pen-holder']),origin:[...PEN_HOLDER.position],rpy:[0,0,0],yaw:0}]:[])],
    homes:kit==='desk'?structuredClone(HOMES):{},
    obstacles:kit==='desk'?[structuredClone(ORGANIZER),{id:'laptop',name:'laptop',zh:'笔记本电脑',position:[250,-35,50],size:[125,125,100],fixed:true},{id:'lamp',name:'desk lamp',zh:'台灯',position:[480,150,90],size:[60,60,180],fixed:true},{id:'wall',name:'dorm room wall',zh:'宿舍墙壁',position:[250,225,-10],size:[1200,20,760],fixed:true}]:[{id:'tall divider',position:[70+(seed?Math.round(random()*20):0),135,55],size:[48,48,110]},{id:'low divider',position:[-60,-160,35],size:[65,40,70]}]};
}
export function blocksAbove(state,id) {
  const support=state.objects.find(o=>o.id===id);
  return state.objects.filter(o=>!(support.container&&inHolder(state,o))&&o.id!==id&&o.id!==state.held&&[0,1].every(i=>Math.abs(o.position[i]-support.position[i])<(footprint(o)[i]+footprint(support)[i])/2-1)&&o.position[2]>support.position[2]+1);
}
export function snapshot(s) {
  return {joints:s.q.map(n=>+n.toFixed(2)),tool:toolPose(s.q).tip.map(n=>+n.toFixed(1)),orientation:[...(s.rpy||[0,0,s.yaw])],held:s.held,yaw:s.yaw,pickup:s.pickup?structuredClone(s.pickup):null,
    containers:[...s.objects,...s.obstacles].filter(o=>o.container).map(h=>({...structuredClone(h),contents:s.objects.filter(o=>inHolder(s,o)).map(o=>o.id)})),
    objects:s.objects.map(({retrievalPath,lastGraspQ,...o})=>({...structuredClone(o),posture:objectPosture(o),worldSize:footprint(o),stackable:stackSupport(o),clearAbove:blocksAbove(s,o.id).length===0})),obstacles:structuredClone(s.obstacles||[]),homes:structuredClone(s.homes||{}),tableAreas:s.kit==='desk'?Object.fromEntries(Object.entries(AREAS).filter(([,p])=>p.every((v,i)=>v>=DESK.min[i]&&v<=DESK.max[i]))):AREAS,
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
function corners(tip,rotation,held,carried,width=51) {
  const points=[];
  const halfWidth=Math.max(35,width/2+9.5);
  for(const x of [-halfWidth,halfWidth])for(const y of [-18.5,18.5])for(const z of [-7,41])points.push(transform(rotation,[x,y,z]).map((v,i)=>v+tip[i]));
  if(held)for(const x of [-held.size[0]/2,held.size[0]/2])for(const y of [-held.size[1]/2,held.size[1]/2])for(const z of [-held.size[2]/2,held.size[2]/2])points.push(transform(carried.rotation,[x,y,z]).map((v,i)=>v+carried.position[i]));
  return points;
}
// Match the visible housing, rails and jaws instead of filling all the air
// between them. This matters when gripping two tools inside a narrow cup.
function gripperEnvelopes(tip,rotation,width){
  const parts=[[[0,0,36],[24,24,10]],[[0,0,29],[70,32,12]],...[-16.5,16.5].map(y=>[[0,y,27],[62,3.6,3.6]])];
  for(const side of [-1,1]){
    const x=side*(width/2+3.5);
    parts.push([[x,0,22],[12,28,8]],[[x+side*.5,0,6],[6,24,26]],[[x-side*3,0,2],[1,22,18]]);
  }
  return parts.map(([centre,size])=>{
    const position=transform(rotation,centre).map((v,i)=>v+tip[i]);
    const extent=[0,1,2].map(i=>size.reduce((sum,v,j)=>sum+Math.abs(rotation[i*3+j])*v/2,0));
    return {low:position.map((v,i)=>v-extent[i]),high:position.map((v,i)=>v+extent[i])};
  });
}
export function clearPose(q,state,contact=null,detail={}) {
  const blocked=(reason,blocker)=>{Object.assign(detail,{reason,blocker});return false;};
  if(!valid(q))return blocked('joint or table clearance limit');
  const pose=toolPose(q),tip=pose.tip,held=state.objects.find(o=>o.id===state.held),carried=carriedPose(state,pose),vertices=corners(tip,pose.rotation,held,carried,graspWidth(state));
  if(held?.container){if(Math.abs(carried.rotation[8]-1)>.0001)return blocked('keep the cup upright so its contents stay inside',held.id);for(const item of state.cargo||[]){const load=state.objects.find(o=>o.id===item.id),centre=transform(carried.rotation,item.offset).map((v,i)=>v+carried.position[i]),rot=multiply(carried.rotation,item.rotation);for(const x of [-load.size[0]/2,load.size[0]/2])for(const y of [-load.size[1]/2,load.size[1]/2])for(const z of [-load.size[2]/2,load.size[2]/2])vertices.push(transform(rot,[x,y,z]).map((v,i)=>v+centre[i]));}}
  if(vertices.some(p=>p[2]<-.3||Math.hypot(p[0],p[1])>400))return blocked('the gripper or held object would cross the tabletop or working envelope','table');
  if(Math.hypot(tip[0],tip[1])<85&&tip[2]<145)return blocked('the tool would enter the robot base','robot base');
  const bounds={position:[0,1,2].map(i=>(Math.min(...vertices.map(p=>p[i]))+Math.max(...vertices.map(p=>p[i])))/2),size:[0,1,2].map(i=>Math.max(...vertices.map(p=>p[i]))-Math.min(...vertices.map(p=>p[i])))};
  const gripperBounds=gripperEnvelopes(tip,pose.rotation,graspWidth(state)),envelopes=[...gripperBounds,...[vertices.slice(8)].filter(p=>p.length).map(points=>({low:[0,1,2].map(i=>Math.min(...points.map(p=>p[i]))),high:[0,1,2].map(i=>Math.max(...points.map(p=>p[i])))}))];
  for(const obstacle of [...(state.obstacles||[]),...state.objects.filter(o=>o.container&&o.id!==state.held)]){
    if(obstacle.container){
      const broad={position:obstacle.position,size:footprint(obstacle)};
      const nearTool=[0,1,2].every(i=>Math.abs(bounds.position[i]-broad.position[i])<(bounds.size[i]+broad.size[i])/2+3);
      if(!nearTool&&!pose.points.slice(1).some((p,i)=>segmentBox(pose.points[i],p,broad,23)))continue;
      // Test the cup's real walls and floor, not a solid box across its opening.
      // Keep tool and load separate: the tool can stay above the rim while a
      // long pencil extends down inside the cup.
      for(const part of holderParts(obstacle)){
        for(let i=1;i<pose.points.length;i++)if(segmentBox(pose.points[i-1],pose.points[i],part,[20,17,13,11,10][i-1]+3))return blocked('an arm link would hit the pen holder',obstacle.id);
        if(obstacle.id===contact)continue;
        for(const {low,high} of envelopes){
          if(part.surface&&low[2]>=part.position[2]+part.size[2]/2-.3)continue;
          if([0,1,2].every(i=>low[i]<part.position[i]+part.size[i]/2+1&&high[i]>part.position[i]-part.size[i]/2-1))return blocked('the tool or object would hit the pen holder rim or floor',obstacle.id);
        }
      }
      continue;
    }
    for(const part of obstacleParts(obstacle)){
      for(let i=1;i<pose.points.length;i++)if(segmentBox(pose.points[i-1],pose.points[i],part,[20,17,13,11,10][i-1]+3))return blocked('an arm link would hit this obstacle',obstacle.id);
      const restingAboveSurface=part.surface&&bounds.position[2]-bounds.size[2]/2>=part.position[2]+part.size[2]/2-.3;
      if(!restingAboveSurface&&[0,1,2].every(i=>Math.abs(bounds.position[i]-part.position[i])<(bounds.size[i]+part.size[i])/2+3))return blocked('the gripper or held object would hit this obstacle',obstacle.id);
    }
  }
  for(const block of state.objects){
    if(block.container||block.id===state.held||state.cargo?.some(o=>o.id===block.id))continue;
    const envelope={position:block.position,size:footprint(block)};
    for(let i=1;i<pose.points.length;i++)if(segmentBox(pose.points[i-1],pose.points[i],envelope,[20,17,13,11,10][i-1]+2))return blocked('an arm link would hit this object',block.id);
    const aboveTop=bounds.position[2]-bounds.size[2]/2>=block.position[2]+footprint(block)[2]/2-.3;
    if(block.id!==contact&&!aboveTop&&envelopes.some(({low,high},index)=>{
      // Writing tools are round. Rectangular envelopes falsely close the
      // diagonal gap between tools in the narrow box.
      if(index<gripperBounds.length&&block.diameter&&envelope.size[2]>block.size[1]-.1){
        const radius=block.id==='pen'?Math.hypot(1,block.size[2]/2):block.diameter/2,margin=inHolder(state,block)?.5:3;
        return low[2]<envelope.position[2]+envelope.size[2]/2+margin&&high[2]>envelope.position[2]-envelope.size[2]/2-margin&&Math.hypot(...[0,1].map(i=>Math.max(low[i]-envelope.position[i],envelope.position[i]-high[i],0)))<radius+margin;
      }
      if(index===envelopes.length-1&&held?.diameter&&block.diameter&&Math.abs(carried.rotation[7])>.999&&envelope.size[2]>block.size[1]-.1){const radius=o=>o.id==='pen'?Math.hypot(1,o.size[2]/2):o.diameter/2;return low[2]<envelope.position[2]+envelope.size[2]/2+3&&high[2]>envelope.position[2]-envelope.size[2]/2-3&&Math.hypot(carried.position[0]-block.position[0],carried.position[1]-block.position[1])<radius(held)+radius(block)+3;}return [0,1,2].every(i=>low[i]<envelope.position[i]+envelope.size[i]/2+3&&high[i]>envelope.position[i]-envelope.size[i]/2-3);}))return blocked('the tool or carried object would collide with this object',block.id);
  }
  return true;
}
const vector=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite);
export function validateActions(actions) {
  if(!Array.isArray(actions)||actions.length>12)throw Error('invalid');
  const schema={pick:['type','object'],transfer:['type','object','target','position','beside','side','orientation','posture'],place:['type','target','position','beside','side','orientation','posture'],rotate:['type','angle','axis'],move:['type','position','orientation'],pose:['type','joints'],home:['type'],dance:['type','style','repeat'],wave:['type','repeat'],bow:['type','repeat'],circle:['type','repeat'],bob:['type','repeat'],restore:['type'],undo:['type']};
  return actions.map(a=>{
    if(!a||typeof a!=='object'||Array.isArray(a)||!Object.hasOwn(schema,a.type)||Object.keys(a).some(k=>!schema[a.type].includes(k)))throw Error('invalid');
    if(['pick','transfer'].includes(a.type)&&!Object.hasOwn(CATALOG,a.object))throw Error('unknown');
    if(['place','transfer'].includes(a.type)){
      if(['target','position','beside'].filter(k=>k in a).length!==1)throw Error('destination');
      if('target'in a&&!Object.hasOwn(AREAS,a.target)&&!Object.hasOwn(HOMES,a.target)&&!Object.hasOwn(CATALOG,a.target)&&a.target!=='start'&&a.target!=='pen-holder'&&!Object.keys(CATALOG).some(c=>a.target===c+'-start'))throw Error('destination');
      if('position'in a&&(!Array.isArray(a.position)||a.position.length!==2||!a.position.every(Number.isFinite)||Math.hypot(...a.position)>330))throw Error('destination');
      if('beside'in a&&(!Object.hasOwn(CATALOG,a.beside)||(a.side!==undefined&&!['auto','left','right','front','rear'].includes(a.side))))throw Error('destination');
      if('side'in a&&!('beside'in a))throw Error('destination');
    }
    if(a.type==='rotate'&&(!Number.isFinite(a.angle)||Math.abs(a.angle)>180))throw Error('angle');
    if('axis'in a&&!['x','y','z'].includes(a.axis))throw Error('angle');
    if(a.type==='move'&&(!vector(a.position)||Math.hypot(...a.position.slice(0,2))>340||a.position[2]<8||a.position[2]>330))throw Error('reach');
    if('orientation'in a&&(!vector(a.orientation)||a.orientation.some(v=>Math.abs(v)>180)))throw Error('angle');
    if('posture'in a&&(!['flat','short-edge','long-edge','upright'].includes(a.posture)||'orientation'in a))throw Error('angle');
    if(a.type==='pose'&&(!Array.isArray(a.joints)||a.joints.length!==6||!valid(a.joints)))throw Error('reach');
    if('repeat'in a&&(!Number.isInteger(a.repeat)||a.repeat<1||a.repeat>3))throw Error('invalid');
    if('style'in a&&!['gentle','lively'].includes(a.style))throw Error('invalid');
    return structuredClone(a);
  });
}
export function planActions(state,actions) {
  validateActions(actions);
  const s=structuredClone(state),steps=[];let destination=null;
  function diagnostic(kind,detail={},q=null){
    const ghost=structuredClone(s);
    if(q)applyStep(ghost,{type:'move',q,rpy:toolPose(q).rpy});
    return {kind,state:ghost,showArm:!!q,blocker:detail.blocker||null,target:detail.target||detail.requestedPosition||null,destinations:destination?[structuredClone(destination)]:[],path:[]};
  }
  function joints(q,rpy,seconds,contact=null){
    const count=Math.max(2,Math.ceil(Math.max(...q.map((v,i)=>Math.abs(v-s.q[i])))/.5));
    for(let i=1;i<=count;i++){const sample=s.q.map((v,j)=>v+(q[j]-v)*i/count),detail={tip:toolPose(sample).tip,contact};if(!clearPose(sample,s,contact,detail))throw Object.assign(Error('blocked'),{detail,preview:diagnostic('collision',detail,sample)});}
    const step={type:'move',q:[...q],rpy:[...rpy],yaw:rpy[2],seconds};applyStep(s,step);steps.push(step);
    if(steps.length>4000)throw Error('invalid');
  }
  function move(point,rpy=s.rpy||[0,0,s.yaw],contact=null){
    const start=toolPose(s.q).tip,orientation=s.rpy||[0,0,s.yaw];
    const holder=holderFor(s),precise=holder&&[start,point].every(p=>Math.hypot(p[0]-holder.position[0],p[1]-holder.position[1])<80&&p[2]<holder.position[2]+holder.size[2]/2+100);
    const count=Math.max(1,Math.ceil(distance(start,point)/(precise?1:9)),Math.ceil(Math.max(...rpy.map((v,i)=>Math.abs(v-orientation[i])))/(precise?1:5)));
    for(let i=1;i<=count;i++){
      const target=start.map((v,j)=>v+(point[j]-v)*i/count),next=orientation.map((v,j)=>v+(rpy[j]-v)*i/count),result=ikTool(target,s.q,'nearest',next);
      if(!result.q){const detail={target,orientation:next,requestedPosition:point,requestedOrientation:rpy,solver:result.error};throw Object.assign(Error('reach'),{detail,preview:diagnostic('reach',detail)});}
      const seconds=Math.max(.035,distance(toolPose(s.q).tip,toolPose(result.q).tip)/160,Math.max(...result.q.map((v,j)=>Math.abs(v-s.q[j])))/90);
      joints(result.q,next,seconds,contact);
    }
  }
  function cruiseTo(point,orientation=0,contact=null){
    const desired=Array.isArray(orientation)?orientation:[0,0,orientation];
    const saved=structuredClone(s),length=steps.length,current=toolPose(s.q).tip;
    const load=s.objects.find(o=>o.id===s.held),underAt=rpy=>{const r=rotationFromEuler(rpy),pose=carriedPose(s,{tip:[0,0,0],rotation:r});return load?footprint(load,euler(pose.rotation))[2]/2-pose.position[2]:8;},under=Math.max(underAt(s.rpy),underAt(desired));
    const clearance=Math.max(145,...s.objects.filter(o=>o.id!==s.held).map(o=>o.position[2]+footprint(o)[2]/2+under+12),...(s.obstacles||[]).filter(o=>!o.fixed||o.surface).map(o=>o.position[2]+o.size[2]/2+under+12));
    const startingContact=!s.held?s.objects.find(o=>distance(o.position,current)<25)?.id:null;
    let failure;const attempts=[];
    // Try a direct elevated transfer, then routes around the base in both directions.
    const changing=desired.some((v,i)=>Math.abs(v-saved.rpy[i])>.1);
    const levels=[...new Set([...(changing&&!load&&contact==='pen-holder'?[190]:[]),clearance,Math.max(clearance,160),...(changing||load&&s.grasp?.offset.some(v=>Math.abs(v)>20)?[180,160,145,120]:[])])];
    for(const turnAt of (changing?['destination','central','home','raised','source']:['raised']))for(const route of ['direct','home','short','long'])for(const level of levels){
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
        move(point,desired,contact);return;
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
    // An empty wrist may turn through a checked joint path when keeping the
    // tool fixed throughout a Cartesian turn would cross an unreachable pose.
    if(!s.held){const solved=ikTool(toolPose(s.q).tip,s.q,'nearest',desired);if(solved.q){try{joints(solved.q,desired,.6);return;}catch(error){failure=error;Object.assign(s,saved);steps.length=length;}}}
    throw failure;
  }
  function pick(id,choice=null){
    if(s.held)throw Error('holding');const block=s.objects.find(o=>o.id===id);if(!block)throw Object.assign(Error('unknown'),{detail:{object:id}});if(blocksAbove(s,id).length)throw Object.assign(Error('covered'),{detail:{object:id,blocker:blocksAbove(s,id).at(-1).id}});
    const saved=structuredClone(s),length=steps.length;let failure;
    const tilted=block.rpy.slice(0,2).some(v=>Math.abs(v)>.1);
    for(const candidate of (block.container?[{cup:true,rpy:[0,0,0],height:0},...[[90,0,0],[-90,0,180],[90,0,-90],[-90,0,90],[90,0,90],[-90,0,-90],[-90,0,0],[90,0,180]].map(rpy=>({cup:true,rpy,height:22}))]:choice?[choice]:[...(inHolder(s,block)&&holderFloor(holderFor(s))>4.5?[{yaw:((holderFor(s).rpy[2]-45+540)%360)-180}]:[]),...(inHolder(s,block)?[block.rpy,euler(multiply(rotationFromEuler(block.rpy),rotationFromEuler([0,0,180]))),[90,0,0],[-90,0,0],[90,0,180],[-90,0,180]].map(rpy=>({grasp:{rotation:multiply(transpose(rotationFromEuler(rpy)),rotationFromEuler(block.rpy)),offset:transform(transpose(rotationFromEuler(rpy)),[0,0,-22])}})):[]),...(block.retrievalPath?[{grasp:block.lastGrasp,path:block.retrievalPath}]:[]),...(block.lastGraspQ?[{grasp:block.lastGrasp,q:block.lastGraspQ}]:[]),...(block.lastGrasp?[{grasp:block.lastGrasp}]:[]),...(tilted?[null,{yaw:0},{yaw:90},{yaw:-90},{yaw:180}]:[null])])){
      Object.assign(s,structuredClone(saved));steps.length=length;
      try{
        const object=s.objects.find(o=>o.id===id),rpy=candidate?.grasp?euler(multiply(rotationFromEuler(object.rpy),transpose(candidate.grasp.rotation))):candidate?.cup?euler(multiply(rotationFromEuler(object.rpy),rotationFromEuler(candidate.rpy))):candidate?[0,0,candidate.yaw]:object.rpy,point=[...object.position];
        if(candidate?.grasp){const offset=transform(rotationFromEuler(rpy),candidate.grasp.offset);for(let i=0;i<3;i++)point[i]-=offset[i];}
        else if(candidate?.cup){point[2]+=candidate.height;/* Side approach pinches the outside walls below the rim. */}
        else if(candidate){point[2]+=Math.max(0,footprint(object)[2]/2-9);if(candidate.edge){const axis=candidate.edgeAxis??1,local=[0,0,0];local[axis]=candidate.edge*(candidate.edgeDistance??Math.max(0,object.size[axis]/2-10));const shift=transform(rotationFromEuler(object.rpy),local);for(let i=0;i<3;i++)point[i]+=shift[i];}}
        const inverse=transpose(rotationFromEuler(rpy)),grasp={rotation:multiply(inverse,rotationFromEuler(object.rpy)),offset:transform(inverse,object.position.map((v,i)=>v-point[i]))};
        if(!object.container&&object.size.reduce((sum,v,i)=>sum+Math.abs(grasp.rotation[i])*v,0)>62)throw Error('grasp');
        const preshape={type:'preshape',width:Math.min(62,object.size.reduce((sum,v,i)=>sum+Math.abs(grasp.rotation[i])*v,0)+4)};applyStep(s,preshape);steps.push(preshape);
        if(candidate?.path){
          for(const pose of candidate.path)joints(pose.q,pose.rpy,pose.seconds,id);
          move(point,rpy,id);
        }else if(candidate?.q){
          joints(candidate.q,rpy,Math.max(.4,Math.max(...candidate.q.map((v,i)=>Math.abs(v-s.q[i])))/65),id);
          move(point,rpy,id);
        }else cruiseTo(point,rpy,id);
        const step={type:'grip',object:id,grasp,pickup:{position:[...object.position],rpy:[...object.rpy]}};applyStep(s,step);steps.push(step);
        move([point[0],point[1],Math.max(140,point[2]+45)]);return;
      }catch(error){failure=error;}
    }
    Object.assign(s,saved);steps.length=length;throw failure;
  }
  function place(action){
    if(!s.held)throw Error('empty');if(action.target===s.held)throw Error('selfStack');
    const support=s.objects.find(o=>o.id===action.target&&!o.container),held=s.objects.find(o=>o.id===s.held);
    const rpy=action.orientation||held.rpy,heldSize=footprint(held,rpy);
    const holder=action.target==='pen-holder'?holderFor(s):null;
    if(action.target==='pen-holder'&&!holder)throw Error('destination');
    if(holder&&(!holder.accepts.includes(held.id)||objectPosture({...held,rpy})!=='short-edge'))throw Error('holderFit');
    if(holder&&holder.rpy.slice(0,2).some(v=>Math.abs(v)>.1))throw Error('cupUpright');
    const slots=holder?holder.slots.map(p=>transform(rotationFromEuler(holder.rpy||[0,0,0]),[...p,0]).map((v,i)=>v+holder.position[i]).slice(0,2)):[];
    const slot=slots.find(p=>!s.objects.some(o=>o.id!==s.held&&!o.container&&Math.hypot(o.position[0]-p[0],o.position[1]-p[1])<20));
    if(holder&&!slot)throw Error('holderFull');
    if(support&&blocksAbove(s,support.id).length)throw Error('covered');
    const start=action.target==='start'?held:s.objects.find(o=>action.target===o.id+'-start');
    if(support&&(!stackSupport(support)||heldSize[0]>footprint(support)[0]*1.35||heldSize[1]>footprint(support)[1]*1.35))throw Object.assign(Error('unstable'),{detail:{object:held.id,support:support.id,reason:'the support is not flat or wide enough for stable stacking'}});
    const anchor=s.objects.find(o=>o.id===action.beside);
    const home=s.homes?.[action.target];
    let xy=action.position||home?.position.slice(0,2)||AREAS[action.target];
    if(action.beside){if(!anchor||anchor.id===s.held)throw Error('destination');const axis=['left','right'].includes(action.side)?1:0,sign=['left','rear'].includes(action.side)?-1:1;xy=anchor.position.slice(0,2);xy[axis]+=sign*((heldSize[axis]+footprint(anchor)[axis])/2+35);}
    const surface=xy&&(s.obstacles||[]).find(o=>o.surface&&[0,1].every(i=>Math.abs(xy[i]-o.position[i])<(o.size[i]+heldSize[i])/2));
    const point=holder?[...slot,holderFloor(holder)+heldSize[2]/2]:start?[...start.origin.slice(0,2),heldSize[2]/2]:(support?[support.position[0],support.position[1],support.position[2]+(footprint(support)[2]+heldSize[2])/2]:xy?[...xy,(surface?surface.position[2]+surface.size[2]/2:0)+heldSize[2]/2]:null);
    if(!point)throw Error('destination');
    destination={...structuredClone(held),position:[...point],rpy:[...rpy]};
    if(surface&&![0,1].every(i=>Math.abs(xy[i]-surface.position[i])+heldSize[i]/2<=surface.size[i]/2-2))throw Object.assign(Error('shelfEdge'),{preview:diagnostic('placement')});
    if(anchor&&anchor.position[2]-footprint(anchor)[2]/2>1&&!surface)throw Object.assign(Error('shelfEdge'),{preview:diagnostic('placement')});
    if(s.kit==='desk'&&[0,1].some(i=>point[i]-heldSize[i]/2<DESK.min[i]+2||point[i]+heldSize[i]/2>DESK.max[i]-2))throw Object.assign(Error('destination'),{preview:diagnostic('placement'),detail:{constraint:'deskEdge',reason:'the item would extend beyond the desk edge; choose a position on the desk or organizer'}});
    const occupant=s.objects.find(o=>o.id!==s.held&&o.id!==holder?.id&&!s.cargo?.some(c=>c.id===o.id)&&o.id!==support?.id&&(o.container?obstacleParts(o):[{position:o.position,size:footprint(o)}]).some(part=>[0,1,2].every(i=>Math.abs(part.position[i]-point[i])<(part.size[i]+heldSize[i])/2+(i===2?-.3:holder?2:8))));
    if(occupant){const detail={blocker:occupant.id};throw Object.assign(Error('occupied'),{detail,preview:diagnostic('collision',detail)});}
    // Release 30 mm above the rim: the higher approach clears the laptop
    // when the cup is on the shelf and keeps the preferred grip retrievable.
    const releasePoint=holder?[point[0],point[1],point[2]+holder.size[2]+30-holder.floor]:point;
    if(holder){
      // Check the entire vertical drop, not just the final resting position.
      const centre=point.map((v,i)=>(v+releasePoint[i])/2),size=[heldSize[0],heldSize[1],heldSize[2]+releasePoint[2]-point[2]];
      const boxes=[...s.objects.filter(o=>o.id!==s.held).flatMap(o=>o.container?obstacleParts(o):[{...o,size:footprint(o)}]),...s.obstacles.flatMap(obstacleParts)];
      const blocker=boxes.find(o=>[0,1,2].every(i=>Math.abs(o.position[i]-centre[i])<(o.size[i]+size[i])/2-.3));
      if(blocker){const detail={blocker:blocker.id,reason:'the object would hit this obstacle while dropping into the holder'};throw Object.assign(Error('blocked'),{detail,preview:diagnostic('collision',detail)});}
    }
    const toolR=multiply(rotationFromEuler(rpy),transpose(s.grasp?.rotation||identity)),toolRpy=euler(toolR),offset=transform(toolR,s.grasp?.offset||[0,0,0]),graspPoint=releasePoint.map((v,i)=>v-offset[i]);
    const endpoint=ikTool(graspPoint,s.q,'nearest',toolRpy);
    if(endpoint.error==='solve'){const detail={requestedPosition:graspPoint,requestedOrientation:rpy,reason:'the requested object pose cannot be reached with this grip'};throw Object.assign(Error('reach'),{detail,preview:diagnostic('reach',detail)});}
    const approachStart=steps.length,approachPose={q:[...s.q],rpy:[...s.rpy],seconds:.1};
    cruiseTo(graspPoint,toolRpy);
    // Include the turning approach too, so withdrawal ends clear of the cup
    // instead of stopping beside the newly upright item.
    const approach=holder?[...steps.slice(Math.max(0,steps.findLastIndex(step=>step.type==='grip')+1),approachStart).filter(step=>step.type==='move'),approachPose,...steps.slice(approachStart).filter(step=>step.type==='move')]:null;
    const released=s.held,step={type:'release',position:[...releasePoint],rpy:[...rpy]};applyStep(s,step);steps.push(step);
    if(holder){
      // Keep the release pose as a checked approach hint for later retrieval.
      const retrievalGrasp=structuredClone(s.objects.find(o=>o.id===released).lastGrasp);
      const fall={type:'fall',object:released,position:[...point],seconds:.3,retrievalGrasp,retrievalQ:[...s.q]};applyStep(s,fall);steps.push(fall);
    }
    if(holder){
      // Withdraw through the checked approach, keeping the new upright item
      // in the collision scene. This avoids trapping the wrist near the cup.
      const withdrawalStart=steps.length,releasePose={q:[...s.q],rpy:[...s.rpy],seconds:.1};
      for(const pose of approach.slice(0,-1).reverse())joints(pose.q,pose.rpy,pose.seconds,distance(toolPose(s.q).tip,graspPoint)<50?released:null);
      cruiseTo(HOME,0);
      const retrievalPath=[releasePose,...steps.slice(withdrawalStart).filter(step=>step.type==='move')].reverse().map(({q,rpy,seconds})=>({q:[...q],rpy:[...rpy],seconds}));
      steps[withdrawalStart-1].retrievalPath=retrievalPath;
      s.objects.find(o=>o.id===released).retrievalPath=structuredClone(retrievalPath);
    }else move([graspPoint[0],graspPoint[1],Math.max(140,graspPoint[2]+45)],toolRpy,released);
  }
  function arrange(action){
    if(action.target==='pen-holder'&&!action.orientation&&!action.posture)action={...action,posture:'short-edge'};
    const saved=structuredClone(s),length=steps.length,id=action.object||s.held;
    if(action.beside&&(!action.side||action.side==='auto')){
      let failure;
      for(const side of ['front','rear','left','right']){
        Object.assign(s,structuredClone(saved));steps.length=length;destination=null;
        try{arrange({...action,side});return;}catch(error){failure=error;}
      }
      Object.assign(s,saved);steps.length=length;throw failure;
    }
    if(!id)throw Error('empty');if(s.held&&s.held!==id)throw Error('holding');
    const object=s.objects.find(o=>o.id===id);if(!object)throw Error('unknown');
    if(action.target==='pen-holder'&&!['pen','pencil'].includes(id))throw Error('holderFit');
    if(action.target==='pen-holder'&&['flat','long-edge'].includes(action.posture))throw Error('holderFit');
    const orientations=action.posture?postureOrientations(object,action.posture):object.container&&!action.orientation?[0,90,-90,180].map(delta=>[0,0,((object.rpy[2]+delta+540)%360)-180]):[action.orientation||object.rpy];
    if(action.target==='pen-holder'&&!action.orientation)orientations.unshift([90,0,0]);
    if(object.container&&(action.posture&&action.posture!=='flat'||action.orientation?.slice(0,2).some(v=>Math.abs(v)>.1)))throw Error('cupUpright');
    const wasStored=inHolder(saved,object)||(saved.held===id&&saved.pickup&&inHolder({...saved,held:null},{...object,...saved.pickup}));
    const holderTask=action.target==='pen-holder'||wasStored;
    let failure;
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
    const choices=action.posture==='long-edge'?[{yaw:90,edgeAxis:0,edge:1,edgeDistance},{yaw:90,edgeAxis:0,edge:-1,edgeDistance},{yaw:90},{yaw:-90},null,{yaw:0,edge:1},{yaw:0,edge:-1},{yaw:180}]:[...(action.target==='pen-holder'&&!s.held&&s.objects.some(o=>inHolder(s,o))?[{yaw:0,edge:1}]:[]),null,reverseGrip,{yaw:0,edge:1},{yaw:0,edge:-1},{yaw:90},{yaw:-90},{yaw:180}];
    for(const choice of choices){
      Object.assign(s,structuredClone(saved));steps.length=length;
      try{
        if(choice&&s.held){const rest=s.pickup;if(!rest)continue;place({position:rest.position.slice(0,2),orientation:rest.rpy});}
        if(!s.held)pick(id,choice);
        const grasped=structuredClone(s),graspLength=steps.length;
        for(const orientation of orientations){
          Object.assign(s,structuredClone(grasped));steps.length=graspLength;
          try{
            if(holderTask&&!object.container)for(const axis of [2,1,0]){const delta=orientation[axis]-s.objects.find(o=>o.id===id).rpy[axis];if(Math.abs(delta)>.1)rotate({axis:['x','y','z'][axis],angle:delta});}
            place({...action,orientation});return;
          }catch(error){failure=error;}
        }
      }catch(error){failure=error;}
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
    const axis=action.axis||'z',object=s.objects.find(o=>o.id===s.held),rpy=[...object.rpy];rpy[{x:0,y:1,z:2}[axis]]+=action.angle;
    if(object.container&&rpy.slice(0,2).some(v=>Math.abs(v)>.1))throw Error('cupUpright');
    if(Math.abs(rpy[{x:0,y:1,z:2}[axis]])>180)throw Error('angle');
    let failure;
    // Turning is allowed to reposition the held item, but never changes the requested angle.
    for(const point of [[p[0],p[1],Math.max(p[2],140)],[150,0,120],[120,0,90],[190,0,90],[-210,0,150],[210,0,160],[160,-125,155],[130,-160,155]]){
      Object.assign(s,structuredClone(saved));steps.length=length;
      try{cruiseTo(point,s.rpy);turn(euler(multiply(rotationFromEuler(rpy),transpose(s.grasp?.rotation||identity))));s.objects.find(o=>o.id===s.held).rpy=[...rpy];return;}catch(error){failure=error;}
    }
    Object.assign(s,saved);steps.length=length;
    throw Object.assign(Error('rotation'),{preview:failure?.preview,detail:{axis,angle:action.angle,requestedOrientation:rpy,reason:failure.message,blocker:failure.detail?.blocker,attemptedTurningPositions:8}});
  }
  for(const [actionIndex,action] of actions.entries()){destination=null;try{
    if(action.type==='pick')pick(action.object);
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
export function applyStep(state,step){
  if(step.type==='preshape'){state.approachWidth=step.width;}
  else if(step.type==='fall'){const object=state.objects.find(o=>o.id===step.object);object.position=[...step.position];if(step.retrievalGrasp)object.lastGrasp=structuredClone(step.retrievalGrasp);if(step.retrievalQ)object.lastGraspQ=[...step.retrievalQ];if(step.retrievalPath)object.retrievalPath=structuredClone(step.retrievalPath);}
  else if(step.type==='move'){
    state.q=[...step.q];state.rpy=[...(step.rpy||[0,0,step.yaw])];state.yaw=state.rpy[2];
    if(state.held){const block=state.objects.find(o=>o.id===state.held),pose=carriedPose(state,{tip:toolPose(state.q).tip,rotation:rotationFromEuler(state.rpy)});block.position=pose.position;block.rpy=euler(pose.rotation);block.yaw=block.rpy[2];for(const item of state.cargo||[]){const load=state.objects.find(o=>o.id===item.id);load.position=transform(pose.rotation,item.offset).map((v,i)=>v+block.position[i]);load.rpy=euler(multiply(pose.rotation,item.rotation));load.yaw=load.rpy[2];delete load.retrievalPath;delete load.lastGraspQ;}}
  }else if(step.type==='grip'){state.held=step.object;state.grasp=structuredClone(step.grasp||{offset:[0,0,0],rotation:identity});state.pickup=structuredClone(step.pickup||null);const cup=state.objects.find(o=>o.id===step.object);state.cargo=cup.container?state.objects.filter(o=>inHolder(state,o)).map(o=>({id:o.id,offset:transform(transpose(rotationFromEuler(cup.rpy)),o.position.map((v,i)=>v-cup.position[i])),rotation:multiply(transpose(rotationFromEuler(cup.rpy)),rotationFromEuler(o.rpy))})):[];}
  else if(step.type==='release'){state.approachWidth=Math.min(62,graspWidth(state)+4);const block=state.objects.find(o=>o.id===state.held);block.lastGrasp=structuredClone(state.grasp);delete block.lastGraspQ;delete block.retrievalPath;block.position=[...step.position];if(step.rpy){block.rpy=[...step.rpy];block.yaw=step.rpy[2];}for(const item of state.cargo||[]){const load=state.objects.find(o=>o.id===item.id),r=rotationFromEuler(block.rpy);load.position=transform(r,item.offset).map((v,i)=>v+block.position[i]);load.rpy=euler(multiply(r,item.rotation));load.yaw=load.rpy[2];}state.held=null;state.grasp=null;state.cargo=[];}
}
// Reverse the actual validated trajectory, including grasp/release events.
// The UI invalidates this history if a task is interrupted or the scene changes.
export function reverseSteps(state,steps){
  if(steps.some(step=>step.type==='fall')){
    // Gravity is not reversible. Plan a real retrieval and replacement instead
    // of replaying the fall upward without a grip.
    const end=structuredClone(state);for(const step of steps)applyStep(end,step);
    const changed=state.objects.filter(o=>{const b=end.objects.find(b=>b.id===o.id);return distance(o.position,b.position)>.1||distance(o.rpy,b.rpy)>.1;});
    if(state.held)return null;
    changed.sort((a,b)=>{const x=end.objects.find(o=>o.id===a.id),y=end.objects.find(o=>o.id===b.id);return inHolder(end,x)&&inHolder(end,y)?x.position[1]-y.position[1]:y.position[2]-x.position[2];});
    try{
      const plan=planActions(end,[...changed.map(o=>({type:'transfer',object:o.id,position:o.position.slice(0,2),orientation:o.rpy})),{type:'home'},{type:'pose',joints:state.q}]);
      if(state.objects.some(o=>{const restored=plan.result.objects.find(b=>b.id===o.id);return distance(o.position,restored.position)>.15||distance(o.rpy,restored.rpy)>.02;}))return null;
      return plan.steps;
    }catch{return null;}
  }
  const s=structuredClone(state),inverse=[];
  for(const step of steps){
    if(step.type==='preshape')inverse.push({type:'preshape',width:s.approachWidth??51});
    else if(step.type==='move')inverse.push({type:'move',q:[...s.q],rpy:[...s.rpy],yaw:s.yaw,seconds:step.seconds});
    else if(step.type==='grip'){const b=s.objects.find(o=>o.id===step.object);inverse.push({type:'release',position:[...b.position],rpy:[...b.rpy]});}
    else if(step.type==='release')inverse.push({type:'grip',object:s.held,grasp:structuredClone(s.grasp),pickup:structuredClone(s.pickup)});
    applyStep(s,step);
  }
  return inverse.reverse();
}
