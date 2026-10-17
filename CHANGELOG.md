# Changelog

## Unreleased

### Offering and educational inspiration
- Framed Maths for All as a small offering of gratitude, love and seva at the Lotus Feet of Bhagawan Sri Sathya Sai Baba, rather than presenting its purpose as software delivery alone.
- Documented SSSVV’s published guiding principle, inclusive-education approach and role as an educational reference, while clearly stating that Maths for All is independent and does not claim official affiliation, review or endorsement.
- Added links to official Sri Sathya Sai and SSSVV source material and surfaced the dedication on the main page and public wiki.

### Little Shop
- Widened the Little Shop counter and gave large desktop screens a five-column fruit shelf, leaving room for more choices without shrinking labels. Increased fruit names, prices, order text, and feedback to child-readable sizes while keeping spacing tight and controls easy to tap. Responsive checks continue to guard against horizontal overflow and undersized controls.
- Diversified ambiguous fruit symbols for guava, papaya and jackfruit.
- Replaced the planned 100-level quiz and level map with an open-ended fruit-counter cashier loop.
- Added 22 fruit choices, customer-specific item and quantity requests, basket matching before billing, and simulated short/exact/overpayment scenarios.
- Added a subtraction prompt for asking a customer for the amount still owed, plus change calculation and a simulated notes-and-coins drawer.
- Added a next-customer loop with no level progression, timed rounds, real payment, saved learner profile, or backend dependency.
- Added deterministic property checks for 1,000 generated customer orders and browser coverage for all payment outcomes and three viewport sizes. Automated checks do not replace physical learner review.

### Fraction Bakery
- Expanded the game from 72 to 100 levels across eight stages: Slice & Serve, Count the Order, Bigger Bite, Equal Recipe, Mix the Batter, Bake-off, Chef's Counter, and Grand Bake.
- Added more varied challenge types, including simplification, ordering three fractions, missing-count puzzles, differences, and mixed-number conversion.
- Preserved generated denominators where piece-counting difficulty depends on the number of equal portions.
- Corrected missing-count generation to use the reduced numerator, with a valid positive gap and four distinct answer choices.
- Made simplification targets genuinely unreduced, kept dish-based equivalent fractions proper and visibly re-cut, and rejected duplicate fractions in ordering challenges.
- Removed the numerator/denominator answer readout from the visual fraction-identification task.
- Expanded generator regression checks to repeat randomized challenge validation and check all 100 levels at desktop, tablet, and mobile viewport sizes.
- Added a visible 100-level selector and cache-busted the updated game assets.
- Improved the order-card layout so realistic SVG dish artwork stays inside its own card.
- Added a browser regression audit that renders all 100 levels and checks horizontal overflow, workbench containment, visual-element boundaries, and dish containment.
- Verified the audit in GitHub Actions alongside syntax, PostgreSQL connectivity, browser stress, production auth API, and research gateway checks.

### Probability Machine
- Retained the 84-level implementation and non-gambling Dice Lab; the game card is temporarily hidden from the visible menu during Fraction Bakery review.

## 2.0.4 · 2026-10-06 · Geometry & Physical Learning Hardening

### Shape Architect
- Added 100 deterministic freeform geometry levels based on recognizable reference pictures.
- Added real geometric primitives including circles, squares, rectangles, triangles, trapeziums, parallelograms, diamonds, pentagons, hexagons, ovals, semicircles, and right triangles.
- Kept all 100 levels immediately available for testing.
- Removed the separate piece tray from the physical-testing interface.
- Kept only the required pieces in the build canvas rather than adding distractor pieces.
- Changed rotation to reachable 45-degree steps.
- Added a faint outer silhouette of the complete target figure to the Build canvas.
- Removed internal construction lines from the silhouette guide.
- Removed the Build canvas background grid so the silhouette remains visually clear.
- Reworked completion around visual overlap with size-aware, bounded tolerance rather than exact pixel placement.
- Kept rejection boundaries so clearly misplaced pieces do not count as correct.
- Preserved undo, restart, hint, keyboard movement, pointer/touch dragging, visible focus, reduced-motion behavior, and a gentle timer.
- Added regression coverage for visual completion, false completion, level availability, rendering, and the complete 100-level set.
- Refreshed Shape Architect runtime asset versions so the deployed level selector cannot remain hidden behind stale browser assets.

### Physical-learning hardening
- Retained the enlarged 640px Sudoku board for easier physical reading.
- Retained the separate Sudoku keypad/action column and responsive single-column fallback.
- Preserved keyboard-friendly controls, visible focus states, and game-specific help.
- Preserved privacy and research-data policy access without login.
- Preserved strict opt-in research collection and No-means-no enforcement.
- Preserved the boundary that authentication/account controls are not represented as production authentication during physical-game testing.

### Engineering and documentation
- Aligned `VERSION` and `package.json` at 2.0.4.
- Updated the README to describe the actual current interface and Shape Architect behavior.
- Restored an explicit AI-assisted development record for transparent project provenance.
- Kept the responsible-use license and research-data requirements unchanged.

## 2.0.3 · 2026-10-05

### Physical-testing hardening
- Enlarged the Sudoku board from 600px to 640px on desktop.
- Increased Sudoku number typography for easier physical reading.
- Preserved the separate 260px keypad/action column.
- Preserved responsive single-column behaviour and mobile horizontal-overflow protection.
- Extended the Sudoku regression boundary to require the new 640px board size.
- Reconciled release metadata so the package, README, and release record identify v2.0.3 consistently.
- Confirmed the existing five-game stress boundary remains the gate before introducing new games.

## 2.0.2 · 2026-10-05

### Physical-testing baseline
- Current stable physical-testing baseline for the educational application.
- Authentication and account controls remain temporarily disabled during physical gameplay testing.
- Privacy and research-data policy remains available without login.
- SVG decorative assets are removed from the project.
- Browser smoke/stress, authentication, consent, and research-gateway validation remain part of the regression boundary.

## 2.0.1 · 2026-09-25

### Privacy, accessibility, security, and reliability
- Kept research collection strictly opt-in and the initial consent choice non-dismissible until Yes or No.
- Added unauthenticated access to the privacy/data policy.
- Added modal focus handling, Escape dismissal for dismissible overlays, and keyboard focus containment.
- Retained malformed, expired, and account-mismatched session cleanup.
- Extended browser stress coverage and JavaScript/static-resource checks.
- Reworked the engineering record and AI-assisted development record.

## 2.0.0 · 2026-09-24

### Stable educational baseline
- Arithmetic Quiz with learning-focused feedback, retries, hints, explanations, and practice mastery tracking
- Math Racing
- Slab Maths with slab values from 1 through 15
- Sudoku
- Shape Fitting
- Responsive desktop and mobile layouts
- Accessibility font scaling
- Question-generation and repetition controls

v2.0.0 remains the regression reference for the educational application.

## Future milestones

### v2.5.0
Production authentication, server-side sessions, email verification, Google OAuth, protected resources, and authentication regression tests.

### v3.0.0
Research database and consent-aware research infrastructure after the authenticated milestone.
