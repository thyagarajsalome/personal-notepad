-- Run this SQL in the Neon SQL editor to set up the database
-- Or the app will auto-create the table on startup

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  last_modified BIGINT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General'
);
