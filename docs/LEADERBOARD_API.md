# Account and leaderboard API contract

This document records the intended API shape. Routes are not live until the
database and authentication implementation are completed.

Base path: `/api`

## Authentication

| Method | Route | Purpose |
|---|---|---|
| POST | `/auth/register` | Create account and begin email verification |
| POST | `/auth/login` | Create authenticated session |
| POST | `/auth/logout` | Revoke current session |
| GET | `/auth/me` | Return current public account profile |
| POST | `/auth/verify-email` | Verify email token |
| POST | `/auth/resend-verification` | Request another verification email |
| POST | `/auth/password-reset/request` | Request password reset |
| POST | `/auth/password-reset/confirm` | Set a new password |

The public profile contains only the account ID, public username, and
verification status. Email remains private.

## Scores and rankings

| Method | Route | Purpose |
|---|---|---|
| POST | `/games/:gameId/attempts` | Submit a completed game attempt |
| GET | `/leaderboards/global` | Global ranking by total best-game points |
| GET | `/leaderboards/games/:gameId` | Ranking for one active game |
| GET | `/players/me/stats` | Current player's best scores and totals |
| DELETE | `/players/me` | Delete account and associated account data |

## Attempt request

```json
{
  "attemptId": "client-generated-unique-id",
  "scorePercent": 92.5,
  "durationSeconds": 240
}
```

The route's `gameId` is taken from the URL. The authenticated user is derived
from the server-side session. The client must not send `userId`, username,
rank, normalized points, or global points.

The server validates the active game, score range, duration, attempt ID,
duplicate submission, and per-account request rate. It calculates normalized
points itself.

## Ranking rules

- Per-game ranking: highest normalized best score first.
- Global ranking: sum of one best normalized score per active game.
- Current maximum global score: 9000 points (nine games × 1000).
- Tie-break: shorter completion duration where meaningful, then earliest
  timestamp at which the best score was achieved.
- A new attempt never adds points on top of a player's existing best score.
- Repeated submissions of the same attempt ID are idempotent.

## Error conventions

- `400`: invalid request or score.
- `401`: missing/expired session.
- `403`: forbidden origin or action.
- `404`: unknown route or inactive game.
- `409`: duplicate/conflicting operation where idempotent replay is not possible.
- `429`: rate limit exceeded.
- `503`: service not configured or temporarily unavailable.

## Privacy

Leaderboard entries expose public username, rank, and score only. They must
never expose email, session tokens, verification tokens, or research-consent
records.
