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
import { BarOrGapShape, CriterionTick, estimateYAxisWidth } from "./chart-primitives";

type BarDatum = {
  criterion: string;
  value: number;
  error?: [number, number];
  notMeasurable: boolean;
  reason?: string;
};

const ROW_HEIGHT = 56;
const AXIS_TICKS = [0, 0.25, 0.5, 0.75, 1];

function toBarDatum(row: ChartRow, shortenCriterion: boolean): BarDatum {
  const criterion = shortenCriterion
    ? row.criterion.split(" ")[0]
    : row.criterion;

  if (row.value === null || !row.ci) {
    return {
      criterion,
      value: 0,
      notMeasurable: true,
      reason: row.reason,
    };
  }
  return {
    criterion,
    value: row.value,
    error: [row.value - row.ci.low, row.ci.high - row.value],
    notMeasurable: false,
  };
}

export function RateBarChart({
  rows,
  shortenCriterion,
}: {
  rows: ChartRow[];
  /** Y-axis label is the criterion's first word only — for tight grid layouts. */
  shortenCriterion?: boolean;
}) {
  const data = rows.map((row) => toBarDatum(row, Boolean(shortenCriterion)));
  const height = data.length * ROW_HEIGHT + 32;
  const yAxisWidth = estimateYAxisWidth(data.map((d) => d.criterion));

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
            width={yAxisWidth}
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
