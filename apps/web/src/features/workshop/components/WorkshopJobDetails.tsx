import {
  ArrowLeft,
  CalendarDays,
  Package,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { WorkshopJob } from "../types/workshop.types";
import WorkshopAssignment from "./WorkshopAssignment";
import WorkshopNotes from "./WorkshopNotes";
import WorkshopProgress from "./WorkshopProgress";
import WorkshopStageBadge from "./WorkshopStageBadge";
import WorkshopTimeline from "./WorkshopTimeline";

type Props = {
  job: WorkshopJob;
  onStageChange: (stageKey: WorkshopJob["currentStage"]) => void;
  onStatusChange: (
    status: WorkshopJob["status"],
  ) => void;
};

const WorkshopJobDetails = ({
  job,
  onStageChange,
  onStatusChange,
}: Props) => {
  const currentStage = job.stages.find(
    (stage) => stage.key === job.currentStage,
  );

  return (
    <div className="space-y-6">
      <Link
        to="/workshop"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] transition hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to workshop
      </Link>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-[var(--color-muted-foreground)]">
              {job.jobNumber}
            </p>

            <WorkshopStageBadge status={job.status} />
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {job.productName}
          </h1>

          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Production job for order {job.orderNumber}
          </p>
        </div>

        <select
          value={job.status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as WorkshopJob["status"],
            )
          }
          className="h-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm outline-none focus:border-[var(--color-primary)]"
        >
          <option value="not_started">
            Not started
          </option>
          <option value="in_progress">
            In progress
          </option>
          <option value="on_hold">On hold</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
            <UserRound size={15} />
            <span className="text-xs">Customer</span>
          </div>

          <p className="mt-2 text-sm font-medium">
            {job.customerName}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
            <Package size={15} />
            <span className="text-xs">Quantity</span>
          </div>

          <p className="mt-2 text-sm font-medium">
            {job.quantity}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
            <CalendarDays size={15} />
            <span className="text-xs">Due date</span>
          </div>

          <p className="mt-2 text-sm font-medium">
            {job.dueDate ?? "Not set"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">
              Production progress
            </h2>

            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Current stage: {currentStage?.name ?? "Not started"}
            </p>
          </div>

          <span className="text-sm font-medium">
            {job.stages.filter(
              (stage) => stage.status === "completed",
            ).length}{" "}
            / {job.stages.length} stages
          </span>
        </div>

        <div className="mt-5">
          <WorkshopProgress stages={job.stages} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-[var(--color-border)] p-5">
          <h2 className="mb-6 font-semibold">
            Production stages
          </h2>

          <WorkshopTimeline stages={job.stages} />

          <div className="border-t border-[var(--color-border)] pt-5">
            <label className="text-xs font-medium text-[var(--color-muted-foreground)]">
              Move to stage
            </label>

            <select
              value={job.currentStage}
              onChange={(event) =>
                onStageChange(
                  event.target.value as WorkshopJob["currentStage"],
                )
              }
              className="mt-2 h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm outline-none focus:border-[var(--color-primary)]"
            >
              {job.stages.map((stage) => (
                <option
                  key={stage.key}
                  value={stage.key}
                >
                  {stage.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <WorkshopAssignment
            employee={job.assignedTo}
          />

          <WorkshopNotes notes={job.notes} />
        </div>
      </div>
    </div>
  );
};

export default WorkshopJobDetails;