import {initialWorld,applyAction,solvePosition} from '../challenge-model.mjs';
import {ikTool,transform,rotationFromEuler} from '../challenge-kinematics.mjs';
// Test-only reference routes, solved against the real model; never loaded by the app.
export function referenceProgram(mode){
 let w=initialWorld(mode);const steps=[];
 const act=s=>{const r=applyAction(w,s);if(r.error)throw Error(mode+': '+s.type+': '+r.error);w=r.end;steps.push(s);};
 const move=(id,p,yaw=0)=>{const a=w.arms.find(a=>a.id===id);const r=a.axes===3?solvePosition(a,p):ikTool(transform(rotationFromEuler([0,0,-a.yaw]),p.map((v,i)=>v-a.base[i])),a.q,'nearest',[0,0,yaw-a.yaw]);if(!r.q)throw Error(r.error);act({type:'move',arm:id,q:r.q,kind:a.axes===3?'xyz':'joints'});};
 if(mode==='easy'){move('A',w.source);act({type:'close',arm:'A'});move('A',[147,-85,120]);move('A',[147,85,120]);move('A',w.destination);act({type:'open',arm:'A'});}
 if(mode==='medium'){move('A',[220,-110,130]);act({type:'close',arm:'A'});move('A',[220,-110,130],90);move('A',[220,-50,130],90);move('A',[220,50,130],90);move('A',[220,110,130],90);act({type:'open',arm:'A'});}
 if(mode==='hard'){move('A',[-132,-130,100]);act({type:'close',arm:'A'});move('A',[-132,-130,160]);move('A',[-42,0,160]);move('B',[42,0,160]);act({type:'close',arm:'B'});act({type:'open',arm:'A'});move('A',[-140,-150,170]);move('B',[142,130,160]);move('B',[142,130,100]);act({type:'open',arm:'B'});}
 return steps;
}
