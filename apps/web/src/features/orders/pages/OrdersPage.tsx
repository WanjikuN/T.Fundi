import { Plus, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import OrderFilters from "../components/OrderFilters";
import OrdersTable from "../components/OrdersTable";
import OrderSummaryCards from "../components/OrderSummaryCards";
import { getOrders } from "../api/orders.api";
import type { Order, OrderStatus } from "../types/orders.types";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);

    try {
      const data = await getOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !normalizedSearch ||
        order.orderNumber.toLowerCase().includes(normalizedSearch) ||
        order.customer.name.toLowerCase().includes(normalizedSearch) ||
        order.customer.email.toLowerCase().includes(normalizedSearch) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(normalizedSearch),
        );

      const matchesStatus = status === "all" || order.orderStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-[1600px] space-y-7 p-5 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-muted-foreground)]">
              Sales & fulfillment
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Orders
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-muted-foreground)]">
              Keep track of customer purchases, payments and fulfillment from
              one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void loadOrders()}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--color-primary)] px-3 text-sm font-medium transition hover:bg-[var(--color-muted)] disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={
                  loading ? "animate-spin" : "text-[var(--color-primary)]"
                }
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-sm font-medium text-[var(--color-primary-foreground)] shadow-sm transition hover:opacity-90"
            >
              <Plus size={16} />
              New order
            </button>
          </div>
        </div>

        {/* Metrics */}
        <OrderSummaryCards orders={orders} />

        {/* Order workspace */}
        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">All orders</h2>

              <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
                {filteredOrders.length}{" "}
                {filteredOrders.length === 1 ? "order" : "orders"} shown
              </p>
            </div>

            <OrderFilters
              search={search}
              status={status}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
            />
          </div>

          {loading ? (
            <div className="overflow-hidden rounded-2xl  border-[var(--color-border)]">
              <div className="divide-y divide-[var(--color-border)]">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex h-[76px] animate-pulse items-center gap-5 px-5"
                  >
                    <div className="h-8 w-24 rounded bg-[var(--color-muted)]" />
                    <div className="h-8 w-36 rounded bg-[var(--color-muted)]" />
                    <div className="h-5 w-12 rounded bg-[var(--color-muted)]" />
                    <div className="ml-auto h-5 w-20 rounded bg-[var(--color-muted)]" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <OrdersTable orders={filteredOrders} />
          )}
        </section>
      </div>
    </div>
  );
};

export default OrdersPage;
