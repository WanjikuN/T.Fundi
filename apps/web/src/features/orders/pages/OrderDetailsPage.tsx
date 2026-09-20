import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../api/orders.api";
import OrderStatusBadge from "../components/OrderStatusBadge";
import type { Order } from "../types/orders.types";
import OrderDeliveryActions from "../components/OrderDeliveryActions";
import { ExternalLink } from "lucide-react";

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleStatusChange = async (status: Order["orderStatus"]) => {
    if (!order || updatingStatus) return;

    setUpdatingStatus(true);

    try {
      const updatedOrder = await updateOrderStatus(order.id, status);

      if (updatedOrder) {
        setOrder(updatedOrder);
      }
    } finally {
      setUpdatingStatus(false);
    }
  };
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } finally {
        setLoading(false);
      }
    };

    void loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="h-[90vh] flex flex-col items-center justify-center">
        <Loader2 size={22} className="animate-spin" />
        <p>Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4 p-8">
        <Link to="/orders" className="inline-flex items-center gap-2 text-sm">
          <ArrowLeft size={16} />
          Back to orders
        </Link>

        <div>
          <h1 className="text-2xl font-semibold">Order not found</h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            The order may have been removed or is no longer available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to orders
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            to={`/orders/${order.id}/track`}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 text-sm font-medium transition hover:bg-[var(--color-muted)]"
          >
            <ExternalLink size={16} />          <h1 className="text-2xl font-semibold">{order.orderNumber}</h1>

            Track customer view
          </Link>
          {/* <p className="text-sm text-[var(--color-muted-foreground)]">Order</p> */}

        </div>

        <OrderStatusBadge status={order.orderStatus} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-xl  border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="border-b border-[var(--color-primary)] px-5">
            <h2 className="font-semibold">Order items</h2>
          </div>

          <div className="divide-y divide-[var(--color-border)]">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-5">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--color-muted)]">
                  {item.productImage && (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-medium">{item.productName}</h3>

                  <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                    Qty: {item.quantity}
                  </p>

                  {item.selectedOptions?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.selectedOptions.map((option) => (
                        <span
                          key={`${option.optionId}-${option.valueId}`}
                          className="rounded-md bg-[var(--color-muted)] px-2 py-1 text-xs"
                        >
                          {option.optionName}: {option.valueName}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <p className="font-medium">
                  {formatCurrency(
                    item.unitPrice * item.quantity,
                    item.currency,
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="shadow-md rounded-xl border border-[var(--color-primary)] bg-[var(--color-card)] p-5">
            <h2 className="font-semibold">Customer</h2>

            <div className="mt-4 space-y-1 text-sm">
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-[var(--color-muted-foreground)]">
                {order.customer.email}
              </p>

              {order.customer.phone && (
                <p className="text-[var(--color-muted-foreground)]">
                  {order.customer.phone}
                </p>
              )}
            </div>
          </section>

          <section className="shadow-md rounded-xl border border-[var(--color-primary)] bg-[var(--color-card)] p-5">
            <h2 className="font-semibold">Order summary</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal, order.currency)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{formatCurrency(order.deliveryFee, order.currency)}</span>
              </div>

              <div className="flex justify-between border-t border-[var(--color-border)] pt-3 font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total, order.currency)}</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
      <OrderDeliveryActions
        order={order}
        onStatusChange={handleStatusChange}
        updating={updatingStatus}
      />
    </div>
  );
};

export default OrderDetailsPage;
