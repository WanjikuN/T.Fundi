import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { router } from "./routes/index.js";
import { openapi } from "./docs/openapi.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

app.get("/docs/openapi.json", (_req, res) => {
  res.json(openapi);
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "t.fundi-api",
  });
});

app.use("/api", router);

export { app };