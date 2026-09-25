# ONGOING.md

# Maths for All Development Status

**Project:** Maths for All  
**Repository:** 04pranab/maths-for-all  
**Current released baseline:** v2.0.0  
**Current development line:** v2.5.0 → v3.0.0  
**Last updated:** 25 September 2026

---

## 1. Purpose of This File

`ONGOING.md` is the living engineering record for Maths for All.

It records:
- what has been completed;
- what is currently being worked on;
- what remains planned;
- important architectural decisions;
- releases and milestones;
- pull requests and direct commits that materially change the project;
- validation and testing notes;
- known limitations and follow-up work.

**Rule:** every future PR or significant direct commit should leave a short entry here describing what changed and why.

---

## 2. Release and Architecture Roadmap

### v2.0.0 · Stable Educational Baseline

Status: **COMPLETE / FROZEN**

v2.0.0 is the regression reference for the educational application.

Stable baseline:
- Arithmetic Quiz
- Math Racing
- Sudoku
- Shape Fitting
- Slab Maths
- responsive desktop/mobile layouts
- accessibility font scaling
- question-generation and repetition controls
- learning-focused feedback and mastery behaviour.

Baseline commit:
`8741edcc9f1aa6a8fabfc8b08086449e94719aae`

---

### v2.5.0 · Authenticated Milestone

Status: **IN PROGRESS**

Goal: build a complete and stable authentication and consent foundation before introducing the research database and broader research infrastructure.

Important boundary:
The current local account implementation is a development/static-app authentication shell. It is **not** production server-side authentication.

v2.5.0 should not be considered final until the real authentication architecture, protected sessions/routes, validation, and testing are complete.

Current work:
- local account creation/login shell;
- session state;
- explicit research consent;
- persistent privacy control;
- strict analytics consent gate;
- consent hardening;
- browser-readable research policy;
- main-branch integration of the authentication UI.

Remaining work:
- production authentication backend;
- secure server-side credential handling;
- secure session management;
- protected routes/resources;
- authentication failure and recovery handling;
- authentication-focused tests;
- consent-flow regression tests;
- final v2.5.0 validation and release.

---

### v3.0.0 · Research-Enabled Release

Status: **PLANNED**

Goal: introduce the complete research/data infrastructure while preserving the v2 educational baseline.

Planned areas:
1. research data model
2. database infrastructure
3. consent-aware event collection
4. participant management
5. data validation
6. research API
7. research dashboard
8. controlled data export
9. privacy and deletion controls
10. integration testing
11. documentation
12. release-candidate validation
13. v3.0.0 release

Core privacy invariant:
> No explicit research consent means no research event.

Authentication and research consent remain separate concepts.

---

## 3. Completed Work

### PR #1 and early project development

The project established the initial educational game platform and its core gameplay modules.

---

### PR #2

**Theme:** quiz mastery update

Completed:
- quiz mastery is updated immediately after answers.

### PR #3

**Theme:** Math Race hardening

Completed:
- guarded Math Race question/timer state;
- refreshed deployed scripts to avoid stale cached behaviour.

### PR #4

**Theme:** question-generation expansion

Completed:
- broadened and balanced generated question numbers.

### PR #5

**Theme:** repetition control

Completed:
- prevented repeated question numbers until the available pool was exhausted.

### PR #6

**Theme:** diversity and Slab Maths range

Completed:
- stronger uniqueness/repetition control;
- Slab Maths values diversified across 1–15.

### PR #7

**Theme:** accessibility/mobile fixes

Completed:
- contained card icons when text is enlarged;
- improved mobile Sudoku spacing;
- refreshed stylesheet cache.

---

### PR #8 · v2.0.0 Baseline

**Title:** `chore: prepare v2 release baseline`

Status: **MERGED**

Commit: `8741edcc9f1aa6a8fabfc8b08086449e94719aae`

Release: `v2.0.0`

Purpose: freeze a known-good educational baseline before research infrastructure work.

---

### PR #9 · v3 Architecture and Consent Boundary

**Title:** `docs: define v3 architecture and research consent boundary`

Status: **MERGED**

