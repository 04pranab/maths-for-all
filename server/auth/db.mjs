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

export function closeExpiredSessions(now = new Date().toISOString()) {
  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now);
}
