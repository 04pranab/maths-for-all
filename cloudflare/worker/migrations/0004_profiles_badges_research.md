# Migration 0004: profile achievements and consented research events

Badges are computed from validated game-attempt history and best scores; no extra profile table or public personal fields are needed.

Research events are stored separately from users and sessions. The only join-like identifier is a random, client-generated study token whose SHA-256 digest is stored as participant_hash. It is never the account ID, email, username, IP address, or browser fingerprint. The client must send explicit consent=true. Withdrawal deletes all rows for that participant hash. Retention cleanup removes events older than 90 days during accepted research writes.

Apply this migration to the production D1 database before deploying the matching Worker.
