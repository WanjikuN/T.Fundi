import { useState } from "react";
import {
  Box,
  Images,
  Rotate3D,
} from "lucide-react";

import Product3DErrorBoundary from "./Product3DErrorBoundary";
import Product3DViewer from "./Product3DViewer";
import Product360Viewer from "./Product360Viewer";

type ProductViewerProps = {
  images: string[];
  productName: string;
  modelUrl?: string;
  materialColor?: string;
};

type ViewerMode =
  | "photos"
  | "360"
  | "3d";

const ProductViewer = ({
  images,
  productName,
  modelUrl,
  materialColor,
}: ProductViewerProps) => {
  const has360 = images.length >= 3;

  const initialMode: ViewerMode = modelUrl
    ? "3d"
    : has360
      ? "360"
      : "photos";

  const [mode, setMode] =
    useState<ViewerMode>(initialMode);

  const [selectedImage, setSelectedImage] =
    useState(0);

  return (
    <div>
      {/* Viewer modes */}
      <div className="mb-4 flex w-fit flex-wrap rounded-full border border-black/10 bg-black/[0.03] p-1">
        {has360 && (
          <button
            type="button"
            onClick={() => setMode("360")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "360"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            }`}
          >
            <Rotate3D size={16} />
            360° View
          </button>
        )}

        {modelUrl && (
          <button
            type="button"
            onClick={() => setMode("3d")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "3d"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            }`}
          >
            <Box size={16} />
            3D
          </button>
        )}

        <button
          type="button"
          onClick={() => setMode("photos")}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
            mode === "photos"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500"
          }`}
        >
          <Images size={16} />
          Photos
        </button>
      </div>

      {/* 360 */}
      {mode === "360" && has360 && (
        <Product360Viewer
          images={images}
          productName={productName}
        />
      )}

      {/* Real 3D */}
      {mode === "3d" && modelUrl && (
        <Product3DErrorBoundary
          fallback={
            <div className="flex min-h-[420px] items-center justify-center rounded-3xl bg-black/[0.03] p-8 text-center">
              <div className="max-w-sm">
                <p className="font-semibold text-gray-900">
                  3D preview unavailable
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  We couldn't load the 3D model for this
                  product.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setMode(
                      has360 ? "360" : "photos",
                    )
                  }
                  className="mt-4 rounded-xl px-4 py-2 text-sm font-semibold text-[var(--color-primary-foreground)]"
                  style={{
                    backgroundColor:
                      "var(--color-primary)",
                  }}
                >
                  {has360
                    ? "View 360°"
                    : "View photos"}
                </button>
              </div>
            </div>
          }
        >
          <Product3DViewer
            modelUrl={modelUrl}
            materialColor={materialColor}
            productName={productName}
          />
        </Product3DErrorBoundary>
      )}

      {/* Photos */}
      {mode === "photos" && (
        <>
          <div className="relative overflow-hidden rounded-3xl bg-black/5">
            <img
              src={images[selectedImage]}
              alt={productName}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() =>
                    setSelectedImage(index)
                  }
                  className={`shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    selectedImage === index
                      ? "border-[var(--color-primary)]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productName} view ${
                      index + 1
                    }`}
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductViewer;