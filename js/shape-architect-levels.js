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
    if(k !== 3) return null;
    const target=cells(mask);
    if(target.length < k*2) return null;
    const key=(r,c)=>r+','+c;
    const targetSet=new Set(target.map(x=>key(x[0],x[1])));
    const neighborsOf=([r,c])=>neighbors(r,c).filter(([rr,cc])=>targetSet.has(key(rr,cc)));

    /* A randomized spanning tree gives a simple guarantee: every component
       remains connected after tree edges are cut. We test pairs of cuts and
       keep only useful pieces with at least two cells. */
    const root=Utils.pick(target), seen=new Set([key(root[0],root[1])]), stack=[root], edges=[];
    while(stack.length){
      const current=stack.pop();
      const next=Utils.seededShuffle(neighborsOf(current),rng);
      for(const n of next){
        const id=key(n[0],n[1]);
        if(seen.has(id))continue;
        seen.add(id);
        edges.push([current,n]);
        stack.push(n);
      }
    }
    if(edges.length !== target.length-1)return null;

    for(let a=0;a<edges.length;a++){
      for(let b=a+1;b<edges.length;b++){
        const blocked=new Set([a,b]);
        const groups=[];
        const unvisited=new Set(target.map(x=>key(x[0],x[1])));
        while(unvisited.size){
          const seedId=unvisited.values().next().value;
          const seed=seedId.split(',').map(Number);
          const group=[], todo=[seed];
          unvisited.delete(seedId);
          while(todo.length){
            const current=todo.pop();
            group.push(current);
            for(let i=0;i<edges.length;i++){
              if(blocked.has(i))continue;
              const [u,v]=edges[i];
              const same=(u[0]===current[0]&&u[1]===current[1])||(v[0]===current[0]&&v[1]===current[1]);
              if(!same)continue;
              const next=(u[0]===current[0]&&u[1]===current[1])?v:u;
              const nextId=key(next[0],next[1]);
              if(unvisited.has(nextId)){unvisited.delete(nextId);todo.push(next);}
            }
          }
          groups.push(group);
        }
        if(groups.length===3&&groups.every(group=>group.length>=2))return groups;
      }
    }
    return null;
  }

  function localize(cells){
    const minR=Math.min(...cells.map(x=>x[0])),minC=Math.min(...cells.map(x=>x[1]));
    return cells.map(([r,c])=>[r-minR,c-minC]);
  }

  function choosePartition(mask,k,rng){
    for(let tries=0;tries<80;tries++){
      const p=partition(mask,k,rng);
      if(p&&p.length===k&&p.every(x=>x.length>=2))return p;
    }
    throw new Error('Unable to partition Shape Architect target into three connected pieces.');
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
    const k=3;
    let parts; try { parts=choosePartition(t.mask,k,rng); } catch(error) { throw new Error('Shape Architect target '+t.name+' level '+(index+1)+': '+error.message); }
    if(!parts)throw new Error('Shape Architect target '+t.name+' level '+(index+1)+' could not be partitioned.');
    const required=parts.map(p=>localize(p));
    const requiredKeys=required.map(p=>({cells:p,name:'required'}));
    const distractorCount=3;
    const distractors=makeDistractors(rng,distractorCount).map(key=>({key,cells:ShapeArchitectLibrary.SHAPES[key].cells}));
    const pieces=[...requiredKeys,...distractors].map((p,i)=>({
      id:i,key:p.key||null,cells:p.cells,required:i<required.length,
      label:p.key?ShapeArchitectLibrary.SHAPES[p.key].name:'Puzzle piece',
      startRot:p.key?((index+i+1)%4):((index*2+i)%4)
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