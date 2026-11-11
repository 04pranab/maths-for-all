# Migration 0005: player progression and achievements

Adds cumulative player points and XP, unbounded level progression, per-game lifetime statistics, idempotent attempt history, and durable achievement awards. Existing account and legacy score tables remain available. Existing best scores are backfilled into lifetime progression.

The migration removes the legacy `research_aggregates` table and its historical aggregate rows. No research event tables are created.

**Research status:** OFF. No browser research events are queued or uploaded, and the Worker research endpoint always returns HTTP 503 without touching D1. Player accounts, scores, XP, achievements and leaderboard data continue to work independently.

This migration preserves the existing `users`, `sessions`, `game_attempts`, `best_game_scores`, and Traffic Control score tables. It creates only player progression, per-game progress, attempt history and badge tables.
