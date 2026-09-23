"use strict";(()=>{var hn=[{name:"base",axis:[0,0,1],length:0,limits:[-180,180],home:0},{name:"shoulder",axis:[0,-1,0],length:160,limits:[-20,150],home:55},{name:"elbow",axis:[0,-1,0],length:140,limits:[-150,150],home:-85},{name:"swivel",axis:[0,0,1],length:70,limits:[-150,150],home:0},{name:"wristPitch",axis:[0,-1,0],length:55,limits:[-120,120],home:30},{name:"toolRoll",axis:[1,0,0],length:35,limits:[-180,180],home:0}],Vt={base:70,upper:160,fore:140,limits:hn.map(i=>i.limits),home:hn.slice(0,3).map(i=>i.home)},xn=i=>hn.slice(0,i).map(e=>e.home),Ku=i=>hn.slice(0,i).reduce((e,t)=>e+t.length,0),cn=Math.PI/180,Qu=[1,0,0,0,1,0,0,0,1],ed=(i,e)=>i.map((t,n)=>t+e[n]),Cc=(i,e)=>i.map((t,n)=>t-e[n]),td=(i,e)=>[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]],nd=i=>[i[0],i[3],i[6],i[1],i[4],i[7],i[2],i[5],i[8]],ri=(i,e)=>[0,1,2].map(t=>i[t*3]*e[0]+i[t*3+1]*e[1]+i[t*3+2]*e[2]);function Dn(i,e){return Array.from({length:9},(t,n)=>{let s=Math.floor(n/3),r=n%3;return i[s*3]*e[r]+i[s*3+1]*e[r+3]+i[s*3+2]*e[r+6]})}function kr([i,e,t],n){let s=Math.cos(n),r=Math.sin(n),o=1-s;return[o*i*i+s,o*i*e-r*t,o*i*t+r*e,o*i*e+r*t,o*e*e+s,o*e*t-r*i,o*i*t-r*e,o*e*t+r*i,o*t*t+s]}function id([i,e,t]){return Dn(Dn(kr([0,0,1],t*cn),kr([0,1,0],e*cn)),kr([1,0,0],i*cn))}function sd(i,e){let t=Dn(i,nd(e)),n=Math.acos(Math.max(-1,Math.min(1,(t[0]+t[4]+t[8]-1)/2)));if(n<1e-8)return[0,0,0];let s=[t[7]-t[5],t[2]-t[6],t[3]-t[1]];if(Math.PI-n<1e-5){let r=[t[0],t[4],t[8]].indexOf(Math.max(t[0],t[4],t[8]));s=[0,0,0],s[r]=Math.sqrt(Math.max(0,(t[r*3+r]+1)/2));for(let o=0;o<3;o++)o!==r&&(s[o]=(t[r*3+o]+t[o*3+r])/(4*s[r]));return s.map(o=>o*n)}return s.map(r=>r*n/(2*Math.sin(n)))}function qa(i){let e=[0,0,Vt.base],t=[...Qu],n=[[...e]],s=[],r=[],o=[];i.forEach((h,u)=>{let f=hn[u];s.push([...e]),r.push(ri(t,f.axis)),t=Dn(t,kr(f.axis,h*cn)),o.push([...t]),f.length&&(e=ed(e,ri(t,[f.length,0,0])),n.push([...e]))});let a=Math.asin(Math.max(-1,Math.min(1,-t[6]))),c=Math.abs(Math.cos(a))<1e-7,l=[c?0:Math.atan2(t[7],t[8]),a,c?Math.atan2(-t[1],t[4]):Math.atan2(t[3],t[0])].map(h=>h/cn);return{elbow:n[1],tip:e,points:n,origins:s,axes:r,frames:o,rotation:t,rpy:l}}var Ya=40,rd=[0,0,-1,0,1,0,1,0,0];function Rt(i){let e=qa(i),t=ri(e.rotation,[Ya,0,0]),n=Dn(e.rotation,rd),s=Math.asin(Math.max(-1,Math.min(1,-n[6]))),r=Math.abs(Math.cos(s))<1e-7;return{...e,flange:[...e.tip],tip:e.tip.map((o,a)=>o+t[a]),rotation:n,rpy:[r?0:Math.atan2(n[7],n[8]),s,r?Math.atan2(-n[1],n[4]):Math.atan2(n[3],n[0])].map(o=>o/cn)}}var Qi=i=>Ku(i)+Ya;function Pn(i){if(!Array.isArray(i)||i.length<3||i.length>6||i.some((t,n)=>!Number.isFinite(t)||t<hn[n].limits[0]-1e-7||t>hn[n].limits[1]+1e-7))return!1;let{points:e}=qa(i);return e.slice(1).every((t,n)=>t[2]>=(n===e.length-2?12:18))}var oi=(i,e)=>Math.hypot(...i.map((t,n)=>t-e[n]));function zr(i,e){if(i.length!==e.length||!Pn(i)||!Pn(e))return!1;let t=Math.max(1,Math.ceil(Math.max(...i.map((n,s)=>Math.abs(n-e[s])))/.5));for(let n=0;n<=t;n++)if(!Pn(i.map((s,r)=>s+(e[r]-s)*n/t)))return!1;return!0}function od(i,e,t,n=Vt.fore){let[s,r,o]=i,a=Math.hypot(s,r),c=o-Vt.base,l=(a*a+c*c-Vt.upper**2-n**2)/(2*Vt.upper*n);if(l>1+1e-9||l<-1-1e-9)return{error:"reach"};let h=[];for(let f of[1,-1])for(let p of[-1,1]){let _=a<1e-8?e[0]:Math.atan2(r,s)/cn+(f===-1?180:0);for(;_>180;)_-=360;for(;_<-180;)_+=360;let x=p*Math.acos(Math.max(-1,Math.min(1,l))),m=Math.atan2(c,f*a)-Math.atan2(n*Math.sin(x),Vt.upper+n*Math.cos(x)),d=[_,m/cn,x/cn];Pn(d)&&(t==="nearest"||(t==="negative"?d[2]<=0:d[2]>=0))&&h.push(d)}if(h.sort((f,p)=>oi(f,e)-oi(p,e)),!h.length)return{error:"limits"};let u=h.find(f=>zr(e,f));return u?{q:u}:{error:"path"}}function ad(i,e){let t=i.map((s,r)=>[...s,e[r]]),n=t.length;for(let s=0;s<n;s++){let r=s;for(let a=s+1;a<n;a++)Math.abs(t[a][s])>Math.abs(t[r][s])&&(r=a);if([t[s],t[r]]=[t[r],t[s]],Math.abs(t[s][s])<1e-12)return null;let o=t[s][s];for(let a=s;a<=n;a++)t[s][a]/=o;for(let a=0;a<n;a++)if(a!==s){let c=t[a][s];for(let l=s;l<=n;l++)t[a][l]-=c*t[s][l]}}return t.map(s=>s[n])}function ld(i,e,t,n=qa){let s=e.length,r=Math.atan2(i[1],i[0])/cn,o=[[...e],xn(s)];for(let c of[25,70,120])for(let l of[-110,-45,65]){let h=xn(s);h[0]=r,h[1]=c,h[2]=l,s>=4&&(h[3]=c===120?70:-35),o.push(h)}let a=!1;for(let c of o){let l=[...c];for(let h=0;h<280;h++){let u=n(l),f=Cc(i,u.tip),p=t?sd(t,u.rotation):[],_=[...f,...p.map(w=>w*90)];if(Math.hypot(...f)<.12&&(!t||Math.hypot(...p)<.004)){if(Pn(l)){if(zr(e,l))return{q:l};a=!0}break}let x=u.axes.map((w,C)=>[...td(w,Cc(u.tip,u.origins[C])).map(L=>L*cn),...t?w.map(L=>L*cn*90):[]]),m=_.length,d=Array.from({length:m},(w,C)=>Array.from({length:m},(L,v)=>x.reduce((b,D)=>b+D[C]*D[v],0)+(C===v?.45:0))),E=ad(d,_);if(!E)break;let y=x.map(w=>w.reduce((C,L,v)=>C+L*E[v],0)),S=Math.max(...y.map(Math.abs));S>9&&(y=y.map(w=>w*9/S));let A=l.map((w,C)=>Math.max(hn[C].limits[0],Math.min(hn[C].limits[1],w+y[C])));if(oi(A,l)<1e-7)break;l=A}}return{error:a?"path":"solve"}}function Gs(i,e=Vt.home,t="nearest",n=null){return!Array.isArray(i)||i.length!==3||i.some(s=>!Number.isFinite(s))?{error:"numbers"}:Pn(e)?n&&(e.length!==6||!Array.isArray(n)||n.length!==3||n.some(s=>!Number.isFinite(s)||Math.abs(s)>180))?{error:"orientationInvalid"}:oi(i,[0,0,Vt.base])>Qi(e.length)+1e-7?{error:"reach"}:i[2]<12?{error:"limits"}:e.length===3?od(i,e,t,Vt.fore+Ya):ld(i,e,n?id(n):null,Rt):{error:"limits"}}function Ws(i){let e=i?.version===1?3:i?.jointCount;if(![1,2,3].includes(i?.version)||!Number.isInteger(e)||e<3||e>6||!Array.isArray(i.steps)||i.steps.length>200||i.version===3&&!["gripper","vacuum","magnet"].includes(i.tool))throw Error("Invalid program");let t=i.steps.map(n=>{if(!n||typeof n.name!="string"||n.name.length>60||!Number.isFinite(n.seconds))throw Error("Invalid step");let s=n.type||"move";if(s==="move"){if(!Pn(n.q)||n.q.length!==e||n.seconds<.5||n.seconds>15)throw Error("Invalid move");return{...n.type?{type:s}:{},name:n.name,q:[...n.q],seconds:n.seconds}}if(i.version!==3||!["output","wait","delay"].includes(s)||n.seconds<.1||n.seconds>30||(s==="output"||s==="wait")&&typeof n.value!="boolean")throw Error("Invalid instruction");return{type:s,name:n.name,seconds:n.seconds,...s!=="delay"?{value:n.value}:{}}});return{jointCount:e,steps:t,...i.version===3?{tool:i.tool}:{}}}var yi={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},vi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},ih=0,Al=1,sh=2;var Cl=1,Ho=2,kn=3,Qn=0,qt=1,zn=2,ti=0,Di=1,Rl=2,Il=3,Pl=4,rh=5,pi=100,oh=101,ah=102,lh=103,ch=104,hh=200,uh=201,dh=202,fh=203,mo=204,go=205,ph=206,mh=207,gh=208,_h=209,xh=210,yh=211,vh=212,bh=213,Mh=214,Vo=0,Go=1,Wo=2,Li=3,Xo=4,qo=5,Yo=6,Zo=7,Dl=0,Sh=1,Eh=2,ni=0,wh=1,Th=2,Ah=3,Ch=4,Rh=5,Ih=6,Ph=7;var Ll=300,Hi=301,Vi=302,jo=303,$o=304,Er=306,_o=1e3,fi=1001,xo=1002,fn=1003,Dh=1004;var wr=1005;var En=1006,Jo=1007;var bi=1008;var Cn=1009,Nl=1010,Ul=1011,Rs=1012,Ko=1013,Mi=1014,Hn=1015,Is=1016,Qo=1017,ea=1018,Ps=1020,Ol=35902,Fl=35899,Bl=1021,kl=1022,gn=1023,xs=1026,Ds=1027,zl=1028,ta=1029,Hl=1030,na=1031;var ia=1033,Tr=33776,Ar=33777,Cr=33778,Rr=33779,sa=35840,ra=35841,oa=35842,aa=35843,la=36196,ca=37492,ha=37496,ua=37808,da=37809,fa=37810,pa=37811,ma=37812,ga=37813,_a=37814,xa=37815,ya=37816,va=37817,ba=37818,Ma=37819,Sa=37820,Ea=37821,wa=36492,Ta=36494,Aa=36495,Ca=36283,Ra=36284,Ia=36285,Pa=36286;var er=2300,yo=2301,po=2302,yl=2400,vl=2401,bl=2402;var Lh=3200,Nh=3201;var Vl=0,Uh=1,ii="",Wt="srgb",Ni="srgb-linear",tr="linear",it="srgb";var Pi=7680;var Ml=519,Oh=512,Fh=513,Bh=514,Gl=515,kh=516,zh=517,Hh=518,Vh=519,vo=35044;var Wl="300 es",Sn=2e3,nr=2001;var Un=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Ft=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Rc=1234567,gs=Math.PI/180,ys=180/Math.PI;function Jn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ft[i&255]+Ft[i>>8&255]+Ft[i>>16&255]+Ft[i>>24&255]+"-"+Ft[e&255]+Ft[e>>8&255]+"-"+Ft[e>>16&15|64]+Ft[e>>24&255]+"-"+Ft[t&63|128]+Ft[t>>8&255]+"-"+Ft[t>>16&255]+Ft[t>>24&255]+Ft[n&255]+Ft[n>>8&255]+Ft[n>>16&255]+Ft[n>>24&255]).toLowerCase()}function qe(i,e,t){return Math.max(e,Math.min(t,i))}function Xl(i,e){return(i%e+e)%e}function cd(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function hd(i,e,t){return i!==e?(t-i)/(e-i):0}function Qs(i,e,t){return(1-t)*i+t*e}function ud(i,e,t,n){return Qs(i,e,1-Math.exp(-t*n))}function dd(i,e=1){return e-Math.abs(Xl(i,e*2)-e)}function fd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function pd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function md(i,e){return i+Math.floor(Math.random()*(e-i+1))}function gd(i,e){return i+Math.random()*(e-i)}function _d(i){return i*(.5-Math.random())}function xd(i){i!==void 0&&(Rc=i);let e=Rc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function yd(i){return i*gs}function vd(i){return i*ys}function bd(i){return(i&i-1)===0&&i!==0}function Md(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Sd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Ed(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),f=o((e-n)/2),p=r((n-e)/2),_=o((n-e)/2);switch(s){case"XYX":i.set(a*h,c*u,c*f,a*l);break;case"YZY":i.set(c*f,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*f,a*h,a*l);break;case"XZX":i.set(a*h,c*_,c*p,a*l);break;case"YXY":i.set(c*p,a*h,c*_,a*l);break;case"ZYZ":i.set(c*_,c*p,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Mn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function nt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var ql={DEG2RAD:gs,RAD2DEG:ys,generateUUID:Jn,clamp:qe,euclideanModulo:Xl,mapLinear:cd,inverseLerp:hd,lerp:Qs,damp:ud,pingpong:dd,smoothstep:fd,smootherstep:pd,randInt:md,randFloat:gd,randFloatSpread:_d,seededRandom:xd,degToRad:yd,radToDeg:vd,isPowerOfTwo:bd,ceilPowerOfTwo:Md,floorPowerOfTwo:Sd,setQuaternionFromProperEuler:Ed,normalize:nt,denormalize:Mn},Te=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},pn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3],f=r[o+0],p=r[o+1],_=r[o+2],x=r[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=p,e[t+2]=_,e[t+3]=x;return}if(u!==x||c!==f||l!==p||h!==_){let m=1-a,d=c*f+l*p+h*_+u*x,E=d>=0?1:-1,y=1-d*d;if(y>Number.EPSILON){let A=Math.sqrt(y),w=Math.atan2(A,d*E);m=Math.sin(m*w)/A,a=Math.sin(a*w)/A}let S=a*E;if(c=c*m+f*S,l=l*m+p*S,h=h*m+_*S,u=u*m+x*S,m===1-a){let A=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=A,l*=A,h*=A,u*=A}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],f=r[o+1],p=r[o+2],_=r[o+3];return e[t]=a*_+h*u+c*p-l*f,e[t+1]=c*_+h*f+l*u-a*p,e[t+2]=l*_+h*p+a*f-c*u,e[t+3]=h*_-a*u-c*f-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),f=c(n/2),p=c(s/2),_=c(r/2);switch(o){case"XYZ":this._x=f*h*u+l*p*_,this._y=l*p*u-f*h*_,this._z=l*h*_+f*p*u,this._w=l*h*u-f*p*_;break;case"YXZ":this._x=f*h*u+l*p*_,this._y=l*p*u-f*h*_,this._z=l*h*_-f*p*u,this._w=l*h*u+f*p*_;break;case"ZXY":this._x=f*h*u-l*p*_,this._y=l*p*u+f*h*_,this._z=l*h*_+f*p*u,this._w=l*h*u-f*p*_;break;case"ZYX":this._x=f*h*u-l*p*_,this._y=l*p*u+f*h*_,this._z=l*h*_-f*p*u,this._w=l*h*u+f*p*_;break;case"YZX":this._x=f*h*u+l*p*_,this._y=l*p*u+f*h*_,this._z=l*h*_-f*p*u,this._w=l*h*u-f*p*_;break;case"XZY":this._x=f*h*u-l*p*_,this._y=l*p*u-f*h*_,this._z=l*h*_+f*p*u,this._w=l*h*u+f*p*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],u=t[10],f=n+a+u;if(f>0){let p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-c)*p,this._y=(r-l)*p,this._z=(o-s)*p}else if(n>a&&n>u){let p=2*Math.sqrt(1+n-a-u);this._w=(h-c)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+l)/p}else if(a>u){let p=2*Math.sqrt(1+a-n-u);this._w=(r-l)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(c+h)/p}else{let p=2*Math.sqrt(1+u-n-a);this._w=(o-s)/p,this._x=(r+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(qe(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let p=1-t;return this._w=p*o+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-t)*h)/l,f=Math.sin(t*h)/l;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},N=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ic.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ic.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Za.copy(this).projectOnVector(e),this.sub(Za)}reflect(e){return this.sub(Za.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Za=new N,Ic=new pn,Ge=class i{constructor(e,t,n,s,r,o,a,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l)}set(e,t,n,s,r,o,a,c,l){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],p=n[5],_=n[8],x=s[0],m=s[3],d=s[6],E=s[1],y=s[4],S=s[7],A=s[2],w=s[5],C=s[8];return r[0]=o*x+a*E+c*A,r[3]=o*m+a*y+c*w,r[6]=o*d+a*S+c*C,r[1]=l*x+h*E+u*A,r[4]=l*m+h*y+u*w,r[7]=l*d+h*S+u*C,r[2]=f*x+p*E+_*A,r[5]=f*m+p*y+_*w,r[8]=f*d+p*S+_*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=h*o-a*l,f=a*c-h*r,p=l*r-o*c,_=t*u+n*f+s*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/_;return e[0]=u*x,e[1]=(s*l-h*n)*x,e[2]=(a*n-s*o)*x,e[3]=f*x,e[4]=(h*t-s*c)*x,e[5]=(s*r-a*t)*x,e[6]=p*x,e[7]=(n*c-l*t)*x,e[8]=(o*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(ja.makeScale(e,t)),this}rotate(e){return this.premultiply(ja.makeRotation(-e)),this}translate(e,t){return this.premultiply(ja.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},ja=new Ge;function Yl(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function ir(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Gh(){let i=ir("canvas");return i.style.display="block",i}var Pc={};function vs(i){i in Pc||(Pc[i]=!0,console.warn(i))}function Wh(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Dc=new Ge().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Lc=new Ge().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function wd(){let i={enabled:!0,workingColorSpace:Ni,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===it&&(s.r=Kn(s.r),s.g=Kn(s.g),s.b=Kn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===it&&(s.r=_s(s.r),s.g=_s(s.g),s.b=_s(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ii?tr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return vs("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return vs("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ni]:{primaries:e,whitePoint:n,transfer:tr,toXYZ:Dc,fromXYZ:Lc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Wt},outputColorSpaceConfig:{drawingBufferColorSpace:Wt}},[Wt]:{primaries:e,whitePoint:n,transfer:it,toXYZ:Dc,fromXYZ:Lc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Wt}}}),i}var Je=wd();function Kn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function _s(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var es,bo=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{es===void 0&&(es=ir("canvas")),es.width=e.width,es.height=e.height;let s=es.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=es}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=ir("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Kn(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Kn(t[n]/255)*255):t[n]=Kn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Td=0,bs=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Td++}),this.uuid=Jn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push($a(s[o].image)):r.push($a(s[o]))}else r=$a(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function $a(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?bo.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Ad=0,Ja=new N,jt=class i extends Un{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=fi,s=fi,r=En,o=bi,a=gn,c=Cn,l=i.DEFAULT_ANISOTROPY,h=ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ad++}),this.uuid=Jn(),this.name="",this.source=new bs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Te(0,0),this.repeat=new Te(1,1),this.center=new Te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ge,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ja).x}get height(){return this.source.getSize(Ja).y}get depth(){return this.source.getSize(Ja).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ll)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case _o:e.x=e.x-Math.floor(e.x);break;case fi:e.x=e.x<0?0:1;break;case xo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case _o:e.y=e.y-Math.floor(e.y);break;case fi:e.y=e.y<0?0:1;break;case xo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};jt.DEFAULT_IMAGE=null;jt.DEFAULT_MAPPING=Ll;jt.DEFAULT_ANISOTROPY=1;var gt=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],h=c[4],u=c[8],f=c[1],p=c[5],_=c[9],x=c[2],m=c[6],d=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(_-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(_+m)<.1&&Math.abs(l+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let y=(l+1)/2,S=(p+1)/2,A=(d+1)/2,w=(h+f)/4,C=(u+x)/4,L=(_+m)/4;return y>S&&y>A?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=w/n,r=C/n):S>A?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=w/s,r=L/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=C/r,s=L/r),this.set(n,s,r,t),this}let E=Math.sqrt((m-_)*(m-_)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(E)<.001&&(E=1),this.x=(m-_)/E,this.y=(u-x)/E,this.z=(f-h)/E,this.w=Math.acos((l+p+d-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this.w=qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this.w=qe(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Mo=class extends Un{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:En,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new gt(0,0,e,t),this.scissorTest=!1,this.viewport=new gt(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new jt(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:En,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new bs(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},On=class extends Mo{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},sr=class extends jt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=fn,this.minFilter=fn,this.wrapR=fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var So=class extends jt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=fn,this.minFilter=fn,this.wrapR=fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Fn=class{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(yn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(yn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=yn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,yn):yn.fromBufferAttribute(r,o),yn.applyMatrix4(e.matrixWorld),this.expandByPoint(yn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Hr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Hr.copy(n.boundingBox)),Hr.applyMatrix4(e.matrixWorld),this.union(Hr)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,yn),yn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Xs),Vr.subVectors(this.max,Xs),ts.subVectors(e.a,Xs),ns.subVectors(e.b,Xs),is.subVectors(e.c,Xs),ai.subVectors(ns,ts),li.subVectors(is,ns),Ai.subVectors(ts,is);let t=[0,-ai.z,ai.y,0,-li.z,li.y,0,-Ai.z,Ai.y,ai.z,0,-ai.x,li.z,0,-li.x,Ai.z,0,-Ai.x,-ai.y,ai.x,0,-li.y,li.x,0,-Ai.y,Ai.x,0];return!Ka(t,ts,ns,is,Vr)||(t=[1,0,0,0,1,0,0,0,1],!Ka(t,ts,ns,is,Vr))?!1:(Gr.crossVectors(ai,li),t=[Gr.x,Gr.y,Gr.z],Ka(t,ts,ns,is,Vr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,yn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(yn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(qn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),qn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),qn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),qn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),qn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),qn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),qn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),qn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(qn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},qn=[new N,new N,new N,new N,new N,new N,new N,new N],yn=new N,Hr=new Fn,ts=new N,ns=new N,is=new N,ai=new N,li=new N,Ai=new N,Xs=new N,Vr=new N,Gr=new N,Ci=new N;function Ka(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Ci.fromArray(i,r);let a=s.x*Math.abs(Ci.x)+s.y*Math.abs(Ci.y)+s.z*Math.abs(Ci.z),c=e.dot(Ci),l=t.dot(Ci),h=n.dot(Ci);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var Cd=new Fn,qs=new N,Qa=new N,Ui=class{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Cd.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;qs.subVectors(e,this.center);let t=qs.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(qs,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Qa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(qs.copy(e.center).add(Qa)),this.expandByPoint(qs.copy(e.center).sub(Qa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Yn=new N,el=new N,Wr=new N,ci=new N,tl=new N,Xr=new N,nl=new N,mi=class{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Yn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Yn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Yn.copy(this.origin).addScaledVector(this.direction,t),Yn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){el.copy(e).add(t).multiplyScalar(.5),Wr.copy(t).sub(e).normalize(),ci.copy(this.origin).sub(el);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Wr),a=ci.dot(this.direction),c=-ci.dot(Wr),l=ci.lengthSq(),h=Math.abs(1-o*o),u,f,p,_;if(h>0)if(u=o*c-a,f=o*a-c,_=r*h,u>=0)if(f>=-_)if(f<=_){let x=1/h;u*=x,f*=x,p=u*(u+o*f+2*a)+f*(o*u+f+2*c)+l}else f=r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+l;else f<=-_?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+l):f<=_?(u=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+l):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+l);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(el).addScaledVector(Wr,f),p}intersectSphere(e,t){Yn.subVectors(e.center,this.origin);let n=Yn.dot(this.direction),s=Yn.dot(Yn)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,s=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,s=(e.min.x-f.x)*l),h>=0?(r=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-f.z)*u,c=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,c=(e.min.z-f.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Yn)!==null}intersectTriangle(e,t,n,s,r){tl.subVectors(t,e),Xr.subVectors(n,e),nl.crossVectors(tl,Xr);let o=this.direction.dot(nl),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ci.subVectors(this.origin,e);let c=a*this.direction.dot(Xr.crossVectors(ci,Xr));if(c<0)return null;let l=a*this.direction.dot(tl.cross(ci));if(l<0||c+l>o)return null;let h=-a*ci.dot(nl);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ht=class i{constructor(e,t,n,s,r,o,a,c,l,h,u,f,p,_,x,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,h,u,f,p,_,x,m)}set(e,t,n,s,r,o,a,c,l,h,u,f,p,_,x,m){let d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=c,d[2]=l,d[6]=h,d[10]=u,d[14]=f,d[3]=p,d[7]=_,d[11]=x,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/ss.setFromMatrixColumn(e,0).length(),r=1/ss.setFromMatrixColumn(e,1).length(),o=1/ss.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let f=o*h,p=o*u,_=a*h,x=a*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=p+_*l,t[5]=f-x*l,t[9]=-a*c,t[2]=x-f*l,t[6]=_+p*l,t[10]=o*c}else if(e.order==="YXZ"){let f=c*h,p=c*u,_=l*h,x=l*u;t[0]=f+x*a,t[4]=_*a-p,t[8]=o*l,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=p*a-_,t[6]=x+f*a,t[10]=o*c}else if(e.order==="ZXY"){let f=c*h,p=c*u,_=l*h,x=l*u;t[0]=f-x*a,t[4]=-o*u,t[8]=_+p*a,t[1]=p+_*a,t[5]=o*h,t[9]=x-f*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let f=o*h,p=o*u,_=a*h,x=a*u;t[0]=c*h,t[4]=_*l-p,t[8]=f*l+x,t[1]=c*u,t[5]=x*l+f,t[9]=p*l-_,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let f=o*c,p=o*l,_=a*c,x=a*l;t[0]=c*h,t[4]=x-f*u,t[8]=_*u+p,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=p*u+_,t[10]=f-x*u}else if(e.order==="XZY"){let f=o*c,p=o*l,_=a*c,x=a*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=f*u+x,t[5]=o*h,t[9]=p*u-_,t[2]=_*u-p,t[6]=a*h,t[10]=x*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Rd,e,Id)}lookAt(e,t,n){let s=this.elements;return en.subVectors(e,t),en.lengthSq()===0&&(en.z=1),en.normalize(),hi.crossVectors(n,en),hi.lengthSq()===0&&(Math.abs(n.z)===1?en.x+=1e-4:en.z+=1e-4,en.normalize(),hi.crossVectors(n,en)),hi.normalize(),qr.crossVectors(en,hi),s[0]=hi.x,s[4]=qr.x,s[8]=en.x,s[1]=hi.y,s[5]=qr.y,s[9]=en.y,s[2]=hi.z,s[6]=qr.z,s[10]=en.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],p=n[13],_=n[2],x=n[6],m=n[10],d=n[14],E=n[3],y=n[7],S=n[11],A=n[15],w=s[0],C=s[4],L=s[8],v=s[12],b=s[1],D=s[5],O=s[9],V=s[13],Y=s[2],X=s[6],q=s[10],ie=s[14],R=s[3],Z=s[7],J=s[11],ue=s[15];return r[0]=o*w+a*b+c*Y+l*R,r[4]=o*C+a*D+c*X+l*Z,r[8]=o*L+a*O+c*q+l*J,r[12]=o*v+a*V+c*ie+l*ue,r[1]=h*w+u*b+f*Y+p*R,r[5]=h*C+u*D+f*X+p*Z,r[9]=h*L+u*O+f*q+p*J,r[13]=h*v+u*V+f*ie+p*ue,r[2]=_*w+x*b+m*Y+d*R,r[6]=_*C+x*D+m*X+d*Z,r[10]=_*L+x*O+m*q+d*J,r[14]=_*v+x*V+m*ie+d*ue,r[3]=E*w+y*b+S*Y+A*R,r[7]=E*C+y*D+S*X+A*Z,r[11]=E*L+y*O+S*q+A*J,r[15]=E*v+y*V+S*ie+A*ue,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],u=e[6],f=e[10],p=e[14],_=e[3],x=e[7],m=e[11],d=e[15];return _*(+r*c*u-s*l*u-r*a*f+n*l*f+s*a*p-n*c*p)+x*(+t*c*p-t*l*f+r*o*f-s*o*p+s*l*h-r*c*h)+m*(+t*l*u-t*a*p-r*o*u+n*o*p+r*a*h-n*l*h)+d*(-s*a*h-t*c*u+t*a*f+s*o*u-n*o*f+n*c*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=e[9],f=e[10],p=e[11],_=e[12],x=e[13],m=e[14],d=e[15],E=u*m*l-x*f*l+x*c*p-a*m*p-u*c*d+a*f*d,y=_*f*l-h*m*l-_*c*p+o*m*p+h*c*d-o*f*d,S=h*x*l-_*u*l+_*a*p-o*x*p-h*a*d+o*u*d,A=_*u*c-h*x*c-_*a*f+o*x*f+h*a*m-o*u*m,w=t*E+n*y+s*S+r*A;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/w;return e[0]=E*C,e[1]=(x*f*r-u*m*r-x*s*p+n*m*p+u*s*d-n*f*d)*C,e[2]=(a*m*r-x*c*r+x*s*l-n*m*l-a*s*d+n*c*d)*C,e[3]=(u*c*r-a*f*r-u*s*l+n*f*l+a*s*p-n*c*p)*C,e[4]=y*C,e[5]=(h*m*r-_*f*r+_*s*p-t*m*p-h*s*d+t*f*d)*C,e[6]=(_*c*r-o*m*r-_*s*l+t*m*l+o*s*d-t*c*d)*C,e[7]=(o*f*r-h*c*r+h*s*l-t*f*l-o*s*p+t*c*p)*C,e[8]=S*C,e[9]=(_*u*r-h*x*r-_*n*p+t*x*p+h*n*d-t*u*d)*C,e[10]=(o*x*r-_*a*r+_*n*l-t*x*l-o*n*d+t*a*d)*C,e[11]=(h*a*r-o*u*r-h*n*l+t*u*l+o*n*p-t*a*p)*C,e[12]=A*C,e[13]=(h*x*s-_*u*s+_*n*f-t*x*f-h*n*m+t*u*m)*C,e[14]=(_*a*s-o*x*s-_*n*c+t*x*c+o*n*m-t*a*m)*C,e[15]=(o*u*s-h*a*s+h*n*c-t*u*c-o*n*f+t*a*f)*C,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,h=o+o,u=a+a,f=r*l,p=r*h,_=r*u,x=o*h,m=o*u,d=a*u,E=c*l,y=c*h,S=c*u,A=n.x,w=n.y,C=n.z;return s[0]=(1-(x+d))*A,s[1]=(p+S)*A,s[2]=(_-y)*A,s[3]=0,s[4]=(p-S)*w,s[5]=(1-(f+d))*w,s[6]=(m+E)*w,s[7]=0,s[8]=(_+y)*C,s[9]=(m-E)*C,s[10]=(1-(f+x))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=ss.set(s[0],s[1],s[2]).length(),o=ss.set(s[4],s[5],s[6]).length(),a=ss.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],vn.copy(this);let l=1/r,h=1/o,u=1/a;return vn.elements[0]*=l,vn.elements[1]*=l,vn.elements[2]*=l,vn.elements[4]*=h,vn.elements[5]*=h,vn.elements[6]*=h,vn.elements[8]*=u,vn.elements[9]*=u,vn.elements[10]*=u,t.setFromRotationMatrix(vn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=Sn,c=!1){let l=this.elements,h=2*r/(t-e),u=2*r/(n-s),f=(t+e)/(t-e),p=(n+s)/(n-s),_,x;if(c)_=r/(o-r),x=o*r/(o-r);else if(a===Sn)_=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===nr)_=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=_,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Sn,c=!1){let l=this.elements,h=2/(t-e),u=2/(n-s),f=-(t+e)/(t-e),p=-(n+s)/(n-s),_,x;if(c)_=1/(o-r),x=o/(o-r);else if(a===Sn)_=-2/(o-r),x=-(o+r)/(o-r);else if(a===nr)_=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=_,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},ss=new N,vn=new ht,Rd=new N(0,0,0),Id=new N(1,1,1),hi=new N,qr=new N,en=new N,Nc=new ht,Uc=new pn,wn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(qe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-qe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(qe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Nc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Nc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Uc.setFromEuler(this),this.setFromQuaternion(Uc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};wn.DEFAULT_ORDER="XYZ";var Ms=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Pd=0,Oc=new N,rs=new pn,Zn=new ht,Yr=new N,Ys=new N,Dd=new N,Ld=new pn,Fc=new N(1,0,0),Bc=new N(0,1,0),kc=new N(0,0,1),zc={type:"added"},Nd={type:"removed"},os={type:"childadded",child:null},il={type:"childremoved",child:null},Dt=class i extends Un{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Pd++}),this.uuid=Jn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new N,t=new wn,n=new pn,s=new N(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ht},normalMatrix:{value:new Ge}}),this.matrix=new ht,this.matrixWorld=new ht,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ms,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return rs.setFromAxisAngle(e,t),this.quaternion.multiply(rs),this}rotateOnWorldAxis(e,t){return rs.setFromAxisAngle(e,t),this.quaternion.premultiply(rs),this}rotateX(e){return this.rotateOnAxis(Fc,e)}rotateY(e){return this.rotateOnAxis(Bc,e)}rotateZ(e){return this.rotateOnAxis(kc,e)}translateOnAxis(e,t){return Oc.copy(e).applyQuaternion(this.quaternion),this.position.add(Oc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Fc,e)}translateY(e){return this.translateOnAxis(Bc,e)}translateZ(e){return this.translateOnAxis(kc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Zn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Yr.copy(e):Yr.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Ys.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Zn.lookAt(Ys,Yr,this.up):Zn.lookAt(Yr,Ys,this.up),this.quaternion.setFromRotationMatrix(Zn),s&&(Zn.extractRotation(s.matrixWorld),rs.setFromRotationMatrix(Zn),this.quaternion.premultiply(rs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(zc),os.child=e,this.dispatchEvent(os),os.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Nd),il.child=e,this.dispatchEvent(il),il.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Zn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Zn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Zn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(zc),os.child=e,this.dispatchEvent(os),os.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ys,e,Dd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ys,Ld,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),u=o(e.shapes),f=o(e.skeletons),p=o(e.animations),_=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),_.length>0&&(n.nodes=_)}return n.object=s,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Dt.DEFAULT_UP=new N(0,1,0);Dt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var bn=new N,jn=new N,sl=new N,$n=new N,as=new N,ls=new N,Hc=new N,rl=new N,ol=new N,al=new N,ll=new gt,cl=new gt,hl=new gt,Ln=class i{constructor(e=new N,t=new N,n=new N){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),bn.subVectors(e,t),s.cross(bn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){bn.subVectors(s,t),jn.subVectors(n,t),sl.subVectors(e,t);let o=bn.dot(bn),a=bn.dot(jn),c=bn.dot(sl),l=jn.dot(jn),h=jn.dot(sl),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;let f=1/u,p=(l*c-a*h)*f,_=(o*h-a*c)*f;return r.set(1-p-_,_,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,$n)===null?!1:$n.x>=0&&$n.y>=0&&$n.x+$n.y<=1}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,$n)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,$n.x),c.addScaledVector(o,$n.y),c.addScaledVector(a,$n.z),c)}static getInterpolatedAttribute(e,t,n,s,r,o){return ll.setScalar(0),cl.setScalar(0),hl.setScalar(0),ll.fromBufferAttribute(e,t),cl.fromBufferAttribute(e,n),hl.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(ll,r.x),o.addScaledVector(cl,r.y),o.addScaledVector(hl,r.z),o}static isFrontFacing(e,t,n,s){return bn.subVectors(n,t),jn.subVectors(e,t),bn.cross(jn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return bn.subVectors(this.c,this.b),jn.subVectors(this.a,this.b),bn.cross(jn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;as.subVectors(s,n),ls.subVectors(r,n),rl.subVectors(e,n);let c=as.dot(rl),l=ls.dot(rl);if(c<=0&&l<=0)return t.copy(n);ol.subVectors(e,s);let h=as.dot(ol),u=ls.dot(ol);if(h>=0&&u<=h)return t.copy(s);let f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(as,o);al.subVectors(e,r);let p=as.dot(al),_=ls.dot(al);if(_>=0&&p<=_)return t.copy(r);let x=p*l-c*_;if(x<=0&&l>=0&&_<=0)return a=l/(l-_),t.copy(n).addScaledVector(ls,a);let m=h*_-p*u;if(m<=0&&u-h>=0&&p-_>=0)return Hc.subVectors(r,s),a=(u-h)/(u-h+(p-_)),t.copy(s).addScaledVector(Hc,a);let d=1/(m+x+f);return o=x*d,a=f*d,t.copy(n).addScaledVector(as,o).addScaledVector(ls,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Xh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ui={h:0,s:0,l:0},Zr={h:0,s:0,l:0};function ul(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var ze=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Wt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Je.workingColorSpace){return this.r=e,this.g=t,this.b=n,Je.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Je.workingColorSpace){if(e=Xl(e,1),t=qe(t,0,1),n=qe(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=ul(o,r,e+1/3),this.g=ul(o,r,e),this.b=ul(o,r,e-1/3)}return Je.colorSpaceToWorking(this,s),this}setStyle(e,t=Wt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Wt){let n=Xh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Kn(e.r),this.g=Kn(e.g),this.b=Kn(e.b),this}copyLinearToSRGB(e){return this.r=_s(e.r),this.g=_s(e.g),this.b=_s(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Wt){return Je.workingToColorSpace(Bt.copy(this),e),Math.round(qe(Bt.r*255,0,255))*65536+Math.round(qe(Bt.g*255,0,255))*256+Math.round(qe(Bt.b*255,0,255))}getHexString(e=Wt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.workingToColorSpace(Bt.copy(this),t);let n=Bt.r,s=Bt.g,r=Bt.b,o=Math.max(n,s,r),a=Math.min(n,s,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=Je.workingColorSpace){return Je.workingToColorSpace(Bt.copy(this),t),e.r=Bt.r,e.g=Bt.g,e.b=Bt.b,e}getStyle(e=Wt){Je.workingToColorSpace(Bt.copy(this),e);let t=Bt.r,n=Bt.g,s=Bt.b;return e!==Wt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ui),this.setHSL(ui.h+e,ui.s+t,ui.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ui),e.getHSL(Zr);let n=Qs(ui.h,Zr.h,t),s=Qs(ui.s,Zr.s,t),r=Qs(ui.l,Zr.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Bt=new ze;ze.NAMES=Xh;var Ud=0,Bn=class extends Un{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ud++}),this.uuid=Jn(),this.name="",this.type="Material",this.blending=Di,this.side=Qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=mo,this.blendDst=go,this.blendEquation=pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ze(0,0,0),this.blendAlpha=0,this.depthFunc=Li,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ml,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pi,this.stencilZFail=Pi,this.stencilZPass=Pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Di&&(n.blending=this.blending),this.side!==Qn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==mo&&(n.blendSrc=this.blendSrc),this.blendDst!==go&&(n.blendDst=this.blendDst),this.blendEquation!==pi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Li&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ml&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Pi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Pi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Pi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},mn=class extends Bn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wn,this.combine=Dl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Et=new N,jr=new Te,Od=0,Zt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Od++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=vo,this.updateRanges=[],this.gpuType=Hn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)jr.fromBufferAttribute(this,t),jr.applyMatrix3(e),this.setXY(t,jr.x,jr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix3(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix4(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyNormalMatrix(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.transformDirection(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Mn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=nt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Mn(t,this.array)),t}setX(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Mn(t,this.array)),t}setY(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Mn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Mn(t,this.array)),t}setW(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array),s=nt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array),s=nt(s,this.array),r=nt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==vo&&(e.usage=this.usage),e}};var rr=class extends Zt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var or=class extends Zt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var st=class extends Zt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Fd=0,un=new ht,dl=new Dt,cs=new N,tn=new Fn,Zs=new Fn,It=new N,_t=class i extends Un{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Fd++}),this.uuid=Jn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Yl(e)?or:rr)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ge().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return un.makeRotationFromQuaternion(e),this.applyMatrix4(un),this}rotateX(e){return un.makeRotationX(e),this.applyMatrix4(un),this}rotateY(e){return un.makeRotationY(e),this.applyMatrix4(un),this}rotateZ(e){return un.makeRotationZ(e),this.applyMatrix4(un),this}translate(e,t,n){return un.makeTranslation(e,t,n),this.applyMatrix4(un),this}scale(e,t,n){return un.makeScale(e,t,n),this.applyMatrix4(un),this}lookAt(e){return dl.lookAt(e),dl.updateMatrix(),this.applyMatrix4(dl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(cs).negate(),this.translate(cs.x,cs.y,cs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new st(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Fn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];tn.setFromBufferAttribute(r),this.morphTargetsRelative?(It.addVectors(this.boundingBox.min,tn.min),this.boundingBox.expandByPoint(It),It.addVectors(this.boundingBox.max,tn.max),this.boundingBox.expandByPoint(It)):(this.boundingBox.expandByPoint(tn.min),this.boundingBox.expandByPoint(tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ui);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){let n=this.boundingSphere.center;if(tn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Zs.setFromBufferAttribute(a),this.morphTargetsRelative?(It.addVectors(tn.min,Zs.min),tn.expandByPoint(It),It.addVectors(tn.max,Zs.max),tn.expandByPoint(It)):(tn.expandByPoint(Zs.min),tn.expandByPoint(Zs.max))}tn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)It.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(It));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)It.fromBufferAttribute(a,l),c&&(cs.fromBufferAttribute(e,l),It.add(cs)),s=Math.max(s,n.distanceToSquared(It))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Zt(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let L=0;L<n.count;L++)a[L]=new N,c[L]=new N;let l=new N,h=new N,u=new N,f=new Te,p=new Te,_=new Te,x=new N,m=new N;function d(L,v,b){l.fromBufferAttribute(n,L),h.fromBufferAttribute(n,v),u.fromBufferAttribute(n,b),f.fromBufferAttribute(r,L),p.fromBufferAttribute(r,v),_.fromBufferAttribute(r,b),h.sub(l),u.sub(l),p.sub(f),_.sub(f);let D=1/(p.x*_.y-_.x*p.y);isFinite(D)&&(x.copy(h).multiplyScalar(_.y).addScaledVector(u,-p.y).multiplyScalar(D),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-_.x).multiplyScalar(D),a[L].add(x),a[v].add(x),a[b].add(x),c[L].add(m),c[v].add(m),c[b].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let L=0,v=E.length;L<v;++L){let b=E[L],D=b.start,O=b.count;for(let V=D,Y=D+O;V<Y;V+=3)d(e.getX(V+0),e.getX(V+1),e.getX(V+2))}let y=new N,S=new N,A=new N,w=new N;function C(L){A.fromBufferAttribute(s,L),w.copy(A);let v=a[L];y.copy(v),y.sub(A.multiplyScalar(A.dot(v))).normalize(),S.crossVectors(w,v);let D=S.dot(c[L])<0?-1:1;o.setXYZW(L,y.x,y.y,y.z,D)}for(let L=0,v=E.length;L<v;++L){let b=E[L],D=b.start,O=b.count;for(let V=D,Y=D+O;V<Y;V+=3)C(e.getX(V+0)),C(e.getX(V+1)),C(e.getX(V+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Zt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);let s=new N,r=new N,o=new N,a=new N,c=new N,l=new N,h=new N,u=new N;if(e)for(let f=0,p=e.count;f<p;f+=3){let _=e.getX(f+0),x=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,_),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(_,a.x,a.y,a.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,p=t.count;f<p;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)It.fromBufferAttribute(e,t),It.normalize(),e.setXYZ(t,It.x,It.y,It.z)}toNonIndexed(){function e(a,c){let l=a.array,h=a.itemSize,u=a.normalized,f=new l.constructor(c.length*h),p=0,_=0;for(let x=0,m=c.length;x<m;x++){a.isInterleavedBufferAttribute?p=c[x]*a.data.stride+a.offset:p=c[x]*h;for(let d=0;d<h;d++)f[_++]=l[p++]}return new Zt(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=e(c,n);t.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){let f=l[h],p=e(f,n);c.push(p)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){let p=l[u];h.push(p.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(t))}let r=e.morphAttributes;for(let l in r){let h=[],u=r[l];for(let f=0,p=u.length;f<p;f++)h.push(u[f].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,h=o.length;l<h;l++){let u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Vc=new ht,Ri=new mi,$r=new Ui,Gc=new N,Jr=new N,Kr=new N,Qr=new N,fl=new N,eo=new N,Wc=new N,to=new N,vt=class extends Dt{constructor(e=new _t,t=new mn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){eo.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],u=r[c];h!==0&&(fl.fromBufferAttribute(u,e),o?eo.addScaledVector(fl,h):eo.addScaledVector(fl.sub(t),h))}t.add(eo)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),$r.copy(n.boundingSphere),$r.applyMatrix4(r),Ri.copy(e.ray).recast(e.near),!($r.containsPoint(Ri.origin)===!1&&(Ri.intersectSphere($r,Gc)===null||Ri.origin.distanceToSquared(Gc)>(e.far-e.near)**2))&&(Vc.copy(r).invert(),Ri.copy(e.ray).applyMatrix4(Vc),!(n.boundingBox!==null&&Ri.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ri)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,x=f.length;_<x;_++){let m=f[_],d=o[m.materialIndex],E=Math.max(m.start,p.start),y=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let S=E,A=y;S<A;S+=3){let w=a.getX(S),C=a.getX(S+1),L=a.getX(S+2);s=no(this,d,e,n,l,h,u,w,C,L),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let _=Math.max(0,p.start),x=Math.min(a.count,p.start+p.count);for(let m=_,d=x;m<d;m+=3){let E=a.getX(m),y=a.getX(m+1),S=a.getX(m+2);s=no(this,o,e,n,l,h,u,E,y,S),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let _=0,x=f.length;_<x;_++){let m=f[_],d=o[m.materialIndex],E=Math.max(m.start,p.start),y=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let S=E,A=y;S<A;S+=3){let w=S,C=S+1,L=S+2;s=no(this,d,e,n,l,h,u,w,C,L),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let _=Math.max(0,p.start),x=Math.min(c.count,p.start+p.count);for(let m=_,d=x;m<d;m+=3){let E=m,y=m+1,S=m+2;s=no(this,o,e,n,l,h,u,E,y,S),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function Bd(i,e,t,n,s,r,o,a){let c;if(e.side===qt?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===Qn,a),c===null)return null;to.copy(a),to.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(to);return l<t.near||l>t.far?null:{distance:l,point:to.clone(),object:i}}function no(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,Jr),i.getVertexPosition(c,Kr),i.getVertexPosition(l,Qr);let h=Bd(i,e,t,n,Jr,Kr,Qr,Wc);if(h){let u=new N;Ln.getBarycoord(Wc,Jr,Kr,Qr,u),s&&(h.uv=Ln.getInterpolatedAttribute(s,a,c,l,u,new Te)),r&&(h.uv1=Ln.getInterpolatedAttribute(r,a,c,l,u,new Te)),o&&(h.normal=Ln.getInterpolatedAttribute(o,a,c,l,u,new N),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a,b:c,c:l,normal:new N,materialIndex:0};Ln.getNormal(Jr,Kr,Qr,f.normal),h.face=f,h.barycoord=u}return h}var kt=class i extends _t{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],u=[],f=0,p=0;_("z","y","x",-1,-1,n,t,e,o,r,0),_("z","y","x",1,-1,n,t,-e,o,r,1),_("x","z","y",1,1,e,n,t,s,o,2),_("x","z","y",1,-1,e,n,-t,s,o,3),_("x","y","z",1,-1,e,t,n,s,r,4),_("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new st(l,3)),this.setAttribute("normal",new st(h,3)),this.setAttribute("uv",new st(u,2));function _(x,m,d,E,y,S,A,w,C,L,v){let b=S/C,D=A/L,O=S/2,V=A/2,Y=w/2,X=C+1,q=L+1,ie=0,R=0,Z=new N;for(let J=0;J<q;J++){let ue=J*D-V;for(let ve=0;ve<X;ve++){let ee=ve*b-O;Z[x]=ee*E,Z[m]=ue*y,Z[d]=Y,l.push(Z.x,Z.y,Z.z),Z[x]=0,Z[m]=0,Z[d]=w>0?1:-1,h.push(Z.x,Z.y,Z.z),u.push(ve/C),u.push(1-J/L),ie+=1}}for(let J=0;J<L;J++)for(let ue=0;ue<C;ue++){let ve=f+ue+X*J,ee=f+ue+X*(J+1),ce=f+(ue+1)+X*(J+1),Me=f+(ue+1)+X*J;c.push(ve,ee,Me),c.push(ee,ce,Me),R+=6}a.addGroup(p,R,v),p+=R,f+=ie}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Gi(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function zt(i){let e={};for(let t=0;t<i.length;t++){let n=Gi(i[t]);for(let s in n)e[s]=n[s]}return e}function kd(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Zl(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}var qh={clone:Gi,merge:zt},zd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Hd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Tn=class extends Bn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=zd,this.fragmentShader=Hd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Gi(e.uniforms),this.uniformsGroups=kd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},ar=class extends Dt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ht,this.projectionMatrix=new ht,this.projectionMatrixInverse=new ht,this.coordinateSystem=Sn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},di=new N,Xc=new Te,qc=new Te,Pt=class extends ar{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ys*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(gs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ys*2*Math.atan(Math.tan(gs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(di.x,di.y).multiplyScalar(-e/di.z),di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(di.x,di.y).multiplyScalar(-e/di.z)}getViewSize(e,t){return this.getViewBounds(e,Xc,qc),t.subVectors(qc,Xc)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(gs*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},hs=-90,us=1,Eo=class extends Dt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Pt(hs,us,e,t);s.layers=this.layers,this.add(s);let r=new Pt(hs,us,e,t);r.layers=this.layers,this.add(r);let o=new Pt(hs,us,e,t);o.layers=this.layers,this.add(o);let a=new Pt(hs,us,e,t);a.layers=this.layers,this.add(a);let c=new Pt(hs,us,e,t);c.layers=this.layers,this.add(c);let l=new Pt(hs,us,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(let l of t)this.remove(l);if(e===Sn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===nr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,f,p),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}},lr=class extends jt{constructor(e=[],t=Hi,n,s,r,o,a,c,l,h){super(e,t,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},wo=class extends On{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new lr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new kt(5,5,5),r=new Tn({name:"CubemapFromEquirect",uniforms:Gi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qt,blending:ti});r.uniforms.tEquirect.value=t;let o=new vt(s,r),a=t.minFilter;return t.minFilter===bi&&(t.minFilter=En),new Eo(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},Nn=class extends Dt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Vd={type:"move"},Ss=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Nn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Nn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Nn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let x of e.hand.values()){let m=t.getJointPose(x,n),d=this._getHandJoint(l,x);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),p=.02,_=.005;l.inputState.pinching&&f>p+_?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=p-_&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Vd)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Nn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var cr=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new ze(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Oi=class extends Dt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new wn,this.environmentIntensity=1,this.environmentRotation=new wn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},To=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=vo,this.updateRanges=[],this.version=0,this.uuid=Jn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Jn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Jn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Gt=new N,hr=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix4(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyNormalMatrix(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.transformDirection(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Mn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=nt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Mn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Mn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Mn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Mn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array),s=nt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array),s=nt(s,this.array),r=nt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Zt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Es=class extends Bn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ze(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ds,js=new N,fs=new N,ps=new N,ms=new Te,$s=new Te,Yh=new ht,io=new N,Js=new N,so=new N,Yc=new Te,pl=new Te,Zc=new Te,ur=class extends Dt{constructor(e=new Es){if(super(),this.isSprite=!0,this.type="Sprite",ds===void 0){ds=new _t;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new To(t,5);ds.setIndex([0,1,2,0,2,3]),ds.setAttribute("position",new hr(n,3,0,!1)),ds.setAttribute("uv",new hr(n,2,3,!1))}this.geometry=ds,this.material=e,this.center=new Te(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),fs.setFromMatrixScale(this.matrixWorld),Yh.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ps.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&fs.multiplyScalar(-ps.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;ro(io.set(-.5,-.5,0),ps,o,fs,s,r),ro(Js.set(.5,-.5,0),ps,o,fs,s,r),ro(so.set(.5,.5,0),ps,o,fs,s,r),Yc.set(0,0),pl.set(1,0),Zc.set(1,1);let a=e.ray.intersectTriangle(io,Js,so,!1,js);if(a===null&&(ro(Js.set(-.5,.5,0),ps,o,fs,s,r),pl.set(0,1),a=e.ray.intersectTriangle(io,so,Js,!1,js),a===null))return;let c=e.ray.origin.distanceTo(js);c<e.near||c>e.far||t.push({distance:c,point:js.clone(),uv:Ln.getInterpolation(js,io,Js,so,Yc,pl,Zc,new Te),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function ro(i,e,t,n,s,r){ms.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?($s.x=r*ms.x-s*ms.y,$s.y=s*ms.x+r*ms.y):$s.copy(ms),i.copy(e),i.x+=$s.x,i.y+=$s.y,i.applyMatrix4(Yh)}var ml=new N,Gd=new N,Wd=new Ge,dn=class{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=ml.subVectors(n,t).cross(Gd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(ml),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Wd.getNormalMatrix(e),s=this.coplanarPoint(ml).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ii=new Ui,Xd=new Te(.5,.5),oo=new N,ws=class{constructor(e=new dn,t=new dn,n=new dn,s=new dn,r=new dn,o=new dn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Sn,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],h=r[4],u=r[5],f=r[6],p=r[7],_=r[8],x=r[9],m=r[10],d=r[11],E=r[12],y=r[13],S=r[14],A=r[15];if(s[0].setComponents(l-o,p-h,d-_,A-E).normalize(),s[1].setComponents(l+o,p+h,d+_,A+E).normalize(),s[2].setComponents(l+a,p+u,d+x,A+y).normalize(),s[3].setComponents(l-a,p-u,d-x,A-y).normalize(),n)s[4].setComponents(c,f,m,S).normalize(),s[5].setComponents(l-c,p-f,d-m,A-S).normalize();else if(s[4].setComponents(l-c,p-f,d-m,A-S).normalize(),t===Sn)s[5].setComponents(l+c,p+f,d+m,A+S).normalize();else if(t===nr)s[5].setComponents(c,f,m,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ii.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ii.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ii)}intersectsSprite(e){Ii.center.set(0,0,0);let t=Xd.distanceTo(e.center);return Ii.radius=.7071067811865476+t,Ii.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ii)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(oo.x=s.normal.x>0?e.max.x:e.min.x,oo.y=s.normal.y>0?e.max.y:e.min.y,oo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(oo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var An=class extends Bn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Ao=new N,Co=new N,jc=new ht,Ks=new mi,ao=new Ui,gl=new N,$c=new N,Ts=class extends Dt{constructor(e=new _t,t=new An){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Ao.fromBufferAttribute(t,s-1),Co.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Ao.distanceTo(Co);e.setAttribute("lineDistance",new st(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ao.copy(n.boundingSphere),ao.applyMatrix4(s),ao.radius+=r,e.ray.intersectsSphere(ao)===!1)return;jc.copy(s).invert(),Ks.copy(e.ray).applyMatrix4(jc);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){let p=Math.max(0,o.start),_=Math.min(h.count,o.start+o.count);for(let x=p,m=_-1;x<m;x+=l){let d=h.getX(x),E=h.getX(x+1),y=lo(this,e,Ks,c,d,E,x);y&&t.push(y)}if(this.isLineLoop){let x=h.getX(_-1),m=h.getX(p),d=lo(this,e,Ks,c,x,m,_-1);d&&t.push(d)}}else{let p=Math.max(0,o.start),_=Math.min(f.count,o.start+o.count);for(let x=p,m=_-1;x<m;x+=l){let d=lo(this,e,Ks,c,x,x+1,x);d&&t.push(d)}if(this.isLineLoop){let x=lo(this,e,Ks,c,_-1,p,_-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function lo(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(Ao.fromBufferAttribute(a,s),Co.fromBufferAttribute(a,r),t.distanceSqToSegment(Ao,Co,gl,$c)>n)return;gl.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(gl);if(!(l<e.near||l>e.far))return{distance:l,point:$c.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var Jc=new N,Kc=new N,ei=class extends Ts{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Jc.fromBufferAttribute(t,s),Kc.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Jc.distanceTo(Kc);e.setAttribute("lineDistance",new st(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Fi=class extends jt{constructor(e,t,n,s,r,o,a,c,l){super(e,t,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},dr=class extends jt{constructor(e,t,n=Mi,s,r,o,a=fn,c=fn,l,h=xs,u=1){if(h!==xs&&h!==Ds)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:u};super(f,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new bs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},fr=class extends jt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var wt=class i extends _t{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],f=[],p=[],_=0,x=[],m=n/2,d=0;E(),o===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new st(u,3)),this.setAttribute("normal",new st(f,3)),this.setAttribute("uv",new st(p,2));function E(){let S=new N,A=new N,w=0,C=(t-e)/n;for(let L=0;L<=r;L++){let v=[],b=L/r,D=b*(t-e)+e;for(let O=0;O<=s;O++){let V=O/s,Y=V*c+a,X=Math.sin(Y),q=Math.cos(Y);A.x=D*X,A.y=-b*n+m,A.z=D*q,u.push(A.x,A.y,A.z),S.set(X,C,q).normalize(),f.push(S.x,S.y,S.z),p.push(V,1-b),v.push(_++)}x.push(v)}for(let L=0;L<s;L++)for(let v=0;v<r;v++){let b=x[v][L],D=x[v+1][L],O=x[v+1][L+1],V=x[v][L+1];(e>0||v!==0)&&(h.push(b,D,V),w+=3),(t>0||v!==r-1)&&(h.push(D,O,V),w+=3)}l.addGroup(d,w,0),d+=w}function y(S){let A=_,w=new Te,C=new N,L=0,v=S===!0?e:t,b=S===!0?1:-1;for(let O=1;O<=s;O++)u.push(0,m*b,0),f.push(0,b,0),p.push(.5,.5),_++;let D=_;for(let O=0;O<=s;O++){let Y=O/s*c+a,X=Math.cos(Y),q=Math.sin(Y);C.x=v*q,C.y=m*b,C.z=v*X,u.push(C.x,C.y,C.z),f.push(0,b,0),w.x=X*.5+.5,w.y=q*.5*b+.5,p.push(w.x,w.y),_++}for(let O=0;O<s;O++){let V=A+O,Y=D+O;S===!0?h.push(Y,Y+1,V):h.push(Y+1,Y,V),L+=3}l.addGroup(d,L,S===!0?1:2),d+=L}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var co=new N,ho=new N,_l=new N,uo=new Ln,Bi=class extends _t{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let s=Math.pow(10,4),r=Math.cos(gs*t),o=e.getIndex(),a=e.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],h=["a","b","c"],u=new Array(3),f={},p=[];for(let _=0;_<c;_+=3){o?(l[0]=o.getX(_),l[1]=o.getX(_+1),l[2]=o.getX(_+2)):(l[0]=_,l[1]=_+1,l[2]=_+2);let{a:x,b:m,c:d}=uo;if(x.fromBufferAttribute(a,l[0]),m.fromBufferAttribute(a,l[1]),d.fromBufferAttribute(a,l[2]),uo.getNormal(_l),u[0]=`${Math.round(x.x*s)},${Math.round(x.y*s)},${Math.round(x.z*s)}`,u[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,u[2]=`${Math.round(d.x*s)},${Math.round(d.y*s)},${Math.round(d.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let E=0;E<3;E++){let y=(E+1)%3,S=u[E],A=u[y],w=uo[h[E]],C=uo[h[y]],L=`${S}_${A}`,v=`${A}_${S}`;v in f&&f[v]?(_l.dot(f[v].normal)<=r&&(p.push(w.x,w.y,w.z),p.push(C.x,C.y,C.z)),f[v]=null):L in f||(f[L]={index0:l[E],index1:l[y],normal:_l.clone()})}}for(let _ in f)if(f[_]){let{index0:x,index1:m}=f[_];co.fromBufferAttribute(a,x),ho.fromBufferAttribute(a,m),p.push(co.x,co.y,co.z),p.push(ho.x,ho.y,ho.z)}this.setAttribute("position",new st(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};var pr=class i extends _t{constructor(e=[new Te(0,-.5),new Te(.5,0),new Te(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=qe(s,0,Math.PI*2);let r=[],o=[],a=[],c=[],l=[],h=1/t,u=new N,f=new Te,p=new N,_=new N,x=new N,m=0,d=0;for(let E=0;E<=e.length-1;E++)switch(E){case 0:m=e[E+1].x-e[E].x,d=e[E+1].y-e[E].y,p.x=d*1,p.y=-m,p.z=d*0,x.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case e.length-1:c.push(x.x,x.y,x.z);break;default:m=e[E+1].x-e[E].x,d=e[E+1].y-e[E].y,p.x=d*1,p.y=-m,p.z=d*0,_.copy(p),p.x+=x.x,p.y+=x.y,p.z+=x.z,p.normalize(),c.push(p.x,p.y,p.z),x.copy(_)}for(let E=0;E<=t;E++){let y=n+E*h*s,S=Math.sin(y),A=Math.cos(y);for(let w=0;w<=e.length-1;w++){u.x=e[w].x*S,u.y=e[w].y,u.z=e[w].x*A,o.push(u.x,u.y,u.z),f.x=E/t,f.y=w/(e.length-1),a.push(f.x,f.y);let C=c[3*w+0]*S,L=c[3*w+1],v=c[3*w+0]*A;l.push(C,L,v)}}for(let E=0;E<t;E++)for(let y=0;y<e.length-1;y++){let S=y+E*e.length,A=S,w=S+e.length,C=S+e.length+1,L=S+1;r.push(A,w,L),r.push(C,L,w)}this.setIndex(r),this.setAttribute("position",new st(o,3)),this.setAttribute("uv",new st(a,2)),this.setAttribute("normal",new st(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}};var ki=class i extends _t{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=e/a,f=t/c,p=[],_=[],x=[],m=[];for(let d=0;d<h;d++){let E=d*f-o;for(let y=0;y<l;y++){let S=y*u-r;_.push(S,-E,0),x.push(0,0,1),m.push(y/a),m.push(1-d/c)}}for(let d=0;d<c;d++)for(let E=0;E<a;E++){let y=E+l*d,S=E+l*(d+1),A=E+1+l*(d+1),w=E+1+l*d;p.push(y,S,w),p.push(S,A,w)}this.setIndex(p),this.setAttribute("position",new st(_,3)),this.setAttribute("normal",new st(x,3)),this.setAttribute("uv",new st(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var As=class i extends _t{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,h=[],u=new N,f=new N,p=[],_=[],x=[],m=[];for(let d=0;d<=n;d++){let E=[],y=d/n,S=0;d===0&&o===0?S=.5/t:d===n&&c===Math.PI&&(S=-.5/t);for(let A=0;A<=t;A++){let w=A/t;u.x=-e*Math.cos(s+w*r)*Math.sin(o+y*a),u.y=e*Math.cos(o+y*a),u.z=e*Math.sin(s+w*r)*Math.sin(o+y*a),_.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),m.push(w+S,1-y),E.push(l++)}h.push(E)}for(let d=0;d<n;d++)for(let E=0;E<t;E++){let y=h[d][E+1],S=h[d][E],A=h[d+1][E],w=h[d+1][E+1];(d!==0||o>0)&&p.push(y,S,w),(d!==n-1||c<Math.PI)&&p.push(S,A,w)}this.setIndex(p),this.setAttribute("position",new st(_,3)),this.setAttribute("normal",new st(x,3)),this.setAttribute("uv",new st(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Cs=class i extends _t{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],c=[],l=[],h=new N,u=new N,f=new N;for(let p=0;p<=n;p++)for(let _=0;_<=s;_++){let x=_/s*r,m=p/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(x),u.y=(e+t*Math.cos(m))*Math.sin(x),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(x),h.y=e*Math.sin(x),f.subVectors(u,h).normalize(),c.push(f.x,f.y,f.z),l.push(_/s),l.push(p/n)}for(let p=1;p<=n;p++)for(let _=1;_<=s;_++){let x=(s+1)*p+_-1,m=(s+1)*(p-1)+_-1,d=(s+1)*(p-1)+_,E=(s+1)*p+_;o.push(x,m,E),o.push(m,d,E)}this.setIndex(o),this.setAttribute("position",new st(a,3)),this.setAttribute("normal",new st(c,3)),this.setAttribute("uv",new st(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Xt=class extends Bn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vl,this.normalScale=new Te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var Ro=class extends Bn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Lh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Io=class extends Bn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function fo(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function qd(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var zi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Po=class extends zi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:yl,endingEnd:yl}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case vl:r=e,a=2*t-n;break;case bl:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case vl:o=e,c=2*n-t;break;case bl:o=1,c=n+s[1]-s[0];break;default:o=e-1,c=t}let l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,p=this._weightNext,_=(n-t)/(s-t),x=_*_,m=x*_,d=-f*m+2*f*x-f*_,E=(1+f)*m+(-1.5-2*f)*x+(-.5+f)*_+1,y=(-1-p)*m+(1.5+p)*x+.5*_,S=p*m-p*x;for(let A=0;A!==a;++A)r[A]=d*o[h+A]+E*o[l+A]+y*o[c+A]+S*o[u+A];return r}},Do=class extends zi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=(n-t)/(s-t),u=1-h;for(let f=0;f!==a;++f)r[f]=o[l+f]*u+o[c+f]*h;return r}},Lo=class extends zi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},nn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=fo(t,this.TimeBufferType),this.values=fo(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:fo(e.times,Array),values:fo(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Lo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Do(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Po(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case er:t=this.InterpolantFactoryMethodDiscrete;break;case yo:t=this.InterpolantFactoryMethodLinear;break;case po:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return er;case this.InterpolantFactoryMethodLinear:return yo;case this.InterpolantFactoryMethodSmooth:return po}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&qd(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===po,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=e[a],h=e[a+1];if(l!==h&&(a!==1||l!==e[0]))if(s)c=!0;else{let u=a*n,f=u-n,p=u+n;for(let _=0;_!==n;++_){let x=t[u+_];if(x!==t[f+_]||x!==t[p+_]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let u=a*n,f=o*n;for(let p=0;p!==n;++p)t[f+p]=t[u+p]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};nn.prototype.ValueTypeName="";nn.prototype.TimeBufferType=Float32Array;nn.prototype.ValueBufferType=Float32Array;nn.prototype.DefaultInterpolation=yo;var gi=class extends nn{constructor(e,t,n){super(e,t,n)}};gi.prototype.ValueTypeName="bool";gi.prototype.ValueBufferType=Array;gi.prototype.DefaultInterpolation=er;gi.prototype.InterpolantFactoryMethodLinear=void 0;gi.prototype.InterpolantFactoryMethodSmooth=void 0;var No=class extends nn{constructor(e,t,n,s){super(e,t,n,s)}};No.prototype.ValueTypeName="color";var Uo=class extends nn{constructor(e,t,n,s){super(e,t,n,s)}};Uo.prototype.ValueTypeName="number";var Oo=class extends zi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(s-t),l=e*a;for(let h=l+a;l!==h;l+=4)pn.slerpFlat(r,0,o,l-a,o,l,c);return r}},mr=class extends nn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Oo(this.times,this.values,this.getValueSize(),e)}};mr.prototype.ValueTypeName="quaternion";mr.prototype.InterpolantFactoryMethodSmooth=void 0;var _i=class extends nn{constructor(e,t,n){super(e,t,n)}};_i.prototype.ValueTypeName="string";_i.prototype.ValueBufferType=Array;_i.prototype.DefaultInterpolation=er;_i.prototype.InterpolantFactoryMethodLinear=void 0;_i.prototype.InterpolantFactoryMethodSmooth=void 0;var Fo=class extends nn{constructor(e,t,n,s){super(e,t,n,s)}};Fo.prototype.ValueTypeName="vector";var Bo=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=l.length;u<f;u+=2){let p=l[u],_=l[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return _}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Zh=new Bo,ko=class{constructor(e){this.manager=e!==void 0?e:Zh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};ko.DEFAULT_MATERIAL_NAME="__DEFAULT";var gr=class extends Dt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ze(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},_r=class extends gr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},xl=new ht,Qc=new N,eh=new N,Sl=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Te(512,512),this.mapType=Cn,this.map=null,this.mapPass=null,this.matrix=new ht,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ws,this._frameExtents=new Te(1,1),this._viewportCount=1,this._viewports=[new gt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Qc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Qc),eh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(eh),t.updateMatrixWorld(),xl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(xl,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(xl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var xr=class extends ar{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},El=class extends Sl{constructor(){super(new xr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},yr=class extends gr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.target=new Dt,this.shadow=new El}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var zo=class extends Pt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var jl="\\[\\]\\.:\\/",Yd=new RegExp("["+jl+"]","g"),$l="[^"+jl+"]",Zd="[^"+jl.replace("\\.","")+"]",jd=/((?:WC+[\/:])*)/.source.replace("WC",$l),$d=/(WCOD+)?/.source.replace("WCOD",Zd),Jd=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",$l),Kd=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",$l),Qd=new RegExp("^"+jd+$d+Jd+Kd+"$"),ef=["material","materials","bones","map"],wl=class{constructor(e,t,n){let s=n||ft.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ft=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Yd,"")}static parseTrackName(e){let t=Qd.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);ef.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=n(a.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[s];if(o===void 0){let l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ft.Composite=wl;ft.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ft.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ft.prototype.GetterByBindingType=[ft.prototype._getValue_direct,ft.prototype._getValue_array,ft.prototype._getValue_arrayElement,ft.prototype._getValue_toArray];ft.prototype.SetterByBindingTypeAndVersioning=[[ft.prototype._setValue_direct,ft.prototype._setValue_direct_setNeedsUpdate,ft.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_array,ft.prototype._setValue_array_setNeedsUpdate,ft.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_arrayElement,ft.prototype._setValue_arrayElement_setNeedsUpdate,ft.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_fromArray,ft.prototype._setValue_fromArray_setNeedsUpdate,ft.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var t0=new Float32Array(1);var th=new ht,vr=class{constructor(e,t,n=0,s=1/0){this.ray=new mi(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Ms,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return th.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(th),this}intersectObject(e,t=!0,n=[]){return Tl(e,this,n,t),n.sort(nh),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Tl(e[s],this,n,t);return n.sort(nh),n}};function nh(i,e){return i.distance-e.distance}function Tl(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)Tl(r[o],e,t,!0)}}var xi=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=qe(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(qe(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var br=class extends ei{constructor(e=10,t=10,n=4473924,s=8947848){n=new ze(n),s=new ze(s);let r=t/2,o=e/t,a=e/2,c=[],l=[];for(let f=0,p=0,_=-a;f<=t;f++,_+=o){c.push(-a,0,_,a,0,_),c.push(_,0,-a,_,0,a);let x=f===r?n:s;x.toArray(l,p),p+=3,x.toArray(l,p),p+=3,x.toArray(l,p),p+=3,x.toArray(l,p),p+=3}let h=new _t;h.setAttribute("position",new st(c,3)),h.setAttribute("color",new st(l,3));let u=new An({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}};var Mr=class extends ei{constructor(e=1){let t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new _t;s.setAttribute("position",new st(t,3)),s.setAttribute("color",new st(n,3));let r=new An({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(e,t,n){let s=new ze,r=this.geometry.attributes.color.array;return s.set(e),s.toArray(r,0),s.toArray(r,3),s.set(t),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}};var Sr=class extends Un{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function Jl(i,e,t,n){let s=tf(n);switch(t){case Bl:return i*e;case zl:return i*e/s.components*s.byteLength;case ta:return i*e/s.components*s.byteLength;case Hl:return i*e*2/s.components*s.byteLength;case na:return i*e*2/s.components*s.byteLength;case kl:return i*e*3/s.components*s.byteLength;case gn:return i*e*4/s.components*s.byteLength;case ia:return i*e*4/s.components*s.byteLength;case Tr:case Ar:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Cr:case Rr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ra:case aa:return Math.max(i,16)*Math.max(e,8)/4;case sa:case oa:return Math.max(i,8)*Math.max(e,8)/2;case la:case ca:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ha:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ua:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case da:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case fa:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case pa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case ma:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ga:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case _a:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case xa:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case ya:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case va:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case ba:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Ma:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Sa:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ea:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case wa:case Ta:case Aa:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Ca:case Ra:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Ia:case Pa:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function tf(i){switch(i){case Cn:case Nl:return{byteLength:1,components:1};case Rs:case Ul:case Is:return{byteLength:2,components:1};case Qo:case ea:return{byteLength:2,components:4};case Mi:case Ko:case Hn:return{byteLength:4,components:1};case Ol:case Fl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function xu(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function sf(i){let e=new WeakMap;function t(a,c){let l=a.array,h=a.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),a.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){let h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((p,_)=>p.start-_.start);let f=0;for(let p=1;p<u.length;p++){let _=u[f],x=u[p];x.start<=_.start+_.count+1?_.count=Math.max(_.count,x.start+x.count-_.start):(++f,u[f]=x)}u.length=f+1;for(let p=0,_=u.length;p<_;p++){let x=u[p];i.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var rf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,of=`#ifdef USE_ALPHAHASH
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
#endif`,af=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,lf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,cf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,hf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,uf=`#ifdef USE_AOMAP
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
#endif`,df=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ff=`#ifdef USE_BATCHING
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
#endif`,pf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,mf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,gf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,_f=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,xf=`#ifdef USE_IRIDESCENCE
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
#endif`,yf=`#ifdef USE_BUMPMAP
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
#endif`,vf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,bf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Mf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Sf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ef=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,wf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Tf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Af=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Cf=`#define PI 3.141592653589793
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
} // validated`,Rf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,If=`vec3 transformedNormal = objectNormal;
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
#endif`,Pf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Df=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Lf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Nf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Uf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Of=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ff=`#ifdef USE_ENVMAP
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
#endif`,Bf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,kf=`#ifdef USE_ENVMAP
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
#endif`,zf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Hf=`#ifdef USE_ENVMAP
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
#endif`,Vf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Gf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Wf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Xf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,qf=`#ifdef USE_GRADIENTMAP
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
}`,Yf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Zf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,jf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,$f=`uniform bool receiveShadow;
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
#endif`,Jf=`#ifdef USE_ENVMAP
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
#endif`,Kf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Qf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ep=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,tp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,np=`PhysicalMaterial material;
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
#endif`,ip=`struct PhysicalMaterial {
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
}`,sp=`
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
#endif`,rp=`#if defined( RE_IndirectDiffuse )
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
#endif`,op=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ap=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,lp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,cp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,up=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,dp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,fp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,pp=`#if defined( USE_POINTS_UV )
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
#endif`,mp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,gp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,_p=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,xp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vp=`#ifdef USE_MORPHTARGETS
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
#endif`,bp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Mp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Sp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ep=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ap=`#ifdef USE_NORMALMAP
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
#endif`,Cp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Rp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ip=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Pp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Dp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Lp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Np=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Up=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Op=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Fp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Bp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,kp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,zp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Hp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Vp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Gp=`float getShadowMask() {
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
}`,Wp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Xp=`#ifdef USE_SKINNING
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
#endif`,qp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Yp=`#ifdef USE_SKINNING
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
#endif`,Zp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,jp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,$p=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Jp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Kp=`#ifdef USE_TRANSMISSION
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
#endif`,Qp=`#ifdef USE_TRANSMISSION
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
#endif`,em=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,tm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,nm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,im=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,sm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,rm=`uniform sampler2D t2D;
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
}`,om=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,am=`#ifdef ENVMAP_TYPE_CUBE
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
}`,lm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hm=`#include <common>
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
}`,um=`#if DEPTH_PACKING == 3200
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
}`,dm=`#define DISTANCE
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
}`,fm=`#define DISTANCE
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
}`,pm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,mm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gm=`uniform float scale;
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
}`,_m=`uniform vec3 diffuse;
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
}`,xm=`#include <common>
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
}`,ym=`uniform vec3 diffuse;
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
}`,vm=`#define LAMBERT
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
}`,bm=`#define LAMBERT
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
}`,Mm=`#define MATCAP
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
}`,Sm=`#define MATCAP
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
}`,Em=`#define NORMAL
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
}`,wm=`#define NORMAL
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
}`,Tm=`#define PHONG
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
}`,Am=`#define PHONG
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
}`,Cm=`#define STANDARD
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
}`,Rm=`#define STANDARD
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
}`,Im=`#define TOON
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
}`,Pm=`#define TOON
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
}`,Dm=`uniform float size;
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
}`,Lm=`uniform vec3 diffuse;
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
}`,Nm=`#include <common>
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
}`,Um=`uniform vec3 color;
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
}`,Om=`uniform float rotation;
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
}`,Fm=`uniform vec3 diffuse;
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
}`,Xe={alphahash_fragment:rf,alphahash_pars_fragment:of,alphamap_fragment:af,alphamap_pars_fragment:lf,alphatest_fragment:cf,alphatest_pars_fragment:hf,aomap_fragment:uf,aomap_pars_fragment:df,batching_pars_vertex:ff,batching_vertex:pf,begin_vertex:mf,beginnormal_vertex:gf,bsdfs:_f,iridescence_fragment:xf,bumpmap_pars_fragment:yf,clipping_planes_fragment:vf,clipping_planes_pars_fragment:bf,clipping_planes_pars_vertex:Mf,clipping_planes_vertex:Sf,color_fragment:Ef,color_pars_fragment:wf,color_pars_vertex:Tf,color_vertex:Af,common:Cf,cube_uv_reflection_fragment:Rf,defaultnormal_vertex:If,displacementmap_pars_vertex:Pf,displacementmap_vertex:Df,emissivemap_fragment:Lf,emissivemap_pars_fragment:Nf,colorspace_fragment:Uf,colorspace_pars_fragment:Of,envmap_fragment:Ff,envmap_common_pars_fragment:Bf,envmap_pars_fragment:kf,envmap_pars_vertex:zf,envmap_physical_pars_fragment:Jf,envmap_vertex:Hf,fog_vertex:Vf,fog_pars_vertex:Gf,fog_fragment:Wf,fog_pars_fragment:Xf,gradientmap_pars_fragment:qf,lightmap_pars_fragment:Yf,lights_lambert_fragment:Zf,lights_lambert_pars_fragment:jf,lights_pars_begin:$f,lights_toon_fragment:Kf,lights_toon_pars_fragment:Qf,lights_phong_fragment:ep,lights_phong_pars_fragment:tp,lights_physical_fragment:np,lights_physical_pars_fragment:ip,lights_fragment_begin:sp,lights_fragment_maps:rp,lights_fragment_end:op,logdepthbuf_fragment:ap,logdepthbuf_pars_fragment:lp,logdepthbuf_pars_vertex:cp,logdepthbuf_vertex:hp,map_fragment:up,map_pars_fragment:dp,map_particle_fragment:fp,map_particle_pars_fragment:pp,metalnessmap_fragment:mp,metalnessmap_pars_fragment:gp,morphinstance_vertex:_p,morphcolor_vertex:xp,morphnormal_vertex:yp,morphtarget_pars_vertex:vp,morphtarget_vertex:bp,normal_fragment_begin:Mp,normal_fragment_maps:Sp,normal_pars_fragment:Ep,normal_pars_vertex:wp,normal_vertex:Tp,normalmap_pars_fragment:Ap,clearcoat_normal_fragment_begin:Cp,clearcoat_normal_fragment_maps:Rp,clearcoat_pars_fragment:Ip,iridescence_pars_fragment:Pp,opaque_fragment:Dp,packing:Lp,premultiplied_alpha_fragment:Np,project_vertex:Up,dithering_fragment:Op,dithering_pars_fragment:Fp,roughnessmap_fragment:Bp,roughnessmap_pars_fragment:kp,shadowmap_pars_fragment:zp,shadowmap_pars_vertex:Hp,shadowmap_vertex:Vp,shadowmask_pars_fragment:Gp,skinbase_vertex:Wp,skinning_pars_vertex:Xp,skinning_vertex:qp,skinnormal_vertex:Yp,specularmap_fragment:Zp,specularmap_pars_fragment:jp,tonemapping_fragment:$p,tonemapping_pars_fragment:Jp,transmission_fragment:Kp,transmission_pars_fragment:Qp,uv_pars_fragment:em,uv_pars_vertex:tm,uv_vertex:nm,worldpos_vertex:im,background_vert:sm,background_frag:rm,backgroundCube_vert:om,backgroundCube_frag:am,cube_vert:lm,cube_frag:cm,depth_vert:hm,depth_frag:um,distanceRGBA_vert:dm,distanceRGBA_frag:fm,equirect_vert:pm,equirect_frag:mm,linedashed_vert:gm,linedashed_frag:_m,meshbasic_vert:xm,meshbasic_frag:ym,meshlambert_vert:vm,meshlambert_frag:bm,meshmatcap_vert:Mm,meshmatcap_frag:Sm,meshnormal_vert:Em,meshnormal_frag:wm,meshphong_vert:Tm,meshphong_frag:Am,meshphysical_vert:Cm,meshphysical_frag:Rm,meshtoon_vert:Im,meshtoon_frag:Pm,points_vert:Dm,points_frag:Lm,shadow_vert:Nm,shadow_frag:Um,sprite_vert:Om,sprite_frag:Fm},pe={common:{diffuse:{value:new ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},envMapRotation:{value:new Ge},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new Te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new ze(16777215)},opacity:{value:1},center:{value:new Te(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},Vn={basic:{uniforms:zt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:zt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new ze(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:zt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new ze(0)},specular:{value:new ze(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:zt([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:zt([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new ze(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:zt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:zt([pe.points,pe.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:zt([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:zt([pe.common,pe.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:zt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:zt([pe.sprite,pe.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ge}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:zt([pe.common,pe.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:zt([pe.lights,pe.fog,{color:{value:new ze(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};Vn.physical={uniforms:zt([Vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new Te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new Te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new ze(0)},specularColor:{value:new ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new Te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};var Da={r:0,b:0,g:0},Wi=new wn,Bm=new ht;function km(i,e,t,n,s,r,o){let a=new ze(0),c=r===!0?0:1,l,h,u=null,f=0,p=null;function _(y){let S=y.isScene===!0?y.background:null;return S&&S.isTexture&&(S=(y.backgroundBlurriness>0?t:e).get(S)),S}function x(y){let S=!1,A=_(y);A===null?d(a,c):A&&A.isColor&&(d(A,1),S=!0);let w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(y,S){let A=_(S);A&&(A.isCubeTexture||A.mapping===Er)?(h===void 0&&(h=new vt(new kt(1,1,1),new Tn({name:"BackgroundCubeMaterial",uniforms:Gi(Vn.backgroundCube.uniforms),vertexShader:Vn.backgroundCube.vertexShader,fragmentShader:Vn.backgroundCube.fragmentShader,side:qt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,C,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Wi.copy(S.backgroundRotation),Wi.x*=-1,Wi.y*=-1,Wi.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(Wi.y*=-1,Wi.z*=-1),h.material.uniforms.envMap.value=A,h.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Bm.makeRotationFromEuler(Wi)),h.material.toneMapped=Je.getTransfer(A.colorSpace)!==it,(u!==A||f!==A.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=A,f=A.version,p=i.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):A&&A.isTexture&&(l===void 0&&(l=new vt(new ki(2,2),new Tn({name:"BackgroundMaterial",uniforms:Gi(Vn.background.uniforms),vertexShader:Vn.background.vertexShader,fragmentShader:Vn.background.fragmentShader,side:Qn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=A,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=Je.getTransfer(A.colorSpace)!==it,A.matrixAutoUpdate===!0&&A.updateMatrix(),l.material.uniforms.uvTransform.value.copy(A.matrix),(u!==A||f!==A.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=A,f=A.version,p=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function d(y,S){y.getRGB(Da,Zl(i)),n.buffers.color.setClear(Da.r,Da.g,Da.b,S,o)}function E(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,S=1){a.set(y),c=S,d(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,d(a,c)},render:x,addToRenderList:m,dispose:E}}function zm(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,o=!1;function a(b,D,O,V,Y){let X=!1,q=u(V,O,D);r!==q&&(r=q,l(r.object)),X=p(b,V,O,Y),X&&_(b,V,O,Y),Y!==null&&e.update(Y,i.ELEMENT_ARRAY_BUFFER),(X||o)&&(o=!1,S(b,D,O,V),Y!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(Y).buffer))}function c(){return i.createVertexArray()}function l(b){return i.bindVertexArray(b)}function h(b){return i.deleteVertexArray(b)}function u(b,D,O){let V=O.wireframe===!0,Y=n[b.id];Y===void 0&&(Y={},n[b.id]=Y);let X=Y[D.id];X===void 0&&(X={},Y[D.id]=X);let q=X[V];return q===void 0&&(q=f(c()),X[V]=q),q}function f(b){let D=[],O=[],V=[];for(let Y=0;Y<t;Y++)D[Y]=0,O[Y]=0,V[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:O,attributeDivisors:V,object:b,attributes:{},index:null}}function p(b,D,O,V){let Y=r.attributes,X=D.attributes,q=0,ie=O.getAttributes();for(let R in ie)if(ie[R].location>=0){let J=Y[R],ue=X[R];if(ue===void 0&&(R==="instanceMatrix"&&b.instanceMatrix&&(ue=b.instanceMatrix),R==="instanceColor"&&b.instanceColor&&(ue=b.instanceColor)),J===void 0||J.attribute!==ue||ue&&J.data!==ue.data)return!0;q++}return r.attributesNum!==q||r.index!==V}function _(b,D,O,V){let Y={},X=D.attributes,q=0,ie=O.getAttributes();for(let R in ie)if(ie[R].location>=0){let J=X[R];J===void 0&&(R==="instanceMatrix"&&b.instanceMatrix&&(J=b.instanceMatrix),R==="instanceColor"&&b.instanceColor&&(J=b.instanceColor));let ue={};ue.attribute=J,J&&J.data&&(ue.data=J.data),Y[R]=ue,q++}r.attributes=Y,r.attributesNum=q,r.index=V}function x(){let b=r.newAttributes;for(let D=0,O=b.length;D<O;D++)b[D]=0}function m(b){d(b,0)}function d(b,D){let O=r.newAttributes,V=r.enabledAttributes,Y=r.attributeDivisors;O[b]=1,V[b]===0&&(i.enableVertexAttribArray(b),V[b]=1),Y[b]!==D&&(i.vertexAttribDivisor(b,D),Y[b]=D)}function E(){let b=r.newAttributes,D=r.enabledAttributes;for(let O=0,V=D.length;O<V;O++)D[O]!==b[O]&&(i.disableVertexAttribArray(O),D[O]=0)}function y(b,D,O,V,Y,X,q){q===!0?i.vertexAttribIPointer(b,D,O,Y,X):i.vertexAttribPointer(b,D,O,V,Y,X)}function S(b,D,O,V){x();let Y=V.attributes,X=O.getAttributes(),q=D.defaultAttributeValues;for(let ie in X){let R=X[ie];if(R.location>=0){let Z=Y[ie];if(Z===void 0&&(ie==="instanceMatrix"&&b.instanceMatrix&&(Z=b.instanceMatrix),ie==="instanceColor"&&b.instanceColor&&(Z=b.instanceColor)),Z!==void 0){let J=Z.normalized,ue=Z.itemSize,ve=e.get(Z);if(ve===void 0)continue;let ee=ve.buffer,ce=ve.type,Me=ve.bytesPerElement,$=ce===i.INT||ce===i.UNSIGNED_INT||Z.gpuType===Ko;if(Z.isInterleavedBufferAttribute){let K=Z.data,_e=K.stride,Ie=Z.offset;if(K.isInstancedInterleavedBuffer){for(let Ce=0;Ce<R.locationSize;Ce++)d(R.location+Ce,K.meshPerAttribute);b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Ce=0;Ce<R.locationSize;Ce++)m(R.location+Ce);i.bindBuffer(i.ARRAY_BUFFER,ee);for(let Ce=0;Ce<R.locationSize;Ce++)y(R.location+Ce,ue/R.locationSize,ce,J,_e*Me,(Ie+ue/R.locationSize*Ce)*Me,$)}else{if(Z.isInstancedBufferAttribute){for(let K=0;K<R.locationSize;K++)d(R.location+K,Z.meshPerAttribute);b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let K=0;K<R.locationSize;K++)m(R.location+K);i.bindBuffer(i.ARRAY_BUFFER,ee);for(let K=0;K<R.locationSize;K++)y(R.location+K,ue/R.locationSize,ce,J,ue*Me,ue/R.locationSize*K*Me,$)}}else if(q!==void 0){let J=q[ie];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(R.location,J);break;case 3:i.vertexAttrib3fv(R.location,J);break;case 4:i.vertexAttrib4fv(R.location,J);break;default:i.vertexAttrib1fv(R.location,J)}}}}E()}function A(){L();for(let b in n){let D=n[b];for(let O in D){let V=D[O];for(let Y in V)h(V[Y].object),delete V[Y];delete D[O]}delete n[b]}}function w(b){if(n[b.id]===void 0)return;let D=n[b.id];for(let O in D){let V=D[O];for(let Y in V)h(V[Y].object),delete V[Y];delete D[O]}delete n[b.id]}function C(b){for(let D in n){let O=n[D];if(O[b.id]===void 0)continue;let V=O[b.id];for(let Y in V)h(V[Y].object),delete V[Y];delete O[b.id]}}function L(){v(),o=!0,r!==s&&(r=s,l(r.object))}function v(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:L,resetDefaultState:v,dispose:A,releaseStatesOfGeometry:w,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:m,disableUnusedAttributes:E}}function Hm(i,e,t){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),t.update(h,n,1)}function o(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),t.update(h,n,u))}function a(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let p=0;for(let _=0;_<u;_++)p+=h[_];t.update(p,n,1)}function c(l,h,u,f){if(u===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<l.length;_++)o(l[_],h[_],f[_]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,u);let _=0;for(let x=0;x<u;x++)_+=h[x]*f[x];t.update(_,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function Vm(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==gn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let L=C===Is&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Cn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Hn&&!L)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=_>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:_,maxTextureSize:x,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:E,maxVaryings:y,maxFragmentUniforms:S,vertexTextures:A,maxSamples:w}}function Gm(i){let e=this,t=null,n=0,s=!1,r=!1,o=new dn,a=new Ge,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let p=u.length!==0||f||n!==0||s;return s=f,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,p){let _=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,d=i.get(u);if(!s||_===null||_.length===0||r&&!m)r?h(null):l();else{let E=r?0:n,y=E*4,S=d.clippingState||null;c.value=S,S=h(_,f,y,p);for(let A=0;A!==y;++A)S[A]=t[A];d.clippingState=S,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=E}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,p,_){let x=u!==null?u.length:0,m=null;if(x!==0){if(m=c.value,_!==!0||m===null){let d=p+x*4,E=f.matrixWorldInverse;a.getNormalMatrix(E),(m===null||m.length<d)&&(m=new Float32Array(d));for(let y=0,S=p;y!==x;++y,S+=4)o.copy(u[y]).applyMatrix4(E,a),o.normal.toArray(m,S),m[S+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function Wm(i){let e=new WeakMap;function t(o,a){return a===jo?o.mapping=Hi:a===$o&&(o.mapping=Vi),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===jo||a===$o)if(e.has(o)){let c=e.get(o).texture;return t(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new wo(c.height);return l.fromEquirectangularTexture(i,o),e.set(o,l),o.addEventListener("dispose",s),t(l.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Ns=4,jh=[.125,.215,.35,.446,.526,.582],Yi=20,Kl=new xr,$h=new ze,Ql=null,ec=0,tc=0,nc=!1,qi=(1+Math.sqrt(5))/2,Ls=1/qi,Jh=[new N(-qi,Ls,0),new N(qi,Ls,0),new N(-Ls,0,qi),new N(Ls,0,qi),new N(0,qi,-Ls),new N(0,qi,Ls),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],Xm=new N,Ua=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=Xm}=r;Ql=this._renderer.getRenderTarget(),ec=this._renderer.getActiveCubeFace(),tc=this._renderer.getActiveMipmapLevel(),nc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=eu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Qh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ql,ec,tc),this._renderer.xr.enabled=nc,e.scissorTest=!1,La(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Hi||e.mapping===Vi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ql=this._renderer.getRenderTarget(),ec=this._renderer.getActiveCubeFace(),tc=this._renderer.getActiveMipmapLevel(),nc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:En,minFilter:En,generateMipmaps:!1,type:Is,format:gn,colorSpace:Ni,depthBuffer:!1},s=Kh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Kh(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=qm(r)),this._blurMaterial=Ym(r,e,t)}return s}_compileMaterial(e){let t=new vt(this._lodPlanes[0],e);this._renderer.compile(t,Kl)}_sceneToCubeUV(e,t,n,s,r){let c=new Pt(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor($h),u.toneMapping=ni,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let x=new mn({name:"PMREM.Background",side:qt,depthWrite:!1,depthTest:!1}),m=new vt(new kt,x),d=!1,E=e.background;E?E.isColor&&(x.color.copy(E),e.background=null,d=!0):(x.color.copy($h),d=!0);for(let y=0;y<6;y++){let S=y%3;S===0?(c.up.set(0,l[y],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[y],r.y,r.z)):S===1?(c.up.set(0,0,l[y]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[y],r.z)):(c.up.set(0,l[y],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[y]));let A=this._cubeSize;La(s,S*A,y>2?A:0,A,A),u.setRenderTarget(s),d&&u.render(m,c),u.render(e,c)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=p,u.autoClear=f,e.background=E}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Hi||e.mapping===Vi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=eu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Qh());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new vt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let c=this._cubeSize;La(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,Kl)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Jh[(s-r-1)%Jh.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new vt(this._lodPlanes[s],l),f=l.uniforms,p=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Yi-1),x=r/_,m=isFinite(r)?1+Math.floor(h*x):Yi;m>Yi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Yi}`);let d=[],E=0;for(let C=0;C<Yi;++C){let L=C/x,v=Math.exp(-L*L/2);d.push(v),C===0?E+=v:C<m&&(E+=2*v)}for(let C=0;C<d.length;C++)d[C]=d[C]/E;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:y}=this;f.dTheta.value=_,f.mipInt.value=y-n;let S=this._sizeLods[s],A=3*S*(s>y-Ns?s-y+Ns:0),w=4*(this._cubeSize-S);La(t,A,w,3*S,2*S),c.setRenderTarget(t),c.render(u,Kl)}};function qm(i){let e=[],t=[],n=[],s=i,r=i-Ns+1+jh.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let c=1/a;o>i-Ns?c=jh[o-i+Ns-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,_=6,x=3,m=2,d=1,E=new Float32Array(x*_*p),y=new Float32Array(m*_*p),S=new Float32Array(d*_*p);for(let w=0;w<p;w++){let C=w%3*2/3-1,L=w>2?0:-1,v=[C,L,0,C+2/3,L,0,C+2/3,L+1,0,C,L,0,C+2/3,L+1,0,C,L+1,0];E.set(v,x*_*w),y.set(f,m*_*w);let b=[w,w,w,w,w,w];S.set(b,d*_*w)}let A=new _t;A.setAttribute("position",new Zt(E,x)),A.setAttribute("uv",new Zt(y,m)),A.setAttribute("faceIndex",new Zt(S,d)),e.push(A),s>Ns&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Kh(i,e,t){let n=new On(i,e,t);return n.texture.mapping=Er,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function La(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Ym(i,e,t){let n=new Float32Array(Yi),s=new N(0,1,0);return new Tn({name:"SphericalGaussianBlur",defines:{n:Yi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:dc(),fragmentShader:`

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
		`,blending:ti,depthTest:!1,depthWrite:!1})}function Qh(){return new Tn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:dc(),fragmentShader:`

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
		`,blending:ti,depthTest:!1,depthWrite:!1})}function eu(){return new Tn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:dc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function dc(){return`

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
	`}function Zm(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===jo||c===$o,h=c===Hi||c===Vi;if(l||h){let u=e.get(a),f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new Ua(i)),u=l?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let p=a.image;return l&&p&&p.height>0||h&&p&&s(p)?(t===null&&(t=new Ua(i)),u=l?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function jm(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&vs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function $m(i,e,t,n){let s={},r=new WeakMap;function o(u){let f=u.target;f.index!==null&&e.remove(f.index);for(let _ in f.attributes)e.remove(f.attributes[_]);f.removeEventListener("dispose",o),delete s[f.id];let p=r.get(f);p&&(e.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,t.memory.geometries++),f}function c(u){let f=u.attributes;for(let p in f)e.update(f[p],i.ARRAY_BUFFER)}function l(u){let f=[],p=u.index,_=u.attributes.position,x=0;if(p!==null){let E=p.array;x=p.version;for(let y=0,S=E.length;y<S;y+=3){let A=E[y+0],w=E[y+1],C=E[y+2];f.push(A,w,w,C,C,A)}}else if(_!==void 0){let E=_.array;x=_.version;for(let y=0,S=E.length/3-1;y<S;y+=3){let A=y+0,w=y+1,C=y+2;f.push(A,w,w,C,C,A)}}else return;let m=new(Yl(f)?or:rr)(f,1);m.version=x;let d=r.get(u);d&&e.remove(d),r.set(u,m)}function h(u){let f=r.get(u);if(f){let p=u.index;p!==null&&f.version<p.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function Jm(i,e,t){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function c(f,p){i.drawElements(n,p,r,f*o),t.update(p,n,1)}function l(f,p,_){_!==0&&(i.drawElementsInstanced(n,p,r,f*o,_),t.update(p,n,_))}function h(f,p,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,_);let m=0;for(let d=0;d<_;d++)m+=p[d];t.update(m,n,1)}function u(f,p,_,x){if(_===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)l(f[d]/o,p[d],x[d]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,x,0,_);let d=0;for(let E=0;E<_;E++)d+=p[E]*x[E];t.update(d,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Km(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Qm(i,e,t){let n=new WeakMap,s=new gt;function r(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,f=n.get(a);if(f===void 0||f.count!==u){let v=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",v)};f!==void 0&&f.texture.dispose();let p=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],d=a.morphAttributes.normal||[],E=a.morphAttributes.color||[],y=0;p===!0&&(y=1),_===!0&&(y=2),x===!0&&(y=3);let S=a.attributes.position.count*y,A=1;S>e.maxTextureSize&&(A=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);let w=new Float32Array(S*A*4*u),C=new sr(w,S,A,u);C.type=Hn,C.needsUpdate=!0;let L=y*4;for(let b=0;b<u;b++){let D=m[b],O=d[b],V=E[b],Y=S*A*4*b;for(let X=0;X<D.count;X++){let q=X*L;p===!0&&(s.fromBufferAttribute(D,X),w[Y+q+0]=s.x,w[Y+q+1]=s.y,w[Y+q+2]=s.z,w[Y+q+3]=0),_===!0&&(s.fromBufferAttribute(O,X),w[Y+q+4]=s.x,w[Y+q+5]=s.y,w[Y+q+6]=s.z,w[Y+q+7]=0),x===!0&&(s.fromBufferAttribute(V,X),w[Y+q+8]=s.x,w[Y+q+9]=s.y,w[Y+q+10]=s.z,w[Y+q+11]=V.itemSize===4?s.w:1)}}f={count:u,texture:C,size:new Te(S,A)},n.set(a,f),a.addEventListener("dispose",v)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let p=0;for(let x=0;x<l.length;x++)p+=l[x];let _=a.morphTargetsRelative?1:1-p;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function eg(i,e,t,n){let s=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,u=e.get(c,h);if(s.get(u)!==l&&(e.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function o(){s=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:o}}var yu=new jt,tu=new dr(1,1),vu=new sr,bu=new So,Mu=new lr,nu=[],iu=[],su=new Float32Array(16),ru=new Float32Array(9),ou=new Float32Array(4);function Fs(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=nu[s];if(r===void 0&&(r=new Float32Array(s),nu[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Tt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function At(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Oa(i,e){let t=iu[e];t===void 0&&(t=new Int32Array(e),iu[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function tg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function ng(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2fv(this.addr,e),At(t,e)}}function ig(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;i.uniform3fv(this.addr,e),At(t,e)}}function sg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4fv(this.addr,e),At(t,e)}}function rg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,n))return;ou.set(n),i.uniformMatrix2fv(this.addr,!1,ou),At(t,n)}}function og(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,n))return;ru.set(n),i.uniformMatrix3fv(this.addr,!1,ru),At(t,n)}}function ag(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,n))return;su.set(n),i.uniformMatrix4fv(this.addr,!1,su),At(t,n)}}function lg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function cg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2iv(this.addr,e),At(t,e)}}function hg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;i.uniform3iv(this.addr,e),At(t,e)}}function ug(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4iv(this.addr,e),At(t,e)}}function dg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function fg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2uiv(this.addr,e),At(t,e)}}function pg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;i.uniform3uiv(this.addr,e),At(t,e)}}function mg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4uiv(this.addr,e),At(t,e)}}function gg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(tu.compareFunction=Gl,r=tu):r=yu,t.setTexture2D(e||r,s)}function _g(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||bu,s)}function xg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Mu,s)}function yg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||vu,s)}function vg(i){switch(i){case 5126:return tg;case 35664:return ng;case 35665:return ig;case 35666:return sg;case 35674:return rg;case 35675:return og;case 35676:return ag;case 5124:case 35670:return lg;case 35667:case 35671:return cg;case 35668:case 35672:return hg;case 35669:case 35673:return ug;case 5125:return dg;case 36294:return fg;case 36295:return pg;case 36296:return mg;case 35678:case 36198:case 36298:case 36306:case 35682:return gg;case 35679:case 36299:case 36307:return _g;case 35680:case 36300:case 36308:case 36293:return xg;case 36289:case 36303:case 36311:case 36292:return yg}}function bg(i,e){i.uniform1fv(this.addr,e)}function Mg(i,e){let t=Fs(e,this.size,2);i.uniform2fv(this.addr,t)}function Sg(i,e){let t=Fs(e,this.size,3);i.uniform3fv(this.addr,t)}function Eg(i,e){let t=Fs(e,this.size,4);i.uniform4fv(this.addr,t)}function wg(i,e){let t=Fs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Tg(i,e){let t=Fs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Ag(i,e){let t=Fs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Cg(i,e){i.uniform1iv(this.addr,e)}function Rg(i,e){i.uniform2iv(this.addr,e)}function Ig(i,e){i.uniform3iv(this.addr,e)}function Pg(i,e){i.uniform4iv(this.addr,e)}function Dg(i,e){i.uniform1uiv(this.addr,e)}function Lg(i,e){i.uniform2uiv(this.addr,e)}function Ng(i,e){i.uniform3uiv(this.addr,e)}function Ug(i,e){i.uniform4uiv(this.addr,e)}function Og(i,e,t){let n=this.cache,s=e.length,r=Oa(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||yu,r[o])}function Fg(i,e,t){let n=this.cache,s=e.length,r=Oa(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||bu,r[o])}function Bg(i,e,t){let n=this.cache,s=e.length,r=Oa(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Mu,r[o])}function kg(i,e,t){let n=this.cache,s=e.length,r=Oa(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||vu,r[o])}function zg(i){switch(i){case 5126:return bg;case 35664:return Mg;case 35665:return Sg;case 35666:return Eg;case 35674:return wg;case 35675:return Tg;case 35676:return Ag;case 5124:case 35670:return Cg;case 35667:case 35671:return Rg;case 35668:case 35672:return Ig;case 35669:case 35673:return Pg;case 5125:return Dg;case 36294:return Lg;case 36295:return Ng;case 36296:return Ug;case 35678:case 36198:case 36298:case 36306:case 35682:return Og;case 35679:case 36299:case 36307:return Fg;case 35680:case 36300:case 36308:case 36293:return Bg;case 36289:case 36303:case 36311:case 36292:return kg}}var sc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=vg(t.type)}},rc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=zg(t.type)}},oc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},ic=/(\w+)(\])?(\[|\.)?/g;function au(i,e){i.seq.push(e),i.map[e.id]=e}function Hg(i,e,t){let n=i.name,s=n.length;for(ic.lastIndex=0;;){let r=ic.exec(n),o=ic.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){au(t,l===void 0?new sc(a,i,e):new rc(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new oc(a),au(t,u)),t=u}}}var Us=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Hg(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function lu(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Vg=37297,Gg=0;function Wg(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var cu=new Ge;function Xg(i){Je._getMatrix(cu,Je.workingColorSpace,i);let e=`mat3( ${cu.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(i)){case tr:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function hu(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Wg(i.getShaderSource(e),a)}else return r}function qg(i,e){let t=Xg(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Yg(i,e){let t;switch(e){case wh:t="Linear";break;case Th:t="Reinhard";break;case Ah:t="Cineon";break;case Ch:t="ACESFilmic";break;case Ih:t="AgX";break;case Ph:t="Neutral";break;case Rh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Na=new N;function Zg(){Je.getLuminanceCoefficients(Na);let i=Na.x.toFixed(4),e=Na.y.toFixed(4),t=Na.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function jg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ir).join(`
`)}function $g(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Jg(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Ir(i){return i!==""}function uu(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function du(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Kg=/^[ \t]*#include +<([\w\d./]+)>/gm;function ac(i){return i.replace(Kg,e_)}var Qg=new Map;function e_(i,e){let t=Xe[e];if(t===void 0){let n=Qg.get(e);if(n!==void 0)t=Xe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ac(t)}var t_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function fu(i){return i.replace(t_,n_)}function n_(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function pu(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function i_(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Cl?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ho?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===kn&&(e="SHADOWMAP_TYPE_VSM"),e}function s_(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Hi:case Vi:e="ENVMAP_TYPE_CUBE";break;case Er:e="ENVMAP_TYPE_CUBE_UV";break}return e}function r_(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Vi&&(e="ENVMAP_MODE_REFRACTION"),e}function o_(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Dl:e="ENVMAP_BLENDING_MULTIPLY";break;case Sh:e="ENVMAP_BLENDING_MIX";break;case Eh:e="ENVMAP_BLENDING_ADD";break}return e}function a_(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function l_(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=i_(t),l=s_(t),h=r_(t),u=o_(t),f=a_(t),p=jg(t),_=$g(r),x=s.createProgram(),m,d,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Ir).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Ir).join(`
`),d.length>0&&(d+=`
`)):(m=[pu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ir).join(`
`),d=[pu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ni?"#define TONE_MAPPING":"",t.toneMapping!==ni?Xe.tonemapping_pars_fragment:"",t.toneMapping!==ni?Yg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,qg("linearToOutputTexel",t.outputColorSpace),Zg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ir).join(`
`)),o=ac(o),o=uu(o,t),o=du(o,t),a=ac(a),a=uu(a,t),a=du(a,t),o=fu(o),a=fu(a),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",t.glslVersion===Wl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Wl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let y=E+m+o,S=E+d+a,A=lu(s,s.VERTEX_SHADER,y),w=lu(s,s.FRAGMENT_SHADER,S);s.attachShader(x,A),s.attachShader(x,w),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function C(D){if(i.debug.checkShaderErrors){let O=s.getProgramInfoLog(x)||"",V=s.getShaderInfoLog(A)||"",Y=s.getShaderInfoLog(w)||"",X=O.trim(),q=V.trim(),ie=Y.trim(),R=!0,Z=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(R=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,A,w);else{let J=hu(s,A,"vertex"),ue=hu(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+X+`
`+J+`
`+ue)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(q===""||ie==="")&&(Z=!1);Z&&(D.diagnostics={runnable:R,programLog:X,vertexShader:{log:q,prefix:m},fragmentShader:{log:ie,prefix:d}})}s.deleteShader(A),s.deleteShader(w),L=new Us(s,x),v=Jg(s,x)}let L;this.getUniforms=function(){return L===void 0&&C(this),L};let v;this.getAttributes=function(){return v===void 0&&C(this),v};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(x,Vg)),b},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Gg++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=A,this.fragmentShader=w,this}var c_=0,lc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new cc(e),t.set(e,n)),n}},cc=class{constructor(e){this.id=c_++,this.code=e,this.usedTimes=0}};function h_(i,e,t,n,s,r,o){let a=new Ms,c=new lc,l=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures,p=s.precision,_={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(v){return l.add(v),v===0?"uv":`uv${v}`}function m(v,b,D,O,V){let Y=O.fog,X=V.geometry,q=v.isMeshStandardMaterial?O.environment:null,ie=(v.isMeshStandardMaterial?t:e).get(v.envMap||q),R=ie&&ie.mapping===Er?ie.image.height:null,Z=_[v.type];v.precision!==null&&(p=s.getMaxPrecision(v.precision),p!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",p,"instead."));let J=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,ue=J!==void 0?J.length:0,ve=0;X.morphAttributes.position!==void 0&&(ve=1),X.morphAttributes.normal!==void 0&&(ve=2),X.morphAttributes.color!==void 0&&(ve=3);let ee,ce,Me,$;if(Z){let et=Vn[Z];ee=et.vertexShader,ce=et.fragmentShader}else ee=v.vertexShader,ce=v.fragmentShader,c.update(v),Me=c.getVertexShaderID(v),$=c.getFragmentShaderID(v);let K=i.getRenderTarget(),_e=i.state.buffers.depth.getReversed(),Ie=V.isInstancedMesh===!0,Ce=V.isBatchedMesh===!0,Oe=!!v.map,Mt=!!v.matcap,I=!!ie,rt=!!v.aoMap,Fe=!!v.lightMap,Le=!!v.bumpMap,xe=!!v.normalMap,$e=!!v.displacementMap,Se=!!v.emissiveMap,Be=!!v.metalnessMap,St=!!v.roughnessMap,xt=v.anisotropy>0,T=v.clearcoat>0,g=v.dispersion>0,P=v.iridescence>0,k=v.sheen>0,H=v.transmission>0,F=xt&&!!v.anisotropyMap,se=T&&!!v.clearcoatMap,ne=T&&!!v.clearcoatNormalMap,de=T&&!!v.clearcoatRoughnessMap,fe=P&&!!v.iridescenceMap,te=P&&!!v.iridescenceThicknessMap,le=k&&!!v.sheenColorMap,Pe=k&&!!v.sheenRoughnessMap,Ae=!!v.specularMap,me=!!v.specularColorMap,We=!!v.specularIntensityMap,U=H&&!!v.transmissionMap,ae=H&&!!v.thicknessMap,he=!!v.gradientMap,be=!!v.alphaMap,re=v.alphaTest>0,Q=!!v.alphaHash,we=!!v.extensions,ke=ni;v.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(ke=i.toneMapping);let ut={shaderID:Z,shaderType:v.type,shaderName:v.name,vertexShader:ee,fragmentShader:ce,defines:v.defines,customVertexShaderID:Me,customFragmentShaderID:$,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:p,batching:Ce,batchingColor:Ce&&V._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&V.instanceColor!==null,instancingMorph:Ie&&V.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:K===null?i.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Ni,alphaToCoverage:!!v.alphaToCoverage,map:Oe,matcap:Mt,envMap:I,envMapMode:I&&ie.mapping,envMapCubeUVHeight:R,aoMap:rt,lightMap:Fe,bumpMap:Le,normalMap:xe,displacementMap:f&&$e,emissiveMap:Se,normalMapObjectSpace:xe&&v.normalMapType===Uh,normalMapTangentSpace:xe&&v.normalMapType===Vl,metalnessMap:Be,roughnessMap:St,anisotropy:xt,anisotropyMap:F,clearcoat:T,clearcoatMap:se,clearcoatNormalMap:ne,clearcoatRoughnessMap:de,dispersion:g,iridescence:P,iridescenceMap:fe,iridescenceThicknessMap:te,sheen:k,sheenColorMap:le,sheenRoughnessMap:Pe,specularMap:Ae,specularColorMap:me,specularIntensityMap:We,transmission:H,transmissionMap:U,thicknessMap:ae,gradientMap:he,opaque:v.transparent===!1&&v.blending===Di&&v.alphaToCoverage===!1,alphaMap:be,alphaTest:re,alphaHash:Q,combine:v.combine,mapUv:Oe&&x(v.map.channel),aoMapUv:rt&&x(v.aoMap.channel),lightMapUv:Fe&&x(v.lightMap.channel),bumpMapUv:Le&&x(v.bumpMap.channel),normalMapUv:xe&&x(v.normalMap.channel),displacementMapUv:$e&&x(v.displacementMap.channel),emissiveMapUv:Se&&x(v.emissiveMap.channel),metalnessMapUv:Be&&x(v.metalnessMap.channel),roughnessMapUv:St&&x(v.roughnessMap.channel),anisotropyMapUv:F&&x(v.anisotropyMap.channel),clearcoatMapUv:se&&x(v.clearcoatMap.channel),clearcoatNormalMapUv:ne&&x(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:de&&x(v.clearcoatRoughnessMap.channel),iridescenceMapUv:fe&&x(v.iridescenceMap.channel),iridescenceThicknessMapUv:te&&x(v.iridescenceThicknessMap.channel),sheenColorMapUv:le&&x(v.sheenColorMap.channel),sheenRoughnessMapUv:Pe&&x(v.sheenRoughnessMap.channel),specularMapUv:Ae&&x(v.specularMap.channel),specularColorMapUv:me&&x(v.specularColorMap.channel),specularIntensityMapUv:We&&x(v.specularIntensityMap.channel),transmissionMapUv:U&&x(v.transmissionMap.channel),thicknessMapUv:ae&&x(v.thicknessMap.channel),alphaMapUv:be&&x(v.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(xe||xt),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!X.attributes.uv&&(Oe||be),fog:!!Y,useFog:v.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:v.flatShading===!0&&v.wireframe===!1,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:_e,skinning:V.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:ue,morphTextureStride:ve,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:ke,decodeVideoTexture:Oe&&v.map.isVideoTexture===!0&&Je.getTransfer(v.map.colorSpace)===it,decodeVideoTextureEmissive:Se&&v.emissiveMap.isVideoTexture===!0&&Je.getTransfer(v.emissiveMap.colorSpace)===it,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===zn,flipSided:v.side===qt,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:we&&v.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(we&&v.extensions.multiDraw===!0||Ce)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return ut.vertexUv1s=l.has(1),ut.vertexUv2s=l.has(2),ut.vertexUv3s=l.has(3),l.clear(),ut}function d(v){let b=[];if(v.shaderID?b.push(v.shaderID):(b.push(v.customVertexShaderID),b.push(v.customFragmentShaderID)),v.defines!==void 0)for(let D in v.defines)b.push(D),b.push(v.defines[D]);return v.isRawShaderMaterial===!1&&(E(b,v),y(b,v),b.push(i.outputColorSpace)),b.push(v.customProgramCacheKey),b.join()}function E(v,b){v.push(b.precision),v.push(b.outputColorSpace),v.push(b.envMapMode),v.push(b.envMapCubeUVHeight),v.push(b.mapUv),v.push(b.alphaMapUv),v.push(b.lightMapUv),v.push(b.aoMapUv),v.push(b.bumpMapUv),v.push(b.normalMapUv),v.push(b.displacementMapUv),v.push(b.emissiveMapUv),v.push(b.metalnessMapUv),v.push(b.roughnessMapUv),v.push(b.anisotropyMapUv),v.push(b.clearcoatMapUv),v.push(b.clearcoatNormalMapUv),v.push(b.clearcoatRoughnessMapUv),v.push(b.iridescenceMapUv),v.push(b.iridescenceThicknessMapUv),v.push(b.sheenColorMapUv),v.push(b.sheenRoughnessMapUv),v.push(b.specularMapUv),v.push(b.specularColorMapUv),v.push(b.specularIntensityMapUv),v.push(b.transmissionMapUv),v.push(b.thicknessMapUv),v.push(b.combine),v.push(b.fogExp2),v.push(b.sizeAttenuation),v.push(b.morphTargetsCount),v.push(b.morphAttributeCount),v.push(b.numDirLights),v.push(b.numPointLights),v.push(b.numSpotLights),v.push(b.numSpotLightMaps),v.push(b.numHemiLights),v.push(b.numRectAreaLights),v.push(b.numDirLightShadows),v.push(b.numPointLightShadows),v.push(b.numSpotLightShadows),v.push(b.numSpotLightShadowsWithMaps),v.push(b.numLightProbes),v.push(b.shadowMapType),v.push(b.toneMapping),v.push(b.numClippingPlanes),v.push(b.numClipIntersection),v.push(b.depthPacking)}function y(v,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),b.gradientMap&&a.enable(22),v.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),v.push(a.mask)}function S(v){let b=_[v.type],D;if(b){let O=Vn[b];D=qh.clone(O.uniforms)}else D=v.uniforms;return D}function A(v,b){let D;for(let O=0,V=h.length;O<V;O++){let Y=h[O];if(Y.cacheKey===b){D=Y,++D.usedTimes;break}}return D===void 0&&(D=new l_(i,b,v,r),h.push(D)),D}function w(v){if(--v.usedTimes===0){let b=h.indexOf(v);h[b]=h[h.length-1],h.pop(),v.destroy()}}function C(v){c.remove(v)}function L(){c.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:S,acquireProgram:A,releaseProgram:w,releaseShaderCache:C,programs:h,dispose:L}}function u_(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function d_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function mu(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function gu(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u,f,p,_,x,m){let d=i[e];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:_,renderOrder:u.renderOrder,z:x,group:m},i[e]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=_,d.renderOrder=u.renderOrder,d.z=x,d.group=m),e++,d}function a(u,f,p,_,x,m){let d=o(u,f,p,_,x,m);p.transmission>0?n.push(d):p.transparent===!0?s.push(d):t.push(d)}function c(u,f,p,_,x,m){let d=o(u,f,p,_,x,m);p.transmission>0?n.unshift(d):p.transparent===!0?s.unshift(d):t.unshift(d)}function l(u,f){t.length>1&&t.sort(u||d_),n.length>1&&n.sort(f||mu),s.length>1&&s.sort(f||mu)}function h(){for(let u=e,f=i.length;u<f;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function f_(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new gu,i.set(n,[o])):s>=r.length?(o=new gu,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function p_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new N,color:new ze};break;case"SpotLight":t={position:new N,direction:new N,color:new ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new ze,groundColor:new ze};break;case"RectAreaLight":t={color:new ze,position:new N,halfWidth:new N,halfHeight:new N};break}return i[e.id]=t,t}}}function m_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var g_=0;function __(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function x_(i){let e=new p_,t=m_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new N);let s=new N,r=new ht,o=new ht;function a(l){let h=0,u=0,f=0;for(let v=0;v<9;v++)n.probe[v].set(0,0,0);let p=0,_=0,x=0,m=0,d=0,E=0,y=0,S=0,A=0,w=0,C=0;l.sort(__);for(let v=0,b=l.length;v<b;v++){let D=l[v],O=D.color,V=D.intensity,Y=D.distance,X=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=O.r*V,u+=O.g*V,f+=O.b*V;else if(D.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(D.sh.coefficients[q],V);C++}else if(D.isDirectionalLight){let q=e.get(D);if(q.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let ie=D.shadow,R=t.get(D);R.shadowIntensity=ie.intensity,R.shadowBias=ie.bias,R.shadowNormalBias=ie.normalBias,R.shadowRadius=ie.radius,R.shadowMapSize=ie.mapSize,n.directionalShadow[p]=R,n.directionalShadowMap[p]=X,n.directionalShadowMatrix[p]=D.shadow.matrix,E++}n.directional[p]=q,p++}else if(D.isSpotLight){let q=e.get(D);q.position.setFromMatrixPosition(D.matrixWorld),q.color.copy(O).multiplyScalar(V),q.distance=Y,q.coneCos=Math.cos(D.angle),q.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),q.decay=D.decay,n.spot[x]=q;let ie=D.shadow;if(D.map&&(n.spotLightMap[A]=D.map,A++,ie.updateMatrices(D),D.castShadow&&w++),n.spotLightMatrix[x]=ie.matrix,D.castShadow){let R=t.get(D);R.shadowIntensity=ie.intensity,R.shadowBias=ie.bias,R.shadowNormalBias=ie.normalBias,R.shadowRadius=ie.radius,R.shadowMapSize=ie.mapSize,n.spotShadow[x]=R,n.spotShadowMap[x]=X,S++}x++}else if(D.isRectAreaLight){let q=e.get(D);q.color.copy(O).multiplyScalar(V),q.halfWidth.set(D.width*.5,0,0),q.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=q,m++}else if(D.isPointLight){let q=e.get(D);if(q.color.copy(D.color).multiplyScalar(D.intensity),q.distance=D.distance,q.decay=D.decay,D.castShadow){let ie=D.shadow,R=t.get(D);R.shadowIntensity=ie.intensity,R.shadowBias=ie.bias,R.shadowNormalBias=ie.normalBias,R.shadowRadius=ie.radius,R.shadowMapSize=ie.mapSize,R.shadowCameraNear=ie.camera.near,R.shadowCameraFar=ie.camera.far,n.pointShadow[_]=R,n.pointShadowMap[_]=X,n.pointShadowMatrix[_]=D.shadow.matrix,y++}n.point[_]=q,_++}else if(D.isHemisphereLight){let q=e.get(D);q.skyColor.copy(D.color).multiplyScalar(V),q.groundColor.copy(D.groundColor).multiplyScalar(V),n.hemi[d]=q,d++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=pe.LTC_FLOAT_1,n.rectAreaLTC2=pe.LTC_FLOAT_2):(n.rectAreaLTC1=pe.LTC_HALF_1,n.rectAreaLTC2=pe.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;let L=n.hash;(L.directionalLength!==p||L.pointLength!==_||L.spotLength!==x||L.rectAreaLength!==m||L.hemiLength!==d||L.numDirectionalShadows!==E||L.numPointShadows!==y||L.numSpotShadows!==S||L.numSpotMaps!==A||L.numLightProbes!==C)&&(n.directional.length=p,n.spot.length=x,n.rectArea.length=m,n.point.length=_,n.hemi.length=d,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=S+A-w,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=C,L.directionalLength=p,L.pointLength=_,L.spotLength=x,L.rectAreaLength=m,L.hemiLength=d,L.numDirectionalShadows=E,L.numPointShadows=y,L.numSpotShadows=S,L.numSpotMaps=A,L.numLightProbes=C,n.version=g_++)}function c(l,h){let u=0,f=0,p=0,_=0,x=0,m=h.matrixWorldInverse;for(let d=0,E=l.length;d<E;d++){let y=l[d];if(y.isDirectionalLight){let S=n.directional[u];S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),u++}else if(y.isSpotLight){let S=n.spot[p];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),p++}else if(y.isRectAreaLight){let S=n.rectArea[_];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(m),o.identity(),r.copy(y.matrixWorld),r.premultiply(m),o.extractRotation(r),S.halfWidth.set(y.width*.5,0,0),S.halfHeight.set(0,y.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),_++}else if(y.isPointLight){let S=n.point[f];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(m),f++}else if(y.isHemisphereLight){let S=n.hemi[x];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(m),x++}}}return{setup:a,setupView:c,state:n}}function _u(i){let e=new x_(i),t=[],n=[];function s(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function c(h){e.setupView(t,h)}let l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function y_(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new _u(i),e.set(s,[a])):r>=o.length?(a=new _u(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var v_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,b_=`uniform sampler2D shadow_pass;
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
}`;function M_(i,e,t){let n=new ws,s=new Te,r=new Te,o=new gt,a=new Ro({depthPacking:Nh}),c=new Io,l={},h=t.maxTextureSize,u={[Qn]:qt,[qt]:Qn,[zn]:zn},f=new Tn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Te},radius:{value:4}},vertexShader:v_,fragmentShader:b_}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let _=new _t;_.setAttribute("position",new Zt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new vt(_,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Cl;let d=this.type;this.render=function(w,C,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;let v=i.getRenderTarget(),b=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),O=i.state;O.setBlending(ti),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let V=d!==kn&&this.type===kn,Y=d===kn&&this.type!==kn;for(let X=0,q=w.length;X<q;X++){let ie=w[X],R=ie.shadow;if(R===void 0){console.warn("THREE.WebGLShadowMap:",ie,"has no shadow.");continue}if(R.autoUpdate===!1&&R.needsUpdate===!1)continue;s.copy(R.mapSize);let Z=R.getFrameExtents();if(s.multiply(Z),r.copy(R.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Z.x),s.x=r.x*Z.x,R.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Z.y),s.y=r.y*Z.y,R.mapSize.y=r.y)),R.map===null||V===!0||Y===!0){let ue=this.type!==kn?{minFilter:fn,magFilter:fn}:{};R.map!==null&&R.map.dispose(),R.map=new On(s.x,s.y,ue),R.map.texture.name=ie.name+".shadowMap",R.camera.updateProjectionMatrix()}i.setRenderTarget(R.map),i.clear();let J=R.getViewportCount();for(let ue=0;ue<J;ue++){let ve=R.getViewport(ue);o.set(r.x*ve.x,r.y*ve.y,r.x*ve.z,r.y*ve.w),O.viewport(o),R.updateMatrices(ie,ue),n=R.getFrustum(),S(C,L,R.camera,ie,this.type)}R.isPointLightShadow!==!0&&this.type===kn&&E(R,L),R.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(v,b,D)};function E(w,C){let L=e.update(x);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new On(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(C,null,L,f,x,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(C,null,L,p,x,null)}function y(w,C,L,v){let b=null,D=L.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(D!==void 0)b=D;else if(b=L.isPointLight===!0?c:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let O=b.uuid,V=C.uuid,Y=l[O];Y===void 0&&(Y={},l[O]=Y);let X=Y[V];X===void 0&&(X=b.clone(),Y[V]=X,C.addEventListener("dispose",A)),b=X}if(b.visible=C.visible,b.wireframe=C.wireframe,v===kn?b.side=C.shadowSide!==null?C.shadowSide:C.side:b.side=C.shadowSide!==null?C.shadowSide:u[C.side],b.alphaMap=C.alphaMap,b.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,b.map=C.map,b.clipShadows=C.clipShadows,b.clippingPlanes=C.clippingPlanes,b.clipIntersection=C.clipIntersection,b.displacementMap=C.displacementMap,b.displacementScale=C.displacementScale,b.displacementBias=C.displacementBias,b.wireframeLinewidth=C.wireframeLinewidth,b.linewidth=C.linewidth,L.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let O=i.properties.get(b);O.light=L}return b}function S(w,C,L,v,b){if(w.visible===!1)return;if(w.layers.test(C.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&b===kn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,w.matrixWorld);let V=e.update(w),Y=w.material;if(Array.isArray(Y)){let X=V.groups;for(let q=0,ie=X.length;q<ie;q++){let R=X[q],Z=Y[R.materialIndex];if(Z&&Z.visible){let J=y(w,Z,v,b);w.onBeforeShadow(i,w,C,L,V,J,R),i.renderBufferDirect(L,null,V,J,w,R),w.onAfterShadow(i,w,C,L,V,J,R)}}}else if(Y.visible){let X=y(w,Y,v,b);w.onBeforeShadow(i,w,C,L,V,X,null),i.renderBufferDirect(L,null,V,X,w,null),w.onAfterShadow(i,w,C,L,V,X,null)}}let O=w.children;for(let V=0,Y=O.length;V<Y;V++)S(O[V],C,L,v,b)}function A(w){w.target.removeEventListener("dispose",A);for(let L in l){let v=l[L],b=w.target.uuid;b in v&&(v[b].dispose(),delete v[b])}}}var S_={[Vo]:Go,[Wo]:Yo,[Xo]:Zo,[Li]:qo,[Go]:Vo,[Yo]:Wo,[Zo]:Xo,[qo]:Li};function E_(i,e){function t(){let U=!1,ae=new gt,he=null,be=new gt(0,0,0,0);return{setMask:function(re){he!==re&&!U&&(i.colorMask(re,re,re,re),he=re)},setLocked:function(re){U=re},setClear:function(re,Q,we,ke,ut){ut===!0&&(re*=ke,Q*=ke,we*=ke),ae.set(re,Q,we,ke),be.equals(ae)===!1&&(i.clearColor(re,Q,we,ke),be.copy(ae))},reset:function(){U=!1,he=null,be.set(-1,0,0,0)}}}function n(){let U=!1,ae=!1,he=null,be=null,re=null;return{setReversed:function(Q){if(ae!==Q){let we=e.get("EXT_clip_control");Q?we.clipControlEXT(we.LOWER_LEFT_EXT,we.ZERO_TO_ONE_EXT):we.clipControlEXT(we.LOWER_LEFT_EXT,we.NEGATIVE_ONE_TO_ONE_EXT),ae=Q;let ke=re;re=null,this.setClear(ke)}},getReversed:function(){return ae},setTest:function(Q){Q?K(i.DEPTH_TEST):_e(i.DEPTH_TEST)},setMask:function(Q){he!==Q&&!U&&(i.depthMask(Q),he=Q)},setFunc:function(Q){if(ae&&(Q=S_[Q]),be!==Q){switch(Q){case Vo:i.depthFunc(i.NEVER);break;case Go:i.depthFunc(i.ALWAYS);break;case Wo:i.depthFunc(i.LESS);break;case Li:i.depthFunc(i.LEQUAL);break;case Xo:i.depthFunc(i.EQUAL);break;case qo:i.depthFunc(i.GEQUAL);break;case Yo:i.depthFunc(i.GREATER);break;case Zo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}be=Q}},setLocked:function(Q){U=Q},setClear:function(Q){re!==Q&&(ae&&(Q=1-Q),i.clearDepth(Q),re=Q)},reset:function(){U=!1,he=null,be=null,re=null,ae=!1}}}function s(){let U=!1,ae=null,he=null,be=null,re=null,Q=null,we=null,ke=null,ut=null;return{setTest:function(et){U||(et?K(i.STENCIL_TEST):_e(i.STENCIL_TEST))},setMask:function(et){ae!==et&&!U&&(i.stencilMask(et),ae=et)},setFunc:function(et,Xn,In){(he!==et||be!==Xn||re!==In)&&(i.stencilFunc(et,Xn,In),he=et,be=Xn,re=In)},setOp:function(et,Xn,In){(Q!==et||we!==Xn||ke!==In)&&(i.stencilOp(et,Xn,In),Q=et,we=Xn,ke=In)},setLocked:function(et){U=et},setClear:function(et){ut!==et&&(i.clearStencil(et),ut=et)},reset:function(){U=!1,ae=null,he=null,be=null,re=null,Q=null,we=null,ke=null,ut=null}}}let r=new t,o=new n,a=new s,c=new WeakMap,l=new WeakMap,h={},u={},f=new WeakMap,p=[],_=null,x=!1,m=null,d=null,E=null,y=null,S=null,A=null,w=null,C=new ze(0,0,0),L=0,v=!1,b=null,D=null,O=null,V=null,Y=null,X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),q=!1,ie=0,R=i.getParameter(i.VERSION);R.indexOf("WebGL")!==-1?(ie=parseFloat(/^WebGL (\d)/.exec(R)[1]),q=ie>=1):R.indexOf("OpenGL ES")!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(R)[1]),q=ie>=2);let Z=null,J={},ue=i.getParameter(i.SCISSOR_BOX),ve=i.getParameter(i.VIEWPORT),ee=new gt().fromArray(ue),ce=new gt().fromArray(ve);function Me(U,ae,he,be){let re=new Uint8Array(4),Q=i.createTexture();i.bindTexture(U,Q),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let we=0;we<he;we++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(ae,0,i.RGBA,1,1,be,0,i.RGBA,i.UNSIGNED_BYTE,re):i.texImage2D(ae+we,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,re);return Q}let $={};$[i.TEXTURE_2D]=Me(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=Me(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=Me(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=Me(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),K(i.DEPTH_TEST),o.setFunc(Li),Le(!1),xe(Al),K(i.CULL_FACE),rt(ti);function K(U){h[U]!==!0&&(i.enable(U),h[U]=!0)}function _e(U){h[U]!==!1&&(i.disable(U),h[U]=!1)}function Ie(U,ae){return u[U]!==ae?(i.bindFramebuffer(U,ae),u[U]=ae,U===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ae),U===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ae),!0):!1}function Ce(U,ae){let he=p,be=!1;if(U){he=f.get(ae),he===void 0&&(he=[],f.set(ae,he));let re=U.textures;if(he.length!==re.length||he[0]!==i.COLOR_ATTACHMENT0){for(let Q=0,we=re.length;Q<we;Q++)he[Q]=i.COLOR_ATTACHMENT0+Q;he.length=re.length,be=!0}}else he[0]!==i.BACK&&(he[0]=i.BACK,be=!0);be&&i.drawBuffers(he)}function Oe(U){return _!==U?(i.useProgram(U),_=U,!0):!1}let Mt={[pi]:i.FUNC_ADD,[oh]:i.FUNC_SUBTRACT,[ah]:i.FUNC_REVERSE_SUBTRACT};Mt[lh]=i.MIN,Mt[ch]=i.MAX;let I={[hh]:i.ZERO,[uh]:i.ONE,[dh]:i.SRC_COLOR,[mo]:i.SRC_ALPHA,[xh]:i.SRC_ALPHA_SATURATE,[gh]:i.DST_COLOR,[ph]:i.DST_ALPHA,[fh]:i.ONE_MINUS_SRC_COLOR,[go]:i.ONE_MINUS_SRC_ALPHA,[_h]:i.ONE_MINUS_DST_COLOR,[mh]:i.ONE_MINUS_DST_ALPHA,[yh]:i.CONSTANT_COLOR,[vh]:i.ONE_MINUS_CONSTANT_COLOR,[bh]:i.CONSTANT_ALPHA,[Mh]:i.ONE_MINUS_CONSTANT_ALPHA};function rt(U,ae,he,be,re,Q,we,ke,ut,et){if(U===ti){x===!0&&(_e(i.BLEND),x=!1);return}if(x===!1&&(K(i.BLEND),x=!0),U!==rh){if(U!==m||et!==v){if((d!==pi||S!==pi)&&(i.blendEquation(i.FUNC_ADD),d=pi,S=pi),et)switch(U){case Di:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Rl:i.blendFunc(i.ONE,i.ONE);break;case Il:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Pl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Di:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Rl:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Il:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Pl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}E=null,y=null,A=null,w=null,C.set(0,0,0),L=0,m=U,v=et}return}re=re||ae,Q=Q||he,we=we||be,(ae!==d||re!==S)&&(i.blendEquationSeparate(Mt[ae],Mt[re]),d=ae,S=re),(he!==E||be!==y||Q!==A||we!==w)&&(i.blendFuncSeparate(I[he],I[be],I[Q],I[we]),E=he,y=be,A=Q,w=we),(ke.equals(C)===!1||ut!==L)&&(i.blendColor(ke.r,ke.g,ke.b,ut),C.copy(ke),L=ut),m=U,v=!1}function Fe(U,ae){U.side===zn?_e(i.CULL_FACE):K(i.CULL_FACE);let he=U.side===qt;ae&&(he=!he),Le(he),U.blending===Di&&U.transparent===!1?rt(ti):rt(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);let be=U.stencilWrite;a.setTest(be),be&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Se(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?K(i.SAMPLE_ALPHA_TO_COVERAGE):_e(i.SAMPLE_ALPHA_TO_COVERAGE)}function Le(U){b!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),b=U)}function xe(U){U!==ih?(K(i.CULL_FACE),U!==D&&(U===Al?i.cullFace(i.BACK):U===sh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):_e(i.CULL_FACE),D=U}function $e(U){U!==O&&(q&&i.lineWidth(U),O=U)}function Se(U,ae,he){U?(K(i.POLYGON_OFFSET_FILL),(V!==ae||Y!==he)&&(i.polygonOffset(ae,he),V=ae,Y=he)):_e(i.POLYGON_OFFSET_FILL)}function Be(U){U?K(i.SCISSOR_TEST):_e(i.SCISSOR_TEST)}function St(U){U===void 0&&(U=i.TEXTURE0+X-1),Z!==U&&(i.activeTexture(U),Z=U)}function xt(U,ae,he){he===void 0&&(Z===null?he=i.TEXTURE0+X-1:he=Z);let be=J[he];be===void 0&&(be={type:void 0,texture:void 0},J[he]=be),(be.type!==U||be.texture!==ae)&&(Z!==he&&(i.activeTexture(he),Z=he),i.bindTexture(U,ae||$[U]),be.type=U,be.texture=ae)}function T(){let U=J[Z];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function g(){try{i.compressedTexImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function P(){try{i.compressedTexImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function k(){try{i.texSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function H(){try{i.texSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function F(){try{i.compressedTexSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function se(){try{i.compressedTexSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ne(){try{i.texStorage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function de(){try{i.texStorage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function fe(){try{i.texImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function te(){try{i.texImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function le(U){ee.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),ee.copy(U))}function Pe(U){ce.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),ce.copy(U))}function Ae(U,ae){let he=l.get(ae);he===void 0&&(he=new WeakMap,l.set(ae,he));let be=he.get(U);be===void 0&&(be=i.getUniformBlockIndex(ae,U.name),he.set(U,be))}function me(U,ae){let be=l.get(ae).get(U);c.get(ae)!==be&&(i.uniformBlockBinding(ae,be,U.__bindingPointIndex),c.set(ae,be))}function We(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},Z=null,J={},u={},f=new WeakMap,p=[],_=null,x=!1,m=null,d=null,E=null,y=null,S=null,A=null,w=null,C=new ze(0,0,0),L=0,v=!1,b=null,D=null,O=null,V=null,Y=null,ee.set(0,0,i.canvas.width,i.canvas.height),ce.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:K,disable:_e,bindFramebuffer:Ie,drawBuffers:Ce,useProgram:Oe,setBlending:rt,setMaterial:Fe,setFlipSided:Le,setCullFace:xe,setLineWidth:$e,setPolygonOffset:Se,setScissorTest:Be,activeTexture:St,bindTexture:xt,unbindTexture:T,compressedTexImage2D:g,compressedTexImage3D:P,texImage2D:fe,texImage3D:te,updateUBOMapping:Ae,uniformBlockBinding:me,texStorage2D:ne,texStorage3D:de,texSubImage2D:k,texSubImage3D:H,compressedTexSubImage2D:F,compressedTexSubImage3D:se,scissor:le,viewport:Pe,reset:We}}function w_(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Te,h=new WeakMap,u,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(T,g){return p?new OffscreenCanvas(T,g):ir("canvas")}function x(T,g,P){let k=1,H=xt(T);if((H.width>P||H.height>P)&&(k=P/Math.max(H.width,H.height)),k<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){let F=Math.floor(k*H.width),se=Math.floor(k*H.height);u===void 0&&(u=_(F,se));let ne=g?_(F,se):u;return ne.width=F,ne.height=se,ne.getContext("2d").drawImage(T,0,0,F,se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+H.width+"x"+H.height+") to ("+F+"x"+se+")."),ne}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+H.width+"x"+H.height+")."),T;return T}function m(T){return T.generateMipmaps}function d(T){i.generateMipmap(T)}function E(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(T,g,P,k,H=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let F=g;if(g===i.RED&&(P===i.FLOAT&&(F=i.R32F),P===i.HALF_FLOAT&&(F=i.R16F),P===i.UNSIGNED_BYTE&&(F=i.R8)),g===i.RED_INTEGER&&(P===i.UNSIGNED_BYTE&&(F=i.R8UI),P===i.UNSIGNED_SHORT&&(F=i.R16UI),P===i.UNSIGNED_INT&&(F=i.R32UI),P===i.BYTE&&(F=i.R8I),P===i.SHORT&&(F=i.R16I),P===i.INT&&(F=i.R32I)),g===i.RG&&(P===i.FLOAT&&(F=i.RG32F),P===i.HALF_FLOAT&&(F=i.RG16F),P===i.UNSIGNED_BYTE&&(F=i.RG8)),g===i.RG_INTEGER&&(P===i.UNSIGNED_BYTE&&(F=i.RG8UI),P===i.UNSIGNED_SHORT&&(F=i.RG16UI),P===i.UNSIGNED_INT&&(F=i.RG32UI),P===i.BYTE&&(F=i.RG8I),P===i.SHORT&&(F=i.RG16I),P===i.INT&&(F=i.RG32I)),g===i.RGB_INTEGER&&(P===i.UNSIGNED_BYTE&&(F=i.RGB8UI),P===i.UNSIGNED_SHORT&&(F=i.RGB16UI),P===i.UNSIGNED_INT&&(F=i.RGB32UI),P===i.BYTE&&(F=i.RGB8I),P===i.SHORT&&(F=i.RGB16I),P===i.INT&&(F=i.RGB32I)),g===i.RGBA_INTEGER&&(P===i.UNSIGNED_BYTE&&(F=i.RGBA8UI),P===i.UNSIGNED_SHORT&&(F=i.RGBA16UI),P===i.UNSIGNED_INT&&(F=i.RGBA32UI),P===i.BYTE&&(F=i.RGBA8I),P===i.SHORT&&(F=i.RGBA16I),P===i.INT&&(F=i.RGBA32I)),g===i.RGB&&(P===i.UNSIGNED_INT_5_9_9_9_REV&&(F=i.RGB9_E5),P===i.UNSIGNED_INT_10F_11F_11F_REV&&(F=i.R11F_G11F_B10F)),g===i.RGBA){let se=H?tr:Je.getTransfer(k);P===i.FLOAT&&(F=i.RGBA32F),P===i.HALF_FLOAT&&(F=i.RGBA16F),P===i.UNSIGNED_BYTE&&(F=se===it?i.SRGB8_ALPHA8:i.RGBA8),P===i.UNSIGNED_SHORT_4_4_4_4&&(F=i.RGBA4),P===i.UNSIGNED_SHORT_5_5_5_1&&(F=i.RGB5_A1)}return(F===i.R16F||F===i.R32F||F===i.RG16F||F===i.RG32F||F===i.RGBA16F||F===i.RGBA32F)&&e.get("EXT_color_buffer_float"),F}function S(T,g){let P;return T?g===null||g===Mi||g===Ps?P=i.DEPTH24_STENCIL8:g===Hn?P=i.DEPTH32F_STENCIL8:g===Rs&&(P=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===Mi||g===Ps?P=i.DEPTH_COMPONENT24:g===Hn?P=i.DEPTH_COMPONENT32F:g===Rs&&(P=i.DEPTH_COMPONENT16),P}function A(T,g){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==fn&&T.minFilter!==En?Math.log2(Math.max(g.width,g.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?g.mipmaps.length:1}function w(T){let g=T.target;g.removeEventListener("dispose",w),L(g),g.isVideoTexture&&h.delete(g)}function C(T){let g=T.target;g.removeEventListener("dispose",C),b(g)}function L(T){let g=n.get(T);if(g.__webglInit===void 0)return;let P=T.source,k=f.get(P);if(k){let H=k[g.__cacheKey];H.usedTimes--,H.usedTimes===0&&v(T),Object.keys(k).length===0&&f.delete(P)}n.remove(T)}function v(T){let g=n.get(T);i.deleteTexture(g.__webglTexture);let P=T.source,k=f.get(P);delete k[g.__cacheKey],o.memory.textures--}function b(T){let g=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let k=0;k<6;k++){if(Array.isArray(g.__webglFramebuffer[k]))for(let H=0;H<g.__webglFramebuffer[k].length;H++)i.deleteFramebuffer(g.__webglFramebuffer[k][H]);else i.deleteFramebuffer(g.__webglFramebuffer[k]);g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer[k])}else{if(Array.isArray(g.__webglFramebuffer))for(let k=0;k<g.__webglFramebuffer.length;k++)i.deleteFramebuffer(g.__webglFramebuffer[k]);else i.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&i.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let k=0;k<g.__webglColorRenderbuffer.length;k++)g.__webglColorRenderbuffer[k]&&i.deleteRenderbuffer(g.__webglColorRenderbuffer[k]);g.__webglDepthRenderbuffer&&i.deleteRenderbuffer(g.__webglDepthRenderbuffer)}let P=T.textures;for(let k=0,H=P.length;k<H;k++){let F=n.get(P[k]);F.__webglTexture&&(i.deleteTexture(F.__webglTexture),o.memory.textures--),n.remove(P[k])}n.remove(T)}let D=0;function O(){D=0}function V(){let T=D;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),D+=1,T}function Y(T){let g=[];return g.push(T.wrapS),g.push(T.wrapT),g.push(T.wrapR||0),g.push(T.magFilter),g.push(T.minFilter),g.push(T.anisotropy),g.push(T.internalFormat),g.push(T.format),g.push(T.type),g.push(T.generateMipmaps),g.push(T.premultiplyAlpha),g.push(T.flipY),g.push(T.unpackAlignment),g.push(T.colorSpace),g.join()}function X(T,g){let P=n.get(T);if(T.isVideoTexture&&Be(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&P.__version!==T.version){let k=T.image;if(k===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(k.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(P,T,g);return}}else T.isExternalTexture&&(P.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,P.__webglTexture,i.TEXTURE0+g)}function q(T,g){let P=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&P.__version!==T.version){$(P,T,g);return}t.bindTexture(i.TEXTURE_2D_ARRAY,P.__webglTexture,i.TEXTURE0+g)}function ie(T,g){let P=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&P.__version!==T.version){$(P,T,g);return}t.bindTexture(i.TEXTURE_3D,P.__webglTexture,i.TEXTURE0+g)}function R(T,g){let P=n.get(T);if(T.version>0&&P.__version!==T.version){K(P,T,g);return}t.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+g)}let Z={[_o]:i.REPEAT,[fi]:i.CLAMP_TO_EDGE,[xo]:i.MIRRORED_REPEAT},J={[fn]:i.NEAREST,[Dh]:i.NEAREST_MIPMAP_NEAREST,[wr]:i.NEAREST_MIPMAP_LINEAR,[En]:i.LINEAR,[Jo]:i.LINEAR_MIPMAP_NEAREST,[bi]:i.LINEAR_MIPMAP_LINEAR},ue={[Oh]:i.NEVER,[Vh]:i.ALWAYS,[Fh]:i.LESS,[Gl]:i.LEQUAL,[Bh]:i.EQUAL,[Hh]:i.GEQUAL,[kh]:i.GREATER,[zh]:i.NOTEQUAL};function ve(T,g){if(g.type===Hn&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===En||g.magFilter===Jo||g.magFilter===wr||g.magFilter===bi||g.minFilter===En||g.minFilter===Jo||g.minFilter===wr||g.minFilter===bi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,Z[g.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,Z[g.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,Z[g.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,J[g.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,J[g.minFilter]),g.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,ue[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===fn||g.minFilter!==wr&&g.minFilter!==bi||g.type===Hn&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||n.get(g).__currentAnisotropy){let P=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,P.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,s.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy}}}function ee(T,g){let P=!1;T.__webglInit===void 0&&(T.__webglInit=!0,g.addEventListener("dispose",w));let k=g.source,H=f.get(k);H===void 0&&(H={},f.set(k,H));let F=Y(g);if(F!==T.__cacheKey){H[F]===void 0&&(H[F]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,P=!0),H[F].usedTimes++;let se=H[T.__cacheKey];se!==void 0&&(H[T.__cacheKey].usedTimes--,se.usedTimes===0&&v(g)),T.__cacheKey=F,T.__webglTexture=H[F].texture}return P}function ce(T,g,P){return Math.floor(Math.floor(T/P)/g)}function Me(T,g,P,k){let F=T.updateRanges;if(F.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,g.width,g.height,P,k,g.data);else{F.sort((te,le)=>te.start-le.start);let se=0;for(let te=1;te<F.length;te++){let le=F[se],Pe=F[te],Ae=le.start+le.count,me=ce(Pe.start,g.width,4),We=ce(le.start,g.width,4);Pe.start<=Ae+1&&me===We&&ce(Pe.start+Pe.count-1,g.width,4)===me?le.count=Math.max(le.count,Pe.start+Pe.count-le.start):(++se,F[se]=Pe)}F.length=se+1;let ne=i.getParameter(i.UNPACK_ROW_LENGTH),de=i.getParameter(i.UNPACK_SKIP_PIXELS),fe=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,g.width);for(let te=0,le=F.length;te<le;te++){let Pe=F[te],Ae=Math.floor(Pe.start/4),me=Math.ceil(Pe.count/4),We=Ae%g.width,U=Math.floor(Ae/g.width),ae=me,he=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,We),i.pixelStorei(i.UNPACK_SKIP_ROWS,U),t.texSubImage2D(i.TEXTURE_2D,0,We,U,ae,he,P,k,g.data)}T.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ne),i.pixelStorei(i.UNPACK_SKIP_PIXELS,de),i.pixelStorei(i.UNPACK_SKIP_ROWS,fe)}}function $(T,g,P){let k=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(k=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(k=i.TEXTURE_3D);let H=ee(T,g),F=g.source;t.bindTexture(k,T.__webglTexture,i.TEXTURE0+P);let se=n.get(F);if(F.version!==se.__version||H===!0){t.activeTexture(i.TEXTURE0+P);let ne=Je.getPrimaries(Je.workingColorSpace),de=g.colorSpace===ii?null:Je.getPrimaries(g.colorSpace),fe=g.colorSpace===ii||ne===de?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,fe);let te=x(g.image,!1,s.maxTextureSize);te=St(g,te);let le=r.convert(g.format,g.colorSpace),Pe=r.convert(g.type),Ae=y(g.internalFormat,le,Pe,g.colorSpace,g.isVideoTexture);ve(k,g);let me,We=g.mipmaps,U=g.isVideoTexture!==!0,ae=se.__version===void 0||H===!0,he=F.dataReady,be=A(g,te);if(g.isDepthTexture)Ae=S(g.format===Ds,g.type),ae&&(U?t.texStorage2D(i.TEXTURE_2D,1,Ae,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,Ae,te.width,te.height,0,le,Pe,null));else if(g.isDataTexture)if(We.length>0){U&&ae&&t.texStorage2D(i.TEXTURE_2D,be,Ae,We[0].width,We[0].height);for(let re=0,Q=We.length;re<Q;re++)me=We[re],U?he&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,me.width,me.height,le,Pe,me.data):t.texImage2D(i.TEXTURE_2D,re,Ae,me.width,me.height,0,le,Pe,me.data);g.generateMipmaps=!1}else U?(ae&&t.texStorage2D(i.TEXTURE_2D,be,Ae,te.width,te.height),he&&Me(g,te,le,Pe)):t.texImage2D(i.TEXTURE_2D,0,Ae,te.width,te.height,0,le,Pe,te.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){U&&ae&&t.texStorage3D(i.TEXTURE_2D_ARRAY,be,Ae,We[0].width,We[0].height,te.depth);for(let re=0,Q=We.length;re<Q;re++)if(me=We[re],g.format!==gn)if(le!==null)if(U){if(he)if(g.layerUpdates.size>0){let we=Jl(me.width,me.height,g.format,g.type);for(let ke of g.layerUpdates){let ut=me.data.subarray(ke*we/me.data.BYTES_PER_ELEMENT,(ke+1)*we/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,ke,me.width,me.height,1,le,ut)}g.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,me.width,me.height,te.depth,le,me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,re,Ae,me.width,me.height,te.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else U?he&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,me.width,me.height,te.depth,le,Pe,me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,re,Ae,me.width,me.height,te.depth,0,le,Pe,me.data)}else{U&&ae&&t.texStorage2D(i.TEXTURE_2D,be,Ae,We[0].width,We[0].height);for(let re=0,Q=We.length;re<Q;re++)me=We[re],g.format!==gn?le!==null?U?he&&t.compressedTexSubImage2D(i.TEXTURE_2D,re,0,0,me.width,me.height,le,me.data):t.compressedTexImage2D(i.TEXTURE_2D,re,Ae,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?he&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,me.width,me.height,le,Pe,me.data):t.texImage2D(i.TEXTURE_2D,re,Ae,me.width,me.height,0,le,Pe,me.data)}else if(g.isDataArrayTexture)if(U){if(ae&&t.texStorage3D(i.TEXTURE_2D_ARRAY,be,Ae,te.width,te.height,te.depth),he)if(g.layerUpdates.size>0){let re=Jl(te.width,te.height,g.format,g.type);for(let Q of g.layerUpdates){let we=te.data.subarray(Q*re/te.data.BYTES_PER_ELEMENT,(Q+1)*re/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Q,te.width,te.height,1,le,Pe,we)}g.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,le,Pe,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ae,te.width,te.height,te.depth,0,le,Pe,te.data);else if(g.isData3DTexture)U?(ae&&t.texStorage3D(i.TEXTURE_3D,be,Ae,te.width,te.height,te.depth),he&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,le,Pe,te.data)):t.texImage3D(i.TEXTURE_3D,0,Ae,te.width,te.height,te.depth,0,le,Pe,te.data);else if(g.isFramebufferTexture){if(ae)if(U)t.texStorage2D(i.TEXTURE_2D,be,Ae,te.width,te.height);else{let re=te.width,Q=te.height;for(let we=0;we<be;we++)t.texImage2D(i.TEXTURE_2D,we,Ae,re,Q,0,le,Pe,null),re>>=1,Q>>=1}}else if(We.length>0){if(U&&ae){let re=xt(We[0]);t.texStorage2D(i.TEXTURE_2D,be,Ae,re.width,re.height)}for(let re=0,Q=We.length;re<Q;re++)me=We[re],U?he&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,le,Pe,me):t.texImage2D(i.TEXTURE_2D,re,Ae,le,Pe,me);g.generateMipmaps=!1}else if(U){if(ae){let re=xt(te);t.texStorage2D(i.TEXTURE_2D,be,Ae,re.width,re.height)}he&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,le,Pe,te)}else t.texImage2D(i.TEXTURE_2D,0,Ae,le,Pe,te);m(g)&&d(k),se.__version=F.version,g.onUpdate&&g.onUpdate(g)}T.__version=g.version}function K(T,g,P){if(g.image.length!==6)return;let k=ee(T,g),H=g.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+P);let F=n.get(H);if(H.version!==F.__version||k===!0){t.activeTexture(i.TEXTURE0+P);let se=Je.getPrimaries(Je.workingColorSpace),ne=g.colorSpace===ii?null:Je.getPrimaries(g.colorSpace),de=g.colorSpace===ii||se===ne?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,de);let fe=g.isCompressedTexture||g.image[0].isCompressedTexture,te=g.image[0]&&g.image[0].isDataTexture,le=[];for(let Q=0;Q<6;Q++)!fe&&!te?le[Q]=x(g.image[Q],!0,s.maxCubemapSize):le[Q]=te?g.image[Q].image:g.image[Q],le[Q]=St(g,le[Q]);let Pe=le[0],Ae=r.convert(g.format,g.colorSpace),me=r.convert(g.type),We=y(g.internalFormat,Ae,me,g.colorSpace),U=g.isVideoTexture!==!0,ae=F.__version===void 0||k===!0,he=H.dataReady,be=A(g,Pe);ve(i.TEXTURE_CUBE_MAP,g);let re;if(fe){U&&ae&&t.texStorage2D(i.TEXTURE_CUBE_MAP,be,We,Pe.width,Pe.height);for(let Q=0;Q<6;Q++){re=le[Q].mipmaps;for(let we=0;we<re.length;we++){let ke=re[we];g.format!==gn?Ae!==null?U?he&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,we,0,0,ke.width,ke.height,Ae,ke.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,we,We,ke.width,ke.height,0,ke.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,we,0,0,ke.width,ke.height,Ae,me,ke.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,we,We,ke.width,ke.height,0,Ae,me,ke.data)}}}else{if(re=g.mipmaps,U&&ae){re.length>0&&be++;let Q=xt(le[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,be,We,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(te){U?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,le[Q].width,le[Q].height,Ae,me,le[Q].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,We,le[Q].width,le[Q].height,0,Ae,me,le[Q].data);for(let we=0;we<re.length;we++){let ut=re[we].image[Q].image;U?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,we+1,0,0,ut.width,ut.height,Ae,me,ut.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,we+1,We,ut.width,ut.height,0,Ae,me,ut.data)}}else{U?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Ae,me,le[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,We,Ae,me,le[Q]);for(let we=0;we<re.length;we++){let ke=re[we];U?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,we+1,0,0,Ae,me,ke.image[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,we+1,We,Ae,me,ke.image[Q])}}}m(g)&&d(i.TEXTURE_CUBE_MAP),F.__version=H.version,g.onUpdate&&g.onUpdate(g)}T.__version=g.version}function _e(T,g,P,k,H,F){let se=r.convert(P.format,P.colorSpace),ne=r.convert(P.type),de=y(P.internalFormat,se,ne,P.colorSpace),fe=n.get(g),te=n.get(P);if(te.__renderTarget=g,!fe.__hasExternalTextures){let le=Math.max(1,g.width>>F),Pe=Math.max(1,g.height>>F);H===i.TEXTURE_3D||H===i.TEXTURE_2D_ARRAY?t.texImage3D(H,F,de,le,Pe,g.depth,0,se,ne,null):t.texImage2D(H,F,de,le,Pe,0,se,ne,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),Se(g)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,k,H,te.__webglTexture,0,$e(g)):(H===i.TEXTURE_2D||H>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&H<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,k,H,te.__webglTexture,F),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ie(T,g,P){if(i.bindRenderbuffer(i.RENDERBUFFER,T),g.depthBuffer){let k=g.depthTexture,H=k&&k.isDepthTexture?k.type:null,F=S(g.stencilBuffer,H),se=g.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=$e(g);Se(g)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ne,F,g.width,g.height):P?i.renderbufferStorageMultisample(i.RENDERBUFFER,ne,F,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,F,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,se,i.RENDERBUFFER,T)}else{let k=g.textures;for(let H=0;H<k.length;H++){let F=k[H],se=r.convert(F.format,F.colorSpace),ne=r.convert(F.type),de=y(F.internalFormat,se,ne,F.colorSpace),fe=$e(g);P&&Se(g)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,fe,de,g.width,g.height):Se(g)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,fe,de,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,de,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ce(T,g){if(g&&g.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let k=n.get(g.depthTexture);k.__renderTarget=g,(!k.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),X(g.depthTexture,0);let H=k.__webglTexture,F=$e(g);if(g.depthTexture.format===xs)Se(g)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,H,0,F):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,H,0);else if(g.depthTexture.format===Ds)Se(g)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,H,0,F):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,H,0);else throw new Error("Unknown depthTexture format")}function Oe(T){let g=n.get(T),P=T.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==T.depthTexture){let k=T.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),k){let H=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,k.removeEventListener("dispose",H)};k.addEventListener("dispose",H),g.__depthDisposeCallback=H}g.__boundDepthTexture=k}if(T.depthTexture&&!g.__autoAllocateDepthBuffer){if(P)throw new Error("target.depthTexture not supported in Cube render targets");let k=T.texture.mipmaps;k&&k.length>0?Ce(g.__webglFramebuffer[0],T):Ce(g.__webglFramebuffer,T)}else if(P){g.__webglDepthbuffer=[];for(let k=0;k<6;k++)if(t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[k]),g.__webglDepthbuffer[k]===void 0)g.__webglDepthbuffer[k]=i.createRenderbuffer(),Ie(g.__webglDepthbuffer[k],T,!1);else{let H=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,F=g.__webglDepthbuffer[k];i.bindRenderbuffer(i.RENDERBUFFER,F),i.framebufferRenderbuffer(i.FRAMEBUFFER,H,i.RENDERBUFFER,F)}}else{let k=T.texture.mipmaps;if(k&&k.length>0?t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=i.createRenderbuffer(),Ie(g.__webglDepthbuffer,T,!1);else{let H=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,F=g.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,F),i.framebufferRenderbuffer(i.FRAMEBUFFER,H,i.RENDERBUFFER,F)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Mt(T,g,P){let k=n.get(T);g!==void 0&&_e(k.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),P!==void 0&&Oe(T)}function I(T){let g=T.texture,P=n.get(T),k=n.get(g);T.addEventListener("dispose",C);let H=T.textures,F=T.isWebGLCubeRenderTarget===!0,se=H.length>1;if(se||(k.__webglTexture===void 0&&(k.__webglTexture=i.createTexture()),k.__version=g.version,o.memory.textures++),F){P.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(g.mipmaps&&g.mipmaps.length>0){P.__webglFramebuffer[ne]=[];for(let de=0;de<g.mipmaps.length;de++)P.__webglFramebuffer[ne][de]=i.createFramebuffer()}else P.__webglFramebuffer[ne]=i.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){P.__webglFramebuffer=[];for(let ne=0;ne<g.mipmaps.length;ne++)P.__webglFramebuffer[ne]=i.createFramebuffer()}else P.__webglFramebuffer=i.createFramebuffer();if(se)for(let ne=0,de=H.length;ne<de;ne++){let fe=n.get(H[ne]);fe.__webglTexture===void 0&&(fe.__webglTexture=i.createTexture(),o.memory.textures++)}if(T.samples>0&&Se(T)===!1){P.__webglMultisampledFramebuffer=i.createFramebuffer(),P.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,P.__webglMultisampledFramebuffer);for(let ne=0;ne<H.length;ne++){let de=H[ne];P.__webglColorRenderbuffer[ne]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,P.__webglColorRenderbuffer[ne]);let fe=r.convert(de.format,de.colorSpace),te=r.convert(de.type),le=y(de.internalFormat,fe,te,de.colorSpace,T.isXRRenderTarget===!0),Pe=$e(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Pe,le,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ne,i.RENDERBUFFER,P.__webglColorRenderbuffer[ne])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(P.__webglDepthRenderbuffer=i.createRenderbuffer(),Ie(P.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(F){t.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture),ve(i.TEXTURE_CUBE_MAP,g);for(let ne=0;ne<6;ne++)if(g.mipmaps&&g.mipmaps.length>0)for(let de=0;de<g.mipmaps.length;de++)_e(P.__webglFramebuffer[ne][de],T,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,de);else _e(P.__webglFramebuffer[ne],T,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);m(g)&&d(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(se){for(let ne=0,de=H.length;ne<de;ne++){let fe=H[ne],te=n.get(fe),le=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(le=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(le,te.__webglTexture),ve(le,fe),_e(P.__webglFramebuffer,T,fe,i.COLOR_ATTACHMENT0+ne,le,0),m(fe)&&d(le)}t.unbindTexture()}else{let ne=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ne=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ne,k.__webglTexture),ve(ne,g),g.mipmaps&&g.mipmaps.length>0)for(let de=0;de<g.mipmaps.length;de++)_e(P.__webglFramebuffer[de],T,g,i.COLOR_ATTACHMENT0,ne,de);else _e(P.__webglFramebuffer,T,g,i.COLOR_ATTACHMENT0,ne,0);m(g)&&d(ne),t.unbindTexture()}T.depthBuffer&&Oe(T)}function rt(T){let g=T.textures;for(let P=0,k=g.length;P<k;P++){let H=g[P];if(m(H)){let F=E(T),se=n.get(H).__webglTexture;t.bindTexture(F,se),d(F),t.unbindTexture()}}}let Fe=[],Le=[];function xe(T){if(T.samples>0){if(Se(T)===!1){let g=T.textures,P=T.width,k=T.height,H=i.COLOR_BUFFER_BIT,F=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=n.get(T),ne=g.length>1;if(ne)for(let fe=0;fe<g.length;fe++)t.bindFramebuffer(i.FRAMEBUFFER,se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,se.__webglMultisampledFramebuffer);let de=T.texture.mipmaps;de&&de.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglFramebuffer);for(let fe=0;fe<g.length;fe++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(H|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(H|=i.STENCIL_BUFFER_BIT)),ne){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,se.__webglColorRenderbuffer[fe]);let te=n.get(g[fe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,te,0)}i.blitFramebuffer(0,0,P,k,0,0,P,k,H,i.NEAREST),c===!0&&(Fe.length=0,Le.length=0,Fe.push(i.COLOR_ATTACHMENT0+fe),T.depthBuffer&&T.resolveDepthBuffer===!1&&(Fe.push(F),Le.push(F),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Le)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Fe))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ne)for(let fe=0;fe<g.length;fe++){t.bindFramebuffer(i.FRAMEBUFFER,se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,se.__webglColorRenderbuffer[fe]);let te=n.get(g[fe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,te,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){let g=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[g])}}}function $e(T){return Math.min(s.maxSamples,T.samples)}function Se(T){let g=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function Be(T){let g=o.render.frame;h.get(T)!==g&&(h.set(T,g),T.update())}function St(T,g){let P=T.colorSpace,k=T.format,H=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||P!==Ni&&P!==ii&&(Je.getTransfer(P)===it?(k!==gn||H!==Cn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",P)),g}function xt(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=V,this.resetTextureUnits=O,this.setTexture2D=X,this.setTexture2DArray=q,this.setTexture3D=ie,this.setTextureCube=R,this.rebindTextures=Mt,this.setupRenderTarget=I,this.updateRenderTargetMipmap=rt,this.updateMultisampleRenderTarget=xe,this.setupDepthRenderbuffer=Oe,this.setupFrameBufferTexture=_e,this.useMultisampledRTT=Se}function T_(i,e){function t(n,s=ii){let r,o=Je.getTransfer(s);if(n===Cn)return i.UNSIGNED_BYTE;if(n===Qo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ea)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ol)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Fl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Nl)return i.BYTE;if(n===Ul)return i.SHORT;if(n===Rs)return i.UNSIGNED_SHORT;if(n===Ko)return i.INT;if(n===Mi)return i.UNSIGNED_INT;if(n===Hn)return i.FLOAT;if(n===Is)return i.HALF_FLOAT;if(n===Bl)return i.ALPHA;if(n===kl)return i.RGB;if(n===gn)return i.RGBA;if(n===xs)return i.DEPTH_COMPONENT;if(n===Ds)return i.DEPTH_STENCIL;if(n===zl)return i.RED;if(n===ta)return i.RED_INTEGER;if(n===Hl)return i.RG;if(n===na)return i.RG_INTEGER;if(n===ia)return i.RGBA_INTEGER;if(n===Tr||n===Ar||n===Cr||n===Rr)if(o===it)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Tr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Cr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Rr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Tr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ar)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Cr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Rr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===sa||n===ra||n===oa||n===aa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===sa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ra)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===oa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===aa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===la||n===ca||n===ha)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===la||n===ca)return o===it?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ha)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ua||n===da||n===fa||n===pa||n===ma||n===ga||n===_a||n===xa||n===ya||n===va||n===ba||n===Ma||n===Sa||n===Ea)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ua)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===da)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===fa)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===pa)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ma)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ga)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===_a)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===xa)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ya)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===va)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ba)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ma)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Sa)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ea)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===wa||n===Ta||n===Aa)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===wa)return o===it?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ta)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Aa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ca||n===Ra||n===Ia||n===Pa)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ca)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ra)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ia)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Pa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ps?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var A_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,C_=`
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

}`,hc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new fr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Tn({vertexShader:A_,fragmentShader:C_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new vt(new ki(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},uc=class extends Un{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,f=null,p=null,_=null,x=typeof XRWebGLBinding<"u",m=new hc,d={},E=t.getContextAttributes(),y=null,S=null,A=[],w=[],C=new Te,L=null,v=new Pt;v.viewport=new gt;let b=new Pt;b.viewport=new gt;let D=[v,b],O=new zo,V=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let K=A[$];return K===void 0&&(K=new Ss,A[$]=K),K.getTargetRaySpace()},this.getControllerGrip=function($){let K=A[$];return K===void 0&&(K=new Ss,A[$]=K),K.getGripSpace()},this.getHand=function($){let K=A[$];return K===void 0&&(K=new Ss,A[$]=K),K.getHandSpace()};function X($){let K=w.indexOf($.inputSource);if(K===-1)return;let _e=A[K];_e!==void 0&&(_e.update($.inputSource,$.frame,l||o),_e.dispatchEvent({type:$.type,data:$.inputSource}))}function q(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",ie);for(let $=0;$<A.length;$++){let K=w[$];K!==null&&(w[$]=null,A[$].disconnect(K))}V=null,Y=null,m.reset();for(let $ in d)delete d[$];e.setRenderTarget(y),p=null,f=null,u=null,s=null,S=null,Me.stop(),n.isPresenting=!1,e.setPixelRatio(L),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(y=e.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",q),s.addEventListener("inputsourceschange",ie),E.xrCompatible!==!0&&await t.makeXRCompatible(),L=e.getPixelRatio(),e.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let _e=null,Ie=null,Ce=null;E.depth&&(Ce=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,_e=E.stencil?Ds:xs,Ie=E.stencil?Ps:Mi);let Oe={colorFormat:t.RGBA8,depthFormat:Ce,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(Oe),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new On(f.textureWidth,f.textureHeight,{format:gn,type:Cn,depthTexture:new dr(f.textureWidth,f.textureHeight,Ie,void 0,void 0,void 0,void 0,void 0,void 0,_e),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let _e={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,_e),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new On(p.framebufferWidth,p.framebufferHeight,{format:gn,type:Cn,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Me.setContext(s),Me.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ie($){for(let K=0;K<$.removed.length;K++){let _e=$.removed[K],Ie=w.indexOf(_e);Ie>=0&&(w[Ie]=null,A[Ie].disconnect(_e))}for(let K=0;K<$.added.length;K++){let _e=$.added[K],Ie=w.indexOf(_e);if(Ie===-1){for(let Oe=0;Oe<A.length;Oe++)if(Oe>=w.length){w.push(_e),Ie=Oe;break}else if(w[Oe]===null){w[Oe]=_e,Ie=Oe;break}if(Ie===-1)break}let Ce=A[Ie];Ce&&Ce.connect(_e)}}let R=new N,Z=new N;function J($,K,_e){R.setFromMatrixPosition(K.matrixWorld),Z.setFromMatrixPosition(_e.matrixWorld);let Ie=R.distanceTo(Z),Ce=K.projectionMatrix.elements,Oe=_e.projectionMatrix.elements,Mt=Ce[14]/(Ce[10]-1),I=Ce[14]/(Ce[10]+1),rt=(Ce[9]+1)/Ce[5],Fe=(Ce[9]-1)/Ce[5],Le=(Ce[8]-1)/Ce[0],xe=(Oe[8]+1)/Oe[0],$e=Mt*Le,Se=Mt*xe,Be=Ie/(-Le+xe),St=Be*-Le;if(K.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(St),$.translateZ(Be),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Ce[10]===-1)$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{let xt=Mt+Be,T=I+Be,g=$e-St,P=Se+(Ie-St),k=rt*I/T*xt,H=Fe*I/T*xt;$.projectionMatrix.makePerspective(g,P,k,H,xt,T),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function ue($,K){K===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(K.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let K=$.near,_e=$.far;m.texture!==null&&(m.depthNear>0&&(K=m.depthNear),m.depthFar>0&&(_e=m.depthFar)),O.near=b.near=v.near=K,O.far=b.far=v.far=_e,(V!==O.near||Y!==O.far)&&(s.updateRenderState({depthNear:O.near,depthFar:O.far}),V=O.near,Y=O.far),O.layers.mask=$.layers.mask|6,v.layers.mask=O.layers.mask&3,b.layers.mask=O.layers.mask&5;let Ie=$.parent,Ce=O.cameras;ue(O,Ie);for(let Oe=0;Oe<Ce.length;Oe++)ue(Ce[Oe],Ie);Ce.length===2?J(O,v,b):O.projectionMatrix.copy(v.projectionMatrix),ve($,O,Ie)};function ve($,K,_e){_e===null?$.matrix.copy(K.matrixWorld):($.matrix.copy(_e.matrixWorld),$.matrix.invert(),$.matrix.multiply(K.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=ys*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function($){c=$,f!==null&&(f.fixedFoveation=$),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=$)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(O)},this.getCameraTexture=function($){return d[$]};let ee=null;function ce($,K){if(h=K.getViewerPose(l||o),_=K,h!==null){let _e=h.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let Ie=!1;_e.length!==O.cameras.length&&(O.cameras.length=0,Ie=!0);for(let I=0;I<_e.length;I++){let rt=_e[I],Fe=null;if(p!==null)Fe=p.getViewport(rt);else{let xe=u.getViewSubImage(f,rt);Fe=xe.viewport,I===0&&(e.setRenderTargetTextures(S,xe.colorTexture,xe.depthStencilTexture),e.setRenderTarget(S))}let Le=D[I];Le===void 0&&(Le=new Pt,Le.layers.enable(I),Le.viewport=new gt,D[I]=Le),Le.matrix.fromArray(rt.transform.matrix),Le.matrix.decompose(Le.position,Le.quaternion,Le.scale),Le.projectionMatrix.fromArray(rt.projectionMatrix),Le.projectionMatrixInverse.copy(Le.projectionMatrix).invert(),Le.viewport.set(Fe.x,Fe.y,Fe.width,Fe.height),I===0&&(O.matrix.copy(Le.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Ie===!0&&O.cameras.push(Le)}let Ce=s.enabledFeatures;if(Ce&&Ce.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();let I=u.getDepthInformation(_e[0]);I&&I.isValid&&I.texture&&m.init(I,s.renderState)}if(Ce&&Ce.includes("camera-access")&&x){e.state.unbindTexture(),u=n.getBinding();for(let I=0;I<_e.length;I++){let rt=_e[I].camera;if(rt){let Fe=d[rt];Fe||(Fe=new fr,d[rt]=Fe);let Le=u.getCameraImage(rt);Fe.sourceTexture=Le}}}}for(let _e=0;_e<A.length;_e++){let Ie=w[_e],Ce=A[_e];Ie!==null&&Ce!==void 0&&Ce.update(Ie,K,l||o)}ee&&ee($,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),_=null}let Me=new xu;Me.setAnimationLoop(ce),this.setAnimationLoop=function($){ee=$},this.dispose=function(){}}},Xi=new wn,R_=new ht;function I_(i,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,Zl(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,E,y,S){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),h(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,S)):d.isMeshMatcapMaterial?(r(m,d),_(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),x(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?c(m,d,E,y):d.isSpriteMaterial?l(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===qt&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===qt&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);let E=e.get(d),y=E.envMap,S=E.envMapRotation;y&&(m.envMap.value=y,Xi.copy(S),Xi.x*=-1,Xi.y*=-1,Xi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Xi.y*=-1,Xi.z*=-1),m.envMapRotation.value.setFromMatrix4(R_.makeRotationFromEuler(Xi)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function c(m,d,E,y){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*E,m.scale.value=y*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function l(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,E){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===qt&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,d){d.matcap&&(m.matcap.value=d.matcap)}function x(m,d){let E=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function P_(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(E,y){let S=y.program;n.uniformBlockBinding(E,S)}function l(E,y){let S=s[E.id];S===void 0&&(_(E),S=h(E),s[E.id]=S,E.addEventListener("dispose",m));let A=y.program;n.updateUBOMapping(E,A);let w=e.render.frame;r[E.id]!==w&&(f(E),r[E.id]=w)}function h(E){let y=u();E.__bindingPointIndex=y;let S=i.createBuffer(),A=E.__size,w=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,A,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,S),S}function u(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(E){let y=s[E.id],S=E.uniforms,A=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let w=0,C=S.length;w<C;w++){let L=Array.isArray(S[w])?S[w]:[S[w]];for(let v=0,b=L.length;v<b;v++){let D=L[v];if(p(D,w,v,A)===!0){let O=D.__offset,V=Array.isArray(D.value)?D.value:[D.value],Y=0;for(let X=0;X<V.length;X++){let q=V[X],ie=x(q);typeof q=="number"||typeof q=="boolean"?(D.__data[0]=q,i.bufferSubData(i.UNIFORM_BUFFER,O+Y,D.__data)):q.isMatrix3?(D.__data[0]=q.elements[0],D.__data[1]=q.elements[1],D.__data[2]=q.elements[2],D.__data[3]=0,D.__data[4]=q.elements[3],D.__data[5]=q.elements[4],D.__data[6]=q.elements[5],D.__data[7]=0,D.__data[8]=q.elements[6],D.__data[9]=q.elements[7],D.__data[10]=q.elements[8],D.__data[11]=0):(q.toArray(D.__data,Y),Y+=ie.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,O,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(E,y,S,A){let w=E.value,C=y+"_"+S;if(A[C]===void 0)return typeof w=="number"||typeof w=="boolean"?A[C]=w:A[C]=w.clone(),!0;{let L=A[C];if(typeof w=="number"||typeof w=="boolean"){if(L!==w)return A[C]=w,!0}else if(L.equals(w)===!1)return L.copy(w),!0}return!1}function _(E){let y=E.uniforms,S=0,A=16;for(let C=0,L=y.length;C<L;C++){let v=Array.isArray(y[C])?y[C]:[y[C]];for(let b=0,D=v.length;b<D;b++){let O=v[b],V=Array.isArray(O.value)?O.value:[O.value];for(let Y=0,X=V.length;Y<X;Y++){let q=V[Y],ie=x(q),R=S%A,Z=R%ie.boundary,J=R+Z;S+=Z,J!==0&&A-J<ie.storage&&(S+=A-J),O.__data=new Float32Array(ie.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=S,S+=ie.storage}}}let w=S%A;return w>0&&(S+=A-w),E.__size=S,E.__cache={},this}function x(E){let y={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(y.boundary=4,y.storage=4):E.isVector2?(y.boundary=8,y.storage=8):E.isVector3||E.isColor?(y.boundary=16,y.storage=12):E.isVector4?(y.boundary=16,y.storage=16):E.isMatrix3?(y.boundary=48,y.storage=48):E.isMatrix4?(y.boundary=64,y.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),y}function m(E){let y=E.target;y.removeEventListener("dispose",m);let S=o.indexOf(y.__bindingPointIndex);o.splice(S,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function d(){for(let E in s)i.deleteBuffer(s[E]);o=[],s={},r={}}return{bind:c,update:l,dispose:d}}var Os=class{constructor(e={}){let{canvas:t=Gh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let _=new Uint32Array(4),x=new Int32Array(4),m=null,d=null,E=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ni,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let S=this,A=!1;this._outputColorSpace=Wt;let w=0,C=0,L=null,v=-1,b=null,D=new gt,O=new gt,V=null,Y=new ze(0),X=0,q=t.width,ie=t.height,R=1,Z=null,J=null,ue=new gt(0,0,q,ie),ve=new gt(0,0,q,ie),ee=!1,ce=new ws,Me=!1,$=!1,K=new ht,_e=new N,Ie=new gt,Ce={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Oe=!1;function Mt(){return L===null?R:1}let I=n;function rt(M,B){return t.getContext(M,B)}try{let M={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",he,!1),t.addEventListener("webglcontextrestored",be,!1),t.addEventListener("webglcontextcreationerror",re,!1),I===null){let B="webgl2";if(I=rt(B,M),I===null)throw rt(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let Fe,Le,xe,$e,Se,Be,St,xt,T,g,P,k,H,F,se,ne,de,fe,te,le,Pe,Ae,me,We;function U(){Fe=new jm(I),Fe.init(),Ae=new T_(I,Fe),Le=new Vm(I,Fe,e,Ae),xe=new E_(I,Fe),Le.reversedDepthBuffer&&f&&xe.buffers.depth.setReversed(!0),$e=new Km(I),Se=new u_,Be=new w_(I,Fe,xe,Se,Le,Ae,$e),St=new Wm(S),xt=new Zm(S),T=new sf(I),me=new zm(I,T),g=new $m(I,T,$e,me),P=new eg(I,g,T,$e),te=new Qm(I,Le,Be),ne=new Gm(Se),k=new h_(S,St,xt,Fe,Le,me,ne),H=new I_(S,Se),F=new f_,se=new y_(Fe),fe=new km(S,St,xt,xe,P,p,c),de=new M_(S,P,Le),We=new P_(I,$e,Le,xe),le=new Hm(I,Fe,$e),Pe=new Jm(I,Fe,$e),$e.programs=k.programs,S.capabilities=Le,S.extensions=Fe,S.properties=Se,S.renderLists=F,S.shadowMap=de,S.state=xe,S.info=$e}U();let ae=new uc(S,I);this.xr=ae,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let M=Fe.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=Fe.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return R},this.setPixelRatio=function(M){M!==void 0&&(R=M,this.setSize(q,ie,!1))},this.getSize=function(M){return M.set(q,ie)},this.setSize=function(M,B,G=!0){if(ae.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=M,ie=B,t.width=Math.floor(M*R),t.height=Math.floor(B*R),G===!0&&(t.style.width=M+"px",t.style.height=B+"px"),this.setViewport(0,0,M,B)},this.getDrawingBufferSize=function(M){return M.set(q*R,ie*R).floor()},this.setDrawingBufferSize=function(M,B,G){q=M,ie=B,R=G,t.width=Math.floor(M*G),t.height=Math.floor(B*G),this.setViewport(0,0,M,B)},this.getCurrentViewport=function(M){return M.copy(D)},this.getViewport=function(M){return M.copy(ue)},this.setViewport=function(M,B,G,W){M.isVector4?ue.set(M.x,M.y,M.z,M.w):ue.set(M,B,G,W),xe.viewport(D.copy(ue).multiplyScalar(R).round())},this.getScissor=function(M){return M.copy(ve)},this.setScissor=function(M,B,G,W){M.isVector4?ve.set(M.x,M.y,M.z,M.w):ve.set(M,B,G,W),xe.scissor(O.copy(ve).multiplyScalar(R).round())},this.getScissorTest=function(){return ee},this.setScissorTest=function(M){xe.setScissorTest(ee=M)},this.setOpaqueSort=function(M){Z=M},this.setTransparentSort=function(M){J=M},this.getClearColor=function(M){return M.copy(fe.getClearColor())},this.setClearColor=function(){fe.setClearColor(...arguments)},this.getClearAlpha=function(){return fe.getClearAlpha()},this.setClearAlpha=function(){fe.setClearAlpha(...arguments)},this.clear=function(M=!0,B=!0,G=!0){let W=0;if(M){let z=!1;if(L!==null){let oe=L.texture.format;z=oe===ia||oe===na||oe===ta}if(z){let oe=L.texture.type,ge=oe===Cn||oe===Mi||oe===Rs||oe===Ps||oe===Qo||oe===ea,Ee=fe.getClearColor(),ye=fe.getClearAlpha(),Ne=Ee.r,Ue=Ee.g,Re=Ee.b;ge?(_[0]=Ne,_[1]=Ue,_[2]=Re,_[3]=ye,I.clearBufferuiv(I.COLOR,0,_)):(x[0]=Ne,x[1]=Ue,x[2]=Re,x[3]=ye,I.clearBufferiv(I.COLOR,0,x))}else W|=I.COLOR_BUFFER_BIT}B&&(W|=I.DEPTH_BUFFER_BIT),G&&(W|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",he,!1),t.removeEventListener("webglcontextrestored",be,!1),t.removeEventListener("webglcontextcreationerror",re,!1),fe.dispose(),F.dispose(),se.dispose(),Se.dispose(),St.dispose(),xt.dispose(),P.dispose(),me.dispose(),We.dispose(),k.dispose(),ae.dispose(),ae.removeEventListener("sessionstart",In),ae.removeEventListener("sessionend",Mc),wi.stop()};function he(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function be(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;let M=$e.autoReset,B=de.enabled,G=de.autoUpdate,W=de.needsUpdate,z=de.type;U(),$e.autoReset=M,de.enabled=B,de.autoUpdate=G,de.needsUpdate=W,de.type=z}function re(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Q(M){let B=M.target;B.removeEventListener("dispose",Q),we(B)}function we(M){ke(M),Se.remove(M)}function ke(M){let B=Se.get(M).programs;B!==void 0&&(B.forEach(function(G){k.releaseProgram(G)}),M.isShaderMaterial&&k.releaseShaderCache(M))}this.renderBufferDirect=function(M,B,G,W,z,oe){B===null&&(B=Ce);let ge=z.isMesh&&z.matrixWorld.determinant()<0,Ee=qu(M,B,G,W,z);xe.setMaterial(W,ge);let ye=G.index,Ne=1;if(W.wireframe===!0){if(ye=g.getWireframeAttribute(G),ye===void 0)return;Ne=2}let Ue=G.drawRange,Re=G.attributes.position,Ze=Ue.start*Ne,ot=(Ue.start+Ue.count)*Ne;oe!==null&&(Ze=Math.max(Ze,oe.start*Ne),ot=Math.min(ot,(oe.start+oe.count)*Ne)),ye!==null?(Ze=Math.max(Ze,0),ot=Math.min(ot,ye.count)):Re!=null&&(Ze=Math.max(Ze,0),ot=Math.min(ot,Re.count));let yt=ot-Ze;if(yt<0||yt===1/0)return;me.setup(z,W,Ee,G,ye);let dt,ct=le;if(ye!==null&&(dt=T.get(ye),ct=Pe,ct.setIndex(dt)),z.isMesh)W.wireframe===!0?(xe.setLineWidth(W.wireframeLinewidth*Mt()),ct.setMode(I.LINES)):ct.setMode(I.TRIANGLES);else if(z.isLine){let De=W.linewidth;De===void 0&&(De=1),xe.setLineWidth(De*Mt()),z.isLineSegments?ct.setMode(I.LINES):z.isLineLoop?ct.setMode(I.LINE_LOOP):ct.setMode(I.LINE_STRIP)}else z.isPoints?ct.setMode(I.POINTS):z.isSprite&&ct.setMode(I.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)vs("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ct.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(Fe.get("WEBGL_multi_draw"))ct.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let De=z._multiDrawStarts,pt=z._multiDrawCounts,Qe=z._multiDrawCount,Kt=ye?T.get(ye).bytesPerElement:1,Ki=Se.get(W).currentProgram.getUniforms();for(let Qt=0;Qt<Qe;Qt++)Ki.setValue(I,"_gl_DrawID",Qt),ct.render(De[Qt]/Kt,pt[Qt])}else if(z.isInstancedMesh)ct.renderInstances(Ze,yt,z.count);else if(G.isInstancedBufferGeometry){let De=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,pt=Math.min(G.instanceCount,De);ct.renderInstances(Ze,yt,pt)}else ct.render(Ze,yt)};function ut(M,B,G){M.transparent===!0&&M.side===zn&&M.forceSinglePass===!1?(M.side=qt,M.needsUpdate=!0,Br(M,B,G),M.side=Qn,M.needsUpdate=!0,Br(M,B,G),M.side=zn):Br(M,B,G)}this.compile=function(M,B,G=null){G===null&&(G=M),d=se.get(G),d.init(B),y.push(d),G.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(d.pushLight(z),z.castShadow&&d.pushShadow(z))}),M!==G&&M.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(d.pushLight(z),z.castShadow&&d.pushShadow(z))}),d.setupLights();let W=new Set;return M.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;let oe=z.material;if(oe)if(Array.isArray(oe))for(let ge=0;ge<oe.length;ge++){let Ee=oe[ge];ut(Ee,G,z),W.add(Ee)}else ut(oe,G,z),W.add(oe)}),d=y.pop(),W},this.compileAsync=function(M,B,G=null){let W=this.compile(M,B,G);return new Promise(z=>{function oe(){if(W.forEach(function(ge){Se.get(ge).currentProgram.isReady()&&W.delete(ge)}),W.size===0){z(M);return}setTimeout(oe,10)}Fe.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let et=null;function Xn(M){et&&et(M)}function In(){wi.stop()}function Mc(){wi.start()}let wi=new xu;wi.setAnimationLoop(Xn),typeof self<"u"&&wi.setContext(self),this.setAnimationLoop=function(M){et=M,ae.setAnimationLoop(M),M===null?wi.stop():wi.start()},ae.addEventListener("sessionstart",In),ae.addEventListener("sessionend",Mc),this.render=function(M,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),ae.enabled===!0&&ae.isPresenting===!0&&(ae.cameraAutoUpdate===!0&&ae.updateCamera(B),B=ae.getCamera()),M.isScene===!0&&M.onBeforeRender(S,M,B,L),d=se.get(M,y.length),d.init(B),y.push(d),K.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),ce.setFromProjectionMatrix(K,Sn,B.reversedDepth),$=this.localClippingEnabled,Me=ne.init(this.clippingPlanes,$),m=F.get(M,E.length),m.init(),E.push(m),ae.enabled===!0&&ae.isPresenting===!0){let oe=S.xr.getDepthSensingMesh();oe!==null&&Wa(oe,B,-1/0,S.sortObjects)}Wa(M,B,0,S.sortObjects),m.finish(),S.sortObjects===!0&&m.sort(Z,J),Oe=ae.enabled===!1||ae.isPresenting===!1||ae.hasDepthSensing()===!1,Oe&&fe.addToRenderList(m,M),this.info.render.frame++,Me===!0&&ne.beginShadows();let G=d.state.shadowsArray;de.render(G,M,B),Me===!0&&ne.endShadows(),this.info.autoReset===!0&&this.info.reset();let W=m.opaque,z=m.transmissive;if(d.setupLights(),B.isArrayCamera){let oe=B.cameras;if(z.length>0)for(let ge=0,Ee=oe.length;ge<Ee;ge++){let ye=oe[ge];Ec(W,z,M,ye)}Oe&&fe.render(M);for(let ge=0,Ee=oe.length;ge<Ee;ge++){let ye=oe[ge];Sc(m,M,ye,ye.viewport)}}else z.length>0&&Ec(W,z,M,B),Oe&&fe.render(M),Sc(m,M,B);L!==null&&C===0&&(Be.updateMultisampleRenderTarget(L),Be.updateRenderTargetMipmap(L)),M.isScene===!0&&M.onAfterRender(S,M,B),me.resetDefaultState(),v=-1,b=null,y.pop(),y.length>0?(d=y[y.length-1],Me===!0&&ne.setGlobalState(S.clippingPlanes,d.state.camera)):d=null,E.pop(),E.length>0?m=E[E.length-1]:m=null};function Wa(M,B,G,W){if(M.visible===!1)return;if(M.layers.test(B.layers)){if(M.isGroup)G=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(B);else if(M.isLight)d.pushLight(M),M.castShadow&&d.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||ce.intersectsSprite(M)){W&&Ie.setFromMatrixPosition(M.matrixWorld).applyMatrix4(K);let ge=P.update(M),Ee=M.material;Ee.visible&&m.push(M,ge,Ee,G,Ie.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||ce.intersectsObject(M))){let ge=P.update(M),Ee=M.material;if(W&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Ie.copy(M.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),Ie.copy(ge.boundingSphere.center)),Ie.applyMatrix4(M.matrixWorld).applyMatrix4(K)),Array.isArray(Ee)){let ye=ge.groups;for(let Ne=0,Ue=ye.length;Ne<Ue;Ne++){let Re=ye[Ne],Ze=Ee[Re.materialIndex];Ze&&Ze.visible&&m.push(M,ge,Ze,G,Ie.z,Re)}}else Ee.visible&&m.push(M,ge,Ee,G,Ie.z,null)}}let oe=M.children;for(let ge=0,Ee=oe.length;ge<Ee;ge++)Wa(oe[ge],B,G,W)}function Sc(M,B,G,W){let z=M.opaque,oe=M.transmissive,ge=M.transparent;d.setupLightsView(G),Me===!0&&ne.setGlobalState(S.clippingPlanes,G),W&&xe.viewport(D.copy(W)),z.length>0&&Fr(z,B,G),oe.length>0&&Fr(oe,B,G),ge.length>0&&Fr(ge,B,G),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function Ec(M,B,G,W){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[W.id]===void 0&&(d.state.transmissionRenderTarget[W.id]=new On(1,1,{generateMipmaps:!0,type:Fe.has("EXT_color_buffer_half_float")||Fe.has("EXT_color_buffer_float")?Is:Cn,minFilter:bi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));let oe=d.state.transmissionRenderTarget[W.id],ge=W.viewport||D;oe.setSize(ge.z*S.transmissionResolutionScale,ge.w*S.transmissionResolutionScale);let Ee=S.getRenderTarget(),ye=S.getActiveCubeFace(),Ne=S.getActiveMipmapLevel();S.setRenderTarget(oe),S.getClearColor(Y),X=S.getClearAlpha(),X<1&&S.setClearColor(16777215,.5),S.clear(),Oe&&fe.render(G);let Ue=S.toneMapping;S.toneMapping=ni;let Re=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),d.setupLightsView(W),Me===!0&&ne.setGlobalState(S.clippingPlanes,W),Fr(M,G,W),Be.updateMultisampleRenderTarget(oe),Be.updateRenderTargetMipmap(oe),Fe.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let ot=0,yt=B.length;ot<yt;ot++){let dt=B[ot],ct=dt.object,De=dt.geometry,pt=dt.material,Qe=dt.group;if(pt.side===zn&&ct.layers.test(W.layers)){let Kt=pt.side;pt.side=qt,pt.needsUpdate=!0,wc(ct,G,W,De,pt,Qe),pt.side=Kt,pt.needsUpdate=!0,Ze=!0}}Ze===!0&&(Be.updateMultisampleRenderTarget(oe),Be.updateRenderTargetMipmap(oe))}S.setRenderTarget(Ee,ye,Ne),S.setClearColor(Y,X),Re!==void 0&&(W.viewport=Re),S.toneMapping=Ue}function Fr(M,B,G){let W=B.isScene===!0?B.overrideMaterial:null;for(let z=0,oe=M.length;z<oe;z++){let ge=M[z],Ee=ge.object,ye=ge.geometry,Ne=ge.group,Ue=ge.material;Ue.allowOverride===!0&&W!==null&&(Ue=W),Ee.layers.test(G.layers)&&wc(Ee,B,G,ye,Ue,Ne)}}function wc(M,B,G,W,z,oe){M.onBeforeRender(S,B,G,W,z,oe),M.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),z.onBeforeRender(S,B,G,W,M,oe),z.transparent===!0&&z.side===zn&&z.forceSinglePass===!1?(z.side=qt,z.needsUpdate=!0,S.renderBufferDirect(G,B,W,z,M,oe),z.side=Qn,z.needsUpdate=!0,S.renderBufferDirect(G,B,W,z,M,oe),z.side=zn):S.renderBufferDirect(G,B,W,z,M,oe),M.onAfterRender(S,B,G,W,z,oe)}function Br(M,B,G){B.isScene!==!0&&(B=Ce);let W=Se.get(M),z=d.state.lights,oe=d.state.shadowsArray,ge=z.state.version,Ee=k.getParameters(M,z.state,oe,B,G),ye=k.getProgramCacheKey(Ee),Ne=W.programs;W.environment=M.isMeshStandardMaterial?B.environment:null,W.fog=B.fog,W.envMap=(M.isMeshStandardMaterial?xt:St).get(M.envMap||W.environment),W.envMapRotation=W.environment!==null&&M.envMap===null?B.environmentRotation:M.envMapRotation,Ne===void 0&&(M.addEventListener("dispose",Q),Ne=new Map,W.programs=Ne);let Ue=Ne.get(ye);if(Ue!==void 0){if(W.currentProgram===Ue&&W.lightsStateVersion===ge)return Ac(M,Ee),Ue}else Ee.uniforms=k.getUniforms(M),M.onBeforeCompile(Ee,S),Ue=k.acquireProgram(Ee,ye),Ne.set(ye,Ue),W.uniforms=Ee.uniforms;let Re=W.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Re.clippingPlanes=ne.uniform),Ac(M,Ee),W.needsLights=Zu(M),W.lightsStateVersion=ge,W.needsLights&&(Re.ambientLightColor.value=z.state.ambient,Re.lightProbe.value=z.state.probe,Re.directionalLights.value=z.state.directional,Re.directionalLightShadows.value=z.state.directionalShadow,Re.spotLights.value=z.state.spot,Re.spotLightShadows.value=z.state.spotShadow,Re.rectAreaLights.value=z.state.rectArea,Re.ltc_1.value=z.state.rectAreaLTC1,Re.ltc_2.value=z.state.rectAreaLTC2,Re.pointLights.value=z.state.point,Re.pointLightShadows.value=z.state.pointShadow,Re.hemisphereLights.value=z.state.hemi,Re.directionalShadowMap.value=z.state.directionalShadowMap,Re.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Re.spotShadowMap.value=z.state.spotShadowMap,Re.spotLightMatrix.value=z.state.spotLightMatrix,Re.spotLightMap.value=z.state.spotLightMap,Re.pointShadowMap.value=z.state.pointShadowMap,Re.pointShadowMatrix.value=z.state.pointShadowMatrix),W.currentProgram=Ue,W.uniformsList=null,Ue}function Tc(M){if(M.uniformsList===null){let B=M.currentProgram.getUniforms();M.uniformsList=Us.seqWithValue(B.seq,M.uniforms)}return M.uniformsList}function Ac(M,B){let G=Se.get(M);G.outputColorSpace=B.outputColorSpace,G.batching=B.batching,G.batchingColor=B.batchingColor,G.instancing=B.instancing,G.instancingColor=B.instancingColor,G.instancingMorph=B.instancingMorph,G.skinning=B.skinning,G.morphTargets=B.morphTargets,G.morphNormals=B.morphNormals,G.morphColors=B.morphColors,G.morphTargetsCount=B.morphTargetsCount,G.numClippingPlanes=B.numClippingPlanes,G.numIntersection=B.numClipIntersection,G.vertexAlphas=B.vertexAlphas,G.vertexTangents=B.vertexTangents,G.toneMapping=B.toneMapping}function qu(M,B,G,W,z){B.isScene!==!0&&(B=Ce),Be.resetTextureUnits();let oe=B.fog,ge=W.isMeshStandardMaterial?B.environment:null,Ee=L===null?S.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Ni,ye=(W.isMeshStandardMaterial?xt:St).get(W.envMap||ge),Ne=W.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ue=!!G.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Re=!!G.morphAttributes.position,Ze=!!G.morphAttributes.normal,ot=!!G.morphAttributes.color,yt=ni;W.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(yt=S.toneMapping);let dt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,ct=dt!==void 0?dt.length:0,De=Se.get(W),pt=d.state.lights;if(Me===!0&&($===!0||M!==b)){let Ht=M===b&&W.id===v;ne.setState(W,M,Ht)}let Qe=!1;W.version===De.__version?(De.needsLights&&De.lightsStateVersion!==pt.state.version||De.outputColorSpace!==Ee||z.isBatchedMesh&&De.batching===!1||!z.isBatchedMesh&&De.batching===!0||z.isBatchedMesh&&De.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&De.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&De.instancing===!1||!z.isInstancedMesh&&De.instancing===!0||z.isSkinnedMesh&&De.skinning===!1||!z.isSkinnedMesh&&De.skinning===!0||z.isInstancedMesh&&De.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&De.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&De.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&De.instancingMorph===!1&&z.morphTexture!==null||De.envMap!==ye||W.fog===!0&&De.fog!==oe||De.numClippingPlanes!==void 0&&(De.numClippingPlanes!==ne.numPlanes||De.numIntersection!==ne.numIntersection)||De.vertexAlphas!==Ne||De.vertexTangents!==Ue||De.morphTargets!==Re||De.morphNormals!==Ze||De.morphColors!==ot||De.toneMapping!==yt||De.morphTargetsCount!==ct)&&(Qe=!0):(Qe=!0,De.__version=W.version);let Kt=De.currentProgram;Qe===!0&&(Kt=Br(W,B,z));let Ki=!1,Qt=!1,Vs=!1,mt=Kt.getUniforms(),an=De.uniforms;if(xe.useProgram(Kt.program)&&(Ki=!0,Qt=!0,Vs=!0),W.id!==v&&(v=W.id,Qt=!0),Ki||b!==M){xe.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),mt.setValue(I,"projectionMatrix",M.projectionMatrix),mt.setValue(I,"viewMatrix",M.matrixWorldInverse);let Yt=mt.map.cameraPosition;Yt!==void 0&&Yt.setValue(I,_e.setFromMatrixPosition(M.matrixWorld)),Le.logarithmicDepthBuffer&&mt.setValue(I,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&mt.setValue(I,"isOrthographic",M.isOrthographicCamera===!0),b!==M&&(b=M,Qt=!0,Vs=!0)}if(z.isSkinnedMesh){mt.setOptional(I,z,"bindMatrix"),mt.setOptional(I,z,"bindMatrixInverse");let Ht=z.skeleton;Ht&&(Ht.boneTexture===null&&Ht.computeBoneTexture(),mt.setValue(I,"boneTexture",Ht.boneTexture,Be))}z.isBatchedMesh&&(mt.setOptional(I,z,"batchingTexture"),mt.setValue(I,"batchingTexture",z._matricesTexture,Be),mt.setOptional(I,z,"batchingIdTexture"),mt.setValue(I,"batchingIdTexture",z._indirectTexture,Be),mt.setOptional(I,z,"batchingColorTexture"),z._colorsTexture!==null&&mt.setValue(I,"batchingColorTexture",z._colorsTexture,Be));let ln=G.morphAttributes;if((ln.position!==void 0||ln.normal!==void 0||ln.color!==void 0)&&te.update(z,G,Kt),(Qt||De.receiveShadow!==z.receiveShadow)&&(De.receiveShadow=z.receiveShadow,mt.setValue(I,"receiveShadow",z.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(an.envMap.value=ye,an.flipEnvMap.value=ye.isCubeTexture&&ye.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&B.environment!==null&&(an.envMapIntensity.value=B.environmentIntensity),Qt&&(mt.setValue(I,"toneMappingExposure",S.toneMappingExposure),De.needsLights&&Yu(an,Vs),oe&&W.fog===!0&&H.refreshFogUniforms(an,oe),H.refreshMaterialUniforms(an,W,R,ie,d.state.transmissionRenderTarget[M.id]),Us.upload(I,Tc(De),an,Be)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Us.upload(I,Tc(De),an,Be),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&mt.setValue(I,"center",z.center),mt.setValue(I,"modelViewMatrix",z.modelViewMatrix),mt.setValue(I,"normalMatrix",z.normalMatrix),mt.setValue(I,"modelMatrix",z.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){let Ht=W.uniformsGroups;for(let Yt=0,Xa=Ht.length;Yt<Xa;Yt++){let Ti=Ht[Yt];We.update(Ti,Kt),We.bind(Ti,Kt)}}return Kt}function Yu(M,B){M.ambientLightColor.needsUpdate=B,M.lightProbe.needsUpdate=B,M.directionalLights.needsUpdate=B,M.directionalLightShadows.needsUpdate=B,M.pointLights.needsUpdate=B,M.pointLightShadows.needsUpdate=B,M.spotLights.needsUpdate=B,M.spotLightShadows.needsUpdate=B,M.rectAreaLights.needsUpdate=B,M.hemisphereLights.needsUpdate=B}function Zu(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(M,B,G){let W=Se.get(M);W.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),Se.get(M.texture).__webglTexture=B,Se.get(M.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:G,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,B){let G=Se.get(M);G.__webglFramebuffer=B,G.__useDefaultFramebuffer=B===void 0};let ju=I.createFramebuffer();this.setRenderTarget=function(M,B=0,G=0){L=M,w=B,C=G;let W=!0,z=null,oe=!1,ge=!1;if(M){let ye=Se.get(M);if(ye.__useDefaultFramebuffer!==void 0)xe.bindFramebuffer(I.FRAMEBUFFER,null),W=!1;else if(ye.__webglFramebuffer===void 0)Be.setupRenderTarget(M);else if(ye.__hasExternalTextures)Be.rebindTextures(M,Se.get(M.texture).__webglTexture,Se.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let Re=M.depthTexture;if(ye.__boundDepthTexture!==Re){if(Re!==null&&Se.has(Re)&&(M.width!==Re.image.width||M.height!==Re.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Be.setupDepthRenderbuffer(M)}}let Ne=M.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(ge=!0);let Ue=Se.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ue[B])?z=Ue[B][G]:z=Ue[B],oe=!0):M.samples>0&&Be.useMultisampledRTT(M)===!1?z=Se.get(M).__webglMultisampledFramebuffer:Array.isArray(Ue)?z=Ue[G]:z=Ue,D.copy(M.viewport),O.copy(M.scissor),V=M.scissorTest}else D.copy(ue).multiplyScalar(R).floor(),O.copy(ve).multiplyScalar(R).floor(),V=ee;if(G!==0&&(z=ju),xe.bindFramebuffer(I.FRAMEBUFFER,z)&&W&&xe.drawBuffers(M,z),xe.viewport(D),xe.scissor(O),xe.setScissorTest(V),oe){let ye=Se.get(M.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+B,ye.__webglTexture,G)}else if(ge){let ye=B;for(let Ne=0;Ne<M.textures.length;Ne++){let Ue=Se.get(M.textures[Ne]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Ne,Ue.__webglTexture,G,ye)}}else if(M!==null&&G!==0){let ye=Se.get(M.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,ye.__webglTexture,G)}v=-1},this.readRenderTargetPixels=function(M,B,G,W,z,oe,ge,Ee=0){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=Se.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ge!==void 0&&(ye=ye[ge]),ye){xe.bindFramebuffer(I.FRAMEBUFFER,ye);try{let Ne=M.textures[Ee],Ue=Ne.format,Re=Ne.type;if(!Le.textureFormatReadable(Ue)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Le.textureTypeReadable(Re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=M.width-W&&G>=0&&G<=M.height-z&&(M.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Ee),I.readPixels(B,G,W,z,Ae.convert(Ue),Ae.convert(Re),oe))}finally{let Ne=L!==null?Se.get(L).__webglFramebuffer:null;xe.bindFramebuffer(I.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(M,B,G,W,z,oe,ge,Ee=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=Se.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ge!==void 0&&(ye=ye[ge]),ye)if(B>=0&&B<=M.width-W&&G>=0&&G<=M.height-z){xe.bindFramebuffer(I.FRAMEBUFFER,ye);let Ne=M.textures[Ee],Ue=Ne.format,Re=Ne.type;if(!Le.textureFormatReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Le.textureTypeReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ze=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Ze),I.bufferData(I.PIXEL_PACK_BUFFER,oe.byteLength,I.STREAM_READ),M.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Ee),I.readPixels(B,G,W,z,Ae.convert(Ue),Ae.convert(Re),0);let ot=L!==null?Se.get(L).__webglFramebuffer:null;xe.bindFramebuffer(I.FRAMEBUFFER,ot);let yt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Wh(I,yt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Ze),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,oe),I.deleteBuffer(Ze),I.deleteSync(yt),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,B=null,G=0){let W=Math.pow(2,-G),z=Math.floor(M.image.width*W),oe=Math.floor(M.image.height*W),ge=B!==null?B.x:0,Ee=B!==null?B.y:0;Be.setTexture2D(M,0),I.copyTexSubImage2D(I.TEXTURE_2D,G,0,0,ge,Ee,z,oe),xe.unbindTexture()};let $u=I.createFramebuffer(),Ju=I.createFramebuffer();this.copyTextureToTexture=function(M,B,G=null,W=null,z=0,oe=null){oe===null&&(z!==0?(vs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),oe=z,z=0):oe=0);let ge,Ee,ye,Ne,Ue,Re,Ze,ot,yt,dt=M.isCompressedTexture?M.mipmaps[oe]:M.image;if(G!==null)ge=G.max.x-G.min.x,Ee=G.max.y-G.min.y,ye=G.isBox3?G.max.z-G.min.z:1,Ne=G.min.x,Ue=G.min.y,Re=G.isBox3?G.min.z:0;else{let ln=Math.pow(2,-z);ge=Math.floor(dt.width*ln),Ee=Math.floor(dt.height*ln),M.isDataArrayTexture?ye=dt.depth:M.isData3DTexture?ye=Math.floor(dt.depth*ln):ye=1,Ne=0,Ue=0,Re=0}W!==null?(Ze=W.x,ot=W.y,yt=W.z):(Ze=0,ot=0,yt=0);let ct=Ae.convert(B.format),De=Ae.convert(B.type),pt;B.isData3DTexture?(Be.setTexture3D(B,0),pt=I.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(Be.setTexture2DArray(B,0),pt=I.TEXTURE_2D_ARRAY):(Be.setTexture2D(B,0),pt=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,B.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,B.unpackAlignment);let Qe=I.getParameter(I.UNPACK_ROW_LENGTH),Kt=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Ki=I.getParameter(I.UNPACK_SKIP_PIXELS),Qt=I.getParameter(I.UNPACK_SKIP_ROWS),Vs=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,dt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,dt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ne),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ue),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Re);let mt=M.isDataArrayTexture||M.isData3DTexture,an=B.isDataArrayTexture||B.isData3DTexture;if(M.isDepthTexture){let ln=Se.get(M),Ht=Se.get(B),Yt=Se.get(ln.__renderTarget),Xa=Se.get(Ht.__renderTarget);xe.bindFramebuffer(I.READ_FRAMEBUFFER,Yt.__webglFramebuffer),xe.bindFramebuffer(I.DRAW_FRAMEBUFFER,Xa.__webglFramebuffer);for(let Ti=0;Ti<ye;Ti++)mt&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Se.get(M).__webglTexture,z,Re+Ti),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Se.get(B).__webglTexture,oe,yt+Ti)),I.blitFramebuffer(Ne,Ue,ge,Ee,Ze,ot,ge,Ee,I.DEPTH_BUFFER_BIT,I.NEAREST);xe.bindFramebuffer(I.READ_FRAMEBUFFER,null),xe.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(z!==0||M.isRenderTargetTexture||Se.has(M)){let ln=Se.get(M),Ht=Se.get(B);xe.bindFramebuffer(I.READ_FRAMEBUFFER,$u),xe.bindFramebuffer(I.DRAW_FRAMEBUFFER,Ju);for(let Yt=0;Yt<ye;Yt++)mt?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ln.__webglTexture,z,Re+Yt):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,ln.__webglTexture,z),an?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ht.__webglTexture,oe,yt+Yt):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ht.__webglTexture,oe),z!==0?I.blitFramebuffer(Ne,Ue,ge,Ee,Ze,ot,ge,Ee,I.COLOR_BUFFER_BIT,I.NEAREST):an?I.copyTexSubImage3D(pt,oe,Ze,ot,yt+Yt,Ne,Ue,ge,Ee):I.copyTexSubImage2D(pt,oe,Ze,ot,Ne,Ue,ge,Ee);xe.bindFramebuffer(I.READ_FRAMEBUFFER,null),xe.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else an?M.isDataTexture||M.isData3DTexture?I.texSubImage3D(pt,oe,Ze,ot,yt,ge,Ee,ye,ct,De,dt.data):B.isCompressedArrayTexture?I.compressedTexSubImage3D(pt,oe,Ze,ot,yt,ge,Ee,ye,ct,dt.data):I.texSubImage3D(pt,oe,Ze,ot,yt,ge,Ee,ye,ct,De,dt):M.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,oe,Ze,ot,ge,Ee,ct,De,dt.data):M.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,oe,Ze,ot,dt.width,dt.height,ct,dt.data):I.texSubImage2D(I.TEXTURE_2D,oe,Ze,ot,ge,Ee,ct,De,dt);I.pixelStorei(I.UNPACK_ROW_LENGTH,Qe),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Kt),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ki),I.pixelStorei(I.UNPACK_SKIP_ROWS,Qt),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Vs),oe===0&&B.generateMipmaps&&I.generateMipmap(pt),xe.unbindTexture()},this.initRenderTarget=function(M){Se.get(M).__webglFramebuffer===void 0&&Be.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?Be.setTextureCube(M,0):M.isData3DTexture?Be.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?Be.setTexture2DArray(M,0):Be.setTexture2D(M,0),xe.unbindTexture()},this.resetState=function(){w=0,C=0,L=null,xe.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Sn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}};function Eu(i,e,t){let n=new Os({alpha:!0,antialias:!0});n.setPixelRatio(Math.min(devicePixelRatio,2)),n.setSize(112,112),i.prepend(n.domElement);let s=n.domElement;s.tabIndex=0,s.setAttribute("role","img"),s.setAttribute("aria-label","View cube: click a face, edge or corner; drag to rotate. Arrow keys rotate, Home restores perspective. / \u89C6\u56FE\u7ACB\u65B9\u4F53\uFF1A\u70B9\u51FB\u9762\u3001\u8FB9\u3001\u89D2\u6216\u62D6\u52A8\u65CB\u8F6C");let r=new Oi,o=new Pt(32,1,.1,20);o.up.set(0,0,1);let a=["RIGHT","LEFT","BACK","FRONT","TOP","BOTTOM"],c=["\u53F3","\u5DE6","\u540E","\u524D","\u9876","\u5E95"],l="",h=a.map(()=>{let y=document.createElement("canvas");return y.width=y.height=128,new Fi(y)}),u=h.map(y=>new mn({map:y})),f=new vt(new kt(1,1,1),u);r.add(f),r.add(new ei(new Bi(f.geometry),new An({color:14795132})));let p=new vr,_=new Te,x=null,m=!1;function d(y){let S=e.position.distanceTo(t.target);e.position.copy(t.target).add(y.normalize().multiplyScalar(S)),e.lookAt(t.target),t.update()}function E(y,S){let A=new xi().setFromVector3(e.position.clone().sub(t.target).applyAxisAngle(new N(1,0,0),-Math.PI/2));A.theta-=y,A.phi=Math.max(.001,Math.min(Math.PI-.001,A.phi+S)),d(new N().setFromSpherical(A).applyAxisAngle(new N(1,0,0),Math.PI/2))}return s.addEventListener("pointerdown",y=>{x={x:y.clientX,y:y.clientY,lastX:y.clientX,lastY:y.clientY},m=!1,s.setPointerCapture(y.pointerId)}),s.addEventListener("pointermove",y=>{x&&(Math.hypot(y.clientX-x.x,y.clientY-x.y)>4&&(m=!0),m&&E((y.clientX-x.lastX)*.012,(y.clientY-x.lastY)*.012),x.lastX=y.clientX,x.lastY=y.clientY)}),s.addEventListener("pointerup",y=>{if(x){if(!m){let S=s.getBoundingClientRect();_.set((y.clientX-S.left)/S.width*2-1,-(y.clientY-S.top)/S.height*2+1),p.setFromCamera(_,o);let A=p.intersectObject(f)[0];if(A){let w=A.point,C=new N(...[w.x,w.y,w.z].map(L=>Math.abs(L)>.34?Math.sign(L):0));Math.abs(C.z)===1&&C.x===0&&C.y===0&&(C.y=-.001),d(C)}}x=null}}),s.addEventListener("pointercancel",()=>{x=null}),s.addEventListener("keydown",y=>{["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","Enter"].includes(y.key)&&(y.preventDefault(),y.key==="Home"?d(new N(430,-645,445)):y.key==="Enter"?d(new N(0,-1,0)):E(y.key==="ArrowLeft"?Math.PI/2:y.key==="ArrowRight"?-Math.PI/2:0,y.key==="ArrowUp"?-.35:y.key==="ArrowDown"?.35:0))}),{update(){l!==document.documentElement.lang&&(l=document.documentElement.lang,h.forEach((y,S)=>{let A=y.image.getContext("2d");A.fillStyle="#304878",A.fillRect(0,0,128,128),A.strokeStyle="#e1c17c",A.lineWidth=5,A.strokeRect(3,3,122,122),A.fillStyle="#fff1cc",A.font="bold 21px Segoe UI",A.textAlign="center",A.textBaseline="middle",A.fillText(l==="zh"?c[S]:a[S],64,64),y.needsUpdate=!0})),o.position.copy(e.position).sub(t.target).normalize().multiplyScalar(3.6),o.lookAt(0,0,0),n.render(r,o)}}}var wu={type:"change"},pc={type:"start"},Au={type:"end"},Fa=new mi,Tu=new dn,D_=Math.cos(70*ql.DEG2RAD),Ct=new N,$t=2*Math.PI,at={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},fc=1e-6,Ba=class extends Sr{constructor(e,t=null){super(e,t),this.state=at.NONE,this.target=new N,this.cursor=new N,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:yi.ROTATE,MIDDLE:yi.DOLLY,RIGHT:yi.PAN},this.touches={ONE:vi.ROTATE,TWO:vi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new N,this._lastQuaternion=new pn,this._lastTargetPosition=new N,this._quat=new pn().setFromUnitVectors(e.up,new N(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new xi,this._sphericalDelta=new xi,this._scale=1,this._panOffset=new N,this._rotateStart=new Te,this._rotateEnd=new Te,this._rotateDelta=new Te,this._panStart=new Te,this._panEnd=new Te,this._panDelta=new Te,this._dollyStart=new Te,this._dollyEnd=new Te,this._dollyDelta=new Te,this._dollyDirection=new N,this._mouse=new Te,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=N_.bind(this),this._onPointerDown=L_.bind(this),this._onPointerUp=U_.bind(this),this._onContextMenu=V_.bind(this),this._onMouseWheel=B_.bind(this),this._onKeyDown=k_.bind(this),this._onTouchStart=z_.bind(this),this._onTouchMove=H_.bind(this),this._onMouseDown=O_.bind(this),this._onMouseMove=F_.bind(this),this._interceptControlDown=G_.bind(this),this._interceptControlUp=W_.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(wu),this.update(),this.state=at.NONE}update(e=null){let t=this.object.position;Ct.copy(t).sub(this.target),Ct.applyQuaternion(this._quat),this._spherical.setFromVector3(Ct),this.autoRotate&&this.state===at.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=$t:n>Math.PI&&(n-=$t),s<-Math.PI?s+=$t:s>Math.PI&&(s-=$t),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Ct.setFromSpherical(this._spherical),Ct.applyQuaternion(this._quatInverse),t.copy(this.target).add(Ct),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Ct.length();o=this._clampDistance(a*this._scale);let c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){let a=new N(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;let l=new N(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=Ct.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Fa.origin.copy(this.object.position),Fa.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Fa.direction))<D_?this.object.lookAt(this.target):(Tu.setFromNormalAndCoplanarPoint(this.object.up,this.target),Fa.intersectPlane(Tu,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>fc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>fc||this._lastTargetPosition.distanceToSquared(this.target)>fc?(this.dispatchEvent(wu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?$t/60*this.autoRotateSpeed*e:$t/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Ct.setFromMatrixColumn(t,0),Ct.multiplyScalar(-e),this._panOffset.add(Ct)}_panUp(e,t){this.screenSpacePanning===!0?Ct.setFromMatrixColumn(t,1):(Ct.setFromMatrixColumn(t,0),Ct.crossVectors(this.object.up,Ct)),Ct.multiplyScalar(e),this._panOffset.add(Ct)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Ct.copy(s).sub(this.target);let r=Ct.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft($t*this._rotateDelta.x/t.clientHeight),this._rotateUp($t*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp($t*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-$t*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft($t*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-$t*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft($t*this._rotateDelta.x/t.clientHeight),this._rotateUp($t*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Te,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function L_(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function N_(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function U_(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Au),this.state=at.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function O_(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case yi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=at.DOLLY;break;case yi.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=at.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=at.ROTATE}break;case yi.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=at.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=at.PAN}break;default:this.state=at.NONE}this.state!==at.NONE&&this.dispatchEvent(pc)}function F_(i){switch(this.state){case at.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case at.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case at.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function B_(i){this.enabled===!1||this.enableZoom===!1||this.state!==at.NONE||(i.preventDefault(),this.dispatchEvent(pc),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Au))}function k_(i){this.enabled!==!1&&this._handleKeyDown(i)}function z_(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case vi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=at.TOUCH_ROTATE;break;case vi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=at.TOUCH_PAN;break;default:this.state=at.NONE}break;case 2:switch(this.touches.TWO){case vi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=at.TOUCH_DOLLY_PAN;break;case vi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=at.TOUCH_DOLLY_ROTATE;break;default:this.state=at.NONE}break;default:this.state=at.NONE}this.state!==at.NONE&&this.dispatchEvent(pc)}function H_(i){switch(this._trackPointer(i),this.state){case at.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case at.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case at.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case at.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=at.NONE}}function V_(i){this.enabled!==!1&&i.preventDefault()}function G_(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function W_(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var sn={open:27,thickness:6,min:3,xHalf:6,zMin:-13,zMax:19,capacity:42},X_=[1,0,0,0,1,0,0,0,1];function mc(i,e){let t=e.rotation,n=[t[0],t[3],t[6],t[1],t[4],t[7],t[2],t[5],t[8]],s=ri(n,i.center.map((h,u)=>h-e.tip[u])),r=Dn(n,i.rotation||X_),o=[0,1,2].map(h=>i.size.reduce((u,f,p)=>u+Math.abs(r[3*h+p])*f/2,0)),a=s.map((h,u)=>h-o[u]),c=s.map((h,u)=>h+o[u]),l=a[0]<sn.xHalf&&c[0]>-sn.xHalf&&a[2]<sn.zMax&&c[2]>sn.zMin;return{min:a,max:c,overlap:l,width:c[1]-a[1],fits:l&&a[1]>=-24&&c[1]<=24}}function Cu(i,e){let t=-sn.min,n=sn.min;for(let s of i){let r=mc(s,e);!r.overlap||r.min[1]>30||r.max[1]<-30||(t=Math.min(t,r.min[1]-sn.thickness/2),n=Math.max(n,r.max[1]+sn.thickness/2))}return[t,n]}function Ru(i){let e=new Oi;e.background=new ze("#1e2e5e"),e.fog=new cr("#1e2e5e",1e3,2200);let t=new Pt(36,1,1,3e3);t.up.set(0,0,1),t.position.set(500,-630,480);let n=new Os({antialias:!0,alpha:!1});n.setPixelRatio(Math.min(devicePixelRatio,2)),n.shadowMap.enabled=!0,n.shadowMap.type=Ho,n.outputColorSpace=Wt,i.prepend(n.domElement),n.domElement.setAttribute("aria-label","Interactive 3D robot arm. Joint angles and tool coordinates are available in the controls.");let s=new Ba(t,n.domElement);s.target.set(55,0,90),s.enableDamping=!0,s.minDistance=350,s.maxDistance=1600,s.maxPolarAngle=Math.PI-.001,e.add(new _r(16777215,6584993,2.5));let r=new yr(16777215,3);r.position.set(-200,-300,650),r.castShadow=!0,r.shadow.mapSize.set(2048,2048),Object.assign(r.shadow.camera,{left:-500,right:500,top:500,bottom:-500,near:1,far:1200}),r.shadow.bias=-.001,e.add(r);let o={body:new Xt({color:15790836,roughness:.34,metalness:.16}),joint:new Xt({color:14804457,roughness:.32,metalness:.24}),accent:new Xt({color:16021281,roughness:.38,metalness:.12}),metal:new Xt({color:3752526,metalness:.65,roughness:.3})};function a(g,P){let k=new vt(g,P);return k.castShadow=!0,k.receiveShadow=!0,e.add(k),k}let c=a(new ki(3e3,3e3),new Xt({color:2373994,roughness:1}));c.position.z=-2;let l=new br(900,18,7438762,4216450);l.rotation.x=Math.PI/2,l.position.z=.1,e.add(l);let h=g=>new N(...g);function u(g,P){let k=new Ts(new _t().setFromPoints(g.map(h)),new An({color:P}));return e.add(k),k}u([[0,0,1],[360,0,1]],11954256),u([[0,0,1],[0,360,1]],5801579),u([[0,0,0],[0,0,340]],7574969);function f(g,P,k){let H=document.createElement("canvas");H.width=128,H.height=64;let F=H.getContext("2d");F.font="600 36px Segoe UI",F.fillStyle=P,F.textAlign="center",F.fillText(g,64,44);let se=new ur(new Es({map:new Fi(H),depthTest:!1}));return se.position.copy(h(k)),se.scale.set(50,25,1),e.add(se),se}f("X","#a66552",[385,0,5]),f("Y","#54795c",[0,385,5]),f("Z","#597c9a",[0,0,360]);let p=a(new wt(47,49,10,64),o.metal);p.rotation.x=Math.PI/2,p.position.z=5;let _=a(new wt(29,32,54,48),o.body);_.rotation.x=Math.PI/2,_.position.z=37;let x=a(new wt(32.5,32.5,5,48),o.accent);x.rotation.x=Math.PI/2,x.position.z=15;for(let g=0;g<6;g++){let P=g*Math.PI/3,k=a(new wt(2.6,2.6,2,6),o.metal);k.rotation.x=Math.PI/2,k.position.set(41*Math.cos(P),41*Math.sin(P),11)}let m=[],d=[],E=[],y=0;function S(g){if(y!==g){for(let P of[...m,...d,...E])e.remove(P),P.traverse(k=>k.geometry?.dispose());y=g,m=Array.from({length:g-1},(P,k)=>{let H=Math.max(9,18-k*2);return a(new pr([[0,-.5],[H*.8,-.5],[H,-.46],[H,.46],[H*.8,.5],[0,.5]].map(([F,se])=>new Te(F,se)),48),o.body)}),d=Array.from({length:g-1},(P,k)=>a(new wt(Math.max(13,23-k*2),Math.max(13,23-k*2),k<2?39:29,32),o.joint)),E=Array.from({length:g-1},(P,k)=>{let H=Math.max(13,23-k*2)-2,F=k<2?40:30,se=a(new wt(H,H,F,48),o.accent);for(let ne of[-1,1]){let de=new vt(new wt(H*.73,H*.73,1.2,48),o.joint);de.position.y=ne*(F/2+.6),de.castShadow=!0,se.add(de);for(let fe=0;fe<4;fe++){let te=fe*Math.PI/2+Math.PI/4,le=new vt(new wt(1.2,1.2,1.5,6),o.metal);le.position.set(H*.51*Math.cos(te),ne*(F/2+1.3),H*.51*Math.sin(te)),se.add(le)}}return se}),Ie.scale.setScalar(Qi(g)/300),$e=[],xe.geometry.dispose(),xe.geometry=new _t,Be("iso"),n.domElement.dataset.joints=String(g)}}let A=a(new As(3,12,8),o.accent),w=new Nn;e.add(w);let C=[],L="",v=!1,b=[],D=Rt(Vt.home),O=new Xt({color:6582400,roughness:.35,metalness:.65}),V=new Xt({color:2107185,roughness:.95}),Y=new Xt({color:11822413,roughness:.4,metalness:.6}),X;function q(g){X&&X.material.dispose();for(let H of[...w.children])w.remove(H),H.geometry?.dispose();C=[],X=null,L=g;function P(H,F,se){let ne=new vt(H,F);return ne.position.set(...se),ne.castShadow=!0,w.add(ne),ne}let k=P(new wt(13,13,4,32),O,[0,0,38]);if(k.rotation.x=Math.PI/2,g!=="vacuum"){let H=P(new wt(7,7,8,20),O,[0,0,32]);H.rotation.x=Math.PI/2}if(g==="gripper"){P(new kt(22,54,12),O,[0,0,23]);for(let H of[-1,1]){let F=P(new kt(12,6,32),V,[0,H*26,3]);F.userData.sign=H,C.push(F)}}if(g==="vacuum"){let H=P(new wt(7,18,14,32),V,[0,0,7]);H.rotation.x=Math.PI/2;let F=P(new wt(5,5,24,16),O,[0,0,25]);F.rotation.x=Math.PI/2}if(g==="magnet"){let H=P(new wt(17,17,12,32),Y,[0,0,6]);H.rotation.x=Math.PI/2,P(new kt(18,18,18),O,[0,0,21])}X=P(new Cs(21,1.2,8,40),new mn({color:g==="vacuum"?5811136:14724181,transparent:!0,opacity:.6}),[0,0,1]),X.visible=!1}q("gripper");let ie=null,R=new Nn;e.add(R);let Z=new mn({color:16768837,depthTest:!1}),J=Array.from({length:12},()=>{let g=new vt(new wt(1.8,1.8,1,8),Z);return g.renderOrder=11,R.add(g),g}),ue=new vt(new kt(1,1,1),new mn({color:16768837,transparent:!0,opacity:.12,depthTest:!1,depthWrite:!1}));ue.renderOrder=10,R.add(ue);let ve=f("A","#10203b",[0,0,0]);ve.scale.set(36,18,1);let ee=ve.material.map.image,ce=ee.getContext("2d");ce.fillStyle="#ffdf45",ce.fillRect(0,0,128,64),ce.fillStyle="#10203b",ce.font="bold 48px Segoe UI",ce.textAlign="center",ce.fillText("A",64,49),ve.material.map.needsUpdate=!0,ve.renderOrder=12,ve.visible=!1;function Me(){let g={joint:d[0],link:m[0],tool:w,tcp:A}[ie];if(R.visible=ve.visible=!!g,!g)return;g.updateWorldMatrix(!0,!0);let P=new Fn().setFromObject(g).expandByScalar(6),k=P.getCenter(new N),H=P.getSize(new N);ue.position.copy(k),ue.scale.copy(H);let F=0;for(let se=0;se<3;se++)for(let ne of[0,1])for(let de of[0,1]){let fe=P.min.clone(),te=P.min.clone(),le=[0,1,2].filter(Ae=>Ae!==se);fe.setComponent(le[0],ne?P.max.getComponent(le[0]):P.min.getComponent(le[0])),fe.setComponent(le[1],de?P.max.getComponent(le[1]):P.min.getComponent(le[1])),te.copy(fe),te.setComponent(se,P.max.getComponent(se));let Pe=J[F++];Pe.position.copy(fe).add(te).multiplyScalar(.5),Pe.scale.y=fe.distanceTo(te),Pe.quaternion.setFromUnitVectors(new N(0,1,0),te.sub(fe).normalize())}ve.position.set(k.x,k.y,P.max.z+16)}let $=new Mr(42);e.add($);let K=u([[0,0,0],[0,0,0]],9742222),_e=a(new Cs(13,1.4,8,40),o.accent);_e.position.z=1;let Ie=a(new As(300,36,20),new mn({color:7509604,wireframe:!0,transparent:!0,opacity:.065,depthWrite:!1}));Ie.position.z=Vt.base,Ie.visible=!1;let Ce="",Oe=[],Mt=[],I=[],rt=[];function Fe(){for(let g of Oe)e.remove(g),g.geometry?.dispose(),g.material?.map&&g.material.map.dispose(),g.material?.dispose();Oe=[],Mt=[],I=[],rt=[]}function Le(g){if(v=g.output,b=g.objects,X&&(X.visible=g.output&&g.tool!=="gripper"),Ce!==g.tool){Fe(),Ce=g.tool,q(g.tool);let P=g.obstacle,k=a(new kt(...P.size),new Xt({color:10332315,roughness:.9}));k.position.copy(h(P.center)),Oe.push(k);let H=new ei(new Bi(k.geometry),new An({color:8294005}));H.position.copy(k.position),e.add(H),Oe.push(H),Oe.push(f(P.size[2]+" mm","#ecdcad",[P.center[0]-30,P.center[1]+45,P.size[2]+12]));for(let F of g.objects){let se=g.tool==="magnet"?new wt(F.size[0]/2,F.size[0]/2,F.size[2],32).rotateX(Math.PI/2):new kt(...F.size),ne=a(se,new Xt({color:F.id==="A"?14390866:5807532,roughness:g.tool==="magnet"?.28:.55,metalness:g.tool==="magnet"?.7:.08}));Mt.push(ne),Oe.push(ne);let de=f(F.id,"#f3e5c2",[...F.center]);I.push(de),Oe.push(de)}for(let F of g.targets){let se=a(new kt(...F.size,1),new Xt({color:F.id==="A"?15256222:10931152,roughness:1,transparent:!0,opacity:.65}));se.position.set(F.center[0],F.center[1],.6),rt.push(se),Oe.push(se),Oe.push(f(F.id,"#ecdcad",[F.center[0],F.center[1],6]))}}g.objects.forEach((P,k)=>{let H=Mt[k],F=P.rotation;H.position.copy(h(P.center)),H.quaternion.setFromRotationMatrix(new ht().set(F[0],F[1],F[2],0,F[3],F[4],F[5],0,F[6],F[7],F[8],0,0,0,0,1)),I[k].position.set(P.center[0],P.center[1],P.center[2]+P.size[2]/2+22),rt[k].material.color.set(P.placed?9549676:P.id==="A"?15256222:10931152)}),n.domElement.dataset.tool=g.tool,n.domElement.dataset.held=g.held||"",n.domElement.dataset.score=String(g.score)}let xe=u([],15759396),$e=[];function Se(g,P=!0){S(g.length);let k=Rt(g),H=k.tip,F=k.points;D=k,m.forEach((de,fe)=>{let te=h(F[fe]),le=h(F[fe+1]);de.position.copy(te).add(le).multiplyScalar(.5),de.scale.y=te.distanceTo(le),de.quaternion.setFromUnitVectors(new N(0,1,0),le.sub(te).normalize())}),d.forEach((de,fe)=>{de.position.copy(h(k.origins[fe+1])),de.quaternion.setFromUnitVectors(new N(0,1,0),h(k.axes[fe+1])),E[fe].position.copy(de.position),E[fe].quaternion.copy(de.quaternion)}),A.position.copy(h(H)),w.position.copy(h(H));let se=k.rotation,ne=new ht().set(se[0],se[1],se[2],0,se[3],se[4],se[5],0,se[6],se[7],se[8],0,0,0,0,1);w.quaternion.setFromRotationMatrix(ne),$.position.copy(w.position),$.quaternion.copy(w.quaternion),K.geometry.dispose(),K.geometry=new _t().setFromPoints([h(H),h([H[0],H[1],0])]),_e.position.set(H[0],H[1],1),P&&(!$e.length||h(H).distanceTo($e.at(-1))>1.5)&&($e.push(h(H)),$e.length>1400&&$e.shift(),xe.geometry.dispose(),xe.geometry=new _t().setFromPoints($e))}function Be(g){let P=Math.max(1,Qi(y)/440);s.target.set(110,25,95),t.position.set(...g==="top"?[65,-.1,1050*P]:g==="side"?[40,-1e3*P,110]:[540*P,-620*P,540*P]),s.update()}let St=()=>{let{width:g,height:P}=i.getBoundingClientRect(),k=0;i.style.setProperty("--dock-height",k+"px");let H=Math.max(180,P-k);n.setSize(g,H,!1),t.aspect=g/H,t.updateProjectionMatrix()};new ResizeObserver(St).observe(i);let T=Eu(document.getElementById("view-cube"),t,s);return n.setAnimationLoop(()=>{Me(),T.update();let g=Cu(b,D);for(let P of C){let k=P.userData.sign,H=g[k<0?0:1],F=v?H:k*sn.open,se=P.position.y+(F-P.position.y)*.16;P.position.y=k<0?Math.min(se,H):Math.max(se,H)}n.domElement.dataset.jawGap=C.length?String(C[1].position.y-C[0].position.y-sn.thickness):"",X&&(X.visible=v&&L!=="gripper"),s.update(),n.render(e,t)}),Se(Vt.home),{pose:Se,configure:S,view:Be,taskState:Le,setQuizTarget(g){ie=g,Me()},setTrail(g){xe.visible=g,n.domElement.dataset.trailVisible=String(g)},setReach:g=>Ie.visible=g,clearTrail(){$e=[],xe.geometry.dispose(),xe.geometry=new _t},targets(){}}}var q_=25,Y_=85,Pr=["gripper","vacuum","magnet"],Iu=i=>[i[0],i[3],i[6],i[1],i[4],i[7],i[2],i[5],i[8]],Uu=[1,0,0,0,1,0,0,0,1],Pu=(i,e)=>i.map((t,n)=>t+e[n]),Du=(i,e)=>i.map((t,n)=>t-e[n]);function Z_(i){let e=i==="gripper"?[26,26,28]:i==="vacuum"?[36,30,18]:[30,30,20],t={gripper:60,vacuum:75,magnet:90}[i],n=i!=="gripper",s=n?[200,-135]:[170,-105],r=n?[220,125]:[180,80];return{tool:i,obstacle:{center:[...r,t/2],size:[64,64,t]},objects:[{id:"A",center:[...s,e[2]/2],size:[...e],material:{gripper:"wood",vacuum:"smooth",magnet:"steel"}[i]},{id:"B",center:[...r,t+e[2]/2],size:[...e],material:{gripper:"wood",vacuum:"smooth",magnet:"steel"}[i]}],targets:[{id:"A",center:n?[100,220,0]:[75,195,0],size:[72,72]},{id:"B",center:n?[240,-65,0]:[230,-65,0],size:[72,72]}]}}function si(i){let e=i.size.map(s=>s/2),t=i.rotation||Uu,n=[0,1,2].map(s=>Math.abs(t[3*s])*e[0]+Math.abs(t[3*s+1])*e[1]+Math.abs(t[3*s+2])*e[2]);return{min:i.center.map((s,r)=>s-n[r]),max:i.center.map((s,r)=>s+n[r]),extent:n}}var Lu=(i,e,t=.6)=>i.min.every((n,s)=>n<e.max[s]-t&&i.max[s]>e.min[s]+t);function Nu(i,e,t,n){let s=si(t),r=0,o=1;for(let a=0;a<3;a++){let c=e[a]-i[a],l=s.min[a]-n,h=s.max[a]+n;if(Math.abs(c)<1e-9){if(i[a]<l||i[a]>h)return!1}else{let u=(l-i[a])/c,f=(h-i[a])/c;if(u>f&&([u,f]=[f,u]),r=Math.max(r,u),o=Math.min(o,f),r>o)return!1}}return!0}var Bs=class{constructor(e="gripper"){this.reset(e)}reset(e=this.tool){this.tool=e,this.spec=Z_(e),this.objects=this.spec.objects.map(t=>({...t,center:[...t.center],rotation:[...Uu],placed:!1,status:"ready"})),this.output=!1,this.held=null,this.offset=null,this.localRotation=null,this.lastEvent="taskReady",this.drops=0}get input(){return this.held!==null}get score(){return this.objects.filter(e=>e.placed).length}get heldObject(){return this.objects.find(e=>e.id===this.held)}heldPose(e){if(!this.held)return null;let t=Rt(e);return{...this.heldObject,center:Pu(t.tip,ri(t.rotation,this.offset)),rotation:Dn(t.rotation,this.localRotation)}}update(e){let t=this.heldPose(e);t?Object.assign(this.heldObject,t):this.output&&this.tryGrasp(e)}contact(e){return[e.center[0],e.center[1],e.center[2]+e.size[2]/2]}command(e,t){let n=this.heldPose(t);if(n&&Object.assign(this.heldObject,n),this.output=e,e&&this.held)return this.lastEvent;if(!e){if(!this.held)return this.lastEvent="releasedEmpty",this.lastEvent;let s=this.heldObject,r=si(s),o=si(this.spec.obstacle),c=r.min[0]>=o.min[0]&&r.max[0]<=o.max[0]&&r.min[1]>=o.min[1]&&r.max[1]<=o.max[1]&&r.min[2]>=o.max[2]-.8?o.max[2]:0,l=r.min[2]-c<=8&&r.min[2]>=c-1,h=s.rotation[8]>Math.cos(Math.PI/4);s.center[2]-=r.min[2]-c;let u=si(s),f=this.spec.targets.find(p=>p.id===s.id);return s.placed=l&&h&&c===0&&[0,1].every(p=>u.min[p]>=f.center[p]-f.size[p]/2&&u.max[p]<=f.center[p]+f.size[p]/2),s.status=s.placed?"placed":l?"ready":"dropped",this.held=null,this.offset=null,this.localRotation=null,l||this.drops++,this.lastEvent=s.placed?"placed":l?"outsideTarget":"dropped",this.lastEvent}return this.tryGrasp(t)}tryGrasp(e){let t=Rt(e),n=this.objects.filter(r=>oi(this.contact(r),t.tip)<=q_).sort((r,o)=>oi(this.contact(r),t.tip)-oi(this.contact(o),t.tip))[0];if(!n)return this.lastEvent="noContact",this.lastEvent;if(this.tool==="magnet"&&n.material!=="steel"||this.tool==="vacuum"&&n.material!=="smooth")return this.lastEvent="wrongMaterial",this.lastEvent;if(this.tool!=="gripper"&&t.rotation[8]<Math.cos(Y_*Math.PI/180))return this.lastEvent="alignment",this.lastEvent;if(this.tool==="gripper"&&mc(n,t).width>sn.capacity)return this.lastEvent="tooWide",this.lastEvent;let s=Du(t.tip,this.contact(n));return n.center=Pu(n.center,[s[0],s[1],Math.max(0,s[2])]),this.held=n.id,n.placed=!1,n.status="held",this.offset=ri(Iu(t.rotation),Du(n.center,t.tip)),this.localRotation=Dn(Iu(t.rotation),n.rotation),this.lastEvent="grasped",this.lastEvent}collision(e){let t=Rt(e);for(let s=0;s<t.points.length-1;s++)if(Nu(t.points[s],t.points[s+1],this.spec.obstacle,s===t.points.length-2?7:11))return"obstacle";if(t.tip[2]<11.9)return"path";if(Nu(t.flange,t.tip,this.spec.obstacle,7))return"obstacle";let n=this.heldPose(e);if(n){let s=si(n);if(s.min[2]<-.8||Lu(s,si(this.spec.obstacle)))return"payloadCollision";for(let r of this.objects)if(r.id!==n.id&&Lu(s,si(r)))return"payloadCollision"}return null}canMove(e,t){if(!zr(e,t))return"path";let n=Math.max(1,Math.ceil(Math.max(...e.map((s,r)=>Math.abs(s-t[r])))/.5));for(let s=0;s<=n;s++){let r=this.collision(e.map((o,a)=>o+(t[a]-o)*s/n));if(r)return r}return null}snapshot(){return{tool:this.tool,output:this.output,input:this.input,held:this.held,score:this.score,objects:this.objects.map(e=>({...e,center:[...e.center],rotation:[...e.rotation]})),obstacle:this.spec.obstacle,targets:this.spec.targets,drops:this.drops}}};function gc(i,e){let t=new Bs(i),n=[],s=xn(e),r=i==="gripper"?190:170;if(i!=="gripper"&&e!==6)return{error:"sixForExample"};function o(c,l,h=!1){let u=[...c],f;for(let _=0;_<(h?5:1);_++){if(f=Gs(u,s,"nearest",e===6?[0,0,Math.atan2(u[1],u[0])*180/Math.PI]:null),!f.q)throw Error(f.error);if(h){let x=si(t.heldPose(f.q)).min[2];if(Math.abs(x-2)<.25)break;u[2]+=2-x}}let p=t.canMove(s,f.q);if(p)throw Error(p);s=f.q,t.update(s),n.push({type:"move",name:l,q:[...s],seconds:1.5})}function a(c,l){if(t.command(c,s),c&&!t.input)throw Error(t.lastEvent);n.push({type:"output",value:c,name:l,seconds:.4})}try{o([220,0,r],"Lift to travel height");for(let c of t.objects){let l=t.contact(c),h=t.spec.targets.find(u=>u.id===c.id);if(o([l[0],l[1],r],`${c.id} \xB7 Approach`),o(l,`${c.id} \xB7 Pick`),a(!0,`${c.id} \xB7 Tool ON`),n.push({type:"wait",value:!0,name:"Confirm DI1: object held",seconds:3}),o([l[0],l[1],r],`${c.id} \xB7 Lift clear`),o([h.center[0],h.center[1],r],`${c.id} \xB7 Above target`),o([h.center[0],h.center[1],c.size[2]+2],`${c.id} \xB7 Lower gently`,!0),a(!1,`${c.id} \xB7 Release`),!c.placed)throw Error(t.lastEvent);o([h.center[0],h.center[1],r],`${c.id} \xB7 Retreat`)}return{steps:n}}catch(c){return{error:c.message}}}var Lt={subtitle:"MOVE \xB7 RECORD \xB7 PROGRAM",axis:"3 AXIS / POSITION CONTROL",guide:"Quick guide",workspace:"01 / THE WORKSPACE",title:"Every movement starts here.",perspective:"Perspective",top:"Top",side:"Side",envelope:"Reach envelope",trail:"Clear trail",orbit:"Drag to orbit \xB7 Scroll to zoom",toolposition:"TOOL POSITION",world:"World coordinates \xB7 mm",mission:"LEARNING CHALLENGE",missiontitle:"The inspection route",missiondesc:"Build a program that visits A \u2192 B \u2192 C in order. Finish each move within 15 mm of its target.",resetTask:"Reset challenge",control:"02 / CONTROL THE ARM",jointcontrol:"Joint control",home:"\u2302 Home",xyztitle:"Move to coordinates",nearest:"Nearest configuration",negative:"Elbow \u2212",positive:"Elbow +",move:"Move to XYZ \u2197",record:"\uFF0B Record current position",program:"03 / BUILD A SEQUENCE",movement:"Movement program",run:"\u25B6 Run",pause:"Pause",resume:"Resume",stop:"\u25A0 Stop",empty:"Move the arm. Record a position.<br>Connect your positions into a program.",example:"Load example",export:"Export",import:"Import",saved:"Programs save in this browser. Export a copy to keep or share.",footer:"A small arm. A world of possibilities.",spec:"160 + 140 mm links \xB7 Joint-interpolated motion \xB7 3 DOF",learn:"LEARN BY DOING",guidetitle:"From angles to actions.",guidebody:'<ol><li><b>Explore:</b> drag a joint slider. Watch its angle and the tool\u2019s X, Y, Z coordinates change.</li><li><b>Teach:</b> record a position. Change the arm, then record another. Rename, reorder, or remove steps.</li><li><b>Program:</b> enter XYZ in millimetres, move there, then record it. Run your sequence and adjust step durations.</li><li><b>Try the challenge:</b> select target A to fill its XYZ fields. Move, record, and repeat for B and C. Only completed program steps count.</li></ol><p><b>Coordinate system:</b> Z points up. X and Y lie on the table. The shoulder is 70 mm above the origin. Joint 2 is measured from horizontal; joint 3 is relative to the upper arm.</p><p><b>Why a curved path?</b> The joints rotate together. A straight line between coordinates would require a different motion planner.</p><p><b>Limits:</b> the 300 mm sphere is an outer reach bound, not a map of all reachable points. Joint limits, table clearance, and elbow configuration restrict movement. Near a straight or folded elbow, motion becomes singular: small tool changes can require large angle changes.</p><p class="guide-note">This is a kinematic learning model: table clearance is checked using link endpoints and a small clearance allowance. Self-collision, base collision, payload, dynamics, and hardware control are not modeled. Three axes control position but cannot independently set tool orientation; a future six-axis model adds that capability.</p>',ready:"Ready",moving:"Moving",running:"Running",paused:"Paused",welcome:"Try a slider, or enter a target position to begin.",recorded:"Position recorded. Add another or run your program.",numbers:"Enter three finite coordinates.",reach:"Outside the arm\u2019s reach. The links have a combined length of 300 mm.",limits:"This target violates a joint limit or table clearance in the selected configuration.",path:"The movement would cross the table. Add an intermediate raised position.",blocked:"Movement blocked by a joint limit or table clearance.",complete:"Program complete.",stopped:"Stopped at the current position.",loaded:"Example loaded: three inspection targets. Press Run to try it.",imported:"Program imported.",badfile:"Could not import: use a valid Robot Arm Lab JSON program (up to 200 safe positions).",storage:"Browser storage is unavailable. Export your program to keep it.",singular:"Near a singular configuration \u2014 try bending the elbow.",normal:"Base rotation + shoulder + elbow = 3 degrees of freedom.",step:"Position",seconds:"sec",go:"Go",up:"Move earlier",down:"Move later",remove:"Remove",score:"targets completed",won:"Route complete \u2014 all three targets reached!",targetSelected:"Target coordinates filled. Move there, then record the position.",max:"Maximum 200 steps. Export this program before starting another.",emptyProgram:"Record a position first.",noWebGL:"3D graphics could not start. Enable WebGL or try another browser.",replaced:"Current program replaced.",base:"Base",shoulder:"Shoulder",elbow:"Elbow",exported:"Program exported.",noPath:"Cannot run this sequence safely. Add a raised waypoint before the blocked step."},Nt={subtitle:"\u79FB\u52A8 \xB7 \u8BB0\u5F55 \xB7 \u7F16\u7A0B",axis:"\u4E09\u8F74 / \u4F4D\u7F6E\u63A7\u5236",guide:"\u5FEB\u901F\u6307\u5357",workspace:"01 / \u5DE5\u4F5C\u7A7A\u95F4",title:"\u4ECE\u4E00\u6B21\u79FB\u52A8\u5F00\u59CB\u63A2\u7D22\u3002",perspective:"\u900F\u89C6",top:"\u4FEF\u89C6",side:"\u4FA7\u89C6",envelope:"\u53EF\u8FBE\u8303\u56F4",trail:"\u6E05\u9664\u8F68\u8FF9",orbit:"\u62D6\u52A8\u65CB\u8F6C \xB7 \u6EDA\u8F6E\u7F29\u653E",toolposition:"\u5DE5\u5177\u4F4D\u7F6E",world:"\u4E16\u754C\u5750\u6807 \xB7 \u6BEB\u7C73",mission:"\u5B66\u4E60\u6311\u6218",missiontitle:"\u5DE1\u68C0\u8DEF\u7EBF",missiondesc:"\u7F16\u5199\u7A0B\u5E8F\uFF0C\u4F9D\u6B21\u5230\u8FBE A \u2192 B \u2192 C\u3002\u6BCF\u6B65\u7ED3\u675F\u65F6\u4E0E\u76EE\u6807\u7684\u8DDD\u79BB\u5E94\u5C0F\u4E8E 15 \u6BEB\u7C73\u3002",resetTask:"\u91CD\u7F6E\u6311\u6218",control:"02 / \u63A7\u5236\u673A\u68B0\u81C2",jointcontrol:"\u5173\u8282\u63A7\u5236",home:"\u2302 \u521D\u59CB\u4F4D\u7F6E",xyztitle:"\u79FB\u52A8\u5230\u5750\u6807",nearest:"\u6700\u8FD1\u7684\u5173\u8282\u914D\u7F6E",negative:"\u8098\u5173\u8282 \u2212",positive:"\u8098\u5173\u8282 +",move:"\u79FB\u52A8\u5230 XYZ \u2197",record:"\uFF0B \u8BB0\u5F55\u5F53\u524D\u4F4D\u7F6E",program:"03 / \u7F16\u6392\u52A8\u4F5C",movement:"\u52A8\u4F5C\u7A0B\u5E8F",run:"\u25B6 \u8FD0\u884C",pause:"\u6682\u505C",resume:"\u7EE7\u7EED",stop:"\u25A0 \u505C\u6B62",empty:"\u79FB\u52A8\u673A\u68B0\u81C2\uFF0C\u8BB0\u5F55\u4F4D\u7F6E\u3002<br>\u628A\u591A\u4E2A\u4F4D\u7F6E\u8FDE\u63A5\u6210\u52A8\u4F5C\u7A0B\u5E8F\u3002",example:"\u52A0\u8F7D\u793A\u4F8B",export:"\u5BFC\u51FA",import:"\u5BFC\u5165",saved:"\u7A0B\u5E8F\u81EA\u52A8\u4FDD\u5B58\u5728\u6B64\u6D4F\u89C8\u5668\u4E2D\u3002\u8BF7\u5BFC\u51FA\u526F\u672C\u4EE5\u4FDD\u7559\u6216\u5206\u4EAB\u3002",footer:"\u5C0F\u5C0F\u673A\u68B0\u81C2\uFF0C\u63A2\u7D22\u65E0\u9650\u53EF\u80FD\u3002",spec:"\u8FDE\u6746 160 + 140 \u6BEB\u7C73 \xB7 \u5173\u8282\u63D2\u503C\u8FD0\u52A8 \xB7 3 \u81EA\u7531\u5EA6",learn:"\u5728\u5B9E\u8DF5\u4E2D\u5B66\u4E60",guidetitle:"\u4ECE\u89D2\u5EA6\u5230\u52A8\u4F5C\u3002",guidebody:'<ol><li><b>\u63A2\u7D22\uFF1A</b>\u62D6\u52A8\u5173\u8282\u6ED1\u5757\uFF0C\u89C2\u5BDF\u89D2\u5EA6\u4E0E\u5DE5\u5177\u7684 X\u3001Y\u3001Z \u5750\u6807\u3002</li><li><b>\u793A\u6559\uFF1A</b>\u8BB0\u5F55\u4E00\u4E2A\u4F4D\u7F6E\uFF0C\u79FB\u52A8\u540E\u518D\u8BB0\u5F55\u53E6\u4E00\u4E2A\u4F4D\u7F6E\u3002\u53EF\u4EE5\u91CD\u547D\u540D\u3001\u6392\u5E8F\u6216\u5220\u9664\u6B65\u9AA4\u3002</li><li><b>\u7F16\u7A0B\uFF1A</b>\u8F93\u5165\u6BEB\u7C73\u5355\u4F4D\u7684 XYZ \u5750\u6807\uFF0C\u79FB\u52A8\u540E\u8BB0\u5F55\u3002\u8FD0\u884C\u7A0B\u5E8F\u5E76\u8C03\u6574\u6BCF\u6B65\u7684\u65F6\u957F\u3002</li><li><b>\u6311\u6218\uFF1A</b>\u70B9\u51FB\u76EE\u6807 A \u586B\u5165\u5750\u6807\uFF0C\u79FB\u52A8\u5E76\u8BB0\u5F55\uFF0C\u518D\u5BF9 B\u3001C \u91CD\u590D\u64CD\u4F5C\u3002\u53EA\u6709\u5DF2\u5B8C\u6210\u7684\u7A0B\u5E8F\u6B65\u9AA4\u8BA1\u5206\u3002</li></ol><p><b>\u5750\u6807\uFF1A</b>Z \u5411\u4E0A\uFF0CX\u3001Y \u4F4D\u4E8E\u684C\u9762\u3002\u80A9\u5173\u8282\u8DDD\u539F\u70B9\u9AD8 70 \u6BEB\u7C73\u3002\u5173\u8282 2 \u76F8\u5BF9\u4E8E\u6C34\u5E73\u9762\uFF0C\u5173\u8282 3 \u76F8\u5BF9\u4E8E\u4E0A\u81C2\u3002</p><p><b>\u4E3A\u4EC0\u4E48\u662F\u66F2\u7EBF\uFF1F</b>\u5173\u8282\u540C\u65F6\u65CB\u8F6C\uFF0C\u5DE5\u5177\u4E0D\u4F1A\u6CBF\u76F4\u7EBF\u79FB\u52A8\u3002\u76F4\u7EBF\u8FD0\u52A8\u9700\u8981\u4E0D\u540C\u7684\u8DEF\u5F84\u89C4\u5212\u3002</p><p><b>\u5C40\u9650\uFF1A</b>300 \u6BEB\u7C73\u7403\u4F53\u53EA\u662F\u5916\u90E8\u53EF\u8FBE\u8FB9\u754C\u3002\u5173\u8282\u9650\u4F4D\u3001\u684C\u9762\u95F4\u9699\u548C\u8098\u90E8\u914D\u7F6E\u8FDB\u4E00\u6B65\u9650\u5236\u53EF\u8FBE\u4F4D\u7F6E\u3002\u8098\u90E8\u63A5\u8FD1\u4F38\u76F4\u6216\u6298\u53E0\u65F6\u4F1A\u51FA\u73B0\u5947\u5F02\u4F4D\u5F62\u3002</p><p class="guide-note">\u672C\u5E94\u7528\u662F\u8FD0\u52A8\u5B66\u6559\u5B66\u6A21\u578B\uFF1A\u901A\u8FC7\u8FDE\u6746\u7AEF\u70B9\u548C\u5C0F\u95F4\u9699\u68C0\u67E5\u684C\u9762\u78B0\u649E\uFF0C\u4E0D\u6A21\u62DF\u81EA\u8EAB\u6216\u5E95\u5EA7\u78B0\u649E\u3001\u8D1F\u8F7D\u3001\u52A8\u529B\u5B66\uFF0C\u4E5F\u4E0D\u63A7\u5236\u771F\u5B9E\u786C\u4EF6\u3002\u4E09\u8F74\u63A7\u5236\u4F4D\u7F6E\uFF0C\u4F46\u65E0\u6CD5\u72EC\u7ACB\u63A7\u5236\u5DE5\u5177\u59FF\u6001\uFF1B\u672A\u6765\u516D\u8F74\u7248\u672C\u5C06\u6269\u5C55\u6B64\u80FD\u529B\u3002</p>',ready:"\u5C31\u7EEA",moving:"\u79FB\u52A8\u4E2D",running:"\u8FD0\u884C\u4E2D",paused:"\u5DF2\u6682\u505C",welcome:"\u62D6\u52A8\u6ED1\u5757\uFF0C\u6216\u8F93\u5165\u76EE\u6807\u5750\u6807\u5F00\u59CB\u3002",recorded:"\u4F4D\u7F6E\u5DF2\u8BB0\u5F55\u3002\u7EE7\u7EED\u6DFB\u52A0\u6216\u8FD0\u884C\u7A0B\u5E8F\u3002",numbers:"\u8BF7\u8F93\u5165\u4E09\u4E2A\u6709\u6548\u5750\u6807\u3002",reach:"\u8D85\u51FA\u53EF\u8FBE\u8303\u56F4\u3002\u4E24\u6839\u8FDE\u6746\u603B\u957F\u4E3A 300 \u6BEB\u7C73\u3002",limits:"\u76EE\u6807\u8D85\u51FA\u5173\u8282\u9650\u4F4D\u6216\u4E0D\u6EE1\u8DB3\u684C\u9762\u95F4\u9699\uFF0C\u8BF7\u5C1D\u8BD5\u5176\u4ED6\u8098\u90E8\u914D\u7F6E\u3002",path:"\u6B64\u8DEF\u5F84\u4F1A\u7A7F\u8FC7\u684C\u9762\u3002\u8BF7\u6DFB\u52A0\u4E00\u4E2A\u62AC\u9AD8\u7684\u4E2D\u95F4\u4F4D\u7F6E\u3002",blocked:"\u79FB\u52A8\u88AB\u5173\u8282\u9650\u4F4D\u6216\u684C\u9762\u95F4\u9699\u9650\u5236\u3002",complete:"\u7A0B\u5E8F\u6267\u884C\u5B8C\u6210\u3002",stopped:"\u5DF2\u5728\u5F53\u524D\u4F4D\u7F6E\u505C\u6B62\u3002",loaded:"\u5DF2\u52A0\u8F7D\u4E09\u4E2A\u5DE1\u68C0\u76EE\u6807\u3002\u70B9\u51FB\u8FD0\u884C\u5F00\u59CB\u3002",imported:"\u7A0B\u5E8F\u5DF2\u5BFC\u5165\u3002",badfile:"\u65E0\u6CD5\u5BFC\u5165\u3002\u8BF7\u4F7F\u7528\u6709\u6548\u7684 JSON \u7A0B\u5E8F\uFF08\u6700\u591A 200 \u4E2A\u5B89\u5168\u4F4D\u7F6E\uFF09\u3002",storage:"\u6D4F\u89C8\u5668\u5B58\u50A8\u4E0D\u53EF\u7528\uFF0C\u8BF7\u5BFC\u51FA\u7A0B\u5E8F\u4FDD\u5B58\u3002",singular:"\u63A5\u8FD1\u5947\u5F02\u4F4D\u5F62\uFF0C\u8BF7\u5C1D\u8BD5\u5F2F\u66F2\u8098\u90E8\u3002",normal:"\u5E95\u5EA7\u65CB\u8F6C + \u80A9\u5173\u8282 + \u8098\u5173\u8282 = 3 \u81EA\u7531\u5EA6\u3002",step:"\u4F4D\u7F6E",seconds:"\u79D2",go:"\u79FB\u52A8",up:"\u4E0A\u79FB",down:"\u4E0B\u79FB",remove:"\u5220\u9664",score:"\u4E2A\u76EE\u6807\u5DF2\u5B8C\u6210",won:"\u8DEF\u7EBF\u5B8C\u6210\uFF0C\u5DF2\u5230\u8FBE\u6240\u6709\u76EE\u6807\uFF01",targetSelected:"\u76EE\u6807\u5750\u6807\u5DF2\u586B\u5165\u3002\u79FB\u52A8\u540E\u8BB0\u5F55\u8BE5\u4F4D\u7F6E\u3002",max:"\u6700\u591A 200 \u6B65\u3002\u8BF7\u5148\u5BFC\u51FA\u6B64\u7A0B\u5E8F\u3002",emptyProgram:"\u8BF7\u5148\u8BB0\u5F55\u4E00\u4E2A\u4F4D\u7F6E\u3002",noWebGL:"\u65E0\u6CD5\u542F\u52A8 3D \u56FE\u5F62\uFF0C\u8BF7\u5F00\u542F WebGL \u6216\u5C1D\u8BD5\u5176\u4ED6\u6D4F\u89C8\u5668\u3002",replaced:"\u5DF2\u66FF\u6362\u5F53\u524D\u7A0B\u5E8F\u3002",base:"\u5E95\u5EA7",shoulder:"\u80A9\u5173\u8282",elbow:"\u8098\u5173\u8282",exported:"\u7A0B\u5E8F\u5DF2\u5BFC\u51FA\u3002",noPath:"\u7A0B\u5E8F\u8DEF\u5F84\u4E0D\u5B89\u5168\u3002\u8BF7\u5728\u53D7\u963B\u6B65\u9AA4\u4E4B\u524D\u6DFB\u52A0\u62AC\u9AD8\u7684\u4E2D\u95F4\u4F4D\u7F6E\u3002"};Object.assign(Lt,{axis:"{n} JOINTS / MODULAR ARM",spec:"{n} joints \xB7 {reach} mm reach bound \xB7 Joint-interpolated motion",showTrail:"Show trail",armBuilder:"Build your arm",addJoint:"\uFF0B Add joint",removeJoint:"\u2212 Remove joint",separatePrograms:"Each arm size keeps its own program.",armInfo:"{n} joints \xB7 {reach} mm maximum reach.",nextSwivel:"Next: wrist swivel for sideways motion.",nextPitch:"Next: wrist pitch to tilt the tool.",nextRoll:"Next: tool roll to rotate its orientation.",allJoints:"Full six-joint arm: position + orientation.",swivel:"Wrist swivel",wristPitch:"Wrist pitch",toolRoll:"Tool roll",rotation:"Rotation",armChanged:"Switched to {n} joints. This arm\u2019s saved program is ready.",targetOrientation:"Target tool orientation",toolOrientation:"TOOL ORIENTATION",roll:"Roll",pitch:"Pitch",yaw:"Yaw",copyPose:"Use current pose",orientationHelp:"Optional: solve XYZ + roll, pitch, yaw together (degrees).",orientationLocked:"Add all six joints to target position and orientation together.",poseCopied:"Current XYZ and tool orientation copied to the target fields.",extraMotion:"Extra joints change how the arm reaches a point. Tool roll changes orientation, not XYZ.",reach:"Outside the arm\u2019s reach. This configuration has a {reach} mm outer reach bound.",solve:"No safe solution found. Try another orientation, a closer target, or a different starting pose.",orientationInvalid:"Orientation requires six joints and three angles between \u2212180\xB0 and 180\xB0.",replaceExample:"Replace this arm\u2019s program with the example? Export first if you want to keep it.",replaceImport:"Replace the saved program for the arm size in this file? Other arm sizes will be kept.",guidebody:'<ol><li><b>Explore:</b> move each joint and watch the live XYZ and tool orientation. Orange shows the tool\u2019s motion trail. \u201CShow trail\u201D hides or reveals it; \u201CClear trail\u201D erases it.</li><li><b>Expand:</b> add a wrist swivel (J4), wrist pitch (J5), and tool roll (J6). Each arm size has its own saved program. Changing arm size returns that arm to its home pose.</li><li><b>Teach:</b> record positions, rename and reorder steps, set durations, and run the program.</li><li><b>Target:</b> enter XYZ and move there. With six joints, optionally target roll, pitch, and yaw as well. \u201CUse current pose\u201D gives you a reachable starting target.</li><li><b>Challenge:</b> visit A \u2192 B \u2192 C, finishing each program move within 15 mm. Compare how different arm sizes perform the same task.</li></ol><p><b>Frames:</b> world Z points up. J1 rotates about world Z; J2 and J3 pitch upwards. Added joint axes move with their parent: J4 swivels about local Z, J5 pitches about local \u2212Y, and J6 rolls about local X. The tool\u2019s small colored axes and rectangular collar show its orientation.</p><p><b>Orientation:</b> roll, pitch, yaw use Rz(yaw) Ry(pitch) Rx(roll). Euler angles can wrap at \xB1180\xB0 and are ambiguous at pitch \xB190\xB0. Six joints allow position and orientation control in nonsingular reachable configurations; they do not guarantee every requested pose.</p><p><b>Motion:</b> all joints rotate together, so the tool path is usually curved. The 4\u20136 joint solver is numerical: \u201Cno solution found\u201D is not proof that a target is unreachable. Try a different starting pose. A single joint-interpolated move may cross the table even when its endpoints are valid; add raised waypoints.</p><p class="guide-note">This is a kinematic learning model. The sphere shows an outer reach bound, not the full reachable workspace. Endpoint clearance approximates table checks; self/base collision, payload, dynamics, and hardware control are not modeled.</p>'});Object.assign(Nt,{axis:"{n} \u5173\u8282 / \u6A21\u5757\u5316\u673A\u68B0\u81C2",spec:"{n} \u5173\u8282 \xB7 \u53EF\u8FBE\u5916\u8FB9\u754C {reach} \u6BEB\u7C73 \xB7 \u5173\u8282\u63D2\u503C\u8FD0\u52A8",showTrail:"\u663E\u793A\u8F68\u8FF9",armBuilder:"\u7EC4\u88C5\u673A\u68B0\u81C2",addJoint:"\uFF0B \u6DFB\u52A0\u5173\u8282",removeJoint:"\u2212 \u79FB\u9664\u5173\u8282",separatePrograms:"\u6BCF\u79CD\u5173\u8282\u6570\u91CF\u5206\u522B\u4FDD\u5B58\u81EA\u5DF1\u7684\u7A0B\u5E8F\u3002",armInfo:"{n} \u4E2A\u5173\u8282 \xB7 \u6700\u5927\u4F38\u5C55 {reach} \u6BEB\u7C73\u3002",nextSwivel:"\u4E0B\u4E00\u6B65\uFF1A\u6DFB\u52A0\u8155\u90E8\u504F\u8F6C\uFF0C\u5B9E\u73B0\u4FA7\u5411\u8FD0\u52A8\u3002",nextPitch:"\u4E0B\u4E00\u6B65\uFF1A\u6DFB\u52A0\u8155\u90E8\u4FEF\u4EF0\uFF0C\u8C03\u6574\u5DE5\u5177\u503E\u89D2\u3002",nextRoll:"\u4E0B\u4E00\u6B65\uFF1A\u6DFB\u52A0\u5DE5\u5177\u6EDA\u8F6C\uFF0C\u65CB\u8F6C\u5DE5\u5177\u59FF\u6001\u3002",allJoints:"\u5B8C\u6574\u516D\u5173\u8282\u673A\u68B0\u81C2\uFF1A\u4F4D\u7F6E + \u59FF\u6001\u3002",swivel:"\u8155\u90E8\u504F\u8F6C",wristPitch:"\u8155\u90E8\u4FEF\u4EF0",toolRoll:"\u5DE5\u5177\u6EDA\u8F6C",rotation:"\u65CB\u8F6C",armChanged:"\u5DF2\u5207\u6362\u4E3A {n} \u5173\u8282\uFF0C\u6B64\u673A\u68B0\u81C2\u7684\u5DF2\u5B58\u7A0B\u5E8F\u5DF2\u5C31\u7EEA\u3002",targetOrientation:"\u8BBE\u5B9A\u5DE5\u5177\u59FF\u6001",toolOrientation:"\u5DE5\u5177\u59FF\u6001",roll:"\u6EDA\u8F6C",pitch:"\u4FEF\u4EF0",yaw:"\u504F\u822A",copyPose:"\u4F7F\u7528\u5F53\u524D\u4F4D\u59FF",orientationHelp:"\u53EF\u9009\uFF1A\u540C\u65F6\u6C42\u89E3 XYZ \u4E0E\u6EDA\u8F6C\u3001\u4FEF\u4EF0\u3001\u504F\u822A\u89D2\uFF08\u5EA6\uFF09\u3002",orientationLocked:"\u6DFB\u52A0\u81F3\u516D\u4E2A\u5173\u8282\u540E\uFF0C\u53EF\u540C\u65F6\u8BBE\u5B9A\u4F4D\u7F6E\u4E0E\u59FF\u6001\u3002",poseCopied:"\u5DF2\u5C06\u5F53\u524D XYZ \u548C\u5DE5\u5177\u59FF\u6001\u590D\u5236\u5230\u76EE\u6807\u8F93\u5165\u6846\u3002",extraMotion:"\u66F4\u591A\u5173\u8282\u6539\u53D8\u5230\u8FBE\u76EE\u6807\u7684\u65B9\u5F0F\u3002\u5DE5\u5177\u6EDA\u8F6C\u53EA\u6539\u53D8\u59FF\u6001\uFF0C\u4E0D\u6539\u53D8 XYZ\u3002",reach:"\u8D85\u51FA\u673A\u68B0\u81C2\u53EF\u8FBE\u8303\u56F4\u3002\u5F53\u524D\u7ED3\u6784\u7684\u5916\u8FB9\u754C\u4E3A {reach} \u6BEB\u7C73\u3002",solve:"\u672A\u627E\u5230\u5B89\u5168\u89E3\u3002\u8BF7\u5C1D\u8BD5\u5176\u4ED6\u59FF\u6001\u3001\u8F83\u8FD1\u7684\u76EE\u6807\u6216\u4E0D\u540C\u7684\u8D77\u59CB\u4F4D\u59FF\u3002",orientationInvalid:"\u59FF\u6001\u6C42\u89E3\u9700\u8981\u516D\u4E2A\u5173\u8282\uFF0C\u4E09\u4E2A\u89D2\u5EA6\u987B\u5728 \u2212180\xB0 \u81F3 180\xB0 \u4E4B\u95F4\u3002",replaceExample:"\u4F7F\u7528\u793A\u4F8B\u66FF\u6362\u6B64\u673A\u68B0\u81C2\u7684\u7A0B\u5E8F\uFF1F\u5982\u9700\u4FDD\u7559\uFF0C\u8BF7\u5148\u5BFC\u51FA\u3002",replaceImport:"\u66FF\u6362\u6B64\u6587\u4EF6\u5BF9\u5E94\u5173\u8282\u6570\u91CF\u7684\u5DF2\u5B58\u7A0B\u5E8F\uFF1F\u5176\u4ED6\u673A\u68B0\u81C2\u7A0B\u5E8F\u5C06\u4FDD\u7559\u3002",guidebody:'<ol><li><b>\u63A2\u7D22\uFF1A</b>\u62D6\u52A8\u5173\u8282\uFF0C\u89C2\u5BDF XYZ \u548C\u5DE5\u5177\u59FF\u6001\u3002\u6A59\u8272\u7EBF\u8868\u793A\u5DE5\u5177\u8F68\u8FF9\uFF0C\u53EF\u663E\u793A\u3001\u9690\u85CF\u6216\u6E05\u9664\u3002</li><li><b>\u6269\u5C55\uFF1A</b>\u4F9D\u6B21\u6DFB\u52A0\u8155\u90E8\u504F\u8F6C J4\u3001\u8155\u90E8\u4FEF\u4EF0 J5 \u548C\u5DE5\u5177\u6EDA\u8F6C J6\u3002\u6BCF\u79CD\u5173\u8282\u6570\u91CF\u72EC\u7ACB\u4FDD\u5B58\u7A0B\u5E8F\uFF0C\u5207\u6362\u65F6\u56DE\u5230\u521D\u59CB\u4F4D\u59FF\u3002</li><li><b>\u793A\u6559\uFF1A</b>\u8BB0\u5F55\u4F4D\u7F6E\uFF0C\u91CD\u547D\u540D\u548C\u6392\u5E8F\u6B65\u9AA4\uFF0C\u8BBE\u7F6E\u65F6\u957F\u5E76\u8FD0\u884C\u3002</li><li><b>\u5B9A\u4F4D\uFF1A</b>\u8F93\u5165 XYZ\u3002\u516D\u5173\u8282\u6A21\u5F0F\u8FD8\u53EF\u6307\u5B9A\u6EDA\u8F6C\u3001\u4FEF\u4EF0\u548C\u504F\u822A\u3002\u4F7F\u7528\u5F53\u524D\u4F4D\u59FF\u53EF\u83B7\u5F97\u53EF\u8FBE\u7684\u8D77\u59CB\u76EE\u6807\u3002</li><li><b>\u6311\u6218\uFF1A</b>\u4F9D\u6B21\u5230\u8FBE A \u2192 B \u2192 C\uFF0C\u6BCF\u6B65\u7EC8\u70B9\u8DDD\u76EE\u6807\u4E0D\u8D85\u8FC7 15 \u6BEB\u7C73\u3002\u6BD4\u8F83\u4E0D\u540C\u5173\u8282\u6570\u91CF\u7684\u52A8\u4F5C\u3002</li></ol><p><b>\u5750\u6807\u7CFB\uFF1A</b>\u4E16\u754C Z \u5411\u4E0A\u3002J1 \u7ED5\u4E16\u754C Z \u65CB\u8F6C\uFF0CJ2\u3001J3 \u5411\u4E0A\u4FEF\u4EF0\u3002\u65B0\u589E\u8F74\u968F\u7236\u5173\u8282\u8F6C\u52A8\uFF1AJ4 \u7ED5\u5C40\u90E8 Z\uFF0CJ5 \u7ED5\u5C40\u90E8 \u2212Y\uFF0CJ6 \u7ED5\u5C40\u90E8 X\u3002\u5DE5\u5177\u7AEF\u7684\u5F69\u8272\u8F74\u548C\u77E9\u5F62\u5957\u73AF\u663E\u793A\u59FF\u6001\u3002</p><p><b>\u59FF\u6001\uFF1A</b>\u91C7\u7528 Rz(\u504F\u822A) Ry(\u4FEF\u4EF0) Rx(\u6EDA\u8F6C)\u3002\u6B27\u62C9\u89D2\u53EF\u5728 \xB1180\xB0 \u8DF3\u53D8\uFF0C\u5728\u4FEF\u4EF0 \xB190\xB0 \u65F6\u4E0D\u552F\u4E00\u3002\u516D\u5173\u8282\u53EF\u5728\u975E\u5947\u5F02\u53EF\u8FBE\u533A\u57DF\u63A7\u5236\u4F4D\u7F6E\u4E0E\u59FF\u6001\uFF0C\u4F46\u5E76\u975E\u6240\u6709\u76EE\u6807\u90FD\u53EF\u8FBE\u3002</p><p><b>\u8FD0\u52A8\uFF1A</b>\u5173\u8282\u540C\u6B65\u8F6C\u52A8\uFF0C\u5DE5\u5177\u901A\u5E38\u8D70\u66F2\u7EBF\u30024\u20136 \u5173\u8282\u4F7F\u7528\u6570\u503C\u6C42\u89E3\uFF0C\u672A\u627E\u5230\u89E3\u4E0D\u4EE3\u8868\u76EE\u6807\u7EDD\u5BF9\u4E0D\u53EF\u8FBE\u3002\u53EF\u5C1D\u8BD5\u6539\u53D8\u8D77\u59CB\u4F4D\u59FF\uFF1B\u82E5\u8DEF\u5F84\u7A7F\u8FC7\u684C\u9762\uFF0C\u53EF\u6DFB\u52A0\u62AC\u9AD8\u7684\u4E2D\u95F4\u4F4D\u7F6E\u3002</p><p class="guide-note">\u8FD0\u52A8\u5B66\u6559\u5B66\u6A21\u578B\uFF1A\u7403\u4F53\u53EA\u662F\u53EF\u8FBE\u5916\u8FB9\u754C\u3002\u684C\u9762\u68C0\u67E5\u91C7\u7528\u7AEF\u70B9\u95F4\u9699\u8FD1\u4F3C\uFF0C\u4E0D\u6A21\u62DF\u81EA\u8EAB\u6216\u5E95\u5EA7\u78B0\u649E\u3001\u8D1F\u8F7D\u3001\u52A8\u529B\u5B66\uFF0C\u4E5F\u4E0D\u63A7\u5236\u786C\u4EF6\u3002</p>'});Object.assign(Lt,{workspace:"LIVE WORKSPACE",title:"Pick. Lift. Place.",toolStation:"01 / TOOL & I/O",buildStation:"02 / BUILD THE ARM",endEffector:"End effector",gripper:"\u2161  Parallel gripper",vacuum:"\u25C9  Vacuum cup",magnet:"\u2229  Magnetic gripper",outputSignal:"Tool command",inputSignal:"Object held",activate:"ON \xB7 Activate",release:"OFF \xB7 Release",useSix:"Use 6 joints",separatePrograms:"Each tool + arm size keeps its own program.",runReset:"Run resets the arm and objects, then executes your steps.",signalValue:"Signal value",addOutput:"\uFF0B Set DO1",addWait:"\uFF0B Wait DI1",addDelay:"\uFF0B Delay",setOutput:"Set tool output",waitInput:"Wait for object sensor",delay:"Delay",timeout:"Timeout",instructionAdded:"Instruction added. Set its value and duration in the sequence.",empty:"Record a move. Add tool commands.<br>Confirm pickup with a Wait DI1 step.",resetTask:"Reset scene",gripperTask:"Block transfer",vacuumTask:"Fragile tile transfer",magnetTask:"Steel recovery",gripperMission:"Deliver both wooden blocks to their matching pads. B starts on a 60 mm pedestal: lift clear before travelling.",vacuumMission:"Move both smooth tiles to their matching pads. B is on a 75 mm pedestal. Keep the suction cup aligned with the top surface.",magnetMission:"Recover two steel pucks onto their matching pads. B is raised 90 mm above the table. Align the magnetic face and clear the pedestal.",gripperDescription:"DO1 closes / opens the jaws. DI1 turns on only after a block is actually grasped.",vacuumDescription:"DO1 switches suction on / off. A smooth surface and an approach within 85\xB0 of vertical are required. Six joints recommended.",magnetDescription:"DO1 engages / releases the magnet. Steel and alignment within 85\xB0 of vertical are required. Six joints recommended.",taskRules:"Pick within 25 mm of the top-center contact. Carry clear of the pedestal. Release within 8 mm of the surface, with the whole object inside its matching pad.",taskReady:"Two objects. Two destinations. Plan your approach, pickup, lift, and release.",taskWon:"Challenge complete \u2014 both objects placed correctly!",delivered:"Delivered \u2713",held:"Held \xB7 DI1 ON",raisedItem:"On pedestal",tableItem:"On table",pickup:"Pick",destination:"Place",approach:"Approach",coordinatesFilled:"Target fields filled. Approach from above and record the moves you need.",grasped:"Object held \u2014 DI1 is ON. Lift before travelling.",placed:"Object placed gently inside its matching target.",outsideTarget:"Released outside the matching pad or at an unsuitable angle. Reposition and try again.",dropped:"Dropped from too high. It does not count: pick up and place gently.",noContact:"Tool ON, but nothing held. Move within 25 mm of the object\u2019s top center; the active tool will pick it up automatically.",releasedEmpty:"Tool released. DI1 is OFF.",wrongMaterial:"This material is incompatible with the selected tool.",alignment:"Tool face is tilted too far. Point the working face generally down toward the object (within 85\xB0 of vertical).",tooWide:"Object exceeds the gripper opening.",obstacle:"Movement blocked: the arm would strike the pedestal. Raise or reroute the arm.",payloadCollision:"Movement blocked: the carried object would hit the table, pedestal, or another object.",waitTimeout:"Wait timed out: DI1 did not reach the requested state. Check tool contact and the ON instruction.",sixForExample:"This example needs six joints for level contact. Choose \u201CUse 6 joints\u201D on the right.",loadedTask:"Pick-and-place example loaded. Run it, then modify its moves and I/O steps.",replaceImport:"Replace the saved program for this tool and arm size? Other programs will be kept.",complete:"Program complete. Check the task: both objects must be released inside their matching pads."});Object.assign(Nt,{workspace:"\u5B9E\u65F6\u5DE5\u4F5C\u7A7A\u95F4",title:"\u6293\u53D6 \xB7 \u62AC\u5347 \xB7 \u653E\u7F6E",toolStation:"01 / \u5DE5\u5177\u4E0E I/O",buildStation:"02 / \u7EC4\u88C5\u673A\u68B0\u81C2",endEffector:"\u672B\u7AEF\u6267\u884C\u5668",gripper:"\u2161  \u5E73\u884C\u5939\u722A",vacuum:"\u25C9  \u771F\u7A7A\u5438\u76D8",magnet:"\u2229  \u78C1\u529B\u5939\u5177",outputSignal:"\u5DE5\u5177\u6307\u4EE4",inputSignal:"\u5DF2\u6293\u4F4F\u7269\u4F53",activate:"ON \xB7 \u542F\u52A8",release:"OFF \xB7 \u91CA\u653E",useSix:"\u4F7F\u7528\u516D\u5173\u8282",separatePrograms:"\u6BCF\u79CD\u5DE5\u5177\u4E0E\u5173\u8282\u6570\u91CF\u7EC4\u5408\u5206\u522B\u4FDD\u5B58\u7A0B\u5E8F\u3002",runReset:"\u8FD0\u884C\u65F6\u91CD\u7F6E\u673A\u68B0\u81C2\u548C\u7269\u4F53\uFF0C\u518D\u6267\u884C\u7A0B\u5E8F\u3002",signalValue:"\u4FE1\u53F7\u503C",addOutput:"\uFF0B \u8BBE\u7F6E DO1",addWait:"\uFF0B \u7B49\u5F85 DI1",addDelay:"\uFF0B \u5EF6\u65F6",setOutput:"\u8BBE\u7F6E\u5DE5\u5177\u8F93\u51FA",waitInput:"\u7B49\u5F85\u7269\u4F53\u4F20\u611F\u5668",delay:"\u5EF6\u65F6",timeout:"\u8D85\u65F6",instructionAdded:"\u5DF2\u6DFB\u52A0\u6307\u4EE4\u3002\u53EF\u5728\u7A0B\u5E8F\u4E2D\u8C03\u6574\u4FE1\u53F7\u503C\u548C\u65F6\u957F\u3002",empty:"\u8BB0\u5F55\u79FB\u52A8\uFF0C\u6DFB\u52A0\u5DE5\u5177\u6307\u4EE4\u3002<br>\u901A\u8FC7\u7B49\u5F85 DI1 \u786E\u8BA4\u6293\u53D6\u6210\u529F\u3002",resetTask:"\u91CD\u7F6E\u573A\u666F",gripperTask:"\u79EF\u6728\u642C\u8FD0",vacuumTask:"\u6613\u788E\u8584\u7247\u642C\u8FD0",magnetTask:"\u94A2\u4EF6\u56DE\u6536",gripperMission:"\u5C06\u4E24\u5757\u6728\u5757\u653E\u5165\u5BF9\u5E94\u533A\u57DF\u3002B \u4F4D\u4E8E 60 \u6BEB\u7C73\u9AD8\u53F0\u4E0A\uFF0C\u6A2A\u5411\u79FB\u52A8\u524D\u5148\u62AC\u5347\u3002",vacuumMission:"\u5C06\u4E24\u5757\u5149\u6ED1\u8584\u7247\u79FB\u81F3\u5BF9\u5E94\u533A\u57DF\u3002B \u4F4D\u4E8E 75 \u6BEB\u7C73\u9AD8\u53F0\u4E0A\uFF0C\u5438\u76D8\u987B\u5BF9\u51C6\u7269\u4F53\u9876\u9762\u3002",magnetMission:"\u5C06\u4E24\u4E2A\u94A2\u4EF6\u653E\u5165\u5BF9\u5E94\u533A\u57DF\u3002B \u9AD8\u4E8E\u684C\u9762 90 \u6BEB\u7C73\uFF0C\u4FDD\u6301\u78C1\u9762\u5E73\u6B63\u5E76\u907F\u5F00\u9AD8\u53F0\u3002",gripperDescription:"DO1 \u63A7\u5236\u5939\u722A\u95ED\u5408\u4E0E\u5F20\u5F00\u3002\u53EA\u6709\u5B9E\u9645\u6293\u4F4F\u6728\u5757\uFF0CDI1 \u624D\u53D8\u4E3A ON\u3002",vacuumDescription:"DO1 \u63A7\u5236\u5438\u9644\u4E0E\u91CA\u653E\u3002\u9700\u8981\u5149\u6ED1\u8868\u9762\uFF0C\u5DE5\u5177\u4E0E\u7AD6\u76F4\u65B9\u5411\u5939\u89D2\u4E0D\u8D85\u8FC7 85\xB0\u3002\u5EFA\u8BAE\u4F7F\u7528\u516D\u5173\u8282\u3002",magnetDescription:"DO1 \u63A7\u5236\u78C1\u529B\u5438\u5408\u4E0E\u91CA\u653E\u3002\u4EC5\u9002\u7528\u4E8E\u94A2\u4EF6\uFF0C\u5BF9\u9F50\u89D2\u5EA6\u4E0D\u8D85\u8FC7 85\xB0\u3002\u5EFA\u8BAE\u4F7F\u7528\u516D\u5173\u8282\u3002",taskRules:"\u5DE5\u5177\u987B\u8DDD\u9876\u9762\u4E2D\u5FC3 25 \u6BEB\u7C73\u4EE5\u5185\u3002\u642C\u8FD0\u65F6\u907F\u5F00\u9AD8\u53F0\uFF0C\u5728\u652F\u6491\u9762\u4E0A\u65B9 8 \u6BEB\u7C73\u4EE5\u5185\u8F7B\u653E\uFF0C\u7269\u4F53\u987B\u5B8C\u5168\u4F4D\u4E8E\u5BF9\u5E94\u533A\u57DF\u5185\u3002",taskReady:"\u4E24\u4E2A\u7269\u4F53\uFF0C\u4E24\u4E2A\u76EE\u6807\u3002\u89C4\u5212\u63A5\u8FD1\u3001\u6293\u53D6\u3001\u62AC\u5347\u548C\u91CA\u653E\u3002",taskWon:"\u6311\u6218\u5B8C\u6210\uFF1A\u4E24\u4E2A\u7269\u4F53\u5747\u5DF2\u6B63\u786E\u653E\u7F6E\uFF01",delivered:"\u5DF2\u9001\u8FBE \u2713",held:"\u5DF2\u6293\u4F4F \xB7 DI1 ON",raisedItem:"\u4F4D\u4E8E\u9AD8\u53F0",tableItem:"\u4F4D\u4E8E\u684C\u9762",pickup:"\u6293\u53D6",destination:"\u653E\u7F6E",approach:"\u63A5\u8FD1",coordinatesFilled:"\u5DF2\u586B\u5165\u76EE\u6807\u5750\u6807\u3002\u8BF7\u4ECE\u4E0A\u65B9\u63A5\u8FD1\u5E76\u8BB0\u5F55\u6240\u9700\u52A8\u4F5C\u3002",grasped:"\u5DF2\u6293\u4F4F\u7269\u4F53\uFF0CDI1 \u4E3A ON\u3002\u8BF7\u5148\u62AC\u5347\u518D\u6A2A\u5411\u79FB\u52A8\u3002",placed:"\u7269\u4F53\u5DF2\u8F7B\u653E\u5728\u5BF9\u5E94\u76EE\u6807\u533A\u57DF\u5185\u3002",outsideTarget:"\u7269\u4F53\u672A\u4F4D\u4E8E\u5BF9\u5E94\u533A\u57DF\u5185\uFF0C\u6216\u89D2\u5EA6\u4E0D\u5408\u9002\u3002\u8BF7\u91CD\u65B0\u6293\u53D6\u8C03\u6574\u3002",dropped:"\u91CA\u653E\u9AD8\u5EA6\u8FC7\u9AD8\uFF0C\u4E0D\u8BA1\u4E3A\u5B8C\u6210\u3002\u8BF7\u91CD\u65B0\u6293\u53D6\u5E76\u8F7B\u653E\u3002",noContact:"\u5DE5\u5177\u5DF2\u5F00\u542F\uFF0C\u4F46\u672A\u6293\u4F4F\u7269\u4F53\u3002\u8BF7\u79FB\u52A8\u5230\u7269\u4F53\u9876\u9762\u4E2D\u5FC3 25 \u6BEB\u7C73\u5185\uFF0C\u5F00\u542F\u7684\u5DE5\u5177\u4F1A\u81EA\u52A8\u6293\u53D6\u3002",releasedEmpty:"\u5DE5\u5177\u5DF2\u91CA\u653E\uFF0CDI1 \u4E3A OFF\u3002",wrongMaterial:"\u7269\u4F53\u6750\u8D28\u4E0D\u9002\u7528\u4E8E\u5F53\u524D\u5DE5\u5177\u3002",alignment:"\u5DE5\u5177\u503E\u89D2\u8FC7\u5927\u3002\u8BF7\u5C06\u5DE5\u4F5C\u9762\u5927\u81F4\u671D\u4E0B\uFF0C\u504F\u79BB\u7AD6\u76F4\u65B9\u5411\u4E0D\u8D85\u8FC7 85\xB0\u3002",tooWide:"\u7269\u4F53\u5BBD\u5EA6\u8D85\u8FC7\u5939\u722A\u5F00\u53E3\u3002",obstacle:"\u8DEF\u5F84\u88AB\u963B\u6B62\uFF1A\u673A\u68B0\u81C2\u4F1A\u649E\u5230\u9AD8\u53F0\u3002\u8BF7\u62AC\u9AD8\u6216\u7ED5\u884C\u3002",payloadCollision:"\u8DEF\u5F84\u88AB\u963B\u6B62\uFF1A\u6240\u643A\u7269\u4F53\u4F1A\u649E\u5230\u684C\u9762\u3001\u9AD8\u53F0\u6216\u5176\u4ED6\u7269\u4F53\u3002",waitTimeout:"\u7B49\u5F85\u8D85\u65F6\uFF1ADI1 \u672A\u8FBE\u5230\u6307\u5B9A\u72B6\u6001\u3002\u8BF7\u68C0\u67E5\u5DE5\u5177\u63A5\u89E6\u4E0E ON \u6307\u4EE4\u3002",sixForExample:"\u6B64\u793A\u4F8B\u9700\u8981\u516D\u5173\u8282\u4FDD\u6301\u5E73\u6B63\u63A5\u89E6\u3002\u8BF7\u70B9\u51FB\u53F3\u4FA7\u201C\u4F7F\u7528\u516D\u5173\u8282\u201D\u3002",loadedTask:"\u5DF2\u52A0\u8F7D\u642C\u8FD0\u793A\u4F8B\u3002\u8FD0\u884C\u540E\uFF0C\u53EF\u4FEE\u6539\u52A8\u4F5C\u4E0E I/O \u6307\u4EE4\u3002",replaceImport:"\u66FF\u6362\u6B64\u5DE5\u5177\u53CA\u5173\u8282\u6570\u91CF\u5BF9\u5E94\u7684\u5DF2\u5B58\u7A0B\u5E8F\uFF1F\u5176\u4ED6\u7A0B\u5E8F\u5C06\u4FDD\u7559\u3002",complete:"\u7A0B\u5E8F\u5B8C\u6210\u3002\u8BF7\u68C0\u67E5\u4E24\u4E2A\u7269\u4F53\u662F\u5426\u5747\u91CA\u653E\u5728\u5BF9\u5E94\u533A\u57DF\u5185\u3002"});Lt.guidebody="<ol><li><b>Choose a tool:</b> gripper, suction cup, or magnet. Each has two objects, matching target pads, and a raised pedestal. The gripper task works with three joints; six joints make the other tools easier to align.</li><li><b>Plan the route:</b> click Approach, Pick, or Place in the challenge to fill XYZ fields. These buttons do not move the arm. Use a raised travel position before moving sideways.</li><li><b>Teach movement:</b> move with joint sliders or XYZ, then record the pose. Controls are on the left; arm building and program steps are on the right.</li><li><b>Program the tool:</b> add DO1 ON to grip, Wait DI1 ON to confirm pickup, and DO1 OFF to release. Wait instructions stop the program on timeout. Delay adds a pause. Set the signal value before adding an instruction, or edit it in the sequence.</li><li><b>Place carefully:</b> the full object must fit its matching pad. Release no more than 8 mm above the surface. A drop does not count. Reset scene restores the objects; Run resets them automatically for repeatable programs.</li></ol><p><b>Commands versus feedback:</b> DO1 is a request; DI1 means an object is held. Closing an empty gripper or missing the suction surface leaves DI1 OFF. An active tool keeps trying as you move into the pickup zone. Stop keeps the current tool state and held object.</p><p><b>Frames and tools:</b> XYZ is the working point, 40 mm outward from the wrist flange. Align it with the object\u2019s top center. The tool mounts at its rear; its working face points outward along local \u2212Z. Vacuum and magnet require a face within 85\xB0 of vertical. In six-joint mode, roll 0\xB0, pitch 0\xB0, and a yaw facing the target give a useful starting pose. Grasped objects follow the tool as rigid bodies.</p><p><b>Limits:</b> joints interpolate together, so the path curves. Pedestal checks use inflated link segments; held objects use conservative world-aligned bounding boxes. Gripper contact and material/seal sensors are simplified. Objects settle immediately on release; falling dynamics, contact forces, arm self-collision and base collision are not modeled. This is a teaching simulator, not a hardware controller.</p><p><b>Programs:</b> each tool/arm combination has its own saved sequence. Switching configurations resets the scene but preserves other sequences. Export files include the tool, joint count, and typed instructions. Earlier motion-only programs remain importable.</p>";Nt.guidebody="<ol><li><b>\u9009\u62E9\u5DE5\u5177\uFF1A</b>\u5939\u722A\u3001\u5438\u76D8\u6216\u78C1\u529B\u5939\u5177\u3002\u6BCF\u9879\u6311\u6218\u90FD\u6709\u4E24\u4E2A\u7269\u4F53\u3001\u5BF9\u5E94\u76EE\u6807\u533A\u548C\u4E00\u4E2A\u9AD8\u53F0\u3002\u5939\u722A\u6311\u6218\u53EF\u7528\u4E09\u5173\u8282\uFF0C\u5176\u4F59\u5DE5\u5177\u5EFA\u8BAE\u4F7F\u7528\u516D\u5173\u8282\u5BF9\u9F50\u3002</li><li><b>\u89C4\u5212\u8DEF\u5F84\uFF1A</b>\u70B9\u51FB\u201C\u63A5\u8FD1\u3001\u6293\u53D6\u3001\u653E\u7F6E\u201D\u586B\u5165\u5750\u6807\uFF0C\u4E0D\u4F1A\u81EA\u52A8\u79FB\u52A8\u3002\u6A2A\u5411\u642C\u8FD0\u524D\u5148\u62AC\u5347\u3002</li><li><b>\u793A\u6559\uFF1A</b>\u5DE6\u4FA7\u7528\u6ED1\u5757\u6216 XYZ \u79FB\u52A8\u5E76\u8BB0\u5F55\u3002\u53F3\u4FA7\u7EC4\u88C5\u673A\u68B0\u81C2\u4E0E\u7F16\u6392\u6B65\u9AA4\u3002</li><li><b>\u5DE5\u5177\u7F16\u7A0B\uFF1A</b>\u6DFB\u52A0 DO1 ON \u6293\u53D6\u3001\u7B49\u5F85 DI1 ON \u786E\u8BA4\u3001DO1 OFF \u91CA\u653E\u3002\u7B49\u5F85\u8D85\u65F6\u4F1A\u505C\u6B62\u7A0B\u5E8F\u3002\u5EF6\u65F6\u53EF\u63D2\u5165\u505C\u987F\u3002</li><li><b>\u8F7B\u653E\uFF1A</b>\u7269\u4F53\u987B\u5B8C\u5168\u843D\u5728\u5BF9\u5E94\u533A\u57DF\uFF0C\u5728\u652F\u6491\u9762\u4E0A\u65B9 8 \u6BEB\u7C73\u4EE5\u5185\u91CA\u653E\u3002\u9AD8\u5904\u6389\u843D\u4E0D\u8BA1\u5206\u3002\u6BCF\u6B21\u8FD0\u884C\u90FD\u4F1A\u5148\u91CD\u7F6E\u573A\u666F\u3002</li></ol><p><b>\u6307\u4EE4\u4E0E\u53CD\u9988\uFF1A</b>DO1 \u662F\u8BF7\u6C42\uFF0CDI1 \u8868\u793A\u5B9E\u9645\u6293\u4F4F\u7269\u4F53\u3002\u7A7A\u5939\u722A\u95ED\u5408\u6216\u5438\u76D8\u672A\u8D34\u5408\uFF0CDI1 \u4ECD\u4E3A OFF\u3002\u5DE5\u5177\u5F00\u542F\u65F6\u4F1A\u6301\u7EED\u68C0\u6D4B\uFF0C\u79FB\u5165\u6293\u53D6\u8303\u56F4\u5373\u53EF\u3002\u505C\u6B62\u65F6\u4FDD\u6301\u5F53\u524D\u5DE5\u5177\u72B6\u6001\u4E0E\u6240\u6301\u7269\u4F53\u3002</p><p><b>\u5DE5\u5177\u5750\u6807\uFF1A</b>XYZ \u4E3A\u8155\u90E8\u6CD5\u5170\u5411\u5916\u5EF6\u4F38 40 \u6BEB\u7C73\u5904\u7684\u5DE5\u5177\u5DE5\u4F5C\u70B9\uFF0C\u8BF7\u5C06\u5B83\u5BF9\u51C6\u7269\u4F53\u9876\u9762\u4E2D\u5FC3\u3002\u5DE5\u5177\u540E\u7AEF\u5B89\u88C5\u4E8E\u6CD5\u5170\uFF0C\u5DE5\u4F5C\u9762\u6CBF\u5C40\u90E8 \u2212Z \u671D\u5916\u3002\u5438\u76D8\u548C\u78C1\u9762\u4E0E\u7AD6\u76F4\u65B9\u5411\u7684\u5939\u89D2\u987B\u5C0F\u4E8E 85\xB0\u3002\u516D\u5173\u8282\u53EF\u5148\u8BBE\u6EDA\u8F6C 0\xB0\u3001\u4FEF\u4EF0 0\xB0\u3001\u504F\u822A\u671D\u5411\u76EE\u6807\u3002\u88AB\u6293\u4F4F\u7684\u7269\u4F53\u968F\u5DE5\u5177\u521A\u6027\u8FD0\u52A8\u3002</p><p><b>\u6A21\u578B\u9650\u5236\uFF1A</b>\u5173\u8282\u540C\u6B65\u63D2\u503C\uFF0C\u8F68\u8FF9\u901A\u5E38\u662F\u66F2\u7EBF\u3002\u8FDE\u6746\u4F7F\u7528\u81A8\u80C0\u7EBF\u6BB5\u68C0\u67E5\u9AD8\u53F0\u78B0\u649E\uFF1B\u6240\u6301\u7269\u4F53\u4F7F\u7528\u4FDD\u5B88\u7684\u4E16\u754C\u5750\u6807\u5305\u56F4\u76D2\u3002\u5939\u6301\u63A5\u89E6\u548C\u6750\u8D28\u4F20\u611F\u5668\u7ECF\u8FC7\u7B80\u5316\u3002\u91CA\u653E\u540E\u7ACB\u5373\u843D\u5230\u652F\u6491\u9762\uFF0C\u4E0D\u6A21\u62DF\u6389\u843D\u52A8\u529B\u5B66\u3001\u63A5\u89E6\u529B\u3001\u81EA\u8EAB\u6216\u5E95\u5EA7\u78B0\u649E\uFF0C\u4E5F\u4E0D\u63A7\u5236\u771F\u5B9E\u786C\u4EF6\u3002</p><p><b>\u7A0B\u5E8F\uFF1A</b>\u5404\u5DE5\u5177\u4E0E\u5173\u8282\u6570\u91CF\u5206\u522B\u4FDD\u5B58\u3002\u5207\u6362\u4F1A\u91CD\u7F6E\u573A\u666F\uFF0C\u4F46\u4E0D\u5220\u9664\u5176\u4ED6\u7A0B\u5E8F\u3002\u5BFC\u51FA\u6587\u4EF6\u5305\u542B\u5DE5\u5177\u3001\u5173\u8282\u6570\u91CF\u548C\u6307\u4EE4\u7C7B\u578B\uFF0C\u4E5F\u53EF\u5BFC\u5165\u65E7\u7248\u7EAF\u79FB\u52A8\u7A0B\u5E8F\u3002</p>";Lt.toolChanged="Tool and challenge changed. Objects reset; this tool\u2019s saved program is ready.";Nt.toolChanged="\u5DF2\u5207\u6362\u5DE5\u5177\u4E0E\u6311\u6218\u3002\u7269\u4F53\u5DF2\u91CD\u7F6E\uFF0C\u5F53\u524D\u5DE5\u5177\u7684\u5DF2\u5B58\u7A0B\u5E8F\u5DF2\u5C31\u7EEA\u3002";Lt.toolHelp="Tool requirements";Nt.toolHelp="\u5DE5\u5177\u4F7F\u7528\u8981\u6C42";Lt.gripperDescription="Training assist: approach within 25 mm of the top center. DO1 ON keeps trying to grip; DI1 confirms pickup.";Nt.gripperDescription="\u6559\u5B66\u8F85\u52A9\uFF1A\u63A5\u8FD1\u9876\u9762\u4E2D\u5FC3 25 \u6BEB\u7C73\u5185\u3002DO1 \u5F00\u542F\u540E\u6301\u7EED\u5C1D\u8BD5\u6293\u53D6\uFF0CDI1 \u786E\u8BA4\u6293\u53D6\u3002";Lt.taskRules="Training assist ON: pickup within 25 mm of the top center; nearby objects seat onto the tool. DO1 ON keeps trying as you move. Lift clear, then release within 8 mm of the matching pad.";Nt.taskRules="\u6559\u5B66\u8F85\u52A9\u5DF2\u5F00\u542F\uFF1A\u8DDD\u9876\u9762\u4E2D\u5FC3 25 \u6BEB\u7C73\u5185\u53EF\u6293\u53D6\uFF0C\u7269\u4F53\u4F1A\u8F7B\u5FAE\u5438\u9644\u5230\u5DE5\u5177\u4F4D\u7F6E\u3002DO1 \u5F00\u542F\u540E\u79FB\u52A8\u65F6\u6301\u7EED\u68C0\u6D4B\u3002\u5148\u62AC\u5347\u907F\u969C\uFF0C\u518D\u5728\u5BF9\u5E94\u533A\u57DF\u4E0A\u65B9 8 \u6BEB\u7C73\u5185\u91CA\u653E\u3002";Lt.commands="Commands";Nt.commands="\u6307\u4EE4";Lt.commandsHint="Add steps to your movement program.";Nt.commandsHint="\u5C06\u52A8\u4F5C\u3001\u4FE1\u53F7\u548C\u7B49\u5F85\u6DFB\u52A0\u5230\u7A0B\u5E8F\u3002";Object.assign(Lt,{movementControl:"Movement control",modeSliders:"Sliders",modeXYZ:"XYZ",modeJog:"Buttons",jogTitle:"Jog the tool",jogHelp:"One click = one step in world coordinates.",linearStep:"Move step",angularStep:"Rotate step",jogLocked:"Add joints with + to reach six axes for Rx, Ry and Rz rotation at a fixed XYZ.",jogOrientation:"XYZ keeps tool orientation. Rx / Ry / Rz adjust roll / pitch / yaw at the current XYZ."});Object.assign(Nt,{movementControl:"\u79FB\u52A8\u63A7\u5236",modeSliders:"\u6ED1\u5757",modeXYZ:"XYZ \u5750\u6807",modeJog:"\u6309\u94AE",jogTitle:"\u70B9\u52A8\u5DE5\u5177",jogHelp:"\u6BCF\u6B21\u70B9\u51FB\u6309\u4E16\u754C\u5750\u6807\u79FB\u52A8\u4E00\u6B65\u3002",linearStep:"\u79FB\u52A8\u6B65\u957F",angularStep:"\u65CB\u8F6C\u6B65\u957F",jogLocked:"\u4F7F\u7528 + \u6DFB\u52A0\u81F3\u516D\u4E2A\u5173\u8282\uFF0C\u5373\u53EF\u5728\u56FA\u5B9A XYZ \u4F4D\u7F6E\u8C03\u6574 Rx\u3001Ry\u3001Rz\u3002",jogOrientation:"XYZ \u4FDD\u6301\u5DE5\u5177\u59FF\u6001\uFF1BRx / Ry / Rz \u5728\u5F53\u524D\u4F4D\u7F6E\u8C03\u6574\u6EDA\u8F6C / \u4FEF\u4EF0 / \u504F\u822A\u3002"});Lt.sixForExample="This example needs six joints. Add joints with + in Build your arm.";Nt.sixForExample="\u6B64\u793A\u4F8B\u9700\u8981\u516D\u5173\u8282\uFF0C\u8BF7\u5728\u7EC4\u88C5\u673A\u68B0\u81C2\u4E2D\u4F7F\u7528 + \u6DFB\u52A0\u5173\u8282\u3002";Lt.controlsPanel="Controls";Lt.programPanel="Build & program";Nt.controlsPanel="\u79FB\u52A8\u63A7\u5236";Nt.programPanel="\u7EC4\u88C5\u4E0E\u7A0B\u5E8F";Lt.programPanel="Program";Nt.programPanel="\u52A8\u4F5C\u7A0B\u5E8F";Lt.liveToolControl="Tool I/O";Nt.liveToolControl="\u5DE5\u5177 I/O";Lt.robotStatus="ROBOT STATUS";Nt.robotStatus="\u673A\u68B0\u81C2\u72B6\u6001";function Ou(i,e="start"){let t=i.toLowerCase();return/collis|obstacle|crash|clearance|碰撞|障碍|撞|间隙/.test(t)?"collision":/program|record|sequence|程序|编程|记录|顺序/.test(t)?"program":/pick|grip|release|抓|拾|释放/.test(t)?"pickup":/mov|xyz|jog|slider|移动|点动|滑块/.test(t)?"move":/next|again|explain|step|下一|再|解释|步骤/.test(t)?e:"start"}function ka(i,e={}){let t=e.language==="zh",n=(c,l)=>t?l:c;if(e.learning?.unlocked===!1&&e.learning.instruction)return{message:e.learning.instruction,highlight:e.learning.allowedControls?.[0]||"open-lesson"};if(e.learning?.unlocked===!1)return{message:n(`Start here:
1. Open Lesson in the top menu and explore the robot, watch the teacher demonstrate, then repeat the task with guidance.
2. Complete the Concept quiz and read the feedback.
3. The movement and programming controls then unlock. You can still orbit the 3D view now.`,`\u4ECE\u8FD9\u91CC\u5F00\u59CB\uFF1A
1. \u6253\u5F00\u9876\u90E8\u201C\u8BFE\u7A0B\u201D\uFF0C\u8BA4\u8BC6\u673A\u68B0\u81C2\uFF0C\u89C2\u770B\u8001\u5E08\u6F14\u793A\uFF0C\u518D\u8DDF\u7740\u5B8C\u6210\u4EFB\u52A1\u3002
2. \u5B8C\u6210\u201C\u6982\u5FF5\u6D4B\u9A8C\u201D\u5E76\u9605\u8BFB\u53CD\u9988\u3002
3. \u79FB\u52A8\u548C\u7F16\u7A0B\u63A7\u4EF6\u968F\u5373\u89E3\u9501\u3002\u73B0\u5728\u4ECD\u53EF\u65CB\u8F6C\u4E09\u7EF4\u89C6\u56FE\u3002`),highlight:"open-lesson"};if(e.quiz?.open&&!e.quiz.answered&&!e.quiz.completed)return{message:n(`Let\u2019s reason about the current quiz item first.
1. Find the yellow highlight and read the question.
2. Decide whether it describes a physical part, a position, a command, or feedback.
3. Choose an answer; the quiz will explain it. We can work through movement strategies after this check.`,`\u5148\u601D\u8003\u5F53\u524D\u6D4B\u9A8C\u9898\uFF1A
1. \u627E\u5230\u9EC4\u8272\u9AD8\u4EAE\u5E76\u9605\u8BFB\u9898\u76EE\u3002
2. \u5224\u65AD\u5B83\u63CF\u8FF0\u7684\u662F\u90E8\u4EF6\u3001\u4F4D\u7F6E\u3001\u547D\u4EE4\u8FD8\u662F\u53CD\u9988\u3002
3. \u9009\u62E9\u7B54\u6848\uFF0C\u6D4B\u9A8C\u4F1A\u7ED9\u51FA\u89E3\u91CA\u3002\u4E4B\u540E\u6211\u4EEC\u518D\u8BA8\u8BBA\u79FB\u52A8\u7B56\u7565\u3002`),highlight:"open-quiz"};let s={start:[n("Your first pick-and-place plan","\u7B2C\u4E00\u6B21\u62FE\u53D6\u548C\u653E\u7F6E\u8BA1\u5212"),[n("Open Learning challenge and read the pickup and destination for object A. Start with the object on the table.","\u6253\u5F00\u201C\u5B66\u4E60\u6311\u6218\u201D\uFF0C\u67E5\u770B\u7269\u4F53 A \u7684\u62FE\u53D6\u70B9\u548C\u76EE\u6807\u533A\u3002\u5148\u7EC3\u4E60\u684C\u9762\u4E0A\u7684\u7269\u4F53\u3002"),n("Use Movement control \u2192 Buttons to move in small steps. First approach above the object, then lower toward its top center.","\u4F7F\u7528\u201C\u79FB\u52A8\u63A7\u5236 \u2192 \u6309\u94AE\u201D\u5C0F\u6B65\u79FB\u52A8\u3002\u5148\u5230\u7269\u4F53\u4E0A\u65B9\uFF0C\u518D\u4E0B\u964D\u5230\u9876\u90E8\u4E2D\u5FC3\u3002"),n("Activate DO1 (the tool command). Check DI1 (object-held feedback) is ON before lifting.","\u542F\u52A8 DO1\uFF08\u5DE5\u5177\u547D\u4EE4\uFF09\u3002\u786E\u8BA4 DI1\uFF08\u5DF2\u6293\u53D6\u53CD\u9988\uFF09\u4E3A ON \u540E\u518D\u62AC\u8D77\u3002"),n("Lift, travel above the destination, lower, and release. Practice manually before recording the sequence.","\u62AC\u8D77\u3001\u79FB\u5230\u76EE\u6807\u4E0A\u65B9\u3001\u4E0B\u964D\u3001\u91CA\u653E\u3002\u5148\u624B\u52A8\u7EC3\u4E60\uFF0C\u518D\u8BB0\u5F55\u7A0B\u5E8F\u3002")],"challenge-menu"],move:[n("Move one small step at a time","\u6BCF\u6B21\u79FB\u52A8\u4E00\u5C0F\u6B65"),[n("Open Movement control \u2192 Buttons. Select a small Move step, such as 5 mm. XYZ describes the tool\u2019s working point in millimeters.","\u6253\u5F00\u201C\u79FB\u52A8\u63A7\u5236 \u2192 \u6309\u94AE\u201D\uFF0C\u9009\u62E9\u8F83\u5C0F\u6B65\u957F\uFF0C\u4F8B\u5982 5 \u6BEB\u7C73\u3002XYZ \u662F\u5DE5\u5177\u5DE5\u4F5C\u70B9\u7684\u4F4D\u7F6E\uFF0C\u5355\u4F4D\u6BEB\u7C73\u3002"),n("Try Z + to raise the tool. Watch Tool position and the whole arm; X and Y move across the table.","\u5C1D\u8BD5 Z + \u62AC\u5347\u5DE5\u5177\u3002\u89C2\u5BDF\u201C\u5DE5\u5177\u4F4D\u7F6E\u201D\u548C\u6574\u6761\u673A\u68B0\u81C2\uFF1BX\u3001Y \u7528\u4E8E\u6CBF\u684C\u9762\u65B9\u5411\u79FB\u52A8\u3002"),n("Use XYZ mode for a specific destination: enter X, Y, Z, then Move to XYZ. The solver can reject unreachable poses.","\u8981\u6307\u5B9A\u76EE\u7684\u5730\uFF0C\u5207\u6362\u5230 XYZ \u6A21\u5F0F\uFF0C\u8F93\u5165 X\u3001Y\u3001Z\uFF0C\u518D\u70B9\u51FB\u79FB\u52A8\u3002\u65E0\u6CD5\u5230\u8FBE\u7684\u59FF\u6001\u53EF\u80FD\u88AB\u6C42\u89E3\u5668\u62D2\u7EDD\u3002"),n("Stop and inspect after each attempt. Even XYZ moves can curve because this trainer interpolates joint angles. A clear endpoint does not guarantee a clear path.","\u6BCF\u6B21\u5C1D\u8BD5\u540E\u505C\u4E0B\u6765\u89C2\u5BDF\u3002\u5373\u4F7F\u8F93\u5165 XYZ\uFF0C\u672C\u8BAD\u7EC3\u5668\u4E5F\u6309\u5173\u8282\u89D2\u5EA6\u63D2\u503C\uFF0C\u56E0\u6B64\u8DEF\u5F84\u53EF\u80FD\u5F2F\u66F2\u3002\u7EC8\u70B9\u65E0\u906E\u6321\u4E0D\u4EE3\u8868\u8DEF\u5F84\u65E0\u906E\u6321\u3002")],"jog-controls"],collision:[n("Recover from a blocked movement","\u5904\u7406\u88AB\u963B\u6321\u7684\u79FB\u52A8"),[n("Read Robot status: is the arm hitting the pedestal/table, or is the carried object colliding? If playback is paused, use Stop before manual controls.","\u9605\u8BFB\u201C\u673A\u68B0\u81C2\u72B6\u6001\u201D\uFF1A\u662F\u673A\u68B0\u81C2\u78B0\u5230\u9AD8\u53F0\u6216\u684C\u9762\uFF0C\u8FD8\u662F\u643A\u5E26\u7684\u7269\u4F53\u78B0\u649E\uFF1F\u82E5\u7A0B\u5E8F\u5904\u4E8E\u6682\u505C\u72B6\u6001\uFF0C\u5148\u70B9\u51FB\u505C\u6B62\uFF0C\u518D\u4F7F\u7528\u624B\u52A8\u63A7\u5236\u3002"),n("Use Top and Side on the view cube to inspect the gap. In Buttons mode, test a small Z + move. If it is rejected, try another configuration or a small move away; do not repeat the same blocked command.","\u7528\u89C6\u56FE\u7ACB\u65B9\u4F53\u7684\u9876\u90E8\u548C\u4FA7\u9762\u89C6\u89D2\u68C0\u67E5\u95F4\u9699\u3002\u5728\u6309\u94AE\u6A21\u5F0F\u5C1D\u8BD5\u5C0F\u5E45 Z +\uFF1B\u82E5\u88AB\u62D2\u7EDD\uFF0C\u5C1D\u8BD5\u5176\u4ED6\u59FF\u6001\u6216\u5C0F\u5E45\u8FDC\u79BB\u969C\u788D\uFF0C\u4E0D\u8981\u91CD\u590D\u540C\u4E00\u53D7\u963B\u547D\u4EE4\u3002"),n("Separate the route into lift \u2192 travel around/above the obstacle \u2192 lower. Leave room for every link and the whole held object. Added height alone may not clear the elbow.","\u5C06\u8DEF\u7EBF\u62C6\u6210\u62AC\u5347 \u2192 \u7ED5\u8FC7\u6216\u8D8A\u8FC7\u969C\u788D \u2192 \u4E0B\u964D\u3002\u4E3A\u6BCF\u6BB5\u8FDE\u6746\u548C\u6574\u4E2A\u7269\u4F53\u7559\u7A7A\u95F4\u3002\u53EA\u589E\u52A0\u9AD8\u5EA6\u4E0D\u4E00\u5B9A\u80FD\u8BA9\u8098\u90E8\u907F\u969C\u3002"),n("Record each successfully reached intermediate position, then move that step before the blocked segment in the program. Replay at 0.5\xD7 to inspect. Slowing down helps observation; it does not change the path or remove a collision.","\u8BB0\u5F55\u6BCF\u4E2A\u6210\u529F\u5230\u8FBE\u7684\u4E2D\u95F4\u4F4D\u7F6E\uFF0C\u5E76\u5C06\u8BE5\u6B65\u9AA4\u79FB\u5230\u7A0B\u5E8F\u4E2D\u53D7\u963B\u8DEF\u6BB5\u4E4B\u524D\u3002\u4EE5 0.5\xD7 \u56DE\u653E\u89C2\u5BDF\u3002\u51CF\u901F\u6709\u52A9\u89C2\u5BDF\uFF0C\u4F46\u4E0D\u4F1A\u6539\u53D8\u8DEF\u5F84\u6216\u6D88\u9664\u78B0\u649E\u3002")],"jog-controls"],program:[n("Turn a practiced route into a program","\u628A\u7EC3\u4E60\u8FC7\u7684\u8DEF\u7EBF\u53D8\u6210\u7A0B\u5E8F"),[n("Move above the pickup and choose Commands \u2192 Record current position. Lower to pickup and record again. A waypoint is simply a saved arm pose.","\u79FB\u52A8\u5230\u62FE\u53D6\u70B9\u4E0A\u65B9\uFF0C\u70B9\u51FB\u201C\u6307\u4EE4 \u2192 \u8BB0\u5F55\u5F53\u524D\u4F4D\u7F6E\u201D\uFF1B\u4E0B\u964D\u5230\u62FE\u53D6\u4F4D\u7F6E\u5E76\u518D\u6B21\u8BB0\u5F55\u3002\u8DEF\u5F84\u70B9\u5C31\u662F\u4FDD\u5B58\u7684\u673A\u68B0\u81C2\u59FF\u6001\u3002"),n("Set Signal value to ON, add Set DO1, then add Wait DI1. Recording a position does not record the tool signal.","\u628A\u201C\u4FE1\u53F7\u503C\u201D\u8BBE\u4E3A ON\uFF0C\u6DFB\u52A0\u201C\u8BBE\u7F6E DO1\u201D\uFF0C\u518D\u6DFB\u52A0\u201C\u7B49\u5F85 DI1\u201D\u3002\u8BB0\u5F55\u4F4D\u7F6E\u4E0D\u4F1A\u8BB0\u5F55\u5DE5\u5177\u4FE1\u53F7\u3002"),n("Record separate lift, travel and lowered placement positions. Set Signal value to OFF and add Set DO1 to release; then record a retreat.","\u5206\u522B\u8BB0\u5F55\u62AC\u5347\u3001\u6A2A\u79FB\u548C\u4E0B\u964D\u653E\u7F6E\u4F4D\u7F6E\u3002\u628A\u4FE1\u53F7\u503C\u8BBE\u4E3A OFF\uFF0C\u6DFB\u52A0\u8BBE\u7F6E DO1 \u91CA\u653E\u7269\u4F53\uFF0C\u7136\u540E\u8BB0\u5F55\u9000\u79BB\u52A8\u4F5C\u3002"),n("Check the step order and run at 0.5\xD7. Run resets the arm and objects; Stop keeps the current scene. If a step fails, fix that section instead of rebuilding everything.","\u68C0\u67E5\u6B65\u9AA4\u987A\u5E8F\u5E76\u4EE5 0.5\xD7 \u8FD0\u884C\u3002\u201C\u8FD0\u884C\u201D\u4F1A\u91CD\u7F6E\u673A\u68B0\u81C2\u548C\u7269\u4F53\uFF1B\u201C\u505C\u6B62\u201D\u4FDD\u7559\u5F53\u524D\u573A\u666F\u3002\u67D0\u6B65\u9AA4\u5931\u8D25\u65F6\uFF0C\u4FEE\u6539\u8BE5\u8DEF\u6BB5\u5373\u53EF\uFF0C\u65E0\u9700\u5168\u90E8\u91CD\u505A\u3002")],"record"],pickup:[n(e.input?"An object is held: plan the delivery":"Make the pickup work",e.input?"\u5DF2\u6293\u53D6\u7269\u4F53\uFF1A\u89C4\u5212\u653E\u7F6E":"\u5B8C\u6210\u62FE\u53D6"),e.input?[n("Keep DO1 ON while carrying.","\u642C\u8FD0\u65F6\u4FDD\u6301 DO1 \u4E3A ON\u3002"),n("Try a small upward move and check clearance around the entire object.","\u5C1D\u8BD5\u5C0F\u5E45\u62AC\u5347\u5E76\u68C0\u67E5\u6574\u4E2A\u7269\u4F53\u5468\u56F4\u7684\u95F4\u9699\u3002"),n("Move above the matching pad, then lower with the object level and fully inside the pad.","\u79FB\u5230\u5BF9\u5E94\u76EE\u6807\u533A\u4E0A\u65B9\uFF0C\u518D\u4E0B\u964D\uFF0C\u8BA9\u7269\u4F53\u4FDD\u6301\u5E73\u7A33\u5E76\u5B8C\u6574\u4F4D\u4E8E\u76EE\u6807\u533A\u5185\u3002"),n("Switch DO1 OFF near the surface. Check the delivery score before moving to the second object.","\u63A5\u8FD1\u8868\u9762\u65F6\u5173\u95ED DO1\u3002\u5148\u786E\u8BA4\u653E\u7F6E\u5F97\u5206\uFF0C\u518D\u5904\u7406\u7B2C\u4E8C\u4E2A\u7269\u4F53\u3002")]:[n("Approach from above the object using small moves. Aim the tool working point at the top center.","\u4ECE\u7269\u4F53\u4E0A\u65B9\u5C0F\u6B65\u63A5\u8FD1\uFF0C\u8BA9\u5DE5\u5177\u5DE5\u4F5C\u70B9\u5BF9\u51C6\u9876\u90E8\u4E2D\u5FC3\u3002"),n("Press ON in Tool I/O. DO1 commands the tool; it does not prove a successful grasp.","\u70B9\u51FB\u5DE5\u5177 I/O \u7684 ON\u3002DO1 \u53EA\u662F\u5DE5\u5177\u547D\u4EE4\uFF0C\u4E0D\u4EE3\u8868\u5DF2\u6210\u529F\u6293\u53D6\u3002"),n("Look for DI1 ON. If it stays OFF, check distance, tool orientation and material. Training assist allows 25 mm distance, but the tool still has to fit.","\u89C2\u5BDF DI1 \u662F\u5426\u4E3A ON\u3002\u82E5\u4ECD\u4E3A OFF\uFF0C\u68C0\u67E5\u8DDD\u79BB\u3001\u5DE5\u5177\u59FF\u6001\u548C\u6750\u8D28\u3002\u8BAD\u7EC3\u8F85\u52A9\u5141\u8BB8 25 \u6BEB\u7C73\u8DDD\u79BB\uFF0C\u4F46\u4ECD\u9700\u7B26\u5408\u5DE5\u5177\u5C3A\u5BF8\u8981\u6C42\u3002"),n("Only lift once DI1 is ON. ON can remain active while approaching; you do not need to toggle it repeatedly.","\u4EC5\u5728 DI1 \u4E3A ON \u540E\u62AC\u8D77\u3002\u63A5\u8FD1\u65F6\u53EF\u4EE5\u4FDD\u6301 ON\uFF0C\u65E0\u9700\u53CD\u590D\u5207\u6362\u3002")],"di-state"]},[r,o,a]=s[i]||s.start;return{message:r+`
`+o.map((c,l)=>`${l+1}. ${c}`).join(`

`),highlight:a}}var j_=new Set(["noContact","wrongMaterial","alignment","tooWide","outsideTarget","dropped"]),Fu=(i,e=!1)=>e||j_.has(i);function Bu(i=()=>Date.now(),e=3e4){let t=new Map;return n=>{let s=i();return t.has(n)&&s-t.get(n)<e?!1:(t.set(n,s),!0)}}function ku(i,e=!1){let n={noContact:["The tool is ON, but no object is held. Move its working point near the object\u2019s top center and watch DI1. ON can remain active while approaching.","\u5DE5\u5177\u5DF2\u542F\u52A8\uFF0C\u4F46\u6CA1\u6709\u6293\u4F4F\u7269\u4F53\u3002\u5C06\u5DE5\u4F5C\u70B9\u79FB\u5230\u7269\u4F53\u9876\u90E8\u4E2D\u5FC3\u9644\u8FD1\u5E76\u89C2\u5BDF DI1\u3002\u63A5\u8FD1\u65F6\u53EF\u4EE5\u4FDD\u6301 ON\u3002","di-state"],alignment:["The tool is near the object, but its approach angle is unsuitable. Aim its working face downward; six joints give more orientation control.","\u5DE5\u5177\u5DF2\u9760\u8FD1\u7269\u4F53\uFF0C\u4F46\u63A5\u8FD1\u89D2\u5EA6\u4E0D\u5408\u9002\u3002\u5C06\u5DE5\u4F5C\u9762\u671D\u4E0B\uFF1B\u516D\u5173\u8282\u80FD\u63D0\u4F9B\u66F4\u591A\u59FF\u6001\u63A7\u5236\u3002","target-form"],wrongMaterial:["Check the selected tool: the magnet needs steel and the vacuum cup needs a smooth surface.","\u68C0\u67E5\u6240\u9009\u5DE5\u5177\uFF1A\u78C1\u94C1\u9700\u8981\u94A2\u6750\uFF0C\u5438\u76D8\u9700\u8981\u5149\u6ED1\u8868\u9762\u3002","tool-select"],tooWide:["The object does not fit the gripper\u2019s projected opening. Try a different tool orientation; the grasp capacity is 42 mm.","\u7269\u4F53\u8D85\u51FA\u5939\u722A\u7684\u6295\u5F71\u5F00\u53E3\u3002\u5C1D\u8BD5\u8C03\u6574\u5DE5\u5177\u59FF\u6001\uFF1B\u6293\u53D6\u5BBD\u5EA6\u4E0A\u9650\u4E3A 42 \u6BEB\u7C73\u3002","target-form"],dropped:["The object was released too high. Lower it close to the support surface before switching DO1 OFF.","\u91CA\u653E\u4F4D\u7F6E\u8FC7\u9AD8\u3002\u5173\u95ED DO1 \u524D\uFF0C\u5148\u5C06\u7269\u4F53\u964D\u5230\u652F\u6491\u9762\u9644\u8FD1\u3002","tool-on"],outsideTarget:["The release did not satisfy the target rules. Place the whole object inside its matching pad, low and level, then release.","\u91CA\u653E\u672A\u6EE1\u8DB3\u76EE\u6807\u89C4\u5219\u3002\u5C06\u6574\u4E2A\u7269\u4F53\u5E73\u7A33\u653E\u5165\u5BF9\u5E94\u76EE\u6807\u533A\uFF0C\u5E76\u5728\u63A5\u8FD1\u8868\u9762\u65F6\u91CA\u653E\u3002","challenge-menu"],reach:["The requested target is outside the current arm\u2019s reach. Choose a closer target or add a joint, then check the new configuration.","\u76EE\u6807\u8D85\u51FA\u5F53\u524D\u673A\u68B0\u81C2\u53EF\u8FBE\u8303\u56F4\u3002\u9009\u62E9\u66F4\u8FD1\u7684\u76EE\u6807\u6216\u6DFB\u52A0\u5173\u8282\uFF0C\u7136\u540E\u68C0\u67E5\u65B0\u914D\u7F6E\u3002","target-form"],waitTimeout:["The expected DI1 state did not arrive before the wait timed out. Check the preceding DO1 command and pickup position before increasing the timeout.","\u7B49\u5F85\u8D85\u65F6\u524D\u672A\u51FA\u73B0\u9884\u671F\u7684 DI1 \u72B6\u6001\u3002\u589E\u52A0\u7B49\u5F85\u65F6\u95F4\u524D\uFF0C\u5148\u68C0\u67E5\u524D\u9762\u7684 DO1 \u6307\u4EE4\u548C\u62FE\u53D6\u4F4D\u7F6E\u3002","add-wait"],obstacle:["The arm\u2019s path intersects the pedestal. Add a raised intermediate waypoint and check the whole movement.","\u673A\u68B0\u81C2\u8DEF\u5F84\u4E0E\u9AD8\u53F0\u76F8\u4EA4\u3002\u6DFB\u52A0\u62AC\u9AD8\u7684\u4E2D\u95F4\u8DEF\u5F84\u70B9\uFF0C\u5E76\u68C0\u67E5\u6574\u4E2A\u52A8\u4F5C\u3002","record"],payloadCollision:["The carried object would collide. Allow clearance for the whole object, not just the tool tip.","\u643A\u5E26\u7684\u7269\u4F53\u4F1A\u53D1\u751F\u78B0\u649E\u3002\u9700\u8981\u4E3A\u6574\u4E2A\u7269\u4F53\u7559\u51FA\u95F4\u9699\uFF0C\u800C\u4E0D\u53EA\u662F\u5DE5\u5177\u5C16\u7AEF\u3002","record"],path:["The movement crosses the table. Lift to a clear intermediate waypoint before travelling sideways.","\u79FB\u52A8\u8DEF\u5F84\u7A7F\u8FC7\u684C\u9762\u3002\u6A2A\u5411\u79FB\u52A8\u524D\uFF0C\u5148\u62AC\u5347\u5230\u6709\u8DB3\u591F\u95F4\u9699\u7684\u4E2D\u95F4\u8DEF\u5F84\u70B9\u3002","record"],limits:["This pose cannot be reached within the selected joint limits or clearance. Try another position or orientation.","\u5728\u6240\u9009\u5173\u8282\u9650\u4F4D\u6216\u95F4\u9699\u8981\u6C42\u5185\u65E0\u6CD5\u5230\u8FBE\u8BE5\u59FF\u6001\u3002\u5C1D\u8BD5\u5176\u4ED6\u4F4D\u7F6E\u6216\u59FF\u6001\u3002","target-form"]}[i]||["Review the status message and adjust the last command before retrying. Ask the Coach about the specific control if you need more detail.","\u67E5\u770B\u72B6\u6001\u4FE1\u606F\uFF0C\u8C03\u6574\u4E0A\u4E00\u4E2A\u547D\u4EE4\u540E\u91CD\u8BD5\u3002\u5982\u9700\u66F4\u591A\u7EC6\u8282\uFF0C\u53EF\u5411\u52A9\u624B\u8BE2\u95EE\u76F8\u5173\u63A7\u4EF6\u3002",null];return{message:n[e?1:0],highlight:n[2]}}var _c=[{id:"lesson-move",en:"Movement control \u2192 Move to XYZ: execute the guided target",zh:"\u79FB\u52A8\u63A7\u5236 \u2192 \u79FB\u52A8\u5230 XYZ\uFF1A\u6267\u884C\u8DDF\u7EC3\u76EE\u6807"},{id:"tool-off",en:"Movement control \u2192 Tool I/O \u2192 OFF: release object",zh:"\u79FB\u52A8\u63A7\u5236 \u2192 \u5DE5\u5177 I/O \u2192 OFF\uFF1A\u91CA\u653E\u7269\u4F53"},{id:"stop",en:"Movement program \u2192 Stop: stop playback before manual editing; preserves scene",zh:"\u52A8\u4F5C\u7A0B\u5E8F \u2192 \u505C\u6B62\uFF1A\u624B\u52A8\u4FEE\u6539\u524D\u505C\u6B62\u8FD0\u884C\uFF0C\u4FDD\u7559\u573A\u666F"},{id:"speed",en:"Movement program \u2192 speed: choose 0.5\xD7 for inspection; does not change the path",zh:"\u52A8\u4F5C\u7A0B\u5E8F \u2192 \u901F\u5EA6\uFF1A\u9009\u62E9 0.5\xD7 \u89C2\u5BDF\uFF0C\u4E0D\u6539\u53D8\u8DEF\u5F84"},{id:"view-cube",en:"Viewport upper right \u2192 view cube: select Top or Side to inspect clearance",zh:"\u89C6\u53E3\u53F3\u4E0A\u89D2 \u2192 \u89C6\u56FE\u7ACB\u65B9\u4F53\uFF1A\u9009\u62E9\u9876\u90E8\u6216\u4FA7\u9762\u68C0\u67E5\u95F4\u9699"},{id:"add-output",en:"Commands \u2192 Set DO1: append a tool output instruction",zh:"\u6307\u4EE4 \u2192 \u8BBE\u7F6E DO1\uFF1A\u6DFB\u52A0\u5DE5\u5177\u8F93\u51FA\u6307\u4EE4"},{id:"instruction-value",en:"Commands \u2192 Signal value: select ON or OFF before adding Set DO1 / Wait DI1",zh:"\u6307\u4EE4 \u2192 \u4FE1\u53F7\u503C\uFF1A\u6DFB\u52A0\u8BBE\u7F6E DO1 \u6216\u7B49\u5F85 DI1 \u524D\u9009\u62E9 ON \u6216 OFF"},{id:"steps",en:"Movement program step list: Move earlier / Move later buttons reorder recorded steps",zh:"\u52A8\u4F5C\u7A0B\u5E8F\u6B65\u9AA4\u5217\u8868\uFF1A\u524D\u79FB\u6216\u540E\u79FB\u6309\u94AE\u8C03\u6574\u5DF2\u8BB0\u5F55\u6B65\u9AA4\u7684\u987A\u5E8F"},{id:"open-lesson",en:"Top menu \u2192 Lesson: guided introduction before the quiz; exercise unlocks when the quiz is completed",zh:"\u9876\u90E8\u83DC\u5355 \u2192 \u8BFE\u7A0B\uFF1A\u6D4B\u9A8C\u524D\u7684\u5F15\u5BFC\u4ECB\u7ECD\uFF1B\u5B8C\u6210\u6D4B\u9A8C\u540E\u89E3\u9501\u7EC3\u4E60"},{id:"open-quiz",en:"Top menu \u2192 Concept quiz: six interactive robot and control questions",zh:"\u9876\u90E8\u83DC\u5355 \u2192 \u6982\u5FF5\u6D4B\u9A8C\uFF1A\u516D\u9053\u673A\u68B0\u81C2\u548C\u63A7\u4EF6\u4E92\u52A8\u9898"},{id:"joints",en:"Movement control \u2192 Sliders: individual joint angles in degrees",zh:"\u79FB\u52A8\u63A7\u5236 \u2192 \u6ED1\u5757\uFF1A\u5404\u5173\u8282\u89D2\u5EA6\uFF0C\u5355\u4F4D\u5EA6"},{id:"target-form",en:"Movement control \u2192 XYZ: enter tool coordinates and select Move to XYZ",zh:"\u79FB\u52A8\u63A7\u5236 \u2192 XYZ \u5750\u6807\uFF1A\u8F93\u5165\u5DE5\u5177\u5750\u6807\u5E76\u9009\u62E9\u79FB\u52A8\u5230 XYZ"},{id:"jog-controls",en:"Movement control \u2192 Buttons: jog XYZ or Rx/Ry/Rz; independent rotation needs six joints",zh:"\u79FB\u52A8\u63A7\u5236 \u2192 \u6309\u94AE\uFF1A\u70B9\u52A8 XYZ \u6216 Rx/Ry/Rz\uFF1B\u72EC\u7ACB\u65CB\u8F6C\u9700\u8981\u516D\u4E2A\u5173\u8282"},{id:"tool-select",en:"Expand Learning challenge \u2192 End effector: select gripper, vacuum or magnet",zh:"\u5C55\u5F00\u5B66\u4E60\u6311\u6218 \u2192 \u672B\u7AEF\u6267\u884C\u5668\uFF1A\u9009\u62E9\u5939\u722A\u3001\u5438\u76D8\u6216\u78C1\u94C1"},{id:"run",en:"Movement program \u2192 Run: resets the scene and executes the sequence",zh:"\u52A8\u4F5C\u7A0B\u5E8F \u2192 \u8FD0\u884C\uFF1A\u91CD\u7F6E\u573A\u666F\u5E76\u6267\u884C\u5E8F\u5217"},{id:"challenge-menu",en:"Learning challenge: choose a tool and inspect pickup/placement targets",zh:"\u5B66\u4E60\u6311\u6218\uFF1A\u9009\u62E9\u5DE5\u5177\u5E76\u67E5\u770B\u62FE\u53D6\u548C\u653E\u7F6E\u76EE\u6807"},{id:"tool-on",en:"Movement control \u2192 Tool I/O \u2192 ON: activate DO1",zh:"\u79FB\u52A8\u63A7\u5236 \u2192 \u5DE5\u5177 I/O \u2192 ON\uFF1A\u6FC0\u6D3B DO1"},{id:"di-state",en:"Movement control \u2192 Tool I/O \u2192 DI1: confirms an object is held",zh:"\u79FB\u52A8\u63A7\u5236 \u2192 \u5DE5\u5177 I/O \u2192 DI1\uFF1A\u786E\u8BA4\u5DF2\u6293\u53D6\u7269\u4F53"},{id:"record",en:"Movement program \u2192 Commands \u2192 Record current position",zh:"\u52A8\u4F5C\u7A0B\u5E8F \u2192 \u6307\u4EE4 \u2192 \u8BB0\u5F55\u5F53\u524D\u4F4D\u7F6E"},{id:"add-wait",en:"Movement program \u2192 Commands \u2192 Wait DI1",zh:"\u52A8\u4F5C\u7A0B\u5E8F \u2192 \u6307\u4EE4 \u2192 \u7B49\u5F85 DI1"},{id:"px",en:"Tool position floating on the left inside the viewport: TCP world X, Y, Z in millimeters",zh:"\u89C6\u53E3\u5185\u5DE6\u4FA7\u60AC\u6D6E\u5DE5\u5177\u4F4D\u7F6E\uFF1ATCP \u7684\u4E16\u754C\u5750\u6807 X\u3001Y\u3001Z\uFF0C\u5355\u4F4D\u6BEB\u7C73"},{id:"add-joint",en:"Build your arm above the viewport: + adds a joint, up to six",zh:"\u89C6\u53E3\u4E0A\u65B9\u7EC4\u88C5\u673A\u68B0\u81C2\uFF1A+ \u6DFB\u52A0\u5173\u8282\uFF0C\u6700\u591A\u516D\u4E2A"}];function zu(i,e){let t=document.createElement("section");t.id="coach",t.setAttribute("aria-label","Learning coach / \u5B66\u4E60\u52A9\u624B"),t.innerHTML='<div class="coach-bar"><button id="coach-drag" type="button"></button><button id="coach-home" type="button">\u2316</button><button id="coach-toggle" type="button" aria-controls="coach-body" aria-expanded="false">\uFF0B</button></div><div id="coach-body" hidden><p id="coach-status"></p><button id="coach-reconnect" type="button"></button><button data-topic="builtin"></button><div class="coach-topics"><button data-topic="task"></button><button data-topic="move"></button><button data-topic="collision"></button><button data-topic="program"></button><button data-topic="interface"></button><button data-topic="concepts"></button></div><div id="coach-messages" role="log" aria-live="polite" aria-relevant="additions"></div><form id="coach-form"><label for="coach-question" id="coach-label"></label><div class="coach-compose"><textarea id="coach-question" rows="2" maxlength="1000"></textarea><button id="coach-send" type="submit"></button></div></form></div>',document.body.append(t);let n=R=>t.querySelector("#"+R),s=()=>i().language==="zh",r=(R,Z)=>s()?Z:R,o=!1,a=null,c=null,l=!1,h=!1,u=!1,f="",p=[],_=Bu(),x=[],m="start";try{let R=JSON.parse(localStorage.getItem("robot-coach-position"));Number.isFinite(R?.x)&&Number.isFinite(R?.y)&&(a=R)}catch{}function d(){if(t.classList.contains("docked")){t.style.maxWidth="100%";return}let R=document.documentElement.clientWidth;t.style.maxWidth=R-16+"px";let Z=t.getBoundingClientRect();a||(a={x:innerWidth-Z.width-16,y:innerHeight-Z.height-16}),a.x=Math.max(8,Math.min(a.x,R-Z.width-8)),a.y=Math.max(8,Math.min(a.y,innerHeight-Z.height-8)),t.style.left=a.x+"px",t.style.top=a.y+"px"}function E(){try{localStorage.setItem("robot-coach-position",JSON.stringify(a))}catch{}}function y(R,Z=!1,J,ue="builtin"){let ve=document.createElement("div");if(ve.className="coach-message"+(Z?" own":""),!Z){let ce=document.createElement("small");ce.className="coach-source",ce.textContent=ue==="qwen"?"Qwen AI":ue==="system"?r("Connection / status","\u8FDE\u63A5 / \u72B6\u6001"):r("Built-in guide \xB7 not AI","\u5185\u7F6E\u6307\u5357 \xB7 \u975E AI"),ve.append(ce)}let ee=document.createElement("p");if(ee.textContent=R,ve.append(ee),J){let ce=document.createElement("button");ce.textContent=r("Show control \u2197","\u663E\u793A\u63A7\u4EF6 \u2197"),ce.onclick=Me=>{Me.stopPropagation(),A(J)},ve.append(ce)}for(n("coach-messages").append(ve);n("coach-messages").children.length>30;)n("coach-messages").firstElementChild.remove();ve.scrollIntoView({block:"nearest"})}let S;function A(R){if(!_c.some(ve=>ve.id===R))return;let Z=document.getElementById(R);if(!Z)return;let J=Z.closest("aside");J&&document.querySelector(`[data-panel-choice="${J.id==="program-panel"?"program":"controls"}"]`)?.click();let ue={joints:"sliders","target-form":"xyz","jog-controls":"jog"}[R];ue&&document.querySelector(`[data-mode="${ue}"]`)?.click(),R==="tool-select"&&(document.getElementById("challenge-menu").open=!0),R==="open-lesson"&&Z.click(),R==="open-quiz"&&e?.(),Z.tagName==="DETAILS"&&(Z.open=!0),document.querySelectorAll(".coach-highlight").forEach(ve=>ve.classList.remove("coach-highlight")),clearTimeout(S),Z.scrollIntoView({block:"center",behavior:"smooth"}),Z.classList.add("coach-highlight"),S=setTimeout(()=>Z.classList.remove("coach-highlight"),4500)}function w(R,Z=""){let J=i(),ue=Z.toLowerCase();if(J.learning?.unlocked===!1||J.quiz?.open&&!J.quiz.answered&&!J.quiz.completed){let ee=ka("start",J);y(ee.message,!1,ee.highlight);return}if(R==="interface"){y(r("Choose a control to locate it in the workspace. These names and locations form the interface map that Qwen will receive.","\u9009\u62E9\u8981\u67E5\u627E\u7684\u63A7\u4EF6\u3002\u8FD9\u4E9B\u540D\u79F0\u548C\u4F4D\u7F6E\u5C06\u6784\u6210\u63D0\u4F9B\u7ED9 Qwen \u7684\u754C\u9762\u5730\u56FE\u3002"));for(let ee of _c)y(s()?ee.zh:ee.en,!1,ee.id);return}if(R==="concepts"||/quiz|concept|词汇|测验|概念/.test(ue)){y(r("Concept practice: DO1 is ON, but DI1 is OFF. Is an object confirmed held? No. DO1 is the command; DI1 is pickup feedback. XYZ describes the tool center point\u2019s position, while roll/pitch/yaw describe orientation. Open Quiz concepts to try the interactive quiz.","\u6982\u5FF5\u7EC3\u4E60\uFF1ADO1 \u4E3A ON\u3001DI1 \u4E3A OFF\uFF0C\u80FD\u786E\u8BA4\u5DF2\u6293\u53D6\u7269\u4F53\u5417\uFF1F\u4E0D\u80FD\u3002DO1 \u662F\u547D\u4EE4\uFF0CDI1 \u662F\u62FE\u53D6\u53CD\u9988\u3002XYZ \u8868\u793A\u5DE5\u5177\u4E2D\u5FC3\u70B9\u7684\u4F4D\u7F6E\uFF0C\u6EDA\u8F6C/\u4FEF\u4EF0/\u504F\u822A\u8868\u793A\u59FF\u6001\u3002\u70B9\u51FB\u6D4B\u9A8C\u6982\u5FF5\u5373\u53EF\u6253\u5F00\u4E92\u52A8\u6D4B\u9A8C\u3002"),!1,"di-state");return}m=["move","collision","program","pickup"].includes(R)?R:R==="task"?J.input?"pickup":"start":Ou(Z,m);let ve=ka(m,J);y(ve.message,!1,ve.highlight)}function C(){n("coach-reconnect").textContent=r("Recheck connection","\u91CD\u65B0\u68C0\u67E5\u8FDE\u63A5"),t.querySelector('[data-topic="builtin"]').textContent=r("Built-in help (offline)","\u5185\u7F6E\u5E2E\u52A9\uFF08\u79BB\u7EBF\uFF09"),n("coach-drag").textContent=r("\u2726 Your teacher","\u2726 \u4F60\u7684\u8001\u5E08"),n("coach-drag").title=r("Teacher guidance and questions","\u8001\u5E08\u6307\u5BFC\u4E0E\u63D0\u95EE"),n("coach-home").title=n("coach-home").ariaLabel=r("Reset coach position","\u91CD\u7F6E\u52A9\u624B\u4F4D\u7F6E"),n("coach-toggle").ariaLabel=r(o?"Collapse coach":"Open coach",o?"\u6536\u8D77\u52A9\u624B":"\u6253\u5F00\u52A9\u624B"),n("coach-status").textContent=r("Built-in guidance \xB7 Qwen not connected","\u5185\u7F6E\u6307\u5BFC \xB7 \u5C1A\u672A\u8FDE\u63A5 Qwen");for(let[R,Z,J]of[["task","Where do I start?","\u4ECE\u54EA\u91CC\u5F00\u59CB\uFF1F"],["move","Move the arm","\u79FB\u52A8\u673A\u68B0\u81C2"],["collision","Avoid collisions","\u907F\u5F00\u78B0\u649E"],["program","Build a program","\u7F16\u6392\u7A0B\u5E8F"],["interface","Find a control","\u67E5\u627E\u63A7\u4EF6"],["concepts","Concept quiz","\u6982\u5FF5\u6D4B\u9A8C"]])t.querySelector(`[data-topic="${R}"]`).textContent=r(Z,J);n("coach-label").textContent=r("Ask about this task or the controls","\u8BE2\u95EE\u4EFB\u52A1\u6216\u63A7\u4EF6"),n("coach-question").placeholder=r("How do I record a pickup?","\u5982\u4F55\u8BB0\u5F55\u62FE\u53D6\u52A8\u4F5C\uFF1F"),n("coach-send").textContent=r("Ask","\u63D0\u95EE")}function L(){o=!o,n("coach-body").hidden=!o,t.classList.toggle("expanded",o),n("coach-toggle").textContent=o?"\u2212":"\uFF0B",n("coach-toggle").setAttribute("aria-expanded",String(o)),C(),X(),d(),o&&!n("coach-messages").children.length&&y(r("I can help you explore the controls and plan this task. Choose a topic or ask a question. The status above shows whether Qwen is connected.","\u6211\u53EF\u4EE5\u5E2E\u52A9\u4F60\u4E86\u89E3\u63A7\u4EF6\u5E76\u89C4\u5212\u4EFB\u52A1\u3002\u9009\u62E9\u4E3B\u9898\u6216\u8F93\u5165\u95EE\u9898\u3002\u4E0A\u65B9\u72B6\u6001\u4F1A\u663E\u793A\u662F\u5426\u5DF2\u8FDE\u63A5 Qwen\u3002"))}n("coach-toggle").onclick=L,n("coach-home").onclick=()=>{a=null,d(),E()},n("coach-drag").onpointerdown=R=>{t.classList.contains("docked")||R.button!==0||(c={x:R.clientX,y:R.clientY,left:a.x,top:a.y},n("coach-drag").setPointerCapture(R.pointerId))},n("coach-drag").onpointermove=R=>{c&&(a={x:c.left+R.clientX-c.x,y:c.top+R.clientY-c.y},d())},n("coach-drag").onpointerup=()=>{c=null,E()},n("coach-drag").onpointercancel=()=>{c=null},n("coach-drag").onkeydown=R=>{let Z={ArrowLeft:[-20,0],ArrowRight:[20,0],ArrowUp:[0,-20],ArrowDown:[0,20]};Z[R.key]?(R.preventDefault(),a.x+=Z[R.key][0],a.y+=Z[R.key][1],d(),E()):(R.key==="Enter"||R.key===" ")&&(R.preventDefault(),L())},t.onkeydown=R=>{R.key==="Escape"&&o&&(L(),n("coach-toggle").focus())},t.querySelectorAll("[data-topic]").forEach(R=>R.onclick=()=>w(R.dataset.topic)),t.querySelector('[data-topic="concepts"]').onclick=()=>{e?.(),o&&L()};let v=()=>({...i(),uiVersion:"coach-ui-v1",controls:_c.map(R=>({...R,visible:!!document.getElementById(R.id)?.getClientRects().length,enabled:!document.getElementById(R.id)?.disabled&&!document.getElementById(R.id)?.closest("[inert]")})),quiz:i().quiz||{available:!1}}),b=()=>{let R=i();return JSON.stringify([R.language,R.tool,R.joints,R.score,R.output,R.input,R.steps,R.quiz])};function D(R){let Z=ku(R.code,s()),J=["obstacle","path","payloadCollision","blocked","noPath"].includes(R.code)?"collision":R.code==="waitTimeout"?"program":["reach","limits","alignment"].includes(R.code)?"move":"pickup";m=J;let ue=ka(J,{...R.snapshot||i(),language:i().language});y(Z.message+`

`+ue.message,!1,ue.highlight)}function O(){if(!h&&x.length){let R=x.shift();ie(r("Explain what happened in beginner language, then give me a short numbered recovery procedure with the exact controls and what to check.","\u8BF7\u7528\u521D\u5B66\u8005\u80FD\u7406\u89E3\u7684\u8BED\u8A00\u89E3\u91CA\u5931\u8D25\uFF0C\u5E76\u6309\u7F16\u53F7\u7ED9\u51FA\u7B80\u77ED\u7684\u5904\u7406\u6B65\u9AA4\u3001\u5177\u4F53\u63A7\u4EF6\u548C\u68C0\u67E5\u8981\u70B9\u3002"),R)}}let V={not_configured:["No server API key is configured.","\u670D\u52A1\u5668\u5C1A\u672A\u914D\u7F6E API \u5BC6\u94A5\u3002"],unavailable:["This preview has no AI connection. Deploy with the Python school server.","\u5F53\u524D\u9884\u89C8\u672A\u8FDE\u63A5 AI\uFF0C\u8BF7\u4F7F\u7528 Python \u5B66\u6821\u670D\u52A1\u5668\u90E8\u7F72\u3002"],provider_auth:["Qwen rejected the key (401). Check the key and endpoint pairing.","Qwen \u62D2\u7EDD\u5BC6\u94A5\uFF08401\uFF09\uFF0C\u8BF7\u68C0\u67E5\u5BC6\u94A5\u4E0E\u7AEF\u70B9\u662F\u5426\u5339\u914D\u3002"],provider_access:["Qwen denied access (403). Check the plan/model permissions.","Qwen \u62D2\u7EDD\u8BBF\u95EE\uFF08403\uFF09\uFF0C\u8BF7\u68C0\u67E5\u5957\u9910\u548C\u6A21\u578B\u6743\u9650\u3002"],provider_endpoint:["Qwen endpoint/model was not found (404).","\u672A\u627E\u5230 Qwen \u7AEF\u70B9\u6216\u6A21\u578B\uFF08404\uFF09\u3002"],provider_quota:["Qwen rate or quota limit (429). Check available quota.","Qwen \u901F\u7387\u6216\u989D\u5EA6\u9650\u5236\uFF08429\uFF09\uFF0C\u8BF7\u68C0\u67E5\u989D\u5EA6\u3002"],provider_request:["Qwen rejected the request (400). Check model and supported parameters.","Qwen \u62D2\u7EDD\u8BF7\u6C42\uFF08400\uFF09\uFF0C\u8BF7\u68C0\u67E5\u6A21\u578B\u548C\u53C2\u6570\u3002"],provider_timeout:["Qwen timed out. Try again shortly.","Qwen \u54CD\u5E94\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002"],provider_network:["The server could not reach Qwen. Check DNS, HTTPS access and certificates.","\u670D\u52A1\u5668\u65E0\u6CD5\u8FDE\u63A5 Qwen\uFF0C\u8BF7\u68C0\u67E5 DNS\u3001HTTPS \u8BBF\u95EE\u548C\u8BC1\u4E66\u3002"],provider_response:["Qwen returned an empty or unreadable response.","Qwen \u8FD4\u56DE\u7A7A\u767D\u6216\u65E0\u6CD5\u8BFB\u53D6\u7684\u54CD\u5E94\u3002"],busy:["The school server is busy. Try again shortly.","\u5B66\u6821\u670D\u52A1\u5668\u7E41\u5FD9\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002"],invalid_request:["The request was rejected. Try a shorter question or smaller program.","\u8BF7\u6C42\u88AB\u62D2\u7EDD\uFF0C\u8BF7\u5C1D\u8BD5\u8F83\u77ED\u7684\u95EE\u9898\u6216\u8F83\u5C0F\u7684\u7A0B\u5E8F\u3002"]};function Y(R){return r(...V[R]||["AI request failed. Recheck the server connection.","AI \u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u68C0\u67E5\u670D\u52A1\u5668\u8FDE\u63A5\u3002"])}function X(){n("coach-status").textContent=h?r("Contacting Qwen\u2026","\u6B63\u5728\u8FDE\u63A5 Qwen\u2026"):f?Y(f):u?r("Qwen \xB7 last AI reply succeeded","Qwen \xB7 \u4E0A\u6B21 AI \u56DE\u590D\u6210\u529F"):l?r("Key configured \xB7 AI response not yet verified","\u5DF2\u914D\u7F6E\u5BC6\u94A5 \xB7 \u5C1A\u672A\u9A8C\u8BC1 AI \u56DE\u590D"):r("AI offline \xB7 built-in help available","AI \u79BB\u7EBF \xB7 \u53EF\u4F7F\u7528\u5185\u7F6E\u5E2E\u52A9")}async function q(){try{let R=await fetch("/api/coach/status",{cache:"no-store"});if(!R.ok)throw Error("unavailable");l=(await R.json()).configured===!0,f=l?"":"not_configured"}catch{l=!1,f="unavailable"}X()}n("coach-reconnect").onclick=()=>{u=!1,q()};async function ie(R,Z=null){if(h)return;if(h=!0,n("coach-send").disabled=!0,X(),Z?y(r("Status feedback: ","\u72B6\u6001\u53CD\u9988\uFF1A")+Z.text):y(R,!0),!l&&(await q(),!l)){y(Y(f)+r(" No AI answer was generated. Use Built-in help for offline guidance."," \u672A\u751F\u6210 AI \u7B54\u6848\u3002\u53EF\u70B9\u51FB\u5185\u7F6E\u5E2E\u52A9\u67E5\u770B\u79BB\u7EBF\u6307\u5BFC\u3002"),!1,null,"system"),Z&&D(Z),h=!1,n("coach-send").disabled=!1,X(),queueMicrotask(O);return}h=!0,n("coach-send").disabled=!0,X();let J=b(),ue=new AbortController,ve=setTimeout(()=>ue.abort(),3e4);try{let ee=await fetch("/api/coach",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:R,context:Z?{...Z.snapshot,failure:{code:Z.code,text:Z.text,step:Z.step,occurredAt:Z.occurredAt},feedbackMode:"failure"}:v(),history:p.slice(-6)}),signal:ue.signal}),ce=await ee.json();if(!ee.ok)throw Error(ce.error||"provider_unavailable");if(typeof ce.message!="string")throw Error("Invalid response");if(!Z&&J!==b()){y(r("The workspace changed while I was answering. Ask again to use the current state.","\u56DE\u7B54\u671F\u95F4\u5DE5\u4F5C\u533A\u5DF2\u53D1\u751F\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u63D0\u95EE\u4EE5\u4F7F\u7528\u5F53\u524D\u72B6\u6001\u3002"));return}u=!0,f="",y(ce.message,!1,ce.highlight,"qwen"),p.push({role:"user",content:R},{role:"assistant",content:ce.message}),p.length>6&&p.splice(0,p.length-6)}catch(ee){u=!1,f=ee.name==="AbortError"?"provider_timeout":ee.message,y(Y(f)+r(" No AI answer was generated. Built-in help is available separately."," \u672A\u751F\u6210 AI \u7B54\u6848\u3002\u5185\u7F6E\u5E2E\u52A9\u53EF\u5355\u72EC\u6253\u5F00\u3002"),!1,null,"system"),Z&&D(Z)}finally{clearTimeout(ve),h=!1,n("coach-send").disabled=!1,X(),queueMicrotask(O)}}n("coach-form").onsubmit=R=>{R.preventDefault();let Z=n("coach-question").value.trim();!Z||h||(n("coach-question").value="",ie(Z))};for(let[R,Z,J]of[["task","I am a beginner. What should I do first for this task? Give me numbered steps.","\u6211\u662F\u521D\u5B66\u8005\u3002\u8FD9\u4E2A\u4EFB\u52A1\u5E94\u8BE5\u5148\u505A\u4EC0\u4E48\uFF1F\u8BF7\u6309\u6B65\u9AA4\u8BB2\u89E3\u3002"],["move","Show me how to move the arm, step by step, using the controls.","\u8BF7\u7528\u754C\u9762\u63A7\u4EF6\u4E00\u6B65\u6B65\u6559\u6211\u79FB\u52A8\u673A\u68B0\u81C2\u3002"],["collision","Explain strategies to avoid and recover from collisions in this simulator, step by step.","\u8BF7\u9010\u6B65\u8BB2\u89E3\u5728\u672C\u6A21\u62DF\u5668\u4E2D\u907F\u5F00\u78B0\u649E\u548C\u5904\u7406\u78B0\u649E\u7684\u7B56\u7565\u3002"],["program","Help me build my first pick-and-place program, step by step.","\u8BF7\u4E00\u6B65\u6B65\u5E2E\u52A9\u6211\u7F16\u5199\u7B2C\u4E00\u4E2A\u62FE\u53D6\u653E\u7F6E\u7A0B\u5E8F\u3002"]])t.querySelector(`[data-topic="${R}"]`).onclick=()=>{m=R==="task"?"start":R,ie(r(Z,J))};return new MutationObserver(()=>{C(),X(),d()}).observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),window.addEventListener("resize",d),C(),d(),t.querySelector('[data-topic="builtin"]').onclick=()=>w(m),location.protocol!=="file:"&&q(),{context:v,mount:n("coach-body"),fit:d,collapse(){o&&L()},showLesson(R,Z=!1){o||L();let J=t.getBoundingClientRect();a={x:R?(innerWidth-J.width)/2:Z?18:innerWidth-J.width-18,y:R?Math.max(30,(innerHeight-480)/2):100},d()},reportFailure(R){if(!_(R.code))return;let Z=document.getElementById("teacher-questions");Z&&(Z.open=!0),o||L();let J=JSON.parse(JSON.stringify(v()));x.push({...R,snapshot:J,occurredAt:new Date().toISOString()}),x.length>8&&x.shift(),O()}}}var Ut=[{id:"joint",target:"joint",prompt:["What is the highlighted part A?","\u9AD8\u4EAE\u7684 A \u90E8\u4EF6\u662F\u4EC0\u4E48\uFF1F"],description:["Look at the rotating connection above the base.","\u89C2\u5BDF\u5E95\u5EA7\u4E0A\u65B9\u7684\u65CB\u8F6C\u8FDE\u63A5\u5904\u3002"],options:[["Joint","\u5173\u8282"],["Link","\u8FDE\u6746"],["End effector","\u672B\u7AEF\u6267\u884C\u5668"]],correct:0,explain:["A joint lets connected parts rotate relative to each other. Its angle is measured in degrees.","\u5173\u8282\u8BA9\u76F8\u8FDE\u7684\u90E8\u4EF6\u76F8\u5BF9\u65CB\u8F6C\uFF0C\u5176\u89D2\u5EA6\u4EE5\u5EA6\u4E3A\u5355\u4F4D\u3002"]},{id:"link",target:"link",prompt:["What is the highlighted part A?","\u9AD8\u4EAE\u7684 A \u90E8\u4EF6\u662F\u4EC0\u4E48\uFF1F"],description:["Look at the long rigid section between two rotating connections.","\u89C2\u5BDF\u4E24\u4E2A\u65CB\u8F6C\u8FDE\u63A5\u5904\u4E4B\u95F4\u7684\u957F\u521A\u6027\u90E8\u4EF6\u3002"],options:[["Sensor","\u4F20\u611F\u5668"],["Link","\u8FDE\u6746"],["Tool center point","\u5DE5\u5177\u4E2D\u5FC3\u70B9"]],correct:1,explain:["A link connects joints. Changing joint angles moves the links and the tool.","\u8FDE\u6746\u8FDE\u63A5\u5173\u8282\u3002\u6539\u53D8\u5173\u8282\u89D2\u5EA6\u4F1A\u79FB\u52A8\u8FDE\u6746\u548C\u5DE5\u5177\u3002"]},{id:"tool",target:"tool",prompt:["What is the highlighted assembly A called?","\u9AD8\u4EAE\u7684 A \u7EC4\u4EF6\u53EB\u4EC0\u4E48\uFF1F"],description:["Look at the attachment at the very end of the arm.","\u89C2\u5BDF\u673A\u68B0\u81C2\u6700\u672B\u7AEF\u7684\u9644\u4EF6\u3002"],options:[["Base","\u5E95\u5EA7"],["Joint limit","\u5173\u8282\u9650\u4F4D"],["End effector","\u672B\u7AEF\u6267\u884C\u5668"]],correct:2,explain:["The end effector interacts with the object. This simulator offers a gripper, vacuum cup and magnet.","\u672B\u7AEF\u6267\u884C\u5668\u4E0E\u7269\u4F53\u63A5\u89E6\u3002\u672C\u6A21\u62DF\u5668\u63D0\u4F9B\u5939\u722A\u3001\u5438\u76D8\u548C\u78C1\u94C1\u3002"]},{id:"tcp",target:"tcp",prompt:["The highlighted point A is the TCP. What does XYZ report?","\u9AD8\u4EAE\u7684 A \u70B9\u662F TCP\u3002XYZ \u663E\u793A\u4EC0\u4E48\uFF1F"],description:["Look at the working point at the tip and the Tool position readout on the left of the 3D view.","\u89C2\u5BDF\u5DE5\u5177\u672B\u7AEF\u7684\u5DE5\u4F5C\u70B9\u4EE5\u53CA\u4E09\u7EF4\u89C6\u56FE\u5DE6\u4FA7\u7684\u5DE5\u5177\u4F4D\u7F6E\u8BFB\u6570\u3002"],options:[["The tool\u2019s position in world coordinates, in mm","\u5DE5\u5177\u5728\u4E16\u754C\u5750\u6807\u7CFB\u4E2D\u7684\u4F4D\u7F6E\uFF0C\u5355\u4F4D\u6BEB\u7C73"],["Three joint angles, in degrees","\u4E09\u4E2A\u5173\u8282\u89D2\u5EA6\uFF0C\u5355\u4F4D\u5EA6"],["The object\u2019s weight","\u7269\u4F53\u7684\u91CD\u91CF"]],correct:0,explain:["TCP means tool center point. XYZ reports its position; roll, pitch and yaw describe orientation.","TCP \u662F\u5DE5\u5177\u4E2D\u5FC3\u70B9\u3002XYZ \u663E\u793A\u5176\u4F4D\u7F6E\uFF1B\u6EDA\u8F6C\u3001\u4FEF\u4EF0\u3001\u504F\u822A\u63CF\u8FF0\u5176\u59FF\u6001\u3002"]},{id:"signals",ui:"di-state",prompt:["Suppose DO1 is ON and DI1 is OFF. What is confirmed?","\u5047\u8BBE DO1 \u4E3A ON\uFF0CDI1 \u4E3A OFF\u3002\u53EF\u4EE5\u786E\u8BA4\u4EC0\u4E48\uFF1F"],description:["This is a hypothetical signal state, not necessarily the current live state.","\u8FD9\u662F\u4E00\u4E2A\u5047\u8BBE\u7684\u4FE1\u53F7\u72B6\u6001\uFF0C\u4E0D\u4E00\u5B9A\u4E0E\u5F53\u524D\u5B9E\u65F6\u72B6\u6001\u76F8\u540C\u3002"],options:[["An object is definitely held","\u4E00\u5B9A\u5DF2\u6293\u53D6\u7269\u4F53"],["The tool is commanded ON; pickup is not confirmed","\u5DE5\u5177\u5DF2\u6536\u5230 ON \u547D\u4EE4\uFF0C\u4F46\u5C1A\u672A\u786E\u8BA4\u6293\u53D6"],["The program has finished","\u7A0B\u5E8F\u5DF2\u5B8C\u6210"]],correct:1,explain:["DO1 is the output command. DI1 is input feedback confirming an object is held. Check DI1 before lifting.","DO1 \u662F\u8F93\u51FA\u547D\u4EE4\u3002DI1 \u662F\u786E\u8BA4\u5DF2\u6293\u53D6\u7269\u4F53\u7684\u8F93\u5165\u53CD\u9988\u3002\u62AC\u8D77\u524D\u5E94\u68C0\u67E5 DI1\u3002"]},{id:"record",ui:"record",prompt:["What does Record current position add?","\u201C\u8BB0\u5F55\u5F53\u524D\u4F4D\u7F6E\u201D\u4F1A\u6DFB\u52A0\u4EC0\u4E48\uFF1F"],description:["Find the highlighted button in Movement program \u2192 Commands.","\u627E\u5230\u52A8\u4F5C\u7A0B\u5E8F \u2192 \u6307\u4EE4\u4E2D\u7684\u9AD8\u4EAE\u6309\u94AE\u3002"],options:[["A complete pickup sequence","\u5B8C\u6574\u7684\u62FE\u53D6\u5E8F\u5217"],["A DO1 command and a movement","DO1 \u547D\u4EE4\u548C\u79FB\u52A8\u52A8\u4F5C"],["A movement waypoint; DO1 needs its own command","\u4E00\u4E2A\u79FB\u52A8\u8DEF\u5F84\u70B9\uFF1BDO1 \u9700\u8981\u5355\u72EC\u6DFB\u52A0\u547D\u4EE4"]],correct:2,explain:["Recording adds a movement. Add Set DO1 and Wait DI1 separately to control and confirm pickup.","\u8BB0\u5F55\u4F1A\u6DFB\u52A0\u4E00\u4E2A\u79FB\u52A8\u52A8\u4F5C\u3002\u8BF7\u5355\u72EC\u6DFB\u52A0\u8BBE\u7F6E DO1 \u548C\u7B49\u5F85 DI1\uFF0C\u4EE5\u63A7\u5236\u5E76\u786E\u8BA4\u62FE\u53D6\u3002"]}];function Hu({language:i,highlight:e,reveal:t,onOpen:n,onComplete:s=()=>{}}){let r=document.createElement("section");r.id="concept-quiz",r.hidden=!0,r.setAttribute("aria-labelledby","quiz-title"),document.getElementById("viewport").after(r);let o=document.createElement("button");o.id="open-quiz",document.querySelector(".header-right").prepend(o);let a=0,c=[],l=!1,h=null;try{let y=JSON.parse(localStorage.getItem("robot-concepts-v1"));Array.isArray(y?.answers)&&y.answers.length<=Ut.length&&y.answers.every((S,A)=>Number.isInteger(S)&&S>=0&&S<Ut[A].options.length)&&(c=y.answers,a=c.length,h=Number.isInteger(y.firstScore)?y.firstScore:null)}catch{}let u=y=>y[i()==="zh"?1:0],f=()=>{try{localStorage.setItem("robot-concepts-v1",JSON.stringify({answers:c,firstScore:h}))}catch{}};function p(){e(null),document.querySelectorAll(".quiz-highlight").forEach(y=>y.classList.remove("quiz-highlight"))}function _(){if(p(),!l||a>=Ut.length)return;let y=Ut[a];y.target&&e(y.target),y.ui&&(t(y.ui),document.getElementById(y.ui)?.classList.add("quiz-highlight"))}function x(y,S){let A=document.createElement("button");return A.type="button",A.textContent=y,A.onclick=S,A}function m(){if(o.textContent=u(["Concept quiz","\u6982\u5FF5\u6D4B\u9A8C"])+(c.length===Ut.length?" \u2713":""),o.setAttribute("aria-expanded",String(l)),o.setAttribute("aria-controls",r.id),!l)return;r.replaceChildren();let y=document.createElement("div");y.className="quiz-heading";let S=document.createElement("h2");S.id="quiz-title",S.textContent=u(["Know your robot","\u8BA4\u8BC6\u673A\u68B0\u81C2"]),y.append(S,x(u(["Close \xD7","\u5173\u95ED \xD7"]),d)),r.append(y);let A=document.createElement("p");if(A.className="quiz-progress",A.textContent=a<Ut.length?u(["Question","\u95EE\u9898"])+` ${a+1} / ${Ut.length}`:u(["Review your answers","\u56DE\u987E\u7B54\u6848"]),r.append(A),a>=Ut.length){s(),p();let D=c.filter((Y,X)=>Y===Ut[X].correct).length;h===null&&(h=D,f());let O=document.createElement("h3");O.tabIndex=-1,O.textContent=u([`${D} / 6 correct \u2014 ${D===6?"ready to practice!":"review the feedback below."}`,`\u7B54\u5BF9 ${D} / 6 \u2014 ${D===6?"\u53EF\u4EE5\u5F00\u59CB\u7EC3\u4E60\uFF01":"\u8BF7\u67E5\u770B\u4E0B\u65B9\u53CD\u9988\u3002"}`]),r.append(O);let V=document.createElement("p");V.textContent=u(["Exercise unlocked. You can now move the arm and build your program.","\u7EC3\u4E60\u5DF2\u89E3\u9501\u3002\u73B0\u5728\u53EF\u4EE5\u79FB\u52A8\u673A\u68B0\u81C2\u5E76\u7F16\u6392\u7A0B\u5E8F\u3002"]),r.append(V),Ut.forEach((Y,X)=>{let q=document.createElement("p");q.className="quiz-review",q.textContent=(c[X]===Y.correct?"\u2713 ":"\u21BA ")+u(Y.explain),r.append(q)}),r.append(x(u(["Try again","\u91CD\u65B0\u6D4B\u9A8C"]),()=>{c=[],a=0,f(),m()}),x(u(["Start exercise \u2192","\u5F00\u59CB\u7EC3\u4E60 \u2192"]),d)),O.focus({preventScroll:!0});return}let w=Ut[a],C=document.createElement("h3");C.id="quiz-question",C.tabIndex=-1,C.textContent=u(w.prompt);let L=document.createElement("p");L.textContent=u(w.description),r.append(C,L);let v=document.createElement("div");v.className="quiz-options",v.setAttribute("role","group"),v.setAttribute("aria-labelledby","quiz-question");let b=c[a]!==void 0;if(w.options.forEach((D,O)=>{let V=x(String.fromCharCode(65+O)+". "+u(D),()=>{c[a]=O,f(),m()});V.disabled=b,b&&(V.classList.toggle("correct",O===w.correct),V.classList.toggle("incorrect",O===c[a]&&O!==w.correct)),v.append(V)}),r.append(v),b){let D=document.createElement("p");D.id="quiz-feedback",D.setAttribute("role","status"),D.textContent=u(c[a]===w.correct?["Correct. ","\u6B63\u786E\u3002"]:["Not quite. ","\u8FD8\u4E0D\u6B63\u786E\u3002"])+u(w.explain),r.append(D,x(u(a===Ut.length-1?["See results","\u67E5\u770B\u7ED3\u679C"]:["Next question \u2192","\u4E0B\u4E00\u9898 \u2192"]),()=>{a++,m(),f()}))}_(),b||C.focus({preventScroll:!0})}function d(){document.body.classList.remove("quiz-active"),l=!1,r.hidden=!0,p(),m(),o.focus({preventScroll:!0})}function E(){document.body.classList.add("quiz-active"),l||n(),l=!0,r.hidden=!1,m(),r.scrollIntoView({block:"nearest",behavior:"smooth"})}return o.onclick=()=>l?d():E(),r.onkeydown=y=>{y.key==="Escape"&&(y.stopPropagation(),d())},new MutationObserver(m).observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),m(),{close:d,open:E,reset(){d(),c=[],a=0,h=null,f(),m()},context(){let y=Ut[a];return{available:!0,open:l,index:a,total:Ut.length,completed:c.length===Ut.length,question:y?u(y.prompt):null,concept:y?.id,options:y?.options.map(u),selected:c[a]??null,answered:c[a]!==void 0,score:c.filter((S,A)=>S===Ut[A].correct).length}}}}function Vu({language:i,coach:e,quiz:t,training:n,highlight:s,reveal:r}){let o=ee=>ee[i()==="zh"?1:0],a=!1,c=!1,l="intro",h=0,u="act",f=[],p=!1;try{a=JSON.parse(localStorage.getItem("robot-learning-v2"))?.unlocked===!0,c=a}catch{}a&&(l="independent");let _=document.createElement("section");_.id="coach-lesson",e.mount.prepend(_);let x=document.createElement("details");x.id="teacher-questions";let m=document.createElement("summary");x.append(m);for(let ee of[...e.mount.children])ee!==_&&x.append(ee);e.mount.append(x);let d=document.createElement("button");d.id="open-lesson",document.querySelector(".header-right").prepend(d);let E=document.createElement("div");E.id="learning-lock",document.querySelector(".viewport-arm-bar").before(E);let y=document.createElement("div");y.id="teacher-home";let S=document.getElementById("coach");y.append(S),S.classList.add("docked");function A(){innerWidth<1200&&!a?document.getElementById("viewport").after(y):document.getElementById("program-panel").prepend(y),e.fit()}A(),window.addEventListener("resize",A);let w=[["Joints rotate","\u5173\u8282\u4F1A\u65CB\u8F6C"],["Links connect joints","\u8FDE\u6746\u8FDE\u63A5\u5173\u8282"],["Tools do the work","\u672B\u7AEF\u5DE5\u5177\u6267\u884C\u4EFB\u52A1"],["Position and orientation","\u4F4D\u7F6E\u4E0E\u59FF\u6001"],["Command and feedback","\u547D\u4EE4\u4E0E\u53CD\u9988"],["Build a sequence","\u7F16\u6392\u7A0B\u5E8F"]],C=[["Raise to a safe travel height","\u62AC\u9AD8\u5230\u5B89\u5168\u79FB\u52A8\u9AD8\u5EA6","First move up before travelling across the workspace.","\u5148\u62AC\u9AD8\uFF0C\u518D\u6A2A\u5411\u79FB\u52A8\u3002"],["Approach above object A","\u79FB\u52A8\u5230\u7269\u4F53 A \u4E0A\u65B9","Keep clearance while moving sideways.","\u6A2A\u5411\u79FB\u52A8\u65F6\u4FDD\u6301\u8DB3\u591F\u95F4\u9699\u3002"],["Lower around object A","\u4E0B\u964D\u5230\u7269\u4F53 A","The open jaws must surround the block before closing.","\u95ED\u5408\u524D\uFF0C\u8BA9\u5F20\u5F00\u7684\u5939\u722A\u5305\u56F4\u65B9\u5757\u3002"],["Close the gripper","\u95ED\u5408\u5939\u722A","Activate DO1 and check that DI1 confirms pickup.","\u6FC0\u6D3B DO1\uFF0C\u5E76\u68C0\u67E5 DI1 \u786E\u8BA4\u5DF2\u6293\u53D6\u3002"],["Wait for pickup feedback","\u7B49\u5F85\u6293\u53D6\u53CD\u9988","A recorded Wait DI1 = ON prevents the program lifting before pickup is confirmed.","\u8BB0\u5F55\u7B49\u5F85 DI1 = ON\uFF0C\u53EF\u9632\u6B62\u7A0B\u5E8F\u5728\u786E\u8BA4\u6293\u53D6\u524D\u62AC\u8D77\u3002"],["Lift clear","\u5411\u4E0A\u62AC\u8D77","Lift vertically before carrying the block across the scene.","\u5148\u5782\u76F4\u62AC\u8D77\uFF0C\u518D\u642C\u8FD0\u65B9\u5757\u3002"],["Travel above target A","\u79FB\u52A8\u5230\u76EE\u6807 A \u4E0A\u65B9","Carry the object at clearance height.","\u5728\u5B89\u5168\u9AD8\u5EA6\u642C\u8FD0\u7269\u4F53\u3002"],["Lower onto target A","\u4E0B\u964D\u5230\u76EE\u6807 A","Lower gently before releasing; do not drop from travel height.","\u8F7B\u8F7B\u4E0B\u964D\u518D\u91CA\u653E\uFF0C\u4E0D\u8981\u4ECE\u79FB\u52A8\u9AD8\u5EA6\u629B\u4E0B\u3002"],["Release the block","\u91CA\u653E\u65B9\u5757","Switch DO1 OFF and check the target dashboard.","\u5173\u95ED DO1\uFF0C\u5E76\u68C0\u67E5\u76EE\u6807\u9762\u677F\u3002"],["Retreat upwards","\u5411\u4E0A\u64A4\u79BB","Move the empty tool clear of the placed object.","\u5C06\u7A7A\u5DE5\u5177\u79FB\u79BB\u5DF2\u653E\u7F6E\u7684\u7269\u4F53\u3002"]],L=()=>o(C[h]?.slice(0,2)||["Practice","\u7EC3\u4E60"]);function v(ee,ce){let Me=document.createElement("button");return Me.type="button",Me.textContent=ee,Me.onclick=ce,Me}function b(ee,ce){let Me=document.createElement("p");return Me.textContent=ee,ce&&(Me.className=ce),_.append(Me),Me}function D(){s(null),document.querySelectorAll(".quiz-highlight").forEach(ee=>ee.classList.remove("quiz-highlight"))}function O(){if(l!=="repeat")return[];let ee=f[h];return u==="record"?[ee.type==="move"?"record":"add-output"]:ee.type==="move"?["tx","ty","tz","lesson-move"]:ee.type==="output"?[ee.value?"tool-on":"tool-off"]:["add-wait"]}document.querySelector("#target-form button[type=submit]").id="lesson-move";let V=["#controls-panel","#program-panel .program",".viewport-arm-bar",".challenge-tool","#targets","#reset-task"];function Y(){let ee=O();for(let ce of V){let Me=document.querySelector(ce);if(Me){Me.inert=!a&&[".viewport-arm-bar",".challenge-tool","#targets","#reset-task"].includes(ce),Me.classList.toggle("exercise-locked",!a&&l!=="repeat");for(let $ of Me.querySelectorAll("button,input,select"))$.inert=!a&&!ee.includes($.id);Me.matches("button")&&(Me.inert=!a)}}document.body.classList.toggle("learning-active",!a),document.body.dataset.lessonStage=l,E.hidden=a,E.textContent=o(["Learn \u2192 Watch \u2192 Repeat \u2192 Run \u2192 Quiz \u2192 Independent task","\u5B66\u4E60 \u2192 \u89C2\u770B \u2192 \u8DDF\u7EC3 \u2192 \u8FD0\u884C \u2192 \u6D4B\u9A8C \u2192 \u72EC\u7ACB\u4EFB\u52A1"])}function X(ee){r(ee==="record"||ee==="add-output"||ee==="add-wait"?"record":ee),document.getElementById(ee)?.classList.add("quiz-highlight")}function q(){t.close(),a=!1,c=!1,A(),n.begin(),f=n.plan(),l="demo",p=!1,n.demo(),J()}function ie(){n.repeat(),h=0,u="act",l="repeat",n.prepare(f[h]),J()}function R(){if(!c){ue();return}n.finish(),l="quiz",D(),J(),t.open()}function Z(){l="practice-run",p=!1,n.play(),J()}function J(){m.textContent=o(["Ask your teacher \xB7 help and questions","\u5411\u8001\u5E08\u63D0\u95EE \xB7 \u5E2E\u52A9\u4E0E\u95EE\u9898"]),d.textContent=o(["Lesson","\u8BFE\u7A0B"]),Y(),l!=="quiz"&&D(),_.replaceChildren(),S.classList.remove("tour-mode"),b(o(["YOUR TEACHER \xB7 LEARN BY DOING","\u4F60\u7684\u8001\u5E08 \xB7 \u505A\u4E2D\u5B66"]),"lesson-progress");let ee=document.createElement("h2");if(_.append(ee),l==="intro")ee.textContent=o(["Meet your robot","\u8BA4\u8BC6\u4F60\u7684\u673A\u5668\u4EBA"]),b(o(["A robot is a programmable machine that senses or acts in its environment. This arm uses rotating joints, rigid links and a tool to move objects. Robots can repeat precise tasks such as sorting and assembly.","\u673A\u5668\u4EBA\u662F\u4E00\u79CD\u53EF\u7F16\u7A0B\u7684\u673A\u5668\uFF0C\u53EF\u4EE5\u611F\u77E5\u73AF\u5883\u6216\u6267\u884C\u52A8\u4F5C\u3002\u8FD9\u4E2A\u673A\u68B0\u81C2\u7528\u65CB\u8F6C\u5173\u8282\u3001\u521A\u6027\u8FDE\u6746\u548C\u5DE5\u5177\u6765\u79FB\u52A8\u7269\u4F53\u3002\u673A\u5668\u4EBA\u80FD\u91CD\u590D\u6267\u884C\u5206\u62E3\u3001\u88C5\u914D\u7B49\u7CBE\u786E\u4EFB\u52A1\u3002"])),b(o(["It cannot reach everywhere, pass through obstacles or grasp every material. This is a simplified training simulation, not a real robot safety system.","\u5B83\u65E0\u6CD5\u5230\u8FBE\u6240\u6709\u4F4D\u7F6E\u3001\u7A7F\u8FC7\u969C\u788D\u7269\u6216\u6293\u53D6\u6240\u6709\u6750\u6599\u3002\u8FD9\u662F\u7B80\u5316\u7684\u8BAD\u7EC3\u6A21\u62DF\u5668\uFF0C\u4E0D\u662F\u771F\u5B9E\u673A\u5668\u4EBA\u7684\u5B89\u5168\u7CFB\u7EDF\u3002"])),b(o(["First I explain the controls, then demonstrate moving A. You repeat each action, take a quiz, and finally move both objects independently.","\u6211\u5148\u4ECB\u7ECD\u63A7\u4EF6\uFF0C\u518D\u6F14\u793A\u642C\u8FD0 A\u3002\u4F60\u8DDF\u7740\u91CD\u590D\u6BCF\u4E00\u6B65\uFF0C\u5B8C\u6210\u6D4B\u9A8C\uFF0C\u6700\u540E\u72EC\u7ACB\u642C\u8FD0\u4E24\u4E2A\u7269\u4F53\u3002"])),_.append(v(o(["Explore the robot \u2192","\u8BA4\u8BC6\u673A\u68B0\u81C2 \u2192"]),()=>{l="tour",h=0,J()}));else if(l==="tour"){let ce=Ut[h];ee.textContent=o(w[h]),b(`${h+1} / 6`,"lesson-progress"),b(o(ce.explain)),b(o(["Look for the yellow highlight. We will use these controls together next.","\u8BF7\u770B\u9EC4\u8272\u9AD8\u4EAE\u3002\u63A5\u4E0B\u6765\u6211\u4EEC\u4F1A\u4E00\u8D77\u4F7F\u7528\u8FD9\u4E9B\u63A7\u4EF6\u3002"]),"lesson-look"),ce.target&&s(ce.target),ce.ui&&X(ce.ui),_.append(v(o(["Back","\u4E0A\u4E00\u6B65"]),()=>{h?h--:l="intro",J()}),v(o(h===5?["Watch teacher demonstrate \u2192","\u89C2\u770B\u8001\u5E08\u6F14\u793A \u2192"]:["Next \u2192","\u4E0B\u4E00\u6B65 \u2192"]),()=>{h===5?q():(h++,J())}))}else if(l==="demo"){ee.textContent=o(["Watch: move A to its target","\u89C2\u770B\uFF1A\u628A A \u642C\u5230\u76EE\u6807\u533A"]),b(o(["Watch the robot and the highlighted program row. Notice the order: lift \u2192 approach \u2192 lower \u2192 grip \u2192 confirm \u2192 lift \u2192 travel \u2192 lower \u2192 release \u2192 retreat.","\u89C2\u5BDF\u673A\u5668\u4EBA\u548C\u9AD8\u4EAE\u7A0B\u5E8F\u884C\u3002\u6CE8\u610F\u987A\u5E8F\uFF1A\u62AC\u9AD8 \u2192 \u63A5\u8FD1 \u2192 \u4E0B\u964D \u2192 \u5939\u53D6 \u2192 \u786E\u8BA4 \u2192 \u62AC\u8D77 \u2192 \u642C\u8FD0 \u2192 \u4E0B\u964D \u2192 \u91CA\u653E \u2192 \u64A4\u79BB\u3002"]));let ce=b("","lesson-look");ce.id="lesson-live",_.append(v(o(["Pause / resume demo","\u6682\u505C / \u7EE7\u7EED\u6F14\u793A"]),()=>document.getElementById("pause").click()),v(o(["Restart demonstration","\u91CD\u65B0\u6F14\u793A"]),q))}else if(l==="repeat-ready")ee.textContent=o(["Now you try","\u73B0\u5728\u4F60\u6765\u8BD5\u8BD5"]),b(o(["A is placed. Now repeat the same task using the real controls. I will provide each coordinate and highlight the next action. Record each movement and tool command as you go.","A \u5DF2\u653E\u597D\u3002\u73B0\u5728\u4F7F\u7528\u771F\u5B9E\u63A7\u4EF6\u91CD\u590D\u4EFB\u52A1\u3002\u6211\u4F1A\u63D0\u4F9B\u5750\u6807\u5E76\u9AD8\u4EAE\u4E0B\u4E00\u6B65\u64CD\u4F5C\u3002\u8BF7\u9010\u6B65\u8BB0\u5F55\u79FB\u52A8\u548C\u5DE5\u5177\u6307\u4EE4\u3002"])),_.append(v(o(["Repeat with guidance \u2192","\u5F00\u59CB\u8DDF\u7EC3 \u2192"]),ie),v(o(["Watch again","\u518D\u770B\u4E00\u6B21"]),q));else if(l==="demo-error")ee.textContent=o(["Demonstration stopped","\u6F14\u793A\u5DF2\u505C\u6B62"]),b(o(["The robot did not finish placing A. Restart the demonstration to restore the practice scene.","\u673A\u5668\u4EBA\u672A\u5B8C\u6210\u653E\u7F6E A\u3002\u8BF7\u91CD\u65B0\u6F14\u793A\u4EE5\u6062\u590D\u7EC3\u4E60\u573A\u666F\u3002"])),_.append(v(o(["Restart demonstration","\u91CD\u65B0\u6F14\u793A"]),q));else if(l==="repeat"){let ce=f[h];ee.textContent=`${h+1} / ${f.length} \xB7 ${L()}`,b(o(C[h].slice(2)));let Me;if(u==="record")Me=ce.type==="move"?o(["Position reached. Click Record current position to save this waypoint.","\u5DF2\u5230\u8FBE\u3002\u70B9\u51FB\u201C\u8BB0\u5F55\u5F53\u524D\u4F4D\u7F6E\u201D\u4FDD\u5B58\u8DEF\u5F84\u70B9\u3002"]):o(["Signal checked. Click Set DO1 to record this tool command.","\u4FE1\u53F7\u5DF2\u68C0\u67E5\u3002\u70B9\u51FB\u201C\u8BBE\u7F6E DO1\u201D\u8BB0\u5F55\u5DE5\u5177\u6307\u4EE4\u3002"]);else if(ce.type==="move"){let $=n.target(ce).map(K=>K.toFixed(1)).join(", ");Me=o([`Target XYZ: ${$} mm. Coordinates are filled in. Click Move to XYZ and watch the tool position change.`,`\u76EE\u6807 XYZ\uFF1A${$} \u6BEB\u7C73\u3002\u5750\u6807\u5DF2\u586B\u597D\u3002\u70B9\u51FB\u201C\u79FB\u52A8\u5230 XYZ\u201D\uFF0C\u89C2\u5BDF\u5DE5\u5177\u4F4D\u7F6E\u53D8\u5316\u3002`])}else Me=ce.type==="wait"?o(["Click Wait DI1 to record the confirmation step (ON).","\u70B9\u51FB\u201C\u7B49\u5F85 DI1\u201D\u8BB0\u5F55\u786E\u8BA4\u6B65\u9AA4\uFF08ON\uFF09\u3002"]):o(ce.value?["Click ON \xB7 Activate. DI1 must turn ON before continuing.","\u70B9\u51FB\u201CON \xB7 \u6FC0\u6D3B\u201D\u3002\u7EE7\u7EED\u524D DI1 \u5FC5\u987B\u53D8\u4E3A ON\u3002"]:["Click OFF \xB7 Release. Object A must land in its target.","\u70B9\u51FB\u201COFF \xB7 \u91CA\u653E\u201D\u3002\u7269\u4F53 A \u5FC5\u987B\u653E\u5165\u76EE\u6807\u533A\u3002"]);b(Me,"lesson-look");for(let $ of O())X($);_.append(v(o(["Restore this target","\u6062\u590D\u672C\u6B65\u76EE\u6807"]),()=>{n.prepare(ce),J()}),v(o(["Restart guided practice","\u91CD\u65B0\u8DDF\u7EC3"]),ie))}else if(l==="run-ready"||l==="run-error")ee.textContent=o(l==="run-ready"?["Play the program you built","\u8FD0\u884C\u4F60\u7F16\u5199\u7684\u7A0B\u5E8F"]:["The program stopped early","\u7A0B\u5E8F\u63D0\u524D\u505C\u6B62"]),b(o(l==="run-ready"?["All ten instructions are recorded. Now press Run your program: the scene resets and the robot executes your own recorded moves, DO1 commands and DI1 wait. Watch it place A without manual help.","\u5341\u6761\u6307\u4EE4\u5DF2\u8BB0\u5F55\u3002\u70B9\u51FB\u201C\u8FD0\u884C\u4F60\u7684\u7A0B\u5E8F\u201D\uFF1A\u573A\u666F\u91CD\u7F6E\u540E\uFF0C\u673A\u5668\u4EBA\u5C06\u6267\u884C\u4F60\u8BB0\u5F55\u7684\u79FB\u52A8\u3001DO1 \u6307\u4EE4\u548C DI1 \u7B49\u5F85\u3002\u89C2\u5BDF\u5B83\u81EA\u52A8\u653E\u597D A\u3002"]:["The run did not finish successfully. Retry from the reset scene, or repeat the guided practice.","\u7A0B\u5E8F\u672A\u6210\u529F\u5B8C\u6210\u3002\u8BF7\u91CD\u7F6E\u540E\u91CD\u8BD5\uFF0C\u6216\u91CD\u65B0\u8DDF\u7EC3\u3002"])),_.append(v(o(["\u25B6 Run your program","\u25B6 \u8FD0\u884C\u4F60\u7684\u7A0B\u5E8F"]),Z),v(o(["Repeat guided practice","\u91CD\u65B0\u8DDF\u7EC3"]),ie));else if(l==="practice-run"){ee.textContent=o(["Your program is running","\u4F60\u7684\u7A0B\u5E8F\u6B63\u5728\u8FD0\u884C"]),b(o(["Watch each recorded instruction execute. Check DI1 during pickup and the target dashboard after release. Finish the run to continue to the quiz.","\u89C2\u5BDF\u6BCF\u6761\u5DF2\u8BB0\u5F55\u6307\u4EE4\u6267\u884C\u3002\u6293\u53D6\u65F6\u68C0\u67E5 DI1\uFF0C\u91CA\u653E\u540E\u68C0\u67E5\u76EE\u6807\u9762\u677F\u3002\u8FD0\u884C\u5B8C\u6210\u540E\u5373\u53EF\u7EE7\u7EED\u6D4B\u9A8C\u3002"]));let ce=b("","lesson-look");ce.id="lesson-live",_.append(v(o(["Pause / resume","\u6682\u505C / \u7EE7\u7EED"]),()=>document.getElementById("pause").click()),v(o(["Stop program","\u505C\u6B62\u7A0B\u5E8F"]),()=>document.getElementById("stop").click()))}else l==="quiz-ready"?(ee.textContent=o(["Your program worked!","\u4F60\u7684\u7A0B\u5E8F\u6210\u529F\u4E86\uFF01"]),b(o(["Your recorded program placed A and completed its retreat. You can run it again, or take the quiz. Your previous saved program will be restored when you continue.","\u4F60\u8BB0\u5F55\u7684\u7A0B\u5E8F\u5DF2\u653E\u597D A \u5E76\u5B8C\u6210\u64A4\u79BB\u3002\u53EF\u4EE5\u518D\u6B21\u8FD0\u884C\uFF0C\u6216\u5F00\u59CB\u6D4B\u9A8C\u3002\u7EE7\u7EED\u540E\u5C06\u6062\u590D\u539F\u6709\u4FDD\u5B58\u7684\u7A0B\u5E8F\u3002"])),_.append(v(o(["\u25B6 Run again","\u25B6 \u518D\u6B21\u8FD0\u884C"]),Z),v(o(["Take the quiz \u2192","\u5F00\u59CB\u6D4B\u9A8C \u2192"]),R))):l==="quiz"?(ee.textContent=o(["Check your understanding","\u68C0\u67E5\u7406\u89E3"]),b(o(["Answer the quiz beside the robot. Use the highlighted model parts and controls. You can ask me for a hint; I will not choose the answer for you.","\u5B8C\u6210\u673A\u68B0\u81C2\u65C1\u7684\u6D4B\u9A8C\uFF0C\u89C2\u5BDF\u9AD8\u4EAE\u90E8\u4EF6\u548C\u63A7\u4EF6\u3002\u4F60\u53EF\u4EE5\u5411\u6211\u8BE2\u95EE\u63D0\u793A\uFF0C\u4F46\u6211\u4E0D\u4F1A\u66FF\u4F60\u9009\u62E9\u7B54\u6848\u3002"])),_.append(v(o(["Show quiz","\u663E\u793A\u6D4B\u9A8C"]),()=>t.open()))):(ee.textContent=o(["Your independent challenge","\u4F60\u7684\u72EC\u7ACB\u6311\u6218"]),b(o(["Move both A and B to their matching target areas. B starts on an obstacle: plan clearance before travelling. Build a program with movements, DO1 commands and DI1 feedback. I can help you plan, but you choose the steps.","\u628A A \u548C B \u642C\u5230\u5BF9\u5E94\u76EE\u6807\u533A\u3002B \u4F4D\u4E8E\u969C\u788D\u7269\u4E0A\uFF0C\u8BF7\u5148\u89C4\u5212\u5B89\u5168\u95F4\u9699\u3002\u7528\u79FB\u52A8\u3001DO1 \u6307\u4EE4\u548C DI1 \u53CD\u9988\u7F16\u5199\u7A0B\u5E8F\u3002\u6211\u53EF\u4EE5\u5E2E\u52A9\u89C4\u5212\uFF0C\u4F46\u6B65\u9AA4\u7531\u4F60\u51B3\u5B9A\u3002"])),_.append(v(o(["Review lesson","\u590D\u4E60\u8BFE\u7A0B"]),()=>{l="intro",J()})));e.fit()}function ue(){a&&r("record"),e.showLesson(!1),J()}function ve(){c&&(a=!0,l="independent",localStorage.setItem("robot-learning-v2",JSON.stringify({unlocked:!0})),J(),A(),e.collapse())}return setInterval(()=>{if(l!=="demo"&&l!=="repeat"&&l!=="practice-run")return;let ee=n.state();if(l==="practice-run"){p||(p=ee.busy);let K=document.getElementById("lesson-live");K&&(K.textContent=o(["Running your instructions","\u6B63\u5728\u6267\u884C\u4F60\u7684\u6307\u4EE4"])+` \xB7 ${Math.max(0,ee.active+1)} / ${ee.steps.length}`),p&&!ee.busy&&(ee.score===1&&ee.completed?(c=!0,t.reset(),l="quiz-ready"):l="run-error",J());return}if(l==="demo"){p||(p=ee.busy);let K=document.getElementById("lesson-live");K&&(K.textContent=o(["Teacher demonstration","\u8001\u5E08\u6F14\u793A"])+` \xB7 ${ee.active+1} / ${f.length}`+(ee.active>=0?" \xB7 "+o(C[ee.active]?.slice(0,2)||["",""]):"")),p&&!ee.busy&&(l=ee.score===1?"repeat-ready":"demo-error",J());return}if(l!=="repeat"||ee.busy)return;let ce=f[h];if(u==="act"&&ce.type!=="wait"){(ce.type==="move"?Math.hypot(...ee.tcp.map((_e,Ie)=>_e-n.target(ce)[Ie]))<.8:ee.output===ce.value&&(ce.value?ee.input:ee.score===1))&&(u="record",J());return}let Me=ee.steps[h];ee.steps.length!==h+1||!Me||Me.type!==ce.type||!(ce.type==="move"?Math.hypot(...n.target(Me).map((K,_e)=>K-n.target(ce)[_e]))<.8:Me.value===ce.value)||(h++,u="act",h===f.length?l="run-ready":n.prepare(f[h]),J())},150),d.onclick=ue,document.getElementById("open-quiz").onclick=R,new MutationObserver(J).observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),J(),a?e.collapse():e.showLesson(!1),{open:ue,startQuiz:R,complete:ve,context:()=>({lessonComplete:c,unlocked:a,stage:l,lessonStep:h,phase:u,instruction:_.innerText,allowedControls:O()})}}var Ha=null,Zi=null,xc=null,j=i=>document.getElementById(i),Wn="en",je=3,lt="gripper",Ke=[...Vt.home],Ye=[],_n={},$i=!0,yc="sliders";for(let i of Pr)for(let e=3;e<=6;e++)_n[`${i}-${e}`]=[];var bt=null,Si=null,Ot=!1,Rn=!1,rn=-1,Gu=performance.now(),ks="taskReady",vc=!1,Jt,zs=()=>`${lt}-${je}`,He=i=>((Wn==="en"?Lt:Nt)[i]||i).replaceAll("{n}",String(je)).replaceAll("{reach}",String(Qi(je)));try{let i=localStorage.getItem("robot-arm-lab-v3");if(i){let e=JSON.parse(i);for(let t of Pr)for(let n=3;n<=6;n++){let s=`${t}-${n}`;_n[s]=Ws({version:3,jointCount:n,tool:t,steps:e.programs[s]||[]}).steps}Number.isInteger(e.activeJointCount)&&e.activeJointCount>=3&&e.activeJointCount<=6&&(je=e.activeJointCount),Pr.includes(e.tool)&&(lt=e.tool),$i=e.showTrail!==!1}else{let e=localStorage.getItem("robot-arm-lab-v2");if(e){let t=JSON.parse(e);for(let n=3;n<=6;n++)_n[`gripper-${n}`]=Ws({version:2,jointCount:n,steps:t.programs[n]||[]}).steps;Number.isInteger(t.activeJointCount)&&t.activeJointCount>=3&&t.activeJointCount<=6&&(je=t.activeJointCount),$i=t.showTrail!==!1}else{let t=localStorage.getItem("robot-arm-lab-v1");t&&(_n["gripper-3"]=Ws(JSON.parse(t)).steps)}}Wn=localStorage.getItem("robot-arm-lang")==="zh"?"zh":"en"}catch{}Ye=_n[zs()];Ke=xn(je);var Ve=new Bs(lt);function tt(i,e=!1,t=!0){ks=i,vc=e,j("notice").textContent=He(i),j("notice").className=e?"error":"",t&&Fu(i,e)&&xc?.reportFailure({code:i,text:He(i),error:e,step:rn>=0?rn+1:null})}try{Jt=Ru(j("viewport")),Jt.setTrail($i)}catch(i){console.error(i),tt("noWebGL",!0)}function Gn(){if(!Zi){_n[zs()]=Ye;try{localStorage.setItem("robot-arm-lab-v3",JSON.stringify({activeJointCount:je,tool:lt,programs:_n,showTrail:$i}))}catch{tt("storage",!0)}}}function $_(){j("active-tool-name").textContent=He(lt),j("challenge-name").textContent=He(lt+"Task"),j("score").textContent=`${Ve.score} / 2`,j("challenge-progress").setAttribute("aria-valuenow",String(Ve.score)),j("challenge-progress").firstElementChild.style.width=Ve.score/2*100+"%",Ve.objects.forEach(i=>{let e=j("dashboard-"+i.id.toLowerCase()),t=i.placed?"delivered":i.status==="held"?"held":i.id==="B"?"raisedItem":"tableItem";e.textContent=i.id+" "+(i.placed?"\u2713":i.status==="held"?"\u2191":"\u25CB"),e.className="dashboard-object "+(i.placed?"done":i.status==="held"?"holding":""),e.title=He(t),e.setAttribute("aria-label",i.id+": "+He(t))})}function Ur(){let i=Ve.input;Ve.update(Ke),!i&&Ve.input&&tt("grasped"),$_(),Jt?.taskState(Ve.snapshot()),j("do-state").textContent=Ve.output?"ON":"OFF",j("di-state").textContent=Ve.input?"ON":"OFF",j("do-state").className=Ve.output?"on":"",j("di-state").className=Ve.input?"on":"",j("tool-on").setAttribute("aria-pressed",String(Ve.output)),j("tool-off").setAttribute("aria-pressed",String(!Ve.output))}function Dr(i){Ke=[...i],Jt?.pose(Ke),Ur();let e=Rt(Ke);["px","py","pz"].forEach((t,n)=>j(t).textContent=(Math.abs(e.tip[n])<.05?0:e.tip[n]).toFixed(1)),["oroll","opitch","oyaw"].forEach((t,n)=>j(t).textContent=(Math.abs(e.rpy[n])<.05?0:e.rpy[n]).toFixed(1)),Ke.forEach((t,n)=>{j("slider"+n).value=t,j("angle"+n).value=t.toFixed(1)}),j("singularity").textContent=He(je===3?Math.abs(Math.sin(Ke[2]*Math.PI/180))<.08?"singular":"normal":"extraMotion")}function Ei(){let i=!!bt||Ot;j("jog-distance").disabled=i,j("jog-angle").disabled=i||je!==6,document.querySelectorAll("[data-jog]").forEach(e=>e.disabled=i||Number(e.dataset.jog)>=3&&je!==6),j("jog-orientation-hint").textContent=He(je===6?"jogOrientation":"jogLocked"),document.querySelectorAll("#joints input,#target-form input,#target-form select,#target-form button,#steps input,#steps button,#steps select").forEach(e=>e.disabled=i),["record","home","demo","import","run","tool-select","tool-on","tool-off","add-output","add-wait","add-delay","instruction-value","reset-task"].forEach(e=>j(e).disabled=i||e==="run"&&!Ye.length),j("add-joint").disabled=i||je===6,j("remove-joint").disabled=i||je===3,document.querySelectorAll("#targets button").forEach(e=>e.disabled=i),j("use-orientation").disabled=i||je!==6,j("branch").hidden=je!==3,j("orientation-fields").hidden=!j("use-orientation").checked,["tr","tp","tw"].forEach(e=>{j(e).disabled=i||!j("use-orientation").checked,j(e).required=j("use-orientation").checked}),j("pause").disabled=!i,j("stop").disabled=!i,j("pause").textContent=He(Rn?"resume":"pause"),j("state").textContent=He(Rn?"paused":Ot?"running":bt?"moving":"ready")}function J_(){j("joints").replaceChildren(),hn.slice(0,je).forEach((i,e)=>{let t=document.createElement("div");t.className="joint",t.innerHTML=`<div class="joint-title"><label for="slider${e}">J${e+1} <span> / ${He(i.name)}</span></label><span class="number"><input id="angle${e}" aria-label="${He(i.name)} angle" type="number" min="${i.limits[0]}" max="${i.limits[1]}" step="0.1">\xB0</span></div><input id="slider${e}" type="range" min="${i.limits[0]}" max="${i.limits[1]}" step="0.1"><div class="joint-limits"><span>${i.limits[0]}\xB0</span><span>${e?i.length+" mm":He("rotation")}</span><span>${i.limits[1]}\xB0</span></div>`,j("joints").append(t);let n=s=>{if(bt||Ot)return;let r=[...Ke];r[e]=s.target.value===""?NaN:Number(s.target.value),Pn(r)&&!Ve.canMove(Ke,r)?(Dr(r),tt("welcome")):(Dr(Ke),tt(Pn(r)&&Ve.canMove(Ke,r)||"blocked",!0))};j("slider"+e).addEventListener("input",n),j("angle"+e).addEventListener("change",n)}),j("joint-count").textContent=`${je} / 6`,j("joint-chain").replaceChildren(),hn.forEach((i,e)=>{let t=document.createElement("span");t.textContent=`J${e+1}`,t.className=e<je?"installed":"",t.title=He(i.name),j("joint-chain").append(t)}),j("arm-info").textContent=He("armInfo")+" "+He(["","","","nextSwivel","nextPitch","nextRoll","allJoints"][je]),j("orientation-hint").textContent=He(je===6?"orientationHelp":"orientationLocked")}function Ji(){j("task-title").textContent=He(lt+"Task"),j("task-description").textContent=He(lt+"Mission"),j("tool-description").textContent=He(lt+"Description"),j("task-rules").textContent=He("taskRules"),j("targets").replaceChildren(),Ve.objects.forEach((i,e)=>{let t=document.createElement("div");t.className="task-card"+(i.placed?" done":"");let n=Ve.spec.targets[e],s=Ve.contact(i);t.innerHTML=`<div class="task-card-heading"><span class="object-badge ${e?"b":""}">${i.id}</span><small>${He(i.placed?"delivered":i.status==="held"?"held":e?"raisedItem":"tableItem")}</small></div><div class="task-coordinates">${He("pickup")} ${s.map(r=>r.toFixed(0)).join(" / ")}<br>${He("destination")} ${n.center[0]} / ${n.center[1]}</div><div class="task-actions"><button data-target="above">${He("approach")}</button><button data-target="pick">${He("pickup")}</button><button data-target="place">${He("destination")}</button></div>`,t.querySelectorAll("button").forEach(r=>r.onclick=()=>{if(bt||Ot)return;let o=r.dataset.target,a=o==="above"?[s[0],s[1],lt==="gripper"?190:170]:o==="pick"?s:[n.center[0],n.center[1],i.size[2]+2];["tx","ty","tz"].forEach((c,l)=>j(c).value=a[l].toFixed(2)),je===6&&lt!=="gripper"&&(j("use-orientation").checked=!0,j("tr").value=0,j("tp").value=0,j("tw").value=(Math.atan2(a[1],a[0])*180/Math.PI).toFixed(2)),j("challenge-menu").open=!1,Hs("controls"),Nr("xyz"),Ei(),tt("coordinatesFilled")}),j("targets").append(t)}),j("score").textContent=`${Ve.score} / 2`,j("task-feedback").textContent=Ve.score===2?He("taskWon"):He(Ve.lastEvent),Ur()}function on(){j("steps").replaceChildren(),j("count").textContent=Ye.length,j("empty").hidden=Ye.length>0,Ye.forEach((i,e)=>{let t=i.type||"move",n=document.createElement("li");n.className=e===rn?"active":"";let s="";t==="move"?s=`<div class="step-details">XYZ ${Rt(i.q).tip.map(c=>c.toFixed(1)).join(" / ")} mm</div>`:(t==="output"||t==="wait")&&(s=`<select class="step-value" aria-label="${t==="output"?"DO1":"DI1"} ${e+1}"><option value="true">${t==="output"?"DO1":"DI1"} = ON / 1</option><option value="false">${t==="output"?"DO1":"DI1"} = OFF / 0</option></select>`),n.innerHTML=`<div class="step-top"><span>${String(e+1).padStart(2,"0")}</span><span class="step-type">${{move:"MOVE",output:"DO1",wait:"WAIT",delay:"DELAY"}[t]}</span><input class="step-name" maxlength="60" aria-label="Step ${e+1} name"></div>${s}<div class="step-bottom"><label>${t==="wait"?He("timeout")+" ":""}<input type="number" min="${t==="move"?.5:.1}" max="${t==="move"?15:30}" step="any" aria-label="Step ${e+1} seconds"> ${He("seconds")}</label>${t==="move"?`<button data-action="go">${He("go")}</button>`:""}<button data-action="up" aria-label="${He("up")}">\u2191</button><button data-action="down" aria-label="${He("down")}">\u2193</button><button data-action="remove" aria-label="${He("remove")}">\xD7</button></div>`,n.querySelector(".step-name").value=i.name,n.querySelector(".step-name").onchange=a=>{i.name=a.target.value.trim()||`${He("step")} ${e+1}`,Gn(),on()};let r=n.querySelector(".step-value");r&&(r.value=String(i.value),r.onchange=()=>{i.value=r.value==="true",Gn()});let o=n.querySelector("input[type=number]");o.value=i.seconds,o.onchange=()=>{let a=Number(o.value);a>=(t==="move"?.5:.1)&&a<=(t==="move"?15:30)&&(i.seconds=a),o.value=i.seconds,Gn()},n.querySelectorAll("button").forEach(a=>a.onclick=()=>{if(!(bt||Ot)){switch(a.dataset.action){case"go":Or(i.q,i.seconds);break;case"up":e>0&&([Ye[e-1],Ye[e]]=[Ye[e],Ye[e-1]]);break;case"down":e<Ye.length-1&&([Ye[e+1],Ye[e]]=[Ye[e],Ye[e+1]]);break;case"remove":Ye.splice(e,1);break}Gn(),on()}}),j("steps").append(n)}),Ei()}function Lr(){document.documentElement.lang=Wn,document.querySelectorAll("[data-t]").forEach(i=>i.innerHTML=He(i.dataset.t)),j("language").textContent=Wn==="en"?"\u4E2D\u6587":"English",j("show-trail").checked=$i,j("tool-select").value=lt,J_(),Dr(Ke),Ji(),on(),tt(ks,vc,!1),Ei()}function Va(){bt=null,Si=null,rn=-1,Ve.reset(lt),Ke=xn(je),Jt?.clearTrail(),Dr(Ke),Ji(),on(),tt("taskReady")}function Ga(i,e=lt){let t=e!==lt;bt||Ot||i<3||i>6||!Pr.includes(e)||(_n[zs()]=Ye,je=i,lt=e,Ye=_n[zs()],Ke=xn(i),Ve.reset(lt),rn=-1,j("use-orientation").checked=lt!=="gripper"&&i===6,Jt?.clearTrail(),Lr(),Gn(),tt(t?"toolChanged":"armChanged"))}function Or(i,e=2){let t=Ve.canMove(Ke,i);return t?(tt(t,!0),!1):(bt={from:[...Ke],to:[...i],elapsed:0,duration:e},Rn=!1,tt("moving"),Ei(),!0)}function ji(i="stopped",e=!1){bt=null,Si=null,Ot=!1,Rn=!1,rn=-1,on(),tt(i,e)}function za(){if(rn++,rn>=Ye.length){Ot=!1,rn=-1,bt=null,Si=null,on(),Ji(),tt(Ve.score===2?"taskWon":"complete");return}let i=Ye[rn],e=i.type||"move";if(Si=null,e==="move"){if(!Or(i.q,i.seconds)){ji(ks,!0);return}}else e==="output"&&(Ve.command(i.value,Ke),Ur(),Ji(),tt(Ve.lastEvent)),Si={type:e,elapsed:0,step:i},Ei();on();let t=j("steps"),n=t.children[rn];if(n&&!Zi){let s=document.querySelector(".right-program"),r=n.getBoundingClientRect().bottom-s.getBoundingClientRect().bottom;r>0&&(s.scrollTop+=r+20)}}function Wu(i){let e=Math.min((i-Gu)/1e3,.1)*Number(j("speed").value);if(Gu=i,!Rn){if(bt){bt.elapsed+=e;let t=Math.min(1,bt.elapsed/bt.duration),n=t*t*(3-2*t),s=bt.from.map((o,a)=>o+(bt.to[a]-o)*n),r=Ve.collision(s);r?ji(r,!0):(Dr(s),t>=1&&(bt=null,Ot?za():(tt("ready"),Ei(),Ji())))}else if(Ot&&Si){Si.elapsed+=e;let{type:t,step:n,elapsed:s}=Si;t==="wait"?Ve.input===n.value?za():s>=n.seconds&&ji("waitTimeout",!0):s>=n.seconds&&za()}}requestAnimationFrame(Wu)}j("target-form").onsubmit=i=>{if(i.preventDefault(),bt||Ot)return;let e=n=>n.map(s=>j(s).value===""?NaN:Number(j(s).value)),t=Gs(e(["tx","ty","tz"]),Ke,j("branch").value,j("use-orientation").checked?e(["tr","tp","tw"]):null);t.error?tt(t.error,!0):Or(t.q)};j("copy-pose").onclick=()=>{let i=Rt(Ke);["tx","ty","tz"].forEach((e,t)=>j(e).value=i.tip[t].toFixed(2)),["tr","tp","tw"].forEach((e,t)=>j(e).value=i.rpy[t].toFixed(2)),tt("poseCopied")};j("use-orientation").onchange=Ei;j("home").onclick=()=>Or(xn(je));j("add-joint").onclick=()=>Ga(je+1);j("remove-joint").onclick=()=>Ga(je-1);j("record").onclick=()=>{if(Ye.length>=200){tt("max",!0);return}Ye.push({type:"move",name:`${He("step")} ${Ye.length+1}`,q:[...Ke],seconds:2}),Gn(),on(),tt("recorded")};j("run").onclick=()=>{if(!Ye.length){tt("emptyProgram",!0);return}Va(),Ot=!0,Rn=!1,rn=-1,za()};j("pause").onclick=()=>{Rn=!Rn,Ei()};j("stop").onclick=()=>ji();j("reset-task").onclick=()=>Va();j("demo").onclick=()=>{let i=gc(lt,je);if(i.error){tt(i.error,!0);return}Ye.length&&!confirm(He("replaceExample"))||(Ye=i.steps,Gn(),Va(),on(),tt("loadedTask"))};j("export").onclick=()=>{let i={version:3,robot:"robot-arm-task-lab",jointCount:je,tool:lt,units:"mm-degrees",steps:Ye},e=document.createElement("a"),t=URL.createObjectURL(new Blob([JSON.stringify(i,null,2)],{type:"application/json"}));e.href=t,e.download=`robot-arm-${lt}-${je}-joints.json`,e.click(),setTimeout(()=>URL.revokeObjectURL(t),1e3),tt("exported")};j("import").onclick=()=>j("file").click();j("file").onchange=async i=>{let e=i.target.files[0];if(e)try{if(e.size>25e4)throw Error("size");let t=Ws(JSON.parse(await e.text()));if(bt||Ot)return;let n=t.tool||"gripper",s=`${n}-${t.jointCount}`;if(_n[s].length&&!confirm(He("replaceImport")))return;_n[zs()]=Ye,s===zs()&&(Ye=t.steps),_n[s]=t.steps,Ga(t.jointCount,n),Gn(),on(),tt("imported")}catch{tt("badfile",!0)}finally{i.target.value=""}};j("tool-select").onchange=i=>Ga(je,i.target.value);j("tool-on").onclick=()=>{Ve.command(!0,Ke),Ur(),Ji(),tt(Ve.lastEvent)};j("tool-off").onclick=()=>{Ve.command(!1,Ke),Ur(),Ji(),tt(Ve.lastEvent)};function bc(i){if(Ye.length>=200){tt("max",!0);return}let e=j("instruction-value").value==="true";Ye.push({type:i,name:He(i==="output"?"setOutput":i==="wait"?"waitInput":"delay"),seconds:i==="wait"?3:i==="delay"?1:.4,...i!=="delay"?{value:e}:{}}),Gn(),on(),tt("instructionAdded")}j("add-output").onclick=()=>bc("output");j("add-wait").onclick=()=>bc("wait");j("add-delay").onclick=()=>bc("delay");j("language").onclick=()=>{Wn=Wn==="en"?"zh":"en";try{localStorage.setItem("robot-arm-lang",Wn)}catch{}Lr()};j("help").onclick=()=>j("guide").showModal();j("close-guide").onclick=()=>j("guide").close();j("cube-home").onclick=()=>Jt?.view("iso");j("reach").onchange=i=>Jt?.setReach(i.target.checked);j("clear-trail").onclick=()=>Jt?.clearTrail();j("show-trail").onchange=i=>{$i=i.target.checked,Jt?.setTrail($i),Gn()};function Nr(i){yc=i,j("slider-controls").hidden=i!=="sliders",j("target-form").hidden=i!=="xyz",j("jog-controls").hidden=i!=="jog",document.querySelectorAll("[data-mode]").forEach(e=>e.setAttribute("aria-pressed",String(e.dataset.mode===i)))}document.querySelectorAll("[data-mode]").forEach(i=>i.onclick=()=>Nr(i.dataset.mode));document.querySelectorAll("[data-jog]").forEach(i=>i.onclick=()=>{if(bt||Ot)return;let e=Number(i.dataset.jog),t=Number(i.dataset.sign),n=Rt(Ke),s=[...n.tip],r=je===6?[...n.rpy]:null;if(e<3)s[e]+=t*Number(j("jog-distance").value);else{if(!r)return;r[e-3]=(r[e-3]+t*Number(j("jog-angle").value)+540)%360-180}let o=Gs(s,Ke,"nearest",r);o.error?tt(o.error,!0):Or(o.q,.4)});Lr();Nr(yc);requestAnimationFrame(Wu);function Hs(i){document.querySelector("main").dataset.panel=i,document.querySelectorAll("[data-panel-choice]").forEach(e=>e.setAttribute("aria-pressed",String(e.dataset.panelChoice===i)))}document.querySelectorAll("[data-panel-choice]").forEach(i=>i.onclick=()=>Hs(i.dataset.panelChoice));document.addEventListener("keydown",i=>{i.key==="Escape"&&j("challenge-menu").open&&(j("challenge-menu").open=!1,j("challenge-menu").querySelector("summary").focus())});document.addEventListener("click",i=>{j("challenge-menu").contains(i.target)||(j("challenge-menu").open=!1)});var Xu=Hu({onComplete:()=>Ha?.complete(),language:()=>Wn,highlight:i=>Jt?.setQuizTarget(i),onOpen:()=>{Ot&&!Rn&&j("pause").click()},reveal:i=>{Hs(i==="record"?"program":"controls")}}),K_=new ResizeObserver(()=>{j("viewport").style.setProperty("--status-height",document.querySelector(".viewport-status").offsetHeight+"px")});K_.observe(document.querySelector(".viewport-status"));xc=zu(()=>({learning:Ha?.context(),status:{code:ks,text:He(ks),error:vc},quiz:Xu.context(),language:Wn,challenge:He(lt+"Task"),tool:lt,jointCount:je,joints:[...Ke],tcp:Rt(Ke).tip,orientation:Rt(Ke).rpy,score:Ve.score,output:Ve.output,input:Ve.input,playing:Ot,paused:Rn,movementMode:yc,steps:Ye.map(i=>({...i})),world:Ve.snapshot()}),()=>Ha?.startQuiz());var Q_={begin(){document.querySelector(".right-program").scrollTop=0,Zi||(Zi={tool:lt,jointCount:je,steps:structuredClone(Ye),q:[...Ke]}),ji(),lt="gripper",je=3,Ye=[],Ke=xn(3),Ve.reset(lt),j("use-orientation").checked=!1,Lr(),Jt?.clearTrail()},plan(){return gc("gripper",3).steps.slice(0,10)},demo(){Ye=structuredClone(this.plan()),j("speed").value="1",on(),j("run").click()},play(){on(),j("run").click()},repeat(){ji(),Ye=[],Va(),Nr("xyz")},prepare(i){if(i.type==="move"){let e=Rt(i.q).tip;["tx","ty","tz"].forEach((t,n)=>j(t).value=e[n].toFixed(3)),Nr("xyz"),Hs("controls")}else j("instruction-value").value=String(i.value),Hs(i.type==="wait"?"program":"controls")},state(){return{busy:!!bt||Ot,completed:ks==="complete",active:rn,playing:Ot,paused:Rn,q:[...Ke],tcp:Rt(Ke).tip,output:Ve.output,input:Ve.input,score:Ve.score,steps:structuredClone(Ye)}},target(i){return Rt(i.q).tip},finish(){if(!Zi)return;let i=Zi;ji(),Zi=null,lt=i.tool,je=i.jointCount,Ye=i.steps,Ke=xn(je),Ve.reset(lt),Lr(),Jt?.clearTrail()}};Ha=Vu({language:()=>Wn,coach:xc,quiz:Xu,training:Q_,highlight:i=>Jt?.setQuizTarget(i),reveal:i=>Hs(i==="record"?"program":"controls")});})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
