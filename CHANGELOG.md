## [Unreleased]
- Added a documented full-system stress contract covering all five games, concurrent generation, malformed browser inputs, API error paths, and 32-user HTTP stress.
- Hardened the browser smoke harness to capture uncaught exceptions, unhandled rejections, server output, browser runtime errors, console errors, and failed resources.
- Added explicit smoke/stress npm commands and a dedicated stress-audit document.
- Follow-up gameplay concurrency audit: stale Quiz/Racing callbacks and background game timers are now cancelled when sessions end or screens change.
- Slab Maths target generation now uses only mathematically constructible target ranges under the two-copy rule and fails explicitly instead of recursively retrying an impossible target.
- Added concurrent generation, rapid queued navigation, stale-callback, fresh Slab round, and all-100-Shape-level structural regression checks.

# Changelog

## Unreleased

### Sudoku side-column correction
- Grouped the dynamically generated number keypad and action buttons inside one explicit side column.
- Removed the remaining layout ambiguity between the board column and the control column.
- Bumped the stylesheet cache version so the corrected layout is loaded by deployed clients.

### Sudoku column alignment
- Made the desktop Sudoku board its own fixed first grid column instead of centering a smaller board inside an oversized column.
- Kept the number keypad and compact action controls together in the second grid column.
- Added regression checks for board width, column alignment, and board-to-keypad spacing.

### Sudoku desktop spacing
- Reduced the excessive horizontal gap between the large Sudoku board and its right-side keypad/actions.
- Kept the desktop board large and the compact action controls separate from the keypad.
- Added regression coverage for the board-to-keypad spacing.

### Hand-drawn mathematics background
- Reworked the decorative page background into an original CSS-only mathematics doodle field inspired by hand-drawn study notes.
- Added faint ruled-paper texture and scattered mathematical marks without importing or embedding the supplied reference artwork.
- Kept the decoration behind the interface and low-contrast so it does not compete with learning content.

### Responsive game layout follow-up
- Kept Sudoku action buttons compact while preserving the larger left-side board.
- Kept the Shape Fitting level buttons visually large for easier reading and selection.
- Added regression coverage for Sudoku action-button sizing and Shape Fitting target sizing.


### Responsive game layout
- Restored natural vertical scrolling when game content exceeds the viewport.
- Reduced oversized Sudoku board cells and keypad controls.
- Reduced Shape Fitting level buttons and selection-panel spacing.
- Added browser regression checks for compact sizing and vertical overflow behaviour.


### Home and navigation robustness
- Removed the home-screen introductory sentence beginning with “Explore numbers, shapes and patterns...”.
- Replaced the previous dotted page background with a very faint full-page mathematical-symbol field.
- Made the navigation How to play action follow the currently active game instead of always opening Arithmetic Quiz instructions.
- Made Escape close the dismissible How to play/Controls overlay.
- Added browser regression coverage for game-specific help and Escape dismissal.
- Preserved the mandatory first-run research-consent Escape restriction.

### Sudoku desktop comfort follow-up
- Increased the desktop Sudoku board from the compact 480px layout to a 600px play board.
- Kept the keypad immediately beside the board in a dedicated 260px side column.
- Changed the keypad to three columns with larger touch targets while keeping action buttons compact.
- Added regression checks for board size, side-column width, keypad target size, spacing, overflow, and scrolling.
- Added a focused Sudoku stylesheet so the existing global stylesheet remains unchanged.

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
