/* Fraction Bakery
   Randomized, constructive fraction game. Every generated challenge is
   derived from valid integer partitions or exact rational arithmetic.
*/
const FractionBakery = (() => {
  const LEVELS = 72;
  const STAGES = [
    {name:"Slice & Serve", from:1, to:12, icon:"🍕"},
    {name:"Recipe Match", from:13, to:24, icon:"🥧"},
    {name:"Bigger Bite", from:25, to:36, icon:"🍰"},
    {name:"Equal Recipe", from:37, to:48, icon:"🍫"},
    {name:"Mix the Batter", from:49, to:60, icon:"🥣"},
    {name:"Bake-off", from:61, to:72, icon:"🧁"}
  ];
  const dishes = ["pie","pizza","cake","tart","chocolate"];
  const state = { level:1, challenge:null, solved:false, busy:false, timer:null, startedAt:0, selected:new Set() };

  const el = id => document.getElementById(id);
  const gcd=(a,b)=>{while(b){[a,b]=[b,a%b]}return Math.abs(a)};
  const reduce=(n,d)=>{const g=gcd(n,d);return [n/g,d/g]};
  const frac=(n,d)=>{const r=reduce(n,d);return {n:r[0],d:r[1]}};
  const value=f=>f.n/f.d;
  const same=(a,b)=>a.n*b.d===b.n*a.d;
  const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[rand(0,a.length-1)];
  const shuffle=a=>{const b=a.slice();for(let i=b.length-1;i>0;i--){const j=rand(0,i);[b[i],b[j]]=[b[j],b[i]]}return b};
  const fmt=f=>f.d===1?String(f.n):f.n+"/"+f.d;
  const pct=f=>Math.round(value(f)*100);

  function stageFor(level){return STAGES.find(s=>level>=s.from&&level<=s.to)||STAGES[0]}
  function difficulty(level){return level<=12?2:level<=24?4:level<=36?6:level<=48?8:level<=60?10:12}
  function validFraction(level, allowWhole=false){
    const d=rand(2,Math.min(12,difficulty(level)+1));
    const n=rand(allowWhole?1:1,d);
    return frac(n,d);
  }
  function randomDish(){return pick(dishes)}

  function svgDish(type,d,n,selected=new Set(),compare=false){
    const size=compare?250:360, cx=size/2, cy=size/2, r=compare?92:135;
    let body="";
    if(type==="chocolate"){
      const cols=d, gap=4, w=(size-50)/cols;
      for(let i=0;i<cols;i++){
        const x=25+i*w, active=selected.has(i);
        body+=`<g class="fb-piece ${active?"is-selected":""}" data-piece="${i}">
          <rect x="${x+gap/2}" y="82" width="${w-gap}" height="92" rx="10"/>
          <circle cx="${x+w/2}" cy="112" r="7"/><circle cx="${x+w/2}" cy="146" r="7"/>
        </g>`;
      }
      return `<svg class="fb-dish fb-chocolate" viewBox="0 0 ${size} 260" role="img" aria-label="Chocolate bar divided into ${d} equal pieces">${body}</svg>`;
    }
    const colors=["#f3b34c","#e56b6f","#8fc9a3","#7da7d9","#d49ad6","#f2d16b","#ee9f68","#83c8c8","#c59bdf","#a8c76c","#e99cba","#d9b26f"];
    for(let i=0;i<d;i++){
      const a0=-Math.PI/2+(i/d)*Math.PI*2, a1=-Math.PI/2+((i+1)/d)*Math.PI*2;
      const x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1);
      const large=d>1&&a1-a0>Math.PI?1:0;
      const path=`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
      body+=`<path class="fb-piece ${selected.has(i)?"is-selected":""}" data-piece="${i}" d="${path}" fill="${colors[i%colors.length]}"/>`;
    }
    const rim=type==="cake"?`<circle cx="${cx}" cy="${cy}" r="${r+12}" class="fb-rim"/>`:`<circle cx="${cx}" cy="${cy}" r="${r+10}" class="fb-rim"/>`;
    return `<svg class="fb-dish" viewBox="0 0 ${size} ${size}" role="img" aria-label="${type} divided into ${d} equal pieces">${rim}<circle cx="${cx}" cy="${cy}" r="${r+3}" class="fb-dish-shadow"/>${body}</svg>`;
  }

  function newChallenge(level=state.level){
    const stage=stageFor(level), diff=difficulty(level), dish=randomDish();
    let c;
    if(stage.from===1){
      const f=validFraction(level); c={type:"build",dish,f};
    } else if(stage.from===13){
      const a=validFraction(level), b=validFraction(level);
      c={type:"identify",dish,f:a,options:uniqueFractions(a,4,level)};
      if(Math.random()<0.45)c.dish=randomDish();
    } else if(stage.from===25){
      let a=validFraction(level),b=validFraction(level);
      while(same(a,b)) b=validFraction(level);
      c={type:"compare",a,b,dishes:[randomDish(),randomDish()]};
    } else if(stage.from===37){
      const base=validFraction(level);
      const k=rand(2,Math.max(2,Math.min(5,12/base.d)));
      const eq=frac(base.n*k,base.d*k);
      c={type:"equivalent",target:base,answer:eq,options:uniqueFractions(eq,4,level)};
    } else if(stage.from===49){
      const d=rand(2,Math.min(10,diff));
      const a=rand(1,d-1), b=rand(1,d-a);
      const op=Math.random()<0.5?"+":"-";
      const left=op==="+"?a:b, right=op==="+"?b:a;
      const result=op==="+"?a+b:a-b;
      if(result<=0||result>=d) return newChallenge(level);
      c={type:"mix",a:frac(left,d),b:frac(right,d),op,answer:frac(result,d),dish};
    } else {
      const d=rand(2,Math.min(12,diff)), a=rand(1,d-1), b=rand(1,d-a);
      const op=Math.random()<0.5?"+":"-";
      const result=op==="+"?a+b:a-b;
      if(result<=0||result>d) return newChallenge(level);
      c={type:"bake",a:frac(a,d),b:frac(b,d),op,answer:frac(result,d),dish:randomDish(),denom:d};
    }
    state.challenge=c; state.solved=false; state.busy=false; state.selected.clear(); startTimer(); render();
  }

  function uniqueFractions(correct,count,level){
    const out=[correct], seen=new Set([fmt(correct)]);
    let tries=0;
    while(out.length<count&&tries++<100){
      const f=validFraction(level);
      if(!seen.has(fmt(f))){seen.add(fmt(f));out.push(f)}
    }
    return shuffle(out);
  }

  function startTimer(){
    clearInterval(state.timer);
    state.startedAt=Date.now();
    state.timer=setInterval(()=>{const t=el("fb-timer");if(t)t.textContent=Math.floor((Date.now()-state.startedAt)/1000)+"s"},500);
  }

  function stopTimer(){clearInterval(state.timer);state.timer=null}

  function render(){
    const c=state.challenge,s=stageFor(state.level);
    el("fb-stage").textContent=s.icon+" "+s.name;
    el("fb-level").textContent="LEVEL "+String(state.level).padStart(2,"0")+" / "+LEVELS;
    el("fb-title").textContent=titleFor(c);
    el("fb-prompt").textContent=promptFor(c);
    el("fb-workbench").innerHTML=sceneFor(c);
    el("fb-feedback").textContent=state.solved?"Served! Nice fraction thinking.":"Choose, build, or mix the order.";
    el("fb-feedback").className="fb-feedback "+(state.solved?"success":"");
    el("fb-next").disabled=!state.solved;
    el("fb-level-dot").textContent=state.level;
    el("fb-progress").style.width=((state.level-1)/LEVELS*100)+"%";
    bindScene(c);
  }

  function titleFor(c){
    return ({build:"Build the order",identify:"Name the fraction",compare:"Which customer gets more?",equivalent:"Same recipe, new cut",mix:"Mix the batter",bake:"Final bake"})[c.type];
  }
  function promptFor(c){
    if(c.type==="build") return `Make ${fmt(c.f)} of the ${c.dish}. Tap exactly ${c.f.n} of the ${c.f.d} equal pieces, then serve.`;
    if(c.type==="identify") return "Look at the shaded dish. Which fraction describes it?";
    if(c.type==="compare") return `Which plate contains more: ${fmt(c.a)} or ${fmt(c.b)}?`;
    if(c.type==="equivalent") return `Find a recipe equal to ${fmt(c.target)}.`;
    if(c.type==="mix") return `Mix ${fmt(c.a)} ${c.op} ${fmt(c.b)}. What fraction is in the bowl?`;
    return `Bake ${fmt(c.a)} ${c.op} ${fmt(c.b)}. Choose the finished fraction.`;
  }

  function sceneFor(c){
    if(c.type==="build"){
      return `<div class="fb-dish-wrap">${svgDish(c.dish,c.f.d,c.f.n,state.selected)}<div class="fb-counter"><b>${state.selected.size}</b> / ${c.f.n} pieces</div></div><button class="fb-action" id="fb-serve">🍽️ Serve order</button>`;
    }
    if(c.type==="identify"){
      const shade=c.f.n; return `<div class="fb-dish-wrap">${svgDish(c.dish,c.f.d,new Set(Array.from({length:shade},(_,i)=>i)),new Set())}<div class="fb-recipe-label">The baker shaded ${shade} of ${c.f.d} equal pieces.</div></div><div class="fb-options">${c.options.map(f=>`<button class="fb-option" data-answer="${fmt(f)}">${fmt(f)}</button>`).join("")}</div>`;
    }
    if(c.type==="compare"){
      return `<div class="fb-plates"><button class="fb-plate" data-compare="a">${svgDish(c.dishes[0],c.a.d,c.a.n,new Set())}<span>${fmt(c.a)}</span></button><div class="fb-vs">VS</div><button class="fb-plate" data-compare="b">${svgDish(c.dishes[1],c.b.d,c.b.n,new Set())}<span>${fmt(c.b)}</span></button></div>`;
    }
    if(c.type==="equivalent"){
      return `<div class="fb-equivalent-top"><div class="fb-target-fraction">${fmt(c.target)}</div><div class="fb-equals">= ?</div></div><div class="fb-options">${c.options.map(f=>`<button class="fb-option" data-answer="${fmt(f)}">${fmt(f)}</button>`).join("")}</div>`;
    }
    const options=uniqueFractions(c.answer,4,state.level);
    return `<div class="fb-mixing-board"><div class="fb-ingredient">${fmt(c.a)}</div><div class="fb-op">${c.op}</div><div class="fb-ingredient">${fmt(c.b)}</div><div class="fb-op">=</div><div class="fb-bowl">🥣</div></div><div class="fb-options">${options.map(f=>`<button class="fb-option" data-answer="${fmt(f)}">${fmt(f)}</button>`).join("")}</div>`;
  }

  function bindScene(c){
    if(c.type==="build"){
      document.querySelectorAll(".fb-piece").forEach(p=>p.addEventListener("click",()=>{const i=Number(p.dataset.piece);if(state.selected.has(i))state.selected.delete(i);else state.selected.add(i);render()}));
      el("fb-serve")?.addEventListener("click",()=>checkBuild());
    } else if(c.type==="compare"){
      document.querySelectorAll("[data-compare]").forEach(b=>b.addEventListener("click",()=>checkCompare(b.dataset.compare)));
    } else {
      document.querySelectorAll("[data-answer]").forEach(b=>b.addEventListener("click",()=>checkAnswer(b.dataset.answer)));
    }
  }

  function correct(){
    state.solved=true; stopTimer();
    const timeMs=Date.now()-state.startedAt;
    Analytics.log("fraction_bakery","level_complete",{level:state.level,challenge:state.challenge.type,timeMs});
    render();
  }
  function wrong(message="Not quite. Look at the equal pieces and try again."){
    const f=el("fb-feedback"); f.textContent=message; f.className="fb-feedback gentle-wrong";
  }
  function checkBuild(){
    const c=state.challenge;
    if(state.selected.size===c.f.n){correct();return}
    wrong(`The order needs ${c.f.n} of the ${c.f.d} equal pieces. You chose ${state.selected.size}.`);
  }
  function checkCompare(side){
    const c=state.challenge, chosen=side==="a"?c.a:c.b, other=side==="a"?c.b:c.a;
    if(value(chosen)>value(other))correct();else wrong("That plate has less. Compare the size of each part, not just the top number.");
  }
  function checkAnswer(answer){
    const c=state.challenge, expected=c.type==="identify"?c.f:(c.type==="equivalent"?c.answer:c.answer);
    if(answer===fmt(expected))correct();else wrong("Close. Check how many equal parts make the whole, then try again.");
  }

  function next(){
    if(!state.solved||state.busy)return;
    state.busy=true;
    state.level=state.level>=LEVELS?1:state.level+1;
    newChallenge(state.level);
  }
  function resetLevel(){newChallenge(state.level)}
  function open(){Game.goHome();const screen=el("screen-fraction-bakery");if(!screen)return;screen.hidden=false;document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));screen.classList.add("active");newChallenge(state.level);ControlsOverlay.maybeShow("fraction");}
  function close(){stopTimer();const screen=el("screen-fraction-bakery");if(screen)screen.hidden=true;Game.goHome()}
  function stop(){stopTimer()}
  function init(){newChallenge(state.level)}
  function handleKey(e){
    if(!el("screen-fraction-bakery")?.classList.contains("active"))return;
    if(e.key==="Escape")close();
    if(e.key==="Enter"&&state.solved)next();
  }
  document.addEventListener("keydown",handleKey);

  return {open,close,init,stop,next,resetLevel,LEVELS,STAGES};
})();
window.FractionBakery=FractionBakery;
