import { LEVELS } from "./missions.js?v=20261112a";
import { TrafficCity3D } from "./city3d.js?v=20261111-fixed-north-up-zoom-slider-r2";
const $=s=>document.querySelector(s);
const DIRS=["north","south","east","west"],TIMES={bike:5,car:10,truck:15};
const cfg=()=>LEVELS[level],mission=()=>cfg().rounds[round],dirs=()=>cfg().directions;
let level="easy",round=0,queues={},busy=false,runId=0,nsSeconds=30,cleared=0,score=0,cycles=0,optimalScore=0,missionStartedAt=Date.now(),reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
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
 $("#math-hint").textContent=m.lesson;$("#run-plan").disabled=busy||total()===0;
}
function setLevelUI(){
 document.body.classList.toggle("easy-level",level==="easy");document.body.classList.toggle("hard-level",level==="hard");city.setLevel(level);
 document.querySelectorAll(".level-tab").forEach(b=>{const on=b.dataset.level===level;b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on))});
 $("#city-heading").textContent=level==="easy"?"Central Avenue · Two-way road":level==="medium"?"Central Avenue · Four-way junction":"Metro City · Mixed-fleet intersection";
}
function startRound(index=0){
 runId++;round=index;busy=false;cleared=0;score=0;cycles=0;optimalScore=0;missionStartedAt=Date.now();
 const m=mission();queues=Object.fromEntries(dirs().map(d=>[d,[...m.queues[d]]]));nsSeconds=Math.round(budget()/2/cfg().step)*cfg().step;
 $("#mission-number").textContent=String(round+1).padStart(2,"0")+" / 03";$("#mission-progress-fill").style.width=((round+1)/3*100)+"%";$("#mission-tag").textContent=cfg().label;$("#challenge-tag").textContent=level.toUpperCase();$("#mission-title").textContent=m.title;$("#mission-description").textContent=m.description;$("#mission-objective").textContent=m.objective;$("#math-check").hidden=true;$("#next-mission").hidden=true;
 for(const d of DIRS)setSignal(d,false);
 $("#traffic-status").textContent="Study the queues, calculate your plan and run the signal.";
 renderVehicles();updateMath();
}
function setLevel(next){level=next;round=0;setLevelUI();startRound(0)}
function runPlan(){
 if(busy||!total())return;
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
 const m=mission();$("#math-check").hidden=false;$("#math-title").textContent="Junction cleared! Excellent engineering.";$("#math-question").textContent="You moved "+cleared+" vehicles in "+cycles+" cycles and earned "+score+" priority points.";$("#math-feedback").textContent=m.lesson;$("#next-mission").hidden=false;$("#next-mission").textContent=round===2?"Replay this level ↻":"Next challenge →";$("#traffic-status").textContent="All queues cleared. Level challenge complete.";
 const scorePercent=optimalScore>0?Math.max(0,Math.min(100,(score/optimalScore)*100)):0,durationSeconds=Math.max(1,Math.min(14400,Math.round((Date.now()-missionStartedAt)/1000))),accounts=window.MfaAccounts;
 if(accounts?.refreshSession&&accounts?.submitAttempt)accounts.refreshSession().then(()=>accounts.submitAttempt("traffic-control",scorePercent,durationSeconds,null,{difficulty:level,level:round+1})).catch(error=>console.warn("Could not save Traffic Control Centre score:",error.message));
 window.ResearchEventGateway?.record("traffic-control","mission_complete",{difficulty:level,level:round+1,completed:true,correct:true,seconds:durationSeconds});
}
$("#ns-seconds").addEventListener("input",e=>{nsSeconds=Number(e.target.value);updateMath()});
$("#run-plan").addEventListener("click",runPlan);$("#restart-mission").addEventListener("click",()=>startRound(round));$("#next-mission").addEventListener("click",()=>startRound((round+1)%3));
document.querySelectorAll(".level-tab").forEach(b=>b.addEventListener("click",()=>setLevel(b.dataset.level)));
$("#motion-toggle")?.addEventListener("click",()=>{reduced=!reduced;document.body.classList.toggle("reduce-motion",reduced)});
$("#text-size-toggle")?.addEventListener("click",()=>document.body.classList.toggle("large-type"));
if(reduced)document.body.classList.add("reduce-motion");
setLevel("easy");
