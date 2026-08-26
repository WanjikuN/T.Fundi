import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  Image as ImageIcon,
  Ruler,
  Sparkles,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { toast } from "sonner";

import { createProduct } from "../api/products.api";

import ProductOptionsEditor from "../components/ProductOptionsEditor";
import ProductPhotoGallery from "../components/ProductPhotoGallery";

import type {
  AIProductAnalysis,
  AIProductDraft,
  CreateProductInput,
  ProductCategory,
  ProductImage,
  ProductOption,
} from "../types/catalog.types";

import { useTenant } from "../../../app/providers/TenantProvider";

/* =========================================================
   TYPES
   ========================================================= */

type ReviewState = {
  draft?: AIProductDraft;

  analysis?: AIProductAnalysis;

  images?: File[];

  imageUrls?: string[];
};

type DimensionUnit =
  | "cm"
  | "mm"
  | "in";

/* =========================================================
   CATEGORY LABELS
   ========================================================= */

const CATEGORY_LABELS: Record<
  ProductCategory,
  string
> = {
  sofas: "Sofas",
  chairs: "Chairs",
  tables: "Tables",
  beds: "Beds",
  storage: "Storage",
  outdoor: "Outdoor",
  lighting: "Lighting",
  desks: "Desks",
  other: "Other",
};

/* =========================================================
   PAGE
   ========================================================= */

