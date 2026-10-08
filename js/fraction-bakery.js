/* Fraction Bakery: 100-level randomized fraction challenges with realistic SVG dishes. */
const FractionBakery = (() => {
  const LEVELS = 100;
  const STAGES = [
    {name:"Slice & Serve", from:1, to:12, icon:"🍕"},
    {name:"Count the Order", from:13, to:24, icon:"🥧"},
    {name:"Bigger Bite", from:25, to:36, icon:"🍰"},
    {name:"Equal Recipe", from:37, to:48, icon:"🍫"},
    {name:"Mix the Batter", from:49, to:60, icon:"🥣"},
    {name:"Bake-off", from:61, to:72, icon:"🧁"},
    {name:"Chef's Counter", from:73, to:86, icon:"👨‍🍳"},
    {name:"Grand Bake", from:87, to:100, icon:"🏆"}
  ];
  const dishes=["pizza","pie","cake","tart","chocolate"];
  const state={level:1,challenge:null,solved:false,busy:false,timer:null,startedAt:0,selected:new Set(),completed:new Set(),hintUsed:false};
  const el=id=>document.getElementById(id);
  const gcd=(a,b)=>{while(b){[a,b]=[b,a%b]}return Math.abs(a)};
  const reduce=(n,d)=>{const g=gcd(n,d);return[n/g,d/g]};
  const frac=(n,d)=>{const[a,b]=reduce(n,d);return{n:a,d:b}};
  const raw=(n,d)=>({n,d});
  const same=(a,b)=>a.n*b.d===b.n*a.d;
  const value=f=>f.n/f.d;
  const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[rand(0,a.length-1)];
  const shuffle=a=>{const b=a.slice();for(let i=b.length-1;i>0;i--){const j=rand(0,i);[b[i],b[j]]=[b[j],b[i]]}return b};
  const fmt=f=>f.d===1?String(f.n):f.n+"/"+f.d;
  const stageFor=level=>STAGES.find(s=>level>=s.from&&level<=s.to)||STAGES[0];

  function difficulty(level){
    if(level<=12)return{min:5,max:8};
    if(level<=24)return{min:6,max:10};
    if(level<=36)return{min:7,max:12};
    if(level<=48)return{min:8,max:14};
    if(level<=60)return{min:9,max:16};
    if(level<=72)return{min:10,max:18};
    if(level<=86)return{min:10,max:20};
    return{min:11,max:24};
  }
  function proper(level){
    const q=difficulty(level),d=rand(q.min,q.max);
    return frac(rand(2,d-2),d);
  }
  function randomDish(){return pick(dishes)}
  function uniqueFractions(correct,count,level){
    const out=[correct],seen=new Set([fmt(correct)]);
    for(let tries=0;out.length<count&&tries<500;tries++){
      const f=proper(level);
      if(!seen.has(fmt(f))&&!same(f,correct)){seen.add(fmt(f));out.push(f)}
    }
    return shuffle(out);
  }
  function multiples(base,level){
    const maxK=Math.max(2,Math.min(5,Math.floor(difficulty(level).max/base.d)));
    const k=rand(2,maxK);
    return frac(base.n*k,base.d*k);
  }

  function dishSvg(type,d,selected=new Set(),size=360){
    const cx=size/2,cy=size/2,sel=i=>selected.has(i)?" is-selected":"";
    const aria=type+" divided into "+d+" equal portions";
    if(type==="chocolate"){
      const w=(size-44)/d,y=62,h=170;
      let pieces="";
      for(let i=0;i<d;i++){
        const x=22+i*w;
        pieces+=`<g class="fb-piece${sel(i)}" data-piece="${i}"><rect x="${x+2}" y="${y}" width="${w-4}" height="${h}" rx="12"/><path d="M ${x+10} ${y+30} H ${x+w-10} M ${x+10} ${y+86} H ${x+w-10} M ${x+10} ${y+142} H ${x+w-10}" opacity=".28"/><circle cx="${x+w*.38}" cy="${y+58}" r="6"/><circle cx="${x+w*.63}" cy="${y+112}" r="6"/></g>`;
      }
      return `<svg class="fb-dish fb-chocolate" viewBox="0 0 ${size} 260" role="img" aria-label="${aria}"><rect x="10" y="45" width="${size-20}" height="200" rx="30" fill="#e7d2b2"/><g fill="#65351f" stroke="#32170f" stroke-width="3">${pieces}</g><path d="M30 52 Q${size/2} 30 ${size-30} 52" fill="none" stroke="#9b603b" stroke-width="7"/></svg>`;
    }
    const r=Math.min(size*.34,132),palette=["#e8aa55","#d97855","#e9c15b","#9bbf86","#d48da2","#7ea6c9","#e79a62","#adc982","#c98fc3","#d4a571","#8bbab0","#df8e8e"];
    let body="";
    for(let i=0;i<d;i++){
      const a0=-Math.PI/2+i*2*Math.PI/d,a1=-Math.PI/2+(i+1)*2*Math.PI/d;
      body+=`<path class="fb-piece${sel(i)}" data-piece="${i}" d="M ${cx} ${cy} L ${cx+r*Math.cos(a0)} ${cy+r*Math.sin(a0)} A ${r} ${r} 0 0 1 ${cx+r*Math.cos(a1)} ${cy+r*Math.sin(a1)} Z" fill="${palette[i%palette.length]}"/>`;
    }
    let decoration="";
    if(type==="pizza"){
      decoration=`<circle cx="${cx}" cy="${cy}" r="${r+17}" fill="#d38b45" stroke="#8b512c" stroke-width="10"/><circle cx="${cx}" cy="${cy}" r="${r+5}" fill="#f4d56f" stroke="#f5c86f" stroke-width="5"/>`
    }else if(type==="pie"){
      decoration=`<circle cx="${cx}" cy="${cy}" r="${r+17}" fill="#d89b57" stroke="#895633" stroke-width="10"/><circle cx="${cx}" cy="${cy}" r="${r+5}" fill="none" stroke="#f3c37d" stroke-width="12"/>`;
      for(let i=-2;i<=2;i++)decoration+=`<path d="M ${cx-r*.72} ${cy+i*r*.23} Q ${cx} ${cy+i*r*.23+r*.14} ${cx+r*.72} ${cy+i*r*.23}" fill="none" stroke="#fff0cf" stroke-width="5"/>`;
    }else if(type==="cake"){
      decoration=`<ellipse cx="${cx}" cy="${cy+r+20}" rx="${r+22}" ry="18" fill="#d0a183"/><circle cx="${cx}" cy="${cy}" r="${r+15}" fill="#fff8ef" stroke="#95614e" stroke-width="8"/><circle cx="${cx}" cy="${cy}" r="${r-5}" fill="none" stroke="#e4a4b1" stroke-width="10"/>`;
    }else{
      decoration=`<circle cx="${cx}" cy="${cy}" r="${r+17}" fill="#f8e6c6" stroke="#986b4e" stroke-width="9"/><circle cx="${cx}" cy="${cy}" r="${r-8}" fill="none" stroke="#e7a16e" stroke-width="7"/>`;
      for(let i=0;i<8;i++){const a=i*Math.PI/4;decoration+=`<circle cx="${cx+Math.cos(a)*r*.7}" cy="${cy+Math.sin(a)*r*.7}" r="5" fill="#995a35"/>`}
    }
    const toppings=type==="pizza"?`<g class="fb-pizza-toppings" aria-hidden="true">${Array.from({length:Math.min(d*2+4,22)},(_,i)=>{const a=i*2.399,rr=r*(.25+((i%3)*.13));return `<g><circle cx="${cx+Math.cos(a)*rr}" cy="${cy+Math.sin(a)*rr}" r="9" fill="#c94332" stroke="#7e241b" stroke-width="3"/><circle cx="${cx+Math.cos(a)*rr-2}" cy="${cy+Math.sin(a)*rr-2}" r="2.2" fill="#f08b72"/></g>`}).join("")}</g>`:"";
    return `<svg class="fb-dish fb-${type}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${aria}">${decoration}${body}${toppings}</svg>`;
  }

  function newChallenge(level=state.level){
    const stage=stageFor(level),q=difficulty(level),mode=level%10;
    let c;
    if(stage.from===1){
      const d=rand(q.min,q.max),f=frac(rand(2,d-2),d);
      c={type:"build",dish:randomDish(),f};
    }else if(stage.from===13){
      const d=rand(q.min,q.max),f=raw(rand(2,d-2),d);
      c={type:"identify",dish:randomDish(),f,options:uniqueFractions(f,4,level)};
    }else if(stage.from===25){
      let a=proper(level),b=proper(level);
      while(same(a,b)||Math.abs(value(a)-value(b))<.08)b=proper(level);
      c={type:"compare",a,b,dishes:[randomDish(),randomDish()]};
    }else if(stage.from===37){
      const base=raw(rand(2,Math.min(8,q.max-3)),rand(5,q.max-2)),answer=multiples(base,level);
      c={type:"equivalent",target:base,answer,options:uniqueFractions(answer,4,level)};
    }else if(stage.from===49){
      const d=rand(q.min,q.max),a=rand(2,d-3),b=rand(2,d-a-1),op=mode%2?"-":"+";
      const result=op==="+"?a+b:a-b;
      if(result<=1||result>=d)return newChallenge(level);
      c={type:"mix",a:raw(a,d),b:raw(b,d),op,answer:raw(result,d),dish:randomDish()};
    }else if(stage.from===61){
      const d=rand(q.min,q.max),a=rand(2,d-3),b=rand(2,d-a-1),op=mode%2?"+":"-";
      const result=op==="+"?a+b:a-b;
      if(result<=1||result>=d)return newChallenge(level);
      c={type:"bake",a:raw(a,d),b:raw(b,d),op,answer:raw(result,d),dish:randomDish()};
    }else if(stage.from===73){
      if(mode%4===0){
        const f=proper(level),equiv=multiples(f,level);
        c={type:"simplify",target:equiv,answer:f,options:uniqueFractions(f,4,level)};
      }else if(mode%4===1){
        const a=proper(level),b=proper(level);
        const sorted=[a,b,proper(level)].sort((x,y)=>value(x)-value(y));
        c={type:"order",items:shuffle(sorted.slice()),answer:sorted.map(fmt).join("|")};
      }else if(mode%4===2){
        const d=rand(q.min,q.max),n=rand(2,d-2),missing=rand(1,n-1);
        c={type:"missing",f:frac(n,d),missing,answer:n,options:shuffle([n,Math.max(1,n-1),Math.min(d-1,n+1),Math.max(1,d-n)])};
      }else{
        const a=proper(level),b=proper(level);
        c={type:"difference",a,b,answer:frac(Math.abs(a.n*b.d-b.n*a.d),a.d*b.d)};
      }
    }else{
      const mode2=level%5;
      if(mode2===0){
        const whole=rand(1,2),d=rand(6,q.max),n=rand(2,d-1);
        c={type:"mixed",whole,n,d,answer:frac(whole*d+n,d)};
      }else if(mode2===1){
        const d=rand(6,q.max),a=rand(2,d-2),b=rand(2,d-a-1);
        c={type:"bake",a:raw(a,d),b:raw(b,d),op:"+",answer:raw(a+b,d),dish:randomDish()};
        if(c.answer.n>=c.answer.d*2)return newChallenge(level);
      }else if(mode2===2){
        const f=proper(level),answer=multiples(f,level);
        c={type:"equivalent",target:f,answer,options:uniqueFractions(answer,4,level)};
      }else if(mode2===3){
        let a=proper(level),b=proper(level);
        while(same(a,b))b=proper(level);
        c={type:"compare",a,b,dishes:[randomDish(),randomDish()]};
      }else{
        const d=rand(8,q.max),n=rand(3,d-3);
        c={type:"build",dish:randomDish(),f:raw(n,d)};
      }
    }
    state.challenge=c;state.solved=false;state.busy=false;state.selected.clear();state.hintUsed=false;startTimer();render();
  }

  function startTimer(){clearInterval(state.timer);state.startedAt=Date.now();state.timer=setInterval(()=>{const t=el("fb-timer");if(t)t.textContent=Math.floor((Date.now()-state.startedAt)/1000)+"s"},500)}
  function stopTimer(){clearInterval(state.timer);state.timer=null}
  function titleFor(c){return({build:"Count the order",identify:"Count the shaded pieces",compare:"Which dish has more?",equivalent:"Re-cut the recipe",mix:"Mix the batter",bake:"Finish the bake",simplify:"Simplify the recipe",order:"Line up the orders",missing:"Find the missing count",difference:"Measure the gap",mixed:"Build the mixed order"})[c.type]}
  function promptFor(c){
    if(c.type==="build")return `The order is ${fmt(c.f)}. Count ${c.f.d} equal pieces and select exactly ${c.f.n}.`;
    if(c.type==="identify")return "Count the shaded pieces and the total pieces. Which fraction describes the dish?";
    if(c.type==="compare")return `Count both dishes carefully. Which customer gets more: ${fmt(c.a)} or ${fmt(c.b)}?`;
    if(c.type==="equivalent")return `The same recipe is cut differently. Which fraction equals ${fmt(c.target)}?`;
    if(c.type==="mix"||c.type==="bake")return `Count the equal parts: ${fmt(c.a)} ${c.op} ${fmt(c.b)}. What is the result?`;
    if(c.type==="simplify")return `This tray says ${fmt(c.target)}. What is the same amount in simplest form?`;
    if(c.type==="order")return "Put the three fraction orders in increasing size. Count before you choose.";
    if(c.type==="missing")return `A tray has ${c.f.d} equal pieces. ${c.missing} pieces are already on the plate. How many more pieces make the shown count ${c.f.n}?`;
    if(c.type==="difference")return `Measure the exact difference between ${fmt(c.a)} and ${fmt(c.b)}.`;
    return `Build the whole order: ${c.whole} whole dish and ${c.n}/${c.d} of another. What improper fraction is that?`;
  }

  function dishParts(dish,f){return dishSvg(dish,f.d,new Set(Array.from({length:f.n},(_,i)=>i)))}
  function visualQuestion(c){
    if(c.type==="build")return `<span>🍽️</span><b>${fmt(c.f)}</b><span>→</span><b>count & select</b>`;
    if(c.type==="identify")return `<span>👀</span><b>?</b><span>← count shaded / total</span>`;
    if(c.type==="compare")return `<span>🍽️</span><b>${fmt(c.a)}</b><strong>VS</strong><b>${fmt(c.b)}</b><span>🍽️</span>`;
    if(c.type==="equivalent")return `<span>🍰</span><b>${fmt(c.target)}</b><strong>＝</strong><b>?</b>`;
    if(c.type==="mix"||c.type==="bake")return `<span>🥣</span><b>${fmt(c.a)}</b><strong>${c.op}</strong><b>${fmt(c.b)}</b><strong>＝</strong><b>?</b>`;
    if(c.type==="simplify")return `<span>🍰</span><b>${fmt(c.target)}</b><strong>→</strong><b>?</b>`;
    if(c.type==="order")return `<span>🥧</span><b>1</b><strong>→</strong><b>2</b><strong>→</strong><b>3</b>`;
    if(c.type==="missing")return `<span>🍕</span><b>${c.missing}</b><strong>＋ ? ＝</strong><b>${c.f.n}</b>`;
    if(c.type==="difference")return `<b>${fmt(c.a)}</b><strong>−</strong><b>${fmt(c.b)}</b><strong>＝</strong><b>?</b>`;
    return `<span>🍰</span><b>${c.whole}</b><strong>＋</strong><b>${c.n}/${c.d}</b><strong>＝</strong><b>?</b>`;
  }
  function hintFor(c){
    if(c.type==="build")return "Hint: the bottom number tells you the total equal pieces. Count them, then select the requested pieces.";
    if(c.type==="identify")return "Hint: count every equal piece first, then count only the shaded ones.";
    if(c.type==="compare")return "Hint: compare the part of the whole each dish represents. More pieces does not always mean more.";
    if(c.type==="equivalent")return "Hint: multiply the numerator and denominator by the same number.";
    if(c.type==="mix"||c.type==="bake")return "Hint: both trays use the same denominator, so count the numerator pieces together.";
    if(c.type==="simplify")return "Hint: divide the numerator and denominator by the same factor.";
    if(c.type==="order")return "Hint: compare the three fractions, then arrange smallest to largest.";
    if(c.type==="missing")return "Hint: subtract the pieces already counted from the target.";
    if(c.type==="difference")return "Hint: use a common denominator before subtracting.";
    return "Hint: convert the whole into equal pieces, then add the extra pieces.";
  }
  function showHint(){state.hintUsed=true;const f=el("fb-feedback");f.textContent=hintFor(state.challenge);f.className="fb-feedback fb-hint";}
  function sceneFor(c){
    if(c.type==="build")return `<div class="fb-dish-wrap">${dishSvg(c.dish,c.f.d,state.selected)}<div class="fb-count-readout">Tap the pieces you want, then serve.</div></div><button class="fb-action" id="fb-serve">🍽️ Serve order</button>`;
    if(c.type==="identify")return `<div class="fb-dish-wrap">${dishParts(c.dish,c.f)}<div class="fb-count-readout"><strong>${c.f.n}</strong> shaded · <strong>${c.f.d}</strong> total</div></div><div class="fb-options">${c.options.map(f=>`<button class="fb-option" data-answer="${fmt(f)}">${fmt(f)}</button>`).join("")}</div>`;
    if(c.type==="compare")return `<div class="fb-plates"><button class="fb-plate" data-compare="a">${dishParts(c.dishes[0],c.a)}<span>${fmt(c.a)}</span></button><div class="fb-vs">VS</div><button class="fb-plate" data-compare="b">${dishParts(c.dishes[1],c.b)}<span>${fmt(c.b)}</span></button></div>`;
    if(c.type==="equivalent")return `<div class="fb-equivalent-top"><div class="fb-count-card">${dishParts("pie",c.target)}<b>${fmt(c.target)}</b></div><div class="fb-equals">= ?</div><div class="fb-count-card">${dishParts("tart",c.answer)}<b>re-cut</b></div></div><div class="fb-options">${c.options.map(f=>`<button class="fb-option" data-answer="${fmt(f)}">${fmt(f)}</button>`).join("")}</div>`;
    if(c.type==="mix"||c.type==="bake")return `<div class="fb-mixing-board"><div class="fb-ingredient"><small>Tray A</small><strong>${fmt(c.a)}</strong></div><div class="fb-op">${c.op}</div><div class="fb-ingredient"><small>Tray B</small><strong>${fmt(c.b)}</strong></div><div class="fb-op">=</div><div class="fb-bowl">🥣</div></div><div class="fb-options">${uniqueFractions(c.answer,4,state.level).map(f=>`<button class="fb-option" data-answer="${fmt(f)}">${fmt(f)}</button>`).join("")}</div>`;
    if(c.type==="simplify")return `<div class="fb-dish-wrap">${dishParts(randomDish(),c.target)}<div class="fb-count-readout"><strong>${fmt(c.target)}</strong> on the tray</div></div><div class="fb-options">${c.options.map(f=>`<button class="fb-option" data-answer="${fmt(f)}">${fmt(f)}</button>`).join("")}</div>`;
    if(c.type==="order")return `<div class="fb-order-trays">${c.items.map((f,i)=>`<button class="fb-order-card" data-order="${i}">${dishParts(randomDish(),f)}<b>${fmt(f)}</b></button>`).join("")}</div><button class="fb-action" id="fb-order-check">🍽️ Check my order</button>`;
    if(c.type==="missing")return `<div class="fb-dish-wrap">${dishParts(randomDish(),c.f)}<div class="fb-count-readout">Target: <strong>${c.f.n}</strong> of ${c.f.d} · already counted: <strong>${c.missing}</strong></div></div><div class="fb-options">${c.options.map(n=>`<button class="fb-option" data-number="${n}">${n} more</button>`).join("")}</div>`;
    if(c.type==="difference")return `<div class="fb-plates"><div class="fb-plate static">${dishParts("pie",c.a)}<span>${fmt(c.a)}</span></div><div class="fb-vs">−</div><div class="fb-plate static">${dishParts("tart",c.b)}<span>${fmt(c.b)}</span></div></div><div class="fb-options">${uniqueFractions(c.answer,4,state.level).map(f=>`<button class="fb-option" data-answer="${fmt(f)}">${fmt(f)}</button>`).join("")}</div>`;
    return `<div class="fb-mixed-board"><div class="fb-count-card">${dishParts("cake",frac(c.n,c.d))}<b>${c.n}/${c.d}</b></div><div class="fb-plus">＋ ${c.whole}</div><div class="fb-count-card fb-whole-card"><b>${c.whole} whole</b><span>🍰</span></div></div><div class="fb-options"><button class="fb-option" data-answer="${fmt(c.answer)}">${fmt(c.answer)}</button>${uniqueFractions(c.answer,4,state.level).filter(f=>fmt(f)!==fmt(c.answer)).slice(0,3).map(f=>`<button class="fb-option" data-answer="${fmt(f)}">${fmt(f)}</button>`).join("")}</div>`;
  }

  function render(){
    const c=state.challenge,s=stageFor(state.level);
    el("fb-stage").textContent=s.icon+" "+s.name;
    el("fb-level").textContent="LEVEL "+String(state.level).padStart(2,"0")+" / "+LEVELS;
    el("fb-title").textContent=titleFor(c);el("fb-prompt").innerHTML=visualQuestion(c);
    el("fb-workbench").innerHTML=sceneFor(c);
    el("fb-feedback").textContent=state.solved?"Order complete. The counter is ready for the next recipe.":"Count the equal portions carefully, then make your move.";
    el("fb-feedback").className="fb-feedback "+(state.solved?"success":"");
    el("fb-next").disabled=!state.solved;el("fb-level-dot").textContent=state.level;
    el("fb-progress").style.setProperty("--fb-progress",((state.level-1)/(LEVELS-1)*100)+"%");
    renderLevels();
    bindScene(c);
  }
  function renderLevels(){
    const grid=el("fb-level-grid");if(!grid)return;
    grid.innerHTML=Array.from({length:LEVELS},(_,i)=>{const n=i+1,done=state.completed.has(n);return `<button class="fb-level-button ${n===state.level?"active":""} ${done?"complete":""}" data-level="${n}" aria-label="Level ${n}${done?" completed":""}">${n}</button>`}).join("");
    grid.querySelectorAll("[data-level]").forEach(b=>b.addEventListener("click",()=>{state.level=Number(b.dataset.level);newChallenge(state.level)}));
  }
  function bindScene(c){
    if(c.type==="build"){document.querySelectorAll(".fb-piece").forEach(p=>p.addEventListener("click",()=>{const i=Number(p.dataset.piece);if(state.selected.has(i))state.selected.delete(i);else state.selected.add(i);render()}));el("fb-serve")?.addEventListener("click",checkBuild)}
    else if(c.type==="compare")document.querySelectorAll("[data-compare]").forEach(b=>b.addEventListener("click",()=>checkCompare(b.dataset.compare)));
    else if(c.type==="order"){state.orderSelection=[];document.querySelectorAll("[data-order]").forEach(b=>b.addEventListener("click",()=>{b.classList.toggle("selected");state.orderSelection.push(Number(b.dataset.order));b.disabled=state.orderSelection.length===3;if(state.orderSelection.length===3)el("fb-order-check").disabled=false}));el("fb-order-check")?.addEventListener("click",checkOrder)}
    else if(c.type==="missing")document.querySelectorAll("[data-number]").forEach(b=>b.addEventListener("click",()=>checkNumber(Number(b.dataset.number))));
    else document.querySelectorAll("[data-answer]").forEach(b=>b.addEventListener("click",()=>checkAnswer(b.dataset.answer)));
  }
  function correct(){state.solved=true;state.completed.add(state.level);stopTimer();Analytics.log("fraction_bakery","level_complete",{level:state.level,challenge:state.challenge.type,timeMs:Date.now()-state.startedAt});render()}
  function wrong(message){const f=el("fb-feedback");f.textContent=message;f.className="fb-feedback gentle-wrong"}
  function checkBuild(){const c=state.challenge;if(state.selected.size===c.f.n)correct();else wrong(`Count again. The order needs ${c.f.n} pieces, but you selected ${state.selected.size}.`)}
  function checkCompare(side){const c=state.challenge,chosen=side==="a"?c.a:c.b,other=side==="a"?c.b:c.a;if(value(chosen)>value(other))correct();else wrong("That dish is smaller. Count the parts and compare the fraction, not just the piece count.")}
  function checkAnswer(answer){const c=state.challenge,expected=c.type==="identify"?c.f:c.answer;if(answer===fmt(expected))correct();else wrong("Not quite. Count the pieces again and check both numerator and denominator.")}
  function checkNumber(n){const c=state.challenge;if(n===c.f.n-c.missing)correct();else wrong("Count the gap from the pieces already on the plate to the target count.")}
  function checkOrder(){const c=state.challenge,chosen=state.orderSelection||[];if(chosen.length===3&&chosen.map(i=>fmt(c.items[i])).join("|")===c.answer.split("|").join("|"))correct();else wrong("Not quite. Compare the actual fraction sizes, then arrange smallest to largest.")}
  function next(){if(!state.solved||state.busy)return;state.busy=true;if(state.level<LEVELS)state.level++;else state.level=1;newChallenge(state.level)}
  function resetLevel(){newChallenge(state.level)}
  function open(){Game.goHome();const screen=el("screen-fraction-bakery");if(!screen)return;screen.hidden=false;document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));screen.classList.add("active");newChallenge(state.level);ControlsOverlay.maybeShow("fraction")}
  function close(){stopTimer();const screen=el("screen-fraction-bakery");if(screen)screen.hidden=true;Game.goHome()}
  function stop(){stopTimer()}
  function init(){newChallenge(state.level)}
  function handleKey(e){if(!el("screen-fraction-bakery")?.classList.contains("active"))return;if(e.key==="Escape")close();if(e.key==="Enter"&&state.solved)next()}
  document.addEventListener("keydown",handleKey);
  function testSetLevel(level){state.level=level;newChallenge(level)}
  return{open,close,init,stop,next,resetLevel,showHint,LEVELS,STAGES,__testSetLevel:testSetLevel,get __testChallenge(){return state.challenge}};
})();
window.FractionBakery=FractionBakery;
