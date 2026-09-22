CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('fr', 'en')),
  created_at INTEGER NOT NULL,
  ip_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx
  ON contact_messages(created_at);

CREATE INDEX IF NOT EXISTS contact_messages_ip_created_idx
  ON contact_messages(ip_hash, created_at);

PRAGMA optimize;
