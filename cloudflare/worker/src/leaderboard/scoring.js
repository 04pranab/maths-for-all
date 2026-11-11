export const ACTIVE_GAME_IDS = Object.freeze(["arithmetic-quiz","math-racing","sudoku","shape-fitting","slab-maths","shape-architect","fraction-bakery","little-shop","number-maze","traffic-control"]);
export const GAME_RULES = Object.freeze({
 "arithmetic-quiz":{base:12,label:"Arithmetic Quiz"},"math-racing":{base:16,label:"Math Racing"},sudoku:{base:32,label:"Sudoku"},
 "shape-fitting":{base:20,label:"Shape Fitting"},"slab-maths":{base:10,label:"Slab Maths"},"shape-architect":{base:26,label:"Shape Architect"},
 "fraction-bakery":{base:22,label:"Fraction Bakery"},"little-shop":{base:12,label:"Little Shop"},"number-maze":{base:24,label:"Number Maze"},"traffic-control":{base:28,label:"Traffic Control Centre"}
});
const DIFFICULTY_FACTOR=Object.freeze({easy:.5,gentle:.5,starter:.5,medium:.8,steady:.8,growing:.8,hard:1.25,stretch:1.25,champion:1.25});
const clamp=(n,lo,hi)=>Math.min(hi,Math.max(lo,n));
export function calculateAttemptPoints({gameId,scorePercent,difficulty="easy",level=1,hintsUsed=0,mistakes=0}){
 const rule=GAME_RULES[gameId];if(!rule)throw new RangeError("Unknown game.");
 if(typeof scorePercent!=="number"||!Number.isFinite(scorePercent)||scorePercent<0||scorePercent>100)throw new RangeError("Score percentage must be between 0 and 100.");
 const factor=DIFFICULTY_FACTOR[String(difficulty).toLowerCase()]??DIFFICULTY_FACTOR.easy;
 const progression=1+Math.log2(clamp(Number(level)||1,1,1_000_000_000))*.12;
 const hintPenalty=Math.max(.4,1-clamp(Number(hintsUsed)||0,0,20)*.06);
 const mistakePenalty=Math.max(.5,1-clamp(Number(mistakes)||0,0,40)*.02);
 return Math.max(0,Math.round(rule.base*(scorePercent/100)*factor*progression*hintPenalty*mistakePenalty));
}
export function normalizeScore(percent){if(typeof percent!=="number"||!Number.isFinite(percent)||percent<0||percent>100)throw new RangeError("Score percentage must be between 0 and 100.");return Math.round(percent*10);}
