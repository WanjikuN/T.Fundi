import type {
  CreateProductInput,
  Product,
} from "../types/catalog.types";

/* =========================================================
   TEMPORARY PRODUCT STORAGE
   ========================================================= */

const STORAGE_KEY = "tfundi-products";

/* =========================================================
   HELPERS
   ========================================================= */

const createId = () =>
  `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

const createSlug = (name: string) => {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") ||
    `product-${Date.now()}`
  );
};

const getStoredProducts = (): Product[] => {
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const products =
      JSON.parse(stored) as Product[];

    /*
     * Backwards compatibility for products created
     * before quantity was introduced.
     */
    return products.map((product) => ({
      ...product,
      quantity:
        typeof product.quantity === "number"
          ? product.quantity
          : 0,
    }));
  } catch {
    return [];
  }
};

const saveStoredProducts = (
  products: Product[],
) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(products),
  );
};

/* =========================================================
   CREATE PRODUCT
   ========================================================= */

export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  if (!input.name.trim()) {
    throw new Error(
      "Product name is required.",
    );
  }

  if (!input.description.trim()) {
    throw new Error(
      "Product description is required.",
    );
  }

  if (!input.options) {
    throw new Error(
      "Product characteristics are required.",
    );
  }

  if (!input.images.length) {
    throw new Error(
      "At least one product image is required.",
    );
  }

  if (
    Number.isNaN(input.quantity) ||
    input.quantity < 0
  ) {
    throw new Error(
      "Product quantity must be zero or greater.",
    );
  }

  const products =
    getStoredProducts();

  const product: Product = {
    id: createId(),

    name: input.name.trim(),

    slug: createSlug(input.name),

    description:
      input.description.trim(),

    category: input.category,

    price: input.price,

    currency: input.currency,

    quantity: input.quantity,

    imageUrl:
      input.images[0]?.url ?? "",

    images: input.images.map(
      (image) => image.url,
    ),

    media: input.media,

    dimensions:
      input.dimensions,

    options: input.options,

    variants: input.variants,

    model3DUrl:
      input.model3DUrl,

    status: input.status,

    createdAt:
      new Date().toISOString(),
  };

  products.push(product);

  saveStoredProducts(products);

  await new Promise((resolve) =>
    setTimeout(resolve, 300),
  );

  return product;
}

/* =========================================================
   GET PRODUCTS
   ========================================================= */

export async function getProducts(): Promise<
  Product[]
> {
  await new Promise((resolve) =>
    setTimeout(resolve, 150),
  );

  return getStoredProducts();
}

/* =========================================================
   GET PRODUCT BY SLUG
   ========================================================= */

export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  await new Promise((resolve) =>
    setTimeout(resolve, 150),
  );

  const products =
    getStoredProducts();

  return (
    products.find(
      (product) =>
        product.slug === slug,
    ) ?? null
  );
}

/* =========================================================
   UPDATE PRODUCT
   ========================================================= */

export async function updateProduct(
  id: string,
  updates: Partial<CreateProductInput>,
): Promise<Product> {
  const products =
    getStoredProducts();

  const index =
    products.findIndex(
      (product) =>
        product.id === id,
    );

  if (index === -1) {
    throw new Error(
      "Product not found.",
    );
  }

  const current =
    products[index];

  if (
    updates.quantity !== undefined &&
    (Number.isNaN(updates.quantity) ||
      updates.quantity < 0)
  ) {
    throw new Error(
      "Product quantity must be zero or greater.",
    );
  }

  const updated: Product = {
    ...current,

    ...updates,

    name:
      updates.name !== undefined
        ? updates.name.trim()
        : current.name,

    description:
      updates.description !==
      undefined
        ? updates.description.trim()
        : current.description,

    slug:
      updates.name !== undefined
        ? createSlug(
            updates.name,
          )
        : current.slug,

    quantity:
      updates.quantity !== undefined
        ? updates.quantity
        : current.quantity,

    imageUrl:
      updates.images?.[0]?.url ??
      current.imageUrl,

    images:
      updates.images?.map(
        (image) => image.url,
      ) ?? current.images,
  };

  products[index] = updated;

  saveStoredProducts(products);

  await new Promise((resolve) =>
    setTimeout(resolve, 300),
  );

  return updated;
}

/* =========================================================
   DELETE PRODUCT
   ========================================================= */

export async function deleteProduct(
  id: string,
): Promise<void> {
  const products =
    getStoredProducts();

  const exists =
    products.some(
      (product) =>
        product.id === id,
    );

  if (!exists) {
    throw new Error(
      "Product not found.",
    );
  }

  const remaining =
    products.filter(
      (product) =>
        product.id !== id,
    );

  saveStoredProducts(remaining);

  await new Promise((resolve) =>
    setTimeout(resolve, 200),
  );
}