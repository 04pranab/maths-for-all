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
  const cast = [
    {name:"Judge Mira",role:"Presiding judge",line:"We are here to test the claim, not to attack the people who made it."},
    {name:"Pip",role:"Court clerk",line:"I have put the source record and the claim on the evidence table."},
    {name:"Asha",role:"Senior advocate",line:"A good question narrows the problem. A good verdict explains what the evidence can actually show."},
    {name:"Dot",role:"Evidence bird",line:"Keep your eyes open. A small detail can change the whole case."}
  ];
  const state = {
    caseId:1, phase:0, seenClaim:false, seenEvidence:false,
    investigationSolved:false, challengeSolved:false, crossSolved:false, verdictChosen:null,
    visualMode:"model", visualFocus:0, completed:new Set(), session:null, feedback:"", feedbackKind:""
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
      visualMode:state.visualMode, visualFocus:state.visualFocus
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
    docket.innerHTML =
      '<div class="mc-docket-hero">' +
        '<div class="mc-eyebrow">COMMON GROUND COURT · THE CHARTER OF FAIR MEASURES</div>' +
        '<h2>One hundred claims. One careful advocate.</h2>' +
        '<p>Question witnesses, examine the numbers, respond to new evidence and deliver a reasoned verdict. Every case has a story and a different mathematical job.</p>' +
        '<div class="mc-progress-track" role="progressbar" aria-label="Cases completed" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+completed+'"><span style="width:'+completed+'%"></span></div>' +
        '<div class="mc-progress-caption"><strong>'+completed+' of 100 cases completed</strong><span>About 8–12 minutes per case · No countdown</span></div>' +
        '<div class="mc-hero-actions">' +
          (resume?'<button class="mc-button mc-button-primary" type="button" id="mc-resume" onclick="MathCourt.resume()">Resume Case '+resume.caseId+' →</button>':'<button class="mc-button mc-button-primary" type="button" onclick="MathCourt.openCase('+(next?next.id:1)+')">'+(next?'Begin Case '+next.id+' →':'Replay the first case →')+'</button>') +
          '<button class="mc-button mc-button-quiet" type="button" onclick="MathCourt.resetProgress()">Reset case progress</button>' +
        '</div>' +
      '</div>' +
      '<div class="mc-charter-note"><span aria-hidden="true">⚖️</span><p><strong>The court&#39;s rule:</strong> evidence matters, mistakes can be corrected, and a verdict must never claim more than the mathematics proves.</p></div>' +
      '<div class="mc-chapter-list">'+data().chapters.map(ch=>{
        const done=data().cases.filter(item=>item.chapter===ch.id&&state.completed.has(item.id)).length;
        const entries=data().cases.filter(item=>item.chapter===ch.id);
        return '<details class="mc-chapter" '+(ch.id===1?'open':'')+'><summary><span class="mc-chapter-number">'+String(ch.id).padStart(2,"0")+'</span><span class="mc-chapter-copy"><strong>'+esc(ch.name)+'</strong><small>'+esc(ch.theme)+'</small></span><span class="mc-chapter-progress">'+done+'/10</span></summary><div class="mc-case-grid">'+entries.map(item=>{
          const isDone=state.completed.has(item.id);
          const isResume=resume&&resume.caseId===item.id;
          return '<button type="button" class="mc-case-card '+(isDone?'is-complete':'')+(isResume?' is-resume':'')+'" onclick="MathCourt.openCase('+item.id+')"><span class="mc-case-number">'+String(item.id).padStart(3,"0")+'</span><strong>'+esc(item.title)+'</strong><span>'+esc(item.prompt)+'</span><small>'+(isDone?'✓ Verdict delivered':isResume?'↻ Resume investigation':'Open docket →')+'</small></button>';
        }).join("")+'</div></details>';
      }).join("")+'</div>';
    const resumeButton=$("mc-resume");
    if(resumeButton&&resume)resumeButton.hidden=false;
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
    state.feedback="";state.feedbackKind="";
    syncSession();
    const docket=$("mc-docket"),play=$("mc-play");
    if(docket)docket.hidden=true;if(play)play.hidden=false;
    renderCase();
    window.scrollTo(0,0);
  }
  function resume() {
    if(state.session)openCase(state.session.caseId);
    else openCase(data().cases.find(item=>!state.completed.has(item.id))?.id||1);
  }
  function back() { goDocket(); }
  function advance() {
    const item=data().getCase(state.caseId);
    if(state.phase===1&&!(state.seenClaim&&state.seenEvidence)){
      setFeedback("Examine both the claim and the source exhibit before proceeding.","hint");return;
    }
    if(state.phase===2&&!(state.investigationSolved&&state.challengeSolved)){setFeedback("Solve both linked mathematical tasks before admitting the exhibits. You can retry without losing progress.","hint");return;}
    if(state.phase===4&&!state.crossSolved){setFeedback("Choose the strongest line of cross-examination first.","hint");return;}
    if(state.phase===5&&!state.verdictChosen){setFeedback("Select a verdict and support it with what you have learned.","hint");return;}
    if(state.phase===5&&normalVerdict(state.verdictChosen)!==normalVerdict(item.verdict)){
      setFeedback("Reconsider the claim and the exhibits. You may revise your verdict.","hint");return;
    }
    if(state.phase<6){state.phase++;state.feedback="";state.feedbackKind="";syncSession();renderCase();window.scrollTo(0,0);return;}
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
  function answerInvestigation(index) {
    const item=data().getCase(state.caseId);
    if(index===item.answer){
      state.investigationSolved=true;setFeedback("Exhibit verified. "+item.explanation,"success");
    }else{
      setFeedback("That does not fit all the evidence yet. "+hintFor(item),"hint");
    }
    syncSession();renderCase();
  }
  function answerChallenge(index) {
    const item=data().getCase(state.caseId),challenge=item.challenge;
    if(index===challenge.answer){state.challengeSolved=true;setFeedback("Second exhibit verified. "+challenge.explanation,"success");}
    else{setFeedback("That result does not fit the second exhibit yet. Recheck the quantities and try again.","hint");}
    syncSession();renderCase();
  }
  function answerCross(index) {
    const item=data().getCase(state.caseId),check=data().checks[item.check];
    const rotated=rotatedChoices(check.choices,check.correct,item.id);
    if(index===rotated.correct){state.crossSolved=true;setFeedback("Objection sustained. You tested the reasoning instead of judging the speaker.","success");}
    else{setFeedback("That approach leaves an important gap. Look for a check that tests the claim, not the person.","hint");}
    syncSession();renderCase();
  }
  function selectVerdict(id) {
    const item=data().getCase(state.caseId);
    if(normalVerdict(id)===normalVerdict(item.verdict)){
      state.verdictChosen=id;
      setFeedback("The verdict matches the case record. Read the ruling and the limits of what the evidence proves.","success");
    }else{
      state.verdictChosen=null;
      setFeedback("The claim, calculation and new evidence do not line up with that verdict yet. Reconsider before deciding.","hint");
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
      [{id:"model",label:"Build the model"},{id:"compare",label:"Compare values"},{id:"trace",label:"Trace the evidence"}].map(t=>'<button type="button" class="mc-visual-tab '+(mode===t.id?'is-active':'')+'" aria-pressed="'+(mode===t.id?'true':'false')+'" onclick="MathCourt.setVisualMode(\\''+t.id+'\\')">'+t.label+'</button>').join("")+
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

  function renderCase() {
    const item=data().getCase(state.caseId),host=$("mc-stage-content");
    if(!item||!host)return;
    $("mc-docket").hidden=true;$("mc-play").hidden=false;
    $("mc-case-title").textContent="Case "+String(item.id).padStart(3,"0")+" · "+item.title;
    $("mc-case-chapter").textContent=data().chapters.find(ch=>ch.id===item.chapter).name;
    $("mc-stage-name").textContent=PHASE_LABELS[state.phase];
    $("mc-stage-count").textContent="Proceeding "+(state.phase+1)+" of 7";
    $("mc-stage-fill").style.width=((state.phase+1)/7*100)+"%";
    $("mc-stage-fill").parentElement.setAttribute("aria-valuenow",String(state.phase+1));
    $("mc-feedback").textContent=state.feedback;
    $("mc-feedback").className="mc-feedback"+(state.feedback?" is-visible mc-feedback-"+state.feedbackKind:"");
    const actor=cast[(item.id+state.phase)%cast.length];
    const actorBlock='<div class="mc-speaker"><span class="mc-avatar" aria-hidden="true">'+["⚖️","📁","🧭","🐦"][(item.id+state.phase)%4]+'</span><div><strong>'+actor.name+'</strong><small>'+actor.role+'</small></div></div>';
    const panel=(label,title,body)=>'<section class="mc-panel"><span class="mc-kicker">'+label+'</span><h3>'+title+'</h3>'+body+'</section>';
    let html=actorBlock;
    let action="";
    if(state.phase===0){
      html+=panel("THE CASE IS CALLED", "What has the court been asked to decide?",'<p>'+esc(item.story)+'</p><div class="mc-claim"><span>CLAIM BEFORE THE COURT</span><strong>'+esc(item.claim)+'</strong></div><div class="mc-two-facts"><div><small>Mathematical focus</small><strong>'+esc(topicFor(item.check,item.chapter))+'</strong></div><div><small>Case file</small><strong>'+String(item.id).padStart(3,"0")+' / 100</strong></div></div>');
      html+=renderVisualBoard(item);
      action='<button class="mc-button mc-button-primary" onclick="MathCourt.advance()">Call the witnesses →</button>';
    } else if(state.phase===1) {
      html+=panel("WITNESS EXAMINATION","Ask for the record before deciding",'<p>The witness is confident, but confidence is not a substitute for evidence. Open both cards to hear the claim precisely and inspect the source exhibit.</p><div class="mc-evidence-actions"><button class="mc-evidence-button '+(state.seenClaim?'is-open':'')+'" onclick="MathCourt.chooseEvidence(\'claim\')"><span>01</span><strong>Clarify the claim</strong><small>'+(state.seenClaim?'✓ Examined':'Ask what is being asserted')+'</small></button><button class="mc-evidence-button '+(state.seenEvidence?'is-open':'')+'" onclick="MathCourt.chooseEvidence(\'evidence\')"><span>02</span><strong>Inspect Exhibit A</strong><small>'+(state.seenEvidence?'✓ Examined':'Open the original record')+'</small></button></div>'+(state.seenClaim?'<blockquote class="mc-testimony"><b>Claim clarified:</b> '+esc(item.claim)+'</blockquote>':'')+(state.seenEvidence?'<blockquote class="mc-testimony"><b>Exhibit A:</b> '+esc(item.evidence)+'</blockquote>':''));
      action='<button class="mc-button mc-button-primary" '+(state.seenClaim&&state.seenEvidence?'':'disabled')+' onclick="MathCourt.advance()">Build the mathematical exhibit →</button>';
    } else if(state.phase===2) {
      html+=renderVisualBoard(item);
      if(!state.investigationSolved) {
        html+=panel("BUILD THE EVIDENCE · TASK 1 OF 2","Solve the first mathematical exhibit",'<p>'+esc(item.prompt)+'</p>'+renderAnswerTiles(item.options,"investigation")+'<p class="mc-soft-note">Work it out, then choose an answer. You can retry without losing progress.</p>');
      } else if(!state.challengeSolved) {
        html+=panel("BUILD THE EVIDENCE · TASK 2 OF 2","Test the finding with a second case-linked challenge",'<div class="mc-solution"><strong>First exhibit admitted</strong><p>'+esc(item.explanation)+'</p></div><p>'+esc(item.challenge.prompt)+'</p>'+renderAnswerTiles(item.challenge.options,"challenge")+'<p class="mc-soft-note">Use the first result as evidence, then check what follows from it.</p>');
      } else {
        html+=panel("BOTH EXHIBITS ADMITTED","The mathematical evidence is ready",'<div class="mc-solution"><strong>Exhibit A · Main finding</strong><p>'+esc(item.explanation)+'</p></div><div class="mc-solution"><strong>Exhibit B · Follow-up check</strong><p>'+esc(item.challenge.explanation)+'</p></div><p class="mc-soft-note">Two linked checks give the court a stronger foundation than a single answer.</p>');
      }
      action='<button class="mc-button mc-button-primary" '+(state.investigationSolved&&state.challengeSolved?'':'disabled')+' onclick="MathCourt.advance()">Admit both exhibits and hear new evidence →</button><button class="mc-button mc-button-quiet" onclick="MathCourt.showHint()">Give me a hint</button>';
    } else if(state.phase===3) {
      html+=panel("NEW EVIDENCE · THE TWIST","The case changes",'<div class="mc-twist-mark" aria-hidden="true">!</div><p>'+esc(item.twist)+'</p><div class="mc-claim mc-claim-soft"><span>THE MATHEMATICAL FINDING SO FAR</span><strong>'+esc(item.explanation)+'</strong></div><p class="mc-soft-note">A responsible advocate can change their mind when evidence changes. The court records what the new evidence adds, not what it wishes had happened.</p>');
      action='<button class="mc-button mc-button-primary" onclick="MathCourt.advance()">Cross-examine the reasoning →</button>';
    } else if(state.phase===4) {
      const check=data().checks[item.check],rotated=rotatedChoices(check.choices,check.correct,item.id);
      html+=panel("CROSS-EXAMINATION","Which question tests the reasoning?",'<p>'+esc(check.prompt)+'</p><div class="mc-answer-options">'+rotated.choices.map((opt,i)=>'<button class="mc-option" onclick="MathCourt.answerCross('+i+')"><span>'+String.fromCharCode(65+i)+'</span>'+esc(opt)+'</button>').join("")+'</div><p class="mc-soft-note">Challenge the claim or the method. Do not attack the person who made it.</p>');
      action='<button class="mc-button mc-button-primary" '+(state.crossSolved?'':'disabled')+' onclick="MathCourt.advance()">Present your closing argument →</button>';
    } else if(state.phase===5) {
      html+=panel("CLOSING ARGUMENT","Deliver a reasoned verdict",'<p>Compare the original claim with the mathematical result and the new evidence. Choose the conclusion that says exactly what the case establishes.</p><div class="mc-verdict-options">'+VERDICT_CHOICES.map(v=>'<button class="mc-verdict-button" onclick="MathCourt.selectVerdict(\''+v.id+'\')"><strong>'+esc(v.label)+'</strong><small>'+esc(v.note)+'</small></button>').join("")+'</div>');
      action='<button class="mc-button mc-button-primary" '+(state.verdictChosen&&normalVerdict(state.verdictChosen)===normalVerdict(item.verdict)?'':'disabled')+' onclick="MathCourt.advance()">Deliver the ruling →</button>';
    } else {
      const v=VERDICT_CHOICES.find(v=>v.id===normalVerdict(item.verdict))||VERDICT_CHOICES[3];
      html+=panel("THE COURT&#39;S REFLECTION","Case closed: "+esc(v.label),'<div class="mc-verdict-ribbon"><span aria-hidden="true">⚖️</span><div><strong>'+esc(v.label)+'</strong><p>'+esc(v.note)+'</p></div></div><h4>What the mathematics showed</h4><p>'+esc(item.explanation)+'</p><h4>What the new evidence changed</h4><p>'+esc(item.twist)+'</p><div class="mc-value-note"><span aria-hidden="true">🌱</span><div><strong>Beyond the calculation</strong><p>'+esc(item.moral)+'</p></div></div><p class="mc-soft-note">You may be right to change a first impression. The court values clear evidence, honest uncertainty and respectful reasoning.</p>');
      action='<button class="mc-button mc-button-primary" onclick="MathCourt.advance()">'+(item.id<100?'Close case and call Case '+(item.id+1)+' →':'Close the High Court season →')+'</button><button class="mc-button mc-button-quiet" onclick="MathCourt.goDocket()">Return to all cases</button>';
    }
    host.innerHTML='<div class="mc-phase-card">'+html+'</div><div class="mc-play-actions">'+action+'<button class="mc-button mc-button-quiet" onclick="MathCourt.back()">← Docket</button>'+(state.phase>0?'<button class="mc-button mc-button-quiet" onclick="MathCourt.previous()">Review previous step</button>':'')+'</div>';
    if(state.feedback){$("mc-feedback").textContent=state.feedback;$("mc-feedback").className="mc-feedback is-visible mc-feedback-"+state.feedbackKind;}
  }
  function topicFor(check,chapter) {
    const topics={calculation:"Calculation and verification",records:"Records and data integrity",assumptions:"Assumptions and modelling",definition:"Mathematical definitions",comparison:"Fair comparison",units:"Units and precision",constraints:"Constraints and optimisation",representation:"Graphs and representation",sample:"Sampling and statistics",causation:"Causation and evidence",logic:"Logic and conditions"};
    return topics[check]||data().chapters.find(ch=>ch.id===chapter).theme;
  }
  function showHint() {
    const item=data().getCase(state.caseId);
    setFeedback(hintFor(item),"hint");
  }
  function previous() {
    if(state.phase>0){state.phase--;state.feedback="";state.feedbackKind="";syncSession();renderCase();}
  }
  function resetProgress() {
    if(!window.confirm("Reset Math Court case progress on this device? This cannot be undone."))return;
    state.completed.clear();state.session=null;state.feedback="";persist();renderDocket();
  }
  root.MathCourt={open,openCase,resume,goDocket,back,advance,chooseEvidence,answerInvestigation,answerChallenge,answerCross,selectVerdict,showHint,previous,resetProgress,setVisualMode,focusVisual,startAnswerDrag,dropAnswer};
})(window);
