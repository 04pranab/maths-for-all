/* Fail-closed research privacy controls for a child-focused learning service. */
const ResearchConsent = (() => {
  const KEY="mfa_research_consent_v1", ANALYTICS_KEY="mfa_analytics_v1";
  let returnFocus=null;
  const get=()=>{try{return localStorage.getItem(KEY)==="no"?"no":null;}catch{return null;}};
  const isAllowed=()=>false; // Disabled until verifiable adult/guardian consent is implemented.
  function purge(){try{localStorage.removeItem(ANALYTICS_KEY);}catch{} if(typeof ResearchEventGateway!=="undefined")ResearchEventGateway.clear();}
  function setNo(){try{localStorage.setItem(KEY,"no");}catch{} purge();renderStatus();return true;}
  function open(){returnFocus=document.activeElement;render();const modal=document.getElementById("research-consent-modal");if(!modal)return;modal.classList.remove("hidden");modal.querySelector("button")?.focus();}
  function close(){const modal=document.getElementById("research-consent-modal");if(!modal)return;modal.classList.add("hidden");if(returnFocus&&typeof returnFocus.focus==="function")returnFocus.focus();returnFocus=null;}
  function renderStatus(){const el=document.getElementById("research-consent-status");if(el)el.textContent="Research collection: off";}
  function render(){
    const modal=document.getElementById("research-consent-modal");if(!modal)return;
    modal.innerHTML=`<div class="consent-card" role="dialog" aria-modal="true" aria-labelledby="research-consent-title">
      <div class="consent-icon">🔐</div><h2 id="research-consent-title">Your privacy comes first</h2>
      <p class="consent-lead"><strong>Research sharing is OFF.</strong> Creating an account or signing in never means you have agreed to research.</p>
      <section class="consent-columns"><section><h3>What happens now?</h3><ul><li>Your games, scores, levels and badges work normally.</li><li>No research events are saved or uploaded.</li><li>No research data is linked to your player account.</li></ul></section>
      <section><h3>Why is sharing paused?</h3><p>Maths For All is designed for children and inclusive learning. Research sharing will stay disabled until a verifiable parent or legal-guardian permission process is available where required.</p><p>We do not ask for a parent’s name or school name just to play.</p></section></section>
      <p class="consent-note"><strong>No means no.</strong> There is no opt-in switch while this safeguard is pending. You can continue playing without sharing research data.</p>
      <div class="consent-actions"><button class="consent-btn primary" type="button" onclick="ResearchConsent.chooseNo()">Continue with research OFF</button></div>
      <a class="consent-policy" href="${window.location.pathname.includes("/games/traffic-control/")?"../../docs/v3/research-data-policy.html":"docs/v3/research-data-policy.html"}" target="_blank" rel="noopener">Read the full research data policy</a>
    </div>`;
  }
  function chooseNo(){setNo();close();}
  function init(){if(get()!=="no")purge();renderStatus();}
  return{get,isAllowed,set:setNo,choose:chooseNo,chooseNo,open,close,init,showPolicy(){window.open("docs/v3/research-data-policy.html","_blank","noopener");}};
})();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>ResearchConsent.init(),{once:true});else ResearchConsent.init();
