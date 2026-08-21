import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { themePalettes } from "../constants/palettes";
import { useTenant } from "../../../app/providers/TenantProvider";

const BrandingPage = () => {
  const { tenant, updateBranding, saveBranding, resetBranding } = useTenant();

  if (!tenant) {
    return null;
  }
  const currentColors = {
    primary: tenant.branding.primaryColor,
    secondary: tenant.branding.secondaryColor,
    accent: tenant.branding.accentColor,
  };

  const matchingPalette = themePalettes.find(
    (palette) =>
      palette.colors.primary === currentColors.primary &&
      palette.colors.secondary === currentColors.secondary &&
      palette.colors.accent === currentColors.accent,
  );

  const selectedPaletteId = matchingPalette?.id ?? null;

  const handleColorChange = (
    key: "primaryColor" | "secondaryColor" | "accentColor",
    value: string,
  ) => {
    updateBranding({
      [key]: value,
    });
  };

  const handlePaletteSelect = (palette: (typeof themePalettes)[number]) => {
    updateBranding({
      primaryColor: palette.colors.primary,
      secondaryColor: palette.colors.secondary,
      accentColor: palette.colors.accent,
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:h-[calc(100vh-4rem)] lg:overflow-hidden lg:p-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col lg:h-full lg:min-h-0">
        {/* Header */}
        <header className="shrink-0">
          <div className="mb-4">
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
            >
              <ArrowLeft size={16} />
              Settings
            </Link>
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">Branding</h1>

          <p className="mt-2 text-sm text-[var(--color-muted-foreground)] sm:text-base">
            Customize how your {tenant.name} workspace looks.
          </p>
        </header>

        {/* Main content */}
        <div className="mt-6 grid gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-2">
          {/* Theme settings */}
          <section className="flex min-h-0 flex-col rounded-xl border border-black/10 bg-white p-5 sm:p-6">
            {/* Palette header */}
            <div className="shrink-0">
              <h2 className="text-lg font-semibold">Theme palette</h2>

              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                Choose a starting color palette for your workspace.
              </p>
            </div>

            {/* Palette list */}
            <div className="mt-6 min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2">
              <div className="grid gap-4 sm:grid-cols-2">
                {themePalettes.map((palette) => {
                  const isSelected = selectedPaletteId === palette.id;
                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => handlePaletteSelect(palette)}
                      className={[
                        "w-full rounded-xl border p-4 text-left transition",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30",
                        isSelected
                          ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20"
                          : "border-black/10 hover:border-black/20",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{palette.name}</span>

                        {isSelected && (
                          <span className="shrink-0 text-xs font-medium text-[var(--color-primary)]">
                            Selected
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs leading-5 text-[var(--color-muted-foreground)]">
                        {palette.description}
                      </p>

                      <div className="mt-4 flex gap-2">
                        <span
                          className="h-8 flex-1 rounded-md"
                          style={{
                            backgroundColor: palette.colors.primary,
                          }}
                        />

                        <span
                          className="h-8 flex-1 rounded-md"
                          style={{
                            backgroundColor: palette.colors.secondary,
                          }}
                        />

                        <span
                          className="h-8 flex-1 rounded-md"
                          style={{
                            backgroundColor: palette.colors.accent,
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
             
              </div>
     {/* Custom colors */}
              <div className="mt-6 border-t border-black/10 pt-6">
                <h3 className="text-base font-semibold">Custom colors</h3>

                <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                  Fine-tune the colors for your workspace.
                </p>

                <div className="mt-5 grid gap-5 sm:grid-cols-3">
                  {/* Primary */}
                  <label className="min-w-0 space-y-2">
                    <span className="text-sm font-medium">Primary</span>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={tenant.branding.primaryColor}
                        onChange={(event) =>
                          handleColorChange("primaryColor", event.target.value)
                        }
                        className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-black/10 bg-white p-1"
                      />

                      <span className="truncate text-sm text-[var(--color-muted-foreground)]">
                        {tenant.branding.primaryColor}
                      </span>
                    </div>
                  </label>

                  {/* Secondary */}
                  <label className="min-w-0 space-y-2">
                    <span className="text-sm font-medium">Secondary</span>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={tenant.branding.secondaryColor}
                        onChange={(event) =>
                          handleColorChange(
                            "secondaryColor",
                            event.target.value,
                          )
                        }
                        className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-black/10 bg-white p-1"
                      />

                      <span className="truncate text-sm text-[var(--color-muted-foreground)]">
                        {tenant.branding.secondaryColor}
                      </span>
                    </div>
                  </label>

                  {/* Accent */}
                  <label className="min-w-0 space-y-2">
                    <span className="text-sm font-medium">Accent</span>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={tenant.branding.accentColor}
                        onChange={(event) =>
                          handleColorChange("accentColor", event.target.value)
                        }
                        className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-black/10 bg-white p-1"
                      />

                      <span className="truncate text-sm text-[var(--color-muted-foreground)]">
                        {tenant.branding.accentColor}
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            
            </div>
          </section>

          {/* Preview */}
          <section className="min-h-0 overflow-y-auto rounded-xl border border-black/10 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Preview</h2>

            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Preview how this palette will look in your workspace.
            </p>

            <div className="mt-6 overflow-hidden rounded-xl border border-black/10">
              {/* Preview header */}
              <div
                className="p-5"
                style={{
                  backgroundColor: tenant.branding.primaryColor,
                  color: "#FFFFFF",
                }}
              >
                <p className="text-sm font-medium">{tenant.name}</p>

                <p className="mt-1 text-lg font-bold">Furniture workspace</p>
              </div>

              {/* Preview body */}
              <div className="space-y-4 bg-white p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold">Dashboard</p>

                    <p className="text-sm text-gray-500">
                      Manage your furniture business.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-full shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-white sm:w-auto"
                    style={{
                      backgroundColor: tenant.branding.primaryColor,
                    }}
                  >
                    Add Product
                  </button>
                </div>

                {/* Secondary */}
                <div
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: tenant.branding.secondaryColor,
                  }}
                >
                  <p className="text-sm font-medium">Featured</p>

                  <p className="mt-1 text-sm text-gray-600">
                    Your furniture catalog is ready.
                  </p>
                </div>

                {/* Accent */}
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-medium text-white"
                  style={{
                    backgroundColor: tenant.branding.accentColor,
                  }}
                >
                  New
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 z-20 mt-6 shrink-0 border-t border-black/10 bg-[var(--color-background)] py-4 lg:mt-4">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={resetBranding}
              className="w-full rounded-lg border border-black/10 bg-white px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black/[0.02] sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={saveBranding}
              className="w-full rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-primary-foreground)] transition-opacity hover:opacity-90 sm:w-auto"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingPage;
