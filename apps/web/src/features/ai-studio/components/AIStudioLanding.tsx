import {
  ArrowRight,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import ProductIntelligenceCard from "./ProductIntelligenceCard";
import RoomVisualizerCard from "./RoomVisualizerCard";

type Props = {
  onProductIntelligence: () => void;
  onRoomVisualizer: () => void;
};

const AIStudioLanding = ({
  onProductIntelligence,
  onRoomVisualizer,
}: Props) => {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 px-6 py-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <WandSparkles size={19} />
              </div>

              <span className="text-sm font-medium text-[var(--color-primary)]">
                AI Studio
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight">
              Turn ideas into products and spaces
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-[var(--color-muted-foreground)]">
              Use AI to create catalogue products and visualize
              tenant-approved products inside real spaces.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-muted-foreground)] md:flex">
            <Sparkles size={14} />
            AI-powered workspace
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 ">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Choose an AI workflow
            </h2>

            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Start with your product or start with the customer's
              space.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ProductIntelligenceCard
              onOpen={onProductIntelligence}
            />

            <RoomVisualizerCard
              onOpen={onRoomVisualizer}
            />
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-5">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <Sparkles size={18} />
              </div>

              <div>
                <h3 className="font-medium">
                  Designed around your catalogue
                </h3>

                <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--color-muted-foreground)]">
                  AI Studio uses the products and options available
                  in your workspace. Customers can visualize what
                  you actually sell rather than generating
                  unsupported products, materials or colours.
                </p>
              </div>

              <ArrowRight
                size={18}
                className="ml-auto hidden text-[var(--color-muted-foreground)] md:block"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStudioLanding;