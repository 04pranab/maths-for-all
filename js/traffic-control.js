const LEVELS_BASE = {
 easy: {
  label:"EASY · BEGINNER", name:"Two-way Avenue", directions:["north","south"], budget:40, step:5, serviceSeconds:10, variable:false,
  rounds:[
   {title:"First day on traffic duty",description:"Cars are queued on the north and south approaches. Give each direction its own green phase so vehicles travel north-to-south and south-to-north safely.",objective:"Allocate the 40-second cycle between northbound and southbound traffic. Every 10 seconds clears one car in the direction with the green light.",queues:{north:["car","car"],south:["car"]},waitMinutes:{north:1,south:1},budget:40,lesson:"Northbound and southbound traffic take turns. Divide the 40-second budget into two green phases; every 10 seconds clears one car in the selected direction."},
   {title:"The school gate",description:"More families are arriving. Work out how many cars can pass during the next signal cycle.",objective:"Split the 30-second cycle between northbound and southbound traffic. How many cars can each phase clear?",queues:{north:["car","car","car"],south:["car","car"]},waitMinutes:{north:2,south:2},budget:30,lesson:"Each 10-second phase clears one car. Divide the 30-second budget between the two directions, then compare each phase with its queue."},
   {title:"Clear the avenue",description:"The last rush is here. Choose a safe cycle length that clears the waiting traffic.",objective:"Allocate the 40-second cycle across the two directions. Find a split that clears the most cars.",queues:{north:["car","car","car","car"],south:["car","car","car"]},waitMinutes:{north:3,south:2},budget:40,lesson:"The total budget is 40 seconds, not 40 seconds per direction. Each car needs 10 seconds, so compare possible northbound/southbound splits before running the plan."}
  ]
 },
 medium:{
  label:"MEDIUM · CITY TRAFFIC",name:"Four-way Junction",directions:["north","south","east","west"],budget:60,step:5,serviceSeconds:10,variable:false,
  rounds:[
   {title:"Market Street rush",description:"Traffic arrives from all four sides. North–South and East–West must take turns.",objective:"Use the 60-second budget to decide which road needs the longer green phase.",queues:{north:["car","car","car"],south:["car","car"],east:["car","car","car"],west:["car","car"]},waitMinutes:{north:2,south:2,east:3,west:2},budget:60,lesson:"Each 10-second green interval serves one vehicle from each open approach. Compare the two road totals before choosing a split."},
   {title:"Hospital priority",description:"The hospital approach has a growing queue and a longer wait. Your signal plan must account for urgency.",objective:"Multiply vehicles served by their waiting-time weight to maximise priority points.",queues:{north:["car","car","car","car"],south:["car","car","car"],east:["car","car","car","car"],west:["car","car"]},waitMinutes:{north:2,south:3,east:5,west:4},budget:60,lesson:"Priority points = vehicles served × waiting minutes × 10. The longest queue is not automatically the most urgent."},
   {title:"Downtown gridlock",description:"All four approaches are packed. Make the best use of a limited signal cycle.",objective:"Calculate each road's capacity and compare the score from different green-time splits.",queues:{north:["car","car","car","car","car"],south:["car","car","car","car"],east:["car","car","car","car"],west:["car","car","car"]},waitMinutes:{north:4,south:3,east:2,west:5},budget:80,lesson:"Test several allocations. The optimal split is the one that earns the most total priority points without exceeding the cycle budget."}
  ]
 },
 hard:{
  label:"HARD · TRAFFIC ENGINEER",name:"Mixed Fleet Junction",directions:["north","south","east","west"],budget:90,step:5,serviceSeconds:10,variable:true,
  rounds:[
   {title:"The mixed fleet",description:"Bicycles, cars and heavy trucks share the junction. Each needs a different amount of green time to clear safely.",objective:"Add the crossing times in each queue. A cycle needs 5s, a car 10s and a truck 15s. Allocate green time to maximise priority.",queues:{north:["bike","car","truck","bike"],south:["car","bike","truck"],east:["truck","car","bike","car"],west:["bike","truck","car"]},waitMinutes:{north:3,south:2,east:4,west:3},budget:90,lesson:"Capacity is no longer queue size ÷ 10. Add each vehicle's service time in order: bicycle 5s, car 10s, truck 15s. A queue clears only when its cumulative time fits the green phase."},
   {title:"Heavy vehicle corridor",description:"Large delivery trucks are slowing the junction. Bicycles clear quickly, but trucks need longer protected green time.",objective:"Calculate the cumulative service time for each approach, then compare priority points for each possible split.",queues:{north:["truck","truck","car","bike"],south:["bike","car","truck","car"],east:["truck","car","truck"],west:["bike","bike","car","truck"]},waitMinutes:{north:5,south:3,east:4,west:2},budget:100,lesson:"For each approach, add service times in queue order. Do not count a vehicle if its full crossing time would exceed the green phase."},
   {title:"Rush-hour optimisation",description:"The entire city is moving. Your job is to clear the highest-priority traffic with a fixed 120-second signal budget.",objective:"Find the best green split by considering queue order, vehicle type, service time and waiting-time priority.",queues:{north:["truck","car","bike","truck","car"],south:["bike","car","truck","bike"],east:["car","truck","truck","bike"],west:["truck","bike","car","car"]},waitMinutes:{north:5,south:3,east:4,west:5},budget:120,lesson:"Optimise the schedule: cumulative service time determines how many vehicles fit; waiting-time weights determine the score. A good plan balances both."}
  ]
 }
};


