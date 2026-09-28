# Maths for All Database

## Current architecture

The production authentication database is PostgreSQL.

```
Browser
   |
   v
Node application server
   |
   v
Supabase PostgreSQL
```

The browser never receives the PostgreSQL connection string or database credentials.

## Supabase configuration

The application uses the PostgreSQL connection string:

```text
DATABASE_URL=
```

Copy the connection string from the Supabase Dashboard's **Connect** panel.

For a persistent Node backend, use the Supabase **direct connection** when the deployment supports IPv6. If the deployment is IPv4-only, use the **shared session pooler**. Do not use the transaction pooler for this persistent backend.

Keep `sslmode=require` in the copied connection string. For stronger certificate verification in production, configure PostgreSQL `verify-full` with the Supabase CA certificate.

## Local configuration

Create the ignored file:

```bash
cp .env.local.example .env.local
```

Then set:

```env
DATABASE_URL=your_supabase_postgresql_connection_string
AUTH_ORIGIN=http://127.0.0.1:8080
AUTH_COOKIE_SECURE=false
```

The server loads `.env.local` automatically during local development.

Never commit `.env.local`.

## Credentials and API keys

This application does **not** need a Supabase API key to perform its server-side PostgreSQL queries. It uses the PostgreSQL connection string from `DATABASE_URL`.

Do not put a Supabase service-role key in browser JavaScript.

Google OAuth credentials and email-delivery credentials belong in the server environment only. They are separate from `DATABASE_URL`.

## Existing schema

The repository's PostgreSQL authentication schema is already represented by:

```
users
sessions
email_verification_tokens
password_reset_tokens
```

The application validates that these tables exist at startup. It does not silently create or modify them.

## Testing

With `DATABASE_URL` configured:

```bash
npm run test:postgres
```

The test verifies connectivity, the public schema, and the required authentication tables.

Without `DATABASE_URL`, the PostgreSQL test reports `SKIP` rather than pretending that a database connection was tested.

## Security

- Database credentials stay server-side.
- Browser code never connects directly to PostgreSQL.
- Session tokens are stored hashed in the database.
- Sessions expire server-side.
- Database queries use PostgreSQL parameters.
- Passwords are stored as scrypt-derived hashes.
- Do not paste credentials into GitHub issues, pull requests, logs, screenshots, or chat.

## Research boundary

Research tables are deliberately outside this authentication PR. Research collection must still pass through the explicit consent boundary and will be added in the v3 research milestone.
