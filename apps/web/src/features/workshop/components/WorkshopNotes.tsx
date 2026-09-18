import { MessageSquare } from "lucide-react";
import type { WorkshopNote } from "../types/workshop.types";

type Props = {
  notes: WorkshopNote[];
};

const WorkshopNotes = ({ notes }: Props) => {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] p-5">
      <div className="flex items-center gap-2">
        <MessageSquare size={17} />

        <h2 className="font-semibold">
          Production notes
        </h2>
      </div>

      {notes.length === 0 ? (
        <p className="mt-5 text-sm text-[var(--color-muted-foreground)]">
          No production notes yet.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-xl bg-[var(--color-muted)] p-3"
            >
              <p className="text-sm">
                {note.content}
              </p>

              <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">
                {note.createdBy} · {note.createdAt}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkshopNotes;