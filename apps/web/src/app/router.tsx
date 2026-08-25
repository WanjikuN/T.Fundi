import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import AIStudioPage from "../features/ai-studio/pages/AIStudioPage";
import OrdersPage from "../features/commerce/pages/OrdersPage";
import WorkshopPage from "../features/workshop/pages/WorkshopPage";
import SettingsPage from "../features/identity/pages/SettingsPage";
import BrandingPage from "../features/tenant/pages/BrandingPage";

import LoginPage from "../features/auth/pages/LoginPage";

import CatalogPage from "../features/catalog/pages/CatalogPage";
import ProductDetailsPage from "../features/catalog/pages/ProductDetailsPage";
import CreateProductPage from "../features/catalog/pages/CreateProductPage";
import ProductReviewPage from "../features/catalog/pages/ProductReviewPage";

const router = createBrowserRouter([
  /*
   * =========================================================
   * PUBLIC ROUTES
   * =========================================================
   */

  {
    path: "/login",
    element: <LoginPage />,
  },

  /*
   * =========================================================
   * PROTECTED APPLICATION
   * =========================================================
   */

  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),

    children: [
      /*
       * =======================================================
       * DASHBOARD
       * =======================================================
       */

      {
        index: true,
        element: <DashboardPage />,
      },

      /*
       * =======================================================
       * CATALOG
       * =======================================================
       */

      {
        path: "catalog",
        element: <CatalogPage />,
      },

      /*
       * =======================================================
       * CREATE PRODUCT
       *
       * /catalog/products/new
       * =======================================================
       */

      {
        path: "catalog/products/new",
        element: <CreateProductPage />,
      },

      /*
       * =======================================================
       * PRODUCT REVIEW
       *
       * /catalog/products/new/review
       * =======================================================
       */

      {
        path: "catalog/products/new/review",
        element: <ProductReviewPage />,
      },

      /*
       * =======================================================
       * PRODUCT DETAILS
       *
       * /catalog/:slug
       * =======================================================
       */

      {
        path: "catalog/:slug",
        element: <ProductDetailsPage />,
      },

      /*
       * =======================================================
       * AI STUDIO
       * =======================================================
       */

      {
        path: "ai-studio",
        element: <AIStudioPage />,
      },

      /*
       * =======================================================
       * COMMERCE
       * =======================================================
       */

      {
        path: "orders",
        element: <OrdersPage />,
      },

      /*
       * =======================================================
       * WORKSHOP
       * =======================================================
       */

      {
        path: "workshop",
        element: <WorkshopPage />,
      },

      /*
       * =======================================================
       * SETTINGS
       * =======================================================
       */

      {
        path: "settings",
        element: <SettingsPage />,
      },

      {
        path: "settings/branding",
        element: <BrandingPage />,
      },
    ],
  },
]);

export default router;