# Maths for All · Ongoing Engineering Record

**Repository:** `04pranab/maths-for-all`  
**Author:** Om Pranab Mohanty  
**Current stable release:** `v2.0.1`  
**Next milestone:** `v2.5.0` authentication  
**Next major milestone:** `v2.5.0` authenticated milestone  
**Research milestone:** `v3.0.0`  
**Last updated:** 26 September 2026

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

### v2.0.1 · Reliability, privacy, accessibility, and documentation patch

**Status: PREPARED IN THIS PR**

This patch does not change the product roadmap. It hardens the existing v2 application.

Scope:
- keyboard-operable modal overlays;
- Escape handling for dismissible overlays;
- focus placement and focus return;
- keyboard focus trapping inside active dialogs;
- guest access to the privacy and research-data policy;
- stricter initial research-consent behaviour;
- updated research-policy accountability language;
- updated project license;
- cleaned engineering documentation;
- stronger automated stress coverage;
- release metadata and changelog cleanup.

### v2.5.0 · Authenticated milestone

**Status: PLANNED**

The next milestone after the v2.0.x hardening line is production authentication.

Required before release:
- server-side authentication;
- secure credential handling;
- server-side sessions;
- protected resources;
- email verification;
- production Google OAuth;
- authentication recovery/error handling;
- authentication and consent regression tests.

The current browser-local account/session implementation remains a development shell and must not be represented as production authentication.

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
| v2.5.0 production authentication | IN PROGRESS |
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

## 5. v2.0.1 hardening record

### Modal and keyboard behaviour

The patch adds:
- initial focus inside opened authentication/research dialogs;
- focus return to the invoking control when dismissible dialogs close;
- Escape to close dismissible overlays;
- Escape blocked for the initial mandatory consent choice;
- Tab and Shift+Tab cycling within the active modal;
- keyboard-visible focus styling;
- privacy-policy access from the unauthenticated navigation.

This follows the expected keyboard and focus behaviour for modal dialogs described by the W3C WAI-ARIA Authoring Practices. citeturn2search0turn2search6

### Privacy and policy

The research policy now states that research collection is authorised only when the documented policy is followed. It also distinguishes project-license requirements from obligations imposed by applicable law.

The license does not claim that a private project document can create legal duties by itself. It states the project's contractual conditions and reserves remedies available under applicable law.

India's Digital Personal Data Protection Act, 2023 describes consent as requiring clear affirmative action and provides for withdrawal where consent is the basis of processing. The project's implementation is designed around the stricter explicit-opt-in rule documented here. citeturn1search12turn1search13

### Stress validation

PR #18 established the automated browser stress foundation. This patch extends the validation target to include:
- guest privacy access;
- keyboard opening/closing behaviour;
- initial-consent Escape protection;
- focus containment;
- repeated modal open/close cycles;
- repeated gameplay transitions;
- malformed and expired session handling;
- static-resource validation;
- runtime and console-error detection.

---

## 6. Developer environment, database preparation, and visual foundation

### Status: PREPARED

The repository now has a small, explicit development-environment layer that keeps machine-specific state out of Git while making the expected runtime easy to reproduce.

Included:
- environment templates for local, test, and production configuration;
- Git hygiene rules for environment files, runtime databases, logs, and editor state;
- Node 22 version pinning;
- shared editor and text-file defaults;
- a dedicated local SVG asset library under assets/svg/;
- a separate css/visuals.css presentation layer;
- decorative artwork integrated into the main menu without changing game logic.

The visual layer remains presentation-only. It does not collect data, change authentication, or alter the research-consent boundary.

## 7. Known limitations

- The local authentication implementation is still not production authentication.
- Server-side sessions are not yet implemented.
- Production email verification and Google OAuth are not yet implemented.
- Research database infrastructure is intentionally not implemented.
- Browser automation is headless and does not replace testing with real assistive technologies.
- The custom project license is not an OSI-approved open-source license.
- Operators remain responsible for legal compliance in their deployment jurisdiction.

---

## 8. Development rule

Do not add unrelated features to the hardening line.

The sequence remains:

`v2.0.1 hardening → v2.5.0 production authentication → v3.0.0 research infrastructure`

Each stage should be completed and tested before the next architectural dependency is introduced.


## 9. Current preparation boundary

The repository is prepared for the next local database step without committing any secret values. DATABASE_URL is a placeholder until the Supabase project and connection details are configured locally. The browser remains outside the database boundary.
