import {
  Camera,
  ImagePlus,
  RotateCcw,
  Upload,
} from "lucide-react";
import { useRef } from "react";
import type { RoomImage } from "../types/ai-studio.types";

type Props = {
  roomImage?: RoomImage;
  onChange: (image: RoomImage) => void;
  onContinue: () => void;
};

const RoomUploadStage = ({
  roomImage,
  onChange,
  onContinue,
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const image: RoomImage = {
      id: `room-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    };

    onChange(image);
  };

  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col">
      <div className="mb-6 shrink-0">
        <div className="mb-2 flex items-center gap-2">
          <Camera
            size={18}
            className="text-[var(--color-primary)]"
          />

          <span className="text-sm font-medium text-[var(--color-primary)]">
            Step 1
          </span>
        </div>

        <h2 className="text-2xl font-bold">
          Upload your room
        </h2>

        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Upload a clear photo of the room where you want to
          visualize a product.
        </p>
      </div>

      <div className="min-h-0 flex-1">
        {roomImage ? (
          <div className="relative flex h-full min-h-[360px] items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black/5">
            <img
              src={roomImage.url}
              alt="Selected room"
              className="max-h-full max-w-full object-contain"
            />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl border border-white/20 bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur"
            >
              <RotateCcw size={16} />
              Change photo
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full min-h-[360px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/20 px-6 text-center transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <ImagePlus size={28} />
            </div>

            <h3 className="text-lg font-semibold">
              Upload a room photo
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--color-muted-foreground)]">
              Use a well-lit photo with enough space around the
              area where the furniture should appear.
            </p>

            <span className="mt-5 flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white">
              <Upload size={16} />
              Choose image
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <div className="mt-6 flex shrink-0 justify-end">
        <button
          type="button"
          disabled={!roomImage}
          onClick={onContinue}
          className="rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RoomUploadStage;