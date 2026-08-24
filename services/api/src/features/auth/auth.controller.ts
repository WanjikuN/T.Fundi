import type { Request, Response } from "express";

import { registerSchema, loginSchema } from "./auth.schemas.js";

import { registerUser, loginUser } from "./auth.service.js";

import { createAccessToken } from "./token.js";
import { refreshTokenSchema } from "./auth.schemas.js";
import {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  isRefreshTokenValid,
} from "./refresh-token.js";
import type { AuthenticatedRequest } from "./auth.middleware.js";
export async function register(req: Request, res: Response) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid registration data",
      errors: result.error.flatten(),
    });
  }

  try {
    const user = await registerUser(result.data);

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "A user with this email already exists"
    ) {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Unable to register user",
    });
  }
}

export async function login(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid login data",
      errors: result.error.flatten(),
    });
  }

  try {
    const user = await loginUser(result.data);

    const accessToken = createAccessToken(user.id);

    const refreshToken = await createRefreshToken(user.id);

    return res.status(200).json({
      message: "Login successful",

      accessToken,

      refreshToken: refreshToken.token,

      expiresIn: {
        accessToken: "15m",
        refreshToken: "7d",
      },

      user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Unable to login",
    });
  }
}
export async function refresh(req: Request, res: Response) {
  const result = refreshTokenSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid refresh token data",
      errors: result.error.flatten(),
    });
  }

  try {
    const { refreshToken } = result.data;

    const storedToken = await findRefreshToken(refreshToken);

    if (!storedToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    if (!isRefreshTokenValid(storedToken)) {
      return res.status(401).json({
        message: "Refresh token has expired or been revoked",
      });
    }

    // Revoke the token that was just used.
    await revokeRefreshToken(storedToken.id);

    // Create a new refresh token.
    const newRefreshToken = await createRefreshToken(storedToken.userId);

    // Create a new short-lived access token.
    const accessToken = createAccessToken(storedToken.userId);

    return res.status(200).json({
      message: "Token refreshed successfully",
      accessToken,
      refreshToken: newRefreshToken.token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to refresh token",
    });
  }
}
export async function me(
  req: Request,
  res: Response,
) {
  const user = (req as AuthenticatedRequest).user;

  return res.status(200).json({
    user,
  });
}