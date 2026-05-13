import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  const ticketId = req.nextUrl.searchParams.get("ticket_id");
  const owner = req.nextUrl.searchParams.get("owner");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "100");

  let query = supabase
    .from("price_scans")
    .select("*")
    .order("scanned_at", { ascending: false })
    .limit(limit);

  if (ticketId) {
    query = query.eq("ticket_id", ticketId);
  } else if (owner) {
    const { data: ownerTickets } = await supabase
      .from("tickets")
      .select("id")
      .eq("owner", owner);
    const ids = (ownerTickets || []).map((t: { id: string }) => t.id);
    if (ids.length === 0) {
      return NextResponse.json([]);
    }
    query = query.in("ticket_id", ids);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