Completed:
- v3 architecture documentation;
- research-data policy;
- explicit opt-in model;
- separation of authentication and research consent;
- consent-aware gateway requirement;
- prohibition on direct research writes from game modules;
- clear definition of data that may and may not be collected.

---

### PR #10 · Local Authentication and Consent UX

**Title:** `feat: add login flow and strict research consent gate`

Status: **MERGED**

Completed:
- local account creation/login shell;
- session-based local login state;
- research-consent dialog after first successful login when no preference exists;
- explicit Yes/No choice;
- explanation of collected and non-collected data;
- persistent Privacy & research control;
- local research-data purge when the user chooses No;
- research exports and summaries disabled without consent.

Important limitation:
This is a local/static application authentication shell, not production backend authentication.

---

### PR #16 · Mobile and Accessibility Polish

Status: IN REVIEW

Completed:
- improved small-screen game top bars and score placement;
- stacked answer controls on narrow screens for easier touch interaction;
- made difficulty buttons full-width on small screens;
- improved mobile modal sizing and authentication form controls;
- strengthened visible keyboard focus styling;
- added touch-friendly interaction handling;
- added reduced-motion support;
- improved small-screen Sudoku controls.

Scope remains presentation and accessibility only. Authentication, consent, analytics, and research boundaries are unchanged.

### PR #12 · Professional Navigation

Status: IN REVIEW

Completed ordered primary navigation, responsive mobile navigation, account access controls, and retained accessibility controls.

### PR #13 · Account Profile Experience

Status: IN REVIEW

Completed account information, username/email display, member-since information, local-account status, research-consent status, and links to progress and privacy controls.

### PR #14 · Separate Login and Signup

Status: IN REVIEW

Completed distinct Log in and Sign up views in the same modal. Sign up collects username, email, password, and confirmation. Log in accepts username or email plus password. A Google sign-in entry point is prepared for the future production backend. Email verification remains a database-backed authentication requirement.

A direct follow-up fix was applied to PR #14, not as another PR, to improve the username presentation and preserve username-or-email login.

### PR #15 · Slab Maths Long-Game Mode

Status: IN REVIEW

Completed longer Slab Maths rounds with basket targets starting above 35, increasing target ranges and required slab counts in later tiers, while preserving 1–15 slab values and existing restart, hint, feasibility, and accessibility behaviour.

### PR #11 · Consent and UX Hardening

**Title:** `fix: harden authentication and consent UX`

Status: **MERGED INTO THE PR #10 DEVELOPMENT LINE**

The PR was originally stacked on the authentication branch rather than directly on `main`.

Completed in the hardening work:
- fixed literal newline markup;
- prevented initial consent dismissal before an explicit choice;
- improved consent modal stacking;
- added browser-readable policy support;
- identified and fixed the missing analytics consent gate;
- made No a strict opt-out.

Because the PR was stacked, the hardening changes required direct main-branch integration afterward.

---

### 25 September 2026 · Direct Main-Branch Patch

Status: **COMPLETED**

The main branch was corrected so the authentication/consent implementation is actually wired into the deployed application.

Changes:
- fixed authentication and consent modal markup in `index.html`;
- loaded `js/consent.js` from the main application;
- enforced `ResearchConsent.isAllowed()` before analytics writes;
- disabled analytics summaries and exports without explicit Yes;
- preserved strict No-means-no behaviour;
- expanded `AI_USAGE.md` with the development record;
- created this `ONGOING.md`.

Direct commits:
- `173e54e65c77a1952fc7487c1f4bd61fda68e851` — `fix: wire login and consent UI into main app`
- `208982113e587efc8b1b1a2cec89beb0fb73b862` — `fix: enforce research consent in analytics`

These were direct commits, not pull requests.

---

## 4. Current State

### Educational application
**Stable.** The v2 educational baseline remains the reference implementation.

### Authentication UI
**Wired into main.** The access interface is a single modal with separate Log in and Sign up views. Log in accepts username or email plus password. Sign up collects username, email, password, and confirmation. Google sign-in is prepared for the future backend, and email verification is reserved for the database-backed authentication stage.

### Research consent
**Wired into main.** Intended flow: `Log in → explicit research choice → Yes or No`.

