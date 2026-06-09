"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export function TopItemsChart({ data }: { data: { name: string; sales: number }[] }) {
  if (!data.length) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[hsl(var(--muted-foreground))]">
        No sales data yet. Add some orders to see the chart.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 12% 20%)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "hsl(220 8% 55%)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "hsl(220 8% 55%)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(220 14% 11%)",
            border: "1px solid hsl(220 12% 20%)",
            borderRadius: "8px",
            color: "hsl(220 10% 93%)",
            fontSize: "12px",
          }}
          cursor={{ fill: "hsl(220 12% 20%)" }}
        />
        <Bar dataKey="sales" fill="hsl(174 72% 38%)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
