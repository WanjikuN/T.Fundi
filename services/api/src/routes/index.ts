import { Router } from "express";

import authRoutes from "../features/auth/auth.routes.js";
import tenantRoutes from "../features/tenant/tenant.routes.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    service: "t.fundi-api",
    status: "ok",
  });
});

router.use("/auth", authRoutes);
router.use("/tenant", tenantRoutes);

export { router };