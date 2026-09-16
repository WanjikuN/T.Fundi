import type { Tenant } from "../types";

export const getTenantByHost = async (host: string): Promise<Tenant | null> => {
  console.log("Resolving tenant for host:", host);

  // Temporary mock response.
  // This will later be replaced with a real API request.

  if (host === "localhost" || host === "t-fundi.vercel.app") {
    return {
      id: "tenant-1",
      name: "T. Fundi",
      slug: "t-fundi",
      verticalKey: "",
      branding: {
        primaryColor: "#8B4513",
        primaryForeground: "#FFFFFF",

        secondaryColor: "#D2B48C",
        secondaryForeground: "#3D2B1F",

        accentColor: "#f5780b",
        accentForeground: "#FFFFFF",

        backgroundColor: "#FFFFFF",
        foregroundColor: "#1F1F1F",

        mutedColor: "#F5F5F4",
        mutedForeground: "#737373",

        logoUrl:
          "https://imgs.search.brave.com/J8y--e2Ii-ZkKnVvbpowataNAhM_0RKaF8T_8xocZzc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tdmVj/dG9yL3NpbXBsZS1t/b2Rlcm4tZnVybml0/dXJlLWxvZ28tZGVz/aWduLWJ1c2luZXNz/XzM5Mzg3OS0yMDM5/LmpwZz9zZW10PWFp/c19oeWJyaWQmdz03/NDAmcT04MA",
      },
    };
  }

  return null;
};
