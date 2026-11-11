import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../js/research-gateway.js", import.meta.url), "utf8");
const consentSource = fs.readFileSync(new URL("../js/consent.js", import.meta.url), "utf8");
const storage = new Map();
const context = {
  localStorage: {
    getItem: key => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  },
  ResearchConsent: { isAllowed: () => true },
  fetch: async () => { throw new Error("Research network calls must never happen."); },
  Date, JSON, Array, Object, Number, String, Boolean, console,
};
vm.createContext(context);
vm.runInContext(source + "\nglobalThis.__gateway = ResearchEventGateway;", context);
const gateway = context.__gateway;

assert.ok(gateway);
assert.equal(gateway.record("quiz", "game_opened", {}), false);
assert.equal(gateway.record("sudoku", "puzzle_solved", { correct: true }), false);
assert.equal(gateway.read().length, 0);
assert.equal(storage.has("mfa_analytics_v1"), false);
assert.equal(await gateway.flush(), false);
gateway.clear();
assert.equal(storage.has("mfa_analytics_v1"), false);

// The actual consent controller must not expose an opt-in path in this release.
assert.match(consentSource, /const isAllowed\s*=\s*\(\)\s*=>\s*false/);
assert.match(consentSource, /Research collection: off/);

console.log(JSON.stringify({ status: "PASS", checks: 9 }));
