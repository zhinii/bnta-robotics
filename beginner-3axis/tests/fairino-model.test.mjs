import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {initialWorld,pose,gripperParts,clone} from '../challenge-model.mjs';
const hook=registerHooks({resolve(s,c,next){return s==='three'?{url:new URL('../vendor/three/build/three.module.js',import.meta.url).href,shortCircuit:true}:next(s,c);}});
const THREE=await import('three');
const {createFairinoArm,updateFairinoArm}=await import('../fairino-arm.mjs');hook.deregister();

for(const mode of ['easy','medium','hard'])test(mode+' uses the original FAIRINO shells, caps, base and jaw geometry',()=>{
 const world=initialWorld(mode),before=clone(world);
 for(const arm of world.arms){const graph=createFairinoArm(arm.axes);updateFairinoArm(graph,pose(arm),arm);graph.group.updateMatrixWorld(true);
  assert.equal(graph.links.length,arm.axes-1);assert.equal(graph.joints.length,arm.axes-1);
  graph.links.forEach((link,i)=>{assert.equal(link.geometry.type,'LatheGeometry');assert.equal(link.geometry.parameters.segments,48);assert.equal(link.geometry.parameters.points[2].x,Math.max(9,18-i*2));assert.equal(link.material.color.getHex(),0xf0f2f4);});
  graph.caps.forEach(cap=>{assert.equal(cap.material.color.getHex(),0xf47721);assert.equal(cap.children.length,10,'original two hub covers and eight screws');});
  assert.equal(graph.group.children[0].geometry.parameters.radiusBottom,49,'original full-width base');
  const tcp=graph.tool.getWorldPosition(new THREE.Vector3());assert.ok(tcp.distanceTo(new THREE.Vector3(...pose(arm).tip))<1e-8);
  for(const closed of [false,true]){const target={...arm,closed};updateFairinoArm(graph,pose(target),target);graph.group.updateMatrixWorld(true);
   const parts=gripperParts(target);assert.equal(graph.tool.children.length,parts.length);
   graph.tool.children.forEach((mesh,i)=>{const actual=mesh.getWorldPosition(new THREE.Vector3());assert.ok(actual.distanceTo(new THREE.Vector3(...parts[i].position))<1e-8,'contact bound follows original tool member');});
   assert.equal(graph.jaws[1].position.y,closed?10:26);
  }
 }
 assert.deepEqual(world,before,'rendering never changes the robot state');
});
