import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import CatalogPage from "../features/catalog/pages/CatalogPage";
import AIStudioPage from "../features/ai-studio/pages/AIStudioPage";
import OrdersPage from "../features/commerce/pages/OrdersPage";
import WorkshopPage from "../features/workshop/pages/WorkshopPage";
import SettingsPage from "../features/identity/pages/SettingsPage";
import BrandingPage from "../features/tenant/pages/BrandingPage";

import LoginPage from "../features/auth/pages/LoginPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
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
      {
        path: "/settings/branding",
        element: <BrandingPage />,
      },
    ],
  },
]);

export default router;