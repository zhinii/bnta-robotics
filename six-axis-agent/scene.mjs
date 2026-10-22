import * as THREE from 'three';
import { OrbitControls } from '../beginner-3axis/vendor/three/examples/jsm/controls/OrbitControls.js';
import { fk, toolPose } from './kinematics.mjs?v=freedom-20261022-1';
import { CATALOG, DESK, graspWidth } from './world.mjs?v=freedom-20261022-1';
import {objectGeometry,gripperGeometry,armGeometry,LINK_RADII,JOINT_RADII,JOINT_LENGTHS,CAP_RADII,CAP_OFFSETS} from './shapes.mjs?v=freedom-20261022-1';

export function createScene(container) {
  const scene=new THREE.Scene(); scene.background=new THREE.Color('#eeeee7');
  const station=new THREE.Group();scene.add(station);
  const camera=new THREE.PerspectiveCamera(34,1,1,2500); camera.up.set(0,0,1);
  camera.position.set(400,-750,580);
  const renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
  renderer.setClearColor('#eeeee7'); renderer.domElement.setAttribute('aria-label','Six-axis robot on a school table, surrounded by a book, eraser, glue stick, pencil case, ruler, and two dividers.');
  container.prepend(renderer.domElement);
  const controls=new OrbitControls(camera,renderer.domElement); controls.target.set(-205,-60,150); controls.enableDamping=true;
  controls.minDistance=350; controls.maxDistance=1700; controls.maxPolarAngle=Math.PI*.48; controls.enablePan=false;
  scene.add(new THREE.HemisphereLight(0xffffff,0xb6bbaa,2.8));
  const light=new THREE.DirectionalLight(0xfff9eb,3.5); light.position.set(150,-280,600); light.castShadow=true;
  Object.assign(light.shadow.camera,{left:-450,right:450,top:450,bottom:-450,near:1,far:1300});
  light.shadow.mapSize.set(2048,2048); light.shadow.bias=-.0004; light.shadow.normalBias=1; scene.add(light);
  const mat=(color,metalness=.15)=>new THREE.MeshStandardMaterial({color,roughness:.42,metalness});
  const materials={shell:mat('#e8e9e3'),dark:mat('#35463d',.5),accent:mat('#4d715a'),metal:mat('#7f8a81',.65)};
  const v=p=>new THREE.Vector3(...p);
  function mesh(geometry,material,parent=station) { const m=new THREE.Mesh(geometry,material); m.castShadow=true;m.receiveShadow=true;parent.add(m);return m; }
  const floor=mesh(new THREE.PlaneGeometry(3000,3000),mat('#c6ac8c',0),scene); floor.position.z=-390;
  const table=mesh(new THREE.BoxGeometry(800,800,12),mat('#ded4bf',.05)); table.position.set(0,0,-7);
  const surface=mesh(new THREE.BoxGeometry(790,790,2),mat('#eee7d8',0));surface.position.z=-.8;
  function cylinder(radius,length,material,parent=station) {return mesh(new THREE.CylinderGeometry(radius,radius,length,40),material,parent);}
  const base=cylinder(46,12,materials.dark); base.rotation.x=Math.PI/2;base.position.z=6;
  const pedestal=cylinder(26,54,materials.shell);pedestal.rotation.x=Math.PI/2;pedestal.position.z=38;
  const ring=cylinder(30,6,materials.accent);ring.rotation.x=Math.PI/2;ring.position.z=18;
  for(let i=0;i<4;i++){const a=Math.PI/4+i*Math.PI/2;const bolt=cylinder(3,3,materials.metal);bolt.rotation.x=Math.PI/2;bolt.position.set(Math.cos(a)*36,Math.sin(a)*36,13);}
  const links=Array.from({length:5},(_,i)=>cylinder(LINK_RADII[i],1,materials.shell));
  const joints=Array.from({length:6},(_,i)=>cylinder(JOINT_RADII[i],JOINT_LENGTHS[i],i===3||i===5?materials.accent:materials.dark));
  const caps=Array.from({length:6},(_,i)=>cylinder(CAP_RADII[i],2,materials.shell));
  function partMesh(part,parent,appearance=null){
    let geometry;
    if(part.kind==='box')geometry=new THREE.BoxGeometry(...part.size);
    else if(part.kind==='cylinder')geometry=new THREE.CylinderGeometry(part.top,part.bottom,part.height,part.segments||40);
    else{
      const positions=[];
      for(const face of part.faces)for(let k=1;k<face.length-1;k++)for(const i of [face[0],face[k],face[k+1]])positions.push(...part.vertices[i]);
      geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.computeVertexNormals();
    }
    const object=mesh(geometry,appearance||materials[part.color]||mat(part.color,0),parent);object.position.set(...(part.center||[0,0,0]));
    if(part.rotation){const r=part.rotation;object.quaternion.setFromRotationMatrix(new THREE.Matrix4().set(r[0],r[1],r[2],0,r[3],r[4],r[5],0,r[6],r[7],r[8],0,0,0,0,1));}
    return object;
  }
  const gripper=new THREE.Group();station.add(gripper);
  const fingers=[-1,1].map(()=>{const group=new THREE.Group();gripper.add(group);return group;});
  for(const part of gripperGeometry(0)){
    if(part.side){const i=part.side===-1?0:1;partMesh({...part,center:part.center.map((v,j)=>j===0?v-part.side*3.5:v)},fingers[i]);}
    else partMesh(part,gripper);
  }
  const objects=new Map(),obstacles=new Map();
  function box(parent,size,color,position=[0,0,0]){const b=mesh(new THREE.BoxGeometry(...size),mat(color,0),parent);b.position.set(...position);return b;}
  const room=new THREE.Group();scene.add(room);
  const deskMount=new THREE.Group();station.add(deskMount);
  const deskFurniture=new THREE.Group();station.add(deskFurniture);
  // A plate and under-desk clamp visibly attach the robot to the short-side edge.
  box(deskMount,[110,110,4],'#59605c',[0,0,1]);
  box(deskMount,[24,24,6],'#59605c',[-50,0,0]);
  box(deskMount,[8,24,38],'#59605c',[-60,0,-17]);
  box(deskMount,[30,24,7],'#59605c',[-48,0,-34]);
  const clampScrew=cylinder(5,25,materials.metal,deskMount);clampScrew.rotation.x=Math.PI/2;clampScrew.position.set(-45,0,-27);
  // Furniture is outside the arm's desk workspace; the desk obstacles below
  // share exact bounds with the planner and are part of its perception.
  box(room,[20,1500,760],'#e6e3db',[-430,190,-10]);box(room,[1600,20,760],'#e6e3db',[360,800,-10]);
  box(room,[24,1500,28],'#faf8ef',[-415,190,-365]);box(room,[1600,24,28],'#faf8ef',[360,785,-365]);
  for(let y=-1050;y<1100;y+=115)box(room,[2300,1,1],'#af9475',[0,y,-389]);
  // A narrow single bed, plain wardrobe and pinboard make an ordinary student dorm.
  const bed=new THREE.Group();bed.position.set(160,590,-315);room.add(bed);
  box(bed,[610,250,75],'#b39b7b');box(bed,[595,240,42],'#f3eee3',[0,0,58]);
  box(bed,[420,243,25],'#668591',[83,0,88]);box(bed,[70,245,26],'#aebfc3',[-80,0,89]);
  box(bed,[105,185,24],'#fcf5e7',[-205,0,93]);
  box(bed,[22,265,180],'#b39b7b',[-315,0,35]);
  for(let x=-40;x<275;x+=65)box(bed,[2,242,1],'#7898a2',[x,0,101]);
  const storage=new THREE.Group();room.add(storage);storage.position.set(-280,610,-100);
  box(storage,[220,260,560],'#bca98a');
  for(const y of [-65,65]){box(storage,[5,124,540],'#d1bea0',[113,y,0]);box(storage,[7,5,40],'#737c75',[118,y+(y<0?48:-48),0]);}
  // Corkboard on the plain dorm wall.
  box(room,[230,12,155],'#8c7455',[350,779,125]);box(room,[216,14,141],'#bf9b6b',[350,770,125]);
  for(const [x,z,c]of [[290,135,'#f5ebcb'],[350,155,'#d8e5d1'],[408,115,'#eee3da']]){box(room,[49,2,66],c,[x,761,z]);const pin=cylinder(3,3,mat('#875f4b',0),room);pin.position.set(x,757,z+25);}
  box(room,[330,240,3],'#b4b2a5',[530,180,-387]);
  for(const x of [DESK.min[0]+22,DESK.max[0]-22])for(const y of [DESK.min[1]+22,DESK.max[1]-22])box(deskFurniture,[19,19,375],'#6c7771',[x,y,-202]);
  // Drawer unit tucked under the far side of the desk.
  box(deskFurniture,[150,125,260],'#ccb99b',[480,140,-150]);
  for(const z of [-65,-145,-225]){box(deskFurniture,[149,4,70],'#decfb7',[480,75,z]);box(deskFurniture,[34,5,4],'#788078',[480,71,z+15]);}
  const chair=new THREE.Group();deskFurniture.add(chair);chair.position.set(250,-340,-240);chair.rotation.z=-Math.PI/2;
  box(chair,[185,190,22],'#81948b');box(chair,[20,190,220],'#81948b',[90,0,100]);
  for(const x of [-70,70])for(const y of [-70,70])box(chair,[15,15,135],'#5d7167',[x,y,-78]);
  function decal(parent,width,height,z,draw){
    const canvas=document.createElement('canvas');canvas.width=256;canvas.height=512;const ctx=canvas.getContext('2d');draw(ctx);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    const face=mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:texture,transparent:true}),parent);face.position.z=z;
  }
  function schoolObject(id){
    if(CATALOG[id].container)return furniture(CATALOG[id]);
    const group=new THREE.Group(),item=CATALOG[id],c=item.color;station.add(group);
    for(const part of objectGeometry({...item,id}))partMesh(part,group);
    if(id==='book'||id==='notebook'){
      const [w,l,h]=item.size;
      decal(group,w-6,l-8,h/2+.1,ctx=>{ctx.fillStyle='#fff1d3';ctx.textAlign='center';ctx.font='bold 34px sans-serif';ctx.fillText(id==='book'?'SCIENCE':'MY NOTES',128,130);ctx.lineWidth=5;ctx.strokeStyle='#fff1d3';ctx.beginPath();ctx.arc(128,285,65,0,Math.PI*2);ctx.stroke();ctx.font='18px sans-serif';ctx.fillText(id==='book'?'EXPLORE':'IDEAS',128,450);});
    }else if(id==='eraser')decal(group,27,22,10.3,ctx=>{ctx.fillStyle='#34586e';ctx.textAlign='center';ctx.font='bold 36px sans-serif';ctx.fillText('ERASER',128,230);ctx.fillRect(28,285,200,12);});
    else if(id==='ruler')decal(group,16,88,8.1,ctx=>{ctx.fillStyle='#574c39';ctx.font='20px sans-serif';for(let i=0;i<=40;i++){const y=15+i*12;ctx.fillRect(8,y,i%5===0?75:38,3);if(i%5===0)ctx.fillText(String(i/5),110,y+8);}});
    return group;
  }
  function furniture(object){
    const g=new THREE.Group();station.add(g);const [w,l,h]=object.size;
    if(object.id==='wall')return g; // The room wall is already rendered in room coordinates.
    for(const part of objectGeometry(object))partMesh(part,g);
    if(object.id==='organizer')for(const x of [170,220])box(g,[1,l-16,.3],'#ac8b65',[x-object.position[0],0,h/2+.2]);
    return g;
  }
  const ghosts=new THREE.Group();station.add(ghosts);
  function clearPreview(){
    ghosts.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});
    ghosts.clear();
  }
  function preview(data){
    clearPreview();if(!data)return;
    const color=data.kind==='ready'?'#159a76':data.kind==='collision'?'#e63843':'#d48215';
    const material=()=>new THREE.MeshBasicMaterial({color,transparent:true,opacity:.24,depthWrite:false,depthTest:false});
    function ghostObject(object,tint=color){
      const group=new THREE.Group();ghosts.add(group);group.position.copy(v(object.position));group.rotation.set(...(object.rpy||[0,0,0]).map(n=>n*Math.PI/180),'ZYX');
      for(const part of objectGeometry(object)){
        const body=partMesh(part,group,new THREE.MeshBasicMaterial({color:tint,transparent:true,opacity:.18,depthWrite:false,depthTest:false}));body.renderOrder=9;body.castShadow=false;body.receiveShadow=false;
        const outline=new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry),new THREE.LineBasicMaterial({color:tint,transparent:true,opacity:.85,depthTest:false}));outline.renderOrder=10;body.add(outline);
      }
    }
    for(const object of data.destinations||[])ghostObject(object);
    if(data.showArm){
      const pose=fk(data.state.q),tool=toolPose(data.state.q);
      for(const part of armGeometry(pose)){const link=partMesh(part,ghosts,material());link.renderOrder=8;link.castShadow=false;link.receiveShadow=false;}
      const grip=gripper.clone(true);grip.traverse(o=>{if(o.isMesh){o.geometry=o.geometry.clone();o.material=material();o.castShadow=false;o.receiveShadow=false;o.renderOrder=9;}});
      const r=tool.rotation;grip.position.copy(v(tool.tip));grip.quaternion.setFromRotationMatrix(new THREE.Matrix4().set(r[0],r[1],r[2],0,r[3],r[4],r[5],0,r[6],r[7],r[8],0,0,0,0,1));
      // Finger spacing follows the simulated load, not the live robot's grip.
      fingers.forEach((finger,i)=>{const copy=grip.children[gripper.children.indexOf(finger)];if(copy)copy.position.x=(i?1:-1)*(graspWidth(data.state)/2+3.5);});ghosts.add(grip);
      if(data.state.held&&data.kind!=='ready')ghostObject(data.state.objects.find(o=>o.id===data.state.held));
    }
    if(data.path?.length>1){const path=new THREE.Line(new THREE.BufferGeometry().setFromPoints(data.path.map(v)),new THREE.LineDashedMaterial({color,dashSize:7,gapSize:5,transparent:true,opacity:.65,depthTest:false}));path.computeLineDistances();path.renderOrder=7;ghosts.add(path);}
    const blocker=[...data.state.objects,...data.state.obstacles].find(o=>o.id===data.blocker);
    if(blocker)ghostObject(blocker,'#e63843');
    if(data.kind==='reach'&&data.target){const marker=mesh(new THREE.SphereGeometry(8,16,12),material(),ghosts);marker.position.copy(v(data.target));marker.renderOrder=10;}
  }
  function orient(m,a,b) { const A=v(a),B=v(b),d=B.clone().sub(A); m.position.copy(A.add(B).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()); }
  function update(s) {
    const isDesk=s.kit==='desk',width=DESK.max[0]-DESK.min[0],depth=DESK.max[1]-DESK.min[1],centre=(DESK.max[0]+DESK.min[0])/2;
    station.rotation.z=isDesk?Math.PI/2:0;station.position.set(isDesk?-420+DESK.max[1]:0,isDesk?-150:0,0);deskFurniture.visible=isDesk;
    table.scale.set(isDesk?width/800:1,isDesk?depth/800:1,1);table.position.x=isDesk?centre:0;
    surface.scale.set(isDesk?(width-8)/790:1,isDesk?(depth-8)/790:1,1);surface.position.x=isDesk?centre:0;
    deskMount.visible=isDesk;
    room.visible=s.kit==='desk';floor.material.color.set(s.kit==='desk'?'#c6ac8c':'#eeeee7');floor.position.z=s.kit==='desk'?-390:-14;
    renderer.domElement.setAttribute('aria-label',s.kit==='desk'?'Robot clamped to one side of a dorm room desk, with reachable red book, blue notebook, pen, pencil, pen holder, organizer shelf, fixed laptop and lamp; a single bed, wardrobe, chair and pinboard in the room.':s.kit==='blocks'?'Six-axis robot with red, blue and yellow blocks on a table.':'Six-axis robot with school objects on a table.');
    const pose=fk(s.q),tool=toolPose(s.q);
    links.forEach((link,i)=>{const a=pose.points[i],b=pose.points[i+1];orient(link,a,b);link.scale.y=v(a).distanceTo(v(b));});
    joints.forEach((joint,i)=>{joint.position.copy(v(pose.origins[i]));joint.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v(pose.axes[i]));caps[i].position.copy(joint.position).addScaledVector(v(pose.axes[i]),CAP_OFFSETS[i]);caps[i].quaternion.copy(joint.quaternion);});
    const r=tool.rotation;
    gripper.position.copy(v(tool.tip));gripper.quaternion.setFromRotationMatrix(new THREE.Matrix4().set(r[0],r[1],r[2],0,r[3],r[4],r[5],0,r[6],r[7],r[8],0,0,0,0,1));
    fingers.forEach((finger,i)=>finger.position.set((i?1:-1)*(graspWidth(s)/2+3.5),0,0));
    for(const [id,m] of objects){m.visible=s.objects.some(o=>o.id===id);}
    for(const object of s.objects){
      if(!objects.has(object.id))objects.set(object.id,schoolObject(object.id));
      const m=objects.get(object.id);m.position.copy(v(object.position));m.rotation.set(...(object.rpy||[0,0,object.yaw]).map(n=>n*Math.PI/180),'ZYX');
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
  renderer.setAnimationLoop(()=>{
    controls.update();camera.updateMatrixWorld();station.updateMatrixWorld(true);
    renderer.render(scene,camera);
  });
  function capture(){
    // Read only the simulated scene, never the surrounding page or a camera.
    const image=document.createElement('canvas'),scale=Math.min(1,512/Math.max(renderer.domElement.width,renderer.domElement.height));
    image.width=Math.max(1,Math.round(renderer.domElement.width*scale));image.height=Math.max(1,Math.round(renderer.domElement.height*scale));
    const wasVisible=ghosts.visible;ghosts.visible=false;
    try{controls.update();camera.updateMatrixWorld();station.updateMatrixWorld(true);renderer.render(scene,camera);image.getContext('2d').drawImage(renderer.domElement,0,0,image.width,image.height);}
    finally{ghosts.visible=wasVisible;}
    const data=image.toDataURL('image/jpeg',.6),frame={width:image.width,height:image.height,objects:[...objects].filter(([,m])=>m.visible).map(([id,m])=>{const p=m.getWorldPosition(new THREE.Vector3()).project(camera);return {id,pixel:[Math.round((p.x+1)*image.width/2),Math.round((1-p.y)*image.height/2)],inFrame:Math.abs(p.x)<=1&&Math.abs(p.y)<=1&&Math.abs(p.z)<=1};})};
    return data.length<=64000?{data,width:image.width,height:image.height,frame}:null;
  }
  return {update,preview,clearPreview,capture,language:()=>{},resetView:()=>{camera.position.set(400,-750,580);controls.target.set(-205,-60,150);}};
}
