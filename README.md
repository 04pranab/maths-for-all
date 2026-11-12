# Maths for All 🧮

A simple, friendly mathematics learning website built with plain HTML, CSS, and JavaScript.

Maths for All is designed around a learner-first loop: **try → understand → retry → continue**.

Maths for All is an independent mathematics learning project inspired by inclusive, values-based education. It is not an official initiative of Sri Sathya Sai Vidya Vahini (SSSVV) or the Sri Sathya Sai Central Trust, and no endorsement or formal partnership is claimed. The project's background and educational inspiration are documented on the [Wiki](wiki.html#offering).

## Current release

**v2.0.4 · Geometry & Physical Learning Hardening**

The repository's current implementation includes Number Maze on `main`, with seeded procedural boards and a bounded uniqueness check. Fraction Bakery and Little Shop are implemented but still need supervised learner/educator acceptance. Probability Machine remains in the codebase but is hidden from the visible menu. Math Court is shelved and hidden from the learner menu; its code and tests are retained, not presented as an active game.

The current main branch includes optional account sign-in, Cloudflare D1-backed player progression, achievements, and leaderboards. Guest play remains available. The account system is separate from research: account creation never opts a learner into research. Research collection is currently absent: no research events are recorded locally, queued, uploaded or stored. Ordinary player data such as accounts, completed-game scores, lifetime points, XP, levels, progress and badges is retained solely to provide player functionality and competition. The research endpoint always rejects requests, and migration 0005 removes the legacy research aggregate store.

## Features

- 🧮 Arithmetic Quiz with hints, explanations, retries, and practice mastery
- 🏁 Math Racing
- 🔢 Sudoku
- 🔷 Shape Fitting
- 🏗️ Shape Architect with 100 validated, timed picture-building levels
- 🥐 Fraction Bakery with 100 randomized levels across eight stages
- 🧺 Slab Maths
- 🧩 Number Maze with procedurally generated unique-solution path puzzles
- 🚦 Traffic Control Centre with 150 traffic-planning challenges across three difficulty levels
- 📱 Responsive desktop and mobile layouts
- ⌨️ Keyboard-friendly controls and visible focus states
- ❓ Game-specific How to play instructions
- 🏅 Player HQ with unbounded XP levels, lifetime points, game mastery and achievements
- 🏆 Global and per-game lifetime leaderboards with a personal-rank view
- 🎖️ Earned badges shown on profiles and game tiles
- 🔐 Strictly separate research privacy controls
- 📄 Privacy and research-data policy available without login
- 🚫 Strict No-means-no research collection
- 🧪 Automated browser smoke/stress testing

## Fraction Bakery

Fraction Bakery is a visual fraction game built around making, counting, comparing, and transforming equal portions. It is designed to be harder from the beginning and to vary its interaction types rather than becoming a repetitive multiple-choice quiz.

The current implementation provides:

- 100 levels across eight stages;
- SVG-built pizza, pie, cake, tart, and chocolate-bar dishes;
- randomized fractions with preserved denominators where counting difficulty depends on the number of equal portions;
- slice-and-serve construction challenges that require selecting the requested number of pieces;
- fraction identification, comparison, equivalent fractions, recipe arithmetic, simplification, ordering, missing-count puzzles, differences, and mixed-number conversion;
- a visible 100-level selector;
- browser regression coverage for mathematical validity, randomization, level rendering, and layout containment across all 100 levels.

The browser audit checks horizontal page overflow, workbench boundaries, challenge artwork and controls, and order-dish containment at every level. This is automated layout regression coverage, not a claim that every device or assistive technology has been physically tested.

Probability Machine remains in the codebase and is temporarily hidden from the visible game menu while Fraction Bakery is under review.

## Shape Architect

Shape Architect is a freeform geometry-building game.

Each level presents a reference picture and a separate build canvas. The learner arranges the required geometric pieces to reproduce the reference.

The current release provides:

- 100 deterministic levels, all open for testing;
- real geometric primitives including circles, squares, rectangles, triangles, trapeziums, parallelograms, diamonds, polygons, ovals, semicircles, and right triangles;
- direct manipulation on the build canvas without a separate piece tray;
- no distractor pieces in the physical-testing build set;
- 45-degree rotation steps;
- keyboard movement and pointer/touch dragging;
- undo, restart, hint, and a gentle timer;
- a faint outer silhouette of the complete target figure on the build canvas;
- no internal construction lines in the silhouette guide;
- visual, size-aware completion matching rather than exact pixel placement;
- regression coverage for false completion, level availability, rendering, and visual matching.

The silhouette is a guide, not another puzzle layer. The learner still has to understand the shapes and arrange the pieces.

## Number Maze

Number Maze combines a numbered path puzzle with a space-filling constraint. The learner starts at checkpoint 1, visits later checkpoints in ascending order, moves only between orthogonally adjacent open squares, never revisits a square, and must fill every open square before finishing at the final checkpoint.

The current `main` implementation includes:

- seeded procedural generation for Gentle (4×4), Steady (5×5), and Stretch (6×6) boards;
- a bounded backtracking solver that verifies a unique solution before a puzzle is shown;
- a deterministic validated fallback if randomized construction cannot produce an accepted board;
- three fixed guided starter boards, Explore, Daily Challenge and Challenge Climb modes; progress counts a completed daily board once per day;
- touch/mouse path tracing, keyboard arrow navigation, undo, reset, hints, live progress feedback and an untimed retry-friendly flow;
- on-device progress and deterministic daily puzzles;
- leaving Number Maze returns to its setup menu; re-entering does not resume an unfinished path;
- copyable puzzle codes that reload the exact same seeded board, with validation for malformed codes;
- automated generator invariant tests and browser smoke/responsive coverage.

“Unlimited” means the learner can keep asking for new generated puzzles rather than exhausting a fixed level list. Puzzle seeds are finite machine values, so this should be understood as effectively endless replay, not a mathematical claim that every possible board is guaranteed unique forever. The latest recorded Tests and GitHub Pages deployment workflows for `main` passed on 10 November 2026. Physical-device, assistive-technology and supervised learner/educator evaluation remain separate acceptance steps.

## Little Shop

Little Shop is an open-ended fruit-counter activity. Learners assemble customer orders, check the bill, handle underpayment or exact payment, calculate change for overpayment, and serve the next customer. Currency calculations use integer paise internally; the activity uses simulated money and has no real payment flow. Automated cashier and layout checks exist, but supervised learner/educator review remains pending.

## Traffic Control Centre

Traffic Control Centre is a native game screen in the main arcade at `index.html#traffic-control`. It contains 150 challenges across Easy, Medium and Hard levels. Learners allocate green-signal time between traffic approaches, compare predicted vehicle flow and priority points, and run their plan. Challenge progress is stored locally on the learner's device.

The game markup lives in the main `index.html`; all game-specific JavaScript is consolidated in `js/traffic-control.js`; and its styles live in `css/traffic-control.css`. The former `games/traffic-control/` entry URL redirects to the main arcade route. The focused challenge-data test is `node games/traffic-control/tests/mission-data.test.mjs`.

## Shelved and hidden games

Probability Machine remains implemented (84 levels across seven stages) but its card is hidden from the learner menu. Math Court is shelved at the project owner's direction and hidden from the learner menu; its implementation and tests remain in the repository for possible future review. Neither should be described as an active release game.

## Current presentation

The home screen uses a calm, playful palette and a full-page field of very faint mathematical symbols instead of the previous dotted background.

The existing game cards, learning promises, Sanskrit learning maxim, and accessible typography remain.

## How to play

Each game provides its own **?** control for instructions. The help content is specific to the active game rather than a single unrelated global instruction panel.

For Shape Architect, the instructions explain the reference picture, build canvas, dragging, 45-degree rotation, keyboard movement, undo, restart, hints, and the completion goal.

## Keyboard and overlays

Escape closes dismissible overlays and returns to the underlying state.

After sign-in, the privacy notice explains that research sharing is currently OFF. The notice cannot be dismissed with Escape until the learner acknowledges that research remains off.

Visible focus states and keyboard controls are retained across the application.

## Game links and browser navigation

Each playable game has a stable hash URL, such as `index.html#little-shop`. Opening a game updates the address bar, and refreshing that address reopens the same game. Browser Back and Forward navigate between previously opened games and the menu. The Wiki game guide links directly to each game. Unknown or malformed hashes safely return to the menu.

## Privacy by design

Research collection is **currently disabled in production**. The application is designed for children and inclusive learning. The browser refuses to queue research events and the Worker rejects uploads until a verifiable adult/parent/lawful-guardian consent process is implemented and reviewed.

Account creation, sign-in, saving scores, and competing on leaderboards never imply research consent. The learner can continue playing normally. No research events are saved or uploaded.

The planned database contains ten separate per-game aggregate tables, but those tables are not currently populated by the official production application. School and parent/guardian names are not collected in player profiles.

The full policy is available at `docs/v3/research-data-policy.html`.

## Visual assets

The physical-testing prototype uses no external decorative image library. Interactive game-specific SVG artwork is generated inline where it is part of the gameplay.

## Run locally

No build step is required.

```bash
git clone https://github.com/04pranab/maths-for-all.git
cd maths-for-all
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Testing

The repository includes a headless Chromium smoke/stress suite covering:

- JavaScript syntax;
- required DOM nodes;
- static-resource availability;
- authentication/session paths;
- research-consent enforcement;
- modal keyboard behaviour;
- game-specific help behaviour;
- Shape Architect level availability and visual completion;
- repeated gameplay transitions;
- browser runtime and console errors.

Run the focused arithmetic checks with `npm run test:little-shop-money` and `npm run test:little-shop-cashier`; run the full headless Chromium and backend regression suite with `npm run test:smoke`. Little Shop's browser audit exercises underpayment, exact payment, overpayment, change return, the next-customer loop, and desktop/tablet/mobile layouts. Fraction Bakery separately has a browser audit that renders all 100 levels and checks for horizontal overflow, workbench escape, and artwork escaping order cards.

Automated tests are regression tools, not substitutes for real assistive-technology testing or physical learner/educator review.

## Design principles

1. Learning before scoring.
2. Mistakes are information.
3. Give the learner time.
4. Explain reasoning when help is requested.
5. Let the learner choose when to continue.
6. Keep privacy choices explicit and reversible.
7. Keep research collection separate from ordinary gameplay.

## License

See `LICENSE`.

The project uses a custom responsible-use license. It is not an OSI-approved open-source license.
