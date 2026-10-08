/* Fraction Bakery: randomized constructive fraction challenges with SVG bakery dishes. */
const FractionBakery = (() => {
  const LEVELS = 72;
  const STAGES = [
    {name:"Slice & Serve", from:1, to:12, icon:"🍕"},
    {name:"Count the Order", from:13, to:24, icon:"🥧"},
    {name:"Bigger Bite", from:25, to:36, icon:"🍰"},
    {name:"Equal Recipe", from:37, to:48, icon:"🍫"},
    {name:"Mix the Batter", from:49, to:60, icon:"🥣"},
    {name:"Bake-off", from:61, to:72, icon:"🧁"}
  ];
  const dishes = ["pizza","pie","cake","tart","chocolate"];
  const state = {level:1,challenge:null,solved:false,busy:false,timer:null,startedAt:0,selected:new Set()};
  const el=id=>document.getElementById(id);
  const gcd=(a,b)=>{while(b){[a,b]=[b,a%b]}return Math.abs(a)};
  const reduce=(n,d)=>{const g=gcd(n,d);return [n/g,d/g]};
  const frac=(n,d)=>{const [a,b]=reduce(n,d);return {n:a,d:b}};
  const same=(a,b)=>a.n*b.d===b.n*a.d;
  const value=f=>f.n/f.d;
  const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[rand(0,a.length-1)];
  const shuffle=a=>{const b=a.slice();for(let i=b.length-1;i>0;i--){const j=rand(0,i);[b[i],b[j]]=[b[j],b[i]]}return b};
  const fmt=f=>f.d===1?String(f.n):f.n+"/"+f.d;
  const stageFor=level=>STAGES.find(s=>level>=s.from&&level<=s.to)||STAGES[0];

  function difficulty(level){return level<=12?8:level<=24?10:level<=36?12:level<=48?14:level<=60?16:18}
  function validFraction(level){
    const d=rand(Math.min(4,difficulty(level)),Math.min(12,difficulty(level)));
    return frac(rand(1,d-1),d);
  }
  function properWithDenom(d){return frac(rand(1,d-1),d)}
  function randomDish(){return pick(dishes)}

  function dishSvg(type,d,selected=new Set(),size=360){
    const cx=size/2, cy=size/2;
    const selectedClass=i=>selected.has(i)?" is-selected":"";
    const aria=type+" divided into "+d+" equal portions";
    if(type==="chocolate"){
      const w=(size-44)/d, y=72, h=150;
      let pieces="";
      for(let i=0;i<d;i++){
        const x=22+i*w;
        pieces+=`<g class="fb-piece${selectedClass(i)}" data-piece="${i}"><rect x="${x+2}" y="${y}" width="${w-4}" height="${h}" rx="12"/><rect x="${x+10}" y="${y+10}" width="${w-20}" height="9" rx="4"/><circle cx="${x+w*.38}" cy="${y+62}" r="7"/><circle cx="${x+w*.62}" cy="${y+106}" r="7"/></g>`;
      }
      return `<svg class="fb-dish fb-chocolate" viewBox="0 0 ${size} 260" role="img" aria-label="${aria}"><defs><linearGradient id="choc" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#7c4528"/><stop offset="1" stop-color="#432319"/></linearGradient></defs><rect x="10" y="58" width="${size-20}" height="178" rx="28" fill="#e9d6b8"/><g fill="url(#choc)" stroke="#32170f" stroke-width="3">${pieces}</g></svg>`;
    }

    const r=Math.min(size*.34,130), colors=["#e7a64f","#d96b50","#e9c15a","#8dbd82","#d38aa2","#7da6c9","#e59b62","#a7c57d","#c48dc5","#d2a46f","#86b9b0","#e18b8b"];
    let body="";
    for(let i=0;i<d;i++){
      const a0=-Math.PI/2+i*2*Math.PI/d, a1=-Math.PI/2+(i+1)*2*Math.PI/d;
      const x0=cx+r*Math.cos(a0), y0=cy+r*Math.sin(a0), x1=cx+r*Math.cos(a1), y1=cy+r*Math.sin(a1);
      body+=`<path class="fb-piece${selectedClass(i)}" data-piece="${i}" d="M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} Z" fill="${colors[i%colors.length]}"/>`;
    }

    let decoration="";
    if(type==="pizza"){
      decoration=`<circle cx="${cx}" cy="${cy}" r="${r+16}" fill="#d58a43" stroke="#8e5129" stroke-width="9"/><circle cx="${cx}" cy="${cy}" r="${r+5}" fill="none" stroke="#f4c36b" stroke-width="12"/>`;
      for(let i=0;i<Math.min(d*2,16);i++){const a=i*2.399, rr=r*.55; decoration+=`<circle cx="${cx+Math.cos(a)*rr}" cy="${cy+Math.sin(a)*rr}" r="5" fill="#9d4031"/>`}
    } else if(type==="pie"){
      decoration=`<circle cx="${cx}" cy="${cy}" r="${r+17}" fill="#d89b57" stroke="#8a5635" stroke-width="9"/><circle cx="${cx}" cy="${cy}" r="${r+5}" fill="none" stroke="#f1c27d" stroke-width="12"/>`;
      for(let i=0;i<5;i++){const y=cy-r*.55+i*r*.27; decoration+=`<path d="M ${cx-r*.72} ${y} Q ${cx} ${y+r*.18} ${cx+r*.72} ${y}" fill="none" stroke="#fff0cf" stroke-width="5" opacity=".9"/>`}
    } else if(type==="cake"){
      decoration=`<ellipse cx="${cx}" cy="${cy+r+20}" rx="${r+20}" ry="18" fill="#d4a98a" opacity=".7"/><circle cx="${cx}" cy="${cy}" r="${r+15}" fill="#fff8ef" stroke="#9c6952" stroke-width="8"/>`;
    } else {
      decoration=`<circle cx="${cx}" cy="${cy}" r="${r+16}" fill="#f8e7c9" stroke="#9d6d4e" stroke-width="9"/>`;
      for(let i=0;i<6;i++){const a=i*Math.PI/3;decoration+=`<circle cx="${cx+Math.cos(a)*r*.72}" cy="${cy+Math.sin(a)*r*.72}" r="5" fill="#9a5a35"/>`}
    }
    return `<svg class="fb-dish fb-${type}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${aria}">${decoration}${body}</svg>`;
  }

  function uniqueFractions(correct,count,level){
    const out=[correct],seen=new Set([fmt(correct)]);
    for(let tries=0;out.length<count&&tries<200;tries++){
      const f=validFraction(level);
      if(!seen.has(fmt(f))){seen.add(fmt(f));out.push(f)}
    }
    return shuffle(out);
  }

  function newChallenge(level=state.level){
    const stage=stageFor(level),d=Math.max(4,Math.min(12,difficulty(level)));
    let c;
    if(stage.from===1){
      const den=rand(Math.min(4,d),d), target=rand(2,den-1);
      c={type:"build",dish:randomDish(),f:frac(target,den)};
    } else if(stage.from===13){
      const den=rand(5,d), target=rand(2,den-2);
      const f=frac(target,den);
      c={type:"identify",dish:randomDish(),f,options:uniqueFractions(f,4,level)};
    } else if(stage.from===25){
      let a=validFraction(level),b=validFraction(level);
      while(same(a,b)) b=validFraction(level);
      c={type:"compare",a,b,dishes:[randomDish(),randomDish()]};
    } else if(stage.from===37){
      const base=frac(rand(2,Math.min(8,d-2)),rand(5,d-2));
      const k=rand(2,Math.min(4,Math.floor(12/base.d)||2));
      c={type:"equivalent",target:base,answer:frac(base.n*k,base.d*k),options:uniqueFractions(frac(base.n*k,base.d*k),4,level)};
    } else if(stage.from===49){
      const den=rand(6,d),a=rand(2,den-2),b=rand(1,den-a-1),op=Math.random()<.5?"+":"-";
      const left=op==="+"?a:b,right=op==="+"?b:a,result=op==="+"?a+b:a-b;
      if(result<=0||result>=den)return newChallenge(level);
      c={type:"mix",a:frac(left,den),b:frac(right,den),op,answer:frac(result,den),dish:randomDish()};
    } else {
      const den=rand(7,d),a=rand(2,den-2),b=rand(1,den-a-1),op=Math.random()<.5?"+":"-";
      const result=op==="+"?a+b:a-b;
      if(result<=0||result>=den)return newChallenge(level);
      c={type:"bake",a:frac(op==="+"?a:b,den),b:frac(op==="+"?b:a,den),op,answer:frac(result,den),dish:randomDish(),denom:den};
    }
    state.challenge=c;state.solved=false;state.busy=false;state.selected.clear();startTimer();render();
  }

  function startTimer(){clearInterval(state.timer);state.startedAt=Date.now();state.timer=setInterval(()=>{const t=el("fb-timer");if(t)t.textContent=Math.floor((Date.now()-state.startedAt)/1000)+"s"},500)}
  function stopTimer(){clearInterval(state.timer);state.timer=null}

  function titleFor(c){return({build:"Count the slices",identify:"Count the shaded pieces",compare:"Which plate has more?",equivalent:"Re-cut the same recipe",mix:"Mix the batter",bake:"Finish the bake"})[c.type]}
  function promptFor(c){
    if(c.type==="build")return `The customer wants ${c.f.n}/${c.f.d}. Count out exactly ${c.f.n} of the ${c.f.d} equal pieces.`;
    if(c.type==="identify")return "Count the shaded pieces first. Then choose the fraction that describes the whole dish.";
    if(c.type==="compare")return `Count and compare the portions: ${fmt(c.a)} or ${fmt(c.b)}. Which customer gets more?`;
    if(c.type==="equivalent")return `The baker cuts ${fmt(c.target)} another way. Which fraction is the same amount?`;
    if(c.type==="mix")return `Mix ${fmt(c.a)} ${c.op} ${fmt(c.b)}. Count the equal parts to find the amount in the bowl.`;
    return `The final tray combines ${fmt(c.a)} ${c.op} ${fmt(c.b)}. Count the equal portions and choose the result.`;
  }

  function sceneFor(c){
    if(c.type==="build")return `<div class="fb-dish-wrap">${dishSvg(c.dish,c.f.d,state.selected)}<div class="fb-count-readout"><strong>${state.selected.size}</strong> / ${c.f.n} portions selected</div></div><button class="fb-action" id="fb-serve">🍽️ Serve order</button>`;
    if(c.type==="identify"){
      const chosen=new Set(Array.from({length:c.f.n},(_,i)=>i));
      return `<div class="fb-dish-wrap">${dishSvg(c.dish,c.f.d,chosen)}<div class="fb-count-readout"><strong>${c.f.n}</strong> shaded portions · <strong>${c.f.d}</strong> total portions</div></div><div class="fb-options">${c.options.map(f=>`<button class="fb-option" data-answer="${fmt(f)}">${fmt(f)}</button>`).join("")}</div>`;
    }
    if(c.type==="compare")return `<div class="fb-plates"><button class="fb-plate" data-compare="a">${dishSvg(c.dishes[0],c.a.d, new Set(Array.from({length:c.a.n},(_,i)=>i)),250)}<span>${fmt(c.a)} · ${c.a.n} of ${c.a.d}</span></button><div class="fb-vs">VS</div><button class="fb-plate" data-compare="b">${dishSvg(c.dishes[1],c.b.d, new Set(Array.from({length:c.b.n},(_,i)=>i)),250)}<span>${fmt(c.b)} · ${c.b.n} of ${c.b.d}</span></button></div>`;
    if(c.type==="equivalent")return `<div class="fb-equivalent-top"><div class="fb-count-card">${dishSvg("pie",c.target.d,new Set(Array.from({length:c.target.n},(_,i)=>i)),230)}<b>${fmt(c.target)}</b></div><div class="fb-equals">= ?</div><div class="fb-count-card">${dishSvg("tart",c.answer.d,new Set(Array.from({length:c.answer.n},(_,i)=>i)),230)}<b>count the matching amount</b></div></div><div class="fb-options">${c.options.map(f=>`<button class="fb-option" data-answer="${fmt(f)}">${fmt(f)}</button>`).join("")}</div>`;
    const options=uniqueFractions(c.answer,4,state.level);
    return `<div class="fb-mixing-board"><div class="fb-ingredient"><small>Tray A</small><strong>${fmt(c.a)}</strong></div><div class="fb-op">${c.op}</div><div class="fb-ingredient"><small>Tray B</small><strong>${fmt(c.b)}</strong></div><div class="fb-op">=</div><div class="fb-bowl">🥣</div></div><div class="fb-options">${options.map(f=>`<button class="fb-option" data-answer="${fmt(f)}">${fmt(f)}</button>`).join("")}</div>`;
  }

  function render(){
    const c=state.challenge,s=stageFor(state.level);
    el("fb-stage").textContent=s.icon+" "+s.name;
    el("fb-level").textContent="LEVEL "+String(state.level).padStart(2,"0")+" / "+LEVELS;
    el("fb-title").textContent=titleFor(c);el("fb-prompt").textContent=promptFor(c);
    el("fb-workbench").innerHTML=sceneFor(c);
    el("fb-feedback").textContent=state.solved?"Order complete. You counted like a baker.":"Count the equal portions carefully, then make your move.";
    el("fb-feedback").className="fb-feedback "+(state.solved?"success":"");
    el("fb-next").disabled=!state.solved;el("fb-level-dot").textContent=state.level;
    el("fb-progress").style.setProperty("--fb-progress",((state.level-1)/LEVELS*100)+"%");
    bindScene(c);
  }

  function bindScene(c){
    if(c.type==="build"){
      document.querySelectorAll(".fb-piece").forEach(p=>p.addEventListener("click",()=>{const i=Number(p.dataset.piece);if(state.selected.has(i))state.selected.delete(i);else state.selected.add(i);render()}));
      el("fb-serve")?.addEventListener("click",checkBuild);
    } else if(c.type==="compare"){
      document.querySelectorAll("[data-compare]").forEach(b=>b.addEventListener("click",()=>checkCompare(b.dataset.compare)));
    } else {
      document.querySelectorAll("[data-answer]").forEach(b=>b.addEventListener("click",()=>checkAnswer(b.dataset.answer)));
    }
  }

  function correct(){state.solved=true;stopTimer();Analytics.log("fraction_bakery","level_complete",{level:state.level,challenge:state.challenge.type,timeMs:Date.now()-state.startedAt});render()}
  function wrong(message){const f=el("fb-feedback");f.textContent=message;f.className="fb-feedback gentle-wrong"}
  function checkBuild(){const c=state.challenge;if(state.selected.size===c.f.n)correct();else wrong(`Count again. The order needs ${c.f.n} pieces, but you selected ${state.selected.size}.`)}
  function checkCompare(side){const c=state.challenge,chosen=side==="a"?c.a:c.b,other=side==="a"?c.b:c.a;if(value(chosen)>value(other))correct();else wrong("That plate is smaller. Count the parts and compare their size.")}
  function checkAnswer(answer){const c=state.challenge,expected=c.type==="identify"?c.f:c.answer;if(answer===fmt(expected))correct();else wrong("Not quite. Count the equal portions again and check numerator and denominator.")}

  function next(){if(!state.solved||state.busy)return;state.busy=true;state.level=state.level>=LEVELS?1:state.level+1;newChallenge(state.level)}
  function resetLevel(){newChallenge(state.level)}
  function open(){Game.goHome();const screen=el("screen-fraction-bakery");if(!screen)return;screen.hidden=false;document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));screen.classList.add("active");newChallenge(state.level);ControlsOverlay.maybeShow("fraction")}
  function close(){stopTimer();const screen=el("screen-fraction-bakery");if(screen)screen.hidden=true;Game.goHome()}
  function stop(){stopTimer()}
  function init(){newChallenge(state.level)}
  function handleKey(e){if(!el("screen-fraction-bakery")?.classList.contains("active"))return;if(e.key==="Escape")close();if(e.key==="Enter"&&state.solved)next()}
  document.addEventListener("keydown",handleKey);
  function testSetLevel(level){state.level=level;newChallenge(level)}
  return {open,close,init,stop,next,resetLevel,LEVELS,STAGES,__testSetLevel:testSetLevel,get __testChallenge(){return state.challenge}};
})();
window.FractionBakery=FractionBakery;
