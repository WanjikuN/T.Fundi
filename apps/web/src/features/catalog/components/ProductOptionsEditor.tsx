import {
  Check,
  Image as ImageIcon,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

import type {
  ProductOption,
  ProductOptionValue,
} from "../types/catalog.types";

type Props = {
  options: ProductOption[];

  selectedValues: Record<string, string>;

  onChange: (
    optionId: string,
    valueId: string,
  ) => void;

  onRemoveOption?: (
    optionId: string,
  ) => void;

  onAddValue?: (
    optionId: string,
  ) => void;

  onUpdateValue?: (
    optionId: string,
    valueId: string,
    updates: Partial<ProductOptionValue>,
  ) => void;

  /**
   * Allows the parent to add a completely new
   * product-specific option.
   */
  onAddOption?: () => void;

  /**
   * Optional AI confidence per option.
   *
   * Example:
   *
   * {
   *   "option-wood": 0.94
   * }
   */
  aiConfidence?: Record<string, number>;

  /**
   * Optional helper displayed when the AI has
   * detected a likely value.
   */
  aiDetectedValues?: Record<string, string>;
};

const ProductOptionsEditor = ({
  options,
  selectedValues,
  onChange,
  onRemoveOption,
  onAddValue,
  onUpdateValue,
  onAddOption,
  aiConfidence = {},
  aiDetectedValues = {},
}: Props) => {
  return (
    <div>
      {/* =====================================================
          HEADER
         ===================================================== */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{
              color: "var(--color-primary)",
            }}
          >
            Product characteristics
          </p>

          <h2 className="mt-1 text-lg font-semibold text-gray-900">
            Configure this product
          </h2>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">
            Choose the values available for this product.
            These characteristics come from your tenant
            configuration and can be refined for this product.
          </p>
        </div>

        {onAddOption && (
          <button
            type="button"
            onClick={onAddOption}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            <Plus size={14} />
            Add characteristic
          </button>
        )}
      </div>

      {/* =====================================================
          OPTIONS
         ===================================================== */}

      <div className="mt-6 space-y-4">
        {options.length === 0 ? (
          <EmptyState onAddOption={onAddOption} />
        ) : (
          options.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              selectedValue={selectedValues[option.id]}
              aiConfidence={aiConfidence[option.id]}
              aiDetectedValue={
                aiDetectedValues[option.id]
              }
              onChange={onChange}
              onRemove={
                onRemoveOption
                  ? () =>
                      onRemoveOption(option.id)
                  : undefined
              }
              onAddValue={onAddValue}
              onUpdateValue={onUpdateValue}
            />
          ))
        )}
      </div>
    </div>
  );
};

/* =========================================================
   OPTION CARD
   ========================================================= */

type OptionCardProps = {
  option: ProductOption;

  selectedValue?: string;

  aiConfidence?: number;

  aiDetectedValue?: string;

  onChange: (
    optionId: string,
    valueId: string,
  ) => void;

  onRemove?: () => void;

  onAddValue?: (
    optionId: string,
  ) => void;

  onUpdateValue?: (
    optionId: string,
    valueId: string,
    updates: Partial<ProductOptionValue>,
  ) => void;
};

const OptionCard = ({
  option,
  selectedValue,
  aiConfidence,
  aiDetectedValue,
  onChange,
  onRemove,
  onAddValue,
  onUpdateValue,
}: OptionCardProps) => {
  const isFreeInput =
    option.type === "text" ||
    option.type === "number";

  const confidencePercent =
    aiConfidence !== undefined
      ? Math.round(aiConfidence * 100)
      : undefined;

  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.015] p-4">
      {/* =====================================================
          OPTION HEADER
         ===================================================== */}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">
              {option.name}
            </h3>

            {option.required && (
              <span className="rounded-full bg-black/[0.04] px-2 py-1 text-[10px] font-medium text-gray-500">
                Required
              </span>
            )}

            {confidencePercent !== undefined && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)]/[0.07] px-2 py-1 text-[10px] font-semibold">
                <Sparkles
                  size={11}
                  style={{
                    color:
                      "var(--color-primary)",
                  }}
                />

                <span
                  style={{
                    color:
                      "var(--color-primary)",
                  }}
                >
                  AI {confidencePercent}%
                </span>
              </span>
            )}
          </div>

          <p className="mt-1 text-[10px] capitalize text-gray-400">
            {option.type}
          </p>
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-300 transition hover:bg-red-50 hover:text-red-500"
            aria-label={`Remove ${option.name}`}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* =====================================================
          AI DETECTION
         ===================================================== */}

      {aiDetectedValue && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-[var(--color-primary)]/[0.05] px-3 py-2.5">
          <Sparkles
            size={14}
            className="shrink-0"
            style={{
              color:
                "var(--color-primary)",
            }}
          />

          <p className="text-xs text-gray-600">
            AI suggests{" "}
            <span className="font-semibold text-gray-900">
              {aiDetectedValue}
            </span>
          </p>
        </div>
      )}

      {/* =====================================================
          FREE INPUT
         ===================================================== */}

      {isFreeInput ? (
        <div className="mt-4">
          <input
            type={
              option.type === "number"
                ? "number"
                : "text"
            }
            value={
              typeof option.value === "string" ||
              typeof option.value === "number"
                ? String(option.value)
                : selectedValue ?? ""
            }
            onChange={(event) =>
              onChange(
                option.id,
                event.target.value,
              )
            }
            placeholder={`Enter ${option.name.toLowerCase()}`}
            className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
          />
        </div>
      ) : (
        <SelectableValues
          option={option}
          selectedValue={selectedValue}
          onChange={onChange}
          onAddValue={onAddValue}
          onUpdateValue={onUpdateValue}
        />
      )}
    </div>
  );
};

