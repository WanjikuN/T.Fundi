import type { WorkshopStage } from "../types/workshop.types";

type Props = {
  stages: WorkshopStage[];
};

const WorkshopProgress = ({ stages }: Props) => {
  const completed = stages.filter(
    (stage) => stage.status === "completed",
  ).length;

  const percentage = Math.round(
    (completed / stages.length) * 100,
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-[var(--color-muted-foreground)]">
          Production progress
        </span>

        <span className="font-medium">
          {percentage}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[var(--color-muted)]">
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default WorkshopProgress;