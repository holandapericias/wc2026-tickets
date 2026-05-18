import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { searchEvents, TMEvent } from "@/lib/ticketmaster";
import { Ticket } from "@/lib/types";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

// Admin endpoint: for every ticket without a tm_event_id, search Ticketmaster
// by match_name + date, return candidate event matches. Use ?apply=true to
// persist the best (first) match automatically.
//
// Output is a list of suggested mappings so the operator can sanity-check
// before persisting if they don't trust the auto-match.
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
    candidates: Array<{ id: string; name: string; venue: string | undefined; url: string | undefined }>;
    picked_id: string | null;
  }> = [];

  for (const ticket of Array.from(eventKeys.values())) {
    let candidates: TMEvent[] = [];
    try {
      // Try a few keyword variants — TM's full-text search is fuzzy but match
      // names like "R16: Winner G74 vs Winner G77" rarely return useful hits.
      // Falls back to "World Cup <city>" + the date filter.
      const queries = buildQueryVariants(ticket);
      for (const q of queries) {
        candidates = await searchEvents(q, ticket.match_date);
        if (candidates.length > 0) break;
      }
    } catch (e) {
      suggestions.push({
        match_name: ticket.match_name,
        match_date: ticket.match_date,
        candidates: [],
        picked_id: null,
      });
      continue;
    }

    const picked = pickBest(candidates, ticket);

    suggestions.push({
      match_name: ticket.match_name,
      match_date: ticket.match_date,
      candidates: candidates.slice(0, 5).map((c) => ({
        id: c.id,
        name: c.name,
        venue: c._embedded?.venues?.[0]?.name,
        url: c.url,
      })),
      picked_id: picked?.id ?? null,
    });

    if (apply && picked) {
      await supabase
        .from("tickets")
        .update({ tm_event_id: picked.id })
        .eq("match_name", ticket.match_name)
        .eq("match_date", ticket.match_date);
    }
  }

  return NextResponse.json({
    applied: apply,
    mapped: apply ? suggestions.filter((s) => s.picked_id).length : 0,
    suggestions,
  });
}

function buildQueryVariants(ticket: Ticket): string[] {
  const variants: string[] = [];
  const name = ticket.match_name;
  variants.push(name);
  // Knockout placeholders are unhelpful as search terms — use city + "world cup".
  if (/^(R32|R16|QF|SF|F):/i.test(name) || /winner|2nd place|1st place|best 3rd/i.test(name)) {
    if (ticket.city && ticket.city !== "TBD") {
      variants.push(`World Cup ${ticket.city}`);
    }
    variants.push("FIFA World Cup");
  }
  return variants;
}

function pickBest(candidates: TMEvent[], ticket: Ticket): TMEvent | null {
  if (candidates.length === 0) return null;
  // Prefer events whose venue matches the ticket's venue (when we know it).
  if (ticket.venue && ticket.venue !== "TBD") {
    const venueMatch = candidates.find((c) =>
      c._embedded?.venues?.some((v) =>
        v.name?.toLowerCase().includes(ticket.venue.toLowerCase()),
      ),
    );
    if (venueMatch) return venueMatch;
  }
  // Otherwise the first result (TM ranks by relevance).
  return candidates[0];
}
