import { PortfolioSummary } from "@/lib/types";

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
  const profitColor = summary.total_net_profit >= 0 ? "text-green-400" : "text-red-400";
  const vsTargetPct = ((summary.total_net_profit / summary.target) * 100).toFixed(0);
  const vsTargetColor = summary.total_net_profit >= summary.target ? "text-green-400" : "text-yellow-400";

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <KPICard
        label="Portfolio Value"
        value={fmt(summary.total_market_value)}
        sub={`Cost: ${fmt(summary.total_cost)}`}
      />
      <KPICard
        label="You Receive"
        value={fmt(summary.total_you_receive)}
        sub="After 15% fee"
      />
      <KPICard
        label="Net Profit"
        value={fmt(summary.total_net_profit)}
        color={profitColor}
      />
      <KPICard
        label="vs $25K Target"
        value={`${vsTargetPct}%`}
        sub={fmt(summary.vs_target) + " remaining"}
        color={vsTargetColor}
      />
      <KPICard
        label="Avg Multiple"
        value={`${summary.avg_multiple.toFixed(1)}x`}
        sub="Across portfolio"
      />
      <KPICard
        label="Urgent Alerts"
        value={String(summary.fire_count + summary.urgent_count)}
        sub={`${summary.fire_count} FIRE, ${summary.urgent_count} urgent`}
        color={summary.fire_count > 0 ? "text-red-400" : "text-dark-text"}
      />
    </div>
  );
}
