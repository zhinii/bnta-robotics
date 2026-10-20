import { homeFor, ikTool, toolPose, valid, distance } from './kinematics.mjs';

export const PADS = { left: [175, -145, 18], right: [175, 145, 18] };
export const HOME = [210, 0, 150];
export const BLOCKS = ['red', 'blue', 'yellow'];
export function blocksAbove(state, id) {
  const support=state.objects.find(o=>o.id===id);
  return state.objects.filter(o=>o.id!==id && o.id!==state.held && Math.hypot(o.position[0]-support.position[0],o.position[1]-support.position[1])<35 && o.position[2]>support.position[2]+1);
}
export function initialState() {
  const solved = ikTool(HOME, homeFor(6), 'nearest', [0, 0, 0]);
  if (!solved.q) throw Error('home');
  return { q: solved.q, held: null, yaw: 0, objects: [
    { id: 'red', position: [240, -70, 18], yaw: 0 },
    { id: 'blue', position: [275, 0, 18], yaw: 0 },
    { id: 'yellow', position: [240, 70, 18], yaw: 0 },
  ] };
}
export function snapshot(s) {
  return { joints: s.q.map(n => +n.toFixed(2)), tool: toolPose(s.q).tip.map(n => +n.toFixed(1)),
    held: s.held, yaw: s.yaw, objects: s.objects.map(o=>({...structuredClone(o),clearAbove:blocksAbove(s,o.id).length===0})), destinations: PADS,
    capabilities: ['pick an uncovered block', 'place on left or right pad', 'stack on an uncovered block', 'rotate held block', 'home when empty', 'dance when empty'], units: 'mm/degrees' };
}
function segmentDistance(p, a, b) {
  const ab = b.map((v,i) => v-a[i]);
  const t = Math.max(0, Math.min(1, p.reduce((sum,v,i)=>sum+(v-a[i])*ab[i],0)/(ab.reduce((sum,v)=>sum+v*v,0)||1)));
  return distance(p, a.map((v,i)=>v+t*ab[i]));
}
export function clearPose(q, state, contact = null) {
  if (!valid(q)) return false;
  const pose = toolPose(q), tip = pose.tip;
  if (tip[2] < 17.7) return false;
  for (const block of state.objects) {
    if (block.id === state.held) continue;
    // Conservative sphere around each cube; arm links must clear all cubes.
    for (let i=1;i<pose.points.length;i++) {
      if (segmentDistance(block.position, pose.points[i-1], pose.points[i]) < 40) return false;
    }
    // A supported cube touches the top face at a centre separation of 36 mm.
    // Keep the conservative horizontal envelope, but permit clearance above a top face.
    const aboveTop=tip[2]-block.position[2]>=(state.held?35.7:27);
    if (block.id !== contact && !aboveTop && distance(tip, block.position) < (state.held ? 55 : 45)) return false;
  }
  return true;
}
export function validateActions(actions) {
  if (!Array.isArray(actions) || actions.length > 6) throw Error('invalid');
  return actions.map(a => {
    if (!a || typeof a !== 'object' || Array.isArray(a)) throw Error('invalid');
    const keys = { pick: ['type','object'], place: ['type','target'], rotate: ['type','angle'], home: ['type'], dance: ['type'] }[a.type];
    if (!keys || Object.keys(a).some(k=>!keys.includes(k))) throw Error('invalid');
    if (a.type==='pick' && !['red','blue','yellow'].includes(a.object)) throw Error('unknown');
    if (a.type==='place' && !Object.hasOwn(PADS,a.target) && !BLOCKS.includes(a.target)) throw Error('destination');
    if (a.type==='rotate' && (!Number.isFinite(a.angle) || Math.abs(a.angle)>180)) throw Error('angle');
    return {...a};
  });
}
// Preflight the complete request against a clone. Nothing moves until all steps pass.
export function planActions(state, actions) {
  validateActions(actions);
  const s = structuredClone(state), steps = [];
  function move(point, yaw=s.yaw, contact=null) {
    const start=toolPose(s.q).tip, startYaw=s.yaw;
    const count=Math.max(1,Math.ceil(distance(start,point)/9),Math.ceil(Math.abs(yaw-startYaw)/5));
    for(let i=1;i<=count;i++) {
      const target=start.map((v,j)=>v+(point[j]-v)*i/count), nextYaw=startYaw+(yaw-startYaw)*i/count;
      const result=ikTool(target,s.q,'nearest',[0,0,nextYaw]);
      if(!result.q) throw Error('reach');
      // Check swept joint interpolation, not just Cartesian endpoints.
      const subdivisions=Math.max(2,Math.ceil(Math.max(...result.q.map((v,j)=>Math.abs(v-s.q[j])))/.5));
      for(let k=1;k<=subdivisions;k++) {
        const q=s.q.map((v,j)=>v+(result.q[j]-v)*k/subdivisions);
        if(!clearPose(q,s,contact)) throw Error('blocked');
      }
      const seconds=Math.max(.045,distance(toolPose(s.q).tip,toolPose(result.q).tip)/110,Math.max(...result.q.map((v,j)=>Math.abs(v-s.q[j])))/65);
      s.q=result.q; s.yaw=nextYaw;
      if(s.held) { const b=s.objects.find(o=>o.id===s.held); b.position=toolPose(s.q).tip; b.yaw=nextYaw; }
      steps.push({type:'move',q:[...s.q],yaw:nextYaw,seconds});
    }
  }
  function cruiseTo(point,yaw=s.yaw,contact=null) {
    const current=toolPose(s.q).tip;
    const clearance=Math.max(120,...s.objects.filter(o=>o.id!==s.held).map(o=>o.position[2]+60));
    const startingContact=!s.held?s.objects.find(o=>distance(o.position,current)<25)?.id:null;
    move([current[0],current[1],Math.max(clearance,current[2])],s.yaw,startingContact||contact);
    move([point[0],point[1],clearance],yaw,contact);
    move(point,yaw,contact);
  }
  for(const action of actions) {
    if(action.type==='pick') {
      if(s.held) throw Error('holding');
      const block=s.objects.find(o=>o.id===action.object);
      if(blocksAbove(s,block.id).length) throw Error('covered');
      cruiseTo(block.position,block.yaw,block.id);
      s.held=block.id; steps.push({type:'grip',object:block.id});
      move([block.position[0],block.position[1],120]);
    } else if(action.type==='place') {
      if(!s.held) throw Error('empty');
      if(action.target===s.held) throw Error('selfStack');
      const support=s.objects.find(o=>o.id===action.target);
      if(support && blocksAbove(s,support.id).length) throw Error('covered');
      const point=support?[support.position[0],support.position[1],support.position[2]+36]:PADS[action.target];
      if(s.objects.some(o=>o.id!==s.held && o.id!==support?.id && Math.abs(o.position[2]-point[2])<35.7 && Math.hypot(o.position[0]-point[0],o.position[1]-point[1])<55)) throw Error('occupied');
      cruiseTo(point,support?support.yaw:s.yaw);
      s.objects.find(o=>o.id===s.held).position=[...point];
      const released=s.held;
      steps.push({type:'release',position:[...point]}); s.held=null;
      move([point[0],point[1],120],s.yaw,released);
    } else if(action.type==='rotate') {
      if(!s.held) throw Error('empty');
      const p=toolPose(s.q).tip; move([p[0],p[1],Math.max(p[2],120)]);
      const yaw=s.yaw+action.angle;
      if(Math.abs(yaw)>180) throw Error('angle');
      move(toolPose(s.q).tip,yaw);
    } else if(action.type==='dance') {
      if(s.held) throw Error('holding');
      cruiseTo(HOME,0);
      for(const [point,yaw] of [[[205,-35,130],-25],[[205,35,130],25],[[205,-35,130],-25],[[210,0,150],0],[[210,0,125],0],[HOME,0]]) move(point,yaw);
    } else {
      if(s.held) throw Error('holding');
      cruiseTo(HOME,0);
    }
  }
  return {steps, result:s};
}
export function applyStep(state, step) {
  if(step.type==='move') {
    state.q=[...step.q]; state.yaw=step.yaw;
    if(state.held) { const block=state.objects.find(o=>o.id===state.held); block.position=toolPose(state.q).tip; block.yaw=state.yaw; }
  } else if(step.type==='grip') state.held=step.object;
  else if(step.type==='release') { state.objects.find(o=>o.id===state.held).position=[...step.position]; state.held=null; }
}
