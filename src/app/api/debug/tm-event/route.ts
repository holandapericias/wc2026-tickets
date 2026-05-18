import { NextRequest, NextResponse } from "next/server";
import { getEvent } from "@/lib/ticketmaster";

export const dynamic = "force-dynamic";

// Diagnostic: returns the raw Ticketmaster Discovery API response for a single
// event ID. Lets us see exactly which fields TM populates for WC2026 — in
// particular, whether priceRanges has data or is just absent for these events.
export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get("id");
  if (!eventId) {
    return NextResponse.json({ error: "id query param required" }, { status: 400 });
  }
  try {
    const event = await getEvent(eventId);
    return NextResponse.json({
      requested_id: eventId,
      found: !!event,
      name: event?.name,
      url: event?.url,
      venue: event?._embedded?.venues?.[0]?.name,
      dates: event?.dates,
      priceRanges: event?.priceRanges,
      // Include the whole raw event so we can see any field we missed.
      raw: event,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
