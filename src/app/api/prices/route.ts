import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  const ticketId = req.nextUrl.searchParams.get("ticket_id");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "100");

  let query = supabase
    .from("price_scans")
    .select("*")
    .order("scanned_at", { ascending: false })
    .limit(limit);

  if (ticketId) {
    query = query.eq("ticket_id", ticketId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
