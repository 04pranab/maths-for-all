# Maths for All 🧮

A simple, friendly mathematics learning website built with plain HTML, CSS, and JavaScript.

Maths for All is designed around a learner-first loop: **try → understand → retry → continue**.

## Current release

**v2.0.1**

v2.0.1 is a reliability, privacy, accessibility, and documentation patch on top of the stable v2 educational baseline.

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

## Authentication status

The current account system is a development/static-app shell. It is not production authentication.

The planned v2.5.0 authentication milestone will introduce:
- server-side credential handling;
- server-side sessions;
- protected resources;
- email verification;
- production Google OAuth;
- authentication recovery and regression testing.

Research database infrastructure remains intentionally deferred until after that milestone.

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

The real .env.local stays untracked. Runtime SQLite files under data/ are also ignored. The committed example files contain placeholders only.

The repository targets Node.js 22 and serves the application without a frontend build step.

## Visual assets

Friendly mathematical decoration lives in assets/svg/. The visual layer is intentionally separate from game logic and uses local, dependency-free SVGs. Decorative images are hidden from assistive technology, and the CSS honours the existing reduced-motion preference.

See docs/DESIGN_SYSTEM.md and assets/svg/README.md before adding new artwork.

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

## AI assistance

AI tools have been used as development assistants. See `AI_USAGE.md` for the project's disclosure and human-responsibility record.

---

Built as an educational mathematics project by **Om Pranab Mohanty**.

## Engineering notes

This PR establishes repository hygiene and the visual asset foundation only. It does not merge the separate authentication-hardening or OAuth branches and does not introduce a new research collection path.



## Environment and database preparation

The committed environment files are templates only. They do not contain passwords, database URLs, OAuth secrets, or email-delivery credentials.

DATABASE_URL is intentionally reserved for the upcoming Supabase PostgreSQL migration. Until that migration is merged and tested, the current authentication backend remains unchanged.

See docs/DEVELOPMENT.md for the exact environment boundary and database preparation rules.
