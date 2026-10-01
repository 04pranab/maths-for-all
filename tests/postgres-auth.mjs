import assert from 'node:assert/strict';
import { query, verifyDatabaseSchema, closeDatabase } from '../server/db/postgres.mjs';

if (!process.env.DATABASE_URL) {
  console.log(JSON.stringify({
    status: 'SKIP',
    reason: 'DATABASE_URL is not configured'
  }));
  process.exit(0);
}

try {
  await verifyDatabaseSchema();

  const result = await query(
    `SELECT
       current_database() AS database_name,
       current_schema() AS schema_name,
       COUNT(*)::int AS user_count
     FROM public.users`
  );

  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0].schema_name, 'public');
  assert.ok(Number.isInteger(result.rows[0].user_count));

  console.log(JSON.stringify({
    status: 'PASS',
    database: result.rows[0].database_name,
    schema: result.rows[0].schema_name,
    users: result.rows[0].user_count
  }));
} finally {
  await closeDatabase();
}
