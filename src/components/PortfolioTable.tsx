"use client";

import Link from "next/link";
import { TicketWithSignal } from "@/lib/types";
import SignalBadge from "./SignalBadge";
import SparkLine from "./SparkLine";
import { useLanguage } from "./LanguageProvider";

function fmt(n: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function PortfolioTable({ tickets }: { tickets: TicketWithSignal[] }) {
  const { t } = useLanguage();

  return (
    <div className="overflow-x-auto rounded-lg border border-dark-border">
      <table className="w-full portfolio-table">
        <thead>
          <tr className="bg-dark-surface">
            <th className="text-left px-3 py-2">{t("game")}</th>
            <th className="text-left px-3 py-2">{t("match")}</th>
            <th className="text-left px-3 py-2 hidden lg:table-cell">{t("venue")}</th>
            <th className="text-center px-3 py-2">{t("cat")}</th>
            <th className="text-left px-3 py-2 hidden md:table-cell">{t("secRow")}</th>
            <th className="text-right px-3 py-2">{t("cost")}</th>
            <th className="text-right px-3 py-2">{t("askPrice")}</th>
            <th className="text-right px-3 py-2 hidden lg:table-cell">{t("lastSale")}</th>
            <th className="text-right px-3 py-2">{t("multiple")}</th>
            <th className="text-right px-3 py-2 hidden md:table-cell">{t("youReceive")}</th>
            <th className="text-right px-3 py-2 hidden lg:table-cell">{t("netPL")}</th>
            <th className="text-center px-3 py-2">{t("days")}</th>
            <th className="text-center px-3 py-2">{t("signal")}</th>
            <th className="text-center px-3 py-2 hidden md:table-cell">{t("trend")}</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((tk) => {
            const profitColor = (tk.net_profit ?? 0) >= 0 ? "text-green-400" : "text-red-400";
            const daysColor =
              tk.days_left <= 7 ? "text-red-400" :
              tk.days_left <= 14 ? "text-orange-400" :
              tk.days_left <= 21 ? "text-yellow-400" :
              "text-dark-muted";

            return (
              <tr
                key={tk.id}
                className="border-t border-dark-border hover:bg-dark-surface/50 transition-colors"
              >
                <td className="px-3 py-2 text-dark-muted">
                  <Link href={`/ticket/${tk.id}`} className="hover:text-fifa-red">
                    G{tk.game_num}
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <Link href={`/ticket/${tk.id}`} className="hover:text-fifa-red text-dark-text">
                    <div className="max-w-[200px] truncate">{tk.match_name}</div>
                    <div className="text-xs text-dark-muted">{tk.city}</div>
                  </Link>
                </td>
                <td className="px-3 py-2 text-dark-muted text-xs hidden lg:table-cell max-w-[150px] truncate">
                  {tk.venue}
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="px-1.5 py-0.5 rounded text-xs bg-dark-surface">
                    Cat {tk.category}
                  </span>
                </td>
                <td className="px-3 py-2 text-dark-muted text-xs hidden md:table-cell">
                  {tk.section}/{tk.row_num}
                </td>
                <td className="px-3 py-2 text-right text-dark-muted">
                  {fmt(tk.cost_per_ticket)}
                </td>
                <td className="px-3 py-2 text-right text-dark-text font-semibold">
                  {fmt(tk.latest_ask)}
                  {tk.comparable_section && tk.comparable_section !== tk.section && (
                    <div className="text-xs text-dark-muted">Sec {tk.comparable_section}</div>
                  )}
                </td>
                <td className="px-3 py-2 text-right text-dark-muted hidden lg:table-cell">
                  {fmt(tk.latest_sale)}
                </td>
                <td className="px-3 py-2 text-right">
                  <span className={
                    (tk.multiple ?? 0) >= 3 ? "text-red-400 font-bold" :
                    (tk.multiple ?? 0) >= 2 ? "text-fifa-gold font-semibold" :
                    (tk.multiple ?? 0) >= 1 ? "text-green-400" :
                    "text-red-400"
                  }>
                    {tk.multiple != null ? `${tk.multiple.toFixed(1)}x` : "—"}
                  </span>
                </td>
                <td className="px-3 py-2 text-right hidden md:table-cell">
                  {fmt(tk.you_receive)}
                </td>
                <td className={`px-3 py-2 text-right hidden lg:table-cell ${profitColor}`}>
                  {fmt(tk.net_profit)}
                </td>
                <td className={`px-3 py-2 text-center font-mono ${daysColor}`}>
                  {tk.days_left}d
                </td>
                <td className="px-3 py-2 text-center">
                  <SignalBadge signal={tk.signal} score={tk.score} />
                </td>
                <td className="px-3 py-2 text-center hidden md:table-cell">
                  <SparkLine data={tk.price_history} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