/* =========================================================
   SELECTABLE VALUES
   ========================================================= */

type SelectableValuesProps = {
  option: ProductOption;

  selectedValue?: string;

  onChange: (
    optionId: string,
    valueId: string,
  ) => void;

  onAddValue?: (
    optionId: string,
  ) => void;

  onUpdateValue?: (
    optionId: string,
    valueId: string,
    updates: Partial<ProductOptionValue>,
  ) => void;
};

const SelectableValues = ({
  option,
  selectedValue,
  onChange,
  onAddValue,
  onUpdateValue,
}: SelectableValuesProps) => {
  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {option.values.map((value) => (
          <ValueButton
            key={value.id}
            option={option}
            value={value}
            selected={
              selectedValue === value.id
            }
            onSelect={() =>
              onChange(
                option.id,
                value.id,
              )
            }
            onUpdate={
              onUpdateValue
                ? (updates) =>
                    onUpdateValue(
                      option.id,
                      value.id,
                      updates,
                    )
                : undefined
            }
          />
        ))}

        {onAddValue && (
          <button
            type="button"
            onClick={() =>
              onAddValue(option.id)
            }
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-dashed border-black/15 bg-white px-3 text-xs font-medium text-gray-500 transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            <Plus size={13} />
            Add value
          </button>
        )}
      </div>

      {!option.values.length && (
        <div className="rounded-xl border border-dashed border-black/10 bg-white p-4 text-center">
          <p className="text-xs font-medium text-gray-500">
            No values configured
          </p>

          {onAddValue && (
            <button
              type="button"
              onClick={() =>
                onAddValue(option.id)
              }
              className="mt-2 text-xs font-semibold"
              style={{
                color:
                  "var(--color-primary)",
              }}
            >
              Add the first value
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* =========================================================
   VALUE BUTTON
   ========================================================= */

type ValueButtonProps = {
  option: ProductOption;

  value: ProductOptionValue;

  selected: boolean;

  onSelect: () => void;

  onUpdate?: (
    updates: Partial<ProductOptionValue>,
  ) => void;
};

const ValueButton = ({
  option,
  value,
  selected,
  onSelect,
  onUpdate,
}: ValueButtonProps) => {
  return (
    <div
      className={`group relative inline-flex items-center overflow-hidden rounded-xl border transition ${
        selected
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/[0.07]"
          : "border-black/10 bg-white hover:border-black/20"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="inline-flex min-h-11 items-center gap-2 px-3 py-2.5 text-xs font-medium"
      >
        {/* COLOR */}

        {option.type === "color" && (
          <span
            className="h-5 w-5 shrink-0 rounded-full border border-black/10"
            style={{
              backgroundColor:
                value.hexCode ??
                "#cccccc",
            }}
          />
        )}

        {/* IMAGE */}

        {option.type === "image" && (
          value.imageUrl ? (
            <img
              src={value.imageUrl}
              alt={value.name}
              className="h-7 w-7 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/[0.04]">
              <ImageIcon
                size={14}
                className="text-gray-400"
              />
            </span>
          )
        )}

        <span>{value.name}</span>

        {selected && (
          <Check
            size={14}
            style={{
              color:
                "var(--color-primary)",
            }}
          />
        )}
      </button>

      {/* ===================================================
          COLOR EDITOR
         =================================================== */}

      {option.type === "color" &&
        onUpdate && (
          <div className="border-l border-black/10 px-2">
            <input
              type="color"
              value={
                value.hexCode ??
                "#cccccc"
              }
              onChange={(event) =>
                onUpdate({
                  hexCode:
                    event.target.value,
                })
              }
              className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
              title={`Change ${value.name} colour`}
            />
          </div>
        )}
    </div>
  );
};

/* =========================================================
   EMPTY STATE
   ========================================================= */

type EmptyStateProps = {
  onAddOption?: () => void;
};

const EmptyState = ({
  onAddOption,
}: EmptyStateProps) => (
  <div className="rounded-2xl border border-dashed border-black/10 bg-black/[0.02] p-8 text-center">
    <div
      className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-primary) 10%, transparent)",
        color: "var(--color-primary)",
      }}
    >
      <Plus size={18} />
    </div>

    <p className="mt-3 text-sm font-semibold text-gray-700">
      No characteristics configured
    </p>

    <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-gray-400">
      This product does not currently have any
      tenant-defined characteristics.
    </p>

    {onAddOption && (
      <button
        type="button"
        onClick={onAddOption}
        className="mt-4 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-[var(--color-primary-foreground)]"
        style={{
          backgroundColor:
            "var(--color-primary)",
        }}
      >
        <Plus size={14} />
        Add characteristic
      </button>
    )}
  </div>
);

export default ProductOptionsEditor;