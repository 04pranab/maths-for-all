import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { calculateGlobalPoints, normalizeScore, MAX_GLOBAL_POINTS } from "../src/leaderboard/scoring.js";
import { validateAttempt } from "../src/leaderboard/validation.js";

test("health endpoint reports database is intentionally not configured", async () => {
  const response = await worker.fetch(new Request("https://api.example.test/health"), {});
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.database, "not-configured");
  assert.equal(body.features.accounts, false);
  assert.equal(body.features.leaderboards, false);
});

test("API endpoints fail closed until a database adapter is selected", async () => {
  const response = await worker.fetch(new Request("https://api.example.test/api/auth/me"), {});
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, "not_configured");
});

test("CORS allows only the configured exact origin", async () => {
  const env = { ALLOWED_ORIGIN: "https://04pranab.github.io" };
  const allowed = await worker.fetch(new Request("https://api.example.test/health", {
    headers: { Origin: env.ALLOWED_ORIGIN },
  }), env);
  assert.equal(allowed.headers.get("Access-Control-Allow-Origin"), env.ALLOWED_ORIGIN);

  const denied = await worker.fetch(new Request("https://api.example.test/health", {
    headers: { Origin: "https://attacker.example" },
  }), env);
  assert.equal(denied.headers.get("Access-Control-Allow-Origin"), null);
});

test("score normalization maps percentage to 0–1000", () => {
  assert.equal(normalizeScore(0), 0);
  assert.equal(normalizeScore(84.4), 844);
  assert.equal(normalizeScore(100), 1000);
  assert.throws(() => normalizeScore(101), RangeError);
});

test("global points sum only the nine active games", () => {
  assert.equal(calculateGlobalPoints({ "arithmetic-quiz": 800, "number-maze": 900 }), 1700);
  assert.equal(calculateGlobalPoints({}), 0);
  assert.equal(MAX_GLOBAL_POINTS, 9000);
});

test("attempt validation rejects inactive games and malformed attempts", () => {
  assert.equal(validateAttempt({
    gameId: "math-court", scorePercent: 90, durationSeconds: 60, attemptId: "attempt_123456",
  }).ok, false);
  assert.equal(validateAttempt({
    gameId: "number-maze", scorePercent: 90, durationSeconds: 60, attemptId: "x",
  }).ok, false);
});

test("attempt validation accepts a bounded active-game result", () => {
  const result = validateAttempt({
    gameId: "number-maze",
    scorePercent: 92.5,
    durationSeconds: 240,
    attemptId: "maze_attempt_12345",
  });
  assert.equal(result.ok, true);
  assert.equal(result.value.points, 925);
});
