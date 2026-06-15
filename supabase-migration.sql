-- WC2026 "Meu Chaveamento" — fresh schema.
--
-- Drops legacy tables from the previous (price-tracking) project. The
-- user explicitly chose to reset the database in this rebuild.

DROP TABLE IF EXISTS news_cache CASCADE;
DROP TABLE IF EXISTS price_scans CASCADE;
DROP TABLE IF EXISTS tickets     CASCADE;

-- ────────────────────────── games ──────────────────────────
-- The 104 WC2026 matches. game_number is FIFA's official 1-104 ordering.
CREATE TABLE games (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_number   INTEGER NOT NULL UNIQUE,
  stage         TEXT NOT NULL CHECK (stage IN ('group','r32','r16','qf','sf','bronze','final')),
  match_date    DATE NOT NULL,
  city          TEXT NOT NULL,
  venue         TEXT NOT NULL,
  group_name    TEXT,                            -- 'A'..'L' for group stage, NULL for knockout
  team1         TEXT,                            -- actual team for group stage
  team2         TEXT,
  team1_ref     TEXT,                            -- placeholder for knockout ("2A", "W74", "3A/B/C/D/F")
  team2_ref     TEXT,
  resolved_team1 TEXT,                           -- filled by resolver as conditions lock
  resolved_team2 TEXT,
  resolved_team1_status TEXT CHECK (resolved_team1_status IN ('confirmed','probable','narrowed','open')),
  resolved_team2_status TEXT CHECK (resolved_team2_status IN ('confirmed','probable','narrowed','open')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_games_game_number ON games(game_number);
CREATE INDEX idx_games_match_date  ON games(match_date);
CREATE INDEX idx_games_stage       ON games(stage);

-- ────────────────────────── results ──────────────────────────
-- Confirmed and pending match scores. One row per game; user confirms
-- before scores propagate into standings.
CREATE TABLE results (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_number   INTEGER NOT NULL UNIQUE REFERENCES games(game_number) ON DELETE CASCADE,
  score1        INTEGER NOT NULL,
  score2        INTEGER NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('pending_confirmation','confirmed')),
  source        TEXT NOT NULL CHECK (source IN ('api','manual')),
  confirmed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_results_status ON results(status);

-- ────────────────────────── tickets ──────────────────────────
-- The user's 18 ticket packs. Two packs can share a game_number
-- (e.g. game 77 has Cat-1 + Cat-2 packs).
CREATE TABLE tickets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_number     INTEGER NOT NULL REFERENCES games(game_number),
  category        INTEGER NOT NULL,
  section         TEXT NOT NULL,
  row_num         TEXT NOT NULL,
  seats           TEXT NOT NULL,
  qty             INTEGER NOT NULL,
  cost_per_ticket NUMERIC(10,2) NOT NULL,
  total_cost      NUMERIC(10,2) NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_tickets_game_number ON tickets(game_number);

-- ────────────────────────── change_log ──────────────────────────
-- Audit trail of every meaningful state change. Drives the "novidade"
-- banner ("Game 76 is now BRAZIL vs ..."). Auditability was the lesson
-- from the previous fake-data fiasco.
CREATE TABLE change_log (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type        TEXT NOT NULL,      -- 'result_confirmed' | 'team_resolved' | 'team_probable' | ...
  game_number       INTEGER,
  description       TEXT NOT NULL,
  affects_my_tickets BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_change_log_created   ON change_log(created_at DESC);
CREATE INDEX idx_change_log_my_tickets ON change_log(affects_my_tickets, created_at DESC);

-- ────────────────────────── settings ──────────────────────────
-- Key/value store for tournament-wide config (last refresh time, etc.).
CREATE TABLE settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
