# Accounts and leaderboards

Base URL: `https://maths-for-all-api.ompranabmohanty.workers.dev/api`

## Account model
- Email + username + password registration. Email is collected for account identity and future account recovery, but no email is sent and no email verification is required.
- Usernames are public; email addresses are private.
- Passwords are PBKDF2-HMAC-SHA-256 hashes (310,000 iterations); plaintext passwords are never stored.
- Sessions are 30-day, HttpOnly, Secure, SameSite=Lax cookies. Browser requests must use `credentials: "include"`.
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

## Scoring
Only the nine active games are accepted. The API accepts `scorePercent` from 0 to 100 and calculates `points = round(scorePercent * 10)` on the server. Each player's best score per game is kept, up to 1,000 points per game and 9,000 globally. Replayed attempt IDs are idempotent. Leaderboards expose username and scores only.

The game client must submit only after a genuine completed game, using a unique `attemptId`, actual completion percentage, and elapsed seconds. Do not award points for opening a game, viewing a page, or merely signing in. The API does not trust a client-supplied user ID, rank, or points value.

## No mail dependency
No SMTP, email provider, Google OAuth, verification, or reset-email integration is part of this release. Password recovery is not available until an email delivery or another verified recovery mechanism is deliberately added.


## Browser session transport
GitHub Pages and the Worker are on different origins. The browser client therefore uses a short-lived-in-tab bearer token returned after registration or login and sends it in the `Authorization: Bearer` header. The Worker stores only a SHA-256 digest of the random session token in D1. The token is held in `sessionStorage`, not persistent local storage, and is cleared on logout, account deletion, or invalid session response. Credentialed third-party cookies are not required. CORS preflight explicitly permits the Authorization header for the exact GitHub Pages origin.

## Tables
The production D1 database uses these application tables:
- `users`: unique case-insensitive username and email, password hash and account timestamps.
- `sessions`: hashed bearer/cookie tokens, expiry and last-use timestamps; cascades on user deletion.
- `game_attempts`: idempotent attempt history with game/score/duration constraints.
- `best_game_scores`: one best normalized score per user and active game.
- `auth_rate_limits`: hashed-IP rate-limit counters.
- `email_verification_tokens` and `password_reset_tokens` remain schema placeholders for a future explicitly approved email feature; this release does not send email or require verification.
