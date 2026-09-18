import {
  Check,
  Circle,
  Clock3,
} from "lucide-react";
import type { WorkshopStage } from "../types/workshop.types";

type Props = {
  stages: WorkshopStage[];
};

const WorkshopTimeline = ({ stages }: Props) => {
  return (
    <div className="space-y-0">
      {stages.map((stage, index) => {
        const completed = stage.status === "completed";
        const active = stage.status === "in_progress";
        const last = index === stages.length - 1;

        return (
          <div
            key={stage.id}
            className="relative flex gap-4"
          >
            {!last && (
              <div
                className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-px ${
                  completed
                    ? "bg-[var(--color-primary)]"
                    : "bg-[var(--color-border)]"
                }`}
              />
            )}

            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-[var(--color-background)]">
              {completed ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
                  <Check size={15} />
                </div>
              ) : active ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/10">
                  <Clock3
                    size={14}
                    className="text-[var(--color-primary)]"
                  />
                </div>
              ) : (
                <Circle
                  size={15}
                  className="text-[var(--color-muted-foreground)]"
                />
              )}
            </div>

            <div className="pb-7">
              <p className="text-sm font-medium">
                {stage.name}
              </p>

              <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                {completed
                  ? "Completed"
                  : active
                    ? "Currently in progress"
                    : "Pending"}
              </p>

              {stage.notes && (
                <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                  {stage.notes}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorkshopTimeline;