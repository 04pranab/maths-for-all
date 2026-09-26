# Maths for All v3 Architecture

## Purpose

v3 extends the stable v2.0.0 educational application with optional research infrastructure. The existing learning experience remains the product baseline.

## Development boundaries

- v2.0.0 remains the regression baseline.
- v2.5.0 is the planned authenticated milestone.
- v3.0.0 is the planned research-enabled release.
- Research collection must never be enabled implicitly.
- No research event may be recorded before explicit user consent.
- If a user declines research collection, research collection remains disabled until the user explicitly changes the preference.
- Changing the preference to No must stop future collection immediately and clear locally stored research events from the device.
- Authentication and research consent are separate concepts. Having an account does not imply consent to research collection.

## Planned layers

Presentation: educational games, login/account UI, research consent/privacy settings.

Application: game state, authentication, consent policy, research event gateway.

Data: account data, optional research events, research exports/database.

## Research event gateway

All research-style events pass through `ResearchEventGateway`. Game code and presentation code must not write research events directly to `localStorage`, a database, or a telemetry endpoint.

Game event -> `ResearchEventGateway` -> consent NO: discard; consent YES: record.

The gateway owns the research-event storage boundary and rejects malformed category/action values. Withdrawal clears both persisted events and the gateway's in-memory cache. This prevents a new game feature from accidentally bypassing the consent policy or resurrecting events after withdrawal.

## v3 data principles

1. Collect only data required for defined research questions.
2. Do not collect data merely because it is technically available.
3. Do not collect passwords, authentication secrets, free-form personal notes, contact lists, advertising identifiers, precise location, or unnecessary device identifiers as research data.
4. Do not treat account login as research consent.
5. Explain data categories before consent.
6. Provide a persistent way to review and change the preference.
7. A No choice must be technically enforced, not merely described.
8. Consent changes must not themselves create research events while collection is disabled.

## Planned authentication boundary

Authentication is required for the v2.5.0 milestone, but authentication records and research records must remain separate.

Authentication will eventually manage account identity, login credential material handled by the authentication service, session state, and account lifecycle.

Research infrastructure will manage only explicitly consented research events.

## Release gates

### v2.5.0

Release only when authentication, login/logout, protected application flow, consent preference UI, consent enforcement, and regression tests are working.

### v3.0.0

Release only when the research data model, database, event collection, participant management, privacy controls, exports/APIs, integration, testing, and documentation are complete.

## Non-goals for this PR

This PR does not add a production authentication backend or a research database. Those are implementation steps in subsequent PRs.
