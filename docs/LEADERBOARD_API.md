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
