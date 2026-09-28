import { randomUUID } from 'node:crypto';
import { query, closeExpiredSessions } from './db.mjs';
import { config } from './config.mjs';
import { verifyCallback } from './google.mjs';
import { sendPasswordResetEmail, sendVerificationEmail } from './email.mjs';
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

async function issueToken(table, userId, ttlSeconds) {
  const token = randomToken(32);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000).toISOString();
  await query('DELETE FROM ' + table + ' WHERE user_id = $1', [userId]);
  await query(
    'INSERT INTO ' + table + ' (token_hash, user_id, expires_at, created_at) VALUES ($1, $2, $3, $4)',
    [hashToken(token), userId, expiresAt, now.toISOString()]
  );
  return { token, expiresAt };
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
  if (existing.rows.length) throw new Error('An account with that username or email already exists.');

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

    const token = await issueToken('email_verification_tokens', id, 24 * 60 * 60);
    try {
      await sendVerificationEmail({ email, username, token: token.token });
    } catch {
      await query('DELETE FROM users WHERE id = $1', [id]);
      throw new Error('The account could not be created because verification email delivery is unavailable.');
    }

    return {
      user: publicUser(result.rows[0]),
      verificationRequired: true
    };
  } catch (error) {
    if (error?.code === '23505') throw new Error('An account with that username or email already exists.');
    throw error;
  }
}

export async function resendVerification(identifier) {
  const value = String(identifier || '').trim().toLowerCase();
  const result = await query(
    'SELECT id, username, email FROM users WHERE username = $1 OR email = $1 LIMIT 1',
    [value]
  );
  const user = result.rows[0];

  if (user) {
    const status = await query('SELECT email_verified_at FROM users WHERE id = $1', [user.id]);
    if (!status.rows[0].email_verified_at) {
      const token = await issueToken('email_verification_tokens', user.id, 24 * 60 * 60);
      try {
        await sendVerificationEmail({ email: user.email, username: user.username, token: token.token });
      } catch {}
    }
  }

  return { message: 'If the account requires verification, a verification email will be sent.' };
}

export async function verifyEmail(rawToken) {
  const tokenHash = hashToken(String(rawToken || ''));
  const now = new Date().toISOString();
  const result = await query(
    `SELECT id, user_id
       FROM email_verification_tokens
      WHERE token_hash = $1
        AND expires_at > $2
        AND used_at IS NULL
      LIMIT 1`,
    [tokenHash, now]
  );
  const row = result.rows[0];
  if (!row) throw new Error('This verification link is invalid or expired.');

  await query('UPDATE users SET email_verified_at = $1, updated_at = $1 WHERE id = $2', [now, row.user_id]);
  await query('UPDATE email_verification_tokens SET used_at = $1 WHERE id = $2', [now, row.id]);
  await query('DELETE FROM email_verification_tokens WHERE id = $1', [row.id]);
  return { ok: true };
}

async function createSession(userId) {
  await closeExpiredSessions();
  const rawToken = randomToken(32);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + config.sessionTtlSeconds * 1000).toISOString();
  await query(
    `INSERT INTO sessions
      (token_hash, user_id, expires_at, created_at, last_used_at)
     VALUES ($1, $2, $3, $4, $4)`,
    [hashToken(rawToken), userId, expiresAt, now.toISOString()]
  );
  return { token: rawToken, expiresAt };
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

  if (!user || !user.password_hash || !(await verifyPassword(password, user.password_hash))) {
    throw new Error('The username or password is incorrect.');
  }
  if (!user.email_verified_at) throw new Error('Verify your email address before logging in.');

  const session = await createSession(user.id);
  return { token: session.token, user: publicUser(user), expiresAt: session.expiresAt };
}

export async function loginWithGoogle(code) {
  const identity = await verifyCallback(code);
  let result = await query('SELECT * FROM users WHERE google_subject = $1 LIMIT 1', [identity.subject]);
  let user = result.rows[0];

  if (!user) {
    result = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [identity.email]);
    user = result.rows[0];

    if (user) {
      if (!user.email_verified_at) throw new Error('Verify the account email before connecting Google sign-in.');
      try {
        await query('UPDATE users SET google_subject = $1, updated_at = NOW() WHERE id = $2', [identity.subject, user.id]);
      } catch (error) {
        if (error?.code === '23505') throw new Error('That Google account is already linked.');
        throw error;
      }
      result = await query('SELECT * FROM users WHERE id = $1', [user.id]);
      user = result.rows[0];
    } else {
      const createdAt = new Date().toISOString();
      const id = randomUUID();
      const local = identity.email.split('@')[0].replace(/[^a-z0-9_]/g, '_').replace(/^_+|_+$/g, '').slice(0, 20);
      const base = local.length >= 3 ? local : 'learner';
      let username = base;
      for (let suffix = 1; ; suffix += 1) {
        const taken = await query('SELECT id FROM users WHERE username = $1', [username]);
        if (!taken.rows.length) break;
        username = base.slice(0, Math.max(3, 24 - String(suffix).length - 1)) + '_' + suffix;
      }
      const passwordHash = await hashPassword(randomToken(48));
      try {
        await query(
          `INSERT INTO users
            (id, username, email, password_hash, email_verified_at, google_subject, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $5, $5)`,
          [id, username, identity.email, passwordHash, createdAt, identity.subject]
        );
      } catch (error) {
        if (error?.code === '23505') throw new Error('The Google account or email is already linked.');
        throw error;
      }
      result = await query('SELECT * FROM users WHERE id = $1', [id]);
      user = result.rows[0];
    }
  }

  const session = await createSession(user.id);
  return { token: session.token, user: publicUser(user), expiresAt: session.expiresAt };
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
  await query('UPDATE sessions SET last_used_at = $1 WHERE token_hash = $2', [new Date().toISOString(), tokenHash]);
  return publicUser(row);
}

export async function logout(rawToken) {
  if (!rawToken) return;
  await query('DELETE FROM sessions WHERE token_hash = $1', [hashToken(rawToken)]);
}

export async function requestPasswordReset(email) {
  const value = normalizeEmail(email);
  const result = await query('SELECT id, username, email FROM users WHERE email = $1 LIMIT 1', [value]);
  const user = result.rows[0];

  if (user) {
    const token = await issueToken('password_reset_tokens', user.id, 60 * 60);
    try {
      await sendPasswordResetEmail({ email: user.email, username: user.username, token: token.token });
    } catch {}
  }

  return { message: 'If that email address is in our database, we will send a password reset email.' };
}

export async function resetPassword(rawToken, password) {
  if (!validPassword(password)) throw new Error('Password must be 8–128 characters.');
  const tokenHash = hashToken(String(rawToken || ''));
  const result = await query(
    `SELECT id, user_id
       FROM password_reset_tokens
      WHERE token_hash = $1
        AND expires_at > $2
        AND used_at IS NULL
      LIMIT 1`,
    [tokenHash, new Date().toISOString()]
  );
  const row = result.rows[0];
  if (!row) throw new Error('This password reset link is invalid or expired.');

  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();
  await query('UPDATE users SET password_hash = $1, updated_at = $2 WHERE id = $3', [passwordHash, now, row.user_id]);
  await query('UPDATE password_reset_tokens SET used_at = $1 WHERE id = $2', [now, row.id]);
  await query('DELETE FROM password_reset_tokens WHERE id = $1', [row.id]);
  await query('DELETE FROM sessions WHERE user_id = $1', [row.user_id]);
  return { ok: true };
}
