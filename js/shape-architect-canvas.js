/* Canvas rendering and pointer geometry for Shape Architect. */
const ShapeArchitectCanvas = (() => {
  const W=760,H=520,colors=['#F4C95D','#9FD8CB','#A9C7E8','#E9A9A9','#C6B6E7','#F0B27A','#B8D98A'];
  function fit(canvas){const rect=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1),width=Math.max(1,rect.width),height=Math.max(1,rect.height);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);const ctx=canvas.getContext('2d');ctx.setTransform(dpr*width/W,0,0,dpr*height/H,0,0);return ctx;}
  function background(ctx,label){ctx.clearRect(0,0,W,H);ctx.fillStyle='#FFFDF7';ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(38,50,56,.09)';ctx.lineWidth=1;for(let x=40;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=40;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}if(label){ctx.fillStyle='rgba(38,50,56,.55)';ctx.font='700 16px sans-serif';ctx.fillText(label,18,28);}}
  function toPx(p){return {...p,x:p.x*W,y:p.y*H,w:p.w*W,h:p.h*H};}
  function drawReference(canvas,level){const ctx=fit(canvas);background(ctx,'Reference picture');level.pieces.filter(p=>p.required).forEach((p,i)=>ShapeArchitectLibrary.draw(ctx,toPx(p),{fill:colors[i%colors.length],stroke:'#263238',lineWidth:3}));}
  function drawBuild(canvas,level,pieces,selectedId,hintId){const ctx=fit(canvas);background(ctx,'Build it here');if(hintId!==null){const target=level.pieces[hintId];ShapeArchitectLibrary.draw(ctx,toPx(target),{fill:'rgba(244,201,93,.18)',stroke:'#D98B24',lineWidth:5,alpha:.7});}pieces.forEach((p,i)=>ShapeArchitectLibrary.draw(ctx,toPx(p),{fill:colors[i%colors.length],stroke:i===selectedId?'#9A6A00':'#263238',lineWidth:i===selectedId?6:3}));}
  function pointer(canvas,e){const r=canvas.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};}
  function hitTest(canvas,pieces,e){const p=pointer(canvas,e);for(let i=pieces.length-1;i>=0;i--){const q=toPx(pieces[i]);if(ShapeArchitectLibrary.hit(q,p.x*W,p.y*H,8))return i;}return -1;}
  return {W,H,fit,pointer,hitTest,drawReference,drawBuild};
})();