import { MapPin } from "lucide-react";
import type { Order } from "../types/orders.types";

type Props = {
  order: Order;
};

const OrderDeliverySummary = ({ order }: Props) => {
  const address = order.shippingAddress;

  return (
    <div className="rounded-2xl border border-[var(--color-border)] p-5">
      <div className="flex items-center gap-2">
        <MapPin size={17} />

        <h2 className="font-semibold">
          Delivery
        </h2>
      </div>

      {address ? (
        <div className="mt-4 text-sm">
          <p className="font-medium">
            {[address.firstName, address.lastName]
              .filter(Boolean)
              .join(" ")}
          </p>

          <p className="mt-1 text-[var(--color-muted-foreground)]">
            {address.addressLine1}
          </p>

          {address.addressLine2 && (
            <p className="text-[var(--color-muted-foreground)]">
              {address.addressLine2}
            </p>
          )}

          <p className="text-[var(--color-muted-foreground)]">
            {address.city}
            {address.county
              ? `, ${address.county}`
              : ""}
          </p>

          <p className="text-[var(--color-muted-foreground)]">
            {address.country}
          </p>

          {address.phone && (
            <p className="mt-2 text-[var(--color-muted-foreground)]">
              {address.phone}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
          No delivery address provided.
        </p>
      )}
    </div>
  );
};

export default OrderDeliverySummary;