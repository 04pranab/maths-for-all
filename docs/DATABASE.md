# Maths for All Database Preparation

## Current boundary

The current main branch does not perform the SQLite-to-PostgreSQL migration.

The planned architecture is:

Browser -> Application server -> PostgreSQL

The browser must never receive the PostgreSQL connection string or server-side database credentials.

## Supabase

The project is prepared to use Supabase PostgreSQL for the managed database layer.

The free plan is intended for the project's early development stage. Current Supabase documentation lists 500 MB database size per free project, 5 GB egress, and 50,000 monthly active users. Free projects can also be paused after inactivity. Check the provider's current limits before deployment.

## Local configuration

Copy the template:

    cp .env.local.example .env.local

Then put the real database connection string in:

    DATABASE_URL=

Never commit .env.local.

## Connection choice

For a persistent backend, choose the Supabase direct connection when the deployment supports IPv6. If the backend is IPv4-only, use the shared session pooler. Do not guess the pooler host or construct it manually. Copy the connection string from the Supabase Connect dialog.

Use SSL for database connections. For stronger certificate and hostname verification, configure the Supabase CA certificate and the PostgreSQL verify-full mode in the server deployment.

## Migration order

1. Create the Supabase project.
2. Create the local environment file.
3. Verify the connection from the server only.
4. Inspect the current SQLite schema and authentication service.
5. Write a versioned PostgreSQL migration that matches the real application schema.
6. Migrate authentication data carefully.
7. Run API and browser regression tests.
8. Run concurrency and failure-path tests.
9. Only then switch the production database backend.
10. Keep research tables and research collection outside this migration until the v3 research milestone.

## Security rules

- Never put DATABASE_URL in browser JavaScript.
- Never commit a database password.
- Never commit a Supabase service-role credential.
- Keep database access server-side.
- Use least-privilege database roles where practical.
- Keep authentication data and research data logically separated.
- Research writes remain blocked unless explicit research consent is active.

## Important

Do not paste a real DATABASE_URL into GitHub issues, pull requests, README files, screenshots, browser console logs, or source files.
