import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
    ],
  },
]);

export default router;