# Little Shop: Product Specification and Pull-Request Plan

**Status:** Planning only. No Little Shop gameplay code is implemented by this plan.  
**Tracking issue:** [#118](https://github.com/04pranab/maths-for-all/issues/118)  
**Prerequisite:** Fraction Bakery physical review must be completed and an acceptance decision recorded before Little Shop implementation begins. Planning can proceed in parallel.

## Product intent

Little Shop turns everyday buying-and-selling scenarios into low-pressure mathematical play. The learner chooses items, builds a basket, checks a budget, pays an amount, and works out totals or change. The shop is a setting for reasoning, not a test of a child's real-world shopping experience.

The game's north star remains: **games are the medium, mathematics is the learning, and human values are the background.**

### Non-negotiable design principles

- Inclusive by default: clear language, readable text, generous controls, keyboard and touch support, visible focus, calm feedback, and no forced speed.
- Errors are information. Allow retry, explain the reasoning, and never shame or punish a learner.
- No timer-driven pressure, leaderboard, competitive ranking, gambling framing, real payment, advertising, or external image dependency.
- Use Indian rupees (₹) and familiar, culturally neutral item names. Use simple inline artwork or CSS only when it materially supports the task.
- Do not assume every learner has handled money or visited a shop. Teach the interface and concepts explicitly.
- Keep calculations exact. Store amounts as integer paise, never floating-point currency values; format as rupees/paise only at the UI boundary.
- Keep progress local and minimal. No names, contact details, diagnoses, behavioural profiling, analytics, or new backend requirement.
- Do not bundle auth, cloud sync, AI, multiplayer, or unrelated game changes into Little Shop.
- One planned PR at a time. Every PR should be independently reviewable, tested, documented where relevant, and merged only when its checks pass.

## Proposed 100-level curriculum

The following is a proposal for LS-00 to confirm before any level implementation. Levels should have a visible map, but learners need not complete all levels in one sitting.

| Levels | Stage | Main learning goal | Example task |
|---|---|---|---|
| 1–10 | Read the Shelf | Read price labels and compare small whole-rupee prices | Find the cheaper item |
| 11–20 | One-Item Checkout | Match a price with an exact amount | Pay ₹8 for one item |
| 21–30 | Basket Basics | Add prices for two items | Find the basket total |
| 31–40 | Budget Basket | Compare a total with a stated budget | Decide whether the basket fits ₹20 |
| 41–50 | Make the Amount | Build an exact amount from available denominations | Select pieces that total ₹15 |
| 51–60 | Change Counter | Calculate change from a payment amount | Pay ₹20 for a ₹13 item |
| 61–70 | More in the Basket | Add three or more items and quantities | Find the total for two of one item and one of another |
| 71–80 | Spend Thoughtfully | Choose a combination that meets a goal and stays within budget | Buy two required items without exceeding ₹30 |
| 81–90 | Rupees and Paise | Read and calculate mixed rupee/paise amounts when appropriate for the learner's level | Total ₹4.50 and ₹2.25 |
| 91–100 | Shopkeeper's Challenge | Combine totals, budget constraints, payment and change | Choose a basket, calculate total, then determine change |

### Curriculum guardrails

- These stages are a design proposal, not yet approved curriculum. LS-00 must make them concrete and agree the intended age/skill range, vocabulary, denomination set, hint progression, and task constraints.
- Do not use prices, quantities, or denominations that make a generated task impossible.
- Each generated question must have exactly one intended answer unless it explicitly asks for any valid combination. If multiple combinations are valid, validate the rule rather than one hard-coded combination.
- Distractors must be plausible but mathematically distinct from the answer.
- Do not make success depend on speed, reading fluency alone, familiarity with brands, or cultural knowledge unrelated to the math.
- If the paise stage is not suitable for the intended group, move it to an optional extension rather than blocking progression.

## PR-by-PR implementation plan

### LS-00 · Specification and acceptance contract
**Deliverable:** This document refined into an agreed game specification before coding.

- Finalize target skills, intended learner range, task wording, 100-level stage progression, price/denomination constraints, feedback rules, persistence rules, and supported interactions.
- Write a task-type matrix: inputs, correct-answer calculation, distractor rules, edge cases, hint steps, and completion criteria.
- Define what happens when the learner leaves mid-task, restarts, reaches the end, or has unavailable/corrupt local storage.
- Define testable accessibility requirements and physical-review acceptance gates.
- No game logic or UI implementation in this PR.

**Acceptance:** Every proposed task type has a precise rule and examples; scope and non-goals are agreed; no unresolved curriculum ambiguity is handed to code.

### LS-01 · Isolated game shell and navigation
**Dependencies:** LS-00.

- Add the Little Shop screen and menu card using existing navigation conventions.
- Add isolated js/little-shop.js and css/little-shop.css modules and load them from the main page.
- Implement open/close/back, return-home behaviour, hidden/active state consistency, and cleanup of event listeners or pending callbacks.
- Add a minimal placeholder screen, not the full game.

**Acceptance:** Navigation works repeatedly; no two game screens remain active; leaving the game cannot mutate its hidden screen; browser console and resource checks stay clean.

### LS-02 · Exact money model and pure math engine
**Dependencies:** LS-00. Must merge before basket/checkout UI calculations.

- Represent all amounts as integer paise internally.
- Implement validated price creation, safe addition/multiplication, total calculation, budget comparison, exact payment, and non-negative change.
- Define formatting/parsing at the boundaries; reject invalid, negative, non-finite, or unsupported values.
- Keep functions pure and independent of the DOM and storage.

**Acceptance:** Unit/property tests cover zero, smallest supported amount, denomination boundaries, many-item totals, quantity multiplication, exact payment, underpayment, change, and maximum supported values. No floating-point currency arithmetic is used.

### LS-03 · Shelf catalogue and basket interactions
**Dependencies:** LS-01, LS-02.

- Render a small, fixed, curated catalogue with clear names, prices, and simple visual distinctions.
- Add/remove items and adjust quantities using accessible controls.
- Show item subtotal and basket total; clearly represent an empty basket and invalid actions.
- Keep state transitions explicit; avoid duplicated or stale totals.

**Acceptance:** Basket totals always match the pure math engine; quantities cannot become invalid; all actions work with pointer/touch and keyboard; rapid repeated actions do not corrupt state.

### LS-04 · Checkout, payment, and change-making
**Dependencies:** LS-02, LS-03.

- Add exact-payment and change-making task types.
- Validate input against the money engine, not display text or rounded floats.
- Give calm retry feedback and optional hints; prevent double submission and stale completion callbacks.
- Explain the relationship between price, payment and change after the learner attempts the task.

**Acceptance:** Exact payment, underpayment, overpayment, zero change, and change boundaries are tested; no impossible question or negative change can be generated; repeated submissions do not double-award completion.

### LS-05 · Level data, generation, and progression
**Dependencies:** LS-00, LS-02, LS-04.

- Implement the visible 100-level map and agreed stages.
- Use explicit level data where teaching intent matters; use bounded generation only where variation helps.
- Make generation deterministic under a supplied seed for reproducible tests and bug reports.
- Define unlocking, completion, retry, replay, and end-of-game behaviour.

**Acceptance:** Every level has a valid task and expected answer; generated tasks are solvable, unique where required, correctly ordered in difficulty, and reproducible with a seed; progression has no skips, dead ends, or accidental locks.

### LS-06 · Hints and educational feedback
**Dependencies:** LS-04, LS-05.

- Add graduated hints that reveal the next reasoning step rather than immediately exposing the answer.
- Provide optional explanation for totals, budgets, exact payment, and change.
- Keep wording respectful, short, and easy to read; allow retries and replay.
- Avoid streak pressure or feedback that implies a learner is bad at maths.

**Acceptance:** Hints are mathematically correct, progressively useful, and do not contradict the prompt; the correct answer is not revealed before an attempt; feedback is announced accessibly.

### LS-07 · Accessibility and responsive hardening
**Dependencies:** LS-01 through LS-06.

- Test desktop, tablet and narrow mobile layouts.
- Verify keyboard-only flow, visible focus, touch target size, text scaling, screen-reader labels/live updates, zoom, contrast, and reduced-motion preferences.
- Ensure instructions and item identity do not depend on colour alone or decorative imagery.
- Fix observed defects in a focused patch; do not add unrelated visual effects.

**Acceptance:** No horizontal overflow or clipped essential controls at agreed viewport sizes; all critical tasks can be completed using each supported input method; no inaccessible modal or focus trap.

### LS-08 · Local progress and privacy boundary
**Dependencies:** LS-05.

- Save only the minimum progress needed, under a versioned namespaced key.
- Handle disabled storage, malformed JSON, stale versions, and reset gracefully.
- Do not store learner names, diagnoses, contact details, answer histories, or telemetry.
- No login, cloud sync, or server schema change.

**Acceptance:** Fresh profile, returning profile, reset, corrupt storage, and storage-unavailable scenarios all work; no private data is introduced; the privacy policy remains accurate.

### LS-09 · Mathematical property tests, browser regression, and stress
**Dependencies:** LS-02 through LS-08.

- Add property-based or deterministic-seeded tests for every task type and generated level.
- Assert exact answers, uniqueness of distractors, valid denomination combinations, budget constraints, correct totals/change, and absence of unsolvable tasks.
- Test rapid start/exit/restart, repeated input, stale callbacks, progress restoration, and storage failures.
- Extend tests/smoke.mjs with Little Shop flows and desktop/tablet/mobile viewport audits.
- Run the repository's complete CI suite, not just game-specific checks.

**Acceptance:** All checks pass on the final PR head; failures are fixed rather than skipped or weakened; test results are linked in the PR description.

### LS-10 · Documentation, physical review, and acceptance
**Dependencies:** All implementation PRs merged.

- Update README, Wiki, ONGOING, CHANGELOG, and AI_USAGE only where warranted.
- Prepare a facilitator script and anonymous observation sheet.
- Run a small supervised formative pilot after applicable institutional permission and learner assent; provide breaks and allow stopping.
- Record blockers, major/minor usability findings, accessibility issues, and reproducible defects.
- Fix blockers and rerun affected tests; run follow-up sessions where a change materially affects the learner experience.

**Acceptance:** No known blocker remains; automated regression is green; the project owner and relevant educator record an explicit accept/revise/pause decision. Do not claim learning effectiveness from a small usability pilot.

## Dependency and merge order

    LS-00 Specification
      ├── LS-01 Game shell
      └── LS-02 Money engine
            └── LS-03 Basket
                  └── LS-04 Checkout/change
                        └── LS-05 Levels/progression
                              └── LS-06 Hints/feedback
    LS-01–LS-06 ──> LS-07 Accessibility hardening
    LS-05 ────────> LS-08 Local progress
    LS-02–LS-08 ──> LS-09 Full regression/stress
    LS-09 ────────> LS-10 Physical review and acceptance

Use a single active implementation PR at a time. The dependency diagram shows logical prerequisites, not permission to create parallel speculative PRs.

## Cross-PR definition of done

Every PR must include:
1. A narrow scope and an explicit reason for the change.
2. Acceptance criteria that can be observed or tested.
3. Unit/property tests for changed mathematics or state transitions.
4. Browser regression coverage for changed interactions.
5. Responsive and accessibility considerations where UI is affected.
6. Documentation updates when behaviour, workflow, or project status changes.
7. CI evidence from the exact final commit.

Never merge a failing check. Never report a test as passed unless its result was actually observed. Do not mark Little Shop accepted until physical review is completed and the decision is recorded.

## Explicit non-goals

No real-money payments, ecommerce, product APIs, accounts, cloud sync, analytics, multiplayer, AI-generated tasks, external asset libraries, competitive leaderboard, forced timer, or changes to other games. Consider new ideas only after the core game is stable and accepted.
