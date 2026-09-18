import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getWorkshopEmployees,
  getWorkshopJobById,
  updateWorkshopAssignment,
  updateWorkshopJobStatus,
  updateWorkshopStage,
  addWorkshopNote,
} from "../api/workshop.api";
import { updateOrderStatus } from "../../orders/api/orders.api";
import { workshopStatusToOrderStatus } from "../api/workshopOrderSync";
import WorkshopJobDetails from "../components/WorkshopJobDetails";
import type {
  WorkshopEmployee,
  WorkshopJob,
} from "../types/workshop.types";

const WorkshopJobDetailsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState<WorkshopJob | null>(null);
  const [employees, setEmployees] = useState<WorkshopEmployee[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJob = useCallback(async () => {
    if (!jobId) return;

    setLoading(true);

    try {
      const [jobData, employeeData] = await Promise.all([
        getWorkshopJobById(jobId),
        getWorkshopEmployees(),
      ]);

      if (!jobData) {
        navigate("/workshop", { replace: true });
        return;
      }

      setJob(jobData);
      setEmployees(employeeData);
    } finally {
      setLoading(false);
    }
  }, [jobId, navigate]);

  useEffect(() => {
    void loadJob();
  }, [loadJob]);

  const handleSave = async (
    stage: WorkshopJob["currentStage"],
    status: WorkshopJob["status"],
    employeeId: string,
    note: string,
  ) => {
    if (!job) return;

    const stageChanged = stage !== job.currentStage;
    const statusChanged = status !== job.status;
    const employeeChanged =
      employeeId !== (job.assignedTo?.id ?? "");
    const hasNote = note.trim().length > 0;

    /*
     * If the stage changes, update it first.
     * updateWorkshopStage() also moves the job into
     * in_progress.
     */
    if (stageChanged) {
      await updateWorkshopStage(job.id, stage);
    }

    if (statusChanged) {
      await updateWorkshopJobStatus(job.id, status);
    }

    if (employeeChanged) {
      await updateWorkshopAssignment(
        job.id,
        employeeId || undefined,
      );
    }

    if (hasNote) {
      await addWorkshopNote(job.id, note.trim());
    }

    /*
     * Reload the complete job after all changes.
     * This keeps the UI in sync with the mock API state.
     */
    const refreshedJob = await getWorkshopJobById(job.id);

    if (!refreshedJob) return;

    setJob(refreshedJob);

    /*
     * Workshop is responsible for production.
     * The resulting workshop status determines
     * the order status.
     */
    const orderStatus = workshopStatusToOrderStatus(
      refreshedJob.status,
    );

    await updateOrderStatus(
      refreshedJob.orderId,
      orderStatus,
    );
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
    <div className="flex h-[calc(100vh-4rem)] min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <WorkshopJobDetails
            job={job}
            employees={employees}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkshopJobDetailsPage;