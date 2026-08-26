import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  Image as ImageIcon,
  Ruler,
  Sparkles,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

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

/* =========================================================
   TYPES
   ========================================================= */

type ReviewState = {
  draft?: AIProductDraft;
  analysis?: AIProductAnalysis;
  images?: File[];
  imageUrls?: string[];
};

type DimensionUnit = "cm" | "mm" | "in";

/* =========================================================
   CATEGORY OPTIONS
   ========================================================= */

const PRODUCT_CATEGORIES: {
  value: ProductCategory;
  label: string;
}[] = [
  { value: "sofas", label: "Sofas" },
  { value: "chairs", label: "Chairs" },
  { value: "tables", label: "Tables" },
  { value: "beds", label: "Beds" },
  { value: "storage", label: "Storage" },
  { value: "outdoor", label: "Outdoor" },
  { value: "lighting", label: "Lighting" },
  { value: "desks", label: "Desks" },
  { value: "other", label: "Other" },
];

/* =========================================================
   PAGE
   ========================================================= */

const ProductReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState("0");
  const state = location.state as ReviewState | null;

  const draft = state?.draft;
  const analysis = state?.analysis;

  /* =======================================================
     PRODUCT INFORMATION
     ======================================================= */

  const [productName, setProductName] = useState(
    draft?.name ?? analysis?.detectedName ?? "",
  );

  const [description, setDescription] = useState(
    draft?.description ?? analysis?.description ?? "",
  );

  const [category, setCategory] = useState<ProductCategory>(
    draft?.category ?? analysis?.category ?? "other",
  );

  const [price, setPrice] = useState("");

  const [currency, setCurrency] = useState("KES");

  /* =======================================================
     CHARACTERISTIC SELECTIONS
     ======================================================= */

  const createInitialSelections = (): Record<string, string> => {
    const selections: Record<string, string> = {};

    const options = draft?.options ?? [];

    options.forEach((option) => {
      const detection = analysis?.characteristics?.find(
        (item) => item.characteristicId === option.characteristicId,
      );

      /*
       * AI matched a tenant-configured value.
       */
      if (detection?.valueId) {
        selections[option.id] = detection.valueId;

        return;
      }

      /*
       * Free-input characteristic.
       */
      if (option.type === "text" || option.type === "number") {
        if (detection?.value) {
          selections[option.id] = detection.value;
        }

        return;
      }

      /*
       * Select the first tenant-configured
       * value when AI did not detect one.
       */
      if (option.values.length > 0) {
        selections[option.id] = option.values[0].id;
      }
    });

    return selections;
  };

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(createInitialSelections);

  /* =======================================================
     DIMENSIONS
     ======================================================= */

  const [width, setWidth] = useState(
    String(draft?.dimensions?.width ?? analysis?.dimensions?.width ?? ""),
  );

  const [depth, setDepth] = useState(
    String(draft?.dimensions?.depth ?? analysis?.dimensions?.depth ?? ""),
  );

  const [height, setHeight] = useState(
    String(draft?.dimensions?.height ?? analysis?.dimensions?.height ?? ""),
  );

  const [unit, setUnit] = useState<DimensionUnit>(
    draft?.dimensions?.unit ?? analysis?.dimensions?.unit ?? "cm",
  );

  /* =======================================================
     UI STATE
     ======================================================= */

  const [showAI, setShowAI] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  /* =======================================================
     OPTIONS
     ======================================================= */

  const options: ProductOption[] = draft?.options ?? [];

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

    return state.images.map((file) => URL.createObjectURL(file));
  }, [state?.imageUrls, state?.images]);

  /*
   * Revoke only object URLs generated
   * from local File objects.
   */
  useEffect(() => {
    if (!state?.images?.length) {
      return;
    }

    return () => {
      imageUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imageUrls, state?.images]);

  /* =======================================================
     OPTION HANDLERS
     ======================================================= */

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((current) => ({
      ...current,
      [optionId]: value,
    }));
  };

  const handleRemoveOption = (optionId: string) => {
    setSelectedOptions((current) => {
      const next = {
        ...current,
      };

      delete next[optionId];

      return next;
    });
  };

  /* =======================================================
     PRODUCT IMAGES
     ======================================================= */

  const buildProductImages = (): ProductImage[] => {
    return imageUrls.map((url, index) => ({
      id: `product-image-${index}-${Date.now()}`,
      url,
      sequence: index,
      alt: productName.trim()
        ? `${productName.trim()} image ${index + 1}`
        : `Product image ${index + 1}`,
    }));
  };

  /* =======================================================
     PRODUCT OPTIONS
     ======================================================= */

  const buildProductOptions = (): ProductOption[] => {
    return options.map((option) => {
      const selectedValue = selectedOptions[option.id];

      /*
       * Text and number characteristics
       * store their actual value directly.
       */
      if (option.type === "text" || option.type === "number") {
        return {
          ...option,
          value: selectedValue ?? "",
        };
      }

      /*
       * Selectable characteristics retain
       * the tenant-configured option values.
       */
      return {
        ...option,
      };
    });
  };

  /* =======================================================
     INITIAL VARIANT
     ======================================================= */

  const buildVariant = () => {
    const selections: Record<string, string> = {};

    options.forEach((option) => {
      const selected = selectedOptions[option.id];

      if (!selected) {
        return;
      }

      if (!option.characteristicId) {
        return;
      }

      selections[option.characteristicId] = selected;
    });

    if (!Object.keys(selections).length) {
      return undefined;
    }

    return {
      id: `variant-${Date.now()}`,
      name: productName.trim(),
      selections,
      price: price ? Number(price) : undefined,
      currency: currency.trim().toUpperCase(),
      images: buildProductImages(),
      media: draft?.media,
      model3DUrl: draft?.model3DUrl,
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

    if (!price.trim()) {
      return "Product price is required.";
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return "Enter a valid product price.";
    }

    if (!currency.trim()) {
      return "Currency is required.";
    }

    if (!width || !depth || !height) {
      return "Product dimensions are required.";
    }

    const dimensions = [Number(width), Number(depth), Number(height)];

    if (dimensions.some((value) => Number.isNaN(value) || value <= 0)) {
      return "Enter valid product dimensions.";
    }

    /*
     * Required tenant characteristics.
     */
    for (const option of options) {
      if (!option.required) {
        continue;
      }

      const selected = selectedOptions[option.id];

      if (selected === undefined || selected === "") {
        return `${option.name} is required.`;
      }
    }

    if (!imageUrls.length) {
      return "At least one product image is required.";
    }

    return null;
  };

  /* =======================================================
     SAVE PRODUCT
     ======================================================= */

  const handleSave = async () => {
    const validationError = validateProduct();

    if (validationError) {
      toast.error("Product needs attention", {
        description: validationError,
      });

      return;
    }

    if (isSaving) {
      return;
    }

    setIsSaving(true);

    const savePromise = (async () => {
      const productImages = buildProductImages();

      const productOptions = buildProductOptions();

      const variant = buildVariant();

      const input: CreateProductInput = {
        name: productName.trim(),

        description: description.trim(),

        category,

        price: Number(price),

        currency: currency.trim().toUpperCase(),
        quantity: Number(quantity),
        dimensions: {
          width: Number(width),
          depth: Number(depth),
          height: Number(height),
          unit,
        },

        options: productOptions,

        images: productImages,

        media: draft?.media,

        variants: variant ? [variant] : undefined,

        model3DUrl: draft?.model3DUrl,

        /*
         * Product enters the catalog as a draft.
         * Publishing remains a deliberate action.
         */
        status: "draft",
      };

      return createProduct(input);
    })();

    try {
      const createdProduct = await toast.promise(savePromise, {
        loading: "Saving product...",
        success: "Product saved as draft.",
        error: (error) =>
          error instanceof Error
            ? error.message
            : "Unable to save the product. Please try again.",
      });

      console.log("Product created successfully:", createdProduct);

      navigate("/catalog", {
        replace: true,
      });
    } catch (error) {
      console.error("Failed to create product:", error);
    } finally {
      setIsSaving(false);
    }
  };

  /* =======================================================
     AI DETECTIONS
     ======================================================= */

  const aiConfidence = useMemo(() => {
    const result: Record<string, number> = {};

    analysis?.characteristics?.forEach((item) => {
      if (!item.characteristicId) {
        return;
      }

      result[`option-${item.characteristicId}`] = item.confidence;
    });

    return result;
  }, [analysis?.characteristics]);

  const aiDetectedValues = useMemo(() => {
    const result: Record<string, string> = {};

    analysis?.characteristics?.forEach((item) => {
      if (!item.characteristicId) {
        return;
      }

      result[`option-${item.characteristicId}`] = item.value;
    });

    return result;
  }, [analysis?.characteristics]);

  /* =======================================================
     EMPTY STATE
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
              color: "var(--color-primary)",
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
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-[var(--color-primary-foreground)] transition hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--color-primary)",
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
        {/* =================================================
            HEADER
           ================================================= */}

        <header className="shrink-0">
          <Link
            to="/catalog/products/new"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={17} />
            Back to AI Product Studio
          </Link>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{
                  color: "var(--color-primary)",
                }}
              >
                Product Review
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Review & Edit
              </h1>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Verify the AI-generated product before adding it to your
                catalog.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 sm:flex">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: "var(--color-primary)",
                }}
              />

              <span className="text-xs font-medium text-gray-500">
                AI draft · Review required
              </span>
            </div>
          </div>
        </header>

        {/* =================================================
            WORKSPACE
           ================================================= */}

        <div className="mt-5 grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
          {/* =================================================
              EDITOR
             ================================================= */}

          <section className="min-h-0 overflow-y-auto pr-1 lg:pr-3">
            <div className="space-y-5 pb-8">
              {/* PRODUCT INFORMATION */}

              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
                <SectionHeading eyebrow="Product" title="Product information" />

                <div className="mt-5 space-y-4">
                  <Field
                    label="Product name"
                    value={productName}
                    onChange={setProductName}
                    placeholder="Enter product name"
                  />

                  <CategoryField value={category} onChange={setCategory} />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Price"
                      value={price}
                      onChange={setPrice}
                      type="number"
                      placeholder="Enter price"
                    />

                    <Field
                      label="Currency"
                      value={currency}
                      onChange={(value) => setCurrency(value.toUpperCase())}
                      placeholder="KES"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-800">
                      Description
                    </label>

                    <textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={4}
                      placeholder="Describe the product..."
                      className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]"
                    />
                  </div>
                </div>
              </div>

              {/* CHARACTERISTICS */}

              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <SectionHeading
                    eyebrow="Tenant configuration"
                    title="Product characteristics"
                  />

                  {options.length > 0 && (
                    <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[10px] font-semibold text-gray-500">
                      {options.length} configured
                    </span>
                  )}
                </div>

                {options.length > 0 ? (
                  <ProductOptionsEditor
                    options={options}
                    selectedValues={selectedOptions}
                    aiConfidence={aiConfidence}
                    aiDetectedValues={aiDetectedValues}
                    onChange={handleOptionChange}
                    onRemoveOption={handleRemoveOption}
                  />
                ) : (
                  <EmptyInlineState
                    icon={<Sparkles size={17} />}
                    text="No tenant characteristics were configured for this product."
                  />
                )}
              </div>

              {/* DIMENSIONS */}

              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
                <SectionHeading
                  eyebrow="Measurements"
                  title="Dimensions"
                  icon={<Ruler size={17} />}
                />

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  AI estimates these measurements from your photos. Verify them
                  before publishing.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <NumberField
                    label="Width"
                    value={width}
                    onChange={setWidth}
                  />

                  <NumberField
                    label="Depth"
                    value={depth}
                    onChange={setDepth}
                  />

                  <NumberField
                    label="Height"
                    value={height}
                    onChange={setHeight}
                  />

                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Unit
                    </label>

                    <select
                      value={unit}
                      onChange={(event) =>
                        setUnit(event.target.value as DimensionUnit)
                      }
                      className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold outline-none transition focus:border-[var(--color-primary)]"
                    >
                      <option value="cm">cm</option>

                      <option value="mm">mm</option>

                      <option value="in">inches</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* MEDIA */}

              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
                <SectionHeading
                  eyebrow="Media"
                  title="Product media"
                  icon={<ImageIcon size={17} />}
                />

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <MediaStat label="Images" value={imageUrls.length} />

                  <MediaStat
                    label="3D model"
                    value={draft?.model3DUrl ? "Ready" : "None"}
                  />

                  <MediaStat
                    label="AI analysis"
                    value={analysis ? "Complete" : "None"}
                  />

                  <MediaStat label="Status" value="Draft" />
                </div>
              </div>

              {/* AI OBSERVATIONS */}

              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
                <button
                  type="button"
                  onClick={() => setShowAI((current) => !current)}
                  className="flex w-full items-center justify-between text-left"
                  aria-expanded={showAI}
                >
                  <SectionHeading
                    eyebrow="AI"
                    title="AI observations"
                    icon={<Sparkles size={17} />}
                  />

                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform ${
                      showAI ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showAI && (
                  <div className="mt-5 space-y-5">
                    <Detection
                      label="Physical characteristics"
                      values={analysis?.detectedFeatures ?? []}
                    />

                    <div>
                      <p className="text-xs font-semibold text-gray-500">
                        Tenant characteristic matches
                      </p>

                      <div className="mt-2 space-y-2">
                        {analysis?.characteristics?.length ? (
                          analysis.characteristics.map((item, index) => (
                            <div
                              key={`${item.characteristicName}-${item.value}-${index}`}
                              className="flex items-center justify-between gap-4 rounded-xl bg-black/[0.025] px-3 py-2.5"
                            >
                              <span className="text-xs text-gray-500">
                                {item.characteristicName}
                              </span>

                              <span className="text-right text-xs font-semibold text-gray-800">
                                {item.value}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="rounded-xl bg-black/[0.025] px-3 py-3 text-xs text-gray-400">
                            No tenant characteristics detected.
                          </p>
                        )}
                      </div>
                    </div>

                    {analysis?.warnings?.map((warning) => (
                      <p
                        key={warning}
                        className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-700"
                      >
                        {warning}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* =================================================
              PREVIEW
             ================================================= */}

          <aside className="hidden min-h-0 lg:block">
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
              {/* GALLERY */}

              <div className="shrink-0">
                <ProductPhotoGallery
                  images={imageUrls}
                  productName={productName}
                />
              </div>

              {/* PREVIEW CONTENT */}

              <div className="min-h-0 flex-1 overflow-y-auto border-t border-black/[0.06] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.18em]"
                    style={{
                      color: "var(--color-primary)",
                    }}
                  >
                    Live preview
                  </p>

                  <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[10px] font-semibold text-gray-500">
                    Draft
                  </span>
                </div>

                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  {productName || "Unnamed product"}
                </h2>

                <p className="mt-2 line-clamp-3 text-xs leading-5 text-gray-500">
                  {description || "No description yet."}
                </p>

                {price && (
                  <p className="mt-4 text-lg font-bold text-gray-900">
                    {currency.toUpperCase()} {Number(price).toLocaleString()}
                  </p>
                )}

                <div className="mt-5 space-y-2">
                  <PreviewRow
                    label="Category"
                    value={
                      PRODUCT_CATEGORIES.find((item) => item.value === category)
                        ?.label ?? category
                    }
                  />

                  {options.map((option) => {
                    const selected = option.values.find(
                      (value) => value.id === selectedOptions[option.id],
                    );

                    const freeInput = selectedOptions[option.id];

                    return (
                      <PreviewRow
                        key={option.id}
                        label={option.name}
                        value={selected?.name ?? freeInput ?? "Not selected"}
                      />
                    );
                  })}

                  <PreviewRow
                    label="Dimensions"
                    value={
                      width && depth && height
                        ? `${width} × ${depth} × ${height} ${unit}`
                        : "Not specified"
                    }
                  />

                  <PreviewRow label="Images" value={`${imageUrls.length}`} />

                  <PreviewRow
                    label="3D"
                    value={draft?.model3DUrl ? "Available" : "Not available"}
                  />
                </div>
              </div>

              {/* DESKTOP SAVE */}

              <SaveButton isSaving={isSaving} onClick={handleSave} />
            </div>
          </aside>
        </div>

        {/* =================================================
            MOBILE SAVE
           ================================================= */}

        <div className="mt-3 shrink-0 lg:hidden">
          <SaveButton isSaving={isSaving} onClick={handleSave} />
        </div>
      </div>
    </main>
  );
};

/* =========================================================
   SECTION HEADING
   ========================================================= */

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  icon?: ReactNode;
};

const SectionHeading = ({ eyebrow, title, icon }: SectionHeadingProps) => (
  <div className="flex items-center gap-3">
    {icon && (
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-primary) 10%, transparent)",
          color: "var(--color-primary)",
        }}
      >
        {icon}
      </div>
    )}

    <div>
      <p
        className="text-[10px] font-bold uppercase tracking-[0.18em]"
        style={{
          color: "var(--color-primary)",
        }}
      >
        {eyebrow}
      </p>

      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
    </div>
  </div>
);

