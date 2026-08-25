import {
  Check,
  Plus,
  Trash2,
} from "lucide-react";

import type {
  ProductOption,
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
};

const ProductOptionsEditor = ({
  options,
  selectedValues,
  onChange,
  onRemoveOption,
  onAddValue,
}: Props) => {
  return (
    <div>
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
          Review characteristic values
        </h2>

        <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">
          These values come from the tenant's
          configuration. AI has selected the most
          likely values from the product photos.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {options.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 p-6 text-center">
            <p className="text-sm font-medium text-gray-600">
              No product characteristics
            </p>
          </div>
        ) : (
          options.map((option) => (
            <Option
              key={option.id}
              option={option}
              selectedValue={
                selectedValues[option.id]
              }
              onChange={onChange}
              onRemove={
                onRemoveOption
                  ? () =>
                      onRemoveOption(
                        option.id,
                      )
                  : undefined
              }
              onAddValue={onAddValue}
            />
          ))
        )}
      </div>
    </div>
  );
};

type OptionProps = {
  option: ProductOption;

  selectedValue?: string;

  onChange: (
    optionId: string,
    valueId: string,
  ) => void;

  onRemove?: () => void;

  onAddValue?: (
    optionId: string,
  ) => void;
};

const Option = ({
  option,
  selectedValue,
  onChange,
  onRemove,
  onAddValue,
}: OptionProps) => {
  const isFreeInput =
    option.type === "text" ||
    option.type === "number";

  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.015] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">
              {option.name}
            </h3>

            {option.required && (
              <span className="rounded-full bg-black/[0.04] px-2 py-1 text-[10px] font-medium text-gray-500">
                Required
              </span>
            )}
          </div>

          <p className="mt-1 text-[11px] capitalize text-gray-400">
            {option.type}
          </p>
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {isFreeInput ? (
        <input
          type={
            option.type === "number"
              ? "number"
              : "text"
          }
          value={selectedValue ?? ""}
          onChange={(event) =>
            onChange(
              option.id,
              event.target.value,
            )
          }
          placeholder={`Enter ${option.name.toLowerCase()}`}
          className="mt-4 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--color-primary)]"
        />
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {option.values.map((value) => {
            const selected =
              selectedValue === value.id;

            return (
              <button
                key={value.id}
                type="button"
                onClick={() =>
                  onChange(
                    option.id,
                    value.id,
                  )
                }
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition ${
                  selected
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/[0.07]"
                    : "border-black/10 bg-white hover:border-black/20"
                }`}
              >
                {option.type === "color" &&
                  value.hexCode && (
                    <span
                      className="h-5 w-5 rounded-full border border-black/10"
                      style={{
                        backgroundColor:
                          value.hexCode,
                      }}
                    />
                  )}

                {option.type === "image" &&
                  value.imageUrl && (
                    <img
                      src={value.imageUrl}
                      alt={value.name}
                      className="h-7 w-7 rounded-lg object-cover"
                    />
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
            );
          })}

          {onAddValue && (
            <button
              type="button"
              onClick={() =>
                onAddValue(option.id)
              }
              className="inline-flex items-center gap-1 rounded-xl border border-dashed border-black/15 px-3 py-2.5 text-xs font-medium text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              <Plus size={13} />
              Add value
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductOptionsEditor;