export const contactSchemaStatements = [
  `CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    organization TEXT NOT NULL DEFAULT '',
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    locale TEXT NOT NULL CHECK (locale IN ('fr', 'en')),
    created_at INTEGER NOT NULL,
    ip_hash TEXT NOT NULL,
    delivery_status TEXT NOT NULL DEFAULT 'received' CHECK (delivery_status IN ('received', 'email_sent', 'email_partial', 'email_failed')),
    owner_email_status TEXT NOT NULL DEFAULT 'pending' CHECK (owner_email_status IN ('pending', 'sent', 'failed')),
    visitor_email_status TEXT NOT NULL DEFAULT 'pending' CHECK (visitor_email_status IN ('pending', 'sent', 'failed')),
    owner_email_id TEXT NOT NULL DEFAULT '',
    visitor_email_id TEXT NOT NULL DEFAULT '',
    email_last_error TEXT NOT NULL DEFAULT '',
    email_attempted_at INTEGER
  )`,
  'CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages(created_at)',
  'CREATE INDEX IF NOT EXISTS contact_messages_ip_created_idx ON contact_messages(ip_hash, created_at)',
] as const;

export const contactSchemaUpgradeStatements = [
  "ALTER TABLE contact_messages ADD COLUMN delivery_status TEXT NOT NULL DEFAULT 'received'",
  "ALTER TABLE contact_messages ADD COLUMN owner_email_status TEXT NOT NULL DEFAULT 'pending'",
  "ALTER TABLE contact_messages ADD COLUMN visitor_email_status TEXT NOT NULL DEFAULT 'pending'",
  "ALTER TABLE contact_messages ADD COLUMN owner_email_id TEXT NOT NULL DEFAULT ''",
  "ALTER TABLE contact_messages ADD COLUMN visitor_email_id TEXT NOT NULL DEFAULT ''",
  "ALTER TABLE contact_messages ADD COLUMN email_last_error TEXT NOT NULL DEFAULT ''",
  'ALTER TABLE contact_messages ADD COLUMN email_attempted_at INTEGER',
] as const;

export const contactSchemaPostUpgradeStatements = [
  'CREATE INDEX IF NOT EXISTS contact_messages_delivery_status_idx ON contact_messages(delivery_status, created_at)',
] as const;
