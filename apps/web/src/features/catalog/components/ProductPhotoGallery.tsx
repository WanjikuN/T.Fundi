import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  X,
} from "lucide-react";

type ProductPhotoGalleryProps = {
  images: string[];
  productName: string;
};

const ProductPhotoGallery = ({
  images,
  productName,
}: ProductPhotoGalleryProps) => {
  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [isLightboxOpen, setIsLightboxOpen] =
    useState(false);

  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === images.length - 1
            ? 0
            : current + 1,
        );
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === 0
            ? images.length - 1
            : current - 1,
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
  }, [isLightboxOpen, images.length]);

  if (!images.length) {
    return (
      <div className="flex h-full min-h-[420px] items-center justify-center rounded-3xl bg-black/[0.03] text-sm text-gray-400">
        No product photos
      </div>
    );
  }

  const currentImage =
    images[selectedIndex];

  const previous = () => {
    setSelectedIndex((current) =>
      current === 0
        ? images.length - 1
        : current - 1,
    );
  };

  const next = () => {
    setSelectedIndex((current) =>
      current === images.length - 1
        ? 0
        : current + 1,
    );
  };

  return (
    <>
      <div className="h-full">
        {/* Main image */}

        <div className="group relative aspect-[4/3] overflow-hidden bg-black/[0.03]">
          <button
            type="button"
            onClick={() =>
              setIsLightboxOpen(true)
            }
            className="absolute inset-0 z-10 cursor-zoom-in"
            aria-label="Open product photo"
          />

          <img
            src={currentImage}
            alt={`${productName} view ${
              selectedIndex + 1
            }`}
            className="h-full w-full object-contain transition duration-300"
          />

          <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-gray-700 shadow-sm backdrop-blur">
            <Maximize2 size={14} />
            View larger
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={previous}
                className="absolute left-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md backdrop-blur transition hover:bg-white"
                aria-label="Previous photo"
              >
                <ArrowLeft size={18} />
              </button>

              <button
                type="button"
                onClick={next}
                className="absolute right-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md backdrop-blur transition hover:bg-white"
                aria-label="Next photo"
              >
                <ArrowRight size={18} />
              </button>
            </>
          )}

          <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
            {selectedIndex + 1} /{" "}
            {images.length}
          </div>
        </div>

        {/* Thumbnails */}

        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() =>
                  setSelectedIndex(index)
                }
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                  selectedIndex === index
                    ? "border-[var(--color-primary)]"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} thumbnail ${
                    index + 1
                  }`}
                  className="h-full w-full object-cover"
                />

                {selectedIndex === index && (
                  <span
                    className="absolute inset-0"
                    style={{
                      boxShadow:
                        "inset 0 0 0 2px var(--color-primary)",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* LIGHTBOX */}
      {/* ================================================= */}

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() =>
            setIsLightboxOpen(false)
          }
        >
          <button
            type="button"
            onClick={() =>
              setIsLightboxOpen(false)
            }
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close photo"
          >
            <X size={22} />
          </button>

          <img
            src={currentImage}
            alt={`${productName} enlarged view ${
              selectedIndex + 1
            }`}
            className="max-h-[90vh] max-w-[92vw] object-contain"
            onClick={(event) =>
              event.stopPropagation()
            }
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  previous();
                }}
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-8"
                aria-label="Previous photo"
              >
                <ArrowLeft size={22} />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  next();
                }}
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-8"
                aria-label="Next photo"
              >
                <ArrowRight size={22} />
              </button>
            </>
          )}

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur">
            {productName} ·{" "}
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPhotoGallery;