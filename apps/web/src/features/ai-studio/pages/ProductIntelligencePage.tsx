import { useState } from "react";
import type { ChangeEvent } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AIProductAnalysis from "../../catalog/components/AIProductAnalysis";
import { analyseProduct } from "../../catalog/api/aiProduct.api";
import type {
  AIProductAnalysisResponse,
  TenantCharacteristic,
} from "../../catalog/types/catalog.types";
import { useTenant } from "../../../app/providers/TenantProvider";

const UploadStage = ({
  images,
  onUpload,
  onAnalyse,
}: {
  images: string[];
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onAnalyse: () => void;
}) => (
  <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
    {/* Header */}
    <div className="mb-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          {images.length == 0 && (
            <div className="flex items-center gap-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                  color: "var(--color-primary)",
                }}
              >
                <Sparkles size={18} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Product images
                </h2>

                <p className="text-xs text-gray-500">
                  Give AI enough visual information to understand your product.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Upload area */}
    <label
      className={`group relative flex min-h-55 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${
        images.length > 0
          ? "border-black/10 bg-gray-50/50 hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/[0.02]"
          : "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/[0.025] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/[0.05]"
      }`}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl transition group-hover:scale-105"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-primary) 10%, transparent)",
          color: "var(--color-primary)",
        }}
      >
        <ImagePlus size={25} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-gray-900">
        {images.length > 0
          ? "Add more product images"
          : "Upload your product images"}
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-gray-500">
        Use clear photos from different angles. Front, side, back and detail
        shots help AI understand your product better.
      </p>

      <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-xs font-semibold text-white transition group-hover:opacity-90">
        <ImagePlus size={15} />
        Choose images
      </span>

      <p className="mt-2 text-[11px] text-gray-400">
        PNG, JPG or WEBP · Multiple images supported
      </p>

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        onChange={onUpload}
        className="hidden"
      />
    </label>

    {/* Image previews */}
    {images.length > 0 && (
      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Uploaded images
            </h3>

            <p className="text-xs text-gray-500">
              Review your images before analysis.
            </p>
          </div>

          <span className="text-xs text-gray-400">
            {images.length} selected
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-black/10 bg-gray-100"
            >
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />

              {/* Image number */}
              <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-[10px] font-semibold text-white backdrop-blur-sm">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Analyse CTA */}
        <div className="mt-5 rounded-2xl border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/[0.03] p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Ready to analyse?
              </p>

              <p className="mt-0.5 text-xs text-gray-500">
                AI will identify product characteristics, dimensions, materials
                and available options.
              </p>
            </div>

            <button
              type="button"
              onClick={onAnalyse}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-[0.98]"
            >
              <Sparkles size={16} />
              Analyse product
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

type StudioStep = "upload" | "analysing" | "analysis";

const ProductIntelligencePage = () => {
  const navigate = useNavigate();
  const { tenant, catalogSettings } = useTenant();

  const [step, setStep] = useState<StudioStep>("upload");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<AIProductAnalysisResponse | null>(
    null,
  );

  const characteristics: TenantCharacteristic[] =
    catalogSettings.characteristics.filter(
      (characteristic) => characteristic.active !== false,
    );

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    const validFiles = files.filter((file) =>
      ["image/png", "image/jpeg", "image/webp"].includes(file.type),
    );

    if (!validFiles.length) {
      return;
    }

    setImageFiles((current) => [...current, ...validFiles]);

    const urls = validFiles.map((file) => URL.createObjectURL(file));

    setImageUrls((current) => [...current, ...urls]);

    event.target.value = "";
  };

  const handleAnalyse = async () => {
    if (!imageFiles.length) {
      return;
    }

    setStep("analysing");

    try {
      const result = await analyseProduct({
        images: imageFiles,
        tenantId: tenant?.id,
        characteristics,
      });

      setAnalysis(result);
      setStep("analysis");
    } catch (error) {
      console.error("AI product analysis failed:", error);
      setStep("upload");
    }
  };

  const handleContinueToReview = () => {
    if (!analysis) {
      return;
    }

    navigate("/catalog/products/new/review", {
      state: {
        draft: analysis.draft,
        analysis: analysis.analysis,
        images: imageFiles,
        imageUrls,
      },
    });
  };

  if (!tenant) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">Workspace unavailable</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't determine the workspace for this AI Studio session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex cursor-pointer h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)]"
              aria-label="Go back"
            >
              <ArrowLeft size={17} />
            </button>

            <div>
              <h1 className="font-semibold">Product Intelligence</h1>
            </div>
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">
            Turn product images into catalogue-ready products
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Upload product images and let AI identify the product, dimensions
            and characteristics configured for your workspace.
          </p>
        </header>

        {step === "upload" && (
          <div className="h-[65vh] overflow-auto">
            <UploadStage
              images={imageUrls}
              onUpload={handleImageUpload}
              onAnalyse={handleAnalyse}
            />
          </div>
        )}

        {step === "analysing" && <AIProductAnalysis isProcessing />}

        {step === "analysis" && analysis && (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <AIProductAnalysis analysis={analysis.analysis} />

            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">
                Analysis complete
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Review the detected information before creating the catalogue
                product.
              </p>

              <button
                type="button"
                onClick={handleContinueToReview}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Review product
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductIntelligencePage;
