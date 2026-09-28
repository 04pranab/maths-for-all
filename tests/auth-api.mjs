import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { setTimeout as sleep } from 'node:timers/promises';
import pg from 'pg';

const root = new URL('..', import.meta.url);
const port = 4876;

if (!process.env.DATABASE_URL) {
  console.log(JSON.stringify({ status: 'SKIP', reason: 'DATABASE_URL is not configured' }));
  process.exit(0);
}

const { Pool } = pg;
const cleanup = new Pool({ connectionString: process.env.DATABASE_URL });
const suffix = randomUUID().slice(0, 8);
const username = 'stress_' + suffix;
const email = username + '@example.com';
const password = 'StressPass123';

const env = {
  ...process.env,
  AUTH_PORT: String(port),
  AUTH_ORIGIN: 'http://127.0.0.1:' + port,
  AUTH_COOKIE_SECURE: 'false'
};

const server = spawn(process.execPath, ['server/index.mjs'], {
  cwd: root,
  env,
  stdio: ['ignore', 'pipe', 'pipe']
});

async function waitForHealth() {
  for (let i = 0; i < 100; i++) {
    try {
      const response = await fetch('http://127.0.0.1:' + port + '/api/health');
      if (response.ok) return;
    } catch {}
    await sleep(100);
  }
  throw new Error('Auth server did not start.');
}

async function call(pathname, options = {}) {
  return fetch('http://127.0.0.1:' + port + pathname, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {})
    }
  });
}

try {
  await waitForHealth();

  const register = await call('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  });
  assert.equal(register.status, 201);

  const duplicate = await call('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email: 'other-' + email, password })
  });
  assert.equal(duplicate.status, 400);

  const badOrigin = await call('/api/auth/login', {
    method: 'POST',
    headers: { origin: 'https://evil.example' },
    body: JSON.stringify({ identifier: username, password })
  });
  assert.equal(badOrigin.status, 403);

  const login = await call('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier: username, password })
  });
  assert.equal(login.status, 200);

  const cookie = login.headers.get('set-cookie');
  assert.ok(cookie && cookie.includes('mfa_session='));

  const me = await call('/api/auth/me', {
    headers: { cookie: cookie.split(';')[0] }
  });
  assert.equal(me.status, 200);
  const meBody = await me.json();
  assert.equal(meBody.authenticated, true);
  assert.equal(meBody.user.username, username);

  const logout = await call('/api/auth/logout', {
    method: 'POST',
    headers: { cookie: cookie.split(';')[0] }
  });
  assert.equal(logout.status, 200);

  console.log(JSON.stringify({ status: 'PASS', checks: 7 }));
} finally {
  server.kill('SIGTERM');
  await cleanup.query('DELETE FROM users WHERE username = $1', [username]).catch(() => {});
  await cleanup.end();
}
