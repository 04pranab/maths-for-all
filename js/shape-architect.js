const ShapeArchitect = (() => {
  const state={level:0,data:null,selected:null,placements:new Map(),startedAt:0,timer:null,drag:null,history:[],hints:0,raf:0,suppressClick:false};
  const els=id=>document.getElementById(id);
  const keyFor=(id,rot)=>id+':'+rot;
  function progressKey(){return 'mfa_shape_architect_v1';}
  function progress(){try{return JSON.parse(localStorage.getItem(progressKey()))||{unlocked:1,done:{},best:{}}}catch{return {unlocked:1,done:{},best:{}}}}
  function saveProgress(p){try{localStorage.setItem(progressKey(),JSON.stringify(p))}catch{}}
  function fmt(sec){sec=Math.max(0,Math.floor(sec));return Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0')}
  function now(){return (performance.now()-state.startedAt)/1000}
  function renderLevels(){
    const p=progress(), grid=els('architect-level-grid'); if(!grid)return;
    grid.innerHTML='';
    for(let i=0;i<100;i++){const b=document.createElement('button');b.className='architect-level-btn'+(i+1>p.unlocked?' locked':'')+(p.done[i+1]?' done':'');b.textContent=i+1;b.disabled=i+1>p.unlocked;b.setAttribute('aria-label','Level '+(i+1)+(p.done[i+1]?', completed':''));b.onclick=()=>load(i);grid.appendChild(b);}
    els('architect-progress').textContent=Object.keys(p.done).length+' / 100 pictures built';
  }
  function renderPiece(piece,rot=0){
    const cells=ShapeArchitectLibrary.orientations(piece.cells)[rot%ShapeArchitectLibrary.orientations(piece.cells).length];
    const b=ShapeArchitectLibrary.bounds(cells), el=document.createElement('button');
    el.className='architect-piece'+(piece.required?' required':' extra');el.type='button';el.dataset.id=piece.id;el.dataset.rot=rot;
    el.setAttribute('aria-label',(piece.required?'Puzzle piece ':'Extra piece ')+(piece.id+1));
    el.innerHTML='<span class="architect-piece-label">'+(piece.required?'Piece ':'Extra ')+(piece.id+1)+'</span><span class="architect-mini" style="--rows:'+b.rows+';--cols:'+b.cols+'">'+cells.map(c=>'<i style="grid-row:'+(c[0]+1)+';grid-column:'+(c[1]+1)+'"></i>').join('')+'</span>';
    el.addEventListener('click',()=>{if(state.suppressClick){state.suppressClick=false;return}select(piece.id);});
    el.addEventListener('pointerdown',e=>startDrag(e,piece.id));
    return el;
  }
  function renderTray(){
    const tray=els('architect-tray');tray.innerHTML='';
    state.data.pieces.forEach((p,i)=>{if(state.placements.has(i))return;tray.appendChild(renderPiece(p,p.rotation));});
    els('architect-placed').textContent=state.placements.size+'/'+state.data.requiredCount;
  }
  function renderTarget(){
    ShapeArchitectGrid.render(els('architect-board'),state.data.mask,state.placements,selectedOrientation);
  }
  function selectedOrientation(piece,rot){const os=ShapeArchitectLibrary.orientations(piece.cells);return os[rot%os.length]}
  function canPlace(pieceId,rot,r,c){
    const cells=selectedOrientation(state.data.pieces[pieceId],rot), used=new Set();
    for(const [id,pl] of state.placements)if(id!==pieceId)for(const [rr,cc] of selectedOrientation(state.data.pieces[id],pl.rot)){for(const x of [0])used.add((pl.r+rr)+','+(pl.c+cc))}
    for(const [rr,cc] of cells){const R=r+rr,C=c+cc;if(R<0||C<0||R>=8||C>=8||state.data.mask[R][C]!== '#'||used.has(R+','+C))return false}
    return true;
  }
  function pointerCell(e){return ShapeArchitectGrid.pointerCell(els('architect-board'),e)}

  function startDrag(e,id){
    if(state.placements.has(id))return;
    e.preventDefault();select(id);state.suppressClick=true;
    const piece=state.data.pieces[id],rot=piece.rotation||0;
    state.drag={id,rot,pointerId:e.pointerId,ghost:null,lastCell:null,lastX:e.clientX,lastY:e.clientY,target:e.currentTarget,startX:e.clientX,startY:e.clientY,active:false};
    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.currentTarget.addEventListener('pointermove',dragMove);
    e.currentTarget.addEventListener('pointerup',endDrag,{once:true});
    e.currentTarget.addEventListener('pointercancel',cancelDrag,{once:true});
  }

  function activateDrag(){
    if(!state.drag||state.drag.active)return;
    const d=state.drag;d.active=true;
    const piece=state.data.pieces[d.id];
    d.ghost=ShapeArchitectGrid.createDragGhost(piece.cells,r=>ShapeArchitectLibrary.orientations(piece.cells)[r%ShapeArchitectLibrary.orientations(piece.cells).length],d.id);
    ShapeArchitectGrid.moveDragGhost(d.ghost,d.lastX,d.lastY);
    d.target.classList.add('dragging');
  }

  function dragMove(e){
    if(!state.drag)return;
    state.drag.lastX=e.clientX;state.drag.lastY=e.clientY;
    const dx=e.clientX-state.drag.startX,dy=e.clientY-state.drag.startY;
    if(!state.drag.active&&Math.hypot(dx,dy)>6)activateDrag();
    if(!state.drag.active)return;
    ShapeArchitectGrid.moveDragGhost(state.drag.ghost,e.clientX,e.clientY);
    if(state.raf)return;
    state.raf=requestAnimationFrame(()=>{
      state.raf=0;if(!state.drag)return;
      const [r,c]=pointerCell({clientX:state.drag.lastX,clientY:state.drag.lastY});
      if(state.drag.lastCell?.[0]===r&&state.drag.lastCell?.[1]===c)return;
      state.drag.lastCell=[r,c];
      const cells=selectedOrientation(state.data.pieces[state.drag.id],state.drag.rot).map(([rr,cc])=>[r+rr,c+cc]);
      ShapeArchitectGrid.paintPreview(els('architect-board'),cells,canPlace(state.drag.id,state.drag.rot,r,c));
    });
  }

  function finishDrag(event,shouldPlace){
    if(!state.drag)return;
    const d=state.drag;state.drag=null;
    if(state.raf){cancelAnimationFrame(state.raf);state.raf=0;}
    ShapeArchitectGrid.clearPreview(els('architect-board'));ShapeArchitectGrid.removeDragGhost(d.ghost);
    d.target?.classList.remove('dragging');d.target?.removeEventListener('pointermove',dragMove);
    const target=event&&typeof event.clientX==='number'?pointerCell(event):d.lastCell;
    if(shouldPlace&&d.active&&target&&!place(d.id,target[0],target[1],d.rot))announce('That piece does not fit there yet. Try another place or rotate it.');
    setTimeout(()=>{state.suppressClick=false},0);
  }
  function endDrag(e){finishDrag(e,true)}
  function cancelDrag(){finishDrag(null,false)}
;