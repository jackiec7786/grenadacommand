CREATE TABLE IF NOT EXISTS user_state (
  user_id      TEXT PRIMARY KEY,
  state        JSONB NOT NULL DEFAULT '{}',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_credentials (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL,
  platform       TEXT NOT NULL,
  category       TEXT NOT NULL DEFAULT '',
  username       TEXT NOT NULL DEFAULT '',
  email          TEXT NOT NULL DEFAULT '',
  password       TEXT NOT NULL DEFAULT '',
  account_number TEXT NOT NULL DEFAULT '',
  notes          TEXT NOT NULL DEFAULT '',
  url            TEXT NOT NULL DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_credentials_user_id ON user_credentials(user_id);
