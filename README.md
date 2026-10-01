# Maths for All 🧮

A simple, friendly mathematics learning website built with plain HTML, CSS, and JavaScript.

Maths for All is designed around a learner-first loop: **try → understand → retry → continue**.

## Current release

**v2.0.1**

This branch is a physical game-testing prototype built from the v2 educational baseline.

## Features

- 🧮 Arithmetic Quiz with hints, explanations, retries, and practice mastery
- 🏁 Math Racing
- 🔢 Sudoku
- 🔷 Shape Fitting
- 🧺 Slab Maths with longer rounds
- 📱 Responsive desktop and mobile layouts
- ⌨️ Keyboard-friendly controls and visible focus states
- 🔐 Explicit research-consent controls
- 📄 Privacy and research-data policy available without login
- 🚫 Strict No-means-no research collection
- 🧪 Automated browser smoke/stress testing

## Privacy by design

Research collection is **opt-in**.

Logging in or creating an account is not research consent. The application must receive an explicit Yes before research events can be recorded.

If a learner chooses No:
- research events are blocked;
- locally stored research events are removed;
- normal educational gameplay continues;
- the preference can be reviewed and changed later.

The full policy is available at `docs/v3/research-data-policy.html`, including the data categories, exclusions, withdrawal behaviour, implementation requirements, and compliance declaration.

## Prototype mode

Authentication and account controls are temporarily disabled for physical gameplay testing. The privacy and research-data policy remains available from the navigation and can still be reviewed and changed.

## Project structure

```text
maths-for-all/
├── index.html
├── assets/svg/
│   ├── math-sprout.svg
│   ├── number-cloud.svg
│   ├── geometry-garden.svg
│   ├── fraction-sun.svg
│   ├── graph-vine.svg
│   ├── compass-star.svg
│   ├── abacus-bloom.svg
│   ├── pi-orbit.svg
│   ├── dot-matrix.svg
│   ├── learning-ribbon.svg
│   ├── ruler-sun.svg
│   ├── equation-bubble.svg
│   ├── angle-fan.svg
│   ├── coordinate-stars.svg
│   ├── calculator-flower.svg
│   ├── number-path.svg
│   ├── triangle-kite.svg
│   ├── fraction-pie.svg
│   └── README.md
├── css/
│   ├── style.css
│   ├── slabmath.css
│   └── visuals.css
├── js/
│   ├── consent.js
│   ├── questions.js
│   ├── script.js
│   ├── sudoku.js
│   └── shapes.js
├── docs/v3/
│   └── research-data-policy.html
├── tests/
│   └── smoke.mjs
├── .github/workflows/
│   └── tests.yml
├── .env.example
├── .env.local.example
├── .env.test.example
├── .env.production.example
├── .gitignore
├── .gitattributes
├── .editorconfig
├── .nvmrc
├── LICENSE
├── VERSION
├── CHANGELOG.md
├── ONGOING.md
└── AI_USAGE.md
```

## Developer environment

The repository now includes explicit local environment templates, Git hygiene rules, Node version pinning, and editor defaults.

    cp .env.local.example .env.local
    set -a
    source .env.local
    set +a

The real .env.local stays untracked. The committed example files contain placeholders only.

The prototype is intended to run as a static browser application for physical game testing.

## Visual assets

SVG decoration is intentionally limited to the five game cards on the main menu. The artwork is presentational only and does not replace game instructions or controls.

## Run locally

No build step is required.

```bash
git clone https://github.com/04pranab/maths-for-all.git
cd maths-for-all
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Testing

The repository includes a headless Chromium smoke/stress suite that checks:
- JavaScript syntax;
- required DOM nodes;
- static-resource availability;
- signup/login/session handling;
- research consent enforcement;
- analytics blocking and purge behaviour;
- modal keyboard behaviour;
- repeated gameplay transitions;
- browser runtime and console errors.

The suite is a regression tool, not a substitute for real assistive-technology testing or production security review.

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

