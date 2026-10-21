import * as THREE from 'three';
import { OrbitControls } from '../beginner-3axis/vendor/three/examples/jsm/controls/OrbitControls.js';
import { fk, toolPose } from './kinematics.mjs?v=cup-20261021-1';
import { CATALOG, DESK, graspWidth, footprint } from './world.mjs?v=cup-20261021-1';

export function createScene(container) {
  const scene=new THREE.Scene(); scene.background=new THREE.Color('#eeeee7');
  const station=new THREE.Group();scene.add(station);
  const camera=new THREE.PerspectiveCamera(34,1,1,2500); camera.up.set(0,0,1);
  camera.position.set(1000,-1100,980);
  const renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
  renderer.setClearColor('#eeeee7'); renderer.domElement.setAttribute('aria-label','Six-axis robot on a school table, surrounded by a book, eraser, glue stick, pencil case, ruler, and two dividers.');
  container.prepend(renderer.domElement);
  const controls=new OrbitControls(camera,renderer.domElement); controls.target.set(-60,150,-40); controls.enableDamping=true;
  controls.minDistance=450; controls.maxDistance=1700; controls.maxPolarAngle=Math.PI*.48; controls.enablePan=false;
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
  const links=Array.from({length:5},(_,i)=>cylinder([20,17,13,11,10][i],1,materials.shell));
  const joints=Array.from({length:6},(_,i)=>cylinder([28,24,22,17,15,12][i],[38,44,39,30,27,24][i],i===3||i===5?materials.accent:materials.dark));
  const caps=Array.from({length:6},(_,i)=>cylinder([20,18,16,12,10,8][i],2,materials.shell));
  const gripper=new THREE.Group();station.add(gripper);
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
  function furniture(object){
    const g=new THREE.Group();station.add(g);const [w,l,h]=object.size;
    if(object.id==='wall')return g; // The room wall is already rendered in room coordinates.
    if(object.container){
      const r=object.radius,inner=r-object.wall,bottom=-h/2,top=h/2;
      // Revolve a closed ceramic cross-section: outer wall, rim, inner wall,
      // inner floor and underside. The opening is genuinely hollow.
      const profile=[[0,bottom],[r,bottom],[r,top],[inner,top],[inner,bottom+object.floor],[0,bottom+object.floor]].map(p=>new THREE.Vector2(...p));
      const cup=mesh(new THREE.LatheGeometry(profile,64),mat('#b98a67',0),g);cup.rotation.x=Math.PI/2;
      const handle=mesh(new THREE.TorusGeometry(9.5,3.5,12,40),mat('#b98a67',0),g);handle.rotation.x=Math.PI/2;handle.position.set(r+12,0,0);
    }else if(object.id==='organizer'){
      box(g,[w,l,8],'#c19e73',[0,0,h/2-4]);
      for(const x of [-w/2+12,w/2-12])box(g,[16,l-12,h-8],'#a7835d',[x,0,-4]);
      // Subtle engraved names mark spaces; there are no physical dividers or assigned categories.
      for(const x of [170,220])box(g,[1,l-16,.3],'#ac8b65',[x-object.position[0],0,h/2+.2]);
    }else if(object.id==='laptop'){
      box(g,[125,110,5],'#9aa4a6',[0,-7,-h/2+2.5]);
      box(g,[107,57,1],'#485359',[0,3,-h/2+5.1]);
      for(let x=-46;x<=46;x+=10)for(let y=-18;y<=24;y+=9)box(g,[7,6,.8],'#c3cacc',[x,y,-h/2+6]);
      box(g,[38,23,.7],'#bcc3c4',[0,-43,-h/2+5.2]);
      const lid=new THREE.Group();g.add(lid);lid.position.set(0,38,-h/2+5);lid.rotation.x=-.16;
      box(lid,[125,6,88],'#445057',[0,0,44]);box(lid,[115,1,76],'#7f9ea9',[0,-3.6,44]);
      box(lid,[102,1,6],'#d8e2de',[0,-4.2,72]);box(lid,[38,1,43],'#e1e7dc',[-29,-4.2,42]);box(lid,[48,1,25],'#adc6c0',[21,-4.2,50]);
    }else if(object.id==='lamp'){
      const base=cylinder(25,8,mat('#b39c61',.3),g);base.rotation.x=Math.PI/2;base.position.z=-h/2+4;
      const stem=cylinder(4,h-34,mat('#687b6e',.4),g);stem.rotation.x=Math.PI/2;stem.position.z=-5;
      const shade=mesh(new THREE.CylinderGeometry(14,29,31,32),mat('#d3b76f',.1),g);shade.rotation.x=Math.PI/2;shade.position.z=h/2-17;
      const bulb=cylinder(19,1,new THREE.MeshStandardMaterial({color:'#fff4c9',emissive:'#f1d59b',emissiveIntensity:.5}),g);bulb.rotation.x=Math.PI/2;bulb.position.z=h/2-33;
    }else box(g,object.size,'#aab3a4');
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
    function ghostObject(object){
      const source=objects.get(object.id);if(!source)return;
      const clone=source.clone(true);clone.traverse(o=>{if(o.isMesh){o.geometry=o.geometry.clone();o.material=material();o.castShadow=false;o.receiveShadow=false;o.renderOrder=9;}});
      clone.position.copy(v(object.position));clone.rotation.set(...object.rpy.map(n=>n*Math.PI/180),'ZYX');ghosts.add(clone);
      const shape=new THREE.BoxGeometry(...object.size),outline=new THREE.LineSegments(new THREE.EdgesGeometry(shape),new THREE.LineBasicMaterial({color,transparent:true,opacity:.9,depthTest:false}));shape.dispose();
      outline.position.copy(clone.position);outline.quaternion.copy(clone.quaternion);outline.renderOrder=10;ghosts.add(outline);
    }
    for(const object of data.destinations||[])ghostObject(object);
    if(data.showArm){
      const pose=fk(data.state.q),tool=toolPose(data.state.q);
      pose.points.slice(1).forEach((b,i)=>{const a=pose.points[i],link=cylinder([20,17,13,11,10][i],v(a).distanceTo(v(b)),material(),ghosts);orient(link,a,b);link.renderOrder=8;link.castShadow=false;});
      const grip=gripper.clone(true);grip.traverse(o=>{if(o.isMesh){o.geometry=o.geometry.clone();o.material=material();o.castShadow=false;o.receiveShadow=false;o.renderOrder=9;}});
      const r=tool.rotation;grip.position.copy(v(tool.tip));grip.quaternion.setFromRotationMatrix(new THREE.Matrix4().set(r[0],r[1],r[2],0,r[3],r[4],r[5],0,r[6],r[7],r[8],0,0,0,0,1));
      // Finger spacing follows the simulated load, not the live robot's grip.
      fingers.forEach((finger,i)=>{const copy=grip.children[gripper.children.indexOf(finger)];if(copy)copy.position.x=(i?1:-1)*(data.state.held?graspWidth(data.state)/2+3.5:29);});ghosts.add(grip);
      if(data.state.held&&data.kind!=='ready')ghostObject(data.state.objects.find(o=>o.id===data.state.held));
    }
    if(data.path?.length>1){const path=new THREE.Line(new THREE.BufferGeometry().setFromPoints(data.path.map(v)),new THREE.LineDashedMaterial({color,dashSize:7,gapSize:5,transparent:true,opacity:.65,depthTest:false}));path.computeLineDistances();path.renderOrder=7;ghosts.add(path);}
    const blocker=[...data.state.objects,...data.state.obstacles].find(o=>o.id===data.blocker);
    if(blocker){const shape=new THREE.BoxGeometry(...(blocker.rpy?footprint(blocker):blocker.size));const outline=new THREE.LineSegments(new THREE.EdgesGeometry(shape),new THREE.LineBasicMaterial({color:'#e63843',depthTest:false}));shape.dispose();outline.position.copy(v(blocker.position));outline.renderOrder=10;ghosts.add(outline);}
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
    joints.forEach((joint,i)=>{joint.position.copy(v(pose.origins[i]));joint.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v(pose.axes[i]));caps[i].position.copy(joint.position).addScaledVector(v(pose.axes[i]),[20,23,20.5,16,14.5,13][i]);caps[i].quaternion.copy(joint.quaternion);});
    const r=tool.rotation;
    gripper.position.copy(v(tool.tip));gripper.quaternion.setFromRotationMatrix(new THREE.Matrix4().set(r[0],r[1],r[2],0,r[3],r[4],r[5],0,r[6],r[7],r[8],0,0,0,0,1));
    const held=s.objects.find(o=>o.id===s.held);
    fingers.forEach((finger,i)=>finger.position.set((i?1:-1)*(held?graspWidth(s)/2+3.5:29),0,0));
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
  return {update,preview,clearPreview,language:()=>{},resetView:()=>{camera.position.set(1000,-1100,980);controls.target.set(-60,150,-40);}};
}
