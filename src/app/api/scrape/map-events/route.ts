import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { searchEvents, TMEvent } from "@/lib/ticketmaster";
import { Ticket } from "@/lib/types";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

// Admin endpoint: for every ticket without a tm_event_id, search Ticketmaster
// for WC2026 matches on the ticket's date, pick the one whose venue/match
// matches best, return suggestions. Use ?apply=true to persist.
export async function POST(req: NextRequest) {
  const apply = req.nextUrl.searchParams.get("apply") === "true";

  const supabase = getSupabase();
  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("*")
    .is("tm_event_id", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!tickets || tickets.length === 0) {
    return NextResponse.json({ message: "All tickets already mapped", mapped: 0, suggestions: [] });
  }

  // Deduplicate by (match_name, match_date) — multiple tickets can share an event.
  const eventKeys = new Map<string, Ticket>();
  for (const t of tickets) {
    const key = `${t.match_name}|${t.match_date}`;
    if (!eventKeys.has(key)) eventKeys.set(key, t);
  }

  const suggestions: Array<{
    match_name: string;
    match_date: string;
    candidates: Array<{ id: string; name: string; venue: string | undefined; url: string | undefined; score: number }>;
    picked_id: string | null;
    error?: string;
  }> = [];

  // Cache by date — many tickets share dates, so we hit TM once per date.
  const eventsByDate = new Map<string, TMEvent[]>();

  for (const ticket of Array.from(eventKeys.values())) {
    try {
      let dateEvents = eventsByDate.get(ticket.match_date);
      if (!dateEvents) {
        dateEvents = await searchEvents("World Cup", ticket.match_date);
        eventsByDate.set(ticket.match_date, dateEvents);
      }

      const scored = dateEvents
        .map((e) => ({ event: e, score: scoreCandidate(e, ticket) }))
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score);

      suggestions.push({
        match_name: ticket.match_name,
        match_date: ticket.match_date,
        candidates: scored.slice(0, 5).map(({ event, score }) => ({
          id: event.id,
          name: event.name,
          venue: event._embedded?.venues?.[0]?.name,
          url: event.url,
          score,
        })),
        picked_id: scored[0]?.event.id ?? null,
      });

      if (apply && scored[0]) {
        await supabase
          .from("tickets")
          .update({ tm_event_id: scored[0].event.id })
          .eq("match_name", ticket.match_name)
          .eq("match_date", ticket.match_date);
      }
    } catch (e) {
      suggestions.push({
        match_name: ticket.match_name,
        match_date: ticket.match_date,
        candidates: [],
        picked_id: null,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return NextResponse.json({
    applied: apply,
    mapped: apply ? suggestions.filter((s) => s.picked_id).length : 0,
    total_unmapped: suggestions.length,
    suggestions,
  });
}

// Higher = better match. Combines venue match, name overlap, and a baseline
// for "looks like a WC match" so we don't pick unrelated TM events.
function scoreCandidate(event: TMEvent, ticket: Ticket): number {
  const eventName = event.name.toLowerCase();
  const eventVenue = (event._embedded?.venues?.[0]?.name ?? "").toLowerCase();
  let score = 0;

  // Must look like a WC2026 event — TM names them "World Cup: Match N ..." or
  // "World Cup Round of N: ...". Reject random fan-event lookalikes early.
  if (eventName.includes("world cup")) score += 10;
  else return 0;

  // Venue exact match is the strongest signal.
  if (ticket.venue && ticket.venue !== "TBD") {
    const v = ticket.venue.toLowerCase();
    if (eventVenue && (eventVenue.includes(v) || v.includes(eventVenue))) {
      score += 50;
    }
  }

  // Match number from the ticket name (e.g. "Match 9", "Match 89") vs TM name.
  const ourMatchNumMatch = /match\s+(\d+)/i.exec(ticket.match_name);
  const tmMatchNumMatch = /match\s+(\d+)/i.exec(event.name);
  if (ourMatchNumMatch && tmMatchNumMatch && ourMatchNumMatch[1] === tmMatchNumMatch[1]) {
    score += 30;
  }

  // Game number from our DB (if populated) vs TM match N.
  if (ticket.game_num > 0 && tmMatchNumMatch && parseInt(tmMatchNumMatch[1], 10) === ticket.game_num) {
    score += 40;
  }

  // Team name overlap (for group stage tickets that have real team names).
  const teams = ticket.match_name
    .toLowerCase()
    .replace(/^(r32|r16|qf|sf|f):\s*/i, "")
    .split(/\s+vs\.?\s+/);
  for (const team of teams) {
    if (team.length > 3 && eventName.includes(team)) {
      score += 10;
    }
  }

  // Knockout-round signal: tickets named "R16/R32/QF" should pair with TM
  // "Round of 16/32" or "Quarter-Finals" labels.
  if (/^r32:/i.test(ticket.match_name) && eventName.includes("round of 32")) score += 20;
  if (/^r16:/i.test(ticket.match_name) && eventName.includes("round of 16")) score += 20;
  if (/^qf:/i.test(ticket.match_name) && (eventName.includes("quarter") || eventName.includes("qf"))) score += 20;

  return score;
}
