import type { DivergentCell, Replicate } from "@/lib/generated/study-export";
import type { DivergentCellGroup } from "@/lib/divergent-cells";

function ReplicateItem({
  index,
  replicate,
  groundTruth,
}: {
  index: number;
  replicate: Replicate;
  groundTruth: "yes" | "no";
}) {
  const diverges = replicate.actual !== groundTruth;

  return (
    <li className="border-t border-black/5 py-2 first:border-t-0 first:pt-0">
      <p className="text-xs">
        <span className="font-mono text-zinc-500">[{index}]</span>{" "}
        <span className={diverges ? "font-semibold text-black" : "text-zinc-700"}>
          {replicate.actual}
        </span>
        {diverges ? (
          <span className="ml-1 text-zinc-500">— diverges from expected</span>
        ) : null}
      </p>
      <p className="mt-1 text-xs leading-5 text-zinc-600">{replicate.reasoning}</p>
    </li>
  );
}

function DivergentCellDetails({ cell }: { cell: DivergentCell }) {
  return (
    <details className="mt-3 border-t border-black/10 pt-3 first:mt-0 first:border-t-0 first:pt-0">
      <summary className="cursor-pointer text-sm text-zinc-800">
        <span className="font-mono">{cell.diffKey}</span> — split {cell.split},
        expected {cell.groundTruth}
      </summary>
      <ol className="mt-2">
        {cell.replicates.map((replicate, i) => (
          <ReplicateItem
            key={i}
            index={i + 1}
            replicate={replicate}
            groundTruth={cell.groundTruth}
          />
        ))}
      </ol>
    </details>
  );
}

export function DivergentCellsExplorer({ groups }: { groups: DivergentCellGroup[] }) {
  if (groups.length === 0) {
    return (
      <p className="mt-3 text-sm italic text-zinc-500">
        No divergent cells — every (diff, criterion) cell was unanimous
        across all replicates.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-8">
      {groups.map((group) => (
        <div key={group.criterion}>
          <h3 className="text-xs font-semibold text-zinc-500">
            {group.criterion}
          </h3>
          <div>
            {group.cells.map((cell) => (
              <DivergentCellDetails key={cell.diffKey} cell={cell} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
