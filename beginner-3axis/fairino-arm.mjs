import * as THREE from 'three';
// Geometry extracted directly from robot-arm-lab/src/scene.js (the main Robot Lab).
// Preserve the existing white/orange FAIRINO-inspired shells, caps, base and tool.
// Only scene ownership and input pose are adapted; this module never solves motion.
export function createFairinoArm(n){
 const group=new THREE.Group();group.name='fairino-arm';
 const materials={body:new THREE.MeshStandardMaterial({color:0xf0f2f4,roughness:.34,metalness:.16}),joint:new THREE.MeshStandardMaterial({color:0xe1e5e9,roughness:.32,metalness:.24}),accent:new THREE.MeshStandardMaterial({color:0xf47721,roughness:.38,metalness:.12}),metal:new THREE.MeshStandardMaterial({color:0x39424e,metalness:.65,roughness:.3})};
 function mesh(geo,mat){const m=new THREE.Mesh(geo,mat);m.castShadow=true;m.receiveShadow=true;group.add(m);return m;}
 const base=mesh(new THREE.CylinderGeometry(47,49,10,64),materials.metal);base.rotation.x=Math.PI/2;base.position.z=5;
 const pedestal=mesh(new THREE.CylinderGeometry(29,32,54,48),materials.body);pedestal.rotation.x=Math.PI/2;pedestal.position.z=37;
 const baseBand=mesh(new THREE.CylinderGeometry(32.5,32.5,5,48),materials.accent);baseBand.rotation.x=Math.PI/2;baseBand.position.z=15;
 for(let i=0;i<6;i++){const a=i*Math.PI/3;const bolt=mesh(new THREE.CylinderGeometry(2.6,2.6,2,6),materials.metal);bolt.rotation.x=Math.PI/2;bolt.position.set(41*Math.cos(a),41*Math.sin(a),11);}
 let links,joints,caps;
 links=Array.from({length:n-1},(_,i)=>{const radius=Math.max(9,18-i*2);return mesh(new THREE.LatheGeometry([[0,-.5],[radius*.8,-.5],[radius,-.46],[radius,.46],[radius*.8,.5],[0,.5]].map(([x,y])=>new THREE.Vector2(x,y)),48),materials.body);});
 joints=Array.from({length:n-1},(_,i)=>mesh(new THREE.CylinderGeometry(Math.max(13,23-i*2),Math.max(13,23-i*2),i<2?39:29,32),materials.joint));
 caps=Array.from({length:n-1},(_,i)=>{const radius=Math.max(13,23-i*2)-2,depth=i<2?40:30;
 const cap=mesh(new THREE.CylinderGeometry(radius,radius,depth,48),materials.accent);
 for(const sign of [-1,1]){
 const hub=new THREE.Mesh(new THREE.CylinderGeometry(radius*.73,radius*.73,1.2,48),materials.joint);hub.position.y=sign*(depth/2+.6);hub.castShadow=true;cap.add(hub);
 for(let j=0;j<4;j++){const a=j*Math.PI/2+Math.PI/4;const screw=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,1.5,6),materials.metal);screw.position.set(radius*.51*Math.cos(a),sign*(depth/2+1.3),radius*.51*Math.sin(a));cap.add(screw);}
 }return cap;});
 const tool=new THREE.Group();tool.name='fairino-gripper';group.add(tool);let jaws=[];
 const toolMetal=new THREE.MeshStandardMaterial({color:0x647080,roughness:.35,metalness:.65});
 const rubber=new THREE.MeshStandardMaterial({color:0x202731,roughness:.95});
 function part(geo,mat,pos){const m=new THREE.Mesh(geo,mat);m.position.set(...pos);m.castShadow=true;tool.add(m);return m;}
 const mount=part(new THREE.CylinderGeometry(13,13,4,32),toolMetal,[0,0,38]);mount.rotation.x=Math.PI/2;
 {const neck=part(new THREE.CylinderGeometry(7,7,8,20),toolMetal,[0,0,32]);neck.rotation.x=Math.PI/2;}
 {part(new THREE.BoxGeometry(22,54,12),toolMetal,[0,0,23]);for(const sign of [-1,1]){const jaw=part(new THREE.BoxGeometry(12,6,32),rubber,[0,sign*26,3]);jaw.userData.sign=sign;jaws.push(jaw);}}

 return {group,links,joints,caps,tool,jaws};
}
const V=p=>new THREE.Vector3(...p),Y=new THREE.Vector3(0,1,0);
export function updateFairinoArm(graph,p,arm){
 graph.group.position.set(...arm.base);
 const local=v=>V(v).sub(V(arm.base));
 // points includes the fixed pedestal and terminal tool offset; shells cover only links.
 graph.links.forEach((m,i)=>{const a=local(p.points[i+1]),b=local(p.points[i+2]);m.position.copy(a).add(b).multiplyScalar(.5);m.scale.y=a.distanceTo(b);m.quaternion.setFromUnitVectors(Y,b.sub(a).normalize());});
 graph.joints.forEach((m,i)=>{m.position.copy(local(p.origins[i+1]));m.quaternion.setFromUnitVectors(Y,V(p.axes[i+1]));graph.caps[i].position.copy(m.position);graph.caps[i].quaternion.copy(m.quaternion);});
 graph.tool.position.copy(local(p.tip));const r=p.rotation;
 graph.tool.quaternion.setFromRotationMatrix(new THREE.Matrix4().set(r[0],r[1],r[2],0,r[3],r[4],r[5],0,r[6],r[7],r[8],0,0,0,0,1));
 graph.jaws.forEach((j,i)=>j.position.y=arm.closed?(arm.jawY||[-10,10])[i]:j.userData.sign*26);
}
