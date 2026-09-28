"use strict";(()=>{var Un=[{name:"base",axis:[0,0,1],length:0,limits:[-180,180],home:0},{name:"shoulder",axis:[0,-1,0],length:160,limits:[-20,150],home:55},{name:"elbow",axis:[0,-1,0],length:140,limits:[-150,150],home:-85},{name:"swivel",axis:[0,0,1],length:70,limits:[-150,150],home:0},{name:"wristPitch",axis:[0,-1,0],length:55,limits:[-120,120],home:30},{name:"toolRoll",axis:[1,0,0],length:35,limits:[-180,180],home:0}],Sn={base:70,upper:160,fore:140,limits:Un.map(i=>i.limits),home:Un.slice(0,3).map(i=>i.home)},Fr=i=>Un.slice(0,i).map(e=>e.home),Ep=i=>Un.slice(0,i).reduce((e,t)=>e+t.length,0),Nn=Math.PI/180,Tp=[1,0,0,0,1,0,0,0,1],wp=(i,e)=>i.map((t,n)=>t+e[n]),Du=(i,e)=>i.map((t,n)=>t-e[n]),Ap=(i,e)=>[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]],Rp=i=>[i[0],i[3],i[6],i[1],i[4],i[7],i[2],i[5],i[8]],Gn=(i,e)=>[0,1,2].map(t=>i[t*3]*e[0]+i[t*3+1]*e[1]+i[t*3+2]*e[2]);function Wn(i,e){return Array.from({length:9},(t,n)=>{let s=Math.floor(n/3),r=n%3;return i[s*3]*e[r]+i[s*3+1]*e[r+3]+i[s*3+2]*e[r+6]})}function Zo([i,e,t],n){let s=Math.cos(n),r=Math.sin(n),o=1-s;return[o*i*i+s,o*i*e-r*t,o*i*t+r*e,o*i*e+r*t,o*e*e+s,o*e*t-r*i,o*i*t-r*e,o*e*t+r*i,o*t*t+s]}function jo([i,e,t]){return Wn(Wn(Zo([0,0,1],t*Nn),Zo([0,1,0],e*Nn)),Zo([1,0,0],i*Nn))}function Cp(i,e){let t=Wn(i,Rp(e)),n=Math.acos(Math.max(-1,Math.min(1,(t[0]+t[4]+t[8]-1)/2)));if(n<1e-8)return[0,0,0];let s=[t[7]-t[5],t[2]-t[6],t[3]-t[1]];if(Math.PI-n<1e-5){let r=[t[0],t[4],t[8]].indexOf(Math.max(t[0],t[4],t[8]));s=[0,0,0],s[r]=Math.sqrt(Math.max(0,(t[r*3+r]+1)/2));for(let o=0;o<3;o++)o!==r&&(s[o]=(t[r*3+o]+t[o*3+r])/(4*s[r]));return s.map(o=>o*n)}return s.map(r=>r*n/(2*Math.sin(n)))}function Ac(i){let e=[0,0,Sn.base],t=[...Tp],n=[[...e]],s=[],r=[],o=[];i.forEach((h,u)=>{let f=Un[u];s.push([...e]),r.push(Gn(t,f.axis)),t=Wn(t,Zo(f.axis,h*Nn)),o.push([...t]),f.length&&(e=wp(e,Gn(t,[f.length,0,0])),n.push([...e]))});let a=Math.asin(Math.max(-1,Math.min(1,-t[6]))),l=Math.abs(Math.cos(a))<1e-7,c=[l?0:Math.atan2(t[7],t[8]),a,l?Math.atan2(-t[1],t[4]):Math.atan2(t[3],t[0])].map(h=>h/Nn);return{elbow:n[1],tip:e,points:n,origins:s,axes:r,frames:o,rotation:t,rpy:c}}var Rc=40,Ip=[0,0,-1,0,1,0,1,0,0];function it(i){let e=Ac(i),t=Gn(e.rotation,[Rc,0,0]),n=Wn(e.rotation,Ip),s=Math.asin(Math.max(-1,Math.min(1,-n[6]))),r=Math.abs(Math.cos(s))<1e-7;return{...e,flange:[...e.tip],tip:e.tip.map((o,a)=>o+t[a]),rotation:n,rpy:[r?0:Math.atan2(n[7],n[8]),s,r?Math.atan2(-n[1],n[4]):Math.atan2(n[3],n[0])].map(o=>o/Nn)}}var Jo=i=>Ep(i)+Rc;function ai(i){if(!Array.isArray(i)||i.length<3||i.length>6||i.some((t,n)=>!Number.isFinite(t)||t<Un[n].limits[0]-1e-7||t>Un[n].limits[1]+1e-7))return!1;let{points:e}=Ac(i);return e.slice(1).every((t,n)=>t[2]>=(n===e.length-2?12:18))}var Pt=(i,e)=>Math.hypot(...i.map((t,n)=>t-e[n]));function Or(i,e){if(i.length!==e.length||!ai(i)||!ai(e))return!1;let t=Math.max(1,Math.ceil(Math.max(...i.map((n,s)=>Math.abs(n-e[s])))/.5));for(let n=0;n<=t;n++)if(!ai(i.map((s,r)=>s+(e[r]-s)*n/t)))return!1;return!0}function Pp(i,e,t,n=Sn.fore){let[s,r,o]=i,a=Math.hypot(s,r),l=o-Sn.base,c=(a*a+l*l-Sn.upper**2-n**2)/(2*Sn.upper*n);if(c>1+1e-9||c<-1-1e-9)return{error:"reach"};let h=[];for(let f of[1,-1])for(let p of[-1,1]){let g=a<1e-8?e[0]:Math.atan2(r,s)/Nn+(f===-1?180:0);for(;g>180;)g-=360;for(;g<-180;)g+=360;let _=p*Math.acos(Math.max(-1,Math.min(1,c))),m=Math.atan2(l,f*a)-Math.atan2(n*Math.sin(_),Sn.upper+n*Math.cos(_)),d=[g,m/Nn,_/Nn];ai(d)&&(t==="nearest"||(t==="negative"?d[2]<=0:d[2]>=0))&&h.push(d)}if(h.sort((f,p)=>Pt(f,e)-Pt(p,e)),!h.length)return{error:"limits"};let u=h.find(f=>Or(e,f));return u?{q:u}:{error:"path"}}function Dp(i,e){let t=i.map((s,r)=>[...s,e[r]]),n=t.length;for(let s=0;s<n;s++){let r=s;for(let a=s+1;a<n;a++)Math.abs(t[a][s])>Math.abs(t[r][s])&&(r=a);if([t[s],t[r]]=[t[r],t[s]],Math.abs(t[s][s])<1e-12)return null;let o=t[s][s];for(let a=s;a<=n;a++)t[s][a]/=o;for(let a=0;a<n;a++)if(a!==s){let l=t[a][s];for(let c=s;c<=n;c++)t[a][c]-=l*t[s][c]}}return t.map(s=>s[n])}function Lp(i,e,t,n=Ac){let s=e.length,r=Math.atan2(i[1],i[0])/Nn,o=[[...e],Fr(s)];for(let l of[25,70,120])for(let c of[-110,-45,65]){let h=Fr(s);h[0]=r,h[1]=l,h[2]=c,s>=4&&(h[3]=l===120?70:-35),o.push(h)}let a=!1;for(let l of o){let c=[...l];for(let h=0;h<280;h++){let u=n(c),f=Du(i,u.tip),p=t?Cp(t,u.rotation):[],g=[...f,...p.map(A=>A*90)];if(Math.hypot(...f)<.12&&(!t||Math.hypot(...p)<.004)){if(ai(c)){if(Or(e,c))return{q:c};a=!0}break}let _=u.axes.map((A,C)=>[...Ap(A,Du(u.tip,u.origins[C])).map(N=>N*Nn),...t?A.map(N=>N*Nn*90):[]]),m=g.length,d=Array.from({length:m},(A,C)=>Array.from({length:m},(N,b)=>_.reduce((M,P)=>M+P[C]*P[b],0)+(C===b?.45:0))),T=Dp(d,g);if(!T)break;let v=_.map(A=>A.reduce((C,N,b)=>C+N*T[b],0)),x=Math.max(...v.map(Math.abs));x>9&&(v=v.map(A=>A*9/x));let w=c.map((A,C)=>Math.max(Un[C].limits[0],Math.min(Un[C].limits[1],A+v[C])));if(Pt(w,c)<1e-7)break;c=w}}return{error:a?"path":"solve"}}function Us(i,e=Sn.home,t="nearest",n=null){return!Array.isArray(i)||i.length!==3||i.some(s=>!Number.isFinite(s))?{error:"numbers"}:ai(e)?n&&(e.length!==6||!Array.isArray(n)||n.length!==3||n.some(s=>!Number.isFinite(s)||Math.abs(s)>180))?{error:"orientationInvalid"}:Pt(i,[0,0,Sn.base])>Jo(e.length)+1e-7?{error:"reach"}:i[2]<12?{error:"limits"}:e.length===3?Pp(i,e,t,Sn.fore+Rc):Lp(i,e,n?jo(n):null,it):{error:"limits"}}var Kt={open:27,thickness:6,min:3,xHalf:6,zMin:-13,zMax:19,capacity:42},Np=[1,0,0,0,1,0,0,0,1];function Fs(i,e){let t=e.rotation,n=[t[0],t[3],t[6],t[1],t[4],t[7],t[2],t[5],t[8]],s=Gn(n,i.center.map((h,u)=>h-e.tip[u])),r=Wn(n,i.rotation||Np),o=[0,1,2].map(h=>i.size.reduce((u,f,p)=>u+Math.abs(r[3*h+p])*f/2,0)),a=s.map((h,u)=>h-o[u]),l=s.map((h,u)=>h+o[u]),c=a[0]<Kt.xHalf&&l[0]>-Kt.xHalf&&a[2]<Kt.zMax&&l[2]>Kt.zMin;return{min:a,max:l,overlap:c,width:l[1]-a[1],fits:c&&a[1]>=-24&&l[1]<=24}}function Cc(i,e){let t=-Kt.min,n=Kt.min;for(let s of i){let r=Fs(s,e);!r.overlap||r.min[1]>30||r.max[1]<-30||(t=Math.min(t,r.min[1]-Kt.thickness/2),n=Math.max(n,r.max[1]+Kt.thickness/2))}return[t,n]}var Up=[1,0,0,0,1,0,0,0,1];function wt(i){let e=i.size.map(s=>s/2),t=i.rotation||Up,n=[0,1,2].map(s=>Math.abs(t[3*s])*e[0]+Math.abs(t[3*s+1])*e[1]+Math.abs(t[3*s+2])*e[2]);return{min:i.center.map((s,r)=>s-n[r]),max:i.center.map((s,r)=>s+n[r]),extent:n}}function Ko(){return Array.from({length:6},(i,e)=>({id:String.fromCharCode(65+e),column:e%3,row:Math.floor(e/3),min:[74+e%3*70,70,20+Math.floor(e/3)*110],max:[136+e%3*70,150,124+Math.floor(e/3)*110]}))}function Lu(){let i=(e,t)=>({min:e,max:t});return[...[20,130,240].map(e=>i([66,70,e-6],[284,154,e])),...[70,140,210,280].map(e=>i([e-2,70,14],[e+2,154,240])),i([66,150,14],[284,154,240])]}function Qo(i){let e=Ko().find(t=>t.id===i);return[(e.min[0]+e.max[0])/2,110,e.min[2]+20]}function Nu(i){let e=wt(i);return Ko().find(t=>e.min[0]>=t.min[0]-.2&&e.max[0]<=t.max[0]+.2&&e.min[1]>=t.min[1]-.2&&e.max[1]<=t.max[1]+.2&&e.min[2]>=t.min[2]-1&&e.max[2]<=t.max[2])}function ea(i){return["sx","sy","sz","upper"].every((e,t)=>Number(i[e])===[35,40,20,130][t])}var Uu=(i,e)=>i.min.every((t,n)=>t<e.max[n]-.5&&i.max[n]>e.min[n]+.5);function Fp(i,e=null,t=!1){let n=e&&Fs(e,i),r=(t?n?[n.min[1]-3,n.max[1]+3]:[-3,3]:[-Kt.open,Kt.open]).map(o=>({center:[0,o,3],size:[12,6,32]}));return r.push({center:[0,0,23],size:[22,54,12]},{center:[0,0,34],size:[26,26,16]}),r.map(o=>wt({center:Gn(i.rotation,o.center).map((a,l)=>a+i.tip[l]),size:o.size,rotation:i.rotation}))}function ta(i,e,t,n,s=[]){return Fp(i,e,t).some(o=>s.some(a=>Uu(o,a))||n.some(a=>a.id!==e?.id&&Uu(o,wt(a))))}function Fu(i,e,t,n=0){let s=0,r=1;for(let o=0;o<3;o++){let a=e[o]-i[o],l=t.min[o]-n,c=t.max[o]+n;if(Math.abs(a)<1e-8){if(i[o]<l||i[o]>c)return!1;continue}let h=(l-i[o])/a,u=(c-i[o])/a;if(s=Math.max(s,Math.min(h,u)),r=Math.min(r,Math.max(h,u)),s>r)return!1}return!0}function Ou(i,e){return e.some(t=>i.points.slice(1).some((n,s)=>Fu(i.points[s],n,t,Math.max(9,18-s*2)))||i.origins.slice(1).some((n,s)=>Fu(n,n,t,Math.max(18,31-s*3))))}var Op=[1,0,0,0,1,0,0,0,1],kr=[["A",60,40],["B",60,40],["C",40,40],["D",40,40],["E",40,20],["F",40,20]],Pc=["#e5bd75","#d99954","#70b9d6","#538bad","#b1c9df","#90a9c9"],Ic={xy:5,angle:5,height:8},Bu=i=>[i[0],i[3],i[6],i[1],i[4],i[7],i[2],i[5],i[8]],Br=(i,e)=>i.min.every((t,n)=>t<e.max[n]-.5&&i.max[n]>e.min[n]+.5);function Bp(i="mission"){return{mode:i,size:i==="practice"?[120,80]:i==="transfer"?[180,140]:i==="shelf"?[210,80]:i==="stacking"?[120,100]:[160,140],origin:i==="shelf"?[70,70]:i==="practice"?[140,70]:[100,50],deck:20,stock:i==="practice"?kr.slice(0,1):kr,...i==="shelf"?{cells:Ko(),solids:Lu()}:i==="stacking"?{solids:[{min:[145,-12,0],max:[225,20,85]}]}:{}}}function vi(i,e=0){let t=kr.find(n=>n[0]===i);return t?e%180===0?t.slice(1):[t[2],t[1]]:null}function Os(i,e){let t=[],n=[];for(let[s]of e.stock){let r=i[s];if(!r){t.push({code:"missing",id:s});continue}if(![r.x,r.y,r.turn].every(Number.isFinite)||![0,90].includes(r.turn)){t.push({code:"invalid",id:s});continue}let[o,a]=vi(s,r.turn),l=r.z??0,c={id:s,x:r.x,y:r.y,w:o,h:a,z:l};[0,...e.mode==="stacking"?[20]:[]].includes(l)||t.push({code:"level",id:s}),(c.x<0||c.y<0||c.x+o>e.size[0]||c.y+a>e.size[1])&&t.push({code:"outside",id:s});for(let h of n)Math.abs(c.z-h.z)<20&&c.x<h.x+h.w&&c.x+o>h.x&&c.y<h.y+h.h&&c.y+a>h.y&&t.push({code:"overlap",id:s,other:h.id});n.push(c)}if(e.mode==="stacking"){for(let s of n.filter(r=>r.z===20))n.some(r=>r.z===0&&s.x>=r.x&&s.y>=r.y&&s.x+s.w<=r.x+r.w&&s.y+s.h<=r.y+r.h)||t.push({code:"support",id:s.id});n.filter(s=>s.z===20).length<3&&t.push({code:"stackCount"})}return{ok:!t.length,errors:t,rectangles:n,area:e.stock.reduce((s,r)=>s+r[1]*r[2],0),bedArea:e.size[0]*e.size[1]}}function ku(i,e,t){if(t.mode==="shelf")return Qo(i);let n=e[i],s=vi(i,n.turn);return[t.origin[0]+n.x+s[0]/2,t.origin[1]+n.y+s[1]/2,t.deck+(n.z||0)+20]}function kp(i,e){let t=wt(i),n=e.spec.deck;if(e.spec.mode!=="stacking")return n;let s=e.objects.filter(r=>r.id!==i.id&&r.placed).map(wt).filter(r=>r.max[2]<=t.min[2]+8&&r.max[2]>n&&[0,1].every(o=>t.min[o]>=r.min[o]-.2&&t.max[o]<=r.max[o]+.2));return Math.max(n,...s.map(r=>r.max[2]))}function Li(){return Us([180,-30,155],Fr(6),"nearest",[0,0,0]).q||Fr(6)}function zu(i,e){let t=e.spec,n=wt(i),s=Math.atan2(i.rotation[3],i.rotation[0])*180/Math.PI,r=Math.round(s/90)*90;if(i.rotation[8]<.98||Math.abs(s-r)>Ic.angle)return null;let o=jo([0,0,r]),a=wt({...i,center:[0,0,0],rotation:o}).max,l={min:[...t.origin,t.deck],max:[t.origin[0]+t.size[0],t.origin[1]+t.size[1],t.deck]},c=t.mode==="shelf"?t.cells.map(h=>({min:h.min,max:[h.max[0],h.max[1],h.min[2]]})):[l];t.mode==="stacking"&&c.push(...e.objects.filter(h=>h.id!==i.id&&h.placed).map(wt).filter(h=>h.max[2]<=t.deck+20.2)),c.sort((h,u)=>u.max[2]-h.max[2]);for(let h of c){let u=h.max[2];if(n.min[2]<u-1||n.min[2]>u+Ic.height||[0,1].some(_=>h.max[_]-h.min[_]<a[_]*2-.01))continue;let f=i.center.map((_,m)=>m<2?Math.max(h.min[m]+a[m],Math.min(h.max[m]-a[m],Math.round(_/5)*5)):u+i.size[2]/2);if(f.some((_,m)=>m<2&&Math.abs(_-i.center[m])>Ic.xy))continue;let p={...i,center:f,rotation:o},g=wt(p);if(!(![0,1].every(_=>g.min[_]>=t.origin[_]-.01&&g.max[_]<=t.origin[_]+t.size[_]+.01)||e.objects.some(_=>_.id!==i.id&&Br(g,wt(_)))))return{candidate:p,angle:r-s}}return null}var Xn=class{constructor(e="mission"){this.reset(e)}reset(e=this.spec?.mode||"mission"){this.spec=Bp(e),this.objects=this.spec.stock.map(([t,n,s],r)=>({id:t,size:[n,s,20],center:[120+r%3*80,-155+Math.floor(r/3)*80,10],rotation:[...Op],placed:!1})),this.output=!1,this.held=null,this.offset=null,this.localRotation=null,this.travel=0,this.moves=0,this.faults=0,this.drops=0,this.last="ready"}get input(){return!!this.held}get score(){return this.objects.filter(e=>e.placed).length}get heldObject(){return this.objects.find(e=>e.id===this.held)}heldPose(e){if(!this.held)return null;let t=it(e);return{...this.heldObject,center:t.tip.map((n,s)=>n+Gn(t.rotation,this.offset)[s]),rotation:Wn(t.rotation,this.localRotation)}}update(e){this.held&&Object.assign(this.heldObject,this.heldPose(e))}command(e,t){if(this.update(t),this.output=e,e){if(this.held)return this.last="held";let x=it(t),w=this.objects.filter(C=>Pt([C.center[0],C.center[1],C.center[2]+10],x.tip)<=18).sort((C,N)=>Pt(C.center,x.tip)-Pt(N.center,x.tip))[0];if(!w)return this.last="noContact";if(x.rotation[8]<.85)return this.last="tilt";if(Fs(w,x).width>42)return this.last="wide";let A=wt(w);return this.objects.some(C=>{if(C.id===w.id)return!1;let N=wt(C);return Math.abs(N.min[2]-A.max[2])<1&&[0,1].every(b=>N.max[b]>A.min[b]&&N.min[b]<A.max[b])})?this.last="supportsLoad":(w.center=[x.tip[0],x.tip[1],Math.max(w.center[2],x.tip[2]-10)],w.placed=!1,this.held=w.id,this.offset=Gn(Bu(x.rotation),w.center.map((C,N)=>C-x.tip[N])),this.localRotation=Wn(Bu(x.rotation),w.rotation),this.last="grasped")}if(!this.held)return this.last="open";if(ta(it(t),this.heldObject,!1,this.objects,this.spec.solids||[]))return this.output=!0,this.last="fingers";let n=this.heldObject,s=this.spec,r=zu(n,this);r&&Object.assign(n,r.candidate);let o=wt(n),a=s.mode==="shelf"?Nu(n):null,l=s.mode==="shelf"?!!a:[0,1].every(x=>o.min[x]>=s.origin[x]-1&&o.max[x]<=s.origin[x]+s.size[x]+1);if(o.max[0]>s.origin[0]&&o.min[0]<s.origin[0]+s.size[0]&&o.max[1]>s.origin[1]&&o.min[1]<s.origin[1]+s.size[1]&&!l)return this.output=!0,this.last="edge";let h=l?a?a.min[2]:kp(n,this):0,u=o.min[2]>=h-1&&o.min[2]<=h+8,f=n.rotation[8]>.98;if(s.mode==="stacking"&&l&&o.min[2]>=s.deck+19&&h===s.deck)return this.output=!0,this.last="support";if(s.mode==="stacking"&&h>s.deck+1&&h!==s.deck+20)return this.output=!0,this.last="support";let p=Math.atan2(n.rotation[3],n.rotation[0])*180/Math.PI,g=Math.round(p/90)*90;f&&Math.abs(p-g)<3&&(n.rotation=jo([0,0,g]));let _=[...n.center],m={...n,center:_};m.center[2]=h+10;let d=wt(m),T=[0,1].every(x=>d.min[x]>=s.origin[x]-.2&&d.max[x]<=s.origin[x]+s.size[x]+.2);return this.objects.some(x=>x.id!==n.id&&Br(d,wt(x)))?(this.output=!0,this.last="occupied"):(Object.assign(n,m),n.placed=l&&T&&u&&f&&(!a||a.id===n.id),this.held=null,this.offset=null,this.localRotation=null,u?this.last=n.placed?"placed":a&&a.id!==n.id?"wrongCell":"outside":(this.drops++,this.faults++,this.last="drop"))}collision(e){let t=it(e),n=this.spec;if(t.tip[2]<12)return"floor";if(n.mode==="stacking"&&Ou(t,n.solids))return"obstacle";if(ta(t,this.heldPose(e),this.output,[],n.solids||[]))return n.mode==="shelf"?"shelfCollision":"obstacle";if(ta(t,this.heldPose(e),this.output,this.objects))return"fingers";if(t.tip[0]>n.origin[0]&&t.tip[0]<n.origin[0]+n.size[0]&&t.tip[1]>n.origin[1]&&t.tip[1]<n.origin[1]+n.size[1]&&t.tip[2]<n.deck+12)return"deck";let r=this.heldPose(e);if(r){let o=wt(r);if(o.min[2]<-.7)return"floor";if((n.solids||[]).some(l=>Br(o,l)))return n.mode==="shelf"?"shelfCollision":"obstacle";let a={min:[...n.origin,0],max:[n.origin[0]+n.size[0],n.origin[1]+n.size[1],n.deck]};if(Br(o,a))return"deck";if(this.objects.some(l=>l.id!==r.id&&Br(o,wt(l))))return"cargo"}else if(this.objects.some(o=>{let a=wt(o);return t.tip[0]>a.min[0]+2&&t.tip[0]<a.max[0]-2&&t.tip[1]>a.min[1]+2&&t.tip[1]<a.max[1]-2&&t.tip[2]<a.max[2]-7}))return"cargo";return null}checkMove(e,t){if(!Or(e,t))return{error:"limits",q:[...t]};let n=Math.max(1,Math.ceil(Math.max(...e.map((s,r)=>Math.abs(s-t[r])))/1));for(let s=0;s<=n;s++){let r=e.map((a,l)=>a+(t[l]-a)*s/n),o=this.collision(r);if(o)return{error:o,q:r}}return null}canMove(e,t){return this.checkMove(e,t)?.error||null}snapshot(){return{...this.spec,tool:"gripper",output:this.output,held:this.held,score:this.score,objects:this.objects}}};function rs(i,e,t,n=0){if(!Array.isArray(t)||t.length!==3||t.some(h=>!Number.isFinite(h))||!Number.isFinite(n)||Math.abs(n)>180)return{error:"numbers"};if(t.some(h=>Math.abs(h)>600))return{error:"limits"};let s=!1;if(i.held){let h=Us(t,e,"nearest",[0,0,n]);if(h.q){let u=i.heldPose(h.q),f=zu(u,i);if(f){let p=t.map((g,_)=>g+f.candidate.center[_]-u.center[_]);s=Pt(p,t)>.1||Math.abs(f.angle)>.1,t=p,n+=f.angle}}}let r=it(e),o=Math.max(i.spec.deck,...i.objects.filter(h=>h.id!==i.held).map(h=>wt(h).max[2]))+(i.heldObject?.size[2]||20)+2;if(s&&r.tip[2]>=o&&r.tip[2]>t[2]+1){let h=rs(i,e,[t[0],t[1],r.tip[2]],n);if(h.error)return h;let u=rs(i,h.frames.at(-1),t,n);return u.error?{...u,frames:[...h.frames,...u.frames||[]]}:{frames:[...h.frames,...u.frames],assisted:!0}}let a=Math.max(1,Math.ceil(Pt(r.tip,t)/7),Math.ceil(Math.abs(r.rpy[2]-n)/5)),l=e,c=[];for(let h=1;h<=a;h++){let u=r.tip.map((_,m)=>_+(t[m]-_)*h/a),f=r.rpy[2]+(n-r.rpy[2])*h/a,p=Us(u,l,"nearest",[0,0,f]);if(!p.q)return{error:"limits",frames:c,blockedPoint:u};let g=i.checkMove(l,p.q);if(g)return{error:g.error,frames:c,collisionQ:g.q,blockedPoint:it(g.q).tip};c.push(p.q),l=p.q}return{frames:c,assisted:s}}var zp=i=>Object.assign(new Xn(i.spec.mode),structuredClone(i)),Hp=new Set(["grasped","held","open","placed"]);function Hu(i,e,t,n=0){let s;if(t.joint){let l=i.checkMove(e,t.q);s=l?{error:l.error,collisionQ:l.q,frames:[]}:{frames:[t.q]}}else s=rs(i,e,t.p,t.yaw);let r=[e,...s.frames||[]];s.collisionQ&&r.push(s.collisionQ);let o=[it(e).tip];for(let l=1;l<r.length;l++){let c=r[l-1],h=r[l],u=Math.max(1,Math.ceil(Math.max(...c.map((f,p)=>Math.abs(f-h[p])))/2));for(let f=1;f<=u;f++)o.push(it(c.map((p,g)=>p+(h[g]-p)*f/u)).tip)}s.blockedPoint&&!s.collisionQ&&o.push(s.blockedPoint);let a=s.collisionQ||s.frames?.at(-1)||e;return{points:o,index:n,error:s.error||null,blockedPoint:s.blockedPoint||(s.error?it(a).tip:null),q:a,payload:i.heldPose(a),output:i.output,target:t.p,assisted:!!s.assisted}}function Bs(i,e,t,n=0,s=null){let r=Hu(zp(i),e,{p:t,yaw:n,joint:!!s,q:s});return{segments:[r],error:r.error,step:0,ghost:r,scope:"move"}}function Vu(i,e){let t=new Xn(i.spec.mode),n=Li(),s=[],r=null;for(let o=0;o<e.length;o++){let a=e[o];if(a.type==="move"){let l=Hu(t,n,a,o);if(s.push(l),r=l,l.error)return{segments:s,error:l.error,step:o,ghost:r,scope:"program"};n=l.q,t.update(n)}else{let l=a.type==="grip"?t.command(a.on,n):t.input?"held":"wait";if(!Hp.has(l))return r={q:n,payload:t.heldPose(n),output:t.output,error:l,blockedPoint:it(n).tip},{segments:s,error:l,step:o,ghost:r,scope:"program"}}}return{segments:s,error:null,step:null,ghost:r,scope:"program"}}var Dc={space:45,placement:40,speed:15},ks=i=>i==="stacking"?30:20;function Lc(i){let e=kr.findIndex(t=>t[0]===i);return[120+e%3*80,-155+Math.floor(e/3)*80,20]}function na(i,e,t,n){let s=Os(i,t),r=[...s.errors];return(typeof n!="string"||!n.trim()||n.length>4e3)&&r.push({code:"strategy"}),{...s,ok:!r.length,errors:r}}function ia(i,e,t,n){return{plan:structuredClone(i),routes:{},strategy:t,mode:n,elapsedMs:0,started:!0,finished:!1,traces:{},revisions:0,restarts:0,blocked:0,travel:0,history:[],result:null}}function Nc(i,e,t=i.elapsedMs){let n=e.objects.length,s=e.objects.filter(m=>m.placed),r=s.map(wt),o=[0,1,2].map(m=>Math.min(...r.map(d=>d.min[m]))),a=[0,1,2].map(m=>Math.max(...r.map(d=>d.max[m]))),l=r.length?a.reduce((m,d,T)=>m*Math.max(1,d-o[T]),1):0,c=s.reduce((m,d)=>m+d.size.reduce((T,v)=>T*v,1),0),h=l?Math.min(1,c/l):0,u=e.objects.map(m=>{let d=ku(m.id,i.plan,e.spec),T=[m.center[0],m.center[1],m.center[2]+m.size[2]/2],v=Pt(d,T),x=Math.atan2(m.rotation[3],m.rotation[0])*180/Math.PI,w=Math.abs((x-i.plan[m.id].turn+540)%360-180);return{id:m.id,placed:m.placed,target:d,actual:T,errorMm:v,angleError:w}}),f=u.reduce((m,d)=>m+(d.placed?Math.max(0,1-Math.max(0,d.errorMm-5)/35)*Math.max(0,1-Math.max(0,d.angleError-5)/40):0),0)/n,p=s.length===n&&(e.spec.mode!=="stacking"||s.filter(m=>wt(m).min[2]>=e.spec.deck+19).length>=3),g=p?Math.max(0,Math.min(1,2-t/(ks(e.spec.mode)*6e4))):0,_={space:Math.round(Dc.space*h*s.length/n),placement:Math.round(Dc.placement*f),speed:Math.round(Dc.speed*g)};return{complete:p,points:_,total:Object.values(_).reduce((m,d)=>m+d,0),compactness:h,usedSize:r.length?a.map((m,d)=>m-o[d]):[0,0,0],elapsedMs:t,perBox:u,blocked:i.blocked,revisions:i.revisions,restarts:i.restarts,travel:i.travel}}function Gu(i,e){if(i==null)return null;let t=()=>{throw Error("Invalid attempt")};(i.mode!==e.mode||!na(i.plan||{},i.routes||{},e,i.strategy).ok||typeof i.finished!="boolean")&&t();for(let r of["elapsedMs","revisions","restarts","blocked","travel"])(typeof i[r]!="number"||!Number.isFinite(i[r])||i[r]<0||i[r]>1e12)&&t();let n={};(!i.traces||typeof i.traces!="object")&&t();for(let[r,o]of Object.entries(i.traces))(!e.stock.some(a=>a[0]===r)||!Array.isArray(o)||o.length>2e3||o.some(a=>!Array.isArray(a)||a.length!==3||a.some(l=>!Number.isFinite(l)||Math.abs(l)>1e3)))&&t(),n[r]=o.map(a=>[...a]);(!Array.isArray(i.history)||i.history.length>100)&&t();let s=i.history.map(r=>((!na(r.plan||{},r.routes||{},e,r.strategy).ok||!Number.isFinite(r.elapsedMs)||r.elapsedMs<0)&&t(),{plan:structuredClone(r.plan),routes:structuredClone(r.routes),strategy:r.strategy,elapsedMs:r.elapsedMs}));return{...ia(i.plan,i.routes,i.strategy,i.mode),elapsedMs:i.elapsedMs,finished:i.finished,traces:n,revisions:i.revisions,restarts:i.restarts,blocked:i.blocked,travel:i.travel,history:s}}var Vp=i=>String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);function Wu({root:i,t:e,world:t,plan:n,strategy:s,onDraft:r,onStart:o,active:a=!1}){let l=t.spec,c=l.mode==="stacking",h=structuredClone(n),u={},f=s,p="A",g=0,_=w=>document.getElementById(w),m=()=>r(structuredClone(h),structuredClone(u),f);function d(){i.innerHTML=`<p class="lead">${e(c?"Task 2 \xB7 Stack three boxes on other boxes, in two levels. Move the boxes past the barrier during the task.":"Task 1 \xB7 Design your own load, then make the robot reproduce it.",c?"\u4EFB\u52A1 2 \xB7 \u5C06\u4E09\u4E2A\u7BB1\u5B50\u53E0\u653E\u5728\u5176\u4ED6\u7BB1\u5B50\u4E0A\uFF0C\u5F62\u6210\u4E24\u5C42\u3002\u6267\u884C\u4EFB\u52A1\u65F6\u642C\u8FD0\u7BB1\u5B50\u907F\u5F00\u969C\u788D\u7269\u3002":"\u4EFB\u52A1 1 \xB7 \u81EA\u5DF1\u8BBE\u8BA1\u88C5\u8F7D\u65B9\u6848\uFF0C\u518D\u8BA9\u673A\u5668\u4EBA\u5B9E\u73B0\u5B83\u3002")}</p><p>${e("Choose a box, then click the loading zone to set its centre. Edit corner coordinates below. All dimensions use the same scale as the actual truck.","\u9009\u62E9\u7BB1\u5B50\uFF0C\u518D\u70B9\u51FB\u88C5\u8F7D\u533A\u8BBE\u7F6E\u4E2D\u5FC3\u3002\u4E5F\u53EF\u7F16\u8F91\u4E0B\u65B9\u89D2\u70B9\u5750\u6807\u3002\u56FE\u4E0A\u5404\u5C3A\u5BF8\u4E0E\u5B9E\u9645\u8F66\u53A2\u4F7F\u7528\u76F8\u540C\u6BD4\u4F8B\u3002")}</p>
 <div class="planning-facts"><b>${l.size.join(" \xD7 ")} mm</b><span>${e("Box height: 20 mm","\u7BB1\u9AD8\uFF1A20 mm")}</span><span>${e("Open gripper: 60 mm outer width \xB7 48 mm inner gap","\u5F20\u5F00\u5939\u722A\uFF1A\u5916\u5BBD 60 mm \xB7 \u5185\u95F4\u8DDD 48 mm")}</span>${c?`<span>${e("Barrier: 80 \xD7 32 \xD7 85 mm","\u969C\u788D\u7269\uFF1A80 \xD7 32 \xD7 85 mm")}</span>`:""}<span>${e("Collision detection ON","\u78B0\u649E\u68C0\u6D4B\uFF1A\u5F00\u542F")}</span></div>
 <div class="planning-layout"><div><div class="box-picker">${l.stock.map(([w,A,C],N)=>`<button data-pick="${w}" class="${p===w?"active":""}" style="--box-color:${Pc[N]}"><b>${w}</b> ${A} \xD7 ${C}${h[w]?" \u2713":""}</button>`).join("")}</div>${c?`<div class="map-tools"><label>${e("View level","\u67E5\u770B\u5C42\u7EA7")} <select id="view-level"><option value="0" ${g===0?"selected":""}>1</option><option value="20" ${g===20?"selected":""}>2</option></select></label></div>`:""}<div id="design-map"></div><p id="plan-space" class="plan-space"></p><p class="map-caption">${e("Top view \xB7 1 diagram unit = 1 mm \xB7 5 mm placement grid. Source boxes stay outside the loading zone. Z is height above the truck bed.","\u4FEF\u89C6\u56FE \xB7 1 \u56FE\u5F62\u5355\u4F4D = 1 mm \xB7 \u653E\u7F6E\u7F51\u683C 5 mm\u3002\u5F85\u53D6\u7BB1\u5B50\u4F4D\u4E8E\u88C5\u8F7D\u533A\u5916\u3002Z \u662F\u9AD8\u4E8E\u8F66\u53A2\u5E95\u677F\u7684\u9AD8\u5EA6\u3002")}</p></div><section class="planning-editor" id="box-editor"></section></div>
 <label class="strategy-label">${e("Why this plan? What are you optimizing: space, placement accuracy, speed or reliability? Explain one trade-off.","\u4E3A\u4EC0\u4E48\u8FD9\u6837\u89C4\u5212\uFF1F\u4F60\u5728\u4F18\u5316\u7A7A\u95F4\u3001\u653E\u7F6E\u7CBE\u5EA6\u3001\u901F\u5EA6\u8FD8\u662F\u53EF\u9760\u6027\uFF1F\u89E3\u91CA\u4E00\u4E2A\u53D6\u820D\u3002")}<textarea id="plan-reason" maxlength="4000" rows="3">${Vp(f)}</textarea></label>
 <details class="rubric-details"><summary>${e("Space 45 \xB7 Placement 40 \xB7 Time 15","\u7A7A\u95F4 45 \xB7 \u653E\u7F6E 40 \xB7 \u65F6\u95F4 15")}</summary><ul><li>${e("Space 45: box volume \xF7 the smallest rectangular envelope around the finished load. Packing more compactly scores higher; only safely placed boxes count.","\u7A7A\u95F4 45\uFF1A\u7BB1\u5B50\u4F53\u79EF \xF7 \u5305\u56F4\u6700\u7EC8\u88C5\u8F7D\u7269\u7684\u6700\u5C0F\u957F\u65B9\u4F53\u4F53\u79EF\u3002\u8D8A\u7D27\u51D1\u5F97\u5206\u8D8A\u9AD8\uFF1B\u4EC5\u7EDF\u8BA1\u5B89\u5168\u653E\u7F6E\u7684\u7BB1\u5B50\u3002")}</li><li>${e("Placement 40: actual top centres and rotations compared with your committed plan. Full credit within 5 mm and 5\xB0.","\u653E\u7F6E 40\uFF1A\u5B9E\u9645\u7BB1\u9876\u4E2D\u5FC3\u4E0E\u65CB\u8F6C\u89D2\u5EA6\u548C\u63D0\u4EA4\u65B9\u6848\u76F8\u6BD4\uFF1B5 mm\u30015\xB0 \u4EE5\u5185\u83B7\u6EE1\u5206\u3002")}</li><li>${e(`Time 15: full credit within ${ks(l.mode)} minutes, then decreases to zero at ${2*ks(l.mode)} minutes. These are initial classroom targets, not age norms.`,`\u65F6\u95F4 15\uFF1A${ks(l.mode)} \u5206\u949F\u5185\u6EE1\u5206\uFF0C\u4E4B\u540E\u9012\u51CF\u81F3 ${2*ks(l.mode)} \u5206\u949F\u65F6\u96F6\u5206\u3002\u8FD9\u662F\u521D\u59CB\u8BFE\u5802\u76EE\u6807\uFF0C\u5E76\u975E\u5E74\u9F84\u6807\u51C6\u3002`)}</li></ul><p>${e("Timing starts only when you choose Start task. Programming, pauses, retries and plan revisions during the attempt count. Saved time resumes when you choose Resume; time away from the saved session is excluded. Explain your decisions as part of teacher feedback; writing is not automatically graded.","\u70B9\u51FB\u201C\u5F00\u59CB\u4EFB\u52A1\u201D\u624D\u8BA1\u65F6\u3002\u7F16\u7A0B\u3001\u6682\u505C\u3001\u91CD\u8BD5\u3001\u5C1D\u8BD5\u4E2D\u7684\u65B9\u6848\u4FEE\u6539\u5747\u8BA1\u65F6\u3002\u5BFC\u5165\u540E\u70B9\u51FB\u7EE7\u7EED\u624D\u6062\u590D\u8BA1\u65F6\uFF1B\u79BB\u7EBF\u65F6\u95F4\u4E0D\u8BA1\u3002\u89E3\u91CA\u51B3\u7B56\u4F9B\u6559\u5E08\u53CD\u9988\uFF0C\u6587\u5B57\u4E0D\u81EA\u52A8\u8BC4\u5206\u3002")}</p></details>
 <p id="design-feedback" class="feedback" role="status"></p><div class="actions"><button id="check-design">${e("Check geometry","\u68C0\u67E5\u51E0\u4F55\u65B9\u6848")}</button><button id="start-task" class="primary">${e(a?"Commit revision & continue":"Commit plan & start timer",a?"\u63D0\u4EA4\u4FEE\u6539\u5E76\u7EE7\u7EED":"\u63D0\u4EA4\u65B9\u6848\u5E76\u5F00\u59CB\u8BA1\u65F6")}</button></div>`,i.querySelectorAll("[data-pick]").forEach(w=>w.onclick=()=>{p=w.dataset.pick,d()}),_("view-level")?.addEventListener("change",w=>{g=Number(w.target.value),x()}),_("plan-reason").oninput=w=>{f=w.target.value,m()},_("check-design").onclick=()=>T(!1),_("start-task").onclick=()=>{if(a&&_("start-task").dataset.confirm!=="yes"){_("start-task").dataset.confirm="yes",_("design-feedback").textContent=e("Committing a revision resets the boxes and robot, keeps your program, and continues the same timer. Click again to commit.","\u63D0\u4EA4\u4FEE\u6539\u5C06\u91CD\u7F6E\u7BB1\u5B50\u4E0E\u673A\u5668\u4EBA\u3001\u4FDD\u7559\u7A0B\u5E8F\uFF0C\u5E76\u7EE7\u7EED\u540C\u4E00\u8BA1\u65F6\u3002\u518D\u6B21\u70B9\u51FB\u5373\u53EF\u63D0\u4EA4\u3002");return}T(!0)},v(),x()}function T(w){let A=na(h,u,l,f);if(!A.ok){let C=A.errors[0],N={missing:e(`Place box ${C.id}.`,`\u8BF7\u653E\u7F6E\u7BB1\u5B50 ${C.id}\u3002`),invalid:e(`Check coordinates for ${C.id}.`,`\u8BF7\u68C0\u67E5 ${C.id} \u7684\u5750\u6807\u3002`),outside:e(`${C.id} crosses the loading boundary.`,`${C.id} \u8D85\u51FA\u88C5\u8F7D\u8FB9\u754C\u3002`),overlap:e(`${C.id} and ${C.other} occupy the same space.`,`${C.id} \u4E0E ${C.other} \u5360\u7528\u540C\u4E00\u7A7A\u95F4\u3002`),level:e("Use levels 1 and 2 only.","\u4EC5\u4F7F\u7528\u7B2C 1\u30012 \u5C42\u3002"),support:e(`${C.id} must sit fully on one lower box.`,`${C.id} \u5FC5\u987B\u5B8C\u5168\u652F\u6491\u5728\u4E00\u4E2A\u4E0B\u5C42\u7BB1\u5B50\u4E0A\u3002`),stackCount:e("Put at least three boxes on level 2.","\u81F3\u5C11\u4E09\u4E2A\u7BB1\u5B50\u653E\u5728\u7B2C 2 \u5C42\u3002"),strategy:e("Explain what your plan aims to optimize.","\u8BF7\u89E3\u91CA\u65B9\u6848\u60F3\u8981\u4F18\u5316\u4EC0\u4E48\u3002")};_("design-feedback").textContent=N[C.code]||e("Review the plan.","\u8BF7\u68C0\u67E5\u65B9\u6848\u3002");return}_("design-feedback").textContent=e("The placement plan is valid. Ready to start.","\u653E\u7F6E\u65B9\u6848\u6709\u6548\uFF0C\u53EF\u4EE5\u5F00\u59CB\u4EFB\u52A1\u3002"),w&&(m(),o(structuredClone(h),structuredClone(u),f))}function v(){let w=Lc(p).map((b,M)=>b-(M<2?l.origin[M]:l.deck)),A=h[p]||{x:"",y:"",z:0,turn:0},[C,N]=vi(p,A.turn);_("box-editor").innerHTML=`<h3>${p} \xB7 ${e("My placement","\u6211\u7684\u653E\u7F6E\u4F4D\u7F6E")}</h3><p>${e("Corner measured from truck zero","\u89D2\u70B9\u76F8\u5BF9\u8F66\u53A2\u96F6\u70B9")}</p><div class="plan-fields">${["x","y"].map(b=>`<label>${b.toUpperCase()}<input data-place="${b}" type="number" step="5" value="${A[b]}"></label>`).join("")}<label>${e("Turn","\u65CB\u8F6C")}<select data-place="turn"><option value="0">0\xB0</option><option value="90" ${A.turn===90?"selected":""}>90\xB0</option></select></label>${c?`<label>${e("Level","\u5C42")}<select data-place="z"><option value="0">1</option><option value="20" ${A.z===20?"selected":""}>2</option></select></label>`:""}</div><p id="planned-centre">${e("Tool top centre","\u5DE5\u5177\u7BB1\u9876\u4E2D\u5FC3")}: ${Number.isFinite(A.x)&&Number.isFinite(A.y)?`${A.x+C/2}, ${A.y+N/2}, ${(A.z||0)+20}`:"\u2014"} mm</p><p><b>${e("Pickup XYZ","\u53D6\u8D27 XYZ")}: ${w.join(", ")} mm</b></p>`,_("box-editor").querySelectorAll("[data-place]").forEach(b=>b.onchange=()=>{h[p]??(h[p]={x:NaN,y:NaN,z:0,turn:0}),h[p][b.dataset.place]=b.value===""?NaN:Number(b.value),m(),v(),x()})}function x(){let w=Os(h,l);if(w.ok){let H=[Math.max(...w.rectangles.map(V=>V.x+V.w))-Math.min(...w.rectangles.map(V=>V.x)),Math.max(...w.rectangles.map(V=>V.y+V.h))-Math.min(...w.rectangles.map(V=>V.y)),Math.max(...w.rectangles.map(V=>V.z+20))-Math.min(...w.rectangles.map(V=>V.z))];_("plan-space").textContent=e("Predicted compactness","\u9884\u8BA1\u7D27\u51D1\u5EA6")+`: ${(100*w.area*20/H.reduce((V,ee)=>V*ee,1)).toFixed(1)}% \xB7 `+e("Used envelope","\u5360\u7528\u5305\u56F4\u5C3A\u5BF8")+": "+H.join(" \xD7 ")+" mm"}else _("plan-space").textContent=e("Complete a valid arrangement to measure its compactness.","\u5B8C\u6210\u6709\u6548\u6392\u5217\u540E\uFF0C\u53EF\u67E5\u770B\u7D27\u51D1\u5EA6\u3002");let[A,C]=l.origin,[N,b]=l.size,M="";for(let H=0;H<=N;H+=20)M+=`<path d="M${A+H} ${-C}v${-b}"/>`;for(let H=0;H<=b;H+=20)M+=`<path d="M${A} ${-C-H}h${N}"/>`;let P=(H,V,ee,$,ue,ye,Ee=!1)=>`<g data-map-box="${H}" style="cursor:pointer"><rect x="${V-$/2}" y="${-ee-ue/2}" width="${$}" height="${ue}" fill="${Pc[ye]}" opacity="${Ee?.3:1}" stroke="${H===p?"#fff":"#12283e"}" stroke-width="${H===p?2:1}"/><text x="${V}" y="${-ee+3}" text-anchor="middle" font-size="9" fill="#10263b" font-weight="bold">${H}</text></g>`,G=l.stock.map(([H,V,ee],$)=>{let[ue,ye]=Lc(H);return P(H,ue,ye,V,ee,$)}).join(""),X=l.stock.map(([H],V)=>{let ee=h[H];if(!ee||![ee.x,ee.y].every(Number.isFinite))return"";let[$,ue]=vi(H,ee.turn);return P(H,A+ee.x+$/2,C+ee.y+ue/2,$,ue,V,c&&(ee.z||0)!==g)}).join(""),j=(l.solids||[]).map(H=>`<rect x="${H.min[0]}" y="${-H.max[1]}" width="${H.max[0]-H.min[0]}" height="${H.max[1]-H.min[1]}" fill="#a66f39" stroke="#ffe3a5"/><text x="${H.min[0]}" y="${-H.max[1]-5}" font-size="8" fill="#ffe3a5">85 mm</text>`).join("");_("design-map").innerHTML=`<svg id="planning-svg" viewBox="55 -230 305 430" role="img" aria-label="${e("Same-scale inventory and planned box placements","\u7B49\u6BD4\u4F8B\u5F85\u53D6\u7BB1\u5B50\u4E0E\u89C4\u5212\u653E\u7F6E\u4F4D\u7F6E")}"><rect x="55" y="-230" width="305" height="430" fill="#102b42"/><rect x="${A}" y="${-C-b}" width="${N}" height="${b}" fill="#24465e" stroke="#e5c589" stroke-width="2"/><g stroke="#59788f" stroke-width=".4">${M}</g><text x="${A}" y="${-C-b-10}" fill="#ffe3a5" font-size="9">${e("TRUCK BED","\u8F66\u53A2")} ${N} \xD7 ${b} mm</text>${j}${G}${X}<text x="100" y="195" fill="#bfd1df" font-size="9">${e("PICKUP INVENTORY","\u5F85\u53D6\u7BB1\u5B50")}</text><circle cx="${A}" cy="${-C}" r="3" fill="white"/><text x="${A-5}" y="${-C+13}" fill="white" font-size="8">O (0,0) \u2192 X \xB7 \u2191 Y</text></svg>`,_("planning-svg").onclick=H=>{let V=H.target.closest?.("[data-map-box]");if(V){p=V.dataset.mapBox,d();return}let ee=_("planning-svg"),$=ee.createSVGPoint();$.x=H.clientX,$.y=H.clientY;let ue=$.matrixTransform(ee.getScreenCTM().inverse()),ye=Math.round((ue.x-A)/5)*5,Ee=Math.round((-ue.y-C)/5)*5,We=h[p]||{turn:0,z:g},[Je,nt]=vi(p,We.turn);h[p]={...We,x:ye-Je/2,y:Ee-nt/2,z:c?g:0},m(),v(),x()}}return d(),{snapshot:()=>({plan:h,routes:u,strategy:f})}}function Uc(i){if(i?.version!==1||i?.kind!=="bnta-cargo"||!["practice","mission","transfer","shelf","stacking"].includes(i.mode)||!Array.isArray(i.steps)||i.steps.length>200)throw Error("Invalid cargo program");let e=i.steps.map(t=>{if(t?.name!==void 0&&(typeof t.name!="string"||t.name.length>80))throw Error("Invalid name");if(t?.type==="move"&&Array.isArray(t.p)&&t.p.length===3&&t.p.every(Number.isFinite)&&Number.isFinite(t.yaw)&&Math.abs(t.yaw)<=180&&ai(t.q)&&t.q.length===6&&typeof t.joint=="boolean")return{type:"move",p:[...t.p],yaw:t.yaw,q:[...t.q],joint:t.joint};if(t?.type==="grip"&&typeof t.on=="boolean")return{type:"grip",on:t.on};if(t?.type==="wait")return{type:"wait"};throw Error("Invalid command")}).map((t,n)=>({...t,...i.steps[n].name?{name:i.steps[n].name}:{}}));return{mode:i.mode,steps:e}}var Rt=()=>{throw Error("Invalid progress file")},zs=(i,e=1e4)=>typeof i=="number"&&Number.isFinite(i)&&Math.abs(i)<=e,sa=(i,e,t=1e4)=>Array.isArray(i)&&i.length===e&&i.every(n=>zs(n,t)),$n=i=>typeof i=="boolean",zr=(i,e=4e3)=>typeof i=="string"&&i.length<=e,Xu=i=>sa(i,9,1.001)&&[0,1,2].every(e=>Math.abs(Math.hypot(i[e*3],i[e*3+1],i[e*3+2])-1)<.002)&&Math.abs(i[0]*i[3]+i[1]*i[4]+i[2]*i[5])<.002&&Math.abs(i[0]*i[6]+i[1]*i[7]+i[2]*i[8])<.002&&Math.abs(i[3]*i[6]+i[4]*i[7]+i[5]*i[8])<.002&&Math.abs(i[0]*(i[4]*i[8]-i[5]*i[7])-i[1]*(i[3]*i[8]-i[5]*i[6])+i[2]*(i[3]*i[7]-i[4]*i[6])-1)<.003;function Fc(i){return structuredClone({mode:i.spec.mode,objects:i.objects,output:i.output,held:i.held,offset:i.offset,localRotation:i.localRotation,travel:i.travel,moves:i.moves,faults:i.faults,drops:i.drops,last:i.last})}function $u(i){if(i?.kind==="bnta-cargo"&&i.version===1)return{legacy:!0,...Uc(i)};(i?.kind!=="bnta-cargo-progress"||i.version!==2)&&Rt();let e=i.world,t=i.ui,n=i.learning;(!e||!t||!n||!["practice","mission","transfer","shelf","stacking"].includes(e.mode))&&Rt();let s=new Xn(e.mode),r=Uc({kind:"bnta-cargo",version:1,mode:e.mode,steps:i.steps}).steps;(!ai(i.q)||i.q.length!==6||!sa(t.target,3,600)||!zs(t.yaw,180))&&Rt(),(!["zh","en"].includes(t.lang)||!["xyz","jog","joints"].includes(t.mode)||!["robot","bed"].includes(t.coordinateFrame)||!$n(t.bedZeroSet)||!$n(t.guideHidden)||!$n(t.trail)||!$n(t.journeyCollapsed)||!$n(t.dimensions))&&Rt(),t.coordinateFrame==="bed"&&!t.bedZeroSet&&Rt(),t.lastCode!==void 0&&!zr(t.lastCode,40)&&Rt(),(!Array.isArray(e.objects)||e.objects.length!==s.objects.length||!$n(e.output))&&Rt();let o=s.objects.map(_=>{let m=e.objects.find(d=>d?.id===_.id);return(!m||!sa(m.center,3,1e3)||!Xu(m.rotation)||!$n(m.placed)||JSON.stringify(m.size)!==JSON.stringify(_.size))&&Rt(),{..._,center:[...m.center],rotation:[...m.rotation],placed:m.placed}});new Set(e.objects.map(_=>_.id)).size!==o.length&&Rt(),e.held!==null&&(!o.some(_=>_.id===e.held)||!e.output||!sa(e.offset,3,100)||!Xu(e.localRotation))&&Rt(),e.held===null&&(e.offset!==null||e.localRotation!==null)&&Rt();for(let _ of["travel","moves","faults","drops"])(!zs(e[_],1e9)||e[_]<0||_!=="travel"&&!Number.isInteger(e[_]))&&Rt();if(zr(e.last,40)||Rt(),Object.assign(s,{objects:o,output:e.output,held:e.held,offset:e.offset&&[...e.offset],localRotation:e.localRotation&&[...e.localRotation],travel:e.travel,moves:e.moves,faults:e.faults,drops:e.drops,last:e.last}),s.held){let _=s.heldPose(i.q);(s.heldObject.placed||Pt(_.center,s.heldObject.center)>.1||_.rotation.some((m,d)=>Math.abs(m-s.heldObject.rotation[d])>.002))&&Rt()}(!Number.isInteger(n.guideStep)||n.guideStep<-1||n.guideStep>8||!Number.isInteger(n.stage)||n.stage<0||n.stage>4||!Array.isArray(n.completed)||n.completed.length!==5||!n.completed.every($n)||!$n(n.practiceDone)||!$n(n.quizDone)||!$n(n.mathReady))&&Rt(),n.guideStep>=0&&e.mode!=="practice"&&Rt(),(!Number.isInteger(n.demoIndex)||n.demoIndex<-1||n.demoIndex>8||n.demoIndex>=0&&(e.mode!=="practice"||n.stage!==1||r.length!==8))&&Rt(),n.guideRecord!==null&&(!Number.isInteger(n.guideRecord)||n.guideRecord<0||n.guideRecord>=r.length)&&Rt(),(!Array.isArray(n.quizAnswers)||n.quizAnswers.length!==3||!n.quizAnswers.every(_=>_===null||_===0||_===1)||!zr(i.reflection))&&Rt(),(!i.plan||typeof i.plan!="object"||Array.isArray(i.plan)||!i.mathAnswers||typeof i.mathAnswers!="object")&&Rt();let a={};for(let[_,m]of Object.entries(i.plan))(!s.spec.stock.some(d=>d[0]===_)||!m||![m.x,m.y].every(d=>d===null||zs(d,600))||![0,90].includes(m.turn)||![void 0,0,20].includes(m.z))&&Rt(),a[_]={x:m.x===null?NaN:m.x,y:m.y===null?NaN:m.y,turn:m.turn,...m.z!==void 0?{z:m.z}:{}};let l={};for(let[_,m]of Object.entries(i.routes||{}))(!s.spec.stock.some(d=>d[0]===_)||!Array.isArray(m)||m.length>20||m.some(d=>!Array.isArray(d)||d.length!==3||d.some(T=>T!==null&&!zs(T,600))))&&Rt(),l[_]=m.map(d=>d.map(T=>T===null?NaN:T));let c=i.strategy??"";zr(c)||Rt();let h=Gu(i.attempt,s.spec),u={};for(let _ of["area","bed","sx","sy","sz","upper","centreX","centreY"]){let m=i.mathAnswers[_];m!==void 0&&(zr(m,30)||zs(m,1e9)||Rt(),u[_]=m)}let f=Os(a,s.spec),p=n.mathReady&&(e.mode==="practice"||[2,3].includes(i.layoutVersion))&&(e.mode==="shelf"?ea(u):f.ok&&Number(u.centreX)===40&&Number(u.centreY)===30&&Number(u.area)===f.area&&Number(u.bed)===f.bedArea),g=n.quizDone&&n.quizAnswers.every((_,m)=>_===[0,1,1][m]);return{world:s,steps:r,q:[...i.q],ui:{...t,target:[...t.target]},learning:{...n,truckDone:n.truckDone===!0,completed:n.completed.map((_,m)=>m===3?g:_),quizAnswers:[...n.quizAnswers],mathReady:!!h||p,quizDone:g},plan:a,routes:l,strategy:c,attempt:h,mathAnswers:u,reflection:i.reflection}}var Hs=[{part:"base",target:"#viewport",title:["The base","\u5E95\u5EA7"],body:["The base supports the arm and stays fixed. All robot positions are measured in relation to its coordinate system.","\u5E95\u5EA7\u652F\u6491\u673A\u68B0\u81C2\u5E76\u4FDD\u6301\u56FA\u5B9A\u3002\u673A\u5668\u4EBA\u5750\u6807\u4EE5\u56FA\u5B9A\u7684\u673A\u5668\u4EBA\u5750\u6807\u7CFB\u4E3A\u53C2\u8003\u3002"]},{part:"base",target:"#viewport",title:["Why six joints?","\u4E3A\u4EC0\u4E48\u6709\u516D\u4E2A\u5173\u8282\uFF1F"],body:["This arm has six motor-driven turning joints, J1\u2013J6. We need to choose both where the gripper goes (X, Y, Z) and which way it faces (three rotation directions). The first three joints mainly position the arm; the last three help orient the tool. They work together\u2014one joint is not one X, Y or Z control.","\u8FD9\u53F0\u673A\u68B0\u81C2\u6709\u516D\u4E2A\u7531\u7535\u673A\u9A71\u52A8\u7684\u8F6C\u52A8\u5173\u8282 J1\u2013J6\u3002\u9664\u4E86\u9009\u62E9\u5939\u722A\u53BB\u54EA\u91CC\uFF08X\u3001Y\u3001Z\uFF09\uFF0C\u8FD8\u8981\u9009\u62E9\u5B83\u671D\u5411\u54EA\u91CC\uFF08\u4E09\u4E2A\u65CB\u8F6C\u65B9\u5411\uFF09\u3002\u524D\u4E09\u4E2A\u5173\u8282\u4E3B\u8981\u5B9A\u4F4D\u673A\u68B0\u81C2\uFF0C\u540E\u4E09\u4E2A\u534F\u52A9\u8C03\u6574\u5DE5\u5177\u59FF\u6001\u3002\u5B83\u4EEC\u76F8\u4E92\u914D\u5408\uFF0C\u5E76\u4E0D\u662F\u4E00\u4E2A\u5173\u8282\u5BF9\u5E94\u4E00\u4E2A X\u3001Y \u6216 Z \u63A7\u4EF6\u3002"]},{part:"j1",target:"#viewport",title:["J1 \xB7 Base rotation","J1 \xB7 \u5E95\u5EA7\u65CB\u8F6C"],body:["Turns the arm around its base, like turning your body to face a different direction. It brings different parts of the workspace in front of the arm.","\u8BA9\u673A\u68B0\u81C2\u7ED5\u5E95\u5EA7\u8F6C\u52A8\uFF0C\u5C31\u50CF\u8F6C\u8EAB\u9762\u5411\u53E6\u4E00\u4E2A\u65B9\u5411\uFF0C\u4F7F\u673A\u68B0\u81C2\u671D\u5411\u5DE5\u4F5C\u533A\u7684\u4E0D\u540C\u4F4D\u7F6E\u3002"]},{part:"j2",target:"#viewport",title:["J2 \xB7 Shoulder","J2 \xB7 \u80A9\u5173\u8282"],body:["Raises or lowers the upper arm. Together with the elbow, it changes reach and height.","\u62AC\u8D77\u6216\u653E\u4E0B\u4E0A\u81C2\uFF0C\u4E0E\u8098\u5173\u8282\u5171\u540C\u6539\u53D8\u4F38\u5C55\u8DDD\u79BB\u548C\u9AD8\u5EA6\u3002"]},{part:"j3",target:"#viewport",title:["J3 \xB7 Elbow","J3 \xB7 \u8098\u5173\u8282"],body:["Bends or straightens the arm. A folded and an extended arm can approach the same area differently, but joint limits restrict the choices.","\u4F7F\u624B\u81C2\u5F2F\u66F2\u6216\u4F38\u76F4\u3002\u6298\u53E0\u4E0E\u4F38\u5C55\u53EF\u4EE5\u7528\u4E0D\u540C\u65B9\u5F0F\u63A5\u8FD1\u540C\u4E00\u533A\u57DF\uFF0C\u4F46\u5173\u8282\u9650\u4F4D\u4F1A\u9650\u5236\u9009\u62E9\u3002"]},{part:"j4",target:"#viewport",title:["J4 \xB7 Swivel","J4 \xB7 \u56DE\u8F6C\u5173\u8282"],body:["Turns the outer arm assembly around its local axis. It helps aim the wrist without relying only on the base. Its axis turns with the joints before it.","\u8BA9\u5916\u4FA7\u673A\u68B0\u81C2\u7ED5\u81EA\u8EAB\u8F74\u8F6C\u52A8\uFF0C\u5E2E\u52A9\u8155\u90E8\u8C03\u6574\u671D\u5411\uFF0C\u4E0D\u5FC5\u53EA\u4F9D\u8D56\u5E95\u5EA7\u3002\u5B83\u7684\u8F74\u65B9\u5411\u4E5F\u4F1A\u968F\u524D\u9762\u7684\u5173\u8282\u6539\u53D8\u3002"]},{part:"j5",target:"#viewport",title:["J5 \xB7 Wrist tilt","J5 \xB7 \u8155\u90E8\u4FEF\u4EF0"],body:["Tilts the wrist to change the approach angle. Reaching above a box is not enough: the gripper must also face the box correctly.","\u503E\u659C\u8155\u90E8\u4EE5\u6539\u53D8\u63A5\u8FD1\u89D2\u5EA6\u3002\u4EC5\u4EC5\u5230\u8FBE\u7BB1\u5B50\u4E0A\u65B9\u8FD8\u4E0D\u591F\uFF0C\u5939\u722A\u8FD8\u9700\u8981\u6B63\u786E\u671D\u5411\u7BB1\u5B50\u3002"]},{part:"j6",target:"#viewport",title:["J6 \xB7 Tool rotation","J6 \xB7 \u5DE5\u5177\u65CB\u8F6C"],body:["Spins the tool around its mounting axis, helping align the jaws with a box. More joints offer more positioning and orientation choices, not unlimited reach. In Coordinates mode the simulator coordinates all six joints to keep the gripper level; you do not need to set them one by one.","\u8BA9\u5DE5\u5177\u7ED5\u5B89\u88C5\u8F74\u65CB\u8F6C\uFF0C\u5E2E\u52A9\u5939\u722A\u4E0E\u7BB1\u5B50\u65B9\u5411\u5BF9\u9F50\u3002\u66F4\u591A\u5173\u8282\u63D0\u4F9B\u66F4\u591A\u4F4D\u7F6E\u548C\u59FF\u6001\u9009\u62E9\uFF0C\u5E76\u4E0D\u610F\u5473\u7740\u65E0\u9650\u53EF\u8FBE\u3002\u5728\u5750\u6807\u6A21\u5F0F\u4E0B\uFF0C\u4EFF\u771F\u4F1A\u534F\u8C03\u516D\u4E2A\u5173\u8282\uFF0C\u4FDD\u6301\u5939\u722A\u6C34\u5E73\uFF0C\u65E0\u9700\u9010\u4E00\u8BBE\u7F6E\u3002"]},{part:"link",target:"#viewport",title:["Links and reach","\u8FDE\u6746\u4E0E\u53EF\u8FBE\u8303\u56F4"],body:["Links connect the joints. Their lengths help determine where the robot can reach. The arm and its load need room to move.","\u8FDE\u6746\u8FDE\u63A5\u5173\u8282\uFF0C\u5176\u957F\u5EA6\u51B3\u5B9A\u673A\u5668\u4EBA\u80FD\u5230\u8FBE\u7684\u8303\u56F4\u3002\u673A\u68B0\u81C2\u548C\u6240\u5939\u7269\u4F53\u90FD\u9700\u8981\u8FD0\u52A8\u7A7A\u95F4\u3002"]},{part:"tool",target:"#viewport",title:["Gripper and feedback","\u5939\u722A\u4E0E\u53CD\u9988"],body:["The gripper is the end effector that holds a box. DO1 commands Open or Close. DI1 confirms an actual grip\u2014a Close command alone does not prove a box is held.","\u5939\u722A\u662F\u5939\u6301\u7BB1\u5B50\u7684\u672B\u7AEF\u6267\u884C\u5668\u3002DO1 \u53D1\u51FA\u5F20\u5F00\u6216\u95ED\u5408\u6307\u4EE4\uFF1BDI1 \u786E\u8BA4\u5B9E\u9645\u5939\u6301\u3002\u53D1\u51FA\u95ED\u5408\u6307\u4EE4\u4E0D\u4EE3\u8868\u4E00\u5B9A\u5939\u4F4F\u4E86\u7BB1\u5B50\u3002"]},{part:"tcp",target:"#viewport",title:["The tool position","\u5DE5\u5177\u4F4D\u7F6E"],body:["The tool centre point is the point you position with X, Y and Z. The readout shows where it is now. Setting a bed zero changes the reference for those numbers, not the robot\u2019s position.","\u5DE5\u5177\u4E2D\u5FC3\u70B9\u662F\u901A\u8FC7 X\u3001Y\u3001Z \u5B9A\u4F4D\u7684\u70B9\u3002\u8BFB\u6570\u663E\u793A\u5B83\u5F53\u524D\u7684\u4F4D\u7F6E\u3002\u8BBE\u7F6E\u8F66\u53A2\u96F6\u70B9\u53EA\u6539\u53D8\u5750\u6807\u53C2\u8003\uFF0C\u4E0D\u4F1A\u79FB\u52A8\u673A\u5668\u4EBA\u3002"]},{target:"#controls",title:["Movement controls: try a movement","\u79FB\u52A8\u63A7\u5236\u533A\uFF1A\u5C1D\u8BD5\u4E00\u4E2A\u52A8\u4F5C"],body:["Use Coordinates for an exact target, Jog for small steps, or Joints to turn individual joints. Move acts on the robot now. Open and Close operate the gripper. These actions are not automatically added to your program.","\u7528\u201C\u5750\u6807\u201D\u8BBE\u7F6E\u7CBE\u786E\u76EE\u6807\uFF0C\u201C\u70B9\u52A8\u201D\u8FDB\u884C\u5C0F\u6B65\u79FB\u52A8\uFF0C\u201C\u5173\u8282\u201D\u63A7\u5236\u5355\u4E2A\u5173\u8282\u3002\u201C\u79FB\u52A8\u201D\u7ACB\u5373\u64CD\u4F5C\u673A\u5668\u4EBA\uFF0C\u5F20\u5F00\u548C\u95ED\u5408\u64CD\u4F5C\u5939\u722A\u3002\u8FD9\u4E9B\u64CD\u4F5C\u4E0D\u4F1A\u81EA\u52A8\u52A0\u5165\u7A0B\u5E8F\u3002"]},{target:"#program-panel",mobileTarget:".command-box",title:["Program building: save the sequence","\u7A0B\u5E8F\u7F16\u5199\u533A\uFF1A\u4FDD\u5B58\u52A8\u4F5C\u987A\u5E8F"],body:["Record position saves the robot\u2019s current position in the list. Add Open, Close and Wait DI1 where they belong. Adding an instruction prepares it for playback; it does not immediately operate the robot.","\u201C\u8BB0\u5F55\u5F53\u524D\u4F4D\u7F6E\u201D\u628A\u673A\u5668\u4EBA\u5F53\u524D\u7684\u4F4D\u7F6E\u4FDD\u5B58\u5230\u5217\u8868\u4E2D\u3002\u6309\u987A\u5E8F\u6DFB\u52A0\u5F20\u5F00\u3001\u95ED\u5408\u548C\u7B49\u5F85 DI1\u3002\u6DFB\u52A0\u6307\u4EE4\u662F\u4E3A\u8FD0\u884C\u7A0B\u5E8F\u505A\u51C6\u5907\uFF0C\u4E0D\u4F1A\u7ACB\u5373\u64CD\u4F5C\u673A\u5668\u4EBA\u3002"]},{target:".program-bottom",title:["Run, pause and improve","\u8FD0\u884C\u3001\u6682\u505C\u4E0E\u6539\u8FDB"],body:["Run resets the boxes and executes your list from the beginning. Pause lets you inspect; Stop ends playback. Reorder or remove steps to improve the sequence. We will watch this area during the demonstration.","\u201C\u8FD0\u884C\u201D\u4F1A\u91CD\u7F6E\u7BB1\u5B50\u5E76\u4ECE\u5934\u6267\u884C\u5217\u8868\u3002\u201C\u6682\u505C\u201D\u65B9\u4FBF\u89C2\u5BDF\uFF0C\u201C\u505C\u6B62\u201D\u7ED3\u675F\u8FD0\u884C\u3002\u53EF\u4EE5\u8C03\u6574\u987A\u5E8F\u6216\u5220\u9664\u6B65\u9AA4\u6765\u6539\u8FDB\u7A0B\u5E8F\u3002\u793A\u8303\u65F6\u8BF7\u7559\u610F\u8FD9\u91CC\u3002"]},{target:"#status",title:["Status messages: what just happened?","\u72B6\u6001\u63D0\u793A\uFF1A\u521A\u521A\u53D1\u751F\u4E86\u4EC0\u4E48\uFF1F"],body:["This message bar reports results: a position reached, a box held, or a blocked movement. Read it when something does not work. It tells you what happened so you can decide what to change.","\u8FD9\u6761\u63D0\u793A\u680F\u62A5\u544A\u7ED3\u679C\uFF0C\u4F8B\u5982\u5DF2\u5230\u8FBE\u4F4D\u7F6E\u3001\u5DF2\u5939\u4F4F\u7BB1\u5B50\u6216\u79FB\u52A8\u88AB\u963B\u6B62\u3002\u64CD\u4F5C\u4E0D\u6210\u529F\u65F6\u5148\u8BFB\u8FD9\u91CC\uFF0C\u4E86\u89E3\u53D1\u751F\u4E86\u4EC0\u4E48\uFF0C\u518D\u51B3\u5B9A\u5982\u4F55\u8C03\u6574\u3002"]},{target:"#guide",title:["Learning prompts: what should I do next?","\u5B66\u4E60\u63D0\u793A\u6846\uFF1A\u4E0B\u4E00\u6B65\u505A\u4EC0\u4E48\uFF1F"],body:["This temporary box explains the next action and why it matters. During the demonstration it explains the teacher\u2019s moves; in your practice it guides your next step. It can be hidden when you are ready to work independently.","\u8FD9\u4E2A\u4E34\u65F6\u63D0\u793A\u6846\u8BF4\u660E\u4E0B\u4E00\u6B65\u505A\u4EC0\u4E48\uFF0C\u4EE5\u53CA\u4E3A\u4EC0\u4E48\u8981\u8FD9\u6837\u505A\u3002\u793A\u8303\u65F6\u89E3\u91CA\u6559\u5E08\u7684\u52A8\u4F5C\uFF0C\u7EC3\u4E60\u65F6\u5F15\u5BFC\u4F60\u7684\u4E0B\u4E00\u6B65\u3002\u80FD\u591F\u72EC\u7ACB\u64CD\u4F5C\u540E\uFF0C\u53EF\u4EE5\u5C06\u5B83\u6536\u8D77\u3002"]}];function qu({translate:i,highlightPart:e,showPrompt:t,restorePrompt:n,onClose:s}){let r=document.createElement("div");r.id="demo-tour",r.hidden=!0,r.innerHTML='<div class="tour-shade"></div><div class="tour-focus" aria-hidden="true"></div><section class="tour-card" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-description" tabindex="-1"></section>',document.body.append(r);let o=r.querySelector(".tour-focus"),a=r.querySelector(".tour-card"),l=-1,c=null,h=null,u=[],f=()=>l>=0,p=d=>document.querySelector(innerWidth<=720&&d.mobileTarget?d.mobileTarget:d.target);function g(){if(!f())return;let d=p(Hs[l]),T=d.getBoundingClientRect(),v=5,x=Math.max(5,T.left-v),w=Math.max(5,T.top-v),A=Math.min(innerWidth-5,T.right+v),C=Math.min(innerHeight-5,T.bottom+v);Object.assign(o.style,{left:x+"px",top:w+"px",width:Math.max(0,A-x)+"px",height:Math.max(0,C-w)+"px"});let N=a.offsetWidth,b=a.offsetHeight,M=15,P=12,X=[{x:A+M,y:w},{x:x-N-M,y:w},{x,y:C+M},{x,y:w-b-M}].find(j=>j.x>=P&&j.y>=P&&j.x+N<=innerWidth-P&&j.y+b<=innerHeight-P);if(!X){let j=[{x:P,y:P},{x:innerWidth-N-P,y:P},{x:P,y:innerHeight-b-P},{x:innerWidth-N-P,y:innerHeight-b-P}],H=V=>Math.max(0,Math.min(V.x+N,A)-Math.max(V.x,x))*Math.max(0,Math.min(V.y+b,C)-Math.max(V.y,w));X=j.sort((V,ee)=>H(V)-H(ee))[0]}a.style.left=Math.max(P,Math.min(X.x,innerWidth-N-P))+"px",a.style.top=Math.max(P,Math.min(X.y,innerHeight-b-P))+"px"}function _(){let d=Hs[l],T=i;e(d.part||null),t(d.target==="#guide"),a.innerHTML=`<span class="eyebrow">${T("BEFORE THE ROBOT MOVES","\u673A\u5668\u4EBA\u8FD0\u52A8\u4E4B\u524D")} \xB7 ${l+1} / ${Hs.length}</span><h2 id="tour-title">${T(...d.title)}</h2><p id="tour-description">${T(...d.body)}</p><div class="tour-progress" aria-hidden="true">${Hs.map((x,w)=>`<i class="${w===l?"current":w<l?"done":""}"></i>`).join("")}</div><div class="actions"><button id="tour-back" ${l===0?"disabled":""}>${T("Back","\u4E0A\u4E00\u6B65")}</button><button id="tour-next" class="primary">${l===Hs.length-1?T("Start robot demonstration \u2192","\u5F00\u59CB\u673A\u5668\u4EBA\u793A\u8303 \u2192"):T("Next \u2192","\u4E0B\u4E00\u6B65 \u2192")}</button><button id="tour-exit">${T("Close tour","\u5173\u95ED\u5BFC\u89C8")}</button></div>`,a.querySelector("#tour-back").onclick=()=>{l--,_()},a.querySelector("#tour-next").onclick=()=>{if(l<Hs.length-1)l++,_();else{let x=c;m(),x?.()}},a.querySelector("#tour-exit").onclick=m,p(d).scrollIntoView({block:"center",inline:"nearest",behavior:"instant"}),g(),a.focus({preventScroll:!0}),requestAnimationFrame(g)}function m(){if(f()){l=-1,r.hidden=!0,e(null),n();for(let[d,T]of u)d.inert=T;u=[],h?.focus({preventScroll:!0}),s?.()}}return r.addEventListener("keydown",d=>{if(d.key==="Escape"&&(d.preventDefault(),m()),d.key==="Tab"){let T=[...a.querySelectorAll("button:not(:disabled)")],v=T[0],x=T.at(-1);d.shiftKey&&(document.activeElement===v||document.activeElement===a)?(d.preventDefault(),x.focus()):!d.shiftKey&&(document.activeElement===x||document.activeElement===a)&&(d.preventDefault(),v.focus())}}),window.addEventListener("resize",g),window.addEventListener("scroll",g,!0),{active:f,start(d){f()&&m(),h=document.activeElement,u=[...document.querySelectorAll("body>header,body>nav,body>main")].map(T=>[T,T.inert]);for(let[T]of u)T.inert=!0;c=d,l=0,r.hidden=!1,_()},close:m,refresh(){f()&&_()}}}var Zi={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},ji={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Ad=0,Eh=1,Rd=2;var Th=1,ml=2,pi=3,Ai=0,cn=1,mi=2,Ri=0,ds=1,wh=2,Ah=3,Rh=4,Cd=5,Hi=100,Id=101,Pd=102,Dd=103,Ld=104,Nd=200,Ud=201,Fd=202,Od=203,Fa=204,Oa=205,Bd=206,kd=207,zd=208,Hd=209,Vd=210,Gd=211,Wd=212,Xd=213,$d=214,gl=0,_l=1,xl=2,fs=3,yl=4,vl=5,bl=6,Ml=7,Ch=0,qd=1,Yd=2,Ci=0,Zd=1,jd=2,Jd=3,Kd=4,Qd=5,ef=6,tf=7;var Ih=300,bs=301,Ms=302,Sl=303,El=304,Uo=306,Ba=1e3,zi=1001,ka=1002,Bn=1003,nf=1004;var Fo=1005;var Kn=1006,Tl=1007;var Ji=1008;var ti=1009,Ph=1010,Dh=1011,yr=1012,wl=1013,Ki=1014,gi=1015,vr=1016,Al=1017,Rl=1018,br=1020,Lh=35902,Nh=35899,Uh=1021,Fh=1022,zn=1023,or=1026,Mr=1027,Oh=1028,Cl=1029,Bh=1030,Il=1031;var Pl=1033,Oo=33776,Bo=33777,ko=33778,zo=33779,Dl=35840,Ll=35841,Nl=35842,Ul=35843,Fl=36196,Ol=37492,Bl=37496,kl=37808,zl=37809,Hl=37810,Vl=37811,Gl=37812,Wl=37813,Xl=37814,$l=37815,ql=37816,Yl=37817,Zl=37818,jl=37819,Jl=37820,Kl=37821,Ql=36492,ec=36494,tc=36495,nc=36283,ic=36284,sc=36285,rc=36286;var Qr=2300,za=2301,Ua=2302,dh=2400,fh=2401,ph=2402;var sf=3200,rf=3201;var kh=0,of=1,Ii="",tn="srgb",ps="srgb-linear",eo="linear",gt="srgb";var hs=7680;var mh=519,af=512,lf=513,cf=514,zh=515,hf=516,uf=517,df=518,ff=519,Ha=35044;var Hh="300 es",Jn=2e3,to=2001;var hi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Qt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Yu=1234567,sr=Math.PI/180,ar=180/Math.PI;function ci(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Qt[i&255]+Qt[i>>8&255]+Qt[i>>16&255]+Qt[i>>24&255]+"-"+Qt[e&255]+Qt[e>>8&255]+"-"+Qt[e>>16&15|64]+Qt[e>>24&255]+"-"+Qt[t&63|128]+Qt[t>>8&255]+"-"+Qt[t>>16&255]+Qt[t>>24&255]+Qt[n&255]+Qt[n>>8&255]+Qt[n>>16&255]+Qt[n>>24&255]).toLowerCase()}function Qe(i,e,t){return Math.max(e,Math.min(t,i))}function Vh(i,e){return(i%e+e)%e}function Gp(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Wp(i,e,t){return i!==e?(t-i)/(e-i):0}function jr(i,e,t){return(1-t)*i+t*e}function Xp(i,e,t,n){return jr(i,e,1-Math.exp(-t*n))}function $p(i,e=1){return e-Math.abs(Vh(i,e*2)-e)}function qp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Yp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Zp(i,e){return i+Math.floor(Math.random()*(e-i+1))}function jp(i,e){return i+Math.random()*(e-i)}function Jp(i){return i*(.5-Math.random())}function Kp(i){i!==void 0&&(Yu=i);let e=Yu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Qp(i){return i*sr}function em(i){return i*ar}function tm(i){return(i&i-1)===0&&i!==0}function nm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function im(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function sm(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),f=o((e-n)/2),p=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*h,l*u,l*f,a*c);break;case"YZY":i.set(l*f,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*f,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*p,a*c);break;case"YXY":i.set(l*p,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*p,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function jn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function mt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Gh={DEG2RAD:sr,RAD2DEG:ar,generateUUID:ci,clamp:Qe,euclideanModulo:Vh,mapLinear:Gp,inverseLerp:Wp,lerp:jr,damp:Xp,pingpong:$p,smoothstep:qp,smootherstep:Yp,randInt:Zp,randFloat:jp,randFloatSpread:Jp,seededRandom:Kp,degToRad:Qp,radToDeg:em,isPowerOfTwo:tm,ceilPowerOfTwo:nm,floorPowerOfTwo:im,setQuaternionFromProperEuler:sm,normalize:mt,denormalize:jn},le=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},kn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],f=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(u!==_||l!==f||c!==p||h!==g){let m=1-a,d=l*f+c*p+h*g+u*_,T=d>=0?1:-1,v=1-d*d;if(v>Number.EPSILON){let w=Math.sqrt(v),A=Math.atan2(w,d*T);m=Math.sin(m*A)/w,a=Math.sin(a*A)/w}let x=a*T;if(l=l*m+f*x,c=c*m+p*x,h=h*m+g*x,u=u*m+_*x,m===1-a){let w=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=w,c*=w,h*=w,u*=w}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],f=r[o+1],p=r[o+2],g=r[o+3];return e[t]=a*g+h*u+l*p-c*f,e[t+1]=l*g+h*f+c*u-a*p,e[t+2]=c*g+h*p+a*f-l*u,e[t+3]=h*g-a*u-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),f=l(n/2),p=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=f*h*u+c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u-f*p*g;break;case"YXZ":this._x=f*h*u+c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u+f*p*g;break;case"ZXY":this._x=f*h*u-c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u-f*p*g;break;case"ZYX":this._x=f*h*u-c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u+f*p*g;break;case"YZX":this._x=f*h*u+c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u-f*p*g;break;case"XZY":this._x=f*h*u-c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+a+u;if(f>0){let p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(n>a&&n>u){let p=2*Math.sqrt(1+n-a-u);this._w=(h-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>u){let p=2*Math.sqrt(1+a-n-u);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+u-n-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Qe(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let p=1-t;return this._w=p*o+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Zu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Zu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this.z=Qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this.z=Qe(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Oc.copy(this).projectOnVector(e),this.sub(Oc)}reflect(e){return this.sub(Oc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Oc=new L,Zu=new kn,je=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],p=n[5],g=n[8],_=s[0],m=s[3],d=s[6],T=s[1],v=s[4],x=s[7],w=s[2],A=s[5],C=s[8];return r[0]=o*_+a*T+l*w,r[3]=o*m+a*v+l*A,r[6]=o*d+a*x+l*C,r[1]=c*_+h*T+u*w,r[4]=c*m+h*v+u*A,r[7]=c*d+h*x+u*C,r[2]=f*_+p*T+g*w,r[5]=f*m+p*v+g*A,r[8]=f*d+p*x+g*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,f=a*l-h*r,p=c*r-o*l,g=t*u+n*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=u*_,e[1]=(s*c-h*n)*_,e[2]=(a*n-s*o)*_,e[3]=f*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-a*t)*_,e[6]=p*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Bc.makeScale(e,t)),this}rotate(e){return this.premultiply(Bc.makeRotation(-e)),this}translate(e,t){return this.premultiply(Bc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Bc=new je;function Wh(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function no(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function pf(){let i=no("canvas");return i.style.display="block",i}var ju={};function lr(i){i in ju||(ju[i]=!0,console.warn(i))}function mf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Ju=new je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ku=new je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function rm(){let i={enabled:!0,workingColorSpace:ps,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===gt&&(s.r=wi(s.r),s.g=wi(s.g),s.b=wi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===gt&&(s.r=rr(s.r),s.g=rr(s.g),s.b=rr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ii?eo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return lr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return lr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ps]:{primaries:e,whitePoint:n,transfer:eo,toXYZ:Ju,fromXYZ:Ku,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:tn},outputColorSpaceConfig:{drawingBufferColorSpace:tn}},[tn]:{primaries:e,whitePoint:n,transfer:gt,toXYZ:Ju,fromXYZ:Ku,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:tn}}}),i}var lt=rm();function wi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function rr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Vs,Va=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Vs===void 0&&(Vs=no("canvas")),Vs.width=e.width,Vs.height=e.height;let s=Vs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Vs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=no("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=wi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(wi(t[n]/255)*255):t[n]=wi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},om=0,cr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:om++}),this.uuid=ci(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(kc(s[o].image)):r.push(kc(s[o]))}else r=kc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function kc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Va.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var am=0,zc=new L,xn=class i extends hi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=zi,s=zi,r=Kn,o=Ji,a=zn,l=ti,c=i.DEFAULT_ANISOTROPY,h=Ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:am++}),this.uuid=ci(),this.name="",this.source=new cr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new le(0,0),this.repeat=new le(1,1),this.center=new le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(zc).x}get height(){return this.source.getSize(zc).y}get depth(){return this.source.getSize(zc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ih)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ba:e.x=e.x-Math.floor(e.x);break;case zi:e.x=e.x<0?0:1;break;case ka:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ba:e.y=e.y-Math.floor(e.y);break;case zi:e.y=e.y<0?0:1;break;case ka:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};xn.DEFAULT_IMAGE=null;xn.DEFAULT_MAPPING=Ih;xn.DEFAULT_ANISOTROPY=1;var Lt=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],p=l[5],g=l[9],_=l[2],m=l[6],d=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(c+1)/2,x=(p+1)/2,w=(d+1)/2,A=(h+f)/4,C=(u+_)/4,N=(g+m)/4;return v>x&&v>w?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=A/n,r=C/n):x>w?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=A/s,r=N/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=C/r,s=N/r),this.set(n,s,r,t),this}let T=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(T)<.001&&(T=1),this.x=(m-g)/T,this.y=(u-_)/T,this.z=(f-h)/T,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this.z=Qe(this.z,e.z,t.z),this.w=Qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this.z=Qe(this.z,e,t),this.w=Qe(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Ga=class extends hi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Kn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Lt(0,0,e,t),this.scissorTest=!1,this.viewport=new Lt(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new xn(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Kn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new cr(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},ui=class extends Ga{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},io=class extends xn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Bn,this.minFilter=Bn,this.wrapR=zi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Wa=class extends xn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Bn,this.minFilter=Bn,this.wrapR=zi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var di=class{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(qn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(qn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=qn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,qn):qn.fromBufferAttribute(r,o),qn.applyMatrix4(e.matrixWorld),this.expandByPoint(qn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ra.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ra.copy(n.boundingBox)),ra.applyMatrix4(e.matrixWorld),this.union(ra)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,qn),qn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Hr),oa.subVectors(this.max,Hr),Gs.subVectors(e.a,Hr),Ws.subVectors(e.b,Hr),Xs.subVectors(e.c,Hr),Ni.subVectors(Ws,Gs),Ui.subVectors(Xs,Ws),os.subVectors(Gs,Xs);let t=[0,-Ni.z,Ni.y,0,-Ui.z,Ui.y,0,-os.z,os.y,Ni.z,0,-Ni.x,Ui.z,0,-Ui.x,os.z,0,-os.x,-Ni.y,Ni.x,0,-Ui.y,Ui.x,0,-os.y,os.x,0];return!Hc(t,Gs,Ws,Xs,oa)||(t=[1,0,0,0,1,0,0,0,1],!Hc(t,Gs,Ws,Xs,oa))?!1:(aa.crossVectors(Ni,Ui),t=[aa.x,aa.y,aa.z],Hc(t,Gs,Ws,Xs,oa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(bi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),bi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),bi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),bi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),bi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),bi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),bi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),bi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(bi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},bi=[new L,new L,new L,new L,new L,new L,new L,new L],qn=new L,ra=new di,Gs=new L,Ws=new L,Xs=new L,Ni=new L,Ui=new L,os=new L,Hr=new L,oa=new L,aa=new L,as=new L;function Hc(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){as.fromArray(i,r);let a=s.x*Math.abs(as.x)+s.y*Math.abs(as.y)+s.z*Math.abs(as.z),l=e.dot(as),c=t.dot(as),h=n.dot(as);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var lm=new di,Vr=new L,Vc=new L,ms=class{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):lm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Vr.subVectors(e,this.center);let t=Vr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Vr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Vc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Vr.copy(e.center).add(Vc)),this.expandByPoint(Vr.copy(e.center).sub(Vc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Mi=new L,Gc=new L,la=new L,Fi=new L,Wc=new L,ca=new L,Xc=new L,Vi=class{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Mi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Mi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Mi.copy(this.origin).addScaledVector(this.direction,t),Mi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Gc.copy(e).add(t).multiplyScalar(.5),la.copy(t).sub(e).normalize(),Fi.copy(this.origin).sub(Gc);let r=e.distanceTo(t)*.5,o=-this.direction.dot(la),a=Fi.dot(this.direction),l=-Fi.dot(la),c=Fi.lengthSq(),h=Math.abs(1-o*o),u,f,p,g;if(h>0)if(u=o*l-a,f=o*a-l,g=r*h,u>=0)if(f>=-g)if(f<=g){let _=1/h;u*=_,f*=_,p=u*(u+o*f+2*a)+f*(o*u+f+2*l)+c}else f=r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),p=f*(f+2*l)+c):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+f*(f+2*l)+c);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Gc).addScaledVector(la,f),p}intersectSphere(e,t){Mi.subVectors(e.center,this.origin);let n=Mi.dot(this.direction),s=Mi.dot(Mi)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Mi)!==null}intersectTriangle(e,t,n,s,r){Wc.subVectors(t,e),ca.subVectors(n,e),Xc.crossVectors(Wc,ca);let o=this.direction.dot(Xc),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Fi.subVectors(this.origin,e);let l=a*this.direction.dot(ca.crossVectors(Fi,ca));if(l<0)return null;let c=a*this.direction.dot(Wc.cross(Fi));if(c<0||l+c>o)return null;let h=-a*Fi.dot(Xc);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ft=class i{constructor(e,t,n,s,r,o,a,l,c,h,u,f,p,g,_,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,u,f,p,g,_,m)}set(e,t,n,s,r,o,a,l,c,h,u,f,p,g,_,m){let d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=f,d[3]=p,d[7]=g,d[11]=_,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/$s.setFromMatrixColumn(e,0).length(),r=1/$s.setFromMatrixColumn(e,1).length(),o=1/$s.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let f=o*h,p=o*u,g=a*h,_=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+g*c,t[5]=f-_*c,t[9]=-a*l,t[2]=_-f*c,t[6]=g+p*c,t[10]=o*l}else if(e.order==="YXZ"){let f=l*h,p=l*u,g=c*h,_=c*u;t[0]=f+_*a,t[4]=g*a-p,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=p*a-g,t[6]=_+f*a,t[10]=o*l}else if(e.order==="ZXY"){let f=l*h,p=l*u,g=c*h,_=c*u;t[0]=f-_*a,t[4]=-o*u,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*h,t[9]=_-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let f=o*h,p=o*u,g=a*h,_=a*u;t[0]=l*h,t[4]=g*c-p,t[8]=f*c+_,t[1]=l*u,t[5]=_*c+f,t[9]=p*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let f=o*l,p=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=_-f*u,t[8]=g*u+p,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=p*u+g,t[10]=f-_*u}else if(e.order==="XZY"){let f=o*l,p=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+_,t[5]=o*h,t[9]=p*u-g,t[2]=g*u-p,t[6]=a*h,t[10]=_*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(cm,e,hm)}lookAt(e,t,n){let s=this.elements;return En.subVectors(e,t),En.lengthSq()===0&&(En.z=1),En.normalize(),Oi.crossVectors(n,En),Oi.lengthSq()===0&&(Math.abs(n.z)===1?En.x+=1e-4:En.z+=1e-4,En.normalize(),Oi.crossVectors(n,En)),Oi.normalize(),ha.crossVectors(En,Oi),s[0]=Oi.x,s[4]=ha.x,s[8]=En.x,s[1]=Oi.y,s[5]=ha.y,s[9]=En.y,s[2]=Oi.z,s[6]=ha.z,s[10]=En.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],p=n[13],g=n[2],_=n[6],m=n[10],d=n[14],T=n[3],v=n[7],x=n[11],w=n[15],A=s[0],C=s[4],N=s[8],b=s[12],M=s[1],P=s[5],G=s[9],X=s[13],j=s[2],H=s[6],V=s[10],ee=s[14],$=s[3],ue=s[7],ye=s[11],Ee=s[15];return r[0]=o*A+a*M+l*j+c*$,r[4]=o*C+a*P+l*H+c*ue,r[8]=o*N+a*G+l*V+c*ye,r[12]=o*b+a*X+l*ee+c*Ee,r[1]=h*A+u*M+f*j+p*$,r[5]=h*C+u*P+f*H+p*ue,r[9]=h*N+u*G+f*V+p*ye,r[13]=h*b+u*X+f*ee+p*Ee,r[2]=g*A+_*M+m*j+d*$,r[6]=g*C+_*P+m*H+d*ue,r[10]=g*N+_*G+m*V+d*ye,r[14]=g*b+_*X+m*ee+d*Ee,r[3]=T*A+v*M+x*j+w*$,r[7]=T*C+v*P+x*H+w*ue,r[11]=T*N+v*G+x*V+w*ye,r[15]=T*b+v*X+x*ee+w*Ee,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],p=e[14],g=e[3],_=e[7],m=e[11],d=e[15];return g*(+r*l*u-s*c*u-r*a*f+n*c*f+s*a*p-n*l*p)+_*(+t*l*p-t*c*f+r*o*f-s*o*p+s*c*h-r*l*h)+m*(+t*c*u-t*a*p-r*o*u+n*o*p+r*a*h-n*c*h)+d*(-s*a*h-t*l*u+t*a*f+s*o*u-n*o*f+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],p=e[11],g=e[12],_=e[13],m=e[14],d=e[15],T=u*m*c-_*f*c+_*l*p-a*m*p-u*l*d+a*f*d,v=g*f*c-h*m*c-g*l*p+o*m*p+h*l*d-o*f*d,x=h*_*c-g*u*c+g*a*p-o*_*p-h*a*d+o*u*d,w=g*u*l-h*_*l-g*a*f+o*_*f+h*a*m-o*u*m,A=t*T+n*v+s*x+r*w;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/A;return e[0]=T*C,e[1]=(_*f*r-u*m*r-_*s*p+n*m*p+u*s*d-n*f*d)*C,e[2]=(a*m*r-_*l*r+_*s*c-n*m*c-a*s*d+n*l*d)*C,e[3]=(u*l*r-a*f*r-u*s*c+n*f*c+a*s*p-n*l*p)*C,e[4]=v*C,e[5]=(h*m*r-g*f*r+g*s*p-t*m*p-h*s*d+t*f*d)*C,e[6]=(g*l*r-o*m*r-g*s*c+t*m*c+o*s*d-t*l*d)*C,e[7]=(o*f*r-h*l*r+h*s*c-t*f*c-o*s*p+t*l*p)*C,e[8]=x*C,e[9]=(g*u*r-h*_*r-g*n*p+t*_*p+h*n*d-t*u*d)*C,e[10]=(o*_*r-g*a*r+g*n*c-t*_*c-o*n*d+t*a*d)*C,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*p-t*a*p)*C,e[12]=w*C,e[13]=(h*_*s-g*u*s+g*n*f-t*_*f-h*n*m+t*u*m)*C,e[14]=(g*a*s-o*_*s-g*n*l+t*_*l+o*n*m-t*a*m)*C,e[15]=(o*u*s-h*a*s+h*n*l-t*u*l-o*n*f+t*a*f)*C,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,f=r*c,p=r*h,g=r*u,_=o*h,m=o*u,d=a*u,T=l*c,v=l*h,x=l*u,w=n.x,A=n.y,C=n.z;return s[0]=(1-(_+d))*w,s[1]=(p+x)*w,s[2]=(g-v)*w,s[3]=0,s[4]=(p-x)*A,s[5]=(1-(f+d))*A,s[6]=(m+T)*A,s[7]=0,s[8]=(g+v)*C,s[9]=(m-T)*C,s[10]=(1-(f+_))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=$s.set(s[0],s[1],s[2]).length(),o=$s.set(s[4],s[5],s[6]).length(),a=$s.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Yn.copy(this);let c=1/r,h=1/o,u=1/a;return Yn.elements[0]*=c,Yn.elements[1]*=c,Yn.elements[2]*=c,Yn.elements[4]*=h,Yn.elements[5]*=h,Yn.elements[6]*=h,Yn.elements[8]*=u,Yn.elements[9]*=u,Yn.elements[10]*=u,t.setFromRotationMatrix(Yn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=Jn,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-s),f=(t+e)/(t-e),p=(n+s)/(n-s),g,_;if(l)g=r/(o-r),_=o*r/(o-r);else if(a===Jn)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===to)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Jn,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-s),f=-(t+e)/(t-e),p=-(n+s)/(n-s),g,_;if(l)g=1/(o-r),_=o/(o-r);else if(a===Jn)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===to)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},$s=new L,Yn=new ft,cm=new L(0,0,0),hm=new L(1,1,1),Oi=new L,ha=new L,En=new L,Qu=new ft,ed=new kn,Qn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Qe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Qe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Qu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Qu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ed.setFromEuler(this),this.setFromQuaternion(ed,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Qn.DEFAULT_ORDER="XYZ";var hr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},um=0,td=new L,qs=new kn,Si=new ft,ua=new L,Gr=new L,dm=new L,fm=new kn,nd=new L(1,0,0),id=new L(0,1,0),sd=new L(0,0,1),rd={type:"added"},pm={type:"removed"},Ys={type:"childadded",child:null},$c={type:"childremoved",child:null},Ht=class i extends hi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:um++}),this.uuid=ci(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new L,t=new Qn,n=new kn,s=new L(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ft},normalMatrix:{value:new je}}),this.matrix=new ft,this.matrixWorld=new ft,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new hr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return qs.setFromAxisAngle(e,t),this.quaternion.multiply(qs),this}rotateOnWorldAxis(e,t){return qs.setFromAxisAngle(e,t),this.quaternion.premultiply(qs),this}rotateX(e){return this.rotateOnAxis(nd,e)}rotateY(e){return this.rotateOnAxis(id,e)}rotateZ(e){return this.rotateOnAxis(sd,e)}translateOnAxis(e,t){return td.copy(e).applyQuaternion(this.quaternion),this.position.add(td.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(nd,e)}translateY(e){return this.translateOnAxis(id,e)}translateZ(e){return this.translateOnAxis(sd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Si.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ua.copy(e):ua.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Gr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Si.lookAt(Gr,ua,this.up):Si.lookAt(ua,Gr,this.up),this.quaternion.setFromRotationMatrix(Si),s&&(Si.extractRotation(s.matrixWorld),qs.setFromRotationMatrix(Si),this.quaternion.premultiply(qs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(rd),Ys.child=e,this.dispatchEvent(Ys),Ys.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(pm),$c.child=e,this.dispatchEvent($c),$c.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Si.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Si.multiply(e.parent.matrixWorld)),e.applyMatrix4(Si),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(rd),Ys.child=e,this.dispatchEvent(Ys),Ys.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,e,dm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,fm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),f=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Ht.DEFAULT_UP=new L(0,1,0);Ht.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Zn=new L,Ei=new L,qc=new L,Ti=new L,Zs=new L,js=new L,od=new L,Yc=new L,Zc=new L,jc=new L,Jc=new Lt,Kc=new Lt,Qc=new Lt,li=class i{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Zn.subVectors(e,t),s.cross(Zn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Zn.subVectors(s,t),Ei.subVectors(n,t),qc.subVectors(e,t);let o=Zn.dot(Zn),a=Zn.dot(Ei),l=Zn.dot(qc),c=Ei.dot(Ei),h=Ei.dot(qc),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let f=1/u,p=(c*l-a*h)*f,g=(o*h-a*l)*f;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Ti)===null?!1:Ti.x>=0&&Ti.y>=0&&Ti.x+Ti.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,Ti)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ti.x),l.addScaledVector(o,Ti.y),l.addScaledVector(a,Ti.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return Jc.setScalar(0),Kc.setScalar(0),Qc.setScalar(0),Jc.fromBufferAttribute(e,t),Kc.fromBufferAttribute(e,n),Qc.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Jc,r.x),o.addScaledVector(Kc,r.y),o.addScaledVector(Qc,r.z),o}static isFrontFacing(e,t,n,s){return Zn.subVectors(n,t),Ei.subVectors(e,t),Zn.cross(Ei).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Zn.subVectors(this.c,this.b),Ei.subVectors(this.a,this.b),Zn.cross(Ei).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;Zs.subVectors(s,n),js.subVectors(r,n),Yc.subVectors(e,n);let l=Zs.dot(Yc),c=js.dot(Yc);if(l<=0&&c<=0)return t.copy(n);Zc.subVectors(e,s);let h=Zs.dot(Zc),u=js.dot(Zc);if(h>=0&&u<=h)return t.copy(s);let f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(Zs,o);jc.subVectors(e,r);let p=Zs.dot(jc),g=js.dot(jc);if(g>=0&&p<=g)return t.copy(r);let _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(js,a);let m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return od.subVectors(r,s),a=(u-h)/(u-h+(p-g)),t.copy(s).addScaledVector(od,a);let d=1/(m+_+f);return o=_*d,a=f*d,t.copy(n).addScaledVector(Zs,o).addScaledVector(js,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},gf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bi={h:0,s:0,l:0},da={h:0,s:0,l:0};function eh(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Ze=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=tn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,lt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=lt.workingColorSpace){return this.r=e,this.g=t,this.b=n,lt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=lt.workingColorSpace){if(e=Vh(e,1),t=Qe(t,0,1),n=Qe(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=eh(o,r,e+1/3),this.g=eh(o,r,e),this.b=eh(o,r,e-1/3)}return lt.colorSpaceToWorking(this,s),this}setStyle(e,t=tn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=tn){let n=gf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=wi(e.r),this.g=wi(e.g),this.b=wi(e.b),this}copyLinearToSRGB(e){return this.r=rr(e.r),this.g=rr(e.g),this.b=rr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=tn){return lt.workingToColorSpace(en.copy(this),e),Math.round(Qe(en.r*255,0,255))*65536+Math.round(Qe(en.g*255,0,255))*256+Math.round(Qe(en.b*255,0,255))}getHexString(e=tn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=lt.workingColorSpace){lt.workingToColorSpace(en.copy(this),t);let n=en.r,s=en.g,r=en.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=lt.workingColorSpace){return lt.workingToColorSpace(en.copy(this),t),e.r=en.r,e.g=en.g,e.b=en.b,e}getStyle(e=tn){lt.workingToColorSpace(en.copy(this),e);let t=en.r,n=en.g,s=en.b;return e!==tn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Bi),this.setHSL(Bi.h+e,Bi.s+t,Bi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Bi),e.getHSL(da);let n=jr(Bi.h,da.h,t),s=jr(Bi.s,da.s,t),r=jr(Bi.l,da.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},en=new Ze;Ze.NAMES=gf;var mm=0,fi=class extends hi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:mm++}),this.uuid=ci(),this.name="",this.type="Material",this.blending=ds,this.side=Ai,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Fa,this.blendDst=Oa,this.blendEquation=Hi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ze(0,0,0),this.blendAlpha=0,this.depthFunc=fs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=mh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=hs,this.stencilZFail=hs,this.stencilZPass=hs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ds&&(n.blending=this.blending),this.side!==Ai&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Fa&&(n.blendSrc=this.blendSrc),this.blendDst!==Oa&&(n.blendDst=this.blendDst),this.blendEquation!==Hi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==fs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==mh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==hs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==hs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==hs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},sn=class extends fi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Qn,this.combine=Ch,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var kt=new L,fa=new le,gm=0,_n=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:gm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ha,this.updateRanges=[],this.gpuType=gi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)fa.fromBufferAttribute(this,t),fa.applyMatrix3(e),this.setXY(t,fa.x,fa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix3(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix4(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyNormalMatrix(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.transformDirection(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=jn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=mt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=jn(t,this.array)),t}setX(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=jn(t,this.array)),t}setY(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=jn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=jn(t,this.array)),t}setW(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array),s=mt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array),s=mt(s,this.array),r=mt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ha&&(e.usage=this.usage),e}};var so=class extends _n{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var ro=class extends _n{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var ut=class extends _n{constructor(e,t,n){super(new Float32Array(e),t,n)}},_m=0,Fn=new ft,th=new Ht,Js=new L,Tn=new di,Wr=new di,qt=new L,St=class i extends hi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:_m++}),this.uuid=ci(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Wh(e)?ro:so)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new je().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Fn.makeRotationFromQuaternion(e),this.applyMatrix4(Fn),this}rotateX(e){return Fn.makeRotationX(e),this.applyMatrix4(Fn),this}rotateY(e){return Fn.makeRotationY(e),this.applyMatrix4(Fn),this}rotateZ(e){return Fn.makeRotationZ(e),this.applyMatrix4(Fn),this}translate(e,t,n){return Fn.makeTranslation(e,t,n),this.applyMatrix4(Fn),this}scale(e,t,n){return Fn.makeScale(e,t,n),this.applyMatrix4(Fn),this}lookAt(e){return th.lookAt(e),th.updateMatrix(),this.applyMatrix4(th.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Js).negate(),this.translate(Js.x,Js.y,Js.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ut(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new di);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Tn.setFromBufferAttribute(r),this.morphTargetsRelative?(qt.addVectors(this.boundingBox.min,Tn.min),this.boundingBox.expandByPoint(qt),qt.addVectors(this.boundingBox.max,Tn.max),this.boundingBox.expandByPoint(qt)):(this.boundingBox.expandByPoint(Tn.min),this.boundingBox.expandByPoint(Tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ms);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){let n=this.boundingSphere.center;if(Tn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Wr.setFromBufferAttribute(a),this.morphTargetsRelative?(qt.addVectors(Tn.min,Wr.min),Tn.expandByPoint(qt),qt.addVectors(Tn.max,Wr.max),Tn.expandByPoint(qt)):(Tn.expandByPoint(Wr.min),Tn.expandByPoint(Wr.max))}Tn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)qt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(qt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)qt.fromBufferAttribute(a,c),l&&(Js.fromBufferAttribute(e,c),qt.add(Js)),s=Math.max(s,n.distanceToSquared(qt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new _n(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let N=0;N<n.count;N++)a[N]=new L,l[N]=new L;let c=new L,h=new L,u=new L,f=new le,p=new le,g=new le,_=new L,m=new L;function d(N,b,M){c.fromBufferAttribute(n,N),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,M),f.fromBufferAttribute(r,N),p.fromBufferAttribute(r,b),g.fromBufferAttribute(r,M),h.sub(c),u.sub(c),p.sub(f),g.sub(f);let P=1/(p.x*g.y-g.x*p.y);isFinite(P)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(P),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(P),a[N].add(_),a[b].add(_),a[M].add(_),l[N].add(m),l[b].add(m),l[M].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let N=0,b=T.length;N<b;++N){let M=T[N],P=M.start,G=M.count;for(let X=P,j=P+G;X<j;X+=3)d(e.getX(X+0),e.getX(X+1),e.getX(X+2))}let v=new L,x=new L,w=new L,A=new L;function C(N){w.fromBufferAttribute(s,N),A.copy(w);let b=a[N];v.copy(b),v.sub(w.multiplyScalar(w.dot(b))).normalize(),x.crossVectors(A,b);let P=x.dot(l[N])<0?-1:1;o.setXYZW(N,v.x,v.y,v.z,P)}for(let N=0,b=T.length;N<b;++N){let M=T[N],P=M.start,G=M.count;for(let X=P,j=P+G;X<j;X+=3)C(e.getX(X+0)),C(e.getX(X+1)),C(e.getX(X+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new _n(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);let s=new L,r=new L,o=new L,a=new L,l=new L,c=new L,h=new L,u=new L;if(e)for(let f=0,p=e.count;f<p;f+=3){let g=e.getX(f+0),_=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=t.count;f<p;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)qt.fromBufferAttribute(e,t),qt.normalize(),e.setXYZ(t,qt.x,qt.y,qt.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,f=new c.constructor(l.length*h),p=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*h;for(let d=0;d<h;d++)f[g++]=c[p++]}return new _n(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let f=c[h],p=e(f,n);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){let p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let f=0,p=u.length;f<p;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},ad=new ft,ls=new Vi,pa=new ms,ld=new L,ma=new L,ga=new L,_a=new L,nh=new L,xa=new L,cd=new L,ya=new L,_t=class extends Ht{constructor(e=new St,t=new sn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){xa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(nh.fromBufferAttribute(u,e),o?xa.addScaledVector(nh,h):xa.addScaledVector(nh.sub(t),h))}t.add(xa)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),pa.copy(n.boundingSphere),pa.applyMatrix4(r),ls.copy(e.ray).recast(e.near),!(pa.containsPoint(ls.origin)===!1&&(ls.intersectSphere(pa,ld)===null||ls.origin.distanceToSquared(ld)>(e.far-e.near)**2))&&(ad.copy(r).invert(),ls.copy(e.ray).applyMatrix4(ad),!(n.boundingBox!==null&&ls.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ls)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){let m=f[g],d=o[m.materialIndex],T=Math.max(m.start,p.start),v=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let x=T,w=v;x<w;x+=3){let A=a.getX(x),C=a.getX(x+1),N=a.getX(x+2);s=va(this,d,e,n,c,h,u,A,C,N),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){let T=a.getX(m),v=a.getX(m+1),x=a.getX(m+2);s=va(this,o,e,n,c,h,u,T,v,x),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){let m=f[g],d=o[m.materialIndex],T=Math.max(m.start,p.start),v=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let x=T,w=v;x<w;x+=3){let A=x,C=x+1,N=x+2;s=va(this,d,e,n,c,h,u,A,C,N),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){let T=m,v=m+1,x=m+2;s=va(this,o,e,n,c,h,u,T,v,x),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function xm(i,e,t,n,s,r,o,a){let l;if(e.side===cn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Ai,a),l===null)return null;ya.copy(a),ya.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(ya);return c<t.near||c>t.far?null:{distance:c,point:ya.clone(),object:i}}function va(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,ma),i.getVertexPosition(l,ga),i.getVertexPosition(c,_a);let h=xm(i,e,t,n,ma,ga,_a,cd);if(h){let u=new L;li.getBarycoord(cd,ma,ga,_a,u),s&&(h.uv=li.getInterpolatedAttribute(s,a,l,c,u,new le)),r&&(h.uv1=li.getInterpolatedAttribute(r,a,l,c,u,new le)),o&&(h.normal=li.getInterpolatedAttribute(o,a,l,c,u,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a,b:l,c,normal:new L,materialIndex:0};li.getNormal(ma,ga,_a,f.normal),h.face=f,h.barycoord=u}return h}var jt=class i extends St{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],f=0,p=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ut(c,3)),this.setAttribute("normal",new ut(h,3)),this.setAttribute("uv",new ut(u,2));function g(_,m,d,T,v,x,w,A,C,N,b){let M=x/C,P=w/N,G=x/2,X=w/2,j=A/2,H=C+1,V=N+1,ee=0,$=0,ue=new L;for(let ye=0;ye<V;ye++){let Ee=ye*P-X;for(let We=0;We<H;We++){let Je=We*M-G;ue[_]=Je*T,ue[m]=Ee*v,ue[d]=j,c.push(ue.x,ue.y,ue.z),ue[_]=0,ue[m]=0,ue[d]=A>0?1:-1,h.push(ue.x,ue.y,ue.z),u.push(We/C),u.push(1-ye/N),ee+=1}}for(let ye=0;ye<N;ye++)for(let Ee=0;Ee<C;Ee++){let We=f+Ee+H*ye,Je=f+Ee+H*(ye+1),nt=f+(Ee+1)+H*(ye+1),at=f+(Ee+1)+H*ye;l.push(We,Je,at),l.push(Je,nt,at),$+=6}a.addGroup(p,$,b),p+=$,f+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Ss(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function rn(i){let e={};for(let t=0;t<i.length;t++){let n=Ss(i[t]);for(let s in n)e[s]=n[s]}return e}function ym(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Xh(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:lt.workingColorSpace}var _f={clone:Ss,merge:rn},vm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,bm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ei=class extends fi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=vm,this.fragmentShader=bm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ss(e.uniforms),this.uniformsGroups=ym(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},oo=class extends Ht{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ft,this.projectionMatrix=new ft,this.projectionMatrixInverse=new ft,this.coordinateSystem=Jn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},ki=new L,hd=new le,ud=new le,Yt=class extends oo{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ar*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(sr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ar*2*Math.atan(Math.tan(sr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ki.x,ki.y).multiplyScalar(-e/ki.z),ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ki.x,ki.y).multiplyScalar(-e/ki.z)}getViewSize(e,t){return this.getViewBounds(e,hd,ud),t.subVectors(ud,hd)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(sr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ks=-90,Qs=1,Xa=class extends Ht{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Yt(Ks,Qs,e,t);s.layers=this.layers,this.add(s);let r=new Yt(Ks,Qs,e,t);r.layers=this.layers,this.add(r);let o=new Yt(Ks,Qs,e,t);o.layers=this.layers,this.add(o);let a=new Yt(Ks,Qs,e,t);a.layers=this.layers,this.add(a);let l=new Yt(Ks,Qs,e,t);l.layers=this.layers,this.add(l);let c=new Yt(Ks,Qs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===Jn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===to)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,f,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},ao=class extends xn{constructor(e=[],t=bs,n,s,r,o,a,l,c,h){super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},$a=class extends ui{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new ao(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new jt(5,5,5),r=new ei({name:"CubemapFromEquirect",uniforms:Ss(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:cn,blending:Ri});r.uniforms.tEquirect.value=t;let o=new _t(s,r),a=t.minFilter;return t.minFilter===Ji&&(t.minFilter=Kn),new Xa(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},nn=class extends Ht{constructor(){super(),this.isGroup=!0,this.type="Group"}},Mm={type:"move"},ur=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new nn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new nn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new nn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,n),d=this._getHandJoint(c,_);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&f>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Mm)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new nn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var lo=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ze(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},gs=class extends Ht{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Qn,this.environmentIntensity=1,this.environmentRotation=new Qn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},qa=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ha,this.updateRanges=[],this.version=0,this.uuid=ci()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ci()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ci()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},ln=new L,co=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)ln.fromBufferAttribute(this,t),ln.applyMatrix4(e),this.setXYZ(t,ln.x,ln.y,ln.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ln.fromBufferAttribute(this,t),ln.applyNormalMatrix(e),this.setXYZ(t,ln.x,ln.y,ln.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ln.fromBufferAttribute(this,t),ln.transformDirection(e),this.setXYZ(t,ln.x,ln.y,ln.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=jn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=mt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=mt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=mt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=mt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=mt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=jn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=jn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=jn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=jn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array),s=mt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array),s=mt(s,this.array),r=mt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new _n(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},dr=class extends fi{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ze(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},er,Xr=new L,tr=new L,nr=new L,ir=new le,$r=new le,xf=new ft,ba=new L,qr=new L,Ma=new L,dd=new le,ih=new le,fd=new le,ho=class extends Ht{constructor(e=new dr){if(super(),this.isSprite=!0,this.type="Sprite",er===void 0){er=new St;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new qa(t,5);er.setIndex([0,1,2,0,2,3]),er.setAttribute("position",new co(n,3,0,!1)),er.setAttribute("uv",new co(n,2,3,!1))}this.geometry=er,this.material=e,this.center=new le(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),tr.setFromMatrixScale(this.matrixWorld),xf.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),nr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&tr.multiplyScalar(-nr.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;Sa(ba.set(-.5,-.5,0),nr,o,tr,s,r),Sa(qr.set(.5,-.5,0),nr,o,tr,s,r),Sa(Ma.set(.5,.5,0),nr,o,tr,s,r),dd.set(0,0),ih.set(1,0),fd.set(1,1);let a=e.ray.intersectTriangle(ba,qr,Ma,!1,Xr);if(a===null&&(Sa(qr.set(-.5,.5,0),nr,o,tr,s,r),ih.set(0,1),a=e.ray.intersectTriangle(ba,Ma,qr,!1,Xr),a===null))return;let l=e.ray.origin.distanceTo(Xr);l<e.near||l>e.far||t.push({distance:l,point:Xr.clone(),uv:li.getInterpolation(Xr,ba,qr,Ma,dd,ih,fd,new le),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function Sa(i,e,t,n,s,r){ir.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?($r.x=r*ir.x-s*ir.y,$r.y=s*ir.x+r*ir.y):$r.copy(ir),i.copy(e),i.x+=$r.x,i.y+=$r.y,i.applyMatrix4(xf)}var sh=new L,Sm=new L,Em=new je,On=class{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=sh.subVectors(n,t).cross(Sm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(sh),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Em.getNormalMatrix(e),s=this.coplanarPoint(sh).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},cs=new ms,Tm=new le(.5,.5),Ea=new L,fr=class{constructor(e=new On,t=new On,n=new On,s=new On,r=new On,o=new On){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Jn,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],p=r[7],g=r[8],_=r[9],m=r[10],d=r[11],T=r[12],v=r[13],x=r[14],w=r[15];if(s[0].setComponents(c-o,p-h,d-g,w-T).normalize(),s[1].setComponents(c+o,p+h,d+g,w+T).normalize(),s[2].setComponents(c+a,p+u,d+_,w+v).normalize(),s[3].setComponents(c-a,p-u,d-_,w-v).normalize(),n)s[4].setComponents(l,f,m,x).normalize(),s[5].setComponents(c-l,p-f,d-m,w-x).normalize();else if(s[4].setComponents(c-l,p-f,d-m,w-x).normalize(),t===Jn)s[5].setComponents(c+l,p+f,d+m,w+x).normalize();else if(t===to)s[5].setComponents(l,f,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),cs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),cs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(cs)}intersectsSprite(e){cs.center.set(0,0,0);let t=Tm.distanceTo(e.center);return cs.radius=.7071067811865476+t,cs.applyMatrix4(e.matrixWorld),this.intersectsSphere(cs)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Ea.x=s.normal.x>0?e.max.x:e.min.x,Ea.y=s.normal.y>0?e.max.y:e.min.y,Ea.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ea)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var wn=class extends fi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Ya=new L,Za=new L,pd=new ft,Yr=new Vi,Ta=new ms,rh=new L,md=new L,Gi=class extends Ht{constructor(e=new St,t=new wn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Ya.fromBufferAttribute(t,s-1),Za.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Ya.distanceTo(Za);e.setAttribute("lineDistance",new ut(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ta.copy(n.boundingSphere),Ta.applyMatrix4(s),Ta.radius+=r,e.ray.intersectsSphere(Ta)===!1)return;pd.copy(s).invert(),Yr.copy(e.ray).applyMatrix4(pd);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){let p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=c){let d=h.getX(_),T=h.getX(_+1),v=wa(this,e,Yr,l,d,T,_);v&&t.push(v)}if(this.isLineLoop){let _=h.getX(g-1),m=h.getX(p),d=wa(this,e,Yr,l,_,m,g-1);d&&t.push(d)}}else{let p=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=c){let d=wa(this,e,Yr,l,_,_+1,_);d&&t.push(d)}if(this.isLineLoop){let _=wa(this,e,Yr,l,g-1,p,g-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function wa(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(Ya.fromBufferAttribute(a,s),Za.fromBufferAttribute(a,r),t.distanceSqToSegment(Ya,Za,rh,md)>n)return;rh.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(rh);if(!(c<e.near||c>e.far))return{distance:c,point:md.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var gd=new L,_d=new L,_s=class extends Gi{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)gd.fromBufferAttribute(t,s),_d.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+gd.distanceTo(_d);e.setAttribute("lineDistance",new ut(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Wi=class extends xn{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},uo=class extends xn{constructor(e,t,n=Ki,s,r,o,a=Bn,l=Bn,c,h=or,u=1){if(h!==or&&h!==Mr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:u};super(f,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new cr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},fo=class extends xn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var Ut=class i extends St{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],f=[],p=[],g=0,_=[],m=n/2,d=0;T(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new ut(u,3)),this.setAttribute("normal",new ut(f,3)),this.setAttribute("uv",new ut(p,2));function T(){let x=new L,w=new L,A=0,C=(t-e)/n;for(let N=0;N<=r;N++){let b=[],M=N/r,P=M*(t-e)+e;for(let G=0;G<=s;G++){let X=G/s,j=X*l+a,H=Math.sin(j),V=Math.cos(j);w.x=P*H,w.y=-M*n+m,w.z=P*V,u.push(w.x,w.y,w.z),x.set(H,C,V).normalize(),f.push(x.x,x.y,x.z),p.push(X,1-M),b.push(g++)}_.push(b)}for(let N=0;N<s;N++)for(let b=0;b<r;b++){let M=_[b][N],P=_[b+1][N],G=_[b+1][N+1],X=_[b][N+1];(e>0||b!==0)&&(h.push(M,P,X),A+=3),(t>0||b!==r-1)&&(h.push(P,G,X),A+=3)}c.addGroup(d,A,0),d+=A}function v(x){let w=g,A=new le,C=new L,N=0,b=x===!0?e:t,M=x===!0?1:-1;for(let G=1;G<=s;G++)u.push(0,m*M,0),f.push(0,M,0),p.push(.5,.5),g++;let P=g;for(let G=0;G<=s;G++){let j=G/s*l+a,H=Math.cos(j),V=Math.sin(j);C.x=b*V,C.y=m*M,C.z=b*H,u.push(C.x,C.y,C.z),f.push(0,M,0),A.x=H*.5+.5,A.y=V*.5*M+.5,p.push(A.x,A.y),g++}for(let G=0;G<s;G++){let X=w+G,j=P+G;x===!0?h.push(j,j+1,X):h.push(j+1,j,X),N+=3}c.addGroup(d,N,x===!0?1:2),d+=N}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ja=class i extends Ut{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Aa=new L,Ra=new L,oh=new L,Ca=new li,po=class extends St{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let s=Math.pow(10,4),r=Math.cos(sr*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),f={},p=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);let{a:_,b:m,c:d}=Ca;if(_.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),d.fromBufferAttribute(a,c[2]),Ca.getNormal(oh),u[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,u[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,u[2]=`${Math.round(d.x*s)},${Math.round(d.y*s)},${Math.round(d.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let T=0;T<3;T++){let v=(T+1)%3,x=u[T],w=u[v],A=Ca[h[T]],C=Ca[h[v]],N=`${x}_${w}`,b=`${w}_${x}`;b in f&&f[b]?(oh.dot(f[b].normal)<=r&&(p.push(A.x,A.y,A.z),p.push(C.x,C.y,C.z)),f[b]=null):N in f||(f[N]={index0:c[T],index1:c[v],normal:oh.clone()})}}for(let g in f)if(f[g]){let{index0:_,index1:m}=f[g];Aa.fromBufferAttribute(a,_),Ra.fromBufferAttribute(a,m),p.push(Aa.x,Aa.y,Aa.z),p.push(Ra.x,Ra.y,Ra.z)}this.setAttribute("position",new ut(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},An=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],f=n[s+1]-h,p=(o-h)/f;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new le:new L);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new L,s=[],r=[],o=[],a=new L,l=new ft;for(let p=0;p<=e;p++){let g=p/e;s[p]=this.getTangentAt(g,new L)}r[0]=new L,o[0]=new L;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),f<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(Qe(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(a,g))}o[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(Qe(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],p*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},pr=class extends An{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new le){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,p=c-this.aY;l=f*h-p*u+this.aX,c=f*u+p*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Ja=class extends pr{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function $h(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let f=(o-r)/c-(a-r)/(c+h)+(a-o)/h,p=(a-o)/h-(l-o)/(h+u)+(l-a)/u;f*=h,p*=h,s(o,a,f,p)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var Ia=new L,ah=new $h,lh=new $h,ch=new $h,Ka=class extends An{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new L){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(Ia.subVectors(s[0],s[1]).add(s[0]),c=Ia);let u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Ia.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Ia),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(h),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),ah.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,g,_,m),lh.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,g,_,m),ch.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(ah.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),lh.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),ch.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return n.set(ah.calc(l),lh.calc(l),ch.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function xd(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function wm(i,e){let t=1-i;return t*t*e}function Am(i,e){return 2*(1-i)*i*e}function Rm(i,e){return i*i*e}function Jr(i,e,t,n){return wm(i,e)+Am(i,t)+Rm(i,n)}function Cm(i,e){let t=1-i;return t*t*t*e}function Im(i,e){let t=1-i;return 3*t*t*i*e}function Pm(i,e){return 3*(1-i)*i*i*e}function Dm(i,e){return i*i*i*e}function Kr(i,e,t,n,s){return Cm(i,e)+Im(i,t)+Pm(i,n)+Dm(i,s)}var mo=class extends An{constructor(e=new le,t=new le,n=new le,s=new le){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new le){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Kr(e,s.x,r.x,o.x,a.x),Kr(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Qa=class extends An{constructor(e=new L,t=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new L){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Kr(e,s.x,r.x,o.x,a.x),Kr(e,s.y,r.y,o.y,a.y),Kr(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},go=class extends An{constructor(e=new le,t=new le){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new le){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new le){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},el=class extends An{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},_o=class extends An{constructor(e=new le,t=new le,n=new le){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new le){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Jr(e,s.x,r.x,o.x),Jr(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},tl=class extends An{constructor(e=new L,t=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new L){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Jr(e,s.x,r.x,o.x),Jr(e,s.y,r.y,o.y),Jr(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},xo=class extends An{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new le){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(xd(a,l.x,c.x,h.x,u.x),xd(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new le().fromArray(s))}return this}},gh=Object.freeze({__proto__:null,ArcCurve:Ja,CatmullRomCurve3:Ka,CubicBezierCurve:mo,CubicBezierCurve3:Qa,EllipseCurve:pr,LineCurve:go,LineCurve3:el,QuadraticBezierCurve:_o,QuadraticBezierCurve3:tl,SplineCurve:xo}),nl=class extends An{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new gh[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new gh[s.type]().fromJSON(s))}return this}},yo=class extends nl{constructor(e){super(),this.type="Path",this.currentPoint=new le,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new go(this.currentPoint.clone(),new le(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new _o(this.currentPoint.clone(),new le(e,t),new le(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new mo(this.currentPoint.clone(),new le(e,t),new le(n,s),new le(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new xo(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){let c=new pr(e,t,n,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},mr=class extends yo{constructor(e){super(e),this.uuid=ci(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new yo().fromJSON(s))}return this}};function Lm(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=yf(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=Bm(i,e,r,t)),i.length>80*t){a=1/0,l=1/0;let h=-1/0,u=-1/0;for(let f=t;f<s;f+=t){let p=i[f],g=i[f+1];p<a&&(a=p),g<l&&(l=g),p>h&&(h=p),g>u&&(u=g)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return vo(r,o,t,a,l,c,0),o}function yf(i,e,t,n,s){let r;if(s===Zm(i,e,t,n)>0)for(let o=e;o<t;o+=n)r=yd(o/n|0,i[o],i[o+1],r);else for(let o=t-n;o>=e;o-=n)r=yd(o/n|0,i[o],i[o+1],r);return r&&gr(r,r.next)&&(Mo(r),r=r.next),r}function xs(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(gr(t,t.next)||Dt(t.prev,t,t.next)===0)){if(Mo(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function vo(i,e,t,n,s,r,o){if(!i)return;!o&&r&&Gm(i,n,s,r);let a=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?Um(i,n,s,r):Nm(i)){e.push(l.i,i.i,c.i),Mo(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=Fm(xs(i),e),vo(i,e,t,n,s,r,2)):o===2&&Om(i,e,t,n,s,r):vo(xs(i),e,t,n,s,r,1);break}}}function Nm(i){let e=i.prev,t=i,n=i.next;if(Dt(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=Math.min(s,r,o),u=Math.min(a,l,c),f=Math.max(s,r,o),p=Math.max(a,l,c),g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=p&&Zr(s,a,r,l,o,c,g.x,g.y)&&Dt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Um(i,e,t,n){let s=i.prev,r=i,o=i.next;if(Dt(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,f=o.y,p=Math.min(a,l,c),g=Math.min(h,u,f),_=Math.max(a,l,c),m=Math.max(h,u,f),d=_h(p,g,e,t,n),T=_h(_,m,e,t,n),v=i.prevZ,x=i.nextZ;for(;v&&v.z>=d&&x&&x.z<=T;){if(v.x>=p&&v.x<=_&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Zr(a,h,l,u,c,f,v.x,v.y)&&Dt(v.prev,v,v.next)>=0||(v=v.prevZ,x.x>=p&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&Zr(a,h,l,u,c,f,x.x,x.y)&&Dt(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;v&&v.z>=d;){if(v.x>=p&&v.x<=_&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Zr(a,h,l,u,c,f,v.x,v.y)&&Dt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;x&&x.z<=T;){if(x.x>=p&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&Zr(a,h,l,u,c,f,x.x,x.y)&&Dt(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function Fm(i,e){let t=i;do{let n=t.prev,s=t.next.next;!gr(n,s)&&bf(n,t,t.next,s)&&bo(n,s)&&bo(s,n)&&(e.push(n.i,t.i,s.i),Mo(t),Mo(t.next),t=i=s),t=t.next}while(t!==i);return xs(t)}function Om(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&$m(o,a)){let l=Mf(o,a);o=xs(o,o.next),l=xs(l,l.next),vo(o,e,t,n,s,r,0),vo(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Bm(i,e,t,n){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=yf(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Xm(c))}s.sort(km);for(let r=0;r<s.length;r++)t=zm(s[r],t);return t}function km(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function zm(i,e){let t=Hm(i,e);if(!t)return e;let n=Mf(t,i);return xs(n,n.next),xs(t,t.next)}function Hm(i,e){let t=e,n=i.x,s=i.y,r=-1/0,o;if(gr(i,t))return t;do{if(gr(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,o=t.x<t.next.x?t:t.next,u===n))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;t=o;do{if(n>=t.x&&t.x>=l&&n!==t.x&&vf(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);bo(t,i)&&(u<h||u===h&&(t.x>o.x||t.x===o.x&&Vm(o,t)))&&(o=t,h=u)}t=t.next}while(t!==a);return o}function Vm(i,e){return Dt(i.prev,i,e.prev)<0&&Dt(e.next,i,i.next)<0}function Gm(i,e,t,n){let s=i;do s.z===0&&(s.z=_h(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Wm(s)}function Wm(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let o=n,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,t*=2}while(e>1);return i}function _h(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Xm(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function vf(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function Zr(i,e,t,n,s,r,o,a){return!(i===o&&e===a)&&vf(i,e,t,n,s,r,o,a)}function $m(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!qm(i,e)&&(bo(i,e)&&bo(e,i)&&Ym(i,e)&&(Dt(i.prev,i,e.prev)||Dt(i,e.prev,e))||gr(i,e)&&Dt(i.prev,i,i.next)>0&&Dt(e.prev,e,e.next)>0)}function Dt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function gr(i,e){return i.x===e.x&&i.y===e.y}function bf(i,e,t,n){let s=Da(Dt(i,e,t)),r=Da(Dt(i,e,n)),o=Da(Dt(t,n,i)),a=Da(Dt(t,n,e));return!!(s!==r&&o!==a||s===0&&Pa(i,t,e)||r===0&&Pa(i,n,e)||o===0&&Pa(t,i,n)||a===0&&Pa(t,e,n))}function Pa(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Da(i){return i>0?1:i<0?-1:0}function qm(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&bf(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function bo(i,e){return Dt(i.prev,i,i.next)<0?Dt(i,e,i.next)>=0&&Dt(i,i.prev,e)>=0:Dt(i,e,i.prev)<0||Dt(i,i.next,e)<0}function Ym(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Mf(i,e){let t=xh(i.i,i.x,i.y),n=xh(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function yd(i,e,t,n){let s=xh(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Mo(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function xh(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Zm(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var yh=class{static triangulate(e,t,n=2){return Lm(e,t,n)}},us=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];vd(e),bd(n,e);let o=e.length;t.forEach(vd);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,bd(n,t[l]);let a=yh.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function vd(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function bd(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var So=class i extends St{constructor(e=new mr([new le(.5,.5),new le(-.5,.5),new le(-.5,-.5),new le(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new ut(s,3)),this.setAttribute("uv",new ut(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,p=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:p-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,d=t.extrudePath,T=t.UVGenerator!==void 0?t.UVGenerator:jm,v,x=!1,w,A,C,N;d&&(v=d.getSpacedPoints(h),x=!0,f=!1,w=d.computeFrenetFrames(h,!1),A=new L,C=new L,N=new L),f||(m=0,p=0,g=0,_=0);let b=a.extractPoints(c),M=b.shape,P=b.holes;if(!us.isClockWise(M)){M=M.reverse();for(let oe=0,se=P.length;oe<se;oe++){let ne=P[oe];us.isClockWise(ne)&&(P[oe]=ne.reverse())}}function X(oe){let ne=10000000000000001e-36,te=oe[0];for(let xe=1;xe<=oe.length;xe++){let ce=xe%oe.length,ge=oe[ce],$e=ge.x-te.x,Ve=ge.y-te.y,R=$e*$e+Ve*Ve,y=Math.max(Math.abs(ge.x),Math.abs(ge.y),Math.abs(te.x),Math.abs(te.y)),O=ne*y*y;if(R<=O){oe.splice(ce,1),xe--;continue}te=ge}}X(M),P.forEach(X);let j=P.length,H=M;for(let oe=0;oe<j;oe++){let se=P[oe];M=M.concat(se)}function V(oe,se,ne){return se||console.error("THREE.ExtrudeGeometry: vec does not exist"),oe.clone().addScaledVector(se,ne)}let ee=M.length;function $(oe,se,ne){let te,xe,ce,ge=oe.x-se.x,$e=oe.y-se.y,Ve=ne.x-oe.x,R=ne.y-oe.y,y=ge*ge+$e*$e,O=ge*R-$e*Ve;if(Math.abs(O)>Number.EPSILON){let q=Math.sqrt(y),re=Math.sqrt(Ve*Ve+R*R),K=se.x-$e/q,De=se.y+ge/q,pe=ne.x-R/re,Pe=ne.y+Ve/re,Ae=((pe-K)*R-(Pe-De)*Ve)/(ge*R-$e*Ve);te=K+ge*Ae-oe.x,xe=De+$e*Ae-oe.y;let de=te*te+xe*xe;if(de<=2)return new le(te,xe);ce=Math.sqrt(de/2)}else{let q=!1;ge>Number.EPSILON?Ve>Number.EPSILON&&(q=!0):ge<-Number.EPSILON?Ve<-Number.EPSILON&&(q=!0):Math.sign($e)===Math.sign(R)&&(q=!0),q?(te=-$e,xe=ge,ce=Math.sqrt(y)):(te=ge,xe=$e,ce=Math.sqrt(y/2))}return new le(te/ce,xe/ce)}let ue=[];for(let oe=0,se=H.length,ne=se-1,te=oe+1;oe<se;oe++,ne++,te++)ne===se&&(ne=0),te===se&&(te=0),ue[oe]=$(H[oe],H[ne],H[te]);let ye=[],Ee,We=ue.concat();for(let oe=0,se=j;oe<se;oe++){let ne=P[oe];Ee=[];for(let te=0,xe=ne.length,ce=xe-1,ge=te+1;te<xe;te++,ce++,ge++)ce===xe&&(ce=0),ge===xe&&(ge=0),Ee[te]=$(ne[te],ne[ce],ne[ge]);ye.push(Ee),We=We.concat(Ee)}let Je;if(m===0)Je=us.triangulateShape(H,P);else{let oe=[],se=[];for(let ne=0;ne<m;ne++){let te=ne/m,xe=p*Math.cos(te*Math.PI/2),ce=g*Math.sin(te*Math.PI/2)+_;for(let ge=0,$e=H.length;ge<$e;ge++){let Ve=V(H[ge],ue[ge],ce);Oe(Ve.x,Ve.y,-xe),te===0&&oe.push(Ve)}for(let ge=0,$e=j;ge<$e;ge++){let Ve=P[ge];Ee=ye[ge];let R=[];for(let y=0,O=Ve.length;y<O;y++){let q=V(Ve[y],Ee[y],ce);Oe(q.x,q.y,-xe),te===0&&R.push(q)}te===0&&se.push(R)}}Je=us.triangulateShape(oe,se)}let nt=Je.length,at=g+_;for(let oe=0;oe<ee;oe++){let se=f?V(M[oe],We[oe],at):M[oe];x?(C.copy(w.normals[0]).multiplyScalar(se.x),A.copy(w.binormals[0]).multiplyScalar(se.y),N.copy(v[0]).add(C).add(A),Oe(N.x,N.y,N.z)):Oe(se.x,se.y,0)}for(let oe=1;oe<=h;oe++)for(let se=0;se<ee;se++){let ne=f?V(M[se],We[se],at):M[se];x?(C.copy(w.normals[oe]).multiplyScalar(ne.x),A.copy(w.binormals[oe]).multiplyScalar(ne.y),N.copy(v[oe]).add(C).add(A),Oe(N.x,N.y,N.z)):Oe(ne.x,ne.y,u/h*oe)}for(let oe=m-1;oe>=0;oe--){let se=oe/m,ne=p*Math.cos(se*Math.PI/2),te=g*Math.sin(se*Math.PI/2)+_;for(let xe=0,ce=H.length;xe<ce;xe++){let ge=V(H[xe],ue[xe],te);Oe(ge.x,ge.y,u+ne)}for(let xe=0,ce=P.length;xe<ce;xe++){let ge=P[xe];Ee=ye[xe];for(let $e=0,Ve=ge.length;$e<Ve;$e++){let R=V(ge[$e],Ee[$e],te);x?Oe(R.x,R.y+v[h-1].y,v[h-1].x+ne):Oe(R.x,R.y,u+ne)}}}Q(),ae();function Q(){let oe=s.length/3;if(f){let se=0,ne=ee*se;for(let te=0;te<nt;te++){let xe=Je[te];Ie(xe[2]+ne,xe[1]+ne,xe[0]+ne)}se=h+m*2,ne=ee*se;for(let te=0;te<nt;te++){let xe=Je[te];Ie(xe[0]+ne,xe[1]+ne,xe[2]+ne)}}else{for(let se=0;se<nt;se++){let ne=Je[se];Ie(ne[2],ne[1],ne[0])}for(let se=0;se<nt;se++){let ne=Je[se];Ie(ne[0]+ee*h,ne[1]+ee*h,ne[2]+ee*h)}}n.addGroup(oe,s.length/3-oe,0)}function ae(){let oe=s.length/3,se=0;we(H,se),se+=H.length;for(let ne=0,te=P.length;ne<te;ne++){let xe=P[ne];we(xe,se),se+=xe.length}n.addGroup(oe,s.length/3-oe,1)}function we(oe,se){let ne=oe.length;for(;--ne>=0;){let te=ne,xe=ne-1;xe<0&&(xe=oe.length-1);for(let ce=0,ge=h+m*2;ce<ge;ce++){let $e=ee*ce,Ve=ee*(ce+1),R=se+te+$e,y=se+xe+$e,O=se+xe+Ve,q=se+te+Ve;Ke(R,y,O,q)}}}function Oe(oe,se,ne){l.push(oe),l.push(se),l.push(ne)}function Ie(oe,se,ne){pt(oe),pt(se),pt(ne);let te=s.length/3,xe=T.generateTopUV(n,s,te-3,te-2,te-1);I(xe[0]),I(xe[1]),I(xe[2])}function Ke(oe,se,ne,te){pt(oe),pt(se),pt(te),pt(se),pt(ne),pt(te);let xe=s.length/3,ce=T.generateSideWallUV(n,s,xe-6,xe-3,xe-2,xe-1);I(ce[0]),I(ce[1]),I(ce[3]),I(ce[1]),I(ce[2]),I(ce[3])}function pt(oe){s.push(l[oe*3+0]),s.push(l[oe*3+1]),s.push(l[oe*3+2])}function I(oe){r.push(oe.x),r.push(oe.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Jm(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new gh[s.type]().fromJSON(s)),new i(n,e.options)}},jm={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new le(r,o),new le(a,l),new le(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],f=e[s*3],p=e[s*3+1],g=e[s*3+2],_=e[r*3],m=e[r*3+1],d=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new le(o,1-l),new le(c,1-u),new le(f,1-g),new le(_,1-d)]:[new le(a,1-l),new le(h,1-u),new le(p,1-g),new le(m,1-d)]}};function Jm(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Eo=class i extends St{constructor(e=[new le(0,-.5),new le(.5,0),new le(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=Qe(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/t,u=new L,f=new le,p=new L,g=new L,_=new L,m=0,d=0;for(let T=0;T<=e.length-1;T++)switch(T){case 0:m=e[T+1].x-e[T].x,d=e[T+1].y-e[T].y,p.x=d*1,p.y=-m,p.z=d*0,_.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:m=e[T+1].x-e[T].x,d=e[T+1].y-e[T].y,p.x=d*1,p.y=-m,p.z=d*0,g.copy(p),p.x+=_.x,p.y+=_.y,p.z+=_.z,p.normalize(),l.push(p.x,p.y,p.z),_.copy(g)}for(let T=0;T<=t;T++){let v=n+T*h*s,x=Math.sin(v),w=Math.cos(v);for(let A=0;A<=e.length-1;A++){u.x=e[A].x*x,u.y=e[A].y,u.z=e[A].x*w,o.push(u.x,u.y,u.z),f.x=T/t,f.y=A/(e.length-1),a.push(f.x,f.y);let C=l[3*A+0]*x,N=l[3*A+1],b=l[3*A+0]*w;c.push(C,N,b)}}for(let T=0;T<t;T++)for(let v=0;v<e.length-1;v++){let x=v+T*e.length,w=x,A=x+e.length,C=x+e.length+1,N=x+1;r.push(w,A,N),r.push(C,N,A)}this.setIndex(r),this.setAttribute("position",new ut(o,3)),this.setAttribute("uv",new ut(a,2)),this.setAttribute("normal",new ut(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}};var ys=class i extends St{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=e/a,f=t/l,p=[],g=[],_=[],m=[];for(let d=0;d<h;d++){let T=d*f-o;for(let v=0;v<c;v++){let x=v*u-r;g.push(x,-T,0),_.push(0,0,1),m.push(v/a),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let T=0;T<a;T++){let v=T+c*d,x=T+c*(d+1),w=T+1+c*(d+1),A=T+1+c*d;p.push(v,x,A),p.push(x,w,A)}this.setIndex(p),this.setAttribute("position",new ut(g,3)),this.setAttribute("normal",new ut(_,3)),this.setAttribute("uv",new ut(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Xi=class i extends St{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new L,f=new L,p=[],g=[],_=[],m=[];for(let d=0;d<=n;d++){let T=[],v=d/n,x=0;d===0&&o===0?x=.5/t:d===n&&l===Math.PI&&(x=-.5/t);for(let w=0;w<=t;w++){let A=w/t;u.x=-e*Math.cos(s+A*r)*Math.sin(o+v*a),u.y=e*Math.cos(o+v*a),u.z=e*Math.sin(s+A*r)*Math.sin(o+v*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),m.push(A+x,1-v),T.push(c++)}h.push(T)}for(let d=0;d<n;d++)for(let T=0;T<t;T++){let v=h[d][T+1],x=h[d][T],w=h[d+1][T],A=h[d+1][T+1];(d!==0||o>0)&&p.push(v,x,A),(d!==n-1||l<Math.PI)&&p.push(x,w,A)}this.setIndex(p),this.setAttribute("position",new ut(g,3)),this.setAttribute("normal",new ut(_,3)),this.setAttribute("uv",new ut(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var _r=class i extends St{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],l=[],c=[],h=new L,u=new L,f=new L;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){let _=g/s*r,m=p/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(_),u.y=(e+t*Math.cos(m))*Math.sin(_),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(g/s),c.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){let _=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,d=(s+1)*(p-1)+g,T=(s+1)*p+g;o.push(_,m,T),o.push(m,d,T)}this.setIndex(o),this.setAttribute("position",new ut(a,3)),this.setAttribute("normal",new ut(l,3)),this.setAttribute("uv",new ut(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Rn=class extends fi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=kh,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Qn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var il=class extends fi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=sf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},sl=class extends fi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};var To=class extends wn{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};function La(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Km(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var vs=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},rl=class extends vs{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:dh,endingEnd:dh}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case fh:r=e,a=2*t-n;break;case ph:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case fh:o=e,l=2*n-t;break;case ph:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,p=this._weightNext,g=(n-t)/(s-t),_=g*g,m=_*g,d=-f*m+2*f*_-f*g,T=(1+f)*m+(-1.5-2*f)*_+(-.5+f)*g+1,v=(-1-p)*m+(1.5+p)*_+.5*g,x=p*m-p*_;for(let w=0;w!==a;++w)r[w]=d*o[h+w]+T*o[c+w]+v*o[l+w]+x*o[u+w];return r}},ol=class extends vs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),u=1-h;for(let f=0;f!==a;++f)r[f]=o[c+f]*u+o[l+f]*h;return r}},al=class extends vs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Cn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=La(t,this.TimeBufferType),this.values=La(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:La(e.times,Array),values:La(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new al(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ol(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new rl(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Qr:t=this.InterpolantFactoryMethodDiscrete;break;case za:t=this.InterpolantFactoryMethodLinear;break;case Ua:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Qr;case this.InterpolantFactoryMethodLinear:return za;case this.InterpolantFactoryMethodSmooth:return Ua}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&Km(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ua,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*n,f=u-n,p=u+n;for(let g=0;g!==n;++g){let _=t[u+g];if(_!==t[f+g]||_!==t[p+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,f=o*n;for(let p=0;p!==n;++p)t[f+p]=t[u+p]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Cn.prototype.ValueTypeName="";Cn.prototype.TimeBufferType=Float32Array;Cn.prototype.ValueBufferType=Float32Array;Cn.prototype.DefaultInterpolation=za;var $i=class extends Cn{constructor(e,t,n){super(e,t,n)}};$i.prototype.ValueTypeName="bool";$i.prototype.ValueBufferType=Array;$i.prototype.DefaultInterpolation=Qr;$i.prototype.InterpolantFactoryMethodLinear=void 0;$i.prototype.InterpolantFactoryMethodSmooth=void 0;var ll=class extends Cn{constructor(e,t,n,s){super(e,t,n,s)}};ll.prototype.ValueTypeName="color";var cl=class extends Cn{constructor(e,t,n,s){super(e,t,n,s)}};cl.prototype.ValueTypeName="number";var hl=class extends vs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)kn.slerpFlat(r,0,o,c-a,o,c,l);return r}},wo=class extends Cn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new hl(this.times,this.values,this.getValueSize(),e)}};wo.prototype.ValueTypeName="quaternion";wo.prototype.InterpolantFactoryMethodSmooth=void 0;var qi=class extends Cn{constructor(e,t,n){super(e,t,n)}};qi.prototype.ValueTypeName="string";qi.prototype.ValueBufferType=Array;qi.prototype.DefaultInterpolation=Qr;qi.prototype.InterpolantFactoryMethodLinear=void 0;qi.prototype.InterpolantFactoryMethodSmooth=void 0;var ul=class extends Cn{constructor(e,t,n,s){super(e,t,n,s)}};ul.prototype.ValueTypeName="vector";var dl=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){let p=c[u],g=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Sf=new dl,fl=class{constructor(e){this.manager=e!==void 0?e:Sf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};fl.DEFAULT_MATERIAL_NAME="__DEFAULT";var Ao=class extends Ht{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ze(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Ro=class extends Ao{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ht.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},hh=new ft,Md=new L,Sd=new L,vh=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new le(512,512),this.mapType=ti,this.map=null,this.mapPass=null,this.matrix=new ft,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new fr,this._frameExtents=new le(1,1),this._viewportCount=1,this._viewports=[new Lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Md.setFromMatrixPosition(e.matrixWorld),t.position.copy(Md),Sd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Sd),t.updateMatrixWorld(),hh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(hh,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(hh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var Co=class extends oo{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},bh=class extends vh{constructor(){super(new Co(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Io=class extends Ao{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ht.DEFAULT_UP),this.updateMatrix(),this.target=new Ht,this.shadow=new bh}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var pl=class extends Yt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var qh="\\[\\]\\.:\\/",Qm=new RegExp("["+qh+"]","g"),Yh="[^"+qh+"]",eg="[^"+qh.replace("\\.","")+"]",tg=/((?:WC+[\/:])*)/.source.replace("WC",Yh),ng=/(WCOD+)?/.source.replace("WCOD",eg),ig=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Yh),sg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Yh),rg=new RegExp("^"+tg+ng+ig+sg+"$"),og=["material","materials","bones","map"],Mh=class{constructor(e,t,n){let s=n||At.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},At=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Qm,"")}static parseTrackName(e){let t=rg.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);og.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};At.Composite=Mh;At.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};At.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};At.prototype.GetterByBindingType=[At.prototype._getValue_direct,At.prototype._getValue_array,At.prototype._getValue_arrayElement,At.prototype._getValue_toArray];At.prototype.SetterByBindingTypeAndVersioning=[[At.prototype._setValue_direct,At.prototype._setValue_direct_setNeedsUpdate,At.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[At.prototype._setValue_array,At.prototype._setValue_array_setNeedsUpdate,At.prototype._setValue_array_setMatrixWorldNeedsUpdate],[At.prototype._setValue_arrayElement,At.prototype._setValue_arrayElement_setNeedsUpdate,At.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[At.prototype._setValue_fromArray,At.prototype._setValue_fromArray_setNeedsUpdate,At.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var jv=new Float32Array(1);var Ed=new ft,Po=class{constructor(e,t,n=0,s=1/0){this.ray=new Vi(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new hr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Ed.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ed),this}intersectObject(e,t=!0,n=[]){return Sh(e,this,n,t),n.sort(Td),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Sh(e[s],this,n,t);return n.sort(Td),n}};function Td(i,e){return i.distance-e.distance}function Sh(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)Sh(r[o],e,t,!0)}}var Yi=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Qe(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Qe(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Do=class extends _s{constructor(e=10,t=10,n=4473924,s=8947848){n=new Ze(n),s=new Ze(s);let r=t/2,o=e/t,a=e/2,l=[],c=[];for(let f=0,p=0,g=-a;f<=t;f++,g+=o){l.push(-a,0,g,a,0,g),l.push(g,0,-a,g,0,a);let _=f===r?n:s;_.toArray(c,p),p+=3,_.toArray(c,p),p+=3,_.toArray(c,p),p+=3,_.toArray(c,p),p+=3}let h=new St;h.setAttribute("position",new ut(l,3)),h.setAttribute("color",new ut(c,3));let u=new wn({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}};var wd=new L,Na,uh,xr=class extends Ht{constructor(e=new L(0,0,1),t=new L(0,0,0),n=1,s=16776960,r=n*.2,o=r*.2){super(),this.type="ArrowHelper",Na===void 0&&(Na=new St,Na.setAttribute("position",new ut([0,0,0,0,1,0],3)),uh=new ja(.5,1,5,1),uh.translate(0,-.5,0)),this.position.copy(t),this.line=new Gi(Na,new wn({color:s,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new _t(uh,new sn({color:s,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(n,r,o)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{wd.set(e.z,0,-e.x).normalize();let t=Math.acos(e.y);this.quaternion.setFromAxisAngle(wd,t)}}setLength(e,t=e*.2,n=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(n,t,n),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}},Lo=class extends _s{constructor(e=1){let t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new St;s.setAttribute("position",new ut(t,3)),s.setAttribute("color",new ut(n,3));let r=new wn({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(e,t,n){let s=new Ze,r=this.geometry.attributes.color.array;return s.set(e),s.toArray(r,0),s.toArray(r,3),s.set(t),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}};var No=class extends hi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function Zh(i,e,t,n){let s=ag(n);switch(t){case Uh:return i*e;case Oh:return i*e/s.components*s.byteLength;case Cl:return i*e/s.components*s.byteLength;case Bh:return i*e*2/s.components*s.byteLength;case Il:return i*e*2/s.components*s.byteLength;case Fh:return i*e*3/s.components*s.byteLength;case zn:return i*e*4/s.components*s.byteLength;case Pl:return i*e*4/s.components*s.byteLength;case Oo:case Bo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ko:case zo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ll:case Ul:return Math.max(i,16)*Math.max(e,8)/4;case Dl:case Nl:return Math.max(i,8)*Math.max(e,8)/2;case Fl:case Ol:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Bl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case kl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case zl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Hl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Vl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Gl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Wl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Xl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case $l:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case ql:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Yl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Zl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case jl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Jl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Kl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Ql:case ec:case tc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case nc:case ic:return Math.ceil(i/4)*Math.ceil(e/4)*8;case sc:case rc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function ag(i){switch(i){case ti:case Ph:return{byteLength:1,components:1};case yr:case Dh:case vr:return{byteLength:2,components:1};case Al:case Rl:return{byteLength:2,components:4};case Ki:case wl:case gi:return{byteLength:4,components:1};case Lh:case Nh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function qf(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function cg(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<u.length;p++){let g=u[f],_=u[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,u[f]=_)}u.length=f+1;for(let p=0,g=u.length;p<g;p++){let _=u[p];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var hg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ug=`#ifdef USE_ALPHAHASH
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
#endif`,dg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,fg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,pg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,mg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gg=`#ifdef USE_AOMAP
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
#endif`,_g=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xg=`#ifdef USE_BATCHING
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
#endif`,yg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,vg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,bg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Mg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Sg=`#ifdef USE_IRIDESCENCE
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
#endif`,Eg=`#ifdef USE_BUMPMAP
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
#endif`,Tg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,wg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ag=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Rg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Cg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ig=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Pg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Dg=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Lg=`#define PI 3.141592653589793
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
} // validated`,Ng=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ug=`vec3 transformedNormal = objectNormal;
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
#endif`,Fg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Og=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Bg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,kg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,zg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Hg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Vg=`#ifdef USE_ENVMAP
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
#endif`,Gg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Wg=`#ifdef USE_ENVMAP
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
#endif`,Xg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$g=`#ifdef USE_ENVMAP
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
#endif`,qg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Yg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Zg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,jg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Jg=`#ifdef USE_GRADIENTMAP
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
}`,Kg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Qg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,e0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,t0=`uniform bool receiveShadow;
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
#endif`,n0=`#ifdef USE_ENVMAP
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
#endif`,i0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,s0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,r0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,o0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,a0=`PhysicalMaterial material;
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
#endif`,l0=`struct PhysicalMaterial {
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
}`,c0=`
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
#endif`,h0=`#if defined( RE_IndirectDiffuse )
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
#endif`,u0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,d0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,f0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,p0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,m0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,g0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,_0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,x0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,y0=`#if defined( USE_POINTS_UV )
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
#endif`,v0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,b0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,M0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,S0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,E0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,T0=`#ifdef USE_MORPHTARGETS
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
#endif`,w0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,A0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,R0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,C0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,I0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,P0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,D0=`#ifdef USE_NORMALMAP
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
#endif`,L0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,N0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,U0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,F0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,O0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,B0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,k0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,z0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,H0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,V0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,G0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,W0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,X0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,q0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Y0=`float getShadowMask() {
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
}`,Z0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,j0=`#ifdef USE_SKINNING
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
#endif`,J0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,K0=`#ifdef USE_SKINNING
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
#endif`,Q0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,e_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,t_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,n_=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,i_=`#ifdef USE_TRANSMISSION
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
#endif`,s_=`#ifdef USE_TRANSMISSION
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
#endif`,r_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,o_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,a_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,l_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,c_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,h_=`uniform sampler2D t2D;
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
}`,u_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,d_=`#ifdef ENVMAP_TYPE_CUBE
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
}`,f_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,p_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,m_=`#include <common>
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
}`,g_=`#if DEPTH_PACKING == 3200
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
}`,__=`#define DISTANCE
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
}`,x_=`#define DISTANCE
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
}`,y_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,v_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,b_=`uniform float scale;
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
}`,M_=`uniform vec3 diffuse;
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
}`,S_=`#include <common>
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
}`,E_=`uniform vec3 diffuse;
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
}`,T_=`#define LAMBERT
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
}`,w_=`#define LAMBERT
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
}`,A_=`#define MATCAP
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
}`,R_=`#define MATCAP
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
}`,C_=`#define NORMAL
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
}`,I_=`#define NORMAL
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
}`,P_=`#define PHONG
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
}`,D_=`#define PHONG
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
}`,L_=`#define STANDARD
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
}`,N_=`#define STANDARD
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
}`,U_=`#define TOON
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
}`,F_=`#define TOON
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
}`,O_=`uniform float size;
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
}`,B_=`uniform vec3 diffuse;
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
}`,k_=`#include <common>
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
}`,z_=`uniform vec3 color;
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
}`,H_=`uniform float rotation;
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
}`,V_=`uniform vec3 diffuse;
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
}`,et={alphahash_fragment:hg,alphahash_pars_fragment:ug,alphamap_fragment:dg,alphamap_pars_fragment:fg,alphatest_fragment:pg,alphatest_pars_fragment:mg,aomap_fragment:gg,aomap_pars_fragment:_g,batching_pars_vertex:xg,batching_vertex:yg,begin_vertex:vg,beginnormal_vertex:bg,bsdfs:Mg,iridescence_fragment:Sg,bumpmap_pars_fragment:Eg,clipping_planes_fragment:Tg,clipping_planes_pars_fragment:wg,clipping_planes_pars_vertex:Ag,clipping_planes_vertex:Rg,color_fragment:Cg,color_pars_fragment:Ig,color_pars_vertex:Pg,color_vertex:Dg,common:Lg,cube_uv_reflection_fragment:Ng,defaultnormal_vertex:Ug,displacementmap_pars_vertex:Fg,displacementmap_vertex:Og,emissivemap_fragment:Bg,emissivemap_pars_fragment:kg,colorspace_fragment:zg,colorspace_pars_fragment:Hg,envmap_fragment:Vg,envmap_common_pars_fragment:Gg,envmap_pars_fragment:Wg,envmap_pars_vertex:Xg,envmap_physical_pars_fragment:n0,envmap_vertex:$g,fog_vertex:qg,fog_pars_vertex:Yg,fog_fragment:Zg,fog_pars_fragment:jg,gradientmap_pars_fragment:Jg,lightmap_pars_fragment:Kg,lights_lambert_fragment:Qg,lights_lambert_pars_fragment:e0,lights_pars_begin:t0,lights_toon_fragment:i0,lights_toon_pars_fragment:s0,lights_phong_fragment:r0,lights_phong_pars_fragment:o0,lights_physical_fragment:a0,lights_physical_pars_fragment:l0,lights_fragment_begin:c0,lights_fragment_maps:h0,lights_fragment_end:u0,logdepthbuf_fragment:d0,logdepthbuf_pars_fragment:f0,logdepthbuf_pars_vertex:p0,logdepthbuf_vertex:m0,map_fragment:g0,map_pars_fragment:_0,map_particle_fragment:x0,map_particle_pars_fragment:y0,metalnessmap_fragment:v0,metalnessmap_pars_fragment:b0,morphinstance_vertex:M0,morphcolor_vertex:S0,morphnormal_vertex:E0,morphtarget_pars_vertex:T0,morphtarget_vertex:w0,normal_fragment_begin:A0,normal_fragment_maps:R0,normal_pars_fragment:C0,normal_pars_vertex:I0,normal_vertex:P0,normalmap_pars_fragment:D0,clearcoat_normal_fragment_begin:L0,clearcoat_normal_fragment_maps:N0,clearcoat_pars_fragment:U0,iridescence_pars_fragment:F0,opaque_fragment:O0,packing:B0,premultiplied_alpha_fragment:k0,project_vertex:z0,dithering_fragment:H0,dithering_pars_fragment:V0,roughnessmap_fragment:G0,roughnessmap_pars_fragment:W0,shadowmap_pars_fragment:X0,shadowmap_pars_vertex:$0,shadowmap_vertex:q0,shadowmask_pars_fragment:Y0,skinbase_vertex:Z0,skinning_pars_vertex:j0,skinning_vertex:J0,skinnormal_vertex:K0,specularmap_fragment:Q0,specularmap_pars_fragment:e_,tonemapping_fragment:t_,tonemapping_pars_fragment:n_,transmission_fragment:i_,transmission_pars_fragment:s_,uv_pars_fragment:r_,uv_pars_vertex:o_,uv_vertex:a_,worldpos_vertex:l_,background_vert:c_,background_frag:h_,backgroundCube_vert:u_,backgroundCube_frag:d_,cube_vert:f_,cube_frag:p_,depth_vert:m_,depth_frag:g_,distanceRGBA_vert:__,distanceRGBA_frag:x_,equirect_vert:y_,equirect_frag:v_,linedashed_vert:b_,linedashed_frag:M_,meshbasic_vert:S_,meshbasic_frag:E_,meshlambert_vert:T_,meshlambert_frag:w_,meshmatcap_vert:A_,meshmatcap_frag:R_,meshnormal_vert:C_,meshnormal_frag:I_,meshphong_vert:P_,meshphong_frag:D_,meshphysical_vert:L_,meshphysical_frag:N_,meshtoon_vert:U_,meshtoon_frag:F_,points_vert:O_,points_frag:B_,shadow_vert:k_,shadow_frag:z_,sprite_vert:H_,sprite_frag:V_},ve={common:{diffuse:{value:new Ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new je}},envmap:{envMap:{value:null},envMapRotation:{value:new je},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new je},normalScale:{value:new le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0},uvTransform:{value:new je}},sprite:{diffuse:{value:new Ze(16777215)},opacity:{value:1},center:{value:new le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}}},_i={basic:{uniforms:rn([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:et.meshbasic_vert,fragmentShader:et.meshbasic_frag},lambert:{uniforms:rn([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ze(0)}}]),vertexShader:et.meshlambert_vert,fragmentShader:et.meshlambert_frag},phong:{uniforms:rn([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ze(0)},specular:{value:new Ze(1118481)},shininess:{value:30}}]),vertexShader:et.meshphong_vert,fragmentShader:et.meshphong_frag},standard:{uniforms:rn([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new Ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:et.meshphysical_vert,fragmentShader:et.meshphysical_frag},toon:{uniforms:rn([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new Ze(0)}}]),vertexShader:et.meshtoon_vert,fragmentShader:et.meshtoon_frag},matcap:{uniforms:rn([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:et.meshmatcap_vert,fragmentShader:et.meshmatcap_frag},points:{uniforms:rn([ve.points,ve.fog]),vertexShader:et.points_vert,fragmentShader:et.points_frag},dashed:{uniforms:rn([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:et.linedashed_vert,fragmentShader:et.linedashed_frag},depth:{uniforms:rn([ve.common,ve.displacementmap]),vertexShader:et.depth_vert,fragmentShader:et.depth_frag},normal:{uniforms:rn([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:et.meshnormal_vert,fragmentShader:et.meshnormal_frag},sprite:{uniforms:rn([ve.sprite,ve.fog]),vertexShader:et.sprite_vert,fragmentShader:et.sprite_frag},background:{uniforms:{uvTransform:{value:new je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:et.background_vert,fragmentShader:et.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new je}},vertexShader:et.backgroundCube_vert,fragmentShader:et.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:et.cube_vert,fragmentShader:et.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:et.equirect_vert,fragmentShader:et.equirect_frag},distanceRGBA:{uniforms:rn([ve.common,ve.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:et.distanceRGBA_vert,fragmentShader:et.distanceRGBA_frag},shadow:{uniforms:rn([ve.lights,ve.fog,{color:{value:new Ze(0)},opacity:{value:1}}]),vertexShader:et.shadow_vert,fragmentShader:et.shadow_frag}};_i.physical={uniforms:rn([_i.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new je},clearcoatNormalScale:{value:new le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new je},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new je},sheen:{value:0},sheenColor:{value:new Ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new je},transmissionSamplerSize:{value:new le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new je},attenuationDistance:{value:0},attenuationColor:{value:new Ze(0)},specularColor:{value:new Ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new je},anisotropyVector:{value:new le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new je}}]),vertexShader:et.meshphysical_vert,fragmentShader:et.meshphysical_frag};var oc={r:0,b:0,g:0},Es=new Qn,G_=new ft;function W_(i,e,t,n,s,r,o){let a=new Ze(0),l=r===!0?0:1,c,h,u=null,f=0,p=null;function g(v){let x=v.isScene===!0?v.background:null;return x&&x.isTexture&&(x=(v.backgroundBlurriness>0?t:e).get(x)),x}function _(v){let x=!1,w=g(v);w===null?d(a,l):w&&w.isColor&&(d(w,1),x=!0);let A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(v,x){let w=g(x);w&&(w.isCubeTexture||w.mapping===Uo)?(h===void 0&&(h=new _t(new jt(1,1,1),new ei({name:"BackgroundCubeMaterial",uniforms:Ss(_i.backgroundCube.uniforms),vertexShader:_i.backgroundCube.vertexShader,fragmentShader:_i.backgroundCube.fragmentShader,side:cn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,C,N){this.matrixWorld.copyPosition(N.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Es.copy(x.backgroundRotation),Es.x*=-1,Es.y*=-1,Es.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Es.y*=-1,Es.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(G_.makeRotationFromEuler(Es)),h.material.toneMapped=lt.getTransfer(w.colorSpace)!==gt,(u!==w||f!==w.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=w,f=w.version,p=i.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(c===void 0&&(c=new _t(new ys(2,2),new ei({name:"BackgroundMaterial",uniforms:Ss(_i.background.uniforms),vertexShader:_i.background.vertexShader,fragmentShader:_i.background.fragmentShader,side:Ai,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=w,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=lt.getTransfer(w.colorSpace)!==gt,w.matrixAutoUpdate===!0&&w.updateMatrix(),c.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||f!==w.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,u=w,f=w.version,p=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function d(v,x){v.getRGB(oc,Xh(i)),n.buffers.color.setClear(oc.r,oc.g,oc.b,x,o)}function T(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,x=1){a.set(v),l=x,d(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,d(a,l)},render:_,addToRenderList:m,dispose:T}}function X_(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,o=!1;function a(M,P,G,X,j){let H=!1,V=u(X,G,P);r!==V&&(r=V,c(r.object)),H=p(M,X,G,j),H&&g(M,X,G,j),j!==null&&e.update(j,i.ELEMENT_ARRAY_BUFFER),(H||o)&&(o=!1,x(M,P,G,X),j!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(j).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function u(M,P,G){let X=G.wireframe===!0,j=n[M.id];j===void 0&&(j={},n[M.id]=j);let H=j[P.id];H===void 0&&(H={},j[P.id]=H);let V=H[X];return V===void 0&&(V=f(l()),H[X]=V),V}function f(M){let P=[],G=[],X=[];for(let j=0;j<t;j++)P[j]=0,G[j]=0,X[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:G,attributeDivisors:X,object:M,attributes:{},index:null}}function p(M,P,G,X){let j=r.attributes,H=P.attributes,V=0,ee=G.getAttributes();for(let $ in ee)if(ee[$].location>=0){let ye=j[$],Ee=H[$];if(Ee===void 0&&($==="instanceMatrix"&&M.instanceMatrix&&(Ee=M.instanceMatrix),$==="instanceColor"&&M.instanceColor&&(Ee=M.instanceColor)),ye===void 0||ye.attribute!==Ee||Ee&&ye.data!==Ee.data)return!0;V++}return r.attributesNum!==V||r.index!==X}function g(M,P,G,X){let j={},H=P.attributes,V=0,ee=G.getAttributes();for(let $ in ee)if(ee[$].location>=0){let ye=H[$];ye===void 0&&($==="instanceMatrix"&&M.instanceMatrix&&(ye=M.instanceMatrix),$==="instanceColor"&&M.instanceColor&&(ye=M.instanceColor));let Ee={};Ee.attribute=ye,ye&&ye.data&&(Ee.data=ye.data),j[$]=Ee,V++}r.attributes=j,r.attributesNum=V,r.index=X}function _(){let M=r.newAttributes;for(let P=0,G=M.length;P<G;P++)M[P]=0}function m(M){d(M,0)}function d(M,P){let G=r.newAttributes,X=r.enabledAttributes,j=r.attributeDivisors;G[M]=1,X[M]===0&&(i.enableVertexAttribArray(M),X[M]=1),j[M]!==P&&(i.vertexAttribDivisor(M,P),j[M]=P)}function T(){let M=r.newAttributes,P=r.enabledAttributes;for(let G=0,X=P.length;G<X;G++)P[G]!==M[G]&&(i.disableVertexAttribArray(G),P[G]=0)}function v(M,P,G,X,j,H,V){V===!0?i.vertexAttribIPointer(M,P,G,j,H):i.vertexAttribPointer(M,P,G,X,j,H)}function x(M,P,G,X){_();let j=X.attributes,H=G.getAttributes(),V=P.defaultAttributeValues;for(let ee in H){let $=H[ee];if($.location>=0){let ue=j[ee];if(ue===void 0&&(ee==="instanceMatrix"&&M.instanceMatrix&&(ue=M.instanceMatrix),ee==="instanceColor"&&M.instanceColor&&(ue=M.instanceColor)),ue!==void 0){let ye=ue.normalized,Ee=ue.itemSize,We=e.get(ue);if(We===void 0)continue;let Je=We.buffer,nt=We.type,at=We.bytesPerElement,Q=nt===i.INT||nt===i.UNSIGNED_INT||ue.gpuType===wl;if(ue.isInterleavedBufferAttribute){let ae=ue.data,we=ae.stride,Oe=ue.offset;if(ae.isInstancedInterleavedBuffer){for(let Ie=0;Ie<$.locationSize;Ie++)d($.location+Ie,ae.meshPerAttribute);M.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let Ie=0;Ie<$.locationSize;Ie++)m($.location+Ie);i.bindBuffer(i.ARRAY_BUFFER,Je);for(let Ie=0;Ie<$.locationSize;Ie++)v($.location+Ie,Ee/$.locationSize,nt,ye,we*at,(Oe+Ee/$.locationSize*Ie)*at,Q)}else{if(ue.isInstancedBufferAttribute){for(let ae=0;ae<$.locationSize;ae++)d($.location+ae,ue.meshPerAttribute);M.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let ae=0;ae<$.locationSize;ae++)m($.location+ae);i.bindBuffer(i.ARRAY_BUFFER,Je);for(let ae=0;ae<$.locationSize;ae++)v($.location+ae,Ee/$.locationSize,nt,ye,Ee*at,Ee/$.locationSize*ae*at,Q)}}else if(V!==void 0){let ye=V[ee];if(ye!==void 0)switch(ye.length){case 2:i.vertexAttrib2fv($.location,ye);break;case 3:i.vertexAttrib3fv($.location,ye);break;case 4:i.vertexAttrib4fv($.location,ye);break;default:i.vertexAttrib1fv($.location,ye)}}}}T()}function w(){N();for(let M in n){let P=n[M];for(let G in P){let X=P[G];for(let j in X)h(X[j].object),delete X[j];delete P[G]}delete n[M]}}function A(M){if(n[M.id]===void 0)return;let P=n[M.id];for(let G in P){let X=P[G];for(let j in X)h(X[j].object),delete X[j];delete P[G]}delete n[M.id]}function C(M){for(let P in n){let G=n[P];if(G[M.id]===void 0)continue;let X=G[M.id];for(let j in X)h(X[j].object),delete X[j];delete G[M.id]}}function N(){b(),o=!0,r!==s&&(r=s,c(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:N,resetDefaultState:b,dispose:w,releaseStatesOfGeometry:A,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:T}}function $_(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];t.update(p,n,1)}function l(c,h,u,f){if(u===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],h[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*f[_];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function q_(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==zn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let N=C===vr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==ti&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==gi&&!N)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:T,maxVaryings:v,maxFragmentUniforms:x,vertexTextures:w,maxSamples:A}}function Y_(i){let e=this,t=null,n=0,s=!1,r=!1,o=new On,a=new je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let p=u.length!==0||f||n!==0||s;return s=f,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,p){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,d=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let T=r?0:n,v=T*4,x=d.clippingState||null;l.value=x,x=h(g,f,v,p);for(let w=0;w!==v;++w)x[w]=t[w];d.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,p,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=l.value,g!==!0||m===null){let d=p+_*4,T=f.matrixWorldInverse;a.getNormalMatrix(T),(m===null||m.length<d)&&(m=new Float32Array(d));for(let v=0,x=p;v!==_;++v,x+=4)o.copy(u[v]).applyMatrix4(T,a),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function Z_(i){let e=new WeakMap;function t(o,a){return a===Sl?o.mapping=bs:a===El&&(o.mapping=Ms),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Sl||a===El)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new $a(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Er=4,Ef=[.125,.215,.35,.446,.526,.582],As=20,jh=new Co,Tf=new Ze,Jh=null,Kh=0,Qh=0,eu=!1,ws=(1+Math.sqrt(5))/2,Sr=1/ws,wf=[new L(-ws,Sr,0),new L(ws,Sr,0),new L(-Sr,0,ws),new L(Sr,0,ws),new L(0,ws,-Sr),new L(0,ws,Sr),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],j_=new L,cc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=j_}=r;Jh=this._renderer.getRenderTarget(),Kh=this._renderer.getActiveCubeFace(),Qh=this._renderer.getActiveMipmapLevel(),eu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Cf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Rf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Jh,Kh,Qh),this._renderer.xr.enabled=eu,e.scissorTest=!1,ac(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===bs||e.mapping===Ms?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Jh=this._renderer.getRenderTarget(),Kh=this._renderer.getActiveCubeFace(),Qh=this._renderer.getActiveMipmapLevel(),eu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Kn,minFilter:Kn,generateMipmaps:!1,type:vr,format:zn,colorSpace:ps,depthBuffer:!1},s=Af(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Af(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=J_(r)),this._blurMaterial=K_(r,e,t)}return s}_compileMaterial(e){let t=new _t(this._lodPlanes[0],e);this._renderer.compile(t,jh)}_sceneToCubeUV(e,t,n,s,r){let l=new Yt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor(Tf),u.toneMapping=Ci,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let _=new sn({name:"PMREM.Background",side:cn,depthWrite:!1,depthTest:!1}),m=new _t(new jt,_),d=!1,T=e.background;T?T.isColor&&(_.color.copy(T),e.background=null,d=!0):(_.color.copy(Tf),d=!0);for(let v=0;v<6;v++){let x=v%3;x===0?(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[v],r.y,r.z)):x===1?(l.up.set(0,0,c[v]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[v],r.z)):(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[v]));let w=this._cubeSize;ac(s,x*w,v>2?w:0,w,w),u.setRenderTarget(s),d&&u.render(m,l),u.render(e,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=p,u.autoClear=f,e.background=T}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===bs||e.mapping===Ms;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Cf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Rf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new _t(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;ac(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,jh)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=wf[(s-r-1)%wf.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new _t(this._lodPlanes[s],c),f=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*As-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):As;m>As&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${As}`);let d=[],T=0;for(let C=0;C<As;++C){let N=C/_,b=Math.exp(-N*N/2);d.push(b),C===0?T+=b:C<m&&(T+=2*b)}for(let C=0;C<d.length;C++)d[C]=d[C]/T;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:v}=this;f.dTheta.value=g,f.mipInt.value=v-n;let x=this._sizeLods[s],w=3*x*(s>v-Er?s-v+Er:0),A=4*(this._cubeSize-x);ac(t,w,A,3*x,2*x),l.setRenderTarget(t),l.render(u,jh)}};function J_(i){let e=[],t=[],n=[],s=i,r=i-Er+1+Ef.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-Er?l=Ef[o-i+Er-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,_=3,m=2,d=1,T=new Float32Array(_*g*p),v=new Float32Array(m*g*p),x=new Float32Array(d*g*p);for(let A=0;A<p;A++){let C=A%3*2/3-1,N=A>2?0:-1,b=[C,N,0,C+2/3,N,0,C+2/3,N+1,0,C,N,0,C+2/3,N+1,0,C,N+1,0];T.set(b,_*g*A),v.set(f,m*g*A);let M=[A,A,A,A,A,A];x.set(M,d*g*A)}let w=new St;w.setAttribute("position",new _n(T,_)),w.setAttribute("uv",new _n(v,m)),w.setAttribute("faceIndex",new _n(x,d)),e.push(w),s>Er&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Af(i,e,t){let n=new ui(i,e,t);return n.texture.mapping=Uo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ac(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function K_(i,e,t){let n=new Float32Array(As),s=new L(0,1,0);return new ei({name:"SphericalGaussianBlur",defines:{n:As,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:hu(),fragmentShader:`

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
		`,blending:Ri,depthTest:!1,depthWrite:!1})}function Rf(){return new ei({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:hu(),fragmentShader:`

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
		`,blending:Ri,depthTest:!1,depthWrite:!1})}function Cf(){return new ei({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:hu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ri,depthTest:!1,depthWrite:!1})}function hu(){return`

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
	`}function Q_(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Sl||l===El,h=l===bs||l===Ms;if(c||h){let u=e.get(a),f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new cc(i)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let p=a.image;return c&&p&&p.height>0||h&&p&&s(p)?(t===null&&(t=new cc(i)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function ex(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&lr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function tx(i,e,t,n){let s={},r=new WeakMap;function o(u){let f=u.target;f.index!==null&&e.remove(f.index);for(let g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete s[f.id];let p=r.get(f);p&&(e.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,t.memory.geometries++),f}function l(u){let f=u.attributes;for(let p in f)e.update(f[p],i.ARRAY_BUFFER)}function c(u){let f=[],p=u.index,g=u.attributes.position,_=0;if(p!==null){let T=p.array;_=p.version;for(let v=0,x=T.length;v<x;v+=3){let w=T[v+0],A=T[v+1],C=T[v+2];f.push(w,A,A,C,C,w)}}else if(g!==void 0){let T=g.array;_=g.version;for(let v=0,x=T.length/3-1;v<x;v+=3){let w=v+0,A=v+1,C=v+2;f.push(w,A,A,C,C,w)}}else return;let m=new(Wh(f)?ro:so)(f,1);m.version=_;let d=r.get(u);d&&e.remove(d),r.set(u,m)}function h(u){let f=r.get(u);if(f){let p=u.index;p!==null&&f.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function nx(i,e,t){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,p){i.drawElements(n,p,r,f*o),t.update(p,n,1)}function c(f,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,f*o,g),t.update(p,n,g))}function h(f,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,g);let m=0;for(let d=0;d<g;d++)m+=p[d];t.update(m,n,1)}function u(f,p,g,_){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)c(f[d]/o,p[d],_[d]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,_,0,g);let d=0;for(let T=0;T<g;T++)d+=p[T]*_[T];t.update(d,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function ix(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function sx(i,e,t){let n=new WeakMap,s=new Lt;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,f=n.get(a);if(f===void 0||f.count!==u){let b=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",b)};f!==void 0&&f.texture.dispose();let p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],d=a.morphAttributes.normal||[],T=a.morphAttributes.color||[],v=0;p===!0&&(v=1),g===!0&&(v=2),_===!0&&(v=3);let x=a.attributes.position.count*v,w=1;x>e.maxTextureSize&&(w=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let A=new Float32Array(x*w*4*u),C=new io(A,x,w,u);C.type=gi,C.needsUpdate=!0;let N=v*4;for(let M=0;M<u;M++){let P=m[M],G=d[M],X=T[M],j=x*w*4*M;for(let H=0;H<P.count;H++){let V=H*N;p===!0&&(s.fromBufferAttribute(P,H),A[j+V+0]=s.x,A[j+V+1]=s.y,A[j+V+2]=s.z,A[j+V+3]=0),g===!0&&(s.fromBufferAttribute(G,H),A[j+V+4]=s.x,A[j+V+5]=s.y,A[j+V+6]=s.z,A[j+V+7]=0),_===!0&&(s.fromBufferAttribute(X,H),A[j+V+8]=s.x,A[j+V+9]=s.y,A[j+V+10]=s.z,A[j+V+11]=X.itemSize===4?s.w:1)}}f={count:u,texture:C,size:new le(x,w)},n.set(a,f),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let p=0;for(let _=0;_<c.length;_++)p+=c[_];let g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function rx(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var Yf=new xn,If=new uo(1,1),Zf=new io,jf=new Wa,Jf=new ao,Pf=[],Df=[],Lf=new Float32Array(16),Nf=new Float32Array(9),Uf=new Float32Array(4);function Ar(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Pf[s];if(r===void 0&&(r=new Float32Array(s),Pf[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Vt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Gt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function hc(i,e){let t=Df[e];t===void 0&&(t=new Int32Array(e),Df[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function ox(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function ax(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;i.uniform2fv(this.addr,e),Gt(t,e)}}function lx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Vt(t,e))return;i.uniform3fv(this.addr,e),Gt(t,e)}}function cx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;i.uniform4fv(this.addr,e),Gt(t,e)}}function hx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Gt(t,e)}else{if(Vt(t,n))return;Uf.set(n),i.uniformMatrix2fv(this.addr,!1,Uf),Gt(t,n)}}function ux(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Gt(t,e)}else{if(Vt(t,n))return;Nf.set(n),i.uniformMatrix3fv(this.addr,!1,Nf),Gt(t,n)}}function dx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Gt(t,e)}else{if(Vt(t,n))return;Lf.set(n),i.uniformMatrix4fv(this.addr,!1,Lf),Gt(t,n)}}function fx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function px(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;i.uniform2iv(this.addr,e),Gt(t,e)}}function mx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Vt(t,e))return;i.uniform3iv(this.addr,e),Gt(t,e)}}function gx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;i.uniform4iv(this.addr,e),Gt(t,e)}}function _x(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function xx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;i.uniform2uiv(this.addr,e),Gt(t,e)}}function yx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Vt(t,e))return;i.uniform3uiv(this.addr,e),Gt(t,e)}}function vx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;i.uniform4uiv(this.addr,e),Gt(t,e)}}function bx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(If.compareFunction=zh,r=If):r=Yf,t.setTexture2D(e||r,s)}function Mx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||jf,s)}function Sx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Jf,s)}function Ex(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Zf,s)}function Tx(i){switch(i){case 5126:return ox;case 35664:return ax;case 35665:return lx;case 35666:return cx;case 35674:return hx;case 35675:return ux;case 35676:return dx;case 5124:case 35670:return fx;case 35667:case 35671:return px;case 35668:case 35672:return mx;case 35669:case 35673:return gx;case 5125:return _x;case 36294:return xx;case 36295:return yx;case 36296:return vx;case 35678:case 36198:case 36298:case 36306:case 35682:return bx;case 35679:case 36299:case 36307:return Mx;case 35680:case 36300:case 36308:case 36293:return Sx;case 36289:case 36303:case 36311:case 36292:return Ex}}function wx(i,e){i.uniform1fv(this.addr,e)}function Ax(i,e){let t=Ar(e,this.size,2);i.uniform2fv(this.addr,t)}function Rx(i,e){let t=Ar(e,this.size,3);i.uniform3fv(this.addr,t)}function Cx(i,e){let t=Ar(e,this.size,4);i.uniform4fv(this.addr,t)}function Ix(i,e){let t=Ar(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Px(i,e){let t=Ar(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Dx(i,e){let t=Ar(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Lx(i,e){i.uniform1iv(this.addr,e)}function Nx(i,e){i.uniform2iv(this.addr,e)}function Ux(i,e){i.uniform3iv(this.addr,e)}function Fx(i,e){i.uniform4iv(this.addr,e)}function Ox(i,e){i.uniform1uiv(this.addr,e)}function Bx(i,e){i.uniform2uiv(this.addr,e)}function kx(i,e){i.uniform3uiv(this.addr,e)}function zx(i,e){i.uniform4uiv(this.addr,e)}function Hx(i,e,t){let n=this.cache,s=e.length,r=hc(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Gt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Yf,r[o])}function Vx(i,e,t){let n=this.cache,s=e.length,r=hc(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Gt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||jf,r[o])}function Gx(i,e,t){let n=this.cache,s=e.length,r=hc(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Gt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Jf,r[o])}function Wx(i,e,t){let n=this.cache,s=e.length,r=hc(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Gt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Zf,r[o])}function Xx(i){switch(i){case 5126:return wx;case 35664:return Ax;case 35665:return Rx;case 35666:return Cx;case 35674:return Ix;case 35675:return Px;case 35676:return Dx;case 5124:case 35670:return Lx;case 35667:case 35671:return Nx;case 35668:case 35672:return Ux;case 35669:case 35673:return Fx;case 5125:return Ox;case 36294:return Bx;case 36295:return kx;case 36296:return zx;case 35678:case 36198:case 36298:case 36306:case 35682:return Hx;case 35679:case 36299:case 36307:return Vx;case 35680:case 36300:case 36308:case 36293:return Gx;case 36289:case 36303:case 36311:case 36292:return Wx}}var nu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Tx(t.type)}},iu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Xx(t.type)}},su=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},tu=/(\w+)(\])?(\[|\.)?/g;function Ff(i,e){i.seq.push(e),i.map[e.id]=e}function $x(i,e,t){let n=i.name,s=n.length;for(tu.lastIndex=0;;){let r=tu.exec(n),o=tu.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Ff(t,c===void 0?new nu(a,i,e):new iu(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new su(a),Ff(t,u)),t=u}}}var Tr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);$x(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function Of(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var qx=37297,Yx=0;function Zx(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var Bf=new je;function jx(i){lt._getMatrix(Bf,lt.workingColorSpace,i);let e=`mat3( ${Bf.elements.map(t=>t.toFixed(4))} )`;switch(lt.getTransfer(i)){case eo:return[e,"LinearTransferOETF"];case gt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function kf(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Zx(i.getShaderSource(e),a)}else return r}function Jx(i,e){let t=jx(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Kx(i,e){let t;switch(e){case Zd:t="Linear";break;case jd:t="Reinhard";break;case Jd:t="Cineon";break;case Kd:t="ACESFilmic";break;case ef:t="AgX";break;case tf:t="Neutral";break;case Qd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var lc=new L;function Qx(){lt.getLuminanceCoefficients(lc);let i=lc.x.toFixed(4),e=lc.y.toFixed(4),t=lc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ey(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ho).join(`
`)}function ty(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function ny(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Ho(i){return i!==""}function zf(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Hf(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var iy=/^[ \t]*#include +<([\w\d./]+)>/gm;function ru(i){return i.replace(iy,ry)}var sy=new Map;function ry(i,e){let t=et[e];if(t===void 0){let n=sy.get(e);if(n!==void 0)t=et[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ru(t)}var oy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vf(i){return i.replace(oy,ay)}function ay(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Gf(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function ly(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Th?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===ml?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===pi&&(e="SHADOWMAP_TYPE_VSM"),e}function cy(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case bs:case Ms:e="ENVMAP_TYPE_CUBE";break;case Uo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function hy(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Ms&&(e="ENVMAP_MODE_REFRACTION"),e}function uy(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ch:e="ENVMAP_BLENDING_MULTIPLY";break;case qd:e="ENVMAP_BLENDING_MIX";break;case Yd:e="ENVMAP_BLENDING_ADD";break}return e}function dy(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function fy(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=ly(t),c=cy(t),h=hy(t),u=uy(t),f=dy(t),p=ey(t),g=ty(r),_=s.createProgram(),m,d,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ho).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ho).join(`
`),d.length>0&&(d+=`
`)):(m=[Gf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ho).join(`
`),d=[Gf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ci?"#define TONE_MAPPING":"",t.toneMapping!==Ci?et.tonemapping_pars_fragment:"",t.toneMapping!==Ci?Kx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",et.colorspace_pars_fragment,Jx("linearToOutputTexel",t.outputColorSpace),Qx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ho).join(`
`)),o=ru(o),o=zf(o,t),o=Hf(o,t),a=ru(a),a=zf(a,t),a=Hf(a,t),o=Vf(o),a=Vf(a),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",t.glslVersion===Hh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Hh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let v=T+m+o,x=T+d+a,w=Of(s,s.VERTEX_SHADER,v),A=Of(s,s.FRAGMENT_SHADER,x);s.attachShader(_,w),s.attachShader(_,A),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(P){if(i.debug.checkShaderErrors){let G=s.getProgramInfoLog(_)||"",X=s.getShaderInfoLog(w)||"",j=s.getShaderInfoLog(A)||"",H=G.trim(),V=X.trim(),ee=j.trim(),$=!0,ue=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if($=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,w,A);else{let ye=kf(s,w,"vertex"),Ee=kf(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+H+`
`+ye+`
`+Ee)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(V===""||ee==="")&&(ue=!1);ue&&(P.diagnostics={runnable:$,programLog:H,vertexShader:{log:V,prefix:m},fragmentShader:{log:ee,prefix:d}})}s.deleteShader(w),s.deleteShader(A),N=new Tr(s,_),b=ny(s,_)}let N;this.getUniforms=function(){return N===void 0&&C(this),N};let b;this.getAttributes=function(){return b===void 0&&C(this),b};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(_,qx)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Yx++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=A,this}var py=0,ou=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new au(e),t.set(e,n)),n}},au=class{constructor(e){this.id=py++,this.code=e,this.usedTimes=0}};function my(i,e,t,n,s,r,o){let a=new hr,l=new ou,c=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,M,P,G,X){let j=G.fog,H=X.geometry,V=b.isMeshStandardMaterial?G.environment:null,ee=(b.isMeshStandardMaterial?t:e).get(b.envMap||V),$=ee&&ee.mapping===Uo?ee.image.height:null,ue=g[b.type];b.precision!==null&&(p=s.getMaxPrecision(b.precision),p!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",p,"instead."));let ye=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Ee=ye!==void 0?ye.length:0,We=0;H.morphAttributes.position!==void 0&&(We=1),H.morphAttributes.normal!==void 0&&(We=2),H.morphAttributes.color!==void 0&&(We=3);let Je,nt,at,Q;if(ue){let Ue=_i[ue];Je=Ue.vertexShader,nt=Ue.fragmentShader}else Je=b.vertexShader,nt=b.fragmentShader,l.update(b),at=l.getVertexShaderID(b),Q=l.getFragmentShaderID(b);let ae=i.getRenderTarget(),we=i.state.buffers.depth.getReversed(),Oe=X.isInstancedMesh===!0,Ie=X.isBatchedMesh===!0,Ke=!!b.map,pt=!!b.matcap,I=!!ee,oe=!!b.aoMap,se=!!b.lightMap,ne=!!b.bumpMap,te=!!b.normalMap,xe=!!b.displacementMap,ce=!!b.emissiveMap,ge=!!b.metalnessMap,$e=!!b.roughnessMap,Ve=b.anisotropy>0,R=b.clearcoat>0,y=b.dispersion>0,O=b.iridescence>0,q=b.sheen>0,re=b.transmission>0,K=Ve&&!!b.anisotropyMap,De=R&&!!b.clearcoatMap,pe=R&&!!b.clearcoatNormalMap,Pe=R&&!!b.clearcoatRoughnessMap,Ae=O&&!!b.iridescenceMap,de=O&&!!b.iridescenceThicknessMap,be=q&&!!b.sheenColorMap,ze=q&&!!b.sheenRoughnessMap,Fe=!!b.specularMap,Me=!!b.specularColorMap,qe=!!b.specularIntensityMap,E=re&&!!b.transmissionMap,U=re&&!!b.thicknessMap,W=!!b.gradientMap,ie=!!b.alphaMap,Y=b.alphaTest>0,z=!!b.alphaHash,fe=!!b.extensions,he=Ci;b.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(he=i.toneMapping);let Re={shaderID:ue,shaderType:b.type,shaderName:b.name,vertexShader:Je,fragmentShader:nt,defines:b.defines,customVertexShaderID:at,customFragmentShaderID:Q,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:p,batching:Ie,batchingColor:Ie&&X._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&X.instanceColor!==null,instancingMorph:Oe&&X.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ae===null?i.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:ps,alphaToCoverage:!!b.alphaToCoverage,map:Ke,matcap:pt,envMap:I,envMapMode:I&&ee.mapping,envMapCubeUVHeight:$,aoMap:oe,lightMap:se,bumpMap:ne,normalMap:te,displacementMap:f&&xe,emissiveMap:ce,normalMapObjectSpace:te&&b.normalMapType===of,normalMapTangentSpace:te&&b.normalMapType===kh,metalnessMap:ge,roughnessMap:$e,anisotropy:Ve,anisotropyMap:K,clearcoat:R,clearcoatMap:De,clearcoatNormalMap:pe,clearcoatRoughnessMap:Pe,dispersion:y,iridescence:O,iridescenceMap:Ae,iridescenceThicknessMap:de,sheen:q,sheenColorMap:be,sheenRoughnessMap:ze,specularMap:Fe,specularColorMap:Me,specularIntensityMap:qe,transmission:re,transmissionMap:E,thicknessMap:U,gradientMap:W,opaque:b.transparent===!1&&b.blending===ds&&b.alphaToCoverage===!1,alphaMap:ie,alphaTest:Y,alphaHash:z,combine:b.combine,mapUv:Ke&&_(b.map.channel),aoMapUv:oe&&_(b.aoMap.channel),lightMapUv:se&&_(b.lightMap.channel),bumpMapUv:ne&&_(b.bumpMap.channel),normalMapUv:te&&_(b.normalMap.channel),displacementMapUv:xe&&_(b.displacementMap.channel),emissiveMapUv:ce&&_(b.emissiveMap.channel),metalnessMapUv:ge&&_(b.metalnessMap.channel),roughnessMapUv:$e&&_(b.roughnessMap.channel),anisotropyMapUv:K&&_(b.anisotropyMap.channel),clearcoatMapUv:De&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:pe&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Pe&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Ae&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:de&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:be&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:ze&&_(b.sheenRoughnessMap.channel),specularMapUv:Fe&&_(b.specularMap.channel),specularColorMapUv:Me&&_(b.specularColorMap.channel),specularIntensityMapUv:qe&&_(b.specularIntensityMap.channel),transmissionMapUv:E&&_(b.transmissionMap.channel),thicknessMapUv:U&&_(b.thicknessMap.channel),alphaMapUv:ie&&_(b.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(te||Ve),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:X.isPoints===!0&&!!H.attributes.uv&&(Ke||ie),fog:!!j,useFog:b.fog===!0,fogExp2:!!j&&j.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:we,skinning:X.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:Ee,morphTextureStride:We,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:he,decodeVideoTexture:Ke&&b.map.isVideoTexture===!0&&lt.getTransfer(b.map.colorSpace)===gt,decodeVideoTextureEmissive:ce&&b.emissiveMap.isVideoTexture===!0&&lt.getTransfer(b.emissiveMap.colorSpace)===gt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===mi,flipSided:b.side===cn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:fe&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(fe&&b.extensions.multiDraw===!0||Ie)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Re.vertexUv1s=c.has(1),Re.vertexUv2s=c.has(2),Re.vertexUv3s=c.has(3),c.clear(),Re}function d(b){let M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(let P in b.defines)M.push(P),M.push(b.defines[P]);return b.isRawShaderMaterial===!1&&(T(M,b),v(M,b),M.push(i.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function T(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function v(b,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),M.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),b.push(a.mask)}function x(b){let M=g[b.type],P;if(M){let G=_i[M];P=_f.clone(G.uniforms)}else P=b.uniforms;return P}function w(b,M){let P;for(let G=0,X=h.length;G<X;G++){let j=h[G];if(j.cacheKey===M){P=j,++P.usedTimes;break}}return P===void 0&&(P=new fy(i,M,b,r),h.push(P)),P}function A(b){if(--b.usedTimes===0){let M=h.indexOf(b);h[M]=h[h.length-1],h.pop(),b.destroy()}}function C(b){l.remove(b)}function N(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:x,acquireProgram:w,releaseProgram:A,releaseShaderCache:C,programs:h,dispose:N}}function gy(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function _y(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Wf(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Xf(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u,f,p,g,_,m){let d=i[e];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[e]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=_,d.group=m),e++,d}function a(u,f,p,g,_,m){let d=o(u,f,p,g,_,m);p.transmission>0?n.push(d):p.transparent===!0?s.push(d):t.push(d)}function l(u,f,p,g,_,m){let d=o(u,f,p,g,_,m);p.transmission>0?n.unshift(d):p.transparent===!0?s.unshift(d):t.unshift(d)}function c(u,f){t.length>1&&t.sort(u||_y),n.length>1&&n.sort(f||Wf),s.length>1&&s.sort(f||Wf)}function h(){for(let u=e,f=i.length;u<f;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function xy(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Xf,i.set(n,[o])):s>=r.length?(o=new Xf,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function yy(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new Ze};break;case"SpotLight":t={position:new L,direction:new L,color:new Ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new Ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new Ze,groundColor:new Ze};break;case"RectAreaLight":t={color:new Ze,position:new L,halfWidth:new L,halfHeight:new L};break}return i[e.id]=t,t}}}function vy(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var by=0;function My(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Sy(i){let e=new yy,t=vy(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);let s=new L,r=new ft,o=new ft;function a(c){let h=0,u=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let p=0,g=0,_=0,m=0,d=0,T=0,v=0,x=0,w=0,A=0,C=0;c.sort(My);for(let b=0,M=c.length;b<M;b++){let P=c[b],G=P.color,X=P.intensity,j=P.distance,H=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=G.r*X,u+=G.g*X,f+=G.b*X;else if(P.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(P.sh.coefficients[V],X);C++}else if(P.isDirectionalLight){let V=e.get(P);if(V.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let ee=P.shadow,$=t.get(P);$.shadowIntensity=ee.intensity,$.shadowBias=ee.bias,$.shadowNormalBias=ee.normalBias,$.shadowRadius=ee.radius,$.shadowMapSize=ee.mapSize,n.directionalShadow[p]=$,n.directionalShadowMap[p]=H,n.directionalShadowMatrix[p]=P.shadow.matrix,T++}n.directional[p]=V,p++}else if(P.isSpotLight){let V=e.get(P);V.position.setFromMatrixPosition(P.matrixWorld),V.color.copy(G).multiplyScalar(X),V.distance=j,V.coneCos=Math.cos(P.angle),V.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),V.decay=P.decay,n.spot[_]=V;let ee=P.shadow;if(P.map&&(n.spotLightMap[w]=P.map,w++,ee.updateMatrices(P),P.castShadow&&A++),n.spotLightMatrix[_]=ee.matrix,P.castShadow){let $=t.get(P);$.shadowIntensity=ee.intensity,$.shadowBias=ee.bias,$.shadowNormalBias=ee.normalBias,$.shadowRadius=ee.radius,$.shadowMapSize=ee.mapSize,n.spotShadow[_]=$,n.spotShadowMap[_]=H,x++}_++}else if(P.isRectAreaLight){let V=e.get(P);V.color.copy(G).multiplyScalar(X),V.halfWidth.set(P.width*.5,0,0),V.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=V,m++}else if(P.isPointLight){let V=e.get(P);if(V.color.copy(P.color).multiplyScalar(P.intensity),V.distance=P.distance,V.decay=P.decay,P.castShadow){let ee=P.shadow,$=t.get(P);$.shadowIntensity=ee.intensity,$.shadowBias=ee.bias,$.shadowNormalBias=ee.normalBias,$.shadowRadius=ee.radius,$.shadowMapSize=ee.mapSize,$.shadowCameraNear=ee.camera.near,$.shadowCameraFar=ee.camera.far,n.pointShadow[g]=$,n.pointShadowMap[g]=H,n.pointShadowMatrix[g]=P.shadow.matrix,v++}n.point[g]=V,g++}else if(P.isHemisphereLight){let V=e.get(P);V.skyColor.copy(P.color).multiplyScalar(X),V.groundColor.copy(P.groundColor).multiplyScalar(X),n.hemi[d]=V,d++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ve.LTC_FLOAT_1,n.rectAreaLTC2=ve.LTC_FLOAT_2):(n.rectAreaLTC1=ve.LTC_HALF_1,n.rectAreaLTC2=ve.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;let N=n.hash;(N.directionalLength!==p||N.pointLength!==g||N.spotLength!==_||N.rectAreaLength!==m||N.hemiLength!==d||N.numDirectionalShadows!==T||N.numPointShadows!==v||N.numSpotShadows!==x||N.numSpotMaps!==w||N.numLightProbes!==C)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=d,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=x+w-A,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=C,N.directionalLength=p,N.pointLength=g,N.spotLength=_,N.rectAreaLength=m,N.hemiLength=d,N.numDirectionalShadows=T,N.numPointShadows=v,N.numSpotShadows=x,N.numSpotMaps=w,N.numLightProbes=C,n.version=by++)}function l(c,h){let u=0,f=0,p=0,g=0,_=0,m=h.matrixWorldInverse;for(let d=0,T=c.length;d<T;d++){let v=c[d];if(v.isDirectionalLight){let x=n.directional[u];x.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),u++}else if(v.isSpotLight){let x=n.spot[p];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),p++}else if(v.isRectAreaLight){let x=n.rectArea[g];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),o.identity(),r.copy(v.matrixWorld),r.premultiply(m),o.extractRotation(r),x.halfWidth.set(v.width*.5,0,0),x.halfHeight.set(0,v.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){let x=n.point[f];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),f++}else if(v.isHemisphereLight){let x=n.hemi[_];x.direction.setFromMatrixPosition(v.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function $f(i){let e=new Sy(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function Ey(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new $f(i),e.set(s,[a])):r>=o.length?(a=new $f(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var Ty=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,wy=`uniform sampler2D shadow_pass;
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
}`;function Ay(i,e,t){let n=new fr,s=new le,r=new le,o=new Lt,a=new il({depthPacking:rf}),l=new sl,c={},h=t.maxTextureSize,u={[Ai]:cn,[cn]:Ai,[mi]:mi},f=new ei({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new le},radius:{value:4}},vertexShader:Ty,fragmentShader:wy}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let g=new St;g.setAttribute("position",new _n(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new _t(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Th;let d=this.type;this.render=function(A,C,N){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;let b=i.getRenderTarget(),M=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),G=i.state;G.setBlending(Ri),G.buffers.depth.getReversed()===!0?G.buffers.color.setClear(0,0,0,0):G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);let X=d!==pi&&this.type===pi,j=d===pi&&this.type!==pi;for(let H=0,V=A.length;H<V;H++){let ee=A[H],$=ee.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",ee,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);let ue=$.getFrameExtents();if(s.multiply(ue),r.copy($.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ue.x),s.x=r.x*ue.x,$.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ue.y),s.y=r.y*ue.y,$.mapSize.y=r.y)),$.map===null||X===!0||j===!0){let Ee=this.type!==pi?{minFilter:Bn,magFilter:Bn}:{};$.map!==null&&$.map.dispose(),$.map=new ui(s.x,s.y,Ee),$.map.texture.name=ee.name+".shadowMap",$.camera.updateProjectionMatrix()}i.setRenderTarget($.map),i.clear();let ye=$.getViewportCount();for(let Ee=0;Ee<ye;Ee++){let We=$.getViewport(Ee);o.set(r.x*We.x,r.y*We.y,r.x*We.z,r.y*We.w),G.viewport(o),$.updateMatrices(ee,Ee),n=$.getFrustum(),x(C,N,$.camera,ee,this.type)}$.isPointLightShadow!==!0&&this.type===pi&&T($,N),$.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(b,M,P)};function T(A,C){let N=e.update(_);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new ui(s.x,s.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(C,null,N,f,_,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(C,null,N,p,_,null)}function v(A,C,N,b){let M=null,P=N.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)M=P;else if(M=N.isPointLight===!0?l:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let G=M.uuid,X=C.uuid,j=c[G];j===void 0&&(j={},c[G]=j);let H=j[X];H===void 0&&(H=M.clone(),j[X]=H,C.addEventListener("dispose",w)),M=H}if(M.visible=C.visible,M.wireframe=C.wireframe,b===pi?M.side=C.shadowSide!==null?C.shadowSide:C.side:M.side=C.shadowSide!==null?C.shadowSide:u[C.side],M.alphaMap=C.alphaMap,M.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,M.map=C.map,M.clipShadows=C.clipShadows,M.clippingPlanes=C.clippingPlanes,M.clipIntersection=C.clipIntersection,M.displacementMap=C.displacementMap,M.displacementScale=C.displacementScale,M.displacementBias=C.displacementBias,M.wireframeLinewidth=C.wireframeLinewidth,M.linewidth=C.linewidth,N.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let G=i.properties.get(M);G.light=N}return M}function x(A,C,N,b,M){if(A.visible===!1)return;if(A.layers.test(C.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&M===pi)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,A.matrixWorld);let X=e.update(A),j=A.material;if(Array.isArray(j)){let H=X.groups;for(let V=0,ee=H.length;V<ee;V++){let $=H[V],ue=j[$.materialIndex];if(ue&&ue.visible){let ye=v(A,ue,b,M);A.onBeforeShadow(i,A,C,N,X,ye,$),i.renderBufferDirect(N,null,X,ye,A,$),A.onAfterShadow(i,A,C,N,X,ye,$)}}}else if(j.visible){let H=v(A,j,b,M);A.onBeforeShadow(i,A,C,N,X,H,null),i.renderBufferDirect(N,null,X,H,A,null),A.onAfterShadow(i,A,C,N,X,H,null)}}let G=A.children;for(let X=0,j=G.length;X<j;X++)x(G[X],C,N,b,M)}function w(A){A.target.removeEventListener("dispose",w);for(let N in c){let b=c[N],M=A.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}var Ry={[gl]:_l,[xl]:bl,[yl]:Ml,[fs]:vl,[_l]:gl,[bl]:xl,[Ml]:yl,[vl]:fs};function Cy(i,e){function t(){let E=!1,U=new Lt,W=null,ie=new Lt(0,0,0,0);return{setMask:function(Y){W!==Y&&!E&&(i.colorMask(Y,Y,Y,Y),W=Y)},setLocked:function(Y){E=Y},setClear:function(Y,z,fe,he,Re){Re===!0&&(Y*=he,z*=he,fe*=he),U.set(Y,z,fe,he),ie.equals(U)===!1&&(i.clearColor(Y,z,fe,he),ie.copy(U))},reset:function(){E=!1,W=null,ie.set(-1,0,0,0)}}}function n(){let E=!1,U=!1,W=null,ie=null,Y=null;return{setReversed:function(z){if(U!==z){let fe=e.get("EXT_clip_control");z?fe.clipControlEXT(fe.LOWER_LEFT_EXT,fe.ZERO_TO_ONE_EXT):fe.clipControlEXT(fe.LOWER_LEFT_EXT,fe.NEGATIVE_ONE_TO_ONE_EXT),U=z;let he=Y;Y=null,this.setClear(he)}},getReversed:function(){return U},setTest:function(z){z?ae(i.DEPTH_TEST):we(i.DEPTH_TEST)},setMask:function(z){W!==z&&!E&&(i.depthMask(z),W=z)},setFunc:function(z){if(U&&(z=Ry[z]),ie!==z){switch(z){case gl:i.depthFunc(i.NEVER);break;case _l:i.depthFunc(i.ALWAYS);break;case xl:i.depthFunc(i.LESS);break;case fs:i.depthFunc(i.LEQUAL);break;case yl:i.depthFunc(i.EQUAL);break;case vl:i.depthFunc(i.GEQUAL);break;case bl:i.depthFunc(i.GREATER);break;case Ml:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ie=z}},setLocked:function(z){E=z},setClear:function(z){Y!==z&&(U&&(z=1-z),i.clearDepth(z),Y=z)},reset:function(){E=!1,W=null,ie=null,Y=null,U=!1}}}function s(){let E=!1,U=null,W=null,ie=null,Y=null,z=null,fe=null,he=null,Re=null;return{setTest:function(Ue){E||(Ue?ae(i.STENCIL_TEST):we(i.STENCIL_TEST))},setMask:function(Ue){U!==Ue&&!E&&(i.stencilMask(Ue),U=Ue)},setFunc:function(Ue,Te,Ye){(W!==Ue||ie!==Te||Y!==Ye)&&(i.stencilFunc(Ue,Te,Ye),W=Ue,ie=Te,Y=Ye)},setOp:function(Ue,Te,Ye){(z!==Ue||fe!==Te||he!==Ye)&&(i.stencilOp(Ue,Te,Ye),z=Ue,fe=Te,he=Ye)},setLocked:function(Ue){E=Ue},setClear:function(Ue){Re!==Ue&&(i.clearStencil(Ue),Re=Ue)},reset:function(){E=!1,U=null,W=null,ie=null,Y=null,z=null,fe=null,he=null,Re=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},f=new WeakMap,p=[],g=null,_=!1,m=null,d=null,T=null,v=null,x=null,w=null,A=null,C=new Ze(0,0,0),N=0,b=!1,M=null,P=null,G=null,X=null,j=null,H=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),V=!1,ee=0,$=i.getParameter(i.VERSION);$.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec($)[1]),V=ee>=1):$.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),V=ee>=2);let ue=null,ye={},Ee=i.getParameter(i.SCISSOR_BOX),We=i.getParameter(i.VIEWPORT),Je=new Lt().fromArray(Ee),nt=new Lt().fromArray(We);function at(E,U,W,ie){let Y=new Uint8Array(4),z=i.createTexture();i.bindTexture(E,z),i.texParameteri(E,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(E,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let fe=0;fe<W;fe++)E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY?i.texImage3D(U,0,i.RGBA,1,1,ie,0,i.RGBA,i.UNSIGNED_BYTE,Y):i.texImage2D(U+fe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Y);return z}let Q={};Q[i.TEXTURE_2D]=at(i.TEXTURE_2D,i.TEXTURE_2D,1),Q[i.TEXTURE_CUBE_MAP]=at(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[i.TEXTURE_2D_ARRAY]=at(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Q[i.TEXTURE_3D]=at(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ae(i.DEPTH_TEST),o.setFunc(fs),ne(!1),te(Eh),ae(i.CULL_FACE),oe(Ri);function ae(E){h[E]!==!0&&(i.enable(E),h[E]=!0)}function we(E){h[E]!==!1&&(i.disable(E),h[E]=!1)}function Oe(E,U){return u[E]!==U?(i.bindFramebuffer(E,U),u[E]=U,E===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=U),E===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=U),!0):!1}function Ie(E,U){let W=p,ie=!1;if(E){W=f.get(U),W===void 0&&(W=[],f.set(U,W));let Y=E.textures;if(W.length!==Y.length||W[0]!==i.COLOR_ATTACHMENT0){for(let z=0,fe=Y.length;z<fe;z++)W[z]=i.COLOR_ATTACHMENT0+z;W.length=Y.length,ie=!0}}else W[0]!==i.BACK&&(W[0]=i.BACK,ie=!0);ie&&i.drawBuffers(W)}function Ke(E){return g!==E?(i.useProgram(E),g=E,!0):!1}let pt={[Hi]:i.FUNC_ADD,[Id]:i.FUNC_SUBTRACT,[Pd]:i.FUNC_REVERSE_SUBTRACT};pt[Dd]=i.MIN,pt[Ld]=i.MAX;let I={[Nd]:i.ZERO,[Ud]:i.ONE,[Fd]:i.SRC_COLOR,[Fa]:i.SRC_ALPHA,[Vd]:i.SRC_ALPHA_SATURATE,[zd]:i.DST_COLOR,[Bd]:i.DST_ALPHA,[Od]:i.ONE_MINUS_SRC_COLOR,[Oa]:i.ONE_MINUS_SRC_ALPHA,[Hd]:i.ONE_MINUS_DST_COLOR,[kd]:i.ONE_MINUS_DST_ALPHA,[Gd]:i.CONSTANT_COLOR,[Wd]:i.ONE_MINUS_CONSTANT_COLOR,[Xd]:i.CONSTANT_ALPHA,[$d]:i.ONE_MINUS_CONSTANT_ALPHA};function oe(E,U,W,ie,Y,z,fe,he,Re,Ue){if(E===Ri){_===!0&&(we(i.BLEND),_=!1);return}if(_===!1&&(ae(i.BLEND),_=!0),E!==Cd){if(E!==m||Ue!==b){if((d!==Hi||x!==Hi)&&(i.blendEquation(i.FUNC_ADD),d=Hi,x=Hi),Ue)switch(E){case ds:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case wh:i.blendFunc(i.ONE,i.ONE);break;case Ah:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Rh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",E);break}else switch(E){case ds:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case wh:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Ah:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Rh:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",E);break}T=null,v=null,w=null,A=null,C.set(0,0,0),N=0,m=E,b=Ue}return}Y=Y||U,z=z||W,fe=fe||ie,(U!==d||Y!==x)&&(i.blendEquationSeparate(pt[U],pt[Y]),d=U,x=Y),(W!==T||ie!==v||z!==w||fe!==A)&&(i.blendFuncSeparate(I[W],I[ie],I[z],I[fe]),T=W,v=ie,w=z,A=fe),(he.equals(C)===!1||Re!==N)&&(i.blendColor(he.r,he.g,he.b,Re),C.copy(he),N=Re),m=E,b=!1}function se(E,U){E.side===mi?we(i.CULL_FACE):ae(i.CULL_FACE);let W=E.side===cn;U&&(W=!W),ne(W),E.blending===ds&&E.transparent===!1?oe(Ri):oe(E.blending,E.blendEquation,E.blendSrc,E.blendDst,E.blendEquationAlpha,E.blendSrcAlpha,E.blendDstAlpha,E.blendColor,E.blendAlpha,E.premultipliedAlpha),o.setFunc(E.depthFunc),o.setTest(E.depthTest),o.setMask(E.depthWrite),r.setMask(E.colorWrite);let ie=E.stencilWrite;a.setTest(ie),ie&&(a.setMask(E.stencilWriteMask),a.setFunc(E.stencilFunc,E.stencilRef,E.stencilFuncMask),a.setOp(E.stencilFail,E.stencilZFail,E.stencilZPass)),ce(E.polygonOffset,E.polygonOffsetFactor,E.polygonOffsetUnits),E.alphaToCoverage===!0?ae(i.SAMPLE_ALPHA_TO_COVERAGE):we(i.SAMPLE_ALPHA_TO_COVERAGE)}function ne(E){M!==E&&(E?i.frontFace(i.CW):i.frontFace(i.CCW),M=E)}function te(E){E!==Ad?(ae(i.CULL_FACE),E!==P&&(E===Eh?i.cullFace(i.BACK):E===Rd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):we(i.CULL_FACE),P=E}function xe(E){E!==G&&(V&&i.lineWidth(E),G=E)}function ce(E,U,W){E?(ae(i.POLYGON_OFFSET_FILL),(X!==U||j!==W)&&(i.polygonOffset(U,W),X=U,j=W)):we(i.POLYGON_OFFSET_FILL)}function ge(E){E?ae(i.SCISSOR_TEST):we(i.SCISSOR_TEST)}function $e(E){E===void 0&&(E=i.TEXTURE0+H-1),ue!==E&&(i.activeTexture(E),ue=E)}function Ve(E,U,W){W===void 0&&(ue===null?W=i.TEXTURE0+H-1:W=ue);let ie=ye[W];ie===void 0&&(ie={type:void 0,texture:void 0},ye[W]=ie),(ie.type!==E||ie.texture!==U)&&(ue!==W&&(i.activeTexture(W),ue=W),i.bindTexture(E,U||Q[E]),ie.type=E,ie.texture=U)}function R(){let E=ye[ue];E!==void 0&&E.type!==void 0&&(i.bindTexture(E.type,null),E.type=void 0,E.texture=void 0)}function y(){try{i.compressedTexImage2D(...arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function O(){try{i.compressedTexImage3D(...arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function q(){try{i.texSubImage2D(...arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function re(){try{i.texSubImage3D(...arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function K(){try{i.compressedTexSubImage2D(...arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function De(){try{i.compressedTexSubImage3D(...arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function pe(){try{i.texStorage2D(...arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function Pe(){try{i.texStorage3D(...arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function Ae(){try{i.texImage2D(...arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function de(){try{i.texImage3D(...arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function be(E){Je.equals(E)===!1&&(i.scissor(E.x,E.y,E.z,E.w),Je.copy(E))}function ze(E){nt.equals(E)===!1&&(i.viewport(E.x,E.y,E.z,E.w),nt.copy(E))}function Fe(E,U){let W=c.get(U);W===void 0&&(W=new WeakMap,c.set(U,W));let ie=W.get(E);ie===void 0&&(ie=i.getUniformBlockIndex(U,E.name),W.set(E,ie))}function Me(E,U){let ie=c.get(U).get(E);l.get(U)!==ie&&(i.uniformBlockBinding(U,ie,E.__bindingPointIndex),l.set(U,ie))}function qe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ue=null,ye={},u={},f=new WeakMap,p=[],g=null,_=!1,m=null,d=null,T=null,v=null,x=null,w=null,A=null,C=new Ze(0,0,0),N=0,b=!1,M=null,P=null,G=null,X=null,j=null,Je.set(0,0,i.canvas.width,i.canvas.height),nt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ae,disable:we,bindFramebuffer:Oe,drawBuffers:Ie,useProgram:Ke,setBlending:oe,setMaterial:se,setFlipSided:ne,setCullFace:te,setLineWidth:xe,setPolygonOffset:ce,setScissorTest:ge,activeTexture:$e,bindTexture:Ve,unbindTexture:R,compressedTexImage2D:y,compressedTexImage3D:O,texImage2D:Ae,texImage3D:de,updateUBOMapping:Fe,uniformBlockBinding:Me,texStorage2D:pe,texStorage3D:Pe,texSubImage2D:q,texSubImage3D:re,compressedTexSubImage2D:K,compressedTexSubImage3D:De,scissor:be,viewport:ze,reset:qe}}function Iy(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new le,h=new WeakMap,u,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,y){return p?new OffscreenCanvas(R,y):no("canvas")}function _(R,y,O){let q=1,re=Ve(R);if((re.width>O||re.height>O)&&(q=O/Math.max(re.width,re.height)),q<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let K=Math.floor(q*re.width),De=Math.floor(q*re.height);u===void 0&&(u=g(K,De));let pe=y?g(K,De):u;return pe.width=K,pe.height=De,pe.getContext("2d").drawImage(R,0,0,K,De),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+K+"x"+De+")."),pe}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),R;return R}function m(R){return R.generateMipmaps}function d(R){i.generateMipmap(R)}function T(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(R,y,O,q,re=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let K=y;if(y===i.RED&&(O===i.FLOAT&&(K=i.R32F),O===i.HALF_FLOAT&&(K=i.R16F),O===i.UNSIGNED_BYTE&&(K=i.R8)),y===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(K=i.R8UI),O===i.UNSIGNED_SHORT&&(K=i.R16UI),O===i.UNSIGNED_INT&&(K=i.R32UI),O===i.BYTE&&(K=i.R8I),O===i.SHORT&&(K=i.R16I),O===i.INT&&(K=i.R32I)),y===i.RG&&(O===i.FLOAT&&(K=i.RG32F),O===i.HALF_FLOAT&&(K=i.RG16F),O===i.UNSIGNED_BYTE&&(K=i.RG8)),y===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(K=i.RG8UI),O===i.UNSIGNED_SHORT&&(K=i.RG16UI),O===i.UNSIGNED_INT&&(K=i.RG32UI),O===i.BYTE&&(K=i.RG8I),O===i.SHORT&&(K=i.RG16I),O===i.INT&&(K=i.RG32I)),y===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(K=i.RGB8UI),O===i.UNSIGNED_SHORT&&(K=i.RGB16UI),O===i.UNSIGNED_INT&&(K=i.RGB32UI),O===i.BYTE&&(K=i.RGB8I),O===i.SHORT&&(K=i.RGB16I),O===i.INT&&(K=i.RGB32I)),y===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),O===i.UNSIGNED_INT&&(K=i.RGBA32UI),O===i.BYTE&&(K=i.RGBA8I),O===i.SHORT&&(K=i.RGBA16I),O===i.INT&&(K=i.RGBA32I)),y===i.RGB&&(O===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(K=i.R11F_G11F_B10F)),y===i.RGBA){let De=re?eo:lt.getTransfer(q);O===i.FLOAT&&(K=i.RGBA32F),O===i.HALF_FLOAT&&(K=i.RGBA16F),O===i.UNSIGNED_BYTE&&(K=De===gt?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function x(R,y){let O;return R?y===null||y===Ki||y===br?O=i.DEPTH24_STENCIL8:y===gi?O=i.DEPTH32F_STENCIL8:y===yr&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Ki||y===br?O=i.DEPTH_COMPONENT24:y===gi?O=i.DEPTH_COMPONENT32F:y===yr&&(O=i.DEPTH_COMPONENT16),O}function w(R,y){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Bn&&R.minFilter!==Kn?Math.log2(Math.max(y.width,y.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?y.mipmaps.length:1}function A(R){let y=R.target;y.removeEventListener("dispose",A),N(y),y.isVideoTexture&&h.delete(y)}function C(R){let y=R.target;y.removeEventListener("dispose",C),M(y)}function N(R){let y=n.get(R);if(y.__webglInit===void 0)return;let O=R.source,q=f.get(O);if(q){let re=q[y.__cacheKey];re.usedTimes--,re.usedTimes===0&&b(R),Object.keys(q).length===0&&f.delete(O)}n.remove(R)}function b(R){let y=n.get(R);i.deleteTexture(y.__webglTexture);let O=R.source,q=f.get(O);delete q[y.__cacheKey],o.memory.textures--}function M(R){let y=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(y.__webglFramebuffer[q]))for(let re=0;re<y.__webglFramebuffer[q].length;re++)i.deleteFramebuffer(y.__webglFramebuffer[q][re]);else i.deleteFramebuffer(y.__webglFramebuffer[q]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[q])}else{if(Array.isArray(y.__webglFramebuffer))for(let q=0;q<y.__webglFramebuffer.length;q++)i.deleteFramebuffer(y.__webglFramebuffer[q]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let q=0;q<y.__webglColorRenderbuffer.length;q++)y.__webglColorRenderbuffer[q]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[q]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}let O=R.textures;for(let q=0,re=O.length;q<re;q++){let K=n.get(O[q]);K.__webglTexture&&(i.deleteTexture(K.__webglTexture),o.memory.textures--),n.remove(O[q])}n.remove(R)}let P=0;function G(){P=0}function X(){let R=P;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),P+=1,R}function j(R){let y=[];return y.push(R.wrapS),y.push(R.wrapT),y.push(R.wrapR||0),y.push(R.magFilter),y.push(R.minFilter),y.push(R.anisotropy),y.push(R.internalFormat),y.push(R.format),y.push(R.type),y.push(R.generateMipmaps),y.push(R.premultiplyAlpha),y.push(R.flipY),y.push(R.unpackAlignment),y.push(R.colorSpace),y.join()}function H(R,y){let O=n.get(R);if(R.isVideoTexture&&ge(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){let q=R.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(O,R,y);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+y)}function V(R,y){let O=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){Q(O,R,y);return}t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+y)}function ee(R,y){let O=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){Q(O,R,y);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+y)}function $(R,y){let O=n.get(R);if(R.version>0&&O.__version!==R.version){ae(O,R,y);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+y)}let ue={[Ba]:i.REPEAT,[zi]:i.CLAMP_TO_EDGE,[ka]:i.MIRRORED_REPEAT},ye={[Bn]:i.NEAREST,[nf]:i.NEAREST_MIPMAP_NEAREST,[Fo]:i.NEAREST_MIPMAP_LINEAR,[Kn]:i.LINEAR,[Tl]:i.LINEAR_MIPMAP_NEAREST,[Ji]:i.LINEAR_MIPMAP_LINEAR},Ee={[af]:i.NEVER,[ff]:i.ALWAYS,[lf]:i.LESS,[zh]:i.LEQUAL,[cf]:i.EQUAL,[df]:i.GEQUAL,[hf]:i.GREATER,[uf]:i.NOTEQUAL};function We(R,y){if(y.type===gi&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===Kn||y.magFilter===Tl||y.magFilter===Fo||y.magFilter===Ji||y.minFilter===Kn||y.minFilter===Tl||y.minFilter===Fo||y.minFilter===Ji)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,ue[y.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,ue[y.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,ue[y.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,ye[y.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,ye[y.minFilter]),y.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,Ee[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Bn||y.minFilter!==Fo&&y.minFilter!==Ji||y.type===gi&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){let O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function Je(R,y){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,y.addEventListener("dispose",A));let q=y.source,re=f.get(q);re===void 0&&(re={},f.set(q,re));let K=j(y);if(K!==R.__cacheKey){re[K]===void 0&&(re[K]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,O=!0),re[K].usedTimes++;let De=re[R.__cacheKey];De!==void 0&&(re[R.__cacheKey].usedTimes--,De.usedTimes===0&&b(y)),R.__cacheKey=K,R.__webglTexture=re[K].texture}return O}function nt(R,y,O){return Math.floor(Math.floor(R/O)/y)}function at(R,y,O,q){let K=R.updateRanges;if(K.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,O,q,y.data);else{K.sort((de,be)=>de.start-be.start);let De=0;for(let de=1;de<K.length;de++){let be=K[De],ze=K[de],Fe=be.start+be.count,Me=nt(ze.start,y.width,4),qe=nt(be.start,y.width,4);ze.start<=Fe+1&&Me===qe&&nt(ze.start+ze.count-1,y.width,4)===Me?be.count=Math.max(be.count,ze.start+ze.count-be.start):(++De,K[De]=ze)}K.length=De+1;let pe=i.getParameter(i.UNPACK_ROW_LENGTH),Pe=i.getParameter(i.UNPACK_SKIP_PIXELS),Ae=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let de=0,be=K.length;de<be;de++){let ze=K[de],Fe=Math.floor(ze.start/4),Me=Math.ceil(ze.count/4),qe=Fe%y.width,E=Math.floor(Fe/y.width),U=Me,W=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,qe),i.pixelStorei(i.UNPACK_SKIP_ROWS,E),t.texSubImage2D(i.TEXTURE_2D,0,qe,E,U,W,O,q,y.data)}R.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,pe),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Pe),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ae)}}function Q(R,y,O){let q=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(q=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(q=i.TEXTURE_3D);let re=Je(R,y),K=y.source;t.bindTexture(q,R.__webglTexture,i.TEXTURE0+O);let De=n.get(K);if(K.version!==De.__version||re===!0){t.activeTexture(i.TEXTURE0+O);let pe=lt.getPrimaries(lt.workingColorSpace),Pe=y.colorSpace===Ii?null:lt.getPrimaries(y.colorSpace),Ae=y.colorSpace===Ii||pe===Pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);let de=_(y.image,!1,s.maxTextureSize);de=$e(y,de);let be=r.convert(y.format,y.colorSpace),ze=r.convert(y.type),Fe=v(y.internalFormat,be,ze,y.colorSpace,y.isVideoTexture);We(q,y);let Me,qe=y.mipmaps,E=y.isVideoTexture!==!0,U=De.__version===void 0||re===!0,W=K.dataReady,ie=w(y,de);if(y.isDepthTexture)Fe=x(y.format===Mr,y.type),U&&(E?t.texStorage2D(i.TEXTURE_2D,1,Fe,de.width,de.height):t.texImage2D(i.TEXTURE_2D,0,Fe,de.width,de.height,0,be,ze,null));else if(y.isDataTexture)if(qe.length>0){E&&U&&t.texStorage2D(i.TEXTURE_2D,ie,Fe,qe[0].width,qe[0].height);for(let Y=0,z=qe.length;Y<z;Y++)Me=qe[Y],E?W&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,Me.width,Me.height,be,ze,Me.data):t.texImage2D(i.TEXTURE_2D,Y,Fe,Me.width,Me.height,0,be,ze,Me.data);y.generateMipmaps=!1}else E?(U&&t.texStorage2D(i.TEXTURE_2D,ie,Fe,de.width,de.height),W&&at(y,de,be,ze)):t.texImage2D(i.TEXTURE_2D,0,Fe,de.width,de.height,0,be,ze,de.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){E&&U&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ie,Fe,qe[0].width,qe[0].height,de.depth);for(let Y=0,z=qe.length;Y<z;Y++)if(Me=qe[Y],y.format!==zn)if(be!==null)if(E){if(W)if(y.layerUpdates.size>0){let fe=Zh(Me.width,Me.height,y.format,y.type);for(let he of y.layerUpdates){let Re=Me.data.subarray(he*fe/Me.data.BYTES_PER_ELEMENT,(he+1)*fe/Me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,he,Me.width,Me.height,1,be,Re)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,Me.width,Me.height,de.depth,be,Me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Y,Fe,Me.width,Me.height,de.depth,0,Me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else E?W&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,Me.width,Me.height,de.depth,be,ze,Me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Y,Fe,Me.width,Me.height,de.depth,0,be,ze,Me.data)}else{E&&U&&t.texStorage2D(i.TEXTURE_2D,ie,Fe,qe[0].width,qe[0].height);for(let Y=0,z=qe.length;Y<z;Y++)Me=qe[Y],y.format!==zn?be!==null?E?W&&t.compressedTexSubImage2D(i.TEXTURE_2D,Y,0,0,Me.width,Me.height,be,Me.data):t.compressedTexImage2D(i.TEXTURE_2D,Y,Fe,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):E?W&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,Me.width,Me.height,be,ze,Me.data):t.texImage2D(i.TEXTURE_2D,Y,Fe,Me.width,Me.height,0,be,ze,Me.data)}else if(y.isDataArrayTexture)if(E){if(U&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ie,Fe,de.width,de.height,de.depth),W)if(y.layerUpdates.size>0){let Y=Zh(de.width,de.height,y.format,y.type);for(let z of y.layerUpdates){let fe=de.data.subarray(z*Y/de.data.BYTES_PER_ELEMENT,(z+1)*Y/de.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,z,de.width,de.height,1,be,ze,fe)}y.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,de.width,de.height,de.depth,be,ze,de.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Fe,de.width,de.height,de.depth,0,be,ze,de.data);else if(y.isData3DTexture)E?(U&&t.texStorage3D(i.TEXTURE_3D,ie,Fe,de.width,de.height,de.depth),W&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,de.width,de.height,de.depth,be,ze,de.data)):t.texImage3D(i.TEXTURE_3D,0,Fe,de.width,de.height,de.depth,0,be,ze,de.data);else if(y.isFramebufferTexture){if(U)if(E)t.texStorage2D(i.TEXTURE_2D,ie,Fe,de.width,de.height);else{let Y=de.width,z=de.height;for(let fe=0;fe<ie;fe++)t.texImage2D(i.TEXTURE_2D,fe,Fe,Y,z,0,be,ze,null),Y>>=1,z>>=1}}else if(qe.length>0){if(E&&U){let Y=Ve(qe[0]);t.texStorage2D(i.TEXTURE_2D,ie,Fe,Y.width,Y.height)}for(let Y=0,z=qe.length;Y<z;Y++)Me=qe[Y],E?W&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,be,ze,Me):t.texImage2D(i.TEXTURE_2D,Y,Fe,be,ze,Me);y.generateMipmaps=!1}else if(E){if(U){let Y=Ve(de);t.texStorage2D(i.TEXTURE_2D,ie,Fe,Y.width,Y.height)}W&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,be,ze,de)}else t.texImage2D(i.TEXTURE_2D,0,Fe,be,ze,de);m(y)&&d(q),De.__version=K.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function ae(R,y,O){if(y.image.length!==6)return;let q=Je(R,y),re=y.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+O);let K=n.get(re);if(re.version!==K.__version||q===!0){t.activeTexture(i.TEXTURE0+O);let De=lt.getPrimaries(lt.workingColorSpace),pe=y.colorSpace===Ii?null:lt.getPrimaries(y.colorSpace),Pe=y.colorSpace===Ii||De===pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pe);let Ae=y.isCompressedTexture||y.image[0].isCompressedTexture,de=y.image[0]&&y.image[0].isDataTexture,be=[];for(let z=0;z<6;z++)!Ae&&!de?be[z]=_(y.image[z],!0,s.maxCubemapSize):be[z]=de?y.image[z].image:y.image[z],be[z]=$e(y,be[z]);let ze=be[0],Fe=r.convert(y.format,y.colorSpace),Me=r.convert(y.type),qe=v(y.internalFormat,Fe,Me,y.colorSpace),E=y.isVideoTexture!==!0,U=K.__version===void 0||q===!0,W=re.dataReady,ie=w(y,ze);We(i.TEXTURE_CUBE_MAP,y);let Y;if(Ae){E&&U&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ie,qe,ze.width,ze.height);for(let z=0;z<6;z++){Y=be[z].mipmaps;for(let fe=0;fe<Y.length;fe++){let he=Y[fe];y.format!==zn?Fe!==null?E?W&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+z,fe,0,0,he.width,he.height,Fe,he.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+z,fe,qe,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):E?W&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+z,fe,0,0,he.width,he.height,Fe,Me,he.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+z,fe,qe,he.width,he.height,0,Fe,Me,he.data)}}}else{if(Y=y.mipmaps,E&&U){Y.length>0&&ie++;let z=Ve(be[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ie,qe,z.width,z.height)}for(let z=0;z<6;z++)if(de){E?W&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+z,0,0,0,be[z].width,be[z].height,Fe,Me,be[z].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+z,0,qe,be[z].width,be[z].height,0,Fe,Me,be[z].data);for(let fe=0;fe<Y.length;fe++){let Re=Y[fe].image[z].image;E?W&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+z,fe+1,0,0,Re.width,Re.height,Fe,Me,Re.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+z,fe+1,qe,Re.width,Re.height,0,Fe,Me,Re.data)}}else{E?W&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+z,0,0,0,Fe,Me,be[z]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+z,0,qe,Fe,Me,be[z]);for(let fe=0;fe<Y.length;fe++){let he=Y[fe];E?W&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+z,fe+1,0,0,Fe,Me,he.image[z]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+z,fe+1,qe,Fe,Me,he.image[z])}}}m(y)&&d(i.TEXTURE_CUBE_MAP),K.__version=re.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function we(R,y,O,q,re,K){let De=r.convert(O.format,O.colorSpace),pe=r.convert(O.type),Pe=v(O.internalFormat,De,pe,O.colorSpace),Ae=n.get(y),de=n.get(O);if(de.__renderTarget=y,!Ae.__hasExternalTextures){let be=Math.max(1,y.width>>K),ze=Math.max(1,y.height>>K);re===i.TEXTURE_3D||re===i.TEXTURE_2D_ARRAY?t.texImage3D(re,K,Pe,be,ze,y.depth,0,De,pe,null):t.texImage2D(re,K,Pe,be,ze,0,De,pe,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),ce(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,q,re,de.__webglTexture,0,xe(y)):(re===i.TEXTURE_2D||re>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,q,re,de.__webglTexture,K),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Oe(R,y,O){if(i.bindRenderbuffer(i.RENDERBUFFER,R),y.depthBuffer){let q=y.depthTexture,re=q&&q.isDepthTexture?q.type:null,K=x(y.stencilBuffer,re),De=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pe=xe(y);ce(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,pe,K,y.width,y.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,pe,K,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,K,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,De,i.RENDERBUFFER,R)}else{let q=y.textures;for(let re=0;re<q.length;re++){let K=q[re],De=r.convert(K.format,K.colorSpace),pe=r.convert(K.type),Pe=v(K.internalFormat,De,pe,K.colorSpace),Ae=xe(y);O&&ce(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ae,Pe,y.width,y.height):ce(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ae,Pe,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,Pe,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ie(R,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let q=n.get(y.depthTexture);q.__renderTarget=y,(!q.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),H(y.depthTexture,0);let re=q.__webglTexture,K=xe(y);if(y.depthTexture.format===or)ce(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,re,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,re,0);else if(y.depthTexture.format===Mr)ce(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,re,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,re,0);else throw new Error("Unknown depthTexture format")}function Ke(R){let y=n.get(R),O=R.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==R.depthTexture){let q=R.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),q){let re=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,q.removeEventListener("dispose",re)};q.addEventListener("dispose",re),y.__depthDisposeCallback=re}y.__boundDepthTexture=q}if(R.depthTexture&&!y.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");let q=R.texture.mipmaps;q&&q.length>0?Ie(y.__webglFramebuffer[0],R):Ie(y.__webglFramebuffer,R)}else if(O){y.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[q]),y.__webglDepthbuffer[q]===void 0)y.__webglDepthbuffer[q]=i.createRenderbuffer(),Oe(y.__webglDepthbuffer[q],R,!1);else{let re=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=y.__webglDepthbuffer[q];i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,re,i.RENDERBUFFER,K)}}else{let q=R.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),Oe(y.__webglDepthbuffer,R,!1);else{let re=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,re,i.RENDERBUFFER,K)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function pt(R,y,O){let q=n.get(R);y!==void 0&&we(q.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&Ke(R)}function I(R){let y=R.texture,O=n.get(R),q=n.get(y);R.addEventListener("dispose",C);let re=R.textures,K=R.isWebGLCubeRenderTarget===!0,De=re.length>1;if(De||(q.__webglTexture===void 0&&(q.__webglTexture=i.createTexture()),q.__version=y.version,o.memory.textures++),K){O.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)if(y.mipmaps&&y.mipmaps.length>0){O.__webglFramebuffer[pe]=[];for(let Pe=0;Pe<y.mipmaps.length;Pe++)O.__webglFramebuffer[pe][Pe]=i.createFramebuffer()}else O.__webglFramebuffer[pe]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){O.__webglFramebuffer=[];for(let pe=0;pe<y.mipmaps.length;pe++)O.__webglFramebuffer[pe]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(De)for(let pe=0,Pe=re.length;pe<Pe;pe++){let Ae=n.get(re[pe]);Ae.__webglTexture===void 0&&(Ae.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&ce(R)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let pe=0;pe<re.length;pe++){let Pe=re[pe];O.__webglColorRenderbuffer[pe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[pe]);let Ae=r.convert(Pe.format,Pe.colorSpace),de=r.convert(Pe.type),be=v(Pe.internalFormat,Ae,de,Pe.colorSpace,R.isXRRenderTarget===!0),ze=xe(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,ze,be,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,O.__webglColorRenderbuffer[pe])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Oe(O.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){t.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),We(i.TEXTURE_CUBE_MAP,y);for(let pe=0;pe<6;pe++)if(y.mipmaps&&y.mipmaps.length>0)for(let Pe=0;Pe<y.mipmaps.length;Pe++)we(O.__webglFramebuffer[pe][Pe],R,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Pe);else we(O.__webglFramebuffer[pe],R,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0);m(y)&&d(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(De){for(let pe=0,Pe=re.length;pe<Pe;pe++){let Ae=re[pe],de=n.get(Ae),be=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(be=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(be,de.__webglTexture),We(be,Ae),we(O.__webglFramebuffer,R,Ae,i.COLOR_ATTACHMENT0+pe,be,0),m(Ae)&&d(be)}t.unbindTexture()}else{let pe=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(pe=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(pe,q.__webglTexture),We(pe,y),y.mipmaps&&y.mipmaps.length>0)for(let Pe=0;Pe<y.mipmaps.length;Pe++)we(O.__webglFramebuffer[Pe],R,y,i.COLOR_ATTACHMENT0,pe,Pe);else we(O.__webglFramebuffer,R,y,i.COLOR_ATTACHMENT0,pe,0);m(y)&&d(pe),t.unbindTexture()}R.depthBuffer&&Ke(R)}function oe(R){let y=R.textures;for(let O=0,q=y.length;O<q;O++){let re=y[O];if(m(re)){let K=T(R),De=n.get(re).__webglTexture;t.bindTexture(K,De),d(K),t.unbindTexture()}}}let se=[],ne=[];function te(R){if(R.samples>0){if(ce(R)===!1){let y=R.textures,O=R.width,q=R.height,re=i.COLOR_BUFFER_BIT,K=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,De=n.get(R),pe=y.length>1;if(pe)for(let Ae=0;Ae<y.length;Ae++)t.bindFramebuffer(i.FRAMEBUFFER,De.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,De.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,De.__webglMultisampledFramebuffer);let Pe=R.texture.mipmaps;Pe&&Pe.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,De.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,De.__webglFramebuffer);for(let Ae=0;Ae<y.length;Ae++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(re|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(re|=i.STENCIL_BUFFER_BIT)),pe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,De.__webglColorRenderbuffer[Ae]);let de=n.get(y[Ae]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,de,0)}i.blitFramebuffer(0,0,O,q,0,0,O,q,re,i.NEAREST),l===!0&&(se.length=0,ne.length=0,se.push(i.COLOR_ATTACHMENT0+Ae),R.depthBuffer&&R.resolveDepthBuffer===!1&&(se.push(K),ne.push(K),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ne)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,se))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),pe)for(let Ae=0;Ae<y.length;Ae++){t.bindFramebuffer(i.FRAMEBUFFER,De.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.RENDERBUFFER,De.__webglColorRenderbuffer[Ae]);let de=n.get(y[Ae]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,De.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.TEXTURE_2D,de,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,De.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){let y=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function xe(R){return Math.min(s.maxSamples,R.samples)}function ce(R){let y=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function ge(R){let y=o.render.frame;h.get(R)!==y&&(h.set(R,y),R.update())}function $e(R,y){let O=R.colorSpace,q=R.format,re=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==ps&&O!==Ii&&(lt.getTransfer(O)===gt?(q!==zn||re!==ti)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),y}function Ve(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=X,this.resetTextureUnits=G,this.setTexture2D=H,this.setTexture2DArray=V,this.setTexture3D=ee,this.setTextureCube=$,this.rebindTextures=pt,this.setupRenderTarget=I,this.updateRenderTargetMipmap=oe,this.updateMultisampleRenderTarget=te,this.setupDepthRenderbuffer=Ke,this.setupFrameBufferTexture=we,this.useMultisampledRTT=ce}function Py(i,e){function t(n,s=Ii){let r,o=lt.getTransfer(s);if(n===ti)return i.UNSIGNED_BYTE;if(n===Al)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Rl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Lh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Nh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Ph)return i.BYTE;if(n===Dh)return i.SHORT;if(n===yr)return i.UNSIGNED_SHORT;if(n===wl)return i.INT;if(n===Ki)return i.UNSIGNED_INT;if(n===gi)return i.FLOAT;if(n===vr)return i.HALF_FLOAT;if(n===Uh)return i.ALPHA;if(n===Fh)return i.RGB;if(n===zn)return i.RGBA;if(n===or)return i.DEPTH_COMPONENT;if(n===Mr)return i.DEPTH_STENCIL;if(n===Oh)return i.RED;if(n===Cl)return i.RED_INTEGER;if(n===Bh)return i.RG;if(n===Il)return i.RG_INTEGER;if(n===Pl)return i.RGBA_INTEGER;if(n===Oo||n===Bo||n===ko||n===zo)if(o===gt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Oo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Bo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ko)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===zo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Oo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Bo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ko)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===zo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Dl||n===Ll||n===Nl||n===Ul)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Dl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ll)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Nl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ul)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Fl||n===Ol||n===Bl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Fl||n===Ol)return o===gt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Bl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===kl||n===zl||n===Hl||n===Vl||n===Gl||n===Wl||n===Xl||n===$l||n===ql||n===Yl||n===Zl||n===jl||n===Jl||n===Kl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===kl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===zl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Hl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Vl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Gl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Wl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Xl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===$l)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ql)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Yl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Zl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===jl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Jl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Kl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ql||n===ec||n===tc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Ql)return o===gt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ec)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===tc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===nc||n===ic||n===sc||n===rc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===nc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ic)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===sc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===rc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===br?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Dy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ly=`
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

}`,lu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new fo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new ei({vertexShader:Dy,fragmentShader:Ly,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new _t(new ys(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},cu=class extends hi{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,f=null,p=null,g=null,_=typeof XRWebGLBinding<"u",m=new lu,d={},T=t.getContextAttributes(),v=null,x=null,w=[],A=[],C=new le,N=null,b=new Yt;b.viewport=new Lt;let M=new Yt;M.viewport=new Lt;let P=[b,M],G=new pl,X=null,j=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let ae=w[Q];return ae===void 0&&(ae=new ur,w[Q]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function(Q){let ae=w[Q];return ae===void 0&&(ae=new ur,w[Q]=ae),ae.getGripSpace()},this.getHand=function(Q){let ae=w[Q];return ae===void 0&&(ae=new ur,w[Q]=ae),ae.getHandSpace()};function H(Q){let ae=A.indexOf(Q.inputSource);if(ae===-1)return;let we=w[ae];we!==void 0&&(we.update(Q.inputSource,Q.frame,c||o),we.dispatchEvent({type:Q.type,data:Q.inputSource}))}function V(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",ee);for(let Q=0;Q<w.length;Q++){let ae=A[Q];ae!==null&&(A[Q]=null,w[Q].disconnect(ae))}X=null,j=null,m.reset();for(let Q in d)delete d[Q];e.setRenderTarget(v),p=null,f=null,u=null,s=null,x=null,at.stop(),n.isPresenting=!1,e.setPixelRatio(N),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){r=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){a=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Q){if(s=Q,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",V),s.addEventListener("inputsourceschange",ee),T.xrCompatible!==!0&&await t.makeXRCompatible(),N=e.getPixelRatio(),e.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let we=null,Oe=null,Ie=null;T.depth&&(Ie=T.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,we=T.stencil?Mr:or,Oe=T.stencil?br:Ki);let Ke={colorFormat:t.RGBA8,depthFormat:Ie,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(Ke),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),x=new ui(f.textureWidth,f.textureHeight,{format:zn,type:ti,depthTexture:new uo(f.textureWidth,f.textureHeight,Oe,void 0,void 0,void 0,void 0,void 0,void 0,we),stencilBuffer:T.stencil,colorSpace:e.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let we={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,we),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),x=new ui(p.framebufferWidth,p.framebufferHeight,{format:zn,type:ti,colorSpace:e.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),at.setContext(s),at.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ee(Q){for(let ae=0;ae<Q.removed.length;ae++){let we=Q.removed[ae],Oe=A.indexOf(we);Oe>=0&&(A[Oe]=null,w[Oe].disconnect(we))}for(let ae=0;ae<Q.added.length;ae++){let we=Q.added[ae],Oe=A.indexOf(we);if(Oe===-1){for(let Ke=0;Ke<w.length;Ke++)if(Ke>=A.length){A.push(we),Oe=Ke;break}else if(A[Ke]===null){A[Ke]=we,Oe=Ke;break}if(Oe===-1)break}let Ie=w[Oe];Ie&&Ie.connect(we)}}let $=new L,ue=new L;function ye(Q,ae,we){$.setFromMatrixPosition(ae.matrixWorld),ue.setFromMatrixPosition(we.matrixWorld);let Oe=$.distanceTo(ue),Ie=ae.projectionMatrix.elements,Ke=we.projectionMatrix.elements,pt=Ie[14]/(Ie[10]-1),I=Ie[14]/(Ie[10]+1),oe=(Ie[9]+1)/Ie[5],se=(Ie[9]-1)/Ie[5],ne=(Ie[8]-1)/Ie[0],te=(Ke[8]+1)/Ke[0],xe=pt*ne,ce=pt*te,ge=Oe/(-ne+te),$e=ge*-ne;if(ae.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX($e),Q.translateZ(ge),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),Ie[10]===-1)Q.projectionMatrix.copy(ae.projectionMatrix),Q.projectionMatrixInverse.copy(ae.projectionMatrixInverse);else{let Ve=pt+ge,R=I+ge,y=xe-$e,O=ce+(Oe-$e),q=oe*I/R*Ve,re=se*I/R*Ve;Q.projectionMatrix.makePerspective(y,O,q,re,Ve,R),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function Ee(Q,ae){ae===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(ae.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(s===null)return;let ae=Q.near,we=Q.far;m.texture!==null&&(m.depthNear>0&&(ae=m.depthNear),m.depthFar>0&&(we=m.depthFar)),G.near=M.near=b.near=ae,G.far=M.far=b.far=we,(X!==G.near||j!==G.far)&&(s.updateRenderState({depthNear:G.near,depthFar:G.far}),X=G.near,j=G.far),G.layers.mask=Q.layers.mask|6,b.layers.mask=G.layers.mask&3,M.layers.mask=G.layers.mask&5;let Oe=Q.parent,Ie=G.cameras;Ee(G,Oe);for(let Ke=0;Ke<Ie.length;Ke++)Ee(Ie[Ke],Oe);Ie.length===2?ye(G,b,M):G.projectionMatrix.copy(b.projectionMatrix),We(Q,G,Oe)};function We(Q,ae,we){we===null?Q.matrix.copy(ae.matrixWorld):(Q.matrix.copy(we.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(ae.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(ae.projectionMatrix),Q.projectionMatrixInverse.copy(ae.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=ar*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return G},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(Q){l=Q,f!==null&&(f.fixedFoveation=Q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(G)},this.getCameraTexture=function(Q){return d[Q]};let Je=null;function nt(Q,ae){if(h=ae.getViewerPose(c||o),g=ae,h!==null){let we=h.views;p!==null&&(e.setRenderTargetFramebuffer(x,p.framebuffer),e.setRenderTarget(x));let Oe=!1;we.length!==G.cameras.length&&(G.cameras.length=0,Oe=!0);for(let I=0;I<we.length;I++){let oe=we[I],se=null;if(p!==null)se=p.getViewport(oe);else{let te=u.getViewSubImage(f,oe);se=te.viewport,I===0&&(e.setRenderTargetTextures(x,te.colorTexture,te.depthStencilTexture),e.setRenderTarget(x))}let ne=P[I];ne===void 0&&(ne=new Yt,ne.layers.enable(I),ne.viewport=new Lt,P[I]=ne),ne.matrix.fromArray(oe.transform.matrix),ne.matrix.decompose(ne.position,ne.quaternion,ne.scale),ne.projectionMatrix.fromArray(oe.projectionMatrix),ne.projectionMatrixInverse.copy(ne.projectionMatrix).invert(),ne.viewport.set(se.x,se.y,se.width,se.height),I===0&&(G.matrix.copy(ne.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale)),Oe===!0&&G.cameras.push(ne)}let Ie=s.enabledFeatures;if(Ie&&Ie.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=n.getBinding();let I=u.getDepthInformation(we[0]);I&&I.isValid&&I.texture&&m.init(I,s.renderState)}if(Ie&&Ie.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let I=0;I<we.length;I++){let oe=we[I].camera;if(oe){let se=d[oe];se||(se=new fo,d[oe]=se);let ne=u.getCameraImage(oe);se.sourceTexture=ne}}}}for(let we=0;we<w.length;we++){let Oe=A[we],Ie=w[we];Oe!==null&&Ie!==void 0&&Ie.update(Oe,ae,c||o)}Je&&Je(Q,ae),ae.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ae}),g=null}let at=new qf;at.setAnimationLoop(nt),this.setAnimationLoop=function(Q){Je=Q},this.dispose=function(){}}},Ts=new Qn,Ny=new ft;function Uy(i,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,Xh(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,T,v,x){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),h(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,x)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),_(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?l(m,d,T,v):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===cn&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===cn&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);let T=e.get(d),v=T.envMap,x=T.envMapRotation;v&&(m.envMap.value=v,Ts.copy(x),Ts.x*=-1,Ts.y*=-1,Ts.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Ts.y*=-1,Ts.z*=-1),m.envMapRotation.value.setFromMatrix4(Ny.makeRotationFromEuler(Ts)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,T,v){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*T,m.scale.value=v*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,T){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===cn&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function _(m,d){let T=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Fy(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(T,v){let x=v.program;n.uniformBlockBinding(T,x)}function c(T,v){let x=s[T.id];x===void 0&&(g(T),x=h(T),s[T.id]=x,T.addEventListener("dispose",m));let w=v.program;n.updateUBOMapping(T,w);let A=e.render.frame;r[T.id]!==A&&(f(T),r[T.id]=A)}function h(T){let v=u();T.__bindingPointIndex=v;let x=i.createBuffer(),w=T.__size,A=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,w,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,x),x}function u(){for(let T=0;T<a;T++)if(o.indexOf(T)===-1)return o.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(T){let v=s[T.id],x=T.uniforms,w=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let A=0,C=x.length;A<C;A++){let N=Array.isArray(x[A])?x[A]:[x[A]];for(let b=0,M=N.length;b<M;b++){let P=N[b];if(p(P,A,b,w)===!0){let G=P.__offset,X=Array.isArray(P.value)?P.value:[P.value],j=0;for(let H=0;H<X.length;H++){let V=X[H],ee=_(V);typeof V=="number"||typeof V=="boolean"?(P.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,G+j,P.__data)):V.isMatrix3?(P.__data[0]=V.elements[0],P.__data[1]=V.elements[1],P.__data[2]=V.elements[2],P.__data[3]=0,P.__data[4]=V.elements[3],P.__data[5]=V.elements[4],P.__data[6]=V.elements[5],P.__data[7]=0,P.__data[8]=V.elements[6],P.__data[9]=V.elements[7],P.__data[10]=V.elements[8],P.__data[11]=0):(V.toArray(P.__data,j),j+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,G,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(T,v,x,w){let A=T.value,C=v+"_"+x;if(w[C]===void 0)return typeof A=="number"||typeof A=="boolean"?w[C]=A:w[C]=A.clone(),!0;{let N=w[C];if(typeof A=="number"||typeof A=="boolean"){if(N!==A)return w[C]=A,!0}else if(N.equals(A)===!1)return N.copy(A),!0}return!1}function g(T){let v=T.uniforms,x=0,w=16;for(let C=0,N=v.length;C<N;C++){let b=Array.isArray(v[C])?v[C]:[v[C]];for(let M=0,P=b.length;M<P;M++){let G=b[M],X=Array.isArray(G.value)?G.value:[G.value];for(let j=0,H=X.length;j<H;j++){let V=X[j],ee=_(V),$=x%w,ue=$%ee.boundary,ye=$+ue;x+=ue,ye!==0&&w-ye<ee.storage&&(x+=w-ye),G.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=x,x+=ee.storage}}}let A=x%w;return A>0&&(x+=w-A),T.__size=x,T.__cache={},this}function _(T){let v={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(v.boundary=4,v.storage=4):T.isVector2?(v.boundary=8,v.storage=8):T.isVector3||T.isColor?(v.boundary=16,v.storage=12):T.isVector4?(v.boundary=16,v.storage=16):T.isMatrix3?(v.boundary=48,v.storage=48):T.isMatrix4?(v.boundary=64,v.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),v}function m(T){let v=T.target;v.removeEventListener("dispose",m);let x=o.indexOf(v.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function d(){for(let T in s)i.deleteBuffer(s[T]);o=[],s={},r={}}return{bind:l,update:c,dispose:d}}var wr=class{constructor(e={}){let{canvas:t=pf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let g=new Uint32Array(4),_=new Int32Array(4),m=null,d=null,T=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ci,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let x=this,w=!1;this._outputColorSpace=tn;let A=0,C=0,N=null,b=-1,M=null,P=new Lt,G=new Lt,X=null,j=new Ze(0),H=0,V=t.width,ee=t.height,$=1,ue=null,ye=null,Ee=new Lt(0,0,V,ee),We=new Lt(0,0,V,ee),Je=!1,nt=new fr,at=!1,Q=!1,ae=new ft,we=new L,Oe=new Lt,Ie={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ke=!1;function pt(){return N===null?$:1}let I=n;function oe(S,F){return t.getContext(S,F)}try{let S={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",W,!1),t.addEventListener("webglcontextrestored",ie,!1),t.addEventListener("webglcontextcreationerror",Y,!1),I===null){let F="webgl2";if(I=oe(F,S),I===null)throw oe(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let se,ne,te,xe,ce,ge,$e,Ve,R,y,O,q,re,K,De,pe,Pe,Ae,de,be,ze,Fe,Me,qe;function E(){se=new ex(I),se.init(),Fe=new Py(I,se),ne=new q_(I,se,e,Fe),te=new Cy(I,se),ne.reversedDepthBuffer&&f&&te.buffers.depth.setReversed(!0),xe=new ix(I),ce=new gy,ge=new Iy(I,se,te,ce,ne,Fe,xe),$e=new Z_(x),Ve=new Q_(x),R=new cg(I),Me=new X_(I,R),y=new tx(I,R,xe,Me),O=new rx(I,y,R,xe),de=new sx(I,ne,ge),pe=new Y_(ce),q=new my(x,$e,Ve,se,ne,Me,pe),re=new Uy(x,ce),K=new xy,De=new Ey(se),Ae=new W_(x,$e,Ve,te,O,p,l),Pe=new Ay(x,O,ne),qe=new Fy(I,xe,ne,te),be=new $_(I,se,xe),ze=new nx(I,se,xe),xe.programs=q.programs,x.capabilities=ne,x.extensions=se,x.properties=ce,x.renderLists=K,x.shadowMap=Pe,x.state=te,x.info=xe}E();let U=new cu(x,I);this.xr=U,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let S=se.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=se.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(S){S!==void 0&&($=S,this.setSize(V,ee,!1))},this.getSize=function(S){return S.set(V,ee)},this.setSize=function(S,F,Z=!0){if(U.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=S,ee=F,t.width=Math.floor(S*$),t.height=Math.floor(F*$),Z===!0&&(t.style.width=S+"px",t.style.height=F+"px"),this.setViewport(0,0,S,F)},this.getDrawingBufferSize=function(S){return S.set(V*$,ee*$).floor()},this.setDrawingBufferSize=function(S,F,Z){V=S,ee=F,$=Z,t.width=Math.floor(S*Z),t.height=Math.floor(F*Z),this.setViewport(0,0,S,F)},this.getCurrentViewport=function(S){return S.copy(P)},this.getViewport=function(S){return S.copy(Ee)},this.setViewport=function(S,F,Z,J){S.isVector4?Ee.set(S.x,S.y,S.z,S.w):Ee.set(S,F,Z,J),te.viewport(P.copy(Ee).multiplyScalar($).round())},this.getScissor=function(S){return S.copy(We)},this.setScissor=function(S,F,Z,J){S.isVector4?We.set(S.x,S.y,S.z,S.w):We.set(S,F,Z,J),te.scissor(G.copy(We).multiplyScalar($).round())},this.getScissorTest=function(){return Je},this.setScissorTest=function(S){te.setScissorTest(Je=S)},this.setOpaqueSort=function(S){ue=S},this.setTransparentSort=function(S){ye=S},this.getClearColor=function(S){return S.copy(Ae.getClearColor())},this.setClearColor=function(){Ae.setClearColor(...arguments)},this.getClearAlpha=function(){return Ae.getClearAlpha()},this.setClearAlpha=function(){Ae.setClearAlpha(...arguments)},this.clear=function(S=!0,F=!0,Z=!0){let J=0;if(S){let B=!1;if(N!==null){let me=N.texture.format;B=me===Pl||me===Il||me===Cl}if(B){let me=N.texture.type,Se=me===ti||me===Ki||me===yr||me===br||me===Al||me===Rl,Le=Ae.getClearColor(),Ce=Ae.getClearAlpha(),Ge=Le.r,Xe=Le.g,ke=Le.b;Se?(g[0]=Ge,g[1]=Xe,g[2]=ke,g[3]=Ce,I.clearBufferuiv(I.COLOR,0,g)):(_[0]=Ge,_[1]=Xe,_[2]=ke,_[3]=Ce,I.clearBufferiv(I.COLOR,0,_))}else J|=I.COLOR_BUFFER_BIT}F&&(J|=I.DEPTH_BUFFER_BIT),Z&&(J|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(J)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",W,!1),t.removeEventListener("webglcontextrestored",ie,!1),t.removeEventListener("webglcontextcreationerror",Y,!1),Ae.dispose(),K.dispose(),De.dispose(),ce.dispose(),$e.dispose(),Ve.dispose(),O.dispose(),Me.dispose(),qe.dispose(),q.dispose(),U.dispose(),U.removeEventListener("sessionstart",Ye),U.removeEventListener("sessionend",Be),st.stop()};function W(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function ie(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;let S=xe.autoReset,F=Pe.enabled,Z=Pe.autoUpdate,J=Pe.needsUpdate,B=Pe.type;E(),xe.autoReset=S,Pe.enabled=F,Pe.autoUpdate=Z,Pe.needsUpdate=J,Pe.type=B}function Y(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function z(S){let F=S.target;F.removeEventListener("dispose",z),fe(F)}function fe(S){he(S),ce.remove(S)}function he(S){let F=ce.get(S).programs;F!==void 0&&(F.forEach(function(Z){q.releaseProgram(Z)}),S.isShaderMaterial&&q.releaseShaderCache(S))}this.renderBufferDirect=function(S,F,Z,J,B,me){F===null&&(F=Ie);let Se=B.isMesh&&B.matrixWorld.determinant()<0,Le=xp(S,F,Z,J,B);te.setMaterial(J,Se);let Ce=Z.index,Ge=1;if(J.wireframe===!0){if(Ce=y.getWireframeAttribute(Z),Ce===void 0)return;Ge=2}let Xe=Z.drawRange,ke=Z.attributes.position,rt=Xe.start*Ge,yt=(Xe.start+Xe.count)*Ge;me!==null&&(rt=Math.max(rt,me.start*Ge),yt=Math.min(yt,(me.start+me.count)*Ge)),Ce!==null?(rt=Math.max(rt,0),yt=Math.min(yt,Ce.count)):ke!=null&&(rt=Math.max(rt,0),yt=Math.min(yt,ke.count));let Nt=yt-rt;if(Nt<0||Nt===1/0)return;Me.setup(B,J,Le,Z,Ce);let Tt,Mt=be;if(Ce!==null&&(Tt=R.get(Ce),Mt=ze,Mt.setIndex(Tt)),B.isMesh)J.wireframe===!0?(te.setLineWidth(J.wireframeLinewidth*pt()),Mt.setMode(I.LINES)):Mt.setMode(I.TRIANGLES);else if(B.isLine){let He=J.linewidth;He===void 0&&(He=1),te.setLineWidth(He*pt()),B.isLineSegments?Mt.setMode(I.LINES):B.isLineLoop?Mt.setMode(I.LINE_LOOP):Mt.setMode(I.LINE_STRIP)}else B.isPoints?Mt.setMode(I.POINTS):B.isSprite&&Mt.setMode(I.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)lr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Mt.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(se.get("WEBGL_multi_draw"))Mt.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{let He=B._multiDrawStarts,Ct=B._multiDrawCounts,ht=B._multiDrawCount,bn=Ce?R.get(Ce).bytesPerElement:1,Ns=ce.get(J).currentProgram.getUniforms();for(let Mn=0;Mn<ht;Mn++)Ns.setValue(I,"_gl_DrawID",Mn),Mt.render(He[Mn]/bn,Ct[Mn])}else if(B.isInstancedMesh)Mt.renderInstances(rt,Nt,B.count);else if(Z.isInstancedBufferGeometry){let He=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,Ct=Math.min(Z.instanceCount,He);Mt.renderInstances(rt,Nt,Ct)}else Mt.render(rt,Nt)};function Re(S,F,Z){S.transparent===!0&&S.side===mi&&S.forceSinglePass===!1?(S.side=cn,S.needsUpdate=!0,Yo(S,F,Z),S.side=Ai,S.needsUpdate=!0,Yo(S,F,Z),S.side=mi):Yo(S,F,Z)}this.compile=function(S,F,Z=null){Z===null&&(Z=S),d=De.get(Z),d.init(F),v.push(d),Z.traverseVisible(function(B){B.isLight&&B.layers.test(F.layers)&&(d.pushLight(B),B.castShadow&&d.pushShadow(B))}),S!==Z&&S.traverseVisible(function(B){B.isLight&&B.layers.test(F.layers)&&(d.pushLight(B),B.castShadow&&d.pushShadow(B))}),d.setupLights();let J=new Set;return S.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;let me=B.material;if(me)if(Array.isArray(me))for(let Se=0;Se<me.length;Se++){let Le=me[Se];Re(Le,Z,B),J.add(Le)}else Re(me,Z,B),J.add(me)}),d=v.pop(),J},this.compileAsync=function(S,F,Z=null){let J=this.compile(S,F,Z);return new Promise(B=>{function me(){if(J.forEach(function(Se){ce.get(Se).currentProgram.isReady()&&J.delete(Se)}),J.size===0){B(S);return}setTimeout(me,10)}se.get("KHR_parallel_shader_compile")!==null?me():setTimeout(me,10)})};let Ue=null;function Te(S){Ue&&Ue(S)}function Ye(){st.stop()}function Be(){st.start()}let st=new qf;st.setAnimationLoop(Te),typeof self<"u"&&st.setContext(self),this.setAnimationLoop=function(S){Ue=S,U.setAnimationLoop(S),S===null?st.stop():st.start()},U.addEventListener("sessionstart",Ye),U.addEventListener("sessionend",Be),this.render=function(S,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),U.enabled===!0&&U.isPresenting===!0&&(U.cameraAutoUpdate===!0&&U.updateCamera(F),F=U.getCamera()),S.isScene===!0&&S.onBeforeRender(x,S,F,N),d=De.get(S,v.length),d.init(F),v.push(d),ae.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),nt.setFromProjectionMatrix(ae,Jn,F.reversedDepth),Q=this.localClippingEnabled,at=pe.init(this.clippingPlanes,Q),m=K.get(S,T.length),m.init(),T.push(m),U.enabled===!0&&U.isPresenting===!0){let me=x.xr.getDepthSensingMesh();me!==null&&ct(me,F,-1/0,x.sortObjects)}ct(S,F,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(ue,ye),Ke=U.enabled===!1||U.isPresenting===!1||U.hasDepthSensing()===!1,Ke&&Ae.addToRenderList(m,S),this.info.render.frame++,at===!0&&pe.beginShadows();let Z=d.state.shadowsArray;Pe.render(Z,S,F),at===!0&&pe.endShadows(),this.info.autoReset===!0&&this.info.reset();let J=m.opaque,B=m.transmissive;if(d.setupLights(),F.isArrayCamera){let me=F.cameras;if(B.length>0)for(let Se=0,Le=me.length;Se<Le;Se++){let Ce=me[Se];is(J,B,S,Ce)}Ke&&Ae.render(S);for(let Se=0,Le=me.length;Se<Le;Se++){let Ce=me[Se];mn(m,S,Ce,Ce.viewport)}}else B.length>0&&is(J,B,S,F),Ke&&Ae.render(S),mn(m,S,F);N!==null&&C===0&&(ge.updateMultisampleRenderTarget(N),ge.updateRenderTargetMipmap(N)),S.isScene===!0&&S.onAfterRender(x,S,F),Me.resetDefaultState(),b=-1,M=null,v.pop(),v.length>0?(d=v[v.length-1],at===!0&&pe.setGlobalState(x.clippingPlanes,d.state.camera)):d=null,T.pop(),T.length>0?m=T[T.length-1]:m=null};function ct(S,F,Z,J){if(S.visible===!1)return;if(S.layers.test(F.layers)){if(S.isGroup)Z=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(F);else if(S.isLight)d.pushLight(S),S.castShadow&&d.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||nt.intersectsSprite(S)){J&&Oe.setFromMatrixPosition(S.matrixWorld).applyMatrix4(ae);let Se=O.update(S),Le=S.material;Le.visible&&m.push(S,Se,Le,Z,Oe.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||nt.intersectsObject(S))){let Se=O.update(S),Le=S.material;if(J&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Oe.copy(S.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),Oe.copy(Se.boundingSphere.center)),Oe.applyMatrix4(S.matrixWorld).applyMatrix4(ae)),Array.isArray(Le)){let Ce=Se.groups;for(let Ge=0,Xe=Ce.length;Ge<Xe;Ge++){let ke=Ce[Ge],rt=Le[ke.materialIndex];rt&&rt.visible&&m.push(S,Se,rt,Z,Oe.z,ke)}}else Le.visible&&m.push(S,Se,Le,Z,Oe.z,null)}}let me=S.children;for(let Se=0,Le=me.length;Se<Le;Se++)ct(me[Se],F,Z,J)}function mn(S,F,Z,J){let B=S.opaque,me=S.transmissive,Se=S.transparent;d.setupLightsView(Z),at===!0&&pe.setGlobalState(x.clippingPlanes,Z),J&&te.viewport(P.copy(J)),B.length>0&&oi(B,F,Z),me.length>0&&oi(me,F,Z),Se.length>0&&oi(Se,F,Z),te.buffers.depth.setTest(!0),te.buffers.depth.setMask(!0),te.buffers.color.setMask(!0),te.setPolygonOffset(!1)}function is(S,F,Z,J){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[J.id]===void 0&&(d.state.transmissionRenderTarget[J.id]=new ui(1,1,{generateMipmaps:!0,type:se.has("EXT_color_buffer_half_float")||se.has("EXT_color_buffer_float")?vr:ti,minFilter:Ji,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:lt.workingColorSpace}));let me=d.state.transmissionRenderTarget[J.id],Se=J.viewport||P;me.setSize(Se.z*x.transmissionResolutionScale,Se.w*x.transmissionResolutionScale);let Le=x.getRenderTarget(),Ce=x.getActiveCubeFace(),Ge=x.getActiveMipmapLevel();x.setRenderTarget(me),x.getClearColor(j),H=x.getClearAlpha(),H<1&&x.setClearColor(16777215,.5),x.clear(),Ke&&Ae.render(Z);let Xe=x.toneMapping;x.toneMapping=Ci;let ke=J.viewport;if(J.viewport!==void 0&&(J.viewport=void 0),d.setupLightsView(J),at===!0&&pe.setGlobalState(x.clippingPlanes,J),oi(S,Z,J),ge.updateMultisampleRenderTarget(me),ge.updateRenderTargetMipmap(me),se.has("WEBGL_multisampled_render_to_texture")===!1){let rt=!1;for(let yt=0,Nt=F.length;yt<Nt;yt++){let Tt=F[yt],Mt=Tt.object,He=Tt.geometry,Ct=Tt.material,ht=Tt.group;if(Ct.side===mi&&Mt.layers.test(J.layers)){let bn=Ct.side;Ct.side=cn,Ct.needsUpdate=!0,Cu(Mt,Z,J,He,Ct,ht),Ct.side=bn,Ct.needsUpdate=!0,rt=!0}}rt===!0&&(ge.updateMultisampleRenderTarget(me),ge.updateRenderTargetMipmap(me))}x.setRenderTarget(Le,Ce,Ge),x.setClearColor(j,H),ke!==void 0&&(J.viewport=ke),x.toneMapping=Xe}function oi(S,F,Z){let J=F.isScene===!0?F.overrideMaterial:null;for(let B=0,me=S.length;B<me;B++){let Se=S[B],Le=Se.object,Ce=Se.geometry,Ge=Se.group,Xe=Se.material;Xe.allowOverride===!0&&J!==null&&(Xe=J),Le.layers.test(Z.layers)&&Cu(Le,F,Z,Ce,Xe,Ge)}}function Cu(S,F,Z,J,B,me){S.onBeforeRender(x,F,Z,J,B,me),S.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),B.onBeforeRender(x,F,Z,J,S,me),B.transparent===!0&&B.side===mi&&B.forceSinglePass===!1?(B.side=cn,B.needsUpdate=!0,x.renderBufferDirect(Z,F,J,B,S,me),B.side=Ai,B.needsUpdate=!0,x.renderBufferDirect(Z,F,J,B,S,me),B.side=mi):x.renderBufferDirect(Z,F,J,B,S,me),S.onAfterRender(x,F,Z,J,B,me)}function Yo(S,F,Z){F.isScene!==!0&&(F=Ie);let J=ce.get(S),B=d.state.lights,me=d.state.shadowsArray,Se=B.state.version,Le=q.getParameters(S,B.state,me,F,Z),Ce=q.getProgramCacheKey(Le),Ge=J.programs;J.environment=S.isMeshStandardMaterial?F.environment:null,J.fog=F.fog,J.envMap=(S.isMeshStandardMaterial?Ve:$e).get(S.envMap||J.environment),J.envMapRotation=J.environment!==null&&S.envMap===null?F.environmentRotation:S.envMapRotation,Ge===void 0&&(S.addEventListener("dispose",z),Ge=new Map,J.programs=Ge);let Xe=Ge.get(Ce);if(Xe!==void 0){if(J.currentProgram===Xe&&J.lightsStateVersion===Se)return Pu(S,Le),Xe}else Le.uniforms=q.getUniforms(S),S.onBeforeCompile(Le,x),Xe=q.acquireProgram(Le,Ce),Ge.set(Ce,Xe),J.uniforms=Le.uniforms;let ke=J.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(ke.clippingPlanes=pe.uniform),Pu(S,Le),J.needsLights=vp(S),J.lightsStateVersion=Se,J.needsLights&&(ke.ambientLightColor.value=B.state.ambient,ke.lightProbe.value=B.state.probe,ke.directionalLights.value=B.state.directional,ke.directionalLightShadows.value=B.state.directionalShadow,ke.spotLights.value=B.state.spot,ke.spotLightShadows.value=B.state.spotShadow,ke.rectAreaLights.value=B.state.rectArea,ke.ltc_1.value=B.state.rectAreaLTC1,ke.ltc_2.value=B.state.rectAreaLTC2,ke.pointLights.value=B.state.point,ke.pointLightShadows.value=B.state.pointShadow,ke.hemisphereLights.value=B.state.hemi,ke.directionalShadowMap.value=B.state.directionalShadowMap,ke.directionalShadowMatrix.value=B.state.directionalShadowMatrix,ke.spotShadowMap.value=B.state.spotShadowMap,ke.spotLightMatrix.value=B.state.spotLightMatrix,ke.spotLightMap.value=B.state.spotLightMap,ke.pointShadowMap.value=B.state.pointShadowMap,ke.pointShadowMatrix.value=B.state.pointShadowMatrix),J.currentProgram=Xe,J.uniformsList=null,Xe}function Iu(S){if(S.uniformsList===null){let F=S.currentProgram.getUniforms();S.uniformsList=Tr.seqWithValue(F.seq,S.uniforms)}return S.uniformsList}function Pu(S,F){let Z=ce.get(S);Z.outputColorSpace=F.outputColorSpace,Z.batching=F.batching,Z.batchingColor=F.batchingColor,Z.instancing=F.instancing,Z.instancingColor=F.instancingColor,Z.instancingMorph=F.instancingMorph,Z.skinning=F.skinning,Z.morphTargets=F.morphTargets,Z.morphNormals=F.morphNormals,Z.morphColors=F.morphColors,Z.morphTargetsCount=F.morphTargetsCount,Z.numClippingPlanes=F.numClippingPlanes,Z.numIntersection=F.numClipIntersection,Z.vertexAlphas=F.vertexAlphas,Z.vertexTangents=F.vertexTangents,Z.toneMapping=F.toneMapping}function xp(S,F,Z,J,B){F.isScene!==!0&&(F=Ie),ge.resetTextureUnits();let me=F.fog,Se=J.isMeshStandardMaterial?F.environment:null,Le=N===null?x.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:ps,Ce=(J.isMeshStandardMaterial?Ve:$e).get(J.envMap||Se),Ge=J.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,Xe=!!Z.attributes.tangent&&(!!J.normalMap||J.anisotropy>0),ke=!!Z.morphAttributes.position,rt=!!Z.morphAttributes.normal,yt=!!Z.morphAttributes.color,Nt=Ci;J.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(Nt=x.toneMapping);let Tt=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Mt=Tt!==void 0?Tt.length:0,He=ce.get(J),Ct=d.state.lights;if(at===!0&&(Q===!0||S!==M)){let an=S===M&&J.id===b;pe.setState(J,S,an)}let ht=!1;J.version===He.__version?(He.needsLights&&He.lightsStateVersion!==Ct.state.version||He.outputColorSpace!==Le||B.isBatchedMesh&&He.batching===!1||!B.isBatchedMesh&&He.batching===!0||B.isBatchedMesh&&He.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&He.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&He.instancing===!1||!B.isInstancedMesh&&He.instancing===!0||B.isSkinnedMesh&&He.skinning===!1||!B.isSkinnedMesh&&He.skinning===!0||B.isInstancedMesh&&He.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&He.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&He.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&He.instancingMorph===!1&&B.morphTexture!==null||He.envMap!==Ce||J.fog===!0&&He.fog!==me||He.numClippingPlanes!==void 0&&(He.numClippingPlanes!==pe.numPlanes||He.numIntersection!==pe.numIntersection)||He.vertexAlphas!==Ge||He.vertexTangents!==Xe||He.morphTargets!==ke||He.morphNormals!==rt||He.morphColors!==yt||He.toneMapping!==Nt||He.morphTargetsCount!==Mt)&&(ht=!0):(ht=!0,He.__version=J.version);let bn=He.currentProgram;ht===!0&&(bn=Yo(J,F,B));let Ns=!1,Mn=!1,Ur=!1,It=bn.getUniforms(),Dn=He.uniforms;if(te.useProgram(bn.program)&&(Ns=!0,Mn=!0,Ur=!0),J.id!==b&&(b=J.id,Mn=!0),Ns||M!==S){te.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),It.setValue(I,"projectionMatrix",S.projectionMatrix),It.setValue(I,"viewMatrix",S.matrixWorldInverse);let gn=It.map.cameraPosition;gn!==void 0&&gn.setValue(I,we.setFromMatrixPosition(S.matrixWorld)),ne.logarithmicDepthBuffer&&It.setValue(I,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(J.isMeshPhongMaterial||J.isMeshToonMaterial||J.isMeshLambertMaterial||J.isMeshBasicMaterial||J.isMeshStandardMaterial||J.isShaderMaterial)&&It.setValue(I,"isOrthographic",S.isOrthographicCamera===!0),M!==S&&(M=S,Mn=!0,Ur=!0)}if(B.isSkinnedMesh){It.setOptional(I,B,"bindMatrix"),It.setOptional(I,B,"bindMatrixInverse");let an=B.skeleton;an&&(an.boneTexture===null&&an.computeBoneTexture(),It.setValue(I,"boneTexture",an.boneTexture,ge))}B.isBatchedMesh&&(It.setOptional(I,B,"batchingTexture"),It.setValue(I,"batchingTexture",B._matricesTexture,ge),It.setOptional(I,B,"batchingIdTexture"),It.setValue(I,"batchingIdTexture",B._indirectTexture,ge),It.setOptional(I,B,"batchingColorTexture"),B._colorsTexture!==null&&It.setValue(I,"batchingColorTexture",B._colorsTexture,ge));let Ln=Z.morphAttributes;if((Ln.position!==void 0||Ln.normal!==void 0||Ln.color!==void 0)&&de.update(B,Z,bn),(Mn||He.receiveShadow!==B.receiveShadow)&&(He.receiveShadow=B.receiveShadow,It.setValue(I,"receiveShadow",B.receiveShadow)),J.isMeshGouraudMaterial&&J.envMap!==null&&(Dn.envMap.value=Ce,Dn.flipEnvMap.value=Ce.isCubeTexture&&Ce.isRenderTargetTexture===!1?-1:1),J.isMeshStandardMaterial&&J.envMap===null&&F.environment!==null&&(Dn.envMapIntensity.value=F.environmentIntensity),Mn&&(It.setValue(I,"toneMappingExposure",x.toneMappingExposure),He.needsLights&&yp(Dn,Ur),me&&J.fog===!0&&re.refreshFogUniforms(Dn,me),re.refreshMaterialUniforms(Dn,J,$,ee,d.state.transmissionRenderTarget[S.id]),Tr.upload(I,Iu(He),Dn,ge)),J.isShaderMaterial&&J.uniformsNeedUpdate===!0&&(Tr.upload(I,Iu(He),Dn,ge),J.uniformsNeedUpdate=!1),J.isSpriteMaterial&&It.setValue(I,"center",B.center),It.setValue(I,"modelViewMatrix",B.modelViewMatrix),It.setValue(I,"normalMatrix",B.normalMatrix),It.setValue(I,"modelMatrix",B.matrixWorld),J.isShaderMaterial||J.isRawShaderMaterial){let an=J.uniformsGroups;for(let gn=0,wc=an.length;gn<wc;gn++){let ss=an[gn];qe.update(ss,bn),qe.bind(ss,bn)}}return bn}function yp(S,F){S.ambientLightColor.needsUpdate=F,S.lightProbe.needsUpdate=F,S.directionalLights.needsUpdate=F,S.directionalLightShadows.needsUpdate=F,S.pointLights.needsUpdate=F,S.pointLightShadows.needsUpdate=F,S.spotLights.needsUpdate=F,S.spotLightShadows.needsUpdate=F,S.rectAreaLights.needsUpdate=F,S.hemisphereLights.needsUpdate=F}function vp(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(S,F,Z){let J=ce.get(S);J.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,J.__autoAllocateDepthBuffer===!1&&(J.__useRenderToTexture=!1),ce.get(S.texture).__webglTexture=F,ce.get(S.depthTexture).__webglTexture=J.__autoAllocateDepthBuffer?void 0:Z,J.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,F){let Z=ce.get(S);Z.__webglFramebuffer=F,Z.__useDefaultFramebuffer=F===void 0};let bp=I.createFramebuffer();this.setRenderTarget=function(S,F=0,Z=0){N=S,A=F,C=Z;let J=!0,B=null,me=!1,Se=!1;if(S){let Ce=ce.get(S);if(Ce.__useDefaultFramebuffer!==void 0)te.bindFramebuffer(I.FRAMEBUFFER,null),J=!1;else if(Ce.__webglFramebuffer===void 0)ge.setupRenderTarget(S);else if(Ce.__hasExternalTextures)ge.rebindTextures(S,ce.get(S.texture).__webglTexture,ce.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let ke=S.depthTexture;if(Ce.__boundDepthTexture!==ke){if(ke!==null&&ce.has(ke)&&(S.width!==ke.image.width||S.height!==ke.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ge.setupDepthRenderbuffer(S)}}let Ge=S.texture;(Ge.isData3DTexture||Ge.isDataArrayTexture||Ge.isCompressedArrayTexture)&&(Se=!0);let Xe=ce.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Xe[F])?B=Xe[F][Z]:B=Xe[F],me=!0):S.samples>0&&ge.useMultisampledRTT(S)===!1?B=ce.get(S).__webglMultisampledFramebuffer:Array.isArray(Xe)?B=Xe[Z]:B=Xe,P.copy(S.viewport),G.copy(S.scissor),X=S.scissorTest}else P.copy(Ee).multiplyScalar($).floor(),G.copy(We).multiplyScalar($).floor(),X=Je;if(Z!==0&&(B=bp),te.bindFramebuffer(I.FRAMEBUFFER,B)&&J&&te.drawBuffers(S,B),te.viewport(P),te.scissor(G),te.setScissorTest(X),me){let Ce=ce.get(S.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+F,Ce.__webglTexture,Z)}else if(Se){let Ce=F;for(let Ge=0;Ge<S.textures.length;Ge++){let Xe=ce.get(S.textures[Ge]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Ge,Xe.__webglTexture,Z,Ce)}}else if(S!==null&&Z!==0){let Ce=ce.get(S.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ce.__webglTexture,Z)}b=-1},this.readRenderTargetPixels=function(S,F,Z,J,B,me,Se,Le=0){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=ce.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Se!==void 0&&(Ce=Ce[Se]),Ce){te.bindFramebuffer(I.FRAMEBUFFER,Ce);try{let Ge=S.textures[Le],Xe=Ge.format,ke=Ge.type;if(!ne.textureFormatReadable(Xe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ne.textureTypeReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=S.width-J&&Z>=0&&Z<=S.height-B&&(S.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Le),I.readPixels(F,Z,J,B,Fe.convert(Xe),Fe.convert(ke),me))}finally{let Ge=N!==null?ce.get(N).__webglFramebuffer:null;te.bindFramebuffer(I.FRAMEBUFFER,Ge)}}},this.readRenderTargetPixelsAsync=async function(S,F,Z,J,B,me,Se,Le=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=ce.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Se!==void 0&&(Ce=Ce[Se]),Ce)if(F>=0&&F<=S.width-J&&Z>=0&&Z<=S.height-B){te.bindFramebuffer(I.FRAMEBUFFER,Ce);let Ge=S.textures[Le],Xe=Ge.format,ke=Ge.type;if(!ne.textureFormatReadable(Xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ne.textureTypeReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let rt=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,rt),I.bufferData(I.PIXEL_PACK_BUFFER,me.byteLength,I.STREAM_READ),S.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Le),I.readPixels(F,Z,J,B,Fe.convert(Xe),Fe.convert(ke),0);let yt=N!==null?ce.get(N).__webglFramebuffer:null;te.bindFramebuffer(I.FRAMEBUFFER,yt);let Nt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await mf(I,Nt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,rt),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,me),I.deleteBuffer(rt),I.deleteSync(Nt),me}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,F=null,Z=0){let J=Math.pow(2,-Z),B=Math.floor(S.image.width*J),me=Math.floor(S.image.height*J),Se=F!==null?F.x:0,Le=F!==null?F.y:0;ge.setTexture2D(S,0),I.copyTexSubImage2D(I.TEXTURE_2D,Z,0,0,Se,Le,B,me),te.unbindTexture()};let Mp=I.createFramebuffer(),Sp=I.createFramebuffer();this.copyTextureToTexture=function(S,F,Z=null,J=null,B=0,me=null){me===null&&(B!==0?(lr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),me=B,B=0):me=0);let Se,Le,Ce,Ge,Xe,ke,rt,yt,Nt,Tt=S.isCompressedTexture?S.mipmaps[me]:S.image;if(Z!==null)Se=Z.max.x-Z.min.x,Le=Z.max.y-Z.min.y,Ce=Z.isBox3?Z.max.z-Z.min.z:1,Ge=Z.min.x,Xe=Z.min.y,ke=Z.isBox3?Z.min.z:0;else{let Ln=Math.pow(2,-B);Se=Math.floor(Tt.width*Ln),Le=Math.floor(Tt.height*Ln),S.isDataArrayTexture?Ce=Tt.depth:S.isData3DTexture?Ce=Math.floor(Tt.depth*Ln):Ce=1,Ge=0,Xe=0,ke=0}J!==null?(rt=J.x,yt=J.y,Nt=J.z):(rt=0,yt=0,Nt=0);let Mt=Fe.convert(F.format),He=Fe.convert(F.type),Ct;F.isData3DTexture?(ge.setTexture3D(F,0),Ct=I.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(ge.setTexture2DArray(F,0),Ct=I.TEXTURE_2D_ARRAY):(ge.setTexture2D(F,0),Ct=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,F.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,F.unpackAlignment);let ht=I.getParameter(I.UNPACK_ROW_LENGTH),bn=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Ns=I.getParameter(I.UNPACK_SKIP_PIXELS),Mn=I.getParameter(I.UNPACK_SKIP_ROWS),Ur=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,Tt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Tt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ge),I.pixelStorei(I.UNPACK_SKIP_ROWS,Xe),I.pixelStorei(I.UNPACK_SKIP_IMAGES,ke);let It=S.isDataArrayTexture||S.isData3DTexture,Dn=F.isDataArrayTexture||F.isData3DTexture;if(S.isDepthTexture){let Ln=ce.get(S),an=ce.get(F),gn=ce.get(Ln.__renderTarget),wc=ce.get(an.__renderTarget);te.bindFramebuffer(I.READ_FRAMEBUFFER,gn.__webglFramebuffer),te.bindFramebuffer(I.DRAW_FRAMEBUFFER,wc.__webglFramebuffer);for(let ss=0;ss<Ce;ss++)It&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ce.get(S).__webglTexture,B,ke+ss),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ce.get(F).__webglTexture,me,Nt+ss)),I.blitFramebuffer(Ge,Xe,Se,Le,rt,yt,Se,Le,I.DEPTH_BUFFER_BIT,I.NEAREST);te.bindFramebuffer(I.READ_FRAMEBUFFER,null),te.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(B!==0||S.isRenderTargetTexture||ce.has(S)){let Ln=ce.get(S),an=ce.get(F);te.bindFramebuffer(I.READ_FRAMEBUFFER,Mp),te.bindFramebuffer(I.DRAW_FRAMEBUFFER,Sp);for(let gn=0;gn<Ce;gn++)It?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ln.__webglTexture,B,ke+gn):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ln.__webglTexture,B),Dn?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,an.__webglTexture,me,Nt+gn):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,an.__webglTexture,me),B!==0?I.blitFramebuffer(Ge,Xe,Se,Le,rt,yt,Se,Le,I.COLOR_BUFFER_BIT,I.NEAREST):Dn?I.copyTexSubImage3D(Ct,me,rt,yt,Nt+gn,Ge,Xe,Se,Le):I.copyTexSubImage2D(Ct,me,rt,yt,Ge,Xe,Se,Le);te.bindFramebuffer(I.READ_FRAMEBUFFER,null),te.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else Dn?S.isDataTexture||S.isData3DTexture?I.texSubImage3D(Ct,me,rt,yt,Nt,Se,Le,Ce,Mt,He,Tt.data):F.isCompressedArrayTexture?I.compressedTexSubImage3D(Ct,me,rt,yt,Nt,Se,Le,Ce,Mt,Tt.data):I.texSubImage3D(Ct,me,rt,yt,Nt,Se,Le,Ce,Mt,He,Tt):S.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,me,rt,yt,Se,Le,Mt,He,Tt.data):S.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,me,rt,yt,Tt.width,Tt.height,Mt,Tt.data):I.texSubImage2D(I.TEXTURE_2D,me,rt,yt,Se,Le,Mt,He,Tt);I.pixelStorei(I.UNPACK_ROW_LENGTH,ht),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,bn),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ns),I.pixelStorei(I.UNPACK_SKIP_ROWS,Mn),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Ur),me===0&&F.generateMipmaps&&I.generateMipmap(Ct),te.unbindTexture()},this.initRenderTarget=function(S){ce.get(S).__webglFramebuffer===void 0&&ge.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?ge.setTextureCube(S,0):S.isData3DTexture?ge.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?ge.setTexture2DArray(S,0):ge.setTexture2D(S,0),te.unbindTexture()},this.resetState=function(){A=0,C=0,N=null,te.reset(),Me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=lt._getDrawingBufferColorSpace(e),t.unpackColorSpace=lt._getUnpackColorSpace()}};function Qf(i,e,t){let n=new wr({alpha:!0,antialias:!0});n.setPixelRatio(Math.min(devicePixelRatio,2)),n.setSize(112,112),i.prepend(n.domElement);let s=n.domElement;s.tabIndex=0,s.setAttribute("role","img"),s.setAttribute("aria-label","View cube: click a face, edge or corner; drag to rotate. Arrow keys rotate, Home restores perspective. / \u89C6\u56FE\u7ACB\u65B9\u4F53\uFF1A\u70B9\u51FB\u9762\u3001\u8FB9\u3001\u89D2\u6216\u62D6\u52A8\u65CB\u8F6C");let r=new gs,o=new Yt(32,1,.1,20);o.up.set(0,0,1);let a=["RIGHT","LEFT","BACK","FRONT","TOP","BOTTOM"],l=["\u53F3","\u5DE6","\u540E","\u524D","\u9876","\u5E95"],c="",h=a.map(()=>{let v=document.createElement("canvas");return v.width=v.height=128,new Wi(v)}),u=h.map(v=>new sn({map:v})),f=new _t(new jt(1,1,1),u);r.add(f),r.add(new _s(new po(f.geometry),new wn({color:14795132})));let p=new Po,g=new le,_=null,m=!1;function d(v){let x=e.position.distanceTo(t.target);e.position.copy(t.target).add(v.normalize().multiplyScalar(x)),e.lookAt(t.target),t.update()}function T(v,x){let w=new Yi().setFromVector3(e.position.clone().sub(t.target).applyAxisAngle(new L(1,0,0),-Math.PI/2));w.theta-=v,w.phi=Math.max(.001,Math.min(Math.PI-.001,w.phi+x)),d(new L().setFromSpherical(w).applyAxisAngle(new L(1,0,0),Math.PI/2))}return s.addEventListener("pointerdown",v=>{_={x:v.clientX,y:v.clientY,lastX:v.clientX,lastY:v.clientY},m=!1,s.setPointerCapture(v.pointerId)}),s.addEventListener("pointermove",v=>{_&&(Math.hypot(v.clientX-_.x,v.clientY-_.y)>4&&(m=!0),m&&T((v.clientX-_.lastX)*.012,(v.clientY-_.lastY)*.012),_.lastX=v.clientX,_.lastY=v.clientY)}),s.addEventListener("pointerup",v=>{if(_){if(!m){let x=s.getBoundingClientRect();g.set((v.clientX-x.left)/x.width*2-1,-(v.clientY-x.top)/x.height*2+1),p.setFromCamera(g,o);let w=p.intersectObject(f)[0];if(w){let A=w.point,C=new L(...[A.x,A.y,A.z].map(N=>Math.abs(N)>.34?Math.sign(N):0));Math.abs(C.z)===1&&C.x===0&&C.y===0&&(C.y=-.001),d(C)}}_=null}}),s.addEventListener("pointercancel",()=>{_=null}),s.addEventListener("keydown",v=>{["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","Enter"].includes(v.key)&&(v.preventDefault(),v.key==="Home"?d(new L(430,-645,445)):v.key==="Enter"?d(new L(0,-1,0)):T(v.key==="ArrowLeft"?Math.PI/2:v.key==="ArrowRight"?-Math.PI/2:0,v.key==="ArrowUp"?-.35:v.key==="ArrowDown"?.35:0))}),{update(){c!==document.documentElement.lang&&(c=document.documentElement.lang,h.forEach((v,x)=>{let w=v.image.getContext("2d");w.fillStyle="#304878",w.fillRect(0,0,128,128),w.strokeStyle="#e1c17c",w.lineWidth=5,w.strokeRect(3,3,122,122),w.fillStyle="#fff1cc",w.font="bold 21px Segoe UI",w.textAlign="center",w.textBaseline="middle",w.fillText(c==="zh"?l[x]:a[x],64,64),v.needsUpdate=!0})),o.position.copy(e.position).sub(t.target).normalize().multiplyScalar(3.6),o.lookAt(0,0,0),n.render(r,o)}}}var ep={type:"change"},du={type:"start"},np={type:"end"},uc=new Vi,tp=new On,Oy=Math.cos(70*Gh.DEG2RAD),Wt=new L,yn=2*Math.PI,vt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},uu=1e-6,dc=class extends No{constructor(e,t=null){super(e,t),this.state=vt.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Zi.ROTATE,MIDDLE:Zi.DOLLY,RIGHT:Zi.PAN},this.touches={ONE:ji.ROTATE,TWO:ji.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new kn,this._lastTargetPosition=new L,this._quat=new kn().setFromUnitVectors(e.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Yi,this._sphericalDelta=new Yi,this._scale=1,this._panOffset=new L,this._rotateStart=new le,this._rotateEnd=new le,this._rotateDelta=new le,this._panStart=new le,this._panEnd=new le,this._panDelta=new le,this._dollyStart=new le,this._dollyEnd=new le,this._dollyDelta=new le,this._dollyDirection=new L,this._mouse=new le,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=ky.bind(this),this._onPointerDown=By.bind(this),this._onPointerUp=zy.bind(this),this._onContextMenu=qy.bind(this),this._onMouseWheel=Gy.bind(this),this._onKeyDown=Wy.bind(this),this._onTouchStart=Xy.bind(this),this._onTouchMove=$y.bind(this),this._onMouseDown=Hy.bind(this),this._onMouseMove=Vy.bind(this),this._interceptControlDown=Yy.bind(this),this._interceptControlUp=Zy.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(ep),this.update(),this.state=vt.NONE}update(e=null){let t=this.object.position;Wt.copy(t).sub(this.target),Wt.applyQuaternion(this._quat),this._spherical.setFromVector3(Wt),this.autoRotate&&this.state===vt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=yn:n>Math.PI&&(n-=yn),s<-Math.PI?s+=yn:s>Math.PI&&(s-=yn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Wt.setFromSpherical(this._spherical),Wt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Wt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Wt.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new L(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new L(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Wt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(uc.origin.copy(this.object.position),uc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(uc.direction))<Oy?this.object.lookAt(this.target):(tp.setFromNormalAndCoplanarPoint(this.object.up,this.target),uc.intersectPlane(tp,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>uu||8*(1-this._lastQuaternion.dot(this.object.quaternion))>uu||this._lastTargetPosition.distanceToSquared(this.target)>uu?(this.dispatchEvent(ep),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?yn/60*this.autoRotateSpeed*e:yn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Wt.setFromMatrixColumn(t,0),Wt.multiplyScalar(-e),this._panOffset.add(Wt)}_panUp(e,t){this.screenSpacePanning===!0?Wt.setFromMatrixColumn(t,1):(Wt.setFromMatrixColumn(t,0),Wt.crossVectors(this.object.up,Wt)),Wt.multiplyScalar(e),this._panOffset.add(Wt)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Wt.copy(s).sub(this.target);let r=Wt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(yn*this._rotateDelta.x/t.clientHeight),this._rotateUp(yn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(yn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-yn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(yn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-yn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(yn*this._rotateDelta.x/t.clientHeight),this._rotateUp(yn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new le,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function By(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function ky(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function zy(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(np),this.state=vt.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Hy(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Zi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=vt.DOLLY;break;case Zi.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=vt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=vt.ROTATE}break;case Zi.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=vt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=vt.PAN}break;default:this.state=vt.NONE}this.state!==vt.NONE&&this.dispatchEvent(du)}function Vy(i){switch(this.state){case vt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case vt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case vt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Gy(i){this.enabled===!1||this.enableZoom===!1||this.state!==vt.NONE||(i.preventDefault(),this.dispatchEvent(du),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(np))}function Wy(i){this.enabled!==!1&&this._handleKeyDown(i)}function Xy(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case ji.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=vt.TOUCH_ROTATE;break;case ji.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=vt.TOUCH_PAN;break;default:this.state=vt.NONE}break;case 2:switch(this.touches.TWO){case ji.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=vt.TOUCH_DOLLY_PAN;break;case ji.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=vt.TOUCH_DOLLY_ROTATE;break;default:this.state=vt.NONE}break;default:this.state=vt.NONE}this.state!==vt.NONE&&this.dispatchEvent(du)}function $y(i){switch(this._trackPointer(i),this.state){case vt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case vt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case vt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case vt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=vt.NONE}}function qy(i){this.enabled!==!1&&i.preventDefault()}function Yy(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Zy(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function ip(i){let e=new gs;e.background=new Ze("#143451"),e.fog=new lo("#143451",1e3,2200);let t=new Yt(36,1,1,3e3);t.up.set(0,0,1),t.position.set(500,-630,480);let n=new wr({antialias:!0,alpha:!1});n.setPixelRatio(Math.min(devicePixelRatio,2)),n.shadowMap.enabled=!0,n.shadowMap.type=ml,n.outputColorSpace=tn,i.prepend(n.domElement),n.domElement.setAttribute("aria-label","Interactive 3D robot arm. Joint angles and tool coordinates are available in the controls.");let s=new dc(t,n.domElement);s.target.set(55,0,90),s.enableDamping=!0,s.minDistance=350,s.maxDistance=1600,s.maxPolarAngle=Math.PI-.001,e.add(new Ro(16777215,6584993,2.5));let r=new Io(16777215,3);r.position.set(-200,-300,650),r.castShadow=!0,r.shadow.mapSize.set(2048,2048),Object.assign(r.shadow.camera,{left:-500,right:500,top:500,bottom:-500,near:1,far:1200}),r.shadow.bias=-.001,e.add(r);let o={body:new Rn({color:15790836,roughness:.34,metalness:.16}),joint:new Rn({color:14804457,roughness:.32,metalness:.24}),accent:new Rn({color:16021281,roughness:.38,metalness:.12}),metal:new Rn({color:3752526,metalness:.65,roughness:.3})};function a(E,U){let W=new _t(E,U);return W.castShadow=!0,W.receiveShadow=!0,e.add(W),W}let l=a(new ys(3e3,3e3),new Rn({color:2312550,roughness:1}));l.position.z=-2;let c=new Do(900,18,9149092,4548480);c.rotation.x=Math.PI/2,c.position.z=.1,e.add(c);let h=E=>new L(...E);function u(E,U){let W=new Gi(new St().setFromPoints(E.map(h)),new wn({color:U}));return e.add(W),W}u([[0,0,1],[360,0,1]],11954256),u([[0,0,1],[0,360,1]],5801579),u([[0,0,0],[0,0,340]],7574969);function f(E,U,W){let ie=document.createElement("canvas");ie.width=128,ie.height=64;let Y=ie.getContext("2d");Y.font="600 36px Segoe UI",Y.fillStyle=U,Y.textAlign="center",Y.fillText(E,64,44);let z=new ho(new dr({map:new Wi(ie),depthTest:!1}));return z.position.copy(h(W)),z.scale.set(50,25,1),e.add(z),z}f("X","#a66552",[385,0,5]),f("Y","#54795c",[0,385,5]),f("Z","#597c9a",[0,0,360]);let p=a(new Ut(47,49,10,64),o.metal);p.rotation.x=Math.PI/2,p.position.z=5;let g=a(new Ut(27,32,30,48),o.body);g.rotation.x=Math.PI/2,g.position.z=25;let _=a(new Ut(29,29,6,48),o.metal);_.rotation.x=Math.PI/2,_.position.z=43;let m=new nn;e.add(m);let d=new mr;d.moveTo(-15,44),d.lineTo(15,44),d.lineTo(15,70),d.absarc(0,70,15,0,Math.PI,!1),d.lineTo(-15,44);for(let E of[-1,1]){let U=new _t(new So(d,{depth:8,bevelEnabled:!0,bevelThickness:.6,bevelSize:.6,bevelSegments:2,steps:1,curveSegments:24}),o.body);U.rotation.x=Math.PI/2,U.position.y=E*27+4,U.castShadow=!0,m.add(U);let W=new _t(new Ut(9,9,10,32),o.metal);W.position.set(0,E*22,70),m.add(W);let ie=new _t(new Ut(10,10,2,32),o.accent);ie.position.set(0,E*32.5,70),m.add(ie)}let T=a(new Ut(32.5,32.5,5,48),o.accent);T.rotation.x=Math.PI/2,T.position.z=15;for(let E=0;E<6;E++){let U=E*Math.PI/3,W=a(new Ut(2.6,2.6,2,6),o.metal);W.rotation.x=Math.PI/2,W.position.set(41*Math.cos(U),41*Math.sin(U),11)}let v=[],x=[],w=[],A=0;function C(E){if(A!==E){for(let U of[...v,...x,...w])e.remove(U),U.traverse(W=>W.geometry?.dispose());A=E,v=Array.from({length:E-1},(U,W)=>{let ie=Math.max(9,18-W*2);return a(new Eo([[0,-.5],[ie*.8,-.5],[ie,-.46],[ie,.46],[ie*.8,.5],[0,.5]].map(([Y,z])=>new le(Y,z)),48),o.body)}),x=Array.from({length:E-1},(U,W)=>a(new Ut(Math.max(13,23-W*2),Math.max(13,23-W*2),W<2?39:29,32),o.joint)),w=Array.from({length:E-1},(U,W)=>{let ie=Math.max(13,23-W*2)-2,Y=W<2?40:30,z=a(new Ut(ie,ie,Y,48),o.accent);for(let fe of[-1,1]){let he=new _t(new Ut(ie*.73,ie*.73,1.2,48),o.joint);he.position.y=fe*(Y/2+.6),he.castShadow=!0,z.add(he);for(let Re=0;Re<4;Re++){let Ue=Re*Math.PI/2+Math.PI/4,Te=new _t(new Ut(1.2,1.2,1.5,6),o.metal);Te.position.set(ie*.51*Math.cos(Ue),fe*(Y/2+1.3),ie*.51*Math.sin(Ue)),z.add(Te)}}return z}),Ke.scale.setScalar(Jo(E)/300),q=[],O.geometry.dispose(),O.geometry=new St,ze("iso"),n.domElement.dataset.joints=String(E)}}let N=a(new Xi(3,12,8),o.accent),b=new nn;e.add(b);let M=[],P="",G=!1,X=[],j=it(Sn.home),H=new Rn({color:6582400,roughness:.35,metalness:.65}),V=new Rn({color:2107185,roughness:.95}),ee=null;function $(E){P="gripper";function U(Y,z,fe){let he=new _t(Y,z);return he.position.set(...fe),he.castShadow=!0,b.add(he),he}let W=U(new Ut(13,13,4,32),H,[0,0,38]);W.rotation.x=Math.PI/2;let ie=U(new Ut(7,7,8,20),H,[0,0,32]);ie.rotation.x=Math.PI/2,U(new jt(22,54,12),H,[0,0,23]);for(let Y of[-1,1]){let z=U(new jt(12,6,32),V,[0,Y*26,3]);z.userData.sign=Y,M.push(z)}}$("gripper");let ue=null,ye=new nn;e.add(ye);let Ee=new sn({color:16768837,depthTest:!1}),We=Array.from({length:12},()=>{let E=new _t(new Ut(1.8,1.8,1,8),Ee);return E.renderOrder=11,ye.add(E),E}),Je=new _t(new jt(1,1,1),new sn({color:16768837,transparent:!0,opacity:.12,depthTest:!1,depthWrite:!1}));Je.renderOrder=10,ye.add(Je);let nt=f("A","#10203b",[0,0,0]);nt.scale.set(36,18,1);let at=nt.material.map.image,Q=at.getContext("2d");Q.fillStyle="#ffdf45",Q.fillRect(0,0,128,64),Q.fillStyle="#10203b",Q.font="bold 48px Segoe UI",Q.textAlign="center",Q.fillText("A",64,49),nt.material.map.needsUpdate=!0,nt.renderOrder=12,nt.visible=!1;function ae(){let E={base:g,j1:g,j2:x[0],j3:x[1],j4:x[2],j5:x[3],j6:x[4],joint:x[0],link:v[0],tool:b,tcp:N}[ue];if(ye.visible=!!E,nt.visible=!1,!E)return;E.updateWorldMatrix(!0,!0);let U=new di().setFromObject(E).expandByScalar(6),W=U.getCenter(new L),ie=U.getSize(new L);Je.position.copy(W),Je.scale.copy(ie);let Y=0;for(let z=0;z<3;z++)for(let fe of[0,1])for(let he of[0,1]){let Re=U.min.clone(),Ue=U.min.clone(),Te=[0,1,2].filter(Be=>Be!==z);Re.setComponent(Te[0],fe?U.max.getComponent(Te[0]):U.min.getComponent(Te[0])),Re.setComponent(Te[1],he?U.max.getComponent(Te[1]):U.min.getComponent(Te[1])),Ue.copy(Re),Ue.setComponent(z,U.max.getComponent(z));let Ye=We[Y++];Ye.position.copy(Re).add(Ue).multiplyScalar(.5),Ye.scale.y=Re.distanceTo(Ue),Ye.quaternion.setFromUnitVectors(new L(0,1,0),Ue.sub(Re).normalize())}nt.position.set(W.x,W.y,U.max.z+16)}let we=new Lo(20);e.add(we);let Oe=u([[0,0,0],[0,0,0]],9742222),Ie=a(new _r(13,1.4,8,40),o.accent);Ie.position.z=1;let Ke=a(new Xi(300,36,20),new sn({color:7509604,wireframe:!0,transparent:!0,opacity:.065,depthWrite:!1}));Ke.position.z=Sn.base,Ke.visible=!1;let pt="",I=[],oe=[],se=[];function ne(E){let U=document.createElement("canvas");U.width=384,U.height=144;let W=U.getContext("2d");W.fillStyle="#102a42",W.fillRect(0,0,U.width,U.height),W.textAlign="center",W.fillStyle="#ffe4ae",W.font="bold 58px Segoe UI",W.fillText(E.id,192,58),W.font="bold 33px Segoe UI",W.fillText(E.size.join(" \xD7 ")+" mm",192,112);let ie=new Wi(U);return ie.colorSpace=tn,ie}let te=[15056245,14260564,7387606,5475245,11651551,9480649];function xe(){for(let E of I){e.remove(E),E.geometry?.dispose();for(let U of Array.isArray(E.material)?E.material:[E.material])U?.map?.dispose(),U?.dispose()}I=[],oe=[],se=[]}function ce(E){if(G=E.output,X=E.objects,pt!==E.mode){let Ue=function(Te,Ye,Be){let st=a(new jt(...Te),new Rn({color:Be,roughness:.65}));return st.position.set(...Ye),I.push(st),st};var ie=Ue;xe(),pt=E.mode;let[Y,z]=E.size,[fe,he]=E.origin,Re=E.deck;if(E.mode==="shelf"){for(let Te of E.solids)Ue(Te.max.map((Ye,Be)=>Ye-Te.min[Be]),Te.max.map((Ye,Be)=>(Ye+Te.min[Be])/2),6652827);for(let Te of E.cells){let Ye=f(Te.id,"#ffe3a5",[(Te.min[0]+Te.max[0])/2,66,Te.min[2]+7]);Ye.scale.set(24,12,1),I.push(Ye)}}else{Ue([Y+8,z+8,8],[fe+Y/2,he+z/2,Re-4],11648976),Ue([30,z+8,42],[fe+Y+23,he+z/2,23],3696523),Ue([2,z-10,18],[fe+Y+39,he+z/2,30],11457249);for(let Te of[fe+20,fe+Y-15])for(let Ye of[he-5,he+z+5]){let Be=a(new Ut(10,10,8,24),o.metal);Be.position.set(Te,Ye,8),I.push(Be)}for(let Te=0;Te<=Y;Te+=20)I.push(u([[fe+Te,he,Re+.2],[fe+Te,he+z,Re+.2]],5401221));for(let Te=0;Te<=z;Te+=20)I.push(u([[fe,he+Te,Re+.2],[fe+Y,he+Te,Re+.2]],5401221));I.push(u([[fe,he,Re+.4],[fe+Y,he,Re+.4],[fe+Y,he+z,Re+.4],[fe,he+z,Re+.4],[fe,he,Re+.4]],16766090))}if(E.mode==="stacking")for(let Te of E.solids)Ue(Te.max.map((Ye,Be)=>Ye-Te.min[Be]),Te.max.map((Ye,Be)=>(Ye+Te.min[Be])/2),13669718),I.push(f("85 mm","#ffe3a5",[(Te.min[0]+Te.max[0])/2,Te.min[1]-8,Te.max[2]+10]));I.push(f(Y+" mm","#ffe3a5",[fe+Y/2,he-17,Re+2])),I.push(f(z+" mm","#ffe3a5",[fe-29,he+z/2,Re+2]));for(let[Te,Ye]of E.objects.entries()){let Be=Ue(Ye.size,Ye.center,te[Te]);oe.push(Be);let st=Be.material;Be.material=[st,st,st,st,new Rn({map:ne(Ye),roughness:.8}),st];let ct=Ue([Ye.size[0]+6,Ye.size[1]+6,1],[Ye.center[0],Ye.center[1],.5],3495795);ct.material.transparent=!0,ct.material.opacity=.65}}E.objects.forEach((Y,z)=>{let fe=oe[z],he=Y.rotation;fe.position.copy(h(Y.center)),fe.quaternion.setFromRotationMatrix(new ft().set(he[0],he[1],he[2],0,he[3],he[4],he[5],0,he[6],he[7],he[8],0,0,0,0,1))});let U=E.objects.find(Y=>Y.id===E.held),W=document.getElementById("held-dimensions");W.hidden=!U,U&&(W.textContent=U.id+" \xB7 "+U.size.join(" \xD7 ")+" mm"),n.domElement.dataset.tool="gripper",n.domElement.dataset.held=E.held||"",n.domElement.dataset.score=String(E.score)}let ge=new nn;e.add(ge),ge.visible=!1;let $e=new _t(new _r(7,1.4,8,32),new sn({color:16767878,depthTest:!1}));$e.renderOrder=35,ge.add($e);for(let[E,U]of[[0,15846531],[1,9555435],[2,16777215]]){let W=new L;W.setComponent(E,28);let ie=new xr(W.clone().normalize(),new L,28,U,5,3);ge.add(ie)}let Ve=f("O","#ffe4ae",[0,0,0]);Ve.scale.set(25,12,1),Ve.visible=!1;let R=["+X","+Y","+Z"].map(E=>{let U=f(E,"#e6d7b6",[0,0,0]);return U.scale.set(23,11,1),U.visible=!1,U});function y(E){ge.visible=Ve.visible=!!E,R.forEach(U=>U.visible=!!E),E&&(ge.position.set(...E),ge.position.z+=1,Ve.position.set(E[0]-10,E[1]-12,E[2]+3),R.forEach((U,W)=>{U.position.set(...E),U.position.setComponent(W,E[W]+35)}))}let O=u([],15759396),q=[],re=new nn;e.add(re);function K(){for(let E of[...re.children])re.remove(E),E.traverse(U=>{if(U.geometry?.dispose(),U.material)for(let W of Array.isArray(U.material)?U.material:[U.material])W.dispose()})}function De(E){if(K(),!E)return;let U=7985151,W=16734572;function ie(Be,st,ct=!0){if(Be.length<2)return;let mn=new St().setFromPoints(Be.map(h)),is=ct?new To({color:st,dashSize:6,gapSize:3,depthTest:!1,transparent:!0,opacity:.95}):new wn({color:st,depthTest:!1}),oi=new Gi(mn,is);oi.computeLineDistances(),oi.renderOrder=30,re.add(oi)}for(let Be of E.segments){ie(Be.points,U);let st=0;for(let ct=1;ct<Be.points.length;ct++){let mn=h(Be.points[ct-1]),is=h(Be.points[ct]);if(st+=mn.distanceTo(is),st>45){let oi=new xr(is.clone().sub(mn).normalize(),mn,13,U,6,4);re.add(oi),st=0}}Be.error&&Be.blockedPoint&&Be.target&&ie([Be.blockedPoint,Be.target],W)}let Y=E.ghost;if(!Y)return;let z=it(Y.q),fe=E.error?W:U,he=new nn;re.add(he);function Re(Be,st,ct=he){let mn=new _t(Be,new sn({color:fe,transparent:!0,opacity:.22,depthWrite:!1,depthTest:!1}));return mn.position.copy(h(st)),mn.renderOrder=28,ct.add(mn),mn}for(let Be=1;Be<z.points.length;Be++){let st=h(z.points[Be-1]),ct=h(z.points[Be]);Re(new Ut(Math.max(9,20-Be*2),Math.max(9,20-Be*2),st.distanceTo(ct),12),st.clone().add(ct).multiplyScalar(.5).toArray()).quaternion.setFromUnitVectors(new L(0,1,0),ct.sub(st).normalize())}let Ue=new nn;he.add(Ue),Ue.position.copy(h(z.tip));let Te=z.rotation;Ue.quaternion.setFromRotationMatrix(new ft().set(Te[0],Te[1],Te[2],0,Te[3],Te[4],Te[5],0,Te[6],Te[7],Te[8],0,0,0,0,1)),Re(new jt(22,54,12),[0,0,23],Ue),Re(new jt(26,26,16),[0,0,34],Ue);let Ye=Cc(Y.payload?[Y.payload]:[],z);for(let Be of[-1,1])Re(new jt(12,6,32),[0,Y.output?Ye[Be<0?0:1]:Be*Kt.open,3],Ue);if(Y.payload){let Be=Y.payload,st=Re(new jt(...Be.size),Be.center),ct=Be.rotation;st.quaternion.setFromRotationMatrix(new ft().set(ct[0],ct[1],ct[2],0,ct[3],ct[4],ct[5],0,ct[6],ct[7],ct[8],0,0,0,0,1))}if(E.error){let Be=Y.blockedPoint||z.tip,st=new _t(new Xi(11,16,12),new sn({color:W,wireframe:!0,depthTest:!1}));st.position.copy(h(Be)),st.renderOrder=33,re.add(st);for(let ct of[-1,1])ie([[Be[0]-8,Be[1],Be[2]-ct*8],[Be[0]+8,Be[1],Be[2]+ct*8]],W,!1)}}let pe=new nn;e.add(pe),pe.visible=!1;let Pe=new _t(new Xi(5,16,12),new sn({color:16768902,wireframe:!0,depthTest:!1}));pe.add(Pe);let Ae=u([[0,0,0],[0,0,0]],16768902);Ae.visible=!1;function de(E){pe.visible=Ae.visible=!!E,E&&(pe.position.set(...E),Ae.geometry.dispose(),Ae.geometry=new St().setFromPoints([h(E),h([E[0],E[1],0])]))}function be(E,U=!0){C(E.length);let W=it(E),ie=W.tip,Y=W.points;j=W,m.rotation.z=E[0]*Math.PI/180,v.forEach((he,Re)=>{let Ue=h(Y[Re]),Te=h(Y[Re+1]),Ye=Te.clone().sub(Ue).normalize();Re===0&&(Ue.addScaledVector(Ye,22),Te.addScaledVector(Ye,-20)),he.position.copy(Ue).add(Te).multiplyScalar(.5),he.scale.y=Ue.distanceTo(Te),he.quaternion.setFromUnitVectors(new L(0,1,0),Ye)}),x.forEach((he,Re)=>{he.position.copy(h(W.origins[Re+1])),he.quaternion.setFromUnitVectors(new L(0,1,0),h(W.axes[Re+1])),w[Re].position.copy(he.position),w[Re].quaternion.copy(he.quaternion)}),N.position.copy(h(ie)),b.position.copy(h(ie));let z=W.rotation,fe=new ft().set(z[0],z[1],z[2],0,z[3],z[4],z[5],0,z[6],z[7],z[8],0,0,0,0,1);b.quaternion.setFromRotationMatrix(fe),we.position.copy(b.position),we.quaternion.copy(b.quaternion),Oe.geometry.dispose(),Oe.geometry=new St().setFromPoints([h(ie),h([ie[0],ie[1],0])]),Ie.position.set(ie[0],ie[1],1),U&&(!q.length||h(ie).distanceTo(q.at(-1))>1.5)&&(q.push(h(ie)),q.length>1400&&q.shift(),O.geometry.dispose(),O.geometry=new St().setFromPoints(q))}function ze(E){let U=Math.max(1,Jo(A)/440);s.target.set(150,0,55),t.position.set(...E==="top"?[150,-.1,730*U]:E==="side"?[40,-1e3*U,110]:[510*U,-560*U,475*U]),s.update()}let Fe=()=>{let{width:E,height:U}=i.getBoundingClientRect();n.setSize(E,U,!1),t.aspect=E/U,t.fov=E/U<1.1?52:39,t.clearViewOffset(),t.updateProjectionMatrix()};new ResizeObserver(Fe).observe(i);let qe=Qf(document.getElementById("view-cube"),t,s);return n.setAnimationLoop(()=>{ae(),qe.update();let E=Cc(X,j);for(let U of M){let W=U.userData.sign,ie=E[W<0?0:1],Y=G?ie:W*Kt.open,z=U.position.y+(Y-U.position.y)*.16;U.position.y=W<0?Math.min(z,ie):Math.max(z,ie)}n.domElement.dataset.jawGap=M.length?String(M[1].position.y-M[0].position.y-Kt.thickness):"",ee&&(ee.visible=G&&P!=="gripper"),s.update(),n.render(e,t)}),be(Sn.home),{pose:be,configure:C,view:ze,taskState:ce,setTarget:de,setWorkFrame:y,setMotionPreview:De,setPreviewVisible(E){re.visible=E},setQuizTarget(E){ue=E,ae()},setTrail(E){O.visible=E,n.domElement.dataset.trailVisible=String(E)},setReach:E=>Ke.visible=E,clearTrail(){q=[],O.geometry.dispose(),O.geometry=new St},targets(){}}}var Pi=i=>[...i.origin,i.deck],Rs=(i,e)=>i.map((t,n)=>t-e[n]),fc=(i,e)=>i.map((t,n)=>t+e[n]);function sp(i,e,t=0){let[n,s]=t%180===0?e:[e[1],e[0],e[2]];return[i[0]+n/2,i[1]+s/2,e[2]]}function rp(i,e,t){return e?i.p?e.type==="move"&&Math.hypot(...i.p.map((n,s)=>n-e.p[s]))<3:typeof i.on!="boolean"||e.type!=="grip"||e.on!==i.on||t.output!==i.on?!1:i.on?t.input:!t.input&&t.score===1:!1}var k=i=>document.getElementById(i),D=(i,e)=>In==="zh"?e:i,Ir=i=>String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),In=localStorage.getItem("cargo-language")||"zh",un="xyz",_e=new Xn,tt=Li(),dt=[],es={},Rr={},ts=!1,_c=!1,xu=!1,xc=!1,ni="A",Pr={},Dr="",Ne=null,Hn=null,Is="move",yu=null,pc="",zt="robot",Vn=!1,ii=null,vu=()=>zt==="bed"?Pi(_e.spec):[0,0,0],Nr=i=>Rs(i,vu()),Pn=i=>Math.abs(i)<.05?0:Math.round(i*10)/10,Ft=it(tt).tip.map(i=>Math.round(i*10)/10),dn=0,Cs=0,Et=!1,si=!1,ot=null,mc=-1,xt=-1,Wo="ready",Xt=0,ri=[!1,!1,!1,!1,!1],hn=!1,gc=[null,null,null],Vo="",Qi=[],vn=-1,Cr=null,Bt=ip(k("viewport")),Zt=k("modal"),jy=qu({translate:D,highlightPart:i=>Bt.setQuizTarget(i),showPrompt:i=>{i?(k("guide").hidden=!1,k("guide").innerHTML=`<strong>${D("Learning prompt","\u5B66\u4E60\u63D0\u793A")}</strong><p>${D("Next: move above box A, then record the position. Approaching from above gives the box clearance.","\u4E0B\u4E00\u6B65\uFF1A\u79FB\u52A8\u5230\u7BB1\u5B50 A \u4E0A\u65B9\uFF0C\u7136\u540E\u8BB0\u5F55\u4F4D\u7F6E\u3002\u4ECE\u4E0A\u65B9\u63A5\u8FD1\u53EF\u7559\u51FA\u51C0\u7A7A\u3002")}</p>`):k("guide").hidden=!0},restorePrompt:()=>Ot()}),Lr={obstacle:["Movement blocked by the barrier. Compare the movement with the tool and load dimensions.","\u79FB\u52A8\u88AB\u969C\u788D\u7269\u963B\u6B62\u3002\u8BF7\u5BF9\u7167\u5F53\u524D\u79FB\u52A8\u4E0E\u5DE5\u5177\u3001\u8D27\u7269\u5C3A\u5BF8\u3002"],support:["This placement is unsupported or above the two-level limit. The box stays held.","\u6B64\u4F4D\u7F6E\u7F3A\u5C11\u5B8C\u6574\u652F\u6491\uFF0C\u6216\u8D85\u8FC7\u4E24\u5C42\u9650\u5236\u3002\u7BB1\u5B50\u4FDD\u6301\u5939\u6301\u3002"],supportsLoad:["This box supports another box. Remove the upper box first.","\u6B64\u7BB1\u652F\u6491\u7740\u53E6\u4E00\u7BB1\u3002\u8BF7\u5148\u79FB\u8D70\u4E0A\u65B9\u7BB1\u5B50\u3002"],fingers:["Movement blocked: gripper contact. Compare the tool dimensions with your arrangement and route.","\u79FB\u52A8\u88AB\u963B\u6B62\uFF1A\u5939\u722A\u53D1\u751F\u63A5\u89E6\u3002\u8BF7\u5BF9\u7167\u5DE5\u5177\u5C3A\u5BF8\u68C0\u67E5\u6392\u5217\u4E0E\u8DEF\u7EBF\u3002"],shelfCollision:["Shelf contact ahead. Use the front opening; withdraw out of the cubby before changing levels.","\u524D\u65B9\u4F1A\u78B0\u5230\u8D27\u67B6\u3002\u8BF7\u4ECE\u6B63\u9762\u8FDB\u5165\uFF1B\u6362\u5C42\u524D\u5148\u9000\u51FA\u683C\u53E3\u3002"],wrongCell:["Box released in a different cubby. Match the box letter to its cubby.","\u7BB1\u5B50\u5DF2\u91CA\u653E\uFF0C\u4F46\u683C\u53E3\u4E0D\u5339\u914D\u3002\u8BF7\u5C06\u7BB1\u5B50\u5B57\u6BCD\u4E0E\u683C\u53E3\u5BF9\u5E94\u3002"],planNeeded:["Commit your placement plan before starting the task.","\u5F00\u59CB\u4EFB\u52A1\u524D\uFF0C\u8BF7\u63D0\u4EA4\u653E\u7F6E\u65B9\u6848\u3002"],edge:["The box overhangs the truck. It stays held. Lift and bring its full footprint inside.","\u7BB1\u5B50\u8D85\u51FA\u8F66\u53A2\u8FB9\u754C\uFF0C\u4ECD\u4FDD\u6301\u5939\u6301\u3002\u8BF7\u62AC\u5347\u540E\u5C06\u6574\u4E2A\u5E95\u9762\u79FB\u5165\u8F66\u53A2\u3002"],ready:["Move the tool, record positions, then test your program.","\u79FB\u52A8\u5DE5\u5177\u3001\u8BB0\u5F55\u4F4D\u7F6E\uFF0C\u7136\u540E\u6D4B\u8BD5\u7A0B\u5E8F\u3002"],moved:["Position reached. Record it if it belongs in your program.","\u5DF2\u5230\u8FBE\u4F4D\u7F6E\u3002\u5982\u9700\u52A0\u5165\u7A0B\u5E8F\uFF0C\u8BF7\u8BB0\u5F55\u3002"],grasped:["DI1 ON \xB7 Box held. Lift before moving sideways.","DI1 \u5F00 \xB7 \u5DF2\u5939\u4F4F\u7BB1\u5B50\u3002\u5148\u62AC\u5347\uFF0C\u518D\u6C34\u5E73\u79FB\u52A8\u3002"],held:["DI1 ON \xB7 Box held.","DI1 \u5F00 \xB7 \u5DF2\u5939\u4F4F\u7BB1\u5B50\u3002"],open:["Gripper open \xB7 DI1 OFF.","\u5939\u722A\u5DF2\u5F20\u5F00 \xB7 DI1 \u5173\u3002"],placed:["Placed. Lift clear; in a cubby, withdraw through the front before changing levels.","\u653E\u7F6E\u6210\u529F\u3002\u62AC\u5347\u79BB\u5F00\u7BB1\u5B50\uFF1B\u5728\u683C\u53E3\u5185\u5E94\u5148\u4ECE\u6B63\u9762\u9000\u51FA\uFF0C\u518D\u6362\u5C42\u3002"],noContact:["Nothing held. Open, align above a box centre, lower to its top, then close.","\u672A\u5939\u4F4F\u7269\u4F53\u3002\u5F20\u5F00\u5939\u722A\uFF0C\u5BF9\u51C6\u7BB1\u5B50\u4E2D\u5FC3\uFF0C\u4E0B\u964D\u81F3\u7BB1\u9876\uFF0C\u518D\u95ED\u5408\u3002"],tilt:["Level the gripper first. Coordinate mode keeps it pointing down.","\u8BF7\u5148\u5C06\u5939\u722A\u8C03\u5E73\u3002\u5750\u6807\u6A21\u5F0F\u4F1A\u4FDD\u6301\u5939\u722A\u671D\u4E0B\u3002"],wide:["Too wide across the jaws. Open and turn the gripper 90\xB0 first.","\u5939\u722A\u65B9\u5411\u4E0A\u7684\u7BB1\u4F53\u8FC7\u5BBD\u3002\u5148\u5F20\u5F00\uFF0C\u518D\u65CB\u8F6C\u5939\u722A 90\xB0\u3002"],occupied:["Space occupied. The box stays held; lift and choose a clear space.","\u4F4D\u7F6E\u5DF2\u88AB\u5360\u7528\u3002\u7BB1\u5B50\u4ECD\u88AB\u5939\u6301\uFF0C\u8BF7\u62AC\u5347\u540E\u9009\u62E9\u7A7A\u4F4D\u3002"],drop:["Released too high. This does not count as a safe placement.","\u91CA\u653E\u4F4D\u7F6E\u8FC7\u9AD8\uFF0C\u672C\u6B21\u4E0D\u8BA1\u4E3A\u5B89\u5168\u653E\u7F6E\u3002"],outside:["Outside the loading area. Check the full box footprint, not only its centre.","\u672A\u653E\u5165\u88C5\u8F7D\u533A\u3002\u68C0\u67E5\u6574\u4E2A\u5E95\u9762\uFF0C\u800C\u4E0D\u4EC5\u662F\u4E2D\u5FC3\u70B9\u3002"],cargo:["Move blocked: cargo collision. Lift, travel across, then lower.","\u79FB\u52A8\u88AB\u963B\u6B62\uFF1A\u5C06\u78B0\u5230\u7BB1\u5B50\u3002\u5148\u62AC\u5347\uFF0C\u518D\u5E73\u79FB\uFF0C\u6700\u540E\u4E0B\u964D\u3002"],deck:["Move blocked: the box or tool would hit the truck deck. Raise Z first.","\u79FB\u52A8\u88AB\u963B\u6B62\uFF1A\u5C06\u78B0\u5230\u5E95\u677F\u3002\u8BF7\u5148\u589E\u5927 Z\u3002"],floor:["Move blocked: too low. Raise Z first.","\u79FB\u52A8\u88AB\u963B\u6B62\uFF1A\u9AD8\u5EA6\u8FC7\u4F4E\u3002\u8BF7\u5148\u589E\u5927 Z\u3002"],limits:["Cannot reach this path. Try a smaller move or a higher approach.","\u65E0\u6CD5\u5B8C\u6210\u8FD9\u6761\u8DEF\u5F84\u3002\u5C1D\u8BD5\u66F4\u5C0F\u7684\u79FB\u52A8\uFF0C\u6216\u4ECE\u66F4\u9AD8\u5904\u63A5\u8FD1\u3002"],numbers:["Enter valid coordinates; rotation must be between \u2212180\xB0 and 180\xB0.","\u8BF7\u8F93\u5165\u6709\u6548\u5750\u6807\uFF0C\u65CB\u8F6C\u8303\u56F4\u4E3A \u2212180\xB0 \u81F3 180\xB0\u3002"],stopped:["Stopped. Adjust or reset the scene.","\u5DF2\u505C\u6B62\u3002\u53EF\u4EE5\u8C03\u6574\u6216\u91CD\u7F6E\u573A\u666F\u3002"],wait:["DI1 is OFF. Stopped: check the close command and pickup position.","DI1 \u4E3A\u5173\u3002\u5DF2\u505C\u6B62\uFF0C\u8BF7\u68C0\u67E5\u95ED\u5408\u6307\u4EE4\u548C\u6293\u53D6\u4F4D\u7F6E\u3002"],complete:["Program complete. Inspect the result before changing your strategy.","\u8FD0\u884C\u5B8C\u6210\u3002\u8C03\u6574\u7B56\u7565\u524D\uFF0C\u8BF7\u5148\u68C0\u67E5\u7ED3\u679C\u3002"]},yc=["obstacle","support","supportsLoad","fingers","shelfCollision","wrongCell","planNeeded","edge","noContact","tilt","wide","occupied","drop","outside","cargo","deck","floor","limits","numbers","wait"];function bt(i,e){Wo=i,k("status").textContent=e||D(...Lr[i]||Lr.ready),k("status").classList.toggle("error",yc.includes(i))}function fn(){_e.update(tt),Bt.pose(tt),Bt.taskState(_e.snapshot());let i=it(tt);k("position-frame").textContent=D(zt==="bed"?_e.spec.mode==="shelf"?"Tool \xB7 SHELF zero \xB7 mm":"Tool \xB7 BED zero \xB7 mm":"Tool \xB7 ROBOT zero \xB7 mm",zt==="bed"?_e.spec.mode==="shelf"?"\u5DE5\u5177 \xB7 \u8D27\u67B6\u96F6\u70B9 \xB7 mm":"\u5DE5\u5177 \xB7 \u8F66\u53A2\u96F6\u70B9 \xB7 mm":"\u5DE5\u5177 \xB7 \u673A\u5668\u4EBA\u96F6\u70B9 \xB7 mm"),k("position").innerHTML=Nr(i.tip).map((e,t)=>`<b><i>${"XYZ"[t]}</i>${Pn(e).toFixed(1)}</b>`).join(""),k("orientation").textContent=D("Rotation","\u65CB\u8F6C")+` ${i.rpy[2].toFixed(0)}\xB0 \xB7 `+D("Gripper only","\u5E73\u884C\u5939\u722A"),k("score").textContent=`${_e.score} / ${_e.objects.length}`,k("sensor").innerHTML=`<span>${D("Close command","\u95ED\u5408\u6307\u4EE4")} <b>DO1 ${_e.output?"ON":"OFF"}</b></span><span>${D(_e.input?"Object held":"Nothing held",_e.input?"\u5DF2\u5939\u4F4F\u7269\u4F53":"\u672A\u5939\u4F4F\u7269\u4F53")} <b>DI1 ${_e.input?"ON":"OFF"}</b></span>`,k("grip-close").classList.toggle("active",_e.output),k("grip-open").classList.toggle("active",!_e.output),k("distance").textContent=D("Travel ","\u8DEF\u5F84 ")+Math.round(_e.travel)+" mm",k("faults").textContent=D("Retries ","\u9700\u8C03\u6574 ")+_e.faults,_p(),$o(),!ot&&!Et&&Tc()}function xi(){let i=it(tt);Ft=i.tip.map(e=>Math.round(e*10)/10),dn=Math.round(i.rpy[2]),Ds()}function vc(){document.documentElement.lang=In==="zh"?"zh-CN":"en",document.querySelectorAll("[data-en]").forEach(i=>i.textContent=i.dataset[In]),k("language").textContent=In==="zh"?"English":"\u4E2D\u6587",Ds(),$t(),Ot(),fn(),bt(Wo),pn()}function Ds(){uv();let i=Nr(Ft),e=vu();if(document.querySelectorAll("[data-mode]").forEach(t=>{t.classList.toggle("active",t.dataset.mode===un),t.setAttribute("aria-selected",String(t.dataset.mode===un))}),un==="xyz"){k("movement").innerHTML=`<div class="coordinate-grid">${["X","Y","Z","Rz"].map((t,n)=>`<div class="axis-control"><label for="axis-${n}">${t} <small>${n===3?"\xB0":"mm"}</small></label><input id="axis-${n}" aria-label="${t}" type="number" step="1" value="${n===3?dn:Pn(i[n])}"><input aria-label="${t} ${D("slider","\u6ED1\u5757")}" data-axis="${n}" type="range" min="${[-100-e[0],-250-e[1],12-e[2],-180][n]}" max="${[400-e[0],300-e[1],330-e[2],180][n]}" step="1" value="${n===3?dn:Pn(i[n])}"></div>`).join("")}<button id="move" class="move-button primary">${D("Move \u2192","\u79FB\u52A8 \u2192")}</button></div><p class="dock-note">${D("Set a target, then Move. Rz rotates around vertical; the gripper stays level.","\u8BBE\u5B9A\u76EE\u6807\uFF0C\u518D\u70B9\u51FB\u79FB\u52A8\u3002Rz \u7ED5\u7AD6\u76F4\u65B9\u5411\u65CB\u8F6C\uFF1B\u5939\u722A\u4FDD\u6301\u6C34\u5E73\u3002")}</p>`;for(let t=0;t<4;t++){let n=k("axis-"+t),s=document.querySelector(`[data-axis="${t}"]`);n.oninput=()=>{let r=n.value===""?NaN:Number(n.value);t===3?dn=r:Ft[t]=r+e[t],s.value=r,_u(),xt>=0&&Ot()},s.oninput=()=>{n.value=s.value,n.oninput()}}k("move").onclick=()=>pu([...Ft],dn)}else un==="jog"?(k("movement").innerHTML=`<div class="jog-grid">${["X","Y","Z","Rz"].map((t,n)=>`<div class="jog-axis"><button data-jog="${n},-1" aria-label="${t} minus">\u2212</button><span>${t}</span><button data-jog="${n},1" aria-label="${t} plus">\uFF0B</button></div>`).join("")}<label>${D("Step","\u6B65\u957F")} <input id="jog-step" type="number" value="10" min="1" max="50"> mm / \xB0</label></div><p class="dock-note">${D("Small, deliberate moves. Inspect before recording.","\u7528\u5C0F\u6B65\u957F\u7CBE\u786E\u79FB\u52A8\uFF0C\u68C0\u67E5\u540E\u518D\u8BB0\u5F55\u3002")}</p>`,document.querySelectorAll("[data-jog]").forEach(t=>t.onclick=()=>{let[n,s]=t.dataset.jog.split(",").map(Number),r=Number(k("jog-step").value);if(!Number.isFinite(r)||r<1||r>50)return bt("numbers");let o=it(tt),a=[...o.tip];n<3&&(a[n]+=s*r),pu(a,o.rpy[2]+(n===3?s*r:0))})):(k("movement").innerHTML=`<div class="joint-grid">${tt.map((t,n)=>`<div class="axis-control"><label for="joint-${n}">J${n+1}</label><input id="joint-${n}" type="range" min="${Un[n].limits[0]}" max="${Un[n].limits[1]}" step="1" value="${t}"><output>${Math.round(t)}\xB0</output></div>`).join("")}</div><p class="dock-note">${D("Advanced: joints can tilt the tool. Coordinate mode uses a level approach.","\u8FDB\u9636\uFF1A\u5173\u8282\u53EF\u6539\u53D8\u5DE5\u5177\u503E\u89D2\uFF1B\u5750\u6807\u6A21\u5F0F\u4F7F\u7528\u6C34\u5E73\u6293\u53D6\u59FF\u6001\u3002")}</p>`,tt.forEach((t,n)=>{k("joint-"+n).oninput=s=>{s.target.nextElementSibling.textContent=s.target.value+"\xB0";let r=[...tt];r[n]=Number(s.target.value),Ps(Bs(_e,tt,it(r).tip,0,r))},k("joint-"+n).onchange=s=>{let r=[...tt];r[n]=Number(s.target.value),lp(r)}}));_u(),Di()}function Di(){k("preview-program").disabled=Et||!!ot||!dt.length,document.querySelectorAll("#attempt-action,#coordinate-frame,#set-zero,#movement input,#movement button,.tabs button,.grip button,#record,#add-close,#add-open,#add-wait,#reset,#clear,#load,#steps button,#undo,#mission-button,#learn-button,#help,#language,#journey-toggle,#journey-steps button").forEach(i=>i.disabled=Et||!!ot),k("save").disabled=!!ot&&!si,k("save").title=D("Pause or stop movement to export a stable session.","\u6682\u505C\u6216\u505C\u6B62\u8FD0\u52A8\u540E\uFF0C\u53EF\u5BFC\u51FA\u5F53\u524D\u8FDB\u5EA6\u3002"),document.querySelectorAll(".modal-save").forEach(i=>i.disabled=!!ot&&!si),document.querySelectorAll(".modal-import").forEach(i=>i.disabled=Et||!!ot),k("undo").disabled=Et||!!ot||!Qi.length,k("run").disabled=Et||!!ot||!dt.length,k("pause").disabled=!Et||vn>=0,k("stop").disabled=!Et&&!ot}function bc(){vn>=0&&(k("guide").hidden=!0),Cr&&(Cr("stop"),Cr=null),vn=-1,Cs++,Et=!1,si=!1,mc=-1,ot&&(ot.resolve(!1),ot=null),k("pause").textContent=D("Pause","\u6682\u505C"),$t(),Di(),bt("stopped")}function ap(i,e=.8){return new Promise(t=>{ot={frames:[tt,...i],start:performance.now(),duration:e*1e3,resolve:t},Di()})}async function pu(i,e,t=!1){if((Et||ot)&&!t)return;if(!Sc(t))return!1;Is="move",Ps(Bs(_e,tt,i,e));let n=rs(_e,tt,i,e);if(n.error)return _e.faults++,Ne&&!Ne.finished&&Ne.blocked++,bt(n.error),fn(),!1;let s=await ap(n.frames,Math.min(2.2,Math.max(.5,Pt(it(tt).tip,i)/150)));return s&&(_e.moves++,xi(),bt("moved",n.assisted?D("Placement aligned within the 5 mm / 5\xB0 training tolerance. Record this reached position.","\u5DF2\u6309 5 mm / 5\xB0 \u8BAD\u7EC3\u5BB9\u5DEE\u5BF9\u9F50\u653E\u7F6E\u4F4D\u7F6E\u3002\u8BF7\u8BB0\u5F55\u5B9E\u9645\u5230\u8FBE\u7684\u4F4D\u7F6E\u3002"):void 0),xt>=0&&Ot()),s}async function lp(i,e=!1){if((Et||ot)&&!e||!Sc(e))return!1;Ps(Bs(_e,tt,it(i).tip,0,i));let t=_e.canMove(tt,i);if(t)return _e.faults++,Ne&&!Ne.finished&&Ne.blocked++,bt(t),xi(),fn(),Ps(Bs(_e,tt,it(i).tip,0,i)),!1;let n=await ap([i],.7);return n&&(_e.moves++,xi(),bt("moved"),xt>=0&&Ot()),n}function cp(i){if($o(),ot&&!si){let e=ot,t=Math.max(0,Math.min(1,(i-e.start)/e.duration)),n=t*(e.frames.length-1),s=Math.min(e.frames.length-2,Math.floor(n)),r=e.frames[s],o=e.frames[s+1],a=n-s,l=it(tt).tip;tt=r.map((c,h)=>c+(o[h]-c)*a),_e.travel+=Pt(l,it(tt).tip),Ne&&!Ne.finished&&(Ne.travel+=Pt(l,it(tt).tip)),fn(),t===1&&(ot=null,e.resolve(!0),Di())}requestAnimationFrame(cp)}function hp(i){if(Et||ot||!Sc())return;let e=pp(i);bt(e),fn(),yc.includes(e)||dp(),wu()&&Ec()}function $t(){dt.length?k("steps").innerHTML=dt.map((i,e)=>`<li class="${e===mc?"playing":""}"><div><b>${i.name?Ir(i.name):i.type==="move"?D("Move","\u79FB\u52A8"):i.type==="wait"?D("Wait for DI1","\u7B49\u5F85 DI1"):i.on?D("Close gripper","\u95ED\u5408\u5939\u722A"):D("Open gripper","\u5F20\u5F00\u5939\u722A")}</b><small>${i.type==="move"?Nr(i.p).map((t,n)=>"XYZ"[n]+" "+Pn(t)).join(" \xB7 ")+D(zt==="bed"?" \xB7 BED":" \xB7 ROBOT",zt==="bed"?" \xB7 \u8F66\u53A2":" \xB7 \u673A\u5668\u4EBA")+` \xB7 ${i.yaw.toFixed(0)}\xB0`:i.type==="wait"?D("Stop if nothing is held","\u672A\u5939\u4F4F\u65F6\u505C\u6B62"):i.on?"DO1 ON":"DO1 OFF"}</small></div><button data-edit="${e}" aria-label="${D("Edit step","\u7F16\u8F91\u6B65\u9AA4")} ${e+1}">\u270E</button><button data-up="${e}" aria-label="${D("Move step up","\u4E0A\u79FB\u6B65\u9AA4")} ${e+1}">\u2191</button><button data-delete="${e}" aria-label="${D("Delete step","\u5220\u9664\u6B65\u9AA4")} ${e+1}">\xD7</button></li>`).join(""):k("steps").innerHTML=`<div class="empty"><span>\u21B3</span><h2>${D("One useful step at a time","\u4ECE\u4E00\u4E2A\u6709\u7528\u7684\u6B65\u9AA4\u5F00\u59CB")}</h2><p>${D("Move above a box. Record the position. Build a repeatable sequence from there.","\u5148\u79FB\u52A8\u5230\u7BB1\u5B50\u4E0A\u65B9\uFF0C\u8BB0\u5F55\u4F4D\u7F6E\uFF0C\u7136\u540E\u9010\u6B65\u6784\u5EFA\u53EF\u91CD\u590D\u6267\u884C\u7684\u7A0B\u5E8F\u3002")}</p></div>`,document.querySelectorAll("[data-up]").forEach(i=>i.onclick=()=>{let e=Number(i.dataset.up);e>0&&(Go(),[dt[e-1],dt[e]]=[dt[e],dt[e-1]]),$t()}),document.querySelectorAll("[data-delete]").forEach(i=>i.onclick=()=>{Go(),dt.splice(Number(i.dataset.delete),1),$t()}),document.querySelectorAll("[data-edit]").forEach(i=>i.onclick=()=>rv(Number(i.dataset.edit))),Di(),!Et&&!ot&&Is==="program"&&Tc()}function Mc(i){if(!(Et||ot)){if(dt.length>=200)return bt("numbers",D("Limit: 200 steps. Save before starting a new program.","\u6700\u591A 200 \u6B65\u3002\u8BF7\u5148\u4FDD\u5B58\uFF0C\u518D\u5F00\u59CB\u65B0\u7A0B\u5E8F\u3002"));Go(),dt.push(i),$t(),k("steps").scrollTop=k("steps").scrollHeight,dp(i)}}function Jy(){let i=it(tt);Mc({type:"move",p:[...i.tip],yaw:i.rpy[2],q:[...tt],joint:Math.abs(i.rpy[0])>1||Math.abs(i.rpy[1])>1})}function ns(i=_e.spec.mode,e=!1){ii=null,Qi=[],bc(),Bt.setQuizTarget(null),Ne&&!e&&(Ne.finished&&(Ne=ia(Ne.plan,Ne.routes,Ne.strategy,_e.spec.mode),Hn=performance.now(),ts=!0),Ne.restarts++,Ne.traces={}),_e.reset(i),tt=Li(),Bt.clearTrail(),e&&(i!=="practice"&&(ri[4]=!1),Ne=null,Hn=null,Pr={},Dr="",ni="A",Vo="",zt="robot",Vn=!1,dt=[],es={},Rr={},ts=!1),xi(),fn(),$t(),bt("ready")}var op=i=>new Promise(e=>setTimeout(e,i));async function bu(i=!1,e=0,t=!0){if(Et||ot||!dt.length||!i&&!Sc())return;t&&(Ne&&!Ne.finished&&(Ne.restarts++,Ne.traces={}),_e.reset(),tt=Li(),Bt.clearTrail()),fn(),Et=!0,si=!1;let n=++Cs;Di();let s=!0;for(let o=e;o<dt.length;o++){for(;si&&n===Cs;)await op(50);if(n!==Cs)return;let a={world:Fc(_e),q:[...tt]},l;do{l=!1,mc=o,$t();let c=k("steps").querySelector(".playing");c&&(k("steps").scrollTop=Math.max(0,c.offsetTop-k("steps").offsetTop-30));let h=dt[o];if(i&&(vn=o,up(o)),h.type==="move"){if(!await(h.joint?lp(h.q,!0):pu(h.p,h.yaw,!0))){s=!1;break}}else if(h.type==="grip"){let u=pp(h.on);if(bt(u),fn(),wu(),yc.includes(u)){s=!1;break}await op(350)}else if(!_e.input){bt("wait"),s=!1;break}if(n!==Cs)return;if(i){vn=o+1;let u=await tv(o);if(u==="stop"||n!==Cs)return;u==="replay"&&(ov(a.world),tt=[...a.q],fn(),l=!0)}}while(l);if(!s)break}if(n!==Cs)return;Et=!1,mc=-1,$t(),Di();let r=yu;if(xi(),!s){Ps(r),vn=-1;return}if(i){vn=-1,ri[1]=!0,pn(),k("guide").hidden=!0,Ls("demoDone");return}bt("complete"),_e.spec.mode==="practice"&&_e.score===1&&xt>=8&&(_c=!0,ri[2]=!0,xt=-1,Ot(),Tu()),_e.spec.mode!=="practice"&&_e.score===_e.objects.length&&Ec()}function Ky(){Et&&(si=!si,ot&&(si?ot.pauseAt=performance.now():ot.start+=performance.now()-ot.pauseAt),k("pause").textContent=si?D("Resume","\u7EE7\u7EED"):D("Pause","\u6682\u505C"),Di())}function on(i,e=D("LEARNING JOURNEY","\u5B66\u4E60\u4E4B\u65C5")){return`<div class="modal-head"><div><span class="eyebrow">${e}</span><h2 id="modal-title">${i}</h2></div><button class="modal-close" id="close-modal" aria-label="${D("Close","\u5173\u95ED")}">\xD7</button></div>`}function Jt(i){k("modal-content").innerHTML=i,k("modal-content").querySelector(".modal-save")||(k("modal-content").insertAdjacentHTML("beforeend",`<div class="modal-progress"><button class="modal-save" ${ot?"disabled":""}>${D("Export progress JSON","\u5BFC\u51FA\u5B66\u4E60\u8FDB\u5EA6 JSON")}</button><button class="modal-import" ${Et||ot?"disabled":""}>${D("Import progress JSON","\u5BFC\u5165\u5B66\u4E60\u8FDB\u5EA6 JSON")}</button></div>`),k("modal-content").querySelector(".modal-save").onclick=Ru,k("modal-content").querySelector(".modal-import").onclick=()=>k("file").click()),Zt.open||Zt.showModal(),k("close-modal")?.addEventListener("click",()=>Zt.close())}function Qy(){Jt('<span class="eyebrow">BEIJING NEW TALENT ACADEMY</span><h2 id="modal-title">\u9009\u62E9\u8BED\u8A00 / Choose your language</h2><p class="lead">\u7528\u673A\u5668\u4EBA\u89E3\u51B3\u4E00\u4E2A\u5C0F\u5C0F\u7684\u8FD0\u8F93\u95EE\u9898\u3002<br>Solve a small delivery problem with a robot.</p><div class="actions"><button class="primary" id="choose-zh">\u4E2D\u6587</button><button id="choose-en">English</button></div><p>\u968F\u65F6\u53EF\u5728\u9876\u90E8\u5207\u6362 / You can change this at any time.</p>');for(let i of["zh","en"])k("choose-"+i).onclick=()=>{In=i,localStorage.setItem("cargo-language",In),vc(),Ls()}}function Ls(i="intro"){if(i==="demoDone"){Jt(on(D("You have seen the strategy. Now try it.","\u5DF2\u7ECF\u770B\u8FC7\u793A\u8303\uFF0C\u73B0\u5728\u81EA\u5DF1\u8BD5\u8BD5\u3002"))+`<p class="lead">${D("Approach, grip, lift, travel, lower, release. Now build and play that sequence yourself.","\u63A5\u8FD1\u3001\u5939\u53D6\u3001\u62AC\u5347\u3001\u5E73\u79FB\u3001\u4E0B\u964D\u3001\u91CA\u653E\u3002\u73B0\u5728\u7531\u4F60\u7F16\u5199\u5E76\u8FD0\u884C\u8FD9\u4E00\u7A0B\u5E8F\u3002")}</p><div class="callout">${D("DO1 tells the gripper to close. DI1 tells you whether a box was actually held.","DO1 \u53D1\u51FA\u95ED\u5408\u6307\u4EE4\uFF1BDI1 \u544A\u8BC9\u4F60\u662F\u5426\u771F\u6B63\u5939\u4F4F\u4E86\u7BB1\u5B50\u3002")}</div><div class="actions"><button id="repeat" class="primary">${D("My turn \u2192","\u8F6E\u5230\u6211\u4E86 \u2192")}</button><button id="again">${D("Watch again","\u518D\u770B\u4E00\u6B21")}</button></div>`),k("repeat").onclick=mu,k("again").onclick=()=>{Zt.close(),Eu()};return}Jt(on(D("A robot is one part of a solution.","\u673A\u5668\u4EBA\u662F\u89E3\u51B3\u95EE\u9898\u7684\u4E00\u90E8\u5206\u3002"))+`<p class="lead">${D("A school needs to deliver six supply boxes in one small truck. How would you arrange them\u2014and teach a robot to load them?","\u5B66\u6821\u8981\u7528\u4E00\u8F86\u5C0F\u8D27\u8F66\u8FD0\u9001\u516D\u7BB1\u7269\u8D44\u3002\u600E\u6837\u6446\u653E\u7BB1\u5B50\uFF0C\u5E76\u8BA9\u673A\u5668\u4EBA\u5B8C\u6210\u88C5\u8F7D\uFF1F")}</p><div class="journey">${[["Watch","\u89C2\u5BDF","Meet the robot and controls, then watch a transfer.","\u5148\u8BA4\u8BC6\u673A\u5668\u4EBA\u548C\u63A7\u5236\u754C\u9762\uFF0C\u518D\u89C2\u770B\u642C\u8FD0\u793A\u8303\u3002"],["Try","\u5C1D\u8BD5","Build and play the same sequence.","\u4EB2\u624B\u7F16\u5199\u5E76\u8FD0\u884C\u540C\u6837\u7684\u7A0B\u5E8F\u3002"],["Explain","\u89E3\u91CA","Check the ideas, not just the buttons.","\u68C0\u67E5\u662F\u5426\u7406\u89E3\uFF0C\u800C\u4E0D\u4EC5\u4F1A\u6309\u6309\u94AE\u3002"],["Solve","\u89E3\u51B3","Plan a truck load, then adapt your strategy to stacking around an obstacle.","\u89C4\u5212\u8F66\u53A2\u88C5\u8F7D\uFF0C\u518D\u5C06\u7B56\u7565\u8FC1\u79FB\u5230\u5E26\u969C\u788D\u7684\u5806\u53E0\u4EFB\u52A1\u3002"]].map((e,t)=>`<article><b>0${t+1} \xB7 ${D(e[0],e[1])}</b><p>${D(e[2],e[3])}</p></article>`).join("")}</div><div class="callout">${D("This robot has six turning joints: J1 base, J2 shoulder, J3 elbow, J4 swivel, J5 wrist tilt and J6 tool rotation. Together they control position and orientation. Motors are actuators. The gripper holds a box. Coordinates describe a position. A program tells the robot what to do in order; sensors give feedback. The arm has reach and clearance limits. You decide the packing strategy.","\u8FD9\u53F0\u673A\u5668\u4EBA\u6709\u516D\u4E2A\u8F6C\u52A8\u5173\u8282\uFF1AJ1 \u5E95\u5EA7\u3001J2 \u80A9\u90E8\u3001J3 \u8098\u90E8\u3001J4 \u56DE\u8F6C\u3001J5 \u8155\u90E8\u4FEF\u4EF0\u3001J6 \u5DE5\u5177\u65CB\u8F6C\u3002\u5B83\u4EEC\u5171\u540C\u63A7\u5236\u4F4D\u7F6E\u548C\u59FF\u6001\u3002\u7535\u673A\u662F\u6267\u884C\u5668\u3002\u5939\u722A\u5939\u6301\u7BB1\u5B50\uFF0C\u5750\u6807\u63CF\u8FF0\u4F4D\u7F6E\uFF0C\u7A0B\u5E8F\u89C4\u5B9A\u52A8\u4F5C\u987A\u5E8F\uFF0C\u4F20\u611F\u5668\u63D0\u4F9B\u53CD\u9988\u3002\u673A\u68B0\u81C2\u6709\u53EF\u8FBE\u8303\u56F4\u548C\u907F\u969C\u9650\u5236\uFF0C\u88C5\u8F7D\u7B56\u7565\u9700\u8981\u4F60\u6765\u51B3\u5B9A\u3002")}</div><div class="actions"><button id="watch" class="primary">${D("Watch a demonstration \u2192","\u89C2\u770B\u793A\u8303 \u2192")}</button><button id="parts">${D("Robot & interface tour","\u673A\u5668\u4EBA\u4E0E\u754C\u9762\u5BFC\u89C8")}</button><button id="practice">${D("Guided practice","\u5F15\u5BFC\u7EC3\u4E60")}</button><button id="explore">${D("Explore the mission","\u76F4\u63A5\u63A2\u7D22\u4EFB\u52A1")}</button>${_c?`<button id="quiz-again">${D("Concept check","\u6982\u5FF5\u68C0\u67E5")}</button>`:""}</div><footer>${D("Support appears when needed. Reopen it here at any time. This preview uses authored guidance, not live AI.","\u5B66\u4E60\u652F\u6301\u4EC5\u5728\u9700\u8981\u65F6\u51FA\u73B0\uFF0C\u53EF\u968F\u65F6\u91CD\u65B0\u6253\u5F00\u3002\u672C\u9884\u89C8\u4F7F\u7528\u9884\u8BBE\u6559\u5B66\u5F15\u5BFC\uFF0C\u672A\u8FDE\u63A5\u5B9E\u65F6 AI\u3002")}</footer>`),k("watch").onclick=Su,k("parts").onclick=()=>hv(0),k("practice").onclick=mu,k("explore").onclick=()=>{Xt=4,hn=!0,pn(),xt=-1,_e.spec.mode==="practice"&&ns("mission",!0),Ot(),yi()},k("quiz-again")?.addEventListener("click",Tu)}var Mu=[{p:[120,-155,110],text:["Approach A from above: X 120, Y \u2212155, Z 110. Move, then record.","\u4ECE A \u4E0A\u65B9\u63A5\u8FD1\uFF1AX 120\u3001Y \u2212155\u3001Z 110\u3002\u79FB\u52A8\u540E\u8BB0\u5F55\u3002"]},{p:[120,-155,20],text:["Lower to Z 20. Keep X and Y unchanged. Move, then record.","\u4E0B\u964D\u81F3 Z 20\uFF0C\u4FDD\u6301 X\u3001Y \u4E0D\u53D8\u3002\u79FB\u52A8\u540E\u8BB0\u5F55\u3002"]},{on:!0,text:["Close the gripper and add \u201C\uFF0B Close\u201D to the program, in either order. DI1 must confirm a held box.","\u95ED\u5408\u5939\u722A\u5E76\u6DFB\u52A0\u201C\uFF0B \u95ED\u5408\u201D\uFF0C\u987A\u5E8F\u4E0D\u9650\u3002DI1 \u5FC5\u987B\u786E\u8BA4\u5DF2\u5939\u4F4F\u7BB1\u5B50\u3002"]},{p:[120,-155,110],text:["Lift to Z 110 before travelling. Move, then record.","\u5E73\u79FB\u524D\u5148\u62AC\u5347\u81F3 Z 110\uFF0C\u79FB\u52A8\u540E\u8BB0\u5F55\u3002"]},{p:[170,90,110],text:["Travel above the truck: X 170, Y 90, Z 110. Move, then record.","\u5E73\u79FB\u81F3\u8F66\u53A2\u4E0A\u65B9\uFF1AX 170\u3001Y 90\u3001Z 110\u3002\u79FB\u52A8\u540E\u8BB0\u5F55\u3002"]},{p:[170,90,40],text:["Deck height 20 + box height 20 = Z 40. Lower, then record.","\u5E95\u677F\u9AD8 20 + \u7BB1\u9AD8 20 = Z 40\u3002\u4E0B\u964D\u540E\u8BB0\u5F55\u3002"]},{on:!1,text:["Open the gripper and add \u201C\uFF0B Open\u201D to the program, in either order.","\u5F20\u5F00\u5939\u722A\u5E76\u5411\u7A0B\u5E8F\u6DFB\u52A0\u201C\uFF0B \u5F20\u5F00\u201D\uFF0C\u987A\u5E8F\u4E0D\u9650\u3002"]},{p:[170,90,110],text:["Lift clear to Z 110 and record the final position.","\u62AC\u5347\u81F3 Z 110 \u79BB\u5F00\u7BB1\u5B50\uFF0C\u8BB0\u5F55\u6700\u540E\u4E00\u4E2A\u4F4D\u7F6E\u3002"]},{text:["Press Run. The scene resets and your complete program performs the transfer.","\u70B9\u51FB\u201C\u8FD0\u884C\u201D\u3002\u573A\u666F\u4F1A\u91CD\u7F6E\uFF0C\u7531\u4F60\u7684\u5B8C\u6574\u7A0B\u5E8F\u5B8C\u6210\u642C\u8FD0\u3002"]}];async function ev(){let i=Li(),e=[];for(let t of Mu.slice(0,8))if(t.p){let n=rs(new Xn("practice"),i,t.p,0);if(n.error)throw Error(n.error);i=n.frames.at(-1),e.push({type:"move",p:t.p,yaw:0,q:[...i],joint:!1})}else e.push({type:"grip",on:t.on});return e}function Su(){Et||ot||(Zt.close(),Xt=0,hn=!1,pn(),jy.start(()=>{ri[0]=!0,Eu()}))}async function Eu(){Xt=1,hn=!1,pn(),xt=-1,ns("practice",!0),un="xyz",Ds(),dt=await ev(),$t(),bu(!0)}function up(i,e=!1){let t=mp[i];k("guide").hidden=!1,k("guide").innerHTML=`<strong>${D("Teacher demonstration","\u6559\u5E08\u793A\u8303")} \xB7 ${i+1} / 8</strong><p>${D(...t.demo)}</p><p class="purpose">${D(...t.why)}</p>${e?`<div class="actions"><button id="demo-next" class="primary">${D(i===7?"Try it yourself \u2192":"Continue \u2192",i===7?"\u81EA\u5DF1\u8BD5\u8BD5 \u2192":"\u7EE7\u7EED \u2192")}</button><button id="demo-replay">${D("Replay action","\u91CD\u64AD\u6B64\u52A8\u4F5C")}</button></div>`:""}`}function tv(i){return up(i,!0),Di(),new Promise(e=>{Cr=e,k("demo-next").onclick=()=>{Cr=null,e("next")},k("demo-replay").onclick=()=>{Cr=null,e("replay")}})}function mu(){Et||ot||(Xt=2,hn=!1,pn(),Zt.close(),ns("practice",!0),xt=0,un="xyz",Ds(),Ot())}function Ot(){if(document.querySelectorAll(".pulse").forEach(l=>l.classList.remove("pulse")),xt<0){k("guide").hidden=!0;return}let i=Mu[xt],e=mp[xt],t=it(tt).tip,n=i.p&&Pt(t,i.p)<3,s=i.p&&Pt(Ft,i.p)<.1,r=i.on!==void 0&&_e.output===i.on&&(i.on?_e.input:!_e.input&&_e.score===1),o=i.p?[[s,D("Set the target coordinates","\u8BBE\u7F6E\u76EE\u6807\u5750\u6807")],[n,D("Move to the target","\u79FB\u52A8\u81F3\u76EE\u6807")],[!1,D("Record this position","\u8BB0\u5F55\u6B64\u4F4D\u7F6E")]]:xt===8?[[!1,D("Run your complete program","\u8FD0\u884C\u5B8C\u6574\u7A0B\u5E8F")]]:[[r,D(i.on?"Close and confirm an object is held":"Open and confirm the box is placed",i.on?"\u95ED\u5408\u5E76\u786E\u8BA4\u5DF2\u5939\u4F4F\u7269\u4F53":"\u5F20\u5F00\u5E76\u786E\u8BA4\u7BB1\u5B50\u5DF2\u653E\u597D")],[!!ii,D("Save the gripper command","\u4FDD\u5B58\u5939\u722A\u6307\u4EE4")]];k("guide").hidden=!1,k("guide").innerHTML=`<strong>${D("Your turn","\u8F6E\u5230\u4F60\u4E86")} \xB7 ${xt+1} / 9 \xB7 ${D(...e.title)}</strong><p class="purpose">${D(...e.why)}</p>${i.p?`<p class="guide-coordinates">${D(zt==="bed"?"BED target":"ROBOT target",zt==="bed"?"\u8F66\u53A2\u76EE\u6807":"\u673A\u5668\u4EBA\u76EE\u6807")}: ${Nr(i.p).map((l,c)=>"XYZ"[c]+" "+Pn(l)).join(" \xB7 ")} mm</p>`:""}<ol class="action-checks">${o.map(([l,c])=>`<li class="${l?"done":""}">${l?"\u2713":"\u25CB"} ${c}</li>`).join("")}</ol><div class="actions">${i.p&&!s?`<button id="fill-guide">${D("Fill target","\u586B\u5165\u76EE\u6807")}</button>`:""}<button id="hide-guide">${D("Hide guidance","\u6536\u8D77\u5F15\u5BFC")}</button></div>`,k("fill-guide")?.addEventListener("click",()=>{Ft=[...i.p],dn=0,un="xyz",Ds(),Ot()}),k("hide-guide").onclick=()=>{k("guide").hidden=!0,document.querySelectorAll(".pulse").forEach(l=>l.classList.remove("pulse"))};let a=xt===8?"run":i.p?n?"record":s?"move":"fill-guide":r?i.on?"add-close":"add-open":i.on?"grip-close":"grip-open";k(a)?.classList.add("pulse")}function dp(i){if(xt<0||xt>=8)return;let e=Mu[xt];i&&(e.p&&i.type==="move"||!e.p&&i.type==="grip"&&i.on===e.on)&&(ii=i),dt.includes(ii)||(ii=null),rp(e,ii,_e)?(xt++,ii=null,Ot()):!e.p&&ii?(Ot(),bt("ready",D("Program command saved. Now use the gripper control; you do not need to add the command again.","\u7A0B\u5E8F\u6307\u4EE4\u5DF2\u4FDD\u5B58\u3002\u73B0\u5728\u64CD\u4F5C\u5939\u722A\u5373\u53EF\uFF0C\u65E0\u9700\u91CD\u590D\u6DFB\u52A0\u6307\u4EE4\u3002"))):i?i&&bt("ready",D("Recorded. Follow the highlighted instruction to continue.","\u5DF2\u8BB0\u5F55\uFF0C\u8BF7\u6309\u9AD8\u4EAE\u63D0\u793A\u7EE7\u7EED\u3002")):Ot()}function Tu(){Xt=3,pn(),Jt(on(D("Can you explain your decisions?","\u80FD\u89E3\u91CA\u4F60\u7684\u51B3\u5B9A\u5417\uFF1F"))+`<p>${D("Three ideas to carry into the independent mission.","\u628A\u8FD9\u4E09\u4E2A\u60F3\u6CD5\u5E26\u5165\u72EC\u7ACB\u4EFB\u52A1\u3002")}</p>${[[D("1. Why lift before travelling sideways?","1. \u4E3A\u4EC0\u4E48\u8981\u5148\u62AC\u5347\uFF0C\u518D\u6C34\u5E73\u79FB\u52A8\uFF1F"),[D("To keep the carried box clear of other objects.","\u8BA9\u6240\u642C\u8FD0\u7684\u7BB1\u5B50\u907F\u5F00\u5176\u4ED6\u7269\u4F53\u3002"),D("A robot can only move upwards.","\u673A\u5668\u4EBA\u53EA\u80FD\u5411\u4E0A\u79FB\u52A8\u3002")]],[D("2. Matching total floor areas proves the boxes will fit.","2. \u7BB1\u5B50\u603B\u5E95\u9762\u79EF\u4E0E\u8F66\u53A2\u9762\u79EF\u76F8\u7B49\uFF0C\u5C31\u4E00\u5B9A\u80FD\u88C5\u4E0B\u3002"),[D("True. Area alone guarantees a fit.","\u6B63\u786E\uFF0C\u9762\u79EF\u76F8\u7B49\u5C31\u4E00\u5B9A\u80FD\u88C5\u4E0B\u3002"),D("False. Dimensions and arrangement also matter.","\u9519\u8BEF\uFF0C\u8FD8\u8981\u68C0\u67E5\u5C3A\u5BF8\u548C\u6392\u5217\u65B9\u5F0F\u3002")]],[D("3. DO1 ON but DI1 OFF means\u2026","3. DO1 \u4E3A ON\uFF0CDI1 \u4E3A OFF\uFF0C\u8868\u793A\u2026\u2026"),[D("The box has been loaded.","\u7BB1\u5B50\u5DF2\u88C5\u5165\u8F66\u53A2\u3002"),D("Close was commanded, but nothing is held.","\u5DF2\u53D1\u51FA\u95ED\u5408\u6307\u4EE4\uFF0C\u4F46\u6CA1\u6709\u5939\u4F4F\u7BB1\u5B50\u3002")]]].map(([i,e],t)=>`<div class="quiz-item"><p>${i}</p>${e.map((n,s)=>`<label><input type="radio" name="quiz-${t}" value="${s}" ${gc[t]===s?"checked":""}> ${n}</label>`).join("")}</div>`).join("")}<p id="quiz-feedback" class="feedback"></p><div class="actions"><button id="check-quiz" class="primary">${D("Check understanding","\u68C0\u67E5\u7406\u89E3")}</button><button id="lesson-return">${D("Revisit lesson","\u56DE\u770B\u8BFE\u7A0B")}</button></div>`),document.querySelectorAll('[name^="quiz-"]').forEach(i=>i.onchange=()=>{gc[Number(i.name.slice(5))]=Number(i.value)}),k("lesson-return").onclick=()=>Ls(),k("check-quiz").onclick=()=>{let i=[0,1,1].map((e,t)=>document.querySelector(`input[name="quiz-${t}"]:checked`)?.value===String(e));i.every(Boolean)?(xu=!0,ri[3]=!0,pn(),k("quiz-feedback").textContent=D("Ready. Plan your own loading strategy.","\u51C6\u5907\u597D\u4E86\u3002\u5F00\u59CB\u89C4\u5212\u4F60\u81EA\u5DF1\u7684\u88C5\u8F7D\u7B56\u7565\u3002"),k("check-quiz").textContent=D("Start mission \u2192","\u5F00\u59CB\u72EC\u7ACB\u4EFB\u52A1 \u2192"),k("check-quiz").onclick=()=>{Xt=4,hn=!0,pn(),xt=-1,ns("mission",!0),Ot(),yi()}):k("quiz-feedback").textContent=D("Revisit questions ","\u8BF7\u91CD\u65B0\u601D\u8003\u7B2C ")+i.map((e,t)=>e?null:t+1).filter(Boolean).join(", ")+D(". Clearance prevents collisions; area alone does not prove fit; DI1 confirms an actual grip."," \u9898\u3002\u7559\u51FA\u51C0\u7A7A\u80FD\u907F\u969C\uFF1B\u9762\u79EF\u76F8\u7B49\u4E0D\u4FDD\u8BC1\u80FD\u6392\u4E0B\uFF1BDI1 \u7528\u4E8E\u786E\u8BA4\u5B9E\u9645\u5939\u6301\u3002")}}function yi(){if(_e.spec.mode==="practice"){Jt(on(D("Your guided transfer","\u5F15\u5BFC\u642C\u8FD0\u7EC3\u4E60"))+`<p>${D("Follow the learning prompts, then run your saved program.","\u6309\u7167\u5B66\u4E60\u63D0\u793A\u64CD\u4F5C\uFF0C\u518D\u8FD0\u884C\u5DF2\u4FDD\u5B58\u7684\u7A0B\u5E8F\u3002")}</p><button id="back-practice" class="primary">${D("Continue practice","\u7EE7\u7EED\u7EC3\u4E60")}</button>`),k("back-practice").onclick=()=>{Zt.close(),Ot()};return}if(_e.spec.mode==="shelf")return gp();Jt(on(D("Design \u2192 commit \u2192 execute \u2192 reflect","\u8BBE\u8BA1 \u2192 \u63D0\u4EA4 \u2192 \u6267\u884C \u2192 \u53CD\u601D"),D("MY PLACEMENT PLAN","\u6211\u7684\u653E\u7F6E\u65B9\u6848"))+`<div id="planning-root"></div>${xc&&_e.spec.mode!=="stacking"?`<button id="start-stacking">${D("Task 2: stacking + obstacle \u2192","\u4EFB\u52A1 2\uFF1A\u5806\u53E0\u4E0E\u969C\u788D \u2192")}</button>`:""}`),Wu({root:k("planning-root"),t:D,world:_e,plan:es,routes:Pr,strategy:Dr,active:!!Ne&&!Ne.finished,onDraft:(i,e,t)=>{es=i,Pr=e,Dr=t},onStart:nv}),k("start-stacking")?.addEventListener("click",()=>{ns("stacking",!0),yi()})}function Xo(){return Ne?Ne.elapsedMs+(Hn===null?0:Math.max(0,performance.now()-Hn)):0}function fp(i){let e=Math.floor(i/1e3);return`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`}function $o(){k("attempt-bar")&&(k("attempt-bar").hidden=_e.spec.mode==="practice");let i=k("attempt-clock");i&&(i.textContent=Ne?`${D(Ne.finished?"Completed":"Task time",Ne.finished?"\u5DF2\u5B8C\u6210":"\u4EFB\u52A1\u7528\u65F6")} ${fp(Xo())}`:D("Planning \xB7 timer not started","\u89C4\u5212\u4E2D \xB7 \u5C1A\u672A\u8BA1\u65F6"),k("attempt-action").textContent=D(Ne?.finished?"Results":Ne&&Hn===null?"Resume timer":"My plan",Ne?.finished?"\u67E5\u770B\u7ED3\u679C":Ne&&Hn===null?"\u6062\u590D\u8BA1\u65F6":"\u6211\u7684\u65B9\u6848"))}function nv(i,e,t){let n=Ne&&!Ne.finished?Ne:null,s=Xo();bc(),_e.reset(),tt=Li(),Bt.clearTrail(),es=i,Pr=e,Dr=t,n?(n.history.push({plan:n.plan,routes:n.routes,strategy:n.strategy,elapsedMs:s}),n.history.length>100&&n.history.shift(),n.plan=structuredClone(i),n.routes=structuredClone(e),n.strategy=t,n.traces={},n.revisions++,n.restarts++,n.elapsedMs=s,Ne=n):Ne=ia(i,e,t,_e.spec.mode),Hn=performance.now(),ts=!0,Vn=!0,zt="bed",xt=-1,Xt=4,hn=!0,xi(),$t(),Ot(),pn(),fn(),$o(),Zt.close(),bt("ready",D("Plan committed. Timer running. Build and execute your own solution.","\u65B9\u6848\u5DF2\u63D0\u4EA4\uFF0C\u5F00\u59CB\u8BA1\u65F6\u3002\u8BF7\u7F16\u5199\u5E76\u6267\u884C\u81EA\u5DF1\u7684\u89E3\u51B3\u65B9\u6848\u3002"))}function Sc(i=!1){return _e.spec.mode==="practice"||_e.spec.mode==="shelf"||i?!0:Ne?.finished?(Ec(),!1):Ne?Hn===null?(bt("ready",D("Choose Resume timer to continue this saved attempt.","\u70B9\u51FB\u201C\u6062\u590D\u8BA1\u65F6\u201D\u7EE7\u7EED\u5DF2\u4FDD\u5B58\u7684\u5C1D\u8BD5\u3002")),!1):!0:(bt("planNeeded"),yi(),!1)}function pp(i){let e=_e.command(i,tt);return yc.includes(e)&&Ne&&!Ne.finished&&Ne.blocked++,e}function wu(){if(!Ne||Ne.finished||_e.score!==_e.objects.length)return!1;let i=Nc(Ne,_e,Xo());return i.complete?(Ne.elapsedMs=i.elapsedMs,Hn=null,Ne.finished=!0,Ne.result=i,_e.spec.mode==="mission"&&(xc=!0),ri[4]=!0,pn(),$o(),!0):!1}function Ec(){if(!Ne){Jt(on(D("Task complete. Export your progress or review the learning journey.","\u4EFB\u52A1\u5B8C\u6210\u3002\u53EF\u4EE5\u5BFC\u51FA\u8FDB\u5EA6\u6216\u56DE\u770B\u5B66\u4E60\u4E4B\u65C5\u3002")));return}wu();let i=Ne.result||Nc(Ne,_e,Xo());Jt(on(D(i.complete?"Your plan, tested.":"Your attempt so far.",i.complete?"\u65B9\u6848\u5DF2\u5B8C\u6210\u68C0\u9A8C\u3002":"\u5F53\u524D\u5C1D\u8BD5\u3002"),D("REFLECT \xB7 COMPARE \xB7 IMPROVE","\u53CD\u601D \xB7 \u6BD4\u8F83 \xB7 \u6539\u8FDB"))+`<div class="assessment-total"><b>${i.total} / 100</b><span>${fp(i.elapsedMs)} \xB7 ${_e.score} / ${_e.objects.length} ${D("boxes","\u7BB1")}</span></div><div class="rubric-scores">${[["space",45,"Space","\u7A7A\u95F4"],["placement",40,"Placement","\u653E\u7F6E"],["speed",15,"Time","\u65F6\u95F4"]].map(([e,t,n,s])=>`<div>${D(n,s)}<b>${i.points[e]} / ${t}</b></div>`).join("")}</div><p>${D("Load compactness","\u88C5\u8F7D\u7D27\u51D1\u5EA6")}: ${(i.compactness*100).toFixed(1)}% \xB7 ${D("Used envelope","\u5360\u7528\u5305\u56F4\u5C3A\u5BF8")}: ${i.usedSize.map(e=>Pn(e)).join(" \xD7 ")} mm</p><p>${D("Total tool travel","\u5DE5\u5177\u603B\u8DEF\u5F84")} ${Math.round(i.travel)} mm \xB7 ${D("Blocked actions","\u88AB\u963B\u6B62\u52A8\u4F5C")} ${i.blocked} \xB7 ${D("Plan revisions","\u65B9\u6848\u4FEE\u6539")} ${i.revisions} \xB7 ${D("Scene restarts","\u573A\u666F\u91CD\u7F6E")} ${i.restarts}</p><div class="result-table"><table><thead><tr><th>${D("Box","\u7BB1\u5B50")}</th><th>${D("Planned XYZ","\u89C4\u5212 XYZ")}</th><th>${D("Actual XYZ","\u5B9E\u9645 XYZ")}</th><th>${D("Position error","\u4F4D\u7F6E\u8BEF\u5DEE")}</th></tr></thead><tbody>${i.perBox.map(e=>`<tr><td>${e.id}</td><td>${Rs(e.target,Pi(_e.spec)).map(Pn).join(", ")}</td><td>${Rs(e.actual,Pi(_e.spec)).map(Pn).join(", ")}</td><td>${e.errorMm.toFixed(1)} mm</td></tr>`).join("")}</tbody></table></div><p><b>${D("Goal of this plan","\u672C\u65B9\u6848\u7684\u76EE\u6807")}</b><br>${Ir(Ne.strategy)}</p><label>${D("What worked? What changed after a collision? What would you optimize next time, and why?","\u54EA\u4E9B\u6709\u6548\uFF1F\u78B0\u649E\u540E\u6539\u53D8\u4E86\u4EC0\u4E48\uFF1F\u4E0B\u4E00\u6B21\u8981\u4F18\u5316\u4EC0\u4E48\uFF0C\u4E3A\u4EC0\u4E48\uFF1F")}<textarea id="reflection" maxlength="4000">${Ir(Vo)}</textarea></label><p>${D("Your explanation is for teacher discussion. Time targets are provisional classroom goals; this score is feedback on the simulation, not proof of learning.","\u89E3\u91CA\u4F9B\u6559\u5E08\u8BA8\u8BBA\u3002\u65F6\u95F4\u76EE\u6807\u4E3A\u6682\u5B9A\u8BFE\u5802\u76EE\u6807\uFF1B\u6B64\u5206\u6570\u53CD\u6620\u4EFF\u771F\u8868\u73B0\uFF0C\u4E0D\u4EE3\u8868\u5DF2\u8BC1\u660E\u5B66\u4E60\u6210\u6548\u3002")}</p><div class="actions"><button id="save-attempt" class="primary">${D("Export attempt & progress","\u5BFC\u51FA\u5C1D\u8BD5\u4E0E\u8FDB\u5EA6")}</button><button id="improve-plan">${D("Design a new attempt","\u8BBE\u8BA1\u65B0\u5C1D\u8BD5")}</button>${i.complete&&_e.spec.mode==="mission"?`<button id="next-task">${D("Task 2: stacking + obstacle \u2192","\u4EFB\u52A1 2\uFF1A\u5806\u53E0\u4E0E\u969C\u788D \u2192")}</button>`:""}</div>`),k("reflection").oninput=e=>Vo=e.target.value,k("save-attempt").onclick=Ru,k("improve-plan").onclick=yi,k("next-task")?.addEventListener("click",()=>{ns("stacking",!0),yi()})}function iv(){if(_e.spec.mode==="shelf")return gp();if(_e.spec.mode==="stacking"){Jt(on(D("Review your route in three dimensions.","\u4ECE\u4E09\u4E2A\u7EF4\u5EA6\u68C0\u67E5\u8DEF\u7EBF\u3002"))+`<p>${D("The barrier has width, depth and height. Compare its position with the gripper and carried box along each segment. The plan uses box-bottom levels; the movement target is the top centre. Every upper box needs full support.","\u969C\u788D\u7269\u6709\u5BBD\u3001\u6DF1\u3001\u9AD8\u3002\u6CBF\u6BCF\u6BB5\u8DEF\u7EBF\u6BD4\u8F83\u969C\u788D\u7269\u4E0E\u5939\u722A\u3001\u6240\u5939\u7BB1\u5B50\u7684\u4F4D\u7F6E\u3002\u65B9\u6848\u5C42\u9AD8\u6307\u7BB1\u5E95\uFF0C\u79FB\u52A8\u76EE\u6807\u4E3A\u7BB1\u9876\u4E2D\u5FC3\u3002\u6BCF\u4E2A\u4E0A\u5C42\u7BB1\u5B50\u90FD\u9700\u8981\u5B8C\u6574\u652F\u6491\u3002")}</p><button id="review-stacking">${D("Review my plan","\u68C0\u67E5\u6211\u7684\u65B9\u6848")}</button>`),k("review-stacking").onclick=yi;return}Jt(on(D("A little help, when you need it.","\u9700\u8981\u65F6\uFF0C\u7ED9\u4F60\u4E00\u70B9\u5E2E\u52A9\u3002"),D("TEACHER NOTES \u2022 BUILT-IN GUIDANCE","\u6559\u5E08\u63D0\u793A \xB7 \u5185\u7F6E\u5F15\u5BFC"))+`<p>${Ir(D(...Lr[Wo]||Lr.ready))}</p><div class="help-grid"><button data-help="move">${D("How do I move a box?","\u600E\u6837\u642C\u8FD0\u7BB1\u5B50\uFF1F")}</button><button data-help="program">${D("How do I build a program?","\u600E\u6837\u7F16\u5199\u7A0B\u5E8F\uFF1F")}</button><button data-help="collision">${D("My path hits something.","\u8DEF\u5F84\u53D1\u751F\u78B0\u649E\u3002")}</button><button id="coordinate-help">${D("Learn local zero","\u5B66\u4E60\u5C40\u90E8\u96F6\u70B9")}</button><button data-help="math">${D("How do I plan the load?","\u600E\u6837\u89C4\u5212\u88C5\u8F7D\uFF1F")}</button></div><div id="help-answer" class="feedback"></div><div class="actions"><button id="open-lesson">${D("Open learning journey","\u6253\u5F00\u5B66\u4E60\u4E4B\u65C5")}</button>${xt>=0?`<button id="resume-guide">${D("Show next step","\u663E\u793A\u4E0B\u4E00\u6B65")}</button>`:""}</div>`);let i={move:["1. Open. 2. Move above a box centre. 3. Lower to Z 20. 4. Close and check DI1. 5. Lift to Z 110. 6. Travel above your destination. 7. Lower to Z 40 and open. 8. Lift away. The 110 mm height is a conservative example, not a universal minimum.","1. \u5F20\u5F00\u30022. \u79FB\u81F3\u7BB1\u5B50\u4E2D\u5FC3\u4E0A\u65B9\u30023. \u964D\u5230 Z 20\u30024. \u95ED\u5408\u5E76\u786E\u8BA4 DI1\u30025. \u62AC\u5347\u81F3 Z 110\u30026. \u79FB\u81F3\u76EE\u6807\u4E0A\u65B9\u30027. \u964D\u81F3 Z 40 \u5E76\u5F20\u5F00\u30028. \u62AC\u5347\u79BB\u5F00\u3002110 mm \u662F\u4FDD\u5B88\u7684\u793A\u4F8B\u9AD8\u5EA6\uFF0C\u4E0D\u662F\u901A\u7528\u6700\u5C0F\u503C\u3002"],program:["Record useful positions. After pickup, add Close and Wait DI1. Record lift, travel and lowering positions; add Open and record retreat. Run resets the boxes and tests the whole sequence.","\u8BB0\u5F55\u5173\u952E\u4F4D\u7F6E\u3002\u6293\u53D6\u4F4D\u7F6E\u540E\u6DFB\u52A0\u201C\u95ED\u5408\u201D\u548C\u201C\u7B49\u5F85 DI1\u201D\u3002\u8BB0\u5F55\u62AC\u5347\u3001\u5E73\u79FB\u3001\u4E0B\u964D\u4F4D\u7F6E\uFF0C\u6DFB\u52A0\u201C\u5F20\u5F00\u201D\uFF0C\u518D\u8BB0\u5F55\u79BB\u5F00\u4F4D\u7F6E\u3002\u8FD0\u884C\u4F1A\u91CD\u7F6E\u7BB1\u5B50\u5E76\u6D4B\u8BD5\u6574\u4E2A\u7A0B\u5E8F\u3002"],collision:["Identify what would touch: cargo, deck or another box. Increase only Z first, then move X/Y, then lower. A shorter diagonal path can cut through cargo. Record the extra position so the program repeats the safe route.","\u5224\u65AD\u5C06\u78B0\u5230\u8D27\u7269\u3001\u5E95\u677F\u8FD8\u662F\u5176\u4ED6\u7BB1\u5B50\u3002\u5148\u53EA\u589E\u52A0 Z\uFF0C\u518D\u79FB\u52A8 X/Y\uFF0C\u6700\u540E\u4E0B\u964D\u3002\u8F83\u77ED\u7684\u659C\u7EBF\u8DEF\u5F84\u53EF\u80FD\u7A7F\u8FC7\u8D27\u7269\u3002\u8BB0\u5F55\u65B0\u589E\u4F4D\u7F6E\uFF0C\u8BA9\u7A0B\u5E8F\u91CD\u590D\u53EF\u884C\u8DEF\u7EBF\u3002"],math:["Add all box floor areas and compare with the truck area. Draw a non-overlapping arrangement. Use half the rotated dimensions to convert a box corner into its centre. Matching areas do not guarantee the shapes fit.","\u6C42\u51FA\u7BB1\u5B50\u5E95\u9762\u79EF\u4E4B\u548C\uFF0C\u4E0E\u8F66\u53A2\u9762\u79EF\u6BD4\u8F83\uFF0C\u753B\u51FA\u4E0D\u91CD\u53E0\u7684\u6392\u5217\u3002\u5229\u7528\u65CB\u8F6C\u540E\u5C3A\u5BF8\u7684\u4E00\u534A\uFF0C\u5C06\u89D2\u70B9\u6362\u7B97\u4E3A\u4E2D\u5FC3\u3002\u9762\u79EF\u76F8\u7B49\u4E0D\u4FDD\u8BC1\u5F62\u72B6\u80FD\u6392\u4E0B\u3002"]};document.querySelectorAll("[data-help]").forEach(e=>e.onclick=()=>{k("help-answer").textContent=e.dataset.help==="move"&&zt==="bed"?D("BED coordinates: 1. Open. 2. Approach above the box centre. 3. At the source, lower to Z 0. 4. Close and check DI1. 5. Lift to Z 90. 6. Travel above your planned centre. 7. Lower to Z 20 and open. 8. Lift away. These heights refer to the bed surface, not the floor.","\u8F66\u53A2\u5750\u6807\uFF1A1. \u5F20\u5F00\u30022. \u79FB\u81F3\u7BB1\u5B50\u4E2D\u5FC3\u4E0A\u65B9\u30023. \u5728\u53D6\u8D27\u533A\u964D\u81F3 Z 0\u30024. \u95ED\u5408\u5E76\u786E\u8BA4 DI1\u30025. \u62AC\u5347\u81F3 Z 90\u30026. \u79FB\u81F3\u89C4\u5212\u7684\u4E2D\u5FC3\u4E0A\u65B9\u30027. \u964D\u81F3 Z 20 \u5E76\u5F20\u5F00\u30028. \u62AC\u5347\u79BB\u5F00\u3002\u8FD9\u91CC\u7684\u9AD8\u5EA6\u76F8\u5BF9\u8F66\u53A2\u8868\u9762\uFF0C\u4E0D\u662F\u5730\u9762\u3002"):D(...i[e.dataset.help])}),k("coordinate-help").onclick=qo,k("open-lesson").onclick=()=>Ls(),k("resume-guide")?.addEventListener("click",()=>{Zt.close(),Ot()})}function sv(i,e){let t=URL.createObjectURL(new Blob([JSON.stringify(e,null,2)],{type:"application/json"})),n=document.createElement("a");n.href=t,n.download=i,n.click(),setTimeout(()=>URL.revokeObjectURL(t),1e3)}k("attempt-action").onclick=()=>{Ne?.finished?Ec():Ne&&Hn===null?(Hn=performance.now(),Zt.close(),$o(),bt("ready",D("Timer resumed. Continue your attempt.","\u8BA1\u65F6\u5DF2\u6062\u590D\uFF0C\u8BF7\u7EE7\u7EED\u5C1D\u8BD5\u3002"))):yi()};k("record").onclick=Jy;k("add-close").onclick=()=>Mc({type:"grip",on:!0});k("add-open").onclick=()=>Mc({type:"grip",on:!1});k("add-wait").onclick=()=>Mc({type:"wait"});k("grip-open").onclick=()=>hp(!1);k("grip-close").onclick=()=>hp(!0);k("run").onclick=()=>bu();k("pause").onclick=Ky;k("stop").onclick=bc;k("reset").onclick=()=>xt>=0?mu():ns();k("clear").onclick=()=>{Jt(on(D("Clear this program?","\u6E05\u7A7A\u6B64\u7A0B\u5E8F\uFF1F"))+`<p>${D("Save first to keep this sequence.","\u5982\u9700\u4FDD\u7559\u6B64\u7A0B\u5E8F\uFF0C\u8BF7\u5148\u4FDD\u5B58\u3002")}</p><div class="actions"><button id="confirm-clear" class="primary">${D("Clear program","\u6E05\u7A7A\u7A0B\u5E8F")}</button></div>`),k("confirm-clear").onclick=()=>{Go(),dt=[],$t(),Zt.close()}};k("save").onclick=Ru;k("load").onclick=()=>k("file").click();k("file").onchange=async i=>{try{let e=i.target.files[0];if(!e)return;if(e.size>5e6)throw Error();fu=$u(JSON.parse(await e.text())),Jt(on(D("Restore this saved session?","\u6062\u590D\u6B64\u5B66\u4E60\u8FDB\u5EA6\uFF1F"))+`<p>${D("This replaces the current session. Export your progress below first if you want to keep it. The robot will remain stopped.","\u8FD9\u4F1A\u66FF\u6362\u5F53\u524D\u5B66\u4E60\u72B6\u6001\u3002\u5982\u9700\u4FDD\u7559\uFF0C\u8BF7\u5148\u5BFC\u51FA\u5F53\u524D\u8FDB\u5EA6\u3002\u6062\u590D\u540E\u673A\u5668\u4EBA\u4FDD\u6301\u505C\u6B62\u3002")}</p><button id="restore-confirm" class="primary">${D("Restore progress","\u6062\u590D\u8FDB\u5EA6")}</button>`),k("restore-confirm").onclick=()=>{lv(fu),fu=null}}catch{bt("numbers",D("Invalid progress file. Your current session is unchanged.","\u8FDB\u5EA6\u6587\u4EF6\u65E0\u6548\u3002\u5F53\u524D\u5B66\u4E60\u72B6\u6001\u4FDD\u6301\u4E0D\u53D8\u3002"))}finally{i.target.value=""}};k("undo").onclick=()=>{Qi.length&&(dt=Qi.pop(),$t(),xt>=0&&Ot())};k("top-view").onclick=()=>Bt.view("top");k("iso-view").onclick=()=>Bt.view("iso");k("trail").onchange=i=>Bt.setTrail(i.target.checked);k("path-preview").onchange=i=>{Bt.setPreviewVisible(i.target.checked),k("path-feedback").hidden=!i.target.checked||!yu};k("preview-program").onclick=()=>{Is="program",pc="",k("path-preview").checked=!0,Bt.setPreviewVisible(!0),Tc()};k("journey-toggle").onclick=()=>{hn=!hn,pn()};k("mission-button").onclick=yi;k("learn-button").onclick=()=>Au();k("help").onclick=iv;k("coordinate-frame").onchange=i=>{if(i.target.value==="bed"&&!Vn){i.target.value=zt,qo();return}zt=i.target.value,xi(),$t(),fn(),xt>=0&&!k("guide").hidden&&Ot(),bt("ready",D("Coordinate display changed. The robot and saved positions did not move.","\u5750\u6807\u663E\u793A\u5DF2\u5207\u6362\uFF0C\u673A\u5668\u4EBA\u548C\u5DF2\u8BB0\u5F55\u7684\u4F4D\u7F6E\u4E0D\u53D8\u3002"))};k("set-zero").onclick=qo;k("language").onclick=()=>{In=In==="zh"?"en":"zh",localStorage.setItem("cargo-language",In),vc()};document.querySelectorAll("[data-mode]").forEach(i=>i.onclick=()=>{un=i.dataset.mode,xi()});var mp=[{title:["Approach box A","\u63A5\u8FD1\u7BB1\u5B50 A"],why:["Approaching from above leaves room to lower safely.","\u4ECE\u4E0A\u65B9\u63A5\u8FD1\uFF0C\u4E3A\u5B89\u5168\u4E0B\u964D\u7559\u51FA\u7A7A\u95F4\u3002"],demo:["I move above A and save this approach point.","\u6211\u79FB\u52A8\u5230 A \u4E0A\u65B9\uFF0C\u5E76\u4FDD\u5B58\u8FD9\u4E2A\u63A5\u8FD1\u70B9\u3002"]},{title:["Lower to the box","\u4E0B\u964D\u81F3\u7BB1\u5B50"],why:["Keep X and Y fixed so the gripper stays over the centre.","\u4FDD\u6301 X\u3001Y \u4E0D\u53D8\uFF0C\u8BA9\u5939\u722A\u59CB\u7EC8\u5BF9\u51C6\u4E2D\u5FC3\u3002"],demo:["I lower straight down to the top of the box.","\u6211\u7AD6\u76F4\u4E0B\u964D\u5230\u7BB1\u5B50\u9876\u90E8\u3002"]},{title:["Grip and check","\u5939\u6301\u5E76\u68C0\u67E5"],why:["A close command is not proof of a grip. DI1 confirms the box is held.","\u95ED\u5408\u6307\u4EE4\u4E0D\u4EE3\u8868\u5939\u6301\u6210\u529F\u3002DI1 \u786E\u8BA4\u662F\u5426\u5DF2\u5939\u4F4F\u7BB1\u5B50\u3002"],demo:["I close the gripper. DI1 turns on because a box is actually held.","\u6211\u95ED\u5408\u5939\u722A\u3002\u5B9E\u9645\u5939\u4F4F\u7BB1\u5B50\u540E\uFF0CDI1 \u53D8\u4E3A ON\u3002"]},{title:["Lift before travelling","\u5E73\u79FB\u524D\u62AC\u5347"],why:["Clear the surrounding cargo before moving sideways.","\u5148\u907F\u5F00\u5468\u56F4\u8D27\u7269\uFF0C\u518D\u6C34\u5E73\u79FB\u52A8\u3002"],demo:["I lift the box before travelling across the workspace.","\u6211\u5148\u62AC\u5347\u7BB1\u5B50\uFF0C\u518D\u7A7F\u8FC7\u5DE5\u4F5C\u533A\u3002"]},{title:["Travel above the truck","\u79FB\u81F3\u8F66\u53A2\u4E0A\u65B9"],why:["Keeping the load high avoids a diagonal path through obstacles.","\u4FDD\u6301\u9AD8\u5EA6\uFF0C\u907F\u514D\u659C\u7EBF\u8DEF\u5F84\u7A7F\u8FC7\u969C\u788D\u7269\u3002"],demo:["I travel above the planned placement centre.","\u6211\u79FB\u52A8\u5230\u89C4\u5212\u653E\u7F6E\u4E2D\u5FC3\u7684\u4E0A\u65B9\u3002"]},{title:["Lower onto the bed","\u4E0B\u964D\u81F3\u5E95\u677F"],why:["Deck 20 + box 20 = robot Z 40, or bed Z 20.","\u5E95\u677F 20 + \u7BB1\u9AD8 20 = \u673A\u5668\u4EBA Z 40\uFF0C\u5373\u8F66\u53A2 Z 20\u3002"],demo:["I lower until the box is supported by the truck bed.","\u6211\u4E0B\u964D\u7BB1\u5B50\uFF0C\u76F4\u5230\u7BB1\u5B50\u53D7\u5230\u8F66\u53A2\u5E95\u677F\u652F\u6491\u3002"]},{title:["Release the box","\u91CA\u653E\u7BB1\u5B50"],why:["Release only when the box has support; then check the result.","\u7BB1\u5B50\u6709\u652F\u6491\u540E\u518D\u91CA\u653E\uFF0C\u7136\u540E\u68C0\u67E5\u7ED3\u679C\u3002"],demo:["I open the gripper. The box stays on the bed and DI1 turns off.","\u6211\u5F20\u5F00\u5939\u722A\u3002\u7BB1\u5B50\u7559\u5728\u5E95\u677F\u4E0A\uFF0CDI1 \u53D8\u4E3A OFF\u3002"]},{title:["Retreat safely","\u5B89\u5168\u79BB\u5F00"],why:["Lift clear before starting the next pickup.","\u5F00\u59CB\u4E0B\u4E00\u6B21\u6293\u53D6\u524D\uFF0C\u5148\u62AC\u5347\u79BB\u5F00\u3002"],demo:["I lift away. These eight instructions form a repeatable transfer.","\u6211\u62AC\u5347\u79BB\u5F00\u3002\u8FD9\u516B\u6761\u6307\u4EE4\u7EC4\u6210\u53EF\u91CD\u590D\u7684\u642C\u8FD0\u7A0B\u5E8F\u3002"]},{title:["Test your program","\u6D4B\u8BD5\u7A0B\u5E8F"],why:["Playback checks the saved sequence, including gripper commands.","\u8FD0\u884C\u68C0\u67E5\u5DF2\u4FDD\u5B58\u7684\u52A8\u4F5C\u987A\u5E8F\uFF0C\u5305\u62EC\u5939\u722A\u6307\u4EE4\u3002"],demo:["",""]}],gu=[["Explore","\u8BA4\u8BC6"],["Watch","\u89C2\u5BDF"],["Practise","\u7EC3\u4E60"],["Check","\u68C0\u67E5"],["Solve","\u89E3\u51B3"]],fu=null;function pn(){let i=k("journey-steps");k("journey-nav").classList.toggle("collapsed",hn),i.innerHTML=(hn?[Xt]:[0,1,2,3,4]).map(e=>`<button data-stage="${e}" class="${e===Xt?"current":""}" ${e===Xt?'aria-current="step"':""}><span>${ri[e]?"\u2713":e+1}</span>${D(...gu[e])}${hn?" \xB7 "+D("Learning journey","\u5B66\u4E60\u4E4B\u65C5"):""}</button>`).join(""),i.querySelectorAll("button").forEach(e=>e.onclick=()=>Au()),k("journey-toggle").textContent=hn?D("Show stages","\u5C55\u5F00\u9636\u6BB5"):D("Collapse","\u6536\u8D77"),k("journey-toggle").setAttribute("aria-expanded",String(!hn))}function Au(){Et||ot||(Jt(on(D("Your learning journey","\u4F60\u7684\u5B66\u4E60\u4E4B\u65C5"))+`<p>${D("Current stage","\u5F53\u524D\u9636\u6BB5")}: <b>${D(...gu[Xt])}</b></p><ol class="journey-list">${gu.map((i,e)=>`<li>${ri[e]?"\u2713":"\u25CB"} ${D(...i)} ${Xt===e?"\u2190":""}</li>`).join("")}</ol><div class="actions"><button id="continue-learning" class="primary">${D("Continue here","\u4ECE\u8FD9\u91CC\u7EE7\u7EED")}</button><button id="review-learning">${D("Review lesson choices","\u67E5\u770B\u8BFE\u7A0B\u9009\u9879")}</button></div><p>${D("Export progress to continue on another day or device. Importing never starts movement.","\u5BFC\u51FA\u8FDB\u5EA6\u540E\uFF0C\u53EF\u5728\u53E6\u4E00\u5929\u6216\u53E6\u4E00\u53F0\u8BBE\u5907\u7EE7\u7EED\u3002\u5BFC\u5165\u4E0D\u4F1A\u542F\u52A8\u673A\u5668\u4EBA\u3002")}</p>`),k("continue-learning").onclick=()=>{Zt.close(),vn>=0?cv():xt>=0?Ot():Xt===3?Tu():Xt===4?yi():Xt===1?Eu():Su()},k("review-learning").onclick=()=>Ls())}function Ps(i){yu=i,Bt.setMotionPreview(i),Bt.setPreviewVisible(k("path-preview").checked);let e=k("path-feedback");if(e.hidden=!i||!k("path-preview").checked,e.classList.toggle("blocked",!!i?.error),i){let t=i.scope==="program"?D("Program \xB7 from reset","\u7A0B\u5E8F \xB7 \u4ECE\u91CD\u7F6E\u72B6\u6001\u5F00\u59CB"):D("Next move","\u4E0B\u4E00\u6B21\u79FB\u52A8");e.textContent=t+" \xB7 "+(i.error?(i.scope==="program"?D(`Step ${i.step+1}: `,`\u7B2C ${i.step+1} \u6B65\uFF1A`):"")+D(...Lr[i.error]||Lr.limits)+D(" Preview stops here. Red remainder is unchecked.","\u9884\u89C8\u5230\u6B64\u505C\u6B62\uFF1B\u7EA2\u8272\u540E\u7EED\u6BB5\u672A\u7ECF\u68C0\u67E5\u3002"):D("No blockage detected in this simulation. Dashed line = tool centre; ghost = end pose.","\u6B64\u4EFF\u771F\u672A\u68C0\u6D4B\u5230\u963B\u6321\u3002\u865A\u7EBF\u4E3A\u5DE5\u5177\u4E2D\u5FC3\u8DEF\u5F84\uFF1B\u534A\u900F\u660E\u6A21\u578B\u4E3A\u7EC8\u70B9\u59FF\u6001\u3002"))}document.querySelectorAll("#steps li").forEach((t,n)=>t.classList.toggle("preview-blocked",i?.scope==="program"&&!!i.error&&n===i.step))}function Tc(){if(Et||ot)return;let i=JSON.stringify([In,Is,_e.spec.mode,Is==="program"?dt:[un,tt,Ft,dn,_e.output,_e.held,_e.objects]]);if(i===pc)return;if(pc=i,Is==="program"){Ps(dt.length?Vu(_e,dt):null);return}let e=it(tt),t=un==="xyz"&&Ft.every(Number.isFinite)&&Ft.every(n=>Math.abs(n)<=600)&&Number.isFinite(dn)&&(Pt(Ft,e.tip)>1||Math.abs(dn-e.rpy[2])>1);Ps(t?Bs(_e,tt,Ft,dn):null)}function _u(){Is="move",pc="";let i=un==="xyz"&&Ft.every(Number.isFinite)&&Ft.every(e=>Math.abs(e)<=600)&&Pt(Ft,it(tt).tip)>1;Bt.setTarget(i?Ft:null),k("target-readout").hidden=!i,k("target-readout").textContent=D("Target \xB7 ","\u76EE\u6807 \xB7 ")+Nr(Ft).map((e,t)=>"XYZ"[t]+" "+Pn(e)).join(" \xB7 ")+" mm",!ot&&!Et&&Tc()}function Go(){Qi.push(structuredClone(dt)),Qi.length>30&&Qi.shift()}function rv(i){let e=dt[i];Jt(on(D("Edit program instruction","\u7F16\u8F91\u7A0B\u5E8F\u6307\u4EE4"))+`<label>${D("Name (optional)","\u540D\u79F0\uFF08\u53EF\u9009\uFF09")}<input id="step-name" maxlength="80" value="${Ir(e.name||"")}"></label>${e.type==="move"?`<p>${D("Coordinates use your selected reference. This edits the program without moving the robot.","\u5750\u6807\u4F7F\u7528\u6240\u9009\u53C2\u8003\u7CFB\u3002\u8FD9\u91CC\u7F16\u8F91\u7A0B\u5E8F\uFF0C\u4E0D\u4F1A\u79FB\u52A8\u673A\u5668\u4EBA\u3002")}</p><div class="edit-coordinates">${[...Nr(e.p),e.yaw].map((t,n)=>`<label>${["X","Y","Z","Rz"][n]}<input id="edit-${n}" type="number" value="${Pn(t)}"></label>`).join("")}</div>`:""}<p id="edit-feedback"></p><button id="save-step" class="primary">${D("Save instruction","\u4FDD\u5B58\u6307\u4EE4")}</button>`),k("save-step").onclick=()=>{let t={...e,name:k("step-name").value.trim()};if(e.type==="move"){let n=[0,1,2,3].map(o=>k("edit-"+o).value===""?NaN:Number(k("edit-"+o).value)),s=fc(n.slice(0,3),vu());if(!n.every(Number.isFinite)||Math.abs(n[3])>180||s.some(o=>Math.abs(o)>600)){k("edit-feedback").textContent=D("Enter valid coordinates and rotation.","\u8BF7\u8F93\u5165\u6709\u6548\u5750\u6807\u548C\u89D2\u5EA6\u3002");return}let r=Us(s,e.q,"nearest",[0,0,n[3]]);if(!r.q){k("edit-feedback").textContent=D("That target is outside the arm\u2019s reach.","\u76EE\u6807\u8D85\u51FA\u673A\u68B0\u81C2\u53EF\u8FBE\u8303\u56F4\u3002");return}t={...t,p:s,yaw:n[3],q:r.q,joint:!1}}Go(),dt[i]=t,$t(),Zt.close(),bt("ready",D("Instruction updated. Run to check the complete path.","\u6307\u4EE4\u5DF2\u66F4\u65B0\u3002\u8FD0\u884C\u7A0B\u5E8F\u68C0\u67E5\u5B8C\u6574\u8DEF\u5F84\u3002"))}}function ov(i){_e=new Xn(i.mode),Object.assign(_e,{objects:structuredClone(i.objects),output:i.output,held:i.held,offset:i.offset&&[...i.offset],localRotation:i.localRotation&&[...i.localRotation],travel:i.travel,moves:i.moves,faults:i.faults,drops:i.drops,last:i.last})}function av(){return{layoutVersion:3,routes:structuredClone(Pr),strategy:Dr,attempt:Ne?{...structuredClone(Ne),elapsedMs:Xo()}:null,kind:"bnta-cargo-progress",version:2,savedAt:new Date().toISOString(),q:[...tt],world:Fc(_e),steps:structuredClone(dt),plan:structuredClone(es),mathAnswers:{...Rr},reflection:Vo,learning:{stage:Xt,completed:[...ri],guideStep:xt,guideRecord:dt.includes(ii)?dt.indexOf(ii):null,practiceDone:_c,quizDone:xu,truckDone:xc,mathReady:ts,quizAnswers:[...gc],demoIndex:vn},ui:{lastCode:Wo,lang:In,mode:un,target:Ft.every(Number.isFinite)?[...Ft]:[...it(tt).tip],yaw:Number.isFinite(dn)?dn:0,coordinateFrame:zt,bedZeroSet:Vn,guideHidden:k("guide").hidden,journeyCollapsed:hn,trail:k("trail").checked,dimensions:!0}}}function Ru(){ot&&!si||sv("robot-lab-progress.json",av())}function lv(i){if(bc(),Zt.close(),Qi=[],i.legacy){xt=-1,ns(i.mode,!0),dt=i.steps,Xt=i.mode==="practice"?2:4,vn=-1,$t(),Ot(),pn(),bt("ready",D("Legacy program imported. It contains instructions only, not saved student progress.","\u5DF2\u5BFC\u5165\u65E7\u7248\u7A0B\u5E8F\u3002\u65E7\u6587\u4EF6\u4EC5\u542B\u6307\u4EE4\uFF0C\u4E0D\u5305\u542B\u5B66\u4E60\u8FDB\u5EA6\u3002"));return}_e=i.world,_e.spec.stock.some(n=>n[0]===ni)||(ni="A"),tt=i.q,dt=i.steps,es=i.plan,Pr=i.routes||{},Dr=i.strategy||"",Ne=i.attempt||null,Hn=null,Rr=i.mathAnswers,Vo=i.reflection;let e=i.learning,t=i.ui;Xt=e.stage,ri=e.completed,xt=e.guideStep,ii=e.guideRecord===null?null:dt[e.guideRecord],_c=e.practiceDone,xu=e.quizDone,ts=!!Ne||e.mathReady,xc=e.truckDone,gc=e.quizAnswers,vn=e.demoIndex,In=t.lang,un=t.mode,Ft=t.target,dn=t.yaw,zt=t.coordinateFrame,Vn=t.bedZeroSet,hn=t.journeyCollapsed,k("trail").checked=t.trail,Bt.setTrail(t.trail),Bt.clearTrail(),Wo=t.lastCode||"ready",localStorage.setItem("cargo-language",In),vc(),k("guide").hidden=t.guideHidden,_u(),bt("ready",D("Progress restored. Robot stopped. Recheck the plan if it came from an older task layout.","\u5B66\u4E60\u8FDB\u5EA6\u5DF2\u6062\u590D\uFF0C\u673A\u5668\u4EBA\u4FDD\u6301\u505C\u6B62\u3002\u5982\u6765\u81EA\u65E7\u4EFB\u52A1\u5E03\u5C40\uFF0C\u8BF7\u91CD\u65B0\u68C0\u67E5\u65B9\u6848\u3002")),Au()}function cv(){vn>=8?(vn=-1,ri[1]=!0,pn(),Ls("demoDone")):(Xt=1,pn(),bu(!0,Math.max(0,vn),!1))}Bt.setTrail(!0);vc();requestAnimationFrame(cp);localStorage.getItem("cargo-language")?Ls():Qy();function gp(){Jt(on(D("One box, one cubby.","\u4E00\u7BB1\u4E00\u683C\u3002"),D("NEXT MISSION \xB7 POSITION IN THREE DIMENSIONS","\u4E0B\u4E00\u5173 \xB7 \u4E09\u7EF4\u5B9A\u4F4D"))+`<p class="lead">${D("Put A\u2013F into their matching cubbies. A\u2013C go on the lower level; D\u2013F go above. Build a repeatable program.","\u5C06 A\u2013F \u653E\u8FDB\u5BF9\u5E94\u683C\u53E3\u3002A\u2013C \u5728\u4E0B\u5C42\uFF0CD\u2013F \u5728\u4E0A\u5C42\u3002\u7F16\u5199\u53EF\u91CD\u590D\u6267\u884C\u7684\u7A0B\u5E8F\u3002")}</p><div class="shelf-diagram" role="img" aria-label="${D("Three columns and two levels","\u4E09\u5217\u4E24\u5C42")}">${["D","E","F","A","B","C"].map(i=>`<b>${i}</b>`).join("")}</div><p>${D("Column pitch: 70 mm. Clear cubby width: 62 mm; depth: 80 mm. Upper floor: 110 mm above lower floor. All boxes: 20 mm tall. Shelf zero is the front-left corner of the lower floor.","\u5217\u95F4\u8DDD 70 mm\uFF1B\u683C\u53E3\u51C0\u5BBD 62 mm\uFF0C\u6DF1 80 mm\u3002\u4E0A\u5C42\u5E95\u677F\u6BD4\u4E0B\u5C42\u9AD8 110 mm\u3002\u7BB1\u9AD8\u5747\u4E3A 20 mm\u3002\u8D27\u67B6\u96F6\u70B9\u5728\u4E0B\u5C42\u5E95\u677F\u5DE6\u524D\u89D2\u3002")}</p><div class="callout">${D("First centre: X = half a column; Y = half the depth. Placement Z = floor height + box height. Fill the four predictions, then use the position reference to connect each letter to a target.","\u7B2C\u4E00\u4E2A\u4E2D\u5FC3\uFF1AX \u4E3A\u5217\u95F4\u8DDD\u7684\u4E00\u534A\uFF0CY \u4E3A\u6DF1\u5EA6\u7684\u4E00\u534A\u3002\u653E\u7F6E Z = \u5C42\u677F\u9AD8\u5EA6 + \u7BB1\u9AD8\u3002\u586B\u5199\u56DB\u4E2A\u9884\u6D4B\u503C\uFF0C\u518D\u7528\u4F4D\u7F6E\u53C2\u8003\u5C06\u5B57\u6BCD\u4E0E\u76EE\u6807\u5BF9\u5E94\u3002")}</div><div class="prediction-fields">${[["sx","A \xB7 X"],["sy","A \xB7 Y"],["sz","A \xB7 Z"],["upper","D \xB7 Z"]].map(([i,e])=>`<label>${e} (mm)<input id="shelf-${i}" type="number" value="${Ir(Rr[i]??"")}"></label>`).join("")}</div><ol><li>${D("Pick up outside the shelf and lift. Move in front of your cubby before changing to its height.","\u5728\u8D27\u67B6\u5916\u5939\u53D6\u5E76\u62AC\u5347\u3002\u5148\u79FB\u5230\u76EE\u6807\u683C\u53E3\u524D\u65B9\uFF0C\u518D\u8C03\u6574\u9AD8\u5EA6\u3002")}</li><li>${D("Enter horizontally, with the box bottom 20 mm above its shelf. Lower by 20 mm; open.","\u6C34\u5E73\u8FDB\u5165\uFF0C\u4FDD\u6301\u7BB1\u5E95\u9AD8\u4E8E\u5C42\u677F 20 mm\u3002\u4E0B\u964D 20 mm\uFF0C\u518D\u5F20\u5F00\u3002")}</li><li>${D("Lift the empty gripper by 20 mm to clear the box, withdraw through the front, then change levels. Do not move vertically through a shelf board.","\u7A7A\u5939\u722A\u62AC\u5347 20 mm \u79BB\u5F00\u7BB1\u5B50\uFF0C\u5148\u4ECE\u6B63\u9762\u9000\u51FA\uFF0C\u518D\u6362\u5C42\u3002\u4E0D\u8981\u7AD6\u76F4\u7A7F\u8FC7\u5C42\u677F\u3002")}</li></ol><p id="shelf-feedback" class="feedback"></p><div class="actions"><button id="check-shelf" class="primary">${D("Check & begin","\u68C0\u67E5\u5E76\u5F00\u59CB")}</button><button id="shelf-zero">${D("Set shelf zero","\u8BBE\u7F6E\u8D27\u67B6\u96F6\u70B9")}</button></div><p>${D("Use the same 5 mm training tolerance, but the whole box and gripper must clear the dividers. This is a simplified contact model.","\u540C\u6837\u4F7F\u7528 5 mm \u8BAD\u7EC3\u5BB9\u5DEE\uFF0C\u4F46\u6574\u4E2A\u7BB1\u5B50\u548C\u5939\u722A\u90FD\u5FC5\u987B\u907F\u5F00\u9694\u677F\u3002\u8FD9\u662F\u7B80\u5316\u7684\u63A5\u89E6\u6A21\u578B\u3002")}</p>`);for(let i of["sx","sy","sz","upper"])k("shelf-"+i).oninput=e=>{Rr[i]=e.target.value,ts=!1};k("shelf-zero").onclick=qo,k("check-shelf").onclick=()=>{if(!ea(Rr)){k("shelf-feedback").textContent=D("Try 70 \xF7 2, 80 \xF7 2, the box height, and 110 + the box height.","\u8BD5\u8BD5 70 \xF7 2\u300180 \xF7 2\u3001\u7BB1\u9AD8\uFF0C\u4EE5\u53CA 110 + \u7BB1\u9AD8\u3002");return}ts=!0,Vn=!0,zt="bed",xi(),$t(),fn(),Zt.close(),bt("ready",D("Shelf plan checked. Open the position reference for your chosen cubby.","\u8D27\u67B6\u8BA1\u7B97\u5DF2\u68C0\u67E5\u3002\u5C55\u5F00\u4F4D\u7F6E\u53C2\u8003\uFF0C\u9009\u62E9\u76EE\u6807\u683C\u53E3\u3002"))}}function _p(){let i=k("mission-button").querySelector("span");i&&(i.textContent=_e.spec.mode==="shelf"?D("Shelf mission","\u8D27\u67B6\u4EFB\u52A1"):_e.spec.mode==="stacking"?D("Stacking mission","\u5806\u53E0\u4EFB\u52A1"):D("Loading mission","\u88C5\u8F7D\u4EFB\u52A1"));let e=k("reference-content");if(!e)return;let t=_e.spec.mode==="shelf",n=Pi(_e.spec),s=Rs(it(tt).tip,n),r=(Ne?.plan||es)[ni],o=vi(ni,r?.turn||0),a=Ne?.plan||es,l=a[ni],c=vi(ni,l?.turn||0),h=t?Rs(Qo(ni),n):l&&[l.x,l.y].every(Number.isFinite)?[l.x+c[0]/2,l.y+c[1]/2,(l.z||0)+20]:null,[u,f]=_e.spec.size,p=s[0]>=0&&s[0]<=u&&s[1]>=0&&s[1]<=f;e.innerHTML=`<div class="reference-row"><svg viewBox="-12 -12 ${u+35} ${f+35}" role="img" aria-label="${D("Work area top view, gold target and white current tool","\u5DE5\u4F5C\u533A\u4FEF\u89C6\u56FE\uFF1A\u91D1\u8272\u4E3A\u76EE\u6807\uFF0C\u767D\u8272\u4E3A\u5F53\u524D\u5DE5\u5177")}"><rect width="${u}" height="${f}" fill="#193c57" stroke="#e5c589"/>${h?`<rect x="${h[0]-o[0]/2}" y="${f-h[1]-o[1]/2}" width="${o[0]}" height="${o[1]}" fill="#e5c58944" stroke="#e5c589"/><circle cx="${h[0]}" cy="${f-h[1]}" r="3" fill="#e5c589"/>`:""}${p?`<circle cx="${s[0]}" cy="${f-s[1]}" r="3" fill="white"/>`:""}<text x="0" y="${f+15}" fill="#e5c589" font-size="8">O \u2192 +X</text><text x="0" y="-4" fill="#e5c589" font-size="8">\u2191 +Y</text></svg><div><label>${D(t?"Cubby":"Plan box",t?"\u683C\u53E3":"\u65B9\u6848\u7BB1\u5B50")} <select id="reference-box">${_e.spec.stock.map(([g])=>`<option ${g===ni?"selected":""}>${g}</option>`).join("")}</select></label><p>${D("Now from work zero","\u5F53\u524D\u76F8\u5BF9\u5DE5\u4F5C\u96F6\u70B9")}<br><b>${s.map((g,_)=>"XYZ"[_]+" "+Pn(g)).join(" \xB7 ")}</b></p>${h?`<p>${ni} \xB7 ${D("planned top centre","\u89C4\u5212\u7BB1\u9876\u4E2D\u5FC3")}<br><b>${h.map((g,_)=>"XYZ"[_]+" "+Pn(g)).join(" \xB7 ")}</b></p><button id="reference-fill" ${!ts||Et||ot?"disabled":""}>${D("Fill placement target","\u586B\u5165\u653E\u7F6E\u76EE\u6807")}</button>`:`<p>${D("Add this box to your plan first.","\u5148\u5728\u65B9\u6848\u4E2D\u586B\u5199\u6B64\u7BB1\u4F4D\u7F6E\u3002")}</p>`}</div></div><p>${D("mm \xB7 X across, Y back, Z above the lower surface. White = current tool; gold = planned box. Filling a target does not move the arm. Approach safely before lowering.","\u5355\u4F4D mm \xB7 X \u6A2A\u5411\uFF0CY \u5411\u540E\uFF0CZ \u9AD8\u4E8E\u4E0B\u5C42\u8868\u9762\u3002\u767D\u70B9\u4E3A\u5F53\u524D\u5DE5\u5177\uFF0C\u91D1\u8272\u4E3A\u89C4\u5212\u7BB1\u5B50\u3002\u586B\u5165\u76EE\u6807\u4E0D\u4F1A\u79FB\u52A8\u673A\u68B0\u81C2\uFF1B\u5148\u5B89\u5168\u63A5\u8FD1\uFF0C\u518D\u4E0B\u964D\u3002")}</p>`,k("reference-box").onchange=g=>{ni=g.target.value,_p()},k("reference-fill")?.addEventListener("click",()=>{Vn=!0,zt="bed",Ft=fc(h,n),dn=t?0:l.turn,un="xyz",Ds(),$t(),fn(),bt("ready",D("Target filled. Plan an approach before moving.","\u5DF2\u586B\u5165\u76EE\u6807\u3002\u79FB\u52A8\u524D\u8BF7\u89C4\u5212\u63A5\u8FD1\u8DEF\u7EBF\u3002"))})}function hv(){Su()}function uv(){let i=document.querySelector('#coordinate-frame option[value="bed"]');i&&(i.textContent=_e.spec.mode==="shelf"?D("Shelf zero","\u8D27\u67B6\u96F6\u70B9"):D("Truck-bed zero","\u8F66\u53A2\u96F6\u70B9")),k("coordinate-frame").value=zt,k("set-zero").textContent=Vn?D("Work zero \u2713","\u5DE5\u4F5C\u96F6\u70B9 \u2713"):D("Set work zero\u2026","\u8BBE\u7F6E\u5DE5\u4F5C\u96F6\u70B9\u2026"),k("frame-note").textContent=zt==="bed"?D("Z 0 = loading surface","Z 0 = \u88C5\u8F7D\u8868\u9762"):D("Fixed robot reference","\u673A\u5668\u4EBA\u56FA\u5B9A\u53C2\u8003"),Bt.setWorkFrame(Vn?Pi(_e.spec):null)}function qo(){if(Et||ot)return;let[i,e,t]=Pi(_e.spec),n=it(tt).tip,s=Rs(n,[i,e,t]),[r,o]=_e.spec.size;Bt.setWorkFrame([i,e,t]),Jt(on(D("Give the work area its own zero.","\u7ED9\u5DE5\u4F5C\u533A\u8BBE\u7F6E\u4E00\u4E2A\u5C40\u90E8\u96F6\u70B9\u3002"),D("LOCAL COORDINATES \u2022 A KNOWN REFERENCE","\u5C40\u90E8\u5750\u6807 \xB7 \u5DF2\u77E5\u53C2\u8003\u70B9"))+`
 <p class="lead">${D("Choose the marked lower-left corner on the loading surface as (0, 0, 0). Measure every placement from the same point.","\u9009\u53D6\u88C5\u8F7D\u8868\u9762\u6807\u8BB0\u7684\u5DE6\u4E0B\u89D2\u4F5C\u4E3A (0, 0, 0)\uFF0C\u6240\u6709\u653E\u7F6E\u4F4D\u7F6E\u90FD\u4ECE\u540C\u4E00\u70B9\u6D4B\u91CF\u3002")}</p>
 <div class="zero-layout"><svg viewBox="0 0 300 205" role="img" aria-label="${D("Bed origin at the lower-left corner, X right, Y up, Z above the surface","\u8F66\u53A2\u539F\u70B9\u5728\u5DE6\u4E0B\u89D2\uFF0CX \u5411\u53F3\uFF0CY \u5411\u4E0A\uFF0CZ \u9AD8\u4E8E\u8868\u9762")}"><rect x="48" y="28" width="210" height="130" fill="#264963" stroke="#e5c589"/><path d="M48 158H282 M48 158V9" stroke="#e5c589" stroke-width="3"/><path d="m274 152 8 6-8 6 M42 17l6-8 6 8" fill="none" stroke="#e5c589" stroke-width="3"/><circle cx="48" cy="158" r="7" fill="#ffe1a1"/><g fill="#f9e3b4" font-size="12"><text x="268" y="184">+X</text><text x="16" y="18">+Y</text><text x="53" y="181">O (0, 0, 0)</text><text x="132" y="18">${r} mm</text><text x="263" y="95">${o}</text><text x="115" y="99">Z = 0</text></g></svg><div><b>${D("The robot does not move. The numbers change.","\u673A\u5668\u4EBA\u4E0D\u52A8\uFF0C\u5750\u6807\u6570\u503C\u6539\u53D8\u3002")}</b><p>${D("Robot position of this zero","\u6B64\u96F6\u70B9\u7684\u673A\u5668\u4EBA\u5750\u6807")}:<br><b>X ${i} \xB7 Y ${e} \xB7 Z ${t} mm</b></p><p>${D("Tool now, measured from the bed","\u5DE5\u5177\u5F53\u524D\u76F8\u5BF9\u8F66\u53A2\u7684\u4F4D\u7F6E")}:<br><b>${s.map((a,l)=>"XYZ"[l]+" "+Pn(a)).join(" \xB7 ")} mm</b></p></div></div>
 <div class="callout">${D("Local position = robot position \u2212 bed origin. Axes stay parallel. This sets a simulated work reference; it does not home the robot or touch the bed with the gripper. Saved program positions stay unchanged.","\u5C40\u90E8\u5750\u6807 = \u673A\u5668\u4EBA\u5750\u6807 \u2212 \u8F66\u53A2\u539F\u70B9\u3002\u5404\u8F74\u65B9\u5411\u4E0D\u53D8\u3002\u8FD9\u662F\u5728\u4EFF\u771F\u4E2D\u8BBE\u7F6E\u5DE5\u4EF6\u53C2\u8003\u70B9\uFF0C\u4E0D\u662F\u673A\u5668\u4EBA\u56DE\u96F6\uFF0C\u4E5F\u4E0D\u9700\u8981\u7528\u5939\u722A\u63A5\u89E6\u5E95\u677F\u3002\u5DF2\u6709\u7A0B\u5E8F\u4F4D\u7F6E\u4FDD\u6301\u4E0D\u53D8\u3002")}</div>
 <div class="actions"><button id="confirm-zero" class="primary">${D("Set this corner to (0, 0, 0)","\u5C06\u6B64\u89D2\u70B9\u8BBE\u4E3A (0, 0, 0)")}</button><button id="zero-lesson">${D("Predict a placement","\u9884\u6D4B\u4E00\u6B21\u653E\u7F6E\u4F4D\u7F6E")}</button></div>`),k("confirm-zero").onclick=()=>{Vn=!0,zt="bed",xi(),$t(),fn(),Zt.close(),xt>=0&&!k("guide").hidden&&Ot(),bt("ready",D("Bed zero set. Enter offsets from the marked corner; Z is height above the deck.","\u5DF2\u8BBE\u7F6E\u8F66\u53A2\u96F6\u70B9\u3002\u8BF7\u8F93\u5165\u76F8\u5BF9\u6807\u8BB0\u89D2\u70B9\u7684\u504F\u79FB\u91CF\uFF1BZ \u8868\u793A\u9AD8\u4E8E\u5E95\u677F\u7684\u9AD8\u5EA6\u3002"))},k("zero-lesson").onclick=dv}function dv(){Jt(on(D("Predict \u2192 test \u2192 explain","\u9884\u6D4B \u2192 \u6D4B\u8BD5 \u2192 \u89E3\u91CA"),D("POSITION IS ALWAYS RELATIVE TO SOMETHING","\u4F4D\u7F6E\u603B\u662F\u76F8\u5BF9\u67D0\u4E2A\u53C2\u8003\u70B9\u800C\u8A00"))+`<p class="lead">${D("Box A is 60 \xD7 40 \xD7 20 mm. Its lower-left corner will sit at bed (0, 0). Where must the tool be at its top centre?","\u7BB1\u5B50 A \u7684\u5C3A\u5BF8\u4E3A 60 \xD7 40 \xD7 20 mm\uFF0C\u5DE6\u4E0B\u89D2\u653E\u5728\u8F66\u53A2 (0, 0)\u3002\u5DE5\u5177\u5E94\u5230\u8FBE\u7BB1\u9876\u4E2D\u5FC3\u7684\u4EC0\u4E48\u4F4D\u7F6E\uFF1F")}</p><div class="callout">${D("Use the bed surface as Z = 0. The box has width and length: targeting the corner will leave part of it outside the truck.","\u4EE5\u8F66\u53A2\u8868\u9762\u4E3A Z = 0\u3002\u7BB1\u5B50\u6709\u957F\u548C\u5BBD\uFF1B\u628A\u4E2D\u5FC3\u79FB\u5230\u89D2\u70B9\uFF0C\u4F1A\u4F7F\u4E00\u90E8\u5206\u7BB1\u4F53\u8D85\u51FA\u8F66\u53A2\u3002")}</div><div class="prediction-fields">${["X","Y","Z"].map(i=>`<label>${i} (mm)<input id="predict-${i}" type="number" aria-label="${D("Predicted bed","\u9884\u6D4B\u8F66\u53A2")} ${i}"></label>`).join("")}</div><p id="zero-feedback" class="feedback"></p><div class="actions"><button id="check-prediction" class="primary">${D("Check prediction","\u68C0\u67E5\u9884\u6D4B")}</button><button id="return-zero">${D("Back to zero setup","\u8FD4\u56DE\u96F6\u70B9\u8BBE\u7F6E")}</button></div><p>${D("After testing, explain why Z = 0 is the bed surface, not the tool height for placing this box. Try a 90\xB0 turn: which coordinates exchange roles?","\u6D4B\u8BD5\u540E\u89E3\u91CA\uFF1A\u4E3A\u4EC0\u4E48 Z = 0 \u8868\u793A\u5E95\u677F\u8868\u9762\uFF0C\u800C\u4E0D\u662F\u653E\u7F6E\u8FD9\u4E2A\u7BB1\u5B50\u65F6\u7684\u5DE5\u5177\u9AD8\u5EA6\uFF1F\u518D\u5C1D\u8BD5\u65CB\u8F6C 90\xB0\uFF1A\u54EA\u4E9B\u5750\u6807\u4F1A\u4EA4\u6362\uFF1F")}</p>`),k("return-zero").onclick=qo,k("check-prediction").onclick=()=>{let i=["X","Y","Z"].map(t=>k("predict-"+t).value===""?NaN:Number(k("predict-"+t).value)),e=sp([0,0],[60,40,20]);if(i.some((t,n)=>t!==e[n])){k("zero-feedback").textContent=D("Measure from the corner to the centre: half of 60, half of 40, and the full 20 mm height above the bed.","\u4ECE\u89D2\u70B9\u5230\u4E2D\u5FC3\uFF1A60 \u7684\u4E00\u534A\u300140 \u7684\u4E00\u534A\uFF0C\u4EE5\u53CA\u9AD8\u4E8E\u5E95\u677F\u7684\u5B8C\u6574\u7BB1\u9AD8 20 mm\u3002");return}k("zero-feedback").textContent=D("Correct: local (30, 20, 20). Add the work origin to get robot coordinates. Approach before lowering.","\u6B63\u786E\uFF1A\u5C40\u90E8\u5750\u6807 (30,20,20)\u3002\u52A0\u4E0A\u5DE5\u4F5C\u539F\u70B9\u53EF\u5F97\u673A\u5668\u4EBA\u5750\u6807\u3002\u5148\u63A5\u8FD1\uFF0C\u518D\u4E0B\u964D\u3002"),k("check-prediction").textContent=D("Set zero & fill this target","\u8BBE\u7F6E\u96F6\u70B9\u5E76\u586B\u5165\u76EE\u6807"),k("check-prediction").onclick=()=>{Vn=!0,zt="bed",un="xyz",Ft=fc(e,Pi(_e.spec)),dn=0,Ds(),$t(),fn(),Zt.close(),bt("ready",D("Target filled, robot unchanged. Plan your approach before pressing Move.","\u5DF2\u586B\u5165\u76EE\u6807\uFF0C\u673A\u5668\u4EBA\u672A\u79FB\u52A8\u3002\u70B9\u51FB\u79FB\u52A8\u524D\u8BF7\u5148\u89C4\u5212\u63A5\u8FD1\u8DEF\u7EBF\u3002"))}}}Zt.addEventListener("close",()=>Bt.setWorkFrame(Vn?Pi(_e.spec):null));})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
