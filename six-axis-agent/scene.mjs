import * as THREE from 'three';
import { OrbitControls } from '../beginner-3axis/vendor/three/examples/jsm/controls/OrbitControls.js';
import { fk, toolPose } from './kinematics.mjs?v=school-20261021-1';
import { CATALOG } from './world.mjs?v=school-20261021-1';

export function createScene(container) {
  const scene=new THREE.Scene(); scene.background=new THREE.Color('#eeeee7');
  const camera=new THREE.PerspectiveCamera(34,1,1,2500); camera.up.set(0,0,1);
  camera.position.set(850,-900,800);
  const renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
  renderer.setClearColor('#eeeee7'); renderer.domElement.setAttribute('aria-label','Six-axis robot on a school table, surrounded by a book, eraser, glue stick, pencil case, ruler, and two dividers.');
  container.prepend(renderer.domElement);
  const controls=new OrbitControls(camera,renderer.domElement); controls.target.set(0,0,75); controls.enableDamping=true;
  controls.minDistance=450; controls.maxDistance=1700; controls.maxPolarAngle=Math.PI*.48; controls.enablePan=false;
  scene.add(new THREE.HemisphereLight(0xffffff,0xb6bbaa,2.8));
  const light=new THREE.DirectionalLight(0xfff9eb,3.5); light.position.set(150,-280,600); light.castShadow=true;
  Object.assign(light.shadow.camera,{left:-450,right:450,top:450,bottom:-450,near:1,far:1300});
  light.shadow.mapSize.set(2048,2048); light.shadow.bias=-.0004; light.shadow.normalBias=1; scene.add(light);
  const mat=(color,metalness=.15)=>new THREE.MeshStandardMaterial({color,roughness:.42,metalness});
  const materials={shell:mat('#e8e9e3'),dark:mat('#35463d',.5),accent:mat('#4d715a'),metal:mat('#7f8a81',.65)};
  const v=p=>new THREE.Vector3(...p);
  function mesh(geometry,material,parent=scene) { const m=new THREE.Mesh(geometry,material); m.castShadow=true;m.receiveShadow=true;parent.add(m);return m; }
  const floor=mesh(new THREE.PlaneGeometry(3000,3000),mat('#eeeee7',0)); floor.position.z=-14;
  const table=mesh(new THREE.BoxGeometry(800,800,12),mat('#ded4bf',.05)); table.position.set(0,0,-7);
  const surface=mesh(new THREE.BoxGeometry(790,790,2),mat('#eee7d8',0));surface.position.z=-.8;
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
  const objects=new Map(),obstacles=new Map();
  function box(parent,size,color,position=[0,0,0]){const b=mesh(new THREE.BoxGeometry(...size),mat(color,0),parent);b.position.set(...position);return b;}
  function decal(parent,width,height,z,draw){
    const canvas=document.createElement('canvas');canvas.width=256;canvas.height=512;const ctx=canvas.getContext('2d');draw(ctx);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    const face=mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:texture,transparent:true}),parent);face.position.z=z;
  }
  function schoolObject(id){
    const group=new THREE.Group(),item=CATALOG[id],c=item.color;scene.add(group);
    if(id==='book'){
      box(group,[34,55,14],'#f7eed9');box(group,[36,58,2],c,[0,0,8]);box(group,[36,58,2],c,[0,0,-8]);box(group,[4,58,18],'#a74339',[-16,0,0]);
      decal(group,30,50,9.1,ctx=>{ctx.fillStyle='#fff1d3';ctx.textAlign='center';ctx.font='bold 34px sans-serif';ctx.fillText('SCIENCE',128,130);ctx.lineWidth=5;ctx.strokeStyle='#fff1d3';ctx.beginPath();ctx.arc(128,285,65,0,Math.PI*2);ctx.stroke();ctx.font='18px sans-serif';ctx.fillText('EXPLORE',128,450);});
    }else if(id==='eraser'){
      box(group,item.size,c);box(group,[30.4,24,20.4],'#f4efdf',[0,3,0]);
      decal(group,27,22,10.3,ctx=>{ctx.fillStyle='#34586e';ctx.textAlign='center';ctx.font='bold 36px sans-serif';ctx.fillText('ERASER',128,230);ctx.fillRect(28,285,200,12);});
    }else if(id==='glue'){
      const body=cylinder(12,34,mat(c,0),group);body.rotation.x=Math.PI/2;body.position.z=-6;
      const cap=cylinder(12,12,mat('#4c7899',0),group);cap.rotation.x=Math.PI/2;cap.position.z=17;
      const band=cylinder(12.1,16,mat('#fff2c9',0),group);band.rotation.x=Math.PI/2;band.position.z=-3;
      for(let i=0;i<12;i++){const a=i*Math.PI/6;box(group,[1.3,1.3,9],'#6d98b4',[Math.cos(a)*11.8,Math.sin(a)*11.8,17]);}
    }else if(id==='pencilcase'){
      const shape=new THREE.Shape(),w=14,h=27,r=5;shape.moveTo(-w+r,-h);shape.lineTo(w-r,-h);shape.quadraticCurveTo(w,-h,w,-h+r);shape.lineTo(w,h-r);shape.quadraticCurveTo(w,h,w-r,h);shape.lineTo(-w+r,h);shape.quadraticCurveTo(-w,h,-w,h-r);shape.lineTo(-w,-h+r);shape.quadraticCurveTo(-w,-h,-w+r,-h);
      const shell=mesh(new THREE.ExtrudeGeometry(shape,{depth:24,bevelEnabled:true,bevelSize:3,bevelThickness:3,bevelSegments:3,steps:1}),mat(c,0),group);shell.position.z=-12;
      box(group,[2,49,1],'#dbcdb0',[0,0,15]);for(let i=-22;i<=22;i+=4)box(group,[3,1,1.1],'#5e7564',[0,i,15]);box(group,[5,8,1.5],'#d5cdbd',[0,-19,16]);
    }else if(id==='ruler'){
      box(group,item.size,c);
      decal(group,16,88,8.1,ctx=>{ctx.fillStyle='#574c39';ctx.font='20px sans-serif';for(let i=0;i<=40;i++){const y=15+i*12;ctx.fillRect(8,y,i%5===0?75:38,3);if(i%5===0)ctx.fillText(String(i/5),110,y+8);}});
    }else box(group,item.size,c);
    return group;
  }
  const labels=[],labelSprites=[];
  function label(en,zh,position,width=75) {
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;
    let texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false,transparent:true,toneMapped:false}));
    sprite.position.copy(v(position));sprite.scale.set(width,width/4,1);scene.add(sprite);
    sprite.userData.canvas=canvas;labelSprites.push(sprite);
    const draw=language=>{const text=language==='zh'?zh:en;let ctx=canvas.getContext('2d');ctx.font='600 48px Segoe UI, Microsoft YaHei';const size=Math.ceil(ctx.measureText(text).width)+24;if(canvas.width!==size||canvas.height!==80){canvas.width=size;canvas.height=80;texture.dispose();texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;sprite.material.map=texture;sprite.material.needsUpdate=true;}ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,80);ctx.font='600 48px Segoe UI, Microsoft YaHei';ctx.textAlign='center';ctx.fillStyle='#4e6151';ctx.fillText(text,canvas.width/2,57);sprite.scale.set(canvas.width*.4,32,1);texture.needsUpdate=true;};
    labels.push(draw);draw('en');return sprite;
  }
  const objectLabels=new Map();
  let currentLanguage='en';
  function orient(m,a,b) { const A=v(a),B=v(b),d=B.clone().sub(A); m.position.copy(A.add(B).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()); }
  function update(s) {
    const pose=fk(s.q),tool=toolPose(s.q);
    links.forEach((link,i)=>{const a=pose.points[i],b=pose.points[i+1];orient(link,a,b);link.scale.y=v(a).distanceTo(v(b));});
    joints.forEach((joint,i)=>{joint.position.copy(v(pose.origins[i]));joint.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v(pose.axes[i]));caps[i].position.copy(joint.position).addScaledVector(v(pose.axes[i]),[20,23,20.5,16,14.5,13][i]);caps[i].quaternion.copy(joint.quaternion);});
    const r=tool.rotation;
    gripper.position.copy(v(tool.tip));gripper.quaternion.setFromRotationMatrix(new THREE.Matrix4().set(r[0],r[1],r[2],0,r[3],r[4],r[5],0,r[6],r[7],r[8],0,0,0,0,1));
    const held=s.objects.find(o=>o.id===s.held);
    fingers.forEach((finger,i)=>finger.position.set((i?1:-1)*(held?held.size[0]/2+3.5:29),0,0));
    for(const [id,m] of objects){m.visible=s.objects.some(o=>o.id===id);objectLabels.get(id).visible=m.visible;}
    for(const object of s.objects){
      if(!objects.has(object.id)){objects.set(object.id,schoolObject(object.id));objectLabels.set(object.id,label(object.name.toUpperCase(),object.zh,[0,0,0],object.name.length*5.2+12));labels.at(-1)(currentLanguage);}
      const m=objects.get(object.id);m.position.copy(v(object.position));m.rotation.set(...(object.rpy||[0,0,object.yaw]).map(n=>n*Math.PI/180),'ZYX');
      const stack=s.objects.filter(o=>o.id!==s.held&&Math.hypot(o.position[0]-object.position[0],o.position[1]-object.position[1])<10).sort((a,b)=>a.position[2]-b.position[2]);
      const top=Math.max(...stack.map(o=>o.position[2]+o.size[2]/2));
      objectLabels.get(object.id).position.set(object.position[0]+(stack.length>1?65:0),object.position[1]+(stack.length>1?35:0),stack.length>1?top+22+stack.findIndex(o=>o.id===object.id)*40:object.position[2]+object.size[2]/2+22);
    }
    for(const object of s.obstacles||[]){
      if(!obstacles.has(object.id)){const m=box(scene,object.size,'#aab3a4');const edge=new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),new THREE.LineBasicMaterial({color:0x81917d}));m.add(edge);obstacles.set(object.id,m);}
      obstacles.get(object.id).position.copy(v(object.position));
    }
  }
  function resize(){const {width,height}=container.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.fov=width<600?30:34;controls.target.z=width<600?105:75;camera.updateProjectionMatrix();}
  new ResizeObserver(resize).observe(container);resize();
  renderer.setAnimationLoop(()=>{controls.update();for(const sprite of labelSprites){const factor=2*camera.position.distanceTo(sprite.position)*Math.tan(camera.fov*Math.PI/360)/container.clientHeight*(container.clientWidth<600?10:11)/48;sprite.scale.set(sprite.userData.canvas.width*factor,80*factor,1);}renderer.render(scene,camera);});
  return {update,language:lang=>{currentLanguage=lang;labels.forEach(draw=>draw(lang));},resetView:()=>{camera.position.set(850,-900,800);controls.target.set(0,0,container.clientWidth<600?105:75);}};
}
