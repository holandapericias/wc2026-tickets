"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

interface Props {
  data: { date: string; ask: number | null }[];
  color?: string;
}

export default function SparkLine({ data, color = "#C8102E" }: Props) {
  const chartData = data.filter((d) => d.ask != null).slice(-14);

  if (chartData.length < 2) {
    return <div className="w-16 h-6 text-xs text-dark-muted">—</div>;
  }

  return (
    <div className="w-16 h-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="ask"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
