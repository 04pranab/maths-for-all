/* ===== Bundled from js/shape-architect-library.js ===== */
/* Shape Architect geometry catalogue. The game uses real geometric primitives, not grid cells. */
const ShapeArchitectLibrary = (() => {
  const SHAPES = {
    circle: { name: "Circle", sides: 0, aspect: 1 },
    square: { name: "Square", sides: 4, aspect: 1 },
    rectangle: { name: "Rectangle", sides: 4, aspect: 1.45 },
    triangle: { name: "Triangle", sides: 3, aspect: 1 },
    trapezium: { name: "Trapezium", sides: 4, aspect: 1.25 },
    parallelogram: { name: "Parallelogram", sides: 4, aspect: 1.3 },
    diamond: { name: "Diamond", sides: 4, aspect: 1 },
    pentagon: { name: "Pentagon", sides: 5, aspect: 1 },
    hexagon: { name: "Hexagon", sides: 6, aspect: 1 },
    oval: { name: "Oval", sides: 0, aspect: 1.45 },
    semicircle: { name: "Semicircle", sides: 0, aspect: 1.2 },
    rightTriangle: { name: "Right triangle", sides: 3, aspect: 1.1 },
  };
  function polygon(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
  }
  function path(ctx, type, w, h) {
    const hw = w / 2,
      hh = h / 2;
    if (type === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(hw, hh), 0, Math.PI * 2);
      return;
    }
    if (type === "oval") {
      ctx.beginPath();
      ctx.ellipse(0, 0, hw, hh, 0, 0, Math.PI * 2);
      return;
    }
    if (type === "semicircle") {
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(hw, hh), Math.PI, 0);
      ctx.lineTo(hw, 0);
      ctx.closePath();
      return;
    }
    if (type === "square" || type === "rectangle") {
      polygon(ctx, [
        [-hw, -hh],
        [hw, -hh],
        [hw, hh],
        [-hw, hh],
      ]);
      return;
    }
    if (type === "triangle") {
      polygon(ctx, [
        [0, -hh],
        [hw, hh],
        [-hw, hh],
      ]);
      return;
    }
    if (type === "rightTriangle") {
      polygon(ctx, [
        [-hw, -hh],
        [-hw, hh],
        [hw, hh],
      ]);
      return;
    }
    if (type === "trapezium") {
      polygon(ctx, [
        [-hw * 0.72, -hh],
        [hw * 0.72, -hh],
        [hw, hh],
        [-hw, hh],
      ]);
      return;
    }
    if (type === "parallelogram") {
      polygon(ctx, [
        [-hw * 0.72, -hh],
        [hw, -hh],
        [hw * 0.72, hh],
        [-hw, hh],
      ]);
      return;
    }
    if (type === "diamond") {
      polygon(ctx, [
        [0, -hh],
        [hw, 0],
        [0, hh],
        [-hw, 0],
      ]);
      return;
    }
    if (type === "pentagon" || type === "hexagon") {
      const n = SHAPES[type].sides,
        points = [];
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / n;
        points.push([Math.cos(a) * hw, Math.sin(a) * hh]);
      }
      polygon(ctx, points);
      return;
    }
    polygon(ctx, [
      [-hw, -hh],
      [hw, -hh],
      [hw, hh],
      [-hw, hh],
    ]);
  }
  function draw(
    ctx,
    piece,
    { fill = "#E8B24A", stroke = "#263238", lineWidth = 3, alpha = 1 } = {},
  ) {
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation || 0);
    ctx.globalAlpha = alpha;
    path(ctx, piece.shape, piece.w, piece.h);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = stroke;
    ctx.stroke();
    ctx.restore();
  }
  function hit(piece, x, y, padding = 10) {
    const dx = x - piece.x,
      dy = y - piece.y,
      a = -(piece.rotation || 0),
      lx = dx * Math.cos(a) - dy * Math.sin(a),
      ly = dx * Math.sin(a) + dy * Math.cos(a),
      hw = piece.w / 2 + padding,
      hh = piece.h / 2 + padding;
    if (piece.shape === "circle")
      return lx * lx + ly * ly <= Math.pow(Math.min(piece.w, piece.h) / 2 + padding, 2);
    if (piece.shape === "oval") return (lx / hw) ** 2 + (ly / hh) ** 2 <= 1;
    return Math.abs(lx) <= hw && Math.abs(ly) <= hh;
  }
  return { SHAPES, path, draw, hit };
})();

;

