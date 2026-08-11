import express from "express";
import { router } from "./routes/index.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "t.fundi-api"
  });
});

app.use("/api", router);

export { app };
