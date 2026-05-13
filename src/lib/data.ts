import { getSupabase } from "./supabase";
import { Owner, Ticket, PriceScan, TicketWithSignal, PortfolioSummary } from "./types";
import { calculateSignal, calculateTrend, getDaysUntil } from "./signals";
import { SELLER_FEE, TOTAL_COST_BASIS, TARGET_NET_PROFIT } from "./seed";

export async function getTicketsWithSignals(owner?: Owner): Promise<TicketWithSignal[]> {
  const supabase = getSupabase();
  let query = supabase.from("tickets").select("*").order("game_num").order("match_date");
  if (owner) query = query.eq("owner", owner);
  const { data: tickets } = await query;

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
    const hasCostBasis = ticket.cost_per_ticket > 0;
    const multiple = latestAsk && hasCostBasis ? latestAsk / ticket.cost_per_ticket : null;
    const youReceive = latestAsk ? latestAsk * (1 - SELLER_FEE) * ticket.qty : null;
    const netProfit = youReceive != null && hasCostBasis ? youReceive - ticket.total_cost : null;
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

export function getPortfolioSummary(
  tickets: TicketWithSignal[],
  options?: { costBasis?: number; targetProfit?: number },
): PortfolioSummary {
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

  const costBasis = options?.costBasis ?? TOTAL_COST_BASIS;
  const target = options?.targetProfit ?? TARGET_NET_PROFIT;
  const totalNetProfit = totalYouReceive - costBasis;

  return {
    total_cost: costBasis,
    total_market_value: totalMarketValue,
    total_you_receive: totalYouReceive,
    total_net_profit: totalNetProfit,
    vs_target: target - totalNetProfit,
    avg_multiple: multiplesCount > 0 ? multiplesSum / multiplesCount : 0,
    fire_count: fireCount,
    urgent_count: urgentCount,
    target,
  };
}

export function sumCostBasis(tickets: { total_cost: number }[]): number {
  return tickets.reduce((sum, t) => sum + (Number(t.total_cost) || 0), 0);
}
