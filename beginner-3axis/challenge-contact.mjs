// Collision shapes use the same oriented boxes as the visible part and jaws.
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const axes=r=>[0,1,2].map(i=>[r[i],r[i+3],r[i+6]]);
export function boxesIntersect(a,b,skin=0){
 const aa=axes(a.rotation),bb=axes(b.rotation),delta=sub(b.position,a.position);
 for(const axis of [...aa,...bb,...aa.flatMap(x=>bb.map(y=>cross(x,y)))]){
  const length=Math.hypot(...axis);if(length<1e-8)continue;const n=axis.map(v=>v/length);
  const radius=(basis,size)=>basis.reduce((s,v,i)=>s+Math.abs(dot(v,n))*size[i]/2,0);
  if(Math.abs(dot(delta,n))>=radius(aa,a.size)+radius(bb,b.size)+skin-.01)return false;
 }return true;
}
// Clip the part against the fingers' X/Z contact faces, leaving Y (jaw travel)
// unbounded. This accepts a skewed bar's local cross-section rather than its
// whole bounding box, and never requires a particular pickup point or angle.
export function jawContact(tool,part){
 const basis=axes(tool.rotation),centre=sub(part.position,tool.tip).map((_,i)=>dot(sub(part.position,tool.tip),basis[i]));
 const partAxes=axes(part.rotation).map(a=>basis.map(b=>dot(a,b))),planes=[];
 partAxes.forEach((n,i)=>{for(const sign of [-1,1]){const normal=n.map(v=>v*sign);planes.push({n:normal,k:dot(normal,centre)+part.size[i]/2});}});
 // Less than 1 mm of contact tolerance, against 12 x 32 mm finger faces.
 planes.push({n:[1,0,0],k:6.8},{n:[-1,0,0],k:6.8},{n:[0,0,1],k:16.5},{n:[0,0,-1],k:13.8});
 const vertices=[];
 for(let a=0;a<planes.length;a++)for(let b=a+1;b<planes.length;b++)for(let c=b+1;c<planes.length;c++){
  const A=planes[a],B=planes[b],C=planes[c],bc=cross(B.n,C.n),det=dot(A.n,bc);if(Math.abs(det)<1e-8)continue;
  const ca=cross(C.n,A.n),ab=cross(A.n,B.n),p=bc.map((v,i)=>(v*A.k+ca[i]*B.k+ab[i]*C.k)/det);
  if(planes.every(({n,k})=>dot(n,p)<=k+1e-7))vertices.push(p);
 }
 if(!vertices.length)return null;
 const range=i=>[Math.min(...vertices.map(p=>p[i])),Math.max(...vertices.map(p=>p[i]))],x=range(0),y=range(1),z=range(2);
 // Both fingers need a real patch of contact, within the open 46 mm gap.
 if(x[1]-x[0]<2||z[1]-z[0]<2||y[1]-y[0]<2||y[0]<-23.8||y[1]>23.8||y[0]>.8||y[1]<-.8)return null;
 return {jawY:[Math.max(-26,y[0]-3),Math.min(26,y[1]+3)]};
}
