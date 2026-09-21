import {
  Camera,
  ImagePlus,
  Maximize2,
  RotateCcw,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useRef, useState } from "react";
import type { PointerEvent, WheelEvent } from "react";
import type { RoomImage } from "../types/ai-studio.types";

type Props = {
  roomImage?: RoomImage;
  onChange: (image: RoomImage) => void;
  onContinue: () => void;
};

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

const RoomUploadStage = ({
  roomImage,
  onChange,
  onContinue,
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef({
    x: 0,
    y: 0,
  });

  const positionStart = useRef({
    x: 0,
    y: 0,
  });

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

    setZoom(1);
    setPosition({
      x: 0,
      y: 0,
    });
  };

  const handleZoom = (direction: "in" | "out") => {
    setZoom((current) => {
      const next =
        direction === "in"
          ? current + ZOOM_STEP
          : current - ZOOM_STEP;

      return Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, Number(next.toFixed(2))),
      );
    });
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({
      x: 0,
      y: 0,
    });
  };

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (zoom <= 1) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    setIsDragging(true);

    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
    };

    positionStart.current = {
      x: position.x,
      y: position.y,
    };
  };

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (!isDragging) return;

    const deltaX = event.clientX - dragStart.current.x;
    const deltaY = event.clientY - dragStart.current.y;

    setPosition({
      x: positionStart.current.x + deltaX,
      y: positionStart.current.y + deltaY,
    });
  };

  const handlePointerUp = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleWheel = (
    event: WheelEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    setZoom((current) => {
      const direction = event.deltaY < 0 ? 1 : -1;
      const next = current + direction * ZOOM_STEP;

      return Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, Number(next.toFixed(2))),
      );
    });
  };

  return (
    <div className="mx-auto flex h-full min-h-0 max-w-5xl flex-col">
      {/* Header */}
      <div className="mb-5 shrink-0">
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

      {/* Main workspace */}
      <div className="min-h-0 flex-1">
        {roomImage ? (
          <div className="flex h-full max-h-[450px] flex-col overflow-hidden rounded-2xl border border-[var(--color-primary)] bg-black/5">
            {/* Image canvas */}
            <div
              className={`relative min-h-0 flex-1 overflow-hidden ${
                isDragging
                  ? "cursor-grabbing"
                  : zoom > 1
                    ? "cursor-grab"
                    : "cursor-default"
              }`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onWheel={handleWheel}
              style={{
                touchAction: "none",
              }}
            >
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src={roomImage.url}
                  alt="Selected room"
                  draggable={false}
                  className="max-h-full max-w-full select-none object-contain"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    transformOrigin: "center center",
                    transition: isDragging
                      ? "none"
                      : "transform 150ms ease-out",
                  }}
                />
              </div>

              {/* Top controls */}
              <div className="absolute right-4 top-4 flex items-center gap-1 rounded-xl border border-white/10 bg-black/60 p-1 shadow-lg backdrop-blur">
                <button
                  type="button"
                  onClick={() => handleZoom("out")}
                  disabled={zoom <= MIN_ZOOM}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Zoom out"
                  title="Zoom out"
                >
                  <ZoomOut size={17} />
                </button>

                <span className="min-w-12 text-center text-xs font-medium text-white">
                  {Math.round(zoom * 100)}%
                </span>

                <button
                  type="button"
                  onClick={() => handleZoom("in")}
                  disabled={zoom >= MAX_ZOOM}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Zoom in"
                  title="Zoom in"
                >
                  <ZoomIn size={17} />
                </button>

                <div className="mx-1 h-5 w-px bg-white/20" />

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
                  aria-label="Reset view"
                  title="Reset view"
                >
                  <Maximize2 size={16} />
                </button>
              </div>

              {/* Change photo */}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl border border-white/20 bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-black/75"
              >
                <RotateCcw size={16} />
                Change photo
              </button>

              {/* Drag hint */}
              {zoom > 1 && (
                <div className="absolute bottom-4 right-4 rounded-lg bg-black/60 px-3 py-2 text-[11px] text-white backdrop-blur">
                  Drag to reposition
                </div>
              )}
            </div>

            {/* Canvas footer */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-black/10 bg-white px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-gray-900">
                  {roomImage.name}
                </p>

                <p className="mt-0.5 text-[11px] text-gray-500">
                  {zoom > 1
                    ? "Drag the image to position it."
                    : "Use the controls or scroll to zoom."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="shrink-0 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-black/[0.03]"
              >
                Reset view
              </button>
            </div>
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

            <span className="mt-3 text-xs text-[var(--color-muted-foreground)]">
              JPG, PNG or WEBP
            </span>
          </button>
        )}
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      {/* Footer */}
      <div className="mt-5 flex shrink-0 justify-end pt-4">
        <button
          type="button"
          disabled={!roomImage}
          onClick={onContinue}
          className="rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RoomUploadStage;
