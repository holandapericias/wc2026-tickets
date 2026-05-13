import { getTicketsWithSignals, getPortfolioSummary, sumCostBasis } from "@/lib/data";
import RobertoClient from "./RobertoClient";

export const dynamic = "force-dynamic";

export default async function RobertoPage() {
  const tickets = await getTicketsWithSignals("roberto");
  const costBasis = sumCostBasis(tickets);
  const summary = getPortfolioSummary(tickets, { costBasis, targetProfit: 0 });

  return <RobertoClient tickets={tickets} summary={summary} costBasis={costBasis} />;
}
