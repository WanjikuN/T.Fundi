import { useEffect, useMemo, useState, type ChangeEvent } from "react";

import { ArrowLeft, ImagePlus, Sparkles, Trash2, Upload } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import AIProductAnalysis from "../components/AIProductAnalysis";
import ProductCharacteristicsEditor from "../components/TenantCharacteristicsEditor";

import { analyseProduct } from "../api/aiProduct.api";

import type {
  AIProductAnalysis as AIProductAnalysisResult,
  TenantCharacteristic,
} from "../types/catalog.types";

import { useTenant } from "../../../app/providers/TenantProvider";

/* =========================================================
   HELPERS
   ========================================================= */

const cloneCharacteristics = (
  characteristics: TenantCharacteristic[],
): TenantCharacteristic[] =>
  characteristics.map((characteristic, index) => ({
    ...characteristic,

    sequence: characteristic.sequence ?? index,

    values:
      characteristic.values?.map((value) => ({
        ...value,

        images: value.images ? [...value.images] : undefined,
      })) ?? [],
  }));

/* =========================================================
   PAGE
   ========================================================= */

const CreateProductPage = () => {
  const navigate = useNavigate();

  const { tenant, catalogSettings } = useTenant();

  /* =======================================================
     IMAGES
     ======================================================= */

  const [images, setImages] = useState<File[]>([]);

  /* =======================================================
     CHARACTERISTICS
     ======================================================= */

  const [characteristics, setCharacteristics] = useState<
    TenantCharacteristic[]
  >([]);

  /* =======================================================
     AI
     ======================================================= */

  const [isAnalysing, setIsAnalysing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<AIProductAnalysisResult | null>(
    null,
  );

  /* =======================================================
     TENANT CONFIGURATION
     ======================================================= */

  const tenantCharacteristics = catalogSettings.characteristics ?? [];

  const enabledCategories = catalogSettings.categories ?? [];

  const defaultCurrency = catalogSettings.defaultCurrency || "KES";

  /*
   * These settings are displayed here so the creator
   * understands what will happen in the next step.
   *
   * They are actually enforced in ProductReviewPage.
   */
  const requiresPrice = catalogSettings.requirePrice ?? false;

  const requiresDimensions = catalogSettings.requireDimensions ?? false;

  const allowsCustomCategories = catalogSettings.allowCustomCategories ?? false;

  const allowsCustomCharacteristics =
    catalogSettings.allowCustomCharacteristics ?? false;

  /* =======================================================
     INITIALISE CHARACTERISTICS
     ======================================================= */

  useEffect(() => {
    setCharacteristics(cloneCharacteristics(tenantCharacteristics));
  }, [tenantCharacteristics]);

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
      imagePreviews.forEach(({ url }) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviews]);

  /* =======================================================
     IMAGE UPLOAD
     ======================================================= */

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    const validTypes = ["image/png", "image/jpeg", "image/webp"];

    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type),
    );

    if (invalidFiles.length > 0) {
      setError("Only PNG, JPG and WEBP images are supported.");

      event.target.value = "";
      return;
    }

    setError(null);

    setImages((current) => [...current, ...files]);

    event.target.value = "";
  };

  /* =======================================================
     REMOVE IMAGE
     ======================================================= */

  const removeImage = (index: number) => {
    setImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  /* =======================================================
     GENERATE PRODUCT
     ======================================================= */

  const handleGenerate = async () => {
    /* =======================================================
     VALIDATION
     ======================================================= */

    if (images.length === 0) {
      setError("Please upload at least one product image before continuing.");

      return;
    }

    /* =======================================================
     RESET
     ======================================================= */

    setError(null);
    setAnalysis(null);
    setIsAnalysing(true);

    try {
      /* =====================================================
       AI ANALYSIS
       ===================================================== */

      const response = await analyseProduct({
        images,

        tenantId: tenant?.id,

        characteristics: cloneCharacteristics(characteristics),
      });

      setAnalysis(response.analysis);

      /* =====================================================
       IMAGE PREVIEWS FOR REVIEW PAGE
       ===================================================== */

      const imageUrls = images.map((file) => URL.createObjectURL(file));

      /* =====================================================
       NAVIGATE TO REVIEW
       ===================================================== */

      navigate("/catalog/products/new/review", {
        state: {
          draft: response.draft,
          analysis: response.analysis,
          images,
          imageUrls,
        },
      });
    } catch (caughtError) {
      console.error("Product analysis failed:", caughtError);

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
    <main className="h-[calc(100vh-4rem)] overflow-hidden bg-[var(--color-background)]">
      <div className="mx-auto flex h-full max-w-[1500px] flex-col px-4 py-5 sm:px-6 lg:px-8">
        {/* =================================================
            HEADER
           ================================================= */}

        <header className="shrink-0">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 transition hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={15} />
            Back to Catalog
          </Link>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{
                  color: "var(--color-primary)",
                }}
              >
                AI Product Studio
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Create a product
              </h1>

              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-gray-500 sm:text-sm">
                Upload product images and let AI analyse them using this
                tenant's catalog configuration.
              </p>
            </div>

            {/* Configuration summary */}

            <div className="flex flex-wrap gap-2">
              <ConfigBadge label={`${enabledCategories.length} categories`} />

              <ConfigBadge
                label={`${characteristics.length} characteristics`}
              />

              <ConfigBadge label={defaultCurrency} active />

              {requiresPrice && <ConfigBadge label="Price required" />}

              {requiresDimensions && (
                <ConfigBadge label="Dimensions required" />
              )}
            </div>
          </div>
        </header>

        {/* =================================================
            WORKSPACE
           ================================================= */}

        <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="grid gap-5 pb-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* =================================================
                LEFT
               ================================================= */}

            <section className="min-w-0 space-y-5">
              {/* =================================================
                  IMAGES
                 ================================================= */}

              <div className="rounded-2xl border border-black/[0.08] bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className="text-[9px] font-bold uppercase tracking-[0.18em]"
                      style={{
                        color: "var(--color-primary)",
                      }}
                    >
                      Step 1
                    </p>

                    <h2 className="mt-1 text-base font-bold text-gray-900 sm:text-lg">
                      Product images
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Upload clear images from different angles for better AI
                      analysis.
                    </p>
                  </div>

                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                      color: "var(--color-primary)",
                    }}
                  >
                    <ImagePlus size={17} />
                  </div>
                </div>

                <label
                  htmlFor="product-images"
                  className="mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-black/15 bg-black/[0.015] px-5 py-6 text-center transition hover:border-[var(--color-primary)] hover:bg-black/[0.025]"
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                      color: "var(--color-primary)",
                    }}
                  >
                    <Upload size={17} />
                  </div>

                  <p className="mt-2 text-xs font-bold text-gray-800">
                    Upload product images
                  </p>

                  <p className="mt-0.5 text-[10px] text-gray-400">
                    PNG, JPG or WEBP
                  </p>

                  <input
                    id="product-images"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={`${preview.file.name}-${index}`}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-black/[0.08] bg-black/[0.03]"
                      >
                        <img
                          src={preview.url}
                          alt={`Product image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-gray-500 opacity-100 shadow-sm backdrop-blur transition hover:bg-red-50 hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* =================================================
                  CHARACTERISTICS
                 ================================================= */}

              <section className="rounded-2xl border border-black/[0.08] bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4">
                  <p
                    className="text-[9px] font-bold uppercase tracking-[0.18em]"
                    style={{
                      color: "var(--color-primary)",
                    }}
                  >
                    Step 2
                  </p>

                  <h2 className="mt-1 text-base font-bold text-gray-900 sm:text-lg">
                    Product characteristics
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    These characteristics come from this tenant's catalog
                    settings. Adjust them for this product if needed.
                  </p>
                </div>

                <ProductCharacteristicsEditor
                  characteristics={characteristics}
                  onChange={setCharacteristics}
                />

                {allowsCustomCharacteristics && (
                  <p className="mt-3 rounded-xl bg-black/[0.025] px-3 py-2.5 text-[10px] leading-4 text-gray-500">
                    Custom characteristics are enabled for this tenant.
                  </p>
                )}
              </section>

              {/* =================================================
                  ERROR
                 ================================================= */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5">
                  <p className="text-xs font-bold text-red-700">
                    Unable to generate product
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* =================================================
                  GENERATE
                 ================================================= */}

              <button
                type="button"
                disabled={isAnalysing || images.length === 0}
                onClick={handleGenerate}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-[var(--color-primary-foreground)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  backgroundColor: "var(--color-primary)",
                }}
              >
                <Sparkles
                  size={17}
                  className={isAnalysing ? "animate-pulse" : ""}
                />

                {isAnalysing ? "Analysing product..." : "Generate Product"}
              </button>
            </section>

            {/* =================================================
                RIGHT
               ================================================= */}

            <aside className="min-w-0 lg:sticky lg:top-0 lg:self-start">
              {analysis ? (
                <AIProductAnalysis
                  analysis={analysis}
                  isProcessing={isAnalysing}
                />
              ) : (
                <div className="rounded-2xl border border-black/[0.08] bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                        color: "var(--color-primary)",
                      }}
                    >
                      <Sparkles size={17} />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="text-[9px] font-bold uppercase tracking-[0.18em]"
                        style={{
                          color: "var(--color-primary)",
                        }}
                      >
                        AI Product Studio
                      </p>

                      <h2 className="mt-0.5 text-sm font-bold text-gray-900">
                        Ready to analyse
                      </h2>
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-gray-500">
                    AI will use the configuration defined by this tenant instead
                    of assuming a fixed furniture schema.
                  </p>

                  {/* =================================================
                      CATALOG CONFIGURATION
                     ================================================= */}

                  <div className="mt-4 border-t border-black/[0.06] pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      Catalog configuration
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <ConfigItem label="Currency" value={defaultCurrency} />

                      <ConfigItem
                        label="Categories"
                        value={String(enabledCategories.length)}
                      />

                      <ConfigItem
                        label="Price"
                        value={requiresPrice ? "Required" : "Optional"}
                      />

                      <ConfigItem
                        label="Dimensions"
                        value={requiresDimensions ? "Required" : "Optional"}
                      />
                    </div>
                  </div>

                  {/* =================================================
                      CHARACTERISTICS
                     ================================================= */}

                  <div className="mt-4 border-t border-black/[0.06] pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        Product schema
                      </p>

                      <span
                        className="text-xs font-bold"
                        style={{
                          color: "var(--color-primary)",
                        }}
                      >
                        {characteristics.length}
                      </span>
                    </div>

                    {characteristics.length > 0 ? (
                      <div className="mt-2 space-y-1.5">
                        {characteristics.map((characteristic) => (
                          <div
                            key={characteristic.id}
                            className="flex items-center justify-between gap-3 rounded-lg bg-black/[0.025] px-2.5 py-2"
                          >
                            <span className="min-w-0 truncate text-[11px] font-medium text-gray-600">
                              {characteristic.name}
                            </span>

                            <span className="shrink-0 text-[9px] font-bold uppercase tracking-wide text-gray-400">
                              {characteristic.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-[10px] leading-4 text-gray-400">
                        No tenant-specific characteristics are configured.
                      </p>
                    )}
                  </div>

                  {/* =================================================
                      CATEGORY CONFIGURATION
                     ================================================= */}

                  <div className="mt-4 border-t border-black/[0.06] pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      Categories
                    </p>

                    {enabledCategories.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {enabledCategories.map((category) => (
                          <span
                            key={category}
                            className="rounded-full bg-black/[0.04] px-2 py-1 text-[9px] font-semibold text-gray-500"
                          >
                            {formatCategory(category)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-[10px] leading-4 text-amber-600">
                        No categories are currently enabled. Configure them in
                        Catalog Settings before creating products.
                      </p>
                    )}

                    {allowsCustomCategories && (
                      <p className="mt-2 text-[10px] text-gray-400">
                        Custom categories are enabled.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
};

/* =========================================================
   CONFIG BADGE
   ========================================================= */

interface ConfigBadgeProps {
  label: string;
  active?: boolean;
}

const ConfigBadge = ({ label, active = false }: ConfigBadgeProps) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-bold ${
      active
        ? "border-[var(--color-primary)]/20 bg-[var(--color-primary)]/[0.06] text-[var(--color-primary)]"
        : "border-black/[0.08] bg-white text-gray-500"
    }`}
  >
    {label}
  </span>
);

/* =========================================================
   CONFIG ITEM
   ========================================================= */

interface ConfigItemProps {
  label: string;
  value: string;
}

const ConfigItem = ({ label, value }: ConfigItemProps) => (
  <div className="rounded-lg bg-black/[0.025] px-2.5 py-2">
    <p className="text-[9px] text-gray-400">{label}</p>

    <p className="mt-0.5 text-[10px] font-bold text-gray-700">{value}</p>
  </div>
);

/* =========================================================
   CATEGORY FORMATTER
   ========================================================= */

const formatCategory = (category: string) =>
  category
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default CreateProductPage;
