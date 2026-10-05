# Changelog

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
