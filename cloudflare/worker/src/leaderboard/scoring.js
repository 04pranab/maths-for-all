export const ACTIVE_GAME_IDS = Object.freeze([
  "arithmetic-quiz",
  "math-racing",
  "sudoku",
  "shape-fitting",
  "slab-maths",
  "shape-architect",
  "fraction-bakery",
  "little-shop",
  "number-maze",
  "traffic-control",
]);

export const MAX_GAME_POINTS = 1000;
export const MAX_GLOBAL_POINTS = ACTIVE_GAME_IDS.length * MAX_GAME_POINTS;

/**
 * Convert a game-specific result into a common 0–1000 scale.
 * Game adapters must supply a bounded percentage (0–100); raw scores from
 * different games must never be compared directly.
 */
export function normalizeScore(percent) {
  if (typeof percent !== "number" || !Number.isFinite(percent)) {
    throw new TypeError("Score percentage must be a finite number.");
  }
  if (percent < 0 || percent > 100) {
    throw new RangeError("Score percentage must be between 0 and 100.");
  }
  return Math.round(percent * 10);
}

/** Sum one best normalized score per active game. */
export function calculateGlobalPoints(bestScoresByGame) {
  if (!bestScoresByGame || typeof bestScoresByGame !== "object" || Array.isArray(bestScoresByGame)) {
    throw new TypeError("Best scores must be an object keyed by game ID.");
  }

  return ACTIVE_GAME_IDS.reduce((total, gameId) => {
    const points = bestScoresByGame[gameId] ?? 0;
    if (!Number.isInteger(points) || points < 0 || points > MAX_GAME_POINTS) {
      throw new RangeError("Each game score must be an integer between 0 and 1000.");
    }
    return total + points;
  }, 0);
}
