import type {
  ConsistencyPerCriterion,
  MeasurableRate,
  ValidityPerCriterion,
} from "./generated/study-export";

export type ChartRow = {
  criterion: string;
  value: number | null;
  ci?: { low: number; high: number };
  reason?: string;
};

function rateRow(criterion: string, rate: MeasurableRate): ChartRow {
  if (rate.value === null) {
    return { criterion, value: null, reason: rate.reason };
  }
  return { criterion, value: rate.value, ci: rate.ci };
}

export function majorityVoteAccuracyRows(
  perCriterion: ValidityPerCriterion[],
): ChartRow[] {
  return perCriterion.map((row) =>
    rateRow(row.criterion, row.majorityVoteAccuracy),
  );
}

export function sensitivityRows(
  perCriterion: ValidityPerCriterion[],
): ChartRow[] {
  return perCriterion.map((row) => rateRow(row.criterion, row.sensitivity));
}

export function specificityRows(
  perCriterion: ValidityPerCriterion[],
): ChartRow[] {
  return perCriterion.map((row) => rateRow(row.criterion, row.specificity));
}

export function clusterBootstrapRows(
  perCriterion: ValidityPerCriterion[],
): ChartRow[] {
  return perCriterion.map((row) => ({
    criterion: row.criterion,
    value: row.clusterBootstrapAgreement.estimate,
    ci: row.clusterBootstrapAgreement.ci,
  }));
}

export type SplitHistogramRow = { split: string; count: number };

/** Sorted most- to least-unanimous, by the split label's majority count. */
export function splitHistogramRows(
  splitHistogram: Record<string, number>,
): SplitHistogramRow[] {
  return Object.entries(splitHistogram)
    .map(([split, count]) => ({ split, count }))
    .sort((a, b) => Number(b.split.split("-")[0]) - Number(a.split.split("-")[0]));
}

export type KappaChartRow = {
  criterion: string;
  value: number | null;
  reason?: string;
};

export function kappaRows(
  perCriterion: ConsistencyPerCriterion[],
): KappaChartRow[] {
  return perCriterion.map((row) =>
    row.selfAgreementKappa === null
      ? { criterion: row.criterion, value: null, reason: row.reason }
      : { criterion: row.criterion, value: row.selfAgreementKappa },
  );
}
