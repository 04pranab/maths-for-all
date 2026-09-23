/* =============================================================
   MATH FOR ALL – shapes.js
   Shape library + a 100-level generator for Shape Fitting.

   WHY THIS WAS REWRITTEN:
   The original 50 hand-typed levels occasionally listed more
   piece-cells than the board actually had room for (for example,
   one level asked for 20 cells' worth of pieces on a 16-cell
   board) — so the level could never be fully completed no matter
   how a child arranged the shapes. That is fixed here by BUILDING
   every level from an exact tiling of the board: we fill the grid
   cell-by-cell with real rotations of real shapes from SHAPES, so
   the total piece area always equals the board area, and a
   solution always exists by construction.

   Levels are generated with a seeded random-number generator (see
   Utils.mulberry32), so level 37 looks exactly the same today,
   tomorrow, and on every device — nothing is reshuffled behind a
   child's back, but nothing was hand-typed (and error-prone)
   either.
   ============================================================= */

/* -----------------------------------------------------------
   SHAPE LIBRARY
   Every shape's FIRST cell [0,0] is filled — that's the anchor
   cell a player taps on the board to place the whole piece.
   ----------------------------------------------------------- */
const SHAPES = {
  dot:    { name:'Dot',   cells:[[0,0]],                                   color:'#F2A93B' },
  duo:    { name:'Duo',   cells:[[0,0],[0,1]],                             color:'#4FA6B8' },
  tri_I:  { name:'Tri-I', cells:[[0,0],[0,1],[0,2]],                       color:'#6E9B4C' },
  tri_L:  { name:'Tri-L', cells:[[0,0],[1,0],[1,1]],                       color:'#8C6BAE' },
  I:      { name:'I',     cells:[[0,0],[0,1],[0,2],[0,3]],                 color:'#2F4B7C' },
  O:      { name:'O',     cells:[[0,0],[0,1],[1,0],[1,1]],                 color:'#F2A93B' },
  T:      { name:'T',     cells:[[0,0],[0,1],[0,2],[1,1]],                 color:'#8C6BAE' },
  L:      { name:'L',     cells:[[0,0],[1,0],[2,0],[2,1]],                 color:'#C96A4B' },
  J:      { name:'J',     cells:[[0,0],[1,0],[2,0],[2,1]],                 color:'#4FA6B8' },
  S:      { name:'S',     cells:[[0,0],[0,1],[1,1],[1,2]],                 color:'#6E9B4C' },
  Z:      { name:'Z',     cells:[[0,0],[0,1],[1,1],[1,2]],                 color:'#C96A4B' },
  P5_I:   { name:'I5',    cells:[[0,0],[0,1],[0,2],[0,3],[0,4]],           color:'#2F4B7C' },
  P5_L:   { name:'L5',    cells:[[0,0],[1,0],[2,0],[3,0],[3,1]],           color:'#F2A93B' },
  P5_T:   { name:'T5',    cells:[[0,0],[0,1],[0,2],[1,1],[2,1]],           color:'#C96A4B' },
  P5_U:   { name:'U',     cells:[[0,0],[0,1],[0,2],[1,0],[1,2]],           color:'#8C6BAE' },
  P5_P:   { name:'P',     cells:[[0,0],[0,1],[1,0],[1,1],[2,0]],           color:'#6E9B4C' },
};

/* -----------------------------------------------------------
   ROTATE  – identical transform to ShapePuzzle.rotateSelected(),
   so every orientation we generate here is reachable by a player
   pressing "Rotate" in the game.
   ----------------------------------------------------------- */
function rotateShapeCells(cells) {
  let rotated = cells.map(([r, c]) => [c, -r]);
  const minR = Math.min(...rotated.map(c => c[0]));
  const minC = Math.min(...rotated.map(c => c[1]));
  rotated = rotated.map(([r, c]) => [r - minR, c - minC]);
  rotated.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const anchorR = rotated[0][0], anchorC = rotated[0][1];
  return rotated.map(([r, c]) => [r - anchorR, c - anchorC]);
}
function uniqueRotations(cells) {
  const seen = new Set();
  const out = [];
  let cur = cells;
  for (let i = 0; i < 4; i++) {
    const key = cur.map(c => c.join(',')).sort().join('|');
    if (!seen.has(key)) { seen.add(key); out.push(cur); }
    cur = rotateShapeCells(cur);
  }
  return out;
}

