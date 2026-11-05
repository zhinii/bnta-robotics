import {initialWorld,applyAction,solvePosition} from '../challenge-model.mjs';
import {ikTool,transform,rotationFromEuler} from '../challenge-kinematics.mjs';
// Test-only reference routes, solved against the real model; never loaded by the app.
export function referenceProgram(mode){
 let w=initialWorld(mode);const steps=[];
 const act=s=>{const r=applyAction(w,s);if(r.error)throw Error(mode+': '+s.type+': '+r.error);w=r.end;steps.push(s);};
 const move=(id,p,yaw=0)=>{const a=w.arms.find(a=>a.id===id);const orientation=Array.isArray(yaw)?yaw:[0,0,yaw-a.yaw];const r=a.axes===3?solvePosition(a,p):ikTool(transform(rotationFromEuler([0,0,-a.yaw]),p.map((v,i)=>v-a.base[i])),a.q,'nearest',orientation);if(!r.q)throw Error(r.error);act({type:'move',arm:id,q:r.q,kind:a.axes===3?'xyz':'joints'});};
 if(mode==='explore'){
  move('A',[150,-70,100]);move('A',[150,-70,16]);act({type:'close',arm:'A'});move('A',[150,-70,100]);move('A',[230,-70,100]);act({type:'open',arm:'A'});
  move('A',[210,0,100]);move('A',[210,0,16]);act({type:'close',arm:'A'});move('A',[210,0,100]);move('A',[150,0,100]);act({type:'open',arm:'A'});
  move('A',[230,-70,100]);move('A',[230,-70,16]);act({type:'close',arm:'A'});move('A',[230,-70,100]);act({type:'open',arm:'A'});
 }
 if(mode==='easy'){move('A',w.source);act({type:'close',arm:'A'});move('A',[147,-85,120]);move('A',[147,85,120]);move('A',w.destination);act({type:'open',arm:'A'});}
 if(mode==='medium'){move('A',w.source);act({type:'close',arm:'A'});move('A',[110,-100,180]);move('A',[110,-80,180],[-90,-30,90]);move('A',[170,0,180],[-90,-30,90]);move('A',[240,0,180],[-90,-30,90]);move('A',[310,0,180],[-90,-30,90]);move('A',w.destination,[-90,-30,90]);act({type:'open',arm:'A'});}
 if(mode==='hard'){move('A',[-132,-130,100]);act({type:'close',arm:'A'});move('A',[-132,-130,160]);move('A',[-42,0,160]);move('B',[42,0,160]);act({type:'close',arm:'B'});act({type:'open',arm:'A'});move('A',[-140,-150,170]);move('B',[142,130,160]);move('B',[142,130,100]);act({type:'open',arm:'B'});}
 return steps;
}
