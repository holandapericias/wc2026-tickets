import { getTicketsWithSignals, getPortfolioSummary } from "@/lib/data";
import MarketClient from "./MarketClient";

export const dynamic = "force-dynamic";

export default async function MarketPage() {
  const tickets = await getTicketsWithSignals("stephen");
  const summary = getPortfolioSummary(tickets);

  return <MarketClient tickets={tickets} summary={summary} />;
}
