/* Consent-aware, aggregate-only research gateway.
   Research events are never joined to account IDs or session tokens. */
const ResearchEventGateway = (() => {
  const KEY = "mfa_analytics_v1";
  const API = "https://maths-for-all-api.ompranabmohanty.workers.dev/api/research/events";
  const MAX_EVENTS = 1500;
  let events = null, flushing = false;
  const CATEGORIES = new Set(["quiz","race","sudoku","shape","slab","shape_architect","fraction_bakery","little_shop","number_maze","traffic-control"]);
  const ACTIONS = new Set(["game_opened","answer","hint_requested","retry","round_complete","level_complete","puzzle_solved","sale_complete","mission_complete"]);
  const DETAIL_KEYS = new Set(["difficulty","correct","level","attempts","hintsUsed","mistakes","completed","durationMs"]);
  function consentAllowed() { return typeof ResearchConsent !== "undefined" && ResearchConsent.isAllowed(); }
  function load() {
    if (events) return events;
    try { const raw=localStorage.getItem(KEY); events=raw?JSON.parse(raw):[]; if(!Array.isArray(events))events=[]; }
    catch { events=[]; }
    return events;
  }
  function save() { try { localStorage.setItem(KEY,JSON.stringify(events||[])); return true; } catch { return false; } }
  function cleanDetail(detail) {
    const clean={};
    if(!detail||typeof detail!=="object"||Array.isArray(detail))return clean;
    for(const key of DETAIL_KEYS){
      const value=detail[key];
      if(key==="difficulty"&&typeof value==="string"&&["easy","medium","hard","gentle","steady","stretch","starter","growing","champion"].includes(value.toLowerCase()))clean[key]=value.toLowerCase();
      else if(["correct","completed"].includes(key)&&typeof value==="boolean")clean[key]=value;
      else if(["level","attempts","hintsUsed","mistakes","durationMs"].includes(key)&&Number.isFinite(value))clean[key]=Math.max(0,Math.min(10000,Math.round(value)));
    }
    return clean;
  }
  function record(category, action, detail={}) {
    if(!consentAllowed()||!CATEGORIES.has(category)||!ACTIONS.has(action))return false;
    const list=load();
    list.push({category,action,detail:cleanDetail(detail)});
    if(list.length>MAX_EVENTS)list.splice(0,list.length-MAX_EVENTS);
    save();
    if(list.length>=10||action.includes("complete")||action==="puzzle_solved") flush();
    return true;
  }
  async function flush() {
    if(!consentAllowed()||flushing)return false;
    const list=load(); if(!list.length)return true;
    flushing=true;
    const batch=list.slice(0,50);
    try{
      const response=await fetch(API,{method:"POST",credentials:"omit",keepalive:true,headers:{"Content-Type":"application/json"},body:JSON.stringify({consent:true,events:batch})});
      if(!response.ok)return false;
      events=list.slice(batch.length);save();return true;
    }catch{return false;}finally{flushing=false;}
  }
  function read() { return consentAllowed()?load().slice():[]; }
  function clear() { events=[];try{localStorage.removeItem(KEY);}catch{} }
  window.addEventListener("pagehide",()=>{if(consentAllowed())flush();});
  return {record,read,clear,flush};
})();
