import { UserRound } from "lucide-react";
import type { WorkshopEmployee } from "../types/workshop.types";

type Props = {
  employee?: WorkshopEmployee;
};

const WorkshopAssignment = ({ employee }: Props) => {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
        Assigned to
      </p>

      {employee ? (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-muted)]">
            <UserRound size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold">
              {employee.name}
            </p>

            <p className="text-xs text-[var(--color-muted-foreground)]">
              {employee.role}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--color-muted-foreground)]">
          No employee assigned.
        </p>
      )}
    </div>
  );
};

export default WorkshopAssignment;