export const ACTIVE_GAME_IDS = Object.freeze([
  "arithmetic-quiz","math-racing","sudoku","shape-fitting","slab-maths",
  "shape-architect","fraction-bakery","little-shop","number-maze","traffic-control",
]);

// A solved challenge is not worth the same amount in every game. Values are
// intentionally modest and difficulty-sensitive; they are not a time-spent reward.
export const GAME_RULES = Object.freeze({
  "arithmetic-quiz": { maximum: 140, label: "Arithmetic Quiz" },
  "math-racing": { maximum: 180, label: "Math Racing" },
  sudoku: { maximum: 350, label: "Sudoku" },
  "shape-fitting": { maximum: 220, label: "Shape Fitting" },
  "slab-maths": { maximum: 120, label: "Slab Maths" },
  "shape-architect": { maximum: 280, label: "Shape Architect" },
  "fraction-bakery": { maximum: 230, label: "Fraction Bakery" },
  "little-shop": { maximum: 120, label: "Little Shop" },
  "number-maze": { maximum: 250, label: "Number Maze" },
  "traffic-control": { maximum: 260, label: "Traffic Control Centre" },
});
export const MAX_GAME_POINTS = 1000; // retained as the storage ceiling for backward compatibility
export const MAX_GLOBAL_POINTS = Object.values(GAME_RULES).reduce((n, rule) => n + rule.maximum, 0);

const DIFFICULTY_FACTOR = Object.freeze({ easy: 0.45, gentle: 0.45, starter: 0.45, medium: 0.7, steady: 0.7, growing: 0.7, hard: 1, stretch: 1, champion: 1 });
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export function calculateAttemptPoints({ gameId, scorePercent, difficulty = "easy", level = 1, hintsUsed = 0, mistakes = 0 }) {
  const rule = GAME_RULES[gameId];
  if (!rule) throw new RangeError("Unknown game.");
  if (typeof scorePercent !== "number" || !Number.isFinite(scorePercent) || scorePercent < 0 || scorePercent > 100) throw new RangeError("Score percentage must be between 0 and 100.");
  const factor = DIFFICULTY_FACTOR[String(difficulty).toLowerCase()] ?? DIFFICULTY_FACTOR.easy;
  const progress = 1 + Math.min(0.2, Math.max(0, Number(level) - 1) * 0.01);
  const hintPenalty = Math.max(0.55, 1 - clamp(Number(hintsUsed) || 0, 0, 10) * 0.08);
  const mistakePenalty = Math.max(0.65, 1 - clamp(Number(mistakes) || 0, 0, 20) * 0.025);
  return Math.min(rule.maximum, Math.round(rule.maximum * (scorePercent / 100) * factor * progress * hintPenalty * mistakePenalty));
}

export function normalizeScore(percent) {
  if (typeof percent !== "number" || !Number.isFinite(percent) || percent < 0 || percent > 100) throw new RangeError("Score percentage must be between 0 and 100.");
  return Math.round(percent * 10);
}
export function calculateGlobalPoints(bestScoresByGame) {
  if (!bestScoresByGame || typeof bestScoresByGame !== "object" || Array.isArray(bestScoresByGame)) throw new TypeError("Best scores must be an object keyed by game ID.");
  return ACTIVE_GAME_IDS.reduce((total, gameId) => {
    const points = bestScoresByGame[gameId] ?? 0;
    if (!Number.isInteger(points) || points < 0 || points > MAX_GAME_POINTS) throw new RangeError("Each game score must be an integer between 0 and 1000.");
    return total + points;
  }, 0);
}
