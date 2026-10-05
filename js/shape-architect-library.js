/* Shape Architect geometry library. Grid-based pieces keep generation exact, readable, and accessible. */
const ShapeArchitectLibrary = (() => {
  const SHAPES = {
    dot:{name:'Dot',cells:[[0,0]]},
    dominoH:{name:'Bar',cells:[[0,0],[0,1]]},
    dominoV:{name:'Bar',cells:[[0,0],[1,0]]},
    triL:{name:'Corner',cells:[[0,0],[1,0],[1,1]]},
    triI:{name:'Tri',cells:[[0,0],[0,1],[0,2]]},
    square:{name:'Square',cells:[[0,0],[0,1],[1,0],[1,1]]},
    zig:{name:'Zig',cells:[[0,0],[0,1],[1,1],[1,2]]},
    hook:{name:'Hook',cells:[[0,0],[1,0],[2,0],[2,1]]},
    tee:{name:'T',cells:[[0,0],[0,1],[0,2],[1,1]]},
    line4:{name:'Long bar',cells:[[0,0],[0,1],[0,2],[0,3]]},
    corner4:{name:'Big corner',cells:[[0,0],[1,0],[2,0],[2,1]]},
    s4:{name:'S',cells:[[1,0],[1,1],[0,1],[0,2]]},
    plus:{name:'Plus',cells:[[0,1],[1,0],[1,1],[1,2],[2,1]]},
    p5:{name:'Block corner',cells:[[0,0],[0,1],[1,0],[1,1],[2,0]]}
  };
  function normalize(cells) {
    const minR=Math.min(...cells.map(c=>c[0])), minC=Math.min(...cells.map(c=>c[1]));
    return cells.map(([r,c])=>[r-minR,c-minC]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  }
  function rotate(cells) {
    return normalize(cells.map(([r,c])=>[c,-r]));
  }
  function orientations(cells) {
    const out=[], seen=new Set(), cur=normalize(cells);
    for(let i=0;i<4;i++){
      const key=cur.map(c=>c.join(',')).join(';');
      if(!seen.has(key)){seen.add(key);out.push(cur);}
      cur=rotate(cur);
    }
    return out;
  }
  function bounds(cells){return {rows:Math.max(...cells.map(c=>c[0]))+1,cols:Math.max(...cells.map(c=>c[1]))+1};}
  return {SHAPES,normalize,rotate,orientations,bounds};
})();