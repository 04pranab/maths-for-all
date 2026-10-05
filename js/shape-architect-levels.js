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
    if(k<2||k>Math.floor(target.length/2))return null;
    const key=(r,c)=>r+','+c;
    const targetKeys=new Set(target.map(x=>key(x[0],x[1])));
    for(let attempt=0;attempt<2000;attempt++){
      const seeds=Utils.seededShuffle(target,rng).slice(0,k);
      const owner=new Map();
      const queues=Array.from({length:k},()=>[]);
      seeds.forEach((cell,i)=>{const id=key(cell[0],cell[1]);owner.set(id,i);queues[i].push(cell);});
      const frontier=[];
      for(let i=0;i<k;i++)frontier.push(...queues[i].map(cell=>({cell,p:i})));
      let cursor=0;
      while(cursor<frontier.length){
        const current=frontier[cursor++];
        const options=Utils.seededShuffle(neighbors(current.cell[0],current.cell[1]),rng);
        for(const next of options){
          const id=key(next[0],next[1]);
          if(!targetKeys.has(id)||owner.has(id))continue;
          owner.set(id,current.p);
          frontier.push({cell:next,p:current.p});
        }
      }
      if(owner.size!==target.length)continue;
      const groups=Array.from({length:k},()=>[]);
      for(const cell of target)groups[owner.get(key(cell[0],cell[1]))].push(cell);
      if(groups.every(group=>group.length>=2))return groups;
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