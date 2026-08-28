import { Prisma } from "@prisma/client";

import { prisma } from "../../config/prisma.js";

export type CatalogCharacteristicValueInput = {
  id?: string;
  name: string;
  description?: string | null;
  hexCode?: string | null;
  imageUrl?: string | null;
  images?: unknown;
  active?: boolean;
};

export type CatalogCharacteristicInput = {
  id?: string;
  name: string;
  type: string;
  description?: string | null;
  required?: boolean;
  sequence?: number;
  active?: boolean;
  values?: CatalogCharacteristicValueInput[];
};

export type UpdateCatalogSettingsInput = {
  categories?: unknown;
  defaultCurrency?: string;
  allowCustomCategories?: boolean;
  allowCustomCharacteristics?: boolean;
  requireDimensions?: boolean;
  requirePrice?: boolean;
  characteristics?: CatalogCharacteristicInput[];
};

const catalogSettingsInclude = {
  characteristics: {
    orderBy: {
      sequence: "asc" as const,
    },
    include: {
      values: {
        orderBy: {
          name: "asc" as const,
        },
      },
    },
  },
};

function toJsonValue(
  value: unknown,
): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  if (value === null || value === undefined) {
    return Prisma.JsonNull;
  }

  return value as Prisma.InputJsonValue;
}

function normalizeString(value: unknown, fallback = ""): string {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim();
}

async function getOrCreateSettings(tenantId: string) {
  return prisma.tenantCatalogSettings.upsert({
    where: {
      tenantId,
    },

    create: {
      tenantId,
      categories: [],
      defaultCurrency: "KES",
      allowCustomCategories: false,
      allowCustomCharacteristics: false,
      requireDimensions: false,
      requirePrice: false,
    },

    update: {},
  });
}

/**
 * =========================================================
 * GET CATALOG SETTINGS
 * =========================================================
 */

export async function getCatalogSettings(tenantId: string) {
  const settings = await prisma.tenantCatalogSettings.upsert({
    where: {
      tenantId,
    },

    create: {
      tenantId,
      categories: [],
      defaultCurrency: "KES",
      allowCustomCategories: false,
      allowCustomCharacteristics: false,
      requireDimensions: false,
      requirePrice: false,
    },

    update: {},
  });

  return prisma.tenantCatalogSettings.findUnique({
    where: {
      id: settings.id,
    },

    include: catalogSettingsInclude,
  });
}

/**
 * =========================================================
 * UPDATE CATALOG SETTINGS
 * =========================================================
 *
 * This is the main persistence operation.
 *
 * Characteristics are synchronized against PostgreSQL.
 *
 * Existing IDs -> update
 * Missing IDs  -> create
 * Removed IDs  -> delete
 *
 * Values are synchronized in exactly the same way.
 */

