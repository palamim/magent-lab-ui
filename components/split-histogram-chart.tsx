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
const X_AXIS_HEIGHT = 24;
const Y_AXIS_CHAR_WIDTH_PX = 6.5;
const Y_AXIS_PADDING_PX = 14;

/**
 * Recharts falls back to a fixed 60px/30px axis reservation when width/height
 * aren't given explicitly, which overshoots short numeric labels and reads as
 * a left/bottom-heavy chart — especially at mobile widths, where that fixed
 * overshoot is a bigger share of the panel. Size to the actual digit count
 * instead.
 */
function estimateCountAxisWidth(rows: SplitHistogramRow[]): number {
  const maxDigits = rows.reduce(
    (max, row) => Math.max(max, String(row.count).length),
    1,
  );
  return Math.ceil(maxDigits * Y_AXIS_CHAR_WIDTH_PX) + Y_AXIS_PADDING_PX;
}

export function SplitHistogramChart({ rows }: { rows: SplitHistogramRow[] }) {
  const yAxisWidth = estimateCountAxisWidth(rows);

  return (
    <div style={{ width: "100%", height: HEIGHT }}>
      <ResponsiveContainer>
        <BarChart data={rows} margin={{ top: 20, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid vertical={false} stroke="#e4e4e7" />
          <XAxis
            dataKey="split"
            type="category"
            height={X_AXIS_HEIGHT}
            stroke="#71717a"
            tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
          />
          <YAxis
            type="number"
            allowDecimals={false}
            width={yAxisWidth}
            stroke="#71717a"
            tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
          />
          <Bar
            dataKey="count"
            fill="var(--color-accent)"
            radius={[4, 4, 0, 0]}
            barSize={24}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="count"
              position="top"
              fontSize={11}
              fill="#3f3f46"
              fontFamily="var(--font-mono)"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
