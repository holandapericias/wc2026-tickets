import { getTicketsWithSignals, getPortfolioSummary } from "@/lib/data";
import KPIBar from "@/components/KPIBar";
import AlertBanner from "@/components/AlertBanner";
import PortfolioTable from "@/components/PortfolioTable";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const tickets = await getTicketsWithSignals();
  const summary = getPortfolioSummary(tickets);

  const hasData = tickets.length > 0 && tickets.some((t) => t.latest_ask != null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Portfolio Dashboard</h1>
        {!hasData && (
          <SeedButton />
        )}
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-dark-muted text-lg mb-4">No tickets loaded</div>
          <p className="text-dark-muted text-sm mb-4">
            Seed the database to load your 18 tickets, then run the scraper to fetch prices.
          </p>
          <SeedButton />
        </div>
      ) : (
        <>
          <KPIBar summary={summary} />
          <AlertBanner tickets={tickets} />
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">All Tickets</h2>
              <span className="text-xs text-dark-muted">
                {tickets.length} tickets | Sorted by game number
              </span>
            </div>
            <PortfolioTable tickets={tickets} />
          </div>
        </>
      )}
    </div>
  );
}

function SeedButton() {
  return (
    <form action="/api/tickets" method="POST">
      <button
        type="submit"
        className="px-4 py-2 bg-fifa-red text-white rounded-lg text-sm font-medium hover:bg-fifa-red-dark transition-colors"
      >
        Seed Tickets
      </button>
    </form>
  );
}
