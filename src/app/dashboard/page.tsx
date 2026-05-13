import { getTicketsWithSignals, getPortfolioSummary } from "@/lib/data";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const tickets = await getTicketsWithSignals("stephen");
  const summary = getPortfolioSummary(tickets);

  return <DashboardClient tickets={tickets} summary={summary} />;
}
