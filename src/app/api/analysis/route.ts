import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { generateTicketAnalysis, generateSellRecommendation } from "@/lib/analysis";
import { calculateSignal, calculateTrend, getDaysUntil } from "@/lib/signals";
import { SELLER_FEE } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  const ticketId = req.nextUrl.searchParams.get("ticket_id");
  if (!ticketId) {
    return NextResponse.json({ error: "ticket_id required" }, { status: 400 });
  }

  const { data: ticket } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", ticketId)
    .single();

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const { data: scans } = await supabase
    .from("price_scans")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("scanned_at", { ascending: false })
    .limit(30);

  const latestAsk = scans?.[0]?.ask_price;
  const multiple = latestAsk ? latestAsk / ticket.cost_per_ticket : null;
  const daysLeft = getDaysUntil(ticket.match_date);
  const trend = calculateTrend(scans || []);
  const { signal, score } = calculateSignal(ticket, multiple, daysLeft, trend);

  const [analysis, recommendation] = await Promise.all([
    generateTicketAnalysis(ticket, scans || [], signal, score, multiple),
    generateSellRecommendation(ticket, scans || [], signal, score, multiple),
  ]);

  return NextResponse.json({
    analysis,
    recommendation,
    signal,
    score,
    multiple,
    you_receive: latestAsk ? latestAsk * (1 - SELLER_FEE) : null,
  });
}
