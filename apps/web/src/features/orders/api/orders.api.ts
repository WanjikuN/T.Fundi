import type { Order, OrderStatus} from "../types/orders.types";

const mockOrders: Order[] = [
  {
    id: "order-001",
    orderNumber: "TF-10001",

    customer: {
      id: "customer-001",
      name: "Wanjiku Kamau",
      email: "wanjiku@example.com",
      phone: "+254 712 345 678",
    },

    items: [
      {
        id: "item-001",
        productId: "prod-001",
        productName: "Luna Sofa",
        productImage:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
        quantity: 1,
        unitPrice: 85000,
        currency: "KES",
        selectedOptions: [
          {
            optionId: "material",
            optionName: "Material",
            valueId: "velvet",
            valueName: "Velvet",
          },
          {
            optionId: "color",
            optionName: "Color",
            valueId: "forest-green",
            valueName: "Forest Green",
          },
        ],
      },
    ],

    subtotal: 85000,
    deliveryFee: 3500,
    total: 88500,
    currency: "KES",

    orderStatus: "in_production",
    paymentStatus: "paid",
    fulfillmentStatus: "in_production",

    shippingAddress: {
      addressLine1: "Westlands",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
    },

    createdAt: "2026-09-16T09:30:00Z",
  },

  {
    id: "order-002",
    orderNumber: "TF-10002",

    customer: {
      id: "customer-002",
      name: "Brian Mwangi",
      email: "brian@example.com",
      phone: "+254 722 456 789",
    },

    items: [
      {
        id: "item-002",
        productId: "prod-002",
        productName: "Mara Lounge Chair",
        productImage:
          "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
        quantity: 2,
        unitPrice: 38000,
        currency: "KES",
      },
    ],

    subtotal: 76000,
    deliveryFee: 2500,
    total: 78500,
    currency: "KES",

    orderStatus: "confirmed",
    paymentStatus: "paid",
    fulfillmentStatus: "not_started",

    shippingAddress: {
      addressLine1: "Kilimani",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
    },

    createdAt: "2026-09-17T11:15:00Z",
  },

  {
    id: "order-003",
    orderNumber: "TF-10003",

    customer: {
      id: "customer-003",
      name: "Amina Hassan",
      email: "amina@example.com",
    },

    items: [
      {
        id: "item-003",
        productId: "prod-003",
        productName: "Nairobi Dining Table",
        productImage:
          "https://images.unsplash.com/photo-1617098900591-3f90928e8c54",
        quantity: 1,
        unitPrice: 72000,
        currency: "KES",
      },
    ],

    subtotal: 72000,
    deliveryFee: 4000,
    total: 76000,
    currency: "KES",

    orderStatus: "delivered",
    paymentStatus: "paid",
    fulfillmentStatus: "delivered",

    createdAt: "2026-09-10T08:00:00Z",
  },
];

export const getOrders = async (): Promise<Order[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockOrders;
};

export const getOrderById = async (
  orderId: string,
): Promise<Order | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return mockOrders.find((order) => order.id === orderId) ?? null;
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
): Promise<Order | null> => {
  await new Promise((resolve) =>
    setTimeout(resolve, 200),
  );

  const order = mockOrders.find(
    (item) => item.id === orderId,
  );

  if (!order) {
    return null;
  }

  order.orderStatus = status;
  order.updatedAt = new Date().toISOString();

  if (status === "in_production") {
    order.fulfillmentStatus = "in_production";
  }

  if (status === "ready") {
    order.fulfillmentStatus = "ready";
  }

  if (status === "out_for_delivery") {
    order.fulfillmentStatus = "out_for_delivery";
  }

  if (status === "delivered") {
    order.fulfillmentStatus = "delivered";
  }

  return order;
};