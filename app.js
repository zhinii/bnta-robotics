"use strict";(()=>{function Ic(){let i=document.getElementById("viewport"),e=document.createElement("section");e.id="robot-hud",e.setAttribute("aria-label","Robot controls / \u673A\u68B0\u81C2\u63A7\u5236");let t=document.createElement("div");t.id="pose-strip",t.append(document.querySelector(".telemetry"),document.querySelector(".orientation-readout")),i.append(t);let n=document.getElementById("controls-panel"),s=document.createElement("div");s.id="hud-controls",s.append(n),e.append(s),i.append(e),new ResizeObserver(()=>window.dispatchEvent(new Event("robot-hud-change"))).observe(e),e.addEventListener("pointerdown",r=>r.stopPropagation())}function Pc({language:i,setLanguage:e,course:t}){let n=document.createElement("dialog");n.id="welcome",n.setAttribute("aria-labelledby","welcome-title"),document.body.append(n);let s="language",r=!0,o=(h,u)=>i()==="zh"?u:h;function a(h,u,f=""){let p=document.createElement("button");return p.type="button",p.className=f,p.textContent=h,p.onclick=u,p}function l(h){n.close(),r=!1,h()}function c(){n.replaceChildren();let h=document.createElement("p");h.className="welcome-brand",h.textContent="BNTA ROBOTICS / \u65B0\u82F1\u624D\u673A\u5668\u4EBA\u8BFE\u5802",n.append(h);let u=document.createElement("h1");if(u.id="welcome-title",n.append(u),s==="language"){u.textContent="Choose your language / \u9009\u62E9\u8BED\u8A00";let f=document.createElement("p");f.textContent="Start here. Your lessons and controls will use this language. / \u4ECE\u8FD9\u91CC\u5F00\u59CB\uFF0C\u8BFE\u7A0B\u4E0E\u63A7\u4EF6\u5C06\u4F7F\u7528\u6240\u9009\u8BED\u8A00\u3002",n.append(f);let p=document.createElement("div");p.className="welcome-languages";for(let[_,x]of[["en","English"],["zh","\u7B80\u4F53\u4E2D\u6587"]]){let m=a(x,()=>{if(e(_),!r){n.close();return}s="path",c()});m.lang=_,m.setAttribute("aria-pressed",String(i()===_)),p.append(m)}n.append(p)}else{u.textContent=o("How would you like to start?","\u4F60\u60F3\u5982\u4F55\u5F00\u59CB\uFF1F");let f=document.createElement("p");f.textContent=o("Choose a guided lesson, take a quick look around, or start moving the robot yourself.","\u9009\u62E9\u5F15\u5BFC\u8BFE\u7A0B\u3001\u5FEB\u901F\u8BA4\u8BC6\u754C\u9762\uFF0C\u6216\u76F4\u63A5\u52A8\u624B\u64CD\u63A7\u673A\u68B0\u81C2\u3002"),n.append(f);let p=document.createElement("div");p.className="welcome-paths";for(let[_,x,m]of[[o("01 \xB7 Guided lesson","01 \xB7 \u5F15\u5BFC\u8BFE\u7A0B"),o("Recommended for beginners. Watch the teacher, repeat the task, run your program, then take the quiz.","\u9002\u5408\u521D\u5B66\u8005\u3002\u89C2\u770B\u6F14\u793A\u3001\u8DDF\u7EC3\u4EFB\u52A1\u3001\u8FD0\u884C\u7A0B\u5E8F\uFF0C\u6700\u540E\u5B8C\u6210\u6D4B\u9A8C\u3002"),()=>t.startGuided()],[o("02 \xB7 Quick tour","02 \xB7 \u5FEB\u901F\u5BFC\u89C8"),o("Learn the robot parts and key controls, then explore freely.","\u8BA4\u8BC6\u673A\u68B0\u81C2\u90E8\u4EF6\u548C\u4E3B\u8981\u63A7\u4EF6\uFF0C\u7136\u540E\u81EA\u7531\u63A2\u7D22\u3002"),()=>t.startTour()],[o("03 \xB7 Free practice","03 \xB7 \u81EA\u7531\u7EC3\u4E60"),o("Open all controls immediately. No lesson or quiz required.","\u7ACB\u5373\u4F7F\u7528\u5168\u90E8\u63A7\u4EF6\uFF0C\u65E0\u9700\u5148\u5B8C\u6210\u8BFE\u7A0B\u6216\u6D4B\u9A8C\u3002"),()=>t.freePractice()]]){let d=a("",()=>l(m),"welcome-path"),E=document.createElement("strong");E.textContent=_;let v=document.createElement("span");v.textContent=x,d.append(E,v),p.append(d)}n.append(p,a(o("\u2190 Change language","\u2190 \u66F4\u6539\u8BED\u8A00"),()=>{s="language",c()},"welcome-back"))}r||n.append(a(o("Cancel","\u53D6\u6D88"),()=>n.close(),"welcome-back")),requestAnimationFrame(()=>n.querySelector("button")?.focus())}return n.addEventListener("cancel",h=>{r&&h.preventDefault()}),document.getElementById("language").onclick=()=>{s="language",c(),n.showModal()},c(),n.showModal(),{open(){r=!0,s="path",c(),n.showModal()}}}var hn=[{name:"base",axis:[0,0,1],length:0,limits:[-180,180],home:0},{name:"shoulder",axis:[0,-1,0],length:160,limits:[-20,150],home:55},{name:"elbow",axis:[0,-1,0],length:140,limits:[-150,150],home:-85},{name:"swivel",axis:[0,0,1],length:70,limits:[-150,150],home:0},{name:"wristPitch",axis:[0,-1,0],length:55,limits:[-120,120],home:30},{name:"toolRoll",axis:[1,0,0],length:35,limits:[-180,180],home:0}],Ft={base:70,upper:160,fore:140,limits:hn.map(i=>i.limits),home:hn.slice(0,3).map(i=>i.home)},yn=i=>hn.slice(0,i).map(e=>e.home),td=i=>hn.slice(0,i).reduce((e,t)=>e+t.length,0),cn=Math.PI/180,nd=[1,0,0,0,1,0,0,0,1],id=(i,e)=>i.map((t,n)=>t+e[n]),Dc=(i,e)=>i.map((t,n)=>t-e[n]),sd=(i,e)=>[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]],rd=i=>[i[0],i[3],i[6],i[1],i[4],i[7],i[2],i[5],i[8]],ri=(i,e)=>[0,1,2].map(t=>i[t*3]*e[0]+i[t*3+1]*e[1]+i[t*3+2]*e[2]);function Ln(i,e){return Array.from({length:9},(t,n)=>{let s=Math.floor(n/3),r=n%3;return i[s*3]*e[r]+i[s*3+1]*e[r+3]+i[s*3+2]*e[r+6]})}function zr([i,e,t],n){let s=Math.cos(n),r=Math.sin(n),o=1-s;return[o*i*i+s,o*i*e-r*t,o*i*t+r*e,o*i*e+r*t,o*e*e+s,o*e*t-r*i,o*i*t-r*e,o*e*t+r*i,o*t*t+s]}function od([i,e,t]){return Ln(Ln(zr([0,0,1],t*cn),zr([0,1,0],e*cn)),zr([1,0,0],i*cn))}function ad(i,e){let t=Ln(i,rd(e)),n=Math.acos(Math.max(-1,Math.min(1,(t[0]+t[4]+t[8]-1)/2)));if(n<1e-8)return[0,0,0];let s=[t[7]-t[5],t[2]-t[6],t[3]-t[1]];if(Math.PI-n<1e-5){let r=[t[0],t[4],t[8]].indexOf(Math.max(t[0],t[4],t[8]));s=[0,0,0],s[r]=Math.sqrt(Math.max(0,(t[r*3+r]+1)/2));for(let o=0;o<3;o++)o!==r&&(s[o]=(t[r*3+o]+t[o*3+r])/(4*s[r]));return s.map(o=>o*n)}return s.map(r=>r*n/(2*Math.sin(n)))}function Ya(i){let e=[0,0,Ft.base],t=[...nd],n=[[...e]],s=[],r=[],o=[];i.forEach((h,u)=>{let f=hn[u];s.push([...e]),r.push(ri(t,f.axis)),t=Ln(t,zr(f.axis,h*cn)),o.push([...t]),f.length&&(e=id(e,ri(t,[f.length,0,0])),n.push([...e]))});let a=Math.asin(Math.max(-1,Math.min(1,-t[6]))),l=Math.abs(Math.cos(a))<1e-7,c=[l?0:Math.atan2(t[7],t[8]),a,l?Math.atan2(-t[1],t[4]):Math.atan2(t[3],t[0])].map(h=>h/cn);return{elbow:n[1],tip:e,points:n,origins:s,axes:r,frames:o,rotation:t,rpy:c}}var Za=40,ld=[0,0,-1,0,1,0,1,0,0];function Rt(i){let e=Ya(i),t=ri(e.rotation,[Za,0,0]),n=Ln(e.rotation,ld),s=Math.asin(Math.max(-1,Math.min(1,-n[6]))),r=Math.abs(Math.cos(s))<1e-7;return{...e,flange:[...e.tip],tip:e.tip.map((o,a)=>o+t[a]),rotation:n,rpy:[r?0:Math.atan2(n[7],n[8]),s,r?Math.atan2(-n[1],n[4]):Math.atan2(n[3],n[0])].map(o=>o/cn)}}var Ai=i=>td(i)+Za;function Dn(i){if(!Array.isArray(i)||i.length<3||i.length>6||i.some((t,n)=>!Number.isFinite(t)||t<hn[n].limits[0]-1e-7||t>hn[n].limits[1]+1e-7))return!1;let{points:e}=Ya(i);return e.slice(1).every((t,n)=>t[2]>=(n===e.length-2?12:18))}var oi=(i,e)=>Math.hypot(...i.map((t,n)=>t-e[n]));function Hr(i,e){if(i.length!==e.length||!Dn(i)||!Dn(e))return!1;let t=Math.max(1,Math.ceil(Math.max(...i.map((n,s)=>Math.abs(n-e[s])))/.5));for(let n=0;n<=t;n++)if(!Dn(i.map((s,r)=>s+(e[r]-s)*n/t)))return!1;return!0}function cd(i,e,t,n=Ft.fore){let[s,r,o]=i,a=Math.hypot(s,r),l=o-Ft.base,c=(a*a+l*l-Ft.upper**2-n**2)/(2*Ft.upper*n);if(c>1+1e-9||c<-1-1e-9)return{error:"reach"};let h=[];for(let f of[1,-1])for(let p of[-1,1]){let _=a<1e-8?e[0]:Math.atan2(r,s)/cn+(f===-1?180:0);for(;_>180;)_-=360;for(;_<-180;)_+=360;let x=p*Math.acos(Math.max(-1,Math.min(1,c))),m=Math.atan2(l,f*a)-Math.atan2(n*Math.sin(x),Ft.upper+n*Math.cos(x)),d=[_,m/cn,x/cn];Dn(d)&&(t==="nearest"||(t==="negative"?d[2]<=0:d[2]>=0))&&h.push(d)}if(h.sort((f,p)=>oi(f,e)-oi(p,e)),!h.length)return{error:"limits"};let u=h.find(f=>Hr(e,f));return u?{q:u}:{error:"path"}}function hd(i,e){let t=i.map((s,r)=>[...s,e[r]]),n=t.length;for(let s=0;s<n;s++){let r=s;for(let a=s+1;a<n;a++)Math.abs(t[a][s])>Math.abs(t[r][s])&&(r=a);if([t[s],t[r]]=[t[r],t[s]],Math.abs(t[s][s])<1e-12)return null;let o=t[s][s];for(let a=s;a<=n;a++)t[s][a]/=o;for(let a=0;a<n;a++)if(a!==s){let l=t[a][s];for(let c=s;c<=n;c++)t[a][c]-=l*t[s][c]}}return t.map(s=>s[n])}function ud(i,e,t,n=Ya){let s=e.length,r=Math.atan2(i[1],i[0])/cn,o=[[...e],yn(s)];for(let l of[25,70,120])for(let c of[-110,-45,65]){let h=yn(s);h[0]=r,h[1]=l,h[2]=c,s>=4&&(h[3]=l===120?70:-35),o.push(h)}let a=!1;for(let l of o){let c=[...l];for(let h=0;h<280;h++){let u=n(c),f=Dc(i,u.tip),p=t?ad(t,u.rotation):[],_=[...f,...p.map(w=>w*90)];if(Math.hypot(...f)<.12&&(!t||Math.hypot(...p)<.004)){if(Dn(c)){if(Hr(e,c))return{q:c};a=!0}break}let x=u.axes.map((w,C)=>[...sd(w,Dc(u.tip,u.origins[C])).map(L=>L*cn),...t?w.map(L=>L*cn*90):[]]),m=_.length,d=Array.from({length:m},(w,C)=>Array.from({length:m},(L,S)=>x.reduce((b,R)=>b+R[C]*R[S],0)+(C===S?.45:0))),E=hd(d,_);if(!E)break;let v=x.map(w=>w.reduce((C,L,S)=>C+L*E[S],0)),y=Math.max(...v.map(Math.abs));y>9&&(v=v.map(w=>w*9/y));let A=c.map((w,C)=>Math.max(hn[C].limits[0],Math.min(hn[C].limits[1],w+v[C])));if(oi(A,c)<1e-7)break;c=A}}return{error:a?"path":"solve"}}function Ws(i,e=Ft.home,t="nearest",n=null){return!Array.isArray(i)||i.length!==3||i.some(s=>!Number.isFinite(s))?{error:"numbers"}:Dn(e)?n&&(e.length!==6||!Array.isArray(n)||n.length!==3||n.some(s=>!Number.isFinite(s)||Math.abs(s)>180))?{error:"orientationInvalid"}:oi(i,[0,0,Ft.base])>Ai(e.length)+1e-7?{error:"reach"}:i[2]<12?{error:"limits"}:e.length===3?cd(i,e,t,Ft.fore+Za):ud(i,e,n?od(n):null,Rt):{error:"limits"}}function Xs(i){let e=i?.version===1?3:i?.jointCount;if(![1,2,3].includes(i?.version)||!Number.isInteger(e)||e<3||e>6||!Array.isArray(i.steps)||i.steps.length>200||i.version===3&&!["gripper","vacuum","magnet"].includes(i.tool))throw Error("Invalid program");let t=i.steps.map(n=>{if(!n||typeof n.name!="string"||n.name.length>60||!Number.isFinite(n.seconds))throw Error("Invalid step");let s=n.type||"move";if(s==="move"){if(!Dn(n.q)||n.q.length!==e||n.seconds<.5||n.seconds>15)throw Error("Invalid move");return{...n.type?{type:s}:{},name:n.name,q:[...n.q],seconds:n.seconds}}if(i.version!==3||!["output","wait","delay"].includes(s)||n.seconds<.1||n.seconds>30||(s==="output"||s==="wait")&&typeof n.value!="boolean")throw Error("Invalid instruction");return{type:s,name:n.name,seconds:n.seconds,...s!=="delay"?{value:n.value}:{}}});return{jointCount:e,steps:t,...i.version===3?{tool:i.tool}:{}}}var yi={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},vi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},ah=0,Cl=1,lh=2;var Rl=1,Vo=2,zn=3,Qn=0,qt=1,Hn=2,ti=0,Li=1,Il=2,Pl=3,Dl=4,ch=5,pi=100,hh=101,uh=102,dh=103,fh=104,ph=200,mh=201,gh=202,_h=203,go=204,_o=205,xh=206,yh=207,vh=208,bh=209,Mh=210,Sh=211,Eh=212,wh=213,Th=214,Go=0,Wo=1,Xo=2,Ni=3,qo=4,Yo=5,Zo=6,jo=7,Ll=0,Ah=1,Ch=2,ni=0,Rh=1,Ih=2,Ph=3,Dh=4,Lh=5,Nh=6,Oh=7;var Nl=300,Vi=301,Gi=302,$o=303,Jo=304,wr=306,xo=1e3,fi=1001,yo=1002,fn=1003,Uh=1004;var Tr=1005;var wn=1006,Ko=1007;var bi=1008;var Rn=1009,Ol=1010,Ul=1011,Rs=1012,Qo=1013,Mi=1014,Vn=1015,Is=1016,ea=1017,ta=1018,Ps=1020,Fl=35902,Bl=35899,kl=1021,zl=1022,gn=1023,xs=1026,Ds=1027,Hl=1028,na=1029,Vl=1030,ia=1031;var sa=1033,Ar=33776,Cr=33777,Rr=33778,Ir=33779,ra=35840,oa=35841,aa=35842,la=35843,ca=36196,ha=37492,ua=37496,da=37808,fa=37809,pa=37810,ma=37811,ga=37812,_a=37813,xa=37814,ya=37815,va=37816,ba=37817,Ma=37818,Sa=37819,Ea=37820,wa=37821,Ta=36492,Aa=36494,Ca=36495,Ra=36283,Ia=36284,Pa=36285,Da=36286;var tr=2300,vo=2301,mo=2302,vl=2400,bl=2401,Ml=2402;var Fh=3200,Bh=3201;var Gl=0,kh=1,ii="",Wt="srgb",Oi="srgb-linear",nr="linear",it="srgb";var Di=7680;var Sl=519,zh=512,Hh=513,Vh=514,Wl=515,Gh=516,Wh=517,Xh=518,qh=519,bo=35044;var Xl="300 es",En=2e3,ir=2001;var Un=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Lc=1234567,gs=Math.PI/180,ys=180/Math.PI;function Jn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Bt[i&255]+Bt[i>>8&255]+Bt[i>>16&255]+Bt[i>>24&255]+"-"+Bt[e&255]+Bt[e>>8&255]+"-"+Bt[e>>16&15|64]+Bt[e>>24&255]+"-"+Bt[t&63|128]+Bt[t>>8&255]+"-"+Bt[t>>16&255]+Bt[t>>24&255]+Bt[n&255]+Bt[n>>8&255]+Bt[n>>16&255]+Bt[n>>24&255]).toLowerCase()}function qe(i,e,t){return Math.max(e,Math.min(t,i))}function ql(i,e){return(i%e+e)%e}function dd(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function fd(i,e,t){return i!==e?(t-i)/(e-i):0}function er(i,e,t){return(1-t)*i+t*e}function pd(i,e,t,n){return er(i,e,1-Math.exp(-t*n))}function md(i,e=1){return e-Math.abs(ql(i,e*2)-e)}function gd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function _d(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function xd(i,e){return i+Math.floor(Math.random()*(e-i+1))}function yd(i,e){return i+Math.random()*(e-i)}function vd(i){return i*(.5-Math.random())}function bd(i){i!==void 0&&(Lc=i);let e=Lc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Md(i){return i*gs}function Sd(i){return i*ys}function Ed(i){return(i&i-1)===0&&i!==0}function wd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Td(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Ad(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),f=o((e-n)/2),p=r((n-e)/2),_=o((n-e)/2);switch(s){case"XYX":i.set(a*h,l*u,l*f,a*c);break;case"YZY":i.set(l*f,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*f,a*h,a*c);break;case"XZX":i.set(a*h,l*_,l*p,a*c);break;case"YXY":i.set(l*p,a*h,l*_,a*c);break;case"ZYZ":i.set(l*_,l*p,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Sn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function nt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Yl={DEG2RAD:gs,RAD2DEG:ys,generateUUID:Jn,clamp:qe,euclideanModulo:ql,mapLinear:dd,inverseLerp:fd,lerp:er,damp:pd,pingpong:md,smoothstep:gd,smootherstep:_d,randInt:xd,randFloat:yd,randFloatSpread:vd,seededRandom:bd,degToRad:Md,radToDeg:Sd,isPowerOfTwo:Ed,ceilPowerOfTwo:wd,floorPowerOfTwo:Td,setQuaternionFromProperEuler:Ad,normalize:nt,denormalize:Sn},we=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},pn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],f=r[o+0],p=r[o+1],_=r[o+2],x=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=p,e[t+2]=_,e[t+3]=x;return}if(u!==x||l!==f||c!==p||h!==_){let m=1-a,d=l*f+c*p+h*_+u*x,E=d>=0?1:-1,v=1-d*d;if(v>Number.EPSILON){let A=Math.sqrt(v),w=Math.atan2(A,d*E);m=Math.sin(m*w)/A,a=Math.sin(a*w)/A}let y=a*E;if(l=l*m+f*y,c=c*m+p*y,h=h*m+_*y,u=u*m+x*y,m===1-a){let A=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=A,c*=A,h*=A,u*=A}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],f=r[o+1],p=r[o+2],_=r[o+3];return e[t]=a*_+h*u+l*p-c*f,e[t+1]=l*_+h*f+c*u-a*p,e[t+2]=c*_+h*p+a*f-l*u,e[t+3]=h*_-a*u-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),f=l(n/2),p=l(s/2),_=l(r/2);switch(o){case"XYZ":this._x=f*h*u+c*p*_,this._y=c*p*u-f*h*_,this._z=c*h*_+f*p*u,this._w=c*h*u-f*p*_;break;case"YXZ":this._x=f*h*u+c*p*_,this._y=c*p*u-f*h*_,this._z=c*h*_-f*p*u,this._w=c*h*u+f*p*_;break;case"ZXY":this._x=f*h*u-c*p*_,this._y=c*p*u+f*h*_,this._z=c*h*_+f*p*u,this._w=c*h*u-f*p*_;break;case"ZYX":this._x=f*h*u-c*p*_,this._y=c*p*u+f*h*_,this._z=c*h*_-f*p*u,this._w=c*h*u+f*p*_;break;case"YZX":this._x=f*h*u+c*p*_,this._y=c*p*u+f*h*_,this._z=c*h*_-f*p*u,this._w=c*h*u-f*p*_;break;case"XZY":this._x=f*h*u-c*p*_,this._y=c*p*u-f*h*_,this._z=c*h*_+f*p*u,this._w=c*h*u+f*p*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+a+u;if(f>0){let p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(n>a&&n>u){let p=2*Math.sqrt(1+n-a-u);this._w=(h-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>u){let p=2*Math.sqrt(1+a-n-u);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+u-n-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(qe(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let p=1-t;return this._w=p*o+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},D=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Nc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Nc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ja.copy(this).projectOnVector(e),this.sub(ja)}reflect(e){return this.sub(ja.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ja=new D,Nc=new pn,Ge=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],p=n[5],_=n[8],x=s[0],m=s[3],d=s[6],E=s[1],v=s[4],y=s[7],A=s[2],w=s[5],C=s[8];return r[0]=o*x+a*E+l*A,r[3]=o*m+a*v+l*w,r[6]=o*d+a*y+l*C,r[1]=c*x+h*E+u*A,r[4]=c*m+h*v+u*w,r[7]=c*d+h*y+u*C,r[2]=f*x+p*E+_*A,r[5]=f*m+p*v+_*w,r[8]=f*d+p*y+_*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,f=a*l-h*r,p=c*r-o*l,_=t*u+n*f+s*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/_;return e[0]=u*x,e[1]=(s*c-h*n)*x,e[2]=(a*n-s*o)*x,e[3]=f*x,e[4]=(h*t-s*l)*x,e[5]=(s*r-a*t)*x,e[6]=p*x,e[7]=(n*l-c*t)*x,e[8]=(o*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply($a.makeScale(e,t)),this}rotate(e){return this.premultiply($a.makeRotation(-e)),this}translate(e,t){return this.premultiply($a.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},$a=new Ge;function Zl(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function sr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Yh(){let i=sr("canvas");return i.style.display="block",i}var Oc={};function vs(i){i in Oc||(Oc[i]=!0,console.warn(i))}function Zh(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Uc=new Ge().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Fc=new Ge().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Cd(){let i={enabled:!0,workingColorSpace:Oi,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===it&&(s.r=Kn(s.r),s.g=Kn(s.g),s.b=Kn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===it&&(s.r=_s(s.r),s.g=_s(s.g),s.b=_s(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ii?nr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return vs("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return vs("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Oi]:{primaries:e,whitePoint:n,transfer:nr,toXYZ:Uc,fromXYZ:Fc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Wt},outputColorSpaceConfig:{drawingBufferColorSpace:Wt}},[Wt]:{primaries:e,whitePoint:n,transfer:it,toXYZ:Uc,fromXYZ:Fc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Wt}}}),i}var Je=Cd();function Kn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function _s(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var es,Mo=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{es===void 0&&(es=sr("canvas")),es.width=e.width,es.height=e.height;let s=es.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=es}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=sr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Kn(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Kn(t[n]/255)*255):t[n]=Kn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Rd=0,bs=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Rd++}),this.uuid=Jn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Ja(s[o].image)):r.push(Ja(s[o]))}else r=Ja(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Ja(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Mo.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Id=0,Ka=new D,jt=class i extends Un{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=fi,s=fi,r=wn,o=bi,a=gn,l=Rn,c=i.DEFAULT_ANISOTROPY,h=ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Id++}),this.uuid=Jn(),this.name="",this.source=new bs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new we(0,0),this.repeat=new we(1,1),this.center=new we(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ge,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ka).x}get height(){return this.source.getSize(Ka).y}get depth(){return this.source.getSize(Ka).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Nl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case xo:e.x=e.x-Math.floor(e.x);break;case fi:e.x=e.x<0?0:1;break;case yo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case xo:e.y=e.y-Math.floor(e.y);break;case fi:e.y=e.y<0?0:1;break;case yo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};jt.DEFAULT_IMAGE=null;jt.DEFAULT_MAPPING=Nl;jt.DEFAULT_ANISOTROPY=1;var _t=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],p=l[5],_=l[9],x=l[2],m=l[6],d=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(_-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(_+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(c+1)/2,y=(p+1)/2,A=(d+1)/2,w=(h+f)/4,C=(u+x)/4,L=(_+m)/4;return v>y&&v>A?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=w/n,r=C/n):y>A?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=w/s,r=L/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=C/r,s=L/r),this.set(n,s,r,t),this}let E=Math.sqrt((m-_)*(m-_)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(E)<.001&&(E=1),this.x=(m-_)/E,this.y=(u-x)/E,this.z=(f-h)/E,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this.w=qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this.w=qe(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},So=class extends Un{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:wn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new _t(0,0,e,t),this.scissorTest=!1,this.viewport=new _t(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new jt(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:wn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new bs(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Fn=class extends So{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},rr=class extends jt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=fn,this.minFilter=fn,this.wrapR=fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Eo=class extends jt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=fn,this.minFilter=fn,this.wrapR=fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Bn=class{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(vn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(vn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=vn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,vn):vn.fromBufferAttribute(r,o),vn.applyMatrix4(e.matrixWorld),this.expandByPoint(vn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Vr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Vr.copy(n.boundingBox)),Vr.applyMatrix4(e.matrixWorld),this.union(Vr)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,vn),vn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(qs),Gr.subVectors(this.max,qs),ts.subVectors(e.a,qs),ns.subVectors(e.b,qs),is.subVectors(e.c,qs),ai.subVectors(ns,ts),li.subVectors(is,ns),Ci.subVectors(ts,is);let t=[0,-ai.z,ai.y,0,-li.z,li.y,0,-Ci.z,Ci.y,ai.z,0,-ai.x,li.z,0,-li.x,Ci.z,0,-Ci.x,-ai.y,ai.x,0,-li.y,li.x,0,-Ci.y,Ci.x,0];return!Qa(t,ts,ns,is,Gr)||(t=[1,0,0,0,1,0,0,0,1],!Qa(t,ts,ns,is,Gr))?!1:(Wr.crossVectors(ai,li),t=[Wr.x,Wr.y,Wr.z],Qa(t,ts,ns,is,Gr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,vn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(vn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(qn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),qn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),qn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),qn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),qn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),qn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),qn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),qn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(qn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},qn=[new D,new D,new D,new D,new D,new D,new D,new D],vn=new D,Vr=new Bn,ts=new D,ns=new D,is=new D,ai=new D,li=new D,Ci=new D,qs=new D,Gr=new D,Wr=new D,Ri=new D;function Qa(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Ri.fromArray(i,r);let a=s.x*Math.abs(Ri.x)+s.y*Math.abs(Ri.y)+s.z*Math.abs(Ri.z),l=e.dot(Ri),c=t.dot(Ri),h=n.dot(Ri);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Pd=new Bn,Ys=new D,el=new D,Ui=class{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Pd.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ys.subVectors(e,this.center);let t=Ys.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Ys,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(el.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ys.copy(e.center).add(el)),this.expandByPoint(Ys.copy(e.center).sub(el))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Yn=new D,tl=new D,Xr=new D,ci=new D,nl=new D,qr=new D,il=new D,mi=class{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Yn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Yn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Yn.copy(this.origin).addScaledVector(this.direction,t),Yn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){tl.copy(e).add(t).multiplyScalar(.5),Xr.copy(t).sub(e).normalize(),ci.copy(this.origin).sub(tl);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Xr),a=ci.dot(this.direction),l=-ci.dot(Xr),c=ci.lengthSq(),h=Math.abs(1-o*o),u,f,p,_;if(h>0)if(u=o*l-a,f=o*a-l,_=r*h,u>=0)if(f>=-_)if(f<=_){let x=1/h;u*=x,f*=x,p=u*(u+o*f+2*a)+f*(o*u+f+2*l)+c}else f=r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*l)+c;else f<=-_?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+f*(f+2*l)+c):f<=_?(u=0,f=Math.min(Math.max(-r,-l),r),p=f*(f+2*l)+c):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+f*(f+2*l)+c);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(tl).addScaledVector(Xr,f),p}intersectSphere(e,t){Yn.subVectors(e.center,this.origin);let n=Yn.dot(this.direction),s=Yn.dot(Yn)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Yn)!==null}intersectTriangle(e,t,n,s,r){nl.subVectors(t,e),qr.subVectors(n,e),il.crossVectors(nl,qr);let o=this.direction.dot(il),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ci.subVectors(this.origin,e);let l=a*this.direction.dot(qr.crossVectors(ci,qr));if(l<0)return null;let c=a*this.direction.dot(nl.cross(ci));if(c<0||l+c>o)return null;let h=-a*ci.dot(il);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ht=class i{constructor(e,t,n,s,r,o,a,l,c,h,u,f,p,_,x,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,u,f,p,_,x,m)}set(e,t,n,s,r,o,a,l,c,h,u,f,p,_,x,m){let d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=f,d[3]=p,d[7]=_,d[11]=x,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/ss.setFromMatrixColumn(e,0).length(),r=1/ss.setFromMatrixColumn(e,1).length(),o=1/ss.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let f=o*h,p=o*u,_=a*h,x=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+_*c,t[5]=f-x*c,t[9]=-a*l,t[2]=x-f*c,t[6]=_+p*c,t[10]=o*l}else if(e.order==="YXZ"){let f=l*h,p=l*u,_=c*h,x=c*u;t[0]=f+x*a,t[4]=_*a-p,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=p*a-_,t[6]=x+f*a,t[10]=o*l}else if(e.order==="ZXY"){let f=l*h,p=l*u,_=c*h,x=c*u;t[0]=f-x*a,t[4]=-o*u,t[8]=_+p*a,t[1]=p+_*a,t[5]=o*h,t[9]=x-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let f=o*h,p=o*u,_=a*h,x=a*u;t[0]=l*h,t[4]=_*c-p,t[8]=f*c+x,t[1]=l*u,t[5]=x*c+f,t[9]=p*c-_,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let f=o*l,p=o*c,_=a*l,x=a*c;t[0]=l*h,t[4]=x-f*u,t[8]=_*u+p,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=p*u+_,t[10]=f-x*u}else if(e.order==="XZY"){let f=o*l,p=o*c,_=a*l,x=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+x,t[5]=o*h,t[9]=p*u-_,t[2]=_*u-p,t[6]=a*h,t[10]=x*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Dd,e,Ld)}lookAt(e,t,n){let s=this.elements;return en.subVectors(e,t),en.lengthSq()===0&&(en.z=1),en.normalize(),hi.crossVectors(n,en),hi.lengthSq()===0&&(Math.abs(n.z)===1?en.x+=1e-4:en.z+=1e-4,en.normalize(),hi.crossVectors(n,en)),hi.normalize(),Yr.crossVectors(en,hi),s[0]=hi.x,s[4]=Yr.x,s[8]=en.x,s[1]=hi.y,s[5]=Yr.y,s[9]=en.y,s[2]=hi.z,s[6]=Yr.z,s[10]=en.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],p=n[13],_=n[2],x=n[6],m=n[10],d=n[14],E=n[3],v=n[7],y=n[11],A=n[15],w=s[0],C=s[4],L=s[8],S=s[12],b=s[1],R=s[5],U=s[9],G=s[13],Z=s[2],j=s[6],W=s[10],re=s[14],q=s[3],F=s[7],J=s[11],ee=s[15];return r[0]=o*w+a*b+l*Z+c*q,r[4]=o*C+a*R+l*j+c*F,r[8]=o*L+a*U+l*W+c*J,r[12]=o*S+a*G+l*re+c*ee,r[1]=h*w+u*b+f*Z+p*q,r[5]=h*C+u*R+f*j+p*F,r[9]=h*L+u*U+f*W+p*J,r[13]=h*S+u*G+f*re+p*ee,r[2]=_*w+x*b+m*Z+d*q,r[6]=_*C+x*R+m*j+d*F,r[10]=_*L+x*U+m*W+d*J,r[14]=_*S+x*G+m*re+d*ee,r[3]=E*w+v*b+y*Z+A*q,r[7]=E*C+v*R+y*j+A*F,r[11]=E*L+v*U+y*W+A*J,r[15]=E*S+v*G+y*re+A*ee,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],p=e[14],_=e[3],x=e[7],m=e[11],d=e[15];return _*(+r*l*u-s*c*u-r*a*f+n*c*f+s*a*p-n*l*p)+x*(+t*l*p-t*c*f+r*o*f-s*o*p+s*c*h-r*l*h)+m*(+t*c*u-t*a*p-r*o*u+n*o*p+r*a*h-n*c*h)+d*(-s*a*h-t*l*u+t*a*f+s*o*u-n*o*f+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],p=e[11],_=e[12],x=e[13],m=e[14],d=e[15],E=u*m*c-x*f*c+x*l*p-a*m*p-u*l*d+a*f*d,v=_*f*c-h*m*c-_*l*p+o*m*p+h*l*d-o*f*d,y=h*x*c-_*u*c+_*a*p-o*x*p-h*a*d+o*u*d,A=_*u*l-h*x*l-_*a*f+o*x*f+h*a*m-o*u*m,w=t*E+n*v+s*y+r*A;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/w;return e[0]=E*C,e[1]=(x*f*r-u*m*r-x*s*p+n*m*p+u*s*d-n*f*d)*C,e[2]=(a*m*r-x*l*r+x*s*c-n*m*c-a*s*d+n*l*d)*C,e[3]=(u*l*r-a*f*r-u*s*c+n*f*c+a*s*p-n*l*p)*C,e[4]=v*C,e[5]=(h*m*r-_*f*r+_*s*p-t*m*p-h*s*d+t*f*d)*C,e[6]=(_*l*r-o*m*r-_*s*c+t*m*c+o*s*d-t*l*d)*C,e[7]=(o*f*r-h*l*r+h*s*c-t*f*c-o*s*p+t*l*p)*C,e[8]=y*C,e[9]=(_*u*r-h*x*r-_*n*p+t*x*p+h*n*d-t*u*d)*C,e[10]=(o*x*r-_*a*r+_*n*c-t*x*c-o*n*d+t*a*d)*C,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*p-t*a*p)*C,e[12]=A*C,e[13]=(h*x*s-_*u*s+_*n*f-t*x*f-h*n*m+t*u*m)*C,e[14]=(_*a*s-o*x*s-_*n*l+t*x*l+o*n*m-t*a*m)*C,e[15]=(o*u*s-h*a*s+h*n*l-t*u*l-o*n*f+t*a*f)*C,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,f=r*c,p=r*h,_=r*u,x=o*h,m=o*u,d=a*u,E=l*c,v=l*h,y=l*u,A=n.x,w=n.y,C=n.z;return s[0]=(1-(x+d))*A,s[1]=(p+y)*A,s[2]=(_-v)*A,s[3]=0,s[4]=(p-y)*w,s[5]=(1-(f+d))*w,s[6]=(m+E)*w,s[7]=0,s[8]=(_+v)*C,s[9]=(m-E)*C,s[10]=(1-(f+x))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=ss.set(s[0],s[1],s[2]).length(),o=ss.set(s[4],s[5],s[6]).length(),a=ss.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],bn.copy(this);let c=1/r,h=1/o,u=1/a;return bn.elements[0]*=c,bn.elements[1]*=c,bn.elements[2]*=c,bn.elements[4]*=h,bn.elements[5]*=h,bn.elements[6]*=h,bn.elements[8]*=u,bn.elements[9]*=u,bn.elements[10]*=u,t.setFromRotationMatrix(bn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=En,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-s),f=(t+e)/(t-e),p=(n+s)/(n-s),_,x;if(l)_=r/(o-r),x=o*r/(o-r);else if(a===En)_=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===ir)_=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=En,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-s),f=-(t+e)/(t-e),p=-(n+s)/(n-s),_,x;if(l)_=1/(o-r),x=o/(o-r);else if(a===En)_=-2/(o-r),x=-(o+r)/(o-r);else if(a===ir)_=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=_,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},ss=new D,bn=new ht,Dd=new D(0,0,0),Ld=new D(1,1,1),hi=new D,Yr=new D,en=new D,Bc=new ht,kc=new pn,Tn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(qe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-qe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Bc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Bc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return kc.setFromEuler(this),this.setFromQuaternion(kc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Tn.DEFAULT_ORDER="XYZ";var Ms=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Nd=0,zc=new D,rs=new pn,Zn=new ht,Zr=new D,Zs=new D,Od=new D,Ud=new pn,Hc=new D(1,0,0),Vc=new D(0,1,0),Gc=new D(0,0,1),Wc={type:"added"},Fd={type:"removed"},os={type:"childadded",child:null},sl={type:"childremoved",child:null},Dt=class i extends Un{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Nd++}),this.uuid=Jn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new D,t=new Tn,n=new pn,s=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ht},normalMatrix:{value:new Ge}}),this.matrix=new ht,this.matrixWorld=new ht,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ms,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return rs.setFromAxisAngle(e,t),this.quaternion.multiply(rs),this}rotateOnWorldAxis(e,t){return rs.setFromAxisAngle(e,t),this.quaternion.premultiply(rs),this}rotateX(e){return this.rotateOnAxis(Hc,e)}rotateY(e){return this.rotateOnAxis(Vc,e)}rotateZ(e){return this.rotateOnAxis(Gc,e)}translateOnAxis(e,t){return zc.copy(e).applyQuaternion(this.quaternion),this.position.add(zc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Hc,e)}translateY(e){return this.translateOnAxis(Vc,e)}translateZ(e){return this.translateOnAxis(Gc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Zn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Zr.copy(e):Zr.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Zs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Zn.lookAt(Zs,Zr,this.up):Zn.lookAt(Zr,Zs,this.up),this.quaternion.setFromRotationMatrix(Zn),s&&(Zn.extractRotation(s.matrixWorld),rs.setFromRotationMatrix(Zn),this.quaternion.premultiply(rs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Wc),os.child=e,this.dispatchEvent(os),os.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Fd),sl.child=e,this.dispatchEvent(sl),sl.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Zn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Zn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Zn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Wc),os.child=e,this.dispatchEvent(os),os.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zs,e,Od),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zs,Ud,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),f=o(e.skeletons),p=o(e.animations),_=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),_.length>0&&(n.nodes=_)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Dt.DEFAULT_UP=new D(0,1,0);Dt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Mn=new D,jn=new D,rl=new D,$n=new D,as=new D,ls=new D,Xc=new D,ol=new D,al=new D,ll=new D,cl=new _t,hl=new _t,ul=new _t,Nn=class i{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Mn.subVectors(e,t),s.cross(Mn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Mn.subVectors(s,t),jn.subVectors(n,t),rl.subVectors(e,t);let o=Mn.dot(Mn),a=Mn.dot(jn),l=Mn.dot(rl),c=jn.dot(jn),h=jn.dot(rl),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let f=1/u,p=(c*l-a*h)*f,_=(o*h-a*l)*f;return r.set(1-p-_,_,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,$n)===null?!1:$n.x>=0&&$n.y>=0&&$n.x+$n.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,$n)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,$n.x),l.addScaledVector(o,$n.y),l.addScaledVector(a,$n.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return cl.setScalar(0),hl.setScalar(0),ul.setScalar(0),cl.fromBufferAttribute(e,t),hl.fromBufferAttribute(e,n),ul.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(cl,r.x),o.addScaledVector(hl,r.y),o.addScaledVector(ul,r.z),o}static isFrontFacing(e,t,n,s){return Mn.subVectors(n,t),jn.subVectors(e,t),Mn.cross(jn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Mn.subVectors(this.c,this.b),jn.subVectors(this.a,this.b),Mn.cross(jn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;as.subVectors(s,n),ls.subVectors(r,n),ol.subVectors(e,n);let l=as.dot(ol),c=ls.dot(ol);if(l<=0&&c<=0)return t.copy(n);al.subVectors(e,s);let h=as.dot(al),u=ls.dot(al);if(h>=0&&u<=h)return t.copy(s);let f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(as,o);ll.subVectors(e,r);let p=as.dot(ll),_=ls.dot(ll);if(_>=0&&p<=_)return t.copy(r);let x=p*c-l*_;if(x<=0&&c>=0&&_<=0)return a=c/(c-_),t.copy(n).addScaledVector(ls,a);let m=h*_-p*u;if(m<=0&&u-h>=0&&p-_>=0)return Xc.subVectors(r,s),a=(u-h)/(u-h+(p-_)),t.copy(s).addScaledVector(Xc,a);let d=1/(m+x+f);return o=x*d,a=f*d,t.copy(n).addScaledVector(as,o).addScaledVector(ls,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},jh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ui={h:0,s:0,l:0},jr={h:0,s:0,l:0};function dl(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var ze=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Wt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Je.workingColorSpace){return this.r=e,this.g=t,this.b=n,Je.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Je.workingColorSpace){if(e=ql(e,1),t=qe(t,0,1),n=qe(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=dl(o,r,e+1/3),this.g=dl(o,r,e),this.b=dl(o,r,e-1/3)}return Je.colorSpaceToWorking(this,s),this}setStyle(e,t=Wt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Wt){let n=jh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Kn(e.r),this.g=Kn(e.g),this.b=Kn(e.b),this}copyLinearToSRGB(e){return this.r=_s(e.r),this.g=_s(e.g),this.b=_s(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Wt){return Je.workingToColorSpace(kt.copy(this),e),Math.round(qe(kt.r*255,0,255))*65536+Math.round(qe(kt.g*255,0,255))*256+Math.round(qe(kt.b*255,0,255))}getHexString(e=Wt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.workingToColorSpace(kt.copy(this),t);let n=kt.r,s=kt.g,r=kt.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Je.workingColorSpace){return Je.workingToColorSpace(kt.copy(this),t),e.r=kt.r,e.g=kt.g,e.b=kt.b,e}getStyle(e=Wt){Je.workingToColorSpace(kt.copy(this),e);let t=kt.r,n=kt.g,s=kt.b;return e!==Wt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ui),this.setHSL(ui.h+e,ui.s+t,ui.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ui),e.getHSL(jr);let n=er(ui.h,jr.h,t),s=er(ui.s,jr.s,t),r=er(ui.l,jr.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},kt=new ze;ze.NAMES=jh;var Bd=0,kn=class extends Un{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Bd++}),this.uuid=Jn(),this.name="",this.type="Material",this.blending=Li,this.side=Qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=go,this.blendDst=_o,this.blendEquation=pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ze(0,0,0),this.blendAlpha=0,this.depthFunc=Ni,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Sl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Di,this.stencilZFail=Di,this.stencilZPass=Di,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Li&&(n.blending=this.blending),this.side!==Qn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==go&&(n.blendSrc=this.blendSrc),this.blendDst!==_o&&(n.blendDst=this.blendDst),this.blendEquation!==pi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ni&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Sl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Di&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Di&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Di&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},mn=class extends kn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=Ll,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Et=new D,$r=new we,kd=0,Zt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:kd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=bo,this.updateRanges=[],this.gpuType=Vn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)$r.fromBufferAttribute(this,t),$r.applyMatrix3(e),this.setXY(t,$r.x,$r.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix3(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix4(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyNormalMatrix(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.transformDirection(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Sn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=nt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Sn(t,this.array)),t}setX(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Sn(t,this.array)),t}setY(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Sn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Sn(t,this.array)),t}setW(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array),s=nt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array),s=nt(s,this.array),r=nt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==bo&&(e.usage=this.usage),e}};var or=class extends Zt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var ar=class extends Zt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var st=class extends Zt{constructor(e,t,n){super(new Float32Array(e),t,n)}},zd=0,un=new ht,fl=new Dt,cs=new D,tn=new Bn,js=new Bn,It=new D,xt=class i extends Un{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zd++}),this.uuid=Jn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Zl(e)?ar:or)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ge().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return un.makeRotationFromQuaternion(e),this.applyMatrix4(un),this}rotateX(e){return un.makeRotationX(e),this.applyMatrix4(un),this}rotateY(e){return un.makeRotationY(e),this.applyMatrix4(un),this}rotateZ(e){return un.makeRotationZ(e),this.applyMatrix4(un),this}translate(e,t,n){return un.makeTranslation(e,t,n),this.applyMatrix4(un),this}scale(e,t,n){return un.makeScale(e,t,n),this.applyMatrix4(un),this}lookAt(e){return fl.lookAt(e),fl.updateMatrix(),this.applyMatrix4(fl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(cs).negate(),this.translate(cs.x,cs.y,cs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new st(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Bn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];tn.setFromBufferAttribute(r),this.morphTargetsRelative?(It.addVectors(this.boundingBox.min,tn.min),this.boundingBox.expandByPoint(It),It.addVectors(this.boundingBox.max,tn.max),this.boundingBox.expandByPoint(It)):(this.boundingBox.expandByPoint(tn.min),this.boundingBox.expandByPoint(tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ui);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){let n=this.boundingSphere.center;if(tn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];js.setFromBufferAttribute(a),this.morphTargetsRelative?(It.addVectors(tn.min,js.min),tn.expandByPoint(It),It.addVectors(tn.max,js.max),tn.expandByPoint(It)):(tn.expandByPoint(js.min),tn.expandByPoint(js.max))}tn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)It.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(It));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)It.fromBufferAttribute(a,c),l&&(cs.fromBufferAttribute(e,c),It.add(cs)),s=Math.max(s,n.distanceToSquared(It))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Zt(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let L=0;L<n.count;L++)a[L]=new D,l[L]=new D;let c=new D,h=new D,u=new D,f=new we,p=new we,_=new we,x=new D,m=new D;function d(L,S,b){c.fromBufferAttribute(n,L),h.fromBufferAttribute(n,S),u.fromBufferAttribute(n,b),f.fromBufferAttribute(r,L),p.fromBufferAttribute(r,S),_.fromBufferAttribute(r,b),h.sub(c),u.sub(c),p.sub(f),_.sub(f);let R=1/(p.x*_.y-_.x*p.y);isFinite(R)&&(x.copy(h).multiplyScalar(_.y).addScaledVector(u,-p.y).multiplyScalar(R),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-_.x).multiplyScalar(R),a[L].add(x),a[S].add(x),a[b].add(x),l[L].add(m),l[S].add(m),l[b].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let L=0,S=E.length;L<S;++L){let b=E[L],R=b.start,U=b.count;for(let G=R,Z=R+U;G<Z;G+=3)d(e.getX(G+0),e.getX(G+1),e.getX(G+2))}let v=new D,y=new D,A=new D,w=new D;function C(L){A.fromBufferAttribute(s,L),w.copy(A);let S=a[L];v.copy(S),v.sub(A.multiplyScalar(A.dot(S))).normalize(),y.crossVectors(w,S);let R=y.dot(l[L])<0?-1:1;o.setXYZW(L,v.x,v.y,v.z,R)}for(let L=0,S=E.length;L<S;++L){let b=E[L],R=b.start,U=b.count;for(let G=R,Z=R+U;G<Z;G+=3)C(e.getX(G+0)),C(e.getX(G+1)),C(e.getX(G+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Zt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);let s=new D,r=new D,o=new D,a=new D,l=new D,c=new D,h=new D,u=new D;if(e)for(let f=0,p=e.count;f<p;f+=3){let _=e.getX(f+0),x=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,_),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(_,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=t.count;f<p;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)It.fromBufferAttribute(e,t),It.normalize(),e.setXYZ(t,It.x,It.y,It.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,f=new c.constructor(l.length*h),p=0,_=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?p=l[x]*a.data.stride+a.offset:p=l[x]*h;for(let d=0;d<h;d++)f[_++]=c[p++]}return new Zt(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let f=c[h],p=e(f,n);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){let p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let f=0,p=u.length;f<p;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},qc=new ht,Ii=new mi,Jr=new Ui,Yc=new D,Kr=new D,Qr=new D,eo=new D,pl=new D,to=new D,Zc=new D,no=new D,Mt=class extends Dt{constructor(e=new xt,t=new mn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){to.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(pl.fromBufferAttribute(u,e),o?to.addScaledVector(pl,h):to.addScaledVector(pl.sub(t),h))}t.add(to)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Jr.copy(n.boundingSphere),Jr.applyMatrix4(r),Ii.copy(e.ray).recast(e.near),!(Jr.containsPoint(Ii.origin)===!1&&(Ii.intersectSphere(Jr,Yc)===null||Ii.origin.distanceToSquared(Yc)>(e.far-e.near)**2))&&(qc.copy(r).invert(),Ii.copy(e.ray).applyMatrix4(qc),!(n.boundingBox!==null&&Ii.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ii)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,x=f.length;_<x;_++){let m=f[_],d=o[m.materialIndex],E=Math.max(m.start,p.start),v=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let y=E,A=v;y<A;y+=3){let w=a.getX(y),C=a.getX(y+1),L=a.getX(y+2);s=io(this,d,e,n,c,h,u,w,C,L),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let _=Math.max(0,p.start),x=Math.min(a.count,p.start+p.count);for(let m=_,d=x;m<d;m+=3){let E=a.getX(m),v=a.getX(m+1),y=a.getX(m+2);s=io(this,o,e,n,c,h,u,E,v,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let _=0,x=f.length;_<x;_++){let m=f[_],d=o[m.materialIndex],E=Math.max(m.start,p.start),v=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let y=E,A=v;y<A;y+=3){let w=y,C=y+1,L=y+2;s=io(this,d,e,n,c,h,u,w,C,L),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let _=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let m=_,d=x;m<d;m+=3){let E=m,v=m+1,y=m+2;s=io(this,o,e,n,c,h,u,E,v,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function Hd(i,e,t,n,s,r,o,a){let l;if(e.side===qt?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Qn,a),l===null)return null;no.copy(a),no.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(no);return c<t.near||c>t.far?null:{distance:c,point:no.clone(),object:i}}function io(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,Kr),i.getVertexPosition(l,Qr),i.getVertexPosition(c,eo);let h=Hd(i,e,t,n,Kr,Qr,eo,Zc);if(h){let u=new D;Nn.getBarycoord(Zc,Kr,Qr,eo,u),s&&(h.uv=Nn.getInterpolatedAttribute(s,a,l,c,u,new we)),r&&(h.uv1=Nn.getInterpolatedAttribute(r,a,l,c,u,new we)),o&&(h.normal=Nn.getInterpolatedAttribute(o,a,l,c,u,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a,b:l,c,normal:new D,materialIndex:0};Nn.getNormal(Kr,Qr,eo,f.normal),h.face=f,h.barycoord=u}return h}var zt=class i extends xt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],f=0,p=0;_("z","y","x",-1,-1,n,t,e,o,r,0),_("z","y","x",1,-1,n,t,-e,o,r,1),_("x","z","y",1,1,e,n,t,s,o,2),_("x","z","y",1,-1,e,n,-t,s,o,3),_("x","y","z",1,-1,e,t,n,s,r,4),_("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new st(c,3)),this.setAttribute("normal",new st(h,3)),this.setAttribute("uv",new st(u,2));function _(x,m,d,E,v,y,A,w,C,L,S){let b=y/C,R=A/L,U=y/2,G=A/2,Z=w/2,j=C+1,W=L+1,re=0,q=0,F=new D;for(let J=0;J<W;J++){let ee=J*R-G;for(let be=0;be<j;be++){let Oe=be*b-U;F[x]=Oe*E,F[m]=ee*v,F[d]=Z,c.push(F.x,F.y,F.z),F[x]=0,F[m]=0,F[d]=w>0?1:-1,h.push(F.x,F.y,F.z),u.push(be/C),u.push(1-J/L),re+=1}}for(let J=0;J<L;J++)for(let ee=0;ee<C;ee++){let be=f+ee+j*J,Oe=f+ee+j*(J+1),Pe=f+(ee+1)+j*(J+1),Ce=f+(ee+1)+j*J;l.push(be,Oe,Ce),l.push(Oe,Pe,Ce),q+=6}a.addGroup(p,q,S),p+=q,f+=re}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Wi(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Ht(i){let e={};for(let t=0;t<i.length;t++){let n=Wi(i[t]);for(let s in n)e[s]=n[s]}return e}function Vd(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function jl(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}var $h={clone:Wi,merge:Ht},Gd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Wd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,An=class extends kn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Gd,this.fragmentShader=Wd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Wi(e.uniforms),this.uniformsGroups=Vd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},lr=class extends Dt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ht,this.projectionMatrix=new ht,this.projectionMatrixInverse=new ht,this.coordinateSystem=En,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},di=new D,jc=new we,$c=new we,Pt=class extends lr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ys*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(gs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ys*2*Math.atan(Math.tan(gs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(di.x,di.y).multiplyScalar(-e/di.z),di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(di.x,di.y).multiplyScalar(-e/di.z)}getViewSize(e,t){return this.getViewBounds(e,jc,$c),t.subVectors($c,jc)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(gs*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},hs=-90,us=1,wo=class extends Dt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Pt(hs,us,e,t);s.layers=this.layers,this.add(s);let r=new Pt(hs,us,e,t);r.layers=this.layers,this.add(r);let o=new Pt(hs,us,e,t);o.layers=this.layers,this.add(o);let a=new Pt(hs,us,e,t);a.layers=this.layers,this.add(a);let l=new Pt(hs,us,e,t);l.layers=this.layers,this.add(l);let c=new Pt(hs,us,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===En)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ir)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,f,p),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}},cr=class extends jt{constructor(e=[],t=Vi,n,s,r,o,a,l,c,h){super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},To=class extends Fn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new cr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new zt(5,5,5),r=new An({name:"CubemapFromEquirect",uniforms:Wi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qt,blending:ti});r.uniforms.tEquirect.value=t;let o=new Mt(s,r),a=t.minFilter;return t.minFilter===bi&&(t.minFilter=wn),new wo(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},On=class extends Dt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Xd={type:"move"},Ss=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new On,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new On,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new On,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let x of e.hand.values()){let m=t.getJointPose(x,n),d=this._getHandJoint(c,x);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),p=.02,_=.005;c.inputState.pinching&&f>p+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Xd)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new On;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var hr=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new ze(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Fi=class extends Dt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Tn,this.environmentIntensity=1,this.environmentRotation=new Tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Ao=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=bo,this.updateRanges=[],this.version=0,this.uuid=Jn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Jn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Jn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Gt=new D,ur=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix4(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyNormalMatrix(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.transformDirection(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Sn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=nt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Sn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Sn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Sn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Sn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array),s=nt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array),s=nt(s,this.array),r=nt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Zt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Es=class extends kn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ze(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ds,$s=new D,fs=new D,ps=new D,ms=new we,Js=new we,Jh=new ht,so=new D,Ks=new D,ro=new D,Jc=new we,ml=new we,Kc=new we,dr=class extends Dt{constructor(e=new Es){if(super(),this.isSprite=!0,this.type="Sprite",ds===void 0){ds=new xt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Ao(t,5);ds.setIndex([0,1,2,0,2,3]),ds.setAttribute("position",new ur(n,3,0,!1)),ds.setAttribute("uv",new ur(n,2,3,!1))}this.geometry=ds,this.material=e,this.center=new we(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),fs.setFromMatrixScale(this.matrixWorld),Jh.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ps.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&fs.multiplyScalar(-ps.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;oo(so.set(-.5,-.5,0),ps,o,fs,s,r),oo(Ks.set(.5,-.5,0),ps,o,fs,s,r),oo(ro.set(.5,.5,0),ps,o,fs,s,r),Jc.set(0,0),ml.set(1,0),Kc.set(1,1);let a=e.ray.intersectTriangle(so,Ks,ro,!1,$s);if(a===null&&(oo(Ks.set(-.5,.5,0),ps,o,fs,s,r),ml.set(0,1),a=e.ray.intersectTriangle(so,ro,Ks,!1,$s),a===null))return;let l=e.ray.origin.distanceTo($s);l<e.near||l>e.far||t.push({distance:l,point:$s.clone(),uv:Nn.getInterpolation($s,so,Ks,ro,Jc,ml,Kc,new we),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function oo(i,e,t,n,s,r){ms.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Js.x=r*ms.x-s*ms.y,Js.y=s*ms.x+r*ms.y):Js.copy(ms),i.copy(e),i.x+=Js.x,i.y+=Js.y,i.applyMatrix4(Jh)}var gl=new D,qd=new D,Yd=new Ge,dn=class{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=gl.subVectors(n,t).cross(qd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(gl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Yd.getNormalMatrix(e),s=this.coplanarPoint(gl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Pi=new Ui,Zd=new we(.5,.5),ao=new D,ws=class{constructor(e=new dn,t=new dn,n=new dn,s=new dn,r=new dn,o=new dn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=En,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],p=r[7],_=r[8],x=r[9],m=r[10],d=r[11],E=r[12],v=r[13],y=r[14],A=r[15];if(s[0].setComponents(c-o,p-h,d-_,A-E).normalize(),s[1].setComponents(c+o,p+h,d+_,A+E).normalize(),s[2].setComponents(c+a,p+u,d+x,A+v).normalize(),s[3].setComponents(c-a,p-u,d-x,A-v).normalize(),n)s[4].setComponents(l,f,m,y).normalize(),s[5].setComponents(c-l,p-f,d-m,A-y).normalize();else if(s[4].setComponents(c-l,p-f,d-m,A-y).normalize(),t===En)s[5].setComponents(c+l,p+f,d+m,A+y).normalize();else if(t===ir)s[5].setComponents(l,f,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Pi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Pi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Pi)}intersectsSprite(e){Pi.center.set(0,0,0);let t=Zd.distanceTo(e.center);return Pi.radius=.7071067811865476+t,Pi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Pi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(ao.x=s.normal.x>0?e.max.x:e.min.x,ao.y=s.normal.y>0?e.max.y:e.min.y,ao.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ao)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Cn=class extends kn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Co=new D,Ro=new D,Qc=new ht,Qs=new mi,lo=new Ui,_l=new D,eh=new D,Ts=class extends Dt{constructor(e=new xt,t=new Cn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Co.fromBufferAttribute(t,s-1),Ro.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Co.distanceTo(Ro);e.setAttribute("lineDistance",new st(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),lo.copy(n.boundingSphere),lo.applyMatrix4(s),lo.radius+=r,e.ray.intersectsSphere(lo)===!1)return;Qc.copy(s).invert(),Qs.copy(e.ray).applyMatrix4(Qc);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){let p=Math.max(0,o.start),_=Math.min(h.count,o.start+o.count);for(let x=p,m=_-1;x<m;x+=c){let d=h.getX(x),E=h.getX(x+1),v=co(this,e,Qs,l,d,E,x);v&&t.push(v)}if(this.isLineLoop){let x=h.getX(_-1),m=h.getX(p),d=co(this,e,Qs,l,x,m,_-1);d&&t.push(d)}}else{let p=Math.max(0,o.start),_=Math.min(f.count,o.start+o.count);for(let x=p,m=_-1;x<m;x+=c){let d=co(this,e,Qs,l,x,x+1,x);d&&t.push(d)}if(this.isLineLoop){let x=co(this,e,Qs,l,_-1,p,_-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function co(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(Co.fromBufferAttribute(a,s),Ro.fromBufferAttribute(a,r),t.distanceSqToSegment(Co,Ro,_l,eh)>n)return;_l.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(_l);if(!(c<e.near||c>e.far))return{distance:c,point:eh.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var th=new D,nh=new D,ei=class extends Ts{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)th.fromBufferAttribute(t,s),nh.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+th.distanceTo(nh);e.setAttribute("lineDistance",new st(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Bi=class extends jt{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},fr=class extends jt{constructor(e,t,n=Mi,s,r,o,a=fn,l=fn,c,h=xs,u=1){if(h!==xs&&h!==Ds)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:u};super(f,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new bs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},pr=class extends jt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var wt=class i extends xt{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],f=[],p=[],_=0,x=[],m=n/2,d=0;E(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new st(u,3)),this.setAttribute("normal",new st(f,3)),this.setAttribute("uv",new st(p,2));function E(){let y=new D,A=new D,w=0,C=(t-e)/n;for(let L=0;L<=r;L++){let S=[],b=L/r,R=b*(t-e)+e;for(let U=0;U<=s;U++){let G=U/s,Z=G*l+a,j=Math.sin(Z),W=Math.cos(Z);A.x=R*j,A.y=-b*n+m,A.z=R*W,u.push(A.x,A.y,A.z),y.set(j,C,W).normalize(),f.push(y.x,y.y,y.z),p.push(G,1-b),S.push(_++)}x.push(S)}for(let L=0;L<s;L++)for(let S=0;S<r;S++){let b=x[S][L],R=x[S+1][L],U=x[S+1][L+1],G=x[S][L+1];(e>0||S!==0)&&(h.push(b,R,G),w+=3),(t>0||S!==r-1)&&(h.push(R,U,G),w+=3)}c.addGroup(d,w,0),d+=w}function v(y){let A=_,w=new we,C=new D,L=0,S=y===!0?e:t,b=y===!0?1:-1;for(let U=1;U<=s;U++)u.push(0,m*b,0),f.push(0,b,0),p.push(.5,.5),_++;let R=_;for(let U=0;U<=s;U++){let Z=U/s*l+a,j=Math.cos(Z),W=Math.sin(Z);C.x=S*W,C.y=m*b,C.z=S*j,u.push(C.x,C.y,C.z),f.push(0,b,0),w.x=j*.5+.5,w.y=W*.5*b+.5,p.push(w.x,w.y),_++}for(let U=0;U<s;U++){let G=A+U,Z=R+U;y===!0?h.push(Z,Z+1,G):h.push(Z+1,Z,G),L+=3}c.addGroup(d,L,y===!0?1:2),d+=L}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var ho=new D,uo=new D,xl=new D,fo=new Nn,ki=class extends xt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let s=Math.pow(10,4),r=Math.cos(gs*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),f={},p=[];for(let _=0;_<l;_+=3){o?(c[0]=o.getX(_),c[1]=o.getX(_+1),c[2]=o.getX(_+2)):(c[0]=_,c[1]=_+1,c[2]=_+2);let{a:x,b:m,c:d}=fo;if(x.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),d.fromBufferAttribute(a,c[2]),fo.getNormal(xl),u[0]=`${Math.round(x.x*s)},${Math.round(x.y*s)},${Math.round(x.z*s)}`,u[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,u[2]=`${Math.round(d.x*s)},${Math.round(d.y*s)},${Math.round(d.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let E=0;E<3;E++){let v=(E+1)%3,y=u[E],A=u[v],w=fo[h[E]],C=fo[h[v]],L=`${y}_${A}`,S=`${A}_${y}`;S in f&&f[S]?(xl.dot(f[S].normal)<=r&&(p.push(w.x,w.y,w.z),p.push(C.x,C.y,C.z)),f[S]=null):L in f||(f[L]={index0:c[E],index1:c[v],normal:xl.clone()})}}for(let _ in f)if(f[_]){let{index0:x,index1:m}=f[_];ho.fromBufferAttribute(a,x),uo.fromBufferAttribute(a,m),p.push(ho.x,ho.y,ho.z),p.push(uo.x,uo.y,uo.z)}this.setAttribute("position",new st(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};var mr=class i extends xt{constructor(e=[new we(0,-.5),new we(.5,0),new we(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=qe(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/t,u=new D,f=new we,p=new D,_=new D,x=new D,m=0,d=0;for(let E=0;E<=e.length-1;E++)switch(E){case 0:m=e[E+1].x-e[E].x,d=e[E+1].y-e[E].y,p.x=d*1,p.y=-m,p.z=d*0,x.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case e.length-1:l.push(x.x,x.y,x.z);break;default:m=e[E+1].x-e[E].x,d=e[E+1].y-e[E].y,p.x=d*1,p.y=-m,p.z=d*0,_.copy(p),p.x+=x.x,p.y+=x.y,p.z+=x.z,p.normalize(),l.push(p.x,p.y,p.z),x.copy(_)}for(let E=0;E<=t;E++){let v=n+E*h*s,y=Math.sin(v),A=Math.cos(v);for(let w=0;w<=e.length-1;w++){u.x=e[w].x*y,u.y=e[w].y,u.z=e[w].x*A,o.push(u.x,u.y,u.z),f.x=E/t,f.y=w/(e.length-1),a.push(f.x,f.y);let C=l[3*w+0]*y,L=l[3*w+1],S=l[3*w+0]*A;c.push(C,L,S)}}for(let E=0;E<t;E++)for(let v=0;v<e.length-1;v++){let y=v+E*e.length,A=y,w=y+e.length,C=y+e.length+1,L=y+1;r.push(A,w,L),r.push(C,L,w)}this.setIndex(r),this.setAttribute("position",new st(o,3)),this.setAttribute("uv",new st(a,2)),this.setAttribute("normal",new st(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}};var zi=class i extends xt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=e/a,f=t/l,p=[],_=[],x=[],m=[];for(let d=0;d<h;d++){let E=d*f-o;for(let v=0;v<c;v++){let y=v*u-r;_.push(y,-E,0),x.push(0,0,1),m.push(v/a),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let E=0;E<a;E++){let v=E+c*d,y=E+c*(d+1),A=E+1+c*(d+1),w=E+1+c*d;p.push(v,y,w),p.push(y,A,w)}this.setIndex(p),this.setAttribute("position",new st(_,3)),this.setAttribute("normal",new st(x,3)),this.setAttribute("uv",new st(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var As=class i extends xt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new D,f=new D,p=[],_=[],x=[],m=[];for(let d=0;d<=n;d++){let E=[],v=d/n,y=0;d===0&&o===0?y=.5/t:d===n&&l===Math.PI&&(y=-.5/t);for(let A=0;A<=t;A++){let w=A/t;u.x=-e*Math.cos(s+w*r)*Math.sin(o+v*a),u.y=e*Math.cos(o+v*a),u.z=e*Math.sin(s+w*r)*Math.sin(o+v*a),_.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),m.push(w+y,1-v),E.push(c++)}h.push(E)}for(let d=0;d<n;d++)for(let E=0;E<t;E++){let v=h[d][E+1],y=h[d][E],A=h[d+1][E],w=h[d+1][E+1];(d!==0||o>0)&&p.push(v,y,w),(d!==n-1||l<Math.PI)&&p.push(y,A,w)}this.setIndex(p),this.setAttribute("position",new st(_,3)),this.setAttribute("normal",new st(x,3)),this.setAttribute("uv",new st(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Cs=class i extends xt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],l=[],c=[],h=new D,u=new D,f=new D;for(let p=0;p<=n;p++)for(let _=0;_<=s;_++){let x=_/s*r,m=p/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(x),u.y=(e+t*Math.cos(m))*Math.sin(x),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(x),h.y=e*Math.sin(x),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(_/s),c.push(p/n)}for(let p=1;p<=n;p++)for(let _=1;_<=s;_++){let x=(s+1)*p+_-1,m=(s+1)*(p-1)+_-1,d=(s+1)*(p-1)+_,E=(s+1)*p+_;o.push(x,m,E),o.push(m,d,E)}this.setIndex(o),this.setAttribute("position",new st(a,3)),this.setAttribute("normal",new st(l,3)),this.setAttribute("uv",new st(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Xt=class extends kn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Gl,this.normalScale=new we(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var Io=class extends kn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Fh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Po=class extends kn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function po(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function jd(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Hi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Do=class extends Hi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:vl,endingEnd:vl}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case bl:r=e,a=2*t-n;break;case Ml:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case bl:o=e,l=2*n-t;break;case Ml:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,p=this._weightNext,_=(n-t)/(s-t),x=_*_,m=x*_,d=-f*m+2*f*x-f*_,E=(1+f)*m+(-1.5-2*f)*x+(-.5+f)*_+1,v=(-1-p)*m+(1.5+p)*x+.5*_,y=p*m-p*x;for(let A=0;A!==a;++A)r[A]=d*o[h+A]+E*o[c+A]+v*o[l+A]+y*o[u+A];return r}},Lo=class extends Hi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),u=1-h;for(let f=0;f!==a;++f)r[f]=o[c+f]*u+o[l+f]*h;return r}},No=class extends Hi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},nn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=po(t,this.TimeBufferType),this.values=po(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:po(e.times,Array),values:po(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new No(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Lo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Do(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case tr:t=this.InterpolantFactoryMethodDiscrete;break;case vo:t=this.InterpolantFactoryMethodLinear;break;case mo:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return tr;case this.InterpolantFactoryMethodLinear:return vo;case this.InterpolantFactoryMethodSmooth:return mo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&jd(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===mo,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*n,f=u-n,p=u+n;for(let _=0;_!==n;++_){let x=t[u+_];if(x!==t[f+_]||x!==t[p+_]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,f=o*n;for(let p=0;p!==n;++p)t[f+p]=t[u+p]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};nn.prototype.ValueTypeName="";nn.prototype.TimeBufferType=Float32Array;nn.prototype.ValueBufferType=Float32Array;nn.prototype.DefaultInterpolation=vo;var gi=class extends nn{constructor(e,t,n){super(e,t,n)}};gi.prototype.ValueTypeName="bool";gi.prototype.ValueBufferType=Array;gi.prototype.DefaultInterpolation=tr;gi.prototype.InterpolantFactoryMethodLinear=void 0;gi.prototype.InterpolantFactoryMethodSmooth=void 0;var Oo=class extends nn{constructor(e,t,n,s){super(e,t,n,s)}};Oo.prototype.ValueTypeName="color";var Uo=class extends nn{constructor(e,t,n,s){super(e,t,n,s)}};Uo.prototype.ValueTypeName="number";var Fo=class extends Hi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)pn.slerpFlat(r,0,o,c-a,o,c,l);return r}},gr=class extends nn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Fo(this.times,this.values,this.getValueSize(),e)}};gr.prototype.ValueTypeName="quaternion";gr.prototype.InterpolantFactoryMethodSmooth=void 0;var _i=class extends nn{constructor(e,t,n){super(e,t,n)}};_i.prototype.ValueTypeName="string";_i.prototype.ValueBufferType=Array;_i.prototype.DefaultInterpolation=tr;_i.prototype.InterpolantFactoryMethodLinear=void 0;_i.prototype.InterpolantFactoryMethodSmooth=void 0;var Bo=class extends nn{constructor(e,t,n,s){super(e,t,n,s)}};Bo.prototype.ValueTypeName="vector";var ko=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){let p=c[u],_=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return _}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Kh=new ko,zo=class{constructor(e){this.manager=e!==void 0?e:Kh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};zo.DEFAULT_MATERIAL_NAME="__DEFAULT";var _r=class extends Dt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ze(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},xr=class extends _r{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},yl=new ht,ih=new D,sh=new D,El=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new we(512,512),this.mapType=Rn,this.map=null,this.mapPass=null,this.matrix=new ht,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ws,this._frameExtents=new we(1,1),this._viewportCount=1,this._viewports=[new _t(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;ih.setFromMatrixPosition(e.matrixWorld),t.position.copy(ih),sh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(sh),t.updateMatrixWorld(),yl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(yl,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(yl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var yr=class extends lr{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},wl=class extends El{constructor(){super(new yr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},vr=class extends _r{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.target=new Dt,this.shadow=new wl}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var Ho=class extends Pt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var $l="\\[\\]\\.:\\/",$d=new RegExp("["+$l+"]","g"),Jl="[^"+$l+"]",Jd="[^"+$l.replace("\\.","")+"]",Kd=/((?:WC+[\/:])*)/.source.replace("WC",Jl),Qd=/(WCOD+)?/.source.replace("WCOD",Jd),ef=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Jl),tf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Jl),nf=new RegExp("^"+Kd+Qd+ef+tf+"$"),sf=["material","materials","bones","map"],Tl=class{constructor(e,t,n){let s=n||ft.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ft=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace($d,"")}static parseTrackName(e){let t=nf.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);sf.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ft.Composite=Tl;ft.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ft.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ft.prototype.GetterByBindingType=[ft.prototype._getValue_direct,ft.prototype._getValue_array,ft.prototype._getValue_arrayElement,ft.prototype._getValue_toArray];ft.prototype.SetterByBindingTypeAndVersioning=[[ft.prototype._setValue_direct,ft.prototype._setValue_direct_setNeedsUpdate,ft.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_array,ft.prototype._setValue_array_setNeedsUpdate,ft.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_arrayElement,ft.prototype._setValue_arrayElement_setNeedsUpdate,ft.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_fromArray,ft.prototype._setValue_fromArray_setNeedsUpdate,ft.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var r0=new Float32Array(1);var rh=new ht,br=class{constructor(e,t,n=0,s=1/0){this.ray=new mi(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Ms,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return rh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(rh),this}intersectObject(e,t=!0,n=[]){return Al(e,this,n,t),n.sort(oh),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Al(e[s],this,n,t);return n.sort(oh),n}};function oh(i,e){return i.distance-e.distance}function Al(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)Al(r[o],e,t,!0)}}var xi=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=qe(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(qe(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Mr=class extends ei{constructor(e=10,t=10,n=4473924,s=8947848){n=new ze(n),s=new ze(s);let r=t/2,o=e/t,a=e/2,l=[],c=[];for(let f=0,p=0,_=-a;f<=t;f++,_+=o){l.push(-a,0,_,a,0,_),l.push(_,0,-a,_,0,a);let x=f===r?n:s;x.toArray(c,p),p+=3,x.toArray(c,p),p+=3,x.toArray(c,p),p+=3,x.toArray(c,p),p+=3}let h=new xt;h.setAttribute("position",new st(l,3)),h.setAttribute("color",new st(c,3));let u=new Cn({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}};var Sr=class extends ei{constructor(e=1){let t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new xt;s.setAttribute("position",new st(t,3)),s.setAttribute("color",new st(n,3));let r=new Cn({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(e,t,n){let s=new ze,r=this.geometry.attributes.color.array;return s.set(e),s.toArray(r,0),s.toArray(r,3),s.set(t),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}};var Er=class extends Un{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function Kl(i,e,t,n){let s=rf(n);switch(t){case kl:return i*e;case Hl:return i*e/s.components*s.byteLength;case na:return i*e/s.components*s.byteLength;case Vl:return i*e*2/s.components*s.byteLength;case ia:return i*e*2/s.components*s.byteLength;case zl:return i*e*3/s.components*s.byteLength;case gn:return i*e*4/s.components*s.byteLength;case sa:return i*e*4/s.components*s.byteLength;case Ar:case Cr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Rr:case Ir:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case oa:case la:return Math.max(i,16)*Math.max(e,8)/4;case ra:case aa:return Math.max(i,8)*Math.max(e,8)/2;case ca:case ha:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ua:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case da:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case fa:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case pa:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ma:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case ga:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case _a:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case xa:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case ya:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case va:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ba:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ma:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Sa:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Ea:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case wa:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Ta:case Aa:case Ca:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Ra:case Ia:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Pa:case Da:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function rf(i){switch(i){case Rn:case Ol:return{byteLength:1,components:1};case Rs:case Ul:case Is:return{byteLength:2,components:1};case ea:case ta:return{byteLength:2,components:4};case Mi:case Qo:case Vn:return{byteLength:4,components:1};case Fl:case Bl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Mu(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function af(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((p,_)=>p.start-_.start);let f=0;for(let p=1;p<u.length;p++){let _=u[f],x=u[p];x.start<=_.start+_.count+1?_.count=Math.max(_.count,x.start+x.count-_.start):(++f,u[f]=x)}u.length=f+1;for(let p=0,_=u.length;p<_;p++){let x=u[p];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var lf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,cf=`#ifdef USE_ALPHAHASH
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
#endif`,hf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,uf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,df=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ff=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,pf=`#ifdef USE_AOMAP
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
#endif`,mf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,gf=`#ifdef USE_BATCHING
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
#endif`,_f=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,xf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,yf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,vf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,bf=`#ifdef USE_IRIDESCENCE
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
#endif`,Mf=`#ifdef USE_BUMPMAP
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
#endif`,Sf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ef=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,wf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Tf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Af=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Cf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Rf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,If=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Pf=`#define PI 3.141592653589793
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
} // validated`,Df=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Lf=`vec3 transformedNormal = objectNormal;
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
#endif`,Nf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Of=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Uf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ff=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Bf="gl_FragColor = linearToOutputTexel( gl_FragColor );",kf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,zf=`#ifdef USE_ENVMAP
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
#endif`,Hf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Vf=`#ifdef USE_ENVMAP
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
#endif`,Gf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Wf=`#ifdef USE_ENVMAP
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
#endif`,Xf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,qf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Yf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Zf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,jf=`#ifdef USE_GRADIENTMAP
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
}`,$f=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Jf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Kf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Qf=`uniform bool receiveShadow;
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
#endif`,ep=`#ifdef USE_ENVMAP
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
#endif`,tp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,np=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ip=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,sp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,rp=`PhysicalMaterial material;
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
#endif`,op=`struct PhysicalMaterial {
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
}`,ap=`
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
#endif`,lp=`#if defined( RE_IndirectDiffuse )
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
#endif`,cp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,hp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,up=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,pp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,mp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,_p=`#if defined( USE_POINTS_UV )
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
#endif`,xp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,yp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,vp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,bp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Mp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sp=`#ifdef USE_MORPHTARGETS
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
#endif`,Ep=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Tp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ap=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ip=`#ifdef USE_NORMALMAP
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
#endif`,Pp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Dp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Lp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Np=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Op=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Up=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Fp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Bp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,kp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Hp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Vp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Gp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Wp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Xp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,qp=`float getShadowMask() {
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
}`,Yp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zp=`#ifdef USE_SKINNING
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
#endif`,jp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,$p=`#ifdef USE_SKINNING
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
#endif`,Jp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Kp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Qp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,em=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,tm=`#ifdef USE_TRANSMISSION
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
#endif`,nm=`#ifdef USE_TRANSMISSION
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
#endif`,im=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,om=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,am=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,lm=`uniform sampler2D t2D;
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
}`,cm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,um=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fm=`#include <common>
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
}`,pm=`#if DEPTH_PACKING == 3200
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
}`,mm=`#define DISTANCE
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
}`,gm=`#define DISTANCE
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
}`,_m=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,xm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ym=`uniform float scale;
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
}`,vm=`uniform vec3 diffuse;
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
}`,bm=`#include <common>
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
}`,Mm=`uniform vec3 diffuse;
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
}`,Sm=`#define LAMBERT
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
}`,Em=`#define LAMBERT
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
}`,wm=`#define MATCAP
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
}`,Tm=`#define MATCAP
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
}`,Am=`#define NORMAL
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
}`,Cm=`#define NORMAL
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
}`,Rm=`#define PHONG
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
}`,Im=`#define PHONG
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
}`,Pm=`#define STANDARD
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
}`,Dm=`#define STANDARD
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
}`,Lm=`#define TOON
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
}`,Nm=`#define TOON
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
}`,Om=`uniform float size;
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
}`,Um=`uniform vec3 diffuse;
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
}`,Fm=`#include <common>
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
}`,Bm=`uniform vec3 color;
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
}`,km=`uniform float rotation;
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
}`,zm=`uniform vec3 diffuse;
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
}`,Xe={alphahash_fragment:lf,alphahash_pars_fragment:cf,alphamap_fragment:hf,alphamap_pars_fragment:uf,alphatest_fragment:df,alphatest_pars_fragment:ff,aomap_fragment:pf,aomap_pars_fragment:mf,batching_pars_vertex:gf,batching_vertex:_f,begin_vertex:xf,beginnormal_vertex:yf,bsdfs:vf,iridescence_fragment:bf,bumpmap_pars_fragment:Mf,clipping_planes_fragment:Sf,clipping_planes_pars_fragment:Ef,clipping_planes_pars_vertex:wf,clipping_planes_vertex:Tf,color_fragment:Af,color_pars_fragment:Cf,color_pars_vertex:Rf,color_vertex:If,common:Pf,cube_uv_reflection_fragment:Df,defaultnormal_vertex:Lf,displacementmap_pars_vertex:Nf,displacementmap_vertex:Of,emissivemap_fragment:Uf,emissivemap_pars_fragment:Ff,colorspace_fragment:Bf,colorspace_pars_fragment:kf,envmap_fragment:zf,envmap_common_pars_fragment:Hf,envmap_pars_fragment:Vf,envmap_pars_vertex:Gf,envmap_physical_pars_fragment:ep,envmap_vertex:Wf,fog_vertex:Xf,fog_pars_vertex:qf,fog_fragment:Yf,fog_pars_fragment:Zf,gradientmap_pars_fragment:jf,lightmap_pars_fragment:$f,lights_lambert_fragment:Jf,lights_lambert_pars_fragment:Kf,lights_pars_begin:Qf,lights_toon_fragment:tp,lights_toon_pars_fragment:np,lights_phong_fragment:ip,lights_phong_pars_fragment:sp,lights_physical_fragment:rp,lights_physical_pars_fragment:op,lights_fragment_begin:ap,lights_fragment_maps:lp,lights_fragment_end:cp,logdepthbuf_fragment:hp,logdepthbuf_pars_fragment:up,logdepthbuf_pars_vertex:dp,logdepthbuf_vertex:fp,map_fragment:pp,map_pars_fragment:mp,map_particle_fragment:gp,map_particle_pars_fragment:_p,metalnessmap_fragment:xp,metalnessmap_pars_fragment:yp,morphinstance_vertex:vp,morphcolor_vertex:bp,morphnormal_vertex:Mp,morphtarget_pars_vertex:Sp,morphtarget_vertex:Ep,normal_fragment_begin:wp,normal_fragment_maps:Tp,normal_pars_fragment:Ap,normal_pars_vertex:Cp,normal_vertex:Rp,normalmap_pars_fragment:Ip,clearcoat_normal_fragment_begin:Pp,clearcoat_normal_fragment_maps:Dp,clearcoat_pars_fragment:Lp,iridescence_pars_fragment:Np,opaque_fragment:Op,packing:Up,premultiplied_alpha_fragment:Fp,project_vertex:Bp,dithering_fragment:kp,dithering_pars_fragment:zp,roughnessmap_fragment:Hp,roughnessmap_pars_fragment:Vp,shadowmap_pars_fragment:Gp,shadowmap_pars_vertex:Wp,shadowmap_vertex:Xp,shadowmask_pars_fragment:qp,skinbase_vertex:Yp,skinning_pars_vertex:Zp,skinning_vertex:jp,skinnormal_vertex:$p,specularmap_fragment:Jp,specularmap_pars_fragment:Kp,tonemapping_fragment:Qp,tonemapping_pars_fragment:em,transmission_fragment:tm,transmission_pars_fragment:nm,uv_pars_fragment:im,uv_pars_vertex:sm,uv_vertex:rm,worldpos_vertex:om,background_vert:am,background_frag:lm,backgroundCube_vert:cm,backgroundCube_frag:hm,cube_vert:um,cube_frag:dm,depth_vert:fm,depth_frag:pm,distanceRGBA_vert:mm,distanceRGBA_frag:gm,equirect_vert:_m,equirect_frag:xm,linedashed_vert:ym,linedashed_frag:vm,meshbasic_vert:bm,meshbasic_frag:Mm,meshlambert_vert:Sm,meshlambert_frag:Em,meshmatcap_vert:wm,meshmatcap_frag:Tm,meshnormal_vert:Am,meshnormal_frag:Cm,meshphong_vert:Rm,meshphong_frag:Im,meshphysical_vert:Pm,meshphysical_frag:Dm,meshtoon_vert:Lm,meshtoon_frag:Nm,points_vert:Om,points_frag:Um,shadow_vert:Fm,shadow_frag:Bm,sprite_vert:km,sprite_frag:zm},pe={common:{diffuse:{value:new ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},envMapRotation:{value:new Ge},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new we(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new ze(16777215)},opacity:{value:1},center:{value:new we(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},Gn={basic:{uniforms:Ht([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:Ht([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new ze(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:Ht([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new ze(0)},specular:{value:new ze(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:Ht([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:Ht([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new ze(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:Ht([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:Ht([pe.points,pe.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:Ht([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:Ht([pe.common,pe.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:Ht([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:Ht([pe.sprite,pe.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ge}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:Ht([pe.common,pe.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:Ht([pe.lights,pe.fog,{color:{value:new ze(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};Gn.physical={uniforms:Ht([Gn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new we(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new we},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new ze(0)},specularColor:{value:new ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new we},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};var La={r:0,b:0,g:0},Xi=new Tn,Hm=new ht;function Vm(i,e,t,n,s,r,o){let a=new ze(0),l=r===!0?0:1,c,h,u=null,f=0,p=null;function _(v){let y=v.isScene===!0?v.background:null;return y&&y.isTexture&&(y=(v.backgroundBlurriness>0?t:e).get(y)),y}function x(v){let y=!1,A=_(v);A===null?d(a,l):A&&A.isColor&&(d(A,1),y=!0);let w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(v,y){let A=_(y);A&&(A.isCubeTexture||A.mapping===wr)?(h===void 0&&(h=new Mt(new zt(1,1,1),new An({name:"BackgroundCubeMaterial",uniforms:Wi(Gn.backgroundCube.uniforms),vertexShader:Gn.backgroundCube.vertexShader,fragmentShader:Gn.backgroundCube.fragmentShader,side:qt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,C,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Xi.copy(y.backgroundRotation),Xi.x*=-1,Xi.y*=-1,Xi.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(Xi.y*=-1,Xi.z*=-1),h.material.uniforms.envMap.value=A,h.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Hm.makeRotationFromEuler(Xi)),h.material.toneMapped=Je.getTransfer(A.colorSpace)!==it,(u!==A||f!==A.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=A,f=A.version,p=i.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):A&&A.isTexture&&(c===void 0&&(c=new Mt(new zi(2,2),new An({name:"BackgroundMaterial",uniforms:Wi(Gn.background.uniforms),vertexShader:Gn.background.vertexShader,fragmentShader:Gn.background.fragmentShader,side:Qn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=A,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=Je.getTransfer(A.colorSpace)!==it,A.matrixAutoUpdate===!0&&A.updateMatrix(),c.material.uniforms.uvTransform.value.copy(A.matrix),(u!==A||f!==A.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,u=A,f=A.version,p=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function d(v,y){v.getRGB(La,jl(i)),n.buffers.color.setClear(La.r,La.g,La.b,y,o)}function E(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,y=1){a.set(v),l=y,d(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,d(a,l)},render:x,addToRenderList:m,dispose:E}}function Gm(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,o=!1;function a(b,R,U,G,Z){let j=!1,W=u(G,U,R);r!==W&&(r=W,c(r.object)),j=p(b,G,U,Z),j&&_(b,G,U,Z),Z!==null&&e.update(Z,i.ELEMENT_ARRAY_BUFFER),(j||o)&&(o=!1,y(b,R,U,G),Z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(Z).buffer))}function l(){return i.createVertexArray()}function c(b){return i.bindVertexArray(b)}function h(b){return i.deleteVertexArray(b)}function u(b,R,U){let G=U.wireframe===!0,Z=n[b.id];Z===void 0&&(Z={},n[b.id]=Z);let j=Z[R.id];j===void 0&&(j={},Z[R.id]=j);let W=j[G];return W===void 0&&(W=f(l()),j[G]=W),W}function f(b){let R=[],U=[],G=[];for(let Z=0;Z<t;Z++)R[Z]=0,U[Z]=0,G[Z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:U,attributeDivisors:G,object:b,attributes:{},index:null}}function p(b,R,U,G){let Z=r.attributes,j=R.attributes,W=0,re=U.getAttributes();for(let q in re)if(re[q].location>=0){let J=Z[q],ee=j[q];if(ee===void 0&&(q==="instanceMatrix"&&b.instanceMatrix&&(ee=b.instanceMatrix),q==="instanceColor"&&b.instanceColor&&(ee=b.instanceColor)),J===void 0||J.attribute!==ee||ee&&J.data!==ee.data)return!0;W++}return r.attributesNum!==W||r.index!==G}function _(b,R,U,G){let Z={},j=R.attributes,W=0,re=U.getAttributes();for(let q in re)if(re[q].location>=0){let J=j[q];J===void 0&&(q==="instanceMatrix"&&b.instanceMatrix&&(J=b.instanceMatrix),q==="instanceColor"&&b.instanceColor&&(J=b.instanceColor));let ee={};ee.attribute=J,J&&J.data&&(ee.data=J.data),Z[q]=ee,W++}r.attributes=Z,r.attributesNum=W,r.index=G}function x(){let b=r.newAttributes;for(let R=0,U=b.length;R<U;R++)b[R]=0}function m(b){d(b,0)}function d(b,R){let U=r.newAttributes,G=r.enabledAttributes,Z=r.attributeDivisors;U[b]=1,G[b]===0&&(i.enableVertexAttribArray(b),G[b]=1),Z[b]!==R&&(i.vertexAttribDivisor(b,R),Z[b]=R)}function E(){let b=r.newAttributes,R=r.enabledAttributes;for(let U=0,G=R.length;U<G;U++)R[U]!==b[U]&&(i.disableVertexAttribArray(U),R[U]=0)}function v(b,R,U,G,Z,j,W){W===!0?i.vertexAttribIPointer(b,R,U,Z,j):i.vertexAttribPointer(b,R,U,G,Z,j)}function y(b,R,U,G){x();let Z=G.attributes,j=U.getAttributes(),W=R.defaultAttributeValues;for(let re in j){let q=j[re];if(q.location>=0){let F=Z[re];if(F===void 0&&(re==="instanceMatrix"&&b.instanceMatrix&&(F=b.instanceMatrix),re==="instanceColor"&&b.instanceColor&&(F=b.instanceColor)),F!==void 0){let J=F.normalized,ee=F.itemSize,be=e.get(F);if(be===void 0)continue;let Oe=be.buffer,Pe=be.type,Ce=be.bytesPerElement,K=Pe===i.INT||Pe===i.UNSIGNED_INT||F.gpuType===Qo;if(F.isInterleavedBufferAttribute){let V=F.data,ie=V.stride,de=F.offset;if(V.isInstancedInterleavedBuffer){for(let _e=0;_e<q.locationSize;_e++)d(q.location+_e,V.meshPerAttribute);b.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let _e=0;_e<q.locationSize;_e++)m(q.location+_e);i.bindBuffer(i.ARRAY_BUFFER,Oe);for(let _e=0;_e<q.locationSize;_e++)v(q.location+_e,ee/q.locationSize,Pe,J,ie*Ce,(de+ee/q.locationSize*_e)*Ce,K)}else{if(F.isInstancedBufferAttribute){for(let V=0;V<q.locationSize;V++)d(q.location+V,F.meshPerAttribute);b.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=F.meshPerAttribute*F.count)}else for(let V=0;V<q.locationSize;V++)m(q.location+V);i.bindBuffer(i.ARRAY_BUFFER,Oe);for(let V=0;V<q.locationSize;V++)v(q.location+V,ee/q.locationSize,Pe,J,ee*Ce,ee/q.locationSize*V*Ce,K)}}else if(W!==void 0){let J=W[re];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(q.location,J);break;case 3:i.vertexAttrib3fv(q.location,J);break;case 4:i.vertexAttrib4fv(q.location,J);break;default:i.vertexAttrib1fv(q.location,J)}}}}E()}function A(){L();for(let b in n){let R=n[b];for(let U in R){let G=R[U];for(let Z in G)h(G[Z].object),delete G[Z];delete R[U]}delete n[b]}}function w(b){if(n[b.id]===void 0)return;let R=n[b.id];for(let U in R){let G=R[U];for(let Z in G)h(G[Z].object),delete G[Z];delete R[U]}delete n[b.id]}function C(b){for(let R in n){let U=n[R];if(U[b.id]===void 0)continue;let G=U[b.id];for(let Z in G)h(G[Z].object),delete G[Z];delete U[b.id]}}function L(){S(),o=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:L,resetDefaultState:S,dispose:A,releaseStatesOfGeometry:w,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:m,disableUnusedAttributes:E}}function Wm(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let p=0;for(let _=0;_<u;_++)p+=h[_];t.update(p,n,1)}function l(c,h,u,f){if(u===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<c.length;_++)o(c[_],h[_],f[_]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,u);let _=0;for(let x=0;x<u;x++)_+=h[x]*f[x];t.update(_,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Xm(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==gn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let L=C===Is&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Rn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Vn&&!L)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=_>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:_,maxTextureSize:x,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:E,maxVaryings:v,maxFragmentUniforms:y,vertexTextures:A,maxSamples:w}}function qm(i){let e=this,t=null,n=0,s=!1,r=!1,o=new dn,a=new Ge,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let p=u.length!==0||f||n!==0||s;return s=f,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,p){let _=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,d=i.get(u);if(!s||_===null||_.length===0||r&&!m)r?h(null):c();else{let E=r?0:n,v=E*4,y=d.clippingState||null;l.value=y,y=h(_,f,v,p);for(let A=0;A!==v;++A)y[A]=t[A];d.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,p,_){let x=u!==null?u.length:0,m=null;if(x!==0){if(m=l.value,_!==!0||m===null){let d=p+x*4,E=f.matrixWorldInverse;a.getNormalMatrix(E),(m===null||m.length<d)&&(m=new Float32Array(d));for(let v=0,y=p;v!==x;++v,y+=4)o.copy(u[v]).applyMatrix4(E,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function Ym(i){let e=new WeakMap;function t(o,a){return a===$o?o.mapping=Vi:a===Jo&&(o.mapping=Gi),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===$o||a===Jo)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new To(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Ns=4,Qh=[.125,.215,.35,.446,.526,.582],Zi=20,Ql=new yr,eu=new ze,ec=null,tc=0,nc=0,ic=!1,Yi=(1+Math.sqrt(5))/2,Ls=1/Yi,tu=[new D(-Yi,Ls,0),new D(Yi,Ls,0),new D(-Ls,0,Yi),new D(Ls,0,Yi),new D(0,Yi,-Ls),new D(0,Yi,Ls),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],Zm=new D,Ua=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=Zm}=r;ec=this._renderer.getRenderTarget(),tc=this._renderer.getActiveCubeFace(),nc=this._renderer.getActiveMipmapLevel(),ic=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=su(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=iu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ec,tc,nc),this._renderer.xr.enabled=ic,e.scissorTest=!1,Na(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Vi||e.mapping===Gi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ec=this._renderer.getRenderTarget(),tc=this._renderer.getActiveCubeFace(),nc=this._renderer.getActiveMipmapLevel(),ic=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:wn,minFilter:wn,generateMipmaps:!1,type:Is,format:gn,colorSpace:Oi,depthBuffer:!1},s=nu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=nu(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=jm(r)),this._blurMaterial=$m(r,e,t)}return s}_compileMaterial(e){let t=new Mt(this._lodPlanes[0],e);this._renderer.compile(t,Ql)}_sceneToCubeUV(e,t,n,s,r){let l=new Pt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor(eu),u.toneMapping=ni,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let x=new mn({name:"PMREM.Background",side:qt,depthWrite:!1,depthTest:!1}),m=new Mt(new zt,x),d=!1,E=e.background;E?E.isColor&&(x.color.copy(E),e.background=null,d=!0):(x.color.copy(eu),d=!0);for(let v=0;v<6;v++){let y=v%3;y===0?(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[v],r.y,r.z)):y===1?(l.up.set(0,0,c[v]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[v],r.z)):(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[v]));let A=this._cubeSize;Na(s,y*A,v>2?A:0,A,A),u.setRenderTarget(s),d&&u.render(m,l),u.render(e,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=p,u.autoClear=f,e.background=E}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Vi||e.mapping===Gi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=su()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=iu());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new Mt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;Na(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Ql)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=tu[(s-r-1)%tu.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new Mt(this._lodPlanes[s],c),f=c.uniforms,p=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Zi-1),x=r/_,m=isFinite(r)?1+Math.floor(h*x):Zi;m>Zi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Zi}`);let d=[],E=0;for(let C=0;C<Zi;++C){let L=C/x,S=Math.exp(-L*L/2);d.push(S),C===0?E+=S:C<m&&(E+=2*S)}for(let C=0;C<d.length;C++)d[C]=d[C]/E;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:v}=this;f.dTheta.value=_,f.mipInt.value=v-n;let y=this._sizeLods[s],A=3*y*(s>v-Ns?s-v+Ns:0),w=4*(this._cubeSize-y);Na(t,A,w,3*y,2*y),l.setRenderTarget(t),l.render(u,Ql)}};function jm(i){let e=[],t=[],n=[],s=i,r=i-Ns+1+Qh.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-Ns?l=Qh[o-i+Ns-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,_=6,x=3,m=2,d=1,E=new Float32Array(x*_*p),v=new Float32Array(m*_*p),y=new Float32Array(d*_*p);for(let w=0;w<p;w++){let C=w%3*2/3-1,L=w>2?0:-1,S=[C,L,0,C+2/3,L,0,C+2/3,L+1,0,C,L,0,C+2/3,L+1,0,C,L+1,0];E.set(S,x*_*w),v.set(f,m*_*w);let b=[w,w,w,w,w,w];y.set(b,d*_*w)}let A=new xt;A.setAttribute("position",new Zt(E,x)),A.setAttribute("uv",new Zt(v,m)),A.setAttribute("faceIndex",new Zt(y,d)),e.push(A),s>Ns&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function nu(i,e,t){let n=new Fn(i,e,t);return n.texture.mapping=wr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Na(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function $m(i,e,t){let n=new Float32Array(Zi),s=new D(0,1,0);return new An({name:"SphericalGaussianBlur",defines:{n:Zi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:fc(),fragmentShader:`

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
		`,blending:ti,depthTest:!1,depthWrite:!1})}function iu(){return new An({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:fc(),fragmentShader:`

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
		`,blending:ti,depthTest:!1,depthWrite:!1})}function su(){return new An({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:fc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function fc(){return`

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
	`}function Jm(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===$o||l===Jo,h=l===Vi||l===Gi;if(c||h){let u=e.get(a),f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new Ua(i)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let p=a.image;return c&&p&&p.height>0||h&&p&&s(p)?(t===null&&(t=new Ua(i)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Km(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&vs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Qm(i,e,t,n){let s={},r=new WeakMap;function o(u){let f=u.target;f.index!==null&&e.remove(f.index);for(let _ in f.attributes)e.remove(f.attributes[_]);f.removeEventListener("dispose",o),delete s[f.id];let p=r.get(f);p&&(e.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,t.memory.geometries++),f}function l(u){let f=u.attributes;for(let p in f)e.update(f[p],i.ARRAY_BUFFER)}function c(u){let f=[],p=u.index,_=u.attributes.position,x=0;if(p!==null){let E=p.array;x=p.version;for(let v=0,y=E.length;v<y;v+=3){let A=E[v+0],w=E[v+1],C=E[v+2];f.push(A,w,w,C,C,A)}}else if(_!==void 0){let E=_.array;x=_.version;for(let v=0,y=E.length/3-1;v<y;v+=3){let A=v+0,w=v+1,C=v+2;f.push(A,w,w,C,C,A)}}else return;let m=new(Zl(f)?ar:or)(f,1);m.version=x;let d=r.get(u);d&&e.remove(d),r.set(u,m)}function h(u){let f=r.get(u);if(f){let p=u.index;p!==null&&f.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function eg(i,e,t){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,p){i.drawElements(n,p,r,f*o),t.update(p,n,1)}function c(f,p,_){_!==0&&(i.drawElementsInstanced(n,p,r,f*o,_),t.update(p,n,_))}function h(f,p,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,_);let m=0;for(let d=0;d<_;d++)m+=p[d];t.update(m,n,1)}function u(f,p,_,x){if(_===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)c(f[d]/o,p[d],x[d]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,x,0,_);let d=0;for(let E=0;E<_;E++)d+=p[E]*x[E];t.update(d,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function tg(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function ng(i,e,t){let n=new WeakMap,s=new _t;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,f=n.get(a);if(f===void 0||f.count!==u){let S=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",S)};f!==void 0&&f.texture.dispose();let p=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],d=a.morphAttributes.normal||[],E=a.morphAttributes.color||[],v=0;p===!0&&(v=1),_===!0&&(v=2),x===!0&&(v=3);let y=a.attributes.position.count*v,A=1;y>e.maxTextureSize&&(A=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let w=new Float32Array(y*A*4*u),C=new rr(w,y,A,u);C.type=Vn,C.needsUpdate=!0;let L=v*4;for(let b=0;b<u;b++){let R=m[b],U=d[b],G=E[b],Z=y*A*4*b;for(let j=0;j<R.count;j++){let W=j*L;p===!0&&(s.fromBufferAttribute(R,j),w[Z+W+0]=s.x,w[Z+W+1]=s.y,w[Z+W+2]=s.z,w[Z+W+3]=0),_===!0&&(s.fromBufferAttribute(U,j),w[Z+W+4]=s.x,w[Z+W+5]=s.y,w[Z+W+6]=s.z,w[Z+W+7]=0),x===!0&&(s.fromBufferAttribute(G,j),w[Z+W+8]=s.x,w[Z+W+9]=s.y,w[Z+W+10]=s.z,w[Z+W+11]=G.itemSize===4?s.w:1)}}f={count:u,texture:C,size:new we(y,A)},n.set(a,f),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let p=0;for(let x=0;x<c.length;x++)p+=c[x];let _=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function ig(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var Su=new jt,ru=new fr(1,1),Eu=new rr,wu=new Eo,Tu=new cr,ou=[],au=[],lu=new Float32Array(16),cu=new Float32Array(9),hu=new Float32Array(4);function Fs(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=ou[s];if(r===void 0&&(r=new Float32Array(s),ou[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Tt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function At(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Fa(i,e){let t=au[e];t===void 0&&(t=new Int32Array(e),au[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function sg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function rg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2fv(this.addr,e),At(t,e)}}function og(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;i.uniform3fv(this.addr,e),At(t,e)}}function ag(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4fv(this.addr,e),At(t,e)}}function lg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,n))return;hu.set(n),i.uniformMatrix2fv(this.addr,!1,hu),At(t,n)}}function cg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,n))return;cu.set(n),i.uniformMatrix3fv(this.addr,!1,cu),At(t,n)}}function hg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,n))return;lu.set(n),i.uniformMatrix4fv(this.addr,!1,lu),At(t,n)}}function ug(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function dg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2iv(this.addr,e),At(t,e)}}function fg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;i.uniform3iv(this.addr,e),At(t,e)}}function pg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4iv(this.addr,e),At(t,e)}}function mg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function gg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2uiv(this.addr,e),At(t,e)}}function _g(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;i.uniform3uiv(this.addr,e),At(t,e)}}function xg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4uiv(this.addr,e),At(t,e)}}function yg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(ru.compareFunction=Wl,r=ru):r=Su,t.setTexture2D(e||r,s)}function vg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||wu,s)}function bg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Tu,s)}function Mg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Eu,s)}function Sg(i){switch(i){case 5126:return sg;case 35664:return rg;case 35665:return og;case 35666:return ag;case 35674:return lg;case 35675:return cg;case 35676:return hg;case 5124:case 35670:return ug;case 35667:case 35671:return dg;case 35668:case 35672:return fg;case 35669:case 35673:return pg;case 5125:return mg;case 36294:return gg;case 36295:return _g;case 36296:return xg;case 35678:case 36198:case 36298:case 36306:case 35682:return yg;case 35679:case 36299:case 36307:return vg;case 35680:case 36300:case 36308:case 36293:return bg;case 36289:case 36303:case 36311:case 36292:return Mg}}function Eg(i,e){i.uniform1fv(this.addr,e)}function wg(i,e){let t=Fs(e,this.size,2);i.uniform2fv(this.addr,t)}function Tg(i,e){let t=Fs(e,this.size,3);i.uniform3fv(this.addr,t)}function Ag(i,e){let t=Fs(e,this.size,4);i.uniform4fv(this.addr,t)}function Cg(i,e){let t=Fs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Rg(i,e){let t=Fs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Ig(i,e){let t=Fs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Pg(i,e){i.uniform1iv(this.addr,e)}function Dg(i,e){i.uniform2iv(this.addr,e)}function Lg(i,e){i.uniform3iv(this.addr,e)}function Ng(i,e){i.uniform4iv(this.addr,e)}function Og(i,e){i.uniform1uiv(this.addr,e)}function Ug(i,e){i.uniform2uiv(this.addr,e)}function Fg(i,e){i.uniform3uiv(this.addr,e)}function Bg(i,e){i.uniform4uiv(this.addr,e)}function kg(i,e,t){let n=this.cache,s=e.length,r=Fa(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Su,r[o])}function zg(i,e,t){let n=this.cache,s=e.length,r=Fa(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||wu,r[o])}function Hg(i,e,t){let n=this.cache,s=e.length,r=Fa(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Tu,r[o])}function Vg(i,e,t){let n=this.cache,s=e.length,r=Fa(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Eu,r[o])}function Gg(i){switch(i){case 5126:return Eg;case 35664:return wg;case 35665:return Tg;case 35666:return Ag;case 35674:return Cg;case 35675:return Rg;case 35676:return Ig;case 5124:case 35670:return Pg;case 35667:case 35671:return Dg;case 35668:case 35672:return Lg;case 35669:case 35673:return Ng;case 5125:return Og;case 36294:return Ug;case 36295:return Fg;case 36296:return Bg;case 35678:case 36198:case 36298:case 36306:case 35682:return kg;case 35679:case 36299:case 36307:return zg;case 35680:case 36300:case 36308:case 36293:return Hg;case 36289:case 36303:case 36311:case 36292:return Vg}}var rc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Sg(t.type)}},oc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Gg(t.type)}},ac=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},sc=/(\w+)(\])?(\[|\.)?/g;function uu(i,e){i.seq.push(e),i.map[e.id]=e}function Wg(i,e,t){let n=i.name,s=n.length;for(sc.lastIndex=0;;){let r=sc.exec(n),o=sc.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){uu(t,c===void 0?new rc(a,i,e):new oc(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new ac(a),uu(t,u)),t=u}}}var Os=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Wg(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function du(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Xg=37297,qg=0;function Yg(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var fu=new Ge;function Zg(i){Je._getMatrix(fu,Je.workingColorSpace,i);let e=`mat3( ${fu.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(i)){case nr:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function pu(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Yg(i.getShaderSource(e),a)}else return r}function jg(i,e){let t=Zg(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function $g(i,e){let t;switch(e){case Rh:t="Linear";break;case Ih:t="Reinhard";break;case Ph:t="Cineon";break;case Dh:t="ACESFilmic";break;case Nh:t="AgX";break;case Oh:t="Neutral";break;case Lh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Oa=new D;function Jg(){Je.getLuminanceCoefficients(Oa);let i=Oa.x.toFixed(4),e=Oa.y.toFixed(4),t=Oa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Kg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Pr).join(`
`)}function Qg(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function e_(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Pr(i){return i!==""}function mu(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function gu(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var t_=/^[ \t]*#include +<([\w\d./]+)>/gm;function lc(i){return i.replace(t_,i_)}var n_=new Map;function i_(i,e){let t=Xe[e];if(t===void 0){let n=n_.get(e);if(n!==void 0)t=Xe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return lc(t)}var s_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function _u(i){return i.replace(s_,r_)}function r_(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function xu(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function o_(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Rl?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Vo?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===zn&&(e="SHADOWMAP_TYPE_VSM"),e}function a_(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Vi:case Gi:e="ENVMAP_TYPE_CUBE";break;case wr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function l_(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Gi&&(e="ENVMAP_MODE_REFRACTION"),e}function c_(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ll:e="ENVMAP_BLENDING_MULTIPLY";break;case Ah:e="ENVMAP_BLENDING_MIX";break;case Ch:e="ENVMAP_BLENDING_ADD";break}return e}function h_(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function u_(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=o_(t),c=a_(t),h=l_(t),u=c_(t),f=h_(t),p=Kg(t),_=Qg(r),x=s.createProgram(),m,d,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Pr).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Pr).join(`
`),d.length>0&&(d+=`
`)):(m=[xu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Pr).join(`
`),d=[xu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ni?"#define TONE_MAPPING":"",t.toneMapping!==ni?Xe.tonemapping_pars_fragment:"",t.toneMapping!==ni?$g("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,jg("linearToOutputTexel",t.outputColorSpace),Jg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Pr).join(`
`)),o=lc(o),o=mu(o,t),o=gu(o,t),a=lc(a),a=mu(a,t),a=gu(a,t),o=_u(o),a=_u(a),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",t.glslVersion===Xl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Xl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let v=E+m+o,y=E+d+a,A=du(s,s.VERTEX_SHADER,v),w=du(s,s.FRAGMENT_SHADER,y);s.attachShader(x,A),s.attachShader(x,w),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function C(R){if(i.debug.checkShaderErrors){let U=s.getProgramInfoLog(x)||"",G=s.getShaderInfoLog(A)||"",Z=s.getShaderInfoLog(w)||"",j=U.trim(),W=G.trim(),re=Z.trim(),q=!0,F=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,A,w);else{let J=pu(s,A,"vertex"),ee=pu(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+j+`
`+J+`
`+ee)}else j!==""?console.warn("THREE.WebGLProgram: Program Info Log:",j):(W===""||re==="")&&(F=!1);F&&(R.diagnostics={runnable:q,programLog:j,vertexShader:{log:W,prefix:m},fragmentShader:{log:re,prefix:d}})}s.deleteShader(A),s.deleteShader(w),L=new Os(s,x),S=e_(s,x)}let L;this.getUniforms=function(){return L===void 0&&C(this),L};let S;this.getAttributes=function(){return S===void 0&&C(this),S};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(x,Xg)),b},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=qg++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=A,this.fragmentShader=w,this}var d_=0,cc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new hc(e),t.set(e,n)),n}},hc=class{constructor(e){this.id=d_++,this.code=e,this.usedTimes=0}};function f_(i,e,t,n,s,r,o){let a=new Ms,l=new cc,c=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures,p=s.precision,_={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,b,R,U,G){let Z=U.fog,j=G.geometry,W=S.isMeshStandardMaterial?U.environment:null,re=(S.isMeshStandardMaterial?t:e).get(S.envMap||W),q=re&&re.mapping===wr?re.image.height:null,F=_[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));let J=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,ee=J!==void 0?J.length:0,be=0;j.morphAttributes.position!==void 0&&(be=1),j.morphAttributes.normal!==void 0&&(be=2),j.morphAttributes.color!==void 0&&(be=3);let Oe,Pe,Ce,K;if(F){let et=Gn[F];Oe=et.vertexShader,Pe=et.fragmentShader}else Oe=S.vertexShader,Pe=S.fragmentShader,l.update(S),Ce=l.getVertexShaderID(S),K=l.getFragmentShaderID(S);let V=i.getRenderTarget(),ie=i.state.buffers.depth.getReversed(),de=G.isInstancedMesh===!0,_e=G.isBatchedMesh===!0,Ae=!!S.map,pt=!!S.matcap,I=!!re,rt=!!S.aoMap,Fe=!!S.lightMap,Le=!!S.bumpMap,xe=!!S.normalMap,$e=!!S.displacementMap,Me=!!S.emissiveMap,Be=!!S.metalnessMap,bt=!!S.roughnessMap,yt=S.anisotropy>0,T=S.clearcoat>0,g=S.dispersion>0,P=S.iridescence>0,k=S.sheen>0,H=S.transmission>0,O=yt&&!!S.anisotropyMap,se=T&&!!S.clearcoatMap,ne=T&&!!S.clearcoatNormalMap,ue=T&&!!S.clearcoatRoughnessMap,fe=P&&!!S.iridescenceMap,te=P&&!!S.iridescenceThicknessMap,ce=k&&!!S.sheenColorMap,Ie=k&&!!S.sheenRoughnessMap,Te=!!S.specularMap,me=!!S.specularColorMap,We=!!S.specularIntensityMap,N=H&&!!S.transmissionMap,le=H&&!!S.thicknessMap,he=!!S.gradientMap,ve=!!S.alphaMap,oe=S.alphaTest>0,Q=!!S.alphaHash,Ee=!!S.extensions,ke=ni;S.toneMapped&&(V===null||V.isXRRenderTarget===!0)&&(ke=i.toneMapping);let ut={shaderID:F,shaderType:S.type,shaderName:S.name,vertexShader:Oe,fragmentShader:Pe,defines:S.defines,customVertexShaderID:Ce,customFragmentShaderID:K,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:_e,batchingColor:_e&&G._colorsTexture!==null,instancing:de,instancingColor:de&&G.instanceColor!==null,instancingMorph:de&&G.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:V===null?i.outputColorSpace:V.isXRRenderTarget===!0?V.texture.colorSpace:Oi,alphaToCoverage:!!S.alphaToCoverage,map:Ae,matcap:pt,envMap:I,envMapMode:I&&re.mapping,envMapCubeUVHeight:q,aoMap:rt,lightMap:Fe,bumpMap:Le,normalMap:xe,displacementMap:f&&$e,emissiveMap:Me,normalMapObjectSpace:xe&&S.normalMapType===kh,normalMapTangentSpace:xe&&S.normalMapType===Gl,metalnessMap:Be,roughnessMap:bt,anisotropy:yt,anisotropyMap:O,clearcoat:T,clearcoatMap:se,clearcoatNormalMap:ne,clearcoatRoughnessMap:ue,dispersion:g,iridescence:P,iridescenceMap:fe,iridescenceThicknessMap:te,sheen:k,sheenColorMap:ce,sheenRoughnessMap:Ie,specularMap:Te,specularColorMap:me,specularIntensityMap:We,transmission:H,transmissionMap:N,thicknessMap:le,gradientMap:he,opaque:S.transparent===!1&&S.blending===Li&&S.alphaToCoverage===!1,alphaMap:ve,alphaTest:oe,alphaHash:Q,combine:S.combine,mapUv:Ae&&x(S.map.channel),aoMapUv:rt&&x(S.aoMap.channel),lightMapUv:Fe&&x(S.lightMap.channel),bumpMapUv:Le&&x(S.bumpMap.channel),normalMapUv:xe&&x(S.normalMap.channel),displacementMapUv:$e&&x(S.displacementMap.channel),emissiveMapUv:Me&&x(S.emissiveMap.channel),metalnessMapUv:Be&&x(S.metalnessMap.channel),roughnessMapUv:bt&&x(S.roughnessMap.channel),anisotropyMapUv:O&&x(S.anisotropyMap.channel),clearcoatMapUv:se&&x(S.clearcoatMap.channel),clearcoatNormalMapUv:ne&&x(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ue&&x(S.clearcoatRoughnessMap.channel),iridescenceMapUv:fe&&x(S.iridescenceMap.channel),iridescenceThicknessMapUv:te&&x(S.iridescenceThicknessMap.channel),sheenColorMapUv:ce&&x(S.sheenColorMap.channel),sheenRoughnessMapUv:Ie&&x(S.sheenRoughnessMap.channel),specularMapUv:Te&&x(S.specularMap.channel),specularColorMapUv:me&&x(S.specularColorMap.channel),specularIntensityMapUv:We&&x(S.specularIntensityMap.channel),transmissionMapUv:N&&x(S.transmissionMap.channel),thicknessMapUv:le&&x(S.thicknessMap.channel),alphaMapUv:ve&&x(S.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(xe||yt),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!j.attributes.uv&&(Ae||ve),fog:!!Z,useFog:S.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ie,skinning:G.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:ee,morphTextureStride:be,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:ke,decodeVideoTexture:Ae&&S.map.isVideoTexture===!0&&Je.getTransfer(S.map.colorSpace)===it,decodeVideoTextureEmissive:Me&&S.emissiveMap.isVideoTexture===!0&&Je.getTransfer(S.emissiveMap.colorSpace)===it,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Hn,flipSided:S.side===qt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Ee&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ee&&S.extensions.multiDraw===!0||_e)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return ut.vertexUv1s=c.has(1),ut.vertexUv2s=c.has(2),ut.vertexUv3s=c.has(3),c.clear(),ut}function d(S){let b=[];if(S.shaderID?b.push(S.shaderID):(b.push(S.customVertexShaderID),b.push(S.customFragmentShaderID)),S.defines!==void 0)for(let R in S.defines)b.push(R),b.push(S.defines[R]);return S.isRawShaderMaterial===!1&&(E(b,S),v(b,S),b.push(i.outputColorSpace)),b.push(S.customProgramCacheKey),b.join()}function E(S,b){S.push(b.precision),S.push(b.outputColorSpace),S.push(b.envMapMode),S.push(b.envMapCubeUVHeight),S.push(b.mapUv),S.push(b.alphaMapUv),S.push(b.lightMapUv),S.push(b.aoMapUv),S.push(b.bumpMapUv),S.push(b.normalMapUv),S.push(b.displacementMapUv),S.push(b.emissiveMapUv),S.push(b.metalnessMapUv),S.push(b.roughnessMapUv),S.push(b.anisotropyMapUv),S.push(b.clearcoatMapUv),S.push(b.clearcoatNormalMapUv),S.push(b.clearcoatRoughnessMapUv),S.push(b.iridescenceMapUv),S.push(b.iridescenceThicknessMapUv),S.push(b.sheenColorMapUv),S.push(b.sheenRoughnessMapUv),S.push(b.specularMapUv),S.push(b.specularColorMapUv),S.push(b.specularIntensityMapUv),S.push(b.transmissionMapUv),S.push(b.thicknessMapUv),S.push(b.combine),S.push(b.fogExp2),S.push(b.sizeAttenuation),S.push(b.morphTargetsCount),S.push(b.morphAttributeCount),S.push(b.numDirLights),S.push(b.numPointLights),S.push(b.numSpotLights),S.push(b.numSpotLightMaps),S.push(b.numHemiLights),S.push(b.numRectAreaLights),S.push(b.numDirLightShadows),S.push(b.numPointLightShadows),S.push(b.numSpotLightShadows),S.push(b.numSpotLightShadowsWithMaps),S.push(b.numLightProbes),S.push(b.shadowMapType),S.push(b.toneMapping),S.push(b.numClippingPlanes),S.push(b.numClipIntersection),S.push(b.depthPacking)}function v(S,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),b.gradientMap&&a.enable(22),S.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),S.push(a.mask)}function y(S){let b=_[S.type],R;if(b){let U=Gn[b];R=$h.clone(U.uniforms)}else R=S.uniforms;return R}function A(S,b){let R;for(let U=0,G=h.length;U<G;U++){let Z=h[U];if(Z.cacheKey===b){R=Z,++R.usedTimes;break}}return R===void 0&&(R=new u_(i,b,S,r),h.push(R)),R}function w(S){if(--S.usedTimes===0){let b=h.indexOf(S);h[b]=h[h.length-1],h.pop(),S.destroy()}}function C(S){l.remove(S)}function L(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:y,acquireProgram:A,releaseProgram:w,releaseShaderCache:C,programs:h,dispose:L}}function p_(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function m_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function yu(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function vu(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u,f,p,_,x,m){let d=i[e];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:_,renderOrder:u.renderOrder,z:x,group:m},i[e]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=_,d.renderOrder=u.renderOrder,d.z=x,d.group=m),e++,d}function a(u,f,p,_,x,m){let d=o(u,f,p,_,x,m);p.transmission>0?n.push(d):p.transparent===!0?s.push(d):t.push(d)}function l(u,f,p,_,x,m){let d=o(u,f,p,_,x,m);p.transmission>0?n.unshift(d):p.transparent===!0?s.unshift(d):t.unshift(d)}function c(u,f){t.length>1&&t.sort(u||m_),n.length>1&&n.sort(f||yu),s.length>1&&s.sort(f||yu)}function h(){for(let u=e,f=i.length;u<f;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function g_(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new vu,i.set(n,[o])):s>=r.length?(o=new vu,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function __(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new ze};break;case"SpotLight":t={position:new D,direction:new D,color:new ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new ze,groundColor:new ze};break;case"RectAreaLight":t={color:new ze,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function x_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new we};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new we};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new we,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var y_=0;function v_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function b_(i){let e=new __,t=x_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);let s=new D,r=new ht,o=new ht;function a(c){let h=0,u=0,f=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,_=0,x=0,m=0,d=0,E=0,v=0,y=0,A=0,w=0,C=0;c.sort(v_);for(let S=0,b=c.length;S<b;S++){let R=c[S],U=R.color,G=R.intensity,Z=R.distance,j=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=U.r*G,u+=U.g*G,f+=U.b*G;else if(R.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(R.sh.coefficients[W],G);C++}else if(R.isDirectionalLight){let W=e.get(R);if(W.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let re=R.shadow,q=t.get(R);q.shadowIntensity=re.intensity,q.shadowBias=re.bias,q.shadowNormalBias=re.normalBias,q.shadowRadius=re.radius,q.shadowMapSize=re.mapSize,n.directionalShadow[p]=q,n.directionalShadowMap[p]=j,n.directionalShadowMatrix[p]=R.shadow.matrix,E++}n.directional[p]=W,p++}else if(R.isSpotLight){let W=e.get(R);W.position.setFromMatrixPosition(R.matrixWorld),W.color.copy(U).multiplyScalar(G),W.distance=Z,W.coneCos=Math.cos(R.angle),W.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),W.decay=R.decay,n.spot[x]=W;let re=R.shadow;if(R.map&&(n.spotLightMap[A]=R.map,A++,re.updateMatrices(R),R.castShadow&&w++),n.spotLightMatrix[x]=re.matrix,R.castShadow){let q=t.get(R);q.shadowIntensity=re.intensity,q.shadowBias=re.bias,q.shadowNormalBias=re.normalBias,q.shadowRadius=re.radius,q.shadowMapSize=re.mapSize,n.spotShadow[x]=q,n.spotShadowMap[x]=j,y++}x++}else if(R.isRectAreaLight){let W=e.get(R);W.color.copy(U).multiplyScalar(G),W.halfWidth.set(R.width*.5,0,0),W.halfHeight.set(0,R.height*.5,0),n.rectArea[m]=W,m++}else if(R.isPointLight){let W=e.get(R);if(W.color.copy(R.color).multiplyScalar(R.intensity),W.distance=R.distance,W.decay=R.decay,R.castShadow){let re=R.shadow,q=t.get(R);q.shadowIntensity=re.intensity,q.shadowBias=re.bias,q.shadowNormalBias=re.normalBias,q.shadowRadius=re.radius,q.shadowMapSize=re.mapSize,q.shadowCameraNear=re.camera.near,q.shadowCameraFar=re.camera.far,n.pointShadow[_]=q,n.pointShadowMap[_]=j,n.pointShadowMatrix[_]=R.shadow.matrix,v++}n.point[_]=W,_++}else if(R.isHemisphereLight){let W=e.get(R);W.skyColor.copy(R.color).multiplyScalar(G),W.groundColor.copy(R.groundColor).multiplyScalar(G),n.hemi[d]=W,d++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=pe.LTC_FLOAT_1,n.rectAreaLTC2=pe.LTC_FLOAT_2):(n.rectAreaLTC1=pe.LTC_HALF_1,n.rectAreaLTC2=pe.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;let L=n.hash;(L.directionalLength!==p||L.pointLength!==_||L.spotLength!==x||L.rectAreaLength!==m||L.hemiLength!==d||L.numDirectionalShadows!==E||L.numPointShadows!==v||L.numSpotShadows!==y||L.numSpotMaps!==A||L.numLightProbes!==C)&&(n.directional.length=p,n.spot.length=x,n.rectArea.length=m,n.point.length=_,n.hemi.length=d,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=y+A-w,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=C,L.directionalLength=p,L.pointLength=_,L.spotLength=x,L.rectAreaLength=m,L.hemiLength=d,L.numDirectionalShadows=E,L.numPointShadows=v,L.numSpotShadows=y,L.numSpotMaps=A,L.numLightProbes=C,n.version=y_++)}function l(c,h){let u=0,f=0,p=0,_=0,x=0,m=h.matrixWorldInverse;for(let d=0,E=c.length;d<E;d++){let v=c[d];if(v.isDirectionalLight){let y=n.directional[u];y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(v.isSpotLight){let y=n.spot[p];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),p++}else if(v.isRectAreaLight){let y=n.rectArea[_];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(v.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),_++}else if(v.isPointLight){let y=n.point[f];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),f++}else if(v.isHemisphereLight){let y=n.hemi[x];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:n}}function bu(i){let e=new b_(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function M_(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new bu(i),e.set(s,[a])):r>=o.length?(a=new bu(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var S_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,E_=`uniform sampler2D shadow_pass;
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
}`;function w_(i,e,t){let n=new ws,s=new we,r=new we,o=new _t,a=new Io({depthPacking:Bh}),l=new Po,c={},h=t.maxTextureSize,u={[Qn]:qt,[qt]:Qn,[Hn]:Hn},f=new An({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new we},radius:{value:4}},vertexShader:S_,fragmentShader:E_}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let _=new xt;_.setAttribute("position",new Zt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Mt(_,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Rl;let d=this.type;this.render=function(w,C,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;let S=i.getRenderTarget(),b=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),U=i.state;U.setBlending(ti),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);let G=d!==zn&&this.type===zn,Z=d===zn&&this.type!==zn;for(let j=0,W=w.length;j<W;j++){let re=w[j],q=re.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",re,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);let F=q.getFrameExtents();if(s.multiply(F),r.copy(q.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/F.x),s.x=r.x*F.x,q.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/F.y),s.y=r.y*F.y,q.mapSize.y=r.y)),q.map===null||G===!0||Z===!0){let ee=this.type!==zn?{minFilter:fn,magFilter:fn}:{};q.map!==null&&q.map.dispose(),q.map=new Fn(s.x,s.y,ee),q.map.texture.name=re.name+".shadowMap",q.camera.updateProjectionMatrix()}i.setRenderTarget(q.map),i.clear();let J=q.getViewportCount();for(let ee=0;ee<J;ee++){let be=q.getViewport(ee);o.set(r.x*be.x,r.y*be.y,r.x*be.z,r.y*be.w),U.viewport(o),q.updateMatrices(re,ee),n=q.getFrustum(),y(C,L,q.camera,re,this.type)}q.isPointLightShadow!==!0&&this.type===zn&&E(q,L),q.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(S,b,R)};function E(w,C){let L=e.update(x);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Fn(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(C,null,L,f,x,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(C,null,L,p,x,null)}function v(w,C,L,S){let b=null,R=L.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(R!==void 0)b=R;else if(b=L.isPointLight===!0?l:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let U=b.uuid,G=C.uuid,Z=c[U];Z===void 0&&(Z={},c[U]=Z);let j=Z[G];j===void 0&&(j=b.clone(),Z[G]=j,C.addEventListener("dispose",A)),b=j}if(b.visible=C.visible,b.wireframe=C.wireframe,S===zn?b.side=C.shadowSide!==null?C.shadowSide:C.side:b.side=C.shadowSide!==null?C.shadowSide:u[C.side],b.alphaMap=C.alphaMap,b.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,b.map=C.map,b.clipShadows=C.clipShadows,b.clippingPlanes=C.clippingPlanes,b.clipIntersection=C.clipIntersection,b.displacementMap=C.displacementMap,b.displacementScale=C.displacementScale,b.displacementBias=C.displacementBias,b.wireframeLinewidth=C.wireframeLinewidth,b.linewidth=C.linewidth,L.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let U=i.properties.get(b);U.light=L}return b}function y(w,C,L,S,b){if(w.visible===!1)return;if(w.layers.test(C.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&b===zn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,w.matrixWorld);let G=e.update(w),Z=w.material;if(Array.isArray(Z)){let j=G.groups;for(let W=0,re=j.length;W<re;W++){let q=j[W],F=Z[q.materialIndex];if(F&&F.visible){let J=v(w,F,S,b);w.onBeforeShadow(i,w,C,L,G,J,q),i.renderBufferDirect(L,null,G,J,w,q),w.onAfterShadow(i,w,C,L,G,J,q)}}}else if(Z.visible){let j=v(w,Z,S,b);w.onBeforeShadow(i,w,C,L,G,j,null),i.renderBufferDirect(L,null,G,j,w,null),w.onAfterShadow(i,w,C,L,G,j,null)}}let U=w.children;for(let G=0,Z=U.length;G<Z;G++)y(U[G],C,L,S,b)}function A(w){w.target.removeEventListener("dispose",A);for(let L in c){let S=c[L],b=w.target.uuid;b in S&&(S[b].dispose(),delete S[b])}}}var T_={[Go]:Wo,[Xo]:Zo,[qo]:jo,[Ni]:Yo,[Wo]:Go,[Zo]:Xo,[jo]:qo,[Yo]:Ni};function A_(i,e){function t(){let N=!1,le=new _t,he=null,ve=new _t(0,0,0,0);return{setMask:function(oe){he!==oe&&!N&&(i.colorMask(oe,oe,oe,oe),he=oe)},setLocked:function(oe){N=oe},setClear:function(oe,Q,Ee,ke,ut){ut===!0&&(oe*=ke,Q*=ke,Ee*=ke),le.set(oe,Q,Ee,ke),ve.equals(le)===!1&&(i.clearColor(oe,Q,Ee,ke),ve.copy(le))},reset:function(){N=!1,he=null,ve.set(-1,0,0,0)}}}function n(){let N=!1,le=!1,he=null,ve=null,oe=null;return{setReversed:function(Q){if(le!==Q){let Ee=e.get("EXT_clip_control");Q?Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.ZERO_TO_ONE_EXT):Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.NEGATIVE_ONE_TO_ONE_EXT),le=Q;let ke=oe;oe=null,this.setClear(ke)}},getReversed:function(){return le},setTest:function(Q){Q?V(i.DEPTH_TEST):ie(i.DEPTH_TEST)},setMask:function(Q){he!==Q&&!N&&(i.depthMask(Q),he=Q)},setFunc:function(Q){if(le&&(Q=T_[Q]),ve!==Q){switch(Q){case Go:i.depthFunc(i.NEVER);break;case Wo:i.depthFunc(i.ALWAYS);break;case Xo:i.depthFunc(i.LESS);break;case Ni:i.depthFunc(i.LEQUAL);break;case qo:i.depthFunc(i.EQUAL);break;case Yo:i.depthFunc(i.GEQUAL);break;case Zo:i.depthFunc(i.GREATER);break;case jo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ve=Q}},setLocked:function(Q){N=Q},setClear:function(Q){oe!==Q&&(le&&(Q=1-Q),i.clearDepth(Q),oe=Q)},reset:function(){N=!1,he=null,ve=null,oe=null,le=!1}}}function s(){let N=!1,le=null,he=null,ve=null,oe=null,Q=null,Ee=null,ke=null,ut=null;return{setTest:function(et){N||(et?V(i.STENCIL_TEST):ie(i.STENCIL_TEST))},setMask:function(et){le!==et&&!N&&(i.stencilMask(et),le=et)},setFunc:function(et,Xn,Pn){(he!==et||ve!==Xn||oe!==Pn)&&(i.stencilFunc(et,Xn,Pn),he=et,ve=Xn,oe=Pn)},setOp:function(et,Xn,Pn){(Q!==et||Ee!==Xn||ke!==Pn)&&(i.stencilOp(et,Xn,Pn),Q=et,Ee=Xn,ke=Pn)},setLocked:function(et){N=et},setClear:function(et){ut!==et&&(i.clearStencil(et),ut=et)},reset:function(){N=!1,le=null,he=null,ve=null,oe=null,Q=null,Ee=null,ke=null,ut=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},f=new WeakMap,p=[],_=null,x=!1,m=null,d=null,E=null,v=null,y=null,A=null,w=null,C=new ze(0,0,0),L=0,S=!1,b=null,R=null,U=null,G=null,Z=null,j=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),W=!1,re=0,q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(re=parseFloat(/^WebGL (\d)/.exec(q)[1]),W=re>=1):q.indexOf("OpenGL ES")!==-1&&(re=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),W=re>=2);let F=null,J={},ee=i.getParameter(i.SCISSOR_BOX),be=i.getParameter(i.VIEWPORT),Oe=new _t().fromArray(ee),Pe=new _t().fromArray(be);function Ce(N,le,he,ve){let oe=new Uint8Array(4),Q=i.createTexture();i.bindTexture(N,Q),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ee=0;Ee<he;Ee++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(le,0,i.RGBA,1,1,ve,0,i.RGBA,i.UNSIGNED_BYTE,oe):i.texImage2D(le+Ee,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,oe);return Q}let K={};K[i.TEXTURE_2D]=Ce(i.TEXTURE_2D,i.TEXTURE_2D,1),K[i.TEXTURE_CUBE_MAP]=Ce(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[i.TEXTURE_2D_ARRAY]=Ce(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),K[i.TEXTURE_3D]=Ce(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),V(i.DEPTH_TEST),o.setFunc(Ni),Le(!1),xe(Cl),V(i.CULL_FACE),rt(ti);function V(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function ie(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function de(N,le){return u[N]!==le?(i.bindFramebuffer(N,le),u[N]=le,N===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=le),N===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=le),!0):!1}function _e(N,le){let he=p,ve=!1;if(N){he=f.get(le),he===void 0&&(he=[],f.set(le,he));let oe=N.textures;if(he.length!==oe.length||he[0]!==i.COLOR_ATTACHMENT0){for(let Q=0,Ee=oe.length;Q<Ee;Q++)he[Q]=i.COLOR_ATTACHMENT0+Q;he.length=oe.length,ve=!0}}else he[0]!==i.BACK&&(he[0]=i.BACK,ve=!0);ve&&i.drawBuffers(he)}function Ae(N){return _!==N?(i.useProgram(N),_=N,!0):!1}let pt={[pi]:i.FUNC_ADD,[hh]:i.FUNC_SUBTRACT,[uh]:i.FUNC_REVERSE_SUBTRACT};pt[dh]=i.MIN,pt[fh]=i.MAX;let I={[ph]:i.ZERO,[mh]:i.ONE,[gh]:i.SRC_COLOR,[go]:i.SRC_ALPHA,[Mh]:i.SRC_ALPHA_SATURATE,[vh]:i.DST_COLOR,[xh]:i.DST_ALPHA,[_h]:i.ONE_MINUS_SRC_COLOR,[_o]:i.ONE_MINUS_SRC_ALPHA,[bh]:i.ONE_MINUS_DST_COLOR,[yh]:i.ONE_MINUS_DST_ALPHA,[Sh]:i.CONSTANT_COLOR,[Eh]:i.ONE_MINUS_CONSTANT_COLOR,[wh]:i.CONSTANT_ALPHA,[Th]:i.ONE_MINUS_CONSTANT_ALPHA};function rt(N,le,he,ve,oe,Q,Ee,ke,ut,et){if(N===ti){x===!0&&(ie(i.BLEND),x=!1);return}if(x===!1&&(V(i.BLEND),x=!0),N!==ch){if(N!==m||et!==S){if((d!==pi||y!==pi)&&(i.blendEquation(i.FUNC_ADD),d=pi,y=pi),et)switch(N){case Li:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Il:i.blendFunc(i.ONE,i.ONE);break;case Pl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Dl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Li:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Il:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Pl:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Dl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}E=null,v=null,A=null,w=null,C.set(0,0,0),L=0,m=N,S=et}return}oe=oe||le,Q=Q||he,Ee=Ee||ve,(le!==d||oe!==y)&&(i.blendEquationSeparate(pt[le],pt[oe]),d=le,y=oe),(he!==E||ve!==v||Q!==A||Ee!==w)&&(i.blendFuncSeparate(I[he],I[ve],I[Q],I[Ee]),E=he,v=ve,A=Q,w=Ee),(ke.equals(C)===!1||ut!==L)&&(i.blendColor(ke.r,ke.g,ke.b,ut),C.copy(ke),L=ut),m=N,S=!1}function Fe(N,le){N.side===Hn?ie(i.CULL_FACE):V(i.CULL_FACE);let he=N.side===qt;le&&(he=!he),Le(he),N.blending===Li&&N.transparent===!1?rt(ti):rt(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);let ve=N.stencilWrite;a.setTest(ve),ve&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Me(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?V(i.SAMPLE_ALPHA_TO_COVERAGE):ie(i.SAMPLE_ALPHA_TO_COVERAGE)}function Le(N){b!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),b=N)}function xe(N){N!==ah?(V(i.CULL_FACE),N!==R&&(N===Cl?i.cullFace(i.BACK):N===lh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ie(i.CULL_FACE),R=N}function $e(N){N!==U&&(W&&i.lineWidth(N),U=N)}function Me(N,le,he){N?(V(i.POLYGON_OFFSET_FILL),(G!==le||Z!==he)&&(i.polygonOffset(le,he),G=le,Z=he)):ie(i.POLYGON_OFFSET_FILL)}function Be(N){N?V(i.SCISSOR_TEST):ie(i.SCISSOR_TEST)}function bt(N){N===void 0&&(N=i.TEXTURE0+j-1),F!==N&&(i.activeTexture(N),F=N)}function yt(N,le,he){he===void 0&&(F===null?he=i.TEXTURE0+j-1:he=F);let ve=J[he];ve===void 0&&(ve={type:void 0,texture:void 0},J[he]=ve),(ve.type!==N||ve.texture!==le)&&(F!==he&&(i.activeTexture(he),F=he),i.bindTexture(N,le||K[N]),ve.type=N,ve.texture=le)}function T(){let N=J[F];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function g(){try{i.compressedTexImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function P(){try{i.compressedTexImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function k(){try{i.texSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function H(){try{i.texSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function O(){try{i.compressedTexSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function se(){try{i.compressedTexSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ne(){try{i.texStorage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ue(){try{i.texStorage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function fe(){try{i.texImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function te(){try{i.texImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ce(N){Oe.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),Oe.copy(N))}function Ie(N){Pe.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),Pe.copy(N))}function Te(N,le){let he=c.get(le);he===void 0&&(he=new WeakMap,c.set(le,he));let ve=he.get(N);ve===void 0&&(ve=i.getUniformBlockIndex(le,N.name),he.set(N,ve))}function me(N,le){let ve=c.get(le).get(N);l.get(le)!==ve&&(i.uniformBlockBinding(le,ve,N.__bindingPointIndex),l.set(le,ve))}function We(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},F=null,J={},u={},f=new WeakMap,p=[],_=null,x=!1,m=null,d=null,E=null,v=null,y=null,A=null,w=null,C=new ze(0,0,0),L=0,S=!1,b=null,R=null,U=null,G=null,Z=null,Oe.set(0,0,i.canvas.width,i.canvas.height),Pe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:V,disable:ie,bindFramebuffer:de,drawBuffers:_e,useProgram:Ae,setBlending:rt,setMaterial:Fe,setFlipSided:Le,setCullFace:xe,setLineWidth:$e,setPolygonOffset:Me,setScissorTest:Be,activeTexture:bt,bindTexture:yt,unbindTexture:T,compressedTexImage2D:g,compressedTexImage3D:P,texImage2D:fe,texImage3D:te,updateUBOMapping:Te,uniformBlockBinding:me,texStorage2D:ne,texStorage3D:ue,texSubImage2D:k,texSubImage3D:H,compressedTexSubImage2D:O,compressedTexSubImage3D:se,scissor:ce,viewport:Ie,reset:We}}function C_(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new we,h=new WeakMap,u,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(T,g){return p?new OffscreenCanvas(T,g):sr("canvas")}function x(T,g,P){let k=1,H=yt(T);if((H.width>P||H.height>P)&&(k=P/Math.max(H.width,H.height)),k<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){let O=Math.floor(k*H.width),se=Math.floor(k*H.height);u===void 0&&(u=_(O,se));let ne=g?_(O,se):u;return ne.width=O,ne.height=se,ne.getContext("2d").drawImage(T,0,0,O,se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+H.width+"x"+H.height+") to ("+O+"x"+se+")."),ne}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+H.width+"x"+H.height+")."),T;return T}function m(T){return T.generateMipmaps}function d(T){i.generateMipmap(T)}function E(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(T,g,P,k,H=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let O=g;if(g===i.RED&&(P===i.FLOAT&&(O=i.R32F),P===i.HALF_FLOAT&&(O=i.R16F),P===i.UNSIGNED_BYTE&&(O=i.R8)),g===i.RED_INTEGER&&(P===i.UNSIGNED_BYTE&&(O=i.R8UI),P===i.UNSIGNED_SHORT&&(O=i.R16UI),P===i.UNSIGNED_INT&&(O=i.R32UI),P===i.BYTE&&(O=i.R8I),P===i.SHORT&&(O=i.R16I),P===i.INT&&(O=i.R32I)),g===i.RG&&(P===i.FLOAT&&(O=i.RG32F),P===i.HALF_FLOAT&&(O=i.RG16F),P===i.UNSIGNED_BYTE&&(O=i.RG8)),g===i.RG_INTEGER&&(P===i.UNSIGNED_BYTE&&(O=i.RG8UI),P===i.UNSIGNED_SHORT&&(O=i.RG16UI),P===i.UNSIGNED_INT&&(O=i.RG32UI),P===i.BYTE&&(O=i.RG8I),P===i.SHORT&&(O=i.RG16I),P===i.INT&&(O=i.RG32I)),g===i.RGB_INTEGER&&(P===i.UNSIGNED_BYTE&&(O=i.RGB8UI),P===i.UNSIGNED_SHORT&&(O=i.RGB16UI),P===i.UNSIGNED_INT&&(O=i.RGB32UI),P===i.BYTE&&(O=i.RGB8I),P===i.SHORT&&(O=i.RGB16I),P===i.INT&&(O=i.RGB32I)),g===i.RGBA_INTEGER&&(P===i.UNSIGNED_BYTE&&(O=i.RGBA8UI),P===i.UNSIGNED_SHORT&&(O=i.RGBA16UI),P===i.UNSIGNED_INT&&(O=i.RGBA32UI),P===i.BYTE&&(O=i.RGBA8I),P===i.SHORT&&(O=i.RGBA16I),P===i.INT&&(O=i.RGBA32I)),g===i.RGB&&(P===i.UNSIGNED_INT_5_9_9_9_REV&&(O=i.RGB9_E5),P===i.UNSIGNED_INT_10F_11F_11F_REV&&(O=i.R11F_G11F_B10F)),g===i.RGBA){let se=H?nr:Je.getTransfer(k);P===i.FLOAT&&(O=i.RGBA32F),P===i.HALF_FLOAT&&(O=i.RGBA16F),P===i.UNSIGNED_BYTE&&(O=se===it?i.SRGB8_ALPHA8:i.RGBA8),P===i.UNSIGNED_SHORT_4_4_4_4&&(O=i.RGBA4),P===i.UNSIGNED_SHORT_5_5_5_1&&(O=i.RGB5_A1)}return(O===i.R16F||O===i.R32F||O===i.RG16F||O===i.RG32F||O===i.RGBA16F||O===i.RGBA32F)&&e.get("EXT_color_buffer_float"),O}function y(T,g){let P;return T?g===null||g===Mi||g===Ps?P=i.DEPTH24_STENCIL8:g===Vn?P=i.DEPTH32F_STENCIL8:g===Rs&&(P=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===Mi||g===Ps?P=i.DEPTH_COMPONENT24:g===Vn?P=i.DEPTH_COMPONENT32F:g===Rs&&(P=i.DEPTH_COMPONENT16),P}function A(T,g){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==fn&&T.minFilter!==wn?Math.log2(Math.max(g.width,g.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?g.mipmaps.length:1}function w(T){let g=T.target;g.removeEventListener("dispose",w),L(g),g.isVideoTexture&&h.delete(g)}function C(T){let g=T.target;g.removeEventListener("dispose",C),b(g)}function L(T){let g=n.get(T);if(g.__webglInit===void 0)return;let P=T.source,k=f.get(P);if(k){let H=k[g.__cacheKey];H.usedTimes--,H.usedTimes===0&&S(T),Object.keys(k).length===0&&f.delete(P)}n.remove(T)}function S(T){let g=n.get(T);i.deleteTexture(g.__webglTexture);let P=T.source,k=f.get(P);delete k[g.__cacheKey],o.memory.textures--}function b(T){let g=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let k=0;k<6;k++){if(Array.isArray(g.__webglFramebuffer[k]))for(let H=0;H<g.__webglFramebuffer[k].length;H++)i.deleteFramebuffer(g.__webglFramebuffer[k][H]);else i.deleteFramebuffer(g.__webglFramebuffer[k]);g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer[k])}else{if(Array.isArray(g.__webglFramebuffer))for(let k=0;k<g.__webglFramebuffer.length;k++)i.deleteFramebuffer(g.__webglFramebuffer[k]);else i.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&i.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let k=0;k<g.__webglColorRenderbuffer.length;k++)g.__webglColorRenderbuffer[k]&&i.deleteRenderbuffer(g.__webglColorRenderbuffer[k]);g.__webglDepthRenderbuffer&&i.deleteRenderbuffer(g.__webglDepthRenderbuffer)}let P=T.textures;for(let k=0,H=P.length;k<H;k++){let O=n.get(P[k]);O.__webglTexture&&(i.deleteTexture(O.__webglTexture),o.memory.textures--),n.remove(P[k])}n.remove(T)}let R=0;function U(){R=0}function G(){let T=R;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),R+=1,T}function Z(T){let g=[];return g.push(T.wrapS),g.push(T.wrapT),g.push(T.wrapR||0),g.push(T.magFilter),g.push(T.minFilter),g.push(T.anisotropy),g.push(T.internalFormat),g.push(T.format),g.push(T.type),g.push(T.generateMipmaps),g.push(T.premultiplyAlpha),g.push(T.flipY),g.push(T.unpackAlignment),g.push(T.colorSpace),g.join()}function j(T,g){let P=n.get(T);if(T.isVideoTexture&&Be(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&P.__version!==T.version){let k=T.image;if(k===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(k.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(P,T,g);return}}else T.isExternalTexture&&(P.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,P.__webglTexture,i.TEXTURE0+g)}function W(T,g){let P=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&P.__version!==T.version){K(P,T,g);return}t.bindTexture(i.TEXTURE_2D_ARRAY,P.__webglTexture,i.TEXTURE0+g)}function re(T,g){let P=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&P.__version!==T.version){K(P,T,g);return}t.bindTexture(i.TEXTURE_3D,P.__webglTexture,i.TEXTURE0+g)}function q(T,g){let P=n.get(T);if(T.version>0&&P.__version!==T.version){V(P,T,g);return}t.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+g)}let F={[xo]:i.REPEAT,[fi]:i.CLAMP_TO_EDGE,[yo]:i.MIRRORED_REPEAT},J={[fn]:i.NEAREST,[Uh]:i.NEAREST_MIPMAP_NEAREST,[Tr]:i.NEAREST_MIPMAP_LINEAR,[wn]:i.LINEAR,[Ko]:i.LINEAR_MIPMAP_NEAREST,[bi]:i.LINEAR_MIPMAP_LINEAR},ee={[zh]:i.NEVER,[qh]:i.ALWAYS,[Hh]:i.LESS,[Wl]:i.LEQUAL,[Vh]:i.EQUAL,[Xh]:i.GEQUAL,[Gh]:i.GREATER,[Wh]:i.NOTEQUAL};function be(T,g){if(g.type===Vn&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===wn||g.magFilter===Ko||g.magFilter===Tr||g.magFilter===bi||g.minFilter===wn||g.minFilter===Ko||g.minFilter===Tr||g.minFilter===bi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,F[g.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,F[g.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,F[g.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,J[g.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,J[g.minFilter]),g.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,ee[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===fn||g.minFilter!==Tr&&g.minFilter!==bi||g.type===Vn&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||n.get(g).__currentAnisotropy){let P=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,P.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,s.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy}}}function Oe(T,g){let P=!1;T.__webglInit===void 0&&(T.__webglInit=!0,g.addEventListener("dispose",w));let k=g.source,H=f.get(k);H===void 0&&(H={},f.set(k,H));let O=Z(g);if(O!==T.__cacheKey){H[O]===void 0&&(H[O]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,P=!0),H[O].usedTimes++;let se=H[T.__cacheKey];se!==void 0&&(H[T.__cacheKey].usedTimes--,se.usedTimes===0&&S(g)),T.__cacheKey=O,T.__webglTexture=H[O].texture}return P}function Pe(T,g,P){return Math.floor(Math.floor(T/P)/g)}function Ce(T,g,P,k){let O=T.updateRanges;if(O.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,g.width,g.height,P,k,g.data);else{O.sort((te,ce)=>te.start-ce.start);let se=0;for(let te=1;te<O.length;te++){let ce=O[se],Ie=O[te],Te=ce.start+ce.count,me=Pe(Ie.start,g.width,4),We=Pe(ce.start,g.width,4);Ie.start<=Te+1&&me===We&&Pe(Ie.start+Ie.count-1,g.width,4)===me?ce.count=Math.max(ce.count,Ie.start+Ie.count-ce.start):(++se,O[se]=Ie)}O.length=se+1;let ne=i.getParameter(i.UNPACK_ROW_LENGTH),ue=i.getParameter(i.UNPACK_SKIP_PIXELS),fe=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,g.width);for(let te=0,ce=O.length;te<ce;te++){let Ie=O[te],Te=Math.floor(Ie.start/4),me=Math.ceil(Ie.count/4),We=Te%g.width,N=Math.floor(Te/g.width),le=me,he=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,We),i.pixelStorei(i.UNPACK_SKIP_ROWS,N),t.texSubImage2D(i.TEXTURE_2D,0,We,N,le,he,P,k,g.data)}T.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ne),i.pixelStorei(i.UNPACK_SKIP_PIXELS,ue),i.pixelStorei(i.UNPACK_SKIP_ROWS,fe)}}function K(T,g,P){let k=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(k=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(k=i.TEXTURE_3D);let H=Oe(T,g),O=g.source;t.bindTexture(k,T.__webglTexture,i.TEXTURE0+P);let se=n.get(O);if(O.version!==se.__version||H===!0){t.activeTexture(i.TEXTURE0+P);let ne=Je.getPrimaries(Je.workingColorSpace),ue=g.colorSpace===ii?null:Je.getPrimaries(g.colorSpace),fe=g.colorSpace===ii||ne===ue?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,fe);let te=x(g.image,!1,s.maxTextureSize);te=bt(g,te);let ce=r.convert(g.format,g.colorSpace),Ie=r.convert(g.type),Te=v(g.internalFormat,ce,Ie,g.colorSpace,g.isVideoTexture);be(k,g);let me,We=g.mipmaps,N=g.isVideoTexture!==!0,le=se.__version===void 0||H===!0,he=O.dataReady,ve=A(g,te);if(g.isDepthTexture)Te=y(g.format===Ds,g.type),le&&(N?t.texStorage2D(i.TEXTURE_2D,1,Te,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,Te,te.width,te.height,0,ce,Ie,null));else if(g.isDataTexture)if(We.length>0){N&&le&&t.texStorage2D(i.TEXTURE_2D,ve,Te,We[0].width,We[0].height);for(let oe=0,Q=We.length;oe<Q;oe++)me=We[oe],N?he&&t.texSubImage2D(i.TEXTURE_2D,oe,0,0,me.width,me.height,ce,Ie,me.data):t.texImage2D(i.TEXTURE_2D,oe,Te,me.width,me.height,0,ce,Ie,me.data);g.generateMipmaps=!1}else N?(le&&t.texStorage2D(i.TEXTURE_2D,ve,Te,te.width,te.height),he&&Ce(g,te,ce,Ie)):t.texImage2D(i.TEXTURE_2D,0,Te,te.width,te.height,0,ce,Ie,te.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){N&&le&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ve,Te,We[0].width,We[0].height,te.depth);for(let oe=0,Q=We.length;oe<Q;oe++)if(me=We[oe],g.format!==gn)if(ce!==null)if(N){if(he)if(g.layerUpdates.size>0){let Ee=Kl(me.width,me.height,g.format,g.type);for(let ke of g.layerUpdates){let ut=me.data.subarray(ke*Ee/me.data.BYTES_PER_ELEMENT,(ke+1)*Ee/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,oe,0,0,ke,me.width,me.height,1,ce,ut)}g.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,oe,0,0,0,me.width,me.height,te.depth,ce,me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,oe,Te,me.width,me.height,te.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else N?he&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,oe,0,0,0,me.width,me.height,te.depth,ce,Ie,me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,oe,Te,me.width,me.height,te.depth,0,ce,Ie,me.data)}else{N&&le&&t.texStorage2D(i.TEXTURE_2D,ve,Te,We[0].width,We[0].height);for(let oe=0,Q=We.length;oe<Q;oe++)me=We[oe],g.format!==gn?ce!==null?N?he&&t.compressedTexSubImage2D(i.TEXTURE_2D,oe,0,0,me.width,me.height,ce,me.data):t.compressedTexImage2D(i.TEXTURE_2D,oe,Te,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):N?he&&t.texSubImage2D(i.TEXTURE_2D,oe,0,0,me.width,me.height,ce,Ie,me.data):t.texImage2D(i.TEXTURE_2D,oe,Te,me.width,me.height,0,ce,Ie,me.data)}else if(g.isDataArrayTexture)if(N){if(le&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ve,Te,te.width,te.height,te.depth),he)if(g.layerUpdates.size>0){let oe=Kl(te.width,te.height,g.format,g.type);for(let Q of g.layerUpdates){let Ee=te.data.subarray(Q*oe/te.data.BYTES_PER_ELEMENT,(Q+1)*oe/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Q,te.width,te.height,1,ce,Ie,Ee)}g.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,ce,Ie,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Te,te.width,te.height,te.depth,0,ce,Ie,te.data);else if(g.isData3DTexture)N?(le&&t.texStorage3D(i.TEXTURE_3D,ve,Te,te.width,te.height,te.depth),he&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,ce,Ie,te.data)):t.texImage3D(i.TEXTURE_3D,0,Te,te.width,te.height,te.depth,0,ce,Ie,te.data);else if(g.isFramebufferTexture){if(le)if(N)t.texStorage2D(i.TEXTURE_2D,ve,Te,te.width,te.height);else{let oe=te.width,Q=te.height;for(let Ee=0;Ee<ve;Ee++)t.texImage2D(i.TEXTURE_2D,Ee,Te,oe,Q,0,ce,Ie,null),oe>>=1,Q>>=1}}else if(We.length>0){if(N&&le){let oe=yt(We[0]);t.texStorage2D(i.TEXTURE_2D,ve,Te,oe.width,oe.height)}for(let oe=0,Q=We.length;oe<Q;oe++)me=We[oe],N?he&&t.texSubImage2D(i.TEXTURE_2D,oe,0,0,ce,Ie,me):t.texImage2D(i.TEXTURE_2D,oe,Te,ce,Ie,me);g.generateMipmaps=!1}else if(N){if(le){let oe=yt(te);t.texStorage2D(i.TEXTURE_2D,ve,Te,oe.width,oe.height)}he&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ce,Ie,te)}else t.texImage2D(i.TEXTURE_2D,0,Te,ce,Ie,te);m(g)&&d(k),se.__version=O.version,g.onUpdate&&g.onUpdate(g)}T.__version=g.version}function V(T,g,P){if(g.image.length!==6)return;let k=Oe(T,g),H=g.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+P);let O=n.get(H);if(H.version!==O.__version||k===!0){t.activeTexture(i.TEXTURE0+P);let se=Je.getPrimaries(Je.workingColorSpace),ne=g.colorSpace===ii?null:Je.getPrimaries(g.colorSpace),ue=g.colorSpace===ii||se===ne?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ue);let fe=g.isCompressedTexture||g.image[0].isCompressedTexture,te=g.image[0]&&g.image[0].isDataTexture,ce=[];for(let Q=0;Q<6;Q++)!fe&&!te?ce[Q]=x(g.image[Q],!0,s.maxCubemapSize):ce[Q]=te?g.image[Q].image:g.image[Q],ce[Q]=bt(g,ce[Q]);let Ie=ce[0],Te=r.convert(g.format,g.colorSpace),me=r.convert(g.type),We=v(g.internalFormat,Te,me,g.colorSpace),N=g.isVideoTexture!==!0,le=O.__version===void 0||k===!0,he=H.dataReady,ve=A(g,Ie);be(i.TEXTURE_CUBE_MAP,g);let oe;if(fe){N&&le&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ve,We,Ie.width,Ie.height);for(let Q=0;Q<6;Q++){oe=ce[Q].mipmaps;for(let Ee=0;Ee<oe.length;Ee++){let ke=oe[Ee];g.format!==gn?Te!==null?N?he&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee,0,0,ke.width,ke.height,Te,ke.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee,We,ke.width,ke.height,0,ke.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee,0,0,ke.width,ke.height,Te,me,ke.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee,We,ke.width,ke.height,0,Te,me,ke.data)}}}else{if(oe=g.mipmaps,N&&le){oe.length>0&&ve++;let Q=yt(ce[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ve,We,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(te){N?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,ce[Q].width,ce[Q].height,Te,me,ce[Q].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,We,ce[Q].width,ce[Q].height,0,Te,me,ce[Q].data);for(let Ee=0;Ee<oe.length;Ee++){let ut=oe[Ee].image[Q].image;N?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee+1,0,0,ut.width,ut.height,Te,me,ut.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee+1,We,ut.width,ut.height,0,Te,me,ut.data)}}else{N?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Te,me,ce[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,We,Te,me,ce[Q]);for(let Ee=0;Ee<oe.length;Ee++){let ke=oe[Ee];N?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee+1,0,0,Te,me,ke.image[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee+1,We,Te,me,ke.image[Q])}}}m(g)&&d(i.TEXTURE_CUBE_MAP),O.__version=H.version,g.onUpdate&&g.onUpdate(g)}T.__version=g.version}function ie(T,g,P,k,H,O){let se=r.convert(P.format,P.colorSpace),ne=r.convert(P.type),ue=v(P.internalFormat,se,ne,P.colorSpace),fe=n.get(g),te=n.get(P);if(te.__renderTarget=g,!fe.__hasExternalTextures){let ce=Math.max(1,g.width>>O),Ie=Math.max(1,g.height>>O);H===i.TEXTURE_3D||H===i.TEXTURE_2D_ARRAY?t.texImage3D(H,O,ue,ce,Ie,g.depth,0,se,ne,null):t.texImage2D(H,O,ue,ce,Ie,0,se,ne,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),Me(g)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,k,H,te.__webglTexture,0,$e(g)):(H===i.TEXTURE_2D||H>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&H<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,k,H,te.__webglTexture,O),t.bindFramebuffer(i.FRAMEBUFFER,null)}function de(T,g,P){if(i.bindRenderbuffer(i.RENDERBUFFER,T),g.depthBuffer){let k=g.depthTexture,H=k&&k.isDepthTexture?k.type:null,O=y(g.stencilBuffer,H),se=g.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=$e(g);Me(g)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ne,O,g.width,g.height):P?i.renderbufferStorageMultisample(i.RENDERBUFFER,ne,O,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,O,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,se,i.RENDERBUFFER,T)}else{let k=g.textures;for(let H=0;H<k.length;H++){let O=k[H],se=r.convert(O.format,O.colorSpace),ne=r.convert(O.type),ue=v(O.internalFormat,se,ne,O.colorSpace),fe=$e(g);P&&Me(g)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,fe,ue,g.width,g.height):Me(g)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,fe,ue,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,ue,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function _e(T,g){if(g&&g.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let k=n.get(g.depthTexture);k.__renderTarget=g,(!k.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),j(g.depthTexture,0);let H=k.__webglTexture,O=$e(g);if(g.depthTexture.format===xs)Me(g)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,H,0,O):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,H,0);else if(g.depthTexture.format===Ds)Me(g)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,H,0,O):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,H,0);else throw new Error("Unknown depthTexture format")}function Ae(T){let g=n.get(T),P=T.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==T.depthTexture){let k=T.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),k){let H=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,k.removeEventListener("dispose",H)};k.addEventListener("dispose",H),g.__depthDisposeCallback=H}g.__boundDepthTexture=k}if(T.depthTexture&&!g.__autoAllocateDepthBuffer){if(P)throw new Error("target.depthTexture not supported in Cube render targets");let k=T.texture.mipmaps;k&&k.length>0?_e(g.__webglFramebuffer[0],T):_e(g.__webglFramebuffer,T)}else if(P){g.__webglDepthbuffer=[];for(let k=0;k<6;k++)if(t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[k]),g.__webglDepthbuffer[k]===void 0)g.__webglDepthbuffer[k]=i.createRenderbuffer(),de(g.__webglDepthbuffer[k],T,!1);else{let H=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,O=g.__webglDepthbuffer[k];i.bindRenderbuffer(i.RENDERBUFFER,O),i.framebufferRenderbuffer(i.FRAMEBUFFER,H,i.RENDERBUFFER,O)}}else{let k=T.texture.mipmaps;if(k&&k.length>0?t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=i.createRenderbuffer(),de(g.__webglDepthbuffer,T,!1);else{let H=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,O=g.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,O),i.framebufferRenderbuffer(i.FRAMEBUFFER,H,i.RENDERBUFFER,O)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function pt(T,g,P){let k=n.get(T);g!==void 0&&ie(k.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),P!==void 0&&Ae(T)}function I(T){let g=T.texture,P=n.get(T),k=n.get(g);T.addEventListener("dispose",C);let H=T.textures,O=T.isWebGLCubeRenderTarget===!0,se=H.length>1;if(se||(k.__webglTexture===void 0&&(k.__webglTexture=i.createTexture()),k.__version=g.version,o.memory.textures++),O){P.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(g.mipmaps&&g.mipmaps.length>0){P.__webglFramebuffer[ne]=[];for(let ue=0;ue<g.mipmaps.length;ue++)P.__webglFramebuffer[ne][ue]=i.createFramebuffer()}else P.__webglFramebuffer[ne]=i.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){P.__webglFramebuffer=[];for(let ne=0;ne<g.mipmaps.length;ne++)P.__webglFramebuffer[ne]=i.createFramebuffer()}else P.__webglFramebuffer=i.createFramebuffer();if(se)for(let ne=0,ue=H.length;ne<ue;ne++){let fe=n.get(H[ne]);fe.__webglTexture===void 0&&(fe.__webglTexture=i.createTexture(),o.memory.textures++)}if(T.samples>0&&Me(T)===!1){P.__webglMultisampledFramebuffer=i.createFramebuffer(),P.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,P.__webglMultisampledFramebuffer);for(let ne=0;ne<H.length;ne++){let ue=H[ne];P.__webglColorRenderbuffer[ne]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,P.__webglColorRenderbuffer[ne]);let fe=r.convert(ue.format,ue.colorSpace),te=r.convert(ue.type),ce=v(ue.internalFormat,fe,te,ue.colorSpace,T.isXRRenderTarget===!0),Ie=$e(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ie,ce,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ne,i.RENDERBUFFER,P.__webglColorRenderbuffer[ne])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(P.__webglDepthRenderbuffer=i.createRenderbuffer(),de(P.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(O){t.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture),be(i.TEXTURE_CUBE_MAP,g);for(let ne=0;ne<6;ne++)if(g.mipmaps&&g.mipmaps.length>0)for(let ue=0;ue<g.mipmaps.length;ue++)ie(P.__webglFramebuffer[ne][ue],T,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ue);else ie(P.__webglFramebuffer[ne],T,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);m(g)&&d(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(se){for(let ne=0,ue=H.length;ne<ue;ne++){let fe=H[ne],te=n.get(fe),ce=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ce=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ce,te.__webglTexture),be(ce,fe),ie(P.__webglFramebuffer,T,fe,i.COLOR_ATTACHMENT0+ne,ce,0),m(fe)&&d(ce)}t.unbindTexture()}else{let ne=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ne=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ne,k.__webglTexture),be(ne,g),g.mipmaps&&g.mipmaps.length>0)for(let ue=0;ue<g.mipmaps.length;ue++)ie(P.__webglFramebuffer[ue],T,g,i.COLOR_ATTACHMENT0,ne,ue);else ie(P.__webglFramebuffer,T,g,i.COLOR_ATTACHMENT0,ne,0);m(g)&&d(ne),t.unbindTexture()}T.depthBuffer&&Ae(T)}function rt(T){let g=T.textures;for(let P=0,k=g.length;P<k;P++){let H=g[P];if(m(H)){let O=E(T),se=n.get(H).__webglTexture;t.bindTexture(O,se),d(O),t.unbindTexture()}}}let Fe=[],Le=[];function xe(T){if(T.samples>0){if(Me(T)===!1){let g=T.textures,P=T.width,k=T.height,H=i.COLOR_BUFFER_BIT,O=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=n.get(T),ne=g.length>1;if(ne)for(let fe=0;fe<g.length;fe++)t.bindFramebuffer(i.FRAMEBUFFER,se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,se.__webglMultisampledFramebuffer);let ue=T.texture.mipmaps;ue&&ue.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglFramebuffer);for(let fe=0;fe<g.length;fe++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(H|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(H|=i.STENCIL_BUFFER_BIT)),ne){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,se.__webglColorRenderbuffer[fe]);let te=n.get(g[fe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,te,0)}i.blitFramebuffer(0,0,P,k,0,0,P,k,H,i.NEAREST),l===!0&&(Fe.length=0,Le.length=0,Fe.push(i.COLOR_ATTACHMENT0+fe),T.depthBuffer&&T.resolveDepthBuffer===!1&&(Fe.push(O),Le.push(O),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Le)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Fe))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ne)for(let fe=0;fe<g.length;fe++){t.bindFramebuffer(i.FRAMEBUFFER,se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,se.__webglColorRenderbuffer[fe]);let te=n.get(g[fe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,te,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){let g=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[g])}}}function $e(T){return Math.min(s.maxSamples,T.samples)}function Me(T){let g=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function Be(T){let g=o.render.frame;h.get(T)!==g&&(h.set(T,g),T.update())}function bt(T,g){let P=T.colorSpace,k=T.format,H=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||P!==Oi&&P!==ii&&(Je.getTransfer(P)===it?(k!==gn||H!==Rn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",P)),g}function yt(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=G,this.resetTextureUnits=U,this.setTexture2D=j,this.setTexture2DArray=W,this.setTexture3D=re,this.setTextureCube=q,this.rebindTextures=pt,this.setupRenderTarget=I,this.updateRenderTargetMipmap=rt,this.updateMultisampleRenderTarget=xe,this.setupDepthRenderbuffer=Ae,this.setupFrameBufferTexture=ie,this.useMultisampledRTT=Me}function R_(i,e){function t(n,s=ii){let r,o=Je.getTransfer(s);if(n===Rn)return i.UNSIGNED_BYTE;if(n===ea)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ta)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Fl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Bl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Ol)return i.BYTE;if(n===Ul)return i.SHORT;if(n===Rs)return i.UNSIGNED_SHORT;if(n===Qo)return i.INT;if(n===Mi)return i.UNSIGNED_INT;if(n===Vn)return i.FLOAT;if(n===Is)return i.HALF_FLOAT;if(n===kl)return i.ALPHA;if(n===zl)return i.RGB;if(n===gn)return i.RGBA;if(n===xs)return i.DEPTH_COMPONENT;if(n===Ds)return i.DEPTH_STENCIL;if(n===Hl)return i.RED;if(n===na)return i.RED_INTEGER;if(n===Vl)return i.RG;if(n===ia)return i.RG_INTEGER;if(n===sa)return i.RGBA_INTEGER;if(n===Ar||n===Cr||n===Rr||n===Ir)if(o===it)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ar)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Cr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Rr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ir)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ar)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Cr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Rr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ir)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ra||n===oa||n===aa||n===la)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ra)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===oa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===aa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===la)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ca||n===ha||n===ua)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ca||n===ha)return o===it?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ua)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===da||n===fa||n===pa||n===ma||n===ga||n===_a||n===xa||n===ya||n===va||n===ba||n===Ma||n===Sa||n===Ea||n===wa)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===da)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===fa)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===pa)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ma)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ga)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===_a)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===xa)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ya)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===va)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ba)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ma)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Sa)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ea)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===wa)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ta||n===Aa||n===Ca)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Ta)return o===it?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Aa)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ca)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ra||n===Ia||n===Pa||n===Da)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ra)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ia)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Pa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Da)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ps?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var I_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,P_=`
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

}`,uc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new pr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new An({vertexShader:I_,fragmentShader:P_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Mt(new zi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},dc=class extends Un{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,f=null,p=null,_=null,x=typeof XRWebGLBinding<"u",m=new uc,d={},E=t.getContextAttributes(),v=null,y=null,A=[],w=[],C=new we,L=null,S=new Pt;S.viewport=new _t;let b=new Pt;b.viewport=new _t;let R=[S,b],U=new Ho,G=null,Z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let V=A[K];return V===void 0&&(V=new Ss,A[K]=V),V.getTargetRaySpace()},this.getControllerGrip=function(K){let V=A[K];return V===void 0&&(V=new Ss,A[K]=V),V.getGripSpace()},this.getHand=function(K){let V=A[K];return V===void 0&&(V=new Ss,A[K]=V),V.getHandSpace()};function j(K){let V=w.indexOf(K.inputSource);if(V===-1)return;let ie=A[V];ie!==void 0&&(ie.update(K.inputSource,K.frame,c||o),ie.dispatchEvent({type:K.type,data:K.inputSource}))}function W(){s.removeEventListener("select",j),s.removeEventListener("selectstart",j),s.removeEventListener("selectend",j),s.removeEventListener("squeeze",j),s.removeEventListener("squeezestart",j),s.removeEventListener("squeezeend",j),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",re);for(let K=0;K<A.length;K++){let V=w[K];V!==null&&(w[K]=null,A[K].disconnect(V))}G=null,Z=null,m.reset();for(let K in d)delete d[K];e.setRenderTarget(v),p=null,f=null,u=null,s=null,y=null,Ce.stop(),n.isPresenting=!1,e.setPixelRatio(L),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){a=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",j),s.addEventListener("selectstart",j),s.addEventListener("selectend",j),s.addEventListener("squeeze",j),s.addEventListener("squeezestart",j),s.addEventListener("squeezeend",j),s.addEventListener("end",W),s.addEventListener("inputsourceschange",re),E.xrCompatible!==!0&&await t.makeXRCompatible(),L=e.getPixelRatio(),e.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let ie=null,de=null,_e=null;E.depth&&(_e=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ie=E.stencil?Ds:xs,de=E.stencil?Ps:Mi);let Ae={colorFormat:t.RGBA8,depthFormat:_e,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(Ae),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),y=new Fn(f.textureWidth,f.textureHeight,{format:gn,type:Rn,depthTexture:new fr(f.textureWidth,f.textureHeight,de,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let ie={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,ie),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new Fn(p.framebufferWidth,p.framebufferHeight,{format:gn,type:Rn,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Ce.setContext(s),Ce.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function re(K){for(let V=0;V<K.removed.length;V++){let ie=K.removed[V],de=w.indexOf(ie);de>=0&&(w[de]=null,A[de].disconnect(ie))}for(let V=0;V<K.added.length;V++){let ie=K.added[V],de=w.indexOf(ie);if(de===-1){for(let Ae=0;Ae<A.length;Ae++)if(Ae>=w.length){w.push(ie),de=Ae;break}else if(w[Ae]===null){w[Ae]=ie,de=Ae;break}if(de===-1)break}let _e=A[de];_e&&_e.connect(ie)}}let q=new D,F=new D;function J(K,V,ie){q.setFromMatrixPosition(V.matrixWorld),F.setFromMatrixPosition(ie.matrixWorld);let de=q.distanceTo(F),_e=V.projectionMatrix.elements,Ae=ie.projectionMatrix.elements,pt=_e[14]/(_e[10]-1),I=_e[14]/(_e[10]+1),rt=(_e[9]+1)/_e[5],Fe=(_e[9]-1)/_e[5],Le=(_e[8]-1)/_e[0],xe=(Ae[8]+1)/Ae[0],$e=pt*Le,Me=pt*xe,Be=de/(-Le+xe),bt=Be*-Le;if(V.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(bt),K.translateZ(Be),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),_e[10]===-1)K.projectionMatrix.copy(V.projectionMatrix),K.projectionMatrixInverse.copy(V.projectionMatrixInverse);else{let yt=pt+Be,T=I+Be,g=$e-bt,P=Me+(de-bt),k=rt*I/T*yt,H=Fe*I/T*yt;K.projectionMatrix.makePerspective(g,P,k,H,yt,T),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function ee(K,V){V===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(V.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let V=K.near,ie=K.far;m.texture!==null&&(m.depthNear>0&&(V=m.depthNear),m.depthFar>0&&(ie=m.depthFar)),U.near=b.near=S.near=V,U.far=b.far=S.far=ie,(G!==U.near||Z!==U.far)&&(s.updateRenderState({depthNear:U.near,depthFar:U.far}),G=U.near,Z=U.far),U.layers.mask=K.layers.mask|6,S.layers.mask=U.layers.mask&3,b.layers.mask=U.layers.mask&5;let de=K.parent,_e=U.cameras;ee(U,de);for(let Ae=0;Ae<_e.length;Ae++)ee(_e[Ae],de);_e.length===2?J(U,S,b):U.projectionMatrix.copy(S.projectionMatrix),be(K,U,de)};function be(K,V,ie){ie===null?K.matrix.copy(V.matrixWorld):(K.matrix.copy(ie.matrixWorld),K.matrix.invert(),K.matrix.multiply(V.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(V.projectionMatrix),K.projectionMatrixInverse.copy(V.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=ys*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(K){l=K,f!==null&&(f.fixedFoveation=K),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=K)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(U)},this.getCameraTexture=function(K){return d[K]};let Oe=null;function Pe(K,V){if(h=V.getViewerPose(c||o),_=V,h!==null){let ie=h.views;p!==null&&(e.setRenderTargetFramebuffer(y,p.framebuffer),e.setRenderTarget(y));let de=!1;ie.length!==U.cameras.length&&(U.cameras.length=0,de=!0);for(let I=0;I<ie.length;I++){let rt=ie[I],Fe=null;if(p!==null)Fe=p.getViewport(rt);else{let xe=u.getViewSubImage(f,rt);Fe=xe.viewport,I===0&&(e.setRenderTargetTextures(y,xe.colorTexture,xe.depthStencilTexture),e.setRenderTarget(y))}let Le=R[I];Le===void 0&&(Le=new Pt,Le.layers.enable(I),Le.viewport=new _t,R[I]=Le),Le.matrix.fromArray(rt.transform.matrix),Le.matrix.decompose(Le.position,Le.quaternion,Le.scale),Le.projectionMatrix.fromArray(rt.projectionMatrix),Le.projectionMatrixInverse.copy(Le.projectionMatrix).invert(),Le.viewport.set(Fe.x,Fe.y,Fe.width,Fe.height),I===0&&(U.matrix.copy(Le.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),de===!0&&U.cameras.push(Le)}let _e=s.enabledFeatures;if(_e&&_e.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();let I=u.getDepthInformation(ie[0]);I&&I.isValid&&I.texture&&m.init(I,s.renderState)}if(_e&&_e.includes("camera-access")&&x){e.state.unbindTexture(),u=n.getBinding();for(let I=0;I<ie.length;I++){let rt=ie[I].camera;if(rt){let Fe=d[rt];Fe||(Fe=new pr,d[rt]=Fe);let Le=u.getCameraImage(rt);Fe.sourceTexture=Le}}}}for(let ie=0;ie<A.length;ie++){let de=w[ie],_e=A[ie];de!==null&&_e!==void 0&&_e.update(de,V,c||o)}Oe&&Oe(K,V),V.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:V}),_=null}let Ce=new Mu;Ce.setAnimationLoop(Pe),this.setAnimationLoop=function(K){Oe=K},this.dispose=function(){}}},qi=new Tn,D_=new ht;function L_(i,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,jl(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,E,v,y){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),h(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,y)):d.isMeshMatcapMaterial?(r(m,d),_(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),x(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?l(m,d,E,v):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===qt&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===qt&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);let E=e.get(d),v=E.envMap,y=E.envMapRotation;v&&(m.envMap.value=v,qi.copy(y),qi.x*=-1,qi.y*=-1,qi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(qi.y*=-1,qi.z*=-1),m.envMapRotation.value.setFromMatrix4(D_.makeRotationFromEuler(qi)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,E,v){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*E,m.scale.value=v*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,E){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===qt&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,d){d.matcap&&(m.matcap.value=d.matcap)}function x(m,d){let E=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function N_(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(E,v){let y=v.program;n.uniformBlockBinding(E,y)}function c(E,v){let y=s[E.id];y===void 0&&(_(E),y=h(E),s[E.id]=y,E.addEventListener("dispose",m));let A=v.program;n.updateUBOMapping(E,A);let w=e.render.frame;r[E.id]!==w&&(f(E),r[E.id]=w)}function h(E){let v=u();E.__bindingPointIndex=v;let y=i.createBuffer(),A=E.__size,w=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,A,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,y),y}function u(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(E){let v=s[E.id],y=E.uniforms,A=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let w=0,C=y.length;w<C;w++){let L=Array.isArray(y[w])?y[w]:[y[w]];for(let S=0,b=L.length;S<b;S++){let R=L[S];if(p(R,w,S,A)===!0){let U=R.__offset,G=Array.isArray(R.value)?R.value:[R.value],Z=0;for(let j=0;j<G.length;j++){let W=G[j],re=x(W);typeof W=="number"||typeof W=="boolean"?(R.__data[0]=W,i.bufferSubData(i.UNIFORM_BUFFER,U+Z,R.__data)):W.isMatrix3?(R.__data[0]=W.elements[0],R.__data[1]=W.elements[1],R.__data[2]=W.elements[2],R.__data[3]=0,R.__data[4]=W.elements[3],R.__data[5]=W.elements[4],R.__data[6]=W.elements[5],R.__data[7]=0,R.__data[8]=W.elements[6],R.__data[9]=W.elements[7],R.__data[10]=W.elements[8],R.__data[11]=0):(W.toArray(R.__data,Z),Z+=re.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,U,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(E,v,y,A){let w=E.value,C=v+"_"+y;if(A[C]===void 0)return typeof w=="number"||typeof w=="boolean"?A[C]=w:A[C]=w.clone(),!0;{let L=A[C];if(typeof w=="number"||typeof w=="boolean"){if(L!==w)return A[C]=w,!0}else if(L.equals(w)===!1)return L.copy(w),!0}return!1}function _(E){let v=E.uniforms,y=0,A=16;for(let C=0,L=v.length;C<L;C++){let S=Array.isArray(v[C])?v[C]:[v[C]];for(let b=0,R=S.length;b<R;b++){let U=S[b],G=Array.isArray(U.value)?U.value:[U.value];for(let Z=0,j=G.length;Z<j;Z++){let W=G[Z],re=x(W),q=y%A,F=q%re.boundary,J=q+F;y+=F,J!==0&&A-J<re.storage&&(y+=A-J),U.__data=new Float32Array(re.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=y,y+=re.storage}}}let w=y%A;return w>0&&(y+=A-w),E.__size=y,E.__cache={},this}function x(E){let v={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(v.boundary=4,v.storage=4):E.isVector2?(v.boundary=8,v.storage=8):E.isVector3||E.isColor?(v.boundary=16,v.storage=12):E.isVector4?(v.boundary=16,v.storage=16):E.isMatrix3?(v.boundary=48,v.storage=48):E.isMatrix4?(v.boundary=64,v.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),v}function m(E){let v=E.target;v.removeEventListener("dispose",m);let y=o.indexOf(v.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function d(){for(let E in s)i.deleteBuffer(s[E]);o=[],s={},r={}}return{bind:l,update:c,dispose:d}}var Us=class{constructor(e={}){let{canvas:t=Yh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let _=new Uint32Array(4),x=new Int32Array(4),m=null,d=null,E=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ni,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let y=this,A=!1;this._outputColorSpace=Wt;let w=0,C=0,L=null,S=-1,b=null,R=new _t,U=new _t,G=null,Z=new ze(0),j=0,W=t.width,re=t.height,q=1,F=null,J=null,ee=new _t(0,0,W,re),be=new _t(0,0,W,re),Oe=!1,Pe=new ws,Ce=!1,K=!1,V=new ht,ie=new D,de=new _t,_e={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ae=!1;function pt(){return L===null?q:1}let I=n;function rt(M,B){return t.getContext(M,B)}try{let M={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",he,!1),t.addEventListener("webglcontextrestored",ve,!1),t.addEventListener("webglcontextcreationerror",oe,!1),I===null){let B="webgl2";if(I=rt(B,M),I===null)throw rt(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let Fe,Le,xe,$e,Me,Be,bt,yt,T,g,P,k,H,O,se,ne,ue,fe,te,ce,Ie,Te,me,We;function N(){Fe=new Km(I),Fe.init(),Te=new R_(I,Fe),Le=new Xm(I,Fe,e,Te),xe=new A_(I,Fe),Le.reversedDepthBuffer&&f&&xe.buffers.depth.setReversed(!0),$e=new tg(I),Me=new p_,Be=new C_(I,Fe,xe,Me,Le,Te,$e),bt=new Ym(y),yt=new Jm(y),T=new af(I),me=new Gm(I,T),g=new Qm(I,T,$e,me),P=new ig(I,g,T,$e),te=new ng(I,Le,Be),ne=new qm(Me),k=new f_(y,bt,yt,Fe,Le,me,ne),H=new L_(y,Me),O=new g_,se=new M_(Fe),fe=new Vm(y,bt,yt,xe,P,p,l),ue=new w_(y,P,Le),We=new N_(I,$e,Le,xe),ce=new Wm(I,Fe,$e),Ie=new eg(I,Fe,$e),$e.programs=k.programs,y.capabilities=Le,y.extensions=Fe,y.properties=Me,y.renderLists=O,y.shadowMap=ue,y.state=xe,y.info=$e}N();let le=new dc(y,I);this.xr=le,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let M=Fe.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=Fe.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(M){M!==void 0&&(q=M,this.setSize(W,re,!1))},this.getSize=function(M){return M.set(W,re)},this.setSize=function(M,B,X=!0){if(le.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=M,re=B,t.width=Math.floor(M*q),t.height=Math.floor(B*q),X===!0&&(t.style.width=M+"px",t.style.height=B+"px"),this.setViewport(0,0,M,B)},this.getDrawingBufferSize=function(M){return M.set(W*q,re*q).floor()},this.setDrawingBufferSize=function(M,B,X){W=M,re=B,q=X,t.width=Math.floor(M*X),t.height=Math.floor(B*X),this.setViewport(0,0,M,B)},this.getCurrentViewport=function(M){return M.copy(R)},this.getViewport=function(M){return M.copy(ee)},this.setViewport=function(M,B,X,Y){M.isVector4?ee.set(M.x,M.y,M.z,M.w):ee.set(M,B,X,Y),xe.viewport(R.copy(ee).multiplyScalar(q).round())},this.getScissor=function(M){return M.copy(be)},this.setScissor=function(M,B,X,Y){M.isVector4?be.set(M.x,M.y,M.z,M.w):be.set(M,B,X,Y),xe.scissor(U.copy(be).multiplyScalar(q).round())},this.getScissorTest=function(){return Oe},this.setScissorTest=function(M){xe.setScissorTest(Oe=M)},this.setOpaqueSort=function(M){F=M},this.setTransparentSort=function(M){J=M},this.getClearColor=function(M){return M.copy(fe.getClearColor())},this.setClearColor=function(){fe.setClearColor(...arguments)},this.getClearAlpha=function(){return fe.getClearAlpha()},this.setClearAlpha=function(){fe.setClearAlpha(...arguments)},this.clear=function(M=!0,B=!0,X=!0){let Y=0;if(M){let z=!1;if(L!==null){let ae=L.texture.format;z=ae===sa||ae===ia||ae===na}if(z){let ae=L.texture.type,ge=ae===Rn||ae===Mi||ae===Rs||ae===Ps||ae===ea||ae===ta,Se=fe.getClearColor(),ye=fe.getClearAlpha(),Ne=Se.r,Ue=Se.g,Re=Se.b;ge?(_[0]=Ne,_[1]=Ue,_[2]=Re,_[3]=ye,I.clearBufferuiv(I.COLOR,0,_)):(x[0]=Ne,x[1]=Ue,x[2]=Re,x[3]=ye,I.clearBufferiv(I.COLOR,0,x))}else Y|=I.COLOR_BUFFER_BIT}B&&(Y|=I.DEPTH_BUFFER_BIT),X&&(Y|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",he,!1),t.removeEventListener("webglcontextrestored",ve,!1),t.removeEventListener("webglcontextcreationerror",oe,!1),fe.dispose(),O.dispose(),se.dispose(),Me.dispose(),bt.dispose(),yt.dispose(),P.dispose(),me.dispose(),We.dispose(),k.dispose(),le.dispose(),le.removeEventListener("sessionstart",Pn),le.removeEventListener("sessionend",Ec),wi.stop()};function he(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function ve(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;let M=$e.autoReset,B=ue.enabled,X=ue.autoUpdate,Y=ue.needsUpdate,z=ue.type;N(),$e.autoReset=M,ue.enabled=B,ue.autoUpdate=X,ue.needsUpdate=Y,ue.type=z}function oe(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Q(M){let B=M.target;B.removeEventListener("dispose",Q),Ee(B)}function Ee(M){ke(M),Me.remove(M)}function ke(M){let B=Me.get(M).programs;B!==void 0&&(B.forEach(function(X){k.releaseProgram(X)}),M.isShaderMaterial&&k.releaseShaderCache(M))}this.renderBufferDirect=function(M,B,X,Y,z,ae){B===null&&(B=_e);let ge=z.isMesh&&z.matrixWorld.determinant()<0,Se=ju(M,B,X,Y,z);xe.setMaterial(Y,ge);let ye=X.index,Ne=1;if(Y.wireframe===!0){if(ye=g.getWireframeAttribute(X),ye===void 0)return;Ne=2}let Ue=X.drawRange,Re=X.attributes.position,je=Ue.start*Ne,ot=(Ue.start+Ue.count)*Ne;ae!==null&&(je=Math.max(je,ae.start*Ne),ot=Math.min(ot,(ae.start+ae.count)*Ne)),ye!==null?(je=Math.max(je,0),ot=Math.min(ot,ye.count)):Re!=null&&(je=Math.max(je,0),ot=Math.min(ot,Re.count));let vt=ot-je;if(vt<0||vt===1/0)return;me.setup(z,Y,Se,X,ye);let dt,ct=ce;if(ye!==null&&(dt=T.get(ye),ct=Ie,ct.setIndex(dt)),z.isMesh)Y.wireframe===!0?(xe.setLineWidth(Y.wireframeLinewidth*pt()),ct.setMode(I.LINES)):ct.setMode(I.TRIANGLES);else if(z.isLine){let De=Y.linewidth;De===void 0&&(De=1),xe.setLineWidth(De*pt()),z.isLineSegments?ct.setMode(I.LINES):z.isLineLoop?ct.setMode(I.LINE_LOOP):ct.setMode(I.LINE_STRIP)}else z.isPoints?ct.setMode(I.POINTS):z.isSprite&&ct.setMode(I.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)vs("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ct.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(Fe.get("WEBGL_multi_draw"))ct.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let De=z._multiDrawStarts,mt=z._multiDrawCounts,Qe=z._multiDrawCount,Kt=ye?T.get(ye).bytesPerElement:1,Qi=Me.get(Y).currentProgram.getUniforms();for(let Qt=0;Qt<Qe;Qt++)Qi.setValue(I,"_gl_DrawID",Qt),ct.render(De[Qt]/Kt,mt[Qt])}else if(z.isInstancedMesh)ct.renderInstances(je,vt,z.count);else if(X.isInstancedBufferGeometry){let De=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,mt=Math.min(X.instanceCount,De);ct.renderInstances(je,vt,mt)}else ct.render(je,vt)};function ut(M,B,X){M.transparent===!0&&M.side===Hn&&M.forceSinglePass===!1?(M.side=qt,M.needsUpdate=!0,kr(M,B,X),M.side=Qn,M.needsUpdate=!0,kr(M,B,X),M.side=Hn):kr(M,B,X)}this.compile=function(M,B,X=null){X===null&&(X=M),d=se.get(X),d.init(B),v.push(d),X.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(d.pushLight(z),z.castShadow&&d.pushShadow(z))}),M!==X&&M.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(d.pushLight(z),z.castShadow&&d.pushShadow(z))}),d.setupLights();let Y=new Set;return M.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;let ae=z.material;if(ae)if(Array.isArray(ae))for(let ge=0;ge<ae.length;ge++){let Se=ae[ge];ut(Se,X,z),Y.add(Se)}else ut(ae,X,z),Y.add(ae)}),d=v.pop(),Y},this.compileAsync=function(M,B,X=null){let Y=this.compile(M,B,X);return new Promise(z=>{function ae(){if(Y.forEach(function(ge){Me.get(ge).currentProgram.isReady()&&Y.delete(ge)}),Y.size===0){z(M);return}setTimeout(ae,10)}Fe.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let et=null;function Xn(M){et&&et(M)}function Pn(){wi.stop()}function Ec(){wi.start()}let wi=new Mu;wi.setAnimationLoop(Xn),typeof self<"u"&&wi.setContext(self),this.setAnimationLoop=function(M){et=M,le.setAnimationLoop(M),M===null?wi.stop():wi.start()},le.addEventListener("sessionstart",Pn),le.addEventListener("sessionend",Ec),this.render=function(M,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),le.enabled===!0&&le.isPresenting===!0&&(le.cameraAutoUpdate===!0&&le.updateCamera(B),B=le.getCamera()),M.isScene===!0&&M.onBeforeRender(y,M,B,L),d=se.get(M,v.length),d.init(B),v.push(d),V.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Pe.setFromProjectionMatrix(V,En,B.reversedDepth),K=this.localClippingEnabled,Ce=ne.init(this.clippingPlanes,K),m=O.get(M,E.length),m.init(),E.push(m),le.enabled===!0&&le.isPresenting===!0){let ae=y.xr.getDepthSensingMesh();ae!==null&&Xa(ae,B,-1/0,y.sortObjects)}Xa(M,B,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(F,J),Ae=le.enabled===!1||le.isPresenting===!1||le.hasDepthSensing()===!1,Ae&&fe.addToRenderList(m,M),this.info.render.frame++,Ce===!0&&ne.beginShadows();let X=d.state.shadowsArray;ue.render(X,M,B),Ce===!0&&ne.endShadows(),this.info.autoReset===!0&&this.info.reset();let Y=m.opaque,z=m.transmissive;if(d.setupLights(),B.isArrayCamera){let ae=B.cameras;if(z.length>0)for(let ge=0,Se=ae.length;ge<Se;ge++){let ye=ae[ge];Tc(Y,z,M,ye)}Ae&&fe.render(M);for(let ge=0,Se=ae.length;ge<Se;ge++){let ye=ae[ge];wc(m,M,ye,ye.viewport)}}else z.length>0&&Tc(Y,z,M,B),Ae&&fe.render(M),wc(m,M,B);L!==null&&C===0&&(Be.updateMultisampleRenderTarget(L),Be.updateRenderTargetMipmap(L)),M.isScene===!0&&M.onAfterRender(y,M,B),me.resetDefaultState(),S=-1,b=null,v.pop(),v.length>0?(d=v[v.length-1],Ce===!0&&ne.setGlobalState(y.clippingPlanes,d.state.camera)):d=null,E.pop(),E.length>0?m=E[E.length-1]:m=null};function Xa(M,B,X,Y){if(M.visible===!1)return;if(M.layers.test(B.layers)){if(M.isGroup)X=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(B);else if(M.isLight)d.pushLight(M),M.castShadow&&d.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||Pe.intersectsSprite(M)){Y&&de.setFromMatrixPosition(M.matrixWorld).applyMatrix4(V);let ge=P.update(M),Se=M.material;Se.visible&&m.push(M,ge,Se,X,de.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||Pe.intersectsObject(M))){let ge=P.update(M),Se=M.material;if(Y&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),de.copy(M.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),de.copy(ge.boundingSphere.center)),de.applyMatrix4(M.matrixWorld).applyMatrix4(V)),Array.isArray(Se)){let ye=ge.groups;for(let Ne=0,Ue=ye.length;Ne<Ue;Ne++){let Re=ye[Ne],je=Se[Re.materialIndex];je&&je.visible&&m.push(M,ge,je,X,de.z,Re)}}else Se.visible&&m.push(M,ge,Se,X,de.z,null)}}let ae=M.children;for(let ge=0,Se=ae.length;ge<Se;ge++)Xa(ae[ge],B,X,Y)}function wc(M,B,X,Y){let z=M.opaque,ae=M.transmissive,ge=M.transparent;d.setupLightsView(X),Ce===!0&&ne.setGlobalState(y.clippingPlanes,X),Y&&xe.viewport(R.copy(Y)),z.length>0&&Br(z,B,X),ae.length>0&&Br(ae,B,X),ge.length>0&&Br(ge,B,X),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function Tc(M,B,X,Y){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[Y.id]===void 0&&(d.state.transmissionRenderTarget[Y.id]=new Fn(1,1,{generateMipmaps:!0,type:Fe.has("EXT_color_buffer_half_float")||Fe.has("EXT_color_buffer_float")?Is:Rn,minFilter:bi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));let ae=d.state.transmissionRenderTarget[Y.id],ge=Y.viewport||R;ae.setSize(ge.z*y.transmissionResolutionScale,ge.w*y.transmissionResolutionScale);let Se=y.getRenderTarget(),ye=y.getActiveCubeFace(),Ne=y.getActiveMipmapLevel();y.setRenderTarget(ae),y.getClearColor(Z),j=y.getClearAlpha(),j<1&&y.setClearColor(16777215,.5),y.clear(),Ae&&fe.render(X);let Ue=y.toneMapping;y.toneMapping=ni;let Re=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),d.setupLightsView(Y),Ce===!0&&ne.setGlobalState(y.clippingPlanes,Y),Br(M,X,Y),Be.updateMultisampleRenderTarget(ae),Be.updateRenderTargetMipmap(ae),Fe.has("WEBGL_multisampled_render_to_texture")===!1){let je=!1;for(let ot=0,vt=B.length;ot<vt;ot++){let dt=B[ot],ct=dt.object,De=dt.geometry,mt=dt.material,Qe=dt.group;if(mt.side===Hn&&ct.layers.test(Y.layers)){let Kt=mt.side;mt.side=qt,mt.needsUpdate=!0,Ac(ct,X,Y,De,mt,Qe),mt.side=Kt,mt.needsUpdate=!0,je=!0}}je===!0&&(Be.updateMultisampleRenderTarget(ae),Be.updateRenderTargetMipmap(ae))}y.setRenderTarget(Se,ye,Ne),y.setClearColor(Z,j),Re!==void 0&&(Y.viewport=Re),y.toneMapping=Ue}function Br(M,B,X){let Y=B.isScene===!0?B.overrideMaterial:null;for(let z=0,ae=M.length;z<ae;z++){let ge=M[z],Se=ge.object,ye=ge.geometry,Ne=ge.group,Ue=ge.material;Ue.allowOverride===!0&&Y!==null&&(Ue=Y),Se.layers.test(X.layers)&&Ac(Se,B,X,ye,Ue,Ne)}}function Ac(M,B,X,Y,z,ae){M.onBeforeRender(y,B,X,Y,z,ae),M.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),z.onBeforeRender(y,B,X,Y,M,ae),z.transparent===!0&&z.side===Hn&&z.forceSinglePass===!1?(z.side=qt,z.needsUpdate=!0,y.renderBufferDirect(X,B,Y,z,M,ae),z.side=Qn,z.needsUpdate=!0,y.renderBufferDirect(X,B,Y,z,M,ae),z.side=Hn):y.renderBufferDirect(X,B,Y,z,M,ae),M.onAfterRender(y,B,X,Y,z,ae)}function kr(M,B,X){B.isScene!==!0&&(B=_e);let Y=Me.get(M),z=d.state.lights,ae=d.state.shadowsArray,ge=z.state.version,Se=k.getParameters(M,z.state,ae,B,X),ye=k.getProgramCacheKey(Se),Ne=Y.programs;Y.environment=M.isMeshStandardMaterial?B.environment:null,Y.fog=B.fog,Y.envMap=(M.isMeshStandardMaterial?yt:bt).get(M.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&M.envMap===null?B.environmentRotation:M.envMapRotation,Ne===void 0&&(M.addEventListener("dispose",Q),Ne=new Map,Y.programs=Ne);let Ue=Ne.get(ye);if(Ue!==void 0){if(Y.currentProgram===Ue&&Y.lightsStateVersion===ge)return Rc(M,Se),Ue}else Se.uniforms=k.getUniforms(M),M.onBeforeCompile(Se,y),Ue=k.acquireProgram(Se,ye),Ne.set(ye,Ue),Y.uniforms=Se.uniforms;let Re=Y.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Re.clippingPlanes=ne.uniform),Rc(M,Se),Y.needsLights=Ju(M),Y.lightsStateVersion=ge,Y.needsLights&&(Re.ambientLightColor.value=z.state.ambient,Re.lightProbe.value=z.state.probe,Re.directionalLights.value=z.state.directional,Re.directionalLightShadows.value=z.state.directionalShadow,Re.spotLights.value=z.state.spot,Re.spotLightShadows.value=z.state.spotShadow,Re.rectAreaLights.value=z.state.rectArea,Re.ltc_1.value=z.state.rectAreaLTC1,Re.ltc_2.value=z.state.rectAreaLTC2,Re.pointLights.value=z.state.point,Re.pointLightShadows.value=z.state.pointShadow,Re.hemisphereLights.value=z.state.hemi,Re.directionalShadowMap.value=z.state.directionalShadowMap,Re.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Re.spotShadowMap.value=z.state.spotShadowMap,Re.spotLightMatrix.value=z.state.spotLightMatrix,Re.spotLightMap.value=z.state.spotLightMap,Re.pointShadowMap.value=z.state.pointShadowMap,Re.pointShadowMatrix.value=z.state.pointShadowMatrix),Y.currentProgram=Ue,Y.uniformsList=null,Ue}function Cc(M){if(M.uniformsList===null){let B=M.currentProgram.getUniforms();M.uniformsList=Os.seqWithValue(B.seq,M.uniforms)}return M.uniformsList}function Rc(M,B){let X=Me.get(M);X.outputColorSpace=B.outputColorSpace,X.batching=B.batching,X.batchingColor=B.batchingColor,X.instancing=B.instancing,X.instancingColor=B.instancingColor,X.instancingMorph=B.instancingMorph,X.skinning=B.skinning,X.morphTargets=B.morphTargets,X.morphNormals=B.morphNormals,X.morphColors=B.morphColors,X.morphTargetsCount=B.morphTargetsCount,X.numClippingPlanes=B.numClippingPlanes,X.numIntersection=B.numClipIntersection,X.vertexAlphas=B.vertexAlphas,X.vertexTangents=B.vertexTangents,X.toneMapping=B.toneMapping}function ju(M,B,X,Y,z){B.isScene!==!0&&(B=_e),Be.resetTextureUnits();let ae=B.fog,ge=Y.isMeshStandardMaterial?B.environment:null,Se=L===null?y.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Oi,ye=(Y.isMeshStandardMaterial?yt:bt).get(Y.envMap||ge),Ne=Y.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Ue=!!X.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Re=!!X.morphAttributes.position,je=!!X.morphAttributes.normal,ot=!!X.morphAttributes.color,vt=ni;Y.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(vt=y.toneMapping);let dt=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,ct=dt!==void 0?dt.length:0,De=Me.get(Y),mt=d.state.lights;if(Ce===!0&&(K===!0||M!==b)){let Vt=M===b&&Y.id===S;ne.setState(Y,M,Vt)}let Qe=!1;Y.version===De.__version?(De.needsLights&&De.lightsStateVersion!==mt.state.version||De.outputColorSpace!==Se||z.isBatchedMesh&&De.batching===!1||!z.isBatchedMesh&&De.batching===!0||z.isBatchedMesh&&De.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&De.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&De.instancing===!1||!z.isInstancedMesh&&De.instancing===!0||z.isSkinnedMesh&&De.skinning===!1||!z.isSkinnedMesh&&De.skinning===!0||z.isInstancedMesh&&De.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&De.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&De.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&De.instancingMorph===!1&&z.morphTexture!==null||De.envMap!==ye||Y.fog===!0&&De.fog!==ae||De.numClippingPlanes!==void 0&&(De.numClippingPlanes!==ne.numPlanes||De.numIntersection!==ne.numIntersection)||De.vertexAlphas!==Ne||De.vertexTangents!==Ue||De.morphTargets!==Re||De.morphNormals!==je||De.morphColors!==ot||De.toneMapping!==vt||De.morphTargetsCount!==ct)&&(Qe=!0):(Qe=!0,De.__version=Y.version);let Kt=De.currentProgram;Qe===!0&&(Kt=kr(Y,B,z));let Qi=!1,Qt=!1,Gs=!1,gt=Kt.getUniforms(),an=De.uniforms;if(xe.useProgram(Kt.program)&&(Qi=!0,Qt=!0,Gs=!0),Y.id!==S&&(S=Y.id,Qt=!0),Qi||b!==M){xe.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),gt.setValue(I,"projectionMatrix",M.projectionMatrix),gt.setValue(I,"viewMatrix",M.matrixWorldInverse);let Yt=gt.map.cameraPosition;Yt!==void 0&&Yt.setValue(I,ie.setFromMatrixPosition(M.matrixWorld)),Le.logarithmicDepthBuffer&&gt.setValue(I,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&gt.setValue(I,"isOrthographic",M.isOrthographicCamera===!0),b!==M&&(b=M,Qt=!0,Gs=!0)}if(z.isSkinnedMesh){gt.setOptional(I,z,"bindMatrix"),gt.setOptional(I,z,"bindMatrixInverse");let Vt=z.skeleton;Vt&&(Vt.boneTexture===null&&Vt.computeBoneTexture(),gt.setValue(I,"boneTexture",Vt.boneTexture,Be))}z.isBatchedMesh&&(gt.setOptional(I,z,"batchingTexture"),gt.setValue(I,"batchingTexture",z._matricesTexture,Be),gt.setOptional(I,z,"batchingIdTexture"),gt.setValue(I,"batchingIdTexture",z._indirectTexture,Be),gt.setOptional(I,z,"batchingColorTexture"),z._colorsTexture!==null&&gt.setValue(I,"batchingColorTexture",z._colorsTexture,Be));let ln=X.morphAttributes;if((ln.position!==void 0||ln.normal!==void 0||ln.color!==void 0)&&te.update(z,X,Kt),(Qt||De.receiveShadow!==z.receiveShadow)&&(De.receiveShadow=z.receiveShadow,gt.setValue(I,"receiveShadow",z.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(an.envMap.value=ye,an.flipEnvMap.value=ye.isCubeTexture&&ye.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&B.environment!==null&&(an.envMapIntensity.value=B.environmentIntensity),Qt&&(gt.setValue(I,"toneMappingExposure",y.toneMappingExposure),De.needsLights&&$u(an,Gs),ae&&Y.fog===!0&&H.refreshFogUniforms(an,ae),H.refreshMaterialUniforms(an,Y,q,re,d.state.transmissionRenderTarget[M.id]),Os.upload(I,Cc(De),an,Be)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Os.upload(I,Cc(De),an,Be),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&gt.setValue(I,"center",z.center),gt.setValue(I,"modelViewMatrix",z.modelViewMatrix),gt.setValue(I,"normalMatrix",z.normalMatrix),gt.setValue(I,"modelMatrix",z.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){let Vt=Y.uniformsGroups;for(let Yt=0,qa=Vt.length;Yt<qa;Yt++){let Ti=Vt[Yt];We.update(Ti,Kt),We.bind(Ti,Kt)}}return Kt}function $u(M,B){M.ambientLightColor.needsUpdate=B,M.lightProbe.needsUpdate=B,M.directionalLights.needsUpdate=B,M.directionalLightShadows.needsUpdate=B,M.pointLights.needsUpdate=B,M.pointLightShadows.needsUpdate=B,M.spotLights.needsUpdate=B,M.spotLightShadows.needsUpdate=B,M.rectAreaLights.needsUpdate=B,M.hemisphereLights.needsUpdate=B}function Ju(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(M,B,X){let Y=Me.get(M);Y.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),Me.get(M.texture).__webglTexture=B,Me.get(M.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:X,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,B){let X=Me.get(M);X.__webglFramebuffer=B,X.__useDefaultFramebuffer=B===void 0};let Ku=I.createFramebuffer();this.setRenderTarget=function(M,B=0,X=0){L=M,w=B,C=X;let Y=!0,z=null,ae=!1,ge=!1;if(M){let ye=Me.get(M);if(ye.__useDefaultFramebuffer!==void 0)xe.bindFramebuffer(I.FRAMEBUFFER,null),Y=!1;else if(ye.__webglFramebuffer===void 0)Be.setupRenderTarget(M);else if(ye.__hasExternalTextures)Be.rebindTextures(M,Me.get(M.texture).__webglTexture,Me.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let Re=M.depthTexture;if(ye.__boundDepthTexture!==Re){if(Re!==null&&Me.has(Re)&&(M.width!==Re.image.width||M.height!==Re.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Be.setupDepthRenderbuffer(M)}}let Ne=M.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(ge=!0);let Ue=Me.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ue[B])?z=Ue[B][X]:z=Ue[B],ae=!0):M.samples>0&&Be.useMultisampledRTT(M)===!1?z=Me.get(M).__webglMultisampledFramebuffer:Array.isArray(Ue)?z=Ue[X]:z=Ue,R.copy(M.viewport),U.copy(M.scissor),G=M.scissorTest}else R.copy(ee).multiplyScalar(q).floor(),U.copy(be).multiplyScalar(q).floor(),G=Oe;if(X!==0&&(z=Ku),xe.bindFramebuffer(I.FRAMEBUFFER,z)&&Y&&xe.drawBuffers(M,z),xe.viewport(R),xe.scissor(U),xe.setScissorTest(G),ae){let ye=Me.get(M.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+B,ye.__webglTexture,X)}else if(ge){let ye=B;for(let Ne=0;Ne<M.textures.length;Ne++){let Ue=Me.get(M.textures[Ne]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Ne,Ue.__webglTexture,X,ye)}}else if(M!==null&&X!==0){let ye=Me.get(M.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,ye.__webglTexture,X)}S=-1},this.readRenderTargetPixels=function(M,B,X,Y,z,ae,ge,Se=0){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=Me.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ge!==void 0&&(ye=ye[ge]),ye){xe.bindFramebuffer(I.FRAMEBUFFER,ye);try{let Ne=M.textures[Se],Ue=Ne.format,Re=Ne.type;if(!Le.textureFormatReadable(Ue)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Le.textureTypeReadable(Re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=M.width-Y&&X>=0&&X<=M.height-z&&(M.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Se),I.readPixels(B,X,Y,z,Te.convert(Ue),Te.convert(Re),ae))}finally{let Ne=L!==null?Me.get(L).__webglFramebuffer:null;xe.bindFramebuffer(I.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(M,B,X,Y,z,ae,ge,Se=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=Me.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ge!==void 0&&(ye=ye[ge]),ye)if(B>=0&&B<=M.width-Y&&X>=0&&X<=M.height-z){xe.bindFramebuffer(I.FRAMEBUFFER,ye);let Ne=M.textures[Se],Ue=Ne.format,Re=Ne.type;if(!Le.textureFormatReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Le.textureTypeReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let je=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,je),I.bufferData(I.PIXEL_PACK_BUFFER,ae.byteLength,I.STREAM_READ),M.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Se),I.readPixels(B,X,Y,z,Te.convert(Ue),Te.convert(Re),0);let ot=L!==null?Me.get(L).__webglFramebuffer:null;xe.bindFramebuffer(I.FRAMEBUFFER,ot);let vt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Zh(I,vt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,je),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,ae),I.deleteBuffer(je),I.deleteSync(vt),ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,B=null,X=0){let Y=Math.pow(2,-X),z=Math.floor(M.image.width*Y),ae=Math.floor(M.image.height*Y),ge=B!==null?B.x:0,Se=B!==null?B.y:0;Be.setTexture2D(M,0),I.copyTexSubImage2D(I.TEXTURE_2D,X,0,0,ge,Se,z,ae),xe.unbindTexture()};let Qu=I.createFramebuffer(),ed=I.createFramebuffer();this.copyTextureToTexture=function(M,B,X=null,Y=null,z=0,ae=null){ae===null&&(z!==0?(vs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ae=z,z=0):ae=0);let ge,Se,ye,Ne,Ue,Re,je,ot,vt,dt=M.isCompressedTexture?M.mipmaps[ae]:M.image;if(X!==null)ge=X.max.x-X.min.x,Se=X.max.y-X.min.y,ye=X.isBox3?X.max.z-X.min.z:1,Ne=X.min.x,Ue=X.min.y,Re=X.isBox3?X.min.z:0;else{let ln=Math.pow(2,-z);ge=Math.floor(dt.width*ln),Se=Math.floor(dt.height*ln),M.isDataArrayTexture?ye=dt.depth:M.isData3DTexture?ye=Math.floor(dt.depth*ln):ye=1,Ne=0,Ue=0,Re=0}Y!==null?(je=Y.x,ot=Y.y,vt=Y.z):(je=0,ot=0,vt=0);let ct=Te.convert(B.format),De=Te.convert(B.type),mt;B.isData3DTexture?(Be.setTexture3D(B,0),mt=I.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(Be.setTexture2DArray(B,0),mt=I.TEXTURE_2D_ARRAY):(Be.setTexture2D(B,0),mt=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,B.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,B.unpackAlignment);let Qe=I.getParameter(I.UNPACK_ROW_LENGTH),Kt=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Qi=I.getParameter(I.UNPACK_SKIP_PIXELS),Qt=I.getParameter(I.UNPACK_SKIP_ROWS),Gs=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,dt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,dt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ne),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ue),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Re);let gt=M.isDataArrayTexture||M.isData3DTexture,an=B.isDataArrayTexture||B.isData3DTexture;if(M.isDepthTexture){let ln=Me.get(M),Vt=Me.get(B),Yt=Me.get(ln.__renderTarget),qa=Me.get(Vt.__renderTarget);xe.bindFramebuffer(I.READ_FRAMEBUFFER,Yt.__webglFramebuffer),xe.bindFramebuffer(I.DRAW_FRAMEBUFFER,qa.__webglFramebuffer);for(let Ti=0;Ti<ye;Ti++)gt&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Me.get(M).__webglTexture,z,Re+Ti),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Me.get(B).__webglTexture,ae,vt+Ti)),I.blitFramebuffer(Ne,Ue,ge,Se,je,ot,ge,Se,I.DEPTH_BUFFER_BIT,I.NEAREST);xe.bindFramebuffer(I.READ_FRAMEBUFFER,null),xe.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(z!==0||M.isRenderTargetTexture||Me.has(M)){let ln=Me.get(M),Vt=Me.get(B);xe.bindFramebuffer(I.READ_FRAMEBUFFER,Qu),xe.bindFramebuffer(I.DRAW_FRAMEBUFFER,ed);for(let Yt=0;Yt<ye;Yt++)gt?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ln.__webglTexture,z,Re+Yt):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,ln.__webglTexture,z),an?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Vt.__webglTexture,ae,vt+Yt):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Vt.__webglTexture,ae),z!==0?I.blitFramebuffer(Ne,Ue,ge,Se,je,ot,ge,Se,I.COLOR_BUFFER_BIT,I.NEAREST):an?I.copyTexSubImage3D(mt,ae,je,ot,vt+Yt,Ne,Ue,ge,Se):I.copyTexSubImage2D(mt,ae,je,ot,Ne,Ue,ge,Se);xe.bindFramebuffer(I.READ_FRAMEBUFFER,null),xe.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else an?M.isDataTexture||M.isData3DTexture?I.texSubImage3D(mt,ae,je,ot,vt,ge,Se,ye,ct,De,dt.data):B.isCompressedArrayTexture?I.compressedTexSubImage3D(mt,ae,je,ot,vt,ge,Se,ye,ct,dt.data):I.texSubImage3D(mt,ae,je,ot,vt,ge,Se,ye,ct,De,dt):M.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,ae,je,ot,ge,Se,ct,De,dt.data):M.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,ae,je,ot,dt.width,dt.height,ct,dt.data):I.texSubImage2D(I.TEXTURE_2D,ae,je,ot,ge,Se,ct,De,dt);I.pixelStorei(I.UNPACK_ROW_LENGTH,Qe),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Kt),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Qi),I.pixelStorei(I.UNPACK_SKIP_ROWS,Qt),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Gs),ae===0&&B.generateMipmaps&&I.generateMipmap(mt),xe.unbindTexture()},this.initRenderTarget=function(M){Me.get(M).__webglFramebuffer===void 0&&Be.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?Be.setTextureCube(M,0):M.isData3DTexture?Be.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?Be.setTexture2DArray(M,0):Be.setTexture2D(M,0),xe.unbindTexture()},this.resetState=function(){w=0,C=0,L=null,xe.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}};function Cu(i,e,t){let n=new Us({alpha:!0,antialias:!0});n.setPixelRatio(Math.min(devicePixelRatio,2)),n.setSize(112,112),i.prepend(n.domElement);let s=n.domElement;s.tabIndex=0,s.setAttribute("role","img"),s.setAttribute("aria-label","View cube: click a face, edge or corner; drag to rotate. Arrow keys rotate, Home restores perspective. / \u89C6\u56FE\u7ACB\u65B9\u4F53\uFF1A\u70B9\u51FB\u9762\u3001\u8FB9\u3001\u89D2\u6216\u62D6\u52A8\u65CB\u8F6C");let r=new Fi,o=new Pt(32,1,.1,20);o.up.set(0,0,1);let a=["RIGHT","LEFT","BACK","FRONT","TOP","BOTTOM"],l=["\u53F3","\u5DE6","\u540E","\u524D","\u9876","\u5E95"],c="",h=a.map(()=>{let v=document.createElement("canvas");return v.width=v.height=128,new Bi(v)}),u=h.map(v=>new mn({map:v})),f=new Mt(new zt(1,1,1),u);r.add(f),r.add(new ei(new ki(f.geometry),new Cn({color:14795132})));let p=new br,_=new we,x=null,m=!1;function d(v){let y=e.position.distanceTo(t.target);e.position.copy(t.target).add(v.normalize().multiplyScalar(y)),e.lookAt(t.target),t.update()}function E(v,y){let A=new xi().setFromVector3(e.position.clone().sub(t.target).applyAxisAngle(new D(1,0,0),-Math.PI/2));A.theta-=v,A.phi=Math.max(.001,Math.min(Math.PI-.001,A.phi+y)),d(new D().setFromSpherical(A).applyAxisAngle(new D(1,0,0),Math.PI/2))}return s.addEventListener("pointerdown",v=>{x={x:v.clientX,y:v.clientY,lastX:v.clientX,lastY:v.clientY},m=!1,s.setPointerCapture(v.pointerId)}),s.addEventListener("pointermove",v=>{x&&(Math.hypot(v.clientX-x.x,v.clientY-x.y)>4&&(m=!0),m&&E((v.clientX-x.lastX)*.012,(v.clientY-x.lastY)*.012),x.lastX=v.clientX,x.lastY=v.clientY)}),s.addEventListener("pointerup",v=>{if(x){if(!m){let y=s.getBoundingClientRect();_.set((v.clientX-y.left)/y.width*2-1,-(v.clientY-y.top)/y.height*2+1),p.setFromCamera(_,o);let A=p.intersectObject(f)[0];if(A){let w=A.point,C=new D(...[w.x,w.y,w.z].map(L=>Math.abs(L)>.34?Math.sign(L):0));Math.abs(C.z)===1&&C.x===0&&C.y===0&&(C.y=-.001),d(C)}}x=null}}),s.addEventListener("pointercancel",()=>{x=null}),s.addEventListener("keydown",v=>{["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","Enter"].includes(v.key)&&(v.preventDefault(),v.key==="Home"?d(new D(430,-645,445)):v.key==="Enter"?d(new D(0,-1,0)):E(v.key==="ArrowLeft"?Math.PI/2:v.key==="ArrowRight"?-Math.PI/2:0,v.key==="ArrowUp"?-.35:v.key==="ArrowDown"?.35:0))}),{update(){c!==document.documentElement.lang&&(c=document.documentElement.lang,h.forEach((v,y)=>{let A=v.image.getContext("2d");A.fillStyle="#304878",A.fillRect(0,0,128,128),A.strokeStyle="#e1c17c",A.lineWidth=5,A.strokeRect(3,3,122,122),A.fillStyle="#fff1cc",A.font="bold 21px Segoe UI",A.textAlign="center",A.textBaseline="middle",A.fillText(c==="zh"?l[y]:a[y],64,64),v.needsUpdate=!0})),o.position.copy(e.position).sub(t.target).normalize().multiplyScalar(3.6),o.lookAt(0,0,0),n.render(r,o)}}}var Ru={type:"change"},mc={type:"start"},Pu={type:"end"},Ba=new mi,Iu=new dn,O_=Math.cos(70*Yl.DEG2RAD),Ct=new D,$t=2*Math.PI,at={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},pc=1e-6,ka=class extends Er{constructor(e,t=null){super(e,t),this.state=at.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:yi.ROTATE,MIDDLE:yi.DOLLY,RIGHT:yi.PAN},this.touches={ONE:vi.ROTATE,TWO:vi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new pn,this._lastTargetPosition=new D,this._quat=new pn().setFromUnitVectors(e.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new xi,this._sphericalDelta=new xi,this._scale=1,this._panOffset=new D,this._rotateStart=new we,this._rotateEnd=new we,this._rotateDelta=new we,this._panStart=new we,this._panEnd=new we,this._panDelta=new we,this._dollyStart=new we,this._dollyEnd=new we,this._dollyDelta=new we,this._dollyDirection=new D,this._mouse=new we,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=F_.bind(this),this._onPointerDown=U_.bind(this),this._onPointerUp=B_.bind(this),this._onContextMenu=X_.bind(this),this._onMouseWheel=H_.bind(this),this._onKeyDown=V_.bind(this),this._onTouchStart=G_.bind(this),this._onTouchMove=W_.bind(this),this._onMouseDown=k_.bind(this),this._onMouseMove=z_.bind(this),this._interceptControlDown=q_.bind(this),this._interceptControlUp=Y_.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Ru),this.update(),this.state=at.NONE}update(e=null){let t=this.object.position;Ct.copy(t).sub(this.target),Ct.applyQuaternion(this._quat),this._spherical.setFromVector3(Ct),this.autoRotate&&this.state===at.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=$t:n>Math.PI&&(n-=$t),s<-Math.PI?s+=$t:s>Math.PI&&(s-=$t),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Ct.setFromSpherical(this._spherical),Ct.applyQuaternion(this._quatInverse),t.copy(this.target).add(Ct),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Ct.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new D(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new D(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Ct.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Ba.origin.copy(this.object.position),Ba.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ba.direction))<O_?this.object.lookAt(this.target):(Iu.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ba.intersectPlane(Iu,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>pc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>pc||this._lastTargetPosition.distanceToSquared(this.target)>pc?(this.dispatchEvent(Ru),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?$t/60*this.autoRotateSpeed*e:$t/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Ct.setFromMatrixColumn(t,0),Ct.multiplyScalar(-e),this._panOffset.add(Ct)}_panUp(e,t){this.screenSpacePanning===!0?Ct.setFromMatrixColumn(t,1):(Ct.setFromMatrixColumn(t,0),Ct.crossVectors(this.object.up,Ct)),Ct.multiplyScalar(e),this._panOffset.add(Ct)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Ct.copy(s).sub(this.target);let r=Ct.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft($t*this._rotateDelta.x/t.clientHeight),this._rotateUp($t*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp($t*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-$t*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft($t*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-$t*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft($t*this._rotateDelta.x/t.clientHeight),this._rotateUp($t*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new we,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function U_(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function F_(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function B_(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Pu),this.state=at.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function k_(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case yi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=at.DOLLY;break;case yi.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=at.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=at.ROTATE}break;case yi.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=at.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=at.PAN}break;default:this.state=at.NONE}this.state!==at.NONE&&this.dispatchEvent(mc)}function z_(i){switch(this.state){case at.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case at.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case at.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function H_(i){this.enabled===!1||this.enableZoom===!1||this.state!==at.NONE||(i.preventDefault(),this.dispatchEvent(mc),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Pu))}function V_(i){this.enabled!==!1&&this._handleKeyDown(i)}function G_(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case vi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=at.TOUCH_ROTATE;break;case vi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=at.TOUCH_PAN;break;default:this.state=at.NONE}break;case 2:switch(this.touches.TWO){case vi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=at.TOUCH_DOLLY_PAN;break;case vi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=at.TOUCH_DOLLY_ROTATE;break;default:this.state=at.NONE}break;default:this.state=at.NONE}this.state!==at.NONE&&this.dispatchEvent(mc)}function W_(i){switch(this._trackPointer(i),this.state){case at.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case at.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case at.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case at.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=at.NONE}}function X_(i){this.enabled!==!1&&i.preventDefault()}function q_(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Y_(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var sn={open:27,thickness:6,min:3,xHalf:6,zMin:-13,zMax:19,capacity:42},Z_=[1,0,0,0,1,0,0,0,1];function gc(i,e){let t=e.rotation,n=[t[0],t[3],t[6],t[1],t[4],t[7],t[2],t[5],t[8]],s=ri(n,i.center.map((h,u)=>h-e.tip[u])),r=Ln(n,i.rotation||Z_),o=[0,1,2].map(h=>i.size.reduce((u,f,p)=>u+Math.abs(r[3*h+p])*f/2,0)),a=s.map((h,u)=>h-o[u]),l=s.map((h,u)=>h+o[u]),c=a[0]<sn.xHalf&&l[0]>-sn.xHalf&&a[2]<sn.zMax&&l[2]>sn.zMin;return{min:a,max:l,overlap:c,width:l[1]-a[1],fits:c&&a[1]>=-24&&l[1]<=24}}function Du(i,e){let t=-sn.min,n=sn.min;for(let s of i){let r=gc(s,e);!r.overlap||r.min[1]>30||r.max[1]<-30||(t=Math.min(t,r.min[1]-sn.thickness/2),n=Math.max(n,r.max[1]+sn.thickness/2))}return[t,n]}function Lu(i){let e=new Fi;e.background=new ze("#1e2e5e"),e.fog=new hr("#1e2e5e",1e3,2200);let t=new Pt(36,1,1,3e3);t.up.set(0,0,1),t.position.set(500,-630,480);let n=new Us({antialias:!0,alpha:!1});n.setPixelRatio(Math.min(devicePixelRatio,2)),n.shadowMap.enabled=!0,n.shadowMap.type=Vo,n.outputColorSpace=Wt,i.prepend(n.domElement),n.domElement.setAttribute("aria-label","Interactive 3D robot arm. Joint angles and tool coordinates are available in the controls.");let s=new ka(t,n.domElement);s.target.set(55,0,90),s.enableDamping=!0,s.minDistance=350,s.maxDistance=1600,s.maxPolarAngle=Math.PI-.001,e.add(new xr(16777215,6584993,2.5));let r=new vr(16777215,3);r.position.set(-200,-300,650),r.castShadow=!0,r.shadow.mapSize.set(2048,2048),Object.assign(r.shadow.camera,{left:-500,right:500,top:500,bottom:-500,near:1,far:1200}),r.shadow.bias=-.001,e.add(r);let o={body:new Xt({color:15790836,roughness:.34,metalness:.16}),joint:new Xt({color:14804457,roughness:.32,metalness:.24}),accent:new Xt({color:16021281,roughness:.38,metalness:.12}),metal:new Xt({color:3752526,metalness:.65,roughness:.3})};function a(g,P){let k=new Mt(g,P);return k.castShadow=!0,k.receiveShadow=!0,e.add(k),k}let l=a(new zi(3e3,3e3),new Xt({color:2373994,roughness:1}));l.position.z=-2;let c=new Mr(900,18,7438762,4216450);c.rotation.x=Math.PI/2,c.position.z=.1,e.add(c);let h=g=>new D(...g);function u(g,P){let k=new Ts(new xt().setFromPoints(g.map(h)),new Cn({color:P}));return e.add(k),k}u([[0,0,1],[360,0,1]],11954256),u([[0,0,1],[0,360,1]],5801579),u([[0,0,0],[0,0,340]],7574969);function f(g,P,k){let H=document.createElement("canvas");H.width=128,H.height=64;let O=H.getContext("2d");O.font="600 36px Segoe UI",O.fillStyle=P,O.textAlign="center",O.fillText(g,64,44);let se=new dr(new Es({map:new Bi(H),depthTest:!1}));return se.position.copy(h(k)),se.scale.set(50,25,1),e.add(se),se}f("X","#a66552",[385,0,5]),f("Y","#54795c",[0,385,5]),f("Z","#597c9a",[0,0,360]);let p=a(new wt(47,49,10,64),o.metal);p.rotation.x=Math.PI/2,p.position.z=5;let _=a(new wt(29,32,54,48),o.body);_.rotation.x=Math.PI/2,_.position.z=37;let x=a(new wt(32.5,32.5,5,48),o.accent);x.rotation.x=Math.PI/2,x.position.z=15;for(let g=0;g<6;g++){let P=g*Math.PI/3,k=a(new wt(2.6,2.6,2,6),o.metal);k.rotation.x=Math.PI/2,k.position.set(41*Math.cos(P),41*Math.sin(P),11)}let m=[],d=[],E=[],v=0;function y(g){if(v!==g){for(let P of[...m,...d,...E])e.remove(P),P.traverse(k=>k.geometry?.dispose());v=g,m=Array.from({length:g-1},(P,k)=>{let H=Math.max(9,18-k*2);return a(new mr([[0,-.5],[H*.8,-.5],[H,-.46],[H,.46],[H*.8,.5],[0,.5]].map(([O,se])=>new we(O,se)),48),o.body)}),d=Array.from({length:g-1},(P,k)=>a(new wt(Math.max(13,23-k*2),Math.max(13,23-k*2),k<2?39:29,32),o.joint)),E=Array.from({length:g-1},(P,k)=>{let H=Math.max(13,23-k*2)-2,O=k<2?40:30,se=a(new wt(H,H,O,48),o.accent);for(let ne of[-1,1]){let ue=new Mt(new wt(H*.73,H*.73,1.2,48),o.joint);ue.position.y=ne*(O/2+.6),ue.castShadow=!0,se.add(ue);for(let fe=0;fe<4;fe++){let te=fe*Math.PI/2+Math.PI/4,ce=new Mt(new wt(1.2,1.2,1.5,6),o.metal);ce.position.set(H*.51*Math.cos(te),ne*(O/2+1.3),H*.51*Math.sin(te)),se.add(ce)}}return se}),de.scale.setScalar(Ai(g)/300),$e=[],xe.geometry.dispose(),xe.geometry=new xt,Be("iso"),n.domElement.dataset.joints=String(g)}}let A=a(new As(3,12,8),o.accent),w=new On;e.add(w);let C=[],L="",S=!1,b=[],R=Rt(Ft.home),U=new Xt({color:6582400,roughness:.35,metalness:.65}),G=new Xt({color:2107185,roughness:.95}),Z=new Xt({color:11822413,roughness:.4,metalness:.6}),j;function W(g){j&&j.material.dispose();for(let H of[...w.children])w.remove(H),H.geometry?.dispose();C=[],j=null,L=g;function P(H,O,se){let ne=new Mt(H,O);return ne.position.set(...se),ne.castShadow=!0,w.add(ne),ne}let k=P(new wt(13,13,4,32),U,[0,0,38]);if(k.rotation.x=Math.PI/2,g!=="vacuum"){let H=P(new wt(7,7,8,20),U,[0,0,32]);H.rotation.x=Math.PI/2}if(g==="gripper"){P(new zt(22,54,12),U,[0,0,23]);for(let H of[-1,1]){let O=P(new zt(12,6,32),G,[0,H*26,3]);O.userData.sign=H,C.push(O)}}if(g==="vacuum"){let H=P(new wt(7,18,14,32),G,[0,0,7]);H.rotation.x=Math.PI/2;let O=P(new wt(5,5,24,16),U,[0,0,25]);O.rotation.x=Math.PI/2}if(g==="magnet"){let H=P(new wt(17,17,12,32),Z,[0,0,6]);H.rotation.x=Math.PI/2,P(new zt(18,18,18),U,[0,0,21])}j=P(new Cs(21,1.2,8,40),new mn({color:g==="vacuum"?5811136:14724181,transparent:!0,opacity:.6}),[0,0,1]),j.visible=!1}W("gripper");let re=null,q=new On;e.add(q);let F=new mn({color:16768837,depthTest:!1}),J=Array.from({length:12},()=>{let g=new Mt(new wt(1.8,1.8,1,8),F);return g.renderOrder=11,q.add(g),g}),ee=new Mt(new zt(1,1,1),new mn({color:16768837,transparent:!0,opacity:.12,depthTest:!1,depthWrite:!1}));ee.renderOrder=10,q.add(ee);let be=f("A","#10203b",[0,0,0]);be.scale.set(36,18,1);let Oe=be.material.map.image,Pe=Oe.getContext("2d");Pe.fillStyle="#ffdf45",Pe.fillRect(0,0,128,64),Pe.fillStyle="#10203b",Pe.font="bold 48px Segoe UI",Pe.textAlign="center",Pe.fillText("A",64,49),be.material.map.needsUpdate=!0,be.renderOrder=12,be.visible=!1;function Ce(){let g={joint:d[0],link:m[0],tool:w,tcp:A}[re];if(q.visible=be.visible=!!g,!g)return;g.updateWorldMatrix(!0,!0);let P=new Bn().setFromObject(g).expandByScalar(6),k=P.getCenter(new D),H=P.getSize(new D);ee.position.copy(k),ee.scale.copy(H);let O=0;for(let se=0;se<3;se++)for(let ne of[0,1])for(let ue of[0,1]){let fe=P.min.clone(),te=P.min.clone(),ce=[0,1,2].filter(Te=>Te!==se);fe.setComponent(ce[0],ne?P.max.getComponent(ce[0]):P.min.getComponent(ce[0])),fe.setComponent(ce[1],ue?P.max.getComponent(ce[1]):P.min.getComponent(ce[1])),te.copy(fe),te.setComponent(se,P.max.getComponent(se));let Ie=J[O++];Ie.position.copy(fe).add(te).multiplyScalar(.5),Ie.scale.y=fe.distanceTo(te),Ie.quaternion.setFromUnitVectors(new D(0,1,0),te.sub(fe).normalize())}be.position.set(k.x,k.y,P.max.z+16)}let K=new Sr(42);e.add(K);let V=u([[0,0,0],[0,0,0]],9742222),ie=a(new Cs(13,1.4,8,40),o.accent);ie.position.z=1;let de=a(new As(300,36,20),new mn({color:7509604,wireframe:!0,transparent:!0,opacity:.065,depthWrite:!1}));de.position.z=Ft.base,de.visible=!1;let _e="",Ae=[],pt=[],I=[],rt=[];function Fe(){for(let g of Ae)e.remove(g),g.geometry?.dispose(),g.material?.map&&g.material.map.dispose(),g.material?.dispose();Ae=[],pt=[],I=[],rt=[]}function Le(g){if(S=g.output,b=g.objects,j&&(j.visible=g.output&&g.tool!=="gripper"),_e!==g.tool){Fe(),_e=g.tool,W(g.tool);let P=g.obstacle,k=a(new zt(...P.size),new Xt({color:10332315,roughness:.9}));k.position.copy(h(P.center)),Ae.push(k);let H=new ei(new ki(k.geometry),new Cn({color:8294005}));H.position.copy(k.position),e.add(H),Ae.push(H),Ae.push(f(P.size[2]+" mm","#ecdcad",[P.center[0]-30,P.center[1]+45,P.size[2]+12]));for(let O of g.objects){let se=g.tool==="magnet"?new wt(O.size[0]/2,O.size[0]/2,O.size[2],32).rotateX(Math.PI/2):new zt(...O.size),ne=a(se,new Xt({color:O.id==="A"?14390866:5807532,roughness:g.tool==="magnet"?.28:.55,metalness:g.tool==="magnet"?.7:.08}));pt.push(ne),Ae.push(ne);let ue=f(O.id,"#f3e5c2",[...O.center]);I.push(ue),Ae.push(ue)}for(let O of g.targets){let se=a(new zt(...O.size,1),new Xt({color:O.id==="A"?15256222:10931152,roughness:1,transparent:!0,opacity:.65}));se.position.set(O.center[0],O.center[1],.6),rt.push(se),Ae.push(se),Ae.push(f(O.id,"#ecdcad",[O.center[0],O.center[1],6]))}}g.objects.forEach((P,k)=>{let H=pt[k],O=P.rotation;H.position.copy(h(P.center)),H.quaternion.setFromRotationMatrix(new ht().set(O[0],O[1],O[2],0,O[3],O[4],O[5],0,O[6],O[7],O[8],0,0,0,0,1)),I[k].position.set(P.center[0],P.center[1],P.center[2]+P.size[2]/2+22),rt[k].material.color.set(P.placed?9549676:P.id==="A"?15256222:10931152)}),n.domElement.dataset.tool=g.tool,n.domElement.dataset.held=g.held||"",n.domElement.dataset.score=String(g.score)}let xe=u([],15759396),$e=[];function Me(g,P=!0){y(g.length);let k=Rt(g),H=k.tip,O=k.points;R=k,m.forEach((ue,fe)=>{let te=h(O[fe]),ce=h(O[fe+1]);ue.position.copy(te).add(ce).multiplyScalar(.5),ue.scale.y=te.distanceTo(ce),ue.quaternion.setFromUnitVectors(new D(0,1,0),ce.sub(te).normalize())}),d.forEach((ue,fe)=>{ue.position.copy(h(k.origins[fe+1])),ue.quaternion.setFromUnitVectors(new D(0,1,0),h(k.axes[fe+1])),E[fe].position.copy(ue.position),E[fe].quaternion.copy(ue.quaternion)}),A.position.copy(h(H)),w.position.copy(h(H));let se=k.rotation,ne=new ht().set(se[0],se[1],se[2],0,se[3],se[4],se[5],0,se[6],se[7],se[8],0,0,0,0,1);w.quaternion.setFromRotationMatrix(ne),K.position.copy(w.position),K.quaternion.copy(w.quaternion),V.geometry.dispose(),V.geometry=new xt().setFromPoints([h(H),h([H[0],H[1],0])]),ie.position.set(H[0],H[1],1),P&&(!$e.length||h(H).distanceTo($e.at(-1))>1.5)&&($e.push(h(H)),$e.length>1400&&$e.shift(),xe.geometry.dispose(),xe.geometry=new xt().setFromPoints($e))}function Be(g){let P=Math.max(1,Ai(v)/440);s.target.set(110,25,95),t.position.set(...g==="top"?[65,-.1,1050*P]:g==="side"?[40,-1e3*P,110]:[540*P,-620*P,540*P]),s.update()}let bt=()=>{let{width:g,height:P}=i.getBoundingClientRect(),k=0;i.style.setProperty("--dock-height",k+"px");let H=Math.max(180,P-k);n.setSize(g,H,!1);let O=document.getElementById("robot-hud")?.getBoundingClientRect().height||0,se=145,ne=O+60;t.aspect=g/H;let ue=Math.min(g,Math.max(300,(H-se-ne)*1.45));t.fov=2*Math.atan(Math.tan(18*Math.PI/180)*H/Math.max(300,ue))*180/Math.PI,t.setViewOffset(g,H,0,(ne-se)*.42,g,H),t.updateProjectionMatrix()};new ResizeObserver(bt).observe(i),window.addEventListener("robot-hud-change",bt);let T=Cu(document.getElementById("view-cube"),t,s);return n.setAnimationLoop(()=>{Ce(),T.update();let g=Du(b,R);for(let P of C){let k=P.userData.sign,H=g[k<0?0:1],O=S?H:k*sn.open,se=P.position.y+(O-P.position.y)*.16;P.position.y=k<0?Math.min(se,H):Math.max(se,H)}n.domElement.dataset.jawGap=C.length?String(C[1].position.y-C[0].position.y-sn.thickness):"",j&&(j.visible=S&&L!=="gripper"),s.update(),n.render(e,t)}),Me(Ft.home),{pose:Me,configure:y,view:Be,taskState:Le,setQuizTarget(g){re=g,Ce()},setTrail(g){xe.visible=g,n.domElement.dataset.trailVisible=String(g)},setReach:g=>de.visible=g,clearTrail(){$e=[],xe.geometry.dispose(),xe.geometry=new xt},targets(){}}}var j_=25,$_=85,Dr=["gripper","vacuum","magnet"],Nu=i=>[i[0],i[3],i[6],i[1],i[4],i[7],i[2],i[5],i[8]],ku=[1,0,0,0,1,0,0,0,1],Ou=(i,e)=>i.map((t,n)=>t+e[n]),Uu=(i,e)=>i.map((t,n)=>t-e[n]);function J_(i){let e=i==="gripper"?[26,26,28]:i==="vacuum"?[36,30,18]:[30,30,20],t={gripper:60,vacuum:75,magnet:90}[i],n=i!=="gripper",s=n?[200,-135]:[170,-105],r=n?[220,125]:[180,80];return{tool:i,obstacle:{center:[...r,t/2],size:[64,64,t]},objects:[{id:"A",center:[...s,e[2]/2],size:[...e],material:{gripper:"wood",vacuum:"smooth",magnet:"steel"}[i]},{id:"B",center:[...r,t+e[2]/2],size:[...e],material:{gripper:"wood",vacuum:"smooth",magnet:"steel"}[i]}],targets:[{id:"A",center:n?[100,220,0]:[75,195,0],size:[72,72]},{id:"B",center:n?[240,-65,0]:[230,-65,0],size:[72,72]}]}}function si(i){let e=i.size.map(s=>s/2),t=i.rotation||ku,n=[0,1,2].map(s=>Math.abs(t[3*s])*e[0]+Math.abs(t[3*s+1])*e[1]+Math.abs(t[3*s+2])*e[2]);return{min:i.center.map((s,r)=>s-n[r]),max:i.center.map((s,r)=>s+n[r]),extent:n}}var Fu=(i,e,t=.6)=>i.min.every((n,s)=>n<e.max[s]-t&&i.max[s]>e.min[s]+t);function Bu(i,e,t,n){let s=si(t),r=0,o=1;for(let a=0;a<3;a++){let l=e[a]-i[a],c=s.min[a]-n,h=s.max[a]+n;if(Math.abs(l)<1e-9){if(i[a]<c||i[a]>h)return!1}else{let u=(c-i[a])/l,f=(h-i[a])/l;if(u>f&&([u,f]=[f,u]),r=Math.max(r,u),o=Math.min(o,f),r>o)return!1}}return!0}var Bs=class{constructor(e="gripper"){this.reset(e)}reset(e=this.tool){this.tool=e,this.spec=J_(e),this.objects=this.spec.objects.map(t=>({...t,center:[...t.center],rotation:[...ku],placed:!1,status:"ready"})),this.output=!1,this.held=null,this.offset=null,this.localRotation=null,this.lastEvent="taskReady",this.drops=0}get input(){return this.held!==null}get score(){return this.objects.filter(e=>e.placed).length}get heldObject(){return this.objects.find(e=>e.id===this.held)}heldPose(e){if(!this.held)return null;let t=Rt(e);return{...this.heldObject,center:Ou(t.tip,ri(t.rotation,this.offset)),rotation:Ln(t.rotation,this.localRotation)}}update(e){let t=this.heldPose(e);t?Object.assign(this.heldObject,t):this.output&&this.tryGrasp(e)}contact(e){return[e.center[0],e.center[1],e.center[2]+e.size[2]/2]}command(e,t){let n=this.heldPose(t);if(n&&Object.assign(this.heldObject,n),this.output=e,e&&this.held)return this.lastEvent;if(!e){if(!this.held)return this.lastEvent="releasedEmpty",this.lastEvent;let s=this.heldObject,r=si(s),o=si(this.spec.obstacle),l=r.min[0]>=o.min[0]&&r.max[0]<=o.max[0]&&r.min[1]>=o.min[1]&&r.max[1]<=o.max[1]&&r.min[2]>=o.max[2]-.8?o.max[2]:0,c=r.min[2]-l<=8&&r.min[2]>=l-1,h=s.rotation[8]>Math.cos(Math.PI/4);s.center[2]-=r.min[2]-l;let u=si(s),f=this.spec.targets.find(p=>p.id===s.id);return s.placed=c&&h&&l===0&&[0,1].every(p=>u.min[p]>=f.center[p]-f.size[p]/2&&u.max[p]<=f.center[p]+f.size[p]/2),s.status=s.placed?"placed":c?"ready":"dropped",this.held=null,this.offset=null,this.localRotation=null,c||this.drops++,this.lastEvent=s.placed?"placed":c?"outsideTarget":"dropped",this.lastEvent}return this.tryGrasp(t)}tryGrasp(e){let t=Rt(e),n=this.objects.filter(r=>oi(this.contact(r),t.tip)<=j_).sort((r,o)=>oi(this.contact(r),t.tip)-oi(this.contact(o),t.tip))[0];if(!n)return this.lastEvent="noContact",this.lastEvent;if(this.tool==="magnet"&&n.material!=="steel"||this.tool==="vacuum"&&n.material!=="smooth")return this.lastEvent="wrongMaterial",this.lastEvent;if(this.tool!=="gripper"&&t.rotation[8]<Math.cos($_*Math.PI/180))return this.lastEvent="alignment",this.lastEvent;if(this.tool==="gripper"&&gc(n,t).width>sn.capacity)return this.lastEvent="tooWide",this.lastEvent;let s=Uu(t.tip,this.contact(n));return n.center=Ou(n.center,[s[0],s[1],Math.max(0,s[2])]),this.held=n.id,n.placed=!1,n.status="held",this.offset=ri(Nu(t.rotation),Uu(n.center,t.tip)),this.localRotation=Ln(Nu(t.rotation),n.rotation),this.lastEvent="grasped",this.lastEvent}collision(e){let t=Rt(e);for(let s=0;s<t.points.length-1;s++)if(Bu(t.points[s],t.points[s+1],this.spec.obstacle,s===t.points.length-2?7:11))return"obstacle";if(t.tip[2]<11.9)return"path";if(Bu(t.flange,t.tip,this.spec.obstacle,7))return"obstacle";let n=this.heldPose(e);if(n){let s=si(n);if(s.min[2]<-.8||Fu(s,si(this.spec.obstacle)))return"payloadCollision";for(let r of this.objects)if(r.id!==n.id&&Fu(s,si(r)))return"payloadCollision"}return null}canMove(e,t){if(!Hr(e,t))return"path";let n=Math.max(1,Math.ceil(Math.max(...e.map((s,r)=>Math.abs(s-t[r])))/.5));for(let s=0;s<=n;s++){let r=this.collision(e.map((o,a)=>o+(t[a]-o)*s/n));if(r)return r}return null}snapshot(){return{tool:this.tool,output:this.output,input:this.input,held:this.held,score:this.score,objects:this.objects.map(e=>({...e,center:[...e.center],rotation:[...e.rotation]})),obstacle:this.spec.obstacle,targets:this.spec.targets,drops:this.drops}}};function _c(i,e){let t=new Bs(i),n=[],s=yn(e),r=i==="gripper"?190:170;if(i!=="gripper"&&e!==6)return{error:"sixForExample"};function o(l,c,h=!1){let u=[...l],f;for(let _=0;_<(h?5:1);_++){if(f=Ws(u,s,"nearest",e===6?[0,0,Math.atan2(u[1],u[0])*180/Math.PI]:null),!f.q)throw Error(f.error);if(h){let x=si(t.heldPose(f.q)).min[2];if(Math.abs(x-2)<.25)break;u[2]+=2-x}}let p=t.canMove(s,f.q);if(p)throw Error(p);s=f.q,t.update(s),n.push({type:"move",name:c,q:[...s],seconds:1.5})}function a(l,c){if(t.command(l,s),l&&!t.input)throw Error(t.lastEvent);n.push({type:"output",value:l,name:c,seconds:.4})}try{o([220,0,r],"Lift to travel height");for(let l of t.objects){let c=t.contact(l),h=t.spec.targets.find(u=>u.id===l.id);if(o([c[0],c[1],r],`${l.id} \xB7 Approach`),o(c,`${l.id} \xB7 Pick`),a(!0,`${l.id} \xB7 Tool ON`),n.push({type:"wait",value:!0,name:"Confirm DI1: object held",seconds:3}),o([c[0],c[1],r],`${l.id} \xB7 Lift clear`),o([h.center[0],h.center[1],r],`${l.id} \xB7 Above target`),o([h.center[0],h.center[1],l.size[2]+2],`${l.id} \xB7 Lower gently`,!0),a(!1,`${l.id} \xB7 Release`),!l.placed)throw Error(t.lastEvent);o([h.center[0],h.center[1],r],`${l.id} \xB7 Retreat`)}return{steps:n}}catch(l){return{error:l.message}}}var Lt={subtitle:"MOVE \xB7 RECORD \xB7 PROGRAM",axis:"3 AXIS / POSITION CONTROL",guide:"Quick guide",workspace:"01 / THE WORKSPACE",title:"Every movement starts here.",perspective:"Perspective",top:"Top",side:"Side",envelope:"Reach envelope",trail:"Clear trail",orbit:"Drag to orbit \xB7 Scroll to zoom",toolposition:"TOOL POSITION",world:"World coordinates \xB7 mm",mission:"LEARNING CHALLENGE",missiontitle:"The inspection route",missiondesc:"Build a program that visits A \u2192 B \u2192 C in order. Finish each move within 15 mm of its target.",resetTask:"Reset challenge",control:"02 / CONTROL THE ARM",jointcontrol:"Joint control",home:"\u2302 Home",xyztitle:"Move to coordinates",nearest:"Nearest configuration",negative:"Elbow \u2212",positive:"Elbow +",move:"Move to XYZ \u2197",record:"\uFF0B Record current position",program:"03 / BUILD A SEQUENCE",movement:"Movement program",run:"\u25B6 Run",pause:"Pause",resume:"Resume",stop:"\u25A0 Stop",empty:"Move the arm. Record a position.<br>Connect your positions into a program.",example:"Load example",export:"Export",import:"Import",saved:"Programs save in this browser. Export a copy to keep or share.",footer:"A small arm. A world of possibilities.",spec:"160 + 140 mm links \xB7 Joint-interpolated motion \xB7 3 DOF",learn:"LEARN BY DOING",guidetitle:"From angles to actions.",guidebody:'<ol><li><b>Explore:</b> drag a joint slider. Watch its angle and the tool\u2019s X, Y, Z coordinates change.</li><li><b>Teach:</b> record a position. Change the arm, then record another. Rename, reorder, or remove steps.</li><li><b>Program:</b> enter XYZ in millimetres, move there, then record it. Run your sequence and adjust step durations.</li><li><b>Try the challenge:</b> select target A to fill its XYZ fields. Move, record, and repeat for B and C. Only completed program steps count.</li></ol><p><b>Coordinate system:</b> Z points up. X and Y lie on the table. The shoulder is 70 mm above the origin. Joint 2 is measured from horizontal; joint 3 is relative to the upper arm.</p><p><b>Why a curved path?</b> The joints rotate together. A straight line between coordinates would require a different motion planner.</p><p><b>Limits:</b> the 300 mm sphere is an outer reach bound, not a map of all reachable points. Joint limits, table clearance, and elbow configuration restrict movement. Near a straight or folded elbow, motion becomes singular: small tool changes can require large angle changes.</p><p class="guide-note">This is a kinematic learning model: table clearance is checked using link endpoints and a small clearance allowance. Self-collision, base collision, payload, dynamics, and hardware control are not modeled. Three axes control position but cannot independently set tool orientation; a future six-axis model adds that capability.</p>',ready:"Ready",moving:"Moving",running:"Running",paused:"Paused",welcome:"Try a slider, or enter a target position to begin.",recorded:"Position recorded. Add another or run your program.",numbers:"Enter three finite coordinates.",reach:"Outside the arm\u2019s reach. The links have a combined length of 300 mm.",limits:"This target violates a joint limit or table clearance in the selected configuration.",path:"The movement would cross the table. Add an intermediate raised position.",blocked:"Movement blocked by a joint limit or table clearance.",complete:"Program complete.",stopped:"Stopped at the current position.",loaded:"Example loaded: three inspection targets. Press Run to try it.",imported:"Program imported.",badfile:"Could not import: use a valid Robot Arm Lab JSON program (up to 200 safe positions).",storage:"Browser storage is unavailable. Export your program to keep it.",singular:"Near a singular configuration \u2014 try bending the elbow.",normal:"Base rotation + shoulder + elbow = 3 degrees of freedom.",step:"Position",seconds:"sec",go:"Go",up:"Move earlier",down:"Move later",remove:"Remove",score:"targets completed",won:"Route complete \u2014 all three targets reached!",targetSelected:"Target coordinates filled. Move there, then record the position.",max:"Maximum 200 steps. Export this program before starting another.",emptyProgram:"Record a position first.",noWebGL:"3D graphics could not start. Enable WebGL or try another browser.",replaced:"Current program replaced.",base:"Base",shoulder:"Shoulder",elbow:"Elbow",exported:"Program exported.",noPath:"Cannot run this sequence safely. Add a raised waypoint before the blocked step."},Nt={subtitle:"\u79FB\u52A8 \xB7 \u8BB0\u5F55 \xB7 \u7F16\u7A0B",axis:"\u4E09\u8F74 / \u4F4D\u7F6E\u63A7\u5236",guide:"\u5FEB\u901F\u6307\u5357",workspace:"01 / \u5DE5\u4F5C\u7A7A\u95F4",title:"\u4ECE\u4E00\u6B21\u79FB\u52A8\u5F00\u59CB\u63A2\u7D22\u3002",perspective:"\u900F\u89C6",top:"\u4FEF\u89C6",side:"\u4FA7\u89C6",envelope:"\u53EF\u8FBE\u8303\u56F4",trail:"\u6E05\u9664\u8F68\u8FF9",orbit:"\u62D6\u52A8\u65CB\u8F6C \xB7 \u6EDA\u8F6E\u7F29\u653E",toolposition:"\u5DE5\u5177\u4F4D\u7F6E",world:"\u4E16\u754C\u5750\u6807 \xB7 \u6BEB\u7C73",mission:"\u5B66\u4E60\u6311\u6218",missiontitle:"\u5DE1\u68C0\u8DEF\u7EBF",missiondesc:"\u7F16\u5199\u7A0B\u5E8F\uFF0C\u4F9D\u6B21\u5230\u8FBE A \u2192 B \u2192 C\u3002\u6BCF\u6B65\u7ED3\u675F\u65F6\u4E0E\u76EE\u6807\u7684\u8DDD\u79BB\u5E94\u5C0F\u4E8E 15 \u6BEB\u7C73\u3002",resetTask:"\u91CD\u7F6E\u6311\u6218",control:"02 / \u63A7\u5236\u673A\u68B0\u81C2",jointcontrol:"\u5173\u8282\u63A7\u5236",home:"\u2302 \u521D\u59CB\u4F4D\u7F6E",xyztitle:"\u79FB\u52A8\u5230\u5750\u6807",nearest:"\u6700\u8FD1\u7684\u5173\u8282\u914D\u7F6E",negative:"\u8098\u5173\u8282 \u2212",positive:"\u8098\u5173\u8282 +",move:"\u79FB\u52A8\u5230 XYZ \u2197",record:"\uFF0B \u8BB0\u5F55\u5F53\u524D\u4F4D\u7F6E",program:"03 / \u7F16\u6392\u52A8\u4F5C",movement:"\u52A8\u4F5C\u7A0B\u5E8F",run:"\u25B6 \u8FD0\u884C",pause:"\u6682\u505C",resume:"\u7EE7\u7EED",stop:"\u25A0 \u505C\u6B62",empty:"\u79FB\u52A8\u673A\u68B0\u81C2\uFF0C\u8BB0\u5F55\u4F4D\u7F6E\u3002<br>\u628A\u591A\u4E2A\u4F4D\u7F6E\u8FDE\u63A5\u6210\u52A8\u4F5C\u7A0B\u5E8F\u3002",example:"\u52A0\u8F7D\u793A\u4F8B",export:"\u5BFC\u51FA",import:"\u5BFC\u5165",saved:"\u7A0B\u5E8F\u81EA\u52A8\u4FDD\u5B58\u5728\u6B64\u6D4F\u89C8\u5668\u4E2D\u3002\u8BF7\u5BFC\u51FA\u526F\u672C\u4EE5\u4FDD\u7559\u6216\u5206\u4EAB\u3002",footer:"\u5C0F\u5C0F\u673A\u68B0\u81C2\uFF0C\u63A2\u7D22\u65E0\u9650\u53EF\u80FD\u3002",spec:"\u8FDE\u6746 160 + 140 \u6BEB\u7C73 \xB7 \u5173\u8282\u63D2\u503C\u8FD0\u52A8 \xB7 3 \u81EA\u7531\u5EA6",learn:"\u5728\u5B9E\u8DF5\u4E2D\u5B66\u4E60",guidetitle:"\u4ECE\u89D2\u5EA6\u5230\u52A8\u4F5C\u3002",guidebody:'<ol><li><b>\u63A2\u7D22\uFF1A</b>\u62D6\u52A8\u5173\u8282\u6ED1\u5757\uFF0C\u89C2\u5BDF\u89D2\u5EA6\u4E0E\u5DE5\u5177\u7684 X\u3001Y\u3001Z \u5750\u6807\u3002</li><li><b>\u793A\u6559\uFF1A</b>\u8BB0\u5F55\u4E00\u4E2A\u4F4D\u7F6E\uFF0C\u79FB\u52A8\u540E\u518D\u8BB0\u5F55\u53E6\u4E00\u4E2A\u4F4D\u7F6E\u3002\u53EF\u4EE5\u91CD\u547D\u540D\u3001\u6392\u5E8F\u6216\u5220\u9664\u6B65\u9AA4\u3002</li><li><b>\u7F16\u7A0B\uFF1A</b>\u8F93\u5165\u6BEB\u7C73\u5355\u4F4D\u7684 XYZ \u5750\u6807\uFF0C\u79FB\u52A8\u540E\u8BB0\u5F55\u3002\u8FD0\u884C\u7A0B\u5E8F\u5E76\u8C03\u6574\u6BCF\u6B65\u7684\u65F6\u957F\u3002</li><li><b>\u6311\u6218\uFF1A</b>\u70B9\u51FB\u76EE\u6807 A \u586B\u5165\u5750\u6807\uFF0C\u79FB\u52A8\u5E76\u8BB0\u5F55\uFF0C\u518D\u5BF9 B\u3001C \u91CD\u590D\u64CD\u4F5C\u3002\u53EA\u6709\u5DF2\u5B8C\u6210\u7684\u7A0B\u5E8F\u6B65\u9AA4\u8BA1\u5206\u3002</li></ol><p><b>\u5750\u6807\uFF1A</b>Z \u5411\u4E0A\uFF0CX\u3001Y \u4F4D\u4E8E\u684C\u9762\u3002\u80A9\u5173\u8282\u8DDD\u539F\u70B9\u9AD8 70 \u6BEB\u7C73\u3002\u5173\u8282 2 \u76F8\u5BF9\u4E8E\u6C34\u5E73\u9762\uFF0C\u5173\u8282 3 \u76F8\u5BF9\u4E8E\u4E0A\u81C2\u3002</p><p><b>\u4E3A\u4EC0\u4E48\u662F\u66F2\u7EBF\uFF1F</b>\u5173\u8282\u540C\u65F6\u65CB\u8F6C\uFF0C\u5DE5\u5177\u4E0D\u4F1A\u6CBF\u76F4\u7EBF\u79FB\u52A8\u3002\u76F4\u7EBF\u8FD0\u52A8\u9700\u8981\u4E0D\u540C\u7684\u8DEF\u5F84\u89C4\u5212\u3002</p><p><b>\u5C40\u9650\uFF1A</b>300 \u6BEB\u7C73\u7403\u4F53\u53EA\u662F\u5916\u90E8\u53EF\u8FBE\u8FB9\u754C\u3002\u5173\u8282\u9650\u4F4D\u3001\u684C\u9762\u95F4\u9699\u548C\u8098\u90E8\u914D\u7F6E\u8FDB\u4E00\u6B65\u9650\u5236\u53EF\u8FBE\u4F4D\u7F6E\u3002\u8098\u90E8\u63A5\u8FD1\u4F38\u76F4\u6216\u6298\u53E0\u65F6\u4F1A\u51FA\u73B0\u5947\u5F02\u4F4D\u5F62\u3002</p><p class="guide-note">\u672C\u5E94\u7528\u662F\u8FD0\u52A8\u5B66\u6559\u5B66\u6A21\u578B\uFF1A\u901A\u8FC7\u8FDE\u6746\u7AEF\u70B9\u548C\u5C0F\u95F4\u9699\u68C0\u67E5\u684C\u9762\u78B0\u649E\uFF0C\u4E0D\u6A21\u62DF\u81EA\u8EAB\u6216\u5E95\u5EA7\u78B0\u649E\u3001\u8D1F\u8F7D\u3001\u52A8\u529B\u5B66\uFF0C\u4E5F\u4E0D\u63A7\u5236\u771F\u5B9E\u786C\u4EF6\u3002\u4E09\u8F74\u63A7\u5236\u4F4D\u7F6E\uFF0C\u4F46\u65E0\u6CD5\u72EC\u7ACB\u63A7\u5236\u5DE5\u5177\u59FF\u6001\uFF1B\u672A\u6765\u516D\u8F74\u7248\u672C\u5C06\u6269\u5C55\u6B64\u80FD\u529B\u3002</p>',ready:"\u5C31\u7EEA",moving:"\u79FB\u52A8\u4E2D",running:"\u8FD0\u884C\u4E2D",paused:"\u5DF2\u6682\u505C",welcome:"\u62D6\u52A8\u6ED1\u5757\uFF0C\u6216\u8F93\u5165\u76EE\u6807\u5750\u6807\u5F00\u59CB\u3002",recorded:"\u4F4D\u7F6E\u5DF2\u8BB0\u5F55\u3002\u7EE7\u7EED\u6DFB\u52A0\u6216\u8FD0\u884C\u7A0B\u5E8F\u3002",numbers:"\u8BF7\u8F93\u5165\u4E09\u4E2A\u6709\u6548\u5750\u6807\u3002",reach:"\u8D85\u51FA\u53EF\u8FBE\u8303\u56F4\u3002\u4E24\u6839\u8FDE\u6746\u603B\u957F\u4E3A 300 \u6BEB\u7C73\u3002",limits:"\u76EE\u6807\u8D85\u51FA\u5173\u8282\u9650\u4F4D\u6216\u4E0D\u6EE1\u8DB3\u684C\u9762\u95F4\u9699\uFF0C\u8BF7\u5C1D\u8BD5\u5176\u4ED6\u8098\u90E8\u914D\u7F6E\u3002",path:"\u6B64\u8DEF\u5F84\u4F1A\u7A7F\u8FC7\u684C\u9762\u3002\u8BF7\u6DFB\u52A0\u4E00\u4E2A\u62AC\u9AD8\u7684\u4E2D\u95F4\u4F4D\u7F6E\u3002",blocked:"\u79FB\u52A8\u88AB\u5173\u8282\u9650\u4F4D\u6216\u684C\u9762\u95F4\u9699\u9650\u5236\u3002",complete:"\u7A0B\u5E8F\u6267\u884C\u5B8C\u6210\u3002",stopped:"\u5DF2\u5728\u5F53\u524D\u4F4D\u7F6E\u505C\u6B62\u3002",loaded:"\u5DF2\u52A0\u8F7D\u4E09\u4E2A\u5DE1\u68C0\u76EE\u6807\u3002\u70B9\u51FB\u8FD0\u884C\u5F00\u59CB\u3002",imported:"\u7A0B\u5E8F\u5DF2\u5BFC\u5165\u3002",badfile:"\u65E0\u6CD5\u5BFC\u5165\u3002\u8BF7\u4F7F\u7528\u6709\u6548\u7684 JSON \u7A0B\u5E8F\uFF08\u6700\u591A 200 \u4E2A\u5B89\u5168\u4F4D\u7F6E\uFF09\u3002",storage:"\u6D4F\u89C8\u5668\u5B58\u50A8\u4E0D\u53EF\u7528\uFF0C\u8BF7\u5BFC\u51FA\u7A0B\u5E8F\u4FDD\u5B58\u3002",singular:"\u63A5\u8FD1\u5947\u5F02\u4F4D\u5F62\uFF0C\u8BF7\u5C1D\u8BD5\u5F2F\u66F2\u8098\u90E8\u3002",normal:"\u5E95\u5EA7\u65CB\u8F6C + \u80A9\u5173\u8282 + \u8098\u5173\u8282 = 3 \u81EA\u7531\u5EA6\u3002",step:"\u4F4D\u7F6E",seconds:"\u79D2",go:"\u79FB\u52A8",up:"\u4E0A\u79FB",down:"\u4E0B\u79FB",remove:"\u5220\u9664",score:"\u4E2A\u76EE\u6807\u5DF2\u5B8C\u6210",won:"\u8DEF\u7EBF\u5B8C\u6210\uFF0C\u5DF2\u5230\u8FBE\u6240\u6709\u76EE\u6807\uFF01",targetSelected:"\u76EE\u6807\u5750\u6807\u5DF2\u586B\u5165\u3002\u79FB\u52A8\u540E\u8BB0\u5F55\u8BE5\u4F4D\u7F6E\u3002",max:"\u6700\u591A 200 \u6B65\u3002\u8BF7\u5148\u5BFC\u51FA\u6B64\u7A0B\u5E8F\u3002",emptyProgram:"\u8BF7\u5148\u8BB0\u5F55\u4E00\u4E2A\u4F4D\u7F6E\u3002",noWebGL:"\u65E0\u6CD5\u542F\u52A8 3D \u56FE\u5F62\uFF0C\u8BF7\u5F00\u542F WebGL \u6216\u5C1D\u8BD5\u5176\u4ED6\u6D4F\u89C8\u5668\u3002",replaced:"\u5DF2\u66FF\u6362\u5F53\u524D\u7A0B\u5E8F\u3002",base:"\u5E95\u5EA7",shoulder:"\u80A9\u5173\u8282",elbow:"\u8098\u5173\u8282",exported:"\u7A0B\u5E8F\u5DF2\u5BFC\u51FA\u3002",noPath:"\u7A0B\u5E8F\u8DEF\u5F84\u4E0D\u5B89\u5168\u3002\u8BF7\u5728\u53D7\u963B\u6B65\u9AA4\u4E4B\u524D\u6DFB\u52A0\u62AC\u9AD8\u7684\u4E2D\u95F4\u4F4D\u7F6E\u3002"};Object.assign(Lt,{axis:"{n} JOINTS / MODULAR ARM",spec:"{n} joints \xB7 {reach} mm reach bound \xB7 Joint-interpolated motion",showTrail:"Show trail",armBuilder:"Build your arm",addJoint:"\uFF0B Add joint",removeJoint:"\u2212 Remove joint",separatePrograms:"Each arm size keeps its own program.",armInfo:"{n} joints \xB7 {reach} mm maximum reach.",nextSwivel:"Next: wrist swivel for sideways motion.",nextPitch:"Next: wrist pitch to tilt the tool.",nextRoll:"Next: tool roll to rotate its orientation.",allJoints:"Full six-joint arm: position + orientation.",swivel:"Wrist swivel",wristPitch:"Wrist pitch",toolRoll:"Tool roll",rotation:"Rotation",armChanged:"Switched to {n} joints. This arm\u2019s saved program is ready.",targetOrientation:"Target tool orientation",toolOrientation:"TOOL ORIENTATION",roll:"Roll",pitch:"Pitch",yaw:"Yaw",copyPose:"Use current pose",orientationHelp:"Optional: solve XYZ + roll, pitch, yaw together (degrees).",orientationLocked:"Add all six joints to target position and orientation together.",poseCopied:"Current XYZ and tool orientation copied to the target fields.",extraMotion:"Extra joints change how the arm reaches a point. Tool roll changes orientation, not XYZ.",reach:"Outside the arm\u2019s reach. This configuration has a {reach} mm outer reach bound.",solve:"No safe solution found. Try another orientation, a closer target, or a different starting pose.",orientationInvalid:"Orientation requires six joints and three angles between \u2212180\xB0 and 180\xB0.",replaceExample:"Replace this arm\u2019s program with the example? Export first if you want to keep it.",replaceImport:"Replace the saved program for the arm size in this file? Other arm sizes will be kept.",guidebody:'<ol><li><b>Explore:</b> move each joint and watch the live XYZ and tool orientation. Orange shows the tool\u2019s motion trail. \u201CShow trail\u201D hides or reveals it; \u201CClear trail\u201D erases it.</li><li><b>Expand:</b> add a wrist swivel (J4), wrist pitch (J5), and tool roll (J6). Each arm size has its own saved program. Changing arm size returns that arm to its home pose.</li><li><b>Teach:</b> record positions, rename and reorder steps, set durations, and run the program.</li><li><b>Target:</b> enter XYZ and move there. With six joints, optionally target roll, pitch, and yaw as well. \u201CUse current pose\u201D gives you a reachable starting target.</li><li><b>Challenge:</b> visit A \u2192 B \u2192 C, finishing each program move within 15 mm. Compare how different arm sizes perform the same task.</li></ol><p><b>Frames:</b> world Z points up. J1 rotates about world Z; J2 and J3 pitch upwards. Added joint axes move with their parent: J4 swivels about local Z, J5 pitches about local \u2212Y, and J6 rolls about local X. The tool\u2019s small colored axes and rectangular collar show its orientation.</p><p><b>Orientation:</b> roll, pitch, yaw use Rz(yaw) Ry(pitch) Rx(roll). Euler angles can wrap at \xB1180\xB0 and are ambiguous at pitch \xB190\xB0. Six joints allow position and orientation control in nonsingular reachable configurations; they do not guarantee every requested pose.</p><p><b>Motion:</b> all joints rotate together, so the tool path is usually curved. The 4\u20136 joint solver is numerical: \u201Cno solution found\u201D is not proof that a target is unreachable. Try a different starting pose. A single joint-interpolated move may cross the table even when its endpoints are valid; add raised waypoints.</p><p class="guide-note">This is a kinematic learning model. The sphere shows an outer reach bound, not the full reachable workspace. Endpoint clearance approximates table checks; self/base collision, payload, dynamics, and hardware control are not modeled.</p>'});Object.assign(Nt,{axis:"{n} \u5173\u8282 / \u6A21\u5757\u5316\u673A\u68B0\u81C2",spec:"{n} \u5173\u8282 \xB7 \u53EF\u8FBE\u5916\u8FB9\u754C {reach} \u6BEB\u7C73 \xB7 \u5173\u8282\u63D2\u503C\u8FD0\u52A8",showTrail:"\u663E\u793A\u8F68\u8FF9",armBuilder:"\u7EC4\u88C5\u673A\u68B0\u81C2",addJoint:"\uFF0B \u6DFB\u52A0\u5173\u8282",removeJoint:"\u2212 \u79FB\u9664\u5173\u8282",separatePrograms:"\u6BCF\u79CD\u5173\u8282\u6570\u91CF\u5206\u522B\u4FDD\u5B58\u81EA\u5DF1\u7684\u7A0B\u5E8F\u3002",armInfo:"{n} \u4E2A\u5173\u8282 \xB7 \u6700\u5927\u4F38\u5C55 {reach} \u6BEB\u7C73\u3002",nextSwivel:"\u4E0B\u4E00\u6B65\uFF1A\u6DFB\u52A0\u8155\u90E8\u504F\u8F6C\uFF0C\u5B9E\u73B0\u4FA7\u5411\u8FD0\u52A8\u3002",nextPitch:"\u4E0B\u4E00\u6B65\uFF1A\u6DFB\u52A0\u8155\u90E8\u4FEF\u4EF0\uFF0C\u8C03\u6574\u5DE5\u5177\u503E\u89D2\u3002",nextRoll:"\u4E0B\u4E00\u6B65\uFF1A\u6DFB\u52A0\u5DE5\u5177\u6EDA\u8F6C\uFF0C\u65CB\u8F6C\u5DE5\u5177\u59FF\u6001\u3002",allJoints:"\u5B8C\u6574\u516D\u5173\u8282\u673A\u68B0\u81C2\uFF1A\u4F4D\u7F6E + \u59FF\u6001\u3002",swivel:"\u8155\u90E8\u504F\u8F6C",wristPitch:"\u8155\u90E8\u4FEF\u4EF0",toolRoll:"\u5DE5\u5177\u6EDA\u8F6C",rotation:"\u65CB\u8F6C",armChanged:"\u5DF2\u5207\u6362\u4E3A {n} \u5173\u8282\uFF0C\u6B64\u673A\u68B0\u81C2\u7684\u5DF2\u5B58\u7A0B\u5E8F\u5DF2\u5C31\u7EEA\u3002",targetOrientation:"\u8BBE\u5B9A\u5DE5\u5177\u59FF\u6001",toolOrientation:"\u5DE5\u5177\u59FF\u6001",roll:"\u6EDA\u8F6C",pitch:"\u4FEF\u4EF0",yaw:"\u504F\u822A",copyPose:"\u4F7F\u7528\u5F53\u524D\u4F4D\u59FF",orientationHelp:"\u53EF\u9009\uFF1A\u540C\u65F6\u6C42\u89E3 XYZ \u4E0E\u6EDA\u8F6C\u3001\u4FEF\u4EF0\u3001\u504F\u822A\u89D2\uFF08\u5EA6\uFF09\u3002",orientationLocked:"\u6DFB\u52A0\u81F3\u516D\u4E2A\u5173\u8282\u540E\uFF0C\u53EF\u540C\u65F6\u8BBE\u5B9A\u4F4D\u7F6E\u4E0E\u59FF\u6001\u3002",poseCopied:"\u5DF2\u5C06\u5F53\u524D XYZ \u548C\u5DE5\u5177\u59FF\u6001\u590D\u5236\u5230\u76EE\u6807\u8F93\u5165\u6846\u3002",extraMotion:"\u66F4\u591A\u5173\u8282\u6539\u53D8\u5230\u8FBE\u76EE\u6807\u7684\u65B9\u5F0F\u3002\u5DE5\u5177\u6EDA\u8F6C\u53EA\u6539\u53D8\u59FF\u6001\uFF0C\u4E0D\u6539\u53D8 XYZ\u3002",reach:"\u8D85\u51FA\u673A\u68B0\u81C2\u53EF\u8FBE\u8303\u56F4\u3002\u5F53\u524D\u7ED3\u6784\u7684\u5916\u8FB9\u754C\u4E3A {reach} \u6BEB\u7C73\u3002",solve:"\u672A\u627E\u5230\u5B89\u5168\u89E3\u3002\u8BF7\u5C1D\u8BD5\u5176\u4ED6\u59FF\u6001\u3001\u8F83\u8FD1\u7684\u76EE\u6807\u6216\u4E0D\u540C\u7684\u8D77\u59CB\u4F4D\u59FF\u3002",orientationInvalid:"\u59FF\u6001\u6C42\u89E3\u9700\u8981\u516D\u4E2A\u5173\u8282\uFF0C\u4E09\u4E2A\u89D2\u5EA6\u987B\u5728 \u2212180\xB0 \u81F3 180\xB0 \u4E4B\u95F4\u3002",replaceExample:"\u4F7F\u7528\u793A\u4F8B\u66FF\u6362\u6B64\u673A\u68B0\u81C2\u7684\u7A0B\u5E8F\uFF1F\u5982\u9700\u4FDD\u7559\uFF0C\u8BF7\u5148\u5BFC\u51FA\u3002",replaceImport:"\u66FF\u6362\u6B64\u6587\u4EF6\u5BF9\u5E94\u5173\u8282\u6570\u91CF\u7684\u5DF2\u5B58\u7A0B\u5E8F\uFF1F\u5176\u4ED6\u673A\u68B0\u81C2\u7A0B\u5E8F\u5C06\u4FDD\u7559\u3002",guidebody:'<ol><li><b>\u63A2\u7D22\uFF1A</b>\u62D6\u52A8\u5173\u8282\uFF0C\u89C2\u5BDF XYZ \u548C\u5DE5\u5177\u59FF\u6001\u3002\u6A59\u8272\u7EBF\u8868\u793A\u5DE5\u5177\u8F68\u8FF9\uFF0C\u53EF\u663E\u793A\u3001\u9690\u85CF\u6216\u6E05\u9664\u3002</li><li><b>\u6269\u5C55\uFF1A</b>\u4F9D\u6B21\u6DFB\u52A0\u8155\u90E8\u504F\u8F6C J4\u3001\u8155\u90E8\u4FEF\u4EF0 J5 \u548C\u5DE5\u5177\u6EDA\u8F6C J6\u3002\u6BCF\u79CD\u5173\u8282\u6570\u91CF\u72EC\u7ACB\u4FDD\u5B58\u7A0B\u5E8F\uFF0C\u5207\u6362\u65F6\u56DE\u5230\u521D\u59CB\u4F4D\u59FF\u3002</li><li><b>\u793A\u6559\uFF1A</b>\u8BB0\u5F55\u4F4D\u7F6E\uFF0C\u91CD\u547D\u540D\u548C\u6392\u5E8F\u6B65\u9AA4\uFF0C\u8BBE\u7F6E\u65F6\u957F\u5E76\u8FD0\u884C\u3002</li><li><b>\u5B9A\u4F4D\uFF1A</b>\u8F93\u5165 XYZ\u3002\u516D\u5173\u8282\u6A21\u5F0F\u8FD8\u53EF\u6307\u5B9A\u6EDA\u8F6C\u3001\u4FEF\u4EF0\u548C\u504F\u822A\u3002\u4F7F\u7528\u5F53\u524D\u4F4D\u59FF\u53EF\u83B7\u5F97\u53EF\u8FBE\u7684\u8D77\u59CB\u76EE\u6807\u3002</li><li><b>\u6311\u6218\uFF1A</b>\u4F9D\u6B21\u5230\u8FBE A \u2192 B \u2192 C\uFF0C\u6BCF\u6B65\u7EC8\u70B9\u8DDD\u76EE\u6807\u4E0D\u8D85\u8FC7 15 \u6BEB\u7C73\u3002\u6BD4\u8F83\u4E0D\u540C\u5173\u8282\u6570\u91CF\u7684\u52A8\u4F5C\u3002</li></ol><p><b>\u5750\u6807\u7CFB\uFF1A</b>\u4E16\u754C Z \u5411\u4E0A\u3002J1 \u7ED5\u4E16\u754C Z \u65CB\u8F6C\uFF0CJ2\u3001J3 \u5411\u4E0A\u4FEF\u4EF0\u3002\u65B0\u589E\u8F74\u968F\u7236\u5173\u8282\u8F6C\u52A8\uFF1AJ4 \u7ED5\u5C40\u90E8 Z\uFF0CJ5 \u7ED5\u5C40\u90E8 \u2212Y\uFF0CJ6 \u7ED5\u5C40\u90E8 X\u3002\u5DE5\u5177\u7AEF\u7684\u5F69\u8272\u8F74\u548C\u77E9\u5F62\u5957\u73AF\u663E\u793A\u59FF\u6001\u3002</p><p><b>\u59FF\u6001\uFF1A</b>\u91C7\u7528 Rz(\u504F\u822A) Ry(\u4FEF\u4EF0) Rx(\u6EDA\u8F6C)\u3002\u6B27\u62C9\u89D2\u53EF\u5728 \xB1180\xB0 \u8DF3\u53D8\uFF0C\u5728\u4FEF\u4EF0 \xB190\xB0 \u65F6\u4E0D\u552F\u4E00\u3002\u516D\u5173\u8282\u53EF\u5728\u975E\u5947\u5F02\u53EF\u8FBE\u533A\u57DF\u63A7\u5236\u4F4D\u7F6E\u4E0E\u59FF\u6001\uFF0C\u4F46\u5E76\u975E\u6240\u6709\u76EE\u6807\u90FD\u53EF\u8FBE\u3002</p><p><b>\u8FD0\u52A8\uFF1A</b>\u5173\u8282\u540C\u6B65\u8F6C\u52A8\uFF0C\u5DE5\u5177\u901A\u5E38\u8D70\u66F2\u7EBF\u30024\u20136 \u5173\u8282\u4F7F\u7528\u6570\u503C\u6C42\u89E3\uFF0C\u672A\u627E\u5230\u89E3\u4E0D\u4EE3\u8868\u76EE\u6807\u7EDD\u5BF9\u4E0D\u53EF\u8FBE\u3002\u53EF\u5C1D\u8BD5\u6539\u53D8\u8D77\u59CB\u4F4D\u59FF\uFF1B\u82E5\u8DEF\u5F84\u7A7F\u8FC7\u684C\u9762\uFF0C\u53EF\u6DFB\u52A0\u62AC\u9AD8\u7684\u4E2D\u95F4\u4F4D\u7F6E\u3002</p><p class="guide-note">\u8FD0\u52A8\u5B66\u6559\u5B66\u6A21\u578B\uFF1A\u7403\u4F53\u53EA\u662F\u53EF\u8FBE\u5916\u8FB9\u754C\u3002\u684C\u9762\u68C0\u67E5\u91C7\u7528\u7AEF\u70B9\u95F4\u9699\u8FD1\u4F3C\uFF0C\u4E0D\u6A21\u62DF\u81EA\u8EAB\u6216\u5E95\u5EA7\u78B0\u649E\u3001\u8D1F\u8F7D\u3001\u52A8\u529B\u5B66\uFF0C\u4E5F\u4E0D\u63A7\u5236\u786C\u4EF6\u3002</p>'});Object.assign(Lt,{workspace:"LIVE WORKSPACE",title:"Pick. Lift. Place.",toolStation:"01 / TOOL & I/O",buildStation:"02 / BUILD THE ARM",endEffector:"End effector",gripper:"\u2161  Parallel gripper",vacuum:"\u25C9  Vacuum cup",magnet:"\u2229  Magnetic gripper",outputSignal:"Tool command",inputSignal:"Object held",activate:"ON \xB7 Activate",release:"OFF \xB7 Release",useSix:"Use 6 joints",separatePrograms:"Each tool + arm size keeps its own program.",runReset:"Run resets the arm and objects, then executes your steps.",signalValue:"Signal value",addOutput:"\uFF0B Set DO1",addWait:"\uFF0B Wait DI1",addDelay:"\uFF0B Delay",setOutput:"Set tool output",waitInput:"Wait for object sensor",delay:"Delay",timeout:"Timeout",instructionAdded:"Instruction added. Set its value and duration in the sequence.",empty:"Record a move. Add tool commands.<br>Confirm pickup with a Wait DI1 step.",resetTask:"Reset scene",gripperTask:"Block transfer",vacuumTask:"Fragile tile transfer",magnetTask:"Steel recovery",gripperMission:"Deliver both wooden blocks to their matching pads. B starts on a 60 mm pedestal: lift clear before travelling.",vacuumMission:"Move both smooth tiles to their matching pads. B is on a 75 mm pedestal. Keep the suction cup aligned with the top surface.",magnetMission:"Recover two steel pucks onto their matching pads. B is raised 90 mm above the table. Align the magnetic face and clear the pedestal.",gripperDescription:"DO1 closes / opens the jaws. DI1 turns on only after a block is actually grasped.",vacuumDescription:"DO1 switches suction on / off. A smooth surface and an approach within 85\xB0 of vertical are required. Six joints recommended.",magnetDescription:"DO1 engages / releases the magnet. Steel and alignment within 85\xB0 of vertical are required. Six joints recommended.",taskRules:"Pick within 25 mm of the top-center contact. Carry clear of the pedestal. Release within 8 mm of the surface, with the whole object inside its matching pad.",taskReady:"Two objects. Two destinations. Plan your approach, pickup, lift, and release.",taskWon:"Challenge complete \u2014 both objects placed correctly!",delivered:"Delivered \u2713",held:"Held \xB7 DI1 ON",raisedItem:"On pedestal",tableItem:"On table",pickup:"Pick",destination:"Place",approach:"Approach",coordinatesFilled:"Target fields filled. Approach from above and record the moves you need.",grasped:"Object held \u2014 DI1 is ON. Lift before travelling.",placed:"Object placed gently inside its matching target.",outsideTarget:"Released outside the matching pad or at an unsuitable angle. Reposition and try again.",dropped:"Dropped from too high. It does not count: pick up and place gently.",noContact:"Tool ON, but nothing held. Move within 25 mm of the object\u2019s top center; the active tool will pick it up automatically.",releasedEmpty:"Tool released. DI1 is OFF.",wrongMaterial:"This material is incompatible with the selected tool.",alignment:"Tool face is tilted too far. Point the working face generally down toward the object (within 85\xB0 of vertical).",tooWide:"Object exceeds the gripper opening.",obstacle:"Movement blocked: the arm would strike the pedestal. Raise or reroute the arm.",payloadCollision:"Movement blocked: the carried object would hit the table, pedestal, or another object.",waitTimeout:"Wait timed out: DI1 did not reach the requested state. Check tool contact and the ON instruction.",sixForExample:"This example needs six joints for level contact. Choose \u201CUse 6 joints\u201D on the right.",loadedTask:"Pick-and-place example loaded. Run it, then modify its moves and I/O steps.",replaceImport:"Replace the saved program for this tool and arm size? Other programs will be kept.",complete:"Program complete. Check the task: both objects must be released inside their matching pads."});Object.assign(Nt,{workspace:"\u5B9E\u65F6\u5DE5\u4F5C\u7A7A\u95F4",title:"\u6293\u53D6 \xB7 \u62AC\u5347 \xB7 \u653E\u7F6E",toolStation:"01 / \u5DE5\u5177\u4E0E I/O",buildStation:"02 / \u7EC4\u88C5\u673A\u68B0\u81C2",endEffector:"\u672B\u7AEF\u6267\u884C\u5668",gripper:"\u2161  \u5E73\u884C\u5939\u722A",vacuum:"\u25C9  \u771F\u7A7A\u5438\u76D8",magnet:"\u2229  \u78C1\u529B\u5939\u5177",outputSignal:"\u5DE5\u5177\u6307\u4EE4",inputSignal:"\u5DF2\u6293\u4F4F\u7269\u4F53",activate:"ON \xB7 \u542F\u52A8",release:"OFF \xB7 \u91CA\u653E",useSix:"\u4F7F\u7528\u516D\u5173\u8282",separatePrograms:"\u6BCF\u79CD\u5DE5\u5177\u4E0E\u5173\u8282\u6570\u91CF\u7EC4\u5408\u5206\u522B\u4FDD\u5B58\u7A0B\u5E8F\u3002",runReset:"\u8FD0\u884C\u65F6\u91CD\u7F6E\u673A\u68B0\u81C2\u548C\u7269\u4F53\uFF0C\u518D\u6267\u884C\u7A0B\u5E8F\u3002",signalValue:"\u4FE1\u53F7\u503C",addOutput:"\uFF0B \u8BBE\u7F6E DO1",addWait:"\uFF0B \u7B49\u5F85 DI1",addDelay:"\uFF0B \u5EF6\u65F6",setOutput:"\u8BBE\u7F6E\u5DE5\u5177\u8F93\u51FA",waitInput:"\u7B49\u5F85\u7269\u4F53\u4F20\u611F\u5668",delay:"\u5EF6\u65F6",timeout:"\u8D85\u65F6",instructionAdded:"\u5DF2\u6DFB\u52A0\u6307\u4EE4\u3002\u53EF\u5728\u7A0B\u5E8F\u4E2D\u8C03\u6574\u4FE1\u53F7\u503C\u548C\u65F6\u957F\u3002",empty:"\u8BB0\u5F55\u79FB\u52A8\uFF0C\u6DFB\u52A0\u5DE5\u5177\u6307\u4EE4\u3002<br>\u901A\u8FC7\u7B49\u5F85 DI1 \u786E\u8BA4\u6293\u53D6\u6210\u529F\u3002",resetTask:"\u91CD\u7F6E\u573A\u666F",gripperTask:"\u79EF\u6728\u642C\u8FD0",vacuumTask:"\u6613\u788E\u8584\u7247\u642C\u8FD0",magnetTask:"\u94A2\u4EF6\u56DE\u6536",gripperMission:"\u5C06\u4E24\u5757\u6728\u5757\u653E\u5165\u5BF9\u5E94\u533A\u57DF\u3002B \u4F4D\u4E8E 60 \u6BEB\u7C73\u9AD8\u53F0\u4E0A\uFF0C\u6A2A\u5411\u79FB\u52A8\u524D\u5148\u62AC\u5347\u3002",vacuumMission:"\u5C06\u4E24\u5757\u5149\u6ED1\u8584\u7247\u79FB\u81F3\u5BF9\u5E94\u533A\u57DF\u3002B \u4F4D\u4E8E 75 \u6BEB\u7C73\u9AD8\u53F0\u4E0A\uFF0C\u5438\u76D8\u987B\u5BF9\u51C6\u7269\u4F53\u9876\u9762\u3002",magnetMission:"\u5C06\u4E24\u4E2A\u94A2\u4EF6\u653E\u5165\u5BF9\u5E94\u533A\u57DF\u3002B \u9AD8\u4E8E\u684C\u9762 90 \u6BEB\u7C73\uFF0C\u4FDD\u6301\u78C1\u9762\u5E73\u6B63\u5E76\u907F\u5F00\u9AD8\u53F0\u3002",gripperDescription:"DO1 \u63A7\u5236\u5939\u722A\u95ED\u5408\u4E0E\u5F20\u5F00\u3002\u53EA\u6709\u5B9E\u9645\u6293\u4F4F\u6728\u5757\uFF0CDI1 \u624D\u53D8\u4E3A ON\u3002",vacuumDescription:"DO1 \u63A7\u5236\u5438\u9644\u4E0E\u91CA\u653E\u3002\u9700\u8981\u5149\u6ED1\u8868\u9762\uFF0C\u5DE5\u5177\u4E0E\u7AD6\u76F4\u65B9\u5411\u5939\u89D2\u4E0D\u8D85\u8FC7 85\xB0\u3002\u5EFA\u8BAE\u4F7F\u7528\u516D\u5173\u8282\u3002",magnetDescription:"DO1 \u63A7\u5236\u78C1\u529B\u5438\u5408\u4E0E\u91CA\u653E\u3002\u4EC5\u9002\u7528\u4E8E\u94A2\u4EF6\uFF0C\u5BF9\u9F50\u89D2\u5EA6\u4E0D\u8D85\u8FC7 85\xB0\u3002\u5EFA\u8BAE\u4F7F\u7528\u516D\u5173\u8282\u3002",taskRules:"\u5DE5\u5177\u987B\u8DDD\u9876\u9762\u4E2D\u5FC3 25 \u6BEB\u7C73\u4EE5\u5185\u3002\u642C\u8FD0\u65F6\u907F\u5F00\u9AD8\u53F0\uFF0C\u5728\u652F\u6491\u9762\u4E0A\u65B9 8 \u6BEB\u7C73\u4EE5\u5185\u8F7B\u653E\uFF0C\u7269\u4F53\u987B\u5B8C\u5168\u4F4D\u4E8E\u5BF9\u5E94\u533A\u57DF\u5185\u3002",taskReady:"\u4E24\u4E2A\u7269\u4F53\uFF0C\u4E24\u4E2A\u76EE\u6807\u3002\u89C4\u5212\u63A5\u8FD1\u3001\u6293\u53D6\u3001\u62AC\u5347\u548C\u91CA\u653E\u3002",taskWon:"\u6311\u6218\u5B8C\u6210\uFF1A\u4E24\u4E2A\u7269\u4F53\u5747\u5DF2\u6B63\u786E\u653E\u7F6E\uFF01",delivered:"\u5DF2\u9001\u8FBE \u2713",held:"\u5DF2\u6293\u4F4F \xB7 DI1 ON",raisedItem:"\u4F4D\u4E8E\u9AD8\u53F0",tableItem:"\u4F4D\u4E8E\u684C\u9762",pickup:"\u6293\u53D6",destination:"\u653E\u7F6E",approach:"\u63A5\u8FD1",coordinatesFilled:"\u5DF2\u586B\u5165\u76EE\u6807\u5750\u6807\u3002\u8BF7\u4ECE\u4E0A\u65B9\u63A5\u8FD1\u5E76\u8BB0\u5F55\u6240\u9700\u52A8\u4F5C\u3002",grasped:"\u5DF2\u6293\u4F4F\u7269\u4F53\uFF0CDI1 \u4E3A ON\u3002\u8BF7\u5148\u62AC\u5347\u518D\u6A2A\u5411\u79FB\u52A8\u3002",placed:"\u7269\u4F53\u5DF2\u8F7B\u653E\u5728\u5BF9\u5E94\u76EE\u6807\u533A\u57DF\u5185\u3002",outsideTarget:"\u7269\u4F53\u672A\u4F4D\u4E8E\u5BF9\u5E94\u533A\u57DF\u5185\uFF0C\u6216\u89D2\u5EA6\u4E0D\u5408\u9002\u3002\u8BF7\u91CD\u65B0\u6293\u53D6\u8C03\u6574\u3002",dropped:"\u91CA\u653E\u9AD8\u5EA6\u8FC7\u9AD8\uFF0C\u4E0D\u8BA1\u4E3A\u5B8C\u6210\u3002\u8BF7\u91CD\u65B0\u6293\u53D6\u5E76\u8F7B\u653E\u3002",noContact:"\u5DE5\u5177\u5DF2\u5F00\u542F\uFF0C\u4F46\u672A\u6293\u4F4F\u7269\u4F53\u3002\u8BF7\u79FB\u52A8\u5230\u7269\u4F53\u9876\u9762\u4E2D\u5FC3 25 \u6BEB\u7C73\u5185\uFF0C\u5F00\u542F\u7684\u5DE5\u5177\u4F1A\u81EA\u52A8\u6293\u53D6\u3002",releasedEmpty:"\u5DE5\u5177\u5DF2\u91CA\u653E\uFF0CDI1 \u4E3A OFF\u3002",wrongMaterial:"\u7269\u4F53\u6750\u8D28\u4E0D\u9002\u7528\u4E8E\u5F53\u524D\u5DE5\u5177\u3002",alignment:"\u5DE5\u5177\u503E\u89D2\u8FC7\u5927\u3002\u8BF7\u5C06\u5DE5\u4F5C\u9762\u5927\u81F4\u671D\u4E0B\uFF0C\u504F\u79BB\u7AD6\u76F4\u65B9\u5411\u4E0D\u8D85\u8FC7 85\xB0\u3002",tooWide:"\u7269\u4F53\u5BBD\u5EA6\u8D85\u8FC7\u5939\u722A\u5F00\u53E3\u3002",obstacle:"\u8DEF\u5F84\u88AB\u963B\u6B62\uFF1A\u673A\u68B0\u81C2\u4F1A\u649E\u5230\u9AD8\u53F0\u3002\u8BF7\u62AC\u9AD8\u6216\u7ED5\u884C\u3002",payloadCollision:"\u8DEF\u5F84\u88AB\u963B\u6B62\uFF1A\u6240\u643A\u7269\u4F53\u4F1A\u649E\u5230\u684C\u9762\u3001\u9AD8\u53F0\u6216\u5176\u4ED6\u7269\u4F53\u3002",waitTimeout:"\u7B49\u5F85\u8D85\u65F6\uFF1ADI1 \u672A\u8FBE\u5230\u6307\u5B9A\u72B6\u6001\u3002\u8BF7\u68C0\u67E5\u5DE5\u5177\u63A5\u89E6\u4E0E ON \u6307\u4EE4\u3002",sixForExample:"\u6B64\u793A\u4F8B\u9700\u8981\u516D\u5173\u8282\u4FDD\u6301\u5E73\u6B63\u63A5\u89E6\u3002\u8BF7\u70B9\u51FB\u53F3\u4FA7\u201C\u4F7F\u7528\u516D\u5173\u8282\u201D\u3002",loadedTask:"\u5DF2\u52A0\u8F7D\u642C\u8FD0\u793A\u4F8B\u3002\u8FD0\u884C\u540E\uFF0C\u53EF\u4FEE\u6539\u52A8\u4F5C\u4E0E I/O \u6307\u4EE4\u3002",replaceImport:"\u66FF\u6362\u6B64\u5DE5\u5177\u53CA\u5173\u8282\u6570\u91CF\u5BF9\u5E94\u7684\u5DF2\u5B58\u7A0B\u5E8F\uFF1F\u5176\u4ED6\u7A0B\u5E8F\u5C06\u4FDD\u7559\u3002",complete:"\u7A0B\u5E8F\u5B8C\u6210\u3002\u8BF7\u68C0\u67E5\u4E24\u4E2A\u7269\u4F53\u662F\u5426\u5747\u91CA\u653E\u5728\u5BF9\u5E94\u533A\u57DF\u5185\u3002"});Lt.guidebody="<ol><li><b>Choose a tool:</b> gripper, suction cup, or magnet. Each has two objects, matching target pads, and a raised pedestal. The gripper task works with three joints; six joints make the other tools easier to align.</li><li><b>Plan the route:</b> click Approach, Pick, or Place in the challenge to fill XYZ fields. These buttons do not move the arm. Use a raised travel position before moving sideways.</li><li><b>Teach movement:</b> move with joint sliders or XYZ, then record the pose. Controls are on the left; arm building and program steps are on the right.</li><li><b>Program the tool:</b> add DO1 ON to grip, Wait DI1 ON to confirm pickup, and DO1 OFF to release. Wait instructions stop the program on timeout. Delay adds a pause. Set the signal value before adding an instruction, or edit it in the sequence.</li><li><b>Place carefully:</b> the full object must fit its matching pad. Release no more than 8 mm above the surface. A drop does not count. Reset scene restores the objects; Run resets them automatically for repeatable programs.</li></ol><p><b>Commands versus feedback:</b> DO1 is a request; DI1 means an object is held. Closing an empty gripper or missing the suction surface leaves DI1 OFF. An active tool keeps trying as you move into the pickup zone. Stop keeps the current tool state and held object.</p><p><b>Frames and tools:</b> XYZ is the working point, 40 mm outward from the wrist flange. Align it with the object\u2019s top center. The tool mounts at its rear; its working face points outward along local \u2212Z. Vacuum and magnet require a face within 85\xB0 of vertical. In six-joint mode, roll 0\xB0, pitch 0\xB0, and a yaw facing the target give a useful starting pose. Grasped objects follow the tool as rigid bodies.</p><p><b>Limits:</b> joints interpolate together, so the path curves. Pedestal checks use inflated link segments; held objects use conservative world-aligned bounding boxes. Gripper contact and material/seal sensors are simplified. Objects settle immediately on release; falling dynamics, contact forces, arm self-collision and base collision are not modeled. This is a teaching simulator, not a hardware controller.</p><p><b>Programs:</b> each tool/arm combination has its own saved sequence. Switching configurations resets the scene but preserves other sequences. Export files include the tool, joint count, and typed instructions. Earlier motion-only programs remain importable.</p>";Nt.guidebody="<ol><li><b>\u9009\u62E9\u5DE5\u5177\uFF1A</b>\u5939\u722A\u3001\u5438\u76D8\u6216\u78C1\u529B\u5939\u5177\u3002\u6BCF\u9879\u6311\u6218\u90FD\u6709\u4E24\u4E2A\u7269\u4F53\u3001\u5BF9\u5E94\u76EE\u6807\u533A\u548C\u4E00\u4E2A\u9AD8\u53F0\u3002\u5939\u722A\u6311\u6218\u53EF\u7528\u4E09\u5173\u8282\uFF0C\u5176\u4F59\u5DE5\u5177\u5EFA\u8BAE\u4F7F\u7528\u516D\u5173\u8282\u5BF9\u9F50\u3002</li><li><b>\u89C4\u5212\u8DEF\u5F84\uFF1A</b>\u70B9\u51FB\u201C\u63A5\u8FD1\u3001\u6293\u53D6\u3001\u653E\u7F6E\u201D\u586B\u5165\u5750\u6807\uFF0C\u4E0D\u4F1A\u81EA\u52A8\u79FB\u52A8\u3002\u6A2A\u5411\u642C\u8FD0\u524D\u5148\u62AC\u5347\u3002</li><li><b>\u793A\u6559\uFF1A</b>\u5DE6\u4FA7\u7528\u6ED1\u5757\u6216 XYZ \u79FB\u52A8\u5E76\u8BB0\u5F55\u3002\u53F3\u4FA7\u7EC4\u88C5\u673A\u68B0\u81C2\u4E0E\u7F16\u6392\u6B65\u9AA4\u3002</li><li><b>\u5DE5\u5177\u7F16\u7A0B\uFF1A</b>\u6DFB\u52A0 DO1 ON \u6293\u53D6\u3001\u7B49\u5F85 DI1 ON \u786E\u8BA4\u3001DO1 OFF \u91CA\u653E\u3002\u7B49\u5F85\u8D85\u65F6\u4F1A\u505C\u6B62\u7A0B\u5E8F\u3002\u5EF6\u65F6\u53EF\u63D2\u5165\u505C\u987F\u3002</li><li><b>\u8F7B\u653E\uFF1A</b>\u7269\u4F53\u987B\u5B8C\u5168\u843D\u5728\u5BF9\u5E94\u533A\u57DF\uFF0C\u5728\u652F\u6491\u9762\u4E0A\u65B9 8 \u6BEB\u7C73\u4EE5\u5185\u91CA\u653E\u3002\u9AD8\u5904\u6389\u843D\u4E0D\u8BA1\u5206\u3002\u6BCF\u6B21\u8FD0\u884C\u90FD\u4F1A\u5148\u91CD\u7F6E\u573A\u666F\u3002</li></ol><p><b>\u6307\u4EE4\u4E0E\u53CD\u9988\uFF1A</b>DO1 \u662F\u8BF7\u6C42\uFF0CDI1 \u8868\u793A\u5B9E\u9645\u6293\u4F4F\u7269\u4F53\u3002\u7A7A\u5939\u722A\u95ED\u5408\u6216\u5438\u76D8\u672A\u8D34\u5408\uFF0CDI1 \u4ECD\u4E3A OFF\u3002\u5DE5\u5177\u5F00\u542F\u65F6\u4F1A\u6301\u7EED\u68C0\u6D4B\uFF0C\u79FB\u5165\u6293\u53D6\u8303\u56F4\u5373\u53EF\u3002\u505C\u6B62\u65F6\u4FDD\u6301\u5F53\u524D\u5DE5\u5177\u72B6\u6001\u4E0E\u6240\u6301\u7269\u4F53\u3002</p><p><b>\u5DE5\u5177\u5750\u6807\uFF1A</b>XYZ \u4E3A\u8155\u90E8\u6CD5\u5170\u5411\u5916\u5EF6\u4F38 40 \u6BEB\u7C73\u5904\u7684\u5DE5\u5177\u5DE5\u4F5C\u70B9\uFF0C\u8BF7\u5C06\u5B83\u5BF9\u51C6\u7269\u4F53\u9876\u9762\u4E2D\u5FC3\u3002\u5DE5\u5177\u540E\u7AEF\u5B89\u88C5\u4E8E\u6CD5\u5170\uFF0C\u5DE5\u4F5C\u9762\u6CBF\u5C40\u90E8 \u2212Z \u671D\u5916\u3002\u5438\u76D8\u548C\u78C1\u9762\u4E0E\u7AD6\u76F4\u65B9\u5411\u7684\u5939\u89D2\u987B\u5C0F\u4E8E 85\xB0\u3002\u516D\u5173\u8282\u53EF\u5148\u8BBE\u6EDA\u8F6C 0\xB0\u3001\u4FEF\u4EF0 0\xB0\u3001\u504F\u822A\u671D\u5411\u76EE\u6807\u3002\u88AB\u6293\u4F4F\u7684\u7269\u4F53\u968F\u5DE5\u5177\u521A\u6027\u8FD0\u52A8\u3002</p><p><b>\u6A21\u578B\u9650\u5236\uFF1A</b>\u5173\u8282\u540C\u6B65\u63D2\u503C\uFF0C\u8F68\u8FF9\u901A\u5E38\u662F\u66F2\u7EBF\u3002\u8FDE\u6746\u4F7F\u7528\u81A8\u80C0\u7EBF\u6BB5\u68C0\u67E5\u9AD8\u53F0\u78B0\u649E\uFF1B\u6240\u6301\u7269\u4F53\u4F7F\u7528\u4FDD\u5B88\u7684\u4E16\u754C\u5750\u6807\u5305\u56F4\u76D2\u3002\u5939\u6301\u63A5\u89E6\u548C\u6750\u8D28\u4F20\u611F\u5668\u7ECF\u8FC7\u7B80\u5316\u3002\u91CA\u653E\u540E\u7ACB\u5373\u843D\u5230\u652F\u6491\u9762\uFF0C\u4E0D\u6A21\u62DF\u6389\u843D\u52A8\u529B\u5B66\u3001\u63A5\u89E6\u529B\u3001\u81EA\u8EAB\u6216\u5E95\u5EA7\u78B0\u649E\uFF0C\u4E5F\u4E0D\u63A7\u5236\u771F\u5B9E\u786C\u4EF6\u3002</p><p><b>\u7A0B\u5E8F\uFF1A</b>\u5404\u5DE5\u5177\u4E0E\u5173\u8282\u6570\u91CF\u5206\u522B\u4FDD\u5B58\u3002\u5207\u6362\u4F1A\u91CD\u7F6E\u573A\u666F\uFF0C\u4F46\u4E0D\u5220\u9664\u5176\u4ED6\u7A0B\u5E8F\u3002\u5BFC\u51FA\u6587\u4EF6\u5305\u542B\u5DE5\u5177\u3001\u5173\u8282\u6570\u91CF\u548C\u6307\u4EE4\u7C7B\u578B\uFF0C\u4E5F\u53EF\u5BFC\u5165\u65E7\u7248\u7EAF\u79FB\u52A8\u7A0B\u5E8F\u3002</p>";Lt.toolChanged="Tool and challenge changed. Objects reset; this tool\u2019s saved program is ready.";Nt.toolChanged="\u5DF2\u5207\u6362\u5DE5\u5177\u4E0E\u6311\u6218\u3002\u7269\u4F53\u5DF2\u91CD\u7F6E\uFF0C\u5F53\u524D\u5DE5\u5177\u7684\u5DF2\u5B58\u7A0B\u5E8F\u5DF2\u5C31\u7EEA\u3002";Lt.toolHelp="Tool requirements";Nt.toolHelp="\u5DE5\u5177\u4F7F\u7528\u8981\u6C42";Lt.gripperDescription="Training assist: approach within 25 mm of the top center. DO1 ON keeps trying to grip; DI1 confirms pickup.";Nt.gripperDescription="\u6559\u5B66\u8F85\u52A9\uFF1A\u63A5\u8FD1\u9876\u9762\u4E2D\u5FC3 25 \u6BEB\u7C73\u5185\u3002DO1 \u5F00\u542F\u540E\u6301\u7EED\u5C1D\u8BD5\u6293\u53D6\uFF0CDI1 \u786E\u8BA4\u6293\u53D6\u3002";Lt.taskRules="Training assist ON: pickup within 25 mm of the top center; nearby objects seat onto the tool. DO1 ON keeps trying as you move. Lift clear, then release within 8 mm of the matching pad.";Nt.taskRules="\u6559\u5B66\u8F85\u52A9\u5DF2\u5F00\u542F\uFF1A\u8DDD\u9876\u9762\u4E2D\u5FC3 25 \u6BEB\u7C73\u5185\u53EF\u6293\u53D6\uFF0C\u7269\u4F53\u4F1A\u8F7B\u5FAE\u5438\u9644\u5230\u5DE5\u5177\u4F4D\u7F6E\u3002DO1 \u5F00\u542F\u540E\u79FB\u52A8\u65F6\u6301\u7EED\u68C0\u6D4B\u3002\u5148\u62AC\u5347\u907F\u969C\uFF0C\u518D\u5728\u5BF9\u5E94\u533A\u57DF\u4E0A\u65B9 8 \u6BEB\u7C73\u5185\u91CA\u653E\u3002";Lt.commands="Commands";Nt.commands="\u6307\u4EE4";Lt.commandsHint="Add steps to your movement program.";Nt.commandsHint="\u5C06\u52A8\u4F5C\u3001\u4FE1\u53F7\u548C\u7B49\u5F85\u6DFB\u52A0\u5230\u7A0B\u5E8F\u3002";Object.assign(Lt,{movementControl:"Movement control",modeSliders:"Sliders",modeXYZ:"XYZ",modeJog:"Buttons",jogTitle:"Jog the tool",jogHelp:"One click = one step in world coordinates.",linearStep:"Move step",angularStep:"Rotate step",jogLocked:"Add joints with + to reach six axes for Rx, Ry and Rz rotation at a fixed XYZ.",jogOrientation:"XYZ keeps tool orientation. Rx / Ry / Rz adjust roll / pitch / yaw at the current XYZ."});Object.assign(Nt,{movementControl:"\u79FB\u52A8\u63A7\u5236",modeSliders:"\u6ED1\u5757",modeXYZ:"XYZ \u5750\u6807",modeJog:"\u6309\u94AE",jogTitle:"\u70B9\u52A8\u5DE5\u5177",jogHelp:"\u6BCF\u6B21\u70B9\u51FB\u6309\u4E16\u754C\u5750\u6807\u79FB\u52A8\u4E00\u6B65\u3002",linearStep:"\u79FB\u52A8\u6B65\u957F",angularStep:"\u65CB\u8F6C\u6B65\u957F",jogLocked:"\u4F7F\u7528 + \u6DFB\u52A0\u81F3\u516D\u4E2A\u5173\u8282\uFF0C\u5373\u53EF\u5728\u56FA\u5B9A XYZ \u4F4D\u7F6E\u8C03\u6574 Rx\u3001Ry\u3001Rz\u3002",jogOrientation:"XYZ \u4FDD\u6301\u5DE5\u5177\u59FF\u6001\uFF1BRx / Ry / Rz \u5728\u5F53\u524D\u4F4D\u7F6E\u8C03\u6574\u6EDA\u8F6C / \u4FEF\u4EF0 / \u504F\u822A\u3002"});Lt.sixForExample="This example needs six joints. Add joints with + in Build your arm.";Nt.sixForExample="\u6B64\u793A\u4F8B\u9700\u8981\u516D\u5173\u8282\uFF0C\u8BF7\u5728\u7EC4\u88C5\u673A\u68B0\u81C2\u4E2D\u4F7F\u7528 + \u6DFB\u52A0\u5173\u8282\u3002";Lt.controlsPanel="Controls";Lt.programPanel="Build & program";Nt.controlsPanel="\u79FB\u52A8\u63A7\u5236";Nt.programPanel="\u7EC4\u88C5\u4E0E\u7A0B\u5E8F";Lt.programPanel="Program";Nt.programPanel="\u52A8\u4F5C\u7A0B\u5E8F";Lt.liveToolControl="Tool I/O";Nt.liveToolControl="\u5DE5\u5177 I/O";Lt.robotStatus="ROBOT STATUS";Nt.robotStatus="\u673A\u68B0\u81C2\u72B6\u6001";function xc(i,e="start"){let t=i.toLowerCase();return/collis|obstacle|crash|clearance|碰撞|障碍|撞|间隙/.test(t)?"collision":/program|record|sequence|程序|编程|记录|顺序/.test(t)?"program":/pick|grip|release|抓|拾|释放/.test(t)?"pickup":/mov|xyz|jog|slider|移动|点动|滑块/.test(t)?"move":/next|again|explain|step|下一|再|解释|步骤/.test(t)?e:"start"}function za(i,e={}){let t=e.language==="zh",n=(l,c)=>t?c:l;if(e.learning?.unlocked===!1&&e.learning.instruction)return{message:e.learning.instruction,highlight:e.learning.allowedControls?.[0]||"open-lesson"};if(e.learning?.unlocked===!1)return{message:n(`Start here:
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
`+o.map((l,c)=>`${c+1}. ${l}`).join(`

`),highlight:a}}var K_=new Set(["noContact","wrongMaterial","alignment","tooWide","outsideTarget","dropped"]),zu=(i,e=!1)=>e||K_.has(i);function Hu(i=()=>Date.now(),e=3e4){let t=new Map;return n=>{let s=i();return t.has(n)&&s-t.get(n)<e?!1:(t.set(n,s),!0)}}function Vu(i,e=!1){let n={noContact:["The tool is ON, but no object is held. Move its working point near the object\u2019s top center and watch DI1. ON can remain active while approaching.","\u5DE5\u5177\u5DF2\u542F\u52A8\uFF0C\u4F46\u6CA1\u6709\u6293\u4F4F\u7269\u4F53\u3002\u5C06\u5DE5\u4F5C\u70B9\u79FB\u5230\u7269\u4F53\u9876\u90E8\u4E2D\u5FC3\u9644\u8FD1\u5E76\u89C2\u5BDF DI1\u3002\u63A5\u8FD1\u65F6\u53EF\u4EE5\u4FDD\u6301 ON\u3002","di-state"],alignment:["The tool is near the object, but its approach angle is unsuitable. Aim its working face downward; six joints give more orientation control.","\u5DE5\u5177\u5DF2\u9760\u8FD1\u7269\u4F53\uFF0C\u4F46\u63A5\u8FD1\u89D2\u5EA6\u4E0D\u5408\u9002\u3002\u5C06\u5DE5\u4F5C\u9762\u671D\u4E0B\uFF1B\u516D\u5173\u8282\u80FD\u63D0\u4F9B\u66F4\u591A\u59FF\u6001\u63A7\u5236\u3002","target-form"],wrongMaterial:["Check the selected tool: the magnet needs steel and the vacuum cup needs a smooth surface.","\u68C0\u67E5\u6240\u9009\u5DE5\u5177\uFF1A\u78C1\u94C1\u9700\u8981\u94A2\u6750\uFF0C\u5438\u76D8\u9700\u8981\u5149\u6ED1\u8868\u9762\u3002","tool-select"],tooWide:["The object does not fit the gripper\u2019s projected opening. Try a different tool orientation; the grasp capacity is 42 mm.","\u7269\u4F53\u8D85\u51FA\u5939\u722A\u7684\u6295\u5F71\u5F00\u53E3\u3002\u5C1D\u8BD5\u8C03\u6574\u5DE5\u5177\u59FF\u6001\uFF1B\u6293\u53D6\u5BBD\u5EA6\u4E0A\u9650\u4E3A 42 \u6BEB\u7C73\u3002","target-form"],dropped:["The object was released too high. Lower it close to the support surface before switching DO1 OFF.","\u91CA\u653E\u4F4D\u7F6E\u8FC7\u9AD8\u3002\u5173\u95ED DO1 \u524D\uFF0C\u5148\u5C06\u7269\u4F53\u964D\u5230\u652F\u6491\u9762\u9644\u8FD1\u3002","tool-on"],outsideTarget:["The release did not satisfy the target rules. Place the whole object inside its matching pad, low and level, then release.","\u91CA\u653E\u672A\u6EE1\u8DB3\u76EE\u6807\u89C4\u5219\u3002\u5C06\u6574\u4E2A\u7269\u4F53\u5E73\u7A33\u653E\u5165\u5BF9\u5E94\u76EE\u6807\u533A\uFF0C\u5E76\u5728\u63A5\u8FD1\u8868\u9762\u65F6\u91CA\u653E\u3002","challenge-menu"],reach:["The requested target is outside the current arm\u2019s reach. Choose a closer target or add a joint, then check the new configuration.","\u76EE\u6807\u8D85\u51FA\u5F53\u524D\u673A\u68B0\u81C2\u53EF\u8FBE\u8303\u56F4\u3002\u9009\u62E9\u66F4\u8FD1\u7684\u76EE\u6807\u6216\u6DFB\u52A0\u5173\u8282\uFF0C\u7136\u540E\u68C0\u67E5\u65B0\u914D\u7F6E\u3002","target-form"],waitTimeout:["The expected DI1 state did not arrive before the wait timed out. Check the preceding DO1 command and pickup position before increasing the timeout.","\u7B49\u5F85\u8D85\u65F6\u524D\u672A\u51FA\u73B0\u9884\u671F\u7684 DI1 \u72B6\u6001\u3002\u589E\u52A0\u7B49\u5F85\u65F6\u95F4\u524D\uFF0C\u5148\u68C0\u67E5\u524D\u9762\u7684 DO1 \u6307\u4EE4\u548C\u62FE\u53D6\u4F4D\u7F6E\u3002","add-wait"],obstacle:["The arm\u2019s path intersects the pedestal. Add a raised intermediate waypoint and check the whole movement.","\u673A\u68B0\u81C2\u8DEF\u5F84\u4E0E\u9AD8\u53F0\u76F8\u4EA4\u3002\u6DFB\u52A0\u62AC\u9AD8\u7684\u4E2D\u95F4\u8DEF\u5F84\u70B9\uFF0C\u5E76\u68C0\u67E5\u6574\u4E2A\u52A8\u4F5C\u3002","record"],payloadCollision:["The carried object would collide. Allow clearance for the whole object, not just the tool tip.","\u643A\u5E26\u7684\u7269\u4F53\u4F1A\u53D1\u751F\u78B0\u649E\u3002\u9700\u8981\u4E3A\u6574\u4E2A\u7269\u4F53\u7559\u51FA\u95F4\u9699\uFF0C\u800C\u4E0D\u53EA\u662F\u5DE5\u5177\u5C16\u7AEF\u3002","record"],path:["The movement crosses the table. Lift to a clear intermediate waypoint before travelling sideways.","\u79FB\u52A8\u8DEF\u5F84\u7A7F\u8FC7\u684C\u9762\u3002\u6A2A\u5411\u79FB\u52A8\u524D\uFF0C\u5148\u62AC\u5347\u5230\u6709\u8DB3\u591F\u95F4\u9699\u7684\u4E2D\u95F4\u8DEF\u5F84\u70B9\u3002","record"],limits:["This pose cannot be reached within the selected joint limits or clearance. Try another position or orientation.","\u5728\u6240\u9009\u5173\u8282\u9650\u4F4D\u6216\u95F4\u9699\u8981\u6C42\u5185\u65E0\u6CD5\u5230\u8FBE\u8BE5\u59FF\u6001\u3002\u5C1D\u8BD5\u5176\u4ED6\u4F4D\u7F6E\u6216\u59FF\u6001\u3002","target-form"]}[i]||["Review the status message and adjust the last command before retrying. Ask the Coach about the specific control if you need more detail.","\u67E5\u770B\u72B6\u6001\u4FE1\u606F\uFF0C\u8C03\u6574\u4E0A\u4E00\u4E2A\u547D\u4EE4\u540E\u91CD\u8BD5\u3002\u5982\u9700\u66F4\u591A\u7EC6\u8282\uFF0C\u53EF\u5411\u52A9\u624B\u8BE2\u95EE\u76F8\u5173\u63A7\u4EF6\u3002",null];return{message:n[e?1:0],highlight:n[2]}}var yc=[{id:"lesson-move",en:"Viewport controls \u2192 Move to XYZ: execute the guided target",zh:"\u89C6\u53E3\u63A7\u4EF6 \u2192 \u79FB\u52A8\u5230 XYZ\uFF1A\u6267\u884C\u8DDF\u7EC3\u76EE\u6807"},{id:"tool-off",en:"Viewport controls \u2192 Tool I/O \u2192 OFF: release object",zh:"\u89C6\u53E3\u63A7\u4EF6 \u2192 \u5DE5\u5177 I/O \u2192 OFF\uFF1A\u91CA\u653E\u7269\u4F53"},{id:"stop",en:"Movement program \u2192 Stop: stop playback before manual editing; preserves scene",zh:"\u52A8\u4F5C\u7A0B\u5E8F \u2192 \u505C\u6B62\uFF1A\u624B\u52A8\u4FEE\u6539\u524D\u505C\u6B62\u8FD0\u884C\uFF0C\u4FDD\u7559\u573A\u666F"},{id:"speed",en:"Movement program \u2192 speed: choose 0.5\xD7 for inspection; does not change the path",zh:"\u52A8\u4F5C\u7A0B\u5E8F \u2192 \u901F\u5EA6\uFF1A\u9009\u62E9 0.5\xD7 \u89C2\u5BDF\uFF0C\u4E0D\u6539\u53D8\u8DEF\u5F84"},{id:"view-cube",en:"Viewport upper right \u2192 view cube: select Top or Side to inspect clearance",zh:"\u89C6\u53E3\u53F3\u4E0A\u89D2 \u2192 \u89C6\u56FE\u7ACB\u65B9\u4F53\uFF1A\u9009\u62E9\u9876\u90E8\u6216\u4FA7\u9762\u68C0\u67E5\u95F4\u9699"},{id:"add-output",en:"Commands \u2192 Set DO1: append a tool output instruction",zh:"\u6307\u4EE4 \u2192 \u8BBE\u7F6E DO1\uFF1A\u6DFB\u52A0\u5DE5\u5177\u8F93\u51FA\u6307\u4EE4"},{id:"instruction-value",en:"Commands \u2192 Signal value: select ON or OFF before adding Set DO1 / Wait DI1",zh:"\u6307\u4EE4 \u2192 \u4FE1\u53F7\u503C\uFF1A\u6DFB\u52A0\u8BBE\u7F6E DO1 \u6216\u7B49\u5F85 DI1 \u524D\u9009\u62E9 ON \u6216 OFF"},{id:"steps",en:"Movement program step list: Move earlier / Move later buttons reorder recorded steps",zh:"\u52A8\u4F5C\u7A0B\u5E8F\u6B65\u9AA4\u5217\u8868\uFF1A\u524D\u79FB\u6216\u540E\u79FB\u6309\u94AE\u8C03\u6574\u5DF2\u8BB0\u5F55\u6B65\u9AA4\u7684\u987A\u5E8F"},{id:"open-lesson",en:"Top menu \u2192 Lesson: guided introduction before the quiz; exercise unlocks when the quiz is completed",zh:"\u9876\u90E8\u83DC\u5355 \u2192 \u8BFE\u7A0B\uFF1A\u6D4B\u9A8C\u524D\u7684\u5F15\u5BFC\u4ECB\u7ECD\uFF1B\u5B8C\u6210\u6D4B\u9A8C\u540E\u89E3\u9501\u7EC3\u4E60"},{id:"open-quiz",en:"Top menu \u2192 Concept quiz: six interactive robot and control questions",zh:"\u9876\u90E8\u83DC\u5355 \u2192 \u6982\u5FF5\u6D4B\u9A8C\uFF1A\u516D\u9053\u673A\u68B0\u81C2\u548C\u63A7\u4EF6\u4E92\u52A8\u9898"},{id:"joints",en:"Viewport controls \u2192 Sliders: individual joint angles in degrees",zh:"\u89C6\u53E3\u63A7\u4EF6 \u2192 \u6ED1\u5757\uFF1A\u5404\u5173\u8282\u89D2\u5EA6\uFF0C\u5355\u4F4D\u5EA6"},{id:"target-form",en:"Viewport controls \u2192 XYZ: use the coordinate sliders or enter numbers, then select Move to XYZ",zh:"\u89C6\u53E3\u63A7\u4EF6 \u2192 XYZ \u5750\u6807\uFF1A\u4F7F\u7528\u5750\u6807\u6ED1\u5757\u6216\u8F93\u5165\u6570\u503C\uFF0C\u518D\u9009\u62E9\u79FB\u52A8\u5230 XYZ"},{id:"jog-controls",en:"Viewport controls \u2192 Buttons: jog XYZ or Rx/Ry/Rz; independent rotation needs six joints",zh:"\u89C6\u53E3\u63A7\u4EF6 \u2192 \u6309\u94AE\uFF1A\u70B9\u52A8 XYZ \u6216 Rx/Ry/Rz\uFF1B\u72EC\u7ACB\u65CB\u8F6C\u9700\u8981\u516D\u4E2A\u5173\u8282"},{id:"tool-select",en:"Expand Learning challenge \u2192 End effector: select gripper, vacuum or magnet",zh:"\u5C55\u5F00\u5B66\u4E60\u6311\u6218 \u2192 \u672B\u7AEF\u6267\u884C\u5668\uFF1A\u9009\u62E9\u5939\u722A\u3001\u5438\u76D8\u6216\u78C1\u94C1"},{id:"run",en:"Movement program \u2192 Run: resets the scene and executes the sequence",zh:"\u52A8\u4F5C\u7A0B\u5E8F \u2192 \u8FD0\u884C\uFF1A\u91CD\u7F6E\u573A\u666F\u5E76\u6267\u884C\u5E8F\u5217"},{id:"challenge-menu",en:"Learning challenge: choose a tool and inspect pickup/placement targets",zh:"\u5B66\u4E60\u6311\u6218\uFF1A\u9009\u62E9\u5DE5\u5177\u5E76\u67E5\u770B\u62FE\u53D6\u548C\u653E\u7F6E\u76EE\u6807"},{id:"tool-on",en:"Viewport controls \u2192 Tool I/O \u2192 ON: activate DO1",zh:"\u89C6\u53E3\u63A7\u4EF6 \u2192 \u5DE5\u5177 I/O \u2192 ON\uFF1A\u6FC0\u6D3B DO1"},{id:"di-state",en:"Viewport controls \u2192 Tool I/O \u2192 DI1: confirms an object is held",zh:"\u89C6\u53E3\u63A7\u4EF6 \u2192 \u5DE5\u5177 I/O \u2192 DI1\uFF1A\u786E\u8BA4\u5DF2\u6293\u53D6\u7269\u4F53"},{id:"record",en:"Movement program \u2192 Commands \u2192 Record current position",zh:"\u52A8\u4F5C\u7A0B\u5E8F \u2192 \u6307\u4EE4 \u2192 \u8BB0\u5F55\u5F53\u524D\u4F4D\u7F6E"},{id:"add-wait",en:"Movement program \u2192 Commands \u2192 Wait DI1",zh:"\u52A8\u4F5C\u7A0B\u5E8F \u2192 \u6307\u4EE4 \u2192 \u7B49\u5F85 DI1"},{id:"px",en:"Live XYZ at the top of the viewport control panel: TCP world X, Y, Z in millimeters",zh:"\u89C6\u53E3\u63A7\u4EF6\u9762\u677F\u9876\u90E8\u7684\u5B9E\u65F6 XYZ\uFF1ATCP \u7684\u4E16\u754C\u5750\u6807 X\u3001Y\u3001Z\uFF0C\u5355\u4F4D\u6BEB\u7C73"},{id:"add-joint",en:"Build your arm above the viewport: + adds a joint, up to six",zh:"\u89C6\u53E3\u4E0A\u65B9\u7EC4\u88C5\u673A\u68B0\u81C2\uFF1A+ \u6DFB\u52A0\u5173\u8282\uFF0C\u6700\u591A\u516D\u4E2A"}];function Gu(i,e){let t=document.documentElement.dataset.coach==="offline",n=document.createElement("section");n.id="coach",n.setAttribute("aria-label","Learning coach / \u5B66\u4E60\u52A9\u624B"),n.innerHTML='<div class="coach-bar"><button id="coach-drag" type="button"></button><button id="coach-home" type="button">\u2316</button><button id="coach-toggle" type="button" aria-controls="coach-body" aria-expanded="false">\uFF0B</button></div><div id="coach-body" hidden><p id="coach-status"></p><button id="coach-reconnect" type="button"></button><button data-topic="builtin"></button><div class="coach-topics"><button data-topic="task"></button><button data-topic="move"></button><button data-topic="collision"></button><button data-topic="program"></button><button data-topic="interface"></button><button data-topic="concepts"></button></div><div id="coach-messages" role="log" aria-live="polite" aria-relevant="additions"></div><form id="coach-form"><label for="coach-question" id="coach-label"></label><div class="coach-compose"><textarea id="coach-question" rows="2" maxlength="1000"></textarea><button id="coach-send" type="submit"></button></div></form></div>',document.body.append(n);let s=F=>n.querySelector("#"+F),r=()=>i().language==="zh",o=(F,J)=>r()?J:F,a=!1,l=null,c=null,h=!1,u=!1,f=!1,p="",_=[],x=Hu(),m=[],d="start";try{let F=JSON.parse(localStorage.getItem("robot-coach-position"));Number.isFinite(F?.x)&&Number.isFinite(F?.y)&&(l=F)}catch{}function E(){if(n.classList.contains("docked")){n.style.maxWidth="100%";return}let F=document.documentElement.clientWidth;n.style.maxWidth=F-16+"px";let J=n.getBoundingClientRect();l||(l={x:innerWidth-J.width-16,y:innerHeight-J.height-16}),l.x=Math.max(8,Math.min(l.x,F-J.width-8)),l.y=Math.max(8,Math.min(l.y,innerHeight-J.height-8)),n.style.left=l.x+"px",n.style.top=l.y+"px"}function v(){try{localStorage.setItem("robot-coach-position",JSON.stringify(l))}catch{}}function y(F,J=!1,ee,be="builtin"){let Oe=document.createElement("div");if(Oe.className="coach-message"+(J?" own":""),!J){let Ce=document.createElement("small");Ce.className="coach-source",Ce.textContent=be==="qwen"?"Qwen AI":be==="system"?o("Connection / status","\u8FDE\u63A5 / \u72B6\u6001"):o("Built-in guide \xB7 not AI","\u5185\u7F6E\u6307\u5357 \xB7 \u975E AI"),Oe.append(Ce)}let Pe=document.createElement("p");if(Pe.textContent=F,Oe.append(Pe),ee){let Ce=document.createElement("button");Ce.textContent=o("Show control \u2197","\u663E\u793A\u63A7\u4EF6 \u2197"),Ce.onclick=K=>{K.stopPropagation(),w(ee)},Oe.append(Ce)}for(s("coach-messages").append(Oe);s("coach-messages").children.length>30;)s("coach-messages").firstElementChild.remove();Oe.scrollIntoView({block:"nearest"})}let A;function w(F){if(!yc.some(Oe=>Oe.id===F))return;let J=document.getElementById(F);if(!J)return;let ee=J.closest("aside");ee&&document.querySelector(`[data-panel-choice="${ee.id==="program-panel"?"program":"controls"}"]`)?.click();let be={joints:"sliders","target-form":"xyz","jog-controls":"jog"}[F];be&&document.querySelector(`[data-mode="${be}"]`)?.click(),F==="tool-select"&&(document.getElementById("challenge-menu").open=!0),F==="open-lesson"&&J.click(),F==="open-quiz"&&e?.(),J.tagName==="DETAILS"&&(J.open=!0),document.querySelectorAll(".coach-highlight").forEach(Oe=>Oe.classList.remove("coach-highlight")),clearTimeout(A),J.scrollIntoView({block:"center",behavior:"smooth"}),J.classList.add("coach-highlight"),A=setTimeout(()=>J.classList.remove("coach-highlight"),4500)}function C(F,J=""){let ee=i(),be=J.toLowerCase();if(ee.learning?.unlocked===!1||ee.quiz?.open&&!ee.quiz.answered&&!ee.quiz.completed){let Pe=za("start",ee);y(Pe.message,!1,Pe.highlight);return}if(F==="interface"){y(o("Choose a control to locate it in the workspace. These names and locations form the interface map that Qwen will receive.","\u9009\u62E9\u8981\u67E5\u627E\u7684\u63A7\u4EF6\u3002\u8FD9\u4E9B\u540D\u79F0\u548C\u4F4D\u7F6E\u5C06\u6784\u6210\u63D0\u4F9B\u7ED9 Qwen \u7684\u754C\u9762\u5730\u56FE\u3002"));for(let Pe of yc)y(r()?Pe.zh:Pe.en,!1,Pe.id);return}if(F==="concepts"||/quiz|concept|词汇|测验|概念/.test(be)){y(o("Concept practice: DO1 is ON, but DI1 is OFF. Is an object confirmed held? No. DO1 is the command; DI1 is pickup feedback. XYZ describes the tool center point\u2019s position, while roll/pitch/yaw describe orientation. Open Quiz concepts to try the interactive quiz.","\u6982\u5FF5\u7EC3\u4E60\uFF1ADO1 \u4E3A ON\u3001DI1 \u4E3A OFF\uFF0C\u80FD\u786E\u8BA4\u5DF2\u6293\u53D6\u7269\u4F53\u5417\uFF1F\u4E0D\u80FD\u3002DO1 \u662F\u547D\u4EE4\uFF0CDI1 \u662F\u62FE\u53D6\u53CD\u9988\u3002XYZ \u8868\u793A\u5DE5\u5177\u4E2D\u5FC3\u70B9\u7684\u4F4D\u7F6E\uFF0C\u6EDA\u8F6C/\u4FEF\u4EF0/\u504F\u822A\u8868\u793A\u59FF\u6001\u3002\u70B9\u51FB\u6D4B\u9A8C\u6982\u5FF5\u5373\u53EF\u6253\u5F00\u4E92\u52A8\u6D4B\u9A8C\u3002"),!1,"di-state");return}d=["move","collision","program","pickup"].includes(F)?F:F==="task"?ee.input?"pickup":"start":xc(J,d);let Oe=za(d,ee);y(Oe.message,!1,Oe.highlight)}function L(){s("coach-reconnect").textContent=o("Recheck connection","\u91CD\u65B0\u68C0\u67E5\u8FDE\u63A5"),n.querySelector('[data-topic="builtin"]').textContent=o("Built-in help (offline)","\u5185\u7F6E\u5E2E\u52A9\uFF08\u79BB\u7EBF\uFF09"),s("coach-drag").textContent=o("\u2726 Your teacher","\u2726 \u4F60\u7684\u8001\u5E08"),s("coach-drag").title=o("Teacher guidance and questions","\u8001\u5E08\u6307\u5BFC\u4E0E\u63D0\u95EE"),s("coach-home").title=s("coach-home").ariaLabel=o("Reset coach position","\u91CD\u7F6E\u52A9\u624B\u4F4D\u7F6E"),s("coach-toggle").ariaLabel=o(a?"Collapse coach":"Open coach",a?"\u6536\u8D77\u52A9\u624B":"\u6253\u5F00\u52A9\u624B"),s("coach-status").textContent=o("Built-in guidance \xB7 Qwen not connected","\u5185\u7F6E\u6307\u5BFC \xB7 \u5C1A\u672A\u8FDE\u63A5 Qwen");for(let[F,J,ee]of[["task","Where do I start?","\u4ECE\u54EA\u91CC\u5F00\u59CB\uFF1F"],["move","Move the arm","\u79FB\u52A8\u673A\u68B0\u81C2"],["collision","Avoid collisions","\u907F\u5F00\u78B0\u649E"],["program","Build a program","\u7F16\u6392\u7A0B\u5E8F"],["interface","Find a control","\u67E5\u627E\u63A7\u4EF6"],["concepts","Concept quiz","\u6982\u5FF5\u6D4B\u9A8C"]])n.querySelector(`[data-topic="${F}"]`).textContent=o(J,ee);s("coach-label").textContent=o("Ask about this task or the controls","\u8BE2\u95EE\u4EFB\u52A1\u6216\u63A7\u4EF6"),s("coach-question").placeholder=o("How do I record a pickup?","\u5982\u4F55\u8BB0\u5F55\u62FE\u53D6\u52A8\u4F5C\uFF1F"),s("coach-send").textContent=o("Ask","\u63D0\u95EE")}function S(){a=!a,s("coach-body").hidden=!a,n.classList.toggle("expanded",a),s("coach-toggle").textContent=a?"\u2212":"\uFF0B",s("coach-toggle").setAttribute("aria-expanded",String(a)),L(),W(),E(),a&&!t&&!s("coach-messages").children.length&&y(o("I can help you explore the controls and plan this task. Choose a topic or ask a question. The status above shows whether Qwen is connected.","\u6211\u53EF\u4EE5\u5E2E\u52A9\u4F60\u4E86\u89E3\u63A7\u4EF6\u5E76\u89C4\u5212\u4EFB\u52A1\u3002\u9009\u62E9\u4E3B\u9898\u6216\u8F93\u5165\u95EE\u9898\u3002\u4E0A\u65B9\u72B6\u6001\u4F1A\u663E\u793A\u662F\u5426\u5DF2\u8FDE\u63A5 Qwen\u3002"))}s("coach-toggle").onclick=S,s("coach-home").onclick=()=>{l=null,E(),v()},s("coach-drag").onpointerdown=F=>{n.classList.contains("docked")||F.button!==0||(c={x:F.clientX,y:F.clientY,left:l.x,top:l.y},s("coach-drag").setPointerCapture(F.pointerId))},s("coach-drag").onpointermove=F=>{c&&(l={x:c.left+F.clientX-c.x,y:c.top+F.clientY-c.y},E())},s("coach-drag").onpointerup=()=>{c=null,v()},s("coach-drag").onpointercancel=()=>{c=null},s("coach-drag").onkeydown=F=>{let J={ArrowLeft:[-20,0],ArrowRight:[20,0],ArrowUp:[0,-20],ArrowDown:[0,20]};J[F.key]?(F.preventDefault(),l.x+=J[F.key][0],l.y+=J[F.key][1],E(),v()):(F.key==="Enter"||F.key===" ")&&(F.preventDefault(),S())},n.onkeydown=F=>{F.key==="Escape"&&a&&(S(),s("coach-toggle").focus())},n.querySelectorAll("[data-topic]").forEach(F=>F.onclick=()=>C(F.dataset.topic)),n.querySelector('[data-topic="concepts"]').onclick=()=>{e?.(),a&&S()};let b=()=>({...i(),uiVersion:"coach-ui-v1",controls:yc.map(F=>({...F,visible:!!document.getElementById(F.id)?.getClientRects().length,enabled:!document.getElementById(F.id)?.disabled&&!document.getElementById(F.id)?.closest("[inert]")})),quiz:i().quiz||{available:!1}}),R=()=>{let F=i();return JSON.stringify([F.language,F.tool,F.joints,F.score,F.output,F.input,F.steps,F.quiz])};function U(F){let J=Vu(F.code,r()),ee=["obstacle","path","payloadCollision","blocked","noPath"].includes(F.code)?"collision":F.code==="waitTimeout"?"program":["reach","limits","alignment"].includes(F.code)?"move":"pickup";d=ee;let be=za(ee,{...F.snapshot||i(),language:i().language});y(J.message+`

`+be.message,!1,be.highlight)}function G(){if(!u&&m.length){let F=m.shift();q(o("Explain what happened in beginner language, then give me a short numbered recovery procedure with the exact controls and what to check.","\u8BF7\u7528\u521D\u5B66\u8005\u80FD\u7406\u89E3\u7684\u8BED\u8A00\u89E3\u91CA\u5931\u8D25\uFF0C\u5E76\u6309\u7F16\u53F7\u7ED9\u51FA\u7B80\u77ED\u7684\u5904\u7406\u6B65\u9AA4\u3001\u5177\u4F53\u63A7\u4EF6\u548C\u68C0\u67E5\u8981\u70B9\u3002"),F)}}let Z={not_configured:["No server API key is configured.","\u670D\u52A1\u5668\u5C1A\u672A\u914D\u7F6E API \u5BC6\u94A5\u3002"],unavailable:["This preview has no AI connection. Deploy with the Python school server.","\u5F53\u524D\u9884\u89C8\u672A\u8FDE\u63A5 AI\uFF0C\u8BF7\u4F7F\u7528 Python \u5B66\u6821\u670D\u52A1\u5668\u90E8\u7F72\u3002"],provider_auth:["Qwen rejected the key (401). Check the key and endpoint pairing.","Qwen \u62D2\u7EDD\u5BC6\u94A5\uFF08401\uFF09\uFF0C\u8BF7\u68C0\u67E5\u5BC6\u94A5\u4E0E\u7AEF\u70B9\u662F\u5426\u5339\u914D\u3002"],provider_access:["Qwen denied access (403). Check the plan/model permissions.","Qwen \u62D2\u7EDD\u8BBF\u95EE\uFF08403\uFF09\uFF0C\u8BF7\u68C0\u67E5\u5957\u9910\u548C\u6A21\u578B\u6743\u9650\u3002"],provider_endpoint:["Qwen endpoint/model was not found (404).","\u672A\u627E\u5230 Qwen \u7AEF\u70B9\u6216\u6A21\u578B\uFF08404\uFF09\u3002"],provider_quota:["Qwen rate or quota limit (429). Check available quota.","Qwen \u901F\u7387\u6216\u989D\u5EA6\u9650\u5236\uFF08429\uFF09\uFF0C\u8BF7\u68C0\u67E5\u989D\u5EA6\u3002"],provider_request:["Qwen rejected the request (400). Check model and supported parameters.","Qwen \u62D2\u7EDD\u8BF7\u6C42\uFF08400\uFF09\uFF0C\u8BF7\u68C0\u67E5\u6A21\u578B\u548C\u53C2\u6570\u3002"],provider_timeout:["Qwen timed out. Try again shortly.","Qwen \u54CD\u5E94\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002"],provider_network:["The server could not reach Qwen. Check DNS, HTTPS access and certificates.","\u670D\u52A1\u5668\u65E0\u6CD5\u8FDE\u63A5 Qwen\uFF0C\u8BF7\u68C0\u67E5 DNS\u3001HTTPS \u8BBF\u95EE\u548C\u8BC1\u4E66\u3002"],provider_response:["Qwen returned an empty or unreadable response.","Qwen \u8FD4\u56DE\u7A7A\u767D\u6216\u65E0\u6CD5\u8BFB\u53D6\u7684\u54CD\u5E94\u3002"],busy:["The school server is busy. Try again shortly.","\u5B66\u6821\u670D\u52A1\u5668\u7E41\u5FD9\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002"],invalid_request:["The request was rejected. Try a shorter question or smaller program.","\u8BF7\u6C42\u88AB\u62D2\u7EDD\uFF0C\u8BF7\u5C1D\u8BD5\u8F83\u77ED\u7684\u95EE\u9898\u6216\u8F83\u5C0F\u7684\u7A0B\u5E8F\u3002"]};function j(F){return o(...Z[F]||["AI request failed. Recheck the server connection.","AI \u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u68C0\u67E5\u670D\u52A1\u5668\u8FDE\u63A5\u3002"])}function W(){if(t){s("coach-status").textContent=o("Guided lessons and built-in help \xB7 no live AI","\u5F15\u5BFC\u8BFE\u7A0B\u548C\u5185\u7F6E\u5E2E\u52A9 \xB7 \u65E0\u5728\u7EBF AI");return}s("coach-status").textContent=u?o("Contacting Qwen\u2026","\u6B63\u5728\u8FDE\u63A5 Qwen\u2026"):p?j(p):f?o("Qwen \xB7 last AI reply succeeded","Qwen \xB7 \u4E0A\u6B21 AI \u56DE\u590D\u6210\u529F"):h?o("Key configured \xB7 AI response not yet verified","\u5DF2\u914D\u7F6E\u5BC6\u94A5 \xB7 \u5C1A\u672A\u9A8C\u8BC1 AI \u56DE\u590D"):o("AI offline \xB7 built-in help available","AI \u79BB\u7EBF \xB7 \u53EF\u4F7F\u7528\u5185\u7F6E\u5E2E\u52A9")}async function re(){if(t){W();return}try{let F=await fetch("/api/coach/status",{cache:"no-store"});if(!F.ok)throw Error("unavailable");h=(await F.json()).configured===!0,p=h?"":"not_configured"}catch{h=!1,p="unavailable"}W()}s("coach-reconnect").onclick=()=>{f=!1,re()};async function q(F,J=null){if(t){J?U(J):C(xc(F));return}if(u)return;if(u=!0,s("coach-send").disabled=!0,W(),J?y(o("Status feedback: ","\u72B6\u6001\u53CD\u9988\uFF1A")+J.text):y(F,!0),!h&&(await re(),!h)){y(j(p)+o(" No AI answer was generated. Use Built-in help for offline guidance."," \u672A\u751F\u6210 AI \u7B54\u6848\u3002\u53EF\u70B9\u51FB\u5185\u7F6E\u5E2E\u52A9\u67E5\u770B\u79BB\u7EBF\u6307\u5BFC\u3002"),!1,null,"system"),J&&U(J),u=!1,s("coach-send").disabled=!1,W(),queueMicrotask(G);return}u=!0,s("coach-send").disabled=!0,W();let ee=R(),be=new AbortController,Oe=setTimeout(()=>be.abort(),3e4);try{let Pe=await fetch("/api/coach",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:F,context:J?{...J.snapshot,failure:{code:J.code,text:J.text,step:J.step,occurredAt:J.occurredAt},feedbackMode:"failure"}:b(),history:_.slice(-6)}),signal:be.signal}),Ce=await Pe.json();if(!Pe.ok)throw Error(Ce.error||"provider_unavailable");if(typeof Ce.message!="string")throw Error("Invalid response");if(!J&&ee!==R()){y(o("The workspace changed while I was answering. Ask again to use the current state.","\u56DE\u7B54\u671F\u95F4\u5DE5\u4F5C\u533A\u5DF2\u53D1\u751F\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u63D0\u95EE\u4EE5\u4F7F\u7528\u5F53\u524D\u72B6\u6001\u3002"));return}f=!0,p="",y(Ce.message,!1,Ce.highlight,"qwen"),_.push({role:"user",content:F},{role:"assistant",content:Ce.message}),_.length>6&&_.splice(0,_.length-6)}catch(Pe){f=!1,p=Pe.name==="AbortError"?"provider_timeout":Pe.message,y(j(p)+o(" No AI answer was generated. Built-in help is available separately."," \u672A\u751F\u6210 AI \u7B54\u6848\u3002\u5185\u7F6E\u5E2E\u52A9\u53EF\u5355\u72EC\u6253\u5F00\u3002"),!1,null,"system"),J&&U(J)}finally{clearTimeout(Oe),u=!1,s("coach-send").disabled=!1,W(),queueMicrotask(G)}}s("coach-form").onsubmit=F=>{F.preventDefault();let J=s("coach-question").value.trim();!J||u||(s("coach-question").value="",q(J))};for(let[F,J,ee]of[["task","I am a beginner. What should I do first for this task? Give me numbered steps.","\u6211\u662F\u521D\u5B66\u8005\u3002\u8FD9\u4E2A\u4EFB\u52A1\u5E94\u8BE5\u5148\u505A\u4EC0\u4E48\uFF1F\u8BF7\u6309\u6B65\u9AA4\u8BB2\u89E3\u3002"],["move","Show me how to move the arm, step by step, using the controls.","\u8BF7\u7528\u754C\u9762\u63A7\u4EF6\u4E00\u6B65\u6B65\u6559\u6211\u79FB\u52A8\u673A\u68B0\u81C2\u3002"],["collision","Explain strategies to avoid and recover from collisions in this simulator, step by step.","\u8BF7\u9010\u6B65\u8BB2\u89E3\u5728\u672C\u6A21\u62DF\u5668\u4E2D\u907F\u5F00\u78B0\u649E\u548C\u5904\u7406\u78B0\u649E\u7684\u7B56\u7565\u3002"],["program","Help me build my first pick-and-place program, step by step.","\u8BF7\u4E00\u6B65\u6B65\u5E2E\u52A9\u6211\u7F16\u5199\u7B2C\u4E00\u4E2A\u62FE\u53D6\u653E\u7F6E\u7A0B\u5E8F\u3002"]])n.querySelector(`[data-topic="${F}"]`).onclick=()=>{d=F==="task"?"start":F,q(o(J,ee))};return new MutationObserver(()=>{L(),W(),E()}).observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),window.addEventListener("resize",E),L(),E(),n.querySelector('[data-topic="builtin"]').onclick=()=>C(d),t?(s("coach-form").hidden=!0,s("coach-reconnect").hidden=!0,W()):location.protocol!=="file:"&&re(),{context:b,mount:s("coach-body"),fit:E,collapse(){a&&S()},showLesson(F,J=!1){a||S();let ee=n.getBoundingClientRect();l={x:F?(innerWidth-ee.width)/2:J?18:innerWidth-ee.width-18,y:F?Math.max(30,(innerHeight-480)/2):100},E()},reportFailure(F){if(!x(F.code))return;let J=document.getElementById("teacher-questions");J&&(J.open=!0),a||S();let ee=JSON.parse(JSON.stringify(b()));if(t){U({...F,snapshot:ee});return}m.push({...F,snapshot:ee,occurredAt:new Date().toISOString()}),m.length>8&&m.shift(),G()}}}var Ot=[{id:"joint",target:"joint",prompt:["What is the highlighted part A?","\u9AD8\u4EAE\u7684 A \u90E8\u4EF6\u662F\u4EC0\u4E48\uFF1F"],description:["Look at the rotating connection above the base.","\u89C2\u5BDF\u5E95\u5EA7\u4E0A\u65B9\u7684\u65CB\u8F6C\u8FDE\u63A5\u5904\u3002"],options:[["Joint","\u5173\u8282"],["Link","\u8FDE\u6746"],["End effector","\u672B\u7AEF\u6267\u884C\u5668"]],correct:0,explain:["A joint lets connected parts rotate relative to each other. Its angle is measured in degrees.","\u5173\u8282\u8BA9\u76F8\u8FDE\u7684\u90E8\u4EF6\u76F8\u5BF9\u65CB\u8F6C\uFF0C\u5176\u89D2\u5EA6\u4EE5\u5EA6\u4E3A\u5355\u4F4D\u3002"]},{id:"link",target:"link",prompt:["What is the highlighted part A?","\u9AD8\u4EAE\u7684 A \u90E8\u4EF6\u662F\u4EC0\u4E48\uFF1F"],description:["Look at the long rigid section between two rotating connections.","\u89C2\u5BDF\u4E24\u4E2A\u65CB\u8F6C\u8FDE\u63A5\u5904\u4E4B\u95F4\u7684\u957F\u521A\u6027\u90E8\u4EF6\u3002"],options:[["Sensor","\u4F20\u611F\u5668"],["Link","\u8FDE\u6746"],["Tool center point","\u5DE5\u5177\u4E2D\u5FC3\u70B9"]],correct:1,explain:["A link connects joints. Changing joint angles moves the links and the tool.","\u8FDE\u6746\u8FDE\u63A5\u5173\u8282\u3002\u6539\u53D8\u5173\u8282\u89D2\u5EA6\u4F1A\u79FB\u52A8\u8FDE\u6746\u548C\u5DE5\u5177\u3002"]},{id:"tool",target:"tool",prompt:["What is the highlighted assembly A called?","\u9AD8\u4EAE\u7684 A \u7EC4\u4EF6\u53EB\u4EC0\u4E48\uFF1F"],description:["Look at the attachment at the very end of the arm.","\u89C2\u5BDF\u673A\u68B0\u81C2\u6700\u672B\u7AEF\u7684\u9644\u4EF6\u3002"],options:[["Base","\u5E95\u5EA7"],["Joint limit","\u5173\u8282\u9650\u4F4D"],["End effector","\u672B\u7AEF\u6267\u884C\u5668"]],correct:2,explain:["The end effector interacts with the object. This simulator offers a gripper, vacuum cup and magnet.","\u672B\u7AEF\u6267\u884C\u5668\u4E0E\u7269\u4F53\u63A5\u89E6\u3002\u672C\u6A21\u62DF\u5668\u63D0\u4F9B\u5939\u722A\u3001\u5438\u76D8\u548C\u78C1\u94C1\u3002"]},{id:"tcp",target:"tcp",prompt:["The highlighted point A is the TCP. What does XYZ report?","\u9AD8\u4EAE\u7684 A \u70B9\u662F TCP\u3002XYZ \u663E\u793A\u4EC0\u4E48\uFF1F"],description:["Look at the working point at the tip and the Tool position readout on the left of the 3D view.","\u89C2\u5BDF\u5DE5\u5177\u672B\u7AEF\u7684\u5DE5\u4F5C\u70B9\u4EE5\u53CA\u4E09\u7EF4\u89C6\u56FE\u5DE6\u4FA7\u7684\u5DE5\u5177\u4F4D\u7F6E\u8BFB\u6570\u3002"],options:[["The tool\u2019s position in world coordinates, in mm","\u5DE5\u5177\u5728\u4E16\u754C\u5750\u6807\u7CFB\u4E2D\u7684\u4F4D\u7F6E\uFF0C\u5355\u4F4D\u6BEB\u7C73"],["Three joint angles, in degrees","\u4E09\u4E2A\u5173\u8282\u89D2\u5EA6\uFF0C\u5355\u4F4D\u5EA6"],["The object\u2019s weight","\u7269\u4F53\u7684\u91CD\u91CF"]],correct:0,explain:["TCP means tool center point. XYZ reports its position; roll, pitch and yaw describe orientation.","TCP \u662F\u5DE5\u5177\u4E2D\u5FC3\u70B9\u3002XYZ \u663E\u793A\u5176\u4F4D\u7F6E\uFF1B\u6EDA\u8F6C\u3001\u4FEF\u4EF0\u3001\u504F\u822A\u63CF\u8FF0\u5176\u59FF\u6001\u3002"]},{id:"signals",ui:"di-state",prompt:["Suppose DO1 is ON and DI1 is OFF. What is confirmed?","\u5047\u8BBE DO1 \u4E3A ON\uFF0CDI1 \u4E3A OFF\u3002\u53EF\u4EE5\u786E\u8BA4\u4EC0\u4E48\uFF1F"],description:["This is a hypothetical signal state, not necessarily the current live state.","\u8FD9\u662F\u4E00\u4E2A\u5047\u8BBE\u7684\u4FE1\u53F7\u72B6\u6001\uFF0C\u4E0D\u4E00\u5B9A\u4E0E\u5F53\u524D\u5B9E\u65F6\u72B6\u6001\u76F8\u540C\u3002"],options:[["An object is definitely held","\u4E00\u5B9A\u5DF2\u6293\u53D6\u7269\u4F53"],["The tool is commanded ON; pickup is not confirmed","\u5DE5\u5177\u5DF2\u6536\u5230 ON \u547D\u4EE4\uFF0C\u4F46\u5C1A\u672A\u786E\u8BA4\u6293\u53D6"],["The program has finished","\u7A0B\u5E8F\u5DF2\u5B8C\u6210"]],correct:1,explain:["DO1 is the output command. DI1 is input feedback confirming an object is held. Check DI1 before lifting.","DO1 \u662F\u8F93\u51FA\u547D\u4EE4\u3002DI1 \u662F\u786E\u8BA4\u5DF2\u6293\u53D6\u7269\u4F53\u7684\u8F93\u5165\u53CD\u9988\u3002\u62AC\u8D77\u524D\u5E94\u68C0\u67E5 DI1\u3002"]},{id:"record",ui:"record",prompt:["What does Record current position add?","\u201C\u8BB0\u5F55\u5F53\u524D\u4F4D\u7F6E\u201D\u4F1A\u6DFB\u52A0\u4EC0\u4E48\uFF1F"],description:["Find the highlighted button in Movement program \u2192 Commands.","\u627E\u5230\u52A8\u4F5C\u7A0B\u5E8F \u2192 \u6307\u4EE4\u4E2D\u7684\u9AD8\u4EAE\u6309\u94AE\u3002"],options:[["A complete pickup sequence","\u5B8C\u6574\u7684\u62FE\u53D6\u5E8F\u5217"],["A DO1 command and a movement","DO1 \u547D\u4EE4\u548C\u79FB\u52A8\u52A8\u4F5C"],["A movement waypoint; DO1 needs its own command","\u4E00\u4E2A\u79FB\u52A8\u8DEF\u5F84\u70B9\uFF1BDO1 \u9700\u8981\u5355\u72EC\u6DFB\u52A0\u547D\u4EE4"]],correct:2,explain:["Recording adds a movement. Add Set DO1 and Wait DI1 separately to control and confirm pickup.","\u8BB0\u5F55\u4F1A\u6DFB\u52A0\u4E00\u4E2A\u79FB\u52A8\u52A8\u4F5C\u3002\u8BF7\u5355\u72EC\u6DFB\u52A0\u8BBE\u7F6E DO1 \u548C\u7B49\u5F85 DI1\uFF0C\u4EE5\u63A7\u5236\u5E76\u786E\u8BA4\u62FE\u53D6\u3002"]}];function Wu({language:i,highlight:e,reveal:t,onOpen:n,onComplete:s=()=>{}}){let r=document.createElement("section");r.id="concept-quiz",r.hidden=!0,r.setAttribute("aria-labelledby","quiz-title"),document.querySelector("#program-panel .program").before(r);let o=document.createElement("button");o.id="open-quiz",document.querySelector(".header-right").prepend(o);let a=0,l=[],c=!1,h=null;try{let v=JSON.parse(localStorage.getItem("robot-concepts-v1"));Array.isArray(v?.answers)&&v.answers.length<=Ot.length&&v.answers.every((y,A)=>Number.isInteger(y)&&y>=0&&y<Ot[A].options.length)&&(l=v.answers,a=l.length,h=Number.isInteger(v.firstScore)?v.firstScore:null)}catch{}let u=v=>v[i()==="zh"?1:0],f=()=>{try{localStorage.setItem("robot-concepts-v1",JSON.stringify({answers:l,firstScore:h}))}catch{}};function p(){e(null),document.querySelectorAll(".quiz-highlight").forEach(v=>v.classList.remove("quiz-highlight"))}function _(){if(p(),!c||a>=Ot.length)return;let v=Ot[a];v.target&&e(v.target),v.ui&&(t(v.ui),document.getElementById(v.ui)?.classList.add("quiz-highlight"))}function x(v,y){let A=document.createElement("button");return A.type="button",A.textContent=v,A.onclick=y,A}function m(){if(o.textContent=u(["Concept quiz","\u6982\u5FF5\u6D4B\u9A8C"])+(l.length===Ot.length?" \u2713":""),o.setAttribute("aria-expanded",String(c)),o.setAttribute("aria-controls",r.id),!c)return;r.replaceChildren();let v=document.createElement("div");v.className="quiz-heading";let y=document.createElement("h2");y.id="quiz-title",y.textContent=u(["Know your robot","\u8BA4\u8BC6\u673A\u68B0\u81C2"]),v.append(y,x(u(["Close \xD7","\u5173\u95ED \xD7"]),d)),r.append(v);let A=document.createElement("p");if(A.className="quiz-progress",A.textContent=a<Ot.length?u(["Question","\u95EE\u9898"])+` ${a+1} / ${Ot.length}`:u(["Review your answers","\u56DE\u987E\u7B54\u6848"]),r.append(A),a>=Ot.length){s(),p();let R=l.filter((Z,j)=>Z===Ot[j].correct).length;h===null&&(h=R,f());let U=document.createElement("h3");U.tabIndex=-1,U.textContent=u([`${R} / 6 correct \u2014 ${R===6?"ready to practice!":"review the feedback below."}`,`\u7B54\u5BF9 ${R} / 6 \u2014 ${R===6?"\u53EF\u4EE5\u5F00\u59CB\u7EC3\u4E60\uFF01":"\u8BF7\u67E5\u770B\u4E0B\u65B9\u53CD\u9988\u3002"}`]),r.append(U);let G=document.createElement("p");G.textContent=u(["Exercise unlocked. You can now move the arm and build your program.","\u7EC3\u4E60\u5DF2\u89E3\u9501\u3002\u73B0\u5728\u53EF\u4EE5\u79FB\u52A8\u673A\u68B0\u81C2\u5E76\u7F16\u6392\u7A0B\u5E8F\u3002"]),r.append(G),Ot.forEach((Z,j)=>{let W=document.createElement("p");W.className="quiz-review",W.textContent=(l[j]===Z.correct?"\u2713 ":"\u21BA ")+u(Z.explain),r.append(W)}),r.append(x(u(["Try again","\u91CD\u65B0\u6D4B\u9A8C"]),()=>{l=[],a=0,f(),m()}),x(u(["Start exercise \u2192","\u5F00\u59CB\u7EC3\u4E60 \u2192"]),d)),U.focus({preventScroll:!0});return}let w=Ot[a],C=document.createElement("h3");C.id="quiz-question",C.tabIndex=-1,C.textContent=u(w.prompt);let L=document.createElement("p");L.textContent=u(w.description),r.append(C,L);let S=document.createElement("div");S.className="quiz-options",S.setAttribute("role","group"),S.setAttribute("aria-labelledby","quiz-question");let b=l[a]!==void 0;if(w.options.forEach((R,U)=>{let G=x(String.fromCharCode(65+U)+". "+u(R),()=>{l[a]=U,f(),m()});G.disabled=b,b&&(G.classList.toggle("correct",U===w.correct),G.classList.toggle("incorrect",U===l[a]&&U!==w.correct)),S.append(G)}),r.append(S),b){let R=document.createElement("p");R.id="quiz-feedback",R.setAttribute("role","status"),R.textContent=u(l[a]===w.correct?["Correct. ","\u6B63\u786E\u3002"]:["Not quite. ","\u8FD8\u4E0D\u6B63\u786E\u3002"])+u(w.explain),r.append(R,x(u(a===Ot.length-1?["See results","\u67E5\u770B\u7ED3\u679C"]:["Next question \u2192","\u4E0B\u4E00\u9898 \u2192"]),()=>{a++,m(),f()}))}_(),b||C.focus({preventScroll:!0})}function d(){document.body.classList.remove("quiz-active"),c=!1,r.hidden=!0,p(),m(),o.focus({preventScroll:!0})}function E(){document.body.classList.add("quiz-active"),c||n(),c=!0,r.hidden=!1,m(),r.scrollIntoView({block:"nearest",behavior:"smooth"})}return o.onclick=()=>c?d():E(),r.onkeydown=v=>{v.key==="Escape"&&(v.stopPropagation(),d())},new MutationObserver(m).observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),m(),{close:d,open:E,reset(){d(),l=[],a=0,h=null,f(),m()},context(){let v=Ot[a];return{available:!0,open:c,index:a,total:Ot.length,completed:l.length===Ot.length,question:v?u(v.prompt):null,concept:v?.id,options:v?.options.map(u),selected:l[a]??null,answered:l[a]!==void 0,score:l.filter((y,A)=>y===Ot[A].correct).length}}}}function Xu({language:i,coach:e,quiz:t,training:n,highlight:s,reveal:r}){let o=V=>V[i()==="zh"?1:0],a=!1,l=!1,c=!1,h="intro",u=0,f="act",p=[],_=!1;try{l=JSON.parse(localStorage.getItem("robot-learning-v2"))?.unlocked===!0,c=l}catch{}l&&(h="independent");let x=document.createElement("section");x.id="coach-lesson",e.mount.prepend(x);let m=document.createElement("details");m.id="teacher-questions";let d=document.createElement("summary");m.append(d);for(let V of[...e.mount.children])V!==x&&m.append(V);e.mount.append(m);let E=document.createElement("button");E.id="open-lesson",document.querySelector(".header-right").prepend(E);let v=document.createElement("div");v.id="learning-lock",document.querySelector(".viewport-arm-bar").before(v);let y=document.createElement("div");y.id="teacher-home";let A=document.getElementById("coach");y.append(A),A.classList.add("docked");function w(){document.getElementById("program-panel").prepend(y),e.fit()}w(),window.addEventListener("resize",w);let C=[["Joints rotate","\u5173\u8282\u4F1A\u65CB\u8F6C"],["Links connect joints","\u8FDE\u6746\u8FDE\u63A5\u5173\u8282"],["Tools do the work","\u672B\u7AEF\u5DE5\u5177\u6267\u884C\u4EFB\u52A1"],["Position and orientation","\u4F4D\u7F6E\u4E0E\u59FF\u6001"],["Command and feedback","\u547D\u4EE4\u4E0E\u53CD\u9988"],["Build a sequence","\u7F16\u6392\u7A0B\u5E8F"]],L=[["Raise to a safe travel height","\u62AC\u9AD8\u5230\u5B89\u5168\u79FB\u52A8\u9AD8\u5EA6","First move up before travelling across the workspace.","\u5148\u62AC\u9AD8\uFF0C\u518D\u6A2A\u5411\u79FB\u52A8\u3002"],["Approach above object A","\u79FB\u52A8\u5230\u7269\u4F53 A \u4E0A\u65B9","Keep clearance while moving sideways.","\u6A2A\u5411\u79FB\u52A8\u65F6\u4FDD\u6301\u8DB3\u591F\u95F4\u9699\u3002"],["Lower around object A","\u4E0B\u964D\u5230\u7269\u4F53 A","The open jaws must surround the block before closing.","\u95ED\u5408\u524D\uFF0C\u8BA9\u5F20\u5F00\u7684\u5939\u722A\u5305\u56F4\u65B9\u5757\u3002"],["Close the gripper","\u95ED\u5408\u5939\u722A","Activate DO1 and check that DI1 confirms pickup.","\u6FC0\u6D3B DO1\uFF0C\u5E76\u68C0\u67E5 DI1 \u786E\u8BA4\u5DF2\u6293\u53D6\u3002"],["Wait for pickup feedback","\u7B49\u5F85\u6293\u53D6\u53CD\u9988","A recorded Wait DI1 = ON prevents the program lifting before pickup is confirmed.","\u8BB0\u5F55\u7B49\u5F85 DI1 = ON\uFF0C\u53EF\u9632\u6B62\u7A0B\u5E8F\u5728\u786E\u8BA4\u6293\u53D6\u524D\u62AC\u8D77\u3002"],["Lift clear","\u5411\u4E0A\u62AC\u8D77","Lift vertically before carrying the block across the scene.","\u5148\u5782\u76F4\u62AC\u8D77\uFF0C\u518D\u642C\u8FD0\u65B9\u5757\u3002"],["Travel above target A","\u79FB\u52A8\u5230\u76EE\u6807 A \u4E0A\u65B9","Carry the object at clearance height.","\u5728\u5B89\u5168\u9AD8\u5EA6\u642C\u8FD0\u7269\u4F53\u3002"],["Lower onto target A","\u4E0B\u964D\u5230\u76EE\u6807 A","Lower gently before releasing; do not drop from travel height.","\u8F7B\u8F7B\u4E0B\u964D\u518D\u91CA\u653E\uFF0C\u4E0D\u8981\u4ECE\u79FB\u52A8\u9AD8\u5EA6\u629B\u4E0B\u3002"],["Release the block","\u91CA\u653E\u65B9\u5757","Switch DO1 OFF and check the target dashboard.","\u5173\u95ED DO1\uFF0C\u5E76\u68C0\u67E5\u76EE\u6807\u9762\u677F\u3002"],["Retreat upwards","\u5411\u4E0A\u64A4\u79BB","Move the empty tool clear of the placed object.","\u5C06\u7A7A\u5DE5\u5177\u79FB\u79BB\u5DF2\u653E\u7F6E\u7684\u7269\u4F53\u3002"]],S=()=>o(L[u]?.slice(0,2)||["Practice","\u7EC3\u4E60"]);function b(V,ie){let de=document.createElement("button");return de.type="button",de.textContent=V,de.onclick=ie,de}function R(V,ie){let de=document.createElement("p");return de.textContent=V,ie&&(de.className=ie),x.append(de),de}function U(){s(null),document.querySelectorAll(".quiz-highlight").forEach(V=>V.classList.remove("quiz-highlight"))}function G(){if(h!=="repeat")return[];let V=p[u];return f==="record"?[V.type==="move"?"record":"add-output"]:V.type==="move"?["tx","ty","tz","lesson-move"]:V.type==="output"?[V.value?"tool-on":"tool-off"]:["add-wait"]}document.querySelector("#target-form button[type=submit]").id="lesson-move";let Z=["#controls-panel","#program-panel .program",".viewport-arm-bar",".challenge-tool","#targets","#reset-task"];function j(){let V=G();for(let ie of Z){let de=document.querySelector(ie);if(de){de.inert=!l&&[".viewport-arm-bar",".challenge-tool","#targets","#reset-task"].includes(ie),de.classList.toggle("exercise-locked",!l&&h!=="repeat");for(let _e of de.querySelectorAll("button,input,select"))_e.inert=!l&&!V.includes(_e.id);de.matches("button")&&(de.inert=!l)}}document.body.classList.toggle("learning-active",!l),document.body.dataset.lessonStage=h,v.hidden=l,v.textContent=o(["Learn \u2192 Watch \u2192 Repeat \u2192 Run \u2192 Quiz \u2192 Independent task","\u5B66\u4E60 \u2192 \u89C2\u770B \u2192 \u8DDF\u7EC3 \u2192 \u8FD0\u884C \u2192 \u6D4B\u9A8C \u2192 \u72EC\u7ACB\u4EFB\u52A1"])}function W(V){r(V==="record"||V==="add-output"||V==="add-wait"?"record":V),document.getElementById(V)?.classList.add("quiz-highlight")}function re(){t.close(),l=!1,c=!1,w(),n.begin(),p=n.plan(),h="demo",_=!1,n.demo(),ee()}function q(){n.repeat(),u=0,f="act",h="repeat",n.prepare(p[u]),ee()}function F(){if(!c&&!l){Ce();return}n.finish(),h="quiz",U(),ee(),t.open()}function J(){h="practice-run",_=!1,n.play(),ee()}function ee(){d.textContent=o(document.documentElement.dataset.coach==="offline"?["Teacher help \xB7 built-in guidance","\u8001\u5E08\u5E2E\u52A9 \xB7 \u5185\u7F6E\u6307\u5BFC"]:["Ask your teacher \xB7 help and questions","\u5411\u8001\u5E08\u63D0\u95EE \xB7 \u5E2E\u52A9\u4E0E\u95EE\u9898"]),E.textContent=o(["Learn / lesson","\u5B66\u4E60 / \u8BFE\u7A0B"]),j(),h!=="quiz"&&U(),x.replaceChildren(),A.classList.remove("tour-mode"),R(o(["YOUR TEACHER \xB7 LEARN BY DOING","\u4F60\u7684\u8001\u5E08 \xB7 \u505A\u4E2D\u5B66"]),"lesson-progress");let V=document.createElement("h2");if(x.append(V),h==="intro")V.textContent=o(["Meet your robot","\u8BA4\u8BC6\u4F60\u7684\u673A\u5668\u4EBA"]),R(o(["A robot is a programmable machine that senses or acts in its environment. This arm uses rotating joints, rigid links and a tool to move objects. Robots can repeat precise tasks such as sorting and assembly.","\u673A\u5668\u4EBA\u662F\u4E00\u79CD\u53EF\u7F16\u7A0B\u7684\u673A\u5668\uFF0C\u53EF\u4EE5\u611F\u77E5\u73AF\u5883\u6216\u6267\u884C\u52A8\u4F5C\u3002\u8FD9\u4E2A\u673A\u68B0\u81C2\u7528\u65CB\u8F6C\u5173\u8282\u3001\u521A\u6027\u8FDE\u6746\u548C\u5DE5\u5177\u6765\u79FB\u52A8\u7269\u4F53\u3002\u673A\u5668\u4EBA\u80FD\u91CD\u590D\u6267\u884C\u5206\u62E3\u3001\u88C5\u914D\u7B49\u7CBE\u786E\u4EFB\u52A1\u3002"])),R(o(["It cannot reach everywhere, pass through obstacles or grasp every material. This is a simplified training simulation, not a real robot safety system.","\u5B83\u65E0\u6CD5\u5230\u8FBE\u6240\u6709\u4F4D\u7F6E\u3001\u7A7F\u8FC7\u969C\u788D\u7269\u6216\u6293\u53D6\u6240\u6709\u6750\u6599\u3002\u8FD9\u662F\u7B80\u5316\u7684\u8BAD\u7EC3\u6A21\u62DF\u5668\uFF0C\u4E0D\u662F\u771F\u5B9E\u673A\u5668\u4EBA\u7684\u5B89\u5168\u7CFB\u7EDF\u3002"])),R(o(["First I explain the controls, then demonstrate moving A. You repeat each action, take a quiz, and finally move both objects independently.","\u6211\u5148\u4ECB\u7ECD\u63A7\u4EF6\uFF0C\u518D\u6F14\u793A\u642C\u8FD0 A\u3002\u4F60\u8DDF\u7740\u91CD\u590D\u6BCF\u4E00\u6B65\uFF0C\u5B8C\u6210\u6D4B\u9A8C\uFF0C\u6700\u540E\u72EC\u7ACB\u642C\u8FD0\u4E24\u4E2A\u7269\u4F53\u3002"])),x.append(b(o(["Explore the robot \u2192","\u8BA4\u8BC6\u673A\u68B0\u81C2 \u2192"]),()=>{h="tour",u=0,ee()}));else if(h==="tour"){let ie=Ot[u];V.textContent=o(C[u]),R(`${u+1} / 6`,"lesson-progress"),R(o(ie.explain)),R(o(["Look for the yellow highlight. We will use these controls together next.","\u8BF7\u770B\u9EC4\u8272\u9AD8\u4EAE\u3002\u63A5\u4E0B\u6765\u6211\u4EEC\u4F1A\u4E00\u8D77\u4F7F\u7528\u8FD9\u4E9B\u63A7\u4EF6\u3002"]),"lesson-look"),ie.target&&s(ie.target),ie.ui&&W(ie.ui),x.append(b(o(["Back","\u4E0A\u4E00\u6B65"]),()=>{u?u--:h="intro",ee()}),b(o(u===5?a?["Start free practice \u2192","\u5F00\u59CB\u81EA\u7531\u7EC3\u4E60 \u2192"]:["Watch teacher demonstrate \u2192","\u89C2\u770B\u8001\u5E08\u6F14\u793A \u2192"]:["Next \u2192","\u4E0B\u4E00\u6B65 \u2192"]),()=>{u===5?a?Pe():re():(u++,ee())}))}else if(h==="demo"){V.textContent=o(["Watch: move A to its target","\u89C2\u770B\uFF1A\u628A A \u642C\u5230\u76EE\u6807\u533A"]),R(o(["Watch the robot and the highlighted program row. Notice the order: lift \u2192 approach \u2192 lower \u2192 grip \u2192 confirm \u2192 lift \u2192 travel \u2192 lower \u2192 release \u2192 retreat.","\u89C2\u5BDF\u673A\u5668\u4EBA\u548C\u9AD8\u4EAE\u7A0B\u5E8F\u884C\u3002\u6CE8\u610F\u987A\u5E8F\uFF1A\u62AC\u9AD8 \u2192 \u63A5\u8FD1 \u2192 \u4E0B\u964D \u2192 \u5939\u53D6 \u2192 \u786E\u8BA4 \u2192 \u62AC\u8D77 \u2192 \u642C\u8FD0 \u2192 \u4E0B\u964D \u2192 \u91CA\u653E \u2192 \u64A4\u79BB\u3002"]));let ie=R("","lesson-look");ie.id="lesson-live",x.append(b(o(["Pause / resume demo","\u6682\u505C / \u7EE7\u7EED\u6F14\u793A"]),()=>document.getElementById("pause").click()),b(o(["Restart demonstration","\u91CD\u65B0\u6F14\u793A"]),re))}else if(h==="repeat-ready")V.textContent=o(["Now you try","\u73B0\u5728\u4F60\u6765\u8BD5\u8BD5"]),R(o(["A is placed. Now repeat the same task using the real controls. I will provide each coordinate and highlight the next action. Record each movement and tool command as you go.","A \u5DF2\u653E\u597D\u3002\u73B0\u5728\u4F7F\u7528\u771F\u5B9E\u63A7\u4EF6\u91CD\u590D\u4EFB\u52A1\u3002\u6211\u4F1A\u63D0\u4F9B\u5750\u6807\u5E76\u9AD8\u4EAE\u4E0B\u4E00\u6B65\u64CD\u4F5C\u3002\u8BF7\u9010\u6B65\u8BB0\u5F55\u79FB\u52A8\u548C\u5DE5\u5177\u6307\u4EE4\u3002"])),x.append(b(o(["Repeat with guidance \u2192","\u5F00\u59CB\u8DDF\u7EC3 \u2192"]),q),b(o(["Watch again","\u518D\u770B\u4E00\u6B21"]),re));else if(h==="demo-error")V.textContent=o(["Demonstration stopped","\u6F14\u793A\u5DF2\u505C\u6B62"]),R(o(["The robot did not finish placing A. Restart the demonstration to restore the practice scene.","\u673A\u5668\u4EBA\u672A\u5B8C\u6210\u653E\u7F6E A\u3002\u8BF7\u91CD\u65B0\u6F14\u793A\u4EE5\u6062\u590D\u7EC3\u4E60\u573A\u666F\u3002"])),x.append(b(o(["Restart demonstration","\u91CD\u65B0\u6F14\u793A"]),re));else if(h==="repeat"){let ie=p[u];V.textContent=`${u+1} / ${p.length} \xB7 ${S()}`,R(o(L[u].slice(2)));let de;if(f==="record")de=ie.type==="move"?o(["Position reached. Click Record current position to save this waypoint.","\u5DF2\u5230\u8FBE\u3002\u70B9\u51FB\u201C\u8BB0\u5F55\u5F53\u524D\u4F4D\u7F6E\u201D\u4FDD\u5B58\u8DEF\u5F84\u70B9\u3002"]):o(["Signal checked. Click Set DO1 to record this tool command.","\u4FE1\u53F7\u5DF2\u68C0\u67E5\u3002\u70B9\u51FB\u201C\u8BBE\u7F6E DO1\u201D\u8BB0\u5F55\u5DE5\u5177\u6307\u4EE4\u3002"]);else if(ie.type==="move"){let _e=n.target(ie).map(Ae=>Ae.toFixed(1)).join(", ");de=o([`Target XYZ: ${_e} mm. Coordinates are filled in. Click Move to XYZ and watch the tool position change.`,`\u76EE\u6807 XYZ\uFF1A${_e} \u6BEB\u7C73\u3002\u5750\u6807\u5DF2\u586B\u597D\u3002\u70B9\u51FB\u201C\u79FB\u52A8\u5230 XYZ\u201D\uFF0C\u89C2\u5BDF\u5DE5\u5177\u4F4D\u7F6E\u53D8\u5316\u3002`])}else de=ie.type==="wait"?o(["Click Wait DI1 to record the confirmation step (ON).","\u70B9\u51FB\u201C\u7B49\u5F85 DI1\u201D\u8BB0\u5F55\u786E\u8BA4\u6B65\u9AA4\uFF08ON\uFF09\u3002"]):o(ie.value?["Click ON \xB7 Activate. DI1 must turn ON before continuing.","\u70B9\u51FB\u201CON \xB7 \u6FC0\u6D3B\u201D\u3002\u7EE7\u7EED\u524D DI1 \u5FC5\u987B\u53D8\u4E3A ON\u3002"]:["Click OFF \xB7 Release. Object A must land in its target.","\u70B9\u51FB\u201COFF \xB7 \u91CA\u653E\u201D\u3002\u7269\u4F53 A \u5FC5\u987B\u653E\u5165\u76EE\u6807\u533A\u3002"]);R(de,"lesson-look");for(let _e of G())W(_e);x.append(b(o(["Restore this target","\u6062\u590D\u672C\u6B65\u76EE\u6807"]),()=>{n.prepare(ie),ee()}),b(o(["Restart guided practice","\u91CD\u65B0\u8DDF\u7EC3"]),q))}else if(h==="run-ready"||h==="run-error")V.textContent=o(h==="run-ready"?["Play the program you built","\u8FD0\u884C\u4F60\u7F16\u5199\u7684\u7A0B\u5E8F"]:["The program stopped early","\u7A0B\u5E8F\u63D0\u524D\u505C\u6B62"]),R(o(h==="run-ready"?["All ten instructions are recorded. Now press Run your program: the scene resets and the robot executes your own recorded moves, DO1 commands and DI1 wait. Watch it place A without manual help.","\u5341\u6761\u6307\u4EE4\u5DF2\u8BB0\u5F55\u3002\u70B9\u51FB\u201C\u8FD0\u884C\u4F60\u7684\u7A0B\u5E8F\u201D\uFF1A\u573A\u666F\u91CD\u7F6E\u540E\uFF0C\u673A\u5668\u4EBA\u5C06\u6267\u884C\u4F60\u8BB0\u5F55\u7684\u79FB\u52A8\u3001DO1 \u6307\u4EE4\u548C DI1 \u7B49\u5F85\u3002\u89C2\u5BDF\u5B83\u81EA\u52A8\u653E\u597D A\u3002"]:["The run did not finish successfully. Retry from the reset scene, or repeat the guided practice.","\u7A0B\u5E8F\u672A\u6210\u529F\u5B8C\u6210\u3002\u8BF7\u91CD\u7F6E\u540E\u91CD\u8BD5\uFF0C\u6216\u91CD\u65B0\u8DDF\u7EC3\u3002"])),x.append(b(o(["\u25B6 Run your program","\u25B6 \u8FD0\u884C\u4F60\u7684\u7A0B\u5E8F"]),J),b(o(["Repeat guided practice","\u91CD\u65B0\u8DDF\u7EC3"]),q));else if(h==="practice-run"){V.textContent=o(["Your program is running","\u4F60\u7684\u7A0B\u5E8F\u6B63\u5728\u8FD0\u884C"]),R(o(["Watch each recorded instruction execute. Check DI1 during pickup and the target dashboard after release. Finish the run to continue to the quiz.","\u89C2\u5BDF\u6BCF\u6761\u5DF2\u8BB0\u5F55\u6307\u4EE4\u6267\u884C\u3002\u6293\u53D6\u65F6\u68C0\u67E5 DI1\uFF0C\u91CA\u653E\u540E\u68C0\u67E5\u76EE\u6807\u9762\u677F\u3002\u8FD0\u884C\u5B8C\u6210\u540E\u5373\u53EF\u7EE7\u7EED\u6D4B\u9A8C\u3002"]));let ie=R("","lesson-look");ie.id="lesson-live",x.append(b(o(["Pause / resume","\u6682\u505C / \u7EE7\u7EED"]),()=>document.getElementById("pause").click()),b(o(["Stop program","\u505C\u6B62\u7A0B\u5E8F"]),()=>document.getElementById("stop").click()))}else h==="quiz-ready"?(V.textContent=o(["Your program worked!","\u4F60\u7684\u7A0B\u5E8F\u6210\u529F\u4E86\uFF01"]),R(o(["Your recorded program placed A and completed its retreat. You can run it again, or take the quiz. Your previous saved program will be restored when you continue.","\u4F60\u8BB0\u5F55\u7684\u7A0B\u5E8F\u5DF2\u653E\u597D A \u5E76\u5B8C\u6210\u64A4\u79BB\u3002\u53EF\u4EE5\u518D\u6B21\u8FD0\u884C\uFF0C\u6216\u5F00\u59CB\u6D4B\u9A8C\u3002\u7EE7\u7EED\u540E\u5C06\u6062\u590D\u539F\u6709\u4FDD\u5B58\u7684\u7A0B\u5E8F\u3002"])),x.append(b(o(["\u25B6 Run again","\u25B6 \u518D\u6B21\u8FD0\u884C"]),J),b(o(["Take the quiz \u2192","\u5F00\u59CB\u6D4B\u9A8C \u2192"]),F))):h==="quiz"?(V.textContent=o(["Check your understanding","\u68C0\u67E5\u7406\u89E3"]),R(o(["Answer the quiz beside the robot. Use the highlighted model parts and controls. You can ask me for a hint; I will not choose the answer for you.","\u5B8C\u6210\u673A\u68B0\u81C2\u65C1\u7684\u6D4B\u9A8C\uFF0C\u89C2\u5BDF\u9AD8\u4EAE\u90E8\u4EF6\u548C\u63A7\u4EF6\u3002\u4F60\u53EF\u4EE5\u5411\u6211\u8BE2\u95EE\u63D0\u793A\uFF0C\u4F46\u6211\u4E0D\u4F1A\u66FF\u4F60\u9009\u62E9\u7B54\u6848\u3002"])),x.append(b(o(["Show quiz","\u663E\u793A\u6D4B\u9A8C"]),()=>t.open()))):(V.textContent=o(["Your independent challenge","\u4F60\u7684\u72EC\u7ACB\u6311\u6218"]),R(o(["Move both A and B to their matching target areas. B starts on an obstacle: plan clearance before travelling. Build a program with movements, DO1 commands and DI1 feedback. I can help you plan, but you choose the steps.","\u628A A \u548C B \u642C\u5230\u5BF9\u5E94\u76EE\u6807\u533A\u3002B \u4F4D\u4E8E\u969C\u788D\u7269\u4E0A\uFF0C\u8BF7\u5148\u89C4\u5212\u5B89\u5168\u95F4\u9699\u3002\u7528\u79FB\u52A8\u3001DO1 \u6307\u4EE4\u548C DI1 \u53CD\u9988\u7F16\u5199\u7A0B\u5E8F\u3002\u6211\u53EF\u4EE5\u5E2E\u52A9\u89C4\u5212\uFF0C\u4F46\u6B65\u9AA4\u7531\u4F60\u51B3\u5B9A\u3002"])),x.append(b(o(["Start guided lesson","\u5F00\u59CB\u5F15\u5BFC\u8BFE\u7A0B"]),be)));l||x.append(b(o(["Leave lesson \xB7 free practice","\u9000\u51FA\u8BFE\u7A0B \xB7 \u81EA\u7531\u7EC3\u4E60"]),Pe)),e.fit()}function be(){t.close(),n.finish(),a=!1,l=!1,c=!1,h="intro",u=0,w(),Ce()}function Oe(){t.close(),n.finish(),a=!0,l=!1,h="tour",u=0,w(),Ce()}function Pe(){t.close(),n.finish(),l=!0,h="independent",ee(),w(),e.collapse()}function Ce(){l&&r("record"),e.showLesson(!1),ee()}function K(){if(!c){h="independent",ee(),e.collapse();return}l=!0,h="independent",localStorage.setItem("robot-learning-v2",JSON.stringify({unlocked:!0})),ee(),w(),e.collapse()}return setInterval(()=>{if(h!=="demo"&&h!=="repeat"&&h!=="practice-run")return;let V=n.state();if(h==="practice-run"){_||(_=V.busy);let Ae=document.getElementById("lesson-live");Ae&&(Ae.textContent=o(["Running your instructions","\u6B63\u5728\u6267\u884C\u4F60\u7684\u6307\u4EE4"])+` \xB7 ${Math.max(0,V.active+1)} / ${V.steps.length}`),_&&!V.busy&&(V.score===1&&V.completed?(c=!0,t.reset(),h="quiz-ready"):h="run-error",ee());return}if(h==="demo"){_||(_=V.busy);let Ae=document.getElementById("lesson-live");Ae&&(Ae.textContent=o(["Teacher demonstration","\u8001\u5E08\u6F14\u793A"])+` \xB7 ${V.active+1} / ${p.length}`+(V.active>=0?" \xB7 "+o(L[V.active]?.slice(0,2)||["",""]):"")),_&&!V.busy&&(h=V.score===1?"repeat-ready":"demo-error",ee());return}if(h!=="repeat"||V.busy)return;let ie=p[u];if(f==="act"&&ie.type!=="wait"){(ie.type==="move"?Math.hypot(...V.tcp.map((pt,I)=>pt-n.target(ie)[I]))<.8:V.output===ie.value&&(ie.value?V.input:V.score===1))&&(f="record",ee());return}let de=V.steps[u];V.steps.length!==u+1||!de||de.type!==ie.type||!(ie.type==="move"?Math.hypot(...n.target(de).map((Ae,pt)=>Ae-n.target(ie)[pt]))<.8:de.value===ie.value)||(u++,f="act",u===p.length?h="run-ready":n.prepare(p[u]),ee())},150),E.onclick=Ce,document.getElementById("open-quiz").onclick=F,new MutationObserver(ee).observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),ee(),e.collapse(),{open:Ce,startQuiz:F,complete:K,startGuided:be,startTour:Oe,freePractice:Pe,context:()=>({lessonComplete:c,unlocked:l,stage:h,lessonStep:u,phase:f,instruction:x.innerText,allowedControls:G()})}}var Lr=null,ji=null,vc=null,$=i=>document.getElementById(i),_n="en",Ze=3,lt="gripper",Ke=[...Ft.home],Ye=[],xn={},Ji=!0,bc="sliders";for(let i of Dr)for(let e=3;e<=6;e++)xn[`${i}-${e}`]=[];var St=null,Si=null,Ut=!1,In=!1,rn=-1,qu=performance.now(),ks="taskReady",Mc=!1,Jt,zs=()=>`${lt}-${Ze}`,He=i=>((_n==="en"?Lt:Nt)[i]||i).replaceAll("{n}",String(Ze)).replaceAll("{reach}",String(Ai(Ze)));try{let i=localStorage.getItem("robot-arm-lab-v3");if(i){let e=JSON.parse(i);for(let t of Dr)for(let n=3;n<=6;n++){let s=`${t}-${n}`;xn[s]=Xs({version:3,jointCount:n,tool:t,steps:e.programs[s]||[]}).steps}Number.isInteger(e.activeJointCount)&&e.activeJointCount>=3&&e.activeJointCount<=6&&(Ze=e.activeJointCount),Dr.includes(e.tool)&&(lt=e.tool),Ji=e.showTrail!==!1}else{let e=localStorage.getItem("robot-arm-lab-v2");if(e){let t=JSON.parse(e);for(let n=3;n<=6;n++)xn[`gripper-${n}`]=Xs({version:2,jointCount:n,steps:t.programs[n]||[]}).steps;Number.isInteger(t.activeJointCount)&&t.activeJointCount>=3&&t.activeJointCount<=6&&(Ze=t.activeJointCount),Ji=t.showTrail!==!1}else{let t=localStorage.getItem("robot-arm-lab-v1");t&&(xn["gripper-3"]=Xs(JSON.parse(t)).steps)}}_n=localStorage.getItem("robot-arm-lang")==="zh"?"zh":"en"}catch{}Ye=xn[zs()];Ke=yn(Ze);var Ve=new Bs(lt);function tt(i,e=!1,t=!0){ks=i,Mc=e,$("notice").textContent=He(i),$("notice").className=e?"error":"",t&&zu(i,e)&&vc?.reportFailure({code:i,text:He(i),error:e,step:rn>=0?rn+1:null})}try{Jt=Lu($("viewport")),Jt.setTrail(Ji)}catch(i){console.error(i),tt("noWebGL",!0)}function Wn(){if(!ji){xn[zs()]=Ye;try{localStorage.setItem("robot-arm-lab-v3",JSON.stringify({activeJointCount:Ze,tool:lt,programs:xn,showTrail:Ji}))}catch{tt("storage",!0)}}}function Q_(){$("active-tool-name").textContent=He(lt),$("challenge-name").textContent=He(lt+"Task"),$("score").textContent=`${Ve.score} / 2`,$("challenge-progress").setAttribute("aria-valuenow",String(Ve.score)),$("challenge-progress").firstElementChild.style.width=Ve.score/2*100+"%",Ve.objects.forEach(i=>{let e=$("dashboard-"+i.id.toLowerCase()),t=i.placed?"delivered":i.status==="held"?"held":i.id==="B"?"raisedItem":"tableItem";e.textContent=i.id+" "+(i.placed?"\u2713":i.status==="held"?"\u2191":"\u25CB"),e.className="dashboard-object "+(i.placed?"done":i.status==="held"?"holding":""),e.title=He(t),e.setAttribute("aria-label",i.id+": "+He(t))})}function Ur(){let i=Ve.input;Ve.update(Ke),!i&&Ve.input&&tt("grasped"),Q_(),Jt?.taskState(Ve.snapshot()),$("do-state").textContent=Ve.output?"ON":"OFF",$("di-state").textContent=Ve.input?"ON":"OFF",$("do-state").className=Ve.output?"on":"",$("di-state").className=Ve.input?"on":"",$("tool-on").setAttribute("aria-pressed",String(Ve.output)),$("tool-off").setAttribute("aria-pressed",String(!Ve.output))}function Nr(i){Ke=[...i],Jt?.pose(Ke),Ur();let e=Rt(Ke);["px","py","pz"].forEach((t,n)=>$(t).textContent=(Math.abs(e.tip[n])<.05?0:e.tip[n]).toFixed(1)),["oroll","opitch","oyaw"].forEach((t,n)=>$(t).textContent=(Math.abs(e.rpy[n])<.05?0:e.rpy[n]).toFixed(1)),Ke.forEach((t,n)=>{$("slider"+n).value=t,$("angle"+n).value=t.toFixed(1)}),$("singularity").textContent=He(Ze===3?Math.abs(Math.sin(Ke[2]*Math.PI/180))<.08?"singular":"normal":"extraMotion")}function Ei(){let i=!!St||Ut;$("jog-distance").disabled=i,$("jog-angle").disabled=i||Ze!==6,document.querySelectorAll("[data-jog]").forEach(e=>e.disabled=i||Number(e.dataset.jog)>=3&&Ze!==6),$("jog-orientation-hint").textContent=He(Ze===6?"jogOrientation":"jogLocked"),document.querySelectorAll("#joints input,#target-form input,#target-form select,#target-form button,#steps input,#steps button,#steps select").forEach(e=>e.disabled=i),["record","home","demo","import","run","tool-select","tool-on","tool-off","add-output","add-wait","add-delay","instruction-value","reset-task"].forEach(e=>$(e).disabled=i||e==="run"&&!Ye.length),$("add-joint").disabled=i||Ze===6,$("remove-joint").disabled=i||Ze===3,document.querySelectorAll("#targets button").forEach(e=>e.disabled=i),$("use-orientation").disabled=i||Ze!==6,$("branch").hidden=Ze!==3,$("orientation-fields").hidden=!$("use-orientation").checked,["tr","tp","tw"].forEach(e=>{$(e).disabled=i||!$("use-orientation").checked,$(e).required=$("use-orientation").checked}),$("pause").disabled=!i,$("stop").disabled=!i,$("pause").textContent=He(In?"resume":"pause"),$("state").textContent=He(In?"paused":Ut?"running":St?"moving":"ready")}function e0(){$("joints").replaceChildren(),hn.slice(0,Ze).forEach((i,e)=>{let t=document.createElement("div");t.className="joint",t.innerHTML=`<div class="joint-title"><label for="slider${e}">J${e+1} <span> / ${He(i.name)}</span></label><span class="number"><input id="angle${e}" aria-label="${He(i.name)} angle" type="number" min="${i.limits[0]}" max="${i.limits[1]}" step="0.1">\xB0</span></div><input id="slider${e}" type="range" min="${i.limits[0]}" max="${i.limits[1]}" step="0.1"><div class="joint-limits"><span>${i.limits[0]}\xB0</span><span>${e?i.length+" mm":He("rotation")}</span><span>${i.limits[1]}\xB0</span></div>`,$("joints").append(t);let n=s=>{if(St||Ut)return;let r=[...Ke];r[e]=s.target.value===""?NaN:Number(s.target.value),Dn(r)&&!Ve.canMove(Ke,r)?(Nr(r),tt("welcome")):(Nr(Ke),tt(Dn(r)&&Ve.canMove(Ke,r)||"blocked",!0))};$("slider"+e).addEventListener("input",n),$("angle"+e).addEventListener("change",n)}),$("joint-count").textContent=`${Ze} / 6`,$("joint-chain").replaceChildren(),hn.forEach((i,e)=>{let t=document.createElement("span");t.textContent=`J${e+1}`,t.className=e<Ze?"installed":"",t.title=He(i.name),$("joint-chain").append(t)}),$("arm-info").textContent=He("armInfo")+" "+He(["","","","nextSwivel","nextPitch","nextRoll","allJoints"][Ze]),$("orientation-hint").textContent=He(Ze===6?"orientationHelp":"orientationLocked")}function Ki(){$("task-title").textContent=He(lt+"Task"),$("task-description").textContent=He(lt+"Mission"),$("tool-description").textContent=He(lt+"Description"),$("task-rules").textContent=He("taskRules"),$("targets").replaceChildren(),Ve.objects.forEach((i,e)=>{let t=document.createElement("div");t.className="task-card"+(i.placed?" done":"");let n=Ve.spec.targets[e],s=Ve.contact(i);t.innerHTML=`<div class="task-card-heading"><span class="object-badge ${e?"b":""}">${i.id}</span><small>${He(i.placed?"delivered":i.status==="held"?"held":e?"raisedItem":"tableItem")}</small></div><div class="task-coordinates">${He("pickup")} ${s.map(r=>r.toFixed(0)).join(" / ")}<br>${He("destination")} ${n.center[0]} / ${n.center[1]}</div><div class="task-actions"><button data-target="above">${He("approach")}</button><button data-target="pick">${He("pickup")}</button><button data-target="place">${He("destination")}</button></div>`,t.querySelectorAll("button").forEach(r=>r.onclick=()=>{if(St||Ut)return;let o=r.dataset.target,a=o==="above"?[s[0],s[1],lt==="gripper"?190:170]:o==="pick"?s:[n.center[0],n.center[1],i.size[2]+2];["tx","ty","tz"].forEach((l,c)=>$(l).value=a[c].toFixed(2)),Ze===6&&lt!=="gripper"&&($("use-orientation").checked=!0,$("tr").value=0,$("tp").value=0,$("tw").value=(Math.atan2(a[1],a[0])*180/Math.PI).toFixed(2)),$("challenge-menu").open=!1,Vs("controls"),Or("xyz"),Ei(),tt("coordinatesFilled")}),$("targets").append(t)}),$("score").textContent=`${Ve.score} / 2`,$("task-feedback").textContent=Ve.score===2?He("taskWon"):He(Ve.lastEvent),Ur()}function on(){$("steps").replaceChildren(),$("count").textContent=Ye.length,$("empty").hidden=Ye.length>0,Ye.forEach((i,e)=>{let t=i.type||"move",n=document.createElement("li");n.className=e===rn?"active":"";let s="";t==="move"?s=`<div class="step-details">XYZ ${Rt(i.q).tip.map(l=>l.toFixed(1)).join(" / ")} mm</div>`:(t==="output"||t==="wait")&&(s=`<select class="step-value" aria-label="${t==="output"?"DO1":"DI1"} ${e+1}"><option value="true">${t==="output"?"DO1":"DI1"} = ON / 1</option><option value="false">${t==="output"?"DO1":"DI1"} = OFF / 0</option></select>`),n.innerHTML=`<div class="step-top"><span>${String(e+1).padStart(2,"0")}</span><span class="step-type">${{move:"MOVE",output:"DO1",wait:"WAIT",delay:"DELAY"}[t]}</span><input class="step-name" maxlength="60" aria-label="Step ${e+1} name"></div>${s}<div class="step-bottom"><label>${t==="wait"?He("timeout")+" ":""}<input type="number" min="${t==="move"?.5:.1}" max="${t==="move"?15:30}" step="any" aria-label="Step ${e+1} seconds"> ${He("seconds")}</label>${t==="move"?`<button data-action="go">${He("go")}</button>`:""}<button data-action="up" aria-label="${He("up")}">\u2191</button><button data-action="down" aria-label="${He("down")}">\u2193</button><button data-action="remove" aria-label="${He("remove")}">\xD7</button></div>`,n.querySelector(".step-name").value=i.name,n.querySelector(".step-name").onchange=a=>{i.name=a.target.value.trim()||`${He("step")} ${e+1}`,Wn(),on()};let r=n.querySelector(".step-value");r&&(r.value=String(i.value),r.onchange=()=>{i.value=r.value==="true",Wn()});let o=n.querySelector("input[type=number]");o.value=i.seconds,o.onchange=()=>{let a=Number(o.value);a>=(t==="move"?.5:.1)&&a<=(t==="move"?15:30)&&(i.seconds=a),o.value=i.seconds,Wn()},n.querySelectorAll("button").forEach(a=>a.onclick=()=>{if(!(St||Ut)){switch(a.dataset.action){case"go":Fr(i.q,i.seconds);break;case"up":e>0&&([Ye[e-1],Ye[e]]=[Ye[e],Ye[e-1]]);break;case"down":e<Ye.length-1&&([Ye[e+1],Ye[e]]=[Ye[e],Ye[e+1]]);break;case"remove":Ye.splice(e,1);break}Wn(),on()}}),$("steps").append(n)}),Ei()}function Hs(){document.documentElement.lang=_n,document.querySelectorAll("[data-t]").forEach(i=>i.innerHTML=He(i.dataset.t)),$("language").textContent="\u{1F310} English / \u4E2D\u6587",$("show-trail").checked=Ji,$("tool-select").value=lt,e0(),Nr(Ke),Ki(),on(),tt(ks,Mc,!1),Ei()}function Va(){St=null,Si=null,rn=-1,Ve.reset(lt),Ke=yn(Ze),Jt?.clearTrail(),Nr(Ke),Ki(),on(),tt("taskReady")}function Ga(i,e=lt){let t=e!==lt;St||Ut||i<3||i>6||!Dr.includes(e)||(xn[zs()]=Ye,Ze=i,lt=e,Ye=xn[zs()],Ke=yn(i),Ve.reset(lt),rn=-1,$("use-orientation").checked=lt!=="gripper"&&i===6,Jt?.clearTrail(),Hs(),Wn(),tt(t?"toolChanged":"armChanged"))}function Fr(i,e=2){let t=Ve.canMove(Ke,i);return t?(tt(t,!0),!1):(St={from:[...Ke],to:[...i],elapsed:0,duration:e},In=!1,tt("moving"),Ei(),!0)}function $i(i="stopped",e=!1){St=null,Si=null,Ut=!1,In=!1,rn=-1,on(),tt(i,e)}function Ha(){if(rn++,rn>=Ye.length){Ut=!1,rn=-1,St=null,Si=null,on(),Ki(),tt(Ve.score===2?"taskWon":"complete");return}let i=Ye[rn],e=i.type||"move";if(Si=null,e==="move"){if(!Fr(i.q,i.seconds)){$i(ks,!0);return}}else e==="output"&&(Ve.command(i.value,Ke),Ur(),Ki(),tt(Ve.lastEvent)),Si={type:e,elapsed:0,step:i},Ei();on();let t=$("steps"),n=t.children[rn];if(n&&!ji){let s=document.querySelector(".right-program"),r=n.getBoundingClientRect().bottom-s.getBoundingClientRect().bottom;r>0&&(s.scrollTop+=r+20)}}function Yu(i){let e=Math.min((i-qu)/1e3,.1)*Number($("speed").value);if(qu=i,!In){if(St){St.elapsed+=e;let t=Math.min(1,St.elapsed/St.duration),n=t*t*(3-2*t),s=St.from.map((o,a)=>o+(St.to[a]-o)*n),r=Ve.collision(s);r?$i(r,!0):(Nr(s),t>=1&&(St=null,Ut?Ha():(tt("ready"),Ei(),Ki())))}else if(Ut&&Si){Si.elapsed+=e;let{type:t,step:n,elapsed:s}=Si;t==="wait"?Ve.input===n.value?Ha():s>=n.seconds&&$i("waitTimeout",!0):s>=n.seconds&&Ha()}}requestAnimationFrame(Yu)}$("target-form").onsubmit=i=>{if(i.preventDefault(),St||Ut)return;let e=n=>n.map(s=>$(s).value===""?NaN:Number($(s).value)),t=Ws(e(["tx","ty","tz"]),Ke,$("branch").value,$("use-orientation").checked?e(["tr","tp","tw"]):null);t.error?tt(t.error,!0):Fr(t.q)};$("copy-pose").onclick=()=>{let i=Rt(Ke);["tx","ty","tz"].forEach((e,t)=>$(e).value=i.tip[t].toFixed(2)),["tr","tp","tw"].forEach((e,t)=>$(e).value=i.rpy[t].toFixed(2)),Wa(),tt("poseCopied")};$("use-orientation").onchange=Ei;$("home").onclick=()=>Fr(yn(Ze));$("add-joint").onclick=()=>Ga(Ze+1);$("remove-joint").onclick=()=>Ga(Ze-1);$("record").onclick=()=>{if(Ye.length>=200){tt("max",!0);return}Ye.push({type:"move",name:`${He("step")} ${Ye.length+1}`,q:[...Ke],seconds:2}),Wn(),on(),tt("recorded")};$("run").onclick=()=>{if(!Ye.length){tt("emptyProgram",!0);return}Va(),Ut=!0,In=!1,rn=-1,Ha()};$("pause").onclick=()=>{In=!In,Ei()};$("stop").onclick=()=>$i();$("reset-task").onclick=()=>Va();$("demo").onclick=()=>{let i=_c(lt,Ze);if(i.error){tt(i.error,!0);return}Ye.length&&!confirm(He("replaceExample"))||(Ye=i.steps,Wn(),Va(),on(),tt("loadedTask"))};$("export").onclick=()=>{let i={version:3,robot:"robot-arm-task-lab",jointCount:Ze,tool:lt,units:"mm-degrees",steps:Ye},e=document.createElement("a"),t=URL.createObjectURL(new Blob([JSON.stringify(i,null,2)],{type:"application/json"}));e.href=t,e.download=`robot-arm-${lt}-${Ze}-joints.json`,e.click(),setTimeout(()=>URL.revokeObjectURL(t),1e3),tt("exported")};$("import").onclick=()=>$("file").click();$("file").onchange=async i=>{let e=i.target.files[0];if(e)try{if(e.size>25e4)throw Error("size");let t=Xs(JSON.parse(await e.text()));if(St||Ut)return;let n=t.tool||"gripper",s=`${n}-${t.jointCount}`;if(xn[s].length&&!confirm(He("replaceImport")))return;xn[zs()]=Ye,s===zs()&&(Ye=t.steps),xn[s]=t.steps,Ga(t.jointCount,n),Wn(),on(),tt("imported")}catch{tt("badfile",!0)}finally{i.target.value=""}};$("tool-select").onchange=i=>Ga(Ze,i.target.value);$("tool-on").onclick=()=>{Ve.command(!0,Ke),Ur(),Ki(),tt(Ve.lastEvent)};$("tool-off").onclick=()=>{Ve.command(!1,Ke),Ur(),Ki(),tt(Ve.lastEvent)};function Sc(i){if(Ye.length>=200){tt("max",!0);return}let e=$("instruction-value").value==="true";Ye.push({type:i,name:He(i==="output"?"setOutput":i==="wait"?"waitInput":"delay"),seconds:i==="wait"?3:i==="delay"?1:.4,...i!=="delay"?{value:e}:{}}),Wn(),on(),tt("instructionAdded")}$("add-output").onclick=()=>Sc("output");$("add-wait").onclick=()=>Sc("wait");$("add-delay").onclick=()=>Sc("delay");$("language").onclick=()=>{_n=_n==="en"?"zh":"en";try{localStorage.setItem("robot-arm-lang",_n)}catch{}Hs()};$("help").onclick=()=>$("guide").showModal();$("close-guide").onclick=()=>$("guide").close();$("cube-home").onclick=()=>Jt?.view("iso");$("reach").onchange=i=>Jt?.setReach(i.target.checked);$("clear-trail").onclick=()=>Jt?.clearTrail();$("show-trail").onchange=i=>{Ji=i.target.checked,Jt?.setTrail(Ji),Wn()};function Wa(){["tx","ty","tz"].forEach((i,e)=>{let t=$(i+"-range");if(!t)return;let n=Ai(Ze);t.min=e===2?0:-n,t.max=e===2?Ft.base+n:n,t.value=$(i).value})}function Or(i){Wa(),bc=i,$("slider-controls").hidden=i!=="sliders",$("target-form").hidden=i!=="xyz",$("jog-controls").hidden=i!=="jog",document.querySelectorAll("[data-mode]").forEach(e=>e.setAttribute("aria-pressed",String(e.dataset.mode===i)))}document.querySelectorAll("[data-mode]").forEach(i=>i.onclick=()=>Or(i.dataset.mode));document.querySelectorAll("[data-jog]").forEach(i=>i.onclick=()=>{if(St||Ut)return;let e=Number(i.dataset.jog),t=Number(i.dataset.sign),n=Rt(Ke),s=[...n.tip],r=Ze===6?[...n.rpy]:null;if(e<3)s[e]+=t*Number($("jog-distance").value);else{if(!r)return;r[e-3]=(r[e-3]+t*Number($("jog-angle").value)+540)%360-180}let o=Ws(s,Ke,"nearest",r);o.error?tt(o.error,!0):Fr(o.q,.4)});Hs();Or(bc);requestAnimationFrame(Yu);function Vs(i){i==="program"&&innerWidth<640&&$("program-panel").scrollIntoView({block:"start",behavior:"smooth"}),document.querySelector("main").dataset.panel=i,document.querySelectorAll("[data-panel-choice]").forEach(e=>e.setAttribute("aria-pressed",String(e.dataset.panelChoice===i)))}document.querySelectorAll("[data-panel-choice]").forEach(i=>i.onclick=()=>Vs(i.dataset.panelChoice));document.addEventListener("keydown",i=>{i.key==="Escape"&&$("challenge-menu").open&&($("challenge-menu").open=!1,$("challenge-menu").querySelector("summary").focus())});document.addEventListener("click",i=>{$("challenge-menu").contains(i.target)||($("challenge-menu").open=!1)});Ic();["tx","ty","tz"].forEach((i,e)=>{let t=$(i),n=document.createElement("input");n.type="range",n.id=i+"-range",n.step="1",n.setAttribute("aria-label","Target "+["X","Y","Z"][e]+" (mm)"),t.after(n),n.addEventListener("input",()=>{t.value=n.value}),t.addEventListener("input",Wa)});Wa();var Zu=Wu({onComplete:()=>Lr?.complete(),language:()=>_n,highlight:i=>Jt?.setQuizTarget(i),onOpen:()=>{Ut&&!In&&$("pause").click()},reveal:i=>{Vs(i==="record"?"program":"controls")}}),t0=new ResizeObserver(()=>{$("viewport").style.setProperty("--status-height",document.querySelector(".viewport-status").offsetHeight+"px")});t0.observe(document.querySelector(".viewport-status"));vc=Gu(()=>({learning:Lr?.context(),status:{code:ks,text:He(ks),error:Mc},quiz:Zu.context(),language:_n,challenge:He(lt+"Task"),tool:lt,jointCount:Ze,joints:[...Ke],tcp:Rt(Ke).tip,orientation:Rt(Ke).rpy,score:Ve.score,output:Ve.output,input:Ve.input,playing:Ut,paused:In,movementMode:bc,steps:Ye.map(i=>({...i})),world:Ve.snapshot()}),()=>Lr?.startQuiz());var n0={begin(){document.querySelector(".right-program").scrollTop=0,ji||(ji={tool:lt,jointCount:Ze,steps:structuredClone(Ye),q:[...Ke]}),$i(),lt="gripper",Ze=3,Ye=[],Ke=yn(3),Ve.reset(lt),$("use-orientation").checked=!1,Hs(),Jt?.clearTrail()},plan(){return _c("gripper",3).steps.slice(0,10)},demo(){Ye=structuredClone(this.plan()),$("speed").value="1",on(),$("run").click()},play(){on(),$("run").click()},repeat(){$i(),Ye=[],Va(),Or("xyz")},prepare(i){if(i.type==="move"){let e=Rt(i.q).tip;["tx","ty","tz"].forEach((t,n)=>$(t).value=e[n].toFixed(3)),Or("xyz"),Vs("controls")}else $("instruction-value").value=String(i.value),Vs(i.type==="wait"?"program":"controls")},state(){return{busy:!!St||Ut,completed:ks==="complete",active:rn,playing:Ut,paused:In,q:[...Ke],tcp:Rt(Ke).tip,output:Ve.output,input:Ve.input,score:Ve.score,steps:structuredClone(Ye)}},target(i){return Rt(i.q).tip},finish(){if(!ji)return;let i=ji;$i(),ji=null,lt=i.tool,Ze=i.jointCount,Ye=i.steps,Ke=yn(Ze),Ve.reset(lt),Hs(),Jt?.clearTrail()}};Lr=Xu({language:()=>_n,coach:vc,quiz:Zu,training:n0,highlight:i=>Jt?.setQuizTarget(i),reveal:i=>Vs(i==="record"?"program":"controls")});Pc({language:()=>_n,setLanguage(i){_n=i;try{localStorage.setItem("robot-arm-lang",_n)}catch{}Hs()},course:Lr});})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
