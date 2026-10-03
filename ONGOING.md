# Maths for All · Ongoing Engineering Record

**Repository:** `04pranab/maths-for-all`  
**Author:** Om Pranab Mohanty  
**Current stable release:** `v2.0.2`  
**Current focus:** physical game-mechanics testing, navigation reliability, and presentation validation  
**Authentication:** temporarily disabled for prototype testing  
**Research milestone:** `v3.0.0`  
**Last updated:** 3 October 2026

---

## 1. Current fix stack

### Context-sensitive help and overlay keyboard handling

**Status: PR in review**

This fix line addresses two concrete interaction defects found during the physical-prototype audit:

1. Navigation **How to play** was hard-coded to Arithmetic Quiz.
2. Escape did not close the dismissible Controls/How to play overlay.

The fix keeps the existing game-specific help content unchanged. Only the selection logic and overlay dismissal path are changed.

The mandatory first-run research-consent rule remains unchanged: Escape cannot dismiss it before an explicit choice.

### Home presentation

The home screen no longer displays the removed introductory sentence beginning with “Explore numbers, shapes and patterns...”.

The page background now uses a very faint mathematical-symbol field rather than the previous dotted pattern. The symbols are decorative only and remain behind the interface.

---

## 2. Robustness audit backlog

The project should improve reliability without introducing unnecessary architectural changes.

Track these separately:

- repeated game switching and state reset;
- Math Racing timer cleanup when leaving or restarting;
- stale event/listener detection after repeated game starts;
- malformed localStorage recovery;
- focus return after every dismissible overlay;
- touch and keyboard parity;
- slow-load navigation;
- offline/static-resource validation;
- console and network-error detection;
- reduced-motion and large-text layout regression;
- long-run repeated gameplay stress.

No research infrastructure is required for these checks.

---

## 3. Release line

### v2.0.0 · Stable educational baseline

**Status: COMPLETE / FROZEN**

The v2.0.0 tag remains the regression reference for the educational experience.

### v2.0.2 · Physical-testing baseline

**Status: CURRENT STABLE BASELINE**

Scope:
- all five educational games;
- responsive and keyboard-accessible controls;
- privacy and research-data policy available without login;
- explicit research-consent boundary;
- authentication/account controls temporarily disabled for physical prototype testing;
- SVG decorative assets removed;
- browser smoke/stress validation retained.

### v2.5.0 · Authenticated milestone

**Status: DEFERRED DURING PHYSICAL PROTOTYPE TESTING**

### v3.0.0 · Research-enabled release

**Status: PLANNED**

Research infrastructure begins only after the authentication milestone.

---

## 4. Privacy contract

1. Login is not research consent.
2. Account creation is not research consent.
3. Silence is not consent.
4. Closing the initial consent prompt is not consent.
5. Only explicit Yes enables research collection.
6. No means no.
7. Selecting No blocks future research events.
8. Selecting No removes locally stored research events.
9. Users can change the preference later.
10. The privacy/data policy remains reachable without login.
11. Game modules must not bypass the consent-aware research gateway.
12. Authentication data and research data remain separate.

Full policy:

`docs/v3/research-data-policy.html`

---

## 5. Validation boundary

The automated suite covers:
- JavaScript syntax;
- required DOM nodes;
- static-resource availability;
- authentication/session paths;
- research-consent enforcement;
- modal keyboard behaviour;
- game-specific help behaviour;
- repeated gameplay transitions;
- browser runtime and console errors.

Headless automation does not replace real assistive-technology testing or physical learner testing.

---

## 6. Development rule

Do not add unrelated features to the physical-testing line.

The current sequence remains:

`v2.0.2 physical baseline → interaction robustness → v2.5.0 production authentication → v3.0.0 research infrastructure`

Each stage should be implemented and tested separately.

---
