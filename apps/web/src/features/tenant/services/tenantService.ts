import type { Tenant } from "../types";

export const getTenantByHost = async (
  host: string,
): Promise<Tenant | null> => {
  console.log("Resolving tenant for host:", host);

  // Temporary mock response.
  // This will later be replaced with a real API request.

  if (host === "localhost" || host === "tfundi.vercel.app" ) {
    return {
      id: "tenant-1",
      name: "Ropa Furnitures",
      slug: "ropa",
      branding: {
        primaryColor: "#7C3AED",
        primaryForeground: "#FFFFFF",

        secondaryColor: "#E9D5FF",
        secondaryForeground: "#3D2B1F",

        accentColor: "#F59E0B",
        accentForeground: "#FFFFFF",

        backgroundColor: "#FFFFFF",
        foregroundColor: "#1F1F1F",

        mutedColor: "#F5F5F4",
        mutedForeground: "#737373",

        logoUrl: undefined,
      },
    };
  }

  return null;
};