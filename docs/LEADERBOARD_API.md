# Player progression, achievements and leaderboards

Base URL: https://maths-for-all-api.ompranabmohanty.workers.dev/api

## Player progression
Guest play remains available. Registered accounts save cumulative lifetime points and XP. There is no global score ceiling, per-game lifetime score ceiling, or final player level. Each distinct completed attempt earns a game-weighted award. Harder games and harder difficulty tiers are worth more. Higher challenge levels increase awards with a logarithmic progression factor; hints and mistakes reduce awards. A unique attemptId makes a completed attempt idempotent.

### Game base weights
| Game | Base award |
|---|---:|
| Arithmetic Quiz | 12 |
| Math Racing | 16 |
| Sudoku | 32 |
| Shape Fitting | 20 |
| Slab Maths | 10 |
| Shape Architect | 26 |
| Fraction Bakery | 22 |
| Little Shop | 12 |
| Number Maze | 24 |
| Traffic Control Centre | 28 |

Difficulty factors: easy/gentle 0.50, medium/steady 0.80, hard/stretch 1.25. Level progression multiplier: 1 + 0.12 × log2(level). Hints and mistakes apply bounded reductions. Points have no hard ceiling. The browser still reports completion metrics, so awards are not cheat-proof until games submit server-verifiable challenge proofs.

### XP levels
The XP required to advance from level L is 100 + 25 × L. XP carries forward; there is no maximum level. The profile shows current level and progress to the next level.

### Achievements
Achievements are recorded durably and shown in Player HQ and on the corresponding game tile:
- First Steps: first completed challenge
- Flawless Finish: 100% clear with no hints or mistakes
- Brave Thinker: hard/champion clear
- Five in a Row: five consecutive recorded clears
- Deep Diver: reach level 25
- Century Club: reach level 100
- Point Collector: 1,000 game points
- Ten Thousand Club: 10,000 game points
- Marathon Mind: 100 completed challenges

Global level milestones appear as player-wide badges. Achievement rules are server-derived from saved progress, not client-supplied badge lists.

## API routes
| Method | Route | Description |
|---|---|---|
| POST | /auth/register | Create account and session |
| POST | /auth/login | Sign in with username or email |
| POST | /auth/logout | Revoke session |
| GET | /auth/me | Current public account identity |
| POST | /games/:gameId/attempts | Record an idempotent completed attempt |
| GET | /leaderboards/global | Global cumulative lifetime-points standings |
| GET | /leaderboards/games/:gameId | Per-game cumulative lifetime standings |
| GET | /leaderboards/me?gameId=global | Authenticated player's rank and nearby competitors |
| GET | /players/me/stats | XP, level, lifetime totals, game progress and badges |
| DELETE | /players/me | Delete account and associated player data |
| POST | /research/events | Permanently disabled in this release; returns HTTP 503 without writing to D1 |

The personal-rank route returns rank, points, total ranked players, and a small window of nearby competitors. A player with no score has rank null.

## Database model
- users and sessions: account identity and hashed session credentials.
- player_progress: cumulative lifetime points, XP, level and total attempts.
- player_game_progress: cumulative points/XP, attempt counts, perfect/hard clears, streaks and highest level per game.
- player_game_attempts: idempotent per-attempt record; points have no artificial 1,000-point ceiling.
- player_badges: durable achievement awards.
- Legacy game_attempts and best-score tables remain for compatibility; they are not the source of lifetime leaderboards.

## Research and privacy
Research is separate from player progression. Account creation, sign-in, score saving, profile viewing, and leaderboard participation do not imply research consent.

Migration 0005 removes the legacy research aggregate table and does not create research event tables. The browser gateway refuses to record or queue events. The Worker research endpoint always returns 503, even if a client sends consent=true or an environment flag is accidentally enabled. No research event is stored in D1.

Any future research system requires a separate reviewed design, verifiable adult/parent/lawful-guardian permission where applicable, and a new explicit release. Until then, there is no research retention period because no research data is collected.

## Profile data
School name and parent/guardian name are not collected. They are unnecessary for gameplay and would add personal data in a child-focused service. Any future request requires a specific purpose, private-by-default handling, a retention/deletion plan, and applicable verified guardian permission. They must never be public or used as research dimensions.

## No mail dependency
No SMTP, email provider, verification email, or password-reset delivery is part of this release. Email is an account identifier only. Do not imply email-based account recovery is available.

## Session transport
The GitHub Pages client sends a random bearer token in the Authorization header and keeps it in tab-scoped sessionStorage. D1 stores only the token digest. CORS is restricted to the exact GitHub Pages origin.
