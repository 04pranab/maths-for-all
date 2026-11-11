-- Per-IP API abuse guard. IPs are hashed before storage.
CREATE TABLE IF NOT EXISTS auth_rate_limits (
  rate_key TEXT PRIMARY KEY,
  hits INTEGER NOT NULL CHECK (hits >= 0),
  window_started INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS auth_rate_limits_window_idx ON auth_rate_limits(window_started);
