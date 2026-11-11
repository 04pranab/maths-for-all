-- Research data is aggregate-only and deliberately has no user, participant,
-- IP, device, or session identifier. One row is a daily count bucket.
CREATE TABLE IF NOT EXISTS research_aggregates (
  day TEXT NOT NULL,
  game_id TEXT NOT NULL,
  action TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'unspecified',
  outcome TEXT NOT NULL DEFAULT 'unspecified',
  level_band TEXT NOT NULL DEFAULT 'unspecified',
  duration_band TEXT NOT NULL DEFAULT 'unspecified',
  event_count INTEGER NOT NULL DEFAULT 0 CHECK(event_count >= 0),
  PRIMARY KEY(day, game_id, action, difficulty, outcome, level_band, duration_band)
);
CREATE INDEX IF NOT EXISTS research_aggregates_day_idx ON research_aggregates(day);

-- Rebase pre-existing normalized 0–1000 best scores onto the new game budgets.
-- Historic difficulty metadata was not retained, so treat legacy results as
-- the conservative starter tier rather than retroactively granting hard-mode points.
UPDATE best_game_scores SET points = CAST(ROUND(points * CASE game_id
  WHEN 'arithmetic-quiz' THEN 140 WHEN 'math-racing' THEN 180 WHEN 'sudoku' THEN 350
  WHEN 'shape-fitting' THEN 220 WHEN 'slab-maths' THEN 120 WHEN 'shape-architect' THEN 280
  WHEN 'fraction-bakery' THEN 230 WHEN 'little-shop' THEN 120 WHEN 'number-maze' THEN 250
  ELSE 100 END * 0.45 / 1000.0) AS INTEGER);
UPDATE traffic_control_best_scores SET points = CAST(ROUND(points * 260 * 0.45 / 1000.0) AS INTEGER);
