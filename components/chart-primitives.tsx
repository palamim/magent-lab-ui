"use client";

import type { BarShapeProps } from "recharts";

const MAX_LABEL_CHARS = 18;

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

export function CriterionTick(props: {
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

/**
 * A horizontal bar, or — where the payload is flagged not measurable — its
 * reason as text in the bar's place. Positioned against `background` (the
 * full row band Recharts computes when `<Bar background>` is set) rather
 * than the value bar's own x/width, so the reason lands at the row's true
 * left edge even on a diverging (zero-baseline-in-the-middle) axis, where a
 * zero-value bar's own x sits at the baseline, not the axis start.
 */
export function BarOrGapShape(
  props: BarShapeProps & {
    payload?: { notMeasurable?: boolean; reason?: string };
    background?: { x?: number | null; y?: number | null; height?: number };
  },
) {
  const { x = 0, y = 0, width = 0, height = 0, payload, background } = props;

  if (payload?.notMeasurable) {
    const gapX = background?.x ?? x;
    const gapY = background?.y ?? y;
    const gapHeight = background?.height ?? height;
    return (
      <text x={gapX + 4} y={gapY + gapHeight / 2} dy={4} fontSize={11} fill="#71717a">
        {payload.reason}
      </text>
    );
  }
  return (
    <rect x={x} y={y} width={width} height={height} rx={2} fill="#d4d4d8" />
  );
}
