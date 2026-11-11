# Migration 0005: player progression and isolated research stores

Adds cumulative player points and XP, unbounded level progression, per-game lifetime statistics, idempotent attempt history, and durable achievement awards. Existing account and legacy score tables remain available. Existing best scores are backfilled into lifetime progression.

Creates one independent daily aggregate table per active game:
- `research_arithmetic_quiz`
- `research_math_racing`
- `research_sudoku`
- `research_shape_fitting`
- `research_slab_maths`
- `research_shape_architect`
- `research_fraction_bakery`
- `research_little_shop`
- `research_number_maze`
- `research_traffic_control`

Research tables contain only day, action, difficulty, outcome, broad level band, coarse duration band and count. They have no account, parent, school, IP, session or device key.

**Fail-closed:** the research endpoint remains disabled until the child-focused service has a verifiable adult/parent/guardian consent mechanism. Creating the schema does not authorize collection.
