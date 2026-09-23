const Sudoku = (function () {

  /* --- State --- */
  let board      = [];    // 9×9 – current puzzle (0 = empty)
  let solution   = [];    // 9×9 – the unique full solution
  let fixedCells = [];    // 9×9 boolean – pre-filled cells
  let selected   = null;  // { row, col }
  let hintsLeft  = 3;
  let difficulty = 'easy';

  /* PIN state */
  const CORRECT_PIN = '12345';
  let   pinEntry    = '';       // digits typed so far

  /* --- How many cells to REMOVE per difficulty.
       The unique-solution check means we may end up removing
       slightly fewer cells if uniqueness can't be maintained –
       that is expected and correct behaviour. */
  const REMOVE_COUNT = {
    easy:   36,
    medium: 46,
    hard:   52,
  };

  /* --- Gentle, low-exertion "brain breaks" shown before the PIN.
         These are intentionally optional and skippable (see the
         "Skip this" button) — not every learner can do jumping
         jacks, and this pause should never exclude anyone. --- */
  const DARES = [
    'Take 3 slow, deep breaths. 🌬️',
    'Give yourself a big silent cheer! 🙌',
    'Blink slowly 5 times and relax your shoulders. 😌',
    'Wiggle your fingers for 5 seconds. ✋',
    'Think of your favourite colour and say it in your head. 🎨',
    'Clap your hands twice, or tap the table twice. 👏',
    'Stretch your arms up high, if that feels good. 🙆',
    'Hum your favourite tune for 5 seconds. 🎵',
    'Give a big thumbs up! 👍',
    'Name one thing that makes you smile. 😊',
  ];

  /* -------------------------------------------------------
     SCREEN MANAGEMENT
     ------------------------------------------------------- */

  /** Called when entering sudoku screen. */
  function init() {
    show('sudoku-difficulty-panel');
    hide('sudoku-play-panel');
  }

  /** Return to difficulty picker. */
  function chooseDifficulty() {
    show('sudoku-difficulty-panel');
    hide('sudoku-play-panel');
  }

  /* -------------------------------------------------------
     PUZZLE GENERATION  (Fast + Unique Solution)
     ------------------------------------------------------- */

  /**
   * Generate a new puzzle at the chosen difficulty.
   *
   * SPEED TRICK – Diagonal Box Seeding:
   *   The three diagonal 3×3 boxes (top-left, middle, bottom-right)
   *   are independent of each other, so we can fill them with
   *   random shuffles of 1–9 without any validity checks.
   *   This pre-seeds 27 cells instantly, making the subsequent
   *   backtracking MUCH faster (fewer empty cells to fill).
   *
   * UNIQUE SOLUTION:
   *   When removing cells, we count how many solutions exist
   *   for the board AFTER each removal. We stop at 2 (we only
   *   need to know if there's more than 1). If removing a cell
   *   would allow multiple solutions, we skip that cell and try
   *   another. This guarantees exactly one solution.
   */
  function newPuzzle(level) {
    difficulty = level;
    hintsLeft  = 3;
    selected   = null;

    // Step 1 – Create an empty board
    board = emptyBoard();

    // Step 2 – Seed the three diagonal 3×3 boxes instantly
    seedDiagonalBoxes(board);

    // Step 3 – Fill the rest using backtracking
    //          (much faster now because 27 cells are already placed)
    fillBoardBT(board);

    // Step 4 – Save the complete solution
    solution = board.map(row => [...row]);

    // Step 5 – Remove cells while preserving unique solution
    board = board.map(row => [...row]);
    removeCellsUnique(board, REMOVE_COUNT[level]);

    // Step 6 – Mark fixed cells
    fixedCells = board.map(row => row.map(v => v !== 0));

    // Step 7 – Show play area
    hide('sudoku-difficulty-panel');
    show('sudoku-play-panel');
    const DIFF_LABEL = { easy: 'Starter', medium: 'Growing', hard: 'Champion' };
    document.getElementById('sudoku-diff-badge').textContent = DIFF_LABEL[level] || level;
    document.getElementById('hints-left').textContent = hintsLeft;
    hide('sudoku-message');

    Analytics.log('sudoku', 'puzzle_start', { difficulty: level });
    renderGrid();
    activateKeyboard();
  }

  /** Create a blank 9×9 board. */
  function emptyBoard() {
    return Array.from({ length: 9 }, () => new Array(9).fill(0));
  }

  /**
   * Seed the three independent diagonal 3×3 boxes.
   * Boxes at (0,0), (3,3), (6,6) don't share rows, cols or boxes,
   * so we can fill each with a random permutation of 1–9 safely.
   */
  function seedDiagonalBoxes(b) {
    for (const start of [0, 3, 6]) {
      const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      let idx = 0;
      for (let r = start; r < start + 3; r++) {
        for (let c = start; c < start + 3; c++) {
          b[r][c] = nums[idx++];
        }
      }
    }
  }

  /**
   * Fill all remaining empty cells using randomised backtracking.
   * Because the diagonal boxes are pre-seeded, this is very fast.
   * Returns true on success, false if no solution exists (shouldn't happen).
   */
  function fillBoardBT(b) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (b[row][col] !== 0) continue; // skip filled cells

        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValid(b, row, col, num)) {
            b[row][col] = num;
            if (fillBoardBT(b)) return true;
            b[row][col] = 0; // backtrack
          }
        }
        return false; // no number works – trigger backtrack
      }
    }
    return true; // all filled!
  }

  /**
   * Check if `num` can be placed at (row, col).
   * Uses bitmask-style checks for speed.
   */
  function isValid(b, row, col, num) {
    // Row check
    for (let c = 0; c < 9; c++) {
      if (b[row][c] === num) return false;
    }
    // Column check
    for (let r = 0; r < 9; r++) {
      if (b[r][col] === num) return false;
    }
    // 3×3 box check
    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++) {
      for (let c = bc; c < bc + 3; c++) {
        if (b[r][c] === num) return false;
      }
    }
    return true;
  }

  /**
   * Remove up to `count` cells from the board while guaranteeing
   * the puzzle retains exactly ONE solution.
   *
   * Algorithm:
   *   For each candidate cell (in random order):
   *     1. Temporarily remove the cell (set to 0).
   *     2. Count how many solutions the board has (stop counting at 2).
   *     3. If count === 1 → removal is safe, keep it removed.
   *     4. If count > 1  → puzzle would be ambiguous, restore the cell.
   *
   * countSolutions uses a lean backtracker that stops as soon as
   * it finds a second solution, so it's fast in practice.
   */
  function removeCellsUnique(b, targetCount) {
    // Build shuffled list of all 81 positions
    const positions = [];
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        positions.push([r, c]);
    shuffle(positions);

    let removed = 0;

    for (const [r, c] of positions) {
      if (removed >= targetCount) break;

      const backup = b[r][c]; // remember the value
      b[r][c] = 0;            // try removing

      // Count solutions on a copy (so we don't corrupt b)
      const copy = b.map(row => [...row]);
      const solutionCount = countSolutions(copy, 0);

      if (solutionCount === 1) {
        removed++; // safe to remove
      } else {
        b[r][c] = backup; // restore – removing this cell breaks uniqueness
      }
    }
  }

  /**
   * Count how many valid solutions a board has.
   * STOPS EARLY once `found` reaches 2 (we only need to
   * distinguish "exactly 1" from "more than 1").
   *
   * @param {number[][]} b   – board to solve (modified in-place)
   * @param {number}     found – solutions found so far
   * @returns {number}   total solutions found (capped at 2)
   */
  function countSolutions(b, found) {
    // Find the first empty cell
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (b[row][col] !== 0) continue;

        // Try each number 1–9 (no shuffling needed here – we want speed)
        for (let num = 1; num <= 9; num++) {
          if (isValid(b, row, col, num)) {
            b[row][col] = num;
            found = countSolutions(b, found);
            b[row][col] = 0;
            if (found >= 2) return found; // early exit
          }
        }
        return found; // this cell has no valid number → dead end
      }
    }
    // No empty cells → board is solved → one more solution found
    return found + 1;
  }

  /**
   * Fast backtracking solver (used internally for the Solve button).
   * Fills `b` in-place. Returns true when solved.
   */
  function solveBT(b) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (b[row][col] !== 0) continue;
        for (let num = 1; num <= 9; num++) {
          if (isValid(b, row, col, num)) {
            b[row][col] = num;
            if (solveBT(b)) return true;
            b[row][col] = 0;
          }
        }
        return false;
      }
    }
    return true;
  }

  /* -------------------------------------------------------
     SUDOKU UI – Grid Rendering
     ------------------------------------------------------- */

  /** Build the 9×9 DOM grid and the number keypad. */
  function renderGrid() {
    const gridEl = document.getElementById('sudoku-grid');
    gridEl.innerHTML = '';

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('div');
        cell.className   = 'sudoku-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;

        if (fixedCells[r][c]) {
          cell.classList.add('fixed');
          cell.textContent = board[r][c];
        } else if (board[r][c] !== 0) {
          cell.classList.add('user-entered');
          cell.textContent = board[r][c];
        }

        // Thick borders for 3×3 box separators
        if (c === 2 || c === 5) cell.classList.add('box-right');
        if (r === 2 || r === 5) cell.classList.add('box-bottom');

        cell.addEventListener('click', () => selectCell(r, c));
        gridEl.appendChild(cell);
      }
    }

    buildKeypad();
  }

  /** Build the on-screen number keypad (1–9 + erase). */
  function buildKeypad() {
    const old = document.getElementById('sudoku-keypad');
    if (old) old.remove();

    const kp = document.createElement('div');
    kp.id        = 'sudoku-keypad';
    kp.className = 'sudoku-keypad';

    for (let n = 1; n <= 9; n++) {
      const btn = document.createElement('button');
      btn.className   = 'btn-key';
      btn.textContent = n;
      btn.addEventListener('click', () => enterNumber(n));
      kp.appendChild(btn);
    }

    const erase = document.createElement('button');
    erase.className   = 'btn-key-erase';
    erase.textContent = '⌫';
    erase.title       = 'Erase';
    erase.addEventListener('click', () => enterNumber(0));
    kp.appendChild(erase);

    const controls = document.querySelector('.sudoku-controls');
    controls.parentNode.insertBefore(kp, controls);
  }

  /** Select a cell and refresh highlights. */
  function selectCell(row, col) {
    selected = { row, col };
    refreshCellHighlights();
  }

  /** Highlight selected cell, same row/col/box, and matching numbers. */
  function refreshCellHighlights() {
    const cells = document.querySelectorAll('.sudoku-cell');
    const selNum = (selected && board[selected.row][selected.col]) || 0;

    cells.forEach(cell => {
      const r = parseInt(cell.dataset.row);
      const c = parseInt(cell.dataset.col);
      cell.classList.remove('selected', 'highlighted', 'same-number');

      if (!selected) return;

      if (r === selected.row && c === selected.col) {
        cell.classList.add('selected');
      } else if (
        r === selected.row ||
        c === selected.col ||
        (Math.floor(r/3) === Math.floor(selected.row/3) &&
         Math.floor(c/3) === Math.floor(selected.col/3))
      ) {
        cell.classList.add('highlighted');
      }

      // Highlight all cells with the same number
      if (selNum !== 0 && board[r][c] === selNum) {
        cell.classList.add('same-number');
      }
    });
  }

  /**
   * Place or erase a number in the currently selected cell.
   * @param {number} num – 1-9 to place, 0 to erase
   */
  function enterNumber(num) {
    if (!selected) return;
    const { row, col } = selected;
    if (fixedCells[row][col]) return;

    board[row][col] = num;

    const cell = getCellEl(row, col);
    cell.classList.remove('wrong', 'hinted');
    if (num === 0) {
      cell.textContent = '';
      cell.classList.remove('user-entered');
    } else {
      cell.textContent = num;
      cell.classList.add('user-entered');
    }

    refreshCellHighlights();
    hide('sudoku-message');
  }

  /** Return the DOM element for a given cell position. */
  function getCellEl(row, col) {
    return document.querySelector(
      `.sudoku-cell[data-row="${row}"][data-col="${col}"]`
    );
  }

  /** Attach keyboard handler (replaces any previous one). */
  function activateKeyboard() {
    document.removeEventListener('keydown', handleKeyboard);
    document.addEventListener('keydown', handleKeyboard);
  }

  function handleKeyboard(e) {
    if (!selected) return;
    if (e.key >= '1' && e.key <= '9') { enterNumber(parseInt(e.key)); return; }
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') { enterNumber(0); return; }
    if (e.key === 'ArrowUp'    && selected.row > 0) { selectCell(selected.row - 1, selected.col); return; }
    if (e.key === 'ArrowDown'  && selected.row < 8) { selectCell(selected.row + 1, selected.col); return; }
    if (e.key === 'ArrowLeft'  && selected.col > 0) { selectCell(selected.row, selected.col - 1); return; }
    if (e.key === 'ArrowRight' && selected.col < 8) { selectCell(selected.row, selected.col + 1); return; }
  }

  /* -------------------------------------------------------
     SUDOKU ACTIONS – Hint / Check / Solve
     ------------------------------------------------------- */

  /** Reveal one random empty cell from the solution. */
  function giveHint() {
    if (hintsLeft <= 0) { showMessage('No hints left!', 'error'); return; }

    const empty = [];
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (!fixedCells[r][c] && board[r][c] === 0)
          empty.push([r, c]);

    if (empty.length === 0) { showMessage('All cells are filled!', 'info'); return; }

    const [r, c] = empty[Utils.randInt(0, empty.length - 1)];
    board[r][c] = solution[r][c];

    const cell = getCellEl(r, c);
    cell.textContent = solution[r][c];
    cell.classList.remove('wrong', 'user-entered');
    cell.classList.add('hinted');

    hintsLeft--;
    document.getElementById('hints-left').textContent = hintsLeft;
    showMessage(`💡 Hint revealed at Row ${r+1}, Col ${c+1}`, 'info');
    Analytics.log('sudoku', 'hint_used', { difficulty });
  }

  /** Check the board and highlight wrong cells in red. */
  function checkSolution() {
    let allFilled  = true;
    let allCorrect = true;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = getCellEl(r, c);
        cell.classList.remove('wrong');

        if (board[r][c] === 0)                                        { allFilled = false; continue; }
        if (!fixedCells[r][c] && board[r][c] !== solution[r][c])     { cell.classList.add('wrong'); allCorrect = false; }
      }
    }

    if (!allFilled)       showMessage('Some cells are still empty – keep going! 💪', 'info');
    else if (allCorrect)  { showMessage('🎉 Congratulations! Puzzle solved correctly!', 'success'); Analytics.log('sudoku','puzzle_solved',{difficulty}); }
    else                  showMessage('A few answers need another look — they are highlighted. You can do it!', 'error');
  }

  /* -------------------------------------------------------
     SOLVE BUTTON FLOW:  Dare → PIN → Animated Solve
     ------------------------------------------------------- */

  /**
   * Step 1 – Show a random dare to the student.
   * Called when the Solve button is pressed.
   */
  function solveAll() {
    // Show a gentle, optional brain-break
    const dare = DARES[Utils.randInt(0, DARES.length - 1)];
    document.getElementById('dare-text').textContent = dare;
    show('dare-modal');
  }

  /**
   * Step 2 – Student confirms the brain-break.
   * Hide dare modal, show PIN modal.
   */
  function dareCompleted() {
    hide('dare-modal');
    openPinModal();
  }

  /** Student skips the brain-break entirely but still proceeds to the PIN.
      Not every child can (or wants to) do a physical/vocal prompt — this
      keeps the "ask a teacher" flow available to everyone. */
  function dareSkip() {
    hide('dare-modal');
    openPinModal();
  }

  /** Student cancels the whole "ask a teacher" flow. */
  function dareCancelled() {
    hide('dare-modal');
  }

  /* --- PIN Modal --- */

  /** Open the PIN modal fresh (clear any previous entry). */
  function openPinModal() {
    pinEntry = '';
    updatePinDots();
    hide('pin-error');
    show('pin-modal');
  }

  /** Close the PIN modal. */
  function pinCancelled() {
    hide('pin-modal');
    pinEntry = '';
    updatePinDots();
  }

  /**
   * Append a digit to the PIN entry.
   * Auto-submits when 5 digits are entered.
   * @param {string} digit – '0' through '9'
   */
  function pinKey(digit) {
    if (pinEntry.length >= 5) return; // already 5 digits
    pinEntry += digit;
    updatePinDots();

    if (pinEntry.length === 5) {
      // Small delay so the 5th dot fills before we check
      setTimeout(checkPin, 120);
    }
  }

  /** Remove the last digit from the PIN entry. */
  function pinBackspace() {
    if (pinEntry.length > 0) {
      pinEntry = pinEntry.slice(0, -1);
      updatePinDots();
    }
  }

  /** Clear the entire PIN entry. */
  function pinClear() {
    pinEntry = '';
    updatePinDots();
    hide('pin-error');
  }

  /** Update the 5 dot indicators to reflect typed digits. */
  function updatePinDots() {
    for (let i = 0; i < 5; i++) {
      const dot = document.getElementById(`pdot-${i}`);
      if (i < pinEntry.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    }
  }

  /**
   * Check if the entered PIN matches CORRECT_PIN.
   * Correct → close modal and run animated solve.
   * Wrong   → shake the modal box and clear the entry.
   */
  function checkPin() {
    if (pinEntry === CORRECT_PIN) {
      hide('pin-modal');
      pinEntry = '';
      updatePinDots();
      animatedSolve(); // 🎉 reveal the solution cell by cell
    } else {
      // Wrong PIN: shake animation + error message + clear
      const box = document.getElementById('pin-box');
      box.classList.remove('shake');
      // Force reflow to restart animation
      void box.offsetWidth;
      box.classList.add('shake');

      show('pin-error');
      pinEntry = '';
      updatePinDots();

      // Auto-remove error message after 2 seconds
      setTimeout(() => {
        hide('pin-error');
        box.classList.remove('shake');
      }, 2000);
    }
  }

  /**
   * Animate filling the board cell by cell.
   * Only fills empty/incorrect cells so already-correct
   * entries aren't needlessly overwritten.
   * Delay between cells: 40ms (fast but visible).
   */
  function animatedSolve() {
    // Collect all cells that need filling (empty or wrong)
    const toFill = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!fixedCells[r][c] && board[r][c] !== solution[r][c]) {
          toFill.push([r, c]);
        }
      }
    }

    // Reveal each cell with a staggered delay
    toFill.forEach(([r, c], idx) => {
      setTimeout(() => {
        board[r][c] = solution[r][c];
        const cell = getCellEl(r, c);
        cell.textContent = solution[r][c];
        cell.classList.remove('wrong');
        cell.classList.add('hinted'); // green glow for each revealed cell
      }, idx * 40);
    });

    // Show success message after all cells are revealed
    const totalDelay = toFill.length * 40 + 200;
    setTimeout(() => {
      selected = null;
      refreshCellHighlights();
      showMessage('✅ Solution revealed by teacher! Try a new puzzle?', 'success');
      Analytics.log('sudoku', 'solved_by_teacher', { difficulty });
    }, totalDelay);
  }

  /** Show a status message below the grid. */
  function showMessage(msg, type) {
    const el = document.getElementById('sudoku-message');
    el.textContent = msg;
    el.className   = `sudoku-message ${type}`;
    show('sudoku-message');
  }

  /* Expose public API */
  return {
    init, newPuzzle, chooseDifficulty,
    giveHint, checkSolution, solveAll,
    dareCompleted, dareSkip, dareCancelled,
    pinKey, pinBackspace, pinClear, pinCancelled,
  };

})();

