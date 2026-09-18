import type {
  WorkshopJobStatus,
  WorkshopStageStatus,
} from "../types/workshop.types";

type Props = {
  status: WorkshopJobStatus | WorkshopStageStatus;
};

const labels: Record<string, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  on_hold: "On hold",
  completed: "Completed",
  cancelled: "Cancelled",
  pending: "Pending",
  skipped: "Skipped",
};

const WorkshopStageBadge = ({ status }: Props) => {
  const className =
    status === "completed"
      ? "bg-emerald-500/10 text-emerald-700"
      : status === "in_progress"
        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
        : status === "on_hold"
          ? "bg-amber-500/10 text-amber-700"
          : status === "cancelled"
            ? "bg-red-500/10 text-red-700"
            : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {labels[status] ?? status}
    </span>
  );
};

export default WorkshopStageBadge;