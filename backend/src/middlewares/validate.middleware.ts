import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";

import ApiError from "../utils/ApiError";

export const validate =
  <T>(schema: ZodSchema<T>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const apiError = new ApiError(
          400,
          "Validation failed",
          true,
          error.flatten().fieldErrors,
        );
        return next(apiError);
      }

      next(error);
    }
  };