/* =========================================================
   FIELD
   ========================================================= */

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
};

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: FieldProps) => (
  <div>
    <label className="text-sm font-semibold text-gray-800">{label}</label>

    <input
      type={type}
      value={value}
      placeholder={placeholder}
      min={type === "number" ? "0" : undefined}
      onChange={(event) => onChange(event.target.value)}
      className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]"
    />
  </div>
);

/* =========================================================
   CATEGORY FIELD
   ========================================================= */

type CategoryFieldProps = {
  value: ProductCategory;
  onChange: (value: ProductCategory) => void;
};

const CategoryField = ({ value, onChange }: CategoryFieldProps) => (
  <div>
    <label className="text-sm font-semibold text-gray-800">Category</label>

    <select
      value={value}
      onChange={(event) => onChange(event.target.value as ProductCategory)}
      className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]"
    >
      {PRODUCT_CATEGORIES.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  </div>
);

/* =========================================================
   NUMBER FIELD
   ========================================================= */

type NumberFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const NumberField = ({ label, value, onChange }: NumberFieldProps) => (
  <div>
    <label className="text-xs font-medium text-gray-500">{label}</label>

    <input
      type="number"
      min="0"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]"
    />
  </div>
);

/* =========================================================
   PREVIEW ROW
   ========================================================= */

