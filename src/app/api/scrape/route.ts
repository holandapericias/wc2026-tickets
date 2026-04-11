import { NextRequest, NextResponse } from "next/server";
import { scrapeAllTickets } from "@/lib/scraper";

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await scrapeAllTickets();
  return NextResponse.json(result);
}
