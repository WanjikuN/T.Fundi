import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Order } from "../types/orders.types";
import OrderStatusBadge from "./OrderStatusBadge";

type Props = {
  orders: Order[];
};

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const OrdersTable = ({ orders }: Props) => {
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-muted)]">
          <span className="text-lg">⌕</span>
        </div>

        <h3 className="mt-4 font-medium">
          No orders found
        </h3>

        <p className="mt-1 max-w-sm text-sm text-[var(--color-muted-foreground)]">
          Try changing your search or status filter to find
          the order you're looking for.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-2xl md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-primary)] bg-[var(--color-muted)]/30">
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Order
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Customer
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Items
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Total
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Status
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Date
              </th>

              <th />
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const firstItem = order.items[0];
              const itemCount = order.items.reduce(
                (sum, item) => sum + item.quantity,
                0,
              );

              return (
                <tr
                  key={order.id}
                  onClick={() =>
                    navigate(`/orders/${order.id}`)
                  }
                  className="cursor-pointer border-b border-[var(--color-primary)] transition last:border-0 hover:bg-[var(--color-muted)]/20"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold">
                        {order.orderNumber}
                      </p>

                      <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
                        {firstItem?.productName}
                        {order.items.length > 1 &&
                          ` + ${order.items.length - 1} more`}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-muted)] text-[10px] font-semibold">
                        {getInitials(order.customer.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {order.customer.name}
                        </p>

                        <p className="truncate text-xs text-[var(--color-muted-foreground)]">
                          {order.customer.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--color-muted-foreground)]">
                    {itemCount}{" "}
                    {itemCount === 1 ? "item" : "items"}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold">
                    {formatCurrency(
                      order.total,
                      order.currency,
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <OrderStatusBadge
                      status={order.orderStatus}
                    />
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-[var(--color-muted-foreground)]">
                    {formatDate(order.createdAt)}
                  </td>

                  <td className="pr-4">
                    <ChevronRight
                      size={17}
                      className="text-[var(--color-muted-foreground)]"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        {orders.map((order) => {
          const firstItem = order.items[0];
          const itemCount = order.items.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );

          return (
            <button
              key={order.id}
              type="button"
              onClick={() =>
                navigate(`/orders/${order.id}`)
              }
              className="w-full rounded-2xl border border-[var(--color-primary)] p-4 text-left transition active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {order.orderNumber}
                  </p>

                  <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <OrderStatusBadge
                  status={order.orderStatus}
                />
              </div>

              <div className="mt-4 flex items-center gap-3">
                {firstItem?.productImage ? (
                  <img
                    src={firstItem.productImage}
                    alt={firstItem.productName}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-[var(--color-muted)]" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {firstItem?.productName}
                  </p>

                  <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
                    {itemCount}{" "}
                    {itemCount === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between border-t border-[var(--color-border)] pt-3">
                <div>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Customer
                  </p>

                  <p className="mt-0.5 text-sm font-medium">
                    {order.customer.name}
                  </p>
                </div>

                <p className="text-sm font-semibold">
                  {formatCurrency(
                    order.total,
                    order.currency,
                  )}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default OrdersTable;