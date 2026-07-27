import type { ReactNode } from "react";

export function Figure({
  number,
  title,
  note,
  children,
}: {
  number: number;
  title: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="mt-8">
      <div className="mx-auto max-w-xl">{children}</div>
      <figcaption className="mx-auto mt-2 max-w-md text-center text-xs leading-5 text-zinc-500">
        <span className="font-semibold text-zinc-700">Figure {number}.</span>{" "}
        {title}
        {note ? <>. {note}</> : null}
      </figcaption>
    </figure>
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
    <p className="text-center text-xs leading-5 text-zinc-500">
      <span className="font-semibold text-zinc-700">Table {number}.</span>{" "}
      {title}
      {note ? <>. {note}</> : null}
    </p>
  );
}
