import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Ruler,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import MaterialSelector from "../components/MaterialSelector";
import ProductViewer from "../components/ProductViewer";
import { mockProducts } from "../types/catalog.mock";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const product = useMemo(
    () => mockProducts.find((item) => item.slug === slug),
    [slug],
  );

  const [selectedMaterialId, setSelectedMaterialId] = useState(
    product?.materials[0]?.id ?? "",
  );

  if (!product) {
    return (
      <main className="min-h-screen bg-[var(--color-background)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={17} />
            Back to catalog
          </Link>

          <div className="mt-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Product not found
            </h1>

            <p className="mt-2 text-gray-500">
              The furniture piece you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const images = product.images?.length
    ? product.images
    : [product.imageUrl];

  const selectedMaterial = product.materials.find(
    (material) => material.id === selectedMaterialId,
  );

  const handleCustomize = () => {
    navigate("/ai-studio", {
      state: {
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        materialId: selectedMaterial?.id,
        materialName: selectedMaterial?.name,
      },
    });
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[var(--color-primary)]"
        >
          <ArrowLeft size={17} />
          Back to catalog
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Product visual */}
          <div>
            <ProductViewer
              images={images}
              productName={product.name}
              modelUrl={product.model3DUrl}
              materialColor={selectedMaterial?.hexCode}
            />

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-black/5 bg-white/60 p-4">
              <div
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                }}
              >
                <Sparkles
                  size={17}
                  style={{
                    color: "var(--color-primary)",
                  }}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Make it yours
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Explore the piece, choose your finish, then visualize
                  it in your own space with AI.
                </p>
              </div>
            </div>
          </div>

          {/* Product information */}
          <div className="flex flex-col justify-center">
            <p
              className="text-sm font-semibold uppercase tracking-[0.2em]"
              style={{
                color: "var(--color-primary)",
              }}
            >
              {product.category}
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-base leading-7 text-gray-600">
              {product.description}
            </p>

            <div className="mt-6 text-2xl font-bold text-gray-900">
              {product.currency}{" "}
              {product.price.toLocaleString("en-KE")}
            </div>

            {/* Materials */}
            <div className="mt-8 border-t border-black/10 pt-7">
              <MaterialSelector
                materials={product.materials}
                selectedMaterialId={selectedMaterialId}
                onChange={setSelectedMaterialId}
              />
            </div>

            {/* Dimensions */}
            {product.dimensions && (
              <div className="mt-7 border-t border-black/10 pt-7">
                <div className="flex items-center gap-2">
                  <Ruler
                    size={17}
                    style={{
                      color: "var(--color-primary)",
                    }}
                  />

                  <h2 className="text-sm font-semibold text-gray-900">
                    Dimensions
                  </h2>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-black/[0.03] p-3">
                    <p className="text-xs text-gray-500">
                      Width
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {product.dimensions.width}
                      {product.dimensions.unit}
                    </p>
                  </div>

                  <div className="rounded-xl bg-black/[0.03] p-3">
                    <p className="text-xs text-gray-500">
                      Depth
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {product.dimensions.depth}
                      {product.dimensions.unit}
                    </p>
                  </div>

                  <div className="rounded-xl bg-black/[0.03] p-3">
                    <p className="text-xs text-gray-500">
                      Height
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {product.dimensions.height}
                      {product.dimensions.unit}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleCustomize}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-[var(--color-primary-foreground)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  backgroundColor: "var(--color-primary)",
                }}
              >
                <Sparkles size={18} />
                Customize with AI
              </button>

              <button
                type="button"
                className="rounded-xl border border-black/10 bg-white px-5 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-black/[0.03]"
              >
                Add to Cart
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
              Customize the material, explore your options, and
              visualize this piece in your space.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailsPage;