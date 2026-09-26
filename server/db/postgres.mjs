import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required for PostgreSQL authentication.');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DATABASE_POOL_MAX || 5),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

export async function query(text, params = []) {
  return pool.query(text, params);
}

export async function verifyDatabaseSchema() {
  const required = [
    'users',
    'sessions',
    'email_verification_tokens',
    'password_reset_tokens'
  ];

  const result = await query(
    `SELECT table_name
       FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = ANY($1::text[])`,
    [required]
  );

  const found = new Set(result.rows.map(row => row.table_name));
  const missing = required.filter(name => !found.has(name));

  if (missing.length) {
    throw new Error('Required PostgreSQL tables are missing: ' + missing.join(', '));
  }

  return true;
}

export async function closeDatabase() {
  await pool.end();
}
