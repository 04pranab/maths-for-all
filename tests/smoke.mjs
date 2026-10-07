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
const failedResources = [];
const serverErrors = [];
const processErrors = [];
process.on('uncaughtException', error => processErrors.push('uncaughtException: ' + (error?.stack || error?.message || error)));
process.on('unhandledRejection', error => processErrors.push('unhandledRejection: ' + (error?.stack || error?.message || error)));

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
  server = spawn(process.execPath, ['server/index.mjs'], {
    cwd: root,
    env: {
      ...process.env,
      AUTH_PORT: String(httpPort),
      AUTH_ORIGIN: 'http://127.0.0.1:' + httpPort,
      AUTH_COOKIE_SECURE: 'false'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  server.stdout.on('data', () => {});
  server.stderr.on('data', chunk => { const text = String(chunk).trim(); if (text) serverErrors.push('stderr: ' + text); });

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

  const baseUrl = 'http://127.0.0.1:' + httpPort;
  const httpGet = async (path, headers = {}) => fetch(baseUrl + path, { headers });
  const httpPost = async (path, body, headers = {}) => fetch(baseUrl + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body)
  });

  await waitFor(async () => {
    try {
      const response = await httpGet('/api/health');
      return response.status === 200;
    } catch {
      return false;
    }
  });

  const httpAudit = await (async () => {
    const assert = (condition, message) => { if (!condition) throw new Error(message); };
    const health = await httpGet('/api/health');
    assert(health.status === 200, 'Health endpoint failed before stress run: ' + health.status);
    const unknown = await httpGet('/api/does-not-exist');
    assert(unknown.status === 404, 'Unknown API route did not return 404.');
    const malformed = await fetch(baseUrl + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{not-json'
    });
    assert(malformed.status === 400, 'Malformed JSON was not rejected with 400: ' + malformed.status);
    const crossOrigin = await httpGet('/api/health', { Origin: 'https://invalid.example' });
    assert(crossOrigin.status === 403, 'Cross-origin API request was not rejected: ' + crossOrigin.status);

    const rateResults = await Promise.all(Array.from({ length: 14 }, () => httpPost('/api/auth/login', {
      username: 'stress-invalid-user', password: 'invalid-password'
    })));
    const rateStatuses = rateResults.map(response => response.status);
    assert(rateStatuses.includes(429), 'Login rate limiting did not activate under repeated invalid requests: ' + rateStatuses.join(','));
    assert(rateStatuses.every(status => [401, 400, 429].includes(status)), 'Unexpected login error status during rate-limit audit: ' + rateStatuses.join(','));

    const userIds = Array.from({ length: 32 }, (_, i) => 'stress-user-' + i);
    const rounds = 30;
    const workloads = [];
    for (const userId of userIds) {
      for (let round = 0; round < rounds; round++) {
        workloads.push((async () => {
          const [h, me, page] = await Promise.all([
            httpGet('/api/health', { 'x-stress-user': userId }),
            httpGet('/api/auth/me', { Cookie: 'mfa_session=synthetic-invalid-' + userId + '-' + round }),
            httpGet('/index.html', { 'x-stress-user': userId })
          ]);
          assert(h.status === 200, userId + ' health status ' + h.status);
          assert(me.status === 200, userId + ' auth/me status ' + me.status);
          const meBody = await me.json();
          assert(meBody.authenticated === false, userId + ' synthetic session was accepted unexpectedly.');
          assert(page.status === 200, userId + ' page status ' + page.status);
          return userId;
        })());
      }
    }
    const identities = await Promise.all(workloads);
    assert(new Set(identities).size === userIds.length, 'Not all stress identities completed independently.');
    return { users: userIds.length, roundsPerUser: rounds, workloads: workloads.length, httpRequests: workloads.length * 3, malformedCases: 3, rateLimitRequests: rateResults.length };
  })();

  await connectCDP();
  await cdp('Runtime.enable');
  await cdp('Log.enable');
  await cdp('Network.enable');
  await cdp('Page.enable');

  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') {
      errors.push(message.params.exceptionDetails?.exception?.description || message.params.exceptionDetails?.text || 'Runtime exception');
    }
    if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
      errors.push(message.params.entry.text || 'Console error');
    }
    if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) {
      failedResources.push({ status: message.params.response.status, url: message.params.response.url });
    }
  });

  await cdp('Page.navigate', { url: 'http://127.0.0.1:' + httpPort + '/index.html' });
  await waitFor(async () => (await evaluate('document.readyState')) === 'complete');
  await sleep(500);

  const baseline = await evaluate('(() => {' +
    'const required = ["screen-menu","screen-quiz","screen-race","screen-sudoku","screen-shape","screen-slab","screen-architect","auth-modal","research-consent-modal","progress-modal","account-profile-modal"];' +
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

  const modalResult = await evaluate('(async () => {' +
    'const assert = (condition, message) => { if (!condition) throw new Error(message); };' +
    'localStorage.clear(); sessionStorage.clear();' +
    'const guestPolicy = document.querySelector(".nav-policy");' +
    'assert(guestPolicy, "Unauthenticated privacy/data policy button is missing.");' +
    'assert(guestPolicy.offsetParent !== null, "Unauthenticated privacy/data policy button is not visible.");' +
    'Game.startArithmetic();' +
    'await new Promise(r => setTimeout(r, 20));' +
    'document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));' +
    'assert(document.getElementById("screen-quiz").classList.contains("active"), "Escape without an overlay must not navigate away from the game.");' +
    'Auth.open("login");' +
    'await new Promise(r => setTimeout(r, 50));' +
    'assert(document.activeElement?.id === "auth-username", "Auth modal did not move focus to the first field.");' +
    'document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));' +
    'assert(document.getElementById("auth-modal").classList.contains("hidden"), "Escape did not close the auth overlay.");' +
    'ResearchConsent.open();' +
    'await new Promise(r => setTimeout(r, 50));' +
    'assert(document.activeElement?.classList.contains("consent-btn"), "Consent modal did not move focus to a choice.");' +
    'document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));' +
    'assert(!document.getElementById("research-consent-modal").classList.contains("hidden"), "Initial consent must not close with Escape before a choice.");' +
    'ResearchConsent.choose("no");' +
    'ResearchConsent.open();' +
    'document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));' +
    'assert(document.getElementById("research-consent-modal").classList.contains("hidden"), "Dismissible consent overlay did not close with Escape.");' +
    'return { ok: true };' +
  '})()');

  const helpResult = await evaluate('(async () => {' +
    'const assert = (condition, message) => { if (!condition) throw new Error(message); };' +
    'const cases = [["screen-quiz","quiz","How to play: Arithmetic Quiz"],["screen-race","race","How to play: Math Racing"],["screen-sudoku","sudoku","How to play: Sudoku Challenge"],["screen-shape","shape","How to play: Shape Fitting"],["screen-slab","slab","How to play: Slab Maths"],["screen-architect","architect","How to play: Shape Architect"]];' +
    'for (const [screenId, key, title] of cases) {' +
      'Game.goHome();' +
      'const start = { quiz: Game.startArithmetic, race: Game.startRacing, sudoku: Game.startSudoku, shape: Game.startShapePuzzle, slab: Game.startSlabMath, architect: Game.startShapeArchitect }[key];' +
      'start();' +
      'Navigation.howToPlay();' +
      'await new Promise(r => setTimeout(r, 20));' +
      'assert(document.getElementById(screenId).classList.contains("active"), "Expected active game screen: " + screenId);' +
      'assert(document.getElementById("controls-title").textContent === title, "How to play opened the wrong instructions for " + key);' +
      'document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));' +
      'assert(document.getElementById("controls-overlay").classList.contains("hidden"), "Escape did not close controls overlay for " + key);' +
    '}' +
    'return { ok: true };' +
  '})()');


  const probabilityResult = await evaluate(`(() => {
    const assert = (condition, message) => { if (!condition) throw new Error(message); };
    Game.goHome();
    ProbabilityCarnival.open();
    assert(window.ProbabilityCarnivalStories.levels.length === 60, "Probability Carnival must define exactly 60 levels.");
    assert(window.ProbabilityCarnivalStories.stages.length === 6, "Probability Carnival must define six stages.");
    for (let stage = 1; stage <= 6; stage++) {
      const levels = window.ProbabilityCarnivalStories.levels.filter(level => level.stage === stage);
      assert(levels.length === 10, "Probability Carnival stage " + stage + " must contain ten levels.");
      assert(levels[0].id === (stage - 1) * 10 + 1 && levels[9].id === stage * 10, "Probability Carnival stage boundaries are invalid.");
    }
    ProbabilityCarnival.selectLevel(1);
    assert(document.querySelectorAll("#pc-level-grid .pc-level-button").length === 10, "Stage 1 must show ten level buttons.");
    assert(document.getElementById("pc-stage-name").textContent === "Probability intuition", "Stage 1 title is incorrect.");
    document.querySelector("#pc-choice-area .pc-choice[data-value='impossible']").click();
    ProbabilityCarnival.check();
    assert(document.getElementById("pc-completed-count").textContent === "1", "Stage 1 level did not complete.");
    ProbabilityCarnival.selectLevel(11);
    document.querySelector("#pc-choice-area .pc-choice[data-value='A']").click();
    ProbabilityCarnival.check();
    assert(document.getElementById("pc-completed-count").textContent === "2", "Stage 2 representative level did not complete.");
    ProbabilityCarnival.selectLevel(22);
    const targetTokens = [...document.querySelectorAll(".pc-build-token")];
    assert(targetTokens.length === 12, "Build levels must expose twelve editable token slots.");
    document.querySelectorAll('.pc-build-token')[6].click();
    document.querySelectorAll('.pc-build-token')[6].click();
    ProbabilityCarnival.check();
    assert(document.getElementById("pc-completed-count").textContent === "3", "Stage 3 representative level did not complete.");
    ProbabilityCarnival.selectLevel(31);
    document.querySelector("#pc-choice-area .pc-choice[data-value='sun']").click();
    document.querySelector("#pc-choice-area .pc-run-button").click();
    assert(document.getElementById("pc-completed-count").textContent === "4", "Stage 4 representative experiment did not complete.");
    ProbabilityCarnival.selectLevel(41);
    document.querySelector("#pc-choice-area .pc-choice").click();
    ProbabilityCarnival.check();
    assert(document.getElementById("pc-completed-count").textContent === "5", "Stage 5 representative level did not complete.");
    ProbabilityCarnival.selectLevel(51);
    document.querySelector("#pc-choice-area .pc-run-button").click();
    document.querySelector("#pc-choice-area .pc-choice").click();
    ProbabilityCarnival.check();
    assert(document.getElementById("pc-completed-count").textContent === "6", "Stage 6 representative level did not complete.");
    for (let stage = 1; stage <= 6; stage++) {
      ProbabilityCarnival.selectStage(stage);
      assert(document.querySelectorAll("#pc-level-grid .pc-level-button").length === 10, "Stage " + stage + " does not render ten levels.");
    }
    Game.goHome();
    return { levels: 60, stages: 6, levelsPerStage: 10, representativeCompletions: 6 };
  })()`);

  if (!helpResult?.ok) throw new Error('Context-sensitive help and Escape overlay checks did not complete.');

  const malformedInputResult = await evaluate('(async () => {' +
    'const assert = (condition, message) => { if (!condition) throw new Error(message); };' +
    'const inputs = ["", "abc", "-999999999999999999999999", "999999999999999999999999", "\\u0000", "  "];' +
    'Game.startArithmetic();' +
    'for (const value of inputs) { document.getElementById("quiz-input").value = value; Quiz.submit(); }' +
    'Game.startRacing();' +
    'Racing.start();' +
    'for (const value of inputs) { document.getElementById("race-input").value = value; Racing.submit(); }' +
    'Game.startSudoku();' +
    'const sudokuCell = document.querySelector("#sudoku-grid .sudoku-cell");' +
    'sudokuCell?.click();' +
    'for (let i=0;i<81;i++) document.dispatchEvent(new KeyboardEvent("keydown", { key: "x" }));' +
    'Game.startShapePuzzle();' +
    'for (let i=0;i<50;i++) { ShapePuzzle.rotateSelected(); ShapePuzzle.showHint(); }' +
    'Game.startSlabMath();' +
    'for (let i=0;i<50;i++) SlabMath.hint();' +
    'assert(document.querySelector(".screen.active"), "Malformed-input stress left no active screen.");' +
    'Game.goHome();' +
    'return { malformedQuizInputs: inputs.length, malformedRaceInputs: inputs.length, sudokuInvalidInputAttempts: 81, repeatedShapeActions: 100, repeatedSlabActions: 100 };' +
  '})()');

  if (!malformedInputResult) throw new Error('Malformed-input stress did not complete.');

  await cdp('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });

  const generatorResult = await evaluate('(async () => {' +
    'const assert = (condition, message) => { if (!condition) throw new Error(message); };' +
    'const questionStats = {};' +
    'for (const level of ["easy","medium","hard"]) {' +
      'const counts = new Map();' +
      'for (let i = 0; i < 40; i++) {' +
        'const q = QuestionBank.generate(level);' +
        'assert(q && typeof q.text === "string" && q.text.trim(), "Generated question has no usable text: " + level);' +
        'assert(Number.isFinite(q.answer), "Generated question has a non-finite answer: " + level);' +
        'for (const n of (q.text.match(/\\d+(?:\\.\\d+)?/g) || []).map(Number)) {' +
          'assert(Number.isInteger(n) && n >= 1 && n <= 250, "Question contains an invalid numeric token: " + n);' +
          'const next = (counts.get(n) || 0) + 1;' +
          'assert(next <= 2, "A question number repeated more than twice in one generator pool: " + n);' +
          'counts.set(n, next);' +
        '}' +
      '}' +
      'questionStats[level] = { questions: 40, distinctNumbers: counts.size, maxUses: Math.max(...counts.values()) };' +
    '}' +
    'function sudokuCount(grid) {' +
      'const copy = grid.map(row => row.slice()); let found = 0;' +
      'function valid(r,c,n) {' +
        'for (let i=0;i<9;i++) if (copy[r][i]===n || copy[i][c]===n) return false;' +
        'const br=Math.floor(r/3)*3, bc=Math.floor(c/3)*3;' +
        'for(let rr=br;rr<br+3;rr++) for(let cc=bc;cc<bc+3;cc++) if(copy[rr][cc]===n) return false;' +
        'return true;' +
      '}' +
      'function solve() {' +
        'let br=-1,bc=-1;' +
        'outer: for(let r=0;r<9;r++) for(let c=0;c<9;c++) if(copy[r][c]===0){br=r;bc=c;break outer;}' +
        'if(br<0){found++;return found;}' +
        'for(let n=1;n<=9;n++){if(!valid(br,bc,n))continue;copy[br][bc]=n;solve();copy[br][bc]=0;if(found>1)return found;}' +
        'return found;' +
      '}' +
      'return solve();' +
    '}' +
    'const sudokuStats = {};' +
    'for (const level of ["easy","medium","hard"]) {' +
      'let previous = "";' +
      'for (let i=0;i<12;i++) {' +
        'Sudoku.newPuzzle(level);' +
        'const cells = [...document.querySelectorAll("#sudoku-grid .sudoku-cell")];' +
        'assert(cells.length === 81, "Sudoku grid is not 9x9.");' +
        'const grid = Array.from({length:9},(_,r)=>cells.slice(r*9,r*9+9).map(c => Number(c.textContent || 0)));' +
        'const givens = grid.map(row => row.slice());' +
        'for(let r=0;r<9;r++) for(let c=0;c<9;c++) assert(givens[r][c]>=0 && givens[r][c]<=9, "Sudoku contains an invalid cell.");' +
        'const signature = givens.map(row=>row.join("")).join("/");' +
        'assert(i===0 || signature !== previous, "Sudoku repeated the immediately previous puzzle: " + level);' +
        'previous = signature;' +
        'assert(sudokuCount(givens) === 1, "Sudoku puzzle is not uniquely solvable: " + level);' +
      '}' +
      'sudokuStats[level] = "12 unique solvable puzzles";' +
    '}' +
    'function hasSubset(values, target) {' +
      'const reachable = new Set([0]);' +
      'for (const value of values) for (const sum of [...reachable]) if (sum + value <= target) reachable.add(sum + value);' +
      'return reachable.has(target);' +
    '}' +
    'let previousSlabOrder = "";' +
    'for (let i=0;i<60;i++) {' +
      'SlabMath.newRound();' +
      'const target = Number(document.getElementById("slab-basket-number").textContent);' +
      'const values = [...document.querySelectorAll("#slab-tray .slab-tile")].map(el => Number(el.textContent));' +
      'assert(values.length > 0, "Slab Maths generated no tiles.");' +
      'assert(values.every(v => Number.isInteger(v) && v >= 1 && v <= 15), "Slab Maths generated a value outside 1–15.");' +
      'const counts = new Map(); values.forEach(v => counts.set(v,(counts.get(v)||0)+1));' +
      'assert(Math.max(...counts.values()) <= 2, "Slab Maths repeated a number more than twice.");' +
      'assert(hasSubset(values,target), "Slab Maths generated an unreachable target: " + target);' +
      'const order = values.join(",");' +
      'if (i > 0) assert(order !== previousSlabOrder, "Slab Maths repeated the exact tile order.");' +
      'previousSlabOrder = order;' +
    '}' +
    'let previousSlabSignature = "";' +
    'for (let i=0;i<120;i++) {' +
      'SlabMath.newRound();' +
      'const target = Number(document.getElementById("slab-basket-number").textContent);' +
      'const values = [...document.querySelectorAll("#slab-tray .slab-tile")].map(el => Number(el.textContent));' +
      'assert(target >= 36 && target <= 97, "Slab Maths generated a target outside the mathematically constructible range: " + target);' +
      'const signature = target + ":" + values.slice().sort((a,b)=>a-b).join(",");' +
      'assert(signature !== previousSlabSignature, "Slab Maths repeated the same target and tile multiset immediately.");' +
      'previousSlabSignature = signature;' +
    '}' +
    'const shapeStats = { levels: 0, pieces: 0, shapeTypes: new Set() };' +
    'assert(typeof ShapeArchitectCanvas !== "undefined", "Shape Architect canvas module is missing.");' +
    'const architectLevels = ShapeArchitect.getLevels();' +
    'assert(architectLevels.length === 100, "Shape Architect must contain exactly 100 levels.");' +
    'for (const level of architectLevels) {' +
      'assert(ShapeArchitectLevels.validate(level), "Shape Architect level " + level.number + " failed geometry validation.");' +
      'assert(ShapeArchitectSolver.hasExactSolution(level), "Shape Architect level " + level.number + " failed exact solution certification.");' +
      'assert(level.targetPieces.length === level.requiredCount, "Shape Architect level " + level.number + " has an inconsistent target count.");' +
      'assert(level.targetPieces.every(target => target.required), "Shape Architect target geometry contains a non-required piece.");' +
      'assert(level.targetPieces.every(target => level.pieces.find(piece => piece.id === target.id && piece.required)), "Shape Architect level " + level.number + " lost a target-piece id in the build set.");' +
      'assert(level.requiredCount >= 4, "Shape Architect level " + level.number + " needs at least four real geometric pieces.");' +
      'assert(level.pieces.length === level.requiredCount, "Shape Architect level " + level.number + " must contain only the required pieces.");' +
      'assert(level.pieces.every(piece => piece.required), "Shape Architect build canvas contains an extra piece.");' +
      'level.targetPieces.forEach(target => { assert(ShapeArchitectLibrary.SHAPES[target.shape], "Unknown Shape Architect target geometry: " + target.shape); assert(target.w > 0 && target.h > 0, "Shape Architect target has invalid dimensions."); });' +
      'level.pieces.forEach(piece => { assert(ShapeArchitectLibrary.SHAPES[piece.shape], "Unknown Shape Architect geometry: " + piece.shape); assert(piece.w > 0 && piece.h > 0, "Shape Architect piece has invalid dimensions."); shapeStats.shapeTypes.add(piece.shape); });' +
      'shapeStats.levels++; shapeStats.pieces += level.pieces.length;' +
    '}' +
    '["circle","square","rectangle","triangle","trapezium","oval","diamond"].forEach(shape => assert(shapeStats.shapeTypes.has(shape), "Shape Architect target pictures never generated geometry type: " + shape));' +
    'Game.startShapeArchitect();' +
    'await new Promise(r => setTimeout(r, 20));' +
    'const architectButtons = [...document.querySelectorAll("#architect-level-grid .architect-level-btn")];' +
    'assert(architectButtons.length === 100, "Shape Architect level selector failed to render all 100 level buttons.");' +
    'assert(architectButtons.every(button => getComputedStyle(button).display !== "none" && button.getBoundingClientRect().height >= 40), "Shape Architect level buttons are not visibly rendered.");' +
    'assert(architectButtons.length === 100, "Shape Architect level selector does not expose all 100 levels.");' +
    'assert(architectButtons.every(button => !button.disabled), "Shape Architect still locks levels behind sequential completion.");' +
    'ShapeArchitect.load(99);' +
    'await new Promise(r => setTimeout(r, 20));' +
    'assert(document.getElementById("architect-reference-canvas")?.getContext, "Shape Architect reference canvas is missing.");' +
    'assert(document.getElementById("architect-build-canvas")?.getContext, "Shape Architect build canvas is missing.");' +
    'const silhouetteGuide = ShapeArchitectCanvas.silhouetteSegments(ShapeArchitect.getLevels()[99]);' +
    'assert(Array.isArray(silhouetteGuide) && silhouetteGuide.length > 0, "Shape Architect full-figure silhouette guide is missing.");' +
    'assert(silhouetteGuide.every(segment => segment.length === 4 && segment.every(Number.isFinite)), "Shape Architect silhouette guide contains invalid boundary segments.");' +
    'const exactMatch = ShapeArchitect.getLevels()[99];' +
    'const visualSolved = ShapeArchitectCanvas.visualMatch(exactMatch, exactMatch.targetPieces.map(piece => ({...piece})));' +
    'assert(visualSolved.complete, "Shape Architect exact target placement does not pass visual completion.");' +
    'assert(visualSolved.unionCoverage >= 0.99, "Shape Architect exact target placement does not fully cover the target silhouette.");' +
    'const visiblyShifted = exactMatch.targetPieces.map(piece => ({...piece, x: piece.x + 0.08}));' +
    'const visualShifted = ShapeArchitectCanvas.visualMatch(exactMatch, visiblyShifted);' +
    'assert(!visualShifted.complete, "Shape Architect accepted a visibly shifted figure.");' +
    'assert(!document.getElementById("architect-tray"), "Shape Architect piece tray should not be rendered.");' +
    'assert(ShapeArchitect.getLevels()[99].pieces.length === ShapeArchitect.getLevels()[99].requiredCount, "Shape Architect level-100 build set contains an extra piece.");' +
    'assert(Number(document.getElementById("architect-placed").textContent.split("/")[0]) < ShapeArchitect.getLevels()[99].requiredCount, "Shape Architect incorrectly starts with pieces counted as placed.");' +
    'assert(Math.abs(ShapeArchitect.getLevels()[99].rotationStep - Math.PI / 4) < 1e-9, "Shape Architect rotation step is not 45 degrees.");' +
    'assert(ShapeArchitect.getLevels()[99].tolerance.positionMin >= 0.11 && ShapeArchitect.getLevels()[99].tolerance.positionMax <= 0.23, "Shape Architect dynamic position tolerance bounds are invalid.");' +
    'assert(ShapeArchitect.getLevels()[99].tolerance.positionScale >= 0.55, "Shape Architect size-scaled tolerance is too rigid.");' +
    'const targetForTolerance = ShapeArchitect.getLevels()[99].targetPieces.find(piece => piece.w >= 0.2) || ShapeArchitect.getLevels()[99].targetPieces[0];' +
    'const toleranceConfig = ShapeArchitect.getLevels()[99].tolerance;' +
    'const dynamicTolerance = Math.max(toleranceConfig.positionMin, Math.min(toleranceConfig.positionMax, Math.hypot(targetForTolerance.w, targetForTolerance.h) * toleranceConfig.positionScale));' +
    'assert(dynamicTolerance >= toleranceConfig.positionMin && dynamicTolerance <= toleranceConfig.positionMax, "Shape Architect dynamic tolerance is outside its configured bounds.");' +
    'assert(ShapeArchitect.isNearTarget({...targetForTolerance, x: targetForTolerance.x + dynamicTolerance * 0.8}, targetForTolerance), "A visually close Shape Architect piece was rejected.");' +
    'assert(!ShapeArchitect.isNearTarget({...targetForTolerance, x: targetForTolerance.x + dynamicTolerance * 1.25}, targetForTolerance), "A clearly displaced Shape Architect piece was accepted.");' +
    'assert(ShapeArchitect.isNearTarget({...targetForTolerance, rotation: targetForTolerance.rotation + 0.12}, targetForTolerance), "A small visual rotation difference was rejected.");' +
    'assert(!ShapeArchitect.isNearTarget({...targetForTolerance, rotation: targetForTolerance.rotation + 1.0}, targetForTolerance), "A large rotation difference was accepted.");' +

    'const architectControls = [...document.querySelectorAll(".architect-controls button")].map(button => button.textContent);' +
    '["Rotate","Undo","Hint","Restart","All levels"].forEach(label => assert(architectControls.some(text => text.includes(label)), "Shape Architect control is missing: " + label));' +
    'document.getElementById("architect-build-canvas").focus();' +
    'return { levels: shapeStats.levels, pieces: shapeStats.pieces, geometryTypes: shapeStats.shapeTypes.size, allLevelsOpen: architectButtons.every(button => !button.disabled) };' +
    'const accessibility = {};' +
    'document.documentElement.style.setProperty("--font-scale", "1.5");' +
    'for (const key of ["quiz","race","sudoku","shape","slab","architect"]) {' +
      'Game.goHome();' +
      'const start = { quiz: Game.startArithmetic, race: Game.startRacing, sudoku: Game.startSudoku, shape: Game.startShapePuzzle, slab: Game.startSlabMath, architect: Game.startShapeArchitect }[key];' +
      'start();' +
      'await new Promise(r => setTimeout(r, 20));' +
      'accessibility[key] = document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2;' +
      'assert(accessibility[key], "Horizontal overflow at large text size in " + key);' +
    '}' +
    'Game.startSudoku();' +
    'Sudoku.newPuzzle("easy");' +
    'await new Promise(r => setTimeout(r, 20));' +
    'const sudokuGrid = document.getElementById("sudoku-grid");' +
    'const sudokuWidth = sudokuGrid.getBoundingClientRect().width;' +
    'assert(sudokuWidth >= 630 && sudokuWidth <= 650, "Sudoku desktop board is not large enough for comfortable use.");' +
    'const sudokuTopRow = document.querySelector("#screen-sudoku .sudoku-top-row");' +
    'assert(sudokuTopRow && Math.abs(sudokuTopRow.getBoundingClientRect().left - sudokuGrid.getBoundingClientRect().left) <= 2, "Sudoku top row and board are not aligned in column one.");' +
    'const desktopControls = document.querySelector(".sudoku-controls");' +
    'assert(desktopControls.getBoundingClientRect().left > sudokuGrid.getBoundingClientRect().right - 10, "Sudoku desktop controls are not beside the board.");' +
    'const sudokuKeypad = document.getElementById("sudoku-keypad");' +
    'const sudokuSideColumn = document.querySelector("#screen-sudoku .sudoku-side-column");' +
    'assert(desktopControls && sudokuKeypad && sudokuSideColumn, "Sudoku side column controls are missing.");' +
    'assert(sudokuSideColumn.contains(sudokuKeypad) && sudokuSideColumn.contains(desktopControls), "Sudoku keypad and actions are not grouped in the side column.");' +
    'assert(Math.abs(sudokuSideColumn.getBoundingClientRect().left - desktopControls.getBoundingClientRect().left) <= 2, "Sudoku side column is not aligned with its controls.");' +'assert(Math.abs(sudokuSideColumn.getBoundingClientRect().top - sudokuGrid.getBoundingClientRect().top) <= 2, "Sudoku keypad column is not aligned with the board top.");' +
    'const sudokuBoardToKeypadGap = sudokuKeypad.getBoundingClientRect().left - sudokuGrid.getBoundingClientRect().right;' +
    'assert(sudokuBoardToKeypadGap >= 0 && sudokuBoardToKeypadGap <= 24, "Sudoku board-to-keypad gap is too large.");' +
    'assert(sudokuKeypad.getBoundingClientRect().bottom <= desktopControls.getBoundingClientRect().top + 2, "Sudoku keypad overlaps the action controls.");' +
    'const sudokuAction = document.querySelector("#screen-sudoku .sudoku-controls .btn-sudoku");' +
    'assert(sudokuAction && sudokuAction.getBoundingClientRect().height <= 52, "Sudoku action buttons are oversized.");' +
     'const sudokuKey = document.querySelector("#screen-sudoku .btn-key");' +
     'assert(sudokuKey && sudokuKey.getBoundingClientRect().width >= 70 && sudokuKey.getBoundingClientRect().height >= 54, "Sudoku keypad targets are too small for comfortable use.");' +
     'const sudokuCell = document.querySelector("#screen-sudoku .sudoku-cell");' +
      'const sudokuCellFont = Number.parseFloat(getComputedStyle(sudokuCell).fontSize);' +
      'assert(sudokuCell && sudokuCellFont >= 20, "Sudoku cell numbers are too small for comfortable reading.");' +
      'const sudokuKeyFont = Number.parseFloat(getComputedStyle(sudokuKey).fontSize);' +
      'assert(sudokuKeyFont >= 20, "Sudoku keypad numbers are too small for comfortable reading.");' +
      'assert(sudokuSideColumn.getBoundingClientRect().width >= 250 && sudokuSideColumn.getBoundingClientRect().width <= 270, "Sudoku side column width is outside the intended comfortable range.");' +
    'assert(getComputedStyle(document.querySelector("#screen-sudoku .play-panel")).gridTemplateColumns !== "none", "Sudoku board/control split layout is missing.");' +
    'assert(getComputedStyle(document.documentElement).overflowY === "auto", "Vertical page scrolling is not available.");' +
    'assert(getComputedStyle(document.querySelector(".screen.active")).overflowY !== "hidden", "Active game screen is clipping vertical content.");' +
    'Game.startShapePuzzle();' +
     'const levelButton = document.querySelector(".btn-level");' +
     'assert(levelButton && levelButton.getBoundingClientRect().width >= 60, "Shape level buttons are too small for visibility.");' +
     'assert(levelButton && levelButton.getBoundingClientRect().height >= 60, "Shape level buttons are too small for visibility.");' +
     'ShapePuzzle.loadLevel(0);' +
     'await new Promise(r => setTimeout(r, 20));' +
     'const shapePiece = document.querySelector("#screen-shape .shape-piece");' +
     'const miniCell = document.querySelector("#screen-shape .piece-mini-cell:not(.empty-mini)");' +
     'const pieceLabel = document.querySelector("#screen-shape .piece-label");' +
     'assert(shapePiece && shapePiece.getBoundingClientRect().height >= 90, "Shape Fitting piece cards are too small for physical visibility.");' +
     'assert(miniCell && miniCell.getBoundingClientRect().width >= 14 && miniCell.getBoundingClientRect().height >= 14, "Shape Fitting mini-piece cells are too small for visibility.");' +
     'assert(pieceLabel && Number.parseFloat(getComputedStyle(pieceLabel).fontSize) >= 12, "Shape Fitting piece labels are too small.");' +
     'document.documentElement.style.setProperty("--font-scale", "1");' +
    'return { questionStats, sudokuStats, slabRounds: 180, shapeStats, accessibility };' +
  '})()');

  if (!generatorResult) throw new Error('Generator and accessibility audit did not complete.');

  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  const mobileLayoutResult = await evaluate('(() => {' +
    'const assert = (condition, message) => { if (!condition) throw new Error(message); };' +
    'Game.startSudoku();' +
    'Sudoku.newPuzzle("easy");' +
    'const mobilePanel = document.querySelector("#screen-sudoku .play-panel");' +
    'const sudokuGrid = document.getElementById("sudoku-grid");' +
    'const sudokuControls = document.querySelector("#screen-sudoku .sudoku-controls");' +
    'const sudokuKeypad = document.getElementById("sudoku-keypad");' +
    'assert(mobilePanel && mobilePanel.getBoundingClientRect().width <= 358, "Sudoku mobile panel exceeds the viewport.");' +
    'assert(sudokuGrid && sudokuControls && sudokuControls.getBoundingClientRect().top > sudokuGrid.getBoundingClientRect().bottom - 10, "Sudoku mobile controls did not move below the board.");' +
    'assert(sudokuKeypad && sudokuKeypad.getBoundingClientRect().top > sudokuGrid.getBoundingClientRect().bottom - 10, "Sudoku mobile keypad did not move below the board.");' +
    'assert(document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2, "Mobile layout has horizontal overflow.");' +
    'return { width: mobilePanel.getBoundingClientRect().width, horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };' +
  '})()');
  await cdp('Emulation.clearDeviceMetricsOverride');
  if (!mobileLayoutResult) throw new Error('Mobile responsive layout audit did not complete.');

  const concurrencyResult = await evaluate('(async () => {' +
    'const assert = (condition, message) => { if (!condition) throw new Error(message); };' +
    'const generated = await Promise.all(Array.from({length: 90}, (_, i) => Promise.resolve().then(() => QuestionBank.generate(["easy","medium","hard"][i % 3]))));' +
    'assert(generated.length === 90, "Concurrent question generation returned the wrong count.");' +
    'assert(generated.every(q => q && Number.isFinite(q.answer) && typeof q.text === "string"), "Concurrent question generation returned an invalid question.");' +
    'const slabRounds = await Promise.all(Array.from({length: 30}, () => Promise.resolve().then(() => { SlabMath.newRound(); return Number(document.getElementById("slab-basket-number").textContent); })));' +
    'assert(slabRounds.length === 30 && slabRounds.every(Number.isFinite), "Concurrent Slab Maths generation failed.");' +
    'const rapidStarts = [["quiz", "screen-quiz", Game.startArithmetic], ["race", "screen-race", Game.startRacing], ["sudoku", "screen-sudoku", Game.startSudoku], ["shape", "screen-shape", Game.startShapePuzzle], ["slab", "screen-slab", Game.startSlabMath]];' +
    'for (const [key, screenId, start] of rapidStarts) { Game.goHome(); start(); assert(document.getElementById(screenId)?.classList.contains("active"), "Rapid start did not activate " + key + "."); }' +
    'assert(document.querySelector(".screen.active")?.id === "screen-slab", "Rapid game starts did not leave the last requested game active.");' +
    'Game.startShapePuzzle();' +
    'const shapeTimerBeforeSwitch = document.getElementById("shape-timer")?.textContent;' +
    'Game.startArithmetic();' +
    'await new Promise(r => setTimeout(r, 1200));' +
    'assert(document.getElementById("shape-timer")?.textContent === shapeTimerBeforeSwitch, "Shape timer continued running after leaving Shape Fitting.");' +
    'Game.startRacing();' +
    'Racing.start();' +
    'document.getElementById("race-input").value = "0";' +
    'Racing.submit();' +
    'Racing.back();' +
    'await new Promise(r => setTimeout(r, 260));' +
    'assert(document.getElementById("race-setup-panel")?.classList.contains("hidden") === false, "Racing did not remain on setup after immediate back.");' +
    'assert(document.getElementById("race-play-panel")?.classList.contains("hidden") === true, "A stale Racing callback modified the play panel after back.");' +
    'Game.goHome();' +
    'return { concurrentQuestions: generated.length, concurrentSlabRounds: slabRounds.length, rapidStarts: rapidStarts.length, staleTimerChecks: 2 };' +
  '})()');

  if (!concurrencyResult) throw new Error('Concurrency audit did not complete.');

  const gameResult = await evaluate('(async () => {' +
    'const assert = (condition, message) => { if (!condition) throw new Error(message); };' +
    'ResearchConsent.set("yes");' +
    'Game.startArithmetic();' +
    'assert(document.getElementById("screen-quiz").classList.contains("active"), "Arithmetic screen did not open.");' +
    'for (let i = 0; i < 300; i++) { document.getElementById("quiz-input").value = "999999"; Quiz.submit(); Quiz.next(); }' +
    'Game.startRacing();' +
    'assert(document.getElementById("screen-race").classList.contains("active"), "Racing screen did not open.");' +
    'for (let round = 0; round < 20; round++) { Racing.start(); for (let i = 0; i < 30; i++) { document.getElementById("race-input").value = "999999"; Racing.submit(); } Racing.back(); }' +
    'Game.startSudoku();' +
    'assert(document.getElementById("screen-sudoku").classList.contains("active"), "Sudoku screen did not open.");' +
    'for (let i = 0; i < 100; i++) { Sudoku.newPuzzle(); Sudoku.giveHint(); }' +
    'Game.startShapePuzzle();' +
    'assert(document.getElementById("screen-shape").classList.contains("active"), "Shape screen did not open.");' +
    'for (let i = 0; i < 100; i++) { ShapePuzzle.restartLevel(); ShapePuzzle.showHint(); ShapePuzzle.rotateSelected(); }' +
    'Game.startSlabMath();' +
    'assert(document.getElementById("screen-slab").classList.contains("active"), "Slab Maths screen did not open.");' +
    'for (let i = 0; i < 100; i++) { SlabMath.restartRound(); SlabMath.hint(); SlabMath.newRound(); }' +
    'Game.goHome();' +
    'assert(document.getElementById("screen-menu").classList.contains("active"), "Home screen did not return after stress run.");' +
    'return { quizQuestions: document.getElementById("quiz-q-number")?.textContent, sudokuCells: document.querySelectorAll("#sudoku-grid .sudoku-cell").length, shapeCells: document.querySelectorAll("#shape-board .sp-cell").length };' +
  '})()');

  await sleep(500);
  const unexpectedResourceErrors = failedResources.filter(item => item.status !== 404 || !item.url.includes('/api/'));
  if (unexpectedResourceErrors.length) throw new Error('Browser resource errors detected:\n' + unexpectedResourceErrors.map(item => item.status + ' ' + item.url).join('\n'));
  if (errors.length) throw new Error('Browser runtime/console errors detected:\n' + [...new Set(errors)].join('\n'));

  if (serverErrors.length) throw new Error('Server emitted output during a successful test run:\n' + serverErrors.join('\n'));
  if (processErrors.length) throw new Error('Test process captured uncaught failures:\n' + processErrors.join('\n'));

  console.log(JSON.stringify({ status: 'PASS', baseline, httpAudit, malformedInputs: malformedInputResult, generators: generatorResult, concurrency: concurrencyResult, games: gameResult, browserErrors: 0, serverErrors: 0, processErrors: 0 }, null, 2));
}

try {
  await main();
} catch (error) {
  console.error(JSON.stringify({
    status: 'FAIL',
    error: error?.stack || error?.message || String(error),
    browserErrors: [...new Set(errors)],
    failedResources,
    serverErrors,
    processErrors
  }, null, 2));
  process.exitCode = 1;
} finally {
  if (socket && socket.readyState === WebSocket.OPEN) socket.close();
  if (browser) browser.kill('SIGTERM');
  if (server) server.kill('SIGTERM');
  if (server && server.exitCode === null) server.kill('SIGKILL');
}