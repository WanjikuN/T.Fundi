import { useState } from "react";

import {
  Check,
  ChevronDown,
  RotateCcw,
  Save,
} from "lucide-react";

import { toast } from "sonner";

import {
  DEFAULT_CATEGORIES,
  useTenant,
} from "../../../app/providers/TenantProvider";

import type {
  ProductCategory,
} from "../types/catalog.types";

import TenantCharacteristicsEditor from "../components/TenantCharacteristicsEditor";

/* =========================================================
   CATEGORY LABELS
   ========================================================= */

const CATEGORY_LABELS: Record<
  ProductCategory,
  string
> = {
  sofas: "Sofas",
  chairs: "Chairs",
  tables: "Tables",
  beds: "Beds",
  storage: "Storage",
  outdoor: "Outdoor",
  lighting: "Lighting",
  desks: "Desks",
  other: "Other",
};

/* =========================================================
   PAGE
   ========================================================= */

const CatalogSettingsPage = () => {
  const {
    catalogSettings,

    updateCatalogSetting,

    toggleCatalogCategory,

    setCatalogCharacteristics,

    saveCatalogSettings,

    resetCatalogSettings,

    hasUnsavedCatalogChanges,

    isSavingCatalog,
  } = useTenant();

  const [showCategories, setShowCategories] =
    useState(true);

  const [showCharacteristics, setShowCharacteristics] =
    useState(true);

  const [showRules, setShowRules] =
    useState(true);

  /* =======================================================
     SETTINGS
     ======================================================= */

  const categories =
    catalogSettings.categories ??
    DEFAULT_CATEGORIES;

  const characteristics =
    catalogSettings.characteristics ??
    [];

  /* =======================================================
     SAVE
     ======================================================= */

  const handleSave = async () => {
    try {
      await saveCatalogSettings();

      toast.success(
        "Catalog settings saved.",
        {
          description:
            "Your tenant catalog configuration has been updated.",
        },
      );
    } catch (error) {
      toast.error(
        "Unable to save catalog settings.",
        {
          description:
            error instanceof Error
              ? error.message
              : "Please try again.",
        },
      );
    }
  };

  /* =======================================================
     RESET
     ======================================================= */

  const handleReset = () => {
    if (!hasUnsavedCatalogChanges) {
      return;
    }

    resetCatalogSettings();

    toast.success(
      "Catalog changes discarded.",
    );
  };

  /* =======================================================
     CURRENCY
     ======================================================= */

  const handleCurrencyChange = (
    value: string,
  ) => {
    updateCatalogSetting(
      "defaultCurrency",
      value
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 3)
        .toUpperCase(),
    );
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
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{
              color:
                "var(--color-primary)",
            }}
          >
            Catalog configuration
          </p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Catalog Settings
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Configure how this tenant creates,
                analyses and manages products.
              </p>
            </div>

            {hasUnsavedCatalogChanges && (
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

                Unsaved changes
              </span>
            )}
          </div>
        </header>

        {/* =================================================
            CONTENT
            ================================================= */}

        <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="space-y-4 pb-6">

            {/* =================================================
                CATEGORIES
                ================================================= */}

            <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">

              <button
                type="button"
                onClick={() =>
                  setShowCategories(
                    (current) =>
                      !current,
                  )
                }
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.18em]"
                    style={{
                      color:
                        "var(--color-primary)",
                    }}
                  >
                    Product structure
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    Catalog categories
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Choose which standard categories
                    this tenant uses.
                  </p>
                </div>

                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition ${
                    showCategories
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {showCategories && (
                <>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {DEFAULT_CATEGORIES.map(
                      (category) => {
                        const enabled =
                          categories.includes(
                            category,
                          );

                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() =>
                              toggleCatalogCategory(
                                category,
                              )
                            }
                            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                              enabled
                                ? "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/[0.04] text-gray-900"
                                : "border-black/10 bg-white text-gray-400 hover:bg-black/[0.02]"
                            }`}
                          >
                            <span>
                              {
                                CATEGORY_LABELS[
                                  category
                                ]
                              }
                            </span>

                            {enabled && (
                              <Check
                                size={16}
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

                  <div className="mt-5 border-t border-black/[0.06] pt-5">
                    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-black/10 p-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Allow custom categories
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-400">
                          Allow this tenant to create
                          categories outside the
                          standard list.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={
                          catalogSettings.allowCustomCategories ??
                          false
                        }
                        onChange={(event) =>
                          updateCatalogSetting(
                            "allowCustomCategories",
                            event.target.checked,
                          )
                        }
                        className="h-4 w-4 accent-[var(--color-primary)]"
                      />
                    </label>
                  </div>
                </>
              )}
            </section>

            {/* =================================================
                CHARACTERISTICS
                ================================================= */}

            <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">

              <button
                type="button"
                onClick={() =>
                  setShowCharacteristics(
                    (current) =>
                      !current,
                  )
                }
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.18em]"
                    style={{
                      color:
                        "var(--color-primary)",
                    }}
                  >
                    Product schema
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    Product characteristics
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Define what this tenant wants to
                    capture about its products.
                  </p>
                </div>

                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition ${
                    showCharacteristics
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {showCharacteristics && (
                <div className="mt-5">

                  <TenantCharacteristicsEditor
                    characteristics={
                      characteristics
                    }
                    onChange={
                      setCatalogCharacteristics
                    }
                  />

                  <div className="mt-5 border-t border-black/[0.06] pt-5">
                    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-black/10 p-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Allow custom characteristics
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-400">
                          Allow product creators to add
                          characteristics beyond this
                          tenant's configuration.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={
                          catalogSettings.allowCustomCharacteristics ??
                          false
                        }
                        onChange={(event) =>
                          updateCatalogSetting(
                            "allowCustomCharacteristics",
                            event.target.checked,
                          )
                        }
                        className="h-4 w-4 accent-[var(--color-primary)]"
                      />
                    </label>
                  </div>

                </div>
              )}
            </section>

            {/* =================================================
                RULES
                ================================================= */}

            <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">

              <button
                type="button"
                onClick={() =>
                  setShowRules(
                    (current) =>
                      !current,
                  )
                }
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.18em]"
                    style={{
                      color:
                        "var(--color-primary)",
                    }}
                  >
                    Catalog behaviour
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    Product rules
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Control the information required when
                    products are created.
                  </p>
                </div>

                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition ${
                    showRules
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {showRules && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">

                  <RuleToggle
                    label="Require price"
                    description="Products must have a price before they can be published."
                    checked={
                      catalogSettings.requirePrice ??
                      false
                    }
                    onChange={(checked) =>
                      updateCatalogSetting(
                        "requirePrice",
                        checked,
                      )
                    }
                  />

                  <RuleToggle
                    label="Require dimensions"
                    description="Products must have width, depth and height before they can be published."
                    checked={
                      catalogSettings.requireDimensions ??
                      false
                    }
                    onChange={(checked) =>
                      updateCatalogSetting(
                        "requireDimensions",
                        checked,
                      )
                    }
                  />

                  <div className="rounded-xl border border-black/10 p-4">

                    <label className="text-sm font-semibold text-gray-800">
                      Default currency
                    </label>

                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      Used automatically for new
                      products.
                    </p>

                    <input
                      value={
                        catalogSettings.defaultCurrency ??
                        ""
                      }
                      onChange={(event) =>
                        handleCurrencyChange(
                          event.target.value,
                        )
                      }
                      maxLength={3}
                      className="mt-3 h-10 w-full rounded-lg border border-black/10 px-3 text-sm font-semibold uppercase outline-none focus:border-[var(--color-primary)]"
                      placeholder="KES"
                    />

                  </div>

                </div>
              )}
            </section>

          </div>
        </div>

        {/* =================================================
            FOOTER
            ================================================= */}

        <footer className="shrink-0 border-t border-black/10 bg-[var(--color-background)] pt-3">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-gray-400">
              These settings apply to this tenant's
              catalog and AI product workflow.
            </p>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={handleReset}
                disabled={
                  !hasUnsavedCatalogChanges ||
                  isSavingCatalog
                }
                className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-bold text-gray-600 transition hover:bg-black/[0.02] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw size={14} />

                Reset
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={
                  !hasUnsavedCatalogChanges ||
                  isSavingCatalog
                }
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-[var(--color-primary-foreground)] transition disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  backgroundColor:
                    "var(--color-primary)",
                }}
              >
                <Save size={14} />

                {isSavingCatalog
                  ? "Saving..."
                  : "Save Catalog Settings"}
              </button>

            </div>
          </div>
        </footer>

      </div>
    </main>
  );
};

/* =========================================================
   RULE TOGGLE
   ========================================================= */

type RuleToggleProps = {
  label: string;

  description: string;

  checked: boolean;

  onChange: (
    checked: boolean,
  ) => void;
};

const RuleToggle = ({
  label,
  description,
  checked,
  onChange,
}: RuleToggleProps) => (
  <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-black/10 p-4 transition hover:bg-black/[0.01]">

    <div>
      <p className="text-sm font-semibold text-gray-800">
        {label}
      </p>

      <p className="mt-1 text-xs leading-5 text-gray-400">
        {description}
      </p>
    </div>

    <input
      type="checkbox"
      checked={checked}
      onChange={(event) =>
        onChange(
          event.target.checked,
        )
      }
      className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
    />

  </label>
);

export default CatalogSettingsPage;