# Changelog

## Unreleased · 2026-09-25

### Authentication session hardening
- Replaced the fixed local session marker with a random per-session token.
- Added an 8-hour session lifetime.
- Invalid, expired, malformed, or account-mismatched sessions are cleared automatically.
- Session state remains in sessionStorage and is not persisted as account data.


### Mobile and accessibility polish
- Improved small-screen game top bars, answer controls, difficulty buttons, dialogs, and Sudoku controls.
- Added consistent keyboard focus visibility and touch-friendly controls.
- Added reduced-motion support for learners who prefer less animation.


### Authentication and gameplay development
- Separate Log in and Sign up flows with username-aware account access.
- Sign up collects username, email, password, and password confirmation.
- Log in accepts either username or email with password.
- Added a prepared Google sign-in entry point for the future production authentication backend.
- Extended Slab Maths into longer rounds with basket targets starting above 35.


## 2.0.0 - 2026-09-24

### Release baseline

Maths for All v2.0.0 is the stable educational-app checkpoint before the planned research and data-infrastructure work for v3.

This release preserves the existing gameplay experience and establishes a known-good baseline for future development.

### Included in the v2 baseline

- Arithmetic Quiz with learning-focused feedback, retries, hints, explanations, and practice mastery tracking
- Math Race with guarded question and timer state transitions
- Slab Maths with diverse slab values from 1 through 15
- Sudoku
- Shape Puzzle
- Responsive desktop and mobile layouts
- Accessibility font scaling with contained card icons
- Mobile Sudoku spacing and layout fixes
- Diverse question generation with repetition controls

### Scope boundary

No authentication, research-data collection, database, telemetry, or participant-management functionality is included in v2. Those changes are reserved for the v3 development line.

### Baseline

The v2.0.0 tag should be treated as the stable reference point for regression testing while v3 infrastructure is developed.
