import { Plus, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getWorkshopJobs } from "../api/workshop.api";
import WorkshopBoard from "../components/WorkshopBoard";
import WorkshopFilters from "../components/WorkshopFilters";
import WorkshopSummaryCards from "../components/WorkshopSummaryCards";
import type {
  WorkshopJob,
  WorkshopJobStatus,
  WorkshopPriority,
} from "../types/workshop.types";

const WorkshopPage = () => {
  const [jobs, setJobs] = useState<WorkshopJob[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "all" | WorkshopJobStatus
  >("all");

  const [priority, setPriority] = useState<
    "all" | WorkshopPriority
  >("all");

  const loadJobs = async () => {
    setLoading(true);

    try {
      const data = await getWorkshopJobs();
      setJobs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.jobNumber.toLowerCase().includes(query) ||
        job.orderNumber.toLowerCase().includes(query) ||
        job.productName.toLowerCase().includes(query) ||
        job.customerName.toLowerCase().includes(query);

      const matchesStatus =
        status === "all" || job.status === status;

      const matchesPriority =
        priority === "all" || job.priority === priority;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [jobs, search, status, priority]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-primary)]">
            Production
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Workshop
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-[var(--color-muted-foreground)]">
            Track production jobs from materials through delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void loadJobs()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--color-primary)] px-3 text-sm font-medium transition hover:bg-[var(--color-muted)]"
          >
            <RefreshCw size={15} className="text-[var(--color-primary)]"/>
            Refresh
          </button>

          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-sm font-medium text-[var(--color-primary-foreground)] transition hover:opacity-90"
          >
            <Plus size={16} />
            New job
          </button>
        </div>
      </header>

      <WorkshopSummaryCards jobs={jobs} />

      <WorkshopFilters
        search={search}
        status={status}
        priority={priority}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
      />

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center text-sm text-[var(--color-muted-foreground)]">
          Loading workshop...
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] py-16 text-center">
          <p className="font-medium">
            No workshop jobs found
          </p>

          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Try changing your filters or search.
          </p>
        </div>
      ) : (
        <WorkshopBoard
          jobs={filteredJobs}
          employees={[]}
          onSave={async () => {}}
        />
      )}
    </div>
  );
};

export default WorkshopPage;