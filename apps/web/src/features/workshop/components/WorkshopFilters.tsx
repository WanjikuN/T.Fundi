import { Search, X } from "lucide-react";
import type {
  WorkshopJobStatus,
  WorkshopPriority,
} from "../types/workshop.types";

type Props = {
  search: string;
  status: "all" | WorkshopJobStatus;
  priority: "all" | WorkshopPriority;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "all" | WorkshopJobStatus) => void;
  onPriorityChange: (value: "all" | WorkshopPriority) => void;
};

const WorkshopFilters = ({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: Props) => {
  const hasFilters =
    search.length > 0 ||
    status !== "all" ||
    priority !== "all";

  const clearFilters = () => {
    onSearchChange("");
    onStatusChange("all");
    onPriorityChange("all");
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="relative min-w-0 flex-1">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-primary)]"
        />

        <input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search jobs, orders or customers..."
          className="h-11 w-full rounded-xl border border-[var(--color-primary)] bg-[var(--color-background)] pl-10 pr-10 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
        />

        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] hover:text-foreground"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(
            event.target.value as "all" | WorkshopJobStatus,
          )
        }
        className="h-11 rounded-xl border border-[var(--color-primary)] bg-[var(--color-background)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
      >
        <option value="all">All statuses</option>
        <option value="not_started">Not started</option>
        <option value="in_progress">In progress</option>
        <option value="on_hold">On hold</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <select
        value={priority}
        onChange={(event) =>
          onPriorityChange(
            event.target.value as
              | "all"
              | WorkshopPriority,
          )
        }
        className="h-11 rounded-xl border border-[var(--color-primary)] bg-[var(--color-background)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
      >
        <option value="all">All priorities</option>
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="h-11 rounded-xl px-3 text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-foreground"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default WorkshopFilters;