import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

import { jobService } from "../services/job/job.service";
import sendResponse from "../utils/sendResponse";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { CreateJobDto, UpdateJobDto } from "../dto/job.dto";
import asyncHandler from "../middlewares/asyncHandler";

class JobController {
  async createJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body as CreateJobDto;

      if (!req.user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Resume file is required.");
      }

      const job = await jobService.createJob(req.user.id, data);

      sendResponse(res, {
        statusCode: 201,
        message: "Job created successfully",
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Recruiter's Jobs
   */
  getRecruiterJobs = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const jobs = await jobService.getRecruiterJobs(userId);

    return sendResponse(res, {
      statusCode: 200,
      message: "Jobs fetched successfully.",
      data: jobs,
    });
  });

  /**
   * Get Job By Id
   */
  getJobById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const jobId = Array.isArray(req.params.jobId)
      ? req.params.jobId[0]
      : req.params.jobId;

    const job = await jobService.getJobById(userId, jobId);

    return sendResponse(res, {
      statusCode: 200,
      message: "Job fetched successfully.",
      data: job,
    });
  });

  /**
   * Update Job
   */
  updateJob = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const jobId = Array.isArray(req.params.jobId)
      ? req.params.jobId[0]
      : req.params.jobId;

    const data = req.body as UpdateJobDto;

    const job = await jobService.updateJob(userId, jobId, data);

    return sendResponse(res, {
      statusCode: 200,
      message: "Job updated successfully.",
      data: job,
    });
  });

  /**
   * Delete Job
   */
  deleteJob = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const jobId = Array.isArray(req.params.jobId)
      ? req.params.jobId[0]
      : req.params.jobId;

    await jobService.deleteJob(userId, jobId);

    return sendResponse(res, {
      statusCode: 200,
      message: "Job deleted successfully.",
      data: null,
    });
  });
}

export default new JobController();
