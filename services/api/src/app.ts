import express from "express";
import swaggerUi from "swagger-ui-express";

import { router } from "./routes/index.js";
import { openapi } from "./docs/openapi.js";

const app = express();

app.use((req, _res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

app.get("/docs/openapi.json", (_req, res) => {
  res.json(openapi);
});

app.get("/health", (_req, res) => {
  console.log("HEALTH ROUTE HIT");

  res.status(200).json({
    status: "ok",
    service: "t.fundi-api",
  });
});

app.use("/api", router);

export { app };