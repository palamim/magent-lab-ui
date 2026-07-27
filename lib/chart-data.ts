import type {
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