/* -----------------------------------------------------------
   LEVEL GENERATOR
   Tries to fill the board with varied shapes (biggest first,
   for a satisfying puzzle); whenever nothing else fits a
   particular empty cell, it falls back to a 1-cell "dot", which
   ALWAYS fits — so the board is always fully tileable and every
   piece placeable via some rotation.
   ----------------------------------------------------------- */
function generateLevel(gridN, shapePool, seed) {
  const rng = Utils.mulberry32(seed);
  const board = Array.from({ length: gridN }, () => new Array(gridN).fill(0));
  const pieces = [];
  let id = 0;

  function tryFill(r, c) {
    const pool = Utils.seededShuffle(shapePool, rng);
    for (const key of pool) {
      const base = SHAPES[key].cells;
      const rotations = Utils.seededShuffle(uniqueRotations(base), rng);
      for (const variant of rotations) {
        const order = Utils.seededShuffle(variant.map((_, i) => i), rng);
        for (const i of order) {
          const [dr, dc] = variant[i];
          const originR = r - dr, originC = c - dc;
          const targets = variant.map(([tr, tc]) => [originR + tr, originC + tc]);
          const fits = targets.every(([tr, tc]) => tr >= 0 && tr < gridN && tc >= 0 && tc < gridN && board[tr][tc] === 0);
          if (fits) {
            id++;
            targets.forEach(([tr, tc]) => { board[tr][tc] = id; });
            pieces.push(key);
            return true;
          }
        }
      }
    }
    return false;
  }

  for (let r = 0; r < gridN; r++) {
    for (let c = 0; c < gridN; c++) {
      if (board[r][c] !== 0) continue;
      if (!tryFill(r, c)) {
        id++;
        board[r][c] = id;
        pieces.push('dot'); // guaranteed to fit — keeps the board always fully solvable
      }
    }
  }

  return { grid: gridN, pieces, solution: board };
}

/* -----------------------------------------------------------
   100-LEVEL PROGRESSION
   Grid size and shape variety both grow with the level number,
   loosely following the NEP-2020 idea of moving from very
   concrete, simple tasks toward more abstract, multi-step ones —
   capped at 8×8 so touch targets stay big enough to tap
   comfortably.
   ----------------------------------------------------------- */
const LEVEL_DATA = (function buildLevels() {
  const TIERS = [
    { upTo: 10,  grid: 4, pool: ['dot','duo','tri_I','tri_L','O'] },
    { upTo: 25,  grid: 5, pool: ['dot','duo','tri_I','tri_L','O','I','T'] },
    { upTo: 40,  grid: 5, pool: ['duo','tri_I','tri_L','O','I','T','L','J'] },
    { upTo: 55,  grid: 6, pool: ['tri_I','tri_L','O','I','T','L','J','S','Z'] },
    { upTo: 70,  grid: 6, pool: ['O','I','T','L','J','S','Z','P5_I'] },
    { upTo: 85,  grid: 7, pool: ['I','T','L','J','S','Z','P5_I','P5_L','P5_T'] },
    { upTo: 100, grid: 8, pool: ['T','L','J','S','Z','P5_I','P5_L','P5_T','P5_U','P5_P'] },
  ];

  const levels = [];
  for (let n = 1; n <= 100; n++) {
    const tier = TIERS.find(t => n <= t.upTo);
    levels.push(generateLevel(tier.grid, tier.pool, 1000 + n));
  }
  return levels;
})();

