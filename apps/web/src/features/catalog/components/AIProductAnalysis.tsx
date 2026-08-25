import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import type {
  AIProductAnalysis as Analysis,
} from "../types/catalog.types";

type Props = {
  analysis?: Analysis;
  isProcessing?: boolean;
};

const AIProductAnalysis = ({
  analysis,
  isProcessing = false,
}: Props) => {
  if (isProcessing) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-primary) 10%, transparent)",
              color:
                "var(--color-primary)",
            }}
          >
            <Sparkles size={19} />
          </div>

          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{
                color:
                  "var(--color-primary)",
              }}
            >
              AI Product Studio
            </p>

            <h2 className="mt-1 text-base font-semibold text-gray-900">
              Analysing product
            </h2>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-12 animate-pulse rounded-xl bg-black/[0.04]"
              />
            ),
          )}
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          Identifying the product, dimensions
          and tenant-defined characteristics...
        </p>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-white shadow-sm">
      <div className="border-b border-black/[0.06] p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                color:
                  "var(--color-primary)",
              }}
            >
              <Sparkles size={19} />
            </div>

            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{
                  color:
                    "var(--color-primary)",
                }}
              >
                AI Analysis
              </p>

              <h2 className="mt-1 text-base font-semibold text-gray-900">
                Product detected
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
            <CheckCircle2 size={14} />
            {Math.round(
              analysis.confidence * 100,
            )}
            %
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <Result
          label="Detected name"
          value={analysis.detectedName}
        />

        <Result
          label="Category"
          value={analysis.category}
        />

        <Result
          label="Description"
          value={analysis.description}
        />

        <section>
          <p className="text-xs font-semibold text-gray-500">
            Tenant characteristics
          </p>

          {analysis.characteristics
            .length === 0 ? (
            <p className="mt-2 text-xs text-gray-400">
              No tenant characteristics
              were configured or detected.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {analysis.characteristics.map(
                (item, index) => (
                  <div
                    key={`${item.characteristicId ?? item.characteristicName}-${item.value}-${index}`}
                    className="rounded-xl bg-black/[0.025] px-3 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-gray-500">
                        {
                          item.characteristicName
                        }
                      </span>

                      <span className="text-xs font-semibold text-gray-800">
                        {item.value}
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(
                            5,
                            Math.min(
                              100,
                              item.confidence *
                                100,
                            ),
                          )}%`,
                          backgroundColor:
                            "var(--color-primary)",
                        }}
                      />
                    </div>

                    <p className="mt-1 text-[10px] text-gray-400">
                      {Math.round(
                        item.confidence *
                          100,
                      )}
                      % confidence
                    </p>
                  </div>
                ),
              )}
            </div>
          )}
        </section>

        <section>
          <p className="text-xs font-semibold text-gray-500">
            Physical observations
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {analysis.detectedFeatures
              .length > 0 ? (
              analysis.detectedFeatures.map(
                (feature) => (
                  <span
                    key={feature}
                    className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs text-gray-700"
                  >
                    {feature}
                  </span>
                ),
              )
            ) : (
              <span className="text-xs text-gray-400">
                None detected
              </span>
            )}
          </div>
        </section>

        {analysis.dimensions && (
          <section>
            <p className="text-xs font-semibold text-gray-500">
              Estimated dimensions
            </p>

            <div className="mt-2 grid grid-cols-3 gap-2">
              <Dimension
                label="Width"
                value={`${analysis.dimensions.width}${analysis.dimensions.unit}`}
              />

              <Dimension
                label="Depth"
                value={`${analysis.dimensions.depth}${analysis.dimensions.unit}`}
              />

              <Dimension
                label="Height"
                value={`${analysis.dimensions.height}${analysis.dimensions.unit}`}
              />
            </div>
          </section>
        )}

        {analysis.warnings.length > 0 && (
          <section className="space-y-2">
            {analysis.warnings.map(
              (warning) => (
                <div
                  key={warning}
                  className="flex gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-700"
                >
                  <AlertTriangle
                    size={15}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{warning}</span>
                </div>
              ),
            )}
          </section>
        )}
      </div>
    </div>
  );
};

const Result = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div>
    <p className="text-xs font-semibold text-gray-500">
      {label}
    </p>

    <p className="mt-1 text-sm leading-6 text-gray-800">
      {value || "Not detected"}
    </p>
  </div>
);

const Dimension = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-xl bg-black/[0.03] p-3">
    <p className="text-[10px] text-gray-500">
      {label}
    </p>

    <p className="mt-1 text-sm font-semibold text-gray-900">
      {value}
    </p>
  </div>
);

export default AIProductAnalysis;