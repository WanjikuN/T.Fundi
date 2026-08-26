import {
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";

type ProductPhotoGalleryProps = {
  imageUrls: string[];
};

const ProductPhotoGallery = ({
  imageUrls,
}: ProductPhotoGalleryProps) => {
  const [selectedIndex, setSelectedIndex] =
    useState(0);

  if (!imageUrls.length) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-black/[0.025]">
        <div className="text-center">

          <ImageIcon
            size={28}
            className="mx-auto text-gray-300"
          />

          <p className="mt-2 text-xs text-gray-400">
            No product images
          </p>

        </div>
      </div>
    );
  }

  const safeIndex = Math.min(
    selectedIndex,
    imageUrls.length - 1,
  );

  const previous = () => {
    setSelectedIndex(
      (current) =>
        current === 0
          ? imageUrls.length - 1
          : current - 1,
    );
  };

  const next = () => {
    setSelectedIndex(
      (current) =>
        current ===
        imageUrls.length - 1
          ? 0
          : current + 1,
    );
  };

  return (
    <div>

      <div className="relative overflow-hidden rounded-2xl bg-black/[0.025]">

        <img
          src={
            imageUrls[safeIndex]
          }
          alt={`Product image ${
            safeIndex + 1
          }`}
          className="aspect-[4/3] w-full object-contain"
        />

        {imageUrls.length > 1 && (
          <>
            <button
              type="button"
              onClick={
                previous
              }
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm"
            >
              <ChevronLeft
                size={17}
              />
            </button>

            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm"
            >
              <ChevronRight
                size={17}
              />
            </button>
          </>
        )}

        <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white">
          {safeIndex + 1} /{" "}
          {imageUrls.length}
        </div>

      </div>

      {imageUrls.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">

          {imageUrls.map(
            (url, index) => (
              <button
                key={`${url}-${index}`}
                type="button"
                onClick={() =>
                  setSelectedIndex(
                    index,
                  )
                }
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                  index ===
                  safeIndex
                    ? "border-[var(--color-primary)]"
                    : "border-transparent"
                }`}
              >
                <img
                  src={url}
                  alt={`Thumbnail ${
                    index + 1
                  }`}
                  className="h-full w-full object-cover"
                />
              </button>
            ),
          )}

        </div>
      )}

    </div>
  );
};

export default ProductPhotoGallery;