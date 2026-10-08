# Maths for All 🧮

A simple, friendly mathematics learning website built with plain HTML, CSS, and JavaScript.

Maths for All is designed around a learner-first loop: **try → understand → retry → continue**.

## Current release

**v2.0.4 · Geometry & Physical Learning Hardening**

This release hardens the physical-learning experience around the first new game, Shape Architect. The existing educational games remain the regression baseline, while Shape Architect is complete at its current acceptance boundary. Probability Machine is also complete. Fraction Bakery is now the next-generation game under physical review.

Authentication and account controls remain temporarily disabled while physical game mechanics are being tested.

## Features

- 🧮 Arithmetic Quiz with hints, explanations, retries, and practice mastery
- 🏁 Math Racing
- 🔢 Sudoku
- 🔷 Shape Fitting
- 🏗️ Shape Architect with 100 validated, timed picture-building levels
- 🥐 Fraction Bakery with 72 randomized, mathematically valid fraction orders
- 🧺 Slab Maths
- 📱 Responsive desktop and mobile layouts
- ⌨️ Keyboard-friendly controls and visible focus states
- ❓ Game-specific How to play instructions
- 🔐 Explicit research-consent controls
- 📄 Privacy and research-data policy available without login
- 🚫 Strict No-means-no research collection
- 🧪 Automated browser smoke/stress testing

## Fraction Bakery

Fraction Bakery is a visual fraction-building game with randomized, valid orders rather than a fixed worksheet sequence.

The current implementation provides:

- 72 levels across six changing gameplay stages;
- SVG-built pizza, pie, cake, tart, and chocolate-bar dishes;
- randomized proper fractions generated from valid equal partitions;
- slice-and-serve construction challenges;
- fraction identification and comparison;
- equivalent-fraction matching;
- like-denominator addition and subtraction through bakery recipes;
- gentle timing without speed penalties;
- browser regression coverage for randomization, mathematical validity, SVG rendering, and representative gameplay.

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

## Current presentation

The home screen uses a calm, playful palette and a full-page field of very faint mathematical symbols instead of the previous dotted background.

The existing game cards, learning promises, Sanskrit learning maxim, and accessible typography remain.

## How to play

Each game provides its own **?** control for instructions. The help content is specific to the active game rather than a single unrelated global instruction panel.

For Shape Architect, the instructions explain the reference picture, build canvas, dragging, 45-degree rotation, keyboard movement, undo, restart, hints, and the completion goal.

## Keyboard and overlays

Escape closes dismissible overlays and returns to the underlying state.

The initial mandatory research-consent prompt remains non-dismissible with Escape until an explicit Yes or No choice is made.

Visible focus states and keyboard controls are retained across the application.

## Privacy by design

Research collection is **opt-in**.

Logging in or creating an account is not research consent. The application must receive an explicit Yes before research events can be recorded.

If a learner chooses No:
- research events are blocked;
- locally stored research events are removed;
- normal educational gameplay continues;
- the preference can be reviewed and changed later.

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

The suite is a regression tool, not a substitute for real assistive-technology testing or physical learner testing.

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
