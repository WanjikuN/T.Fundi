import type { NextFunction, Request, Response } from "express";

import { prisma } from "../../config/prisma.js";
import type { AuthenticatedRequest } from "../auth/auth.middleware.js";

export type TenantRequest = AuthenticatedRequest & {
  tenant: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
  membership: {
    id: string;
    roleId: string;
    roleName: string;
  };
};

export async function resolveTenant(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authenticatedRequest = req as AuthenticatedRequest;

  if (!authenticatedRequest.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const tenantSlug = req.headers["x-tenant-slug"];

  if (!tenantSlug || Array.isArray(tenantSlug)) {
    return res.status(400).json({
      message: "X-Tenant-Slug header is required",
    });
  }

  try {
    const membership = await prisma.tenantMembership.findFirst({
      where: {
        userId: authenticatedRequest.user.id,
        tenant: {
          slug: tenantSlug,
        },
      },
      select: {
        id: true,
        roleId: true,
        role: {
          select: {
            name: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
          },
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        message: "You do not have access to this tenant",
      });
    }

    if (membership.tenant.status !== "ACTIVE") {
      return res.status(403).json({
        message: "Tenant is not active",
      });
    }

    const tenantRequest = req as TenantRequest;

    tenantRequest.tenant = membership.tenant;

    tenantRequest.membership = {
      id: membership.id,
      roleId: membership.roleId,
      roleName: membership.role.name,
    };

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to resolve tenant",
    });
  }
}