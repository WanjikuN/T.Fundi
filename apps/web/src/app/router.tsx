import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import CatalogPage from "../features/catalog/pages/CatalogPage";
import AIStudioPage from "../features/ai-studio/pages/AIStudioPage";
import OrdersPage from "../features/commerce/pages/OrdersPage";
import WorkshopPage from "../features/workshop/pages/WorkshopPage";
import SettingsPage from "../features/identity/pages/SettingsPage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/catalog",
        element: <CatalogPage />,
      },
      {
        path: "/ai-studio",
        element: <AIStudioPage />,
      },
      {
        path: "/orders",
        element: <OrdersPage />,
      },
      {
        path: "/workshop",
        element: <WorkshopPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

export default router;