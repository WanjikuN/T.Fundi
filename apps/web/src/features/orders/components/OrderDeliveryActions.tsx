import { Truck, CheckCircle2 } from "lucide-react";
import type { Order } from "../types/orders.types";

type Props = {
  order: Order;
  onStatusChange: (status: Order["orderStatus"]) => Promise<void>;
  updating?: boolean;
};

const OrderDeliveryActions = ({
  order,
  onStatusChange,
  updating = false,
}: Props) => {
  if (order.orderStatus === "ready") {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-[var(--color-muted)] p-2">
            <Truck size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-semibold">
              Ready for delivery
            </h2>

            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              This order has completed production and can now
              be handed over for delivery.
            </p>

            <button
              type="button"
              disabled={updating}
              onClick={() =>
                void onStatusChange("out_for_delivery")
              }
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-sm font-medium text-[var(--color-primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Truck size={16} />
              {updating
                ? "Updating..."
                : "Mark out for delivery"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (order.orderStatus === "out_for_delivery") {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-[var(--color-muted)] p-2">
            <CheckCircle2 size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-semibold">
              Out for delivery
            </h2>

            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Confirm once the customer has received the
              order.
            </p>

            <button
              type="button"
              disabled={updating}
              onClick={() =>
                void onStatusChange("delivered")
              }
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-sm font-medium text-[var(--color-primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              {updating
                ? "Updating..."
                : "Mark as delivered"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (order.orderStatus === "delivered") {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[var(--color-muted)] p-2">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <h2 className="font-semibold">
              Order delivered
            </h2>

            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              This order has been completed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OrderDeliveryActions;