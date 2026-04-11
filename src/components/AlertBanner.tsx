import { TicketWithSignal } from "@/lib/types";

export default function AlertBanner({ tickets }: { tickets: TicketWithSignal[] }) {
  const fireTickets = tickets.filter((t) => t.signal === "FIRE");
  const urgentTickets = tickets.filter((t) => t.days_left <= 21 && t.signal !== "FIRE");

  if (fireTickets.length === 0 && urgentTickets.length === 0) return null;

  return (
    <div className="space-y-2">
      {fireTickets.length > 0 && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 fire-glow">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-400 font-bold text-sm">FIRE ALERTS</span>
            <span className="text-xs text-red-300">3x+ cost basis</span>
          </div>
          <div className="text-sm text-red-200">
            {fireTickets.map((t) => (
              <span key={t.id} className="mr-4">
                G{t.game_num} {t.match_name} — {t.multiple?.toFixed(1)}x
              </span>
            ))}
          </div>
        </div>
      )}
      {urgentTickets.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-yellow-400 font-bold text-sm">URGENT — Within 21 Days</span>
          </div>
          <div className="text-sm text-yellow-200">
            {urgentTickets.map((t) => (
              <span key={t.id} className="mr-4">
                G{t.game_num} {t.match_name} — {t.days_left}d left
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
