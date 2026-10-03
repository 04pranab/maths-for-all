# Changelog

## Unreleased

### Home-screen presentation refresh
- Replaced the older introductory and footer copy with shorter, learner-focused language.
- Added three non-interactive learning promises: learn at your pace, try without fear, and celebrate every step.
- Added the Sanskrit learning maxim **विद्या ददाति विनयं** with a plain-English interpretation.
- Added a very faint mathematical-symbol background to the home screen only.
- Refreshed the home palette with soft green, blue, warm yellow, and clean paper tones.
- Preserved readable contrast, keyboard focus, text scaling, reduced-motion behaviour, and existing game interactions.
- Kept the visual refresh free of external decorative assets, telemetry, authentication changes, and game-logic changes.

## 2.0.2

### Physical-testing baseline
- Current stable physical-testing baseline for the educational application.
- Authentication and account controls remain temporarily disabled during physical gameplay testing.
- Privacy and research-data policy remains available without login.
- SVG decorative assets are removed from the project.
- Browser smoke/stress, authentication, consent, and research-gateway validation remain part of the regression boundary.

## 2.0.1 · 2026-09-25

### Privacy and consent
- Kept research collection strictly opt-in.
- Prevented the initial research-consent overlay from being dismissed before an explicit Yes or No choice.
- Added an unauthenticated navigation button for the privacy and research-data policy.
- Preserved immediate local research-event purge when research consent is changed to No.
- Expanded the browser-readable research policy with compliance and accountability language.

### Keyboard and accessibility hardening
- Added initial focus handling for authentication and research dialogs.
- Added focus return when dismissible dialogs close.
- Added Escape-key handling for dismissible overlays.
- Kept mandatory first-run research consent open until a choice is made.
- Added Tab and Shift+Tab focus containment for active modal dialogs.
- Preserved visible keyboard focus styling.
- Kept reduced-motion and touch-accessibility behaviour from the previous patch.

### Security and reliability
- Retained random local session tokens and 8-hour session expiry from v2.0.0 development work.
- Retained malformed, expired, and account-mismatched session cleanup.
- Extended browser stress coverage for authentication, consent, modal behaviour, and all five games.
- Kept JavaScript syntax and static-resource checks in CI.

### Documentation and licensing
- Reworked `ONGOING.md` into a concise engineering record.
- Updated the AI-assisted development record.
- Updated the project license with research-policy compliance conditions and a legal-accountability declaration.
- Clarified that applicable law controls over project documentation.
- Updated release metadata to `v2.0.1`.
- Updated the project changelog.

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
