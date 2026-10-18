/* Number Maze interaction layer. The engine is deterministic and independently testable. */
const NumberMaze = (() => {
  'use strict';

  const STORAGE_KEY = 'mfa_number_maze_progress_v1';
  const state = {
    puzzle: null,
    path: [],
    mode: 'explore',
    difficulty: 'steady',
    focusCell: 0,
    hintCell: null,
    hints: 0,
    completed: false,
    dragging: false,
    pointerId: null,
    bound: false,
    status: ''
  };

  const byId = id => document.getElementById(id);
  const todayKey = () => new Date().toISOString().slice(0, 10);

  function readProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return {
        solved: Number.isFinite(saved && saved.solved) && saved.solved >= 0 ? saved.solved : 0,
        daily: saved && saved.daily && typeof saved.daily === 'object' ? saved.daily : {}
      };
    } catch (error) {
      return { solved: 0, daily: {} };
    }
  }

  function writeProgress(progress) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (error) { /* Storage may be disabled. */ }
  }

  function challengeDifficulty() {
    return ['gentle', 'steady', 'stretch'][Math.min(2, Math.floor(readProgress().solved / 5))];
  }

  function currentDifficulty() {
    return state.mode === 'challenge' ? challengeDifficulty() : state.difficulty;
  }

  function dailySeed() {
    return NumberMazeEngine.hashSeed('maths-for-all-number-maze-' + todayKey() + '-' + currentDifficulty());
  }

  function dailyProgressKey() {
    return todayKey() + '-' + currentDifficulty();
  }

  function announce(message) {
    state.status = message;
    const feedback = byId('nm-feedback');
    if (feedback) feedback.textContent = message;
  }

  function updateControls() {
    document.querySelectorAll('[data-nm-mode]').forEach(button => {
      const selected = button.dataset.nmMode === state.mode;
      button.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('[data-nm-difficulty]').forEach(button => {
      const selected = button.dataset.nmDifficulty === currentDifficulty();
      button.setAttribute('aria-pressed', String(selected));
      button.disabled = state.mode === 'challenge';
    });
    const current = state.puzzle ? state.puzzle.difficulty : currentDifficulty();
    const names = { gentle: 'Gentle', steady: 'Steady', stretch: 'Stretch' };
    const modeNames = { explore: 'Explore', daily: 'Daily Challenge', challenge: 'Challenge Climb' };
    const difficulty = byId('nm-current-difficulty');
    const mode = byId('nm-current-mode');
    if (difficulty) difficulty.textContent = names[current] || 'Steady';
    if (mode) mode.textContent = modeNames[state.mode] || 'Explore';
    const challengeNote = byId('nm-challenge-note');
    if (challengeNote) challengeNote.hidden = state.mode !== 'challenge';
    const progress = readProgress();
    const solved = byId('nm-total-solved');
    if (solved) solved.textContent = String(progress.solved);
    const dailyBadge = byId('nm-daily-badge');
    if (dailyBadge) {
      const done = !!progress.daily[dailyProgressKey()];
      dailyBadge.textContent = state.mode === 'daily'
        ? (done ? 'Daily puzzle complete' : 'Today’s shared puzzle')
        : 'Untimed · No penalties';
      dailyBadge.classList.toggle('is-complete', state.mode === 'daily' && done);
    }
  }

  function boardCellLabel(cell, puzzle) {
    const row = Math.floor(cell / puzzle.size) + 1;
    const col = cell % puzzle.size + 1;
    const checkpoint = puzzle.checkpointAt[cell];
    const pathIndex = state.path.indexOf(cell);
    let label = 'Row ' + row + ', column ' + col;
    if (checkpoint) label += ', checkpoint ' + checkpoint;
    else label += ', open square';
    if (pathIndex >= 0) label += ', path step ' + (pathIndex + 1);
    if (cell === puzzle.start) label += ', start';
    if (cell === puzzle.end) label += ', finish';
    return label;
  }

  function renderBoard(restoreFocus) {
    const board = byId('nm-board');
    if (!board || !state.puzzle) return;
    const puzzle = state.puzzle;
    const routeIndex = new Map(state.path.map((cell, index) => [cell, index + 1]));
    const open = new Set(puzzle.openCells);
    board.innerHTML = '';
    board.style.setProperty('--nm-size', String(puzzle.size));
    board.setAttribute('aria-label', 'Number Maze board, ' + puzzle.size + ' rows by ' + puzzle.size + ' columns. Begin at checkpoint 1 and fill every open square exactly once.');

    for (let cell = 0; cell < puzzle.size * puzzle.size; cell++) {
      if (!open.has(cell)) {
        const wall = document.createElement('span');
        wall.className = 'nm-wall';
        wall.setAttribute('aria-hidden', 'true');
        board.appendChild(wall);
        continue;
      }

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'nm-cell';
      button.dataset.cell = String(cell);
      button.setAttribute('aria-label', boardCellLabel(cell, puzzle));
      button.setAttribute('aria-pressed', String(routeIndex.has(cell)));
      button.tabIndex = cell === state.focusCell ? 0 : -1;
      const checkpoint = puzzle.checkpointAt[cell];
      if (checkpoint) {
        const mark = document.createElement('span');
        mark.className = 'nm-checkpoint-number';
        mark.textContent = String(checkpoint);
        button.appendChild(mark);
        button.classList.add('has-checkpoint');
      } else {
        const mark = document.createElement('span');
        mark.className = 'nm-empty-mark';
        mark.textContent = '·';
        mark.setAttribute('aria-hidden', 'true');
        button.appendChild(mark);
      }
      if (cell === puzzle.start) button.classList.add('is-start');
      if (cell === puzzle.end) button.classList.add('is-finish');
      if (routeIndex.has(cell)) {
        button.classList.add('is-path');
        const step = document.createElement('span');
        step.className = 'nm-route-step';
        step.textContent = String(routeIndex.get(cell));
        step.setAttribute('aria-hidden', 'true');
        button.appendChild(step);
      }
      if (cell === state.hintCell) button.classList.add('is-hint');
      if (state.completed) button.classList.add('is-complete');
      board.appendChild(button);
    }
    if (restoreFocus) {
      const focused = board.querySelector('[data-cell="' + state.focusCell + '"]');
      if (focused) focused.focus({ preventScroll: true });
    }
  }

  function renderStats() {
    if (!state.puzzle) return;
    const puzzle = state.puzzle;
    const visitedCheckpoints = state.path.filter(cell => puzzle.checkpointAt[cell] > 0).length;
    const pathCount = byId('nm-path-count');
    const cellCount = byId('nm-cell-count');
    const checkpointCount = byId('nm-checkpoint-count');
    const checkpointTotal = byId('nm-checkpoint-total');
    if (pathCount) pathCount.textContent = String(state.path.length);
    if (cellCount) cellCount.textContent = String(puzzle.openCells.length);
    if (checkpointCount) checkpointCount.textContent = String(visitedCheckpoints);
    if (checkpointTotal) checkpointTotal.textContent = String(puzzle.checkpoints.length);
    const completion = byId('nm-complete');
    if (completion) completion.hidden = !state.completed;
    const summary = byId('nm-complete-summary');
    if (summary && state.completed) {
      summary.textContent = 'You connected ' + puzzle.checkpoints.length + ' checkpoints and filled all ' + puzzle.openCells.length + ' open squares. There is always another puzzle to explore.';
    }
    updateControls();
  }

  function render(restoreFocus) {
    renderBoard(!!restoreFocus);
    renderStats();
  }

  function newPuzzle() {
    state.difficulty = currentDifficulty();
    const seed = state.mode === 'daily' ? dailySeed() : NumberMazeEngine.randomSeed();
    state.puzzle = NumberMazeEngine.generate(seed, state.difficulty);
    state.path = [];
    state.focusCell = state.puzzle.start;
    state.hintCell = null;
    state.hints = 0;
    state.completed = false;
    state.dragging = false;
    render(false);
    const names = { gentle: 'Gentle', steady: 'Steady', stretch: 'Stretch' };
    announce((state.mode === 'daily' ? 'Daily challenge' : state.mode === 'challenge' ? 'Challenge Climb' : 'Fresh puzzle') +
      ' ready. ' + names[state.difficulty] + ' difficulty, ' + state.puzzle.openCells.length +
      ' open squares. Begin at checkpoint 1.');
  }

  function setMode(mode) {
    if (!['explore', 'daily', 'challenge'].includes(mode)) return;
    state.mode = mode;
    state.difficulty = currentDifficulty();
    newPuzzle();
    updateControls();
  }

  function setDifficulty(difficulty) {
    if (!Object.prototype.hasOwnProperty.call(NumberMazeEngine.DIFFICULTIES, difficulty) || state.mode === 'challenge') return;
    state.difficulty = difficulty;
    newPuzzle();
  }

  function nextCheckpointNumber() {
    if (!state.puzzle) return 1;
    return state.path.filter(cell => state.puzzle.checkpointAt[cell] > 0).length + 1;
  }

  function areAdjacent(a, b, size) {
    return NumberMazeEngine.neighbours(a, size).includes(b);
  }

  function completePuzzle() {
    if (state.completed || !state.puzzle) return;
    state.completed = true;
    state.hintCell = null;
    const progress = readProgress();
    progress.solved++;
    if (state.mode === 'daily') progress.daily[dailyProgressKey()] = true;
    writeProgress(progress);
    render(false);
    announce('Puzzle complete. Every open square was filled exactly once and each checkpoint was reached in order. Well reasoned!');
    if (typeof Analytics !== 'undefined') {
      Analytics.log('number_maze', 'complete', {
        mode: state.mode,
        difficulty: state.difficulty,
        openCells: state.puzzle.openCells.length,
        hints: state.hints
      });
    }
  }

  function chooseCell(cell, restoreFocus) {
    if (!state.puzzle || state.completed || !Number.isInteger(cell)) return false;
    const puzzle = state.puzzle;
    if (!puzzle.openCells.includes(cell)) return false;

    if (!state.path.length) {
      if (cell !== puzzle.start) {
        announce('Begin at checkpoint 1. You can take your time.');
        state.focusCell = puzzle.start;
        render(true);
        return false;
      }
      state.path = [cell];
      state.focusCell = cell;
      state.hintCell = null;
      announce('Started. Now move to a neighboring open square and follow the checkpoints in order.');
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
      announce('Stepped back one square. Keep exploring.');
      render(true);
      return true;
    }
    if (state.path.includes(cell)) {
      announce('A square can only be visited once. Use Undo to step back along your path.');
      return false;
    }
    if (!areAdjacent(last, cell, puzzle.size)) {
      announce('Move one square at a time. Choose an open neighbor of the current path end.');
      return false;
    }

    const checkpoint = puzzle.checkpointAt[cell] || 0;
    const expected = nextCheckpointNumber();
    if (checkpoint && checkpoint !== expected) {
      announce(checkpoint > expected
        ? 'Checkpoint ' + expected + ' comes next. Follow the numbers in order.'
        : 'That checkpoint has already been passed. Undo to return to it.');
      return false;
    }
    if (cell === puzzle.end && state.path.length + 1 !== puzzle.openCells.length) {
      announce('The finish is the final checkpoint. Fill the other open squares first.');
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
      announce('Every square is filled. Check that the final checkpoint is reached last.');
    } else {
      announce('Path: ' + state.path.length + ' of ' + puzzle.openCells.length + ' open squares. Next checkpoint: ' + nextCheckpointNumber() + '.');
    }
    render(!!restoreFocus);
    return true;
  }

  function undo() {
    if (!state.path.length || state.completed) {
      announce(state.completed ? 'This puzzle is complete. Start another puzzle to keep going.' : 'Your path is already empty. Start at checkpoint 1.');
      return;
    }
    state.path.pop();
    state.focusCell = state.path[state.path.length - 1] ?? state.puzzle.start;
    state.hintCell = null;
    announce(state.path.length ? 'Last step undone.' : 'Path cleared. Begin again at checkpoint 1.');
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
    announce('Path reset. The puzzle stays the same, and every retry is welcome.');
  }

  function hint() {
    if (!state.puzzle || state.completed) {
      announce(state.completed ? 'You solved this puzzle. Start another one for a new challenge.' : 'Start a puzzle first.');
      return;
    }
    let prefix = 0;
    while (prefix < state.path.length && state.path[prefix] === state.puzzle.solution[prefix]) prefix++;
    if (prefix >= state.puzzle.solution.length) {
      announce('You are already at the end of the solution.');
      return;
    }
    state.hints++;
    state.hintCell = state.puzzle.solution[prefix];
    if (prefix < state.path.length) {
      announce('Hint: the glowing square is on the unique complete route. Undo steps until your path lines up with it.');
    } else {
      announce('Hint: try moving to the glowing square next. It keeps the route open for the remaining checkpoints.');
    }
    render(false);
  }

  function handleArrow(event) {
    const screen = byId('screen-number-maze');
    if (!screen || !screen.classList.contains('active') || !event.target || !event.target.matches('#nm-board [data-cell]')) return;
    const current = Number(event.target.dataset.cell);
    const size = state.puzzle ? state.puzzle.size : 0;
    if (!size) return;
    let next = null;
    if (event.key === 'ArrowUp' && current >= size) next = current - size;
    else if (event.key === 'ArrowRight' && current % size < size - 1) next = current + 1;
    else if (event.key === 'ArrowDown' && current + size < size * size) next = current + size;
    else if (event.key === 'ArrowLeft' && current % size > 0) next = current - 1;
    else if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      undo();
      return;
    } else {
      return;
    }
    event.preventDefault();
    if (next === null || !state.puzzle.openCells.includes(next)) {
      announce('That neighboring square is a wall. Choose another direction.');
      return;
    }
    chooseCell(next, true);
  }

  function bindOnce() {
    if (state.bound) return;
    state.bound = true;
    const board = byId('nm-board');
    if (!board) return;

    board.addEventListener('click', event => {
      const button = event.target.closest('[data-cell]');
      if (button) chooseCell(Number(button.dataset.cell), true);
    });
    board.addEventListener('pointerdown', event => {
      const button = event.target.closest('[data-cell]');
      if (!button || !event.isPrimary || event.button !== 0) return;
      const accepted = chooseCell(Number(button.dataset.cell), true);
      if (!accepted) return;
      state.dragging = true;
      state.pointerId = event.pointerId;
      try { board.setPointerCapture(event.pointerId); } catch (error) { /* Some assistive browsers do not expose pointer capture. */ }
      event.preventDefault();
    });
    board.addEventListener('pointermove', event => {
      if (!state.dragging || state.pointerId !== event.pointerId) return;
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const button = target && target.closest ? target.closest('#nm-board [data-cell]') : null;
      if (button) chooseCell(Number(button.dataset.cell), false);
    });
    const finishDrag = event => {
      if (state.pointerId !== null && event.pointerId !== state.pointerId) return;
      state.dragging = false;
      state.pointerId = null;
    };
    board.addEventListener('pointerup', finishDrag);
    board.addEventListener('pointercancel', finishDrag);
    board.addEventListener('lostpointercapture', finishDrag);
    document.addEventListener('keydown', handleArrow);
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
    newPuzzle,
    setMode,
    setDifficulty,
    undo,
    hint,
    resetPath,
    getSummary: () => ({
      mode: state.mode,
      difficulty: currentDifficulty(),
      pathLength: state.path.length,
      openCellCount: state.puzzle ? state.puzzle.openCells.length : 0,
      checkpointCount: state.puzzle ? state.puzzle.checkpoints.length : 0,
      completed: state.completed,
      solved: readProgress().solved
    })
  };
})();

window.NumberMaze = NumberMaze;
