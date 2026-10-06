/* Canvas rendering and pointer geometry for Shape Architect. */
const ShapeArchitectCanvas = (() => {
  const W=760,H=520,colors=['#F4C95D','#9FD8CB','#A9C7E8','#E9A9A9','#C6B6E7','#F0B27A','#B8D98A'];
  function fit(canvas){const rect=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1),width=Math.max(1,rect.width),height=Math.max(1,rect.height);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);const ctx=canvas.getContext('2d');ctx.setTransform(dpr*width/W,0,0,dpr*height/H,0,0);return ctx;}
  function background(ctx,label,grid=true){ctx.clearRect(0,0,W,H);ctx.fillStyle='#FFFDF7';ctx.fillRect(0,0,W,H);if(grid){ctx.strokeStyle='rgba(38,50,56,.09)';ctx.lineWidth=1;for(let x=40;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=40;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}}if(label){ctx.fillStyle='rgba(38,50,56,.55)';ctx.font='700 16px sans-serif';ctx.fillText(label,18,28);}}
  function toPx(p){return {...p,x:p.x*W,y:p.y*H,w:p.w*W,h:p.h*H};}

  const silhouetteCache=new WeakMap();
  function silhouetteSegments(level){
    if(silhouetteCache.has(level))return silhouetteCache.get(level);
    const c=document.createElement('canvas');c.width=W;c.height=H;
    const u=c.getContext('2d',{willReadFrequently:true});u.clearRect(0,0,W,H);
    level.targetPieces.forEach(p=>ShapeArchitectLibrary.draw(u,toPx(p),{fill:'#000',stroke:'#000',lineWidth:1}));
    const d=u.getImageData(0,0,W,H).data,segments=[];
    const on=(x,y)=>x>=0&&x<W&&y>=0&&y<H&&d[(y*W+x)*4+3]>32;

    for(let y=0;y<H;y++){
      let topStart=-1,bottomStart=-1;
      for(let x=0;x<=W;x++){
        const inside=x<W&&on(x,y);
        const top=inside&&!on(x,y-1);
        const bottom=inside&&!on(x,y+1);
        if(top&&topStart<0)topStart=x;
        if((!top||x===W)&&topStart>=0){segments.push([topStart,y,x,y]);topStart=-1;}
        if(bottom&&bottomStart<0)bottomStart=x;
        if((!bottom||x===W)&&bottomStart>=0){segments.push([bottomStart,y+1,x,y+1]);bottomStart=-1;}
      }
    }
    for(let x=0;x<W;x++){
      let leftStart=-1,rightStart=-1;
      for(let y=0;y<=H;y++){
        const inside=y<H&&on(x,y);
        const left=inside&&!on(x-1,y);
        const right=inside&&!on(x+1,y);
        if(left&&leftStart<0)leftStart=y;
        if((!left||y===H)&&leftStart>=0){segments.push([x,leftStart,x,y]);leftStart=-1;}
        if(right&&rightStart<0)rightStart=y;
        if((!right||y===H)&&rightStart>=0){segments.push([x+1,rightStart,x+1,y]);rightStart=-1;}
      }
    }
    silhouetteCache.set(level,segments);
    return segments;
  }

  function drawSilhouette(ctx,level){
    ctx.save();
    ctx.strokeStyle='rgba(38,50,56,.20)';
    ctx.lineWidth=2;
    ctx.lineJoin='round';
    ctx.lineCap='round';
    silhouetteSegments(level).forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});
    ctx.restore();
  }

  function maskForPieces(pieces,scale=.5){
    const width=Math.round(W*scale),height=Math.round(H*scale),c=document.createElement('canvas');
    c.width=width;c.height=height;
    const ctx=c.getContext('2d',{willReadFrequently:true});
    ctx.clearRect(0,0,width,height);
    pieces.forEach(p=>ShapeArchitectLibrary.draw(ctx,{...p,x:p.x*width,y:p.y*height,w:p.w*width,h:p.h*height},{fill:'#fff',stroke:'#fff',lineWidth:1}));
    return {canvas:c,data:ctx.getImageData(0,0,width,height).data,width,height};
  }

  function maskStats(a,b){
    let target=0,current=0,intersection=0;
    for(let i=3;i<a.data.length;i+=4){
      const at=a.data[i]>32,bt=b.data[i]>32;
      if(at)target++;
      if(bt)current++;
      if(at&&bt)intersection++;
    }
    return {
      targetCoverage:target?intersection/target:0,
      currentCoverage:current?intersection/current:0,
      spill:current?Math.max(0,current-intersection)/current:1
    };
  }

  function visualMatch(level,pieces){
    const scale=.5,target=maskForPieces(level.targetPieces,scale),current=maskForPieces(pieces,scale);
    let minTargetCoverage=1,minCurrentCoverage=1,maxSpill=0;
    for(let i=0;i<level.targetPieces.length;i++){
      const a=maskForPieces([level.targetPieces[i]],scale);
      const b=maskForPieces([pieces[i]],scale);
      const s=maskStats(a,b);
      minTargetCoverage=Math.min(minTargetCoverage,s.targetCoverage);
      minCurrentCoverage=Math.min(minCurrentCoverage,s.currentCoverage);
      maxSpill=Math.max(maxSpill,s.spill);
    }
    const union=maskStats(target,current);
    return {
      complete:minTargetCoverage>=.62&&minCurrentCoverage>=.62&&maxSpill<=.38&&union.targetCoverage>=.88&&union.spill<=.16,
      minTargetCoverage,
      minCurrentCoverage,
      maxSpill,
      unionCoverage:union.targetCoverage,
      unionSpill:union.spill
    };
  }

  function drawReference(canvas,level){const ctx=fit(canvas);background(ctx,'Reference picture');level.targetPieces.forEach((p,i)=>ShapeArchitectLibrary.draw(ctx,toPx(p),{fill:colors[i%colors.length],stroke:'#263238',lineWidth:3}));}
  function drawBuild(canvas,level,pieces,selectedId,hintId){const ctx=fit(canvas);background(ctx,'Build it here',false);drawSilhouette(ctx,level);if(hintId!==null){const target=level.targetPieces.find(p=>p.id===hintId);ShapeArchitectLibrary.draw(ctx,toPx(target),{fill:'rgba(244,201,93,.18)',stroke:'#D98B24',lineWidth:5,alpha:.7});}pieces.forEach((p,i)=>ShapeArchitectLibrary.draw(ctx,toPx(p),{fill:colors[i%colors.length],stroke:i===selectedId?'#9A6A00':'#263238',lineWidth:i===selectedId?6:3}));}
  function pointer(canvas,e){const r=canvas.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};}
  function hitTest(canvas,pieces,e){const p=pointer(canvas,e);for(let i=pieces.length-1;i>=0;i--){const q=toPx(pieces[i]);if(ShapeArchitectLibrary.hit(q,p.x*W,p.y*H,8))return i;}return -1;}
  return {W,H,fit,pointer,hitTest,drawReference,drawBuild,silhouetteSegments,visualMatch};
})();