/* ===== Bundled from js/shape-architect-levels.js ===== */
/* 100 deterministic freeform geometry puzzles. */
const ShapeArchitectLevels = (() => {
  const T = [
    {
      name: "House",
      hint: "Arrange the shapes to make a house.",
      p: [
        ["square", 0.5, 0.62, 0.3, 0.24, 0],
        ["triangle", 0.5, 0.37, 0.36, 0.28, 0],
        ["rectangle", 0.5, 0.79, 0.09, 0.22, 0],
        ["square", 0.39, 0.62, 0.07, 0.07, 0],
        ["square", 0.61, 0.62, 0.07, 0.07, 0],
        ["rectangle", 0.69, 0.31, 0.06, 0.15, 0],
      ],
    },
    {
      name: "Tree",
      hint: "Build the tree from its trunk and canopy.",
      p: [
        ["rectangle", 0.5, 0.73, 0.1, 0.27, 0],
        ["triangle", 0.5, 0.55, 0.42, 0.28, 0],
        ["triangle", 0.5, 0.37, 0.34, 0.26, 0],
        ["circle", 0.5, 0.2, 0.14, 0.14, 0],
        ["triangle", 0.35, 0.67, 0.16, 0.12, -0.35],
        ["triangle", 0.65, 0.67, 0.16, 0.12, 0.35],
      ],
    },
    {
      name: "Fish",
      hint: "Make the fish point the same way as the picture.",
      p: [
        ["oval", 0.48, 0.5, 0.44, 0.25, 0],
        ["triangle", 0.77, 0.5, 0.25, 0.3, 0],
        ["circle", 0.39, 0.46, 0.055, 0.055, 0],
        ["triangle", 0.48, 0.63, 0.16, 0.12, 0.55],
        ["triangle", 0.48, 0.37, 0.16, 0.12, -0.55],
      ],
    },
    {
      name: "Boat",
      hint: "Arrange the hull, mast and sails.",
      p: [
        ["trapezium", 0.5, 0.68, 0.55, 0.22, 0],
        ["rectangle", 0.5, 0.45, 0.035, 0.4, 0],
        ["triangle", 0.39, 0.42, 0.23, 0.31, 0],
        ["triangle", 0.61, 0.38, 0.22, 0.25, 0],
        ["circle", 0.78, 0.18, 0.1, 0.1, 0],
      ],
    },
    {
      name: "Flower",
      hint: "Build the flower with petals, stem and leaves.",
      p: [
        ["circle", 0.5, 0.28, 0.17, 0.17, 0],
        ["circle", 0.39, 0.28, 0.15, 0.15, 0],
        ["circle", 0.61, 0.28, 0.15, 0.15, 0],
        ["circle", 0.5, 0.18, 0.15, 0.15, 0],
        ["circle", 0.5, 0.39, 0.15, 0.15, 0],
        ["rectangle", 0.5, 0.68, 0.06, 0.43, 0],
        ["triangle", 0.39, 0.66, 0.18, 0.13, 0.35],
        ["triangle", 0.61, 0.72, 0.18, 0.13, -0.35],
      ],
    },
    {
      name: "Rocket",
      hint: "Make the rocket ready for launch.",
      p: [
        ["rectangle", 0.5, 0.52, 0.22, 0.46, 0],
        ["triangle", 0.5, 0.23, 0.23, 0.25, 0],
        ["triangle", 0.35, 0.72, 0.17, 0.22, -0.45],
        ["triangle", 0.65, 0.72, 0.17, 0.22, 0.45],
        ["circle", 0.5, 0.48, 0.09, 0.09, 0],
        ["rectangle", 0.5, 0.8, 0.13, 0.1, 0],
      ],
    },
    {
      name: "Car",
      hint: "Build the car and line up its wheels.",
      p: [
        ["rectangle", 0.5, 0.62, 0.56, 0.22, 0],
        ["trapezium", 0.5, 0.47, 0.35, 0.24, 0],
        ["circle", 0.34, 0.78, 0.13, 0.13, 0],
        ["circle", 0.66, 0.78, 0.13, 0.13, 0],
        ["rectangle", 0.5, 0.39, 0.2, 0.06, 0],
        ["square", 0.42, 0.48, 0.09, 0.08, 0],
        ["square", 0.58, 0.48, 0.09, 0.08, 0],
      ],
    },
    {
      name: "Butterfly",
      hint: "Make both sides of the butterfly balance.",
      p: [
        ["oval", 0.39, 0.43, 0.25, 0.3, -0.45],
        ["oval", 0.61, 0.43, 0.25, 0.3, 0.45],
        ["oval", 0.38, 0.65, 0.19, 0.22, 0.35],
        ["oval", 0.62, 0.65, 0.19, 0.22, -0.35],
        ["rectangle", 0.5, 0.55, 0.07, 0.36, 0],
        ["circle", 0.5, 0.34, 0.09, 0.09, 0],
        ["triangle", 0.46, 0.2, 0.11, 0.2, -0.25],
        ["triangle", 0.54, 0.2, 0.11, 0.2, 0.25],
      ],
    },
    {
      name: "Bird",
      hint: "Arrange the body, wing, beak and tail.",
      p: [
        ["oval", 0.5, 0.54, 0.43, 0.28, 0],
        ["circle", 0.69, 0.44, 0.16, 0.16, 0],
        ["triangle", 0.82, 0.46, 0.17, 0.13, 0],
        ["triangle", 0.49, 0.51, 0.22, 0.2, -0.25],
        ["triangle", 0.29, 0.54, 0.2, 0.18, 0.65],
        ["rectangle", 0.52, 0.74, 0.08, 0.22, 0],
      ],
    },
    {
      name: "Kite",
      hint: "Build the kite and its tail.",
      p: [
        ["diamond", 0.5, 0.42, 0.4, 0.47, 0],
        ["circle", 0.5, 0.42, 0.07, 0.07, 0],
        ["triangle", 0.5, 0.69, 0.13, 0.18, 0],
        ["triangle", 0.5, 0.82, 0.12, 0.16, 0],
        ["triangle", 0.5, 0.94, 0.1, 0.12, 0],
        ["rectangle", 0.5, 0.18, 0.05, 0.2, 0],
      ],
    },
    {
      name: "Castle",
      hint: "Build the castle with towers and a gate.",
      p: [
        ["rectangle", 0.5, 0.64, 0.36, 0.34, 0],
        ["rectangle", 0.27, 0.6, 0.14, 0.4, 0],
        ["rectangle", 0.73, 0.6, 0.14, 0.4, 0],
        ["triangle", 0.27, 0.34, 0.18, 0.22, 0],
        ["triangle", 0.73, 0.34, 0.18, 0.22, 0],
        ["triangle", 0.5, 0.41, 0.26, 0.2, 0],
        ["rectangle", 0.5, 0.77, 0.1, 0.22, 0],
        ["circle", 0.27, 0.57, 0.06, 0.06, 0],
        ["circle", 0.73, 0.57, 0.06, 0.06, 0],
      ],
    },
    {
      name: "Robot",
      hint: "Arrange the robot from simple geometric parts.",
      p: [
        ["square", 0.5, 0.38, 0.27, 0.24, 0],
        ["rectangle", 0.5, 0.64, 0.35, 0.28, 0],
        ["rectangle", 0.31, 0.64, 0.09, 0.28, 0],
        ["rectangle", 0.69, 0.64, 0.09, 0.28, 0],
        ["rectangle", 0.5, 0.88, 0.1, 0.24, 0],
        ["circle", 0.45, 0.36, 0.06, 0.06, 0],
        ["circle", 0.55, 0.36, 0.06, 0.06, 0],
        ["rectangle", 0.5, 0.2, 0.05, 0.15, 0],
        ["circle", 0.5, 0.13, 0.08, 0.08, 0],
      ],
    },
    {
      name: "Sun",
      hint: "Build the sun and its rays.",
      p: [
        ["circle", 0.5, 0.5, 0.28, 0.28, 0],
        ["triangle", 0.5, 0.15, 0.13, 0.22, 0],
        ["triangle", 0.5, 0.85, 0.13, 0.22, Math.PI],
        ["triangle", 0.15, 0.5, 0.22, 0.13, -Math.PI / 2],
        ["triangle", 0.85, 0.5, 0.22, 0.13, Math.PI / 2],
        ["diamond", 0.25, 0.25, 0.15, 0.15, 0.78],
        ["diamond", 0.75, 0.25, 0.15, 0.15, -0.78],
        ["diamond", 0.25, 0.75, 0.15, 0.15, -0.78],
        ["diamond", 0.75, 0.75, 0.15, 0.15, 0.78],
      ],
    },
  ];
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a += 0x6d2b79f5;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function make(index) {
    const r = rng(0xa17c000 + index * 104729),
      b = T[index % T.length],
      v = Math.floor(index / T.length),
      s = 0.92 + v * 0.015,
      ox = (r() - 0.5) * 0.03,
      oy = (r() - 0.5) * 0.03;
    const quarterTurn = Math.PI / 4;
    const targetPieces = b.p.map((q, id) => {
      const [shape, x, y, w, h, rotation] = q;
      const snappedRotation = Math.round(rotation / quarterTurn) * quarterTurn;
      return {
        id,
        required: true,
        shape,
        x: clamp(0.5 + (x - 0.5) * s + ox, 0.06, 0.94),
        y: clamp(0.5 + (y - 0.5) * s + oy, 0.07, 0.93),
        w,
        h,
        rotation: snappedRotation,
      };
    });
    const tolerance = { positionMin: 0.12, positionMax: 0.22, positionScale: 0.6, rotation: 0.82 };
    const pieces = targetPieces.map((target) => {
      let x, y, rotation;
      do {
        x = 0.1 + r() * 0.8;
        y = 0.1 + r() * 0.8;
        rotation = target.rotation + (Math.floor(r() * 7) + 1) * quarterTurn;
      } while (Math.hypot(x - target.x, y - target.y) <= tolerance.positionMax);
      return { ...target, x, y, rotation };
    });
    return {
      number: index + 1,
      name: b.name,
      hint: b.hint,
      canvas: { width: 760, height: 520 },
      targetPieces,
      pieces,
      requiredCount: targetPieces.length,
      seed: (0xa17c000 + index * 104729) >>> 0,
      tolerance,
      rotationStep: quarterTurn,
    };
  }
  let cache = null;
  function getAll() {
    if (!cache) cache = Array.from({ length: 100 }, (_, i) => make(i));
    return cache;
  }
  function get(i) {
    return getAll()[Math.max(0, Math.min(99, i))];
  }
  function angleDiff(a, b) {
    let d = Math.abs(a - b) % (Math.PI * 2);
    return d > Math.PI ? Math.PI * 2 - d : d;
  }
  function validate(l) {
    const r = l?.targetPieces || [],
      step = l?.rotationStep || Math.PI / 4;
    return (
      r.length === l.requiredCount &&
      r.length >= 4 &&
      l.pieces.length === r.length &&
      r.every(
        (p, i) =>
          ShapeArchitectLibrary.SHAPES[p.shape] &&
          p.w > 0 &&
          p.h > 0 &&
          p.x > 0 &&
          p.x < 1 &&
          p.y > 0 &&
          p.y < 1 &&
          Number.isFinite(p.rotation) &&
          l.pieces[i]?.required === true &&
          Math.abs(p.rotation / step - Math.round(p.rotation / step)) < 1e-8,
      )
    );
  }
  return { getAll, get, validate, angleDiff, templates: T };
})();

