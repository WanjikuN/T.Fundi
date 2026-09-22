export type BackgroundRemovalResult = {
  imageUrl: string;
};

export const removeProductBackground = async (
  imageUrl: string,
): Promise<BackgroundRemovalResult> => {
  /*
   * Temporary frontend contract.
   *
   * The real implementation will call:
   *
   * POST /api/ai/background-removal
   *
   * and return the URL of the transparent PNG.
   */

  console.log(
    "Background removal requested for:",
    imageUrl,
  );

  throw new Error(
    "Background removal service is not connected yet.",
  );
};