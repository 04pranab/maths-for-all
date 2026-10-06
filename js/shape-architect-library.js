/* Shape Architect geometry catalogue. The game uses real geometric primitives, not grid cells. */
const ShapeArchitectLibrary = (() => {
  const SHAPES = {
    circle:{name:'Circle',sides:0,aspect:1},square:{name:'Square',sides:4,aspect:1},
    rectangle:{name:'Rectangle',sides:4,aspect:1.45},triangle:{name:'Triangle',sides:3,aspect:1},
    trapezium:{name:'Trapezium',sides:4,aspect:1.25},parallelogram:{name:'Parallelogram',sides:4,aspect:1.3},
    diamond:{name:'Diamond',sides:4,aspect:1},pentagon:{name:'Pentagon',sides:5,aspect:1},
    hexagon:{name:'Hexagon',sides:6,aspect:1},oval:{name:'Oval',sides:0,aspect:1.45},
    semicircle:{name:'Semicircle',sides:0,aspect:1.2},rightTriangle:{name:'Right triangle',sides:3,aspect:1.1}
  };
  function polygon(ctx,points){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();}
  function path(ctx,type,w,h){
    const hw=w/2,hh=h/2;
    if(type==='circle'){ctx.beginPath();ctx.arc(0,0,Math.min(hw,hh),0,Math.PI*2);return;}
    if(type==='oval'){ctx.beginPath();ctx.ellipse(0,0,hw,hh,0,0,Math.PI*2);return;}
    if(type==='semicircle'){ctx.beginPath();ctx.arc(0,0,Math.min(hw,hh),Math.PI,0);ctx.lineTo(hw,0);ctx.closePath();return;}
    if(type==='square'||type==='rectangle'){polygon(ctx,[[-hw,-hh],[hw,-hh],[hw,hh],[-hw,hh]]);return;}
    if(type==='triangle'){polygon(ctx,[[0,-hh],[hw,hh],[-hw,hh]]);return;}
    if(type==='rightTriangle'){polygon(ctx,[[-hw,-hh],[-hw,hh],[hw,hh]]);return;}
    if(type==='trapezium'){polygon(ctx,[[-hw*.72,-hh],[hw*.72,-hh],[hw,hh],[-hw,hh]]);return;}
    if(type==='parallelogram'){polygon(ctx,[[-hw*.72,-hh],[hw,-hh],[hw*.72,hh],[-hw,hh]]);return;}
    if(type==='diamond'){polygon(ctx,[[0,-hh],[hw,0],[0,hh],[-hw,0]]);return;}
    if(type==='pentagon'||type==='hexagon'){const n=SHAPES[type].sides,points=[];for(let i=0;i<n;i++){const a=-Math.PI/2+i*Math.PI*2/n;points.push([Math.cos(a)*hw,Math.sin(a)*hh]);}polygon(ctx,points);return;}
    polygon(ctx,[[-hw,-hh],[hw,-hh],[hw,hh],[-hw,hh]]);
  }
  function draw(ctx,piece,{fill='#E8B24A',stroke='#263238',lineWidth=3,alpha=1}={}){ctx.save();ctx.translate(piece.x,piece.y);ctx.rotate(piece.rotation||0);ctx.globalAlpha=alpha;path(ctx,piece.shape,piece.w,piece.h);ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=lineWidth;ctx.strokeStyle=stroke;ctx.stroke();ctx.restore();}
  function hit(piece,x,y,padding=10){const dx=x-piece.x,dy=y-piece.y,a=-(piece.rotation||0),lx=dx*Math.cos(a)-dy*Math.sin(a),ly=dx*Math.sin(a)+dy*Math.cos(a),hw=piece.w/2+padding,hh=piece.h/2+padding;if(piece.shape==='circle')return lx*lx+ly*ly<=Math.pow(Math.min(piece.w,piece.h)/2+padding,2);if(piece.shape==='oval')return(lx/hw)**2+(ly/hh)**2<=1;return Math.abs(lx)<=hw&&Math.abs(ly)<=hh;}
  return {SHAPES,path,draw,hit};
})();