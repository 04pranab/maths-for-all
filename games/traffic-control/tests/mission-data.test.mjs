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
const capacityStart = bundle.indexOf("function service(kind)");
const capacityEnd = bundle.indexOf("\nfunction planAt", capacityStart);
assert.ok(capacityStart >= 0 && capacityEnd > capacityStart, "service and capacity functions must remain testable");
const capacitySource = bundle.slice(capacityStart, capacityEnd);
function capacityFor(difficulty, queue, greenSeconds, configuredServiceSeconds) {
  const context = {
    module: { exports: {} },
    level: difficulty,
    queues: { north: queue },
    mission: () => ({}),
    cfg: () => ({ serviceSeconds: configuredServiceSeconds }),
    TIMES: { bike: 5, car: 10, truck: 15 }
  };
  vm.runInNewContext(`${capacitySource}\nmodule.exports = capacity;`, context);
  return context.module.exports("north", greenSeconds);
}
assert.equal(capacityFor("easy", ["car", "car", "car"], 20, undefined), 2,
  "Easy must clear only two cars in a 20-second green when service time comes from the config fallback");
assert.equal(capacityFor("medium", ["car", "car"], 15, 10), 1,
  "Medium must count only complete cars within its green phase");
assert.equal(capacityFor("hard", ["bike", "car", "truck"], 29, 10), 2,
  "Hard must add mixed-fleet service times and reject a vehicle that does not fit");


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
for (const [difficulty, config] of Object.entries(LEVELS)) {
  const topics = new Set();
  for (const challenge of config.rounds) {
    assert.ok(challenge.learning?.topic, "every challenge must teach a named mathematical concept");
    assert.ok(challenge.learning?.formula, "every challenge must expose a usable mathematical formula");
    assert.ok(challenge.learning?.example, "every challenge must include a worked example");
    assert.ok(challenge.learning?.prompt, "every challenge must connect the concept to a player action");
    assert.ok(challenge.maxCycles >= 1 && challenge.maxCycles <= 5,
      "every challenge must have a meaningful cycle limit");
    assert.ok(challenge.targetEfficiency >= 0.75 && challenge.targetEfficiency <= 0.9,
      "every challenge must enforce a measurable efficiency target");
    assert.ok(challenge.minimumGreen >= 5, "every challenge must prevent zero-green starvation");
    assert.ok(["standard", "rush-hour", "school-crossing", "emergency-priority", "rain"].includes(challenge.modifier),
      "every level must have a real gameplay modifier");
    assert.ok(challenge.modifierLabel?.length > 2 && challenge.modifierDescription?.length > 10,
      "each modifier must be explained to the learner");
    if (challenge.modifier === "emergency-priority") assert.ok(config.directions.includes(challenge.priorityDirection),
      "emergency-priority challenges must identify a valid approach");
    assert.ok(["throughput", "balanced", "priority"].includes(challenge.scoringMode),
      "each challenge must define a real scoring mechanic");
    topics.add(challenge.learning.topic);
  }
  assert.ok(topics.size >= 5, difficulty + " must teach a progression of distinct concepts");
}
assert.match(bundle, /function addRushHourArrivals\(/, "rush-hour challenges must introduce a real traffic wave");
assert.match(bundle, /livePedestrianHold>0/, "school-crossing challenges must pause live vehicle service");
assert.match(bundle, /modifier==="emergency-priority"/, "emergency routes must affect priority scoring");
assert.match(bundle, /modifier==="rain"/, "rain challenges must change vehicle movement timing");
assert.match(bundle, /paint\("amber"\)/, "signals must show an amber transition");
assert.match(bundle, /g.userData.brakeLights=brakeLights/, "queued vehicles must expose illuminated brake lights");
assert.match(bundle, /setInterval\(liveTick,1000\)/, "live shift budget must tick in one-second intervals");
assert.match(bundle, /function failChallenge\(/, "a poor plan must be able to fail and be retried");
assert.match(bundle, /mission\(\)\.serviceSeconds\?\?cfg\(\)\.serviceSeconds\?\?10/, "Easy and Medium capacity must use a finite vehicle service time");
assert.match(bundle, /cycles>=mission\(\)\.maxCycles/, "the simulation must enforce a cycle limit");
assert.match(bundle, /mode==="throughput"/, "throughput levels must score completed movements");
assert.match(bundle, /mode==="balanced"/, "balanced levels must reward approach fairness");
assert.match(bundle, /efficiency<m\.targetEfficiency/, "clearing queues alone must not guarantee success");
assert.match(bundle, /mfa-traffic-control-best-v2/, "personal bests and stars must be persisted locally");
assert.match(bundle, /MfaAccounts\?\.openLeaderboard/, "successful challenges must link to the existing leaderboard");


// Structural integration checks: the game has one native screen and one JS/CSS entry.
const arcadeHtml = readFileSync(new URL("../../../index.html", import.meta.url), "utf8");
const gameCss = readFileSync(new URL("../../../css/traffic-control.css", import.meta.url), "utf8");
assert.match(arcadeHtml, /tc-learning-formula/, "the learning formula must be visible in the game");
assert.match(arcadeHtml, /tc-queue-chart/, "the game must visualise predicted queue clearance");
assert.match(arcadeHtml, /id="tc-daily-challenge"/, "the level selector must expose a daily challenge");
assert.match(arcadeHtml, /id="tc-leaderboard"/, "the completion panel must expose the existing leaderboard");
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
assert.match(bundle, /actionLabel:"Choose another level"/,
  "completing a challenge must offer free level selection instead of forced progression");
assert.match(bundle, /startsWith\("Retry"\).*startRound\(round\).*showLevelsView\(level\)/,
  "failed attempts must retry while successful attempts return to level selection");
assert.match(bundle, /function startDailyChallenge\(/,
  "the game must expose a deterministic daily challenge");
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
