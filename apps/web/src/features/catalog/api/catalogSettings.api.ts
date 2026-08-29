import type {
  TenantCatalogSettings,
  TenantCharacteristic,
} from "../types/catalog.types";

type CatalogSettingsResponse = {
  settings: TenantCatalogSettings;
};

type CharacteristicResponse = {
  characteristic: TenantCharacteristic;
};

type ValueResponse = {
  value: TenantCharacteristic["values"][number];
};

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:4000/api";

function getAccessToken(): string | null {
  return localStorage.getItem(
    "tfundi_access_token",
  );
}

function getTenantSlug(): string | null {
  return localStorage.getItem(
    "tfundi_tenant_slug",
  );
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  const tenantSlug = getTenantSlug();

  if (!token) {
    throw new Error(
      "Authentication token is missing.",
    );
  }

  if (!tenantSlug) {
    throw new Error(
      "Tenant slug is missing.",
    );
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,

        "X-Tenant-Slug":
          tenantSlug,

        ...(options.headers ?? {}),
      },
    },
  );

  const contentType =
    response.headers.get(
      "content-type",
    );

  const data =
    contentType?.includes(
      "application/json",
    )
      ? await response.json()
      : null;

  if (!response.ok) {
    throw new Error(
      data?.message ??
        "Catalog request failed.",
    );
  }

  return data as T;
}

/**
 * =========================================================
 * GET SETTINGS
 * =========================================================
 */

export async function getCatalogSettings(): Promise<TenantCatalogSettings> {
  const response =
    await request<CatalogSettingsResponse>(
      "/catalog/settings",
    );

  return response.settings;
}

/**
 * =========================================================
 * UPDATE SETTINGS
 * =========================================================
 */

export async function saveCatalogSettings(
  settings: TenantCatalogSettings,
): Promise<TenantCatalogSettings> {
  const response =
    await request<CatalogSettingsResponse>(
      "/catalog/settings",
      {
        method: "PUT",

        body: JSON.stringify({
          categories:
            settings.categories,

          defaultCurrency:
            settings.defaultCurrency,

          allowCustomCategories:
            settings.allowCustomCategories,

          allowCustomCharacteristics:
            settings.allowCustomCharacteristics,

          requireDimensions:
            settings.requireDimensions,

          requirePrice:
            settings.requirePrice,

          characteristics:
            settings.characteristics,
        }),
      },
    );

  return response.settings;
}

/**
 * =========================================================
 * CREATE CHARACTERISTIC
 * =========================================================
 */

export async function createCatalogCharacteristic(
  characteristic: TenantCharacteristic,
): Promise<TenantCharacteristic> {
  const response =
    await request<CharacteristicResponse>(
      "/catalog/characteristics",
      {
        method: "POST",

        body: JSON.stringify({
          name:
            characteristic.name,

          type:
            characteristic.type,

          description:
            characteristic.description,

          required:
            characteristic.required,

          sequence:
            characteristic.sequence,

          active:
            characteristic.active,

          values:
            characteristic.values,
        }),
      },
    );

  return response.characteristic;
}

/**
 * =========================================================
 * UPDATE CHARACTERISTIC
 * =========================================================
 */

export async function updateCatalogCharacteristic(
  characteristic: TenantCharacteristic,
): Promise<TenantCharacteristic> {
  const response =
    await request<CharacteristicResponse>(
      `/catalog/characteristics/${characteristic.id}`,
      {
        method: "PATCH",

        body: JSON.stringify({
          name:
            characteristic.name,

          type:
            characteristic.type,

          description:
            characteristic.description,

          required:
            characteristic.required,

          sequence:
            characteristic.sequence,

          active:
            characteristic.active,

          values:
            characteristic.values,
        }),
      },
    );

  return response.characteristic;
}

/**
 * =========================================================
 * DELETE CHARACTERISTIC
 * =========================================================
 */

export async function deleteCatalogCharacteristic(
  characteristicId: string,
): Promise<void> {
  await request(
    `/catalog/characteristics/${characteristicId}`,
    {
      method: "DELETE",
    },
  );
}

/**
 * =========================================================
 * CREATE VALUE
 * =========================================================
 */

export async function createCatalogCharacteristicValue(
  characteristicId: string,
  value: TenantCharacteristic["values"][number],
) {
  const response =
    await request<ValueResponse>(
      `/catalog/characteristics/${characteristicId}/values`,
      {
        method: "POST",

        body: JSON.stringify({
          name: value.name,

          description:
            value.description,

          hexCode:
            value.hexCode,

          imageUrl:
            value.imageUrl,

          images:
            value.images,

          active:
            value.active,
        }),
      },
    );

  return response.value;
}

/**
 * =========================================================
 * UPDATE VALUE
 * =========================================================
 */

export async function updateCatalogCharacteristicValue(
  characteristicId: string,
  value: TenantCharacteristic["values"][number],
) {
  const response =
    await request<ValueResponse>(
      `/catalog/characteristics/${characteristicId}/values/${value.id}`,
      {
        method: "PATCH",

        body: JSON.stringify({
          name: value.name,

          description:
            value.description,

          hexCode:
            value.hexCode,

          imageUrl:
            value.imageUrl,

          images:
            value.images,

          active:
            value.active,
        }),
      },
    );

  return response.value;
}

/**
 * =========================================================
 * DELETE VALUE
 * =========================================================
 */

export async function deleteCatalogCharacteristicValue(
  characteristicId: string,
  valueId: string,
): Promise<void> {
  await request(
    `/catalog/characteristics/${characteristicId}/values/${valueId}`,
    {
      method: "DELETE",
    },
  );
}