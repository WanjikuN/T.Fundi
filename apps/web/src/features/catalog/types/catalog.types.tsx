/* =========================================================
   PRODUCT CATEGORIES
   ========================================================= */

export type ProductCategory =
  | "sofas"
  | "chairs"
  | "tables"
  | "beds"
  | "storage"
  | "outdoor"
  | "lighting"
  | "desks"
  | "other";

/* =========================================================
   PRODUCT STATUS
   ========================================================= */

export type ProductStatus = "draft" | "active" | "archived";

/* =========================================================
   PRODUCT GENERATION STATUS
   ========================================================= */

export type ProductGenerationStatus =
  | "idle"
  | "analysing"
  | "generating"
  | "completed"
  | "failed";

/* =========================================================
   DIMENSIONS
   ========================================================= */

export type ProductDimensions = {
  width: number;
  depth: number;
  height: number;
  unit: "cm" | "mm" | "in";
};

/* =========================================================
   TENANT CHARACTERISTICS
   =========================================================
 *
 * These define what a tenant wants to capture about
 * furniture products.
 *
 * IMPORTANT:
 *
 * T.Fundi does NOT assume that every furniture business
 * uses:
 *
 * - Material
 * - Colour
 * - Finish
 * - Size
 *
 * A tenant may instead configure:
 *
 * - Wood Species
 * - Upholstery
 * - Leg Style
 * - Cushion Density
 * - Frame Type
 * - Configuration
 * - Care Instructions
 * - Custom text
 * - Custom number
 * - Images
 *
 * These characteristics drive:
 *
 * 1. Product creation
 * 2. AI analysis
 * 3. Product review
 * 4. Product options
 * 5. Product variants
 * 6. Product display
 */

/* =========================================================
   TENANT CHARACTERISTIC TYPE
   ========================================================= */

export type TenantCharacteristicType =
  | "select"
  | "color"
  | "text"
  | "number"
  | "image"
  | "material"
  | "finish"
  | "size";

/* =========================================================
   TENANT CHARACTERISTIC VALUE
   ========================================================= */

export type TenantCharacteristicValue = {
  id: string;

  name: string;

  description?: string;

  /**
   * Optional colour used by the UI.
   */
  hexCode?: string;

  /**
   * Optional image representing the value.
   */
  imageUrl?: string;

  /**
   * Optional additional images.
   */
  images?: string[];

  /**
   * Whether the value is currently available.
   */
  active?: boolean;
};

/* =========================================================
   TENANT CHARACTERISTIC
   ========================================================= */

export type TenantCharacteristic = {
  id: string;

  /**
   * Tenant-defined display name.
   *
   * Examples:
   *
   * "Wood Species"
   * "Upholstery"
   * "Leg Style"
   * "Cushion Density"
   */
  name: string;

  /**
   * Determines how the value is entered.
   */
  type: TenantCharacteristicType;

  /**
   * Optional helper text displayed during
   * product creation.
   */
  description?: string;

  /**
   * Whether the characteristic must be completed
   * before the product can be published.
   */
  required?: boolean;

  /**
   * Values configured by the tenant.
   *
   * Select/color/material/finish/size characteristics
   * normally use these.
   *
   * text/number characteristics may leave this empty.
   */
  values: TenantCharacteristicValue[];

  /**
   * Controls display order.
   */
  sequence?: number;

  /**
   * Whether this characteristic is currently
   * available for product creation.
   */
  active?: boolean;
};

/* =========================================================
   TENANT CATALOG SETTINGS
   =========================================================
 *
 * This gives us a single place for tenant-level
 * catalog configuration.
 *
 * Later this can come from:
 *
 * GET /api/tenant/catalog-settings
 */

export type TenantCatalogSettings = {
  characteristics: TenantCharacteristic[];

  categories?: ProductCategory[];

  defaultCurrency?: string;

  allowCustomCategories?: boolean;

  allowCustomCharacteristics?: boolean;

  requireDimensions?: boolean;

  requirePrice?: boolean;
};

