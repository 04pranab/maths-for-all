/* =============================================================
   MATH FOR ALL – script.js
   Core framework shared by every game: screen switching,
   accessibility (text size + read-aloud), the "how to play"
   overlay, and on-device progress analytics.
   Pure vanilla JavaScript – no libraries – works fully offline
   once the page and fonts have loaded once.
   ============================================================= */

/* ---------- Shared DOM helpers (used by every module) ---------- */
function show(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("hidden");
}
function hide(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden");
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const Utils = (function () {
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function pick(arr) {
    return arr[randInt(0, arr.length - 1)];
  }

  /* Small deterministic PRNG (mulberry32), used so generated content
     (like the 100 Shape Fitting levels) is the SAME every time you
     open a given level, instead of reshuffling on every visit. */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seededRandInt(rng, min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
  }
  function seededShuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  return { randInt, pick, mulberry32, seededRandInt, seededShuffle, escapeHtml };
})();

/* =============================================================
   ACCESSIBILITY
   Text-size scaling + optional read-aloud (Web Speech API).
   Settings persist per device via localStorage.
   ============================================================= */
const Accessibility = (function () {
  const KEY = "mfa_a11y_v1";
  // Keep display scaling within a comfortable 90%–150% range.
  const MIN_SCALE = 0.9;
  const MAX_SCALE = 1.5;
  const SCALES = [MIN_SCALE, 1.1, 1.3, MAX_SCALE];
  let idx = 0;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        idx = Math.min(SCALES.length - 1, Math.max(0, data.idx || 0));
      }
    } catch (e) {
      /* ignore corrupt storage */
    }
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ idx }));
    } catch (e) {}
  }
  function apply() {
    document.documentElement.style.setProperty("--font-scale", SCALES[idx]);
  }
  function changeFont(dir) {
    idx = Math.min(SCALES.length - 1, Math.max(0, idx + dir));
    save();
    apply();
  }
  function init() {
    load();
    apply();
  }

  document.addEventListener("DOMContentLoaded", init);

  return { changeFont };
})();

/* =============================================================
   CONTROLS OVERLAY
   A plain-language "how to play" modal shown the first time a
   learner enters a game, with a manual "?" re-open button too.
   ============================================================= */
