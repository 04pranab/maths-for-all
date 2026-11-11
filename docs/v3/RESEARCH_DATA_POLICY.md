# Maths For All: Privacy & Research Data Policy

**Version:** 2.0 · **Updated:** 11 November 2026  
**Applies to:** the official Maths For All website, account API, Cloudflare D1 database, games, and any research collection feature operated by this project.

 > **Current research status: OFF.** No research events are recorded locally, queued, uploaded or stored. The Worker endpoint always returns HTTP 503 and migration 0005 removes the legacy aggregate research table. Ordinary player-service data remains available for accounts, progress, points, XP, achievements and leaderboards.

This policy describes the current product, the safeguards already implemented, and the additional controls required before any research collection can be enabled. It is a project privacy notice, not a legal opinion or a certification of compliance.

## 1. The rules that govern the project

Maths For All follows these principles:

1. No research without a separate, informed, affirmative choice.
2. No means no. A missing choice, closed dialog, timeout, guest session, or account creation is not consent.
3. Research consent is separate from registration, sign-in, saving scores, badges, or appearing on a leaderboard.
4. Collect only the minimum information needed for a stated learning-research question.
5. Never use research aggregates to score, rank, diagnose, label, or make decisions about an individual learner.
6. Provide a simple way to review and withdraw a choice.
7. If a required consent safeguard is unavailable, keep research collection disabled.

### India: DPDP framework

The project is designed with the Indian Digital Personal Data Protection Act, 2023 (DPDP Act) and Digital Personal Data Protection Rules, 2025 in mind. The Act defines a child as a person who has not completed 18 years of age. The commencement notification phases the main processing obligations in sections 3–17, including section 9 on children's data, to 18 months after publication on 13 November 2025 (13 May 2027). The Rules similarly phase rules 3 and 5–16, including rule 10 (verifiable parental consent for children) and rule 11 (lawful guardians for persons with disabilities), to that date.

Maths For All adopts the child/guardian safeguards ahead of that date. Before enabling research about a child, the project must have a verifiable parent or lawful-guardian permission process, not merely a checkbox or an unverified claim. A child or learner must not be asked to provide a parent's name as a substitute for verification.