/* =========================================================
   PRODUCT IMAGE
   ========================================================= */

export type ProductImage = {
  id: string;

  url: string;

  alt?: string;

  /**
   * Display order.
   */
  sequence?: number;

  /**
   * Whether the image participates in a
   * 360-degree image sequence.
   */
  is360Frame?: boolean;

  /**
   * Optional camera/view label.
   */
  view?:
    | "front"
    | "back"
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "detail"
    | "other";
};

/* =========================================================
   PRODUCT MEDIA
   ========================================================= */

export type ProductMediaType = "image" | "360" | "model3d";

export type ProductMedia = {
  id: string;

  url: string;

  type: ProductMediaType;

  label?: string;

  sequence?: number;

  generated?: boolean;
};

/* =========================================================
   PRODUCT OPTION VALUE
   =========================================================
 *
 * ProductOptionValue is a product-level snapshot of a
 * tenant characteristic value.
 *
 * This means if the tenant later changes:
 *
 * "Walnut"
 *
 * the historical product can still retain the original
 * selected value.
 */

export type ProductOptionValue = {
  id: string;

  name: string;

  description?: string;

  /**
   * Optional UI colour.
   */
  color?: string;

  /**
   * Hex colour for swatches.
   */
  hexCode?: string;

  /**
   * Optional image.
   */
  imageUrl?: string;

  /**
   * Optional additional images.
   */
  images?: string[];

  /**
   * Optional 3D asset specific to this value.
   */
  model3DUrl?: string;

  active?: boolean;
};

/* =========================================================
   PRODUCT OPTION
   =========================================================
 *
 * IMPORTANT:
 *
 * ProductOption uses TenantCharacteristicType.
 *
 * There is intentionally NO separate hard-coded
 * ProductOption type such as:
 *
 * "material" | "finish" | "size"
 *
 * That was the source of the previous TypeScript
 * incompatibility.
 */

export type ProductOption = {
  id: string;

  /**
   * ID of the tenant characteristic that created
   * this product option.
   */
  characteristicId?: string;

  /**
   * Snapshot of the tenant characteristic name.
   */
  name: string;

  /**
   * The tenant-defined characteristic type.
   */
  type: TenantCharacteristicType;

  /**
   * Whether this product option is required.
   */
  required?: boolean;

  /**
   * Available values for this product.
   */
  values: ProductOptionValue[];

  /**
   * Value entered for text/number/image characteristics.
   *
   * This allows options that don't naturally use
   * selectable values.
   */
  value?: string | number;

  /**
   * Optional image value for image-based
   * characteristics.
   */
  imageUrl?: string;
};

/* =========================================================
   PRODUCT VARIANT
   =========================================================
 *
 * Example:
 *
 * Walnut + Charcoal + Matte
 *
 * or:
 *
 * Oak + Cream + Natural
 */

export type ProductVariant = {
  id: string;

  name?: string;

  /**
   * Maps tenant characteristic IDs to selected
   * characteristic values.
   *
   * Example:
   *
   * {
   *   "wood-species": "walnut",
   *   "upholstery": "charcoal",
   *   "finish": "matte"
   * }
   */
  selections: Record<string, string>;

  price?: number;

  currency?: string;

  images?: ProductImage[];

  media?: ProductMedia[];

  model3DUrl?: string;

  active?: boolean;
};

/* =========================================================
   PRODUCT
   ========================================================= */

export type Product = {
  id: string;

  name: string;

  slug: string;

  description: string;

  category: ProductCategory;

  price: number;

  currency: string;
  updatedAt?: string;
  quantity: number;
  /**
   * Primary product image.
   */
  imageUrl: string;

  /**
   * Simple image URLs.
   */
  images?: string[];

  /**
   * Structured media.
   */
  media?: ProductMedia[];

  /**
   * Product dimensions.
   */
  dimensions?: ProductDimensions;

  /**
   * Tenant-defined characteristics/options.
   */
  options: ProductOption[];

  /**
   * Optional combinations of characteristics.
   */
  variants?: ProductVariant[];

  /**
   * Optional 3D product asset.
   */
  model3DUrl?: string;

  status: ProductStatus;

  featured?: boolean;

  createdAt: string;
};

