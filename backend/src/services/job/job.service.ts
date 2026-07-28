import { Prisma, SkillImportance } from "@prisma/client";

import { prisma } from "../../config/prisma";

import ApiError from "../../utils/ApiError";

import { recruiterRepository } from "../../repositories/recruiter.repository";
import { jobRepository } from "../../repositories/job.repository";
import { skillRepository } from "../../repositories/skills.repository";

import { CreateJobDto, UpdateJobDto } from "../../dto/job.dto";

class JobService {
  /**
   * Create Job
   */
  async createJob(userId: string, data: CreateJobDto) {
    const recruiter = await recruiterRepository.findByUserId(userId);

    if (!recruiter) {
      throw new ApiError(404, "Recruiter profile not found.");
    }

    /**
     * Duplicate Job Title Check
     */
    const existingJob = await jobRepository.findByTitle(
      recruiter.id,
      data.title.trim(),
    );

    if (existingJob) {
      throw new ApiError(409, "A job with the same title already exists.");
    }

    /**
     * Salary Validation
     */
    if (data.salaryMin && data.salaryMax && data.salaryMin > data.salaryMax) {
      throw new ApiError(
        400,
        "Minimum salary cannot be greater than maximum salary.",
      );
    }

    /**
     * Normalize Skills
     */
    const normalizedSkills = data.skills.map((skill) => ({
      name: this.normalizeSkillName(skill.name),
      importance: skill.importance,
    }));

    /**
     * Everything below should either
     * completely succeed
     * or rollback.
     */
    const createdJob = await prisma.$transaction(
      async (tx) => {
        /**
         * Create Job
         */
        const job = await jobRepository.create(
          {
            title: data.title.trim(),

            description: data.description.trim(),

            salaryMin: data.salaryMin,

            salaryMax: data.salaryMax,

            employmentType: data.employmentType,

            experienceLevel: data.experienceLevel,

            location: data.location?.trim(),

            deadline: data.deadline,

            status: data.status,

            recruiter: {
              connect: {
                id: recruiter.id,
              },
            },

            company: {
              connect: {
                id: recruiter.companyId,
              },
            },
          },
          tx,
        );

        /**
         * Create / Reuse Skills
         */
        const jobSkills: {
          jobId: string;
          skillId: string;
          importance: any;
        }[] = [];

        for (const skill of normalizedSkills) {
          let existingSkill = await skillRepository.findSkillByName(skill.name);

          if (!existingSkill) {
            existingSkill = await skillRepository.createSkill(skill.name);
          }

          jobSkills.push({
            jobId: job.id,
            skillId: existingSkill.id,
            importance: skill.importance,
          });
        }

        /**
         * Create Job Skills
         */
        await skillRepository.createJobSkills(jobSkills, tx);

        return job;
      },
      {
        timeout: 20000,
      },
    );

    return await jobRepository.findByIdWithRelations(createdJob.id);
  }

  /**
   * Normalize Skill Name
   */
  private normalizeSkillName(name: string): string {
    return name
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  /**
   * Get Recruiter's Jobs
   */
  async getRecruiterJobs(userId: string) {
    const recruiter = await recruiterRepository.findByUserId(userId);

    if (!recruiter) {
      throw new ApiError(404, "Recruiter profile not found.");
    }

    return await jobRepository.findRecruiterJobs(recruiter.id);
  }

  /**
   * Get Job By Id
   */
  async getJobById(userId: string, jobId: string) {
    const recruiter = await recruiterRepository.findByUserId(userId);

    if (!recruiter) {
      throw new ApiError(404, "Recruiter profile not found.");
    }

    const job = await jobRepository.findByRecruiterAndId(recruiter.id, jobId);

    if (!job) {
      throw new ApiError(404, "Job not found.");
    }

    return job;
  }

  /**
   * Update Job
   */
  async updateJob(userId: string, jobId: string, data: UpdateJobDto) {
    const recruiter = await recruiterRepository.findByUserId(userId);

    if (!recruiter) {
      throw new ApiError(404, "Recruiter profile not found.");
    }

    const existingJob = await jobRepository.findByRecruiterAndId(
      recruiter.id,
      jobId,
    );

    if (!existingJob) {
      throw new ApiError(404, "Job not found.");
    }

    /**
     * Duplicate Title Check
     */
    if (
      data.title &&
      data.title.trim().toLowerCase() !== existingJob.title.trim().toLowerCase()
    ) {
      const duplicateJob = await jobRepository.findByTitle(
        recruiter.id,
        data.title.trim(),
      );

      if (duplicateJob && duplicateJob.id !== existingJob.id) {
        throw new ApiError(409, "A job with the same title already exists.");
      }
    }

    /**
     * Salary Validation
     */
    const salaryMin = data.salaryMin ?? existingJob.salaryMin ?? undefined;
    const salaryMax = data.salaryMax ?? existingJob.salaryMax ?? undefined;

    if (salaryMin && salaryMax && salaryMin > salaryMax) {
      throw new ApiError(
        400,
        "Minimum salary cannot be greater than maximum salary.",
      );
    }

    /**
     * Normalize Skills
     */
    const normalizedSkills = data.skills?.map((skill) => ({
      name: this.normalizeSkillName(skill.name),
      importance: skill.importance,
    }));

    const updatedJob = await prisma.$transaction(
      async (tx) => {
        /**
         * Update Job
         */
        await jobRepository.update(
          existingJob.id,
          {
            title: data.title?.trim(),
            description: data.description?.trim(),
            salaryMin: data.salaryMin,
            salaryMax: data.salaryMax,
            employmentType: data.employmentType,
            experienceLevel: data.experienceLevel,
            location: data.location?.trim(),
            deadline: data.deadline,
            status: data.status,
          },
          tx,
        );

        /**
         * Update Skills
         */
        if (normalizedSkills) {
          await jobRepository.deleteJobSkills(existingJob.id, tx);

          const jobSkills: {
            jobId: string;
            skillId: string;
            importance: any;
          }[] = [];

          for (const skill of normalizedSkills) {
            let existingSkill = await skillRepository.findSkillByName(
              skill.name,
              tx,
            );

            if (!existingSkill) {
              existingSkill = await skillRepository.createSkill(
                skill.name,
                undefined,
                tx,
              );
            }

            jobSkills.push({
              jobId: existingJob.id,
              skillId: existingSkill.id,
              importance: skill.importance,
            });
          }

          await skillRepository.createJobSkills(jobSkills, tx);
        }

        return existingJob;
      },
      {
        timeout: 20000,
      },
    );

    return await jobRepository.findByIdWithRelations(updatedJob.id);
  }

  /**
   * Delete Job
   */
  async deleteJob(userId: string, jobId: string) {
    const recruiter = await recruiterRepository.findByUserId(userId);

    if (!recruiter) {
      throw new ApiError(404, "Recruiter profile not found.");
    }

    const job = await jobRepository.findByRecruiterAndId(recruiter.id, jobId);

    if (!job) {
      throw new ApiError(404, "Job not found.");
    }

    await jobRepository.delete(job.id);

    return null;
  }
}

export const jobService = new JobService();
