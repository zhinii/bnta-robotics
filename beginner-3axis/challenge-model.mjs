// Deterministic challenge world. Degrees and millimetres throughout.
import { CONFIG, fk as fk3, solveIk, validateJointPose } from './model.mjs';
import { JOINTS, homeFor, toolPose, ikTool, valid, transform, multiply, rotationFromEuler } from './challenge-kinematics.mjs';
import { slottedWall, segmentPanel, boxPanel, slotAligned } from './challenge-wall.mjs';
export const clone = value => structuredClone(value);
const rad = Math.PI / 180, I = [1,0,0,0,1,0,0,0,1];
const xyz = p => [p.x,p.y,p.z];
export const distance = (a,b) => Math.hypot(...a.map((v,i)=>v-b[i]));
const add = (a,b) => a.map((v,i)=>v+b[i]);
const sub = (a,b) => a.map((v,i)=>v-b[i]);
const transpose = m => [m[0],m[3],m[6],m[1],m[4],m[7],m[2],m[5],m[8]];
export const limits = arm => arm.axes === 3 ? CONFIG.limits.map(pair=>pair.map(v=>v/rad)) : JOINTS.map(j=>j.limits);
export function pose(arm, q = arm.q) {
  let points, tip, rotation, origins, axes;
  if (arm.axes === 3) {
    const f=fk3(q.map(v=>v*rad)); points=[f.O,f.S,f.E,f.F,f.C].map(xyz); tip=xyz(f.C); origins=[f.O,f.S,f.E].map(xyz);
    rotation=[f.n.x,f.u.x,-f.e.x,f.n.y,f.u.y,-f.e.y,f.n.z,f.u.z,-f.e.z];
    axes=[[0,0,1],[-Math.sin(q[0]*rad),Math.cos(q[0]*rad),0],[-Math.sin(q[0]*rad),Math.cos(q[0]*rad),0]];
  } else {
    const f=toolPose(q); points=[[0,0,0],...f.points,f.tip]; tip=f.tip; rotation=f.rotation; origins=f.origins; axes=f.axes;
  }
  const base=rotationFromEuler([0,0,arm.yaw]);
  const world = p => add(transform(base,p),arm.base);
  return { points:points.map(world), tip:world(tip), rotation:multiply(base,rotation), origins:origins.map(world), axes:axes.map(a=>transform(base,a)) };
}
export function solvePosition(arm, position) {
  if (!Array.isArray(position)||position.length!==3||!position.every(Number.isFinite)) return {error:'numbers'};
  const local=transform(rotationFromEuler([0,0,-arm.yaw]),sub(position,arm.base));
  if(arm.axes===3) { const r=solveIk({x:local[0],y:local[1],z:local[2]},arm.q.map(v=>v*rad)); return r.ok?{q:r.value.map(v=>v/rad)}:{error:'reach'}; }
  return ikTool(local,arm.q,'nearest',toolPose(arm.q).rpy);
}
export function validJoints(arm,q) {
  return Array.isArray(q)&&q.length===arm.axes&&q.every(Number.isFinite)&&
    (arm.axes===3?validateJointPose(q.map(v=>v*rad)).ok:valid(q));
}
const makeArm=(id,axes,base=[0,0,0],yaw=0)=>({id,axes,base,yaw,q:axes===3?CONFIG.home.map(v=>v/rad):homeFor(6),closed:false});
// Six-axis start poses are solved once from a downward-facing tool.
function down(arm,p) { const local=transform(rotationFromEuler([0,0,-arm.yaw]),sub(p,arm.base)); const r=ikTool(local,arm.q,'nearest',[0,0,-arm.yaw]); if(!r.q)throw Error('Start pose: '+r.error); arm.q=r.q; }
export function initialWorld(mode='easy') {
  if(!['easy','medium','hard'].includes(mode))throw Error('mode');
  const arms=[makeArm('A',mode==='easy'?3:6,mode==='hard'?[-220,0,0]:[0,0,0])];
  if(mode==='hard')arms.push(makeArm('B',6,[220,0,0],180));
  let source=[147,-85,80],destination=[147,85,80],size=[14,14,14],obstacles=[];
  if(mode==='medium') {
    source=[130,-100,110]; destination=[330,0,180]; size=[112,14,14];
    down(arms[0],[125,-120,170]);
    obstacles=slottedWall().panels;
  }
  if(mode==='hard') { source=[-90,-130,100]; destination=[100,130,100]; size=[84,14,14]; down(arms[0],[-140,-150,170]); down(arms[1],[140,150,170]); }
  return {version:1,mode,arms,source,destination,destinationRotation:mode==='medium'?rotationFromEuler([-90,-30,90]):[...I],obstacles,wall:mode==='medium'?slottedWall():null,part:{position:[...source],rotation:[...I],size,owner:null,receiver:null,offset:null,relativeRotation:null},
    evidence:{picked:false,gate:false,slotEntry:false,handoff:false,delivered:false,jointMove:false},complete:false};
}
export const armById=(world,id)=>world.arms.find(a=>a.id===id);
export function gripPoint(world,id) {
  const offset=world.mode==='hard'?[id==='A'?-42:42,0,0]:[0,0,0];
  return add(world.part.position,transform(world.part.rotation,offset));
}
function carry(world) {
  const part=world.part;if(!part.owner)return;
  const p=pose(armById(world,part.owner)); part.position=add(p.tip,transform(p.rotation,part.offset));part.rotation=multiply(p.rotation,part.relativeRotation);
}
export function atPose(world,id,q) {const next=clone(world);armById(next,id).q=[...q];carry(next);return next;}
function segmentBox(a,b,box,pad=0) {
  if(box.polygon)return segmentPanel(a,b,box,pad);
  let lo=0,hi=1;
  for(let i=0;i<3;i++){const d=b[i]-a[i],mn=box.min[i]-pad,mx=box.max[i]+pad;if(Math.abs(d)<1e-9){if(a[i]<mn||a[i]>mx)return false;}else{let x=(mn-a[i])/d,y=(mx-a[i])/d;if(x>y)[x,y]=[y,x];lo=Math.max(lo,x);hi=Math.min(hi,y);if(lo>hi)return false;}}return true;
}
// Squared closest distance between two finite segments (including zero lengths).
function segmentDistance(a,b,c,d) {
  const u=sub(b,a),v=sub(d,c),w=sub(a,c),dot=(x,y)=>x.reduce((s,n,i)=>s+n*y[i],0),A=dot(u,u),B=dot(u,v),C=dot(v,v),D=dot(u,w),E=dot(v,w);
  let s=0,t=0; const clamp=x=>Math.max(0,Math.min(1,x));
  if(A<1e-9)t=C?clamp(E/C):0;else if(C<1e-9)s=clamp(-D/A);else {s=Math.abs(A*C-B*B)>1e-9?clamp((B*E-C*D)/(A*C-B*B)):0;t=(B*s+E)/C;if(t<0){t=0;s=clamp(-D/A);}else if(t>1){t=1;s=clamp((B-D)/A);}}
  return distance(add(a,u.map(x=>x*s)),add(c,v.map(x=>x*t)));
}
export function bounds(position,rotation,size) {const half=[0,1,2].map(i=>size.reduce((s,n,j)=>s+Math.abs(rotation[i*3+j])*n/2,0));return {min:sub(position,half),max:add(position,half)};}
const overlap=(a,b)=>[0,1,2].every(i=>a.min[i]<b.max[i]-.01&&a.max[i]>b.min[i]+.01);
const hitsBox=(shape,box)=>box.polygon?boxPanel(shape.position,shape.rotation,shape.size,box):overlap(bounds(shape.position,shape.rotation,shape.size),box);
const boundsShape=b=>({position:b.min.map((v,i)=>(v+b.max[i])/2),rotation:I,size:b.max.map((v,i)=>v-b.min[i])});
// Contact bounds follow the existing main-lab FAIRINO gripper (local Y jaw travel).
export function gripperParts(arm,q=arm.q) {
  const p=pose(arm,q),gap=arm.closed?10:26;
  return [[[0,0,38],[26,26,4]],[[0,0,32],[14,14,8]],[[0,0,23],[22,54,12]],...[-1,1].map(s=>[[0,s*gap,3],[12,6,32]])].map(([centre,size])=>({position:add(p.tip,transform(p.rotation,centre)),rotation:p.rotation,size}));
}
export function armSegments(arm){
 const p=pose(arm);
 return p.points.slice(1).map((b,i)=>({a:p.points[i],b,radius:i===0?33:i===p.points.length-2?13:Math.max(9,18-(i-1)*2)}));
}
export function jointBounds(arm){
 const p=pose(arm);
 return p.origins.slice(1).map((origin,i)=>{const axis=p.axes[i+1],radius=Math.max(13,23-i*2),half=(i<2?40:30)/2+2.1;
  const extent=axis.map(v=>radius*Math.sqrt(Math.max(0,1-v*v))+Math.abs(v)*half);
  return {min:sub(origin,extent),max:add(origin,extent)};
 });
}
export function collision(world) {
  for(const arm of world.arms) {
    if(!validJoints(arm,arm.q))return 'limits';
    const p=pose(arm),segments=armSegments(arm);
    for(let i=0;i<p.points.length-1;i++)for(let j=i+3;j<p.points.length-1;j++)if(segmentDistance(p.points[i],p.points[i+1],p.points[j],p.points[j+1])<segments[i].radius+segments[j].radius)return 'selfCollision';
    if(p.points.slice(2).some(point=>point[2]<10)||gripperParts(arm).some(g=>bounds(g.position,g.rotation,g.size).min[2]<0))return 'table';
    for(const box of world.obstacles) {
      if(segments.some(s=>segmentBox(s.a,s.b,box,s.radius)))return 'obstacle';
      if(jointBounds(arm).some(j=>hitsBox(boundsShape(j),box)))return 'obstacle';
      if(gripperParts(arm).some(g=>hitsBox(g,box)))return 'obstacle';
    }
  }
  if(world.part.owner) {
    const b=bounds(world.part.position,world.part.rotation,world.part.size);
    if(b.min[2]<0)return 'table'; if(world.obstacles.some(o=>hitsBox(world.part,o)))return 'partCollision';
  }
  if(world.arms.length===2) {
    const a=pose(world.arms[0]).points,b=pose(world.arms[1]).points,sa=armSegments(world.arms[0]),sb=armSegments(world.arms[1]);
    for(let i=0;i<a.length-1;i++)for(let j=0;j<b.length-1;j++)if(segmentDistance(a[i],a[i+1],b[j],b[j+1])<sa[i].radius+sb[j].radius+2)return 'armCollision';
    for(let side=0;side<2;side++){const other=pose(world.arms[1-side]).points;for(const g of gripperParts(world.arms[side]))for(let i=0;i<other.length-1;i++)if(segmentBox(other[i],other[i+1],bounds(g.position,g.rotation,g.size),(side?sa:sb)[i].radius))return 'armCollision';}
    for(const ga of gripperParts(world.arms[0]))for(const gb of gripperParts(world.arms[1]))if(overlap(bounds(ga.position,ga.rotation,ga.size),bounds(gb.position,gb.rotation,gb.size)))return 'armCollision';
    if(world.part.owner){const other=world.arms.find(a=>a.id!==world.part.owner),points=pose(other).points,part=bounds(world.part.position,world.part.rotation,world.part.size);
      // Only the final tool segment may make intended contact at a handoff grip point.
      for(let i=0;i<points.length-1;i++)if(!(i===points.length-2&&distance(pose(other).tip,gripPoint(world,other.id))<18&&pose(other).tip[2]>=gripPoint(world,other.id)[2]-1)&&segmentBox(points[i],points[i+1],part,6))return 'partCollision';
    }
  }
  return null;
}
export function planMove(world,id,q,kind='joints') {
  if(world.part.receiver)return {error:'handoffLocked'};
  const arm=armById(world,id);if(!arm||!validJoints(arm,q))return {error:'limits'};
  const start=arm.q,n=Math.max(1,Math.ceil(Math.max(...q.map((v,i)=>Math.abs(v-start[i])))/.5)),samples=[];
  let crossed=world.evidence.gate,entering=world.evidence.slotEntry,previous=world.part.position;
  for(let i=1;i<=n;i++) {
    const next=atPose(world,id,start.map((v,k)=>v+(q[k]-v)*i/n)),error=collision(next);if(error)return {error};
    const p=next.part.position;
    if(world.wall&&world.part.owner===id&&previous[0]<world.wall.planeX&&p[0]>=world.wall.planeX){
      const wall=world.wall,dx=p[1]-wall.centre[1],dz=p[2]-wall.centre[2];
      if(Math.abs(dx*wall.u[0]+dz*wall.u[1])<wall.width/2&&Math.abs(dx*wall.v[0]+dz*wall.v[1])<wall.height/2){
        if(!slotAligned(next.part,wall))return {error:'slotAlignment'};
        entering=true;
      }
    }
    if(world.wall&&world.part.owner===id){const b=bounds(next.part.position,next.part.rotation,next.part.size);if(entering&&b.min[0]>world.wall.planeX+world.wall.depth/2)crossed=true;if(b.max[0]<world.wall.planeX-world.wall.depth/2)entering=false;}
    previous=p;samples.push(next);
  }
  const end=samples.at(-1);end.evidence.gate=crossed;end.evidence.slotEntry=entering;
  if(kind==='joints'&&arm.axes===6&&distance(start,q)>.1)end.evidence.jointMove=true;
  return {samples,end,duration:Math.max(250,Math.max(...q.map((v,i)=>Math.abs(v-start[i])))/55*1000)};
}
function success(world) {
  const e=world.evidence;world.complete=e.delivered&&e.picked&&(world.mode!=='medium'||(e.gate&&e.jointMove))&&(world.mode!=='hard'||e.handoff);return world;
}
export function applyAction(world,step) {
  const next=clone(world),arm=armById(next,step.arm);if(!arm)return {error:'arm'};
  if(step.type==='move')return planMove(world,step.arm,step.q,step.kind);
  if(step.type==='close') {
    if(arm.closed)return {error:'alreadyClosed'};
    if(next.mode==='hard'&&arm.id==='B'&&next.part.owner==='A') {
      if(distance(pose(arm).tip,gripPoint(next,'B'))>3)return {error:'handoffPosition'};
      const rotation=pose(arm).rotation;
      if(rotation[8]<.96||next.part.rotation[8]<.96||Math.abs([1,4,7].reduce((sum,i)=>sum+rotation[i]*next.part.rotation[i],0))<.96)return {error:'handoffOrientation'};
      arm.closed=true;next.part.receiver='B';
    } else {
    if(next.part.owner)return {error:'occupied'};
    if(distance(pose(arm).tip,gripPoint(next,arm.id))>3)return {error:'gripPosition'};
    if(arm.axes===6&&Math.abs([1,4,7].reduce((sum,i)=>sum+pose(arm).rotation[i]*next.part.rotation[i],0))<.96)return {error:'gripOrientation'};
    if(next.mode==='hard'&&arm.id!=='A')return {error:'firstArm'};
    arm.closed=true;const p=pose(arm);next.part.owner=arm.id;next.part.offset=transform(transpose(p.rotation),sub(next.part.position,p.tip));next.part.relativeRotation=multiply(transpose(p.rotation),next.part.rotation);next.evidence.picked=true;next.evidence.delivered=false;
    }
  } else if(step.type==='handoff') {
    return {error:'handoffSteps'};
  } else if(step.type==='open') {
    if(next.part.receiver===arm.id){
      // B can let go again without disturbing A's grip or completing a handoff.
      next.part.receiver=null;
    }else if(next.part.receiver&&next.part.owner===arm.id){
      const receiver=armById(next,next.part.receiver),p=pose(receiver);
      next.part.owner=receiver.id;next.part.receiver=null;
      next.part.offset=transform(transpose(p.rotation),sub(next.part.position,p.tip));next.part.relativeRotation=multiply(transpose(p.rotation),next.part.rotation);next.evidence.handoff=true;
    }else if(next.part.owner===arm.id) {
      const atSource=distance(next.part.position,next.source)<4,atDestination=distance(next.part.position,next.destination)<4;
      if(!atSource&&!atDestination)return {error:'unsupported'};
      if(atDestination&&next.mode==='medium'&&Math.abs([0,3,6].reduce((s,i)=>s+next.part.rotation[i]*next.destinationRotation[i],0))<.98)return {error:'socketOrientation'};
      if(atDestination&&next.mode==='hard'&&(arm.id!=='B'||!next.evidence.handoff))return {error:'handoffOrder'};
      next.part.owner=null;next.part.offset=null;next.part.relativeRotation=null;
      if(atDestination)next.evidence.delivered=true;
    }
    arm.closed=false;
  } else return {error:'command'};
  const error=collision(next);return error?{error}:{end:success(next),duration:150};
}
export function validateSequence(mode,steps) {
  let world=initialWorld(mode);if(!Array.isArray(steps)||steps.length>100)return {error:'program'};
  for(let i=0;i<steps.length;i++){const r=applyAction(world,steps[i]);if(r.error)return {error:r.error,index:i};world=r.end;}
  return {end:world};
}
// Preserve earlier saved programs by expanding the retired one-click handoff.
export function upgradeHandoffSteps(mode,steps){
  if(!Array.isArray(steps))return steps;
  return steps.flatMap(s=>mode==='hard'&&s?.type==='handoff'&&s.arm==='A'?[{type:'close',arm:'B'},{type:'open',arm:'A'}]:[clone(s)]);
}
export class ChallengeController {
  constructor(mode='easy',onChange=()=>{}) {this.world=initialWorld(mode);this.onChange=onChange;this.program=[];this.operation=null;this.running=false;this.paused=false;this.index=-1;this.lastError=null;this.lastErrorIndex=null;this.clearMetrics();}
  clearMetrics(){this.verifiedProgram=null;this.lastError=null;this.lastErrorIndex=null;this.metrics={elapsed:0,moves:0,actions:0,steps:[],status:'timerReady'};}
  get complete(){return !this.busy&&!this.lastError&&this.world.complete&&this.metrics.status==='timerComplete'&&this.verifiedProgram===JSON.stringify(this.program);}
  emit(){this.onChange(this);}
  get busy(){return !!this.operation||this.running;}
  reset(){this.stop();this.world=initialWorld(this.world.mode);this.lastError=null;this.lastErrorIndex=null;this.clearMetrics();this.emit();}
  selectMode(mode){this.stop();this.world=initialWorld(mode);this.program=[];this.lastError=null;this.lastErrorIndex=null;this.clearMetrics();this.emit();}
  execute(step){if(this.busy)return {error:'busy'};const r=applyAction(this.world,step);if(r.error){this.lastError=r.error;this.lastErrorIndex=null;this.emit();return r;}this.clearMetrics();this.operation={...r,elapsed:0};this.emit();return {ok:true};}
  add(step){if(this.busy)return {error:'busy'};if(this.program.length>=100)return {error:'program'};this.program.push(clone(step));this.clearMetrics();this.emit();return {ok:true};}
  edit(index,action){if(this.busy)return false;if(action==='delete')this.program.splice(index,1);else{const target=index+(action==='up'?-1:1);if(!this.program[target])return false;[this.program[index],this.program[target]]=[this.program[target],this.program[index]];}this.clearMetrics();this.emit();return true;}
  run(){if(this.busy)return {error:'busy'};if(!this.program.length)return {error:'empty'};this.clearMetrics();const checked=validateSequence(this.world.mode,this.program);if(checked.error&&checked.error!=='handoffLocked'){this.lastError=checked.error;this.lastErrorIndex=checked.index;this.metrics.status='timerInvalid';this.emit();return checked;}this.world=initialWorld(this.world.mode);this.lastError=null;this.lastErrorIndex=null;this.running=true;this.paused=false;this.metrics.status='timerRunning';this.index=0;this.startStep();this.emit();return {ok:true};}
  startStep(){if(this.index>=this.program.length){this.running=false;this.operation=null;this.metrics.status=this.world.complete?'timerComplete':'timerIncomplete';this.verifiedProgram=this.world.complete?JSON.stringify(this.program):null;return;}const r=applyAction(this.world,this.program[this.index]);if(r.error){this.lastError=r.error;this.lastErrorIndex=this.index;this.stop();this.metrics.status='timerInvalid';return;}this.operation={...r,elapsed:0};}
  tick(dt){if(!this.operation||this.paused||!Number.isFinite(dt))return;const op=this.operation,used=Math.max(0,Math.min(dt,100,op.duration-op.elapsed));op.elapsed+=used;if(this.running)this.metrics.elapsed+=used;const ratio=Math.min(1,op.elapsed/op.duration);
    if(op.samples?.length)this.world=clone(op.samples[Math.min(op.samples.length-1,Math.floor(ratio*op.samples.length))]);
    if(ratio===1){this.world=clone(op.end);this.operation=null;if(this.running){const step=this.program[this.index];this.metrics.actions++;if(step.type==='move')this.metrics.moves++;this.metrics.steps.push({arm:step.arm,type:step.type,duration:op.duration});this.index++;this.startStep();}}this.emit();}
  pause(){if(this.running){this.paused=!this.paused;this.metrics.status=this.paused?'timerPaused':'timerRunning';this.emit();}}
  stop(){if(this.running)this.metrics.status='timerStopped';this.operation=null;this.running=false;this.paused=false;this.index=-1;this.emit();}
}
