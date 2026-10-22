import {box,cylinder,xyz,I,at,bounds,alongY} from './collision.mjs?v=collision-20261022-1';
import {transform} from './kinematics.mjs?v=collision-20261022-1';
const zAxis=xyz([90,0,0]);
export const GRIPPER={maxOpening:62,clearance:1,travelOpening:0,jawSpeed:60};
export const LINK_RADII=[20,17,13,11,10],JOINT_RADII=[28,24,22,17,15,12],JOINT_LENGTHS=[38,44,39,30,27,24],CAP_RADII=[20,18,16,12,10,8],CAP_OFFSETS=[20,23,20.5,16,14.5,13];
export function gripperGeometry(width){
  const parts=[cylinder(12,12,10,[0,0,36],'metal',{rotation:zAxis,role:'mount'}),box([70,32,12],[0,0,29],'dark',{role:'housing'})];
  for(const y of [-16.5,16.5])parts.push(cylinder(1.8,1.8,62,[0,y,27],'metal',{rotation:xyz([0,0,90]),role:'rail'}));
  for(const side of [-1,1]){
    const x=side*(width/2+3.5),extra={side,role:'finger'};
    parts.push(box([12,28,8],[x,0,22],'shell',{...extra,role:'carrier'}),box([6,24,26],[x+side*.5,0,6],'metal',extra),box([1,22,18],[x-side*3,0,2],'#28302b',{...extra,role:'pad'}));
  }
  return parts;
}
const contactParts=at(gripperGeometry(0),[0,0,0]);
export const GRIPPER_CONTACT={
  bodyBottom:bounds(contactParts.filter(p=>!['finger','pad'].includes(p.part.role))).low[2],
  fingerBottom:bounds(contactParts.filter(p=>['finger','pad'].includes(p.part.role))).low[2],
};
function bevelCase(color){
  const profile=[];
  for(const [x,y,start] of [[9,22,0],[-9,22,90],[-9,-22,180],[9,-22,270]])for(let i=0;i<=4;i++){const a=(start+i*90/4)*Math.PI/180;profile.push([x,y,Math.cos(a),Math.sin(a)]);}
  // A rounded, beveled convex shell, shared by drawing and collision checks.
  const vertices=[],levels=[[-15,3],[-14.6,1.5],[-13.5,.4],[-12,0],[12,0],[13.5,.4],[14.6,1.5],[15,3]],n=profile.length;
  for(const [z,inset] of levels)for(const [x,y,c,s] of profile)vertices.push([x+(8-inset)*c,y+(8-inset)*s,z]);
  const faces=[Array.from({length:n},(_,i)=>n-1-i),Array.from({length:n},(_,i)=>i+n*(levels.length-1))];
  for(let j=0;j<levels.length-1;j++)for(let k=0;k<n;k++)faces.push([j*n+k,j*n+(k+1)%n,(j+1)*n+(k+1)%n,(j+1)*n+k]);
  return {kind:'convex',vertices,faces,color};
}
const geometryCache=new Map();
export function objectGeometry(o){
  const key=JSON.stringify([o.id,o.size,o.diameter,o.wall,o.floor,o.color,o.surface]);if(geometryCache.has(key))return geometryCache.get(key);
  const [w,l,h]=o.size,c=o.color||'#aab3a4',parts=[];
  if(o.container){
    const t=o.wall;for(const side of [-1,1])parts.push(box([t,l,h],[side*(w-t)/2,0,0],c,{part:'wall'}),box([w-2*t,t,h],[0,side*(l-t)/2,0],c,{part:'wall'}));
    parts.push(box([w-2*t,l-2*t,o.floor],[0,0,-h/2+o.floor/2],c,{surface:true,part:'floor'}));
  }else if(o.id==='book'||o.id==='notebook'){
    parts.push(box([w-2,l-3,h-4],[0,0,0],'#f7eed9'),box([w,l,2],[0,0,h/2-1],c),box([w,l,2],[0,0,-h/2+1],c),box([4,l,h],[-w/2+2,0,0],c));
  }else if(o.id==='pen'||o.id==='pencil'){
    const r=o.diameter/2;
    parts.push(cylinder(r,r,64,[0,-3,0],c,{segments:o.id==='pencil'?6:24}),cylinder(0,r,14,[0,36,0],o.id==='pencil'?'#d7bc8f':'#aeb6b8',{segments:12}),cylinder(0,2.2,5,[0,41.5,0],'#343d3b',{segments:12}),cylinder(r,r,13,[0,-37.5,0],o.id==='pencil'?'#ce8c85':'#294d70'));
    if(o.id==='pen')parts.push(box([2,24,2],[0,-22,6],'#c6cccc'));
  }else if(o.id==='organizer'){
    parts.push(box([w,l,8],[0,0,h/2-4],'#c19e73',{surface:true,part:'top'}));
    for(const x of [-w/2+12,w/2-12])parts.push(box([16,l-12,h-8],[x,0,-4],'#a7835d',{part:'leg'}));
  }else if(o.id==='laptop'){
    parts.push(box([125,110,5],[0,-7,-h/2+2.5],'#9aa4a6'),box([107,57,1],[0,3,-h/2+5.1],'#485359'),box([38,23,.7],[0,-43,-h/2+5.2],'#bcc3c4'));
    for(let x=-46;x<=46;x+=10)for(let y=-18;y<=24;y+=9)parts.push(box([7,6,.8],[x,y,-h/2+6],'#c3cacc'));
    const r=xyz([-.16*180/Math.PI,0,0]),origin=[0,38,-h/2+5];
    for(const [size,center,color] of [[[125,6,88],[0,0,44],'#445057'],[[115,1,76],[0,-3.6,44],'#7f9ea9'],[[102,1,6],[0,-4.2,72],'#d8e2de'],[[38,1,43],[-29,-4.2,42],'#e1e7dc'],[[48,1,25],[21,-4.2,50],'#adc6c0']])parts.push(box(size,transform(r,center).map((v,i)=>v+origin[i]),color,{rotation:r,part:'lid'}));
  }else if(o.id==='lamp'){
    parts.push(cylinder(25,25,8,[0,0,-h/2+4],'#b39c61',{rotation:zAxis}),cylinder(4,4,h-34,[0,0,-5],'#687b6e',{rotation:zAxis}),cylinder(14,29,31,[0,0,h/2-17],'#d3b76f',{rotation:zAxis,segments:32}),cylinder(19,19,1,[0,0,h/2-33],'#fff4c9',{rotation:zAxis}));
  }else if(o.id==='glue'){
    parts.push(cylinder(12,12,34,[0,0,-6],c,{rotation:zAxis}),cylinder(12,12,12,[0,0,17],'#4c7899',{rotation:zAxis}),cylinder(12.1,12.1,16,[0,0,-3],'#fff2c9',{rotation:zAxis}));
    for(let i=0;i<12;i++){const a=i*Math.PI/6;parts.push(box([1.3,1.3,9],[Math.cos(a)*11.8,Math.sin(a)*11.8,17],'#6d98b4'));}
  }else if(o.id==='eraser')parts.push(box(o.size,[0,0,0],c),box([30.4,24,20.4],[0,3,0],'#f4efdf'));
  else if(o.id==='pencilcase'){
    parts.push(bevelCase(c),box([2,49,1],[0,0,15],'#dbcdb0'),box([5,8,1.5],[0,-19,16],'#d5cdbd'));
    for(let i=-22;i<=22;i+=4)parts.push(box([3,1,1.1],[0,i,15],'#5e7564'));
  }else if(o.id==='clock'){
    parts.push(cylinder(17,17,18,[0,0,2],c,{rotation:xyz([0,0,90])}),cylinder(14.5,14.5,1,[9.5,0,2],'#fff7df',{rotation:xyz([0,0,90])}),cylinder(3,3,4,[0,0,21],'#956652',{rotation:zAxis}));
    for(const y of [-10,10])parts.push(box([24,5,8],[0,y,-19],'#956652'));
    for(let i=0;i<12;i++){const a=i*Math.PI/6;parts.push(box([1.5,2,2],[10.3,Math.sin(a)*11,2+Math.cos(a)*11],'#455c56'));}
    parts.push(box([2,1.2,10],[10.8,0,7],'#455c56',{rotation:xyz([.2*180/Math.PI,0,0])}),box([2,8,1.2],[10.8,3,2],'#455c56'));
  }else parts.push(box(o.size,[0,0,0],c,{surface:o.surface}));
  geometryCache.set(key,parts);return parts;
}
const cache=new WeakMap();
export function objectShapes(o){
  const key=JSON.stringify([o.id,o.position,o.rpy,o.size,o.diameter,o.wall,o.floor]);
  const previous=cache.get(o);if(previous?.key===key)return previous.parts;
  const parts=at(objectGeometry(o),o.position||[0,0,0],xyz(o.rpy||[0,0,0]));cache.set(o,{key,parts});return parts;
}
export const objectBounds=o=>bounds(objectShapes(o));
export function armGeometry(pose){
  const parts=[];
  pose.points.slice(1).forEach((b,i)=>{const a=pose.points[i],d=b.map((v,j)=>v-a[j]);parts.push(cylinder(LINK_RADII[i],LINK_RADII[i],Math.hypot(...d),a.map((v,j)=>(v+b[j])/2),'shell',{rotation:alongY(d),part:'arm link'}));});
  pose.origins.forEach((p,i)=>{
    const rotation=alongY(pose.axes[i]);parts.push(cylinder(JOINT_RADII[i],JOINT_RADII[i],JOINT_LENGTHS[i],p,'dark',{rotation,part:'joint'}),cylinder(CAP_RADII[i],CAP_RADII[i],2,p.map((v,k)=>v+pose.axes[i][k]*CAP_OFFSETS[i]),'shell',{rotation,part:'joint cap'}));
  });return parts;
}
export function projectedWidth(object,relativeRotation=I){
  const b=bounds(at(objectGeometry(object),[0,0,0],relativeRotation));return b.high[0]-b.low[0];
}
