import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getWorkshopJobById,
  updateWorkshopJobStatus,
  updateWorkshopStage,
} from "../api/workshop.api";
import { updateOrderStatus } from "../../orders/api/orders.api";
import { workshopStatusToOrderStatus } from "../api/workshopOrderSync";
import WorkshopJobDetails from "../components/WorkshopJobDetails";
import type { WorkshopJob } from "../types/workshop.types";

const WorkshopJobDetailsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState<WorkshopJob | null>(null);
  const [loading, setLoading] = useState(true);

  const loadJob = useCallback(async () => {
    if (!jobId) return;

    setLoading(true);

    try {
      const data = await getWorkshopJobById(jobId);

      if (!data) {
        navigate("/workshop", { replace: true });
        return;
      }

      setJob(data);
    } finally {
      setLoading(false);
    }
  }, [jobId, navigate]);

  useEffect(() => {
    void loadJob();
  }, [loadJob]);

  const handleStatusChange = async (
    status: WorkshopJob["status"],
  ) => {
    if (!job) return;

    const updatedJob = await updateWorkshopJobStatus(
      job.id,
      status,
    );

    if (!updatedJob) return;

    setJob(updatedJob);

    const orderStatus =
      workshopStatusToOrderStatus(status);

    await updateOrderStatus(
      updatedJob.orderId,
      orderStatus,
    );
  };

  const handleStageChange = async (
    stageKey: WorkshopJob["currentStage"],
  ) => {
    if (!job) return;

    const updatedJob = await updateWorkshopStage(
      job.id,
      stageKey,
    );

    if (!updatedJob) return;

    setJob(updatedJob);

    if (updatedJob.status === "in_progress") {
      await updateOrderStatus(
        updatedJob.orderId,
        "in_production",
      );
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-[var(--color-muted)]" />

        <div className="mt-6 h-48 animate-pulse rounded-2xl bg-[var(--color-muted)]" />
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <WorkshopJobDetails
        job={job}
        onStageChange={handleStageChange}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default WorkshopJobDetailsPage;