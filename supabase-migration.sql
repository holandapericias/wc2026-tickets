-- WC2026 Ticket Intelligence Database Schema

CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner TEXT NOT NULL DEFAULT 'stephen',
  game_num INTEGER NOT NULL,
  match_name TEXT NOT NULL,
  match_date DATE NOT NULL,
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  category INTEGER NOT NULL,
  section TEXT NOT NULL,
  row_num TEXT NOT NULL,
  seats TEXT NOT NULL,
  qty INTEGER NOT NULL,
  cost_per_ticket NUMERIC(10,2) NOT NULL,
  total_cost NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Idempotent migration for existing databases
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS owner TEXT NOT NULL DEFAULT 'stephen';
CREATE INDEX IF NOT EXISTS idx_tickets_owner ON tickets(owner);

CREATE TABLE IF NOT EXISTS price_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  ask_price NUMERIC(10,2),
  last_sale_price NUMERIC(10,2),
  source TEXT NOT NULL,
  comparable_section TEXT,
  comparable_row TEXT
);

CREATE TABLE IF NOT EXISTS news_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_num INTEGER NOT NULL,
  headline TEXT NOT NULL,
  summary TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  impact TEXT CHECK (impact IN ('high', 'medium', 'low')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_price_scans_ticket ON price_scans(ticket_id);
CREATE INDEX idx_price_scans_time ON price_scans(scanned_at DESC);
CREATE INDEX idx_news_game ON news_cache(game_num);
CREATE INDEX idx_tickets_game ON tickets(game_num);