const ProductReviewPage = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const {
    catalogSettings,
  } = useTenant();

  const state =
    location.state as ReviewState | null;

  const draft = state?.draft;

  const analysis = state?.analysis;

  /* =======================================================
     PRODUCT INFORMATION
     ======================================================= */

  const [productName, setProductName] =
    useState(
      draft?.name ??
        analysis?.detectedName ??
        "",
    );

  const [description, setDescription] =
    useState(
      draft?.description ??
        analysis?.description ??
        "",
    );

  const enabledCategories =
    catalogSettings.categories ?? [];

  const initialCategory =
    draft?.category ??
    analysis?.category;

  const [category, setCategory] =
    useState<ProductCategory>(
      initialCategory &&
        enabledCategories.includes(
          initialCategory,
        )
        ? initialCategory
        : enabledCategories[0] ??
            "other",
    );

  const [price, setPrice] =
    useState("");

  const [currency, setCurrency] =
    useState(
      catalogSettings.defaultCurrency ||
        "KES",
    );

  const [quantity, setQuantity] =
    useState("0");

  /* =======================================================
     OPTIONS
     ======================================================= */

  const initialOptions =
    useMemo<ProductOption[]>(
      () =>
        (draft?.options ?? []).filter(
          (option) =>
            option.characteristicId
              ? catalogSettings.characteristics.some(
                  (characteristic) =>
                    characteristic.id ===
                    option.characteristicId,
                )
              : true,
        ),
      [
        draft?.options,
        catalogSettings.characteristics,
      ],
    );

  const [options, setOptions] =
    useState<ProductOption[]>(
      initialOptions,
    );

  /* =======================================================
     SELECTED OPTIONS
     ======================================================= */

  const createInitialSelections =
    (): Record<string, string> => {
      const selections: Record<
        string,
        string
      > = {};

      initialOptions.forEach(
        (option) => {
          const detection =
            analysis?.characteristics?.find(
              (item) =>
                item.characteristicId ===
                option.characteristicId,
            );

          if (detection?.valueId) {
            selections[option.id] =
              detection.valueId;

            return;
          }

          if (
            option.type === "text" ||
            option.type === "number"
          ) {
            if (detection?.value) {
              selections[option.id] =
                detection.value;
            }

            return;
          }

          if (option.values.length > 0) {
            selections[option.id] =
              option.values[0].id;
          }
        },
      );

      return selections;
    };

  const [
    selectedOptions,
    setSelectedOptions,
  ] = useState<
    Record<string, string>
  >(createInitialSelections);

  /* =======================================================
     DIMENSIONS
     ======================================================= */

  const [width, setWidth] =
    useState(
      String(
        draft?.dimensions?.width ??
          analysis?.dimensions?.width ??
          "",
      ),
    );

  const [depth, setDepth] =
    useState(
      String(
        draft?.dimensions?.depth ??
          analysis?.dimensions?.depth ??
          "",
      ),
    );

  const [height, setHeight] =
    useState(
      String(
        draft?.dimensions?.height ??
          analysis?.dimensions?.height ??
          "",
      ),
    );

  const [unit, setUnit] =
    useState<DimensionUnit>(
      draft?.dimensions?.unit ??
        analysis?.dimensions?.unit ??
        "cm",
    );

  /* =======================================================
     UI
     ======================================================= */

  const [showAI, setShowAI] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  /* =======================================================
     IMAGE URLS
     ======================================================= */

  const imageUrls = useMemo(() => {
    if (state?.imageUrls?.length) {
      return state.imageUrls;
    }

    if (!state?.images?.length) {
      return [];
    }

    return state.images.map((file) =>
      URL.createObjectURL(file),
    );
  }, [
    state?.imageUrls,
    state?.images,
  ]);

  useEffect(() => {
    if (
      state?.imageUrls?.length ||
      !state?.images?.length
    ) {
      return;
    }

    return () => {
      imageUrls.forEach((url) =>
        URL.revokeObjectURL(url),
      );
    };
  }, [
    imageUrls,
    state?.imageUrls,
    state?.images,
  ]);

  /* =======================================================
     OPTION CHANGE
     ======================================================= */

  const handleOptionChange = (
    optionId: string,
    value: string,
  ) => {
    setSelectedOptions(
      (current) => ({
        ...current,
        [optionId]: value,
      }),
    );
  };

  /* =======================================================
     OPTION REMOVE
     ======================================================= */

  const handleRemoveOption = (
    optionId: string,
  ) => {
    setOptions(
      (current) =>
        current.filter(
          (option) =>
            option.id !== optionId,
        ),
    );

    setSelectedOptions(
      (current) => {
        const next = {
          ...current,
        };

        delete next[optionId];

        return next;
      },
    );
  };

  /* =======================================================
     PRODUCT IMAGES
     ======================================================= */

  const buildProductImages =
    (): ProductImage[] => {
      return imageUrls.map(
        (url, index) => ({
          id: `product-image-${index}-${Date.now()}`,

          url,

          sequence: index,

          alt: productName.trim()
            ? `${productName.trim()} image ${
                index + 1
              }`
            : `Product image ${
                index + 1
              }`,
        }),
      );
    };

  /* =======================================================
     PRODUCT OPTIONS
     ======================================================= */

  const buildProductOptions =
    (): ProductOption[] => {
      return options.map(
        (option) => {
          if (
            option.type === "text" ||
            option.type === "number"
          ) {
            return {
              ...option,

              value:
                selectedOptions[
                  option.id
                ] ?? "",
            };
          }

          return {
            ...option,
          };
        },
      );
    };

  /* =======================================================
     VARIANT
     ======================================================= */

  const buildVariant = () => {
    const selections: Record<
      string,
      string
    > = {};

    options.forEach(
      (option) => {
        const selected =
          selectedOptions[
            option.id
          ];

        if (!selected) {
          return;
        }

        if (!option.characteristicId) {
          return;
        }

        selections[
          option.characteristicId
        ] = selected;
      },
    );

    if (
      !Object.keys(selections)
        .length
    ) {
      return undefined;
    }

    return {
      id: `variant-${Date.now()}`,

      name: productName.trim(),

      selections,

      price: price
        ? Number(price)
        : undefined,

      currency:
        currency
          .trim()
          .toUpperCase(),

      images:
        buildProductImages(),

      media: draft?.media,

      model3DUrl:
        draft?.model3DUrl,

      active: true,
    };
  };

  /* =======================================================
     VALIDATION
     ======================================================= */

  const validateProduct = () => {
    if (!productName.trim()) {
      return "Product name is required.";
    }

    if (!description.trim()) {
      return "Product description is required.";
    }

    if (!category) {
      return "Product category is required.";
    }

    if (
      !catalogSettings.allowCustomCategories &&
      !enabledCategories.includes(
        category,
      )
    ) {
      return "This category is not enabled for this tenant.";
    }

    /* PRICE */

    if (
      catalogSettings.requirePrice &&
      !price.trim()
    ) {
      return "Product price is required.";
    }

    if (price.trim()) {
      const numericPrice =
        Number(price);

      if (
        Number.isNaN(
          numericPrice,
        ) ||
        numericPrice < 0
      ) {
        return "Enter a valid product price.";
      }
    }

    if (!currency.trim()) {
      return "Currency is required.";
    }

    /* QUANTITY */

    const numericQuantity =
      Number(quantity);

    if (
      Number.isNaN(
        numericQuantity,
      ) ||
      numericQuantity < 0
    ) {
      return "Enter a valid quantity.";
    }

    /* DIMENSIONS */

    if (
      catalogSettings.requireDimensions
    ) {
      if (
        !width ||
        !depth ||
        !height
      ) {
        return "Product dimensions are required.";
      }

      const dimensions = [
        Number(width),
        Number(depth),
        Number(height),
      ];

      if (
        dimensions.some(
          (value) =>
            Number.isNaN(value) ||
            value <= 0,
        )
      ) {
        return "Enter valid product dimensions.";
      }
    } else {
      const enteredDimensions = [
        width,
        depth,
        height,
      ].some(Boolean);

      if (enteredDimensions) {
        const dimensions = [
          Number(width),
          Number(depth),
          Number(height),
        ];

        if (
          dimensions.some(
            (value) =>
              Number.isNaN(value) ||
              value <= 0,
          )
        ) {
          return "Enter valid product dimensions.";
        }
      }
    }

    /* CHARACTERISTICS */

    for (const option of options) {
      if (!option.required) {
        continue;
      }

      const selected =
        selectedOptions[
          option.id
        ];

      if (
        selected === undefined ||
        selected === ""
      ) {
        return `${option.name} is required.`;
      }
    }

    if (!imageUrls.length) {
      return "At least one product image is required.";
    }

    return null;
  };

  /* =======================================================
     SAVE
     ======================================================= */

  const handleSave = async () => {
    const validationError =
      validateProduct();

    if (validationError) {
      toast.error(
        "Product needs attention",
        {
          description:
            validationError,
        },
      );

      return;
    }

    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const productImages =
        buildProductImages();

      const productOptions =
        buildProductOptions();

      const variant =
        buildVariant();

      const input: CreateProductInput =
        {
          name: productName.trim(),

          description:
            description.trim(),

          category,

          price: price.trim()
            ? Number(price)
            : 0,

          currency:
            currency
              .trim()
              .toUpperCase(),

          quantity:
            Number(quantity),

          dimensions:
            catalogSettings.requireDimensions ||
            width ||
            depth ||
            height
              ? {
                  width:
                    Number(width),
                  depth:
                    Number(depth),
                  height:
                    Number(height),
                  unit,
                }
              : undefined,

          options:
            productOptions,

          images:
            productImages,

          media: draft?.media,

          variants: variant
            ? [variant]
            : undefined,

          model3DUrl:
            draft?.model3DUrl,

          status: "draft",
        };

      await toast.promise(
        createProduct(input),
        {
          loading:
            "Saving product...",

          success:
            "Product saved as draft.",

          error: (error) =>
            error instanceof Error
              ? error.message
              : "Unable to save the product.",
        },
      );

      navigate("/catalog", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Failed to create product:",
        error,
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =======================================================
     AI DATA
     ======================================================= */

  const aiConfidence = useMemo(() => {
    const result: Record<
      string,
      number
    > = {};

    analysis?.characteristics?.forEach(
      (item) => {
        if (
          !item.characteristicId
        ) {
          return;
        }

        result[
          `option-${item.characteristicId}`
        ] = item.confidence;
      },
    );

    return result;
  }, [
    analysis?.characteristics,
  ]);

  const aiDetectedValues =
    useMemo(() => {
      const result: Record<
        string,
        string
      > = {};

      analysis?.characteristics?.forEach(
        (item) => {
          if (
            !item.characteristicId
          ) {
            return;
          }

          result[
            `option-${item.characteristicId}`
          ] = item.value;
        },
      );

      return result;
    }, [
      analysis?.characteristics,
    ]);

  /* =======================================================
     EMPTY
     ======================================================= */

  if (!draft && !analysis) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[var(--color-background)] px-4">

        <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm">

          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-primary) 10%, transparent)",
              color:
                "var(--color-primary)",
            }}
          >
            <Sparkles size={24} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            No product draft found
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Start by creating a product with AI.
          </p>

          <Link
            to="/catalog/products/new"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-[var(--color-primary-foreground)]"
            style={{
              backgroundColor:
                "var(--color-primary)",
            }}
          >
            <Sparkles size={17} />
            Create product
          </Link>

        </div>

      </main>
    );
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main className="h-[calc(100vh-4rem)] overflow-hidden bg-[var(--color-background)]">

      <div className="mx-auto flex h-full max-w-[1500px] flex-col px-4 py-4 sm:px-6 lg:px-8">

        <header className="shrink-0">

          <Link
            to="/catalog/products/new"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={16} />
            Back to product creation
          </Link>

          <div className="mt-3 flex items-start justify-between gap-4">

            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{
                  color:
                    "var(--color-primary)",
                }}
              >
                Product Review
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900">
                Review your product
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Confirm the AI results before saving
                this product to your catalog.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowAI(
                  (current) =>
                    !current,
                )
              }
              className="hidden items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-gray-700 lg:flex"
            >
              <Sparkles size={15} />
              {showAI
                ? "Hide AI"
                : "Show AI"}
            </button>

          </div>

        </header>

        <div className="mt-4 min-h-0 flex-1 overflow-hidden">

          <div className="grid h-full min-h-0 gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">

            <section className="min-h-0 overflow-y-auto pr-1">

              {/* PHOTOS */}

              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">

                <div className="flex items-center gap-3">

                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                      color:
                        "var(--color-primary)",
                    }}
                  >
                    <ImageIcon size={18} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                      Product media
                    </p>

                    <h2 className="text-lg font-semibold text-gray-900">
                      Product images
                    </h2>
                  </div>

                </div>

                <div className="mt-5">
                  <ProductPhotoGallery
                    imageUrls={
                      imageUrls
                    }
                  />
                </div>

              </div>

              {/* PRODUCT DETAILS */}

              <div className="mt-5 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">

                <p
                  className="text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{
                    color:
                      "var(--color-primary)",
                  }}
                >
                  Product information
                </p>

                <div className="mt-4 space-y-4">

                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Product name
                    </label>

                    <input
                      value={
                        productName
                      }
                      onChange={(event) =>
                        setProductName(
                          event.target
                            .value,
                        )
                      }
                      className="mt-2 h-11 w-full rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Description
                    </label>

                    <textarea
                      value={
                        description
                      }
                      onChange={(event) =>
                        setDescription(
                          event.target
                            .value,
                        )
                      }
                      rows={5}
                      className="mt-2 w-full resize-none rounded-xl border border-black/10 px-3 py-3 text-sm outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>

                  {/* CATEGORY */}

                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Category
                    </label>

                    <select
                      value={
                        category
                      }
                      onChange={(event) =>
                        setCategory(
                          event.target
                            .value as ProductCategory,
                        )
                      }
                      className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                    >
                      {enabledCategories.map(
                        (categoryValue) => (
                          <option
                            key={
                              categoryValue
                            }
                            value={
                              categoryValue
                            }
                          >
                            {
                              CATEGORY_LABELS[
                                categoryValue
                              ]
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  {/* PRICE */}

                  <div className="grid gap-3 sm:grid-cols-[1fr_120px]">

                    <div>
                      <label className="text-xs font-semibold text-gray-600">
                        Price
                        {catalogSettings.requirePrice && (
                          <span className="ml-1 text-red-500">
                            *
                          </span>
                        )}
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          price
                        }
                        onChange={(event) =>
                          setPrice(
                            event.target
                              .value,
                          )
                        }
                        className="mt-2 h-11 w-full rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600">
                        Currency
                      </label>

                      <input
                        value={
                          currency
                        }
                        onChange={(event) =>
                          setCurrency(
                            event.target
                              .value
                              .toUpperCase(),
                          )
                        }
                        maxLength={3}
                        className="mt-2 h-11 w-full rounded-xl border border-black/10 px-3 text-sm font-semibold uppercase outline-none focus:border-[var(--color-primary)]"
                      />
                    </div>

                  </div>

                  {/* QUANTITY */}

                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Quantity
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        quantity
                      }
                      onChange={(event) =>
                        setQuantity(
                          event.target
                            .value,
                        )
                      }
                      className="mt-2 h-11 w-full rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>

                </div>

              </div>

              {/* DIMENSIONS */}

              <div className="mt-5 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                        color:
                          "var(--color-primary)",
                      }}
                    >
                      <Ruler size={18} />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                        Physical specifications
                      </p>

                      <h2 className="text-lg font-semibold text-gray-900">
                        Dimensions
                      </h2>
                    </div>

                  </div>

                  {catalogSettings.requireDimensions && (
                    <span className="rounded-full bg-black/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      Required
                    </span>
                  )}

                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-4">

                  <DimensionInput
                    label="Width"
                    value={width}
                    onChange={
                      setWidth
                    }
                  />

                  <DimensionInput
                    label="Depth"
                    value={depth}
                    onChange={
                      setDepth
                    }
                  />

                  <DimensionInput
                    label="Height"
                    value={height}
                    onChange={
                      setHeight
                    }
                  />

                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Unit
                    </label>

                    <select
                      value={
                        unit
                      }
                      onChange={(event) =>
                        setUnit(
                          event.target
                            .value as DimensionUnit,
                        )
                      }
                      className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                    >
                      <option value="cm">
                        cm
                      </option>

                      <option value="mm">
                        mm
                      </option>

                      <option value="in">
                        in
                      </option>
                    </select>
                  </div>

                </div>

              </div>

              {/* OPTIONS */}

              {options.length > 0 && (
                <div className="mt-5 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">

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

                  <p className="mt-1 text-xs text-gray-500">
                    These characteristics come from
                    this tenant's Catalog Settings.
                  </p>

                  <div className="mt-5">

                    <ProductOptionsEditor
                      options={
                        options
                      }
                      selectedValues={
                        selectedOptions
                      }
                      onChange={
                        handleOptionChange
                      }
                      onRemove={
                        handleRemoveOption
                      }
                      aiConfidence={
                        aiConfidence
                      }
                      aiDetectedValues={
                        aiDetectedValues
                      }
                    />

                  </div>

                </div>
              )}

            </section>

            {/* RIGHT */}

            <aside className="hidden min-h-0 overflow-y-auto lg:block">

              {showAI && analysis ? (
                <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">

                  <div className="flex items-center gap-3">

                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                        color:
                          "var(--color-primary)",
                      }}
                    >
                      <Sparkles size={18} />
                    </div>

                    <div>
                      <p
                        className="text-[10px] font-bold uppercase tracking-[0.18em]"
                        style={{
                          color:
                            "var(--color-primary)",
                        }}
                      >
                        AI analysis
                      </p>

                      <h2 className="text-base font-semibold text-gray-900">
                        Detected information
                      </h2>
                    </div>

                  </div>

                  <div className="mt-5">
                    <Detection
                      label="Detected features"
                      values={
                        analysis.detectedFeatures ??
                        []
                      }
                    />
                  </div>

                </div>
              ) : (
                <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">

                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.18em]"
                    style={{
                      color:
                        "var(--color-primary)",
                    }}
                  >
                    Tenant settings
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    Product rules
                  </h2>

                  <div className="mt-5 space-y-3">

                    <SettingStatus
                      label="Price"
                      enabled={
                        catalogSettings.requirePrice ??
                        false
                      }
                    />

                    <SettingStatus
                      label="Dimensions"
                      enabled={
                        catalogSettings.requireDimensions ??
                        false
                      }
                    />

                    <SettingStatus
                      label="Custom categories"
                      enabled={
                        catalogSettings.allowCustomCategories ??
                        false
                      }
                    />

                    <SettingStatus
                      label="Custom characteristics"
                      enabled={
                        catalogSettings.allowCustomCharacteristics ??
                        false
                      }
                    />

                  </div>

                  <div className="mt-5 border-t border-black/[0.06] pt-5">

                    <p className="text-xs font-semibold text-gray-500">
                      Default currency
                    </p>

                    <p
                      className="mt-1 text-lg font-bold"
                      style={{
                        color:
                          "var(--color-primary)",
                      }}
                    >
                      {
                        catalogSettings.defaultCurrency
                      }
                    </p>

                  </div>

                </div>
              )}

            </aside>

          </div>

        </div>

        {/* SAVE */}

        <footer className="mt-4 shrink-0 rounded-2xl border border-black/10 bg-white shadow-sm">

          <div className="flex items-center justify-between gap-4 p-4">

            <p className="hidden text-xs text-gray-400 sm:block">
              This product will be saved as a draft.
            </p>

            <button
              type="button"
              onClick={
                handleSave
              }
              disabled={
                isSaving
              }
              className="ml-auto flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-[var(--color-primary-foreground)] disabled:opacity-60"
              style={{
                backgroundColor:
                  "var(--color-primary)",
              }}
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={17} />
                  Save Product
                </>
              )}
            </button>

          </div>

        </footer>

      </div>
    </main>
  );
};

