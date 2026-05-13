"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PriceChart from "@/components/PriceChart";
import SignalBadge from "@/components/SignalBadge";
import { Ticket, PriceScan, SignalLevel } from "@/lib/types";
import { SELLER_FEE } from "@/lib/seed";

function fmt(n: number | null | undefined) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

interface Props {
  ticket: Ticket;
  backLink: string;
  backLabel: string;
}

export default function TicketDetailClient({ ticket, backLink, backLabel }: Props) {
  const [scans, setScans] = useState<PriceScan[]>([]);
  const [analysis, setAnalysis] = useState<string>("");
  const [recommendation, setRecommendation] = useState<string>("");
  const [signal, setSignal] = useState<SignalLevel>("HOLD");
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const pricesRes = await fetch(`/api/prices?ticket_id=${ticket.id}&limit=100`);
        const prices: PriceScan[] = await pricesRes.json();
        setScans(prices);

        const analysisRes = await fetch(`/api/analysis?ticket_id=${ticket.id}`);
        if (analysisRes.ok) {
          const data = await analysisRes.json();
          setAnalysis(data.analysis || "");
          setRecommendation(data.recommendation || "");
          if (data.signal) {
            setSignal(data.signal);
            setScore(data.score);
          }
        }
      } catch (e) {
        console.error("Failed to load ticket details:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [ticket.id]);

  const latestAsk = scans[0]?.ask_price ?? null;
  const latestSale = scans[0]?.last_sale_price ?? null;
  const hasCostBasis = ticket.cost_per_ticket > 0;
  const multiple = latestAsk && hasCostBasis ? latestAsk / ticket.cost_per_ticket : null;
  const youReceive = latestAsk ? latestAsk * (1 - SELLER_FEE) * ticket.qty : null;
  const netProfit = youReceive != null && hasCostBasis ? youReceive - ticket.total_cost : null;
  const now = new Date();
  const matchDate = new Date(ticket.match_date + "T00:00:00");
  const daysLeft = Math.max(0, Math.ceil((matchDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const priceHistory = scans
    .slice()
    .reverse()
    .map((s) => ({ date: s.scanned_at, ask: s.ask_price, sale: s.last_sale_price }));

  const comparables = scans.filter(
    (s) => s.comparable_section && s.comparable_section !== ticket.section,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-dark-muted">
        <Link href={backLink} className="hover:text-fifa-red">
          {backLabel}
        </Link>
        <span>/</span>
        <span className="text-dark-text">
          {ticket.game_num > 0 ? `Game ${ticket.game_num}` : ticket.match_name}
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3 flex-wrap">
            {ticket.game_num > 0 && (
              <span className="text-dark-muted font-mono">G{ticket.game_num}</span>
            )}
            {ticket.match_name}
            <SignalBadge signal={signal} score={score} />
          </h1>
          <div className="text-dark-muted mt-1">
            {ticket.venue && ticket.venue !== "TBD" ? `${ticket.venue} | ` : ""}
            {ticket.city && ticket.city !== "TBD" ? `${ticket.city} | ` : ""}
            {new Date(ticket.match_date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="kpi-card text-center">
            <div className="text-xs text-dark-muted">Days Left</div>
            <div className="text-xl font-mono font-bold text-dark-text">{daysLeft}</div>
          </div>
          <div className="kpi-card text-center">
            <div className="text-xs text-dark-muted">Multiple</div>
            <div className="text-xl font-mono font-bold text-dark-text">
              {multiple ? `${multiple.toFixed(1)}x` : "—"}
            </div>
          </div>
          <div className="kpi-card text-center">
            <div className="text-xs text-dark-muted">Net P/L</div>
            <div
              className={`text-xl font-mono font-bold ${
                (netProfit ?? 0) >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {fmt(netProfit)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-dark-muted uppercase mb-3">Ticket Info</h3>
          <div className="space-y-2 text-sm">
            {ticket.category > 0 && <InfoRow label="Category" value={`Cat ${ticket.category}`} />}
            <InfoRow label="Section" value={ticket.section} />
            <InfoRow label="Row" value={ticket.row_num} />
            <InfoRow label="Seats" value={ticket.seats} />
            <InfoRow label="Quantity" value={String(ticket.qty)} />
            {hasCostBasis && (
              <>
                <InfoRow label="Cost/Ticket" value={fmt(ticket.cost_per_ticket)} />
                <InfoRow label="Total Cost" value={fmt(ticket.total_cost)} />
              </>
            )}
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-dark-muted uppercase mb-3">Current Pricing</h3>
          <div className="space-y-2 text-sm">
            <InfoRow label="Ask Price" value={fmt(latestAsk)} highlight />
            <InfoRow label="Last Sale" value={fmt(latestSale)} />
            <InfoRow label="Multiple" value={multiple ? `${multiple.toFixed(2)}x` : "—"} />
            <InfoRow label="You Receive" value={fmt(youReceive)} />
            <InfoRow
              label="Net Profit"
              value={fmt(netProfit)}
              color={(netProfit ?? 0) >= 0 ? "text-green-400" : "text-red-400"}
            />
            <InfoRow label="Source" value={scans[0]?.source || "—"} />
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-dark-muted uppercase mb-3">Team Analysis</h3>
          <TeamAnalysis matchName={ticket.match_name} gameNum={ticket.game_num} />
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-dark-muted uppercase mb-3">Price History</h3>
        <PriceChart data={priceHistory} costBasis={ticket.cost_per_ticket} />
      </div>

      {comparables.length > 0 && (
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-dark-muted uppercase mb-3">Comparable Listings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-dark-muted uppercase">
                  <th className="text-left px-3 py-2">Section</th>
                  <th className="text-left px-3 py-2">Row</th>
                  <th className="text-right px-3 py-2">Ask Price</th>
                  <th className="text-right px-3 py-2">Last Sale</th>
                  <th className="text-left px-3 py-2">Source</th>
                  <th className="text-left px-3 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {comparables.slice(0, 20).map((s) => (
                  <tr key={s.id} className="border-t border-dark-border">
                    <td className="px-3 py-2 font-mono">{s.comparable_section}</td>
                    <td className="px-3 py-2 font-mono text-dark-muted">
                      {s.comparable_row || "—"}
                    </td>
                    <td className="px-3 py-2 text-right font-mono">
                      {s.ask_price ? fmt(s.ask_price) : "—"}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-dark-muted">
                      {s.last_sale_price ? fmt(s.last_sale_price) : "—"}
                    </td>
                    <td className="px-3 py-2 text-dark-muted">{s.source}</td>
                    <td className="px-3 py-2 text-dark-muted text-xs">
                      {new Date(s.scanned_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-dark-muted uppercase mb-3">
            Market Intelligence
          </h3>
          <p className="text-sm text-dark-text leading-relaxed">
            {analysis ||
              (loading
                ? "Loading market analysis..."
                : "Run the scraper and enable AI analysis to see market intelligence for this ticket.")}
          </p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-dark-muted uppercase mb-3">
            Sell Recommendation
          </h3>
          <p className="text-sm text-dark-text leading-relaxed">
            {recommendation ||
              (loading
                ? "Loading recommendation..."
                : "AI-powered sell recommendation will appear after price data is collected.")}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
  color,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  color?: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-dark-muted">{label}</span>
      <span
        className={`font-mono ${highlight ? "text-dark-text font-semibold" : ""} ${color || ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function TeamAnalysis({ matchName, gameNum }: { matchName: string; gameNum: number }) {
  const stage = matchName.startsWith("QF")
    ? "Quarter-Final"
    : matchName.startsWith("R16")
      ? "Round of 16"
      : matchName.startsWith("R32")
        ? "Round of 32"
        : "Group Stage";
  const isKnockout = stage !== "Group Stage";

  return (
    <div className="space-y-3 text-sm">
      <InfoRow label="Stage" value={stage} />
      {gameNum > 0 && <InfoRow label="Game" value={`#${gameNum}`} />}
      {isKnockout ? (
        <div className="text-dark-muted text-xs mt-2">
          <p>
            Knockout round matchup depends on group stage results. Teams will be confirmed as
            group stage concludes.
          </p>
          <p className="mt-1">
            Higher tournament stages historically see 30-50% price premiums as demand concentrates.
          </p>
        </div>
      ) : (
        <div className="text-dark-muted text-xs mt-2">
          <p>
            Group stage match with confirmed teams. Price driven by team popularity, group
            standings, and elimination scenarios.
          </p>
        </div>
      )}
    </div>
  );
}
