# Maths for All · Ongoing Engineering Record

**Repository:** `04pranab/maths-for-all`  
**Author:** Om Pranab Mohanty  
**Current stable release:** `v2.0.2`  
**Current focus:** physical game-mechanics testing and home-screen presentation validation  
**Authentication:** temporarily disabled for prototype testing  
**Research milestone:** `v3.0.0`  
**Last updated:** 3 October 2026

---

## 1. Purpose

This is the project's living engineering record. It tracks releases, architecture decisions, privacy guarantees, significant changes, validation, and known limitations.

Every substantial PR or direct engineering change should leave a concise record here.

---

## 2. Release line

### v2.0.0 · Stable educational baseline

**Status: COMPLETE / FROZEN**

The v2.0.0 tag is the regression reference for the educational experience.

It contains:
- Arithmetic Quiz
- Math Racing
- Sudoku
- Shape Fitting
- Slab Maths
- responsive layouts
- accessibility text scaling
- learning-focused feedback and mastery behaviour
- question-generation and repetition controls

Baseline commit:

`8741edcc9f1aa6a8fabfc8b08086449e94719aae`

### v2.0.2 · Physical-testing baseline

**Status: CURRENT STABLE BASELINE**

The v2.0.2 line is the current baseline for physical gameplay testing.

Scope:
- all five educational games;
- responsive and keyboard-accessible controls;
- privacy and research-data policy available without login;
- explicit research-consent boundary;
- authentication/account controls temporarily disabled for physical prototype testing;
- SVG decorative assets removed;
- browser smoke/stress validation retained.

### PR #36 · Joyful inclusive home screen

**Status: OPEN / REVIEW**

This PR is intentionally presentation-only.

Scope:
- replace older introductory and footer copy;
- add three small learner-facing learning promises;
- add the verified learning maxim **विद्या ददाति विनयं** with a plain-English interpretation;
- add a very faint mathematical-symbol background to the home screen only;
- refresh the home palette and spacing;
- preserve keyboard focus, text scaling, reduced-motion behaviour, game logic, privacy behaviour, authentication state, and data boundaries.

No game mechanics, telemetry, authentication implementation, research collection, or external decorative assets are introduced.

### v2.5.0 · Authenticated milestone

**Status: DEFERRED DURING PHYSICAL PROTOTYPE TESTING**

The authentication implementation remains in the repository for later work, but its browser entry points are temporarily disabled while the physical game mechanics are tested.

### v3.0.0 · Research-enabled release

**Status: PLANNED**

Research infrastructure begins only after the authentication milestone.

Planned sequence:

`Identity → Authentication → Authorization → Consent → Research API → Database`

Planned areas:
- research schema;
- database;
- consent-aware event gateway;
- participant management;
- validation;
- controlled exports;
- privacy/deletion controls;
- research dashboard;
- integration testing;
- release-candidate validation.

---

## 3. Completed milestone record

| Item | Status |
|---|---|
| v2.0.0 baseline | COMPLETE |
| PR #9 architecture + research consent boundary | MERGED |
| PR #10 local authentication + consent UX | MERGED |
| PR #11 consent hardening | MERGED |
| PR #12 professional navigation | MERGED |
| PR #13 account profile | MERGED |
| PR #14 separate login/signup + Google entry point | MERGED |
| PR #15 longer Slab Maths rounds | MERGED |
| PR #16 mobile/accessibility polish | MERGED |
| PR #17 local session hardening | MERGED |
| PR #18 automated auth/consent + browser stress suite | MERGED |
| v2.0.1 hardening PR | RELEASED |
| PR #20 production auth foundation | MERGED |
| PR #21 browser auth API integration | MERGED |
| PR #22 email verification and recovery | MERGED |
| PR #23 auth security hardening | OPEN / REVIEW |
| PR #24 Google OAuth | OPEN / REVIEW |
| PR #25 environment + visual foundation | OPEN / REVIEW |
| PR #26 consent-aware research gateway | OPEN / REVIEW |
| SVG removal / physical-testing cleanup | COMPLETE |
| v2.0.2 physical-testing baseline | CURRENT |
| PR #36 joyful inclusive home screen | OPEN / REVIEW |
| v2.5.0 production authentication | DEFERRED FOR PROTOTYPE TESTING |
| v3.0.0 research infrastructure | PLANNED |

---

## 4. Privacy contract

The following are non-negotiable application invariants:

1. Login is not research consent.
2. Account creation is not research consent.
3. Silence is not consent.
4. Closing the initial consent prompt is not consent.
5. Only explicit Yes enables research collection.
6. No means no.
7. Selecting No blocks future research events.
8. Selecting No removes locally stored research events.
9. Users can change the preference later.
10. The privacy/data policy must remain reachable without login.
11. Game modules must not bypass the consent-aware research gateway.
12. Authentication data and research data remain separate.
13. New research fields or purposes require a policy and consent review before activation.

Full policy:

`docs/v3/research-data-policy.html`

---

## 5. Validation record

### PR #36

The latest GitHub Actions run is currently in progress.

At the latest inspection:
- syntax check: passed;
- PostgreSQL connectivity check: passed;
- browser stress test: passed;
- production auth API checks: passed;
- research gateway checks: passed;
- CodeRabbit status: passed;
- no pull-request review threads or review submissions are currently recorded.

The workflow has not yet reached a final conclusion, so PR #36 is **not** recorded as fully CI-passed.

### General regression boundary

The automated browser suite covers:
- JavaScript syntax;
- required DOM nodes;
- static-resource availability;
- authentication/session paths;
- research-consent enforcement;
- analytics blocking and purge behaviour;
- modal keyboard behaviour;
- repeated gameplay transitions;
- browser runtime and console errors.

Headless automation does not replace real assistive-technology testing or physical learner testing.

---

## 6. Current presentation boundary

PR #36 changes only the learner-facing home screen.

The visual layer now uses:
- a soft paper background;
- faint mathematical notation confined to the home screen;
- a calmer green/blue/warm-yellow palette;
- concise learner-focused copy;
- non-interactive learning promises;
- accessible type and visible focus states.

The mathematical background is intentionally decorative and uses low opacity so it does not compete with game cards, instructions, controls, or feedback.

No external decorative image library is used.

---

## 7. Known limitations

- Authentication is temporarily disabled on the physical prototype.
- Server-side sessions are not yet implemented.
- Research database infrastructure is intentionally not implemented.
- Browser automation is headless and does not replace testing with real assistive technologies.
- The custom project license is not an OSI-approved open-source license.
- Operators remain responsible for legal compliance in their deployment jurisdiction.

---

## 8. Development rule

Do not add unrelated features to the hardening or physical-testing line.

The sequence remains:

`v2.0.2 physical baseline → v2.5.0 production authentication → v3.0.0 research infrastructure`

Each stage should be completed and tested before the next architectural dependency is introduced.

---

## 9. Current preparation boundary

The repository is prepared for the next local database step without committing any secret values. DATABASE_URL is a placeholder until the Supabase project and connection details are configured locally. The browser remains outside the database boundary.
