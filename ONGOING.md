# Maths for All · Ongoing Engineering Record

**Repository:** `04pranab/maths-for-all`  
**Author:** Om Pranab Mohanty  
**Current stable release:** `v2.0.4`  
**Current focus:** Number Maze procedural-generation implementation and CI review; Fraction Bakery physical review remains open  
**Authentication:** temporarily disabled for prototype testing  
**Research milestone:** `v3.0.0`  
**Last updated:** 18 October 2026

**Current quality gate:** Number Maze must pass generator-invariant, JavaScript syntax, menu/help/back-navigation, responsive layout, browser smoke/stress and the repository's full GitHub Actions workflow before merge. Physical device and assistive-technology review remains separate.

## The spirit of this work

This file records engineering decisions, test results and release work. The project's educational and spiritual background is kept on the [Wiki](wiki.html#offering). Maths for All is independent and does not claim official affiliation or endorsement from SSSVV or the Sri Sathya Sai Central Trust.

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
- no external decorative image library; game-specific SVG artwork is generated inline where it is part of the interaction;
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
- all 100 Fraction Bakery levels rendered in-browser, checking horizontal overflow, workbench containment, visual-element boundaries, and order-dish containment;
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
4. **Little Shop** ✅ implementation complete; physical review can be tracked separately
5. **Number Maze** ▶ procedural generation and unique-solution verification in progress

`2048` is intentionally deferred until these five are designed, implemented, tested, animated/fine-tuned, and physically reviewed.

Probability Machine is complete at 84 levels across seven stages. Its final implementation includes probability intuition, comparison, construction, experiments, randomness investigation, probability deduction, and a non-gambling Dice Lab.

Fraction Bakery is implemented as a 100-level randomized fraction game across eight stages:

1. Slice & Serve · Levels 1–12
2. Count the Order · Levels 13–24
3. Bigger Bite · Levels 25–36
4. Equal Recipe · Levels 37–48
5. Mix the Batter · Levels 49–60
6. Bake-off · Levels 61–72
7. Chef's Counter · Levels 73–86
8. Grand Bake · Levels 87–100

The game includes counting and construction, identification, comparison, equivalent fractions, recipe arithmetic, simplification, ordering three fractions, missing-count puzzles, fraction differences, and mixed-number conversion. Difficulty increases through larger denominators and varied reasoning tasks. Randomized generation preserves denominators when the challenge depends on counting equal portions and validates generated arithmetic.

Dish artwork is generated as inline SVG for pizza, pie, cake, tart, and chocolate bars. The browser regression suite now visits every level and checks page overflow, workbench boundaries, visual-element containment, and dish containment inside order cards. The order-card check specifically protects against the artwork overlap found during visual review.

Probability Machine remains implemented at 84 levels across seven stages, including a non-gambling Dice Lab. Its card is temporarily hidden from the visible game menu while Fraction Bakery is under review. The code has not been removed.

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

## 8. Fraction Bakery correctness audit

The Fraction Bakery review found and corrected several challenge-generation issues before physical learner testing:

- Simplification targets are now deliberately unreduced equivalent fractions, while the expected answer remains reduced.
- Missing-count puzzles reduce the fraction before choosing the pieces already counted, then calculate the gap from the reduced numerator. Their four answer choices are distinct and include the correct gap.
- Dish-based equivalent-fraction challenges use proper fractions and show a genuinely different partition.
- Fraction-order puzzles regenerate duplicate values before sorting the three distinct fractions.
- Fraction identification no longer prints the shaded numerator and total denominator beneath the dish, so the learner must count the visual.
- Browser regression coverage validates these invariants across every level with repeated randomized generation and audits all 100 levels at desktop, tablet, and mobile viewport sizes.

These automated checks are a correctness gate, not proof of educational suitability. A person must still play the game with learners and educators before it is accepted.

## 9. Current focus and next steps

The v2.0.4 release remains the stable baseline. Fraction Bakery's automated correctness and responsive checks have passed; its supervised physical review and acceptance decision remain open.

At the project owner's direction, Little Shop's earlier 100-level curriculum and level-map plan is superseded. The game is now an open-ended cashier counter, with no levels, stage progression, timer, or comparison quiz.

The cashier-counter implementation is merged in [PR #129](https://github.com/04pranab/maths-for-all/pull/129) at commit `14abcf89963eb52785b0a2671dc7038934565fa8`. The final PR-head CI run passed: [workflow run #840](https://github.com/04pranab/maths-for-all/actions/runs/39012091995).

The implemented scope is one complete customer transaction:

1. A customer requests two to four fruit items in specified quantities.
2. The learner assembles the exact order from a shelf of 22 fruit choices.
3. Billing is enabled only when basket contents match the order.
4. The customer pays too little, the exact amount, or more than the bill.
5. For underpayment, the learner calculates the shortfall and asks for that amount.
6. For overpayment, the learner calculates the change and returns it using simulated notes and coins.
7. The sale closes, and the learner serves the next customer indefinitely.

All currency arithmetic uses integer paise internally. The cashier prototype has no account, progress profile, real payment, learner analytics, or cloud dependency. The automated acceptance gate covers the three payment paths, retries for incorrect calculations, exact change construction, repeated customer transactions, and desktop/tablet/mobile layouts. A focused Little Shop layout pass widens the counter to 1600px on large screens and uses up to five fruit columns on wide desktops, leaving room to expand the shelf later. Fruit names, prices, customer orders, and feedback now use more readable type, while compact spacing limits unnecessary scrolling. The layout switches to four, three, and two columns as space narrows, keeps touch targets comfortable, and remains scoped to Little Shop.

Next: conduct supervised learner/educator review of the cashier counter and record any usability blockers. Automated tests establish arithmetic and state-transition correctness only, not educational acceptance. Fraction Bakery's separate physical-review decision also remains open.

## 10. Number Maze implementation (unreleased feature branch)

The feature branch `feat/number-maze-unlimited-boards` implements the next game without merging to `main`.

- **Core rule:** one orthogonal path connects numbered checkpoints in ascending order and covers each open square exactly once. The route cannot revisit squares, jump over cells, or pass through walls.
- **Generation:** deterministic seeded paths, three difficulty bands, checkpoint placement, bounded solution counting, and a constrained valid fallback.
- **Modes:** three fixed, repeatable guided starter boards; Explore generates a fresh seeded board; Daily Challenge uses a stable UTC date-and-difficulty seed and counts completion once per day; Challenge Climb advances difficulty every five locally recorded solves.
- **Accessibility:** untimed, retry-friendly play; mouse/touch path tracing; arrow-key navigation; native button semantics; live status announcements; Undo, Reset and hints; responsive styling with reduced-motion support.
- **Validation:** each returned board is checked for a complete route and exactly one solution. Tests cover multiple seeds per difficulty, adjacency, coverage, deterministic generation, checkpoint order and uniqueness. Browser regression coverage includes launch, instructions, controls, daily reproducibility and responsive screens.
- The uniqueness guarantee applies to each accepted puzzle independently. It does not guarantee that no two future random seeds can ever produce an identical board.
- The feature branch must pass the full GitHub Actions workflow before merge. Physical-device testing, screen-reader/assistive-technology review, and feedback from learners and educators remain separate acceptance steps.

