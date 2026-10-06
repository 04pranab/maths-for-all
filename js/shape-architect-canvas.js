/* Canvas rendering and pointer geometry for Shape Architect. */
const ShapeArchitectCanvas = (() => {
  const W=760,H=520,colors=['#F4C95D','#9FD8CB','#A9C7E8','#E9A9A9','#C6B6E7','#F0B27A','#B8D98A'];
  function fit(canvas){const rect=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1),width=Math.max(1,rect.width),height=Math.max(1,rect.height);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);const ctx=canvas.getContext('2d');ctx.setTransform(dpr*width/W,0,0,dpr*height/H,0,0);return ctx;}
  function background(ctx,label,grid=true){ctx.clearRect(0,0,W,H);ctx.fillStyle='#FFFDF7';ctx.fillRect(0,0,W,H);if(grid){ctx.strokeStyle='rgba(38,50,56,.09)';ctx.lineWidth=1;for(let x=40;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=40;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}}if(label){ctx.fillStyle='rgba(38,50,56,.55)';ctx.font='700 16px sans-serif';ctx.fillText(label,18,28);}}
  function toPx(p){return {...p,x:p.x*W,y:p.y*H,w:p.w*W,h:p.h*H};}
  const silhouetteCache=new WeakMap();
  function silhouetteSegments(level){
    if(silhouetteCache.has(level))return silhouetteCache.get(level);
    const c=document.createElement('canvas');c.width=W/2;c.height=H/2;
    const u=c.getContext('2d');u.clearRect(0,0,c.width,c.height);
    level.targetPieces.forEach(p=>ShapeArchitectLibrary.draw(u,{...toPx(p),x:p.x*W/2,y:p.y*H/2,w:p.w*W/2,h:p.h*H/2},{fill:'#000',stroke:'#000',lineWidth:4}));
    const d=u.getImageData(0,0,c.width,c.height).data,sw=c.width,sh=c.height,segments=[];
    const on=(x,y)=>x>=0&&x<sw&&y>=0&&y<sh&&d[(y*sw+x)*4+3]>20;
    for(let y=0;y<sh;y++){
      let start=-1;
      for(let x=0;x<=sw;x++){
        const inside=x<sw&&on(x,y),above=x<sw&&on(x,y-1),below=x<sw&&on(x,y+1);
        if(inside&&start<0)start=x;
        const end=x===sw||!inside;
        if(end&&start>=0){if(!above)segments.push([start,y,x,y]);if(!below)segments.push([start,y+1,x,y+1]);start=-1;}
      }
    }
    for(let x=0;x<sw;x++){
      let start=-1;
      for(let y=0;y<=sh;y++){
        const inside=y<sh&&on(x,y),left=y<sh&&on(x-1,y),right=y<sh&&on(x+1,y);
        if(inside&&start<0)start=y;
        const end=y===sh||!inside;
        if(end&&start>=0){if(!left)segments.push([x,start,x,end]);if(!right)segments.push([x+1,start,x+1,end]);start=-1;}
      }
    }
    const result=segments.map(([x1,y1,x2,y2])=>[x1*2,y1*2,x2*2,y2*2]);
    silhouetteCache.set(level,result);return result;
  }
  function drawSilhouette(ctx,level){
    ctx.save();ctx.strokeStyle='rgba(38,50,56,.22)';ctx.lineWidth=3;ctx.lineJoin='round';ctx.lineCap='round';
    silhouetteSegments(level).forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});ctx.restore();
  }
  function drawReference(canvas,level){const ctx=fit(canvas);background(ctx,'Reference picture');level.targetPieces.forEach((p,i)=>ShapeArchitectLibrary.draw(ctx,toPx(p),{fill:colors[i%colors.length],stroke:'#263238',lineWidth:3}));}
  function drawBuild(canvas,level,pieces,selectedId,hintId){const ctx=fit(canvas);background(ctx,'Build it here',false);drawSilhouette(ctx,level);if(hintId!==null){const target=level.targetPieces.find(p=>p.id===hintId);ShapeArchitectLibrary.draw(ctx,toPx(target),{fill:'rgba(244,201,93,.18)',stroke:'#D98B24',lineWidth:5,alpha:.7});}pieces.forEach((p,i)=>ShapeArchitectLibrary.draw(ctx,toPx(p),{fill:colors[i%colors.length],stroke:i===selectedId?'#9A6A00':'#263238',lineWidth:i===selectedId?6:3}));}
  function pointer(canvas,e){const r=canvas.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};}
  function hitTest(canvas,pieces,e){const p=pointer(canvas,e);for(let i=pieces.length-1;i>=0;i--){const q=toPx(pieces[i]);if(ShapeArchitectLibrary.hit(q,p.x*W,p.y*H,8))return i;}return -1;}
  return {W,H,fit,pointer,hitTest,drawReference,drawBuild,silhouetteSegments};
})();