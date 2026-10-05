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
  function certificateMatches(level){
    const target=new Set();
    for(let r=0;r<level.mask.length;r++)for(let c=0;c<level.mask[r].length;c++)if(level.mask[r][c]==='#')target.add(r+','+c);
    const used=new Set();
    if(level.solution.length!==level.requiredCount)return false;
    for(const solution of level.solution){
      const piece=level.pieces[solution.piece];
      if(!piece||!piece.required||solution.cells.length!==piece.cells.length)return false;
      for(const [r,c] of solution.cells){
        const key=r+','+c;
        if(!target.has(key)||used.has(key))return false;
        used.add(key);
      }
    }
    return used.size===target.size;
  }

  function hasExactSolution(level){
    if(typeof ShapeArchitectLevels!=='undefined'&&typeof ShapeArchitectLevels.validate==='function')return ShapeArchitectLevels.validate(level);
    return certificateMatches(level);
  }
  return {hasExactSolution};
})();