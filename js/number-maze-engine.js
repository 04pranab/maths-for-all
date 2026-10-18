/* Number Maze: deterministic procedural boards with a bounded uniqueness solver. */
const root = typeof globalThis !== 'undefined' ? globalThis : this;
const NumberMazeEngine = (() => {
  'use strict';

  const DIFFICULTIES = {
    gentle: { size: 4, minCells: 10, maxCells: 13, spacing: [3, 2] },
    steady: { size: 5, minCells: 16, maxCells: 21, spacing: [4, 3, 2] },
    stretch: { size: 6, minCells: 22, maxCells: 29, spacing: [4, 3, 2] }
  };

  function createRandom(seed) {
    let value = (Number(seed) >>> 0) || 0x6D2B79F5;
    return function random() {
      value += 0x6D2B79F5;
      let t = value;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashSeed(value) {
    const text = String(value);
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) || 1;
  }

  function randomSeed() {
    if (root.crypto && typeof root.crypto.getRandomValues === 'function') {
      const values = new Uint32Array(1);
      root.crypto.getRandomValues(values);
      return values[0] || 1;
    }
    return (Date.now() ^ Math.floor(Math.random() * 0xFFFFFFFF)) >>> 0 || 1;
  }

  function neighbours(cell, size) {
    const row = Math.floor(cell / size);
    const col = cell % size;
    const result = [];
    if (row > 0) result.push(cell - size);
    if (col + 1 < size) result.push(cell + 1);
    if (row + 1 < size) result.push(cell + size);
    if (col > 0) result.push(cell - 1);
    return result;
  }

  function shuffle(items, random) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function buildPath(size, targetLength, random) {
    const total = size * size;
    const starts = shuffle(Array.from({ length: total }, (_, i) => i), random);
    const visited = new Uint8Array(total);
    const path = [];
    let nodes = 0;
    const nodeLimit = 28000;

    function search(current) {
      nodes++;
      if (path.length === targetLength) return true;
      if (nodes > nodeLimit) return false;

      const options = neighbours(current, size)
        .filter(cell => !visited[cell])
        .map(cell => ({
          cell,
          degree: neighbours(cell, size).filter(next => !visited[next]).length,
          tie: random()
        }))
        .sort((a, b) => a.degree - b.degree || a.tie - b.tie);

      for (const option of options) {
        if (path.length < targetLength - 1 && option.degree === 0) continue;
        visited[option.cell] = 1;
        path.push(option.cell);
        if (search(option.cell)) return true;
        path.pop();
        visited[option.cell] = 0;
        if (nodes > nodeLimit) return false;
      }
      return false;
    }

    for (const start of starts) {
      visited.fill(0);
      path.length = 0;
      visited[start] = 1;
      path.push(start);
      if (search(start)) return path.slice();
      if (nodes > nodeLimit) break;
    }
    return null;
  }

  function snakePath(size) {
    const path = [];
    for (let row = 0; row < size; row++) {
      if (row % 2 === 0) {
        for (let col = 0; col < size; col++) path.push(row * size + col);
      } else {
        for (let col = size - 1; col >= 0; col--) path.push(row * size + col);
      }
    }
    return path;
  }

  function makeCheckpoints(path, spacing, phase, size) {
    const checkpoints = [];
    const checkpointAt = new Array(size * size).fill(0);
    const positions = [0];
    for (let position = spacing + phase; position < path.length - 1; position += spacing) {
      positions.push(position);
    }
    if (positions[positions.length - 1] !== path.length - 1) positions.push(path.length - 1);

    positions.forEach((position, index) => {
      const cell = path[position];
      const number = index + 1;
      checkpoints.push({ number, cell });
      checkpointAt[cell] = number;
    });
    return { checkpoints, checkpointAt };
  }

  function countSolutions(puzzle, limit, nodeLimit) {
    const cap = Math.max(1, Number(limit) || 2);
    const maxNodes = Math.max(100, Number(nodeLimit) || 12000);
    if (!puzzle || !Number.isInteger(puzzle.size) || puzzle.size < 2 ||
        !Array.isArray(puzzle.openCells) || !Array.isArray(puzzle.checkpoints) ||
        !puzzle.openCells.length || !puzzle.checkpoints.length) {
      return { count: 0, exhaustive: true, nodes: 0 };
    }

    const total = puzzle.size * puzzle.size;
    const open = new Uint8Array(total);
    const visited = new Uint8Array(total);
    const checkpointAt = new Int16Array(total);
    let valid = true;

    puzzle.openCells.forEach(cell => {
      if (!Number.isInteger(cell) || cell < 0 || cell >= total || open[cell]) valid = false;
      else open[cell] = 1;
    });
    puzzle.checkpoints.forEach(item => {
      if (!item || !Number.isInteger(item.cell) || item.cell < 0 || item.cell >= total ||
          !Number.isInteger(item.number) || item.number < 1 || item.number > puzzle.checkpoints.length ||
          !open[item.cell] || checkpointAt[item.cell]) {
        valid = false;
      } else {
        checkpointAt[item.cell] = item.number;
      }
    });
    if (!valid) return { count: 0, exhaustive: true, nodes: 0 };

    const ordered = puzzle.checkpoints.slice().sort((a, b) => a.number - b.number);
    if (ordered.some((item, index) => item.number !== index + 1) ||
        ordered[0].cell === ordered[ordered.length - 1].cell) {
      return { count: 0, exhaustive: true, nodes: 0 };
    }

    const start = ordered[0].cell;
    const end = ordered[ordered.length - 1].cell;
    const activeCount = puzzle.openCells.length;
    let count = 0;
    let nodes = 0;
    let exhaustive = true;
    const path = [start];
    visited[start] = 1;

    function visit(current, nextCheckpoint, depth) {
      if (count >= cap || !exhaustive) return;
      nodes++;
      if (nodes > maxNodes) {
        exhaustive = false;
        return;
      }
      if (depth === activeCount) {
        if (current === end && nextCheckpoint === ordered.length + 1) count++;
        return;
      }
      if (current === end) return;

      const nextCells = neighbours(current, puzzle.size)
        .filter(cell => open[cell] && !visited[cell]);
      for (const next of nextCells) {
        const label = checkpointAt[next];
        if (label && label !== nextCheckpoint) continue;
        if (next === end && depth + 1 !== activeCount) continue;
        visited[next] = 1;
        path.push(next);
        visit(next, nextCheckpoint + (label ? 1 : 0), depth + 1);
        path.pop();
        visited[next] = 0;
        if (count >= cap || !exhaustive) return;
      }
    }

    if (checkpointAt[start] === 1) visit(start, 2, 1);
    return { count, exhaustive, nodes };
  }

  function buildPuzzle(seed, difficulty, size, path, spacing, phase) {
    const marked = makeCheckpoints(path, spacing, phase, size);
    return {
      seed: seed >>> 0,
      difficulty,
      size,
      openCells: Array.from(new Set(path)).sort((a, b) => a - b),
      checkpoints: marked.checkpoints,
      checkpointAt: Array.from({ length: size * size }, (_, cell) => marked.checkpointAt[cell] || 0),
      start: path[0],
      end: path[path.length - 1],
      solution: path.slice(),
      generatedAt: 'procedural'
    };
  }

  function generate(seed, difficulty) {
    const key = Object.prototype.hasOwnProperty.call(DIFFICULTIES, difficulty) ? difficulty : 'steady';
    const settings = DIFFICULTIES[key];
    const actualSeed = (Number(seed) >>> 0) || 1;
    const random = createRandom(actualSeed);

    for (let attempt = 0; attempt < 26; attempt++) {
      const lengthRange = settings.maxCells - settings.minCells + 1;
      const targetLength = settings.minCells + Math.floor(random() * lengthRange);
      const path = buildPath(settings.size, targetLength, random);
      if (!path) continue;

      const spacings = shuffle(settings.spacing, random);
      for (const spacing of spacings) {
        const phase = Math.floor(random() * Math.min(2, spacing));
        const candidate = buildPuzzle(actualSeed, key, settings.size, path, spacing, phase);
        const result = countSolutions(candidate, 2, 9500);
        if (result.exhaustive && result.count === 1) return candidate;
      }
    }

    /* A bounded, deterministic fallback: a fully constrained valid snake path. */
    const fallbackPath = snakePath(settings.size).slice(0, settings.maxCells);
    const fallback = buildPuzzle(actualSeed, key, settings.size, fallbackPath, 1, 0);
    fallback.generatedAt = 'validated-fallback';
    const verified = countSolutions(fallback, 2, settings.size * settings.size * 4 + 100);
    if (verified.exhaustive && verified.count === 1) return fallback;

    /* This final defensive branch should be unreachable; never return a board
       that has not been verified. */
    throw new Error('Number Maze could not construct a verified puzzle.');
  }

  function validate(puzzle) {
    if (!puzzle || !Number.isInteger(puzzle.size) || puzzle.size < 2 ||
        !Array.isArray(puzzle.openCells) || !Array.isArray(puzzle.solution) ||
        !Array.isArray(puzzle.checkpoints) || puzzle.openCells.length !== puzzle.solution.length ||
        puzzle.solution.length < 2) return false;

    const total = puzzle.size * puzzle.size;
    const open = new Set(puzzle.openCells);
    if (open.size !== puzzle.openCells.length ||
        puzzle.solution.some(cell => !Number.isInteger(cell) || cell < 0 || cell >= total || !open.has(cell)) ||
        new Set(puzzle.solution).size !== puzzle.solution.length ||
        puzzle.solution.some((cell, index) => index > 0 && !neighbours(puzzle.solution[index - 1], puzzle.size).includes(cell))) {
      return false;
    }
    if (open.size !== puzzle.openCells.length || puzzle.openCells.some(cell => !new Set(puzzle.solution).has(cell))) return false;
    if (puzzle.start !== puzzle.solution[0] || puzzle.end !== puzzle.solution[puzzle.solution.length - 1]) return false;
    const ordered = puzzle.checkpoints.slice().sort((a, b) => a.number - b.number);
    if (!ordered.length || ordered.some((item, index) => item.number !== index + 1)) return false;
    if (ordered[0].cell !== puzzle.start || ordered[ordered.length - 1].cell !== puzzle.end) return false;
    let previous = -1;
    for (const checkpoint of ordered) {
      const position = puzzle.solution.indexOf(checkpoint.cell);
      if (position <= previous) return false;
      previous = position;
    }
    const result = countSolutions(puzzle, 2, 30000);
    return result.exhaustive && result.count === 1;
  }

  return {
    DIFFICULTIES,
    neighbours,
    hashSeed,
    randomSeed,
    generate,
    countSolutions,
    validate
  };
})();

if (typeof globalThis !== 'undefined') globalThis.NumberMazeEngine = NumberMazeEngine;
if (typeof module !== 'undefined' && module.exports) module.exports = NumberMazeEngine;
