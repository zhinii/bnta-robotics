import * as THREE from 'three';
import { OrbitControls } from './vendor/three/examples/jsm/controls/OrbitControls.js';
import { pose, atPose, gripperParts } from './challenge-model.mjs';
import { text } from './challenge-i18n.mjs';
import { createFairinoArm, updateFairinoArm } from './fairino-arm.mjs';
const vec=p=>new THREE.Vector3(...p),Y=new THREE.Vector3(0,1,0);
function material(color,ghost=false){return new THREE.MeshStandardMaterial({color,roughness:.45,metalness:.15,transparent:ghost,opacity:ghost?.3:1,depthWrite:!ghost,wireframe:ghost});}
function orient(mesh,a,b){const d=vec(b).sub(vec(a));mesh.position.copy(vec(a).add(vec(b)).multiplyScalar(.5));mesh.scale.set(1,d.length(),1);mesh.quaternion.setFromUnitVectors(Y,d.normalize());}
function rotation(mesh,r){mesh.setRotationFromMatrix(new THREE.Matrix4().set(r[0],r[1],r[2],0,r[3],r[4],r[5],0,r[6],r[7],r[8],0,0,0,0,1));}
export function armGraph(arm,ghost=false){
  const graph=createFairinoArm(arm.axes);
  if(ghost)graph.group.traverse(o=>{if(o.isMesh){o.material=new THREE.MeshBasicMaterial({color:'#3c9ae2',transparent:true,opacity:.18,depthWrite:false,wireframe:true});o.castShadow=false;o.receiveShadow=false;}});
  return graph;
}
export function updateArm(graph,arm,q=arm.q){updateFairinoArm(graph,pose(arm,q),arm);}
function release(group){group.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material]){m.map?.dispose();m.dispose();}}});group.clear();}
function label(message,color='#314b65'){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const c=canvas.getContext('2d');c.fillStyle='#ffffffdd';c.beginPath();c.roundRect(0,0,512,96,20);c.fill();c.font='600 34px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillStyle=color;c.fillText(message,256,48,490);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false,toneMapped:false}));sprite.scale.set(105,20,1);return sprite;}
export function createChallengeScene(host,language='en'){
  let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true});}catch{host.textContent=text(language,'webgl');return {update(){},home(){},dispose(){},available:false};}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setClearColor('#e9eff3');renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;host.append(renderer.domElement);renderer.domElement.setAttribute('aria-label',text(language,'sceneLabel'));
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,1,3000);camera.up.set(0,0,1);
  scene.add(new THREE.HemisphereLight('#e9f3ff','#65758b',1.8));const sun=new THREE.DirectionalLight('#fff3df',3);sun.position.set(-200,-300,650);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-600,right:600,top:550,bottom:-550,near:1,far:1500});sun.shadow.normalBias=.5;sun.shadow.bias=-.0002;scene.add(sun);const fill=new THREE.DirectionalLight('#bcd8ff',1.3);fill.position.set(400,250,450);scene.add(fill);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(1600,1400),material('#e3eaf0'));ground.position.z=-1;ground.receiveShadow=true;scene.add(ground);
  const grid=new THREE.GridHelper(1100,22,'#acbecd','#d4dfe7');grid.rotation.x=Math.PI/2;grid.position.z=.1;scene.add(grid);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=150;controls.maxDistance=1800;controls.maxPolarAngle=Math.PI*.49;
  let worldGroup=new THREE.Group(),labels=new THREE.Group(),arms=[],ghosts=[],part,ghostPart,mode='',lang='',lastWorld=null;
  scene.add(worldGroup,labels);
  function home(){const hard=mode==='hard';controls.target.set(hard?0:115,0,mode==='easy'?105:125);camera.position.set(mode==='easy'?390:530,hard?-650:mode==='easy'?-340:-510,hard?420:mode==='easy'?280:380);controls.update();}
  function build(world,language){
    release(worldGroup);release(labels);arms=[];ghosts=[];mode=world.mode;lang=language;
    for(const arm of world.arms){const graph=armGraph(arm),ghost=armGraph(arm,true);worldGroup.add(graph.group,ghost.group);arms.push(graph);ghosts.push(ghost);const tag=label(text(language,arm.id==='A'?'armA':'armB'),arm.id==='A'?'#96601c':'#215f9b');tag.position.copy(vec(arm.base));tag.position.z=25;labels.add(tag);}
    for(const [i,p] of [world.source,world.destination].entries()){
      const pillar=new THREE.Mesh(new THREE.CylinderGeometry(9,15,p[2]-12,16),material('#b7c5d0'));pillar.rotation.x=Math.PI/2;pillar.position.set(p[0],p[1],(p[2]-12)/2);pillar.castShadow=true;pillar.receiveShadow=true;worldGroup.add(pillar);
      const target=new THREE.Mesh(new THREE.BoxGeometry(world.part.size[0]+12,world.part.size[1]+12,5),material(i?'#85ba9b':'#e8bc79'));target.position.set(p[0],p[1],p[2]-10);if(i&&world.mode==='medium')target.rotation.z=Math.PI/2;target.castShadow=true;target.receiveShadow=true;worldGroup.add(target);
      const tag=label(text(language,i?'destination':'source'));tag.position.set(p[0],p[1],p[2]-34);labels.add(tag);
    }
    for(const box of world.obstacles){const mesh=new THREE.Mesh(new THREE.BoxGeometry(...box.max.map((v,i)=>v-box.min[i])),material('#7c94a8'));mesh.position.copy(vec(box.max.map((v,i)=>(v+box.min[i])/2)));mesh.castShadow=true;mesh.receiveShadow=true;worldGroup.add(mesh);}
    if(world.mode==='hard')for(const [i,x]of [-42,42].entries()){const mark=new THREE.Mesh(new THREE.TorusGeometry(12,1.5,8,24),material(i?'#5b98db':'#dca442'));mark.position.set(x,0,160);worldGroup.add(mark);const tag=label(text(language,i?'transferB':'transferA'));tag.position.set(x,0,123);labels.add(tag);}
    part=new THREE.Mesh(new THREE.BoxGeometry(...world.part.size),material('#edab39'));part.castShadow=true;part.receiveShadow=true;worldGroup.add(part);
    ghostPart=new THREE.Mesh(new THREE.BoxGeometry(...world.part.size),material('#3c9ae2',true));worldGroup.add(ghostPart);
    for(const [axis,end,color]of [['X',[80,0,0],'#c86255'],['Y',[0,80,0],'#4b9d77'],['Z',[0,0,80],'#5382c4']]){const arrow=new THREE.ArrowHelper(vec(end).normalize(),vec([0,0,0]),80,color,8,4);worldGroup.add(arrow);const tag=label(axis,color);tag.scale.set(20,14,1);tag.position.copy(vec(end));labels.add(tag);}
    home();
  }
  function update(world,{language='en',selected='A',target=null,error=false}={}){
    lastWorld=world;if(world.mode!==mode||language!==lang)build(world,language);
    renderer.domElement.setAttribute('aria-label',text(language,'sceneLabel'));
    const changed=target&&world.arms.find(a=>a.id===selected).q.some((v,i)=>Math.abs(v-target[i])>.01);
    world.arms.forEach((a,i)=>{updateArm(arms[i],a);ghosts[i].group.visible=a.id===selected&&!!changed;if(a.id===selected&&target){updateArm(ghosts[i],a,target);ghosts[i].group.traverse(o=>{if(o.material)o.material.color.set(error?'#c34554':'#308dcb');});}});
    part.position.copy(vec(world.part.position));rotation(part,world.part.rotation);
    ghostPart.visible=!!changed&&world.part.owner===selected;
    if(ghostPart.visible){const next=atPose(world,selected,target);ghostPart.position.copy(vec(next.part.position));rotation(ghostPart,next.part.rotation);ghostPart.material.color.set(error?'#c34554':'#308dcb');}
  }
  function size(){const w=host.clientWidth,h=host.clientHeight;if(w&&h){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}}
  const observer=new ResizeObserver(size);observer.observe(host);let frame;
  function draw(){controls.update();renderer.render(scene,camera);frame=requestAnimationFrame(draw);}size();draw();
  return {available:true,update,home,dispose(){cancelAnimationFrame(frame);observer.disconnect();controls.dispose();release(worldGroup);release(labels);ground.geometry.dispose();ground.material.dispose();grid.geometry.dispose();grid.material.dispose();renderer.dispose();renderer.domElement.remove();}};
}
