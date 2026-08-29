import { Router } from "express";

import { authenticate } from "../auth/auth.middleware.js";

import { resolveTenant } from "../tenant/tenant.middleware.js";

import {
  createCharacteristicController,
  createCharacteristicValueController,
  deleteCharacteristicController,
  deleteCharacteristicValueController,
  getCatalogSettingsController,
  updateCatalogSettingsController,
  updateCharacteristicController,
  updateCharacteristicValueController,
} from "./catalog.controller.js";

const router = Router();

/**
 * Every catalog request must:
 *
 * 1. Have a valid access token.
 * 2. Resolve the tenant from X-Tenant-Slug.
 *
 * This prevents one tenant from accessing another
 * tenant's catalog configuration.
 */

router.use(
  authenticate,
  resolveTenant,
);

/**
 * =========================================================
 * CATALOG SETTINGS
 * =========================================================
 */

router.get(
  "/settings",
  getCatalogSettingsController,
);

router.put(
  "/settings",
  updateCatalogSettingsController,
);

/**
 * =========================================================
 * CHARACTERISTICS
 * =========================================================
 */

router.post(
  "/characteristics",
  createCharacteristicController,
);

router.patch(
  "/characteristics/:characteristicId",
  updateCharacteristicController,
);

router.delete(
  "/characteristics/:characteristicId",
  deleteCharacteristicController,
);

/**
 * =========================================================
 * CHARACTERISTIC VALUES
 * =========================================================
 */

router.post(
  "/characteristics/:characteristicId/values",
  createCharacteristicValueController,
);

router.patch(
  "/characteristics/:characteristicId/values/:valueId",
  updateCharacteristicValueController,
);

router.delete(
  "/characteristics/:characteristicId/values/:valueId",
  deleteCharacteristicValueController,
);

export default router;