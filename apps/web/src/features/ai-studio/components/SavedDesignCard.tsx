import {
  Eye,
  Trash2,
} from "lucide-react";
import type { SavedDesign } from "../types/ai-studio.types";

type Props = {
  design: SavedDesign;
  onView: () => void;
  onDelete: () => void;
};

const SavedDesignCard = ({
  design,
  onView,
  onDelete,
}: Props) => {
  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <div className="aspect-[4/3] overflow-hidden bg-[var(--color-muted)]/30">
        <img
          src={design.roomImageUrl}
          alt={design.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="truncate font-semibold">
          {design.name}
        </h3>

        <p className="mt-1 truncate text-sm text-[var(--color-muted-foreground)]">
          {design.productName}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onView}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm font-medium"
          >
            <Eye size={15} />
            View
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] text-red-500"
            aria-label="Delete design"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default SavedDesignCard;