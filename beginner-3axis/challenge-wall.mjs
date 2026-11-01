// The visible wall and collision checks share the same four convex panels.
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
function clip(poly,n,k){
 const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=dot(a,n)-k,db=dot(b,n)-k;
  if(da<=1e-8)out.push(a);if((da<0)!==(db<0)){const t=da/(da-db);out.push(a.map((v,j)=>v+(b[j]-v)*t));}}
 return out;
}
export function slottedWall({centre=[0,180],width=132,height=64,left=-200}={}){
 const angle=30*Math.PI/180,u=[Math.cos(angle),Math.sin(angle)],v=[-Math.sin(angle),Math.cos(angle)];
 const outer=[[left,0],[200,0],[200,540],[left,540]],uc=dot(centre,u),vc=dot(centre,v);
 const half=(poly,n,k)=>clip(poly,n,k),neg=n=>n.map(x=>-x);
 const middle=half(half(outer,u,uc+width/2),neg(u),-uc+width/2);
 const polygons=[half(outer,u,uc-width/2),half(outer,neg(u),-uc-width/2),half(middle,v,vc-height/2),half(middle,neg(v),-vc-height/2)];
 return {angle:30,centre:[215,centre[0],centre[1]],planeX:215,width,height,u,v,depth:12,
  opening:[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>centre.map((x,i)=>x+a*u[i]*width/2+b*v[i]*height/2)),
  panels:polygons.map(polygon=>({polygon,planeX:215,min:[Math.min(...polygon.map(p=>p[0])),-6,Math.min(...polygon.map(p=>p[1]))],max:[Math.max(...polygon.map(p=>p[0])),6,Math.max(...polygon.map(p=>p[1]))]}))};
}
const local=(p,box)=>[p[1],box.planeX-p[0],p[2]];
const normals=box=>box.polygon.map((a,i)=>{const b=box.polygon[(i+1)%box.polygon.length],n=[b[1]-a[1],0,a[0]-b[0]],l=Math.hypot(...n);return n.map(x=>x/l);});
export function segmentPanel(a,b,box,pad=0){
 a=local(a,box);b=local(b,box);
 let lo=0,hi=1;const planes=[{n:[0,1,0],k:box.max[1]},{n:[0,-1,0],k:-box.min[1]},...normals(box).map((n,i)=>({n,k:dot(n,[box.polygon[i][0],0,box.polygon[i][1]])}))];
 for(const {n,k}of planes){const da=dot(n,a)-k-pad,db=dot(n,b)-k-pad;if(da>0&&db>0)return false;if(da>0)lo=Math.max(lo,da/(da-db));if(db>0)hi=Math.min(hi,da/(da-db));if(lo>hi)return false;}return true;
}
// Separating-axis test: an oriented box against a convex wall prism.
export function boxPanel(position,rotation,size,panel){
 position=local(position,panel);rotation=[...rotation.slice(3,6),...rotation.slice(0,3).map(v=>-v),...rotation.slice(6,9)];
 const axes=[0,1,2].map(i=>[rotation[i],rotation[3+i],rotation[6+i]]),wallAxes=[[0,1,0],...normals(panel)],edges=[[0,1,0],...panel.polygon.map((a,i)=>{const b=panel.polygon[(i+1)%panel.polygon.length];return [b[0]-a[0],0,b[1]-a[1]];})];
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const vertices=panel.polygon.flatMap(([x,z])=>[[x,panel.min[1],z],[x,panel.max[1],z]]);
 for(const axis of [...axes,...wallAxes,...axes.flatMap(a=>edges.map(b=>cross(a,b)))]){
  const length=Math.hypot(...axis);if(length<1e-8)continue;const n=axis.map(x=>x/length),c=dot(n,position),r=axes.reduce((s,a,i)=>s+Math.abs(dot(n,a))*size[i]/2,0),values=vertices.map(p=>dot(n,p));
  if(c+r<=Math.min(...values)+.01||c-r>=Math.max(...values)-.01)return false;
 }return true;
}
export function slotAligned(part,wall){return Math.abs(part.rotation[3]*wall.u[0]+part.rotation[6]*wall.u[1])>Math.cos(12*Math.PI/180);}
