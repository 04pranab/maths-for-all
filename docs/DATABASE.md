# Maths For All database architecture

Updated: 11 November 2026

## Production data store
The active account and competition backend uses Cloudflare D1 behind the Cloudflare Worker. The browser never connects directly to D1.

Production database: maths-for-all (D1). Worker binding: DB.

## Migration sequence
- 0001_initial.sql: users, sessions, legacy attempts and best-score tables.
- 0002_auth_rate_limits.sql: hashed-key rate-limit counters.
- 0003_traffic_control_scores.sql: Traffic Control Centre compatibility score tables.
- 0004_profiles_badges_research.sql: first aggregate research schema and historic-score rebasing.
- 0005_player_progress_research.sql: lifetime progression, XP, levels, achievement records, per-game attempt history, and ten independent game research tables.

Migrations are versioned in d1_migrations. Apply each migration once, verify the ledger, and inspect the resulting schema before deploying Worker code that depends on it. Do not rerun non-idempotent data transformations manually.

## Player/account tables
| Table | Purpose |
|---|---|
| users | Username, email account identifier, password hash and account timestamps |
| sessions | Hashed session tokens and expiry |
| auth_rate_limits | Hashed rate-limit keys and counters |
| player_progress | Cumulative lifetime points, XP, level and total attempts |
| player_game_progress | Cumulative points/XP, streaks, challenge achievements and highest level per game |
| player_game_attempts | Unique attempt history with unbounded points and bounded metadata |
| player_badges | Durable per-game and player-wide achievement awards |

Legacy game_attempts, best_game_scores, traffic_control_attempts, and traffic_control_best_scores remain for compatibility. New global and game-specific leaderboards read cumulative lifetime totals from progression tables, not legacy best-score caps.

## Research tables
Migration 0005 creates one daily aggregate table per active game: research_arithmetic_quiz, research_math_racing, research_sudoku, research_shape_fitting, research_slab_maths, research_shape_architect, research_fraction_bakery, research_little_shop, research_number_maze, and research_traffic_control.

Only day, action, difficulty, outcome, broad level band, coarse duration band and event count are allowed. There is no user, account, participant, parent, school, email, IP, session, or device key. Existing rows in the earlier research_aggregates table are copied into the corresponding per-game tables; the old table remains for compatibility.

Production research collection is disabled. The Worker requires RESEARCH_COLLECTION_ENABLED=true and defaults to rejecting ingestion. Keep the production flag OFF until verifiable adult/parent/lawful-guardian consent is implemented and reviewed. Schema existence does not mean collection is active.

## Child-data safeguards
Maths For All is child-focused. The project adopts DPDP Act/Rules child and guardian safeguards ahead of their phased commencement. A checkbox or typed parent name is not verifiable parental consent. School and parent names are not currently collected because they are not necessary for gameplay. Any future collection requires a specific purpose, private-by-default handling, retention/deletion controls, and applicable verified guardian permission.

## Security rules
- Never expose database credentials or Worker secrets to browser JavaScript.
- Use HTTPS and exact-origin CORS.
- Store password hashes, never plaintext passwords.
- Store only hashes of bearer session tokens.
- Restrict database access to the Worker and authorized maintainers.
- Keep research tables isolated from player records.
- Do not log research payloads.
- Verify foreign-key cascades and account deletion.
- Review backups, retention, and access before enabling research.

## Historical data
Migration 0005 backfills each player's legacy best scores into lifetime progress so existing leaderboard participation is preserved. Historical difficulty and hint metadata may not exist, so do not infer it. Existing points are treated as a conservative starting balance.
