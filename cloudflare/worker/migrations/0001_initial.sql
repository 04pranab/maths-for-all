-- Maths For All D1 schema, migration 0001.
-- Idempotent so it can safely describe the already-provisioned empty D1 database.
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL COLLATE NOCASE UNIQUE,
  email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  password_hash TEXT,
  email_verified_at TEXT,
  google_subject TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  last_used_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS email_verification_user_idx ON email_verification_tokens(user_id);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS password_reset_user_idx ON password_reset_tokens(user_id);

CREATE TABLE IF NOT EXISTS game_attempts (
  attempt_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL CHECK (game_id IN (
    'arithmetic-quiz','math-racing','sudoku','shape-fitting','slab-maths',
    'shape-architect','fraction-bakery','little-shop','number-maze'
  )),
  score_percent REAL NOT NULL CHECK (score_percent >= 0 AND score_percent <= 100),
  points INTEGER NOT NULL CHECK (points >= 0 AND points <= 1000),
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds BETWEEN 1 AND 14400),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS game_attempts_user_game_idx ON game_attempts(user_id, game_id);

CREATE TABLE IF NOT EXISTS best_game_scores (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL CHECK (game_id IN (
    'arithmetic-quiz','math-racing','sudoku','shape-fitting','slab-maths',
    'shape-architect','fraction-bakery','little-shop','number-maze'
  )),
  points INTEGER NOT NULL CHECK (points BETWEEN 0 AND 1000),
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds BETWEEN 1 AND 14400),
  achieved_at TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  PRIMARY KEY (user_id, game_id)
);
CREATE INDEX IF NOT EXISTS best_game_scores_ranking_idx
  ON best_game_scores(game_id, points DESC, duration_seconds ASC, achieved_at ASC);
