# Maths for All 🧮

A simple, friendly mathematics learning website built with plain HTML, CSS, and JavaScript.

Maths for All is designed around a learner-first loop: **try → understand → retry → continue**.

## Current release

**v2.0.2**

This is the physical game-testing baseline. Authentication and account controls are temporarily disabled while the game mechanics are tested.

## Features

- 🧮 Arithmetic Quiz with hints, explanations, retries, and practice mastery
- 🏁 Math Racing
- 🔢 Sudoku
- 🔷 Shape Fitting
- 🧺 Slab Maths
- 📱 Responsive desktop and mobile layouts
- ⌨️ Keyboard-friendly controls and visible focus states
- ❓ Game-specific How to play instructions
- 🔐 Explicit research-consent controls
- 📄 Privacy and research-data policy available without login
- 🚫 Strict No-means-no research collection
- 🧪 Automated browser smoke/stress testing

## Current presentation

The home screen uses a calm, playful palette and a full-page field of very faint mathematical symbols instead of the previous dotted background.

The home introduction no longer uses the removed sentence beginning:

`Explore numbers, shapes and patterns at your own pace...`

The existing game cards, learning promises, Sanskrit learning maxim, and accessible typography remain.

## How to play

The navigation **How to play** control follows the active game:
- Arithmetic Quiz → Arithmetic instructions
- Math Racing → Racing instructions
- Sudoku → Sudoku instructions
- Shape Fitting → Shape instructions
- Slab Maths → Slab Maths instructions

If no game is active, the navigation does not open unrelated game instructions.

The existing `?` button inside each game remains game-specific.

## Keyboard and overlays

Escape closes dismissible overlays, including the How to play overlay, and returns to the underlying state.

The initial mandatory research-consent prompt remains non-dismissible with Escape until an explicit Yes or No choice is made.

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

The physical-testing prototype uses no SVG assets or external decorative image library.

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
