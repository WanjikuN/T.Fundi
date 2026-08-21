import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";

import router from "./app/router";
import TenantProvider from "./app/providers/TenantProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TenantProvider>
      <RouterProvider router={router} />
    </TenantProvider>
  </StrictMode>,
);