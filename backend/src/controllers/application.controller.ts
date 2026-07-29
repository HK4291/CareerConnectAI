import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

import applicationService from "../services/applications/application.service";
import ApiError from "../utils/ApiError";

class ApplicationController {
  async applyJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { jobId } = req.params;
      const { coverLetter } = req.body;

      if (!req.user) {
        throw new ApiError(401, "Please Login before access");
      }

      const application = await applicationService.applyJob(
        req.user.id,
        req.user.role,
        jobId as string,
        coverLetter,
      );

      res.status(httpStatus.CREATED).json({
        success: true,
        message: "Application submitted successfully",
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ApplicationController();
