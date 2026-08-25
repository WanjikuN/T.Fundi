import {
  Plus,
  Trash2,
  GripVertical,
  Palette,
  Type,
  Hash,
  Image as ImageIcon,
  List,
} from "lucide-react";

import type {
  TenantCharacteristic,
  TenantCharacteristicType,
  TenantCharacteristicValue,
} from "../types/catalog.types";

type Props = {
  characteristics: TenantCharacteristic[];

  onChange: (
    characteristics: TenantCharacteristic[],
  ) => void;
};

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

const createId = () =>
  `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

const TenantCharacteristicsEditor = ({
  characteristics,
  onChange,
}: Props) => {
  const addCharacteristic = () => {
    const characteristic: TenantCharacteristic = {
      id: createId(),
      name: "New characteristic",
      type: "select",
      required: false,
      active: true,
      values: [],
      sequence: characteristics.length,
    };

    onChange([
      ...characteristics,
      characteristic,
    ]);
  };

  const updateCharacteristic = (
    id: string,
    updates: Partial<TenantCharacteristic>,
  ) => {
    onChange(
      characteristics.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
            }
          : item,
      ),
    );
  };

  const removeCharacteristic = (
    id: string,
  ) => {
    onChange(
      characteristics.filter(
        (item) => item.id !== id,
      ),
    );
  };

  const addValue = (
    characteristic: TenantCharacteristic,
  ) => {
    const value: TenantCharacteristicValue = {
      id: createId(),
      name: "New value",
      active: true,
    };

    updateCharacteristic(
      characteristic.id,
      {
        values: [
          ...characteristic.values,
          value,
        ],
      },
    );
  };

  const updateValue = (
    characteristicId: string,
    valueId: string,
    updates: Partial<TenantCharacteristicValue>,
  ) => {
    const characteristic =
      characteristics.find(
        (item) =>
          item.id === characteristicId,
      );

    if (!characteristic) return;

    updateCharacteristic(
      characteristicId,
      {
        values:
          characteristic.values.map(
            (value) =>
              value.id === valueId
                ? {
                    ...value,
                    ...updates,
                  }
                : value,
          ),
      },
    );
  };

  const removeValue = (
    characteristicId: string,
    valueId: string,
  ) => {
    const characteristic =
      characteristics.find(
        (item) =>
          item.id === characteristicId,
      );

    if (!characteristic) return;

    updateCharacteristic(
      characteristicId,
      {
        values:
          characteristic.values.filter(
            (value) =>
              value.id !== valueId,
          ),
      },
    );
  };

  return (
    <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{
              color:
                "var(--color-primary)",
            }}
          >
            Tenant configuration
          </p>

          <h2 className="mt-1 text-lg font-semibold text-gray-900">
            Product characteristics
          </h2>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">
            Define the characteristics that matter
            for this product. AI will use these
            definitions when analysing the photos.
          </p>
        </div>

        <button
          type="button"
          onClick={addCharacteristic}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--color-primary-foreground)]"
          style={{
            backgroundColor:
              "var(--color-primary)",
          }}
        >
          <Plus size={14} />
          Add characteristic
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {characteristics.length === 0 && (
          <div className="rounded-2xl border border-dashed border-black/10 bg-black/[0.02] p-8 text-center">
            <p className="text-sm font-semibold text-gray-600">
              No characteristics yet
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Add things such as Wood Species,
              Upholstery, Leg Style or Size.
            </p>
          </div>
        )}

        {characteristics.map(
          (characteristic, index) => (
            <div
              key={characteristic.id}
              className="rounded-2xl border border-black/10 bg-black/[0.015] p-4"
            >
              <div className="flex items-start gap-3">
                <GripVertical
                  size={17}
                  className="mt-3 shrink-0 text-gray-300"
                />

                <div className="min-w-0 flex-1">
                  <div className="grid gap-3 sm:grid-cols-[1fr_190px_auto]">
                    <input
                      value={characteristic.name}
                      onChange={(event) =>
                        updateCharacteristic(
                          characteristic.id,
                          {
                            name: event.target.value,
                          },
                        )
                      }
                      placeholder="Characteristic name"
                      className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm font-medium outline-none focus:border-[var(--color-primary)]"
                    />

                    <div className="relative">
                      <select
                        value={
                          characteristic.type
                        }
                        onChange={(event) =>
                          updateCharacteristic(
                            characteristic.id,
                            {
                              type: event.target
                                .value as TenantCharacteristicType,
                            },
                          )
                        }
                        className="h-11 w-full appearance-none rounded-xl border border-black/10 bg-white px-3 pr-8 text-sm outline-none focus:border-[var(--color-primary)]"
                      >
                        {CHARACTERISTIC_TYPES.map(
                          (type) => (
                            <option
                              key={type.value}
                              value={type.value}
                            >
                              {type.label}
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeCharacteristic(
                          characteristic.id,
                        )
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      aria-label={`Remove ${characteristic.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <input
                      id={`required-${characteristic.id}`}
                      type="checkbox"
                      checked={
                        characteristic.required ??
                        false
                      }
                      onChange={(event) =>
                        updateCharacteristic(
                          characteristic.id,
                          {
                            required:
                              event.target.checked,
                          },
                        )
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

                  {[
                    "select",
                    "color",
                    "material",
                    "finish",
                    "size",
                  ].includes(
                    characteristic.type,
                  ) && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-600">
                          Values
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            addValue(
                              characteristic,
                            )
                          }
                          className="inline-flex items-center gap-1 text-xs font-semibold"
                          style={{
                            color:
                              "var(--color-primary)",
                          }}
                        >
                          <Plus size={13} />
                          Add value
                        </button>
                      </div>

                      <div className="mt-2 space-y-2">
                        {characteristic.values.map(
                          (value) => (
                            <div
                              key={value.id}
                              className="flex items-center gap-2"
                            >
                              {characteristic.type ===
                                "color" && (
                                <input
                                  type="color"
                                  value={
                                    value.hexCode ??
                                    "#cccccc"
                                  }
                                  onChange={(event) =>
                                    updateValue(
                                      characteristic.id,
                                      value.id,
                                      {
                                        hexCode:
                                          event
                                            .target
                                            .value,
                                      },
                                    )
                                  }
                                  className="h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                                />
                              )}

                              <input
                                value={value.name}
                                onChange={(event) =>
                                  updateValue(
                                    characteristic.id,
                                    value.id,
                                    {
                                      name: event
                                        .target
                                        .value,
                                    },
                                  )
                                }
                                placeholder="Value"
                                className="h-10 min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 text-xs outline-none focus:border-[var(--color-primary)]"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeValue(
                                    characteristic.id,
                                    value.id,
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ),
                        )}

                        {!characteristic.values
                          .length && (
                          <p className="rounded-xl bg-white p-3 text-xs text-gray-400">
                            No values configured.
                            Add one above.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="mt-3 text-[10px] text-gray-400">
                    Characteristic {index + 1} ·{" "}
                    {characteristic.type}
                  </p>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
};

export default TenantCharacteristicsEditor;