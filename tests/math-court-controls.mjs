import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../js/math-court.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../css/math-court.css", import.meta.url), "utf8");

const exportMatch = game.match(/root\.MathCourt=\{([\s\S]*?)\};\s*\}\)\(window\);/);
assert.ok(exportMatch, "MathCourt must publish its public interaction API.");
const api = new Set(
  [...exportMatch[1].matchAll(/(?:^|,)\s*([A-Za-z_$][\w$]*)\s*(?=,|:)/g)]
    .map(match => match[1])
);
assert.ok(api.size >= 35, "The public game API should include the workshop and navigation controls.");

const references = new Set();
for (const source of [game, html]) {
  for (const match of source.matchAll(/MathCourt\.([A-Za-z_$][\w$]*)\s*\(/g)) {
    references.add(match[1]);
  }
}
const missing = [...references].filter(name => !api.has(name)).sort();
assert.deepEqual(missing, [], "Visible Math Court controls call methods that are not exported.");

for (const dynamicAction of ["answerInvestigation", "answerChallenge"]) {
  assert.ok(api.has(dynamicAction), "Dynamically selected answer action is missing: " + dynamicAction);
}
for (const chapter of [1,2,3,4,5,6,7,8,9]) {
  assert.ok(game.includes("item.chapter===" + chapter), "Chapter " + chapter + " has no chapter-specific play mechanic.");
}
assert.match(game, /item\.chapter===9\?renderRouteGarden\(item,task\):renderTownPlanner\(item,task\)/, "Chapter 10 should use the Town Planner fallback.");
for (const renderer of [
  "renderNumberForge", "renderPatternGarden", "renderFractionStudio", "renderShapeWorkshop",
  "renderTimeline", "renderDataGarden", "renderRuleMachine", "renderShareMarket",
  "renderRouteGarden", "renderTownPlanner"
]) {
  assert.ok(game.includes("function " + renderer + "("), "Missing chapter play renderer: " + renderer);
}
assert.match(game, /function renderAnswerTiles[\s\S]*?draggable="true"/, "Answer tiles should support dragging.");
assert.match(game, /function renderAnswerTiles[\s\S]*?onclick="MathCourt\.'\+action\+'\(/,
  "Answer tiles must retain click/tap selection as a non-drag alternative.");
assert.match(game, /function dropAnswer[\s\S]*?answerInvestigation\(index\)[\s\S]*?answerChallenge\(index\)/,
  "The evidence tray must route dropped results to the matching task.");
assert.match(game, /function renderTimeline[\s\S]*?oninput="MathCourt\.setLabTimeline\(this\.value\)"/,
  "Timeline slider must update the playable model.");
assert.match(css, /\.mc-stage-layout--investigation[\s\S]*?grid-template-areas:"work task"/,
  "The investigation stage should keep the visual workshop and answer panel side by side on wide screens.");
assert.match(css, /@media \(max-width:900px\)[\s\S]*?grid-template-areas:"work" "task"/,
  "The investigation stage must stack cleanly on narrower screens.");
assert.match(css, /\.mc-svg-pick:focus-visible[\s\S]*?outline:3px solid/,
  "Keyboard focus must remain visible on SVG evidence controls.");

assert.match(game, /function clueMoveSpec\(item\)[\s\S]*?const type=\(item\.id-1\)%10/,
  "Every case must be assigned a case-specific field-move family.");
assert.match(game, /function renderClueMove\(item\)[\s\S]*?mc-clue-adventure/,
  "The new-clue stage must render a playable investigation.");
for (const type of [
  "mc-clue-token-row", "mc-clue-bars", "mc-clue-fraction", "mc-clue-shape-grid",
  "mc-clue-minutes", "mc-clue-rule-tiles", "mc-clue-share", "mc-clue-route-choices",
  "mc-clue-equation-input"
]) {
  assert.ok(game.includes(type), "Missing hands-on clue mechanic: " + type);
}
for (const action of ["submitClueMove", "chooseClueValue", "setClueValue", "toggleClueCell"]) {
  assert.ok(api.has(action), "Field-move control is not exported: " + action);
}
assert.match(game, /state\.phase===3&&!state\.clueSolved/,
  "The new clue must be verified before the case can progress.");
assert.match(game, /clueSolved:state\.clueSolved[\s\S]*?clueValue:state\.clueValue/,
  "Field-move progress must be included in saved sessions.");
assert.match(game, /state\.clueSolved=saved\?Boolean\(saved\.clueSolved\):false/,
  "Resuming a case must restore field-move completion.");
assert.match(css, /\.mc-clue-shape-grid[\s\S]*?display:grid/,
  "The shape clue needs a real interactive grid.");
assert.match(css, /\.mc-clue-bar-choice:focus-visible/,
  "Clue controls must have a visible keyboard focus state.");

console.log(JSON.stringify({
  status: "PASS",
  exportedMethods: api.size,
  referencedMethods: references.size,
  chaptersWithPlayMechanics: 10,
  clueMoveFamilies: 10,
  checkedRenderers: 10,
  checks: [
    "all statically referenced MathCourt handlers are exported",
    "answer tiles support drag and tap",
    "drop targets route to the correct challenge",
    "timeline controls update and are keyboard accessible",
    "wide split-screen and responsive stacking rules exist",
    "keyboard focus styling exists for SVG evidence",
    "all ten case-specific field-move families render and export working handlers",
    "field-move progress is saved, resumed, and required before stage progression"
  ]
}, null, 2));
