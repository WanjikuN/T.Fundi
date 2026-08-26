import type {
  AIProductAnalysisRequest,
  AIProductAnalysisResponse,
  AIDetectedCharacteristic,
  ProductOption,
  ProductOptionValue,
  TenantCharacteristic,
} from "../types/catalog.types";

/* =========================================================
   HELPERS
   ========================================================= */

const createId = () =>
  `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

const createProductOption = (
  characteristic: TenantCharacteristic,
): ProductOption => ({
  id: `option-${characteristic.id}`,

  characteristicId: characteristic.id,

  name: characteristic.name,

  type: characteristic.type,

  required: characteristic.required,

  values: characteristic.values
    .filter((value) => value.active !== false)
    .map(
      (value): ProductOptionValue => ({
        id: value.id,

        name: value.name,

        description: value.description,

        hexCode: value.hexCode,

        imageUrl: value.imageUrl,

        images: value.images,

        active: value.active,
      }),
    ),
});

/* =========================================================
   TEMPORARY AI MATCHING
   =========================================================
 *
 * This is deliberately tenant-driven.
 *
 * Later this function will be replaced by the backend AI
 * service.
 *
 * The important contract remains the same:
 *
 * images + tenant characteristics
 *             ↓
 * AI detected characteristics
 */

const detectCharacteristic = (
  characteristic: TenantCharacteristic,
): AIDetectedCharacteristic => {
  const activeValues = characteristic.values.filter(
    (value) => value.active !== false,
  );

  const firstValue = activeValues[0];

  /*
   * TEMPORARY MOCK
   *
   * For now we use the first configured value so the
   * complete product workflow can be developed.
   *
   * The backend AI will eventually determine:
   *
   * - detected value
   * - valueId
   * - confidence
   */

  return {
    characteristicId: characteristic.id,

    characteristicName: characteristic.name,

    value:
      firstValue?.name ??
      "Not detected",

    valueId: firstValue?.id,

    confidence: firstValue ? 0.94 : 0,
  };
};

/* =========================================================
   ANALYSE PRODUCT
   ========================================================= */

export async function analyseProduct(
  input: AIProductAnalysisRequest,
): Promise<AIProductAnalysisResponse> {
  const {
    images,
    characteristics = [],
  } = input;

  if (!images.length) {
    throw new Error(
      "At least one product image is required.",
    );
  }

  /*
   * Convert tenant characteristics into product options.
   */

  const options: ProductOption[] =
    characteristics
      .filter(
        (characteristic) =>
          characteristic.active !== false,
      )
      .sort(
        (a, b) =>
          (a.sequence ?? 0) -
          (b.sequence ?? 0),
      )
      .map(createProductOption);

  /*
   * AI detections are generated from the tenant schema.
   */

  const detectedCharacteristics =
    characteristics
      .filter(
        (characteristic) =>
          characteristic.active !== false,
      )
      .sort(
        (a, b) =>
          (a.sequence ?? 0) -
          (b.sequence ?? 0),
      )
      .map(detectCharacteristic);

  /*
   * Automatically create the initial selections.
   *
   * This means the review page can immediately show
   * the AI's proposed values.
   */

  const selectedOptions: ProductOption[] =
    options.map((option) => {
      const detection =
        detectedCharacteristics.find(
          (item) =>
            item.characteristicId ===
            option.characteristicId,
        );

      if (!detection) {
        return option;
      }

      /*
       * Text / number / image characteristics don't
       * necessarily use selectable values.
       */

      if (
        option.type === "text" ||
        option.type === "number"
      ) {
        return {
          ...option,
          value: detection.value,
        };
      }

      return option;
    });

  /*
   * TEMPORARY PRODUCT DETECTION
   *
   * These will eventually come from the AI service.
   */

  const dimensions = {
    width: 220,
    depth: 90,
    height: 85,
    unit: "cm" as const,
  };

  const detectedFeatures = [
    "Three-seat configuration",
    "Timber frame",
    "Upholstered cushions",
  ];

  const warnings = [
    "Dimensions are estimated from the supplied images.",
    "Please verify measurements before publishing.",
  ];

  const detectedName = "New Furniture Product";

  const description =
    "A handcrafted furniture product prepared using AI-assisted product analysis.";

  return {
    analysis: {
      confidence:
        detectedCharacteristics.length > 0
          ? 0.94
          : 0.78,

      category: "other",

      detectedName,

      description,

      dimensions,

      characteristics:
        detectedCharacteristics,

      detectedFeatures,

      warnings,
    },

    draft: {
      name: detectedName,

      description,

      category: "other",

      dimensions,

      detectedFeatures,

      options: selectedOptions,

      images: images.map(() =>
        createId(),
      ),

      analysisConfidence:
        detectedCharacteristics.length > 0
          ? 0.94
          : 0.78,

      warnings,
    },
  };
}