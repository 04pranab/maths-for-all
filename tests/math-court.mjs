import assert from "node:assert/strict";
import "../js/math-court-data.js";

const data = globalThis.MathCourtData;
assert.ok(data, "MathCourtData must expose the case catalogue.");
assert.equal(data.cases.length, 100, "Math Court must contain exactly 100 cases.");
assert.equal(data.isValid(), true, "Every case must pass the catalogue integrity validator.");
assert.deepEqual(data.chapters.map(ch => ch.id), [1,2,3,4,5,6,7,8,9,10]);
assert.ok(data.chapters.every(ch => ch.to - ch.from + 1 === 10), "Each chapter must contain ten case numbers.");
assert.equal(new Set(data.cases.map(c => c.id)).size, 100, "Case IDs must be unique.");
assert.equal(new Set(data.cases.map(c => c.title.toLowerCase())).size, 100, "Case titles must be unique.");
assert.equal(data.phases.length, 7, "Cases must use the seven-stage court procedure.");
assert.deepEqual(data.phases, [
  "The case is called", "Witness examination", "Build the evidence",
  "New evidence", "Cross-examination", "Verdict", "The court's reflection"
]);
const unhelpfulLanguage = /\b(thief|thieves|stolen|steal|stealing|theft|robbery|robber|robbed|murder|criminal|crime|liar|cheat|fraud|punish|guilty|blame|accuse|accused|accusation|dishonest|lie|lied|lies|wrongdoer|villain|suspect|suspicious)\b/i;
const discouragingLanguage = /\b(wrong|error|mistake|failure|fault|missing)\b/i;
for (const item of data.cases) {
  assert.ok(item.story.length >= 30, "Case " + item.id + " needs a real story.");
  assert.ok(item.opening && item.opening.length >= 50, "Case " + item.id + " needs its own scene-setting story opening.");
  assert.ok(item.claim.length >= 8, "Case " + item.id + " needs a claim to test.");
  assert.ok(item.prompt.endsWith("?"), "Case " + item.id + " needs a clear question.");
  assert.ok(item.options.every(option => typeof option === "string" && option.length > 0), "Case " + item.id + " has an empty answer option.");
  assert.ok(item.explanation.length >= 20, "Case " + item.id + " needs a mathematical explanation.");
  assert.ok(item.challenge && item.challenge.prompt.endsWith("?"), "Case " + item.id + " needs a second linked challenge.");
  assert.ok(item.challenge.options.length >= 3 && new Set(item.challenge.options).size === item.challenge.options.length, "Case " + item.id + " has invalid challenge choices.");
  assert.ok(Number.isInteger(item.challenge.answer) && item.challenge.answer >= 0 && item.challenge.answer < item.challenge.options.length, "Case " + item.id + " has an invalid challenge answer.");
  assert.ok(item.challenge.explanation.length >= 20, "Case " + item.id + " needs a challenge explanation.");
  assert.ok(item.twist.length >= 20, "Case " + item.id + " needs a case development.");
  assert.ok(item.moral.length >= 15, "Case " + item.id + " needs a reflection/value.");
  assert.ok(item.virtue && item.virtue.length >= 3, "Case " + item.id + " needs a named virtue.");
  assert.ok(item.speaker && item.voice && item.voice.length >= 30, "Case " + item.id + " needs a character voice with warmth and purpose.");
  assert.ok(!discouragingLanguage.test([item.title,item.opening,item.story,item.narrative,item.claim,item.prompt,item.twist,item.moral,item.evidence,item.explanation,item.challenge.prompt,item.challenge.explanation,item.voice,item.options.join(" "),item.challenge.options.join(" ")].join(" ")), "Case " + item.id + " contains discouraging wording where a constructive description is possible.");
  const storyBundle = [item.title,item.opening,item.story,item.narrative,item.claim,item.prompt,item.twist,item.moral,item.evidence,item.explanation,item.challenge.prompt,item.challenge.explanation,item.voice,item.options.join(" "),item.challenge.options.join(" ")].join(" ");
  assert.ok(!unhelpfulLanguage.test(storyBundle), "Case " + item.id + " contains discouraged criminal/blaming language.");
  assert.ok(data.checks[item.check], "Case " + item.id + " references an unknown cross-examination skill.");
  assert.ok(["supported","disproved","partly","uncertain","insufficient"].includes(item.verdict), "Case " + item.id + " has an unsupported verdict.");
  assert.equal(typeof data.getCase(item.id), "object");
}
const expectedAnswers = new Map([
  [1,"15"],[2,"63"],[5,"78"],[8,"36"],[10,"42"],[14,"12"],[16,"64"],[19,"8"],
  [21,"1/4"],[24,"₹400"],[30,"48 L"],[33,"16 m"],[38,"120 cm³"],[39,"10 m"],
  [40,"44 m"],[41,"90 minutes"],[48,"29 February"],[50,"24 minutes"],[51,"20%"],
  [52,"9"],[58,"6.5"],[61,"2n + 1"],[63,"6"],[65,"81"],[70,"₹6"],
  [73,"Team B: 78"],[75,"28"],[82,"No, odd-degree areas prevent such a closed route"],[84,"10 units"],
  [85,"Two large and two small for ₹74"],[86,"Plan A: ₹120"],[91,"₹2,000"],
  [95,"1,700 Wh"],[97,"36 days"]
]);
for (const [id, expected] of expectedAnswers) {
  const item = data.getCase(id);
  assert.equal(item.options[item.answer], expected, "Case " + id + " has an incorrect keyed answer.");
}
const expectedChallengeAnswers = new Map([
  [1,"52 crates"],[6,"304"],[15,"31"],[21,"3/12"],[23,"240 cm"],[30,"72 L"],
  [41,"4:05 pm"],[43,"320 cm"],[50,"18 minutes"],[57,"10"],[61,"21"],[70,"₹36"],
  [75,"15"],[82,"No, an open Euler trail allows at most two odd-degree vertices"],
  [85,"Three large containers for ₹75"],[91,"₹200"],[100,"State the goal and constraints, test outcomes, and explain trade-offs"]
]);
for (const [id, expected] of expectedChallengeAnswers) {
  const item = data.getCase(id);
  assert.equal(item.challenge.options[item.challenge.answer], expected, "Case " + id + " has an incorrect linked challenge answer.");
}
for (const chapter of data.chapters) {
  const chapterCases = data.cases.filter(item => item.chapter === chapter.id);
  assert.equal(chapterCases.length, 10, chapter.name + " must have ten cases.");
  assert.equal(chapterCases[0].id, chapter.from);
  assert.equal(chapterCases.at(-1).id, chapter.to);
}
console.log(JSON.stringify({
  status:"PASS",
  cases:data.cases.length,
  chapters:data.chapters.length,
  stages:data.phases.length,
  verdicts:[...new Set(data.cases.map(c => c.verdict))].sort(),
  checkSkills:[...new Set(data.cases.map(c => c.check))].sort(),
  keyedAnswerSpotChecks:expectedAnswers.size,
  linkedChallenges:data.cases.filter(c => c.challenge).length,
  challengeSpotChecks:expectedChallengeAnswers.size
}, null, 2));