/* =========================================================
   DIMENSION INPUT
   ========================================================= */

type DimensionInputProps = {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
};

const DimensionInput = ({
  label,
  value,
  onChange,
}: DimensionInputProps) => (
  <div>
    <label className="text-xs font-semibold text-gray-600">
      {label}
    </label>

    <input
      type="number"
      min="0"
      value={value}
      onChange={(event) =>
        onChange(
          event.target.value,
        )
      }
      className="mt-2 h-11 w-full rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-[var(--color-primary)]"
      placeholder="0"
    />
  </div>
);

/* =========================================================
   SETTING STATUS
   ========================================================= */

type SettingStatusProps = {
  label: string;
  enabled: boolean;
};

const SettingStatus = ({
  label,
  enabled,
}: SettingStatusProps) => (
  <div className="flex items-center justify-between rounded-xl bg-black/[0.025] px-3 py-2.5">

    <span className="text-xs font-medium text-gray-600">
      {label}
    </span>

    <span
      className={`text-[10px] font-bold uppercase tracking-wide ${
        enabled
          ? "text-green-600"
          : "text-gray-400"
      }`}
    >
      {enabled
        ? "Required"
        : "Optional"}
    </span>

  </div>
);

/* =========================================================
   DETECTION
   ========================================================= */

type DetectionProps = {
  label: string;
  values: string[];
};

const Detection = ({
  label,
  values,
}: DetectionProps) => (
  <div>

    <p className="text-xs font-semibold text-gray-500">
      {label}
    </p>

    <div className="mt-2 flex flex-wrap gap-2">

      {values.length ? (
        values.map(
          (
            value,
            index,
          ) => (
            <span
              key={`${value}-${index}`}
              className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs text-gray-700"
            >
              {value}
            </span>
          ),
        )
      ) : (
        <span className="text-xs text-gray-400">
          None detected
        </span>
      )}

    </div>

  </div>
);

export default ProductReviewPage;