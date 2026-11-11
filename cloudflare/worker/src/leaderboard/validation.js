import { ACTIVE_GAME_IDS, MAX_GAME_POINTS, normalizeScore } from "./scoring.js";

const MAX_DURATION_SECONDS = 4 * 60 * 60;

export function validateAttempt(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const { gameId, scorePercent, durationSeconds, attemptId } = input;
  if (!ACTIVE_GAME_IDS.includes(gameId)) {
    return { ok: false, error: "Unknown or inactive game." };
  }
  if (typeof attemptId !== "string" || !/^[a-zA-Z0-9_-]{12,80}$/.test(attemptId)) {
    return { ok: false, error: "A valid unique attemptId is required." };
  }
  if (typeof durationSeconds !== "number" || !Number.isInteger(durationSeconds) ||
      durationSeconds < 1 || durationSeconds > MAX_DURATION_SECONDS) {
    return { ok: false, error: "durationSeconds must be an integer from 1 to 14400." };
  }

  try {
    const points = normalizeScore(scorePercent);
    if (points < 0 || points > MAX_GAME_POINTS) {
      return { ok: false, error: "Score is outside the permitted range." };
    }
    return {
      ok: true,
      value: { gameId, attemptId, scorePercent, points, durationSeconds },
    };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}
