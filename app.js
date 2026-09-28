"use strict";(()=>{var Hn=[{name:"base",axis:[0,0,1],length:0,limits:[-180,180],home:0},{name:"shoulder",axis:[0,-1,0],length:160,limits:[-20,150],home:55},{name:"elbow",axis:[0,-1,0],length:140,limits:[-150,150],home:-85},{name:"swivel",axis:[0,0,1],length:70,limits:[-150,150],home:0},{name:"wristPitch",axis:[0,-1,0],length:55,limits:[-120,120],home:30},{name:"toolRoll",axis:[1,0,0],length:35,limits:[-180,180],home:0}],Cn={base:70,upper:160,fore:140,limits:Hn.map(i=>i.limits),home:Hn.slice(0,3).map(i=>i.home)},qr=i=>Hn.slice(0,i).map(e=>e.home),Rp=i=>Hn.slice(0,i).reduce((e,t)=>e+t.length,0),zn=Math.PI/180,Cp=[1,0,0,0,1,0,0,0,1],Pp=(i,e)=>i.map((t,n)=>t+e[n]),ku=(i,e)=>i.map((t,n)=>t-e[n]),Ip=(i,e)=>[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]],Dp=i=>[i[0],i[3],i[6],i[1],i[4],i[7],i[2],i[5],i[8]],Kn=(i,e)=>[0,1,2].map(t=>i[t*3]*e[0]+i[t*3+1]*e[1]+i[t*3+2]*e[2]);function Qn(i,e){return Array.from({length:9},(t,n)=>{let s=Math.floor(n/3),r=n%3;return i[s*3]*e[r]+i[s*3+1]*e[r+3]+i[s*3+2]*e[r+6]})}function sa([i,e,t],n){let s=Math.cos(n),r=Math.sin(n),o=1-s;return[o*i*i+s,o*i*e-r*t,o*i*t+r*e,o*i*e+r*t,o*e*e+s,o*e*t-r*i,o*i*t-r*e,o*e*t+r*i,o*t*t+s]}function ra([i,e,t]){return Qn(Qn(sa([0,0,1],t*zn),sa([0,1,0],e*zn)),sa([1,0,0],i*zn))}function Lp(i,e){let t=Qn(i,Dp(e)),n=Math.acos(Math.max(-1,Math.min(1,(t[0]+t[4]+t[8]-1)/2)));if(n<1e-8)return[0,0,0];let s=[t[7]-t[5],t[2]-t[6],t[3]-t[1]];if(Math.PI-n<1e-5){let r=[t[0],t[4],t[8]].indexOf(Math.max(t[0],t[4],t[8]));s=[0,0,0],s[r]=Math.sqrt(Math.max(0,(t[r*3+r]+1)/2));for(let o=0;o<3;o++)o!==r&&(s[o]=(t[r*3+o]+t[o*3+r])/(4*s[r]));return s.map(o=>o*n)}return s.map(r=>r*n/(2*Math.sin(n)))}function Oc(i){let e=[0,0,Cn.base],t=[...Cp],n=[[...e]],s=[],r=[],o=[];i.forEach((h,u)=>{let p=Hn[u];s.push([...e]),r.push(Kn(t,p.axis)),t=Qn(t,sa(p.axis,h*zn)),o.push([...t]),p.length&&(e=Pp(e,Kn(t,[p.length,0,0])),n.push([...e]))});let a=Math.asin(Math.max(-1,Math.min(1,-t[6]))),l=Math.abs(Math.cos(a))<1e-7,c=[l?0:Math.atan2(t[7],t[8]),a,l?Math.atan2(-t[1],t[4]):Math.atan2(t[3],t[0])].map(h=>h/zn);return{elbow:n[1],tip:e,points:n,origins:s,axes:r,frames:o,rotation:t,rpy:c}}var Bc=40,Np=[0,0,-1,0,1,0,1,0,0];function tt(i){let e=Oc(i),t=Kn(e.rotation,[Bc,0,0]),n=Qn(e.rotation,Np),s=Math.asin(Math.max(-1,Math.min(1,-n[6]))),r=Math.abs(Math.cos(s))<1e-7;return{...e,flange:[...e.tip],tip:e.tip.map((o,a)=>o+t[a]),rotation:n,rpy:[r?0:Math.atan2(n[7],n[8]),s,r?Math.atan2(-n[1],n[4]):Math.atan2(n[3],n[0])].map(o=>o/zn)}}var oa=i=>Rp(i)+Bc;function _i(i){if(!Array.isArray(i)||i.length<3||i.length>6||i.some((t,n)=>!Number.isFinite(t)||t<Hn[n].limits[0]-1e-7||t>Hn[n].limits[1]+1e-7))return!1;let{points:e}=Oc(i);return e.slice(1).every((t,n)=>t[2]>=(n===e.length-2?12:18))}var Dt=(i,e)=>Math.hypot(...i.map((t,n)=>t-e[n]));function Yr(i,e){if(i.length!==e.length||!_i(i)||!_i(e))return!1;let t=Math.max(1,Math.ceil(Math.max(...i.map((n,s)=>Math.abs(n-e[s])))/.5));for(let n=0;n<=t;n++)if(!_i(i.map((s,r)=>s+(e[r]-s)*n/t)))return!1;return!0}function Up(i,e,t,n=Cn.fore){let[s,r,o]=i,a=Math.hypot(s,r),l=o-Cn.base,c=(a*a+l*l-Cn.upper**2-n**2)/(2*Cn.upper*n);if(c>1+1e-9||c<-1-1e-9)return{error:"reach"};let h=[];for(let p of[1,-1])for(let m of[-1,1]){let g=a<1e-8?e[0]:Math.atan2(r,s)/zn+(p===-1?180:0);for(;g>180;)g-=360;for(;g<-180;)g+=360;let _=m*Math.acos(Math.max(-1,Math.min(1,c))),f=Math.atan2(l,p*a)-Math.atan2(n*Math.sin(_),Cn.upper+n*Math.cos(_)),d=[g,f/zn,_/zn];_i(d)&&(t==="nearest"||(t==="negative"?d[2]<=0:d[2]>=0))&&h.push(d)}if(h.sort((p,m)=>Dt(p,e)-Dt(m,e)),!h.length)return{error:"limits"};let u=h.find(p=>Yr(e,p));return u?{q:u}:{error:"path"}}function Fp(i,e){let t=i.map((s,r)=>[...s,e[r]]),n=t.length;for(let s=0;s<n;s++){let r=s;for(let a=s+1;a<n;a++)Math.abs(t[a][s])>Math.abs(t[r][s])&&(r=a);if([t[s],t[r]]=[t[r],t[s]],Math.abs(t[s][s])<1e-12)return null;let o=t[s][s];for(let a=s;a<=n;a++)t[s][a]/=o;for(let a=0;a<n;a++)if(a!==s){let l=t[a][s];for(let c=s;c<=n;c++)t[a][c]-=l*t[s][c]}}return t.map(s=>s[n])}function Op(i,e,t,n=Oc){let s=e.length,r=Math.atan2(i[1],i[0])/zn,o=[[...e],qr(s)];for(let l of[25,70,120])for(let c of[-110,-45,65]){let h=qr(s);h[0]=r,h[1]=l,h[2]=c,s>=4&&(h[3]=l===120?70:-35),o.push(h)}let a=!1;for(let l of o){let c=[...l];for(let h=0;h<280;h++){let u=n(c),p=ku(i,u.tip),m=t?Lp(t,u.rotation):[],g=[...p,...m.map(A=>A*90)];if(Math.hypot(...p)<.12&&(!t||Math.hypot(...m)<.004)){if(_i(c)){if(Yr(e,c))return{q:c};a=!0}break}let _=u.axes.map((A,C)=>[...Ip(A,ku(u.tip,u.origins[C])).map(N=>N*zn),...t?A.map(N=>N*zn*90):[]]),f=g.length,d=Array.from({length:f},(A,C)=>Array.from({length:f},(N,b)=>_.reduce((S,D)=>S+D[C]*D[b],0)+(C===b?.45:0))),M=Fp(d,g);if(!M)break;let v=_.map(A=>A.reduce((C,N,b)=>C+N*M[b],0)),x=Math.max(...v.map(Math.abs));x>9&&(v=v.map(A=>A*9/x));let T=c.map((A,C)=>Math.max(Hn[C].limits[0],Math.min(Hn[C].limits[1],A+v[C])));if(Dt(T,c)<1e-7)break;c=T}}return{error:a?"path":"solve"}}function Xi(i,e=Cn.home,t="nearest",n=null){return!Array.isArray(i)||i.length!==3||i.some(s=>!Number.isFinite(s))?{error:"numbers"}:_i(e)?n&&(e.length!==6||!Array.isArray(n)||n.length!==3||n.some(s=>!Number.isFinite(s)||Math.abs(s)>180))?{error:"orientationInvalid"}:Dt(i,[0,0,Cn.base])>oa(e.length)+1e-7?{error:"reach"}:i[2]<12?{error:"limits"}:e.length===3?Up(i,e,t,Cn.fore+Bc):Op(i,e,n?ra(n):null,tt):{error:"limits"}}var rn={open:27,thickness:6,min:3,xHalf:6,zMin:-13,zMax:19,capacity:42},Bp=[1,0,0,0,1,0,0,0,1];function Xs(i,e){let t=e.rotation,n=[t[0],t[3],t[6],t[1],t[4],t[7],t[2],t[5],t[8]],s=Kn(n,i.center.map((h,u)=>h-e.tip[u])),r=Qn(n,i.rotation||Bp),o=[0,1,2].map(h=>i.size.reduce((u,p,m)=>u+Math.abs(r[3*h+m])*p/2,0)),a=s.map((h,u)=>h-o[u]),l=s.map((h,u)=>h+o[u]),c=a[0]<rn.xHalf&&l[0]>-rn.xHalf&&a[2]<rn.zMax&&l[2]>rn.zMin;return{min:a,max:l,overlap:c,width:l[1]-a[1],fits:c&&a[1]>=-24&&l[1]<=24}}function kc(i,e){let t=-rn.min,n=rn.min;for(let s of i){let r=Xs(s,e);!r.overlap||r.min[1]>30||r.max[1]<-30||(t=Math.min(t,r.min[1]-rn.thickness/2),n=Math.max(n,r.max[1]+rn.thickness/2))}return[t,n]}var kp=[1,0,0,0,1,0,0,0,1];function Rt(i){let e=i.size.map(s=>s/2),t=i.rotation||kp,n=[0,1,2].map(s=>Math.abs(t[3*s])*e[0]+Math.abs(t[3*s+1])*e[1]+Math.abs(t[3*s+2])*e[2]);return{min:i.center.map((s,r)=>s-n[r]),max:i.center.map((s,r)=>s+n[r]),extent:n}}function aa(){return Array.from({length:6},(i,e)=>({id:String.fromCharCode(65+e),column:e%3,row:Math.floor(e/3),min:[74+e%3*70,70,20+Math.floor(e/3)*110],max:[136+e%3*70,150,124+Math.floor(e/3)*110]}))}function zu(){let i=(e,t)=>({min:e,max:t});return[...[20,130,240].map(e=>i([66,70,e-6],[284,154,e])),...[70,140,210,280].map(e=>i([e-2,70,14],[e+2,154,240])),i([66,150,14],[284,154,240])]}function la(i){let e=aa().find(t=>t.id===i);return[(e.min[0]+e.max[0])/2,110,e.min[2]+20]}function Hu(i){let e=Rt(i);return aa().find(t=>e.min[0]>=t.min[0]-.2&&e.max[0]<=t.max[0]+.2&&e.min[1]>=t.min[1]-.2&&e.max[1]<=t.max[1]+.2&&e.min[2]>=t.min[2]-1&&e.max[2]<=t.max[2])}function ca(i){return["sx","sy","sz","upper"].every((e,t)=>Number(i[e])===[35,40,20,130][t])}var Vu=(i,e)=>i.min.every((t,n)=>t<e.max[n]-.5&&i.max[n]>e.min[n]+.5);function zp(i,e=null,t=!1){let n=e&&Xs(e,i),r=(t?n?[n.min[1]-3,n.max[1]+3]:[-3,3]:[-rn.open,rn.open]).map(o=>({center:[0,o,3],size:[12,6,32]}));return r.push({center:[0,0,23],size:[22,54,12]},{center:[0,0,34],size:[26,26,16]}),r.map(o=>Rt({center:Kn(i.rotation,o.center).map((a,l)=>a+i.tip[l]),size:o.size,rotation:i.rotation}))}function ha(i,e,t,n,s=[]){return zp(i,e,t).some(o=>s.some(a=>Vu(o,a))||n.some(a=>a.id!==e?.id&&Vu(o,Rt(a))))}function Gu(i,e,t,n=0){let s=0,r=1;for(let o=0;o<3;o++){let a=e[o]-i[o],l=t.min[o]-n,c=t.max[o]+n;if(Math.abs(a)<1e-8){if(i[o]<l||i[o]>c)return!1;continue}let h=(l-i[o])/a,u=(c-i[o])/a;if(s=Math.max(s,Math.min(h,u)),r=Math.min(r,Math.max(h,u)),s>r)return!1}return!0}function Wu(i,e){return e.some(t=>i.points.slice(1).some((n,s)=>Gu(i.points[s],n,t,Math.max(9,18-s*2)))||i.origins.slice(1).some((n,s)=>Gu(n,n,t,Math.max(18,31-s*3))))}var Hp=[1,0,0,0,1,0,0,0,1],jr=[["A",60,40],["B",60,40],["C",40,40],["D",40,40],["E",40,20],["F",40,20]],Jr=["#e5bd75","#d99954","#70b9d6","#538bad","#b1c9df","#90a9c9"],zc={xy:5,angle:5,height:8},$u=i=>[i[0],i[3],i[6],i[1],i[4],i[7],i[2],i[5],i[8]],Zr=(i,e)=>i.min.every((t,n)=>t<e.max[n]-.5&&i.max[n]>e.min[n]+.5);function Vp(i="mission"){return{mode:i,size:i==="practice"?[120,80]:i==="transfer"?[180,140]:i==="shelf"?[210,80]:i==="stacking"?[120,100]:[160,140],origin:i==="shelf"?[70,70]:i==="practice"?[140,70]:[100,50],deck:20,stock:i==="practice"?jr.slice(0,1):jr,...i==="shelf"?{cells:aa(),solids:zu()}:i==="stacking"?{person:{center:[185,4,0],height:85},solids:[{min:[145,-12,0],max:[225,20,85]}]}:{}}}function ti(i,e=0){let t=jr.find(n=>n[0]===i);return t?e%180===0?t.slice(1):[t[2],t[1]]:null}function qs(i,e){let t=[],n=[];for(let[s]of e.stock){let r=i[s];if(!r){t.push({code:"missing",id:s});continue}if(![r.x,r.y,r.turn].every(Number.isFinite)||![0,90].includes(r.turn)){t.push({code:"invalid",id:s});continue}let[o,a]=ti(s,r.turn),l=r.z??0,c={id:s,x:r.x,y:r.y,w:o,h:a,z:l};[0,...e.mode==="stacking"?[20]:[]].includes(l)||t.push({code:"level",id:s}),(c.x<0||c.y<0||c.x+o>e.size[0]||c.y+a>e.size[1])&&t.push({code:"outside",id:s});for(let h of n)Math.abs(c.z-h.z)<20&&c.x<h.x+h.w&&c.x+o>h.x&&c.y<h.y+h.h&&c.y+a>h.y&&t.push({code:"overlap",id:s,other:h.id});n.push(c)}if(e.mode==="stacking"){for(let s of n.filter(r=>r.z===20))n.some(r=>r.z===0&&s.x>=r.x&&s.y>=r.y&&s.x+s.w<=r.x+r.w&&s.y+s.h<=r.y+r.h)||t.push({code:"support",id:s.id});n.filter(s=>s.z===20).length<3&&t.push({code:"stackCount"})}return{ok:!t.length,errors:t,rectangles:n,area:e.stock.reduce((s,r)=>s+r[1]*r[2],0),bedArea:e.size[0]*e.size[1]}}function Xu(i,e,t){if(t.mode==="shelf")return la(i);let n=e[i],s=ti(i,n.turn);return[t.origin[0]+n.x+s[0]/2,t.origin[1]+n.y+s[1]/2,t.deck+(n.z||0)+20]}function Gp(i,e){let t=Rt(i),n=e.spec.deck;if(e.spec.mode!=="stacking")return n;let s=e.objects.filter(r=>r.id!==i.id&&r.placed).map(Rt).filter(r=>r.max[2]<=t.min[2]+8&&r.max[2]>n&&[0,1].every(o=>t.min[o]>=r.min[o]-.2&&t.max[o]<=r.max[o]+.2));return Math.max(n,...s.map(r=>r.max[2]))}function qi(){return Xi([180,-30,155],qr(6),"nearest",[0,0,0]).q||qr(6)}function qu(i,e){let t=e.spec,n=Rt(i),s=Math.atan2(i.rotation[3],i.rotation[0])*180/Math.PI,r=Math.round(s/90)*90;if(i.rotation[8]<.98||Math.abs(s-r)>zc.angle)return null;let o=ra([0,0,r]),a=Rt({...i,center:[0,0,0],rotation:o}).max,l={min:[...t.origin,t.deck],max:[t.origin[0]+t.size[0],t.origin[1]+t.size[1],t.deck]},c=t.mode==="shelf"?t.cells.map(h=>({min:h.min,max:[h.max[0],h.max[1],h.min[2]]})):[l];t.mode==="stacking"&&c.push(...e.objects.filter(h=>h.id!==i.id&&h.placed).map(Rt).filter(h=>h.max[2]<=t.deck+20.2)),c.sort((h,u)=>u.max[2]-h.max[2]);for(let h of c){let u=h.max[2];if(n.min[2]<u-1||n.min[2]>u+zc.height||[0,1].some(_=>h.max[_]-h.min[_]<a[_]*2-.01))continue;let p=i.center.map((_,f)=>f<2?Math.max(h.min[f]+a[f],Math.min(h.max[f]-a[f],Math.round(_/5)*5)):u+i.size[2]/2);if(p.some((_,f)=>f<2&&Math.abs(_-i.center[f])>zc.xy))continue;let m={...i,center:p,rotation:o},g=Rt(m);if(!(![0,1].every(_=>g.min[_]>=t.origin[_]-.01&&g.max[_]<=t.origin[_]+t.size[_]+.01)||e.objects.some(_=>_.id!==i.id&&Zr(g,Rt(_)))))return{candidate:m,angle:r-s}}return null}var ei=class{constructor(e="mission"){this.reset(e)}reset(e=this.spec?.mode||"mission"){this.spec=Vp(e),this.objects=this.spec.stock.map(([t,n,s],r)=>({id:t,size:[n,s,20],center:[120+r%3*80,-155+Math.floor(r/3)*80,10],rotation:[...Hp],placed:!1})),this.output=!1,this.held=null,this.offset=null,this.localRotation=null,this.travel=0,this.moves=0,this.faults=0,this.drops=0,this.last="ready"}get input(){return!!this.held}get score(){return this.objects.filter(e=>e.placed).length}get heldObject(){return this.objects.find(e=>e.id===this.held)}heldPose(e){if(!this.held)return null;let t=tt(e);return{...this.heldObject,center:t.tip.map((n,s)=>n+Kn(t.rotation,this.offset)[s]),rotation:Qn(t.rotation,this.localRotation)}}update(e){this.held&&Object.assign(this.heldObject,this.heldPose(e))}command(e,t){if(this.update(t),this.output=e,e){if(this.held)return this.last="held";let x=tt(t),T=this.objects.filter(C=>Dt([C.center[0],C.center[1],C.center[2]+10],x.tip)<=18).sort((C,N)=>Dt(C.center,x.tip)-Dt(N.center,x.tip))[0];if(!T)return this.last="noContact";if(x.rotation[8]<.85)return this.last="tilt";if(Xs(T,x).width>42)return this.last="wide";let A=Rt(T);return this.objects.some(C=>{if(C.id===T.id)return!1;let N=Rt(C);return Math.abs(N.min[2]-A.max[2])<1&&[0,1].every(b=>N.max[b]>A.min[b]&&N.min[b]<A.max[b])})?this.last="supportsLoad":(T.center=[x.tip[0],x.tip[1],Math.max(T.center[2],x.tip[2]-10)],T.placed=!1,this.held=T.id,this.offset=Kn($u(x.rotation),T.center.map((C,N)=>C-x.tip[N])),this.localRotation=Qn($u(x.rotation),T.rotation),this.last="grasped")}if(!this.held)return this.last="open";if(ha(tt(t),this.heldObject,!1,this.objects,this.spec.solids||[]))return this.output=!0,this.last="fingers";let n=this.heldObject,s=this.spec,r=qu(n,this);r&&Object.assign(n,r.candidate);let o=Rt(n),a=s.mode==="shelf"?Hu(n):null,l=s.mode==="shelf"?!!a:[0,1].every(x=>o.min[x]>=s.origin[x]-1&&o.max[x]<=s.origin[x]+s.size[x]+1);if(o.max[0]>s.origin[0]&&o.min[0]<s.origin[0]+s.size[0]&&o.max[1]>s.origin[1]&&o.min[1]<s.origin[1]+s.size[1]&&!l)return this.output=!0,this.last="edge";let h=l?a?a.min[2]:Gp(n,this):0,u=o.min[2]>=h-1&&o.min[2]<=h+8,p=n.rotation[8]>.98;if(s.mode==="stacking"&&l&&o.min[2]>=s.deck+19&&h===s.deck)return this.output=!0,this.last="support";if(s.mode==="stacking"&&h>s.deck+1&&h!==s.deck+20)return this.output=!0,this.last="support";let m=Math.atan2(n.rotation[3],n.rotation[0])*180/Math.PI,g=Math.round(m/90)*90;p&&Math.abs(m-g)<3&&(n.rotation=ra([0,0,g]));let _=[...n.center],f={...n,center:_};f.center[2]=h+10;let d=Rt(f),M=[0,1].every(x=>d.min[x]>=s.origin[x]-.2&&d.max[x]<=s.origin[x]+s.size[x]+.2);return this.objects.some(x=>x.id!==n.id&&Zr(d,Rt(x)))?(this.output=!0,this.last="occupied"):(Object.assign(n,f),n.placed=l&&M&&u&&p&&(!a||a.id===n.id),this.held=null,this.offset=null,this.localRotation=null,u?this.last=n.placed?"placed":a&&a.id!==n.id?"wrongCell":"outside":(this.drops++,this.faults++,this.last="drop"))}collision(e){let t=tt(e),n=this.spec;if(t.tip[2]<12)return"floor";if(n.mode==="stacking"&&Wu(t,n.solids))return"obstacle";if(ha(t,this.heldPose(e),this.output,[],n.solids||[]))return n.mode==="shelf"?"shelfCollision":"obstacle";if(ha(t,this.heldPose(e),this.output,this.objects))return"fingers";if(t.tip[0]>n.origin[0]&&t.tip[0]<n.origin[0]+n.size[0]&&t.tip[1]>n.origin[1]&&t.tip[1]<n.origin[1]+n.size[1]&&t.tip[2]<n.deck+12)return"deck";let r=this.heldPose(e);if(r){let o=Rt(r);if(o.min[2]<-.7)return"floor";if((n.solids||[]).some(l=>Zr(o,l)))return n.mode==="shelf"?"shelfCollision":"obstacle";let a={min:[...n.origin,0],max:[n.origin[0]+n.size[0],n.origin[1]+n.size[1],n.deck]};if(Zr(o,a))return"deck";if(this.objects.some(l=>l.id!==r.id&&Zr(o,Rt(l))))return"cargo"}else if(this.objects.some(o=>{let a=Rt(o);return t.tip[0]>a.min[0]+2&&t.tip[0]<a.max[0]-2&&t.tip[1]>a.min[1]+2&&t.tip[1]<a.max[1]-2&&t.tip[2]<a.max[2]-7}))return"cargo";return null}checkMove(e,t){if(!Yr(e,t))return{error:"limits",q:[...t]};let n=Math.max(1,Math.ceil(Math.max(...e.map((s,r)=>Math.abs(s-t[r])))/1));for(let s=0;s<=n;s++){let r=e.map((a,l)=>a+(t[l]-a)*s/n),o=this.collision(r);if(o)return{error:o,q:r}}return null}canMove(e,t){return this.checkMove(e,t)?.error||null}snapshot(){return{...this.spec,tool:"gripper",output:this.output,held:this.held,score:this.score,objects:this.objects}}};function gs(i,e,t,n=0,s={}){if(!Array.isArray(t)||t.length!==3||t.some(f=>!Number.isFinite(f))||!Number.isFinite(n)||Math.abs(n)>180)return{error:"numbers"};if(t.some(f=>Math.abs(f)>600))return{error:"limits"};let r=s.orientation===void 0?[0,0,n]:s.orientation,o=s.path||"linear";if(!["linear","joint"].includes(o)||r!==null&&(!Array.isArray(r)||r.length!==3||r.some(f=>!Number.isFinite(f)||Math.abs(f)>180)))return{error:"numbers"};let a=(f,d)=>f[2]<12?"limits":r&&Xi(f,d,"nearest",null).q?"orientation":"solve";if(o==="joint"){let f=Xi(t,e,"nearest",r);if(!f.q)return{error:a(t,e),frames:[],blockedPoint:t};let d=i.checkMove(e,f.q);return d?{error:d.error,frames:[],collisionQ:d.q,blockedPoint:tt(d.q).tip}:{frames:[f.q],assisted:!1}}let l=!1;if(i.held&&r&&Math.abs(r[0])<1&&Math.abs(r[1])<1){let f=Xi(t,e,"nearest",r);if(f.q){let d=i.heldPose(f.q),M=qu(d,i);if(M){let v=t.map((x,T)=>x+M.candidate.center[T]-d.center[T]);l=Dt(v,t)>.1||Math.abs(M.angle)>.1,t=v,n+=M.angle,r=[...r],r[2]+=M.angle}}}let c=tt(e),h=Math.max(i.spec.deck,...i.objects.filter(f=>f.id!==i.held).map(f=>Rt(f).max[2]))+(i.heldObject?.size[2]||20)+2;if(l&&c.tip[2]>=h&&c.tip[2]>t[2]+1){let f=gs(i,e,[t[0],t[1],c.tip[2]],n,{...s,orientation:r});if(f.error)return f;let d=gs(i,f.frames.at(-1),t,n,{...s,orientation:r});return d.error?{...d,frames:[...f.frames,...d.frames||[]]}:{frames:[...f.frames,...d.frames],assisted:!0}}let u=r?.map((f,d)=>(f-c.rpy[d]+540)%360-180),p=f=>(f+540)%360-180,m=Math.max(1,Math.ceil(Dt(c.tip,t)/7),Math.ceil(Math.max(...(u||[0]).map(Math.abs))/5)),g=e,_=[];for(let f=1;f<=m;f++){let d=c.tip.map((T,A)=>T+(t[A]-T)*f/m),M=u?c.rpy.map((T,A)=>p(T+u[A]*f/m)):null,v=Xi(d,g,"nearest",M);if(!v.q)return{error:a(d,g),frames:_,blockedPoint:d};let x=i.checkMove(g,v.q);if(x)return{error:x.error,frames:_,collisionQ:x.q,blockedPoint:tt(x.q).tip};_.push(v.q),g=v.q}return{frames:_,assisted:l}}function Wp(i,e,t="x"){let n=t==="x"?0:1,s=t==="x"?"y":"x";return e.stock.map(([r],o)=>{let a=i[r];if(!a||![a.x,a.y,a.turn].every(Number.isFinite))return null;let l=ti(r,a.turn);return{id:r,u:a[t],z:a.z||0,width:l[n],height:20,depth:a[s],color:Jr[o]}}).filter(Boolean).sort((r,o)=>o.depth-r.depth)}function $p(i,e,t=85,n=1){return`<g transform="translate(${i} ${e}) scale(${t/85*n} ${t/85})" pointer-events="none"><circle cy="-76" r="7" fill="#e5bd91"/><path d="M-8 -81 Q0 -89 8 -81" fill="#e5c589"/><path d="M-10 -65 L10 -65 L12 -35 L-12 -35Z" fill="#e5c589"/><path d="M-10 -60 L-17 -38 M10 -60 L17 -38" stroke="#e5bd91" stroke-width="7" stroke-linecap="round"/><path d="M-6 -34 L-8 -5 M6 -34 L8 -5" stroke="#78a3ca" stroke-width="9" stroke-linecap="round"/><path d="M-13 -2h12 M3 -2h12" stroke="#bccddd" stroke-width="5"/></g>`}function Xp(i,e,t,n,s){let r=t==="x"?0:1,o=e.size[r],a=e.person,l=a?e.solids[0]:null,c=l?Math.min(0,l.min[r]-e.origin[r]):0,h=l?Math.max(o,l.max[r]-e.origin[r]):o,u=c-27,p=h+14,m=-100,g=42,_=Wp(i,e,t).map(M=>`<g data-elevation-box="${M.id}" role="button" tabindex="0" aria-label="${M.id}" style="cursor:pointer"><rect x="${M.u}" y="${-M.z-M.height}" width="${M.width}" height="${M.height}" fill="${M.color}" fill-opacity=".72" stroke="${M.id===n?"#fff":"#afcadc"}" stroke-width="${M.id===n?2:1}"/><text x="${M.u+M.width/2}" y="${-M.z-7}" text-anchor="middle" font-size="8" fill="#071c2f" font-weight="bold">${M.id}</text></g>`).join(""),f=[0,20,40].map(M=>`<path d="M0 ${-M}H${o}" stroke="#8ba5b8" stroke-dasharray="2 3" opacity=".5"/><text x="-5" y="${-M+3}" text-anchor="end" fill="#e5d4b2" font-size="7">${M}</text>`).join(""),d=a?`<rect x="${l.min[r]-e.origin[r]}" y="${e.deck-a.height}" width="${l.max[r]-l.min[r]}" height="${a.height}" fill="#ffb269" fill-opacity=".06" stroke="#ffb269" stroke-dasharray="3 2"/>${$p(a.center[r]-e.origin[r],e.deck,a.height,t==="y"?.7:1)}<text x="${a.center[r]-e.origin[r]}" y="${e.deck-a.height-9}" text-anchor="middle" font-size="7" fill="#f4d6ac">${a.height} mm</text>`:"";return`<svg class="elevation-svg" data-elevation="${t}" viewBox="${u} ${m} ${p-u} ${g-m}" role="img" aria-label="${s(t==="x"?"Front elevation X Z":"Side elevation Y Z",t==="x"?"\u6B63\u89C6\u56FE X Z":"\u4FA7\u89C6\u56FE Y Z")}"><path d="M${c} ${e.deck}H${h}" stroke="#587b96"/><rect x="0" y="0" width="${o}" height="5" fill="#a3b9ca"/>${f}${d}${_}<path d="M0 0V-52M0 0H${o}" stroke="#e5c589"/><text x="3" y="-56" fill="#e5c589" font-size="8">Z \u2191</text><text x="0" y="33" fill="#e5c589" font-size="8">${t.toUpperCase()} \u2192 ${o} mm</text><text x="${o}" y="13" text-anchor="end" fill="#e5c589" font-size="7">${s("Bed Z = 0","\u5E95\u677F Z = 0")}</text></svg>`}function ua(i,e,t,n){return`<div class="elevation-views">${["x","y"].map(s=>`<figure><figcaption>${n(s==="x"?"Front \xB7 X\u2013Z":"Side \xB7 Y\u2013Z",s==="x"?"\u6B63\u89C6 \xB7 X\u2013Z":"\u4FA7\u89C6 \xB7 Y\u2013Z")}</figcaption>${Xp(i,e,s,t,n)}</figure>`).join("")}</div><p class="map-caption">${n("Both levels are shown. Boxes behind one another overlap in elevation; use the plan to check depth.","\u540C\u65F6\u663E\u793A\u4E24\u5C42\u3002\u524D\u540E\u7BB1\u5B50\u5728\u7ACB\u9762\u56FE\u4E2D\u53EF\u80FD\u91CD\u53E0\uFF0C\u8BF7\u7ED3\u5408\u4FEF\u89C6\u56FE\u5224\u65AD\u6DF1\u5EA6\u3002")}</p>`}var qp=i=>Object.assign(new ei(i.spec.mode),structuredClone(i)),Yp=new Set(["grasped","held","open","placed"]);function Yu(i,e,t,n=0){let s;if(t.joint){let l=i.checkMove(e,t.q);s=l?{error:l.error,collisionQ:l.q,frames:[]}:{frames:[t.q]}}else s=gs(i,e,t.p,t.yaw,{orientation:t.orientation,path:t.path});let r=[e,...s.frames||[]];s.collisionQ&&r.push(s.collisionQ);let o=[tt(e).tip];for(let l=1;l<r.length;l++){let c=r[l-1],h=r[l],u=Math.max(1,Math.ceil(Math.max(...c.map((p,m)=>Math.abs(p-h[m])))/2));for(let p=1;p<=u;p++)o.push(tt(c.map((m,g)=>m+(h[g]-m)*p/u)).tip)}s.blockedPoint&&!s.collisionQ&&o.push(s.blockedPoint);let a=s.collisionQ||s.frames?.at(-1)||e;return{points:o,index:n,error:s.error||null,blockedPoint:s.blockedPoint||(s.error?tt(a).tip:null),q:a,payload:i.heldPose(a),output:i.output,target:t.p,assisted:!!s.assisted}}function Ys(i,e,t,n=0,s=null,r={}){let o=Yu(qp(i),e,{p:t,yaw:n,joint:!!s,q:s,...r});return{segments:[o],error:o.error,step:0,ghost:o,scope:"move"}}function Zu(i,e){let t=new ei(i.spec.mode),n=qi(),s=[],r=null;for(let o=0;o<e.length;o++){let a=e[o];if(a.type==="move"){let l=Yu(t,n,a,o);if(s.push(l),r=l,l.error)return{segments:s,error:l.error,step:o,ghost:r,scope:"program"};n=l.q,t.update(n)}else{let l=a.type==="grip"?t.command(a.on,n):t.input?"held":"wait";if(!Yp.has(l))return r={q:n,payload:t.heldPose(n),output:t.output,error:l,blockedPoint:tt(n).tip},{segments:s,error:l,step:o,ghost:r,scope:"program"}}}return{segments:s,error:null,step:null,ghost:r,scope:"program"}}var Hc={space:45,placement:40,speed:15},Zs=i=>i==="stacking"?30:20;function Vc(i){let e=jr.findIndex(t=>t[0]===i);return[120+e%3*80,-155+Math.floor(e/3)*80,20]}function da(i,e,t,n){let s=qs(i,t),r=[...s.errors];return(typeof n!="string"||!n.trim()||n.length>4e3)&&r.push({code:"strategy"}),{...s,ok:!r.length,errors:r}}function fa(i,e,t,n){return{plan:structuredClone(i),routes:{},strategy:t,mode:n,elapsedMs:0,started:!0,finished:!1,traces:{},revisions:0,restarts:0,blocked:0,travel:0,history:[],result:null}}function Gc(i,e,t=i.elapsedMs){let n=e.objects.length,s=e.objects.filter(f=>f.placed),r=s.map(Rt),o=[0,1,2].map(f=>Math.min(...r.map(d=>d.min[f]))),a=[0,1,2].map(f=>Math.max(...r.map(d=>d.max[f]))),l=r.length?a.reduce((f,d,M)=>f*Math.max(1,d-o[M]),1):0,c=s.reduce((f,d)=>f+d.size.reduce((M,v)=>M*v,1),0),h=l?Math.min(1,c/l):0,u=e.objects.map(f=>{let d=Xu(f.id,i.plan,e.spec),M=[f.center[0],f.center[1],f.center[2]+f.size[2]/2],v=Dt(d,M),x=Math.atan2(f.rotation[3],f.rotation[0])*180/Math.PI,T=Math.abs((x-i.plan[f.id].turn+540)%360-180);return{id:f.id,placed:f.placed,target:d,actual:M,errorMm:v,angleError:T}}),p=u.reduce((f,d)=>f+(d.placed?Math.max(0,1-Math.max(0,d.errorMm-5)/35)*Math.max(0,1-Math.max(0,d.angleError-5)/40):0),0)/n,m=s.length===n&&(e.spec.mode!=="stacking"||s.filter(f=>Rt(f).min[2]>=e.spec.deck+19).length>=3),g=m?Math.max(0,Math.min(1,2-t/(Zs(e.spec.mode)*6e4))):0,_={space:Math.round(Hc.space*h*s.length/n),placement:Math.round(Hc.placement*p),speed:Math.round(Hc.speed*g)};return{complete:m,points:_,total:Object.values(_).reduce((f,d)=>f+d,0),compactness:h,usedSize:r.length?a.map((f,d)=>f-o[d]):[0,0,0],elapsedMs:t,perBox:u,blocked:i.blocked,revisions:i.revisions,restarts:i.restarts,travel:i.travel}}function ju(i,e){if(i==null)return null;let t=()=>{throw Error("Invalid attempt")};(i.mode!==e.mode||!da(i.plan||{},i.routes||{},e,i.strategy).ok||typeof i.finished!="boolean")&&t();for(let r of["elapsedMs","revisions","restarts","blocked","travel"])(typeof i[r]!="number"||!Number.isFinite(i[r])||i[r]<0||i[r]>1e12)&&t();let n={};(!i.traces||typeof i.traces!="object")&&t();for(let[r,o]of Object.entries(i.traces))(!e.stock.some(a=>a[0]===r)||!Array.isArray(o)||o.length>2e3||o.some(a=>!Array.isArray(a)||a.length!==3||a.some(l=>!Number.isFinite(l)||Math.abs(l)>1e3)))&&t(),n[r]=o.map(a=>[...a]);(!Array.isArray(i.history)||i.history.length>100)&&t();let s=i.history.map(r=>((!da(r.plan||{},r.routes||{},e,r.strategy).ok||!Number.isFinite(r.elapsedMs)||r.elapsedMs<0)&&t(),{plan:structuredClone(r.plan),routes:structuredClone(r.routes),strategy:r.strategy,elapsedMs:r.elapsedMs}));return{...fa(i.plan,i.routes,i.strategy,i.mode),elapsedMs:i.elapsedMs,finished:i.finished,traces:n,revisions:i.revisions,restarts:i.restarts,blocked:i.blocked,travel:i.travel,history:s}}var Zp=i=>String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);function Ju({root:i,t:e,world:t,plan:n,strategy:s,onDraft:r,onStart:o,active:a=!1}){let l=t.spec,c=l.mode==="stacking",h=structuredClone(n),u={},p=s,m="A",g=0,_=T=>document.getElementById(T),f=()=>r(structuredClone(h),structuredClone(u),p);function d(){i.innerHTML=`<p class="lead">${e(c?"Task 2 \xB7 Stack three boxes on other boxes, in two levels. Move the boxes past the person\u2019s marked obstacle zone.":"Task 1 \xB7 Design your own load, then make the robot reproduce it.",c?"\u4EFB\u52A1 2 \xB7 \u5C06\u4E09\u4E2A\u7BB1\u5B50\u53E0\u653E\u5728\u5176\u4ED6\u7BB1\u5B50\u4E0A\uFF0C\u5F62\u6210\u4E24\u5C42\u3002\u6267\u884C\u4EFB\u52A1\u65F6\u642C\u8FD0\u7BB1\u5B50\u907F\u5F00\u4EBA\u7269\u6807\u793A\u533A\u3002":"\u4EFB\u52A1 1 \xB7 \u81EA\u5DF1\u8BBE\u8BA1\u88C5\u8F7D\u65B9\u6848\uFF0C\u518D\u8BA9\u673A\u5668\u4EBA\u5B9E\u73B0\u5B83\u3002")}</p><p>${e("Choose a box, then click the loading zone to set its centre. Edit corner coordinates below. All dimensions use the same scale as the actual truck.","\u9009\u62E9\u7BB1\u5B50\uFF0C\u518D\u70B9\u51FB\u88C5\u8F7D\u533A\u8BBE\u7F6E\u4E2D\u5FC3\u3002\u4E5F\u53EF\u7F16\u8F91\u4E0B\u65B9\u89D2\u70B9\u5750\u6807\u3002\u56FE\u4E0A\u5404\u5C3A\u5BF8\u4E0E\u5B9E\u9645\u8F66\u53A2\u4F7F\u7528\u76F8\u540C\u6BD4\u4F8B\u3002")}</p>
 <div class="planning-facts"><b>${l.size.join(" \xD7 ")} mm</b><span>${e("Box height: 20 mm","\u7BB1\u9AD8\uFF1A20 mm")}</span><span>${e("Open gripper: 60 mm outer width \xB7 48 mm inner gap","\u5F20\u5F00\u5939\u722A\uFF1A\u5916\u5BBD 60 mm \xB7 \u5185\u95F4\u8DDD 48 mm")}</span>${c?`<span>${e("Scale person: 85 mm \xB7 obstacle zone 80 \xD7 32 \xD7 85 mm","\u6BD4\u4F8B\u4EBA\u7269\uFF1A85 mm \xB7 \u969C\u788D\u533A\u57DF 80 \xD7 32 \xD7 85 mm")}</span>`:""}<span>${e("Collision detection ON","\u78B0\u649E\u68C0\u6D4B\uFF1A\u5F00\u542F")}</span></div>
 <div class="planning-layout"><div><div class="box-picker">${l.stock.map(([T,A,C],N)=>`<button data-pick="${T}" class="${m===T?"active":""}" style="--box-color:${Jr[N]}"><b>${T}</b> ${A} \xD7 ${C}${h[T]?" \u2713":""}</button>`).join("")}</div>${c?`<div class="map-tools"><label>${e("View level","\u67E5\u770B\u5C42\u7EA7")} <select id="view-level"><option value="0" ${g===0?"selected":""}>1</option><option value="20" ${g===20?"selected":""}>2</option></select></label></div>`:""}<h3 class="view-title">${e("Plan \xB7 X\u2013Y","\u4FEF\u89C6 \xB7 X\u2013Y")}</h3><div id="design-map"></div><p id="plan-space" class="plan-space"></p><p class="map-caption">${e("Top view \xB7 1 diagram unit = 1 mm \xB7 5 mm placement grid. Source boxes stay outside the loading zone. Z is height above the truck bed.","\u4FEF\u89C6\u56FE \xB7 1 \u56FE\u5F62\u5355\u4F4D = 1 mm \xB7 \u653E\u7F6E\u7F51\u683C 5 mm\u3002\u5F85\u53D6\u7BB1\u5B50\u4F4D\u4E8E\u88C5\u8F7D\u533A\u5916\u3002Z \u662F\u9AD8\u4E8E\u8F66\u53A2\u5E95\u677F\u7684\u9AD8\u5EA6\u3002")}</p></div><div><section class="planning-editor" id="box-editor"></section>${c?'<section id="elevation-map" class="planning-elevations"></section>':""}</div></div>
 <label class="strategy-label">${e("Why this plan? What are you optimizing: space, placement accuracy, speed or reliability? Explain one trade-off.","\u4E3A\u4EC0\u4E48\u8FD9\u6837\u89C4\u5212\uFF1F\u4F60\u5728\u4F18\u5316\u7A7A\u95F4\u3001\u653E\u7F6E\u7CBE\u5EA6\u3001\u901F\u5EA6\u8FD8\u662F\u53EF\u9760\u6027\uFF1F\u89E3\u91CA\u4E00\u4E2A\u53D6\u820D\u3002")}<textarea id="plan-reason" maxlength="4000" rows="3">${Zp(p)}</textarea></label>
 <details class="rubric-details"><summary>${e("Space 45 \xB7 Placement 40 \xB7 Time 15","\u7A7A\u95F4 45 \xB7 \u653E\u7F6E 40 \xB7 \u65F6\u95F4 15")}</summary><ul><li>${e("Space 45: box volume \xF7 the smallest rectangular envelope around the finished load. Packing more compactly scores higher; only safely placed boxes count.","\u7A7A\u95F4 45\uFF1A\u7BB1\u5B50\u4F53\u79EF \xF7 \u5305\u56F4\u6700\u7EC8\u88C5\u8F7D\u7269\u7684\u6700\u5C0F\u957F\u65B9\u4F53\u4F53\u79EF\u3002\u8D8A\u7D27\u51D1\u5F97\u5206\u8D8A\u9AD8\uFF1B\u4EC5\u7EDF\u8BA1\u5B89\u5168\u653E\u7F6E\u7684\u7BB1\u5B50\u3002")}</li><li>${e("Placement 40: actual top centres and rotations compared with your committed plan. Full credit within 5 mm and 5\xB0.","\u653E\u7F6E 40\uFF1A\u5B9E\u9645\u7BB1\u9876\u4E2D\u5FC3\u4E0E\u65CB\u8F6C\u89D2\u5EA6\u548C\u63D0\u4EA4\u65B9\u6848\u76F8\u6BD4\uFF1B5 mm\u30015\xB0 \u4EE5\u5185\u83B7\u6EE1\u5206\u3002")}</li><li>${e(`Time 15: full credit within ${Zs(l.mode)} minutes, then decreases to zero at ${2*Zs(l.mode)} minutes. These are initial classroom targets, not age norms.`,`\u65F6\u95F4 15\uFF1A${Zs(l.mode)} \u5206\u949F\u5185\u6EE1\u5206\uFF0C\u4E4B\u540E\u9012\u51CF\u81F3 ${2*Zs(l.mode)} \u5206\u949F\u65F6\u96F6\u5206\u3002\u8FD9\u662F\u521D\u59CB\u8BFE\u5802\u76EE\u6807\uFF0C\u5E76\u975E\u5E74\u9F84\u6807\u51C6\u3002`)}</li></ul><p>${e("Timing starts only when you choose Start task. Programming, pauses, retries and plan revisions during the attempt count. Saved time resumes when you choose Resume; time away from the saved session is excluded. Explain your decisions as part of teacher feedback; writing is not automatically graded.","\u70B9\u51FB\u201C\u5F00\u59CB\u4EFB\u52A1\u201D\u624D\u8BA1\u65F6\u3002\u7F16\u7A0B\u3001\u6682\u505C\u3001\u91CD\u8BD5\u3001\u5C1D\u8BD5\u4E2D\u7684\u65B9\u6848\u4FEE\u6539\u5747\u8BA1\u65F6\u3002\u5BFC\u5165\u540E\u70B9\u51FB\u7EE7\u7EED\u624D\u6062\u590D\u8BA1\u65F6\uFF1B\u79BB\u7EBF\u65F6\u95F4\u4E0D\u8BA1\u3002\u89E3\u91CA\u51B3\u7B56\u4F9B\u6559\u5E08\u53CD\u9988\uFF0C\u6587\u5B57\u4E0D\u81EA\u52A8\u8BC4\u5206\u3002")}</p></details>
 <p id="design-feedback" class="feedback" role="status"></p><div class="actions"><button id="check-design">${e("Check geometry","\u68C0\u67E5\u51E0\u4F55\u65B9\u6848")}</button><button id="start-task" class="primary">${e(a?"Commit revision & continue":"Commit plan & start timer",a?"\u63D0\u4EA4\u4FEE\u6539\u5E76\u7EE7\u7EED":"\u63D0\u4EA4\u65B9\u6848\u5E76\u5F00\u59CB\u8BA1\u65F6")}</button></div>`,i.querySelectorAll("[data-pick]").forEach(T=>T.onclick=()=>{m=T.dataset.pick,g=h[m]?.z||0,d()}),_("view-level")?.addEventListener("change",T=>{g=Number(T.target.value),x()}),_("plan-reason").oninput=T=>{p=T.target.value,f()},_("check-design").onclick=()=>M(!1),_("start-task").onclick=()=>{if(a&&_("start-task").dataset.confirm!=="yes"){_("start-task").dataset.confirm="yes",_("design-feedback").textContent=e("Committing a revision resets the boxes and robot, keeps your program, and continues the same timer. Click again to commit.","\u63D0\u4EA4\u4FEE\u6539\u5C06\u91CD\u7F6E\u7BB1\u5B50\u4E0E\u673A\u5668\u4EBA\u3001\u4FDD\u7559\u7A0B\u5E8F\uFF0C\u5E76\u7EE7\u7EED\u540C\u4E00\u8BA1\u65F6\u3002\u518D\u6B21\u70B9\u51FB\u5373\u53EF\u63D0\u4EA4\u3002");return}M(!0)},v(),x()}function M(T){let A=da(h,u,l,p);if(!A.ok){let C=A.errors[0],N={missing:e(`Place box ${C.id}.`,`\u8BF7\u653E\u7F6E\u7BB1\u5B50 ${C.id}\u3002`),invalid:e(`Check coordinates for ${C.id}.`,`\u8BF7\u68C0\u67E5 ${C.id} \u7684\u5750\u6807\u3002`),outside:e(`${C.id} crosses the loading boundary.`,`${C.id} \u8D85\u51FA\u88C5\u8F7D\u8FB9\u754C\u3002`),overlap:e(`${C.id} and ${C.other} occupy the same space.`,`${C.id} \u4E0E ${C.other} \u5360\u7528\u540C\u4E00\u7A7A\u95F4\u3002`),level:e("Use levels 1 and 2 only.","\u4EC5\u4F7F\u7528\u7B2C 1\u30012 \u5C42\u3002"),support:e(`${C.id} must sit fully on one lower box.`,`${C.id} \u5FC5\u987B\u5B8C\u5168\u652F\u6491\u5728\u4E00\u4E2A\u4E0B\u5C42\u7BB1\u5B50\u4E0A\u3002`),stackCount:e("Put at least three boxes on level 2.","\u81F3\u5C11\u4E09\u4E2A\u7BB1\u5B50\u653E\u5728\u7B2C 2 \u5C42\u3002"),strategy:e("Explain what your plan aims to optimize.","\u8BF7\u89E3\u91CA\u65B9\u6848\u60F3\u8981\u4F18\u5316\u4EC0\u4E48\u3002")};_("design-feedback").textContent=N[C.code]||e("Review the plan.","\u8BF7\u68C0\u67E5\u65B9\u6848\u3002");return}_("design-feedback").textContent=e("The placement plan is valid. Ready to start.","\u653E\u7F6E\u65B9\u6848\u6709\u6548\uFF0C\u53EF\u4EE5\u5F00\u59CB\u4EFB\u52A1\u3002"),T&&(f(),o(structuredClone(h),structuredClone(u),p))}function v(){let T=Vc(m).map((b,S)=>b-(S<2?l.origin[S]:l.deck)),A=h[m]||{x:"",y:"",z:0,turn:0},[C,N]=ti(m,A.turn);_("box-editor").innerHTML=`<h3>${m} \xB7 ${e("My placement","\u6211\u7684\u653E\u7F6E\u4F4D\u7F6E")}</h3><p>${e("Corner measured from truck zero","\u89D2\u70B9\u76F8\u5BF9\u8F66\u53A2\u96F6\u70B9")}</p><div class="plan-fields">${["x","y"].map(b=>`<label>${b.toUpperCase()}<input data-place="${b}" type="number" step="5" value="${A[b]}"></label>`).join("")}<label>${e("Turn","\u65CB\u8F6C")}<select data-place="turn"><option value="0">0\xB0</option><option value="90" ${A.turn===90?"selected":""}>90\xB0</option></select></label>${c?`<label>${e("Level","\u5C42")}<select data-place="z"><option value="0">1</option><option value="20" ${A.z===20?"selected":""}>2</option></select></label>`:""}</div><p id="planned-centre">${e("Tool top centre","\u5DE5\u5177\u7BB1\u9876\u4E2D\u5FC3")}: ${Number.isFinite(A.x)&&Number.isFinite(A.y)?`${A.x+C/2}, ${A.y+N/2}, ${(A.z||0)+20}`:"\u2014"} mm</p><p><b>${e("Pickup XYZ","\u53D6\u8D27 XYZ")}: ${T.join(", ")} mm</b></p>`,_("box-editor").querySelectorAll("[data-place]").forEach(b=>b.onchange=()=>{h[m]??(h[m]={x:NaN,y:NaN,z:0,turn:0}),h[m][b.dataset.place]=b.value===""?NaN:Number(b.value),b.dataset.place==="z"&&(g=h[m].z||0),f(),v(),x()})}function x(){let T=qs(h,l);if(T.ok){let k=[Math.max(...T.rectangles.map(H=>H.x+H.w))-Math.min(...T.rectangles.map(H=>H.x)),Math.max(...T.rectangles.map(H=>H.y+H.h))-Math.min(...T.rectangles.map(H=>H.y)),Math.max(...T.rectangles.map(H=>H.z+20))-Math.min(...T.rectangles.map(H=>H.z))];_("plan-space").textContent=e("Predicted compactness","\u9884\u8BA1\u7D27\u51D1\u5EA6")+`: ${(100*T.area*20/k.reduce((H,Q)=>H*Q,1)).toFixed(1)}% \xB7 `+e("Used envelope","\u5360\u7528\u5305\u56F4\u5C3A\u5BF8")+": "+k.join(" \xD7 ")+" mm"}else _("plan-space").textContent=e("Complete a valid arrangement to measure its compactness.","\u5B8C\u6210\u6709\u6548\u6392\u5217\u540E\uFF0C\u53EF\u67E5\u770B\u7D27\u51D1\u5EA6\u3002");let[A,C]=l.origin,[N,b]=l.size,S="";for(let k=0;k<=N;k+=20)S+=`<path d="M${A+k} ${-C}v${-b}"/>`;for(let k=0;k<=b;k+=20)S+=`<path d="M${A} ${-C-k}h${N}"/>`;let D=(k,H,Q,X,he,ye,Te=!1)=>`<g data-map-box="${k}" style="cursor:pointer"><rect x="${H-X/2}" y="${-Q-he/2}" width="${X}" height="${he}" fill="${Jr[ye]}" opacity="${Te?.3:1}" stroke="${k===m?"#fff":"#12283e"}" stroke-width="${k===m?2:1}"/><text x="${H}" y="${-Q+3}" text-anchor="middle" font-size="9" fill="#10263b" font-weight="bold">${Te?"":k}</text></g>`,V=l.stock.map(([k,H,Q],X)=>{let[he,ye]=Vc(k);return D(k,he,ye,H,Q,X)}).join(""),$=l.stock.map(([k],H)=>{let Q=h[k];if(!Q||![Q.x,Q.y].every(Number.isFinite))return"";let[X,he]=ti(k,Q.turn);return D(k,A+Q.x+X/2,C+Q.y+he/2,X,he,H,c&&(Q.z||0)!==g)}).join(""),Z=(l.solids||[]).map(k=>`<rect x="${k.min[0]}" y="${-k.max[1]}" width="${k.max[0]-k.min[0]}" height="${k.max[1]-k.min[1]}" fill="#b7844544" stroke="#ffe3a5" stroke-dasharray="3 2"/><text x="${k.min[0]}" y="${-k.max[1]-5}" font-size="8" fill="#ffe3a5">${e("PERSON","\u4EBA\u7269")} \xB7 85 mm</text>${l.person?`<ellipse cx="${l.person.center[0]}" cy="${-l.person.center[1]}" rx="17" ry="7" fill="#e5c589"/><circle cx="${l.person.center[0]}" cy="${-l.person.center[1]}" r="6" fill="#e5bd91"/>`:""}`).join("");_("design-map").innerHTML=`<svg id="planning-svg" viewBox="55 -230 305 430" role="img" aria-label="${e("Same-scale inventory and planned box placements","\u7B49\u6BD4\u4F8B\u5F85\u53D6\u7BB1\u5B50\u4E0E\u89C4\u5212\u653E\u7F6E\u4F4D\u7F6E")}"><rect x="55" y="-230" width="305" height="430" fill="#102b42"/><rect x="${A}" y="${-C-b}" width="${N}" height="${b}" fill="#24465e" stroke="#e5c589" stroke-width="2"/><g stroke="#59788f" stroke-width=".4">${S}</g><text x="${A}" y="${-C-b-10}" fill="#ffe3a5" font-size="9">${e("TRUCK BED","\u8F66\u53A2")} ${N} \xD7 ${b} mm</text>${Z}${V}${$}<text x="100" y="195" fill="#bfd1df" font-size="9">${e("PICKUP INVENTORY","\u5F85\u53D6\u7BB1\u5B50")}</text><circle cx="${A}" cy="${-C}" r="3" fill="white"/><text x="${A-5}" y="${-C+13}" fill="white" font-size="8">O (0,0) \u2192 X \xB7 \u2191 Y</text></svg>`,c&&(_("elevation-map").innerHTML=ua(h,l,m,e),_("elevation-map").querySelectorAll("[data-elevation-box]").forEach(k=>{let H=()=>{m=k.dataset.elevationBox,g=h[m]?.z||0,d()};k.onclick=H,k.onkeydown=Q=>{(Q.key==="Enter"||Q.key===" ")&&(Q.preventDefault(),H())}})),_("planning-svg").onclick=k=>{let H=k.target.closest?.("[data-map-box]");if(H){m=H.dataset.mapBox,g=h[m]?.z||0,d();return}let Q=_("planning-svg"),X=Q.createSVGPoint();X.x=k.clientX,X.y=k.clientY;let he=X.matrixTransform(Q.getScreenCTM().inverse()),ye=Math.round((he.x-A)/5)*5,Te=Math.round((-he.y-C)/5)*5,$e=h[m]||{turn:0,z:g},[Qe,st]=ti(m,$e.turn);h[m]={...$e,x:ye-Qe/2,y:Te-st/2,z:c?g:0},f(),v(),x()}}return d(),{snapshot:()=>({plan:h,routes:u,strategy:p})}}function Wc(i){if(i?.version!==1||i?.kind!=="bnta-cargo"||!["practice","mission","transfer","shelf","stacking"].includes(i.mode)||!Array.isArray(i.steps)||i.steps.length>200)throw Error("Invalid cargo program");let e=i.steps.map(t=>{if(t?.name!==void 0&&(typeof t.name!="string"||t.name.length>80))throw Error("Invalid name");if(t?.orientation!==void 0&&t.orientation!==null&&(!Array.isArray(t.orientation)||t.orientation.length!==3||t.orientation.some(n=>!Number.isFinite(n)||Math.abs(n)>180)))throw Error("Invalid orientation");if(t?.path!==void 0&&!["linear","joint"].includes(t.path))throw Error("Invalid path");if(t?.type==="move"&&Array.isArray(t.p)&&t.p.length===3&&t.p.every(Number.isFinite)&&Number.isFinite(t.yaw)&&Math.abs(t.yaw)<=180&&_i(t.q)&&t.q.length===6&&typeof t.joint=="boolean")return{type:"move",p:[...t.p],yaw:t.yaw,q:[...t.q],joint:t.joint};if(t?.type==="grip"&&typeof t.on=="boolean")return{type:"grip",on:t.on};if(t?.type==="wait")return{type:"wait"};throw Error("Invalid command")}).map((t,n)=>({...t,...i.steps[n].name?{name:i.steps[n].name}:{},...t.type==="move"&&i.steps[n].orientation!==void 0?{orientation:i.steps[n].orientation===null?null:[...i.steps[n].orientation]}:{},...t.type==="move"&&i.steps[n].path?{path:i.steps[n].path}:{}}));return{mode:i.mode,steps:e}}var wt=()=>{throw Error("Invalid progress file")},js=(i,e=1e4)=>typeof i=="number"&&Number.isFinite(i)&&Math.abs(i)<=e,pa=(i,e,t=1e4)=>Array.isArray(i)&&i.length===e&&i.every(n=>js(n,t)),ni=i=>typeof i=="boolean",Kr=(i,e=4e3)=>typeof i=="string"&&i.length<=e,Ku=i=>pa(i,9,1.001)&&[0,1,2].every(e=>Math.abs(Math.hypot(i[e*3],i[e*3+1],i[e*3+2])-1)<.002)&&Math.abs(i[0]*i[3]+i[1]*i[4]+i[2]*i[5])<.002&&Math.abs(i[0]*i[6]+i[1]*i[7]+i[2]*i[8])<.002&&Math.abs(i[3]*i[6]+i[4]*i[7]+i[5]*i[8])<.002&&Math.abs(i[0]*(i[4]*i[8]-i[5]*i[7])-i[1]*(i[3]*i[8]-i[5]*i[6])+i[2]*(i[3]*i[7]-i[4]*i[6])-1)<.003;function $c(i){return structuredClone({mode:i.spec.mode,objects:i.objects,output:i.output,held:i.held,offset:i.offset,localRotation:i.localRotation,travel:i.travel,moves:i.moves,faults:i.faults,drops:i.drops,last:i.last})}function Qu(i){if(i?.kind==="bnta-cargo"&&i.version===1)return{legacy:!0,...Wc(i)};(i?.kind!=="bnta-cargo-progress"||![2,3].includes(i.version))&&wt();let e=i.world,t=i.ui,n=i.learning;(!e||!t||!n||!["practice","mission","transfer","shelf","stacking"].includes(e.mode))&&wt();let s=new ei(e.mode),r=Wc({kind:"bnta-cargo",version:1,mode:e.mode,steps:i.steps}).steps;(!_i(i.q)||i.q.length!==6||!pa(t.target,3,600)||!js(t.yaw,180))&&wt(),(!["zh","en"].includes(t.lang)||!["xyz","jog","joints"].includes(t.mode)||!["robot","bed"].includes(t.coordinateFrame)||!ni(t.bedZeroSet)||!ni(t.guideHidden)||!ni(t.trail)||!ni(t.journeyCollapsed)||!ni(t.dimensions))&&wt(),t.coordinateFrame==="bed"&&!t.bedZeroSet&&wt(),t.orientationMode!==void 0&&!["keep","free","down"].includes(t.orientationMode)&&wt(),t.motionPath!==void 0&&!["linear","joint"].includes(t.motionPath)&&wt(),t.lastCode!==void 0&&!Kr(t.lastCode,40)&&wt(),(!Array.isArray(e.objects)||e.objects.length!==s.objects.length||!ni(e.output))&&wt();let o=s.objects.map(_=>{let f=e.objects.find(d=>d?.id===_.id);return(!f||!pa(f.center,3,1e3)||!Ku(f.rotation)||!ni(f.placed)||JSON.stringify(f.size)!==JSON.stringify(_.size))&&wt(),{..._,center:[...f.center],rotation:[...f.rotation],placed:f.placed}});new Set(e.objects.map(_=>_.id)).size!==o.length&&wt(),e.held!==null&&(!o.some(_=>_.id===e.held)||!e.output||!pa(e.offset,3,100)||!Ku(e.localRotation))&&wt(),e.held===null&&(e.offset!==null||e.localRotation!==null)&&wt();for(let _ of["travel","moves","faults","drops"])(!js(e[_],1e9)||e[_]<0||_!=="travel"&&!Number.isInteger(e[_]))&&wt();if(Kr(e.last,40)||wt(),Object.assign(s,{objects:o,output:e.output,held:e.held,offset:e.offset&&[...e.offset],localRotation:e.localRotation&&[...e.localRotation],travel:e.travel,moves:e.moves,faults:e.faults,drops:e.drops,last:e.last}),s.held){let _=s.heldPose(i.q);(s.heldObject.placed||Dt(_.center,s.heldObject.center)>.1||_.rotation.some((f,d)=>Math.abs(f-s.heldObject.rotation[d])>.002))&&wt()}(!Number.isInteger(n.guideStep)||n.guideStep<-1||n.guideStep>8||!Number.isInteger(n.stage)||n.stage<0||n.stage>4||!Array.isArray(n.completed)||n.completed.length!==5||!n.completed.every(ni)||!ni(n.practiceDone)||!ni(n.quizDone)||!ni(n.mathReady))&&wt(),n.guideStep>=0&&e.mode!=="practice"&&wt(),(!Number.isInteger(n.demoIndex)||n.demoIndex<-1||n.demoIndex>8||n.demoIndex>=0&&(e.mode!=="practice"||n.stage!==1||r.length!==8))&&wt(),n.guideRecord!==null&&(!Number.isInteger(n.guideRecord)||n.guideRecord<0||n.guideRecord>=r.length)&&wt(),(!Array.isArray(n.quizAnswers)||n.quizAnswers.length!==3||!n.quizAnswers.every(_=>_===null||_===0||_===1)||!Kr(i.reflection))&&wt(),(!i.plan||typeof i.plan!="object"||Array.isArray(i.plan)||!i.mathAnswers||typeof i.mathAnswers!="object")&&wt();let a={};for(let[_,f]of Object.entries(i.plan))(!s.spec.stock.some(d=>d[0]===_)||!f||![f.x,f.y].every(d=>d===null||js(d,600))||![0,90].includes(f.turn)||![void 0,0,20].includes(f.z))&&wt(),a[_]={x:f.x===null?NaN:f.x,y:f.y===null?NaN:f.y,turn:f.turn,...f.z!==void 0?{z:f.z}:{}};let l={};for(let[_,f]of Object.entries(i.routes||{}))(!s.spec.stock.some(d=>d[0]===_)||!Array.isArray(f)||f.length>20||f.some(d=>!Array.isArray(d)||d.length!==3||d.some(M=>M!==null&&!js(M,600))))&&wt(),l[_]=f.map(d=>d.map(M=>M===null?NaN:M));let c=i.strategy??"";Kr(c)||wt();let h=ju(i.attempt,s.spec),u={};for(let _ of["area","bed","sx","sy","sz","upper","centreX","centreY"]){let f=i.mathAnswers[_];f!==void 0&&(Kr(f,30)||js(f,1e9)||wt(),u[_]=f)}let p=qs(a,s.spec),m=n.mathReady&&(e.mode==="practice"||[2,3].includes(i.layoutVersion))&&(e.mode==="shelf"?ca(u):p.ok&&Number(u.centreX)===40&&Number(u.centreY)===30&&Number(u.area)===p.area&&Number(u.bed)===p.bedArea),g=n.quizDone&&n.quizAnswers.every((_,f)=>_===[0,1,1][f]);return{world:s,steps:r,q:[...i.q],ui:{...t,target:[...t.target]},learning:{...n,truckDone:n.truckDone===!0,completed:n.completed.map((_,f)=>f===3?g:_),quizAnswers:[...n.quizAnswers],mathReady:!!h||m,quizDone:g},plan:a,routes:l,strategy:c,attempt:h,mathAnswers:u,reflection:i.reflection}}var Js=[{part:"base",target:"#viewport",title:["The base","\u5E95\u5EA7"],body:["The base supports the arm and stays fixed. All robot positions are measured in relation to its coordinate system.","\u5E95\u5EA7\u652F\u6491\u673A\u68B0\u81C2\u5E76\u4FDD\u6301\u56FA\u5B9A\u3002\u673A\u5668\u4EBA\u5750\u6807\u4EE5\u56FA\u5B9A\u7684\u673A\u5668\u4EBA\u5750\u6807\u7CFB\u4E3A\u53C2\u8003\u3002"]},{part:"base",target:"#viewport",title:["Why six joints?","\u4E3A\u4EC0\u4E48\u6709\u516D\u4E2A\u5173\u8282\uFF1F"],body:["This arm has six motor-driven turning joints, J1\u2013J6. We need to choose both where the gripper goes (X, Y, Z) and which way it faces (three rotation directions). The first three joints mainly position the arm; the last three help orient the tool. They work together\u2014one joint is not one X, Y or Z control.","\u8FD9\u53F0\u673A\u68B0\u81C2\u6709\u516D\u4E2A\u7531\u7535\u673A\u9A71\u52A8\u7684\u8F6C\u52A8\u5173\u8282 J1\u2013J6\u3002\u9664\u4E86\u9009\u62E9\u5939\u722A\u53BB\u54EA\u91CC\uFF08X\u3001Y\u3001Z\uFF09\uFF0C\u8FD8\u8981\u9009\u62E9\u5B83\u671D\u5411\u54EA\u91CC\uFF08\u4E09\u4E2A\u65CB\u8F6C\u65B9\u5411\uFF09\u3002\u524D\u4E09\u4E2A\u5173\u8282\u4E3B\u8981\u5B9A\u4F4D\u673A\u68B0\u81C2\uFF0C\u540E\u4E09\u4E2A\u534F\u52A9\u8C03\u6574\u5DE5\u5177\u59FF\u6001\u3002\u5B83\u4EEC\u76F8\u4E92\u914D\u5408\uFF0C\u5E76\u4E0D\u662F\u4E00\u4E2A\u5173\u8282\u5BF9\u5E94\u4E00\u4E2A X\u3001Y \u6216 Z \u63A7\u4EF6\u3002"]},{part:"j1",target:"#viewport",title:["J1 \xB7 Base rotation","J1 \xB7 \u5E95\u5EA7\u65CB\u8F6C"],body:["Turns the arm around its base, like turning your body to face a different direction. It brings different parts of the workspace in front of the arm.","\u8BA9\u673A\u68B0\u81C2\u7ED5\u5E95\u5EA7\u8F6C\u52A8\uFF0C\u5C31\u50CF\u8F6C\u8EAB\u9762\u5411\u53E6\u4E00\u4E2A\u65B9\u5411\uFF0C\u4F7F\u673A\u68B0\u81C2\u671D\u5411\u5DE5\u4F5C\u533A\u7684\u4E0D\u540C\u4F4D\u7F6E\u3002"]},{part:"j2",target:"#viewport",title:["J2 \xB7 Shoulder","J2 \xB7 \u80A9\u5173\u8282"],body:["Raises or lowers the upper arm. Together with the elbow, it changes reach and height.","\u62AC\u8D77\u6216\u653E\u4E0B\u4E0A\u81C2\uFF0C\u4E0E\u8098\u5173\u8282\u5171\u540C\u6539\u53D8\u4F38\u5C55\u8DDD\u79BB\u548C\u9AD8\u5EA6\u3002"]},{part:"j3",target:"#viewport",title:["J3 \xB7 Elbow","J3 \xB7 \u8098\u5173\u8282"],body:["Bends or straightens the arm. A folded and an extended arm can approach the same area differently, but joint limits restrict the choices.","\u4F7F\u624B\u81C2\u5F2F\u66F2\u6216\u4F38\u76F4\u3002\u6298\u53E0\u4E0E\u4F38\u5C55\u53EF\u4EE5\u7528\u4E0D\u540C\u65B9\u5F0F\u63A5\u8FD1\u540C\u4E00\u533A\u57DF\uFF0C\u4F46\u5173\u8282\u9650\u4F4D\u4F1A\u9650\u5236\u9009\u62E9\u3002"]},{part:"j4",target:"#viewport",title:["J4 \xB7 Swivel","J4 \xB7 \u56DE\u8F6C\u5173\u8282"],body:["Turns the outer arm assembly around its local axis. It helps aim the wrist without relying only on the base. Its axis turns with the joints before it.","\u8BA9\u5916\u4FA7\u673A\u68B0\u81C2\u7ED5\u81EA\u8EAB\u8F74\u8F6C\u52A8\uFF0C\u5E2E\u52A9\u8155\u90E8\u8C03\u6574\u671D\u5411\uFF0C\u4E0D\u5FC5\u53EA\u4F9D\u8D56\u5E95\u5EA7\u3002\u5B83\u7684\u8F74\u65B9\u5411\u4E5F\u4F1A\u968F\u524D\u9762\u7684\u5173\u8282\u6539\u53D8\u3002"]},{part:"j5",target:"#viewport",title:["J5 \xB7 Wrist tilt","J5 \xB7 \u8155\u90E8\u4FEF\u4EF0"],body:["Tilts the wrist to change the approach angle. Reaching above a box is not enough: the gripper must also face the box correctly.","\u503E\u659C\u8155\u90E8\u4EE5\u6539\u53D8\u63A5\u8FD1\u89D2\u5EA6\u3002\u4EC5\u4EC5\u5230\u8FBE\u7BB1\u5B50\u4E0A\u65B9\u8FD8\u4E0D\u591F\uFF0C\u5939\u722A\u8FD8\u9700\u8981\u6B63\u786E\u671D\u5411\u7BB1\u5B50\u3002"]},{part:"j6",target:"#viewport",title:["J6 \xB7 Tool rotation","J6 \xB7 \u5DE5\u5177\u65CB\u8F6C"],body:["Spins the tool around its mounting axis, helping align the jaws with a box. More joints offer more positioning and orientation choices, not unlimited reach. Coordinates mode coordinates all six joints. Keep the current orientation, allow rotation, or choose Point downward for pickup. Preview a direct or joint path before moving.","\u8BA9\u5DE5\u5177\u7ED5\u5B89\u88C5\u8F74\u65CB\u8F6C\uFF0C\u5E2E\u52A9\u5939\u722A\u4E0E\u7BB1\u5B50\u65B9\u5411\u5BF9\u9F50\u3002\u66F4\u591A\u5173\u8282\u63D0\u4F9B\u66F4\u591A\u4F4D\u7F6E\u548C\u59FF\u6001\u9009\u62E9\uFF0C\u5E76\u4E0D\u610F\u5473\u7740\u65E0\u9650\u53EF\u8FBE\u3002\u5750\u6807\u6A21\u5F0F\u4F1A\u534F\u8C03\u516D\u4E2A\u5173\u8282\u3002\u53EF\u4FDD\u7559\u5F53\u524D\u671D\u5411\u3001\u5141\u8BB8\u65CB\u8F6C\uFF0C\u6216\u9009\u62E9\u671D\u4E0B\u8F85\u52A9\u6293\u53D6\u3002\u79FB\u52A8\u524D\u53EF\u9884\u89C8\u76F4\u63A5\u8DEF\u5F84\u6216\u5173\u8282\u8DEF\u5F84\u3002"]},{part:"link",target:"#viewport",title:["Links and reach","\u8FDE\u6746\u4E0E\u53EF\u8FBE\u8303\u56F4"],body:["Links connect the joints. Their lengths help determine where the robot can reach. The arm and its load need room to move.","\u8FDE\u6746\u8FDE\u63A5\u5173\u8282\uFF0C\u5176\u957F\u5EA6\u51B3\u5B9A\u673A\u5668\u4EBA\u80FD\u5230\u8FBE\u7684\u8303\u56F4\u3002\u673A\u68B0\u81C2\u548C\u6240\u5939\u7269\u4F53\u90FD\u9700\u8981\u8FD0\u52A8\u7A7A\u95F4\u3002"]},{part:"tool",target:"#viewport",title:["Gripper and feedback","\u5939\u722A\u4E0E\u53CD\u9988"],body:["The gripper is the end effector that holds a box. DO1 commands Open or Close. DI1 confirms an actual grip\u2014a Close command alone does not prove a box is held.","\u5939\u722A\u662F\u5939\u6301\u7BB1\u5B50\u7684\u672B\u7AEF\u6267\u884C\u5668\u3002DO1 \u53D1\u51FA\u5F20\u5F00\u6216\u95ED\u5408\u6307\u4EE4\uFF1BDI1 \u786E\u8BA4\u5B9E\u9645\u5939\u6301\u3002\u53D1\u51FA\u95ED\u5408\u6307\u4EE4\u4E0D\u4EE3\u8868\u4E00\u5B9A\u5939\u4F4F\u4E86\u7BB1\u5B50\u3002"]},{part:"tcp",target:"#viewport",title:["The tool position","\u5DE5\u5177\u4F4D\u7F6E"],body:["The tool centre point is the point you position with X, Y and Z. The readout shows where it is now. Setting a bed zero changes the reference for those numbers, not the robot\u2019s position.","\u5DE5\u5177\u4E2D\u5FC3\u70B9\u662F\u901A\u8FC7 X\u3001Y\u3001Z \u5B9A\u4F4D\u7684\u70B9\u3002\u8BFB\u6570\u663E\u793A\u5B83\u5F53\u524D\u7684\u4F4D\u7F6E\u3002\u8BBE\u7F6E\u8F66\u53A2\u96F6\u70B9\u53EA\u6539\u53D8\u5750\u6807\u53C2\u8003\uFF0C\u4E0D\u4F1A\u79FB\u52A8\u673A\u5668\u4EBA\u3002"]},{target:"#controls",title:["Movement controls: try a movement","\u79FB\u52A8\u63A7\u5236\u533A\uFF1A\u5C1D\u8BD5\u4E00\u4E2A\u52A8\u4F5C"],body:["Use Coordinates for an exact target, Jog for small steps, or Joints to turn individual joints. Move acts on the robot now. Open and Close operate the gripper. These actions are not automatically added to your program.","\u7528\u201C\u5750\u6807\u201D\u8BBE\u7F6E\u7CBE\u786E\u76EE\u6807\uFF0C\u201C\u70B9\u52A8\u201D\u8FDB\u884C\u5C0F\u6B65\u79FB\u52A8\uFF0C\u201C\u5173\u8282\u201D\u63A7\u5236\u5355\u4E2A\u5173\u8282\u3002\u201C\u79FB\u52A8\u201D\u7ACB\u5373\u64CD\u4F5C\u673A\u5668\u4EBA\uFF0C\u5F20\u5F00\u548C\u95ED\u5408\u64CD\u4F5C\u5939\u722A\u3002\u8FD9\u4E9B\u64CD\u4F5C\u4E0D\u4F1A\u81EA\u52A8\u52A0\u5165\u7A0B\u5E8F\u3002"]},{target:"#program-panel",mobileTarget:".command-box",title:["Program building: save the sequence","\u7A0B\u5E8F\u7F16\u5199\u533A\uFF1A\u4FDD\u5B58\u52A8\u4F5C\u987A\u5E8F"],body:["Record position saves the robot\u2019s current position in the list. Add Open, Close and Wait DI1 where they belong. Adding an instruction prepares it for playback; it does not immediately operate the robot.","\u201C\u8BB0\u5F55\u5F53\u524D\u4F4D\u7F6E\u201D\u628A\u673A\u5668\u4EBA\u5F53\u524D\u7684\u4F4D\u7F6E\u4FDD\u5B58\u5230\u5217\u8868\u4E2D\u3002\u6309\u987A\u5E8F\u6DFB\u52A0\u5F20\u5F00\u3001\u95ED\u5408\u548C\u7B49\u5F85 DI1\u3002\u6DFB\u52A0\u6307\u4EE4\u662F\u4E3A\u8FD0\u884C\u7A0B\u5E8F\u505A\u51C6\u5907\uFF0C\u4E0D\u4F1A\u7ACB\u5373\u64CD\u4F5C\u673A\u5668\u4EBA\u3002"]},{target:".program-bottom",title:["Run, pause and improve","\u8FD0\u884C\u3001\u6682\u505C\u4E0E\u6539\u8FDB"],body:["Run resets the boxes and executes your list from the beginning. Pause lets you inspect; Stop ends playback. Reorder or remove steps to improve the sequence. We will watch this area during the demonstration.","\u201C\u8FD0\u884C\u201D\u4F1A\u91CD\u7F6E\u7BB1\u5B50\u5E76\u4ECE\u5934\u6267\u884C\u5217\u8868\u3002\u201C\u6682\u505C\u201D\u65B9\u4FBF\u89C2\u5BDF\uFF0C\u201C\u505C\u6B62\u201D\u7ED3\u675F\u8FD0\u884C\u3002\u53EF\u4EE5\u8C03\u6574\u987A\u5E8F\u6216\u5220\u9664\u6B65\u9AA4\u6765\u6539\u8FDB\u7A0B\u5E8F\u3002\u793A\u8303\u65F6\u8BF7\u7559\u610F\u8FD9\u91CC\u3002"]},{target:"#status",title:["Status messages: what just happened?","\u72B6\u6001\u63D0\u793A\uFF1A\u521A\u521A\u53D1\u751F\u4E86\u4EC0\u4E48\uFF1F"],body:["This message bar reports results: a position reached, a box held, or a blocked movement. Read it when something does not work. It tells you what happened so you can decide what to change.","\u8FD9\u6761\u63D0\u793A\u680F\u62A5\u544A\u7ED3\u679C\uFF0C\u4F8B\u5982\u5DF2\u5230\u8FBE\u4F4D\u7F6E\u3001\u5DF2\u5939\u4F4F\u7BB1\u5B50\u6216\u79FB\u52A8\u88AB\u963B\u6B62\u3002\u64CD\u4F5C\u4E0D\u6210\u529F\u65F6\u5148\u8BFB\u8FD9\u91CC\uFF0C\u4E86\u89E3\u53D1\u751F\u4E86\u4EC0\u4E48\uFF0C\u518D\u51B3\u5B9A\u5982\u4F55\u8C03\u6574\u3002"]},{target:"#guide",title:["Learning prompts: what should I do next?","\u5B66\u4E60\u63D0\u793A\u6846\uFF1A\u4E0B\u4E00\u6B65\u505A\u4EC0\u4E48\uFF1F"],body:["This temporary box explains the next action and why it matters. During the demonstration it explains the teacher\u2019s moves; in your practice it guides your next step. It can be hidden when you are ready to work independently.","\u8FD9\u4E2A\u4E34\u65F6\u63D0\u793A\u6846\u8BF4\u660E\u4E0B\u4E00\u6B65\u505A\u4EC0\u4E48\uFF0C\u4EE5\u53CA\u4E3A\u4EC0\u4E48\u8981\u8FD9\u6837\u505A\u3002\u793A\u8303\u65F6\u89E3\u91CA\u6559\u5E08\u7684\u52A8\u4F5C\uFF0C\u7EC3\u4E60\u65F6\u5F15\u5BFC\u4F60\u7684\u4E0B\u4E00\u6B65\u3002\u80FD\u591F\u72EC\u7ACB\u64CD\u4F5C\u540E\uFF0C\u53EF\u4EE5\u5C06\u5B83\u6536\u8D77\u3002"]}];function ed({translate:i,highlightPart:e,showPrompt:t,restorePrompt:n,onClose:s}){let r=document.createElement("div");r.id="demo-tour",r.hidden=!0,r.innerHTML='<div class="tour-shade"></div><div class="tour-focus" aria-hidden="true"></div><section class="tour-card" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-description" tabindex="-1"></section>',document.body.append(r);let o=r.querySelector(".tour-focus"),a=r.querySelector(".tour-card"),l=-1,c=null,h=null,u=[],p=()=>l>=0,m=d=>document.querySelector(innerWidth<=720&&d.mobileTarget?d.mobileTarget:d.target);function g(){if(!p())return;let d=m(Js[l]),M=d.getBoundingClientRect(),v=5,x=Math.max(5,M.left-v),T=Math.max(5,M.top-v),A=Math.min(innerWidth-5,M.right+v),C=Math.min(innerHeight-5,M.bottom+v);Object.assign(o.style,{left:x+"px",top:T+"px",width:Math.max(0,A-x)+"px",height:Math.max(0,C-T)+"px"});let N=a.offsetWidth,b=a.offsetHeight,S=15,D=12,$=[{x:A+S,y:T},{x:x-N-S,y:T},{x,y:C+S},{x,y:T-b-S}].find(Z=>Z.x>=D&&Z.y>=D&&Z.x+N<=innerWidth-D&&Z.y+b<=innerHeight-D);if(!$){let Z=[{x:D,y:D},{x:innerWidth-N-D,y:D},{x:D,y:innerHeight-b-D},{x:innerWidth-N-D,y:innerHeight-b-D}],k=H=>Math.max(0,Math.min(H.x+N,A)-Math.max(H.x,x))*Math.max(0,Math.min(H.y+b,C)-Math.max(H.y,T));$=Z.sort((H,Q)=>k(H)-k(Q))[0]}a.style.left=Math.max(D,Math.min($.x,innerWidth-N-D))+"px",a.style.top=Math.max(D,Math.min($.y,innerHeight-b-D))+"px"}function _(){let d=Js[l],M=i;e(d.part||null),t(d.target==="#guide"),a.innerHTML=`<span class="eyebrow">${M("BEFORE THE ROBOT MOVES","\u673A\u5668\u4EBA\u8FD0\u52A8\u4E4B\u524D")} \xB7 ${l+1} / ${Js.length}</span><h2 id="tour-title">${M(...d.title)}</h2><p id="tour-description">${M(...d.body)}</p><div class="tour-progress" aria-hidden="true">${Js.map((x,T)=>`<i class="${T===l?"current":T<l?"done":""}"></i>`).join("")}</div><div class="actions"><button id="tour-back" ${l===0?"disabled":""}>${M("Back","\u4E0A\u4E00\u6B65")}</button><button id="tour-next" class="primary">${l===Js.length-1?M("Start robot demonstration \u2192","\u5F00\u59CB\u673A\u5668\u4EBA\u793A\u8303 \u2192"):M("Next \u2192","\u4E0B\u4E00\u6B65 \u2192")}</button><button id="tour-exit">${M("Close tour","\u5173\u95ED\u5BFC\u89C8")}</button></div>`,a.querySelector("#tour-back").onclick=()=>{l--,_()},a.querySelector("#tour-next").onclick=()=>{if(l<Js.length-1)l++,_();else{let x=c;f(),x?.()}},a.querySelector("#tour-exit").onclick=f,m(d).scrollIntoView({block:"center",inline:"nearest",behavior:"instant"}),g(),a.focus({preventScroll:!0}),requestAnimationFrame(g)}function f(){if(p()){l=-1,r.hidden=!0,e(null),n();for(let[d,M]of u)d.inert=M;u=[],h?.focus({preventScroll:!0}),s?.()}}return r.addEventListener("keydown",d=>{if(d.key==="Escape"&&(d.preventDefault(),f()),d.key==="Tab"){let M=[...a.querySelectorAll("button:not(:disabled)")],v=M[0],x=M.at(-1);d.shiftKey&&(document.activeElement===v||document.activeElement===a)?(d.preventDefault(),x.focus()):!d.shiftKey&&(document.activeElement===x||document.activeElement===a)&&(d.preventDefault(),v.focus())}}),window.addEventListener("resize",g),window.addEventListener("scroll",g,!0),{active:p,start(d){p()&&f(),h=document.activeElement,u=[...document.querySelectorAll("body>header,body>nav,body>main")].map(M=>[M,M.inert]);for(let[M]of u)M.inert=!0;c=d,l=0,r.hidden=!1,_()},close:f,refresh(){p()&&_()}}}var ls={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},cs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Nd=0,Lh=1,Ud=2;var Nh=1,wl=2,Ei=3,Oi=0,gn=1,wi=2,ki=0,Ss=1,Uh=2,Fh=3,Oh=4,Fd=5,ts=100,Od=101,Bd=102,kd=103,zd=104,Hd=200,Vd=201,Gd=202,Wd=203,Xa=204,qa=205,$d=206,Xd=207,qd=208,Yd=209,Zd=210,jd=211,Jd=212,Kd=213,Qd=214,Tl=0,Al=1,Rl=2,Es=3,Cl=4,Pl=5,Il=6,Dl=7,Bh=0,ef=1,tf=2,zi=0,nf=1,sf=2,rf=3,of=4,af=5,lf=6,cf=7;var kh=300,Ds=301,Ls=302,Ll=303,Nl=304,$o=306,Ya=1e3,es=1001,Za=1002,Wn=1003,hf=1004;var Xo=1005;var li=1006,Ul=1007;var hs=1008;var ui=1009,zh=1010,Hh=1011,Pr=1012,Fl=1013,us=1014,Ti=1015,Ir=1016,Ol=1017,Bl=1018,Dr=1020,Vh=35902,Gh=35899,Wh=1021,$h=1022,qn=1023,gr=1026,Lr=1027,Xh=1028,kl=1029,qh=1030,zl=1031;var Hl=1033,qo=33776,Yo=33777,Zo=33778,jo=33779,Vl=35840,Gl=35841,Wl=35842,$l=35843,Xl=36196,ql=37492,Yl=37496,Zl=37808,jl=37809,Jl=37810,Kl=37811,Ql=37812,ec=37813,tc=37814,nc=37815,ic=37816,sc=37817,rc=37818,oc=37819,ac=37820,lc=37821,cc=36492,hc=36494,uc=36495,dc=36283,fc=36284,pc=36285,mc=36286;var uo=2300,ja=2301,$a=2302,bh=2400,Mh=2401,Sh=2402;var uf=3200,df=3201;var Yh=0,ff=1,Hi="",ln="srgb",ws="srgb-linear",fo="linear",gt="srgb";var bs=7680;var Eh=519,pf=512,mf=513,gf=514,Zh=515,_f=516,xf=517,yf=518,vf=519,Ja=35044;var jh="300 es",ai=2e3,po=2001;var vi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},on=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],td=1234567,pr=Math.PI/180,_r=180/Math.PI;function yi(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(on[i&255]+on[i>>8&255]+on[i>>16&255]+on[i>>24&255]+"-"+on[e&255]+on[e>>8&255]+"-"+on[e>>16&15|64]+on[e>>24&255]+"-"+on[t&63|128]+on[t>>8&255]+"-"+on[t>>16&255]+on[t>>24&255]+on[n&255]+on[n>>8&255]+on[n>>16&255]+on[n>>24&255]).toLowerCase()}function nt(i,e,t){return Math.max(e,Math.min(t,i))}function Jh(i,e){return(i%e+e)%e}function jp(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Jp(i,e,t){return i!==e?(t-i)/(e-i):0}function lo(i,e,t){return(1-t)*i+t*e}function Kp(i,e,t,n){return lo(i,e,1-Math.exp(-t*n))}function Qp(i,e=1){return e-Math.abs(Jh(i,e*2)-e)}function em(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function tm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function nm(i,e){return i+Math.floor(Math.random()*(e-i+1))}function im(i,e){return i+Math.random()*(e-i)}function sm(i){return i*(.5-Math.random())}function rm(i){i!==void 0&&(td=i);let e=td+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function om(i){return i*pr}function am(i){return i*_r}function lm(i){return(i&i-1)===0&&i!==0}function cm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function hm(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function um(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),p=o((e-n)/2),m=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*h,l*u,l*p,a*c);break;case"YZY":i.set(l*p,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*p,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*m,a*c);break;case"YXY":i.set(l*m,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*m,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function oi(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function mt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Kh={DEG2RAD:pr,RAD2DEG:_r,generateUUID:yi,clamp:nt,euclideanModulo:Jh,mapLinear:jp,inverseLerp:Jp,lerp:lo,damp:Kp,pingpong:Qp,smoothstep:em,smootherstep:tm,randInt:nm,randFloat:im,randFloatSpread:sm,seededRandom:rm,degToRad:om,radToDeg:am,isPowerOfTwo:lm,ceilPowerOfTwo:cm,floorPowerOfTwo:hm,setQuaternionFromProperEuler:um,normalize:mt,denormalize:oi},le=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},$n=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],p=r[o+0],m=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=p,e[t+1]=m,e[t+2]=g,e[t+3]=_;return}if(u!==_||l!==p||c!==m||h!==g){let f=1-a,d=l*p+c*m+h*g+u*_,M=d>=0?1:-1,v=1-d*d;if(v>Number.EPSILON){let T=Math.sqrt(v),A=Math.atan2(T,d*M);f=Math.sin(f*A)/T,a=Math.sin(a*A)/T}let x=a*M;if(l=l*f+p*x,c=c*f+m*x,h=h*f+g*x,u=u*f+_*x,f===1-a){let T=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=T,c*=T,h*=T,u*=T}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],p=r[o+1],m=r[o+2],g=r[o+3];return e[t]=a*g+h*u+l*m-c*p,e[t+1]=l*g+h*p+c*u-a*m,e[t+2]=c*g+h*m+a*p-l*u,e[t+3]=h*g-a*u-l*p-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),p=l(n/2),m=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=p*h*u+c*m*g,this._y=c*m*u-p*h*g,this._z=c*h*g+p*m*u,this._w=c*h*u-p*m*g;break;case"YXZ":this._x=p*h*u+c*m*g,this._y=c*m*u-p*h*g,this._z=c*h*g-p*m*u,this._w=c*h*u+p*m*g;break;case"ZXY":this._x=p*h*u-c*m*g,this._y=c*m*u+p*h*g,this._z=c*h*g+p*m*u,this._w=c*h*u-p*m*g;break;case"ZYX":this._x=p*h*u-c*m*g,this._y=c*m*u+p*h*g,this._z=c*h*g-p*m*u,this._w=c*h*u+p*m*g;break;case"YZX":this._x=p*h*u+c*m*g,this._y=c*m*u+p*h*g,this._z=c*h*g-p*m*u,this._w=c*h*u-p*m*g;break;case"XZY":this._x=p*h*u-c*m*g,this._y=c*m*u-p*h*g,this._z=c*h*g+p*m*u,this._w=c*h*u+p*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],p=n+a+u;if(p>0){let m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(o-s)*m}else if(n>a&&n>u){let m=2*Math.sqrt(1+n-a-u);this._w=(h-l)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+c)/m}else if(a>u){let m=2*Math.sqrt(1+a-n-u);this._w=(r-c)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(l+h)/m}else{let m=2*Math.sqrt(1+u-n-a);this._w=(o-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(nt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let m=1-t;return this._w=m*o+t*this._w,this._x=m*n+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,p=Math.sin(t*h)/c;return this._w=o*u+this._w*p,this._x=n*u+this._x*p,this._y=s*u+this._y*p,this._z=r*u+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(nd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(nd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Xc.copy(this).projectOnVector(e),this.sub(Xc)}reflect(e){return this.sub(Xc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Xc=new L,nd=new $n,Je=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],p=n[2],m=n[5],g=n[8],_=s[0],f=s[3],d=s[6],M=s[1],v=s[4],x=s[7],T=s[2],A=s[5],C=s[8];return r[0]=o*_+a*M+l*T,r[3]=o*f+a*v+l*A,r[6]=o*d+a*x+l*C,r[1]=c*_+h*M+u*T,r[4]=c*f+h*v+u*A,r[7]=c*d+h*x+u*C,r[2]=p*_+m*M+g*T,r[5]=p*f+m*v+g*A,r[8]=p*d+m*x+g*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,p=a*l-h*r,m=c*r-o*l,g=t*u+n*p+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=u*_,e[1]=(s*c-h*n)*_,e[2]=(a*n-s*o)*_,e[3]=p*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-a*t)*_,e[6]=m*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(qc.makeScale(e,t)),this}rotate(e){return this.premultiply(qc.makeRotation(-e)),this}translate(e,t){return this.premultiply(qc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},qc=new Je;function Qh(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function mo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function bf(){let i=mo("canvas");return i.style.display="block",i}var id={};function xr(i){i in id||(id[i]=!0,console.warn(i))}function Mf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var sd=new Je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),rd=new Je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function dm(){let i={enabled:!0,workingColorSpace:ws,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===gt&&(s.r=Fi(s.r),s.g=Fi(s.g),s.b=Fi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===gt&&(s.r=mr(s.r),s.g=mr(s.g),s.b=mr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Hi?fo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return xr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return xr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ws]:{primaries:e,whitePoint:n,transfer:fo,toXYZ:sd,fromXYZ:rd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ln},outputColorSpaceConfig:{drawingBufferColorSpace:ln}},[ln]:{primaries:e,whitePoint:n,transfer:gt,toXYZ:sd,fromXYZ:rd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ln}}}),i}var lt=dm();function Fi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function mr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Ks,Ka=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ks===void 0&&(Ks=mo("canvas")),Ks.width=e.width,Ks.height=e.height;let s=Ks.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Ks}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=mo("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Fi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Fi(t[n]/255)*255):t[n]=Fi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},fm=0,yr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:fm++}),this.uuid=yi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Yc(s[o].image)):r.push(Yc(s[o]))}else r=Yc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Yc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ka.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var pm=0,Zc=new L,Sn=class i extends vi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=es,s=es,r=li,o=hs,a=qn,l=ui,c=i.DEFAULT_ANISOTROPY,h=Hi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:pm++}),this.uuid=yi(),this.name="",this.source=new yr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new le(0,0),this.repeat=new le(1,1),this.center=new le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Zc).x}get height(){return this.source.getSize(Zc).y}get depth(){return this.source.getSize(Zc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==kh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ya:e.x=e.x-Math.floor(e.x);break;case es:e.x=e.x<0?0:1;break;case Za:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ya:e.y=e.y-Math.floor(e.y);break;case es:e.y=e.y<0?0:1;break;case Za:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Sn.DEFAULT_IMAGE=null;Sn.DEFAULT_MAPPING=kh;Sn.DEFAULT_ANISOTROPY=1;var Nt=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],p=l[1],m=l[5],g=l[9],_=l[2],f=l[6],d=l[10];if(Math.abs(h-p)<.01&&Math.abs(u-_)<.01&&Math.abs(g-f)<.01){if(Math.abs(h+p)<.1&&Math.abs(u+_)<.1&&Math.abs(g+f)<.1&&Math.abs(c+m+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(c+1)/2,x=(m+1)/2,T=(d+1)/2,A=(h+p)/4,C=(u+_)/4,N=(g+f)/4;return v>x&&v>T?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=A/n,r=C/n):x>T?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=A/s,r=N/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=C/r,s=N/r),this.set(n,s,r,t),this}let M=Math.sqrt((f-g)*(f-g)+(u-_)*(u-_)+(p-h)*(p-h));return Math.abs(M)<.001&&(M=1),this.x=(f-g)/M,this.y=(u-_)/M,this.z=(p-h)/M,this.w=Math.acos((c+m+d-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this.w=nt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this.w=nt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Qa=class extends vi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:li,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Nt(0,0,e,t),this.scissorTest=!1,this.viewport=new Nt(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new Sn(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:li,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new yr(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},bi=class extends Qa{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},go=class extends Sn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Wn,this.minFilter=Wn,this.wrapR=es,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var el=class extends Sn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Wn,this.minFilter=Wn,this.wrapR=es,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Mi=class{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ii.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ii.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ii.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ii):ii.fromBufferAttribute(r,o),ii.applyMatrix4(e.matrixWorld),this.expandByPoint(ii);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ma.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ma.copy(n.boundingBox)),ma.applyMatrix4(e.matrixWorld),this.union(ma)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ii),ii.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Qr),ga.subVectors(this.max,Qr),Qs.subVectors(e.a,Qr),er.subVectors(e.b,Qr),tr.subVectors(e.c,Qr),Yi.subVectors(er,Qs),Zi.subVectors(tr,er),_s.subVectors(Qs,tr);let t=[0,-Yi.z,Yi.y,0,-Zi.z,Zi.y,0,-_s.z,_s.y,Yi.z,0,-Yi.x,Zi.z,0,-Zi.x,_s.z,0,-_s.x,-Yi.y,Yi.x,0,-Zi.y,Zi.x,0,-_s.y,_s.x,0];return!jc(t,Qs,er,tr,ga)||(t=[1,0,0,0,1,0,0,0,1],!jc(t,Qs,er,tr,ga))?!1:(_a.crossVectors(Yi,Zi),t=[_a.x,_a.y,_a.z],jc(t,Qs,er,tr,ga))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ii).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ii).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ii[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ii[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ii[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ii[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ii[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ii[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ii[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ii[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ii),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Ii=[new L,new L,new L,new L,new L,new L,new L,new L],ii=new L,ma=new Mi,Qs=new L,er=new L,tr=new L,Yi=new L,Zi=new L,_s=new L,Qr=new L,ga=new L,_a=new L,xs=new L;function jc(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){xs.fromArray(i,r);let a=s.x*Math.abs(xs.x)+s.y*Math.abs(xs.y)+s.z*Math.abs(xs.z),l=e.dot(xs),c=t.dot(xs),h=n.dot(xs);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var mm=new Mi,eo=new L,Jc=new L,Ts=class{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):mm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;eo.subVectors(e,this.center);let t=eo.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(eo,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Jc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(eo.copy(e.center).add(Jc)),this.expandByPoint(eo.copy(e.center).sub(Jc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Di=new L,Kc=new L,xa=new L,ji=new L,Qc=new L,ya=new L,eh=new L,ns=class{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Di)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Di.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Di.copy(this.origin).addScaledVector(this.direction,t),Di.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Kc.copy(e).add(t).multiplyScalar(.5),xa.copy(t).sub(e).normalize(),ji.copy(this.origin).sub(Kc);let r=e.distanceTo(t)*.5,o=-this.direction.dot(xa),a=ji.dot(this.direction),l=-ji.dot(xa),c=ji.lengthSq(),h=Math.abs(1-o*o),u,p,m,g;if(h>0)if(u=o*l-a,p=o*a-l,g=r*h,u>=0)if(p>=-g)if(p<=g){let _=1/h;u*=_,p*=_,m=u*(u+o*p+2*a)+p*(o*u+p+2*l)+c}else p=r,u=Math.max(0,-(o*p+a)),m=-u*u+p*(p+2*l)+c;else p=-r,u=Math.max(0,-(o*p+a)),m=-u*u+p*(p+2*l)+c;else p<=-g?(u=Math.max(0,-(-o*r+a)),p=u>0?-r:Math.min(Math.max(-r,-l),r),m=-u*u+p*(p+2*l)+c):p<=g?(u=0,p=Math.min(Math.max(-r,-l),r),m=p*(p+2*l)+c):(u=Math.max(0,-(o*r+a)),p=u>0?r:Math.min(Math.max(-r,-l),r),m=-u*u+p*(p+2*l)+c);else p=o>0?-r:r,u=Math.max(0,-(o*p+a)),m=-u*u+p*(p+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Kc).addScaledVector(xa,p),m}intersectSphere(e,t){Di.subVectors(e.center,this.origin);let n=Di.dot(this.direction),s=Di.dot(Di)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,p=this.origin;return c>=0?(n=(e.min.x-p.x)*c,s=(e.max.x-p.x)*c):(n=(e.max.x-p.x)*c,s=(e.min.x-p.x)*c),h>=0?(r=(e.min.y-p.y)*h,o=(e.max.y-p.y)*h):(r=(e.max.y-p.y)*h,o=(e.min.y-p.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-p.z)*u,l=(e.max.z-p.z)*u):(a=(e.max.z-p.z)*u,l=(e.min.z-p.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Di)!==null}intersectTriangle(e,t,n,s,r){Qc.subVectors(t,e),ya.subVectors(n,e),eh.crossVectors(Qc,ya);let o=this.direction.dot(eh),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ji.subVectors(this.origin,e);let l=a*this.direction.dot(ya.crossVectors(ji,ya));if(l<0)return null;let c=a*this.direction.dot(Qc.cross(ji));if(c<0||l+c>o)return null;let h=-a*ji.dot(eh);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},dt=class i{constructor(e,t,n,s,r,o,a,l,c,h,u,p,m,g,_,f){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,u,p,m,g,_,f)}set(e,t,n,s,r,o,a,l,c,h,u,p,m,g,_,f){let d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=p,d[3]=m,d[7]=g,d[11]=_,d[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/nr.setFromMatrixColumn(e,0).length(),r=1/nr.setFromMatrixColumn(e,1).length(),o=1/nr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let p=o*h,m=o*u,g=a*h,_=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=m+g*c,t[5]=p-_*c,t[9]=-a*l,t[2]=_-p*c,t[6]=g+m*c,t[10]=o*l}else if(e.order==="YXZ"){let p=l*h,m=l*u,g=c*h,_=c*u;t[0]=p+_*a,t[4]=g*a-m,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=m*a-g,t[6]=_+p*a,t[10]=o*l}else if(e.order==="ZXY"){let p=l*h,m=l*u,g=c*h,_=c*u;t[0]=p-_*a,t[4]=-o*u,t[8]=g+m*a,t[1]=m+g*a,t[5]=o*h,t[9]=_-p*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let p=o*h,m=o*u,g=a*h,_=a*u;t[0]=l*h,t[4]=g*c-m,t[8]=p*c+_,t[1]=l*u,t[5]=_*c+p,t[9]=m*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let p=o*l,m=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=_-p*u,t[8]=g*u+m,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=m*u+g,t[10]=p-_*u}else if(e.order==="XZY"){let p=o*l,m=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=p*u+_,t[5]=o*h,t[9]=m*u-g,t[2]=g*u-m,t[6]=a*h,t[10]=_*u+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(gm,e,_m)}lookAt(e,t,n){let s=this.elements;return Pn.subVectors(e,t),Pn.lengthSq()===0&&(Pn.z=1),Pn.normalize(),Ji.crossVectors(n,Pn),Ji.lengthSq()===0&&(Math.abs(n.z)===1?Pn.x+=1e-4:Pn.z+=1e-4,Pn.normalize(),Ji.crossVectors(n,Pn)),Ji.normalize(),va.crossVectors(Pn,Ji),s[0]=Ji.x,s[4]=va.x,s[8]=Pn.x,s[1]=Ji.y,s[5]=va.y,s[9]=Pn.y,s[2]=Ji.z,s[6]=va.z,s[10]=Pn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],p=n[9],m=n[13],g=n[2],_=n[6],f=n[10],d=n[14],M=n[3],v=n[7],x=n[11],T=n[15],A=s[0],C=s[4],N=s[8],b=s[12],S=s[1],D=s[5],V=s[9],$=s[13],Z=s[2],k=s[6],H=s[10],Q=s[14],X=s[3],he=s[7],ye=s[11],Te=s[15];return r[0]=o*A+a*S+l*Z+c*X,r[4]=o*C+a*D+l*k+c*he,r[8]=o*N+a*V+l*H+c*ye,r[12]=o*b+a*$+l*Q+c*Te,r[1]=h*A+u*S+p*Z+m*X,r[5]=h*C+u*D+p*k+m*he,r[9]=h*N+u*V+p*H+m*ye,r[13]=h*b+u*$+p*Q+m*Te,r[2]=g*A+_*S+f*Z+d*X,r[6]=g*C+_*D+f*k+d*he,r[10]=g*N+_*V+f*H+d*ye,r[14]=g*b+_*$+f*Q+d*Te,r[3]=M*A+v*S+x*Z+T*X,r[7]=M*C+v*D+x*k+T*he,r[11]=M*N+v*V+x*H+T*ye,r[15]=M*b+v*$+x*Q+T*Te,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],p=e[10],m=e[14],g=e[3],_=e[7],f=e[11],d=e[15];return g*(+r*l*u-s*c*u-r*a*p+n*c*p+s*a*m-n*l*m)+_*(+t*l*m-t*c*p+r*o*p-s*o*m+s*c*h-r*l*h)+f*(+t*c*u-t*a*m-r*o*u+n*o*m+r*a*h-n*c*h)+d*(-s*a*h-t*l*u+t*a*p+s*o*u-n*o*p+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],p=e[10],m=e[11],g=e[12],_=e[13],f=e[14],d=e[15],M=u*f*c-_*p*c+_*l*m-a*f*m-u*l*d+a*p*d,v=g*p*c-h*f*c-g*l*m+o*f*m+h*l*d-o*p*d,x=h*_*c-g*u*c+g*a*m-o*_*m-h*a*d+o*u*d,T=g*u*l-h*_*l-g*a*p+o*_*p+h*a*f-o*u*f,A=t*M+n*v+s*x+r*T;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/A;return e[0]=M*C,e[1]=(_*p*r-u*f*r-_*s*m+n*f*m+u*s*d-n*p*d)*C,e[2]=(a*f*r-_*l*r+_*s*c-n*f*c-a*s*d+n*l*d)*C,e[3]=(u*l*r-a*p*r-u*s*c+n*p*c+a*s*m-n*l*m)*C,e[4]=v*C,e[5]=(h*f*r-g*p*r+g*s*m-t*f*m-h*s*d+t*p*d)*C,e[6]=(g*l*r-o*f*r-g*s*c+t*f*c+o*s*d-t*l*d)*C,e[7]=(o*p*r-h*l*r+h*s*c-t*p*c-o*s*m+t*l*m)*C,e[8]=x*C,e[9]=(g*u*r-h*_*r-g*n*m+t*_*m+h*n*d-t*u*d)*C,e[10]=(o*_*r-g*a*r+g*n*c-t*_*c-o*n*d+t*a*d)*C,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*m-t*a*m)*C,e[12]=T*C,e[13]=(h*_*s-g*u*s+g*n*p-t*_*p-h*n*f+t*u*f)*C,e[14]=(g*a*s-o*_*s-g*n*l+t*_*l+o*n*f-t*a*f)*C,e[15]=(o*u*s-h*a*s+h*n*l-t*u*l-o*n*p+t*a*p)*C,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,p=r*c,m=r*h,g=r*u,_=o*h,f=o*u,d=a*u,M=l*c,v=l*h,x=l*u,T=n.x,A=n.y,C=n.z;return s[0]=(1-(_+d))*T,s[1]=(m+x)*T,s[2]=(g-v)*T,s[3]=0,s[4]=(m-x)*A,s[5]=(1-(p+d))*A,s[6]=(f+M)*A,s[7]=0,s[8]=(g+v)*C,s[9]=(f-M)*C,s[10]=(1-(p+_))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=nr.set(s[0],s[1],s[2]).length(),o=nr.set(s[4],s[5],s[6]).length(),a=nr.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],si.copy(this);let c=1/r,h=1/o,u=1/a;return si.elements[0]*=c,si.elements[1]*=c,si.elements[2]*=c,si.elements[4]*=h,si.elements[5]*=h,si.elements[6]*=h,si.elements[8]*=u,si.elements[9]*=u,si.elements[10]*=u,t.setFromRotationMatrix(si),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=ai,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-s),p=(t+e)/(t-e),m=(n+s)/(n-s),g,_;if(l)g=r/(o-r),_=o*r/(o-r);else if(a===ai)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===po)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=p,c[12]=0,c[1]=0,c[5]=u,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=ai,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-s),p=-(t+e)/(t-e),m=-(n+s)/(n-s),g,_;if(l)g=1/(o-r),_=o/(o-r);else if(a===ai)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===po)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=p,c[1]=0,c[5]=u,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},nr=new L,si=new dt,gm=new L(0,0,0),_m=new L(1,1,1),Ji=new L,va=new L,Pn=new L,od=new dt,ad=new $n,ci=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],p=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(nt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-nt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(nt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-nt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(nt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-nt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return od.makeRotationFromQuaternion(e),this.setFromRotationMatrix(od,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ad.setFromEuler(this),this.setFromQuaternion(ad,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ci.DEFAULT_ORDER="XYZ";var vr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},xm=0,ld=new L,ir=new $n,Li=new dt,ba=new L,to=new L,ym=new L,vm=new $n,cd=new L(1,0,0),hd=new L(0,1,0),ud=new L(0,0,1),dd={type:"added"},bm={type:"removed"},sr={type:"childadded",child:null},th={type:"childremoved",child:null},$t=class i extends vi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:xm++}),this.uuid=yi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new L,t=new ci,n=new $n,s=new L(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new dt},normalMatrix:{value:new Je}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ir.setFromAxisAngle(e,t),this.quaternion.multiply(ir),this}rotateOnWorldAxis(e,t){return ir.setFromAxisAngle(e,t),this.quaternion.premultiply(ir),this}rotateX(e){return this.rotateOnAxis(cd,e)}rotateY(e){return this.rotateOnAxis(hd,e)}rotateZ(e){return this.rotateOnAxis(ud,e)}translateOnAxis(e,t){return ld.copy(e).applyQuaternion(this.quaternion),this.position.add(ld.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(cd,e)}translateY(e){return this.translateOnAxis(hd,e)}translateZ(e){return this.translateOnAxis(ud,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Li.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ba.copy(e):ba.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),to.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Li.lookAt(to,ba,this.up):Li.lookAt(ba,to,this.up),this.quaternion.setFromRotationMatrix(Li),s&&(Li.extractRotation(s.matrixWorld),ir.setFromRotationMatrix(Li),this.quaternion.premultiply(ir.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(dd),sr.child=e,this.dispatchEvent(sr),sr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(bm),th.child=e,this.dispatchEvent(th),th.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Li.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Li.multiply(e.parent.matrixWorld)),e.applyMatrix4(Li),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(dd),sr.child=e,this.dispatchEvent(sr),sr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(to,e,ym),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(to,vm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),p=o(e.skeletons),m=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),p.length>0&&(n.skeletons=p),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};$t.DEFAULT_UP=new L(0,1,0);$t.DEFAULT_MATRIX_AUTO_UPDATE=!0;$t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ri=new L,Ni=new L,nh=new L,Ui=new L,rr=new L,or=new L,fd=new L,ih=new L,sh=new L,rh=new L,oh=new Nt,ah=new Nt,lh=new Nt,xi=class i{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),ri.subVectors(e,t),s.cross(ri);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){ri.subVectors(s,t),Ni.subVectors(n,t),nh.subVectors(e,t);let o=ri.dot(ri),a=ri.dot(Ni),l=ri.dot(nh),c=Ni.dot(Ni),h=Ni.dot(nh),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let p=1/u,m=(c*l-a*h)*p,g=(o*h-a*l)*p;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Ui)===null?!1:Ui.x>=0&&Ui.y>=0&&Ui.x+Ui.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,Ui)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ui.x),l.addScaledVector(o,Ui.y),l.addScaledVector(a,Ui.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return oh.setScalar(0),ah.setScalar(0),lh.setScalar(0),oh.fromBufferAttribute(e,t),ah.fromBufferAttribute(e,n),lh.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(oh,r.x),o.addScaledVector(ah,r.y),o.addScaledVector(lh,r.z),o}static isFrontFacing(e,t,n,s){return ri.subVectors(n,t),Ni.subVectors(e,t),ri.cross(Ni).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ri.subVectors(this.c,this.b),Ni.subVectors(this.a,this.b),ri.cross(Ni).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;rr.subVectors(s,n),or.subVectors(r,n),ih.subVectors(e,n);let l=rr.dot(ih),c=or.dot(ih);if(l<=0&&c<=0)return t.copy(n);sh.subVectors(e,s);let h=rr.dot(sh),u=or.dot(sh);if(h>=0&&u<=h)return t.copy(s);let p=l*u-h*c;if(p<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(rr,o);rh.subVectors(e,r);let m=rr.dot(rh),g=or.dot(rh);if(g>=0&&m<=g)return t.copy(r);let _=m*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(or,a);let f=h*g-m*u;if(f<=0&&u-h>=0&&m-g>=0)return fd.subVectors(r,s),a=(u-h)/(u-h+(m-g)),t.copy(s).addScaledVector(fd,a);let d=1/(f+_+p);return o=_*d,a=p*d,t.copy(n).addScaledVector(rr,o).addScaledVector(or,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Sf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ki={h:0,s:0,l:0},Ma={h:0,s:0,l:0};function ch(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var je=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ln){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,lt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=lt.workingColorSpace){return this.r=e,this.g=t,this.b=n,lt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=lt.workingColorSpace){if(e=Jh(e,1),t=nt(t,0,1),n=nt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=ch(o,r,e+1/3),this.g=ch(o,r,e),this.b=ch(o,r,e-1/3)}return lt.colorSpaceToWorking(this,s),this}setStyle(e,t=ln){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ln){let n=Sf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Fi(e.r),this.g=Fi(e.g),this.b=Fi(e.b),this}copyLinearToSRGB(e){return this.r=mr(e.r),this.g=mr(e.g),this.b=mr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ln){return lt.workingToColorSpace(an.copy(this),e),Math.round(nt(an.r*255,0,255))*65536+Math.round(nt(an.g*255,0,255))*256+Math.round(nt(an.b*255,0,255))}getHexString(e=ln){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=lt.workingColorSpace){lt.workingToColorSpace(an.copy(this),t);let n=an.r,s=an.g,r=an.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=lt.workingColorSpace){return lt.workingToColorSpace(an.copy(this),t),e.r=an.r,e.g=an.g,e.b=an.b,e}getStyle(e=ln){lt.workingToColorSpace(an.copy(this),e);let t=an.r,n=an.g,s=an.b;return e!==ln?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Ki),this.setHSL(Ki.h+e,Ki.s+t,Ki.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ki),e.getHSL(Ma);let n=lo(Ki.h,Ma.h,t),s=lo(Ki.s,Ma.s,t),r=lo(Ki.l,Ma.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},an=new je;je.NAMES=Sf;var Mm=0,Si=class extends vi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Mm++}),this.uuid=yi(),this.name="",this.type="Material",this.blending=Ss,this.side=Oi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xa,this.blendDst=qa,this.blendEquation=ts,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new je(0,0,0),this.blendAlpha=0,this.depthFunc=Es,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Eh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=bs,this.stencilZFail=bs,this.stencilZPass=bs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ss&&(n.blending=this.blending),this.side!==Oi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Xa&&(n.blendSrc=this.blendSrc),this.blendDst!==qa&&(n.blendDst=this.blendDst),this.blendEquation!==ts&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Es&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Eh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==bs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==bs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==bs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},hn=class extends Si{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ci,this.combine=Bh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Vt=new L,Sa=new le,Sm=0,Mn=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Sm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ja,this.updateRanges=[],this.gpuType=Ti,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Sa.fromBufferAttribute(this,t),Sa.applyMatrix3(e),this.setXY(t,Sa.x,Sa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyMatrix3(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyMatrix4(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyNormalMatrix(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.transformDirection(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=oi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=mt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=oi(t,this.array)),t}setX(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=oi(t,this.array)),t}setY(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=oi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=oi(t,this.array)),t}setW(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array),s=mt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array),s=mt(s,this.array),r=mt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ja&&(e.usage=this.usage),e}};var _o=class extends Mn{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var xo=class extends Mn{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var ht=class extends Mn{constructor(e,t,n){super(new Float32Array(e),t,n)}},Em=0,Vn=new dt,hh=new $t,ar=new L,In=new Mi,no=new Mi,Jt=new L,Et=class i extends vi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Em++}),this.uuid=yi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Qh(e)?xo:_o)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Je().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Vn.makeRotationFromQuaternion(e),this.applyMatrix4(Vn),this}rotateX(e){return Vn.makeRotationX(e),this.applyMatrix4(Vn),this}rotateY(e){return Vn.makeRotationY(e),this.applyMatrix4(Vn),this}rotateZ(e){return Vn.makeRotationZ(e),this.applyMatrix4(Vn),this}translate(e,t,n){return Vn.makeTranslation(e,t,n),this.applyMatrix4(Vn),this}scale(e,t,n){return Vn.makeScale(e,t,n),this.applyMatrix4(Vn),this}lookAt(e){return hh.lookAt(e),hh.updateMatrix(),this.applyMatrix4(hh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ar).negate(),this.translate(ar.x,ar.y,ar.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ht(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];In.setFromBufferAttribute(r),this.morphTargetsRelative?(Jt.addVectors(this.boundingBox.min,In.min),this.boundingBox.expandByPoint(Jt),Jt.addVectors(this.boundingBox.max,In.max),this.boundingBox.expandByPoint(Jt)):(this.boundingBox.expandByPoint(In.min),this.boundingBox.expandByPoint(In.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ts);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){let n=this.boundingSphere.center;if(In.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];no.setFromBufferAttribute(a),this.morphTargetsRelative?(Jt.addVectors(In.min,no.min),In.expandByPoint(Jt),Jt.addVectors(In.max,no.max),In.expandByPoint(Jt)):(In.expandByPoint(no.min),In.expandByPoint(no.max))}In.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Jt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Jt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Jt.fromBufferAttribute(a,c),l&&(ar.fromBufferAttribute(e,c),Jt.add(ar)),s=Math.max(s,n.distanceToSquared(Jt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Mn(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let N=0;N<n.count;N++)a[N]=new L,l[N]=new L;let c=new L,h=new L,u=new L,p=new le,m=new le,g=new le,_=new L,f=new L;function d(N,b,S){c.fromBufferAttribute(n,N),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,S),p.fromBufferAttribute(r,N),m.fromBufferAttribute(r,b),g.fromBufferAttribute(r,S),h.sub(c),u.sub(c),m.sub(p),g.sub(p);let D=1/(m.x*g.y-g.x*m.y);isFinite(D)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-m.y).multiplyScalar(D),f.copy(u).multiplyScalar(m.x).addScaledVector(h,-g.x).multiplyScalar(D),a[N].add(_),a[b].add(_),a[S].add(_),l[N].add(f),l[b].add(f),l[S].add(f))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let N=0,b=M.length;N<b;++N){let S=M[N],D=S.start,V=S.count;for(let $=D,Z=D+V;$<Z;$+=3)d(e.getX($+0),e.getX($+1),e.getX($+2))}let v=new L,x=new L,T=new L,A=new L;function C(N){T.fromBufferAttribute(s,N),A.copy(T);let b=a[N];v.copy(b),v.sub(T.multiplyScalar(T.dot(b))).normalize(),x.crossVectors(A,b);let D=x.dot(l[N])<0?-1:1;o.setXYZW(N,v.x,v.y,v.z,D)}for(let N=0,b=M.length;N<b;++N){let S=M[N],D=S.start,V=S.count;for(let $=D,Z=D+V;$<Z;$+=3)C(e.getX($+0)),C(e.getX($+1)),C(e.getX($+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Mn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let p=0,m=n.count;p<m;p++)n.setXYZ(p,0,0,0);let s=new L,r=new L,o=new L,a=new L,l=new L,c=new L,h=new L,u=new L;if(e)for(let p=0,m=e.count;p<m;p+=3){let g=e.getX(p+0),_=e.getX(p+1),f=e.getX(p+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,f),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,f),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let p=0,m=t.count;p<m;p+=3)s.fromBufferAttribute(t,p+0),r.fromBufferAttribute(t,p+1),o.fromBufferAttribute(t,p+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(p+0,h.x,h.y,h.z),n.setXYZ(p+1,h.x,h.y,h.z),n.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Jt.fromBufferAttribute(e,t),Jt.normalize(),e.setXYZ(t,Jt.x,Jt.y,Jt.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,p=new c.constructor(l.length*h),m=0,g=0;for(let _=0,f=l.length;_<f;_++){a.isInterleavedBufferAttribute?m=l[_]*a.data.stride+a.offset:m=l[_]*h;for(let d=0;d<h;d++)p[g++]=c[m++]}return new Mn(p,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let p=c[h],m=e(p,n);l.push(m)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,p=c.length;u<p;u++){let m=c[u];h.push(m.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let p=0,m=u.length;p<m;p++)h.push(u[p].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},pd=new dt,ys=new ns,Ea=new Ts,md=new L,wa=new L,Ta=new L,Aa=new L,uh=new L,Ra=new L,gd=new L,Ca=new L,_t=class extends $t{constructor(e=new Et,t=new hn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Ra.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(uh.fromBufferAttribute(u,e),o?Ra.addScaledVector(uh,h):Ra.addScaledVector(uh.sub(t),h))}t.add(Ra)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ea.copy(n.boundingSphere),Ea.applyMatrix4(r),ys.copy(e.ray).recast(e.near),!(Ea.containsPoint(ys.origin)===!1&&(ys.intersectSphere(Ea,md)===null||ys.origin.distanceToSquared(md)>(e.far-e.near)**2))&&(pd.copy(r).invert(),ys.copy(e.ray).applyMatrix4(pd),!(n.boundingBox!==null&&ys.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ys)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,p=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=p.length;g<_;g++){let f=p[g],d=o[f.materialIndex],M=Math.max(f.start,m.start),v=Math.min(a.count,Math.min(f.start+f.count,m.start+m.count));for(let x=M,T=v;x<T;x+=3){let A=a.getX(x),C=a.getX(x+1),N=a.getX(x+2);s=Pa(this,d,e,n,c,h,u,A,C,N),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{let g=Math.max(0,m.start),_=Math.min(a.count,m.start+m.count);for(let f=g,d=_;f<d;f+=3){let M=a.getX(f),v=a.getX(f+1),x=a.getX(f+2);s=Pa(this,o,e,n,c,h,u,M,v,x),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=p.length;g<_;g++){let f=p[g],d=o[f.materialIndex],M=Math.max(f.start,m.start),v=Math.min(l.count,Math.min(f.start+f.count,m.start+m.count));for(let x=M,T=v;x<T;x+=3){let A=x,C=x+1,N=x+2;s=Pa(this,d,e,n,c,h,u,A,C,N),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{let g=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let f=g,d=_;f<d;f+=3){let M=f,v=f+1,x=f+2;s=Pa(this,o,e,n,c,h,u,M,v,x),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}}};function wm(i,e,t,n,s,r,o,a){let l;if(e.side===gn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Oi,a),l===null)return null;Ca.copy(a),Ca.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Ca);return c<t.near||c>t.far?null:{distance:c,point:Ca.clone(),object:i}}function Pa(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,wa),i.getVertexPosition(l,Ta),i.getVertexPosition(c,Aa);let h=wm(i,e,t,n,wa,Ta,Aa,gd);if(h){let u=new L;xi.getBarycoord(gd,wa,Ta,Aa,u),s&&(h.uv=xi.getInterpolatedAttribute(s,a,l,c,u,new le)),r&&(h.uv1=xi.getInterpolatedAttribute(r,a,l,c,u,new le)),o&&(h.normal=xi.getInterpolatedAttribute(o,a,l,c,u,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let p={a,b:l,c,normal:new L,materialIndex:0};xi.getNormal(wa,Ta,Aa,p.normal),h.face=p,h.barycoord=u}return h}var kt=class i extends Et{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],p=0,m=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ht(c,3)),this.setAttribute("normal",new ht(h,3)),this.setAttribute("uv",new ht(u,2));function g(_,f,d,M,v,x,T,A,C,N,b){let S=x/C,D=T/N,V=x/2,$=T/2,Z=A/2,k=C+1,H=N+1,Q=0,X=0,he=new L;for(let ye=0;ye<H;ye++){let Te=ye*D-$;for(let $e=0;$e<k;$e++){let Qe=$e*S-V;he[_]=Qe*M,he[f]=Te*v,he[d]=Z,c.push(he.x,he.y,he.z),he[_]=0,he[f]=0,he[d]=A>0?1:-1,h.push(he.x,he.y,he.z),u.push($e/C),u.push(1-ye/N),Q+=1}}for(let ye=0;ye<N;ye++)for(let Te=0;Te<C;Te++){let $e=p+Te+k*ye,Qe=p+Te+k*(ye+1),st=p+(Te+1)+k*(ye+1),at=p+(Te+1)+k*ye;l.push($e,Qe,at),l.push(Qe,st,at),X+=6}a.addGroup(m,X,b),m+=X,p+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Ns(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function un(i){let e={};for(let t=0;t<i.length;t++){let n=Ns(i[t]);for(let s in n)e[s]=n[s]}return e}function Tm(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function eu(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:lt.workingColorSpace}var Ef={clone:Ns,merge:un},Am=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Rm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,hi=class extends Si{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Am,this.fragmentShader=Rm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ns(e.uniforms),this.uniformsGroups=Tm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},yo=class extends $t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=ai,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Qi=new L,_d=new le,xd=new le,Kt=class extends yo{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=_r*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(pr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return _r*2*Math.atan(Math.tan(pr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Qi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Qi.x,Qi.y).multiplyScalar(-e/Qi.z),Qi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Qi.x,Qi.y).multiplyScalar(-e/Qi.z)}getViewSize(e,t){return this.getViewBounds(e,_d,xd),t.subVectors(xd,_d)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(pr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},lr=-90,cr=1,tl=class extends $t{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Kt(lr,cr,e,t);s.layers=this.layers,this.add(s);let r=new Kt(lr,cr,e,t);r.layers=this.layers,this.add(r);let o=new Kt(lr,cr,e,t);o.layers=this.layers,this.add(o);let a=new Kt(lr,cr,e,t);a.layers=this.layers,this.add(a);let l=new Kt(lr,cr,e,t);l.layers=this.layers,this.add(l);let c=new Kt(lr,cr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===ai)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===po)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,p,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},vo=class extends Sn{constructor(e=[],t=Ds,n,s,r,o,a,l,c,h){super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},nl=class extends bi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new vo(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new kt(5,5,5),r=new hi({name:"CubemapFromEquirect",uniforms:Ns(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:gn,blending:ki});r.uniforms.tEquirect.value=t;let o=new _t(s,r),a=t.minFilter;return t.minFilter===hs&&(t.minFilter=li),new tl(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},cn=class extends $t{constructor(){super(),this.isGroup=!0,this.type="Group"}},Cm={type:"move"},br=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new cn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new cn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new cn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let f=t.getJointPose(_,n),d=this._getHandJoint(c,_);f!==null&&(d.matrix.fromArray(f.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=f.radius),d.visible=f!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],p=h.position.distanceTo(u.position),m=.02,g=.005;c.inputState.pinching&&p>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&p<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Cm)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new cn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var bo=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new je(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},As=class extends $t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ci,this.environmentIntensity=1,this.environmentRotation=new ci,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},il=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ja,this.updateRanges=[],this.version=0,this.uuid=yi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=yi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=yi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},mn=new L,Mo=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)mn.fromBufferAttribute(this,t),mn.applyMatrix4(e),this.setXYZ(t,mn.x,mn.y,mn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)mn.fromBufferAttribute(this,t),mn.applyNormalMatrix(e),this.setXYZ(t,mn.x,mn.y,mn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)mn.fromBufferAttribute(this,t),mn.transformDirection(e),this.setXYZ(t,mn.x,mn.y,mn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=oi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=mt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=mt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=mt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=mt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=mt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=oi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=oi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=oi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=oi(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array),s=mt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array),s=mt(s,this.array),r=mt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Mn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Mr=class extends Si{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new je(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},hr,io=new L,ur=new L,dr=new L,fr=new le,so=new le,wf=new dt,Ia=new L,ro=new L,Da=new L,yd=new le,dh=new le,vd=new le,So=class extends $t{constructor(e=new Mr){if(super(),this.isSprite=!0,this.type="Sprite",hr===void 0){hr=new Et;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new il(t,5);hr.setIndex([0,1,2,0,2,3]),hr.setAttribute("position",new Mo(n,3,0,!1)),hr.setAttribute("uv",new Mo(n,2,3,!1))}this.geometry=hr,this.material=e,this.center=new le(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ur.setFromMatrixScale(this.matrixWorld),wf.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),dr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ur.multiplyScalar(-dr.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;La(Ia.set(-.5,-.5,0),dr,o,ur,s,r),La(ro.set(.5,-.5,0),dr,o,ur,s,r),La(Da.set(.5,.5,0),dr,o,ur,s,r),yd.set(0,0),dh.set(1,0),vd.set(1,1);let a=e.ray.intersectTriangle(Ia,ro,Da,!1,io);if(a===null&&(La(ro.set(-.5,.5,0),dr,o,ur,s,r),dh.set(0,1),a=e.ray.intersectTriangle(Ia,Da,ro,!1,io),a===null))return;let l=e.ray.origin.distanceTo(io);l<e.near||l>e.far||t.push({distance:l,point:io.clone(),uv:xi.getInterpolation(io,Ia,ro,Da,yd,dh,vd,new le),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function La(i,e,t,n,s,r){fr.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(so.x=r*fr.x-s*fr.y,so.y=s*fr.x+r*fr.y):so.copy(fr),i.copy(e),i.x+=so.x,i.y+=so.y,i.applyMatrix4(wf)}var fh=new L,Pm=new L,Im=new Je,Gn=class{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=fh.subVectors(n,t).cross(Pm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(fh),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Im.getNormalMatrix(e),s=this.coplanarPoint(fh).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},vs=new Ts,Dm=new le(.5,.5),Na=new L,Sr=class{constructor(e=new Gn,t=new Gn,n=new Gn,s=new Gn,r=new Gn,o=new Gn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ai,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],p=r[6],m=r[7],g=r[8],_=r[9],f=r[10],d=r[11],M=r[12],v=r[13],x=r[14],T=r[15];if(s[0].setComponents(c-o,m-h,d-g,T-M).normalize(),s[1].setComponents(c+o,m+h,d+g,T+M).normalize(),s[2].setComponents(c+a,m+u,d+_,T+v).normalize(),s[3].setComponents(c-a,m-u,d-_,T-v).normalize(),n)s[4].setComponents(l,p,f,x).normalize(),s[5].setComponents(c-l,m-p,d-f,T-x).normalize();else if(s[4].setComponents(c-l,m-p,d-f,T-x).normalize(),t===ai)s[5].setComponents(c+l,m+p,d+f,T+x).normalize();else if(t===po)s[5].setComponents(l,p,f,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),vs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),vs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(vs)}intersectsSprite(e){vs.center.set(0,0,0);let t=Dm.distanceTo(e.center);return vs.radius=.7071067811865476+t,vs.applyMatrix4(e.matrixWorld),this.intersectsSphere(vs)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Na.x=s.normal.x>0?e.max.x:e.min.x,Na.y=s.normal.y>0?e.max.y:e.min.y,Na.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Na)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Dn=class extends Si{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new je(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},sl=new L,rl=new L,bd=new dt,oo=new ns,Ua=new Ts,ph=new L,Md=new L,is=class extends $t{constructor(e=new Et,t=new Dn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)sl.fromBufferAttribute(t,s-1),rl.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=sl.distanceTo(rl);e.setAttribute("lineDistance",new ht(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ua.copy(n.boundingSphere),Ua.applyMatrix4(s),Ua.radius+=r,e.ray.intersectsSphere(Ua)===!1)return;bd.copy(s).invert(),oo.copy(e.ray).applyMatrix4(bd);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,p=n.attributes.position;if(h!==null){let m=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=m,f=g-1;_<f;_+=c){let d=h.getX(_),M=h.getX(_+1),v=Fa(this,e,oo,l,d,M,_);v&&t.push(v)}if(this.isLineLoop){let _=h.getX(g-1),f=h.getX(m),d=Fa(this,e,oo,l,_,f,g-1);d&&t.push(d)}}else{let m=Math.max(0,o.start),g=Math.min(p.count,o.start+o.count);for(let _=m,f=g-1;_<f;_+=c){let d=Fa(this,e,oo,l,_,_+1,_);d&&t.push(d)}if(this.isLineLoop){let _=Fa(this,e,oo,l,g-1,m,g-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Fa(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(sl.fromBufferAttribute(a,s),rl.fromBufferAttribute(a,r),t.distanceSqToSegment(sl,rl,ph,Md)>n)return;ph.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(ph);if(!(c<e.near||c>e.far))return{distance:c,point:Md.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var Sd=new L,Ed=new L,Bi=class extends is{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Sd.fromBufferAttribute(t,s),Ed.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Sd.distanceTo(Ed);e.setAttribute("lineDistance",new ht(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var ss=class extends Sn{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Eo=class extends Sn{constructor(e,t,n=us,s,r,o,a=Wn,l=Wn,c,h=gr,u=1){if(h!==gr&&h!==Lr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let p={width:e,height:t,depth:u};super(p,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new yr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},wo=class extends Sn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var Ft=class i extends Et{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],p=[],m=[],g=0,_=[],f=n/2,d=0;M(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new ht(u,3)),this.setAttribute("normal",new ht(p,3)),this.setAttribute("uv",new ht(m,2));function M(){let x=new L,T=new L,A=0,C=(t-e)/n;for(let N=0;N<=r;N++){let b=[],S=N/r,D=S*(t-e)+e;for(let V=0;V<=s;V++){let $=V/s,Z=$*l+a,k=Math.sin(Z),H=Math.cos(Z);T.x=D*k,T.y=-S*n+f,T.z=D*H,u.push(T.x,T.y,T.z),x.set(k,C,H).normalize(),p.push(x.x,x.y,x.z),m.push($,1-S),b.push(g++)}_.push(b)}for(let N=0;N<s;N++)for(let b=0;b<r;b++){let S=_[b][N],D=_[b+1][N],V=_[b+1][N+1],$=_[b][N+1];(e>0||b!==0)&&(h.push(S,D,$),A+=3),(t>0||b!==r-1)&&(h.push(D,V,$),A+=3)}c.addGroup(d,A,0),d+=A}function v(x){let T=g,A=new le,C=new L,N=0,b=x===!0?e:t,S=x===!0?1:-1;for(let V=1;V<=s;V++)u.push(0,f*S,0),p.push(0,S,0),m.push(.5,.5),g++;let D=g;for(let V=0;V<=s;V++){let Z=V/s*l+a,k=Math.cos(Z),H=Math.sin(Z);C.x=b*H,C.y=f*S,C.z=b*k,u.push(C.x,C.y,C.z),p.push(0,S,0),A.x=k*.5+.5,A.y=H*.5*S+.5,m.push(A.x,A.y),g++}for(let V=0;V<s;V++){let $=T+V,Z=D+V;x===!0?h.push(Z,Z+1,$):h.push(Z+1,Z,$),N+=3}c.addGroup(d,N,x===!0?1:2),d+=N}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ol=class i extends Ft{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Oa=new L,Ba=new L,mh=new L,ka=new xi,Rs=class extends Et{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let s=Math.pow(10,4),r=Math.cos(pr*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),p={},m=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);let{a:_,b:f,c:d}=ka;if(_.fromBufferAttribute(a,c[0]),f.fromBufferAttribute(a,c[1]),d.fromBufferAttribute(a,c[2]),ka.getNormal(mh),u[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,u[1]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,u[2]=`${Math.round(d.x*s)},${Math.round(d.y*s)},${Math.round(d.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let M=0;M<3;M++){let v=(M+1)%3,x=u[M],T=u[v],A=ka[h[M]],C=ka[h[v]],N=`${x}_${T}`,b=`${T}_${x}`;b in p&&p[b]?(mh.dot(p[b].normal)<=r&&(m.push(A.x,A.y,A.z),m.push(C.x,C.y,C.z)),p[b]=null):N in p||(p[N]={index0:c[M],index1:c[v],normal:mh.clone()})}}for(let g in p)if(p[g]){let{index0:_,index1:f}=p[g];Oa.fromBufferAttribute(a,_),Ba.fromBufferAttribute(a,f),m.push(Oa.x,Oa.y,Oa.z),m.push(Ba.x,Ba.y,Ba.z)}this.setAttribute("position",new ht(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},Ln=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],p=n[s+1]-h,m=(o-h)/p;return(s+m)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new le:new L);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new L,s=[],r=[],o=[],a=new L,l=new dt;for(let m=0;m<=e;m++){let g=m/e;s[m]=this.getTangentAt(g,new L)}r[0]=new L,o[0]=new L;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),p=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),p<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let m=1;m<=e;m++){if(r[m]=r[m-1].clone(),o[m]=o[m-1].clone(),a.crossVectors(s[m-1],s[m]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(nt(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(l.makeRotationAxis(a,g))}o[m].crossVectors(s[m],r[m])}if(t===!0){let m=Math.acos(nt(r[0].dot(r[e]),-1,1));m/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(m=-m);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],m*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Er=class extends Ln{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new le){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),p=l-this.aX,m=c-this.aY;l=p*h-m*u+this.aX,c=p*u+m*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},al=class extends Er{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function tu(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let p=(o-r)/c-(a-r)/(c+h)+(a-o)/h,m=(a-o)/h-(l-o)/(h+u)+(l-a)/u;p*=h,m*=h,s(o,a,p,m)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var za=new L,gh=new tu,_h=new tu,xh=new tu,ll=class extends Ln{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new L){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(za.subVectors(s[0],s[1]).add(s[0]),c=za);let u=s[a%r],p=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(za.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=za),this.curveType==="centripetal"||this.curveType==="chordal"){let m=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(u),m),_=Math.pow(u.distanceToSquared(p),m),f=Math.pow(p.distanceToSquared(h),m);_<1e-4&&(_=1),g<1e-4&&(g=_),f<1e-4&&(f=_),gh.initNonuniformCatmullRom(c.x,u.x,p.x,h.x,g,_,f),_h.initNonuniformCatmullRom(c.y,u.y,p.y,h.y,g,_,f),xh.initNonuniformCatmullRom(c.z,u.z,p.z,h.z,g,_,f)}else this.curveType==="catmullrom"&&(gh.initCatmullRom(c.x,u.x,p.x,h.x,this.tension),_h.initCatmullRom(c.y,u.y,p.y,h.y,this.tension),xh.initCatmullRom(c.z,u.z,p.z,h.z,this.tension));return n.set(gh.calc(l),_h.calc(l),xh.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function wd(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function Lm(i,e){let t=1-i;return t*t*e}function Nm(i,e){return 2*(1-i)*i*e}function Um(i,e){return i*i*e}function co(i,e,t,n){return Lm(i,e)+Nm(i,t)+Um(i,n)}function Fm(i,e){let t=1-i;return t*t*t*e}function Om(i,e){let t=1-i;return 3*t*t*i*e}function Bm(i,e){return 3*(1-i)*i*i*e}function km(i,e){return i*i*i*e}function ho(i,e,t,n,s){return Fm(i,e)+Om(i,t)+Bm(i,n)+km(i,s)}var To=class extends Ln{constructor(e=new le,t=new le,n=new le,s=new le){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new le){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ho(e,s.x,r.x,o.x,a.x),ho(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},cl=class extends Ln{constructor(e=new L,t=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new L){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ho(e,s.x,r.x,o.x,a.x),ho(e,s.y,r.y,o.y,a.y),ho(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ao=class extends Ln{constructor(e=new le,t=new le){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new le){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new le){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},hl=class extends Ln{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ro=class extends Ln{constructor(e=new le,t=new le,n=new le){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new le){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(co(e,s.x,r.x,o.x),co(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ul=class extends Ln{constructor(e=new L,t=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new L){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(co(e,s.x,r.x,o.x),co(e,s.y,r.y,o.y),co(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Co=class extends Ln{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new le){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(wd(a,l.x,c.x,h.x,u.x),wd(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new le().fromArray(s))}return this}},wh=Object.freeze({__proto__:null,ArcCurve:al,CatmullRomCurve3:ll,CubicBezierCurve:To,CubicBezierCurve3:cl,EllipseCurve:Er,LineCurve:Ao,LineCurve3:hl,QuadraticBezierCurve:Ro,QuadraticBezierCurve3:ul,SplineCurve:Co}),dl=class extends Ln{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new wh[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new wh[s.type]().fromJSON(s))}return this}},Po=class extends dl{constructor(e){super(),this.type="Path",this.currentPoint=new le,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Ao(this.currentPoint.clone(),new le(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Ro(this.currentPoint.clone(),new le(e,t),new le(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new To(this.currentPoint.clone(),new le(e,t),new le(n,s),new le(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Co(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){let c=new Er(e,t,n,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},wr=class extends Po{constructor(e){super(e),this.uuid=yi(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new Po().fromJSON(s))}return this}};function zm(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Tf(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=$m(i,e,r,t)),i.length>80*t){a=1/0,l=1/0;let h=-1/0,u=-1/0;for(let p=t;p<s;p+=t){let m=i[p],g=i[p+1];m<a&&(a=m),g<l&&(l=g),m>h&&(h=m),g>u&&(u=g)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return Io(r,o,t,a,l,c,0),o}function Tf(i,e,t,n,s){let r;if(s===ng(i,e,t,n)>0)for(let o=e;o<t;o+=n)r=Td(o/n|0,i[o],i[o+1],r);else for(let o=t-n;o>=e;o-=n)r=Td(o/n|0,i[o],i[o+1],r);return r&&Tr(r,r.next)&&(Lo(r),r=r.next),r}function Cs(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Tr(t,t.next)||Lt(t.prev,t,t.next)===0)){if(Lo(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Io(i,e,t,n,s,r,o){if(!i)return;!o&&r&&jm(i,n,s,r);let a=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?Vm(i,n,s,r):Hm(i)){e.push(l.i,i.i,c.i),Lo(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=Gm(Cs(i),e),Io(i,e,t,n,s,r,2)):o===2&&Wm(i,e,t,n,s,r):Io(Cs(i),e,t,n,s,r,1);break}}}function Hm(i){let e=i.prev,t=i,n=i.next;if(Lt(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=Math.min(s,r,o),u=Math.min(a,l,c),p=Math.max(s,r,o),m=Math.max(a,l,c),g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=p&&g.y>=u&&g.y<=m&&ao(s,a,r,l,o,c,g.x,g.y)&&Lt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Vm(i,e,t,n){let s=i.prev,r=i,o=i.next;if(Lt(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,p=o.y,m=Math.min(a,l,c),g=Math.min(h,u,p),_=Math.max(a,l,c),f=Math.max(h,u,p),d=Th(m,g,e,t,n),M=Th(_,f,e,t,n),v=i.prevZ,x=i.nextZ;for(;v&&v.z>=d&&x&&x.z<=M;){if(v.x>=m&&v.x<=_&&v.y>=g&&v.y<=f&&v!==s&&v!==o&&ao(a,h,l,u,c,p,v.x,v.y)&&Lt(v.prev,v,v.next)>=0||(v=v.prevZ,x.x>=m&&x.x<=_&&x.y>=g&&x.y<=f&&x!==s&&x!==o&&ao(a,h,l,u,c,p,x.x,x.y)&&Lt(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;v&&v.z>=d;){if(v.x>=m&&v.x<=_&&v.y>=g&&v.y<=f&&v!==s&&v!==o&&ao(a,h,l,u,c,p,v.x,v.y)&&Lt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;x&&x.z<=M;){if(x.x>=m&&x.x<=_&&x.y>=g&&x.y<=f&&x!==s&&x!==o&&ao(a,h,l,u,c,p,x.x,x.y)&&Lt(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function Gm(i,e){let t=i;do{let n=t.prev,s=t.next.next;!Tr(n,s)&&Rf(n,t,t.next,s)&&Do(n,s)&&Do(s,n)&&(e.push(n.i,t.i,s.i),Lo(t),Lo(t.next),t=i=s),t=t.next}while(t!==i);return Cs(t)}function Wm(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Qm(o,a)){let l=Cf(o,a);o=Cs(o,o.next),l=Cs(l,l.next),Io(o,e,t,n,s,r,0),Io(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function $m(i,e,t,n){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=Tf(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Km(c))}s.sort(Xm);for(let r=0;r<s.length;r++)t=qm(s[r],t);return t}function Xm(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function qm(i,e){let t=Ym(i,e);if(!t)return e;let n=Cf(t,i);return Cs(n,n.next),Cs(t,t.next)}function Ym(i,e){let t=e,n=i.x,s=i.y,r=-1/0,o;if(Tr(i,t))return t;do{if(Tr(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,o=t.x<t.next.x?t:t.next,u===n))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;t=o;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Af(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);Do(t,i)&&(u<h||u===h&&(t.x>o.x||t.x===o.x&&Zm(o,t)))&&(o=t,h=u)}t=t.next}while(t!==a);return o}function Zm(i,e){return Lt(i.prev,i,e.prev)<0&&Lt(e.next,i,i.next)<0}function jm(i,e,t,n){let s=i;do s.z===0&&(s.z=Th(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Jm(s)}function Jm(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let o=n,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,t*=2}while(e>1);return i}function Th(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Km(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Af(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function ao(i,e,t,n,s,r,o,a){return!(i===o&&e===a)&&Af(i,e,t,n,s,r,o,a)}function Qm(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!eg(i,e)&&(Do(i,e)&&Do(e,i)&&tg(i,e)&&(Lt(i.prev,i,e.prev)||Lt(i,e.prev,e))||Tr(i,e)&&Lt(i.prev,i,i.next)>0&&Lt(e.prev,e,e.next)>0)}function Lt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Tr(i,e){return i.x===e.x&&i.y===e.y}function Rf(i,e,t,n){let s=Va(Lt(i,e,t)),r=Va(Lt(i,e,n)),o=Va(Lt(t,n,i)),a=Va(Lt(t,n,e));return!!(s!==r&&o!==a||s===0&&Ha(i,t,e)||r===0&&Ha(i,n,e)||o===0&&Ha(t,i,n)||a===0&&Ha(t,e,n))}function Ha(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Va(i){return i>0?1:i<0?-1:0}function eg(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Rf(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Do(i,e){return Lt(i.prev,i,i.next)<0?Lt(i,e,i.next)>=0&&Lt(i,i.prev,e)>=0:Lt(i,e,i.prev)<0||Lt(i,i.next,e)<0}function tg(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Cf(i,e){let t=Ah(i.i,i.x,i.y),n=Ah(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Td(i,e,t,n){let s=Ah(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Lo(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Ah(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function ng(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var Rh=class{static triangulate(e,t,n=2){return zm(e,t,n)}},Ms=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Ad(e),Rd(n,e);let o=e.length;t.forEach(Ad);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,Rd(n,t[l]);let a=Rh.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function Ad(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Rd(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var No=class i extends Et{constructor(e=new wr([new le(.5,.5),new le(-.5,.5),new le(-.5,-.5),new le(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new ht(s,3)),this.setAttribute("uv",new ht(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,p=t.bevelEnabled!==void 0?t.bevelEnabled:!0,m=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:m-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,f=t.bevelSegments!==void 0?t.bevelSegments:3,d=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:ig,v,x=!1,T,A,C,N;d&&(v=d.getSpacedPoints(h),x=!0,p=!1,T=d.computeFrenetFrames(h,!1),A=new L,C=new L,N=new L),p||(f=0,m=0,g=0,_=0);let b=a.extractPoints(c),S=b.shape,D=b.holes;if(!Ms.isClockWise(S)){S=S.reverse();for(let oe=0,se=D.length;oe<se;oe++){let ne=D[oe];Ms.isClockWise(ne)&&(D[oe]=ne.reverse())}}function $(oe){let ne=10000000000000001e-36,te=oe[0];for(let xe=1;xe<=oe.length;xe++){let ce=xe%oe.length,me=oe[ce],Ye=me.x-te.x,Ve=me.y-te.y,R=Ye*Ye+Ve*Ve,y=Math.max(Math.abs(me.x),Math.abs(me.y),Math.abs(te.x),Math.abs(te.y)),B=ne*y*y;if(R<=B){oe.splice(ce,1),xe--;continue}te=me}}$(S),D.forEach($);let Z=D.length,k=S;for(let oe=0;oe<Z;oe++){let se=D[oe];S=S.concat(se)}function H(oe,se,ne){return se||console.error("THREE.ExtrudeGeometry: vec does not exist"),oe.clone().addScaledVector(se,ne)}let Q=S.length;function X(oe,se,ne){let te,xe,ce,me=oe.x-se.x,Ye=oe.y-se.y,Ve=ne.x-oe.x,R=ne.y-oe.y,y=me*me+Ye*Ye,B=me*R-Ye*Ve;if(Math.abs(B)>Number.EPSILON){let q=Math.sqrt(y),re=Math.sqrt(Ve*Ve+R*R),J=se.x-Ye/q,Le=se.y+me/q,fe=ne.x-R/re,De=ne.y+Ve/re,Ce=((fe-J)*R-(De-Le)*Ve)/(me*R-Ye*Ve);te=J+me*Ce-oe.x,xe=Le+Ye*Ce-oe.y;let ue=te*te+xe*xe;if(ue<=2)return new le(te,xe);ce=Math.sqrt(ue/2)}else{let q=!1;me>Number.EPSILON?Ve>Number.EPSILON&&(q=!0):me<-Number.EPSILON?Ve<-Number.EPSILON&&(q=!0):Math.sign(Ye)===Math.sign(R)&&(q=!0),q?(te=-Ye,xe=me,ce=Math.sqrt(y)):(te=me,xe=Ye,ce=Math.sqrt(y/2))}return new le(te/ce,xe/ce)}let he=[];for(let oe=0,se=k.length,ne=se-1,te=oe+1;oe<se;oe++,ne++,te++)ne===se&&(ne=0),te===se&&(te=0),he[oe]=X(k[oe],k[ne],k[te]);let ye=[],Te,$e=he.concat();for(let oe=0,se=Z;oe<se;oe++){let ne=D[oe];Te=[];for(let te=0,xe=ne.length,ce=xe-1,me=te+1;te<xe;te++,ce++,me++)ce===xe&&(ce=0),me===xe&&(me=0),Te[te]=X(ne[te],ne[ce],ne[me]);ye.push(Te),$e=$e.concat(Te)}let Qe;if(f===0)Qe=Ms.triangulateShape(k,D);else{let oe=[],se=[];for(let ne=0;ne<f;ne++){let te=ne/f,xe=m*Math.cos(te*Math.PI/2),ce=g*Math.sin(te*Math.PI/2)+_;for(let me=0,Ye=k.length;me<Ye;me++){let Ve=H(k[me],he[me],ce);Oe(Ve.x,Ve.y,-xe),te===0&&oe.push(Ve)}for(let me=0,Ye=Z;me<Ye;me++){let Ve=D[me];Te=ye[me];let R=[];for(let y=0,B=Ve.length;y<B;y++){let q=H(Ve[y],Te[y],ce);Oe(q.x,q.y,-xe),te===0&&R.push(q)}te===0&&se.push(R)}}Qe=Ms.triangulateShape(oe,se)}let st=Qe.length,at=g+_;for(let oe=0;oe<Q;oe++){let se=p?H(S[oe],$e[oe],at):S[oe];x?(C.copy(T.normals[0]).multiplyScalar(se.x),A.copy(T.binormals[0]).multiplyScalar(se.y),N.copy(v[0]).add(C).add(A),Oe(N.x,N.y,N.z)):Oe(se.x,se.y,0)}for(let oe=1;oe<=h;oe++)for(let se=0;se<Q;se++){let ne=p?H(S[se],$e[se],at):S[se];x?(C.copy(T.normals[oe]).multiplyScalar(ne.x),A.copy(T.binormals[oe]).multiplyScalar(ne.y),N.copy(v[oe]).add(C).add(A),Oe(N.x,N.y,N.z)):Oe(ne.x,ne.y,u/h*oe)}for(let oe=f-1;oe>=0;oe--){let se=oe/f,ne=m*Math.cos(se*Math.PI/2),te=g*Math.sin(se*Math.PI/2)+_;for(let xe=0,ce=k.length;xe<ce;xe++){let me=H(k[xe],he[xe],te);Oe(me.x,me.y,u+ne)}for(let xe=0,ce=D.length;xe<ce;xe++){let me=D[xe];Te=ye[xe];for(let Ye=0,Ve=me.length;Ye<Ve;Ye++){let R=H(me[Ye],Te[Ye],te);x?Oe(R.x,R.y+v[h-1].y,v[h-1].x+ne):Oe(R.x,R.y,u+ne)}}}ee(),ae();function ee(){let oe=s.length/3;if(p){let se=0,ne=Q*se;for(let te=0;te<st;te++){let xe=Qe[te];Ie(xe[2]+ne,xe[1]+ne,xe[0]+ne)}se=h+f*2,ne=Q*se;for(let te=0;te<st;te++){let xe=Qe[te];Ie(xe[0]+ne,xe[1]+ne,xe[2]+ne)}}else{for(let se=0;se<st;se++){let ne=Qe[se];Ie(ne[2],ne[1],ne[0])}for(let se=0;se<st;se++){let ne=Qe[se];Ie(ne[0]+Q*h,ne[1]+Q*h,ne[2]+Q*h)}}n.addGroup(oe,s.length/3-oe,0)}function ae(){let oe=s.length/3,se=0;Re(k,se),se+=k.length;for(let ne=0,te=D.length;ne<te;ne++){let xe=D[ne];Re(xe,se),se+=xe.length}n.addGroup(oe,s.length/3-oe,1)}function Re(oe,se){let ne=oe.length;for(;--ne>=0;){let te=ne,xe=ne-1;xe<0&&(xe=oe.length-1);for(let ce=0,me=h+f*2;ce<me;ce++){let Ye=Q*ce,Ve=Q*(ce+1),R=se+te+Ye,y=se+xe+Ye,B=se+xe+Ve,q=se+te+Ve;et(R,y,B,q)}}}function Oe(oe,se,ne){l.push(oe),l.push(se),l.push(ne)}function Ie(oe,se,ne){ft(oe),ft(se),ft(ne);let te=s.length/3,xe=M.generateTopUV(n,s,te-3,te-2,te-1);I(xe[0]),I(xe[1]),I(xe[2])}function et(oe,se,ne,te){ft(oe),ft(se),ft(te),ft(se),ft(ne),ft(te);let xe=s.length/3,ce=M.generateSideWallUV(n,s,xe-6,xe-3,xe-2,xe-1);I(ce[0]),I(ce[1]),I(ce[3]),I(ce[1]),I(ce[2]),I(ce[3])}function ft(oe){s.push(l[oe*3+0]),s.push(l[oe*3+1]),s.push(l[oe*3+2])}function I(oe){r.push(oe.x),r.push(oe.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return sg(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new wh[s.type]().fromJSON(s)),new i(n,e.options)}},ig={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new le(r,o),new le(a,l),new le(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],p=e[s*3],m=e[s*3+1],g=e[s*3+2],_=e[r*3],f=e[r*3+1],d=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new le(o,1-l),new le(c,1-u),new le(p,1-g),new le(_,1-d)]:[new le(a,1-l),new le(h,1-u),new le(m,1-g),new le(f,1-d)]}};function sg(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Uo=class i extends Et{constructor(e=[new le(0,-.5),new le(.5,0),new le(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=nt(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/t,u=new L,p=new le,m=new L,g=new L,_=new L,f=0,d=0;for(let M=0;M<=e.length-1;M++)switch(M){case 0:f=e[M+1].x-e[M].x,d=e[M+1].y-e[M].y,m.x=d*1,m.y=-f,m.z=d*0,_.copy(m),m.normalize(),l.push(m.x,m.y,m.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:f=e[M+1].x-e[M].x,d=e[M+1].y-e[M].y,m.x=d*1,m.y=-f,m.z=d*0,g.copy(m),m.x+=_.x,m.y+=_.y,m.z+=_.z,m.normalize(),l.push(m.x,m.y,m.z),_.copy(g)}for(let M=0;M<=t;M++){let v=n+M*h*s,x=Math.sin(v),T=Math.cos(v);for(let A=0;A<=e.length-1;A++){u.x=e[A].x*x,u.y=e[A].y,u.z=e[A].x*T,o.push(u.x,u.y,u.z),p.x=M/t,p.y=A/(e.length-1),a.push(p.x,p.y);let C=l[3*A+0]*x,N=l[3*A+1],b=l[3*A+0]*T;c.push(C,N,b)}}for(let M=0;M<t;M++)for(let v=0;v<e.length-1;v++){let x=v+M*e.length,T=x,A=x+e.length,C=x+e.length+1,N=x+1;r.push(T,A,N),r.push(C,N,A)}this.setIndex(r),this.setAttribute("position",new ht(o,3)),this.setAttribute("uv",new ht(a,2)),this.setAttribute("normal",new ht(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}};var Ps=class i extends Et{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=e/a,p=t/l,m=[],g=[],_=[],f=[];for(let d=0;d<h;d++){let M=d*p-o;for(let v=0;v<c;v++){let x=v*u-r;g.push(x,-M,0),_.push(0,0,1),f.push(v/a),f.push(1-d/l)}}for(let d=0;d<l;d++)for(let M=0;M<a;M++){let v=M+c*d,x=M+c*(d+1),T=M+1+c*(d+1),A=M+1+c*d;m.push(v,x,A),m.push(x,T,A)}this.setIndex(m),this.setAttribute("position",new ht(g,3)),this.setAttribute("normal",new ht(_,3)),this.setAttribute("uv",new ht(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Xn=class i extends Et{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new L,p=new L,m=[],g=[],_=[],f=[];for(let d=0;d<=n;d++){let M=[],v=d/n,x=0;d===0&&o===0?x=.5/t:d===n&&l===Math.PI&&(x=-.5/t);for(let T=0;T<=t;T++){let A=T/t;u.x=-e*Math.cos(s+A*r)*Math.sin(o+v*a),u.y=e*Math.cos(o+v*a),u.z=e*Math.sin(s+A*r)*Math.sin(o+v*a),g.push(u.x,u.y,u.z),p.copy(u).normalize(),_.push(p.x,p.y,p.z),f.push(A+x,1-v),M.push(c++)}h.push(M)}for(let d=0;d<n;d++)for(let M=0;M<t;M++){let v=h[d][M+1],x=h[d][M],T=h[d+1][M],A=h[d+1][M+1];(d!==0||o>0)&&m.push(v,x,A),(d!==n-1||l<Math.PI)&&m.push(x,T,A)}this.setIndex(m),this.setAttribute("position",new ht(g,3)),this.setAttribute("normal",new ht(_,3)),this.setAttribute("uv",new ht(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Ar=class i extends Et{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],l=[],c=[],h=new L,u=new L,p=new L;for(let m=0;m<=n;m++)for(let g=0;g<=s;g++){let _=g/s*r,f=m/n*Math.PI*2;u.x=(e+t*Math.cos(f))*Math.cos(_),u.y=(e+t*Math.cos(f))*Math.sin(_),u.z=t*Math.sin(f),a.push(u.x,u.y,u.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),p.subVectors(u,h).normalize(),l.push(p.x,p.y,p.z),c.push(g/s),c.push(m/n)}for(let m=1;m<=n;m++)for(let g=1;g<=s;g++){let _=(s+1)*m+g-1,f=(s+1)*(m-1)+g-1,d=(s+1)*(m-1)+g,M=(s+1)*m+g;o.push(_,f,M),o.push(f,d,M)}this.setIndex(o),this.setAttribute("position",new ht(a,3)),this.setAttribute("normal",new ht(l,3)),this.setAttribute("uv",new ht(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var En=class extends Si{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new je(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new je(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Yh,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ci,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var fl=class extends Si{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=uf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},pl=class extends Si{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};var Rr=class extends Dn{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};function Ga(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function rg(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Is=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},ml=class extends Is{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:bh,endingEnd:bh}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Mh:r=e,a=2*t-n;break;case Sh:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Mh:o=e,l=2*n-t;break;case Sh:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,p=this._weightPrev,m=this._weightNext,g=(n-t)/(s-t),_=g*g,f=_*g,d=-p*f+2*p*_-p*g,M=(1+p)*f+(-1.5-2*p)*_+(-.5+p)*g+1,v=(-1-m)*f+(1.5+m)*_+.5*g,x=m*f-m*_;for(let T=0;T!==a;++T)r[T]=d*o[h+T]+M*o[c+T]+v*o[l+T]+x*o[u+T];return r}},gl=class extends Is{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),u=1-h;for(let p=0;p!==a;++p)r[p]=o[c+p]*u+o[l+p]*h;return r}},_l=class extends Is{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Nn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ga(t,this.TimeBufferType),this.values=Ga(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ga(e.times,Array),values:Ga(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new _l(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new gl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ml(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case uo:t=this.InterpolantFactoryMethodDiscrete;break;case ja:t=this.InterpolantFactoryMethodLinear;break;case $a:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return uo;case this.InterpolantFactoryMethodLinear:return ja;case this.InterpolantFactoryMethodSmooth:return $a}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&rg(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===$a,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*n,p=u-n,m=u+n;for(let g=0;g!==n;++g){let _=t[u+g];if(_!==t[p+g]||_!==t[m+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,p=o*n;for(let m=0;m!==n;++m)t[p+m]=t[u+m]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Nn.prototype.ValueTypeName="";Nn.prototype.TimeBufferType=Float32Array;Nn.prototype.ValueBufferType=Float32Array;Nn.prototype.DefaultInterpolation=ja;var rs=class extends Nn{constructor(e,t,n){super(e,t,n)}};rs.prototype.ValueTypeName="bool";rs.prototype.ValueBufferType=Array;rs.prototype.DefaultInterpolation=uo;rs.prototype.InterpolantFactoryMethodLinear=void 0;rs.prototype.InterpolantFactoryMethodSmooth=void 0;var xl=class extends Nn{constructor(e,t,n,s){super(e,t,n,s)}};xl.prototype.ValueTypeName="color";var yl=class extends Nn{constructor(e,t,n,s){super(e,t,n,s)}};yl.prototype.ValueTypeName="number";var vl=class extends Is{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)$n.slerpFlat(r,0,o,c-a,o,c,l);return r}},Fo=class extends Nn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new vl(this.times,this.values,this.getValueSize(),e)}};Fo.prototype.ValueTypeName="quaternion";Fo.prototype.InterpolantFactoryMethodSmooth=void 0;var os=class extends Nn{constructor(e,t,n){super(e,t,n)}};os.prototype.ValueTypeName="string";os.prototype.ValueBufferType=Array;os.prototype.DefaultInterpolation=uo;os.prototype.InterpolantFactoryMethodLinear=void 0;os.prototype.InterpolantFactoryMethodSmooth=void 0;var bl=class extends Nn{constructor(e,t,n,s){super(e,t,n,s)}};bl.prototype.ValueTypeName="vector";var Ml=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,p=c.length;u<p;u+=2){let m=c[u],g=c[u+1];if(m.global&&(m.lastIndex=0),m.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Pf=new Ml,Sl=class{constructor(e){this.manager=e!==void 0?e:Pf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Sl.DEFAULT_MATERIAL_NAME="__DEFAULT";var Oo=class extends $t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new je(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Bo=class extends Oo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy($t.DEFAULT_UP),this.updateMatrix(),this.groundColor=new je(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},yh=new dt,Cd=new L,Pd=new L,Ch=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new le(512,512),this.mapType=ui,this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Sr,this._frameExtents=new le(1,1),this._viewportCount=1,this._viewports=[new Nt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Cd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Cd),Pd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Pd),t.updateMatrixWorld(),yh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(yh,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(yh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var ko=class extends yo{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Ph=class extends Ch{constructor(){super(new ko(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},zo=class extends Oo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy($t.DEFAULT_UP),this.updateMatrix(),this.target=new $t,this.shadow=new Ph}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var El=class extends Kt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var nu="\\[\\]\\.:\\/",og=new RegExp("["+nu+"]","g"),iu="[^"+nu+"]",ag="[^"+nu.replace("\\.","")+"]",lg=/((?:WC+[\/:])*)/.source.replace("WC",iu),cg=/(WCOD+)?/.source.replace("WCOD",ag),hg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",iu),ug=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",iu),dg=new RegExp("^"+lg+cg+hg+ug+"$"),fg=["material","materials","bones","map"],Ih=class{constructor(e,t,n){let s=n||Ct.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Ct=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(og,"")}static parseTrackName(e){let t=dg.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);fg.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ct.Composite=Ih;Ct.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ct.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ct.prototype.GetterByBindingType=[Ct.prototype._getValue_direct,Ct.prototype._getValue_array,Ct.prototype._getValue_arrayElement,Ct.prototype._getValue_toArray];Ct.prototype.SetterByBindingTypeAndVersioning=[[Ct.prototype._setValue_direct,Ct.prototype._setValue_direct_setNeedsUpdate,Ct.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_array,Ct.prototype._setValue_array_setNeedsUpdate,Ct.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_arrayElement,Ct.prototype._setValue_arrayElement_setNeedsUpdate,Ct.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_fromArray,Ct.prototype._setValue_fromArray_setNeedsUpdate,Ct.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var ab=new Float32Array(1);var Id=new dt,Ho=class{constructor(e,t,n=0,s=1/0){this.ray=new ns(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new vr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Id.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Id),this}intersectObject(e,t=!0,n=[]){return Dh(e,this,n,t),n.sort(Dd),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Dh(e[s],this,n,t);return n.sort(Dd),n}};function Dd(i,e){return i.distance-e.distance}function Dh(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)Dh(r[o],e,t,!0)}}var as=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=nt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(nt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Vo=class extends Bi{constructor(e=10,t=10,n=4473924,s=8947848){n=new je(n),s=new je(s);let r=t/2,o=e/t,a=e/2,l=[],c=[];for(let p=0,m=0,g=-a;p<=t;p++,g+=o){l.push(-a,0,g,a,0,g),l.push(g,0,-a,g,0,a);let _=p===r?n:s;_.toArray(c,m),m+=3,_.toArray(c,m),m+=3,_.toArray(c,m),m+=3,_.toArray(c,m),m+=3}let h=new Et;h.setAttribute("position",new ht(l,3)),h.setAttribute("color",new ht(c,3));let u=new Dn({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}};var Ld=new L,Wa,vh,Cr=class extends $t{constructor(e=new L(0,0,1),t=new L(0,0,0),n=1,s=16776960,r=n*.2,o=r*.2){super(),this.type="ArrowHelper",Wa===void 0&&(Wa=new Et,Wa.setAttribute("position",new ht([0,0,0,0,1,0],3)),vh=new ol(.5,1,5,1),vh.translate(0,-.5,0)),this.position.copy(t),this.line=new is(Wa,new Dn({color:s,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new _t(vh,new hn({color:s,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(n,r,o)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{Ld.set(e.z,0,-e.x).normalize();let t=Math.acos(e.y);this.quaternion.setFromAxisAngle(Ld,t)}}setLength(e,t=e*.2,n=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(n,t,n),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}},Go=class extends Bi{constructor(e=1){let t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Et;s.setAttribute("position",new ht(t,3)),s.setAttribute("color",new ht(n,3));let r=new Dn({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(e,t,n){let s=new je,r=this.geometry.attributes.color.array;return s.set(e),s.toArray(r,0),s.toArray(r,3),s.set(t),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}};var Wo=class extends vi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function su(i,e,t,n){let s=pg(n);switch(t){case Wh:return i*e;case Xh:return i*e/s.components*s.byteLength;case kl:return i*e/s.components*s.byteLength;case qh:return i*e*2/s.components*s.byteLength;case zl:return i*e*2/s.components*s.byteLength;case $h:return i*e*3/s.components*s.byteLength;case qn:return i*e*4/s.components*s.byteLength;case Hl:return i*e*4/s.components*s.byteLength;case qo:case Yo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Zo:case jo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Gl:case $l:return Math.max(i,16)*Math.max(e,8)/4;case Vl:case Wl:return Math.max(i,8)*Math.max(e,8)/2;case Xl:case ql:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Yl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Zl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case jl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Jl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Kl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ql:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ec:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case tc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case nc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case ic:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case sc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case rc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case oc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case ac:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case lc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case cc:case hc:case uc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case dc:case fc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case pc:case mc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function pg(i){switch(i){case ui:case zh:return{byteLength:1,components:1};case Pr:case Hh:case Ir:return{byteLength:2,components:1};case Ol:case Bl:return{byteLength:2,components:4};case us:case Fl:case Ti:return{byteLength:4,components:1};case Vh:case Gh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function ep(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function gg(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,p=i.createBuffer();i.bindBuffer(l,p),i.bufferData(l,c,h),a.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:p,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((m,g)=>m.start-g.start);let p=0;for(let m=1;m<u.length;m++){let g=u[p],_=u[m];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++p,u[p]=_)}u.length=p+1;for(let m=0,g=u.length;m<g;m++){let _=u[m];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var _g=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,xg=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,yg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Mg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Sg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Eg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,wg=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Tg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ag=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Rg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Cg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Pg=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Ig=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Dg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Lg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ng=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ug=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Fg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Og=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Bg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,kg=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,zg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Hg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Vg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Gg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Wg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$g=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Xg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,qg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Yg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Zg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,jg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Jg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Kg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Qg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,e0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,t0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,n0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,i0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,s0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,r0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,o0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,a0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,l0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,c0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,h0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,u0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,d0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,f0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,p0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,m0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,g0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,_0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,x0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,y0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,v0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,b0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,M0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,S0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,E0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,w0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,T0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,A0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,R0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,C0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,P0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,I0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,D0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,L0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,N0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,U0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,F0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,O0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,B0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,k0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,z0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,H0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,V0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,G0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,W0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,X0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,q0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Y0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Z0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,j0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,J0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,K0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Q0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,e_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,t_=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,n_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,i_=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,s_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,r_=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,o_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,a_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,l_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,c_=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,h_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,u_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,d_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,f_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,p_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,m_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,g_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,__=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,x_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,y_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,v_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,b_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,M_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,S_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,E_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,w_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,T_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,A_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,R_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,C_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,P_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,I_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,D_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,L_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,N_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,U_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,F_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,O_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,B_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,k_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,z_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,H_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,V_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,G_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,W_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,$_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,X_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,q_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Y_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Z_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,it={alphahash_fragment:_g,alphahash_pars_fragment:xg,alphamap_fragment:yg,alphamap_pars_fragment:vg,alphatest_fragment:bg,alphatest_pars_fragment:Mg,aomap_fragment:Sg,aomap_pars_fragment:Eg,batching_pars_vertex:wg,batching_vertex:Tg,begin_vertex:Ag,beginnormal_vertex:Rg,bsdfs:Cg,iridescence_fragment:Pg,bumpmap_pars_fragment:Ig,clipping_planes_fragment:Dg,clipping_planes_pars_fragment:Lg,clipping_planes_pars_vertex:Ng,clipping_planes_vertex:Ug,color_fragment:Fg,color_pars_fragment:Og,color_pars_vertex:Bg,color_vertex:kg,common:zg,cube_uv_reflection_fragment:Hg,defaultnormal_vertex:Vg,displacementmap_pars_vertex:Gg,displacementmap_vertex:Wg,emissivemap_fragment:$g,emissivemap_pars_fragment:Xg,colorspace_fragment:qg,colorspace_pars_fragment:Yg,envmap_fragment:Zg,envmap_common_pars_fragment:jg,envmap_pars_fragment:Jg,envmap_pars_vertex:Kg,envmap_physical_pars_fragment:c0,envmap_vertex:Qg,fog_vertex:e0,fog_pars_vertex:t0,fog_fragment:n0,fog_pars_fragment:i0,gradientmap_pars_fragment:s0,lightmap_pars_fragment:r0,lights_lambert_fragment:o0,lights_lambert_pars_fragment:a0,lights_pars_begin:l0,lights_toon_fragment:h0,lights_toon_pars_fragment:u0,lights_phong_fragment:d0,lights_phong_pars_fragment:f0,lights_physical_fragment:p0,lights_physical_pars_fragment:m0,lights_fragment_begin:g0,lights_fragment_maps:_0,lights_fragment_end:x0,logdepthbuf_fragment:y0,logdepthbuf_pars_fragment:v0,logdepthbuf_pars_vertex:b0,logdepthbuf_vertex:M0,map_fragment:S0,map_pars_fragment:E0,map_particle_fragment:w0,map_particle_pars_fragment:T0,metalnessmap_fragment:A0,metalnessmap_pars_fragment:R0,morphinstance_vertex:C0,morphcolor_vertex:P0,morphnormal_vertex:I0,morphtarget_pars_vertex:D0,morphtarget_vertex:L0,normal_fragment_begin:N0,normal_fragment_maps:U0,normal_pars_fragment:F0,normal_pars_vertex:O0,normal_vertex:B0,normalmap_pars_fragment:k0,clearcoat_normal_fragment_begin:z0,clearcoat_normal_fragment_maps:H0,clearcoat_pars_fragment:V0,iridescence_pars_fragment:G0,opaque_fragment:W0,packing:$0,premultiplied_alpha_fragment:X0,project_vertex:q0,dithering_fragment:Y0,dithering_pars_fragment:Z0,roughnessmap_fragment:j0,roughnessmap_pars_fragment:J0,shadowmap_pars_fragment:K0,shadowmap_pars_vertex:Q0,shadowmap_vertex:e_,shadowmask_pars_fragment:t_,skinbase_vertex:n_,skinning_pars_vertex:i_,skinning_vertex:s_,skinnormal_vertex:r_,specularmap_fragment:o_,specularmap_pars_fragment:a_,tonemapping_fragment:l_,tonemapping_pars_fragment:c_,transmission_fragment:h_,transmission_pars_fragment:u_,uv_pars_fragment:d_,uv_pars_vertex:f_,uv_vertex:p_,worldpos_vertex:m_,background_vert:g_,background_frag:__,backgroundCube_vert:x_,backgroundCube_frag:y_,cube_vert:v_,cube_frag:b_,depth_vert:M_,depth_frag:S_,distanceRGBA_vert:E_,distanceRGBA_frag:w_,equirect_vert:T_,equirect_frag:A_,linedashed_vert:R_,linedashed_frag:C_,meshbasic_vert:P_,meshbasic_frag:I_,meshlambert_vert:D_,meshlambert_frag:L_,meshmatcap_vert:N_,meshmatcap_frag:U_,meshnormal_vert:F_,meshnormal_frag:O_,meshphong_vert:B_,meshphong_frag:k_,meshphysical_vert:z_,meshphysical_frag:H_,meshtoon_vert:V_,meshtoon_frag:G_,points_vert:W_,points_frag:$_,shadow_vert:X_,shadow_frag:q_,sprite_vert:Y_,sprite_frag:Z_},be={common:{diffuse:{value:new je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Je}},envmap:{envMap:{value:null},envMapRotation:{value:new Je},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Je},normalScale:{value:new le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0},uvTransform:{value:new Je}},sprite:{diffuse:{value:new je(16777215)},opacity:{value:1},center:{value:new le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}}},Ai={basic:{uniforms:un([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.fog]),vertexShader:it.meshbasic_vert,fragmentShader:it.meshbasic_frag},lambert:{uniforms:un([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new je(0)}}]),vertexShader:it.meshlambert_vert,fragmentShader:it.meshlambert_frag},phong:{uniforms:un([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new je(0)},specular:{value:new je(1118481)},shininess:{value:30}}]),vertexShader:it.meshphong_vert,fragmentShader:it.meshphong_frag},standard:{uniforms:un([be.common,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.roughnessmap,be.metalnessmap,be.fog,be.lights,{emissive:{value:new je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:it.meshphysical_vert,fragmentShader:it.meshphysical_frag},toon:{uniforms:un([be.common,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.gradientmap,be.fog,be.lights,{emissive:{value:new je(0)}}]),vertexShader:it.meshtoon_vert,fragmentShader:it.meshtoon_frag},matcap:{uniforms:un([be.common,be.bumpmap,be.normalmap,be.displacementmap,be.fog,{matcap:{value:null}}]),vertexShader:it.meshmatcap_vert,fragmentShader:it.meshmatcap_frag},points:{uniforms:un([be.points,be.fog]),vertexShader:it.points_vert,fragmentShader:it.points_frag},dashed:{uniforms:un([be.common,be.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:it.linedashed_vert,fragmentShader:it.linedashed_frag},depth:{uniforms:un([be.common,be.displacementmap]),vertexShader:it.depth_vert,fragmentShader:it.depth_frag},normal:{uniforms:un([be.common,be.bumpmap,be.normalmap,be.displacementmap,{opacity:{value:1}}]),vertexShader:it.meshnormal_vert,fragmentShader:it.meshnormal_frag},sprite:{uniforms:un([be.sprite,be.fog]),vertexShader:it.sprite_vert,fragmentShader:it.sprite_frag},background:{uniforms:{uvTransform:{value:new Je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:it.background_vert,fragmentShader:it.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Je}},vertexShader:it.backgroundCube_vert,fragmentShader:it.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:it.cube_vert,fragmentShader:it.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:it.equirect_vert,fragmentShader:it.equirect_frag},distanceRGBA:{uniforms:un([be.common,be.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:it.distanceRGBA_vert,fragmentShader:it.distanceRGBA_frag},shadow:{uniforms:un([be.lights,be.fog,{color:{value:new je(0)},opacity:{value:1}}]),vertexShader:it.shadow_vert,fragmentShader:it.shadow_frag}};Ai.physical={uniforms:un([Ai.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Je},clearcoatNormalScale:{value:new le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Je},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Je},sheen:{value:0},sheenColor:{value:new je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Je},transmissionSamplerSize:{value:new le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Je},attenuationDistance:{value:0},attenuationColor:{value:new je(0)},specularColor:{value:new je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Je},anisotropyVector:{value:new le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Je}}]),vertexShader:it.meshphysical_vert,fragmentShader:it.meshphysical_frag};var gc={r:0,b:0,g:0},Us=new ci,j_=new dt;function J_(i,e,t,n,s,r,o){let a=new je(0),l=r===!0?0:1,c,h,u=null,p=0,m=null;function g(v){let x=v.isScene===!0?v.background:null;return x&&x.isTexture&&(x=(v.backgroundBlurriness>0?t:e).get(x)),x}function _(v){let x=!1,T=g(v);T===null?d(a,l):T&&T.isColor&&(d(T,1),x=!0);let A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function f(v,x){let T=g(x);T&&(T.isCubeTexture||T.mapping===$o)?(h===void 0&&(h=new _t(new kt(1,1,1),new hi({name:"BackgroundCubeMaterial",uniforms:Ns(Ai.backgroundCube.uniforms),vertexShader:Ai.backgroundCube.vertexShader,fragmentShader:Ai.backgroundCube.fragmentShader,side:gn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,C,N){this.matrixWorld.copyPosition(N.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Us.copy(x.backgroundRotation),Us.x*=-1,Us.y*=-1,Us.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Us.y*=-1,Us.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(j_.makeRotationFromEuler(Us)),h.material.toneMapped=lt.getTransfer(T.colorSpace)!==gt,(u!==T||p!==T.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,u=T,p=T.version,m=i.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new _t(new Ps(2,2),new hi({name:"BackgroundMaterial",uniforms:Ns(Ai.background.uniforms),vertexShader:Ai.background.vertexShader,fragmentShader:Ai.background.fragmentShader,side:Oi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=lt.getTransfer(T.colorSpace)!==gt,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||p!==T.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,u=T,p=T.version,m=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function d(v,x){v.getRGB(gc,eu(i)),n.buffers.color.setClear(gc.r,gc.g,gc.b,x,o)}function M(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,x=1){a.set(v),l=x,d(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,d(a,l)},render:_,addToRenderList:f,dispose:M}}function K_(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null),r=s,o=!1;function a(S,D,V,$,Z){let k=!1,H=u($,V,D);r!==H&&(r=H,c(r.object)),k=m(S,$,V,Z),k&&g(S,$,V,Z),Z!==null&&e.update(Z,i.ELEMENT_ARRAY_BUFFER),(k||o)&&(o=!1,x(S,D,V,$),Z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(Z).buffer))}function l(){return i.createVertexArray()}function c(S){return i.bindVertexArray(S)}function h(S){return i.deleteVertexArray(S)}function u(S,D,V){let $=V.wireframe===!0,Z=n[S.id];Z===void 0&&(Z={},n[S.id]=Z);let k=Z[D.id];k===void 0&&(k={},Z[D.id]=k);let H=k[$];return H===void 0&&(H=p(l()),k[$]=H),H}function p(S){let D=[],V=[],$=[];for(let Z=0;Z<t;Z++)D[Z]=0,V[Z]=0,$[Z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:V,attributeDivisors:$,object:S,attributes:{},index:null}}function m(S,D,V,$){let Z=r.attributes,k=D.attributes,H=0,Q=V.getAttributes();for(let X in Q)if(Q[X].location>=0){let ye=Z[X],Te=k[X];if(Te===void 0&&(X==="instanceMatrix"&&S.instanceMatrix&&(Te=S.instanceMatrix),X==="instanceColor"&&S.instanceColor&&(Te=S.instanceColor)),ye===void 0||ye.attribute!==Te||Te&&ye.data!==Te.data)return!0;H++}return r.attributesNum!==H||r.index!==$}function g(S,D,V,$){let Z={},k=D.attributes,H=0,Q=V.getAttributes();for(let X in Q)if(Q[X].location>=0){let ye=k[X];ye===void 0&&(X==="instanceMatrix"&&S.instanceMatrix&&(ye=S.instanceMatrix),X==="instanceColor"&&S.instanceColor&&(ye=S.instanceColor));let Te={};Te.attribute=ye,ye&&ye.data&&(Te.data=ye.data),Z[X]=Te,H++}r.attributes=Z,r.attributesNum=H,r.index=$}function _(){let S=r.newAttributes;for(let D=0,V=S.length;D<V;D++)S[D]=0}function f(S){d(S,0)}function d(S,D){let V=r.newAttributes,$=r.enabledAttributes,Z=r.attributeDivisors;V[S]=1,$[S]===0&&(i.enableVertexAttribArray(S),$[S]=1),Z[S]!==D&&(i.vertexAttribDivisor(S,D),Z[S]=D)}function M(){let S=r.newAttributes,D=r.enabledAttributes;for(let V=0,$=D.length;V<$;V++)D[V]!==S[V]&&(i.disableVertexAttribArray(V),D[V]=0)}function v(S,D,V,$,Z,k,H){H===!0?i.vertexAttribIPointer(S,D,V,Z,k):i.vertexAttribPointer(S,D,V,$,Z,k)}function x(S,D,V,$){_();let Z=$.attributes,k=V.getAttributes(),H=D.defaultAttributeValues;for(let Q in k){let X=k[Q];if(X.location>=0){let he=Z[Q];if(he===void 0&&(Q==="instanceMatrix"&&S.instanceMatrix&&(he=S.instanceMatrix),Q==="instanceColor"&&S.instanceColor&&(he=S.instanceColor)),he!==void 0){let ye=he.normalized,Te=he.itemSize,$e=e.get(he);if($e===void 0)continue;let Qe=$e.buffer,st=$e.type,at=$e.bytesPerElement,ee=st===i.INT||st===i.UNSIGNED_INT||he.gpuType===Fl;if(he.isInterleavedBufferAttribute){let ae=he.data,Re=ae.stride,Oe=he.offset;if(ae.isInstancedInterleavedBuffer){for(let Ie=0;Ie<X.locationSize;Ie++)d(X.location+Ie,ae.meshPerAttribute);S.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let Ie=0;Ie<X.locationSize;Ie++)f(X.location+Ie);i.bindBuffer(i.ARRAY_BUFFER,Qe);for(let Ie=0;Ie<X.locationSize;Ie++)v(X.location+Ie,Te/X.locationSize,st,ye,Re*at,(Oe+Te/X.locationSize*Ie)*at,ee)}else{if(he.isInstancedBufferAttribute){for(let ae=0;ae<X.locationSize;ae++)d(X.location+ae,he.meshPerAttribute);S.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let ae=0;ae<X.locationSize;ae++)f(X.location+ae);i.bindBuffer(i.ARRAY_BUFFER,Qe);for(let ae=0;ae<X.locationSize;ae++)v(X.location+ae,Te/X.locationSize,st,ye,Te*at,Te/X.locationSize*ae*at,ee)}}else if(H!==void 0){let ye=H[Q];if(ye!==void 0)switch(ye.length){case 2:i.vertexAttrib2fv(X.location,ye);break;case 3:i.vertexAttrib3fv(X.location,ye);break;case 4:i.vertexAttrib4fv(X.location,ye);break;default:i.vertexAttrib1fv(X.location,ye)}}}}M()}function T(){N();for(let S in n){let D=n[S];for(let V in D){let $=D[V];for(let Z in $)h($[Z].object),delete $[Z];delete D[V]}delete n[S]}}function A(S){if(n[S.id]===void 0)return;let D=n[S.id];for(let V in D){let $=D[V];for(let Z in $)h($[Z].object),delete $[Z];delete D[V]}delete n[S.id]}function C(S){for(let D in n){let V=n[D];if(V[S.id]===void 0)continue;let $=V[S.id];for(let Z in $)h($[Z].object),delete $[Z];delete V[S.id]}}function N(){b(),o=!0,r!==s&&(r=s,c(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:N,resetDefaultState:b,dispose:T,releaseStatesOfGeometry:A,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:f,disableUnusedAttributes:M}}function Q_(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let m=0;for(let g=0;g<u;g++)m+=h[g];t.update(m,n,1)}function l(c,h,u,p){if(u===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<c.length;g++)o(c[g],h[g],p[g]);else{m.multiDrawArraysInstancedWEBGL(n,c,0,h,0,p,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*p[_];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function ex(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==qn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let N=C===Ir&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==ui&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Ti&&!N)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,p=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),f=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:p,maxTextures:m,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:f,maxAttributes:d,maxVertexUniforms:M,maxVaryings:v,maxFragmentUniforms:x,vertexTextures:T,maxSamples:A}}function tx(i){let e=this,t=null,n=0,s=!1,r=!1,o=new Gn,a=new Je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,p){let m=u.length!==0||p||n!==0||s;return s=p,n=u.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,p){t=h(u,p,0)},this.setState=function(u,p,m){let g=u.clippingPlanes,_=u.clipIntersection,f=u.clipShadows,d=i.get(u);if(!s||g===null||g.length===0||r&&!f)r?h(null):c();else{let M=r?0:n,v=M*4,x=d.clippingState||null;l.value=x,x=h(g,p,v,m);for(let T=0;T!==v;++T)x[T]=t[T];d.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,p,m,g){let _=u!==null?u.length:0,f=null;if(_!==0){if(f=l.value,g!==!0||f===null){let d=m+_*4,M=p.matrixWorldInverse;a.getNormalMatrix(M),(f===null||f.length<d)&&(f=new Float32Array(d));for(let v=0,x=m;v!==_;++v,x+=4)o.copy(u[v]).applyMatrix4(M,a),o.normal.toArray(f,x),f[x+3]=o.constant}l.value=f,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,f}}function nx(i){let e=new WeakMap;function t(o,a){return a===Ll?o.mapping=Ds:a===Nl&&(o.mapping=Ls),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Ll||a===Nl)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new nl(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Ur=4,If=[.125,.215,.35,.446,.526,.582],Bs=20,ru=new ko,Df=new je,ou=null,au=0,lu=0,cu=!1,Os=(1+Math.sqrt(5))/2,Nr=1/Os,Lf=[new L(-Os,Nr,0),new L(Os,Nr,0),new L(-Nr,0,Os),new L(Nr,0,Os),new L(0,Os,-Nr),new L(0,Os,Nr),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],ix=new L,yc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=ix}=r;ou=this._renderer.getRenderTarget(),au=this._renderer.getActiveCubeFace(),lu=this._renderer.getActiveMipmapLevel(),cu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ff(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Uf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ou,au,lu),this._renderer.xr.enabled=cu,e.scissorTest=!1,_c(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ds||e.mapping===Ls?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ou=this._renderer.getRenderTarget(),au=this._renderer.getActiveCubeFace(),lu=this._renderer.getActiveMipmapLevel(),cu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:li,minFilter:li,generateMipmaps:!1,type:Ir,format:qn,colorSpace:ws,depthBuffer:!1},s=Nf(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Nf(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=sx(r)),this._blurMaterial=rx(r,e,t)}return s}_compileMaterial(e){let t=new _t(this._lodPlanes[0],e);this._renderer.compile(t,ru)}_sceneToCubeUV(e,t,n,s,r){let l=new Kt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,p=u.autoClear,m=u.toneMapping;u.getClearColor(Df),u.toneMapping=zi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let _=new hn({name:"PMREM.Background",side:gn,depthWrite:!1,depthTest:!1}),f=new _t(new kt,_),d=!1,M=e.background;M?M.isColor&&(_.color.copy(M),e.background=null,d=!0):(_.color.copy(Df),d=!0);for(let v=0;v<6;v++){let x=v%3;x===0?(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[v],r.y,r.z)):x===1?(l.up.set(0,0,c[v]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[v],r.z)):(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[v]));let T=this._cubeSize;_c(s,x*T,v>2?T:0,T,T),u.setRenderTarget(s),d&&u.render(f,l),u.render(e,l)}f.geometry.dispose(),f.material.dispose(),u.toneMapping=m,u.autoClear=p,e.background=M}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Ds||e.mapping===Ls;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ff()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Uf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new _t(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;_c(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,ru)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Lf[(s-r-1)%Lf.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new _t(this._lodPlanes[s],c),p=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Bs-1),_=r/g,f=isFinite(r)?1+Math.floor(h*_):Bs;f>Bs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${Bs}`);let d=[],M=0;for(let C=0;C<Bs;++C){let N=C/_,b=Math.exp(-N*N/2);d.push(b),C===0?M+=b:C<f&&(M+=2*b)}for(let C=0;C<d.length;C++)d[C]=d[C]/M;p.envMap.value=e.texture,p.samples.value=f,p.weights.value=d,p.latitudinal.value=o==="latitudinal",a&&(p.poleAxis.value=a);let{_lodMax:v}=this;p.dTheta.value=g,p.mipInt.value=v-n;let x=this._sizeLods[s],T=3*x*(s>v-Ur?s-v+Ur:0),A=4*(this._cubeSize-x);_c(t,T,A,3*x,2*x),l.setRenderTarget(t),l.render(u,ru)}};function sx(i){let e=[],t=[],n=[],s=i,r=i-Ur+1+If.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-Ur?l=If[o-i+Ur-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,p=[h,h,u,h,u,u,h,h,u,u,h,u],m=6,g=6,_=3,f=2,d=1,M=new Float32Array(_*g*m),v=new Float32Array(f*g*m),x=new Float32Array(d*g*m);for(let A=0;A<m;A++){let C=A%3*2/3-1,N=A>2?0:-1,b=[C,N,0,C+2/3,N,0,C+2/3,N+1,0,C,N,0,C+2/3,N+1,0,C,N+1,0];M.set(b,_*g*A),v.set(p,f*g*A);let S=[A,A,A,A,A,A];x.set(S,d*g*A)}let T=new Et;T.setAttribute("position",new Mn(M,_)),T.setAttribute("uv",new Mn(v,f)),T.setAttribute("faceIndex",new Mn(x,d)),e.push(T),s>Ur&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Nf(i,e,t){let n=new bi(i,e,t);return n.texture.mapping=$o,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function _c(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function rx(i,e,t){let n=new Float32Array(Bs),s=new L(0,1,0);return new hi({name:"SphericalGaussianBlur",defines:{n:Bs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:yu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ki,depthTest:!1,depthWrite:!1})}function Uf(){return new hi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:yu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ki,depthTest:!1,depthWrite:!1})}function Ff(){return new hi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:yu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ki,depthTest:!1,depthWrite:!1})}function yu(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function ox(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Ll||l===Nl,h=l===Ds||l===Ls;if(c||h){let u=e.get(a),p=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==p)return t===null&&(t=new yc(i)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let m=a.image;return c&&m&&m.height>0||h&&m&&s(m)?(t===null&&(t=new yc(i)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function ax(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&xr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function lx(i,e,t,n){let s={},r=new WeakMap;function o(u){let p=u.target;p.index!==null&&e.remove(p.index);for(let g in p.attributes)e.remove(p.attributes[g]);p.removeEventListener("dispose",o),delete s[p.id];let m=r.get(p);m&&(e.remove(m),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function a(u,p){return s[p.id]===!0||(p.addEventListener("dispose",o),s[p.id]=!0,t.memory.geometries++),p}function l(u){let p=u.attributes;for(let m in p)e.update(p[m],i.ARRAY_BUFFER)}function c(u){let p=[],m=u.index,g=u.attributes.position,_=0;if(m!==null){let M=m.array;_=m.version;for(let v=0,x=M.length;v<x;v+=3){let T=M[v+0],A=M[v+1],C=M[v+2];p.push(T,A,A,C,C,T)}}else if(g!==void 0){let M=g.array;_=g.version;for(let v=0,x=M.length/3-1;v<x;v+=3){let T=v+0,A=v+1,C=v+2;p.push(T,A,A,C,C,T)}}else return;let f=new(Qh(p)?xo:_o)(p,1);f.version=_;let d=r.get(u);d&&e.remove(d),r.set(u,f)}function h(u){let p=r.get(u);if(p){let m=u.index;m!==null&&p.version<m.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function cx(i,e,t){let n;function s(p){n=p}let r,o;function a(p){r=p.type,o=p.bytesPerElement}function l(p,m){i.drawElements(n,m,r,p*o),t.update(m,n,1)}function c(p,m,g){g!==0&&(i.drawElementsInstanced(n,m,r,p*o,g),t.update(m,n,g))}function h(p,m,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,p,0,g);let f=0;for(let d=0;d<g;d++)f+=m[d];t.update(f,n,1)}function u(p,m,g,_){if(g===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let d=0;d<p.length;d++)c(p[d]/o,m[d],_[d]);else{f.multiDrawElementsInstancedWEBGL(n,m,0,r,p,0,_,0,g);let d=0;for(let M=0;M<g;M++)d+=m[M]*_[M];t.update(d,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function hx(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function ux(i,e,t){let n=new WeakMap,s=new Nt;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,p=n.get(a);if(p===void 0||p.count!==u){let b=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",b)};p!==void 0&&p.texture.dispose();let m=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,f=a.morphAttributes.position||[],d=a.morphAttributes.normal||[],M=a.morphAttributes.color||[],v=0;m===!0&&(v=1),g===!0&&(v=2),_===!0&&(v=3);let x=a.attributes.position.count*v,T=1;x>e.maxTextureSize&&(T=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let A=new Float32Array(x*T*4*u),C=new go(A,x,T,u);C.type=Ti,C.needsUpdate=!0;let N=v*4;for(let S=0;S<u;S++){let D=f[S],V=d[S],$=M[S],Z=x*T*4*S;for(let k=0;k<D.count;k++){let H=k*N;m===!0&&(s.fromBufferAttribute(D,k),A[Z+H+0]=s.x,A[Z+H+1]=s.y,A[Z+H+2]=s.z,A[Z+H+3]=0),g===!0&&(s.fromBufferAttribute(V,k),A[Z+H+4]=s.x,A[Z+H+5]=s.y,A[Z+H+6]=s.z,A[Z+H+7]=0),_===!0&&(s.fromBufferAttribute($,k),A[Z+H+8]=s.x,A[Z+H+9]=s.y,A[Z+H+10]=s.z,A[Z+H+11]=$.itemSize===4?s.w:1)}}p={count:u,texture:C,size:new le(x,T)},n.set(a,p),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let m=0;for(let _=0;_<c.length;_++)m+=c[_];let g=a.morphTargetsRelative?1:1-m;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",p.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:r}}function dx(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let p=l.skeleton;s.get(p)!==c&&(p.update(),s.set(p,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var tp=new Sn,Of=new Eo(1,1),np=new go,ip=new el,sp=new vo,Bf=[],kf=[],zf=new Float32Array(16),Hf=new Float32Array(9),Vf=new Float32Array(4);function Br(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Bf[s];if(r===void 0&&(r=new Float32Array(s),Bf[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Xt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function qt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function vc(i,e){let t=kf[e];t===void 0&&(t=new Int32Array(e),kf[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function fx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function px(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;i.uniform2fv(this.addr,e),qt(t,e)}}function mx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Xt(t,e))return;i.uniform3fv(this.addr,e),qt(t,e)}}function gx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;i.uniform4fv(this.addr,e),qt(t,e)}}function _x(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;Vf.set(n),i.uniformMatrix2fv(this.addr,!1,Vf),qt(t,n)}}function xx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;Hf.set(n),i.uniformMatrix3fv(this.addr,!1,Hf),qt(t,n)}}function yx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;zf.set(n),i.uniformMatrix4fv(this.addr,!1,zf),qt(t,n)}}function vx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function bx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;i.uniform2iv(this.addr,e),qt(t,e)}}function Mx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Xt(t,e))return;i.uniform3iv(this.addr,e),qt(t,e)}}function Sx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;i.uniform4iv(this.addr,e),qt(t,e)}}function Ex(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function wx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;i.uniform2uiv(this.addr,e),qt(t,e)}}function Tx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Xt(t,e))return;i.uniform3uiv(this.addr,e),qt(t,e)}}function Ax(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;i.uniform4uiv(this.addr,e),qt(t,e)}}function Rx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Of.compareFunction=Zh,r=Of):r=tp,t.setTexture2D(e||r,s)}function Cx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||ip,s)}function Px(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||sp,s)}function Ix(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||np,s)}function Dx(i){switch(i){case 5126:return fx;case 35664:return px;case 35665:return mx;case 35666:return gx;case 35674:return _x;case 35675:return xx;case 35676:return yx;case 5124:case 35670:return vx;case 35667:case 35671:return bx;case 35668:case 35672:return Mx;case 35669:case 35673:return Sx;case 5125:return Ex;case 36294:return wx;case 36295:return Tx;case 36296:return Ax;case 35678:case 36198:case 36298:case 36306:case 35682:return Rx;case 35679:case 36299:case 36307:return Cx;case 35680:case 36300:case 36308:case 36293:return Px;case 36289:case 36303:case 36311:case 36292:return Ix}}function Lx(i,e){i.uniform1fv(this.addr,e)}function Nx(i,e){let t=Br(e,this.size,2);i.uniform2fv(this.addr,t)}function Ux(i,e){let t=Br(e,this.size,3);i.uniform3fv(this.addr,t)}function Fx(i,e){let t=Br(e,this.size,4);i.uniform4fv(this.addr,t)}function Ox(i,e){let t=Br(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Bx(i,e){let t=Br(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function kx(i,e){let t=Br(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function zx(i,e){i.uniform1iv(this.addr,e)}function Hx(i,e){i.uniform2iv(this.addr,e)}function Vx(i,e){i.uniform3iv(this.addr,e)}function Gx(i,e){i.uniform4iv(this.addr,e)}function Wx(i,e){i.uniform1uiv(this.addr,e)}function $x(i,e){i.uniform2uiv(this.addr,e)}function Xx(i,e){i.uniform3uiv(this.addr,e)}function qx(i,e){i.uniform4uiv(this.addr,e)}function Yx(i,e,t){let n=this.cache,s=e.length,r=vc(t,s);Xt(n,r)||(i.uniform1iv(this.addr,r),qt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||tp,r[o])}function Zx(i,e,t){let n=this.cache,s=e.length,r=vc(t,s);Xt(n,r)||(i.uniform1iv(this.addr,r),qt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||ip,r[o])}function jx(i,e,t){let n=this.cache,s=e.length,r=vc(t,s);Xt(n,r)||(i.uniform1iv(this.addr,r),qt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||sp,r[o])}function Jx(i,e,t){let n=this.cache,s=e.length,r=vc(t,s);Xt(n,r)||(i.uniform1iv(this.addr,r),qt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||np,r[o])}function Kx(i){switch(i){case 5126:return Lx;case 35664:return Nx;case 35665:return Ux;case 35666:return Fx;case 35674:return Ox;case 35675:return Bx;case 35676:return kx;case 5124:case 35670:return zx;case 35667:case 35671:return Hx;case 35668:case 35672:return Vx;case 35669:case 35673:return Gx;case 5125:return Wx;case 36294:return $x;case 36295:return Xx;case 36296:return qx;case 35678:case 36198:case 36298:case 36306:case 35682:return Yx;case 35679:case 36299:case 36307:return Zx;case 35680:case 36300:case 36308:case 36293:return jx;case 36289:case 36303:case 36311:case 36292:return Jx}}var uu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Dx(t.type)}},du=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Kx(t.type)}},fu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},hu=/(\w+)(\])?(\[|\.)?/g;function Gf(i,e){i.seq.push(e),i.map[e.id]=e}function Qx(i,e,t){let n=i.name,s=n.length;for(hu.lastIndex=0;;){let r=hu.exec(n),o=hu.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Gf(t,c===void 0?new uu(a,i,e):new du(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new fu(a),Gf(t,u)),t=u}}}var Fr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Qx(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function Wf(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var ey=37297,ty=0;function ny(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var $f=new Je;function iy(i){lt._getMatrix($f,lt.workingColorSpace,i);let e=`mat3( ${$f.elements.map(t=>t.toFixed(4))} )`;switch(lt.getTransfer(i)){case fo:return[e,"LinearTransferOETF"];case gt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Xf(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+ny(i.getShaderSource(e),a)}else return r}function sy(i,e){let t=iy(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function ry(i,e){let t;switch(e){case nf:t="Linear";break;case sf:t="Reinhard";break;case rf:t="Cineon";break;case of:t="ACESFilmic";break;case lf:t="AgX";break;case cf:t="Neutral";break;case af:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var xc=new L;function oy(){lt.getLuminanceCoefficients(xc);let i=xc.x.toFixed(4),e=xc.y.toFixed(4),t=xc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ay(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Jo).join(`
`)}function ly(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function cy(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Jo(i){return i!==""}function qf(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Yf(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var hy=/^[ \t]*#include +<([\w\d./]+)>/gm;function pu(i){return i.replace(hy,dy)}var uy=new Map;function dy(i,e){let t=it[e];if(t===void 0){let n=uy.get(e);if(n!==void 0)t=it[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return pu(t)}var fy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Zf(i){return i.replace(fy,py)}function py(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function jf(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function my(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Nh?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===wl?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ei&&(e="SHADOWMAP_TYPE_VSM"),e}function gy(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ds:case Ls:e="ENVMAP_TYPE_CUBE";break;case $o:e="ENVMAP_TYPE_CUBE_UV";break}return e}function _y(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Ls&&(e="ENVMAP_MODE_REFRACTION"),e}function xy(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Bh:e="ENVMAP_BLENDING_MULTIPLY";break;case ef:e="ENVMAP_BLENDING_MIX";break;case tf:e="ENVMAP_BLENDING_ADD";break}return e}function yy(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function vy(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=my(t),c=gy(t),h=_y(t),u=xy(t),p=yy(t),m=ay(t),g=ly(r),_=s.createProgram(),f,d,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Jo).join(`
`),f.length>0&&(f+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Jo).join(`
`),d.length>0&&(d+=`
`)):(f=[jf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Jo).join(`
`),d=[jf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==zi?"#define TONE_MAPPING":"",t.toneMapping!==zi?it.tonemapping_pars_fragment:"",t.toneMapping!==zi?ry("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",it.colorspace_pars_fragment,sy("linearToOutputTexel",t.outputColorSpace),oy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Jo).join(`
`)),o=pu(o),o=qf(o,t),o=Yf(o,t),a=pu(a),a=qf(a,t),a=Yf(a,t),o=Zf(o),a=Zf(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,f=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,d=["#define varying in",t.glslVersion===jh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===jh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let v=M+f+o,x=M+d+a,T=Wf(s,s.VERTEX_SHADER,v),A=Wf(s,s.FRAGMENT_SHADER,x);s.attachShader(_,T),s.attachShader(_,A),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(D){if(i.debug.checkShaderErrors){let V=s.getProgramInfoLog(_)||"",$=s.getShaderInfoLog(T)||"",Z=s.getShaderInfoLog(A)||"",k=V.trim(),H=$.trim(),Q=Z.trim(),X=!0,he=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(X=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,T,A);else{let ye=Xf(s,T,"vertex"),Te=Xf(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+k+`
`+ye+`
`+Te)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(H===""||Q==="")&&(he=!1);he&&(D.diagnostics={runnable:X,programLog:k,vertexShader:{log:H,prefix:f},fragmentShader:{log:Q,prefix:d}})}s.deleteShader(T),s.deleteShader(A),N=new Fr(s,_),b=cy(s,_)}let N;this.getUniforms=function(){return N===void 0&&C(this),N};let b;this.getAttributes=function(){return b===void 0&&C(this),b};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(_,ey)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=ty++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=A,this}var by=0,mu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new gu(e),t.set(e,n)),n}},gu=class{constructor(e){this.id=by++,this.code=e,this.usedTimes=0}};function My(i,e,t,n,s,r,o){let a=new vr,l=new mu,c=new Set,h=[],u=s.logarithmicDepthBuffer,p=s.vertexTextures,m=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function f(b,S,D,V,$){let Z=V.fog,k=$.geometry,H=b.isMeshStandardMaterial?V.environment:null,Q=(b.isMeshStandardMaterial?t:e).get(b.envMap||H),X=Q&&Q.mapping===$o?Q.image.height:null,he=g[b.type];b.precision!==null&&(m=s.getMaxPrecision(b.precision),m!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",m,"instead."));let ye=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,Te=ye!==void 0?ye.length:0,$e=0;k.morphAttributes.position!==void 0&&($e=1),k.morphAttributes.normal!==void 0&&($e=2),k.morphAttributes.color!==void 0&&($e=3);let Qe,st,at,ee;if(he){let ve=Ai[he];Qe=ve.vertexShader,st=ve.fragmentShader}else Qe=b.vertexShader,st=b.fragmentShader,l.update(b),at=l.getVertexShaderID(b),ee=l.getFragmentShaderID(b);let ae=i.getRenderTarget(),Re=i.state.buffers.depth.getReversed(),Oe=$.isInstancedMesh===!0,Ie=$.isBatchedMesh===!0,et=!!b.map,ft=!!b.matcap,I=!!Q,oe=!!b.aoMap,se=!!b.lightMap,ne=!!b.bumpMap,te=!!b.normalMap,xe=!!b.displacementMap,ce=!!b.emissiveMap,me=!!b.metalnessMap,Ye=!!b.roughnessMap,Ve=b.anisotropy>0,R=b.clearcoat>0,y=b.dispersion>0,B=b.iridescence>0,q=b.sheen>0,re=b.transmission>0,J=Ve&&!!b.anisotropyMap,Le=R&&!!b.clearcoatMap,fe=R&&!!b.clearcoatNormalMap,De=R&&!!b.clearcoatRoughnessMap,Ce=B&&!!b.iridescenceMap,ue=B&&!!b.iridescenceThicknessMap,Me=q&&!!b.sheenColorMap,ze=q&&!!b.sheenRoughnessMap,Fe=!!b.specularMap,Se=!!b.specularColorMap,Ze=!!b.specularIntensityMap,w=re&&!!b.transmissionMap,F=re&&!!b.thicknessMap,W=!!b.gradientMap,ie=!!b.alphaMap,K=b.alphaTest>0,G=!!b.alphaHash,ge=!!b.extensions,_e=zi;b.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(_e=i.toneMapping);let Ee={shaderID:he,shaderType:b.type,shaderName:b.name,vertexShader:Qe,fragmentShader:st,defines:b.defines,customVertexShaderID:at,customFragmentShaderID:ee,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:m,batching:Ie,batchingColor:Ie&&$._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&$.instanceColor!==null,instancingMorph:Oe&&$.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:ae===null?i.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:ws,alphaToCoverage:!!b.alphaToCoverage,map:et,matcap:ft,envMap:I,envMapMode:I&&Q.mapping,envMapCubeUVHeight:X,aoMap:oe,lightMap:se,bumpMap:ne,normalMap:te,displacementMap:p&&xe,emissiveMap:ce,normalMapObjectSpace:te&&b.normalMapType===ff,normalMapTangentSpace:te&&b.normalMapType===Yh,metalnessMap:me,roughnessMap:Ye,anisotropy:Ve,anisotropyMap:J,clearcoat:R,clearcoatMap:Le,clearcoatNormalMap:fe,clearcoatRoughnessMap:De,dispersion:y,iridescence:B,iridescenceMap:Ce,iridescenceThicknessMap:ue,sheen:q,sheenColorMap:Me,sheenRoughnessMap:ze,specularMap:Fe,specularColorMap:Se,specularIntensityMap:Ze,transmission:re,transmissionMap:w,thicknessMap:F,gradientMap:W,opaque:b.transparent===!1&&b.blending===Ss&&b.alphaToCoverage===!1,alphaMap:ie,alphaTest:K,alphaHash:G,combine:b.combine,mapUv:et&&_(b.map.channel),aoMapUv:oe&&_(b.aoMap.channel),lightMapUv:se&&_(b.lightMap.channel),bumpMapUv:ne&&_(b.bumpMap.channel),normalMapUv:te&&_(b.normalMap.channel),displacementMapUv:xe&&_(b.displacementMap.channel),emissiveMapUv:ce&&_(b.emissiveMap.channel),metalnessMapUv:me&&_(b.metalnessMap.channel),roughnessMapUv:Ye&&_(b.roughnessMap.channel),anisotropyMapUv:J&&_(b.anisotropyMap.channel),clearcoatMapUv:Le&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:fe&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:De&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:ue&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:Me&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:ze&&_(b.sheenRoughnessMap.channel),specularMapUv:Fe&&_(b.specularMap.channel),specularColorMapUv:Se&&_(b.specularColorMap.channel),specularIntensityMapUv:Ze&&_(b.specularIntensityMap.channel),transmissionMapUv:w&&_(b.transmissionMap.channel),thicknessMapUv:F&&_(b.thicknessMap.channel),alphaMapUv:ie&&_(b.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(te||Ve),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:$.isPoints===!0&&!!k.attributes.uv&&(et||ie),fog:!!Z,useFog:b.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Re,skinning:$.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:Te,morphTextureStride:$e,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:_e,decodeVideoTexture:et&&b.map.isVideoTexture===!0&&lt.getTransfer(b.map.colorSpace)===gt,decodeVideoTextureEmissive:ce&&b.emissiveMap.isVideoTexture===!0&&lt.getTransfer(b.emissiveMap.colorSpace)===gt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===wi,flipSided:b.side===gn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:ge&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ge&&b.extensions.multiDraw===!0||Ie)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Ee.vertexUv1s=c.has(1),Ee.vertexUv2s=c.has(2),Ee.vertexUv3s=c.has(3),c.clear(),Ee}function d(b){let S=[];if(b.shaderID?S.push(b.shaderID):(S.push(b.customVertexShaderID),S.push(b.customFragmentShaderID)),b.defines!==void 0)for(let D in b.defines)S.push(D),S.push(b.defines[D]);return b.isRawShaderMaterial===!1&&(M(S,b),v(S,b),S.push(i.outputColorSpace)),S.push(b.customProgramCacheKey),S.join()}function M(b,S){b.push(S.precision),b.push(S.outputColorSpace),b.push(S.envMapMode),b.push(S.envMapCubeUVHeight),b.push(S.mapUv),b.push(S.alphaMapUv),b.push(S.lightMapUv),b.push(S.aoMapUv),b.push(S.bumpMapUv),b.push(S.normalMapUv),b.push(S.displacementMapUv),b.push(S.emissiveMapUv),b.push(S.metalnessMapUv),b.push(S.roughnessMapUv),b.push(S.anisotropyMapUv),b.push(S.clearcoatMapUv),b.push(S.clearcoatNormalMapUv),b.push(S.clearcoatRoughnessMapUv),b.push(S.iridescenceMapUv),b.push(S.iridescenceThicknessMapUv),b.push(S.sheenColorMapUv),b.push(S.sheenRoughnessMapUv),b.push(S.specularMapUv),b.push(S.specularColorMapUv),b.push(S.specularIntensityMapUv),b.push(S.transmissionMapUv),b.push(S.thicknessMapUv),b.push(S.combine),b.push(S.fogExp2),b.push(S.sizeAttenuation),b.push(S.morphTargetsCount),b.push(S.morphAttributeCount),b.push(S.numDirLights),b.push(S.numPointLights),b.push(S.numSpotLights),b.push(S.numSpotLightMaps),b.push(S.numHemiLights),b.push(S.numRectAreaLights),b.push(S.numDirLightShadows),b.push(S.numPointLightShadows),b.push(S.numSpotLightShadows),b.push(S.numSpotLightShadowsWithMaps),b.push(S.numLightProbes),b.push(S.shadowMapType),b.push(S.toneMapping),b.push(S.numClippingPlanes),b.push(S.numClipIntersection),b.push(S.depthPacking)}function v(b,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),S.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),b.push(a.mask)}function x(b){let S=g[b.type],D;if(S){let V=Ai[S];D=Ef.clone(V.uniforms)}else D=b.uniforms;return D}function T(b,S){let D;for(let V=0,$=h.length;V<$;V++){let Z=h[V];if(Z.cacheKey===S){D=Z,++D.usedTimes;break}}return D===void 0&&(D=new vy(i,S,b,r),h.push(D)),D}function A(b){if(--b.usedTimes===0){let S=h.indexOf(b);h[S]=h[h.length-1],h.pop(),b.destroy()}}function C(b){l.remove(b)}function N(){l.dispose()}return{getParameters:f,getProgramCacheKey:d,getUniforms:x,acquireProgram:T,releaseProgram:A,releaseShaderCache:C,programs:h,dispose:N}}function Sy(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Ey(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Jf(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Kf(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u,p,m,g,_,f){let d=i[e];return d===void 0?(d={id:u.id,object:u,geometry:p,material:m,groupOrder:g,renderOrder:u.renderOrder,z:_,group:f},i[e]=d):(d.id=u.id,d.object=u,d.geometry=p,d.material=m,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=_,d.group=f),e++,d}function a(u,p,m,g,_,f){let d=o(u,p,m,g,_,f);m.transmission>0?n.push(d):m.transparent===!0?s.push(d):t.push(d)}function l(u,p,m,g,_,f){let d=o(u,p,m,g,_,f);m.transmission>0?n.unshift(d):m.transparent===!0?s.unshift(d):t.unshift(d)}function c(u,p){t.length>1&&t.sort(u||Ey),n.length>1&&n.sort(p||Jf),s.length>1&&s.sort(p||Jf)}function h(){for(let u=e,p=i.length;u<p;u++){let m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function wy(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Kf,i.set(n,[o])):s>=r.length?(o=new Kf,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function Ty(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new je};break;case"SpotLight":t={position:new L,direction:new L,color:new je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new je,groundColor:new je};break;case"RectAreaLight":t={color:new je,position:new L,halfWidth:new L,halfHeight:new L};break}return i[e.id]=t,t}}}function Ay(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Ry=0;function Cy(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Py(i){let e=new Ty,t=Ay(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);let s=new L,r=new dt,o=new dt;function a(c){let h=0,u=0,p=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let m=0,g=0,_=0,f=0,d=0,M=0,v=0,x=0,T=0,A=0,C=0;c.sort(Cy);for(let b=0,S=c.length;b<S;b++){let D=c[b],V=D.color,$=D.intensity,Z=D.distance,k=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=V.r*$,u+=V.g*$,p+=V.b*$;else if(D.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(D.sh.coefficients[H],$);C++}else if(D.isDirectionalLight){let H=e.get(D);if(H.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let Q=D.shadow,X=t.get(D);X.shadowIntensity=Q.intensity,X.shadowBias=Q.bias,X.shadowNormalBias=Q.normalBias,X.shadowRadius=Q.radius,X.shadowMapSize=Q.mapSize,n.directionalShadow[m]=X,n.directionalShadowMap[m]=k,n.directionalShadowMatrix[m]=D.shadow.matrix,M++}n.directional[m]=H,m++}else if(D.isSpotLight){let H=e.get(D);H.position.setFromMatrixPosition(D.matrixWorld),H.color.copy(V).multiplyScalar($),H.distance=Z,H.coneCos=Math.cos(D.angle),H.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),H.decay=D.decay,n.spot[_]=H;let Q=D.shadow;if(D.map&&(n.spotLightMap[T]=D.map,T++,Q.updateMatrices(D),D.castShadow&&A++),n.spotLightMatrix[_]=Q.matrix,D.castShadow){let X=t.get(D);X.shadowIntensity=Q.intensity,X.shadowBias=Q.bias,X.shadowNormalBias=Q.normalBias,X.shadowRadius=Q.radius,X.shadowMapSize=Q.mapSize,n.spotShadow[_]=X,n.spotShadowMap[_]=k,x++}_++}else if(D.isRectAreaLight){let H=e.get(D);H.color.copy(V).multiplyScalar($),H.halfWidth.set(D.width*.5,0,0),H.halfHeight.set(0,D.height*.5,0),n.rectArea[f]=H,f++}else if(D.isPointLight){let H=e.get(D);if(H.color.copy(D.color).multiplyScalar(D.intensity),H.distance=D.distance,H.decay=D.decay,D.castShadow){let Q=D.shadow,X=t.get(D);X.shadowIntensity=Q.intensity,X.shadowBias=Q.bias,X.shadowNormalBias=Q.normalBias,X.shadowRadius=Q.radius,X.shadowMapSize=Q.mapSize,X.shadowCameraNear=Q.camera.near,X.shadowCameraFar=Q.camera.far,n.pointShadow[g]=X,n.pointShadowMap[g]=k,n.pointShadowMatrix[g]=D.shadow.matrix,v++}n.point[g]=H,g++}else if(D.isHemisphereLight){let H=e.get(D);H.skyColor.copy(D.color).multiplyScalar($),H.groundColor.copy(D.groundColor).multiplyScalar($),n.hemi[d]=H,d++}}f>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=be.LTC_FLOAT_1,n.rectAreaLTC2=be.LTC_FLOAT_2):(n.rectAreaLTC1=be.LTC_HALF_1,n.rectAreaLTC2=be.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=p;let N=n.hash;(N.directionalLength!==m||N.pointLength!==g||N.spotLength!==_||N.rectAreaLength!==f||N.hemiLength!==d||N.numDirectionalShadows!==M||N.numPointShadows!==v||N.numSpotShadows!==x||N.numSpotMaps!==T||N.numLightProbes!==C)&&(n.directional.length=m,n.spot.length=_,n.rectArea.length=f,n.point.length=g,n.hemi.length=d,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=x+T-A,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=C,N.directionalLength=m,N.pointLength=g,N.spotLength=_,N.rectAreaLength=f,N.hemiLength=d,N.numDirectionalShadows=M,N.numPointShadows=v,N.numSpotShadows=x,N.numSpotMaps=T,N.numLightProbes=C,n.version=Ry++)}function l(c,h){let u=0,p=0,m=0,g=0,_=0,f=h.matrixWorldInverse;for(let d=0,M=c.length;d<M;d++){let v=c[d];if(v.isDirectionalLight){let x=n.directional[u];x.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(f),u++}else if(v.isSpotLight){let x=n.spot[m];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(f),x.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(f),m++}else if(v.isRectAreaLight){let x=n.rectArea[g];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(f),o.identity(),r.copy(v.matrixWorld),r.premultiply(f),o.extractRotation(r),x.halfWidth.set(v.width*.5,0,0),x.halfHeight.set(0,v.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){let x=n.point[p];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(f),p++}else if(v.isHemisphereLight){let x=n.hemi[_];x.direction.setFromMatrixPosition(v.matrixWorld),x.direction.transformDirection(f),_++}}}return{setup:a,setupView:l,state:n}}function Qf(i){let e=new Py(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function Iy(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Qf(i),e.set(s,[a])):r>=o.length?(a=new Qf(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var Dy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ly=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Ny(i,e,t){let n=new Sr,s=new le,r=new le,o=new Nt,a=new fl({depthPacking:df}),l=new pl,c={},h=t.maxTextureSize,u={[Oi]:gn,[gn]:Oi,[wi]:wi},p=new hi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new le},radius:{value:4}},vertexShader:Dy,fragmentShader:Ly}),m=p.clone();m.defines.HORIZONTAL_PASS=1;let g=new Et;g.setAttribute("position",new Mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new _t(g,p),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Nh;let d=this.type;this.render=function(A,C,N){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||A.length===0)return;let b=i.getRenderTarget(),S=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),V=i.state;V.setBlending(ki),V.buffers.depth.getReversed()===!0?V.buffers.color.setClear(0,0,0,0):V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);let $=d!==Ei&&this.type===Ei,Z=d===Ei&&this.type!==Ei;for(let k=0,H=A.length;k<H;k++){let Q=A[k],X=Q.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);let he=X.getFrameExtents();if(s.multiply(he),r.copy(X.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/he.x),s.x=r.x*he.x,X.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/he.y),s.y=r.y*he.y,X.mapSize.y=r.y)),X.map===null||$===!0||Z===!0){let Te=this.type!==Ei?{minFilter:Wn,magFilter:Wn}:{};X.map!==null&&X.map.dispose(),X.map=new bi(s.x,s.y,Te),X.map.texture.name=Q.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();let ye=X.getViewportCount();for(let Te=0;Te<ye;Te++){let $e=X.getViewport(Te);o.set(r.x*$e.x,r.y*$e.y,r.x*$e.z,r.y*$e.w),V.viewport(o),X.updateMatrices(Q,Te),n=X.getFrustum(),x(C,N,X.camera,Q,this.type)}X.isPointLightShadow!==!0&&this.type===Ei&&M(X,N),X.needsUpdate=!1}d=this.type,f.needsUpdate=!1,i.setRenderTarget(b,S,D)};function M(A,C){let N=e.update(_);p.defines.VSM_SAMPLES!==A.blurSamples&&(p.defines.VSM_SAMPLES=A.blurSamples,m.defines.VSM_SAMPLES=A.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new bi(s.x,s.y)),p.uniforms.shadow_pass.value=A.map.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(C,null,N,p,_,null),m.uniforms.shadow_pass.value=A.mapPass.texture,m.uniforms.resolution.value=A.mapSize,m.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(C,null,N,m,_,null)}function v(A,C,N,b){let S=null,D=N.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(D!==void 0)S=D;else if(S=N.isPointLight===!0?l:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let V=S.uuid,$=C.uuid,Z=c[V];Z===void 0&&(Z={},c[V]=Z);let k=Z[$];k===void 0&&(k=S.clone(),Z[$]=k,C.addEventListener("dispose",T)),S=k}if(S.visible=C.visible,S.wireframe=C.wireframe,b===Ei?S.side=C.shadowSide!==null?C.shadowSide:C.side:S.side=C.shadowSide!==null?C.shadowSide:u[C.side],S.alphaMap=C.alphaMap,S.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,S.map=C.map,S.clipShadows=C.clipShadows,S.clippingPlanes=C.clippingPlanes,S.clipIntersection=C.clipIntersection,S.displacementMap=C.displacementMap,S.displacementScale=C.displacementScale,S.displacementBias=C.displacementBias,S.wireframeLinewidth=C.wireframeLinewidth,S.linewidth=C.linewidth,N.isPointLight===!0&&S.isMeshDistanceMaterial===!0){let V=i.properties.get(S);V.light=N}return S}function x(A,C,N,b,S){if(A.visible===!1)return;if(A.layers.test(C.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&S===Ei)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,A.matrixWorld);let $=e.update(A),Z=A.material;if(Array.isArray(Z)){let k=$.groups;for(let H=0,Q=k.length;H<Q;H++){let X=k[H],he=Z[X.materialIndex];if(he&&he.visible){let ye=v(A,he,b,S);A.onBeforeShadow(i,A,C,N,$,ye,X),i.renderBufferDirect(N,null,$,ye,A,X),A.onAfterShadow(i,A,C,N,$,ye,X)}}}else if(Z.visible){let k=v(A,Z,b,S);A.onBeforeShadow(i,A,C,N,$,k,null),i.renderBufferDirect(N,null,$,k,A,null),A.onAfterShadow(i,A,C,N,$,k,null)}}let V=A.children;for(let $=0,Z=V.length;$<Z;$++)x(V[$],C,N,b,S)}function T(A){A.target.removeEventListener("dispose",T);for(let N in c){let b=c[N],S=A.target.uuid;S in b&&(b[S].dispose(),delete b[S])}}}var Uy={[Tl]:Al,[Rl]:Il,[Cl]:Dl,[Es]:Pl,[Al]:Tl,[Il]:Rl,[Dl]:Cl,[Pl]:Es};function Fy(i,e){function t(){let w=!1,F=new Nt,W=null,ie=new Nt(0,0,0,0);return{setMask:function(K){W!==K&&!w&&(i.colorMask(K,K,K,K),W=K)},setLocked:function(K){w=K},setClear:function(K,G,ge,_e,Ee){Ee===!0&&(K*=_e,G*=_e,ge*=_e),F.set(K,G,ge,_e),ie.equals(F)===!1&&(i.clearColor(K,G,ge,_e),ie.copy(F))},reset:function(){w=!1,W=null,ie.set(-1,0,0,0)}}}function n(){let w=!1,F=!1,W=null,ie=null,K=null;return{setReversed:function(G){if(F!==G){let ge=e.get("EXT_clip_control");G?ge.clipControlEXT(ge.LOWER_LEFT_EXT,ge.ZERO_TO_ONE_EXT):ge.clipControlEXT(ge.LOWER_LEFT_EXT,ge.NEGATIVE_ONE_TO_ONE_EXT),F=G;let _e=K;K=null,this.setClear(_e)}},getReversed:function(){return F},setTest:function(G){G?ae(i.DEPTH_TEST):Re(i.DEPTH_TEST)},setMask:function(G){W!==G&&!w&&(i.depthMask(G),W=G)},setFunc:function(G){if(F&&(G=Uy[G]),ie!==G){switch(G){case Tl:i.depthFunc(i.NEVER);break;case Al:i.depthFunc(i.ALWAYS);break;case Rl:i.depthFunc(i.LESS);break;case Es:i.depthFunc(i.LEQUAL);break;case Cl:i.depthFunc(i.EQUAL);break;case Pl:i.depthFunc(i.GEQUAL);break;case Il:i.depthFunc(i.GREATER);break;case Dl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ie=G}},setLocked:function(G){w=G},setClear:function(G){K!==G&&(F&&(G=1-G),i.clearDepth(G),K=G)},reset:function(){w=!1,W=null,ie=null,K=null,F=!1}}}function s(){let w=!1,F=null,W=null,ie=null,K=null,G=null,ge=null,_e=null,Ee=null;return{setTest:function(ve){w||(ve?ae(i.STENCIL_TEST):Re(i.STENCIL_TEST))},setMask:function(ve){F!==ve&&!w&&(i.stencilMask(ve),F=ve)},setFunc:function(ve,Xe,yt){(W!==ve||ie!==Xe||K!==yt)&&(i.stencilFunc(ve,Xe,yt),W=ve,ie=Xe,K=yt)},setOp:function(ve,Xe,yt){(G!==ve||ge!==Xe||_e!==yt)&&(i.stencilOp(ve,Xe,yt),G=ve,ge=Xe,_e=yt)},setLocked:function(ve){w=ve},setClear:function(ve){Ee!==ve&&(i.clearStencil(ve),Ee=ve)},reset:function(){w=!1,F=null,W=null,ie=null,K=null,G=null,ge=null,_e=null,Ee=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},p=new WeakMap,m=[],g=null,_=!1,f=null,d=null,M=null,v=null,x=null,T=null,A=null,C=new je(0,0,0),N=0,b=!1,S=null,D=null,V=null,$=null,Z=null,k=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,Q=0,X=i.getParameter(i.VERSION);X.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(X)[1]),H=Q>=1):X.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),H=Q>=2);let he=null,ye={},Te=i.getParameter(i.SCISSOR_BOX),$e=i.getParameter(i.VIEWPORT),Qe=new Nt().fromArray(Te),st=new Nt().fromArray($e);function at(w,F,W,ie){let K=new Uint8Array(4),G=i.createTexture();i.bindTexture(w,G),i.texParameteri(w,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(w,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ge=0;ge<W;ge++)w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY?i.texImage3D(F,0,i.RGBA,1,1,ie,0,i.RGBA,i.UNSIGNED_BYTE,K):i.texImage2D(F+ge,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,K);return G}let ee={};ee[i.TEXTURE_2D]=at(i.TEXTURE_2D,i.TEXTURE_2D,1),ee[i.TEXTURE_CUBE_MAP]=at(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[i.TEXTURE_2D_ARRAY]=at(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ee[i.TEXTURE_3D]=at(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ae(i.DEPTH_TEST),o.setFunc(Es),ne(!1),te(Lh),ae(i.CULL_FACE),oe(ki);function ae(w){h[w]!==!0&&(i.enable(w),h[w]=!0)}function Re(w){h[w]!==!1&&(i.disable(w),h[w]=!1)}function Oe(w,F){return u[w]!==F?(i.bindFramebuffer(w,F),u[w]=F,w===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=F),w===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=F),!0):!1}function Ie(w,F){let W=m,ie=!1;if(w){W=p.get(F),W===void 0&&(W=[],p.set(F,W));let K=w.textures;if(W.length!==K.length||W[0]!==i.COLOR_ATTACHMENT0){for(let G=0,ge=K.length;G<ge;G++)W[G]=i.COLOR_ATTACHMENT0+G;W.length=K.length,ie=!0}}else W[0]!==i.BACK&&(W[0]=i.BACK,ie=!0);ie&&i.drawBuffers(W)}function et(w){return g!==w?(i.useProgram(w),g=w,!0):!1}let ft={[ts]:i.FUNC_ADD,[Od]:i.FUNC_SUBTRACT,[Bd]:i.FUNC_REVERSE_SUBTRACT};ft[kd]=i.MIN,ft[zd]=i.MAX;let I={[Hd]:i.ZERO,[Vd]:i.ONE,[Gd]:i.SRC_COLOR,[Xa]:i.SRC_ALPHA,[Zd]:i.SRC_ALPHA_SATURATE,[qd]:i.DST_COLOR,[$d]:i.DST_ALPHA,[Wd]:i.ONE_MINUS_SRC_COLOR,[qa]:i.ONE_MINUS_SRC_ALPHA,[Yd]:i.ONE_MINUS_DST_COLOR,[Xd]:i.ONE_MINUS_DST_ALPHA,[jd]:i.CONSTANT_COLOR,[Jd]:i.ONE_MINUS_CONSTANT_COLOR,[Kd]:i.CONSTANT_ALPHA,[Qd]:i.ONE_MINUS_CONSTANT_ALPHA};function oe(w,F,W,ie,K,G,ge,_e,Ee,ve){if(w===ki){_===!0&&(Re(i.BLEND),_=!1);return}if(_===!1&&(ae(i.BLEND),_=!0),w!==Fd){if(w!==f||ve!==b){if((d!==ts||x!==ts)&&(i.blendEquation(i.FUNC_ADD),d=ts,x=ts),ve)switch(w){case Ss:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Uh:i.blendFunc(i.ONE,i.ONE);break;case Fh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Oh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",w);break}else switch(w){case Ss:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Uh:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Fh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Oh:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",w);break}M=null,v=null,T=null,A=null,C.set(0,0,0),N=0,f=w,b=ve}return}K=K||F,G=G||W,ge=ge||ie,(F!==d||K!==x)&&(i.blendEquationSeparate(ft[F],ft[K]),d=F,x=K),(W!==M||ie!==v||G!==T||ge!==A)&&(i.blendFuncSeparate(I[W],I[ie],I[G],I[ge]),M=W,v=ie,T=G,A=ge),(_e.equals(C)===!1||Ee!==N)&&(i.blendColor(_e.r,_e.g,_e.b,Ee),C.copy(_e),N=Ee),f=w,b=!1}function se(w,F){w.side===wi?Re(i.CULL_FACE):ae(i.CULL_FACE);let W=w.side===gn;F&&(W=!W),ne(W),w.blending===Ss&&w.transparent===!1?oe(ki):oe(w.blending,w.blendEquation,w.blendSrc,w.blendDst,w.blendEquationAlpha,w.blendSrcAlpha,w.blendDstAlpha,w.blendColor,w.blendAlpha,w.premultipliedAlpha),o.setFunc(w.depthFunc),o.setTest(w.depthTest),o.setMask(w.depthWrite),r.setMask(w.colorWrite);let ie=w.stencilWrite;a.setTest(ie),ie&&(a.setMask(w.stencilWriteMask),a.setFunc(w.stencilFunc,w.stencilRef,w.stencilFuncMask),a.setOp(w.stencilFail,w.stencilZFail,w.stencilZPass)),ce(w.polygonOffset,w.polygonOffsetFactor,w.polygonOffsetUnits),w.alphaToCoverage===!0?ae(i.SAMPLE_ALPHA_TO_COVERAGE):Re(i.SAMPLE_ALPHA_TO_COVERAGE)}function ne(w){S!==w&&(w?i.frontFace(i.CW):i.frontFace(i.CCW),S=w)}function te(w){w!==Nd?(ae(i.CULL_FACE),w!==D&&(w===Lh?i.cullFace(i.BACK):w===Ud?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Re(i.CULL_FACE),D=w}function xe(w){w!==V&&(H&&i.lineWidth(w),V=w)}function ce(w,F,W){w?(ae(i.POLYGON_OFFSET_FILL),($!==F||Z!==W)&&(i.polygonOffset(F,W),$=F,Z=W)):Re(i.POLYGON_OFFSET_FILL)}function me(w){w?ae(i.SCISSOR_TEST):Re(i.SCISSOR_TEST)}function Ye(w){w===void 0&&(w=i.TEXTURE0+k-1),he!==w&&(i.activeTexture(w),he=w)}function Ve(w,F,W){W===void 0&&(he===null?W=i.TEXTURE0+k-1:W=he);let ie=ye[W];ie===void 0&&(ie={type:void 0,texture:void 0},ye[W]=ie),(ie.type!==w||ie.texture!==F)&&(he!==W&&(i.activeTexture(W),he=W),i.bindTexture(w,F||ee[w]),ie.type=w,ie.texture=F)}function R(){let w=ye[he];w!==void 0&&w.type!==void 0&&(i.bindTexture(w.type,null),w.type=void 0,w.texture=void 0)}function y(){try{i.compressedTexImage2D(...arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function B(){try{i.compressedTexImage3D(...arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function q(){try{i.texSubImage2D(...arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function re(){try{i.texSubImage3D(...arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function J(){try{i.compressedTexSubImage2D(...arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function Le(){try{i.compressedTexSubImage3D(...arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function fe(){try{i.texStorage2D(...arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function De(){try{i.texStorage3D(...arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function Ce(){try{i.texImage2D(...arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function ue(){try{i.texImage3D(...arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function Me(w){Qe.equals(w)===!1&&(i.scissor(w.x,w.y,w.z,w.w),Qe.copy(w))}function ze(w){st.equals(w)===!1&&(i.viewport(w.x,w.y,w.z,w.w),st.copy(w))}function Fe(w,F){let W=c.get(F);W===void 0&&(W=new WeakMap,c.set(F,W));let ie=W.get(w);ie===void 0&&(ie=i.getUniformBlockIndex(F,w.name),W.set(w,ie))}function Se(w,F){let ie=c.get(F).get(w);l.get(F)!==ie&&(i.uniformBlockBinding(F,ie,w.__bindingPointIndex),l.set(F,ie))}function Ze(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},he=null,ye={},u={},p=new WeakMap,m=[],g=null,_=!1,f=null,d=null,M=null,v=null,x=null,T=null,A=null,C=new je(0,0,0),N=0,b=!1,S=null,D=null,V=null,$=null,Z=null,Qe.set(0,0,i.canvas.width,i.canvas.height),st.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ae,disable:Re,bindFramebuffer:Oe,drawBuffers:Ie,useProgram:et,setBlending:oe,setMaterial:se,setFlipSided:ne,setCullFace:te,setLineWidth:xe,setPolygonOffset:ce,setScissorTest:me,activeTexture:Ye,bindTexture:Ve,unbindTexture:R,compressedTexImage2D:y,compressedTexImage3D:B,texImage2D:Ce,texImage3D:ue,updateUBOMapping:Fe,uniformBlockBinding:Se,texStorage2D:fe,texStorage3D:De,texSubImage2D:q,texSubImage3D:re,compressedTexSubImage2D:J,compressedTexSubImage3D:Le,scissor:Me,viewport:ze,reset:Ze}}function Oy(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new le,h=new WeakMap,u,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,y){return m?new OffscreenCanvas(R,y):mo("canvas")}function _(R,y,B){let q=1,re=Ve(R);if((re.width>B||re.height>B)&&(q=B/Math.max(re.width,re.height)),q<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let J=Math.floor(q*re.width),Le=Math.floor(q*re.height);u===void 0&&(u=g(J,Le));let fe=y?g(J,Le):u;return fe.width=J,fe.height=Le,fe.getContext("2d").drawImage(R,0,0,J,Le),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+J+"x"+Le+")."),fe}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),R;return R}function f(R){return R.generateMipmaps}function d(R){i.generateMipmap(R)}function M(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(R,y,B,q,re=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let J=y;if(y===i.RED&&(B===i.FLOAT&&(J=i.R32F),B===i.HALF_FLOAT&&(J=i.R16F),B===i.UNSIGNED_BYTE&&(J=i.R8)),y===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(J=i.R8UI),B===i.UNSIGNED_SHORT&&(J=i.R16UI),B===i.UNSIGNED_INT&&(J=i.R32UI),B===i.BYTE&&(J=i.R8I),B===i.SHORT&&(J=i.R16I),B===i.INT&&(J=i.R32I)),y===i.RG&&(B===i.FLOAT&&(J=i.RG32F),B===i.HALF_FLOAT&&(J=i.RG16F),B===i.UNSIGNED_BYTE&&(J=i.RG8)),y===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(J=i.RG8UI),B===i.UNSIGNED_SHORT&&(J=i.RG16UI),B===i.UNSIGNED_INT&&(J=i.RG32UI),B===i.BYTE&&(J=i.RG8I),B===i.SHORT&&(J=i.RG16I),B===i.INT&&(J=i.RG32I)),y===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(J=i.RGB8UI),B===i.UNSIGNED_SHORT&&(J=i.RGB16UI),B===i.UNSIGNED_INT&&(J=i.RGB32UI),B===i.BYTE&&(J=i.RGB8I),B===i.SHORT&&(J=i.RGB16I),B===i.INT&&(J=i.RGB32I)),y===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),B===i.UNSIGNED_INT&&(J=i.RGBA32UI),B===i.BYTE&&(J=i.RGBA8I),B===i.SHORT&&(J=i.RGBA16I),B===i.INT&&(J=i.RGBA32I)),y===i.RGB&&(B===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),B===i.UNSIGNED_INT_10F_11F_11F_REV&&(J=i.R11F_G11F_B10F)),y===i.RGBA){let Le=re?fo:lt.getTransfer(q);B===i.FLOAT&&(J=i.RGBA32F),B===i.HALF_FLOAT&&(J=i.RGBA16F),B===i.UNSIGNED_BYTE&&(J=Le===gt?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function x(R,y){let B;return R?y===null||y===us||y===Dr?B=i.DEPTH24_STENCIL8:y===Ti?B=i.DEPTH32F_STENCIL8:y===Pr&&(B=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===us||y===Dr?B=i.DEPTH_COMPONENT24:y===Ti?B=i.DEPTH_COMPONENT32F:y===Pr&&(B=i.DEPTH_COMPONENT16),B}function T(R,y){return f(R)===!0||R.isFramebufferTexture&&R.minFilter!==Wn&&R.minFilter!==li?Math.log2(Math.max(y.width,y.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?y.mipmaps.length:1}function A(R){let y=R.target;y.removeEventListener("dispose",A),N(y),y.isVideoTexture&&h.delete(y)}function C(R){let y=R.target;y.removeEventListener("dispose",C),S(y)}function N(R){let y=n.get(R);if(y.__webglInit===void 0)return;let B=R.source,q=p.get(B);if(q){let re=q[y.__cacheKey];re.usedTimes--,re.usedTimes===0&&b(R),Object.keys(q).length===0&&p.delete(B)}n.remove(R)}function b(R){let y=n.get(R);i.deleteTexture(y.__webglTexture);let B=R.source,q=p.get(B);delete q[y.__cacheKey],o.memory.textures--}function S(R){let y=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(y.__webglFramebuffer[q]))for(let re=0;re<y.__webglFramebuffer[q].length;re++)i.deleteFramebuffer(y.__webglFramebuffer[q][re]);else i.deleteFramebuffer(y.__webglFramebuffer[q]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[q])}else{if(Array.isArray(y.__webglFramebuffer))for(let q=0;q<y.__webglFramebuffer.length;q++)i.deleteFramebuffer(y.__webglFramebuffer[q]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let q=0;q<y.__webglColorRenderbuffer.length;q++)y.__webglColorRenderbuffer[q]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[q]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}let B=R.textures;for(let q=0,re=B.length;q<re;q++){let J=n.get(B[q]);J.__webglTexture&&(i.deleteTexture(J.__webglTexture),o.memory.textures--),n.remove(B[q])}n.remove(R)}let D=0;function V(){D=0}function $(){let R=D;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),D+=1,R}function Z(R){let y=[];return y.push(R.wrapS),y.push(R.wrapT),y.push(R.wrapR||0),y.push(R.magFilter),y.push(R.minFilter),y.push(R.anisotropy),y.push(R.internalFormat),y.push(R.format),y.push(R.type),y.push(R.generateMipmaps),y.push(R.premultiplyAlpha),y.push(R.flipY),y.push(R.unpackAlignment),y.push(R.colorSpace),y.join()}function k(R,y){let B=n.get(R);if(R.isVideoTexture&&me(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&B.__version!==R.version){let q=R.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ee(B,R,y);return}}else R.isExternalTexture&&(B.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+y)}function H(R,y){let B=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&B.__version!==R.version){ee(B,R,y);return}t.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+y)}function Q(R,y){let B=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&B.__version!==R.version){ee(B,R,y);return}t.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+y)}function X(R,y){let B=n.get(R);if(R.version>0&&B.__version!==R.version){ae(B,R,y);return}t.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+y)}let he={[Ya]:i.REPEAT,[es]:i.CLAMP_TO_EDGE,[Za]:i.MIRRORED_REPEAT},ye={[Wn]:i.NEAREST,[hf]:i.NEAREST_MIPMAP_NEAREST,[Xo]:i.NEAREST_MIPMAP_LINEAR,[li]:i.LINEAR,[Ul]:i.LINEAR_MIPMAP_NEAREST,[hs]:i.LINEAR_MIPMAP_LINEAR},Te={[pf]:i.NEVER,[vf]:i.ALWAYS,[mf]:i.LESS,[Zh]:i.LEQUAL,[gf]:i.EQUAL,[yf]:i.GEQUAL,[_f]:i.GREATER,[xf]:i.NOTEQUAL};function $e(R,y){if(y.type===Ti&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===li||y.magFilter===Ul||y.magFilter===Xo||y.magFilter===hs||y.minFilter===li||y.minFilter===Ul||y.minFilter===Xo||y.minFilter===hs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,he[y.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,he[y.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,he[y.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,ye[y.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,ye[y.minFilter]),y.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,Te[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Wn||y.minFilter!==Xo&&y.minFilter!==hs||y.type===Ti&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){let B=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function Qe(R,y){let B=!1;R.__webglInit===void 0&&(R.__webglInit=!0,y.addEventListener("dispose",A));let q=y.source,re=p.get(q);re===void 0&&(re={},p.set(q,re));let J=Z(y);if(J!==R.__cacheKey){re[J]===void 0&&(re[J]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,B=!0),re[J].usedTimes++;let Le=re[R.__cacheKey];Le!==void 0&&(re[R.__cacheKey].usedTimes--,Le.usedTimes===0&&b(y)),R.__cacheKey=J,R.__webglTexture=re[J].texture}return B}function st(R,y,B){return Math.floor(Math.floor(R/B)/y)}function at(R,y,B,q){let J=R.updateRanges;if(J.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,B,q,y.data);else{J.sort((ue,Me)=>ue.start-Me.start);let Le=0;for(let ue=1;ue<J.length;ue++){let Me=J[Le],ze=J[ue],Fe=Me.start+Me.count,Se=st(ze.start,y.width,4),Ze=st(Me.start,y.width,4);ze.start<=Fe+1&&Se===Ze&&st(ze.start+ze.count-1,y.width,4)===Se?Me.count=Math.max(Me.count,ze.start+ze.count-Me.start):(++Le,J[Le]=ze)}J.length=Le+1;let fe=i.getParameter(i.UNPACK_ROW_LENGTH),De=i.getParameter(i.UNPACK_SKIP_PIXELS),Ce=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let ue=0,Me=J.length;ue<Me;ue++){let ze=J[ue],Fe=Math.floor(ze.start/4),Se=Math.ceil(ze.count/4),Ze=Fe%y.width,w=Math.floor(Fe/y.width),F=Se,W=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ze),i.pixelStorei(i.UNPACK_SKIP_ROWS,w),t.texSubImage2D(i.TEXTURE_2D,0,Ze,w,F,W,B,q,y.data)}R.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,fe),i.pixelStorei(i.UNPACK_SKIP_PIXELS,De),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ce)}}function ee(R,y,B){let q=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(q=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(q=i.TEXTURE_3D);let re=Qe(R,y),J=y.source;t.bindTexture(q,R.__webglTexture,i.TEXTURE0+B);let Le=n.get(J);if(J.version!==Le.__version||re===!0){t.activeTexture(i.TEXTURE0+B);let fe=lt.getPrimaries(lt.workingColorSpace),De=y.colorSpace===Hi?null:lt.getPrimaries(y.colorSpace),Ce=y.colorSpace===Hi||fe===De?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);let ue=_(y.image,!1,s.maxTextureSize);ue=Ye(y,ue);let Me=r.convert(y.format,y.colorSpace),ze=r.convert(y.type),Fe=v(y.internalFormat,Me,ze,y.colorSpace,y.isVideoTexture);$e(q,y);let Se,Ze=y.mipmaps,w=y.isVideoTexture!==!0,F=Le.__version===void 0||re===!0,W=J.dataReady,ie=T(y,ue);if(y.isDepthTexture)Fe=x(y.format===Lr,y.type),F&&(w?t.texStorage2D(i.TEXTURE_2D,1,Fe,ue.width,ue.height):t.texImage2D(i.TEXTURE_2D,0,Fe,ue.width,ue.height,0,Me,ze,null));else if(y.isDataTexture)if(Ze.length>0){w&&F&&t.texStorage2D(i.TEXTURE_2D,ie,Fe,Ze[0].width,Ze[0].height);for(let K=0,G=Ze.length;K<G;K++)Se=Ze[K],w?W&&t.texSubImage2D(i.TEXTURE_2D,K,0,0,Se.width,Se.height,Me,ze,Se.data):t.texImage2D(i.TEXTURE_2D,K,Fe,Se.width,Se.height,0,Me,ze,Se.data);y.generateMipmaps=!1}else w?(F&&t.texStorage2D(i.TEXTURE_2D,ie,Fe,ue.width,ue.height),W&&at(y,ue,Me,ze)):t.texImage2D(i.TEXTURE_2D,0,Fe,ue.width,ue.height,0,Me,ze,ue.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){w&&F&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ie,Fe,Ze[0].width,Ze[0].height,ue.depth);for(let K=0,G=Ze.length;K<G;K++)if(Se=Ze[K],y.format!==qn)if(Me!==null)if(w){if(W)if(y.layerUpdates.size>0){let ge=su(Se.width,Se.height,y.format,y.type);for(let _e of y.layerUpdates){let Ee=Se.data.subarray(_e*ge/Se.data.BYTES_PER_ELEMENT,(_e+1)*ge/Se.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,_e,Se.width,Se.height,1,Me,Ee)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,Se.width,Se.height,ue.depth,Me,Se.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,K,Fe,Se.width,Se.height,ue.depth,0,Se.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else w?W&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,Se.width,Se.height,ue.depth,Me,ze,Se.data):t.texImage3D(i.TEXTURE_2D_ARRAY,K,Fe,Se.width,Se.height,ue.depth,0,Me,ze,Se.data)}else{w&&F&&t.texStorage2D(i.TEXTURE_2D,ie,Fe,Ze[0].width,Ze[0].height);for(let K=0,G=Ze.length;K<G;K++)Se=Ze[K],y.format!==qn?Me!==null?w?W&&t.compressedTexSubImage2D(i.TEXTURE_2D,K,0,0,Se.width,Se.height,Me,Se.data):t.compressedTexImage2D(i.TEXTURE_2D,K,Fe,Se.width,Se.height,0,Se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):w?W&&t.texSubImage2D(i.TEXTURE_2D,K,0,0,Se.width,Se.height,Me,ze,Se.data):t.texImage2D(i.TEXTURE_2D,K,Fe,Se.width,Se.height,0,Me,ze,Se.data)}else if(y.isDataArrayTexture)if(w){if(F&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ie,Fe,ue.width,ue.height,ue.depth),W)if(y.layerUpdates.size>0){let K=su(ue.width,ue.height,y.format,y.type);for(let G of y.layerUpdates){let ge=ue.data.subarray(G*K/ue.data.BYTES_PER_ELEMENT,(G+1)*K/ue.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,G,ue.width,ue.height,1,Me,ze,ge)}y.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ue.width,ue.height,ue.depth,Me,ze,ue.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Fe,ue.width,ue.height,ue.depth,0,Me,ze,ue.data);else if(y.isData3DTexture)w?(F&&t.texStorage3D(i.TEXTURE_3D,ie,Fe,ue.width,ue.height,ue.depth),W&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ue.width,ue.height,ue.depth,Me,ze,ue.data)):t.texImage3D(i.TEXTURE_3D,0,Fe,ue.width,ue.height,ue.depth,0,Me,ze,ue.data);else if(y.isFramebufferTexture){if(F)if(w)t.texStorage2D(i.TEXTURE_2D,ie,Fe,ue.width,ue.height);else{let K=ue.width,G=ue.height;for(let ge=0;ge<ie;ge++)t.texImage2D(i.TEXTURE_2D,ge,Fe,K,G,0,Me,ze,null),K>>=1,G>>=1}}else if(Ze.length>0){if(w&&F){let K=Ve(Ze[0]);t.texStorage2D(i.TEXTURE_2D,ie,Fe,K.width,K.height)}for(let K=0,G=Ze.length;K<G;K++)Se=Ze[K],w?W&&t.texSubImage2D(i.TEXTURE_2D,K,0,0,Me,ze,Se):t.texImage2D(i.TEXTURE_2D,K,Fe,Me,ze,Se);y.generateMipmaps=!1}else if(w){if(F){let K=Ve(ue);t.texStorage2D(i.TEXTURE_2D,ie,Fe,K.width,K.height)}W&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Me,ze,ue)}else t.texImage2D(i.TEXTURE_2D,0,Fe,Me,ze,ue);f(y)&&d(q),Le.__version=J.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function ae(R,y,B){if(y.image.length!==6)return;let q=Qe(R,y),re=y.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+B);let J=n.get(re);if(re.version!==J.__version||q===!0){t.activeTexture(i.TEXTURE0+B);let Le=lt.getPrimaries(lt.workingColorSpace),fe=y.colorSpace===Hi?null:lt.getPrimaries(y.colorSpace),De=y.colorSpace===Hi||Le===fe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,De);let Ce=y.isCompressedTexture||y.image[0].isCompressedTexture,ue=y.image[0]&&y.image[0].isDataTexture,Me=[];for(let G=0;G<6;G++)!Ce&&!ue?Me[G]=_(y.image[G],!0,s.maxCubemapSize):Me[G]=ue?y.image[G].image:y.image[G],Me[G]=Ye(y,Me[G]);let ze=Me[0],Fe=r.convert(y.format,y.colorSpace),Se=r.convert(y.type),Ze=v(y.internalFormat,Fe,Se,y.colorSpace),w=y.isVideoTexture!==!0,F=J.__version===void 0||q===!0,W=re.dataReady,ie=T(y,ze);$e(i.TEXTURE_CUBE_MAP,y);let K;if(Ce){w&&F&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ie,Ze,ze.width,ze.height);for(let G=0;G<6;G++){K=Me[G].mipmaps;for(let ge=0;ge<K.length;ge++){let _e=K[ge];y.format!==qn?Fe!==null?w?W&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,ge,0,0,_e.width,_e.height,Fe,_e.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,ge,Ze,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):w?W&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,ge,0,0,_e.width,_e.height,Fe,Se,_e.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,ge,Ze,_e.width,_e.height,0,Fe,Se,_e.data)}}}else{if(K=y.mipmaps,w&&F){K.length>0&&ie++;let G=Ve(Me[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ie,Ze,G.width,G.height)}for(let G=0;G<6;G++)if(ue){w?W&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,0,0,Me[G].width,Me[G].height,Fe,Se,Me[G].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,Ze,Me[G].width,Me[G].height,0,Fe,Se,Me[G].data);for(let ge=0;ge<K.length;ge++){let Ee=K[ge].image[G].image;w?W&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,ge+1,0,0,Ee.width,Ee.height,Fe,Se,Ee.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,ge+1,Ze,Ee.width,Ee.height,0,Fe,Se,Ee.data)}}else{w?W&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,0,0,Fe,Se,Me[G]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,Ze,Fe,Se,Me[G]);for(let ge=0;ge<K.length;ge++){let _e=K[ge];w?W&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,ge+1,0,0,Fe,Se,_e.image[G]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,ge+1,Ze,Fe,Se,_e.image[G])}}}f(y)&&d(i.TEXTURE_CUBE_MAP),J.__version=re.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function Re(R,y,B,q,re,J){let Le=r.convert(B.format,B.colorSpace),fe=r.convert(B.type),De=v(B.internalFormat,Le,fe,B.colorSpace),Ce=n.get(y),ue=n.get(B);if(ue.__renderTarget=y,!Ce.__hasExternalTextures){let Me=Math.max(1,y.width>>J),ze=Math.max(1,y.height>>J);re===i.TEXTURE_3D||re===i.TEXTURE_2D_ARRAY?t.texImage3D(re,J,De,Me,ze,y.depth,0,Le,fe,null):t.texImage2D(re,J,De,Me,ze,0,Le,fe,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),ce(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,q,re,ue.__webglTexture,0,xe(y)):(re===i.TEXTURE_2D||re>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,q,re,ue.__webglTexture,J),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Oe(R,y,B){if(i.bindRenderbuffer(i.RENDERBUFFER,R),y.depthBuffer){let q=y.depthTexture,re=q&&q.isDepthTexture?q.type:null,J=x(y.stencilBuffer,re),Le=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=xe(y);ce(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,fe,J,y.width,y.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,fe,J,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,J,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Le,i.RENDERBUFFER,R)}else{let q=y.textures;for(let re=0;re<q.length;re++){let J=q[re],Le=r.convert(J.format,J.colorSpace),fe=r.convert(J.type),De=v(J.internalFormat,Le,fe,J.colorSpace),Ce=xe(y);B&&ce(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ce,De,y.width,y.height):ce(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ce,De,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,De,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ie(R,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let q=n.get(y.depthTexture);q.__renderTarget=y,(!q.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),k(y.depthTexture,0);let re=q.__webglTexture,J=xe(y);if(y.depthTexture.format===gr)ce(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,re,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,re,0);else if(y.depthTexture.format===Lr)ce(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,re,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,re,0);else throw new Error("Unknown depthTexture format")}function et(R){let y=n.get(R),B=R.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==R.depthTexture){let q=R.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),q){let re=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,q.removeEventListener("dispose",re)};q.addEventListener("dispose",re),y.__depthDisposeCallback=re}y.__boundDepthTexture=q}if(R.depthTexture&&!y.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");let q=R.texture.mipmaps;q&&q.length>0?Ie(y.__webglFramebuffer[0],R):Ie(y.__webglFramebuffer,R)}else if(B){y.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[q]),y.__webglDepthbuffer[q]===void 0)y.__webglDepthbuffer[q]=i.createRenderbuffer(),Oe(y.__webglDepthbuffer[q],R,!1);else{let re=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=y.__webglDepthbuffer[q];i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,re,i.RENDERBUFFER,J)}}else{let q=R.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),Oe(y.__webglDepthbuffer,R,!1);else{let re=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,re,i.RENDERBUFFER,J)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function ft(R,y,B){let q=n.get(R);y!==void 0&&Re(q.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&et(R)}function I(R){let y=R.texture,B=n.get(R),q=n.get(y);R.addEventListener("dispose",C);let re=R.textures,J=R.isWebGLCubeRenderTarget===!0,Le=re.length>1;if(Le||(q.__webglTexture===void 0&&(q.__webglTexture=i.createTexture()),q.__version=y.version,o.memory.textures++),J){B.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(y.mipmaps&&y.mipmaps.length>0){B.__webglFramebuffer[fe]=[];for(let De=0;De<y.mipmaps.length;De++)B.__webglFramebuffer[fe][De]=i.createFramebuffer()}else B.__webglFramebuffer[fe]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){B.__webglFramebuffer=[];for(let fe=0;fe<y.mipmaps.length;fe++)B.__webglFramebuffer[fe]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(Le)for(let fe=0,De=re.length;fe<De;fe++){let Ce=n.get(re[fe]);Ce.__webglTexture===void 0&&(Ce.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&ce(R)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let fe=0;fe<re.length;fe++){let De=re[fe];B.__webglColorRenderbuffer[fe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[fe]);let Ce=r.convert(De.format,De.colorSpace),ue=r.convert(De.type),Me=v(De.internalFormat,Ce,ue,De.colorSpace,R.isXRRenderTarget===!0),ze=xe(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,ze,Me,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,B.__webglColorRenderbuffer[fe])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),Oe(B.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(J){t.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),$e(i.TEXTURE_CUBE_MAP,y);for(let fe=0;fe<6;fe++)if(y.mipmaps&&y.mipmaps.length>0)for(let De=0;De<y.mipmaps.length;De++)Re(B.__webglFramebuffer[fe][De],R,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+fe,De);else Re(B.__webglFramebuffer[fe],R,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);f(y)&&d(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Le){for(let fe=0,De=re.length;fe<De;fe++){let Ce=re[fe],ue=n.get(Ce),Me=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Me=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Me,ue.__webglTexture),$e(Me,Ce),Re(B.__webglFramebuffer,R,Ce,i.COLOR_ATTACHMENT0+fe,Me,0),f(Ce)&&d(Me)}t.unbindTexture()}else{let fe=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(fe=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(fe,q.__webglTexture),$e(fe,y),y.mipmaps&&y.mipmaps.length>0)for(let De=0;De<y.mipmaps.length;De++)Re(B.__webglFramebuffer[De],R,y,i.COLOR_ATTACHMENT0,fe,De);else Re(B.__webglFramebuffer,R,y,i.COLOR_ATTACHMENT0,fe,0);f(y)&&d(fe),t.unbindTexture()}R.depthBuffer&&et(R)}function oe(R){let y=R.textures;for(let B=0,q=y.length;B<q;B++){let re=y[B];if(f(re)){let J=M(R),Le=n.get(re).__webglTexture;t.bindTexture(J,Le),d(J),t.unbindTexture()}}}let se=[],ne=[];function te(R){if(R.samples>0){if(ce(R)===!1){let y=R.textures,B=R.width,q=R.height,re=i.COLOR_BUFFER_BIT,J=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Le=n.get(R),fe=y.length>1;if(fe)for(let Ce=0;Ce<y.length;Ce++)t.bindFramebuffer(i.FRAMEBUFFER,Le.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Le.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Le.__webglMultisampledFramebuffer);let De=R.texture.mipmaps;De&&De.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Le.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Le.__webglFramebuffer);for(let Ce=0;Ce<y.length;Ce++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(re|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(re|=i.STENCIL_BUFFER_BIT)),fe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Le.__webglColorRenderbuffer[Ce]);let ue=n.get(y[Ce]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ue,0)}i.blitFramebuffer(0,0,B,q,0,0,B,q,re,i.NEAREST),l===!0&&(se.length=0,ne.length=0,se.push(i.COLOR_ATTACHMENT0+Ce),R.depthBuffer&&R.resolveDepthBuffer===!1&&(se.push(J),ne.push(J),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ne)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,se))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),fe)for(let Ce=0;Ce<y.length;Ce++){t.bindFramebuffer(i.FRAMEBUFFER,Le.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.RENDERBUFFER,Le.__webglColorRenderbuffer[Ce]);let ue=n.get(y[Ce]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Le.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.TEXTURE_2D,ue,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Le.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){let y=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function xe(R){return Math.min(s.maxSamples,R.samples)}function ce(R){let y=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function me(R){let y=o.render.frame;h.get(R)!==y&&(h.set(R,y),R.update())}function Ye(R,y){let B=R.colorSpace,q=R.format,re=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||B!==ws&&B!==Hi&&(lt.getTransfer(B)===gt?(q!==qn||re!==ui)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),y}function Ve(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=$,this.resetTextureUnits=V,this.setTexture2D=k,this.setTexture2DArray=H,this.setTexture3D=Q,this.setTextureCube=X,this.rebindTextures=ft,this.setupRenderTarget=I,this.updateRenderTargetMipmap=oe,this.updateMultisampleRenderTarget=te,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=Re,this.useMultisampledRTT=ce}function By(i,e){function t(n,s=Hi){let r,o=lt.getTransfer(s);if(n===ui)return i.UNSIGNED_BYTE;if(n===Ol)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Bl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Vh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Gh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===zh)return i.BYTE;if(n===Hh)return i.SHORT;if(n===Pr)return i.UNSIGNED_SHORT;if(n===Fl)return i.INT;if(n===us)return i.UNSIGNED_INT;if(n===Ti)return i.FLOAT;if(n===Ir)return i.HALF_FLOAT;if(n===Wh)return i.ALPHA;if(n===$h)return i.RGB;if(n===qn)return i.RGBA;if(n===gr)return i.DEPTH_COMPONENT;if(n===Lr)return i.DEPTH_STENCIL;if(n===Xh)return i.RED;if(n===kl)return i.RED_INTEGER;if(n===qh)return i.RG;if(n===zl)return i.RG_INTEGER;if(n===Hl)return i.RGBA_INTEGER;if(n===qo||n===Yo||n===Zo||n===jo)if(o===gt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===qo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Yo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Zo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===jo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===qo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Yo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Zo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===jo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Vl||n===Gl||n===Wl||n===$l)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Vl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Gl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Wl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===$l)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Xl||n===ql||n===Yl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Xl||n===ql)return o===gt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Yl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Zl||n===jl||n===Jl||n===Kl||n===Ql||n===ec||n===tc||n===nc||n===ic||n===sc||n===rc||n===oc||n===ac||n===lc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Zl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===jl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Jl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Kl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ql)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ec)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===tc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===nc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ic)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===sc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===rc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===oc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ac)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===lc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===cc||n===hc||n===uc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===cc)return o===gt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===hc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===uc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===dc||n===fc||n===pc||n===mc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===dc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===fc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===pc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===mc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Dr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var ky=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,zy=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,_u=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new wo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new hi({vertexShader:ky,fragmentShader:zy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new _t(new Ps(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},xu=class extends vi{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,p=null,m=null,g=null,_=typeof XRWebGLBinding<"u",f=new _u,d={},M=t.getContextAttributes(),v=null,x=null,T=[],A=[],C=new le,N=null,b=new Kt;b.viewport=new Nt;let S=new Kt;S.viewport=new Nt;let D=[b,S],V=new El,$=null,Z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ee){let ae=T[ee];return ae===void 0&&(ae=new br,T[ee]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function(ee){let ae=T[ee];return ae===void 0&&(ae=new br,T[ee]=ae),ae.getGripSpace()},this.getHand=function(ee){let ae=T[ee];return ae===void 0&&(ae=new br,T[ee]=ae),ae.getHandSpace()};function k(ee){let ae=A.indexOf(ee.inputSource);if(ae===-1)return;let Re=T[ae];Re!==void 0&&(Re.update(ee.inputSource,ee.frame,c||o),Re.dispatchEvent({type:ee.type,data:ee.inputSource}))}function H(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",Q);for(let ee=0;ee<T.length;ee++){let ae=A[ee];ae!==null&&(A[ee]=null,T[ee].disconnect(ae))}$=null,Z=null,f.reset();for(let ee in d)delete d[ee];e.setRenderTarget(v),m=null,p=null,u=null,s=null,x=null,at.stop(),n.isPresenting=!1,e.setPixelRatio(N),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ee){r=ee,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ee){a=ee,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(ee){c=ee},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(ee){if(s=ee,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",H),s.addEventListener("inputsourceschange",Q),M.xrCompatible!==!0&&await t.makeXRCompatible(),N=e.getPixelRatio(),e.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Re=null,Oe=null,Ie=null;M.depth&&(Ie=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Re=M.stencil?Lr:gr,Oe=M.stencil?Dr:us);let et={colorFormat:t.RGBA8,depthFormat:Ie,scaleFactor:r};u=this.getBinding(),p=u.createProjectionLayer(et),s.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),x=new bi(p.textureWidth,p.textureHeight,{format:qn,type:ui,depthTexture:new Eo(p.textureWidth,p.textureHeight,Oe,void 0,void 0,void 0,void 0,void 0,void 0,Re),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{let Re={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,Re),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),x=new bi(m.framebufferWidth,m.framebufferHeight,{format:qn,type:ui,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),at.setContext(s),at.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function Q(ee){for(let ae=0;ae<ee.removed.length;ae++){let Re=ee.removed[ae],Oe=A.indexOf(Re);Oe>=0&&(A[Oe]=null,T[Oe].disconnect(Re))}for(let ae=0;ae<ee.added.length;ae++){let Re=ee.added[ae],Oe=A.indexOf(Re);if(Oe===-1){for(let et=0;et<T.length;et++)if(et>=A.length){A.push(Re),Oe=et;break}else if(A[et]===null){A[et]=Re,Oe=et;break}if(Oe===-1)break}let Ie=T[Oe];Ie&&Ie.connect(Re)}}let X=new L,he=new L;function ye(ee,ae,Re){X.setFromMatrixPosition(ae.matrixWorld),he.setFromMatrixPosition(Re.matrixWorld);let Oe=X.distanceTo(he),Ie=ae.projectionMatrix.elements,et=Re.projectionMatrix.elements,ft=Ie[14]/(Ie[10]-1),I=Ie[14]/(Ie[10]+1),oe=(Ie[9]+1)/Ie[5],se=(Ie[9]-1)/Ie[5],ne=(Ie[8]-1)/Ie[0],te=(et[8]+1)/et[0],xe=ft*ne,ce=ft*te,me=Oe/(-ne+te),Ye=me*-ne;if(ae.matrixWorld.decompose(ee.position,ee.quaternion,ee.scale),ee.translateX(Ye),ee.translateZ(me),ee.matrixWorld.compose(ee.position,ee.quaternion,ee.scale),ee.matrixWorldInverse.copy(ee.matrixWorld).invert(),Ie[10]===-1)ee.projectionMatrix.copy(ae.projectionMatrix),ee.projectionMatrixInverse.copy(ae.projectionMatrixInverse);else{let Ve=ft+me,R=I+me,y=xe-Ye,B=ce+(Oe-Ye),q=oe*I/R*Ve,re=se*I/R*Ve;ee.projectionMatrix.makePerspective(y,B,q,re,Ve,R),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert()}}function Te(ee,ae){ae===null?ee.matrixWorld.copy(ee.matrix):ee.matrixWorld.multiplyMatrices(ae.matrixWorld,ee.matrix),ee.matrixWorldInverse.copy(ee.matrixWorld).invert()}this.updateCamera=function(ee){if(s===null)return;let ae=ee.near,Re=ee.far;f.texture!==null&&(f.depthNear>0&&(ae=f.depthNear),f.depthFar>0&&(Re=f.depthFar)),V.near=S.near=b.near=ae,V.far=S.far=b.far=Re,($!==V.near||Z!==V.far)&&(s.updateRenderState({depthNear:V.near,depthFar:V.far}),$=V.near,Z=V.far),V.layers.mask=ee.layers.mask|6,b.layers.mask=V.layers.mask&3,S.layers.mask=V.layers.mask&5;let Oe=ee.parent,Ie=V.cameras;Te(V,Oe);for(let et=0;et<Ie.length;et++)Te(Ie[et],Oe);Ie.length===2?ye(V,b,S):V.projectionMatrix.copy(b.projectionMatrix),$e(ee,V,Oe)};function $e(ee,ae,Re){Re===null?ee.matrix.copy(ae.matrixWorld):(ee.matrix.copy(Re.matrixWorld),ee.matrix.invert(),ee.matrix.multiply(ae.matrixWorld)),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.updateMatrixWorld(!0),ee.projectionMatrix.copy(ae.projectionMatrix),ee.projectionMatrixInverse.copy(ae.projectionMatrixInverse),ee.isPerspectiveCamera&&(ee.fov=_r*2*Math.atan(1/ee.projectionMatrix.elements[5]),ee.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(p===null&&m===null))return l},this.setFoveation=function(ee){l=ee,p!==null&&(p.fixedFoveation=ee),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=ee)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(V)},this.getCameraTexture=function(ee){return d[ee]};let Qe=null;function st(ee,ae){if(h=ae.getViewerPose(c||o),g=ae,h!==null){let Re=h.views;m!==null&&(e.setRenderTargetFramebuffer(x,m.framebuffer),e.setRenderTarget(x));let Oe=!1;Re.length!==V.cameras.length&&(V.cameras.length=0,Oe=!0);for(let I=0;I<Re.length;I++){let oe=Re[I],se=null;if(m!==null)se=m.getViewport(oe);else{let te=u.getViewSubImage(p,oe);se=te.viewport,I===0&&(e.setRenderTargetTextures(x,te.colorTexture,te.depthStencilTexture),e.setRenderTarget(x))}let ne=D[I];ne===void 0&&(ne=new Kt,ne.layers.enable(I),ne.viewport=new Nt,D[I]=ne),ne.matrix.fromArray(oe.transform.matrix),ne.matrix.decompose(ne.position,ne.quaternion,ne.scale),ne.projectionMatrix.fromArray(oe.projectionMatrix),ne.projectionMatrixInverse.copy(ne.projectionMatrix).invert(),ne.viewport.set(se.x,se.y,se.width,se.height),I===0&&(V.matrix.copy(ne.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),Oe===!0&&V.cameras.push(ne)}let Ie=s.enabledFeatures;if(Ie&&Ie.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=n.getBinding();let I=u.getDepthInformation(Re[0]);I&&I.isValid&&I.texture&&f.init(I,s.renderState)}if(Ie&&Ie.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let I=0;I<Re.length;I++){let oe=Re[I].camera;if(oe){let se=d[oe];se||(se=new wo,d[oe]=se);let ne=u.getCameraImage(oe);se.sourceTexture=ne}}}}for(let Re=0;Re<T.length;Re++){let Oe=A[Re],Ie=T[Re];Oe!==null&&Ie!==void 0&&Ie.update(Oe,ae,c||o)}Qe&&Qe(ee,ae),ae.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ae}),g=null}let at=new ep;at.setAnimationLoop(st),this.setAnimationLoop=function(ee){Qe=ee},this.dispose=function(){}}},Fs=new ci,Hy=new dt;function Vy(i,e){function t(f,d){f.matrixAutoUpdate===!0&&f.updateMatrix(),d.value.copy(f.matrix)}function n(f,d){d.color.getRGB(f.fogColor.value,eu(i)),d.isFog?(f.fogNear.value=d.near,f.fogFar.value=d.far):d.isFogExp2&&(f.fogDensity.value=d.density)}function s(f,d,M,v,x){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(f,d):d.isMeshToonMaterial?(r(f,d),u(f,d)):d.isMeshPhongMaterial?(r(f,d),h(f,d)):d.isMeshStandardMaterial?(r(f,d),p(f,d),d.isMeshPhysicalMaterial&&m(f,d,x)):d.isMeshMatcapMaterial?(r(f,d),g(f,d)):d.isMeshDepthMaterial?r(f,d):d.isMeshDistanceMaterial?(r(f,d),_(f,d)):d.isMeshNormalMaterial?r(f,d):d.isLineBasicMaterial?(o(f,d),d.isLineDashedMaterial&&a(f,d)):d.isPointsMaterial?l(f,d,M,v):d.isSpriteMaterial?c(f,d):d.isShadowMaterial?(f.color.value.copy(d.color),f.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(f,d){f.opacity.value=d.opacity,d.color&&f.diffuse.value.copy(d.color),d.emissive&&f.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(f.map.value=d.map,t(d.map,f.mapTransform)),d.alphaMap&&(f.alphaMap.value=d.alphaMap,t(d.alphaMap,f.alphaMapTransform)),d.bumpMap&&(f.bumpMap.value=d.bumpMap,t(d.bumpMap,f.bumpMapTransform),f.bumpScale.value=d.bumpScale,d.side===gn&&(f.bumpScale.value*=-1)),d.normalMap&&(f.normalMap.value=d.normalMap,t(d.normalMap,f.normalMapTransform),f.normalScale.value.copy(d.normalScale),d.side===gn&&f.normalScale.value.negate()),d.displacementMap&&(f.displacementMap.value=d.displacementMap,t(d.displacementMap,f.displacementMapTransform),f.displacementScale.value=d.displacementScale,f.displacementBias.value=d.displacementBias),d.emissiveMap&&(f.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,f.emissiveMapTransform)),d.specularMap&&(f.specularMap.value=d.specularMap,t(d.specularMap,f.specularMapTransform)),d.alphaTest>0&&(f.alphaTest.value=d.alphaTest);let M=e.get(d),v=M.envMap,x=M.envMapRotation;v&&(f.envMap.value=v,Fs.copy(x),Fs.x*=-1,Fs.y*=-1,Fs.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Fs.y*=-1,Fs.z*=-1),f.envMapRotation.value.setFromMatrix4(Hy.makeRotationFromEuler(Fs)),f.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=d.reflectivity,f.ior.value=d.ior,f.refractionRatio.value=d.refractionRatio),d.lightMap&&(f.lightMap.value=d.lightMap,f.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,f.lightMapTransform)),d.aoMap&&(f.aoMap.value=d.aoMap,f.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,f.aoMapTransform))}function o(f,d){f.diffuse.value.copy(d.color),f.opacity.value=d.opacity,d.map&&(f.map.value=d.map,t(d.map,f.mapTransform))}function a(f,d){f.dashSize.value=d.dashSize,f.totalSize.value=d.dashSize+d.gapSize,f.scale.value=d.scale}function l(f,d,M,v){f.diffuse.value.copy(d.color),f.opacity.value=d.opacity,f.size.value=d.size*M,f.scale.value=v*.5,d.map&&(f.map.value=d.map,t(d.map,f.uvTransform)),d.alphaMap&&(f.alphaMap.value=d.alphaMap,t(d.alphaMap,f.alphaMapTransform)),d.alphaTest>0&&(f.alphaTest.value=d.alphaTest)}function c(f,d){f.diffuse.value.copy(d.color),f.opacity.value=d.opacity,f.rotation.value=d.rotation,d.map&&(f.map.value=d.map,t(d.map,f.mapTransform)),d.alphaMap&&(f.alphaMap.value=d.alphaMap,t(d.alphaMap,f.alphaMapTransform)),d.alphaTest>0&&(f.alphaTest.value=d.alphaTest)}function h(f,d){f.specular.value.copy(d.specular),f.shininess.value=Math.max(d.shininess,1e-4)}function u(f,d){d.gradientMap&&(f.gradientMap.value=d.gradientMap)}function p(f,d){f.metalness.value=d.metalness,d.metalnessMap&&(f.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,f.metalnessMapTransform)),f.roughness.value=d.roughness,d.roughnessMap&&(f.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,f.roughnessMapTransform)),d.envMap&&(f.envMapIntensity.value=d.envMapIntensity)}function m(f,d,M){f.ior.value=d.ior,d.sheen>0&&(f.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),f.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(f.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,f.sheenColorMapTransform)),d.sheenRoughnessMap&&(f.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,f.sheenRoughnessMapTransform))),d.clearcoat>0&&(f.clearcoat.value=d.clearcoat,f.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(f.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,f.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(f.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===gn&&f.clearcoatNormalScale.value.negate())),d.dispersion>0&&(f.dispersion.value=d.dispersion),d.iridescence>0&&(f.iridescence.value=d.iridescence,f.iridescenceIOR.value=d.iridescenceIOR,f.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(f.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,f.iridescenceMapTransform)),d.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),d.transmission>0&&(f.transmission.value=d.transmission,f.transmissionSamplerMap.value=M.texture,f.transmissionSamplerSize.value.set(M.width,M.height),d.transmissionMap&&(f.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,f.transmissionMapTransform)),f.thickness.value=d.thickness,d.thicknessMap&&(f.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=d.attenuationDistance,f.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(f.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(f.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=d.specularIntensity,f.specularColor.value.copy(d.specularColor),d.specularColorMap&&(f.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,f.specularColorMapTransform)),d.specularIntensityMap&&(f.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,d){d.matcap&&(f.matcap.value=d.matcap)}function _(f,d){let M=e.get(d).light;f.referencePosition.value.setFromMatrixPosition(M.matrixWorld),f.nearDistance.value=M.shadow.camera.near,f.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Gy(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,v){let x=v.program;n.uniformBlockBinding(M,x)}function c(M,v){let x=s[M.id];x===void 0&&(g(M),x=h(M),s[M.id]=x,M.addEventListener("dispose",f));let T=v.program;n.updateUBOMapping(M,T);let A=e.render.frame;r[M.id]!==A&&(p(M),r[M.id]=A)}function h(M){let v=u();M.__bindingPointIndex=v;let x=i.createBuffer(),T=M.__size,A=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,T,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,x),x}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(M){let v=s[M.id],x=M.uniforms,T=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let A=0,C=x.length;A<C;A++){let N=Array.isArray(x[A])?x[A]:[x[A]];for(let b=0,S=N.length;b<S;b++){let D=N[b];if(m(D,A,b,T)===!0){let V=D.__offset,$=Array.isArray(D.value)?D.value:[D.value],Z=0;for(let k=0;k<$.length;k++){let H=$[k],Q=_(H);typeof H=="number"||typeof H=="boolean"?(D.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,V+Z,D.__data)):H.isMatrix3?(D.__data[0]=H.elements[0],D.__data[1]=H.elements[1],D.__data[2]=H.elements[2],D.__data[3]=0,D.__data[4]=H.elements[3],D.__data[5]=H.elements[4],D.__data[6]=H.elements[5],D.__data[7]=0,D.__data[8]=H.elements[6],D.__data[9]=H.elements[7],D.__data[10]=H.elements[8],D.__data[11]=0):(H.toArray(D.__data,Z),Z+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,V,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(M,v,x,T){let A=M.value,C=v+"_"+x;if(T[C]===void 0)return typeof A=="number"||typeof A=="boolean"?T[C]=A:T[C]=A.clone(),!0;{let N=T[C];if(typeof A=="number"||typeof A=="boolean"){if(N!==A)return T[C]=A,!0}else if(N.equals(A)===!1)return N.copy(A),!0}return!1}function g(M){let v=M.uniforms,x=0,T=16;for(let C=0,N=v.length;C<N;C++){let b=Array.isArray(v[C])?v[C]:[v[C]];for(let S=0,D=b.length;S<D;S++){let V=b[S],$=Array.isArray(V.value)?V.value:[V.value];for(let Z=0,k=$.length;Z<k;Z++){let H=$[Z],Q=_(H),X=x%T,he=X%Q.boundary,ye=X+he;x+=he,ye!==0&&T-ye<Q.storage&&(x+=T-ye),V.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=x,x+=Q.storage}}}let A=x%T;return A>0&&(x+=T-A),M.__size=x,M.__cache={},this}function _(M){let v={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(v.boundary=4,v.storage=4):M.isVector2?(v.boundary=8,v.storage=8):M.isVector3||M.isColor?(v.boundary=16,v.storage=12):M.isVector4?(v.boundary=16,v.storage=16):M.isMatrix3?(v.boundary=48,v.storage=48):M.isMatrix4?(v.boundary=64,v.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),v}function f(M){let v=M.target;v.removeEventListener("dispose",f);let x=o.indexOf(v.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function d(){for(let M in s)i.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:l,update:c,dispose:d}}var Or=class{constructor(e={}){let{canvas:t=bf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:p=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=o;let g=new Uint32Array(4),_=new Int32Array(4),f=null,d=null,M=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=zi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let x=this,T=!1;this._outputColorSpace=ln;let A=0,C=0,N=null,b=-1,S=null,D=new Nt,V=new Nt,$=null,Z=new je(0),k=0,H=t.width,Q=t.height,X=1,he=null,ye=null,Te=new Nt(0,0,H,Q),$e=new Nt(0,0,H,Q),Qe=!1,st=new Sr,at=!1,ee=!1,ae=new dt,Re=new L,Oe=new Nt,Ie={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},et=!1;function ft(){return N===null?X:1}let I=n;function oe(E,O){return t.getContext(E,O)}try{let E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",W,!1),t.addEventListener("webglcontextrestored",ie,!1),t.addEventListener("webglcontextcreationerror",K,!1),I===null){let O="webgl2";if(I=oe(O,E),I===null)throw oe(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let se,ne,te,xe,ce,me,Ye,Ve,R,y,B,q,re,J,Le,fe,De,Ce,ue,Me,ze,Fe,Se,Ze;function w(){se=new ax(I),se.init(),Fe=new By(I,se),ne=new ex(I,se,e,Fe),te=new Fy(I,se),ne.reversedDepthBuffer&&p&&te.buffers.depth.setReversed(!0),xe=new hx(I),ce=new Sy,me=new Oy(I,se,te,ce,ne,Fe,xe),Ye=new nx(x),Ve=new ox(x),R=new gg(I),Se=new K_(I,R),y=new lx(I,R,xe,Se),B=new dx(I,y,R,xe),ue=new ux(I,ne,me),fe=new tx(ce),q=new My(x,Ye,Ve,se,ne,Se,fe),re=new Vy(x,ce),J=new wy,Le=new Iy(se),Ce=new J_(x,Ye,Ve,te,B,m,l),De=new Ny(x,B,ne),Ze=new Gy(I,xe,ne,te),Me=new Q_(I,se,xe),ze=new cx(I,se,xe),xe.programs=q.programs,x.capabilities=ne,x.extensions=se,x.properties=ce,x.renderLists=J,x.shadowMap=De,x.state=te,x.info=xe}w();let F=new xu(x,I);this.xr=F,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let E=se.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=se.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(E){E!==void 0&&(X=E,this.setSize(H,Q,!1))},this.getSize=function(E){return E.set(H,Q)},this.setSize=function(E,O,Y=!0){if(F.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=E,Q=O,t.width=Math.floor(E*X),t.height=Math.floor(O*X),Y===!0&&(t.style.width=E+"px",t.style.height=O+"px"),this.setViewport(0,0,E,O)},this.getDrawingBufferSize=function(E){return E.set(H*X,Q*X).floor()},this.setDrawingBufferSize=function(E,O,Y){H=E,Q=O,X=Y,t.width=Math.floor(E*Y),t.height=Math.floor(O*Y),this.setViewport(0,0,E,O)},this.getCurrentViewport=function(E){return E.copy(D)},this.getViewport=function(E){return E.copy(Te)},this.setViewport=function(E,O,Y,j){E.isVector4?Te.set(E.x,E.y,E.z,E.w):Te.set(E,O,Y,j),te.viewport(D.copy(Te).multiplyScalar(X).round())},this.getScissor=function(E){return E.copy($e)},this.setScissor=function(E,O,Y,j){E.isVector4?$e.set(E.x,E.y,E.z,E.w):$e.set(E,O,Y,j),te.scissor(V.copy($e).multiplyScalar(X).round())},this.getScissorTest=function(){return Qe},this.setScissorTest=function(E){te.setScissorTest(Qe=E)},this.setOpaqueSort=function(E){he=E},this.setTransparentSort=function(E){ye=E},this.getClearColor=function(E){return E.copy(Ce.getClearColor())},this.setClearColor=function(){Ce.setClearColor(...arguments)},this.getClearAlpha=function(){return Ce.getClearAlpha()},this.setClearAlpha=function(){Ce.setClearAlpha(...arguments)},this.clear=function(E=!0,O=!0,Y=!0){let j=0;if(E){let z=!1;if(N!==null){let pe=N.texture.format;z=pe===Hl||pe===zl||pe===kl}if(z){let pe=N.texture.type,we=pe===ui||pe===us||pe===Pr||pe===Dr||pe===Ol||pe===Bl,Ne=Ce.getClearColor(),Pe=Ce.getClearAlpha(),Ge=Ne.r,qe=Ne.g,Be=Ne.b;we?(g[0]=Ge,g[1]=qe,g[2]=Be,g[3]=Pe,I.clearBufferuiv(I.COLOR,0,g)):(_[0]=Ge,_[1]=qe,_[2]=Be,_[3]=Pe,I.clearBufferiv(I.COLOR,0,_))}else j|=I.COLOR_BUFFER_BIT}O&&(j|=I.DEPTH_BUFFER_BIT),Y&&(j|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",W,!1),t.removeEventListener("webglcontextrestored",ie,!1),t.removeEventListener("webglcontextcreationerror",K,!1),Ce.dispose(),J.dispose(),Le.dispose(),ce.dispose(),Ye.dispose(),Ve.dispose(),B.dispose(),Se.dispose(),Ze.dispose(),q.dispose(),F.dispose(),F.removeEventListener("sessionstart",yt),F.removeEventListener("sessionend",Ae),We.stop()};function W(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function ie(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let E=xe.autoReset,O=De.enabled,Y=De.autoUpdate,j=De.needsUpdate,z=De.type;w(),xe.autoReset=E,De.enabled=O,De.autoUpdate=Y,De.needsUpdate=j,De.type=z}function K(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function G(E){let O=E.target;O.removeEventListener("dispose",G),ge(O)}function ge(E){_e(E),ce.remove(E)}function _e(E){let O=ce.get(E).programs;O!==void 0&&(O.forEach(function(Y){q.releaseProgram(Y)}),E.isShaderMaterial&&q.releaseShaderCache(E))}this.renderBufferDirect=function(E,O,Y,j,z,pe){O===null&&(O=Ie);let we=z.isMesh&&z.matrixWorld.determinant()<0,Ne=gi(E,O,Y,j,z);te.setMaterial(j,we);let Pe=Y.index,Ge=1;if(j.wireframe===!0){if(Pe=y.getWireframeAttribute(Y),Pe===void 0)return;Ge=2}let qe=Y.drawRange,Be=Y.attributes.position,rt=qe.start*Ge,vt=(qe.start+qe.count)*Ge;pe!==null&&(rt=Math.max(rt,pe.start*Ge),vt=Math.min(vt,(pe.start+pe.count)*Ge)),Pe!==null?(rt=Math.max(rt,0),vt=Math.min(vt,Pe.count)):Be!=null&&(rt=Math.max(rt,0),vt=Math.min(vt,Be.count));let Ut=vt-rt;if(Ut<0||Ut===1/0)return;Se.setup(z,j,Ne,Y,Pe);let At,St=Me;if(Pe!==null&&(At=R.get(Pe),St=ze,St.setIndex(At)),z.isMesh)j.wireframe===!0?(te.setLineWidth(j.wireframeLinewidth*ft()),St.setMode(I.LINES)):St.setMode(I.TRIANGLES);else if(z.isLine){let He=j.linewidth;He===void 0&&(He=1),te.setLineWidth(He*ft()),z.isLineSegments?St.setMode(I.LINES):z.isLineLoop?St.setMode(I.LINE_LOOP):St.setMode(I.LINE_STRIP)}else z.isPoints?St.setMode(I.POINTS):z.isSprite&&St.setMode(I.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)xr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),St.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(se.get("WEBGL_multi_draw"))St.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let He=z._multiDrawStarts,Pt=z._multiDrawCounts,ct=z._multiDrawCount,An=Pe?R.get(Pe).bytesPerElement:1,$s=ce.get(j).currentProgram.getUniforms();for(let Rn=0;Rn<ct;Rn++)$s.setValue(I,"_gl_DrawID",Rn),St.render(He[Rn]/An,Pt[Rn])}else if(z.isInstancedMesh)St.renderInstances(rt,Ut,z.count);else if(Y.isInstancedBufferGeometry){let He=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Pt=Math.min(Y.instanceCount,He);St.renderInstances(rt,Ut,Pt)}else St.render(rt,Ut)};function Ee(E,O,Y){E.transparent===!0&&E.side===wi&&E.forceSinglePass===!1?(E.side=gn,E.needsUpdate=!0,tn(E,O,Y),E.side=Oi,E.needsUpdate=!0,tn(E,O,Y),E.side=wi):tn(E,O,Y)}this.compile=function(E,O,Y=null){Y===null&&(Y=E),d=Le.get(Y),d.init(O),v.push(d),Y.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(d.pushLight(z),z.castShadow&&d.pushShadow(z))}),E!==Y&&E.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(d.pushLight(z),z.castShadow&&d.pushShadow(z))}),d.setupLights();let j=new Set;return E.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;let pe=z.material;if(pe)if(Array.isArray(pe))for(let we=0;we<pe.length;we++){let Ne=pe[we];Ee(Ne,Y,z),j.add(Ne)}else Ee(pe,Y,z),j.add(pe)}),d=v.pop(),j},this.compileAsync=function(E,O,Y=null){let j=this.compile(E,O,Y);return new Promise(z=>{function pe(){if(j.forEach(function(we){ce.get(we).currentProgram.isReady()&&j.delete(we)}),j.size===0){z(E);return}setTimeout(pe,10)}se.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let ve=null;function Xe(E){ve&&ve(E)}function yt(){We.stop()}function Ae(){We.start()}let We=new ep;We.setAnimationLoop(Xe),typeof self<"u"&&We.setContext(self),this.setAnimationLoop=function(E){ve=E,F.setAnimationLoop(E),E===null?We.stop():We.start()},F.addEventListener("sessionstart",yt),F.addEventListener("sessionend",Ae),this.render=function(E,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),F.enabled===!0&&F.isPresenting===!0&&(F.cameraAutoUpdate===!0&&F.updateCamera(O),O=F.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,O,N),d=Le.get(E,v.length),d.init(O),v.push(d),ae.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),st.setFromProjectionMatrix(ae,ai,O.reversedDepth),ee=this.localClippingEnabled,at=fe.init(this.clippingPlanes,ee),f=J.get(E,M.length),f.init(),M.push(f),F.enabled===!0&&F.isPresenting===!0){let pe=x.xr.getDepthSensingMesh();pe!==null&&ke(pe,O,-1/0,x.sortObjects)}ke(E,O,0,x.sortObjects),f.finish(),x.sortObjects===!0&&f.sort(he,ye),et=F.enabled===!1||F.isPresenting===!1||F.hasDepthSensing()===!1,et&&Ce.addToRenderList(f,E),this.info.render.frame++,at===!0&&fe.beginShadows();let Y=d.state.shadowsArray;De.render(Y,E,O),at===!0&&fe.endShadows(),this.info.autoReset===!0&&this.info.reset();let j=f.opaque,z=f.transmissive;if(d.setupLights(),O.isArrayCamera){let pe=O.cameras;if(z.length>0)for(let we=0,Ne=pe.length;we<Ne;we++){let Pe=pe[we];jn(j,z,E,Pe)}et&&Ce.render(E);for(let we=0,Ne=pe.length;we<Ne;we++){let Pe=pe[we];pt(f,E,Pe,Pe.viewport)}}else z.length>0&&jn(j,z,E,O),et&&Ce.render(E),pt(f,E,O);N!==null&&C===0&&(me.updateMultisampleRenderTarget(N),me.updateRenderTargetMipmap(N)),E.isScene===!0&&E.onAfterRender(x,E,O),Se.resetDefaultState(),b=-1,S=null,v.pop(),v.length>0?(d=v[v.length-1],at===!0&&fe.setGlobalState(x.clippingPlanes,d.state.camera)):d=null,M.pop(),M.length>0?f=M[M.length-1]:f=null};function ke(E,O,Y,j){if(E.visible===!1)return;if(E.layers.test(O.layers)){if(E.isGroup)Y=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(O);else if(E.isLight)d.pushLight(E),E.castShadow&&d.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||st.intersectsSprite(E)){j&&Oe.setFromMatrixPosition(E.matrixWorld).applyMatrix4(ae);let we=B.update(E),Ne=E.material;Ne.visible&&f.push(E,we,Ne,Y,Oe.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||st.intersectsObject(E))){let we=B.update(E),Ne=E.material;if(j&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Oe.copy(E.boundingSphere.center)):(we.boundingSphere===null&&we.computeBoundingSphere(),Oe.copy(we.boundingSphere.center)),Oe.applyMatrix4(E.matrixWorld).applyMatrix4(ae)),Array.isArray(Ne)){let Pe=we.groups;for(let Ge=0,qe=Pe.length;Ge<qe;Ge++){let Be=Pe[Ge],rt=Ne[Be.materialIndex];rt&&rt.visible&&f.push(E,we,rt,Y,Oe.z,Be)}}else Ne.visible&&f.push(E,we,Ne,Y,Oe.z,null)}}let pe=E.children;for(let we=0,Ne=pe.length;we<Ne;we++)ke(pe[we],O,Y,j)}function pt(E,O,Y,j){let z=E.opaque,pe=E.transmissive,we=E.transparent;d.setupLightsView(Y),at===!0&&fe.setGlobalState(x.clippingPlanes,Y),j&&te.viewport(D.copy(j)),z.length>0&&Jn(z,O,Y),pe.length>0&&Jn(pe,O,Y),we.length>0&&Jn(we,O,Y),te.buffers.depth.setTest(!0),te.buffers.depth.setMask(!0),te.buffers.color.setMask(!0),te.setPolygonOffset(!1)}function jn(E,O,Y,j){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[j.id]===void 0&&(d.state.transmissionRenderTarget[j.id]=new bi(1,1,{generateMipmaps:!0,type:se.has("EXT_color_buffer_half_float")||se.has("EXT_color_buffer_float")?Ir:ui,minFilter:hs,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:lt.workingColorSpace}));let pe=d.state.transmissionRenderTarget[j.id],we=j.viewport||D;pe.setSize(we.z*x.transmissionResolutionScale,we.w*x.transmissionResolutionScale);let Ne=x.getRenderTarget(),Pe=x.getActiveCubeFace(),Ge=x.getActiveMipmapLevel();x.setRenderTarget(pe),x.getClearColor(Z),k=x.getClearAlpha(),k<1&&x.setClearColor(16777215,.5),x.clear(),et&&Ce.render(Y);let qe=x.toneMapping;x.toneMapping=zi;let Be=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),d.setupLightsView(j),at===!0&&fe.setGlobalState(x.clippingPlanes,j),Jn(E,Y,j),me.updateMultisampleRenderTarget(pe),me.updateRenderTargetMipmap(pe),se.has("WEBGL_multisampled_render_to_texture")===!1){let rt=!1;for(let vt=0,Ut=O.length;vt<Ut;vt++){let At=O[vt],St=At.object,He=At.geometry,Pt=At.material,ct=At.group;if(Pt.side===wi&&St.layers.test(j.layers)){let An=Pt.side;Pt.side=gn,Pt.needsUpdate=!0,fn(St,Y,j,He,Pt,ct),Pt.side=An,Pt.needsUpdate=!0,rt=!0}}rt===!0&&(me.updateMultisampleRenderTarget(pe),me.updateRenderTargetMipmap(pe))}x.setRenderTarget(Ne,Pe,Ge),x.setClearColor(Z,k),Be!==void 0&&(j.viewport=Be),x.toneMapping=qe}function Jn(E,O,Y){let j=O.isScene===!0?O.overrideMaterial:null;for(let z=0,pe=E.length;z<pe;z++){let we=E[z],Ne=we.object,Pe=we.geometry,Ge=we.group,qe=we.material;qe.allowOverride===!0&&j!==null&&(qe=j),Ne.layers.test(Y.layers)&&fn(Ne,O,Y,Pe,qe,Ge)}}function fn(E,O,Y,j,z,pe){E.onBeforeRender(x,O,Y,j,z,pe),E.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),z.onBeforeRender(x,O,Y,j,E,pe),z.transparent===!0&&z.side===wi&&z.forceSinglePass===!1?(z.side=gn,z.needsUpdate=!0,x.renderBufferDirect(Y,O,j,z,E,pe),z.side=Oi,z.needsUpdate=!0,x.renderBufferDirect(Y,O,j,z,E,pe),z.side=wi):x.renderBufferDirect(Y,O,j,z,E,pe),E.onAfterRender(x,O,Y,j,z,pe)}function tn(E,O,Y){O.isScene!==!0&&(O=Ie);let j=ce.get(E),z=d.state.lights,pe=d.state.shadowsArray,we=z.state.version,Ne=q.getParameters(E,z.state,pe,O,Y),Pe=q.getProgramCacheKey(Ne),Ge=j.programs;j.environment=E.isMeshStandardMaterial?O.environment:null,j.fog=O.fog,j.envMap=(E.isMeshStandardMaterial?Ve:Ye).get(E.envMap||j.environment),j.envMapRotation=j.environment!==null&&E.envMap===null?O.environmentRotation:E.envMapRotation,Ge===void 0&&(E.addEventListener("dispose",G),Ge=new Map,j.programs=Ge);let qe=Ge.get(Pe);if(qe!==void 0){if(j.currentProgram===qe&&j.lightsStateVersion===we)return mi(E,Ne),qe}else Ne.uniforms=q.getUniforms(E),E.onBeforeCompile(Ne,x),qe=q.acquireProgram(Ne,Pe),Ge.set(Pe,qe),j.uniforms=Ne.uniforms;let Be=j.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Be.clippingPlanes=fe.uniform),mi(E,Ne),j.needsLights=Ws(E),j.lightsStateVersion=we,j.needsLights&&(Be.ambientLightColor.value=z.state.ambient,Be.lightProbe.value=z.state.probe,Be.directionalLights.value=z.state.directional,Be.directionalLightShadows.value=z.state.directionalShadow,Be.spotLights.value=z.state.spot,Be.spotLightShadows.value=z.state.spotShadow,Be.rectAreaLights.value=z.state.rectArea,Be.ltc_1.value=z.state.rectAreaLTC1,Be.ltc_2.value=z.state.rectAreaLTC2,Be.pointLights.value=z.state.point,Be.pointLightShadows.value=z.state.pointShadow,Be.hemisphereLights.value=z.state.hemi,Be.directionalShadowMap.value=z.state.directionalShadowMap,Be.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Be.spotShadowMap.value=z.state.spotShadowMap,Be.spotLightMatrix.value=z.state.spotLightMatrix,Be.spotLightMap.value=z.state.spotLightMap,Be.pointShadowMap.value=z.state.pointShadowMap,Be.pointShadowMatrix.value=z.state.pointShadowMatrix),j.currentProgram=qe,j.uniformsList=null,qe}function sn(E){if(E.uniformsList===null){let O=E.currentProgram.getUniforms();E.uniformsList=Fr.seqWithValue(O.seq,E.uniforms)}return E.uniformsList}function mi(E,O){let Y=ce.get(E);Y.outputColorSpace=O.outputColorSpace,Y.batching=O.batching,Y.batchingColor=O.batchingColor,Y.instancing=O.instancing,Y.instancingColor=O.instancingColor,Y.instancingMorph=O.instancingMorph,Y.skinning=O.skinning,Y.morphTargets=O.morphTargets,Y.morphNormals=O.morphNormals,Y.morphColors=O.morphColors,Y.morphTargetsCount=O.morphTargetsCount,Y.numClippingPlanes=O.numClippingPlanes,Y.numIntersection=O.numClipIntersection,Y.vertexAlphas=O.vertexAlphas,Y.vertexTangents=O.vertexTangents,Y.toneMapping=O.toneMapping}function gi(E,O,Y,j,z){O.isScene!==!0&&(O=Ie),me.resetTextureUnits();let pe=O.fog,we=j.isMeshStandardMaterial?O.environment:null,Ne=N===null?x.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:ws,Pe=(j.isMeshStandardMaterial?Ve:Ye).get(j.envMap||we),Ge=j.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,qe=!!Y.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),Be=!!Y.morphAttributes.position,rt=!!Y.morphAttributes.normal,vt=!!Y.morphAttributes.color,Ut=zi;j.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(Ut=x.toneMapping);let At=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,St=At!==void 0?At.length:0,He=ce.get(j),Pt=d.state.lights;if(at===!0&&(ee===!0||E!==S)){let pn=E===S&&j.id===b;fe.setState(j,E,pn)}let ct=!1;j.version===He.__version?(He.needsLights&&He.lightsStateVersion!==Pt.state.version||He.outputColorSpace!==Ne||z.isBatchedMesh&&He.batching===!1||!z.isBatchedMesh&&He.batching===!0||z.isBatchedMesh&&He.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&He.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&He.instancing===!1||!z.isInstancedMesh&&He.instancing===!0||z.isSkinnedMesh&&He.skinning===!1||!z.isSkinnedMesh&&He.skinning===!0||z.isInstancedMesh&&He.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&He.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&He.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&He.instancingMorph===!1&&z.morphTexture!==null||He.envMap!==Pe||j.fog===!0&&He.fog!==pe||He.numClippingPlanes!==void 0&&(He.numClippingPlanes!==fe.numPlanes||He.numIntersection!==fe.numIntersection)||He.vertexAlphas!==Ge||He.vertexTangents!==qe||He.morphTargets!==Be||He.morphNormals!==rt||He.morphColors!==vt||He.toneMapping!==Ut||He.morphTargetsCount!==St)&&(ct=!0):(ct=!0,He.__version=j.version);let An=He.currentProgram;ct===!0&&(An=tn(j,O,z));let $s=!1,Rn=!1,Xr=!1,It=An.getUniforms(),Bn=He.uniforms;if(te.useProgram(An.program)&&($s=!0,Rn=!0,Xr=!0),j.id!==b&&(b=j.id,Rn=!0),$s||S!==E){te.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),It.setValue(I,"projectionMatrix",E.projectionMatrix),It.setValue(I,"viewMatrix",E.matrixWorldInverse);let bn=It.map.cameraPosition;bn!==void 0&&bn.setValue(I,Re.setFromMatrixPosition(E.matrixWorld)),ne.logarithmicDepthBuffer&&It.setValue(I,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&It.setValue(I,"isOrthographic",E.isOrthographicCamera===!0),S!==E&&(S=E,Rn=!0,Xr=!0)}if(z.isSkinnedMesh){It.setOptional(I,z,"bindMatrix"),It.setOptional(I,z,"bindMatrixInverse");let pn=z.skeleton;pn&&(pn.boneTexture===null&&pn.computeBoneTexture(),It.setValue(I,"boneTexture",pn.boneTexture,me))}z.isBatchedMesh&&(It.setOptional(I,z,"batchingTexture"),It.setValue(I,"batchingTexture",z._matricesTexture,me),It.setOptional(I,z,"batchingIdTexture"),It.setValue(I,"batchingIdTexture",z._indirectTexture,me),It.setOptional(I,z,"batchingColorTexture"),z._colorsTexture!==null&&It.setValue(I,"batchingColorTexture",z._colorsTexture,me));let kn=Y.morphAttributes;if((kn.position!==void 0||kn.normal!==void 0||kn.color!==void 0)&&ue.update(z,Y,An),(Rn||He.receiveShadow!==z.receiveShadow)&&(He.receiveShadow=z.receiveShadow,It.setValue(I,"receiveShadow",z.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&(Bn.envMap.value=Pe,Bn.flipEnvMap.value=Pe.isCubeTexture&&Pe.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&O.environment!==null&&(Bn.envMapIntensity.value=O.environmentIntensity),Rn&&(It.setValue(I,"toneMappingExposure",x.toneMappingExposure),He.needsLights&&Pi(Bn,Xr),pe&&j.fog===!0&&re.refreshFogUniforms(Bn,pe),re.refreshMaterialUniforms(Bn,j,X,Q,d.state.transmissionRenderTarget[E.id]),Fr.upload(I,sn(He),Bn,me)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(Fr.upload(I,sn(He),Bn,me),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&It.setValue(I,"center",z.center),It.setValue(I,"modelViewMatrix",z.modelViewMatrix),It.setValue(I,"normalMatrix",z.normalMatrix),It.setValue(I,"modelMatrix",z.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){let pn=j.uniformsGroups;for(let bn=0,Fc=pn.length;bn<Fc;bn++){let ms=pn[bn];Ze.update(ms,An),Ze.bind(ms,An)}}return An}function Pi(E,O){E.ambientLightColor.needsUpdate=O,E.lightProbe.needsUpdate=O,E.directionalLights.needsUpdate=O,E.directionalLightShadows.needsUpdate=O,E.pointLights.needsUpdate=O,E.pointLightShadows.needsUpdate=O,E.spotLights.needsUpdate=O,E.spotLightShadows.needsUpdate=O,E.rectAreaLights.needsUpdate=O,E.hemisphereLights.needsUpdate=O}function Ws(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(E,O,Y){let j=ce.get(E);j.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,j.__autoAllocateDepthBuffer===!1&&(j.__useRenderToTexture=!1),ce.get(E.texture).__webglTexture=O,ce.get(E.depthTexture).__webglTexture=j.__autoAllocateDepthBuffer?void 0:Y,j.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,O){let Y=ce.get(E);Y.__webglFramebuffer=O,Y.__useDefaultFramebuffer=O===void 0};let wp=I.createFramebuffer();this.setRenderTarget=function(E,O=0,Y=0){N=E,A=O,C=Y;let j=!0,z=null,pe=!1,we=!1;if(E){let Pe=ce.get(E);if(Pe.__useDefaultFramebuffer!==void 0)te.bindFramebuffer(I.FRAMEBUFFER,null),j=!1;else if(Pe.__webglFramebuffer===void 0)me.setupRenderTarget(E);else if(Pe.__hasExternalTextures)me.rebindTextures(E,ce.get(E.texture).__webglTexture,ce.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let Be=E.depthTexture;if(Pe.__boundDepthTexture!==Be){if(Be!==null&&ce.has(Be)&&(E.width!==Be.image.width||E.height!==Be.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");me.setupDepthRenderbuffer(E)}}let Ge=E.texture;(Ge.isData3DTexture||Ge.isDataArrayTexture||Ge.isCompressedArrayTexture)&&(we=!0);let qe=ce.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(qe[O])?z=qe[O][Y]:z=qe[O],pe=!0):E.samples>0&&me.useMultisampledRTT(E)===!1?z=ce.get(E).__webglMultisampledFramebuffer:Array.isArray(qe)?z=qe[Y]:z=qe,D.copy(E.viewport),V.copy(E.scissor),$=E.scissorTest}else D.copy(Te).multiplyScalar(X).floor(),V.copy($e).multiplyScalar(X).floor(),$=Qe;if(Y!==0&&(z=wp),te.bindFramebuffer(I.FRAMEBUFFER,z)&&j&&te.drawBuffers(E,z),te.viewport(D),te.scissor(V),te.setScissorTest($),pe){let Pe=ce.get(E.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+O,Pe.__webglTexture,Y)}else if(we){let Pe=O;for(let Ge=0;Ge<E.textures.length;Ge++){let qe=ce.get(E.textures[Ge]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Ge,qe.__webglTexture,Y,Pe)}}else if(E!==null&&Y!==0){let Pe=ce.get(E.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Pe.__webglTexture,Y)}b=-1},this.readRenderTargetPixels=function(E,O,Y,j,z,pe,we,Ne=0){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pe=ce.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&we!==void 0&&(Pe=Pe[we]),Pe){te.bindFramebuffer(I.FRAMEBUFFER,Pe);try{let Ge=E.textures[Ne],qe=Ge.format,Be=Ge.type;if(!ne.textureFormatReadable(qe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ne.textureTypeReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=E.width-j&&Y>=0&&Y<=E.height-z&&(E.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Ne),I.readPixels(O,Y,j,z,Fe.convert(qe),Fe.convert(Be),pe))}finally{let Ge=N!==null?ce.get(N).__webglFramebuffer:null;te.bindFramebuffer(I.FRAMEBUFFER,Ge)}}},this.readRenderTargetPixelsAsync=async function(E,O,Y,j,z,pe,we,Ne=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pe=ce.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&we!==void 0&&(Pe=Pe[we]),Pe)if(O>=0&&O<=E.width-j&&Y>=0&&Y<=E.height-z){te.bindFramebuffer(I.FRAMEBUFFER,Pe);let Ge=E.textures[Ne],qe=Ge.format,Be=Ge.type;if(!ne.textureFormatReadable(qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ne.textureTypeReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let rt=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,rt),I.bufferData(I.PIXEL_PACK_BUFFER,pe.byteLength,I.STREAM_READ),E.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Ne),I.readPixels(O,Y,j,z,Fe.convert(qe),Fe.convert(Be),0);let vt=N!==null?ce.get(N).__webglFramebuffer:null;te.bindFramebuffer(I.FRAMEBUFFER,vt);let Ut=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Mf(I,Ut,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,rt),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,pe),I.deleteBuffer(rt),I.deleteSync(Ut),pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,O=null,Y=0){let j=Math.pow(2,-Y),z=Math.floor(E.image.width*j),pe=Math.floor(E.image.height*j),we=O!==null?O.x:0,Ne=O!==null?O.y:0;me.setTexture2D(E,0),I.copyTexSubImage2D(I.TEXTURE_2D,Y,0,0,we,Ne,z,pe),te.unbindTexture()};let Tp=I.createFramebuffer(),Ap=I.createFramebuffer();this.copyTextureToTexture=function(E,O,Y=null,j=null,z=0,pe=null){pe===null&&(z!==0?(xr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),pe=z,z=0):pe=0);let we,Ne,Pe,Ge,qe,Be,rt,vt,Ut,At=E.isCompressedTexture?E.mipmaps[pe]:E.image;if(Y!==null)we=Y.max.x-Y.min.x,Ne=Y.max.y-Y.min.y,Pe=Y.isBox3?Y.max.z-Y.min.z:1,Ge=Y.min.x,qe=Y.min.y,Be=Y.isBox3?Y.min.z:0;else{let kn=Math.pow(2,-z);we=Math.floor(At.width*kn),Ne=Math.floor(At.height*kn),E.isDataArrayTexture?Pe=At.depth:E.isData3DTexture?Pe=Math.floor(At.depth*kn):Pe=1,Ge=0,qe=0,Be=0}j!==null?(rt=j.x,vt=j.y,Ut=j.z):(rt=0,vt=0,Ut=0);let St=Fe.convert(O.format),He=Fe.convert(O.type),Pt;O.isData3DTexture?(me.setTexture3D(O,0),Pt=I.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(me.setTexture2DArray(O,0),Pt=I.TEXTURE_2D_ARRAY):(me.setTexture2D(O,0),Pt=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,O.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,O.unpackAlignment);let ct=I.getParameter(I.UNPACK_ROW_LENGTH),An=I.getParameter(I.UNPACK_IMAGE_HEIGHT),$s=I.getParameter(I.UNPACK_SKIP_PIXELS),Rn=I.getParameter(I.UNPACK_SKIP_ROWS),Xr=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,At.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,At.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ge),I.pixelStorei(I.UNPACK_SKIP_ROWS,qe),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Be);let It=E.isDataArrayTexture||E.isData3DTexture,Bn=O.isDataArrayTexture||O.isData3DTexture;if(E.isDepthTexture){let kn=ce.get(E),pn=ce.get(O),bn=ce.get(kn.__renderTarget),Fc=ce.get(pn.__renderTarget);te.bindFramebuffer(I.READ_FRAMEBUFFER,bn.__webglFramebuffer),te.bindFramebuffer(I.DRAW_FRAMEBUFFER,Fc.__webglFramebuffer);for(let ms=0;ms<Pe;ms++)It&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ce.get(E).__webglTexture,z,Be+ms),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ce.get(O).__webglTexture,pe,Ut+ms)),I.blitFramebuffer(Ge,qe,we,Ne,rt,vt,we,Ne,I.DEPTH_BUFFER_BIT,I.NEAREST);te.bindFramebuffer(I.READ_FRAMEBUFFER,null),te.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(z!==0||E.isRenderTargetTexture||ce.has(E)){let kn=ce.get(E),pn=ce.get(O);te.bindFramebuffer(I.READ_FRAMEBUFFER,Tp),te.bindFramebuffer(I.DRAW_FRAMEBUFFER,Ap);for(let bn=0;bn<Pe;bn++)It?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,kn.__webglTexture,z,Be+bn):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,kn.__webglTexture,z),Bn?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,pn.__webglTexture,pe,Ut+bn):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,pn.__webglTexture,pe),z!==0?I.blitFramebuffer(Ge,qe,we,Ne,rt,vt,we,Ne,I.COLOR_BUFFER_BIT,I.NEAREST):Bn?I.copyTexSubImage3D(Pt,pe,rt,vt,Ut+bn,Ge,qe,we,Ne):I.copyTexSubImage2D(Pt,pe,rt,vt,Ge,qe,we,Ne);te.bindFramebuffer(I.READ_FRAMEBUFFER,null),te.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else Bn?E.isDataTexture||E.isData3DTexture?I.texSubImage3D(Pt,pe,rt,vt,Ut,we,Ne,Pe,St,He,At.data):O.isCompressedArrayTexture?I.compressedTexSubImage3D(Pt,pe,rt,vt,Ut,we,Ne,Pe,St,At.data):I.texSubImage3D(Pt,pe,rt,vt,Ut,we,Ne,Pe,St,He,At):E.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,pe,rt,vt,we,Ne,St,He,At.data):E.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,pe,rt,vt,At.width,At.height,St,At.data):I.texSubImage2D(I.TEXTURE_2D,pe,rt,vt,we,Ne,St,He,At);I.pixelStorei(I.UNPACK_ROW_LENGTH,ct),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,An),I.pixelStorei(I.UNPACK_SKIP_PIXELS,$s),I.pixelStorei(I.UNPACK_SKIP_ROWS,Rn),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Xr),pe===0&&O.generateMipmaps&&I.generateMipmap(Pt),te.unbindTexture()},this.initRenderTarget=function(E){ce.get(E).__webglFramebuffer===void 0&&me.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?me.setTextureCube(E,0):E.isData3DTexture?me.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?me.setTexture2DArray(E,0):me.setTexture2D(E,0),te.unbindTexture()},this.resetState=function(){A=0,C=0,N=null,te.reset(),Se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ai}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=lt._getDrawingBufferColorSpace(e),t.unpackColorSpace=lt._getUnpackColorSpace()}};function op(i,e,t){let n=new Or({alpha:!0,antialias:!0});n.setPixelRatio(Math.min(devicePixelRatio,2)),n.setSize(112,112),i.prepend(n.domElement);let s=n.domElement;s.tabIndex=0,s.setAttribute("role","img"),s.setAttribute("aria-label","View cube: click a face, edge or corner; drag to rotate. Arrow keys rotate, Home restores perspective. / \u89C6\u56FE\u7ACB\u65B9\u4F53\uFF1A\u70B9\u51FB\u9762\u3001\u8FB9\u3001\u89D2\u6216\u62D6\u52A8\u65CB\u8F6C");let r=new As,o=new Kt(32,1,.1,20);o.up.set(0,0,1);let a=["RIGHT","LEFT","BACK","FRONT","TOP","BOTTOM"],l=["\u53F3","\u5DE6","\u540E","\u524D","\u9876","\u5E95"],c="",h=a.map(()=>{let v=document.createElement("canvas");return v.width=v.height=128,new ss(v)}),u=h.map(v=>new hn({map:v})),p=new _t(new kt(1,1,1),u);r.add(p),r.add(new Bi(new Rs(p.geometry),new Dn({color:14795132})));let m=new Ho,g=new le,_=null,f=!1;function d(v){let x=e.position.distanceTo(t.target);e.position.copy(t.target).add(v.normalize().multiplyScalar(x)),e.lookAt(t.target),t.update()}function M(v,x){let T=new as().setFromVector3(e.position.clone().sub(t.target).applyAxisAngle(new L(1,0,0),-Math.PI/2));T.theta-=v,T.phi=Math.max(.001,Math.min(Math.PI-.001,T.phi+x)),d(new L().setFromSpherical(T).applyAxisAngle(new L(1,0,0),Math.PI/2))}return s.addEventListener("pointerdown",v=>{_={x:v.clientX,y:v.clientY,lastX:v.clientX,lastY:v.clientY},f=!1,s.setPointerCapture(v.pointerId)}),s.addEventListener("pointermove",v=>{_&&(Math.hypot(v.clientX-_.x,v.clientY-_.y)>4&&(f=!0),f&&M((v.clientX-_.lastX)*.012,(v.clientY-_.lastY)*.012),_.lastX=v.clientX,_.lastY=v.clientY)}),s.addEventListener("pointerup",v=>{if(_){if(!f){let x=s.getBoundingClientRect();g.set((v.clientX-x.left)/x.width*2-1,-(v.clientY-x.top)/x.height*2+1),m.setFromCamera(g,o);let T=m.intersectObject(p)[0];if(T){let A=T.point,C=new L(...[A.x,A.y,A.z].map(N=>Math.abs(N)>.34?Math.sign(N):0));Math.abs(C.z)===1&&C.x===0&&C.y===0&&(C.y=-.001),d(C)}}_=null}}),s.addEventListener("pointercancel",()=>{_=null}),s.addEventListener("keydown",v=>{["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","Enter"].includes(v.key)&&(v.preventDefault(),v.key==="Home"?d(new L(430,-645,445)):v.key==="Enter"?d(new L(0,-1,0)):M(v.key==="ArrowLeft"?Math.PI/2:v.key==="ArrowRight"?-Math.PI/2:0,v.key==="ArrowUp"?-.35:v.key==="ArrowDown"?.35:0))}),{update(){c!==document.documentElement.lang&&(c=document.documentElement.lang,h.forEach((v,x)=>{let T=v.image.getContext("2d");T.fillStyle="#304878",T.fillRect(0,0,128,128),T.strokeStyle="#e1c17c",T.lineWidth=5,T.strokeRect(3,3,122,122),T.fillStyle="#fff1cc",T.font="bold 21px Segoe UI",T.textAlign="center",T.textBaseline="middle",T.fillText(c==="zh"?l[x]:a[x],64,64),v.needsUpdate=!0})),o.position.copy(e.position).sub(t.target).normalize().multiplyScalar(3.6),o.lookAt(0,0,0),n.render(r,o)}}}var ap={type:"change"},bu={type:"start"},cp={type:"end"},bc=new ns,lp=new Gn,Wy=Math.cos(70*Kh.DEG2RAD),Yt=new L,wn=2*Math.PI,bt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},vu=1e-6,Mc=class extends Wo{constructor(e,t=null){super(e,t),this.state=bt.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ls.ROTATE,MIDDLE:ls.DOLLY,RIGHT:ls.PAN},this.touches={ONE:cs.ROTATE,TWO:cs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new $n,this._lastTargetPosition=new L,this._quat=new $n().setFromUnitVectors(e.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new as,this._sphericalDelta=new as,this._scale=1,this._panOffset=new L,this._rotateStart=new le,this._rotateEnd=new le,this._rotateDelta=new le,this._panStart=new le,this._panEnd=new le,this._panDelta=new le,this._dollyStart=new le,this._dollyEnd=new le,this._dollyDelta=new le,this._dollyDirection=new L,this._mouse=new le,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Xy.bind(this),this._onPointerDown=$y.bind(this),this._onPointerUp=qy.bind(this),this._onContextMenu=ev.bind(this),this._onMouseWheel=jy.bind(this),this._onKeyDown=Jy.bind(this),this._onTouchStart=Ky.bind(this),this._onTouchMove=Qy.bind(this),this._onMouseDown=Yy.bind(this),this._onMouseMove=Zy.bind(this),this._interceptControlDown=tv.bind(this),this._interceptControlUp=nv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(ap),this.update(),this.state=bt.NONE}update(e=null){let t=this.object.position;Yt.copy(t).sub(this.target),Yt.applyQuaternion(this._quat),this._spherical.setFromVector3(Yt),this.autoRotate&&this.state===bt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=wn:n>Math.PI&&(n-=wn),s<-Math.PI?s+=wn:s>Math.PI&&(s-=wn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Yt.setFromSpherical(this._spherical),Yt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Yt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Yt.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new L(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new L(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Yt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(bc.origin.copy(this.object.position),bc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(bc.direction))<Wy?this.object.lookAt(this.target):(lp.setFromNormalAndCoplanarPoint(this.object.up,this.target),bc.intersectPlane(lp,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>vu||8*(1-this._lastQuaternion.dot(this.object.quaternion))>vu||this._lastTargetPosition.distanceToSquared(this.target)>vu?(this.dispatchEvent(ap),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?wn/60*this.autoRotateSpeed*e:wn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Yt.setFromMatrixColumn(t,0),Yt.multiplyScalar(-e),this._panOffset.add(Yt)}_panUp(e,t){this.screenSpacePanning===!0?Yt.setFromMatrixColumn(t,1):(Yt.setFromMatrixColumn(t,0),Yt.crossVectors(this.object.up,Yt)),Yt.multiplyScalar(e),this._panOffset.add(Yt)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Yt.copy(s).sub(this.target);let r=Yt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(wn*this._rotateDelta.x/t.clientHeight),this._rotateUp(wn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(wn*this._rotateDelta.x/t.clientHeight),this._rotateUp(wn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new le,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function $y(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function Xy(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function qy(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(cp),this.state=bt.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Yy(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ls.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=bt.DOLLY;break;case ls.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=bt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=bt.ROTATE}break;case ls.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=bt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=bt.PAN}break;default:this.state=bt.NONE}this.state!==bt.NONE&&this.dispatchEvent(bu)}function Zy(i){switch(this.state){case bt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case bt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case bt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function jy(i){this.enabled===!1||this.enableZoom===!1||this.state!==bt.NONE||(i.preventDefault(),this.dispatchEvent(bu),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(cp))}function Jy(i){this.enabled!==!1&&this._handleKeyDown(i)}function Ky(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case cs.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=bt.TOUCH_ROTATE;break;case cs.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=bt.TOUCH_PAN;break;default:this.state=bt.NONE}break;case 2:switch(this.touches.TWO){case cs.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=bt.TOUCH_DOLLY_PAN;break;case cs.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=bt.TOUCH_DOLLY_ROTATE;break;default:this.state=bt.NONE}break;default:this.state=bt.NONE}this.state!==bt.NONE&&this.dispatchEvent(bu)}function Qy(i){switch(this._trackPointer(i),this.state){case bt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case bt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case bt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case bt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=bt.NONE}}function ev(i){this.enabled!==!1&&i.preventDefault()}function tv(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function nv(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function hp(i){let e=new As;e.background=new je("#143451"),e.fog=new bo("#143451",1e3,2200);let t=new Kt(36,1,1,3e3);t.up.set(0,0,1),t.position.set(500,-630,480);let n=new Or({antialias:!0,alpha:!1});n.setPixelRatio(Math.min(devicePixelRatio,2)),n.shadowMap.enabled=!0,n.shadowMap.type=wl,n.outputColorSpace=ln,i.prepend(n.domElement),n.domElement.setAttribute("aria-label","Interactive 3D robot arm. Joint angles and tool coordinates are available in the controls.");let s=new Mc(t,n.domElement);s.target.set(55,0,90),s.enableDamping=!0,s.minDistance=350,s.maxDistance=1600,s.maxPolarAngle=Math.PI-.001,e.add(new Bo(16777215,6584993,2.5));let r=new zo(16777215,3);r.position.set(-200,-300,650),r.castShadow=!0,r.shadow.mapSize.set(2048,2048),Object.assign(r.shadow.camera,{left:-500,right:500,top:500,bottom:-500,near:1,far:1200}),r.shadow.bias=-.001,e.add(r);let o={body:new En({color:15790836,roughness:.34,metalness:.16}),joint:new En({color:14804457,roughness:.32,metalness:.24}),accent:new En({color:16021281,roughness:.38,metalness:.12}),metal:new En({color:3752526,metalness:.65,roughness:.3})};function a(w,F){let W=new _t(w,F);return W.castShadow=!0,W.receiveShadow=!0,e.add(W),W}let l=a(new Ps(3e3,3e3),new En({color:2312550,roughness:1}));l.position.z=-2;let c=new Vo(900,18,9149092,4548480);c.rotation.x=Math.PI/2,c.position.z=.1,e.add(c);let h=w=>new L(...w);function u(w,F){let W=new is(new Et().setFromPoints(w.map(h)),new Dn({color:F}));return e.add(W),W}u([[0,0,1],[360,0,1]],11954256),u([[0,0,1],[0,360,1]],5801579),u([[0,0,0],[0,0,340]],7574969);function p(w,F,W){let ie=document.createElement("canvas");ie.width=128,ie.height=64;let K=ie.getContext("2d");K.font="600 36px Segoe UI",K.fillStyle=F,K.textAlign="center",K.fillText(w,64,44);let G=new So(new Mr({map:new ss(ie),depthTest:!1}));return G.position.copy(h(W)),G.scale.set(50,25,1),e.add(G),G}p("X","#a66552",[385,0,5]),p("Y","#54795c",[0,385,5]),p("Z","#597c9a",[0,0,360]);let m=a(new Ft(47,49,10,64),o.metal);m.rotation.x=Math.PI/2,m.position.z=5;let g=a(new Ft(27,32,30,48),o.body);g.rotation.x=Math.PI/2,g.position.z=25;let _=a(new Ft(29,29,6,48),o.metal);_.rotation.x=Math.PI/2,_.position.z=43;let f=new cn;e.add(f);let d=new wr;d.moveTo(-15,44),d.lineTo(15,44),d.lineTo(15,70),d.absarc(0,70,15,0,Math.PI,!1),d.lineTo(-15,44);for(let w of[-1,1]){let F=new _t(new No(d,{depth:8,bevelEnabled:!0,bevelThickness:.6,bevelSize:.6,bevelSegments:2,steps:1,curveSegments:24}),o.body);F.rotation.x=Math.PI/2,F.position.y=w*27+4,F.castShadow=!0,f.add(F);let W=new _t(new Ft(9,9,10,32),o.metal);W.position.set(0,w*22,70),f.add(W);let ie=new _t(new Ft(10,10,2,32),o.accent);ie.position.set(0,w*32.5,70),f.add(ie)}let M=a(new Ft(32.5,32.5,5,48),o.accent);M.rotation.x=Math.PI/2,M.position.z=15;for(let w=0;w<6;w++){let F=w*Math.PI/3,W=a(new Ft(2.6,2.6,2,6),o.metal);W.rotation.x=Math.PI/2,W.position.set(41*Math.cos(F),41*Math.sin(F),11)}let v=[],x=[],T=[],A=0;function C(w){if(A!==w){for(let F of[...v,...x,...T])e.remove(F),F.traverse(W=>W.geometry?.dispose());A=w,v=Array.from({length:w-1},(F,W)=>{let ie=Math.max(9,18-W*2);return a(new Uo([[0,-.5],[ie*.8,-.5],[ie,-.46],[ie,.46],[ie*.8,.5],[0,.5]].map(([K,G])=>new le(K,G)),48),o.body)}),x=Array.from({length:w-1},(F,W)=>a(new Ft(Math.max(13,23-W*2),Math.max(13,23-W*2),W<2?39:29,32),o.joint)),T=Array.from({length:w-1},(F,W)=>{let ie=Math.max(13,23-W*2)-2,K=W<2?40:30,G=a(new Ft(ie,ie,K,48),o.accent);for(let ge of[-1,1]){let _e=new _t(new Ft(ie*.73,ie*.73,1.2,48),o.joint);_e.position.y=ge*(K/2+.6),_e.castShadow=!0,G.add(_e);for(let Ee=0;Ee<4;Ee++){let ve=Ee*Math.PI/2+Math.PI/4,Xe=new _t(new Ft(1.2,1.2,1.5,6),o.metal);Xe.position.set(ie*.51*Math.cos(ve),ge*(K/2+1.3),ie*.51*Math.sin(ve)),G.add(Xe)}}return G}),et.scale.setScalar(oa(w)/300),q=[],B.geometry.dispose(),B.geometry=new Et,ze("iso"),n.domElement.dataset.joints=String(w)}}let N=a(new Xn(3,12,8),o.accent),b=new cn;e.add(b);let S=[],D="",V=!1,$=[],Z=tt(Cn.home),k=new En({color:6582400,roughness:.35,metalness:.65}),H=new En({color:2107185,roughness:.95}),Q=null;function X(w){D="gripper";function F(K,G,ge){let _e=new _t(K,G);return _e.position.set(...ge),_e.castShadow=!0,b.add(_e),_e}let W=F(new Ft(13,13,4,32),k,[0,0,38]);W.rotation.x=Math.PI/2;let ie=F(new Ft(7,7,8,20),k,[0,0,32]);ie.rotation.x=Math.PI/2,F(new kt(22,54,12),k,[0,0,23]);for(let K of[-1,1]){let G=F(new kt(12,6,32),H,[0,K*26,3]);G.userData.sign=K,S.push(G)}}X("gripper");let he=null,ye=new cn;e.add(ye);let Te=new hn({color:16768837,depthTest:!1}),$e=Array.from({length:12},()=>{let w=new _t(new Ft(1.8,1.8,1,8),Te);return w.renderOrder=11,ye.add(w),w}),Qe=new _t(new kt(1,1,1),new hn({color:16768837,transparent:!0,opacity:.12,depthTest:!1,depthWrite:!1}));Qe.renderOrder=10,ye.add(Qe);let st=p("A","#10203b",[0,0,0]);st.scale.set(36,18,1);let at=st.material.map.image,ee=at.getContext("2d");ee.fillStyle="#ffdf45",ee.fillRect(0,0,128,64),ee.fillStyle="#10203b",ee.font="bold 48px Segoe UI",ee.textAlign="center",ee.fillText("A",64,49),st.material.map.needsUpdate=!0,st.renderOrder=12,st.visible=!1;function ae(){let w={base:g,j1:g,j2:x[0],j3:x[1],j4:x[2],j5:x[3],j6:x[4],joint:x[0],link:v[0],tool:b,tcp:N}[he];if(ye.visible=!!w,st.visible=!1,!w)return;w.updateWorldMatrix(!0,!0);let F=new Mi().setFromObject(w).expandByScalar(6),W=F.getCenter(new L),ie=F.getSize(new L);Qe.position.copy(W),Qe.scale.copy(ie);let K=0;for(let G=0;G<3;G++)for(let ge of[0,1])for(let _e of[0,1]){let Ee=F.min.clone(),ve=F.min.clone(),Xe=[0,1,2].filter(Ae=>Ae!==G);Ee.setComponent(Xe[0],ge?F.max.getComponent(Xe[0]):F.min.getComponent(Xe[0])),Ee.setComponent(Xe[1],_e?F.max.getComponent(Xe[1]):F.min.getComponent(Xe[1])),ve.copy(Ee),ve.setComponent(G,F.max.getComponent(G));let yt=$e[K++];yt.position.copy(Ee).add(ve).multiplyScalar(.5),yt.scale.y=Ee.distanceTo(ve),yt.quaternion.setFromUnitVectors(new L(0,1,0),ve.sub(Ee).normalize())}st.position.set(W.x,W.y,F.max.z+16)}let Re=new Go(20);e.add(Re);let Oe=u([[0,0,0],[0,0,0]],9742222),Ie=a(new Ar(13,1.4,8,40),o.accent);Ie.position.z=1;let et=a(new Xn(300,36,20),new hn({color:7509604,wireframe:!0,transparent:!0,opacity:.065,depthWrite:!1}));et.position.z=Cn.base,et.visible=!1;let ft="",I=[],oe=[],se=[];function ne(w){let F=document.createElement("canvas");F.width=384,F.height=144;let W=F.getContext("2d");W.fillStyle="#102a42",W.fillRect(0,0,F.width,F.height),W.textAlign="center",W.fillStyle="#ffe4ae",W.font="bold 58px Segoe UI",W.fillText(w.id,192,58),W.font="bold 33px Segoe UI",W.fillText(w.size.join(" \xD7 ")+" mm",192,112);let ie=new ss(F);return ie.colorSpace=ln,ie}let te=[15056245,14260564,7387606,5475245,11651551,9480649];function xe(){for(let w of I){e.remove(w),w.geometry?.dispose();for(let F of Array.isArray(w.material)?w.material:[w.material])F?.map?.dispose(),F?.dispose()}I=[],oe=[],se=[]}function ce(w){if(V=w.output,$=w.objects,ft!==w.mode){let yt=function(Ae,We,ke){let pt=a(new kt(...Ae),new En({color:ke,roughness:.65}));return pt.position.set(...We),I.push(pt),pt};var ie=yt;xe(),ft=w.mode;let[ge,_e]=w.size,[Ee,ve]=w.origin,Xe=w.deck;if(w.mode==="shelf"){for(let Ae of w.solids)yt(Ae.max.map((We,ke)=>We-Ae.min[ke]),Ae.max.map((We,ke)=>(We+Ae.min[ke])/2),6652827);for(let Ae of w.cells){let We=p(Ae.id,"#ffe3a5",[(Ae.min[0]+Ae.max[0])/2,66,Ae.min[2]+7]);We.scale.set(24,12,1),I.push(We)}}else{yt([ge+8,_e+8,8],[Ee+ge/2,ve+_e/2,Xe-4],11648976),yt([30,_e+8,42],[Ee+ge+23,ve+_e/2,23],3696523),yt([2,_e-10,18],[Ee+ge+39,ve+_e/2,30],11457249);for(let Ae of[Ee+20,Ee+ge-15])for(let We of[ve-5,ve+_e+5]){let ke=a(new Ft(10,10,8,24),o.metal);ke.position.set(Ae,We,8),I.push(ke)}for(let Ae=0;Ae<=ge;Ae+=20)I.push(u([[Ee+Ae,ve,Xe+.2],[Ee+Ae,ve+_e,Xe+.2]],5401221));for(let Ae=0;Ae<=_e;Ae+=20)I.push(u([[Ee,ve+Ae,Xe+.2],[Ee+ge,ve+Ae,Xe+.2]],5401221));I.push(u([[Ee,ve,Xe+.4],[Ee+ge,ve,Xe+.4],[Ee+ge,ve+_e,Xe+.4],[Ee,ve+_e,Xe+.4],[Ee,ve,Xe+.4]],16766090))}if(w.person){let ke=function(fn,tn,sn){let mi=a(fn,new En({color:tn,roughness:.7}));return mi.position.set(Ae+sn[0],We+sn[1],sn[2]),I.push(mi),mi},pt=function(fn,tn,sn,mi){let gi=h(fn),Pi=h(tn);ke(new Ft(sn,sn,gi.distanceTo(Pi),16),mi,gi.clone().add(Pi).multiplyScalar(.5).toArray()).quaternion.setFromUnitVectors(new L(0,1,0),Pi.sub(gi).normalize())};var K=ke,G=pt;let[Ae,We]=w.person.center;for(let fn of[-1,1])pt([fn*6,0,35],[fn*8,0,7],4,3301764),ke(new kt(10,15,6),2701381,[fn*8,-3,3]),pt([fn*11,0,61],[fn*17,-1,39],3.6,14925204),ke(new Xn(4,12,8),14925204,[fn*17,-1,36]);ke(new Xn(1,20,16),15056245,[0,0,51]).scale.set(12,7,17),ke(new kt(20,12,9),3301764,[0,0,32]),pt([0,0,65],[0,0,70],3.5,14925204),ke(new Xn(7,20,16),14925204,[0,0,76]),ke(new Xn(1,20,12),15784354,[0,0,81]).scale.set(8,8,4),ke(new kt(23,1,3),16051662,[0,-7,50]);for(let fn of w.solids){let{min:tn,max:sn}=fn,mi=sn.map((Pi,Ws)=>Pi-tn[Ws]),gi=new Bi(new Rs(new kt(...mi)),new Rr({color:16760695,dashSize:4,gapSize:3,transparent:!0,opacity:.65}));gi.position.set(...sn.map((Pi,Ws)=>(Pi+tn[Ws])/2)),gi.computeLineDistances(),e.add(gi),I.push(gi),I.push(u([[tn[0],tn[1],1],[sn[0],tn[1],1],[sn[0],sn[1],1],[tn[0],sn[1],1],[tn[0],tn[1],1]],16760695))}I.push(p("85 mm","#ffe3a5",[Ae,We,w.person.height+13]))}I.push(p(ge+" mm","#ffe3a5",[Ee+ge/2,ve-17,Xe+2])),I.push(p(_e+" mm","#ffe3a5",[Ee-29,ve+_e/2,Xe+2]));for(let[Ae,We]of w.objects.entries()){let ke=yt(We.size,We.center,te[Ae]);oe.push(ke);let pt=ke.material;ke.material=[pt,pt,pt,pt,new En({map:ne(We),roughness:.8}),pt];let jn=yt([We.size[0]+6,We.size[1]+6,1],[We.center[0],We.center[1],.5],3495795);jn.material.transparent=!0,jn.material.opacity=.65}}w.objects.forEach((ge,_e)=>{let Ee=oe[_e],ve=ge.rotation;Ee.position.copy(h(ge.center)),Ee.quaternion.setFromRotationMatrix(new dt().set(ve[0],ve[1],ve[2],0,ve[3],ve[4],ve[5],0,ve[6],ve[7],ve[8],0,0,0,0,1))});let F=w.objects.find(ge=>ge.id===w.held),W=document.getElementById("held-dimensions");W.hidden=!F,F&&(W.textContent=F.id+" \xB7 "+F.size.join(" \xD7 ")+" mm"),n.domElement.dataset.tool="gripper",n.domElement.dataset.held=w.held||"",n.domElement.dataset.score=String(w.score)}let me=new cn;e.add(me),me.visible=!1;let Ye=new _t(new Ar(7,1.4,8,32),new hn({color:16767878,depthTest:!1}));Ye.renderOrder=35,me.add(Ye);for(let[w,F]of[[0,15846531],[1,9555435],[2,16777215]]){let W=new L;W.setComponent(w,28);let ie=new Cr(W.clone().normalize(),new L,28,F,5,3);me.add(ie)}let Ve=p("O","#ffe4ae",[0,0,0]);Ve.scale.set(25,12,1),Ve.visible=!1;let R=["+X","+Y","+Z"].map(w=>{let F=p(w,"#e6d7b6",[0,0,0]);return F.scale.set(23,11,1),F.visible=!1,F});function y(w){me.visible=Ve.visible=!!w,R.forEach(F=>F.visible=!!w),w&&(me.position.set(...w),me.position.z+=1,Ve.position.set(w[0]-10,w[1]-12,w[2]+3),R.forEach((F,W)=>{F.position.set(...w),F.position.setComponent(W,w[W]+35)}))}let B=u([],15759396),q=[],re=new cn;e.add(re);function J(){for(let w of[...re.children])re.remove(w),w.traverse(F=>{if(F.geometry?.dispose(),F.material)for(let W of Array.isArray(F.material)?F.material:[F.material])W.dispose()})}function Le(w){if(J(),!w)return;let F=7985151,W=16734572;function ie(Ae,We,ke=!0){if(Ae.length<2)return;let pt=new Et().setFromPoints(Ae.map(h)),jn=ke?new Rr({color:We,dashSize:6,gapSize:3,depthTest:!1,transparent:!0,opacity:.95}):new Dn({color:We,depthTest:!1}),Jn=new is(pt,jn);Jn.computeLineDistances(),Jn.renderOrder=30,re.add(Jn)}for(let Ae of w.segments){ie(Ae.points,F);let We=0;for(let ke=1;ke<Ae.points.length;ke++){let pt=h(Ae.points[ke-1]),jn=h(Ae.points[ke]);if(We+=pt.distanceTo(jn),We>45){let Jn=new Cr(jn.clone().sub(pt).normalize(),pt,13,F,6,4);re.add(Jn),We=0}}Ae.error&&Ae.blockedPoint&&Ae.target&&ie([Ae.blockedPoint,Ae.target],W)}let K=w.ghost;if(!K)return;let G=tt(K.q),ge=w.error?W:F,_e=new cn;re.add(_e);function Ee(Ae,We,ke=_e){let pt=new _t(Ae,new hn({color:ge,transparent:!0,opacity:.22,depthWrite:!1,depthTest:!1}));return pt.position.copy(h(We)),pt.renderOrder=28,ke.add(pt),pt}for(let Ae=1;Ae<G.points.length;Ae++){let We=h(G.points[Ae-1]),ke=h(G.points[Ae]);Ee(new Ft(Math.max(9,20-Ae*2),Math.max(9,20-Ae*2),We.distanceTo(ke),12),We.clone().add(ke).multiplyScalar(.5).toArray()).quaternion.setFromUnitVectors(new L(0,1,0),ke.sub(We).normalize())}let ve=new cn;_e.add(ve),ve.position.copy(h(G.tip));let Xe=G.rotation;ve.quaternion.setFromRotationMatrix(new dt().set(Xe[0],Xe[1],Xe[2],0,Xe[3],Xe[4],Xe[5],0,Xe[6],Xe[7],Xe[8],0,0,0,0,1)),Ee(new kt(22,54,12),[0,0,23],ve),Ee(new kt(26,26,16),[0,0,34],ve);let yt=kc(K.payload?[K.payload]:[],G);for(let Ae of[-1,1])Ee(new kt(12,6,32),[0,K.output?yt[Ae<0?0:1]:Ae*rn.open,3],ve);if(K.payload){let Ae=K.payload,We=Ee(new kt(...Ae.size),Ae.center),ke=Ae.rotation;We.quaternion.setFromRotationMatrix(new dt().set(ke[0],ke[1],ke[2],0,ke[3],ke[4],ke[5],0,ke[6],ke[7],ke[8],0,0,0,0,1))}if(w.error){let Ae=K.blockedPoint||G.tip,We=new _t(new Xn(11,16,12),new hn({color:W,wireframe:!0,depthTest:!1}));We.position.copy(h(Ae)),We.renderOrder=33,re.add(We);for(let ke of[-1,1])ie([[Ae[0]-8,Ae[1],Ae[2]-ke*8],[Ae[0]+8,Ae[1],Ae[2]+ke*8]],W,!1)}}let fe=new cn;e.add(fe),fe.visible=!1;let De=new _t(new Xn(5,16,12),new hn({color:16768902,wireframe:!0,depthTest:!1}));fe.add(De);let Ce=u([[0,0,0],[0,0,0]],16768902);Ce.visible=!1;function ue(w){fe.visible=Ce.visible=!!w,w&&(fe.position.set(...w),Ce.geometry.dispose(),Ce.geometry=new Et().setFromPoints([h(w),h([w[0],w[1],0])]))}function Me(w,F=!0){C(w.length);let W=tt(w),ie=W.tip,K=W.points;Z=W,f.rotation.z=w[0]*Math.PI/180,v.forEach((_e,Ee)=>{let ve=h(K[Ee]),Xe=h(K[Ee+1]),yt=Xe.clone().sub(ve).normalize();Ee===0&&(ve.addScaledVector(yt,22),Xe.addScaledVector(yt,-20)),_e.position.copy(ve).add(Xe).multiplyScalar(.5),_e.scale.y=ve.distanceTo(Xe),_e.quaternion.setFromUnitVectors(new L(0,1,0),yt)}),x.forEach((_e,Ee)=>{_e.position.copy(h(W.origins[Ee+1])),_e.quaternion.setFromUnitVectors(new L(0,1,0),h(W.axes[Ee+1])),T[Ee].position.copy(_e.position),T[Ee].quaternion.copy(_e.quaternion)}),N.position.copy(h(ie)),b.position.copy(h(ie));let G=W.rotation,ge=new dt().set(G[0],G[1],G[2],0,G[3],G[4],G[5],0,G[6],G[7],G[8],0,0,0,0,1);b.quaternion.setFromRotationMatrix(ge),Re.position.copy(b.position),Re.quaternion.copy(b.quaternion),Oe.geometry.dispose(),Oe.geometry=new Et().setFromPoints([h(ie),h([ie[0],ie[1],0])]),Ie.position.set(ie[0],ie[1],1),F&&(!q.length||h(ie).distanceTo(q.at(-1))>1.5)&&(q.push(h(ie)),q.length>1400&&q.shift(),B.geometry.dispose(),B.geometry=new Et().setFromPoints(q))}function ze(w){let F=Math.max(1,oa(A)/440);s.target.set(150,0,55),t.position.set(...w==="top"?[150,-.1,730*F]:w==="side"?[40,-1e3*F,110]:[510*F,-560*F,475*F]),s.update()}let Fe=()=>{let{width:w,height:F}=i.getBoundingClientRect();n.setSize(w,F,!1),t.aspect=w/F,t.fov=w/F<1.1?52:39,t.clearViewOffset(),t.updateProjectionMatrix()};new ResizeObserver(Fe).observe(i);let Ze=op(document.getElementById("view-cube"),t,s);return n.setAnimationLoop(()=>{ae(),Ze.update();let w=kc($,Z);for(let F of S){let W=F.userData.sign,ie=w[W<0?0:1],K=V?ie:W*rn.open,G=F.position.y+(K-F.position.y)*.16;F.position.y=W<0?Math.min(G,ie):Math.max(G,ie)}n.domElement.dataset.jawGap=S.length?String(S[1].position.y-S[0].position.y-rn.thickness):"",Q&&(Q.visible=V&&D!=="gripper"),s.update(),n.render(e,t)}),Me(Cn.home),{pose:Me,configure:C,view:ze,taskState:ce,setTarget:ue,setWorkFrame:y,setMotionPreview:Le,setPreviewVisible(w){re.visible=w},setQuizTarget(w){he=w,ae()},setTrail(w){B.visible=w,n.domElement.dataset.trailVisible=String(w)},setReach:w=>et.visible=w,clearTrail(){q=[],B.geometry.dispose(),B.geometry=new Et},targets(){}}}var Vi=i=>[...i.origin,i.deck],ks=(i,e)=>i.map((t,n)=>t-e[n]),Sc=(i,e)=>i.map((t,n)=>t+e[n]);function up(i,e,t=0){let[n,s]=t%180===0?e:[e[1],e[0],e[2]];return[i[0]+n/2,i[1]+s/2,e[2]]}function dp(i,e,t){return e?i.p?e.type==="move"&&Math.hypot(...i.p.map((n,s)=>n-e.p[s]))<3:typeof i.on!="boolean"||e.type!=="grip"||e.on!==i.on||t.output!==i.on?!1:i.on?t.input:!t.input&&t.score===1:!1}var U=i=>document.getElementById(i),P=(i,e)=>On==="zh"?e:i,Hr=i=>String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),On=localStorage.getItem("cargo-language")||"zh",Gt="xyz",de=new ei,Ke=qi(),ut=[],Gi={},kr={},fs=!1,Ac=!1,Ru=!1,Rc=!1,Un="A",Vr={},Gr="",Ue=null,Yn=null,Hs="move",Cu=null,Ec="",Ot="keep",Fn="linear",Wt="robot",Zn=!1,di=null,Pu=()=>Wt==="bed"?Vi(de.spec):[0,0,0],$r=i=>ks(i,Pu()),xn=i=>Math.abs(i)<.05?0:Math.round(i*10)/10,zt=tt(Ke).tip.map(i=>Math.round(i*10)/10),Qt=0,zs=0,Tt=!1,fi=!1,ot=null,wc=-1,xt=-1,ea="ready",Zt=0,pi=[!1,!1,!1,!1,!1],_n=!1,Tc=[null,null,null],Ko="",ds=[],Tn=-1,zr=null,Bt=hp(U("viewport")),en=U("modal"),iv=ed({translate:P,highlightPart:i=>Bt.setQuizTarget(i),showPrompt:i=>{i?(U("guide").hidden=!1,U("guide").innerHTML=`<strong>${P("Learning prompt","\u5B66\u4E60\u63D0\u793A")}</strong><p>${P("Next: move above box A, then record the position. Approaching from above gives the box clearance.","\u4E0B\u4E00\u6B65\uFF1A\u79FB\u52A8\u5230\u7BB1\u5B50 A \u4E0A\u65B9\uFF0C\u7136\u540E\u8BB0\u5F55\u4F4D\u7F6E\u3002\u4ECE\u4E0A\u65B9\u63A5\u8FD1\u53EF\u7559\u51FA\u51C0\u7A7A\u3002")}</p>`):U("guide").hidden=!0},restorePrompt:()=>Ht()}),Wr={orientation:["This position can be reached with another orientation. Try Allow rotation, then inspect the preview.","\u6B64\u4F4D\u7F6E\u53EF\u7528\u5176\u4ED6\u671D\u5411\u5230\u8FBE\u3002\u8BF7\u5C1D\u8BD5\u201C\u5141\u8BB8\u65CB\u8F6C\u201D\uFF0C\u7136\u540E\u68C0\u67E5\u9884\u89C8\u3002"],solve:["The solver could not find a motion for these settings. Try joint movement to the target or a nearer intermediate position. This does not prove the position is impossible.","\u6C42\u89E3\u5668\u672A\u627E\u5230\u7B26\u5408\u8BBE\u7F6E\u7684\u8FD0\u52A8\u3002\u8BF7\u5C1D\u8BD5\u201C\u5173\u8282\u8FD0\u52A8\u81F3\u76EE\u6807\u201D\u6216\u66F4\u8FD1\u7684\u4E2D\u95F4\u4F4D\u7F6E\u3002\u8FD9\u5E76\u4E0D\u8BC1\u660E\u76EE\u6807\u4E0D\u53EF\u8FBE\u3002"],obstacle:["Movement blocked by the person\u2019s marked obstacle zone. Compare the movement with the tool and load dimensions.","\u79FB\u52A8\u88AB\u4EBA\u7269\u6807\u793A\u533A\u57DF\u963B\u6B62\u3002\u8BF7\u5BF9\u7167\u5F53\u524D\u79FB\u52A8\u4E0E\u5DE5\u5177\u3001\u8D27\u7269\u5C3A\u5BF8\u3002"],support:["This placement is unsupported or above the two-level limit. The box stays held.","\u6B64\u4F4D\u7F6E\u7F3A\u5C11\u5B8C\u6574\u652F\u6491\uFF0C\u6216\u8D85\u8FC7\u4E24\u5C42\u9650\u5236\u3002\u7BB1\u5B50\u4FDD\u6301\u5939\u6301\u3002"],supportsLoad:["This box supports another box. Remove the upper box first.","\u6B64\u7BB1\u652F\u6491\u7740\u53E6\u4E00\u7BB1\u3002\u8BF7\u5148\u79FB\u8D70\u4E0A\u65B9\u7BB1\u5B50\u3002"],fingers:["Movement blocked: gripper contact. Compare the tool dimensions with your arrangement and route.","\u79FB\u52A8\u88AB\u963B\u6B62\uFF1A\u5939\u722A\u53D1\u751F\u63A5\u89E6\u3002\u8BF7\u5BF9\u7167\u5DE5\u5177\u5C3A\u5BF8\u68C0\u67E5\u6392\u5217\u4E0E\u8DEF\u7EBF\u3002"],shelfCollision:["Shelf contact ahead. Use the front opening; withdraw out of the cubby before changing levels.","\u524D\u65B9\u4F1A\u78B0\u5230\u8D27\u67B6\u3002\u8BF7\u4ECE\u6B63\u9762\u8FDB\u5165\uFF1B\u6362\u5C42\u524D\u5148\u9000\u51FA\u683C\u53E3\u3002"],wrongCell:["Box released in a different cubby. Match the box letter to its cubby.","\u7BB1\u5B50\u5DF2\u91CA\u653E\uFF0C\u4F46\u683C\u53E3\u4E0D\u5339\u914D\u3002\u8BF7\u5C06\u7BB1\u5B50\u5B57\u6BCD\u4E0E\u683C\u53E3\u5BF9\u5E94\u3002"],planNeeded:["Commit your placement plan before starting the task.","\u5F00\u59CB\u4EFB\u52A1\u524D\uFF0C\u8BF7\u63D0\u4EA4\u653E\u7F6E\u65B9\u6848\u3002"],edge:["The box overhangs the truck. It stays held. Lift and bring its full footprint inside.","\u7BB1\u5B50\u8D85\u51FA\u8F66\u53A2\u8FB9\u754C\uFF0C\u4ECD\u4FDD\u6301\u5939\u6301\u3002\u8BF7\u62AC\u5347\u540E\u5C06\u6574\u4E2A\u5E95\u9762\u79FB\u5165\u8F66\u53A2\u3002"],ready:["Move the tool, record positions, then test your program.","\u79FB\u52A8\u5DE5\u5177\u3001\u8BB0\u5F55\u4F4D\u7F6E\uFF0C\u7136\u540E\u6D4B\u8BD5\u7A0B\u5E8F\u3002"],moved:["Position reached. Record it if it belongs in your program.","\u5DF2\u5230\u8FBE\u4F4D\u7F6E\u3002\u5982\u9700\u52A0\u5165\u7A0B\u5E8F\uFF0C\u8BF7\u8BB0\u5F55\u3002"],grasped:["DI1 ON \xB7 Box held. Lift before moving sideways.","DI1 \u5F00 \xB7 \u5DF2\u5939\u4F4F\u7BB1\u5B50\u3002\u5148\u62AC\u5347\uFF0C\u518D\u6C34\u5E73\u79FB\u52A8\u3002"],held:["DI1 ON \xB7 Box held.","DI1 \u5F00 \xB7 \u5DF2\u5939\u4F4F\u7BB1\u5B50\u3002"],open:["Gripper open \xB7 DI1 OFF.","\u5939\u722A\u5DF2\u5F20\u5F00 \xB7 DI1 \u5173\u3002"],placed:["Placed. Lift clear; in a cubby, withdraw through the front before changing levels.","\u653E\u7F6E\u6210\u529F\u3002\u62AC\u5347\u79BB\u5F00\u7BB1\u5B50\uFF1B\u5728\u683C\u53E3\u5185\u5E94\u5148\u4ECE\u6B63\u9762\u9000\u51FA\uFF0C\u518D\u6362\u5C42\u3002"],noContact:["Nothing held. Open, align above a box centre, lower to its top, then close.","\u672A\u5939\u4F4F\u7269\u4F53\u3002\u5F20\u5F00\u5939\u722A\uFF0C\u5BF9\u51C6\u7BB1\u5B50\u4E2D\u5FC3\uFF0C\u4E0B\u964D\u81F3\u7BB1\u9876\uFF0C\u518D\u95ED\u5408\u3002"],tilt:["Level the gripper for pickup. Choose Point downward, then preview and move.","\u6293\u53D6\u65F6\u8BF7\u5C06\u5939\u722A\u8C03\u5E73\u3002\u9009\u62E9\u201C\u671D\u4E0B\u201D\uFF0C\u68C0\u67E5\u9884\u89C8\u540E\u518D\u79FB\u52A8\u3002"],wide:["Too wide across the jaws. Open and turn the gripper 90\xB0 first.","\u5939\u722A\u65B9\u5411\u4E0A\u7684\u7BB1\u4F53\u8FC7\u5BBD\u3002\u5148\u5F20\u5F00\uFF0C\u518D\u65CB\u8F6C\u5939\u722A 90\xB0\u3002"],occupied:["Space occupied. The box stays held; lift and choose a clear space.","\u4F4D\u7F6E\u5DF2\u88AB\u5360\u7528\u3002\u7BB1\u5B50\u4ECD\u88AB\u5939\u6301\uFF0C\u8BF7\u62AC\u5347\u540E\u9009\u62E9\u7A7A\u4F4D\u3002"],drop:["Released too high. This does not count as a safe placement.","\u91CA\u653E\u4F4D\u7F6E\u8FC7\u9AD8\uFF0C\u672C\u6B21\u4E0D\u8BA1\u4E3A\u5B89\u5168\u653E\u7F6E\u3002"],outside:["Outside the loading area. Check the full box footprint, not only its centre.","\u672A\u653E\u5165\u88C5\u8F7D\u533A\u3002\u68C0\u67E5\u6574\u4E2A\u5E95\u9762\uFF0C\u800C\u4E0D\u4EC5\u662F\u4E2D\u5FC3\u70B9\u3002"],cargo:["Move blocked: cargo collision. Lift, travel across, then lower.","\u79FB\u52A8\u88AB\u963B\u6B62\uFF1A\u5C06\u78B0\u5230\u7BB1\u5B50\u3002\u5148\u62AC\u5347\uFF0C\u518D\u5E73\u79FB\uFF0C\u6700\u540E\u4E0B\u964D\u3002"],deck:["Move blocked: the box or tool would hit the truck deck. Raise Z first.","\u79FB\u52A8\u88AB\u963B\u6B62\uFF1A\u5C06\u78B0\u5230\u5E95\u677F\u3002\u8BF7\u5148\u589E\u5927 Z\u3002"],floor:["Move blocked: too low. Raise Z first.","\u79FB\u52A8\u88AB\u963B\u6B62\uFF1A\u9AD8\u5EA6\u8FC7\u4F4E\u3002\u8BF7\u5148\u589E\u5927 Z\u3002"],limits:["Cannot reach this path. Try a smaller move or a higher approach.","\u65E0\u6CD5\u5B8C\u6210\u8FD9\u6761\u8DEF\u5F84\u3002\u5C1D\u8BD5\u66F4\u5C0F\u7684\u79FB\u52A8\uFF0C\u6216\u4ECE\u66F4\u9AD8\u5904\u63A5\u8FD1\u3002"],numbers:["Enter valid coordinates; rotation must be between \u2212180\xB0 and 180\xB0.","\u8BF7\u8F93\u5165\u6709\u6548\u5750\u6807\uFF0C\u65CB\u8F6C\u8303\u56F4\u4E3A \u2212180\xB0 \u81F3 180\xB0\u3002"],stopped:["Stopped. Adjust or reset the scene.","\u5DF2\u505C\u6B62\u3002\u53EF\u4EE5\u8C03\u6574\u6216\u91CD\u7F6E\u573A\u666F\u3002"],wait:["DI1 is OFF. Stopped: check the close command and pickup position.","DI1 \u4E3A\u5173\u3002\u5DF2\u505C\u6B62\uFF0C\u8BF7\u68C0\u67E5\u95ED\u5408\u6307\u4EE4\u548C\u6293\u53D6\u4F4D\u7F6E\u3002"],complete:["Program complete. Inspect the result before changing your strategy.","\u8FD0\u884C\u5B8C\u6210\u3002\u8C03\u6574\u7B56\u7565\u524D\uFF0C\u8BF7\u5148\u68C0\u67E5\u7ED3\u679C\u3002"]},Cc=["orientation","solve","obstacle","support","supportsLoad","fingers","shelfCollision","wrongCell","planNeeded","edge","noContact","tilt","wide","occupied","drop","outside","cargo","deck","floor","limits","numbers","wait"];function Mt(i,e){ea=i,U("status").textContent=e||P(...Wr[i]||Wr.ready),U("status").classList.toggle("error",Cc.includes(i))}function yn(){U("front-view").hidden=de.spec.mode!=="stacking",de.update(Ke),Bt.pose(Ke),Bt.taskState(de.snapshot());let i=tt(Ke);U("position-frame").textContent=P(Wt==="bed"?de.spec.mode==="shelf"?"Tool \xB7 SHELF zero \xB7 mm":"Tool \xB7 BED zero \xB7 mm":"Tool \xB7 ROBOT zero \xB7 mm",Wt==="bed"?de.spec.mode==="shelf"?"\u5DE5\u5177 \xB7 \u8D27\u67B6\u96F6\u70B9 \xB7 mm":"\u5DE5\u5177 \xB7 \u8F66\u53A2\u96F6\u70B9 \xB7 mm":"\u5DE5\u5177 \xB7 \u673A\u5668\u4EBA\u96F6\u70B9 \xB7 mm"),U("position").innerHTML=$r(i.tip).map((e,t)=>`<b><i>${"XYZ"[t]}</i>${xn(e).toFixed(1)}</b>`).join(""),U("orientation").textContent=P("Roll / Pitch / Rz","\u6A2A\u6EDA / \u4FEF\u4EF0 / Rz")+" "+i.rpy.map(e=>e.toFixed(0)+"\xB0").join(" / "),U("score").textContent=`${de.score} / ${de.objects.length}`,U("sensor").innerHTML=`<span>${P("Close command","\u95ED\u5408\u6307\u4EE4")} <b>DO1 ${de.output?"ON":"OFF"}</b></span><span>${P(de.input?"Object held":"Nothing held",de.input?"\u5DF2\u5939\u4F4F\u7269\u4F53":"\u672A\u5939\u4F4F\u7269\u4F53")} <b>DI1 ${de.input?"ON":"OFF"}</b></span>`,U("grip-close").classList.toggle("active",de.output),U("grip-open").classList.toggle("active",!de.output),U("distance").textContent=P("Travel ","\u8DEF\u5F84 ")+Math.round(de.travel)+" mm",U("faults").textContent=P("Retries ","\u9700\u8C03\u6574 ")+de.faults,Au(),na(),!ot&&!Tt&&Uc()}function pp(i=Qt){let e=tt(Ke);return{orientation:Ot==="free"?null:Ot==="down"?[0,0,i]:[e.rpy[0],e.rpy[1],i],path:Fn}}function sv(){let i=U("motion-options");i.hidden=Gt==="joints",!i.hidden&&(i.innerHTML=`<label>${P("Orientation","\u5DE5\u5177\u671D\u5411")} <select id="orientation-mode"><option value="keep">${P("Keep current","\u4FDD\u7559\u5F53\u524D\u671D\u5411")}</option><option value="free">${P("Allow rotation","\u5141\u8BB8\u65CB\u8F6C")}</option><option value="down">${P("Point downward","\u671D\u4E0B")}</option></select></label><label>${P("Path","\u8FD0\u52A8\u8DEF\u5F84")} <select id="motion-path"><option value="linear">${P("Direct tool movement","\u5DE5\u5177\u76F4\u63A5\u79FB\u52A8")}</option><option value="joint">${P("Joint movement to target","\u5173\u8282\u8FD0\u52A8\u81F3\u76EE\u6807")}</option></select></label><small>${P(Ot==="free"?"Rotation is automatic; Rz is not constrained. Check the ghost gripper before moving.":Ot==="down"?"Pickup aid: roll and pitch are set to zero. Rz sets the jaw direction.":"Keep current roll and pitch. Rz changes only when you change its value.",Ot==="free"?"\u671D\u5411\u81EA\u52A8\u8C03\u6574\uFF0CRz \u4E0D\u53D7\u7EA6\u675F\u3002\u79FB\u52A8\u524D\u68C0\u67E5\u534A\u900F\u660E\u5939\u722A\u3002":Ot==="down"?"\u6293\u53D6\u8F85\u52A9\uFF1A\u6A2A\u6EDA\u4E0E\u4FEF\u4EF0\u8BBE\u4E3A\u96F6\uFF0CRz \u63A7\u5236\u5939\u722A\u65B9\u5411\u3002":"\u4FDD\u7559\u5F53\u524D\u6A2A\u6EDA\u4E0E\u4FEF\u4EF0\u3002\u53EA\u6709\u4FEE\u6539 Rz \u503C\u624D\u6539\u53D8\u5176\u76EE\u6807\u3002")} ${P(Fn==="joint"?"The tool may follow a curved path.":"The tool follows a direct path; placement assistance may add a final alignment.",Fn==="joint"?"\u5DE5\u5177\u53EF\u80FD\u6CBF\u5F27\u7EBF\u8DEF\u5F84\u79FB\u52A8\u3002":"\u5DE5\u5177\u6CBF\u76F4\u63A5\u8DEF\u5F84\u79FB\u52A8\uFF1B\u653E\u7F6E\u8F85\u52A9\u53EF\u80FD\u589E\u52A0\u672B\u7AEF\u5BF9\u9F50\u3002")}</small>`,U("orientation-mode").value=Ot,U("motion-path").value=Fn,U("orientation-mode").onchange=e=>{Ot=e.target.value,(Ot==="keep"||Ot==="free")&&(Qt=tt(Ke).rpy[2]),Wi()},U("motion-path").onchange=e=>{Fn=e.target.value,Wi()})}function Ri(){let i=tt(Ke);zt=i.tip.map(e=>Math.round(e*10)/10),Qt=i.rpy[2],Wi()}function Pc(){document.documentElement.lang=On==="zh"?"zh-CN":"en",document.querySelectorAll("[data-en]").forEach(i=>i.textContent=i.dataset[On]),U("language").textContent=On==="zh"?"English":"\u4E2D\u6587",Wi(),jt(),Ht(),yn(),Mt(ea),vn()}function Wi(){sv(),yv();let i=$r(zt),e=Pu();if(document.querySelectorAll("[data-mode]").forEach(t=>{t.classList.toggle("active",t.dataset.mode===Gt),t.setAttribute("aria-selected",String(t.dataset.mode===Gt))}),Gt==="xyz"){U("movement").innerHTML=`<div class="coordinate-grid">${["X","Y","Z","Rz"].map((t,n)=>`<div class="axis-control"><label for="axis-${n}">${t} <small>${n===3?"\xB0":"mm"}</small></label><input id="axis-${n}" aria-label="${t}" type="number" step="1" value="${xn(n===3?Qt:i[n])}"><input aria-label="${t} ${P("slider","\u6ED1\u5757")}" data-axis="${n}" type="range" min="${[-100-e[0],-250-e[1],12-e[2],-180][n]}" max="${[400-e[0],300-e[1],330-e[2],180][n]}" step="1" value="${xn(n===3?Qt:i[n])}"></div>`).join("")}<button id="move" class="move-button primary">${P("Move \u2192","\u79FB\u52A8 \u2192")}</button></div><p class="dock-note">${P("Set a target and inspect its preview, then Move. Orientation and path follow the choices above.","\u8BBE\u5B9A\u76EE\u6807\u5E76\u68C0\u67E5\u9884\u89C8\uFF0C\u518D\u70B9\u51FB\u79FB\u52A8\u3002\u671D\u5411\u548C\u8DEF\u5F84\u9075\u5FAA\u4E0A\u65B9\u8BBE\u7F6E\u3002")}</p>`;for(let t=0;t<4;t++){let n=U("axis-"+t),s=document.querySelector(`[data-axis="${t}"]`);n.oninput=()=>{let r=n.value===""?NaN:Number(n.value);t===3?Qt=r:zt[t]=r+e[t],s.value=r,Tu(),xt>=0&&Ht()},s.oninput=()=>{n.value=s.value,n.oninput()}}U("move").onclick=()=>Su([...zt],Qt)}else Gt==="jog"?(U("movement").innerHTML=`<div class="jog-grid">${["X","Y","Z","Rz"].map((t,n)=>`<div class="jog-axis"><button data-jog="${n},-1" aria-label="${t} minus">\u2212</button><span>${t}</span><button data-jog="${n},1" aria-label="${t} plus">\uFF0B</button></div>`).join("")}<label>${P("Step","\u6B65\u957F")} <input id="jog-step" type="number" value="10" min="1" max="50"> mm / \xB0</label></div><p class="dock-note">${P("Small, deliberate moves. Inspect before recording.","\u7528\u5C0F\u6B65\u957F\u7CBE\u786E\u79FB\u52A8\uFF0C\u68C0\u67E5\u540E\u518D\u8BB0\u5F55\u3002")}</p>`,document.querySelectorAll("[data-jog]").forEach(t=>t.onclick=()=>{let[n,s]=t.dataset.jog.split(",").map(Number),r=Number(U("jog-step").value);if(!Number.isFinite(r)||r<1||r>50)return Mt("numbers");let o=tt(Ke),a=[...o.tip];n<3&&(a[n]+=s*r),Su(a,o.rpy[2]+(n===3?s*r:0))})):(U("movement").innerHTML=`<div class="joint-grid">${Ke.map((t,n)=>`<div class="axis-control"><label for="joint-${n}">J${n+1}</label><input id="joint-${n}" type="range" min="${Hn[n].limits[0]}" max="${Hn[n].limits[1]}" step="1" value="${t}"><output>${Math.round(t)}\xB0</output></div>`).join("")}</div><p class="dock-note">${P("Joints can tilt the tool. Switching to Coordinates keeps this orientation.","\u5173\u8282\u53EF\u6539\u53D8\u5DE5\u5177\u503E\u89D2\u3002\u5207\u6362\u5230\u5750\u6807\u6A21\u5F0F\u65F6\u4F1A\u4FDD\u7559\u5F53\u524D\u671D\u5411\u3002")}</p>`,Ke.forEach((t,n)=>{U("joint-"+n).oninput=s=>{s.target.nextElementSibling.textContent=s.target.value+"\xB0";let r=[...Ke];r[n]=Number(s.target.value),Vs(Ys(de,Ke,tt(r).tip,0,r))},U("joint-"+n).onchange=s=>{let r=[...Ke];r[n]=Number(s.target.value),gp(r)}}));Tu(),$i()}function $i(){if(U("preview-program").disabled=Tt||!!ot||!ut.length,document.querySelectorAll("#attempt-action,#coordinate-frame,#set-zero,#movement input,#movement button,#motion-options select,.tabs button,.grip button,#record,#add-close,#add-open,#add-wait,#reset,#clear,#load,#steps button,#undo,#mission-button,#learn-button,#help,#language,#journey-toggle,#journey-steps button").forEach(i=>i.disabled=Tt||!!ot),U("save").disabled=!!ot&&!fi,U("save").title=P("Pause or stop movement to export a stable session.","\u6682\u505C\u6216\u505C\u6B62\u8FD0\u52A8\u540E\uFF0C\u53EF\u5BFC\u51FA\u5F53\u524D\u8FDB\u5EA6\u3002"),document.querySelectorAll(".modal-save").forEach(i=>i.disabled=!!ot&&!fi),document.querySelectorAll(".modal-import").forEach(i=>i.disabled=Tt||!!ot),U("undo").disabled=Tt||!!ot||!ds.length,U("run").disabled=Tt||!!ot||!ut.length,U("pause").disabled=!Tt||Tn>=0,U("stop").disabled=!Tt&&!ot,Ot==="free"){U("axis-3")&&(U("axis-3").disabled=!0);let i=document.querySelector('[data-axis="3"]');i&&(i.disabled=!0),document.querySelectorAll('[data-jog^="3,"]').forEach(e=>e.disabled=!0)}}function Ic(){Tn>=0&&(U("guide").hidden=!0),zr&&(zr("stop"),zr=null),Tn=-1,zs++,Tt=!1,fi=!1,wc=-1,ot&&(ot.resolve(!1),ot=null),U("pause").textContent=P("Pause","\u6682\u505C"),jt(),$i(),Mt("stopped")}function mp(i,e=.8){return new Promise(t=>{ot={frames:[Ke,...i],start:performance.now(),duration:e*1e3,resolve:t},$i()})}async function Su(i,e,t=!1,n=null){if((Tt||ot)&&!t)return;if(!Lc(t))return!1;let s=n||(t?{}:pp(e));Hs="move",Vs(Ys(de,Ke,i,e,null,s));let r=gs(de,Ke,i,e,s);if(r.error)return de.faults++,Ue&&!Ue.finished&&Ue.blocked++,Mt(r.error),yn(),!1;let o=await mp(r.frames,Math.min(2.2,Math.max(.5,Dt(tt(Ke).tip,i)/150)));return o&&(de.moves++,Ri(),Mt("moved",r.assisted?P("Placement aligned within the 5 mm / 5\xB0 training tolerance. Record this reached position.","\u5DF2\u6309 5 mm / 5\xB0 \u8BAD\u7EC3\u5BB9\u5DEE\u5BF9\u9F50\u653E\u7F6E\u4F4D\u7F6E\u3002\u8BF7\u8BB0\u5F55\u5B9E\u9645\u5230\u8FBE\u7684\u4F4D\u7F6E\u3002"):void 0),xt>=0&&Ht()),o}async function gp(i,e=!1){if((Tt||ot)&&!e||!Lc(e))return!1;Vs(Ys(de,Ke,tt(i).tip,0,i));let t=de.canMove(Ke,i);if(t)return de.faults++,Ue&&!Ue.finished&&Ue.blocked++,Mt(t),Ri(),yn(),Vs(Ys(de,Ke,tt(i).tip,0,i)),!1;let n=await mp([i],.7);return n&&(de.moves++,Ri(),Mt("moved"),xt>=0&&Ht()),n}function _p(i){if(na(),ot&&!fi){let e=ot,t=Math.max(0,Math.min(1,(i-e.start)/e.duration)),n=t*(e.frames.length-1),s=Math.min(e.frames.length-2,Math.floor(n)),r=e.frames[s],o=e.frames[s+1],a=n-s,l=tt(Ke).tip;Ke=r.map((c,h)=>c+(o[h]-c)*a),de.travel+=Dt(l,tt(Ke).tip),Ue&&!Ue.finished&&(Ue.travel+=Dt(l,tt(Ke).tip)),yn(),t===1&&(ot=null,e.resolve(!0),$i())}requestAnimationFrame(_p)}function xp(i){if(Tt||ot||!Lc())return;let e=Mp(i);Mt(e),yn(),Cc.includes(e)||vp(),Fu()&&Nc()}function jt(){ut.length?U("steps").innerHTML=ut.map((i,e)=>`<li class="${e===wc?"playing":""}"><div><b>${i.name?Hr(i.name):i.type==="move"?P("Move","\u79FB\u52A8"):i.type==="wait"?P("Wait for DI1","\u7B49\u5F85 DI1"):i.on?P("Close gripper","\u95ED\u5408\u5939\u722A"):P("Open gripper","\u5F20\u5F00\u5939\u722A")}</b><small>${i.type==="move"?$r(i.p).map((t,n)=>"XYZ"[n]+" "+xn(t)).join(" \xB7 ")+P(Wt==="bed"?" \xB7 BED":" \xB7 ROBOT",Wt==="bed"?" \xB7 \u8F66\u53A2":" \xB7 \u673A\u5668\u4EBA")+` \xB7 ${i.orientation===null?P("Auto rotation","\u81EA\u52A8\u671D\u5411"):i.yaw.toFixed(0)+"\xB0"} \xB7 ${P(i.joint||i.path==="joint"?"Joint path":"Direct path",i.joint||i.path==="joint"?"\u5173\u8282\u8DEF\u5F84":"\u76F4\u63A5\u8DEF\u5F84")}`:i.type==="wait"?P("Stop if nothing is held","\u672A\u5939\u4F4F\u65F6\u505C\u6B62"):i.on?"DO1 ON":"DO1 OFF"}</small></div><button data-edit="${e}" aria-label="${P("Edit step","\u7F16\u8F91\u6B65\u9AA4")} ${e+1}">\u270E</button><button data-up="${e}" aria-label="${P("Move step up","\u4E0A\u79FB\u6B65\u9AA4")} ${e+1}">\u2191</button><button data-delete="${e}" aria-label="${P("Delete step","\u5220\u9664\u6B65\u9AA4")} ${e+1}">\xD7</button></li>`).join(""):U("steps").innerHTML=`<div class="empty"><span>\u21B3</span><h2>${P("One useful step at a time","\u4ECE\u4E00\u4E2A\u6709\u7528\u7684\u6B65\u9AA4\u5F00\u59CB")}</h2><p>${P("Move above a box. Record the position. Build a repeatable sequence from there.","\u5148\u79FB\u52A8\u5230\u7BB1\u5B50\u4E0A\u65B9\uFF0C\u8BB0\u5F55\u4F4D\u7F6E\uFF0C\u7136\u540E\u9010\u6B65\u6784\u5EFA\u53EF\u91CD\u590D\u6267\u884C\u7684\u7A0B\u5E8F\u3002")}</p></div>`,document.querySelectorAll("[data-up]").forEach(i=>i.onclick=()=>{let e=Number(i.dataset.up);e>0&&(Qo(),[ut[e-1],ut[e]]=[ut[e],ut[e-1]]),jt()}),document.querySelectorAll("[data-delete]").forEach(i=>i.onclick=()=>{Qo(),ut.splice(Number(i.dataset.delete),1),jt()}),document.querySelectorAll("[data-edit]").forEach(i=>i.onclick=()=>fv(Number(i.dataset.edit))),$i(),!Tt&&!ot&&Hs==="program"&&Uc()}function Dc(i){if(!(Tt||ot)){if(ut.length>=200)return Mt("numbers",P("Limit: 200 steps. Save before starting a new program.","\u6700\u591A 200 \u6B65\u3002\u8BF7\u5148\u4FDD\u5B58\uFF0C\u518D\u5F00\u59CB\u65B0\u7A0B\u5E8F\u3002"));Qo(),ut.push(i),jt(),U("steps").scrollTop=U("steps").scrollHeight,vp(i)}}function rv(){let i=tt(Ke);Dc({type:"move",p:[...i.tip],yaw:i.rpy[2],q:[...Ke],joint:Gt==="joints",orientation:Ot==="free"&&Gt!=="joints"?null:[...i.rpy],path:Gt==="joints"?"joint":Fn})}function ps(i=de.spec.mode,e=!1){di=null,ds=[],Ic(),Bt.setQuizTarget(null),Ue&&!e&&(Ue.finished&&(Ue=fa(Ue.plan,Ue.routes,Ue.strategy,de.spec.mode),Yn=performance.now(),fs=!0),Ue.restarts++,Ue.traces={}),de.reset(i),Ke=qi(),Bt.clearTrail(),e&&(Ot="keep",Fn="linear",i!=="practice"&&(pi[4]=!1),Ue=null,Yn=null,Vr={},Gr="",Un="A",Ko="",Wt="robot",Zn=!1,ut=[],Gi={},kr={},fs=!1),Ri(),yn(),jt(),Mt("ready")}var fp=i=>new Promise(e=>setTimeout(e,i));async function Iu(i=!1,e=0,t=!0){if(Tt||ot||!ut.length||!i&&!Lc())return;t&&(Ue&&!Ue.finished&&(Ue.restarts++,Ue.traces={}),de.reset(),Ke=qi(),Bt.clearTrail()),yn(),Tt=!0,fi=!1;let n=++zs;$i();let s=!0;for(let o=e;o<ut.length;o++){for(;fi&&n===zs;)await fp(50);if(n!==zs)return;let a={world:$c(de),q:[...Ke]},l;do{l=!1,wc=o,jt();let c=U("steps").querySelector(".playing");c&&(U("steps").scrollTop=Math.max(0,c.offsetTop-U("steps").offsetTop-30));let h=ut[o];if(i&&(Tn=o,yp(o)),h.type==="move"){if(!await(h.joint?gp(h.q,!0):Su(h.p,h.yaw,!0,{orientation:h.orientation,path:h.path}))){s=!1;break}}else if(h.type==="grip"){let u=Mp(h.on);if(Mt(u),yn(),Fu(),Cc.includes(u)){s=!1;break}await fp(350)}else if(!de.input){Mt("wait"),s=!1;break}if(n!==zs)return;if(i){Tn=o+1;let u=await cv(o);if(u==="stop"||n!==zs)return;u==="replay"&&(pv(a.world),Ke=[...a.q],yn(),l=!0)}}while(l);if(!s)break}if(n!==zs)return;Tt=!1,wc=-1,jt(),$i();let r=Cu;if(Ri(),!s){Vs(r),Tn=-1;return}if(i){Tn=-1,pi[1]=!0,vn(),U("guide").hidden=!0,Gs("demoDone");return}Mt("complete"),de.spec.mode==="practice"&&de.score===1&&xt>=8&&(Ac=!0,pi[2]=!0,xt=-1,Ht(),Uu()),de.spec.mode!=="practice"&&de.score===de.objects.length&&Nc()}function ov(){Tt&&(fi=!fi,ot&&(fi?ot.pauseAt=performance.now():ot.start+=performance.now()-ot.pauseAt),U("pause").textContent=fi?P("Resume","\u7EE7\u7EED"):P("Pause","\u6682\u505C"),$i())}function dn(i,e=P("LEARNING JOURNEY","\u5B66\u4E60\u4E4B\u65C5")){return`<div class="modal-head"><div><span class="eyebrow">${e}</span><h2 id="modal-title">${i}</h2></div><button class="modal-close" id="close-modal" aria-label="${P("Close","\u5173\u95ED")}">\xD7</button></div>`}function nn(i){U("modal-content").innerHTML=i,U("modal-content").querySelector(".modal-save")||(U("modal-content").insertAdjacentHTML("beforeend",`<div class="modal-progress"><button class="modal-save" ${ot?"disabled":""}>${P("Export progress JSON","\u5BFC\u51FA\u5B66\u4E60\u8FDB\u5EA6 JSON")}</button><button class="modal-import" ${Tt||ot?"disabled":""}>${P("Import progress JSON","\u5BFC\u5165\u5B66\u4E60\u8FDB\u5EA6 JSON")}</button></div>`),U("modal-content").querySelector(".modal-save").onclick=Bu,U("modal-content").querySelector(".modal-import").onclick=()=>U("file").click()),en.open||en.showModal(),U("close-modal")?.addEventListener("click",()=>en.close())}function av(){nn('<span class="eyebrow">BEIJING NEW TALENT ACADEMY</span><h2 id="modal-title">\u9009\u62E9\u8BED\u8A00 / Choose your language</h2><p class="lead">\u7528\u673A\u5668\u4EBA\u89E3\u51B3\u4E00\u4E2A\u5C0F\u5C0F\u7684\u8FD0\u8F93\u95EE\u9898\u3002<br>Solve a small delivery problem with a robot.</p><div class="actions"><button class="primary" id="choose-zh">\u4E2D\u6587</button><button id="choose-en">English</button></div><p>\u968F\u65F6\u53EF\u5728\u9876\u90E8\u5207\u6362 / You can change this at any time.</p>');for(let i of["zh","en"])U("choose-"+i).onclick=()=>{On=i,localStorage.setItem("cargo-language",On),Pc(),Gs()}}function Gs(i="intro"){if(i==="demoDone"){nn(dn(P("You have seen the strategy. Now try it.","\u5DF2\u7ECF\u770B\u8FC7\u793A\u8303\uFF0C\u73B0\u5728\u81EA\u5DF1\u8BD5\u8BD5\u3002"))+`<p class="lead">${P("Approach, grip, lift, travel, lower, release. Now build and play that sequence yourself.","\u63A5\u8FD1\u3001\u5939\u53D6\u3001\u62AC\u5347\u3001\u5E73\u79FB\u3001\u4E0B\u964D\u3001\u91CA\u653E\u3002\u73B0\u5728\u7531\u4F60\u7F16\u5199\u5E76\u8FD0\u884C\u8FD9\u4E00\u7A0B\u5E8F\u3002")}</p><div class="callout">${P("DO1 tells the gripper to close. DI1 tells you whether a box was actually held.","DO1 \u53D1\u51FA\u95ED\u5408\u6307\u4EE4\uFF1BDI1 \u544A\u8BC9\u4F60\u662F\u5426\u771F\u6B63\u5939\u4F4F\u4E86\u7BB1\u5B50\u3002")}</div><div class="actions"><button id="repeat" class="primary">${P("My turn \u2192","\u8F6E\u5230\u6211\u4E86 \u2192")}</button><button id="again">${P("Watch again","\u518D\u770B\u4E00\u6B21")}</button></div>`),U("repeat").onclick=Eu,U("again").onclick=()=>{en.close(),Nu()};return}nn(dn(P("A robot is one part of a solution.","\u673A\u5668\u4EBA\u662F\u89E3\u51B3\u95EE\u9898\u7684\u4E00\u90E8\u5206\u3002"))+`<p class="lead">${P("A school needs to deliver six supply boxes in one small truck. How would you arrange them\u2014and teach a robot to load them?","\u5B66\u6821\u8981\u7528\u4E00\u8F86\u5C0F\u8D27\u8F66\u8FD0\u9001\u516D\u7BB1\u7269\u8D44\u3002\u600E\u6837\u6446\u653E\u7BB1\u5B50\uFF0C\u5E76\u8BA9\u673A\u5668\u4EBA\u5B8C\u6210\u88C5\u8F7D\uFF1F")}</p><div class="journey">${[["Watch","\u89C2\u5BDF","Meet the robot and controls, then watch a transfer.","\u5148\u8BA4\u8BC6\u673A\u5668\u4EBA\u548C\u63A7\u5236\u754C\u9762\uFF0C\u518D\u89C2\u770B\u642C\u8FD0\u793A\u8303\u3002"],["Try","\u5C1D\u8BD5","Build and play the same sequence.","\u4EB2\u624B\u7F16\u5199\u5E76\u8FD0\u884C\u540C\u6837\u7684\u7A0B\u5E8F\u3002"],["Explain","\u89E3\u91CA","Check the ideas, not just the buttons.","\u68C0\u67E5\u662F\u5426\u7406\u89E3\uFF0C\u800C\u4E0D\u4EC5\u4F1A\u6309\u6309\u94AE\u3002"],["Solve","\u89E3\u51B3","Plan a truck load, then adapt your strategy to stacking around an obstacle.","\u89C4\u5212\u8F66\u53A2\u88C5\u8F7D\uFF0C\u518D\u5C06\u7B56\u7565\u8FC1\u79FB\u5230\u5E26\u969C\u788D\u7684\u5806\u53E0\u4EFB\u52A1\u3002"]].map((e,t)=>`<article><b>0${t+1} \xB7 ${P(e[0],e[1])}</b><p>${P(e[2],e[3])}</p></article>`).join("")}</div><div class="callout">${P("This robot has six turning joints: J1 base, J2 shoulder, J3 elbow, J4 swivel, J5 wrist tilt and J6 tool rotation. Together they control position and orientation. Motors are actuators. The gripper holds a box. Coordinates describe a position. A program tells the robot what to do in order; sensors give feedback. The arm has reach and clearance limits. You decide the packing strategy.","\u8FD9\u53F0\u673A\u5668\u4EBA\u6709\u516D\u4E2A\u8F6C\u52A8\u5173\u8282\uFF1AJ1 \u5E95\u5EA7\u3001J2 \u80A9\u90E8\u3001J3 \u8098\u90E8\u3001J4 \u56DE\u8F6C\u3001J5 \u8155\u90E8\u4FEF\u4EF0\u3001J6 \u5DE5\u5177\u65CB\u8F6C\u3002\u5B83\u4EEC\u5171\u540C\u63A7\u5236\u4F4D\u7F6E\u548C\u59FF\u6001\u3002\u7535\u673A\u662F\u6267\u884C\u5668\u3002\u5939\u722A\u5939\u6301\u7BB1\u5B50\uFF0C\u5750\u6807\u63CF\u8FF0\u4F4D\u7F6E\uFF0C\u7A0B\u5E8F\u89C4\u5B9A\u52A8\u4F5C\u987A\u5E8F\uFF0C\u4F20\u611F\u5668\u63D0\u4F9B\u53CD\u9988\u3002\u673A\u68B0\u81C2\u6709\u53EF\u8FBE\u8303\u56F4\u548C\u907F\u969C\u9650\u5236\uFF0C\u88C5\u8F7D\u7B56\u7565\u9700\u8981\u4F60\u6765\u51B3\u5B9A\u3002")}</div><div class="actions"><button id="watch" class="primary">${P("Watch a demonstration \u2192","\u89C2\u770B\u793A\u8303 \u2192")}</button><button id="parts">${P("Robot & interface tour","\u673A\u5668\u4EBA\u4E0E\u754C\u9762\u5BFC\u89C8")}</button><button id="practice">${P("Guided practice","\u5F15\u5BFC\u7EC3\u4E60")}</button><button id="explore">${P("Explore the mission","\u76F4\u63A5\u63A2\u7D22\u4EFB\u52A1")}</button>${Ac?`<button id="quiz-again">${P("Concept check","\u6982\u5FF5\u68C0\u67E5")}</button>`:""}</div><footer>${P("Support appears when needed. Reopen it here at any time. This preview uses authored guidance, not live AI.","\u5B66\u4E60\u652F\u6301\u4EC5\u5728\u9700\u8981\u65F6\u51FA\u73B0\uFF0C\u53EF\u968F\u65F6\u91CD\u65B0\u6253\u5F00\u3002\u672C\u9884\u89C8\u4F7F\u7528\u9884\u8BBE\u6559\u5B66\u5F15\u5BFC\uFF0C\u672A\u8FDE\u63A5\u5B9E\u65F6 AI\u3002")}</footer>`),U("watch").onclick=Lu,U("parts").onclick=()=>xv(0),U("practice").onclick=Eu,U("explore").onclick=()=>{Zt=4,_n=!0,vn(),xt=-1,de.spec.mode==="practice"&&ps("mission",!0),Ht(),Ci()},U("quiz-again")?.addEventListener("click",Uu)}var Du=[{p:[120,-155,110],text:["Approach A from above: X 120, Y \u2212155, Z 110. Move, then record.","\u4ECE A \u4E0A\u65B9\u63A5\u8FD1\uFF1AX 120\u3001Y \u2212155\u3001Z 110\u3002\u79FB\u52A8\u540E\u8BB0\u5F55\u3002"]},{p:[120,-155,20],text:["Lower to Z 20. Keep X and Y unchanged. Move, then record.","\u4E0B\u964D\u81F3 Z 20\uFF0C\u4FDD\u6301 X\u3001Y \u4E0D\u53D8\u3002\u79FB\u52A8\u540E\u8BB0\u5F55\u3002"]},{on:!0,text:["Close the gripper and add \u201C\uFF0B Close\u201D to the program, in either order. DI1 must confirm a held box.","\u95ED\u5408\u5939\u722A\u5E76\u6DFB\u52A0\u201C\uFF0B \u95ED\u5408\u201D\uFF0C\u987A\u5E8F\u4E0D\u9650\u3002DI1 \u5FC5\u987B\u786E\u8BA4\u5DF2\u5939\u4F4F\u7BB1\u5B50\u3002"]},{p:[120,-155,110],text:["Lift to Z 110 before travelling. Move, then record.","\u5E73\u79FB\u524D\u5148\u62AC\u5347\u81F3 Z 110\uFF0C\u79FB\u52A8\u540E\u8BB0\u5F55\u3002"]},{p:[170,90,110],text:["Travel above the truck: X 170, Y 90, Z 110. Move, then record.","\u5E73\u79FB\u81F3\u8F66\u53A2\u4E0A\u65B9\uFF1AX 170\u3001Y 90\u3001Z 110\u3002\u79FB\u52A8\u540E\u8BB0\u5F55\u3002"]},{p:[170,90,40],text:["Deck height 20 + box height 20 = Z 40. Lower, then record.","\u5E95\u677F\u9AD8 20 + \u7BB1\u9AD8 20 = Z 40\u3002\u4E0B\u964D\u540E\u8BB0\u5F55\u3002"]},{on:!1,text:["Open the gripper and add \u201C\uFF0B Open\u201D to the program, in either order.","\u5F20\u5F00\u5939\u722A\u5E76\u5411\u7A0B\u5E8F\u6DFB\u52A0\u201C\uFF0B \u5F20\u5F00\u201D\uFF0C\u987A\u5E8F\u4E0D\u9650\u3002"]},{p:[170,90,110],text:["Lift clear to Z 110 and record the final position.","\u62AC\u5347\u81F3 Z 110 \u79BB\u5F00\u7BB1\u5B50\uFF0C\u8BB0\u5F55\u6700\u540E\u4E00\u4E2A\u4F4D\u7F6E\u3002"]},{text:["Press Run. The scene resets and your complete program performs the transfer.","\u70B9\u51FB\u201C\u8FD0\u884C\u201D\u3002\u573A\u666F\u4F1A\u91CD\u7F6E\uFF0C\u7531\u4F60\u7684\u5B8C\u6574\u7A0B\u5E8F\u5B8C\u6210\u642C\u8FD0\u3002"]}];async function lv(){let i=qi(),e=[];for(let t of Du.slice(0,8))if(t.p){let n=gs(new ei("practice"),i,t.p,0);if(n.error)throw Error(n.error);i=n.frames.at(-1),e.push({type:"move",p:t.p,yaw:0,q:[...i],joint:!1})}else e.push({type:"grip",on:t.on});return e}function Lu(){Tt||ot||(en.close(),Zt=0,_n=!1,vn(),iv.start(()=>{pi[0]=!0,Nu()}))}async function Nu(){Zt=1,_n=!1,vn(),xt=-1,ps("practice",!0),Gt="xyz",Wi(),ut=await lv(),jt(),Iu(!0)}function yp(i,e=!1){let t=Sp[i];U("guide").hidden=!1,U("guide").innerHTML=`<strong>${P("Teacher demonstration","\u6559\u5E08\u793A\u8303")} \xB7 ${i+1} / 8</strong><p>${P(...t.demo)}</p><p class="purpose">${P(...t.why)}</p>${e?`<div class="actions"><button id="demo-next" class="primary">${P(i===7?"Try it yourself \u2192":"Continue \u2192",i===7?"\u81EA\u5DF1\u8BD5\u8BD5 \u2192":"\u7EE7\u7EED \u2192")}</button><button id="demo-replay">${P("Replay action","\u91CD\u64AD\u6B64\u52A8\u4F5C")}</button></div>`:""}`}function cv(i){return yp(i,!0),$i(),new Promise(e=>{zr=e,U("demo-next").onclick=()=>{zr=null,e("next")},U("demo-replay").onclick=()=>{zr=null,e("replay")}})}function Eu(){Tt||ot||(Zt=2,_n=!1,vn(),en.close(),ps("practice",!0),xt=0,Gt="xyz",Wi(),Ht())}function Ht(){if(document.querySelectorAll(".pulse").forEach(l=>l.classList.remove("pulse")),xt<0){U("guide").hidden=!0;return}let i=Du[xt],e=Sp[xt],t=tt(Ke).tip,n=i.p&&Dt(t,i.p)<3,s=i.p&&Dt(zt,i.p)<.1,r=i.on!==void 0&&de.output===i.on&&(i.on?de.input:!de.input&&de.score===1),o=i.p?[[s,P("Set the target coordinates","\u8BBE\u7F6E\u76EE\u6807\u5750\u6807")],[n,P("Move to the target","\u79FB\u52A8\u81F3\u76EE\u6807")],[!1,P("Record this position","\u8BB0\u5F55\u6B64\u4F4D\u7F6E")]]:xt===8?[[!1,P("Run your complete program","\u8FD0\u884C\u5B8C\u6574\u7A0B\u5E8F")]]:[[r,P(i.on?"Close and confirm an object is held":"Open and confirm the box is placed",i.on?"\u95ED\u5408\u5E76\u786E\u8BA4\u5DF2\u5939\u4F4F\u7269\u4F53":"\u5F20\u5F00\u5E76\u786E\u8BA4\u7BB1\u5B50\u5DF2\u653E\u597D")],[!!di,P("Save the gripper command","\u4FDD\u5B58\u5939\u722A\u6307\u4EE4")]];U("guide").hidden=!1,U("guide").innerHTML=`<strong>${P("Your turn","\u8F6E\u5230\u4F60\u4E86")} \xB7 ${xt+1} / 9 \xB7 ${P(...e.title)}</strong><p class="purpose">${P(...e.why)}</p>${i.p?`<p class="guide-coordinates">${P(Wt==="bed"?"BED target":"ROBOT target",Wt==="bed"?"\u8F66\u53A2\u76EE\u6807":"\u673A\u5668\u4EBA\u76EE\u6807")}: ${$r(i.p).map((l,c)=>"XYZ"[c]+" "+xn(l)).join(" \xB7 ")} mm</p>`:""}<ol class="action-checks">${o.map(([l,c])=>`<li class="${l?"done":""}">${l?"\u2713":"\u25CB"} ${c}</li>`).join("")}</ol><div class="actions">${i.p&&!s?`<button id="fill-guide">${P("Fill target","\u586B\u5165\u76EE\u6807")}</button>`:""}<button id="hide-guide">${P("Hide guidance","\u6536\u8D77\u5F15\u5BFC")}</button></div>`,U("fill-guide")?.addEventListener("click",()=>{zt=[...i.p],Qt=0,Ot="down",Fn="linear",Gt="xyz",Wi(),Ht()}),U("hide-guide").onclick=()=>{U("guide").hidden=!0,document.querySelectorAll(".pulse").forEach(l=>l.classList.remove("pulse"))};let a=xt===8?"run":i.p?n?"record":s?"move":"fill-guide":r?i.on?"add-close":"add-open":i.on?"grip-close":"grip-open";U(a)?.classList.add("pulse")}function vp(i){if(xt<0||xt>=8)return;let e=Du[xt];i&&(e.p&&i.type==="move"||!e.p&&i.type==="grip"&&i.on===e.on)&&(di=i),ut.includes(di)||(di=null),dp(e,di,de)?(xt++,di=null,Ht()):!e.p&&di?(Ht(),Mt("ready",P("Program command saved. Now use the gripper control; you do not need to add the command again.","\u7A0B\u5E8F\u6307\u4EE4\u5DF2\u4FDD\u5B58\u3002\u73B0\u5728\u64CD\u4F5C\u5939\u722A\u5373\u53EF\uFF0C\u65E0\u9700\u91CD\u590D\u6DFB\u52A0\u6307\u4EE4\u3002"))):i?i&&Mt("ready",P("Recorded. Follow the highlighted instruction to continue.","\u5DF2\u8BB0\u5F55\uFF0C\u8BF7\u6309\u9AD8\u4EAE\u63D0\u793A\u7EE7\u7EED\u3002")):Ht()}function Uu(){Zt=3,vn(),nn(dn(P("Can you explain your decisions?","\u80FD\u89E3\u91CA\u4F60\u7684\u51B3\u5B9A\u5417\uFF1F"))+`<p>${P("Three ideas to carry into the independent mission.","\u628A\u8FD9\u4E09\u4E2A\u60F3\u6CD5\u5E26\u5165\u72EC\u7ACB\u4EFB\u52A1\u3002")}</p>${[[P("1. Why lift before travelling sideways?","1. \u4E3A\u4EC0\u4E48\u8981\u5148\u62AC\u5347\uFF0C\u518D\u6C34\u5E73\u79FB\u52A8\uFF1F"),[P("To keep the carried box clear of other objects.","\u8BA9\u6240\u642C\u8FD0\u7684\u7BB1\u5B50\u907F\u5F00\u5176\u4ED6\u7269\u4F53\u3002"),P("A robot can only move upwards.","\u673A\u5668\u4EBA\u53EA\u80FD\u5411\u4E0A\u79FB\u52A8\u3002")]],[P("2. Matching total floor areas proves the boxes will fit.","2. \u7BB1\u5B50\u603B\u5E95\u9762\u79EF\u4E0E\u8F66\u53A2\u9762\u79EF\u76F8\u7B49\uFF0C\u5C31\u4E00\u5B9A\u80FD\u88C5\u4E0B\u3002"),[P("True. Area alone guarantees a fit.","\u6B63\u786E\uFF0C\u9762\u79EF\u76F8\u7B49\u5C31\u4E00\u5B9A\u80FD\u88C5\u4E0B\u3002"),P("False. Dimensions and arrangement also matter.","\u9519\u8BEF\uFF0C\u8FD8\u8981\u68C0\u67E5\u5C3A\u5BF8\u548C\u6392\u5217\u65B9\u5F0F\u3002")]],[P("3. DO1 ON but DI1 OFF means\u2026","3. DO1 \u4E3A ON\uFF0CDI1 \u4E3A OFF\uFF0C\u8868\u793A\u2026\u2026"),[P("The box has been loaded.","\u7BB1\u5B50\u5DF2\u88C5\u5165\u8F66\u53A2\u3002"),P("Close was commanded, but nothing is held.","\u5DF2\u53D1\u51FA\u95ED\u5408\u6307\u4EE4\uFF0C\u4F46\u6CA1\u6709\u5939\u4F4F\u7BB1\u5B50\u3002")]]].map(([i,e],t)=>`<div class="quiz-item"><p>${i}</p>${e.map((n,s)=>`<label><input type="radio" name="quiz-${t}" value="${s}" ${Tc[t]===s?"checked":""}> ${n}</label>`).join("")}</div>`).join("")}<p id="quiz-feedback" class="feedback"></p><div class="actions"><button id="check-quiz" class="primary">${P("Check understanding","\u68C0\u67E5\u7406\u89E3")}</button><button id="lesson-return">${P("Revisit lesson","\u56DE\u770B\u8BFE\u7A0B")}</button></div>`),document.querySelectorAll('[name^="quiz-"]').forEach(i=>i.onchange=()=>{Tc[Number(i.name.slice(5))]=Number(i.value)}),U("lesson-return").onclick=()=>Gs(),U("check-quiz").onclick=()=>{let i=[0,1,1].map((e,t)=>document.querySelector(`input[name="quiz-${t}"]:checked`)?.value===String(e));i.every(Boolean)?(Ru=!0,pi[3]=!0,vn(),U("quiz-feedback").textContent=P("Ready. Plan your own loading strategy.","\u51C6\u5907\u597D\u4E86\u3002\u5F00\u59CB\u89C4\u5212\u4F60\u81EA\u5DF1\u7684\u88C5\u8F7D\u7B56\u7565\u3002"),U("check-quiz").textContent=P("Start mission \u2192","\u5F00\u59CB\u72EC\u7ACB\u4EFB\u52A1 \u2192"),U("check-quiz").onclick=()=>{Zt=4,_n=!0,vn(),xt=-1,ps("mission",!0),Ht(),Ci()}):U("quiz-feedback").textContent=P("Revisit questions ","\u8BF7\u91CD\u65B0\u601D\u8003\u7B2C ")+i.map((e,t)=>e?null:t+1).filter(Boolean).join(", ")+P(". Clearance prevents collisions; area alone does not prove fit; DI1 confirms an actual grip."," \u9898\u3002\u7559\u51FA\u51C0\u7A7A\u80FD\u907F\u969C\uFF1B\u9762\u79EF\u76F8\u7B49\u4E0D\u4FDD\u8BC1\u80FD\u6392\u4E0B\uFF1BDI1 \u7528\u4E8E\u786E\u8BA4\u5B9E\u9645\u5939\u6301\u3002")}}function Ci(){if(de.spec.mode==="practice"){nn(dn(P("Your guided transfer","\u5F15\u5BFC\u642C\u8FD0\u7EC3\u4E60"))+`<p>${P("Follow the learning prompts, then run your saved program.","\u6309\u7167\u5B66\u4E60\u63D0\u793A\u64CD\u4F5C\uFF0C\u518D\u8FD0\u884C\u5DF2\u4FDD\u5B58\u7684\u7A0B\u5E8F\u3002")}</p><button id="back-practice" class="primary">${P("Continue practice","\u7EE7\u7EED\u7EC3\u4E60")}</button>`),U("back-practice").onclick=()=>{en.close(),Ht()};return}if(de.spec.mode==="shelf")return Ep();nn(dn(P("Design \u2192 commit \u2192 execute \u2192 reflect","\u8BBE\u8BA1 \u2192 \u63D0\u4EA4 \u2192 \u6267\u884C \u2192 \u53CD\u601D"),P("MY PLACEMENT PLAN","\u6211\u7684\u653E\u7F6E\u65B9\u6848"))+`<div id="planning-root"></div>${Rc&&de.spec.mode!=="stacking"?`<button id="start-stacking">${P("Task 2: stacking + obstacle \u2192","\u4EFB\u52A1 2\uFF1A\u5806\u53E0\u4E0E\u969C\u788D \u2192")}</button>`:""}`),Ju({root:U("planning-root"),t:P,world:de,plan:Gi,routes:Vr,strategy:Gr,active:!!Ue&&!Ue.finished,onDraft:(i,e,t)=>{Gi=i,Vr=e,Gr=t},onStart:hv}),U("start-stacking")?.addEventListener("click",()=>{ps("stacking",!0),Ci()})}function ta(){return Ue?Ue.elapsedMs+(Yn===null?0:Math.max(0,performance.now()-Yn)):0}function bp(i){let e=Math.floor(i/1e3);return`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`}function na(){U("attempt-bar")&&(U("attempt-bar").hidden=de.spec.mode==="practice");let i=U("attempt-clock");i&&(i.textContent=Ue?`${P(Ue.finished?"Completed":"Task time",Ue.finished?"\u5DF2\u5B8C\u6210":"\u4EFB\u52A1\u7528\u65F6")} ${bp(ta())}`:P("Planning \xB7 timer not started","\u89C4\u5212\u4E2D \xB7 \u5C1A\u672A\u8BA1\u65F6"),U("attempt-action").textContent=P(Ue?.finished?"Results":Ue&&Yn===null?"Resume timer":"My plan",Ue?.finished?"\u67E5\u770B\u7ED3\u679C":Ue&&Yn===null?"\u6062\u590D\u8BA1\u65F6":"\u6211\u7684\u65B9\u6848"))}function hv(i,e,t){let n=Ue&&!Ue.finished?Ue:null,s=ta();Ic(),de.reset(),Ke=qi(),Bt.clearTrail(),Gi=i,Vr=e,Gr=t,n?(n.history.push({plan:n.plan,routes:n.routes,strategy:n.strategy,elapsedMs:s}),n.history.length>100&&n.history.shift(),n.plan=structuredClone(i),n.routes=structuredClone(e),n.strategy=t,n.traces={},n.revisions++,n.restarts++,n.elapsedMs=s,Ue=n):Ue=fa(i,e,t,de.spec.mode),Yn=performance.now(),fs=!0,Zn=!0,Wt="bed",xt=-1,Zt=4,_n=!0,Ri(),jt(),Ht(),vn(),yn(),na(),en.close(),Mt("ready",P("Plan committed. Timer running. Build and execute your own solution.","\u65B9\u6848\u5DF2\u63D0\u4EA4\uFF0C\u5F00\u59CB\u8BA1\u65F6\u3002\u8BF7\u7F16\u5199\u5E76\u6267\u884C\u81EA\u5DF1\u7684\u89E3\u51B3\u65B9\u6848\u3002"))}function Lc(i=!1){return de.spec.mode==="practice"||de.spec.mode==="shelf"||i?!0:Ue?.finished?(Nc(),!1):Ue?Yn===null?(Mt("ready",P("Choose Resume timer to continue this saved attempt.","\u70B9\u51FB\u201C\u6062\u590D\u8BA1\u65F6\u201D\u7EE7\u7EED\u5DF2\u4FDD\u5B58\u7684\u5C1D\u8BD5\u3002")),!1):!0:(Mt("planNeeded"),Ci(),!1)}function Mp(i){let e=de.command(i,Ke);return Cc.includes(e)&&Ue&&!Ue.finished&&Ue.blocked++,e}function Fu(){if(!Ue||Ue.finished||de.score!==de.objects.length)return!1;let i=Gc(Ue,de,ta());return i.complete?(Ue.elapsedMs=i.elapsedMs,Yn=null,Ue.finished=!0,Ue.result=i,de.spec.mode==="mission"&&(Rc=!0),pi[4]=!0,vn(),na(),!0):!1}function Nc(){if(!Ue){nn(dn(P("Task complete. Export your progress or review the learning journey.","\u4EFB\u52A1\u5B8C\u6210\u3002\u53EF\u4EE5\u5BFC\u51FA\u8FDB\u5EA6\u6216\u56DE\u770B\u5B66\u4E60\u4E4B\u65C5\u3002")));return}Fu();let i=Ue.result||Gc(Ue,de,ta());nn(dn(P(i.complete?"Your plan, tested.":"Your attempt so far.",i.complete?"\u65B9\u6848\u5DF2\u5B8C\u6210\u68C0\u9A8C\u3002":"\u5F53\u524D\u5C1D\u8BD5\u3002"),P("REFLECT \xB7 COMPARE \xB7 IMPROVE","\u53CD\u601D \xB7 \u6BD4\u8F83 \xB7 \u6539\u8FDB"))+`<div class="assessment-total"><b>${i.total} / 100</b><span>${bp(i.elapsedMs)} \xB7 ${de.score} / ${de.objects.length} ${P("boxes","\u7BB1")}</span></div><div class="rubric-scores">${[["space",45,"Space","\u7A7A\u95F4"],["placement",40,"Placement","\u653E\u7F6E"],["speed",15,"Time","\u65F6\u95F4"]].map(([e,t,n,s])=>`<div>${P(n,s)}<b>${i.points[e]} / ${t}</b></div>`).join("")}</div><p>${P("Load compactness","\u88C5\u8F7D\u7D27\u51D1\u5EA6")}: ${(i.compactness*100).toFixed(1)}% \xB7 ${P("Used envelope","\u5360\u7528\u5305\u56F4\u5C3A\u5BF8")}: ${i.usedSize.map(e=>xn(e)).join(" \xD7 ")} mm</p><p>${P("Total tool travel","\u5DE5\u5177\u603B\u8DEF\u5F84")} ${Math.round(i.travel)} mm \xB7 ${P("Blocked actions","\u88AB\u963B\u6B62\u52A8\u4F5C")} ${i.blocked} \xB7 ${P("Plan revisions","\u65B9\u6848\u4FEE\u6539")} ${i.revisions} \xB7 ${P("Scene restarts","\u573A\u666F\u91CD\u7F6E")} ${i.restarts}</p><div class="result-table"><table><thead><tr><th>${P("Box","\u7BB1\u5B50")}</th><th>${P("Planned XYZ","\u89C4\u5212 XYZ")}</th><th>${P("Actual XYZ","\u5B9E\u9645 XYZ")}</th><th>${P("Position error","\u4F4D\u7F6E\u8BEF\u5DEE")}</th></tr></thead><tbody>${i.perBox.map(e=>`<tr><td>${e.id}</td><td>${ks(e.target,Vi(de.spec)).map(xn).join(", ")}</td><td>${ks(e.actual,Vi(de.spec)).map(xn).join(", ")}</td><td>${e.errorMm.toFixed(1)} mm</td></tr>`).join("")}</tbody></table></div><p><b>${P("Goal of this plan","\u672C\u65B9\u6848\u7684\u76EE\u6807")}</b><br>${Hr(Ue.strategy)}</p><label>${P("What worked? What changed after a collision? What would you optimize next time, and why?","\u54EA\u4E9B\u6709\u6548\uFF1F\u78B0\u649E\u540E\u6539\u53D8\u4E86\u4EC0\u4E48\uFF1F\u4E0B\u4E00\u6B21\u8981\u4F18\u5316\u4EC0\u4E48\uFF0C\u4E3A\u4EC0\u4E48\uFF1F")}<textarea id="reflection" maxlength="4000">${Hr(Ko)}</textarea></label><p>${P("Your explanation is for teacher discussion. Time targets are provisional classroom goals; this score is feedback on the simulation, not proof of learning.","\u89E3\u91CA\u4F9B\u6559\u5E08\u8BA8\u8BBA\u3002\u65F6\u95F4\u76EE\u6807\u4E3A\u6682\u5B9A\u8BFE\u5802\u76EE\u6807\uFF1B\u6B64\u5206\u6570\u53CD\u6620\u4EFF\u771F\u8868\u73B0\uFF0C\u4E0D\u4EE3\u8868\u5DF2\u8BC1\u660E\u5B66\u4E60\u6210\u6548\u3002")}</p><div class="actions"><button id="save-attempt" class="primary">${P("Export attempt & progress","\u5BFC\u51FA\u5C1D\u8BD5\u4E0E\u8FDB\u5EA6")}</button><button id="improve-plan">${P("Design a new attempt","\u8BBE\u8BA1\u65B0\u5C1D\u8BD5")}</button>${i.complete&&de.spec.mode==="mission"?`<button id="next-task">${P("Task 2: stacking + obstacle \u2192","\u4EFB\u52A1 2\uFF1A\u5806\u53E0\u4E0E\u969C\u788D \u2192")}</button>`:""}</div>`),U("reflection").oninput=e=>Ko=e.target.value,U("save-attempt").onclick=Bu,U("improve-plan").onclick=Ci,U("next-task")?.addEventListener("click",()=>{ps("stacking",!0),Ci()})}function uv(){if(de.spec.mode==="shelf")return Ep();if(de.spec.mode==="stacking"){nn(dn(P("Review your route in three dimensions.","\u4ECE\u4E09\u4E2A\u7EF4\u5EA6\u68C0\u67E5\u8DEF\u7EBF\u3002"))+`<p>${P("The person\u2019s marked obstacle zone has width, depth and height. Compare its position with the gripper and carried box along each segment. The plan uses box-bottom levels; the movement target is the top centre. Every upper box needs full support.","\u4EBA\u7269\u6807\u793A\u533A\u57DF\u6709\u5BBD\u3001\u6DF1\u3001\u9AD8\u3002\u6CBF\u6BCF\u6BB5\u8DEF\u7EBF\u6BD4\u8F83\u969C\u788D\u7269\u4E0E\u5939\u722A\u3001\u6240\u5939\u7BB1\u5B50\u7684\u4F4D\u7F6E\u3002\u65B9\u6848\u5C42\u9AD8\u6307\u7BB1\u5E95\uFF0C\u79FB\u52A8\u76EE\u6807\u4E3A\u7BB1\u9876\u4E2D\u5FC3\u3002\u6BCF\u4E2A\u4E0A\u5C42\u7BB1\u5B50\u90FD\u9700\u8981\u5B8C\u6574\u652F\u6491\u3002")}</p><button id="review-stacking">${P("Review my plan","\u68C0\u67E5\u6211\u7684\u65B9\u6848")}</button>`),U("review-stacking").onclick=Ci;return}nn(dn(P("A little help, when you need it.","\u9700\u8981\u65F6\uFF0C\u7ED9\u4F60\u4E00\u70B9\u5E2E\u52A9\u3002"),P("TEACHER NOTES \u2022 BUILT-IN GUIDANCE","\u6559\u5E08\u63D0\u793A \xB7 \u5185\u7F6E\u5F15\u5BFC"))+`<p>${Hr(P(...Wr[ea]||Wr.ready))}</p><div class="help-grid"><button data-help="move">${P("How do I move a box?","\u600E\u6837\u642C\u8FD0\u7BB1\u5B50\uFF1F")}</button><button data-help="program">${P("How do I build a program?","\u600E\u6837\u7F16\u5199\u7A0B\u5E8F\uFF1F")}</button><button data-help="collision">${P("My path hits something.","\u8DEF\u5F84\u53D1\u751F\u78B0\u649E\u3002")}</button><button id="coordinate-help">${P("Learn local zero","\u5B66\u4E60\u5C40\u90E8\u96F6\u70B9")}</button><button data-help="math">${P("How do I plan the load?","\u600E\u6837\u89C4\u5212\u88C5\u8F7D\uFF1F")}</button></div><div id="help-answer" class="feedback"></div><div class="actions"><button id="open-lesson">${P("Open learning journey","\u6253\u5F00\u5B66\u4E60\u4E4B\u65C5")}</button>${xt>=0?`<button id="resume-guide">${P("Show next step","\u663E\u793A\u4E0B\u4E00\u6B65")}</button>`:""}</div>`);let i={move:["1. Open. 2. Move above a box centre. 3. Lower to Z 20. 4. Close and check DI1. 5. Lift to Z 110. 6. Travel above your destination. 7. Lower to Z 40 and open. 8. Lift away. The 110 mm height is a conservative example, not a universal minimum.","1. \u5F20\u5F00\u30022. \u79FB\u81F3\u7BB1\u5B50\u4E2D\u5FC3\u4E0A\u65B9\u30023. \u964D\u5230 Z 20\u30024. \u95ED\u5408\u5E76\u786E\u8BA4 DI1\u30025. \u62AC\u5347\u81F3 Z 110\u30026. \u79FB\u81F3\u76EE\u6807\u4E0A\u65B9\u30027. \u964D\u81F3 Z 40 \u5E76\u5F20\u5F00\u30028. \u62AC\u5347\u79BB\u5F00\u3002110 mm \u662F\u4FDD\u5B88\u7684\u793A\u4F8B\u9AD8\u5EA6\uFF0C\u4E0D\u662F\u901A\u7528\u6700\u5C0F\u503C\u3002"],program:["Record useful positions. After pickup, add Close and Wait DI1. Record lift, travel and lowering positions; add Open and record retreat. Run resets the boxes and tests the whole sequence.","\u8BB0\u5F55\u5173\u952E\u4F4D\u7F6E\u3002\u6293\u53D6\u4F4D\u7F6E\u540E\u6DFB\u52A0\u201C\u95ED\u5408\u201D\u548C\u201C\u7B49\u5F85 DI1\u201D\u3002\u8BB0\u5F55\u62AC\u5347\u3001\u5E73\u79FB\u3001\u4E0B\u964D\u4F4D\u7F6E\uFF0C\u6DFB\u52A0\u201C\u5F20\u5F00\u201D\uFF0C\u518D\u8BB0\u5F55\u79BB\u5F00\u4F4D\u7F6E\u3002\u8FD0\u884C\u4F1A\u91CD\u7F6E\u7BB1\u5B50\u5E76\u6D4B\u8BD5\u6574\u4E2A\u7A0B\u5E8F\u3002"],collision:["Identify what would touch: cargo, deck or another box. Increase only Z first, then move X/Y, then lower. A shorter diagonal path can cut through cargo. Record the extra position so the program repeats the safe route.","\u5224\u65AD\u5C06\u78B0\u5230\u8D27\u7269\u3001\u5E95\u677F\u8FD8\u662F\u5176\u4ED6\u7BB1\u5B50\u3002\u5148\u53EA\u589E\u52A0 Z\uFF0C\u518D\u79FB\u52A8 X/Y\uFF0C\u6700\u540E\u4E0B\u964D\u3002\u8F83\u77ED\u7684\u659C\u7EBF\u8DEF\u5F84\u53EF\u80FD\u7A7F\u8FC7\u8D27\u7269\u3002\u8BB0\u5F55\u65B0\u589E\u4F4D\u7F6E\uFF0C\u8BA9\u7A0B\u5E8F\u91CD\u590D\u53EF\u884C\u8DEF\u7EBF\u3002"],math:["Add all box floor areas and compare with the truck area. Draw a non-overlapping arrangement. Use half the rotated dimensions to convert a box corner into its centre. Matching areas do not guarantee the shapes fit.","\u6C42\u51FA\u7BB1\u5B50\u5E95\u9762\u79EF\u4E4B\u548C\uFF0C\u4E0E\u8F66\u53A2\u9762\u79EF\u6BD4\u8F83\uFF0C\u753B\u51FA\u4E0D\u91CD\u53E0\u7684\u6392\u5217\u3002\u5229\u7528\u65CB\u8F6C\u540E\u5C3A\u5BF8\u7684\u4E00\u534A\uFF0C\u5C06\u89D2\u70B9\u6362\u7B97\u4E3A\u4E2D\u5FC3\u3002\u9762\u79EF\u76F8\u7B49\u4E0D\u4FDD\u8BC1\u5F62\u72B6\u80FD\u6392\u4E0B\u3002"]};document.querySelectorAll("[data-help]").forEach(e=>e.onclick=()=>{U("help-answer").textContent=e.dataset.help==="move"&&Wt==="bed"?P("BED coordinates: 1. Open. 2. Approach above the box centre. 3. At the source, lower to Z 0. 4. Close and check DI1. 5. Lift to Z 90. 6. Travel above your planned centre. 7. Lower to Z 20 and open. 8. Lift away. These heights refer to the bed surface, not the floor.","\u8F66\u53A2\u5750\u6807\uFF1A1. \u5F20\u5F00\u30022. \u79FB\u81F3\u7BB1\u5B50\u4E2D\u5FC3\u4E0A\u65B9\u30023. \u5728\u53D6\u8D27\u533A\u964D\u81F3 Z 0\u30024. \u95ED\u5408\u5E76\u786E\u8BA4 DI1\u30025. \u62AC\u5347\u81F3 Z 90\u30026. \u79FB\u81F3\u89C4\u5212\u7684\u4E2D\u5FC3\u4E0A\u65B9\u30027. \u964D\u81F3 Z 20 \u5E76\u5F20\u5F00\u30028. \u62AC\u5347\u79BB\u5F00\u3002\u8FD9\u91CC\u7684\u9AD8\u5EA6\u76F8\u5BF9\u8F66\u53A2\u8868\u9762\uFF0C\u4E0D\u662F\u5730\u9762\u3002"):P(...i[e.dataset.help])}),U("coordinate-help").onclick=ia,U("open-lesson").onclick=()=>Gs(),U("resume-guide")?.addEventListener("click",()=>{en.close(),Ht()})}function dv(i,e){let t=URL.createObjectURL(new Blob([JSON.stringify(e,null,2)],{type:"application/json"})),n=document.createElement("a");n.href=t,n.download=i,n.click(),setTimeout(()=>URL.revokeObjectURL(t),1e3)}U("attempt-action").onclick=()=>{Ue?.finished?Nc():Ue&&Yn===null?(Yn=performance.now(),en.close(),na(),Mt("ready",P("Timer resumed. Continue your attempt.","\u8BA1\u65F6\u5DF2\u6062\u590D\uFF0C\u8BF7\u7EE7\u7EED\u5C1D\u8BD5\u3002"))):Ci()};U("record").onclick=rv;U("add-close").onclick=()=>Dc({type:"grip",on:!0});U("add-open").onclick=()=>Dc({type:"grip",on:!1});U("add-wait").onclick=()=>Dc({type:"wait"});U("grip-open").onclick=()=>xp(!1);U("grip-close").onclick=()=>xp(!0);U("run").onclick=()=>Iu();U("pause").onclick=ov;U("stop").onclick=Ic;U("reset").onclick=()=>xt>=0?Eu():ps();U("clear").onclick=()=>{nn(dn(P("Clear this program?","\u6E05\u7A7A\u6B64\u7A0B\u5E8F\uFF1F"))+`<p>${P("Save first to keep this sequence.","\u5982\u9700\u4FDD\u7559\u6B64\u7A0B\u5E8F\uFF0C\u8BF7\u5148\u4FDD\u5B58\u3002")}</p><div class="actions"><button id="confirm-clear" class="primary">${P("Clear program","\u6E05\u7A7A\u7A0B\u5E8F")}</button></div>`),U("confirm-clear").onclick=()=>{Qo(),ut=[],jt(),en.close()}};U("save").onclick=Bu;U("load").onclick=()=>U("file").click();U("file").onchange=async i=>{try{let e=i.target.files[0];if(!e)return;if(e.size>5e6)throw Error();Mu=Qu(JSON.parse(await e.text())),nn(dn(P("Restore this saved session?","\u6062\u590D\u6B64\u5B66\u4E60\u8FDB\u5EA6\uFF1F"))+`<p>${P("This replaces the current session. Export your progress below first if you want to keep it. The robot will remain stopped.","\u8FD9\u4F1A\u66FF\u6362\u5F53\u524D\u5B66\u4E60\u72B6\u6001\u3002\u5982\u9700\u4FDD\u7559\uFF0C\u8BF7\u5148\u5BFC\u51FA\u5F53\u524D\u8FDB\u5EA6\u3002\u6062\u590D\u540E\u673A\u5668\u4EBA\u4FDD\u6301\u505C\u6B62\u3002")}</p><button id="restore-confirm" class="primary">${P("Restore progress","\u6062\u590D\u8FDB\u5EA6")}</button>`),U("restore-confirm").onclick=()=>{gv(Mu),Mu=null}}catch{Mt("numbers",P("Invalid progress file. Your current session is unchanged.","\u8FDB\u5EA6\u6587\u4EF6\u65E0\u6548\u3002\u5F53\u524D\u5B66\u4E60\u72B6\u6001\u4FDD\u6301\u4E0D\u53D8\u3002"))}finally{i.target.value=""}};U("undo").onclick=()=>{ds.length&&(ut=ds.pop(),jt(),xt>=0&&Ht())};U("top-view").onclick=()=>Bt.view("top");U("front-view").onclick=()=>Bt.view("side");U("iso-view").onclick=()=>Bt.view("iso");U("trail").onchange=i=>Bt.setTrail(i.target.checked);U("path-preview").onchange=i=>{Bt.setPreviewVisible(i.target.checked),U("path-feedback").hidden=!i.target.checked||!Cu};U("preview-program").onclick=()=>{Hs="program",Ec="",U("path-preview").checked=!0,Bt.setPreviewVisible(!0),Uc()};U("journey-toggle").onclick=()=>{_n=!_n,vn()};U("mission-button").onclick=Ci;U("learn-button").onclick=()=>Ou();U("help").onclick=uv;U("coordinate-frame").onchange=i=>{if(i.target.value==="bed"&&!Zn){i.target.value=Wt,ia();return}Wt=i.target.value,Ri(),jt(),yn(),xt>=0&&!U("guide").hidden&&Ht(),Mt("ready",P("Coordinate display changed. The robot and saved positions did not move.","\u5750\u6807\u663E\u793A\u5DF2\u5207\u6362\uFF0C\u673A\u5668\u4EBA\u548C\u5DF2\u8BB0\u5F55\u7684\u4F4D\u7F6E\u4E0D\u53D8\u3002"))};U("set-zero").onclick=ia;U("language").onclick=()=>{On=On==="zh"?"en":"zh",localStorage.setItem("cargo-language",On),Pc()};document.querySelectorAll("[data-mode]").forEach(i=>i.onclick=()=>{Gt==="joints"&&i.dataset.mode!=="joints"&&(Ot="keep"),Gt=i.dataset.mode,Ri()});var Sp=[{title:["Approach box A","\u63A5\u8FD1\u7BB1\u5B50 A"],why:["Approaching from above leaves room to lower safely.","\u4ECE\u4E0A\u65B9\u63A5\u8FD1\uFF0C\u4E3A\u5B89\u5168\u4E0B\u964D\u7559\u51FA\u7A7A\u95F4\u3002"],demo:["I move above A and save this approach point.","\u6211\u79FB\u52A8\u5230 A \u4E0A\u65B9\uFF0C\u5E76\u4FDD\u5B58\u8FD9\u4E2A\u63A5\u8FD1\u70B9\u3002"]},{title:["Lower to the box","\u4E0B\u964D\u81F3\u7BB1\u5B50"],why:["Keep X and Y fixed so the gripper stays over the centre.","\u4FDD\u6301 X\u3001Y \u4E0D\u53D8\uFF0C\u8BA9\u5939\u722A\u59CB\u7EC8\u5BF9\u51C6\u4E2D\u5FC3\u3002"],demo:["I lower straight down to the top of the box.","\u6211\u7AD6\u76F4\u4E0B\u964D\u5230\u7BB1\u5B50\u9876\u90E8\u3002"]},{title:["Grip and check","\u5939\u6301\u5E76\u68C0\u67E5"],why:["A close command is not proof of a grip. DI1 confirms the box is held.","\u95ED\u5408\u6307\u4EE4\u4E0D\u4EE3\u8868\u5939\u6301\u6210\u529F\u3002DI1 \u786E\u8BA4\u662F\u5426\u5DF2\u5939\u4F4F\u7BB1\u5B50\u3002"],demo:["I close the gripper. DI1 turns on because a box is actually held.","\u6211\u95ED\u5408\u5939\u722A\u3002\u5B9E\u9645\u5939\u4F4F\u7BB1\u5B50\u540E\uFF0CDI1 \u53D8\u4E3A ON\u3002"]},{title:["Lift before travelling","\u5E73\u79FB\u524D\u62AC\u5347"],why:["Clear the surrounding cargo before moving sideways.","\u5148\u907F\u5F00\u5468\u56F4\u8D27\u7269\uFF0C\u518D\u6C34\u5E73\u79FB\u52A8\u3002"],demo:["I lift the box before travelling across the workspace.","\u6211\u5148\u62AC\u5347\u7BB1\u5B50\uFF0C\u518D\u7A7F\u8FC7\u5DE5\u4F5C\u533A\u3002"]},{title:["Travel above the truck","\u79FB\u81F3\u8F66\u53A2\u4E0A\u65B9"],why:["Keeping the load high avoids a diagonal path through obstacles.","\u4FDD\u6301\u9AD8\u5EA6\uFF0C\u907F\u514D\u659C\u7EBF\u8DEF\u5F84\u7A7F\u8FC7\u969C\u788D\u7269\u3002"],demo:["I travel above the planned placement centre.","\u6211\u79FB\u52A8\u5230\u89C4\u5212\u653E\u7F6E\u4E2D\u5FC3\u7684\u4E0A\u65B9\u3002"]},{title:["Lower onto the bed","\u4E0B\u964D\u81F3\u5E95\u677F"],why:["Deck 20 + box 20 = robot Z 40, or bed Z 20.","\u5E95\u677F 20 + \u7BB1\u9AD8 20 = \u673A\u5668\u4EBA Z 40\uFF0C\u5373\u8F66\u53A2 Z 20\u3002"],demo:["I lower until the box is supported by the truck bed.","\u6211\u4E0B\u964D\u7BB1\u5B50\uFF0C\u76F4\u5230\u7BB1\u5B50\u53D7\u5230\u8F66\u53A2\u5E95\u677F\u652F\u6491\u3002"]},{title:["Release the box","\u91CA\u653E\u7BB1\u5B50"],why:["Release only when the box has support; then check the result.","\u7BB1\u5B50\u6709\u652F\u6491\u540E\u518D\u91CA\u653E\uFF0C\u7136\u540E\u68C0\u67E5\u7ED3\u679C\u3002"],demo:["I open the gripper. The box stays on the bed and DI1 turns off.","\u6211\u5F20\u5F00\u5939\u722A\u3002\u7BB1\u5B50\u7559\u5728\u5E95\u677F\u4E0A\uFF0CDI1 \u53D8\u4E3A OFF\u3002"]},{title:["Retreat safely","\u5B89\u5168\u79BB\u5F00"],why:["Lift clear before starting the next pickup.","\u5F00\u59CB\u4E0B\u4E00\u6B21\u6293\u53D6\u524D\uFF0C\u5148\u62AC\u5347\u79BB\u5F00\u3002"],demo:["I lift away. These eight instructions form a repeatable transfer.","\u6211\u62AC\u5347\u79BB\u5F00\u3002\u8FD9\u516B\u6761\u6307\u4EE4\u7EC4\u6210\u53EF\u91CD\u590D\u7684\u642C\u8FD0\u7A0B\u5E8F\u3002"]},{title:["Test your program","\u6D4B\u8BD5\u7A0B\u5E8F"],why:["Playback checks the saved sequence, including gripper commands.","\u8FD0\u884C\u68C0\u67E5\u5DF2\u4FDD\u5B58\u7684\u52A8\u4F5C\u987A\u5E8F\uFF0C\u5305\u62EC\u5939\u722A\u6307\u4EE4\u3002"],demo:["",""]}],wu=[["Explore","\u8BA4\u8BC6"],["Watch","\u89C2\u5BDF"],["Practise","\u7EC3\u4E60"],["Check","\u68C0\u67E5"],["Solve","\u89E3\u51B3"]],Mu=null;function vn(){let i=U("journey-steps");U("journey-nav").classList.toggle("collapsed",_n),i.innerHTML=(_n?[Zt]:[0,1,2,3,4]).map(e=>`<button data-stage="${e}" class="${e===Zt?"current":""}" ${e===Zt?'aria-current="step"':""}><span>${pi[e]?"\u2713":e+1}</span>${P(...wu[e])}${_n?" \xB7 "+P("Learning journey","\u5B66\u4E60\u4E4B\u65C5"):""}</button>`).join(""),i.querySelectorAll("button").forEach(e=>e.onclick=()=>Ou()),U("journey-toggle").textContent=_n?P("Show stages","\u5C55\u5F00\u9636\u6BB5"):P("Collapse","\u6536\u8D77"),U("journey-toggle").setAttribute("aria-expanded",String(!_n))}function Ou(){Tt||ot||(nn(dn(P("Your learning journey","\u4F60\u7684\u5B66\u4E60\u4E4B\u65C5"))+`<p>${P("Current stage","\u5F53\u524D\u9636\u6BB5")}: <b>${P(...wu[Zt])}</b></p><ol class="journey-list">${wu.map((i,e)=>`<li>${pi[e]?"\u2713":"\u25CB"} ${P(...i)} ${Zt===e?"\u2190":""}</li>`).join("")}</ol><div class="actions"><button id="continue-learning" class="primary">${P("Continue here","\u4ECE\u8FD9\u91CC\u7EE7\u7EED")}</button><button id="review-learning">${P("Review lesson choices","\u67E5\u770B\u8BFE\u7A0B\u9009\u9879")}</button></div><p>${P("Export progress to continue on another day or device. Importing never starts movement.","\u5BFC\u51FA\u8FDB\u5EA6\u540E\uFF0C\u53EF\u5728\u53E6\u4E00\u5929\u6216\u53E6\u4E00\u53F0\u8BBE\u5907\u7EE7\u7EED\u3002\u5BFC\u5165\u4E0D\u4F1A\u542F\u52A8\u673A\u5668\u4EBA\u3002")}</p>`),U("continue-learning").onclick=()=>{en.close(),Tn>=0?_v():xt>=0?Ht():Zt===3?Uu():Zt===4?Ci():Zt===1?Nu():Lu()},U("review-learning").onclick=()=>Gs())}function Vs(i){Cu=i,Bt.setMotionPreview(i),Bt.setPreviewVisible(U("path-preview").checked);let e=U("path-feedback");if(e.hidden=!i||!U("path-preview").checked,e.classList.toggle("blocked",!!i?.error),i){let t=i.scope==="program"?P("Program \xB7 from reset","\u7A0B\u5E8F \xB7 \u4ECE\u91CD\u7F6E\u72B6\u6001\u5F00\u59CB"):P("Next move","\u4E0B\u4E00\u6B21\u79FB\u52A8");e.textContent=t+" \xB7 "+(i.error?(i.scope==="program"?P(`Step ${i.step+1}: `,`\u7B2C ${i.step+1} \u6B65\uFF1A`):"")+P(...Wr[i.error]||Wr.limits)+P(" Preview stops here. Red remainder is unchecked.","\u9884\u89C8\u5230\u6B64\u505C\u6B62\uFF1B\u7EA2\u8272\u540E\u7EED\u6BB5\u672A\u7ECF\u68C0\u67E5\u3002"):P("No blockage detected in this simulation. Dashed line = tool centre; ghost = end pose.","\u6B64\u4EFF\u771F\u672A\u68C0\u6D4B\u5230\u963B\u6321\u3002\u865A\u7EBF\u4E3A\u5DE5\u5177\u4E2D\u5FC3\u8DEF\u5F84\uFF1B\u534A\u900F\u660E\u6A21\u578B\u4E3A\u7EC8\u70B9\u59FF\u6001\u3002"))}document.querySelectorAll("#steps li").forEach((t,n)=>t.classList.toggle("preview-blocked",i?.scope==="program"&&!!i.error&&n===i.step))}function Uc(){if(Tt||ot)return;let i=JSON.stringify([On,Hs,de.spec.mode,Hs==="program"?ut:[Gt,Ke,zt,Qt,Ot,Fn,de.output,de.held,de.objects]]);if(i===Ec)return;if(Ec=i,Hs==="program"){Vs(ut.length?Zu(de,ut):null);return}let e=tt(Ke),t=Gt==="xyz"&&zt.every(Number.isFinite)&&zt.every(n=>Math.abs(n)<=600)&&Number.isFinite(Qt)&&(Dt(zt,e.tip)>1||Ot!=="free"&&Math.abs(Qt-e.rpy[2])>1||Ot==="down"&&(Math.abs(e.rpy[0])>1||Math.abs(e.rpy[1])>1));Vs(t?Ys(de,Ke,zt,Qt,null,pp(Qt)):null)}function Tu(){Hs="move",Ec="";let i=Gt==="xyz"&&zt.every(Number.isFinite)&&zt.every(e=>Math.abs(e)<=600)&&Dt(zt,tt(Ke).tip)>1;Bt.setTarget(i?zt:null),U("target-readout").hidden=!i,U("target-readout").textContent=P("Target \xB7 ","\u76EE\u6807 \xB7 ")+$r(zt).map((e,t)=>"XYZ"[t]+" "+xn(e)).join(" \xB7 ")+" mm",!ot&&!Tt&&Uc()}function Qo(){ds.push(structuredClone(ut)),ds.length>30&&ds.shift()}function fv(i){let e=ut[i];nn(dn(P("Edit program instruction","\u7F16\u8F91\u7A0B\u5E8F\u6307\u4EE4"))+`<label>${P("Name (optional)","\u540D\u79F0\uFF08\u53EF\u9009\uFF09")}<input id="step-name" maxlength="80" value="${Hr(e.name||"")}"></label>${e.type==="move"?`<p>${P("Coordinates use your selected reference. This edits the program without moving the robot.","\u5750\u6807\u4F7F\u7528\u6240\u9009\u53C2\u8003\u7CFB\u3002\u8FD9\u91CC\u7F16\u8F91\u7A0B\u5E8F\uFF0C\u4E0D\u4F1A\u79FB\u52A8\u673A\u5668\u4EBA\u3002")}</p><div class="edit-coordinates">${[...$r(e.p),e.yaw].map((t,n)=>`<label>${["X","Y","Z","Rz"][n]}<input id="edit-${n}" type="number" value="${xn(t)}"></label>`).join("")}</div><div class="edit-motion-options"><label>${P("Orientation","\u671D\u5411")}<select id="edit-orientation"><option value="recorded">${P("Keep recorded orientation","\u4FDD\u7559\u8BB0\u5F55\u7684\u671D\u5411")}</option><option value="free">${P("Allow rotation","\u5141\u8BB8\u65CB\u8F6C")}</option><option value="down">${P("Point downward","\u671D\u4E0B")}</option></select></label><label>${P("Path","\u8DEF\u5F84")}<select id="edit-path"><option value="linear">${P("Direct tool movement","\u5DE5\u5177\u76F4\u63A5\u79FB\u52A8")}</option><option value="joint">${P("Joint movement to target","\u5173\u8282\u8FD0\u52A8\u81F3\u76EE\u6807")}</option></select></label></div>`:""}<p id="edit-feedback"></p><button id="save-step" class="primary">${P("Save instruction","\u4FDD\u5B58\u6307\u4EE4")}</button>`),e.type==="move"&&(U("edit-orientation").value=e.orientation===null?"free":"recorded",U("edit-path").value=e.joint?"joint":e.path||"linear"),U("save-step").onclick=()=>{let t={...e,name:U("step-name").value.trim()};if(e.type==="move"){let n=[0,1,2,3].map(h=>U("edit-"+h).value===""?NaN:Number(U("edit-"+h).value)),s=Sc(n.slice(0,3),Pu());if(!n.every(Number.isFinite)||Math.abs(n[3])>180||s.some(h=>Math.abs(h)>600)){U("edit-feedback").textContent=P("Enter valid coordinates and rotation.","\u8BF7\u8F93\u5165\u6709\u6548\u5750\u6807\u548C\u89D2\u5EA6\u3002");return}let r=U("edit-orientation").value,o=e.orientation||(e.joint?tt(e.q).rpy:[0,0,e.yaw]),a=r==="free"?null:r==="down"?[0,0,n[3]]:[o[0],o[1],n[3]],l=U("edit-path").value,c=Xi(s,e.q,"nearest",a);if(!c.q){U("edit-feedback").textContent=P("No solution found for this position and orientation. Try Allow rotation or a closer position.","\u672A\u627E\u5230\u7B26\u5408\u4F4D\u7F6E\u4E0E\u671D\u5411\u7684\u89E3\u3002\u8BF7\u5C1D\u8BD5\u5141\u8BB8\u65CB\u8F6C\u6216\u66F4\u8FD1\u7684\u4F4D\u7F6E\u3002");return}t={...t,p:s,yaw:n[3],q:c.q,joint:!1,orientation:a,path:l}}Qo(),ut[i]=t,jt(),en.close(),Mt("ready",P("Instruction updated. Run to check the complete path.","\u6307\u4EE4\u5DF2\u66F4\u65B0\u3002\u8FD0\u884C\u7A0B\u5E8F\u68C0\u67E5\u5B8C\u6574\u8DEF\u5F84\u3002"))}}function pv(i){de=new ei(i.mode),Object.assign(de,{objects:structuredClone(i.objects),output:i.output,held:i.held,offset:i.offset&&[...i.offset],localRotation:i.localRotation&&[...i.localRotation],travel:i.travel,moves:i.moves,faults:i.faults,drops:i.drops,last:i.last})}function mv(){return{layoutVersion:3,routes:structuredClone(Vr),strategy:Gr,attempt:Ue?{...structuredClone(Ue),elapsedMs:ta()}:null,kind:"bnta-cargo-progress",version:3,savedAt:new Date().toISOString(),q:[...Ke],world:$c(de),steps:structuredClone(ut),plan:structuredClone(Gi),mathAnswers:{...kr},reflection:Ko,learning:{stage:Zt,completed:[...pi],guideStep:xt,guideRecord:ut.includes(di)?ut.indexOf(di):null,practiceDone:Ac,quizDone:Ru,truckDone:Rc,mathReady:fs,quizAnswers:[...Tc],demoIndex:Tn},ui:{lastCode:ea,lang:On,mode:Gt,orientationMode:Ot,motionPath:Fn,target:zt.every(Number.isFinite)?[...zt]:[...tt(Ke).tip],yaw:Number.isFinite(Qt)?Qt:0,coordinateFrame:Wt,bedZeroSet:Zn,guideHidden:U("guide").hidden,journeyCollapsed:_n,trail:U("trail").checked,dimensions:!0}}}function Bu(){ot&&!fi||dv("robot-lab-progress.json",mv())}function gv(i){if(Ic(),en.close(),ds=[],i.legacy){xt=-1,ps(i.mode,!0),ut=i.steps,Zt=i.mode==="practice"?2:4,Tn=-1,jt(),Ht(),vn(),Mt("ready",P("Legacy program imported. It contains instructions only, not saved student progress.","\u5DF2\u5BFC\u5165\u65E7\u7248\u7A0B\u5E8F\u3002\u65E7\u6587\u4EF6\u4EC5\u542B\u6307\u4EE4\uFF0C\u4E0D\u5305\u542B\u5B66\u4E60\u8FDB\u5EA6\u3002"));return}de=i.world,de.spec.stock.some(n=>n[0]===Un)||(Un="A"),Ke=i.q,ut=i.steps,Gi=i.plan,Vr=i.routes||{},Gr=i.strategy||"",Ue=i.attempt||null,Yn=null,kr=i.mathAnswers,Ko=i.reflection;let e=i.learning,t=i.ui;Zt=e.stage,pi=e.completed,xt=e.guideStep,di=e.guideRecord===null?null:ut[e.guideRecord],Ac=e.practiceDone,Ru=e.quizDone,fs=!!Ue||e.mathReady,Rc=e.truckDone,Tc=e.quizAnswers,Tn=e.demoIndex,On=t.lang,Gt=t.mode,Ot=t.orientationMode||"keep",Fn=t.motionPath||"linear",zt=t.target,Qt=t.yaw,Wt=t.coordinateFrame,Zn=t.bedZeroSet,_n=t.journeyCollapsed,U("trail").checked=t.trail,Bt.setTrail(t.trail),Bt.clearTrail(),ea=t.lastCode||"ready",localStorage.setItem("cargo-language",On),Pc(),U("guide").hidden=t.guideHidden,Tu(),Mt("ready",P("Progress restored. Robot stopped. Recheck the plan if it came from an older task layout.","\u5B66\u4E60\u8FDB\u5EA6\u5DF2\u6062\u590D\uFF0C\u673A\u5668\u4EBA\u4FDD\u6301\u505C\u6B62\u3002\u5982\u6765\u81EA\u65E7\u4EFB\u52A1\u5E03\u5C40\uFF0C\u8BF7\u91CD\u65B0\u68C0\u67E5\u65B9\u6848\u3002")),Ou()}function _v(){Tn>=8?(Tn=-1,pi[1]=!0,vn(),Gs("demoDone")):(Zt=1,vn(),Iu(!0,Math.max(0,Tn),!1))}Bt.setTrail(!0);Pc();requestAnimationFrame(_p);localStorage.getItem("cargo-language")?Gs():av();function Ep(){nn(dn(P("One box, one cubby.","\u4E00\u7BB1\u4E00\u683C\u3002"),P("NEXT MISSION \xB7 POSITION IN THREE DIMENSIONS","\u4E0B\u4E00\u5173 \xB7 \u4E09\u7EF4\u5B9A\u4F4D"))+`<p class="lead">${P("Put A\u2013F into their matching cubbies. A\u2013C go on the lower level; D\u2013F go above. Build a repeatable program.","\u5C06 A\u2013F \u653E\u8FDB\u5BF9\u5E94\u683C\u53E3\u3002A\u2013C \u5728\u4E0B\u5C42\uFF0CD\u2013F \u5728\u4E0A\u5C42\u3002\u7F16\u5199\u53EF\u91CD\u590D\u6267\u884C\u7684\u7A0B\u5E8F\u3002")}</p><div class="shelf-diagram" role="img" aria-label="${P("Three columns and two levels","\u4E09\u5217\u4E24\u5C42")}">${["D","E","F","A","B","C"].map(i=>`<b>${i}</b>`).join("")}</div><p>${P("Column pitch: 70 mm. Clear cubby width: 62 mm; depth: 80 mm. Upper floor: 110 mm above lower floor. All boxes: 20 mm tall. Shelf zero is the front-left corner of the lower floor.","\u5217\u95F4\u8DDD 70 mm\uFF1B\u683C\u53E3\u51C0\u5BBD 62 mm\uFF0C\u6DF1 80 mm\u3002\u4E0A\u5C42\u5E95\u677F\u6BD4\u4E0B\u5C42\u9AD8 110 mm\u3002\u7BB1\u9AD8\u5747\u4E3A 20 mm\u3002\u8D27\u67B6\u96F6\u70B9\u5728\u4E0B\u5C42\u5E95\u677F\u5DE6\u524D\u89D2\u3002")}</p><div class="callout">${P("First centre: X = half a column; Y = half the depth. Placement Z = floor height + box height. Fill the four predictions, then use the position reference to connect each letter to a target.","\u7B2C\u4E00\u4E2A\u4E2D\u5FC3\uFF1AX \u4E3A\u5217\u95F4\u8DDD\u7684\u4E00\u534A\uFF0CY \u4E3A\u6DF1\u5EA6\u7684\u4E00\u534A\u3002\u653E\u7F6E Z = \u5C42\u677F\u9AD8\u5EA6 + \u7BB1\u9AD8\u3002\u586B\u5199\u56DB\u4E2A\u9884\u6D4B\u503C\uFF0C\u518D\u7528\u4F4D\u7F6E\u53C2\u8003\u5C06\u5B57\u6BCD\u4E0E\u76EE\u6807\u5BF9\u5E94\u3002")}</div><div class="prediction-fields">${[["sx","A \xB7 X"],["sy","A \xB7 Y"],["sz","A \xB7 Z"],["upper","D \xB7 Z"]].map(([i,e])=>`<label>${e} (mm)<input id="shelf-${i}" type="number" value="${Hr(kr[i]??"")}"></label>`).join("")}</div><ol><li>${P("Pick up outside the shelf and lift. Move in front of your cubby before changing to its height.","\u5728\u8D27\u67B6\u5916\u5939\u53D6\u5E76\u62AC\u5347\u3002\u5148\u79FB\u5230\u76EE\u6807\u683C\u53E3\u524D\u65B9\uFF0C\u518D\u8C03\u6574\u9AD8\u5EA6\u3002")}</li><li>${P("Enter horizontally, with the box bottom 20 mm above its shelf. Lower by 20 mm; open.","\u6C34\u5E73\u8FDB\u5165\uFF0C\u4FDD\u6301\u7BB1\u5E95\u9AD8\u4E8E\u5C42\u677F 20 mm\u3002\u4E0B\u964D 20 mm\uFF0C\u518D\u5F20\u5F00\u3002")}</li><li>${P("Lift the empty gripper by 20 mm to clear the box, withdraw through the front, then change levels. Do not move vertically through a shelf board.","\u7A7A\u5939\u722A\u62AC\u5347 20 mm \u79BB\u5F00\u7BB1\u5B50\uFF0C\u5148\u4ECE\u6B63\u9762\u9000\u51FA\uFF0C\u518D\u6362\u5C42\u3002\u4E0D\u8981\u7AD6\u76F4\u7A7F\u8FC7\u5C42\u677F\u3002")}</li></ol><p id="shelf-feedback" class="feedback"></p><div class="actions"><button id="check-shelf" class="primary">${P("Check & begin","\u68C0\u67E5\u5E76\u5F00\u59CB")}</button><button id="shelf-zero">${P("Set shelf zero","\u8BBE\u7F6E\u8D27\u67B6\u96F6\u70B9")}</button></div><p>${P("Use the same 5 mm training tolerance, but the whole box and gripper must clear the dividers. This is a simplified contact model.","\u540C\u6837\u4F7F\u7528 5 mm \u8BAD\u7EC3\u5BB9\u5DEE\uFF0C\u4F46\u6574\u4E2A\u7BB1\u5B50\u548C\u5939\u722A\u90FD\u5FC5\u987B\u907F\u5F00\u9694\u677F\u3002\u8FD9\u662F\u7B80\u5316\u7684\u63A5\u89E6\u6A21\u578B\u3002")}</p>`);for(let i of["sx","sy","sz","upper"])U("shelf-"+i).oninput=e=>{kr[i]=e.target.value,fs=!1};U("shelf-zero").onclick=ia,U("check-shelf").onclick=()=>{if(!ca(kr)){U("shelf-feedback").textContent=P("Try 70 \xF7 2, 80 \xF7 2, the box height, and 110 + the box height.","\u8BD5\u8BD5 70 \xF7 2\u300180 \xF7 2\u3001\u7BB1\u9AD8\uFF0C\u4EE5\u53CA 110 + \u7BB1\u9AD8\u3002");return}fs=!0,Zn=!0,Wt="bed",Ri(),jt(),yn(),en.close(),Mt("ready",P("Shelf plan checked. Open the position reference for your chosen cubby.","\u8D27\u67B6\u8BA1\u7B97\u5DF2\u68C0\u67E5\u3002\u5C55\u5F00\u4F4D\u7F6E\u53C2\u8003\uFF0C\u9009\u62E9\u76EE\u6807\u683C\u53E3\u3002"))}}function Au(){let i=U("mission-button").querySelector("span");i&&(i.textContent=de.spec.mode==="shelf"?P("Shelf mission","\u8D27\u67B6\u4EFB\u52A1"):de.spec.mode==="stacking"?P("Stacking mission","\u5806\u53E0\u4EFB\u52A1"):P("Loading mission","\u88C5\u8F7D\u4EFB\u52A1"));let e=U("reference-content");if(!e)return;let t=de.spec.mode==="shelf",n=Vi(de.spec),s=ks(tt(Ke).tip,n),r=(Ue?.plan||Gi)[Un],o=ti(Un,r?.turn||0),a=Ue?.plan||Gi,l=a[Un],c=ti(Un,l?.turn||0),h=t?ks(la(Un),n):l&&[l.x,l.y].every(Number.isFinite)?[l.x+c[0]/2,l.y+c[1]/2,(l.z||0)+20]:null,[u,p]=de.spec.size,m=s[0]>=0&&s[0]<=u&&s[1]>=0&&s[1]<=p;e.innerHTML=`<div class="reference-row"><svg viewBox="-12 -12 ${u+35} ${p+35}" role="img" aria-label="${P("Work area top view, gold target and white current tool","\u5DE5\u4F5C\u533A\u4FEF\u89C6\u56FE\uFF1A\u91D1\u8272\u4E3A\u76EE\u6807\uFF0C\u767D\u8272\u4E3A\u5F53\u524D\u5DE5\u5177")}"><rect width="${u}" height="${p}" fill="#193c57" stroke="#e5c589"/>${h?`<rect x="${h[0]-o[0]/2}" y="${p-h[1]-o[1]/2}" width="${o[0]}" height="${o[1]}" fill="#e5c58944" stroke="#e5c589"/><circle cx="${h[0]}" cy="${p-h[1]}" r="3" fill="#e5c589"/>`:""}${m?`<circle cx="${s[0]}" cy="${p-s[1]}" r="3" fill="white"/>`:""}<text x="0" y="${p+15}" fill="#e5c589" font-size="8">O \u2192 +X</text><text x="0" y="-4" fill="#e5c589" font-size="8">\u2191 +Y</text></svg><div><label>${P(t?"Cubby":"Plan box",t?"\u683C\u53E3":"\u65B9\u6848\u7BB1\u5B50")} <select id="reference-box">${de.spec.stock.map(([g])=>`<option ${g===Un?"selected":""}>${g}</option>`).join("")}</select></label><p>${P("Now from work zero","\u5F53\u524D\u76F8\u5BF9\u5DE5\u4F5C\u96F6\u70B9")}<br><b>${s.map((g,_)=>"XYZ"[_]+" "+xn(g)).join(" \xB7 ")}</b></p>${h?`<p>${Un} \xB7 ${P("planned top centre","\u89C4\u5212\u7BB1\u9876\u4E2D\u5FC3")}<br><b>${h.map((g,_)=>"XYZ"[_]+" "+xn(g)).join(" \xB7 ")}</b></p><button id="reference-fill" ${!fs||Tt||ot?"disabled":""}>${P("Fill placement target","\u586B\u5165\u653E\u7F6E\u76EE\u6807")}</button>`:`<p>${P("Add this box to your plan first.","\u5148\u5728\u65B9\u6848\u4E2D\u586B\u5199\u6B64\u7BB1\u4F4D\u7F6E\u3002")}</p>`}</div></div><p>${P("mm \xB7 X across, Y back, Z above the lower surface. White = current tool; gold = planned box. Filling a target does not move the arm. Approach safely before lowering.","\u5355\u4F4D mm \xB7 X \u6A2A\u5411\uFF0CY \u5411\u540E\uFF0CZ \u9AD8\u4E8E\u4E0B\u5C42\u8868\u9762\u3002\u767D\u70B9\u4E3A\u5F53\u524D\u5DE5\u5177\uFF0C\u91D1\u8272\u4E3A\u89C4\u5212\u7BB1\u5B50\u3002\u586B\u5165\u76EE\u6807\u4E0D\u4F1A\u79FB\u52A8\u673A\u68B0\u81C2\uFF1B\u5148\u5B89\u5168\u63A5\u8FD1\uFF0C\u518D\u4E0B\u964D\u3002")}</p>`,de.spec.mode==="stacking"&&(e.insertAdjacentHTML("beforeend",ua(Gi,de.spec,Un,P)),e.querySelectorAll("[data-elevation-box]").forEach(g=>{let _=()=>{Un=g.dataset.elevationBox,Au()};g.onclick=_,g.onkeydown=f=>{(f.key==="Enter"||f.key===" ")&&(f.preventDefault(),_())}})),U("reference-box").onchange=g=>{Un=g.target.value,Au()},U("reference-fill")?.addEventListener("click",()=>{Zn=!0,Wt="bed",zt=Sc(h,n),Qt=t?0:l.turn,Ot="down",Fn="linear",Gt="xyz",Wi(),jt(),yn(),Mt("ready",P("Target filled. Plan an approach before moving.","\u5DF2\u586B\u5165\u76EE\u6807\u3002\u79FB\u52A8\u524D\u8BF7\u89C4\u5212\u63A5\u8FD1\u8DEF\u7EBF\u3002"))})}function xv(){Lu()}function yv(){let i=document.querySelector('#coordinate-frame option[value="bed"]');i&&(i.textContent=de.spec.mode==="shelf"?P("Shelf zero","\u8D27\u67B6\u96F6\u70B9"):P("Truck-bed zero","\u8F66\u53A2\u96F6\u70B9")),U("coordinate-frame").value=Wt,U("set-zero").textContent=Zn?P("Work zero \u2713","\u5DE5\u4F5C\u96F6\u70B9 \u2713"):P("Set work zero\u2026","\u8BBE\u7F6E\u5DE5\u4F5C\u96F6\u70B9\u2026"),U("frame-note").textContent=Wt==="bed"?P("Z 0 = loading surface","Z 0 = \u88C5\u8F7D\u8868\u9762"):P("Fixed robot reference","\u673A\u5668\u4EBA\u56FA\u5B9A\u53C2\u8003"),Bt.setWorkFrame(Zn?Vi(de.spec):null)}function ia(){if(Tt||ot)return;let[i,e,t]=Vi(de.spec),n=tt(Ke).tip,s=ks(n,[i,e,t]),[r,o]=de.spec.size;Bt.setWorkFrame([i,e,t]),nn(dn(P("Give the work area its own zero.","\u7ED9\u5DE5\u4F5C\u533A\u8BBE\u7F6E\u4E00\u4E2A\u5C40\u90E8\u96F6\u70B9\u3002"),P("LOCAL COORDINATES \u2022 A KNOWN REFERENCE","\u5C40\u90E8\u5750\u6807 \xB7 \u5DF2\u77E5\u53C2\u8003\u70B9"))+`
 <p class="lead">${P("Choose the marked lower-left corner on the loading surface as (0, 0, 0). Measure every placement from the same point.","\u9009\u53D6\u88C5\u8F7D\u8868\u9762\u6807\u8BB0\u7684\u5DE6\u4E0B\u89D2\u4F5C\u4E3A (0, 0, 0)\uFF0C\u6240\u6709\u653E\u7F6E\u4F4D\u7F6E\u90FD\u4ECE\u540C\u4E00\u70B9\u6D4B\u91CF\u3002")}</p>
 <div class="zero-layout"><svg viewBox="0 0 300 205" role="img" aria-label="${P("Bed origin at the lower-left corner, X right, Y up, Z above the surface","\u8F66\u53A2\u539F\u70B9\u5728\u5DE6\u4E0B\u89D2\uFF0CX \u5411\u53F3\uFF0CY \u5411\u4E0A\uFF0CZ \u9AD8\u4E8E\u8868\u9762")}"><rect x="48" y="28" width="210" height="130" fill="#264963" stroke="#e5c589"/><path d="M48 158H282 M48 158V9" stroke="#e5c589" stroke-width="3"/><path d="m274 152 8 6-8 6 M42 17l6-8 6 8" fill="none" stroke="#e5c589" stroke-width="3"/><circle cx="48" cy="158" r="7" fill="#ffe1a1"/><g fill="#f9e3b4" font-size="12"><text x="268" y="184">+X</text><text x="16" y="18">+Y</text><text x="53" y="181">O (0, 0, 0)</text><text x="132" y="18">${r} mm</text><text x="263" y="95">${o}</text><text x="115" y="99">Z = 0</text></g></svg><div><b>${P("The robot does not move. The numbers change.","\u673A\u5668\u4EBA\u4E0D\u52A8\uFF0C\u5750\u6807\u6570\u503C\u6539\u53D8\u3002")}</b><p>${P("Robot position of this zero","\u6B64\u96F6\u70B9\u7684\u673A\u5668\u4EBA\u5750\u6807")}:<br><b>X ${i} \xB7 Y ${e} \xB7 Z ${t} mm</b></p><p>${P("Tool now, measured from the bed","\u5DE5\u5177\u5F53\u524D\u76F8\u5BF9\u8F66\u53A2\u7684\u4F4D\u7F6E")}:<br><b>${s.map((a,l)=>"XYZ"[l]+" "+xn(a)).join(" \xB7 ")} mm</b></p></div></div>
 <div class="callout">${P("Local position = robot position \u2212 bed origin. Axes stay parallel. This sets a simulated work reference; it does not home the robot or touch the bed with the gripper. Saved program positions stay unchanged.","\u5C40\u90E8\u5750\u6807 = \u673A\u5668\u4EBA\u5750\u6807 \u2212 \u8F66\u53A2\u539F\u70B9\u3002\u5404\u8F74\u65B9\u5411\u4E0D\u53D8\u3002\u8FD9\u662F\u5728\u4EFF\u771F\u4E2D\u8BBE\u7F6E\u5DE5\u4EF6\u53C2\u8003\u70B9\uFF0C\u4E0D\u662F\u673A\u5668\u4EBA\u56DE\u96F6\uFF0C\u4E5F\u4E0D\u9700\u8981\u7528\u5939\u722A\u63A5\u89E6\u5E95\u677F\u3002\u5DF2\u6709\u7A0B\u5E8F\u4F4D\u7F6E\u4FDD\u6301\u4E0D\u53D8\u3002")}</div>
 <div class="actions"><button id="confirm-zero" class="primary">${P("Set this corner to (0, 0, 0)","\u5C06\u6B64\u89D2\u70B9\u8BBE\u4E3A (0, 0, 0)")}</button><button id="zero-lesson">${P("Predict a placement","\u9884\u6D4B\u4E00\u6B21\u653E\u7F6E\u4F4D\u7F6E")}</button></div>`),U("confirm-zero").onclick=()=>{Zn=!0,Wt="bed",Ri(),jt(),yn(),en.close(),xt>=0&&!U("guide").hidden&&Ht(),Mt("ready",P("Bed zero set. Enter offsets from the marked corner; Z is height above the deck.","\u5DF2\u8BBE\u7F6E\u8F66\u53A2\u96F6\u70B9\u3002\u8BF7\u8F93\u5165\u76F8\u5BF9\u6807\u8BB0\u89D2\u70B9\u7684\u504F\u79FB\u91CF\uFF1BZ \u8868\u793A\u9AD8\u4E8E\u5E95\u677F\u7684\u9AD8\u5EA6\u3002"))},U("zero-lesson").onclick=vv}function vv(){nn(dn(P("Predict \u2192 test \u2192 explain","\u9884\u6D4B \u2192 \u6D4B\u8BD5 \u2192 \u89E3\u91CA"),P("POSITION IS ALWAYS RELATIVE TO SOMETHING","\u4F4D\u7F6E\u603B\u662F\u76F8\u5BF9\u67D0\u4E2A\u53C2\u8003\u70B9\u800C\u8A00"))+`<p class="lead">${P("Box A is 60 \xD7 40 \xD7 20 mm. Its lower-left corner will sit at bed (0, 0). Where must the tool be at its top centre?","\u7BB1\u5B50 A \u7684\u5C3A\u5BF8\u4E3A 60 \xD7 40 \xD7 20 mm\uFF0C\u5DE6\u4E0B\u89D2\u653E\u5728\u8F66\u53A2 (0, 0)\u3002\u5DE5\u5177\u5E94\u5230\u8FBE\u7BB1\u9876\u4E2D\u5FC3\u7684\u4EC0\u4E48\u4F4D\u7F6E\uFF1F")}</p><div class="callout">${P("Use the bed surface as Z = 0. The box has width and length: targeting the corner will leave part of it outside the truck.","\u4EE5\u8F66\u53A2\u8868\u9762\u4E3A Z = 0\u3002\u7BB1\u5B50\u6709\u957F\u548C\u5BBD\uFF1B\u628A\u4E2D\u5FC3\u79FB\u5230\u89D2\u70B9\uFF0C\u4F1A\u4F7F\u4E00\u90E8\u5206\u7BB1\u4F53\u8D85\u51FA\u8F66\u53A2\u3002")}</div><div class="prediction-fields">${["X","Y","Z"].map(i=>`<label>${i} (mm)<input id="predict-${i}" type="number" aria-label="${P("Predicted bed","\u9884\u6D4B\u8F66\u53A2")} ${i}"></label>`).join("")}</div><p id="zero-feedback" class="feedback"></p><div class="actions"><button id="check-prediction" class="primary">${P("Check prediction","\u68C0\u67E5\u9884\u6D4B")}</button><button id="return-zero">${P("Back to zero setup","\u8FD4\u56DE\u96F6\u70B9\u8BBE\u7F6E")}</button></div><p>${P("After testing, explain why Z = 0 is the bed surface, not the tool height for placing this box. Try a 90\xB0 turn: which coordinates exchange roles?","\u6D4B\u8BD5\u540E\u89E3\u91CA\uFF1A\u4E3A\u4EC0\u4E48 Z = 0 \u8868\u793A\u5E95\u677F\u8868\u9762\uFF0C\u800C\u4E0D\u662F\u653E\u7F6E\u8FD9\u4E2A\u7BB1\u5B50\u65F6\u7684\u5DE5\u5177\u9AD8\u5EA6\uFF1F\u518D\u5C1D\u8BD5\u65CB\u8F6C 90\xB0\uFF1A\u54EA\u4E9B\u5750\u6807\u4F1A\u4EA4\u6362\uFF1F")}</p>`),U("return-zero").onclick=ia,U("check-prediction").onclick=()=>{let i=["X","Y","Z"].map(t=>U("predict-"+t).value===""?NaN:Number(U("predict-"+t).value)),e=up([0,0],[60,40,20]);if(i.some((t,n)=>t!==e[n])){U("zero-feedback").textContent=P("Measure from the corner to the centre: half of 60, half of 40, and the full 20 mm height above the bed.","\u4ECE\u89D2\u70B9\u5230\u4E2D\u5FC3\uFF1A60 \u7684\u4E00\u534A\u300140 \u7684\u4E00\u534A\uFF0C\u4EE5\u53CA\u9AD8\u4E8E\u5E95\u677F\u7684\u5B8C\u6574\u7BB1\u9AD8 20 mm\u3002");return}U("zero-feedback").textContent=P("Correct: local (30, 20, 20). Add the work origin to get robot coordinates. Approach before lowering.","\u6B63\u786E\uFF1A\u5C40\u90E8\u5750\u6807 (30,20,20)\u3002\u52A0\u4E0A\u5DE5\u4F5C\u539F\u70B9\u53EF\u5F97\u673A\u5668\u4EBA\u5750\u6807\u3002\u5148\u63A5\u8FD1\uFF0C\u518D\u4E0B\u964D\u3002"),U("check-prediction").textContent=P("Set zero & fill this target","\u8BBE\u7F6E\u96F6\u70B9\u5E76\u586B\u5165\u76EE\u6807"),U("check-prediction").onclick=()=>{Zn=!0,Wt="bed",Gt="xyz",zt=Sc(e,Vi(de.spec)),Qt=0,Ot="down",Fn="linear",Wi(),jt(),yn(),en.close(),Mt("ready",P("Target filled, robot unchanged. Plan your approach before pressing Move.","\u5DF2\u586B\u5165\u76EE\u6807\uFF0C\u673A\u5668\u4EBA\u672A\u79FB\u52A8\u3002\u70B9\u51FB\u79FB\u52A8\u524D\u8BF7\u5148\u89C4\u5212\u63A5\u8FD1\u8DEF\u7EBF\u3002"))}}}en.addEventListener("close",()=>Bt.setWorkFrame(Zn?Vi(de.spec):null));})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
