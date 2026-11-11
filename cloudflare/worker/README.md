# Maths For All Cloudflare Worker

The Worker provides account authentication, lifetime game progression, achievement records, public leaderboards, personal-rank lookup, with research collection disabled.

## Deploy
Use the repository's Cloudflare Worker workflow and committed Wrangler configuration. Do not commit API tokens or database credentials. Apply D1 migrations before deploying code that queries new tables.

## D1 migrations
Apply in order: 0001, 0002, 0003, 0004, 0005. Confirm each migration is recorded in d1_migrations. Migration 0005 preserves player records, backfills lifetime progression from legacy scores, and drops the legacy research aggregate table.

Migration 0005 adds:
- cumulative player_progress;
- per-game player_game_progress;
- idempotent player_game_attempts;
- player_badges;
- no research tables; research storage is intentionally absent.

## Scoring
Points and XP accumulate across completed attempts. There is no per-game or global points cap and no maximum player level. The game base award, difficulty factor, logarithmic level progression, hint penalty and mistake penalty are defined in src/leaderboard/scoring.js. XP thresholds and achievement milestones are defined in src/leaderboard/progression.js.

Legacy best-score tables remain for compatibility and are not the source of lifetime standings. The client still supplies completion metrics; server-verifiable challenge proofs are required before the competition can be described as cheat-proof.

## Research safety
Research collection is not implemented in this release. The browser gateway does not record or queue events. The Worker endpoint always returns HTTP 503 without touching D1, even if a request claims consent or an environment flag is set. Migration 0005 removes the legacy research aggregate table. Do not add research storage or enable collection without a separately reviewed design and verifiable adult/parent/lawful-guardian permission where applicable.
