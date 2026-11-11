import test from "node:test";
import assert from "node:assert/strict";
import {GAME_RULES,calculateAttemptPoints} from "../cloudflare/worker/src/leaderboard/scoring.js";
import {progressForXp,earnedBadges} from "../cloudflare/worker/src/leaderboard/progression.js";
import {validateAttempt} from "../cloudflare/worker/src/leaderboard/validation.js";

test("a hard Sudoku clear is worth substantially more than an easy arithmetic clear",()=>{
 const arithmetic=calculateAttemptPoints({gameId:"arithmetic-quiz",scorePercent:100,difficulty:"easy"});
 const sudoku=calculateAttemptPoints({gameId:"sudoku",scorePercent:100,difficulty:"hard"});
 assert.ok(sudoku>arithmetic*4);
});
test("challenge level increases points without a fixed score ceiling",()=>{
 const low=calculateAttemptPoints({gameId:"number-maze",scorePercent:100,difficulty:"stretch",level:1});
 const high=calculateAttemptPoints({gameId:"number-maze",scorePercent:100,difficulty:"stretch",level:10000000000});
 assert.ok(high>low);
 assert.ok(high>GAME_RULES["number-maze"].base);
});
test("hints and mistakes reduce awards",()=>{
 const clean=calculateAttemptPoints({gameId:"sudoku",scorePercent:100,difficulty:"hard",level:20});
 const assisted=calculateAttemptPoints({gameId:"sudoku",scorePercent:100,difficulty:"hard",level:20,hintsUsed:3,mistakes:4});
 assert.ok(assisted<clean);
});
test("player levels continue beyond level 100 and XP progress is monotonic",()=>{
 const a=progressForXp(0),b=progressForXp(1000000),c=progressForXp(100000000);
 assert.equal(a.level,1);assert.ok(b.level>100);assert.ok(c.level>b.level);
 assert.ok(c.xpToNext>0&&c.levelProgress>=0&&c.levelProgress<=100);
});
test("achievement milestones unlock from genuine game progress counters",()=>{
 const badges=earnedBadges({attempts:100,perfect_clears:1,hard_clears:1,best_streak:5,highest_level:100,total_points:10000});
 const ids=badges.map(b=>b.id);
 for(const id of ["first-clear","flawless","hard-mode","streak-5","deep-dive-25","deep-dive-100","points-1000","points-10000","marathon-100"])assert.ok(ids.includes(id));
});
test("attempt validation accepts unbounded progression levels",()=>{
 assert.equal(validateAttempt({gameId:"math-court",scorePercent:90,durationSeconds:60,attemptId:"attempt_123456"}).ok,false);
 const result=validateAttempt({gameId:"number-maze",scorePercent:100,durationSeconds:240,attemptId:"maze_attempt_12345",difficulty:"stretch",level:10000000000});
 assert.equal(result.ok,true);assert.ok(result.value.points>0);
});
