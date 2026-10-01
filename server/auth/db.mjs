import { query, pool, verifyDatabaseSchema } from '../db/postgres.mjs';

export { query, pool, verifyDatabaseSchema };

export async function closeExpiredSessions(now = new Date().toISOString()) {
  await query('DELETE FROM sessions WHERE expires_at <= $1', [now]);
  await query('DELETE FROM email_verification_tokens WHERE expires_at <= $1', [now]);
  await query('DELETE FROM password_reset_tokens WHERE expires_at <= $1', [now]);
}
