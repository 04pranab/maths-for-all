import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";

// The game keeps all runtime JavaScript in one browser module. Evaluate only
// its mission-data section here so the test does not need a DOM or WebGL.
const bundle = readFileSync(new URL("../../../js/traffic-control.js", import.meta.url), "utf8");
const missionStart = bundle.indexOf("const LEVELS_BASE =");
const missionEnd = bundle.indexOf("\n\nlet THREE", missionStart);
assert.ok(missionStart >= 0 && missionEnd > missionStart, "mission data must remain in the game bundle");
const sandbox = { module: { exports: {} } };
vm.runInNewContext(
  `${bundle.slice(missionStart, missionEnd)}\nmodule.exports = { LEVELS };`,
  sandbox
);
const LEVELS = JSON.parse(JSON.stringify(sandbox.module.exports.LEVELS));

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
assert.deepEqual(Object.keys(LEVELS).sort(), ["easy", "hard", "medium"]);
assert.ok(Object.values(LEVELS).every(level => level.rounds.length === 50),
  "each difficulty must expose all 50 selectable levels");


// Structural integration checks: the game has one native screen and one JS/CSS entry.
const arcadeHtml = readFileSync(new URL("../../../index.html", import.meta.url), "utf8");
const gameCss = readFileSync(new URL("../../../css/traffic-control.css", import.meta.url), "utf8");
assert.equal((arcadeHtml.match(/id="screen-traffic-control"/g) || []).length, 1,
  "Traffic Control markup must exist once in the main arcade");
assert.match(arcadeHtml, /href="css\/traffic-control\.css(?:\?[^"]*)?"/,
  "the main arcade must load the dedicated Traffic Control stylesheet");
assert.match(arcadeHtml, /<script type="module" src="js\/traffic-control\.js(?:\?[^"]*)?"><\/script>/,
  "the main arcade must load the consolidated Traffic Control module");
assert.doesNotMatch(arcadeHtml, /<iframe\b[^>]*(?:traffic-control|traffic-control-frame)/i,
  "Traffic Control must not be embedded in an iframe");
assert.match(arcadeHtml, /id="tc-difficulty-view"/,
  "Traffic Control must open on a dedicated difficulty-selection screen");
assert.match(arcadeHtml, /id="tc-level-view"[^>]*hidden/,
  "the level grid must be a separate screen shown after choosing a difficulty");
assert.match(arcadeHtml, /id="tc-game-view" hidden/,
  "the actual game must stay hidden until a level is chosen");
assert.equal((arcadeHtml.match(/data-difficulty="(?:easy|medium|hard)"/g) || []).length, 3,
  "the difficulty screen must offer Easy, Medium and Hard exactly once");
assert.match(arcadeHtml, /id="tc-level-grid"/,
  "the level screen must have a dedicated level grid");
assert.doesNotMatch(arcadeHtml, /class="level-tab/,
  "difficulty tabs must not remain inside the gameplay screen");
assert.match(bundle, /function renderLevelGrid\(\)/,
  "the game module must render the 50 levels for the selected difficulty");
assert.match(bundle, /function chooseLevel\(index\)/,
  "every level tile must be directly playable");
assert.match(bundle, /Array\.isArray\(value\)/,
  "progress storage must preserve individually completed levels while migrating older progress");
assert.match(gameCss, /\.tc-level-grid[^{]*\{[^}]*grid-template-columns/s,
  "the level chooser must have a responsive grid layout");
assert.doesNotMatch(gameCss, /traffic-control-frame|tc-frame-wrap/,
  "the dedicated stylesheet must not retain obsolete iframe layout rules");
for (const obsolete of ["app.js", "city3d.js", "missions.js", "styles.css"]) {
  assert.equal(existsSync(new URL(`../${obsolete}`, import.meta.url)), false,
    `obsolete split module ${obsolete} must be removed`);
}

console.log("Traffic Control: all 150 challenge-data and native-integration checks passed.");
