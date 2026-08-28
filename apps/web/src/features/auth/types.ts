/* =========================================================
   CATALOG TYPES
   ========================================================= */

export const PRODUCT_CATEGORIES = [
  "sofas",
  "chairs",
  "tables",
  "beds",
  "storage",
  "desks",
  "lighting",
  "outdoor",
  "other",
] as const;

export type ProductCategory =
  (typeof PRODUCT_CATEGORIES)[number];

/* =========================================================
   CHARACTERISTICS
   ========================================================= */

export const TENANT_CHARACTERISTIC_TYPES = [
  "select",
  "color",
  "text",
  "number",
  "image",
  "material",
  "finish",
  "size",
] as const;

export type TenantCharacteristicType =
  (typeof TENANT_CHARACTERISTIC_TYPES)[number];

export interface TenantCharacteristicValue {
  id: string;
  name: string;
  description?: string | null;
  hexCode?: string | null;
  imageUrl?: string | null;
  images?: string[];
  active: boolean;
}

export interface TenantCharacteristic {
  id: string;
  name: string;
  type: TenantCharacteristicType;
  description?: string | null;
  required: boolean;
  sequence: number;
  active: boolean;
  values: TenantCharacteristicValue[];
}

/* =========================================================
   CATALOG SETTINGS
   ========================================================= */

export interface TenantCatalogSettings {
  categories: ProductCategory[];

  characteristics: TenantCharacteristic[];

  defaultCurrency: string;

  allowCustomCategories: boolean;

  allowCustomCharacteristics: boolean;

  requireDimensions: boolean;

  requirePrice: boolean;
}

/* =========================================================
   PRODUCT CHARACTERISTIC VALUE
   ========================================================= */

export interface ProductCharacteristicValue {
  characteristicId: string;

  characteristicName: string;

  type: TenantCharacteristicType;

  value: string | number;

  label?: string;

  hexCode?: string;

  imageUrl?: string;
}

/* =========================================================
   PRODUCT OPTION
   ========================================================= */

export interface ProductOption {
  id: string;

  name: string;

  type: TenantCharacteristicType;

  required: boolean;

  values: TenantCharacteristicValue[];
}

/* =========================================================
   DIMENSIONS
   ========================================================= */

export interface ProductDimensions {
  width: number;
  depth: number;
  height: number;
  unit: "cm" | "mm" | "m" | "in";
}

/* =========================================================
   PRODUCT MEDIA
   ========================================================= */

export interface ProductImage {
  id: string;

  url: string;

  alt?: string;

  sequence: number;

  isPrimary: boolean;
}

/* =========================================================
   PRODUCT STATUS
   ========================================================= */

export type ProductStatus =
  | "draft"
  | "active"
  | "archived";

/* =========================================================
   PRODUCT
   ========================================================= */

export interface Product {
  id: string;

  tenantId: string;

  name: string;

  slug: string;

  description: string;

  category: ProductCategory | string | null;

  price: number;

  currency: string;

  quantity: number;

  imageUrl?: string | null;

  images: ProductImage[];

  media?: unknown;

  model3DUrl?: string | null;

  dimensions?: ProductDimensions | null;

  options: ProductOption[];

  characteristics: ProductCharacteristicValue[];

  variants?: unknown[];

  status: ProductStatus;

  createdAt?: string;

  updatedAt?: string;
}

/* =========================================================
   AI
   ========================================================= */

export interface AIProductAnalysis {
  name: string;

  description: string;

  category: string;

  price?: number;

  currency?: string;

  dimensions?: ProductDimensions;

  characteristics: ProductCharacteristicValue[];

  confidence?: number;

  reasoning?: string;
}