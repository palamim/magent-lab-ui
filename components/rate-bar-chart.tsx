"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ErrorBar,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartRow } from "@/lib/chart-data";
import { BarOrGapShape, CriterionTick } from "./chart-primitives";

type BarDatum = {
  criterion: string;
  value: number;
  error?: [number, number];
  notMeasurable: boolean;
  reason?: string;
};

const ROW_HEIGHT = 56;
const AXIS_TICKS = [0, 0.25, 0.5, 0.75, 1];

function toBarDatum(row: ChartRow): BarDatum {
  if (row.value === null || !row.ci) {
    return {
      criterion: row.criterion,
      value: 0,
      notMeasurable: true,
      reason: row.reason,
    };
  }
  return {
    criterion: row.criterion,
    value: row.value,
    error: [row.value - row.ci.low, row.ci.high - row.value],
    notMeasurable: false,
  };
}

export function RateBarChart({ rows }: { rows: ChartRow[] }) {
  const data = rows.map(toBarDatum);
  const height = data.length * ROW_HEIGHT + 32;

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
        >
          <CartesianGrid horizontal={false} stroke="#e4e4e7" />
          <XAxis
            type="number"
            domain={[0, 1]}
            ticks={AXIS_TICKS}
            tickFormatter={(v: number) => v.toFixed(2)}
            stroke="#71717a"
            tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
          />
          <YAxis
            type="category"
            dataKey="criterion"
            width={110}
            stroke="#71717a"
            tick={<CriterionTick />}
          />
          <Bar
            dataKey="value"
            shape={BarOrGapShape}
            background={{ fill: "transparent" }}
            barSize={14}
            isAnimationActive={false}
          >
            <ErrorBar
              dataKey="error"
              direction="x"
              width={5}
              strokeWidth={1.5}
              stroke="#18181b"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
