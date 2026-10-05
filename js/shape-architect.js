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
  function select(id){if(state.placements.has(id))return;state.selected=state.selected===id?null:id;document.querySelectorAll('.architect-piece').forEach(x=>x.classList.toggle('selected',Number(x.dataset.id)===state.selected));announce(state.selected===null?'Piece deselected':'Piece '+(id+1)+' selected. Move it to the picture.')}
  function rotateSelected(){
    if(state.selected===null)return;
    const p=state.data.pieces[state.selected],current=state.placements.get(state.selected);
    const oldRot=current?.rot??p.rotation??0;
    const count=ShapeArchitectLibrary.orientations(p.cells).length;
    const rot=(oldRot+1)%count;
    if(current){
      const previous=current;
      state.placements.set(state.selected,{...current,rot});renderTarget();
      if(!canPlacementMap())state.placements.set(state.selected,previous);
      renderTarget();
    }else{p.rotation=rot;renderTray();}
  }
  function canPlacementMap(){for(const [id,pl] of state.placements)if(!canPlaceIgnoringSelf(id,pl))return false;return true}
  function canPlaceIgnoringSelf(id,pl){
    const cells=selectedOrientation(state.data.pieces[id],pl.rot), seen=new Set();
    for(const [oid,opl] of state.placements)if(oid!==id)for(const [rr,cc] of selectedOrientation(state.data.pieces[oid],opl.rot))seen.add((opl.r+rr)+','+(opl.c+cc));
    return cells.every(([rr,cc])=>{const R=pl.r+rr,C=pl.c+cc;return R>=0&&C>=0&&R<8&&C<8&&state.data.mask[R][C]==='#'&&!seen.has(R+','+C)});
  }
  function place(id,r,c,rot=0){
    if(!canPlace(id,rot,r,c))return false;
    state.placements.set(id,{r,c,rot});state.history.push(id);state.selected=null;renderTarget();renderTray();checkComplete();return true;
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
  function undo(){const id=state.history.pop();if(id===undefined)return;state.placements.delete(id);state.selected=null;renderTarget();renderTray();announce('Last piece moved back.')}
  function hint(){const solution=state.data.solution.find(s=>!state.placements.has(s.piece));if(!solution){announce('The picture is already complete.');return}state.hints++;const piece=state.data.pieces[solution.piece];select(piece.id);const target=solution.cells[0];document.querySelector('#architect-board .architect-cell[data-r="'+target[0]+'"][data-c="'+target[1]+'"]')?.classList.add('hint');setTimeout(()=>document.querySelectorAll('.architect-cell.hint').forEach(x=>x.classList.remove('hint')),900);announce('Try placing Piece '+(piece.id+1)+' near the glowing square.');}
  function announce(text){const el=els('architect-message');if(el){el.textContent=text;el.classList.remove('hidden');}}
  function tick(){els('architect-timer').textContent=fmt(now())}
  function stop(){clearInterval(state.timer);state.timer=null}
  function load(index){
    const p=progress();if(index+1>p.unlocked)return;
    stop();state.level=index;state.data=ShapeArchitectLevels.get(index);state.selected=null;state.placements=new Map();state.history=[];state.hints=0;state.data.pieces.forEach(p=>{p.rotation=p.startRot||0});state.startedAt=performance.now();state.timer=setInterval(tick,250);
    hide('architect-level-panel');hide('architect-complete');show('architect-play-panel');
    els('architect-level-num').textContent=index+1;els('architect-target-name').textContent=state.data.name;els('architect-target-hint').textContent=state.data.hint;els('architect-timer').textContent='0:00';els('architect-message').classList.add('hidden');renderTarget();renderTray();announce(state.data.hint);
  }
  function restart(){if(state.data)load(state.level)}
  function complete(){stop();const seconds=now();const p=progress();p.done[state.level+1]=true;p.best[state.level+1]=Math.min(p.best[state.level+1]||Infinity,seconds);p.unlocked=Math.max(p.unlocked,Math.min(100,state.level+2));saveProgress(p);els('architect-complete-time').textContent=fmt(seconds);els('architect-complete-name').textContent=state.data.name;els('architect-complete').classList.remove('hidden');els('architect-play-panel').classList.add('hidden');Analytics.log('shape_architect','complete',{level:state.level+1,time:Math.round(seconds),hints:state.hints});}
  function checkComplete(){if(state.placements.size!==state.data.requiredCount)return;if([...state.placements.keys()].some(id=>id>=state.data.requiredCount))return;const target=new Set();for(const s of state.data.solution)for(const c of s.cells)target.add(c.join(','));const got=new Set();for(const [id,pl] of state.placements)for(const [rr,cc] of selectedOrientation(state.data.pieces[id],pl.rot))got.add((pl.r+rr)+','+(pl.c+cc));if(got.size===target.size&&[...got].every(x=>target.has(x)))complete();}
  function next(){if(state.level<99)load(state.level+1);else{backToLevels();announce('You built all 100 pictures!')}}
  function backToLevels(){stop();hide('architect-play-panel');hide('architect-complete');show('architect-level-panel');renderLevels()}
  function init(){renderLevels();show('architect-level-panel');hide('architect-play-panel');hide('architect-complete')}
  function keyboard(event){
    if(!document.getElementById('screen-architect')?.classList.contains('active')||isTypingTarget(event.target))return;
    if(event.key.toLowerCase()==='r'){event.preventDefault();rotateSelected();return}
    if(event.key==='Escape'){state.selected=null;document.querySelectorAll('.architect-piece.selected').forEach(x=>x.classList.remove('selected'));announce('Piece deselected.');return}
    const cell=event.target.closest?.('.architect-cell');if(!cell)return;
    if(event.key==='Enter'&&state.selected!==null){event.preventDefault();const id=state.selected;const rot=Number(document.querySelector('.architect-piece[data-id="'+id+'"]')?.dataset.rot||0);const r=Number(cell.dataset.r),c=Number(cell.dataset.c);if(!place(id,r,c,rot))announce('That piece does not fit here. Try another square or rotate it.');return}
    const r=Number(cell.dataset.r),c=Number(cell.dataset.c),dr=event.key==='ArrowDown'?1:event.key==='ArrowUp'?-1:0,dc=event.key==='ArrowRight'?1:event.key==='ArrowLeft'?-1:0;if(dr||dc){event.preventDefault();const nr=Math.max(0,Math.min(7,r+dr)),nc=Math.max(0,Math.min(7,c+dc));document.querySelector('#architect-board .architect-cell[data-r="'+nr+'"][data-c="'+nc+'"]')?.focus();}
  }
  document.addEventListener('keydown',keyboard);
  return {init,load,restart,stop,next,backToLevels,rotateSelected,undo,hint,getLevels:()=>ShapeArchitectLevels.getAll(),canPlace};
})()