/* =========================================================
   AI DETECTED CHARACTERISTIC
   =========================================================
 *
 * AI should NOT assume:
 *
 * materials
 * colours
 * finishes
 *
 * Instead AI attempts to map what it sees to the
 * tenant's configured characteristics.
 */

export type AIDetectedCharacteristic = {
  /**
   * Tenant characteristic ID when matched.
   */
  characteristicId?: string;

  /**
   * Human-readable characteristic name.
   */
  characteristicName: string;

  /**
   * Value detected by AI.
   */
  value: string;

  /**
   * Matching tenant value ID where available.
   */
  valueId?: string;

  /**
   * AI confidence from 0 to 1.
   */
  confidence: number;
};

/* =========================================================
   AI DETECTED OPTION
   =========================================================
 *
 * Kept for compatibility with existing code.
 *
 * New code should prefer AIDetectedCharacteristic.
 */

export type AIDetectedOption = {
  characteristicId?: string;

  category: string;

  value: string;

  valueId?: string;

  confidence: number;
};

/* =========================================================
   AI PRODUCT ANALYSIS
   ========================================================= */

export type AIProductAnalysis = {
  confidence: number;

  category: ProductCategory;

  detectedName: string;

  description: string;

  /**
   * AI-estimated physical dimensions.
   *
   * These are estimates from the uploaded images
   * and must be verified by the tenant.
   */
  dimensions?: ProductDimensions;

  /**
   * Tenant-aware characteristic detections.
   */
  characteristics: AIDetectedCharacteristic[];

  /**
   * Backwards-compatible representation.
   */
  detectedOptions?: AIDetectedOption[];

  /**
   * Physical observations from the images.
   *
   * These are NOT tenant options.
   */
  detectedFeatures: string[];

  warnings: string[];
};

/* =========================================================
   AI PRODUCT DRAFT
   ========================================================= */

export type AIProductDraft = {
  name: string;

  description: string;

  category: ProductCategory;

  dimensions?: ProductDimensions;

  /**
   * Physical observations detected by AI.
   */
  detectedFeatures: string[];

  /**
   * Tenant-defined product characteristics.
   */
  options: ProductOption[];

  /**
   * Temporary image URLs or persisted image URLs.
   */
  images: string[];

  media?: ProductMedia[];

  model3DUrl?: string;

  analysisConfidence: number;

  warnings: string[];
};

/* =========================================================
   AI ANALYSIS REQUEST
   ========================================================= */

export type AIProductAnalysisRequest = {
  /**
   * Product images uploaded by the tenant.
   */
  images: File[];

  /**
   * Optional tenant ID.
   */
  tenantId?: string;

  /**
   * Characteristics configured by the tenant.
   *
   * AI uses this as the schema for what it should
   * attempt to identify.
   */
  characteristics?: TenantCharacteristic[];
};

/* =========================================================
   AI ANALYSIS RESPONSE
   ========================================================= */

export type AIProductAnalysisResponse = {
  analysis: AIProductAnalysis;

  draft: AIProductDraft;
};

/* =========================================================
   PRODUCT CREATION INPUT
   ========================================================= */

export type CreateProductInput = {
  name: string;

  description: string;

  category: ProductCategory;

  price: number;

  currency: string;
  quantity: number;
  dimensions?: ProductDimensions;

  /**
   * Tenant-defined characteristics.
   */
  options: ProductOption[];

  images: ProductImage[];

  media?: ProductMedia[];

  variants?: ProductVariant[];

  model3DUrl?: string;

  status: ProductStatus;
};

/* =========================================================
   PRODUCT REVIEW STATE
   ========================================================= */

export type ProductReviewState = {
  draft?: AIProductDraft;

  analysis?: AIProductAnalysis;

  images?: File[];

  imageUrls?: string[];
};
