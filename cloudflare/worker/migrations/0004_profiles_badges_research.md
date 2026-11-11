# Migration 0004: profile achievements and aggregate research data

Badges are derived from validated attempt history and best scores; no extra player-profile table or public personal fields are needed.

Research collection is opt-in and deliberately aggregate-only. The table contains daily counts grouped by game, event type, difficulty, outcome, and broad level band. It stores no account ID, username, email, session, participant token, IP address, exact event timestamp, device identifier, question text, or free-form input. The endpoint accepts only a strict allowlist and requires an explicit consent=true flag. It does not accept authenticated account identity. Data older than 90 days is removed during accepted research writes.

Apply the SQL migration to production D1 before deploying the matching Worker. Research remains disabled unless the user has explicitly opted in.
