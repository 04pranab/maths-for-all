/* 100 deterministic freeform geometry puzzles. */
const ShapeArchitectLevels=(()=>{const T=[
{name:'House',hint:'Arrange the shapes to make a house.',p:[['square',.5,.62,.3,.24,0],['triangle',.5,.37,.36,.28,0],['rectangle',.5,.79,.09,.22,0],['square',.39,.62,.07,.07,0],['square',.61,.62,.07,.07,0],['rectangle',.69,.31,.06,.15,0]]},
{name:'Tree',hint:'Build the tree from its trunk and canopy.',p:[['rectangle',.5,.73,.1,.27,0],['triangle',.5,.55,.42,.28,0],['triangle',.5,.37,.34,.26,0],['circle',.5,.2,.14,.14,0],['triangle',.35,.67,.16,.12,-.35],['triangle',.65,.67,.16,.12,.35]]},
{name:'Fish',hint:'Make the fish point the same way as the picture.',p:[['oval',.48,.5,.44,.25,0],['triangle',.77,.5,.25,.3,0],['circle',.39,.46,.055,.055,0],['triangle',.48,.63,.16,.12,.55],['triangle',.48,.37,.16,.12,-.55]]},
{name:'Boat',hint:'Arrange the hull, mast and sails.',p:[['trapezium',.5,.68,.55,.22,0],['rectangle',.5,.45,.035,.4,0],['triangle',.39,.42,.23,.31,0],['triangle',.61,.38,.22,.25,0],['circle',.78,.18,.1,.1,0]]},
{name:'Flower',hint:'Build the flower with petals, stem and leaves.',p:[['circle',.5,.28,.17,.17,0],['circle',.39,.28,.15,.15,0],['circle',.61,.28,.15,.15,0],['circle',.5,.18,.15,.15,0],['circle',.5,.39,.15,.15,0],['rectangle',.5,.68,.06,.43,0],['triangle',.39,.66,.18,.13,.35],['triangle',.61,.72,.18,.13,-.35]]},
{name:'Rocket',hint:'Make the rocket ready for launch.',p:[['rectangle',.5,.52,.22,.46,0],['triangle',.5,.23,.23,.25,0],['triangle',.35,.72,.17,.22,-.45],['triangle',.65,.72,.17,.22,.45],['circle',.5,.48,.09,.09,0],['rectangle',.5,.8,.13,.1,0]]},
{name:'Car',hint:'Build the car and line up its wheels.',p:[['rectangle',.5,.62,.56,.22,0],['trapezium',.5,.47,.35,.24,0],['circle',.34,.78,.13,.13,0],['circle',.66,.78,.13,.13,0],['rectangle',.5,.39,.2,.06,0],['square',.42,.48,.09,.08,0],['square',.58,.48,.09,.08,0]]},
{name:'Butterfly',hint:'Make both sides of the butterfly balance.',p:[['oval',.39,.43,.25,.3,-.45],['oval',.61,.43,.25,.3,.45],['oval',.38,.65,.19,.22,.35],['oval',.62,.65,.19,.22,-.35],['rectangle',.5,.55,.07,.36,0],['circle',.5,.34,.09,.09,0],['triangle',.46,.2,.11,.2,-.25],['triangle',.54,.2,.11,.2,.25]]},
{name:'Bird',hint:'Arrange the body, wing, beak and tail.',p:[['oval',.5,.54,.43,.28,0],['circle',.69,.44,.16,.16,0],['triangle',.82,.46,.17,.13,0],['triangle',.49,.51,.22,.2,-.25],['triangle',.29,.54,.2,.18,.65],['rectangle',.52,.74,.08,.22,0]]},
{name:'Kite',hint:'Build the kite and its tail.',p:[['diamond',.5,.42,.4,.47,0],['circle',.5,.42,.07,.07,0],['triangle',.5,.69,.13,.18,0],['triangle',.5,.82,.12,.16,0],['triangle',.5,.94,.1,.12,0],['rectangle',.5,.18,.05,.2,0]]},
{name:'Castle',hint:'Build the castle with towers and a gate.',p:[['rectangle',.5,.64,.36,.34,0],['rectangle',.27,.6,.14,.4,0],['rectangle',.73,.6,.14,.4,0],['triangle',.27,.34,.18,.22,0],['triangle',.73,.34,.18,.22,0],['triangle',.5,.41,.26,.2,0],['rectangle',.5,.77,.1,.22,0],['circle',.27,.57,.06,.06,0],['circle',.73,.57,.06,.06,0]]},
{name:'Robot',hint:'Arrange the robot from simple geometric parts.',p:[['square',.5,.38,.27,.24,0],['rectangle',.5,.64,.35,.28,0],['rectangle',.31,.64,.09,.28,0],['rectangle',.69,.64,.09,.28,0],['rectangle',.5,.88,.1,.24,0],['circle',.45,.36,.06,.06,0],['circle',.55,.36,.06,.06,0],['rectangle',.5,.2,.05,.15,0],['circle',.5,.13,.08,.08,0]]},
{name:'Sun',hint:'Build the sun and its rays.',p:[['circle',.5,.5,.28,.28,0],['triangle',.5,.15,.13,.22,0],['triangle',.5,.85,.13,.22,Math.PI],['triangle',.15,.5,.22,.13,-Math.PI/2],['triangle',.85,.5,.22,.13,Math.PI/2],['diamond',.25,.25,.15,.15,.78],['diamond',.75,.25,.15,.15,-.78],['diamond',.25,.75,.15,.15,-.78],['diamond',.75,.75,.15,.15,.78]]}
];
function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function make(index){
  const r=rng(0xA17C000+index*104729),b=T[index%T.length],v=Math.floor(index/T.length),s=.92+v*.015,ox=(r()-.5)*.03,oy=(r()-.5)*.03;
  const quarterTurn=Math.PI/4;
  const targetPieces=b.p.map((q,id)=>{
    const[shape,x,y,w,h,rotation]=q;
    const snappedRotation=Math.round(rotation/quarterTurn)*quarterTurn;
    return{id,required:true,shape,x:clamp(.5+(x-.5)*s+ox,.06,.94),y:clamp(.5+(y-.5)*s+oy,.07,.93),w,h,rotation:snappedRotation};
  });
  const tolerance={positionMin:.075,positionMax:.12,positionScale:.48,rotation:.34};
  const pieces=targetPieces.map(target=>{
    let x,y,rotation;
    do{
      x=.1+r()*.8;
      y=.1+r()*.8;
      rotation=target.rotation+(Math.floor(r()*7)+1)*quarterTurn;
    }while(Math.hypot(x-target.x,y-target.y)<=tolerance.position);
    return{...target,x,y,rotation};
  });
  return{number:index+1,name:b.name,hint:b.hint,canvas:{width:760,height:520},targetPieces,pieces,requiredCount:targetPieces.length,seed:(0xA17C000+index*104729)>>>0,tolerance,rotationStep:quarterTurn};
}
let cache=null;function getAll(){if(!cache)cache=Array.from({length:100},(_,i)=>make(i));return cache;}function get(i){return getAll()[Math.max(0,Math.min(99,i))];}function angleDiff(a,b){let d=Math.abs(a-b)%(Math.PI*2);return d>Math.PI?Math.PI*2-d:d;}function validate(l){const r=l?.targetPieces||[],step=l?.rotationStep||Math.PI/4;return r.length===l.requiredCount&&r.length>=4&&l.pieces.length===r.length&&r.every((p,i)=>ShapeArchitectLibrary.SHAPES[p.shape]&&p.w>0&&p.h>0&&p.x>0&&p.x<1&&p.y>0&&p.y<1&&Number.isFinite(p.rotation)&&l.pieces[i]?.required===true&&Math.abs((p.rotation/step)-Math.round(p.rotation/step))<1e-8);}return{getAll,get,validate,angleDiff,templates:T};})();