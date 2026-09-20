import {
  Check,
  Circle,
  Factory,
  PackageCheck,
  Truck,
} from "lucide-react";
import type { OrderStatus } from "../types/orders.types";

type Props = {
  status: OrderStatus;
};

const steps = [
  {
    status: "confirmed" as const,
    label: "Order confirmed",
    description: "Your order has been confirmed.",
    icon: Check,
  },
  {
    status: "in_production" as const,
    label: "In production",
    description: "Your order is being prepared.",
    icon: Factory,
  },
  {
    status: "ready" as const,
    label: "Ready for delivery",
    description: "Your order is ready to leave the workshop.",
    icon: PackageCheck,
  },
  {
    status: "out_for_delivery" as const,
    label: "Out for delivery",
    description: "Your order is on its way.",
    icon: Truck,
  },
  {
    status: "delivered" as const,
    label: "Delivered",
    description: "Your order has been delivered.",
    icon: Check,
  },
];

const statusOrder: OrderStatus[] = [
  "pending",
  "confirmed",
  "in_production",
  "ready",
  "out_for_delivery",
  "delivered",
];

const OrderStatusTimeline = ({ status }: Props) => {
  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] p-5">
      <h2 className="font-semibold">Order progress</h2>

      <div className="mt-6">
        {steps.map((step, index) => {
          const stepIndex = statusOrder.indexOf(step.status);
          const completed = currentIndex >= stepIndex;
          const current = currentIndex === stepIndex;

          const Icon = completed ? step.icon : Circle;

          return (
            <div
              key={step.status}
              className="relative flex gap-4"
            >
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-px ${
                    currentIndex > stepIndex
                      ? "bg-[var(--color-primary)]"
                      : "bg-[var(--color-border)]"
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                  completed
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                    : "border-[var(--color-border)] text-[var(--color-muted-foreground)]"
                }`}
              >
                <Icon size={15} />
              </div>

              <div className="pb-7">
                <p
                  className={`text-sm font-medium ${
                    current
                      ? "text-foreground"
                      : completed
                        ? "text-foreground"
                        : "text-[var(--color-muted-foreground)]"
                  }`}
                >
                  {step.label}
                </p>

                <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;