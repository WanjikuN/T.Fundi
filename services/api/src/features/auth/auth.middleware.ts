import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { prisma } from "../../config/prisma.js";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
}

type AccessTokenPayload = {
  sub: string;
  type: "access";
};

export type AuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: string;
    platformRole: string | null;
  };
};

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization header",
    });
  }

  try {
    const payload = jwt.verify(
      token,
      getJwtSecret(),
    ) as AccessTokenPayload;

    if (payload.type !== "access" || !payload.sub) {
      return res.status(401).json({
        message: "Invalid access token",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        platformRole: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message: "User account is not active",
      });
    }

    (req as AuthenticatedRequest).user = user;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
}