import {
  ArrowRight,
  Camera,
  Palette,
  Sparkles,
} from "lucide-react";

type Props = {
  onOpen: () => void;
};

const RoomVisualizerCard = ({ onOpen }: Props) => {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full w-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-lg"
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <Camera size={24} />
        </div>

        <ArrowRight
          size={20}
          className="text-[var(--color-muted-foreground)] transition-transform group-hover:translate-x-1"
        />
      </div>

      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-lg font-semibold">
          Room Visualizer
        </h2>

        <Sparkles
          size={16}
          className="text-[var(--color-primary)]"
        />
      </div>

      <p className="mb-6 flex-1 text-sm leading-6 text-[var(--color-muted-foreground)]">
        See how your products look in a real room. Upload a room,
        choose a catalogue product and customize it using available
        workspace options.
      </p>

      <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]">
        <Palette size={16} />
        Visualize a room
      </div>
    </button>
  );
};

export default RoomVisualizerCard;