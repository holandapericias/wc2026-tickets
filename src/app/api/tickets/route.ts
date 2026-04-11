import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { TICKET_SEED_DATA } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabase();
  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("*")
    .order("game_num");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(tickets);
}

export async function POST() {
  const supabase = getSupabase();
  const { data: existing } = await supabase.from("tickets").select("id").limit(1);
  if (existing && existing.length > 0) {
    return NextResponse.json({ message: "Tickets already seeded", count: 0 });
  }

  const { data, error } = await supabase.from("tickets").insert(TICKET_SEED_DATA).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Seeded successfully", count: data.length });
}
