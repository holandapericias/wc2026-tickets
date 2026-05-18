import { getSupabase } from "./supabase";
import { Ticket } from "./types";
import { REAL_DATA_CONNECTED } from "./feature-flags";
import { getEvent, lowestAsk } from "./ticketmaster";

export async function scrapeAllTickets(): Promise<{
  success: boolean;
  scanned: number;
  errors: string[];
}> {
  if (!REAL_DATA_CONNECTED) {
    return {
      success: false,
      scanned: 0,
      errors: [
        "Scraper disabled: real FIFA data source not yet connected. No fake scans will be inserted.",
      ],
    };
  }

  const supabase = getSupabase();
  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("*")
    .order("game_num");

  if (error || !tickets) {
    return { success: false, scanned: 0, errors: [error?.message || "No tickets found"] };
  }

  const errors: string[] = [];
  const inserts: Array<{
    ticket_id: string;
    ask_price: number;
    last_sale_price: number | null;
    source: string;
    comparable_section: string | null;
    comparable_row: string | null;
  }> = [];

  // Fetch live prices for each ticket that has a Ticketmaster event mapping.
  // Tickets without tm_event_id are skipped — they need to be mapped first via
  // /api/scrape/map-events.
  const results = await Promise.allSettled(
    tickets.map(async (ticket: Ticket) => {
      if (!ticket.tm_event_id) {
        return { ticket, skipped: "no tm_event_id" as const };
      }
      const event = await getEvent(ticket.tm_event_id);
      if (!event) {
        return { ticket, skipped: "tm event not found" as const };
      }
      const ask = lowestAsk(event);
      if (!ask) {
        return { ticket, skipped: "no priceRanges from Ticketmaster" as const };
      }
      return { ticket, askPrice: ask.min, maxPrice: ask.max };
    }),
  );

  for (const result of results) {
    if (result.status === "rejected") {
      errors.push(String(result.reason?.message ?? result.reason));
      continue;
    }
    const v = result.value;
    if ("skipped" in v) {
      errors.push(`ticket ${v.ticket.id} (${v.ticket.match_name}): ${v.skipped}`);
      continue;
    }
    inserts.push({
      ticket_id: v.ticket.id,
      ask_price: v.askPrice,
      // Ticketmaster Discovery doesn't expose recent sale prices; leave null.
      last_sale_price: null,
      source: "ticketmaster",
      comparable_section: v.ticket.section,
      comparable_row: v.ticket.row_num,
    });
  }

  if (inserts.length === 0) {
    return { success: false, scanned: 0, errors };
  }

  const { error: insertError } = await supabase.from("price_scans").insert(inserts);

  if (insertError) {
    return { success: false, scanned: 0, errors: [...errors, insertError.message] };
  }

  return { success: true, scanned: inserts.length, errors };
}
