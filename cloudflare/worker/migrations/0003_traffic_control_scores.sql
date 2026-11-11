-- Traffic Control Centre is the tenth active game.
-- Kept in dedicated tables so the original nine-game CHECK constraints and data remain untouched.
CREATE TABLE IF NOT EXISTS traffic_control_attempts (
  attempt_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score_percent REAL NOT NULL CHECK (score_percent >= 0 AND score_percent <= 100),
  points INTEGER NOT NULL CHECK (points >= 0 AND points <= 1000),
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds BETWEEN 1 AND 14400),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS traffic_control_attempts_user_idx
  ON traffic_control_attempts(user_id, created_at);

CREATE TABLE IF NOT EXISTS traffic_control_best_scores (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL CHECK (points BETWEEN 0 AND 1000),
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds BETWEEN 1 AND 14400),
  achieved_at TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS traffic_control_best_ranking_idx
  ON traffic_control_best_scores(points DESC, achieved_at ASC);
