import crypto from "crypto";
import { prisma } from "../../config/prisma.js";

const REFRESH_TOKEN_DAYS = 7;

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

export async function createRefreshToken(userId: string) {
  const token = generateToken();

  const tokenHash = hashToken(token);

  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
  );

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  return {
    token,
    expiresAt,
  };
}

export async function findRefreshToken(token: string) {
  const tokenHash = hashToken(token);

  return prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
  });
}

export async function revokeRefreshToken(tokenId: string) {
  return prisma.refreshToken.update({
    where: {
      id: tokenId,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export function isRefreshTokenValid(refreshToken: {
  expiresAt: Date;
  revokedAt: Date | null;
}): boolean {
  if (refreshToken.revokedAt) {
    return false;
  }

  if (refreshToken.expiresAt <= new Date()) {
    return false;
  }

  return true;
}