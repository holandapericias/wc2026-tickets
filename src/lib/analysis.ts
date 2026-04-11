import Anthropic from "@anthropic-ai/sdk";
import { Ticket, PriceScan } from "./types";
import { getDaysUntil } from "./signals";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateTicketAnalysis(
  ticket: Ticket,
  scans: PriceScan[],
  signal: string,
  score: number,
  multiple: number | null
): Promise<string> {
  const daysLeft = getDaysUntil(ticket.match_date);
  const latestScan = scans[0];
  const askPrice = latestScan?.ask_price;
  const salePrice = latestScan?.last_sale_price;

  const prompt = `You are a World Cup 2026 ticket market analyst. Generate a 1-paragraph market analysis for this ticket:

Match: ${ticket.match_name} (Game ${ticket.game_num})
Date: ${ticket.match_date} (${daysLeft} days away)
Venue: ${ticket.venue}, ${ticket.city}
Category: ${ticket.category}, Section ${ticket.section}, Row ${ticket.row_num}
Cost basis: $${ticket.cost_per_ticket}/ticket ($${ticket.total_cost} total for ${ticket.qty} tickets)
Current ask price: ${askPrice ? `$${askPrice}` : "N/A"}
Last sale price: ${salePrice ? `$${salePrice}` : "N/A"}
Multiple: ${multiple ? `${multiple.toFixed(1)}x` : "N/A"}
Signal: ${signal} (score: ${score}/100)
Recent price scans: ${scans.slice(0, 5).map(s => `$${s.ask_price} (${s.source}, ${new Date(s.scanned_at).toLocaleDateString()})`).join(", ")}

Consider: price trend, days until match, team appeal, city tourism demand, historical World Cup resale patterns, and tournament stage. Be specific about pricing strategy and timing.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    return textBlock?.text || "Analysis unavailable.";
  } catch (e) {
    console.error("Analysis generation failed:", e);
    return `Market analysis temporarily unavailable. Current signal: ${signal} (${score}/100). ${
      multiple ? `Trading at ${multiple.toFixed(1)}x cost basis.` : ""
    } ${daysLeft} days until match.`;
  }
}

export async function generateSellRecommendation(
  ticket: Ticket,
  scans: PriceScan[],
  signal: string,
  score: number,
  multiple: number | null
): Promise<string> {
  const daysLeft = getDaysUntil(ticket.match_date);
  const askPrice = scans[0]?.ask_price;

  const prompt = `You are a World Cup 2026 ticket resale strategist. Generate a detailed sell recommendation for this ticket:

Match: ${ticket.match_name} (Game ${ticket.game_num})
Date: ${ticket.match_date} (${daysLeft} days away)
Venue: ${ticket.venue}, ${ticket.city}
Category: ${ticket.category}, Section ${ticket.section}, Row ${ticket.row_num}
Cost: $${ticket.cost_per_ticket}/ticket
Current ask: ${askPrice ? `$${askPrice}` : "N/A"}
Multiple: ${multiple ? `${multiple.toFixed(1)}x` : "N/A"}
Signal: ${signal} (score: ${score}/100)
Seller fee: 15% (you receive listed_price x 0.85)

Give a specific, actionable recommendation: exact listing price, timing (list now vs wait), what to watch for (team qualifications, price momentum, etc), and the reasoning behind your recommendation. Include the net profit calculation. Be direct and tactical.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    return textBlock?.text || "Recommendation unavailable.";
  } catch (e) {
    console.error("Recommendation generation failed:", e);
    return `Recommendation unavailable. Signal: ${signal}. Consider listing at ${
      askPrice ? `$${Math.round(askPrice * 0.95)}` : "market price"
    } if within 21 days of match date.`;
  }
}
