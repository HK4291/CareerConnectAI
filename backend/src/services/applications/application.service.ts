import httpStatus from "http-status-codes";

import ApiError from "../../utils/ApiError";

import applicationMapper from "../../mappers/application.mapper";

import applicationRepository from "../../repositories/application.repository";
import { candidateRepository } from "../../repositories/candidate.repositoy";
import { jobRepository } from "../../repositories/job.repository";
import { resumeRepository } from "../../repositories/resume.repository";
import { Role } from "@prisma/client";
import logger from "../../utils/logger";

class ApplicationService {
  async applyJob(
    userId: string,
    role: Role,
    jobId: string,
    coverLetter?: string,
  ) {
    if (role !== Role.CANDIDATE) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Only candidates can apply for jobs",
      );
    }
    // Candidate
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(httpStatus.NOT_FOUND, "Candidate profile not found");
    }

    const resume = await resumeRepository.findActiveResume(candidate.id);
    const resumeId = resume?.id;

    if (!resume) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Please upload a resume before applying.",
      );
    }

    // Job
    const job = await jobRepository.findById(jobId);

    if (!job) {
      throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
    }

    // Job Status
    if (job.status !== "OPEN") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Job is not accepting applications",
      );
    }

    // Deadline
    if (job.deadline && job.deadline < new Date()) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Application deadline has passed",
      );
    }

    // Already Applied
    const existingApplication =
      await applicationRepository.findByJobAndCandidate(job.id, candidate.id);

    if (existingApplication) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "You have already applied for this job",
      );
    }

    // Resume Validation
    if (resume.id) {
      const resume = await resumeRepository.findById(resumeId as string);

      if (!resume) {
        throw new ApiError(httpStatus.NOT_FOUND, "Resume not found");
      }

      if (resume.candidateId !== candidate.id) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "You can only use your own resume",
        );
      }
    }

    // Create Application
    const application = await applicationRepository.create({
      job: {
        connect: {
          id: job.id,
        },
      },
      candidate: {
        connect: {
          id: candidate.id,
        },
      },
      resumeVersion: resumeId,
      coverLetter,
    });

    return applicationMapper.toResponse(application);
  }
}

export default new ApplicationService();
