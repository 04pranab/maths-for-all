const ShapeArchitectSolver = (() => {
  function placementsFor(piece,targetSet,size){
    const out=[];
    for(let rot=0;rot<ShapeArchitectLibrary.orientations(piece.cells).length;rot++){
      const cells=ShapeArchitectLibrary.orientations(piece.cells)[rot];
      const maxR=Math.max(...cells.map(x=>x[0])),maxC=Math.max(...cells.map(x=>x[1]));
      for(let r=0;r<size-maxR;r++)for(let c=0;c<size-maxC;c++){
        const covered=cells.map(([rr,cc])=>(r+rr)+','+(c+cc));
        if(covered.every(k=>targetSet.has(k)))out.push({r,c,rot,cells});
      }
    }
    return out;
  }
  function hasExactSolution(level){
    const target=new Set();
    for(let r=0;r<level.mask.length;r++)for(let c=0;c<level.mask[r].length;c++)if(level.mask[r][c]==='#')target.add(r+','+c);
    const pieces=level.pieces.slice(0,level.requiredCount);
    const options=pieces.map(p=>placementsFor(p,target,level.grid));
    if(options.some(x=>!x.length))return false;
    options.sort((a,b)=>a.length-b.length);
    function search(i,used){
      if(i===options.length)return used.size===target.size;
      for(const p of options[i]){
        const next=new Set(used);let ok=true;
        for(const [rr,cc] of p.cells){const k=(p.r+rr)+','+(p.c+cc);if(next.has(k)){ok=false;break}next.add(k)}
        if(ok&&search(i+1,next))return true;
      }
      return false;
    }
    return search(0,new Set());
  }
  return {hasExactSolution};
})();