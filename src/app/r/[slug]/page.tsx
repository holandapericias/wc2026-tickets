import { notFound } from "next/navigation";
import { getTicketsWithSignals, getPortfolioSummary, sumCostBasis } from "@/lib/data";
import { ROBERTO_ACCESS_SLUG } from "@/lib/access";
import PublicPortfolioClient from "./PublicPortfolioClient";

export const dynamic = "force-dynamic";

export default async function PublicRobertoPage({
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
  const linkPrefix = `/r/${params.slug}/ticket`;

  return (
    <PublicPortfolioClient
      tickets={tickets}
      summary={summary}
      costBasis={costBasis}
      linkPrefix={linkPrefix}
    />
  );
}
