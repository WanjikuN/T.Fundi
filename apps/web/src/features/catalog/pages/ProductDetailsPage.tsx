import { useEffect, useMemo, useRef, useState } from "react";

import type { ChangeEvent, ReactNode } from "react";

import {
  Archive,
  ArrowLeft,
  Box,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Package,
  Plus,
  RotateCw,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import { toast } from "sonner";

import { getProductBySlug, updateProduct } from "../api/products.api";

import type {
  Product,
  ProductCategory,
  ProductImage,
  ProductOption,
  ProductOptionValue,
  ProductStatus,
  TenantCharacteristic,
  TenantCatalogSettings,
} from "../types/catalog.types";

/* =========================================================
   CONSTANTS
   ========================================================= */

const CATALOG_SETTINGS_KEY = "tfundi-catalog-settings";

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
   HELPERS
   ========================================================= */

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const getCatalogSettings = (): TenantCatalogSettings | null => {
  try {
    const stored = localStorage.getItem(CATALOG_SETTINGS_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as TenantCatalogSettings;
  } catch {
    return null;
  }
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result));
    };

    reader.onerror = () => {
      reject(new Error(`Unable to read ${file.name}.`));
    };

    reader.readAsDataURL(file);
  });

const getStatusLabel = (status: ProductStatus) => {
  if (status === "active") {
    return "Published";
  }

  if (status === "archived") {
    return "Archived";
  }

  return "Draft";
};

/* =========================================================
   CREATE PRODUCT OPTION FROM TENANT CHARACTERISTIC
   ========================================================= */

const createProductOption = (
  characteristic: TenantCharacteristic,
): ProductOption => {
  const values: ProductOptionValue[] = characteristic.values.map((value) => ({
    id: value.id,
    name: value.name,
    description: value.description,
    hexCode: value.hexCode,
    imageUrl: value.imageUrl,
    images: value.images,
    active: value.active,
  }));

  return {
    id: createId(),

    characteristicId: characteristic.id,

    name: characteristic.name,

    type: characteristic.type,

    required: characteristic.required ?? false,

    values,

    value:
      characteristic.type === "text" ||
      characteristic.type === "number" ||
      characteristic.type === "image"
        ? ""
        : undefined,
  };
};

/* =========================================================
   PAGE
   ========================================================= */

