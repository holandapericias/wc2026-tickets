export interface Ticket {
  id: string;
  game_num: number;
  match_name: string;
  match_date: string;
  venue: string;
  city: string;
  category: number;
  section: string;
  row_num: string;
  seats: string;
  qty: number;
  cost_per_ticket: number;
  total_cost: number;
}

export interface PriceScan {
  id: string;
  ticket_id: string;
  scanned_at: string;
  ask_price: number | null;
  last_sale_price: number | null;
  source: string;
  comparable_section: string | null;
  comparable_row: string | null;
}

export interface NewsItem {
  id: string;
  game_num: number;
  headline: string;
  summary: string;
  sentiment: "positive" | "negative" | "neutral";
  impact: "high" | "medium" | "low";
  created_at: string;
}

export type SignalLevel = "FIRE" | "LIST NOW" | "SELL" | "WATCH" | "HOLD";

export interface TicketWithSignal extends Ticket {
  latest_ask: number | null;
  latest_sale: number | null;
  comparable_section: string | null;
  comparable_row: string | null;
  multiple: number | null;
  you_receive: number | null;
  net_profit: number | null;
  days_left: number;
  signal: SignalLevel;
  score: number;
  trend: "rising" | "falling" | "flat";
  price_history: { date: string; ask: number | null; sale: number | null }[];
}

export interface PortfolioSummary {
  total_cost: number;
  total_market_value: number;
  total_you_receive: number;
  total_net_profit: number;
  vs_target: number;
  avg_multiple: number;
  fire_count: number;
  urgent_count: number;
  target: number;
}

export interface ScraperStatus {
  last_scrape: string | null;
  next_scrape: string;
  tickets_scanned: number;
  total_tickets: number;
  sources: { name: string; count: number; last_success: string | null }[];
  per_ticket: { ticket_id: string; game_num: number; match_name: string; last_scan: string | null; scan_count: number }[];
}
