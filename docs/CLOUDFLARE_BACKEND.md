# Cloudflare backend foundation

## Status

This commit adds a safe Cloudflare Workers project foundation. It does **not**
connect a database, create accounts, store scores, or enable leaderboards yet.
The Worker intentionally returns HTTP 503 for API routes until the database
choice and authentication storage design are confirmed.

The existing GitHub Pages site remains the frontend. No game UI or existing
local progress behaviour is changed by this foundation.

## Architecture

```text
GitHub Pages frontend
        |
        | HTTPS JSON API
        v
Cloudflare Worker
        |
        +-- authentication routes (next implementation stage)
        +-- score validation and normalization
        +-- global/per-game leaderboard queries
        |
        v
Database adapter (intentionally undecided)
```

## Current files

- `cloudflare/worker/src/index.js`: Worker entry point and fail-closed API boundary.
- `cloudflare/worker/src/http.js`: JSON response headers and exact-origin CORS.
- `cloudflare/worker/src/leaderboard/scoring.js`: shared score normalization and global-points rules.
- `cloudflare/worker/src/leaderboard/validation.js`: basic attempt payload validation.
- `cloudflare/worker/tests/worker-api.mjs`: tests for health, CORS, fail-closed routes, and scoring.
- `cloudflare/worker/wrangler.toml`: Worker configuration without a database binding.

## Leaderboard rules

Only the nine active games are eligible:

1. Arithmetic Quiz (`arithmetic-quiz`)
2. Math Racing (`math-racing`)
3. Sudoku (`sudoku`)
4. Shape Fitting (`shape-fitting`)
5. Slab Maths (`slab-maths`)
6. Shape Architect (`shape-architect`)
7. Fraction Bakery (`fraction-bakery`)
8. Little Shop (`little-shop`)
9. Number Maze (`number-maze`)

Probability Machine is hidden and Math Court is shelved, so neither contributes
to rankings.

Each game adapter must translate its own result into a percentage from 0 to 100.
The API maps that percentage to 0–1000 points. Global points are the sum of each
player's best score in each active game, giving a current maximum of 9000.
Raw game scores must not be compared across games.

This is a scoring contract, not an anti-cheat guarantee. Client-submitted scores
are manipulable. Before public competition, each game's completion rules must
be validated server-side as far as practical, with rate limits and idempotent
attempt storage.

## Deployment preparation

1. Confirm the database provider and whether any existing PostgreSQL accounts
   must be migrated.
2. Confirm the frontend/API domain arrangement. A custom domain with the
   frontend and API on sibling subdomains is preferred for secure HttpOnly
   cookies. GitHub Pages can continue serving the frontend through a custom
   domain.
3. Add the database binding and migration files only after the database choice.
4. Configure exact `ALLOWED_ORIGIN`, email delivery, session-cookie settings,
   and production secrets through Cloudflare, never in committed source.
5. Run the Worker tests and the existing game regression suite.
6. Enable account and leaderboard UI only after the API is deployed and tested.

## Security and privacy requirements

- Never expose database credentials or email-provider secrets to browser code.
- Derive the account identity from the server-side session, never from a client
  supplied user ID or username.
- Keep email addresses private; only public usernames appear on leaderboards.
- Account creation must not imply consent to research collection.
- Do not collect children's birth dates, school, precise location, or other
  unnecessary personal information.
- Preserve guest play and existing local progress.
- Implement account deletion and session revocation with the database layer.
- Do not enable cross-origin credentials with wildcard CORS.
- Do not deploy a placeholder API as if registration or score submission works.

## Next implementation stage

Once the database is confirmed, add its binding, migrations, adapter, session
storage, account endpoints, leaderboard persistence/query endpoints, and
integration tests. Then connect the frontend in a separate, incremental change.
