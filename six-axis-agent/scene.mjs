import * as THREE from 'three';
import { OrbitControls } from '../beginner-3axis/vendor/three/examples/jsm/controls/OrbitControls.js';
import { fk, toolPose } from './kinematics.mjs';
import { PADS } from './world.mjs';

export function createScene(container) {
  const scene=new THREE.Scene(); scene.background=new THREE.Color('#eeeee7');
  const camera=new THREE.PerspectiveCamera(34,1,1,2500); camera.up.set(0,0,1);
  camera.position.set(650,-690,540);
  const renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
  renderer.setClearColor('#eeeee7'); renderer.domElement.setAttribute('aria-label','Six-axis robot with red, blue and yellow blocks and two placement pads.');
  container.prepend(renderer.domElement);
  const controls=new OrbitControls(camera,renderer.domElement); controls.target.set(125,0,60); controls.enableDamping=true;
  controls.minDistance=450; controls.maxDistance=1200; controls.maxPolarAngle=Math.PI*.48; controls.enablePan=false;
  scene.add(new THREE.HemisphereLight(0xffffff,0xb6bbaa,2.8));
  const light=new THREE.DirectionalLight(0xfff9eb,3.5); light.position.set(150,-280,600); light.castShadow=true;
  Object.assign(light.shadow.camera,{left:-450,right:450,top:450,bottom:-450,near:1,far:1300});
  light.shadow.mapSize.set(2048,2048); light.shadow.bias=-.0004; light.shadow.normalBias=1; scene.add(light);
  const mat=(color,metalness=.15)=>new THREE.MeshStandardMaterial({color,roughness:.42,metalness});
  const materials={shell:mat('#e8e9e3'),dark:mat('#35463d',.5),accent:mat('#4d715a'),metal:mat('#7f8a81',.65)};
  const v=p=>new THREE.Vector3(...p);
  function mesh(geometry,material,parent=scene) { const m=new THREE.Mesh(geometry,material); m.castShadow=true;m.receiveShadow=true;parent.add(m);return m; }
  const floor=mesh(new THREE.PlaneGeometry(3000,3000),mat('#eeeee7',0)); floor.position.z=-14;
  const table=mesh(new THREE.BoxGeometry(640,540,12),mat('#e4e7dc',.05)); table.position.set(110,0,-7);
  const grid=new THREE.GridHelper(520,26,0xc1caba,0xd3dacc); grid.rotation.x=Math.PI/2;grid.position.set(110,0,-.8);scene.add(grid);
  function cylinder(radius,length,material,parent=scene) {return mesh(new THREE.CylinderGeometry(radius,radius,length,40),material,parent);}
  const base=cylinder(46,12,materials.dark); base.rotation.x=Math.PI/2;base.position.z=6;
  const pedestal=cylinder(26,54,materials.shell);pedestal.rotation.x=Math.PI/2;pedestal.position.z=38;
  const ring=cylinder(30,6,materials.accent);ring.rotation.x=Math.PI/2;ring.position.z=18;
  for(let i=0;i<4;i++){const a=Math.PI/4+i*Math.PI/2;const bolt=cylinder(3,3,materials.metal);bolt.rotation.x=Math.PI/2;bolt.position.set(Math.cos(a)*36,Math.sin(a)*36,13);}
  const links=Array.from({length:5},(_,i)=>cylinder([20,17,13,11,10][i],1,materials.shell));
  const joints=Array.from({length:6},(_,i)=>cylinder([28,24,22,17,15,12][i],[38,44,39,30,27,24][i],i===3||i===5?materials.accent:materials.dark));
  const caps=Array.from({length:6},(_,i)=>cylinder([20,18,16,12,10,8][i],2,materials.shell));
  const gripper=new THREE.Group();scene.add(gripper);
  // The flange sits 40 mm above the grasp centre. Keep the mount and sliding
  // carriers connected throughout the jaw travel, including the open pose.
  const mount=cylinder(12,10,materials.metal,gripper);mount.rotation.x=Math.PI/2;mount.position.z=36;
  const housing=mesh(new THREE.BoxGeometry(70,32,12),materials.dark,gripper);housing.position.z=29;
  for(const y of [-16.5,16.5]) {
    const rail=cylinder(1.8,62,materials.metal,gripper);rail.rotation.z=Math.PI/2;rail.position.set(0,y,27);
  }
  const pads=mat('#28302b',0);
  const fingers=[-1,1].map(side=>{
    const jaw=new THREE.Group();gripper.add(jaw);
    const carrier=mesh(new THREE.BoxGeometry(12,28,8),materials.shell,jaw);carrier.position.z=22;
    const finger=mesh(new THREE.BoxGeometry(6,24,26),materials.metal,jaw);finger.position.set(side*.5,0,6);
    const pad=mesh(new THREE.BoxGeometry(1,22,18),pads,jaw);pad.position.set(-side*3,0,2);
    return jaw;
  });
  const blocks=new Map();
  for(const [id,color] of Object.entries({red:'#ce6450',blue:'#628ca9',yellow:'#dab65b'})) {
    const b=mesh(new THREE.BoxGeometry(36,36,36),mat(color,.05));blocks.set(id,b);
    const edges=new THREE.LineSegments(new THREE.EdgesGeometry(b.geometry),new THREE.LineBasicMaterial({color:new THREE.Color(color).multiplyScalar(.78)}));b.add(edges);
  }
  const labels=[];
  function label(en,zh,position,width=75) {
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;
    const texture=new THREE.CanvasTexture(canvas), sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false,transparent:true}));
    sprite.position.copy(v(position));sprite.scale.set(width,width/4,1);scene.add(sprite);
    const draw=language=>{const ctx=canvas.getContext('2d');ctx.clearRect(0,0,512,128);ctx.font='500 48px Segoe UI, Microsoft YaHei';ctx.textAlign='center';ctx.fillStyle='#61715f';ctx.fillText(language==='zh'?zh:en,256,80);texture.needsUpdate=true;};
    labels.push(draw);draw('en');return sprite;
  }
  for(const [id,p] of Object.entries(PADS)) {
    const pad=mesh(new THREE.BoxGeometry(74,74,1.5),mat('#c8d1bf',0));pad.position.set(p[0],p[1],-.3);
    const outline=new THREE.LineSegments(new THREE.EdgesGeometry(pad.geometry),new THREE.LineBasicMaterial({color:0x9aaa92}));pad.add(outline);
    label(id==='left'?'LEFT PAD':'RIGHT PAD',id==='left'?'左侧放置区':'右侧放置区',[p[0]+26,p[1]+(id==='left'?-54:54),3],88);
  }
  const blockLabels=new Map([['red',label('RED','红色',[240,-70,51],44)],['blue',label('BLUE','蓝色',[275,0,51],44)],['yellow',label('YELLOW','黄色',[240,70,51],50)]]);
  function orient(m,a,b) { const A=v(a),B=v(b),d=B.clone().sub(A); m.position.copy(A.add(B).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()); }
  function update(s) {
    const pose=fk(s.q),tool=toolPose(s.q);
    links.forEach((link,i)=>{const a=pose.points[i],b=pose.points[i+1];orient(link,a,b);link.scale.y=v(a).distanceTo(v(b));});
    joints.forEach((joint,i)=>{joint.position.copy(v(pose.origins[i]));joint.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v(pose.axes[i]));caps[i].position.copy(joint.position).addScaledVector(v(pose.axes[i]),[20,23,20.5,16,14.5,13][i]);caps[i].quaternion.copy(joint.quaternion);});
    const r=tool.rotation;
    gripper.position.copy(v(tool.tip));gripper.quaternion.setFromRotationMatrix(new THREE.Matrix4().set(r[0],r[1],r[2],0,r[3],r[4],r[5],0,r[6],r[7],r[8],0,0,0,0,1));
    fingers.forEach((finger,i)=>finger.position.set((i?1:-1)*(s.held?21.5:29),0,0));
    for(const block of s.objects) {const m=blocks.get(block.id);m.position.copy(v(block.position));m.rotation.z=block.yaw*Math.PI/180;blockLabels.get(block.id).position.set(block.position[0],block.position[1],block.position[2]+35);}
  }
  function resize(){const {width,height}=container.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.fov=width<600?40:34;controls.target.z=width<600?112:70;camera.updateProjectionMatrix();}
  new ResizeObserver(resize).observe(container);resize();
  renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera);});
  return {update,language:lang=>labels.forEach(draw=>draw(lang)),resetView:()=>{camera.position.set(650,-690,540);controls.target.set(125,0,container.clientWidth<600?112:70);}};
}
