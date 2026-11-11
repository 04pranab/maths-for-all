import assert from "node:assert/strict";
import { MISSIONS } from "../missions.js";

assert.equal(MISSIONS.length, 5, "the game should contain five guided missions");
assert.deepEqual(MISSIONS.map((mission) => mission.id), [1, 2, 3, 4, 5]);

for (const mission of MISSIONS) {
  const queues = Object.values(mission.queues);
  assert.equal(queues.every((count) => Number.isInteger(count) && count >= 0), true,
    "queue sizes must be non-negative whole numbers");
  assert.equal(mission.answers.includes(mission.answer), true,
    "the correct answer must be one of the visible choices");
  assert.equal(new Set(mission.answers).size, mission.answers.length,
    "answer choices must not contain duplicates");
  assert.ok(mission.question.length > 20, "each mission needs a meaningful maths question");
}

assert.equal(Object.values(MISSIONS[0].queues).reduce((sum, value) => sum + value, 0), 4);
assert.equal(MISSIONS[0].answer, 2, "two opposite cars pass in each of two waves");
assert.equal(Object.values(MISSIONS[1].queues).reduce((sum, value) => sum + value, 0), 10);
assert.equal(MISSIONS[1].answer, 10, "the addition mission totals ten vehicles");
assert.equal(MISSIONS[2].answer, 4, "eight vehicles in pairs need four waves");
assert.equal(MISSIONS[3].answer, 6, "twelve vehicles in pairs need six waves");

const pedestrianMission = MISSIONS[4];
assert.equal(Object.values(pedestrianMission.queues).reduce((sum, value) => sum + value, 0), 8);
assert.equal(pedestrianMission.pedestrians % pedestrianMission.pedestrianGroupSize, 0,
  "pedestrian groups must divide evenly");
assert.equal(pedestrianMission.pedestrians / pedestrianMission.pedestrianGroupSize, 2);
assert.equal(pedestrianMission.answer, 10, "two five-second crossing groups take ten seconds");

console.log("Traffic Control Centre mission data: all checks passed.");
