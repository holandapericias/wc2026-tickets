import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { TICKET_SEED_DATA, ROBERTO_SEED_DATA } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  const owner = req.nextUrl.searchParams.get("owner");

  let query = supabase.from("tickets").select("*").order("game_num");
  if (owner) query = query.eq("owner", owner);

  const { data: tickets, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(tickets);
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const owner = req.nextUrl.searchParams.get("owner") || "stephen";
  const seed = owner === "roberto" ? ROBERTO_SEED_DATA : TICKET_SEED_DATA;

  const { data: existing } = await supabase
    .from("tickets")
    .select("id")
    .eq("owner", owner)
    .limit(1);
  if (existing && existing.length > 0) {
    return NextResponse.json({ message: `Tickets already seeded for ${owner}`, count: 0 });
  }

  const { data, error } = await supabase.from("tickets").insert(seed).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: `Seeded ${owner} successfully`, count: data.length });
}