Official references:
- [Digital Personal Data Protection Act, 2023 (India Code PDF)](https://www.indiacode.nic.in/bitstream/123456789/22037/2/a2023-22.pdf)
- [Digital Personal Data Protection Rules, 2025 (MeitY Gazette)](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf)
- [Commencement notification G.S.R. 843(E), 13 November 2025](https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf)

The law that applies can depend on the learner, school, guardian, and deployment location. The project must obtain qualified legal review before claiming legal compliance or enabling collection in a new jurisdiction.

## 2. Account creation is not research consent

An account exists to save a player's username, points, XP, level, game achievements, and leaderboard progress.

- Creating an account does **not** opt a person into research.
- Signing in does **not** opt a person into research.
- Saving a score does **not** opt a person into research.
- A player can use guest mode and play without an account.
- The research gateway does not receive an account ID, session token, username, or email.
- No research database or research event tables exist in this release.

The current account system stores an email address for account identity, a username, a password hash, account timestamps, and hashed session-token records. The public leaderboard displays the username and earned competition points. It does not display email addresses or passwords.

**Child-account limitation:** the current account flow does not yet provide verifiable age or parent/lawful-guardian onboarding. Therefore this project does not claim that account processing is fully DPDP-compliant for under-18 learners. Before enabling child accounts for a deployment where the relevant child-data rules apply, the project must implement verifiable parent/lawful-guardian permission for the account purpose itself, or keep that learner in guest mode / a properly parent-managed account flow until the safeguard is available. Research consent cannot substitute for account consent.

## 3. Research collection status and consent

### Current production behaviour

Research collection is **disabled for everyone** while the child/guardian verification safeguard is not available.

- The browser gateway refuses to record or queue research events.
- Legacy local research queues are removed unless a future, valid consent implementation explicitly permits them.
- The Worker always returns HTTP 503 without touching D1, even if a client sends `consent: true` or an environment flag is accidentally enabled.
- Migration 0005 removes the legacy `research_aggregates` table and its historical aggregate rows. No replacement research tables are created.
- Normal gameplay, accounts, XP, badges, and leaderboards continue to work.

The sign-in flow explains this status. The privacy control remains available at all times.

### Requirements before research can be enabled

A future release must provide all of the following before it can collect research:

1. A standalone notice in plain language, available before the choice.
2. A specific description of each data category, purpose, retention period, and recipient.
3. A separate affirmative choice for each research purpose. No pre-ticked boxes.
4. Verifiable adult consent or verifiable parent/lawful-guardian consent where required. A typed parent name, checkbox, or account registration alone is not verification.
5. A durable record of the consent notice version, choice, scope, and time, stored separately from research aggregates.
6. A withdrawal route that is as easy to use as the opt-in route.
7. A server-side feature flag that remains OFF until the safeguards and review are complete.
8. A tested no-consent path proving that no event is queued, uploaded, or inserted.

A future Yes must never silently include a new purpose or a new data category. Material changes require a new notice and fresh consent.

### No means no

If a person declines, does not answer, closes the prompt, or has no recorded valid permission:

- no research event is recorded locally;
- no research event is uploaded;
- no event is inserted into D1;
- no research profile is created;
- no research data is joined to account, school, family, or leaderboard information.

The game must continue normally. Declining research must never reduce points, XP, levels, badges, game access, or leaderboard eligibility.

## 4. No research data model is active

There is no research event storage in this release. No research tables are created, and no research event fields are collected. Migration 0005 removes the legacy aggregate research table and its historical rows.

A future research proposal, if one is ever needed, must start with a new data-minimization review, a plain-language notice, a lawful basis and verifiable adult/parent/lawful-guardian permission where applicable. It must be separately approved and deployed. This policy does not pre-authorize any future research collection or define a live research schema.

## 5. Data that is not collected for research

The research system must never collect:

- names, usernames, email addresses, phone numbers, or account IDs;
- parent or guardian names, contact details, or identity documents;
- school name, class, roll number, student ID, or teacher identity;
- passwords, password hashes, session tokens, or authentication headers;
- home address, precise location, or GPS coordinates;
- IP address, device fingerprint, advertising ID, or persistent device identifier;
- camera, microphone, photos, files, contacts, or data from other applications;
- question text, answer text, written explanations, or private notes;
- disability diagnosis, medical information, or inferred ability labels;
- research events from a person who has declined or has no valid permission.

No research database receives authentication credentials because no research database is provisioned. Standard hosting and network-security systems may process technical connection metadata under their own security and service terms; that infrastructure processing is not a research event and must not be repurposed as learner research.

## 6. School and parent/guardian profile fields

Maths For All does **not** currently ask for or store a school name or parent/guardian name in a player profile.

These fields are not needed for game progress or competition. They are personal information, especially in a child-focused service. If a future educational programme establishes a specific need, it must first document the purpose, retention, access, and deletion process, obtain the required verified parent/lawful-guardian permission, and keep the fields private by default. They must never appear on public leaderboards or enter research tables.

## 7. Leaderboards, profiles, and public display

Player progression is a game feature, not research.

- Public display is limited to the chosen username, lifetime competition points, and rank.
- Game-specific standings may show points and completed challenge counts.
- Profiles may show XP level, game progress, and earned achievement titles.
- Email, password material, parent/guardian details, school details, and research consent are never public.
- A player may play as a guest without a public account.
- Research consent is not required to compete.

If public profile fields or visibility options change, the interface and notice must be updated before release.

## 8. Retention, withdrawal, and deletion

### Research

If research is enabled in a future release, aggregate buckets are scheduled for deletion after 90 days. A future consent system must retain only the minimum consent evidence needed to demonstrate the choice and must define a separate retention period for that evidence.

Before aggregation, queued local events must be deleted when consent is withdrawn. Once a contribution has been merged into a shared daily count, it cannot reliably be separated from that count; this limitation must be explained before a future opt-in. Withdrawal always stops future collection immediately.

### Accounts and game progress

Account information and leaderboard records are separate from research. Account deletion must remove the player's account, sessions, attempts, progression totals, and earned badges through database foreign-key cascades or explicit deletion. Guest progress remains on the learner's device and can be cleared using the site's local-data controls.

## 9. Security and access

The project uses HTTPS for the website and API. Passwords are stored as password hashes, not plaintext. Session tokens are random and only their hashes are stored in D1. No research tables or research writes exist in this release.

Before any research activation, the maintainer must additionally verify:
- least-privilege access to the research database;
- protected backups and a deletion schedule;
- access logging for administrative reads/exports;
- no research payloads in application logs;
- dependency and vulnerability review;
- a documented incident response and breach-notification process;
- a reviewed data-processing arrangement with hosting providers.

No security measure is absolute. A deployment must not claim that data is anonymous or legally compliant solely because identifiers are omitted from one table.

## 10. Learner rights and contact

A learner or parent/lawful guardian may request information, correction, deletion, or help with a privacy concern through the project maintainer's public contact route: [GitHub profile](https://github.com/04pranab). The maintainer should respond privately and must not ask people to post personal details in a public issue.

Requests should identify the account or issue only as needed. Do not send passwords, identity documents, student IDs, or sensitive information through public issue trackers.

## 11. Policy changes and accountability

Any change to research purposes, event fields, table structure, retention, recipients, or consent flow requires:
- an updated policy and consent notice;
- a code review of the browser gateway and Worker;
- a test proving No remains a hard stop;
- a migration review;
- legal review where appropriate;
- explicit approval before the production feature flag is enabled.

The policy is a project requirement, not a substitute for legal advice. No release may describe Maths For All as fully DPDP-compliant until the relevant legal obligations, age/guardian verification, operational controls, and user-rights processes have been independently reviewed and implemented.

## 12. Change history

- **11 November 2026:** Rewritten to distinguish account, leaderboard, and research processing; document child/guardian safeguards; document that no research data is collected or stored and distinguish it from ordinary player-service data.
