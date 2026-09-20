import type {
  SavedDesign,
  VisualizationRequest,
  VisualizationResult,
} from "../types/ai-studio.types";

const SAVED_DESIGNS_KEY = "tfundi.ai-studio.saved-designs";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const generateRoomVisualization = async (
  request: VisualizationRequest,
): Promise<VisualizationResult> => {
  await delay(1800);

  return {
    id: `visual-${Date.now()}`,
    roomImageUrl: request.roomImage.url,
    productId: request.product.id,
    productName: request.product.name,
    productImageUrl:
      request.product.imageUrl ||
      request.product.images?.[0] ||
      "",
    selectedOptions: request.selectedOptions,
    createdAt: new Date().toISOString(),
  };
};

export const getSavedDesigns = async (): Promise<SavedDesign[]> => {
  await delay(150);

  try {
    const raw = localStorage.getItem(SAVED_DESIGNS_KEY);

    if (!raw) {
      return [];
    }

    return JSON.parse(raw) as SavedDesign[];
  } catch {
    return [];
  }
};

export const saveDesign = async (
  design: VisualizationResult,
  name: string,
): Promise<SavedDesign> => {
  const existing = await getSavedDesigns();

  const savedDesign: SavedDesign = {
    ...design,
    name,
  };

  localStorage.setItem(
    SAVED_DESIGNS_KEY,
    JSON.stringify([savedDesign, ...existing]),
  );

  return savedDesign;
};

export const deleteSavedDesign = async (
  designId: string,
): Promise<void> => {
  const existing = await getSavedDesigns();

  localStorage.setItem(
    SAVED_DESIGNS_KEY,
    JSON.stringify(existing.filter((design) => design.id !== designId)),
  );
};