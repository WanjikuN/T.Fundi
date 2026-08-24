import { Router } from "express";

import { authenticate } from "../auth/auth.middleware.js";

import { getCurrentTenant } from "./tenant.controller.js";

import { resolveTenant } from "./tenant.middleware.js";

const router = Router();

router.get(
  "/current",
  authenticate,
  resolveTenant,
  getCurrentTenant,
);

export default router;