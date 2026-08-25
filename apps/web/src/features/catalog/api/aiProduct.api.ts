import type {
  AIProductAnalysisRequest,
  AIProductAnalysisResponse,
  ProductOption,
} from "../types/catalog.types";

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
   * TEMPORARY FRONTEND MOCK
   *
   * The real implementation will send:
   *
   * POST /api/products/ai/analyse
   *
   * {
   *   images,
   *   tenantId,
   *   characteristics
   * }
   *
   * AI will then identify values ONLY within
   * the tenant's configured characteristics.
   */

  const options: ProductOption[] =
    characteristics.map((characteristic) => ({
      id: `option-${characteristic.id}`,

      characteristicId:
        characteristic.id,

      name: characteristic.name,

      type: characteristic.type,

      required:
        characteristic.required,

      values:
        characteristic.values.map(
          (value) => ({
            id: value.id,
            name: value.name,
            description:
              value.description,
            hexCode: value.hexCode,
            imageUrl:
              value.imageUrl,
            images: value.images,
            active: value.active,
          }),
        ),
    }));

  /*
   * Temporary mock detection.
   *
   * In the real AI implementation this will
   * be determined from the uploaded images.
   *
   * For now we use the first configured value
   * so that the complete frontend flow works.
   */

  const detectedCharacteristics =
    characteristics.map(
      (characteristic) => {
        const firstValue =
          characteristic.values[0];

        return {
          characteristicId:
            characteristic.id,

          characteristicName:
            characteristic.name,

          value:
            firstValue?.name ??
            "Not detected",

          valueId:
            firstValue?.id,

          confidence: firstValue
            ? 0.94
            : 0,
        };
      },
    );

  return {
    analysis: {
      confidence: 0.94,

      category: "sofas",

      detectedName: "Luna Sofa",

      description:
        "A contemporary handcrafted sofa designed for comfort and everyday living.",

      dimensions: {
        width: 220,
        depth: 90,
        height: 85,
        unit: "cm",
      },

      characteristics:
        detectedCharacteristics,

      detectedFeatures: [
        "Three-seat configuration",
        "Timber frame",
        "Upholstered cushions",
      ],

      warnings: [
        "Dimensions are estimated from the supplied images.",
        "Please verify measurements before publishing.",
      ],
    },

    draft: {
      name: "Luna Sofa",

      description:
        "A contemporary handcrafted sofa designed for comfort and everyday living.",

      category: "sofas",

      dimensions: {
        width: 220,
        depth: 90,
        height: 85,
        unit: "cm",
      },

      detectedFeatures: [
        "Three-seat configuration",
        "Timber frame",
        "Upholstered cushions",
      ],

      options,

      images: [],

      analysisConfidence: 0.94,

      warnings: [
        "Dimensions are estimated from the supplied images.",
        "Please verify measurements before publishing.",
      ],
    },
  };
}