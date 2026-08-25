import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import {
  Rotate3D,
  RotateCcw,
} from "lucide-react";

type Product360ViewerProps = {
  images: string[];
  productName: string;
};

const Product360Viewer = ({
  images,
  productName,
}: Product360ViewerProps) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const frameRef = useRef(0);

  const dragStartX = useRef(0);
  const lastX = useRef(0);

  const accumulatedDistance = useRef(0);
  const velocity = useRef(0);

  const animationFrame = useRef<number | null>(null);

  const frameCount = images.length;

  /**
   * Keep frame indexes circular.
   *
   * 0 → 1 → 2 → ... → last → 0
   */
  const normalizeFrame = (frame: number) => {
    if (frameCount === 0) {
      return 0;
    }

    return (
      ((frame % frameCount) + frameCount) %
      frameCount
    );
  };

  /**
   * Update the visible frame.
   */
  const updateFrame = (frame: number) => {
    const normalized = normalizeFrame(frame);

    frameRef.current = normalized;
    setCurrentFrame(normalized);
  };

  /**
   * Stop momentum animation.
   */
  const stopMomentum = () => {
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  };

  /**
   * Smooth momentum after releasing the mouse/finger.
   */
  const startMomentum = () => {
    stopMomentum();

    const animate = () => {
      velocity.current *= 0.94;

      if (Math.abs(velocity.current) < 0.015) {
        velocity.current = 0;
        animationFrame.current = null;
        return;
      }

      /**
       * Fractional frame movement gives the
       * rotation a much smoother feel.
       */
      const nextFrame =
        frameRef.current + velocity.current;

      updateFrame(Math.round(nextFrame));

      animationFrame.current =
        requestAnimationFrame(animate);
    };

    animationFrame.current =
      requestAnimationFrame(animate);
  };

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (frameCount < 2) {
      return;
    }

    stopMomentum();

    setIsDragging(true);

    dragStartX.current = event.clientX;
    lastX.current = event.clientX;

    accumulatedDistance.current = 0;
    velocity.current = 0;

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
  };

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (!isDragging || frameCount < 2) {
      return;
    }

    const movement =
      event.clientX - lastX.current;

    lastX.current = event.clientX;

    /**
     * Lower = more sensitive.
     *
     * 18px gives a much smoother turn than
     * jumping every 35px.
     */
    const pixelsPerFrame = 18;

    accumulatedDistance.current += movement;

    const frameMovement =
      accumulatedDistance.current /
      pixelsPerFrame;

    /**
     * Only apply whole frames visually,
     * but preserve the fractional remainder.
     */
    if (Math.abs(frameMovement) >= 1) {
      const frames =
        Math.trunc(frameMovement);

      accumulatedDistance.current -=
        frames * pixelsPerFrame;

      /**
       * Dragging right rotates the furniture
       * naturally in the opposite direction.
       */
      updateFrame(
        frameRef.current - frames,
      );
    }

    /**
     * Store movement velocity for momentum.
     */
    velocity.current =
      -(movement / pixelsPerFrame) * 0.55;
  };

  const handlePointerUp = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    } catch {
      // Pointer capture may already be released.
    }

    startMomentum();
  };

  const resetView = () => {
    stopMomentum();

    velocity.current = 0;
    accumulatedDistance.current = 0;

    updateFrame(0);
  };

  /**
   * Preload all images.
   *
   * This is extremely important for smooth
   * 360° interaction.
   */
  useEffect(() => {
    const preloadedImages: HTMLImageElement[] =
      [];

    images.forEach((image) => {
      const img = new Image();

      img.src = image;

      preloadedImages.push(img);
    });

    return () => {
      stopMomentum();
    };
  }, [images]);

  if (!images.length) {
    return null;
  }

  if (images.length === 1) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-black/[0.04]">
        <img
          src={images[0]}
          alt={productName}
          className="aspect-[4/3] w-full object-cover"
        />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-gray-500 shadow-sm backdrop-blur">
          More views needed for 360° view
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-black/[0.04] via-white to-black/[0.08] ${
          isDragging
            ? "cursor-grabbing"
            : "cursor-grab"
        }`}
        style={{
          touchAction: "pan-y",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* 360 badge */}
        <div className="absolute left-5 top-5 z-10">
          <div className="flex items-center gap-2 rounded-full border border-black/5 bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-600 shadow-sm backdrop-blur">
            <Rotate3D size={15} />
            360° View
          </div>
        </div>

        {/* Reset */}
        <button
          type="button"
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
            resetView();
          }}
          className="absolute right-5 top-5 z-10 flex items-center gap-2 rounded-full border border-black/5 bg-white/90 px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm backdrop-blur transition hover:bg-white"
        >
          <RotateCcw size={14} />
          Reset
        </button>

        {/* Product */}
        <img
          src={images[currentFrame]}
          alt={`${productName} 360° view`}
          draggable={false}
          className={`aspect-[4/3] w-full select-none object-contain ${
            isDragging
              ? ""
              : "transition-opacity duration-100"
          }`}
        />

        {/* Interaction hint */}
        <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-black/5 bg-white/90 px-4 py-2 text-xs text-gray-500 shadow-sm backdrop-blur">
          Drag to rotate
        </div>

        {/* Frame counter */}
        <div className="absolute bottom-5 right-5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
          {currentFrame + 1} / {frameCount}
        </div>
      </div>

      {/* Rotation progress */}
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-black/[0.06]">
        <div
          className="h-full rounded-full transition-[width] duration-100"
          style={{
            width: `${
              ((currentFrame + 1) /
                frameCount) *
              100
            }%`,
            backgroundColor:
              "var(--color-primary)",
          }}
        />
      </div>
    </div>
  );
};

export default Product360Viewer;