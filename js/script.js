/* =============================================================
   MATH FOR ALL – script.js
   Core framework shared by every game: screen switching,
   accessibility (text size + read-aloud), the "how to play"
   overlay, and on-device progress analytics.
   Pure vanilla JavaScript – no libraries – works fully offline
   once the page and fonts have loaded once.
   ============================================================= */

/* ---------- Shared DOM helpers (used by every module) ---------- */
function show(id) { const el = document.getElementById(id); if (el) el.classList.remove('hidden'); }
function hide(id) { const el = document.getElementById(id); if (el) el.classList.add('hidden'); }

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const Utils = (function () {
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[randInt(0, arr.length - 1)]; }

  /* Small deterministic PRNG (mulberry32), used so generated content
     (like the 100 Shape Fitting levels) is the SAME every time you
     open a given level, instead of reshuffling on every visit. */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seededRandInt(rng, min, max) { return Math.floor(rng() * (max - min + 1)) + min; }
  function seededShuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function escapeHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { randInt, pick, mulberry32, seededRandInt, seededShuffle, escapeHtml };
})();


/* =============================================================
   ACCESSIBILITY
   Text-size scaling + optional read-aloud (Web Speech API).
   Settings persist per device via localStorage.
   ============================================================= */
const Accessibility = (function () {
  const KEY = 'mfa_a11y_v1';
  const SCALES = [1, 1.15, 1.3, 1.5];
  let idx = 0;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        idx = Math.min(SCALES.length - 1, Math.max(0, data.idx || 0));
      }
    } catch (e) { /* ignore corrupt storage */ }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ idx })); } catch (e) {}
  }
  function apply() {
    document.documentElement.style.setProperty('--font-scale', SCALES[idx]);
  }
  function changeFont(dir) {
    idx = Math.min(SCALES.length - 1, Math.max(0, idx + dir));
    save(); apply();
  }
  function init() { load(); apply(); }

  document.addEventListener('DOMContentLoaded', init);

  return { changeFont };
})();


/* =============================================================
   CONTROLS OVERLAY
   A plain-language "how to play" modal shown the first time a
   learner enters a game, with a manual "?" re-open button too.
   ============================================================= */
