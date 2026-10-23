/* Math Court — a data-driven, accessible seven-stage courtroom game. */
(function (root) {
  "use strict";
  const STORE_KEY = "mfa_math_court_v1";
  const $ = id => document.getElementById(id);
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));
  const data = () => root.MathCourtData;
  const PHASE_LABELS = data().phases;
  const VERDICT_CHOICES = [
    {id:"supported",label:"Supported",note:"The evidence supports the claim as stated."},
    {id:"disproved",label:"Disproved",note:"The evidence contradicts the claim as stated."},
    {id:"partly",label:"Partly supported",note:"Part of the claim is right, but it goes too far."},
    {id:"uncertain",label:"Not enough evidence",note:"The records do not justify a firm conclusion."}
  ];
  const state = {
    caseId:1, phase:0, seenClaim:false, seenEvidence:false,
    investigationSolved:false, challengeSolved:false, crossSolved:false, verdictChosen:null,
    visualMode:"model", visualFocus:0, lab:null, completed:new Set(), session:null, feedback:"", feedbackKind:""
  };
  function normalVerdict(value) { return value === "insufficient" ? "uncertain" : value; }
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      if (Array.isArray(saved.completed)) state.completed = new Set(saved.completed.filter(id => Number.isInteger(id) && id >= 1 && id <= 100));
      if (saved.session && data().getCase(saved.session.caseId) && !state.completed.has(saved.session.caseId)) {
        state.session = saved.session;
      }
    } catch { /* Ignore damaged local progress and start safely. */ }
  }
  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        completed:[...state.completed].sort((a,b)=>a-b),
        session:state.session
      }));
    } catch { /* Private browsing or full storage must not block a case. */ }
  }
  function syncSession() {
    state.session = {
      caseId:state.caseId, phase:state.phase, seenClaim:state.seenClaim,
      seenEvidence:state.seenEvidence, investigationSolved:state.investigationSolved,
      challengeSolved:state.challengeSolved, crossSolved:state.crossSolved, verdictChosen:state.verdictChosen,
      visualMode:state.visualMode, visualFocus:state.visualFocus, lab:state.lab
    };
    persist();
  }
  function setFeedback(message, kind="info") {
    state.feedback=message; state.feedbackKind=kind;
    const node=$("mc-feedback");
    if(node){node.textContent=message;node.className="mc-feedback is-visible mc-feedback-"+kind;}
  }
  function open() {
    if (!data().isValid()) {
      console.error("Math Court case data did not pass validation.");
      return;
    }
    if (root.Game && typeof root.Game.goHome === "function") root.Game.goHome();
    document.querySelectorAll(".screen").forEach(el=>el.classList.remove("active"));
    const screen=$("screen-math-court");
    if(screen) screen.classList.add("active");
    window.scrollTo(0,0);
    load();
    renderDocket();
    if (state.session) {
      const resume=$("mc-resume");
      if(resume) resume.hidden=false;
    }
  }
  function goDocket() {
    syncSession();
    renderDocket();
    window.scrollTo(0,0);
  }
  function renderDocket() {
    const docket=$("mc-docket"), play=$("mc-play");
    if(!docket||!play)return;
    docket.hidden=false; play.hidden=true;
    const completed=state.completed.size;
    const next=data().cases.find(item=>!state.completed.has(item.id));
    const resume=state.session && data().getCase(state.session.caseId);
    const focusCase=resume||next;
    const activeChapterId=focusCase?focusCase.chapter:data().chapters[data().chapters.length-1].id;
    const progressLabel=completed===100?"All 100 cases explored":completed+" of 100 cases completed";
    docket.innerHTML =
      '<section class="mc-docket-hero" aria-labelledby="mc-docket-title">' +
        '<div class="mc-docket-intro">' +
          '<div class="mc-eyebrow">COMMON GROUND COURT</div>' +
          '<h2 id="mc-docket-title">Choose your next case</h2>' +
          '<p>Each case starts with a clue. Follow the story, test the maths, and see where the evidence leads.</p>' +
          '<div class="mc-hero-actions">' +
            (resume?'<button class="mc-button mc-button-primary" type="button" id="mc-resume" onclick="MathCourt.resume()">Continue Case '+String(resume.id).padStart(3,"0")+' →</button>':next?'<button class="mc-button mc-button-primary" type="button" onclick="MathCourt.openCase('+next.id+')">Start Case '+String(next.id).padStart(3,"0")+' →</button>':'<button class="mc-button mc-button-primary" type="button" onclick="MathCourt.openCase(1)">Play a case again ↻</button>') +
            '<button class="mc-button mc-button-quiet" type="button" onclick="MathCourt.resetProgress()">Reset progress</button>' +
          '</div>' +
        '</div>' +
        '<div class="mc-docket-progress">' +
          '<div class="mc-docket-progress-top"><strong>'+completed+'<span> / 100</span></strong><span>CASE PROGRESS</span></div>' +
          '<div class="mc-progress-track" role="progressbar" aria-label="Cases completed" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+completed+'"><span style="width:'+completed+'%"></span></div>' +
          '<div class="mc-progress-caption"><strong>'+progressLabel+'</strong><span>Seven stages per case</span></div>' +
        '</div>' +
      '</section>' +
      '<div class="mc-case-map-heading"><div><h3>Case map</h3><p>Choose a chapter, then pick any case inside it.</p></div><span class="mc-case-map-total">10 chapters · 100 cases</span></div>' +
      '<div class="mc-chapter-list">'+data().chapters.map(ch=>{
        const entries=data().cases.filter(item=>item.chapter===ch.id);
        const done=entries.filter(item=>state.completed.has(item.id)).length;
        const isCurrent=ch.id===activeChapterId;
        const chapterStatus=done===entries.length?"Complete":isCurrent?(resume?"In progress":"Up next"):"Explore";
        return '<details class="mc-chapter '+(isCurrent?"is-current":"")+'" data-chapter-id="'+ch.id+'" '+(isCurrent?"open":"")+'>' +
          '<summary>' +
            '<span class="mc-chapter-number">'+String(ch.id).padStart(2,"0")+'</span>' +
            '<span class="mc-chapter-copy"><strong>'+esc(ch.name)+'</strong><small>'+esc(ch.theme)+'</small></span>' +
            '<span class="mc-chapter-meta"><strong>'+done+'/10</strong><span class="mc-chapter-mini-track"><i style="width:'+(done*10)+'%"></i></span></span>' +
            '<span class="mc-chapter-state '+(done===entries.length?"is-complete":isCurrent?"is-current":"")+'">'+chapterStatus+'</span>' +
          '</summary>' +
          '<div class="mc-case-grid">'+entries.map(item=>{
            const isDone=state.completed.has(item.id);
            const isResume=Boolean(resume&&resume.id===item.id);
            const isNext=Boolean(!resume&&next&&next.id===item.id);
            const status=isDone?"Completed ✓":isResume?"Continue case →":isNext?"Start here →":"Choose case →";
            const cardClass="mc-case-card"+(isDone?" is-complete":"")+(isResume?" is-resume":"")+(isNext?" is-next":"");
            return '<button type="button" class="'+cardClass+'" data-case-id="'+item.id+'" aria-label="Case '+String(item.id).padStart(3,"0")+': '+esc(item.title)+'. '+status+'" onclick="MathCourt.openCase('+item.id+')">' +
              '<span class="mc-case-top"><span class="mc-case-number">CASE '+String(item.id).padStart(3,"0")+'</span><span class="mc-case-mark" aria-hidden="true">'+(isDone?"✓":isResume?"↻":isNext?"◆":"·")+'</span></span>' +
              '<strong>'+esc(item.title)+'</strong>' +
              '<small>'+(isDone?"Completed":isResume?"Continue case →":isNext?"Start here →":"Choose case →")+'</small>' +
            '</button>';
          }).join("")+'</div></details>';
      }).join("")+'</div>';
  }
  function openCase(id) {
    const item=data().getCase(id);
    if(!item)return;
    const saved=state.session&&state.session.caseId===item.id&&!state.completed.has(item.id)?state.session:null;
    state.caseId=item.id;
    state.phase=saved?saved.phase:0;
    state.seenClaim=saved?saved.seenClaim:false;
    state.seenEvidence=saved?saved.seenEvidence:false;
    state.investigationSolved=saved?saved.investigationSolved:false;
    state.challengeSolved=saved?Boolean(saved.challengeSolved):false;
    state.crossSolved=saved?saved.crossSolved:false;
    state.visualMode=saved&&["model","compare","trace"].includes(saved.visualMode)?saved.visualMode:"model";
    state.visualFocus=saved&&Number.isInteger(saved.visualFocus)?Math.max(0,Math.min(4,saved.visualFocus)):0;
    state.verdictChosen=saved?saved.verdictChosen:null;
    state.lab=saved&&saved.lab?normaliseLab(saved.lab,item):freshLab(item);
    state.feedback="";state.feedbackKind="";
    syncSession();
    const docket=$("mc-docket"),play=$("mc-play");
    if(docket)docket.hidden=true;if(play)play.hidden=false;
    renderCase();
    scrollCaseIntoView();
  }
  function resume() {
    if(state.session)openCase(state.session.caseId);
    else openCase(data().cases.find(item=>!state.completed.has(item.id))?.id||1);
  }
  function back() { goDocket(); }
  function advance() {
    const item=data().getCase(state.caseId);
    if(state.phase===2&&!(state.investigationSolved&&state.challengeSolved)){setFeedback("Solve both linked mathematical tasks before admitting the exhibits. You can retry without losing progress.","hint");return;}
    if(state.phase===4&&!state.crossSolved){setFeedback("Choose the strongest line of cross-examination first.","hint");return;}
    if(state.phase===5&&!state.verdictChosen){setFeedback("Select a verdict and support it with what you have learned.","hint");return;}
    if(state.phase===5&&normalVerdict(state.verdictChosen)!==normalVerdict(item.verdict)){
      setFeedback("Reconsider the claim and the exhibits. You may revise your verdict.","hint");return;
    }
    if(state.phase<6){state.phase++;if(state.phase===1){state.seenClaim=true;state.seenEvidence=true;}state.feedback="";state.feedbackKind="";syncSession();renderCase();scrollCaseIntoView();return;}
    if(!state.completed.has(item.id))state.completed.add(item.id);
    state.session=null;persist();
    if(item.id<100){openCase(item.id+1);}else{goDocket();}
  }
  function chooseEvidence(which) {
    if(which==="claim")state.seenClaim=true;
    if(which==="evidence")state.seenEvidence=true;
    syncSession();renderCase();
  }
  function rotatedChoices(choices,correct,id) {
    const shift=id%choices.length;
    const sorted=choices.slice(shift).concat(choices.slice(0,shift));
    return {choices:sorted,correct:(correct-shift+choices.length)%choices.length};
  }
  function expectedNumericChoice(choice) {
    const text=String(choice==null?"":choice).replace(/,/g,"").trim();
    if(/[=+×÷*\/]/.test(text)||/\d\s*(?:to|through|[-–—])\s*\d/i.test(text)||/\b(?:between|range|not enough|unknown|cannot be determined)\b/i.test(text))return null;
    const numbers=[...text.matchAll(/-?\d+(?:\.\d+)?/g)];
    return numbers.length===1?Number(numbers[0][0]):null;
  }
  function submitPatternPrediction() {
    const input=$("mc-pattern-prediction");
    if(!input||input.value.trim()===""){setFeedback("Type the next number you predict, then place it in the garden.","hint");return;}
    const next=Number(input.value);
    if(!Number.isFinite(next)){setFeedback("Enter a number to test your pattern idea.","hint");return;}
    if(state.lab.patternPrediction!==next){state.lab.patternPrediction=next;markLabPlay();}
    state.lab.note="Prediction placed on the path.";
    refreshCaseKeepingScroll();
  }
  function selectDataRecord(index) {
    const item=data().getCase(state.caseId),task=state.investigationSolved?2:1;
    if(!Number.isInteger(index)||index<0||index>=dataGoal(item,task).values.length)return;
    if(state.lab.dataSelection===index)return;
    state.lab.dataSelection=index;markLabPlay();refreshCaseKeepingScroll();
  }
  function updateWorkshopCheckAfterPlay() {
    const check=document.querySelector(".mc-workshop-check");if(!check)return;
    check.classList.remove("is-solved");
    const icon=check.querySelector(".mc-workshop-check-icon");if(icon)icon.textContent="✦";
    const button=check.querySelector("button");if(button)button.textContent="Check my model";
    check.querySelector(".mc-workshop-complete")?.remove();
    state.lab.goalSolved=false;state.feedback="";state.feedbackKind="";
    const feedback=$("mc-feedback");if(feedback){feedback.textContent="";feedback.className="mc-feedback";}
  }
  function checkPlayGoal() {
    const item=data().getCase(state.caseId),task=state.investigationSolved?2:1;
    if(!state.lab)return;
    const baseline=task===2?state.lab.challengeBaseline:0;
    if(state.lab.playCount<=baseline){
      state.lab.goalSolved=false;
      setFeedback(task===1?"Try the maths playground first. Build, change or explore the model, then check it.":"Make a fresh move for the second challenge before checking the new model.","hint");
      refreshCaseKeepingScroll();return;
    }
    if(playGoalMet(item,task)){
      state.lab.goalSolved=true;
      setFeedback("✨ Workshop goal complete! Your model matches the challenge. Now use that finding in the case.","success");
    }else{
      state.lab.goalSolved=false;
      setFeedback(playGoal(item,task).hint,"hint");
    }
    refreshCaseKeepingScroll();
  }

  function answerInvestigation(index) {
    const item=data().getCase(state.caseId);
    if(!state.lab||!state.lab.goalSolved||!playGoalMet(item,1)){
      setFeedback(state.lab&&state.lab.playCount>0?playGoal(item,1).hint:"Try the hands-on maths challenge first, then check your model before choosing the court's answer.","hint");
      syncSession();renderCase();return;
    }
    if(index===item.answer){
      state.investigationSolved=true;
      state.lab.challengeBaseline=state.lab.playCount;
      state.lab.goalSolved=false;
      setFeedback("✨ Aha! Your model fits the workshop goal. Exhibit verified. "+item.explanation,"success");
    }else{
      setFeedback("You have the model ready. Compare its evidence with the story and try another conclusion.","hint");
    }
    syncSession();renderCase();
  }
  function answerChallenge(index) {
    const item=data().getCase(state.caseId),challenge=item.challenge;
    if(!state.lab||state.lab.playCount<=state.lab.challengeBaseline||!state.lab.goalSolved||!playGoalMet(item,2)){
      setFeedback(state.lab&&state.lab.playCount>state.lab.challengeBaseline?playGoal(item,2).hint:"Complete a fresh hands-on challenge for the second exhibit before choosing its result.","hint");
      syncSession();renderCase();return;
    }
    if(index===challenge.answer){
      state.challengeSolved=true;
      setFeedback("✨ Second workshop goal complete! Exhibit verified. "+challenge.explanation,"success");
    }else{
      setFeedback("Your model is ready. Compare the new clue with the result and try another conclusion.","hint");
    }
    syncSession();renderCase();
  }
  function answerCross(index) {
    const item=data().getCase(state.caseId),check=data().checks[item.check];
    const rotated=rotatedChoices(check.choices,check.correct,item.id);
    if(index===rotated.correct){state.crossSolved=true;setFeedback("✨ Excellent question. You used curiosity and respect to help everyone learn.","success");}
    else{setFeedback("Try a question that reveals a detail, tests an assumption or compares the evidence.","hint");}
    syncSession();renderCase();
  }
  function selectVerdict(id) {
    const item=data().getCase(state.caseId);
    if(normalVerdict(id)===normalVerdict(item.verdict)){
      state.verdictChosen=id;
      setFeedback("🌟 A thoughtful conclusion. You matched the idea to the evidence.","success");
    }else{
      state.verdictChosen=null;
      setFeedback("Let’s compare the idea with both exhibits and choose the conclusion that best matches what we learned.","hint");
    }
    syncSession();renderCase();
  }
  function hintFor(item) {
    const hints={
      calculation:"Write the known values first, then check with the inverse operation.",
      records:"Compare dates, original entries and whether a person or item was counted twice.",
      assumptions:"Ask what condition must be true for the claim to hold.",
      definition:"Restate the mathematical term in your own words.",
      comparison:"Use the same unit, denominator, time span or group size for both sides.",
      units:"Convert to compatible units before comparing.",
      constraints:"Check each condition and the overall limit.",
      representation:"Read the axis, labels and scale before trusting the visual size.",
      sample:"Ask who was included, who was left out and how many observations were made.",
      causation:"A relationship alone does not show which event caused the other.",
      logic:"Check if the conclusion follows from every premise; test an alternative."
    };
    return hints[item.check]||"Return to the source exhibit and check what the claim really says.";
  }

  function visualNumbers(item) {
    const textSource=[item.evidence,item.story,item.prompt,item.challenge&&item.challenge.prompt].join(" ");
    const matches=[...textSource.matchAll(/-?\d[\d,]*(?:\.\d+)?/g)];
    const values=[];
    for(const match of matches){
      const number=Number(match[0].replace(/,/g,""));
      if(Number.isFinite(number)&&Math.abs(number)<=100000&&!values.includes(number))values.push(number);
      if(values.length===5)break;
    }
    return values.length?values:[3,5,8,13];
  }
  function visualHeading(item) {
    const headings={
      1:"Number blocks & quantities",2:"Number patterns & properties",3:"Fractions & fair shares",
      4:"Shapes, space & measurement",5:"Time, distance & units",6:"Data you can see",
      7:"Rules, equations & logic",8:"Fair shares & decisions",9:"Routes & constraints",
      10:"The town-planning evidence board"
    };
    return headings[item.chapter]||"Explore the evidence";
  }
  function svgBars(values,focus,labels) {
    const max=Math.max(1,...values.map(v=>Math.abs(v)));
    return '<svg viewBox="0 0 720 250" role="img" aria-label="Interactive evidence bars" data-visual-mode="compare">'+
      '<line x1="160" y1="32" x2="160" y2="210" stroke="#c9c0d3" stroke-width="2"/>'+
      values.map((v,i)=>{
        const y=38+i*39,w=Math.max(4,Math.abs(v)/max*445);
        return '<g class="mc-svg-pick '+(focus===i?'is-focused':'')+'" role="button" tabindex="0" aria-label="Focus '+esc(labels[i])+'" onclick="MathCourt.focusVisual('+i+')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();MathCourt.focusVisual('+i+')}">'+
          '<text x="12" y="'+(y+17)+'" class="mc-svg-label">'+esc(labels[i])+'</text>'+
          '<rect x="160" y="'+y+'" width="'+w+'" height="24" rx="7" class="mc-svg-bar '+(focus===i?'is-focused':'')+'"/>'+
          '<text x="'+Math.min(665,174+w)+'" y="'+(y+17)+'" class="mc-svg-number">'+esc(String(v))+'</text></g>';
      }).join("")+
      '<text x="160" y="235" class="mc-svg-note">Each bar uses the recorded value as its scale.</text></svg>';
  }
  function renderModelSvg(item,values,focus) {
    const v=values.slice(0,4),max=Math.max(1,...v.map(n=>Math.abs(n)));
    const title=item.title.toLowerCase();
    if(item.chapter<=2){
      const cards=v.map((n,i)=>'<g class="mc-svg-pick '+(focus===i?'is-focused':'')+'" role="button" tabindex="0" onclick="MathCourt.focusVisual('+i+')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();MathCourt.focusVisual('+i+')}" aria-label="Inspect value '+esc(String(n))+'"><rect x="'+(22+i*172)+'" y="35" width="150" height="104" rx="16" class="mc-svg-card '+(focus===i?'is-focused':'')+'"/><text x="'+(97+i*172)+'" y="63" text-anchor="middle" class="mc-svg-note">RECORD '+(i+1)+'</text><text x="'+(97+i*172)+'" y="105" text-anchor="middle" class="mc-svg-big">'+esc(String(n))+'</text><rect x="'+(34+i*172)+'" y="151" width="'+(126*Math.abs(n)/max)+'" height="12" rx="6" class="mc-svg-bar '+(focus===i?'is-focused':'')+'"/></g>').join("");
      return '<svg viewBox="0 0 720 205" role="img" aria-label="Number blocks showing quantities from the case" data-visual-mode="model">'+cards+'<text x="22" y="192" class="mc-svg-note">Select a number block. The matching value is highlighted below.</text></svg>';
    }
    if(item.chapter===3){
      const fractions=[...([item.evidence,item.story,item.prompt].join(" ").matchAll(/(\d+)\s*\/\s*(\d+)/g))].slice(0,2).map(m=>({n:Number(m[1]),d:Number(m[2])}));
      if(fractions.length){
        return '<svg viewBox="0 0 720 205" role="img" aria-label="Fraction strips split into equal parts" data-visual-mode="model">'+fractions.map((f,i)=>{
          const y=34+i*76,segments=Math.min(20,Math.max(1,f.d)),width=520/segments,filled=Math.min(f.n,segments);
          return '<text x="20" y="'+(y+23)+'" class="mc-svg-label">SHARE '+(i+1)+' · '+f.n+'/'+f.d+'</text>'+
            Array.from({length:segments},(_,j)=>'<rect x="'+(185+j*width)+'" y="'+y+'" width="'+(width-3)+'" height="40" rx="3" class="mc-svg-segment '+(j<filled?'is-filled':'')+' '+(focus===i?'is-focused':'')+'"/>').join("")+
            '<text x="715" y="'+(y+58)+'" text-anchor="end" class="mc-svg-note">'+f.n+' of '+f.d+' equal parts</text>';
        }).join("")+'</svg>';
      }
      return svgBars(v,focus,v.map((_,i)=>"Share "+(i+1))).replace('data-visual-mode="compare"','data-visual-mode="model"');
    }
    if(item.chapter===4){
      if(/wheel|round|circle|circumference/.test(title)){
        return '<svg viewBox="0 0 720 220" role="img" aria-label="Circle with diameter and circumference" data-visual-mode="model"><circle cx="260" cy="110" r="76" fill="#e6f2ec" stroke="#267b70" stroke-width="4"/><line x1="184" y1="110" x2="336" y2="110" stroke="#694c83" stroke-width="3" stroke-dasharray="6 5"/><text x="260" y="99" text-anchor="middle" class="mc-svg-big">'+esc(String(v[0]||7))+'</text><text x="390" y="80" class="mc-svg-label">ACROSS THE STAGE</text><text x="390" y="113" class="mc-svg-big">diameter</text><text x="390" y="152" class="mc-svg-note">Around the edge = circumference</text></svg>';
      }
      if(/turn|direction|compass|sign|coordinate|map/.test(title)){
        return '<svg viewBox="0 0 720 220" role="img" aria-label="Compass and ordered coordinate grid" data-visual-mode="model"><g transform="translate(150 108)"><circle r="76" fill="#f4eef8" stroke="#b8a6c8" stroke-width="2"/><path d="M0 -62 L18 0 L0 15 L-18 0 Z" fill="#694c83"/><path d="M0 62 L-12 5 L0 16 L12 5 Z" fill="#c9bfd3"/><text x="0" y="-91" text-anchor="middle" class="mc-svg-label">N</text><text x="91" y="5" class="mc-svg-label">E</text><text x="0" y="101" text-anchor="middle" class="mc-svg-label">S</text><text x="-103" y="5" text-anchor="middle" class="mc-svg-label">W</text></g><g transform="translate(375 24)">'+Array.from({length:7},(_,i)=>'<line x1="'+(i*40)+'" y1="0" x2="'+(i*40)+'" y2="170" stroke="#ddd7e4"/><line x1="0" y1="'+(i*28)+'" x2="240" y2="'+(i*28)+'" stroke="#ddd7e4"/>').join("")+'<circle cx="'+(Math.min(5,Math.abs(v[0]||3)%6)*40)+'" cy="'+(Math.min(5,Math.abs(v[1]||2)%6)*28)+'" r="8" fill="#267b70"/><text x="0" y="194" class="mc-svg-note">Ordered positions: (x, y)</text></g></svg>';
      }
      if(/ramp|shadow|tower|slope/.test(title)){
        return '<svg viewBox="0 0 720 220" role="img" aria-label="Rise and run triangle" data-visual-mode="model"><path d="M95 180 L95 54 L470 180 Z" fill="#f3eef8" stroke="#694c83" stroke-width="4"/><path d="M95 180 L470 180" stroke="#267b70" stroke-width="5"/><text x="55" y="110" class="mc-svg-label" transform="rotate(-90 55 110)">RISE</text><text x="260" y="210" text-anchor="middle" class="mc-svg-label">RUN</text><text x="520" y="90" class="mc-svg-big">'+esc(String(v[0]||2))+' : '+esc(String(v[1]||5))+'</text><text x="520" y="124" class="mc-svg-note">rise : run</text></svg>';
      }
      return '<svg viewBox="0 0 720 220" role="img" aria-label="Rectangle grid to explore area and perimeter" data-visual-mode="model"><g transform="translate(35 24)">'+Array.from({length:8},(_,i)=>Array.from({length:12},(_,j)=>'<rect x="'+(j*25)+'" y="'+(i*20)+'" width="23" height="18" rx="2" fill="'+((i+j)%2===0?'#e7f2ec':'#f3eef8')+'" stroke="#c8bcd4" stroke-width=".8"/>').join("")).join("")+'</g><path d="M35 209 L335 209 M35 205 L35 213 M335 205 L335 213" stroke="#694c83" stroke-width="2"/><text x="390" y="76" class="mc-svg-label">MEASUREMENTS IN RECORD</text><text x="390" y="110" class="mc-svg-big">'+esc(String(v[0]||3))+' × '+esc(String(v[1]||8))+'</text><text x="390" y="145" class="mc-svg-note">Inside squares show area.</text><text x="390" y="170" class="mc-svg-note">Outside edges show perimeter.</text></svg>';
    }
    if(item.chapter===5){
      const maxT=Math.max(1,...v.map(n=>Math.abs(n)));
      return '<svg viewBox="0 0 720 205" role="img" aria-label="Timeline or measuring scale" data-visual-mode="model"><line x1="40" y1="105" x2="680" y2="105" stroke="#694c83" stroke-width="4" stroke-linecap="round"/>'+v.map((n,i)=>{
        const x=55+(Math.abs(n)/maxT)*590;
        return '<g class="mc-svg-pick '+(focus===i?'is-focused':'')+'" role="button" tabindex="0" onclick="MathCourt.focusVisual('+i+')" aria-label="Inspect marker '+esc(String(n))+'"><line x1="'+x+'" y1="84" x2="'+x+'" y2="128" stroke="#267b70" stroke-width="4"/><circle cx="'+x+'" cy="105" r="'+(focus===i?12:8)+'" fill="'+(focus===i?'#694c83':'#267b70')+'"/><text x="'+x+'" y="64" text-anchor="middle" class="mc-svg-number">'+esc(String(n))+'</text><text x="'+x+'" y="151" text-anchor="middle" class="mc-svg-note">'+(i===0?'START':i===v.length-1?'END':'MARK '+(i+1))+'</text></g>';
      }).join("")+'<text x="40" y="190" class="mc-svg-note">Compare gaps between marks, not only their positions.</text></svg>';
    }
    if(item.chapter===6) return svgBars(v,focus,v.map((_,i)=>"Record "+(i+1))).replace('data-visual-mode="compare"','data-visual-mode="model"');
    if(item.chapter===7){
      return '<svg viewBox="0 0 720 220" role="img" aria-label="Rule machine and equation model" data-visual-mode="model"><rect x="25" y="60" width="155" height="92" rx="17" class="mc-svg-card"/><text x="102" y="88" text-anchor="middle" class="mc-svg-note">INPUT</text><text x="102" y="127" text-anchor="middle" class="mc-svg-big">'+esc(String(v[0]||3))+'</text><path d="M186 106 L251 106 M239 95 L251 106 L239 117" fill="none" stroke="#694c83" stroke-width="4"/><rect x="260" y="45" width="195" height="122" rx="18" fill="#f3eef8" stroke="#c9bad8" stroke-width="2"/><text x="357" y="80" text-anchor="middle" class="mc-svg-note">TEST THE RULE</text><text x="357" y="119" text-anchor="middle" class="mc-svg-big">f(x)</text><text x="357" y="143" text-anchor="middle" class="mc-svg-note">same input → same output</text><path d="M461 106 L523 106 M511 95 L523 106 L511 117" fill="none" stroke="#267b70" stroke-width="4"/><rect x="532" y="60" width="160" height="92" rx="17" class="mc-svg-card '+(focus===1?'is-focused':'')+'"/><text x="612" y="88" text-anchor="middle" class="mc-svg-note">OUTPUT</text><text x="612" y="127" text-anchor="middle" class="mc-svg-big">'+esc(String(v[1]||7))+'</text><text x="25" y="195" class="mc-svg-note">Change one condition at a time; test whether the rule still fits.</text></svg>';
    }
    if(item.chapter===8){
      return '<svg viewBox="0 0 720 225" role="img" aria-label="Allocation bars for comparing fair shares" data-visual-mode="model">'+v.slice(0,3).map((n,i)=>{
        const x=34+i*230,w=Math.max(5,Math.abs(n)/max*174);
        return '<g class="mc-svg-pick '+(focus===i?'is-focused':'')+'" role="button" tabindex="0" onclick="MathCourt.focusVisual('+i+')" aria-label="Inspect share '+(i+1)+'"><text x="'+x+'" y="32" class="mc-svg-label">GROUP '+String.fromCharCode(65+i)+'</text><rect x="'+x+'" y="52" width="184" height="108" rx="12" fill="#f4f0f8" stroke="#d5c9e0"/><rect x="'+(x+5)+'" y="'+(155-w*.48)+'" width="174" height="'+(w*.48)+'" rx="7" class="mc-svg-bar '+(focus===i?'is-focused':'')+'"/><text x="'+(x+92)+'" y="190" text-anchor="middle" class="mc-svg-big">'+esc(String(n))+'</text><text x="'+(x+92)+'" y="213" text-anchor="middle" class="mc-svg-note">Compare the rule</text></g>';
      }).join("")+'</svg>';
    }
    if(item.chapter===9){
      return '<svg viewBox="0 0 720 225" role="img" aria-label="Route network with weighted paths" data-visual-mode="model"><path d="M105 62 L338 43 L598 83 L511 178 L250 183 Z M105 62 L250 183 M338 43 L511 178" fill="none" stroke="#b8a8c8" stroke-width="5" stroke-linejoin="round"/>'+[[105,62],[338,43],[598,83],[511,178],[250,183]].map((p,i)=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="18" fill="'+(focus===i?'#694c83':'#d9eee5')+'" stroke="'+(focus===i?'#4e3565':'#267b70')+'" stroke-width="3"/><text x="'+p[0]+'" y="'+(p[1]+5)+'" text-anchor="middle" class="mc-svg-label">'+String.fromCharCode(65+i)+'</text>').join("")+'<text x="360" y="216" text-anchor="middle" class="mc-svg-note">Compare the total route cost, not just the number of edges.</text></svg>';
    }
    return '<svg viewBox="0 0 720 225" role="img" aria-label="Connected planning board showing resources, rules and outcomes" data-visual-mode="model">'+["RESOURCE","RULE","OUTCOME"].map((label,i)=>'<g class="mc-svg-pick '+(focus===i?'is-focused':'')+'" role="button" tabindex="0" onclick="MathCourt.focusVisual('+i+')" aria-label="Inspect '+label+'"><rect x="'+(20+i*240)+'" y="37" width="205" height="124" rx="18" class="mc-svg-card '+(focus===i?'is-focused':'')+'"/><text x="'+(122+i*240)+'" y="67" text-anchor="middle" class="mc-svg-note">'+label+'</text><text x="'+(122+i*240)+'" y="115" text-anchor="middle" class="mc-svg-big">'+esc(String(v[i]===undefined?"?":v[i]))+'</text></g>'+(i<2?'<path d="M230 96 L252 96 M244 88 L252 96 L244 104" stroke="#694c83" stroke-width="4" fill="none"/>':"")).join("")+'<text x="360" y="199" text-anchor="middle" class="mc-svg-note">A sound plan must satisfy every constraint.</text></svg>';
  }
  function renderVisualBoard(item) {
    const values=visualNumbers(item),focus=Math.min(state.visualFocus,values.length-1);
    const labels=values.map((_,i)=>"Value "+(i+1)),mode=state.visualMode;
    const svg=mode==="compare"?svgBars(values,focus,labels):mode==="trace"?
      '<svg viewBox="0 0 720 205" role="img" aria-label="Trace how the evidence becomes a conclusion" data-visual-mode="trace">'+["SOURCE","MATHEMATICAL MODEL","CHECK THE CLAIM"].map((label,i)=>'<g class="mc-svg-pick '+(focus===i?'is-focused':'')+'" role="button" tabindex="0" onclick="MathCourt.focusVisual('+i+')" aria-label="Inspect '+label+'"><rect x="'+(18+i*240)+'" y="40" width="206" height="112" rx="18" class="mc-svg-card '+(focus===i?'is-focused':'')+'"/><text x="'+(121+i*240)+'" y="70" text-anchor="middle" class="mc-svg-note">'+label+'</text><text x="'+(121+i*240)+'" y="117" text-anchor="middle" class="mc-svg-big">'+esc(String(values[i]===undefined?"?":values[i]))+'</text></g>'+(i<2?'<path d="M229 96 L251 96 M243 88 L251 96 L243 104" stroke="#267b70" stroke-width="3" fill="none"/>':"")).join("")+'<text x="360" y="185" text-anchor="middle" class="mc-svg-note">Do the records, model and conclusion agree?</text></svg>':renderModelSvg(item,values,focus);
    const explanation=mode==="compare"?"Compare the size and gaps between evidence values. A longer bar means a larger value on this shared scale.":mode==="trace"?"Follow the evidence from source to model to check. If one link is weak, the conclusion needs review.":"This is a visual model of the quantities or relationships mentioned in the case. Select a value to highlight it before answering.";
    return '<section class="mc-visual-lab" aria-label="Interactive visual maths workbench"><div class="mc-visual-header"><div><span class="mc-kicker">VISUAL EVIDENCE TABLE</span><h3>'+esc(visualHeading(item))+'</h3><p>Explore the picture, compare the evidence and work out what it really shows.</p></div><span class="mc-visual-stamp" aria-hidden="true">✦</span></div>'+
      '<div class="mc-visual-tabs" role="group" aria-label="Choose a visual representation">'+
      [{id:"model",label:"Build the model"},{id:"compare",label:"Compare values"},{id:"trace",label:"Trace the evidence"}].map(t=>'<button type="button" class="mc-visual-tab '+(mode===t.id?'is-active':'')+'" data-mode="'+t.id+'" aria-pressed="'+(mode===t.id?'true':'false')+'" onclick="MathCourt.setVisualMode(this.dataset.mode)">'+t.label+'</button>').join("")+
      '</div><div class="mc-visual-stage">'+svg+'</div><div class="mc-visual-footer"><p>'+explanation+'</p><div class="mc-visual-picks" role="group" aria-label="Inspect a source value">'+values.map((v,i)=>'<button type="button" class="mc-value-chip '+(focus===i?'is-active':'')+'" aria-pressed="'+(focus===i?'true':'false')+'" onclick="MathCourt.focusVisual('+i+')"><span>'+(i+1)+'</span>'+esc(String(v))+'</button>').join("")+'</div></div></section>';
  }
  function setVisualMode(mode) {
    if(!["model","compare","trace"].includes(mode))return;
    state.visualMode=mode;syncSession();renderCase();
  }
  function focusVisual(index) {
    state.visualFocus=Math.max(0,Math.min(4,Number(index)||0));syncSession();renderCase();
  }


  function renderAnswerTiles(options,task) {
    const action=task==="investigation"?"answerInvestigation":"answerChallenge";
    const symbols=["◆","◉","△"];
    return '<div class="mc-answer-game"><p class="mc-answer-instruction">Choose the result you can prove. Tap a tile to test it, or drag it onto the evidence tray.</p>'+
      '<div class="mc-answer-tiles">'+options.map((option,i)=>'<button type="button" class="mc-answer-tile" draggable="true" data-task="'+task+'" aria-label="Test result '+esc(String(option))+'" ondragstart="MathCourt.startAnswerDrag('+i+', this.dataset.task, event)" onclick="MathCourt.'+action+'('+i+')"><span class="mc-answer-symbol" aria-hidden="true">'+symbols[i%symbols.length]+'</span><span class="mc-answer-letter">RESULT '+String.fromCharCode(65+i)+'</span><strong>'+esc(String(option))+'</strong></button>').join("")+'</div>'+
      '<div class="mc-answer-dropzone" data-task="'+task+'" role="group" aria-label="Evidence tray" ondragover="event.preventDefault()" ondrop="MathCourt.dropAnswer(this.dataset.task,event)"><span class="mc-tray-symbol" aria-hidden="true">⚖️</span><span><strong>Evidence tray</strong><small>Drop your chosen result here</small></span><span class="mc-tray-arrow" aria-hidden="true">↓</span></div></div>';
  }
  function startAnswerDrag(index,task,event) {
    if(!event||!event.dataTransfer)return;
    event.dataTransfer.setData("text/plain",String(index));
    event.dataTransfer.setData("application/x-mfa-math-court-task",task);
    event.dataTransfer.effectAllowed="copy";
  }
  function dropAnswer(task,event) {
    if(!event)return;
    event.preventDefault();
    if(!event.dataTransfer)return;
    const carriedTask=event.dataTransfer.getData("application/x-mfa-math-court-task");
    const index=Number(event.dataTransfer.getData("text/plain"));
    if(carriedTask&&carriedTask!==task){setFeedback("Keep the result with its matching mathematical exhibit.","hint");return;}
    if(!Number.isInteger(index)||index<0){setFeedback("Pick up a result tile first.","hint");return;}
    if(task==="investigation")answerInvestigation(index);
    else if(task==="challenge")answerChallenge(index);
  }



  const patternRuleIds=["add1","add2","add3","double"];
  const fractionGoals=[[1,2],[1,3],[2,3],[1,4],[3,4],[2,6],[3,8],[5,10]];
  const machineRuleIds=["doublePlusOne","add3","triple","square"];
  function patternGoal(item,task) {
    const rule=patternRuleIds[(item.id+task-1)%patternRuleIds.length];
    const seed=2+((item.id+task*2)%7);
    const step=rule==="add1"?1:rule==="add2"?2:rule==="add3"?3:null;
    const sequence=step===null?[seed,seed*2,seed*4]:[seed,seed+step,seed+2*step];
    const next=step===null?seed*8:seed+3*step;
    return {rule,sequence,next};
  }
  function fractionGoal(item,task) {
    const pair=fractionGoals[(item.id*3+task-1)%fractionGoals.length];
    return {numerator:pair[0],denominator:pair[1]};
  }
  function shapeGoal(item,task) {
    const choices=[[6,10],[7,12],[8,12]];
    const pair=choices[(item.id+task-1)%choices.length];
    return {area:pair[0],perimeter:pair[1]};
  }
  function timelineGoal(item,task) {
    return 20+(((item.id*3+task*4)%17)*5);
  }
  function dataGoal(item,task) {
    const values=visualNumbers(item).slice(0,4).map(value=>Math.abs(value));
    const target=task===1?Math.max(...values):Math.min(...values);
    return {values,targetIndex:values.indexOf(target),which:task===1?"largest":"smallest"};
  }
  function ruleGoal(item,task) {
    const rule=machineRuleIds[(item.id+task-1)%machineRuleIds.length];
    const input=4+(item.id%3);
    const output=rule==="doublePlusOne"?2*input+1:rule==="add3"?input+3:rule==="triple"?3*input:input*input;
    return {rule,input,output};
  }
  function shareGoal(item,task) {
    return {total:12,minimums:[
      1+(item.id%3),
      1+((item.id+task)%3),
      1+((item.id+2*task)%3)
    ]};
  }
  function routeGoal() { return {start:0,end:2,maxLength:7}; }
  function townGoal(item,task) {
    return {total:12,minimums:[
      2+(item.id%2),
      1+((item.id+task)%3),
      1+((item.id+task*2)%2)
    ]};
  }
  function playGoal(item,task) {
    if(item.chapter===1) {
      const option=task===1?item.options[item.answer]:item.challenge.options[item.challenge.answer];
      return {title:task===1?"Forge the first result":"Forge the linked result",instruction:"Build a calculation that equals "+option+". Use the number tiles and operation buttons, then calculate it.",hint:"Try different number tiles and operations until the displayed result matches "+option+"."};
    }
    if(item.chapter===2) {
      const goal=patternGoal(item,task);
      return {title:"Grow the number path",instruction:"The sequence is "+goal.sequence.join(", ")+", … Choose the rule that fits and enter the next number.",hint:"Compare the gap between each neighbouring pair. The same rule must fit both gaps."};
    }
    if(item.chapter===3) {
      const goal=fractionGoal(item,task);
      return {title:"Build the target share",instruction:"Use the fraction strips to make "+goal.numerator+"/"+goal.denominator+" of one whole. Change the number of equal parts and the shaded parts.",hint:"The denominator counts all equal parts; the numerator counts the shaded parts."};
    }
    if(item.chapter===4) {
      const goal=shapeGoal(item,task);
      return {title:"Build a measured shape",instruction:"Make one connected shape using exactly "+goal.area+" squares and "+goal.perimeter+" outside edge units.",hint:"Area counts squares. Perimeter counts the exposed outside edges. Shared edges are not part of the outside."};
    }
    if(item.chapter===5) {
      const minutes=timelineGoal(item,task);
      return {title:"Set the journey time",instruction:"The journey leaves at 2:35 PM and should arrive at "+formatClock(14*60+35+minutes)+". Move the timeline to find the duration.",hint:"Count the time in hours and minutes. The arrival time should match the goal exactly."};
    }
    if(item.chapter===6) {
      const goal=dataGoal(item,task);
      return {title:"Read the chart carefully",instruction:"Select the "+goal.which+" record from the plotted evidence. Read the values as well as the bar lengths.",hint:"Compare the numerical labels on every bar. Do not rely on a cropped or zoomed baseline."};
    }
    if(item.chapter===7) {
      const goal=ruleGoal(item,task);
      return {title:"Tune the mystery machine",instruction:"For input "+goal.input+", make the machine display "+goal.output+". Choose the rule and set the input.",hint:"Test each candidate rule with the exact input. Keep the rule whose output matches the target."};
    }
    if(item.chapter===8) {
      const goal=shareGoal(item,task);
      return {title:"Share the counters with care",instruction:"Distribute all "+goal.total+" counters. Groups A, B and C need at least "+goal.minimums.join(", ")+ " counters respectively.",hint:"Meet every group's minimum first, then make sure the total is exactly 12."};
    }
    if(item.chapter===9) {
      return {title:"Find the shortest connected journey",instruction:"Travel from A to C using connected roads with a total journey length of 7 or less. Each road label adds to the total.",hint:"Compare A → B → C with routes through D and E. Add every road you travel."};
    }
    const goal=townGoal(item,task);
    return {title:"Plan within the shared budget",instruction:"Allocate exactly "+goal.total+" tokens. Towns A, B and C need at least "+goal.minimums.join(", ")+ " tokens respectively.",hint:"Satisfy each town's minimum, then use the total counter to stay within the 12-token budget."};
  }
  function shapeIsConnected(cells) {
    const set=new Set(cells);
    if(set.size===0)return false;
    const visited=new Set(),queue=[set.values().next().value];
    while(queue.length){
      const cell=queue.pop();
      if(visited.has(cell))continue;
      visited.add(cell);
      const row=Math.floor(cell/8),col=cell%8;
      for(const next of [col>0?cell-1:-1,col<7?cell+1:-1,row>0?cell-8:-1,row<5?cell+8:-1]){
        if(next>=0&&set.has(next)&&!visited.has(next))queue.push(next);
      }
    }
    return visited.size===set.size;
  }
  function playGoalMet(item,task) {
    const lab=state.lab;
    if(!lab)return false;
    if(item.chapter===1){
      const option=task===1?item.options[item.answer]:item.challenge.options[item.challenge.answer];
      const expected=expectedNumericChoice(option);
      return expected!==null&&lab.calculationResult!==null&&Math.abs(lab.calculationResult-expected)<=0.0001;
    }
    if(item.chapter===2){const goal=patternGoal(item,task);return lab.patternRule===goal.rule&&lab.patternPrediction===goal.next;}
    if(item.chapter===3){const goal=fractionGoal(item,task);return lab.fractionNumerator*goal.denominator===goal.numerator*lab.fractionDenominator;}
    if(item.chapter===4){const goal=shapeGoal(item,task),stats=shapeStats();return stats.area===goal.area&&stats.perimeter===goal.perimeter&&shapeIsConnected(lab.cells);}
    if(item.chapter===5)return lab.timelineMinutes===timelineGoal(item,task);
    if(item.chapter===6)return lab.dataSelection===dataGoal(item,task).targetIndex;
    if(item.chapter===7){const goal=ruleGoal(item,task);return lab.ruleType===goal.rule&&lab.ruleInput===goal.input;}
    if(item.chapter===8){const goal=shareGoal(item,task);return lab.shares.reduce((sum,n)=>sum+n,0)===goal.total&&lab.shares.every((n,i)=>n>=goal.minimums[i]);}
    if(item.chapter===9){
      const route=lab.route,total=route.slice(1).reduce((sum,n,i)=>sum+(routeEdge(route[i],n)||[0,0,0])[2],0);
      return route[0]===0&&route[route.length-1]===routeGoal().end&&total<=routeGoal().maxLength;
    }
    const goal=townGoal(item,task),total=lab.allocations.reduce((sum,n)=>sum+n,0);
    return total===goal.total&&lab.allocations.every((n,i)=>n>=goal.minimums[i]);
  }

  function freshLab(item) {
    const nums=visualNumbers(item);
    return {
      slot:"a",a:null,b:null,c:null,op:"+",op2:"+",useThird:false,
      calculationResult:null,patternRule:"add3",fractionNumerator:3,fractionDenominator:8,
      cells:[],timelineMinutes:30,dataZoom:false,dataSelection:null,ruleInput:4,ruleType:"doublePlusOne",patternPrediction:null,goalSolved:false,
      shares:[3,2,4],route:[0],allocations:[3,3,2],playCount:0,challengeBaseline:0,note:""
    };
  }
  function normaliseLab(saved,item) {
    const base=freshLab(item);
    const lab={...base,...saved};
    lab.slot=["a","b","c"].includes(lab.slot)?lab.slot:"a";
    lab.op=["+","-","×","÷"].includes(lab.op)?lab.op:"-";
    lab.op2=["+","-","×","÷"].includes(lab.op2)?lab.op2:"+";
    lab.useThird=Boolean(lab.useThird);
    if(!Number.isInteger(saved.playCount)){lab.a=null;lab.b=null;lab.c=null;lab.op="+";lab.useThird=false;lab.calculationResult=null;}
    lab.playCount=Math.max(0,Math.floor(Number(lab.playCount)||0));
    lab.challengeBaseline=Math.max(0,Math.floor(Number(lab.challengeBaseline)||0));
    lab.patternRule=["add1","add2","add3","double"].includes(lab.patternRule)?lab.patternRule:"add3";
    lab.patternPrediction=lab.patternPrediction===null||lab.patternPrediction===undefined||lab.patternPrediction===""?null:Number.isFinite(Number(lab.patternPrediction))?Number(lab.patternPrediction):null;
    lab.dataSelection=Number.isInteger(lab.dataSelection)&&lab.dataSelection>=0&&lab.dataSelection<4?lab.dataSelection:null;
    lab.goalSolved=Boolean(lab.goalSolved);
    lab.fractionDenominator=[2,3,4,6,8,10,12].includes(lab.fractionDenominator)?lab.fractionDenominator:8;
    lab.fractionNumerator=Math.max(0,Math.min(lab.fractionDenominator,Number(lab.fractionNumerator)||0));
    lab.cells=Array.isArray(lab.cells)?[...new Set(lab.cells.filter(n=>Number.isInteger(n)&&n>=0&&n<48))]:base.cells;
    lab.timelineMinutes=Math.max(0,Math.min(180,Number(lab.timelineMinutes)||0));
    lab.dataZoom=Boolean(lab.dataZoom);
    lab.ruleInput=Math.max(1,Math.min(12,Number(lab.ruleInput)||1));
    lab.ruleType=["doublePlusOne","add3","triple","square"].includes(lab.ruleType)?lab.ruleType:"doublePlusOne";
    lab.shares=Array.isArray(lab.shares)?[0,1,2].map(i=>Math.max(0,Math.min(15,Number(lab.shares[i])||0))):base.shares;
    const validRoute=Array.isArray(lab.route)&&lab.route.length?lab.route.filter(n=>Number.isInteger(n)&&n>=0&&n<5):[0];
    lab.route=validRoute.length?validRoute:[0];
    lab.allocations=Array.isArray(lab.allocations)?[0,1,2].map(i=>Math.max(0,Math.min(12,Number(lab.allocations[i])||0))):base.allocations;
    return lab;
  }
  function markLabPlay() {
    if(state.lab){state.lab.playCount=Math.max(0,Number(state.lab.playCount)||0)+1;state.lab.goalSolved=false;}
  }
  function refreshCaseKeepingScroll() {
    const active=document.activeElement;
    const canRestore=active&&active!==document.body&&active.closest&&active.closest("#mc-stage-content");
    const snapshot=canRestore?{tag:active.tagName.toLowerCase(),id:active.id||"",className:typeof active.className==="string"?active.className:"",dataset:{...active.dataset},label:active.getAttribute("aria-label")||"",text:(active.innerText||active.textContent||"").trim(),top:active.getBoundingClientRect().top}:null;
    const pageY=window.scrollY;
    syncSession();renderCase();window.scrollTo({top:pageY,behavior:"auto"});
    if(snapshot){
      let target=snapshot.id?document.getElementById(snapshot.id):null;
      if(!target)target=Array.from(document.querySelectorAll("#mc-stage-content "+snapshot.tag)).find(node=>{
        if(snapshot.className&&node.className!==snapshot.className)return false;
        if(snapshot.label&&node.getAttribute("aria-label")!==snapshot.label)return false;
        if((node.innerText||node.textContent||"").trim()!==snapshot.text)return false;
        return Object.entries(snapshot.dataset).every(([key,value])=>node.dataset[key]===value);
      })||null;
      if(target){target.focus({preventScroll:true});const delta=target.getBoundingClientRect().top-snapshot.top;if(Math.abs(delta)>1)window.scrollBy({top:delta,behavior:"auto"});}
    }
  }
  function scrollCaseIntoView() {
    const target=$("mc-case-header");
    if(!target)return;
    const nav=document.querySelector(".site-header");
    const offset=nav?nav.getBoundingClientRect().height:0;
    const top=target.getBoundingClientRect().top+window.scrollY-offset-8;
    window.scrollTo({top:Math.max(0,top),behavior:"auto"});
  }
  function chooseLabSlot(slot) {
    if(!["a","b","c"].includes(slot))return;
    state.lab.slot=slot;refreshCaseKeepingScroll();
  }
  function chooseLabNumber(index) {
    const item=data().getCase(state.caseId),nums=visualNumbers(item);
    if(!Number.isInteger(index)||index<0||index>=nums.length)return;
    if(state.lab[state.lab.slot]===nums[index]){state.lab.note="Choose a different number tile to change this slot.";refreshCaseKeepingScroll();return;}
    state.lab[state.lab.slot]=nums[index];
    markLabPlay();
    state.lab.calculationResult=null;
    state.lab.note="Number tile placed in Slot "+state.lab.slot.toUpperCase()+". Try a second step when your problem needs one.";
    refreshCaseKeepingScroll();
  }
  function chooseLabOperator(op) {
    if(!["+","-","×","÷"].includes(op))return;
    if(state.lab.op===op){state.lab.note="Try a different operation to explore a new result.";refreshCaseKeepingScroll();return;}
    state.lab.op=op;markLabPlay();state.lab.calculationResult=null;refreshCaseKeepingScroll();
  }
  function chooseLabOperator2(op) {
    if(!["+","-","×","÷"].includes(op))return;
    if(state.lab.op2===op){state.lab.note="Try another operation for the second step.";refreshCaseKeepingScroll();return;}
    state.lab.op2=op;markLabPlay();state.lab.calculationResult=null;refreshCaseKeepingScroll();
  }
  function toggleThirdOperand() {
    state.lab.useThird=!state.lab.useThird;markLabPlay();state.lab.calculationResult=null;
    if(state.lab.useThird)state.lab.slot="c";else if(state.lab.slot==="c")state.lab.slot="a";
    state.lab.note=state.lab.useThird?"A second step is ready. Choose a third number tile.":"Back to a two-number calculation.";
    refreshCaseKeepingScroll();
  }
  function calculateLab() {
    const {a,b,c,op,op2,useThird}=state.lab;
    if(a===null||b===null||(op==="÷"&&b===0)||(useThird&&(c===null||(op2==="÷"&&c===0)))){
      state.lab.note="Choose number tiles that make a defined calculation.";state.lab.calculationResult=null;refreshCaseKeepingScroll();return;
    }
    markLabPlay();
    const first=op==="+"?a+b:op==="-"?a-b:op==="×"?a*b:a/b;
    const result=useThird?(op2==="+"?first+c:op2==="-"?first-c:op2==="×"?first*c:first/c):first;
    state.lab.calculationResult=Number.isFinite(result)?Number(result.toFixed(4)):null;
    state.lab.note=state.lab.calculationResult===null?"Choose a defined calculation.":"Aha! "+(useThird?"("+a+" "+op+" "+b+") "+op2+" "+c:a+" "+op+" "+b)+" = "+state.lab.calculationResult+". Try matching this model to the case.";
    refreshCaseKeepingScroll();
  }
  function setPatternRule(rule) {
    if(!["add1","add2","add3","double"].includes(rule))return;
    if(state.lab.patternRule===rule)return;
    state.lab.patternRule=rule;markLabPlay();refreshCaseKeepingScroll();
  }
  function setFraction(which,delta) {
    if(!["numerator","denominator"].includes(which))return;
    const oldNumerator=state.lab.fractionNumerator,oldDenominator=state.lab.fractionDenominator;
    if(which==="numerator")state.lab.fractionNumerator=Math.max(0,Math.min(state.lab.fractionDenominator,state.lab.fractionNumerator+delta));
    if(which==="denominator"){
      const choices=[2,3,4,6,8,10,12],i=choices.indexOf(state.lab.fractionDenominator);
      const next=Math.max(0,Math.min(choices.length-1,i+delta));
      state.lab.fractionDenominator=choices[next];
      state.lab.fractionNumerator=Math.min(state.lab.fractionNumerator,state.lab.fractionDenominator);
    }
    if(oldNumerator!==state.lab.fractionNumerator||oldDenominator!==state.lab.fractionDenominator)markLabPlay();
    refreshCaseKeepingScroll();
  }
  function toggleShapeCell(index) {
    if(!Number.isInteger(index)||index<0||index>=48)return;
    markLabPlay();
    const cells=new Set(state.lab.cells);
    if(cells.has(index))cells.delete(index);else cells.add(index);
    state.lab.cells=[...cells];refreshCaseKeepingScroll();
  }
  function shapeStats() {
    const cells=new Set(state.lab.cells);let perimeter=0;
    for(const n of cells){
      const r=Math.floor(n/8),c=n%8;
      if(r===0||!cells.has(n-8))perimeter++;
      if(r===5||!cells.has(n+8))perimeter++;
      if(c===0||!cells.has(n-1))perimeter++;
      if(c===7||!cells.has(n+1))perimeter++;
    }
    return {area:cells.size,perimeter};
  }
  function setLabTimeline(value) {
    const next=Math.max(0,Math.min(180,Number(value)||0));
    if(next===state.lab.timelineMinutes)return;
    state.lab.timelineMinutes=next;markLabPlay();
    const end=14*60+35+next,rail=document.querySelector(".mc-time-rail");
    const fill=rail&&rail.querySelector("span"),marker=rail&&rail.querySelector("i");
    if(fill)fill.style.width=Math.min(100,next/180*100)+"%";
    if(marker)marker.style.left=Math.min(100,next/180*100)+"%";
    const endNode=document.querySelector(".mc-time-end");if(endNode)endNode.textContent=formatClock(end);
    const result=document.querySelector(".mc-time-result");
    if(result){const strong=result.querySelector("strong"),small=result.querySelector("span");if(strong)strong.textContent=next+" minutes";if(small)small.textContent=Math.floor(next/60)+" hour"+(Math.floor(next/60)===1?"":"s")+" and "+(next%60)+" minutes";}
    updateWorkshopCheckAfterPlay();syncSession();
  }
  function toggleDataZoom() {
    state.lab.dataZoom=!state.lab.dataZoom;markLabPlay();refreshCaseKeepingScroll();
  }
  function setRuleInput(value) {
    const next=Math.max(1,Math.min(12,Number(value)||1));
    if(next===state.lab.ruleInput)return;
    state.lab.ruleInput=next;markLabPlay();
    const lab=state.lab,output=lab.ruleType==="doublePlusOne"?2*next+1:lab.ruleType==="add3"?next+3:lab.ruleType==="triple"?3*next:next*next;
    const boxes=document.querySelectorAll(".mc-machine-box strong");if(boxes[0])boxes[0].textContent=String(next);if(boxes[2])boxes[2].textContent=String(output);
    const feedback=document.querySelector(".mc-math-play .mc-play-feedback");
    if(feedback)feedback.textContent=output+" comes from applying "+(lab.ruleType==="doublePlusOne"?"2 × "+next+" + 1":lab.ruleType==="add3"?next+" + 3":lab.ruleType==="triple"?"3 × "+next:next+" × "+next)+".";
    updateWorkshopCheckAfterPlay();syncSession();
  }
  function setRuleType(rule) {
    if(!["doublePlusOne","add3","triple","square"].includes(rule))return;
    if(state.lab.ruleType===rule)return;
    state.lab.ruleType=rule;markLabPlay();refreshCaseKeepingScroll();
  }
  function adjustShare(group,delta) {
    if(!Number.isInteger(group)||group<0||group>2)return;
    const next=Math.max(0,Math.min(15,state.lab.shares[group]+delta));if(next===state.lab.shares[group])return;
    state.lab.shares[group]=next;markLabPlay();
    refreshCaseKeepingScroll();
  }
  const routeEdges=[[0,1,4],[1,2,5],[0,3,2],[3,4,3],[4,2,2],[1,4,4]];
  function routeEdge(a,b) {return routeEdges.find(e=>(e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a));}
  function extendRoute(node) {
    const route=state.lab.route;
    if(node===route[route.length-2]){route.pop();markLabPlay();refreshCaseKeepingScroll();return;}
    if(node===route[route.length-1])return;
    if(route.includes(node)){state.lab.note="Try a fresh route without revisiting a stop.";setFeedback(state.lab.note,"hint");refreshCaseKeepingScroll();return;}
    if(!routeEdge(route[route.length-1],node)){state.lab.note="Choose a connected stop. The roads show where you can travel next.";setFeedback(state.lab.note,"hint");refreshCaseKeepingScroll();return;}
    route.push(node);markLabPlay();state.lab.note="Route extended. Add up the road lengths to compare journeys.";refreshCaseKeepingScroll();
  }
  function resetRoute() {if(state.lab.route.length===1&&state.lab.route[0]===0)return;state.lab.route=[0];markLabPlay();state.lab.note="Begin at A and build a connected route.";refreshCaseKeepingScroll();}
  function adjustAllocation(group,delta) {
    if(!Number.isInteger(group)||group<0||group>2)return;
    const next=state.lab.allocations[group]+delta;
    const total=state.lab.allocations.reduce((sum,n)=>sum+n,0);
    if(next<0||next>12||delta>0&&total>=12)return;
    state.lab.allocations[group]=next;markLabPlay();refreshCaseKeepingScroll();
  }
  function formatClock(minutes) {
    const value=((minutes%1440)+1440)%1440,hour=Math.floor(value/60),minute=value%60;
    return ((hour%12)||12)+":"+String(minute).padStart(2,"0")+" "+(hour<12?"AM":"PM");
  }
  function renderNumberForge(item) {
    const vals=visualNumbers(item).slice(0,5),lab=state.lab;
    const shown=lab.calculationResult===null?"?":String(lab.calculationResult);
    const slot=(name,value)=>'<button type="button" class="mc-equation-slot '+(lab.slot===name?"is-selected":"")+'" data-slot="'+name+'" aria-pressed="'+(lab.slot===name)+'" onclick="MathCourt.chooseLabSlot(this.dataset.slot)"><small>SLOT '+name.toUpperCase()+'</small><strong>'+esc(value===null?"Place a tile":String(value))+'</strong></button>';
    const op=(value,second)=>'<span class="mc-equation-operation" aria-label="operation">'+esc(value)+'</span>';
    const opPicker=(current,second)=>'<div class="mc-operation-picker mc-operation-picker-'+(second?"second":"first")+'">'+["+","-","×","÷"].map(value=>'<button type="button" class="mc-op-tile '+(current===value?"is-selected":"")+'" data-op="'+value+'" onclick="MathCourt.'+(second?"chooseLabOperator2":"chooseLabOperator")+'(this.dataset.op)">'+esc(value)+'</button>').join("")+'</div>';
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>🧱 NUMBER FORGE</span><h3>Build the calculation</h3><p>Place number tiles into slots, choose the operation, and watch your result appear. Some cases need one step; others need a chain.</p></div>'+
      '<div class="mc-equation-board mc-equation-chain">'+
      (lab.useThird?op("(",false):'')+slot("a",lab.a)+op(lab.op,false)+slot("b",lab.b)+
      (lab.useThird?op(")",false)+op(lab.op2,true)+slot("c",lab.c):'')+
      '<div class="mc-equation-equals">=</div><div class="mc-equation-result"><small>YOUR RESULT</small><strong>'+shown+'</strong></div></div>'+
      '<div class="mc-number-pool" role="group" aria-label="Number tiles">'+vals.map((n,i)=>'<button type="button" class="mc-number-tile" data-number-index="'+i+'" onclick="MathCourt.chooseLabNumber('+i+')">'+esc(String(n))+'</button>').join("")+'</div>'+
      '<div class="mc-forge-controls"><div><span class="mc-forge-label">STEP 1 · combine A and B</span>'+opPicker(lab.op,false)+'</div>'+
      (lab.useThird?'<div><span class="mc-forge-label">STEP 2 · combine the result and C</span>'+opPicker(lab.op2,true)+'</div>':'')+
      '<button type="button" class="mc-button mc-button-secondary mc-forge-chain-toggle" aria-pressed="'+lab.useThird+'" onclick="MathCourt.toggleThirdOperand()">'+(lab.useThird?'− Use two numbers':'＋ Add another step')+'</button>'+
      '<button type="button" class="mc-button mc-button-primary mc-build-button" onclick="MathCourt.calculateLab()">Make the calculation ✨</button></div>'+
      '<p class="mc-play-feedback" aria-live="polite">'+esc(lab.note||"Try different combinations. Notice how each operation changes the result.")+'</p></section>';
  }


  function renderPatternGarden(item,task) {
    const goal=patternGoal(item,task),lab=state.lab;
    const step=lab.patternRule==="add1"?1:lab.patternRule==="add2"?2:lab.patternRule==="add3"?3:null;
    const preview=step===null?goal.sequence[2]*2:goal.sequence[2]+step;
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>🌱 PATTERN GARDEN</span><h3>Grow the number path</h3><p>Find the rule that explains both jumps. Predict the next stone before checking your idea.</p></div>'+
      '<div class="mc-pattern-path">'+goal.sequence.map((n,i)=>'<div class="mc-pattern-stone"><small>STONE '+(i+1)+'</small><strong>'+n+'</strong></div>').join("")+'<div class="mc-pattern-stone mc-pattern-next"><small>NEXT</small><strong>'+(lab.patternPrediction===null?"?":esc(String(lab.patternPrediction)))+'</strong></div></div>'+
      '<div class="mc-rule-tiles">'+[{id:"add1",label:"+ 1"},{id:"add2",label:"+ 2"},{id:"add3",label:"+ 3"},{id:"double",label:"× 2"}].map(r=>'<button type="button" class="mc-op-tile '+(lab.patternRule===r.id?"is-selected":"")+'" data-rule="'+r.id+'" aria-pressed="'+(lab.patternRule===r.id)+'" onclick="MathCourt.setPatternRule(this.dataset.rule)">'+r.label+'</button>').join("")+'</div>'+
      '<p class="mc-play-feedback">Preview with this rule: next value = '+preview+'.</p>'+
      '<label class="mc-range-label" for="mc-pattern-prediction">Your prediction for the next stone</label><div class="mc-prediction-row"><input id="mc-pattern-prediction" class="mc-play-number-input" type="number" inputmode="numeric" value="'+(lab.patternPrediction===null?"":esc(String(lab.patternPrediction)))+'" placeholder="Enter the next value"/><button class="mc-button mc-button-secondary" type="button" onclick="MathCourt.submitPatternPrediction()">Place prediction</button></div></section>';
  }
  function renderFractionStudio(item,task) {
    const lab=state.lab,den=lab.fractionDenominator,num=lab.fractionNumerator,goal=fractionGoal(item,task);
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>🍰 FRACTION STUDIO</span><h3>Share the whole</h3><p>Build the target share by changing equal parts and shading the right amount.</p></div>'+
      '<div class="mc-workshop-target"><small>TARGET SHARE</small><strong>'+goal.numerator+'/'+goal.denominator+'</strong><span>of one whole</span></div>'+
      '<div class="mc-fraction-strip" role="group" aria-label="'+num+' of '+den+' equal parts shaded">'+Array.from({length:den},(_,i)=>'<button type="button" class="mc-fraction-part '+(i<num?"is-filled":"")+'" aria-label="Part '+(i+1)+' '+(i<num?"shaded":"empty")+'" data-which="numerator" data-delta="'+(i<num?-1:1)+'" onclick="MathCourt.setFraction(this.dataset.which,Number(this.dataset.delta))"></button>').join("")+'</div>'+
      '<div class="mc-fraction-equation"><strong>'+num+'/'+den+'</strong><span>of one whole</span><strong>'+Math.round(num/den*100)+'%</strong></div>'+
      '<div class="mc-play-control-row"><span>Shaded parts</span><button class="mc-stepper" data-which="numerator" data-delta="-1" onclick="MathCourt.setFraction(this.dataset.which,-1)" aria-label="One fewer shaded part">−</button><strong>'+num+'</strong><button class="mc-stepper" data-which="numerator" data-delta="1" onclick="MathCourt.setFraction(this.dataset.which,1)" aria-label="One more shaded part">+</button></div>'+
      '<div class="mc-play-control-row"><span>Equal slices</span><button class="mc-stepper" data-which="denominator" data-delta="-1" onclick="MathCourt.setFraction(this.dataset.which,-1)" aria-label="Fewer equal parts">−</button><strong>'+den+'</strong><button class="mc-stepper" data-which="denominator" data-delta="1" onclick="MathCourt.setFraction(this.dataset.which,1)" aria-label="More equal parts">+</button></div></section>';
  }
  function renderShapeWorkshop(item,task) {
    const stats=shapeStats(),goal=shapeGoal(item,task);
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>🧩 SHAPE WORKSHOP</span><h3>Build a connected shape</h3><p>Tap grid squares to design a shape. Shared edges are inside edges, not part of the outside boundary.</p></div>'+
      '<div class="mc-workshop-target"><small>SHAPE CHALLENGE</small><strong>'+goal.area+' squares · '+goal.perimeter+' outside edges</strong><span>All selected squares must connect.</span></div>'+
      '<div class="mc-shape-builder" role="group" aria-label="48-square shape builder">'+Array.from({length:48},(_,i)=>'<button type="button" class="mc-shape-cell '+(state.lab.cells.includes(i)?"is-filled":"")+'" aria-label="Grid square '+(i+1)+'" aria-pressed="'+state.lab.cells.includes(i)+'" onclick="MathCourt.toggleShapeCell('+i+')"></button>').join("")+'</div>'+
      '<div class="mc-shape-stats"><div><small>AREA</small><strong>'+stats.area+'</strong><span>square units</span></div><div><small>PERIMETER</small><strong>'+stats.perimeter+'</strong><span>edge units</span></div></div>'+
      '<button class="mc-button mc-button-quiet" type="button" onclick="MathCourt.resetShape()">Start a fresh shape ↻</button></section>';
  }
  function renderTimeline(item,task) {
    const mins=state.lab.timelineMinutes,start=14*60+35,end=start+mins,goal=timelineGoal(item,task);
    const goalEnd=start+goal;
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>⏱️ TIMELINE STUDIO</span><h3>Move through time</h3><p>Use elapsed time to match a planned arrival. Watch the clock move as the duration changes.</p></div>'+
      '<div class="mc-workshop-target"><small>PLANNED ARRIVAL</small><strong>'+formatClock(goalEnd)+'</strong><span>Starting at 2:35 PM</span></div>'+
      '<div class="mc-timeline-track"><span class="mc-time-start">'+formatClock(start)+'</span><div class="mc-time-rail"><span style="width:'+Math.min(100,mins/180*100)+'%"></span><i style="left:'+Math.min(100,mins/180*100)+'%"></i></div><span class="mc-time-end">'+formatClock(end)+'</span></div>'+
      '<div class="mc-time-result"><small>YOUR JOURNEY</small><strong>'+mins+' minutes</strong><span>'+Math.floor(mins/60)+' hour'+(Math.floor(mins/60)===1?"":"s")+' and '+(mins%60)+' minutes</span></div>'+
      '<label class="mc-range-label" for="mc-timeline-range">Move the journey marker</label><input id="mc-timeline-range" class="mc-range" type="range" min="0" max="180" step="5" value="'+mins+'" oninput="MathCourt.setLabTimeline(this.value)"/></section>';
  }
  function renderDataGarden(item,task) {
    const goal=dataGoal(item,task),vals=goal.values;
    const min=Math.min(...vals),max=Math.max(...vals),base=state.lab.dataZoom?Math.max(0,min-10):0,range=Math.max(1,max-base);
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>📊 DATA GARDEN</span><h3>Read the evidence bars</h3><p>Tap a record to choose it. Compare both the written values and the visible bar lengths.</p></div>'+
      '<div class="mc-workshop-target"><small>CHART QUEST</small><strong>Select the '+goal.which+' record</strong><span>Choose one bar from the records below.</span></div>'+
      '<div class="mc-data-chart" role="group" aria-label="Select one of the evidence values">'+vals.map((n,i)=>'<button type="button" class="mc-data-bar-wrap '+(state.lab.dataSelection===i?"is-selected":"")+'" aria-pressed="'+(state.lab.dataSelection===i)+'" aria-label="Record '+(i+1)+", value "+n+'" onclick="MathCourt.selectDataRecord('+i+')"><strong>'+n+'</strong><div class="mc-data-bar-track"><span style="height:'+Math.max(4,(n-base)/range*100)+'%"></span></div><small>Record '+(i+1)+'</small></button>').join("")+'</div>'+
      '<div class="mc-chart-scale-label">Scale starts at <strong>'+base+'</strong></div><div class="mc-rule-tiles"><button type="button" class="mc-op-tile '+(!state.lab.dataZoom?"is-selected":"")+'" aria-pressed="'+(!state.lab.dataZoom)+'" onclick="MathCourt.setDataZoom(false)">Start at zero</button><button type="button" class="mc-op-tile '+(state.lab.dataZoom?"is-selected":"")+'" aria-pressed="'+state.lab.dataZoom+'" onclick="MathCourt.setDataZoom(true)">Zoom in</button></div>'+
      '<p class="mc-play-feedback">'+(state.lab.dataZoom?"Zooming in highlights small gaps; show the scale so everyone can judge fairly.":"A zero baseline makes the full bar lengths easier to compare.")+'</p></section>';
  }
  function renderRuleMachine(item,task) {
    const lab=state.lab,x=lab.ruleInput,y=lab.ruleType==="doublePlusOne"?2*x+1:lab.ruleType==="add3"?x+3:lab.ruleType==="triple"?3*x:x*x,goal=ruleGoal(item,task);
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>⚙️ RULE MACHINE</span><h3>Tune the mystery machine</h3><p>Choose a rule and move the input. The output changes immediately.</p></div>'+
      '<div class="mc-workshop-target"><small>MYSTERY MACHINE CARD</small><strong>Input '+goal.input+' → Output '+goal.output+'</strong><span>Find the rule that makes both match.</span></div>'+
      '<div class="mc-machine-flow"><div class="mc-machine-box"><small>INPUT</small><strong>'+x+'</strong></div><div class="mc-machine-arrow">→</div><div class="mc-machine-box mc-machine-core"><small>RULE</small><strong>'+(lab.ruleType==="doublePlusOne"?"2x + 1":lab.ruleType==="add3"?"x + 3":lab.ruleType==="triple"?"3x":"x²")+'</strong></div><div class="mc-machine-arrow">→</div><div class="mc-machine-box"><small>OUTPUT</small><strong>'+y+'</strong></div></div>'+
      '<label class="mc-range-label" for="mc-rule-input">Change input</label><input id="mc-rule-input" class="mc-range" type="range" min="1" max="12" value="'+x+'" oninput="MathCourt.setRuleInput(this.value)"/>'+
      '<div class="mc-rule-tiles">'+[{id:"doublePlusOne",label:"2x + 1"},{id:"add3",label:"x + 3"},{id:"triple",label:"3x"},{id:"square",label:"x²"}].map(r=>'<button type="button" class="mc-op-tile '+(lab.ruleType===r.id?"is-selected":"")+'" data-rule="'+r.id+'" aria-pressed="'+(lab.ruleType===r.id)+'" onclick="MathCourt.setRuleType(this.dataset.rule)">'+r.label+'</button>').join("")+'</div>'+
      '<p class="mc-play-feedback">'+y+' comes from applying '+(lab.ruleType==="doublePlusOne"?"2 × "+x+" + 1":lab.ruleType==="add3"?x+" + 3":lab.ruleType==="triple"?"3 × "+x:x+" × "+x)+'.</p></section>';
  }
  function renderShareMarket(item,task) {
    const shares=state.lab.shares,total=shares.reduce((s,n)=>s+n,0),gap=Math.max(...shares)-Math.min(...shares),goal=shareGoal(item,task);
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>🫶 FAIR-SHARE MARKET</span><h3>Share the counters with care</h3><p>Each counter is one unit of resource. Adjust the shares and watch the total change.</p></div>'+
      '<div class="mc-workshop-target"><small>COMMUNITY NEEDS</small><strong>Total: '+goal.total+' counters</strong><span>Minimum needs for A, B and C: '+goal.minimums.join(" · ")+'</span></div>'+
      '<div class="mc-share-groups">'+shares.map((n,i)=>'<div class="mc-share-group"><strong>Group '+String.fromCharCode(65+i)+'</strong><div class="mc-share-dots">'+Array.from({length:n},()=>'<i aria-hidden="true"></i>').join("")+'</div><div class="mc-share-adjust"><button class="mc-stepper" onclick="MathCourt.adjustShare('+i+',-1)" aria-label="Give one fewer counter to group '+String.fromCharCode(65+i)+'">−</button><strong>'+n+'</strong><button class="mc-stepper" onclick="MathCourt.adjustShare('+i+',1)" aria-label="Give one more counter to group '+String.fromCharCode(65+i)+'">+</button></div></div>').join("")+'</div>'+
      '<div class="mc-shares-summary"><span>Total counters <strong>'+total+'</strong></span><span>Largest gap <strong>'+gap+'</strong></span></div>'+
      '<p class="mc-play-feedback">'+(total===goal.total&&shares.every((n,i)=>n>=goal.minimums[i])?"Every stated need is met. Check that the total stays exactly 12.":total===goal.total?"The total fits. Check each group's stated minimum.":"Move counters between groups to meet every minimum and use exactly 12.")+'</p></section>';
  }
  function renderRouteGarden(item,task) {
    const route=state.lab.route,total=route.slice(1).reduce((sum,n,i)=>sum+(routeEdge(route[i],n)||[0,0,0])[2],0),goal=routeGoal();
    const nodes=[[55,70],[182,40],[306,74],[94,170],[242,166]],labels=["A","B","C","D","E"];
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>🗺️ ROUTE GARDEN</span><h3>Find a short connected journey</h3><p>Start at A, then choose one connected stop at a time. Every road adds to your journey length.</p></div>'+
      '<div class="mc-workshop-target"><small>ROUTE MISSION</small><strong>Reach C in '+goal.maxLength+' road units or fewer</strong><span>Read each road label and compare complete routes.</span></div>'+
      '<svg viewBox="0 0 360 220" class="mc-route-map" role="img" aria-label="Five-stop route network">'+routeEdges.map(e=>'<line x1="'+nodes[e[0]][0]+'" y1="'+nodes[e[0]][1]+'" x2="'+nodes[e[1]][0]+'" y2="'+nodes[e[1]][1]+'" class="'+(route.some((n,i)=>i<route.length-1&&routeEdge(n,route[i+1])===e)?"mc-route-selected":"")+'"/><text x="'+((nodes[e[0]][0]+nodes[e[1]][0])/2)+'" y="'+((nodes[e[0]][1]+nodes[e[1]][1])/2-7)+'">'+e[2]+'</text>').join("")+nodes.map((n,i)=>'<g class="mc-route-node '+(route.includes(i)?"is-visited":"")+'"><circle cx="'+n[0]+'" cy="'+n[1]+'" r="20"/><text x="'+n[0]+'" y="'+(n[1]+5)+'" class="mc-route-label">'+labels[i]+'</text></g>').join("")+'</svg>'+
      '<div class="mc-route-buttons">'+labels.map((label,i)=>'<button type="button" class="mc-route-choice '+(route[route.length-1]===i?"is-current":"")+'" aria-pressed="'+(route[route.length-1]===i)+'" onclick="MathCourt.extendRoute('+i+')">'+label+'</button>').join("")+'</div>'+
      '<div class="mc-shares-summary"><span>Stops <strong>'+route.map(n=>labels[n]).join(" → ")+'</strong></span><span>Journey length <strong>'+total+'</strong></span></div>'+
      '<button class="mc-button mc-button-quiet" type="button" onclick="MathCourt.resetRoute()">New journey ↻</button></section>';
  }
  function renderTownPlanner(item,task) {
    const allocations=state.lab.allocations,total=allocations.reduce((s,n)=>s+n,0),goal=townGoal(item,task);
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>🏡 TOWN PLANNER</span><h3>Make a plan that fits everyone&#39;s needs</h3><p>Allocate resource tokens, satisfy each stated minimum and keep within the shared budget.</p></div>'+
      '<div class="mc-workshop-target"><small>PLANNING CONSTRAINTS</small><strong>Use exactly '+goal.total+' tokens</strong><span>Minimum needs for A, B and C: '+goal.minimums.join(" · ")+'</span></div>'+
      '<div class="mc-resource-bar"><span style="width:'+(total/goal.total*100)+'%"></span></div><p class="mc-budget-label">'+total+' of '+goal.total+' tokens planned · '+(goal.total-total)+' still available</p>'+
      '<div class="mc-town-bins">'+allocations.map((n,i)=>'<div class="mc-town-bin"><strong>Town '+String.fromCharCode(65+i)+'</strong><div class="mc-town-tokens">'+Array.from({length:n},()=>'<i></i>').join("")+'</div><div class="mc-share-adjust"><button class="mc-stepper" onclick="MathCourt.adjustAllocation('+i+',-1)" aria-label="Remove a token from town '+String.fromCharCode(65+i)+'">−</button><strong>'+n+'</strong><button class="mc-stepper" '+(total>=goal.total?'disabled':'')+' onclick="MathCourt.adjustAllocation('+i+',1)" aria-label="Add a token to town '+String.fromCharCode(65+i)+'">+</button></div></div>').join("")+'</div>'+
      '<p class="mc-play-feedback">'+(total===goal.total&&allocations.every((n,i)=>n>=goal.minimums[i])?"The plan fits the budget and every town&#39;s stated minimum.":total===goal.total?"The budget is fully allocated; check the minimums for each town.":"You have "+(goal.total-total)+" tokens to place. Meet the minimums and use the whole budget.")+'</p></section>';
  }
  function renderPlayActivity(item) {
    const task=state.investigationSolved?2:1;
    const activity=item.chapter===1?renderNumberForge(item,task):item.chapter===2?renderPatternGarden(item,task):item.chapter===3?renderFractionStudio(item,task):item.chapter===4?renderShapeWorkshop(item,task):item.chapter===5?renderTimeline(item,task):item.chapter===6?renderDataGarden(item,task):item.chapter===7?renderRuleMachine(item,task):item.chapter===8?renderShareMarket(item,task):item.chapter===9?renderRouteGarden(item,task):renderTownPlanner(item,task);
    const goal=playGoal(item,task),goalSolved=Boolean(state.lab&&state.lab.goalSolved&&playGoalMet(item,task));
    return '<div class="mc-play-station"><div class="mc-station-top"><span>✨ PLAY & DISCOVER</span><span>CHAPTER '+String(item.chapter).padStart(2,"0")+' · TASK '+task+' OF 2</span></div>'+activity+
      '<section class="mc-workshop-check '+(goalSolved?"is-solved":"")+'" aria-live="polite"><div class="mc-workshop-check-icon" aria-hidden="true">'+(goalSolved?"✓":"✦")+'</div><div class="mc-workshop-check-copy"><small>YOUR HANDS-ON CHALLENGE</small><strong>'+esc(goal.title)+'</strong><p>'+esc(goal.instruction)+'</p></div><button type="button" class="mc-button mc-button-secondary" onclick="MathCourt.checkPlayGoal()">'+(goalSolved?"Model checked ✓":"Check my model")+'</button>'+(goalSolved?'<span class="mc-workshop-complete">Goal complete! Ready to use this finding.</span>':'')+'</section></div>';
  }

    function renderStoryNarrative(item) {
    const story = item.story || item.opening || "Use the records to test the claim.";
    return '<p class="mc-story-text mc-story-hook">'+esc(story)+'</p>';
  }
  function renderCase() {
    const item=data().getCase(state.caseId),host=$("mc-stage-content");
    if(!item||!host)return;
    $("mc-docket").hidden=true;$("mc-play").hidden=false;
    $("mc-case-title").textContent="Case "+String(item.id).padStart(3,"0")+" · "+item.title;
    $("mc-case-chapter").textContent=data().chapters.find(ch=>ch.id===item.chapter).name;
    $("mc-stage-name").textContent=PHASE_LABELS[state.phase];
    $("mc-stage-count").textContent=(state.phase+1)+" / 7";
    $("mc-stage-fill").style.width=((state.phase+1)/7*100)+"%";
    $("mc-stage-fill").parentElement.setAttribute("aria-valuenow",String(state.phase+1));
    const panel=(label,title,body,extraClass="")=>'<section class="mc-panel '+extraClass+'"><span class="mc-kicker">'+esc(label)+'</span><h3>'+esc(title)+'</h3>'+body+'</section>';
    const shortLabels=["Story","Evidence","Maths","New clue","Question","Verdict","Reflection"];
    const tabs='<nav class="mc-stage-nav" aria-label="Case stage navigation">'+PHASE_LABELS.map((label,i)=>
      '<button type="button" class="mc-stage-tab '+(i===state.phase?'is-current':i<state.phase?'is-done':'is-upcoming')+'" data-phase="'+i+'" aria-label="Stage '+(i+1)+': '+esc(label)+'" '+(i===state.phase?'aria-current="step"':'')+' '+(i>state.phase?'disabled':'')+' onclick="MathCourt.reviewStage('+i+')"><span class="mc-stage-tab-number">'+(i<state.phase?'✓':i+1)+'</span><span>'+shortLabels[i]+'</span></button>'
    ).join("")+'</nav>';
    const claim='<div class="mc-claim"><span>CLAIM TO TEST</span><strong>'+esc(item.claim)+'</strong></div>';
    const evidencePair='<div class="mc-evidence-pair"><article class="mc-evidence-card mc-evidence-claim"><span>CLAIM</span><strong>'+esc(item.claim)+'</strong></article><article class="mc-evidence-card mc-evidence-record"><span>RECORD</span><strong>'+esc(item.evidence)+'</strong></article></div>';
    let content="",action="";
    if(state.phase===0) {
      content='<div class="mc-stage-layout mc-stage-layout--story">'+panel("CASE STORY",item.title,renderStoryNarrative(item)+claim,"mc-stage-story-card")+'<p class="mc-stage-nudge">Start with the story. Then compare its claim with the record.</p></div>';
      action='<button class="mc-button mc-button-primary" onclick="MathCourt.advance()">Compare the evidence →</button>';
    } else if(state.phase===1) {
      content='<div class="mc-stage-layout mc-stage-layout--evidence">'+panel("TWO THINGS TO COMPARE","What does the record actually show?",evidencePair+'<p class="mc-stage-nudge">Keep the claim and the record separate. The numbers will help you decide whether they agree.</p>')+'</div>';
      action='<button class="mc-button mc-button-primary" onclick="MathCourt.advance()">Open the maths workshop →</button>';
    } else if(state.phase===2) {
      let taskPanel="";
      if(!state.investigationSolved) {
        taskPanel=panel("TASK 1 OF 2","Find the first result",'<p class="mc-task-prompt">'+esc(item.prompt)+'</p>'+renderAnswerTiles(item.options,"investigation"),"mc-investigation-task-card");
      } else if(!state.challengeSolved) {
        taskPanel=panel("TASK 2 OF 2","Use the new clue",'<div class="mc-solution"><strong>First finding</strong><p>'+esc(item.explanation)+'</p></div><p class="mc-task-prompt">'+esc(item.challenge.prompt)+'</p>'+renderAnswerTiles(item.challenge.options,"challenge"),"mc-investigation-task-card");
      } else {
        taskPanel=panel("BOTH FINDINGS VERIFIED","You have your evidence",'<div class="mc-solution"><strong>Finding A</strong><p>'+esc(item.explanation)+'</p></div><div class="mc-solution"><strong>Finding B</strong><p>'+esc(item.challenge.explanation)+'</p></div><p class="mc-stage-nudge">Bring both findings into the next stage.</p>',"mc-investigation-task-card");
      }
      content='<div class="mc-stage-layout mc-stage-layout--investigation"><div class="mc-investigation-work">'+renderPlayActivity(item)+'</div><div class="mc-investigation-task">'+taskPanel+'</div></div>';
      action='<button class="mc-button mc-button-primary" '+(state.investigationSolved&&state.challengeSolved?'':'disabled')+' onclick="MathCourt.advance()">Bring both findings to court →</button><button class="mc-button mc-button-quiet" onclick="MathCourt.showHint()">Give me a hint</button>';
    } else if(state.phase===3) {
      content='<div class="mc-stage-layout mc-stage-layout--reveal">'+
        panel("NEW EVIDENCE","A detail has changed",'<p class="mc-story-text">'+esc(item.twist)+'</p><div class="mc-evidence-pair mc-evidence-pair-compact"><article class="mc-evidence-card"><span>ORIGINAL CLAIM</span><strong>'+esc(item.claim)+'</strong></article><article class="mc-evidence-card mc-evidence-record"><span>RECORD</span><strong>'+esc(item.evidence)+'</strong></article></div>')+
        panel("CHECK YOUR REASONING","Does the new detail matter?",'<p class="mc-stage-nudge">Use the two verified results and this new clue. It is thoughtful to revise an idea when better evidence arrives.</p>')+'</div>';
      action='<button class="mc-button mc-button-primary" onclick="MathCourt.advance()">Ask a careful question →</button>';
    } else if(state.phase===4) {
      const check=data().checks[item.check],rotated=rotatedChoices(check.choices,check.correct,item.id);
      content='<div class="mc-stage-layout mc-stage-layout--question">'+panel("CURIOSITY ROUND","Which question helps most?",'<p class="mc-task-prompt">'+esc(check.prompt)+'</p><div class="mc-answer-options">'+rotated.choices.map((opt,i)=>'<button class="mc-option" onclick="MathCourt.answerCross('+i+')"><span>'+String.fromCharCode(65+i)+'</span>'+esc(opt)+'</button>').join("")+'</div><p class="mc-stage-nudge">Choose a question that checks an assumption or clarifies the record respectfully.</p>')+'</div>';
      action='<button class="mc-button mc-button-primary" '+(state.crossSolved?'':'disabled')+' onclick="MathCourt.advance()">Prepare the verdict →</button>';
    } else if(state.phase===5) {
      const verdicts=[
        {id:"supported",label:"Supported",note:"The evidence supports the claim."},
        {id:"disproved",label:"Not supported",note:"The evidence does not fit the claim."},
        {id:"partly",label:"Partly supported",note:"Some parts fit, some need revision."},
        {id:"uncertain",label:"Need more evidence",note:"The record does not settle it yet."}
      ];
      content='<div class="mc-stage-layout mc-stage-layout--verdict">'+panel("YOUR CONCLUSION","Which verdict fits the evidence?",claim+'<div class="mc-verdict-options">'+verdicts.map(v=>'<button class="mc-verdict-button '+(state.verdictChosen===v.id?'is-selected':'')+'" data-verdict="'+v.id+'" aria-pressed="'+(state.verdictChosen===v.id)+'" onclick="MathCourt.selectVerdict(this.dataset.verdict)"><strong>'+v.label+'</strong><small>'+v.note+'</small></button>').join("")+'</div>')+'</div>';
      action='<button class="mc-button mc-button-primary" '+(state.verdictChosen&&normalVerdict(state.verdictChosen)===normalVerdict(item.verdict)?'':'disabled')+' onclick="MathCourt.advance()">Hear the reflection →</button>';
    } else {
      const verdictLabels={supported:"The evidence fits",disproved:"Let’s revise the idea",partly:"Some parts fit",uncertain:"Let’s gather one more clue"};
      const v=normalVerdict(item.verdict);
      content='<div class="mc-stage-layout mc-stage-layout--reflection">'+panel("MATHS RESULT",verdictLabels[v]||"Final result",'<div class="mc-solution"><strong>'+esc(item.claim)+'</strong><p>'+esc(item.explanation)+'</p></div><p class="mc-story-text">'+esc(item.moral||item.twist)+'</p>','mc-result-card')+'</div>';
      action='<button class="mc-button mc-button-primary" onclick="MathCourt.advance()">'+(item.id<100?'Open Case '+(item.id+1)+' →':'Celebrate the 100-case journey 🎉')+'</button><button class="mc-button mc-button-quiet" onclick="MathCourt.goDocket()">Return to the case map</button>';
    }
    host.innerHTML=tabs+'<section class="mc-active-stage mc-stage-phase-'+state.phase+'">'+content+'<div class="mc-stage-actions">'+action+(state.phase>0&&state.phase<6?'<button class="mc-button mc-button-quiet" onclick="MathCourt.previous()">← Review previous stage</button>':'')+'</div></section>';
    const feedback=$("mc-feedback");
    if(feedback){feedback.textContent=state.feedback;feedback.className="mc-feedback"+(state.feedback?" is-visible mc-feedback-"+state.feedbackKind:"");}
  }
  function showHint() {
    const item=data().getCase(state.caseId);
    setFeedback(hintFor(item),"hint");
  }
  function reviewStage(index) {
    if(!Number.isInteger(index)||index<0||index>state.phase||index>=PHASE_LABELS.length||index===state.phase)return;
    state.phase=index;state.feedback="";state.feedbackKind="";syncSession();renderCase();scrollCaseIntoView();
  }
  function previous() {if(state.phase>0)reviewStage(state.phase-1);}
  function resetProgress() {
    if(!window.confirm("Reset Math Court case progress on this device? This cannot be undone."))return;
    state.completed.clear();state.session=null;state.feedback="";persist();renderDocket();
  }
  root.MathCourt={open,openCase,resume,goDocket,back,advance,chooseEvidence,answerInvestigation,answerChallenge,answerCross,selectVerdict,showHint,previous,reviewStage,resetProgress,setVisualMode,focusVisual,startAnswerDrag,dropAnswer,chooseLabSlot,chooseLabNumber,chooseLabOperator,chooseLabOperator2,toggleThirdOperand,calculateLab,setPatternRule,submitPatternPrediction,checkPlayGoal,selectDataRecord,setFraction,toggleShapeCell,shapeStats,setLabTimeline,toggleDataZoom,setDataZoom:toggleDataZoom,setRuleInput,setRuleType,adjustShare,extendRoute,resetRoute,adjustAllocation,resetShape:function(){if(!state.lab.cells.length)return;state.lab.cells=[];markLabPlay();refreshCaseKeepingScroll();}};
})(window);
