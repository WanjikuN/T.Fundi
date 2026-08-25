import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  Ruler,
  Sparkles,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import ProductOptionsEditor from "../components/ProductOptionsEditor";
import ProductPhotoGallery from "../components/ProductPhotoGallery";

import type {
  AIProductAnalysis,
  AIProductDraft,
} from "../types/catalog.types";

type ReviewState = {
  draft?: AIProductDraft;
  analysis?: AIProductAnalysis;
  images?: File[];
  imageUrls?: string[];
};

const ProductReviewPage = () => {
  const location = useLocation();

  const state =
    location.state as ReviewState | null;

  const draft = state?.draft;
  const analysis = state?.analysis;

  const [productName, setProductName] =
    useState(
      draft?.name ??
        analysis?.detectedName ??
        "",
    );

  const [description, setDescription] =
    useState(
      draft?.description ??
        analysis?.description ??
        "",
    );

  const [category, setCategory] =
    useState(
      draft?.category ??
        analysis?.category ??
        "",
    );

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>(() => {
      return Object.fromEntries(
        (draft?.options ?? []).map(
          (option) => [
            option.id,
            option.values[0]?.id ?? "",
          ],
        ),
      );
    });

  const [width, setWidth] =
    useState(
      String(
        draft?.dimensions?.width ??
          analysis?.dimensions?.width ??
          "",
      ),
    );

  const [depth, setDepth] =
    useState(
      String(
        draft?.dimensions?.depth ??
          analysis?.dimensions?.depth ??
          "",
      ),
    );

  const [height, setHeight] =
    useState(
      String(
        draft?.dimensions?.height ??
          analysis?.dimensions?.height ??
          "",
      ),
    );

  const [unit, setUnit] =
    useState(
      draft?.dimensions?.unit ??
        analysis?.dimensions?.unit ??
        "cm",
    );

  const [showAI, setShowAI] =
    useState(false);

  const imageUrls = useMemo(() => {
    if (state?.imageUrls?.length) {
      return state.imageUrls;
    }

    if (!state?.images?.length) {
      return [];
    }

    return state.images.map((file) =>
      URL.createObjectURL(file),
    );
  }, [state?.imageUrls, state?.images]);

  useEffect(() => {
    return () => {
      if (!state?.images) {
        return;
      }

      imageUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imageUrls, state?.images]);

  if (!draft && !analysis) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[var(--color-background)] px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            No product draft found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Start by creating a product with AI.
          </p>

          <Link
            to="/catalog/products/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-[var(--color-primary-foreground)]"
            style={{
              backgroundColor:
                "var(--color-primary)",
            }}
          >
            <Sparkles size={17} />
            Create product
          </Link>
        </div>
      </main>
    );
  }

  const options = draft?.options ?? [];

  const handleOptionChange = (
    optionId: string,
    valueId: string,
  ) => {
    setSelectedOptions(
      (current) => ({
        ...current,
        [optionId]: valueId,
      }),
    );
  };

  const handleSave = () => {
    const approvedProduct = {
      name: productName,
      description,
      category,
      options: selectedOptions,

      dimensions: {
        width: Number(width),
        depth: Number(depth),
        height: Number(height),
        unit,
      },

      images: imageUrls,
    };

    console.log(
      "Approved product:",
      approvedProduct,
    );
  };

  return (
    <main className="h-[calc(100vh-4rem)] overflow-hidden bg-[var(--color-background)]">
      <div className="mx-auto flex h-full max-w-[1500px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        {/* HEADER */}

        <header className="shrink-0">
          <Link
            to="/catalog/products/new"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={17} />
            Back to AI Product Studio
          </Link>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{
                  color:
                    "var(--color-primary)",
                }}
              >
                Product Review
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Review & Edit
              </h1>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor:
                    "var(--color-primary)",
                }}
              />

              <span className="text-xs text-gray-500">
                AI draft · Review required
              </span>
            </div>
          </div>
        </header>

        {/* WORKSPACE */}

        <div className="mt-5 grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
          {/* EDITOR */}

          <section className="min-h-0 overflow-y-auto pr-1 lg:pr-3">
            <div className="space-y-5 pb-8">
              {/* PRODUCT */}

              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
                <SectionHeading
                  eyebrow="Product"
                  title="Product information"
                />

                <div className="mt-5 space-y-4">
                  <Field
                    label="Product name"
                    value={productName}
                    onChange={setProductName}
                  />

                  <Field
                    label="Category"
                    value={category}
                    onChange={setCategory}
                  />

                  <div>
                    <label className="text-sm font-semibold text-gray-800">
                      Description
                    </label>

                    <textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(
                          event.target.value,
                        )
                      }
                      rows={4}
                      className="mt-2 w-full resize-none rounded-xl border border-black/10 px-4 py-3 text-sm leading-6 outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
              </div>

              {/* TENANT CHARACTERISTICS */}

              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
                <ProductOptionsEditor
                  options={options}
                  selectedValues={
                    selectedOptions
                  }
                  onChange={
                    handleOptionChange
                  }
                />
              </div>

              {/* DIMENSIONS */}

              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
                <SectionHeading
                  eyebrow="Measurements"
                  title="Dimensions"
                  icon={<Ruler size={17} />}
                />

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  AI estimates these from your
                  photos. Verify before publishing.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <NumberField
                    label="Width"
                    value={width}
                    onChange={setWidth}
                  />

                  <NumberField
                    label="Depth"
                    value={depth}
                    onChange={setDepth}
                  />

                  <NumberField
                    label="Height"
                    value={height}
                    onChange={setHeight}
                  />

                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Unit
                    </label>

                    <select
                      value={unit}
                      onChange={(event) =>
                        setUnit(
                          event.target.value as typeof unit,
                        )
                      }
                      className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--color-primary)]"
                    >
                      <option value="cm">
                        cm
                      </option>
                      <option value="mm">
                        mm
                      </option>
                      <option value="in">
                        inches
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI */}

              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
                <button
                  type="button"
                  onClick={() =>
                    setShowAI(
                      (current) => !current,
                    )
                  }
                  className="flex w-full items-center justify-between"
                >
                  <SectionHeading
                    eyebrow="AI"
                    title="AI observations"
                    icon={<Sparkles size={17} />}
                  />

                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition ${
                      showAI
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {showAI && (
                  <div className="mt-5 space-y-5">
                    <Detection
                      label="Physical characteristics"
                      values={
                        analysis?.detectedFeatures ??
                        []
                      }
                    />

                    <div>
                      <p className="text-xs font-semibold text-gray-500">
                        Tenant characteristic matches
                      </p>

                      <div className="mt-2 space-y-2">
                        {analysis?.characteristics
                          ?.length ? (
                          analysis.characteristics.map(
                            (item, index) => (
                              <div
                                key={`${item.characteristicName}-${item.value}-${index}`}
                                className="flex items-center justify-between rounded-xl bg-black/[0.025] px-3 py-2.5"
                              >
                                <span className="text-xs text-gray-500">
                                  {
                                    item.characteristicName
                                  }
                                </span>

                                <span className="text-xs font-semibold text-gray-800">
                                  {item.value}
                                </span>
                              </div>
                            ),
                          )
                        ) : (
                          <p className="text-xs text-gray-400">
                            No tenant characteristics
                            detected.
                          </p>
                        )}
                      </div>
                    </div>

                    {analysis?.warnings.map(
                      (warning) => (
                        <p
                          key={warning}
                          className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-700"
                        >
                          {warning}
                        </p>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* PREVIEW */}

          <aside className="hidden min-h-0 lg:block">
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
              <div className="shrink-0">
                <ProductPhotoGallery
                  images={imageUrls}
                  productName={productName}
                />
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto border-t border-black/[0.06] p-5">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{
                    color:
                      "var(--color-primary)",
                  }}
                >
                  Preview
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {productName ||
                    "Unnamed product"}
                </h2>

                <p className="mt-2 line-clamp-3 text-xs leading-5 text-gray-500">
                  {description}
                </p>

                <div className="mt-4 space-y-2">
                  {options.map((option) => {
                    const selected =
                      option.values.find(
                        (value) =>
                          value.id ===
                          selectedOptions[
                            option.id
                          ],
                      );

                    return (
                      <div
                        key={option.id}
                        className="flex items-center justify-between rounded-xl bg-black/[0.025] px-3 py-2.5"
                      >
                        <span className="text-xs text-gray-500">
                          {option.name}
                        </span>

                        <span className="text-xs font-semibold text-gray-800">
                          {selected?.name ??
                            "Not selected"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="shrink-0 border-t border-black/10 bg-white p-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-[var(--color-primary-foreground)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  style={{
                    backgroundColor:
                      "var(--color-primary)",
                  }}
                >
                  <Check size={18} />
                  Save Product
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* MOBILE SAVE */}

        <div className="mt-3 shrink-0 lg:hidden">
          <button
            type="button"
            onClick={handleSave}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-[var(--color-primary-foreground)]"
            style={{
              backgroundColor:
                "var(--color-primary)",
            }}
          >
            <Check size={18} />
            Save Product
          </button>
        </div>
      </div>
    </main>
  );
};

/* =========================================================
   HELPERS
   ========================================================= */

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  icon?: React.ReactNode;
};

const SectionHeading = ({
  eyebrow,
  title,
  icon,
}: SectionHeadingProps) => (
  <div className="flex items-center gap-3">
    {icon && (
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-primary) 10%, transparent)",
          color: "var(--color-primary)",
        }}
      >
        {icon}
      </div>
    )}

    <div>
      <p
        className="text-[10px] font-bold uppercase tracking-[0.18em]"
        style={{
          color: "var(--color-primary)",
        }}
      >
        {eyebrow}
      </p>

      <h2 className="text-base font-semibold text-gray-900">
        {title}
      </h2>
    </div>
  </div>
);

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const Field = ({
  label,
  value,
  onChange,
}: FieldProps) => (
  <div>
    <label className="text-sm font-semibold text-gray-800">
      {label}
    </label>

    <input
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className="mt-2 h-11 w-full rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--color-primary)]"
    />
  </div>
);

type NumberFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const NumberField = ({
  label,
  value,
  onChange,
}: NumberFieldProps) => (
  <div>
    <label className="text-xs font-medium text-gray-500">
      {label}
    </label>

    <input
      type="number"
      min="0"
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className="mt-1 h-11 w-full rounded-xl border border-black/10 px-3 text-sm font-semibold outline-none focus:border-[var(--color-primary)]"
    />
  </div>
);

type DetectionProps = {
  label: string;
  values: string[];
};

const Detection = ({
  label,
  values,
}: DetectionProps) => (
  <div>
    <p className="text-xs font-semibold text-gray-500">
      {label}
    </p>

    <div className="mt-2 flex flex-wrap gap-2">
      {values.length ? (
        values.map((value) => (
          <span
            key={value}
            className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs text-gray-700"
          >
            {value}
          </span>
        ))
      ) : (
        <span className="text-xs text-gray-400">
          None detected
        </span>
      )}
    </div>
  </div>
);

export default ProductReviewPage;