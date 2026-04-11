import { getSupabase } from "./supabase";
import { Ticket, PriceScan, TicketWithSignal, PortfolioSummary } from "./types";
import { calculateSignal, calculateTrend, getDaysUntil } from "./signals";
import { SELLER_FEE, TOTAL_COST_BASIS, TARGET_NET_PROFIT } from "./seed";

export async function getTicketsWithSignals(): Promise<TicketWithSignal[]> {
  const supabase = getSupabase();
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .order("game_num");

  if (!tickets || tickets.length === 0) return [];

  const { data: allScans } = await supabase
    .from("price_scans")
    .select("*")
    .order("scanned_at", { ascending: false });

  const scansByTicket = new Map<string, PriceScan[]>();
  (allScans || []).forEach((scan: PriceScan) => {
    const existing = scansByTicket.get(scan.ticket_id) || [];
    existing.push(scan);
    scansByTicket.set(scan.ticket_id, existing);
  });

  return tickets.map((ticket: Ticket) => {
    const scans = scansByTicket.get(ticket.id) || [];
    const latest = scans[0];
    const latestAsk = latest?.ask_price ?? null;
    const latestSale = latest?.last_sale_price ?? null;
    const multiple = latestAsk ? latestAsk / ticket.cost_per_ticket : null;
    const youReceive = latestAsk ? latestAsk * (1 - SELLER_FEE) * ticket.qty : null;
    const netProfit = youReceive != null ? youReceive - ticket.total_cost : null;
    const daysLeft = getDaysUntil(ticket.match_date);
    const trend = calculateTrend(scans);
    const { signal, score } = calculateSignal(ticket, multiple, daysLeft, trend);

    const priceHistory = scans
      .slice()
      .reverse()
      .map((s) => ({
        date: s.scanned_at,
        ask: s.ask_price,
        sale: s.last_sale_price,
      }));

    return {
      ...ticket,
      latest_ask: latestAsk,
      latest_sale: latestSale,
      comparable_section: latest?.comparable_section ?? null,
      comparable_row: latest?.comparable_row ?? null,
      multiple,
      you_receive: youReceive,
      net_profit: netProfit,
      days_left: daysLeft,
      signal,
      score,
      trend,
      price_history: priceHistory,
    };
  });
}

export function getPortfolioSummary(tickets: TicketWithSignal[]): PortfolioSummary {
  let totalMarketValue = 0;
  let totalYouReceive = 0;
  let multiplesSum = 0;
  let multiplesCount = 0;
  let fireCount = 0;
  let urgentCount = 0;

  tickets.forEach((t) => {
    if (t.latest_ask != null) {
      totalMarketValue += t.latest_ask * t.qty;
    }
    if (t.you_receive != null) {
      totalYouReceive += t.you_receive;
    }
    if (t.multiple != null) {
      multiplesSum += t.multiple;
      multiplesCount++;
    }
    if (t.signal === "FIRE") fireCount++;
    if (t.days_left <= 21 && t.signal !== "FIRE") urgentCount++;
  });

  const totalNetProfit = totalYouReceive - TOTAL_COST_BASIS;

  return {
    total_cost: TOTAL_COST_BASIS,
    total_market_value: totalMarketValue,
    total_you_receive: totalYouReceive,
    total_net_profit: totalNetProfit,
    vs_target: TARGET_NET_PROFIT - totalNetProfit,
    avg_multiple: multiplesCount > 0 ? multiplesSum / multiplesCount : 0,
    fire_count: fireCount,
    urgent_count: urgentCount,
    target: TARGET_NET_PROFIT,
  };
}
