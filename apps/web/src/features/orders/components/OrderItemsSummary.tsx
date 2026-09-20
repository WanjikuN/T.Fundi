import type { Order } from "../types/orders.types";

type Props = {
  order: Order;
};

const OrderItemsSummary = ({ order }: Props) => {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] p-5">
      <h2 className="font-semibold">Items</h2>

      <div className="mt-4 divide-y divide-[var(--color-border)]">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[var(--color-muted)]">
              {item.productImage ? (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-[var(--color-muted-foreground)]">
                  No image
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                {item.productName}
              </p>

              <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                Quantity: {item.quantity}
              </p>

              {item.selectedOptions?.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.selectedOptions.map((option) => (
                    <span
                      key={`${option.optionId}-${option.valueId}`}
                      className="rounded-full bg-[var(--color-muted)] px-2 py-1 text-[11px]"
                    >
                      {option.optionName}: {option.valueName}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <p className="shrink-0 text-sm font-medium">
              {item.currency}{" "}
              {(item.unitPrice * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2 border-t border-[var(--color-border)] pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--color-muted-foreground)]">
            Subtotal
          </span>
          <span>
            {order.currency}{" "}
            {order.subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-[var(--color-muted-foreground)]">
            Delivery
          </span>
          <span>
            {order.currency}{" "}
            {order.deliveryFee.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between pt-2 text-base font-semibold">
          <span>Total</span>
          <span>
            {order.currency} {order.total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsSummary;