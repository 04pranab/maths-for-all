/* Deterministic 100-level generator. Every level is created from a target mask and
   a connected partition of that mask, so the supplied solution is exact by construction. */
const ShapeArchitectLevels = (() => {
  const R=8;
  const TARGETS=[
    {name:'House',hint:'Build a little house.',mask:['........','....#...','...###..','..#####.','..#####.','..##.##.','..#####.','........']},
    {name:'Tree',hint:'Build a tree with a trunk.',mask:['....#...','...###..','..#####.','...###..','..#####.','....#...','....#...','...###..']},
    {name:'Fish',hint:'Build a swimming fish.',mask:['........','..###...','.#####..','######..','.#####..','..###...','....#...','........']},
    {name:'Boat',hint:'Build a boat.',mask:['........','....#...','...###..','..#####.','.#######','..#####.','...###..','........']},
    {name:'Flower',hint:'Build a flower.',mask:['....#...','...###..','..#####.','...###..','....#...','...###..','..#####.','...#....']},
    {name:'Rocket',hint:'Build a rocket.',mask:['....#...','...###..','..#####.','..#####.','...###..','...###..','..#####.','..#.#...']},
    {name:'Star',hint:'Build a star.',mask:['...#....','..###...','.#####..','#######.','..###...','...#....','...#....','...#....']},
    {name:'Heart',hint:'Build a heart.',mask:['.##.##..','######..','######..','.####...','..##....','..##....','..#.....','........']},
    {name:'Bird',hint:'Build a bird.',mask:['........','..#.....','.###....','#####...','..###...','...#....','..##....','........']},
    {name:'Mountain',hint:'Build a mountain landscape.',mask:['........','.......#','......##.','.....####','....#####','...######','..#######','.########']},
    {name:'Bridge',hint:'Build a bridge.',mask:['........','..######','..#....#','..#....#','########','..######','........','........']},
    {name:'Arrow',hint:'Build an arrow.',mask:['...#....','...##...','...###..','########','...###..','...##...','...#....','........']}
  ];
  const PIECE_KEYS=Object.keys(ShapeArchitectLibrary.SHAPES);
  function cells(mask){const out=[];for(let r=0;r<R;r++)for(let c=0;c<R;c++)if(mask[r][c]==='#')out.push([r,c]);return out;}
  function neighbors(r,c){return [[r-1,c],[r+1,c],[r,c-1],[r,c+1]];}
  function partition(mask,k,rng){
    const target=cells(mask);
    if(k<2||k>Math.floor(target.length/2)) return null;
    const key=(r,c)=>r+','+c;
    const byKey=new Map(target.map(x=>[key(x[0],x[1]),x]));
    const treeEdges=[];
    const visited=new Set();
    const stack=[target[0]];
    visited.add(key(target[0][0],target[0][1]));
    while(stack.length){
      const current=stack.pop();
      const options=neighbors(current[0],current[1])
        .filter(([r,c])=>byKey.has(key(r,c))&&!visited.has(key(r,c)));
      const shuffled=Utils.seededShuffle(options,rng);
      for(const next of shuffled){
        const nk=key(next[0],next[1]);
        if(visited.has(nk))continue;
        visited.add(nk);
        treeEdges.push([current,next]);
        stack.push(next);
      }
    }
    if(visited.size!==target.length)return null;
    for(let attempt=0;attempt<5000;attempt++){
      const cutIndices=new Set();
      while(cutIndices.size<k-1)cutIndices.add(Math.floor(rng()*treeEdges.length));
      const adjacency=new Map(target.map(x=>[key(x[0],x[1]),[]]));
      treeEdges.forEach((edge,i)=>{
        if(cutIndices.has(i))return;
        const a=edge[0],b=edge[1],ak=key(a[0],a[1]),bk=key(b[0],b[1]);
        adjacency.get(ak).push(b);
        adjacency.get(bk).push(a);
      });
      const groups=[], seen=new Set();
      for(const root of target){
        const rk=key(root[0],root[1]);
        if(seen.has(rk))continue;
        const group=[], q=[root];seen.add(rk);
        while(q.length){
          const node=q.pop();group.push(node);
          for(const next of adjacency.get(key(node[0],node[1]))){
            const nk=key(next[0],next[1]);
            if(!seen.has(nk)){seen.add(nk);q.push(next);}
          }
        }
        groups.push(group);
      }
      if(groups.length===k&&groups.every(group=>group.length>=2))return groups;
    }
    return null;
  }

  function choosePartition(mask,k,rng){
    for(let tries=0;tries<500;tries++){const p=partition(mask,k,rng);if(p&&p.every(x=>x.length>=2))return p;}
    if(k>2) return choosePartition(mask,k-1,rng);
    for(let tries=0;tries<500;tries++){const p=partition(mask,2,rng);if(p&&p.every(x=>x.length>=2))return p;}
    throw new Error('Unable to partition Shape Architect target into connected pieces.');
  }
  function makeDistractors(rng,count){
    const keys=[];
    for(let i=0;i<count;i++)keys.push(Utils.pick(PIECE_KEYS));
    return keys;
  }
  function makeLevel(index){
    const rng=Utils.mulberry32(0x51A7C000+index*7919);
    const t=TARGETS[index%TARGETS.length];
    const target=cells(t.mask);
    const minPieces=Math.min(2+Math.floor(index/18),7);
    const k=Math.min(minPieces,target.length);
    const parts=choosePartition(target,k,rng);
    const required=parts.map(p=>localize(p));
    const requiredKeys=required.map(p=>({cells:p,name:'required'}));
    const distractorCount=Math.min(4,2+Math.floor(index/30));
    const distractors=makeDistractors(rng,distractorCount).map(key=>({key,cells:ShapeArchitectLibrary.SHAPES[key].cells}));
    const pieces=[...requiredKeys,...distractors].map((p,i)=>({
      id:i,key:p.key||null,cells:p.cells,required:i<required.length,
      label:p.key?ShapeArchitectLibrary.SHAPES[p.key].name:'Puzzle piece'
    }));
    const solution=parts.map((p,i)=>({piece:i,anchor:[0,0],cells:p.map(x=>[x[0],x[1]])}));
    return {number:index+1,name:t.name,hint:t.hint,grid:R,mask:t.mask,requiredCount:required.length,pieces,solution,seed:(0x51A7C000+index*7919)>>>0};
  }
  let cache=null;
  function getAll(){if(!cache)cache=Array.from({length:100},(_,i)=>makeLevel(i));return cache;}
  function validate(level){
    const target=cells(level.mask), targetSet=new Set(target.map(x=>x.join(',')));
    const covered=new Set();
    for(const s of level.solution){
      for(const [r,c] of s.cells){
        if(!targetSet.has(r+','+c)||covered.has(r+','+c))return false;
        covered.add(r+','+c);
      }
    }
    return covered.size===target.length&&level.pieces.length>level.requiredCount&&level.pieces.slice(level.requiredCount).length>=2;
  }
  function get(index){return getAll()[Math.max(0,Math.min(99,index))];}
  return {getAll,get,validate,TARGETS};
})();