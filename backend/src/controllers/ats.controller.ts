import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { APIError } from "openai";
import { atsService } from "../services/ats/ats.service";
import ApiError from "../utils/ApiError";

class AtsController {
  /**
   * Analyze Saved Resume
   * POST /api/v1/ats/analyze/:resumeId
   */
  async analyzeResume(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.id;

      const resumeIdParam = req.params.resumeId;

      const resumeId = Array.isArray(resumeIdParam)
        ? resumeIdParam[0]
        : resumeIdParam;

      const result = await atsService.analyzeResume(userId, resumeId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Resume analyzed successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Quick ATS Analysis
   * POST /api/v1/ats/analyze
   */
  async quickAnalyzeResume(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.id;

      if (!req.file) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Resume file is required.");
      }

      const result = await atsService.quickAnalyzeResume(userId, req.file);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Resume analyzed successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const atsController = new AtsController();