;

/* ===== Bundled from js/shape-architect-canvas.js ===== */
/* Canvas rendering and pointer geometry for Shape Architect. */
const ShapeArchitectCanvas = (() => {
  const W = 760,
    H = 520,
    colors = ["#F4C95D", "#9FD8CB", "#A9C7E8", "#E9A9A9", "#C6B6E7", "#F0B27A", "#B8D98A"];
  function fit(canvas) {
    const rect = canvas.getBoundingClientRect(),
      dpr = Math.min(2, window.devicePixelRatio || 1),
      width = Math.max(1, rect.width),
      height = Math.max(1, rect.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform((dpr * width) / W, 0, 0, (dpr * height) / H, 0, 0);
    return ctx;
  }
  function background(ctx, label, grid = true) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#FFFDF7";
    ctx.fillRect(0, 0, W, H);
    if (grid) {
      ctx.strokeStyle = "rgba(38,50,56,.09)";
      ctx.lineWidth = 1;
      for (let x = 40; x < W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 40; y < H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    }
    if (label) {
      ctx.fillStyle = "rgba(38,50,56,.55)";
      ctx.font = "700 16px sans-serif";
      ctx.fillText(label, 18, 28);
    }
  }
  function toPx(p) {
    return { ...p, x: p.x * W, y: p.y * H, w: p.w * W, h: p.h * H };
  }

  const silhouetteCache = new WeakMap();
  function silhouetteSegments(level) {
    if (silhouetteCache.has(level)) return silhouetteCache.get(level);
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const u = c.getContext("2d", { willReadFrequently: true });
    u.clearRect(0, 0, W, H);
    level.targetPieces.forEach((p) =>
      ShapeArchitectLibrary.draw(u, toPx(p), { fill: "#000", stroke: "#000", lineWidth: 1 }),
    );
    const d = u.getImageData(0, 0, W, H).data,
      segments = [];
    const on = (x, y) => x >= 0 && x < W && y >= 0 && y < H && d[(y * W + x) * 4 + 3] > 32;

    for (let y = 0; y < H; y++) {
      let topStart = -1,
        bottomStart = -1;
      for (let x = 0; x <= W; x++) {
        const inside = x < W && on(x, y);
        const top = inside && !on(x, y - 1);
        const bottom = inside && !on(x, y + 1);
        if (top && topStart < 0) topStart = x;
        if ((!top || x === W) && topStart >= 0) {
          segments.push([topStart, y, x, y]);
          topStart = -1;
        }
        if (bottom && bottomStart < 0) bottomStart = x;
        if ((!bottom || x === W) && bottomStart >= 0) {
          segments.push([bottomStart, y + 1, x, y + 1]);
          bottomStart = -1;
        }
      }
    }
    for (let x = 0; x < W; x++) {
      let leftStart = -1,
        rightStart = -1;
      for (let y = 0; y <= H; y++) {
        const inside = y < H && on(x, y);
        const left = inside && !on(x - 1, y);
        const right = inside && !on(x + 1, y);
        if (left && leftStart < 0) leftStart = y;
        if ((!left || y === H) && leftStart >= 0) {
          segments.push([x, leftStart, x, y]);
          leftStart = -1;
        }
        if (right && rightStart < 0) rightStart = y;
        if ((!right || y === H) && rightStart >= 0) {
          segments.push([x + 1, rightStart, x + 1, y]);
          rightStart = -1;
        }
      }
    }
    silhouetteCache.set(level, segments);
    return segments;
  }

  function drawSilhouette(ctx, level) {
    ctx.save();
    ctx.strokeStyle = "rgba(38,50,56,.20)";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    silhouetteSegments(level).forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
    ctx.restore();
  }

  function maskForPieces(pieces, scale = 0.5) {
    const width = Math.round(W * scale),
      height = Math.round(H * scale),
      c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.clearRect(0, 0, width, height);
    pieces.forEach((p) =>
      ShapeArchitectLibrary.draw(
        ctx,
        { ...p, x: p.x * width, y: p.y * height, w: p.w * width, h: p.h * height },
        { fill: "#fff", stroke: "#fff", lineWidth: 1 },
      ),
    );
    return { canvas: c, data: ctx.getImageData(0, 0, width, height).data, width, height };
  }

  function maskStats(a, b) {
    let target = 0,
      current = 0,
      intersection = 0;
    for (let i = 3; i < a.data.length; i += 4) {
      const at = a.data[i] > 32,
        bt = b.data[i] > 32;
      if (at) target++;
      if (bt) current++;
      if (at && bt) intersection++;
    }
    return {
      targetCoverage: target ? intersection / target : 0,
      currentCoverage: current ? intersection / current : 0,
      spill: current ? Math.max(0, current - intersection) / current : 1,
    };
  }

  function visualMatch(level, pieces) {
    const scale = 0.5,
      target = maskForPieces(level.targetPieces, scale),
      current = maskForPieces(pieces, scale);
    let minTargetCoverage = 1,
      minCurrentCoverage = 1,
      maxSpill = 0,
      placedCount = 0;
    for (let i = 0; i < level.targetPieces.length; i++) {
      const a = maskForPieces([level.targetPieces[i]], scale);
      const b = maskForPieces([pieces[i]], scale);
      const s = maskStats(a, b);
      const placed = s.targetCoverage >= 0.62 && s.currentCoverage >= 0.62 && s.spill <= 0.38;
      if (placed) placedCount++;
      minTargetCoverage = Math.min(minTargetCoverage, s.targetCoverage);
      minCurrentCoverage = Math.min(minCurrentCoverage, s.currentCoverage);
      maxSpill = Math.max(maxSpill, s.spill);
    }
    const union = maskStats(target, current);
    return {
      complete:
        placedCount === level.targetPieces.length &&
        union.targetCoverage >= 0.88 &&
        union.spill <= 0.16,
      placedCount,
      minTargetCoverage,
      minCurrentCoverage,
      maxSpill,
      unionCoverage: union.targetCoverage,
      unionSpill: union.spill,
    };
  }

  function drawReference(canvas, level) {
    const ctx = fit(canvas);
    background(ctx, "Reference picture");
    level.targetPieces.forEach((p, i) =>
      ShapeArchitectLibrary.draw(ctx, toPx(p), {
        fill: colors[i % colors.length],
        stroke: "#263238",
        lineWidth: 3,
      }),
    );
  }
  function drawBuild(canvas, level, pieces, selectedId, hintId) {
    const ctx = fit(canvas);
    background(ctx, "Build it here", false);
    drawSilhouette(ctx, level);
    if (hintId !== null) {
      const target = level.targetPieces.find((p) => p.id === hintId);
      ShapeArchitectLibrary.draw(ctx, toPx(target), {
        fill: "rgba(244,201,93,.18)",
        stroke: "#D98B24",
        lineWidth: 5,
        alpha: 0.7,
      });
    }
    pieces.forEach((p, i) =>
      ShapeArchitectLibrary.draw(ctx, toPx(p), {
        fill: colors[i % colors.length],
        stroke: i === selectedId ? "#9A6A00" : "#263238",
        lineWidth: i === selectedId ? 6 : 3,
      }),
    );
  }
  function pointer(canvas, e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
    };
  }
  function hitTest(canvas, pieces, e) {
    const p = pointer(canvas, e);
    for (let i = pieces.length - 1; i >= 0; i--) {
      const q = toPx(pieces[i]);
      if (ShapeArchitectLibrary.hit(q, p.x * W, p.y * H, 8)) return i;
    }
    return -1;
  }
  return { W, H, fit, pointer, hitTest, drawReference, drawBuild, silhouetteSegments, visualMatch };
})();

