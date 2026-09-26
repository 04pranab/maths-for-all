import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const root = path.resolve(import.meta.dirname, '..');
const dbPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mfa-auth-')), 'test.sqlite');
const port = 4876;
const env = {
  ...process.env,
  AUTH_PORT: String(port),
  AUTH_DB_PATH: dbPath,
  AUTH_ORIGIN: 'http://127.0.0.1:' + port
};

const server = spawn(process.execPath, ['server/index.mjs'], {
  cwd: root, env, stdio: ['ignore', 'pipe', 'pipe']
});

async function waitForHealth() {
  for (let i = 0; i < 100; i++) {
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

try {
  await waitForHealth();

  const register = await call('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username: 'stress_user', email: 'stress@example.com', password: 'StressPass123' })
  });
  assert.equal(register.status, 201);

  const duplicate = await call('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username: 'stress_user', email: 'other@example.com', password: 'StressPass123' })
  });
  assert.equal(duplicate.status, 400);

  const badOrigin = await call('/api/auth/login', {
    method: 'POST',
    headers: { origin: 'https://evil.example' },
    body: JSON.stringify({ identifier: 'stress_user', password: 'StressPass123' })
  });
  assert.equal(badOrigin.status, 403);

  console.log(JSON.stringify({ status: 'PASS', checks: 3 }));
} finally {
  server.kill('SIGTERM');
  fs.rmSync(path.dirname(dbPath), { recursive: true, force: true });
}
