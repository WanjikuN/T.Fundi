import {
  AlertCircle,
  CheckCircle2,
  Hammer,
  Timer,
} from "lucide-react";
import type { WorkshopJob } from "../types/workshop.types";

type Props = {
  jobs: WorkshopJob[];
};

const WorkshopSummaryCards = ({ jobs }: Props) => {
  const active = jobs.filter(
    (job) => job.status === "in_progress",
  ).length;

  const completed = jobs.filter(
    (job) => job.status === "completed",
  ).length;

  const onHold = jobs.filter(
    (job) => job.status === "on_hold",
  ).length;

  const dueSoon = jobs.filter((job) => {
    if (!job.dueDate) return false;

    const due = new Date(job.dueDate).getTime();
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    return due >= now && due <= now + sevenDays;
  }).length;

  const metrics = [
    {
      label: "Active jobs",
      value: active,
      icon: Hammer,
    },
    {
      label: "Due soon",
      value: dueSoon,
      icon: Timer,
    },
    {
      label: "On hold",
      value: onHold,
      icon: AlertCircle,
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {metrics.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-4"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-muted)]">
            <Icon size={17} />
          </div>

          <div>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              {label}
            </p>
            <p className="mt-0.5 text-xl font-semibold">
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkshopSummaryCards;