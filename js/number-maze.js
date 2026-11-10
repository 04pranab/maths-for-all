/* ===== Bundled from js/number-maze-engine.js ===== */
/* Number Maze: deterministic procedural boards with a bounded uniqueness solver. */
const root = typeof globalThis !== "undefined" ? globalThis : this;
const NumberMazeEngine = (() => {
  "use strict";

  const DIFFICULTIES = {
    gentle: { size: 4, minCells: 10, maxCells: 13, spacing: [3, 2] },
    steady: { size: 5, minCells: 16, maxCells: 21, spacing: [4, 3, 2] },
    stretch: { size: 6, minCells: 22, maxCells: 29, spacing: [4, 3, 2] },
  };

  function createRandom(seed) {
    let value = Number(seed) >>> 0 || 0x6d2b79f5;
    return function random() {
      value += 0x6d2b79f5;
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
    return hash >>> 0 || 1;
  }

  function randomSeed() {
    if (root.crypto && typeof root.crypto.getRandomValues === "function") {
      const values = new Uint32Array(1);
      root.crypto.getRandomValues(values);
      return values[0] || 1;
    }
    return (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0 || 1;
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
    const starts = shuffle(
      Array.from({ length: total }, (_, i) => i),
      random,
    );
    const visited = new Uint8Array(total);
    const path = [];
    let nodes = 0;
    const nodeLimit = 28000;

    function search(current) {
      nodes++;
      if (path.length === targetLength) return true;
      if (nodes > nodeLimit) return false;

      const options = neighbours(current, size)
        .filter((cell) => !visited[cell])
        .map((cell) => ({
          cell,
          degree: neighbours(cell, size).filter((next) => !visited[next]).length,
          tie: random(),
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
    if (
      !puzzle ||
      !Number.isInteger(puzzle.size) ||
      puzzle.size < 2 ||
      !Array.isArray(puzzle.openCells) ||
      !Array.isArray(puzzle.checkpoints) ||
      !puzzle.openCells.length ||
      !puzzle.checkpoints.length
    ) {
      return { count: 0, exhaustive: true, nodes: 0 };
    }

    const total = puzzle.size * puzzle.size;
    const open = new Uint8Array(total);
    const visited = new Uint8Array(total);
    const checkpointAt = new Int16Array(total);
    let valid = true;

    puzzle.openCells.forEach((cell) => {
      if (!Number.isInteger(cell) || cell < 0 || cell >= total || open[cell]) valid = false;
      else open[cell] = 1;
    });
    puzzle.checkpoints.forEach((item) => {
      if (
        !item ||
        !Number.isInteger(item.cell) ||
        item.cell < 0 ||
        item.cell >= total ||
        !Number.isInteger(item.number) ||
        item.number < 1 ||
        item.number > puzzle.checkpoints.length ||
        !open[item.cell] ||
        checkpointAt[item.cell]
      ) {
        valid = false;
      } else {
        checkpointAt[item.cell] = item.number;
      }
    });
    if (!valid) return { count: 0, exhaustive: true, nodes: 0 };

    const ordered = puzzle.checkpoints.slice().sort((a, b) => a.number - b.number);
    if (
      ordered.some((item, index) => item.number !== index + 1) ||
      ordered[0].cell === ordered[ordered.length - 1].cell
    ) {
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

      const nextCells = neighbours(current, puzzle.size).filter(
        (cell) => open[cell] && !visited[cell],
      );
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
      checkpointAt: Array.from(
        { length: size * size },
        (_, cell) => marked.checkpointAt[cell] || 0,
      ),
      start: path[0],
      end: path[path.length - 1],
      solution: path.slice(),
      generatedAt: "procedural",
    };
  }

  function generate(seed, difficulty) {
    const key = Object.prototype.hasOwnProperty.call(DIFFICULTIES, difficulty)
      ? difficulty
      : "steady";
    const settings = DIFFICULTIES[key];
    const actualSeed = Number(seed) >>> 0 || 1;
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
    fallback.generatedAt = "validated-fallback";
    const verified = countSolutions(fallback, 2, settings.size * settings.size * 4 + 100);
    if (verified.exhaustive && verified.count === 1) return fallback;

    /* This final defensive branch should be unreachable; never return a board
       that has not been verified. */
    throw new Error("Number Maze could not construct a verified puzzle.");
  }

  function validate(puzzle) {
    if (
      !puzzle ||
      !Number.isInteger(puzzle.size) ||
      puzzle.size < 2 ||
      !Array.isArray(puzzle.openCells) ||
      !Array.isArray(puzzle.solution) ||
      !Array.isArray(puzzle.checkpoints) ||
      puzzle.openCells.length !== puzzle.solution.length ||
      puzzle.solution.length < 2
    )
      return false;

    const total = puzzle.size * puzzle.size;
    const open = new Set(puzzle.openCells);
    if (
      open.size !== puzzle.openCells.length ||
      puzzle.solution.some(
        (cell) => !Number.isInteger(cell) || cell < 0 || cell >= total || !open.has(cell),
      ) ||
      new Set(puzzle.solution).size !== puzzle.solution.length ||
      puzzle.solution.some(
        (cell, index) =>
          index > 0 && !neighbours(puzzle.solution[index - 1], puzzle.size).includes(cell),
      )
    ) {
      return false;
    }
    if (
      open.size !== puzzle.openCells.length ||
      puzzle.openCells.some((cell) => !new Set(puzzle.solution).has(cell))
    )
      return false;
    if (
      puzzle.start !== puzzle.solution[0] ||
      puzzle.end !== puzzle.solution[puzzle.solution.length - 1]
    )
      return false;
    const ordered = puzzle.checkpoints.slice().sort((a, b) => a.number - b.number);
    if (!ordered.length || ordered.some((item, index) => item.number !== index + 1)) return false;
    if (ordered[0].cell !== puzzle.start || ordered[ordered.length - 1].cell !== puzzle.end)
      return false;
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
    validate,
  };
})();

if (typeof globalThis !== "undefined") globalThis.NumberMazeEngine = NumberMazeEngine;
if (typeof module !== "undefined" && module.exports) module.exports = NumberMazeEngine;

;

/* ===== Bundled from js/number-maze.js ===== */
/* Number Maze interaction layer. The engine is deterministic and independently testable. */
const NumberMaze = (() => {
  "use strict";

  const STORAGE_KEY = "mfa_number_maze_progress_v1";
  const state = {
    puzzle: null,
    path: [],
    mode: "explore",
    difficulty: "steady",
    tutorialIndex: 0,
    focusCell: 0,
    hintCell: null,
    hints: 0,
    completed: false,
    dragging: false,
    pointerId: null,
    bound: false,
    status: "",
  };

  const byId = (id) => document.getElementById(id);
  const todayKey = () => new Date().toISOString().slice(0, 10);

  function readProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return {
        solved: Number.isFinite(saved && saved.solved) && saved.solved >= 0 ? saved.solved : 0,
        daily: saved && saved.daily && typeof saved.daily === "object" ? saved.daily : {},
      };
    } catch (error) {
      return { solved: 0, daily: {} };
    }
  }

  function writeProgress(progress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      /* Storage may be disabled. */
    }
  }

  function challengeDifficulty() {
    return ["gentle", "steady", "stretch"][Math.min(2, Math.floor(readProgress().solved / 5))];
  }

  function currentDifficulty() {
    if (state.mode === "tutorial") return "gentle";
    return state.mode === "challenge" ? challengeDifficulty() : state.difficulty;
  }

  function dailySeed() {
    return NumberMazeEngine.hashSeed(
      "maths-for-all-number-maze-" + todayKey() + "-" + currentDifficulty(),
    );
  }

  function dailyProgressKey() {
    return todayKey() + "-" + currentDifficulty();
  }

  function announce(message) {
    state.status = message;
    const feedback = byId("nm-feedback");
    if (feedback) feedback.textContent = message;
  }

  function updateControls() {
    document.querySelectorAll("[data-nm-mode]").forEach((button) => {
      const selected = button.dataset.nmMode === state.mode;
      button.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll("[data-nm-difficulty]").forEach((button) => {
      const selected = button.dataset.nmDifficulty === currentDifficulty();
      button.setAttribute("aria-pressed", String(selected));
      button.disabled = state.mode === "challenge" || state.mode === "tutorial";
    });
    const current = state.puzzle ? state.puzzle.difficulty : currentDifficulty();
    const names = { gentle: "Gentle", steady: "Steady", stretch: "Stretch" };
    const modeNames = {
      explore: "Explore",
      daily: "Daily Challenge",
      challenge: "Challenge Climb",
      tutorial: "Guided Starters",
    };
    const difficulty = byId("nm-current-difficulty");
    const mode = byId("nm-current-mode");
    if (difficulty) difficulty.textContent = names[current] || "Steady";
    if (mode) mode.textContent = modeNames[state.mode] || "Explore";
    const challengeNote = byId("nm-challenge-note");
    if (challengeNote) challengeNote.hidden = state.mode !== "challenge";
    const tutorialNote = byId("nm-tutorial-note");
    if (tutorialNote) tutorialNote.hidden = state.mode !== "tutorial";
    const newPuzzleButton = byId("nm-new-puzzle");
    const nextCompleteButton = byId("nm-next-complete");
    const nextLabels = {
      explore: "＋ New puzzle",
      daily: "↻ Replay daily puzzle",
      challenge: "Next challenge →",
      tutorial: "Next guided board →",
    };
    const nextLabel = nextLabels[state.mode] || nextLabels.explore;
    if (newPuzzleButton) newPuzzleButton.textContent = nextLabel;
    if (nextCompleteButton) nextCompleteButton.textContent = nextLabel;
    const progress = readProgress();
    const solved = byId("nm-total-solved");
    if (solved) solved.textContent = String(progress.solved);
    const dailyBadge = byId("nm-daily-badge");
    if (dailyBadge) {
      const done = !!progress.daily[dailyProgressKey()];
      dailyBadge.textContent =
        state.mode === "daily"
          ? done
            ? "Daily puzzle complete"
            : "Today’s shared puzzle"
          : "Untimed · No penalties";
      dailyBadge.classList.toggle("is-complete", state.mode === "daily" && done);
    }
  }

  function puzzleCode(puzzle) {
    const keys = { gentle: "G", steady: "S", stretch: "X" };
    return (
      "NM1-" +
      (keys[puzzle.difficulty] || "S") +
      "-" +
      (puzzle.seed >>> 0).toString(36).toUpperCase()
    );
  }

  function boardCellLabel(cell, puzzle) {
    const row = Math.floor(cell / puzzle.size) + 1;
    const col = (cell % puzzle.size) + 1;
    const checkpoint = puzzle.checkpointAt[cell];
    const pathIndex = state.path.indexOf(cell);
    let label = "Row " + row + ", column " + col;
    if (checkpoint) label += ", checkpoint " + checkpoint;
    else label += ", open square";
    if (pathIndex >= 0) label += ", path step " + (pathIndex + 1);
    if (cell === puzzle.start) label += ", start";
    if (cell === puzzle.end) label += ", finish";
    return label;
  }

  function renderRouteLine(board) {
    if (state.path.length < 2) return;
    const bounds = board.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const points = [];
    for (const cell of state.path) {
      const node = board.querySelector('[data-cell="' + cell + '"]');
      if (!node) return;
      const rect = node.getBoundingClientRect();
      points.push({
        x: rect.left + rect.width / 2 - bounds.left,
        y: rect.top + rect.height / 2 - bounds.top,
      });
    }
    const sample = board.querySelector(".nm-cell");
    if (!sample) return;
    const sampleRect = sample.getBoundingClientRect();
    const lineWidth = Math.max(8, Math.min(sampleRect.width, sampleRect.height) * 0.58);
    const d = points
      .map(
        (point, index) =>
          (index === 0 ? "M " : "L ") + point.x.toFixed(2) + " " + point.y.toFixed(2),
      )
      .join(" ");

    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.classList.add("nm-route-svg");
    svg.setAttribute("viewBox", "0 0 " + bounds.width + " " + bounds.height);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");

    const halo = document.createElementNS(ns, "path");
    halo.setAttribute("class", "nm-route-halo");
    halo.setAttribute("d", d);
    halo.setAttribute("fill", "none");
    halo.setAttribute(
      "stroke",
      getComputedStyle(board).getPropertyValue("--nm-route-halo").trim() || "#dfe8dc",
    );
    halo.setAttribute("stroke-width", String(lineWidth * 1.28));
    halo.setAttribute("stroke-linecap", "round");
    halo.setAttribute("stroke-linejoin", "round");

    const line = document.createElementNS(ns, "path");
    line.setAttribute("class", "nm-route-line");
    line.setAttribute("d", d);
    line.setAttribute("fill", "none");
    line.setAttribute(
      "stroke",
      getComputedStyle(board).getPropertyValue("--nm-route-color").trim() || "#4d6b53",
    );
    line.setAttribute("stroke-width", String(lineWidth));
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("stroke-linejoin", "round");

    svg.appendChild(halo);
    svg.appendChild(line);
    board.appendChild(svg);
  }

  function renderBoard(restoreFocus) {
    const board = byId("nm-board");
    if (!board || !state.puzzle) return;
    const puzzle = state.puzzle;
    const routeIndex = new Map(state.path.map((cell, index) => [cell, index + 1]));
    const open = new Set(puzzle.openCells);
    board.innerHTML = "";
    board.style.setProperty("--nm-size", String(puzzle.size));
    board.setAttribute(
      "aria-label",
      "Number Maze board, " +
        puzzle.size +
        " rows by " +
        puzzle.size +
        " columns. Begin at checkpoint 1 and fill every open square exactly once.",
    );

    for (let cell = 0; cell < puzzle.size * puzzle.size; cell++) {
      if (!open.has(cell)) {
        const wall = document.createElement("span");
        wall.className = "nm-wall";
        wall.setAttribute("aria-hidden", "true");
        board.appendChild(wall);
        continue;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = "nm-cell";
      button.dataset.cell = String(cell);
      button.setAttribute("aria-label", boardCellLabel(cell, puzzle));
      button.setAttribute("aria-pressed", String(routeIndex.has(cell)));
      button.tabIndex = cell === state.focusCell ? 0 : -1;
      const checkpoint = puzzle.checkpointAt[cell];
      if (checkpoint) {
        const mark = document.createElement("span");
        mark.className = "nm-checkpoint-number";
        mark.textContent = String(checkpoint);
        button.appendChild(mark);
        button.classList.add("has-checkpoint");
      } else {
        const mark = document.createElement("span");
        mark.className = "nm-empty-mark";
        mark.textContent = "·";
        mark.setAttribute("aria-hidden", "true");
        button.appendChild(mark);
      }
      if (cell === puzzle.start) button.classList.add("is-start");
      if (cell === puzzle.end) button.classList.add("is-finish");
      if (routeIndex.has(cell)) {
        button.classList.add("is-path");
        const step = document.createElement("span");
        step.className = "nm-route-step";
        step.textContent = String(routeIndex.get(cell));
        step.setAttribute("aria-hidden", "true");
        button.appendChild(step);
      }
      if (cell === state.hintCell) button.classList.add("is-hint");
      if (state.completed) button.classList.add("is-complete");
      board.appendChild(button);
    }
    renderRouteLine(board);
    if (restoreFocus) {
      const focused = board.querySelector('[data-cell="' + state.focusCell + '"]');
      if (focused) focused.focus({ preventScroll: true });
    }
  }

  function renderStats() {
    if (!state.puzzle) return;
    const puzzle = state.puzzle;
    const visitedCheckpoints = state.path.filter((cell) => puzzle.checkpointAt[cell] > 0).length;
    const pathCount = byId("nm-path-count");
    const cellCount = byId("nm-cell-count");
    const checkpointCount = byId("nm-checkpoint-count");
    const checkpointTotal = byId("nm-checkpoint-total");
    if (pathCount) pathCount.textContent = String(state.path.length);
    if (cellCount) cellCount.textContent = String(puzzle.openCells.length);
    if (checkpointCount) checkpointCount.textContent = String(visitedCheckpoints);
    if (checkpointTotal) checkpointTotal.textContent = String(puzzle.checkpoints.length);
    const codeInput = byId("nm-puzzle-code");
    if (codeInput && document.activeElement !== codeInput) codeInput.value = puzzleCode(puzzle);
    const completion = byId("nm-complete");
    if (completion) completion.hidden = !state.completed;
    const summary = byId("nm-complete-summary");
    if (summary && state.completed) {
      summary.textContent =
        "You connected " +
        puzzle.checkpoints.length +
        " checkpoints and filled all " +
        puzzle.openCells.length +
        " open squares. There is always another puzzle to explore.";
    }
    updateControls();
  }

  function render(restoreFocus) {
    renderBoard(!!restoreFocus);
    renderStats();
  }

  function newPuzzle() {
    state.difficulty = currentDifficulty();
    let seed;
    if (state.mode === "tutorial") {
      const tutorialSeeds = [0x4d415a45, 0x4d415a46, 0x4d415a47];
      state.difficulty = "gentle";
      seed = tutorialSeeds[state.tutorialIndex % tutorialSeeds.length];
      state.tutorialIndex = (state.tutorialIndex + 1) % tutorialSeeds.length;
    } else {
      seed = state.mode === "daily" ? dailySeed() : NumberMazeEngine.randomSeed();
    }
    state.puzzle = NumberMazeEngine.generate(seed, state.difficulty);
    state.path = [];
    state.focusCell = state.puzzle.start;
    state.hintCell = null;
    state.hints = 0;
    state.completed = false;
    state.dragging = false;
    render(false);
    const names = { gentle: "Gentle", steady: "Steady", stretch: "Stretch" };
    const modeLabels = {
      explore: "Fresh puzzle",
      daily: "Daily challenge",
      challenge: "Challenge Climb puzzle",
      tutorial: "Guided starter",
    };
    announce(
      (modeLabels[state.mode] || "Fresh puzzle") +
        " ready. " +
        names[state.difficulty] +
        " difficulty, " +
        state.puzzle.openCells.length +
        " open squares. Begin at checkpoint 1.",
    );
  }

  function setMode(mode) {
    if (!["explore", "daily", "challenge", "tutorial"].includes(mode)) return;
    state.mode = mode;
    if (mode === "tutorial") state.tutorialIndex = 0;
    state.difficulty = currentDifficulty();
    newPuzzle();
    updateControls();
  }

  function setDifficulty(difficulty) {
    if (
      !Object.prototype.hasOwnProperty.call(NumberMazeEngine.DIFFICULTIES, difficulty) ||
      state.mode === "challenge" ||
      state.mode === "tutorial"
    )
      return;
    state.difficulty = difficulty;
    newPuzzle();
  }

  function nextCheckpointNumber() {
    if (!state.puzzle) return 1;
    return state.path.filter((cell) => state.puzzle.checkpointAt[cell] > 0).length + 1;
  }

  function areAdjacent(a, b, size) {
    return NumberMazeEngine.neighbours(a, size).includes(b);
  }

  function completePuzzle() {
    if (state.completed || !state.puzzle) return;
    state.completed = true;
    state.hintCell = null;
    const progress = readProgress();
    const dailyKey = dailyProgressKey();
    const dailyWasAlreadySolved = state.mode === "daily" && !!progress.daily[dailyKey];
    if (!dailyWasAlreadySolved) progress.solved++;
    if (state.mode === "daily") progress.daily[dailyKey] = true;
    writeProgress(progress);
    render(false);
    announce(
      "Puzzle complete. Every open square was filled exactly once and each checkpoint was reached in order. Well reasoned!",
    );
    if (typeof Analytics !== "undefined") {
      Analytics.log("number_maze", "complete", {
        mode: state.mode,
        difficulty: state.difficulty,
        openCells: state.puzzle.openCells.length,
        hints: state.hints,
      });
    }
  }

  function chooseCell(cell, restoreFocus) {
    if (!state.puzzle || state.completed || !Number.isInteger(cell)) return false;
    const puzzle = state.puzzle;
    if (!puzzle.openCells.includes(cell)) return false;

    if (!state.path.length) {
      if (cell !== puzzle.start) {
        announce("Begin at checkpoint 1. You can take your time.");
        state.focusCell = puzzle.start;
        render(true);
        return false;
      }
      state.path = [cell];
      state.focusCell = cell;
      state.hintCell = null;
      announce(
        "Started. Now move to a neighboring open square and follow the checkpoints in order.",
      );
      render(true);
      return true;
    }

    const last = state.path[state.path.length - 1];
    if (cell === last) {
      state.focusCell = cell;
      return true;
    }
    if (state.path.length > 1 && cell === state.path[state.path.length - 2]) {
      state.path.pop();
      state.focusCell = cell;
      state.hintCell = null;
      announce("Stepped back one square. Keep exploring.");
      render(true);
      return true;
    }
    if (state.path.includes(cell)) {
      announce("A square can only be visited once. Use Undo to step back along your path.");
      return false;
    }
    if (!areAdjacent(last, cell, puzzle.size)) {
      announce("Move one square at a time. Choose an open neighbor of the current path end.");
      return false;
    }

    const checkpoint = puzzle.checkpointAt[cell] || 0;
    const expected = nextCheckpointNumber();
    if (checkpoint && checkpoint !== expected) {
      announce(
        checkpoint > expected
          ? "Checkpoint " + expected + " comes next. Follow the numbers in order."
          : "That checkpoint has already been passed. Undo to return to it.",
      );
      return false;
    }
    if (cell === puzzle.end && state.path.length + 1 !== puzzle.openCells.length) {
      announce("The finish is the final checkpoint. Fill the other open squares first.");
      return false;
    }

    state.path.push(cell);
    state.focusCell = cell;
    state.hintCell = null;
    if (state.path.length === puzzle.openCells.length) {
      if (cell === puzzle.end && nextCheckpointNumber() === puzzle.checkpoints.length + 1) {
        completePuzzle();
        return true;
      }
      announce("Every square is filled. Check that the final checkpoint is reached last.");
    } else {
      announce(
        "Path: " +
          state.path.length +
          " of " +
          puzzle.openCells.length +
          " open squares. Next checkpoint: " +
          nextCheckpointNumber() +
          ".",
      );
    }
    render(!!restoreFocus);
    return true;
  }

  async function copyPuzzleCode() {
    if (!state.puzzle) return;
    const input = byId("nm-puzzle-code");
    const code = puzzleCode(state.puzzle);
    if (input) input.value = code;
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function")
        throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(code);
      announce("Puzzle code copied. Share it or load it later to replay this exact board.");
      return;
    } catch (error) {
      if (input) {
        input.focus();
        input.select();
        let copied = false;
        try {
          copied = document.execCommand("copy");
        } catch (copyError) {
          copied = false;
        }
        announce(
          copied
            ? "Puzzle code copied. Share it or load it later to replay this exact board."
            : "Puzzle code selected. Use Ctrl+C or your device’s Copy action to save it.",
        );
      } else {
        announce("Your puzzle code is " + code + ".");
      }
    }
  }

  function loadPuzzleCode() {
    const input = byId("nm-puzzle-code");
    const code = input ? input.value.trim().toUpperCase() : "";
    const match = /^NM1-([GSX])-([0-9A-Z]{1,7})$/.exec(code);
    if (!match) {
      announce("That puzzle code is not recognised. Use a code like NM1-S-ABC123.");
      return false;
    }
    const seed = Number.parseInt(match[2], 36);
    if (!Number.isSafeInteger(seed) || seed <= 0 || seed > 0xffffffff) {
      announce(
        "That puzzle code contains an invalid seed. Check the letters and numbers and try again.",
      );
      return false;
    }
    const difficulty = { G: "gentle", S: "steady", X: "stretch" }[match[1]];
    state.mode = "explore";
    state.difficulty = difficulty;
    state.puzzle = NumberMazeEngine.generate(seed, difficulty);
    const codeInput = byId("nm-puzzle-code");
    if (codeInput) codeInput.value = puzzleCode(state.puzzle);
    state.path = [];
    state.focusCell = state.puzzle.start;
    state.hintCell = null;
    state.hints = 0;
    state.completed = false;
    state.dragging = false;
    state.pointerId = null;
    render(false);
    announce(
      "Puzzle loaded. This code reproduces the same " +
        difficulty +
        " board. Begin at checkpoint 1.",
    );
    return true;
  }

  function undo() {
    if (!state.path.length || state.completed) {
      announce(
        state.completed
          ? "This puzzle is complete. Start another puzzle to keep going."
          : "Your path is already empty. Start at checkpoint 1.",
      );
      return;
    }
    state.path.pop();
    state.focusCell = state.path[state.path.length - 1] ?? state.puzzle.start;
    state.hintCell = null;
    announce(
      state.path.length ? "Last step undone." : "Path cleared. Begin again at checkpoint 1.",
    );
    render(true);
  }

  function resetPath() {
    if (!state.puzzle) return;
    state.path = [];
    state.focusCell = state.puzzle.start;
    state.hintCell = null;
    state.hints = 0;
    state.completed = false;
    render(true);
    announce("Path reset. The puzzle stays the same, and every retry is welcome.");
  }

  function hint() {
    if (!state.puzzle || state.completed) {
      announce(
        state.completed
          ? "You solved this puzzle. Start another one for a new challenge."
          : "Start a puzzle first.",
      );
      return;
    }
    let prefix = 0;
    while (prefix < state.path.length && state.path[prefix] === state.puzzle.solution[prefix])
      prefix++;
    if (prefix >= state.puzzle.solution.length) {
      announce("You are already at the end of the solution.");
      return;
    }
    state.hints++;
    if (state.path.length === 0) {
      state.hintCell = state.puzzle.solution[1];
      announce("Start at checkpoint 1, then move to the glowing square.");
      render(false);
      return;
    }
    state.hintCell = state.puzzle.solution[prefix];
    if (prefix < state.path.length) {
      announce(
        "Hint: the glowing square is on the unique complete route. Undo steps until your path lines up with it.",
      );
    } else {
      announce(
        "Hint: try moving to the glowing square next. It keeps the route open for the remaining checkpoints.",
      );
    }
    render(false);
  }

  function handleArrow(event) {
    const screen = byId("screen-number-maze");
    if (
      !screen ||
      !screen.classList.contains("active") ||
      !event.target ||
      !event.target.matches("#nm-board [data-cell]")
    )
      return;
    const current = Number(event.target.dataset.cell);
    const size = state.puzzle ? state.puzzle.size : 0;
    if (!size) return;
    let next = null;
    if (event.key === "ArrowUp" && current >= size) next = current - size;
    else if (event.key === "ArrowRight" && current % size < size - 1) next = current + 1;
    else if (event.key === "ArrowDown" && current + size < size * size) next = current + size;
    else if (event.key === "ArrowLeft" && current % size > 0) next = current - 1;
    else if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      undo();
      return;
    } else {
      return;
    }
    event.preventDefault();
    if (next === null || !state.puzzle.openCells.includes(next)) {
      announce("That neighboring square is a wall. Choose another direction.");
      return;
    }
    chooseCell(next, true);
  }

  function bindOnce() {
    if (state.bound) return;
    state.bound = true;
    const board = byId("nm-board");
    if (!board) return;

    board.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cell]");
      if (button) chooseCell(Number(button.dataset.cell), true);
    });
    board.addEventListener("pointerdown", (event) => {
      const button = event.target.closest("[data-cell]");
      if (!button || !event.isPrimary || event.button !== 0) return;
      const accepted = chooseCell(Number(button.dataset.cell), true);
      if (!accepted) return;
      state.dragging = true;
      state.pointerId = event.pointerId;
      try {
        board.setPointerCapture(event.pointerId);
      } catch (error) {
        /* Some assistive browsers do not expose pointer capture. */
      }
      event.preventDefault();
    });
    board.addEventListener("pointermove", (event) => {
      if (!state.dragging || state.pointerId !== event.pointerId) return;
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const button = target && target.closest ? target.closest("#nm-board [data-cell]") : null;
      if (button) chooseCell(Number(button.dataset.cell), false);
    });
    const finishDrag = (event) => {
      if (state.pointerId !== null && event.pointerId !== state.pointerId) return;
      state.dragging = false;
      state.pointerId = null;
    };
    board.addEventListener("pointerup", finishDrag);
    board.addEventListener("pointercancel", finishDrag);
    board.addEventListener("lostpointercapture", finishDrag);
    document.addEventListener("keydown", handleArrow);
  }

  function startGame() {
    const setup = byId("nm-setup");
    const play = byId("nm-play");
    const settingsButton = byId("nm-change-settings");
    if (setup) setup.hidden = true;
    if (play) play.hidden = false;
    if (settingsButton) settingsButton.hidden = false;
    if (!state.puzzle) newPuzzle();
    render(false);
    const current = byId("nm-board")?.querySelector('[data-cell="' + state.focusCell + '"]');
    if (current) current.focus({ preventScroll: true });
  }

  function showSetup() {
    const setup = byId("nm-setup");
    const play = byId("nm-play");
    const settingsButton = byId("nm-change-settings");
    if (setup) setup.hidden = false;
    if (play) play.hidden = true;
    if (settingsButton) settingsButton.hidden = true;
    const selectedMode = document.querySelector('#nm-setup [data-nm-mode][aria-pressed="true"]');
    if (selectedMode) selectedMode.focus({ preventScroll: true });
  }

  function init() {
    bindOnce();
    if (!state.puzzle) newPuzzle();
    else render(false);
  }

  function stop() {
    state.dragging = false;
    state.pointerId = null;
  }

  return {
    init,
    stop,
    startGame,
    showSetup,
    newPuzzle,
    setMode,
    setDifficulty,
    undo,
    hint,
    resetPath,
    copyPuzzleCode,
    loadPuzzleCode,
    getSummary: () => ({
      mode: state.mode,
      difficulty: currentDifficulty(),
      pathLength: state.path.length,
      openCellCount: state.puzzle ? state.puzzle.openCells.length : 0,
      checkpointCount: state.puzzle ? state.puzzle.checkpoints.length : 0,
      completed: state.completed,
      solved: readProgress().solved,
    }),
  };
})();

if (typeof window !== "undefined") window.NumberMaze = NumberMaze;
