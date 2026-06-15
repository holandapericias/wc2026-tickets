import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { GAMES } from "@/data/games";
import { MY_TICKETS } from "@/data/my-tickets";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Idempotent seed endpoint. Inserts the 104 games and 18 ticket packs
// from the static seed files if the tables are empty. Safe to re-run
// — it skips tables that already have rows.
//
// Hit it once after running supabase-migration.sql:
//   curl -X POST https://wc2026-tickets.vercel.app/api/seed
export async function POST() {
  const supabase = getSupabase();
  const summary: Record<string, unknown> = {};

  // games
  const { count: gamesCount } = await supabase
    .from("games")
    .select("*", { count: "exact", head: true });
  if ((gamesCount ?? 0) > 0) {
    summary.games = { skipped: true, existing: gamesCount };
  } else {
    const { data, error } = await supabase.from("games").insert(GAMES).select("game_number");
    if (error) {
      return NextResponse.json({ error: `games insert failed: ${error.message}` }, { status: 500 });
    }
    summary.games = { inserted: data?.length ?? 0 };
  }

  // tickets
  const { count: ticketsCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true });
  if ((ticketsCount ?? 0) > 0) {
    summary.tickets = { skipped: true, existing: ticketsCount };
  } else {
    const { data, error } = await supabase.from("tickets").insert(MY_TICKETS).select("id");
    if (error) {
      return NextResponse.json({ error: `tickets insert failed: ${error.message}` }, { status: 500 });
    }
    summary.tickets = { inserted: data?.length ?? 0 };
  }

  return NextResponse.json({ success: true, ...summary });
}

// GET returns counts so we can check seed status without mutating.
export async function GET() {
  const supabase = getSupabase();
  const [{ count: games }, { count: tickets }, { count: results }] = await Promise.all([
    supabase.from("games").select("*", { count: "exact", head: true }),
    supabase.from("tickets").select("*", { count: "exact", head: true }),
    supabase.from("results").select("*", { count: "exact", head: true }),
  ]);
  return NextResponse.json({
    games: games ?? 0,
    tickets: tickets ?? 0,
    results: results ?? 0,
    seeded: (games ?? 0) > 0 && (tickets ?? 0) > 0,
  });
}
