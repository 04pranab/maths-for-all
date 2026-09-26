# Supabase Preparation

This directory is reserved for versioned PostgreSQL migrations and Supabase project configuration.

The environment/visual foundation PR intentionally does not perform the SQLite-to-PostgreSQL migration.

## Planned layout

    supabase/
    ├── README.md
    └── migrations/
        └── 001_initial_auth_schema.sql

## Rules

- Never commit a real database URL or password.
- Never commit Supabase service-role credentials.
- Keep migrations deterministic and reviewable.
- Inspect the existing SQLite schema before writing the PostgreSQL migration.
- Run migrations against a test project before production.
- Keep research schema work in the v3 milestone.
