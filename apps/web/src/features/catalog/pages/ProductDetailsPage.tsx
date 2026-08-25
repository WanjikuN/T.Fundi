import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Ruler,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ProductOptionsSelector from "../components/ProductOptionsSelector";
import ProductViewer from "../components/ProductViewer";
import { mockProducts } from "../types/catalog.mock";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const product = useMemo(
    () => mockProducts.find((item) => item.slug === slug),
    [slug],
  );

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>({});

  useEffect(() => {
    if (!product) {
      setSelectedOptions({});
      return;
    }

    setSelectedOptions(
      Object.fromEntries(
        product.options.map((option) => [
          option.id,
          option.values[0]?.id ?? "",
        ]),
      ),
    );
  }, [product]);

  if (!product) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-[var(--color-background)] px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={17} />
            Back to catalog
          </Link>

          <div className="flex min-h-[60vh] items-center justify-center text-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Product not found
              </h1>

              <p className="mt-2 text-gray-500">
                The furniture piece you're looking for doesn't exist.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const handleOptionChange = (
    optionId: string,
    valueId: string,
  ) => {
    setSelectedOptions((current) => ({
      ...current,
      [optionId]: valueId,
    }));
  };

  const selectedValues = product.options
    .map((option) =>
      option.values.find(
        (value) =>
          value.id === selectedOptions[option.id],
      ),
    )
    .filter(Boolean);

  const visualValue = selectedValues.find(
    (value) => value?.images?.length,
  );

  const viewerImages = visualValue?.images?.length
    ? visualValue.images
    : product.images?.length
      ? product.images
      : [product.imageUrl];

  const model3DUrl =
    visualValue?.model3DUrl ??
    product.model3DUrl;

  const selectedColor = selectedValues.find(
    (value) => value?.hexCode,
  );

  const handleCustomize = () => {
    navigate("/ai-studio", {
      state: {
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        selectedOptions,
      },
    });
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[var(--color-background)]">
      <div className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6 sm:py-5 lg:h-[calc(100vh-4rem)] lg:px-8 lg:py-4">
        {/* HEADER */}

        <div className="shrink-0">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={17} />
            Back to catalog
          </Link>
        </div>

        {/* PRODUCT WORKSPACE */}

        <div className="mt-3 lg:mt-4 lg:grid lg:h-[calc(100%-2rem)] lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)] lg:gap-10 xl:grid-cols-[minmax(0,1.3fr)_minmax(400px,0.7fr)] xl:gap-14">
          {/* VIEWER */}

          <section className="min-h-0">
            <div
              className="
                relative
                h-[58vh]
                min-h-[380px]
                overflow-hidden
                rounded-[2rem]
                bg-white
                shadow-sm
                ring-1
                ring-black/[0.06]

                sm:h-[62vh]
                sm:min-h-[440px]

                lg:h-full
                lg:min-h-0
              "
            >
              {/* Stage background */}

              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,rgba(0,0,0,0.025)_100%)]" />

              {/* Viewer */}

              <div className="relative z-10 h-full w-full">
                <ProductViewer
                  images={viewerImages}
                  productName={product.name}
                  modelUrl={model3DUrl}
                  materialColor={selectedColor?.hexCode}
                  materialName={visualValue?.name}
                />
              </div>
            </div>

            {/* Mobile hint */}

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400 lg:hidden">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
              Drag to rotate · Pinch to zoom
            </div>
          </section>

          {/* DETAILS */}

          <section className="mt-8 min-h-0 lg:mt-0">
            <div className="lg:h-full lg:overflow-y-auto lg:pr-3">
              <div className="pb-8 lg:pb-6">
                {/* CATEGORY */}

                <p
                  className="text-xs font-semibold uppercase tracking-[0.22em] sm:text-sm"
                  style={{
                    color: "var(--color-primary)",
                  }}
                >
                  {product.category}
                </p>

                {/* NAME */}

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl xl:text-5xl">
                  {product.name}
                </h1>

                {/* DESCRIPTION */}

                <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                  {product.description}
                </p>

                {/* PRICE */}

                <div className="mt-5 text-2xl font-bold text-gray-900">
                  {product.currency}{" "}
                  {product.price.toLocaleString("en-KE")}
                </div>

                {/* OPTIONS */}

                <div className="mt-7 border-t border-black/10 pt-6">
                  <ProductOptionsSelector
                    options={product.options}
                    selectedOptions={selectedOptions}
                    onChange={handleOptionChange}
                  />
                </div>

                {/* DIMENSIONS */}

                {product.dimensions && (
                  <div className="mt-7 border-t border-black/10 pt-6">
                    <div className="flex items-center gap-2">
                      <Ruler
                        size={17}
                        style={{
                          color:
                            "var(--color-primary)",
                        }}
                      />

                      <h2 className="text-sm font-semibold text-gray-900">
                        Dimensions
                      </h2>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                      <Dimension
                        label="Width"
                        value={`${product.dimensions.width}${product.dimensions.unit}`}
                      />

                      <Dimension
                        label="Depth"
                        value={`${product.dimensions.depth}${product.dimensions.unit}`}
                      />

                      <Dimension
                        label="Height"
                        value={`${product.dimensions.height}${product.dimensions.unit}`}
                      />
                    </div>
                  </div>
                )}

                {/* DESKTOP ACTIONS */}

                <div className="sticky bottom-0 z-30 mt-7 border-t border-black/10 bg-[var(--color-background)]/95 pt-5 pb-3 backdrop-blur-md">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleCustomize}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-[var(--color-primary-foreground)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      style={{
                        backgroundColor:
                          "var(--color-primary)",
                      }}
                    >
                      <Sparkles size={18} />
                      Customize with AI
                    </button>

                    <button
                      type="button"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-5 text-sm font-semibold text-gray-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-black/[0.02] hover:shadow-md"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>

                  <p className="mt-2 text-center text-xs text-gray-400">
                    Explore the piece, choose your finish,
                    then customize it with AI.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

type DimensionProps = {
  label: string;
  value: string;
};

const Dimension = ({
  label,
  value,
}: DimensionProps) => {
  return (
    <div className="rounded-xl bg-black/[0.03] p-3">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
};

export default ProductDetailsPage;