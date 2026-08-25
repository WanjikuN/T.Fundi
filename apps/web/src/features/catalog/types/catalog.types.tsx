export type ProductCategory =
  | "sofas"
  | "chairs"
  | "tables"
  | "beds"
  | "storage"
  | "outdoor";

export type ProductStatus =
  | "active"
  | "draft"
  | "archived";

export type ProductMaterial = {
  id: string;
  name: string;
  color: string;
  hexCode?: string;
};

export type ProductDimensions = {
  width: number;
  depth: number;
  height: number;
  unit: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;

  category: ProductCategory;

  price: number;
  currency: string;

  imageUrl: string;

  /**
   * Product images.
   *
   * For the 360 viewer these should be photographs
   * of the SAME product from different angles.
   */
  images?: string[];

  /**
   * Optional actual 3D model.
   *
   * This will be populated later when T.Fundi
   * generates a real GLB from product imagery.
   */
  model3DUrl?: string;

  materials: ProductMaterial[];

  dimensions?: ProductDimensions;

  status: ProductStatus;

  featured?: boolean;

  createdAt: string;
};