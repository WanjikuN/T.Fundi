import {
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";

import type {
  TenantCharacteristic,
  TenantCharacteristicType,
  TenantCharacteristicValue,
} from "../types/catalog.types";

interface Props {
  characteristics: TenantCharacteristic[];

  onChange: (
    characteristics: TenantCharacteristic[],
  ) => void;

  readOnly?: boolean;
}

const CHARACTERISTIC_TYPES: {
  value: TenantCharacteristicType;
  label: string;
}[] = [
  { value: "select", label: "Select" },
  { value: "color", label: "Color" },
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "image", label: "Image" },
  { value: "material", label: "Material" },
  { value: "finish", label: "Finish" },
  { value: "size", label: "Size" },
];

const createId = () =>
  crypto.randomUUID();

const TenantCharacteristicsEditor = ({
  characteristics,
  onChange,
  readOnly = false,
}: Props) => {
  const updateCharacteristic = (
    id: string,
    patch: Partial<TenantCharacteristic>,
  ) => {
    onChange(
      characteristics.map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    );
  };

  const removeCharacteristic = (
    id: string,
  ) => {
    onChange(
      characteristics
        .filter(
          (item) => item.id !== id,
        )
        .map((item, index) => ({
          ...item,
          sequence: index,
        })),
    );
  };

  const addCharacteristic = () => {
    const characteristic: TenantCharacteristic = {
      id: createId(),
      name: "",
      type: "select",
      description: "",
      required: false,
      sequence: characteristics.length,
      active: true,
      values: [],
    };

    onChange([
      ...characteristics,
      characteristic,
    ]);
  };

  const addValue = (
    characteristicId: string,
  ) => {
    const value: TenantCharacteristicValue = {
      id: createId(),
      name: "",
      description: "",
      hexCode: undefined,
      imageUrl: undefined,
      images: [],
      active: true,
    };

    onChange(
      characteristics.map(
        (characteristic) =>
          characteristic.id ===
          characteristicId
            ? {
                ...characteristic,
                values: [
                  ...characteristic.values,
                  value,
                ],
              }
            : characteristic,
      ),
    );
  };

  const updateValue = (
    characteristicId: string,
    valueId: string,
    patch: Partial<TenantCharacteristicValue>,
  ) => {
    onChange(
      characteristics.map(
        (characteristic) =>
          characteristic.id ===
          characteristicId
            ? {
                ...characteristic,
                values:
                  characteristic.values.map(
                    (value) =>
                      value.id === valueId
                        ? {
                            ...value,
                            ...patch,
                          }
                        : value,
                  ),
              }
            : characteristic,
      ),
    );
  };

  const removeValue = (
    characteristicId: string,
    valueId: string,
  ) => {
    onChange(
      characteristics.map(
        (characteristic) =>
          characteristic.id ===
          characteristicId
            ? {
                ...characteristic,
                values:
                  characteristic.values.filter(
                    (value) =>
                      value.id !== valueId,
                  ),
              }
            : characteristic,
      ),
    );
  };

  return (
    <div className="space-y-4">
      {characteristics.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/10 bg-black/[0.015] p-8 text-center">
          <p className="text-sm font-semibold text-gray-700">
            No characteristics configured
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Add characteristics such as
            material, finish, upholstery or
            dimensions.
          </p>
        </div>
      )}

      {characteristics.map(
        (characteristic, index) => (
          <div
            key={characteristic.id}
            className="rounded-2xl border border-black/10 bg-white p-4"
          >
            <div className="flex items-start gap-3">
              <div className="pt-2 text-gray-300">
                <GripVertical size={17} />
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                  <input
                    value={characteristic.name}
                    disabled={readOnly}
                    onChange={(event) =>
                      updateCharacteristic(
                        characteristic.id,
                        {
                          name: event.target
                            .value,
                        },
                      )
                    }
                    placeholder="Characteristic name"
                    className="h-10 rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                  />

                  <select
                    value={characteristic.type}
                    disabled={readOnly}
                    onChange={(event) =>
                      updateCharacteristic(
                        characteristic.id,
                        {
                          type: event.target
                            .value as TenantCharacteristicType,
                        },
                      )
                    }
                    className="h-10 rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-[var(--color-primary)]"
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

                <input
                  value={
                    characteristic.description ??
                    ""
                  }
                  disabled={readOnly}
                  onChange={(event) =>
                    updateCharacteristic(
                      characteristic.id,
                      {
                        description:
                          event.target.value,
                      },
                    )
                  }
                  placeholder="Description / guidance"
                  className="h-10 w-full rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                />

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                    <input
                      type="checkbox"
                      checked={
                        characteristic.required
                      }
                      disabled={readOnly}
                      onChange={(event) =>
                        updateCharacteristic(
                          characteristic.id,
                          {
                            required:
                              event.target.checked,
                          },
                        )
                      }
                    />

                    Required
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                    <input
                      type="checkbox"
                      checked={
                        characteristic.active
                      }
                      disabled={readOnly}
                      onChange={(event) =>
                        updateCharacteristic(
                          characteristic.id,
                          {
                            active:
                              event.target.checked,
                          },
                        )
                      }
                    />

                    Active
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
                  <div className="rounded-xl bg-black/[0.025] p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        Values
                      </p>

                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() =>
                            addValue(
                              characteristic.id,
                            )
                          }
                          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)]"
                        >
                          <Plus size={13} />
                          Add value
                        </button>
                      )}
                    </div>

                    <div className="mt-3 space-y-2">
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
                                  "#000000"
                                }
                                disabled={
                                  readOnly
                                }
                                onChange={(
                                  event,
                                ) =>
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
                                className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border-0"
                              />
                            )}

                            <input
                              value={value.name}
                              disabled={readOnly}
                              onChange={(
                                event,
                              ) =>
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
                              className="h-9 min-w-0 flex-1 rounded-lg border border-black/10 bg-white px-3 text-xs outline-none focus:border-[var(--color-primary)]"
                            />

                            {!readOnly && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeValue(
                                    characteristic.id,
                                    value.id,
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2
                                  size={14}
                                />
                              </button>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!readOnly && (
                <button
                  type="button"
                  onClick={() =>
                    removeCharacteristic(
                      characteristic.id,
                    )
                  }
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remove characteristic ${
                    index + 1
                  }`}
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        ),
      )}

      {!readOnly && (
        <button
          type="button"
          onClick={addCharacteristic}
          className="inline-flex items-center gap-2 rounded-xl border border-dashed border-black/15 px-4 py-2.5 text-xs font-bold text-gray-600 transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          <Plus size={15} />
          Add characteristic
        </button>
      )}
    </div>
  );
};

export default TenantCharacteristicsEditor;