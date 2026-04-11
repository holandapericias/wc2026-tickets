"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { TicketWithSignal } from "@/lib/types";

export default function MultipleChart({ tickets }: { tickets: TicketWithSignal[] }) {
  const data = tickets
    .filter((t) => t.multiple != null)
    .map((t) => ({
      name: `G${t.game_num}`,
      multiple: t.multiple!,
      fill:
        t.multiple! >= 3 ? "#C8102E" :
        t.multiple! >= 2 ? "#D4AF37" :
        t.multiple! >= 1.5 ? "#48BB78" :
        t.multiple! >= 1 ? "#4299E1" : "#FC8181",
    }))
    .sort((a, b) => b.multiple - a.multiple);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2330" />
        <XAxis dataKey="name" tick={{ fill: "#8B95A5", fontSize: 10 }} />
        <YAxis tick={{ fill: "#8B95A5", fontSize: 11 }} tickFormatter={(v) => `${v}x`} />
        <Tooltip
          contentStyle={{ backgroundColor: "#12151E", border: "1px solid #1E2330", borderRadius: 8 }}
          formatter={(val) => [`${Number(val).toFixed(2)}x`, "Multiple"]}
        />
        <ReferenceLine y={1} stroke="#4A5568" strokeDasharray="3 3" label={{ value: "Break-even", fill: "#8B95A5", fontSize: 10 }} />
        <Bar dataKey="multiple" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
