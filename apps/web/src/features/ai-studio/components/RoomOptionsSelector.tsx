import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "../../catalog/types/catalog.types";

type Props = {
  product: Product;
  selectedOptions: Record<string, string>;
  onChange: (options: Record<string, string>) => void;
  onBack: () => void;
  onContinue: () => void;
};

const RoomOptionsSelector = ({
  product,
  selectedOptions,
  onChange,
  onBack,
  onContinue,
}: Props) => {
  const activeOptions = useMemo(
    () => product.options ?? [],
    [product.options],
  );

  const requiredOptions = activeOptions.filter((option) => option.required);

  const canContinue = requiredOptions.every((option) =>
    Boolean(selectedOptions[option.id]),
  );

  const selectValue = (optionId: string, valueId: string) => {
    onChange({
      ...selectedOptions,
      [optionId]: valueId,
    });
  };
  
  return ( 
    <div className="mx-auto flex h-full max-w-5xl flex-col">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-bold">Customize your {product.name}</h2>

        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Choose from the options available for this product.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {activeOptions.length === 0 ? (
          <div className="rounded-2xl border border-[var(--color-border)] p-6">
            <p className="font-medium">No customization options</p>

            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              This product will be visualized using its default configuration.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeOptions.map((option) => {
              const values = option.values ?? [];

              return (
                <section
                  key={option.id}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
                >
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{option.name}</h3>

                      {option.required && (
                        <span className="text-xs text-[var(--color-primary)]">
                          Required
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {values
                      .filter((value) => value.active !== false)
                      .map((value) => {
                        const selected =
                          selectedOptions[option.id] === value.id;

                        return (
                          <button
                            key={value.id}
                            type="button"
                            onClick={() => selectValue(option.id, value.id)}
                            className={`relative rounded-xl border p-3 text-left transition ${
                              selected
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-2 ring-[var(--color-primary)]/10"
                                : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {value.color ? (
                                <span
                                  className="h-9 w-9 shrink-0 rounded-lg border border-black/10"
                                  style={{
                                    backgroundColor: value.color,
                                  }}
                                />
                              ) : value.images?.[0] ? (
                                <img
                                  src={value.images[0]}
                                  alt=""
                                  className="h-9 w-9 rounded-lg object-cover"
                                />
                              ) : (
                                <span className="h-9 w-9 rounded-lg bg-[var(--color-muted)]" />
                              )}

                              <span className="min-w-0">
                                <span className="block truncate text-sm font-medium">
                                  {value.name}
                                </span>

                                {value.description && (
                                  <span className="mt-0.5 block truncate text-xs text-[var(--color-muted-foreground)]">
                                    {value.description}
                                  </span>
                                )}
                              </span>

                              {selected && (
                                <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                                  <Check size={13} />
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 flex shrink-0 items-center justify-between gap-3 border-t border-[var(--color-border)] pt-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Visualize
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default RoomOptionsSelector;
