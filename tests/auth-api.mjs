import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const root = path.resolve(import.meta.dirname, '..');
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mfa-auth-'));
const dbPath = path.join(tempDir, 'test.sqlite');
const outboxPath = path.join(tempDir, 'outbox.ndjson');
const port = 4876;
const env = {
  ...process.env,
  AUTH_PORT: String(port),
  AUTH_DB_PATH: dbPath,
  AUTH_ORIGIN: 'http://localhost:' + port,
  AUTH_TEST_OUTBOX_PATH: outboxPath
};

const server = spawn(process.execPath, ['server/index.mjs'], {
  cwd: root, env, stdio: ['ignore', 'pipe', 'pipe']
});

async function waitForHealth() {
  for (let i = 0; i < 100; i++) {
    try {
      const response = await fetch('http://localhost:' + port + '/api/health');
      if (response.ok) return;
    } catch {}
    await sleep(50);
  }
  throw new Error('Auth server did not start.');
}

async function call(pathname, options = {}) {
  return fetch('http://localhost:' + port + pathname, {
    ...options,
    headers: { 'content-type': 'application/json', ...(options.headers || {}) }
  });
}

function latestMail(type) {
  const rows = fs.readFileSync(outboxPath, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
  return [...rows].reverse().find(row => row.type === type);
}

function tokenFromMail(mail, query) {
  return new URL(mail.text).searchParams.get(query);
}

try {
  await waitForHealth();

  const register = await call('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username: 'stress_user', email: 'stress@example.com', password: 'StressPass123' })
  });
  assert.equal(register.status, 201);
  assert.equal((await register.json()).verificationRequired, true);

  const loginBeforeVerify = await call('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier: 'stress_user', password: 'StressPass123' })
  });
  assert.equal(loginBeforeVerify.status, 401);

  const verificationToken = tokenFromMail(latestMail('email-verification'), 'verify');
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
    body: JSON.stringify({ identifier: 'stress_user', password: 'StressPass123' })
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.getSetCookie()[0].split(';')[0];

  const me = await call('/api/auth/me', { headers: { cookie } });
  assert.equal(me.status, 200);
  assert.equal((await me.json()).user.username, 'stress_user');

  const resetExisting = await call('/api/auth/password-reset/request', {
    method: 'POST',
    body: JSON.stringify({ email: 'stress@example.com' })
  });
  const resetMissing = await call('/api/auth/password-reset/request', {
    method: 'POST',
    body: JSON.stringify({ email: 'missing@example.com' })
  });
  assert.equal(resetExisting.status, 202);
  assert.equal(resetMissing.status, 202);
  assert.equal((await resetExisting.json()).message, (await resetMissing.json()).message);

  const resetToken = tokenFromMail(latestMail('password-reset'), 'reset');
  const reset = await call('/api/auth/password-reset/confirm', {
    method: 'POST',
    body: JSON.stringify({ token: resetToken, password: 'NewStressPass456' })
  });
  assert.equal(reset.status, 200);

  const oldSession = await call('/api/auth/me', { headers: { cookie } });
  assert.equal(oldSession.status, 200);
  assert.equal((await oldSession.json()).authenticated, false);

  const oldPassword = await call('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier: 'stress_user', password: 'StressPass123' })
  });
  assert.equal(oldPassword.status, 401);

  const newPassword = await call('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier: 'stress@example.com', password: 'NewStressPass456' })
  });
  assert.equal(newPassword.status, 200);

  const reusedReset = await call('/api/auth/password-reset/confirm', {
    method: 'POST',
    body: JSON.stringify({ token: resetToken, password: 'AnotherPass789' })
  });
  assert.equal(reusedReset.status, 400);

  const badOrigin = await call('/api/auth/password-reset/request', {
    method: 'POST',
    headers: { origin: 'https://evil.example' },
    body: JSON.stringify({ email: 'stress@example.com' })
  });
  assert.equal(badOrigin.status, 403);

  console.log(JSON.stringify({ status: 'PASS', checks: 13 }));
} finally {
  server.kill('SIGTERM');
  fs.rmSync(tempDir, { recursive: true, force: true });
}
