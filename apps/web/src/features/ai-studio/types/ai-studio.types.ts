import type { Product, ProductOption } from "../../catalog/types/catalog.types";

export type AIStudioMode =
  | "landing"
  | "product-intelligence"
  | "room-visualizer";

export type RoomVisualizerStep =
  | "upload"
  | "product"
  | "options"
  | "generating"
  | "preview";

export type RoomImage = {
 id: string;
  name: string;
  url: string;
  file?: File;
};

export type SelectedRoomProduct = {
  product: Product;
  selectedOptions: Record<string, string>;
};

export type VisualizationRequest = {
  roomImage: RoomImage;
  product: Product;
  selectedOptions: Record<string, string>;
};

export type VisualizationResult = {
  id: string;
  roomImageUrl: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  selectedOptions: Record<string, string>;
  createdAt: string;
};

export type SavedDesign = VisualizationResult & {
  name: string;
};

export type RoomVisualizerState = {
  step: RoomVisualizerStep;
  roomImage?: RoomImage;
  selectedProduct?: Product;
  selectedOptions: Record<string, string>;
  result?: VisualizationResult;
};

export type AIStudioProductOption = ProductOption & {
  values?: Array<{
    id: string;
    name: string;
    color?: string;
    hex?: string;
    image?: string;
    description?: string;
    active?: boolean;
  }>;
};