import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ImagePlus,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import AIProductAnalysis from "../components/AIProductAnalysis";
import { analyseProduct } from "../api/aiProduct.api";

import type {
  AIProductAnalysis as AIProductAnalysisResult,
  TenantCharacteristic,
} from "../types/catalog.types";
import { useTenant } from "../../../app/providers/TenantProvider";
import ProductCharacteristicsEditor from "../components/TenantCharacteristicsEditor";


/* =========================================================
   CREATE PRODUCT PAGE
   =========================================================
 *
 * Product creation flow:
 *
 * Tenant defaults
 *       ↓
 * Product characteristics
 *       ↓
 * User customises for this product
 *       ↓
 * Upload images
 *       ↓
 * Generate
 *       ↓
 * AI analyses using FINAL characteristics
 *       ↓
 * Product Review
 * ========================================================= */

const CreateProductPage = () => {
  const navigate = useNavigate();

  const tenant = useTenant();

  const [images, setImages] =
    useState<File[]>([]);

  const [characteristics, setCharacteristics] =
    useState<TenantCharacteristic[]>(
      [],
    );

  const [isAnalysing, setIsAnalysing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [analysis, setAnalysis] =
    useState<AIProductAnalysisResult | null>(
      null,
    );

  /* =======================================================
     TENANT DEFAULT CHARACTERISTICS
     =======================================================
   *
   * These are copied into local product state.
   *
   * We intentionally do NOT mutate the tenant's
   * configuration while creating a product.
   *
   * The product gets its own editable snapshot.
   * ======================================================= */

  const tenantCharacteristics =
    useMemo<TenantCharacteristic[]>(
      () => {
        const catalogSettings = (
          tenant.tenant as unknown as {
            catalogSettings?: {
              characteristics?: TenantCharacteristic[];
            };
          } | null | undefined
        )?.catalogSettings;

        return catalogSettings?.characteristics ?? [];
      },
      [tenant.tenant],
    );

  /* =======================================================
     INITIALISE PRODUCT CHARACTERISTICS
     =======================================================
   *
   * Only initialise once the tenant configuration
   * becomes available.
   * ======================================================= */

  useEffect(() => {
    if (
      characteristics.length > 0 ||
      tenantCharacteristics.length === 0
    ) {
      return;
    }

    setCharacteristics(
      cloneCharacteristics(
        tenantCharacteristics,
      ),
    );
  }, [
    tenantCharacteristics,
    characteristics.length,
  ]);

  /* =======================================================
     IMAGE PREVIEWS
     ======================================================= */

  const imagePreviews = useMemo(
    () =>
      images.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [images],
  );

  useEffect(() => {
    return () => {
      imagePreviews.forEach(
        ({ url }) => {
          URL.revokeObjectURL(url);
        },
      );
    };
  }, [imagePreviews]);

  /* =======================================================
     IMAGE UPLOAD
     ======================================================= */

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(
      event.target.files ?? [],
    );

    if (!files.length) {
      return;
    }

    setError(null);

    setImages((current) => [
      ...current,
      ...files,
    ]);

    event.target.value = "";
  };

  /* =======================================================
     REMOVE IMAGE
     ======================================================= */

  const removeImage = (
    index: number,
  ) => {
    setImages((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index,
      ),
    );
  };

  /* =======================================================
     GENERATE PRODUCT
     ======================================================= */

  const handleGenerate = async () => {
    if (!images.length) {
      setError(
        "Please upload at least one product image.",
      );

      return;
    }

    setError(null);
    setAnalysis(null);
    setIsAnalysing(true);

    try {
      /*
       * The FINAL product-specific characteristics
       * are sent to AI.
       *
       * This can differ from the tenant defaults.
       */
      const response =
        await analyseProduct({
          images,

          characteristics,
        });

      setAnalysis(
        response.analysis,
      );

      /*
       * Create temporary URLs for the review
       * page.
       */
      const imageUrls =
        images.map((file) =>
          URL.createObjectURL(file),
        );

      navigate(
        "/catalog/products/new/review",
        {
          state: {
            draft: response.draft,

            analysis:
              response.analysis,

            images,

            imageUrls,
          },
        },
      );
    } catch (caughtError) {
      console.error(
        "Product analysis failed:",
        caughtError,
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while analysing the product.",
      );
    } finally {
      setIsAnalysing(false);
    }
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[var(--color-background)]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}

        <header>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={17} />

            Back to Catalog
          </Link>

          <div className="mt-5">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{
                color:
                  "var(--color-primary)",
              }}
            >
              AI Product Studio
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Create a product
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Upload product images and
              configure the characteristics AI
              should identify.
            </p>
          </div>
        </header>

        {/* WORKSPACE */}

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          {/* LEFT */}

          <section className="space-y-6">
            {/* =================================================
                STEP 1 — IMAGES
                ================================================= */}

            <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.18em]"
                    style={{
                      color:
                        "var(--color-primary)",
                    }}
                  >
                    Step 1
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    Product images
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Upload clear images showing
                    the product from different
                    angles.
                  </p>
                </div>

                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                    color:
                      "var(--color-primary)",
                  }}
                >
                  <ImagePlus size={18} />
                </div>
              </div>

              <label
                htmlFor="product-images"
                className="mt-5 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-black/[0.015] px-5 py-8 text-center transition hover:border-[var(--color-primary)] hover:bg-black/[0.025]"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                    color:
                      "var(--color-primary)",
                  }}
                >
                  <Upload size={19} />
                </div>

                <p className="mt-3 text-sm font-semibold text-gray-800">
                  Upload product images
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  PNG, JPG or WEBP
                </p>

                <input
                  id="product-images"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={
                    handleImageUpload
                  }
                  className="hidden"
                />
              </label>

              {imagePreviews.length >
                0 && (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {imagePreviews.map(
                    (
                      preview,
                      index,
                    ) => (
                      <div
                        key={`${preview.file.name}-${index}`}
                        className="group relative aspect-square overflow-hidden rounded-2xl border border-black/10 bg-black/[0.03]"
                      >
                        <img
                          src={
                            preview.url
                          }
                          alt={`Product image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(
                              index,
                            )
                          }
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-gray-500 opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <Trash2
                            size={15}
                          />
                        </button>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* =================================================
                STEP 2 — CHARACTERISTICS
                ================================================= */}

            <ProductCharacteristicsEditor
              characteristics={
                characteristics
              }
              onChange={
                setCharacteristics
              }
            />

            {/* =================================================
                ERROR
                ================================================= */}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">
                  Unable to generate
                  product
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* =================================================
                GENERATE
                ================================================= */}

            <button
              type="button"
              disabled={
                isAnalysing ||
                images.length === 0
              }
              onClick={
                handleGenerate
              }
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-[var(--color-primary-foreground)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor:
                  "var(--color-primary)",
              }}
            >
              <Sparkles
                size={18}
                className={
                  isAnalysing
                    ? "animate-pulse"
                    : ""
                }
              />

              {isAnalysing
                ? "Analysing product..."
                : "Generate Product"}
            </button>
          </section>

          {/* =================================================
              RIGHT — AI PREVIEW
              ================================================= */}

          <aside className="lg:sticky lg:top-6 lg:self-start">
            {analysis ? (
              <AIProductAnalysis
                analysis={analysis}
                isProcessing={
                  isAnalysing
                }
              />
            ) : (
              <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                      color:
                        "var(--color-primary)",
                    }}
                  >
                    <Sparkles
                      size={19}
                    />
                  </div>

                  <div>
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.18em]"
                      style={{
                        color:
                          "var(--color-primary)",
                      }}
                    >
                      AI Product Studio
                    </p>

                    <h2 className="mt-1 text-base font-semibold text-gray-900">
                      Ready to analyse
                    </h2>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-gray-500">
                  Upload your product
                  images and configure
                  the characteristics AI
                  should analyse.
                </p>

                <div className="mt-5 border-t border-black/[0.06] pt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-500">
                      Product schema
                    </p>

                    <span
                      className="text-xs font-bold"
                      style={{
                        color:
                          "var(--color-primary)",
                      }}
                    >
                      {
                        characteristics.length
                      }
                    </span>
                  </div>

                  {characteristics.length >
                  0 ? (
                    <div className="mt-3 space-y-2">
                      {characteristics.map(
                        (
                          characteristic,
                        ) => (
                          <div
                            key={
                              characteristic.id
                            }
                            className="flex items-center justify-between rounded-xl bg-black/[0.025] px-3 py-2.5"
                          >
                            <span className="min-w-0 truncate text-xs text-gray-600">
                              {
                                characteristic.name
                              }
                            </span>

                            <span className="ml-3 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                              {
                                characteristic.type
                              }
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <p className="mt-3 text-xs leading-5 text-gray-400">
                      No characteristics
                      configured. Add one
                      to give AI a schema
                      for this product.
                    </p>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
};

/* =========================================================
   CLONE TENANT CHARACTERISTICS
   =========================================================
 *
 * VERY IMPORTANT:
 *
 * We do not put tenant objects directly into product
 * state.
 *
 * We clone them so editing a product does not mutate
 * the tenant's global configuration.
 * ========================================================= */

const cloneCharacteristics = (
  characteristics: TenantCharacteristic[],
): TenantCharacteristic[] =>
  characteristics.map(
    (characteristic, index) => ({
      ...characteristic,

      sequence:
        characteristic.sequence ??
        index,

      values:
        characteristic.values.map(
          (value) => ({
            ...value,

            images:
              value.images
                ? [...value.images]
                : undefined,
          }),
        ),
    }),
  );

export default CreateProductPage;