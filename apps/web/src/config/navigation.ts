import {
  LayoutDashboard,
  Package,
  Sparkles,
  ShoppingCart,
  Hammer,
  Settings,
} from "lucide-react";

export const navigationItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Catalog",
    path: "/catalog",
    icon: Package,
  },
  {
    label: "AI Studio",
    path: "/ai-studio",
    icon: Sparkles,
  },
  {
    label: "Orders",
    path: "/orders",
    icon: ShoppingCart,
  },
  {
    label: "Workshop",
    path: "/workshop",
    icon: Hammer,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
