import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { getOrderById } from "../api/orders.api";
import { getWorkshopJobs } from "../../workshop/api/workshop.api";
import type { Order } from "../types/orders.types";
import type { WorkshopJob } from "../../workshop/types/workshop.types";
import OrderDeliverySummary from "../components/OrderDeliverySummary";
import OrderItemsSummary from "../components/OrderItemsSummary";
import OrderProductionProgress from "../components/OrderProductionProgress";
import OrderStatusTimeline from "../components/OrderStatusTimeline";

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [workshopJob, setWorkshopJob] =
    useState<WorkshopJob | undefined>();
  const [loading, setLoading] = useState(true);

  const loadOrder = useCallback(async () => {
    if (!orderId) return;

    setLoading(true);

    try {
      const [orderData, workshopJobs] =
        await Promise.all([
          getOrderById(orderId),
          getWorkshopJobs(),
        ]);

      if (!orderData) {
        navigate("/orders", { replace: true });
        return;
      }

      setOrder(orderData);

      const relatedJob = workshopJobs.find(
        (job) => job.orderId === orderData.id,
      );

      setWorkshopJob(relatedJob);
    } finally {
      setLoading(false);
    }
  }, [navigate, orderId]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-[var(--color-muted)]" />
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-[var(--color-muted)]" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] transition hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to orders
          </Link>

          <div>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Order {order.orderNumber}
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Track your order
            </h1>

            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Placed{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <OrderStatusTimeline
            status={order.orderStatus}
          />

          {workshopJob && (
            <OrderProductionProgress
              job={workshopJob}
            />
          )}

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <OrderItemsSummary order={order} />

            <OrderDeliverySummary order={order} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;