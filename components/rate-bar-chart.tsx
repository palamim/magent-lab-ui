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
import type { BarShapeProps } from "recharts";
import type { ChartRow } from "@/lib/chart-data";

type BarDatum = {
  criterion: string;
  value: number;
  error?: [number, number];
  notMeasurable: boolean;
  reason?: string;
};

const ROW_HEIGHT = 56;
const AXIS_TICKS = [0, 0.25, 0.5, 0.75, 1];
const MAX_LABEL_CHARS = 18;

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

/** Greedily wraps a criterion name to fit the fixed-width Y axis without overflow. */
function wrapLabel(label: string): string[] {
  const words = label.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > MAX_LABEL_CHARS && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function CriterionTick(props: {
  x?: number;
  y?: number;
  textAnchor?: "end" | "start" | "middle" | "inherit";
  payload?: { value: string };
}) {
  const { x = 0, y = 0, textAnchor = "end", payload } = props;
  const lines = wrapLabel(String(payload?.value ?? ""));
  const lineHeight = 12;
  const startDy = -((lines.length - 1) * lineHeight) / 2 + 4;

  return (
    <text x={x} y={y} textAnchor={textAnchor} fontSize={11} fill="#71717a">
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? startDy : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function BarOrGapShape(props: BarShapeProps) {
  const { x = 0, y = 0, width = 0, height = 0 } = props;
  const payload = props.payload as BarDatum;

  if (payload.notMeasurable) {
    return (
      <text x={x + 4} y={y + height / 2} dy={4} fontSize={11} fill="#71717a">
        {payload.reason}
      </text>
    );
  }
  return (
    <rect x={x} y={y} width={width} height={height} rx={2} fill="#d4d4d8" />
  );
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
            tick={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
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
