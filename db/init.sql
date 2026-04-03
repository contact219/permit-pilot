CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Session table for connect-pg-simple
CREATE TABLE IF NOT EXISTS "session" (
  "id" varchar NOT NULL,
  "sess" jsonb NOT NULL,
  "expire" timestamp(6) NOT NULL,
  PRIMARY KEY ("id")
);

-- Index on expire for cleanup
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

-- Drizzle will handle table creation via migrations
