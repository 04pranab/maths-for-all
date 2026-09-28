import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../js/research-gateway.js', import.meta.url), 'utf8');

let allowed = false;
const storage = new Map();

const context = {
  localStorage: {
    getItem: key => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key)
  },
  ResearchConsent: {
    isAllowed: () => allowed
  },
  Date,
  JSON,
  Array,
  Object,
  Number,
  String,
  Boolean,
  console
};

vm.createContext(context);
vm.runInContext(source, context);

const gateway = context.ResearchEventGateway;
assert.ok(gateway);

assert.equal(gateway.record('quiz', 'open', {}), false);
assert.deepEqual(gateway.read(), []);

allowed = true;

assert.equal(gateway.record('quiz', 'answer', { correct: true, timeMs: 1200 }), true);
assert.equal(gateway.read().length, 1);

const stored = JSON.parse(storage.get('mfa_analytics_v1'));
assert.equal(stored.length, 1);
assert.equal(stored[0].category, 'quiz');

assert.equal(gateway.record('', 'answer', {}), false);
assert.equal(gateway.record('quiz', '', {}), false);
assert.equal(gateway.record('quiz', 'answer', []), false);

allowed = false;
gateway.clear();

assert.equal(storage.has('mfa_analytics_v1'), false);
assert.deepEqual(gateway.read(), []);

console.log(JSON.stringify({ status: 'PASS', checks: 8 }));