// Keep the original first three scenarios, then generate 47 deterministic
// scenarios per difficulty. Each generated round has its own queues, waits,
// cycle budget and vehicle order, so the 50 challenges are not repeats.
const CHALLENGE_THEMES = [
  "Morning commute","School-zone traffic","Market delivery rush","Rainy-day junction",
  "Bus-stop bottleneck","Library crossing","Stadium traffic","Shopping street",
  "Construction detour","Station approach","Weekend visitors","Office-hour flow",
  "Museum avenue","Bridge approach","Park entrance","Community fair",
  "Roadwork diversion","Late-morning traffic","Sports-day arrivals","Festival route",
  "Narrow-lane queue","Delivery corridor","Evening commute","Tourist district",
  "Emergency access","Residential avenue","College crossing","Town-centre rush",
  "One-way diversion","Busy roundabout","Railway crossing","Harbour road",
  "Airport approach","Food-market lane","Concert traffic","Pedestrian zone",
  "Factory shift change","Rain-soaked boulevard","Expressway exit","Old-town junction",
  "Public-holiday traffic","Hospital approach","Shopping-centre exit","Greenway crossing",
  "Night-market route","Coach-terminal queue","Cycling corridor","High-street bottleneck",
  "Festival departure","Final city-wide rush"
];

function makeChallengeRandom(seed) {
  let state = seed >>> 0;
  return max => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state % max;
  };
}