;

/* ===== Bundled from js/shape-architect-grid.js ===== */
/* Shape Architect board/grid primitives. Rendering is kept separate from puzzle state so
   pointer movement can update only the preview instead of rebuilding the board. */
const ShapeArchitectGrid = (() => {
  const SIZE = 8;

  function cell(board, r, c) {
    return board?.querySelector('.architect-cell[data-r="' + r + '"][data-c="' + c + '"]') || null;
  }

  function render(board, mask, placements, getCells) {
    board.innerHTML = "";
    const fragment = document.createDocumentFragment();
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const el = document.createElement("div");
        el.className = "architect-cell " + (mask[r][c] === "#" ? "target" : "empty");
        el.dataset.r = r;
        el.dataset.c = c;
        if (mask[r][c] === "#") {
          el.tabIndex = 0;
          el.setAttribute("role", "gridcell");
          el.setAttribute("aria-label", "Picture square " + (r + 1) + ", " + (c + 1));
        }
        fragment.appendChild(el);
      }
    }
    board.appendChild(fragment);
    for (const [id, placement] of placements) paintPlacement(board, id, placement, getCells, false);
  }

  function paintPlacement(board, id, placement, getCells, preview) {
    for (const [rr, cc] of getCells(id, placement.rot)) {
      const el = cell(board, placement.r + rr, placement.c + cc);
      if (el) {
        el.classList.add(preview ? "preview" : "filled");
        if (!preview) el.dataset.piece = String(id + 1);
      }
    }
  }

  function clearPreview(board) {
    board?.querySelectorAll(".architect-cell.preview").forEach((el) => {
      el.classList.remove("preview", "preview-invalid");
    });
  }

  function paintPreview(board, cells, valid) {
    clearPreview(board);
    for (const [r, c] of cells) {
      const el = cell(board, r, c);
      if (el && r >= 0 && c >= 0 && r < SIZE && c < SIZE) {
        el.classList.add("preview");
        el.classList.toggle("preview-invalid", !valid);
      }
    }
  }

  function pointerCell(board, event) {
    const rect = board.getBoundingClientRect();
    const size = rect.width / SIZE;
    return [
      Math.max(0, Math.min(SIZE - 1, Math.floor((event.clientY - rect.top) / size))),
      Math.max(0, Math.min(SIZE - 1, Math.floor((event.clientX - rect.left) / size))),
    ];
  }

  function createDragGhost(cells, rot, id) {
    const ghost = document.createElement("div");
    ghost.className = "architect-drag-ghost";
    ghost.setAttribute("aria-hidden", "true");
    const oriented = cells(rot);
    const bounds = ShapeArchitectLibrary.bounds(oriented);
    ghost.style.setProperty("--rows", bounds.rows);
    ghost.style.setProperty("--cols", bounds.cols);
    ghost.innerHTML = oriented
      .map(([r, c]) => '<i style="grid-row:' + (r + 1) + ";grid-column:" + (c + 1) + '"></i>')
      .join("");
    ghost.dataset.piece = String(id + 1);
    document.body.appendChild(ghost);
    return ghost;
  }

  function moveDragGhost(ghost, x, y) {
    if (ghost) ghost.style.transform = "translate3d(" + (x + 14) + "px," + (y + 14) + "px,0)";
  }

  function removeDragGhost(ghost) {
    ghost?.remove();
  }

  return {
    SIZE,
    cell,
    render,
    paintPlacement,
    clearPreview,
    paintPreview,
    pointerCell,
    createDragGhost,
    moveDragGhost,
    removeDragGhost,
  };
})();

