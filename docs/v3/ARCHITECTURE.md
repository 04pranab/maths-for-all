# Maths For All: production architecture

Updated: 11 November 2026

## Product layers
- Presentation: accessible mathematics games, Player HQ, leaderboard, privacy notice, sign-in and guest play.
- Account API: Cloudflare Worker authentication and player-data endpoints.
- Player database: Cloudflare D1 account, attempt, progression and achievement tables.
- Research boundary: consent-aware browser gateway, Worker allowlist, and ten isolated daily aggregate tables. Research collection is currently disabled server-side.

## Player progression
Every distinct accepted game attempt awards game-weighted points and XP. The Worker computes awards from game base weight, difficulty, challenge level, hints, mistakes and score percentage. Lifetime points accumulate without a maximum. XP determines an unbounded level using a gradually increasing next-level threshold.

Legacy best-score tables remain for compatibility only. Global and per-game leaderboards use cumulative lifetime totals. The personal-rank endpoint returns the signed-in player's rank and nearby competitors. The client highlights the player's own row.

Badges are derived from recorded progress milestones and persisted in player_badges. Game-specific badges appear in Player HQ and on game tiles. Player-wide level milestones appear in the profile.

The browser still reports completion metrics. The Worker calculates awards and deduplicates attempts, but a modified browser can forge a completion. This is not cheat-proof competition. Server-verifiable puzzle seeds/solutions or signed challenge proofs are future work.

## Database migration sequence
1. 0001_initial.sql: accounts, sessions, legacy attempts and best scores.
2. 0002_auth_rate_limits.sql: authentication rate limiting.
3. 0003_traffic_control_scores.sql: Traffic Control Centre legacy score tables.
4. 0004_profiles_badges_research.sql: initial aggregate research table and historic-score rebasing.
5. 0005_player_progress_research.sql: cumulative XP/points, per-game progression, attempt history, badges, and ten separate research tables.

The legacy central research_aggregates table is retained for compatibility; migration 0005 copies existing buckets into corresponding per-game tables. New approved research writes route only to per-game tables.

## Research privacy boundary
Research is not part of account progression and is not joined to player records. It contains no user/account/participant identifier. No school or parent fields are collected.

Production research is OFF. The Worker rejects ingestion unless the server-side RESEARCH_COLLECTION_ENABLED flag is explicitly true. The browser gateway currently refuses to queue events and purges legacy research queues. This flag must not be enabled until verifiable adult/parent/lawful-guardian consent is available for the child-focused audience, the notice is reviewed, and no-consent tests pass.

The intended future data is limited to daily aggregate counts by game, action, difficulty, outcome, broad level band and coarse duration band. Retention target: 90 days. Individual contributions cannot be extracted after aggregation; this limitation must be disclosed before any future opt-in.

## Child and guardian safeguards
The project adopts safeguards from India's DPDP Act, 2023 and DPDP Rules, 2025 ahead of the phased commencement of the main child-data provisions on 13 May 2027. A typed parent name or checkbox is not a verifiable parental-consent mechanism. Research remains disabled until a proper verification process and legal review are complete. The project must not claim full DPDP compliance until applicable requirements and operational controls have been reviewed.

School name and parent/guardian name are not collected because they are not needed for play. Any future request requires a specific purpose, separate notice, private-by-default storage, retention/deletion rules, and applicable verified guardian permission.

## Operational safeguards
- HTTPS for Pages and Worker.
- Hashed password material and hashed session tokens.
- Exact-origin CORS.
- Idempotent attempt IDs.
- Foreign-key cascade for account deletion.
- Separate account/progression and research tables.
- Research ingestion feature flag defaults to OFF.
- Worker logs must not contain research payloads or personal account data.

## Release gates
Before production merge/deployment:
- Run Worker API, scoring/progression, consent-gateway, browser stress and Pages build checks.
- Apply migration 0005 once and verify its migration-ledger entry and table schemas.
- Confirm the research flag is OFF in production.
- Verify public leaderboard exposes only username, points, rank and game-level counts.
- Verify profile badges and tile badges render on mobile and desktop.
- Do not call the leaderboard cheat-proof until server-verifiable game proofs exist.
