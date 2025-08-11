-- SQL migration to create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL,
  client_name varchar(80) NOT NULL,
  client_phone varchar(20) NOT NULL,
  service varchar(20) NOT NULL,
  starts_at timestamptz NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index to speed up lookups by provider
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON bookings(provider_id);
-- Index to query upcoming/past quickly
CREATE INDEX IF NOT EXISTS idx_bookings_starts_at ON bookings(starts_at);