function generatedRounds(levelKey, originalRounds) {
  const rounds = [...originalRounds];
  const levelOffset = levelKey === "easy" ? 1103 : levelKey === "medium" ? 2207 : 3301;
  const directions = LEVELS_BASE[levelKey].directions;
  const themes = CHALLENGE_THEMES;

  for (let i = rounds.length; i < 50; i++) {
    const number = i + 1;
    const random = makeChallengeRandom(levelOffset + number * 7919);
    const base = levelKey === "easy"
      ? 2 + Math.floor(i / 12)
      : levelKey === "medium"
        ? 2 + Math.floor(i / 12)
        : 2 + Math.floor(i / 12);
    const queues = {};
    const waitMinutes = {};
    let easyLayoutCode = i + 3;
    for (const reservedCode of [1, 12, 23]) {
      if (easyLayoutCode >= reservedCode) easyLayoutCode++;
    }

    for (const direction of directions) {
      const variation = random(5) - 2;
      const directionIndex = directions.indexOf(direction);
      const size = levelKey === "easy"
        ? (direction === "north" ? 1 + (easyLayoutCode % 10) : 1 + Math.floor(easyLayoutCode / 10))
        : levelKey === "medium"
          ? 1 + (Math.floor(i / Math.pow(6, directionIndex)) % 6)
          : 2 + (Math.floor(i / Math.pow(6, directionIndex)) % 6);
      queues[direction] = [];
      for (let vehicle = 0; vehicle < size; vehicle++) {
        if (levelKey === "hard") {
          const fleet = ["bike", "car", "truck"];
          queues[direction].push(fleet[random(fleet.length)]);
        } else {
          queues[direction].push("car");
        }
      }
      waitMinutes[direction] = 1 + random(5);
    }

    const budget = levelKey === "easy"
      ? 40 + (i % 7) * 5
      : levelKey === "medium"
        ? 60 + (i % 7) * 5
        : 90 + (i % 7) * 10;
    const theme = themes[i % themes.length];
    const totalVehicles = Object.values(queues).reduce((sum, queue) => sum + queue.length, 0);
    const fleetTimes = { bike: 5, car: 10, truck: 15 };
    const crossingTime = Object.values(queues).reduce(
      (sum, queue) => sum + queue.reduce((subtotal, kind) => subtotal + (fleetTimes[kind] || 10), 0), 0
    );

    let objective, lesson;
    if (levelKey === "easy") {
      objective = `Split the ${budget}-second cycle between northbound and southbound traffic. Work out how many cars each green phase can clear.`;
      lesson = `There are ${totalVehicles} cars waiting. Each car needs 10 seconds, so compare the queue sizes with your two green phases and use the full ${budget}-second budget carefully.`;
    } else if (levelKey === "medium") {
      objective = `Allocate the ${budget}-second cycle between North–South and East–West. Prioritise the approaches with the greatest waiting-time score.`;
      lesson = `Each open approach can clear one car per 10 seconds. Compare the queues and waiting-time weights before choosing how to divide the ${budget} seconds.`;
    } else {
      objective = `Add the crossing times for all four queues. Bikes need 5s, cars 10s and trucks 15s. Use the ${budget}-second budget to maximise priority points.`;
      lesson = `The queues contain ${totalVehicles} vehicles and need ${crossingTime} seconds in total if served one after another. Add service times in queue order, then balance capacity against waiting-time priority.`;
    }

    rounds.push({
      title: `Challenge ${String(number).padStart(2, "0")} · ${theme}`,
      description: levelKey === "easy"
        ? `A new two-way traffic pattern has formed near ${theme.toLowerCase()}. Read both queues and plan a safe northbound/southbound split.`
        : levelKey === "medium"
          ? `Traffic is building around ${theme.toLowerCase()}. Compare all four approaches and choose the best two-phase signal plan.`
          : `A mixed fleet is approaching the ${theme.toLowerCase()}. Account for every bicycle, car and truck before allocating green time.`,
      objective,
      queues,
      waitMinutes,
      budget,
      lesson
    });
  }
  return rounds;
}

const LEVELS = Object.fromEntries(
  Object.entries(LEVELS_BASE).map(([key, config]) => [
    key,
    { ...config, rounds: generatedRounds(key, config.rounds) }
  ])
);


