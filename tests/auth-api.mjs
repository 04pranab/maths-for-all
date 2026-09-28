import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import pg from 'pg';
import { setTimeout as sleep } from 'node:timers/promises';

const root = path.resolve(import.meta.dirname, '..');
const port = 4876;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mfa-auth-pg-'));
const outboxPath = path.join(tempDir, 'outbox.ndjson');
const suffix = Math.random().toString(36).slice(2, 9);
const username = 'stress_' + suffix;
const email = 'stress_' + suffix + '@example.com';
const password = 'StressPass123';
const newPassword = 'NewStressPass456';

if (!process.env.DATABASE_URL) {
  console.log(JSON.stringify({ status: 'SKIP', reason: 'DATABASE_URL is not configured.' }));
  process.exit(0);
}

const env = {
  ...process.env,
  AUTH_PORT: String(port),
  AUTH_ORIGIN: 'http://127.0.0.1:' + port,
  AUTH_COOKIE_SECURE: 'false',
  AUTH_TEST_OUTBOX_PATH: outboxPath
};

const server = spawn(process.execPath, ['server/index.mjs'], {
  cwd: root,
  env,
  stdio: ['ignore', 'pipe', 'pipe']
});

async function waitForHealth() {
  for (let i = 0; i < 100; i += 1) {
    try {
      const response = await fetch('http://127.0.0.1:' + port + '/api/health');
      if (response.ok) return;
    } catch {}
    await sleep(50);
  }
  throw new Error('Auth server did not start.');
}

async function call(pathname, options = {}) {
  return fetch('http://127.0.0.1:' + port + pathname, {
    ...options,
    headers: { 'content-type': 'application/json', ...(options.headers || {}) }
  });
}

function latestMail(type) {
  const rows = fs.readFileSync(outboxPath, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
  return [...rows].reverse().find(row => row.type === type);
}

function tokenFromMail(mail, queryName) {
  return new URL(mail.text.slice(mail.text.indexOf('http'))).searchParams.get(queryName);
}

let pool;
try {
  await waitForHealth();

  const googleStart = await fetch('http://127.0.0.1:' + port + '/api/auth/google/start');
  assert.equal(googleStart.status, 503);

  const register = await call('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  });
  assert.equal(register.status, 201);
  assert.equal((await register.json()).verificationRequired, true);

  const before = await call('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier: username, password })
  });
  assert.equal(before.status, 401);

  const verificationToken = tokenFromMail(latestMail('email-verification'), 'verify');
  assert.ok(verificationToken);

  const verify = await call('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token: verificationToken })
  });
  assert.equal(verify.status, 200);

  const reusedVerify = await call('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token: verificationToken })
  });
  assert.equal(reusedVerify.status, 400);

  const login = await call('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier: username, password })
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.getSetCookie()[0].split(';')[0];

  const me = await call('/api/auth/me', { headers: { cookie } });
  assert.equal(me.status, 200);
  assert.equal((await me.json()).user.username, username);

  const resetExisting = await call('/api/auth/password-reset/request', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
  const resetMissing = await call('/api/auth/password-reset/request', {
    method: 'POST',
    body: JSON.stringify({ email: 'missing_' + suffix + '@example.com' })
  });
  assert.equal(resetExisting.status, 202);
  assert.equal(resetMissing.status, 202);
  assert.equal((await resetExisting.json()).message, (await resetMissing.json()).message);

  const resetToken = tokenFromMail(latestMail('password-reset'), 'reset');
  assert.ok(resetToken);

  const reset = await call('/api/auth/password-reset/confirm', {
    method: 'POST',
    body: JSON.stringify({ token: resetToken, password: newPassword })
  });
  assert.equal(reset.status, 200);

  const oldSession = await call('/api/auth/me', { headers: { cookie } });
  assert.equal((await oldSession.json()).authenticated, false);

  const oldPassword = await call('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier: username, password })
  });
  assert.equal(oldPassword.status, 401);

  const newLogin = await call('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier: email, password: newPassword })
  });
  assert.equal(newLogin.status, 200);

  const reusedReset = await call('/api/auth/password-reset/confirm', {
    method: 'POST',
    body: JSON.stringify({ token: resetToken, password: 'AnotherPass789' })
  });
  assert.equal(reusedReset.status, 400);

  const badOrigin = await call('/api/auth/password-reset/request', {
    method: 'POST',
    headers: { origin: 'https://evil.example' },
    body: JSON.stringify({ email })
  });
  assert.equal(badOrigin.status, 403);

  const health = await fetch('http://127.0.0.1:' + port + '/api/health');
  assert.equal(health.headers.get('x-frame-options'), 'DENY');
  assert.equal(health.headers.get('cross-origin-opener-policy'), 'same-origin');
  assert.equal(health.headers.get('cross-origin-resource-policy'), 'same-origin');

  for (let i = 0; i < 5; i += 1) {
    const response = await call('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({})
    });
    assert.equal(response.status, 202);
  }

  const limited = await call('/api/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({})
  });
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('retry-after')) >= 1);

  console.log(JSON.stringify({ status: 'PASS', checks: 21 }));
} finally {
  pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query('DELETE FROM users WHERE username = $1 OR email = $2', [username, email]);
  } finally {
    await pool.end();
    server.kill('SIGTERM');
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}
