import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { config } from './config.mjs';

fs.mkdirSync(path.dirname(path.resolve(config.dbPath)), { recursive: true });

export const db = new DatabaseSync(config.dbPath, {
  timeout: 5000,
  enableForeignKeyConstraints: true
});

db.exec(fs.readFileSync(path.resolve('db/migrations/001_auth.sql'), 'utf8'));
db.exec(fs.readFileSync(path.resolve('db/migrations/002_verification_recovery.sql'), 'utf8'));

const userColumns = db.prepare('PRAGMA table_info(users)').all().map(row => row.name);
if (!userColumns.includes('google_subject')) {
  db.exec(fs.readFileSync(path.resolve('db/migrations/003_google_auth.sql'), 'utf8'));
}
db.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_subject
  ON users(google_subject)
  WHERE google_subject IS NOT NULL
`);

export function closeExpiredSessions(now = new Date().toISOString()) {
  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now);
  db.prepare('DELETE FROM email_verification_tokens WHERE expires_at <= ?').run(now);
  db.prepare('DELETE FROM password_reset_tokens WHERE expires_at <= ?').run(now);
}
