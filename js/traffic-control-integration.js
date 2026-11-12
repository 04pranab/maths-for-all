/* Main-shell bridge for the standalone Traffic Control simulation. */
const TrafficControlIntegration = (() => {
  let frame=null, previousFocus=null, activeDialog=null;
  function getFrame(){frame=frame||document.getElementById("traffic-control-frame");return frame}
  function send(type,value){getFrame()?.contentWindow?.postMessage({source:"mfa-shell",type,value},window.location.origin)}
  function closeDialog(restore=true){
    if(!activeDialog)return;
    const el=document.getElementById(activeDialog);if(el)el.hidden=true;
    activeDialog=null;document.body.classList.remove("tc-dialog-open");
    if(restore&&previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
    previousFocus=null;
  }
  function showDialog(id){
    const el=document.getElementById(id);if(!el)return;
    closeDialog(false);previousFocus=document.activeElement;activeDialog=id;
    el.hidden=false;el.querySelector("button")?.focus({preventScroll:true});
    document.body.classList.add("tc-dialog-open");
  }
  function open(){getFrame();send("resume");setFontScale(Number(getComputedStyle(document.documentElement).getPropertyValue("--font-scale"))||1)}
  function setFontScale(value){send("font-scale",value)}
  function pause(){send("pause");showDialog("traffic-pause-overlay")}
  function resume(){closeDialog();send("resume")}
  function help(){ControlsOverlay.forceShow("trafficControl")}
  function requestExit(){send("pause");showDialog("traffic-exit-overlay")}
  function cancelExit(){closeDialog();send("resume")}
  function confirmExit(){closeDialog(false);Game.goHome()}
  function pauseForNavigation(){if(getFrame())send("pause");closeDialog(false)}
  function onMessage(event){
    if(event.origin!==window.location.origin||event.source!==getFrame()?.contentWindow)return;
    const data=event.data;if(!data||data.source!=="traffic-control")return;
    if(data.type==="challenge-complete")window.CompletionOverlay?.show({
      title:data.title||"Junction cleared!",message:data.message||"You cleared the traffic queues. Your next challenge is ready.",
      actionLabel:data.actionLabel||"Next challenge",onContinue:()=>send("next")
    });
  }
  document.addEventListener("DOMContentLoaded",()=>{
    const target=getFrame();target?.addEventListener("load",()=>send("resume"));
    window.addEventListener("message",onMessage);
    document.addEventListener("keydown",event=>{
      if(event.key!=="Escape"||!activeDialog)return;
      event.preventDefault();event.stopPropagation();
      if(activeDialog==="traffic-pause-overlay")resume();else cancelExit();
    },true);
  });
  return{open,setFontScale,pause,resume,help,requestExit,cancelExit,confirmExit,pauseForNavigation};
})();
window.TrafficControlIntegration=TrafficControlIntegration;
