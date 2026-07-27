import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

import jobService from "../services/job/job.service";
import sendResponse from "../utils/sendResponse";

class JobController {
  async createJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body as Prisma.JobCreateInput;

      const job = await jobService.createJob(data);

      sendResponse(res, {
        statusCode: 201,
        message: "Job created successfully",
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new JobController();
