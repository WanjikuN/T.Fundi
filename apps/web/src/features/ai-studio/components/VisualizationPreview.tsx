import {
  Download,
  Eraser,
  Heart,
  Loader2,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  RotateCw,
  ShoppingBag,
} from "lucide-react";
import { removeProductBackground } from "../api/backgroundRemoval.api";
import { useEffect, useRef, useState } from "react";
import type { VisualizationResult } from "../types/ai-studio.types";

type Props = {
  result: VisualizationResult;
  onSave: () => void;
  onRestart: () => void;
};

type Point = {
  x: number;
  y: number;
};

type DragTarget = "room" | "product" | null;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const VisualizationPreview = ({ result, onSave, onRestart }: Props) => {
  /*
   * =========================================================
   * ROOM STATE
   * =========================================================
   */

  const [roomZoom, setRoomZoom] = useState(100);

  const [roomPosition, setRoomPosition] = useState<Point>({
    x: 0,
    y: 0,
  });

  /*
   * =========================================================
   * PRODUCT STATE
   * =========================================================
   */

  const [productScale, setProductScale] = useState(42);

  const [productPosition, setProductPosition] = useState<Point>({
    x: 0,
    y: 0,
  });

  const [productRotation, setProductRotation] = useState(0);
  const [isProductBackgroundRemoved, setIsProductBackgroundRemoved] =
    useState(false);

  const [processedProductImage, setProcessedProductImage] = useState<
    string | null
  >(null);

  const [removingBackground, setRemovingBackground] = useState(false);

  const [backgroundRemovalError, setBackgroundRemovalError] = useState<
    string | null
  >(null);
  const handleBackgroundRemoval = async () => {
    if (!result.productImageUrl) {
      return;
    }

    /*
     * If we've already processed this image,
     * simply toggle between original and
     * transparent versions.
     */
    if (processedProductImage) {
      setIsProductBackgroundRemoved((current) => !current);

      return;
    }

    try {
      setRemovingBackground(true);
      setBackgroundRemovalError(null);

      const response = await removeProductBackground(result.productImageUrl);

      setProcessedProductImage(response.imageUrl);

      setIsProductBackgroundRemoved(true);
    } catch (error) {
      console.error("Background removal failed:", error);

      setBackgroundRemovalError(
        "We couldn't remove the background. Please try again.",
      );

      setIsProductBackgroundRemoved(false);
    } finally {
      setRemovingBackground(false);
    }
  };
  /*
   * =========================================================
   * DRAG STATE
   * =========================================================
   */

  const [dragging, setDragging] = useState<DragTarget>(null);

  const dragStart = useRef<Point>({
    x: 0,
    y: 0,
  });

  const initialPosition = useRef<Point>({
    x: 0,
    y: 0,
  });

  /*
   * =========================================================
   * GLOBAL DRAG HANDLERS
   *
   * Important:
   * These are browser events, NOT React events.
   * =========================================================
   */

  useEffect(() => {
    if (!dragging) {
      return;
    }

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      const deltaX = event.clientX - dragStart.current.x;

      const deltaY = event.clientY - dragStart.current.y;

      if (dragging === "room") {
        setRoomPosition({
          x: initialPosition.current.x + deltaX,
          y: initialPosition.current.y + deltaY,
        });
      }

      if (dragging === "product") {
        setProductPosition({
          x: initialPosition.current.x + deltaX,
          y: initialPosition.current.y + deltaY,
        });
      }
    };

    const handlePointerUp = () => {
      setDragging(null);
    };

    window.addEventListener("pointermove", handlePointerMove);

    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging]);

  /*
   * =========================================================
   * ROOM DRAG
   * =========================================================
   */

  const handleRoomPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    /*
     * Don't start dragging the room if the
     * product was clicked.
     */
    if ((event.target as HTMLElement).closest("[data-product-layer]")) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);

    setDragging("room");

    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
    };

    initialPosition.current = {
      ...roomPosition,
    };
  };

  /*
   * =========================================================
   * PRODUCT DRAG
   * =========================================================
   */

  const handleProductPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    event.stopPropagation();

    event.currentTarget.setPointerCapture(event.pointerId);

    setDragging("product");

    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
    };

    initialPosition.current = {
      ...productPosition,
    };
  };

  /*
   * =========================================================
   * ROOM ZOOM
   * =========================================================
   */

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();

    const zoomDelta = event.deltaY > 0 ? -5 : 5;

    setRoomZoom((current) => clamp(current + zoomDelta, 50, 200));
  };

  /*
   * =========================================================
   * PRODUCT ROTATION
   * =========================================================
   */

  const rotateProduct = (amount: number) => {
    setProductRotation((current) => {
      const next = current + amount;

      if (next > 180) {
        return -180;
      }

      if (next < -180) {
        return 180;
      }

      return next;
    });
  };

  /*
   * =========================================================
   * RESET VIEW
   * =========================================================
   */

  const resetView = () => {
    setRoomZoom(100);

    setRoomPosition({
      x: 0,
      y: 0,
    });

    setProductScale(42);

    setProductPosition({
      x: 0,
      y: 0,
    });

    setProductRotation(0);

    setIsProductBackgroundRemoved(false);
    setProcessedProductImage(null);
    setRemovingBackground(false);
    setBackgroundRemovalError(null);

    setDragging(null);
  };

  /*
   * =========================================================
   * DOWNLOAD
   * =========================================================
   */

  const handleDownload = () => {
    const link =
      document.createElement("a");

    link.href = result.roomImageUrl;

    link.download = "tfundi-room-visualization.jpg";

    link.click();
  };

  /*
   * =========================================================
   * PRODUCT IMAGE
   * =========================================================
   */

  const productImage =
    isProductBackgroundRemoved && processedProductImage
      ? processedProductImage
      : result.productImageUrl;

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-5 flex shrink-0 items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-[var(--color-primary)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-primary)]">
              AI Visualization
            </span>
          </div>

          <h2 className="text-2xl font-bold">Your {result.productName}</h2>

          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Move the room and furniture to create your preferred layout.
          </p>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition hover:bg-black/5"
        >
          <RotateCcw size={16} />
          Start over
        </button>
      </div>

      {/* =====================================================
          INTERACTIVE CANVAS
      ====================================================== */}

      <div
        onPointerDown={handleRoomPointerDown}
        onWheel={handleWheel}
        className={`relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black/5 ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          touchAction: "none",
        }}
      >
        {/* =================================================
            ROOM IMAGE
        ================================================== */}

        <div
          className="absolute inset-0 transition-transform duration-100 ease-out"
          style={{
            transform: `
              translate(
                ${roomPosition.x}px,
                ${roomPosition.y}px
              )
              scale(${roomZoom / 100})
            `,
          }}
        >
          <img
            src={result.roomImageUrl}
            alt="Room visualization"
            draggable={false}
            className="h-full w-full select-none object-contain"
          />
        </div>

        {/* =================================================
            PRODUCT
        ================================================== */}

        {productImage && (
          <div
            data-product-layer
            onPointerDown={handleProductPointerDown}
            className={`absolute left-1/2 top-1/2 z-20 select-none ${
              dragging === "product" ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              width: `${productScale}%`,

              transform: `
                translate(
                  calc(-50% + ${productPosition.x}px),
                  calc(-50% + ${productPosition.y}px)
                )
                rotateY(${productRotation}deg)
              `,

              transformStyle: "preserve-3d",

              transition:
                dragging === "product" ? "none" : "transform 150ms ease",
            }}
          >
            <img
              src={productImage}
              alt={result.productName}
              draggable={false}
              className="pointer-events-none w-full object-contain drop-shadow-2xl"
            />
          </div>
        )}

        {/* =================================================
            INSTRUCTIONS
        ================================================== */}

        <div className="absolute left-4 top-4 z-30 rounded-xl border border-white/20 bg-black/60 px-3 py-2 text-white backdrop-blur">
          <div className="text-xs font-medium">Interactive preview</div>

          <div className="mt-1 text-[11px] opacity-70">
            Drag room • Drag furniture • Scroll to zoom
          </div>
        </div>

        {/* =================================================
            ROOM ZOOM CONTROLS
        ================================================== */}

        <div className="absolute right-4 top-4 z-30 flex items-center gap-1 rounded-xl border border-white/20 bg-black/60 p-1.5 text-white backdrop-blur">
          <button
            type="button"
            onClick={() =>
              setRoomZoom((current) => clamp(current - 10, 50, 200))
            }
            className="rounded-lg p-2 transition hover:bg-white/10"
            aria-label="Zoom out"
          >
            <Minus size={16} />
          </button>

          <span className="min-w-[52px] text-center text-xs font-medium">
            {roomZoom}%
          </span>

          <button
            type="button"
            onClick={() =>
              setRoomZoom((current) => clamp(current + 10, 50, 200))
            }
            className="rounded-lg p-2 transition hover:bg-white/10"
            aria-label="Zoom in"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* =================================================
            PRODUCT CONTROLS
        ================================================== */}

        <div className="absolute bottom-4 left-4 z-30 w-[270px] rounded-2xl border border-white/20 bg-black/65 p-4 text-white shadow-xl backdrop-blur">
          {/* Product size */}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium">Product size</span>

              <span className="text-xs opacity-70">{productScale}%</span>
            </div>

            <input
              type="range"
              min="20"
              max="70"
              value={productScale}
              onChange={(event) => setProductScale(Number(event.target.value))}
              className="w-full"
            />
          </div>

          {/* Product rotation */}

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium">Product rotation</span>

              <span className="text-xs opacity-70">{productRotation}°</span>
            </div>

            <input
              type="range"
              min="-180"
              max="180"
              value={productRotation}
              onChange={(event) =>
                setProductRotation(Number(event.target.value))
              }
              className="w-full"
            />

            <div className="mt-2 flex justify-between">
              <button
                type="button"
                onClick={() => rotateProduct(-15)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition hover:bg-white/10"
              >
                <RotateCcw size={13} />
                Left
              </button>

              <button
                type="button"
                onClick={() => rotateProduct(15)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition hover:bg-white/10"
              >
                Right
                <RotateCw size={13} />
              </button>
            </div>
          </div>

          {/* Remove background */}

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium">Product background</p>

                <p className="mt-0.5 text-[10px] opacity-60">
                  {processedProductImage
                    ? "Furniture isolation is ready"
                    : "Isolate the furniture from its image"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleBackgroundRemoval}
                disabled={!result.productImageUrl || removingBackground}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  processedProductImage && isProductBackgroundRemoved
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white/10 text-white hover:bg-white/15"
                } ${removingBackground ? "cursor-wait opacity-70" : ""} ${
                  !result.productImageUrl ? "cursor-not-allowed opacity-40" : ""
                }`}
              >
                {removingBackground ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Removing...
                  </>
                ) : processedProductImage ? (
                  <>
                    <Eraser size={14} />

                    {isProductBackgroundRemoved
                      ? "Background removed"
                      : "Use isolated image"}
                  </>
                ) : (
                  <>
                    <Eraser size={14} />
                    Remove background
                  </>
                )}
              </button>
            </div>

            {backgroundRemovalError && (
              <p className="mt-2 text-[10px] text-red-300">
                {backgroundRemovalError}
              </p>
            )}

            {processedProductImage && (
              <button
                type="button"
                onClick={() =>
                  setIsProductBackgroundRemoved((current) => !current)
                }
                className="mt-2 text-[10px] underline opacity-60 transition hover:opacity-100"
              >
                {isProductBackgroundRemoved
                  ? "Use original image"
                  : "Use isolated image"}
              </button>
            )}
          </div>

          {/* Product rotation */}

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium">
                Product rotation
              </span>

              <span className="text-xs opacity-70">
                {productRotation}°
              </span>
            </div>

            <input
              type="range"
              min="-180"
              max="180"
              value={productRotation}
              onChange={(event) =>
                setProductRotation(
                  Number(event.target.value),
                )
              }
              className="w-full"
            />

            <div className="mt-2 flex justify-between">
              <button
                type="button"
                onClick={() =>
                  rotateProduct(-15)
                }
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition hover:bg-white/10"
              >
                <RotateCcw size={13} />
                Left
              </button>

              <button
                type="button"
                onClick={() =>
                  rotateProduct(15)
                }
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition hover:bg-white/10"
              >
                Right
                <RotateCw size={13} />
              </button>
            </div>
          </div>

          {/* Remove background */}

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium">
                  Remove background
                </p>

                <p className="mt-0.5 text-[10px] opacity-60">
                  Isolate the furniture
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={
                  removeProductBackground
                }
                onClick={() =>
                  setRemoveProductBackground(
                    (current) => !current,
                  )
                }
                disabled={
                  !result.productImageWithoutBackgroundUrl
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  removeProductBackground
                    ? "bg-[var(--color-primary)]"
                    : "bg-white/20"
                } ${
                  !result.productImageWithoutBackgroundUrl
                    ? "cursor-not-allowed opacity-40"
                    : ""
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    removeProductBackground
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {!result.productImageWithoutBackgroundUrl && (
              <p className="mt-2 text-[10px] opacity-50">
                Background removal is not available
                for this product yet.
              </p>
            )}
          </div>
        </div>

        {/* =================================================
            RESET
        ================================================== */}

        <button
          type="button"
          onClick={resetView}
          className="absolute bottom-4 right-4 z-30 flex items-center gap-2 rounded-xl border border-white/20 bg-black/60 px-3 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-black/75"
        >
          <Maximize2 size={14} />
          Reset view
        </button>
      </div>

      {/* =====================================================
          BOTTOM ACTIONS
      ====================================================== */}

      <div className="mt-5 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{result.productName}</p>

          <p className="text-xs text-[var(--color-muted-foreground)]">
            Product from your catalogue
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium transition hover:bg-black/5"
          >
            <Download size={16} />
            Save image
          </button>

          <button
            type="button"
            onClick={onSave}
            className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium transition hover:bg-black/5"
          >
            <Heart size={16} />
            Save design
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <ShoppingBag size={16} />
            Continue to order
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualizationPreview;
