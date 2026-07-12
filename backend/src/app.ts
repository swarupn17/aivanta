import express from "express";
import cors from "cors";
import { corsOrigins } from "./env";
import { errorHandler, ApiError } from "./lib/http";
import { healthRouter } from "./routes/health";
import { contactRouter } from "./routes/contact";
import { registrationRouter } from "./routes/registration";
import { studentsRouter } from "./routes/students";
import { meRouter } from "./routes/me";

/**
 * Builds the Express app. Auth rides in the Authorization header (Bearer JWT),
 * NOT cookies, so we don't need `credentials: true` — just allow the origins.
 */
export function createApp() {
  const app = express();

  const allowAny = corsOrigins.includes("*");
  app.use(
    cors({
      origin: allowAny ? true : corsOrigins,
      methods: ["GET", "POST", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // CSV rows arrive as JSON; give a little headroom for big rosters.
  app.use(express.json({ limit: "2mb" }));

  // Public
  app.use("/api", healthRouter);
  app.use("/api", contactRouter);
  app.use("/api", registrationRouter);

  // Authenticated (RLS-enforced)
  app.use("/api", meRouter);
  app.use("/api", studentsRouter);

  // Unknown route -> clean 404 JSON.
  app.use((_req, _res, next) => next(new ApiError(404, "Not found.")));

  app.use(errorHandler);
  return app;
}
