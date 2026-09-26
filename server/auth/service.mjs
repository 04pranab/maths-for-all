import { randomUUID } from 'node:crypto';
import { db, closeExpiredSessions } from './db.mjs';
import { config } from './config.mjs';
import {
  hashPassword, verifyPassword, randomToken, hashToken,
  normalizeUsername, normalizeEmail, validUsername, validEmail, validPassword
} from './crypto.mjs';

function publicUser(row) {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    emailVerified: Boolean(row.email_verified_at),
    createdAt: row.created_at
  };
}

export async function register({ username, email, password }) {
  username = normalizeUsername(username);
  email = normalizeEmail(email);

  if (!validUsername(username)) throw new Error('Username must be 3–30 lowercase letters, numbers, or _.');
  if (!validEmail(email)) throw new Error('Enter a valid email address.');
  if (!validPassword(password)) throw new Error('Password must be 8–128 characters.');

  const existing = db.prepare(
    'SELECT id FROM users WHERE username = ? OR email = ?'
  ).get(username, email);
  if (existing) throw new Error('An account with that username or email already exists.');

  const createdAt = new Date().toISOString();
  const id = randomUUID();
  const passwordHash = await hashPassword(password);

  db.prepare(
    'INSERT INTO users (id, username, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(id, username, email, passwordHash, createdAt);

  return publicUser({ id, username, email, email_verified_at: null, created_at: createdAt });
}

export async function login({ identifier, password }) {
  const value = String(identifier || '').trim().toLowerCase();
  if (!value || typeof password !== 'string' || !password.length) {
    throw new Error('Enter your username or email and password.');
  }

  const user = db.prepare(
    'SELECT * FROM users WHERE username = ? OR email = ?'
  ).get(value, value);

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw new Error('The username or password is incorrect.');
  }

  closeExpiredSessions();

  const rawToken = randomToken(32);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + config.sessionTtlSeconds * 1000).toISOString();

  db.prepare(
    'INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)'
  ).run(hashToken(rawToken), user.id, expiresAt, now.toISOString());

  return { token: rawToken, user: publicUser(user), expiresAt };
}

export function getUserBySession(rawToken) {
  if (!rawToken) return null;
  closeExpiredSessions();
  const row = db.prepare(
    'SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?'
  ).get(hashToken(rawToken), new Date().toISOString());
  return row ? publicUser(row) : null;
}

export function logout(rawToken) {
  if (rawToken) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(rawToken));
}
