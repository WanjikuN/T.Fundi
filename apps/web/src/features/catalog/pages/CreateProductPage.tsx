import {
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import ProductImageUploader from "../components/ProductImageUploader";
import AIProductAnalysis from "../components/AIProductAnalysis";
import TenantCharacteristicsEditor from "../components/TenantCharacteristicsEditor";

import {
  analyseProduct,
} from "../api/aiProduct.api";

import type {
  AIProductAnalysis as Analysis,
  TenantCharacteristic,
} from "../types/catalog.types";

const CreateProductPage = () => {
  const navigate = useNavigate();

  const [images, setImages] =
    useState<File[]>([]);

  const [characteristics, setCharacteristics] =
    useState<TenantCharacteristic[]>([
      {
        id: "wood-species",
        name: "Wood Species",
        type: "material",
        required: false,
        active: true,
        values: [
          {
            id: "natural-oak",
            name: "Natural Oak",
            active: true,
          },
          {
            id: "walnut",
            name: "Walnut",
            active: true,
          },
        ],
      },

      {
        id: "upholstery",
        name: "Upholstery",
        type: "select",
        required: false,
        active: true,
        values: [
          {
            id: "charcoal",
            name: "Charcoal",
            active: true,
          },
          {
            id: "cream",
            name: "Cream",
            active: true,
          },
        ],
      },

      {
        id: "finish",
        name: "Finish",
        type: "finish",
        required: false,
        active: true,
        values: [
          {
            id: "matte",
            name: "Matte",
            active: true,
          },
          {
            id: "natural",
            name: "Natural",
            active: true,
          },
        ],
      },
    ]);

  const [analysis, setAnalysis] =
    useState<Analysis>();

  const [isAnalysing, setIsAnalysing] =
    useState(false);

  const canAnalyse =
    images.length > 0 &&
    !isAnalysing;

  const activeCharacteristics =
    useMemo(
      () =>
        characteristics.filter(
          (characteristic) =>
            characteristic.active !== false,
        ),
      [characteristics],
    );

  const handleAnalyse = async () => {
    if (!images.length || isAnalysing) {
      return;
    }

    setIsAnalysing(true);
    setAnalysis(undefined);

    try {
      const response =
        await analyseProduct({
          images,

          characteristics:
            activeCharacteristics,
        });

      setAnalysis(
        response.analysis,
      );

      navigate(
        "/catalog/products/new/review",
        {
          state: {
            draft: response.draft,
            analysis:
              response.analysis,
            images,
          },
        },
      );
    } catch (error) {
      console.error(
        "Product analysis failed:",
        error,
      );
    } finally {
      setIsAnalysing(false);
    }
  };

  return (
    <main className="h-[calc(100vh-4rem)] overflow-hidden bg-[var(--color-background)]">
      <div className="mx-auto flex h-full max-w-[1500px] flex-col px-4 py-5 sm:px-6 lg:px-8">
        {/* HEADER */}

        <header className="shrink-0">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={17} />
            Back to catalog
          </Link>

          <div className="mt-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor:
                    "var(--color-primary)",
                }}
              >
                <Sparkles
                  size={20}
                  className="text-[var(--color-primary-foreground)]"
                />
              </div>

              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{
                    color:
                      "var(--color-primary)",
                  }}
                >
                  AI Product Studio
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Create a furniture product
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
              Define what matters for your furniture
              business, upload product photos and let
              AI prepare the listing for you.
            </p>
          </div>
        </header>

        {/* WORKSPACE */}

        <div className="mt-5 grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_430px]">
          {/* LEFT */}

          <section className="min-h-0 overflow-y-auto pr-1 lg:pr-3">
            <div className="space-y-5 pb-8">
              {/* CHARACTERISTICS */}

              <TenantCharacteristicsEditor
                characteristics={
                  characteristics
                }
                onChange={
                  setCharacteristics
                }
              />

              {/* UPLOAD */}

              <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.18em]"
                    style={{
                      color:
                        "var(--color-primary)",
                    }}
                  >
                    Product photos
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    Upload your furniture
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    AI will use your photos together
                    with the characteristics configured
                    above.
                  </p>
                </div>

                <div className="mt-5">
                  <ProductImageUploader
                    images={images}
                    onChange={setImages}
                  />
                </div>

                <button
                  type="button"
                  disabled={!canAnalyse}
                  onClick={handleAnalyse}
                  className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-[var(--color-primary-foreground)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor:
                      "var(--color-primary)",
                  }}
                >
                  <Sparkles size={18} />

                  {isAnalysing
                    ? "Analysing product..."
                    : "Generate with AI"}

                  {!isAnalysing && (
                    <ArrowRight size={17} />
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-gray-400">
                  AI suggestions can be edited before
                  the product is published.
                </p>
              </section>
            </div>
          </section>

          {/* RIGHT */}

          <aside className="hidden min-h-0 overflow-y-auto lg:block">
            {isAnalysing ? (
              <AIProductAnalysis
                isProcessing
              />
            ) : analysis ? (
              <AIProductAnalysis
                analysis={analysis}
              />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-black/10 bg-black/[0.015] p-8 text-center">
                <div>
                  <Sparkles
                    size={30}
                    className="mx-auto text-gray-300"
                  />

                  <h2 className="mt-4 text-sm font-semibold text-gray-700">
                    AI results will appear here
                  </h2>

                  <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-gray-400">
                    Configure your product
                    characteristics and upload photos
                    to begin.
                  </p>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CreateProductPage;