"use client";

import { TicketWithSignal, PortfolioSummary } from "@/lib/types";
import WaterfallChart from "@/components/WaterfallChart";
import MultipleChart from "@/components/MultipleChart";
import PriceChart from "@/components/PriceChart";
import SignalBadge from "@/components/SignalBadge";

function fmt(n: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function MarketClient({ tickets, summary }: { tickets: TicketWithSignal[]; summary: PortfolioSummary }) {
  const sorted = [...tickets].sort((a, b) => (b.multiple ?? 0) - (a.multiple ?? 0));
  const best = sorted.slice(0, 5);
  const worst = sorted.slice(-5).reverse();

  const projections = {
    today: summary.total_you_receive,
    twoWeeks: summary.total_you_receive * 1.08,
    peak: summary.total_you_receive * 1.25,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Market Overview</h1>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* P&L Waterfall */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-dark-muted uppercase mb-3">Portfolio P&L</h3>
          <WaterfallChart
            totalCost={summary.total_cost}
            marketValue={summary.total_market_value}
            youReceive={summary.total_you_receive}
            netProfit={summary.total_net_profit}
          />
        </div>

        {/* Multiple Distribution */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-dark-muted uppercase mb-3">Multiple Distribution</h3>
          <MultipleChart tickets={tickets} />
        </div>
      </div>

      {/* Best & Worst Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-dark-muted uppercase mb-3">Top Performers</h3>
          <div className="space-y-2">
            {best.map((t, i) => (
              <div key={t.id} className="flex items-center justify-between py-1 border-b border-dark-border last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-dark-muted font-mono text-xs w-4">{i + 1}.</span>
                  <div>
                    <div className="text-sm">{t.match_name}</div>
                    <div className="text-xs text-dark-muted">G{t.game_num} | {t.city}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-green-400">{t.multiple?.toFixed(1)}x</span>
                  <SignalBadge signal={t.signal} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-dark-muted uppercase mb-3">Underperformers</h3>
          <div className="space-y-2">
            {worst.map((t, i) => (
              <div key={t.id} className="flex items-center justify-between py-1 border-b border-dark-border last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-dark-muted font-mono text-xs w-4">{i + 1}.</span>
                  <div>
                    <div className="text-sm">{t.match_name}</div>
                    <div className="text-xs text-dark-muted">G{t.game_num} | {t.city}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-sm ${(t.multiple ?? 0) < 1 ? "text-red-400" : "text-dark-muted"}`}>
                    {t.multiple?.toFixed(1) ?? "—"}x
                  </span>
                  <SignalBadge signal={t.signal} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Projection */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-dark-muted uppercase mb-3">Portfolio Projection</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-dark-surface rounded-lg">
            <div className="text-xs text-dark-muted uppercase mb-1">If Sold Today</div>
            <div className="text-xl font-mono font-bold text-dark-text">{fmt(projections.today)}</div>
            <div className={`text-sm ${projections.today - summary.total_cost >= 0 ? "text-green-400" : "text-red-400"}`}>
              {fmt(projections.today - summary.total_cost)} net
            </div>
          </div>
          <div className="text-center p-4 bg-dark-surface rounded-lg">
            <div className="text-xs text-dark-muted uppercase mb-1">In 2 Weeks (Est.)</div>
            <div className="text-xl font-mono font-bold text-fifa-gold">{fmt(projections.twoWeeks)}</div>
            <div className="text-sm text-green-400">
              {fmt(projections.twoWeeks - summary.total_cost)} net
            </div>
          </div>
          <div className="text-center p-4 bg-dark-surface rounded-lg">
            <div className="text-xs text-dark-muted uppercase mb-1">At Peak (Est.)</div>
            <div className="text-xl font-mono font-bold text-fifa-red">{fmt(projections.peak)}</div>
            <div className="text-sm text-green-400">
              {fmt(projections.peak - summary.total_cost)} net
            </div>
          </div>
        </div>
      </div>

      {/* All Ticket Price Trends */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-dark-muted uppercase mb-3">All Ticket Price Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tickets.map((t) => (
            <div key={t.id} className="bg-dark-surface rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs">
                  <span className="text-dark-muted">G{t.game_num}</span>
                  <span className="ml-1 text-dark-text">{t.match_name.substring(0, 25)}</span>
                </div>
                <SignalBadge signal={t.signal} />
              </div>
              <PriceChart data={t.price_history} costBasis={t.cost_per_ticket} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
