/**
 * Renders a number in monospace, with the integer part right-aligned to a
 * fixed width so decimal points line up down a column. Every value in this
 * schema is bounded to [-1, 1], so a 2ch integer column (fits "-1") is
 * always enough.
 *
 * Without `decimals`, the value is shown at full stored precision — no
 * rounding. With `decimals`, it's rounded to that many places for display
 * only (e.g. the results table); the source JSON is never altered.
 */
export function Num({
  value,
  decimals,
}: {
  value: number;
  decimals?: number;
}) {
  const str = decimals === undefined ? String(value) : value.toFixed(decimals);
  const dot = str.indexOf(".");
  const intPart = dot === -1 ? str : str.slice(0, dot);
  const fracPart = dot === -1 ? "" : str.slice(dot);

  return (
    <span className="font-mono tabular-nums whitespace-nowrap">
      <span className="inline-block w-[2ch] text-right">{intPart}</span>
      <span>{fracPart}</span>
    </span>
  );
}
