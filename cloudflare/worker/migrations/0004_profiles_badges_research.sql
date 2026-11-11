-- Research data is aggregate-only and deliberately has no user, participant,
-- IP, device, or session identifier. One row is a daily count bucket.
CREATE TABLE IF NOT EXISTS research_aggregates (
  day TEXT NOT NULL,
  game_id TEXT NOT NULL,
  action TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'unspecified',
  outcome TEXT NOT NULL DEFAULT 'unspecified',
  level_band TEXT NOT NULL DEFAULT 'unspecified',
  event_count INTEGER NOT NULL DEFAULT 0 CHECK(event_count >= 0),
  PRIMARY KEY(day, game_id, action, difficulty, outcome, level_band)
);
CREATE INDEX IF NOT EXISTS research_aggregates_day_idx ON research_aggregates(day);