let THREE=null;
try{THREE=await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");}
catch(error){console.error("3D engine could not load:",error);}
const COLORS={road:0x344452,roadEdge:0x66717a,grass:0x9bbd91,sidewalk:0xc9c8b9,white:0xf4f1e8,window:0x8ec4d1,red:0xff554f,green:0x4ce08b,amber:0xffc34d};
const VEHICLE={bike:{length:1.35,width:.62,height:1.15,gap:.9},car:{length:2.55,width:1.25,height:1.05,gap:1.05},truck:{length:4.1,width:1.45,height:1.65,gap:1.2}};
const mat=(color,roughness=.82,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
class TrafficCity3D{
 constructor(host,{reducedMotion=false}={}){
  this.host=host;this.reducedMotion=reducedMotion;this.vehicles=new Map();this.signals={};this.level="easy";this.disposed=false;this.paused=false;this.pendingMoveTick=null;this.elapsed=0;
  host.innerHTML="";
  if(!THREE){host.innerHTML='<div class="city-fallback">The 3D city could not load. Check your internet connection and reload the game.</div>';return}
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0xb8cbd0);this.scene.fog=new THREE.Fog(0xb8cbd0,48,100);
  this.camera=new THREE.PerspectiveCamera(38,1,.1,260);this.camera.position.set(0,64,30);this.camera.lookAt(0,0,0);
  try{this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false})}catch(error){console.error("WebGL is unavailable:",error);host.innerHTML='<div class="city-fallback">This browser could not start the 3D city. Please enable hardware acceleration or try a browser with WebGL support.</div>';return}this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.8));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.15;host.append(this.renderer.domElement);
  this.scene.add(new THREE.HemisphereLight(0xe9f6ff,0x71816b,2.1));const sun=new THREE.DirectionalLight(0xffe4bd,3.1);sun.position.set(-18,30,15);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-38;sun.shadow.camera.right=38;sun.shadow.camera.top=38;sun.shadow.camera.bottom=-38;this.scene.add(sun);
  this.city=new THREE.Group();this.scene.add(this.city);this.vehicleGroup=new THREE.Group();this.scene.add(this.vehicleGroup);this.buildCity();this.buildSignals();this.resize();
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);
  host.style.cursor="default";
  this.placeCamera();this.animate();
 }
 box(parent,w,h,d,x,y,z,material,cast=true){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;parent.add(m);return m}
 cyl(parent,r1,r2,h,x,y,z,material,segments=12){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m}
 buildCity(){
  const ground=mat(0x9fbd96),grass=mat(0x7fa77e),road=mat(COLORS.road),curb=mat(0xc7c5b7),lane=mat(0xf5e7bc),white=mat(0xf5f4eb),concrete=mat(0xd4d2c5);
  this.box(this.city,76,.5,76,0,-.35,0,ground,false);
  // City blocks and parks around the central junction.
  for(const [x,z] of [[-19,-14],[19,-14],[-19,14],[19,14]]){
   this.box(this.city,17,.18,12,x,.02,z,grass,false);
   this.box(this.city,17,.12,1.1,x,.12,z-5.4,concrete,false);
   this.box(this.city,17,.12,1.1,x,.12,z+5.4,concrete,false);
   for(let k=0;k<4;k++){const tx=x+(k%2?5:-5),tz=z+(k<2?-4:4);this.tree(tx,.12,tz)}
  }
  // Broad roads, raised kerbs, sidewalks and intersection.
  const hCurb=this.box(this.city,70,.18,10,0,.02,0,curb,false);hCurb.userData.horizontalRoad=true;const hRoad=this.box(this.city,70,.2,8.8,0,.13,0,road,false);hRoad.userData.horizontalRoad=true;
  this.box(this.city,10,.18,70,0,.02,0,curb,false);this.box(this.city,8.8,.2,70,0,.13,0,road,false);
  for(const z of [-5.5,5.5]){const m=this.box(this.city,70,.18,.55,0,.18,z,white,false);m.userData.horizontalRoad=true;}
  for(const x of [-5.5,5.5])this.box(this.city,.55,.18,46,x,.18,0,white,false);
  // Dashed lane markings, short and clear around the junction.
  for(let x=-34;x<=34;x+=4.3){if(Math.abs(x)>6){const m=this.box(this.city,1.9,.025,.12,x,.245,0,lane,false);m.userData.horizontalRoad=true;}}
  for(let z=-34;z<=34;z+=4.3){if(Math.abs(z)>6)this.box(this.city,.12,.025,1.9,0,.245,z,lane,false)}
  // Stop bars and zebra crossings on all four approaches.
  for(const z of [-6.1,6.1]){this.box(this.city,8.4,.035,.22,0,.27,z,white,false);for(let x=-4.2;x<=4.2;x+=1.2)this.box(this.city,.65,.035,1.25,x,.28,z+(z<0?-1.2:1.2),white,false)}
  for(const x of [-6.1,6.1]){const stop=this.box(this.city,.22,.035,8.4,x,.27,0,white,false);stop.userData.horizontalRoad=true;for(let z=-4.2;z<=4.2;z+=1.2){const stripe=this.box(this.city,1.25,.035,.65,x+(x<0?-1.2:1.2),.28,z,white,false);stripe.userData.horizontalRoad=true}}
  // City blocks: modern low-rise, mid-rise and civic buildings.
  this.building(-20,-15,7,5.5,7,0xd9c8a7,0x9d7054,"RESIDENTIAL");
  this.building(20,-15,7.5,6,10,0xe2bdb5,0xa46d69,"LIBRARY");
  this.building(-20,15,7,6,8,0xe5d4ac,0xc18a5b,"MARKET");
  this.building(20,15,8,6,11,0xc9ddd7,0x689b94,"HOSPITAL");
  // Extra skyline in the far blocks for scale.
  for(const [x,z,h,c] of [[-26,-17,13,0x8da7b4],[26,-17,15,0xb4a5c4],[-26,17,12,0xb3a18b],[26,17,16,0x8baea6],[-31,-28,10,0x9bb2bd],[31,-28,14,0xb4a5c4],[-31,28,13,0xb3a18b],[31,28,11,0x8baea6]])this.building(x,z,4.4,4.5,h,c,0x566f78,"");
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
  const tick=()=>{if(this.paused){this.pendingMoveTick=tick;return}if(!animations.length){onDone?.();return}const now=performance.now();for(let i=animations.length-1;i>=0;i--){const a=animations[i];const t=THREE.MathUtils.clamp((now-a.start)/a.duration,0,1),e=1-Math.pow(1-t,3);a.g.position.x=THREE.MathUtils.lerp(a.from.x,a.to.x,e);a.g.position.z=THREE.MathUtils.lerp(a.from.z,a.to.z,e);if(t>=1){this.vehicleGroup.remove(a.g);animations.splice(i,1)}}if(animations.length)requestAnimationFrame(tick);else onDone?.()};requestAnimationFrame(tick)
 }
 resize(){if(!this.renderer)return;const w=Math.max(1,this.host.clientWidth),h=Math.max(1,this.host.clientHeight);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h,false)}
 placeCamera(){if(!this.camera)return;this.camera.position.set(0,64,30);this.camera.lookAt(0,0,0)}
 animate(){if(this.disposed||this.paused||!this.renderer)return;this.frame=requestAnimationFrame(()=>this.animate());this.renderer.render(this.scene,this.camera)}
 pause(){this.paused=true;cancelAnimationFrame(this.frame)}
 resume(){if(this.disposed||!this.paused)return;this.paused=false;this.animate();if(this.pendingMoveTick){const tick=this.pendingMoveTick;this.pendingMoveTick=null;requestAnimationFrame(tick)}}
 dispose(){this.disposed=true;cancelAnimationFrame(this.frame);this.pendingMoveTick=null;this.resizeObserver?.disconnect();this.renderer?.dispose()}
}


