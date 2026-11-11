import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { calculateGlobalPoints, normalizeScore, MAX_GLOBAL_POINTS } from "../src/leaderboard/scoring.js";
import { validateAttempt } from "../src/leaderboard/validation.js";

test("health endpoint reports the D1-backed service", async () => {
  const DB = { prepare(sql) { return { first: async () => ({count:0}) }; } };
  const response = await worker.fetch(new Request("https://api.example.test/health"), { DB });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.database, "connected");
  assert.equal(body.features.accounts, true);
  assert.equal(body.features.leaderboards, true);
});

test("missing D1 binding fails safely", async () => {
  const response = await worker.fetch(new Request("https://api.example.test/api/auth/me"), {});
  assert.equal(response.status, 500);
});

test("CORS allows only the configured exact origin and credentials", async () => {
  const env = { ALLOWED_ORIGIN: "https://04pranab.github.io", DB: {prepare(){return {first:async()=>({count:0})}}} };
  const allowed = await worker.fetch(new Request("https://api.example.test/health", {headers:{Origin:env.ALLOWED_ORIGIN}}), env);
  assert.equal(allowed.headers.get("Access-Control-Allow-Origin"), env.ALLOWED_ORIGIN);
  assert.equal(allowed.headers.get("Access-Control-Allow-Credentials"), "true");
  const denied = await worker.fetch(new Request("https://api.example.test/health", {headers:{Origin:"https://attacker.example"}}), env);
  assert.equal(denied.headers.get("Access-Control-Allow-Origin"), null);
});

test("score normalization and global cap", () => {
  assert.equal(normalizeScore(0), 0);
  assert.equal(normalizeScore(84.4), 844);
  assert.equal(normalizeScore(100), 1000);
  assert.throws(() => normalizeScore(101), RangeError);
  assert.equal(calculateGlobalPoints({"arithmetic-quiz":800,"number-maze":900}),1700);
  assert.equal(MAX_GLOBAL_POINTS,9000);
});

test("attempt validation accepts only active games and valid unique IDs", () => {
  assert.equal(validateAttempt({gameId:"math-court",scorePercent:90,durationSeconds:60,attemptId:"attempt_123456"}).ok,false);
  assert.equal(validateAttempt({gameId:"number-maze",scorePercent:90,durationSeconds:60,attemptId:"x"}).ok,false);
  assert.equal(validateAttempt({gameId:"number-maze",scorePercent:92.5,durationSeconds:240,attemptId:"maze_attempt_12345"}).value.points,925);
});
