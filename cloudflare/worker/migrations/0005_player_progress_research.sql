-- 0005: cumulative player progression and achievements. Research collection is not provisioned.
CREATE TABLE IF NOT EXISTS player_progress(user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,total_points INTEGER NOT NULL DEFAULT 0 CHECK(total_points>=0),total_xp INTEGER NOT NULL DEFAULT 0 CHECK(total_xp>=0),level INTEGER NOT NULL DEFAULT 1 CHECK(level>=1),xp_into_level INTEGER NOT NULL DEFAULT 0 CHECK(xp_into_level>=0),xp_to_next INTEGER NOT NULL DEFAULT 125 CHECK(xp_to_next>0),total_attempts INTEGER NOT NULL DEFAULT 0 CHECK(total_attempts>=0),updated_at TEXT NOT NULL DEFAULT(strftime('%Y-%m-%dT%H:%M:%fZ','now')));
CREATE TABLE IF NOT EXISTS player_game_progress(user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,game_id TEXT NOT NULL,total_points INTEGER NOT NULL DEFAULT 0 CHECK(total_points>=0),total_xp INTEGER NOT NULL DEFAULT 0 CHECK(total_xp>=0),attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts>=0),perfect_clears INTEGER NOT NULL DEFAULT 0 CHECK(perfect_clears>=0),hard_clears INTEGER NOT NULL DEFAULT 0 CHECK(hard_clears>=0),current_streak INTEGER NOT NULL DEFAULT 0 CHECK(current_streak>=0),best_streak INTEGER NOT NULL DEFAULT 0 CHECK(best_streak>=0),highest_level INTEGER NOT NULL DEFAULT 1 CHECK(highest_level>=1),last_played_at TEXT,PRIMARY KEY(user_id,game_id));
CREATE TABLE IF NOT EXISTS player_game_attempts(attempt_id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,game_id TEXT NOT NULL,score_percent REAL NOT NULL CHECK(score_percent BETWEEN 0 AND 100),points INTEGER NOT NULL CHECK(points>=0),duration_seconds INTEGER NOT NULL CHECK(duration_seconds BETWEEN 3 AND 14400),difficulty TEXT NOT NULL,level INTEGER NOT NULL DEFAULT 1 CHECK(level>=1),hints_used INTEGER NOT NULL DEFAULT 0 CHECK(hints_used>=0),mistakes INTEGER NOT NULL DEFAULT 0 CHECK(mistakes>=0),perfect INTEGER NOT NULL DEFAULT 0 CHECK(perfect IN(0,1)),created_at TEXT NOT NULL DEFAULT(strftime('%Y-%m-%dT%H:%M:%fZ','now')));
CREATE INDEX IF NOT EXISTS player_progress_total_points_idx ON player_progress(total_points DESC);
CREATE INDEX IF NOT EXISTS player_game_progress_rank_idx ON player_game_progress(game_id,total_points DESC);
CREATE INDEX IF NOT EXISTS player_game_attempts_ranking_idx ON player_game_attempts(game_id,points DESC,created_at);
CREATE INDEX IF NOT EXISTS player_game_attempts_user_idx ON player_game_attempts(user_id,game_id,created_at);
CREATE TABLE IF NOT EXISTS player_badges(user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,game_id TEXT NOT NULL,badge_id TEXT NOT NULL,earned_at TEXT NOT NULL DEFAULT(strftime('%Y-%m-%dT%H:%M:%fZ','now')),PRIMARY KEY(user_id,game_id,badge_id));
INSERT OR IGNORE INTO player_game_progress(user_id,game_id,total_points,total_xp,attempts,highest_level)
SELECT user_id,game_id,points,points,COALESCE((SELECT COUNT(*) FROM game_attempts a WHERE a.user_id=b.user_id AND a.game_id=b.game_id),0),1 FROM best_game_scores b;
INSERT OR IGNORE INTO player_game_progress(user_id,game_id,total_points,total_xp,attempts,highest_level)
SELECT user_id,'traffic-control',points,points,COALESCE((SELECT COUNT(*) FROM traffic_control_attempts a WHERE a.user_id=b.user_id),0),1 FROM traffic_control_best_scores b;
INSERT OR IGNORE INTO player_progress(user_id,total_points,total_xp,level,xp_into_level,xp_to_next,total_attempts)
SELECT u.id,COALESCE(SUM(g.total_points),0),COALESCE(SUM(g.total_xp),0),1,0,125,
COALESCE((SELECT COUNT(*) FROM game_attempts a WHERE a.user_id=u.id),0)+COALESCE((SELECT COUNT(*) FROM traffic_control_attempts t WHERE t.user_id=u.id),0)
FROM users u LEFT JOIN player_game_progress g ON g.user_id=u.id GROUP BY u.id;
-- Remove the legacy aggregate research store. No research event tables are created.
DROP TABLE IF EXISTS research_aggregates;
