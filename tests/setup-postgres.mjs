import fs from 'node:fs';
import pg from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required.');
}

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });

await client.connect();

try {
  const sql = fs.readFileSync(new URL('../db/migrations/001_auth.sql', import.meta.url), 'utf8');
  await client.query(sql);
  console.log('PostgreSQL test schema ready.');
} finally {
  await client.end();
}