const ProductDetailsPage = () => {
  const { slug } = useParams();

  const [product, setProduct] = useState<Product | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  /* PRODUCT */

  const [productName, setProductName] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState<ProductCategory>("other");

  const [price, setPrice] = useState("");

  const [currency, setCurrency] = useState("KES");

  const [quantity, setQuantity] = useState("0");

  /* DIMENSIONS */

  const [width, setWidth] = useState("");

  const [depth, setDepth] = useState("");

  const [height, setHeight] = useState("");

  const [unit, setUnit] = useState<"cm" | "mm" | "in">("cm");

  /* STATUS */

  const [status, setStatus] = useState<ProductStatus>("draft");

  /* MEDIA */

  const [images, setImages] = useState<ProductImage[]>([]);

  /* PRODUCT CHARACTERISTICS */

  const [options, setOptions] = useState<ProductOption[]>([]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  /* UI */

  const [showCharacteristics, setShowCharacteristics] = useState(true);

  const [showDimensions, setShowDimensions] = useState(false);

  const [show360, setShow360] = useState(true);

  const [show3D, setShow3D] = useState(true);

  const [isAddingCharacteristic, setIsAddingCharacteristic] = useState(false);

  const [selectedCharacteristicId, setSelectedCharacteristicId] = useState("");

  /* 360 */

  const [rotationIndex, setRotationIndex] = useState(0);

  const [isAutoRotating, setIsAutoRotating] = useState(false);

  /* TENANT SETTINGS */

  const [catalogSettings, setCatalogSettings] =
    useState<TenantCatalogSettings | null>(null);

  /* REFS */

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const frameInputRef = useRef<HTMLInputElement | null>(null);

  const modelInputRef = useRef<HTMLInputElement | null>(null);

  /* =======================================================
     LOAD CATALOG SETTINGS
     ======================================================= */

  useEffect(() => {
    const loadSettings = () => {
      setCatalogSettings(getCatalogSettings());
    };

    loadSettings();

    const handleStorage = () => {
      loadSettings();
    };

    window.addEventListener("storage", handleStorage);

    window.addEventListener("tfundi-catalog-settings-updated", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);

      window.removeEventListener(
        "tfundi-catalog-settings-updated",
        handleStorage,
      );
    };
  }, []);

  /* =======================================================
     LOAD PRODUCT
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      if (!slug) {
        if (mounted) {
          setIsLoading(false);
        }

        return;
      }

      try {
        const result = await getProductBySlug(slug);

        if (!mounted) {
          return;
        }

        if (!result) {
          toast.error("Product could not be found.");

          setProduct(null);
          setIsLoading(false);

          return;
        }

        setProduct(result);

        setProductName(result.name);

        setDescription(result.description ?? "");

        setCategory(result.category);

        setPrice(String(result.price ?? ""));

        setCurrency(result.currency ?? "KES");

        setQuantity(String(result.quantity ?? 0));

        setWidth(
          result.dimensions?.width !== undefined
            ? String(result.dimensions.width)
            : "",
        );

        setDepth(
          result.dimensions?.depth !== undefined
            ? String(result.dimensions.depth)
            : "",
        );

        setHeight(
          result.dimensions?.height !== undefined
            ? String(result.dimensions.height)
            : "",
        );

        setUnit(result.dimensions?.unit ?? "cm");

        setStatus(result.status);

        /* ---------------------------------------------------
           IMAGES
        --------------------------------------------------- */

        const productImages: ProductImage[] =
          result.images?.map((url, index) => ({
            id: createId(),
            url,
            sequence: index,
            alt: `${result.name} image ${index + 1}`,
            is360Frame: false,
          })) ?? [];

        const structuredImages =
          result.media
            ?.filter((media) => media.type === "image")
            .map((media, index) => ({
              id: media.id,
              url: media.url,
              sequence: media.sequence ?? index,
              alt: media.label ?? `${result.name} image ${index + 1}`,
              is360Frame: false,
            })) ?? [];

        const combinedImages = structuredImages.length
          ? structuredImages
          : productImages;

        setImages(
          combinedImages.sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0)),
        );

        /* ---------------------------------------------------
           CHARACTERISTICS / OPTIONS
        --------------------------------------------------- */

        setOptions(
          (result.options ?? []).map((option) => {
            const characteristic = tenantCharacteristics.find(
              (item) => item.id === option.characteristicId,
            );

            if (!characteristic) {
              return option;
            }

            return {
              ...option,
              name: characteristic.name,
              type: characteristic.type,
              required: characteristic.required ?? false,
              values: characteristic.values,
            };
          }),
        );
      } catch (error) {
        console.error("Failed to load product:", error);

        toast.error("Unable to load the product.");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProduct();

    return () => {
      mounted = false;
    };
  }, [slug]);

  /* =======================================================
     ACTIVE TENANT CHARACTERISTICS
     ======================================================= */
  console.log(catalogSettings);
  const tenantCharacteristics = useMemo<TenantCharacteristic[]>(
    () =>
      catalogSettings?.characteristics?.filter(
        (characteristic) => characteristic.active !== false,
      ) ?? [],
    [catalogSettings],
  );

  /* =======================================================
     AVAILABLE CHARACTERISTICS
     ======================================================= */

  const availableCharacteristics = useMemo(
    () =>
      tenantCharacteristics.filter(
        (characteristic) =>
          !options.some(
            (option) => option.characteristicId === characteristic.id,
          ),
      ),
    [tenantCharacteristics, options],
  );
  /* =======================================================
   RESOLVE PRODUCT OPTIONS FROM CURRENT TENANT SCHEMA
   ======================================================= */

  const resolvedOptions = useMemo<ProductOption[]>(() => {
    return options.map((option) => {
      const characteristic = tenantCharacteristics.find(
        (item) => item.id === option.characteristicId,
      );

      /*
       * If the characteristic no longer exists
       * in the tenant schema, preserve the product
       * option so it can still be reviewed/removed.
       */
      if (!characteristic) {
        return option;
      }

      return {
        ...option,

        /*
         * Tenant owns the characteristic definition.
         */
        name: characteristic.name,
        type: characteristic.type,
        required: characteristic.required ?? false,

        /*
         * Tenant owns the available values.
         */
        values: characteristic.values.map((value) => ({
          id: value.id,
          name: value.name,
          description: value.description,
          hexCode: value.hexCode,
          imageUrl: value.imageUrl,
          images: value.images,
          active: value.active,
        })),
      };
    });
  }, [options, tenantCharacteristics]);
  /* =======================================================
     360 FRAMES
     ======================================================= */

  const rotationFrames = useMemo(
    () =>
      images
        .filter((image) => image.is360Frame === true)
        .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0)),
    [images],
  );

  const normalImages = useMemo(
    () => images.filter((image) => image.is360Frame !== true),
    [images],
  );

  const currentRotationFrame =
    rotationFrames[
      Math.min(rotationIndex, Math.max(rotationFrames.length - 1, 0))
    ];

  /* =======================================================
     AUTO ROTATION
     ======================================================= */

  useEffect(() => {
    if (!isAutoRotating || rotationFrames.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setRotationIndex((current) => (current + 1) % rotationFrames.length);
    }, 120);

    return () => {
      window.clearInterval(interval);
    };
  }, [isAutoRotating, rotationFrames.length]);

  /* =======================================================
     IMAGE UPLOAD
     ======================================================= */

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    try {
      const uploaded = await Promise.all(
        files.map(async (file, index) => ({
          id: createId(),
          url: await fileToDataUrl(file),
          sequence: images.length + index,
          alt: file.name,
          is360Frame: false,
        })),
      );

      setImages((current) => [...current, ...uploaded]);

      toast.success(
        `${files.length} image${files.length === 1 ? "" : "s"} added.`,
      );
    } catch (error) {
      console.error("Image upload failed:", error);

      toast.error("Unable to add the image.");
    } finally {
      event.target.value = "";
    }
  };

  /* =======================================================
     360 FRAME UPLOAD
     ======================================================= */

  const handle360Upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    try {
      const uploaded = await Promise.all(
        files.map(async (file) => ({
          id: createId(),
          url: await fileToDataUrl(file),
          sequence: images.length,
          alt: file.name,
          is360Frame: true,
        })),
      );

      setImages((current) => [
        ...current,
        ...uploaded.map((image, index) => ({
          ...image,
          sequence: current.length + index,
        })),
      ]);

      setRotationIndex(0);

      toast.success(
        `${files.length} 360° frame${files.length === 1 ? "" : "s"} added.`,
      );
    } catch (error) {
      console.error("360 upload failed:", error);

      toast.error("Unable to add the 360° frames.");
    } finally {
      event.target.value = "";
    }
  };

  /* =======================================================
     REMOVE IMAGE
     ======================================================= */

  const handleRemoveImage = (imageId: string) => {
    setImages((current) =>
      current
        .filter((image) => image.id !== imageId)
        .map((image, index) => ({
          ...image,
          sequence: index,
        })),
    );

    setSelectedImageIndex(0);

    setRotationIndex(0);

    toast.success("Image removed.");
  };

  /* =======================================================
     ADD CHARACTERISTIC
     ======================================================= */

  const handleAddCharacteristic = () => {
    if (!selectedCharacteristicId) {
      toast.error("Choose a characteristic first.");

      return;
    }

    const characteristic = tenantCharacteristics.find(
      (item) => item.id === selectedCharacteristicId,
    );

    if (!characteristic) {
      toast.error("Characteristic could not be found.");

      return;
    }

    const alreadyAttached = options.some(
      (option) => option.characteristicId === characteristic.id,
    );

    if (alreadyAttached) {
      toast.error(
        `${characteristic.name} is already attached to this product.`,
      );

      return;
    }

    const newOption = createProductOption(characteristic);

    setOptions((current) => [...current, newOption]);

    setSelectedCharacteristicId("");

    setIsAddingCharacteristic(false);

    toast.success(`${characteristic.name} added.`);
  };

  /* =======================================================
     REMOVE CHARACTERISTIC
     ======================================================= */

  const handleRemoveCharacteristic = (optionId: string) => {
    setOptions((current) => current.filter((option) => option.id !== optionId));

    toast.success("Characteristic removed.");
  };

  /* =======================================================
     FREE-FORM CHARACTERISTIC VALUE
     ======================================================= */

  const handleCharacteristicValueChange = (optionId: string, value: string) => {
    setOptions((current) =>
      current.map((option) =>
        option.id === optionId
          ? {
              ...option,
              value,
            }
          : option,
      ),
    );
  };

  /* =======================================================
     SELECT CHARACTERISTIC VALUE
     ======================================================= */
  console.log(tenantCharacteristics);
  const handleSelectableValueChange = (optionId: string, valueId: string) => {
    setOptions((current) =>
      current.map((option) =>
        option.id === optionId
          ? {
              ...option,
              value: valueId,
            }
          : option,
      ),
    );
  };

  /* =======================================================
     IMAGE CHARACTERISTIC
     ======================================================= */

  const handleImageCharacteristicChange = (optionId: string, value: string) => {
    setOptions((current) =>
      current.map((option) =>
        option.id === optionId
          ? {
              ...option,
              value,
            }
          : option,
      ),
    );
  };

  /* =======================================================
     3D MODEL
     ======================================================= */

  const handle3DModelUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const filename = file.name.toLowerCase();

    if (!filename.endsWith(".glb") && !filename.endsWith(".gltf")) {
      toast.error("Please upload a GLB or GLTF model.");

      event.target.value = "";

      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);

      setProduct((current) =>
        current
          ? {
              ...current,
              model3DUrl: dataUrl,
            }
          : current,
      );

      toast.success("3D model added.");
    } catch (error) {
      console.error("3D model upload failed:", error);

      toast.error("Unable to add the 3D model.");
    } finally {
      event.target.value = "";
    }
  };

  /* =======================================================
     REMOVE 3D MODEL
     ======================================================= */

  const handleRemove3DModel = () => {
    setProduct((current) =>
      current
        ? {
            ...current,
            model3DUrl: undefined,
          }
        : current,
    );

    toast.success("3D model removed.");
  };

  /* =======================================================
     BUILD PRODUCT IMAGES
     ======================================================= */

  const buildProductImages = (): ProductImage[] =>
    images.map((image, index) => ({
      ...image,
      sequence: index,
    }));

  /* =======================================================
     SAVE
     ======================================================= */

  const handleSave = async (nextStatus?: ProductStatus) => {
    if (!product) {
      return;
    }

    if (!productName.trim()) {
      toast.error("Product name is required.");

      return;
    }

    if (!description.trim()) {
      toast.error("Product description is required.");

      return;
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      toast.error("Enter a valid product price.");

      return;
    }

    const numericQuantity = Number(quantity);

    if (Number.isNaN(numericQuantity) || numericQuantity < 0) {
      toast.error("Enter a valid quantity.");

      return;
    }

    if (!images.length) {
      toast.error("At least one product image is required.");

      return;
    }

    setIsSaving(true);

    try {
      const productImages = buildProductImages();

      const updated = await updateProduct(product.id, {
        name: productName.trim(),

        description: description.trim(),

        category,

        price: numericPrice,

        currency: currency.trim().toUpperCase(),

        quantity: numericQuantity,

        dimensions: {
          width: width ? Number(width) : 0,

          depth: depth ? Number(depth) : 0,

          height: height ? Number(height) : 0,

          unit,
        },

        /*
         * IMPORTANT:
         *
         * These are product-level
         * selections copied from
         * the tenant schema.
         */
        options: resolvedOptions.map((option) => ({
          ...option,

          values: option.values.map((value) => ({
            ...value,
          })),
        })),

        images: productImages,

        media: product.media,

        variants: product.variants,

        model3DUrl: product.model3DUrl,

        status: nextStatus ?? status,
      });

      setProduct(updated);

      setStatus(updated.status);

      /*
       * Refresh product options
       * from backend response.
       */
      setOptions(updated.options ?? []);

      if (nextStatus === "active") {
        toast.success("Product published successfully.");
      } else if (nextStatus === "archived") {
        toast.success("Product archived.");
      } else if (nextStatus === "draft") {
        toast.success("Product restored to draft.");
      } else {
        toast.success("Product changes saved.");
      }
    } catch (error) {
      console.error("Failed to save product:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to save product.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =======================================================
     SELECTED IMAGE
     ======================================================= */

  const selectedImage =
    normalImages[
      Math.min(selectedImageIndex, Math.max(normalImages.length - 1, 0))
    ];

  /* =======================================================
     LOADING
     ======================================================= */

  if (isLoading) {
    return (
      <main className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[var(--color-background)]">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[var(--color-primary)]" />
          Loading product...
        </div>
      </main>
    );
  }

  /* =======================================================
     NOT FOUND
     ======================================================= */

  if (!product) {
    return (
      <main className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[var(--color-background)] px-4">
        <div className="text-center">
          <Package size={38} className="mx-auto text-gray-300" />

          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            This product may have been removed.
          </p>

          <Link
            to="/catalog"
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)]"
            style={{
              backgroundColor: "var(--color-primary)",
            }}
          >
            <ArrowLeft size={16} />
            Back to catalog
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
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[var(--color-primary)]"
            >
              <ArrowLeft size={17} />
              Catalog
            </Link>

            <div className="flex items-center gap-2">
              <StatusBadge status={status} />

              {status === "draft" && (
                <button
                  type="button"
                  onClick={() => void handleSave("active")}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-[var(--color-primary-foreground)] shadow-sm transition hover:-translate-y-0.5 disabled:opacity-60"
                  style={{
                    backgroundColor: "var(--color-primary)",
                  }}
                >
                  <Check size={16} />
                  Publish
                </button>
              )}

              {status === "active" && (
                <button
                  type="button"
                  onClick={() => void handleSave("archived")}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-black/[0.03] disabled:opacity-60"
                >
                  <Archive size={16} />
                  Archive
                </button>
              )}

              {status === "archived" && (
                <button
                  type="button"
                  onClick={() => void handleSave("draft")}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-[var(--color-primary-foreground)] disabled:opacity-60"
                  style={{
                    backgroundColor: "var(--color-primary)",
                  }}
                >
                  Restore
                </button>
              )}

              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-black/[0.03] disabled:opacity-60"
              >
                <Save size={16} />

                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{
                  color: "var(--color-primary)",
                }}
              >
                Product Management
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {productName || "Untitled product"}
              </h1>
            </div>

            <p className="hidden text-xs text-gray-400 sm:block">
              Last saved{" "}
              {new Date(
                product.updatedAt ?? product.createdAt,
              ).toLocaleDateString()}
            </p>
          </div>
        </header>

        {/* =================================================
            WORKSPACE
        ================================================= */}

        <div className="mt-5 grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,1fr)_430px]">
          {/* =================================================
              LEFT EDITOR
          ================================================= */}

          <section className="min-h-0 overflow-y-auto pr-1 lg:pr-2">
            <div className="space-y-4 pb-6">
              {/* PRODUCT */}

              <Panel>
                <PanelHeading eyebrow="Product" title="Product information" />

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Product name"
                    value={productName}
                    onChange={setProductName}
                  />

                  <div>
                    <label className="text-sm font-semibold text-gray-800">
                      Category
                    </label>

                    <select
                      value={category}
                      onChange={(event) =>
                        setCategory(event.target.value as ProductCategory)
                      }
                      className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[var(--color-primary)]"
                    >
                      {PRODUCT_CATEGORIES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Field
                    label="Price"
                    value={price}
                    onChange={setPrice}
                    type="number"
                  />

                  <Field
                    label="Currency"
                    value={currency}
                    onChange={(value) => setCurrency(value.toUpperCase())}
                  />
                </div>

                <div className="mt-4">
                  <label className="text-sm font-semibold text-gray-800">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={4}
                    className="mt-2 w-full resize-none rounded-xl border border-black/10 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[var(--color-primary)]"
                  />
                </div>
              </Panel>

              {/* INVENTORY */}

              <Panel>
                <PanelHeading
                  eyebrow="Inventory"
                  title="Stock & quantity"
                  icon={<Package size={17} />}
                />

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Quantity"
                    value={quantity}
                    onChange={setQuantity}
                    type="number"
                  />

                  <div className="flex items-end">
                    <div className="w-full rounded-xl bg-black/[0.025] px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Inventory status
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {Number(quantity) > 0 ? "In stock" : "Out of stock"}
                      </p>
                    </div>
                  </div>
                </div>
              </Panel>

              {/* =================================================
                  PRODUCT CHARACTERISTICS
              ================================================= */}

              <Panel>
                <button
                  type="button"
                  onClick={() => setShowCharacteristics((current) => !current)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <PanelHeading
                    eyebrow="Tenant schema"
                    title="Product characteristics"
                    icon={<Sparkles size={17} />}
                  />

                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition ${
                      showCharacteristics ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showCharacteristics && (
                  <div className="mt-5">
                    {/* INFO */}

                    <div className="mb-4 rounded-xl bg-black/[0.025] p-3">
                      <div className="flex gap-2">
                        <Sparkles
                          size={14}
                          className="mt-0.5 shrink-0"
                          style={{
                            color: "var(--color-primary)",
                          }}
                        />

                        <p className="text-[11px] leading-5 text-gray-500">
                          These characteristics are defined by the tenant in
                          Catalog Settings. Here you choose which ones apply to
                          this specific product.
                        </p>
                      </div>
                    </div>

                    {/* CURRENT CHARACTERISTICS */}

                    {!options.length ? (
                      <div className="rounded-2xl border border-dashed border-black/10 p-6 text-center">
                        <Sparkles size={27} className="mx-auto text-gray-300" />

                        <p className="mt-2 text-sm font-semibold text-gray-700">
                          No characteristics attached
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-400">
                          Add characteristics configured by this tenant.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {resolvedOptions.map((option) => (
                          <CharacteristicEditor
                            key={option.id}
                            option={option}
                            onRemove={() =>
                              handleRemoveCharacteristic(option.id)
                            }
                            onValueChange={(value) =>
                              handleCharacteristicValueChange(option.id, value)
                            }
                            onSelectValueChange={(value) =>
                              handleSelectableValueChange(option.id, value)
                            }
                            onImageChange={(value) =>
                              handleImageCharacteristicChange(option.id, value)
                            }
                          />
                        ))}
                      </div>
                    )}

                    {/* ADD CHARACTERISTIC */}

                    {isAddingCharacteristic ? (
                      <div className="mt-4 rounded-2xl border border-[var(--color-primary)]/20 bg-black/[0.015] p-4">
                        <p className="text-xs font-semibold text-gray-700">
                          Add tenant characteristic
                        </p>

                        {availableCharacteristics.length > 0 ? (
                          <>
                            <select
                              value={selectedCharacteristicId}
                              onChange={(event) =>
                                setSelectedCharacteristicId(event.target.value)
                              }
                              className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                            >
                              <option value="">Select characteristic</option>

                              {availableCharacteristics.map(
                                (characteristic) => (
                                  <option
                                    key={characteristic.id}
                                    value={characteristic.id}
                                  >
                                    {characteristic.name}
                                  </option>
                                ),
                              )}
                            </select>

                            <div className="mt-3 flex gap-2">
                              <button
                                type="button"
                                onClick={handleAddCharacteristic}
                                className="rounded-xl px-4 py-2 text-xs font-bold text-[var(--color-primary-foreground)]"
                                style={{
                                  backgroundColor: "var(--color-primary)",
                                }}
                              >
                                Add characteristic
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingCharacteristic(false);

                                  setSelectedCharacteristicId("");
                                }}
                                className="rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="mt-3 rounded-xl bg-amber-50 p-3">
                            <p className="text-xs leading-5 text-amber-700">
                              {tenantCharacteristics.length === 0
                                ? "This tenant has not configured any catalog characteristics yet."
                                : "All available tenant characteristics are already attached to this product."}
                            </p>

                            <Link
                              to="/settings/catalog"
                              className="mt-2 inline-block text-xs font-bold text-amber-800 underline"
                            >
                              Manage catalog settings
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingCharacteristic(true)}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-black/15 px-4 py-2.5 text-xs font-bold text-gray-600 transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                      >
                        <Plus size={15} />
                        Add characteristic
                      </button>
                    )}
                  </div>
                )}
              </Panel>

              {/* DIMENSIONS */}

              <Panel>
                <button
                  type="button"
                  onClick={() => setShowDimensions((current) => !current)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <PanelHeading eyebrow="Measurements" title="Dimensions" />

                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition ${
                      showDimensions ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showDimensions && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Field
                      label="Width"
                      value={width}
                      onChange={setWidth}
                      type="number"
                    />

                    <Field
                      label="Depth"
                      value={depth}
                      onChange={setDepth}
                      type="number"
                    />

                    <Field
                      label="Height"
                      value={height}
                      onChange={setHeight}
                      type="number"
                    />

                    <div>
                      <label className="text-xs font-medium text-gray-500">
                        Unit
                      </label>

                      <select
                        value={unit}
                        onChange={(event) =>
                          setUnit(event.target.value as "cm" | "mm" | "in")
                        }
                        className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--color-primary)]"
                      >
                        <option value="cm">cm</option>

                        <option value="mm">mm</option>

                        <option value="in">inches</option>
                      </select>
                    </div>
                  </div>
                )}
              </Panel>
            </div>
          </section>

          {/* =================================================
              RIGHT MEDIA
          ================================================= */}

          <aside className="min-h-0">
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
              {/* PREVIEW */}

              <div className="relative shrink-0 bg-black/[0.025]">
                <div className="relative flex h-[220px] items-center justify-center overflow-hidden sm:h-[235px]">
                  {selectedImage ? (
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.alt ?? productName}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImagePlus size={32} className="mx-auto" />

                      <p className="mt-2 text-xs">No product image</p>
                    </div>
                  )}

                  {normalImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImageIndex((current) =>
                            current === 0
                              ? normalImages.length - 1
                              : current - 1,
                          )
                        }
                        className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm"
                      >
                        <ChevronLeft size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImageIndex(
                            (current) => (current + 1) % normalImages.length,
                          )
                        }
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm"
                      >
                        <ChevronRight size={17} />
                      </button>
                    </>
                  )}

                  <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white">
                    {normalImages.length} image
                    {normalImages.length === 1 ? "" : "s"}
                  </div>
                </div>

                {/* THUMBNAILS */}

                <div className="flex gap-2 overflow-x-auto border-t border-black/[0.06] p-3">
                  {normalImages.map((image, index) => (
                    <div key={image.id} className="group relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedImageIndex(index)}
                        className={`h-14 w-14 overflow-hidden rounded-lg border-2 transition ${
                          selectedImageIndex === index
                            ? "border-[var(--color-primary)]"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.id)}
                        className="absolute -right-1 -top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white group-hover:flex"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-black/15 text-gray-400 transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  >
                    <Plus size={18} />
                  </button>

                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* MEDIA MANAGEMENT */}

              <div className="min-h-0 flex-1 overflow-y-auto border-t border-black/[0.06] p-4">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{
                    color: "var(--color-primary)",
                  }}
                >
                  Media Management
                </p>

                <h2 className="mt-1 text-base font-bold text-gray-900">
                  Product media
                </h2>

                {/* 360 */}

                <div className="mt-4 rounded-2xl border border-black/10">
                  <button
                    type="button"
                    onClick={() => setShow360((current) => !current)}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                          color: "var(--color-primary)",
                        }}
                      >
                        <RotateCw size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          360° Product View
                        </p>

                        <p className="text-[11px] text-gray-400">
                          {rotationFrames.length} frames
                        </p>
                      </div>
                    </div>

                    <ChevronDown
                      size={17}
                      className={`text-gray-400 transition ${
                        show360 ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {show360 && (
                    <div className="border-t border-black/[0.06] p-4">
                      {rotationFrames.length > 0 ? (
                        <>
                          <div className="relative overflow-hidden rounded-xl bg-black/[0.04]">
                            <img
                              src={currentRotationFrame?.url}
                              alt="360 product frame"
                              className="h-44 w-full object-contain"
                              draggable={false}
                            />

                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white">
                              Frame {rotationIndex + 1} /{" "}
                              {rotationFrames.length}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setRotationIndex((current) =>
                                  current === 0
                                    ? rotationFrames.length - 1
                                    : current - 1,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10"
                            >
                              <ChevronLeft size={16} />
                            </button>

                            <input
                              type="range"
                              min="0"
                              max={Math.max(rotationFrames.length - 1, 0)}
                              value={rotationIndex}
                              onChange={(event) =>
                                setRotationIndex(Number(event.target.value))
                              }
                              className="min-w-0 flex-1 accent-[var(--color-primary)]"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setRotationIndex(
                                  (current) =>
                                    (current + 1) % rotationFrames.length,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10"
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>

                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setIsAutoRotating((current) => !current)
                              }
                              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                                isAutoRotating
                                  ? "text-[var(--color-primary-foreground)]"
                                  : "border border-black/10 bg-white text-gray-700"
                              }`}
                              style={
                                isAutoRotating
                                  ? {
                                      backgroundColor: "var(--color-primary)",
                                    }
                                  : undefined
                              }
                            >
                              <RotateCw size={14} />

                              {isAutoRotating
                                ? "Stop rotation"
                                : "Preview rotation"}
                            </button>

                            <button
                              type="button"
                              onClick={() => frameInputRef.current?.click()}
                              className="flex items-center justify-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold text-gray-700"
                            >
                              <Plus size={14} />
                              Add frames
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="rounded-xl border border-dashed border-black/10 p-5 text-center">
                          <RotateCw
                            size={26}
                            className="mx-auto text-gray-300"
                          />

                          <p className="mt-2 text-xs font-semibold text-gray-700">
                            No 360° frames yet
                          </p>

                          <p className="mt-1 text-[11px] leading-5 text-gray-400">
                            Upload multiple angles for a smoother rotation.
                          </p>

                          <button
                            type="button"
                            onClick={() => frameInputRef.current?.click()}
                            className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-[var(--color-primary-foreground)]"
                            style={{
                              backgroundColor: "var(--color-primary)",
                            }}
                          >
                            <Upload size={14} />
                            Add 360° frames
                          </button>
                        </div>
                      )}

                      <input
                        ref={frameInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handle360Upload}
                      />

                      {rotationFrames.length > 0 && (
                        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
                          {rotationFrames.map((frame, index) => (
                            <button
                              key={frame.id}
                              type="button"
                              onClick={() => setRotationIndex(index)}
                              className={`h-9 w-9 shrink-0 overflow-hidden rounded-md border-2 ${
                                rotationIndex === index
                                  ? "border-[var(--color-primary)]"
                                  : "border-transparent"
                              }`}
                            >
                              <img
                                src={frame.url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3D */}

                <div className="mt-3 rounded-2xl border border-black/10">
                  <button
                    type="button"
                    onClick={() => setShow3D((current) => !current)}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                          color: "var(--color-primary)",
                        }}
                      >
                        <Box size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          3D Model
                        </p>

                        <p className="text-[11px] text-gray-400">GLB / GLTF</p>
                      </div>
                    </div>

                    <ChevronDown
                      size={17}
                      className={`text-gray-400 transition ${
                        show3D ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {show3D && (
                    <div className="border-t border-black/[0.06] p-4">
                      {product.model3DUrl ? (
                        <div className="rounded-xl bg-black/[0.025] p-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-lg"
                              style={{
                                backgroundColor:
                                  "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                                color: "var(--color-primary)",
                              }}
                            >
                              <Box size={18} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-gray-800">
                                3D model attached
                              </p>

                              <p className="mt-0.5 truncate text-[10px] text-gray-400">
                                Ready for the 3D / AR pipeline
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => modelInputRef.current?.click()}
                              className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-gray-700"
                            >
                              Replace
                            </button>

                            <button
                              type="button"
                              onClick={handleRemove3DModel}
                              className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-black/10 p-5 text-center">
                          <Box size={26} className="mx-auto text-gray-300" />

                          <p className="mt-2 text-xs font-semibold text-gray-700">
                            No 3D model uploaded
                          </p>

                          <p className="mt-1 text-[11px] leading-5 text-gray-400">
                            Add a GLB or GLTF model when one is available.
                          </p>

                          <button
                            type="button"
                            onClick={() => modelInputRef.current?.click()}
                            className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-[var(--color-primary-foreground)]"
                            style={{
                              backgroundColor: "var(--color-primary)",
                            }}
                          >
                            <Upload size={14} />
                            Add 3D model
                          </button>
                        </div>
                      )}

                      <input
                        ref={modelInputRef}
                        type="file"
                        accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
                        hidden
                        onChange={handle3DModelUpload}
                      />
                    </div>
                  )}
                </div>

                {/* PIPELINE NOTE */}

                <div className="mt-4 rounded-xl bg-black/[0.025] p-3">
                  <div className="flex gap-2">
                    <Sparkles
                      size={14}
                      className="mt-0.5 shrink-0"
                      style={{
                        color: "var(--color-primary)",
                      }}
                    />

                    <p className="text-[11px] leading-5 text-gray-500">
                      360° images and 3D models are managed separately. The 360°
                      sequence provides image-based rotation, while the 3D model
                      will power the future 3D and AR experience.
                    </p>
                  </div>
                </div>
              </div>

              {/* SAVE */}

              <div className="shrink-0 border-t border-black/10 bg-white p-3">
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={isSaving}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-[var(--color-primary-foreground)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    backgroundColor: "var(--color-primary)",
                  }}
                >
                  {isSaving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <Check size={17} />
                      Save Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

/* =========================================================
   PANEL
   ========================================================= */

type PanelProps = {
  children: ReactNode;
};

const Panel = ({ children }: PanelProps) => (
  <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
    {children}
  </div>
);

/* =========================================================
   PANEL HEADING
   ========================================================= */

type PanelHeadingProps = {
  eyebrow: string;
  title: string;
  icon?: ReactNode;
};

const PanelHeading = ({ eyebrow, title, icon }: PanelHeadingProps) => (
  <div className="flex items-center gap-3">
    {icon && (
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl"
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
};

const Field = ({ label, value, onChange, type = "text" }: FieldProps) => (
  <div>
    <label className="text-sm font-semibold text-gray-800">{label}</label>

    <input
      type={type}
      value={value}
      min={type === "number" ? "0" : undefined}
      onChange={(event) => onChange(event.target.value)}
      className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[var(--color-primary)]"
    />
  </div>
);

/* =========================================================
   STATUS BADGE
   ========================================================= */

const StatusBadge = ({ status }: { status: ProductStatus }) => {
  const isPublished = status === "active";

  const isArchived = status === "archived";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
        isPublished
          ? "bg-emerald-50 text-emerald-700"
          : isArchived
            ? "bg-gray-100 text-gray-500"
            : "bg-amber-50 text-amber-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isPublished
            ? "bg-emerald-500"
            : isArchived
              ? "bg-gray-400"
              : "bg-amber-500"
        }`}
      />

      {getStatusLabel(status)}
    </span>
  );
};

/* =========================================================
   CHARACTERISTIC EDITOR
   ========================================================= */

type CharacteristicEditorProps = {
  option: ProductOption;

  onRemove: () => void;

  onValueChange: (value: string) => void;

  onSelectValueChange: (value: string) => void;

  onImageChange: (value: string) => void;
};

const CharacteristicEditor = ({
  option,
  onRemove,
  onValueChange,
  onSelectValueChange,
  onImageChange,
}: CharacteristicEditorProps) => {
  const selectedValue = typeof option.value === "string" ? option.value : "";

  const activeValues = option.values.filter((value) => value.active !== false);

  const isFreeInput = option.type === "text" || option.type === "number";

  const isImageInput = option.type === "image";

  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.012] p-4">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-gray-800">{option.name}</p>

            {option.required && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700">
                Required
              </span>
            )}
          </div>

          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-400">
            {option.type}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
          title="Remove characteristic"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* VALUE */}

      <div className="mt-3">
        {/* TEXT */}

        {option.type === "text" && (
          <input
            type="text"
            value={selectedValue}
            onChange={(event) => onValueChange(event.target.value)}
            placeholder={`Enter ${option.name.toLowerCase()}`}
            className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--color-primary)]"
          />
        )}

        {/* NUMBER */}

        {option.type === "number" && (
          <input
            type="number"
            value={selectedValue}
            onChange={(event) => onValueChange(event.target.value)}
            placeholder={`Enter ${option.name.toLowerCase()}`}
            className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--color-primary)]"
          />
        )}

        {/* IMAGE */}

        {isImageInput && (
          <div>
            <input
              type="url"
              value={selectedValue}
              onChange={(event) => onImageChange(event.target.value)}
              placeholder="Enter image URL"
              className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--color-primary)]"
            />

            {selectedValue && (
              <div className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white">
                <img
                  src={selectedValue}
                  alt={option.name}
                  className="h-36 w-full object-contain"
                />
              </div>
            )}
          </div>
        )}

        {/* SELECT / COLOR / MATERIAL / FINISH / SIZE */}

        {!isFreeInput && !isImageInput && (
          <div className="flex flex-wrap gap-2">
            {activeValues.length ? (
              activeValues.map((value) => (
                <CharacteristicValueButton
                  key={value.id}
                  value={value}
                  selected={selectedValue === value.id}
                  onClick={() => onSelectValueChange(value.id)}
                />
              ))
            ) : (
              <p className="text-xs text-gray-400">No configured values.</p>
            )}
          </div>
        )}
      </div>

      {/* SELECTED VALUE DESCRIPTION */}

      {!isFreeInput &&
        !isImageInput &&
        selectedValue &&
        (() => {
          const selected = activeValues.find(
            (value) => value.id === selectedValue,
          );

          if (!selected?.description) {
            return null;
          }

          return (
            <p className="mt-3 rounded-xl bg-white px-3 py-2 text-[11px] leading-5 text-gray-500">
              {selected.description}
            </p>
          );
        })()}
    </div>
  );
};

/* =========================================================
   CHARACTERISTIC VALUE BUTTON
   ========================================================= */

type CharacteristicValueButtonProps = {
  value: ProductOptionValue;

  selected: boolean;

  onClick: () => void;
};

const CharacteristicValueButton = ({
  value,
  selected,
  onClick,
}: CharacteristicValueButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
      selected
        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-gray-900"
        : "border-black/10 bg-white text-gray-600 hover:border-black/20"
    }`}
  >
    {/* COLOR SWATCH */}

    {value.hexCode && (
      <span
        className="h-4 w-4 rounded-full border border-black/10"
        style={{
          backgroundColor: value.hexCode,
        }}
      />
    )}

    {/* IMAGE */}

    {value.imageUrl && (
      <img
        src={value.imageUrl}
        alt=""
        className="h-5 w-5 rounded-md object-cover"
      />
    )}

    {/* NAME */}

    {value.name}

    {/* CHECK */}

    {selected && (
      <Check
        size={13}
        style={{
          color: "var(--color-primary)",
        }}
      />
    )}
  </button>
);

export default ProductDetailsPage;