export async function updateCatalogSettings(
  tenantId: string,
  input: UpdateCatalogSettingsInput,
) {
  return prisma.$transaction(async (tx) => {
    const settings = await tx.tenantCatalogSettings.upsert({
      where: {
        tenantId,
      },

      create: {
        tenantId,
        categories:
          input.categories !== undefined ? toJsonValue(input.categories) : [],

        defaultCurrency: input.defaultCurrency?.trim() || "KES",

        allowCustomCategories: input.allowCustomCategories ?? false,

        allowCustomCharacteristics: input.allowCustomCharacteristics ?? false,

        requireDimensions: input.requireDimensions ?? false,

        requirePrice: input.requirePrice ?? false,
      },

      update: {
        ...(input.categories !== undefined && {
          categories: toJsonValue(input.categories),
        }),

        ...(input.defaultCurrency !== undefined && {
          defaultCurrency: input.defaultCurrency.trim() || "KES",
        }),

        ...(input.allowCustomCategories !== undefined && {
          allowCustomCategories: input.allowCustomCategories,
        }),

        ...(input.allowCustomCharacteristics !== undefined && {
          allowCustomCharacteristics: input.allowCustomCharacteristics,
        }),

        ...(input.requireDimensions !== undefined && {
          requireDimensions: input.requireDimensions,
        }),

        ...(input.requirePrice !== undefined && {
          requirePrice: input.requirePrice,
        }),
      },
    });

    /**
     * -------------------------------------------------------
     * CHARACTERISTICS
     * -------------------------------------------------------
     */

    if (input.characteristics !== undefined) {
      const existingCharacteristics = await tx.tenantCharacteristic.findMany({
        where: {
          settingsId: settings.id,
        },

        select: {
          id: true,
        },
      });

      const existingIds = existingCharacteristics.map((item) => item.id);

      const incomingIds = input.characteristics
        .map((item) => item.id)
        .filter((id): id is string => typeof id === "string" && id.length > 0);

      /**
       * Delete characteristics removed from the UI.
       */

      const idsToDelete = existingIds.filter((id) => !incomingIds.includes(id));

      if (idsToDelete.length > 0) {
        await tx.tenantCharacteristic.deleteMany({
          where: {
            id: {
              in: idsToDelete,
            },

            settingsId: settings.id,
          },
        });
      }

      /**
       * Upsert characteristics.
       */

      for (let index = 0; index < input.characteristics.length; index++) {
        const characteristic = input.characteristics[index];

        if (!characteristic) {
          continue;
        }

        const sequence = characteristic.sequence ?? index;

        let characteristicRecord;

        const existingId =
          characteristic.id && existingIds.includes(characteristic.id)
            ? characteristic.id
            : undefined;

        if (existingId) {
          characteristicRecord = await tx.tenantCharacteristic.update({
            where: {
              id: existingId,
            },

            data: {
              name: normalizeString(characteristic.name),

              type: normalizeString(characteristic.type, "select"),

              description: characteristic.description ?? null,

              required: characteristic.required ?? false,

              sequence,

              active: characteristic.active ?? true,
            },
          });
        } else {
          characteristicRecord = await tx.tenantCharacteristic.create({
            data: {
              settingsId: settings.id,

              name: normalizeString(characteristic.name),

              type: normalizeString(characteristic.type, "select"),

              description: characteristic.description ?? null,

              required: characteristic.required ?? false,

              sequence,

              active: characteristic.active ?? true,
            },
          });
        }

        /**
         * -----------------------------------------------------
         * CHARACTERISTIC VALUES
         * -----------------------------------------------------
         */

        if (characteristic.values !== undefined) {
          const existingValues = await tx.tenantCharacteristicValue.findMany({
            where: {
              characteristicId: characteristicRecord.id,
            },

            select: {
              id: true,
            },
          });

          const existingValueIds = existingValues.map((item) => item.id);

          const incomingValueIds = characteristic.values
            .map((value) => value.id)
            .filter(
              (id): id is string => typeof id === "string" && id.length > 0,
            );

          const valueIdsToDelete = existingValueIds.filter(
            (id) => !incomingValueIds.includes(id),
          );

          if (valueIdsToDelete.length > 0) {
            await tx.tenantCharacteristicValue.deleteMany({
              where: {
                id: {
                  in: valueIdsToDelete,
                },

                characteristicId: characteristicRecord.id,
              },
            });
          }

          for (
            let valueIndex = 0;
            valueIndex < characteristic.values.length;
            valueIndex++
          ) {
            const value = characteristic.values[valueIndex];

            if (!value) {
              continue;
            }

            const existingValueId =
              value.id && existingValueIds.includes(value.id)
                ? value.id
                : undefined;

            const valueData = {
              name: normalizeString(value.name),

              description: value.description ?? null,

              hexCode: value.hexCode ?? null,

              imageUrl: value.imageUrl ?? null,

              images: toJsonValue(value.images),

              active: value.active ?? true,
            };

            if (existingValueId) {
              await tx.tenantCharacteristicValue.update({
                where: {
                  id: existingValueId,
                },

                data: valueData,
              });
            } else {
              await tx.tenantCharacteristicValue.create({
                data: {
                  characteristicId: characteristicRecord.id,

                  ...valueData,
                },
              });
            }
          }
        }
      }
    }

    /**
     * Return the actual database state.
     *
     * The frontend should use this response as its
     * new source of truth.
     */

    return tx.tenantCatalogSettings.findUnique({
      where: {
        id: settings.id,
      },

      include: catalogSettingsInclude,
    });
  });
}

/**
 * =========================================================
 * CREATE CHARACTERISTIC
 * =========================================================
 */

