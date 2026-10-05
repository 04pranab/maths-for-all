# Maths for All · Ongoing Engineering Record

**Repository:** `04pranab/maths-for-all`  
**Author:** Om Pranab Mohanty  
**Current stable release:** `v2.0.3`  
**Current focus:** physical game-mechanics testing and baseline hardening  
**Authentication:** temporarily disabled for prototype testing  
**Research milestone:** `v3.0.0`  
**Last updated:** 5 October 2026

---

## 1. Stable physical-testing baseline

`v2.0.3` is the current hardened baseline before the next generation of educational games.

The existing five games are:
- Arithmetic Quiz
- Math Racing
- Sudoku
- Shape Fitting
- Slab Maths

The baseline retains:
- keyboard-friendly controls and visible focus states;
- game-specific help and Escape handling for dismissible overlays;
- explicit research consent;
- privacy/data policy access without login;
- no SVG decorative assets;
- browser smoke/stress, authentication, PostgreSQL, and research-gateway checks.

Sudoku now uses a 640px desktop board with a separate 260px keypad/action column. Smaller layouts fall back to a single-column presentation with natural vertical scrolling and no horizontal overflow.

---

## 2. Hardening boundary

The automated regression suite checks:
- JavaScript syntax;
- required DOM nodes;
- static-resource availability;
- authentication/session paths;
- research-consent enforcement;
- malformed browser inputs;
- game-specific help and modal keyboard behaviour;
- Sudoku uniqueness and repeated puzzle generation;
- Slab Maths constructibility and repeated generation;
- all 100 Shape Fitting levels;
- concurrent question and Slab generation;
- rapid cross-game starts;
- stale timer/callback behaviour;
- repeated gameplay stress across all five games;
- large-text and responsive horizontal-overflow behaviour;
- browser runtime/console errors;
- server/process failures;
- multi-user HTTP stress and API error paths.

Headless automation does not replace real assistive-technology testing or physical learner testing.

---

## 3. New game sequence

No new game is being implemented in the hardening release.

The agreed implementation order is fixed:

1. **Shape Architect**
2. **Probability Carnival 🎪**
3. **Fraction Bakery**
4. **Little Shop**
5. **Number Maze**

`2048` is intentionally deferred until these five are designed, implemented, tested, animated/fine-tuned, and physically reviewed.

Each game will be handled independently. A game is not advanced to the next one until the current game is satisfactory.

---

## 4. Development rule

Human values remain the background, the game is the medium, and mathematics is the learning.

Do not add unrelated features while a game is being designed or tuned. Finish the current game, test it thoroughly, gather physical-testing feedback, and only then begin the next game.

---

## 5. Release line

### v2.0.0
Stable educational reference.

### v2.0.3
Current hardened physical-testing baseline.

### v2.5.0
Deferred production authentication milestone.

### v3.0.0
Planned research-enabled milestone after authentication.
