// Ticketmaster Discovery API v2 client.
// Docs: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
// Requires TICKETMASTER_API_KEY env var (Consumer Key from a registered app).

const BASE_URL = "https://app.ticketmaster.com/discovery/v2";

export interface TMPriceRange {
  type: string;
  currency: string;
  min: number;
  max: number;
}

export interface TMEvent {
  id: string;
  name: string;
  url?: string;
  dates?: {
    start?: {
      localDate?: string;
      localTime?: string;
    };
  };
  priceRanges?: TMPriceRange[];
  _embedded?: {
    venues?: Array<{
      name?: string;
      city?: { name?: string };
    }>;
  };
}

function apiKey(): string {
  const key = process.env.TICKETMASTER_API_KEY;
  if (!key) {
    throw new Error("TICKETMASTER_API_KEY environment variable is not set");
  }
  return key;
}

// List every event matching a keyword on a given date. The date is treated
// as the local calendar date of the match; the UTC window is widened to
// (localDate 00:00 UTC) through (localDate+1 12:00 UTC) so we catch evening
// kickoffs that roll over to the next UTC day. Without this, Brazil vs
// Haiti at 8:30pm EDT (12:30am UTC next day) was being missed entirely.
export async function searchEvents(
  keyword: string,
  localDate: string, // YYYY-MM-DD
): Promise<TMEvent[]> {
  const next = new Date(`${localDate}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const nextDate = next.toISOString().slice(0, 10);

  const params = new URLSearchParams({
    apikey: apiKey(),
    keyword,
    startDateTime: `${localDate}T00:00:00Z`,
    endDateTime: `${nextDate}T12:00:00Z`,
    size: "100",
    locale: "*",
    classificationName: "Sports",
  });
  const res = await fetch(`${BASE_URL}/events.json?${params}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Ticketmaster search failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data?._embedded?.events ?? [];
}

// Fetch a single event by ID — used by the live price scraper.
export async function getEvent(eventId: string): Promise<TMEvent | null> {
  const params = new URLSearchParams({
    apikey: apiKey(),
    locale: "*",
  });
  const res = await fetch(`${BASE_URL}/events/${eventId}.json?${params}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Ticketmaster getEvent failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Extract the lowest current ask. priceRanges typically contains one or more
// entries; we want the minimum across all of them.
export function lowestAsk(event: TMEvent): { min: number; max: number; currency: string } | null {
  const ranges = event.priceRanges ?? [];
  if (ranges.length === 0) return null;
  const min = Math.min(...ranges.map((r) => r.min));
  const max = Math.max(...ranges.map((r) => r.max));
  return { min, max, currency: ranges[0].currency };
}
