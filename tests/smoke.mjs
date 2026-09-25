import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const httpPort = Number(process.env.TEST_HTTP_PORT || 4173);
const debugPort = Number(process.env.TEST_DEBUG_PORT || 9222);

let server;
let browser;
let socket;
let nextId = 1;
const pending = new Map();
const errors = [];

async function waitFor(check, timeoutMs = 15000, intervalMs = 100) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const value = await check();
      if (value) return value;
    } catch {}
    await sleep(intervalMs);
  }
  throw new Error('Timed out waiting for test condition.');
}

async function connectCDP() {
  const target = await waitFor(async () => {
    const response = await fetch('http://127.0.0.1:' + debugPort + '/json');
    if (!response.ok) return null;
    const targets = await response.json();
    return targets.find(item => item.type === 'page' && item.webSocketDebuggerUrl) || null;
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
  });
  await waitFor(() => socket.readyState === WebSocket.OPEN);
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

async function main() {
  server = spawn('python3', ['-m', 'http.server', String(httpPort), '--bind', '127.0.0.1'], {
    cwd: root,
    stdio: 'ignore'
  });

  browser = spawn(process.env.CHROMIUM || 'chromium', [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--remote-debugging-address=127.0.0.1',
    '--remote-debugging-port=' + debugPort,
    '--user-data-dir=' + path.join(root, '.test-chrome-profile'),
    'about:blank'
  ], { stdio: 'ignore' });

  await connectCDP();
  await cdp('Runtime.enable');
  await cdp('Log.enable');
  await cdp('Page.enable');

  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') {
      errors.push(message.params.exceptionDetails?.exception?.description || message.params.exceptionDetails?.text || 'Runtime exception');
    }
    if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
      errors.push(message.params.entry.text || 'Console error');
    }
  });

  await cdp('Page.navigate', { url: 'http://127.0.0.1:' + httpPort + '/index.html' });
  await waitFor(async () => (await evaluate('document.readyState')) === 'complete');
  await sleep(500);

  const baseline = await evaluate('(() => {' +
    'const required = ["screen-menu","screen-quiz","screen-race","screen-sudoku","screen-shape","screen-slab","auth-modal","research-consent-modal","progress-modal"];' +
    'const missing = required.filter(id => !document.getElementById(id));' +
    'const resources = [...Array.from(document.scripts).map(s => s.src), ...Array.from(document.querySelectorAll("link[rel=stylesheet]")).map(l => l.href)];' +
    'return { missing, resources };' +
  '})()');

  if (baseline.missing.length) throw new Error('Missing required DOM nodes: ' + baseline.missing.join(', '));

  const resourceResults = await evaluate('(async () => {' +
    'const urls = [...Array.from(document.scripts).map(s => s.src), ...Array.from(document.querySelectorAll("link[rel=stylesheet]")).map(l => l.href)];' +
    'const results = [];' +
    'for (const url of urls) { const r = await fetch(url, { cache: "no-store" }); results.push({ url, ok: r.ok, status: r.status }); }' +
    'return results;' +
  '})()');
  const badResources = resourceResults.filter(x => !x.ok);
  if (badResources.length) throw new Error('Broken static resources: ' + JSON.stringify(badResources));

  const authResult = await evaluate('(async () => {' +
    'const assert = (condition, message) => { if (!condition) throw new Error(message); };' +
    'localStorage.clear(); sessionStorage.clear();' +
    'Auth.open("signup");' +
    'document.getElementById("auth-username").value = "stress_user";' +
    'document.getElementById("auth-email").value = "stress@example.com";' +
    'document.getElementById("auth-password").value = "StressPass123";' +
    'document.getElementById("auth-confirm-password").value = "StressPass123";' +
    'await Auth.submit({ preventDefault() {} }, "signup");' +
    'assert(Auth.isLoggedIn(), "Signup did not create an active session.");' +
    'assert(ResearchConsent.get() === null, "Research consent should be unset after signup.");' +
    'assert(!document.getElementById("research-consent-modal").classList.contains("hidden"), "Consent dialog did not open after signup.");' +
    'ResearchConsent.choose("no");' +
    'assert(ResearchConsent.get() === "no", "Consent No was not persisted.");' +
    'Analytics.log("stress", "blocked", {});' +
    'assert(Analytics.summary().totalEvents === 0, "Analytics recorded an event while consent was No.");' +
    'assert(localStorage.getItem("mfa_analytics_v1") === null, "Analytics data remained after consent was set to No.");' +
    'ResearchConsent.choose("yes");' +
    'for (let i = 0; i < 1600; i++) Analytics.log("stress", "answer", { correct: i % 2 === 0 });' +
    'assert(Analytics.summary().totalEvents === 1500, "Analytics event cap is not enforced.");' +
    'ResearchConsent.choose("no");' +
    'assert(localStorage.getItem("mfa_analytics_v1") === null, "Changing consent back to No did not purge research events.");' +
    'const account = JSON.parse(localStorage.getItem("mfa_local_account_v1"));' +
    'sessionStorage.setItem("mfa_local_session_v1", JSON.stringify({ token: "expired", username: account.username, createdAt: Date.now() - 1000, expiresAt: Date.now() - 1 }));' +
    'assert(!Auth.isLoggedIn(), "Expired session was accepted.");' +
    'assert(sessionStorage.getItem("mfa_local_session_v1") === null, "Expired session was not cleared.");' +
    'sessionStorage.setItem("mfa_local_session_v1", "{bad json");' +
    'assert(!Auth.isLoggedIn(), "Malformed session was accepted.");' +
    'assert(sessionStorage.getItem("mfa_local_session_v1") === null, "Malformed session was not cleared.");' +
    'sessionStorage.setItem("mfa_local_session_v1", JSON.stringify({ token: "mismatch", username: "other_user", createdAt: Date.now(), expiresAt: Date.now() + 10000 }));' +
    'assert(!Auth.isLoggedIn(), "Account-mismatched session was accepted.");' +
    'assert(sessionStorage.getItem("mfa_local_session_v1") === null, "Account-mismatched session was not cleared.");' +
    'Auth.open("login");' +
    'document.getElementById("auth-username").value = "stress_user";' +
    'document.getElementById("auth-password").value = "StressPass123";' +
    'await Auth.submit({ preventDefault() {} }, "login");' +
    'assert(Auth.isLoggedIn(), "Username login failed.");' +
    'Auth.logout();' +
    'Auth.open("login");' +
    'document.getElementById("auth-username").value = "stress@example.com";' +
    'document.getElementById("auth-password").value = "StressPass123";' +
    'await Auth.submit({ preventDefault() {} }, "login");' +
    'assert(Auth.isLoggedIn(), "Email login failed.");' +
    'Auth.logout();' +
    'return { ok: true };' +
  '})()');

  if (!authResult?.ok) throw new Error('Authentication/consent stress test did not complete.');

  const gameResult = await evaluate('(async () => {' +
    'const assert = (condition, message) => { if (!condition) throw new Error(message); };' +
    'const activeScreen = id => document.getElementById(id).classList.contains("active");' +
    'ResearchConsent.set("yes");' +
    'Game.startArithmetic();' +
    'assert(activeScreen("screen-quiz"), "Arithmetic screen did not open.");' +
    'for (let i = 0; i < 100; i++) { document.getElementById("quiz-input").value = "999999"; Quiz.submit(); Quiz.next(); }' +
    'Game.startRacing();' +
    'assert(activeScreen("screen-race"), "Racing screen did not open.");' +
    'for (let round = 0; round < 10; round++) { Racing.start(); for (let i = 0; i < 20; i++) { document.getElementById("race-input").value = "999999"; Racing.submit(); } Racing.back(); }' +
    'Game.startSudoku();' +
    'assert(activeScreen("screen-sudoku"), "Sudoku screen did not open.");' +
    'for (let i = 0; i < 40; i++) { Sudoku.newPuzzle(); Sudoku.giveHint(); }' +
    'Game.startShapePuzzle();' +
    'assert(activeScreen("screen-shape"), "Shape screen did not open.");' +
    'for (let i = 0; i < 40; i++) { ShapePuzzle.restartLevel(); ShapePuzzle.showHint(); ShapePuzzle.rotateSelected(); }' +
    'Game.startSlabMath();' +
    'assert(activeScreen("screen-slab"), "Slab Maths screen did not open.");' +
    'for (let i = 0; i < 40; i++) { SlabMath.restartRound(); SlabMath.hint(); SlabMath.newRound(); }' +
    'Game.goHome();' +
    'assert(activeScreen("screen-menu"), "Home screen did not return after stress run.");' +
    'return { quizQuestions: document.getElementById("quiz-q-number")?.textContent, sudokuCells: document.querySelectorAll("#sudoku-grid .sudoku-cell").length, shapeCells: document.querySelectorAll("#shape-board .sp-cell").length };' +
  '})()');

  if (!gameResult) throw new Error('Game stress test returned no result.');
  await sleep(500);
  if (errors.length) throw new Error('Browser runtime/console errors detected:\n' + [...new Set(errors)].join('\n'));

  console.log(JSON.stringify({ status: 'PASS', baseline, auth: authResult, games: gameResult, browserErrors: 0 }, null, 2));
}

try {
  await main();
} finally {
  if (socket && socket.readyState === WebSocket.OPEN) socket.close();
  if (browser) browser.kill('SIGTERM');
  if (server) server.kill('SIGTERM');
}
