import type { WorkshopJob } from "../../workshop/types/workshop.types";
import WorkshopProgress from "../../workshop/components/WorkshopProgress";

type Props = {
  job?: WorkshopJob;
};

const OrderProductionProgress = ({ job }: Props) => {
  if (!job) return null;

  const currentStage = job.stages.find(
    (stage) => stage.key === job.currentStage,
  );

  return (
    <div className="rounded-2xl border border-[var(--color-border)] p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">
            Production progress
          </h2>

          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            {currentStage?.name ?? "Production"}
          </p>
        </div>

        <span className="text-xs text-[var(--color-muted-foreground)]">
          {job.stages.filter(
            (stage) => stage.status === "completed",
          ).length}{" "}
          of {job.stages.length} stages complete
        </span>
      </div>

      <div className="mt-5">
        <WorkshopProgress stages={job.stages} />
      </div>
    </div>
  );
};

export default OrderProductionProgress;