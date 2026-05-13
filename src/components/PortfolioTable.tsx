"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { TicketWithSignal } from "@/lib/types";
import SignalBadge from "./SignalBadge";
import SparkLine from "./SparkLine";
import { useLanguage } from "./LanguageProvider";

function fmt(n: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function PortfolioTable({
  tickets,
  linkPrefix = "/ticket",
}: {
  tickets: TicketWithSignal[];
  linkPrefix?: string;
}) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<Set<string>>(() => new Set(tickets.map((tk) => tk.id)));

  const allSelected = selected.size === tickets.length;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(tickets.map((tk) => tk.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totals = useMemo(() => {
    const sel = tickets.filter((tk) => selected.has(tk.id));
    return {
      count: sel.length,
      qty: sel.reduce((s, tk) => s + tk.qty, 0),
      totalCost: sel.reduce((s, tk) => s + tk.total_cost, 0),
      costPerTicket: sel.reduce((s, tk) => s + tk.cost_per_ticket, 0),
      youReceive: sel.reduce((s, tk) => s + (tk.you_receive ?? 0), 0),
      netProfit: sel.reduce((s, tk) => s + (tk.net_profit ?? 0), 0),
    };
  }, [tickets, selected]);

  return (
    <div className="overflow-x-auto rounded-lg border border-dark-border">
      <table className="w-full portfolio-table">
        <thead>
          <tr className="bg-dark-surface">
            <th className="px-2 py-2 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="accent-fifa-gold w-4 h-4 cursor-pointer"
              />
            </th>
            <th className="text-left px-3 py-2">{t("game")}</th>
            <th className="text-left px-3 py-2">{t("match")}</th>
            <th className="text-left px-3 py-2 hidden lg:table-cell">{t("venue")}</th>
            <th className="text-center px-3 py-2">{t("cat")}</th>
            <th className="text-left px-3 py-2 hidden md:table-cell">{t("secRow")}</th>
            <th className="text-center px-2 py-2">{t("qty")}</th>
            <th className="text-right px-3 py-2">{t("cost")}</th>
            <th className="text-right px-3 py-2">{t("totalCostShort")}</th>
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
            const isSelected = selected.has(tk.id);

            return (
              <tr
                key={tk.id}
                className={`border-t border-dark-border hover:bg-dark-surface/50 transition-colors ${
                  !isSelected ? "opacity-40" : ""
                }`}
              >
                <td className="px-2 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOne(tk.id)}
                    className="accent-fifa-gold w-4 h-4 cursor-pointer"
                  />
                </td>
                <td className="px-3 py-2 text-dark-muted">
                  <Link href={`${linkPrefix}/${tk.id}`} className="hover:text-fifa-red">
                    G{tk.game_num}
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <Link href={`${linkPrefix}/${tk.id}`} className="hover:text-fifa-red text-dark-text">
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
                <td className="px-2 py-2 text-center font-semibold text-dark-text">
                  {tk.qty}
                </td>
                <td className="px-3 py-2 text-right text-dark-muted">
                  {fmt(tk.cost_per_ticket)}
                </td>
                <td className="px-3 py-2 text-right text-dark-muted">
                  {fmt(tk.total_cost)}
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
        <tfoot>
          <tr className="border-t-2 border-fifa-gold/50 bg-dark-surface font-semibold">
            <td className="px-2 py-3 text-center text-xs text-dark-muted" colSpan={1}>
              {totals.count}/{tickets.length}
            </td>
            <td className="px-3 py-3" colSpan={2}>
              <span className="text-fifa-gold text-sm">
                {t("totals")} ({totals.count} {t("selected")})
              </span>
            </td>
            <td className="hidden lg:table-cell" />
            <td />
            <td className="hidden md:table-cell" />
            <td className="px-2 py-3 text-center text-fifa-gold">
              {totals.qty}
            </td>
            <td className="px-3 py-3 text-right text-dark-muted">
              {fmt(totals.costPerTicket)}
            </td>
            <td className="px-3 py-3 text-right text-fifa-gold">
              {fmt(totals.totalCost)}
            </td>
            <td />
            <td className="hidden lg:table-cell" />
            <td />
            <td className="px-3 py-3 text-right hidden md:table-cell text-fifa-gold">
              {fmt(totals.youReceive)}
            </td>
            <td className={`px-3 py-3 text-right hidden lg:table-cell ${
              totals.netProfit >= 0 ? "text-green-400" : "text-red-400"
            }`}>
              {fmt(totals.netProfit)}
            </td>
            <td />
            <td />
            <td className="hidden md:table-cell" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
