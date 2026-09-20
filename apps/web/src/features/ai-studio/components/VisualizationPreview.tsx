import {
  Download,
  Heart,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import type {
  VisualizationResult,
} from "../types/ai-studio.types";

type Props = {
  result: VisualizationResult;
  onSave: () => void;
  onRestart: () => void;
};

const VisualizationPreview = ({
  result,
  onSave,
  onRestart,
}: Props) => {
  const [productScale, setProductScale] = useState(42);

  const handleDownload = () => {
    const link = document.createElement("a");

    link.href = result.roomImageUrl;
    link.download = "tfundi-room-visualization.jpg";
    link.click();
  };

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col">
      <div className="mb-5 flex shrink-0 items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-[var(--color-primary)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-primary)]">
              AI Visualization
            </span>
          </div>

          <h2 className="text-2xl font-bold">
            Your {result.productName}
          </h2>

          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Preview how the selected product fits into your
            space.
          </p>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium"
        >
          <RotateCcw size={16} />
          Start over
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black/5">
        <div className="relative h-full min-h-[400px] overflow-hidden">
          <img
            src={result.roomImageUrl}
            alt="Room visualization"
            className="absolute inset-0 h-full w-full object-contain"
          />

          {result.productImageUrl && (
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{
                width: `${productScale}%`,
              }}
            >
              <img
                src={result.productImageUrl}
                alt={result.productName}
                className="w-full object-contain drop-shadow-2xl"
              />
            </div>
          )}

          <div className="absolute bottom-4 left-4 rounded-xl border border-white/20 bg-black/60 p-3 text-white backdrop-blur">
            <div className="mb-2 flex items-center justify-between gap-5">
              <span className="text-xs font-medium">
                Product scale
              </span>

              <span className="text-xs opacity-70">
                {productScale}%
              </span>
            </div>

            <input
              type="range"
              min="20"
              max="70"
              value={productScale}
              onChange={(event) =>
                setProductScale(Number(event.target.value))
              }
              className="w-40"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            {result.productName}
          </p>

          <p className="text-xs text-[var(--color-muted-foreground)]">
            Product from your catalogue
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium"
          >
            <Download size={16} />
            Save image
          </button>

          <button
            type="button"
            onClick={onSave}
            className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium"
          >
            <Heart size={16} />
            Save design
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white"
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