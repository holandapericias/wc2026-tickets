"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface Props {
  totalCost: number;
  marketValue: number;
  youReceive: number;
  netProfit: number;
}

export default function WaterfallChart({ totalCost, marketValue, youReceive, netProfit }: Props) {
  const data = [
    { name: "Cost Basis", value: totalCost, fill: "#4A5568" },
    { name: "Market Value", value: marketValue, fill: "#C8102E" },
    { name: "You Receive", value: youReceive, fill: "#D4AF37" },
    { name: "Net Profit", value: netProfit, fill: netProfit >= 0 ? "#48BB78" : "#FC8181" },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2330" />
        <XAxis dataKey="name" tick={{ fill: "#8B95A5", fontSize: 11 }} />
        <YAxis tick={{ fill: "#8B95A5", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{ backgroundColor: "#12151E", border: "1px solid #1E2330", borderRadius: 8 }}
          formatter={(val) => [`$${Number(val).toLocaleString()}`, ""]}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
