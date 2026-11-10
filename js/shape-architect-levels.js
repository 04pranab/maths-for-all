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