const ControlsOverlay = (function () {
  const SEEN_KEY = "mfa_controls_seen_v1";
  let seen = {};

  const CONTENT = {
    quiz: {
      icon: "🧮",
      title: "How to play: Arithmetic Quiz",
      bullets: [
        "Pick a level: Starter, Growing, or Champion.",
        "Read the question, then type your answer in the box.",
        "Press Submit or Enter to check it.",
        "Every question is new — take your time, there is no clock.",
      ],
    },
    race: {
      icon: "🏁",
      title: "How to play: Math Racing",
      bullets: [
        "Choose a timer length and a level, then press Start Race.",
        "Type each answer and press Enter or Go — you move straight to the next question.",
        "Try to answer as many as you can before the time runs out.",
        "Every answer lets you continue — points are never taken away.",
      ],
    },
    sudoku: {
      icon: "🔢",
      title: "How to play: Sudoku Challenge",
      bullets: [
        "Tap an empty square, then use the keypad or laptop number keys 1–9.",
        "Every row, every column, and every 3×3 box must have the numbers 1 to 9, with no repeats.",
        "Use Arrow keys to move, Backspace/Delete to erase, and Hint if you are stuck.",
        "If you are stuck, ask a teacher or friend to help you reason through the next move.",
      ],
    },
    shape: {
      icon: "🔷",
      title: "How to play: Shape Fitting",
      bullets: [
        "Tap a shape in the panel on the right — it will glow gold.",
        "Tap a square on the board to place it there.",
        "Tap Rotate or press R to turn the shape; Esc deselects it.",
        "Fill every square on the board to win the level — Hint is there if you need it.",
      ],
    },
    probability: {
      icon: "🎪",
      title: "How to play: Probability Carnival",
      bullets: [
        "Choose a tent and start with a prediction.",
        "Run the experiment and watch the evidence grow.",
        "A surprising result can become another clue. Use it to explore.",
        "Build, compare, and reason about chance. There is no betting or reward for risk.",
        "Use the reflection and discovery cards to connect the experiment to the idea.",
      ],
    },
    fraction: {
      icon: "🥐",
      title: "How to play: Fraction Bakery",
      bullets: [
        "Every order is generated from a valid fraction, so every challenge has a real solution.",
        "Tap equal dish pieces to build the requested fraction, or choose the matching recipe.",
        "Later orders ask you to compare fractions, find equivalent fractions, and mix like-denominator recipes.",
        "Check how many equal parts make the whole, then try again.",
        "The timer is only a gentle record. There is no penalty for taking your time.",
      ],
    },
    architect: {
      icon: "🏗️",
      title: "How to play: Shape Architect",
      bullets: [
        "Choose an unlocked picture. Every picture has a real solution.",
        "Drag pieces onto the highlighted picture. The pieces must cover the picture exactly.",
        "Extra pieces are included on purpose. Look carefully before choosing.",
        "Rotate a piece with R or the Rotate button. Undo lets you experiment safely.",
        "The clock measures your time, but speed is not the goal. Notice how shapes fit.",
      ],
    },
    numberMaze: {
      icon: "🧩",
      title: "How to play: Number Maze",
      bullets: [
        "Begin at checkpoint 1, then connect each numbered checkpoint in ascending order.",
        "Move one square horizontally or vertically at a time. Walls cannot be crossed.",
        "Fill every open square exactly once without revisiting a square, and reach the final checkpoint last.",
        "Use Undo, Reset path, or Hint whenever you need them. There is no clock and no penalty for experimenting.",
        "Start with Guided Starters, explore fresh boards, repeat the shared Daily Challenge, or try the Challenge Climb.",
        "Copy or load a puzzle code to replay the same board or share it with someone else.",
      ],
    },
    slab: {
      icon: "🧺",
      title: "How to play: Slab Maths",
      bullets: [
        "The basket shows a number. Your job is to bring it down to zero.",
        "Drag a number slab into the basket — or tap a slab, then tap the basket.",
        "Each slab you use is subtracted from the basket and disappears.",
        "There is more than one way to win each round — some slabs are extra, just for you to think about.",
        "Press 1–9 to select a slab by position, Enter to use it, or Esc to deselect.",
      ],
    },
  };

  function loadSeen() {
    try {
      seen = JSON.parse(localStorage.getItem(SEEN_KEY)) || {};
    } catch (e) {
      seen = {};
    }
  }
  function saveSeen() {
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
    } catch (e) {}
  }

  function render(key) {
    const cfg = CONTENT[key];
    if (!cfg) return null;
    document.getElementById("controls-icon").textContent = cfg.icon;
    document.getElementById("controls-title").textContent = cfg.title;
    const list = document.getElementById("controls-list");
    list.innerHTML = "";
    cfg.bullets.forEach((b) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="bullet-icon">👉</span><span>${Utils.escapeHtml(b)}</span>`;
      list.appendChild(li);
    });
    document.getElementById("controls-remember-checkbox").checked = false;
    return cfg;
  }

  let activeKey = null;

  function maybeShow(key) {
    if (!CONTENT[key]) return;
    if (seen[key]) return;
    activeKey = key;
    render(key);
    show("controls-overlay");
  }
  function forceShow(key) {
    if (!CONTENT[key]) return;
    activeKey = key;
    render(key);
    show("controls-overlay");
  }
  function close() {
    hide("controls-overlay");
  }

  function dismiss() {
    const remember = document.getElementById("controls-remember-checkbox").checked;
    if (remember && activeKey) {
      seen[activeKey] = true;
      saveSeen();
    }
    close();
  }

  document.addEventListener("DOMContentLoaded", loadSeen);

  return { maybeShow, forceShow, dismiss, close };
})();

/* =============================================================
   ANALYTICS
   Lightweight, on-device-only event log. No server, no network
   calls — everything stays in localStorage until a teacher
   chooses to export it as JSON or CSV.
   ============================================================= */
const Analytics = (function () {
  const LABELS = {
    quiz: "Arithmetic Quiz",
    race: "Math Racing",
    sudoku: "Sudoku",
    shape: "Shape Fitting",
    slab: "Slab Maths",
    architect: "Shape Architect",
    probability_carnival: "Probability Carnival",
    fraction_bakery: "Fraction Bakery",
    number_maze: "Number Maze",
  };

  function events() {
    if (typeof ResearchEventGateway === "undefined") return [];
    return ResearchEventGateway.read();
  }

  function log(category, action, detail) {
    const payload = detail || {};
    const recorded = typeof ResearchEventGateway !== "undefined"
      ? ResearchEventGateway.record(category, action, payload)
      : false;
    window.MfaAccounts?.onGameEvent?.(category, action, payload);
    return recorded;
  }

  function summary() {
    const list = events();
    const byCategory = {};

    list.forEach((e) => {
      const c =
        byCategory[e.category] ||
        (byCategory[e.category] = {
          attempts: 0,
          correct: 0,
          totalMs: 0,
          timedCount: 0,
        });

      if (e.action === "answer") {
        c.attempts++;
        if (e.detail && e.detail.correct) c.correct++;
        if (e.detail && typeof e.detail.timeMs === "number") {
          c.totalMs += e.detail.timeMs;
          c.timedCount++;
        }
      }

      if (
        e.action === "round_complete" ||
        e.action === "level_complete" ||
        e.action === "puzzle_solved"
      ) {
        c.attempts++;
        c.correct++;
      }
    });

    return { totalEvents: list.length, byCategory };
  }

  function download(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportJSON() {
    const list = events();
    if (!list.length) return;
    download("math-for-all-progress.json", JSON.stringify(list, null, 2), "application/json");
  }

  function exportCSV() {
    const list = events();
    if (!list.length) return;

    const rows = [["timestamp_iso", "category", "action", "correct", "time_ms", "extra"]];
    list.forEach((e) => {
      rows.push([
        new Date(e.ts).toISOString(),
        e.category,
        e.action,
        e.detail && "correct" in e.detail ? e.detail.correct : "",
        e.detail && "timeMs" in e.detail ? e.detail.timeMs : "",
        JSON.stringify(e.detail || {}),
      ]);
    });

    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\\n");

    download("math-for-all-progress.csv", csv, "text/csv");
  }

  function clearAll() {
    if (!confirm("Clear all progress data stored on this device? This cannot be undone.")) return;
    if (typeof ResearchEventGateway !== "undefined") ResearchEventGateway.clear();
    Progress.render();
  }

  return { log, summary, exportJSON, exportCSV, clearAll };
})();

/* =============================================================
   PROGRESS DASHBOARD (modal UI over Analytics data)
   ============================================================= */
const Progress = (function () {
  const LABELS = {
    quiz: "Arithmetic Quiz",
    race: "Math Racing",
    sudoku: "Sudoku",
    shape: "Shape Fitting",
    slab: "Slab Maths",
    architect: "Shape Architect",
    probability_carnival: "Probability Machine",
    fraction_bakery: "Fraction Bakery",
  };

  function render() {
    const s = Analytics.summary();
    const grid = document.getElementById("progress-grid");
    const totalAttempts = Object.values(s.byCategory).reduce((a, c) => a + c.attempts, 0);
    const totalCorrect = Object.values(s.byCategory).reduce((a, c) => a + c.correct, 0);
    const acc = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    grid.innerHTML = `
      <div class="progress-stat"><span class="stat-num">${totalAttempts}</span><span class="stat-label">Questions tried</span></div>
      <div class="progress-stat"><span class="stat-num">${acc}%</span><span class="stat-label">Overall accuracy</span></div>
      <div class="progress-stat"><span class="stat-num">${s.totalEvents}</span><span class="stat-label">Activities logged</span></div>
    `;
    const body = document.getElementById("progress-table-body");
    const keys = Object.keys(s.byCategory);
    if (keys.length === 0) {
      body.innerHTML = '<tr><td colspan="3">No activity yet — go play something!</td></tr>';
    } else {
      body.innerHTML = keys
        .map((k) => {
          const c = s.byCategory[k];
          const a = c.attempts ? Math.round((c.correct / c.attempts) * 100) + "%" : "—";
          return `<tr><td>${LABELS[k] || k}</td><td>${c.attempts}</td><td>${a}</td></tr>`;
        })
        .join("");
    }
  }
  function open() {
    render();
    show("progress-modal");
  }
  function close() {
    hide("progress-modal");
  }

  return { open, close, render };
})();

/* =============================================================
   GAME – top-level screen manager
   ============================================================= */
const Game = (function () {
  const SCREENS = {
    menu: "screen-menu",
    quiz: "screen-quiz",
    race: "screen-race",
    sudoku: "screen-sudoku",
    shape: "screen-shape",
    slab: "screen-slab",
    architect: "screen-architect",
    fraction: "screen-fraction-bakery",
    shop: "screen-little-shop",
    numberMaze: "screen-number-maze",
  };

  const ROUTE_SLUGS = {
    menu: null, quiz: "arithmetic", race: "math-racing", sudoku: "sudoku",
    shape: "shape-fitting", slab: "slab-maths", architect: "shape-architect",
    fraction: "fraction-bakery", shop: "little-shop", numberMaze: "number-maze",
  };
  const ROUTE_STARTERS = {
    arithmetic: startArithmetic, "math-racing": startRacing, sudoku: startSudoku,
    "shape-fitting": startShapePuzzle, "slab-maths": startSlabMath,
    "shape-architect": startShapeArchitect, "fraction-bakery": startFractionBakery,
    "little-shop": startLittleShop, "number-maze": startNumberMaze,
  };
  let restoringHistory = false;
  let lastAppliedUrl = null;

  function writeRoute(slug, replace = false) {
    const nextUrl = window.location.pathname + window.location.search + (slug ? "#" + slug : "");
    const currentUrl = window.location.pathname + window.location.search + window.location.hash;
    if (nextUrl === currentUrl) { lastAppliedUrl = window.location.href; return; }
    if (restoringHistory) return;
    window.history[replace ? "replaceState" : "pushState"]({ gameRoute: slug || "menu" }, "", nextUrl);
    lastAppliedUrl = window.location.href;
  }

  function restoreRoute() {
    if (lastAppliedUrl === window.location.href) return;
    let slug = "";
    try { slug = decodeURIComponent(window.location.hash.slice(1)).trim().toLowerCase(); }
    catch { slug = "__invalid__"; }
    restoringHistory = true;
    try {
      if (!slug) {
        showScreen("menu");
        const probabilityScreen = document.getElementById("screen-probability-carnival");
        if (probabilityScreen) probabilityScreen.hidden = true;
      } else if (slug === "probability-machine") {
        if (window.ProbabilityCarnival) window.ProbabilityCarnival.open();
      } else if (ROUTE_STARTERS[slug]) {
        ROUTE_STARTERS[slug]();
      } else {
        window.history.replaceState({}, "", window.location.pathname + window.location.search);
        showScreen("menu");
        const probabilityScreen = document.getElementById("screen-probability-carnival");
        if (probabilityScreen) probabilityScreen.hidden = true;
      }
    } finally {
      restoringHistory = false;
      lastAppliedUrl = window.location.href;
    }
  }

  window.addEventListener("popstate", restoreRoute);
  window.addEventListener("hashchange", restoreRoute);

  function stopBackgroundGames() {
    if (window.Quiz && typeof Quiz.stop === "function") Quiz.stop();
    if (window.Racing && typeof Racing.stop === "function") Racing.stop();
    if (window.ShapePuzzle && typeof ShapePuzzle.stop === "function") ShapePuzzle.stop();
    if (window.SlabMath && typeof SlabMath.stop === "function") SlabMath.stop();
    if (window.ShapeArchitect && typeof ShapeArchitect.stop === "function") ShapeArchitect.stop();
    if (window.FractionBakery && typeof FractionBakery.stop === "function") FractionBakery.stop();
    if (window.LittleShop && typeof window.LittleShop.stop === "function") window.LittleShop.stop();
    if (window.NumberMaze && typeof window.NumberMaze.stop === "function") window.NumberMaze.stop();
  }

  function showScreen(name) {
    writeRoute(ROUTE_SLUGS[name] ?? null);
    window.CompletionOverlay?.close(false);
    stopBackgroundGames();
    document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
    const target = document.getElementById(SCREENS[name]);
    if (target) target.classList.add("active");
    window.scrollTo(0, 0);
  }

  function goHome() {
    Analytics.log("nav", "go_home", {});
    showScreen("menu");
    const probabilityScreen = document.getElementById("screen-probability-carnival");
    if (probabilityScreen) probabilityScreen.hidden = true;
  }

  function startArithmetic() {
    Analytics.log("quiz", "open", {});
    showScreen("quiz");
    Quiz.init();
    ControlsOverlay.maybeShow("quiz");
  }
  function startRacing() {
    Analytics.log("race", "open", {});
    showScreen("race");
    Racing.init();
    ControlsOverlay.maybeShow("race");
  }
  function startSudoku() {
    Analytics.log("sudoku", "open", {});
    showScreen("sudoku");
    Sudoku.init();
    ControlsOverlay.maybeShow("sudoku");
  }
  function startShapePuzzle() {
    Analytics.log("shape", "open", {});
    showScreen("shape");
    ShapePuzzle.init();
    ControlsOverlay.maybeShow("shape");
  }
  function startSlabMath() {
    Analytics.log("slab", "open", {});
    showScreen("slab");
    SlabMath.init();
    ControlsOverlay.maybeShow("slab");
  }
  function startShapeArchitect() {
    Analytics.log("shape_architect", "open", {});
    showScreen("architect");
    ShapeArchitect.init();
    ControlsOverlay.maybeShow("architect");
  }
  function startFractionBakery() {
    Analytics.log("fraction_bakery", "open", {});
    showScreen("fraction");
    const screen = document.getElementById("screen-fraction-bakery");
    if (screen) screen.hidden = false;
    FractionBakery.init();
    ControlsOverlay.maybeShow("fraction");
  }
  function startLittleShop() {
    showScreen("shop");
    window.LittleShop.init();
  }
  function startNumberMaze() {
    Analytics.log("number_maze", "open", {});
    showScreen("numberMaze");
    NumberMaze.init();
    document.getElementById("number-maze-title")?.focus({ preventScroll: true });
    ControlsOverlay.maybeShow("numberMaze");
  }

  document.addEventListener("DOMContentLoaded", restoreRoute);

  return {
    goHome,
    setRoute: (slug) => writeRoute(slug),
    startArithmetic,
    startRacing,
    startSudoku,
    startShapePuzzle,
    startSlabMath,
    startShapeArchitect,
    startFractionBakery,
    startLittleShop,
    startNumberMaze,
  };
})();

/* =============================================================
   SHARED GAME COMPLETION OVERLAY
   One clear, accessible completion moment across every active game.
   ============================================================= */
const CompletionOverlay = (() => {
  const SHOW_DELAY_MS = 3000;
  let continueAction = null;
  let previousFocus = null;
  let showTimer = null;
  let requestId = 0;

  function show(options = {}) {
    const overlay = document.getElementById("game-completion-overlay");
    if (!overlay) return;
    const title = document.getElementById("game-completion-title");
    const message = document.getElementById("game-completion-message");
    const action = document.getElementById("game-completion-continue");
    if (!title || !message || !action) return;

    // Give the learner a brief moment to see the successful game state before
    // the shared, game-themed celebration appears.
    if (showTimer !== null) window.clearTimeout(showTimer);
    const request = ++requestId;
    overlay.hidden = true;
    document.body.classList.remove("completion-overlay-open");
    continueAction = null;
    previousFocus = null;

    showTimer = window.setTimeout(() => {
      if (request !== requestId) return;
      showTimer = null;

      // Reuse the active game's own theme tokens so the shared dialog follows
      // each game's established palette without changing any game behaviour.
      const activeScreen = document.querySelector(".screen.active");
      const theme = activeScreen ? getComputedStyle(activeScreen) : null;
      const themeTokens = {
        "--completion-accent": "--game-accent",
        "--completion-wash": "--game-wash",
        "--completion-border": "--game-border",
        "--completion-ink": "--game-ink",
      };
      Object.entries(themeTokens).forEach(([target, source]) => {
        const value = theme?.getPropertyValue(source).trim();
        if (value) overlay.style.setProperty(target, value);
        else overlay.style.removeProperty(target);
      });
      previousFocus = document.activeElement;
      continueAction = typeof options.onContinue === "function" ? options.onContinue : null;
      title.textContent = options.title || "Level complete!";
      message.textContent = options.message || "You finished this challenge. Take a moment to enjoy your progress.";
      action.textContent = options.actionLabel || "Continue";
      overlay.hidden = false;
      document.body.classList.add("completion-overlay-open");
      action.focus({ preventScroll: true });
    }, SHOW_DELAY_MS);
  }

  function restoreFocus(target) {
    if (target && target.isConnected && target.getClientRects().length && !target.disabled) {
      target.focus({ preventScroll: true });
      return;
    }
    const fallback = document.querySelector(".screen.active button:not([disabled]), .screen.active a[href], .screen.active [tabindex='0']");
    fallback?.focus({ preventScroll: true });
  }

  function close(restore = true) {
    if (showTimer !== null) {
      window.clearTimeout(showTimer);
      showTimer = null;
    }
    requestId += 1;
    const overlay = document.getElementById("game-completion-overlay");
    if (!overlay || overlay.hidden) {
      continueAction = null;
      previousFocus = null;
      return;
    }
    const target = previousFocus;
    overlay.hidden = true;
    document.body.classList.remove("completion-overlay-open");
    continueAction = null;
    previousFocus = null;
    if (restore) restoreFocus(target);
  }

  function continueGame() {
    const action = continueAction;
    const target = previousFocus;
    close(false);
    if (action) action();
    else restoreFocus(target);
  }

  document.addEventListener("keydown", (event) => {
    const overlay = document.getElementById("game-completion-overlay");
    if (!overlay || overlay.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "Tab") {
      const controls = [...overlay.querySelectorAll("button:not([disabled])")];
      if (!controls.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });

  return { show, close, continue: continueGame };
})();
window.CompletionOverlay = CompletionOverlay;

/* =============================================================
   PHYSICAL PROTOTYPE KEYBOARD CONTROLS
   Shortcuts are active only in their relevant game context and do not
   consume keystrokes while the learner is typing in a text field.
   ============================================================= */
function isTypingTarget(target) {
  return !!target && (target.matches("input, textarea, select") || target.isContentEditable);
}

function activeGameScreen() {
  return document.querySelector(".screen.active");
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Math For All – ready. गणित सबके लिए");
});

/* =============================================================
   PRIMARY NAVIGATION
   Responsive menu and direct navigation actions.
   ============================================================= */
const Navigation = (() => {
  function closeMenu() {
    const menu = document.getElementById("nav-menu-panel");
    const button = document.getElementById("nav-menu-toggle");
    menu?.classList.remove("open");
    button?.setAttribute("aria-expanded", "false");
    button?.setAttribute("aria-label", "Open navigation menu");
  }
  function toggleMenu() {
    const menu = document.getElementById("nav-menu-panel");
    const button = document.getElementById("nav-menu-toggle");
    if (!menu) return;
    const open = !menu.classList.contains("open");
    menu.classList.toggle("open", open);
    button?.setAttribute("aria-expanded", String(open));
    button?.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  }
  function home(){closeMenu();Game.goHome();}
  function progress(){closeMenu();Progress.open();}
  function howToPlay(){
    const screen=document.querySelector(".screen.active")?.id;
    const keys={"screen-quiz":"quiz","screen-race":"race","screen-sudoku":"sudoku","screen-shape":"shape","screen-slab":"slab","screen-architect":"architect","screen-fraction-bakery":"fraction","screen-number-maze":"numberMaze"};
    const key=keys[screen];
    if(key)ControlsOverlay.forceShow(key);
  }
  return{toggleMenu,home,progress,howToPlay,closeMenu};
})();
window.Navigation=Navigation;

/* ---------- Shared Escape handling ----------
   Overlays close first; then local selections clear; otherwise Escape
   returns to the menu. Text fields blur without losing their contents. */
document.addEventListener(
  "keydown",
  (event) => {
    if (event.key !== "Escape") return;

    const overlays = [
      "controls-overlay",
      "progress-modal",
      "research-consent-modal",
      "auth-modal",
      "account-profile-modal",
      "dare-modal",
      "pin-modal",
    ];

    for (const id of overlays) {
      const overlay = document.getElementById(id);
      if (overlay && !overlay.classList.contains("hidden")) {
        event.preventDefault();
        event.stopPropagation();
        if (id === "controls-overlay") ControlsOverlay.close();
        else if (id === "progress-modal") Progress.close();
        else if (id === "auth-modal" && window.Auth?.close) Auth.close();
        else if (id === "account-profile-modal") overlay.classList.add("hidden");
        else if (
          id === "research-consent-modal" &&
          typeof ResearchConsent !== "undefined" &&
          ResearchConsent.get() === null
        )
          return;
        else if (id === "research-consent-modal" && typeof ResearchConsent !== "undefined")
          ResearchConsent.close();
        else overlay.classList.add("hidden");
        return;
      }
    }

    const menu = document.getElementById("nav-menu-panel");
    if (menu?.classList.contains("open") && typeof Navigation !== "undefined") {
      event.preventDefault();
      event.stopPropagation();
      Navigation.closeMenu();
      return;
    }

    const screen = activeGameScreen();
    if (!screen || screen.id === "screen-menu") return;
    event.preventDefault();
    event.stopPropagation();

    if (isTypingTarget(event.target)) {
      event.target.blur();
      return;
    }
    if (screen.id === "screen-shape" && window.ShapePuzzle?.clearSelection?.()) return;
    if (screen.id === "screen-sudoku" && window.Sudoku?.clearSelection?.()) return;
    if (screen.id === "screen-slab" && window.SlabMath?.clearSelection?.()) return;
    if (screen.id === "screen-architect" && window.ShapeArchitect?.clearSelection?.()) return;
    if (screen.id === "screen-fraction-bakery" && window.FractionBakery?.close) {
      window.FractionBakery.close();
      return;
    }
    if (screen.id === "screen-probability-carnival" && window.ProbabilityCarnival?.close) {
      window.ProbabilityCarnival.close();
      return;
    }
    Game.goHome();
  },
  true,
);
