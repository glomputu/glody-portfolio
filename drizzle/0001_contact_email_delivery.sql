ALTER TABLE contact_messages ADD COLUMN delivery_status TEXT NOT NULL DEFAULT 'received';
ALTER TABLE contact_messages ADD COLUMN owner_email_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE contact_messages ADD COLUMN visitor_email_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE contact_messages ADD COLUMN owner_email_id TEXT NOT NULL DEFAULT '';
ALTER TABLE contact_messages ADD COLUMN visitor_email_id TEXT NOT NULL DEFAULT '';
ALTER TABLE contact_messages ADD COLUMN email_last_error TEXT NOT NULL DEFAULT '';
ALTER TABLE contact_messages ADD COLUMN email_attempted_at INTEGER;

CREATE INDEX IF NOT EXISTS contact_messages_delivery_status_idx
  ON contact_messages(delivery_status, created_at);

PRAGMA optimize;
