// Convex parts share their dimensions with the renderer. AABBs only reject
// distant pairs; final overlap uses face and edge separating axes (SAT).
import {rotationFromEuler,multiply,transform} from './kinematics.mjs?v=vision-20261022-1';
export const I=[1,0,0,0,1,0,0,0,1];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const norm=a=>{const n=Math.hypot(...a);return n<1e-10?null:a.map(v=>v/n);};
const local=(r,v)=>[r[0]*v[0]+r[3]*v[1]+r[6]*v[2],r[1]*v[0]+r[4]*v[1]+r[7]*v[2],r[2]*v[0]+r[5]*v[1]+r[8]*v[2]];
const unique=vectors=>{const out=[];for(const v of vectors){const n=norm(v);if(n&&!out.some(a=>Math.abs(dot(a,n))>1-1e-9))out.push(n);}return out;};
const models=new Map(),partModels=new WeakMap();
function model(part){
  if(partModels.has(part))return partModels.get(part);
  // Cylinder axes do not depend on radius or length. Link lengths contain
  // tiny FK rounding differences; do not turn those into new cached meshes.
  // Projection below always uses the live primitive dimensions.
  const key=part.kind==='cylinder'&&part.top===part.bottom?'cylinder-axes-'+(part.segments||40):JSON.stringify([part.kind,part.size,part.top,part.bottom,part.height,part.segments,part.vertices,part.faces]);
  if(models.has(key)){const result=models.get(key);partModels.set(part,result);return result;}
  let vertices=[],faces=[],normals=[],edges=[];
  if(part.kind==='box'){
    const [x,y,z]=part.size.map(v=>v/2);
    vertices=[[-x,-y,-z],[x,-y,-z],[x,y,-z],[-x,y,-z],[-x,-y,z],[x,-y,z],[x,y,z],[-x,y,z]];
    faces=[[0,3,2,1],[4,5,6,7],[0,1,5,4],[3,7,6,2],[0,4,7,3],[1,2,6,5]];
  }else if(part.kind==='cylinder'){
    const n=part.segments||40,h=part.height/2;
    for(const [y,r] of [[-h,part.bottom],[h,part.top]])for(let k=0;k<n;k++){const a=k*2*Math.PI/n;vertices.push([Math.sin(a)*r,y,Math.cos(a)*r]);}
    faces=[Array.from({length:n},(_,i)=>n-1-i),Array.from({length:n},(_,i)=>i+n)];
    for(let k=0;k<n;k++)faces.push([k,(k+1)%n,(k+1)%n+n,k+n]);
  }else {vertices=part.vertices;faces=part.faces;}
  for(const face of faces){
    const a=vertices[face[0]];
    for(let k=1;k<face.length-1;k++){const n=norm(cross(sub(vertices[face[k]],a),sub(vertices[face[k+1]],a)));if(n){normals.push(n);break;}}
    face.forEach((index,k)=>edges.push(sub(vertices[face[(k+1)%face.length]],vertices[index])));
  }
  const result={vertices,faces,normals:unique(normals),edges:unique(edges)};models.set(key,result);partModels.set(part,result);return result;
}
export function shape(part,position=[0,0,0],rotation=I){
  const r=multiply(rotation,part.rotation||I),shift=transform(rotation,part.center||[0,0,0]),centre=position.map((v,i)=>v+shift[i]),m=model(part);
  const result={part,model:m,position:centre,rotation:r,normals:m.normals.map(n=>transform(r,n)),edges:m.edges.map(e=>transform(r,e))};
  const extents=[0,1,2].map(i=>{const axis=[0,0,0];axis[i]=1;return [-support(result,axis.map(v=>-v)),support(result,axis)];});
  result.low=extents.map(e=>e[0]);result.high=extents.map(e=>e[1]);return result;
}
export function support(s,axis){
  const d=local(s.rotation,axis),p=s.part;
  let value;
  if(p.kind==='box')value=p.size.reduce((sum,v,i)=>sum+Math.abs(d[i])*v/2,0);
  else if(p.kind==='cylinder'){
    const n=p.segments||40,a=Math.round(Math.atan2(d[0],d[2])*n/(2*Math.PI))*2*Math.PI/n,radial=Math.sin(a)*d[0]+Math.cos(a)*d[2];
    value=Math.max(radial*p.top+d[1]*p.height/2,radial*p.bottom-d[1]*p.height/2);
  }else value=Math.max(...s.model.vertices.map(v=>dot(d,v)));
  return dot(s.position,axis)+value;
}
export function broadOverlap(a,b,margin=0){return a.low.every((v,i)=>v<b.high[i]+margin&&a.high[i]>b.low[i]-margin);}
export function overlaps(a,b,margin=0){
  if(!broadOverlap(a,b,margin))return false;
  const separate=axis=>{const size=Math.hypot(...axis);if(size<1e-9)return false;const d=size===1?axis:axis.map(v=>v/size);return Math.min(support(a,d),support(b,d))+Math.min(support(a,d.map(v=>-v)),support(b,d.map(v=>-v)))<=-margin+1e-8;};
  for(const axis of a.normals)if(separate(axis))return false;
  for(const axis of b.normals)if(separate(axis))return false;
  for(const x of a.edges)for(const y of b.edges)if(separate(cross(x,y)))return false;
  return true;
}
export const bounds=parts=>({low:[0,1,2].map(i=>Math.min(...parts.map(p=>p.low[i]))),high:[0,1,2].map(i=>Math.max(...parts.map(p=>p.high[i])))});
export function at(parts,position,rotation=I){return parts.map(p=>shape(p,position,rotation));}
export const box=(size,center=[0,0,0],color,extra={})=>({kind:'box',size,center,color,...extra});
export const cylinder=(top,bottom,height,center=[0,0,0],color,extra={})=>({kind:'cylinder',top,bottom,height,center,color,segments:40,...extra});
export const xyz=degrees=>rotationFromEuler(degrees);

// Same Y-axis alignment as Three.js setFromUnitVectors([0,1,0], direction).
export function alongY(direction){
  const y=norm(direction)||[0,1,0],d=y[1]+1;
  if(d<1e-10)return [-1,0,0,0,-1,0,0,0,1];
  const q=[y[2],0,-y[0],d],l=Math.hypot(...q),[x,b,z,w]=q.map(v=>v/l);
  return [1-2*(b*b+z*z),2*(x*b-z*w),2*(x*z+b*w),2*(x*b+z*w),1-2*(x*x+z*z),2*(b*z-x*w),2*(x*z-b*w),2*(b*z+x*w),1-2*(x*x+b*b)];
}
