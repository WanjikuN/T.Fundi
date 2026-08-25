import { Check } from "lucide-react";

import type {
  ProductOption,
  ProductOptionValue,
} from "../types/catalog.types";

type ProductOptionsSelectorProps = {
  options: ProductOption[];
  selectedOptions: Record<string, string>;
  onChange: (optionId: string, valueId: string) => void;
};

const ProductOptionsSelector = ({
  options,
  selectedOptions,
  onChange,
}: ProductOptionsSelectorProps) => {
  if (!options.length) {
    return null;
  }

  return (
    <div className="space-y-7">
      {options.map((option) => {
        const selectedValueId = selectedOptions[option.id];

        const selectedValue = option.values.find(
          (value) => value.id === selectedValueId,
        );

        return (
          <section key={option.id}>
            {/* ================================================= */}
            {/* OPTION HEADER */}
            {/* ================================================= */}

            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {option.name}
                  {option.required && (
                    <span className="ml-1 text-[var(--color-primary)]">
                      *
                    </span>
                  )}
                </h2>

                {selectedValue?.description && (
                  <p className="mt-1 text-xs text-gray-500">
                    {selectedValue.description}
                  </p>
                )}
              </div>

              {selectedValue && (
                <span className="shrink-0 text-sm text-gray-500">
                  {selectedValue.name}
                </span>
              )}
            </div>

            {/* ================================================= */}
            {/* VALUES */}
            {/* ================================================= */}

            <div className="mt-4 flex flex-wrap gap-3">
              {option.values
                .filter((value) => value.active !== false)
                .map((value) => (
                  <OptionValue
                    key={value.id}
                    option={option}
                    value={value}
                    selected={value.id === selectedValueId}
                    onClick={() =>
                      onChange(option.id, value.id)
                    }
                  />
                ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

/* =========================================================
   OPTION VALUE
   ========================================================= */

type OptionValueProps = {
  option: ProductOption;
  value: ProductOptionValue;
  selected: boolean;
  onClick: () => void;
};

const OptionValue = ({
  option,
  value,
  selected,
  onClick,
}: OptionValueProps) => {
  /*
   * IMAGE OPTIONS
   *
   * Tenant can configure things like:
   *
   * Upholstery
   * Fabric
   * Stone
   * Pattern
   * Wood sample
   */

  const hasImage =
    option.type === "image" &&
    Boolean(value.imageUrl);

  /*
   * COLOR OPTIONS
   */

  const isColor =
    option.type === "color" ||
    Boolean(value.hexCode);

  /*
   * MATERIAL / FINISH / SIZE / SELECT
   *
   * These remain visual buttons.
   */

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative overflow-hidden rounded-2xl border",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--color-primary)]/40",

        selected
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/[0.04] ring-2 ring-[var(--color-primary)]/10"
          : "border-black/10 bg-white hover:border-black/20 hover:bg-black/[0.02]",
      ].join(" ")}
    >
      {/* ================================================= */}
      {/* IMAGE */}
      {/* ================================================= */}

      {hasImage ? (
        <div className="flex items-center gap-3 px-4 py-3">
          <img
            src={value.imageUrl}
            alt={value.name}
            className="h-12 w-12 rounded-xl object-cover"
          />

          <OptionLabel value={value} />
        </div>
      ) : (
        <div className="flex min-w-[140px] items-center gap-3 px-4 py-3">
          {/* ================================================= */}
          {/* COLOR / MATERIAL SWATCH */}
          {/* ================================================= */}

          {isColor && (
            <span
              className="h-8 w-8 shrink-0 rounded-full border border-black/10 shadow-inner"
              style={{
                backgroundColor:
                  value.hexCode ??
                  value.color ??
                  "#d1d5db",
              }}
            />
          )}

          {/* ================================================= */}
          {/* NORMAL OPTION */}
          {/* ================================================= */}

          {!isColor && (
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-xs font-semibold text-gray-500"
            >
              {value.name.charAt(0).toUpperCase()}
            </span>
          )}

          <OptionLabel value={value} />
        </div>
      )}

      {/* ================================================= */}
      {/* SELECTED */}
      {/* ================================================= */}

      {selected && (
        <span
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-sm"
          style={{
            backgroundColor:
              "var(--color-primary)",
          }}
        >
          <Check size={14} strokeWidth={2.5} />
        </span>
      )}
    </button>
  );
};

/* =========================================================
   LABEL
   ========================================================= */

const OptionLabel = ({
  value,
}: {
  value: ProductOptionValue;
}) => {
  return (
    <span className="min-w-0 text-left">
      <span className="block text-sm font-semibold text-gray-900">
        {value.name}
      </span>

      {value.description && (
        <span className="mt-0.5 block max-w-[180px] truncate text-xs text-gray-500">
          {value.description}
        </span>
      )}
    </span>
  );
};

export default ProductOptionsSelector;