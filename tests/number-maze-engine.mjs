import assert from 'node:assert/strict';

await import('../js/number-maze-engine.js');
const engine = globalThis.NumberMazeEngine;
assert.ok(engine, 'Number Maze engine should load in Node.');
assert.deepEqual(Object.keys(engine.DIFFICULTIES), ['gentle', 'steady', 'stretch']);

for (const difficulty of Object.keys(engine.DIFFICULTIES)) {
  for (const seed of [1, 17, 20261018]) {
    const puzzle = engine.generate(seed, difficulty);
    assert.equal(puzzle.seed, seed, 'Seed should be retained.');
    assert.equal(puzzle.difficulty, difficulty);
    assert.ok(engine.validate(puzzle), difficulty + ' seed ' + seed + ' should be valid and have one solution.');
    assert.equal(puzzle.solution.length, puzzle.openCells.length, 'Solution must fill every open square.');
    assert.equal(new Set(puzzle.solution).size, puzzle.solution.length, 'Solution cannot revisit a square.');
    assert.deepEqual(puzzle.openCells.slice().sort((a, b) => a - b), puzzle.solution.slice().sort((a, b) => a - b), 'Every open square must appear in the solution.');
    assert.equal(puzzle.checkpoints[0].cell, puzzle.start);
    assert.equal(puzzle.checkpoints[puzzle.checkpoints.length - 1].cell, puzzle.end);
    for (let i = 1; i < puzzle.solution.length; i++) {
      assert.ok(engine.neighbours(puzzle.solution[i - 1], puzzle.size).includes(puzzle.solution[i]), 'Every step must be orthogonally adjacent.');
    }
    const result = engine.countSolutions(puzzle, 2, 30000);
    assert.equal(result.exhaustive, true, 'Uniqueness check must finish within the bound.');
    assert.equal(result.count, 1, 'Every published board must have exactly one valid solution.');
    assert.deepEqual(engine.generate(seed, difficulty), puzzle, 'The same seed must reproduce the same board.');
  }
}

const tutorialSeeds = [0x4D415A45, 0x4D415A46, 0x4D415A47];
const tutorialBoards = tutorialSeeds.map(seed => engine.generate(seed, 'gentle'));
for (const board of tutorialBoards) {
  assert.ok(engine.validate(board), 'Every guided starter should be solvable and unique.');
  assert.equal(board.difficulty, 'gentle');
}
assert.equal(new Set(tutorialBoards.map(board => JSON.stringify(board.solution))).size, 3, 'Guided starters should use distinct routes.');

const invalid = engine.generate(91, 'gentle');
invalid.checkpoints = invalid.checkpoints.slice(1);
assert.equal(engine.countSolutions(invalid, 2, 1000).count, 0, 'A board without checkpoint 1 must be rejected.');
assert.equal(engine.hashSeed('daily-2026-10-18'), engine.hashSeed('daily-2026-10-18'), 'Daily seed hashing must be stable.');
assert.notEqual(engine.hashSeed('daily-2026-10-18'), engine.hashSeed('daily-2026-10-19'), 'Different dates should produce different daily seeds.');

console.log('Number Maze engine tests passed: nine seeded puzzles, deterministic generation, path integrity, checkpoint order, and solution uniqueness.');