;

/* ===== Bundled from js/shape-architect-solver.js ===== */
const ShapeArchitectSolver = (() => {
  function hasExactSolution(level) {
    if (!ShapeArchitectLevels.validate(level)) return false;
    const required = level.targetPieces || [];
    return (
      required.length === level.requiredCount &&
      required.every(
        (p) =>
          Number.isFinite(p.x) &&
          Number.isFinite(p.y) &&
          Number.isFinite(p.rotation) &&
          ShapeArchitectLibrary.SHAPES[p.shape],
      )
    );
  }
  return { hasExactSolution };
})();

;

/* ===== Bundled from js/shape-architect.js ===== */
const ShapeArchitect = (() => {
  const state = {
    level: 0,
    data: null,
    pieces: [],
    selected: null,
    startedAt: 0,
    timer: null,
    drag: null,
    history: [],
    hints: 0,
    raf: 0,
    hintId: null,
  };
  const els = (id) => document.getElementById(id),
    progressKey = "mfa_shape_architect_v2";
  function progress() {
    try {
      return JSON.parse(localStorage.getItem(progressKey)) || { done: {}, best: {} };
    } catch {
      return { done: {}, best: {} };
    }
  }
  function save(p) {
    try {
      localStorage.setItem(progressKey, JSON.stringify(p));
    } catch {}
  }
  const fmt = (s) =>
      Math.floor(Math.max(0, s) / 60) +
      ":" +
      String(Math.floor(Math.max(0, s) % 60)).padStart(2, "0"),
    elapsed = () => performance.now() - state.startedAt;
  function announce(t) {
    const e = els("architect-message");
    if (e) {
      e.textContent = t;
      e.classList.remove("hidden");
    }
  }
  function renderLevels() {
    const p = progress(),
      g = els("architect-level-grid");
    g.innerHTML = "";
    for (let i = 0; i < 100; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "architect-level-btn" + (p.done[i + 1] ? " done" : "");
      b.textContent = i + 1;
      b.setAttribute("aria-label", "Level " + (i + 1) + (p.done[i + 1] ? ", completed" : ""));
      b.onclick = () => load(i);
      g.appendChild(b);
    }
    els("architect-progress").textContent = Object.keys(p.done).length + " / 100 pictures built";
  }
  function miniPreview(piece, c) {
    const ctx = c.getContext("2d"),
      w = c.width,
      h = c.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#FFFDF7";
    ctx.fillRect(0, 0, w, h);
    ShapeArchitectLibrary.draw(
      ctx,
      {
        ...piece,
        x: w / 2,
        y: h / 2,
        w: Math.min(w * 0.62, piece.w * 280),
        h: Math.min(h * 0.62, piece.h * 280),
        rotation: piece.rotation,
      },
      { fill: "#E8B24A", stroke: "#263238", lineWidth: 2 },
    );
  }
  function nearTarget(p, t) {
    const tolerance = state.data.tolerance;
    const size = Math.hypot(t.w, t.h);
    const positionTolerance = Math.max(
      tolerance.positionMin,
      Math.min(tolerance.positionMax, size * tolerance.positionScale),
    );
    return (
      Math.hypot(p.x - t.x, p.y - t.y) <= positionTolerance &&
      ShapeArchitectLevels.angleDiff(p.rotation, t.rotation) <= tolerance.rotation
    );
  }
  function updatePlaced() {
    if (!state.data) return;
    const match = ShapeArchitectCanvas.visualMatch(state.data, state.pieces);
    els("architect-placed").textContent = match.placedCount + "/" + state.data.requiredCount;
  }
  function draw() {
    ShapeArchitectCanvas.drawReference(els("architect-reference-canvas"), state.data);
    ShapeArchitectCanvas.drawBuild(
      els("architect-build-canvas"),
      state.data,
      state.pieces,
      state.selected,
      state.hintId,
    );
  }
  function select(i) {
    if (i < 0) return;
    state.selected = i;
    updatePlaced();
    draw();
    announce(
      ShapeArchitectLibrary.SHAPES[state.pieces[i].shape].name +
        " selected. Drag it into place, or use the arrow keys to move it.",
    );
  }
  function pushHistory() {
    state.history.push(state.pieces.map((p) => ({ x: p.x, y: p.y, rotation: p.rotation })));
    if (state.history.length > 30) state.history.shift();
  }
  function pointer(e) {
    return ShapeArchitectCanvas.pointer(els("architect-build-canvas"), e);
  }
  function startDrag(e) {
    const canvas = els("architect-build-canvas"),
      hit = ShapeArchitectCanvas.hitTest(canvas, state.pieces, e);
    if (hit < 0) return;
    e.preventDefault();
    select(hit);
    const p = pointer(e),
      piece = state.pieces[hit];
    pushHistory();
    state.drag = {
      id: hit,
      offsetX: p.x - piece.x,
      offsetY: p.y - piece.y,
      pointerId: e.pointerId,
      lastX: p.x,
      lastY: p.y,
    };
    canvas.setPointerCapture?.(e.pointerId);
  }
  function moveDrag(e) {
    if (!state.drag) return;
    const p = pointer(e);
    state.drag.lastX = p.x;
    state.drag.lastY = p.y;
    if (state.raf) return;
    state.raf = requestAnimationFrame(() => {
      state.raf = 0;
      if (!state.drag) return;
      const d = state.drag,
        p = state.pieces[d.id];
      p.x = Math.max(0.03, Math.min(0.97, d.lastX - d.offsetX));
      p.y = Math.max(0.04, Math.min(0.96, d.lastY - d.offsetY));
      draw();
    });
  }
  function endDrag() {
    if (!state.drag) return;
    state.drag = null;
    if (state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }
    updatePlaced();
    checkComplete();
  }
  function rotateSelected() {
    if (state.selected === null) return;
    pushHistory();
    state.pieces[state.selected].rotation += Math.PI / 4;
    draw();
    updatePlaced();
    checkComplete();
  }
  function moveSelected(dx, dy) {
    if (state.selected === null) return;
    pushHistory();
    const p = state.pieces[state.selected];
    p.x = Math.max(0.03, Math.min(0.97, p.x + dx));
    p.y = Math.max(0.04, Math.min(0.96, p.y + dy));
    draw();
    updatePlaced();
    checkComplete();
  }
  function undo() {
    const h = state.history.pop();
    if (!h) return;
    h.forEach((p, i) => Object.assign(state.pieces[i], p));
    draw();
    updatePlaced();
    announce("Last movement undone.");
  }
  function hint() {
    const id = state.pieces.findIndex(
      (p) => p.required && !nearTarget(p, state.data.targetPieces[p.id]),
    );
    if (id < 0) {
      announce("The picture is already complete.");
      return;
    }
    state.hints++;
    state.hintId = id;
    draw();
    announce(
      "The glowing outline shows where the " +
        ShapeArchitectLibrary.SHAPES[state.pieces[id].shape].name.toLowerCase() +
        " belongs.",
    );
    setTimeout(() => {
      if (state.hintId === id) {
        state.hintId = null;
        draw();
      }
    }, 1400);
  }
  function tick() {
    els("architect-timer").textContent = fmt(elapsed() / 1000);
  }
  function stop() {
    clearInterval(state.timer);
    state.timer = null;
  }
  function load(i) {
    stop();
    state.level = i;
    const source = ShapeArchitectLevels.get(i);
    state.data = {
      ...source,
      targetPieces: source.targetPieces.map((p) => ({ ...p })),
      pieces: source.pieces.map((p) => ({ ...p })),
    };
    state.pieces = state.data.pieces.map((p) => ({ ...p }));
    state.selected = null;
    state.history = [];
    state.hints = 0;
    state.hintId = null;
    state.startedAt = performance.now();
    state.timer = setInterval(tick, 250);
    hide("architect-level-panel");
    hide("architect-complete");
    show("architect-play-panel");
    els("architect-level-num").textContent = i + 1;
    els("architect-target-name").textContent = state.data.name;
    els("architect-target-hint").textContent = state.data.hint;
    els("architect-timer").textContent = "0:00";
    els("architect-message").classList.add("hidden");
    updatePlaced();
    draw();
    announce(state.data.hint);
  }
  function restart() {
    if (state.data) load(state.level);
  }
  function checkComplete() {
    if (!state.data) return false;
    const match = ShapeArchitectCanvas.visualMatch(state.data, state.pieces);
    if (match.complete) complete();
    return match.complete;
  }
  function complete() {
    stop();
    const s = elapsed() / 1000,
      p = progress();
    p.done[state.level + 1] = true;
    p.best[state.level + 1] = Math.min(p.best[state.level + 1] || Infinity, s);
    save(p);
    els("architect-complete-time").textContent = fmt(s);
    els("architect-complete-name").textContent = state.data.name;
    els("architect-complete").classList.remove("hidden");
    els("architect-play-panel").classList.add("hidden");
    Analytics.log("shape_architect", "complete", {
      level: state.level + 1,
      time: Math.round(s),
      hints: state.hints,
    });
    renderLevels();
  }
  function next() {
    load((state.level + 1) % 100);
  }
  function backToLevels() {
    stop();
    hide("architect-play-panel");
    hide("architect-complete");
    show("architect-level-panel");
    renderLevels();
  }
  function keyboard(e) {
    if (
      !document.getElementById("screen-architect")?.classList.contains("active") ||
      isTypingTarget(e.target)
    )
      return;
    if ((e.key === "Enter" || e.key === " ") && e.target?.id === "architect-build-canvas") {
      e.preventDefault();
      if (state.pieces.length) {
        const start = state.selected === null ? -1 : state.selected;
        select((start + 1) % state.pieces.length);
      }
      return;
    }
    if (e.key.toLowerCase() === "r") {
      e.preventDefault();
      rotateSelected();
      return;
    }
    if (e.key === "Escape") {
      if (state.selected !== null) {
        e.preventDefault();
        state.selected = null;
        updatePlaced();
        draw();
        announce("Piece deselected.");
      }
      return;
    }
    if (state.selected === null) return;
    const step = e.shiftKey ? 0.02 : 0.01;
    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown"
    ) {
      e.preventDefault();
      moveSelected(
        e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0,
        e.key === "ArrowDown" ? step : e.key === "ArrowUp" ? -step : 0,
      );
    }
  }
  function resize() {
    if (state.data) draw();
  }
  function init() {
    renderLevels();
    show("architect-level-panel");
    hide("architect-play-panel");
    hide("architect-complete");
    const c = els("architect-build-canvas");
    c.addEventListener("pointerdown", startDrag);
    c.addEventListener("pointermove", moveDrag);
    c.addEventListener("pointerup", endDrag);
    c.addEventListener("pointercancel", endDrag);
    window.addEventListener("resize", resize);
  }
  document.addEventListener("keydown", keyboard);
  return {
    init,
    load,
    restart,
    next,
    backToLevels,
    rotateSelected,
    undo,
    hint,
    getLevels: () => ShapeArchitectLevels.getAll(),
    isNearTarget: nearTarget,
    checkComplete,
  };
})();