type PreviewRowProps = {
  label: string;
  value: string;
};

const PreviewRow = ({ label, value }: PreviewRowProps) => (
  <div className="flex items-center justify-between gap-4 rounded-xl bg-black/[0.025] px-3 py-2.5">
    <span className="text-xs text-gray-500">{label}</span>

    <span className="max-w-[60%] truncate text-right text-xs font-semibold text-gray-800">
      {value}
    </span>
  </div>
);

/* =========================================================
   MEDIA STAT
   ========================================================= */

type MediaStatProps = {
  label: string;
  value: string | number;
};

const MediaStat = ({ label, value }: MediaStatProps) => (
  <div className="rounded-2xl bg-black/[0.025] p-3">
    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
      {label}
    </p>

    <p className="mt-1 text-sm font-bold text-gray-800">{value}</p>
  </div>
);

/* =========================================================
   EMPTY INLINE STATE
   ========================================================= */

type EmptyInlineStateProps = {
  icon: ReactNode;
  text: string;
};

const EmptyInlineState = ({ icon, text }: EmptyInlineStateProps) => (
  <div className="flex items-center gap-3 rounded-2xl bg-black/[0.025] p-4">
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-primary) 10%, transparent)",
        color: "var(--color-primary)",
      }}
    >
      {icon}
    </div>

    <p className="text-xs leading-5 text-gray-500">{text}</p>
  </div>
);

