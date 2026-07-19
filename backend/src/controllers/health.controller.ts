import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import sendResponse from "../utils/sendResponse";
import healthService from "../services/health.service";

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  const data = healthService.getHealth();

  return sendResponse(res, {
    statusCode: 200,
    message: "Health check successful",
    data,
  });
});
