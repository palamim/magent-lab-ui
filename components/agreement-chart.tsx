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
import type { ValidityPerCriterion } from "@/lib/generated/study-export";

type Row = {
  criterion: string;
  value: number;
  error?: [number, number];
  notMeasurable: boolean;
  reason?: string;
};

const ROW_HEIGHT = 48;
const AXIS_TICKS = [0, 0.25, 0.5, 0.75, 1];

function toRow(row: ValidityPerCriterion): Row {
  const rate = row.majorityVoteAccuracy;
  if (rate.value === null) {
    return {
      criterion: row.criterion,
      value: 0,
      notMeasurable: true,
      reason: rate.reason,
    };
  }
  return {
    criterion: row.criterion,
    value: rate.value,
    error: [rate.value - rate.ci.low, rate.ci.high - rate.value],
    notMeasurable: false,
  };
}

function BarOrGapShape(props: BarShapeProps) {
  const { x = 0, y = 0, width = 0, height = 0 } = props;
  const payload = props.payload as Row;

  if (payload.notMeasurable) {
    return (
      <text x={x + 4} y={y + height / 2} dy={4} fontSize={11} fill="#71717a">
        {payload.reason}
      </text>
    );
  }
  return <rect x={x} y={y} width={width} height={height} rx={2} fill="#18181b" />;
}

export function AgreementChart({
  perCriterion,
}: {
  perCriterion: ValidityPerCriterion[];
}) {
  const data = perCriterion.map(toRow);
  const height = data.length * ROW_HEIGHT + 32;

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 24, bottom: 8, left: 0 }}
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
            width={168}
            stroke="#71717a"
            tick={{ fontSize: 11 }}
          />
          <Bar
            dataKey="value"
            shape={BarOrGapShape}
            barSize={16}
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
