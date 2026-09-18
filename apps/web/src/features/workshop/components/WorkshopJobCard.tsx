import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import type { WorkshopEmployee, WorkshopJob } from "../types/workshop.types";
import WorkshopProgress from "./WorkshopProgress";
import WorkshopStageBadge from "./WorkshopStageBadge";

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

const WorkshopJobCard = ({ job }: Props) => {
  return (
    <Link
      to={`/workshop/${job.id}`}
      className="group block rounded-2xl shadow-md border border-[var(--color-secondary)] bg-[var(--color-background)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[var(--color-muted-foreground)]">
            {job.jobNumber}
          </p>

          
        </div>

        <WorkshopStageBadge status={job.status} />
      </div>

      <div className="mt-4 space-y-2 text-sm">
        

        <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
          <CalendarDays size={14} />
          Due {job.dueDate}
        </div>
      </div>

      <div className="mt-4">
        <WorkshopProgress stages={job.stages} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-xs">
       <h3 className="mt-1 font-semibold">
            {job.productName}
          </h3>

        <ArrowRight
          size={15}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
};

export default WorkshopJobCard;