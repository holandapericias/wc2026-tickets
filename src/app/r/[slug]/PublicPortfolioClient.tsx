"use client";

import { TicketWithSignal, PortfolioSummary } from "@/lib/types";
import KPIBar from "@/components/KPIBar";
import AlertBanner from "@/components/AlertBanner";
import PortfolioTable from "@/components/PortfolioTable";
import { useLanguage } from "@/components/LanguageProvider";

export default function PublicPortfolioClient({
  tickets,
  summary,
  costBasis,
  linkPrefix,
}: {
  tickets: TicketWithSignal[];
  summary: PortfolioSummary;
  costBasis: number;
  linkPrefix: string;
}) {
  const { t } = useLanguage();

  if (tickets.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-bold mb-4">{t("robertoTickets")}</h1>
        <div className="text-dark-muted text-lg">{t("noTicketsLoaded")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">{t("robertoTickets")}</h1>
      {costBasis === 0 && (
        <div className="rounded-lg border border-fifa-gold/40 bg-fifa-gold/10 px-4 py-3 text-sm text-fifa-gold">
          {t("awaitingCostData")}
        </div>
      )}
      <KPIBar summary={summary} />
      <AlertBanner tickets={tickets} />
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">{t("allTickets")}</h2>
          <span className="text-xs text-dark-muted">
            {tickets.length} {t("tickets")} | {t("sortedByGame")}
          </span>
        </div>
        <PortfolioTable tickets={tickets} linkPrefix={linkPrefix} />
      </div>
    </div>
  );
}
