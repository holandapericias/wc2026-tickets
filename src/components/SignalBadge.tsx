import { SignalLevel } from "@/lib/types";

const config: Record<SignalLevel, { bg: string; text: string; glow: boolean }> = {
  FIRE: { bg: "bg-red-600", text: "text-white", glow: true },
  "LIST NOW": { bg: "bg-red-500", text: "text-white", glow: false },
  SELL: { bg: "bg-orange-500", text: "text-white", glow: false },
  WATCH: { bg: "bg-yellow-500", text: "text-black", glow: false },
  HOLD: { bg: "bg-green-600", text: "text-white", glow: false },
};

export default function SignalBadge({ signal, score }: { signal: SignalLevel; score?: number }) {
  const c = config[signal];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${c.bg} ${c.text} ${
        c.glow ? "fire-glow animate-pulse-fire" : ""
      }`}
      title={score != null ? `Score: ${score}/100` : undefined}
    >
      {signal === "FIRE" && "🔥 "}
      {signal}
    </span>
  );
}