const $=s=>document.querySelector(s);
const DIRS=["north","south","east","west"],TIMES={bike:5,car:10,truck:15};
const PROGRESS_KEY="mfa-traffic-control-progress-v1";
function readProgress(){
 try{
  const stored=JSON.parse(localStorage.getItem(PROGRESS_KEY)||"{}"),progress={};
  for(const key of Object.keys(LEVELS_BASE)){
   const value=stored?.[key];
   progress[key]=Array.isArray(value)
    ? [...new Set(value.map(Number).filter(n=>Number.isInteger(n)&&n>=1&&n<=50))].sort((a,b)=>a-b)
    : Array.from({length:Math.max(0,Math.min(50,Number(value)||0))},(_,i)=>i+1);
  }
  return progress;
 }catch{return{easy:[],medium:[],hard:[]}}
}
function saveProgress(data){try{localStorage.setItem(PROGRESS_KEY,JSON.stringify(data))}catch(error){console.warn("Could not save challenge progress:",error.message)}}
const cfg=()=>LEVELS[level],mission=()=>cfg().rounds[round],dirs=()=>cfg().directions;
let level="easy",round=0,queues={},busy=false,paused=false,runId=0,nsSeconds=30,cleared=0,score=0,cycles=0,optimalScore=0,missionStartedAt=Date.now(),reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
const city=new TrafficCity3D($("#city3d"),{reducedMotion:reduced});
function total(){return dirs().reduce((s,d)=>s+(queues[d]?.length||0),0)}
function budget(){return mission().budget}
function service(kind){return level==="hard"?TIMES[kind]:mission().serviceSeconds}
function capacity(d,seconds){let used=0,count=0;for(const v of queues[d]||[]){const t=service(v);if(used+t>seconds)break;used+=t;count++}return count}
function planAt(ns){const ew=budget()-ns,caps={};for(const d of dirs()){if(level==="easy")caps[d]=capacity(d,d==="north"?ns:ew);else caps[d]=(d==="north"||d==="south")?capacity(d,ns):capacity(d,ew)}let moved=0,points=0;for(const d of dirs()){const n=Math.min(queues[d].length,caps[d]);moved+=n;points+=n*mission().waitMinutes[d]*10}return{ns,ew,caps,moved,points}}
function bestPlan(){let best=null;for(let n=0;n<=budget();n+=cfg().step){const p=planAt(n);if(!best||p.points>best.points||(p.points===best.points&&p.moved>best.moved))best=p}return best}
function updateQueue(){for(const d of DIRS)$("#count-"+d).textContent=queues[d]?.length||0;$("#cleared-count").textContent=cleared;$("#total-score").textContent=score;$("#cycles-used").textContent=cycles}
function renderVehicles(){city.addVehicles(queues);updateQueue()}
function setSignal(d,on){city.setSignal(d,on)}
function updateMath(){
 const m=mission();
 for(const d of DIRS){const active=dirs().includes(d),chip=$(".approach-math ."+d+"-chip");if(chip)chip.hidden=!active;if(active){$("#math-"+d).textContent=queues[d].length+" "+(queues[d].length===1?"vehicle":"vehicles");$("#wait-"+d).textContent=m.waitMinutes[d]+" min"}}
 $("#vehicle-budget").innerHTML=budget()+' <small>seconds</small>';
 $("#reserve-note").textContent=level==="hard"?"Mixed fleet: bicycle 5s · car 10s · truck 15s":level==="easy"?"Northbound and southbound take separate green turns":"Split the cycle between the two roads";
 $("#planner-question").textContent=m.objective;$("#fleet-legend").hidden=level!=="hard";$("#schedule-inputs").hidden=false;
 const result=planAt(nsSeconds);
 $("#predicted-vehicles").textContent=result.moved+" / "+total();$("#predicted-score").textContent=result.points+" pts";
 {const ew=budget()-nsSeconds;$("#ns-seconds").max=budget();$("#ns-seconds").step=cfg().step;$("#ns-seconds").value=nsSeconds;$("#ns-output").textContent=nsSeconds+" sec";$("#ns-preview").textContent=nsSeconds+" sec";$("#ew-preview").textContent=ew+" sec";$("#ns-track").style.width=(nsSeconds/budget()*100)+"%";$("#ew-track").style.width=(ew/budget()*100)+"%";$("#slider-label").textContent=level==="easy"?"Green time for Northbound traffic":"Green time for North + South";$("#ns-side-label").textContent=level==="easy"?"Northbound":"North + South";$("#ew-side-label").textContent=level==="easy"?"Southbound":"East + West";}
 $("#math-hint").textContent=m.lesson;$("#run-plan").disabled=busy||paused||total()===0;$("#ns-seconds").disabled=paused||busy;
}
function setLevelUI(){
 document.getElementById("screen-traffic-control").classList.toggle("easy-level",level==="easy");
 document.getElementById("screen-traffic-control").classList.toggle("hard-level",level==="hard");
 city.setLevel(level);
 $("#city-heading").textContent=level==="easy"?"Central Avenue · Two-way road":level==="medium"?"Central Avenue · Four-way junction":"Metro City · Mixed-fleet intersection";
 $("#tc-level-title").textContent=cfg().label;
 $("#tc-level-heading-brand").textContent=cfg().label.split(" · ")[0]+" challenges";
}
function startRound(index=0){
 runId++;round=index;busy=false;cleared=0;score=0;cycles=0;optimalScore=0;missionStartedAt=Date.now();
 const m=mission();queues=Object.fromEntries(dirs().map(d=>[d,[...m.queues[d]]]));nsSeconds=Math.round(budget()/2/cfg().step)*cfg().step;
 const challengeCount=cfg().rounds.length;
 $("#mission-number").textContent=String(round+1).padStart(2,"0")+" / "+challengeCount;
 $("#mission-progress-fill").style.width=((round+1)/challengeCount*100)+"%";
 $("#mission-tag").textContent=cfg().label;
 $("#challenge-tag").textContent=level.toUpperCase()+" · "+String(round+1).padStart(2,"0")+" / "+challengeCount;
 $("#challenge-complete").hidden=true;$("#mission-title").textContent=m.title;$("#mission-description").textContent=m.description;$("#mission-objective").textContent=m.objective;$("#math-check").hidden=true;$("#next-mission").hidden=true;
 for(const d of DIRS)setSignal(d,false);
 $("#traffic-status").textContent="Study the queues, calculate your plan and run the signal.";
 renderVehicles();updateMath();
}
function setLevel(next,index=0){
 level=next;
 round=Math.max(0,Math.min(cfg().rounds.length-1,Number(index)||0));
 setLevelUI();
 startRound(round);
}
function renderLevelGrid(){
 const grid=$("#tc-level-grid"),completed=readProgress()[level]||[];
 if(!grid)return;
 grid.replaceChildren();
 cfg().rounds.forEach((challenge,index)=>{
  const number=index+1,isComplete=completed.includes(number),button=document.createElement("button");
  button.type="button";button.className="tc-level-tile"+(isComplete?" completed":"");
  button.setAttribute("aria-label","Level "+number+": "+challenge.title+(isComplete?", completed":""));
  button.title=challenge.title;
  const numberLabel=document.createElement("span");numberLabel.className="tc-level-number";numberLabel.textContent=String(number).padStart(2,"0");
  const title=document.createElement("span");title.className="tc-level-name";title.textContent=challenge.title.replace(/^Challenge \d+ · /,"");
  const status=document.createElement("span");status.className="tc-level-status";status.textContent=isComplete?"✓ Completed":"Play level";
  button.append(numberLabel,title,status);
  button.addEventListener("click",()=>chooseLevel(index));
  grid.append(button);
 });
 $("#tc-level-progress-count").textContent=completed.length+" / "+cfg().rounds.length;
}
function showDifficultyView(){
 pauseGame();
 $("#tc-difficulty-view").hidden=false;$("#tc-level-view").hidden=true;$("#tc-game-view").hidden=true;
}
function showLevelsView(next=level){
 pauseGame();
 level=next;setLevelUI();renderLevelGrid();
 $("#tc-difficulty-view").hidden=true;$("#tc-level-view").hidden=false;$("#tc-game-view").hidden=true;
}
function chooseLevel(index){
 resumeGame();
 $("#tc-difficulty-view").hidden=true;$("#tc-level-view").hidden=true;$("#tc-game-view").hidden=false;
 setLevel(level,index);
}
function runPlan(){
 if(busy||paused||!total())return;
 const id=++runId,p=planAt(nsSeconds),best=bestPlan(),moving=[];
 optimalScore+=best.points;cycles++;busy=true;$("#run-plan").disabled=true;
 for(const d of dirs()){
  const selected=queues[d].slice(0,p.caps[d]),starts=city.positionsForQueue(d,selected);
  for(let i=0;i<selected.length;i++){
   const kind=queues[d].shift(),start=starts[i];
   moving.push({d,kind,start});
  }
 }
 for(const d of DIRS)setSignal(d,false);
 renderVehicles();
 const ns=p.ns>0,ew=p.ew>0;
 if(dirs().includes("north"))setSignal("north",ns);if(dirs().includes("south"))setSignal("south",level==="easy"?ew:ns);if(dirs().includes("east"))setSignal("east",ew);if(dirs().includes("west"))setSignal("west",ew);
 cleared+=p.moved;score+=p.points;
 $("#traffic-status").textContent="Your signal plan is running. Watch the vehicles clear the junction.";
 const duration=reduced?350:1900+moving.length*130;
 city.moveVehicles(moving,()=>{
  if(id!==runId)return;
  busy=false;for(const d of DIRS)setSignal(d,false);updateQueue();updateMath();
  $("#math-hint").textContent=p.points===best.points?"Excellent! That split earned the best possible score for this cycle.":"Your plan earned "+p.points+" points. Best split: "+best.ns+"s North–South and "+best.ew+"s East–West ("+best.points+" points).";
  if(total()===0)finish();else $("#traffic-status").textContent=p.moved+" vehicles moved. "+total()+" remain. Recalculate for the next cycle.";
 },{stagger:reduced?0:100,duration});
}
function finish(){
 const m=mission(),lastChallenge=round===cfg().rounds.length-1;
 const progress=readProgress();
 if(!progress[level].includes(round+1))progress[level].push(round+1);
 progress[level].sort((a,b)=>a-b);
 saveProgress(progress);
 $("#challenge-complete").hidden=false;
 $("#challenge-complete-title").textContent=lastChallenge?"All 50 challenges completed!":"Challenge complete!";
 $("#challenge-complete-text").textContent=lastChallenge
  ?"You have completed every challenge in this level. Replay the level or choose another difficulty."
  :"Great work. Your next challenge is now unlocked.";
 $("#next-mission").hidden=false;
 $("#next-mission").textContent=lastChallenge?"Replay this level ↻":"Next challenge →";
 $("#math-check").hidden=false;$("#math-title").textContent="Junction cleared! Excellent engineering.";$("#math-question").textContent="You moved "+cleared+" vehicles in "+cycles+" cycles and earned "+score+" priority points.";$("#math-feedback").textContent=m.lesson;
 $("#traffic-status").textContent="All queues cleared. Level challenge complete.";
 window.CompletionOverlay?.show({
  title:lastChallenge?"Level completed!":"Junction cleared!",
  message:lastChallenge?"You completed all 50 challenges in this city level. Choose another level or replay this one.":"You cleared the traffic queues. Your next challenge is ready.",
  actionLabel:lastChallenge?"Replay level":"Next challenge",
  onContinue:()=>lastChallenge?startRound(0):startRound(round+1)
});
 const scorePercent=optimalScore>0?Math.max(0,Math.min(100,(score/optimalScore)*100)):0,durationSeconds=Math.max(1,Math.min(14400,Math.round((Date.now()-missionStartedAt)/1000))),accounts=window.MfaAccounts;
 if(accounts?.refreshSession&&accounts?.submitAttempt)accounts.refreshSession().then(()=>accounts.submitAttempt("traffic-control",scorePercent,durationSeconds,null,{difficulty:level,level:round+1})).catch(error=>console.warn("Could not save Traffic Control Centre score:",error.message));
 window.ResearchEventGateway?.record("traffic-control","mission_complete",{difficulty:level,level:round+1,completed:true,correct:true,seconds:durationSeconds});
}
$("#ns-seconds").addEventListener("input",e=>{nsSeconds=Number(e.target.value);updateMath()});
$("#run-plan").addEventListener("click",runPlan);$("#restart-mission").addEventListener("click",()=>startRound(round));$("#next-mission").addEventListener("click",()=>{
 if(round>=cfg().rounds.length-1)startRound(0);
 else startRound(round+1);
});
document.querySelectorAll("[data-difficulty]").forEach(b=>b.addEventListener("click",()=>showLevelsView(b.dataset.difficulty)));
$("#motion-toggle")?.addEventListener("click",()=>{reduced=!reduced;document.getElementById("screen-traffic-control").classList.toggle("reduce-motion",reduced)});
$("#text-size-toggle")?.addEventListener("click",()=>document.getElementById("screen-traffic-control").classList.toggle("large-type"));
if(reduced)document.getElementById("screen-traffic-control").classList.add("reduce-motion");
function pauseGame(){paused=true;city.pause();updateMath()}
function resumeGame(){paused=false;city.resume();updateMath()}
window.TrafficControlGame={
  pause:pauseGame,
  resume:resumeGame,
  next:()=>$("#next-mission")?.click(),
  setFontScale:value=>{
    const scale=Math.max(.8,Math.min(1.6,Number(value)||1));
    document.getElementById("screen-traffic-control").style.fontSize=(16*scale)+"px";
  }
};
const TrafficControlIntegration=(()=>{
  let previousFocus=null,activeDialog=null;
  const screen=()=>document.getElementById("screen-traffic-control");
  function closeDialog(restore=true){
    if(!activeDialog)return;
    const el=document.getElementById(activeDialog);if(el)el.hidden=true;
    activeDialog=null;screen()?.classList.remove("tc-dialog-open");
    if(restore&&previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
    previousFocus=null;
  }
  function showDialog(id){
    const el=document.getElementById(id);if(!el)return;
    closeDialog(false);previousFocus=document.activeElement;activeDialog=id;
    el.hidden=false;el.querySelector("button")?.focus({preventScroll:true});
    screen()?.classList.add("tc-dialog-open");
  }
  function open(){
    const scale=Number(getComputedStyle(document.documentElement).getPropertyValue("--font-scale"))||1;
    window.TrafficControlGame.setFontScale(scale);showDifficultyView();
  }
  function setFontScale(value){window.TrafficControlGame.setFontScale(value)}
  function pause(){pauseGame();showDialog("traffic-pause-overlay")}
  function resume(){closeDialog();resumeGame()}
  function help(){ControlsOverlay.forceShow("trafficControl")}
  function requestExit(){pauseGame();showDialog("traffic-exit-overlay")}
  function cancelExit(){closeDialog();resumeGame()}
  function confirmExit(){closeDialog(false);Game.goHome()}
  function pauseForNavigation(){pauseGame();closeDialog(false)}
  document.addEventListener("keydown",event=>{
    if(event.key!=="Escape"||!activeDialog)return;
    event.preventDefault();event.stopPropagation();
    if(activeDialog==="traffic-pause-overlay")resume();else cancelExit();
  },true);
  return{open,setFontScale,pause,resume,help,showDifficulty:showDifficultyView,showLevels:()=>showLevelsView(level),requestExit,cancelExit,confirmExit,pauseForNavigation};
})();
window.TrafficControlIntegration=TrafficControlIntegration;
setLevel("easy");
