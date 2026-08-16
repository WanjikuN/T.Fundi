import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    service: "t.fundi-api",
    status: "ok"
  });
});

export { router };
