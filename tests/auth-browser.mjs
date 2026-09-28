import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import pg from 'pg';
import { setTimeout as sleep } from 'node:timers/promises';

const root = path.resolve(import.meta.dirname, '..');
const port = 4877;
const debugPort = 9223;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mfa-auth-browser-pg-'));
const outboxPath = path.join(tempDir, 'outbox.ndjson');
const suffix = Math.random().toString(36).slice(2, 9);
const username = 'browser_' + suffix;
const email = username + '@example.com';
const password = 'BrowserPass123';

if (!process.env.DATABASE_URL) {
  console.log(JSON.stringify({ status: 'SKIP', reason: 'DATABASE_URL is not configured.' }));
  process.exit(0);
}

const env = { ...process.env, AUTH_PORT: String(port), AUTH_ORIGIN: 'http://127.0.0.1:' + port, AUTH_COOKIE_SECURE: 'false', AUTH_TEST_OUTBOX_PATH: outboxPath };
let server;
let browser;
let socket;
let nextId = 1;
const pending = new Map();
const errors = [];

async function waitFor(check, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try { const value = await check(); if (value) return value; } catch {}
    await sleep(100);
  }
  throw new Error('Timed out waiting for test condition.');
}

function cdp(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || 'Browser evaluation failed.');
  return result.result?.value;
}

function verificationToken() {
  const rows = fs.readFileSync(outboxPath, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
  const mail = [...rows].reverse().find(row => row.type === 'email-verification');
  return new URL(mail.text.slice(mail.text.indexOf('http'))).searchParams.get('verify');
}

try {
  server = spawn(process.execPath, ['server/index.mjs'], { cwd: root, env, stdio: 'ignore' });
  browser = spawn(process.env.CHROMIUM || 'chromium', ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-debugging-address=127.0.0.1','--remote-debugging-port=' + debugPort,'--user-data-dir=' + path.join(tempDir, 'chrome'),'about:blank'], { stdio: 'ignore' });

  const target = await waitFor(async () => (await (await fetch('http://127.0.0.1:' + debugPort + '/json')).json()).find(item => item.type === 'page' && item.webSocketDebuggerUrl));
  socket = new WebSocket(target.webSocketDebuggerUrl);
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const item = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) item.reject(new Error(message.error.message)); else item.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails?.exception?.description || 'Runtime exception');
    if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') errors.push(message.params.entry.text || 'Console error');
  });

  await waitFor(async () => {
    const response = await fetch('http://127.0.0.1:' + port + '/api/health');
    return response.ok;
  });
  await waitFor(() => socket.readyState === WebSocket.OPEN);
  await cdp('Runtime.enable');
  await cdp('Log.enable');
  await cdp('Page.enable');
  await cdp('Page.navigate', { url: 'http://127.0.0.1:' + port + '/index.html' });
  await waitFor(async () => (await evaluate('document.readyState')) === 'complete' && (await evaluate('location.origin')) === 'http://127.0.0.1:' + port);

  const result = await evaluate(`(async () => {
    const assert = (condition, message) => { if (!condition) throw new Error(message); };
    localStorage.clear();
    sessionStorage.clear();
    assert(document.querySelector('.nav-policy')?.offsetParent !== null, 'Guest privacy button is missing.');
    Auth.open('signup');
    await new Promise(r => setTimeout(r, 50));
    document.getElementById('auth-username').value = "browser_6h9xc3x";
    document.getElementById('auth-email').value = "browser_6h9xc3x@example.com";
    document.getElementById('auth-password').value = "BrowserPass123";
    document.getElementById('auth-confirm-password').value = "BrowserPass123";
    await Auth.submit({ preventDefault() {} }, 'signup');
    assert(!Auth.isLoggedIn(), 'Unverified signup created a session.');
    assert(document.getElementById('auth-modal').textContent.includes('Check your email'), 'Verification guidance missing.');
    return true;
  })()`);

  assert.equal(result, true);
  const token = verificationToken();
  await cdp('Page.navigate', { url: 'http://127.0.0.1:' + port + '/?verify=' + encodeURIComponent(token) });
  await waitFor(async () => {
    const origin = await evaluate('location.origin');
    const search = await evaluate('location.search');
    return origin === 'http://127.0.0.1:' + port && search.includes('verify=');
  });
  await waitFor(async () => (await evaluate('document.readyState')) === 'complete');
  await waitFor(async () => (await evaluate(`document.getElementById('auth-modal')?.textContent.includes('email is verified')`)) === true, 30000);

  const verified = await evaluate(`(async () => {
    Auth.open('login');
    document.getElementById('auth-username').value = "browser_6h9xc3x";
    document.getElementById('auth-password').value = "BrowserPass123";
    await Auth.submit({ preventDefault() {} }, 'login');
    if (!Auth.isLoggedIn()) throw new Error('Verified browser login failed.');
    if (document.cookie !== '') throw new Error('HttpOnly session cookie is accessible.');
    ResearchConsent.choose('no');
    Analytics.log('stress', 'blocked', {});
    if (Analytics.summary().totalEvents !== 0) throw new Error('Research data recorded after No.');
    await Auth.logout();
    return true;
  })()`);

  assert.equal(verified, true);
  if (errors.length) throw new Error('Browser errors detected:\n' + [...new Set(errors)].join('\n'));
  console.log(JSON.stringify({ status: 'PASS', checks: 8 }));
} finally {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try { await pool.query('DELETE FROM users WHERE username = $1 OR email = $2', [username, email]); } finally { await pool.end(); }
  if (socket && socket.readyState === WebSocket.OPEN) socket.close();
  if (browser) browser.kill('SIGTERM');
  if (server) server.kill('SIGTERM');
  fs.rmSync(tempDir, { recursive: true, force: true });
}
