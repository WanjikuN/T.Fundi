import { Check } from "lucide-react";

type ProductMaterial = {
  id: string;
  name: string;
  hexCode?: string | null;
  color?: string | null;
};

type MaterialSelectorProps = {
  materials: ProductMaterial[];
  selectedMaterialId: string;
  onChange: (materialId: string) => void;
};

const MaterialSelector = ({
  materials,
  selectedMaterialId,
  onChange,
}: MaterialSelectorProps) => {
  const selectedMaterial = materials.find(
    (material) => material.id === selectedMaterialId,
  );

  if (!materials.length) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Material / Finish
        </h2>

        <span className="text-sm text-gray-500">
          {selectedMaterial?.name ?? "Select a finish"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {materials.map((material) => {
          const isSelected =
            material.id === selectedMaterialId;

          return (
            <button
              key={material.id}
              type="button"
              onClick={() => onChange(material.id)}
              aria-pressed={isSelected}
              className={`group relative flex min-w-[150px] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                isSelected
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/[0.04] ring-2 ring-[var(--color-primary)]/10"
                  : "border-black/10 bg-white hover:border-black/20 hover:bg-black/[0.02]"
              }`}
            >
              <span
                className="h-8 w-8 shrink-0 rounded-full border border-black/10 shadow-inner"
                style={{
                  backgroundColor:
                    material.hexCode ?? "#d1d5db",
                }}
              />

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-gray-900">
                  {material.name}
                </span>

                {material.color && (
                  <span className="mt-0.5 block truncate text-xs text-gray-500">
                    {material.color}
                  </span>
                )}
              </span>

              {isSelected && (
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                  style={{
                    backgroundColor:
                      "var(--color-primary)",
                  }}
                >
                  <Check size={14} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MaterialSelector;