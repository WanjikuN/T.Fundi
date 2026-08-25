import type { Product } from "./catalog.types";

export const mockProducts: Product[] = [
  {
    id: "prod-001",
    name: "Luna Sofa",
    slug: "luna-sofa",
    description:
      "A contemporary handcrafted sofa designed for comfort and everyday living.",
    category: "sofas",
    price: 85000,
    currency: "KES",

    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",

    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",

      "https://images.unsplash.com/photo-1540574163026-643ea20ade25",
    ],

    materials: [
      {
        id: "material-001",
        name: "Natural Oak",
        color: "Natural Oak",
        hexCode: "#C69C6D",
      },
      {
        id: "material-002",
        name: "Walnut",
        color: "Walnut",
        hexCode: "#5C4033",
      },
    ],

    dimensions: {
      width: 220,
      depth: 90,
      height: 85,
      unit: "cm",
    },

    status: "active",
    featured: true,
    createdAt: "2026-08-20",
  },

  {
    id: "prod-002",
    name: "Mara Lounge Chair",
    slug: "mara-lounge-chair",
    description:
      "A sculptural lounge chair combining solid timber craftsmanship with soft upholstery.",
    category: "chairs",
    price: 38000,
    currency: "KES",

    imageUrl:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",

    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
    ],

    materials: [
      {
        id: "material-003",
        name: "Teak",
        color: "Teak",
        hexCode: "#B8865B",
      },
    ],

    dimensions: {
      width: 75,
      depth: 78,
      height: 82,
      unit: "cm",
    },

    status: "active",
    featured: true,
    createdAt: "2026-08-19",
  },

  {
    id: "prod-003",
    name: "Nairobi Dining Table",
    slug: "nairobi-dining-table",
    description:
      "A solid timber dining table designed to become the centrepiece of your dining space.",
    category: "tables",
    price: 72000,
    currency: "KES",

    imageUrl:
      "https://images.unsplash.com/photo-1615529162924-f8605388461d",

    images: [
      "https://images.unsplash.com/photo-1615529162924-f8605388461d",
    ],

    materials: [
      {
        id: "material-004",
        name: "Mahogany",
        color: "Mahogany",
        hexCode: "#6E3B24",
      },
    ],

    dimensions: {
      width: 180,
      depth: 90,
      height: 75,
      unit: "cm",
    },

    status: "active",
    createdAt: "2026-08-18",
  },

  {
    id: "prod-004",
    name: "Savanna Bed",
    slug: "savanna-bed",
    description:
      "A warm minimalist timber bed frame crafted for calm and comfortable bedrooms.",
    category: "beds",
    price: 95000,
    currency: "KES",

    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",

    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    ],

    materials: [
      {
        id: "material-005",
        name: "Natural Timber",
        color: "Natural Timber",
        hexCode: "#C19A6B",
      },
    ],

    dimensions: {
      width: 160,
      depth: 200,
      height: 100,
      unit: "cm",
    },

    status: "active",
    featured: true,
    createdAt: "2026-08-17",
  },

  {
    id: "prod-005",
    name: "Kifaru Sideboard",
    slug: "kifaru-sideboard",
    description:
      "A clean-lined timber sideboard providing practical storage with a handcrafted feel.",
    category: "storage",
    price: 64000,
    currency: "KES",

    imageUrl:
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8",

    images: [
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8",
    ],

    materials: [
      {
        id: "material-006",
        name: "Dark Walnut",
        color: "Dark Walnut",
        hexCode: "#3E2723",
      },
    ],

    dimensions: {
      width: 160,
      depth: 45,
      height: 80,
      unit: "cm",
    },

    status: "active",
    createdAt: "2026-08-16",
  },

  {
    id: "prod-006",
    name: "Coastal Outdoor Chair",
    slug: "coastal-outdoor-chair",
    description:
      "A durable outdoor timber chair designed for patios, balconies and garden spaces.",
    category: "outdoor",
    price: 24000,
    currency: "KES",

    imageUrl:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",

    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
    ],

    materials: [
      {
        id: "material-007",
        name: "Teak",
        color: "Teak",
        hexCode: "#B8865B",
      },
    ],

    dimensions: {
      width: 65,
      depth: 70,
      height: 85,
      unit: "cm",
    },

    status: "active",
    createdAt: "2026-08-15",
  },
];