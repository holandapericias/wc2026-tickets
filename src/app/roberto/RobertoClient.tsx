"use client";

import { useState } from "react";
import { TicketWithSignal, PortfolioSummary } from "@/lib/types";
import KPIBar from "@/components/KPIBar";
import AlertBanner from "@/components/AlertBanner";
import PortfolioTable from "@/components/PortfolioTable";
import { useLanguage } from "@/components/LanguageProvider";

export default function RobertoClient({
  tickets,
  summary,
  costBasis,
}: {
  tickets: TicketWithSignal[];
  summary: PortfolioSummary;
  costBasis: number;
}) {
  const { t } = useLanguage();
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  async function handleSeed() {
    setSeeding(true);
    setSeedMessage(null);
    try {
      const res = await fetch("/api/tickets?owner=roberto", { method: "POST" });
      const data = await res.json();
      setSeedMessage(data.message || (data.error ? `Error: ${data.error}` : "Done"));
      if (res.ok && data.count > 0) {
        setTimeout(() => window.location.reload(), 800);
      }
    } catch (e) {
      setSeedMessage(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSeeding(false);
    }
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-bold mb-4">{t("robertoTickets")}</h1>
        <div className="text-dark-muted text-lg mb-4">{t("noTicketsLoaded")}</div>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="px-4 py-2 rounded bg-fifa-red text-white hover:bg-fifa-red/90 disabled:opacity-50"
        >
          {seeding ? "..." : t("seedRobertoTickets")}
        </button>
        {seedMessage && <div className="mt-4 text-sm text-dark-muted">{seedMessage}</div>}
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
        <PortfolioTable tickets={tickets} />
      </div>
    </div>
  );
}
