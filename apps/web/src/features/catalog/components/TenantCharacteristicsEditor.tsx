import {
  GripVertical,
  Hash,
  Image as ImageIcon,
  List,
  Palette,
  Plus,
  Trash2,
  Type,
} from "lucide-react";

import type {
  TenantCharacteristic,
  TenantCharacteristicType,
  TenantCharacteristicValue,
} from "../types/catalog.types";

type Props = {
  characteristics: TenantCharacteristic[];

  onChange: (characteristics: TenantCharacteristic[]) => void;
};

/* =========================================================
   CHARACTERISTIC TYPES
   ========================================================= */

const CHARACTERISTIC_TYPES: {
  value: TenantCharacteristicType;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "select",
    label: "Select",
    icon: <List size={14} />,
  },
  {
    value: "color",
    label: "Colour",
    icon: <Palette size={14} />,
  },
  {
    value: "material",
    label: "Material",
    icon: <List size={14} />,
  },
  {
    value: "finish",
    label: "Finish",
    icon: <List size={14} />,
  },
  {
    value: "size",
    label: "Size",
    icon: <List size={14} />,
  },
  {
    value: "text",
    label: "Text",
    icon: <Type size={14} />,
  },
  {
    value: "number",
    label: "Number",
    icon: <Hash size={14} />,
  },
  {
    value: "image",
    label: "Image",
    icon: <ImageIcon size={14} />,
  },
];

const VALUE_TYPES: TenantCharacteristicType[] = [
  "select",
  "color",
  "material",
  "finish",
  "size",
];

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/* =========================================================
   COMPONENT
   ========================================================= */

