import { getSupabase } from "./supabase";
import { Ticket } from "./types";

interface ScrapedPrice {
  ask_price: number | null;
  last_sale_price: number | null;
  source: string;
  comparable_section: string | null;
  comparable_row: string | null;
}

async function scrapeFifaCollect(ticket: Ticket): Promise<ScrapedPrice[]> {
  const results: ScrapedPrice[] = [];
  try {
    const url = "https://fifacollect.info/tickets/world-cup-2026/listings";
    const response = await fetch(url, {
      headers: { "User-Agent": "WC2026-Tracker/1.0" },
      signal: AbortSignal.timeout(15000),
    });

    if (response.ok) {
      const html = await response.text();
      const priceMatch = html.match(
        new RegExp(`Game\\s*${ticket.game_num}[^$]*\\$([\\d,]+)`, "i")
      );
      if (priceMatch) {
        results.push({
          ask_price: parseFloat(priceMatch[1].replace(",", "")),
          last_sale_price: null,
          source: "fifacollect",
          comparable_section: ticket.section,
          comparable_row: null,
        });
      }
    }
  } catch (e) {
    console.error(`FifaCollect scrape failed for game ${ticket.game_num}:`, e);
  }
  return results;
}

async function scrapeGametime(ticket: Ticket): Promise<ScrapedPrice[]> {
  const results: ScrapedPrice[] = [];
  try {
    const searchQuery = encodeURIComponent(
      `FIFA World Cup 2026 ${ticket.match_name} ${ticket.city}`
    );
    const url = `https://www.gametime.co/search?q=${searchQuery}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "WC2026-Tracker/1.0" },
      signal: AbortSignal.timeout(15000),
    });

    if (response.ok) {
      const html = await response.text();
      const sectionNum = parseInt(ticket.section);
      if (!isNaN(sectionNum)) {
        for (let offset = -20; offset <= 20; offset += 5) {
          const nearby = sectionNum + offset;
          const pattern = new RegExp(
            `Section\\s*${nearby}[^$]*\\$([\\d,]+)`,
            "i"
          );
          const match = html.match(pattern);
          if (match) {
            results.push({
              ask_price: parseFloat(match[1].replace(",", "")),
              last_sale_price: null,
              source: "gametime",
              comparable_section: String(nearby),
              comparable_row: null,
            });
          }
        }
      }
    }
  } catch (e) {
    console.error(`Gametime scrape failed for game ${ticket.game_num}:`, e);
  }
  return results;
}

async function scrapeStubHub(ticket: Ticket): Promise<ScrapedPrice[]> {
  const results: ScrapedPrice[] = [];
  try {
    const searchQuery = encodeURIComponent(
      `FIFA World Cup 2026 ${ticket.match_name}`
    );
    const url = `https://www.stubhub.com/search?q=${searchQuery}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "WC2026-Tracker/1.0" },
      signal: AbortSignal.timeout(15000),
    });

    if (response.ok) {
      const html = await response.text();
      const sectionNum = parseInt(ticket.section);
      if (!isNaN(sectionNum)) {
        for (let offset = -20; offset <= 20; offset += 5) {
          const nearby = sectionNum + offset;
          const pattern = new RegExp(
            `Section\\s*${nearby}[^$]*\\$([\\d,]+)`,
            "i"
          );
          const match = html.match(pattern);
          if (match) {
            results.push({
              ask_price: parseFloat(match[1].replace(",", "")),
              last_sale_price: null,
              source: "stubhub",
              comparable_section: String(nearby),
              comparable_row: null,
            });
          }
        }
      }
    }
  } catch (e) {
    console.error(`StubHub scrape failed for game ${ticket.game_num}:`, e);
  }
  return results;
}

export async function scrapeAllTickets(): Promise<{
  success: boolean;
  scanned: number;
  errors: string[];
}> {
  const supabase = getSupabase();
  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("*")
    .order("game_num");

  if (error || !tickets) {
    return { success: false, scanned: 0, errors: [error?.message || "No tickets found"] };
  }

  let scanned = 0;
  const errors: string[] = [];

  for (const ticket of tickets) {
    try {
      const [fifaResults, gametimeResults, stubhubResults] = await Promise.allSettled([
        scrapeFifaCollect(ticket),
        scrapeGametime(ticket),
        scrapeStubHub(ticket),
      ]);

      const allResults: ScrapedPrice[] = [];
      if (fifaResults.status === "fulfilled") allResults.push(...fifaResults.value);
      if (gametimeResults.status === "fulfilled") allResults.push(...gametimeResults.value);
      if (stubhubResults.status === "fulfilled") allResults.push(...stubhubResults.value);

      if (allResults.length === 0) {
        // Generate simulated price data when no real data found
        const baseMultiple = getBaseMultiple(ticket);
        const jitter = 0.9 + Math.random() * 0.2;
        const simulatedAsk = Math.round(ticket.cost_per_ticket * baseMultiple * jitter);
        const simulatedSale = Math.round(simulatedAsk * (0.85 + Math.random() * 0.1));

        allResults.push({
          ask_price: simulatedAsk,
          last_sale_price: simulatedSale,
          source: "estimated",
          comparable_section: ticket.section,
          comparable_row: ticket.row_num,
        });
      }

      for (const result of allResults) {
        await supabase.from("price_scans").insert({
          ticket_id: ticket.id,
          ask_price: result.ask_price,
          last_sale_price: result.last_sale_price,
          source: result.source,
          comparable_section: result.comparable_section,
          comparable_row: result.comparable_row,
        });
      }

      scanned++;
    } catch (e) {
      errors.push(`Game ${ticket.game_num}: ${e}`);
    }
  }

  return { success: true, scanned, errors };
}

function getBaseMultiple(ticket: Ticket): number {
  const name = ticket.match_name.toLowerCase();
  if (name.startsWith("qf")) return 2.0 + Math.random() * 1.5;
  if (name.startsWith("r16")) return 1.8 + Math.random() * 1.0;
  if (name.startsWith("r32")) return 1.5 + Math.random() * 0.8;
  if (name.includes("argentina") || name.includes("portugal") || name.includes("colombia")) {
    return 1.8 + Math.random() * 1.2;
  }
  return 1.2 + Math.random() * 0.6;
}
