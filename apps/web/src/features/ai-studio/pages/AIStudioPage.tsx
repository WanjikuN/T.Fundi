import { useState } from "react";
import type { ChangeEvent } from "react";
import { ArrowRight, ImagePlus, Sparkles } from "lucide-react";
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
  <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
    <div className="rounded-2xl border-2 border-dashed border-black/10 p-8 text-center">
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-primary) 10%, transparent)",
          color: "var(--color-primary)",
        }}
      >
        <ImagePlus size={22} />
      </div>

      <h2 className="mt-4 text-base font-semibold text-gray-900">
        Upload product images
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        Upload clear images from different angles. AI will use them to prepare
        the product information.
      </p>

      <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-black/[0.02]">
        <ImagePlus size={16} />
        Choose images

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={onUpload}
          className="hidden"
        />
      </label>
    </div>

    {images.length > 0 && (
      <div className="mt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="aspect-square overflow-hidden rounded-2xl border border-black/10"
            >
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onAnalyse}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
        >
          <Sparkles size={17} />
          Analyse product
        </button>
      </div>
    )}
  </div>
);

type StudioStep = "upload" | "analysing" | "analysis";

const AIStudioPage = () => {
  const navigate = useNavigate();
  const { tenant, catalogSettings } = useTenant();

  const [step, setStep] = useState<StudioStep>("upload");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [analysis, setAnalysis] =
    useState<AIProductAnalysisResponse | null>(null);

  const characteristics: TenantCharacteristic[] =
    catalogSettings.characteristics.filter(
      (characteristic) => characteristic.active !== false,
    );

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
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

    const urls = validFiles.map((file) =>
      URL.createObjectURL(file),
    );

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
          <h1 className="text-xl font-semibold">
            Workspace unavailable
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't determine the workspace for this AI Studio
            session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex items-center gap-2">
            <Sparkles
              size={17}
              style={{
                color: "var(--color-primary)",
              }}
            />

            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{
                color: "var(--color-primary)",
              }}
            >
              AI Studio
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">
            Turn product images into catalogue-ready products
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Upload product images and let AI identify the product,
            dimensions and characteristics configured for your workspace.
          </p>
        </header>

        {step === "upload" && (
          <UploadStage
            images={imageUrls}
            onUpload={handleImageUpload}
            onAnalyse={handleAnalyse}
          />
        )}

        {step === "analysing" && (
          <AIProductAnalysis isProcessing />
        )}

        {step === "analysis" && analysis && (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <AIProductAnalysis analysis={analysis.analysis} />

            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">
                Analysis complete
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Review the detected information before creating the
                catalogue product.
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

export default AIStudioPage;