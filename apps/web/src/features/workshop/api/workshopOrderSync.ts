import type { OrderStatus } from "../../orders/types/orders.types";
import type { WorkshopJobStatus } from "../types/workshop.types";

export const workshopStatusToOrderStatus = (
  status: WorkshopJobStatus,
): OrderStatus => {
  switch (status) {
    case "not_started":
      return "confirmed";

    case "in_progress":
      return "in_production";

    case "on_hold":
      return "in_production";

    case "completed":
      return "ready";

    case "cancelled":
      return "cancelled";

    default:
      return "confirmed";
  }
};