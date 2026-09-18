import {
  ArrowLeft,
  CalendarDays,
  Check,
  Package,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { WorkshopEmployee, WorkshopJob } from "../types/workshop.types";
import WorkshopNotes from "./WorkshopNotes";
import WorkshopProgress from "./WorkshopProgress";
import WorkshopStageBadge from "./WorkshopStageBadge";
import WorkshopTimeline from "./WorkshopTimeline";

type Props = {
  job: WorkshopJob;
  employees: WorkshopEmployee[];
  onSave: (
    stage: WorkshopJob["currentStage"],
    status: WorkshopJob["status"],
    employeeId: string,
    note: string,
  ) => Promise<void>;
};

const WorkshopJobDetails = ({ job, employees, onSave }: Props) => {
  const [draftStage, setDraftStage] = useState<WorkshopJob["currentStage"]>(
    job.currentStage,
  );

  const [draftStatus, setDraftStatus] = useState<WorkshopJob["status"]>(
    job.status,
  );
  const [draftEmployeeId, setDraftEmployeeId] = useState(
    job.assignedTo?.id ?? "",
  );
  const [draftNote, setDraftNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraftStage(job.currentStage);
    setDraftStatus(job.status);
    setDraftEmployeeId(job.assignedTo?.id ?? "");
    setDraftNote("");
  }, [job.id, job.currentStage, job.status, job.assignedTo?.id]);

  const hasChanges =
    draftStage !== job.currentStage ||
    draftStatus !== job.status ||
    draftEmployeeId !== (job.assignedTo?.id ?? "") ||
    draftNote.trim().length > 0;
  const currentStage = job.stages.find((stage) => stage.key === draftStage);

  const handleSave = async () => {
    if (!hasChanges || saving) return;

    setSaving(true);

    try {
      await onSave(draftStage, draftStatus, draftEmployeeId, draftNote.trim());
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-[calc(92vh-4rem)] min-h-0 flex-col">
      {/* Scrollable content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
          <Link
            to="/workshop"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] transition hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to workshop
          </Link>

          {/* Header */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  {job.jobNumber}
                </p>

                <WorkshopStageBadge status={draftStatus} />
              </div>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                {job.productName}
              </h1>

              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                Production job for order {job.orderNumber}
              </p>
            </div>
          </div>

          {/* Job information */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--color-primary)] bg-[var(--color-background)] p-4">
              <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
                <UserRound size={15} />
                <span className="text-xs">Customer</span>
              </div>

              <p className="mt-2 text-sm font-medium">{job.customerName}</p>
            </div>

            <div className="rounded-2xl border border-[var(--color-primary)] bg-[var(--color-background)] p-4">
              <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
                <Package size={15} />
                <span className="text-xs">Quantity</span>
              </div>

              <p className="mt-2 text-sm font-medium">{job.quantity}</p>
            </div>

            <div className="rounded-2xl border border-[var(--color-primary)] bg-[var(--color-background)] p-4">
              <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
                <CalendarDays size={15} />
                <span className="text-xs">Due date</span>
              </div>

              <p className="mt-2 text-sm font-medium">
                {job.dueDate ?? "Not set"}
              </p>
            </div>
          </div>

          {/* Production progress */}
          <div className="rounded-2xl shadow-md border-[var(--color-border)] bg-[var(--color-background)] p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">Production progress</h2>

                <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                  Current stage: {currentStage?.name ?? "Not started"}
                </p>
              </div>

              <span className="text-sm font-medium">
                {
                  job.stages.filter((stage) => stage.status === "completed")
                    .length
                }{" "}
                / {job.stages.length} stages
              </span>
            </div>

            <div className="mt-5">
              <WorkshopProgress stages={job.stages} />
            </div>
          </div>

          {/* Production + assignment */}
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-2xl  border-[var(--color-border)] bg-[var(--color-background)] p-5">
              <h2 className="mb-6 font-semibold">Production stages</h2>

              <WorkshopTimeline stages={job.stages} />

              <div className="mt-2 grid gap-4 border-t border-[var(--color-primary)] pt-5 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-[var(--color-muted-foreground)]">
                    Current stage
                  </label>

                  <select
                    value={draftStage}
                    onChange={(event) =>
                      setDraftStage(
                        event.target.value as WorkshopJob["currentStage"],
                      )
                    }
                    className="mt-2 h-10 w-full rounded-xl border border-[var(--color-primary)] bg-[var(--color-background)] px-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
                  >
                    {job.stages.map((stage) => (
                      <option key={stage.key} value={stage.key}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--color-muted-foreground)]">
                    Job status
                  </label>

                  <select
                    value={draftStatus}
                    onChange={(event) =>
                      setDraftStatus(
                        event.target.value as WorkshopJob["status"],
                      )
                    }
                    className="mt-2 h-10 w-full rounded-xl border border-[var(--color-primary)] bg-[var(--color-background)] px-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
                  >
                    <option value="not_started">Not started</option>
                    <option value="in_progress">In progress</option>
                    <option value="on_hold">On hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl  bg-[var(--color-secondary)] p-5">
                <h2 className="font-semibold">Assignment</h2>

                <label className="mt-4 block text-xs font-medium text-[var(--color-muted-foreground)]">
                  Assign to
                </label>

                <select
                  value={draftEmployeeId}
                  onChange={(event) => setDraftEmployeeId(event.target.value)}
                  className="mt-2 h-11 shadow-md w-full rounded-xl border border-[var(--color-primary)] bg-[var(--color-background)] px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="">Unassigned</option>

                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} · {employee.role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rounded-2xl shadow-md border-[var(--color-border)] p-5">
                <h2 className="font-semibold">Add note</h2>

                <textarea
                  value={draftNote}
                  onChange={(event) => setDraftNote(event.target.value)}
                  placeholder="Add a production note..."
                  rows={4}
                  className="mt-4 w-full resize-none rounded-xl border border-[var(--color-secondary)] bg-[var(--color-background)] p-3 text-sm outline-none placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--color-primary)]"
                />
              </div>
              <WorkshopNotes notes={job.notes} />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed save bar */}
      <div className="shrink-0 border-t border-[var(--color-primary)] bg-[var(--color-background)] px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            {hasChanges ? (
              <p className="text-xs text-[var(--color-muted-foreground)]">
                You have unsaved changes.
              </p>
            ) : (
              <p className="text-xs text-[var(--color-muted-foreground)]">
                All changes saved.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-medium text-[var(--color-primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[var(--color-secondary)]"
          >
            <Check size={16} />

            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopJobDetails;
