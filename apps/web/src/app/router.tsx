import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import AIStudioPage from "../features/ai-studio/pages/AIStudioPage";
import WorkshopPage from "../features/workshop/pages/WorkshopPage";
import WorkshopJobDetailsPage from "../features/workshop/pages/WorkshopJobDetailsPage";

import SettingsPage from "../features/identity/pages/SettingsPage";
import BrandingPage from "../features/tenant/pages/BrandingPage";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";

import CatalogPage from "../features/catalog/pages/CatalogPage";
import ProductDetailsPage from "../features/catalog/pages/ProductDetailsPage";
import CreateProductPage from "../features/catalog/pages/CreateProductPage";
import ProductReviewPage from "../features/catalog/pages/ProductReviewPage";
import CatalogSettingsPage from "../features/catalog/pages/CatalogSettingsPage";

import OrdersPage from "../features/orders/pages/OrdersPage";
import OrderDetailsPage from "../features/orders/pages/OrderDetailsPage";
import OrderTrackingPage from "../features/orders/pages/OrderTrackingPage";
import ProductIntelligencePage from "../features/ai-studio/pages/ProductIntelligencePage";
import RoomVisualizerPage from "../features/ai-studio/pages/RoomVisualizerPage";
const router = createBrowserRouter([
  /*
   * =========================================================
   * PUBLIC ROUTES
   * =========================================================
   */

  /*
   * =========================================================
   * PUBLIC AUTH ROUTES
   * =========================================================
   */

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/register",
    element: <RegisterPage />,
  },

  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
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
        path: "catalog/products/:slug",
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
      {
        path: "ai-studio/product-intelligence",
        element: <ProductIntelligencePage />,
      },
      { path: "ai-studio/room-visualizer", element: <RoomVisualizerPage /> },
      /*
       * =======================================================
       * COMMERCE
       * =======================================================
       */

      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "orders/:orderId",
        element: <OrderDetailsPage />,
      },
      {
        path: "orders/:orderId/track",
        element: <OrderTrackingPage />,
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
      {
        path: "workshop/:jobId",
        element: <WorkshopJobDetailsPage />,
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
        path: "/settings/catalog",
        element: <CatalogSettingsPage />,
      },
      {
        path: "settings/branding",
        element: <BrandingPage />,
      },
    ],
  },
]);

export default router;
