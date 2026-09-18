export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_production"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "partially_paid"
  | "failed"
  | "refunded";

export type FulfillmentStatus =
  | "not_started"
  | "in_production"
  | "ready"
  | "out_for_delivery"
  | "delivered";

export type OrderItemOption = {
  optionId: string;
  optionName: string;
  valueId: string;
  valueName: string;
};

export type OrderItem = {
  id: string;

  productId: string;
  productName: string;
  productImage?: string;

  variantId?: string;

  quantity: number;
  unitPrice: number;
  currency: string;

  selectedOptions?: OrderItemOption[];
};

export type OrderCustomer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

export type OrderAddress = {
  firstName?: string;
  lastName?: string;
  phone?: string;

  addressLine1: string;
  addressLine2?: string;
  city: string;
  county?: string;
  country: string;
};

export type Order = {
  id: string;
  orderNumber: string;

  customer: OrderCustomer;

  items: OrderItem[];

  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;

  shippingAddress?: OrderAddress;

  createdAt: string;
  updatedAt?: string;
};