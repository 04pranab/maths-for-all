import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const root = path.resolve(import.meta.dirname, '..');
const port = 4877;
const debugPort = 9223;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mfa-auth-browser-'));
const dbPath = path.join(tempDir, 'auth.sqlite');
const env = {
  ...process.env,
  AUTH_PORT: String(port),
  AUTH_DB_PATH: dbPath,
  AUTH_ORIGIN: 'http://localhost:' + port
};

let server;
let browser;
let socket;
let nextId = 1;
const pending = new Map();
const errors = [];

async function waitFor(check, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const value = await check();
      if (value) return value;
    } catch {}
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
  const result = await cdp('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || 'Browser evaluation failed.');
  }
  return result.result?.value;
}

async function connect() {
  const target = await waitFor(async () => {
    const response = await fetch('http://127.0.0.1:' + debugPort + '/json');
    const targets = await response.json();
    return targets.find(item => item.type === 'page' && item.webSocketDebuggerUrl);
  });
  socket = new WebSocket(target.webSocketDebuggerUrl);
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const item = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) item.reject(new Error(message.error.message));
      else item.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') {
      errors.push(message.params.exceptionDetails?.exception?.description || message.params.exceptionDetails?.text || 'Runtime exception');
    }
    if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
      errors.push(message.params.entry.text || 'Console error');
    }
  });
  await waitFor(() => socket.readyState === WebSocket.OPEN);
}

try {
  server = spawn(process.execPath, ['server/index.mjs'], {
    cwd: root, env, stdio: 'ignore'
  });
  browser = spawn(process.env.CHROMIUM || 'chromium', [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
    '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=' + debugPort,
    '--user-data-dir=' + path.join(tempDir, 'chrome'), 'about:blank'
  ], { stdio: 'ignore' });

  await connect();
  await cdp('Runtime.enable');
  await cdp('Log.enable');
  await cdp('Page.enable');
  await cdp('Page.navigate', { url: 'http://localhost:' + port + '/index.html' });
  await waitFor(async () => (await evaluate('document.readyState')) === 'complete');
  await sleep(300);

  const result = await evaluate(`(async () => {
    const assert = (condition, message) => { if (!condition) throw new Error(message); };
    localStorage.clear();
    sessionStorage.clear();

    const guestPolicy = document.querySelector('.nav-policy');
    assert(guestPolicy && guestPolicy.offsetParent !== null, 'Guest privacy button is missing.');

    Auth.open('signup');
    await new Promise(r => setTimeout(r, 50));
    document.getElementById('auth-username').value = 'browser_user';
    document.getElementById('auth-email').value = 'browser@example.com';
    document.getElementById('auth-password').value = 'BrowserPass123';
    document.getElementById('auth-confirm-password').value = 'BrowserPass123';
    await Auth.submit({ preventDefault() {} }, 'signup');

    assert(Auth.isLoggedIn(), 'Browser signup did not create a server session.');
    assert(!localStorage.getItem('mfa_local_account_v1'), 'Legacy local account data was written.');
    assert(document.cookie === '', 'The session cookie is accessible to page JavaScript.');

    assert(ResearchConsent.get() === null, 'Research consent should remain separate from authentication.');
    assert(!document.getElementById('research-consent-modal').classList.contains('hidden'), 'Consent did not open after login.');

    ResearchConsent.choose('no');
    Analytics.log('stress', 'blocked', {});
    assert(Analytics.summary().totalEvents === 0, 'Research analytics were recorded after No.');
    assert(!localStorage.getItem('mfa_analytics_v1'), 'Research analytics survived a No choice.');

    await Auth.logout();
    assert(!Auth.isLoggedIn(), 'Logout did not clear the authenticated browser state.');

    Auth.open('login');
    document.getElementById('auth-username').value = 'browser_user';
    document.getElementById('auth-password').value = 'BrowserPass123';
    await Auth.submit({ preventDefault() {} }, 'login');
    assert(Auth.isLoggedIn(), 'Username login failed.');

    await Auth.logout();
    Auth.open('login');
    document.getElementById('auth-username').value = 'browser@example.com';
    document.getElementById('auth-password').value = 'BrowserPass123';
    await Auth.submit({ preventDefault() {} }, 'login');
    assert(Auth.isLoggedIn(), 'Email login failed.');

    return { status: 'PASS', authenticated: true, researchBlockedOnNo: true };
  })()`);

  assert.deepEqual(result, { status: 'PASS', authenticated: true, researchBlockedOnNo: true });
  if (errors.length) throw new Error('Browser errors detected:\\n' + [...new Set(errors)].join('\\n'));
  console.log(JSON.stringify(result));
} finally {
  if (socket && socket.readyState === WebSocket.OPEN) socket.close();
  if (browser) browser.kill('SIGTERM');
  if (server) server.kill('SIGTERM');
  fs.rmSync(tempDir, { recursive: true, force: true });
}
