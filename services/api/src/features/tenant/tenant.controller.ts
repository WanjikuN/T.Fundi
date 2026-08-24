import type { Request, Response } from "express";

import type { TenantRequest } from "./tenant.middleware.js";

export function getCurrentTenant(
  req: Request,
  res: Response,
) {
  const tenantRequest = req as TenantRequest;

  return res.status(200).json({
    tenant: tenantRequest.tenant,
    membership: tenantRequest.membership,
  });
}