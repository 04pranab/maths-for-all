let THREE=null;
try{THREE=await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");}
catch(error){console.error("3D engine could not load:",error);}
const COLORS={road:0x344452,roadEdge:0x66717a,grass:0x9bbd91,sidewalk:0xc9c8b9,white:0xf4f1e8,window:0x8ec4d1,red:0xff554f,green:0x4ce08b,amber:0xffc34d};
const VEHICLE={bike:{length:1.35,width:.62,height:1.15,gap:.9},car:{length:2.55,width:1.25,height:1.05,gap:1.05},truck:{length:4.1,width:1.45,height:1.65,gap:1.2}};
const mat=(color,roughness=.82,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
export class TrafficCity3D{
 constructor(host,{reducedMotion=false}={}){
  this.host=host;this.reducedMotion=reducedMotion;this.vehicles=new Map();this.signals={};this.level="easy";this.disposed=false;this.drag=null;this.elapsed=0;
  host.innerHTML="";
  if(!THREE){host.innerHTML='<div class="city-fallback">The 3D city could not load. Check your internet connection and reload the game.</div>';return}
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0xb8cbd0);this.scene.fog=new THREE.Fog(0xb8cbd0,48,100);
  this.camera=new THREE.PerspectiveCamera(42,1,.1,220);this.camera.position.set(25,27,30);this.camera.lookAt(0,0,0);
  try{this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false})}catch(error){console.error("WebGL is unavailable:",error);host.innerHTML='<div class="city-fallback">This browser could not start the 3D city. Please enable hardware acceleration or try a browser with WebGL support.</div>';return}this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.8));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.15;host.append(this.renderer.domElement);
  this.scene.add(new THREE.HemisphereLight(0xe9f6ff,0x71816b,2.1));const sun=new THREE.DirectionalLight(0xffe4bd,3.1);sun.position.set(-18,30,15);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-38;sun.shadow.camera.right=38;sun.shadow.camera.top=38;sun.shadow.camera.bottom=-38;this.scene.add(sun);
  this.city=new THREE.Group();this.scene.add(this.city);this.vehicleGroup=new THREE.Group();this.scene.add(this.vehicleGroup);this.buildCity();this.buildSignals();this.resize();
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);
  this.onPointerDown=e=>{this.drag={x:e.clientX,y:e.clientY,az:this.azimuth,el:this.elevation};host.setPointerCapture?.(e.pointerId)};
  this.azimuth=Math.PI/4;this.elevation=.56;this.distance=68;
  this.onPointerMove=e=>{if(!this.drag)return;this.azimuth=this.drag.az+(e.clientX-this.drag.x)*.006;this.elevation=THREE.MathUtils.clamp(this.drag.el+(e.clientY-this.drag.y)*.004,.34,1.05);this.placeCamera()};
  this.onPointerUp=()=>{this.drag=null};
  host.addEventListener("pointerdown",this.onPointerDown);host.addEventListener("pointermove",this.onPointerMove);host.addEventListener("pointerup",this.onPointerUp);host.addEventListener("pointercancel",this.onPointerUp);
  host.addEventListener("wheel",this.onWheel={handleEvent:e=>{e.preventDefault();this.distance=THREE.MathUtils.clamp((this.distance||68)+e.deltaY*.035,48,92);this.placeCamera()}},{passive:false});
  this.placeCamera();this.animate();
 }
 box(parent,w,h,d,x,y,z,material,cast=true){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;parent.add(m);return m}
 cyl(parent,r1,r2,h,x,y,z,material,segments=12){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m}
 buildCity(){
  const ground=mat(0x9fbd96),grass=mat(0x7fa77e),road=mat(COLORS.road),curb=mat(0xc7c5b7),lane=mat(0xf5e7bc),white=mat(0xf5f4eb),concrete=mat(0xd4d2c5);
  this.box(this.city,58,.5,46,0,-.35,0,ground,false);
  // City blocks and parks around the central junction.
  for(const [x,z] of [[-19,-14],[19,-14],[-19,14],[19,14]]){
   this.box(this.city,17,.18,12,x,.02,z,grass,false);
   this.box(this.city,17,.12,1.1,x,.12,z-5.4,concrete,false);
   this.box(this.city,17,.12,1.1,x,.12,z+5.4,concrete,false);
   for(let k=0;k<4;k++){const tx=x+(k%2?5:-5),tz=z+(k<2?-4:4);this.tree(tx,.12,tz)}
  }
  // Broad roads, raised kerbs, sidewalks and intersection.
  const hCurb=this.box(this.city,58,.18,10,0,.02,0,curb,false);hCurb.userData.horizontalRoad=true;const hRoad=this.box(this.city,58,.2,8.8,0,.13,0,road,false);hRoad.userData.horizontalRoad=true;
  this.box(this.city,10,.18,46,0,.02,0,curb,false);this.box(this.city,8.8,.2,46,0,.13,0,road,false);
  for(const z of [-5.5,5.5]){const m=this.box(this.city,58,.18,.55,0,.18,z,white,false);m.userData.horizontalRoad=true;}
  for(const x of [-5.5,5.5])this.box(this.city,.55,.18,46,x,.18,0,white,false);
  // Dashed lane markings, short and clear around the junction.
  for(let x=-28;x<=28;x+=4.3){if(Math.abs(x)>6){const m=this.box(this.city,1.9,.025,.12,x,.245,0,lane,false);m.userData.horizontalRoad=true;}}
  for(let z=-22;z<=22;z+=4.3){if(Math.abs(z)>6)this.box(this.city,.12,.025,1.9,0,.245,z,lane,false)}
  // Stop bars and zebra crossings on all four approaches.
  for(const z of [-6.1,6.1]){this.box(this.city,8.4,.035,.22,0,.27,z,white,false);for(let x=-4.2;x<=4.2;x+=1.2)this.box(this.city,.65,.035,1.25,x,.28,z+(z<0?-1.2:1.2),white,false)}
  for(const x of [-6.1,6.1]){const stop=this.box(this.city,.22,.035,8.4,x,.27,0,white,false);stop.userData.horizontalRoad=true;for(let z=-4.2;z<=4.2;z+=1.2){const stripe=this.box(this.city,1.25,.035,.65,x+(x<0?-1.2:1.2),.28,z,white,false);stripe.userData.horizontalRoad=true}}
  // City blocks: modern low-rise, mid-rise and civic buildings.
  this.building(-20,-15,7,5.5,7,0xd9c8a7,0x9d7054,"RESIDENTIAL");
  this.building(20,-15,7.5,6,10,0xe2bdb5,0xa46d69,"LIBRARY");
  this.building(-20,15,7,6,8,0xe5d4ac,0xc18a5b,"MARKET");
  this.building(20,15,8,6,11,0xc9ddd7,0x689b94,"HOSPITAL");
  // Extra skyline in the far blocks for scale.
  for(const [x,z,h,c] of [[-26,-17,13,0x8da7b4],[26,-17,15,0xb4a5c4],[-26,17,12,0xb3a18b],[26,17,16,0x8baea6]])this.building(x,z,4.4,4.5,h,c,0x566f78,"");
  // Street lamps at the outer corners.
  for(const x of [-8,8])for(const z of [-8,8])this.streetLamp(x,z);
 }
 building(x,z,w,d,h,color,roofColor,label){
  const g=new THREE.Group();g.position.set(x,0,z);this.city.add(g);
  const body=mat(color),roof=mat(roofColor),glass=mat(0x86bac8,.35,.12),trim=mat(0xf1eadc);
  this.box(g,w,h,d,0,h/2,0,body);this.box(g,w+.45,.35,d+.45,0,h+.15,0,roof);
  // facade window grid on both visible faces.
  const floors=Math.max(1,Math.floor(h/2.2));
  for(let f=0;f<floors;f++){const y=1.15+f*2.05;if(y>h-.7)continue;for(let xx=-w/2+1;xx<w/2-.5;xx+=1.7){this.box(g,.95,1.15,.07,xx,y,d/2+.045,glass,false);this.box(g,.07,1.15,.07,xx,y,d/2+.09,trim,false)}for(let zz=-d/2+1;zz<d/2-.5;zz+=1.65)this.box(g,w>5?.07:.07,1.15,.95,w/2+.045,y,zz,glass,false)}
  if(label){const sign=this.box(g,Math.min(w-1,5.5),.55,.16,0,h*.63,d/2+.14,mat(0xf8f4e9),false);sign.material=mat(0xf8f4e9)}
  // rooftop HVAC and a small entrance canopy.
  this.box(g,1.6,.7,1.2,-w*.25,h+.65,0,mat(0x87969b));this.box(g,2.5,.35,1.2,0,.3,d/2+.45,roof);
 }
 tree(x,y,z){const trunk=mat(0x806047),leaf1=mat(0x4f8a67),leaf2=mat(0x6da879);this.cyl(this.city,.22,.3,1.5,x,y+.75,z,trunk);for(const [dx,dy,dz,r] of [[0,2.1,0,1.15],[-.55,1.8,.1,.72],[.5,1.9,-.1,.78]]){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),dx?leaf2:leaf1);m.position.set(x+dx,y+dy,z+dz);m.castShadow=true;this.city.add(m)}}
 streetLamp(x,z){const pole=mat(0x344652),light=mat(0xffe6ad,.3);this.cyl(this.city,.08,.11,3.4,x,1.7,z,pole);this.box(this.city,.85,.12,.28,x+.32,3.38,z,light)}
 buildSignals(){
  for(const d of ["north","south","east","west"]){const g=new THREE.Group();let x=0,z=0,rot=0;if(d==="north"){x=6.6;z=-7;rot=0}else if(d==="south"){x=-6.6;z=7;rot=Math.PI}else if(d==="east"){x=7;z=6.6;rot=-Math.PI/2}else{x=-7;z=-6.6;rot=Math.PI/2}g.position.set(x,.25,z);g.rotation.y=rot;this.scene.add(g);const black=mat(0x1e303b),post=mat(0x344b56);this.cyl(g,.12,.16,2.7,0,1.35,0,post);this.box(g,.65,1.35,.42,0,2.55,0,black);const bulbs=[];for(let i=0;i<3;i++){const material=new THREE.MeshStandardMaterial({color:[COLORS.red,COLORS.amber,COLORS.green][i],emissive:0x000000,roughness:.25});const bulb=new THREE.Mesh(new THREE.SphereGeometry(.17,16,12),material);bulb.position.set(0,2.95-i*.4,.23);g.add(bulb);bulbs.push(bulb)}this.signals[d]=bulbs;g.userData.direction=d;this.setSignal(d,false)}
 }
 setSignal(direction,green){if(!this.signals)return;const bulbs=this.signals[direction];if(!bulbs)return;bulbs.forEach((b,i)=>{const on=green?i===2:i===0;b.material.emissive.setHex(on?[COLORS.red,COLORS.amber,COLORS.green][i]:0x000000);b.material.emissiveIntensity=on?1.8:0;b.material.color.setHex(on?[COLORS.red,COLORS.amber,COLORS.green][i]:0x303a40)})}
 setLevel(level){this.level=level;if(!this.city)return;this.city.children.forEach(o=>{if(o.userData.horizontalRoad)o.visible=level!=="easy"});for(const [d,b] of Object.entries(this.signals)){const active=level!=="easy"||d==="north"||d==="south";b[0].parent.visible=active}}
 positionFor(direction,index,kind,queueOffset=0){
  const offset=6.8+queueOffset,laneOffset=1.65;
  const map={north:{x:-laneOffset,z:-offset,yaw:0,exit:{x:-laneOffset,z:34}},south:{x:laneOffset,z:offset,yaw:Math.PI,exit:{x:laneOffset,z:-34}},east:{x:offset,z:laneOffset,yaw:-Math.PI/2,exit:{x:-34,z:laneOffset}},west:{x:-offset,z:-laneOffset,yaw:Math.PI/2,exit:{x:34,z:-laneOffset}}};
  return{...map[direction],y:.28}
 }
 positionsForQueue(direction,list){
  let offset=0;
  return list.map((kind,index)=>{
   const position=this.positionFor(direction,index,kind,offset),next=list[index+1];
   if(next){const currentLength=VEHICLE[kind].length,nextLength=VEHICLE[next].length;offset+=(currentLength+nextLength)/2+Math.max(VEHICLE[kind].gap,VEHICLE[next].gap)}
   return position;
  })
 }
 makeVehicle(kind,color){
  const g=new THREE.Group(),paint=mat(color,.38,.15),glass=mat(0x9fcbd5,.22,.12),rubber=mat(0x202a30),chrome=mat(0xcbd6d9,.28,.7),lamp=mat(0xfff1c2,.25);
  if(kind==="bike"){
   for(const z of [-.58,.58]){const wheel=new THREE.Mesh(new THREE.TorusGeometry(.34,.065,8,18),rubber);wheel.rotation.y=Math.PI/2;wheel.position.set(0,.42,z);g.add(wheel)}
   const tube=mat(0xd9a63e,.45,.25);for(const [a,b] of [[[-.42,.42,-.58],[.38,.42,0]],[[-.42,.42,-.58],[0,.42,.58]],[[0,.42,.58],[.38,.42,0]],[[-.42,.42,-.58],[.38,.72,0]],[[.38,.72,0],[0,.42,.58]]]){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),v=new THREE.Vector3().subVectors(B,A);const m=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,v.length(),8),tube);m.position.copy(A).add(B).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());g.add(m)}
   this.cyl(g,.08,.08,.35,0,.95,-.02,chrome);this.box(g,.34,.14,.34,0,1.03,.12,paint);return g;
  }
  const length=kind==="truck"?4.1:2.55,width=kind==="truck"?1.45:1.25;
  // wheels on both sides, two axles for cars and three for trucks.
  const axles=kind==="truck"?[-1.35,0,1.35]:[-.72,.72];
  for(const z of axles)for(const x of [-width/2-.02,width/2+.02]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.31,.31,.16,16),rubber);wheel.rotation.z=Math.PI/2;wheel.position.set(x,.34,z);g.add(wheel);const hub=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.17,12),chrome);hub.rotation.z=Math.PI/2;hub.position.set(x*1.01,.34,z);g.add(hub)}
  this.box(g,width,.42,length,0,.67,0,paint);
  if(kind==="truck"){this.box(g,width*.96,1.05,2.45,0,1.35,-.55,mat(color===0xe8b34e?0xe7e4d9:0xd9e0e4));this.box(g,width*.9,.8,1.15,0,1.22,1.35,paint);this.box(g,width*.72,.48,.06,0,1.42,1.94,glass)}
  else{this.box(g,width*.84,.68,1.28,0,1.12,-.12,paint);this.box(g,width*.76,.48,.92,0,1.19,.72,glass);this.box(g,width*.76,.42,.72,0,1.15,-.82,glass)}
  for(const x of [-width*.34,width*.34]){this.box(g,.18,.14,.12,x,.65,length/2-.04,lamp,false);this.box(g,.18,.14,.12,x,.65,-length/2+.04,mat(0xe45d52),false)}
  return g;
 }
 addVehicles(queues,palette){if(!this.vehicleGroup)return;this.vehicleGroup.clear();this.vehicles.clear();const colors=[0xe97862,0xf0bd52,0x319ba2,0x6c83c8,0x9c78bd,0x6d9c73];for(const [d,list] of Object.entries(queues)){const positions=this.positionsForQueue(d,list);list.forEach((kind,i)=>{const g=this.makeVehicle(kind,colors[(i+["north","south","east","west"].indexOf(d)*2)%colors.length]);const p=positions[i];g.position.set(p.x,p.y,p.z);g.rotation.y=p.yaw;g.userData={direction:d,kind,position:{...p}};this.vehicleGroup.add(g);this.vehicles.set(d+":"+i,g)})}}
 moveVehicles(moving,onDone,{stagger=90,duration=1600}={}){
  if(!this.vehicleGroup){onDone?.();return}const animations=[];moving.forEach((v,i)=>{const g=this.makeVehicle(v.kind,v.color||0x319ba2);const p=v.start;g.position.set(p.x,p.y,p.z);g.rotation.y=p.yaw;this.vehicleGroup.add(g);const end={x:p.exit.x,z:p.exit.z};animations.push({g,start:performance.now()+i*stagger,duration:duration,from:{x:p.x,z:p.z},to:end})});
  const tick=()=>{if(!animations.length){onDone?.();return}const now=performance.now();for(let i=animations.length-1;i>=0;i--){const a=animations[i];const t=THREE.MathUtils.clamp((now-a.start)/a.duration,0,1),e=1-Math.pow(1-t,3);a.g.position.x=THREE.MathUtils.lerp(a.from.x,a.to.x,e);a.g.position.z=THREE.MathUtils.lerp(a.from.z,a.to.z,e);if(t>=1){this.vehicleGroup.remove(a.g);animations.splice(i,1)}}if(animations.length)requestAnimationFrame(tick);else onDone?.()};requestAnimationFrame(tick)
 }
 resize(){if(!this.renderer)return;const w=Math.max(1,this.host.clientWidth),h=Math.max(1,this.host.clientHeight);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h,false)}
 placeCamera(){if(!this.camera)return;const r=this.distance||47;this.camera.position.set(Math.sin(this.azimuth)*r,Math.sin(this.elevation)*r,Math.cos(this.azimuth)*r);this.camera.lookAt(0,1.2,0)}
 animate(){if(this.disposed||!this.renderer)return;this.frame=requestAnimationFrame(()=>this.animate());this.renderer.render(this.scene,this.camera)}
 dispose(){this.disposed=true;cancelAnimationFrame(this.frame);this.resizeObserver?.disconnect();this.renderer?.dispose()}
}
