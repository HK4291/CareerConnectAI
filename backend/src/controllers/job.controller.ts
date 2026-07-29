import { Request, Response, NextFunction } from "express";
import { Prisma, EmploymentType, ExperienceLevel } from "@prisma/client";

import sendResponse from "../utils/sendResponse";
import asyncHandler from "../middlewares/asyncHandler";
import ApiError from "../utils/ApiError";
import { jobService } from "../services/job/job.service";
import { StatusCodes } from "http-status-codes";
import { CreateJobDto, UpdateJobDto, JobSearchDto } from "../dto/job.dto";
import { savedJobService } from "../services/job/saved-job.service";

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

  /**
   * Search Jobs
   */
  searchJobs = asyncHandler(async (req: Request, res: Response) => {
    const filters: JobSearchDto = {
      search: req.query.search as string,
      location: req.query.location as string,
      employmentType: req.query.employmentType as EmploymentType,
      experienceLevel: req.query.experienceLevel as ExperienceLevel,
      salaryMin: req.query.salaryMin ? Number(req.query.salaryMin) : undefined,
      salaryMax: req.query.salaryMax ? Number(req.query.salaryMax) : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      sort: req.query.sort as JobSearchDto["sort"],
    };

    const result = await jobService.searchJobs(filters);

    return sendResponse(res, {
      statusCode: 200,
      message: "Jobs fetched successfully.",
      data: result,
    });
  });

  /**
   * Save Job
   */
  saveJob = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const jobId = Array.isArray(req.params.jobId)
      ? req.params.jobId[0]
      : req.params.jobId;

    const savedJob = await savedJobService.saveJob(userId, jobId);

    return sendResponse(res, {
      statusCode: 201,
      message: "Job saved successfully.",
      data: savedJob,
    });
  });

  /**
   * Get Saved Jobs
   */
  getSavedJobs = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const page = req.query.page ? Number(req.query.page) : 1;

    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const result = await savedJobService.getSavedJobs(userId, page, limit);

    return sendResponse(res, {
      statusCode: 200,
      message: "Saved jobs fetched successfully.",
      data: result,
    });
  });

  /**
   * Unsave Job
   */
  unsaveJob = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const jobId = Array.isArray(req.params.jobId)
      ? req.params.jobId[0]
      : req.params.jobId;

    await savedJobService.unsaveJob(userId, jobId);

    return sendResponse(res, {
      statusCode: 200,
      message: "Job removed from saved jobs successfully.",
      data: null,
    });
  });
}

export default new JobController();
