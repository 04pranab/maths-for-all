# Maths For All API Worker

This directory contains the Cloudflare Worker API foundation for the Maths for
All GitHub Pages frontend.

## Database

The Cloudflare D1 database `maths-for-all-prod` has been provisioned in APAC.
The initial schema is versioned in `migrations/0001_initial.sql` and includes:

- Private user identities, password-hash storage, and Google identity mapping.
- Hashed session, email-verification, and password-reset tokens.
- Idempotent game attempts and one best score per player per active game.
- Database constraints for the nine active game IDs and normalized score bounds.

The Worker binding is named `DB`. The schema does not make authentication or
leaderboards live by itself. The API remains fail-closed until the D1-backed
handlers, password hashing, email delivery, session cookies, and frontend
integration have been implemented and tested.

## Preserve the game

Guest play and local progress remain the default and must continue working
without an account. Account features are additive. Never require registration
to play, and never collect research consent as a condition of account creation.
Only public usernames and scores belong on leaderboards; email and tokens stay
private. The hidden Probability Machine and shelved Math Court are excluded.

## Local checks

From this directory run `npm test`. Use the repository's existing Node version
and package lock. The D1 migration can be applied with the project's Wrangler
version after reviewing the target environment.

## Deployment safety

Do not deploy a partially implemented account service as production-ready.
Configure the exact production frontend origin and required secrets only after
the complete API and browser integration tests pass. Keep production secrets
out of Git. Do not migrate any existing PostgreSQL/SQLite data until the
source schema and migration plan have been reviewed.
