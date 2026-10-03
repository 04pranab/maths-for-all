# Full-System Stress Audit

**Repository:** `04pranab/maths-for-all`  
**Test entry point:** `tests/smoke.mjs`  
**Commands:** `npm run test:smoke` or `npm run test:stress`

## Purpose

This suite is the bounded reliability audit for the physical-testing line. It is deliberately broader than a visual smoke test: it exercises game generation, repeated gameplay, concurrent work, navigation races, malformed input, HTTP error handling, session isolation, static delivery, and browser runtime failures.

The suite is intended to catch regressions without introducing test-only endpoints or changing learning mechanics.

## Stress contract

| Area | Stress coverage |
|---|---:|
| Arithmetic question generation | 40 questions × 3 difficulty levels + 90 concurrent generations |
| Sudoku | 12 fresh puzzles × 3 difficulty levels + 100 repeated new-puzzle/hint actions |
| Slab Maths | 60 repeated rounds + 120 fresh rounds + 30 concurrent generation calls |
| Shape Fitting | all 100 authored levels + 100 repeated actions |
| Arithmetic gameplay | 300 repeated submit/next actions |
| Math Racing | 20 rounds × 30 submissions + timer/stale-callback checks |
| Cross-game navigation | queued starts and immediate screen switching |
| Malformed browser input | blank, text, negative, oversized, NUL and whitespace inputs |
| HTTP multi-user stress | 32 synthetic identities × 30 rounds = 960 workloads |
| HTTP requests in multi-user stress | 2,880 concurrent requests |
| API error paths | unknown route, malformed JSON, rejected origin, rate-limit pressure |

## Concurrency model

The browser portion uses one real headless Chromium page and deliberately queues overlapping asynchronous work. This validates shared game-module state and stale callbacks. It is not a claim that one browser page represents 960 independent browser processes.

The HTTP portion creates independent synthetic player/session identities. It checks that an invalid synthetic session is never accepted as an authenticated user and that every workload completes without a server error.

A true authenticated multi-account test requires test-account provisioning and cleanup against the configured database. This audit intentionally does not create persistent accounts.

## Error-catching rules

The test records:

- uncaught exceptions in the Node test process;
- unhandled promise rejections;
- server stdout/stderr emitted during the run;
- browser runtime exceptions;
- browser console errors;
- HTTP responses at or above the expected error boundary;
- failed static resources.

A failure prints structured JSON containing the failing condition and captured diagnostics. Cleanup runs even when the test fails.

## Important boundaries

This suite does **not** prove:

- accessibility with a real screen reader;
- touch behaviour on every physical device;
- long-duration memory stability over hours or days;
- authenticated multi-account isolation with real database sessions;
- production OAuth or email delivery.

Those require separate environment-specific validation.

## Pass criteria

A CI run is considered passing only when the process exits successfully, the final JSON reports `status: PASS`, and the captured browser/server/process error collections are empty. A GitHub PR being created or merged is not itself evidence that this suite passed.