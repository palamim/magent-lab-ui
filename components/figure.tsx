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
  return (
    <figure className="mt-8">
      <div className={wide ? "mx-auto" : "mx-auto max-w-xl"}>{children}</div>
      <figcaption className="mx-auto mt-2 max-w-md text-center font-sans text-xs leading-5 text-zinc-500">
        <span className="font-semibold text-zinc-700">Figure {number}.</span>{" "}
        {title}
        {note ? <>. {note}</> : null}
      </figcaption>
    </figure>
  );
}

/** One titled chart within a grid Figure — a per-panel label, not a numbered caption of its own. */
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
    <div>
      <h3 className="text-center text-xs font-semibold text-zinc-700">
        {title}
      </h3>
      {note ? (
        <p className="mt-0.5 text-center font-sans text-xs text-zinc-500">
          {note}
        </p>
      ) : null}
      <div className="mt-2">{children}</div>
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
    <p className="text-center font-sans text-xs leading-5 text-zinc-500">
      <span className="font-semibold text-zinc-700">Table {number}.</span>{" "}
      {title}
      {note ? <>. {note}</> : null}
    </p>
  );
}
