# Maths for All · Ongoing Engineering Record

**Repository:** `04pranab/maths-for-all`  
**Author:** Om Pranab Mohanty  
**Current stable release:** `v2.0.4`  
**Current focus:** Fraction Bakery physical review after implementation  
**Authentication:** temporarily disabled for prototype testing  
**Research milestone:** `v3.0.0`  
**Last updated:** 7 October 2026

---

## 1. v2.0.4 release baseline

`v2.0.4` is the geometry and physical-learning hardening release.

The existing games remain part of the regression baseline:

- Arithmetic Quiz
- Math Racing
- Sudoku
- Shape Fitting
- Slab Maths

Shape Architect is the first game in the next generation of games and is now implemented and physically reviewed to the current acceptance point.

The release retains:

- keyboard-friendly controls and visible focus states;
- game-specific help and Escape handling for dismissible overlays;
- explicit research consent;
- privacy/data policy access without login;
- no SVG decorative assets;
- browser smoke/stress, authentication, PostgreSQL, and research-gateway checks.

Sudoku uses a 640px desktop board with a separate 260px keypad/action column. Smaller layouts fall back to a single-column presentation with natural vertical scrolling and no horizontal overflow.

---

## 2. Shape Architect acceptance boundary

Shape Architect uses 100 deterministic freeform geometry levels built from recognizable reference pictures.

Each level keeps two separate geometry sets:

- an immutable **target picture** used by the reference canvas and completion validator;
- a mutable **starting set** containing the required pieces in scattered starting positions.

The learner rebuilds the reference picture by freely dragging, rotating and moving geometric primitives such as circles, squares, rectangles, triangles, trapeziums, parallelograms, diamonds, polygons, ovals, semicircles and right triangles.

The physical-testing interface:

- keeps only the required pieces on the build canvas;
- removes the separate piece tray;
- uses 45-degree rotation steps;
- provides keyboard movement and pointer/touch dragging;
- provides undo, restart, hints, and a gentle timer;
- shows a faint outer silhouette of the complete target figure;
- does not show internal construction lines in that silhouette;
- uses size-aware visual matching rather than exact center coordinates.

Completion is accepted only when the complete assembled figure visually overlaps the target within the bounded matching rules. Clearly misplaced pieces remain outside the win condition.

The learner should understand what to do from the reference picture and silhouette without being forced to perform pixel-perfect alignment.

---

## 3. Hardening boundary

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
- all 100 Shape Architect levels;
- Shape Architect level-selector rendering;
- Shape Architect visual completion and false-completion rejection;
- concurrent question and Slab generation;
- rapid cross-game starts;
- stale timer/callback behaviour;
- repeated gameplay stress across all five established games;
- large-text and responsive horizontal-overflow behaviour;
- browser runtime/console errors;
- server/process failures;
- multi-user HTTP stress and API error paths.

Headless automation does not replace real assistive-technology testing or physical learner testing.

---

## 4. Responsibility and privacy boundary

Research collection remains strictly opt-in.

Login or account creation is not research consent.

If the learner chooses No:

- research events are blocked;
- locally stored research events are removed;
- ordinary educational gameplay continues;
- the preference can be reviewed and changed later.

The privacy and research-data policy remains available without login.

The current physical-testing prototype does not represent its authentication shell as production authentication. Production authentication remains a later milestone.

The responsible-use license requires operators who enable research collection to follow the published research-data policy.

---

## 5. New game sequence

The implementation sequence remains:

1. **Shape Architect** ✅
2. **Probability Machine** ✅
3. **Fraction Bakery** ▶ physical review
4. **Little Shop**
5. **Number Maze**

`2048` is intentionally deferred until these five are designed, implemented, tested, animated/fine-tuned, and physically reviewed.

Probability Machine is complete at 84 levels across seven stages. Its final implementation includes probability intuition, comparison, construction, experiments, randomness investigation, probability deduction, and a non-gambling Dice Lab.

Fraction Bakery is the next game and is implemented as a 72-level randomized fraction game with six stages:

1. Probability intuition · Levels 1–10
2. Compare · Levels 11–20
3. Build · Levels 21–30
4. Experiment · Levels 31–40
5. Randomness · Levels 41–50
6. Probability Detective · Levels 51–60

The player progression is **Predict → Compare → Build → Experiment → Investigate → Deduce**. The interaction changes across stages so the game is not a sequence of explanatory click-through screens.

The desktop layout is intentionally compact to reduce unnecessary scrolling. Content is not force-fitted; when a screen genuinely needs more vertical room, normal page scrolling remains available. Mobile uses natural vertical flow and avoids horizontal overflow.

The game has no betting or gambling mechanics. Local progress remains available, and the existing authentication prototype remains disabled.

This game is not considered finished until it passes automated checks and is physically played and accepted.

Each game is handled independently. A game is not advanced to the next one until the current game is satisfactory.

---

## 6. Development rule

Human values remain the background, the game is the medium, and mathematics is the learning.

Do not add unrelated features while a game is being designed or tuned. Finish the current game, test it thoroughly, gather physical-testing feedback, and only then begin the next game.

Small animations are added deliberately during game design and fine-tuning rather than as unrelated decoration.

---

## 7. Release line

### v2.0.0
Stable educational reference.

### v2.0.3
Physical-testing baseline with Sudoku readability hardening.

### v2.0.4
Geometry and physical-learning hardening, including the completed Shape Architect implementation and deployment-cache correction.

### v2.5.0
Deferred production authentication milestone.

### v3.0.0
Planned research-enabled milestone after authentication.

---

## 8. Next step

The v2.0.4 release is frozen at the current acceptance boundary.

The next product step is **Fraction Bakery physical review**. **Little Shop** begins only after Fraction Bakery is accepted.
