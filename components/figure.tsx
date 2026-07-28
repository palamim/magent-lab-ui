import type { ReactNode } from "react";

export function Figure({
  number,
  title,
  note,
  wide,
  children,
}: {
  number: number;
  title: string;
  note?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  const measure = wide ? "mx-auto" : "mx-auto max-w-xl";

  return (
    <figure className="mt-8">
      <div className={measure}>{children}</div>
      <figcaption
        className={`mt-2 font-sans text-xs leading-5 text-zinc-500 ${measure}`}
      >
        <div className="font-semibold italic text-zinc-700">
          Figure {number}. {title}
        </div>
        {note ? <div className="italic">{note}</div> : null}
      </figcaption>
    </figure>
  );
}

/**
 * One titled chart within a Figure — a per-panel label, not a numbered
 * caption of its own. The panel background (bg-panel) frames the chart's
 * own white surface, which keeps its rounded corners nested one step
 * inside the panel's.
 */
export function ChartPanel({
  title,
  note,
  children,
}: {
  title: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-panel p-6">
      <h3 className="text-center text-base font-semibold text-zinc-600">
        {title}
      </h3>
      {note ? (
        <p className="mt-1 text-center font-sans text-xs text-zinc-500">
          {note}
        </p>
      ) : null}
      <div className="mt-4 rounded-2xl bg-white p-4">{children}</div>
    </div>
  );
}

export function TableCaption({
  number,
  title,
  note,
}: {
  number: number;
  title: string;
  note?: ReactNode;
}) {
  return (
    <p className="font-sans text-xs leading-5 text-zinc-500">
      <span className="block font-semibold italic text-zinc-700">
        Table {number}. {title}
      </span>
      {note ? <span className="block italic">{note}</span> : null}
    </p>
  );
}
