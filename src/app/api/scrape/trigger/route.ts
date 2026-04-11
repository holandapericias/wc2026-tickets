import { NextResponse } from "next/server";
import { scrapeAllTickets } from "@/lib/scraper";

export const maxDuration = 300;

export async function POST() {
  const result = await scrapeAllTickets();
  return NextResponse.json(result);
}