If the user chooses No:
- research events are rejected;
- locally stored research events are removed;
- normal gameplay remains available;
- the preference can be changed later from `Privacy & research`.

### Analytics
**Consent-gated.** Analytics cannot write, summarize, or export research events unless explicit Yes has been recorded.

### Production authentication
**Not complete.** A real backend authentication system remains future work.

### Research database
**Not started.** The research database and server-side research infrastructure belong after the authentication milestone.

### Slab Maths
**Extended for longer play.** Basket targets now begin above 35 and increase through later tiers while slab values remain within 1–15.

### Mobile and accessibility
**Polished.** Small-screen layouts, touch targets, keyboard focus, dialogs, and reduced-motion behaviour have been updated in PR #16.

---

## 5. Immediate Next Steps

### Step 1 · Verify the main-branch login flow

Test in a fresh browser state:
1. open Maths for All;
2. confirm `Log in` appears;
3. create a local account;
4. confirm login succeeds;
5. confirm the research-consent dialog appears;
6. inspect the collected/not-collected explanation;
7. choose No;
8. play normally;
9. verify no research events are recorded;
10. reopen `Privacy & research`;
11. choose Yes;
12. verify research events can then be recorded;
13. change back to No;
14. verify locally stored research events are removed.

### Step 2 · Review PR #14, PR #15, and PR #16
Review the account-access UX and longer Slab Maths rounds.

### Step 3 · Authentication backend
Design and implement the production authentication boundary.

### Step 4 · Secure sessions and protected resources
Add server-side session handling and protect authenticated resources.

### Step 5 · Authentication tests
Add automated tests for account creation, login, invalid credentials, logout, session expiry, protected access, and consent state handling.

### Step 6 · v2.5.0 release validation
Only after the authentication and consent system is stable and tested should v2.5.0 be released.

---

## 6. Later v3 Work

After v2.5.0:
- research schema;
- database;
- consent-aware event API;
- participant management;
- validation;
- research dashboard;
- exports;
- privacy/deletion mechanisms;
- integration tests;
- documentation;
- release candidate;
- v3.0.0.

---

## 7. Non-Negotiable Privacy Rules

1. Login is not research consent.
2. Silence is not consent.
3. Closing an initial consent prompt is not consent.
4. Only explicit Yes enables research collection.
5. No means no.
6. Choosing No stops future research collection.
7. Choosing No removes locally stored research events.
8. Users can change their preference later.
9. Game modules must not bypass the consent-aware research gateway.
10. Authentication data and research data remain separate.

---

## 8. Development Record Convention

For every future meaningful change, add an entry containing:
- date;
- PR number or direct commit;
- title/message;
- status;
- what changed;
- why it changed;
- validation performed;
- known limitations;
- next follow-up, if any.

This file is the project's running engineering notebook.

---

## 9. Recent Development Notes

PR #14 Google sign-in is a prepared UI entry point only. Actual OAuth and email verification require the future production authentication/database backend.

## 10. Known Limitations

- The current authentication implementation is local/static and is not production server-side authentication.
- Full live browser interaction testing still needs to be performed in a real browser environment.
- Research database infrastructure is not yet implemented.
- v2.5.0 is therefore not yet a final release.
- v3.0.0 remains a future research-enabled milestone.

---

## 11. Milestone Summary

| Milestone | Status | Meaning |
|---|---|---|
| v2.0.0 | COMPLETE | Stable educational baseline |
| PR #9 | COMPLETE | v3 architecture + research consent policy |
| PR #10 | COMPLETE | Local auth + consent UX |
| PR #11 | COMPLETE | Consent hardening work |
| PR #12 | IN REVIEW | Professional navigation |
| PR #13 | IN REVIEW | Account profile experience |
| PR #14 | IN REVIEW | Separate login/signup + Google entry point |
| PR #15 | IN REVIEW | Longer Slab Maths rounds |
| PR #16 | IN REVIEW | Mobile and accessibility polish |
| Main-branch patch | COMPLETE | Auth/consent wiring + analytics gate |
| v2.5.0 | IN PROGRESS | Complete authentication milestone |
| v3.0.0 | PLANNED | Complete research-enabled release |

---

**Living document:** update this file after every meaningful PR, release, architectural change, or direct engineering commit.