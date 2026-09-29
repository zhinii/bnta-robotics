"use strict";(()=>{var Ju=1.3333333333333333;function kp(i,e,t,n=!1){return!n&&i>=630&&(i/Ju+t>e+1||t>e/2)}function zp(){let i=document.querySelector(".workspace"),e=document.getElementById("controls"),t=document.querySelector(".scene-stage"),n=document.getElementById("viewport");if(!i||!e||!t||!n)return;let s=!1,r=()=>{let l=document.body.classList.contains("controls-column")?Math.min(t.clientWidth,t.clientHeight*Ju):t.clientWidth,c=`${Math.max(1,l)}px`;n.style.getPropertyValue("--scene-width")!==c&&n.style.setProperty("--scene-width",c)},o=()=>{s=!1;let l=e.scrollTop;document.body.classList.remove("controls-column");let c=i.clientWidth,h=i.clientHeight,d=e.getBoundingClientRect().height;document.body.classList.toggle("controls-column",kp(c,h,d,innerWidth<=720)),e.scrollTop=l,r()},a=()=>{s||(s=!0,requestAnimationFrame(o))};new ResizeObserver(a).observe(i),new ResizeObserver(r).observe(t),new MutationObserver(a).observe(e,{childList:!0,subtree:!0,characterData:!0,attributes:!0,attributeFilter:["hidden","open"]}),window.addEventListener("resize",a),document.fonts?.ready.then(a),a()}typeof document<"u"&&zp();var qn=[{name:"base",axis:[0,0,1],length:0,limits:[-180,180],home:0},{name:"shoulder",axis:[0,-1,0],length:160,limits:[-20,150],home:55},{name:"elbow",axis:[0,-1,0],length:140,limits:[-150,150],home:-85},{name:"swivel",axis:[0,0,1],length:70,limits:[-150,150],home:0},{name:"wristPitch",axis:[0,-1,0],length:55,limits:[-120,120],home:30},{name:"toolRoll",axis:[1,0,0],length:35,limits:[-180,180],home:0}],Un={base:70,upper:160,fore:140,limits:qn.map(i=>i.limits),home:qn.slice(0,3).map(i=>i.home)},Qr=i=>qn.slice(0,i).map(e=>e.home),Hp=i=>qn.slice(0,i).reduce((e,t)=>e+t.length,0),Xn=Math.PI/180,Vp=[1,0,0,0,1,0,0,0,1],Gp=(i,e)=>i.map((t,n)=>t+e[n]),Ku=(i,e)=>i.map((t,n)=>t-e[n]),Wp=(i,e)=>[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]],$p=i=>[i[0],i[3],i[6],i[1],i[4],i[7],i[2],i[5],i[8]],ti=(i,e)=>[0,1,2].map(t=>i[t*3]*e[0]+i[t*3+1]*e[1]+i[t*3+2]*e[2]);function ni(i,e){return Array.from({length:9},(t,n)=>{let s=Math.floor(n/3),r=n%3;return i[s*3]*e[r]+i[s*3+1]*e[r+3]+i[s*3+2]*e[r+6]})}function ha([i,e,t],n){let s=Math.cos(n),r=Math.sin(n),o=1-s;return[o*i*i+s,o*i*e-r*t,o*i*t+r*e,o*i*e+r*t,o*e*e+s,o*e*t-r*i,o*i*t-r*e,o*e*t+r*i,o*t*t+s]}function ua([i,e,t]){return ni(ni(ha([0,0,1],t*Xn),ha([0,1,0],e*Xn)),ha([1,0,0],i*Xn))}function Xp(i,e){let t=ni(i,$p(e)),n=Math.acos(Math.max(-1,Math.min(1,(t[0]+t[4]+t[8]-1)/2)));if(n<1e-8)return[0,0,0];let s=[t[7]-t[5],t[2]-t[6],t[3]-t[1]];if(Math.PI-n<1e-5){let r=[t[0],t[4],t[8]].indexOf(Math.max(t[0],t[4],t[8]));s=[0,0,0],s[r]=Math.sqrt(Math.max(0,(t[r*3+r]+1)/2));for(let o=0;o<3;o++)o!==r&&(s[o]=(t[r*3+o]+t[o*3+r])/(4*s[r]));return s.map(o=>o*n)}return s.map(r=>r*n/(2*Math.sin(n)))}function Yc(i){let e=[0,0,Un.base],t=[...Vp],n=[[...e]],s=[],r=[],o=[];i.forEach((h,d)=>{let m=qn[d];s.push([...e]),r.push(ti(t,m.axis)),t=ni(t,ha(m.axis,h*Xn)),o.push([...t]),m.length&&(e=Gp(e,ti(t,[m.length,0,0])),n.push([...e]))});let a=Math.asin(Math.max(-1,Math.min(1,-t[6]))),l=Math.abs(Math.cos(a))<1e-7,c=[l?0:Math.atan2(t[7],t[8]),a,l?Math.atan2(-t[1],t[4]):Math.atan2(t[3],t[0])].map(h=>h/Xn);return{elbow:n[1],tip:e,points:n,origins:s,axes:r,frames:o,rotation:t,rpy:c}}var Zc=40,qp=[0,0,-1,0,1,0,1,0,0];function it(i){let e=Yc(i),t=ti(e.rotation,[Zc,0,0]),n=ni(e.rotation,qp),s=Math.asin(Math.max(-1,Math.min(1,-n[6]))),r=Math.abs(Math.cos(s))<1e-7;return{...e,flange:[...e.tip],tip:e.tip.map((o,a)=>o+t[a]),rotation:n,rpy:[r?0:Math.atan2(n[7],n[8]),s,r?Math.atan2(-n[1],n[4]):Math.atan2(n[3],n[0])].map(o=>o/Xn)}}var da=i=>Hp(i)+Zc;function vi(i){if(!Array.isArray(i)||i.length<3||i.length>6||i.some((t,n)=>!Number.isFinite(t)||t<qn[n].limits[0]-1e-7||t>qn[n].limits[1]+1e-7))return!1;let{points:e}=Yc(i);return e.slice(1).every((t,n)=>t[2]>=(n===e.length-2?12:18))}var Ut=(i,e)=>Math.hypot(...i.map((t,n)=>t-e[n]));function eo(i,e){if(i.length!==e.length||!vi(i)||!vi(e))return!1;let t=Math.max(1,Math.ceil(Math.max(...i.map((n,s)=>Math.abs(n-e[s])))/.5));for(let n=0;n<=t;n++)if(!vi(i.map((s,r)=>s+(e[r]-s)*n/t)))return!1;return!0}function Yp(i,e,t,n=Un.fore){let[s,r,o]=i,a=Math.hypot(s,r),l=o-Un.base,c=(a*a+l*l-Un.upper**2-n**2)/(2*Un.upper*n);if(c>1+1e-9||c<-1-1e-9)return{error:"reach"};let h=[];for(let m of[1,-1])for(let f of[-1,1]){let g=a<1e-8?e[0]:Math.atan2(r,s)/Xn+(m===-1?180:0);for(;g>180;)g-=360;for(;g<-180;)g+=360;let _=f*Math.acos(Math.max(-1,Math.min(1,c))),p=Math.atan2(l,m*a)-Math.atan2(n*Math.sin(_),Un.upper+n*Math.cos(_)),u=[g,p/Xn,_/Xn];vi(u)&&(t==="nearest"||(t==="negative"?u[2]<=0:u[2]>=0))&&h.push(u)}if(h.sort((m,f)=>Ut(m,e)-Ut(f,e)),!h.length)return{error:"limits"};let d=h.find(m=>eo(e,m));return d?{q:d}:{error:"path"}}function Zp(i,e){let t=i.map((s,r)=>[...s,e[r]]),n=t.length;for(let s=0;s<n;s++){let r=s;for(let a=s+1;a<n;a++)Math.abs(t[a][s])>Math.abs(t[r][s])&&(r=a);if([t[s],t[r]]=[t[r],t[s]],Math.abs(t[s][s])<1e-12)return null;let o=t[s][s];for(let a=s;a<=n;a++)t[s][a]/=o;for(let a=0;a<n;a++)if(a!==s){let l=t[a][s];for(let c=s;c<=n;c++)t[a][c]-=l*t[s][c]}}return t.map(s=>s[n])}function jp(i,e,t,n=Yc){let s=e.length,r=Math.atan2(i[1],i[0])/Xn,o=[[...e],Qr(s)];for(let l of[25,70,120])for(let c of[-110,-45,65]){let h=Qr(s);h[0]=r,h[1]=l,h[2]=c,s>=4&&(h[3]=l===120?70:-35),o.push(h)}let a=!1;for(let l of o){let c=[...l];for(let h=0;h<280;h++){let d=n(c),m=Ku(i,d.tip),f=t?Xp(t,d.rotation):[],g=[...m,...f.map(w=>w*90)];if(Math.hypot(...m)<.12&&(!t||Math.hypot(...f)<.004)){if(vi(c)){if(eo(e,c))return{q:c};a=!0}break}let _=d.axes.map((w,C)=>[...Wp(w,Ku(d.tip,d.origins[C])).map(L=>L*Xn),...t?w.map(L=>L*Xn*90):[]]),p=g.length,u=Array.from({length:p},(w,C)=>Array.from({length:p},(L,v)=>_.reduce((S,I)=>S+I[C]*I[v],0)+(C===v?.45:0))),b=Zp(u,g);if(!b)break;let E=_.map(w=>w.reduce((C,L,v)=>C+L*b[v],0)),x=Math.max(...E.map(Math.abs));x>9&&(E=E.map(w=>w*9/x));let T=c.map((w,C)=>Math.max(qn[C].limits[0],Math.min(qn[C].limits[1],w+E[C])));if(Ut(T,c)<1e-7)break;c=T}}return{error:a?"path":"solve"}}function Ji(i,e=Un.home,t="nearest",n=null){return!Array.isArray(i)||i.length!==3||i.some(s=>!Number.isFinite(s))?{error:"numbers"}:vi(e)?n&&(e.length!==6||!Array.isArray(n)||n.length!==3||n.some(s=>!Number.isFinite(s)||Math.abs(s)>180))?{error:"orientationInvalid"}:Ut(i,[0,0,Un.base])>da(e.length)+1e-7?{error:"reach"}:i[2]<12?{error:"limits"}:e.length===3?Yp(i,e,t,Un.fore+Zc):jp(i,e,n?ua(n):null,it):{error:"limits"}}var ln={open:27,thickness:6,min:3,xHalf:6,zMin:-13,zMax:19,capacity:42},Jp=[1,0,0,0,1,0,0,0,1];function js(i,e){let t=e.rotation,n=[t[0],t[3],t[6],t[1],t[4],t[7],t[2],t[5],t[8]],s=ti(n,i.center.map((h,d)=>h-e.tip[d])),r=ni(n,i.rotation||Jp),o=[0,1,2].map(h=>i.size.reduce((d,m,f)=>d+Math.abs(r[3*h+f])*m/2,0)),a=s.map((h,d)=>h-o[d]),l=s.map((h,d)=>h+o[d]),c=a[0]<ln.xHalf&&l[0]>-ln.xHalf&&a[2]<ln.zMax&&l[2]>ln.zMin;return{min:a,max:l,overlap:c,width:l[1]-a[1],fits:c&&a[1]>=-24&&l[1]<=24}}function jc(i,e){let t=-ln.min,n=ln.min;for(let s of i){let r=js(s,e);!r.overlap||r.min[1]>30||r.max[1]<-30||(t=Math.min(t,r.min[1]-ln.thickness/2),n=Math.max(n,r.max[1]+ln.thickness/2))}return[t,n]}var Kp=[1,0,0,0,1,0,0,0,1];function It(i){let e=i.size.map(s=>s/2),t=i.rotation||Kp,n=[0,1,2].map(s=>Math.abs(t[3*s])*e[0]+Math.abs(t[3*s+1])*e[1]+Math.abs(t[3*s+2])*e[2]);return{min:i.center.map((s,r)=>s-n[r]),max:i.center.map((s,r)=>s+n[r]),extent:n}}function fa(){return Array.from({length:6},(i,e)=>({id:String.fromCharCode(65+e),column:e%3,row:Math.floor(e/3),min:[74+e%3*70,70,20+Math.floor(e/3)*110],max:[136+e%3*70,150,124+Math.floor(e/3)*110]}))}function Qu(){let i=(e,t)=>({min:e,max:t});return[...[20,130,240].map(e=>i([66,70,e-6],[284,154,e])),...[70,140,210,280].map(e=>i([e-2,70,14],[e+2,154,240])),i([66,150,14],[284,154,240])]}function pa(i){let e=fa().find(t=>t.id===i);return[(e.min[0]+e.max[0])/2,110,e.min[2]+20]}function ed(i){let e=It(i);return fa().find(t=>e.min[0]>=t.min[0]-.2&&e.max[0]<=t.max[0]+.2&&e.min[1]>=t.min[1]-.2&&e.max[1]<=t.max[1]+.2&&e.min[2]>=t.min[2]-1&&e.max[2]<=t.max[2])}function ma(i){return["sx","sy","sz","upper"].every((e,t)=>Number(i[e])===[35,40,20,130][t])}var td=(i,e)=>i.min.every((t,n)=>t<e.max[n]-.5&&i.max[n]>e.min[n]+.5);function Qp(i,e=null,t=!1){let n=e&&js(e,i),r=(t?n?[n.min[1]-3,n.max[1]+3]:[-3,3]:[-ln.open,ln.open]).map(o=>({center:[0,o,3],size:[12,6,32]}));return r.push({center:[0,0,23],size:[22,54,12]},{center:[0,0,34],size:[26,26,16]}),r.map(o=>It({center:ti(i.rotation,o.center).map((a,l)=>a+i.tip[l]),size:o.size,rotation:i.rotation}))}function ga(i,e,t,n,s=[]){return Qp(i,e,t).some(o=>s.some(a=>td(o,a))||n.some(a=>a.id!==e?.id&&td(o,It(a))))}function nd(i,e,t,n=0){let s=0,r=1;for(let o=0;o<3;o++){let a=e[o]-i[o],l=t.min[o]-n,c=t.max[o]+n;if(Math.abs(a)<1e-8){if(i[o]<l||i[o]>c)return!1;continue}let h=(l-i[o])/a,d=(c-i[o])/a;if(s=Math.max(s,Math.min(h,d)),r=Math.min(r,Math.max(h,d)),s>r)return!1}return!0}function id(i,e){return e.some(t=>i.points.slice(1).some((n,s)=>nd(i.points[s],n,t,Math.max(9,18-s*2)))||i.origins.slice(1).some((n,s)=>nd(n,n,t,Math.max(18,31-s*3))))}var em=[1,0,0,0,1,0,0,0,1],no=[["A",60,40],["B",60,40],["C",40,40],["D",40,40],["E",40,20],["F",40,20]],bs=typeof document<"u"&&document.documentElement.dataset?.edition==="public"?["#ffbc4b","#ff875c","#50badd","#87a3ff","#c5a3e6","#8dc994"]:["#e5bd75","#d99954","#70b9d6","#538bad","#b1c9df","#90a9c9"],Jc={xy:5,angle:5,height:8},sd=i=>[i[0],i[3],i[6],i[1],i[4],i[7],i[2],i[5],i[8]],to=(i,e)=>i.min.every((t,n)=>t<e.max[n]-.5&&i.max[n]>e.min[n]+.5);function tm(i="mission"){return{mode:i,size:i==="explore"?[200,160]:i==="practice"?[120,80]:i==="transfer"?[180,140]:i==="shelf"?[210,80]:i==="stacking"?[120,100]:[160,140],origin:i==="shelf"?[70,70]:i==="practice"?[140,70]:[100,50],deck:20,stock:i==="practice"?no.slice(0,1):no,...i==="shelf"?{cells:fa(),solids:Qu()}:i==="stacking"?{person:{center:[185,4,0],height:85},solids:[{min:[145,-12,0],max:[225,20,85]}]}:{}}}function si(i,e=0){let t=no.find(n=>n[0]===i);return t?e%180===0?t.slice(1):[t[2],t[1]]:null}function Js(i,e){let t=[],n=[];for(let[s]of e.stock){let r=i[s];if(!r){t.push({code:"missing",id:s});continue}if(![r.x,r.y,r.turn].every(Number.isFinite)||![0,90].includes(r.turn)){t.push({code:"invalid",id:s});continue}let[o,a]=si(s,r.turn),l=r.z??0,c={id:s,x:r.x,y:r.y,w:o,h:a,z:l};[0,...e.mode==="stacking"?[20]:[]].includes(l)||t.push({code:"level",id:s}),(c.x<0||c.y<0||c.x+o>e.size[0]||c.y+a>e.size[1])&&t.push({code:"outside",id:s});for(let h of n)Math.abs(c.z-h.z)<20&&c.x<h.x+h.w&&c.x+o>h.x&&c.y<h.y+h.h&&c.y+a>h.y&&t.push({code:"overlap",id:s,other:h.id});n.push(c)}if(e.mode==="stacking"){for(let s of n.filter(r=>r.z===20))n.some(r=>r.z===0&&s.x>=r.x&&s.y>=r.y&&s.x+s.w<=r.x+r.w&&s.y+s.h<=r.y+r.h)||t.push({code:"support",id:s.id});n.filter(s=>s.z===20).length<3&&t.push({code:"stackCount"})}return{ok:!t.length,errors:t,rectangles:n,area:e.stock.reduce((s,r)=>s+r[1]*r[2],0),bedArea:e.size[0]*e.size[1]}}function rd(i,e,t){if(t.mode==="shelf")return pa(i);let n=e[i],s=si(i,n.turn);return[t.origin[0]+n.x+s[0]/2,t.origin[1]+n.y+s[1]/2,t.deck+(n.z||0)+20]}function nm(i,e){let t=It(i),n=e.spec.deck;if(e.spec.mode!=="stacking")return n;let s=e.objects.filter(r=>r.id!==i.id&&r.placed).map(It).filter(r=>r.max[2]<=t.min[2]+8&&r.max[2]>n&&[0,1].every(o=>t.min[o]>=r.min[o]-.2&&t.max[o]<=r.max[o]+.2));return Math.max(n,...s.map(r=>r.max[2]))}function Ki(){return Ji([180,-30,155],Qr(6),"nearest",[0,0,0]).q||Qr(6)}function od(i,e){let t=e.spec,n=It(i),s=Math.atan2(i.rotation[3],i.rotation[0])*180/Math.PI,r=Math.round(s/90)*90;if(i.rotation[8]<.98||Math.abs(s-r)>Jc.angle)return null;let o=ua([0,0,r]),a=It({...i,center:[0,0,0],rotation:o}).max,l={min:[...t.origin,t.deck],max:[t.origin[0]+t.size[0],t.origin[1]+t.size[1],t.deck]},c=t.mode==="shelf"?t.cells.map(h=>({min:h.min,max:[h.max[0],h.max[1],h.min[2]]})):[l];t.mode==="stacking"&&c.push(...e.objects.filter(h=>h.id!==i.id&&h.placed).map(It).filter(h=>h.max[2]<=t.deck+20.2)),c.sort((h,d)=>d.max[2]-h.max[2]);for(let h of c){let d=h.max[2];if(n.min[2]<d-1||n.min[2]>d+Jc.height||[0,1].some(_=>h.max[_]-h.min[_]<a[_]*2-.01))continue;let m=i.center.map((_,p)=>p<2?Math.max(h.min[p]+a[p],Math.min(h.max[p]-a[p],Math.round(_/5)*5)):d+i.size[2]/2);if(m.some((_,p)=>p<2&&Math.abs(_-i.center[p])>Jc.xy))continue;let f={...i,center:m,rotation:o},g=It(f);if(!(![0,1].every(_=>g.min[_]>=t.origin[_]-.01&&g.max[_]<=t.origin[_]+t.size[_]+.01)||e.objects.some(_=>_.id!==i.id&&to(g,It(_)))))return{candidate:f,angle:r-s}}return null}var ii=class{constructor(e="mission"){this.reset(e)}reset(e=this.spec?.mode||"mission"){this.spec=tm(e),this.objects=this.spec.stock.map(([t,n,s],r)=>({id:t,size:[n,s,20],center:[120+r%3*80,-155+Math.floor(r/3)*80,10],rotation:[...em],placed:!1})),this.output=!1,this.held=null,this.offset=null,this.localRotation=null,this.travel=0,this.moves=0,this.faults=0,this.drops=0,this.last="ready"}get input(){return!!this.held}get score(){return this.objects.filter(e=>e.placed).length}get heldObject(){return this.objects.find(e=>e.id===this.held)}heldPose(e){if(!this.held)return null;let t=it(e);return{...this.heldObject,center:t.tip.map((n,s)=>n+ti(t.rotation,this.offset)[s]),rotation:ni(t.rotation,this.localRotation)}}update(e){this.held&&Object.assign(this.heldObject,this.heldPose(e))}command(e,t){if(this.update(t),this.output=e,e){if(this.held)return this.last="held";let x=it(t),T=this.objects.filter(C=>Ut([C.center[0],C.center[1],C.center[2]+10],x.tip)<=18).sort((C,L)=>Ut(C.center,x.tip)-Ut(L.center,x.tip))[0];if(!T)return this.last="noContact";if(x.rotation[8]<.85)return this.last="tilt";if(js(T,x).width>42)return this.last="wide";let w=It(T);return this.objects.some(C=>{if(C.id===T.id)return!1;let L=It(C);return Math.abs(L.min[2]-w.max[2])<1&&[0,1].every(v=>L.max[v]>w.min[v]&&L.min[v]<w.max[v])})?this.last="supportsLoad":(T.center=[x.tip[0],x.tip[1],Math.max(T.center[2],x.tip[2]-10)],T.placed=!1,this.held=T.id,this.offset=ti(sd(x.rotation),T.center.map((C,L)=>C-x.tip[L])),this.localRotation=ni(sd(x.rotation),T.rotation),this.last="grasped")}if(!this.held)return this.last="open";if(ga(it(t),this.heldObject,!1,this.objects,this.spec.solids||[]))return this.output=!0,this.last="fingers";let n=this.heldObject,s=this.spec,r=od(n,this);r&&Object.assign(n,r.candidate);let o=It(n),a=s.mode==="shelf"?ed(n):null,l=s.mode==="shelf"?!!a:[0,1].every(x=>o.min[x]>=s.origin[x]-1&&o.max[x]<=s.origin[x]+s.size[x]+1);if(o.max[0]>s.origin[0]&&o.min[0]<s.origin[0]+s.size[0]&&o.max[1]>s.origin[1]&&o.min[1]<s.origin[1]+s.size[1]&&!l)return this.output=!0,this.last="edge";let h=l?a?a.min[2]:nm(n,this):0,d=o.min[2]>=h-1&&o.min[2]<=h+8,m=n.rotation[8]>.98;if(s.mode==="stacking"&&l&&o.min[2]>=s.deck+19&&h===s.deck)return this.output=!0,this.last="support";if(s.mode==="stacking"&&h>s.deck+1&&h!==s.deck+20)return this.output=!0,this.last="support";let f=Math.atan2(n.rotation[3],n.rotation[0])*180/Math.PI,g=Math.round(f/90)*90;m&&Math.abs(f-g)<3&&(n.rotation=ua([0,0,g]));let _=[...n.center],p={...n,center:_};p.center[2]=h+10;let u=It(p),b=[0,1].every(x=>u.min[x]>=s.origin[x]-.2&&u.max[x]<=s.origin[x]+s.size[x]+.2);return this.objects.some(x=>x.id!==n.id&&to(u,It(x)))?(this.output=!0,this.last="occupied"):(Object.assign(n,p),n.placed=l&&b&&d&&m&&(!a||a.id===n.id),this.held=null,this.offset=null,this.localRotation=null,d?this.last=n.placed?"placed":s.mode==="explore"?"released":a&&a.id!==n.id?"wrongCell":"outside":(this.drops++,this.faults++,this.last="drop"))}collision(e){let t=it(e),n=this.spec;if(t.tip[2]<12)return"floor";if(n.mode==="stacking"&&id(t,n.solids))return"obstacle";if(ga(t,this.heldPose(e),this.output,[],n.solids||[]))return n.mode==="shelf"?"shelfCollision":"obstacle";if(ga(t,this.heldPose(e),this.output,this.objects))return"fingers";if(t.tip[0]>n.origin[0]&&t.tip[0]<n.origin[0]+n.size[0]&&t.tip[1]>n.origin[1]&&t.tip[1]<n.origin[1]+n.size[1]&&t.tip[2]<n.deck+12)return"deck";let r=this.heldPose(e);if(r){let o=It(r);if(o.min[2]<-.7)return"floor";if((n.solids||[]).some(l=>to(o,l)))return n.mode==="shelf"?"shelfCollision":"obstacle";let a={min:[...n.origin,0],max:[n.origin[0]+n.size[0],n.origin[1]+n.size[1],n.deck]};if(to(o,a))return"deck";if(this.objects.some(l=>l.id!==r.id&&to(o,It(l))))return"cargo"}else if(this.objects.some(o=>{let a=It(o);return t.tip[0]>a.min[0]+2&&t.tip[0]<a.max[0]-2&&t.tip[1]>a.min[1]+2&&t.tip[1]<a.max[1]-2&&t.tip[2]<a.max[2]-7}))return"cargo";return null}checkMove(e,t){if(!eo(e,t))return{error:"limits",q:[...t]};let n=Math.max(1,Math.ceil(Math.max(...e.map((s,r)=>Math.abs(s-t[r])))/1));for(let s=0;s<=n;s++){let r=e.map((a,l)=>a+(t[l]-a)*s/n),o=this.collision(r);if(o)return{error:o,q:r}}return null}canMove(e,t){return this.checkMove(e,t)?.error||null}snapshot(){return{...this.spec,tool:"gripper",output:this.output,held:this.held,score:this.score,objects:this.objects}}};function vs(i,e,t,n=0,s={}){if(!Array.isArray(t)||t.length!==3||t.some(p=>!Number.isFinite(p))||!Number.isFinite(n)||Math.abs(n)>180)return{error:"numbers"};if(t.some(p=>Math.abs(p)>600))return{error:"limits"};let r=s.orientation===void 0?[0,0,n]:s.orientation,o=s.path||"linear";if(!["linear","joint"].includes(o)||r!==null&&(!Array.isArray(r)||r.length!==3||r.some(p=>!Number.isFinite(p)||Math.abs(p)>180)))return{error:"numbers"};let a=(p,u)=>p[2]<12?"limits":r&&Ji(p,u,"nearest",null).q?"orientation":"solve";if(o==="joint"){let p=Ji(t,e,"nearest",r);if(!p.q)return{error:a(t,e),frames:[],blockedPoint:t};let u=i.checkMove(e,p.q);return u?{error:u.error,frames:[],collisionQ:u.q,blockedPoint:it(u.q).tip}:{frames:[p.q],assisted:!1}}let l=!1;if(i.held&&r&&Math.abs(r[0])<1&&Math.abs(r[1])<1){let p=Ji(t,e,"nearest",r);if(p.q){let u=i.heldPose(p.q),b=od(u,i);if(b){let E=t.map((x,T)=>x+b.candidate.center[T]-u.center[T]);l=Ut(E,t)>.1||Math.abs(b.angle)>.1,t=E,n+=b.angle,r=[...r],r[2]+=b.angle}}}let c=it(e),h=Math.max(i.spec.deck,...i.objects.filter(p=>p.id!==i.held).map(p=>It(p).max[2]))+(i.heldObject?.size[2]||20)+2;if(l&&c.tip[2]>=h&&c.tip[2]>t[2]+1){let p=vs(i,e,[t[0],t[1],c.tip[2]],n,{...s,orientation:r});if(p.error)return p;let u=vs(i,p.frames.at(-1),t,n,{...s,orientation:r});return u.error?{...u,frames:[...p.frames,...u.frames||[]]}:{frames:[...p.frames,...u.frames],assisted:!0}}let d=r?.map((p,u)=>(p-c.rpy[u]+540)%360-180),m=p=>(p+540)%360-180,f=Math.max(1,Math.ceil(Ut(c.tip,t)/7),Math.ceil(Math.max(...(d||[0]).map(Math.abs))/5)),g=e,_=[];for(let p=1;p<=f;p++){let u=c.tip.map((T,w)=>T+(t[w]-T)*p/f),b=d?c.rpy.map((T,w)=>m(T+d[w]*p/f)):null,E=Ji(u,g,"nearest",b);if(!E.q)return{error:a(u,g),frames:_,blockedPoint:u};let x=i.checkMove(g,E.q);if(x)return{error:x.error,frames:_,collisionQ:x.q,blockedPoint:it(x.q).tip};_.push(E.q),g=E.q}return{frames:_,assisted:l}}function im(i,e,t="x"){let n=t==="x"?0:1,s=t==="x"?"y":"x";return e.stock.map(([r],o)=>{let a=i[r];if(!a||![a.x,a.y,a.turn].every(Number.isFinite))return null;let l=si(r,a.turn);return{id:r,u:a[t],z:a.z||0,width:l[n],height:20,depth:a[s],color:bs[o]}}).filter(Boolean).sort((r,o)=>o.depth-r.depth)}function sm(i,e,t=85,n=1){return`<g transform="translate(${i} ${e}) scale(${t/85*n} ${t/85})" pointer-events="none"><circle cy="-76" r="7" fill="#e5bd91"/><path d="M-8 -81 Q0 -89 8 -81" fill="#e5c589"/><path d="M-10 -65 L10 -65 L12 -35 L-12 -35Z" fill="#e5c589"/><path d="M-10 -60 L-17 -38 M10 -60 L17 -38" stroke="#e5bd91" stroke-width="7" stroke-linecap="round"/><path d="M-6 -34 L-8 -5 M6 -34 L8 -5" stroke="#78a3ca" stroke-width="9" stroke-linecap="round"/><path d="M-13 -2h12 M3 -2h12" stroke="#bccddd" stroke-width="5"/></g>`}function rm(i,e,t,n,s){let r=t==="x"?0:1,o=e.size[r],a=e.person,l=a?e.solids[0]:null,c=l?Math.min(0,l.min[r]-e.origin[r]):0,h=l?Math.max(o,l.max[r]-e.origin[r]):o,d=c-27,m=h+14,f=-100,g=42,_=im(i,e,t).map(b=>`<g data-elevation-box="${b.id}" role="button" tabindex="0" aria-label="${b.id}" style="cursor:pointer"><rect x="${b.u}" y="${-b.z-b.height}" width="${b.width}" height="${b.height}" fill="${b.color}" fill-opacity=".72" stroke="${b.id===n?"#fff":"#afcadc"}" stroke-width="${b.id===n?2:1}"/><text x="${b.u+b.width/2}" y="${-b.z-7}" text-anchor="middle" font-size="8" fill="#071c2f" font-weight="bold">${b.id}</text></g>`).join(""),p=[0,20,40].map(b=>`<path d="M0 ${-b}H${o}" stroke="#8ba5b8" stroke-dasharray="2 3" opacity=".5"/><text x="-5" y="${-b+3}" text-anchor="end" fill="#e5d4b2" font-size="7">${b}</text>`).join(""),u=a?`<rect x="${l.min[r]-e.origin[r]}" y="${e.deck-a.height}" width="${l.max[r]-l.min[r]}" height="${a.height}" fill="#ffb269" fill-opacity=".06" stroke="#ffb269" stroke-dasharray="3 2"/>${sm(a.center[r]-e.origin[r],e.deck,a.height,t==="y"?.7:1)}<text x="${a.center[r]-e.origin[r]}" y="${e.deck-a.height-9}" text-anchor="middle" font-size="7" fill="#f4d6ac">${a.height} mm</text>`:"";return`<svg class="elevation-svg" data-elevation="${t}" viewBox="${d} ${f} ${m-d} ${g-f}" role="img" aria-label="${s(t==="x"?"Front elevation X Z":"Side elevation Y Z",t==="x"?"\u6B63\u89C6\u56FE X Z":"\u4FA7\u89C6\u56FE Y Z")}"><path d="M${c} ${e.deck}H${h}" stroke="#587b96"/><rect x="0" y="0" width="${o}" height="5" fill="#a3b9ca"/>${p}${u}${_}<path d="M0 0V-52M0 0H${o}" stroke="#e5c589"/><text x="3" y="-56" fill="#e5c589" font-size="8">Z \u2191</text><text x="0" y="33" fill="#e5c589" font-size="8">${t.toUpperCase()} \u2192 ${o} mm</text><text x="${o}" y="13" text-anchor="end" fill="#e5c589" font-size="7">${s("Bed Z = 0","\u5E95\u677F Z = 0")}</text></svg>`}function _a(i,e,t,n){return`<div class="elevation-views">${["x","y"].map(s=>`<figure><figcaption>${n(s==="x"?"Front \xB7 X\u2013Z":"Side \xB7 Y\u2013Z",s==="x"?"\u6B63\u89C6 \xB7 X\u2013Z":"\u4FA7\u89C6 \xB7 Y\u2013Z")}</figcaption>${rm(i,e,s,t,n)}</figure>`).join("")}</div><p class="map-caption">${n("Both levels are shown. Boxes behind one another overlap in elevation; use the plan to check depth.","\u540C\u65F6\u663E\u793A\u4E24\u5C42\u3002\u524D\u540E\u7BB1\u5B50\u5728\u7ACB\u9762\u56FE\u4E2D\u53EF\u80FD\u91CD\u53E0\uFF0C\u8BF7\u7ED3\u5408\u4FEF\u89C6\u56FE\u5224\u65AD\u6DF1\u5EA6\u3002")}</p>`}var om=i=>Object.assign(new ii(i.spec.mode),structuredClone(i)),am=new Set(["grasped","held","open","placed"]);function ad(i,e,t,n=0){let s;if(t.joint){let l=i.checkMove(e,t.q);s=l?{error:l.error,collisionQ:l.q,frames:[]}:{frames:[t.q]}}else s=vs(i,e,t.p,t.yaw,{orientation:t.orientation,path:t.path});let r=[e,...s.frames||[]];s.collisionQ&&r.push(s.collisionQ);let o=[it(e).tip];for(let l=1;l<r.length;l++){let c=r[l-1],h=r[l],d=Math.max(1,Math.ceil(Math.max(...c.map((m,f)=>Math.abs(m-h[f])))/2));for(let m=1;m<=d;m++)o.push(it(c.map((f,g)=>f+(h[g]-f)*m/d)).tip)}s.blockedPoint&&!s.collisionQ&&o.push(s.blockedPoint);let a=s.collisionQ||s.frames?.at(-1)||e;return{points:o,index:n,error:s.error||null,blockedPoint:s.blockedPoint||(s.error?it(a).tip:null),q:a,payload:i.heldPose(a),output:i.output,target:t.p,assisted:!!s.assisted}}function Ks(i,e,t,n=0,s=null,r={}){let o=ad(om(i),e,{p:t,yaw:n,joint:!!s,q:s,...r});return{segments:[o],error:o.error,step:0,ghost:o,scope:"move"}}function ld(i,e){let t=new ii(i.spec.mode),n=Ki(),s=[],r=null;for(let o=0;o<e.length;o++){let a=e[o];if(a.type==="move"){let l=ad(t,n,a,o);if(s.push(l),r=l,l.error)return{segments:s,error:l.error,step:o,ghost:r,scope:"program"};n=l.q,t.update(n)}else{let l=a.type==="grip"?t.command(a.on,n):t.input?"held":"wait";if(!am.has(l))return r={q:n,payload:t.heldPose(n),output:t.output,error:l,blockedPoint:it(n).tip},{segments:s,error:l,step:o,ghost:r,scope:"program"}}}return{segments:s,error:null,step:null,ghost:r,scope:"program"}}var Kc={space:45,placement:40,speed:15},Qs=i=>i==="stacking"?30:20;function Qc(i){let e=no.findIndex(t=>t[0]===i);return[120+e%3*80,-155+Math.floor(e/3)*80,20]}function xa(i,e,t,n){let s=Js(i,t),r=[...s.errors];return(typeof n!="string"||!n.trim()||n.length>4e3)&&r.push({code:"strategy"}),{...s,ok:!r.length,errors:r}}function ya(i,e,t,n){return{plan:structuredClone(i),routes:{},strategy:t,mode:n,elapsedMs:0,started:!0,finished:!1,traces:{},revisions:0,restarts:0,blocked:0,travel:0,history:[],result:null}}function eh(i,e,t=i.elapsedMs){let n=e.objects.length,s=e.objects.filter(p=>p.placed),r=s.map(It),o=[0,1,2].map(p=>Math.min(...r.map(u=>u.min[p]))),a=[0,1,2].map(p=>Math.max(...r.map(u=>u.max[p]))),l=r.length?a.reduce((p,u,b)=>p*Math.max(1,u-o[b]),1):0,c=s.reduce((p,u)=>p+u.size.reduce((b,E)=>b*E,1),0),h=l?Math.min(1,c/l):0,d=e.objects.map(p=>{let u=rd(p.id,i.plan,e.spec),b=[p.center[0],p.center[1],p.center[2]+p.size[2]/2],E=Ut(u,b),x=Math.atan2(p.rotation[3],p.rotation[0])*180/Math.PI,T=Math.abs((x-i.plan[p.id].turn+540)%360-180);return{id:p.id,placed:p.placed,target:u,actual:b,errorMm:E,angleError:T}}),m=d.reduce((p,u)=>p+(u.placed?Math.max(0,1-Math.max(0,u.errorMm-5)/35)*Math.max(0,1-Math.max(0,u.angleError-5)/40):0),0)/n,f=s.length===n&&(e.spec.mode!=="stacking"||s.filter(p=>It(p).min[2]>=e.spec.deck+19).length>=3),g=f?Math.max(0,Math.min(1,2-t/(Qs(e.spec.mode)*6e4))):0,_={space:Math.round(Kc.space*h*s.length/n),placement:Math.round(Kc.placement*m),speed:Math.round(Kc.speed*g)};return{complete:f,points:_,total:Object.values(_).reduce((p,u)=>p+u,0),compactness:h,usedSize:r.length?a.map((p,u)=>p-o[u]):[0,0,0],elapsedMs:t,perBox:d,blocked:i.blocked,revisions:i.revisions,restarts:i.restarts,travel:i.travel}}function cd(i,e){if(i==null)return null;let t=()=>{throw Error("Invalid attempt")};(i.mode!==e.mode||!xa(i.plan||{},i.routes||{},e,i.strategy).ok||typeof i.finished!="boolean")&&t();for(let r of["elapsedMs","revisions","restarts","blocked","travel"])(typeof i[r]!="number"||!Number.isFinite(i[r])||i[r]<0||i[r]>1e12)&&t();let n={};(!i.traces||typeof i.traces!="object")&&t();for(let[r,o]of Object.entries(i.traces))(!e.stock.some(a=>a[0]===r)||!Array.isArray(o)||o.length>2e3||o.some(a=>!Array.isArray(a)||a.length!==3||a.some(l=>!Number.isFinite(l)||Math.abs(l)>1e3)))&&t(),n[r]=o.map(a=>[...a]);(!Array.isArray(i.history)||i.history.length>100)&&t();let s=i.history.map(r=>((!xa(r.plan||{},r.routes||{},e,r.strategy).ok||!Number.isFinite(r.elapsedMs)||r.elapsedMs<0)&&t(),{plan:structuredClone(r.plan),routes:structuredClone(r.routes),strategy:r.strategy,elapsedMs:r.elapsedMs}));return{...ya(i.plan,i.routes,i.strategy,i.mode),elapsedMs:i.elapsedMs,finished:i.finished,traces:n,revisions:i.revisions,restarts:i.restarts,blocked:i.blocked,travel:i.travel,history:s}}var lm=i=>String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);function hd({root:i,t:e,world:t,plan:n,strategy:s,onDraft:r,onStart:o,active:a=!1}){let l=t.spec,c=l.mode==="stacking",h=structuredClone(n),d={},m=s,f="A",g=0,_=T=>document.getElementById(T),p=()=>r(structuredClone(h),structuredClone(d),m);function u(){i.innerHTML=`<p class="lead">${e(c?"Task 2 \xB7 Stack three boxes on other boxes, in two levels. Move the boxes past the person\u2019s marked obstacle zone.":"Task 1 \xB7 Design your own load, then make the robot reproduce it.",c?"\u4EFB\u52A1 2 \xB7 \u5C06\u4E09\u4E2A\u7BB1\u5B50\u53E0\u653E\u5728\u5176\u4ED6\u7BB1\u5B50\u4E0A\uFF0C\u5F62\u6210\u4E24\u5C42\u3002\u6267\u884C\u4EFB\u52A1\u65F6\u642C\u8FD0\u7BB1\u5B50\u907F\u5F00\u4EBA\u7269\u6807\u793A\u533A\u3002":"\u4EFB\u52A1 1 \xB7 \u81EA\u5DF1\u8BBE\u8BA1\u88C5\u8F7D\u65B9\u6848\uFF0C\u518D\u8BA9\u673A\u5668\u4EBA\u5B9E\u73B0\u5B83\u3002")}</p><p>${e("Choose a box, then click the loading zone to set its centre. Edit corner coordinates below. All dimensions use the same scale as the actual truck.","\u9009\u62E9\u7BB1\u5B50\uFF0C\u518D\u70B9\u51FB\u88C5\u8F7D\u533A\u8BBE\u7F6E\u4E2D\u5FC3\u3002\u4E5F\u53EF\u7F16\u8F91\u4E0B\u65B9\u89D2\u70B9\u5750\u6807\u3002\u56FE\u4E0A\u5404\u5C3A\u5BF8\u4E0E\u5B9E\u9645\u8F66\u53A2\u4F7F\u7528\u76F8\u540C\u6BD4\u4F8B\u3002")}</p>
 <div class="planning-facts"><b>${l.size.join(" \xD7 ")} mm</b><span>${e("Box height: 20 mm","\u7BB1\u9AD8\uFF1A20 mm")}</span><span>${e("Open gripper: 60 mm outer width \xB7 48 mm inner gap","\u5F20\u5F00\u5939\u722A\uFF1A\u5916\u5BBD 60 mm \xB7 \u5185\u95F4\u8DDD 48 mm")}</span>${c?`<span>${e("Scale person: 85 mm \xB7 obstacle zone 80 \xD7 32 \xD7 85 mm","\u6BD4\u4F8B\u4EBA\u7269\uFF1A85 mm \xB7 \u969C\u788D\u533A\u57DF 80 \xD7 32 \xD7 85 mm")}</span>`:""}<span>${e("Collision detection ON","\u78B0\u649E\u68C0\u6D4B\uFF1A\u5F00\u542F")}</span></div>
 <div class="planning-layout"><div><div class="box-picker">${l.stock.map(([T,w,C],L)=>`<button data-pick="${T}" class="${f===T?"active":""}" style="--box-color:${bs[L]}"><b>${T}</b> ${w} \xD7 ${C}${h[T]?" \u2713":""}</button>`).join("")}</div>${c?`<div class="map-tools"><label>${e("View level","\u67E5\u770B\u5C42\u7EA7")} <select id="view-level"><option value="0" ${g===0?"selected":""}>1</option><option value="20" ${g===20?"selected":""}>2</option></select></label></div>`:""}<h3 class="view-title">${e("Plan \xB7 X\u2013Y","\u4FEF\u89C6 \xB7 X\u2013Y")}</h3><div id="design-map"></div><p id="plan-space" class="plan-space"></p><p class="map-caption">${e("Top view \xB7 1 diagram unit = 1 mm \xB7 5 mm placement grid. Source boxes stay outside the loading zone. Z is height above the truck bed.","\u4FEF\u89C6\u56FE \xB7 1 \u56FE\u5F62\u5355\u4F4D = 1 mm \xB7 \u653E\u7F6E\u7F51\u683C 5 mm\u3002\u5F85\u53D6\u7BB1\u5B50\u4F4D\u4E8E\u88C5\u8F7D\u533A\u5916\u3002Z \u662F\u9AD8\u4E8E\u8F66\u53A2\u5E95\u677F\u7684\u9AD8\u5EA6\u3002")}</p></div><div><section class="planning-editor" id="box-editor"></section>${c?'<section id="elevation-map" class="planning-elevations"></section>':""}</div></div>
 <label class="strategy-label">${e("Why this plan? What are you optimizing: space, placement accuracy, speed or reliability? Explain one trade-off.","\u4E3A\u4EC0\u4E48\u8FD9\u6837\u89C4\u5212\uFF1F\u4F60\u5728\u4F18\u5316\u7A7A\u95F4\u3001\u653E\u7F6E\u7CBE\u5EA6\u3001\u901F\u5EA6\u8FD8\u662F\u53EF\u9760\u6027\uFF1F\u89E3\u91CA\u4E00\u4E2A\u53D6\u820D\u3002")}<textarea id="plan-reason" maxlength="4000" rows="3">${lm(m)}</textarea></label>
 <details class="rubric-details"><summary>${e("Space 45 \xB7 Placement 40 \xB7 Time 15","\u7A7A\u95F4 45 \xB7 \u653E\u7F6E 40 \xB7 \u65F6\u95F4 15")}</summary><ul><li>${e("Space 45: box volume \xF7 the smallest rectangular envelope around the finished load. Packing more compactly scores higher; only safely placed boxes count.","\u7A7A\u95F4 45\uFF1A\u7BB1\u5B50\u4F53\u79EF \xF7 \u5305\u56F4\u6700\u7EC8\u88C5\u8F7D\u7269\u7684\u6700\u5C0F\u957F\u65B9\u4F53\u4F53\u79EF\u3002\u8D8A\u7D27\u51D1\u5F97\u5206\u8D8A\u9AD8\uFF1B\u4EC5\u7EDF\u8BA1\u5B89\u5168\u653E\u7F6E\u7684\u7BB1\u5B50\u3002")}</li><li>${e("Placement 40: actual top centres and rotations compared with your committed plan. Full credit within 5 mm and 5\xB0.","\u653E\u7F6E 40\uFF1A\u5B9E\u9645\u7BB1\u9876\u4E2D\u5FC3\u4E0E\u65CB\u8F6C\u89D2\u5EA6\u548C\u63D0\u4EA4\u65B9\u6848\u76F8\u6BD4\uFF1B5 mm\u30015\xB0 \u4EE5\u5185\u83B7\u6EE1\u5206\u3002")}</li><li>${e(`Time 15: full credit within ${Qs(l.mode)} minutes, then decreases to zero at ${2*Qs(l.mode)} minutes. These are initial classroom targets, not age norms.`,`\u65F6\u95F4 15\uFF1A${Qs(l.mode)} \u5206\u949F\u5185\u6EE1\u5206\uFF0C\u4E4B\u540E\u9012\u51CF\u81F3 ${2*Qs(l.mode)} \u5206\u949F\u65F6\u96F6\u5206\u3002\u8FD9\u662F\u521D\u59CB\u8BFE\u5802\u76EE\u6807\uFF0C\u5E76\u975E\u5E74\u9F84\u6807\u51C6\u3002`)}</li></ul><p>${e("Timing starts only when you choose Start task. Programming, pauses, retries and plan revisions during the attempt count. Saved time resumes when you choose Resume; time away from the saved session is excluded. Explain your decisions as part of teacher feedback; writing is not automatically graded.","\u70B9\u51FB\u201C\u5F00\u59CB\u4EFB\u52A1\u201D\u624D\u8BA1\u65F6\u3002\u7F16\u7A0B\u3001\u6682\u505C\u3001\u91CD\u8BD5\u3001\u5C1D\u8BD5\u4E2D\u7684\u65B9\u6848\u4FEE\u6539\u5747\u8BA1\u65F6\u3002\u5BFC\u5165\u540E\u70B9\u51FB\u7EE7\u7EED\u624D\u6062\u590D\u8BA1\u65F6\uFF1B\u79BB\u7EBF\u65F6\u95F4\u4E0D\u8BA1\u3002\u89E3\u91CA\u51B3\u7B56\u4F9B\u6559\u5E08\u53CD\u9988\uFF0C\u6587\u5B57\u4E0D\u81EA\u52A8\u8BC4\u5206\u3002")}</p></details>
 <p id="design-feedback" class="feedback" role="status"></p><div class="actions"><button id="check-design">${e("Check geometry","\u68C0\u67E5\u51E0\u4F55\u65B9\u6848")}</button><button id="start-task" class="primary">${e(a?"Commit revision & continue":"Commit plan & start timer",a?"\u63D0\u4EA4\u4FEE\u6539\u5E76\u7EE7\u7EED":"\u63D0\u4EA4\u65B9\u6848\u5E76\u5F00\u59CB\u8BA1\u65F6")}</button></div>`,i.querySelectorAll("[data-pick]").forEach(T=>T.onclick=()=>{f=T.dataset.pick,g=h[f]?.z||0,u()}),_("view-level")?.addEventListener("change",T=>{g=Number(T.target.value),x()}),_("plan-reason").oninput=T=>{m=T.target.value,p()},_("check-design").onclick=()=>b(!1),_("start-task").onclick=()=>{if(a&&_("start-task").dataset.confirm!=="yes"){_("start-task").dataset.confirm="yes",_("design-feedback").textContent=e("Committing a revision resets the boxes and robot, keeps your program, and continues the same timer. Click again to commit.","\u63D0\u4EA4\u4FEE\u6539\u5C06\u91CD\u7F6E\u7BB1\u5B50\u4E0E\u673A\u5668\u4EBA\u3001\u4FDD\u7559\u7A0B\u5E8F\uFF0C\u5E76\u7EE7\u7EED\u540C\u4E00\u8BA1\u65F6\u3002\u518D\u6B21\u70B9\u51FB\u5373\u53EF\u63D0\u4EA4\u3002");return}b(!0)},E(),x()}function b(T){let w=xa(h,d,l,m);if(!w.ok){let C=w.errors[0],L={missing:e(`Place box ${C.id}.`,`\u8BF7\u653E\u7F6E\u7BB1\u5B50 ${C.id}\u3002`),invalid:e(`Check coordinates for ${C.id}.`,`\u8BF7\u68C0\u67E5 ${C.id} \u7684\u5750\u6807\u3002`),outside:e(`${C.id} crosses the loading boundary.`,`${C.id} \u8D85\u51FA\u88C5\u8F7D\u8FB9\u754C\u3002`),overlap:e(`${C.id} and ${C.other} occupy the same space.`,`${C.id} \u4E0E ${C.other} \u5360\u7528\u540C\u4E00\u7A7A\u95F4\u3002`),level:e("Use levels 1 and 2 only.","\u4EC5\u4F7F\u7528\u7B2C 1\u30012 \u5C42\u3002"),support:e(`${C.id} must sit fully on one lower box.`,`${C.id} \u5FC5\u987B\u5B8C\u5168\u652F\u6491\u5728\u4E00\u4E2A\u4E0B\u5C42\u7BB1\u5B50\u4E0A\u3002`),stackCount:e("Put at least three boxes on level 2.","\u81F3\u5C11\u4E09\u4E2A\u7BB1\u5B50\u653E\u5728\u7B2C 2 \u5C42\u3002"),strategy:e("Explain what your plan aims to optimize.","\u8BF7\u89E3\u91CA\u65B9\u6848\u60F3\u8981\u4F18\u5316\u4EC0\u4E48\u3002")};_("design-feedback").textContent=L[C.code]||e("Review the plan.","\u8BF7\u68C0\u67E5\u65B9\u6848\u3002");return}_("design-feedback").textContent=e("The placement plan is valid. Ready to start.","\u653E\u7F6E\u65B9\u6848\u6709\u6548\uFF0C\u53EF\u4EE5\u5F00\u59CB\u4EFB\u52A1\u3002"),T&&(p(),o(structuredClone(h),structuredClone(d),m))}function E(){let T=Qc(f).map((v,S)=>v-(S<2?l.origin[S]:l.deck)),w=h[f]||{x:"",y:"",z:0,turn:0},[C,L]=si(f,w.turn);_("box-editor").innerHTML=`<h3>${f} \xB7 ${e("My placement","\u6211\u7684\u653E\u7F6E\u4F4D\u7F6E")}</h3><p>${e("Corner measured from truck zero","\u89D2\u70B9\u76F8\u5BF9\u8F66\u53A2\u96F6\u70B9")}</p><div class="plan-fields">${["x","y"].map(v=>`<label>${v.toUpperCase()}<input data-place="${v}" type="number" step="5" value="${w[v]}"></label>`).join("")}<label>${e("Turn","\u65CB\u8F6C")}<select data-place="turn"><option value="0">0\xB0</option><option value="90" ${w.turn===90?"selected":""}>90\xB0</option></select></label>${c?`<label>${e("Level","\u5C42")}<select data-place="z"><option value="0">1</option><option value="20" ${w.z===20?"selected":""}>2</option></select></label>`:""}</div><p id="planned-centre">${e("Tool top centre","\u5DE5\u5177\u7BB1\u9876\u4E2D\u5FC3")}: ${Number.isFinite(w.x)&&Number.isFinite(w.y)?`${w.x+C/2}, ${w.y+L/2}, ${(w.z||0)+20}`:"\u2014"} mm</p><p><b>${e("Pickup XYZ","\u53D6\u8D27 XYZ")}: ${T.join(", ")} mm</b></p>`,_("box-editor").querySelectorAll("[data-place]").forEach(v=>v.onchange=()=>{h[f]??(h[f]={x:NaN,y:NaN,z:0,turn:0}),h[f][v.dataset.place]=v.value===""?NaN:Number(v.value),v.dataset.place==="z"&&(g=h[f].z||0),p(),E(),x()})}function x(){let T=Js(h,l);if(T.ok){let z=[Math.max(...T.rectangles.map(G=>G.x+G.w))-Math.min(...T.rectangles.map(G=>G.x)),Math.max(...T.rectangles.map(G=>G.y+G.h))-Math.min(...T.rectangles.map(G=>G.y)),Math.max(...T.rectangles.map(G=>G.z+20))-Math.min(...T.rectangles.map(G=>G.z))];_("plan-space").textContent=e("Predicted compactness","\u9884\u8BA1\u7D27\u51D1\u5EA6")+`: ${(100*T.area*20/z.reduce((G,Q)=>G*Q,1)).toFixed(1)}% \xB7 `+e("Used envelope","\u5360\u7528\u5305\u56F4\u5C3A\u5BF8")+": "+z.join(" \xD7 ")+" mm"}else _("plan-space").textContent=e("Complete a valid arrangement to measure its compactness.","\u5B8C\u6210\u6709\u6548\u6392\u5217\u540E\uFF0C\u53EF\u67E5\u770B\u7D27\u51D1\u5EA6\u3002");let[w,C]=l.origin,[L,v]=l.size,S="";for(let z=0;z<=L;z+=20)S+=`<path d="M${w+z} ${-C}v${-v}"/>`;for(let z=0;z<=v;z+=20)S+=`<path d="M${w} ${-C-z}h${L}"/>`;let I=(z,G,Q,X,de,xe,Ee=!1)=>`<g data-map-box="${z}" style="cursor:pointer"><rect x="${G-X/2}" y="${-Q-de/2}" width="${X}" height="${de}" fill="${bs[xe]}" opacity="${Ee?.3:1}" stroke="${z===f?"#fff":"#12283e"}" stroke-width="${z===f?2:1}"/><text x="${G}" y="${-Q+3}" text-anchor="middle" font-size="9" fill="#10263b" font-weight="bold">${Ee?"":z}</text></g>`,W=l.stock.map(([z,G,Q],X)=>{let[de,xe]=Qc(z);return I(z,de,xe,G,Q,X)}).join(""),$=l.stock.map(([z],G)=>{let Q=h[z];if(!Q||![Q.x,Q.y].every(Number.isFinite))return"";let[X,de]=si(z,Q.turn);return I(z,w+Q.x+X/2,C+Q.y+de/2,X,de,G,c&&(Q.z||0)!==g)}).join(""),Y=(l.solids||[]).map(z=>`<rect x="${z.min[0]}" y="${-z.max[1]}" width="${z.max[0]-z.min[0]}" height="${z.max[1]-z.min[1]}" fill="#b7844544" stroke="#ffe3a5" stroke-dasharray="3 2"/><text x="${z.min[0]}" y="${-z.max[1]-5}" font-size="8" fill="#ffe3a5">${e("PERSON","\u4EBA\u7269")} \xB7 85 mm</text>${l.person?`<ellipse cx="${l.person.center[0]}" cy="${-l.person.center[1]}" rx="17" ry="7" fill="#e5c589"/><circle cx="${l.person.center[0]}" cy="${-l.person.center[1]}" r="6" fill="#e5bd91"/>`:""}`).join("");_("design-map").innerHTML=`<svg id="planning-svg" viewBox="55 -230 305 430" role="img" aria-label="${e("Same-scale inventory and planned box placements","\u7B49\u6BD4\u4F8B\u5F85\u53D6\u7BB1\u5B50\u4E0E\u89C4\u5212\u653E\u7F6E\u4F4D\u7F6E")}"><rect x="55" y="-230" width="305" height="430" fill="#102b42"/><rect x="${w}" y="${-C-v}" width="${L}" height="${v}" fill="#24465e" stroke="#e5c589" stroke-width="2"/><g stroke="#59788f" stroke-width=".4">${S}</g><text x="${w}" y="${-C-v-10}" fill="#ffe3a5" font-size="9">${e("TRUCK BED","\u8F66\u53A2")} ${L} \xD7 ${v} mm</text>${Y}${W}${$}<text x="100" y="195" fill="#bfd1df" font-size="9">${e("PICKUP INVENTORY","\u5F85\u53D6\u7BB1\u5B50")}</text><circle cx="${w}" cy="${-C}" r="3" fill="white"/><text x="${w-5}" y="${-C+13}" fill="white" font-size="8">O (0,0) \u2192 X \xB7 \u2191 Y</text></svg>`,c&&(_("elevation-map").innerHTML=_a(h,l,f,e),_("elevation-map").querySelectorAll("[data-elevation-box]").forEach(z=>{let G=()=>{f=z.dataset.elevationBox,g=h[f]?.z||0,u()};z.onclick=G,z.onkeydown=Q=>{(Q.key==="Enter"||Q.key===" ")&&(Q.preventDefault(),G())}})),_("planning-svg").onclick=z=>{let G=z.target.closest?.("[data-map-box]");if(G){f=G.dataset.mapBox,g=h[f]?.z||0,u();return}let Q=_("planning-svg"),X=Q.createSVGPoint();X.x=z.clientX,X.y=z.clientY;let de=X.matrixTransform(Q.getScreenCTM().inverse()),xe=Math.round((de.x-w)/5)*5,Ee=Math.round((-de.y-C)/5)*5,Xe=h[f]||{turn:0,z:g},[nt,ht]=si(f,Xe.turn);h[f]={...Xe,x:xe-nt/2,y:Ee-ht/2,z:c?g:0},p(),E(),x()}}return u(),{snapshot:()=>({plan:h,routes:d,strategy:m})}}function th(i){if(i?.version!==1||i?.kind!=="bnta-cargo"||!["practice","mission","transfer","shelf","stacking","explore"].includes(i.mode)||!Array.isArray(i.steps)||i.steps.length>200)throw Error("Invalid cargo program");let e=i.steps.map(t=>{if(t?.name!==void 0&&(typeof t.name!="string"||t.name.length>80))throw Error("Invalid name");if(t?.orientation!==void 0&&t.orientation!==null&&(!Array.isArray(t.orientation)||t.orientation.length!==3||t.orientation.some(n=>!Number.isFinite(n)||Math.abs(n)>180)))throw Error("Invalid orientation");if(t?.path!==void 0&&!["linear","joint"].includes(t.path))throw Error("Invalid path");if(t?.type==="move"&&Array.isArray(t.p)&&t.p.length===3&&t.p.every(Number.isFinite)&&Number.isFinite(t.yaw)&&Math.abs(t.yaw)<=180&&vi(t.q)&&t.q.length===6&&typeof t.joint=="boolean")return{type:"move",p:[...t.p],yaw:t.yaw,q:[...t.q],joint:t.joint};if(t?.type==="grip"&&typeof t.on=="boolean")return{type:"grip",on:t.on};if(t?.type==="wait")return{type:"wait"};throw Error("Invalid command")}).map((t,n)=>({...t,...i.steps[n].name?{name:i.steps[n].name}:{},...t.type==="move"&&i.steps[n].orientation!==void 0?{orientation:i.steps[n].orientation===null?null:[...i.steps[n].orientation]}:{},...t.type==="move"&&i.steps[n].path?{path:i.steps[n].path}:{}}));return{mode:i.mode,steps:e}}var Tt=()=>{throw Error("Invalid progress file")},er=(i,e=1e4)=>typeof i=="number"&&Number.isFinite(i)&&Math.abs(i)<=e,va=(i,e,t=1e4)=>Array.isArray(i)&&i.length===e&&i.every(n=>er(n,t)),ri=i=>typeof i=="boolean",io=(i,e=4e3)=>typeof i=="string"&&i.length<=e,ud=i=>va(i,9,1.001)&&[0,1,2].every(e=>Math.abs(Math.hypot(i[e*3],i[e*3+1],i[e*3+2])-1)<.002)&&Math.abs(i[0]*i[3]+i[1]*i[4]+i[2]*i[5])<.002&&Math.abs(i[0]*i[6]+i[1]*i[7]+i[2]*i[8])<.002&&Math.abs(i[3]*i[6]+i[4]*i[7]+i[5]*i[8])<.002&&Math.abs(i[0]*(i[4]*i[8]-i[5]*i[7])-i[1]*(i[3]*i[8]-i[5]*i[6])+i[2]*(i[3]*i[7]-i[4]*i[6])-1)<.003;function nh(i){return structuredClone({mode:i.spec.mode,objects:i.objects,output:i.output,held:i.held,offset:i.offset,localRotation:i.localRotation,travel:i.travel,moves:i.moves,faults:i.faults,drops:i.drops,last:i.last})}function ba(i){if(i?.kind==="bnta-cargo"&&i.version===1)return{legacy:!0,...th(i)};(i?.kind!=="bnta-cargo-progress"||![2,3].includes(i.version))&&Tt();let e=i.world,t=i.ui,n=i.learning;(!e||!t||!n||!["practice","mission","transfer","shelf","stacking","explore"].includes(e.mode))&&Tt();let s=new ii(e.mode),r=th({kind:"bnta-cargo",version:1,mode:e.mode,steps:i.steps}).steps;(!vi(i.q)||i.q.length!==6||!va(t.target,3,600)||!er(t.yaw,180))&&Tt(),(!["zh","en"].includes(t.lang)||!["xyz","jog","joints"].includes(t.mode)||!["robot","bed"].includes(t.coordinateFrame)||!ri(t.bedZeroSet)||!ri(t.guideHidden)||!ri(t.trail)||!ri(t.journeyCollapsed)||!ri(t.dimensions))&&Tt(),t.coordinateFrame==="bed"&&!t.bedZeroSet&&Tt(),t.orientationMode!==void 0&&!["keep","free","down"].includes(t.orientationMode)&&Tt(),t.motionPath!==void 0&&!["linear","joint"].includes(t.motionPath)&&Tt(),t.lastCode!==void 0&&!io(t.lastCode,40)&&Tt(),(!Array.isArray(e.objects)||e.objects.length!==s.objects.length||!ri(e.output))&&Tt();let o=s.objects.map(_=>{let p=e.objects.find(u=>u?.id===_.id);return(!p||!va(p.center,3,1e3)||!ud(p.rotation)||!ri(p.placed)||JSON.stringify(p.size)!==JSON.stringify(_.size))&&Tt(),{..._,center:[...p.center],rotation:[...p.rotation],placed:p.placed}});new Set(e.objects.map(_=>_.id)).size!==o.length&&Tt(),e.held!==null&&(!o.some(_=>_.id===e.held)||!e.output||!va(e.offset,3,100)||!ud(e.localRotation))&&Tt(),e.held===null&&(e.offset!==null||e.localRotation!==null)&&Tt();for(let _ of["travel","moves","faults","drops"])(!er(e[_],1e9)||e[_]<0||_!=="travel"&&!Number.isInteger(e[_]))&&Tt();if(io(e.last,40)||Tt(),Object.assign(s,{objects:o,output:e.output,held:e.held,offset:e.offset&&[...e.offset],localRotation:e.localRotation&&[...e.localRotation],travel:e.travel,moves:e.moves,faults:e.faults,drops:e.drops,last:e.last}),s.held){let _=s.heldPose(i.q);(s.heldObject.placed||Ut(_.center,s.heldObject.center)>.1||_.rotation.some((p,u)=>Math.abs(p-s.heldObject.rotation[u])>.002))&&Tt()}(!Number.isInteger(n.guideStep)||n.guideStep<-1||n.guideStep>8||!Number.isInteger(n.stage)||n.stage<0||n.stage>4||!Array.isArray(n.completed)||n.completed.length!==5||!n.completed.every(ri)||!ri(n.practiceDone)||!ri(n.quizDone)||!ri(n.mathReady))&&Tt(),n.guideStep>=0&&e.mode!=="practice"&&Tt(),(!Number.isInteger(n.demoIndex)||n.demoIndex<-1||n.demoIndex>8||n.demoIndex>=0&&(e.mode!=="practice"||n.stage!==1||r.length!==8))&&Tt(),n.guideRecord!==null&&(!Number.isInteger(n.guideRecord)||n.guideRecord<0||n.guideRecord>=r.length)&&Tt(),(!Array.isArray(n.quizAnswers)||n.quizAnswers.length!==3||!n.quizAnswers.every(_=>_===null||_===0||_===1)||!io(i.reflection))&&Tt(),(!i.plan||typeof i.plan!="object"||Array.isArray(i.plan)||!i.mathAnswers||typeof i.mathAnswers!="object")&&Tt();let a={};for(let[_,p]of Object.entries(i.plan))(!s.spec.stock.some(u=>u[0]===_)||!p||![p.x,p.y].every(u=>u===null||er(u,600))||![0,90].includes(p.turn)||![void 0,0,20].includes(p.z))&&Tt(),a[_]={x:p.x===null?NaN:p.x,y:p.y===null?NaN:p.y,turn:p.turn,...p.z!==void 0?{z:p.z}:{}};let l={};for(let[_,p]of Object.entries(i.routes||{}))(!s.spec.stock.some(u=>u[0]===_)||!Array.isArray(p)||p.length>20||p.some(u=>!Array.isArray(u)||u.length!==3||u.some(b=>b!==null&&!er(b,600))))&&Tt(),l[_]=p.map(u=>u.map(b=>b===null?NaN:b));let c=i.strategy??"";io(c)||Tt();let h=cd(i.attempt,s.spec);e.mode==="explore"&&(h||n.guideStep!==-1||n.demoIndex!==-1)&&Tt();let d={};for(let _ of["area","bed","sx","sy","sz","upper","centreX","centreY"]){let p=i.mathAnswers[_];p!==void 0&&(io(p,30)||er(p,1e9)||Tt(),d[_]=p)}let m=Js(a,s.spec),f=n.mathReady&&(e.mode==="practice"||[2,3].includes(i.layoutVersion))&&(e.mode==="shelf"?ma(d):m.ok&&Number(d.centreX)===40&&Number(d.centreY)===30&&Number(d.area)===m.area&&Number(d.bed)===m.bedArea),g=n.quizDone&&n.quizAnswers.every((_,p)=>_===[0,1,1][p]);return{world:s,steps:r,q:[...i.q],ui:{...t,target:[...t.target]},learning:{...n,truckDone:n.truckDone===!0,completed:n.completed.map((_,p)=>p===3?g:_),quizAnswers:[...n.quizAnswers],mathReady:!!h||f,quizDone:g},plan:a,routes:l,strategy:c,attempt:h,mathAnswers:d,reflection:i.reflection}}var tr=[{part:"base",target:"#viewport",title:["The base","\u5E95\u5EA7"],body:["The base supports the arm and stays fixed. All robot positions are measured in relation to its coordinate system.","\u5E95\u5EA7\u652F\u6491\u673A\u68B0\u81C2\u5E76\u4FDD\u6301\u56FA\u5B9A\u3002\u673A\u5668\u4EBA\u5750\u6807\u4EE5\u56FA\u5B9A\u7684\u673A\u5668\u4EBA\u5750\u6807\u7CFB\u4E3A\u53C2\u8003\u3002"]},{part:"base",target:"#viewport",title:["Why six joints?","\u4E3A\u4EC0\u4E48\u6709\u516D\u4E2A\u5173\u8282\uFF1F"],body:["This arm has six motor-driven turning joints, J1\u2013J6. We need to choose both where the gripper goes (X, Y, Z) and which way it faces (three rotation directions). The first three joints mainly position the arm; the last three help orient the tool. They work together\u2014one joint is not one X, Y or Z control.","\u8FD9\u53F0\u673A\u68B0\u81C2\u6709\u516D\u4E2A\u7531\u7535\u673A\u9A71\u52A8\u7684\u8F6C\u52A8\u5173\u8282 J1\u2013J6\u3002\u9664\u4E86\u9009\u62E9\u5939\u722A\u53BB\u54EA\u91CC\uFF08X\u3001Y\u3001Z\uFF09\uFF0C\u8FD8\u8981\u9009\u62E9\u5B83\u671D\u5411\u54EA\u91CC\uFF08\u4E09\u4E2A\u65CB\u8F6C\u65B9\u5411\uFF09\u3002\u524D\u4E09\u4E2A\u5173\u8282\u4E3B\u8981\u5B9A\u4F4D\u673A\u68B0\u81C2\uFF0C\u540E\u4E09\u4E2A\u534F\u52A9\u8C03\u6574\u5DE5\u5177\u59FF\u6001\u3002\u5B83\u4EEC\u76F8\u4E92\u914D\u5408\uFF0C\u5E76\u4E0D\u662F\u4E00\u4E2A\u5173\u8282\u5BF9\u5E94\u4E00\u4E2A X\u3001Y \u6216 Z \u63A7\u4EF6\u3002"]},{part:"j1",target:"#viewport",title:["J1 \xB7 Base rotation","J1 \xB7 \u5E95\u5EA7\u65CB\u8F6C"],body:["Turns the arm around its base, like turning your body to face a different direction. It brings different parts of the workspace in front of the arm.","\u8BA9\u673A\u68B0\u81C2\u7ED5\u5E95\u5EA7\u8F6C\u52A8\uFF0C\u5C31\u50CF\u8F6C\u8EAB\u9762\u5411\u53E6\u4E00\u4E2A\u65B9\u5411\uFF0C\u4F7F\u673A\u68B0\u81C2\u671D\u5411\u5DE5\u4F5C\u533A\u7684\u4E0D\u540C\u4F4D\u7F6E\u3002"]},{part:"j2",target:"#viewport",title:["J2 \xB7 Shoulder","J2 \xB7 \u80A9\u5173\u8282"],body:["Raises or lowers the upper arm. Together with the elbow, it changes reach and height.","\u62AC\u8D77\u6216\u653E\u4E0B\u4E0A\u81C2\uFF0C\u4E0E\u8098\u5173\u8282\u5171\u540C\u6539\u53D8\u4F38\u5C55\u8DDD\u79BB\u548C\u9AD8\u5EA6\u3002"]},{part:"j3",target:"#viewport",title:["J3 \xB7 Elbow","J3 \xB7 \u8098\u5173\u8282"],body:["Bends or straightens the arm. A folded and an extended arm can approach the same area differently, but joint limits restrict the choices.","\u4F7F\u624B\u81C2\u5F2F\u66F2\u6216\u4F38\u76F4\u3002\u6298\u53E0\u4E0E\u4F38\u5C55\u53EF\u4EE5\u7528\u4E0D\u540C\u65B9\u5F0F\u63A5\u8FD1\u540C\u4E00\u533A\u57DF\uFF0C\u4F46\u5173\u8282\u9650\u4F4D\u4F1A\u9650\u5236\u9009\u62E9\u3002"]},{part:"j4",target:"#viewport",title:["J4 \xB7 Swivel","J4 \xB7 \u56DE\u8F6C\u5173\u8282"],body:["Turns the outer arm assembly around its local axis. It helps aim the wrist without relying only on the base. Its axis turns with the joints before it.","\u8BA9\u5916\u4FA7\u673A\u68B0\u81C2\u7ED5\u81EA\u8EAB\u8F74\u8F6C\u52A8\uFF0C\u5E2E\u52A9\u8155\u90E8\u8C03\u6574\u671D\u5411\uFF0C\u4E0D\u5FC5\u53EA\u4F9D\u8D56\u5E95\u5EA7\u3002\u5B83\u7684\u8F74\u65B9\u5411\u4E5F\u4F1A\u968F\u524D\u9762\u7684\u5173\u8282\u6539\u53D8\u3002"]},{part:"j5",target:"#viewport",title:["J5 \xB7 Wrist tilt","J5 \xB7 \u8155\u90E8\u4FEF\u4EF0"],body:["Tilts the wrist to change the approach angle. Reaching above a box is not enough: the gripper must also face the box correctly.","\u503E\u659C\u8155\u90E8\u4EE5\u6539\u53D8\u63A5\u8FD1\u89D2\u5EA6\u3002\u4EC5\u4EC5\u5230\u8FBE\u7BB1\u5B50\u4E0A\u65B9\u8FD8\u4E0D\u591F\uFF0C\u5939\u722A\u8FD8\u9700\u8981\u6B63\u786E\u671D\u5411\u7BB1\u5B50\u3002"]},{part:"j6",target:"#viewport",title:["J6 \xB7 Tool rotation","J6 \xB7 \u5DE5\u5177\u65CB\u8F6C"],body:["Spins the tool around its mounting axis, helping align the jaws with a box. More joints offer more positioning and orientation choices, not unlimited reach. Coordinates mode coordinates all six joints. Keep the current orientation, allow rotation, or choose Point downward for pickup. Preview a direct or joint path before moving.","\u8BA9\u5DE5\u5177\u7ED5\u5B89\u88C5\u8F74\u65CB\u8F6C\uFF0C\u5E2E\u52A9\u5939\u722A\u4E0E\u7BB1\u5B50\u65B9\u5411\u5BF9\u9F50\u3002\u66F4\u591A\u5173\u8282\u63D0\u4F9B\u66F4\u591A\u4F4D\u7F6E\u548C\u59FF\u6001\u9009\u62E9\uFF0C\u5E76\u4E0D\u610F\u5473\u7740\u65E0\u9650\u53EF\u8FBE\u3002\u5750\u6807\u6A21\u5F0F\u4F1A\u534F\u8C03\u516D\u4E2A\u5173\u8282\u3002\u53EF\u4FDD\u7559\u5F53\u524D\u671D\u5411\u3001\u5141\u8BB8\u65CB\u8F6C\uFF0C\u6216\u9009\u62E9\u671D\u4E0B\u8F85\u52A9\u6293\u53D6\u3002\u79FB\u52A8\u524D\u53EF\u9884\u89C8\u76F4\u63A5\u8DEF\u5F84\u6216\u5173\u8282\u8DEF\u5F84\u3002"]},{part:"link",target:"#viewport",title:["Links and reach","\u8FDE\u6746\u4E0E\u53EF\u8FBE\u8303\u56F4"],body:["Links connect the joints. Their lengths help determine where the robot can reach. The arm and its load need room to move.","\u8FDE\u6746\u8FDE\u63A5\u5173\u8282\uFF0C\u5176\u957F\u5EA6\u51B3\u5B9A\u673A\u5668\u4EBA\u80FD\u5230\u8FBE\u7684\u8303\u56F4\u3002\u673A\u68B0\u81C2\u548C\u6240\u5939\u7269\u4F53\u90FD\u9700\u8981\u8FD0\u52A8\u7A7A\u95F4\u3002"]},{part:"tool",target:"#viewport",title:["Gripper and feedback","\u5939\u722A\u4E0E\u53CD\u9988"],body:["The gripper is the end effector that holds a box. DO1 commands Open or Close. DI1 confirms an actual grip\u2014a Close command alone does not prove a box is held.","\u5939\u722A\u662F\u5939\u6301\u7BB1\u5B50\u7684\u672B\u7AEF\u6267\u884C\u5668\u3002DO1 \u53D1\u51FA\u5F20\u5F00\u6216\u95ED\u5408\u6307\u4EE4\uFF1BDI1 \u786E\u8BA4\u5B9E\u9645\u5939\u6301\u3002\u53D1\u51FA\u95ED\u5408\u6307\u4EE4\u4E0D\u4EE3\u8868\u4E00\u5B9A\u5939\u4F4F\u4E86\u7BB1\u5B50\u3002"]},{part:"tcp",target:"#viewport",title:["The tool position","\u5DE5\u5177\u4F4D\u7F6E"],body:["The tool centre point is the point you position with X, Y and Z. The readout shows where it is now. Setting a bed zero changes the reference for those numbers, not the robot\u2019s position.","\u5DE5\u5177\u4E2D\u5FC3\u70B9\u662F\u901A\u8FC7 X\u3001Y\u3001Z \u5B9A\u4F4D\u7684\u70B9\u3002\u8BFB\u6570\u663E\u793A\u5B83\u5F53\u524D\u7684\u4F4D\u7F6E\u3002\u8BBE\u7F6E\u8F66\u53A2\u96F6\u70B9\u53EA\u6539\u53D8\u5750\u6807\u53C2\u8003\uFF0C\u4E0D\u4F1A\u79FB\u52A8\u673A\u5668\u4EBA\u3002"]},{target:"#controls",title:["Movement controls: try a movement","\u79FB\u52A8\u63A7\u5236\u533A\uFF1A\u5C1D\u8BD5\u4E00\u4E2A\u52A8\u4F5C"],body:["Use Coordinates for an exact target, Jog for small steps, or Joints to turn individual joints. Move acts on the robot now. Open and Close operate the gripper. These actions are not automatically added to your program.","\u7528\u201C\u5750\u6807\u201D\u8BBE\u7F6E\u7CBE\u786E\u76EE\u6807\uFF0C\u201C\u70B9\u52A8\u201D\u8FDB\u884C\u5C0F\u6B65\u79FB\u52A8\uFF0C\u201C\u5173\u8282\u201D\u63A7\u5236\u5355\u4E2A\u5173\u8282\u3002\u201C\u79FB\u52A8\u201D\u7ACB\u5373\u64CD\u4F5C\u673A\u5668\u4EBA\uFF0C\u5F20\u5F00\u548C\u95ED\u5408\u64CD\u4F5C\u5939\u722A\u3002\u8FD9\u4E9B\u64CD\u4F5C\u4E0D\u4F1A\u81EA\u52A8\u52A0\u5165\u7A0B\u5E8F\u3002"]},{target:"#program-panel",mobileTarget:".command-box",title:["Program building: save the sequence","\u7A0B\u5E8F\u7F16\u5199\u533A\uFF1A\u4FDD\u5B58\u52A8\u4F5C\u987A\u5E8F"],body:["Record position saves the robot\u2019s current position in the list. Add Open, Close and Wait DI1 where they belong. Adding an instruction prepares it for playback; it does not immediately operate the robot.","\u201C\u8BB0\u5F55\u5F53\u524D\u4F4D\u7F6E\u201D\u628A\u673A\u5668\u4EBA\u5F53\u524D\u7684\u4F4D\u7F6E\u4FDD\u5B58\u5230\u5217\u8868\u4E2D\u3002\u6309\u987A\u5E8F\u6DFB\u52A0\u5F20\u5F00\u3001\u95ED\u5408\u548C\u7B49\u5F85 DI1\u3002\u6DFB\u52A0\u6307\u4EE4\u662F\u4E3A\u8FD0\u884C\u7A0B\u5E8F\u505A\u51C6\u5907\uFF0C\u4E0D\u4F1A\u7ACB\u5373\u64CD\u4F5C\u673A\u5668\u4EBA\u3002"]},{target:".program-bottom",title:["Run, pause and improve","\u8FD0\u884C\u3001\u6682\u505C\u4E0E\u6539\u8FDB"],body:["Run resets the boxes and executes your list from the beginning. Pause lets you inspect; Stop ends playback. Reorder or remove steps to improve the sequence. We will watch this area during the demonstration.","\u201C\u8FD0\u884C\u201D\u4F1A\u91CD\u7F6E\u7BB1\u5B50\u5E76\u4ECE\u5934\u6267\u884C\u5217\u8868\u3002\u201C\u6682\u505C\u201D\u65B9\u4FBF\u89C2\u5BDF\uFF0C\u201C\u505C\u6B62\u201D\u7ED3\u675F\u8FD0\u884C\u3002\u53EF\u4EE5\u8C03\u6574\u987A\u5E8F\u6216\u5220\u9664\u6B65\u9AA4\u6765\u6539\u8FDB\u7A0B\u5E8F\u3002\u793A\u8303\u65F6\u8BF7\u7559\u610F\u8FD9\u91CC\u3002"]},{target:"#status",title:["Status messages: what just happened?","\u72B6\u6001\u63D0\u793A\uFF1A\u521A\u521A\u53D1\u751F\u4E86\u4EC0\u4E48\uFF1F"],body:["This message bar reports results: a position reached, a box held, or a blocked movement. Read it when something does not work. It tells you what happened so you can decide what to change.","\u8FD9\u6761\u63D0\u793A\u680F\u62A5\u544A\u7ED3\u679C\uFF0C\u4F8B\u5982\u5DF2\u5230\u8FBE\u4F4D\u7F6E\u3001\u5DF2\u5939\u4F4F\u7BB1\u5B50\u6216\u79FB\u52A8\u88AB\u963B\u6B62\u3002\u64CD\u4F5C\u4E0D\u6210\u529F\u65F6\u5148\u8BFB\u8FD9\u91CC\uFF0C\u4E86\u89E3\u53D1\u751F\u4E86\u4EC0\u4E48\uFF0C\u518D\u51B3\u5B9A\u5982\u4F55\u8C03\u6574\u3002"]},{target:"#guide",title:["Learning prompts: what should I do next?","\u5B66\u4E60\u63D0\u793A\u6846\uFF1A\u4E0B\u4E00\u6B65\u505A\u4EC0\u4E48\uFF1F"],body:["This temporary box explains the next action and why it matters. During the demonstration it explains the teacher\u2019s moves; in your practice it guides your next step. It can be hidden when you are ready to work independently.","\u8FD9\u4E2A\u4E34\u65F6\u63D0\u793A\u6846\u8BF4\u660E\u4E0B\u4E00\u6B65\u505A\u4EC0\u4E48\uFF0C\u4EE5\u53CA\u4E3A\u4EC0\u4E48\u8981\u8FD9\u6837\u505A\u3002\u793A\u8303\u65F6\u89E3\u91CA\u6559\u5E08\u7684\u52A8\u4F5C\uFF0C\u7EC3\u4E60\u65F6\u5F15\u5BFC\u4F60\u7684\u4E0B\u4E00\u6B65\u3002\u80FD\u591F\u72EC\u7ACB\u64CD\u4F5C\u540E\uFF0C\u53EF\u4EE5\u5C06\u5B83\u6536\u8D77\u3002"]}];function dd({translate:i,highlightPart:e,showPrompt:t,restorePrompt:n,onClose:s}){let r=document.createElement("div");r.id="demo-tour",r.hidden=!0,r.innerHTML='<div class="tour-shade"></div><div class="tour-focus" aria-hidden="true"></div><section class="tour-card" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-description" tabindex="-1"></section>',document.body.append(r);let o=r.querySelector(".tour-focus"),a=r.querySelector(".tour-card"),l=-1,c=null,h=null,d=[],m=()=>l>=0,f=u=>document.querySelector(innerWidth<=720&&u.mobileTarget?u.mobileTarget:u.target);function g(){if(!m())return;let u=f(tr[l]),b=u.getBoundingClientRect(),E=5,x=Math.max(5,b.left-E),T=Math.max(5,b.top-E),w=Math.min(innerWidth-5,b.right+E),C=Math.min(innerHeight-5,b.bottom+E);Object.assign(o.style,{left:x+"px",top:T+"px",width:Math.max(0,w-x)+"px",height:Math.max(0,C-T)+"px"});let L=a.offsetWidth,v=a.offsetHeight,S=15,I=12,$=[{x:w+S,y:T},{x:x-L-S,y:T},{x,y:C+S},{x,y:T-v-S}].find(Y=>Y.x>=I&&Y.y>=I&&Y.x+L<=innerWidth-I&&Y.y+v<=innerHeight-I);if(!$){let Y=[{x:I,y:I},{x:innerWidth-L-I,y:I},{x:I,y:innerHeight-v-I},{x:innerWidth-L-I,y:innerHeight-v-I}],z=G=>Math.max(0,Math.min(G.x+L,w)-Math.max(G.x,x))*Math.max(0,Math.min(G.y+v,C)-Math.max(G.y,T));$=Y.sort((G,Q)=>z(G)-z(Q))[0]}a.style.left=Math.max(I,Math.min($.x,innerWidth-L-I))+"px",a.style.top=Math.max(I,Math.min($.y,innerHeight-v-I))+"px"}function _(){let u=tr[l],b=i;e(u.part||null),t(u.target==="#guide"),a.innerHTML=`<span class="eyebrow">${b("BEFORE THE ROBOT MOVES","\u673A\u5668\u4EBA\u8FD0\u52A8\u4E4B\u524D")} \xB7 ${l+1} / ${tr.length}</span><h2 id="tour-title">${b(...u.title)}</h2><p id="tour-description">${b(...u.body)}</p><div class="tour-progress" aria-hidden="true">${tr.map((x,T)=>`<i class="${T===l?"current":T<l?"done":""}"></i>`).join("")}</div><div class="actions"><button id="tour-back" ${l===0?"disabled":""}>${b("Back","\u4E0A\u4E00\u6B65")}</button><button id="tour-next" class="primary">${l===tr.length-1?b("Start robot demonstration \u2192","\u5F00\u59CB\u673A\u5668\u4EBA\u793A\u8303 \u2192"):b("Next \u2192","\u4E0B\u4E00\u6B65 \u2192")}</button><button id="tour-exit">${b("Close tour","\u5173\u95ED\u5BFC\u89C8")}</button></div>`,a.querySelector("#tour-back").onclick=()=>{l--,_()},a.querySelector("#tour-next").onclick=()=>{if(l<tr.length-1)l++,_();else{let x=c;p(),x?.()}},a.querySelector("#tour-exit").onclick=p,f(u).scrollIntoView({block:"center",inline:"nearest",behavior:"instant"}),g(),a.focus({preventScroll:!0}),requestAnimationFrame(g)}function p(){if(m()){l=-1,r.hidden=!0,e(null),n();for(let[u,b]of d)u.inert=b;d=[],h?.focus({preventScroll:!0}),s?.()}}return r.addEventListener("keydown",u=>{if(u.key==="Escape"&&(u.preventDefault(),p()),u.key==="Tab"){let b=[...a.querySelectorAll("button:not(:disabled)")],E=b[0],x=b.at(-1);u.shiftKey&&(document.activeElement===E||document.activeElement===a)?(u.preventDefault(),x.focus()):!u.shiftKey&&(document.activeElement===x||document.activeElement===a)&&(u.preventDefault(),E.focus())}}),window.addEventListener("resize",g),window.addEventListener("scroll",g,!0),{active:m,start(u){m()&&p(),h=document.activeElement,d=[...document.querySelectorAll("body>header,body>nav,body>main")].map(b=>[b,b.inert]);for(let[b]of d)b.inert=!0;c=u,l=0,r.hidden=!1,_()},close:p,refresh(){m()&&_()}}}var fs={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},ps={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Xd=0,Wh=1,qd=2;var $h=1,Dl=2,Ai=3,Gi=0,bn=1,Ri=2,$i=0,Rs=1,Xh=2,qh=3,Yh=4,Yd=5,os=100,Zd=101,jd=102,Jd=103,Kd=104,Qd=200,ef=201,tf=202,nf=203,Qa=204,el=205,sf=206,rf=207,of=208,af=209,lf=210,cf=211,hf=212,uf=213,df=214,Ll=0,Nl=1,Ul=2,Cs=3,Fl=4,Ol=5,Bl=6,kl=7,Zh=0,ff=1,pf=2,Xi=0,mf=1,gf=2,_f=3,xf=4,yf=5,vf=6,bf=7;var jh=300,Os=301,Bs=302,zl=303,Hl=304,jo=306,tl=1e3,rs=1001,nl=1002,jn=1003,Mf=1004;var Jo=1005;var ui=1006,Vl=1007;var ms=1008;var pi=1009,Jh=1010,Kh=1011,Nr=1012,Gl=1013,gs=1014,Ci=1015,Ur=1016,Wl=1017,$l=1018,Fr=1020,Qh=35902,eu=35899,tu=1021,nu=1022,Qn=1023,vr=1026,Or=1027,iu=1028,Xl=1029,su=1030,ql=1031;var Yl=1033,Ko=33776,Qo=33777,ea=33778,ta=33779,Zl=35840,jl=35841,Jl=35842,Kl=35843,Ql=36196,ec=37492,tc=37496,nc=37808,ic=37809,sc=37810,rc=37811,oc=37812,ac=37813,lc=37814,cc=37815,hc=37816,uc=37817,dc=37818,fc=37819,pc=37820,mc=37821,gc=36492,_c=36494,xc=36495,yc=36283,vc=36284,bc=36285,Mc=36286;var _o=2300,il=2301,Ka=2302,Dh=2400,Lh=2401,Nh=2402;var Sf=3200,Ef=3201;var ru=0,wf=1,qi="",un="srgb",Ps="srgb-linear",xo="linear",bt="srgb";var Ts=7680;var Uh=519,Tf=512,Af=513,Rf=514,ou=515,Cf=516,Pf=517,If=518,Df=519,sl=35044;var au="300 es",hi=2e3,yo=2001;var Si=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},cn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],fd=1234567,xr=Math.PI/180,br=180/Math.PI;function Mi(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(cn[i&255]+cn[i>>8&255]+cn[i>>16&255]+cn[i>>24&255]+"-"+cn[e&255]+cn[e>>8&255]+"-"+cn[e>>16&15|64]+cn[e>>24&255]+"-"+cn[t&63|128]+cn[t>>8&255]+"-"+cn[t>>16&255]+cn[t>>24&255]+cn[n&255]+cn[n>>8&255]+cn[n>>16&255]+cn[n>>24&255]).toLowerCase()}function st(i,e,t){return Math.max(e,Math.min(t,i))}function lu(i,e){return(i%e+e)%e}function cm(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function hm(i,e,t){return i!==e?(t-i)/(e-i):0}function po(i,e,t){return(1-t)*i+t*e}function um(i,e,t,n){return po(i,e,1-Math.exp(-t*n))}function dm(i,e=1){return e-Math.abs(lu(i,e*2)-e)}function fm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function pm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function mm(i,e){return i+Math.floor(Math.random()*(e-i+1))}function gm(i,e){return i+Math.random()*(e-i)}function _m(i){return i*(.5-Math.random())}function xm(i){i!==void 0&&(fd=i);let e=fd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ym(i){return i*xr}function vm(i){return i*br}function bm(i){return(i&i-1)===0&&i!==0}function Mm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Sm(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Em(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),d=r((e-n)/2),m=o((e-n)/2),f=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*h,l*d,l*m,a*c);break;case"YZY":i.set(l*m,a*h,l*d,a*c);break;case"ZXZ":i.set(l*d,l*m,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*f,a*c);break;case"YXY":i.set(l*f,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ci(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function vt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var cu={DEG2RAD:xr,RAD2DEG:br,generateUUID:Mi,clamp:st,euclideanModulo:lu,mapLinear:cm,inverseLerp:hm,lerp:po,damp:um,pingpong:dm,smoothstep:fm,smootherstep:pm,randInt:mm,randFloat:gm,randFloatSpread:_m,seededRandom:xm,degToRad:ym,radToDeg:vm,isPowerOfTwo:bm,ceilPowerOfTwo:Mm,floorPowerOfTwo:Sm,setQuaternionFromProperEuler:Em,normalize:vt,denormalize:ci},ae=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Jn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],m=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d;return}if(a===1){e[t+0]=m,e[t+1]=f,e[t+2]=g,e[t+3]=_;return}if(d!==_||l!==m||c!==f||h!==g){let p=1-a,u=l*m+c*f+h*g+d*_,b=u>=0?1:-1,E=1-u*u;if(E>Number.EPSILON){let T=Math.sqrt(E),w=Math.atan2(T,u*b);p=Math.sin(p*w)/T,a=Math.sin(a*w)/T}let x=a*b;if(l=l*p+m*x,c=c*p+f*x,h=h*p+g*x,d=d*p+_*x,p===1-a){let T=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=T,c*=T,h*=T,d*=T}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[o],m=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+h*d+l*f-c*m,e[t+1]=l*g+h*m+c*d-a*f,e[t+2]=c*g+h*f+a*m-l*d,e[t+3]=h*g-a*d-l*m-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),d=a(r/2),m=l(n/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=m*h*d+c*f*g,this._y=c*f*d-m*h*g,this._z=c*h*g+m*f*d,this._w=c*h*d-m*f*g;break;case"YXZ":this._x=m*h*d+c*f*g,this._y=c*f*d-m*h*g,this._z=c*h*g-m*f*d,this._w=c*h*d+m*f*g;break;case"ZXY":this._x=m*h*d-c*f*g,this._y=c*f*d+m*h*g,this._z=c*h*g+m*f*d,this._w=c*h*d-m*f*g;break;case"ZYX":this._x=m*h*d-c*f*g,this._y=c*f*d+m*h*g,this._z=c*h*g-m*f*d,this._w=c*h*d+m*f*g;break;case"YZX":this._x=m*h*d+c*f*g,this._y=c*f*d+m*h*g,this._z=c*h*g-m*f*d,this._w=c*h*d-m*f*g;break;case"XZY":this._x=m*h*d-c*f*g,this._y=c*f*d-m*h*g,this._z=c*h*g+m*f*d,this._w=c*h*d+m*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],d=t[10],m=n+a+d;if(m>0){let f=.5/Math.sqrt(m+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>d){let f=2*Math.sqrt(1+n-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>d){let f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+d-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(st(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-t)*h)/c,m=Math.sin(t*h)/c;return this._w=o*d+this._w*m,this._x=n*d+this._x*m,this._y=s*d+this._y*m,this._z=r*d+this._z*m,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},D=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(pd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(pd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),d=2*(r*n-o*t);return this.x=t+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=s+l*d+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ih.copy(this).projectOnVector(e),this.sub(ih)}reflect(e){return this.sub(ih.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ih=new D,pd=new Jn,et=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],m=n[2],f=n[5],g=n[8],_=s[0],p=s[3],u=s[6],b=s[1],E=s[4],x=s[7],T=s[2],w=s[5],C=s[8];return r[0]=o*_+a*b+l*T,r[3]=o*p+a*E+l*w,r[6]=o*u+a*x+l*C,r[1]=c*_+h*b+d*T,r[4]=c*p+h*E+d*w,r[7]=c*u+h*x+d*C,r[2]=m*_+f*b+g*T,r[5]=m*p+f*E+g*w,r[8]=m*u+f*x+g*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=h*o-a*c,m=a*l-h*r,f=c*r-o*l,g=t*d+n*m+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=d*_,e[1]=(s*c-h*n)*_,e[2]=(a*n-s*o)*_,e[3]=m*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-a*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(sh.makeScale(e,t)),this}rotate(e){return this.premultiply(sh.makeRotation(-e)),this}translate(e,t){return this.premultiply(sh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},sh=new et;function hu(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function vo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Lf(){let i=vo("canvas");return i.style.display="block",i}var md={};function Mr(i){i in md||(md[i]=!0,console.warn(i))}function Nf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var gd=new et().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),_d=new et().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function wm(){let i={enabled:!0,workingColorSpace:Ps,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===bt&&(s.r=Vi(s.r),s.g=Vi(s.g),s.b=Vi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===bt&&(s.r=yr(s.r),s.g=yr(s.g),s.b=yr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===qi?xo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Mr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Mr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ps]:{primaries:e,whitePoint:n,transfer:xo,toXYZ:gd,fromXYZ:_d,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:un},outputColorSpaceConfig:{drawingBufferColorSpace:un}},[un]:{primaries:e,whitePoint:n,transfer:bt,toXYZ:gd,fromXYZ:_d,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:un}}}),i}var ut=wm();function Vi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function yr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var nr,rl=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{nr===void 0&&(nr=vo("canvas")),nr.width=e.width,nr.height=e.height;let s=nr.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=nr}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=vo("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Vi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Vi(t[n]/255)*255):t[n]=Vi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Tm=0,Sr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Tm++}),this.uuid=Mi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(rh(s[o].image)):r.push(rh(s[o]))}else r=rh(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function rh(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?rl.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Am=0,oh=new D,Rn=class i extends Si{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=rs,s=rs,r=ui,o=ms,a=Qn,l=pi,c=i.DEFAULT_ANISOTROPY,h=qi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Am++}),this.uuid=Mi(),this.name="",this.source=new Sr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ae(0,0),this.repeat=new ae(1,1),this.center=new ae(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new et,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(oh).x}get height(){return this.source.getSize(oh).y}get depth(){return this.source.getSize(oh).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==jh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case tl:e.x=e.x-Math.floor(e.x);break;case rs:e.x=e.x<0?0:1;break;case nl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case tl:e.y=e.y-Math.floor(e.y);break;case rs:e.y=e.y<0?0:1;break;case nl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Rn.DEFAULT_IMAGE=null;Rn.DEFAULT_MAPPING=jh;Rn.DEFAULT_ANISOTROPY=1;var Ot=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],d=l[8],m=l[1],f=l[5],g=l[9],_=l[2],p=l[6],u=l[10];if(Math.abs(h-m)<.01&&Math.abs(d-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+m)<.1&&Math.abs(d+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+f+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let E=(c+1)/2,x=(f+1)/2,T=(u+1)/2,w=(h+m)/4,C=(d+_)/4,L=(g+p)/4;return E>x&&E>T?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=w/n,r=C/n):x>T?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=w/s,r=L/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=C/r,s=L/r),this.set(n,s,r,t),this}let b=Math.sqrt((p-g)*(p-g)+(d-_)*(d-_)+(m-h)*(m-h));return Math.abs(b)<.001&&(b=1),this.x=(p-g)/b,this.y=(d-_)/b,this.z=(m-h)/b,this.w=Math.acos((c+f+u-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this.w=st(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this.w=st(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ol=class extends Si{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ui,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ot(0,0,e,t),this.scissorTest=!1,this.viewport=new Ot(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new Rn(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:ui,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Sr(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ei=class extends ol{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},bo=class extends Rn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=jn,this.minFilter=jn,this.wrapR=rs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var al=class extends Rn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=jn,this.minFilter=jn,this.wrapR=rs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var wi=class{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(oi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(oi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=oi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,oi):oi.fromBufferAttribute(r,o),oi.applyMatrix4(e.matrixWorld),this.expandByPoint(oi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ma.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ma.copy(n.boundingBox)),Ma.applyMatrix4(e.matrixWorld),this.union(Ma)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,oi),oi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(so),Sa.subVectors(this.max,so),ir.subVectors(e.a,so),sr.subVectors(e.b,so),rr.subVectors(e.c,so),Qi.subVectors(sr,ir),es.subVectors(rr,sr),Ms.subVectors(ir,rr);let t=[0,-Qi.z,Qi.y,0,-es.z,es.y,0,-Ms.z,Ms.y,Qi.z,0,-Qi.x,es.z,0,-es.x,Ms.z,0,-Ms.x,-Qi.y,Qi.x,0,-es.y,es.x,0,-Ms.y,Ms.x,0];return!ah(t,ir,sr,rr,Sa)||(t=[1,0,0,0,1,0,0,0,1],!ah(t,ir,sr,rr,Sa))?!1:(Ea.crossVectors(Qi,es),t=[Ea.x,Ea.y,Ea.z],ah(t,ir,sr,rr,Sa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,oi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(oi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Oi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Oi=[new D,new D,new D,new D,new D,new D,new D,new D],oi=new D,Ma=new wi,ir=new D,sr=new D,rr=new D,Qi=new D,es=new D,Ms=new D,so=new D,Sa=new D,Ea=new D,Ss=new D;function ah(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Ss.fromArray(i,r);let a=s.x*Math.abs(Ss.x)+s.y*Math.abs(Ss.y)+s.z*Math.abs(Ss.z),l=e.dot(Ss),c=t.dot(Ss),h=n.dot(Ss);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Rm=new wi,ro=new D,lh=new D,Is=class{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Rm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ro.subVectors(e,this.center);let t=ro.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ro,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(lh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ro.copy(e.center).add(lh)),this.expandByPoint(ro.copy(e.center).sub(lh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Bi=new D,ch=new D,wa=new D,ts=new D,hh=new D,Ta=new D,uh=new D,as=class{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Bi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Bi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Bi.copy(this.origin).addScaledVector(this.direction,t),Bi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){ch.copy(e).add(t).multiplyScalar(.5),wa.copy(t).sub(e).normalize(),ts.copy(this.origin).sub(ch);let r=e.distanceTo(t)*.5,o=-this.direction.dot(wa),a=ts.dot(this.direction),l=-ts.dot(wa),c=ts.lengthSq(),h=Math.abs(1-o*o),d,m,f,g;if(h>0)if(d=o*l-a,m=o*a-l,g=r*h,d>=0)if(m>=-g)if(m<=g){let _=1/h;d*=_,m*=_,f=d*(d+o*m+2*a)+m*(o*d+m+2*l)+c}else m=r,d=Math.max(0,-(o*m+a)),f=-d*d+m*(m+2*l)+c;else m=-r,d=Math.max(0,-(o*m+a)),f=-d*d+m*(m+2*l)+c;else m<=-g?(d=Math.max(0,-(-o*r+a)),m=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+m*(m+2*l)+c):m<=g?(d=0,m=Math.min(Math.max(-r,-l),r),f=m*(m+2*l)+c):(d=Math.max(0,-(o*r+a)),m=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+m*(m+2*l)+c);else m=o>0?-r:r,d=Math.max(0,-(o*m+a)),f=-d*d+m*(m+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(ch).addScaledVector(wa,m),f}intersectSphere(e,t){Bi.subVectors(e.center,this.origin);let n=Bi.dot(this.direction),s=Bi.dot(Bi)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,m=this.origin;return c>=0?(n=(e.min.x-m.x)*c,s=(e.max.x-m.x)*c):(n=(e.max.x-m.x)*c,s=(e.min.x-m.x)*c),h>=0?(r=(e.min.y-m.y)*h,o=(e.max.y-m.y)*h):(r=(e.max.y-m.y)*h,o=(e.min.y-m.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-m.z)*d,l=(e.max.z-m.z)*d):(a=(e.max.z-m.z)*d,l=(e.min.z-m.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Bi)!==null}intersectTriangle(e,t,n,s,r){hh.subVectors(t,e),Ta.subVectors(n,e),uh.crossVectors(hh,Ta);let o=this.direction.dot(uh),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ts.subVectors(this.origin,e);let l=a*this.direction.dot(Ta.crossVectors(ts,Ta));if(l<0)return null;let c=a*this.direction.dot(hh.cross(ts));if(c<0||l+c>o)return null;let h=-a*ts.dot(uh);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},gt=class i{constructor(e,t,n,s,r,o,a,l,c,h,d,m,f,g,_,p){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,d,m,f,g,_,p)}set(e,t,n,s,r,o,a,l,c,h,d,m,f,g,_,p){let u=this.elements;return u[0]=e,u[4]=t,u[8]=n,u[12]=s,u[1]=r,u[5]=o,u[9]=a,u[13]=l,u[2]=c,u[6]=h,u[10]=d,u[14]=m,u[3]=f,u[7]=g,u[11]=_,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/or.setFromMatrixColumn(e,0).length(),r=1/or.setFromMatrixColumn(e,1).length(),o=1/or.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let m=o*h,f=o*d,g=a*h,_=a*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=f+g*c,t[5]=m-_*c,t[9]=-a*l,t[2]=_-m*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){let m=l*h,f=l*d,g=c*h,_=c*d;t[0]=m+_*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*d,t[5]=o*h,t[9]=-a,t[2]=f*a-g,t[6]=_+m*a,t[10]=o*l}else if(e.order==="ZXY"){let m=l*h,f=l*d,g=c*h,_=c*d;t[0]=m-_*a,t[4]=-o*d,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*h,t[9]=_-m*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let m=o*h,f=o*d,g=a*h,_=a*d;t[0]=l*h,t[4]=g*c-f,t[8]=m*c+_,t[1]=l*d,t[5]=_*c+m,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let m=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=_-m*d,t[8]=g*d+f,t[1]=d,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*d+g,t[10]=m-_*d}else if(e.order==="XZY"){let m=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=m*d+_,t[5]=o*h,t[9]=f*d-g,t[2]=g*d-f,t[6]=a*h,t[10]=_*d+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Cm,e,Pm)}lookAt(e,t,n){let s=this.elements;return Fn.subVectors(e,t),Fn.lengthSq()===0&&(Fn.z=1),Fn.normalize(),ns.crossVectors(n,Fn),ns.lengthSq()===0&&(Math.abs(n.z)===1?Fn.x+=1e-4:Fn.z+=1e-4,Fn.normalize(),ns.crossVectors(n,Fn)),ns.normalize(),Aa.crossVectors(Fn,ns),s[0]=ns.x,s[4]=Aa.x,s[8]=Fn.x,s[1]=ns.y,s[5]=Aa.y,s[9]=Fn.y,s[2]=ns.z,s[6]=Aa.z,s[10]=Fn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],m=n[9],f=n[13],g=n[2],_=n[6],p=n[10],u=n[14],b=n[3],E=n[7],x=n[11],T=n[15],w=s[0],C=s[4],L=s[8],v=s[12],S=s[1],I=s[5],W=s[9],$=s[13],Y=s[2],z=s[6],G=s[10],Q=s[14],X=s[3],de=s[7],xe=s[11],Ee=s[15];return r[0]=o*w+a*S+l*Y+c*X,r[4]=o*C+a*I+l*z+c*de,r[8]=o*L+a*W+l*G+c*xe,r[12]=o*v+a*$+l*Q+c*Ee,r[1]=h*w+d*S+m*Y+f*X,r[5]=h*C+d*I+m*z+f*de,r[9]=h*L+d*W+m*G+f*xe,r[13]=h*v+d*$+m*Q+f*Ee,r[2]=g*w+_*S+p*Y+u*X,r[6]=g*C+_*I+p*z+u*de,r[10]=g*L+_*W+p*G+u*xe,r[14]=g*v+_*$+p*Q+u*Ee,r[3]=b*w+E*S+x*Y+T*X,r[7]=b*C+E*I+x*z+T*de,r[11]=b*L+E*W+x*G+T*xe,r[15]=b*v+E*$+x*Q+T*Ee,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],d=e[6],m=e[10],f=e[14],g=e[3],_=e[7],p=e[11],u=e[15];return g*(+r*l*d-s*c*d-r*a*m+n*c*m+s*a*f-n*l*f)+_*(+t*l*f-t*c*m+r*o*m-s*o*f+s*c*h-r*l*h)+p*(+t*c*d-t*a*f-r*o*d+n*o*f+r*a*h-n*c*h)+u*(-s*a*h-t*l*d+t*a*m+s*o*d-n*o*m+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=e[9],m=e[10],f=e[11],g=e[12],_=e[13],p=e[14],u=e[15],b=d*p*c-_*m*c+_*l*f-a*p*f-d*l*u+a*m*u,E=g*m*c-h*p*c-g*l*f+o*p*f+h*l*u-o*m*u,x=h*_*c-g*d*c+g*a*f-o*_*f-h*a*u+o*d*u,T=g*d*l-h*_*l-g*a*m+o*_*m+h*a*p-o*d*p,w=t*b+n*E+s*x+r*T;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/w;return e[0]=b*C,e[1]=(_*m*r-d*p*r-_*s*f+n*p*f+d*s*u-n*m*u)*C,e[2]=(a*p*r-_*l*r+_*s*c-n*p*c-a*s*u+n*l*u)*C,e[3]=(d*l*r-a*m*r-d*s*c+n*m*c+a*s*f-n*l*f)*C,e[4]=E*C,e[5]=(h*p*r-g*m*r+g*s*f-t*p*f-h*s*u+t*m*u)*C,e[6]=(g*l*r-o*p*r-g*s*c+t*p*c+o*s*u-t*l*u)*C,e[7]=(o*m*r-h*l*r+h*s*c-t*m*c-o*s*f+t*l*f)*C,e[8]=x*C,e[9]=(g*d*r-h*_*r-g*n*f+t*_*f+h*n*u-t*d*u)*C,e[10]=(o*_*r-g*a*r+g*n*c-t*_*c-o*n*u+t*a*u)*C,e[11]=(h*a*r-o*d*r-h*n*c+t*d*c+o*n*f-t*a*f)*C,e[12]=T*C,e[13]=(h*_*s-g*d*s+g*n*m-t*_*m-h*n*p+t*d*p)*C,e[14]=(g*a*s-o*_*s-g*n*l+t*_*l+o*n*p-t*a*p)*C,e[15]=(o*d*s-h*a*s+h*n*l-t*d*l-o*n*m+t*a*m)*C,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,d=a+a,m=r*c,f=r*h,g=r*d,_=o*h,p=o*d,u=a*d,b=l*c,E=l*h,x=l*d,T=n.x,w=n.y,C=n.z;return s[0]=(1-(_+u))*T,s[1]=(f+x)*T,s[2]=(g-E)*T,s[3]=0,s[4]=(f-x)*w,s[5]=(1-(m+u))*w,s[6]=(p+b)*w,s[7]=0,s[8]=(g+E)*C,s[9]=(p-b)*C,s[10]=(1-(m+_))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=or.set(s[0],s[1],s[2]).length(),o=or.set(s[4],s[5],s[6]).length(),a=or.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],ai.copy(this);let c=1/r,h=1/o,d=1/a;return ai.elements[0]*=c,ai.elements[1]*=c,ai.elements[2]*=c,ai.elements[4]*=h,ai.elements[5]*=h,ai.elements[6]*=h,ai.elements[8]*=d,ai.elements[9]*=d,ai.elements[10]*=d,t.setFromRotationMatrix(ai),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=hi,l=!1){let c=this.elements,h=2*r/(t-e),d=2*r/(n-s),m=(t+e)/(t-e),f=(n+s)/(n-s),g,_;if(l)g=r/(o-r),_=o*r/(o-r);else if(a===hi)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===yo)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=m,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=hi,l=!1){let c=this.elements,h=2/(t-e),d=2/(n-s),m=-(t+e)/(t-e),f=-(n+s)/(n-s),g,_;if(l)g=1/(o-r),_=o/(o-r);else if(a===hi)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===yo)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=m,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},or=new D,ai=new gt,Cm=new D(0,0,0),Pm=new D(1,1,1),ns=new D,Aa=new D,Fn=new D,xd=new gt,yd=new Jn,di=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],m=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(st(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(m,c),this._z=0);break;case"YXZ":this._x=Math.asin(-st(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(st(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-st(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(m,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(st(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-st(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(m,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return xd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(xd,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return yd.setFromEuler(this),this.setFromQuaternion(yd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};di.DEFAULT_ORDER="XYZ";var Er=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Im=0,vd=new D,ar=new Jn,ki=new gt,Ra=new D,oo=new D,Dm=new D,Lm=new Jn,bd=new D(1,0,0),Md=new D(0,1,0),Sd=new D(0,0,1),Ed={type:"added"},Nm={type:"removed"},lr={type:"childadded",child:null},dh={type:"childremoved",child:null},Qt=class i extends Si{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Im++}),this.uuid=Mi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new D,t=new di,n=new Jn,s=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new gt},normalMatrix:{value:new et}}),this.matrix=new gt,this.matrixWorld=new gt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Er,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ar.setFromAxisAngle(e,t),this.quaternion.multiply(ar),this}rotateOnWorldAxis(e,t){return ar.setFromAxisAngle(e,t),this.quaternion.premultiply(ar),this}rotateX(e){return this.rotateOnAxis(bd,e)}rotateY(e){return this.rotateOnAxis(Md,e)}rotateZ(e){return this.rotateOnAxis(Sd,e)}translateOnAxis(e,t){return vd.copy(e).applyQuaternion(this.quaternion),this.position.add(vd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(bd,e)}translateY(e){return this.translateOnAxis(Md,e)}translateZ(e){return this.translateOnAxis(Sd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ki.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ra.copy(e):Ra.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),oo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ki.lookAt(oo,Ra,this.up):ki.lookAt(Ra,oo,this.up),this.quaternion.setFromRotationMatrix(ki),s&&(ki.extractRotation(s.matrixWorld),ar.setFromRotationMatrix(ki),this.quaternion.premultiply(ar.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ed),lr.child=e,this.dispatchEvent(lr),lr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Nm),dh.child=e,this.dispatchEvent(dh),dh.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ki.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ki.multiply(e.parent.matrixWorld)),e.applyMatrix4(ki),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ed),lr.child=e,this.dispatchEvent(lr),lr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(oo,e,Dm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(oo,Lm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),d=o(e.shapes),m=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),m.length>0&&(n.skeletons=m),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Qt.DEFAULT_UP=new D(0,1,0);Qt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Qt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var li=new D,zi=new D,fh=new D,Hi=new D,cr=new D,hr=new D,wd=new D,ph=new D,mh=new D,gh=new D,_h=new Ot,xh=new Ot,yh=new Ot,bi=class i{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),li.subVectors(e,t),s.cross(li);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){li.subVectors(s,t),zi.subVectors(n,t),fh.subVectors(e,t);let o=li.dot(li),a=li.dot(zi),l=li.dot(fh),c=zi.dot(zi),h=zi.dot(fh),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let m=1/d,f=(c*l-a*h)*m,g=(o*h-a*l)*m;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Hi)===null?!1:Hi.x>=0&&Hi.y>=0&&Hi.x+Hi.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,Hi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Hi.x),l.addScaledVector(o,Hi.y),l.addScaledVector(a,Hi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return _h.setScalar(0),xh.setScalar(0),yh.setScalar(0),_h.fromBufferAttribute(e,t),xh.fromBufferAttribute(e,n),yh.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(_h,r.x),o.addScaledVector(xh,r.y),o.addScaledVector(yh,r.z),o}static isFrontFacing(e,t,n,s){return li.subVectors(n,t),zi.subVectors(e,t),li.cross(zi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return li.subVectors(this.c,this.b),zi.subVectors(this.a,this.b),li.cross(zi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;cr.subVectors(s,n),hr.subVectors(r,n),ph.subVectors(e,n);let l=cr.dot(ph),c=hr.dot(ph);if(l<=0&&c<=0)return t.copy(n);mh.subVectors(e,s);let h=cr.dot(mh),d=hr.dot(mh);if(h>=0&&d<=h)return t.copy(s);let m=l*d-h*c;if(m<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(cr,o);gh.subVectors(e,r);let f=cr.dot(gh),g=hr.dot(gh);if(g>=0&&f<=g)return t.copy(r);let _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(hr,a);let p=h*g-f*d;if(p<=0&&d-h>=0&&f-g>=0)return wd.subVectors(r,s),a=(d-h)/(d-h+(f-g)),t.copy(s).addScaledVector(wd,a);let u=1/(p+_+m);return o=_*u,a=m*u,t.copy(n).addScaledVector(cr,o).addScaledVector(hr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Uf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},is={h:0,s:0,l:0},Ca={h:0,s:0,l:0};function vh(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Qe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=un){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ut.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=ut.workingColorSpace){return this.r=e,this.g=t,this.b=n,ut.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=ut.workingColorSpace){if(e=lu(e,1),t=st(t,0,1),n=st(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=vh(o,r,e+1/3),this.g=vh(o,r,e),this.b=vh(o,r,e-1/3)}return ut.colorSpaceToWorking(this,s),this}setStyle(e,t=un){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=un){let n=Uf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Vi(e.r),this.g=Vi(e.g),this.b=Vi(e.b),this}copyLinearToSRGB(e){return this.r=yr(e.r),this.g=yr(e.g),this.b=yr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=un){return ut.workingToColorSpace(hn.copy(this),e),Math.round(st(hn.r*255,0,255))*65536+Math.round(st(hn.g*255,0,255))*256+Math.round(st(hn.b*255,0,255))}getHexString(e=un){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ut.workingColorSpace){ut.workingToColorSpace(hn.copy(this),t);let n=hn.r,s=hn.g,r=hn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=ut.workingColorSpace){return ut.workingToColorSpace(hn.copy(this),t),e.r=hn.r,e.g=hn.g,e.b=hn.b,e}getStyle(e=un){ut.workingToColorSpace(hn.copy(this),e);let t=hn.r,n=hn.g,s=hn.b;return e!==un?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(is),this.setHSL(is.h+e,is.s+t,is.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(is),e.getHSL(Ca);let n=po(is.h,Ca.h,t),s=po(is.s,Ca.s,t),r=po(is.l,Ca.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},hn=new Qe;Qe.NAMES=Uf;var Um=0,Ti=class extends Si{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Um++}),this.uuid=Mi(),this.name="",this.type="Material",this.blending=Rs,this.side=Gi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Qa,this.blendDst=el,this.blendEquation=os,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Qe(0,0,0),this.blendAlpha=0,this.depthFunc=Cs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Uh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ts,this.stencilZFail=Ts,this.stencilZPass=Ts,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Rs&&(n.blending=this.blending),this.side!==Gi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Qa&&(n.blendSrc=this.blendSrc),this.blendDst!==el&&(n.blendDst=this.blendDst),this.blendEquation!==os&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Cs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Uh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ts&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ts&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ts&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},fn=class extends Ti{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new di,this.combine=Zh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Yt=new D,Pa=new ae,Fm=0,An=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Fm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=sl,this.updateRanges=[],this.gpuType=Ci,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Pa.fromBufferAttribute(this,t),Pa.applyMatrix3(e),this.setXY(t,Pa.x,Pa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Yt.fromBufferAttribute(this,t),Yt.applyMatrix3(e),this.setXYZ(t,Yt.x,Yt.y,Yt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Yt.fromBufferAttribute(this,t),Yt.applyMatrix4(e),this.setXYZ(t,Yt.x,Yt.y,Yt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Yt.fromBufferAttribute(this,t),Yt.applyNormalMatrix(e),this.setXYZ(t,Yt.x,Yt.y,Yt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Yt.fromBufferAttribute(this,t),Yt.transformDirection(e),this.setXYZ(t,Yt.x,Yt.y,Yt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ci(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=vt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ci(t,this.array)),t}setX(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ci(t,this.array)),t}setY(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ci(t,this.array)),t}setZ(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ci(t,this.array)),t}setW(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),s=vt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),s=vt(s,this.array),r=vt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==sl&&(e.usage=this.usage),e}};var Mo=class extends An{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var So=class extends An{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var ft=class extends An{constructor(e,t,n){super(new Float32Array(e),t,n)}},Om=0,Yn=new gt,bh=new Qt,ur=new D,On=new wi,ao=new wi,rn=new D,At=class i extends Si{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Om++}),this.uuid=Mi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(hu(e)?So:Mo)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new et().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Yn.makeRotationFromQuaternion(e),this.applyMatrix4(Yn),this}rotateX(e){return Yn.makeRotationX(e),this.applyMatrix4(Yn),this}rotateY(e){return Yn.makeRotationY(e),this.applyMatrix4(Yn),this}rotateZ(e){return Yn.makeRotationZ(e),this.applyMatrix4(Yn),this}translate(e,t,n){return Yn.makeTranslation(e,t,n),this.applyMatrix4(Yn),this}scale(e,t,n){return Yn.makeScale(e,t,n),this.applyMatrix4(Yn),this}lookAt(e){return bh.lookAt(e),bh.updateMatrix(),this.applyMatrix4(bh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ur).negate(),this.translate(ur.x,ur.y,ur.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ft(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new wi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];On.setFromBufferAttribute(r),this.morphTargetsRelative?(rn.addVectors(this.boundingBox.min,On.min),this.boundingBox.expandByPoint(rn),rn.addVectors(this.boundingBox.max,On.max),this.boundingBox.expandByPoint(rn)):(this.boundingBox.expandByPoint(On.min),this.boundingBox.expandByPoint(On.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Is);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){let n=this.boundingSphere.center;if(On.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];ao.setFromBufferAttribute(a),this.morphTargetsRelative?(rn.addVectors(On.min,ao.min),On.expandByPoint(rn),rn.addVectors(On.max,ao.max),On.expandByPoint(rn)):(On.expandByPoint(ao.min),On.expandByPoint(ao.max))}On.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)rn.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(rn));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)rn.fromBufferAttribute(a,c),l&&(ur.fromBufferAttribute(e,c),rn.add(ur)),s=Math.max(s,n.distanceToSquared(rn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new An(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let L=0;L<n.count;L++)a[L]=new D,l[L]=new D;let c=new D,h=new D,d=new D,m=new ae,f=new ae,g=new ae,_=new D,p=new D;function u(L,v,S){c.fromBufferAttribute(n,L),h.fromBufferAttribute(n,v),d.fromBufferAttribute(n,S),m.fromBufferAttribute(r,L),f.fromBufferAttribute(r,v),g.fromBufferAttribute(r,S),h.sub(c),d.sub(c),f.sub(m),g.sub(m);let I=1/(f.x*g.y-g.x*f.y);isFinite(I)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(I),p.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(I),a[L].add(_),a[v].add(_),a[S].add(_),l[L].add(p),l[v].add(p),l[S].add(p))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let L=0,v=b.length;L<v;++L){let S=b[L],I=S.start,W=S.count;for(let $=I,Y=I+W;$<Y;$+=3)u(e.getX($+0),e.getX($+1),e.getX($+2))}let E=new D,x=new D,T=new D,w=new D;function C(L){T.fromBufferAttribute(s,L),w.copy(T);let v=a[L];E.copy(v),E.sub(T.multiplyScalar(T.dot(v))).normalize(),x.crossVectors(w,v);let I=x.dot(l[L])<0?-1:1;o.setXYZW(L,E.x,E.y,E.z,I)}for(let L=0,v=b.length;L<v;++L){let S=b[L],I=S.start,W=S.count;for(let $=I,Y=I+W;$<Y;$+=3)C(e.getX($+0)),C(e.getX($+1)),C(e.getX($+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new An(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let m=0,f=n.count;m<f;m++)n.setXYZ(m,0,0,0);let s=new D,r=new D,o=new D,a=new D,l=new D,c=new D,h=new D,d=new D;if(e)for(let m=0,f=e.count;m<f;m+=3){let g=e.getX(m+0),_=e.getX(m+1),p=e.getX(m+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,p),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let m=0,f=t.count;m<f;m+=3)s.fromBufferAttribute(t,m+0),r.fromBufferAttribute(t,m+1),o.fromBufferAttribute(t,m+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(m+0,h.x,h.y,h.z),n.setXYZ(m+1,h.x,h.y,h.z),n.setXYZ(m+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)rn.fromBufferAttribute(e,t),rn.normalize(),e.setXYZ(t,rn.x,rn.y,rn.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,d=a.normalized,m=new c.constructor(l.length*h),f=0,g=0;for(let _=0,p=l.length;_<p;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*h;for(let u=0;u<h;u++)m[g++]=c[f++]}return new An(m,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){let m=c[h],f=e(m,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,m=c.length;d<m;d++){let f=c[d];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],d=r[c];for(let m=0,f=d.length;m<f;m++)h.push(d[m].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Td=new gt,Es=new as,Ia=new Is,Ad=new D,Da=new D,La=new D,Na=new D,Mh=new D,Ua=new D,Rd=new D,Fa=new D,Mt=class extends Qt{constructor(e=new At,t=new fn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Ua.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],d=r[l];h!==0&&(Mh.fromBufferAttribute(d,e),o?Ua.addScaledVector(Mh,h):Ua.addScaledVector(Mh.sub(t),h))}t.add(Ua)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ia.copy(n.boundingSphere),Ia.applyMatrix4(r),Es.copy(e.ray).recast(e.near),!(Ia.containsPoint(Es.origin)===!1&&(Es.intersectSphere(Ia,Ad)===null||Es.origin.distanceToSquared(Ad)>(e.far-e.near)**2))&&(Td.copy(r).invert(),Es.copy(e.ray).applyMatrix4(Td),!(n.boundingBox!==null&&Es.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Es)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,m=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=m.length;g<_;g++){let p=m[g],u=o[p.materialIndex],b=Math.max(p.start,f.start),E=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let x=b,T=E;x<T;x+=3){let w=a.getX(x),C=a.getX(x+1),L=a.getX(x+2);s=Oa(this,u,e,n,c,h,d,w,C,L),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let p=g,u=_;p<u;p+=3){let b=a.getX(p),E=a.getX(p+1),x=a.getX(p+2);s=Oa(this,o,e,n,c,h,d,b,E,x),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=m.length;g<_;g++){let p=m[g],u=o[p.materialIndex],b=Math.max(p.start,f.start),E=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let x=b,T=E;x<T;x+=3){let w=x,C=x+1,L=x+2;s=Oa(this,u,e,n,c,h,d,w,C,L),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let p=g,u=_;p<u;p+=3){let b=p,E=p+1,x=p+2;s=Oa(this,o,e,n,c,h,d,b,E,x),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}};function Bm(i,e,t,n,s,r,o,a){let l;if(e.side===bn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Gi,a),l===null)return null;Fa.copy(a),Fa.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Fa);return c<t.near||c>t.far?null:{distance:c,point:Fa.clone(),object:i}}function Oa(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,Da),i.getVertexPosition(l,La),i.getVertexPosition(c,Na);let h=Bm(i,e,t,n,Da,La,Na,Rd);if(h){let d=new D;bi.getBarycoord(Rd,Da,La,Na,d),s&&(h.uv=bi.getInterpolatedAttribute(s,a,l,c,d,new ae)),r&&(h.uv1=bi.getInterpolatedAttribute(r,a,l,c,d,new ae)),o&&(h.normal=bi.getInterpolatedAttribute(o,a,l,c,d,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let m={a,b:l,c,normal:new D,materialIndex:0};bi.getNormal(Da,La,Na,m.normal),h.face=m,h.barycoord=d}return h}var Wt=class i extends At{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],d=[],m=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ft(c,3)),this.setAttribute("normal",new ft(h,3)),this.setAttribute("uv",new ft(d,2));function g(_,p,u,b,E,x,T,w,C,L,v){let S=x/C,I=T/L,W=x/2,$=T/2,Y=w/2,z=C+1,G=L+1,Q=0,X=0,de=new D;for(let xe=0;xe<G;xe++){let Ee=xe*I-$;for(let Xe=0;Xe<z;Xe++){let nt=Xe*S-W;de[_]=nt*b,de[p]=Ee*E,de[u]=Y,c.push(de.x,de.y,de.z),de[_]=0,de[p]=0,de[u]=w>0?1:-1,h.push(de.x,de.y,de.z),d.push(Xe/C),d.push(1-xe/L),Q+=1}}for(let xe=0;xe<L;xe++)for(let Ee=0;Ee<C;Ee++){let Xe=m+Ee+z*xe,nt=m+Ee+z*(xe+1),ht=m+(Ee+1)+z*(xe+1),ct=m+(Ee+1)+z*xe;l.push(Xe,nt,ct),l.push(nt,ht,ct),X+=6}a.addGroup(f,X,v),f+=X,m+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function ks(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function pn(i){let e={};for(let t=0;t<i.length;t++){let n=ks(i[t]);for(let s in n)e[s]=n[s]}return e}function km(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function uu(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ut.workingColorSpace}var Ff={clone:ks,merge:pn},zm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Hm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,fi=class extends Ti{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=zm,this.fragmentShader=Hm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ks(e.uniforms),this.uniformsGroups=km(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Eo=class extends Qt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new gt,this.projectionMatrix=new gt,this.projectionMatrixInverse=new gt,this.coordinateSystem=hi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},ss=new D,Cd=new ae,Pd=new ae,on=class extends Eo{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=br*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(xr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return br*2*Math.atan(Math.tan(xr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ss.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ss.x,ss.y).multiplyScalar(-e/ss.z),ss.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ss.x,ss.y).multiplyScalar(-e/ss.z)}getViewSize(e,t){return this.getViewBounds(e,Cd,Pd),t.subVectors(Pd,Cd)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(xr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},dr=-90,fr=1,ll=class extends Qt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new on(dr,fr,e,t);s.layers=this.layers,this.add(s);let r=new on(dr,fr,e,t);r.layers=this.layers,this.add(r);let o=new on(dr,fr,e,t);o.layers=this.layers,this.add(o);let a=new on(dr,fr,e,t);a.layers=this.layers,this.add(a);let l=new on(dr,fr,e,t);l.layers=this.layers,this.add(l);let c=new on(dr,fr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===hi)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===yo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,d=e.getRenderTarget(),m=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(d,m,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},wo=class extends Rn{constructor(e=[],t=Os,n,s,r,o,a,l,c,h){super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},cl=class extends Ei{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new wo(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Wt(5,5,5),r=new fi({name:"CubemapFromEquirect",uniforms:ks(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:bn,blending:$i});r.uniforms.tEquirect.value=t;let o=new Mt(s,r),a=t.minFilter;return t.minFilter===ms&&(t.minFilter=ui),new ll(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},dn=class extends Qt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Vm={type:"move"},wr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new dn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new dn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new dn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let p=t.getJointPose(_,n),u=this._getHandJoint(c,_);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],m=h.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&m>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&m<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Vm)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new dn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var To=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Qe(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Ds=class extends Qt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new di,this.environmentIntensity=1,this.environmentRotation=new di,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},hl=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=sl,this.updateRanges=[],this.version=0,this.uuid=Mi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Mi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Mi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},vn=new D,Ao=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)vn.fromBufferAttribute(this,t),vn.applyMatrix4(e),this.setXYZ(t,vn.x,vn.y,vn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)vn.fromBufferAttribute(this,t),vn.applyNormalMatrix(e),this.setXYZ(t,vn.x,vn.y,vn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)vn.fromBufferAttribute(this,t),vn.transformDirection(e),this.setXYZ(t,vn.x,vn.y,vn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=ci(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=vt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=vt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=ci(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=ci(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=ci(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=ci(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),s=vt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),s=vt(s,this.array),r=vt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new An(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Tr=class extends Ti{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Qe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},pr,lo=new D,mr=new D,gr=new D,_r=new ae,co=new ae,Of=new gt,Ba=new D,ho=new D,ka=new D,Id=new ae,Sh=new ae,Dd=new ae,Ro=class extends Qt{constructor(e=new Tr){if(super(),this.isSprite=!0,this.type="Sprite",pr===void 0){pr=new At;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new hl(t,5);pr.setIndex([0,1,2,0,2,3]),pr.setAttribute("position",new Ao(n,3,0,!1)),pr.setAttribute("uv",new Ao(n,2,3,!1))}this.geometry=pr,this.material=e,this.center=new ae(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),mr.setFromMatrixScale(this.matrixWorld),Of.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),gr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&mr.multiplyScalar(-gr.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;za(Ba.set(-.5,-.5,0),gr,o,mr,s,r),za(ho.set(.5,-.5,0),gr,o,mr,s,r),za(ka.set(.5,.5,0),gr,o,mr,s,r),Id.set(0,0),Sh.set(1,0),Dd.set(1,1);let a=e.ray.intersectTriangle(Ba,ho,ka,!1,lo);if(a===null&&(za(ho.set(-.5,.5,0),gr,o,mr,s,r),Sh.set(0,1),a=e.ray.intersectTriangle(Ba,ka,ho,!1,lo),a===null))return;let l=e.ray.origin.distanceTo(lo);l<e.near||l>e.far||t.push({distance:l,point:lo.clone(),uv:bi.getInterpolation(lo,Ba,ho,ka,Id,Sh,Dd,new ae),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function za(i,e,t,n,s,r){_r.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(co.x=r*_r.x-s*_r.y,co.y=s*_r.x+r*_r.y):co.copy(_r),i.copy(e),i.x+=co.x,i.y+=co.y,i.applyMatrix4(Of)}var Eh=new D,Gm=new D,Wm=new et,Zn=class{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Eh.subVectors(n,t).cross(Gm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Eh),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Wm.getNormalMatrix(e),s=this.coplanarPoint(Eh).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},ws=new Is,$m=new ae(.5,.5),Ha=new D,Ar=class{constructor(e=new Zn,t=new Zn,n=new Zn,s=new Zn,r=new Zn,o=new Zn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=hi,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],d=r[5],m=r[6],f=r[7],g=r[8],_=r[9],p=r[10],u=r[11],b=r[12],E=r[13],x=r[14],T=r[15];if(s[0].setComponents(c-o,f-h,u-g,T-b).normalize(),s[1].setComponents(c+o,f+h,u+g,T+b).normalize(),s[2].setComponents(c+a,f+d,u+_,T+E).normalize(),s[3].setComponents(c-a,f-d,u-_,T-E).normalize(),n)s[4].setComponents(l,m,p,x).normalize(),s[5].setComponents(c-l,f-m,u-p,T-x).normalize();else if(s[4].setComponents(c-l,f-m,u-p,T-x).normalize(),t===hi)s[5].setComponents(c+l,f+m,u+p,T+x).normalize();else if(t===yo)s[5].setComponents(l,m,p,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ws.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ws.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ws)}intersectsSprite(e){ws.center.set(0,0,0);let t=$m.distanceTo(e.center);return ws.radius=.7071067811865476+t,ws.applyMatrix4(e.matrixWorld),this.intersectsSphere(ws)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Ha.x=s.normal.x>0?e.max.x:e.min.x,Ha.y=s.normal.y>0?e.max.y:e.min.y,Ha.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ha)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Bn=class extends Ti{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Qe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ul=new D,dl=new D,Ld=new gt,uo=new as,Va=new Is,wh=new D,Nd=new D,ls=class extends Qt{constructor(e=new At,t=new Bn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)ul.fromBufferAttribute(t,s-1),dl.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=ul.distanceTo(dl);e.setAttribute("lineDistance",new ft(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Va.copy(n.boundingSphere),Va.applyMatrix4(s),Va.radius+=r,e.ray.intersectsSphere(Va)===!1)return;Ld.copy(s).invert(),uo.copy(e.ray).applyMatrix4(Ld);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,m=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=f,p=g-1;_<p;_+=c){let u=h.getX(_),b=h.getX(_+1),E=Ga(this,e,uo,l,u,b,_);E&&t.push(E)}if(this.isLineLoop){let _=h.getX(g-1),p=h.getX(f),u=Ga(this,e,uo,l,_,p,g-1);u&&t.push(u)}}else{let f=Math.max(0,o.start),g=Math.min(m.count,o.start+o.count);for(let _=f,p=g-1;_<p;_+=c){let u=Ga(this,e,uo,l,_,_+1,_);u&&t.push(u)}if(this.isLineLoop){let _=Ga(this,e,uo,l,g-1,f,g-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Ga(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(ul.fromBufferAttribute(a,s),dl.fromBufferAttribute(a,r),t.distanceSqToSegment(ul,dl,wh,Nd)>n)return;wh.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(wh);if(!(c<e.near||c>e.far))return{distance:c,point:Nd.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var Ud=new D,Fd=new D,Wi=class extends ls{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Ud.fromBufferAttribute(t,s),Fd.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Ud.distanceTo(Fd);e.setAttribute("lineDistance",new ft(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var cs=class extends Rn{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Co=class extends Rn{constructor(e,t,n=gs,s,r,o,a=jn,l=jn,c,h=vr,d=1){if(h!==vr&&h!==Or)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let m={width:e,height:t,depth:d};super(m,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Sr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Po=class extends Rn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var Ht=class i extends At{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],d=[],m=[],f=[],g=0,_=[],p=n/2,u=0;b(),o===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new ft(d,3)),this.setAttribute("normal",new ft(m,3)),this.setAttribute("uv",new ft(f,2));function b(){let x=new D,T=new D,w=0,C=(t-e)/n;for(let L=0;L<=r;L++){let v=[],S=L/r,I=S*(t-e)+e;for(let W=0;W<=s;W++){let $=W/s,Y=$*l+a,z=Math.sin(Y),G=Math.cos(Y);T.x=I*z,T.y=-S*n+p,T.z=I*G,d.push(T.x,T.y,T.z),x.set(z,C,G).normalize(),m.push(x.x,x.y,x.z),f.push($,1-S),v.push(g++)}_.push(v)}for(let L=0;L<s;L++)for(let v=0;v<r;v++){let S=_[v][L],I=_[v+1][L],W=_[v+1][L+1],$=_[v][L+1];(e>0||v!==0)&&(h.push(S,I,$),w+=3),(t>0||v!==r-1)&&(h.push(I,W,$),w+=3)}c.addGroup(u,w,0),u+=w}function E(x){let T=g,w=new ae,C=new D,L=0,v=x===!0?e:t,S=x===!0?1:-1;for(let W=1;W<=s;W++)d.push(0,p*S,0),m.push(0,S,0),f.push(.5,.5),g++;let I=g;for(let W=0;W<=s;W++){let Y=W/s*l+a,z=Math.cos(Y),G=Math.sin(Y);C.x=v*G,C.y=p*S,C.z=v*z,d.push(C.x,C.y,C.z),m.push(0,S,0),w.x=z*.5+.5,w.y=G*.5*S+.5,f.push(w.x,w.y),g++}for(let W=0;W<s;W++){let $=T+W,Y=I+W;x===!0?h.push(Y,Y+1,$):h.push(Y+1,Y,$),L+=3}c.addGroup(u,L,x===!0?1:2),u+=L}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},fl=class i extends Ht{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Wa=new D,$a=new D,Th=new D,Xa=new bi,Ls=class extends At{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let s=Math.pow(10,4),r=Math.cos(xr*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],d=new Array(3),m={},f=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);let{a:_,b:p,c:u}=Xa;if(_.fromBufferAttribute(a,c[0]),p.fromBufferAttribute(a,c[1]),u.fromBufferAttribute(a,c[2]),Xa.getNormal(Th),d[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,d[1]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,d[2]=`${Math.round(u.x*s)},${Math.round(u.y*s)},${Math.round(u.z*s)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let b=0;b<3;b++){let E=(b+1)%3,x=d[b],T=d[E],w=Xa[h[b]],C=Xa[h[E]],L=`${x}_${T}`,v=`${T}_${x}`;v in m&&m[v]?(Th.dot(m[v].normal)<=r&&(f.push(w.x,w.y,w.z),f.push(C.x,C.y,C.z)),m[v]=null):L in m||(m[L]={index0:c[b],index1:c[E],normal:Th.clone()})}}for(let g in m)if(m[g]){let{index0:_,index1:p}=m[g];Wa.fromBufferAttribute(a,_),$a.fromBufferAttribute(a,p),f.push(Wa.x,Wa.y,Wa.z),f.push($a.x,$a.y,$a.z)}this.setAttribute("position",new ft(f,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},kn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],m=n[s+1]-h,f=(o-h)/m;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new ae:new D);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new D,s=[],r=[],o=[],a=new D,l=new gt;for(let f=0;f<=e;f++){let g=f/e;s[f]=this.getTangentAt(g,new D)}r[0]=new D,o[0]=new D;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),m=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),m<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(st(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(st(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Rr=class extends kn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new ae){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),m=l-this.aX,f=c-this.aY;l=m*h-f*d+this.aX,c=m*d+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},pl=class extends Rr{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function du(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,d){let m=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+d)+(l-a)/d;m*=h,f*=h,s(o,a,m,f)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var qa=new D,Ah=new du,Rh=new du,Ch=new du,ml=class extends kn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new D){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(qa.subVectors(s[0],s[1]).add(s[0]),c=qa);let d=s[a%r],m=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(qa.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=qa),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(d),f),_=Math.pow(d.distanceToSquared(m),f),p=Math.pow(m.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),p<1e-4&&(p=_),Ah.initNonuniformCatmullRom(c.x,d.x,m.x,h.x,g,_,p),Rh.initNonuniformCatmullRom(c.y,d.y,m.y,h.y,g,_,p),Ch.initNonuniformCatmullRom(c.z,d.z,m.z,h.z,g,_,p)}else this.curveType==="catmullrom"&&(Ah.initCatmullRom(c.x,d.x,m.x,h.x,this.tension),Rh.initCatmullRom(c.y,d.y,m.y,h.y,this.tension),Ch.initCatmullRom(c.z,d.z,m.z,h.z,this.tension));return n.set(Ah.calc(l),Rh.calc(l),Ch.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new D().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Od(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function Xm(i,e){let t=1-i;return t*t*e}function qm(i,e){return 2*(1-i)*i*e}function Ym(i,e){return i*i*e}function mo(i,e,t,n){return Xm(i,e)+qm(i,t)+Ym(i,n)}function Zm(i,e){let t=1-i;return t*t*t*e}function jm(i,e){let t=1-i;return 3*t*t*i*e}function Jm(i,e){return 3*(1-i)*i*i*e}function Km(i,e){return i*i*i*e}function go(i,e,t,n,s){return Zm(i,e)+jm(i,t)+Jm(i,n)+Km(i,s)}var Io=class extends kn{constructor(e=new ae,t=new ae,n=new ae,s=new ae){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ae){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(go(e,s.x,r.x,o.x,a.x),go(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},gl=class extends kn{constructor(e=new D,t=new D,n=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new D){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(go(e,s.x,r.x,o.x,a.x),go(e,s.y,r.y,o.y,a.y),go(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Do=class extends kn{constructor(e=new ae,t=new ae){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ae){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ae){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},_l=class extends kn{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Lo=class extends kn{constructor(e=new ae,t=new ae,n=new ae){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ae){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(mo(e,s.x,r.x,o.x),mo(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},xl=class extends kn{constructor(e=new D,t=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new D){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(mo(e,s.x,r.x,o.x),mo(e,s.y,r.y,o.y),mo(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},No=class extends kn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ae){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],d=s[o>s.length-3?s.length-1:o+2];return n.set(Od(a,l.x,c.x,h.x,d.x),Od(a,l.y,c.y,h.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new ae().fromArray(s))}return this}},Fh=Object.freeze({__proto__:null,ArcCurve:pl,CatmullRomCurve3:ml,CubicBezierCurve:Io,CubicBezierCurve3:gl,EllipseCurve:Rr,LineCurve:Do,LineCurve3:_l,QuadraticBezierCurve:Lo,QuadraticBezierCurve3:xl,SplineCurve:No}),yl=class extends kn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Fh[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Fh[s.type]().fromJSON(s))}return this}},Uo=class extends yl{constructor(e){super(),this.type="Path",this.currentPoint=new ae,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Do(this.currentPoint.clone(),new ae(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Lo(this.currentPoint.clone(),new ae(e,t),new ae(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new Io(this.currentPoint.clone(),new ae(e,t),new ae(n,s),new ae(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new No(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){let c=new Rr(e,t,n,s,r,o,a,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Cr=class extends Uo{constructor(e){super(e),this.uuid=Mi(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new Uo().fromJSON(s))}return this}};function Qm(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Bf(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=sg(i,e,r,t)),i.length>80*t){a=1/0,l=1/0;let h=-1/0,d=-1/0;for(let m=t;m<s;m+=t){let f=i[m],g=i[m+1];f<a&&(a=f),g<l&&(l=g),f>h&&(h=f),g>d&&(d=g)}c=Math.max(h-a,d-l),c=c!==0?32767/c:0}return Fo(r,o,t,a,l,c,0),o}function Bf(i,e,t,n,s){let r;if(s===mg(i,e,t,n)>0)for(let o=e;o<t;o+=n)r=Bd(o/n|0,i[o],i[o+1],r);else for(let o=t-n;o>=e;o-=n)r=Bd(o/n|0,i[o],i[o+1],r);return r&&Pr(r,r.next)&&(Bo(r),r=r.next),r}function Ns(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Pr(t,t.next)||Ft(t.prev,t,t.next)===0)){if(Bo(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Fo(i,e,t,n,s,r,o){if(!i)return;!o&&r&&cg(i,n,s,r);let a=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?tg(i,n,s,r):eg(i)){e.push(l.i,i.i,c.i),Bo(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=ng(Ns(i),e),Fo(i,e,t,n,s,r,2)):o===2&&ig(i,e,t,n,s,r):Fo(Ns(i),e,t,n,s,r,1);break}}}function eg(i){let e=i.prev,t=i,n=i.next;if(Ft(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=Math.min(s,r,o),d=Math.min(a,l,c),m=Math.max(s,r,o),f=Math.max(a,l,c),g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=m&&g.y>=d&&g.y<=f&&fo(s,a,r,l,o,c,g.x,g.y)&&Ft(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function tg(i,e,t,n){let s=i.prev,r=i,o=i.next;if(Ft(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,d=r.y,m=o.y,f=Math.min(a,l,c),g=Math.min(h,d,m),_=Math.max(a,l,c),p=Math.max(h,d,m),u=Oh(f,g,e,t,n),b=Oh(_,p,e,t,n),E=i.prevZ,x=i.nextZ;for(;E&&E.z>=u&&x&&x.z<=b;){if(E.x>=f&&E.x<=_&&E.y>=g&&E.y<=p&&E!==s&&E!==o&&fo(a,h,l,d,c,m,E.x,E.y)&&Ft(E.prev,E,E.next)>=0||(E=E.prevZ,x.x>=f&&x.x<=_&&x.y>=g&&x.y<=p&&x!==s&&x!==o&&fo(a,h,l,d,c,m,x.x,x.y)&&Ft(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;E&&E.z>=u;){if(E.x>=f&&E.x<=_&&E.y>=g&&E.y<=p&&E!==s&&E!==o&&fo(a,h,l,d,c,m,E.x,E.y)&&Ft(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;x&&x.z<=b;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=p&&x!==s&&x!==o&&fo(a,h,l,d,c,m,x.x,x.y)&&Ft(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function ng(i,e){let t=i;do{let n=t.prev,s=t.next.next;!Pr(n,s)&&zf(n,t,t.next,s)&&Oo(n,s)&&Oo(s,n)&&(e.push(n.i,t.i,s.i),Bo(t),Bo(t.next),t=i=s),t=t.next}while(t!==i);return Ns(t)}function ig(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&dg(o,a)){let l=Hf(o,a);o=Ns(o,o.next),l=Ns(l,l.next),Fo(o,e,t,n,s,r,0),Fo(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function sg(i,e,t,n){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=Bf(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(ug(c))}s.sort(rg);for(let r=0;r<s.length;r++)t=og(s[r],t);return t}function rg(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function og(i,e){let t=ag(i,e);if(!t)return e;let n=Hf(t,i);return Ns(n,n.next),Ns(t,t.next)}function ag(i,e){let t=e,n=i.x,s=i.y,r=-1/0,o;if(Pr(i,t))return t;do{if(Pr(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let d=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=n&&d>r&&(r=d,o=t.x<t.next.x?t:t.next,d===n))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;t=o;do{if(n>=t.x&&t.x>=l&&n!==t.x&&kf(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let d=Math.abs(s-t.y)/(n-t.x);Oo(t,i)&&(d<h||d===h&&(t.x>o.x||t.x===o.x&&lg(o,t)))&&(o=t,h=d)}t=t.next}while(t!==a);return o}function lg(i,e){return Ft(i.prev,i,e.prev)<0&&Ft(e.next,i,i.next)<0}function cg(i,e,t,n){let s=i;do s.z===0&&(s.z=Oh(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,hg(s)}function hg(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let o=n,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,t*=2}while(e>1);return i}function Oh(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function ug(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function kf(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function fo(i,e,t,n,s,r,o,a){return!(i===o&&e===a)&&kf(i,e,t,n,s,r,o,a)}function dg(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!fg(i,e)&&(Oo(i,e)&&Oo(e,i)&&pg(i,e)&&(Ft(i.prev,i,e.prev)||Ft(i,e.prev,e))||Pr(i,e)&&Ft(i.prev,i,i.next)>0&&Ft(e.prev,e,e.next)>0)}function Ft(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Pr(i,e){return i.x===e.x&&i.y===e.y}function zf(i,e,t,n){let s=Za(Ft(i,e,t)),r=Za(Ft(i,e,n)),o=Za(Ft(t,n,i)),a=Za(Ft(t,n,e));return!!(s!==r&&o!==a||s===0&&Ya(i,t,e)||r===0&&Ya(i,n,e)||o===0&&Ya(t,i,n)||a===0&&Ya(t,e,n))}function Ya(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Za(i){return i>0?1:i<0?-1:0}function fg(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&zf(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Oo(i,e){return Ft(i.prev,i,i.next)<0?Ft(i,e,i.next)>=0&&Ft(i,i.prev,e)>=0:Ft(i,e,i.prev)<0||Ft(i,i.next,e)<0}function pg(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Hf(i,e){let t=Bh(i.i,i.x,i.y),n=Bh(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Bd(i,e,t,n){let s=Bh(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Bo(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Bh(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function mg(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var kh=class{static triangulate(e,t,n=2){return Qm(e,t,n)}},As=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];kd(e),zd(n,e);let o=e.length;t.forEach(kd);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,zd(n,t[l]);let a=kh.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function kd(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function zd(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var ko=class i extends At{constructor(e=new Cr([new ae(.5,.5),new ae(-.5,.5),new ae(-.5,-.5),new ae(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new ft(s,3)),this.setAttribute("uv",new ft(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1,m=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3,u=t.extrudePath,b=t.UVGenerator!==void 0?t.UVGenerator:gg,E,x=!1,T,w,C,L;u&&(E=u.getSpacedPoints(h),x=!0,m=!1,T=u.computeFrenetFrames(h,!1),w=new D,C=new D,L=new D),m||(p=0,f=0,g=0,_=0);let v=a.extractPoints(c),S=v.shape,I=v.holes;if(!As.isClockWise(S)){S=S.reverse();for(let re=0,ne=I.length;re<ne;re++){let K=I[re];As.isClockWise(K)&&(I[re]=K.reverse())}}function $(re){let K=10000000000000001e-36,te=re[0];for(let me=1;me<=re.length;me++){let ce=me%re.length,ge=re[ce],Ze=ge.x-te.x,qe=ge.y-te.y,A=Ze*Ze+qe*qe,y=Math.max(Math.abs(ge.x),Math.abs(ge.y),Math.abs(te.x),Math.abs(te.y)),V=K*y*y;if(A<=V){re.splice(ce,1),me--;continue}te=ge}}$(S),I.forEach($);let Y=I.length,z=S;for(let re=0;re<Y;re++){let ne=I[re];S=S.concat(ne)}function G(re,ne,K){return ne||console.error("THREE.ExtrudeGeometry: vec does not exist"),re.clone().addScaledVector(ne,K)}let Q=S.length;function X(re,ne,K){let te,me,ce,ge=re.x-ne.x,Ze=re.y-ne.y,qe=K.x-re.x,A=K.y-re.y,y=ge*ge+Ze*Ze,V=ge*A-Ze*qe;if(Math.abs(V)>Number.EPSILON){let j=Math.sqrt(y),oe=Math.sqrt(qe*qe+A*A),J=ne.x-Ze/j,Ae=ne.y+ge/j,ue=K.x-A/oe,De=K.y+qe/oe,Le=((ue-J)*A-(De-Ae)*qe)/(ge*A-Ze*qe);te=J+ge*Le-re.x,me=Ae+Ze*Le-re.y;let le=te*te+me*me;if(le<=2)return new ae(te,me);ce=Math.sqrt(le/2)}else{let j=!1;ge>Number.EPSILON?qe>Number.EPSILON&&(j=!0):ge<-Number.EPSILON?qe<-Number.EPSILON&&(j=!0):Math.sign(Ze)===Math.sign(A)&&(j=!0),j?(te=-Ze,me=ge,ce=Math.sqrt(y)):(te=ge,me=Ze,ce=Math.sqrt(y/2))}return new ae(te/ce,me/ce)}let de=[];for(let re=0,ne=z.length,K=ne-1,te=re+1;re<ne;re++,K++,te++)K===ne&&(K=0),te===ne&&(te=0),de[re]=X(z[re],z[K],z[te]);let xe=[],Ee,Xe=de.concat();for(let re=0,ne=Y;re<ne;re++){let K=I[re];Ee=[];for(let te=0,me=K.length,ce=me-1,ge=te+1;te<me;te++,ce++,ge++)ce===me&&(ce=0),ge===me&&(ge=0),Ee[te]=X(K[te],K[ce],K[ge]);xe.push(Ee),Xe=Xe.concat(Ee)}let nt;if(p===0)nt=As.triangulateShape(z,I);else{let re=[],ne=[];for(let K=0;K<p;K++){let te=K/p,me=f*Math.cos(te*Math.PI/2),ce=g*Math.sin(te*Math.PI/2)+_;for(let ge=0,Ze=z.length;ge<Ze;ge++){let qe=G(z[ge],de[ge],ce);Ie(qe.x,qe.y,-me),te===0&&re.push(qe)}for(let ge=0,Ze=Y;ge<Ze;ge++){let qe=I[ge];Ee=xe[ge];let A=[];for(let y=0,V=qe.length;y<V;y++){let j=G(qe[y],Ee[y],ce);Ie(j.x,j.y,-me),te===0&&A.push(j)}te===0&&ne.push(A)}}nt=As.triangulateShape(re,ne)}let ht=nt.length,ct=g+_;for(let re=0;re<Q;re++){let ne=m?G(S[re],Xe[re],ct):S[re];x?(C.copy(T.normals[0]).multiplyScalar(ne.x),w.copy(T.binormals[0]).multiplyScalar(ne.y),L.copy(E[0]).add(C).add(w),Ie(L.x,L.y,L.z)):Ie(ne.x,ne.y,0)}for(let re=1;re<=h;re++)for(let ne=0;ne<Q;ne++){let K=m?G(S[ne],Xe[ne],ct):S[ne];x?(C.copy(T.normals[re]).multiplyScalar(K.x),w.copy(T.binormals[re]).multiplyScalar(K.y),L.copy(E[re]).add(C).add(w),Ie(L.x,L.y,L.z)):Ie(K.x,K.y,d/h*re)}for(let re=p-1;re>=0;re--){let ne=re/p,K=f*Math.cos(ne*Math.PI/2),te=g*Math.sin(ne*Math.PI/2)+_;for(let me=0,ce=z.length;me<ce;me++){let ge=G(z[me],de[me],te);Ie(ge.x,ge.y,d+K)}for(let me=0,ce=I.length;me<ce;me++){let ge=I[me];Ee=xe[me];for(let Ze=0,qe=ge.length;Ze<qe;Ze++){let A=G(ge[Ze],Ee[Ze],te);x?Ie(A.x,A.y+E[h-1].y,E[h-1].x+K):Ie(A.x,A.y,d+K)}}}ee(),se();function ee(){let re=s.length/3;if(m){let ne=0,K=Q*ne;for(let te=0;te<ht;te++){let me=nt[te];Pe(me[2]+K,me[1]+K,me[0]+K)}ne=h+p*2,K=Q*ne;for(let te=0;te<ht;te++){let me=nt[te];Pe(me[0]+K,me[1]+K,me[2]+K)}}else{for(let ne=0;ne<ht;ne++){let K=nt[ne];Pe(K[2],K[1],K[0])}for(let ne=0;ne<ht;ne++){let K=nt[ne];Pe(K[0]+Q*h,K[1]+Q*h,K[2]+Q*h)}}n.addGroup(re,s.length/3-re,0)}function se(){let re=s.length/3,ne=0;Re(z,ne),ne+=z.length;for(let K=0,te=I.length;K<te;K++){let me=I[K];Re(me,ne),ne+=me.length}n.addGroup(re,s.length/3-re,1)}function Re(re,ne){let K=re.length;for(;--K>=0;){let te=K,me=K-1;me<0&&(me=re.length-1);for(let ce=0,ge=h+p*2;ce<ge;ce++){let Ze=Q*ce,qe=Q*(ce+1),A=ne+te+Ze,y=ne+me+Ze,V=ne+me+qe,j=ne+te+qe;rt(A,y,V,j)}}}function Ie(re,ne,K){l.push(re),l.push(ne),l.push(K)}function Pe(re,ne,K){xt(re),xt(ne),xt(K);let te=s.length/3,me=b.generateTopUV(n,s,te-3,te-2,te-1);P(me[0]),P(me[1]),P(me[2])}function rt(re,ne,K,te){xt(re),xt(ne),xt(te),xt(ne),xt(K),xt(te);let me=s.length/3,ce=b.generateSideWallUV(n,s,me-6,me-3,me-2,me-1);P(ce[0]),P(ce[1]),P(ce[3]),P(ce[1]),P(ce[2]),P(ce[3])}function xt(re){s.push(l[re*3+0]),s.push(l[re*3+1]),s.push(l[re*3+2])}function P(re){r.push(re.x),r.push(re.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return _g(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Fh[s.type]().fromJSON(s)),new i(n,e.options)}},gg={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new ae(r,o),new ae(a,l),new ae(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],d=e[n*3+2],m=e[s*3],f=e[s*3+1],g=e[s*3+2],_=e[r*3],p=e[r*3+1],u=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ae(o,1-l),new ae(c,1-d),new ae(m,1-g),new ae(_,1-u)]:[new ae(a,1-l),new ae(h,1-d),new ae(f,1-g),new ae(p,1-u)]}};function _g(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var zo=class i extends At{constructor(e=[new ae(0,-.5),new ae(.5,0),new ae(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=st(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/t,d=new D,m=new ae,f=new D,g=new D,_=new D,p=0,u=0;for(let b=0;b<=e.length-1;b++)switch(b){case 0:p=e[b+1].x-e[b].x,u=e[b+1].y-e[b].y,f.x=u*1,f.y=-p,f.z=u*0,_.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:p=e[b+1].x-e[b].x,u=e[b+1].y-e[b].y,f.x=u*1,f.y=-p,f.z=u*0,g.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),l.push(f.x,f.y,f.z),_.copy(g)}for(let b=0;b<=t;b++){let E=n+b*h*s,x=Math.sin(E),T=Math.cos(E);for(let w=0;w<=e.length-1;w++){d.x=e[w].x*x,d.y=e[w].y,d.z=e[w].x*T,o.push(d.x,d.y,d.z),m.x=b/t,m.y=w/(e.length-1),a.push(m.x,m.y);let C=l[3*w+0]*x,L=l[3*w+1],v=l[3*w+0]*T;c.push(C,L,v)}}for(let b=0;b<t;b++)for(let E=0;E<e.length-1;E++){let x=E+b*e.length,T=x,w=x+e.length,C=x+e.length+1,L=x+1;r.push(T,w,L),r.push(C,L,w)}this.setIndex(r),this.setAttribute("position",new ft(o,3)),this.setAttribute("uv",new ft(a,2)),this.setAttribute("normal",new ft(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}};var Us=class i extends At{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,d=e/a,m=t/l,f=[],g=[],_=[],p=[];for(let u=0;u<h;u++){let b=u*m-o;for(let E=0;E<c;E++){let x=E*d-r;g.push(x,-b,0),_.push(0,0,1),p.push(E/a),p.push(1-u/l)}}for(let u=0;u<l;u++)for(let b=0;b<a;b++){let E=b+c*u,x=b+c*(u+1),T=b+1+c*(u+1),w=b+1+c*u;f.push(E,x,w),f.push(x,T,w)}this.setIndex(f),this.setAttribute("position",new ft(g,3)),this.setAttribute("normal",new ft(_,3)),this.setAttribute("uv",new ft(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Kn=class i extends At{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],d=new D,m=new D,f=[],g=[],_=[],p=[];for(let u=0;u<=n;u++){let b=[],E=u/n,x=0;u===0&&o===0?x=.5/t:u===n&&l===Math.PI&&(x=-.5/t);for(let T=0;T<=t;T++){let w=T/t;d.x=-e*Math.cos(s+w*r)*Math.sin(o+E*a),d.y=e*Math.cos(o+E*a),d.z=e*Math.sin(s+w*r)*Math.sin(o+E*a),g.push(d.x,d.y,d.z),m.copy(d).normalize(),_.push(m.x,m.y,m.z),p.push(w+x,1-E),b.push(c++)}h.push(b)}for(let u=0;u<n;u++)for(let b=0;b<t;b++){let E=h[u][b+1],x=h[u][b],T=h[u+1][b],w=h[u+1][b+1];(u!==0||o>0)&&f.push(E,x,w),(u!==n-1||l<Math.PI)&&f.push(x,T,w)}this.setIndex(f),this.setAttribute("position",new ft(g,3)),this.setAttribute("normal",new ft(_,3)),this.setAttribute("uv",new ft(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Ir=class i extends At{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],l=[],c=[],h=new D,d=new D,m=new D;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){let _=g/s*r,p=f/n*Math.PI*2;d.x=(e+t*Math.cos(p))*Math.cos(_),d.y=(e+t*Math.cos(p))*Math.sin(_),d.z=t*Math.sin(p),a.push(d.x,d.y,d.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),m.subVectors(d,h).normalize(),l.push(m.x,m.y,m.z),c.push(g/s),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){let _=(s+1)*f+g-1,p=(s+1)*(f-1)+g-1,u=(s+1)*(f-1)+g,b=(s+1)*f+g;o.push(_,p,b),o.push(p,u,b)}this.setIndex(o),this.setAttribute("position",new ft(a,3)),this.setAttribute("normal",new ft(l,3)),this.setAttribute("uv",new ft(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Cn=class extends Ti{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Qe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ru,this.normalScale=new ae(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new di,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var vl=class extends Ti{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Sf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},bl=class extends Ti{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};var Dr=class extends Bn{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};function ja(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function xg(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Fs=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Ml=class extends Fs{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Dh,endingEnd:Dh}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Lh:r=e,a=2*t-n;break;case Nh:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Lh:o=e,l=2*n-t;break;case Nh:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,d=this._offsetNext,m=this._weightPrev,f=this._weightNext,g=(n-t)/(s-t),_=g*g,p=_*g,u=-m*p+2*m*_-m*g,b=(1+m)*p+(-1.5-2*m)*_+(-.5+m)*g+1,E=(-1-f)*p+(1.5+f)*_+.5*g,x=f*p-f*_;for(let T=0;T!==a;++T)r[T]=u*o[h+T]+b*o[c+T]+E*o[l+T]+x*o[d+T];return r}},Sl=class extends Fs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),d=1-h;for(let m=0;m!==a;++m)r[m]=o[c+m]*d+o[l+m]*h;return r}},El=class extends Fs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},zn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ja(t,this.TimeBufferType),this.values=ja(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ja(e.times,Array),values:ja(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new El(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Sl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ml(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case _o:t=this.InterpolantFactoryMethodDiscrete;break;case il:t=this.InterpolantFactoryMethodLinear;break;case Ka:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return _o;case this.InterpolantFactoryMethodLinear:return il;case this.InterpolantFactoryMethodSmooth:return Ka}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&xg(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ka,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let d=a*n,m=d-n,f=d+n;for(let g=0;g!==n;++g){let _=t[d+g];if(_!==t[m+g]||_!==t[f+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let d=a*n,m=o*n;for(let f=0;f!==n;++f)t[m+f]=t[d+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};zn.prototype.ValueTypeName="";zn.prototype.TimeBufferType=Float32Array;zn.prototype.ValueBufferType=Float32Array;zn.prototype.DefaultInterpolation=il;var hs=class extends zn{constructor(e,t,n){super(e,t,n)}};hs.prototype.ValueTypeName="bool";hs.prototype.ValueBufferType=Array;hs.prototype.DefaultInterpolation=_o;hs.prototype.InterpolantFactoryMethodLinear=void 0;hs.prototype.InterpolantFactoryMethodSmooth=void 0;var wl=class extends zn{constructor(e,t,n,s){super(e,t,n,s)}};wl.prototype.ValueTypeName="color";var Tl=class extends zn{constructor(e,t,n,s){super(e,t,n,s)}};Tl.prototype.ValueTypeName="number";var Al=class extends Fs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)Jn.slerpFlat(r,0,o,c-a,o,c,l);return r}},Ho=class extends zn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Al(this.times,this.values,this.getValueSize(),e)}};Ho.prototype.ValueTypeName="quaternion";Ho.prototype.InterpolantFactoryMethodSmooth=void 0;var us=class extends zn{constructor(e,t,n){super(e,t,n)}};us.prototype.ValueTypeName="string";us.prototype.ValueBufferType=Array;us.prototype.DefaultInterpolation=_o;us.prototype.InterpolantFactoryMethodLinear=void 0;us.prototype.InterpolantFactoryMethodSmooth=void 0;var Rl=class extends zn{constructor(e,t,n,s){super(e,t,n,s)}};Rl.prototype.ValueTypeName="vector";var Cl=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,m=c.length;d<m;d+=2){let f=c[d],g=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Vf=new Cl,Pl=class{constructor(e){this.manager=e!==void 0?e:Vf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Pl.DEFAULT_MATERIAL_NAME="__DEFAULT";var Vo=class extends Qt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Qe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Go=class extends Vo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Qt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Qe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Ph=new gt,Hd=new D,Vd=new D,zh=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ae(512,512),this.mapType=pi,this.map=null,this.mapPass=null,this.matrix=new gt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ar,this._frameExtents=new ae(1,1),this._viewportCount=1,this._viewports=[new Ot(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Hd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Hd),Vd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Vd),t.updateMatrixWorld(),Ph.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ph,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ph)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var Wo=class extends Eo{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Hh=class extends zh{constructor(){super(new Wo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},$o=class extends Vo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Qt.DEFAULT_UP),this.updateMatrix(),this.target=new Qt,this.shadow=new Hh}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var Il=class extends on{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var fu="\\[\\]\\.:\\/",yg=new RegExp("["+fu+"]","g"),pu="[^"+fu+"]",vg="[^"+fu.replace("\\.","")+"]",bg=/((?:WC+[\/:])*)/.source.replace("WC",pu),Mg=/(WCOD+)?/.source.replace("WCOD",vg),Sg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",pu),Eg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",pu),wg=new RegExp("^"+bg+Mg+Sg+Eg+"$"),Tg=["material","materials","bones","map"],Vh=class{constructor(e,t,n){let s=n||Dt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Dt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(yg,"")}static parseTrackName(e){let t=wg.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Tg.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Dt.Composite=Vh;Dt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Dt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Dt.prototype.GetterByBindingType=[Dt.prototype._getValue_direct,Dt.prototype._getValue_array,Dt.prototype._getValue_arrayElement,Dt.prototype._getValue_toArray];Dt.prototype.SetterByBindingTypeAndVersioning=[[Dt.prototype._setValue_direct,Dt.prototype._setValue_direct_setNeedsUpdate,Dt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Dt.prototype._setValue_array,Dt.prototype._setValue_array_setNeedsUpdate,Dt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Dt.prototype._setValue_arrayElement,Dt.prototype._setValue_arrayElement_setNeedsUpdate,Dt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Dt.prototype._setValue_fromArray,Dt.prototype._setValue_fromArray_setNeedsUpdate,Dt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var yb=new Float32Array(1);var Gd=new gt,Xo=class{constructor(e,t,n=0,s=1/0){this.ray=new as(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Er,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Gd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Gd),this}intersectObject(e,t=!0,n=[]){return Gh(e,this,n,t),n.sort(Wd),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Gh(e[s],this,n,t);return n.sort(Wd),n}};function Wd(i,e){return i.distance-e.distance}function Gh(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)Gh(r[o],e,t,!0)}}var ds=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=st(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(st(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var qo=class extends Wi{constructor(e=10,t=10,n=4473924,s=8947848){n=new Qe(n),s=new Qe(s);let r=t/2,o=e/t,a=e/2,l=[],c=[];for(let m=0,f=0,g=-a;m<=t;m++,g+=o){l.push(-a,0,g,a,0,g),l.push(g,0,-a,g,0,a);let _=m===r?n:s;_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3}let h=new At;h.setAttribute("position",new ft(l,3)),h.setAttribute("color",new ft(c,3));let d=new Bn({vertexColors:!0,toneMapped:!1});super(h,d),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}};var $d=new D,Ja,Ih,Lr=class extends Qt{constructor(e=new D(0,0,1),t=new D(0,0,0),n=1,s=16776960,r=n*.2,o=r*.2){super(),this.type="ArrowHelper",Ja===void 0&&(Ja=new At,Ja.setAttribute("position",new ft([0,0,0,0,1,0],3)),Ih=new fl(.5,1,5,1),Ih.translate(0,-.5,0)),this.position.copy(t),this.line=new ls(Ja,new Bn({color:s,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new Mt(Ih,new fn({color:s,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(n,r,o)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{$d.set(e.z,0,-e.x).normalize();let t=Math.acos(e.y);this.quaternion.setFromAxisAngle($d,t)}}setLength(e,t=e*.2,n=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(n,t,n),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}},Yo=class extends Wi{constructor(e=1){let t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new At;s.setAttribute("position",new ft(t,3)),s.setAttribute("color",new ft(n,3));let r=new Bn({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(e,t,n){let s=new Qe,r=this.geometry.attributes.color.array;return s.set(e),s.toArray(r,0),s.toArray(r,3),s.set(t),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}};var Zo=class extends Si{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function mu(i,e,t,n){let s=Ag(n);switch(t){case tu:return i*e;case iu:return i*e/s.components*s.byteLength;case Xl:return i*e/s.components*s.byteLength;case su:return i*e*2/s.components*s.byteLength;case ql:return i*e*2/s.components*s.byteLength;case nu:return i*e*3/s.components*s.byteLength;case Qn:return i*e*4/s.components*s.byteLength;case Yl:return i*e*4/s.components*s.byteLength;case Ko:case Qo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ea:case ta:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case jl:case Kl:return Math.max(i,16)*Math.max(e,8)/4;case Zl:case Jl:return Math.max(i,8)*Math.max(e,8)/2;case Ql:case ec:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case tc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case nc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ic:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case sc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case rc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case oc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ac:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case lc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case cc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case hc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case uc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case dc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case fc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case pc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case mc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case gc:case _c:case xc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case yc:case vc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case bc:case Mc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Ag(i){switch(i){case pi:case Jh:return{byteLength:1,components:1};case Nr:case Kh:case Ur:return{byteLength:2,components:1};case Wl:case $l:return{byteLength:2,components:4};case gs:case Gl:case Ci:return{byteLength:4,components:1};case Qh:case eu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function dp(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Cg(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,d=c.byteLength,m=i.createBuffer();i.bindBuffer(l,m),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:m,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){let h=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,g)=>f.start-g.start);let m=0;for(let f=1;f<d.length;f++){let g=d[m],_=d[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++m,d[m]=_)}d.length=m+1;for(let f=0,g=d.length;f<g;f++){let _=d[f];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Pg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ig=`#ifdef USE_ALPHAHASH
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
#endif`,Dg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Lg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ng=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ug=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Fg=`#ifdef USE_AOMAP
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
#endif`,Og=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Bg=`#ifdef USE_BATCHING
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
#endif`,kg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,zg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Hg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Vg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Gg=`#ifdef USE_IRIDESCENCE
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
#endif`,Wg=`#ifdef USE_BUMPMAP
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
#endif`,$g=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Xg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,qg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Yg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Zg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,jg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Jg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Kg=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Qg=`#define PI 3.141592653589793
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
} // validated`,e0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,t0=`vec3 transformedNormal = objectNormal;
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
#endif`,n0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,i0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,s0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,r0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,o0="gl_FragColor = linearToOutputTexel( gl_FragColor );",a0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,l0=`#ifdef USE_ENVMAP
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
#endif`,c0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,h0=`#ifdef USE_ENVMAP
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
#endif`,u0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,d0=`#ifdef USE_ENVMAP
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
#endif`,f0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,p0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,m0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,g0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_0=`#ifdef USE_GRADIENTMAP
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
}`,x0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,y0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,v0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,b0=`uniform bool receiveShadow;
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
#endif`,M0=`#ifdef USE_ENVMAP
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
#endif`,S0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,E0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,w0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,T0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,A0=`PhysicalMaterial material;
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
#endif`,R0=`struct PhysicalMaterial {
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
}`,C0=`
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
#endif`,P0=`#if defined( RE_IndirectDiffuse )
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
#endif`,I0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,D0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,L0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,N0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,U0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,F0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,O0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,B0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,k0=`#if defined( USE_POINTS_UV )
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
#endif`,z0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,H0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,V0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,G0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,W0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$0=`#ifdef USE_MORPHTARGETS
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
#endif`,X0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,q0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Y0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Z0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,j0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,J0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,K0=`#ifdef USE_NORMALMAP
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
#endif`,Q0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,e_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,t_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,n_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,i_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,s_=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,r_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,o_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,a_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,l_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,c_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,h_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,u_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,d_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,f_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,p_=`float getShadowMask() {
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
}`,m_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,g_=`#ifdef USE_SKINNING
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
#endif`,__=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,x_=`#ifdef USE_SKINNING
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
#endif`,y_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,v_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,b_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,M_=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,S_=`#ifdef USE_TRANSMISSION
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
#endif`,E_=`#ifdef USE_TRANSMISSION
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
#endif`,w_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,T_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,A_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,R_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,C_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,P_=`uniform sampler2D t2D;
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
}`,I_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,D_=`#ifdef ENVMAP_TYPE_CUBE
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
}`,L_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,N_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,U_=`#include <common>
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
}`,F_=`#if DEPTH_PACKING == 3200
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
}`,O_=`#define DISTANCE
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
}`,B_=`#define DISTANCE
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
}`,k_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,z_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,H_=`uniform float scale;
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
}`,V_=`uniform vec3 diffuse;
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
}`,G_=`#include <common>
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
}`,W_=`uniform vec3 diffuse;
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
}`,$_=`#define LAMBERT
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
}`,X_=`#define LAMBERT
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
}`,q_=`#define MATCAP
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
}`,Y_=`#define MATCAP
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
}`,Z_=`#define NORMAL
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
}`,j_=`#define NORMAL
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
}`,J_=`#define PHONG
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
}`,K_=`#define PHONG
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
}`,Q_=`#define STANDARD
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
}`,ex=`#define STANDARD
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
}`,tx=`#define TOON
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
}`,nx=`#define TOON
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
}`,ix=`uniform float size;
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
}`,sx=`uniform vec3 diffuse;
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
}`,rx=`#include <common>
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
}`,ox=`uniform vec3 color;
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
}`,ax=`uniform float rotation;
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
}`,lx=`uniform vec3 diffuse;
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
}`,ot={alphahash_fragment:Pg,alphahash_pars_fragment:Ig,alphamap_fragment:Dg,alphamap_pars_fragment:Lg,alphatest_fragment:Ng,alphatest_pars_fragment:Ug,aomap_fragment:Fg,aomap_pars_fragment:Og,batching_pars_vertex:Bg,batching_vertex:kg,begin_vertex:zg,beginnormal_vertex:Hg,bsdfs:Vg,iridescence_fragment:Gg,bumpmap_pars_fragment:Wg,clipping_planes_fragment:$g,clipping_planes_pars_fragment:Xg,clipping_planes_pars_vertex:qg,clipping_planes_vertex:Yg,color_fragment:Zg,color_pars_fragment:jg,color_pars_vertex:Jg,color_vertex:Kg,common:Qg,cube_uv_reflection_fragment:e0,defaultnormal_vertex:t0,displacementmap_pars_vertex:n0,displacementmap_vertex:i0,emissivemap_fragment:s0,emissivemap_pars_fragment:r0,colorspace_fragment:o0,colorspace_pars_fragment:a0,envmap_fragment:l0,envmap_common_pars_fragment:c0,envmap_pars_fragment:h0,envmap_pars_vertex:u0,envmap_physical_pars_fragment:M0,envmap_vertex:d0,fog_vertex:f0,fog_pars_vertex:p0,fog_fragment:m0,fog_pars_fragment:g0,gradientmap_pars_fragment:_0,lightmap_pars_fragment:x0,lights_lambert_fragment:y0,lights_lambert_pars_fragment:v0,lights_pars_begin:b0,lights_toon_fragment:S0,lights_toon_pars_fragment:E0,lights_phong_fragment:w0,lights_phong_pars_fragment:T0,lights_physical_fragment:A0,lights_physical_pars_fragment:R0,lights_fragment_begin:C0,lights_fragment_maps:P0,lights_fragment_end:I0,logdepthbuf_fragment:D0,logdepthbuf_pars_fragment:L0,logdepthbuf_pars_vertex:N0,logdepthbuf_vertex:U0,map_fragment:F0,map_pars_fragment:O0,map_particle_fragment:B0,map_particle_pars_fragment:k0,metalnessmap_fragment:z0,metalnessmap_pars_fragment:H0,morphinstance_vertex:V0,morphcolor_vertex:G0,morphnormal_vertex:W0,morphtarget_pars_vertex:$0,morphtarget_vertex:X0,normal_fragment_begin:q0,normal_fragment_maps:Y0,normal_pars_fragment:Z0,normal_pars_vertex:j0,normal_vertex:J0,normalmap_pars_fragment:K0,clearcoat_normal_fragment_begin:Q0,clearcoat_normal_fragment_maps:e_,clearcoat_pars_fragment:t_,iridescence_pars_fragment:n_,opaque_fragment:i_,packing:s_,premultiplied_alpha_fragment:r_,project_vertex:o_,dithering_fragment:a_,dithering_pars_fragment:l_,roughnessmap_fragment:c_,roughnessmap_pars_fragment:h_,shadowmap_pars_fragment:u_,shadowmap_pars_vertex:d_,shadowmap_vertex:f_,shadowmask_pars_fragment:p_,skinbase_vertex:m_,skinning_pars_vertex:g_,skinning_vertex:__,skinnormal_vertex:x_,specularmap_fragment:y_,specularmap_pars_fragment:v_,tonemapping_fragment:b_,tonemapping_pars_fragment:M_,transmission_fragment:S_,transmission_pars_fragment:E_,uv_pars_fragment:w_,uv_pars_vertex:T_,uv_vertex:A_,worldpos_vertex:R_,background_vert:C_,background_frag:P_,backgroundCube_vert:I_,backgroundCube_frag:D_,cube_vert:L_,cube_frag:N_,depth_vert:U_,depth_frag:F_,distanceRGBA_vert:O_,distanceRGBA_frag:B_,equirect_vert:k_,equirect_frag:z_,linedashed_vert:H_,linedashed_frag:V_,meshbasic_vert:G_,meshbasic_frag:W_,meshlambert_vert:$_,meshlambert_frag:X_,meshmatcap_vert:q_,meshmatcap_frag:Y_,meshnormal_vert:Z_,meshnormal_frag:j_,meshphong_vert:J_,meshphong_frag:K_,meshphysical_vert:Q_,meshphysical_frag:ex,meshtoon_vert:tx,meshtoon_frag:nx,points_vert:ix,points_frag:sx,shadow_vert:rx,shadow_frag:ox,sprite_vert:ax,sprite_frag:lx},be={common:{diffuse:{value:new Qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new et}},envmap:{envMap:{value:null},envMapRotation:{value:new et},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new et}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new et}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new et},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new et},normalScale:{value:new ae(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new et},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new et}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new et}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new et}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0},uvTransform:{value:new et}},sprite:{diffuse:{value:new Qe(16777215)},opacity:{value:1},center:{value:new ae(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}}},Pi={basic:{uniforms:pn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.fog]),vertexShader:ot.meshbasic_vert,fragmentShader:ot.meshbasic_frag},lambert:{uniforms:pn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new Qe(0)}}]),vertexShader:ot.meshlambert_vert,fragmentShader:ot.meshlambert_frag},phong:{uniforms:pn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new Qe(0)},specular:{value:new Qe(1118481)},shininess:{value:30}}]),vertexShader:ot.meshphong_vert,fragmentShader:ot.meshphong_frag},standard:{uniforms:pn([be.common,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.roughnessmap,be.metalnessmap,be.fog,be.lights,{emissive:{value:new Qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ot.meshphysical_vert,fragmentShader:ot.meshphysical_frag},toon:{uniforms:pn([be.common,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.gradientmap,be.fog,be.lights,{emissive:{value:new Qe(0)}}]),vertexShader:ot.meshtoon_vert,fragmentShader:ot.meshtoon_frag},matcap:{uniforms:pn([be.common,be.bumpmap,be.normalmap,be.displacementmap,be.fog,{matcap:{value:null}}]),vertexShader:ot.meshmatcap_vert,fragmentShader:ot.meshmatcap_frag},points:{uniforms:pn([be.points,be.fog]),vertexShader:ot.points_vert,fragmentShader:ot.points_frag},dashed:{uniforms:pn([be.common,be.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ot.linedashed_vert,fragmentShader:ot.linedashed_frag},depth:{uniforms:pn([be.common,be.displacementmap]),vertexShader:ot.depth_vert,fragmentShader:ot.depth_frag},normal:{uniforms:pn([be.common,be.bumpmap,be.normalmap,be.displacementmap,{opacity:{value:1}}]),vertexShader:ot.meshnormal_vert,fragmentShader:ot.meshnormal_frag},sprite:{uniforms:pn([be.sprite,be.fog]),vertexShader:ot.sprite_vert,fragmentShader:ot.sprite_frag},background:{uniforms:{uvTransform:{value:new et},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ot.background_vert,fragmentShader:ot.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new et}},vertexShader:ot.backgroundCube_vert,fragmentShader:ot.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ot.cube_vert,fragmentShader:ot.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ot.equirect_vert,fragmentShader:ot.equirect_frag},distanceRGBA:{uniforms:pn([be.common,be.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ot.distanceRGBA_vert,fragmentShader:ot.distanceRGBA_frag},shadow:{uniforms:pn([be.lights,be.fog,{color:{value:new Qe(0)},opacity:{value:1}}]),vertexShader:ot.shadow_vert,fragmentShader:ot.shadow_frag}};Pi.physical={uniforms:pn([Pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new et},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new et},clearcoatNormalScale:{value:new ae(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new et},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new et},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new et},sheen:{value:0},sheenColor:{value:new Qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new et},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new et},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new et},transmissionSamplerSize:{value:new ae},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new et},attenuationDistance:{value:0},attenuationColor:{value:new Qe(0)},specularColor:{value:new Qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new et},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new et},anisotropyVector:{value:new ae},anisotropyMap:{value:null},anisotropyMapTransform:{value:new et}}]),vertexShader:ot.meshphysical_vert,fragmentShader:ot.meshphysical_frag};var Sc={r:0,b:0,g:0},zs=new di,cx=new gt;function hx(i,e,t,n,s,r,o){let a=new Qe(0),l=r===!0?0:1,c,h,d=null,m=0,f=null;function g(E){let x=E.isScene===!0?E.background:null;return x&&x.isTexture&&(x=(E.backgroundBlurriness>0?t:e).get(x)),x}function _(E){let x=!1,T=g(E);T===null?u(a,l):T&&T.isColor&&(u(T,1),x=!0);let w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(E,x){let T=g(x);T&&(T.isCubeTexture||T.mapping===jo)?(h===void 0&&(h=new Mt(new Wt(1,1,1),new fi({name:"BackgroundCubeMaterial",uniforms:ks(Pi.backgroundCube.uniforms),vertexShader:Pi.backgroundCube.vertexShader,fragmentShader:Pi.backgroundCube.fragmentShader,side:bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,C,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),zs.copy(x.backgroundRotation),zs.x*=-1,zs.y*=-1,zs.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(zs.y*=-1,zs.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(cx.makeRotationFromEuler(zs)),h.material.toneMapped=ut.getTransfer(T.colorSpace)!==bt,(d!==T||m!==T.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,d=T,m=T.version,f=i.toneMapping),h.layers.enableAll(),E.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new Mt(new Us(2,2),new fi({name:"BackgroundMaterial",uniforms:ks(Pi.background.uniforms),vertexShader:Pi.background.vertexShader,fragmentShader:Pi.background.fragmentShader,side:Gi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=ut.getTransfer(T.colorSpace)!==bt,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(d!==T||m!==T.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,d=T,m=T.version,f=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function u(E,x){E.getRGB(Sc,uu(i)),n.buffers.color.setClear(Sc.r,Sc.g,Sc.b,x,o)}function b(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,x=1){a.set(E),l=x,u(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,u(a,l)},render:_,addToRenderList:p,dispose:b}}function ux(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=m(null),r=s,o=!1;function a(S,I,W,$,Y){let z=!1,G=d($,W,I);r!==G&&(r=G,c(r.object)),z=f(S,$,W,Y),z&&g(S,$,W,Y),Y!==null&&e.update(Y,i.ELEMENT_ARRAY_BUFFER),(z||o)&&(o=!1,x(S,I,W,$),Y!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(Y).buffer))}function l(){return i.createVertexArray()}function c(S){return i.bindVertexArray(S)}function h(S){return i.deleteVertexArray(S)}function d(S,I,W){let $=W.wireframe===!0,Y=n[S.id];Y===void 0&&(Y={},n[S.id]=Y);let z=Y[I.id];z===void 0&&(z={},Y[I.id]=z);let G=z[$];return G===void 0&&(G=m(l()),z[$]=G),G}function m(S){let I=[],W=[],$=[];for(let Y=0;Y<t;Y++)I[Y]=0,W[Y]=0,$[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:W,attributeDivisors:$,object:S,attributes:{},index:null}}function f(S,I,W,$){let Y=r.attributes,z=I.attributes,G=0,Q=W.getAttributes();for(let X in Q)if(Q[X].location>=0){let xe=Y[X],Ee=z[X];if(Ee===void 0&&(X==="instanceMatrix"&&S.instanceMatrix&&(Ee=S.instanceMatrix),X==="instanceColor"&&S.instanceColor&&(Ee=S.instanceColor)),xe===void 0||xe.attribute!==Ee||Ee&&xe.data!==Ee.data)return!0;G++}return r.attributesNum!==G||r.index!==$}function g(S,I,W,$){let Y={},z=I.attributes,G=0,Q=W.getAttributes();for(let X in Q)if(Q[X].location>=0){let xe=z[X];xe===void 0&&(X==="instanceMatrix"&&S.instanceMatrix&&(xe=S.instanceMatrix),X==="instanceColor"&&S.instanceColor&&(xe=S.instanceColor));let Ee={};Ee.attribute=xe,xe&&xe.data&&(Ee.data=xe.data),Y[X]=Ee,G++}r.attributes=Y,r.attributesNum=G,r.index=$}function _(){let S=r.newAttributes;for(let I=0,W=S.length;I<W;I++)S[I]=0}function p(S){u(S,0)}function u(S,I){let W=r.newAttributes,$=r.enabledAttributes,Y=r.attributeDivisors;W[S]=1,$[S]===0&&(i.enableVertexAttribArray(S),$[S]=1),Y[S]!==I&&(i.vertexAttribDivisor(S,I),Y[S]=I)}function b(){let S=r.newAttributes,I=r.enabledAttributes;for(let W=0,$=I.length;W<$;W++)I[W]!==S[W]&&(i.disableVertexAttribArray(W),I[W]=0)}function E(S,I,W,$,Y,z,G){G===!0?i.vertexAttribIPointer(S,I,W,Y,z):i.vertexAttribPointer(S,I,W,$,Y,z)}function x(S,I,W,$){_();let Y=$.attributes,z=W.getAttributes(),G=I.defaultAttributeValues;for(let Q in z){let X=z[Q];if(X.location>=0){let de=Y[Q];if(de===void 0&&(Q==="instanceMatrix"&&S.instanceMatrix&&(de=S.instanceMatrix),Q==="instanceColor"&&S.instanceColor&&(de=S.instanceColor)),de!==void 0){let xe=de.normalized,Ee=de.itemSize,Xe=e.get(de);if(Xe===void 0)continue;let nt=Xe.buffer,ht=Xe.type,ct=Xe.bytesPerElement,ee=ht===i.INT||ht===i.UNSIGNED_INT||de.gpuType===Gl;if(de.isInterleavedBufferAttribute){let se=de.data,Re=se.stride,Ie=de.offset;if(se.isInstancedInterleavedBuffer){for(let Pe=0;Pe<X.locationSize;Pe++)u(X.location+Pe,se.meshPerAttribute);S.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let Pe=0;Pe<X.locationSize;Pe++)p(X.location+Pe);i.bindBuffer(i.ARRAY_BUFFER,nt);for(let Pe=0;Pe<X.locationSize;Pe++)E(X.location+Pe,Ee/X.locationSize,ht,xe,Re*ct,(Ie+Ee/X.locationSize*Pe)*ct,ee)}else{if(de.isInstancedBufferAttribute){for(let se=0;se<X.locationSize;se++)u(X.location+se,de.meshPerAttribute);S.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let se=0;se<X.locationSize;se++)p(X.location+se);i.bindBuffer(i.ARRAY_BUFFER,nt);for(let se=0;se<X.locationSize;se++)E(X.location+se,Ee/X.locationSize,ht,xe,Ee*ct,Ee/X.locationSize*se*ct,ee)}}else if(G!==void 0){let xe=G[Q];if(xe!==void 0)switch(xe.length){case 2:i.vertexAttrib2fv(X.location,xe);break;case 3:i.vertexAttrib3fv(X.location,xe);break;case 4:i.vertexAttrib4fv(X.location,xe);break;default:i.vertexAttrib1fv(X.location,xe)}}}}b()}function T(){L();for(let S in n){let I=n[S];for(let W in I){let $=I[W];for(let Y in $)h($[Y].object),delete $[Y];delete I[W]}delete n[S]}}function w(S){if(n[S.id]===void 0)return;let I=n[S.id];for(let W in I){let $=I[W];for(let Y in $)h($[Y].object),delete $[Y];delete I[W]}delete n[S.id]}function C(S){for(let I in n){let W=n[I];if(W[S.id]===void 0)continue;let $=W[S.id];for(let Y in $)h($[Y].object),delete $[Y];delete W[S.id]}}function L(){v(),o=!0,r!==s&&(r=s,c(r.object))}function v(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:L,resetDefaultState:v,dispose:T,releaseStatesOfGeometry:w,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:p,disableUnusedAttributes:b}}function dx(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,d){d!==0&&(i.drawArraysInstanced(n,c,h,d),t.update(h,n,d))}function a(c,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let f=0;for(let g=0;g<d;g++)f+=h[g];t.update(f,n,1)}function l(c,h,d,m){if(d===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],m[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,m,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_]*m[_];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function fx(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==Qn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let L=C===Ur&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==pi&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Ci&&!L)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=t.logarithmicDepthBuffer===!0,m=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),u=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:m,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:p,maxAttributes:u,maxVertexUniforms:b,maxVaryings:E,maxFragmentUniforms:x,vertexTextures:T,maxSamples:w}}function px(i){let e=this,t=null,n=0,s=!1,r=!1,o=new Zn,a=new et,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,m){let f=d.length!==0||m||n!==0||s;return s=m,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,m){t=h(d,m,0)},this.setState=function(d,m,f){let g=d.clippingPlanes,_=d.clipIntersection,p=d.clipShadows,u=i.get(d);if(!s||g===null||g.length===0||r&&!p)r?h(null):c();else{let b=r?0:n,E=b*4,x=u.clippingState||null;l.value=x,x=h(g,m,E,f);for(let T=0;T!==E;++T)x[T]=t[T];u.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,m,f,g){let _=d!==null?d.length:0,p=null;if(_!==0){if(p=l.value,g!==!0||p===null){let u=f+_*4,b=m.matrixWorldInverse;a.getNormalMatrix(b),(p===null||p.length<u)&&(p=new Float32Array(u));for(let E=0,x=f;E!==_;++E,x+=4)o.copy(d[E]).applyMatrix4(b,a),o.normal.toArray(p,x),p[x+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}function mx(i){let e=new WeakMap;function t(o,a){return a===zl?o.mapping=Os:a===Hl&&(o.mapping=Bs),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===zl||a===Hl)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new cl(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var kr=4,Gf=[.125,.215,.35,.446,.526,.582],Gs=20,gu=new Wo,Wf=new Qe,_u=null,xu=0,yu=0,vu=!1,Vs=(1+Math.sqrt(5))/2,Br=1/Vs,$f=[new D(-Vs,Br,0),new D(Vs,Br,0),new D(-Br,0,Vs),new D(Br,0,Vs),new D(0,Vs,-Br),new D(0,Vs,Br),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],gx=new D,Tc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=gx}=r;_u=this._renderer.getRenderTarget(),xu=this._renderer.getActiveCubeFace(),yu=this._renderer.getActiveMipmapLevel(),vu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Yf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=qf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(_u,xu,yu),this._renderer.xr.enabled=vu,e.scissorTest=!1,Ec(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Os||e.mapping===Bs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_u=this._renderer.getRenderTarget(),xu=this._renderer.getActiveCubeFace(),yu=this._renderer.getActiveMipmapLevel(),vu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ui,minFilter:ui,generateMipmaps:!1,type:Ur,format:Qn,colorSpace:Ps,depthBuffer:!1},s=Xf(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xf(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=_x(r)),this._blurMaterial=xx(r,e,t)}return s}_compileMaterial(e){let t=new Mt(this._lodPlanes[0],e);this._renderer.compile(t,gu)}_sceneToCubeUV(e,t,n,s,r){let l=new on(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,m=d.autoClear,f=d.toneMapping;d.getClearColor(Wf),d.toneMapping=Xi,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null));let _=new fn({name:"PMREM.Background",side:bn,depthWrite:!1,depthTest:!1}),p=new Mt(new Wt,_),u=!1,b=e.background;b?b.isColor&&(_.color.copy(b),e.background=null,u=!0):(_.color.copy(Wf),u=!0);for(let E=0;E<6;E++){let x=E%3;x===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[E],r.y,r.z)):x===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[E]));let T=this._cubeSize;Ec(s,x*T,E>2?T:0,T,T),d.setRenderTarget(s),u&&d.render(p,l),d.render(e,l)}p.geometry.dispose(),p.material.dispose(),d.toneMapping=f,d.autoClear=m,e.background=b}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Os||e.mapping===Bs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Yf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=qf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new Mt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;Ec(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,gu)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=$f[(s-r-1)%$f.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,d=new Mt(this._lodPlanes[s],c),m=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Gs-1),_=r/g,p=isFinite(r)?1+Math.floor(h*_):Gs;p>Gs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Gs}`);let u=[],b=0;for(let C=0;C<Gs;++C){let L=C/_,v=Math.exp(-L*L/2);u.push(v),C===0?b+=v:C<p&&(b+=2*v)}for(let C=0;C<u.length;C++)u[C]=u[C]/b;m.envMap.value=e.texture,m.samples.value=p,m.weights.value=u,m.latitudinal.value=o==="latitudinal",a&&(m.poleAxis.value=a);let{_lodMax:E}=this;m.dTheta.value=g,m.mipInt.value=E-n;let x=this._sizeLods[s],T=3*x*(s>E-kr?s-E+kr:0),w=4*(this._cubeSize-x);Ec(t,T,w,3*x,2*x),l.setRenderTarget(t),l.render(d,gu)}};function _x(i){let e=[],t=[],n=[],s=i,r=i-kr+1+Gf.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-kr?l=Gf[o-i+kr-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,d=1+c,m=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,g=6,_=3,p=2,u=1,b=new Float32Array(_*g*f),E=new Float32Array(p*g*f),x=new Float32Array(u*g*f);for(let w=0;w<f;w++){let C=w%3*2/3-1,L=w>2?0:-1,v=[C,L,0,C+2/3,L,0,C+2/3,L+1,0,C,L,0,C+2/3,L+1,0,C,L+1,0];b.set(v,_*g*w),E.set(m,p*g*w);let S=[w,w,w,w,w,w];x.set(S,u*g*w)}let T=new At;T.setAttribute("position",new An(b,_)),T.setAttribute("uv",new An(E,p)),T.setAttribute("faceIndex",new An(x,u)),e.push(T),s>kr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Xf(i,e,t){let n=new Ei(i,e,t);return n.texture.mapping=jo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ec(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function xx(i,e,t){let n=new Float32Array(Gs),s=new D(0,1,0);return new fi({name:"SphericalGaussianBlur",defines:{n:Gs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Pu(),fragmentShader:`

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
		`,blending:$i,depthTest:!1,depthWrite:!1})}function qf(){return new fi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Pu(),fragmentShader:`

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
		`,blending:$i,depthTest:!1,depthWrite:!1})}function Yf(){return new fi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Pu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:$i,depthTest:!1,depthWrite:!1})}function Pu(){return`

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
	`}function yx(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===zl||l===Hl,h=l===Os||l===Bs;if(c||h){let d=e.get(a),m=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==m)return t===null&&(t=new Tc(i)),d=c?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{let f=a.image;return c&&f&&f.height>0||h&&f&&s(f)?(t===null&&(t=new Tc(i)),d=c?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function vx(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Mr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function bx(i,e,t,n){let s={},r=new WeakMap;function o(d){let m=d.target;m.index!==null&&e.remove(m.index);for(let g in m.attributes)e.remove(m.attributes[g]);m.removeEventListener("dispose",o),delete s[m.id];let f=r.get(m);f&&(e.remove(f),r.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function a(d,m){return s[m.id]===!0||(m.addEventListener("dispose",o),s[m.id]=!0,t.memory.geometries++),m}function l(d){let m=d.attributes;for(let f in m)e.update(m[f],i.ARRAY_BUFFER)}function c(d){let m=[],f=d.index,g=d.attributes.position,_=0;if(f!==null){let b=f.array;_=f.version;for(let E=0,x=b.length;E<x;E+=3){let T=b[E+0],w=b[E+1],C=b[E+2];m.push(T,w,w,C,C,T)}}else if(g!==void 0){let b=g.array;_=g.version;for(let E=0,x=b.length/3-1;E<x;E+=3){let T=E+0,w=E+1,C=E+2;m.push(T,w,w,C,C,T)}}else return;let p=new(hu(m)?So:Mo)(m,1);p.version=_;let u=r.get(d);u&&e.remove(u),r.set(d,p)}function h(d){let m=r.get(d);if(m){let f=d.index;f!==null&&m.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function Mx(i,e,t){let n;function s(m){n=m}let r,o;function a(m){r=m.type,o=m.bytesPerElement}function l(m,f){i.drawElements(n,f,r,m*o),t.update(f,n,1)}function c(m,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,m*o,g),t.update(f,n,g))}function h(m,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,m,0,g);let p=0;for(let u=0;u<g;u++)p+=f[u];t.update(p,n,1)}function d(m,f,g,_){if(g===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let u=0;u<m.length;u++)c(m[u]/o,f[u],_[u]);else{p.multiDrawElementsInstancedWEBGL(n,f,0,r,m,0,_,0,g);let u=0;for(let b=0;b<g;b++)u+=f[b]*_[b];t.update(u,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function Sx(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Ex(i,e,t){let n=new WeakMap,s=new Ot;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0,m=n.get(a);if(m===void 0||m.count!==d){let v=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",v)};m!==void 0&&m.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],u=a.morphAttributes.normal||[],b=a.morphAttributes.color||[],E=0;f===!0&&(E=1),g===!0&&(E=2),_===!0&&(E=3);let x=a.attributes.position.count*E,T=1;x>e.maxTextureSize&&(T=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let w=new Float32Array(x*T*4*d),C=new bo(w,x,T,d);C.type=Ci,C.needsUpdate=!0;let L=E*4;for(let S=0;S<d;S++){let I=p[S],W=u[S],$=b[S],Y=x*T*4*S;for(let z=0;z<I.count;z++){let G=z*L;f===!0&&(s.fromBufferAttribute(I,z),w[Y+G+0]=s.x,w[Y+G+1]=s.y,w[Y+G+2]=s.z,w[Y+G+3]=0),g===!0&&(s.fromBufferAttribute(W,z),w[Y+G+4]=s.x,w[Y+G+5]=s.y,w[Y+G+6]=s.z,w[Y+G+7]=0),_===!0&&(s.fromBufferAttribute($,z),w[Y+G+8]=s.x,w[Y+G+9]=s.y,w[Y+G+10]=s.z,w[Y+G+11]=$.itemSize===4?s.w:1)}}m={count:d,texture:C,size:new ae(x,T)},n.set(a,m),a.addEventListener("dispose",v)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",m.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}return{update:r}}function wx(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,d=e.get(l,h);if(s.get(d)!==c&&(e.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let m=l.skeleton;s.get(m)!==c&&(m.update(),s.set(m,c))}return d}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var fp=new Rn,Zf=new Co(1,1),pp=new bo,mp=new al,gp=new wo,jf=[],Jf=[],Kf=new Float32Array(16),Qf=new Float32Array(9),ep=new Float32Array(4);function Vr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=jf[s];if(r===void 0&&(r=new Float32Array(s),jf[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function en(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function tn(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ac(i,e){let t=Jf[e];t===void 0&&(t=new Int32Array(e),Jf[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Tx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Ax(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(en(t,e))return;i.uniform2fv(this.addr,e),tn(t,e)}}function Rx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(en(t,e))return;i.uniform3fv(this.addr,e),tn(t,e)}}function Cx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(en(t,e))return;i.uniform4fv(this.addr,e),tn(t,e)}}function Px(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(en(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),tn(t,e)}else{if(en(t,n))return;ep.set(n),i.uniformMatrix2fv(this.addr,!1,ep),tn(t,n)}}function Ix(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(en(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),tn(t,e)}else{if(en(t,n))return;Qf.set(n),i.uniformMatrix3fv(this.addr,!1,Qf),tn(t,n)}}function Dx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(en(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),tn(t,e)}else{if(en(t,n))return;Kf.set(n),i.uniformMatrix4fv(this.addr,!1,Kf),tn(t,n)}}function Lx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Nx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(en(t,e))return;i.uniform2iv(this.addr,e),tn(t,e)}}function Ux(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(en(t,e))return;i.uniform3iv(this.addr,e),tn(t,e)}}function Fx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(en(t,e))return;i.uniform4iv(this.addr,e),tn(t,e)}}function Ox(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Bx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(en(t,e))return;i.uniform2uiv(this.addr,e),tn(t,e)}}function kx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(en(t,e))return;i.uniform3uiv(this.addr,e),tn(t,e)}}function zx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(en(t,e))return;i.uniform4uiv(this.addr,e),tn(t,e)}}function Hx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Zf.compareFunction=ou,r=Zf):r=fp,t.setTexture2D(e||r,s)}function Vx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||mp,s)}function Gx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||gp,s)}function Wx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||pp,s)}function $x(i){switch(i){case 5126:return Tx;case 35664:return Ax;case 35665:return Rx;case 35666:return Cx;case 35674:return Px;case 35675:return Ix;case 35676:return Dx;case 5124:case 35670:return Lx;case 35667:case 35671:return Nx;case 35668:case 35672:return Ux;case 35669:case 35673:return Fx;case 5125:return Ox;case 36294:return Bx;case 36295:return kx;case 36296:return zx;case 35678:case 36198:case 36298:case 36306:case 35682:return Hx;case 35679:case 36299:case 36307:return Vx;case 35680:case 36300:case 36308:case 36293:return Gx;case 36289:case 36303:case 36311:case 36292:return Wx}}function Xx(i,e){i.uniform1fv(this.addr,e)}function qx(i,e){let t=Vr(e,this.size,2);i.uniform2fv(this.addr,t)}function Yx(i,e){let t=Vr(e,this.size,3);i.uniform3fv(this.addr,t)}function Zx(i,e){let t=Vr(e,this.size,4);i.uniform4fv(this.addr,t)}function jx(i,e){let t=Vr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Jx(i,e){let t=Vr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Kx(i,e){let t=Vr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Qx(i,e){i.uniform1iv(this.addr,e)}function ey(i,e){i.uniform2iv(this.addr,e)}function ty(i,e){i.uniform3iv(this.addr,e)}function ny(i,e){i.uniform4iv(this.addr,e)}function iy(i,e){i.uniform1uiv(this.addr,e)}function sy(i,e){i.uniform2uiv(this.addr,e)}function ry(i,e){i.uniform3uiv(this.addr,e)}function oy(i,e){i.uniform4uiv(this.addr,e)}function ay(i,e,t){let n=this.cache,s=e.length,r=Ac(t,s);en(n,r)||(i.uniform1iv(this.addr,r),tn(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||fp,r[o])}function ly(i,e,t){let n=this.cache,s=e.length,r=Ac(t,s);en(n,r)||(i.uniform1iv(this.addr,r),tn(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||mp,r[o])}function cy(i,e,t){let n=this.cache,s=e.length,r=Ac(t,s);en(n,r)||(i.uniform1iv(this.addr,r),tn(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||gp,r[o])}function hy(i,e,t){let n=this.cache,s=e.length,r=Ac(t,s);en(n,r)||(i.uniform1iv(this.addr,r),tn(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||pp,r[o])}function uy(i){switch(i){case 5126:return Xx;case 35664:return qx;case 35665:return Yx;case 35666:return Zx;case 35674:return jx;case 35675:return Jx;case 35676:return Kx;case 5124:case 35670:return Qx;case 35667:case 35671:return ey;case 35668:case 35672:return ty;case 35669:case 35673:return ny;case 5125:return iy;case 36294:return sy;case 36295:return ry;case 36296:return oy;case 35678:case 36198:case 36298:case 36306:case 35682:return ay;case 35679:case 36299:case 36307:return ly;case 35680:case 36300:case 36308:case 36293:return cy;case 36289:case 36303:case 36311:case 36292:return hy}}var Mu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=$x(t.type)}},Su=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=uy(t.type)}},Eu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},bu=/(\w+)(\])?(\[|\.)?/g;function tp(i,e){i.seq.push(e),i.map[e.id]=e}function dy(i,e,t){let n=i.name,s=n.length;for(bu.lastIndex=0;;){let r=bu.exec(n),o=bu.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){tp(t,c===void 0?new Mu(a,i,e):new Su(a,i,e));break}else{let d=t.map[a];d===void 0&&(d=new Eu(a),tp(t,d)),t=d}}}var zr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);dy(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function np(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var fy=37297,py=0;function my(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var ip=new et;function gy(i){ut._getMatrix(ip,ut.workingColorSpace,i);let e=`mat3( ${ip.elements.map(t=>t.toFixed(4))} )`;switch(ut.getTransfer(i)){case xo:return[e,"LinearTransferOETF"];case bt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function sp(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+my(i.getShaderSource(e),a)}else return r}function _y(i,e){let t=gy(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function xy(i,e){let t;switch(e){case mf:t="Linear";break;case gf:t="Reinhard";break;case _f:t="Cineon";break;case xf:t="ACESFilmic";break;case vf:t="AgX";break;case bf:t="Neutral";break;case yf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var wc=new D;function yy(){ut.getLuminanceCoefficients(wc);let i=wc.x.toFixed(4),e=wc.y.toFixed(4),t=wc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function vy(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(na).join(`
`)}function by(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function My(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function na(i){return i!==""}function rp(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function op(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Sy=/^[ \t]*#include +<([\w\d./]+)>/gm;function wu(i){return i.replace(Sy,wy)}var Ey=new Map;function wy(i,e){let t=ot[e];if(t===void 0){let n=Ey.get(e);if(n!==void 0)t=ot[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return wu(t)}var Ty=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ap(i){return i.replace(Ty,Ay)}function Ay(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function lp(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function Ry(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===$h?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Dl?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ai&&(e="SHADOWMAP_TYPE_VSM"),e}function Cy(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Os:case Bs:e="ENVMAP_TYPE_CUBE";break;case jo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Py(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Bs&&(e="ENVMAP_MODE_REFRACTION"),e}function Iy(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Zh:e="ENVMAP_BLENDING_MULTIPLY";break;case ff:e="ENVMAP_BLENDING_MIX";break;case pf:e="ENVMAP_BLENDING_ADD";break}return e}function Dy(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Ly(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=Ry(t),c=Cy(t),h=Py(t),d=Iy(t),m=Dy(t),f=vy(t),g=by(r),_=s.createProgram(),p,u,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(na).join(`
`),p.length>0&&(p+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(na).join(`
`),u.length>0&&(u+=`
`)):(p=[lp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(na).join(`
`),u=[lp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Xi?"#define TONE_MAPPING":"",t.toneMapping!==Xi?ot.tonemapping_pars_fragment:"",t.toneMapping!==Xi?xy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ot.colorspace_pars_fragment,_y("linearToOutputTexel",t.outputColorSpace),yy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(na).join(`
`)),o=wu(o),o=rp(o,t),o=op(o,t),a=wu(a),a=rp(a,t),a=op(a,t),o=ap(o),a=ap(a),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,u=["#define varying in",t.glslVersion===au?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===au?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);let E=b+p+o,x=b+u+a,T=np(s,s.VERTEX_SHADER,E),w=np(s,s.FRAGMENT_SHADER,x);s.attachShader(_,T),s.attachShader(_,w),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(I){if(i.debug.checkShaderErrors){let W=s.getProgramInfoLog(_)||"",$=s.getShaderInfoLog(T)||"",Y=s.getShaderInfoLog(w)||"",z=W.trim(),G=$.trim(),Q=Y.trim(),X=!0,de=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(X=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,T,w);else{let xe=sp(s,T,"vertex"),Ee=sp(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+z+`
`+xe+`
`+Ee)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(G===""||Q==="")&&(de=!1);de&&(I.diagnostics={runnable:X,programLog:z,vertexShader:{log:G,prefix:p},fragmentShader:{log:Q,prefix:u}})}s.deleteShader(T),s.deleteShader(w),L=new zr(s,_),v=My(s,_)}let L;this.getUniforms=function(){return L===void 0&&C(this),L};let v;this.getAttributes=function(){return v===void 0&&C(this),v};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(_,fy)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=py++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=w,this}var Ny=0,Tu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Au(e),t.set(e,n)),n}},Au=class{constructor(e){this.id=Ny++,this.code=e,this.usedTimes=0}};function Uy(i,e,t,n,s,r,o){let a=new Er,l=new Tu,c=new Set,h=[],d=s.logarithmicDepthBuffer,m=s.vertexTextures,f=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(v){return c.add(v),v===0?"uv":`uv${v}`}function p(v,S,I,W,$){let Y=W.fog,z=$.geometry,G=v.isMeshStandardMaterial?W.environment:null,Q=(v.isMeshStandardMaterial?t:e).get(v.envMap||G),X=Q&&Q.mapping===jo?Q.image.height:null,de=g[v.type];v.precision!==null&&(f=s.getMaxPrecision(v.precision),f!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",f,"instead."));let xe=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Ee=xe!==void 0?xe.length:0,Xe=0;z.morphAttributes.position!==void 0&&(Xe=1),z.morphAttributes.normal!==void 0&&(Xe=2),z.morphAttributes.color!==void 0&&(Xe=3);let nt,ht,ct,ee;if(de){let Oe=Pi[de];nt=Oe.vertexShader,ht=Oe.fragmentShader}else nt=v.vertexShader,ht=v.fragmentShader,l.update(v),ct=l.getVertexShaderID(v),ee=l.getFragmentShaderID(v);let se=i.getRenderTarget(),Re=i.state.buffers.depth.getReversed(),Ie=$.isInstancedMesh===!0,Pe=$.isBatchedMesh===!0,rt=!!v.map,xt=!!v.matcap,P=!!Q,re=!!v.aoMap,ne=!!v.lightMap,K=!!v.bumpMap,te=!!v.normalMap,me=!!v.displacementMap,ce=!!v.emissiveMap,ge=!!v.metalnessMap,Ze=!!v.roughnessMap,qe=v.anisotropy>0,A=v.clearcoat>0,y=v.dispersion>0,V=v.iridescence>0,j=v.sheen>0,oe=v.transmission>0,J=qe&&!!v.anisotropyMap,Ae=A&&!!v.clearcoatMap,ue=A&&!!v.clearcoatNormalMap,De=A&&!!v.clearcoatRoughnessMap,Le=V&&!!v.iridescenceMap,le=V&&!!v.iridescenceThicknessMap,Me=j&&!!v.sheenColorMap,ke=j&&!!v.sheenRoughnessMap,Fe=!!v.specularMap,ye=!!v.specularColorMap,Je=!!v.specularIntensityMap,U=oe&&!!v.transmissionMap,pe=oe&&!!v.thicknessMap,_e=!!v.gradientMap,F=!!v.alphaMap,O=v.alphaTest>0,B=!!v.alphaHash,ie=!!v.extensions,ve=Xi;v.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(ve=i.toneMapping);let we={shaderID:de,shaderType:v.type,shaderName:v.name,vertexShader:nt,fragmentShader:ht,defines:v.defines,customVertexShaderID:ct,customFragmentShaderID:ee,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:f,batching:Pe,batchingColor:Pe&&$._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&$.instanceColor!==null,instancingMorph:Ie&&$.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:se===null?i.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:Ps,alphaToCoverage:!!v.alphaToCoverage,map:rt,matcap:xt,envMap:P,envMapMode:P&&Q.mapping,envMapCubeUVHeight:X,aoMap:re,lightMap:ne,bumpMap:K,normalMap:te,displacementMap:m&&me,emissiveMap:ce,normalMapObjectSpace:te&&v.normalMapType===wf,normalMapTangentSpace:te&&v.normalMapType===ru,metalnessMap:ge,roughnessMap:Ze,anisotropy:qe,anisotropyMap:J,clearcoat:A,clearcoatMap:Ae,clearcoatNormalMap:ue,clearcoatRoughnessMap:De,dispersion:y,iridescence:V,iridescenceMap:Le,iridescenceThicknessMap:le,sheen:j,sheenColorMap:Me,sheenRoughnessMap:ke,specularMap:Fe,specularColorMap:ye,specularIntensityMap:Je,transmission:oe,transmissionMap:U,thicknessMap:pe,gradientMap:_e,opaque:v.transparent===!1&&v.blending===Rs&&v.alphaToCoverage===!1,alphaMap:F,alphaTest:O,alphaHash:B,combine:v.combine,mapUv:rt&&_(v.map.channel),aoMapUv:re&&_(v.aoMap.channel),lightMapUv:ne&&_(v.lightMap.channel),bumpMapUv:K&&_(v.bumpMap.channel),normalMapUv:te&&_(v.normalMap.channel),displacementMapUv:me&&_(v.displacementMap.channel),emissiveMapUv:ce&&_(v.emissiveMap.channel),metalnessMapUv:ge&&_(v.metalnessMap.channel),roughnessMapUv:Ze&&_(v.roughnessMap.channel),anisotropyMapUv:J&&_(v.anisotropyMap.channel),clearcoatMapUv:Ae&&_(v.clearcoatMap.channel),clearcoatNormalMapUv:ue&&_(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:De&&_(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Le&&_(v.iridescenceMap.channel),iridescenceThicknessMapUv:le&&_(v.iridescenceThicknessMap.channel),sheenColorMapUv:Me&&_(v.sheenColorMap.channel),sheenRoughnessMapUv:ke&&_(v.sheenRoughnessMap.channel),specularMapUv:Fe&&_(v.specularMap.channel),specularColorMapUv:ye&&_(v.specularColorMap.channel),specularIntensityMapUv:Je&&_(v.specularIntensityMap.channel),transmissionMapUv:U&&_(v.transmissionMap.channel),thicknessMapUv:pe&&_(v.thicknessMap.channel),alphaMapUv:F&&_(v.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(te||qe),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:$.isPoints===!0&&!!z.attributes.uv&&(rt||F),fog:!!Y,useFog:v.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:v.flatShading===!0&&v.wireframe===!1,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Re,skinning:$.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:Ee,morphTextureStride:Xe,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:ve,decodeVideoTexture:rt&&v.map.isVideoTexture===!0&&ut.getTransfer(v.map.colorSpace)===bt,decodeVideoTextureEmissive:ce&&v.emissiveMap.isVideoTexture===!0&&ut.getTransfer(v.emissiveMap.colorSpace)===bt,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Ri,flipSided:v.side===bn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:ie&&v.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ie&&v.extensions.multiDraw===!0||Pe)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return we.vertexUv1s=c.has(1),we.vertexUv2s=c.has(2),we.vertexUv3s=c.has(3),c.clear(),we}function u(v){let S=[];if(v.shaderID?S.push(v.shaderID):(S.push(v.customVertexShaderID),S.push(v.customFragmentShaderID)),v.defines!==void 0)for(let I in v.defines)S.push(I),S.push(v.defines[I]);return v.isRawShaderMaterial===!1&&(b(S,v),E(S,v),S.push(i.outputColorSpace)),S.push(v.customProgramCacheKey),S.join()}function b(v,S){v.push(S.precision),v.push(S.outputColorSpace),v.push(S.envMapMode),v.push(S.envMapCubeUVHeight),v.push(S.mapUv),v.push(S.alphaMapUv),v.push(S.lightMapUv),v.push(S.aoMapUv),v.push(S.bumpMapUv),v.push(S.normalMapUv),v.push(S.displacementMapUv),v.push(S.emissiveMapUv),v.push(S.metalnessMapUv),v.push(S.roughnessMapUv),v.push(S.anisotropyMapUv),v.push(S.clearcoatMapUv),v.push(S.clearcoatNormalMapUv),v.push(S.clearcoatRoughnessMapUv),v.push(S.iridescenceMapUv),v.push(S.iridescenceThicknessMapUv),v.push(S.sheenColorMapUv),v.push(S.sheenRoughnessMapUv),v.push(S.specularMapUv),v.push(S.specularColorMapUv),v.push(S.specularIntensityMapUv),v.push(S.transmissionMapUv),v.push(S.thicknessMapUv),v.push(S.combine),v.push(S.fogExp2),v.push(S.sizeAttenuation),v.push(S.morphTargetsCount),v.push(S.morphAttributeCount),v.push(S.numDirLights),v.push(S.numPointLights),v.push(S.numSpotLights),v.push(S.numSpotLightMaps),v.push(S.numHemiLights),v.push(S.numRectAreaLights),v.push(S.numDirLightShadows),v.push(S.numPointLightShadows),v.push(S.numSpotLightShadows),v.push(S.numSpotLightShadowsWithMaps),v.push(S.numLightProbes),v.push(S.shadowMapType),v.push(S.toneMapping),v.push(S.numClippingPlanes),v.push(S.numClipIntersection),v.push(S.depthPacking)}function E(v,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),S.gradientMap&&a.enable(22),v.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),v.push(a.mask)}function x(v){let S=g[v.type],I;if(S){let W=Pi[S];I=Ff.clone(W.uniforms)}else I=v.uniforms;return I}function T(v,S){let I;for(let W=0,$=h.length;W<$;W++){let Y=h[W];if(Y.cacheKey===S){I=Y,++I.usedTimes;break}}return I===void 0&&(I=new Ly(i,S,v,r),h.push(I)),I}function w(v){if(--v.usedTimes===0){let S=h.indexOf(v);h[S]=h[h.length-1],h.pop(),v.destroy()}}function C(v){l.remove(v)}function L(){l.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:x,acquireProgram:T,releaseProgram:w,releaseShaderCache:C,programs:h,dispose:L}}function Fy(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Oy(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function cp(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function hp(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(d,m,f,g,_,p){let u=i[e];return u===void 0?(u={id:d.id,object:d,geometry:m,material:f,groupOrder:g,renderOrder:d.renderOrder,z:_,group:p},i[e]=u):(u.id=d.id,u.object=d,u.geometry=m,u.material=f,u.groupOrder=g,u.renderOrder=d.renderOrder,u.z=_,u.group=p),e++,u}function a(d,m,f,g,_,p){let u=o(d,m,f,g,_,p);f.transmission>0?n.push(u):f.transparent===!0?s.push(u):t.push(u)}function l(d,m,f,g,_,p){let u=o(d,m,f,g,_,p);f.transmission>0?n.unshift(u):f.transparent===!0?s.unshift(u):t.unshift(u)}function c(d,m){t.length>1&&t.sort(d||Oy),n.length>1&&n.sort(m||cp),s.length>1&&s.sort(m||cp)}function h(){for(let d=e,m=i.length;d<m;d++){let f=i[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function By(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new hp,i.set(n,[o])):s>=r.length?(o=new hp,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function ky(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Qe};break;case"SpotLight":t={position:new D,direction:new D,color:new Qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Qe,groundColor:new Qe};break;case"RectAreaLight":t={color:new Qe,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function zy(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Hy=0;function Vy(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Gy(i){let e=new ky,t=zy(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);let s=new D,r=new gt,o=new gt;function a(c){let h=0,d=0,m=0;for(let v=0;v<9;v++)n.probe[v].set(0,0,0);let f=0,g=0,_=0,p=0,u=0,b=0,E=0,x=0,T=0,w=0,C=0;c.sort(Vy);for(let v=0,S=c.length;v<S;v++){let I=c[v],W=I.color,$=I.intensity,Y=I.distance,z=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)h+=W.r*$,d+=W.g*$,m+=W.b*$;else if(I.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(I.sh.coefficients[G],$);C++}else if(I.isDirectionalLight){let G=e.get(I);if(G.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let Q=I.shadow,X=t.get(I);X.shadowIntensity=Q.intensity,X.shadowBias=Q.bias,X.shadowNormalBias=Q.normalBias,X.shadowRadius=Q.radius,X.shadowMapSize=Q.mapSize,n.directionalShadow[f]=X,n.directionalShadowMap[f]=z,n.directionalShadowMatrix[f]=I.shadow.matrix,b++}n.directional[f]=G,f++}else if(I.isSpotLight){let G=e.get(I);G.position.setFromMatrixPosition(I.matrixWorld),G.color.copy(W).multiplyScalar($),G.distance=Y,G.coneCos=Math.cos(I.angle),G.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),G.decay=I.decay,n.spot[_]=G;let Q=I.shadow;if(I.map&&(n.spotLightMap[T]=I.map,T++,Q.updateMatrices(I),I.castShadow&&w++),n.spotLightMatrix[_]=Q.matrix,I.castShadow){let X=t.get(I);X.shadowIntensity=Q.intensity,X.shadowBias=Q.bias,X.shadowNormalBias=Q.normalBias,X.shadowRadius=Q.radius,X.shadowMapSize=Q.mapSize,n.spotShadow[_]=X,n.spotShadowMap[_]=z,x++}_++}else if(I.isRectAreaLight){let G=e.get(I);G.color.copy(W).multiplyScalar($),G.halfWidth.set(I.width*.5,0,0),G.halfHeight.set(0,I.height*.5,0),n.rectArea[p]=G,p++}else if(I.isPointLight){let G=e.get(I);if(G.color.copy(I.color).multiplyScalar(I.intensity),G.distance=I.distance,G.decay=I.decay,I.castShadow){let Q=I.shadow,X=t.get(I);X.shadowIntensity=Q.intensity,X.shadowBias=Q.bias,X.shadowNormalBias=Q.normalBias,X.shadowRadius=Q.radius,X.shadowMapSize=Q.mapSize,X.shadowCameraNear=Q.camera.near,X.shadowCameraFar=Q.camera.far,n.pointShadow[g]=X,n.pointShadowMap[g]=z,n.pointShadowMatrix[g]=I.shadow.matrix,E++}n.point[g]=G,g++}else if(I.isHemisphereLight){let G=e.get(I);G.skyColor.copy(I.color).multiplyScalar($),G.groundColor.copy(I.groundColor).multiplyScalar($),n.hemi[u]=G,u++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=be.LTC_FLOAT_1,n.rectAreaLTC2=be.LTC_FLOAT_2):(n.rectAreaLTC1=be.LTC_HALF_1,n.rectAreaLTC2=be.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=m;let L=n.hash;(L.directionalLength!==f||L.pointLength!==g||L.spotLength!==_||L.rectAreaLength!==p||L.hemiLength!==u||L.numDirectionalShadows!==b||L.numPointShadows!==E||L.numSpotShadows!==x||L.numSpotMaps!==T||L.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=p,n.point.length=g,n.hemi.length=u,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=x+T-w,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=C,L.directionalLength=f,L.pointLength=g,L.spotLength=_,L.rectAreaLength=p,L.hemiLength=u,L.numDirectionalShadows=b,L.numPointShadows=E,L.numSpotShadows=x,L.numSpotMaps=T,L.numLightProbes=C,n.version=Hy++)}function l(c,h){let d=0,m=0,f=0,g=0,_=0,p=h.matrixWorldInverse;for(let u=0,b=c.length;u<b;u++){let E=c[u];if(E.isDirectionalLight){let x=n.directional[d];x.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(p),d++}else if(E.isSpotLight){let x=n.spot[f];x.position.setFromMatrixPosition(E.matrixWorld),x.position.applyMatrix4(p),x.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(p),f++}else if(E.isRectAreaLight){let x=n.rectArea[g];x.position.setFromMatrixPosition(E.matrixWorld),x.position.applyMatrix4(p),o.identity(),r.copy(E.matrixWorld),r.premultiply(p),o.extractRotation(r),x.halfWidth.set(E.width*.5,0,0),x.halfHeight.set(0,E.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(E.isPointLight){let x=n.point[m];x.position.setFromMatrixPosition(E.matrixWorld),x.position.applyMatrix4(p),m++}else if(E.isHemisphereLight){let x=n.hemi[_];x.direction.setFromMatrixPosition(E.matrixWorld),x.direction.transformDirection(p),_++}}}return{setup:a,setupView:l,state:n}}function up(i){let e=new Gy(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function Wy(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new up(i),e.set(s,[a])):r>=o.length?(a=new up(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var $y=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Xy=`uniform sampler2D shadow_pass;
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
}`;function qy(i,e,t){let n=new Ar,s=new ae,r=new ae,o=new Ot,a=new vl({depthPacking:Ef}),l=new bl,c={},h=t.maxTextureSize,d={[Gi]:bn,[bn]:Gi,[Ri]:Ri},m=new fi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ae},radius:{value:4}},vertexShader:$y,fragmentShader:Xy}),f=m.clone();f.defines.HORIZONTAL_PASS=1;let g=new At;g.setAttribute("position",new An(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Mt(g,m),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=$h;let u=this.type;this.render=function(w,C,L){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;let v=i.getRenderTarget(),S=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),W=i.state;W.setBlending($i),W.buffers.depth.getReversed()===!0?W.buffers.color.setClear(0,0,0,0):W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);let $=u!==Ai&&this.type===Ai,Y=u===Ai&&this.type!==Ai;for(let z=0,G=w.length;z<G;z++){let Q=w[z],X=Q.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);let de=X.getFrameExtents();if(s.multiply(de),r.copy(X.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/de.x),s.x=r.x*de.x,X.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/de.y),s.y=r.y*de.y,X.mapSize.y=r.y)),X.map===null||$===!0||Y===!0){let Ee=this.type!==Ai?{minFilter:jn,magFilter:jn}:{};X.map!==null&&X.map.dispose(),X.map=new Ei(s.x,s.y,Ee),X.map.texture.name=Q.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();let xe=X.getViewportCount();for(let Ee=0;Ee<xe;Ee++){let Xe=X.getViewport(Ee);o.set(r.x*Xe.x,r.y*Xe.y,r.x*Xe.z,r.y*Xe.w),W.viewport(o),X.updateMatrices(Q,Ee),n=X.getFrustum(),x(C,L,X.camera,Q,this.type)}X.isPointLightShadow!==!0&&this.type===Ai&&b(X,L),X.needsUpdate=!1}u=this.type,p.needsUpdate=!1,i.setRenderTarget(v,S,I)};function b(w,C){let L=e.update(_);m.defines.VSM_SAMPLES!==w.blurSamples&&(m.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,m.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Ei(s.x,s.y)),m.uniforms.shadow_pass.value=w.map.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(C,null,L,m,_,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(C,null,L,f,_,null)}function E(w,C,L,v){let S=null,I=L.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(I!==void 0)S=I;else if(S=L.isPointLight===!0?l:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let W=S.uuid,$=C.uuid,Y=c[W];Y===void 0&&(Y={},c[W]=Y);let z=Y[$];z===void 0&&(z=S.clone(),Y[$]=z,C.addEventListener("dispose",T)),S=z}if(S.visible=C.visible,S.wireframe=C.wireframe,v===Ai?S.side=C.shadowSide!==null?C.shadowSide:C.side:S.side=C.shadowSide!==null?C.shadowSide:d[C.side],S.alphaMap=C.alphaMap,S.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,S.map=C.map,S.clipShadows=C.clipShadows,S.clippingPlanes=C.clippingPlanes,S.clipIntersection=C.clipIntersection,S.displacementMap=C.displacementMap,S.displacementScale=C.displacementScale,S.displacementBias=C.displacementBias,S.wireframeLinewidth=C.wireframeLinewidth,S.linewidth=C.linewidth,L.isPointLight===!0&&S.isMeshDistanceMaterial===!0){let W=i.properties.get(S);W.light=L}return S}function x(w,C,L,v,S){if(w.visible===!1)return;if(w.layers.test(C.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&S===Ai)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,w.matrixWorld);let $=e.update(w),Y=w.material;if(Array.isArray(Y)){let z=$.groups;for(let G=0,Q=z.length;G<Q;G++){let X=z[G],de=Y[X.materialIndex];if(de&&de.visible){let xe=E(w,de,v,S);w.onBeforeShadow(i,w,C,L,$,xe,X),i.renderBufferDirect(L,null,$,xe,w,X),w.onAfterShadow(i,w,C,L,$,xe,X)}}}else if(Y.visible){let z=E(w,Y,v,S);w.onBeforeShadow(i,w,C,L,$,z,null),i.renderBufferDirect(L,null,$,z,w,null),w.onAfterShadow(i,w,C,L,$,z,null)}}let W=w.children;for(let $=0,Y=W.length;$<Y;$++)x(W[$],C,L,v,S)}function T(w){w.target.removeEventListener("dispose",T);for(let L in c){let v=c[L],S=w.target.uuid;S in v&&(v[S].dispose(),delete v[S])}}}var Yy={[Ll]:Nl,[Ul]:Bl,[Fl]:kl,[Cs]:Ol,[Nl]:Ll,[Bl]:Ul,[kl]:Fl,[Ol]:Cs};function Zy(i,e){function t(){let U=!1,pe=new Ot,_e=null,F=new Ot(0,0,0,0);return{setMask:function(O){_e!==O&&!U&&(i.colorMask(O,O,O,O),_e=O)},setLocked:function(O){U=O},setClear:function(O,B,ie,ve,we){we===!0&&(O*=ve,B*=ve,ie*=ve),pe.set(O,B,ie,ve),F.equals(pe)===!1&&(i.clearColor(O,B,ie,ve),F.copy(pe))},reset:function(){U=!1,_e=null,F.set(-1,0,0,0)}}}function n(){let U=!1,pe=!1,_e=null,F=null,O=null;return{setReversed:function(B){if(pe!==B){let ie=e.get("EXT_clip_control");B?ie.clipControlEXT(ie.LOWER_LEFT_EXT,ie.ZERO_TO_ONE_EXT):ie.clipControlEXT(ie.LOWER_LEFT_EXT,ie.NEGATIVE_ONE_TO_ONE_EXT),pe=B;let ve=O;O=null,this.setClear(ve)}},getReversed:function(){return pe},setTest:function(B){B?se(i.DEPTH_TEST):Re(i.DEPTH_TEST)},setMask:function(B){_e!==B&&!U&&(i.depthMask(B),_e=B)},setFunc:function(B){if(pe&&(B=Yy[B]),F!==B){switch(B){case Ll:i.depthFunc(i.NEVER);break;case Nl:i.depthFunc(i.ALWAYS);break;case Ul:i.depthFunc(i.LESS);break;case Cs:i.depthFunc(i.LEQUAL);break;case Fl:i.depthFunc(i.EQUAL);break;case Ol:i.depthFunc(i.GEQUAL);break;case Bl:i.depthFunc(i.GREATER);break;case kl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}F=B}},setLocked:function(B){U=B},setClear:function(B){O!==B&&(pe&&(B=1-B),i.clearDepth(B),O=B)},reset:function(){U=!1,_e=null,F=null,O=null,pe=!1}}}function s(){let U=!1,pe=null,_e=null,F=null,O=null,B=null,ie=null,ve=null,we=null;return{setTest:function(Oe){U||(Oe?se(i.STENCIL_TEST):Re(i.STENCIL_TEST))},setMask:function(Oe){pe!==Oe&&!U&&(i.stencilMask(Oe),pe=Oe)},setFunc:function(Oe,We,Be){(_e!==Oe||F!==We||O!==Be)&&(i.stencilFunc(Oe,We,Be),_e=Oe,F=We,O=Be)},setOp:function(Oe,We,Be){(B!==Oe||ie!==We||ve!==Be)&&(i.stencilOp(Oe,We,Be),B=Oe,ie=We,ve=Be)},setLocked:function(Oe){U=Oe},setClear:function(Oe){we!==Oe&&(i.clearStencil(Oe),we=Oe)},reset:function(){U=!1,pe=null,_e=null,F=null,O=null,B=null,ie=null,ve=null,we=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},d={},m=new WeakMap,f=[],g=null,_=!1,p=null,u=null,b=null,E=null,x=null,T=null,w=null,C=new Qe(0,0,0),L=0,v=!1,S=null,I=null,W=null,$=null,Y=null,z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),G=!1,Q=0,X=i.getParameter(i.VERSION);X.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(X)[1]),G=Q>=1):X.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),G=Q>=2);let de=null,xe={},Ee=i.getParameter(i.SCISSOR_BOX),Xe=i.getParameter(i.VIEWPORT),nt=new Ot().fromArray(Ee),ht=new Ot().fromArray(Xe);function ct(U,pe,_e,F){let O=new Uint8Array(4),B=i.createTexture();i.bindTexture(U,B),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ie=0;ie<_e;ie++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(pe,0,i.RGBA,1,1,F,0,i.RGBA,i.UNSIGNED_BYTE,O):i.texImage2D(pe+ie,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,O);return B}let ee={};ee[i.TEXTURE_2D]=ct(i.TEXTURE_2D,i.TEXTURE_2D,1),ee[i.TEXTURE_CUBE_MAP]=ct(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[i.TEXTURE_2D_ARRAY]=ct(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ee[i.TEXTURE_3D]=ct(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),se(i.DEPTH_TEST),o.setFunc(Cs),K(!1),te(Wh),se(i.CULL_FACE),re($i);function se(U){h[U]!==!0&&(i.enable(U),h[U]=!0)}function Re(U){h[U]!==!1&&(i.disable(U),h[U]=!1)}function Ie(U,pe){return d[U]!==pe?(i.bindFramebuffer(U,pe),d[U]=pe,U===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=pe),U===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=pe),!0):!1}function Pe(U,pe){let _e=f,F=!1;if(U){_e=m.get(pe),_e===void 0&&(_e=[],m.set(pe,_e));let O=U.textures;if(_e.length!==O.length||_e[0]!==i.COLOR_ATTACHMENT0){for(let B=0,ie=O.length;B<ie;B++)_e[B]=i.COLOR_ATTACHMENT0+B;_e.length=O.length,F=!0}}else _e[0]!==i.BACK&&(_e[0]=i.BACK,F=!0);F&&i.drawBuffers(_e)}function rt(U){return g!==U?(i.useProgram(U),g=U,!0):!1}let xt={[os]:i.FUNC_ADD,[Zd]:i.FUNC_SUBTRACT,[jd]:i.FUNC_REVERSE_SUBTRACT};xt[Jd]=i.MIN,xt[Kd]=i.MAX;let P={[Qd]:i.ZERO,[ef]:i.ONE,[tf]:i.SRC_COLOR,[Qa]:i.SRC_ALPHA,[lf]:i.SRC_ALPHA_SATURATE,[of]:i.DST_COLOR,[sf]:i.DST_ALPHA,[nf]:i.ONE_MINUS_SRC_COLOR,[el]:i.ONE_MINUS_SRC_ALPHA,[af]:i.ONE_MINUS_DST_COLOR,[rf]:i.ONE_MINUS_DST_ALPHA,[cf]:i.CONSTANT_COLOR,[hf]:i.ONE_MINUS_CONSTANT_COLOR,[uf]:i.CONSTANT_ALPHA,[df]:i.ONE_MINUS_CONSTANT_ALPHA};function re(U,pe,_e,F,O,B,ie,ve,we,Oe){if(U===$i){_===!0&&(Re(i.BLEND),_=!1);return}if(_===!1&&(se(i.BLEND),_=!0),U!==Yd){if(U!==p||Oe!==v){if((u!==os||x!==os)&&(i.blendEquation(i.FUNC_ADD),u=os,x=os),Oe)switch(U){case Rs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Xh:i.blendFunc(i.ONE,i.ONE);break;case qh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Yh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Rs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Xh:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case qh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Yh:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}b=null,E=null,T=null,w=null,C.set(0,0,0),L=0,p=U,v=Oe}return}O=O||pe,B=B||_e,ie=ie||F,(pe!==u||O!==x)&&(i.blendEquationSeparate(xt[pe],xt[O]),u=pe,x=O),(_e!==b||F!==E||B!==T||ie!==w)&&(i.blendFuncSeparate(P[_e],P[F],P[B],P[ie]),b=_e,E=F,T=B,w=ie),(ve.equals(C)===!1||we!==L)&&(i.blendColor(ve.r,ve.g,ve.b,we),C.copy(ve),L=we),p=U,v=!1}function ne(U,pe){U.side===Ri?Re(i.CULL_FACE):se(i.CULL_FACE);let _e=U.side===bn;pe&&(_e=!_e),K(_e),U.blending===Rs&&U.transparent===!1?re($i):re(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);let F=U.stencilWrite;a.setTest(F),F&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),ce(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?se(i.SAMPLE_ALPHA_TO_COVERAGE):Re(i.SAMPLE_ALPHA_TO_COVERAGE)}function K(U){S!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),S=U)}function te(U){U!==Xd?(se(i.CULL_FACE),U!==I&&(U===Wh?i.cullFace(i.BACK):U===qd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Re(i.CULL_FACE),I=U}function me(U){U!==W&&(G&&i.lineWidth(U),W=U)}function ce(U,pe,_e){U?(se(i.POLYGON_OFFSET_FILL),($!==pe||Y!==_e)&&(i.polygonOffset(pe,_e),$=pe,Y=_e)):Re(i.POLYGON_OFFSET_FILL)}function ge(U){U?se(i.SCISSOR_TEST):Re(i.SCISSOR_TEST)}function Ze(U){U===void 0&&(U=i.TEXTURE0+z-1),de!==U&&(i.activeTexture(U),de=U)}function qe(U,pe,_e){_e===void 0&&(de===null?_e=i.TEXTURE0+z-1:_e=de);let F=xe[_e];F===void 0&&(F={type:void 0,texture:void 0},xe[_e]=F),(F.type!==U||F.texture!==pe)&&(de!==_e&&(i.activeTexture(_e),de=_e),i.bindTexture(U,pe||ee[U]),F.type=U,F.texture=pe)}function A(){let U=xe[de];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function y(){try{i.compressedTexImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function V(){try{i.compressedTexImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function j(){try{i.texSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function oe(){try{i.texSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function J(){try{i.compressedTexSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ae(){try{i.compressedTexSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ue(){try{i.texStorage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function De(){try{i.texStorage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Le(){try{i.texImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function le(){try{i.texImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Me(U){nt.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),nt.copy(U))}function ke(U){ht.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),ht.copy(U))}function Fe(U,pe){let _e=c.get(pe);_e===void 0&&(_e=new WeakMap,c.set(pe,_e));let F=_e.get(U);F===void 0&&(F=i.getUniformBlockIndex(pe,U.name),_e.set(U,F))}function ye(U,pe){let F=c.get(pe).get(U);l.get(pe)!==F&&(i.uniformBlockBinding(pe,F,U.__bindingPointIndex),l.set(pe,F))}function Je(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},de=null,xe={},d={},m=new WeakMap,f=[],g=null,_=!1,p=null,u=null,b=null,E=null,x=null,T=null,w=null,C=new Qe(0,0,0),L=0,v=!1,S=null,I=null,W=null,$=null,Y=null,nt.set(0,0,i.canvas.width,i.canvas.height),ht.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:se,disable:Re,bindFramebuffer:Ie,drawBuffers:Pe,useProgram:rt,setBlending:re,setMaterial:ne,setFlipSided:K,setCullFace:te,setLineWidth:me,setPolygonOffset:ce,setScissorTest:ge,activeTexture:Ze,bindTexture:qe,unbindTexture:A,compressedTexImage2D:y,compressedTexImage3D:V,texImage2D:Le,texImage3D:le,updateUBOMapping:Fe,uniformBlockBinding:ye,texStorage2D:ue,texStorage3D:De,texSubImage2D:j,texSubImage3D:oe,compressedTexSubImage2D:J,compressedTexSubImage3D:Ae,scissor:Me,viewport:ke,reset:Je}}function jy(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ae,h=new WeakMap,d,m=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,y){return f?new OffscreenCanvas(A,y):vo("canvas")}function _(A,y,V){let j=1,oe=qe(A);if((oe.width>V||oe.height>V)&&(j=V/Math.max(oe.width,oe.height)),j<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){let J=Math.floor(j*oe.width),Ae=Math.floor(j*oe.height);d===void 0&&(d=g(J,Ae));let ue=y?g(J,Ae):d;return ue.width=J,ue.height=Ae,ue.getContext("2d").drawImage(A,0,0,J,Ae),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+oe.width+"x"+oe.height+") to ("+J+"x"+Ae+")."),ue}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+oe.width+"x"+oe.height+")."),A;return A}function p(A){return A.generateMipmaps}function u(A){i.generateMipmap(A)}function b(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(A,y,V,j,oe=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let J=y;if(y===i.RED&&(V===i.FLOAT&&(J=i.R32F),V===i.HALF_FLOAT&&(J=i.R16F),V===i.UNSIGNED_BYTE&&(J=i.R8)),y===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&(J=i.R8UI),V===i.UNSIGNED_SHORT&&(J=i.R16UI),V===i.UNSIGNED_INT&&(J=i.R32UI),V===i.BYTE&&(J=i.R8I),V===i.SHORT&&(J=i.R16I),V===i.INT&&(J=i.R32I)),y===i.RG&&(V===i.FLOAT&&(J=i.RG32F),V===i.HALF_FLOAT&&(J=i.RG16F),V===i.UNSIGNED_BYTE&&(J=i.RG8)),y===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&(J=i.RG8UI),V===i.UNSIGNED_SHORT&&(J=i.RG16UI),V===i.UNSIGNED_INT&&(J=i.RG32UI),V===i.BYTE&&(J=i.RG8I),V===i.SHORT&&(J=i.RG16I),V===i.INT&&(J=i.RG32I)),y===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&(J=i.RGB8UI),V===i.UNSIGNED_SHORT&&(J=i.RGB16UI),V===i.UNSIGNED_INT&&(J=i.RGB32UI),V===i.BYTE&&(J=i.RGB8I),V===i.SHORT&&(J=i.RGB16I),V===i.INT&&(J=i.RGB32I)),y===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),V===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),V===i.UNSIGNED_INT&&(J=i.RGBA32UI),V===i.BYTE&&(J=i.RGBA8I),V===i.SHORT&&(J=i.RGBA16I),V===i.INT&&(J=i.RGBA32I)),y===i.RGB&&(V===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),V===i.UNSIGNED_INT_10F_11F_11F_REV&&(J=i.R11F_G11F_B10F)),y===i.RGBA){let Ae=oe?xo:ut.getTransfer(j);V===i.FLOAT&&(J=i.RGBA32F),V===i.HALF_FLOAT&&(J=i.RGBA16F),V===i.UNSIGNED_BYTE&&(J=Ae===bt?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function x(A,y){let V;return A?y===null||y===gs||y===Fr?V=i.DEPTH24_STENCIL8:y===Ci?V=i.DEPTH32F_STENCIL8:y===Nr&&(V=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===gs||y===Fr?V=i.DEPTH_COMPONENT24:y===Ci?V=i.DEPTH_COMPONENT32F:y===Nr&&(V=i.DEPTH_COMPONENT16),V}function T(A,y){return p(A)===!0||A.isFramebufferTexture&&A.minFilter!==jn&&A.minFilter!==ui?Math.log2(Math.max(y.width,y.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?y.mipmaps.length:1}function w(A){let y=A.target;y.removeEventListener("dispose",w),L(y),y.isVideoTexture&&h.delete(y)}function C(A){let y=A.target;y.removeEventListener("dispose",C),S(y)}function L(A){let y=n.get(A);if(y.__webglInit===void 0)return;let V=A.source,j=m.get(V);if(j){let oe=j[y.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&v(A),Object.keys(j).length===0&&m.delete(V)}n.remove(A)}function v(A){let y=n.get(A);i.deleteTexture(y.__webglTexture);let V=A.source,j=m.get(V);delete j[y.__cacheKey],o.memory.textures--}function S(A){let y=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(y.__webglFramebuffer[j]))for(let oe=0;oe<y.__webglFramebuffer[j].length;oe++)i.deleteFramebuffer(y.__webglFramebuffer[j][oe]);else i.deleteFramebuffer(y.__webglFramebuffer[j]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[j])}else{if(Array.isArray(y.__webglFramebuffer))for(let j=0;j<y.__webglFramebuffer.length;j++)i.deleteFramebuffer(y.__webglFramebuffer[j]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let j=0;j<y.__webglColorRenderbuffer.length;j++)y.__webglColorRenderbuffer[j]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[j]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}let V=A.textures;for(let j=0,oe=V.length;j<oe;j++){let J=n.get(V[j]);J.__webglTexture&&(i.deleteTexture(J.__webglTexture),o.memory.textures--),n.remove(V[j])}n.remove(A)}let I=0;function W(){I=0}function $(){let A=I;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),I+=1,A}function Y(A){let y=[];return y.push(A.wrapS),y.push(A.wrapT),y.push(A.wrapR||0),y.push(A.magFilter),y.push(A.minFilter),y.push(A.anisotropy),y.push(A.internalFormat),y.push(A.format),y.push(A.type),y.push(A.generateMipmaps),y.push(A.premultiplyAlpha),y.push(A.flipY),y.push(A.unpackAlignment),y.push(A.colorSpace),y.join()}function z(A,y){let V=n.get(A);if(A.isVideoTexture&&ge(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&V.__version!==A.version){let j=A.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ee(V,A,y);return}}else A.isExternalTexture&&(V.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+y)}function G(A,y){let V=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&V.__version!==A.version){ee(V,A,y);return}t.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+y)}function Q(A,y){let V=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&V.__version!==A.version){ee(V,A,y);return}t.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+y)}function X(A,y){let V=n.get(A);if(A.version>0&&V.__version!==A.version){se(V,A,y);return}t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+y)}let de={[tl]:i.REPEAT,[rs]:i.CLAMP_TO_EDGE,[nl]:i.MIRRORED_REPEAT},xe={[jn]:i.NEAREST,[Mf]:i.NEAREST_MIPMAP_NEAREST,[Jo]:i.NEAREST_MIPMAP_LINEAR,[ui]:i.LINEAR,[Vl]:i.LINEAR_MIPMAP_NEAREST,[ms]:i.LINEAR_MIPMAP_LINEAR},Ee={[Tf]:i.NEVER,[Df]:i.ALWAYS,[Af]:i.LESS,[ou]:i.LEQUAL,[Rf]:i.EQUAL,[If]:i.GEQUAL,[Cf]:i.GREATER,[Pf]:i.NOTEQUAL};function Xe(A,y){if(y.type===Ci&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===ui||y.magFilter===Vl||y.magFilter===Jo||y.magFilter===ms||y.minFilter===ui||y.minFilter===Vl||y.minFilter===Jo||y.minFilter===ms)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,de[y.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,de[y.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,de[y.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,xe[y.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,xe[y.minFilter]),y.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,Ee[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===jn||y.minFilter!==Jo&&y.minFilter!==ms||y.type===Ci&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){let V=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function nt(A,y){let V=!1;A.__webglInit===void 0&&(A.__webglInit=!0,y.addEventListener("dispose",w));let j=y.source,oe=m.get(j);oe===void 0&&(oe={},m.set(j,oe));let J=Y(y);if(J!==A.__cacheKey){oe[J]===void 0&&(oe[J]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,V=!0),oe[J].usedTimes++;let Ae=oe[A.__cacheKey];Ae!==void 0&&(oe[A.__cacheKey].usedTimes--,Ae.usedTimes===0&&v(y)),A.__cacheKey=J,A.__webglTexture=oe[J].texture}return V}function ht(A,y,V){return Math.floor(Math.floor(A/V)/y)}function ct(A,y,V,j){let J=A.updateRanges;if(J.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,V,j,y.data);else{J.sort((le,Me)=>le.start-Me.start);let Ae=0;for(let le=1;le<J.length;le++){let Me=J[Ae],ke=J[le],Fe=Me.start+Me.count,ye=ht(ke.start,y.width,4),Je=ht(Me.start,y.width,4);ke.start<=Fe+1&&ye===Je&&ht(ke.start+ke.count-1,y.width,4)===ye?Me.count=Math.max(Me.count,ke.start+ke.count-Me.start):(++Ae,J[Ae]=ke)}J.length=Ae+1;let ue=i.getParameter(i.UNPACK_ROW_LENGTH),De=i.getParameter(i.UNPACK_SKIP_PIXELS),Le=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let le=0,Me=J.length;le<Me;le++){let ke=J[le],Fe=Math.floor(ke.start/4),ye=Math.ceil(ke.count/4),Je=Fe%y.width,U=Math.floor(Fe/y.width),pe=ye,_e=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Je),i.pixelStorei(i.UNPACK_SKIP_ROWS,U),t.texSubImage2D(i.TEXTURE_2D,0,Je,U,pe,_e,V,j,y.data)}A.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ue),i.pixelStorei(i.UNPACK_SKIP_PIXELS,De),i.pixelStorei(i.UNPACK_SKIP_ROWS,Le)}}function ee(A,y,V){let j=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(j=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(j=i.TEXTURE_3D);let oe=nt(A,y),J=y.source;t.bindTexture(j,A.__webglTexture,i.TEXTURE0+V);let Ae=n.get(J);if(J.version!==Ae.__version||oe===!0){t.activeTexture(i.TEXTURE0+V);let ue=ut.getPrimaries(ut.workingColorSpace),De=y.colorSpace===qi?null:ut.getPrimaries(y.colorSpace),Le=y.colorSpace===qi||ue===De?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Le);let le=_(y.image,!1,s.maxTextureSize);le=Ze(y,le);let Me=r.convert(y.format,y.colorSpace),ke=r.convert(y.type),Fe=E(y.internalFormat,Me,ke,y.colorSpace,y.isVideoTexture);Xe(j,y);let ye,Je=y.mipmaps,U=y.isVideoTexture!==!0,pe=Ae.__version===void 0||oe===!0,_e=J.dataReady,F=T(y,le);if(y.isDepthTexture)Fe=x(y.format===Or,y.type),pe&&(U?t.texStorage2D(i.TEXTURE_2D,1,Fe,le.width,le.height):t.texImage2D(i.TEXTURE_2D,0,Fe,le.width,le.height,0,Me,ke,null));else if(y.isDataTexture)if(Je.length>0){U&&pe&&t.texStorage2D(i.TEXTURE_2D,F,Fe,Je[0].width,Je[0].height);for(let O=0,B=Je.length;O<B;O++)ye=Je[O],U?_e&&t.texSubImage2D(i.TEXTURE_2D,O,0,0,ye.width,ye.height,Me,ke,ye.data):t.texImage2D(i.TEXTURE_2D,O,Fe,ye.width,ye.height,0,Me,ke,ye.data);y.generateMipmaps=!1}else U?(pe&&t.texStorage2D(i.TEXTURE_2D,F,Fe,le.width,le.height),_e&&ct(y,le,Me,ke)):t.texImage2D(i.TEXTURE_2D,0,Fe,le.width,le.height,0,Me,ke,le.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){U&&pe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,F,Fe,Je[0].width,Je[0].height,le.depth);for(let O=0,B=Je.length;O<B;O++)if(ye=Je[O],y.format!==Qn)if(Me!==null)if(U){if(_e)if(y.layerUpdates.size>0){let ie=mu(ye.width,ye.height,y.format,y.type);for(let ve of y.layerUpdates){let we=ye.data.subarray(ve*ie/ye.data.BYTES_PER_ELEMENT,(ve+1)*ie/ye.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,O,0,0,ve,ye.width,ye.height,1,Me,we)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,O,0,0,0,ye.width,ye.height,le.depth,Me,ye.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,O,Fe,ye.width,ye.height,le.depth,0,ye.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else U?_e&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,O,0,0,0,ye.width,ye.height,le.depth,Me,ke,ye.data):t.texImage3D(i.TEXTURE_2D_ARRAY,O,Fe,ye.width,ye.height,le.depth,0,Me,ke,ye.data)}else{U&&pe&&t.texStorage2D(i.TEXTURE_2D,F,Fe,Je[0].width,Je[0].height);for(let O=0,B=Je.length;O<B;O++)ye=Je[O],y.format!==Qn?Me!==null?U?_e&&t.compressedTexSubImage2D(i.TEXTURE_2D,O,0,0,ye.width,ye.height,Me,ye.data):t.compressedTexImage2D(i.TEXTURE_2D,O,Fe,ye.width,ye.height,0,ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?_e&&t.texSubImage2D(i.TEXTURE_2D,O,0,0,ye.width,ye.height,Me,ke,ye.data):t.texImage2D(i.TEXTURE_2D,O,Fe,ye.width,ye.height,0,Me,ke,ye.data)}else if(y.isDataArrayTexture)if(U){if(pe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,F,Fe,le.width,le.height,le.depth),_e)if(y.layerUpdates.size>0){let O=mu(le.width,le.height,y.format,y.type);for(let B of y.layerUpdates){let ie=le.data.subarray(B*O/le.data.BYTES_PER_ELEMENT,(B+1)*O/le.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,B,le.width,le.height,1,Me,ke,ie)}y.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,le.width,le.height,le.depth,Me,ke,le.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Fe,le.width,le.height,le.depth,0,Me,ke,le.data);else if(y.isData3DTexture)U?(pe&&t.texStorage3D(i.TEXTURE_3D,F,Fe,le.width,le.height,le.depth),_e&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,le.width,le.height,le.depth,Me,ke,le.data)):t.texImage3D(i.TEXTURE_3D,0,Fe,le.width,le.height,le.depth,0,Me,ke,le.data);else if(y.isFramebufferTexture){if(pe)if(U)t.texStorage2D(i.TEXTURE_2D,F,Fe,le.width,le.height);else{let O=le.width,B=le.height;for(let ie=0;ie<F;ie++)t.texImage2D(i.TEXTURE_2D,ie,Fe,O,B,0,Me,ke,null),O>>=1,B>>=1}}else if(Je.length>0){if(U&&pe){let O=qe(Je[0]);t.texStorage2D(i.TEXTURE_2D,F,Fe,O.width,O.height)}for(let O=0,B=Je.length;O<B;O++)ye=Je[O],U?_e&&t.texSubImage2D(i.TEXTURE_2D,O,0,0,Me,ke,ye):t.texImage2D(i.TEXTURE_2D,O,Fe,Me,ke,ye);y.generateMipmaps=!1}else if(U){if(pe){let O=qe(le);t.texStorage2D(i.TEXTURE_2D,F,Fe,O.width,O.height)}_e&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Me,ke,le)}else t.texImage2D(i.TEXTURE_2D,0,Fe,Me,ke,le);p(y)&&u(j),Ae.__version=J.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function se(A,y,V){if(y.image.length!==6)return;let j=nt(A,y),oe=y.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+V);let J=n.get(oe);if(oe.version!==J.__version||j===!0){t.activeTexture(i.TEXTURE0+V);let Ae=ut.getPrimaries(ut.workingColorSpace),ue=y.colorSpace===qi?null:ut.getPrimaries(y.colorSpace),De=y.colorSpace===qi||Ae===ue?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,De);let Le=y.isCompressedTexture||y.image[0].isCompressedTexture,le=y.image[0]&&y.image[0].isDataTexture,Me=[];for(let B=0;B<6;B++)!Le&&!le?Me[B]=_(y.image[B],!0,s.maxCubemapSize):Me[B]=le?y.image[B].image:y.image[B],Me[B]=Ze(y,Me[B]);let ke=Me[0],Fe=r.convert(y.format,y.colorSpace),ye=r.convert(y.type),Je=E(y.internalFormat,Fe,ye,y.colorSpace),U=y.isVideoTexture!==!0,pe=J.__version===void 0||j===!0,_e=oe.dataReady,F=T(y,ke);Xe(i.TEXTURE_CUBE_MAP,y);let O;if(Le){U&&pe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,F,Je,ke.width,ke.height);for(let B=0;B<6;B++){O=Me[B].mipmaps;for(let ie=0;ie<O.length;ie++){let ve=O[ie];y.format!==Qn?Fe!==null?U?_e&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+B,ie,0,0,ve.width,ve.height,Fe,ve.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+B,ie,Je,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?_e&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+B,ie,0,0,ve.width,ve.height,Fe,ye,ve.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+B,ie,Je,ve.width,ve.height,0,Fe,ye,ve.data)}}}else{if(O=y.mipmaps,U&&pe){O.length>0&&F++;let B=qe(Me[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,F,Je,B.width,B.height)}for(let B=0;B<6;B++)if(le){U?_e&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+B,0,0,0,Me[B].width,Me[B].height,Fe,ye,Me[B].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+B,0,Je,Me[B].width,Me[B].height,0,Fe,ye,Me[B].data);for(let ie=0;ie<O.length;ie++){let we=O[ie].image[B].image;U?_e&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+B,ie+1,0,0,we.width,we.height,Fe,ye,we.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+B,ie+1,Je,we.width,we.height,0,Fe,ye,we.data)}}else{U?_e&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+B,0,0,0,Fe,ye,Me[B]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+B,0,Je,Fe,ye,Me[B]);for(let ie=0;ie<O.length;ie++){let ve=O[ie];U?_e&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+B,ie+1,0,0,Fe,ye,ve.image[B]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+B,ie+1,Je,Fe,ye,ve.image[B])}}}p(y)&&u(i.TEXTURE_CUBE_MAP),J.__version=oe.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function Re(A,y,V,j,oe,J){let Ae=r.convert(V.format,V.colorSpace),ue=r.convert(V.type),De=E(V.internalFormat,Ae,ue,V.colorSpace),Le=n.get(y),le=n.get(V);if(le.__renderTarget=y,!Le.__hasExternalTextures){let Me=Math.max(1,y.width>>J),ke=Math.max(1,y.height>>J);oe===i.TEXTURE_3D||oe===i.TEXTURE_2D_ARRAY?t.texImage3D(oe,J,De,Me,ke,y.depth,0,Ae,ue,null):t.texImage2D(oe,J,De,Me,ke,0,Ae,ue,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),ce(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,oe,le.__webglTexture,0,me(y)):(oe===i.TEXTURE_2D||oe>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,j,oe,le.__webglTexture,J),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ie(A,y,V){if(i.bindRenderbuffer(i.RENDERBUFFER,A),y.depthBuffer){let j=y.depthTexture,oe=j&&j.isDepthTexture?j.type:null,J=x(y.stencilBuffer,oe),Ae=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=me(y);ce(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ue,J,y.width,y.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,ue,J,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,J,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ae,i.RENDERBUFFER,A)}else{let j=y.textures;for(let oe=0;oe<j.length;oe++){let J=j[oe],Ae=r.convert(J.format,J.colorSpace),ue=r.convert(J.type),De=E(J.internalFormat,Ae,ue,J.colorSpace),Le=me(y);V&&ce(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Le,De,y.width,y.height):ce(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Le,De,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,De,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Pe(A,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let j=n.get(y.depthTexture);j.__renderTarget=y,(!j.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),z(y.depthTexture,0);let oe=j.__webglTexture,J=me(y);if(y.depthTexture.format===vr)ce(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,oe,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,oe,0);else if(y.depthTexture.format===Or)ce(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,oe,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,oe,0);else throw new Error("Unknown depthTexture format")}function rt(A){let y=n.get(A),V=A.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==A.depthTexture){let j=A.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),j){let oe=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,j.removeEventListener("dispose",oe)};j.addEventListener("dispose",oe),y.__depthDisposeCallback=oe}y.__boundDepthTexture=j}if(A.depthTexture&&!y.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");let j=A.texture.mipmaps;j&&j.length>0?Pe(y.__webglFramebuffer[0],A):Pe(y.__webglFramebuffer,A)}else if(V){y.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[j]),y.__webglDepthbuffer[j]===void 0)y.__webglDepthbuffer[j]=i.createRenderbuffer(),Ie(y.__webglDepthbuffer[j],A,!1);else{let oe=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=y.__webglDepthbuffer[j];i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,oe,i.RENDERBUFFER,J)}}else{let j=A.texture.mipmaps;if(j&&j.length>0?t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),Ie(y.__webglDepthbuffer,A,!1);else{let oe=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,oe,i.RENDERBUFFER,J)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function xt(A,y,V){let j=n.get(A);y!==void 0&&Re(j.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&rt(A)}function P(A){let y=A.texture,V=n.get(A),j=n.get(y);A.addEventListener("dispose",C);let oe=A.textures,J=A.isWebGLCubeRenderTarget===!0,Ae=oe.length>1;if(Ae||(j.__webglTexture===void 0&&(j.__webglTexture=i.createTexture()),j.__version=y.version,o.memory.textures++),J){V.__webglFramebuffer=[];for(let ue=0;ue<6;ue++)if(y.mipmaps&&y.mipmaps.length>0){V.__webglFramebuffer[ue]=[];for(let De=0;De<y.mipmaps.length;De++)V.__webglFramebuffer[ue][De]=i.createFramebuffer()}else V.__webglFramebuffer[ue]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){V.__webglFramebuffer=[];for(let ue=0;ue<y.mipmaps.length;ue++)V.__webglFramebuffer[ue]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(Ae)for(let ue=0,De=oe.length;ue<De;ue++){let Le=n.get(oe[ue]);Le.__webglTexture===void 0&&(Le.__webglTexture=i.createTexture(),o.memory.textures++)}if(A.samples>0&&ce(A)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let ue=0;ue<oe.length;ue++){let De=oe[ue];V.__webglColorRenderbuffer[ue]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[ue]);let Le=r.convert(De.format,De.colorSpace),le=r.convert(De.type),Me=E(De.internalFormat,Le,le,De.colorSpace,A.isXRRenderTarget===!0),ke=me(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,ke,Me,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.RENDERBUFFER,V.__webglColorRenderbuffer[ue])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),Ie(V.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(J){t.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture),Xe(i.TEXTURE_CUBE_MAP,y);for(let ue=0;ue<6;ue++)if(y.mipmaps&&y.mipmaps.length>0)for(let De=0;De<y.mipmaps.length;De++)Re(V.__webglFramebuffer[ue][De],A,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,De);else Re(V.__webglFramebuffer[ue],A,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0);p(y)&&u(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ae){for(let ue=0,De=oe.length;ue<De;ue++){let Le=oe[ue],le=n.get(Le),Me=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Me=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Me,le.__webglTexture),Xe(Me,Le),Re(V.__webglFramebuffer,A,Le,i.COLOR_ATTACHMENT0+ue,Me,0),p(Le)&&u(Me)}t.unbindTexture()}else{let ue=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ue=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ue,j.__webglTexture),Xe(ue,y),y.mipmaps&&y.mipmaps.length>0)for(let De=0;De<y.mipmaps.length;De++)Re(V.__webglFramebuffer[De],A,y,i.COLOR_ATTACHMENT0,ue,De);else Re(V.__webglFramebuffer,A,y,i.COLOR_ATTACHMENT0,ue,0);p(y)&&u(ue),t.unbindTexture()}A.depthBuffer&&rt(A)}function re(A){let y=A.textures;for(let V=0,j=y.length;V<j;V++){let oe=y[V];if(p(oe)){let J=b(A),Ae=n.get(oe).__webglTexture;t.bindTexture(J,Ae),u(J),t.unbindTexture()}}}let ne=[],K=[];function te(A){if(A.samples>0){if(ce(A)===!1){let y=A.textures,V=A.width,j=A.height,oe=i.COLOR_BUFFER_BIT,J=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ae=n.get(A),ue=y.length>1;if(ue)for(let Le=0;Le<y.length;Le++)t.bindFramebuffer(i.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer);let De=A.texture.mipmaps;De&&De.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer);for(let Le=0;Le<y.length;Le++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(oe|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(oe|=i.STENCIL_BUFFER_BIT)),ue){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ae.__webglColorRenderbuffer[Le]);let le=n.get(y[Le]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,le,0)}i.blitFramebuffer(0,0,V,j,0,0,V,j,oe,i.NEAREST),l===!0&&(ne.length=0,K.length=0,ne.push(i.COLOR_ATTACHMENT0+Le),A.depthBuffer&&A.resolveDepthBuffer===!1&&(ne.push(J),K.push(J),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,K)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ne))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ue)for(let Le=0;Le<y.length;Le++){t.bindFramebuffer(i.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.RENDERBUFFER,Ae.__webglColorRenderbuffer[Le]);let le=n.get(y[Le]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.TEXTURE_2D,le,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){let y=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function me(A){return Math.min(s.maxSamples,A.samples)}function ce(A){let y=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function ge(A){let y=o.render.frame;h.get(A)!==y&&(h.set(A,y),A.update())}function Ze(A,y){let V=A.colorSpace,j=A.format,oe=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||V!==Ps&&V!==qi&&(ut.getTransfer(V)===bt?(j!==Qn||oe!==pi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),y}function qe(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=$,this.resetTextureUnits=W,this.setTexture2D=z,this.setTexture2DArray=G,this.setTexture3D=Q,this.setTextureCube=X,this.rebindTextures=xt,this.setupRenderTarget=P,this.updateRenderTargetMipmap=re,this.updateMultisampleRenderTarget=te,this.setupDepthRenderbuffer=rt,this.setupFrameBufferTexture=Re,this.useMultisampledRTT=ce}function Jy(i,e){function t(n,s=qi){let r,o=ut.getTransfer(s);if(n===pi)return i.UNSIGNED_BYTE;if(n===Wl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===$l)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Qh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===eu)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Jh)return i.BYTE;if(n===Kh)return i.SHORT;if(n===Nr)return i.UNSIGNED_SHORT;if(n===Gl)return i.INT;if(n===gs)return i.UNSIGNED_INT;if(n===Ci)return i.FLOAT;if(n===Ur)return i.HALF_FLOAT;if(n===tu)return i.ALPHA;if(n===nu)return i.RGB;if(n===Qn)return i.RGBA;if(n===vr)return i.DEPTH_COMPONENT;if(n===Or)return i.DEPTH_STENCIL;if(n===iu)return i.RED;if(n===Xl)return i.RED_INTEGER;if(n===su)return i.RG;if(n===ql)return i.RG_INTEGER;if(n===Yl)return i.RGBA_INTEGER;if(n===Ko||n===Qo||n===ea||n===ta)if(o===bt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ko)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Qo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ea)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ta)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ko)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Qo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ea)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ta)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Zl||n===jl||n===Jl||n===Kl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Zl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===jl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Jl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Kl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ql||n===ec||n===tc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ql||n===ec)return o===bt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===tc)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===nc||n===ic||n===sc||n===rc||n===oc||n===ac||n===lc||n===cc||n===hc||n===uc||n===dc||n===fc||n===pc||n===mc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===nc)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ic)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===sc)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===rc)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===oc)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ac)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===lc)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===cc)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===hc)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===uc)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===dc)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===fc)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===pc)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===mc)return o===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===gc||n===_c||n===xc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===gc)return o===bt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===_c)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===xc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===yc||n===vc||n===bc||n===Mc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===yc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===vc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===bc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Mc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Fr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Ky=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Qy=`
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

}`,Ru=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Po(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new fi({vertexShader:Ky,fragmentShader:Qy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Mt(new Us(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Cu=class extends Si{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,m=null,f=null,g=null,_=typeof XRWebGLBinding<"u",p=new Ru,u={},b=t.getContextAttributes(),E=null,x=null,T=[],w=[],C=new ae,L=null,v=new on;v.viewport=new Ot;let S=new on;S.viewport=new Ot;let I=[v,S],W=new Il,$=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ee){let se=T[ee];return se===void 0&&(se=new wr,T[ee]=se),se.getTargetRaySpace()},this.getControllerGrip=function(ee){let se=T[ee];return se===void 0&&(se=new wr,T[ee]=se),se.getGripSpace()},this.getHand=function(ee){let se=T[ee];return se===void 0&&(se=new wr,T[ee]=se),se.getHandSpace()};function z(ee){let se=w.indexOf(ee.inputSource);if(se===-1)return;let Re=T[se];Re!==void 0&&(Re.update(ee.inputSource,ee.frame,c||o),Re.dispatchEvent({type:ee.type,data:ee.inputSource}))}function G(){s.removeEventListener("select",z),s.removeEventListener("selectstart",z),s.removeEventListener("selectend",z),s.removeEventListener("squeeze",z),s.removeEventListener("squeezestart",z),s.removeEventListener("squeezeend",z),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",Q);for(let ee=0;ee<T.length;ee++){let se=w[ee];se!==null&&(w[ee]=null,T[ee].disconnect(se))}$=null,Y=null,p.reset();for(let ee in u)delete u[ee];e.setRenderTarget(E),f=null,m=null,d=null,s=null,x=null,ct.stop(),n.isPresenting=!1,e.setPixelRatio(L),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ee){r=ee,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ee){a=ee,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(ee){c=ee},this.getBaseLayer=function(){return m!==null?m:f},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(ee){if(s=ee,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",z),s.addEventListener("selectstart",z),s.addEventListener("selectend",z),s.addEventListener("squeeze",z),s.addEventListener("squeezestart",z),s.addEventListener("squeezeend",z),s.addEventListener("end",G),s.addEventListener("inputsourceschange",Q),b.xrCompatible!==!0&&await t.makeXRCompatible(),L=e.getPixelRatio(),e.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Re=null,Ie=null,Pe=null;b.depth&&(Pe=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Re=b.stencil?Or:vr,Ie=b.stencil?Fr:gs);let rt={colorFormat:t.RGBA8,depthFormat:Pe,scaleFactor:r};d=this.getBinding(),m=d.createProjectionLayer(rt),s.updateRenderState({layers:[m]}),e.setPixelRatio(1),e.setSize(m.textureWidth,m.textureHeight,!1),x=new Ei(m.textureWidth,m.textureHeight,{format:Qn,type:pi,depthTexture:new Co(m.textureWidth,m.textureHeight,Ie,void 0,void 0,void 0,void 0,void 0,void 0,Re),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}else{let Re={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,Re),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new Ei(f.framebufferWidth,f.framebufferHeight,{format:Qn,type:pi,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),ct.setContext(s),ct.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function Q(ee){for(let se=0;se<ee.removed.length;se++){let Re=ee.removed[se],Ie=w.indexOf(Re);Ie>=0&&(w[Ie]=null,T[Ie].disconnect(Re))}for(let se=0;se<ee.added.length;se++){let Re=ee.added[se],Ie=w.indexOf(Re);if(Ie===-1){for(let rt=0;rt<T.length;rt++)if(rt>=w.length){w.push(Re),Ie=rt;break}else if(w[rt]===null){w[rt]=Re,Ie=rt;break}if(Ie===-1)break}let Pe=T[Ie];Pe&&Pe.connect(Re)}}let X=new D,de=new D;function xe(ee,se,Re){X.setFromMatrixPosition(se.matrixWorld),de.setFromMatrixPosition(Re.matrixWorld);let Ie=X.distanceTo(de),Pe=se.projectionMatrix.elements,rt=Re.projectionMatrix.elements,xt=Pe[14]/(Pe[10]-1),P=Pe[14]/(Pe[10]+1),re=(Pe[9]+1)/Pe[5],ne=(Pe[9]-1)/Pe[5],K=(Pe[8]-1)/Pe[0],te=(rt[8]+1)/rt[0],me=xt*K,ce=xt*te,ge=Ie/(-K+te),Ze=ge*-K;if(se.matrixWorld.decompose(ee.position,ee.quaternion,ee.scale),ee.translateX(Ze),ee.translateZ(ge),ee.matrixWorld.compose(ee.position,ee.quaternion,ee.scale),ee.matrixWorldInverse.copy(ee.matrixWorld).invert(),Pe[10]===-1)ee.projectionMatrix.copy(se.projectionMatrix),ee.projectionMatrixInverse.copy(se.projectionMatrixInverse);else{let qe=xt+ge,A=P+ge,y=me-Ze,V=ce+(Ie-Ze),j=re*P/A*qe,oe=ne*P/A*qe;ee.projectionMatrix.makePerspective(y,V,j,oe,qe,A),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert()}}function Ee(ee,se){se===null?ee.matrixWorld.copy(ee.matrix):ee.matrixWorld.multiplyMatrices(se.matrixWorld,ee.matrix),ee.matrixWorldInverse.copy(ee.matrixWorld).invert()}this.updateCamera=function(ee){if(s===null)return;let se=ee.near,Re=ee.far;p.texture!==null&&(p.depthNear>0&&(se=p.depthNear),p.depthFar>0&&(Re=p.depthFar)),W.near=S.near=v.near=se,W.far=S.far=v.far=Re,($!==W.near||Y!==W.far)&&(s.updateRenderState({depthNear:W.near,depthFar:W.far}),$=W.near,Y=W.far),W.layers.mask=ee.layers.mask|6,v.layers.mask=W.layers.mask&3,S.layers.mask=W.layers.mask&5;let Ie=ee.parent,Pe=W.cameras;Ee(W,Ie);for(let rt=0;rt<Pe.length;rt++)Ee(Pe[rt],Ie);Pe.length===2?xe(W,v,S):W.projectionMatrix.copy(v.projectionMatrix),Xe(ee,W,Ie)};function Xe(ee,se,Re){Re===null?ee.matrix.copy(se.matrixWorld):(ee.matrix.copy(Re.matrixWorld),ee.matrix.invert(),ee.matrix.multiply(se.matrixWorld)),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.updateMatrixWorld(!0),ee.projectionMatrix.copy(se.projectionMatrix),ee.projectionMatrixInverse.copy(se.projectionMatrixInverse),ee.isPerspectiveCamera&&(ee.fov=br*2*Math.atan(1/ee.projectionMatrix.elements[5]),ee.zoom=1)}this.getCamera=function(){return W},this.getFoveation=function(){if(!(m===null&&f===null))return l},this.setFoveation=function(ee){l=ee,m!==null&&(m.fixedFoveation=ee),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=ee)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(W)},this.getCameraTexture=function(ee){return u[ee]};let nt=null;function ht(ee,se){if(h=se.getViewerPose(c||o),g=se,h!==null){let Re=h.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let Ie=!1;Re.length!==W.cameras.length&&(W.cameras.length=0,Ie=!0);for(let P=0;P<Re.length;P++){let re=Re[P],ne=null;if(f!==null)ne=f.getViewport(re);else{let te=d.getViewSubImage(m,re);ne=te.viewport,P===0&&(e.setRenderTargetTextures(x,te.colorTexture,te.depthStencilTexture),e.setRenderTarget(x))}let K=I[P];K===void 0&&(K=new on,K.layers.enable(P),K.viewport=new Ot,I[P]=K),K.matrix.fromArray(re.transform.matrix),K.matrix.decompose(K.position,K.quaternion,K.scale),K.projectionMatrix.fromArray(re.projectionMatrix),K.projectionMatrixInverse.copy(K.projectionMatrix).invert(),K.viewport.set(ne.x,ne.y,ne.width,ne.height),P===0&&(W.matrix.copy(K.matrix),W.matrix.decompose(W.position,W.quaternion,W.scale)),Ie===!0&&W.cameras.push(K)}let Pe=s.enabledFeatures;if(Pe&&Pe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){d=n.getBinding();let P=d.getDepthInformation(Re[0]);P&&P.isValid&&P.texture&&p.init(P,s.renderState)}if(Pe&&Pe.includes("camera-access")&&_){e.state.unbindTexture(),d=n.getBinding();for(let P=0;P<Re.length;P++){let re=Re[P].camera;if(re){let ne=u[re];ne||(ne=new Po,u[re]=ne);let K=d.getCameraImage(re);ne.sourceTexture=K}}}}for(let Re=0;Re<T.length;Re++){let Ie=w[Re],Pe=T[Re];Ie!==null&&Pe!==void 0&&Pe.update(Ie,se,c||o)}nt&&nt(ee,se),se.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:se}),g=null}let ct=new dp;ct.setAnimationLoop(ht),this.setAnimationLoop=function(ee){nt=ee},this.dispose=function(){}}},Hs=new di,ev=new gt;function tv(i,e){function t(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,uu(i)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function s(p,u,b,E,x){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(p,u):u.isMeshToonMaterial?(r(p,u),d(p,u)):u.isMeshPhongMaterial?(r(p,u),h(p,u)):u.isMeshStandardMaterial?(r(p,u),m(p,u),u.isMeshPhysicalMaterial&&f(p,u,x)):u.isMeshMatcapMaterial?(r(p,u),g(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),_(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(o(p,u),u.isLineDashedMaterial&&a(p,u)):u.isPointsMaterial?l(p,u,b,E):u.isSpriteMaterial?c(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,t(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,t(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===bn&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,t(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===bn&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,t(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,t(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);let b=e.get(u),E=b.envMap,x=b.envMapRotation;E&&(p.envMap.value=E,Hs.copy(x),Hs.x*=-1,Hs.y*=-1,Hs.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Hs.y*=-1,Hs.z*=-1),p.envMapRotation.value.setFromMatrix4(ev.makeRotationFromEuler(Hs)),p.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap&&(p.lightMap.value=u.lightMap,p.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,p.lightMapTransform)),u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,p.aoMapTransform))}function o(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,t(u.map,p.mapTransform))}function a(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function l(p,u,b,E){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*b,p.scale.value=E*.5,u.map&&(p.map.value=u.map,t(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function c(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,t(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function d(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function m(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,p.roughnessMapTransform)),u.envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function f(p,u,b){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===bn&&p.clearcoatNormalScale.value.negate())),u.dispersion>0&&(p.dispersion.value=u.dispersion),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=b.texture,p.transmissionSamplerSize.value.set(b.width,b.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,u){u.matcap&&(p.matcap.value=u.matcap)}function _(p,u){let b=e.get(u).light;p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),p.nearDistance.value=b.shadow.camera.near,p.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function nv(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,E){let x=E.program;n.uniformBlockBinding(b,x)}function c(b,E){let x=s[b.id];x===void 0&&(g(b),x=h(b),s[b.id]=x,b.addEventListener("dispose",p));let T=E.program;n.updateUBOMapping(b,T);let w=e.render.frame;r[b.id]!==w&&(m(b),r[b.id]=w)}function h(b){let E=d();b.__bindingPointIndex=E;let x=i.createBuffer(),T=b.__size,w=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,T,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,x),x}function d(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(b){let E=s[b.id],x=b.uniforms,T=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let w=0,C=x.length;w<C;w++){let L=Array.isArray(x[w])?x[w]:[x[w]];for(let v=0,S=L.length;v<S;v++){let I=L[v];if(f(I,w,v,T)===!0){let W=I.__offset,$=Array.isArray(I.value)?I.value:[I.value],Y=0;for(let z=0;z<$.length;z++){let G=$[z],Q=_(G);typeof G=="number"||typeof G=="boolean"?(I.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,W+Y,I.__data)):G.isMatrix3?(I.__data[0]=G.elements[0],I.__data[1]=G.elements[1],I.__data[2]=G.elements[2],I.__data[3]=0,I.__data[4]=G.elements[3],I.__data[5]=G.elements[4],I.__data[6]=G.elements[5],I.__data[7]=0,I.__data[8]=G.elements[6],I.__data[9]=G.elements[7],I.__data[10]=G.elements[8],I.__data[11]=0):(G.toArray(I.__data,Y),Y+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,W,I.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(b,E,x,T){let w=b.value,C=E+"_"+x;if(T[C]===void 0)return typeof w=="number"||typeof w=="boolean"?T[C]=w:T[C]=w.clone(),!0;{let L=T[C];if(typeof w=="number"||typeof w=="boolean"){if(L!==w)return T[C]=w,!0}else if(L.equals(w)===!1)return L.copy(w),!0}return!1}function g(b){let E=b.uniforms,x=0,T=16;for(let C=0,L=E.length;C<L;C++){let v=Array.isArray(E[C])?E[C]:[E[C]];for(let S=0,I=v.length;S<I;S++){let W=v[S],$=Array.isArray(W.value)?W.value:[W.value];for(let Y=0,z=$.length;Y<z;Y++){let G=$[Y],Q=_(G),X=x%T,de=X%Q.boundary,xe=X+de;x+=de,xe!==0&&T-xe<Q.storage&&(x+=T-xe),W.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=x,x+=Q.storage}}}let w=x%T;return w>0&&(x+=T-w),b.__size=x,b.__cache={},this}function _(b){let E={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(E.boundary=4,E.storage=4):b.isVector2?(E.boundary=8,E.storage=8):b.isVector3||b.isColor?(E.boundary=16,E.storage=12):b.isVector4?(E.boundary=16,E.storage=16):b.isMatrix3?(E.boundary=48,E.storage=48):b.isMatrix4?(E.boundary=64,E.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),E}function p(b){let E=b.target;E.removeEventListener("dispose",p);let x=o.indexOf(E.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function u(){for(let b in s)i.deleteBuffer(s[b]);o=[],s={},r={}}return{bind:l,update:c,dispose:u}}var Hr=class{constructor(e={}){let{canvas:t=Lf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:m=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;let g=new Uint32Array(4),_=new Int32Array(4),p=null,u=null,b=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Xi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let x=this,T=!1;this._outputColorSpace=un;let w=0,C=0,L=null,v=-1,S=null,I=new Ot,W=new Ot,$=null,Y=new Qe(0),z=0,G=t.width,Q=t.height,X=1,de=null,xe=null,Ee=new Ot(0,0,G,Q),Xe=new Ot(0,0,G,Q),nt=!1,ht=new Ar,ct=!1,ee=!1,se=new gt,Re=new D,Ie=new Ot,Pe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},rt=!1;function xt(){return L===null?X:1}let P=n;function re(M,k){return t.getContext(M,k)}try{let M={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",_e,!1),t.addEventListener("webglcontextrestored",F,!1),t.addEventListener("webglcontextcreationerror",O,!1),P===null){let k="webgl2";if(P=re(k,M),P===null)throw re(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let ne,K,te,me,ce,ge,Ze,qe,A,y,V,j,oe,J,Ae,ue,De,Le,le,Me,ke,Fe,ye,Je;function U(){ne=new vx(P),ne.init(),Fe=new Jy(P,ne),K=new fx(P,ne,e,Fe),te=new Zy(P,ne),K.reversedDepthBuffer&&m&&te.buffers.depth.setReversed(!0),me=new Sx(P),ce=new Fy,ge=new jy(P,ne,te,ce,K,Fe,me),Ze=new mx(x),qe=new yx(x),A=new Cg(P),ye=new ux(P,A),y=new bx(P,A,me,ye),V=new wx(P,y,A,me),le=new Ex(P,K,ge),ue=new px(ce),j=new Uy(x,Ze,qe,ne,K,ye,ue),oe=new tv(x,ce),J=new By,Ae=new Wy(ne),Le=new hx(x,Ze,qe,te,V,f,l),De=new qy(x,V,K),Je=new nv(P,me,K,te),Me=new dx(P,ne,me),ke=new Mx(P,ne,me),me.programs=j.programs,x.capabilities=K,x.extensions=ne,x.properties=ce,x.renderLists=J,x.shadowMap=De,x.state=te,x.info=me}U();let pe=new Cu(x,P);this.xr=pe,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let M=ne.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=ne.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(M){M!==void 0&&(X=M,this.setSize(G,Q,!1))},this.getSize=function(M){return M.set(G,Q)},this.setSize=function(M,k,q=!0){if(pe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=M,Q=k,t.width=Math.floor(M*X),t.height=Math.floor(k*X),q===!0&&(t.style.width=M+"px",t.style.height=k+"px"),this.setViewport(0,0,M,k)},this.getDrawingBufferSize=function(M){return M.set(G*X,Q*X).floor()},this.setDrawingBufferSize=function(M,k,q){G=M,Q=k,X=q,t.width=Math.floor(M*q),t.height=Math.floor(k*q),this.setViewport(0,0,M,k)},this.getCurrentViewport=function(M){return M.copy(I)},this.getViewport=function(M){return M.copy(Ee)},this.setViewport=function(M,k,q,Z){M.isVector4?Ee.set(M.x,M.y,M.z,M.w):Ee.set(M,k,q,Z),te.viewport(I.copy(Ee).multiplyScalar(X).round())},this.getScissor=function(M){return M.copy(Xe)},this.setScissor=function(M,k,q,Z){M.isVector4?Xe.set(M.x,M.y,M.z,M.w):Xe.set(M,k,q,Z),te.scissor(W.copy(Xe).multiplyScalar(X).round())},this.getScissorTest=function(){return nt},this.setScissorTest=function(M){te.setScissorTest(nt=M)},this.setOpaqueSort=function(M){de=M},this.setTransparentSort=function(M){xe=M},this.getClearColor=function(M){return M.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor(...arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha(...arguments)},this.clear=function(M=!0,k=!0,q=!0){let Z=0;if(M){let H=!1;if(L!==null){let fe=L.texture.format;H=fe===Yl||fe===ql||fe===Xl}if(H){let fe=L.texture.type,Se=fe===pi||fe===gs||fe===Nr||fe===Fr||fe===Wl||fe===$l,Ne=Le.getClearColor(),Ce=Le.getClearAlpha(),$e=Ne.r,Ye=Ne.g,He=Ne.b;Se?(g[0]=$e,g[1]=Ye,g[2]=He,g[3]=Ce,P.clearBufferuiv(P.COLOR,0,g)):(_[0]=$e,_[1]=Ye,_[2]=He,_[3]=Ce,P.clearBufferiv(P.COLOR,0,_))}else Z|=P.COLOR_BUFFER_BIT}k&&(Z|=P.DEPTH_BUFFER_BIT),q&&(Z|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",_e,!1),t.removeEventListener("webglcontextrestored",F,!1),t.removeEventListener("webglcontextcreationerror",O,!1),Le.dispose(),J.dispose(),Ae.dispose(),ce.dispose(),Ze.dispose(),qe.dispose(),V.dispose(),ye.dispose(),Je.dispose(),j.dispose(),pe.dispose(),pe.removeEventListener("sessionstart",Be),pe.removeEventListener("sessionend",Ge),je.stop()};function _e(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function F(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let M=me.autoReset,k=De.enabled,q=De.autoUpdate,Z=De.needsUpdate,H=De.type;U(),me.autoReset=M,De.enabled=k,De.autoUpdate=q,De.needsUpdate=Z,De.type=H}function O(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function B(M){let k=M.target;k.removeEventListener("dispose",B),ie(k)}function ie(M){ve(M),ce.remove(M)}function ve(M){let k=ce.get(M).programs;k!==void 0&&(k.forEach(function(q){j.releaseProgram(q)}),M.isShaderMaterial&&j.releaseShaderCache(M))}this.renderBufferDirect=function(M,k,q,Z,H,fe){k===null&&(k=Pe);let Se=H.isMesh&&H.matrixWorld.determinant()<0,Ne=wn(M,k,q,Z,H);te.setMaterial(Z,Se);let Ce=q.index,$e=1;if(Z.wireframe===!0){if(Ce=y.getWireframeAttribute(q),Ce===void 0)return;$e=2}let Ye=q.drawRange,He=q.attributes.position,lt=Ye.start*$e,St=(Ye.start+Ye.count)*$e;fe!==null&&(lt=Math.max(lt,fe.start*$e),St=Math.min(St,(fe.start+fe.count)*$e)),Ce!==null?(lt=Math.max(lt,0),St=Math.min(St,Ce.count)):He!=null&&(lt=Math.max(lt,0),St=Math.min(St,He.count));let zt=St-lt;if(zt<0||zt===1/0)return;ye.setup(H,Z,Ne,q,Ce);let Pt,wt=Me;if(Ce!==null&&(Pt=A.get(Ce),wt=ke,wt.setIndex(Pt)),H.isMesh)Z.wireframe===!0?(te.setLineWidth(Z.wireframeLinewidth*xt()),wt.setMode(P.LINES)):wt.setMode(P.TRIANGLES);else if(H.isLine){let Ve=Z.linewidth;Ve===void 0&&(Ve=1),te.setLineWidth(Ve*xt()),H.isLineSegments?wt.setMode(P.LINES):H.isLineLoop?wt.setMode(P.LINE_LOOP):wt.setMode(P.LINE_STRIP)}else H.isPoints?wt.setMode(P.POINTS):H.isSprite&&wt.setMode(P.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)Mr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),wt.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(ne.get("WEBGL_multi_draw"))wt.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let Ve=H._multiDrawStarts,Lt=H._multiDrawCounts,dt=H._multiDrawCount,Ln=Ce?A.get(Ce).bytesPerElement:1,Zs=ce.get(Z).currentProgram.getUniforms();for(let Nn=0;Nn<dt;Nn++)Zs.setValue(P,"_gl_DrawID",Nn),wt.render(Ve[Nn]/Ln,Lt[Nn])}else if(H.isInstancedMesh)wt.renderInstances(lt,zt,H.count);else if(q.isInstancedBufferGeometry){let Ve=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Lt=Math.min(q.instanceCount,Ve);wt.renderInstances(lt,zt,Lt)}else wt.render(lt,zt)};function we(M,k,q){M.transparent===!0&&M.side===Ri&&M.forceSinglePass===!1?(M.side=bn,M.needsUpdate=!0,Dn(M,k,q),M.side=Gi,M.needsUpdate=!0,Dn(M,k,q),M.side=Ri):Dn(M,k,q)}this.compile=function(M,k,q=null){q===null&&(q=M),u=Ae.get(q),u.init(k),E.push(u),q.traverseVisible(function(H){H.isLight&&H.layers.test(k.layers)&&(u.pushLight(H),H.castShadow&&u.pushShadow(H))}),M!==q&&M.traverseVisible(function(H){H.isLight&&H.layers.test(k.layers)&&(u.pushLight(H),H.castShadow&&u.pushShadow(H))}),u.setupLights();let Z=new Set;return M.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let fe=H.material;if(fe)if(Array.isArray(fe))for(let Se=0;Se<fe.length;Se++){let Ne=fe[Se];we(Ne,q,H),Z.add(Ne)}else we(fe,q,H),Z.add(fe)}),u=E.pop(),Z},this.compileAsync=function(M,k,q=null){let Z=this.compile(M,k,q);return new Promise(H=>{function fe(){if(Z.forEach(function(Se){ce.get(Se).currentProgram.isReady()&&Z.delete(Se)}),Z.size===0){H(M);return}setTimeout(fe,10)}ne.get("KHR_parallel_shader_compile")!==null?fe():setTimeout(fe,10)})};let Oe=null;function We(M){Oe&&Oe(M)}function Be(){je.stop()}function Ge(){je.start()}let je=new dp;je.setAnimationLoop(We),typeof self<"u"&&je.setContext(self),this.setAnimationLoop=function(M){Oe=M,pe.setAnimationLoop(M),M===null?je.stop():je.start()},pe.addEventListener("sessionstart",Be),pe.addEventListener("sessionend",Ge),this.render=function(M,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),pe.enabled===!0&&pe.isPresenting===!0&&(pe.cameraAutoUpdate===!0&&pe.updateCamera(k),k=pe.getCamera()),M.isScene===!0&&M.onBeforeRender(x,M,k,L),u=Ae.get(M,E.length),u.init(k),E.push(u),se.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),ht.setFromProjectionMatrix(se,hi,k.reversedDepth),ee=this.localClippingEnabled,ct=ue.init(this.clippingPlanes,ee),p=J.get(M,b.length),p.init(),b.push(p),pe.enabled===!0&&pe.isPresenting===!0){let fe=x.xr.getDepthSensingMesh();fe!==null&&Gt(fe,k,-1/0,x.sortObjects)}Gt(M,k,0,x.sortObjects),p.finish(),x.sortObjects===!0&&p.sort(de,xe),rt=pe.enabled===!1||pe.isPresenting===!1||pe.hasDepthSensing()===!1,rt&&Le.addToRenderList(p,M),this.info.render.frame++,ct===!0&&ue.beginShadows();let q=u.state.shadowsArray;De.render(q,M,k),ct===!0&&ue.endShadows(),this.info.autoReset===!0&&this.info.reset();let Z=p.opaque,H=p.transmissive;if(u.setupLights(),k.isArrayCamera){let fe=k.cameras;if(H.length>0)for(let Se=0,Ne=fe.length;Se<Ne;Se++){let Ce=fe[Se];Ke(Z,H,M,Ce)}rt&&Le.render(M);for(let Se=0,Ne=fe.length;Se<Ne;Se++){let Ce=fe[Se];Te(p,M,Ce,Ce.viewport)}}else H.length>0&&Ke(Z,H,M,k),rt&&Le.render(M),Te(p,M,k);L!==null&&C===0&&(ge.updateMultisampleRenderTarget(L),ge.updateRenderTargetMipmap(L)),M.isScene===!0&&M.onAfterRender(x,M,k),ye.resetDefaultState(),v=-1,S=null,E.pop(),E.length>0?(u=E[E.length-1],ct===!0&&ue.setGlobalState(x.clippingPlanes,u.state.camera)):u=null,b.pop(),b.length>0?p=b[b.length-1]:p=null};function Gt(M,k,q,Z){if(M.visible===!1)return;if(M.layers.test(k.layers)){if(M.isGroup)q=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(k);else if(M.isLight)u.pushLight(M),M.castShadow&&u.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||ht.intersectsSprite(M)){Z&&Ie.setFromMatrixPosition(M.matrixWorld).applyMatrix4(se);let Se=V.update(M),Ne=M.material;Ne.visible&&p.push(M,Se,Ne,q,Ie.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||ht.intersectsObject(M))){let Se=V.update(M),Ne=M.material;if(Z&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Ie.copy(M.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),Ie.copy(Se.boundingSphere.center)),Ie.applyMatrix4(M.matrixWorld).applyMatrix4(se)),Array.isArray(Ne)){let Ce=Se.groups;for(let $e=0,Ye=Ce.length;$e<Ye;$e++){let He=Ce[$e],lt=Ne[He.materialIndex];lt&&lt.visible&&p.push(M,Se,lt,q,Ie.z,He)}}else Ne.visible&&p.push(M,Se,Ne,q,Ie.z,null)}}let fe=M.children;for(let Se=0,Ne=fe.length;Se<Ne;Se++)Gt(fe[Se],k,q,Z)}function Te(M,k,q,Z){let H=M.opaque,fe=M.transmissive,Se=M.transparent;u.setupLightsView(q),ct===!0&&ue.setGlobalState(x.clippingPlanes,q),Z&&te.viewport(I.copy(Z)),H.length>0&&ze(H,k,q),fe.length>0&&ze(fe,k,q),Se.length>0&&ze(Se,k,q),te.buffers.depth.setTest(!0),te.buffers.depth.setMask(!0),te.buffers.color.setMask(!0),te.setPolygonOffset(!1)}function Ke(M,k,q,Z){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[Z.id]===void 0&&(u.state.transmissionRenderTarget[Z.id]=new Ei(1,1,{generateMipmaps:!0,type:ne.has("EXT_color_buffer_half_float")||ne.has("EXT_color_buffer_float")?Ur:pi,minFilter:ms,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ut.workingColorSpace}));let fe=u.state.transmissionRenderTarget[Z.id],Se=Z.viewport||I;fe.setSize(Se.z*x.transmissionResolutionScale,Se.w*x.transmissionResolutionScale);let Ne=x.getRenderTarget(),Ce=x.getActiveCubeFace(),$e=x.getActiveMipmapLevel();x.setRenderTarget(fe),x.getClearColor(Y),z=x.getClearAlpha(),z<1&&x.setClearColor(16777215,.5),x.clear(),rt&&Le.render(q);let Ye=x.toneMapping;x.toneMapping=Xi;let He=Z.viewport;if(Z.viewport!==void 0&&(Z.viewport=void 0),u.setupLightsView(Z),ct===!0&&ue.setGlobalState(x.clippingPlanes,Z),ze(M,q,Z),ge.updateMultisampleRenderTarget(fe),ge.updateRenderTargetMipmap(fe),ne.has("WEBGL_multisampled_render_to_texture")===!1){let lt=!1;for(let St=0,zt=k.length;St<zt;St++){let Pt=k[St],wt=Pt.object,Ve=Pt.geometry,Lt=Pt.material,dt=Pt.group;if(Lt.side===Ri&&wt.layers.test(Z.layers)){let Ln=Lt.side;Lt.side=bn,Lt.needsUpdate=!0,yt(wt,q,Z,Ve,Lt,dt),Lt.side=Ln,Lt.needsUpdate=!0,lt=!0}}lt===!0&&(ge.updateMultisampleRenderTarget(fe),ge.updateRenderTargetMipmap(fe))}x.setRenderTarget(Ne,Ce,$e),x.setClearColor(Y,z),He!==void 0&&(Z.viewport=He),x.toneMapping=Ye}function ze(M,k,q){let Z=k.isScene===!0?k.overrideMaterial:null;for(let H=0,fe=M.length;H<fe;H++){let Se=M[H],Ne=Se.object,Ce=Se.geometry,$e=Se.group,Ye=Se.material;Ye.allowOverride===!0&&Z!==null&&(Ye=Z),Ne.layers.test(q.layers)&&yt(Ne,k,q,Ce,Ye,$e)}}function yt(M,k,q,Z,H,fe){M.onBeforeRender(x,k,q,Z,H,fe),M.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),H.onBeforeRender(x,k,q,Z,M,fe),H.transparent===!0&&H.side===Ri&&H.forceSinglePass===!1?(H.side=bn,H.needsUpdate=!0,x.renderBufferDirect(q,k,Z,H,M,fe),H.side=Gi,H.needsUpdate=!0,x.renderBufferDirect(q,k,Z,H,M,fe),H.side=Ri):x.renderBufferDirect(q,k,Z,H,M,fe),M.onAfterRender(x,k,q,Z,H,fe)}function Dn(M,k,q){k.isScene!==!0&&(k=Pe);let Z=ce.get(M),H=u.state.lights,fe=u.state.shadowsArray,Se=H.state.version,Ne=j.getParameters(M,H.state,fe,k,q),Ce=j.getProgramCacheKey(Ne),$e=Z.programs;Z.environment=M.isMeshStandardMaterial?k.environment:null,Z.fog=k.fog,Z.envMap=(M.isMeshStandardMaterial?qe:Ze).get(M.envMap||Z.environment),Z.envMapRotation=Z.environment!==null&&M.envMap===null?k.environmentRotation:M.envMapRotation,$e===void 0&&(M.addEventListener("dispose",B),$e=new Map,Z.programs=$e);let Ye=$e.get(Ce);if(Ye!==void 0){if(Z.currentProgram===Ye&&Z.lightsStateVersion===Se)return _n(M,Ne),Ye}else Ne.uniforms=j.getUniforms(M),M.onBeforeCompile(Ne,x),Ye=j.acquireProgram(Ne,Ce),$e.set(Ce,Ye),Z.uniforms=Ne.uniforms;let He=Z.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(He.clippingPlanes=ue.uniform),_n(M,Ne),Z.needsLights=Ui(M),Z.lightsStateVersion=Se,Z.needsLights&&(He.ambientLightColor.value=H.state.ambient,He.lightProbe.value=H.state.probe,He.directionalLights.value=H.state.directional,He.directionalLightShadows.value=H.state.directionalShadow,He.spotLights.value=H.state.spot,He.spotLightShadows.value=H.state.spotShadow,He.rectAreaLights.value=H.state.rectArea,He.ltc_1.value=H.state.rectAreaLTC1,He.ltc_2.value=H.state.rectAreaLTC2,He.pointLights.value=H.state.point,He.pointLightShadows.value=H.state.pointShadow,He.hemisphereLights.value=H.state.hemi,He.directionalShadowMap.value=H.state.directionalShadowMap,He.directionalShadowMatrix.value=H.state.directionalShadowMatrix,He.spotShadowMap.value=H.state.spotShadowMap,He.spotLightMatrix.value=H.state.spotLightMatrix,He.spotLightMap.value=H.state.spotLightMap,He.pointShadowMap.value=H.state.pointShadowMap,He.pointShadowMatrix.value=H.state.pointShadowMatrix),Z.currentProgram=Ye,Z.uniformsList=null,Ye}function Ni(M){if(M.uniformsList===null){let k=M.currentProgram.getUniforms();M.uniformsList=zr.seqWithValue(k.seq,M.uniforms)}return M.uniformsList}function _n(M,k){let q=ce.get(M);q.outputColorSpace=k.outputColorSpace,q.batching=k.batching,q.batchingColor=k.batchingColor,q.instancing=k.instancing,q.instancingColor=k.instancingColor,q.instancingMorph=k.instancingMorph,q.skinning=k.skinning,q.morphTargets=k.morphTargets,q.morphNormals=k.morphNormals,q.morphColors=k.morphColors,q.morphTargetsCount=k.morphTargetsCount,q.numClippingPlanes=k.numClippingPlanes,q.numIntersection=k.numClipIntersection,q.vertexAlphas=k.vertexAlphas,q.vertexTangents=k.vertexTangents,q.toneMapping=k.toneMapping}function wn(M,k,q,Z,H){k.isScene!==!0&&(k=Pe),ge.resetTextureUnits();let fe=k.fog,Se=Z.isMeshStandardMaterial?k.environment:null,Ne=L===null?x.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Ps,Ce=(Z.isMeshStandardMaterial?qe:Ze).get(Z.envMap||Se),$e=Z.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Ye=!!q.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),He=!!q.morphAttributes.position,lt=!!q.morphAttributes.normal,St=!!q.morphAttributes.color,zt=Xi;Z.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(zt=x.toneMapping);let Pt=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,wt=Pt!==void 0?Pt.length:0,Ve=ce.get(Z),Lt=u.state.lights;if(ct===!0&&(ee===!0||M!==S)){let yn=M===S&&Z.id===v;ue.setState(Z,M,yn)}let dt=!1;Z.version===Ve.__version?(Ve.needsLights&&Ve.lightsStateVersion!==Lt.state.version||Ve.outputColorSpace!==Ne||H.isBatchedMesh&&Ve.batching===!1||!H.isBatchedMesh&&Ve.batching===!0||H.isBatchedMesh&&Ve.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Ve.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Ve.instancing===!1||!H.isInstancedMesh&&Ve.instancing===!0||H.isSkinnedMesh&&Ve.skinning===!1||!H.isSkinnedMesh&&Ve.skinning===!0||H.isInstancedMesh&&Ve.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Ve.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Ve.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Ve.instancingMorph===!1&&H.morphTexture!==null||Ve.envMap!==Ce||Z.fog===!0&&Ve.fog!==fe||Ve.numClippingPlanes!==void 0&&(Ve.numClippingPlanes!==ue.numPlanes||Ve.numIntersection!==ue.numIntersection)||Ve.vertexAlphas!==$e||Ve.vertexTangents!==Ye||Ve.morphTargets!==He||Ve.morphNormals!==lt||Ve.morphColors!==St||Ve.toneMapping!==zt||Ve.morphTargetsCount!==wt)&&(dt=!0):(dt=!0,Ve.__version=Z.version);let Ln=Ve.currentProgram;dt===!0&&(Ln=Dn(Z,k,H));let Zs=!1,Nn=!1,Kr=!1,Nt=Ln.getUniforms(),Wn=Ve.uniforms;if(te.useProgram(Ln.program)&&(Zs=!0,Nn=!0,Kr=!0),Z.id!==v&&(v=Z.id,Nn=!0),Zs||S!==M){te.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),Nt.setValue(P,"projectionMatrix",M.projectionMatrix),Nt.setValue(P,"viewMatrix",M.matrixWorldInverse);let Tn=Nt.map.cameraPosition;Tn!==void 0&&Tn.setValue(P,Re.setFromMatrixPosition(M.matrixWorld)),K.logarithmicDepthBuffer&&Nt.setValue(P,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&Nt.setValue(P,"isOrthographic",M.isOrthographicCamera===!0),S!==M&&(S=M,Nn=!0,Kr=!0)}if(H.isSkinnedMesh){Nt.setOptional(P,H,"bindMatrix"),Nt.setOptional(P,H,"bindMatrixInverse");let yn=H.skeleton;yn&&(yn.boneTexture===null&&yn.computeBoneTexture(),Nt.setValue(P,"boneTexture",yn.boneTexture,ge))}H.isBatchedMesh&&(Nt.setOptional(P,H,"batchingTexture"),Nt.setValue(P,"batchingTexture",H._matricesTexture,ge),Nt.setOptional(P,H,"batchingIdTexture"),Nt.setValue(P,"batchingIdTexture",H._indirectTexture,ge),Nt.setOptional(P,H,"batchingColorTexture"),H._colorsTexture!==null&&Nt.setValue(P,"batchingColorTexture",H._colorsTexture,ge));let $n=q.morphAttributes;if(($n.position!==void 0||$n.normal!==void 0||$n.color!==void 0)&&le.update(H,q,Ln),(Nn||Ve.receiveShadow!==H.receiveShadow)&&(Ve.receiveShadow=H.receiveShadow,Nt.setValue(P,"receiveShadow",H.receiveShadow)),Z.isMeshGouraudMaterial&&Z.envMap!==null&&(Wn.envMap.value=Ce,Wn.flipEnvMap.value=Ce.isCubeTexture&&Ce.isRenderTargetTexture===!1?-1:1),Z.isMeshStandardMaterial&&Z.envMap===null&&k.environment!==null&&(Wn.envMapIntensity.value=k.environmentIntensity),Nn&&(Nt.setValue(P,"toneMappingExposure",x.toneMappingExposure),Ve.needsLights&&xn(Wn,Kr),fe&&Z.fog===!0&&oe.refreshFogUniforms(Wn,fe),oe.refreshMaterialUniforms(Wn,Z,X,Q,u.state.transmissionRenderTarget[M.id]),zr.upload(P,Ni(Ve),Wn,ge)),Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(zr.upload(P,Ni(Ve),Wn,ge),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&Nt.setValue(P,"center",H.center),Nt.setValue(P,"modelViewMatrix",H.modelViewMatrix),Nt.setValue(P,"normalMatrix",H.normalMatrix),Nt.setValue(P,"modelMatrix",H.matrixWorld),Z.isShaderMaterial||Z.isRawShaderMaterial){let yn=Z.uniformsGroups;for(let Tn=0,qc=yn.length;Tn<qc;Tn++){let ys=yn[Tn];Je.update(ys,Ln),Je.bind(ys,Ln)}}return Ln}function xn(M,k){M.ambientLightColor.needsUpdate=k,M.lightProbe.needsUpdate=k,M.directionalLights.needsUpdate=k,M.directionalLightShadows.needsUpdate=k,M.pointLights.needsUpdate=k,M.pointLightShadows.needsUpdate=k,M.spotLights.needsUpdate=k,M.spotLightShadows.needsUpdate=k,M.rectAreaLights.needsUpdate=k,M.hemisphereLights.needsUpdate=k}function Ui(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(M,k,q){let Z=ce.get(M);Z.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,Z.__autoAllocateDepthBuffer===!1&&(Z.__useRenderToTexture=!1),ce.get(M.texture).__webglTexture=k,ce.get(M.depthTexture).__webglTexture=Z.__autoAllocateDepthBuffer?void 0:q,Z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,k){let q=ce.get(M);q.__webglFramebuffer=k,q.__useDefaultFramebuffer=k===void 0};let yi=P.createFramebuffer();this.setRenderTarget=function(M,k=0,q=0){L=M,w=k,C=q;let Z=!0,H=null,fe=!1,Se=!1;if(M){let Ce=ce.get(M);if(Ce.__useDefaultFramebuffer!==void 0)te.bindFramebuffer(P.FRAMEBUFFER,null),Z=!1;else if(Ce.__webglFramebuffer===void 0)ge.setupRenderTarget(M);else if(Ce.__hasExternalTextures)ge.rebindTextures(M,ce.get(M.texture).__webglTexture,ce.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let He=M.depthTexture;if(Ce.__boundDepthTexture!==He){if(He!==null&&ce.has(He)&&(M.width!==He.image.width||M.height!==He.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ge.setupDepthRenderbuffer(M)}}let $e=M.texture;($e.isData3DTexture||$e.isDataArrayTexture||$e.isCompressedArrayTexture)&&(Se=!0);let Ye=ce.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ye[k])?H=Ye[k][q]:H=Ye[k],fe=!0):M.samples>0&&ge.useMultisampledRTT(M)===!1?H=ce.get(M).__webglMultisampledFramebuffer:Array.isArray(Ye)?H=Ye[q]:H=Ye,I.copy(M.viewport),W.copy(M.scissor),$=M.scissorTest}else I.copy(Ee).multiplyScalar(X).floor(),W.copy(Xe).multiplyScalar(X).floor(),$=nt;if(q!==0&&(H=yi),te.bindFramebuffer(P.FRAMEBUFFER,H)&&Z&&te.drawBuffers(M,H),te.viewport(I),te.scissor(W),te.setScissorTest($),fe){let Ce=ce.get(M.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+k,Ce.__webglTexture,q)}else if(Se){let Ce=k;for(let $e=0;$e<M.textures.length;$e++){let Ye=ce.get(M.textures[$e]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+$e,Ye.__webglTexture,q,Ce)}}else if(M!==null&&q!==0){let Ce=ce.get(M.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Ce.__webglTexture,q)}v=-1},this.readRenderTargetPixels=function(M,k,q,Z,H,fe,Se,Ne=0){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=ce.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Se!==void 0&&(Ce=Ce[Se]),Ce){te.bindFramebuffer(P.FRAMEBUFFER,Ce);try{let $e=M.textures[Ne],Ye=$e.format,He=$e.type;if(!K.textureFormatReadable(Ye)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!K.textureTypeReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=M.width-Z&&q>=0&&q<=M.height-H&&(M.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Ne),P.readPixels(k,q,Z,H,Fe.convert(Ye),Fe.convert(He),fe))}finally{let $e=L!==null?ce.get(L).__webglFramebuffer:null;te.bindFramebuffer(P.FRAMEBUFFER,$e)}}},this.readRenderTargetPixelsAsync=async function(M,k,q,Z,H,fe,Se,Ne=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=ce.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Se!==void 0&&(Ce=Ce[Se]),Ce)if(k>=0&&k<=M.width-Z&&q>=0&&q<=M.height-H){te.bindFramebuffer(P.FRAMEBUFFER,Ce);let $e=M.textures[Ne],Ye=$e.format,He=$e.type;if(!K.textureFormatReadable(Ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!K.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let lt=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,lt),P.bufferData(P.PIXEL_PACK_BUFFER,fe.byteLength,P.STREAM_READ),M.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Ne),P.readPixels(k,q,Z,H,Fe.convert(Ye),Fe.convert(He),0);let St=L!==null?ce.get(L).__webglFramebuffer:null;te.bindFramebuffer(P.FRAMEBUFFER,St);let zt=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Nf(P,zt,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,lt),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,fe),P.deleteBuffer(lt),P.deleteSync(zt),fe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,k=null,q=0){let Z=Math.pow(2,-q),H=Math.floor(M.image.width*Z),fe=Math.floor(M.image.height*Z),Se=k!==null?k.x:0,Ne=k!==null?k.y:0;ge.setTexture2D(M,0),P.copyTexSubImage2D(P.TEXTURE_2D,q,0,0,Se,Ne,H,fe),te.unbindTexture()};let Fi=P.createFramebuffer(),Ys=P.createFramebuffer();this.copyTextureToTexture=function(M,k,q=null,Z=null,H=0,fe=null){fe===null&&(H!==0?(Mr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),fe=H,H=0):fe=0);let Se,Ne,Ce,$e,Ye,He,lt,St,zt,Pt=M.isCompressedTexture?M.mipmaps[fe]:M.image;if(q!==null)Se=q.max.x-q.min.x,Ne=q.max.y-q.min.y,Ce=q.isBox3?q.max.z-q.min.z:1,$e=q.min.x,Ye=q.min.y,He=q.isBox3?q.min.z:0;else{let $n=Math.pow(2,-H);Se=Math.floor(Pt.width*$n),Ne=Math.floor(Pt.height*$n),M.isDataArrayTexture?Ce=Pt.depth:M.isData3DTexture?Ce=Math.floor(Pt.depth*$n):Ce=1,$e=0,Ye=0,He=0}Z!==null?(lt=Z.x,St=Z.y,zt=Z.z):(lt=0,St=0,zt=0);let wt=Fe.convert(k.format),Ve=Fe.convert(k.type),Lt;k.isData3DTexture?(ge.setTexture3D(k,0),Lt=P.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(ge.setTexture2DArray(k,0),Lt=P.TEXTURE_2D_ARRAY):(ge.setTexture2D(k,0),Lt=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,k.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,k.unpackAlignment);let dt=P.getParameter(P.UNPACK_ROW_LENGTH),Ln=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Zs=P.getParameter(P.UNPACK_SKIP_PIXELS),Nn=P.getParameter(P.UNPACK_SKIP_ROWS),Kr=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,Pt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Pt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,$e),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ye),P.pixelStorei(P.UNPACK_SKIP_IMAGES,He);let Nt=M.isDataArrayTexture||M.isData3DTexture,Wn=k.isDataArrayTexture||k.isData3DTexture;if(M.isDepthTexture){let $n=ce.get(M),yn=ce.get(k),Tn=ce.get($n.__renderTarget),qc=ce.get(yn.__renderTarget);te.bindFramebuffer(P.READ_FRAMEBUFFER,Tn.__webglFramebuffer),te.bindFramebuffer(P.DRAW_FRAMEBUFFER,qc.__webglFramebuffer);for(let ys=0;ys<Ce;ys++)Nt&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,ce.get(M).__webglTexture,H,He+ys),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,ce.get(k).__webglTexture,fe,zt+ys)),P.blitFramebuffer($e,Ye,Se,Ne,lt,St,Se,Ne,P.DEPTH_BUFFER_BIT,P.NEAREST);te.bindFramebuffer(P.READ_FRAMEBUFFER,null),te.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(H!==0||M.isRenderTargetTexture||ce.has(M)){let $n=ce.get(M),yn=ce.get(k);te.bindFramebuffer(P.READ_FRAMEBUFFER,Fi),te.bindFramebuffer(P.DRAW_FRAMEBUFFER,Ys);for(let Tn=0;Tn<Ce;Tn++)Nt?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,$n.__webglTexture,H,He+Tn):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,$n.__webglTexture,H),Wn?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,yn.__webglTexture,fe,zt+Tn):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,yn.__webglTexture,fe),H!==0?P.blitFramebuffer($e,Ye,Se,Ne,lt,St,Se,Ne,P.COLOR_BUFFER_BIT,P.NEAREST):Wn?P.copyTexSubImage3D(Lt,fe,lt,St,zt+Tn,$e,Ye,Se,Ne):P.copyTexSubImage2D(Lt,fe,lt,St,$e,Ye,Se,Ne);te.bindFramebuffer(P.READ_FRAMEBUFFER,null),te.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else Wn?M.isDataTexture||M.isData3DTexture?P.texSubImage3D(Lt,fe,lt,St,zt,Se,Ne,Ce,wt,Ve,Pt.data):k.isCompressedArrayTexture?P.compressedTexSubImage3D(Lt,fe,lt,St,zt,Se,Ne,Ce,wt,Pt.data):P.texSubImage3D(Lt,fe,lt,St,zt,Se,Ne,Ce,wt,Ve,Pt):M.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,fe,lt,St,Se,Ne,wt,Ve,Pt.data):M.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,fe,lt,St,Pt.width,Pt.height,wt,Pt.data):P.texSubImage2D(P.TEXTURE_2D,fe,lt,St,Se,Ne,wt,Ve,Pt);P.pixelStorei(P.UNPACK_ROW_LENGTH,dt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Ln),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Zs),P.pixelStorei(P.UNPACK_SKIP_ROWS,Nn),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Kr),fe===0&&k.generateMipmaps&&P.generateMipmap(Lt),te.unbindTexture()},this.initRenderTarget=function(M){ce.get(M).__webglFramebuffer===void 0&&ge.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?ge.setTextureCube(M,0):M.isData3DTexture?ge.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?ge.setTexture2DArray(M,0):ge.setTexture2D(M,0),te.unbindTexture()},this.resetState=function(){w=0,C=0,L=null,te.reset(),ye.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return hi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=ut._getDrawingBufferColorSpace(e),t.unpackColorSpace=ut._getUnpackColorSpace()}};function xp(i,e,t,n={face:"#304878",edge:"#e1c17c",text:"#fff1cc"}){let s=new Hr({alpha:!0,antialias:!0});s.setPixelRatio(Math.min(devicePixelRatio,2)),s.setSize(112,112),i.prepend(s.domElement);let r=s.domElement;r.tabIndex=0,r.setAttribute("role","img"),r.setAttribute("aria-label","View cube: click a face, edge or corner; drag to rotate. Arrow keys rotate, Home restores perspective. / \u89C6\u56FE\u7ACB\u65B9\u4F53\uFF1A\u70B9\u51FB\u9762\u3001\u8FB9\u3001\u89D2\u6216\u62D6\u52A8\u65CB\u8F6C");let o=new Ds,a=new on(32,1,.1,20);a.up.set(0,0,1);let l=["RIGHT","LEFT","BACK","FRONT","TOP","BOTTOM"],c=["\u53F3","\u5DE6","\u540E","\u524D","\u9876","\u5E95"],h="",d=l.map(()=>{let x=document.createElement("canvas");return x.width=x.height=128,new cs(x)}),m=d.map(x=>new fn({map:x})),f=new Mt(new Wt(1,1,1),m);o.add(f),o.add(new Wi(new Ls(f.geometry),new Bn({color:n.edge})));let g=new Xo,_=new ae,p=null,u=!1;function b(x){let T=e.position.distanceTo(t.target);e.position.copy(t.target).add(x.normalize().multiplyScalar(T)),e.lookAt(t.target),t.update()}function E(x,T){let w=new ds().setFromVector3(e.position.clone().sub(t.target).applyAxisAngle(new D(1,0,0),-Math.PI/2));w.theta-=x,w.phi=Math.max(.001,Math.min(Math.PI-.001,w.phi+T)),b(new D().setFromSpherical(w).applyAxisAngle(new D(1,0,0),Math.PI/2))}return r.addEventListener("pointerdown",x=>{p={x:x.clientX,y:x.clientY,lastX:x.clientX,lastY:x.clientY},u=!1,r.setPointerCapture(x.pointerId)}),r.addEventListener("pointermove",x=>{p&&(Math.hypot(x.clientX-p.x,x.clientY-p.y)>4&&(u=!0),u&&E((x.clientX-p.lastX)*.012,(x.clientY-p.lastY)*.012),p.lastX=x.clientX,p.lastY=x.clientY)}),r.addEventListener("pointerup",x=>{if(p){if(!u){let T=r.getBoundingClientRect();_.set((x.clientX-T.left)/T.width*2-1,-(x.clientY-T.top)/T.height*2+1),g.setFromCamera(_,a);let w=g.intersectObject(f)[0];if(w){let C=w.point,L=new D(...[C.x,C.y,C.z].map(v=>Math.abs(v)>.34?Math.sign(v):0));Math.abs(L.z)===1&&L.x===0&&L.y===0&&(L.y=-.001),b(L)}}p=null}}),r.addEventListener("pointercancel",()=>{p=null}),r.addEventListener("keydown",x=>{["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","Enter"].includes(x.key)&&(x.preventDefault(),x.key==="Home"?b(new D(430,-645,445)):x.key==="Enter"?b(new D(0,-1,0)):E(x.key==="ArrowLeft"?Math.PI/2:x.key==="ArrowRight"?-Math.PI/2:0,x.key==="ArrowUp"?-.35:x.key==="ArrowDown"?.35:0))}),{update(){h!==document.documentElement.lang&&(h=document.documentElement.lang,d.forEach((x,T)=>{let w=x.image.getContext("2d");w.fillStyle=n.face,w.fillRect(0,0,128,128),w.strokeStyle=n.edge,w.lineWidth=5,w.strokeRect(3,3,122,122),w.fillStyle=n.text,w.font="bold 21px Segoe UI",w.textAlign="center",w.textBaseline="middle",w.fillText(h.startsWith("zh")?c[T]:l[T],64,64),x.needsUpdate=!0})),a.position.copy(e.position).sub(t.target).normalize().multiplyScalar(3.6),a.lookAt(0,0,0),s.render(o,a)}}}var yp={type:"change"},Du={type:"start"},bp={type:"end"},Rc=new as,vp=new Zn,iv=Math.cos(70*cu.DEG2RAD),nn=new D,Pn=2*Math.PI,Et={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Iu=1e-6,Cc=class extends Zo{constructor(e,t=null){super(e,t),this.state=Et.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:fs.ROTATE,MIDDLE:fs.DOLLY,RIGHT:fs.PAN},this.touches={ONE:ps.ROTATE,TWO:ps.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new Jn,this._lastTargetPosition=new D,this._quat=new Jn().setFromUnitVectors(e.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ds,this._sphericalDelta=new ds,this._scale=1,this._panOffset=new D,this._rotateStart=new ae,this._rotateEnd=new ae,this._rotateDelta=new ae,this._panStart=new ae,this._panEnd=new ae,this._panDelta=new ae,this._dollyStart=new ae,this._dollyEnd=new ae,this._dollyDelta=new ae,this._dollyDirection=new D,this._mouse=new ae,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=rv.bind(this),this._onPointerDown=sv.bind(this),this._onPointerUp=ov.bind(this),this._onContextMenu=fv.bind(this),this._onMouseWheel=cv.bind(this),this._onKeyDown=hv.bind(this),this._onTouchStart=uv.bind(this),this._onTouchMove=dv.bind(this),this._onMouseDown=av.bind(this),this._onMouseMove=lv.bind(this),this._interceptControlDown=pv.bind(this),this._interceptControlUp=mv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(yp),this.update(),this.state=Et.NONE}update(e=null){let t=this.object.position;nn.copy(t).sub(this.target),nn.applyQuaternion(this._quat),this._spherical.setFromVector3(nn),this.autoRotate&&this.state===Et.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Pn:n>Math.PI&&(n-=Pn),s<-Math.PI?s+=Pn:s>Math.PI&&(s-=Pn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(nn.setFromSpherical(this._spherical),nn.applyQuaternion(this._quatInverse),t.copy(this.target).add(nn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=nn.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new D(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new D(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=nn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Rc.origin.copy(this.object.position),Rc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Rc.direction))<iv?this.object.lookAt(this.target):(vp.setFromNormalAndCoplanarPoint(this.object.up,this.target),Rc.intersectPlane(vp,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Iu||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Iu||this._lastTargetPosition.distanceToSquared(this.target)>Iu?(this.dispatchEvent(yp),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Pn/60*this.autoRotateSpeed*e:Pn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){nn.setFromMatrixColumn(t,0),nn.multiplyScalar(-e),this._panOffset.add(nn)}_panUp(e,t){this.screenSpacePanning===!0?nn.setFromMatrixColumn(t,1):(nn.setFromMatrixColumn(t,0),nn.crossVectors(this.object.up,nn)),nn.multiplyScalar(e),this._panOffset.add(nn)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;nn.copy(s).sub(this.target);let r=nn.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Pn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Pn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Pn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Pn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Pn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Pn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Pn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Pn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ae,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function sv(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function rv(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function ov(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(bp),this.state=Et.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function av(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case fs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Et.DOLLY;break;case fs.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Et.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Et.ROTATE}break;case fs.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Et.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Et.PAN}break;default:this.state=Et.NONE}this.state!==Et.NONE&&this.dispatchEvent(Du)}function lv(i){switch(this.state){case Et.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Et.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Et.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function cv(i){this.enabled===!1||this.enableZoom===!1||this.state!==Et.NONE||(i.preventDefault(),this.dispatchEvent(Du),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(bp))}function hv(i){this.enabled!==!1&&this._handleKeyDown(i)}function uv(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case ps.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Et.TOUCH_ROTATE;break;case ps.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Et.TOUCH_PAN;break;default:this.state=Et.NONE}break;case 2:switch(this.touches.TWO){case ps.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Et.TOUCH_DOLLY_PAN;break;case ps.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Et.TOUCH_DOLLY_ROTATE;break;default:this.state=Et.NONE}break;default:this.state=Et.NONE}this.state!==Et.NONE&&this.dispatchEvent(Du)}function dv(i){switch(this._trackPointer(i),this.state){case Et.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Et.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Et.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Et.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Et.NONE}}function fv(i){this.enabled!==!1&&i.preventDefault()}function pv(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function mv(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Mp(i){let e=document.documentElement.dataset?.edition==="public",t=(F,O)=>e?O:F,n=new Ds,s=t("#143451","#dedede");n.background=new Qe(s),n.fog=new To(s,1e3,2200);let r=new on(36,1,1,3e3);r.up.set(0,0,1),r.position.set(500,-630,480);let o=new Hr({antialias:!0,alpha:!1});o.setPixelRatio(Math.min(devicePixelRatio,2)),o.shadowMap.enabled=!0,o.shadowMap.type=Dl,o.outputColorSpace=un,i.prepend(o.domElement),o.domElement.setAttribute("aria-label","Interactive 3D robot arm. Joint angles and tool coordinates are available in the controls.");let a=new Cc(r,o.domElement);a.target.set(55,0,90),a.enableDamping=!0,a.minDistance=350,a.maxDistance=1600,a.maxPolarAngle=Math.PI-.001,n.add(new Go(16777215,t(6584993,8947848),2.5));let l=new $o(16777215,3);l.position.set(-200,-300,650),l.castShadow=!0,l.shadow.mapSize.set(2048,2048),Object.assign(l.shadow.camera,{left:-500,right:500,top:500,bottom:-500,near:1,far:1200}),l.shadow.bias=-.001,n.add(l);let c={body:new Cn({color:15790836,roughness:.34,metalness:.16}),joint:new Cn({color:14804457,roughness:.32,metalness:.24}),accent:new Cn({color:t(16021281,3355443),roughness:.38,metalness:.12}),metal:new Cn({color:t(3752526,3881787),metalness:.65,roughness:.3})};function h(F,O){let B=new Mt(F,O);return B.castShadow=!0,B.receiveShadow=!0,n.add(B),B}let d=h(new Us(3e3,3e3),new Cn({color:t(2312550,13816530),roughness:1}));d.position.z=-2;let m=new qo(900,18,t(9149092,9605778),t(4548480,11579568));m.rotation.x=Math.PI/2,m.position.z=.1,n.add(m);let f=F=>new D(...F);function g(F,O){let B=new ls(new At().setFromPoints(F.map(f)),new Bn({color:O}));return n.add(B),B}g([[0,0,1],[360,0,1]],t(11954256,15219281)),g([[0,0,1],[0,360,1]],t(5801579,35178)),g([[0,0,0],[0,0,340]],t(7574969,1400559));function _(F,O,B){let ie=document.createElement("canvas");ie.width=128,ie.height=64;let ve=ie.getContext("2d");ve.font="600 36px Segoe UI",ve.fillStyle=O,ve.textAlign="center",ve.fillText(F,64,44);let we=new Ro(new Tr({map:new cs(ie),depthTest:!1}));return we.position.copy(f(B)),we.scale.set(50,25,1),n.add(we),we}_("X",t("#a66552","#bf1833"),[385,0,5]),_("Y",t("#54795c","#006b51"),[0,385,5]),_("Z",t("#597c9a","#1550b9"),[0,0,360]);let p=h(new Ht(47,49,10,64),c.metal);p.rotation.x=Math.PI/2,p.position.z=5;let u=h(new Ht(27,32,30,48),c.body);u.rotation.x=Math.PI/2,u.position.z=25;let b=h(new Ht(29,29,6,48),c.metal);b.rotation.x=Math.PI/2,b.position.z=43;let E=new dn;n.add(E);let x=new Cr;x.moveTo(-15,44),x.lineTo(15,44),x.lineTo(15,70),x.absarc(0,70,15,0,Math.PI,!1),x.lineTo(-15,44);for(let F of[-1,1]){let O=new Mt(new ko(x,{depth:8,bevelEnabled:!0,bevelThickness:.6,bevelSize:.6,bevelSegments:2,steps:1,curveSegments:24}),c.body);O.rotation.x=Math.PI/2,O.position.y=F*27+4,O.castShadow=!0,E.add(O);let B=new Mt(new Ht(9,9,10,32),c.metal);B.position.set(0,F*22,70),E.add(B);let ie=new Mt(new Ht(10,10,2,32),c.accent);ie.position.set(0,F*32.5,70),E.add(ie)}let T=h(new Ht(32.5,32.5,5,48),c.accent);T.rotation.x=Math.PI/2,T.position.z=15;for(let F=0;F<6;F++){let O=F*Math.PI/3,B=h(new Ht(2.6,2.6,2,6),c.metal);B.rotation.x=Math.PI/2,B.position.set(41*Math.cos(O),41*Math.sin(O),11)}let w=[],C=[],L=[],v=0;function S(F){if(v!==F){for(let O of[...w,...C,...L])n.remove(O),O.traverse(B=>B.geometry?.dispose());v=F,w=Array.from({length:F-1},(O,B)=>{let ie=Math.max(9,18-B*2);return h(new zo([[0,-.5],[ie*.8,-.5],[ie,-.46],[ie,.46],[ie*.8,.5],[0,.5]].map(([ve,we])=>new ae(ve,we)),48),c.body)}),C=Array.from({length:F-1},(O,B)=>h(new Ht(Math.max(13,23-B*2),Math.max(13,23-B*2),B<2?39:29,32),c.joint)),L=Array.from({length:F-1},(O,B)=>{let ie=Math.max(13,23-B*2)-2,ve=B<2?40:30,we=h(new Ht(ie,ie,ve,48),c.accent);for(let Oe of[-1,1]){let We=new Mt(new Ht(ie*.73,ie*.73,1.2,48),c.joint);We.position.y=Oe*(ve/2+.6),We.castShadow=!0,we.add(We);for(let Be=0;Be<4;Be++){let Ge=Be*Math.PI/2+Math.PI/4,je=new Mt(new Ht(1.2,1.2,1.5,6),c.metal);je.position.set(ie*.51*Math.cos(Ge),Oe*(ve/2+1.3),ie*.51*Math.sin(Ge)),we.add(je)}}return we}),re.scale.setScalar(da(F)/300),Ae=[],J.geometry.dispose(),J.geometry=new At,Je("iso"),o.domElement.dataset.joints=String(F)}}let I=h(new Kn(3,12,8),c.accent),W=new dn;n.add(W);let $=[],Y="",z=!1,G=[],Q=it(Un.home),X=new Cn({color:t(6582400,6842472),roughness:.35,metalness:.65}),de=new Cn({color:t(2107185,2368548),roughness:.95}),xe=null;function Ee(F){Y="gripper";function O(ve,we,Oe){let We=new Mt(ve,we);return We.position.set(...Oe),We.castShadow=!0,W.add(We),We}let B=O(new Ht(13,13,4,32),X,[0,0,38]);B.rotation.x=Math.PI/2;let ie=O(new Ht(7,7,8,20),X,[0,0,32]);ie.rotation.x=Math.PI/2,O(new Wt(22,54,12),X,[0,0,23]);for(let ve of[-1,1]){let we=O(new Wt(12,6,32),de,[0,ve*26,3]);we.userData.sign=ve,$.push(we)}}Ee("gripper");let Xe=null,nt=new dn;n.add(nt);let ht=new fn({color:16768837,depthTest:!1}),ct=Array.from({length:12},()=>{let F=new Mt(new Ht(1.8,1.8,1,8),ht);return F.renderOrder=11,nt.add(F),F}),ee=new Mt(new Wt(1,1,1),new fn({color:16768837,transparent:!0,opacity:.12,depthTest:!1,depthWrite:!1}));ee.renderOrder=10,nt.add(ee);let se=_("A","#10203b",[0,0,0]);se.scale.set(36,18,1);let Re=se.material.map.image,Ie=Re.getContext("2d");Ie.fillStyle="#ffdf45",Ie.fillRect(0,0,128,64),Ie.fillStyle="#10203b",Ie.font="bold 48px Segoe UI",Ie.textAlign="center",Ie.fillText("A",64,49),se.material.map.needsUpdate=!0,se.renderOrder=12,se.visible=!1;function Pe(){let F={base:u,j1:u,j2:C[0],j3:C[1],j4:C[2],j5:C[3],j6:C[4],joint:C[0],link:w[0],tool:W,tcp:I}[Xe];if(nt.visible=!!F,se.visible=!1,!F)return;F.updateWorldMatrix(!0,!0);let O=new wi().setFromObject(F).expandByScalar(6),B=O.getCenter(new D),ie=O.getSize(new D);ee.position.copy(B),ee.scale.copy(ie);let ve=0;for(let we=0;we<3;we++)for(let Oe of[0,1])for(let We of[0,1]){let Be=O.min.clone(),Ge=O.min.clone(),je=[0,1,2].filter(Te=>Te!==we);Be.setComponent(je[0],Oe?O.max.getComponent(je[0]):O.min.getComponent(je[0])),Be.setComponent(je[1],We?O.max.getComponent(je[1]):O.min.getComponent(je[1])),Ge.copy(Be),Ge.setComponent(we,O.max.getComponent(we));let Gt=ct[ve++];Gt.position.copy(Be).add(Ge).multiplyScalar(.5),Gt.scale.y=Be.distanceTo(Ge),Gt.quaternion.setFromUnitVectors(new D(0,1,0),Ge.sub(Be).normalize())}se.position.set(B.x,B.y,O.max.z+16)}let rt=new Yo(20);n.add(rt);let xt=g([[0,0,0],[0,0,0]],t(9742222,8750469)),P=h(new Ir(13,1.4,8,40),c.accent);P.position.z=1;let re=h(new Kn(300,36,20),new fn({color:t(7509604,6710886),wireframe:!0,transparent:!0,opacity:.065,depthWrite:!1}));re.position.z=Un.base,re.visible=!1;let ne="",K=[],te=[],me=[];function ce(F){let O=document.createElement("canvas");O.width=384,O.height=144;let B=O.getContext("2d");B.fillStyle=t("#102a42","#f8f8f8"),B.fillRect(0,0,O.width,O.height),B.textAlign="center",B.fillStyle=t("#ffe4ae","#262626"),B.font="bold 58px Segoe UI",B.fillText(F.id,192,58),B.font="bold 33px Segoe UI",B.fillText(F.size.join(" \xD7 ")+" mm",192,112);let ie=new cs(O);return ie.colorSpace=un,ie}let ge=bs;function Ze(){for(let F of K){n.remove(F),F.geometry?.dispose();for(let O of Array.isArray(F.material)?F.material:[F.material])O?.map?.dispose(),O?.dispose()}K=[],te=[],me=[]}function qe(F){if(z=F.output,G=F.objects,ne!==F.mode){let Gt=function(Te,Ke,ze){let yt=h(new Wt(...Te),new Cn({color:ze,roughness:.65}));return yt.position.set(...Ke),K.push(yt),yt};var ie=Gt;Ze(),ne=F.mode;let[Oe,We]=F.size,[Be,Ge]=F.origin,je=F.deck;if(F.mode==="shelf"){for(let Te of F.solids)Gt(Te.max.map((Ke,ze)=>Ke-Te.min[ze]),Te.max.map((Ke,ze)=>(Ke+Te.min[ze])/2),t(6652827,10526880));for(let Te of F.cells){let Ke=_(Te.id,t("#ffe3a5","#333333"),[(Te.min[0]+Te.max[0])/2,66,Te.min[2]+7]);Ke.scale.set(24,12,1),K.push(Ke)}}else{if(Gt([Oe+8,We+8,8],[Be+Oe/2,Ge+We/2,je-4],t(11648976,12369084)),F.mode!=="explore"){Gt([30,We+8,42],[Be+Oe+23,Ge+We/2,23],t(3696523,15790320)),Gt([2,We-10,18],[Be+Oe+39,Ge+We/2,30],t(11457249,6710886));for(let Te of[Be+20,Be+Oe-15])for(let Ke of[Ge-5,Ge+We+5]){let ze=h(new Ht(10,10,8,24),c.metal);ze.position.set(Te,Ke,8),K.push(ze)}}for(let Te=0;Te<=Oe;Te+=20)K.push(g([[Be+Te,Ge,je+.2],[Be+Te,Ge+We,je+.2]],t(5401221,8750469)));for(let Te=0;Te<=We;Te+=20)K.push(g([[Be,Ge+Te,je+.2],[Be+Oe,Ge+Te,je+.2]],t(5401221,8750469)));K.push(g([[Be,Ge,je+.4],[Be+Oe,Ge,je+.4],[Be+Oe,Ge+We,je+.4],[Be,Ge+We,je+.4],[Be,Ge,je+.4]],t(16766090,4539717)))}if(F.person){let ze=function(_n,wn,xn){let Ui=h(_n,new Cn({color:wn,roughness:.7}));return Ui.position.set(Te+xn[0],Ke+xn[1],xn[2]),K.push(Ui),Ui},yt=function(_n,wn,xn,Ui){let yi=f(_n),Fi=f(wn);ze(new Ht(xn,xn,yi.distanceTo(Fi),16),Ui,yi.clone().add(Fi).multiplyScalar(.5).toArray()).quaternion.setFromUnitVectors(new D(0,1,0),Fi.sub(yi).normalize())};var ve=ze,we=yt;let[Te,Ke]=F.person.center;for(let _n of[-1,1])yt([_n*6,0,35],[_n*8,0,7],4,t(3301764,5592405)),ze(new Wt(10,15,6),t(2701381,3355443),[_n*8,-3,3]),yt([_n*11,0,61],[_n*17,-1,39],3.6,14925204),ze(new Kn(4,12,8),14925204,[_n*17,-1,36]);ze(new Kn(1,20,16),t(15056245,16759334),[0,0,51]).scale.set(12,7,17),ze(new Wt(20,12,9),t(3301764,5592405),[0,0,32]),yt([0,0,65],[0,0,70],3.5,14925204),ze(new Kn(7,20,16),14925204,[0,0,76]),ze(new Kn(1,20,12),t(15784354,16766282),[0,0,81]).scale.set(8,8,4),ze(new Wt(23,1,3),16051662,[0,-7,50]);for(let _n of F.solids){let{min:wn,max:xn}=_n,Ui=xn.map((Fi,Ys)=>Fi-wn[Ys]),yi=new Wi(new Ls(new Wt(...Ui)),new Dr({color:t(16760695,13925120),dashSize:4,gapSize:3,transparent:!0,opacity:.65}));yi.position.set(...xn.map((Fi,Ys)=>(Fi+wn[Ys])/2)),yi.computeLineDistances(),n.add(yi),K.push(yi),K.push(g([[wn[0],wn[1],1],[xn[0],wn[1],1],[xn[0],xn[1],1],[wn[0],xn[1],1],[wn[0],wn[1],1]],t(16760695,13925120)))}K.push(_("85 mm",t("#ffe3a5","#333333"),[Te,Ke,F.person.height+13]))}K.push(_(Oe+" mm",t("#ffe3a5","#333333"),[Be+Oe/2,Ge-17,je+2])),K.push(_(We+" mm",t("#ffe3a5","#333333"),[Be-29,Ge+We/2,je+2]));for(let[Te,Ke]of F.objects.entries()){let ze=Gt(Ke.size,Ke.center,ge[Te]);te.push(ze);let yt=ze.material;ze.material=[yt,yt,yt,yt,new Cn({map:ce(Ke),roughness:.8}),yt];let Dn=Gt([Ke.size[0]+6,Ke.size[1]+6,1],[Ke.center[0],Ke.center[1],.5],t(3495795,9605778));Dn.material.transparent=!0,Dn.material.opacity=.65}}F.objects.forEach((Oe,We)=>{let Be=te[We],Ge=Oe.rotation;Be.position.copy(f(Oe.center)),Be.quaternion.setFromRotationMatrix(new gt().set(Ge[0],Ge[1],Ge[2],0,Ge[3],Ge[4],Ge[5],0,Ge[6],Ge[7],Ge[8],0,0,0,0,1))});let O=F.objects.find(Oe=>Oe.id===F.held),B=document.getElementById("held-dimensions");B.hidden=!O,O&&(B.textContent=O.id+" \xB7 "+O.size.join(" \xD7 ")+" mm"),o.domElement.dataset.tool="gripper",o.domElement.dataset.held=F.held||"",o.domElement.dataset.score=String(F.score)}let A=new dn;n.add(A),A.visible=!1;let y=new Mt(new Ir(7,1.4,8,32),new fn({color:t(16767878,13925120),depthTest:!1}));y.renderOrder=35,A.add(y);for(let[F,O]of[[0,t(15846531,15219281)],[1,t(9555435,35178)],[2,t(16777215,1400559)]]){let B=new D;B.setComponent(F,28);let ie=new Lr(B.clone().normalize(),new D,28,O,5,3);A.add(ie)}let V=_("O",t("#ffe4ae","#262626"),[0,0,0]);V.scale.set(25,12,1),V.visible=!1;let j=["+X","+Y","+Z"].map(F=>{let O=_(F,t("#e6d7b6","#333333"),[0,0,0]);return O.scale.set(23,11,1),O.visible=!1,O});function oe(F){A.visible=V.visible=!!F,j.forEach(O=>O.visible=!!F),F&&(A.position.set(...F),A.position.z+=1,V.position.set(F[0]-10,F[1]-12,F[2]+3),j.forEach((O,B)=>{O.position.set(...F),O.position.setComponent(B,F[B]+35)}))}let J=g([],15759396),Ae=[],ue=new dn;n.add(ue);function De(){for(let F of[...ue.children])ue.remove(F),F.traverse(O=>{if(O.geometry?.dispose(),O.material)for(let B of Array.isArray(O.material)?O.material:[O.material])B.dispose()})}function Le(F){if(De(),!F)return;let O=t(7985151,1400559),B=t(16734572,14952006);function ie(Te,Ke,ze=!0){if(Te.length<2)return;let yt=new At().setFromPoints(Te.map(f)),Dn=ze?new Dr({color:Ke,dashSize:6,gapSize:3,depthTest:!1,transparent:!0,opacity:.95}):new Bn({color:Ke,depthTest:!1}),Ni=new ls(yt,Dn);Ni.computeLineDistances(),Ni.renderOrder=30,ue.add(Ni)}for(let Te of F.segments){ie(Te.points,O);let Ke=0;for(let ze=1;ze<Te.points.length;ze++){let yt=f(Te.points[ze-1]),Dn=f(Te.points[ze]);if(Ke+=yt.distanceTo(Dn),Ke>45){let Ni=new Lr(Dn.clone().sub(yt).normalize(),yt,13,O,6,4);ue.add(Ni),Ke=0}}Te.error&&Te.blockedPoint&&Te.target&&ie([Te.blockedPoint,Te.target],B)}let ve=F.ghost;if(!ve)return;let we=it(ve.q),Oe=F.error?B:O,We=new dn;ue.add(We);function Be(Te,Ke,ze=We){let yt=new Mt(Te,new fn({color:Oe,transparent:!0,opacity:.22,depthWrite:!1,depthTest:!1}));return yt.position.copy(f(Ke)),yt.renderOrder=28,ze.add(yt),yt}for(let Te=1;Te<we.points.length;Te++){let Ke=f(we.points[Te-1]),ze=f(we.points[Te]);Be(new Ht(Math.max(9,20-Te*2),Math.max(9,20-Te*2),Ke.distanceTo(ze),12),Ke.clone().add(ze).multiplyScalar(.5).toArray()).quaternion.setFromUnitVectors(new D(0,1,0),ze.sub(Ke).normalize())}let Ge=new dn;We.add(Ge),Ge.position.copy(f(we.tip));let je=we.rotation;Ge.quaternion.setFromRotationMatrix(new gt().set(je[0],je[1],je[2],0,je[3],je[4],je[5],0,je[6],je[7],je[8],0,0,0,0,1)),Be(new Wt(22,54,12),[0,0,23],Ge),Be(new Wt(26,26,16),[0,0,34],Ge);let Gt=jc(ve.payload?[ve.payload]:[],we);for(let Te of[-1,1])Be(new Wt(12,6,32),[0,ve.output?Gt[Te<0?0:1]:Te*ln.open,3],Ge);if(ve.payload){let Te=ve.payload,Ke=Be(new Wt(...Te.size),Te.center),ze=Te.rotation;Ke.quaternion.setFromRotationMatrix(new gt().set(ze[0],ze[1],ze[2],0,ze[3],ze[4],ze[5],0,ze[6],ze[7],ze[8],0,0,0,0,1))}if(F.error){let Te=ve.blockedPoint||we.tip,Ke=new Mt(new Kn(11,16,12),new fn({color:B,wireframe:!0,depthTest:!1}));Ke.position.copy(f(Te)),Ke.renderOrder=33,ue.add(Ke);for(let ze of[-1,1])ie([[Te[0]-8,Te[1],Te[2]-ze*8],[Te[0]+8,Te[1],Te[2]+ze*8]],B,!1)}}let le=new dn;n.add(le),le.visible=!1;let Me=new Mt(new Kn(5,16,12),new fn({color:t(16768902,13925120),wireframe:!0,depthTest:!1}));le.add(Me);let ke=g([[0,0,0],[0,0,0]],t(16768902,13925120));ke.visible=!1;function Fe(F){le.visible=ke.visible=!!F,F&&(le.position.set(...F),ke.geometry.dispose(),ke.geometry=new At().setFromPoints([f(F),f([F[0],F[1],0])]))}function ye(F,O=!0){S(F.length);let B=it(F),ie=B.tip,ve=B.points;Q=B,E.rotation.z=F[0]*Math.PI/180,w.forEach((We,Be)=>{let Ge=f(ve[Be]),je=f(ve[Be+1]),Gt=je.clone().sub(Ge).normalize();Be===0&&(Ge.addScaledVector(Gt,22),je.addScaledVector(Gt,-20)),We.position.copy(Ge).add(je).multiplyScalar(.5),We.scale.y=Ge.distanceTo(je),We.quaternion.setFromUnitVectors(new D(0,1,0),Gt)}),C.forEach((We,Be)=>{We.position.copy(f(B.origins[Be+1])),We.quaternion.setFromUnitVectors(new D(0,1,0),f(B.axes[Be+1])),L[Be].position.copy(We.position),L[Be].quaternion.copy(We.quaternion)}),I.position.copy(f(ie)),W.position.copy(f(ie));let we=B.rotation,Oe=new gt().set(we[0],we[1],we[2],0,we[3],we[4],we[5],0,we[6],we[7],we[8],0,0,0,0,1);W.quaternion.setFromRotationMatrix(Oe),rt.position.copy(W.position),rt.quaternion.copy(W.quaternion),xt.geometry.dispose(),xt.geometry=new At().setFromPoints([f(ie),f([ie[0],ie[1],0])]),P.position.set(ie[0],ie[1],1),O&&(!Ae.length||f(ie).distanceTo(Ae.at(-1))>1.5)&&(Ae.push(f(ie)),Ae.length>1400&&Ae.shift(),J.geometry.dispose(),J.geometry=new At().setFromPoints(Ae))}function Je(F){let O=Math.max(1,da(v)/440);a.target.set(150,0,55),r.position.set(...F==="top"?[150,-.1,730*O]:F==="side"?[40,-1e3*O,110]:[510*O,-560*O,475*O]),a.update()}let U=()=>{let{width:F,height:O}=i.getBoundingClientRect();o.setSize(F,O,!1),r.aspect=F/O,r.fov=F/O<1.1?52:39,r.clearViewOffset(),r.updateProjectionMatrix()};new ResizeObserver(U).observe(i);let _e=xp(document.getElementById("view-cube"),r,a,e?{face:"#f5f5f5",edge:"#555555",text:"#222222"}:void 0);return o.setAnimationLoop(()=>{Pe(),_e.update();let F=jc(G,Q);for(let O of $){let B=O.userData.sign,ie=F[B<0?0:1],ve=z?ie:B*ln.open,we=O.position.y+(ve-O.position.y)*.16;O.position.y=B<0?Math.min(we,ie):Math.max(we,ie)}o.domElement.dataset.jawGap=$.length?String($[1].position.y-$[0].position.y-ln.thickness):"",xe&&(xe.visible=z&&Y!=="gripper"),a.update(),o.render(n,r)}),ye(Un.home),{pose:ye,configure:S,view:Je,taskState:qe,setTarget:Fe,setWorkFrame:oe,setMotionPreview:Le,setPreviewVisible(F){ue.visible=F},setQuizTarget(F){Xe=F,Pe()},setTrail(F){J.visible=F,o.domElement.dataset.trailVisible=String(F)},setReach:F=>re.visible=F,clearTrail(){Ae=[],J.geometry.dispose(),J.geometry=new At},targets(){}}}var Ii=i=>[...i.origin,i.deck],Ws=(i,e)=>i.map((t,n)=>t-e[n]),Pc=(i,e)=>i.map((t,n)=>t+e[n]);function Sp(i,e,t=0){let[n,s]=t%180===0?e:[e[1],e[0],e[2]];return[i[0]+n/2,i[1]+s/2,e[2]]}function Ep(i,e,t){return e?i.p?e.type==="move"&&Math.hypot(...i.p.map((n,s)=>n-e.p[s]))<3:typeof i.on!="boolean"||e.type!=="grip"||e.on!==i.on||t.output!==i.on?!1:i.on?t.input:!t.input&&t.score===1:!1}var N=i=>document.getElementById(i),R=(i,e)=>In==="zh"?e:i,$r=i=>String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),In=localStorage.getItem("cargo-language")||"zh",Xt="xyz",he=new ii,tt=Ki(),pt=[],Yi={},Gr={},xs=!1,Oc=!1,zu=!1,Bc=!1,Hn="A",Xr={},qr="",Ue=null,ei=null,Ic=null,Dc=null,Ct=()=>he.spec.mode==="explore",Xs="move",Hu=null,Lc="",Vt="keep",Vn="linear",qt="robot",Gn=!1,mi=null,Vu=()=>qt==="bed"?Ii(he.spec):[0,0,0],jr=i=>Ws(i,Vu()),Sn=i=>Math.abs(i)<.05?0:Math.round(i*10)/10,$t=it(tt).tip.map(i=>Math.round(i*10)/10),an=0,$s=0,Rt=!1,gi=!1,at=null,Nc=-1,mt=-1,oa="ready",Zt=0,_i=[!1,!1,!1,!1,!1],Mn=!1,Uc=[null,null,null],ia="",_s=[],mn=-1,Wr=null,kt=Mp(N("viewport")),jt=N("modal"),gv=dd({translate:R,highlightPart:i=>kt.setQuizTarget(i),showPrompt:i=>{i?(N("guide").hidden=!1,N("guide").innerHTML=`<strong>${R("Learning prompt","\u5B66\u4E60\u63D0\u793A")}</strong><p>${R("Next: move above box A, then record the position. Approaching from above gives the box clearance.","\u4E0B\u4E00\u6B65\uFF1A\u79FB\u52A8\u5230\u7BB1\u5B50 A \u4E0A\u65B9\uFF0C\u7136\u540E\u8BB0\u5F55\u4F4D\u7F6E\u3002\u4ECE\u4E0A\u65B9\u63A5\u8FD1\u53EF\u7559\u51FA\u51C0\u7A7A\u3002")}</p>`):N("guide").hidden=!0},restorePrompt:()=>Bt()}),Yr={released:["Box released on the floor. Choose your next move.","\u7BB1\u5B50\u5DF2\u653E\u5728\u5730\u9762\u4E0A\u3002\u53EF\u4EE5\u7EE7\u7EED\u63A2\u7D22\u3002"],orientation:["This position can be reached with another orientation. Try Allow rotation, then inspect the preview.","\u6B64\u4F4D\u7F6E\u53EF\u7528\u5176\u4ED6\u671D\u5411\u5230\u8FBE\u3002\u8BF7\u5C1D\u8BD5\u201C\u5141\u8BB8\u65CB\u8F6C\u201D\uFF0C\u7136\u540E\u68C0\u67E5\u9884\u89C8\u3002"],solve:["The solver could not find a motion for these settings. Try joint movement to the target or a nearer intermediate position. This does not prove the position is impossible.","\u6C42\u89E3\u5668\u672A\u627E\u5230\u7B26\u5408\u8BBE\u7F6E\u7684\u8FD0\u52A8\u3002\u8BF7\u5C1D\u8BD5\u201C\u5173\u8282\u8FD0\u52A8\u81F3\u76EE\u6807\u201D\u6216\u66F4\u8FD1\u7684\u4E2D\u95F4\u4F4D\u7F6E\u3002\u8FD9\u5E76\u4E0D\u8BC1\u660E\u76EE\u6807\u4E0D\u53EF\u8FBE\u3002"],obstacle:["Movement blocked by the person\u2019s marked obstacle zone. Compare the movement with the tool and load dimensions.","\u79FB\u52A8\u88AB\u4EBA\u7269\u6807\u793A\u533A\u57DF\u963B\u6B62\u3002\u8BF7\u5BF9\u7167\u5F53\u524D\u79FB\u52A8\u4E0E\u5DE5\u5177\u3001\u8D27\u7269\u5C3A\u5BF8\u3002"],support:["This placement is unsupported or above the two-level limit. The box stays held.","\u6B64\u4F4D\u7F6E\u7F3A\u5C11\u5B8C\u6574\u652F\u6491\uFF0C\u6216\u8D85\u8FC7\u4E24\u5C42\u9650\u5236\u3002\u7BB1\u5B50\u4FDD\u6301\u5939\u6301\u3002"],supportsLoad:["This box supports another box. Remove the upper box first.","\u6B64\u7BB1\u652F\u6491\u7740\u53E6\u4E00\u7BB1\u3002\u8BF7\u5148\u79FB\u8D70\u4E0A\u65B9\u7BB1\u5B50\u3002"],fingers:["Movement blocked: gripper contact. Compare the tool dimensions with your arrangement and route.","\u79FB\u52A8\u88AB\u963B\u6B62\uFF1A\u5939\u722A\u53D1\u751F\u63A5\u89E6\u3002\u8BF7\u5BF9\u7167\u5DE5\u5177\u5C3A\u5BF8\u68C0\u67E5\u6392\u5217\u4E0E\u8DEF\u7EBF\u3002"],shelfCollision:["Shelf contact ahead. Use the front opening; withdraw out of the cubby before changing levels.","\u524D\u65B9\u4F1A\u78B0\u5230\u8D27\u67B6\u3002\u8BF7\u4ECE\u6B63\u9762\u8FDB\u5165\uFF1B\u6362\u5C42\u524D\u5148\u9000\u51FA\u683C\u53E3\u3002"],wrongCell:["Box released in a different cubby. Match the box letter to its cubby.","\u7BB1\u5B50\u5DF2\u91CA\u653E\uFF0C\u4F46\u683C\u53E3\u4E0D\u5339\u914D\u3002\u8BF7\u5C06\u7BB1\u5B50\u5B57\u6BCD\u4E0E\u683C\u53E3\u5BF9\u5E94\u3002"],planNeeded:["Commit your placement plan before starting the task.","\u5F00\u59CB\u4EFB\u52A1\u524D\uFF0C\u8BF7\u63D0\u4EA4\u653E\u7F6E\u65B9\u6848\u3002"],edge:["The box overhangs the truck. It stays held. Lift and bring its full footprint inside.","\u7BB1\u5B50\u8D85\u51FA\u8F66\u53A2\u8FB9\u754C\uFF0C\u4ECD\u4FDD\u6301\u5939\u6301\u3002\u8BF7\u62AC\u5347\u540E\u5C06\u6574\u4E2A\u5E95\u9762\u79FB\u5165\u8F66\u53A2\u3002"],ready:["Move the tool, record positions, then test your program.","\u79FB\u52A8\u5DE5\u5177\u3001\u8BB0\u5F55\u4F4D\u7F6E\uFF0C\u7136\u540E\u6D4B\u8BD5\u7A0B\u5E8F\u3002"],moved:["Position reached. Record it if it belongs in your program.","\u5DF2\u5230\u8FBE\u4F4D\u7F6E\u3002\u5982\u9700\u52A0\u5165\u7A0B\u5E8F\uFF0C\u8BF7\u8BB0\u5F55\u3002"],grasped:["DI1 ON \xB7 Box held. Lift before moving sideways.","DI1 \u5F00 \xB7 \u5DF2\u5939\u4F4F\u7BB1\u5B50\u3002\u5148\u62AC\u5347\uFF0C\u518D\u6C34\u5E73\u79FB\u52A8\u3002"],held:["DI1 ON \xB7 Box held.","DI1 \u5F00 \xB7 \u5DF2\u5939\u4F4F\u7BB1\u5B50\u3002"],open:["Gripper open \xB7 DI1 OFF.","\u5939\u722A\u5DF2\u5F20\u5F00 \xB7 DI1 \u5173\u3002"],placed:["Placed. Lift clear; in a cubby, withdraw through the front before changing levels.","\u653E\u7F6E\u6210\u529F\u3002\u62AC\u5347\u79BB\u5F00\u7BB1\u5B50\uFF1B\u5728\u683C\u53E3\u5185\u5E94\u5148\u4ECE\u6B63\u9762\u9000\u51FA\uFF0C\u518D\u6362\u5C42\u3002"],noContact:["Nothing held. Open, align above a box centre, lower to its top, then close.","\u672A\u5939\u4F4F\u7269\u4F53\u3002\u5F20\u5F00\u5939\u722A\uFF0C\u5BF9\u51C6\u7BB1\u5B50\u4E2D\u5FC3\uFF0C\u4E0B\u964D\u81F3\u7BB1\u9876\uFF0C\u518D\u95ED\u5408\u3002"],tilt:["Level the gripper for pickup. Choose Point downward, then preview and move.","\u6293\u53D6\u65F6\u8BF7\u5C06\u5939\u722A\u8C03\u5E73\u3002\u9009\u62E9\u201C\u671D\u4E0B\u201D\uFF0C\u68C0\u67E5\u9884\u89C8\u540E\u518D\u79FB\u52A8\u3002"],wide:["Too wide across the jaws. Open and turn the gripper 90\xB0 first.","\u5939\u722A\u65B9\u5411\u4E0A\u7684\u7BB1\u4F53\u8FC7\u5BBD\u3002\u5148\u5F20\u5F00\uFF0C\u518D\u65CB\u8F6C\u5939\u722A 90\xB0\u3002"],occupied:["Space occupied. The box stays held; lift and choose a clear space.","\u4F4D\u7F6E\u5DF2\u88AB\u5360\u7528\u3002\u7BB1\u5B50\u4ECD\u88AB\u5939\u6301\uFF0C\u8BF7\u62AC\u5347\u540E\u9009\u62E9\u7A7A\u4F4D\u3002"],drop:["Released too high. This does not count as a safe placement.","\u91CA\u653E\u4F4D\u7F6E\u8FC7\u9AD8\uFF0C\u672C\u6B21\u4E0D\u8BA1\u4E3A\u5B89\u5168\u653E\u7F6E\u3002"],outside:["Outside the loading area. Check the full box footprint, not only its centre.","\u672A\u653E\u5165\u88C5\u8F7D\u533A\u3002\u68C0\u67E5\u6574\u4E2A\u5E95\u9762\uFF0C\u800C\u4E0D\u4EC5\u662F\u4E2D\u5FC3\u70B9\u3002"],cargo:["Move blocked: cargo collision. Lift, travel across, then lower.","\u79FB\u52A8\u88AB\u963B\u6B62\uFF1A\u5C06\u78B0\u5230\u7BB1\u5B50\u3002\u5148\u62AC\u5347\uFF0C\u518D\u5E73\u79FB\uFF0C\u6700\u540E\u4E0B\u964D\u3002"],deck:["Move blocked: the box or tool would hit the truck deck. Raise Z first.","\u79FB\u52A8\u88AB\u963B\u6B62\uFF1A\u5C06\u78B0\u5230\u5E95\u677F\u3002\u8BF7\u5148\u589E\u5927 Z\u3002"],floor:["Move blocked: too low. Raise Z first.","\u79FB\u52A8\u88AB\u963B\u6B62\uFF1A\u9AD8\u5EA6\u8FC7\u4F4E\u3002\u8BF7\u5148\u589E\u5927 Z\u3002"],limits:["Cannot reach this path. Try a smaller move or a higher approach.","\u65E0\u6CD5\u5B8C\u6210\u8FD9\u6761\u8DEF\u5F84\u3002\u5C1D\u8BD5\u66F4\u5C0F\u7684\u79FB\u52A8\uFF0C\u6216\u4ECE\u66F4\u9AD8\u5904\u63A5\u8FD1\u3002"],numbers:["Enter valid coordinates; rotation must be between \u2212180\xB0 and 180\xB0.","\u8BF7\u8F93\u5165\u6709\u6548\u5750\u6807\uFF0C\u65CB\u8F6C\u8303\u56F4\u4E3A \u2212180\xB0 \u81F3 180\xB0\u3002"],stopped:["Stopped. Adjust or reset the scene.","\u5DF2\u505C\u6B62\u3002\u53EF\u4EE5\u8C03\u6574\u6216\u91CD\u7F6E\u573A\u666F\u3002"],wait:["DI1 is OFF. Stopped: check the close command and pickup position.","DI1 \u4E3A\u5173\u3002\u5DF2\u505C\u6B62\uFF0C\u8BF7\u68C0\u67E5\u95ED\u5408\u6307\u4EE4\u548C\u6293\u53D6\u4F4D\u7F6E\u3002"],complete:["Program complete. Inspect the result before changing your strategy.","\u8FD0\u884C\u5B8C\u6210\u3002\u8C03\u6574\u7B56\u7565\u524D\uFF0C\u8BF7\u5148\u68C0\u67E5\u7ED3\u679C\u3002"]},kc=["orientation","solve","obstacle","support","supportsLoad","fingers","shelfCollision","wrongCell","planNeeded","edge","noContact","tilt","wide","occupied","drop","outside","cargo","deck","floor","limits","numbers","wait"];function _t(i,e){Ct()&&!e&&i==="placed"&&(e=R("Box placed. Lift clear before the next move.","\u7BB1\u5B50\u5DF2\u653E\u597D\u3002\u4E0B\u4E00\u6B21\u79FB\u52A8\u524D\u5148\u62AC\u5347\u79BB\u5F00\u3002")),oa=i,N("status").textContent=e||R(...Yr[i]||Yr.ready),N("status").classList.toggle("error",kc.includes(i))}function gn(){N("front-view").hidden=he.spec.mode!=="stacking",he.update(tt),Wu(),kt.pose(tt),kt.taskState(he.snapshot());let i=it(tt);N("position-frame").textContent=R(qt==="bed"?Ct()?"Tool \xB7 WORK zero \xB7 mm":he.spec.mode==="shelf"?"Tool \xB7 SHELF zero \xB7 mm":"Tool \xB7 BED zero \xB7 mm":"Tool \xB7 ROBOT zero \xB7 mm",qt==="bed"?Ct()?"\u5DE5\u5177 \xB7 \u5DE5\u4F5C\u96F6\u70B9 \xB7 mm":he.spec.mode==="shelf"?"\u5DE5\u5177 \xB7 \u8D27\u67B6\u96F6\u70B9 \xB7 mm":"\u5DE5\u5177 \xB7 \u8F66\u53A2\u96F6\u70B9 \xB7 mm":"\u5DE5\u5177 \xB7 \u673A\u5668\u4EBA\u96F6\u70B9 \xB7 mm"),N("position").innerHTML=jr(i.tip).map((e,t)=>`<b><i>${"XYZ"[t]}</i>${Sn(e).toFixed(1)}</b>`).join(""),N("orientation").textContent=R("Roll / Pitch / Rz","\u6A2A\u6EDA / \u4FEF\u4EF0 / Rz")+" "+i.rpy.map(e=>e.toFixed(0)+"\xB0").join(" / "),N("score").textContent=`${he.score} / ${he.objects.length}`,N("sensor").innerHTML=`<span>${R("Close command","\u95ED\u5408\u6307\u4EE4")} <b>DO1 ${he.output?"ON":"OFF"}</b></span><span>${R(he.input?"Object held":"Nothing held",he.input?"\u5DF2\u5939\u4F4F\u7269\u4F53":"\u672A\u5939\u4F4F\u7269\u4F53")} <b>DI1 ${he.input?"ON":"OFF"}</b></span>`,N("grip-close").classList.toggle("active",he.output),N("grip-open").classList.toggle("active",!he.output),N("distance").textContent=R("Travel ","\u8DEF\u5F84 ")+Math.round(he.travel)+" mm",N("faults").textContent=R("Retries ","\u9700\u8C03\u6574 ")+he.faults,ku(),la(),!at&&!Rt&&Xc()}function Tp(i=an){let e=it(tt);return{orientation:Vt==="free"?null:Vt==="down"?[0,0,i]:[e.rpy[0],e.rpy[1],i],path:Vn}}function _v(){let i=N("motion-options");i.hidden=Xt==="joints",!i.hidden&&(i.innerHTML=`<label>${R("Orientation","\u5DE5\u5177\u671D\u5411")} <select id="orientation-mode"><option value="keep">${R("Keep current","\u4FDD\u7559\u5F53\u524D\u671D\u5411")}</option><option value="free">${R("Allow rotation","\u5141\u8BB8\u65CB\u8F6C")}</option><option value="down">${R("Point downward","\u671D\u4E0B")}</option></select></label><label>${R("Path","\u8FD0\u52A8\u8DEF\u5F84")} <select id="motion-path"><option value="linear">${R("Direct tool movement","\u5DE5\u5177\u76F4\u63A5\u79FB\u52A8")}</option><option value="joint">${R("Joint movement to target","\u5173\u8282\u8FD0\u52A8\u81F3\u76EE\u6807")}</option></select></label><small>${R(Vt==="free"?"Rotation is automatic; Rz is not constrained. Check the ghost gripper before moving.":Vt==="down"?"Pickup aid: roll and pitch are set to zero. Rz sets the jaw direction.":"Keep current roll and pitch. Rz changes only when you change its value.",Vt==="free"?"\u671D\u5411\u81EA\u52A8\u8C03\u6574\uFF0CRz \u4E0D\u53D7\u7EA6\u675F\u3002\u79FB\u52A8\u524D\u68C0\u67E5\u534A\u900F\u660E\u5939\u722A\u3002":Vt==="down"?"\u6293\u53D6\u8F85\u52A9\uFF1A\u6A2A\u6EDA\u4E0E\u4FEF\u4EF0\u8BBE\u4E3A\u96F6\uFF0CRz \u63A7\u5236\u5939\u722A\u65B9\u5411\u3002":"\u4FDD\u7559\u5F53\u524D\u6A2A\u6EDA\u4E0E\u4FEF\u4EF0\u3002\u53EA\u6709\u4FEE\u6539 Rz \u503C\u624D\u6539\u53D8\u5176\u76EE\u6807\u3002")} ${R(Vn==="joint"?"The tool may follow a curved path.":"The tool follows a direct path; placement assistance may add a final alignment.",Vn==="joint"?"\u5DE5\u5177\u53EF\u80FD\u6CBF\u5F27\u7EBF\u8DEF\u5F84\u79FB\u52A8\u3002":"\u5DE5\u5177\u6CBF\u76F4\u63A5\u8DEF\u5F84\u79FB\u52A8\uFF1B\u653E\u7F6E\u8F85\u52A9\u53EF\u80FD\u589E\u52A0\u672B\u7AEF\u5BF9\u9F50\u3002")}</small>`,N("orientation-mode").value=Vt,N("motion-path").value=Vn,N("orientation-mode").onchange=e=>{Vt=e.target.value,(Vt==="keep"||Vt==="free")&&(an=it(tt).rpy[2]),Zi()},N("motion-path").onchange=e=>{Vn=e.target.value,Zi()})}function xi(){let i=it(tt);$t=i.tip.map(e=>Math.round(e*10)/10),an=i.rpy[2],Zi()}function Zr(){document.documentElement.lang=In==="zh"?"zh-CN":"en",document.querySelectorAll("[data-en]").forEach(i=>i.textContent=i.dataset[In]),N("language").textContent=In==="zh"?"English":"\u4E2D\u6587",Zi(),Jt(),Bt(),gn(),_t(oa),En()}function Zi(){_v(),Pv();let i=jr($t),e=Vu();if(document.querySelectorAll("[data-mode]").forEach(t=>{t.classList.toggle("active",t.dataset.mode===Xt),t.setAttribute("aria-selected",String(t.dataset.mode===Xt))}),Xt==="xyz"){N("movement").innerHTML=`<div class="coordinate-grid">${["X","Y","Z","Rz"].map((t,n)=>`<div class="axis-control"><label for="axis-${n}">${t} <small>${n===3?"\xB0":"mm"}</small></label><input id="axis-${n}" aria-label="${t}" type="number" step="1" value="${Sn(n===3?an:i[n])}"><input aria-label="${t} ${R("slider","\u6ED1\u5757")}" data-axis="${n}" type="range" min="${[-100-e[0],-250-e[1],12-e[2],-180][n]}" max="${[400-e[0],300-e[1],330-e[2],180][n]}" step="1" value="${Sn(n===3?an:i[n])}"></div>`).join("")}<button id="move" class="move-button primary">${R("Move \u2192","\u79FB\u52A8 \u2192")}</button></div><p class="dock-note">${R("Set a target and inspect its preview, then Move. Orientation and path follow the choices above.","\u8BBE\u5B9A\u76EE\u6807\u5E76\u68C0\u67E5\u9884\u89C8\uFF0C\u518D\u70B9\u51FB\u79FB\u52A8\u3002\u671D\u5411\u548C\u8DEF\u5F84\u9075\u5FAA\u4E0A\u65B9\u8BBE\u7F6E\u3002")}</p>`;for(let t=0;t<4;t++){let n=N("axis-"+t),s=document.querySelector(`[data-axis="${t}"]`);n.oninput=()=>{let r=n.value===""?NaN:Number(n.value);t===3?an=r:$t[t]=r+e[t],s.value=r,Ou(),mt>=0&&Bt()},s.oninput=()=>{n.value=s.value,n.oninput()}}N("move").onclick=()=>Nu([...$t],an)}else Xt==="jog"?(N("movement").innerHTML=`<div class="jog-grid">${["X","Y","Z","Rz"].map((t,n)=>`<div class="jog-axis"><button data-jog="${n},-1" aria-label="${t} minus">\u2212</button><span>${t}</span><button data-jog="${n},1" aria-label="${t} plus">\uFF0B</button></div>`).join("")}<label>${R("Step","\u6B65\u957F")} <input id="jog-step" type="number" value="10" min="1" max="50"> mm / \xB0</label></div><p class="dock-note">${R("Small, deliberate moves. Inspect before recording.","\u7528\u5C0F\u6B65\u957F\u7CBE\u786E\u79FB\u52A8\uFF0C\u68C0\u67E5\u540E\u518D\u8BB0\u5F55\u3002")}</p>`,document.querySelectorAll("[data-jog]").forEach(t=>t.onclick=()=>{let[n,s]=t.dataset.jog.split(",").map(Number),r=Number(N("jog-step").value);if(!Number.isFinite(r)||r<1||r>50)return _t("numbers");let o=it(tt),a=[...o.tip];n<3&&(a[n]+=s*r),Nu(a,o.rpy[2]+(n===3?s*r:0))})):(N("movement").innerHTML=`<div class="joint-grid">${tt.map((t,n)=>`<div class="axis-control"><label for="joint-${n}">J${n+1}</label><input id="joint-${n}" type="range" min="${qn[n].limits[0]}" max="${qn[n].limits[1]}" step="1" value="${t}"><output>${Math.round(t)}\xB0</output></div>`).join("")}</div><p class="dock-note">${R("Joints can tilt the tool. Switching to Coordinates keeps this orientation.","\u5173\u8282\u53EF\u6539\u53D8\u5DE5\u5177\u503E\u89D2\u3002\u5207\u6362\u5230\u5750\u6807\u6A21\u5F0F\u65F6\u4F1A\u4FDD\u7559\u5F53\u524D\u671D\u5411\u3002")}</p>`,tt.forEach((t,n)=>{N("joint-"+n).oninput=s=>{s.target.nextElementSibling.textContent=s.target.value+"\xB0";let r=[...tt];r[n]=Number(s.target.value),qs(Ks(he,tt,it(r).tip,0,r))},N("joint-"+n).onchange=s=>{let r=[...tt];r[n]=Number(s.target.value),Rp(r)}}));Ou(),ji()}function ji(){if(N("preview-program").disabled=Rt||!!at||!pt.length,document.querySelectorAll("#experience,#attempt-action,#coordinate-frame,#set-zero,#movement input,#movement button,#motion-options select,.tabs button,.grip button,#record,#add-close,#add-open,#add-wait,#reset,#clear,#load,#steps button,#undo,#mission-button,#learn-button,#help,#language,#journey-toggle,#journey-steps button").forEach(i=>i.disabled=Rt||!!at),N("save").disabled=!!at&&!gi,N("save").title=R("Pause or stop movement to export a stable session.","\u6682\u505C\u6216\u505C\u6B62\u8FD0\u52A8\u540E\uFF0C\u53EF\u5BFC\u51FA\u5F53\u524D\u8FDB\u5EA6\u3002"),document.querySelectorAll(".modal-save").forEach(i=>i.disabled=!!at&&!gi),document.querySelectorAll(".modal-import").forEach(i=>i.disabled=Rt||!!at),N("undo").disabled=Rt||!!at||!_s.length,N("run").disabled=Rt||!!at||!pt.length,N("pause").disabled=!Rt||mn>=0,N("stop").disabled=!Rt&&!at,Vt==="free"){N("axis-3")&&(N("axis-3").disabled=!0);let i=document.querySelector('[data-axis="3"]');i&&(i.disabled=!0),document.querySelectorAll('[data-jog^="3,"]').forEach(e=>e.disabled=!0)}}function zc(){mn>=0&&(N("guide").hidden=!0),Wr&&(Wr("stop"),Wr=null),mn=-1,$s++,Rt=!1,gi=!1,Nc=-1,at&&(at.resolve(!1),at=null),N("pause").textContent=R("Pause","\u6682\u505C"),Jt(),ji(),_t("stopped")}function Ap(i,e=.8){return new Promise(t=>{at={frames:[tt,...i],start:performance.now(),duration:e*1e3,resolve:t},ji()})}async function Nu(i,e,t=!1,n=null){if((Rt||at)&&!t)return;if(!Gc(t))return!1;let s=n||(t?{}:Tp(e));Xs="move",qs(Ks(he,tt,i,e,null,s));let r=vs(he,tt,i,e,s);if(r.error)return he.faults++,Ue&&!Ue.finished&&Ue.blocked++,_t(r.error),gn(),!1;let o=await Ap(r.frames,Math.min(2.2,Math.max(.5,Ut(it(tt).tip,i)/150)));return o&&(he.moves++,xi(),_t("moved",r.assisted?R("Placement aligned within the 5 mm / 5\xB0 training tolerance. Record this reached position.","\u5DF2\u6309 5 mm / 5\xB0 \u8BAD\u7EC3\u5BB9\u5DEE\u5BF9\u9F50\u653E\u7F6E\u4F4D\u7F6E\u3002\u8BF7\u8BB0\u5F55\u5B9E\u9645\u5230\u8FBE\u7684\u4F4D\u7F6E\u3002"):void 0),mt>=0&&Bt()),o}async function Rp(i,e=!1){if((Rt||at)&&!e||!Gc(e))return!1;qs(Ks(he,tt,it(i).tip,0,i));let t=he.canMove(tt,i);if(t)return he.faults++,Ue&&!Ue.finished&&Ue.blocked++,_t(t),xi(),gn(),qs(Ks(he,tt,it(i).tip,0,i)),!1;let n=await Ap([i],.7);return n&&(he.moves++,xi(),_t("moved"),mt>=0&&Bt()),n}function Cp(i){if(la(),at&&!gi){let e=at,t=Math.max(0,Math.min(1,(i-e.start)/e.duration)),n=t*(e.frames.length-1),s=Math.min(e.frames.length-2,Math.floor(n)),r=e.frames[s],o=e.frames[s+1],a=n-s,l=it(tt).tip;tt=r.map((c,h)=>c+(o[h]-c)*a),he.travel+=Ut(l,it(tt).tip),Ue&&!Ue.finished&&(Ue.travel+=Ut(l,it(tt).tip)),gn(),t===1&&(at=null,e.resolve(!0),ji())}requestAnimationFrame(Cp)}function Pp(i){if(Rt||at||!Gc())return;let e=Fp(i);_t(e),gn(),kc.includes(e)||Np(),Zu()&&Wc()}function Jt(){pt.length?N("steps").innerHTML=pt.map((i,e)=>`<li class="${e===Nc?"playing":""}"><div><b>${i.name?$r(i.name):i.type==="move"?R("Move","\u79FB\u52A8"):i.type==="wait"?R("Wait for DI1","\u7B49\u5F85 DI1"):i.on?R("Close gripper","\u95ED\u5408\u5939\u722A"):R("Open gripper","\u5F20\u5F00\u5939\u722A")}</b><small>${i.type==="move"?jr(i.p).map((t,n)=>"XYZ"[n]+" "+Sn(t)).join(" \xB7 ")+R(qt==="bed"?" \xB7 BED":" \xB7 ROBOT",qt==="bed"?" \xB7 \u8F66\u53A2":" \xB7 \u673A\u5668\u4EBA")+` \xB7 ${i.orientation===null?R("Auto rotation","\u81EA\u52A8\u671D\u5411"):i.yaw.toFixed(0)+"\xB0"} \xB7 ${R(i.joint||i.path==="joint"?"Joint path":"Direct path",i.joint||i.path==="joint"?"\u5173\u8282\u8DEF\u5F84":"\u76F4\u63A5\u8DEF\u5F84")}`:i.type==="wait"?R("Stop if nothing is held","\u672A\u5939\u4F4F\u65F6\u505C\u6B62"):i.on?"DO1 ON":"DO1 OFF"}</small></div><button data-edit="${e}" aria-label="${R("Edit step","\u7F16\u8F91\u6B65\u9AA4")} ${e+1}">\u270E</button><button data-up="${e}" aria-label="${R("Move step up","\u4E0A\u79FB\u6B65\u9AA4")} ${e+1}">\u2191</button><button data-delete="${e}" aria-label="${R("Delete step","\u5220\u9664\u6B65\u9AA4")} ${e+1}">\xD7</button></li>`).join(""):N("steps").innerHTML=`<div class="empty"><span>\u21B3</span><h2>${R("One useful step at a time","\u4ECE\u4E00\u4E2A\u6709\u7528\u7684\u6B65\u9AA4\u5F00\u59CB")}</h2><p>${R("Move above a box. Record the position. Build a repeatable sequence from there.","\u5148\u79FB\u52A8\u5230\u7BB1\u5B50\u4E0A\u65B9\uFF0C\u8BB0\u5F55\u4F4D\u7F6E\uFF0C\u7136\u540E\u9010\u6B65\u6784\u5EFA\u53EF\u91CD\u590D\u6267\u884C\u7684\u7A0B\u5E8F\u3002")}</p></div>`,document.querySelectorAll("[data-up]").forEach(i=>i.onclick=()=>{let e=Number(i.dataset.up);e>0&&(sa(),[pt[e-1],pt[e]]=[pt[e],pt[e-1]]),Jt()}),document.querySelectorAll("[data-delete]").forEach(i=>i.onclick=()=>{sa(),pt.splice(Number(i.dataset.delete),1),Jt()}),document.querySelectorAll("[data-edit]").forEach(i=>i.onclick=()=>Tv(Number(i.dataset.edit))),ji(),!Rt&&!at&&Xs==="program"&&Xc()}function Hc(i){if(!(Rt||at)){if(pt.length>=200)return _t("numbers",R("Limit: 200 steps. Save before starting a new program.","\u6700\u591A 200 \u6B65\u3002\u8BF7\u5148\u4FDD\u5B58\uFF0C\u518D\u5F00\u59CB\u65B0\u7A0B\u5E8F\u3002"));sa(),pt.push(i),Jt(),N("steps").scrollTop=N("steps").scrollHeight,Np(i)}}function xv(){let i=it(tt);Hc({type:"move",p:[...i.tip],yaw:i.rpy[2],q:[...tt],joint:Xt==="joints",orientation:Vt==="free"&&Xt!=="joints"?null:[...i.rpy],path:Xt==="joints"?"joint":Vn})}function Di(i=he.spec.mode,e=!1){mi=null,_s=[],zc(),kt.setQuizTarget(null),Ue&&!e&&(Ue.finished&&(Ue=ya(Ue.plan,Ue.routes,Ue.strategy,he.spec.mode),ei=performance.now(),xs=!0),Ue.restarts++,Ue.traces={}),he.reset(i),tt=Ki(),kt.clearTrail(),e&&(Vt="keep",Vn="linear",["practice","explore"].includes(i)||(_i[4]=!1),Ue=null,ei=null,Xr={},qr="",Hn="A",ia="",qt="robot",Gn=!1,pt=[],Yi={},Gr={},xs=!1),xi(),gn(),Jt(),_t("ready")}var wp=i=>new Promise(e=>setTimeout(e,i));async function Gu(i=!1,e=0,t=!0){if(Rt||at||!pt.length||!i&&!Gc())return;t&&(Ue&&!Ue.finished&&(Ue.restarts++,Ue.traces={}),he.reset(),tt=Ki(),kt.clearTrail()),gn(),Rt=!0,gi=!1;let n=++$s;ji();let s=!0;for(let o=e;o<pt.length;o++){for(;gi&&n===$s;)await wp(50);if(n!==$s)return;let a={world:nh(he),q:[...tt]},l;do{l=!1,Nc=o,Jt();let c=N("steps").querySelector(".playing");c&&(N("steps").scrollTop=Math.max(0,c.offsetTop-N("steps").offsetTop-30));let h=pt[o];if(i&&(mn=o,Lp(o)),h.type==="move"){if(!await(h.joint?Rp(h.q,!0):Nu(h.p,h.yaw,!0,{orientation:h.orientation,path:h.path}))){s=!1;break}}else if(h.type==="grip"){let d=Fp(h.on);if(_t(d),gn(),Zu(),kc.includes(d)){s=!1;break}await wp(350)}else if(!he.input){_t("wait"),s=!1;break}if(n!==$s)return;if(i){mn=o+1;let d=await Mv(o);if(d==="stop"||n!==$s)return;d==="replay"&&(Av(a.world),tt=[...a.q],gn(),l=!0)}}while(l);if(!s)break}if(n!==$s)return;Rt=!1,Nc=-1,Jt(),ji();let r=Hu;if(xi(),!s){qs(r),mn=-1;return}if(i){mn=-1,_i[1]=!0,En(),N("guide").hidden=!0,Jr("demoDone");return}_t("complete"),he.spec.mode==="practice"&&he.score===1&&mt>=8&&(Oc=!0,_i[2]=!0,mt=-1,Bt(),Yu()),!Ct()&&he.spec.mode!=="practice"&&he.score===he.objects.length&&Wc()}function yv(){Rt&&(gi=!gi,at&&(gi?at.pauseAt=performance.now():at.start+=performance.now()-at.pauseAt),N("pause").textContent=gi?R("Resume","\u7EE7\u7EED"):R("Pause","\u6682\u505C"),ji())}function sn(i,e=R("LEARNING JOURNEY","\u5B66\u4E60\u4E4B\u65C5")){return`<div class="modal-head"><div><span class="eyebrow">${e}</span><h2 id="modal-title">${i}</h2></div><button class="modal-close" id="close-modal" aria-label="${R("Close","\u5173\u95ED")}">\xD7</button></div>`}function Kt(i){N("modal-content").innerHTML=i,N("modal-content").querySelector(".modal-save")||(N("modal-content").insertAdjacentHTML("beforeend",`<div class="modal-progress"><button class="modal-save" ${at?"disabled":""}>${R("Export progress JSON","\u5BFC\u51FA\u5B66\u4E60\u8FDB\u5EA6 JSON")}</button><button class="modal-import" ${Rt||at?"disabled":""}>${R("Import progress JSON","\u5BFC\u5165\u5B66\u4E60\u8FDB\u5EA6 JSON")}</button></div>`),N("modal-content").querySelector(".modal-save").onclick=ju,N("modal-content").querySelector(".modal-import").onclick=()=>N("file").click()),jt.open||jt.showModal(),N("close-modal")?.addEventListener("click",()=>jt.close())}function vv(){Kt(`<span class="eyebrow">${document.documentElement.dataset?.edition==="public"?"ROBOT LAB":"BEIJING NEW TALENT ACADEMY"}</span><h2 id="modal-title">\u9009\u62E9\u8BED\u8A00 / Choose your language</h2><p class="lead">\u7528\u673A\u5668\u4EBA\u89E3\u51B3\u4E00\u4E2A\u5C0F\u5C0F\u7684\u8FD0\u8F93\u95EE\u9898\u3002<br>Solve a small delivery problem with a robot.</p><div class="actions"><button class="primary" id="choose-zh">\u4E2D\u6587</button><button id="choose-en">English</button></div><p>\u968F\u65F6\u53EF\u5728\u9876\u90E8\u5207\u6362 / You can change this at any time.</p>`);for(let i of["zh","en"])N("choose-"+i).onclick=()=>{In=i,localStorage.setItem("cargo-language",In),Zr(),Ip()}}function Ip(){Kt(sn(R("How would you like to begin?","\u4F60\u60F3\u600E\u6837\u5F00\u59CB\uFF1F"),R("ROBOT LAB","\u673A\u5668\u4EBA\u5B9E\u9A8C\u5BA4"))+`<div class="start-choices"><button id="choose-learn"><strong>${R("Learn & challenges","\u8BFE\u7A0B\u4E0E\u6311\u6218")}</strong><span>${R("Meet the robot, watch a demonstration, practise, then solve the loading tasks.","\u8BA4\u8BC6\u673A\u5668\u4EBA\u3001\u89C2\u770B\u793A\u8303\u3001\u52A8\u624B\u7EC3\u4E60\uFF0C\u7136\u540E\u5B8C\u6210\u88C5\u8F7D\u4EFB\u52A1\u3002")}</span></button><button id="choose-explore"><strong>${R("Explore","\u81EA\u4E3B\u63A2\u7D22")}</strong><span>${R("Move the robot and build your own programs. No lesson, quiz, plan or timer required.","\u76F4\u63A5\u64CD\u63A7\u673A\u5668\u4EBA\u3001\u7F16\u5199\u81EA\u5DF1\u7684\u7A0B\u5E8F\u3002\u65E0\u9700\u8BFE\u7A0B\u3001\u6D4B\u9A8C\u3001\u65B9\u6848\u6216\u8BA1\u65F6\u3002")}</span></button></div><p>${R("You can switch modes from the top bar.","\u968F\u65F6\u53EF\u5728\u9876\u90E8\u5207\u6362\u6A21\u5F0F\u3002")}</p>`),N("choose-learn").onclick=()=>Ct()?Fc(!1):Jr(),N("choose-explore").onclick=()=>Fc(!0)}function Wu(){let i=Ct();N("experience").value=i?"explore":"learn",N("journey-nav").hidden=i,N("mission-button").hidden=i,N("score").hidden=i,N("learn-button").textContent=i?R("Quick help","\u64CD\u4F5C\u5E2E\u52A9"):R("Learning journey","\u5B66\u4E60\u4E4B\u65C5"),N("faults").hidden=i,N("attempt-bar").hidden=i||he.spec.mode==="practice"}function Fc(i){if(Rt||at||(jt.close(),i===Ct()))return;let e=In;if(i)if(Ic=ra(),Dc){let t=structuredClone(Dc);t.ui.lang=e,Bu(ba(t),!0)}else mt=-1,mn=-1,Di("explore",!0),Xt="xyz",Bt(),Zr();else{if(Dc=ra(),Ic){let t=structuredClone(Ic);t.ui.lang=e,Bu(ba(t),!0)}else mt=-1,mn=-1,Di("mission",!0),Zt=0,Bt(),Zr();$c()}Wu(),_t("ready",i?R("Explore \xB7 Move, grip, record and run. No timer or score.","\u81EA\u4E3B\u63A2\u7D22 \xB7 \u79FB\u52A8\u3001\u5939\u53D6\u3001\u8BB0\u5F55\u3001\u8FD0\u884C\u3002\u4E0D\u8BA1\u65F6\u3001\u4E0D\u8BC4\u5206\u3002"):R("Learning session restored. Continue when you are ready.","\u5DF2\u6062\u590D\u5B66\u4E60\u72B6\u6001\uFF0C\u51C6\u5907\u597D\u540E\u53EF\u7EE7\u7EED\u3002"))}function Vc(){Kt(sn(R("Explore at your own pace.","\u6309\u81EA\u5DF1\u7684\u8282\u594F\u63A2\u7D22\u3002"),R("EXPLORE \xB7 NO TIMER OR SCORE","\u81EA\u4E3B\u63A2\u7D22 \xB7 \u4E0D\u8BA1\u65F6\u3001\u4E0D\u8BC4\u5206"))+`<ol class="explore-help"><li>${R("Move with Coordinates, Jog or Joints. Inspect the path preview before moving.","\u4F7F\u7528\u5750\u6807\u3001\u70B9\u52A8\u6216\u5173\u8282\u64CD\u63A7\u673A\u5668\u4EBA\u3002\u79FB\u52A8\u524D\u68C0\u67E5\u8DEF\u5F84\u9884\u89C8\u3002")}</li><li>${R("Open the gripper, approach a box from above, lower, then close. DI1 confirms a grip. Move boxes to the work surface or a clear floor position.","\u5F20\u5F00\u5939\u722A\uFF0C\u4ECE\u4E0A\u65B9\u63A5\u8FD1\u7BB1\u5B50\uFF0C\u4E0B\u964D\u540E\u95ED\u5408\u3002DI1 \u786E\u8BA4\u5939\u6301\u3002\u53EF\u5C06\u7BB1\u5B50\u79FB\u5230\u5DE5\u4F5C\u53F0\u6216\u5730\u9762\u7A7A\u4F4D\u3002")}</li><li>${R("Record positions and add Open, Close and Wait DI1. Run resets the scene and plays your sequence; Reset scene keeps the program.","\u8BB0\u5F55\u4F4D\u7F6E\uFF0C\u52A0\u5165\u5F20\u5F00\u3001\u95ED\u5408\u548C\u7B49\u5F85 DI1\u3002\u8FD0\u884C\u4F1A\u91CD\u7F6E\u573A\u666F\u5E76\u6267\u884C\u7A0B\u5E8F\uFF1B\u91CD\u7F6E\u573A\u666F\u4F1A\u4FDD\u7559\u7A0B\u5E8F\u3002")}</li></ol><p>${R("Joint limits and collision checks stay on. The work surface is 20 mm above the floor; a 20 mm box has its top at robot Z 40 there, or Z 20 on the floor.","\u5173\u8282\u9650\u4F4D\u548C\u78B0\u649E\u68C0\u67E5\u59CB\u7EC8\u542F\u7528\u3002\u5DE5\u4F5C\u53F0\u9AD8\u4E8E\u5730\u9762 20 mm\uFF1B\u9AD8 20 mm \u7684\u7BB1\u5B50\u653E\u5728\u53F0\u4E0A\u65F6\uFF0C\u7BB1\u9876\u4E3A\u673A\u5668\u4EBA Z 40\uFF0C\u653E\u5728\u5730\u9762\u65F6\u4E3A Z 20\u3002")}</p><p>${R("Switching modes keeps both sessions in this tab. Export each session before closing the page; a JSON file saves the active mode only.","\u5207\u6362\u6A21\u5F0F\u4F1A\u5728\u5F53\u524D\u9875\u9762\u4FDD\u7559\u4E24\u8FB9\u7684\u72B6\u6001\u3002\u5173\u95ED\u9875\u9762\u524D\u8BF7\u5206\u522B\u5BFC\u51FA\uFF1BJSON \u6587\u4EF6\u4EC5\u4FDD\u5B58\u5F53\u524D\u6A21\u5F0F\u3002")}</p><div class="actions"><button id="explore-zero">${R("Set work zero","\u8BBE\u7F6E\u5DE5\u4F5C\u96F6\u70B9")}</button><button id="return-learn">${R("Return to learning","\u8FD4\u56DE\u5B66\u4E60")}</button></div>`),N("explore-zero").onclick=Dp,N("return-learn").onclick=()=>Fc(!1)}function Dp(){let i=Ii(he.spec);kt.setWorkFrame(i),Kt(sn(R("Use the work-surface corner as zero.","\u4EE5\u5DE5\u4F5C\u53F0\u89D2\u70B9\u4F5C\u4E3A\u96F6\u70B9\u3002"),R("EXPLORE \xB7 COORDINATES","\u81EA\u4E3B\u63A2\u7D22 \xB7 \u5750\u6807"))+`<p>${R("The marked corner is at robot","\u6807\u8BB0\u89D2\u70B9\u7684\u673A\u5668\u4EBA\u5750\u6807\u4E3A")} <b>${i.map((e,t)=>"XYZ"[t]+" "+e).join(" \xB7 ")} mm</b>.</p><p>${R("Set that point to local (0, 0, 0). X and Y stay parallel to the robot axes; Z is measured above the work surface. The robot and recorded positions do not move.","\u5C06\u6B64\u70B9\u8BBE\u4E3A\u5C40\u90E8 (0,0,0)\u3002X\u3001Y \u4ECD\u4E0E\u673A\u5668\u4EBA\u5750\u6807\u8F74\u5E73\u884C\uFF0CZ \u4ECE\u5DE5\u4F5C\u53F0\u8868\u9762\u5411\u4E0A\u6D4B\u91CF\u3002\u673A\u5668\u4EBA\u548C\u5DF2\u8BB0\u5F55\u7684\u4F4D\u7F6E\u4E0D\u4F1A\u79FB\u52A8\u3002")}</p><button id="confirm-zero" class="primary">${R("Set work zero","\u8BBE\u7F6E\u5DE5\u4F5C\u96F6\u70B9")}</button>`),N("confirm-zero").onclick=()=>{Gn=!0,qt="bed",xi(),Jt(),gn(),jt.close(),_t("ready",R("Work zero set. Z 0 is the work surface; floor height is Z \u221220.","\u5DE5\u4F5C\u96F6\u70B9\u5DF2\u8BBE\u7F6E\u3002Z 0 \u4E3A\u5DE5\u4F5C\u53F0\u8868\u9762\uFF0C\u5730\u9762\u9AD8\u5EA6\u4E3A Z \u221220\u3002"))}}function Jr(i="intro"){if(i==="demoDone"){Kt(sn(R("You have seen the strategy. Now try it.","\u5DF2\u7ECF\u770B\u8FC7\u793A\u8303\uFF0C\u73B0\u5728\u81EA\u5DF1\u8BD5\u8BD5\u3002"))+`<p class="lead">${R("Approach, grip, lift, travel, lower, release. Now build and play that sequence yourself.","\u63A5\u8FD1\u3001\u5939\u53D6\u3001\u62AC\u5347\u3001\u5E73\u79FB\u3001\u4E0B\u964D\u3001\u91CA\u653E\u3002\u73B0\u5728\u7531\u4F60\u7F16\u5199\u5E76\u8FD0\u884C\u8FD9\u4E00\u7A0B\u5E8F\u3002")}</p><div class="callout">${R("DO1 tells the gripper to close. DI1 tells you whether a box was actually held.","DO1 \u53D1\u51FA\u95ED\u5408\u6307\u4EE4\uFF1BDI1 \u544A\u8BC9\u4F60\u662F\u5426\u771F\u6B63\u5939\u4F4F\u4E86\u7BB1\u5B50\u3002")}</div><div class="actions"><button id="repeat" class="primary">${R("My turn \u2192","\u8F6E\u5230\u6211\u4E86 \u2192")}</button><button id="again">${R("Watch again","\u518D\u770B\u4E00\u6B21")}</button></div>`),N("repeat").onclick=Uu,N("again").onclick=()=>{jt.close(),qu()};return}Kt(sn(R("A robot is one part of a solution.","\u673A\u5668\u4EBA\u662F\u89E3\u51B3\u95EE\u9898\u7684\u4E00\u90E8\u5206\u3002"))+`<p class="lead">${R("A school needs to deliver six supply boxes in one small truck. How would you arrange them\u2014and teach a robot to load them?","\u5B66\u6821\u8981\u7528\u4E00\u8F86\u5C0F\u8D27\u8F66\u8FD0\u9001\u516D\u7BB1\u7269\u8D44\u3002\u600E\u6837\u6446\u653E\u7BB1\u5B50\uFF0C\u5E76\u8BA9\u673A\u5668\u4EBA\u5B8C\u6210\u88C5\u8F7D\uFF1F")}</p><div class="journey">${[["Watch","\u89C2\u5BDF","Meet the robot and controls, then watch a transfer.","\u5148\u8BA4\u8BC6\u673A\u5668\u4EBA\u548C\u63A7\u5236\u754C\u9762\uFF0C\u518D\u89C2\u770B\u642C\u8FD0\u793A\u8303\u3002"],["Try","\u5C1D\u8BD5","Build and play the same sequence.","\u4EB2\u624B\u7F16\u5199\u5E76\u8FD0\u884C\u540C\u6837\u7684\u7A0B\u5E8F\u3002"],["Explain","\u89E3\u91CA","Check the ideas, not just the buttons.","\u68C0\u67E5\u662F\u5426\u7406\u89E3\uFF0C\u800C\u4E0D\u4EC5\u4F1A\u6309\u6309\u94AE\u3002"],["Solve","\u89E3\u51B3","Plan a truck load, then adapt your strategy to stacking around an obstacle.","\u89C4\u5212\u8F66\u53A2\u88C5\u8F7D\uFF0C\u518D\u5C06\u7B56\u7565\u8FC1\u79FB\u5230\u5E26\u969C\u788D\u7684\u5806\u53E0\u4EFB\u52A1\u3002"]].map((e,t)=>`<article><b>0${t+1} \xB7 ${R(e[0],e[1])}</b><p>${R(e[2],e[3])}</p></article>`).join("")}</div><div class="callout">${R("This robot has six turning joints: J1 base, J2 shoulder, J3 elbow, J4 swivel, J5 wrist tilt and J6 tool rotation. Together they control position and orientation. Motors are actuators. The gripper holds a box. Coordinates describe a position. A program tells the robot what to do in order; sensors give feedback. The arm has reach and clearance limits. You decide the packing strategy.","\u8FD9\u53F0\u673A\u5668\u4EBA\u6709\u516D\u4E2A\u8F6C\u52A8\u5173\u8282\uFF1AJ1 \u5E95\u5EA7\u3001J2 \u80A9\u90E8\u3001J3 \u8098\u90E8\u3001J4 \u56DE\u8F6C\u3001J5 \u8155\u90E8\u4FEF\u4EF0\u3001J6 \u5DE5\u5177\u65CB\u8F6C\u3002\u5B83\u4EEC\u5171\u540C\u63A7\u5236\u4F4D\u7F6E\u548C\u59FF\u6001\u3002\u7535\u673A\u662F\u6267\u884C\u5668\u3002\u5939\u722A\u5939\u6301\u7BB1\u5B50\uFF0C\u5750\u6807\u63CF\u8FF0\u4F4D\u7F6E\uFF0C\u7A0B\u5E8F\u89C4\u5B9A\u52A8\u4F5C\u987A\u5E8F\uFF0C\u4F20\u611F\u5668\u63D0\u4F9B\u53CD\u9988\u3002\u673A\u68B0\u81C2\u6709\u53EF\u8FBE\u8303\u56F4\u548C\u907F\u969C\u9650\u5236\uFF0C\u88C5\u8F7D\u7B56\u7565\u9700\u8981\u4F60\u6765\u51B3\u5B9A\u3002")}</div><div class="actions"><button id="watch" class="primary">${R("Watch a demonstration \u2192","\u89C2\u770B\u793A\u8303 \u2192")}</button><button id="parts">${R("Robot & interface tour","\u673A\u5668\u4EBA\u4E0E\u754C\u9762\u5BFC\u89C8")}</button><button id="practice">${R("Guided practice","\u5F15\u5BFC\u7EC3\u4E60")}</button><button id="explore">${R("Loading challenge","\u88C5\u8F7D\u6311\u6218")}</button>${Oc?`<button id="quiz-again">${R("Concept check","\u6982\u5FF5\u68C0\u67E5")}</button>`:""}</div><footer>${R("Support appears when needed. Reopen it here at any time. This preview uses authored guidance, not live AI.","\u5B66\u4E60\u652F\u6301\u4EC5\u5728\u9700\u8981\u65F6\u51FA\u73B0\uFF0C\u53EF\u968F\u65F6\u91CD\u65B0\u6253\u5F00\u3002\u672C\u9884\u89C8\u4F7F\u7528\u9884\u8BBE\u6559\u5B66\u5F15\u5BFC\uFF0C\u672A\u8FDE\u63A5\u5B9E\u65F6 AI\u3002")}</footer>`),N("watch").onclick=Xu,N("parts").onclick=()=>Cv(0),N("practice").onclick=Uu,N("explore").onclick=()=>{Zt=4,Mn=!0,En(),mt=-1,he.spec.mode==="practice"&&Di("mission",!0),Bt(),Li()},N("quiz-again")?.addEventListener("click",Yu)}var $u=[{p:[120,-155,110],text:["Approach A from above: X 120, Y \u2212155, Z 110. Move, then record.","\u4ECE A \u4E0A\u65B9\u63A5\u8FD1\uFF1AX 120\u3001Y \u2212155\u3001Z 110\u3002\u79FB\u52A8\u540E\u8BB0\u5F55\u3002"]},{p:[120,-155,20],text:["Lower to Z 20. Keep X and Y unchanged. Move, then record.","\u4E0B\u964D\u81F3 Z 20\uFF0C\u4FDD\u6301 X\u3001Y \u4E0D\u53D8\u3002\u79FB\u52A8\u540E\u8BB0\u5F55\u3002"]},{on:!0,text:["Close the gripper and add \u201C\uFF0B Close\u201D to the program, in either order. DI1 must confirm a held box.","\u95ED\u5408\u5939\u722A\u5E76\u6DFB\u52A0\u201C\uFF0B \u95ED\u5408\u201D\uFF0C\u987A\u5E8F\u4E0D\u9650\u3002DI1 \u5FC5\u987B\u786E\u8BA4\u5DF2\u5939\u4F4F\u7BB1\u5B50\u3002"]},{p:[120,-155,110],text:["Lift to Z 110 before travelling. Move, then record.","\u5E73\u79FB\u524D\u5148\u62AC\u5347\u81F3 Z 110\uFF0C\u79FB\u52A8\u540E\u8BB0\u5F55\u3002"]},{p:[170,90,110],text:["Travel above the truck: X 170, Y 90, Z 110. Move, then record.","\u5E73\u79FB\u81F3\u8F66\u53A2\u4E0A\u65B9\uFF1AX 170\u3001Y 90\u3001Z 110\u3002\u79FB\u52A8\u540E\u8BB0\u5F55\u3002"]},{p:[170,90,40],text:["Deck height 20 + box height 20 = Z 40. Lower, then record.","\u5E95\u677F\u9AD8 20 + \u7BB1\u9AD8 20 = Z 40\u3002\u4E0B\u964D\u540E\u8BB0\u5F55\u3002"]},{on:!1,text:["Open the gripper and add \u201C\uFF0B Open\u201D to the program, in either order.","\u5F20\u5F00\u5939\u722A\u5E76\u5411\u7A0B\u5E8F\u6DFB\u52A0\u201C\uFF0B \u5F20\u5F00\u201D\uFF0C\u987A\u5E8F\u4E0D\u9650\u3002"]},{p:[170,90,110],text:["Lift clear to Z 110 and record the final position.","\u62AC\u5347\u81F3 Z 110 \u79BB\u5F00\u7BB1\u5B50\uFF0C\u8BB0\u5F55\u6700\u540E\u4E00\u4E2A\u4F4D\u7F6E\u3002"]},{text:["Press Run. The scene resets and your complete program performs the transfer.","\u70B9\u51FB\u201C\u8FD0\u884C\u201D\u3002\u573A\u666F\u4F1A\u91CD\u7F6E\uFF0C\u7531\u4F60\u7684\u5B8C\u6574\u7A0B\u5E8F\u5B8C\u6210\u642C\u8FD0\u3002"]}];async function bv(){let i=Ki(),e=[];for(let t of $u.slice(0,8))if(t.p){let n=vs(new ii("practice"),i,t.p,0);if(n.error)throw Error(n.error);i=n.frames.at(-1),e.push({type:"move",p:t.p,yaw:0,q:[...i],joint:!1})}else e.push({type:"grip",on:t.on});return e}function Xu(){Rt||at||(jt.close(),Zt=0,Mn=!1,En(),gv.start(()=>{_i[0]=!0,qu()}))}async function qu(){Zt=1,Mn=!1,En(),mt=-1,Di("practice",!0),Xt="xyz",Zi(),pt=await bv(),Jt(),Gu(!0)}function Lp(i,e=!1){let t=Op[i];N("guide").hidden=!1,N("guide").innerHTML=`<strong>${R("Teacher demonstration","\u6559\u5E08\u793A\u8303")} \xB7 ${i+1} / 8</strong><p>${R(...t.demo)}</p><p class="purpose">${R(...t.why)}</p>${e?`<div class="actions"><button id="demo-next" class="primary">${R(i===7?"Try it yourself \u2192":"Continue \u2192",i===7?"\u81EA\u5DF1\u8BD5\u8BD5 \u2192":"\u7EE7\u7EED \u2192")}</button><button id="demo-replay">${R("Replay action","\u91CD\u64AD\u6B64\u52A8\u4F5C")}</button></div>`:""}`}function Mv(i){return Lp(i,!0),ji(),new Promise(e=>{Wr=e,N("demo-next").onclick=()=>{Wr=null,e("next")},N("demo-replay").onclick=()=>{Wr=null,e("replay")}})}function Uu(){Rt||at||(Zt=2,Mn=!1,En(),jt.close(),Di("practice",!0),mt=0,Xt="xyz",Zi(),Bt())}function Bt(){if(document.querySelectorAll(".pulse").forEach(l=>l.classList.remove("pulse")),mt<0){N("guide").hidden=!0;return}let i=$u[mt],e=Op[mt],t=it(tt).tip,n=i.p&&Ut(t,i.p)<3,s=i.p&&Ut($t,i.p)<.1,r=i.on!==void 0&&he.output===i.on&&(i.on?he.input:!he.input&&he.score===1),o=i.p?[[s,R("Set the target coordinates","\u8BBE\u7F6E\u76EE\u6807\u5750\u6807")],[n,R("Move to the target","\u79FB\u52A8\u81F3\u76EE\u6807")],[!1,R("Record this position","\u8BB0\u5F55\u6B64\u4F4D\u7F6E")]]:mt===8?[[!1,R("Run your complete program","\u8FD0\u884C\u5B8C\u6574\u7A0B\u5E8F")]]:[[r,R(i.on?"Close and confirm an object is held":"Open and confirm the box is placed",i.on?"\u95ED\u5408\u5E76\u786E\u8BA4\u5DF2\u5939\u4F4F\u7269\u4F53":"\u5F20\u5F00\u5E76\u786E\u8BA4\u7BB1\u5B50\u5DF2\u653E\u597D")],[!!mi,R("Save the gripper command","\u4FDD\u5B58\u5939\u722A\u6307\u4EE4")]];N("guide").hidden=!1,N("guide").innerHTML=`<strong>${R("Your turn","\u8F6E\u5230\u4F60\u4E86")} \xB7 ${mt+1} / 9 \xB7 ${R(...e.title)}</strong><p class="purpose">${R(...e.why)}</p>${i.p?`<p class="guide-coordinates">${R(qt==="bed"?"BED target":"ROBOT target",qt==="bed"?"\u8F66\u53A2\u76EE\u6807":"\u673A\u5668\u4EBA\u76EE\u6807")}: ${jr(i.p).map((l,c)=>"XYZ"[c]+" "+Sn(l)).join(" \xB7 ")} mm</p>`:""}<ol class="action-checks">${o.map(([l,c])=>`<li class="${l?"done":""}">${l?"\u2713":"\u25CB"} ${c}</li>`).join("")}</ol><div class="actions">${i.p&&!s?`<button id="fill-guide">${R("Fill target","\u586B\u5165\u76EE\u6807")}</button>`:""}<button id="hide-guide">${R("Hide guidance","\u6536\u8D77\u5F15\u5BFC")}</button></div>`,N("fill-guide")?.addEventListener("click",()=>{$t=[...i.p],an=0,Vt="down",Vn="linear",Xt="xyz",Zi(),Bt()}),N("hide-guide").onclick=()=>{N("guide").hidden=!0,document.querySelectorAll(".pulse").forEach(l=>l.classList.remove("pulse"))};let a=mt===8?"run":i.p?n?"record":s?"move":"fill-guide":r?i.on?"add-close":"add-open":i.on?"grip-close":"grip-open";N(a)?.classList.add("pulse")}function Np(i){if(mt<0||mt>=8)return;let e=$u[mt];i&&(e.p&&i.type==="move"||!e.p&&i.type==="grip"&&i.on===e.on)&&(mi=i),pt.includes(mi)||(mi=null),Ep(e,mi,he)?(mt++,mi=null,Bt()):!e.p&&mi?(Bt(),_t("ready",R("Program command saved. Now use the gripper control; you do not need to add the command again.","\u7A0B\u5E8F\u6307\u4EE4\u5DF2\u4FDD\u5B58\u3002\u73B0\u5728\u64CD\u4F5C\u5939\u722A\u5373\u53EF\uFF0C\u65E0\u9700\u91CD\u590D\u6DFB\u52A0\u6307\u4EE4\u3002"))):i?i&&_t("ready",R("Recorded. Follow the highlighted instruction to continue.","\u5DF2\u8BB0\u5F55\uFF0C\u8BF7\u6309\u9AD8\u4EAE\u63D0\u793A\u7EE7\u7EED\u3002")):Bt()}function Yu(){Zt=3,En(),Kt(sn(R("Can you explain your decisions?","\u80FD\u89E3\u91CA\u4F60\u7684\u51B3\u5B9A\u5417\uFF1F"))+`<p>${R("Three ideas to carry into the independent mission.","\u628A\u8FD9\u4E09\u4E2A\u60F3\u6CD5\u5E26\u5165\u72EC\u7ACB\u4EFB\u52A1\u3002")}</p>${[[R("1. Why lift before travelling sideways?","1. \u4E3A\u4EC0\u4E48\u8981\u5148\u62AC\u5347\uFF0C\u518D\u6C34\u5E73\u79FB\u52A8\uFF1F"),[R("To keep the carried box clear of other objects.","\u8BA9\u6240\u642C\u8FD0\u7684\u7BB1\u5B50\u907F\u5F00\u5176\u4ED6\u7269\u4F53\u3002"),R("A robot can only move upwards.","\u673A\u5668\u4EBA\u53EA\u80FD\u5411\u4E0A\u79FB\u52A8\u3002")]],[R("2. Matching total floor areas proves the boxes will fit.","2. \u7BB1\u5B50\u603B\u5E95\u9762\u79EF\u4E0E\u8F66\u53A2\u9762\u79EF\u76F8\u7B49\uFF0C\u5C31\u4E00\u5B9A\u80FD\u88C5\u4E0B\u3002"),[R("True. Area alone guarantees a fit.","\u6B63\u786E\uFF0C\u9762\u79EF\u76F8\u7B49\u5C31\u4E00\u5B9A\u80FD\u88C5\u4E0B\u3002"),R("False. Dimensions and arrangement also matter.","\u9519\u8BEF\uFF0C\u8FD8\u8981\u68C0\u67E5\u5C3A\u5BF8\u548C\u6392\u5217\u65B9\u5F0F\u3002")]],[R("3. DO1 ON but DI1 OFF means\u2026","3. DO1 \u4E3A ON\uFF0CDI1 \u4E3A OFF\uFF0C\u8868\u793A\u2026\u2026"),[R("The box has been loaded.","\u7BB1\u5B50\u5DF2\u88C5\u5165\u8F66\u53A2\u3002"),R("Close was commanded, but nothing is held.","\u5DF2\u53D1\u51FA\u95ED\u5408\u6307\u4EE4\uFF0C\u4F46\u6CA1\u6709\u5939\u4F4F\u7BB1\u5B50\u3002")]]].map(([i,e],t)=>`<div class="quiz-item"><p>${i}</p>${e.map((n,s)=>`<label><input type="radio" name="quiz-${t}" value="${s}" ${Uc[t]===s?"checked":""}> ${n}</label>`).join("")}</div>`).join("")}<p id="quiz-feedback" class="feedback"></p><div class="actions"><button id="check-quiz" class="primary">${R("Check understanding","\u68C0\u67E5\u7406\u89E3")}</button><button id="lesson-return">${R("Revisit lesson","\u56DE\u770B\u8BFE\u7A0B")}</button></div>`),document.querySelectorAll('[name^="quiz-"]').forEach(i=>i.onchange=()=>{Uc[Number(i.name.slice(5))]=Number(i.value)}),N("lesson-return").onclick=()=>Jr(),N("check-quiz").onclick=()=>{let i=[0,1,1].map((e,t)=>document.querySelector(`input[name="quiz-${t}"]:checked`)?.value===String(e));i.every(Boolean)?(zu=!0,_i[3]=!0,En(),N("quiz-feedback").textContent=R("Ready. Plan your own loading strategy.","\u51C6\u5907\u597D\u4E86\u3002\u5F00\u59CB\u89C4\u5212\u4F60\u81EA\u5DF1\u7684\u88C5\u8F7D\u7B56\u7565\u3002"),N("check-quiz").textContent=R("Start mission \u2192","\u5F00\u59CB\u72EC\u7ACB\u4EFB\u52A1 \u2192"),N("check-quiz").onclick=()=>{Zt=4,Mn=!0,En(),mt=-1,Di("mission",!0),Bt(),Li()}):N("quiz-feedback").textContent=R("Revisit questions ","\u8BF7\u91CD\u65B0\u601D\u8003\u7B2C ")+i.map((e,t)=>e?null:t+1).filter(Boolean).join(", ")+R(". Clearance prevents collisions; area alone does not prove fit; DI1 confirms an actual grip."," \u9898\u3002\u7559\u51FA\u51C0\u7A7A\u80FD\u907F\u969C\uFF1B\u9762\u79EF\u76F8\u7B49\u4E0D\u4FDD\u8BC1\u80FD\u6392\u4E0B\uFF1BDI1 \u7528\u4E8E\u786E\u8BA4\u5B9E\u9645\u5939\u6301\u3002")}}function Li(){if(Ct())return Vc();if(he.spec.mode==="practice"){Kt(sn(R("Your guided transfer","\u5F15\u5BFC\u642C\u8FD0\u7EC3\u4E60"))+`<p>${R("Follow the learning prompts, then run your saved program.","\u6309\u7167\u5B66\u4E60\u63D0\u793A\u64CD\u4F5C\uFF0C\u518D\u8FD0\u884C\u5DF2\u4FDD\u5B58\u7684\u7A0B\u5E8F\u3002")}</p><button id="back-practice" class="primary">${R("Continue practice","\u7EE7\u7EED\u7EC3\u4E60")}</button>`),N("back-practice").onclick=()=>{jt.close(),Bt()};return}if(he.spec.mode==="shelf")return Bp();Kt(sn(R("Design \u2192 commit \u2192 execute \u2192 reflect","\u8BBE\u8BA1 \u2192 \u63D0\u4EA4 \u2192 \u6267\u884C \u2192 \u53CD\u601D"),R("MY PLACEMENT PLAN","\u6211\u7684\u653E\u7F6E\u65B9\u6848"))+`<div id="planning-root"></div>${Bc&&he.spec.mode!=="stacking"?`<button id="start-stacking">${R("Task 2: stacking + obstacle \u2192","\u4EFB\u52A1 2\uFF1A\u5806\u53E0\u4E0E\u969C\u788D \u2192")}</button>`:""}`),hd({root:N("planning-root"),t:R,world:he,plan:Yi,routes:Xr,strategy:qr,active:!!Ue&&!Ue.finished,onDraft:(i,e,t)=>{Yi=i,Xr=e,qr=t},onStart:Sv}),N("start-stacking")?.addEventListener("click",()=>{Di("stacking",!0),Li()})}function aa(){return Ue?Ue.elapsedMs+(ei===null?0:Math.max(0,performance.now()-ei)):0}function Up(i){let e=Math.floor(i/1e3);return`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`}function la(){N("attempt-bar")&&(N("attempt-bar").hidden=Ct()||he.spec.mode==="practice");let i=N("attempt-clock");i&&(i.textContent=Ue?`${R(Ue.finished?"Completed":"Task time",Ue.finished?"\u5DF2\u5B8C\u6210":"\u4EFB\u52A1\u7528\u65F6")} ${Up(aa())}`:R("Planning \xB7 timer not started","\u89C4\u5212\u4E2D \xB7 \u5C1A\u672A\u8BA1\u65F6"),N("attempt-action").textContent=R(Ue?.finished?"Results":Ue&&ei===null?"Resume timer":"My plan",Ue?.finished?"\u67E5\u770B\u7ED3\u679C":Ue&&ei===null?"\u6062\u590D\u8BA1\u65F6":"\u6211\u7684\u65B9\u6848"))}function Sv(i,e,t){let n=Ue&&!Ue.finished?Ue:null,s=aa();zc(),he.reset(),tt=Ki(),kt.clearTrail(),Yi=i,Xr=e,qr=t,n?(n.history.push({plan:n.plan,routes:n.routes,strategy:n.strategy,elapsedMs:s}),n.history.length>100&&n.history.shift(),n.plan=structuredClone(i),n.routes=structuredClone(e),n.strategy=t,n.traces={},n.revisions++,n.restarts++,n.elapsedMs=s,Ue=n):Ue=ya(i,e,t,he.spec.mode),ei=performance.now(),xs=!0,Gn=!0,qt="bed",mt=-1,Zt=4,Mn=!0,xi(),Jt(),Bt(),En(),gn(),la(),jt.close(),_t("ready",R("Plan committed. Timer running. Build and execute your own solution.","\u65B9\u6848\u5DF2\u63D0\u4EA4\uFF0C\u5F00\u59CB\u8BA1\u65F6\u3002\u8BF7\u7F16\u5199\u5E76\u6267\u884C\u81EA\u5DF1\u7684\u89E3\u51B3\u65B9\u6848\u3002"))}function Gc(i=!1){return Ct()||he.spec.mode==="practice"||he.spec.mode==="shelf"||i?!0:Ue?.finished?(Wc(),!1):Ue?ei===null?(_t("ready",R("Choose Resume timer to continue this saved attempt.","\u70B9\u51FB\u201C\u6062\u590D\u8BA1\u65F6\u201D\u7EE7\u7EED\u5DF2\u4FDD\u5B58\u7684\u5C1D\u8BD5\u3002")),!1):!0:(_t("planNeeded"),Li(),!1)}function Fp(i){let e=he.command(i,tt);return kc.includes(e)&&Ue&&!Ue.finished&&Ue.blocked++,e}function Zu(){if(Ct()||!Ue||Ue.finished||he.score!==he.objects.length)return!1;let i=eh(Ue,he,aa());return i.complete?(Ue.elapsedMs=i.elapsedMs,ei=null,Ue.finished=!0,Ue.result=i,he.spec.mode==="mission"&&(Bc=!0),_i[4]=!0,En(),la(),!0):!1}function Wc(){if(Ct())return;if(!Ue){Kt(sn(R("Task complete. Export your progress or review the learning journey.","\u4EFB\u52A1\u5B8C\u6210\u3002\u53EF\u4EE5\u5BFC\u51FA\u8FDB\u5EA6\u6216\u56DE\u770B\u5B66\u4E60\u4E4B\u65C5\u3002")));return}Zu();let i=Ue.result||eh(Ue,he,aa());Kt(sn(R(i.complete?"Your plan, tested.":"Your attempt so far.",i.complete?"\u65B9\u6848\u5DF2\u5B8C\u6210\u68C0\u9A8C\u3002":"\u5F53\u524D\u5C1D\u8BD5\u3002"),R("REFLECT \xB7 COMPARE \xB7 IMPROVE","\u53CD\u601D \xB7 \u6BD4\u8F83 \xB7 \u6539\u8FDB"))+`<div class="assessment-total"><b>${i.total} / 100</b><span>${Up(i.elapsedMs)} \xB7 ${he.score} / ${he.objects.length} ${R("boxes","\u7BB1")}</span></div><div class="rubric-scores">${[["space",45,"Space","\u7A7A\u95F4"],["placement",40,"Placement","\u653E\u7F6E"],["speed",15,"Time","\u65F6\u95F4"]].map(([e,t,n,s])=>`<div>${R(n,s)}<b>${i.points[e]} / ${t}</b></div>`).join("")}</div><p>${R("Load compactness","\u88C5\u8F7D\u7D27\u51D1\u5EA6")}: ${(i.compactness*100).toFixed(1)}% \xB7 ${R("Used envelope","\u5360\u7528\u5305\u56F4\u5C3A\u5BF8")}: ${i.usedSize.map(e=>Sn(e)).join(" \xD7 ")} mm</p><p>${R("Total tool travel","\u5DE5\u5177\u603B\u8DEF\u5F84")} ${Math.round(i.travel)} mm \xB7 ${R("Blocked actions","\u88AB\u963B\u6B62\u52A8\u4F5C")} ${i.blocked} \xB7 ${R("Plan revisions","\u65B9\u6848\u4FEE\u6539")} ${i.revisions} \xB7 ${R("Scene restarts","\u573A\u666F\u91CD\u7F6E")} ${i.restarts}</p><div class="result-table"><table><thead><tr><th>${R("Box","\u7BB1\u5B50")}</th><th>${R("Planned XYZ","\u89C4\u5212 XYZ")}</th><th>${R("Actual XYZ","\u5B9E\u9645 XYZ")}</th><th>${R("Position error","\u4F4D\u7F6E\u8BEF\u5DEE")}</th></tr></thead><tbody>${i.perBox.map(e=>`<tr><td>${e.id}</td><td>${Ws(e.target,Ii(he.spec)).map(Sn).join(", ")}</td><td>${Ws(e.actual,Ii(he.spec)).map(Sn).join(", ")}</td><td>${e.errorMm.toFixed(1)} mm</td></tr>`).join("")}</tbody></table></div><p><b>${R("Goal of this plan","\u672C\u65B9\u6848\u7684\u76EE\u6807")}</b><br>${$r(Ue.strategy)}</p><label>${R("What worked? What changed after a collision? What would you optimize next time, and why?","\u54EA\u4E9B\u6709\u6548\uFF1F\u78B0\u649E\u540E\u6539\u53D8\u4E86\u4EC0\u4E48\uFF1F\u4E0B\u4E00\u6B21\u8981\u4F18\u5316\u4EC0\u4E48\uFF0C\u4E3A\u4EC0\u4E48\uFF1F")}<textarea id="reflection" maxlength="4000">${$r(ia)}</textarea></label><p>${R("Your explanation is for teacher discussion. Time targets are provisional classroom goals; this score is feedback on the simulation, not proof of learning.","\u89E3\u91CA\u4F9B\u6559\u5E08\u8BA8\u8BBA\u3002\u65F6\u95F4\u76EE\u6807\u4E3A\u6682\u5B9A\u8BFE\u5802\u76EE\u6807\uFF1B\u6B64\u5206\u6570\u53CD\u6620\u4EFF\u771F\u8868\u73B0\uFF0C\u4E0D\u4EE3\u8868\u5DF2\u8BC1\u660E\u5B66\u4E60\u6210\u6548\u3002")}</p><div class="actions"><button id="save-attempt" class="primary">${R("Export attempt & progress","\u5BFC\u51FA\u5C1D\u8BD5\u4E0E\u8FDB\u5EA6")}</button><button id="improve-plan">${R("Design a new attempt","\u8BBE\u8BA1\u65B0\u5C1D\u8BD5")}</button>${i.complete&&he.spec.mode==="mission"?`<button id="next-task">${R("Task 2: stacking + obstacle \u2192","\u4EFB\u52A1 2\uFF1A\u5806\u53E0\u4E0E\u969C\u788D \u2192")}</button>`:""}</div>`),N("reflection").oninput=e=>ia=e.target.value,N("save-attempt").onclick=ju,N("improve-plan").onclick=Li,N("next-task")?.addEventListener("click",()=>{Di("stacking",!0),Li()})}function Ev(){if(Ct())return Vc();if(he.spec.mode==="shelf")return Bp();if(he.spec.mode==="stacking"){Kt(sn(R("Review your route in three dimensions.","\u4ECE\u4E09\u4E2A\u7EF4\u5EA6\u68C0\u67E5\u8DEF\u7EBF\u3002"))+`<p>${R("The person\u2019s marked obstacle zone has width, depth and height. Compare its position with the gripper and carried box along each segment. The plan uses box-bottom levels; the movement target is the top centre. Every upper box needs full support.","\u4EBA\u7269\u6807\u793A\u533A\u57DF\u6709\u5BBD\u3001\u6DF1\u3001\u9AD8\u3002\u6CBF\u6BCF\u6BB5\u8DEF\u7EBF\u6BD4\u8F83\u969C\u788D\u7269\u4E0E\u5939\u722A\u3001\u6240\u5939\u7BB1\u5B50\u7684\u4F4D\u7F6E\u3002\u65B9\u6848\u5C42\u9AD8\u6307\u7BB1\u5E95\uFF0C\u79FB\u52A8\u76EE\u6807\u4E3A\u7BB1\u9876\u4E2D\u5FC3\u3002\u6BCF\u4E2A\u4E0A\u5C42\u7BB1\u5B50\u90FD\u9700\u8981\u5B8C\u6574\u652F\u6491\u3002")}</p><button id="review-stacking">${R("Review my plan","\u68C0\u67E5\u6211\u7684\u65B9\u6848")}</button>`),N("review-stacking").onclick=Li;return}Kt(sn(R("A little help, when you need it.","\u9700\u8981\u65F6\uFF0C\u7ED9\u4F60\u4E00\u70B9\u5E2E\u52A9\u3002"),R("TEACHER NOTES \u2022 BUILT-IN GUIDANCE","\u6559\u5E08\u63D0\u793A \xB7 \u5185\u7F6E\u5F15\u5BFC"))+`<p>${$r(R(...Yr[oa]||Yr.ready))}</p><div class="help-grid"><button data-help="move">${R("How do I move a box?","\u600E\u6837\u642C\u8FD0\u7BB1\u5B50\uFF1F")}</button><button data-help="program">${R("How do I build a program?","\u600E\u6837\u7F16\u5199\u7A0B\u5E8F\uFF1F")}</button><button data-help="collision">${R("My path hits something.","\u8DEF\u5F84\u53D1\u751F\u78B0\u649E\u3002")}</button><button id="coordinate-help">${R("Learn local zero","\u5B66\u4E60\u5C40\u90E8\u96F6\u70B9")}</button><button data-help="math">${R("How do I plan the load?","\u600E\u6837\u89C4\u5212\u88C5\u8F7D\uFF1F")}</button></div><div id="help-answer" class="feedback"></div><div class="actions"><button id="open-lesson">${R("Open learning journey","\u6253\u5F00\u5B66\u4E60\u4E4B\u65C5")}</button>${mt>=0?`<button id="resume-guide">${R("Show next step","\u663E\u793A\u4E0B\u4E00\u6B65")}</button>`:""}</div>`);let i={move:["1. Open. 2. Move above a box centre. 3. Lower to Z 20. 4. Close and check DI1. 5. Lift to Z 110. 6. Travel above your destination. 7. Lower to Z 40 and open. 8. Lift away. The 110 mm height is a conservative example, not a universal minimum.","1. \u5F20\u5F00\u30022. \u79FB\u81F3\u7BB1\u5B50\u4E2D\u5FC3\u4E0A\u65B9\u30023. \u964D\u5230 Z 20\u30024. \u95ED\u5408\u5E76\u786E\u8BA4 DI1\u30025. \u62AC\u5347\u81F3 Z 110\u30026. \u79FB\u81F3\u76EE\u6807\u4E0A\u65B9\u30027. \u964D\u81F3 Z 40 \u5E76\u5F20\u5F00\u30028. \u62AC\u5347\u79BB\u5F00\u3002110 mm \u662F\u4FDD\u5B88\u7684\u793A\u4F8B\u9AD8\u5EA6\uFF0C\u4E0D\u662F\u901A\u7528\u6700\u5C0F\u503C\u3002"],program:["Record useful positions. After pickup, add Close and Wait DI1. Record lift, travel and lowering positions; add Open and record retreat. Run resets the boxes and tests the whole sequence.","\u8BB0\u5F55\u5173\u952E\u4F4D\u7F6E\u3002\u6293\u53D6\u4F4D\u7F6E\u540E\u6DFB\u52A0\u201C\u95ED\u5408\u201D\u548C\u201C\u7B49\u5F85 DI1\u201D\u3002\u8BB0\u5F55\u62AC\u5347\u3001\u5E73\u79FB\u3001\u4E0B\u964D\u4F4D\u7F6E\uFF0C\u6DFB\u52A0\u201C\u5F20\u5F00\u201D\uFF0C\u518D\u8BB0\u5F55\u79BB\u5F00\u4F4D\u7F6E\u3002\u8FD0\u884C\u4F1A\u91CD\u7F6E\u7BB1\u5B50\u5E76\u6D4B\u8BD5\u6574\u4E2A\u7A0B\u5E8F\u3002"],collision:["Identify what would touch: cargo, deck or another box. Increase only Z first, then move X/Y, then lower. A shorter diagonal path can cut through cargo. Record the extra position so the program repeats the safe route.","\u5224\u65AD\u5C06\u78B0\u5230\u8D27\u7269\u3001\u5E95\u677F\u8FD8\u662F\u5176\u4ED6\u7BB1\u5B50\u3002\u5148\u53EA\u589E\u52A0 Z\uFF0C\u518D\u79FB\u52A8 X/Y\uFF0C\u6700\u540E\u4E0B\u964D\u3002\u8F83\u77ED\u7684\u659C\u7EBF\u8DEF\u5F84\u53EF\u80FD\u7A7F\u8FC7\u8D27\u7269\u3002\u8BB0\u5F55\u65B0\u589E\u4F4D\u7F6E\uFF0C\u8BA9\u7A0B\u5E8F\u91CD\u590D\u53EF\u884C\u8DEF\u7EBF\u3002"],math:["Add all box floor areas and compare with the truck area. Draw a non-overlapping arrangement. Use half the rotated dimensions to convert a box corner into its centre. Matching areas do not guarantee the shapes fit.","\u6C42\u51FA\u7BB1\u5B50\u5E95\u9762\u79EF\u4E4B\u548C\uFF0C\u4E0E\u8F66\u53A2\u9762\u79EF\u6BD4\u8F83\uFF0C\u753B\u51FA\u4E0D\u91CD\u53E0\u7684\u6392\u5217\u3002\u5229\u7528\u65CB\u8F6C\u540E\u5C3A\u5BF8\u7684\u4E00\u534A\uFF0C\u5C06\u89D2\u70B9\u6362\u7B97\u4E3A\u4E2D\u5FC3\u3002\u9762\u79EF\u76F8\u7B49\u4E0D\u4FDD\u8BC1\u5F62\u72B6\u80FD\u6392\u4E0B\u3002"]};document.querySelectorAll("[data-help]").forEach(e=>e.onclick=()=>{N("help-answer").textContent=e.dataset.help==="move"&&qt==="bed"?R("BED coordinates: 1. Open. 2. Approach above the box centre. 3. At the source, lower to Z 0. 4. Close and check DI1. 5. Lift to Z 90. 6. Travel above your planned centre. 7. Lower to Z 20 and open. 8. Lift away. These heights refer to the bed surface, not the floor.","\u8F66\u53A2\u5750\u6807\uFF1A1. \u5F20\u5F00\u30022. \u79FB\u81F3\u7BB1\u5B50\u4E2D\u5FC3\u4E0A\u65B9\u30023. \u5728\u53D6\u8D27\u533A\u964D\u81F3 Z 0\u30024. \u95ED\u5408\u5E76\u786E\u8BA4 DI1\u30025. \u62AC\u5347\u81F3 Z 90\u30026. \u79FB\u81F3\u89C4\u5212\u7684\u4E2D\u5FC3\u4E0A\u65B9\u30027. \u964D\u81F3 Z 20 \u5E76\u5F20\u5F00\u30028. \u62AC\u5347\u79BB\u5F00\u3002\u8FD9\u91CC\u7684\u9AD8\u5EA6\u76F8\u5BF9\u8F66\u53A2\u8868\u9762\uFF0C\u4E0D\u662F\u5730\u9762\u3002"):R(...i[e.dataset.help])}),N("coordinate-help").onclick=ca,N("open-lesson").onclick=()=>Jr(),N("resume-guide")?.addEventListener("click",()=>{jt.close(),Bt()})}function wv(i,e){let t=URL.createObjectURL(new Blob([JSON.stringify(e,null,2)],{type:"application/json"})),n=document.createElement("a");n.href=t,n.download=i,n.click(),setTimeout(()=>URL.revokeObjectURL(t),1e3)}N("attempt-action").onclick=()=>{Ue?.finished?Wc():Ue&&ei===null?(ei=performance.now(),jt.close(),la(),_t("ready",R("Timer resumed. Continue your attempt.","\u8BA1\u65F6\u5DF2\u6062\u590D\uFF0C\u8BF7\u7EE7\u7EED\u5C1D\u8BD5\u3002"))):Li()};N("record").onclick=xv;N("add-close").onclick=()=>Hc({type:"grip",on:!0});N("add-open").onclick=()=>Hc({type:"grip",on:!1});N("add-wait").onclick=()=>Hc({type:"wait"});N("grip-open").onclick=()=>Pp(!1);N("grip-close").onclick=()=>Pp(!0);N("run").onclick=()=>Gu();N("pause").onclick=yv;N("stop").onclick=zc;N("reset").onclick=()=>mt>=0?Uu():Di();N("clear").onclick=()=>{Kt(sn(R("Clear this program?","\u6E05\u7A7A\u6B64\u7A0B\u5E8F\uFF1F"))+`<p>${R("Save first to keep this sequence.","\u5982\u9700\u4FDD\u7559\u6B64\u7A0B\u5E8F\uFF0C\u8BF7\u5148\u4FDD\u5B58\u3002")}</p><div class="actions"><button id="confirm-clear" class="primary">${R("Clear program","\u6E05\u7A7A\u7A0B\u5E8F")}</button></div>`),N("confirm-clear").onclick=()=>{sa(),pt=[],Jt(),jt.close()}};N("save").onclick=ju;N("load").onclick=()=>N("file").click();N("file").onchange=async i=>{try{let e=i.target.files[0];if(!e)return;if(e.size>5e6)throw Error();Lu=ba(JSON.parse(await e.text())),Kt(sn(R("Restore this saved session?","\u6062\u590D\u6B64\u5B66\u4E60\u8FDB\u5EA6\uFF1F"))+`<p>${R("This replaces the current session. Export your progress below first if you want to keep it. The robot will remain stopped.","\u8FD9\u4F1A\u66FF\u6362\u5F53\u524D\u5B66\u4E60\u72B6\u6001\u3002\u5982\u9700\u4FDD\u7559\uFF0C\u8BF7\u5148\u5BFC\u51FA\u5F53\u524D\u8FDB\u5EA6\u3002\u6062\u590D\u540E\u673A\u5668\u4EBA\u4FDD\u6301\u505C\u6B62\u3002")}</p><button id="restore-confirm" class="primary">${R("Restore progress","\u6062\u590D\u8FDB\u5EA6")}</button>`),N("restore-confirm").onclick=()=>{Bu(Lu),Lu=null}}catch{_t("numbers",R("Invalid progress file. Your current session is unchanged.","\u8FDB\u5EA6\u6587\u4EF6\u65E0\u6548\u3002\u5F53\u524D\u5B66\u4E60\u72B6\u6001\u4FDD\u6301\u4E0D\u53D8\u3002"))}finally{i.target.value=""}};N("undo").onclick=()=>{_s.length&&(pt=_s.pop(),Jt(),mt>=0&&Bt())};N("top-view").onclick=()=>kt.view("top");N("front-view").onclick=()=>kt.view("side");N("iso-view").onclick=()=>kt.view("iso");N("trail").onchange=i=>kt.setTrail(i.target.checked);N("path-preview").onchange=i=>{kt.setPreviewVisible(i.target.checked),N("path-feedback").hidden=!i.target.checked||!Hu};N("preview-program").onclick=()=>{Xs="program",Lc="",N("path-preview").checked=!0,kt.setPreviewVisible(!0),Xc()};N("journey-toggle").onclick=()=>{Mn=!Mn,En()};N("mission-button").onclick=Li;N("learn-button").onclick=()=>Ct()?Vc():$c();N("experience").onchange=i=>Fc(i.target.value==="explore");N("help").onclick=Ev;N("coordinate-frame").onchange=i=>{if(i.target.value==="bed"&&!Gn){i.target.value=qt,ca();return}qt=i.target.value,xi(),Jt(),gn(),mt>=0&&!N("guide").hidden&&Bt(),_t("ready",R("Coordinate display changed. The robot and saved positions did not move.","\u5750\u6807\u663E\u793A\u5DF2\u5207\u6362\uFF0C\u673A\u5668\u4EBA\u548C\u5DF2\u8BB0\u5F55\u7684\u4F4D\u7F6E\u4E0D\u53D8\u3002"))};N("set-zero").onclick=ca;N("language").onclick=()=>{In=In==="zh"?"en":"zh",localStorage.setItem("cargo-language",In),Zr()};document.querySelectorAll("[data-mode]").forEach(i=>i.onclick=()=>{Xt==="joints"&&i.dataset.mode!=="joints"&&(Vt="keep"),Xt=i.dataset.mode,xi()});var Op=[{title:["Approach box A","\u63A5\u8FD1\u7BB1\u5B50 A"],why:["Approaching from above leaves room to lower safely.","\u4ECE\u4E0A\u65B9\u63A5\u8FD1\uFF0C\u4E3A\u5B89\u5168\u4E0B\u964D\u7559\u51FA\u7A7A\u95F4\u3002"],demo:["I move above A and save this approach point.","\u6211\u79FB\u52A8\u5230 A \u4E0A\u65B9\uFF0C\u5E76\u4FDD\u5B58\u8FD9\u4E2A\u63A5\u8FD1\u70B9\u3002"]},{title:["Lower to the box","\u4E0B\u964D\u81F3\u7BB1\u5B50"],why:["Keep X and Y fixed so the gripper stays over the centre.","\u4FDD\u6301 X\u3001Y \u4E0D\u53D8\uFF0C\u8BA9\u5939\u722A\u59CB\u7EC8\u5BF9\u51C6\u4E2D\u5FC3\u3002"],demo:["I lower straight down to the top of the box.","\u6211\u7AD6\u76F4\u4E0B\u964D\u5230\u7BB1\u5B50\u9876\u90E8\u3002"]},{title:["Grip and check","\u5939\u6301\u5E76\u68C0\u67E5"],why:["A close command is not proof of a grip. DI1 confirms the box is held.","\u95ED\u5408\u6307\u4EE4\u4E0D\u4EE3\u8868\u5939\u6301\u6210\u529F\u3002DI1 \u786E\u8BA4\u662F\u5426\u5DF2\u5939\u4F4F\u7BB1\u5B50\u3002"],demo:["I close the gripper. DI1 turns on because a box is actually held.","\u6211\u95ED\u5408\u5939\u722A\u3002\u5B9E\u9645\u5939\u4F4F\u7BB1\u5B50\u540E\uFF0CDI1 \u53D8\u4E3A ON\u3002"]},{title:["Lift before travelling","\u5E73\u79FB\u524D\u62AC\u5347"],why:["Clear the surrounding cargo before moving sideways.","\u5148\u907F\u5F00\u5468\u56F4\u8D27\u7269\uFF0C\u518D\u6C34\u5E73\u79FB\u52A8\u3002"],demo:["I lift the box before travelling across the workspace.","\u6211\u5148\u62AC\u5347\u7BB1\u5B50\uFF0C\u518D\u7A7F\u8FC7\u5DE5\u4F5C\u533A\u3002"]},{title:["Travel above the truck","\u79FB\u81F3\u8F66\u53A2\u4E0A\u65B9"],why:["Keeping the load high avoids a diagonal path through obstacles.","\u4FDD\u6301\u9AD8\u5EA6\uFF0C\u907F\u514D\u659C\u7EBF\u8DEF\u5F84\u7A7F\u8FC7\u969C\u788D\u7269\u3002"],demo:["I travel above the planned placement centre.","\u6211\u79FB\u52A8\u5230\u89C4\u5212\u653E\u7F6E\u4E2D\u5FC3\u7684\u4E0A\u65B9\u3002"]},{title:["Lower onto the bed","\u4E0B\u964D\u81F3\u5E95\u677F"],why:["Deck 20 + box 20 = robot Z 40, or bed Z 20.","\u5E95\u677F 20 + \u7BB1\u9AD8 20 = \u673A\u5668\u4EBA Z 40\uFF0C\u5373\u8F66\u53A2 Z 20\u3002"],demo:["I lower until the box is supported by the truck bed.","\u6211\u4E0B\u964D\u7BB1\u5B50\uFF0C\u76F4\u5230\u7BB1\u5B50\u53D7\u5230\u8F66\u53A2\u5E95\u677F\u652F\u6491\u3002"]},{title:["Release the box","\u91CA\u653E\u7BB1\u5B50"],why:["Release only when the box has support; then check the result.","\u7BB1\u5B50\u6709\u652F\u6491\u540E\u518D\u91CA\u653E\uFF0C\u7136\u540E\u68C0\u67E5\u7ED3\u679C\u3002"],demo:["I open the gripper. The box stays on the bed and DI1 turns off.","\u6211\u5F20\u5F00\u5939\u722A\u3002\u7BB1\u5B50\u7559\u5728\u5E95\u677F\u4E0A\uFF0CDI1 \u53D8\u4E3A OFF\u3002"]},{title:["Retreat safely","\u5B89\u5168\u79BB\u5F00"],why:["Lift clear before starting the next pickup.","\u5F00\u59CB\u4E0B\u4E00\u6B21\u6293\u53D6\u524D\uFF0C\u5148\u62AC\u5347\u79BB\u5F00\u3002"],demo:["I lift away. These eight instructions form a repeatable transfer.","\u6211\u62AC\u5347\u79BB\u5F00\u3002\u8FD9\u516B\u6761\u6307\u4EE4\u7EC4\u6210\u53EF\u91CD\u590D\u7684\u642C\u8FD0\u7A0B\u5E8F\u3002"]},{title:["Test your program","\u6D4B\u8BD5\u7A0B\u5E8F"],why:["Playback checks the saved sequence, including gripper commands.","\u8FD0\u884C\u68C0\u67E5\u5DF2\u4FDD\u5B58\u7684\u52A8\u4F5C\u987A\u5E8F\uFF0C\u5305\u62EC\u5939\u722A\u6307\u4EE4\u3002"],demo:["",""]}],Fu=[["Discover","\u8BA4\u8BC6"],["Watch","\u89C2\u5BDF"],["Practise","\u7EC3\u4E60"],["Check","\u68C0\u67E5"],["Solve","\u89E3\u51B3"]],Lu=null;function En(){Wu();let i=N("journey-steps");N("journey-nav").classList.toggle("collapsed",Mn),i.innerHTML=(Mn?[Zt]:[0,1,2,3,4]).map(e=>`<button data-stage="${e}" class="${e===Zt?"current":""}" ${e===Zt?'aria-current="step"':""}><span>${_i[e]?"\u2713":e+1}</span>${R(...Fu[e])}${Mn?" \xB7 "+R("Learning journey","\u5B66\u4E60\u4E4B\u65C5"):""}</button>`).join(""),i.querySelectorAll("button").forEach(e=>e.onclick=()=>$c()),N("journey-toggle").textContent=Mn?R("Show stages","\u5C55\u5F00\u9636\u6BB5"):R("Collapse","\u6536\u8D77"),N("journey-toggle").setAttribute("aria-expanded",String(!Mn))}function $c(){if(!(Rt||at)){if(Ct())return Vc();Kt(sn(R("Your learning journey","\u4F60\u7684\u5B66\u4E60\u4E4B\u65C5"))+`<p>${R("Current stage","\u5F53\u524D\u9636\u6BB5")}: <b>${R(...Fu[Zt])}</b></p><ol class="journey-list">${Fu.map((i,e)=>`<li>${_i[e]?"\u2713":"\u25CB"} ${R(...i)} ${Zt===e?"\u2190":""}</li>`).join("")}</ol><div class="actions"><button id="continue-learning" class="primary">${R("Continue here","\u4ECE\u8FD9\u91CC\u7EE7\u7EED")}</button><button id="review-learning">${R("Review lesson choices","\u67E5\u770B\u8BFE\u7A0B\u9009\u9879")}</button></div><p>${R("Export progress to continue on another day or device. Importing never starts movement.","\u5BFC\u51FA\u8FDB\u5EA6\u540E\uFF0C\u53EF\u5728\u53E6\u4E00\u5929\u6216\u53E6\u4E00\u53F0\u8BBE\u5907\u7EE7\u7EED\u3002\u5BFC\u5165\u4E0D\u4F1A\u542F\u52A8\u673A\u5668\u4EBA\u3002")}</p>`),N("continue-learning").onclick=()=>{jt.close(),mn>=0?Rv():mt>=0?Bt():Zt===3?Yu():Zt===4?Li():Zt===1?qu():Xu()},N("review-learning").onclick=()=>Jr()}}function qs(i){Hu=i,kt.setMotionPreview(i),kt.setPreviewVisible(N("path-preview").checked);let e=N("path-feedback");if(e.hidden=!i||!N("path-preview").checked,e.classList.toggle("blocked",!!i?.error),i){let t=i.scope==="program"?R("Program \xB7 from reset","\u7A0B\u5E8F \xB7 \u4ECE\u91CD\u7F6E\u72B6\u6001\u5F00\u59CB"):R("Next move","\u4E0B\u4E00\u6B21\u79FB\u52A8");e.textContent=t+" \xB7 "+(i.error?(i.scope==="program"?R(`Step ${i.step+1}: `,`\u7B2C ${i.step+1} \u6B65\uFF1A`):"")+R(...Yr[i.error]||Yr.limits)+R(" Preview stops here. Red remainder is unchecked.","\u9884\u89C8\u5230\u6B64\u505C\u6B62\uFF1B\u7EA2\u8272\u540E\u7EED\u6BB5\u672A\u7ECF\u68C0\u67E5\u3002"):R("No blockage detected in this simulation. Dashed line = tool centre; ghost = end pose.","\u6B64\u4EFF\u771F\u672A\u68C0\u6D4B\u5230\u963B\u6321\u3002\u865A\u7EBF\u4E3A\u5DE5\u5177\u4E2D\u5FC3\u8DEF\u5F84\uFF1B\u534A\u900F\u660E\u6A21\u578B\u4E3A\u7EC8\u70B9\u59FF\u6001\u3002"))}document.querySelectorAll("#steps li").forEach((t,n)=>t.classList.toggle("preview-blocked",i?.scope==="program"&&!!i.error&&n===i.step))}function Xc(){if(Rt||at)return;let i=JSON.stringify([In,Xs,he.spec.mode,Xs==="program"?pt:[Xt,tt,$t,an,Vt,Vn,he.output,he.held,he.objects]]);if(i===Lc)return;if(Lc=i,Xs==="program"){qs(pt.length?ld(he,pt):null);return}let e=it(tt),t=Xt==="xyz"&&$t.every(Number.isFinite)&&$t.every(n=>Math.abs(n)<=600)&&Number.isFinite(an)&&(Ut($t,e.tip)>1||Vt!=="free"&&Math.abs(an-e.rpy[2])>1||Vt==="down"&&(Math.abs(e.rpy[0])>1||Math.abs(e.rpy[1])>1));qs(t?Ks(he,tt,$t,an,null,Tp(an)):null)}function Ou(){Xs="move",Lc="";let i=Xt==="xyz"&&$t.every(Number.isFinite)&&$t.every(e=>Math.abs(e)<=600)&&Ut($t,it(tt).tip)>1;kt.setTarget(i?$t:null),N("target-readout").hidden=!i,N("target-readout").textContent=R("Target \xB7 ","\u76EE\u6807 \xB7 ")+jr($t).map((e,t)=>"XYZ"[t]+" "+Sn(e)).join(" \xB7 ")+" mm",!at&&!Rt&&Xc()}function sa(){_s.push(structuredClone(pt)),_s.length>30&&_s.shift()}function Tv(i){let e=pt[i];Kt(sn(R("Edit program instruction","\u7F16\u8F91\u7A0B\u5E8F\u6307\u4EE4"))+`<label>${R("Name (optional)","\u540D\u79F0\uFF08\u53EF\u9009\uFF09")}<input id="step-name" maxlength="80" value="${$r(e.name||"")}"></label>${e.type==="move"?`<p>${R("Coordinates use your selected reference. This edits the program without moving the robot.","\u5750\u6807\u4F7F\u7528\u6240\u9009\u53C2\u8003\u7CFB\u3002\u8FD9\u91CC\u7F16\u8F91\u7A0B\u5E8F\uFF0C\u4E0D\u4F1A\u79FB\u52A8\u673A\u5668\u4EBA\u3002")}</p><div class="edit-coordinates">${[...jr(e.p),e.yaw].map((t,n)=>`<label>${["X","Y","Z","Rz"][n]}<input id="edit-${n}" type="number" value="${Sn(t)}"></label>`).join("")}</div><div class="edit-motion-options"><label>${R("Orientation","\u671D\u5411")}<select id="edit-orientation"><option value="recorded">${R("Keep recorded orientation","\u4FDD\u7559\u8BB0\u5F55\u7684\u671D\u5411")}</option><option value="free">${R("Allow rotation","\u5141\u8BB8\u65CB\u8F6C")}</option><option value="down">${R("Point downward","\u671D\u4E0B")}</option></select></label><label>${R("Path","\u8DEF\u5F84")}<select id="edit-path"><option value="linear">${R("Direct tool movement","\u5DE5\u5177\u76F4\u63A5\u79FB\u52A8")}</option><option value="joint">${R("Joint movement to target","\u5173\u8282\u8FD0\u52A8\u81F3\u76EE\u6807")}</option></select></label></div>`:""}<p id="edit-feedback"></p><button id="save-step" class="primary">${R("Save instruction","\u4FDD\u5B58\u6307\u4EE4")}</button>`),e.type==="move"&&(N("edit-orientation").value=e.orientation===null?"free":"recorded",N("edit-path").value=e.joint?"joint":e.path||"linear"),N("save-step").onclick=()=>{let t={...e,name:N("step-name").value.trim()};if(e.type==="move"){let n=[0,1,2,3].map(h=>N("edit-"+h).value===""?NaN:Number(N("edit-"+h).value)),s=Pc(n.slice(0,3),Vu());if(!n.every(Number.isFinite)||Math.abs(n[3])>180||s.some(h=>Math.abs(h)>600)){N("edit-feedback").textContent=R("Enter valid coordinates and rotation.","\u8BF7\u8F93\u5165\u6709\u6548\u5750\u6807\u548C\u89D2\u5EA6\u3002");return}let r=N("edit-orientation").value,o=e.orientation||(e.joint?it(e.q).rpy:[0,0,e.yaw]),a=r==="free"?null:r==="down"?[0,0,n[3]]:[o[0],o[1],n[3]],l=N("edit-path").value,c=Ji(s,e.q,"nearest",a);if(!c.q){N("edit-feedback").textContent=R("No solution found for this position and orientation. Try Allow rotation or a closer position.","\u672A\u627E\u5230\u7B26\u5408\u4F4D\u7F6E\u4E0E\u671D\u5411\u7684\u89E3\u3002\u8BF7\u5C1D\u8BD5\u5141\u8BB8\u65CB\u8F6C\u6216\u66F4\u8FD1\u7684\u4F4D\u7F6E\u3002");return}t={...t,p:s,yaw:n[3],q:c.q,joint:!1,orientation:a,path:l}}sa(),pt[i]=t,Jt(),jt.close(),_t("ready",R("Instruction updated. Run to check the complete path.","\u6307\u4EE4\u5DF2\u66F4\u65B0\u3002\u8FD0\u884C\u7A0B\u5E8F\u68C0\u67E5\u5B8C\u6574\u8DEF\u5F84\u3002"))}}function Av(i){he=new ii(i.mode),Object.assign(he,{objects:structuredClone(i.objects),output:i.output,held:i.held,offset:i.offset&&[...i.offset],localRotation:i.localRotation&&[...i.localRotation],travel:i.travel,moves:i.moves,faults:i.faults,drops:i.drops,last:i.last})}function ra(){return{layoutVersion:3,routes:structuredClone(Xr),strategy:qr,attempt:Ue?{...structuredClone(Ue),elapsedMs:aa()}:null,kind:"bnta-cargo-progress",version:3,savedAt:new Date().toISOString(),q:[...tt],world:nh(he),steps:structuredClone(pt),plan:structuredClone(Yi),mathAnswers:{...Gr},reflection:ia,learning:{stage:Zt,completed:[..._i],guideStep:mt,guideRecord:pt.includes(mi)?pt.indexOf(mi):null,practiceDone:Oc,quizDone:zu,truckDone:Bc,mathReady:xs,quizAnswers:[...Uc],demoIndex:mn},ui:{lastCode:oa,lang:In,mode:Xt,orientationMode:Vt,motionPath:Vn,target:$t.every(Number.isFinite)?[...$t]:[...it(tt).tip],yaw:Number.isFinite(an)?an:0,coordinateFrame:qt,bedZeroSet:Gn,guideHidden:N("guide").hidden,journeyCollapsed:Mn,trail:N("trail").checked,dimensions:!0}}}function ju(){at&&!gi||wv(Ct()?"robot-lab-explore.json":"robot-lab-progress.json",ra())}function Bu(i,e=!1){if(!e&&Ct()!==((i.legacy?i.mode:i.world?.spec.mode)==="explore")&&(Ct()?Dc=ra():Ic=ra()),zc(),jt.close(),_s=[],i.legacy){mt=-1,Di(i.mode,!0),pt=i.steps,Zt=i.mode==="practice"?2:4,mn=-1,Jt(),Bt(),En(),_t("ready",R("Legacy program imported. It contains instructions only, not saved student progress.","\u5DF2\u5BFC\u5165\u65E7\u7248\u7A0B\u5E8F\u3002\u65E7\u6587\u4EF6\u4EC5\u542B\u6307\u4EE4\uFF0C\u4E0D\u5305\u542B\u5B66\u4E60\u8FDB\u5EA6\u3002"));return}he=i.world,he.spec.stock.some(s=>s[0]===Hn)||(Hn="A"),tt=i.q,pt=i.steps,Yi=i.plan,Xr=i.routes||{},qr=i.strategy||"",Ue=i.attempt||null,ei=null,Gr=i.mathAnswers,ia=i.reflection;let t=i.learning,n=i.ui;Zt=t.stage,_i=t.completed,mt=t.guideStep,mi=t.guideRecord===null?null:pt[t.guideRecord],Oc=t.practiceDone,zu=t.quizDone,xs=!!Ue||t.mathReady,Bc=t.truckDone,Uc=t.quizAnswers,mn=t.demoIndex,In=n.lang,Xt=n.mode,Vt=n.orientationMode||"keep",Vn=n.motionPath||"linear",$t=n.target,an=n.yaw,qt=n.coordinateFrame,Gn=n.bedZeroSet,Mn=n.journeyCollapsed,N("trail").checked=n.trail,kt.setTrail(n.trail),kt.clearTrail(),oa=n.lastCode||"ready",localStorage.setItem("cargo-language",In),Zr(),N("guide").hidden=n.guideHidden,Ou(),_t("ready",Ct()?R("Explore session restored. Robot stopped; continue whenever you like.","\u63A2\u7D22\u72B6\u6001\u5DF2\u6062\u590D\uFF0C\u673A\u5668\u4EBA\u4FDD\u6301\u505C\u6B62\uFF0C\u968F\u65F6\u53EF\u4EE5\u7EE7\u7EED\u3002"):R("Progress restored. Robot stopped. Recheck the plan if it came from an older task layout.","\u5B66\u4E60\u8FDB\u5EA6\u5DF2\u6062\u590D\uFF0C\u673A\u5668\u4EBA\u4FDD\u6301\u505C\u6B62\u3002\u5982\u6765\u81EA\u65E7\u4EFB\u52A1\u5E03\u5C40\uFF0C\u8BF7\u91CD\u65B0\u68C0\u67E5\u65B9\u6848\u3002")),!e&&!Ct()&&$c()}function Rv(){mn>=8?(mn=-1,_i[1]=!0,En(),Jr("demoDone")):(Zt=1,En(),Gu(!0,Math.max(0,mn),!1))}kt.setTrail(!0);Zr();requestAnimationFrame(Cp);localStorage.getItem("cargo-language")?Ip():vv();function Bp(){Kt(sn(R("One box, one cubby.","\u4E00\u7BB1\u4E00\u683C\u3002"),R("NEXT MISSION \xB7 POSITION IN THREE DIMENSIONS","\u4E0B\u4E00\u5173 \xB7 \u4E09\u7EF4\u5B9A\u4F4D"))+`<p class="lead">${R("Put A\u2013F into their matching cubbies. A\u2013C go on the lower level; D\u2013F go above. Build a repeatable program.","\u5C06 A\u2013F \u653E\u8FDB\u5BF9\u5E94\u683C\u53E3\u3002A\u2013C \u5728\u4E0B\u5C42\uFF0CD\u2013F \u5728\u4E0A\u5C42\u3002\u7F16\u5199\u53EF\u91CD\u590D\u6267\u884C\u7684\u7A0B\u5E8F\u3002")}</p><div class="shelf-diagram" role="img" aria-label="${R("Three columns and two levels","\u4E09\u5217\u4E24\u5C42")}">${["D","E","F","A","B","C"].map(i=>`<b>${i}</b>`).join("")}</div><p>${R("Column pitch: 70 mm. Clear cubby width: 62 mm; depth: 80 mm. Upper floor: 110 mm above lower floor. All boxes: 20 mm tall. Shelf zero is the front-left corner of the lower floor.","\u5217\u95F4\u8DDD 70 mm\uFF1B\u683C\u53E3\u51C0\u5BBD 62 mm\uFF0C\u6DF1 80 mm\u3002\u4E0A\u5C42\u5E95\u677F\u6BD4\u4E0B\u5C42\u9AD8 110 mm\u3002\u7BB1\u9AD8\u5747\u4E3A 20 mm\u3002\u8D27\u67B6\u96F6\u70B9\u5728\u4E0B\u5C42\u5E95\u677F\u5DE6\u524D\u89D2\u3002")}</p><div class="callout">${R("First centre: X = half a column; Y = half the depth. Placement Z = floor height + box height. Fill the four predictions, then use the position reference to connect each letter to a target.","\u7B2C\u4E00\u4E2A\u4E2D\u5FC3\uFF1AX \u4E3A\u5217\u95F4\u8DDD\u7684\u4E00\u534A\uFF0CY \u4E3A\u6DF1\u5EA6\u7684\u4E00\u534A\u3002\u653E\u7F6E Z = \u5C42\u677F\u9AD8\u5EA6 + \u7BB1\u9AD8\u3002\u586B\u5199\u56DB\u4E2A\u9884\u6D4B\u503C\uFF0C\u518D\u7528\u4F4D\u7F6E\u53C2\u8003\u5C06\u5B57\u6BCD\u4E0E\u76EE\u6807\u5BF9\u5E94\u3002")}</div><div class="prediction-fields">${[["sx","A \xB7 X"],["sy","A \xB7 Y"],["sz","A \xB7 Z"],["upper","D \xB7 Z"]].map(([i,e])=>`<label>${e} (mm)<input id="shelf-${i}" type="number" value="${$r(Gr[i]??"")}"></label>`).join("")}</div><ol><li>${R("Pick up outside the shelf and lift. Move in front of your cubby before changing to its height.","\u5728\u8D27\u67B6\u5916\u5939\u53D6\u5E76\u62AC\u5347\u3002\u5148\u79FB\u5230\u76EE\u6807\u683C\u53E3\u524D\u65B9\uFF0C\u518D\u8C03\u6574\u9AD8\u5EA6\u3002")}</li><li>${R("Enter horizontally, with the box bottom 20 mm above its shelf. Lower by 20 mm; open.","\u6C34\u5E73\u8FDB\u5165\uFF0C\u4FDD\u6301\u7BB1\u5E95\u9AD8\u4E8E\u5C42\u677F 20 mm\u3002\u4E0B\u964D 20 mm\uFF0C\u518D\u5F20\u5F00\u3002")}</li><li>${R("Lift the empty gripper by 20 mm to clear the box, withdraw through the front, then change levels. Do not move vertically through a shelf board.","\u7A7A\u5939\u722A\u62AC\u5347 20 mm \u79BB\u5F00\u7BB1\u5B50\uFF0C\u5148\u4ECE\u6B63\u9762\u9000\u51FA\uFF0C\u518D\u6362\u5C42\u3002\u4E0D\u8981\u7AD6\u76F4\u7A7F\u8FC7\u5C42\u677F\u3002")}</li></ol><p id="shelf-feedback" class="feedback"></p><div class="actions"><button id="check-shelf" class="primary">${R("Check & begin","\u68C0\u67E5\u5E76\u5F00\u59CB")}</button><button id="shelf-zero">${R("Set shelf zero","\u8BBE\u7F6E\u8D27\u67B6\u96F6\u70B9")}</button></div><p>${R("Use the same 5 mm training tolerance, but the whole box and gripper must clear the dividers. This is a simplified contact model.","\u540C\u6837\u4F7F\u7528 5 mm \u8BAD\u7EC3\u5BB9\u5DEE\uFF0C\u4F46\u6574\u4E2A\u7BB1\u5B50\u548C\u5939\u722A\u90FD\u5FC5\u987B\u907F\u5F00\u9694\u677F\u3002\u8FD9\u662F\u7B80\u5316\u7684\u63A5\u89E6\u6A21\u578B\u3002")}</p>`);for(let i of["sx","sy","sz","upper"])N("shelf-"+i).oninput=e=>{Gr[i]=e.target.value,xs=!1};N("shelf-zero").onclick=ca,N("check-shelf").onclick=()=>{if(!ma(Gr)){N("shelf-feedback").textContent=R("Try 70 \xF7 2, 80 \xF7 2, the box height, and 110 + the box height.","\u8BD5\u8BD5 70 \xF7 2\u300180 \xF7 2\u3001\u7BB1\u9AD8\uFF0C\u4EE5\u53CA 110 + \u7BB1\u9AD8\u3002");return}xs=!0,Gn=!0,qt="bed",xi(),Jt(),gn(),jt.close(),_t("ready",R("Shelf plan checked. Open the position reference for your chosen cubby.","\u8D27\u67B6\u8BA1\u7B97\u5DF2\u68C0\u67E5\u3002\u5C55\u5F00\u4F4D\u7F6E\u53C2\u8003\uFF0C\u9009\u62E9\u76EE\u6807\u683C\u53E3\u3002"))}}function ku(){if(N("work-reference").hidden=Ct(),Ct())return;let i=N("mission-button").querySelector("span");i&&(i.textContent=he.spec.mode==="shelf"?R("Shelf mission","\u8D27\u67B6\u4EFB\u52A1"):he.spec.mode==="stacking"?R("Stacking mission","\u5806\u53E0\u4EFB\u52A1"):R("Loading mission","\u88C5\u8F7D\u4EFB\u52A1"));let e=N("reference-content");if(!e)return;let t=he.spec.mode==="shelf",n=Ii(he.spec),s=Ws(it(tt).tip,n),r=(Ue?.plan||Yi)[Hn],o=si(Hn,r?.turn||0),a=Ue?.plan||Yi,l=a[Hn],c=si(Hn,l?.turn||0),h=t?Ws(pa(Hn),n):l&&[l.x,l.y].every(Number.isFinite)?[l.x+c[0]/2,l.y+c[1]/2,(l.z||0)+20]:null,[d,m]=he.spec.size,f=s[0]>=0&&s[0]<=d&&s[1]>=0&&s[1]<=m;e.innerHTML=`<div class="reference-row"><svg viewBox="-12 -12 ${d+35} ${m+35}" role="img" aria-label="${R("Work area top view: target box and current tool marker","\u5DE5\u4F5C\u533A\u4FEF\u89C6\u56FE\uFF1A\u76EE\u6807\u7BB1\u4E0E\u5F53\u524D\u5DE5\u5177\u6807\u8BB0")}"><rect width="${d}" height="${m}" fill="#193c57" stroke="#e5c589"/>${h?`<rect x="${h[0]-o[0]/2}" y="${m-h[1]-o[1]/2}" width="${o[0]}" height="${o[1]}" fill="#e5c58944" stroke="#e5c589"/><circle cx="${h[0]}" cy="${m-h[1]}" r="3" fill="#e5c589"/>`:""}${f?`<circle cx="${s[0]}" cy="${m-s[1]}" r="3" fill="white"/>`:""}<text x="0" y="${m+15}" fill="#e5c589" font-size="8">O \u2192 +X</text><text x="0" y="-4" fill="#e5c589" font-size="8">\u2191 +Y</text></svg><div><label>${R(t?"Cubby":"Plan box",t?"\u683C\u53E3":"\u65B9\u6848\u7BB1\u5B50")} <select id="reference-box">${he.spec.stock.map(([g])=>`<option ${g===Hn?"selected":""}>${g}</option>`).join("")}</select></label><p>${R("Now from work zero","\u5F53\u524D\u76F8\u5BF9\u5DE5\u4F5C\u96F6\u70B9")}<br><b>${s.map((g,_)=>"XYZ"[_]+" "+Sn(g)).join(" \xB7 ")}</b></p>${h?`<p>${Hn} \xB7 ${R("planned top centre","\u89C4\u5212\u7BB1\u9876\u4E2D\u5FC3")}<br><b>${h.map((g,_)=>"XYZ"[_]+" "+Sn(g)).join(" \xB7 ")}</b></p><button id="reference-fill" ${!xs||Rt||at?"disabled":""}>${R("Fill placement target","\u586B\u5165\u653E\u7F6E\u76EE\u6807")}</button>`:`<p>${R("Add this box to your plan first.","\u5148\u5728\u65B9\u6848\u4E2D\u586B\u5199\u6B64\u7BB1\u4F4D\u7F6E\u3002")}</p>`}</div></div><p>${R("mm \xB7 X across, Y back, Z above the lower surface. The separate dot marks the current tool; the rectangle marks your planned box. Filling a target does not move the arm. Approach safely before lowering.","\u5355\u4F4D mm \xB7 X \u6A2A\u5411\uFF0CY \u5411\u540E\uFF0CZ \u9AD8\u4E8E\u4E0B\u5C42\u8868\u9762\u3002\u72EC\u7ACB\u5706\u70B9\u4E3A\u5F53\u524D\u5DE5\u5177\uFF0C\u77E9\u5F62\u4E3A\u89C4\u5212\u7BB1\u5B50\u3002\u586B\u5165\u76EE\u6807\u4E0D\u4F1A\u79FB\u52A8\u673A\u68B0\u81C2\uFF1B\u5148\u5B89\u5168\u63A5\u8FD1\uFF0C\u518D\u4E0B\u964D\u3002")}</p>`,he.spec.mode==="stacking"&&(e.insertAdjacentHTML("beforeend",_a(Yi,he.spec,Hn,R)),e.querySelectorAll("[data-elevation-box]").forEach(g=>{let _=()=>{Hn=g.dataset.elevationBox,ku()};g.onclick=_,g.onkeydown=p=>{(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),_())}})),N("reference-box").onchange=g=>{Hn=g.target.value,ku()},N("reference-fill")?.addEventListener("click",()=>{Gn=!0,qt="bed",$t=Pc(h,n),an=t?0:l.turn,Vt="down",Vn="linear",Xt="xyz",Zi(),Jt(),gn(),_t("ready",R("Target filled. Plan an approach before moving.","\u5DF2\u586B\u5165\u76EE\u6807\u3002\u79FB\u52A8\u524D\u8BF7\u89C4\u5212\u63A5\u8FD1\u8DEF\u7EBF\u3002"))})}function Cv(){Xu()}function Pv(){let i=document.querySelector('#coordinate-frame option[value="bed"]');i&&(i.textContent=Ct()?R("Work-surface zero","\u5DE5\u4F5C\u53F0\u96F6\u70B9"):he.spec.mode==="shelf"?R("Shelf zero","\u8D27\u67B6\u96F6\u70B9"):R("Truck-bed zero","\u8F66\u53A2\u96F6\u70B9")),N("coordinate-frame").value=qt,N("set-zero").textContent=Gn?R("Work zero \u2713","\u5DE5\u4F5C\u96F6\u70B9 \u2713"):R("Set work zero\u2026","\u8BBE\u7F6E\u5DE5\u4F5C\u96F6\u70B9\u2026"),N("frame-note").textContent=qt==="bed"?R(Ct()?"Z 0 = work surface":"Z 0 = loading surface",Ct()?"Z 0 = \u5DE5\u4F5C\u53F0\u8868\u9762":"Z 0 = \u88C5\u8F7D\u8868\u9762"):R("Fixed robot reference","\u673A\u5668\u4EBA\u56FA\u5B9A\u53C2\u8003"),kt.setWorkFrame(Gn?Ii(he.spec):null)}function ca(){if(Rt||at)return;if(Ct())return Dp();let[i,e,t]=Ii(he.spec),n=it(tt).tip,s=Ws(n,[i,e,t]),[r,o]=he.spec.size;kt.setWorkFrame([i,e,t]),Kt(sn(R("Give the work area its own zero.","\u7ED9\u5DE5\u4F5C\u533A\u8BBE\u7F6E\u4E00\u4E2A\u5C40\u90E8\u96F6\u70B9\u3002"),R("LOCAL COORDINATES \u2022 A KNOWN REFERENCE","\u5C40\u90E8\u5750\u6807 \xB7 \u5DF2\u77E5\u53C2\u8003\u70B9"))+`
 <p class="lead">${R("Choose the marked lower-left corner on the loading surface as (0, 0, 0). Measure every placement from the same point.","\u9009\u53D6\u88C5\u8F7D\u8868\u9762\u6807\u8BB0\u7684\u5DE6\u4E0B\u89D2\u4F5C\u4E3A (0, 0, 0)\uFF0C\u6240\u6709\u653E\u7F6E\u4F4D\u7F6E\u90FD\u4ECE\u540C\u4E00\u70B9\u6D4B\u91CF\u3002")}</p>
 <div class="zero-layout"><svg viewBox="0 0 300 205" role="img" aria-label="${R("Bed origin at the lower-left corner, X right, Y up, Z above the surface","\u8F66\u53A2\u539F\u70B9\u5728\u5DE6\u4E0B\u89D2\uFF0CX \u5411\u53F3\uFF0CY \u5411\u4E0A\uFF0CZ \u9AD8\u4E8E\u8868\u9762")}"><rect x="48" y="28" width="210" height="130" fill="#264963" stroke="#e5c589"/><path d="M48 158H282 M48 158V9" stroke="#e5c589" stroke-width="3"/><path d="m274 152 8 6-8 6 M42 17l6-8 6 8" fill="none" stroke="#e5c589" stroke-width="3"/><circle cx="48" cy="158" r="7" fill="#ffe1a1"/><g fill="#f9e3b4" font-size="12"><text x="268" y="184">+X</text><text x="16" y="18">+Y</text><text x="53" y="181">O (0, 0, 0)</text><text x="132" y="18">${r} mm</text><text x="263" y="95">${o}</text><text x="115" y="99">Z = 0</text></g></svg><div><b>${R("The robot does not move. The numbers change.","\u673A\u5668\u4EBA\u4E0D\u52A8\uFF0C\u5750\u6807\u6570\u503C\u6539\u53D8\u3002")}</b><p>${R("Robot position of this zero","\u6B64\u96F6\u70B9\u7684\u673A\u5668\u4EBA\u5750\u6807")}:<br><b>X ${i} \xB7 Y ${e} \xB7 Z ${t} mm</b></p><p>${R("Tool now, measured from the bed","\u5DE5\u5177\u5F53\u524D\u76F8\u5BF9\u8F66\u53A2\u7684\u4F4D\u7F6E")}:<br><b>${s.map((a,l)=>"XYZ"[l]+" "+Sn(a)).join(" \xB7 ")} mm</b></p></div></div>
 <div class="callout">${R("Local position = robot position \u2212 bed origin. Axes stay parallel. This sets a simulated work reference; it does not home the robot or touch the bed with the gripper. Saved program positions stay unchanged.","\u5C40\u90E8\u5750\u6807 = \u673A\u5668\u4EBA\u5750\u6807 \u2212 \u8F66\u53A2\u539F\u70B9\u3002\u5404\u8F74\u65B9\u5411\u4E0D\u53D8\u3002\u8FD9\u662F\u5728\u4EFF\u771F\u4E2D\u8BBE\u7F6E\u5DE5\u4EF6\u53C2\u8003\u70B9\uFF0C\u4E0D\u662F\u673A\u5668\u4EBA\u56DE\u96F6\uFF0C\u4E5F\u4E0D\u9700\u8981\u7528\u5939\u722A\u63A5\u89E6\u5E95\u677F\u3002\u5DF2\u6709\u7A0B\u5E8F\u4F4D\u7F6E\u4FDD\u6301\u4E0D\u53D8\u3002")}</div>
 <div class="actions"><button id="confirm-zero" class="primary">${R("Set this corner to (0, 0, 0)","\u5C06\u6B64\u89D2\u70B9\u8BBE\u4E3A (0, 0, 0)")}</button><button id="zero-lesson">${R("Predict a placement","\u9884\u6D4B\u4E00\u6B21\u653E\u7F6E\u4F4D\u7F6E")}</button></div>`),N("confirm-zero").onclick=()=>{Gn=!0,qt="bed",xi(),Jt(),gn(),jt.close(),mt>=0&&!N("guide").hidden&&Bt(),_t("ready",R("Bed zero set. Enter offsets from the marked corner; Z is height above the deck.","\u5DF2\u8BBE\u7F6E\u8F66\u53A2\u96F6\u70B9\u3002\u8BF7\u8F93\u5165\u76F8\u5BF9\u6807\u8BB0\u89D2\u70B9\u7684\u504F\u79FB\u91CF\uFF1BZ \u8868\u793A\u9AD8\u4E8E\u5E95\u677F\u7684\u9AD8\u5EA6\u3002"))},N("zero-lesson").onclick=Iv}function Iv(){Kt(sn(R("Predict \u2192 test \u2192 explain","\u9884\u6D4B \u2192 \u6D4B\u8BD5 \u2192 \u89E3\u91CA"),R("POSITION IS ALWAYS RELATIVE TO SOMETHING","\u4F4D\u7F6E\u603B\u662F\u76F8\u5BF9\u67D0\u4E2A\u53C2\u8003\u70B9\u800C\u8A00"))+`<p class="lead">${R("Box A is 60 \xD7 40 \xD7 20 mm. Its lower-left corner will sit at bed (0, 0). Where must the tool be at its top centre?","\u7BB1\u5B50 A \u7684\u5C3A\u5BF8\u4E3A 60 \xD7 40 \xD7 20 mm\uFF0C\u5DE6\u4E0B\u89D2\u653E\u5728\u8F66\u53A2 (0, 0)\u3002\u5DE5\u5177\u5E94\u5230\u8FBE\u7BB1\u9876\u4E2D\u5FC3\u7684\u4EC0\u4E48\u4F4D\u7F6E\uFF1F")}</p><div class="callout">${R("Use the bed surface as Z = 0. The box has width and length: targeting the corner will leave part of it outside the truck.","\u4EE5\u8F66\u53A2\u8868\u9762\u4E3A Z = 0\u3002\u7BB1\u5B50\u6709\u957F\u548C\u5BBD\uFF1B\u628A\u4E2D\u5FC3\u79FB\u5230\u89D2\u70B9\uFF0C\u4F1A\u4F7F\u4E00\u90E8\u5206\u7BB1\u4F53\u8D85\u51FA\u8F66\u53A2\u3002")}</div><div class="prediction-fields">${["X","Y","Z"].map(i=>`<label>${i} (mm)<input id="predict-${i}" type="number" aria-label="${R("Predicted bed","\u9884\u6D4B\u8F66\u53A2")} ${i}"></label>`).join("")}</div><p id="zero-feedback" class="feedback"></p><div class="actions"><button id="check-prediction" class="primary">${R("Check prediction","\u68C0\u67E5\u9884\u6D4B")}</button><button id="return-zero">${R("Back to zero setup","\u8FD4\u56DE\u96F6\u70B9\u8BBE\u7F6E")}</button></div><p>${R("After testing, explain why Z = 0 is the bed surface, not the tool height for placing this box. Try a 90\xB0 turn: which coordinates exchange roles?","\u6D4B\u8BD5\u540E\u89E3\u91CA\uFF1A\u4E3A\u4EC0\u4E48 Z = 0 \u8868\u793A\u5E95\u677F\u8868\u9762\uFF0C\u800C\u4E0D\u662F\u653E\u7F6E\u8FD9\u4E2A\u7BB1\u5B50\u65F6\u7684\u5DE5\u5177\u9AD8\u5EA6\uFF1F\u518D\u5C1D\u8BD5\u65CB\u8F6C 90\xB0\uFF1A\u54EA\u4E9B\u5750\u6807\u4F1A\u4EA4\u6362\uFF1F")}</p>`),N("return-zero").onclick=ca,N("check-prediction").onclick=()=>{let i=["X","Y","Z"].map(t=>N("predict-"+t).value===""?NaN:Number(N("predict-"+t).value)),e=Sp([0,0],[60,40,20]);if(i.some((t,n)=>t!==e[n])){N("zero-feedback").textContent=R("Measure from the corner to the centre: half of 60, half of 40, and the full 20 mm height above the bed.","\u4ECE\u89D2\u70B9\u5230\u4E2D\u5FC3\uFF1A60 \u7684\u4E00\u534A\u300140 \u7684\u4E00\u534A\uFF0C\u4EE5\u53CA\u9AD8\u4E8E\u5E95\u677F\u7684\u5B8C\u6574\u7BB1\u9AD8 20 mm\u3002");return}N("zero-feedback").textContent=R("Correct: local (30, 20, 20). Add the work origin to get robot coordinates. Approach before lowering.","\u6B63\u786E\uFF1A\u5C40\u90E8\u5750\u6807 (30,20,20)\u3002\u52A0\u4E0A\u5DE5\u4F5C\u539F\u70B9\u53EF\u5F97\u673A\u5668\u4EBA\u5750\u6807\u3002\u5148\u63A5\u8FD1\uFF0C\u518D\u4E0B\u964D\u3002"),N("check-prediction").textContent=R("Set zero & fill this target","\u8BBE\u7F6E\u96F6\u70B9\u5E76\u586B\u5165\u76EE\u6807"),N("check-prediction").onclick=()=>{Gn=!0,qt="bed",Xt="xyz",$t=Pc(e,Ii(he.spec)),an=0,Vt="down",Vn="linear",Zi(),Jt(),gn(),jt.close(),_t("ready",R("Target filled, robot unchanged. Plan your approach before pressing Move.","\u5DF2\u586B\u5165\u76EE\u6807\uFF0C\u673A\u5668\u4EBA\u672A\u79FB\u52A8\u3002\u70B9\u51FB\u79FB\u52A8\u524D\u8BF7\u5148\u89C4\u5212\u63A5\u8FD1\u8DEF\u7EBF\u3002"))}}}jt.addEventListener("close",()=>kt.setWorkFrame(Gn?Ii(he.spec):null));})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
