# Maths For All Cloudflare Worker

The Worker provides account authentication, lifetime game progression, achievement records, public leaderboards, personal-rank lookup, and a fail-closed research endpoint.

## Deploy
Use the repository's Cloudflare Worker workflow and committed Wrangler configuration. Do not commit API tokens or database credentials. Apply D1 migrations before deploying code that queries new tables.

## D1 migrations
Apply in order: 0001, 0002, 0003, 0004, 0005. Confirm each migration is recorded in d1_migrations.

Migration 0005 adds:
- cumulative player_progress;
- per-game player_game_progress;
- idempotent player_game_attempts;
- player_badges;
- ten separate research_<game> daily aggregate tables.

## Scoring
Points and XP accumulate across completed attempts. There is no per-game or global points cap and no maximum player level. The game base award, difficulty factor, logarithmic level progression, hint penalty and mistake penalty are defined in src/leaderboard/scoring.js. XP thresholds and achievement milestones are defined in src/leaderboard/progression.js.

Legacy best-score tables remain for compatibility and are not the source of lifetime standings. The client still supplies completion metrics; server-verifiable challenge proofs are required before the competition can be described as cheat-proof.

## Research safety
Research ingestion is OFF by default. The Worker rejects requests unless RESEARCH_COLLECTION_ENABLED is exactly "true". Production must remain OFF until a verifiable adult/parent/lawful-guardian permission mechanism is implemented and reviewed for the child-focused audience.

When later enabled, the Worker accepts an allowlist and writes only daily aggregates to the corresponding per-game table. It does not store account IDs, usernames, emails, parent names, school names, IP addresses, session tokens, device IDs, question text or raw answers in research tables. Retention target is 90 days.

A client-provided consent:true is not proof of valid consent. Do not enable the server flag based only on the browser UI.
