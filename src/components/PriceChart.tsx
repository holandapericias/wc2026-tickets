"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface Props {
  data: { date: string; ask: number | null; sale: number | null }[];
  costBasis: number;
}

export default function PriceChart({ data, costBasis }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-dark-muted">
        No price data yet. Run the scraper to collect prices.
      </div>
    );
  }

  const chartData = data
    .filter((d) => d.ask != null || d.sale != null)
    .map((d) => ({
      ...d,
      cost: costBasis,
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2330" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#8B95A5", fontSize: 11 }}
          tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        />
        <YAxis
          tick={{ fill: "#8B95A5", fontSize: 11 }}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#12151E", border: "1px solid #1E2330", borderRadius: 8 }}
          labelStyle={{ color: "#8B95A5" }}
          formatter={(val) => [`$${val}`, ""]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="ask"
          stroke="#C8102E"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Ask Price"
        />
        <Line
          type="monotone"
          dataKey="sale"
          stroke="#D4AF37"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Last Sale"
          strokeDasharray="5 5"
        />
        <Line
          type="monotone"
          dataKey="cost"
          stroke="#4A5568"
          strokeWidth={1}
          dot={false}
          name="Cost Basis"
          strokeDasharray="3 3"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
