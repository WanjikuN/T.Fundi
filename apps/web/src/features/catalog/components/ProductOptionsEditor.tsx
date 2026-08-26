import {
  Check,
  Trash2,
} from "lucide-react";

import type {
  ProductOption,
} from "../types/catalog.types";

type Props = {
  options: ProductOption[];

  selectedValues: Record<
    string,
    string
  >;

  onChange: (
    optionId: string,
    value: string,
  ) => void;

  onRemove: (
    optionId: string,
  ) => void;

  aiConfidence: Record<
    string,
    number
  >;

  aiDetectedValues: Record<
    string,
    string
  >;
};

const ProductOptionsEditor = ({
  options,
  selectedValues,
  onChange,
  onRemove,
  aiConfidence,
  aiDetectedValues,
}: Props) => {
  if (!options.length) {
    return (
      <div className="rounded-2xl bg-black/[0.025] p-5 text-center">
        <p className="text-sm font-medium text-gray-600">
          No product characteristics configured.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {options.map(
        (option) => {
          const selected =
            selectedValues[
              option.id
            ] ?? "";

          const confidence =
            option.characteristicId
              ? aiConfidence[
                  `option-${option.characteristicId}`
                ]
              : undefined;

          const detected =
            option.characteristicId
              ? aiDetectedValues[
                  `option-${option.characteristicId}`
                ]
              : undefined;

          return (
            <div
              key={option.id}
              className="rounded-2xl border border-black/10 p-4"
            >

              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <p className="text-sm font-semibold text-gray-800">
                      {option.name}
                    </p>

                    {option.required && (
                      <span className="text-[10px] font-bold text-red-500">
                        Required
                      </span>
                    )}

                  </div>

                  {detected && (
                    <p className="mt-1 text-xs text-gray-400">
                      AI detected:{" "}
                      <span className="font-semibold text-gray-600">
                        {detected}
                      </span>
                    </p>
                  )}

                  {confidence !==
                    undefined && (
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      AI confidence{" "}
                      {Math.round(
                        confidence *
                          100,
                      )}
                      %
                    </p>
                  )}

                </div>

                <button
                  type="button"
                  onClick={() =>
                    onRemove(
                      option.id,
                    )
                  }
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remove ${option.name}`}
                >
                  <Trash2 size={15} />
                </button>

              </div>

              {/* TEXT */}

              {option.type ===
                "text" && (
                <input
                  value={selected}
                  onChange={(event) =>
                    onChange(
                      option.id,
                      event.target
                        .value,
                    )
                  }
                  className="mt-4 h-11 w-full rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                  placeholder={`Enter ${option.name.toLowerCase()}`}
                />
              )}

              {/* NUMBER */}

              {option.type ===
                "number" && (
                <input
                  type="number"
                  value={selected}
                  onChange={(event) =>
                    onChange(
                      option.id,
                      event.target
                        .value,
                    )
                  }
                  className="mt-4 h-11 w-full rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                  placeholder={`Enter ${option.name.toLowerCase()}`}
                />
              )}

              {/* SELECT / MATERIAL / FINISH / SIZE */}

              {[
                "select",
                "material",
                "finish",
                "size",
              ].includes(
                option.type,
              ) && (
                <select
                  value={
                    selected
                  }
                  onChange={(event) =>
                    onChange(
                      option.id,
                      event.target
                        .value,
                    )
                  }
                  className="mt-4 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="">
                    Select {option.name}
                  </option>

                  {option.values.map(
                    (value) => (
                      <option
                        key={
                          value.id
                        }
                        value={
                          value.id
                        }
                      >
                        {value.name}
                      </option>
                    ),
                  )}
                </select>
              )}

              {/* COLOR */}

              {option.type ===
                "color" && (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">

                  {option.values.map(
                    (value) => {
                      const active =
                        selected ===
                        value.id;

                      return (
                        <button
                          key={
                            value.id
                          }
                          type="button"
                          onClick={() =>
                            onChange(
                              option.id,
                              value.id,
                            )
                          }
                          className={`flex items-center gap-2 rounded-xl border p-2 text-left transition ${
                            active
                              ? "border-[var(--color-primary)] bg-black/[0.02]"
                              : "border-black/10"
                          }`}
                        >

                          <span
                            className="h-7 w-7 rounded-lg border border-black/10"
                            style={{
                              backgroundColor:
                                value.hexCode ??
                                value.color ??
                                "#ddd",
                            }}
                          />

                          <span className="min-w-0 flex-1 truncate text-xs font-medium text-gray-700">
                            {
                              value.name
                            }
                          </span>

                          {active && (
                            <Check
                              size={
                                14
                              }
                              style={{
                                color:
                                  "var(--color-primary)",
                              }}
                            />
                          )}

                        </button>
                      );
                    },
                  )}

                </div>
              )}

              {/* IMAGE */}

              {option.type ===
                "image" && (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">

                  {option.values.map(
                    (value) => {
                      const active =
                        selected ===
                        value.id;

                      return (
                        <button
                          key={
                            value.id
                          }
                          type="button"
                          onClick={() =>
                            onChange(
                              option.id,
                              value.id,
                            )
                          }
                          className={`overflow-hidden rounded-xl border text-left ${
                            active
                              ? "border-[var(--color-primary)]"
                              : "border-black/10"
                          }`}
                        >

                          {value.imageUrl ? (
                            <img
                              src={
                                value.imageUrl
                              }
                              alt={
                                value.name
                              }
                              className="aspect-square w-full object-cover"
                            />
                          ) : (
                            <div className="flex aspect-square items-center justify-center bg-black/[0.025] text-xs text-gray-400">
                              No image
                            </div>
                          )}

                          <div className="flex items-center justify-between p-2">

                            <span className="truncate text-xs font-medium text-gray-700">
                              {
                                value.name
                              }
                            </span>

                            {active && (
                              <Check
                                size={
                                  14
                                }
                                style={{
                                  color:
                                    "var(--color-primary)",
                                }}
                              />
                            )}

                          </div>

                        </button>
                      );
                    },
                  )}

                </div>
              )}

            </div>
          );
        },
      )}

    </div>
  );
};

export default ProductOptionsEditor;