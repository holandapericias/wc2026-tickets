"use client";

import { PortfolioSummary } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function KPICard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="kpi-card">
      <div className="text-xs text-dark-muted uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-xl font-mono font-bold ${color || "text-dark-text"}`}>{value}</div>
      {sub && <div className="text-xs text-dark-muted mt-0.5">{sub}</div>}
    </div>
  );
}

export default function KPIBar({ summary }: { summary: PortfolioSummary }) {
  const { t } = useLanguage();
  const profitColor = summary.total_net_profit >= 0 ? "text-green-400" : "text-red-400";
  const vsTargetPct = ((summary.total_net_profit / summary.target) * 100).toFixed(0);
  const vsTargetColor = summary.total_net_profit >= summary.target ? "text-green-400" : "text-yellow-400";

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <KPICard
        label={t("portfolioValue")}
        value={fmt(summary.total_market_value)}
        sub={`${t("cost")}: ${fmt(summary.total_cost)}`}
      />
      <KPICard
        label={t("youReceive")}
        value={fmt(summary.total_you_receive)}
        sub={t("afterFee")}
      />
      <KPICard
        label={t("netProfit")}
        value={fmt(summary.total_net_profit)}
        color={profitColor}
      />
      <KPICard
        label={t("vsTarget")}
        value={`${vsTargetPct}%`}
        sub={fmt(summary.vs_target) + " " + t("remaining")}
        color={vsTargetColor}
      />
      <KPICard
        label={t("avgMultiple")}
        value={`${summary.avg_multiple.toFixed(1)}x`}
        sub={t("acrossPortfolio")}
      />
      <KPICard
        label={t("urgentAlerts")}
        value={String(summary.fire_count + summary.urgent_count)}
        sub={`${summary.fire_count} ${t("fire")}, ${summary.urgent_count} ${t("urgent")}`}
        color={summary.fire_count > 0 ? "text-red-400" : "text-dark-text"}
      />
    </div>
  );
}
