-- Profile achievements are derived from score history. Research events are
-- separate from account identity and accepted only with explicit opt-in.
CREATE TABLE IF NOT EXISTS research_events (
  event_id TEXT PRIMARY KEY,
  participant_hash TEXT NOT NULL,
  category TEXT NOT NULL CHECK(length(category) BETWEEN 1 AND 40),
  action TEXT NOT NULL CHECK(length(action) BETWEEN 1 AND 40),
  detail_json TEXT NOT NULL CHECK(length(detail_json) <= 1200),
  occurred_at TEXT NOT NULL,
  received_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS research_events_participant_idx ON research_events(participant_hash);
CREATE INDEX IF NOT EXISTS research_events_received_idx ON research_events(received_at);
