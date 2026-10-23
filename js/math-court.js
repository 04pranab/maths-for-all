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
    state.lab=saved&&saved.lab?normaliseLab(saved.lab,item):freshLab(item);
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


  function freshLab(item) {
    const nums=visualNumbers(item);
    return {
      slot:"a",a:nums[0]===undefined?3:nums[0],b:nums[1]===undefined?2:nums[1],op:"-",
      calculationResult:null,patternRule:"add3",fractionNumerator:3,fractionDenominator:8,
      cells:[0,1,2,8,9,10],timelineMinutes:30,dataZoom:false,ruleInput:4,ruleType:"doublePlusOne",
      shares:[3,2,4],route:[0],allocations:[3,3,2],note:""
    };
  }
  function normaliseLab(saved,item) {
    const base=freshLab(item);
    const lab={...base,...saved};
    lab.slot=lab.slot==="b"?"b":"a";
    lab.op=["+","-","×","÷"].includes(lab.op)?lab.op:"-";
    lab.patternRule=["add1","add2","add3","double"].includes(lab.patternRule)?lab.patternRule:"add3";
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
  function refreshCaseKeepingScroll() {
    const host=$("mc-stage-content");
    const left=host&&host.querySelector(".mc-story-pane");
    const right=host&&host.querySelector(".mc-game-pane");
    const leftTop=left?left.scrollTop:0,rightTop=right?right.scrollTop:0;
    syncSession();
    renderCase();
    const newLeft=host&&host.querySelector(".mc-story-pane");
    const newRight=host&&host.querySelector(".mc-game-pane");
    if(newLeft)newLeft.scrollTop=leftTop;
    if(newRight)newRight.scrollTop=rightTop;
  }
  function chooseLabSlot(slot) {
    if(!["a","b"].includes(slot))return;
    state.lab.slot=slot;refreshCaseKeepingScroll();
  }
  function chooseLabNumber(index) {
    const item=data().getCase(state.caseId),nums=visualNumbers(item);
    if(!Number.isInteger(index)||index<0||index>=nums.length)return;
    state.lab[state.lab.slot]=nums[index];
    state.lab.calculationResult=null;
    state.lab.note="Number tile placed in Slot "+state.lab.slot.toUpperCase()+".";
    refreshCaseKeepingScroll();
  }
  function chooseLabOperator(op) {
    if(!["+","-","×","÷"].includes(op))return;
    state.lab.op=op;state.lab.calculationResult=null;refreshCaseKeepingScroll();
  }
  function calculateLab() {
    const {a,b,op}=state.lab;
    if(a===null||b===null||b===0&&op==="÷"){state.lab.note="Choose two values that make a defined calculation.";state.lab.calculationResult=null;refreshCaseKeepingScroll();return;}
    const result=op==="+"?a+b:op==="-"?a-b:op==="×"?a*b:a/b;
    state.lab.calculationResult=Number.isFinite(result)?Number(result.toFixed(4)):null;
    state.lab.note=state.lab.calculationResult===null?"Choose a defined calculation.":"Your model gives "+state.lab.calculationResult+". Explain how the quantities connect.";
    refreshCaseKeepingScroll();
  }
  function setPatternRule(rule) {
    if(!["add1","add2","add3","double"].includes(rule))return;
    state.lab.patternRule=rule;refreshCaseKeepingScroll();
  }
  function setFraction(which,delta) {
    if(which==="numerator")state.lab.fractionNumerator=Math.max(0,Math.min(state.lab.fractionDenominator,state.lab.fractionNumerator+delta));
    if(which==="denominator"){
      const choices=[2,3,4,6,8,10,12],i=choices.indexOf(state.lab.fractionDenominator);
      const next=Math.max(0,Math.min(choices.length-1,i+delta));
      state.lab.fractionDenominator=choices[next];
      state.lab.fractionNumerator=Math.min(state.lab.fractionNumerator,state.lab.fractionDenominator);
    }
    refreshCaseKeepingScroll();
  }
  function toggleShapeCell(index) {
    if(!Number.isInteger(index)||index<0||index>=48)return;
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
    state.lab.timelineMinutes=Math.max(0,Math.min(180,Number(value)||0));refreshCaseKeepingScroll();
  }
  function toggleDataZoom() {
    state.lab.dataZoom=!state.lab.dataZoom;refreshCaseKeepingScroll();
  }
  function setRuleInput(value) {
    state.lab.ruleInput=Math.max(1,Math.min(12,Number(value)||1));refreshCaseKeepingScroll();
  }
  function setRuleType(rule) {
    if(!["doublePlusOne","add3","triple","square"].includes(rule))return;
    state.lab.ruleType=rule;refreshCaseKeepingScroll();
  }
  function adjustShare(group,delta) {
    if(!Number.isInteger(group)||group<0||group>2)return;
    state.lab.shares[group]=Math.max(0,Math.min(15,state.lab.shares[group]+delta));
    refreshCaseKeepingScroll();
  }
  const routeEdges=[[0,1,4],[1,2,5],[0,3,2],[3,4,3],[4,2,2],[1,4,4]];
  function routeEdge(a,b) {return routeEdges.find(e=>(e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a));}
  function extendRoute(node) {
    const route=state.lab.route;
    if(node===route[route.length-2]){route.pop();refreshCaseKeepingScroll();return;}
    if(node===route[route.length-1])return;
    if(route.includes(node)){state.lab.note="Try a fresh route without revisiting a stop.";setFeedback(state.lab.note,"hint");refreshCaseKeepingScroll();return;}
    if(!routeEdge(route[route.length-1],node)){state.lab.note="Choose a connected stop. The roads show where you can travel next.";setFeedback(state.lab.note,"hint");refreshCaseKeepingScroll();return;}
    route.push(node);state.lab.note="Route extended. Add up the road lengths to compare journeys.";refreshCaseKeepingScroll();
  }
  function resetRoute() {state.lab.route=[0];state.lab.note="Begin at A and build a connected route.";refreshCaseKeepingScroll();}
  function adjustAllocation(group,delta) {
    if(!Number.isInteger(group)||group<0||group>2)return;
    const next=state.lab.allocations[group]+delta;
    const total=state.lab.allocations.reduce((sum,n)=>sum+n,0);
    if(next<0||next>12||delta>0&&total>=12)return;
    state.lab.allocations[group]=next;refreshCaseKeepingScroll();
  }
  function formatClock(minutes) {
    const value=((minutes%1440)+1440)%1440,hour=Math.floor(value/60),minute=value%60;
    return ((hour%12)||12)+":"+String(minute).padStart(2,"0")+" "+(hour<12?"AM":"PM");
  }
  function renderNumberForge(item) {
    const vals=visualNumbers(item).slice(0,5),lab=state.lab;
    const shown=lab.calculationResult===null?"?":String(lab.calculationResult);
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>🧱 NUMBER FORGE</span><h3>Build a calculation</h3><p>Choose a slot, place two number tiles and pick the operation that connects them.</p></div>'+
      '<div class="mc-equation-board"><button class="mc-equation-slot '+(lab.slot==="a"?"is-selected":"")+'" data-slot="a" onclick="MathCourt.chooseLabSlot(this.dataset.slot)"><small>SLOT A</small><strong>'+esc(String(lab.a))+'</strong></button>'+
      '<div class="mc-equation-operation">'+esc(lab.op)+'</div><button class="mc-equation-slot '+(lab.slot==="b"?"is-selected":"")+'" data-slot="b" onclick="MathCourt.chooseLabSlot(this.dataset.slot)"><small>SLOT B</small><strong>'+esc(String(lab.b))+'</strong></button>'+
      '<div class="mc-equation-equals">=</div><div class="mc-equation-result"><small>YOUR RESULT</small><strong>'+shown+'</strong></div></div>'+
      '<div class="mc-number-pool">'+vals.map((n,i)=>'<button type="button" class="mc-number-tile" onclick="MathCourt.chooseLabNumber('+i+')">'+esc(String(n))+'</button>').join("")+'</div>'+
      '<div class="mc-operation-picker">'+["+","-","×","÷"].map(op=>'<button type="button" class="mc-op-tile '+(lab.op===op?"is-selected":"")+'" data-op="'+op+'" onclick="MathCourt.chooseLabOperator(this.dataset.op)">'+esc(op)+'</button>').join("")+
      '<button type="button" class="mc-button mc-button-primary mc-build-button" onclick="MathCourt.calculateLab()">Calculate it ✨</button></div>'+
      '<p class="mc-play-feedback" aria-live="polite">'+esc(lab.note||"Try different combinations and notice how the result changes.")+'</p></section>';
  }
  function renderPatternGarden(item) {
    const vals=visualNumbers(item).slice(0,4),lab=state.lab,last=vals[vals.length-1]||5;
    const step=lab.patternRule==="add1"?1:lab.patternRule==="add2"?2:lab.patternRule==="add3"?3:null;
    const next=step===null?last*2:last+step;
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>🌱 PATTERN GARDEN</span><h3>Grow the next number</h3><p>Change the rule and watch how the number path grows.</p></div>'+
      '<div class="mc-pattern-path">'+vals.map((n,i)=>'<div class="mc-pattern-stone"><small>'+String(i+1).padStart(2,"0")+'</small><strong>'+esc(String(n))+'</strong></div>').join("")+'<div class="mc-pattern-stone mc-pattern-next"><small>NEXT</small><strong>'+esc(String(next))+'</strong></div></div>'+
      '<div class="mc-rule-tiles">'+[{id:"add1",label:"+ 1"},{id:"add2",label:"+ 2"},{id:"add3",label:"+ 3"},{id:"double",label:"× 2"}].map(r=>'<button class="mc-op-tile '+(lab.patternRule===r.id?"is-selected":"")+'" data-rule="'+r.id+'" onclick="MathCourt.setPatternRule(this.dataset.rule)">'+r.label+'</button>').join("")+'</div>'+
      '<p class="mc-play-feedback">Rule selected: '+(step===null?"double the last value":"add "+step)+" · next value = "+next+'</p></section>';
  }
  function renderFractionStudio() {
    const lab=state.lab,den=lab.fractionDenominator,num=lab.fractionNumerator;
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>🍰 FRACTION STUDIO</span><h3>Share the whole</h3><p>Change the number of equal parts and shade how many belong in your share.</p></div>'+
      '<div class="mc-fraction-strip" role="img" aria-label="'+num+' of '+den+' equal parts selected">'+Array.from({length:den},(_,i)=>'<button type="button" class="mc-fraction-part '+(i<num?"is-filled":"")+'" aria-label="Part '+(i+1)+'" data-which="numerator" data-delta="'+(i<num?-1:1)+'" onclick="MathCourt.setFraction(this.dataset.which,Number(this.dataset.delta))"></button>').join("")+'</div>'+
      '<div class="mc-fraction-equation"><strong>'+num+'/'+den+'</strong><span>of one whole</span><strong>'+Math.round(num/den*100)+'%</strong></div>'+
      '<div class="mc-play-control-row"><span>Shade parts</span><button class="mc-stepper" data-which="numerator" data-delta="-1" onclick="MathCourt.setFraction(this.dataset.which,-1)" aria-label="One fewer shaded part">−</button><button class="mc-stepper" data-which="numerator" data-delta="1" onclick="MathCourt.setFraction(this.dataset.which,1)" aria-label="One more shaded part">+</button></div>'+
      '<div class="mc-play-control-row"><span>Equal slices</span><button class="mc-stepper" data-which="denominator" data-delta="-1" onclick="MathCourt.setFraction(this.dataset.which,-1)" aria-label="Fewer equal parts">−</button><strong>'+den+'</strong><button class="mc-stepper" data-which="denominator" data-delta="1" onclick="MathCourt.setFraction(this.dataset.which,1)" aria-label="More equal parts">+</button></div></section>';
  }
  function renderShapeWorkshop() {
    const stats=shapeStats();
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>🧩 SHAPE WORKSHOP</span><h3>Build a shape, discover its measures</h3><p>Tap squares to add or remove them. Compare the inside space with the outside edge.</p></div>'+
      '<div class="mc-shape-builder" role="group" aria-label="48-square shape builder">'+Array.from({length:48},(_,i)=>'<button type="button" class="mc-shape-cell '+(state.lab.cells.includes(i)?"is-filled":"")+'" aria-label="Grid square '+(i+1)+'" aria-pressed="'+state.lab.cells.includes(i)+'" onclick="MathCourt.toggleShapeCell('+i+')"></button>').join("")+'</div>'+
      '<div class="mc-shape-stats"><div><small>AREA</small><strong>'+stats.area+'</strong><span>square units</span></div><div><small>PERIMETER</small><strong>'+stats.perimeter+'</strong><span>edge units</span></div></div>'+
      '<button class="mc-button mc-button-quiet" onclick="MathCourt.resetShape()">Start a fresh shape ↻</button></section>';
  }
  function renderTimeline() {
    const mins=state.lab.timelineMinutes,start=14*60+35,end=start+mins;
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>⏱️ TIMELINE STUDIO</span><h3>Move through time</h3><p>Slide the marker and see how minutes change the arrival time.</p></div>'+
      '<div class="mc-timeline-track"><span class="mc-time-start">'+formatClock(start)+'</span><div class="mc-time-rail"><span style="width:'+Math.min(100,mins/180*100)+'%"></span><i style="left:'+Math.min(100,mins/180*100)+'%"></i></div><span class="mc-time-end">'+formatClock(end)+'</span></div>'+
      '<div class="mc-time-result"><small>TRAVEL TIME</small><strong>'+mins+' minutes</strong><span>'+Math.floor(mins/60)+' hour'+(Math.floor(mins/60)===1?"":"s")+' and '+(mins%60)+' minutes</span></div>'+
      '<label class="mc-range-label" for="mc-timeline-range">Move the journey marker</label><input id="mc-timeline-range" class="mc-range" type="range" min="0" max="180" step="5" value="'+mins+'" oninput="MathCourt.setLabTimeline(this.value)"/></section>';
  }
  function renderDataGarden(item) {
    const vals=visualNumbers(item).slice(0,4).map(n=>Math.abs(n));
    const min=Math.min(...vals),max=Math.max(...vals),base=state.lab.dataZoom?Math.max(0,min-10):0,range=Math.max(1,max-base);
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>📊 DATA GARDEN</span><h3>See how a graph tells its story</h3><p>Change the graph's starting point. The data stay the same, but the visual impression changes.</p></div>'+
      '<div class="mc-data-chart" role="img" aria-label="Bar chart with '+(state.lab.dataZoom?"zoomed":"zero")+' baseline">'+vals.map((n,i)=>'<div class="mc-data-bar-wrap"><strong>'+n+'</strong><div class="mc-data-bar-track"><span style="height:'+Math.max(4,(n-base)/range*100)+'%"></span></div><small>Record '+(i+1)+'</small></div>').join("")+'</div>'+
      '<div class="mc-chart-scale-label">Scale starts at <strong>'+base+'</strong></div><div class="mc-rule-tiles"><button class="mc-op-tile '+(!state.lab.dataZoom?"is-selected":"")+'" onclick="MathCourt.setDataZoom(false)">Start at zero</button><button class="mc-op-tile '+(state.lab.dataZoom?"is-selected":"")+'" onclick="MathCourt.setDataZoom(true)">Zoom in</button></div>'+
      '<p class="mc-play-feedback">'+(state.lab.dataZoom?"Zooming in highlights small gaps; disclose the scale so readers can judge fairly.":"A zero baseline makes the full bar lengths easier to compare.")+'</p></section>';
  }
  function renderRuleMachine() {
    const lab=state.lab,x=lab.ruleInput,y=lab.ruleType==="doublePlusOne"?2*x+1:lab.ruleType==="add3"?x+3:lab.ruleType==="triple"?3*x:x*x;
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>⚙️ RULE MACHINE</span><h3>Feed a number into the machine</h3><p>Choose a rule, then move the input to watch the output update.</p></div>'+
      '<div class="mc-machine-flow"><div class="mc-machine-box"><small>INPUT</small><strong>'+x+'</strong></div><div class="mc-machine-arrow">→</div><div class="mc-machine-box mc-machine-core"><small>RULE</small><strong>'+(lab.ruleType==="doublePlusOne"?"2x + 1":lab.ruleType==="add3"?"x + 3":lab.ruleType==="triple"?"3x":"x²")+'</strong></div><div class="mc-machine-arrow">→</div><div class="mc-machine-box"><small>OUTPUT</small><strong>'+y+'</strong></div></div>'+
      '<label class="mc-range-label" for="mc-rule-input">Change input</label><input id="mc-rule-input" class="mc-range" type="range" min="1" max="12" value="'+x+'" oninput="MathCourt.setRuleInput(this.value)"/>'+
      '<div class="mc-rule-tiles">'+[{id:"doublePlusOne",label:"2x + 1"},{id:"add3",label:"x + 3"},{id:"triple",label:"3x"},{id:"square",label:"x²"}].map(r=>'<button class="mc-op-tile '+(lab.ruleType===r.id?"is-selected":"")+'" data-rule="'+r.id+'" onclick="MathCourt.setRuleType(this.dataset.rule)">'+r.label+'</button>').join("")+'</div>'+
      '<p class="mc-play-feedback">'+y+' comes from applying '+(lab.ruleType==="doublePlusOne"?"2 × "+x+" + 1":lab.ruleType==="add3"?x+" + 3":lab.ruleType==="triple"?"3 × "+x:x+" × "+x)+'.</p></section>';
  }
  function renderShareMarket() {
    const shares=state.lab.shares,total=shares.reduce((s,n)=>s+n,0),gap=Math.max(...shares)-Math.min(...shares);
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>🫶 FAIR-SHARE MARKET</span><h3>Share the counters</h3><p>Move the number up or down for each group. Watch the total and compare the shares.</p></div>'+
      '<div class="mc-share-groups">'+shares.map((n,i)=>'<div class="mc-share-group"><strong>Group '+String.fromCharCode(65+i)+'</strong><div class="mc-share-dots">'+Array.from({length:n},()=>'<i aria-hidden="true"></i>').join("")+'</div><div class="mc-share-adjust"><button class="mc-stepper" onclick="MathCourt.adjustShare('+i+',-1)" aria-label="Give one fewer counter to group '+String.fromCharCode(65+i)+'">−</button><strong>'+n+'</strong><button class="mc-stepper" onclick="MathCourt.adjustShare('+i+',1)" aria-label="Give one more counter to group '+String.fromCharCode(65+i)+'">+</button></div></div>').join("")+'</div>'+
      '<div class="mc-shares-summary"><span>Total counters <strong>'+total+'</strong></span><span>Largest gap <strong>'+gap+'</strong></span></div>'+
      '<p class="mc-play-feedback">'+(gap===0?"Every group has an equal share. Now consider whether the situation asks for equal shares or needs-based shares.":"The groups have different amounts. Decide whether equal shares or another stated rule best fits the situation.")+'</p></section>';
  }
  function renderRouteGarden() {
    const route=state.lab.route,total=route.slice(1).reduce((sum,n,i)=>sum+(routeEdge(route[i],n)||[0,0,0])[2],0);
    const nodes=[[55,70],[182,40],[306,74],[94,170],[242,166]],labels=["A","B","C","D","E"];
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>🗺️ ROUTE GARDEN</span><h3>Build a journey across town</h3><p>Start at A and choose a connected stop. Every road adds to your journey length.</p></div>'+
      '<svg viewBox="0 0 360 220" class="mc-route-map" role="img" aria-label="Five-stop route network">'+routeEdges.map(e=>'<line x1="'+nodes[e[0]][0]+'" y1="'+nodes[e[0]][1]+'" x2="'+nodes[e[1]][0]+'" y2="'+nodes[e[1]][1]+'" class="'+(route.some((n,i)=>i<route.length-1&&routeEdge(n,route[i+1])===e)?"mc-route-selected":"")+'"/><text x="'+((nodes[e[0]][0]+nodes[e[1]][0])/2)+'" y="'+((nodes[e[0]][1]+nodes[e[1]][1])/2-7)+'">'+e[2]+'</text>').join("")+nodes.map((n,i)=>'<g class="mc-route-node '+(route.includes(i)?"is-visited":"")+'"><circle cx="'+n[0]+'" cy="'+n[1]+'" r="20"/><text x="'+n[0]+'" y="'+(n[1]+5)+'" class="mc-route-label">'+labels[i]+'</text></g>').join("")+'</svg>'+
      '<div class="mc-route-buttons">'+labels.map((label,i)=>'<button class="mc-route-choice '+(route[route.length-1]===i?"is-current":"")+'" onclick="MathCourt.extendRoute('+i+')">'+label+'</button>').join("")+'</div>'+
      '<div class="mc-shares-summary"><span>Stops <strong>'+route.map(n=>labels[n]).join(" → ")+'</strong></span><span>Journey length <strong>'+total+'</strong></span></div>'+
      '<button class="mc-button mc-button-quiet" onclick="MathCourt.resetRoute()">New journey ↻</button></section>';
  }
  function renderTownPlanner() {
    const allocations=state.lab.allocations,total=allocations.reduce((s,n)=>s+n,0),budget=12;
    return '<section class="mc-math-play"><div class="mc-play-heading"><span>🏡 TOWN PLANNER</span><h3>Plan with a shared budget</h3><p>Allocate twelve resource tokens to three neighbourhoods and keep the total within the limit.</p></div>'+
      '<div class="mc-resource-bar"><span style="width:'+(total/budget*100)+'%"></span></div><p class="mc-budget-label">'+total+' of '+budget+' tokens planned · '+(budget-total)+' still available</p>'+
      '<div class="mc-town-bins">'+allocations.map((n,i)=>'<div class="mc-town-bin"><strong>Town '+String.fromCharCode(65+i)+'</strong><div class="mc-town-tokens">'+Array.from({length:n},()=>'<i></i>').join("")+'</div><div class="mc-share-adjust"><button class="mc-stepper" onclick="MathCourt.adjustAllocation('+i+',-1)" aria-label="Remove a token from town '+String.fromCharCode(65+i)+'">−</button><strong>'+n+'</strong><button class="mc-stepper" '+(total>=budget?'disabled':'')+' onclick="MathCourt.adjustAllocation('+i+',1)" aria-label="Add a token to town '+String.fromCharCode(65+i)+'">+</button></div></div>').join("")+'</div>'+
      '<p class="mc-play-feedback">'+(total===budget?"All tokens are allocated. Explain why your plan is fair and how it meets the stated needs.":"You have "+(budget-total)+" tokens left. Choose where they would help most, and explain your reasoning.")+'</p></section>';
  }
  function renderPlayActivity(item) {
    const activity=item.chapter===1?renderNumberForge(item):item.chapter===2?renderPatternGarden(item):item.chapter===3?renderFractionStudio():item.chapter===4?renderShapeWorkshop():item.chapter===5?renderTimeline():item.chapter===6?renderDataGarden(item):item.chapter===7?renderRuleMachine():item.chapter===8?renderShareMarket():item.chapter===9?renderRouteGarden():renderTownPlanner();
    return '<div class="mc-play-station"><div class="mc-station-top"><span>✨ PLAY & DISCOVER</span><span>CHAPTER '+String(item.chapter).padStart(2,"0")+'</span></div>'+activity+'</div>';
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
  root.MathCourt={open,openCase,resume,goDocket,back,advance,chooseEvidence,answerInvestigation,answerChallenge,answerCross,selectVerdict,showHint,previous,resetProgress,setVisualMode,focusVisual,startAnswerDrag,dropAnswer,chooseLabSlot,chooseLabNumber,chooseLabOperator,calculateLab,setPatternRule,setFraction,toggleShapeCell,shapeStats,setLabTimeline,toggleDataZoom,setDataZoom:toggleDataZoom,setRuleInput,setRuleType,adjustShare,extendRoute,resetRoute,adjustAllocation,resetShape:function(){state.lab.cells=[];refreshCaseKeepingScroll();}};
})(window);
