"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { SplitHistogramRow } from "@/lib/chart-data";

const HEIGHT = 220;

export function SplitHistogramChart({ rows }: { rows: SplitHistogramRow[] }) {
  return (
    <div style={{ width: "100%", height: HEIGHT }}>
      <ResponsiveContainer>
        <BarChart data={rows} margin={{ top: 20, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid vertical={false} stroke="#e4e4e7" />
          <XAxis
            dataKey="split"
            type="category"
            stroke="#71717a"
            tick={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
          />
          <YAxis
            type="number"
            allowDecimals={false}
            stroke="#71717a"
            tick={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
          />
          <Bar
            dataKey="count"
            fill="#d4d4d8"
            radius={[4, 4, 0, 0]}
            barSize={24}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="count"
              position="top"
              fontSize={11}
              fill="#3f3f46"
              fontFamily="var(--font-geist-mono)"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
