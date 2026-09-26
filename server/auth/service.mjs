import { randomUUID } from 'node:crypto';
import { db, closeExpiredSessions } from './db.mjs';
import { config } from './config.mjs';
import { sendPasswordResetEmail, sendVerificationEmail } from './email.mjs';
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

function requireCredentials(username, email, password) {
  if (!validUsername(username)) throw new Error('Username must be 3–30 lowercase letters, numbers, or _.');
  if (!validEmail(email)) throw new Error('Enter a valid email address.');
  if (!validPassword(password)) throw new Error('Password must be 8–128 characters.');
}

function issueToken(table, userId, ttlSeconds) {
  const token = randomToken(32);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000).toISOString();
  db.prepare('DELETE FROM ' + table + ' WHERE user_id = ?').run(userId);
  db.prepare('INSERT INTO ' + table + ' (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .run(hashToken(token), userId, expiresAt, now.toISOString());
  return { token, expiresAt };
}

export async function register({ username, email, password }) {
  username = normalizeUsername(username);
  email = normalizeEmail(email);
  requireCredentials(username, email, password);

  const existing = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
  if (existing) throw new Error('An account with that username or email already exists.');

  const createdAt = new Date().toISOString();
  const id = randomUUID();
  const passwordHash = await hashPassword(password);

  db.prepare('INSERT INTO users (id, username, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(id, username, email, passwordHash, createdAt);

  const token = issueToken('email_verification_tokens', id, 24 * 60 * 60);
  try {
    await sendVerificationEmail({ email, username, token: token.token });
  } catch {
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    throw new Error('The account could not be created because verification email delivery is unavailable.');
  }

  return {
    user: publicUser({ id, username, email, email_verified_at: null, created_at: createdAt }),
    verificationRequired: true
  };
}

export async function resendVerification(identifier) {
  const value = String(identifier || '').trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(value, value);

  if (user && !user.email_verified_at) {
    const token = issueToken('email_verification_tokens', user.id, 24 * 60 * 60);
    try {
      await sendVerificationEmail({ email: user.email, username: user.username, token: token.token });
    } catch {}
  }

  return { message: 'If the account requires verification, a verification email will be sent.' };
}

export function verifyEmail(rawToken) {
  const now = new Date().toISOString();
  const row = db.prepare(
    'SELECT * FROM email_verification_tokens WHERE token_hash = ? AND expires_at > ?'
  ).get(hashToken(String(rawToken || '')), now);

  if (!row) throw new Error('This verification link is invalid or expired.');

  db.prepare('UPDATE users SET email_verified_at = ? WHERE id = ?').run(now, row.user_id);
  db.prepare('DELETE FROM email_verification_tokens WHERE token_hash = ?').run(row.token_hash);
  return { ok: true };
}

export async function login({ identifier, password }) {
  const value = String(identifier || '').trim().toLowerCase();
  if (!value || typeof password !== 'string' || !password.length) {
    throw new Error('Enter your username or email and password.');
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(value, value);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw new Error('The username or password is incorrect.');
  }
  if (!user.email_verified_at) throw new Error('Verify your email address before logging in.');

  closeExpiredSessions();
  const rawToken = randomToken(32);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + config.sessionTtlSeconds * 1000).toISOString();

  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .run(hashToken(rawToken), user.id, expiresAt, now.toISOString());

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

export async function requestPasswordReset(email) {
  const value = normalizeEmail(email);
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(value);

  if (user) {
    const token = issueToken('password_reset_tokens', user.id, 60 * 60);
    try {
      await sendPasswordResetEmail({ email: user.email, username: user.username, token: token.token });
    } catch {}
  }

  return { message: 'If that email address is in our database, we will send a password reset email.' };
}

export async function resetPassword(rawToken, password) {
  if (!validPassword(password)) throw new Error('Password must be 8–128 characters.');

  const row = db.prepare(
    'SELECT * FROM password_reset_tokens WHERE token_hash = ? AND expires_at > ?'
  ).get(hashToken(String(rawToken || '')), new Date().toISOString());

  if (!row) throw new Error('This password reset link is invalid or expired.');

  const passwordHash = await hashPassword(password);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, row.user_id);
  db.prepare('DELETE FROM password_reset_tokens WHERE token_hash = ?').run(row.token_hash);
  db.prepare('DELETE FROM sessions WHERE user_id = ?').run(row.user_id);
  return { ok: true };
}
