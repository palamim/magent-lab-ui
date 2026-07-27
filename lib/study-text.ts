import type { ConventionsJudgeStudyExport } from "./generated/study-export";

/**
 * Assembles the Method section from the study's own structured fields —
 * no narrative is invented, only existing values restated as prose.
 */
export function describeMethod(study: ConventionsJudgeStudyExport): string {
  const { dataset, subject, validity } = study;
  const sentences: string[] = [];

  sentences.push(
    `Each of ${dataset.nDiffs} labeled diffs was judged ${dataset.replicatesPerDiff} times by subject "${subject.subjectKey}" (model: ${subject.model}, criteria v${subject.criteriaVersion}, prompt v${subject.promptVersion}).`,
  );

  sentences.push(
    "Validity is measured against expected labels via Clopper-Pearson exact confidence intervals, computed per criterion.",
  );

  const bootstrap = validity.perCriterion[0]?.clusterBootstrapAgreement;
  if (bootstrap) {
    sentences.push(
      `A cluster-bootstrap agreement estimate (${bootstrap.iterations} iterations, seed ${bootstrap.seed}) treats replicates within a diff as clustered.`,
    );
  }

  return sentences.join(" ");
}
