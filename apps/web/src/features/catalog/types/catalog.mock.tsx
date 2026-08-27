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
    quantity: 10,

    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",

    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25",
    ],

    options: [
      {
        id: "option-material",
        name: "Material",
        type: "material",
        values: [
          {
            id: "natural-oak",
            name: "Natural Oak",
            hexCode: "#C69C6D",
            images: [
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
              "https://images.unsplash.com/photo-1540574163026-643ea20ade25",
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
              "https://images.unsplash.com/photo-1540574163026-643ea20ade25",
            ],
          },
          {
            id: "walnut",
            name: "Walnut",
            hexCode: "#5C4033",
            images: [
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
              "https://images.unsplash.com/photo-1540574163026-643ea20ade25",
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
              "https://images.unsplash.com/photo-1540574163026-643ea20ade25",
            ],
          },
        ],
      },

      {
        id: "option-color",
        name: "Color",
        type: "color",
        values: [
          {
            id: "sand",
            name: "Sand",
            hexCode: "#D6C5A8",
          },
          {
            id: "charcoal",
            name: "Charcoal",
            hexCode: "#333333",
          },
          {
            id: "forest-green",
            name: "Forest Green",
            hexCode: "#31543A",
          },
        ],
      },

      {
        id: "option-finish",
        name: "Finish",
        type: "select",
        values: [
          {
            id: "matte",
            name: "Matte",
          },
          {
            id: "gloss",
            name: "Gloss",
          },
        ],
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
    quantity: 10,

    imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",

    images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c"],

    options: [
      {
        id: "option-material",
        name: "Wood",
        type: "material",
        values: [
          {
            id: "teak",
            name: "Teak",
            hexCode: "#B8865B",
          },
          {
            id: "mahogany",
            name: "Mahogany",
            hexCode: "#6E3B24",
          },
        ],
      },

      {
        id: "option-upholstery",
        name: "Upholstery",
        type: "select",
        values: [
          {
            id: "linen",
            name: "Linen",
          },
          {
            id: "velvet",
            name: "Velvet",
          },
          {
            id: "leather",
            name: "Leather",
          },
        ],
      },

      {
        id: "option-color",
        name: "Color",
        type: "color",
        values: [
          {
            id: "cream",
            name: "Cream",
            hexCode: "#E8DDC8",
          },
          {
            id: "charcoal",
            name: "Charcoal",
            hexCode: "#333333",
          },
          {
            id: "terracotta",
            name: "Terracotta",
            hexCode: "#B85C38",
          },
        ],
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
    quantity: 10,

    imageUrl: "https://images.unsplash.com/photo-1615529162924-f8605388461d",

    images: ["https://images.unsplash.com/photo-1615529162924-f8605388461d"],

    options: [
      {
        id: "option-wood",
        name: "Wood",
        type: "material",
        values: [
          {
            id: "mahogany",
            name: "Mahogany",
            hexCode: "#6E3B24",
          },
          {
            id: "walnut",
            name: "Walnut",
            hexCode: "#5C4033",
          },
          {
            id: "oak",
            name: "Oak",
            hexCode: "#C69C6D",
          },
        ],
      },

      {
        id: "option-finish",
        name: "Finish",
        type: "select",
        values: [
          {
            id: "natural",
            name: "Natural",
          },
          {
            id: "matte",
            name: "Matte",
          },
          {
            id: "gloss",
            name: "Gloss",
          },
        ],
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
    quantity: 10,

    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",

    images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"],

    options: [
      {
        id: "option-material",
        name: "Material",
        type: "material",
        values: [
          {
            id: "natural-timber",
            name: "Natural Timber",
            hexCode: "#C19A6B",
          },
          {
            id: "walnut",
            name: "Walnut",
            hexCode: "#5C4033",
          },
        ],
      },

      {
        id: "option-finish",
        name: "Finish",
        type: "select",
        values: [
          {
            id: "natural",
            name: "Natural",
          },
          {
            id: "matte",
            name: "Matte",
          },
        ],
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
    quantity: 10,

    imageUrl: "https://images.unsplash.com/photo-1558997519-83ea9252edf8",

    images: ["https://images.unsplash.com/photo-1558997519-83ea9252edf8"],

    options: [
      {
        id: "option-material",
        name: "Wood",
        type: "material",
        values: [
          {
            id: "dark-walnut",
            name: "Dark Walnut",
            hexCode: "#3E2723",
          },
          {
            id: "oak",
            name: "Oak",
            hexCode: "#C69C6D",
          },
        ],
      },

      {
        id: "option-hardware",
        name: "Hardware",
        type: "select",
        values: [
          {
            id: "brass",
            name: "Brass",
          },
          {
            id: "black",
            name: "Black",
          },
        ],
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
    quantity: 10,

    imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",

    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0"],

    options: [
      {
        id: "option-material",
        name: "Material",
        type: "material",
        values: [
          {
            id: "teak",
            name: "Teak",
            hexCode: "#B8865B",
          },
          {
            id: "natural-timber",
            name: "Natural Timber",
            hexCode: "#C19A6B",
          },
        ],
      },

      {
        id: "option-finish",
        name: "Finish",
        type: "select",
        values: [
          {
            id: "natural",
            name: "Natural",
          },
          {
            id: "weathered",
            name: "Weathered",
          },
        ],
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
