export interface ThemePalette {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const themePalettes: ThemePalette[] = [
  {
    id: "warm-wood",
    name: "Warm Wood",
    description: "Warm, earthy tones inspired by natural timber.",
    colors: {
      primary: "#8B4513",
      secondary: "#D2B48C",
      accent: "#F59E0B",
    },
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean neutrals with a refined gold accent.",
    colors: {
      primary: "#1F2937",
      secondary: "#E5E7EB",
      accent: "#D4AF37",
    },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Natural greens for an organic furniture brand.",
    colors: {
      primary: "#166534",
      secondary: "#DCFCE7",
      accent: "#CA8A04",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple monochrome tones for a clean workspace.",
    colors: {
      primary: "#111827",
      secondary: "#F3F4F6",
      accent: "#6B7280",
    },
  },
  {
    id: "terracotta",
    name: "Terracotta",
    description: "Warm clay tones with a natural, handcrafted feel.",
    colors: {
      primary: "#C2410C",
      secondary: "#FED7AA",
      accent: "#7C2D12",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Calm blue tones for a contemporary brand.",
    colors: {
      primary: "#0369A1",
      secondary: "#E0F2FE",
      accent: "#0F766E",
    },
  },
  {
    id: "rosewood",
    name: "Rosewood",
    description: "Deep, sophisticated tones inspired by rich wood.",
    colors: {
      primary: "#7F1D1D",
      secondary: "#FECACA",
      accent: "#B45309",
    },
  },
  {
    id: "sage",
    name: "Sage",
    description: "Soft natural tones for a calm, modern aesthetic.",
    colors: {
      primary: "#4D7C0F",
      secondary: "#ECFCCB",
      accent: "#A16207",
    },
  },
];