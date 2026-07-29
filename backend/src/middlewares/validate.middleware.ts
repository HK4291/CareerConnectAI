import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

import ApiError from "../utils/ApiError";

type ValidationTarget = "body" | "query" | "params";

export const validate =
  <T>(schema: ZodSchema<T>, target: ValidationTarget = "body") =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req[target]);

      if (target === "body") {
        req.body = parsed;
      } else {
        Object.assign(req[target], parsed);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ApiError(
            400,
            "Validation failed",
            true,
            error.flatten().fieldErrors,
          ),
        );
      }

      next(error);
    }
  };
