import type { NextFunction, Request, Response } from "express";

/**
 * A thrown ApiError becomes a clean JSON response with the given status.
 * Anything else that escapes a handler becomes a generic 500.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Wrap an async handler so rejected promises reach the error middleware. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

/** Terminal error middleware. Keep this LAST in the chain. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    res.status(err.status).json({ ok: false, error: err.message });
    return;
  }
  console.error("[api] unhandled error:", err);
  res.status(500).json({ ok: false, error: "Internal server error." });
}
