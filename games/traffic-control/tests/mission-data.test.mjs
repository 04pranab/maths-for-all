import assert from "node:assert/strict";
import { LEVELS } from "../missions.js";

const expectedDirections = {
  easy: ["north", "south"],
  medium: ["north", "south", "east", "west"],
  hard: ["north", "south", "east", "west"]
};
const vehicleKinds = new Set(["bike", "car", "truck"]);

for (const [level, config] of Object.entries(LEVELS)) {
  assert.equal(config.rounds.length, 50, `${level} must have exactly 50 challenges`);
  assert.deepEqual(config.directions, expectedDirections[level]);

  const titles = new Set();
  const queueSignatures = new Set();
  for (const [index, challenge] of config.rounds.entries()) {
    assert.ok(challenge.title.length > 5, `${level} challenge ${index + 1} needs a title`);
    assert.ok(!titles.has(challenge.title), `${level} challenge titles must be unique`);
    titles.add(challenge.title);
    assert.ok(challenge.objective.length > 20, "every challenge needs a meaningful objective");
    assert.ok(challenge.lesson.length > 20, "every challenge needs a learning explanation");
    assert.ok(Number.isInteger(challenge.budget) && challenge.budget > 0);
    assert.equal(challenge.budget % config.step, 0, "cycle budgets must match the slider step");

    assert.deepEqual(Object.keys(challenge.queues).sort(), [...config.directions].sort());
    for (const direction of config.directions) {
      const queue = challenge.queues[direction];
      assert.ok(Array.isArray(queue) && queue.length >= 1);
      assert.ok(Number.isInteger(challenge.waitMinutes[direction]) && challenge.waitMinutes[direction] >= 1);
      for (const kind of queue) {
        assert.ok(level === "hard" ? vehicleKinds.has(kind) : kind === "car",
          "vehicle types must match the selected difficulty");
      }
    }
    const signature = JSON.stringify(challenge.queues);
    assert.ok(!queueSignatures.has(signature), `${level} challenge queue layouts should be unique`);
    queueSignatures.add(signature);
  }
}

assert.equal(Object.values(LEVELS).reduce((sum, level) => sum + level.rounds.length, 0), 150);
console.log("Traffic Control: all 150 challenge-data checks passed.");
