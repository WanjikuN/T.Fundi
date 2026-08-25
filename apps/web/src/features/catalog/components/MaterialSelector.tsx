import { Check } from "lucide-react";

type Material = {
  id: string;
  name: string;
  hexCode?: string;
};

type MaterialSelectorProps = {
  materials: Material[];
  selectedMaterialId: string;
  onChange: (materialId: string) => void;
};

const MaterialSelector = ({
  materials,
  selectedMaterialId,
  onChange,
}: MaterialSelectorProps) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">
          Material / Finish
        </h2>

        <span className="text-sm text-gray-500">
          {materials.find(
            (material) => material.id === selectedMaterialId,
          )?.name}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {materials.map((material) => {
          const isSelected = material.id === selectedMaterialId;

          return (
            <button
              key={material.id}
              type="button"
              onClick={() => onChange(material.id)}
              className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                isSelected
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/[0.05] ring-2 ring-[var(--color-primary)]/10"
                  : "border-black/10 hover:border-black/20 hover:bg-black/[0.02]"
              }`}
            >
              <span
                className="h-5 w-5 rounded-full border border-black/10 shadow-inner"
                style={{
                  backgroundColor: material.hexCode ?? "#d1d5db",
                }}
              />

              {material.name}

              {isSelected && (
                <Check
                  size={15}
                  style={{
                    color: "var(--color-primary)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MaterialSelector;