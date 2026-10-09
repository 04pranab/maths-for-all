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
    'const required = ["screen-menu","screen-quiz","screen-race","screen-sudoku","screen-shape","screen-slab","screen-architect","screen-fraction-bakery","auth-modal","research-consent-modal","progress-modal","account-profile-modal"];' +
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
    'const cases = [["screen-quiz","quiz","How to play: Arithmetic Quiz"],["screen-race","race","How to play: Math Racing"],["screen-sudoku","sudoku","How to play: Sudoku Challenge"],["screen-shape","shape","How to play: Shape Fitting"],["screen-slab","slab","How to play: Slab Maths"],["screen-architect","architect","How to play: Shape Architect"],["screen-fraction-bakery","fraction","How to play: Fraction Bakery"]];' +
    'for (const [screenId, key, title] of cases) {' +
      'Game.goHome();' +
      'const start = { quiz: Game.startArithmetic, race: Game.startRacing, sudoku: Game.startSudoku, shape: Game.startShapePuzzle, slab: Game.startSlabMath, architect: Game.startShapeArchitect, fraction: Game.startFractionBakery }[key];' +
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


  const probabilityResult = await evaluate(`(async () => {
    const assert = (condition, message) => { if (!condition) throw new Error(message); };
    Game.goHome();
    ProbabilityCarnival.open();
    assert(window.ProbabilityCarnivalStories.levels.length === 84, "Probability Carnival must define exactly 84 levels.");
    assert(!document.querySelector(".pc-stage-strip"), "Probability Machine should not render the old long stage-button strip.");
    assert(!document.querySelector(".pc-level-panel"), "Probability Machine should not render the old level side panel.");
    assert(!document.querySelector(".pc-footer-note"), "Probability Machine should not render the old instruction footer panel.");
    const machinePanel = document.querySelector("#screen-probability-carnival .pc-play-panel");
    assert(machinePanel && machinePanel.getBoundingClientRect().width >= window.innerWidth * 0.9, "Probability Machine main cabinet is not wide enough on desktop.");
    assert(document.getElementById("pc-level-range")?.textContent === "LEVEL 01 / 84", "Probability Machine level readout is not initialized.");
    assert(window.ProbabilityCarnivalStories.stages.length === 7, "Probability Carnival must define seven stages.");
    for (let stage = 1; stage <= 7; stage++) {
      const stageLevels = window.ProbabilityCarnivalStories.levels.filter(level => level.stage === stage);
      assert(stageLevels.length === 12, "Probability Carnival stage " + stage + " must contain twelve levels.");
      assert(stageLevels[0].id === (stage - 1) * 12 + 1 && stageLevels[11].id === stage * 12, "Probability Carnival stage boundaries are invalid.");
    }

    const completedLevels = () => document.querySelector(".pc-play-panel")?.dataset.completed === "true" ? 1 : 0;
    ProbabilityCarnival.selectLevel(1);
    assert(document.querySelector(".pc-wheel"), "Stage 1 must render the interactive chance wheel.");
    document.querySelector("#pc-choice-area .pc-choice[data-value='impossible']").click();
    document.querySelector("#pc-choice-area .pc-main-action").click();
    await new Promise(r => setTimeout(r, 800));
    assert(completedLevels() === 1, "Stage 1 representative level did not complete.");

    ProbabilityCarnival.selectLevel(13);
    document.querySelector(".pc-machine-choice").click();
    document.querySelector("#pc-choice-area .pc-choice[data-value='A']").click();
    document.querySelector("#pc-choice-area .pc-main-action").click();
    assert(completedLevels() === 1, "Stage 2 representative level did not complete.");

    ProbabilityCarnival.selectLevel(25);
    assert(document.querySelectorAll(".pc-build-token").length === 12, "Build levels must expose twelve editable token slots.");
    document.querySelector("#pc-choice-area .pc-main-action").click();
    assert(completedLevels() === 1, "Stage 3 representative level did not complete.");

    ProbabilityCarnival.selectLevel(37);
    document.querySelector("#pc-choice-area .pc-choice[data-value='sun']").click();
    document.querySelector("#pc-choice-area .pc-main-action").click();
    await new Promise(r => setTimeout(r, 100));
    assert(completedLevels() === 1, "Stage 4 representative experiment did not complete.");

    ProbabilityCarnival.selectLevel(49);
    document.querySelectorAll(".pc-sample-run")[2].click();
    document.querySelector("#pc-choice-area .pc-choice[data-value='surprising']").click();
    document.querySelector("#pc-choice-area .pc-main-action").click();
    assert(completedLevels() === 1, "Stage 5 representative level did not complete.");

    ProbabilityCarnival.selectLevel(61);
    document.querySelector("#pc-choice-area .pc-main-action").click();
    document.querySelector("#pc-choice-area .pc-choice[data-value='Fair']").click();
    document.querySelector("#pc-choice-area .pc-main-action").click();
    assert(completedLevels() === 1, "Stage 6 representative level did not complete.");

    for (let stage = 1; stage <= 7; stage++) {
      ProbabilityCarnival.selectStage(stage);
      assert(document.querySelector(".pc-play-panel")?.dataset.stage === String(stage), "Stage " + stage + " does not update the machine readout.");
    }
    ProbabilityCarnival.selectLevel(73);
    assert(document.querySelector(".pc-dice-lab"), "Dice Lab must render its experiment board.");
    assert(document.querySelectorAll(".pc-die").length === 1, "Dice Lab level 73 must render one die.");
    document.querySelector("#pc-choice-area .pc-choice[data-value='They are equally likely']").click();
    document.querySelector("#pc-choice-area .pc-main-action").click();
    await new Promise(r => setTimeout(r, 520));
    assert(completedLevels() === 1, "Dice Lab representative level did not complete.");
    assert(!document.getElementById("pc-next").disabled, "Next level remained disabled after a correct completion.");

    ProbabilityCarnival.selectLevel(76);
    assert(document.querySelectorAll(".pc-die").length === 2, "Dice Lab two-dice level must render two dice.");
    assert(document.querySelector("#pc-choice-area .pc-main-action"), "Dice Lab needs a test action.");
    Game.goHome();
    return { levels: 84, stages: 7, levelsPerStage: 12, representativeCompletions: 7, arcadeMechanics: 7 };
  })()`);

  if (!helpResult?.ok) throw new Error('Context-sensitive help and Escape overlay checks did not complete.');

  const fractionResult = await evaluate(`(async () => {
    const assert = (condition, message) => { if (!condition) throw new Error(message); };
    Game.goHome();
    FractionBakery.open();
    assert(FractionBakery.LEVELS === 100, "Fraction Bakery must define exactly 100 levels.");
    assert(FractionBakery.STAGES.length === 8, "Fraction Bakery must define eight stages.");
    assert(FractionBakery.STAGES[0].from === 1 && FractionBakery.STAGES[FractionBakery.STAGES.length - 1].to === 100, "Fraction Bakery stage range must cover all 100 levels.");
    assert(document.querySelector("#screen-fraction-bakery").classList.contains("active"), "Fraction Bakery screen did not open.");
    assert(document.querySelectorAll(".fb-dish").length >= 1, "Fraction Bakery must render an SVG dish.");
    assert(document.querySelector("#fb-level-grid"), "Fraction Bakery must render the 100-level map.");
    assert(document.querySelectorAll("#fb-level-grid .fb-level-button").length === 100, "Fraction Bakery must render all 100 level buttons.");
    assert(document.querySelector(".fb-main-grid .fb-level-picker"), "Fraction Bakery levels must use the side rail.");
    assert(!document.querySelector(".fb-count-readout")?.textContent.includes("portions selected"), "Fraction Bakery must not expose the selected-piece count.");
    assert(document.querySelector('[onclick*="FractionBakery.showHint"]'), "Fraction Bakery must provide a hint control.");
    const randomSignatures = new Set();
    for (let i = 0; i < 30; i++) {
      FractionBakery.resetLevel();
      randomSignatures.add(JSON.stringify(FractionBakery.__testChallenge));
    }
    assert(randomSignatures.size > 1, "Fraction Bakery did not randomize generated orders.");
    FractionBakery.__testSetLevel(30);
    assert(!document.querySelector('.fb-level-button[data-level="29"]')?.classList.contains("complete"), "Unsolved earlier levels must not become green when jumping ahead.");
    assert(!document.querySelector('.fb-level-button[data-level="30"]')?.classList.contains("complete"), "The selected unsolved level must not become green.");
    FractionBakery.__testSetLevel(13);
    assert(document.querySelectorAll(".fb-dish .fb-piece.is-selected").length > 0, "Fraction identification dish must visibly mark the generated fraction.");
    assert(!/[0-9]/.test(document.querySelector("#screen-fraction-bakery .fb-dish-wrap .fb-count-readout")?.textContent || ""), "Fraction identification must not print the numerator or denominator as the answer.");
    FractionBakery.__testSetLevel(1);
    if (FractionBakery.__testChallenge.dish === "pizza") assert(document.querySelector('.fb-pizza-toppings, .fb-dish.fb-pizza circle[fill="#b83e2f"]'), "Pizza must show visible toppings.");
    FractionBakery.__testSetLevel(25);
    assert(document.querySelectorAll(".fb-plates .fb-piece.is-selected").length > 0, "Fraction comparison plates must visibly mark their generated fractions.");
    const stages = [1,13,25,37,49,61,73,87];
    for (const level of stages) {
      FractionBakery.__testSetLevel(level);
      const c = FractionBakery.__testChallenge;
      assert(c && c.type, "Fraction Bakery stage " + level + " generated no challenge.");
      if (c.type === "build") assert(c.f.n >= 1 && c.f.n <= c.f.d && c.f.d >= 2, "Build fraction is invalid.");
      if (c.type === "compare") assert(c.a.n*c.b.d !== c.b.n*c.a.d, "Compare challenge generated equal fractions.");
      if (c.type === "equivalent") {
        assert(c.target.n*c.answer.d === c.answer.n*c.target.d, "Equivalent challenge is mathematically invalid.");
        assert(c.target.n > 0 && c.target.n < c.target.d && c.answer.n > 0 && c.answer.n < c.answer.d, "Dish-based equivalent fractions must both be proper fractions.");
        assert(c.target.n !== c.answer.n || c.target.d !== c.answer.d, "Equivalent challenge must show a genuinely different cut.");
        assert(c.options.some(f => f.n*c.answer.d === c.answer.n*f.d), "Equivalent challenge options omit the correct value.");
      }
      if (c.type === "mix" || c.type === "bake") {
        assert(c.answer.n > 0 && c.answer.d > 0, "Recipe result is invalid.");
        if (c.type === "mix") assert(c.answer.n < c.answer.d, "Mixing challenge should remain a proper fraction.");
        if (level >= 87 && c.type === "bake") assert(c.answer.n < 2*c.answer.d, "Grand Bake recipe result must remain below two whole dishes.");
      }
      if (c.type === "simplify") {
        const gcd = (a,b) => b ? gcd(b,a%b) : a;
        assert(c.target.n*c.answer.d === c.answer.n*c.target.d, "Simplify challenge is mathematically invalid.");
        assert(gcd(c.target.n,c.target.d) > 1, "Simplify challenge target is already in simplest form.");
        assert(gcd(c.answer.n,c.answer.d) === 1, "Simplify challenge answer is not in simplest form.");
        assert(c.target.n < c.target.d, "Simplify challenge target must be a proper fraction.");
      }
      if (c.type === "order") {
        assert(c.items.length === 3 && c.answer.split("|").length === 3, "Order challenge must contain three fractions.");
        const signatures = c.items.map(f => f.n + "/" + f.d);
        assert(new Set(signatures).size === 3, "Order challenge contains duplicate fractions.");
        const sorted = c.items.slice().sort((a,b) => a.n/a.d-b.n/b.d).map(f => f.n + "/" + f.d).join("|");
        assert(sorted === c.answer, "Order challenge answer is not strictly increasing.");
      }
      if (c.type === "missing") {
        assert(c.f.n > c.missing && c.missing >= 1 && c.f.d >= 4, "Missing-count challenge must have a positive gap and enough distinct choices.");
        assert(c.answer === c.f.n-c.missing, "Missing-count answer does not match the reduced fraction.");
        assert(c.options.length === 4 && new Set(c.options).size === 4 && c.options.includes(c.answer), "Missing-count options must be four distinct values including the answer.");
        assert(c.options.every(n => Number.isInteger(n) && n >= 1 && n <= c.f.d), "Missing-count options contain an invalid count.");
      }
      if (c.type === "difference") assert(c.answer.n >= 0 && c.answer.d > 0, "Difference challenge is invalid.");
      if (c.type === "mixed") assert(c.answer.n > c.answer.d, "Mixed-number challenge must produce an improper fraction.");
    }
    for (let pass = 0; pass < 12; pass++) {
      for (let level = 1; level <= 100; level++) {
        FractionBakery.__testSetLevel(level);
        const c = FractionBakery.__testChallenge;
        assert(c && c.type, "Fraction Bakery generated no challenge at level " + level + " pass " + pass + ".");
        if (c.type === "compare") assert(c.a.n*c.b.d !== c.b.n*c.a.d, "Repeated compare generation produced equal fractions at level " + level + ".");
        if (c.type === "order") {
          assert(new Set(c.items.map(f => f.n + "/" + f.d)).size === 3, "Repeated order generation produced duplicates at level " + level + ".");
          assert(c.items.slice().sort((a,b) => a.n/a.d-b.n/b.d).map(f => f.n + "/" + f.d).join("|") === c.answer, "Repeated order generation has an incorrect answer at level " + level + ".");
        }
        if (c.type === "missing") assert(c.f.n > c.missing && c.f.d >= 4 && c.answer === c.f.n-c.missing && c.options.length === 4 && new Set(c.options).size === 4 && c.options.includes(c.answer) && c.options.every(n => n >= 1 && n <= c.f.d), "Repeated missing-count generation is invalid at level " + level + ".");
        if (c.type === "simplify") {
          const gcd = (a,b) => b ? gcd(b,a%b) : a;
          assert(gcd(c.target.n,c.target.d)>1 && gcd(c.answer.n,c.answer.d)===1 && c.target.n*c.answer.d===c.answer.n*c.target.d, "Repeated simplification generation is invalid at level " + level + ".");
        }
        if (c.type === "equivalent") assert(c.target.n*c.answer.d===c.answer.n*c.target.d && (c.target.n!==c.answer.n || c.target.d!==c.answer.d) && c.target.n<c.target.d && c.answer.n<c.answer.d, "Repeated equivalent-fraction generation is invalid at level " + level + ".");
      }
    }
    FractionBakery.__testSetLevel(85);
    assert(FractionBakery.__testChallenge.type === "order", "Chef's Counter level 85 must render an order challenge.");
    const orderCards = [...document.querySelectorAll("#screen-fraction-bakery .fb-order-card")];
    assert(orderCards.length === 3, "Fraction Bakery order challenge must render exactly three order cards.");
    for (const card of orderCards) {
      const cardRect = card.getBoundingClientRect();
      const dish = card.querySelector(".fb-dish");
      assert(dish, "Fraction Bakery order card is missing its dish illustration.");
      const dishRect = dish.getBoundingClientRect();
      assert(dishRect.left >= cardRect.left - 2 && dishRect.right <= cardRect.right + 2 && dishRect.top >= cardRect.top - 2 && dishRect.bottom <= cardRect.bottom + 2, "Fraction Bakery order dish escapes its card boundary.");
      assert(getComputedStyle(card).overflow === "hidden", "Fraction Bakery order cards must contain oversized dish artwork.");
    }
    const titleRect = document.getElementById("fb-title").getBoundingClientRect();
    const promptRect = document.getElementById("fb-prompt").getBoundingClientRect();
    assert(promptRect.top <= titleRect.bottom + 2, "Fraction Bakery title and prompt have an unintended vertical gap.");

    const fractionLevels = [];
    for (let level = 1; level <= FractionBakery.LEVELS; level++) {
      FractionBakery.__testSetLevel(level);
      await new Promise(r => setTimeout(r, 0));
      const screen = document.getElementById("screen-fraction-bakery");
      const work = screen.querySelector(".fb-work");
      const workbench = screen.querySelector(".fb-workbench");
      assert(work && workbench, "Fraction Bakery level " + level + " is missing its work surface.");
      const viewportWidth = document.documentElement.clientWidth;
      assert(document.documentElement.scrollWidth <= viewportWidth + 2, "Fraction Bakery level " + level + " creates horizontal page overflow.");
      const workRect = work.getBoundingClientRect();
      const benchRect = workbench.getBoundingClientRect();
      assert(benchRect.left >= workRect.left - 2 && benchRect.right <= workRect.right + 2, "Fraction Bakery level " + level + " workbench escapes the main work area.");
      const visualSelectors = ".fb-dish,.fb-plate,.fb-order-card,.fb-equivalent-top,.fb-mixing-board,.fb-mixed-board,.fb-options,.fb-action";
      for (const node of screen.querySelectorAll(visualSelectors)) {
        const rect = node.getBoundingClientRect();
        assert(rect.left >= benchRect.left - 3 && rect.right <= benchRect.right + 3, "Fraction Bakery level " + level + " has a visual element escaping the workbench: " + node.className);
      }
      for (const card of screen.querySelectorAll(".fb-order-card")) {
        const cardRect = card.getBoundingClientRect();
        const dish = card.querySelector(".fb-dish");
        if (dish) {
          const dishRect = dish.getBoundingClientRect();
          assert(dishRect.left >= cardRect.left - 2 && dishRect.right <= cardRect.right + 2 && dishRect.top >= cardRect.top - 2 && dishRect.bottom <= cardRect.bottom + 2, "Fraction Bakery level " + level + " order dish escapes its card.");
        }
      }
      fractionLevels.push({level, type: FractionBakery.__testChallenge.type});
    }

    FractionBakery.__testSetLevel(1);
    const c = FractionBakery.__testChallenge;
    assert(c.f.d >= 5 && c.f.d <= 8, "Opening counting levels must preserve the generated denominator difficulty.");
    for (let i=0;i<c.f.n;i++) document.querySelector('.fb-piece[data-piece="'+i+'"]')?.dispatchEvent(new MouseEvent("click",{bubbles:true}));
    document.querySelector("#fb-serve")?.click();
    assert(document.querySelector("#fb-next").disabled === false, "Valid Fraction Bakery build was not accepted.");
    Game.goHome();
    return { levels:100, stages:8, randomizedOrders:randomSignatures.size };
  })()`);

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

  if (!fractionResult?.levels) throw new Error('Fraction Bakery validation did not complete.');

  const fractionResponsiveResults = [];
  for (const viewport of [{width:1366,height:768,mobile:false},{width:768,height:1024,mobile:true},{width:390,height:844,mobile:true}]) {
    await cdp('Emulation.setDeviceMetricsOverride', { ...viewport, deviceScaleFactor: 1 });
    const result = await evaluate('(async () => {' +
      'const assert = (condition, message) => { if (!condition) throw new Error(message); };' +
      'Game.goHome(); FractionBakery.open();' +
      'for (let level = 1; level <= 100; level++) {' +
        'FractionBakery.__testSetLevel(level);' +
        'const screen = document.getElementById("screen-fraction-bakery");' +
        'const work = screen.querySelector(".fb-work"), bench = screen.querySelector(".fb-workbench");' +
        'assert(document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2, "Fraction Bakery horizontal overflow at level " + level + " and viewport " + innerWidth + "px.");' +
        'const wr = work.getBoundingClientRect(), br = bench.getBoundingClientRect();' +
        'assert(br.left >= wr.left - 2 && br.right <= wr.right + 2, "Fraction Bakery workbench escapes work area at level " + level + " and viewport " + innerWidth + "px.");' +
        'for (const node of screen.querySelectorAll(".fb-dish,.fb-plate,.fb-order-card,.fb-equivalent-top,.fb-mixing-board,.fb-mixed-board,.fb-options,.fb-action")) {' +
          'const r = node.getBoundingClientRect();' +
          'assert(r.left >= br.left - 3 && r.right <= br.right + 3, "Fraction Bakery element escapes workbench at level " + level + " and viewport " + innerWidth + "px: " + node.className);' +
        '}' +
      '}' +
      'Game.goHome(); return { width: innerWidth, height: innerHeight, levels: 100, horizontalOverflow: false, workbenchContainment: true };' +
    '})()');
    fractionResponsiveResults.push(result);
  }

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

  console.log(JSON.stringify({ status: 'PASS', baseline, httpAudit, malformedInputs: malformedInputResult, fractionBakery: fractionResult, fractionBakeryResponsive: fractionResponsiveResults, generators: generatorResult, concurrency: concurrencyResult, games: gameResult, browserErrors: 0, serverErrors: 0, processErrors: 0 }, null, 2));
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