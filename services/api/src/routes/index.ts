import { Router } from "express";
import authRoutes from "../features/auth/auth.routes.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    service: "t.fundi-api",
    status: "ok",
  });
});

router.use("/auth", authRoutes);

export { router };