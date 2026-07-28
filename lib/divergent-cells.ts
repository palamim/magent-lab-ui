import type { DivergentCell } from "./generated/study-export";

export type DivergentCellGroup = {
  criterion: string;
  cells: DivergentCell[];
};

/** Groups divergent cells by criterion, in the given canonical criterion order; a criterion with none is omitted. */
export function groupDivergentCells(
  divergentCells: DivergentCell[],
  criteriaOrder: string[],
): DivergentCellGroup[] {
  return criteriaOrder
    .map((criterion) => ({
      criterion,
      cells: divergentCells.filter((cell) => cell.criterion === criterion),
    }))
    .filter((group) => group.cells.length > 0);
}
