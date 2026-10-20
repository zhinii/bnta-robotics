import * as THREE from 'three';
import { OrbitControls } from '../beginner-3axis/vendor/three/examples/jsm/controls/OrbitControls.js';
import { fk, toolPose } from './kinematics.mjs?v=bedroom-20261021-1';
import { CATALOG, HOMES } from './world.mjs?v=bedroom-20261021-1';

export function createScene(container) {
  const scene=new THREE.Scene(); scene.background=new THREE.Color('#eeeee7');
  const camera=new THREE.PerspectiveCamera(34,1,1,2500); camera.up.set(0,0,1);
  camera.position.set(1000,-1100,940);
  const renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
  renderer.setClearColor('#eeeee7'); renderer.domElement.setAttribute('aria-label','Six-axis robot on a school table, surrounded by a book, eraser, glue stick, pencil case, ruler, and two dividers.');
  container.prepend(renderer.domElement);
  const controls=new OrbitControls(camera,renderer.domElement); controls.target.set(0,80,-10); controls.enableDamping=true;
  controls.minDistance=450; controls.maxDistance=1700; controls.maxPolarAngle=Math.PI*.48; controls.enablePan=false;
  scene.add(new THREE.HemisphereLight(0xffffff,0xb6bbaa,2.8));
  const light=new THREE.DirectionalLight(0xfff9eb,3.5); light.position.set(150,-280,600); light.castShadow=true;
  Object.assign(light.shadow.camera,{left:-450,right:450,top:450,bottom:-450,near:1,far:1300});
  light.shadow.mapSize.set(2048,2048); light.shadow.bias=-.0004; light.shadow.normalBias=1; scene.add(light);
  const mat=(color,metalness=.15)=>new THREE.MeshStandardMaterial({color,roughness:.42,metalness});
  const materials={shell:mat('#e8e9e3'),dark:mat('#35463d',.5),accent:mat('#4d715a'),metal:mat('#7f8a81',.65)};
  const v=p=>new THREE.Vector3(...p);
  function mesh(geometry,material,parent=scene) { const m=new THREE.Mesh(geometry,material); m.castShadow=true;m.receiveShadow=true;parent.add(m);return m; }
  const floor=mesh(new THREE.PlaneGeometry(3000,3000),mat('#c6ac8c',0)); floor.position.z=-390;
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
  const room=new THREE.Group();scene.add(room);
  // Furniture is outside the arm's desk workspace; the desk obstacles below
  // share exact bounds with the planner and are part of its perception.
  box(room,[20,1800,760],'#d8ddd5',[-680,250,-10]);box(room,[1600,20,760],'#e7dfcf',[100,900,-10]);
  box(room,[24,1800,28],'#f2e9da',[-665,250,-365]);box(room,[1600,24,28],'#f2e9da',[100,885,-365]);
  for(let y=-1050;y<1100;y+=115)box(room,[2300,1,1],'#af9475',[0,y,-389]);
  // A made bed, pillows and folded duvet make this a bedroom at first glance.
  const bed=new THREE.Group();bed.position.set(90,650,-315);room.add(bed);
  box(bed,[590,330,75],'#a88260');box(bed,[575,320,42],'#f3eee3',[0,0,58]);
  box(bed,[400,323,25],'#7e9f99',[83,0,88]);box(bed,[70,325,26],'#b0c5b7',[-80,0,89]);
  for(const y of [-80,80])box(bed,[100,130,24],'#fcf5e7',[-205,y,93]);
  box(bed,[22,350,180],'#a88260',[-305,0,35]);
  for(let x=-40;x<275;x+=65)box(bed,[2,322,1],'#8eaea6',[x,0,101]);
  // Window, curtains and a small framed print on the bedroom walls.
  box(room,[14,290,260],'#fbf7ee',[-660,100,155]);box(room,[16,260,230],'#a9cbd2',[-650,100,155]);
  box(room,[18,8,236],'#faf6eb',[-638,100,155]);box(room,[18,266,8],'#faf6eb',[-638,100,155]);
  for(const y of [-75,275])box(room,[22,45,300],'#cab9a4',[-630,y,145]);
  box(room,[150,12,180],'#b28b66',[470,879,110]);box(room,[128,14,158],'#fbf0d5',[470,870,110]);
  const sun=cylinder(32,3,mat('#d59f5d',0),room);sun.position.set(470,860,130);
  box(room,[220,145,8],'#b48b6d',[135,15,-380]);
  for(const x of [-350,350])for(const y of [-350,350])box(room,[26,26,375],'#b29472',[x,y,-202]);
  const chair=new THREE.Group();room.add(chair);chair.position.set(590,-50,-240);
  box(chair,[185,190,22],'#81948b');box(chair,[20,190,220],'#81948b',[90,0,100]);
  for(const x of [-70,70])for(const y of [-70,70])box(chair,[15,15,135],'#5d7167',[x,y,-78]);
  function decal(parent,width,height,z,draw){
    const canvas=document.createElement('canvas');canvas.width=256;canvas.height=512;const ctx=canvas.getContext('2d');draw(ctx);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    const face=mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:texture,transparent:true}),parent);face.position.z=z;
  }
  function schoolObject(id){
    const group=new THREE.Group(),item=CATALOG[id],c=item.color;scene.add(group);
    if(id==='book'||id==='notebook'){
      const [w,l,h]=item.size;box(group,[w-2,l-3,h-4],'#f7eed9');box(group,[w,l,2],c,[0,0,h/2-1]);box(group,[w,l,2],c,[0,0,-h/2+1]);box(group,[4,l,h],c,[-w/2+2,0,0]);
      decal(group,w-6,l-8,h/2+.1,ctx=>{ctx.fillStyle='#fff1d3';ctx.textAlign='center';ctx.font='bold 34px sans-serif';ctx.fillText(id==='book'?'SCIENCE':'MY NOTES',128,130);ctx.lineWidth=5;ctx.strokeStyle='#fff1d3';ctx.beginPath();ctx.arc(128,285,65,0,Math.PI*2);ctx.stroke();ctx.font='18px sans-serif';ctx.fillText(id==='book'?'EXPLORE':'IDEAS',128,450);});
    }else if(id==='pen'||id==='pencil'){
      const body=mesh(new THREE.CylinderGeometry(6,6,64,id==='pencil'?6:24),mat(c,0),group);body.position.y=-3;
      const tip=mesh(new THREE.ConeGeometry(6,14,12),mat(id==='pencil'?'#d7bc8f':'#aeb6b8',.2),group);tip.position.y=36;
      const point=mesh(new THREE.ConeGeometry(2.2,5,12),mat('#343d3b',0),group);point.position.y=42;
      const end=cylinder(6.5,10,mat(id==='pencil'?'#ce8c85':'#294d70',0),group);end.position.y=-35;
      if(id==='pen')box(group,[2,24,2],'#c6cccc',[0,-22,6]);
    }else if(id==='clock'){
      const body=cylinder(17,18,mat(c,0),group);body.rotation.z=Math.PI/2;body.position.z=2;
      for(const y of [-10,10])box(group,[24,5,8],'#956652',[0,y,-19]);
      const face=cylinder(14.5,1,mat('#fff7df',0),group);face.rotation.z=Math.PI/2;face.position.set(9.5,0,2);
      for(let i=0;i<12;i++){const a=i*Math.PI/6;box(group,[1.5,2,2],'#455c56',[10.3,Math.sin(a)*11,2+Math.cos(a)*11]);}
      const minute=box(group,[2,1.2,10],'#455c56',[10.8,0,7]);minute.rotation.x=.2;
      const hour=box(group,[2,8,1.2],'#455c56',[10.8,3,2]);
      const button=cylinder(3,4,mat('#956652',0),group);button.rotation.x=Math.PI/2;button.position.z=21;
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
  const homeLabels=Object.entries(HOMES).map(([id,home])=>{const sprite=label(home.name.toUpperCase(),home.zh,[...home.position.slice(0,2),home.position[2]+5]);return sprite;});
  function furniture(object){
    const g=new THREE.Group();scene.add(g);const [w,l,h]=object.size;
    if(object.id==='organizer'){
      box(g,[w,l,8],'#c19e73',[0,0,h/2-4]);
      for(const y of [-l/2+12,l/2-12])box(g,[w-12,16,h-8],'#a7835d',[0,y,-4]);
      // Subtle engraved names mark spaces; there are no physical dividers or assigned categories.
      for(const y of [-72,72])box(g,[w-16,1,.3],'#ac8b65',[0,y,h/2+.2]);
    }else if(object.id==='computer'){
      box(g,[105,58,6],'#414b50',[0,0,-h/2+3]);box(g,[18,20,50],'#535e60',[0,8,-50]);
      box(g,[w,18,94],'#34434a',[0,12,30]);box(g,[w-10,2,82],'#8aa9b4',[0,1,30]);
      box(g,[w-22,1,6],'#c4d8d4',[0,-.2,56]);box(g,[45,1,38],'#d9e4d5',[-28,-.3,22]);box(g,[45,1,24],'#b1c8bd',[28,-.3,29]);
      box(g,[95,34,5],'#c3c7c3',[0,-14,-h/2+9]);for(let x=-38;x<=38;x+=10)for(let y=-24;y<=-4;y+=8)box(g,[7,5,1],'#eef0e7',[x,y,-h/2+12]);
    }else if(object.id==='lamp'){
      const base=cylinder(25,8,mat('#b39c61',.3),g);base.rotation.x=Math.PI/2;base.position.z=-h/2+4;
      const stem=cylinder(4,h-34,mat('#687b6e',.4),g);stem.rotation.x=Math.PI/2;stem.position.z=-5;
      const shade=mesh(new THREE.CylinderGeometry(14,29,31,32),mat('#d3b76f',.1),g);shade.rotation.x=Math.PI/2;shade.position.z=h/2-17;
      const bulb=cylinder(19,1,new THREE.MeshStandardMaterial({color:'#fff4c9',emissive:'#f1d59b',emissiveIntensity:.5}),g);bulb.rotation.x=Math.PI/2;bulb.position.z=h/2-33;
    }else box(g,object.size,'#aab3a4');
    return g;
  }
  let currentLanguage='en';
  function orient(m,a,b) { const A=v(a),B=v(b),d=B.clone().sub(A); m.position.copy(A.add(B).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()); }
  function update(s) {
    room.visible=s.kit==='desk';floor.material.color.set(s.kit==='desk'?'#c6ac8c':'#eeeee7');floor.position.z=s.kit==='desk'?-390:-14;
    homeLabels.forEach(sprite=>sprite.visible=s.kit==='desk');
    renderer.domElement.setAttribute('aria-label',s.kit==='desk'?'AI-controlled robot on a messy bedroom desk, with books, pens, a pencil, alarm clock, eraser, pencil case, a low organizer shelf, and fixed computer and lamp.':s.kit==='blocks'?'Six-axis robot with red, blue and yellow blocks on a table.':'Six-axis robot with school objects on a table.');
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
    for(const [id,m]of obstacles)m.visible=(s.obstacles||[]).some(o=>o.id===id);
    for(const object of s.obstacles||[]){
      if(!obstacles.has(object.id))obstacles.set(object.id,furniture(object));
      obstacles.get(object.id).visible=true;
      obstacles.get(object.id).position.copy(v(object.position));
    }
  }
  function resize(){const {width,height}=container.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.fov=width<600?38:36;camera.updateProjectionMatrix();}
  new ResizeObserver(resize).observe(container);resize();
  renderer.setAnimationLoop(()=>{controls.update();for(const sprite of labelSprites){const factor=2*camera.position.distanceTo(sprite.position)*Math.tan(camera.fov*Math.PI/360)/container.clientHeight*(container.clientWidth<600?10:11)/48;sprite.scale.set(sprite.userData.canvas.width*factor,80*factor,1);}renderer.render(scene,camera);});
  return {update,language:lang=>{currentLanguage=lang;labels.forEach(draw=>draw(lang));},resetView:()=>{camera.position.set(1000,-1100,940);controls.target.set(0,80,-10);}};
}
