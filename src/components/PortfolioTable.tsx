"use client";

import Link from "next/link";
import { TicketWithSignal } from "@/lib/types";
import SignalBadge from "./SignalBadge";
import SparkLine from "./SparkLine";

function fmt(n: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function PortfolioTable({ tickets }: { tickets: TicketWithSignal[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-dark-border">
      <table className="w-full portfolio-table">
        <thead>
          <tr className="bg-dark-surface">
            <th className="text-left px-3 py-2">Game</th>
            <th className="text-left px-3 py-2">Match</th>
            <th className="text-left px-3 py-2 hidden lg:table-cell">Venue</th>
            <th className="text-center px-3 py-2">Cat</th>
            <th className="text-left px-3 py-2 hidden md:table-cell">Sec/Row</th>
            <th className="text-right px-3 py-2">Cost</th>
            <th className="text-right px-3 py-2">Ask</th>
            <th className="text-right px-3 py-2 hidden lg:table-cell">Last Sale</th>
            <th className="text-right px-3 py-2">Multiple</th>
            <th className="text-right px-3 py-2 hidden md:table-cell">You Receive</th>
            <th className="text-right px-3 py-2 hidden lg:table-cell">Net P/L</th>
            <th className="text-center px-3 py-2">Days</th>
            <th className="text-center px-3 py-2">Signal</th>
            <th className="text-center px-3 py-2 hidden md:table-cell">Trend</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => {
            const profitColor = (t.net_profit ?? 0) >= 0 ? "text-green-400" : "text-red-400";
            const daysColor =
              t.days_left <= 7 ? "text-red-400" :
              t.days_left <= 14 ? "text-orange-400" :
              t.days_left <= 21 ? "text-yellow-400" :
              "text-dark-muted";

            return (
              <tr
                key={t.id}
                className="border-t border-dark-border hover:bg-dark-surface/50 transition-colors"
              >
                <td className="px-3 py-2 text-dark-muted">
                  <Link href={`/ticket/${t.id}`} className="hover:text-fifa-red">
                    G{t.game_num}
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <Link href={`/ticket/${t.id}`} className="hover:text-fifa-red text-dark-text">
                    <div className="max-w-[200px] truncate">{t.match_name}</div>
                    <div className="text-xs text-dark-muted">{t.city}</div>
                  </Link>
                </td>
                <td className="px-3 py-2 text-dark-muted text-xs hidden lg:table-cell max-w-[150px] truncate">
                  {t.venue}
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="px-1.5 py-0.5 rounded text-xs bg-dark-surface">
                    Cat {t.category}
                  </span>
                </td>
                <td className="px-3 py-2 text-dark-muted text-xs hidden md:table-cell">
                  {t.section}/{t.row_num}
                </td>
                <td className="px-3 py-2 text-right text-dark-muted">
                  {fmt(t.cost_per_ticket)}
                </td>
                <td className="px-3 py-2 text-right text-dark-text font-semibold">
                  {fmt(t.latest_ask)}
                  {t.comparable_section && t.comparable_section !== t.section && (
                    <div className="text-xs text-dark-muted">Sec {t.comparable_section}</div>
                  )}
                </td>
                <td className="px-3 py-2 text-right text-dark-muted hidden lg:table-cell">
                  {fmt(t.latest_sale)}
                </td>
                <td className="px-3 py-2 text-right">
                  <span className={
                    (t.multiple ?? 0) >= 3 ? "text-red-400 font-bold" :
                    (t.multiple ?? 0) >= 2 ? "text-fifa-gold font-semibold" :
                    (t.multiple ?? 0) >= 1 ? "text-green-400" :
                    "text-red-400"
                  }>
                    {t.multiple != null ? `${t.multiple.toFixed(1)}x` : "—"}
                  </span>
                </td>
                <td className="px-3 py-2 text-right hidden md:table-cell">
                  {fmt(t.you_receive)}
                </td>
                <td className={`px-3 py-2 text-right hidden lg:table-cell ${profitColor}`}>
                  {fmt(t.net_profit)}
                </td>
                <td className={`px-3 py-2 text-center font-mono ${daysColor}`}>
                  {t.days_left}d
                </td>
                <td className="px-3 py-2 text-center">
                  <SignalBadge signal={t.signal} score={t.score} />
                </td>
                <td className="px-3 py-2 text-center hidden md:table-cell">
                  <SparkLine data={t.price_history} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
