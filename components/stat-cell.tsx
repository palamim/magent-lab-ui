import { Num } from "./num";
import { DISPLAY_DECIMALS } from "@/lib/display";
import type {
  ClusterBootstrapAgreement,
  MeasurableRate,
} from "@/lib/generated/study-export";

export function MeasurableRateCell({ rate }: { rate: MeasurableRate }) {
  if (rate.value === null) {
    return (
      <span className="text-xs text-zinc-600">{rate.reason}</span>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <Num value={rate.value} decimals={DISPLAY_DECIMALS} />
      <span className="text-xs text-zinc-500">
        [<Num value={rate.ci.low} decimals={DISPLAY_DECIMALS} />,{" "}
        <Num value={rate.ci.high} decimals={DISPLAY_DECIMALS} />]
      </span>
      <span className="text-xs text-zinc-500">
        n=<Num value={rate.n} />
      </span>
    </div>
  );
}

export function ClusterBootstrapCell({
  agreement,
}: {
  agreement: ClusterBootstrapAgreement;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <Num value={agreement.estimate} decimals={DISPLAY_DECIMALS} />
      <span className="text-xs text-zinc-500">
        [<Num value={agreement.ci.low} decimals={DISPLAY_DECIMALS} />,{" "}
        <Num value={agreement.ci.high} decimals={DISPLAY_DECIMALS} />]
      </span>
      <span className="text-xs text-zinc-500">
        nClusters=<Num value={agreement.nClusters} />
      </span>
    </div>
  );
}
