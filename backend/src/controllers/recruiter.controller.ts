import { Request, Response } from "express";

import { recruiterService } from "../services/recruiter/recruiter.service";
import asyncHandler from "../middlewares/asyncHandler";
import successResponse from "../utils/sendResponse";
import ApiError from "../utils/ApiError";

class RecruiterController {
  /**
   * Get Recruiter Profile
   */
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    const recruiter = await recruiterService.getProfile(req.user.id);

    return successResponse(res, {
      statusCode: 200,
      message: "Recruiter fetched successfully",
      data: recruiter,
    });
  });

  /**
   * Update Recruiter Profile
   */
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const recruiter = await recruiterService.updateProfile(
      req.user.id,
      req.body,
    );

    return successResponse(res, {
      statusCode: 200,
      message: "Recruiter profile updated successfully",
      data: recruiter,
    });
  });
}

export const recruiterController = new RecruiterController();
