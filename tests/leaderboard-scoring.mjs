import test from "node:test";
import assert from "node:assert/strict";
import { GAME_RULES, MAX_GLOBAL_POINTS, calculateAttemptPoints } from "../cloudflare/worker/src/leaderboard/scoring.js";
import { validateAttempt } from "../cloudflare/worker/src/leaderboard/validation.js";

test("hard Sudoku is worth substantially more than an easy arithmetic clear", () => {
  const easyArithmetic = calculateAttemptPoints({gameId:"arithmetic-quiz",scorePercent:100,difficulty:"easy"});
  const hardSudoku = calculateAttemptPoints({gameId:"sudoku",scorePercent:100,difficulty:"hard"});
  assert.ok(hardSudoku > easyArithmetic * 4);
  assert.equal(hardSudoku, GAME_RULES.sudoku.maximum);
});

test("difficulty, level progression, hints and mistakes affect awards", () => {
  const base = calculateAttemptPoints({gameId:"sudoku",scorePercent:100,difficulty:"medium",level:1});
  const advanced = calculateAttemptPoints({gameId:"sudoku",scorePercent:100,difficulty:"hard",level:20});
  const assisted = calculateAttemptPoints({gameId:"sudoku",scorePercent:100,difficulty:"hard",level:20,hintsUsed:3,mistakes:4});
  assert.ok(advanced > base);
  assert.ok(assisted < advanced);
});

test("all games have distinct documented point budgets and global cap", () => {
  assert.equal(Object.keys(GAME_RULES).length, 10);
  assert.equal(MAX_GLOBAL_POINTS, Object.values(GAME_RULES).reduce((sum, rule) => sum + rule.maximum, 0));
  assert.ok(GAME_RULES.sudoku.maximum > GAME_RULES["arithmetic-quiz"].maximum);
});

test("attempt validation requires a plausible duration and bounds metadata", () => {
  const invalid = validateAttempt({gameId:"sudoku",attemptId:"attempt_123456789",scorePercent:100,durationSeconds:1,difficulty:"hard"});
  assert.equal(invalid.ok, false);
  const valid = validateAttempt({gameId:"sudoku",attemptId:"attempt_123456789",scorePercent:100,durationSeconds:300,difficulty:"hard",level:9,hintsUsed:1});
  assert.equal(valid.ok, true);
  assert.ok(valid.value.points > 0 && valid.value.points < 350);
});