const ShapePuzzle = (function () {

  /* ── State ── */
  let currentLevel    = 0;
  let boardState      = [];    // NxN grid: 0 = empty, pieceId (1-based) = filled
  let pieces          = [];    // array of piece objects for current level
  let selectedPiece   = -1;    // index into pieces[], -1 = nothing selected
  let gridN           = 4;
  let cellPx          = 44;    // pixel size of each board cell (set by renderBoard)
  let timerInterval   = null;
  let elapsedSeconds  = 0;
  let completedLevels = new Set();
  let hintTimeout     = null;

  /* ── Init: show level selector ── */
  function init() {
    stopTimer();
    hide('shape-play-panel');
    hide('shape-complete');
    show('shape-level-panel');
    buildLevelSelectGrid();
  }

  /* ── Build the 100 level buttons, grouped by grid size ── */
  function buildLevelSelectGrid() {
    const container = document.getElementById('shape-level-grid');
    container.innerHTML = '';

    // Group consecutive levels that share the same grid size, straight
    // from LEVEL_DATA, so this stays correct even if the progression
    // in shapes.js is ever tuned.
    const sections = [];
    LEVEL_DATA.forEach((ld, i) => {
      const n = i + 1;
      const last = sections[sections.length - 1];
      if (last && last.grid === ld.grid) last.to = n;
      else sections.push({ grid: ld.grid, from: n, to: n });
    });
    sections.forEach(s => { s.label = `Levels ${s.from}–${s.to}  ·  ${s.grid}×${s.grid} grid`; });

    sections.forEach(sec => {
      const lbl = document.createElement('div');
      lbl.className   = 'level-section-label';
      lbl.textContent = sec.label;
      container.appendChild(lbl);

      for (let n = sec.from; n <= sec.to; n++) {
        const btn = document.createElement('button');
        btn.className   = 'btn-level';
        btn.textContent = n;
        btn.title       = `Level ${n}`;
        if (completedLevels.has(n)) btn.classList.add('completed');
        btn.addEventListener('click', () => loadLevel(n - 1));
        container.appendChild(btn);
      }
    });
  }

  /* ── Load a level by 0-based index ── */
  function loadLevel(idx) {
    if (idx < 0 || idx >= LEVEL_DATA.length) return;

    currentLevel  = idx;
    const ld      = LEVEL_DATA[idx];
    gridN         = ld.grid;
    selectedPiece = -1;

    /* Empty NxN board */
    boardState = Array.from({length: gridN}, () => new Array(gridN).fill(0));

    /* Build piece objects — deep-clone cells so rotation doesn't corrupt original */
    pieces = ld.pieces.map((key, i) => {
      const shape = SHAPES[key];
      return {
        id:       i + 1,          // 1-based, matches solution grid values
        key,
        name:     shape.name,
        color:    shape.color,
        cells:    shape.cells.map(c => [c[0], c[1]]),  // deep clone
        placed:   false,
        rotation: 0,
      };
    });

    /* Update info bar */
    setText('shape-level-num',   idx + 1);
    setText('shape-grid-size',   `${gridN}×${gridN}`);
    setText('shape-level-badge', `Level ${idx + 1}`);
    updatePlacedCount();

    /* Switch panels */
    hide('shape-level-panel');
    hide('shape-complete');
    show('shape-play-panel');
    hide('shape-message');

    const nextBtn = document.getElementById('btn-next-level');
    if (nextBtn) nextBtn.disabled = (idx >= LEVEL_DATA.length - 1);

    renderBoard();
    renderShapes();
    startTimer();
  }

  /* ── Helpers ── */
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  /* ── Timer ── */
  function startTimer() {
    stopTimer();
    elapsedSeconds = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => { elapsedSeconds++; updateTimerDisplay(); }, 1000);
  }
  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }
  function updateTimerDisplay() {
    const m = Math.floor(elapsedSeconds / 60);
    const s = elapsedSeconds % 60;
    setText('shape-timer', `${m}:${s.toString().padStart(2, '0')}`);
  }
  function updatePlacedCount() {
    const placed = pieces.filter(p => p.placed).length;
    setText('shape-placed', `${placed}/${pieces.length}`);
  }

  /* ════════════════════════════════════════════════════════════
     RENDER BOARD
     Builds the NxN grid of clickable cells.
     Each cell stores its [row, col] in data attributes.
     Filled cells show the piece's colour.
     Hover (mouseenter/mouseleave) drives the ghost preview.
     Click triggers piece placement.
     ════════════════════════════════════════════════════════════ */
  function renderBoard() {
    const boardEl = document.getElementById('shape-board');
    if (!boardEl) return;
    boardEl.innerHTML = '';

    /* Calculate cell size to fill the left panel */
    const available = Math.min(
      window.innerWidth * 0.56,
      window.innerHeight - 170,
      560
    );
    cellPx = Math.max(30, Math.floor((available - 14) / gridN) - 3);

    boardEl.style.gridTemplateColumns = `repeat(${gridN}, ${cellPx}px)`;

    for (let r = 0; r < gridN; r++) {
      for (let c = 0; c < gridN; c++) {
        const cell        = document.createElement('div');
        cell.className    = 'sp-cell';
        cell.style.width  = cellPx + 'px';
        cell.style.height = cellPx + 'px';
        cell.dataset.row  = r;
        cell.dataset.col  = c;

        /* Paint filled cells */
        const pid = boardState[r][c];
        if (pid > 0 && pieces[pid - 1]) {
          const p = pieces[pid - 1];
          cell.classList.add('filled');
          cell.style.background  = p.color;
          cell.style.borderColor = darkenColor(p.color, 40);
        }

        /* Hover → show ghost */
        cell.addEventListener('mouseenter', () => showGhost(r, c));
        cell.addEventListener('mouseleave', clearGhost);

        /* Click → place selected piece */
        cell.addEventListener('click', () => handleBoardClick(r, c));

        /* Touch: treat touchstart as a click for tablets */
        cell.addEventListener('touchstart', (e) => {
          e.preventDefault();
          handleBoardClick(r, c);
        }, { passive: false });

        boardEl.appendChild(cell);
      }
    }
  }

  /* ════════════════════════════════════════════════════════════
     RENDER SHAPES TRAY
     Shows all pieces. Selected piece gets a yellow highlight.
     Placed pieces are greyed out and non-interactive.
     Click a piece to select or deselect it.
     ════════════════════════════════════════════════════════════ */
  function renderShapes() {
    const tray = document.getElementById('shape-tray');
    if (!tray) return;
    tray.innerHTML = '';

    pieces.forEach((piece, idx) => {
      const el      = document.createElement('div');
      el.className  = 'shape-piece';

      if (piece.placed)          el.classList.add('placed-out');
      if (idx === selectedPiece) el.classList.add('selected');

      /* Mini colour preview of the piece shape */
      el.appendChild(buildMiniGrid(piece));

      /* Name label */
      const lbl       = document.createElement('div');
      lbl.className   = 'piece-label';
      lbl.textContent = piece.name;
      el.appendChild(lbl);

      if (!piece.placed) {
        /* Mouse click */
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleSelect(idx);
        });
        /* Touch — needed on tablets */
        el.addEventListener('touchstart', (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSelect(idx);
        }, { passive: false });
      }

      tray.appendChild(el);
    });
  }

  /* Build the small coloured block preview inside each tray card */
  function buildMiniGrid(piece) {
    const cells = piece.cells;
    const minR  = Math.min(...cells.map(c => c[0]));
    const maxR  = Math.max(...cells.map(c => c[0]));
    const minC  = Math.min(...cells.map(c => c[1]));
    const maxC  = Math.max(...cells.map(c => c[1]));
    const rows  = maxR - minR + 1;
    const cols  = maxC - minC + 1;

    const grid  = document.createElement('div');
    grid.className = 'piece-mini-grid';
    grid.style.gridTemplateColumns = `repeat(${cols}, 14px)`;

    const filled = new Set(cells.map(c => `${c[0] - minR},${c[1] - minC}`));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell     = document.createElement('div');
        const isFilled = filled.has(`${r},${c}`);
        cell.className = isFilled ? 'piece-mini-cell filled-mini' : 'piece-mini-cell empty-mini';
        if (isFilled) cell.style.background = piece.color;
        grid.appendChild(cell);
      }
    }
    return grid;
  }

  /* ── Select / deselect a piece ── */
  function toggleSelect(idx) {
    if (pieces[idx].placed) return;
    selectedPiece = (selectedPiece === idx) ? -1 : idx;
    clearGhost();
    clearHint();
    renderShapes();
  }

  /* ════════════════════════════════════════════════════════════
     GHOST PREVIEW
     When the player hovers over a board cell with a piece selected,
     show coloured cells where the piece would land.
     Green = valid placement. Red = invalid (out of bounds / overlap).

     The ANCHOR cell [0,0] of the piece snaps to the hovered cell.
     Because all shapes guarantee [0,0] is a filled cell, the player
     always sees the piece start exactly where they're hovering.
     ════════════════════════════════════════════════════════════ */
  function showGhost(row, col) {
    clearGhost();
    if (selectedPiece < 0) return;
    const piece = pieces[selectedPiece];
    if (!piece || piece.placed) return;

    /* Calculate where each cell of the piece would land */
    const targets = piece.cells.map(([dr, dc]) => [row + dr, col + dc]);
    const valid   = canPlace(targets);

    targets.forEach(([r, c]) => {
      /* Skip cells that are out of bounds — still show in-bounds ones */
      if (r < 0 || r >= gridN || c < 0 || c >= gridN) return;
      const cell = getBoardCellEl(r, c);
      if (!cell) return;
      if (valid) {
        cell.classList.add('ghost-valid');
        cell.style.background = hexToRgba(piece.color, 0.5);
      } else {
        cell.classList.add('ghost-invalid');
        cell.style.background = 'rgba(255,82,82,0.35)';
      }
    });
  }

  function clearGhost() {
    document.querySelectorAll('.sp-cell.ghost-valid, .sp-cell.ghost-invalid').forEach(cell => {
      cell.classList.remove('ghost-valid', 'ghost-invalid');
      /* Restore colour: either the piece colour (if filled) or empty */
      const r  = parseInt(cell.dataset.row);
      const c  = parseInt(cell.dataset.col);
      const id = boardState[r][c];
      cell.style.background = (id > 0 && pieces[id - 1]) ? pieces[id - 1].color : '';
    });
  }

  /* ════════════════════════════════════════════════════════════
     BOARD CLICK → PLACE PIECE
     The clicked cell [row, col] becomes the anchor [0,0] of
     the selected piece. Every other cell fills at [row+dr, col+dc].
     ════════════════════════════════════════════════════════════ */
  function handleBoardClick(row, col) {
    if (selectedPiece < 0) return;
    placePiece(selectedPiece, row, col);
  }

  function placePiece(idx, row, col) {
    if (idx < 0 || idx >= pieces.length) return;
    const piece = pieces[idx];
    if (!piece || piece.placed) return;

    const targets = piece.cells.map(([dr, dc]) => [row + dr, col + dc]);

    if (!canPlace(targets)) {
      showShapeMessage('🙂 That spot won\'t work — try another square, or rotate the shape!', 'error');
      return;
    }

    /* Write piece ID into every target cell */
    targets.forEach(([r, c]) => { boardState[r][c] = piece.id; });
    piece.placed  = true;
    selectedPiece = -1;

    clearGhost();
    clearHint();
    hide('shape-message');
    updatePlacedCount();

    /* Rebuild board to paint the new cells, then tray to grey out the piece */
    renderBoard();
    renderShapes();

    /* Check win */
    checkPuzzleSolved();
  }

  /* Returns true if every [r,c] in targets is inside the board and empty */
  function canPlace(targets) {
    for (const [r, c] of targets) {
      if (r < 0 || r >= gridN || c < 0 || c >= gridN) return false;
      if (boardState[r][c] !== 0) return false;
    }
    return true;
  }

  /* ════════════════════════════════════════════════════════════
     ROTATE  –  90° clockwise: (r, c) → (c, -r), then normalise
     After rotation, [0,0] is re-normalised to be the min row/col,
     but it may no longer be a filled cell.
     We then shift so that the FIRST filled cell in reading order
     (top-to-bottom, left-to-right) becomes the new [0,0] anchor.
     ════════════════════════════════════════════════════════════ */
  function rotateSelected() {
    if (selectedPiece < 0) return;
    const piece = pieces[selectedPiece];
    if (!piece || piece.placed) return;

    /* Rotate 90° clockwise */
    let rotated = piece.cells.map(([r, c]) => [c, -r]);

    /* Shift so minimum row and col = 0 */
    const minR = Math.min(...rotated.map(c => c[0]));
    const minC = Math.min(...rotated.map(c => c[1]));
    rotated = rotated.map(([r, c]) => [r - minR, c - minC]);

    /* Ensure [0,0] is filled: find the topmost-then-leftmost filled cell
       and shift everything so it becomes the new anchor [0,0] */
    rotated.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const anchorR = rotated[0][0];
    const anchorC = rotated[0][1];
    rotated = rotated.map(([r, c]) => [r - anchorR, c - anchorC]);

    piece.cells    = rotated;
    piece.rotation = (piece.rotation + 1) % 4;

    clearGhost();
    renderShapes();
  }

  /* ════════════════════════════════════════════════════════════
     WIN CHECK
     Puzzle is solved when every cell in boardState is non-zero.
     We do NOT check against the stored solution — any valid
     complete tiling wins the level.
     ════════════════════════════════════════════════════════════ */
  function checkPuzzleSolved() {
    /* The level is passed once every piece has been placed — a
       leftover empty square (if any) doesn't block a win, since
       what matters for the child is "I fit all my shapes in". */
    if (!pieces.every(p => p.placed)) return false;

    /* 🎉 Win! */
    stopTimer();
    completedLevels.add(currentLevel + 1);

    const m = Math.floor(elapsedSeconds / 60);
    const s = elapsedSeconds % 60;
    setText('complete-level-text', `Level ${currentLevel + 1}`);
    setText('complete-time',       `${m}:${s.toString().padStart(2, '0')}`);

    const nextBtn = document.getElementById('btn-next-level');
    if (nextBtn) nextBtn.disabled = (currentLevel >= LEVEL_DATA.length - 1);

    Analytics.log('shape', 'level_complete', { level: currentLevel + 1, seconds: elapsedSeconds });
    show('shape-complete');
    return true;
  }

  /* ════════════════════════════════════════════════════════════
     HINT SYSTEM
     Selects the first unplaced piece and highlights (in gold)
     the cells in the stored solution where it should go.
     ════════════════════════════════════════════════════════════ */
  function showHint() {
    clearHint();
    const ld       = LEVEL_DATA[currentLevel];
    const unplaced = pieces.filter(p => !p.placed);
    if (unplaced.length === 0) return;

    const piece     = unplaced[0];
    const hintCells = [];

    for (let r = 0; r < gridN; r++)
      for (let c = 0; c < gridN; c++)
        if (ld.solution[r][c] === piece.id) hintCells.push([r, c]);

    hintCells.forEach(([r, c]) => {
      const cell = getBoardCellEl(r, c);
      if (cell) cell.classList.add('hint-cell');
    });

    /* Auto-select the hinted piece */
    const pIdx = pieces.indexOf(piece);
    if (pIdx >= 0) {
      selectedPiece = pIdx;
      renderShapes();
    }

    showShapeMessage(`💡 Place the "${piece.name}" piece in the glowing squares`, 'info');
    hintTimeout = setTimeout(clearHint, 5000);
  }

  function clearHint() {
    if (hintTimeout) { clearTimeout(hintTimeout); hintTimeout = null; }
    document.querySelectorAll('.sp-cell.hint-cell')
      .forEach(c => c.classList.remove('hint-cell'));
  }

  /* ── Navigation ── */
  function restartLevel() { selectedPiece = -1; clearGhost(); loadLevel(currentLevel); }
  function backToLevels() { selectedPiece = -1; clearGhost(); stopTimer(); init(); }
  function nextLevel()    {
    if (currentLevel < LEVEL_DATA.length - 1) loadLevel(currentLevel + 1);
  }

  /* ── DOM helpers ── */
  function getBoardCellEl(row, col) {
    return document.querySelector(
      `#shape-board .sp-cell[data-row="${row}"][data-col="${col}"]`
    );
  }

  function showShapeMessage(msg, type) {
    const el = document.getElementById('shape-message');
    if (!el) return;
    el.textContent = msg;
    el.className   = `sudoku-message ${type}`;
    show('shape-message');
    setTimeout(() => hide('shape-message'), 3200);
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function darkenColor(hex, amount) {
    const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
    const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
    const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
    return `rgb(${r},${g},${b})`;
  }

  /* ── Keyboard handler (R = rotate, Esc = deselect) ── */
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (e) => {
      if (!document.getElementById('screen-shape').classList.contains('active')) return;
      if (e.key === 'r' || e.key === 'R') rotateSelected();
      if (e.key === 'Escape') {
        selectedPiece = -1;
        clearGhost();
        renderShapes();
      }
    });
  });

  /* ── Public API ── */
  return {
    init, loadLevel,
    rotateSelected, showHint,
    restartLevel, backToLevels, nextLevel,
    checkPuzzleSolved,
  };

})();
