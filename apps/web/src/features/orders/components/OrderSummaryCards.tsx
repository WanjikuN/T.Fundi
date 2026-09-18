import {
  CheckCircle2,
  Clock3,
  Package,
  ShoppingBag,
} from "lucide-react";
import type { Order } from "../types/orders.types";

type Props = {
  orders: Order[];
};

const OrderSummaryCards = ({ orders }: Props) => {
  const pending = orders.filter(
    (order) =>
      order.orderStatus === "pending" ||
      order.orderStatus === "confirmed",
  ).length;

  const production = orders.filter(
    (order) => order.orderStatus === "in_production",
  ).length;

  const delivered = orders.filter(
    (order) => order.orderStatus === "delivered",
  ).length;

  const metrics = [
    {
      label: "Total orders",
      value: orders.length,
      icon: ShoppingBag,
    },
    {
      label: "Awaiting action",
      value: pending,
      icon: Clock3,
    },
    {
      label: "In production",
      value: production,
      icon: Package,
    },
    {
      label: "Completed",
      value: delivered,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-5  border-[var(--color-border)] py-1 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.label}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-muted)]">
              <Icon
                size={17}
                className="text-[var(--color-muted-foreground)]"
              />
            </div>

            <div>
              <p className="text-xl font-semibold tracking-tight">
                {metric.value}
              </p>

              <p className="text-xs text-[var(--color-muted-foreground)]">
                {metric.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderSummaryCards;