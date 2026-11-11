import * as THREE from 'three';
import { OrbitControls } from './vendor/three/examples/jsm/controls/OrbitControls.js';
import { pose, atPose, gripperParts } from './challenge-model.mjs?v=number-pad-1';
import { text } from './challenge-i18n.mjs?v=number-pad-1';
import { createFairinoArm, updateFairinoArm } from './fairino-arm.mjs?v=number-pad-1';
const vec=p=>new THREE.Vector3(...p),Y=new THREE.Vector3(0,1,0);
function material(color,ghost=false){return new THREE.MeshStandardMaterial({color,roughness:.45,metalness:.15,transparent:ghost,opacity:ghost?.3:1,depthWrite:!ghost,wireframe:ghost});}
function orient(mesh,a,b){const d=vec(b).sub(vec(a));mesh.position.copy(vec(a).add(vec(b)).multiplyScalar(.5));mesh.scale.set(1,d.length(),1);mesh.quaternion.setFromUnitVectors(Y,d.normalize());}
function rotation(mesh,r){mesh.setRotationFromMatrix(new THREE.Matrix4().set(r[0],r[1],r[2],0,r[3],r[4],r[5],0,r[6],r[7],r[8],0,0,0,0,1));}
export function armGraph(arm,ghost=false){
  const graph=createFairinoArm(arm.axes);
  if(ghost)graph.group.traverse(o=>{if(o.isMesh){o.material=new THREE.MeshBasicMaterial({color:'#1677dc',transparent:true,opacity:.32,depthWrite:false,wireframe:true});o.castShadow=false;o.receiveShadow=false;}});
  return graph;
}
export function updateArm(graph,arm,q=arm.q){updateFairinoArm(graph,pose(arm,q),arm);}
function release(group){group.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material]){m.map?.dispose();m.dispose();}}});group.clear();}
function label(message,color='#314b65',background='#ffffffed'){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const c=canvas.getContext('2d');c.fillStyle=background;c.beginPath();c.roundRect(0,0,512,96,20);c.fill();c.font='700 34px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillStyle=color;c.fillText(message,256,48,490);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false,toneMapped:false}));sprite.scale.set(115,22,1);return sprite;}
function pin(message,color='#286cae'){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=96;const c=canvas.getContext('2d');c.fillStyle=color;c.strokeStyle='white';c.lineWidth=5;c.beginPath();c.arc(48,48,42,0,Math.PI*2);c.fill();c.stroke();c.fillStyle='white';c.font='700 42px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText(String(message),48,48);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false,toneMapped:false}));sprite.scale.set(19,19,1);return sprite;
}
function line(group,a,b,color,radius=1.5){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,1,8),new THREE.MeshBasicMaterial({color}));orient(mesh,a,b);group.add(mesh);return mesh;}
export function createChallengeScene(host,language='en'){
  let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true});}catch{host.textContent=text(language,'webgl');return {update(){},home(){},dispose(){},available:false};}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setClearColor('#e9eff3');renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;host.append(renderer.domElement);renderer.domElement.setAttribute('aria-label',text(language,'sceneLabel'));
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,1,3000);camera.up.set(0,0,1);
  scene.add(new THREE.HemisphereLight('#e9f3ff','#65758b',1.8));const sun=new THREE.DirectionalLight('#fff3df',3);sun.position.set(-200,-300,650);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-600,right:600,top:550,bottom:-550,near:1,far:1500});sun.shadow.normalBias=.5;sun.shadow.bias=-.0002;scene.add(sun);const fill=new THREE.DirectionalLight('#bcd8ff',1.3);fill.position.set(400,250,450);scene.add(fill);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(1600,1400),material('#e3eaf0'));ground.position.z=-1;ground.receiveShadow=true;scene.add(ground);
  const grid=new THREE.GridHelper(1100,22,'#acbecd','#d4dfe7');grid.rotation.x=Math.PI/2;grid.position.z=.1;scene.add(grid);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=150;controls.maxDistance=1800;controls.maxPolarAngle=Math.PI*.49;
  let worldGroup=new THREE.Group(),labels=new THREE.Group(),introLabels=new THREE.Group(),arms=[],ghosts=[],parts=[],partLabels=[],obstacleMeshes=[],wallMesh,collisionMarker,ghostPart,targetMarker,targetLine,targetLabel,lastPathKey='',mode='',armKey='',lang='',lastWorld=null;
  scene.add(worldGroup,labels,introLabels);
  function home(){const hard=mode==='hard',medium=mode==='medium',exploring=mode==='explore'&&armKey==='6';controls.target.set(hard?0:medium?180:115,0,exploring?130:medium?140:105);camera.position.set(hard?530:exploring?560:medium?-420:390,hard?-650:exploring?-540:medium?-360:-340,hard?420:exploring?380:medium?350:280);controls.update();}
  function build(world,language){
    release(worldGroup);release(labels);release(introLabels);arms=[];ghosts=[];obstacleMeshes=[];wallMesh=null;lastPathKey='';mode=world.mode;armKey=world.arms.map(a=>a.axes).join(',');lang=language;
    for(const arm of world.arms){const graph=armGraph(arm),ghost=armGraph(arm,true);worldGroup.add(graph.group,ghost.group);arms.push(graph);ghosts.push(ghost);if(world.mode==='hard'){const tag=pin(arm.id,arm.id==='A'?'#99601d':'#215fad');tag.position.copy(vec(arm.base));tag.position.z=25;worldGroup.add(tag);}}
    for(const [i,p] of (world.mode==='explore'?[]:[world.source,world.destination]).entries()){
      const color=i?'#16885b':'#e78617',tilted=i&&world.mode==='medium',top=p[2]-(tilted?38:12);
      const pillar=new THREE.Mesh(new THREE.CylinderGeometry(12,20,top,20),material('#a5b8c6'));pillar.rotation.x=Math.PI/2;pillar.position.set(p[0],p[1],top/2);pillar.castShadow=true;pillar.receiveShadow=true;worldGroup.add(pillar);
      const target=new THREE.Mesh(new THREE.BoxGeometry(world.part.size[0]+16,world.part.size[1]+16,6),material(color));
      target.position.set(p[0],p[1],p[2]-11);if(tilted){const c=Math.cos(Math.PI/6),s=Math.sin(Math.PI/6);rotation(target,[0,-1,0,c,0,-s,s,0,c]);}target.castShadow=true;target.receiveShadow=true;worldGroup.add(target);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(world.mode==='easy'?30:45,2.5,10,48),new THREE.MeshBasicMaterial({color}));ring.position.set(p[0],p[1],2);worldGroup.add(ring);
      const mark=world.mode==='hard'?[p[0]+(i?42:-42),p[1],p[2]]:p;
      const halo=new THREE.Mesh(new THREE.TorusGeometry(11,1.4,8,32),new THREE.MeshBasicMaterial({color,depthTest:false}));halo.position.copy(vec(mark));worldGroup.add(halo);
      for(const end of [[8,0,0],[0,8,0]])line(worldGroup,mark.map((v,j)=>v-end[j]),mark.map((v,j)=>v+end[j]),color,.6);
      const tag=pin(i+1,color);tag.position.set(p[0],p[1],p[2]+34);worldGroup.add(tag);
      if(i){const goal=new THREE.Mesh(new THREE.BoxGeometry(...world.part.size),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.13,depthWrite:false}));goal.position.copy(vec(p));rotation(goal,world.destinationRotation);worldGroup.add(goal);const outline=new THREE.LineSegments(new THREE.EdgesGeometry(goal.geometry),new THREE.LineBasicMaterial({color,transparent:true,opacity:.8}));outline.position.copy(goal.position);outline.quaternion.copy(goal.quaternion);worldGroup.add(outline);}
    }
    for(const [i,box] of world.obstacles.entries()){
      if(!box.polygon){const mesh=new THREE.Mesh(new THREE.BoxGeometry(...box.max.map((v,i)=>v-box.min[i])),material('#7c94a8'));mesh.position.copy(vec(box.max.map((v,i)=>(v+box.min[i])/2)));worldGroup.add(mesh);obstacleMeshes[i]=mesh;}
    }
    if(world.wall){const shape=new THREE.Shape([[-200,0],[200,0],[200,540],[-200,540]].map(p=>new THREE.Vector2(...p)));shape.holes.push(new THREE.Path([...world.wall.opening].reverse().map(p=>new THREE.Vector2(...p))));const mat=material('#68859d');mat.transparent=true;mat.opacity=.24;mat.depthWrite=false;const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:12,bevelEnabled:false}),mat);mesh.setRotationFromMatrix(new THREE.Matrix4().set(0,0,1,0,1,0,0,0,0,1,0,0,0,0,0,1));mesh.position.x=world.wall.planeX-6;worldGroup.add(mesh);wallMesh=mesh;}
    if(world.wall){const wall=world.wall;for(const x of [wall.planeX-6,wall.planeX+6])for(let i=0;i<4;i++){const a=wall.opening[i],b=wall.opening[(i+1)%4];line(worldGroup,[x,a[0],a[1]],[x,b[0],b[1]],'#d79a26',2.2);}for(const y of [-200,200])line(worldGroup,[wall.planeX,y,0],[wall.planeX,y,540],'#68859d',2);line(worldGroup,[wall.planeX,-200,540],[wall.planeX,200,540],'#68859d',2);const tag=pin('30°','#a67b17');tag.scale.set(25,25,1);tag.position.set(wall.planeX,0,235);worldGroup.add(tag);}
    if(world.mode==='hard')for(const [i,x]of [-42,42].entries()){const mark=new THREE.Mesh(new THREE.TorusGeometry(12,1.5,8,24),material(i?'#5b98db':'#dca442'));mark.position.set(x,0,160);worldGroup.add(mark);const tag=pin(i?'B':'A',i?'#215fad':'#99601d');tag.scale.set(14,14,1);tag.position.set(x,0,136);worldGroup.add(tag);}
    partLabels=[];parts=(world.parts||[world.part]).map(p=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(...p.size),material(p.color||'#edab39'));mesh.castShadow=true;mesh.receiveShadow=true;worldGroup.add(mesh);if(world.mode==='explore'){const tag=pin(p.id,p.color);worldGroup.add(tag);partLabels.push(tag);}return mesh;});
    ghostPart=new THREE.Mesh(new THREE.BoxGeometry(...world.part.size),material('#3c9ae2',true));worldGroup.add(ghostPart);
    // The requested XYZ point stays visible even when no reachable arm pose exists.
    targetMarker=new THREE.Group();targetMarker.name='coordinate-target';targetMarker.renderOrder=20;
    for(const axis of [[1,0,0],[0,1,0],[0,0,1]]){const cross=line(targetMarker,axis.map(v=>v*-10),axis.map(v=>v*10),'#1677dc',1.2);cross.material.depthTest=false;cross.material.depthWrite=false;cross.renderOrder=20;}
    const ring=new THREE.Mesh(new THREE.TorusGeometry(7,1.1,8,32),new THREE.MeshBasicMaterial({color:'#1677dc',depthTest:false,depthWrite:false}));ring.renderOrder=20;targetMarker.add(ring);
    const tag=label(text(language,'coordinateTarget'),'#165caa');tag.position.z=26;tag.scale.set(90,17,1);tag.renderOrder=21;targetLabel=tag;targetMarker.add(tag);worldGroup.add(targetMarker);
    targetLine=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),new THREE.LineDashedMaterial({color:'#1677dc',dashSize:5,gapSize:3,depthTest:false,depthWrite:false,transparent:true,opacity:.7}));targetLine.renderOrder=19;worldGroup.add(targetLine);
    collisionMarker=new THREE.Group();collisionMarker.name='collision-marker';
    const spot=new THREE.Mesh(new THREE.SphereGeometry(4.5,16,10),new THREE.MeshBasicMaterial({color:'#df2444',depthTest:false,depthWrite:false}));spot.renderOrder=30;collisionMarker.add(spot);
    const warning=pin('!','#ce1738');warning.position.z=23;warning.scale.set(24,24,1);warning.renderOrder=31;collisionMarker.add(warning);
    line(collisionMarker,[0,0,5],[0,0,14],'#df2444',1);worldGroup.add(collisionMarker);
    for(const [axis,end,color]of [['X',[80,0,0],'#c86255'],['Y',[0,80,0],'#4b9d77'],['Z',[0,0,80],'#5382c4']]){const arrow=new THREE.ArrowHelper(vec(end).normalize(),vec([0,0,0]),80,color,8,4);worldGroup.add(arrow);const tag=label(axis,color);tag.scale.set(20,14,1);tag.position.copy(vec(end));labels.add(tag);}
    home();
  }
  function update(world,{language='en',selected='A',target=null,targetPosition=null,error=false,motion=null,introVisible=true}={}){
    lastWorld=world;if(world.mode!==mode||world.arms.map(a=>a.axes).join(',')!==armKey||language!==lang)build(world,language);
    introLabels.visible=labels.visible=introVisible;targetLabel.visible=false;
    const hit=motion?.collision,shownTarget=hit?.q||target;
    renderer.domElement.setAttribute('aria-label',text(language,'sceneLabel')+(hit?' · '+text(language,'collisionScene'):''));
    const changed=shownTarget&&world.arms.find(a=>a.id===selected).q.some((v,i)=>Math.abs(v-shownTarget[i])>.01);
    targetMarker.visible=targetLine.visible=Array.isArray(targetPosition)&&targetPosition.length===3&&targetPosition.every(Number.isFinite);
    if(targetMarker.visible){const color=error?'#df2444':'#1677dc';targetMarker.position.copy(vec(targetPosition));targetMarker.traverse(o=>{if(o.isMesh)o.material.color.set(color);});const path=motion?.trace||[pose(world.arms.find(a=>a.id===selected)).tip,targetPosition],key=JSON.stringify(path);if(key!==lastPathKey){lastPathKey=key;targetLine.geometry.dispose();targetLine.geometry=new THREE.BufferGeometry().setFromPoints(path.map(vec));targetLine.computeLineDistances();}targetLine.material.color.set(color);}
    collisionMarker.visible=!!hit?.point;if(collisionMarker.visible)collisionMarker.position.copy(vec(hit.point));
    obstacleMeshes.forEach((mesh,i)=>mesh.material.color.set(hit?.obstacleIndex===i?'#df2444':'#7c94a8'));
    if(wallMesh){wallMesh.material.color.set(hit?.obstacleIndex!==undefined?'#df2444':'#68859d');wallMesh.material.opacity=hit?.obstacleIndex!==undefined ? .38 : .24;}
    world.arms.forEach((a,i)=>{updateArm(arms[i],a);ghosts[i].group.visible=a.id===selected&&!!changed;if(a.id===selected&&shownTarget){updateArm(ghosts[i],a,shownTarget);ghosts[i].group.traverse(o=>{if(o.material){o.material.color.set(error?'#df2444':'#308dcb');o.material.opacity=error ? .5 : .32;}});}});
    (world.parts||[world.part]).forEach((p,i)=>{parts[i].position.copy(vec(p.position));rotation(parts[i],p.rotation);parts[i].material.color.set(world.failure||hit?.partIndices?.includes(i)?'#df2444':p.color||'#edab39');if(partLabels[i])partLabels[i].position.set(p.position[0],p.position[1],p.position[2]+35);});
    ghostPart.visible=!!changed&&world.part.owner===selected;
    if(ghostPart.visible){const next=atPose(world,selected,shownTarget);ghostPart.position.copy(vec(next.part.position));rotation(ghostPart,next.part.rotation);ghostPart.material.color.set(error?'#df2444':'#308dcb');}
  }
  function size(){const w=host.clientWidth,h=host.clientHeight;if(w&&h){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}}
  const observer=new ResizeObserver(size);observer.observe(host);let frame;
  function draw(){controls.update();renderer.render(scene,camera);frame=requestAnimationFrame(draw);}size();draw();
  return {available:true,update,home,dispose(){cancelAnimationFrame(frame);observer.disconnect();controls.dispose();release(worldGroup);release(labels);release(introLabels);ground.geometry.dispose();ground.material.dispose();grid.geometry.dispose();grid.material.dispose();renderer.dispose();renderer.domElement.remove();}};
}
