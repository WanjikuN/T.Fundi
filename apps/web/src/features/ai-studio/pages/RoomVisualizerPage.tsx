import {
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  generateRoomVisualization,
  getSavedDesigns,
  saveDesign,
} from "../api/aiStudio.api";
import RoomOptionsSelector from "../components/RoomOptionsSelector";
import RoomProductSelector from "../components/RoomProductSelector";
import RoomUploadStage from "../components/RoomUploadStage";
import SavedDesignCard from "../components/SavedDesignCard";
import VisualizationPreview from "../components/VisualizationPreview";
import type {
  RoomImage,
  RoomVisualizerStep,
  SavedDesign,
  VisualizationResult,
} from "../types/ai-studio.types";
import { useTenant } from "../../../app/providers/TenantProvider";

const RoomVisualizerPage = () => {
  const { tenant } = useTenant();

  const [step, setStep] =
    useState<RoomVisualizerStep>("upload");

  const [roomImage, setRoomImage] =
    useState<RoomImage>();

  const [selectedProduct, setSelectedProduct] =
    useState<any>();

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>({});

  const [result, setResult] =
    useState<VisualizationResult>();

  const [savedDesigns, setSavedDesigns] =
    useState<SavedDesign[]>([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getSavedDesigns().then(setSavedDesigns);
  }, []);

  if (!tenant) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 text-center">
          <h1 className="text-xl font-semibold">
            Workspace unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">
            We could not resolve the workspace required to use AI
            Studio.
          </p>
        </div>
      </div>
    );
  }

  const reset = () => {
    if (roomImage?.url) {
      URL.revokeObjectURL(roomImage.url);
    }

    setRoomImage(undefined);
    setSelectedProduct(undefined);
    setSelectedOptions({});
    setResult(undefined);
    setStep("upload");
  };

  const handleProductSelected = (product: any) => {
    setSelectedProduct(product);
    setSelectedOptions({});
  };

  const handleGenerate = async () => {
    if (!roomImage || !selectedProduct) {
      return;
    }

    setStep("generating");

    try {
      const generated =
        await generateRoomVisualization({
          roomImage,
          product: selectedProduct,
          selectedOptions,
        });

      setResult(generated);
      setStep("preview");
    } catch {
      setStep("options");
    }
  };

  const handleSave = async () => {
    if (!result || saving) {
      return;
    }

    setSaving(true);

    try {
      const name = `${result.productName} in my room`;

      const saved = await saveDesign(
        result,
        name,
      );

      setSavedDesigns((current) => [
        saved,
        ...current.filter(
          (item) => item.id !== saved.id,
        ),
      ]);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDesign = (id: string) => {
    setSavedDesigns((current) =>
      current.filter((design) => design.id !== id),
    );

    localStorage.setItem(
      "tfundi.ai-studio.saved-designs",
      JSON.stringify(
        savedDesigns.filter(
          (design) => design.id !== id,
        ),
      ),
    );
  };

  const renderStep = () => {
    switch (step) {
      case "upload":
        return (
          <RoomUploadStage
            roomImage={roomImage}
            onChange={setRoomImage}
            onContinue={() => setStep("product")}
          />
        );

      case "product":
        return (
          <RoomProductSelector
            selectedProduct={selectedProduct}
            onSelect={handleProductSelected}
            onContinue={() => setStep("options")}
          />
        );

      case "options":
        if (!selectedProduct) {
          setStep("product");
          return null;
        }

        return (
          <RoomOptionsSelector
            product={selectedProduct}
            selectedOptions={selectedOptions}
            onChange={setSelectedOptions}
            onBack={() => setStep("product")}
            onContinue={() => {
              void handleGenerate();
            }}
          />
        );

      case "generating":
        return (
          <div className="flex h-full min-h-[500px] flex-col items-center justify-center text-center">
            <div className="relative mb-7">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <Sparkles
                  size={34}
                  className="animate-pulse"
                />
              </div>

              <div className="absolute inset-0 animate-ping rounded-3xl bg-[var(--color-primary)]/10" />
            </div>

            <h2 className="text-2xl font-bold">
              Creating your visualization
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--color-muted-foreground)]">
              We are preparing {selectedProduct?.name} for
              your room using the configuration you selected.
            </p>

            <div className="mt-6 h-1.5 w-64 overflow-hidden rounded-full bg-[var(--color-muted)]">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-[var(--color-primary)]" />
            </div>
          </div>
        );

      case "preview":
        if (!result) {
          return null;
        }

        return (
          <VisualizationPreview
            result={result}
            onSave={() => void handleSave()}
            onRestart={reset}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <header className="shrink-0 px-6 py-4 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)]"
              aria-label="Go back"
            >
              <ArrowLeft size={17} />
            </button>

            <div>
              <h1 className="font-semibold">
                Room Visualizer
              </h1>

              <p className="text-xs text-[var(--color-muted-foreground)]">
                Visualize catalogue products in your space
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-xs text-[var(--color-muted-foreground)] sm:flex">
            <span
              className={`h-2 w-2 rounded-full ${
                step === "generating"
                  ? "animate-pulse bg-[var(--color-primary)]"
                  : "bg-green-500"
              }`}
            />

            {step === "generating"
              ? "Generating"
              : "Workspace ready"}
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-6 py-6 lg:px-8">
        <div className="mx-auto min-h-full max-w-7xl">
          {renderStep()}

          {step === "upload" &&
            savedDesigns.length > 0 && (
              <section className="mt-12 border-t border-[var(--color-border)] pt-8">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold">
                    Saved designs
                  </h2>

                  <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                    Designs you have saved from previous
                    visualizations.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {savedDesigns.map((design) => (
                    <SavedDesignCard
                      key={design.id}
                      design={design}
                      onView={() => {
                        setResult(design);
                        setStep("preview");
                      }}
                      onDelete={() =>
                        handleDeleteDesign(design.id)
                      }
                    />
                  ))}
                </div>
              </section>
            )}
        </div>
      </main>

      {saving && (
        <div className="fixed bottom-5 right-5 rounded-xl bg-[var(--color-foreground)] px-4 py-3 text-sm text-[var(--color-background)] shadow-xl">
          Saving design...
        </div>
      )}
    </div>
  );
};

export default RoomVisualizerPage;