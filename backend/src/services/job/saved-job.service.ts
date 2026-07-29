import { JobStatus } from "@prisma/client";

import ApiError from "../../utils/ApiError";

import { candidateRepository } from "../../repositories/candidate.repositoy";
import { jobRepository } from "../../repositories/job.repository";
import { savedJobRepository } from "../../repositories/saved-job.repository";

class SavedJobService {
  /**
   * Save Job
   */
  async saveJob(userId: string, jobId: string) {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const job = await jobRepository.findById(jobId);

    if (!job) {
      throw new ApiError(404, "Job not found.");
    }

    if (job.status !== JobStatus.OPEN) {
      throw new ApiError(400, "Only open jobs can be saved.");
    }

    const alreadySaved = await savedJobRepository.findByCandidateAndJob(
      candidate.id,
      jobId,
    );

    if (alreadySaved) {
      throw new ApiError(409, "Job already saved.");
    }

    return savedJobRepository.create(candidate.id, jobId);
  }

  /**
   * Get Saved Jobs
   */
  async getSavedJobs(userId: string, page = 1, limit = 10) {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const [jobs, total] = await Promise.all([
      savedJobRepository.findSavedJobs(candidate.id, page, limit),
      savedJobRepository.countSavedJobs(candidate.id),
    ]);

    return {
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Unsave Job
   */
  async unsaveJob(userId: string, jobId: string) {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const savedJob = await savedJobRepository.findByCandidateAndJob(
      candidate.id,
      jobId,
    );

    if (!savedJob) {
      throw new ApiError(404, "Saved job not found.");
    }

    await savedJobRepository.delete(savedJob.id);

    return null;
  }
}

export const savedJobService = new SavedJobService();
