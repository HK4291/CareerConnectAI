import { Request, Response, NextFunction } from "express";

import { resumeService } from "../services/resume/resume.service";

import asyncHandler from "../middlewares/asyncHandler";
import ApiResponse from "../utils/sendResponse";
import sendResponse from "../utils/sendResponse";
import { resumeImportService } from "../services/resume/resume-import.service";
import { ImportResumeDto } from "../dto/import-resume.dto";
import { resumeVersionService } from "../services/resume/resume-version.service";

class ResumeController {
  /**
   * Upload Resume
   */
  uploadResume = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const resume = await resumeService.uploadResume(
      userId,
      req.file as Express.Multer.File,
    );

    return sendResponse(res, {
      statusCode: 201,
      message: "Resume uploaded successfully.",
      data: resume,
    });
  });

  /**
   * Get All Resumes
   */
  getResumes = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const resumes = await resumeService.getResumes(userId);

    return sendResponse(res, {
      statusCode: 201,
      message: "Resumes fetched successfully.",
      data: resumes,
    });
  });

  /**
   * Get Active Resume
   */
  getActiveResume = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const resume = await resumeService.getActiveResume(userId);

    return sendResponse(res, {
      statusCode: 201,
      message: "Active resume fetched successfully.",
      data: resume,
    });
  });

  /**
   * Delete Resume
   */
  deleteResume = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const resumeId = Array.isArray(req.params.resumeId)
      ? req.params.resumeId[0]
      : req.params.resumeId;

    await resumeService.deleteResume(userId, resumeId);

    return sendResponse(res, {
      statusCode: 201,
      message: "Resume deleted successfully.",
      data: null,
    });
  });

  /**
   * Import Resume Data
   */
  async importResume(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const resumeId = Array.isArray(req.params.resumeId)
        ? req.params.resumeId[0]
        : req.params.resumeId;

      const options = req.body as ImportResumeDto;

      const result = await resumeImportService.importResume(
        userId,
        resumeId,
        options,
      );

      return res.status(200).json({
        success: true,
        message: "Resume imported successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Get Resume Versions
   */
  async getResumeVersions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const resumeId = Array.isArray(req.params.resumeId)
        ? req.params.resumeId[0]
        : req.params.resumeId;

      const versions = await resumeVersionService.getResumeVersions(
        userId,
        resumeId,
      );

      return res.status(200).json({
        success: true,
        message: "Resume versions fetched successfully.",
        data: versions,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const resumeController = new ResumeController();