export async function createCharacteristic(
  tenantId: string,
  input: CatalogCharacteristicInput,
) {
  const settings = await getOrCreateSettings(tenantId);

  return prisma.tenantCharacteristic.create({
    data: {
      settingsId: settings.id,

      name: normalizeString(input.name),

      type: normalizeString(input.type, "select"),

      description: input.description ?? null,

      required: input.required ?? false,

      sequence: input.sequence ?? 0,

      active: input.active ?? true,

      values: {
        create: (input.values ?? []).map((value) => ({
          name: normalizeString(value.name),

          description: value.description ?? null,

          hexCode: value.hexCode ?? null,

          imageUrl: value.imageUrl ?? null,

          images: toJsonValue(value.images),

          active: value.active ?? true,
        })),
      },
    },

    include: {
      values: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });
}

/**
 * =========================================================
 * UPDATE CHARACTERISTIC
 * =========================================================
 */

export async function updateCharacteristic(
  tenantId: string,
  characteristicId: string,
  input: CatalogCharacteristicInput,
) {
  const settings = await getOrCreateSettings(tenantId);

  const characteristic = await prisma.tenantCharacteristic.findFirst({
    where: {
      id: characteristicId,

      settingsId: settings.id,
    },
  });

  if (!characteristic) {
    return null;
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.tenantCharacteristic.update({
      where: {
        id: characteristicId,
      },

      data: {
        name: normalizeString(input.name),

        type: normalizeString(input.type, "select"),

        description: input.description ?? null,

        required: input.required ?? false,

        sequence: input.sequence ?? 0,

        active: input.active ?? true,
      },
    });

    if (input.values !== undefined) {
      await tx.tenantCharacteristicValue.deleteMany({
        where: {
          characteristicId,
        },
      });

      if (input.values.length > 0) {
        await tx.tenantCharacteristicValue.createMany({
          data: input.values.map((value) => ({
            characteristicId,

            name: normalizeString(value.name),

            description: value.description ?? null,

            hexCode: value.hexCode ?? null,

            imageUrl: value.imageUrl ?? null,

            images: toJsonValue(value.images),

            active: value.active ?? true,
          })),
        });
      }
    }

    return tx.tenantCharacteristic.findUnique({
      where: {
        id: updated.id,
      },

      include: {
        values: {
          orderBy: {
            name: "asc",
          },
        },
      },
    });
  });
}

/**
 * =========================================================
 * DELETE CHARACTERISTIC
 * =========================================================
 */

export async function deleteCharacteristic(
  tenantId: string,
  characteristicId: string,
) {
  const settings = await getOrCreateSettings(tenantId);

  const characteristic = await prisma.tenantCharacteristic.findFirst({
    where: {
      id: characteristicId,

      settingsId: settings.id,
    },

    select: {
      id: true,
    },
  });

  if (!characteristic) {
    return false;
  }

  await prisma.tenantCharacteristic.delete({
    where: {
      id: characteristic.id,
    },
  });

  return true;
}

/**
 * =========================================================
 * CREATE CHARACTERISTIC VALUE
 * =========================================================
 */

export async function createCharacteristicValue(
  tenantId: string,
  characteristicId: string,
  input: CatalogCharacteristicValueInput,
) {
  const settings = await getOrCreateSettings(tenantId);

  const characteristic = await prisma.tenantCharacteristic.findFirst({
    where: {
      id: characteristicId,

      settingsId: settings.id,
    },

    select: {
      id: true,
    },
  });

  if (!characteristic) {
    return null;
  }

  return prisma.tenantCharacteristicValue.create({
    data: {
      characteristicId,

      name: normalizeString(input.name),

      description: input.description ?? null,

      hexCode: input.hexCode ?? null,

      imageUrl: input.imageUrl ?? null,

      images: toJsonValue(input.images),

      active: input.active ?? true,
    },
  });
}

/**
 * =========================================================
 * UPDATE CHARACTERISTIC VALUE
 * =========================================================
 */

export async function updateCharacteristicValue(
  tenantId: string,
  characteristicId: string,
  valueId: string,
  input: CatalogCharacteristicValueInput,
) {
  const settings = await getOrCreateSettings(tenantId);

  const value = await prisma.tenantCharacteristicValue.findFirst({
    where: {
      id: valueId,

      characteristicId,

      characteristic: {
        settingsId: settings.id,
      },
    },
  });

  if (!value) {
    return null;
  }

  return prisma.tenantCharacteristicValue.update({
    where: {
      id: value.id,
    },

    data: {
      name: normalizeString(input.name),

      description: input.description ?? null,

      hexCode: input.hexCode ?? null,

      imageUrl: input.imageUrl ?? null,

      images: toJsonValue(input.images),

      active: input.active ?? true,
    },
  });
}

/**
 * =========================================================
 * DELETE CHARACTERISTIC VALUE
 * =========================================================
 */

export async function deleteCharacteristicValue(
  tenantId: string,
  characteristicId: string,
  valueId: string,
) {
  const settings = await getOrCreateSettings(tenantId);

  const value = await prisma.tenantCharacteristicValue.findFirst({
    where: {
      id: valueId,

      characteristicId,

      characteristic: {
        settingsId: settings.id,
      },
    },

    select: {
      id: true,
    },
  });

  if (!value) {
    return false;
  }

  await prisma.tenantCharacteristicValue.delete({
    where: {
      id: value.id,
    },
  });

  return true;
}
