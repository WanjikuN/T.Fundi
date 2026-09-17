import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Ruler,
  Sparkles,
} from "lucide-react";

import ProductOptionsSelector from "../../catalog/components/ProductOptionsSelector";

import type {
  AIProductAnalysisResponse,
  ProductOption,
} from "../../catalog/types/catalog.types";

type AIProductReviewProps = {
  result: AIProductAnalysisResponse;
  onBack: () => void;
  onCreateProduct: (payload: {
    name: string;
    description: string;
    category: string;
    dimensions: AIProductAnalysisResponse["draft"]["dimensions"];
    detectedFeatures: string[];
    options: ProductOption[];
    selectedOptions: Record<string, string>;
    images: string[];
  }) => void;
  isCreating?: boolean;
};

const AIProductReview = ({
  result,
  onBack,
  onCreateProduct,
  isCreating = false,
}: AIProductReviewProps) => {
  const { analysis, draft } = result;

  /*
   * Convert the AI detections into the format expected
   * by ProductOptionsSelector:
   *
   * {
   *   optionId: valueId
   * }
   */
  const initialSelections = useMemo(
    () =>
      Object.fromEntries(
        analysis.characteristics
          .filter(
            (characteristic) =>
              Boolean(characteristic.valueId),
          )
          .map((characteristic) => [
            `option-${characteristic.characteristicId}`,
            characteristic.valueId!,
          ]),
      ),
    [analysis.characteristics],
  );

  const [name, setName] = useState(draft.name);
  const [description, setDescription] =
    useState(draft.description);

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>(
      initialSelections,
    );

  const handleOptionChange = (
    optionId: string,
    valueId: string,
  ) => {
    setSelectedOptions((current) => ({
      ...current,
      [optionId]: valueId,
    }));
  };

  const handleCreate = () => {
    onCreateProduct({
      name: name.trim(),
      description: description.trim(),
      category: draft.category,
      dimensions: draft.dimensions,
      detectedFeatures:
        draft.detectedFeatures,
      options: draft.options,
      selectedOptions,
      images: draft.images,
    });
  };

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles
              size={16}
              style={{
                color:
                  "var(--color-primary)",
              }}
            />

            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{
                color:
                  "var(--color-primary)",
              }}
            >
              AI Product Studio
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">
            Review product
          </h1>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Confirm the information before adding this
            product to the catalogue.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
          <Check size={14} />

          {Math.round(
            analysis.confidence * 100,
          )}
          % AI confidence
        </div>
      </div>

      {/* =====================================================
          PRODUCT DETAILS
      ===================================================== */}

      <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          title="Product details"
          description="AI-generated information that you can edit before publishing."
        />

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="ai-product-name"
              className="text-sm font-medium text-gray-700"
            >
              Product name
            </label>

            <input
              id="ai-product-name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>

          <div>
            <label
              htmlFor="ai-product-category"
              className="text-sm font-medium text-gray-700"
            >
              Category
            </label>

            <div
              id="ai-product-category"
              className="mt-2 rounded-xl border border-black/10 bg-black/[0.025] px-4 py-3 text-sm text-gray-700"
            >
              {draft.category}
            </div>

            <p className="mt-1.5 text-xs text-gray-400">
              Category detection can be refined before
              publishing.
            </p>
          </div>

          <div>
            <label
              htmlFor="ai-product-description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="ai-product-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              rows={5}
              className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          IMAGES
      ===================================================== */}

      <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          title="Product images"
          description="Images used during AI analysis."
        />

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {draft.images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="aspect-square overflow-hidden rounded-2xl border border-black/10 bg-gray-50"
            >
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          DIMENSIONS
      ===================================================== */}

      <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-primary) 10%, transparent)",
              color:
                "var(--color-primary)",
            }}
          >
            <Ruler size={18} />
          </div>

          <SectionHeader
            title="Estimated dimensions"
            description="Measurements estimated from the supplied images."
          />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Dimension
            label="Width"
            value={draft.dimensions?.width ?? 0}
            unit={draft.dimensions?.unit ?? ""}
          />

          <Dimension
            label="Depth"
            value={draft.dimensions?.depth ?? 0}
            unit={draft.dimensions?.unit ?? ""}
          />

          <Dimension
            label="Height"
            value={draft.dimensions?.height ?? 0}
            unit={draft.dimensions?.unit ?? ""}
          />
        </div>
      </section>

      {/* =====================================================
          TENANT OPTIONS
      ===================================================== */}

      <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          title="Catalogue options"
          description="Select the values that should be attached to this product. These values come from your workspace configuration."
        />

        <div className="mt-6">
          {draft.options.length > 0 ? (
            <ProductOptionsSelector
              options={draft.options}
              selectedOptions={
                selectedOptions
              }
              onChange={handleOptionChange}
            />
          ) : (
            <div className="rounded-2xl bg-black/[0.025] p-5 text-sm text-gray-500">
              No configurable product options were
              detected for this workspace.
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          DETECTED FEATURES
      ===================================================== */}

      <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          title="Detected features"
          description="Physical observations identified from the product images."
        />

        <div className="mt-5 flex flex-wrap gap-2">
          {draft.detectedFeatures.length > 0 ? (
            draft.detectedFeatures.map(
              (feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-gray-700"
                >
                  <Check
                    size={13}
                    style={{
                      color:
                        "var(--color-primary)",
                    }}
                  />

                  {feature}
                </span>
              ),
            )
          ) : (
            <span className="text-sm text-gray-400">
              No physical features detected.
            </span>
          )}
        </div>
      </section>

      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <div className="sticky bottom-4 z-20 rounded-2xl border border-black/10 bg-white/95 p-3 shadow-xl backdrop-blur">
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={isCreating}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft size={16} />

            Back to analysis
          </button>

          <button
            type="button"
            onClick={handleCreate}
            disabled={
              isCreating ||
              !name.trim()
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCreating ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                Creating product...
              </>
            ) : (
              <>
                <Check size={16} />

                Create product
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SECTION HEADER
   ========================================================= */

const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div>
    <h2 className="text-base font-semibold text-gray-950">
      {title}
    </h2>

    <p className="mt-1 text-sm leading-6 text-gray-500">
      {description}
    </p>
  </div>
);

/* =========================================================
   DIMENSION
   ========================================================= */

const Dimension = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) => (
  <div className="rounded-2xl bg-black/[0.025] p-4">
    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
      {label}
    </p>

    <p className="mt-2 text-lg font-semibold text-gray-900">
      {value}
      <span className="ml-1 text-xs font-normal text-gray-500">
        {unit}
      </span>
    </p>
  </div>
);

export default AIProductReview;