const ProductCharacteristicsEditor = ({ characteristics, onChange }: Props) => {
  /* =======================================================
     ADD CHARACTERISTIC
     ======================================================= */

  const addCharacteristic = () => {
    const characteristic: TenantCharacteristic = {
      id: `product-characteristic-${createId()}`,

      name: "New characteristic",

      type: "select",

      description: "",

      required: false,

      active: true,

      values: [
        {
          id: `value-${createId()}`,
          name: "New value",
          active: true,
        },
      ],

      sequence: characteristics.length,
    };

    onChange([...characteristics, characteristic]);
  };

  /* =======================================================
     UPDATE CHARACTERISTIC
     ======================================================= */

  const updateCharacteristic = (
    id: string,
    updates: Partial<TenantCharacteristic>,
  ) => {
    onChange(
      characteristics.map((characteristic) =>
        characteristic.id === id
          ? {
              ...characteristic,
              ...updates,
            }
          : characteristic,
      ),
    );
  };

  /* =======================================================
     REMOVE CHARACTERISTIC
     ======================================================= */

  const removeCharacteristic = (id: string) => {
    onChange(
      characteristics
        .filter((characteristic) => characteristic.id !== id)
        .map((characteristic, index) => ({
          ...characteristic,
          sequence: index,
        })),
    );
  };

  /* =======================================================
     ADD VALUE
     ======================================================= */

  const addValue = (characteristic: TenantCharacteristic) => {
    const newValue: TenantCharacteristicValue = {
      id: `value-${createId()}`,

      name: "New value",

      active: true,
    };

    updateCharacteristic(characteristic.id, {
      values: [...characteristic.values, newValue],
    });
  };

  /* =======================================================
     UPDATE VALUE
     ======================================================= */

  const updateValue = (
    characteristicId: string,
    valueId: string,
    updates: Partial<TenantCharacteristicValue>,
  ) => {
    const characteristic = characteristics.find(
      (item) => item.id === characteristicId,
    );

    if (!characteristic) {
      return;
    }

    updateCharacteristic(characteristicId, {
      values: characteristic.values.map((value) =>
        value.id === valueId
          ? {
              ...value,
              ...updates,
            }
          : value,
      ),
    });
  };

  /* =======================================================
     REMOVE VALUE
     ======================================================= */

  const removeValue = (characteristicId: string, valueId: string) => {
    const characteristic = characteristics.find(
      (item) => item.id === characteristicId,
    );

    if (!characteristic) {
      return;
    }

    updateCharacteristic(characteristicId, {
      values: characteristic.values.filter((value) => value.id !== valueId),
    });
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{
              color: "var(--color-primary)",
            }}
          >
            Tenant catalog
          </p>

          <h2 className="mt-1 text-lg font-semibold text-gray-900">
            Tenant Catalog Characteristics
          </h2>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">
            Define the characteristics available across this tenant's catalog.
            Products can use these definitions when they are created, edited,
            analysed, and displayed.
          </p>
        </div>

        <button
          type="button"
          onClick={addCharacteristic}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--color-primary-foreground)]"
          style={{
            backgroundColor: "var(--color-primary)",
          }}
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      {/* CHARACTERISTICS */}

      <div className="mt-6 space-y-4">
        {characteristics.length === 0 && (
          <div className="rounded-2xl border border-dashed border-black/10 bg-black/[0.02] p-8 text-center">
            <p className="text-sm font-semibold text-gray-600">
              No catalog characteristics
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-400">
              Add characteristics such as Wood Species, Upholstery,
              Configuration, Leg Style, Cushion Density, or any custom field
              your business needs.
            </p>

            <button
              type="button"
              onClick={addCharacteristic}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--color-primary-foreground)]"
              style={{
                backgroundColor: "var(--color-primary)",
              }}
            >
              <Plus size={14} />
              Add characteristic
            </button>
          </div>
        )}

        {characteristics.map((characteristic, index) => (
          <div
            key={characteristic.id}
            className="rounded-2xl border border-black/10 bg-black/[0.015] p-4"
          >
            <div className="flex items-start gap-3">
              <GripVertical size={17} className="mt-3 shrink-0 text-gray-300" />

              <div className="min-w-0 flex-1">
                {/* MAIN SETTINGS */}

                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_190px_auto]">
                  <input
                    value={characteristic.name}
                    onChange={(event) =>
                      updateCharacteristic(characteristic.id, {
                        name: event.target.value,
                      })
                    }
                    placeholder="Characteristic name"
                    className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm font-medium outline-none focus:border-[var(--color-primary)]"
                  />

                  <div className="relative">
                    <select
                      value={characteristic.type}
                      onChange={(event) => {
                        const type = event.target
                          .value as TenantCharacteristicType;

                        /*
                         * When switching from a
                         * value-based type to a
                         * free-form type, retain
                         * the values in the object.
                         *
                         * This allows the user to
                         * switch back without
                         * unexpectedly losing data.
                         */
                        updateCharacteristic(characteristic.id, {
                          type,
                        });
                      }}
                      className="h-11 w-full appearance-none rounded-xl border border-black/10 bg-white px-3 pr-8 text-sm outline-none focus:border-[var(--color-primary)]"
                    >
                      {CHARACTERISTIC_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCharacteristic(characteristic.id)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label={`Remove ${characteristic.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* DESCRIPTION */}

                <div className="mt-3">
                  <input
                    value={characteristic.description ?? ""}
                    onChange={(event) =>
                      updateCharacteristic(characteristic.id, {
                        description: event.target.value,
                      })
                    }
                    placeholder="Optional instruction or description for this characteristic"
                    className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-xs outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                {/* REQUIRED */}

                <div className="mt-3 flex items-center gap-2">
                  <input
                    id={`required-${characteristic.id}`}
                    type="checkbox"
                    checked={characteristic.required ?? false}
                    onChange={(event) =>
                      updateCharacteristic(characteristic.id, {
                        required: event.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded"
                  />

                  <label
                    htmlFor={`required-${characteristic.id}`}
                    className="text-xs text-gray-600"
                  >
                    Required for this product
                  </label>
                </div>

                {/* VALUES */}

                {VALUE_TYPES.includes(characteristic.type) && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-600">
                          Available values
                        </p>

                        <p className="mt-0.5 text-[10px] text-gray-400">
                          Choose from these values when configuring the product.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => addValue(characteristic)}
                        className="inline-flex items-center gap-1 text-xs font-semibold"
                        style={{
                          color: "var(--color-primary)",
                        }}
                      >
                        <Plus size={13} />
                        Add value
                      </button>
                    </div>

                    <div className="mt-3 space-y-2">
                      {characteristic.values.map((value) => (
                        <div key={value.id} className="flex items-center gap-2">
                          {/* COLOR */}

                          {characteristic.type === "color" && (
                            <input
                              type="color"
                              value={value.hexCode ?? "#cccccc"}
                              onChange={(event) =>
                                updateValue(characteristic.id, value.id, {
                                  hexCode: event.target.value,
                                })
                              }
                              className="h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                              aria-label={`${value.name} colour`}
                            />
                          )}

                          {/* VALUE NAME */}

                          <input
                            value={value.name}
                            onChange={(event) =>
                              updateValue(characteristic.id, value.id, {
                                name: event.target.value,
                              })
                            }
                            placeholder="Value"
                            className="h-10 min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 text-xs outline-none focus:border-[var(--color-primary)]"
                          />

                          {/* VALUE DESCRIPTION */}

                          <input
                            value={value.description ?? ""}
                            onChange={(event) =>
                              updateValue(characteristic.id, value.id, {
                                description: event.target.value,
                              })
                            }
                            placeholder="Description"
                            className="hidden h-10 min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 text-xs outline-none focus:border-[var(--color-primary)] md:block"
                          />

                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() =>
                              removeValue(characteristic.id, value.id)
                            }
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500"
                            aria-label={`Remove ${value.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}

                      {!characteristic.values.length && (
                        <div className="rounded-xl bg-white p-3 text-xs text-gray-400">
                          No values configured. Add a value above.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* FREE FORM HELP */}

                {characteristic.type === "text" && (
                  <p className="mt-4 rounded-xl bg-white p-3 text-xs leading-5 text-gray-500">
                    The product creator will enter a text value for this
                    characteristic.
                  </p>
                )}

                {characteristic.type === "number" && (
                  <p className="mt-4 rounded-xl bg-white p-3 text-xs leading-5 text-gray-500">
                    The product creator will enter a numeric value for this
                    characteristic.
                  </p>
                )}

                {characteristic.type === "image" && (
                  <p className="mt-4 rounded-xl bg-white p-3 text-xs leading-5 text-gray-500">
                    The product creator will provide an image for this
                    characteristic.
                  </p>
                )}

                {/* FOOTER */}

                <p className="mt-3 text-[10px] text-gray-400">
                  Characteristic {index + 1} · {characteristic.type}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductCharacteristicsEditor;
