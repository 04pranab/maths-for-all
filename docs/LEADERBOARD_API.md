# Accounts and leaderboards

Base URL: `https://maths-for-all-api.ompranabmohanty.workers.dev/api`

## Account model
- Email + username + password registration. Email is collected for account identity and future account recovery, but no email is sent and no email verification is required.
- Usernames are public; email addresses are private.
- Passwords are PBKDF2-HMAC-SHA-256 hashes (310,000 iterations); plaintext passwords are never stored.
- Sessions expire after 30 days. The browser holds the random bearer token in tab-scoped `sessionStorage`; the database stores only its SHA-256 digest. Cross-site cookies are not required.
- Sign-out revokes the current session. Account deletion cascades to sessions and scores.
- Guest play and device-local progress remain available without an account.

## Routes
| Method | Route | Description |
|---|---|---|
| POST | `/auth/register` | `{username,email,password}`, creates account and session |
| POST | `/auth/login` | `{identifier,password}`, username or email |
| POST | `/auth/logout` | Revoke session |
| GET | `/auth/me` | Current public profile |
| POST | `/games/:gameId/attempts` | Save a completed attempt |
| GET | `/leaderboards/global` | Global total of best game scores |
| GET | `/leaderboards/games/:gameId` | Per-game ranking |
| GET | `/players/me/stats` | Current player's bests |
| DELETE | `/players/me` | Permanently delete account and associated scores |

## Scoring and achievements
Points are calculated on the server from a bounded completion percentage plus a game-specific maximum, selected difficulty band, level progression, hint use, and mistakes. Current maximum budgets are:
| Game | Maximum points |
|---|---:|
| Arithmetic Quiz | 140 |
| Math Racing | 180 |
| Sudoku | 350 |
| Shape Fitting | 220 |
| Slab Maths | 120 |
| Shape Architect | 280 |
| Fraction Bakery | 230 |
| Little Shop | 120 |
| Number Maze | 250 |
| Traffic Control Centre | 260 |

Difficulty factors are Starter/Easy 0.45, Growing/Medium 0.70, and Champion/Hard 1.00. Level progression adds at most 20%; hints and mistakes reduce the award. The best score per game is kept. Global ranking sums the best game scores, with a current theoretical maximum of 2,150 points. Historic scores are conservatively rebased to the starter tier because old difficulty metadata was not recorded.

The browser still reports a completion result, so this is not a cheat-proof competitive anti-cheat system: a modified client can forge a result. The API bounds inputs and calculates awards server-side, but truly tamper-resistant scoring requires server-verifiable game seeds/solutions or signed challenge proofs. Do not describe these rankings as secure esports results.

Badges are derived from game-specific attempts and best-score thresholds: First Steps (first recorded attempt), Bronze Explorer (25%), Silver Solver (50%), Gold Strategist (75%), and Game Master (90%). They are returned in the authenticated profile response; no additional personal profile fields are public.

## Research data
Research is a separate, explicit opt-in. The consent-aware browser gateway sends only allowlisted game events. The Worker stores daily aggregate counts grouped by game, event, difficulty, outcome, and broad level band. Research aggregates have no account/user/session/IP/device/participant identifier and are not joined to leaderboard records. The endpoint requires `consent: true`; it rejects unsupported fields/events. Aggregates are retained for up to 90 days and old daily buckets are removed during later accepted research writes. Once an event has been combined into a shared aggregate, an individual contribution cannot be separated or withdrawn; the consent notice states this before opt-in. Account creation never implies research consent.

## No mail dependency
No SMTP, email provider, Google OAuth, verification, or reset-email integration is part of this release. Password recovery is not available until an email delivery or another verified recovery mechanism is deliberately added.


## Browser session transport
GitHub Pages and the Worker are on different origins. The browser client therefore uses a short-lived-in-tab bearer token returned after registration or login and sends it in the `Authorization: Bearer` header. The Worker stores only a SHA-256 digest of the random session token in D1. The token is held in `sessionStorage`, not persistent local storage, and is cleared on logout, account deletion, or invalid session response. Credentialed third-party cookies are not required. CORS preflight explicitly permits the Authorization header for the exact GitHub Pages origin.

## Tables
The production D1 database uses these application tables:
- `users`: unique case-insensitive username and email, password hash and account timestamps.
- `sessions`: hashed bearer/cookie tokens, expiry and last-use timestamps; cascades on user deletion.
- `game_attempts`: idempotent attempt history with game/score/duration constraints.
- `best_game_scores`: one best normalized score per user for the nine original games.
- `traffic_control_attempts` and `traffic_control_best_scores`: Traffic Control Centre attempts and its best score, kept separate to preserve the original score-table constraints.
- `auth_rate_limits`: hashed-IP rate-limit counters.
- `email_verification_tokens` and `password_reset_tokens` remain schema placeholders for a future explicitly approved email feature; this release does not send email or require verification.
