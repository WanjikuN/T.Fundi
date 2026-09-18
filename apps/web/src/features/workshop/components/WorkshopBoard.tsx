import type { WorkshopJob } from "../types/workshop.types";
import WorkshopJobCard from "./WorkshopJobCard";

type Props = {
  jobs: WorkshopJob[];
};

const stages = [
  {
    key: "materials",
    label: "Materials",
  },
  {
    key: "frame_construction",
    label: "Frame Construction",
  },
  {
    key: "upholstery",
    label: "Upholstery",
  },
  {
    key: "finishing",
    label: "Finishing",
  },
  {
    key: "quality_control",
    label: "Quality Control",
  },
  {
    key: "delivery",
    label: "Delivery",
  },
] as const;

const WorkshopBoard = ({ jobs }: Props) => {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="grid min-w-[1100px] grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageJobs = jobs.filter(
            (job) => job.currentStage === stage.key,
          );

          return (
            <div key={stage.key}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  {stage.label}
                </h3>

                <span className="rounded-full bg-[var(--color-muted)] px-2 py-0.5 text-xs">
                  {stageJobs.length}
                </span>
              </div>

              <div className="space-y-3">
                {stageJobs.map((job) => (
                  <WorkshopJobCard
                    key={job.id}
                    job={job}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkshopBoard;