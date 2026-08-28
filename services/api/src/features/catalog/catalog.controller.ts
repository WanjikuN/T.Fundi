import type { Request, Response } from "express";

import type { TenantRequest } from "../tenant/tenant.middleware.js";

import {
  createCharacteristic,
  createCharacteristicValue,
  deleteCharacteristic,
  deleteCharacteristicValue,
  getCatalogSettings,
  updateCatalogSettings,
  updateCharacteristic,
  updateCharacteristicValue,
} from "./catalog.service.js";

function getTenantId(req: Request): string | null {
  const tenantRequest = req as TenantRequest;

  return tenantRequest.tenant?.id ?? null;
}

function getParam(req: Request, name: string): string | null {
  const value = req.params[name];

  if (typeof value !== "string" || value.length === 0) {
    return null;
  }

  return value;
}

/**
 * =========================================================
 * GET /catalog/settings
 * =========================================================
 */

export async function getCatalogSettingsController(
  req: Request,
  res: Response,
) {
  try {
    const tenantId = getTenantId(req);

    if (!tenantId) {
      return res.status(400).json({
        message: "Tenant could not be resolved",
      });
    }

    const settings = await getCatalogSettings(tenantId);

    return res.status(200).json({
      settings,
    });
  } catch (error) {
    console.error("Failed to get catalog settings:", error);

    return res.status(500).json({
      message: "Unable to get catalog settings",
    });
  }
}

/**
 * =========================================================
 * PUT /catalog/settings
 * =========================================================
 */

export async function updateCatalogSettingsController(
  req: Request,
  res: Response,
) {
  try {
    const tenantId = getTenantId(req);

    if (!tenantId) {
      return res.status(400).json({
        message: "Tenant could not be resolved",
      });
    }

    const settings = await updateCatalogSettings(tenantId, req.body);

    return res.status(200).json({
      settings,
    });
  } catch (error) {
    console.error("Failed to update catalog settings:", error);

    return res.status(500).json({
      message: "Unable to update catalog settings",
    });
  }
}

/**
 * =========================================================
 * POST /catalog/characteristics
 * =========================================================
 */

export async function createCharacteristicController(
  req: Request,
  res: Response,
) {
  try {
    const tenantId = getTenantId(req);

    if (!tenantId) {
      return res.status(400).json({
        message: "Tenant could not be resolved",
      });
    }

    const characteristic = await createCharacteristic(tenantId, req.body);

    return res.status(201).json({
      characteristic,
    });
  } catch (error) {
    console.error("Failed to create characteristic:", error);

    return res.status(500).json({
      message: "Unable to create characteristic",
    });
  }
}

/**
 * =========================================================
 * PATCH /catalog/characteristics/:characteristicId
 * =========================================================
 */

export async function updateCharacteristicController(
  req: Request,
  res: Response,
) {
  try {
    const tenantId = getTenantId(req);

    const characteristicId = getParam(req, "characteristicId");

    if (!tenantId) {
      return res.status(400).json({
        message: "Tenant could not be resolved",
      });
    }

    if (!characteristicId) {
      return res.status(400).json({
        message: "Characteristic ID is required",
      });
    }

    const characteristic = await updateCharacteristic(
      tenantId,
      characteristicId,
      req.body,
    );

    if (!characteristic) {
      return res.status(404).json({
        message: "Characteristic not found",
      });
    }

    return res.status(200).json({
      characteristic,
    });
  } catch (error) {
    console.error("Failed to update characteristic:", error);

    return res.status(500).json({
      message: "Unable to update characteristic",
    });
  }
}

/**
 * =========================================================
 * DELETE /catalog/characteristics/:characteristicId
 * =========================================================
 */

export async function deleteCharacteristicController(
  req: Request,
  res: Response,
) {
  try {
    const tenantId = getTenantId(req);

    const characteristicId = getParam(req, "characteristicId");

    if (!tenantId) {
      return res.status(400).json({
        message: "Tenant could not be resolved",
      });
    }

    if (!characteristicId) {
      return res.status(400).json({
        message: "Characteristic ID is required",
      });
    }

    const deleted = await deleteCharacteristic(tenantId, characteristicId);

    if (!deleted) {
      return res.status(404).json({
        message: "Characteristic not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Failed to delete characteristic:", error);

    return res.status(500).json({
      message: "Unable to delete characteristic",
    });
  }
}

/**
 * =========================================================
 * POST /catalog/characteristics/:characteristicId/values
 * =========================================================
 */

export async function createCharacteristicValueController(
  req: Request,
  res: Response,
) {
  try {
    const tenantId = getTenantId(req);

    const characteristicId = getParam(req, "characteristicId");

    if (!tenantId) {
      return res.status(400).json({
        message: "Tenant could not be resolved",
      });
    }

    if (!characteristicId) {
      return res.status(400).json({
        message: "Characteristic ID is required",
      });
    }

    const value = await createCharacteristicValue(
      tenantId,
      characteristicId,
      req.body,
    );

    if (!value) {
      return res.status(404).json({
        message: "Characteristic not found",
      });
    }

    return res.status(201).json({
      value,
    });
  } catch (error) {
    console.error("Failed to create characteristic value:", error);

    return res.status(500).json({
      message: "Unable to create characteristic value",
    });
  }
}

/**
 * =========================================================
 * PATCH /catalog/characteristics/:characteristicId/values/:valueId
 * =========================================================
 */

export async function updateCharacteristicValueController(
  req: Request,
  res: Response,
) {
  try {
    const tenantId = getTenantId(req);

    const characteristicId = getParam(req, "characteristicId");

    const valueId = getParam(req, "valueId");

    if (!tenantId) {
      return res.status(400).json({
        message: "Tenant could not be resolved",
      });
    }

    if (!characteristicId || !valueId) {
      return res.status(400).json({
        message: "Characteristic ID and value ID are required",
      });
    }

    const value = await updateCharacteristicValue(
      tenantId,
      characteristicId,
      valueId,
      req.body,
    );

    if (!value) {
      return res.status(404).json({
        message: "Characteristic value not found",
      });
    }

    return res.status(200).json({
      value,
    });
  } catch (error) {
    console.error("Failed to update characteristic value:", error);

    return res.status(500).json({
      message: "Unable to update characteristic value",
    });
  }
}

/**
 * =========================================================
 * DELETE /catalog/characteristics/:characteristicId/values/:valueId
 * =========================================================
 */

export async function deleteCharacteristicValueController(
  req: Request,
  res: Response,
) {
  try {
    const tenantId = getTenantId(req);

    const characteristicId = getParam(req, "characteristicId");

    const valueId = getParam(req, "valueId");

    if (!tenantId) {
      return res.status(400).json({
        message: "Tenant could not be resolved",
      });
    }

    if (!characteristicId || !valueId) {
      return res.status(400).json({
        message: "Characteristic ID and value ID are required",
      });
    }

    const deleted = await deleteCharacteristicValue(
      tenantId,
      characteristicId,
      valueId,
    );

    if (!deleted) {
      return res.status(404).json({
        message: "Characteristic value not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Failed to delete characteristic value:", error);

    return res.status(500).json({
      message: "Unable to delete characteristic value",
    });
  }
}
