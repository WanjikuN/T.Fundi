import type { OrderStatus } from "../types/orders.types";

type Props = {
  status: OrderStatus;
};

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
  in_production: {
    label: "In production",
    className: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  },
  ready: {
    label: "Ready",
    className: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  },
  out_for_delivery: {
    label: "Out for delivery",
    className: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-700 dark:text-red-400",
  },
};

const OrderStatusBadge = ({ status }: Props) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
