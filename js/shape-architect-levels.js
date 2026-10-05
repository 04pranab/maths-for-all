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
    const target=cells(mask), set=new Set(target.map(([r,c])=>r+','+c));
    if(k>target.length) return null;
    const shuffled=Utils.seededShuffle(target,rng);
    const pieces=Array.from({length:k},()=>[]);
    const assigned=new Map();
    shuffled.slice(0,k).forEach((cell,i)=>{pieces[i].push(cell);assigned.set(cell.join(','),i);});
    let remaining=new Set(target.slice(k).map(x=>x.join(',')));
    let guard=0;
    while(remaining.size && guard++<10000){
      const frontier=[];
      for(const key of remaining){const [r,c]=key.split(',').map(Number);for(const [nr,nc] of neighbors(r,c))if(assigned.has(nr+','+nc)){frontier.push({r,c,p:assigned.get(nr+','+nc)});break;}}
      if(!frontier.length)return null;
      const pick=Utils.pick(frontier);
      pieces[pick.p].push([pick.r,pick.c]);assigned.set(pick.r+','+pick.c,pick.p);remaining.delete(pick.r+','+pick.c);
    }
    return pieces.map(p=>p.map(([r,c])=>[r,c]));
  }
  function localize(cells){const minR=Math.min(...cells.map(x=>x[0])),minC=Math.min(...cells.map(x=>x[1]));return cells.map(([r,c])=>[r-minR,c-minC]);}
  function signature(cells){return localize(cells).map(x=>x.join(',')).join(';');}
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