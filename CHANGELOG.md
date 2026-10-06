# Changelog

## Unreleased

No changes are currently committed after v2.0.4. The next planned work is design discussion for Probability Carnival; implementation does not begin until that design is confirmed.

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
