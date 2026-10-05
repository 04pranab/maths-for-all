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
  function connected(group){
    if(!group.length)return false;
    const key=(r,c)=>r+','+c, set=new Set(group.map(x=>key(x[0],x[1])));
    const seen=new Set([key(group[0][0],group[0][1])]), stack=[group[0]];
    while(stack.length){const cell=stack.pop();for(const n of neighbors(cell[0],cell[1])){const id=key(n[0],n[1]);if(set.has(id)&&!seen.has(id)){seen.add(id);stack.push(n);}}}
    return seen.size===group.length;
  }
  function partition(mask,k,rng){
    const target=cells(mask);
    if(k!==2||target.length<4)return null;
    for(let cut=1;cut<R;cut++){
      const top=target.filter(([r])=>r<cut),bottom=target.filter(([r])=>r>=cut);
      if(top.length>=2&&bottom.length>=2&&connected(top)&&connected(bottom))return [top,bottom];
      const left=target.filter(([,c])=>c<cut),right=target.filter(([,c])=>c>=cut);
      if(left.length>=2&&right.length>=2&&connected(left)&&connected(right))return [left,right];
    }
    const key=(r,c)=>r+','+c,targetKeys=new Set(target.map(x=>key(x[0],x[1])));
    for(let attempt=0;attempt<1000;attempt++){
      const first=Utils.pick(target), firstId=key(first[0],first[1]);
      const groupA=[first], setA=new Set([firstId]);
      const candidates=Utils.seededShuffle(target.filter(x=>key(x[0],x[1])!==firstId),rng);
      for(const cell of candidates){
        const neighborsOfA=neighbors(cell[0],cell[1]).some(([r,c])=>setA.has(key(r,c)));
        if(neighborsOfA&&groupA.length<target.length-2){groupA.push(cell);setA.add(key(cell[0],cell[1]));}
      }
      const groupB=target.filter(x=>!setA.has(key(x[0],x[1])));
      if(groupA.length>=2&&groupB.length>=2&&connected(groupA)&&connected(groupB))return [groupA,groupB];
    }
    return null;
  }

  function localize(cells){
    const minR=Math.min(...cells.map(x=>x[0])),minC=Math.min(...cells.map(x=>x[1]));
    return cells.map(([r,c])=>[r-minR,c-minC]);
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
    const minPieces=2;
    const k=2;
    let parts; try { parts=choosePartition(t.mask,k,rng); } catch(error) { throw new Error('Shape Architect target '+t.name+' level '+(index+1)+': '+error.message); }
    if(!parts)throw new Error('Shape Architect target '+t.name+' level '+(index+1)+' could not be partitioned.');
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