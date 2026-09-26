# Changelog

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

## Unreleased

### Research event boundary
- Added `ResearchEventGateway` as the single consent-aware research-event write boundary.
- Routed local research analytics through the gateway instead of direct storage access.
- Withdrawal now clears persisted and in-memory research events.
- Added gateway validation tests and a dedicated test command.

## Future milestones

### v2.5.0
Production authentication, server-side sessions, email verification, Google OAuth, protected resources, and authentication regression tests.

### v3.0.0
Research database and consent-aware research infrastructure after the authenticated milestone.