const ControlsOverlay = (function () {
  const SEEN_KEY = 'mfa_controls_seen_v1';
  let seen = {};

  const CONTENT = {
    quiz: {
      icon: '🧮', title: 'How to play: Arithmetic Quiz',
      bullets: [
        'Pick a level: Starter, Growing, or Champion.',
        'Read the question, then type your answer in the box.',
        'Press Submit (or the Enter key) to check it.',
        'Every question is new — take your time, there is no clock.',
      ],
    },
    race: {
      icon: '🏁', title: 'How to play: Math Racing',
      bullets: [
        'Choose a timer length and a level, then press Start Race.',
        'Type each answer and press Go — you move straight to the next question.',
        'Try to answer as many as you can before the time runs out.',
        'A wrong answer just moves you on — it never costs you points.',
      ],
    },
    sudoku: {
      icon: '🔢', title: 'How to play: Sudoku Challenge',
      bullets: [
        'Tap an empty square, then tap a number on the keypad below the grid.',
        'Every row, every column, and every 3×3 box must have the numbers 1 to 9, with no repeats.',
        'Use Hint if you are stuck — Check tells you if anything needs fixing.',
        'If you are stuck, ask a teacher or friend to help you reason through the next move.',
      ],
    },
    shape: {
      icon: '🔷', title: 'How to play: Shape Fitting',
      bullets: [
        'Tap a shape in the panel on the right — it will glow gold.',
        'Tap a square on the board to place it there.',
        'Tap the Rotate button (or press R) to turn the shape if it does not fit.',
        'Fill every square on the board to win the level — Hint is there if you need it.',
      ],
    },
    slab: {
      icon: '🧺', title: 'How to play: Slab Maths',
      bullets: [
        'The basket shows a number. Your job is to bring it down to zero.',
        'Drag a number slab into the basket — or tap a slab, then tap the basket.',
        'Each slab you use is subtracted from the basket and disappears.',
        'There is more than one way to win each round — some slabs are extra, just for you to think about.',
        'Stuck? Press Hint, or Restart Round to try again from the start.',
      ],
    },
  };

  function loadSeen() {
    try { seen = JSON.parse(localStorage.getItem(SEEN_KEY)) || {}; } catch (e) { seen = {}; }
  }
  function saveSeen() {
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch (e) {}
  }

  function render(key) {
    const cfg = CONTENT[key];
    if (!cfg) return null;
    document.getElementById('controls-icon').textContent = cfg.icon;
    document.getElementById('controls-title').textContent = cfg.title;
    const list = document.getElementById('controls-list');
    list.innerHTML = '';
    cfg.bullets.forEach(b => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="bullet-icon">👉</span><span>${Utils.escapeHtml(b)}</span>`;
      list.appendChild(li);
    });
    document.getElementById('controls-remember-checkbox').checked = false;
    return cfg;
  }

  let activeKey = null;

  function maybeShow(key) {
    if (!CONTENT[key]) return;
    if (seen[key]) return;
    activeKey = key;
    render(key);
    show('controls-overlay');
  }
  function forceShow(key) {
    if (!CONTENT[key]) return;
    activeKey = key;
    render(key);
    show('controls-overlay');
  }
  function dismiss() {
    const remember = document.getElementById('controls-remember-checkbox').checked;
    if (remember && activeKey) { seen[activeKey] = true; saveSeen(); }
    hide('controls-overlay');
  }

  document.addEventListener('DOMContentLoaded', loadSeen);

  return { maybeShow, forceShow, dismiss };
})();


/* =============================================================
   ANALYTICS
   Lightweight, on-device-only event log. No server, no network
   calls — everything stays in localStorage until a teacher
   chooses to export it as JSON or CSV.
   ============================================================= */
const Analytics = (function () {
  const KEY = 'mfa_analytics_v1';
  const MAX_EVENTS = 1500;
  let events = null;

  function load() {
    if (events) return events;
    try { events = JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { events = []; }
    return events;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(events)); }
    catch (e) { /* storage full or unavailable – drop silently */ }
  }
  function log(category, action, detail) {
    if (typeof ResearchConsent === 'undefined' || !ResearchConsent.isAllowed()) return;
    load();
    events.push({ ts: Date.now(), category, action, detail: detail || {} });
    if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
    save();
  }

  function summary() {
    if (typeof ResearchConsent === 'undefined' || !ResearchConsent.isAllowed()) {
      return { totalEvents: 0, byCategory: {} };
    }
    load();
    const byCategory = {};
    events.forEach(e => {
      const c = byCategory[e.category] || (byCategory[e.category] = { attempts: 0, correct: 0, totalMs: 0, timedCount: 0 });
      if (e.action === 'answer') {
        c.attempts++;
        if (e.detail.correct) c.correct++;
        if (typeof e.detail.timeMs === 'number') { c.totalMs += e.detail.timeMs; c.timedCount++; }
      }
      if (e.action === 'round_complete' || e.action === 'level_complete' || e.action === 'puzzle_solved') {
        c.attempts++; c.correct++;
      }
    });
    return { totalEvents: events.length, byCategory };
  }

  function download(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function exportJSON() {
    if (typeof ResearchConsent === 'undefined' || !ResearchConsent.isAllowed()) return;
    load();
    download('math-for-all-progress.json', JSON.stringify(events, null, 2), 'application/json');
  }
  function exportCSV() {
    if (typeof ResearchConsent === 'undefined' || !ResearchConsent.isAllowed()) return;
    load();
    const rows = [['timestamp_iso','category','action','correct','time_ms','extra']];
    events.forEach(e => {
      rows.push([
        new Date(e.ts).toISOString(),
        e.category, e.action,
        e.detail && ('correct' in e.detail) ? e.detail.correct : '',
        e.detail && ('timeMs' in e.detail) ? e.detail.timeMs : '',
        JSON.stringify(e.detail || {}).replace(/"/g,'""'),
      ]);
    });
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    download('math-for-all-progress.csv', csv, 'text/csv');
  }
  function clearAll() {
    if (!confirm('Clear all progress data stored on this device? This cannot be undone.')) return;
    events = [];
    save();
    Progress.render();
  }

  return { log, summary, exportJSON, exportCSV, clearAll };
})();


/* =============================================================
   PROGRESS DASHBOARD (modal UI over Analytics data)
   ============================================================= */
const Progress = (function () {
  const LABELS = { quiz: 'Arithmetic Quiz', race: 'Math Racing', sudoku: 'Sudoku', shape: 'Shape Fitting', slab: 'Slab Maths' };

  function render() {
    const s = Analytics.summary();
    const grid = document.getElementById('progress-grid');
    const totalAttempts = Object.values(s.byCategory).reduce((a,c) => a + c.attempts, 0);
    const totalCorrect  = Object.values(s.byCategory).reduce((a,c) => a + c.correct, 0);
    const acc = totalAttempts ? Math.round((totalCorrect/totalAttempts)*100) : 0;
    grid.innerHTML = `
      <div class="progress-stat"><span class="stat-num">${totalAttempts}</span><span class="stat-label">Questions tried</span></div>
      <div class="progress-stat"><span class="stat-num">${acc}%</span><span class="stat-label">Overall accuracy</span></div>
      <div class="progress-stat"><span class="stat-num">${s.totalEvents}</span><span class="stat-label">Activities logged</span></div>
    `;
    const body = document.getElementById('progress-table-body');
    const keys = Object.keys(s.byCategory);
    if (keys.length === 0) {
      body.innerHTML = '<tr><td colspan="3">No activity yet — go play something!</td></tr>';
    } else {
      body.innerHTML = keys.map(k => {
        const c = s.byCategory[k];
        const a = c.attempts ? Math.round((c.correct/c.attempts)*100) + '%' : '—';
        return `<tr><td>${LABELS[k] || k}</td><td>${c.attempts}</td><td>${a}</td></tr>`;
      }).join('');
    }
  }
  function open() { render(); show('progress-modal'); }
  function close() { hide('progress-modal'); }

  return { open, close, render };
})();


/* =============================================================
   GAME – top-level screen manager
   ============================================================= */
const Game = (function () {
  const SCREENS = {
    menu:   'screen-menu',
    quiz:   'screen-quiz',
    race:   'screen-race',
    sudoku: 'screen-sudoku',
    shape:  'screen-shape',
    slab:   'screen-slab',
  };

  function showScreen(name) {
    Object.values(SCREENS).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });
    const target = document.getElementById(SCREENS[name]);
    if (target) target.classList.add('active');
    window.scrollTo(0, 0);
  }

  function goHome() { Analytics.log('nav','go_home',{}); showScreen('menu'); }

  function startArithmetic() { Analytics.log('quiz','open',{}); showScreen('quiz'); Quiz.init(); ControlsOverlay.maybeShow('quiz'); }
  function startRacing()     { Analytics.log('race','open',{}); showScreen('race'); Racing.init(); ControlsOverlay.maybeShow('race'); }
  function startSudoku()     { Analytics.log('sudoku','open',{}); showScreen('sudoku'); Sudoku.init(); ControlsOverlay.maybeShow('sudoku'); }
  function startShapePuzzle(){ Analytics.log('shape','open',{}); showScreen('shape'); ShapePuzzle.init(); ControlsOverlay.maybeShow('shape'); }
  function startSlabMath()   { Analytics.log('slab','open',{}); showScreen('slab'); SlabMath.init(); ControlsOverlay.maybeShow('slab'); }

  return { goHome, startArithmetic, startRacing, startSudoku, startShapePuzzle, startSlabMath };
})();

document.addEventListener('DOMContentLoaded', () => {
  console.log('Math For All – ready. गणित सबके लिए');
});
