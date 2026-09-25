# Research Data Collection Policy

## Status

This document defines the data-collection contract for the planned v3 research infrastructure.

The policy is intentionally strict: **research collection is opt-in.**

## Consent rule

A user must be shown a clear research-data explanation and must actively choose whether to participate.

- **Yes:** the application may collect only the research fields listed below.
- **No:** the application must collect **none of the research fields listed below**.
- Login/account creation does not count as consent.
- Silence, closing the dialog, or continuing to use the games does not count as consent.
- The preference can be changed later from privacy/research settings.
- Switching from Yes to No must immediately stop future research collection and remove locally stored research events.

## What we may collect after explicit Yes

| Category | Examples |
|---|---|
| Game/module | arithmetic quiz, racing, Sudoku, shape fitting, Slab Maths |
| Event type | game opened, answer submitted, hint requested, explanation requested, retry, completion |
| Learning state | difficulty level, correct/incorrect result, attempt count |
| Timing | time spent on an answer or game event |
| Game progress | question/round/level completion |
| Technical event timestamp | time at which the research event occurred |

The exact fields must remain tied to documented research questions. Future fields require a review of this policy and the consent wording.

## What we do not collect as research data

- Passwords or authentication secrets
- Password hashes from the client
- Email addresses unless a separate account/privacy requirement explicitly requires them
- Phone numbers
- Home or precise physical location
- Contacts
- Private messages or free-form personal notes
- Advertising identifiers
- Browser fingerprinting data
- Precise device identifiers
- Camera, microphone, or files
- Data from other applications
- Research events when consent is No

## Existing local progress

The current application already has local progress/analytics functionality. During the consent migration, this functionality must be brought behind the same consent gate so the application does not silently continue recording research-style events after a user declines.

## Data minimization

Prefer derived, non-identifying measurements over raw content. Where possible, record correctness, attempt count, response time, difficulty, and completion rather than unnecessary copies of question text or personal input.

## Withdrawal

A user can change the preference at any time. When research collection is disabled: future research events are rejected, locally stored research events are deleted, research exports are disabled, and the educational application continues to work normally.

## Transparency requirement

The consent UI must use plain language and provide two clearly available choices: **Allow research data collection** and **Do not allow research data collection**. It must include a concise collected/not-collected explanation and access to this full policy.

## Implementation requirement

No game module may write research events directly to localStorage, a future database API, or a future telemetry API. All research writes must pass through the consent-aware research event gateway.
