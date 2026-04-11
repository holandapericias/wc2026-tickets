"use client";

import { TicketWithSignal, PortfolioSummary } from "@/lib/types";
import KPIBar from "@/components/KPIBar";
import AlertBanner from "@/components/AlertBanner";
import PortfolioTable from "@/components/PortfolioTable";
import { useLanguage } from "@/components/LanguageProvider";

export default function DashboardClient({
  tickets,
  summary,
}: {
  tickets: TicketWithSignal[];
  summary: PortfolioSummary;
}) {
  const { t } = useLanguage();
  if (tickets.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-dark-muted text-lg mb-4">{t("noTicketsLoaded")}</div>
        <p className="text-dark-muted text-sm mb-4">{t("seedDescription")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">{t("dashboard")}</h1>
      <KPIBar summary={summary} />
      <AlertBanner tickets={tickets} />
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">{t("allTickets")}</h2>
          <span className="text-xs text-dark-muted">
            {tickets.length} {t("tickets")} | {t("sortedByGame")}
          </span>
        </div>
        <PortfolioTable tickets={tickets} />
      </div>
    </div>
  );
}
