import { Search, SlidersHorizontal, X } from "lucide-react";
import type { OrderStatus } from "../types/orders.types";

type Props = {
  search: string;
  status: "all" | OrderStatus;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "all" | OrderStatus) => void;
};

const OrderFilters = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: Props) => {
  const hasFilters = search.length > 0 || status !== "all";

  const clearFilters = () => {
    onSearchChange("");
    onStatusChange("all");
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1 sm:max-w-md">
        <Search
          size={17}
          className="text-[var(--color-primary)] absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]"
        />

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by order or customer..."
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

      <div className="flex items-center gap-2">
        <div className="relative">
          <SlidersHorizontal
            size={15}
            className="text-[var(--color-primary)] pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]"
          />

          <select
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as "all" | OrderStatus)
            }
            className=" h-11 appearance-none rounded-xl border border-[var(--color-primary)] bg-[var(--color-background)] pl-9 pr-9 text-sm outline-none transition focus:border-[var(--color-primary)]"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_production">In production</option>
            <option value="ready">Ready</option>
            <option value="out_for_delivery">Out for delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="h-11 rounded-xl px-3 text-sm text-[var(--color-muted-foreground)] transition hover:bg-[var(--color-muted)] hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderFilters;
