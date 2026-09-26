import { randomUUID } from 'node:crypto';
import { query, closeExpiredSessions } from './db.mjs';
import { config } from './config.mjs';
import {
  hashPassword,
  verifyPassword,
  randomToken,
  hashToken,
  normalizeUsername,
  normalizeEmail,
  validUsername,
  validEmail,
  validPassword
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

function duplicateError(error) {
  if (error?.code === '23505') {
    throw new Error('An account with that username or email already exists.');
  }
  throw error;
}

export async function register({ username, email, password }) {
  username = normalizeUsername(username);
  email = normalizeEmail(email);

  if (!validUsername(username)) throw new Error('Username must be 3–30 lowercase letters, numbers, or _.');
  if (!validEmail(email)) throw new Error('Enter a valid email address.');
  if (!validPassword(password)) throw new Error('Password must be 8–128 characters.');

  const existing = await query(
    'SELECT id FROM users WHERE username = $1 OR email = $2 LIMIT 1',
    [username, email]
  );

  if (existing.rows.length) {
    throw new Error('An account with that username or email already exists.');
  }

  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const passwordHash = await hashPassword(password);

  try {
    const result = await query(
      `INSERT INTO users
        (id, username, email, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $5)
       RETURNING id, username, email, email_verified_at, created_at`,
      [id, username, email, passwordHash, createdAt]
    );

    return publicUser(result.rows[0]);
  } catch (error) {
    return duplicateError(error);
  }
}

export async function login({ identifier, password }) {
  const value = String(identifier || '').trim().toLowerCase();

  if (!value || typeof password !== 'string' || !password.length) {
    throw new Error('Enter your username or email and password.');
  }

  const result = await query(
    'SELECT * FROM users WHERE username = $1 OR email = $1 LIMIT 1',
    [value]
  );

  const user = result.rows[0];

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw new Error('The username or password is incorrect.');
  }

  await closeExpiredSessions();

  const rawToken = randomToken(32);
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + config.sessionTtlSeconds * 1000
  ).toISOString();

  await query(
    `INSERT INTO sessions
      (token_hash, user_id, expires_at, created_at, last_used_at)
     VALUES ($1, $2, $3, $4, $4)`,
    [hashToken(rawToken), user.id, expiresAt, now.toISOString()]
  );

  return {
    token: rawToken,
    user: publicUser(user),
    expiresAt
  };
}

export async function getUserBySession(rawToken) {
  if (!rawToken) return null;

  await closeExpiredSessions();

  const tokenHash = hashToken(rawToken);
  const result = await query(
    `SELECT u.*
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1
        AND s.expires_at > $2
      LIMIT 1`,
    [tokenHash, new Date().toISOString()]
  );

  const row = result.rows[0];

  if (!row) return null;

  await query(
    'UPDATE sessions SET last_used_at = $1 WHERE token_hash = $2',
    [new Date().toISOString(), tokenHash]
  );

  return publicUser(row);
}

export async function logout(rawToken) {
  if (!rawToken) return;

  await query(
    'DELETE FROM sessions WHERE token_hash = $1',
    [hashToken(rawToken)]
  );
}
