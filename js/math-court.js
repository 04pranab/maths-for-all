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
    investigationSolved:false, crossSolved:false, verdictChosen:null,
    completed:new Set(), session:null, feedback:"", feedbackKind:""
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
      crossSolved:state.crossSolved, verdictChosen:state.verdictChosen
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
    state.crossSolved=saved?saved.crossSolved:false;
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
    if(state.phase===2&&!state.investigationSolved){setFeedback("Solve the mathematical exhibit first. You can try again without losing progress.","hint");return;}
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
      action='<button class="mc-button mc-button-primary" onclick="MathCourt.advance()">Call the witnesses →</button>';
    } else if(state.phase===1) {
      html+=panel("WITNESS EXAMINATION","Ask for the record before deciding",'<p>The witness is confident, but confidence is not a substitute for evidence. Open both cards to hear the claim precisely and inspect the source exhibit.</p><div class="mc-evidence-actions"><button class="mc-evidence-button '+(state.seenClaim?'is-open':'')+'" onclick="MathCourt.chooseEvidence(\'claim\')"><span>01</span><strong>Clarify the claim</strong><small>'+(state.seenClaim?'✓ Examined':'Ask what is being asserted')+'</small></button><button class="mc-evidence-button '+(state.seenEvidence?'is-open':'')+'" onclick="MathCourt.chooseEvidence(\'evidence\')"><span>02</span><strong>Inspect Exhibit A</strong><small>'+(state.seenEvidence?'✓ Examined':'Open the original record')+'</small></button></div>'+(state.seenClaim?'<blockquote class="mc-testimony"><b>Claim clarified:</b> '+esc(item.claim)+'</blockquote>':'')+(state.seenEvidence?'<blockquote class="mc-testimony"><b>Exhibit A:</b> '+esc(item.evidence)+'</blockquote>':''));
      action='<button class="mc-button mc-button-primary" '+(state.seenClaim&&state.seenEvidence?'':'disabled')+' onclick="MathCourt.advance()">Build the mathematical exhibit →</button>';
    } else if(state.phase===2) {
      html+=panel("BUILD THE EVIDENCE","Solve the mathematical exhibit",'<p>'+esc(item.prompt)+'</p><div class="mc-answer-options">'+item.options.map((opt,i)=>'<button class="mc-option" aria-pressed="false" onclick="MathCourt.answerInvestigation('+i+')"><span>'+String.fromCharCode(65+i)+'</span>'+esc(opt)+'</button>').join("")+'</div>'+(state.investigationSolved?'<div class="mc-solution"><strong>Mathematical finding</strong><p>'+esc(item.explanation)+'</p></div>':'<p class="mc-soft-note">Choose an answer. Incorrect attempts do not cost points, and a hint is available below.</p>'));
      action='<button class="mc-button mc-button-primary" '+(state.investigationSolved?'':'disabled')+' onclick="MathCourt.advance()">Admit the exhibit and hear new evidence →</button><button class="mc-button mc-button-quiet" onclick="MathCourt.showHint()">Give me a hint</button>';
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
  root.MathCourt={open,openCase,resume,goDocket,back,advance,chooseEvidence,answerInvestigation,answerCross,selectVerdict,showHint,previous,resetProgress};
})(window);