/* =========================================================
   DETECTION
   ========================================================= */

type DetectionProps = {
  label: string;
  values: string[];
};

const Detection = ({ label, values }: DetectionProps) => (
  <div>
    <p className="text-xs font-semibold text-gray-500">{label}</p>

    <div className="mt-2 flex flex-wrap gap-2">
      {values.length ? (
        values.map((value, index) => (
          <span
            key={`${value}-${index}`}
            className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs text-gray-700"
          >
            {value}
          </span>
        ))
      ) : (
        <span className="text-xs text-gray-400">None detected</span>
      )}
    </div>
  </div>
);

/* =========================================================
   SAVE BUTTON
   ========================================================= */

type SaveButtonProps = {
  isSaving: boolean;
  onClick: () => void;
};

const SaveButton = ({ isSaving, onClick }: SaveButtonProps) => (
  <div className="shrink-0 border-t border-black/10 bg-white p-4">
    <button
      type="button"
      onClick={onClick}
      disabled={isSaving}
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-[var(--color-primary-foreground)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      style={{
        backgroundColor: "var(--color-primary)",
      }}
    >
      {isSaving ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Saving product...
        </>
      ) : (
        <>
          <Check size={18} />
          Save Product
        </>
      )}
    </button>
  </div>
);

export default ProductReviewPage;
