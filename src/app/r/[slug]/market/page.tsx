import { notFound } from "next/navigation";
import { getTicketsWithSignals, getPortfolioSummary, sumCostBasis } from "@/lib/data";
import { ROBERTO_ACCESS_SLUG } from "@/lib/access";
import MarketClient from "@/app/market/MarketClient";

export const dynamic = "force-dynamic";

export default async function PublicMarketPage({
  params,
}: {
  params: { slug: string };
}) {
  if (params.slug !== ROBERTO_ACCESS_SLUG) {
    notFound();
  }

  const tickets = await getTicketsWithSignals("roberto");
  const costBasis = sumCostBasis(tickets);
  const summary = getPortfolioSummary(tickets, { costBasis, targetProfit: 0 });

  return <MarketClient tickets={tickets} summary={summary} />;
}
