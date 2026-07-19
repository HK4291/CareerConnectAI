import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import { env } from "../config/env";
import logger from "../utils/logger";

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: Record<string, string[] | undefined> | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  logger.error(
    {
      method: req.method,
      url: req.originalUrl,
      error: err.message,
      stack: err.stack,
    },
    "Unhandled error",
  );

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default errorMiddleware;
