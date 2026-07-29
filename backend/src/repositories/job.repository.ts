import { Job, Prisma, JobStatus } from "@prisma/client";

import { prisma } from "../config/prisma";
import { JobSearchDto } from "../dto/job.dto";

type PrismaExecutor = Prisma.TransactionClient | typeof prisma;

class JobRepository {
  /**
   * Create Job
   */
  async create(
    data: Prisma.JobCreateInput,
    tx: PrismaExecutor = prisma,
  ): Promise<Job> {
    return tx.job.create({
      data,
    });
  }

  /**
   * Find Job By Id
   */
  async findById(id: string): Promise<Job | null> {
    return prisma.job.findUnique({
      where: {
        id,
      },
      include: {
        company: true,
        recruiter: {
          include: {
            user: true,
          },
        },
        jobSkills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }

  /**
   * Find Recruiter's Job
   */
  async findByRecruiterAndId(
    recruiterId: string,
    jobId: string,
  ): Promise<Job | null> {
    return prisma.job.findFirst({
      where: {
        id: jobId,
        recruiterId,
      },
      include: {
        company: true,
        recruiter: {
          include: {
            user: true,
          },
        },
        jobSkills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }
  /**
   * Get Recruiter's Jobs
   */
  async findRecruiterJobs(recruiterId: string): Promise<Job[]> {
    return prisma.job.findMany({
      where: {
        recruiterId,
      },
      include: {
        jobSkills: {
          include: {
            skill: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Update Job
   */
  async update(
    id: string,
    data: Prisma.JobUpdateInput,
    tx: PrismaExecutor = prisma,
  ): Promise<Job> {
    return tx.job.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   * Delete Job
   */
  async delete(id: string, tx: PrismaExecutor = prisma): Promise<Job> {
    return tx.job.delete({
      where: {
        id,
      },
    });
  }

  /**
   * Delete Job Skills
   */
  async deleteJobSkills(jobId: string, tx: PrismaExecutor = prisma) {
    return tx.jobSkill.deleteMany({
      where: {
        jobId,
      },
    });
  }

  async findByTitle(recruiterId: string, title: string): Promise<Job | null> {
    return prisma.job.findFirst({
      where: {
        recruiterId,
        title: {
          equals: title,
          mode: "insensitive",
        },
        status: {
          not: "CLOSED",
        },
      },
    });
  }

  async findByIdWithRelations(id: string) {
    return prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        recruiter: {
          include: {
            user: true,
          },
        },
        jobSkills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }

  /**
   * Search Jobs
   */
  async searchJobs(filters: JobSearchDto) {
    const {
      search,
      location,
      employmentType,
      experienceLevel,
      salaryMin,
      salaryMax,
      page = 1,
      limit = 10,
      sort = "newest",
    } = filters;

    const where: Prisma.JobWhereInput = {
      status: JobStatus.OPEN,
    };

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    if (employmentType) {
      where.employmentType = employmentType;
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    if (salaryMin || salaryMax) {
      where.AND = [];

      if (salaryMin) {
        where.AND.push({
          salaryMax: {
            gte: salaryMin,
          },
        });
      }

      if (salaryMax) {
        where.AND.push({
          salaryMin: {
            lte: salaryMax,
          },
        });
      }
    }

    let orderBy: Prisma.JobOrderByWithRelationInput = {
      createdAt: "desc",
    };

    switch (sort) {
      case "oldest":
        orderBy = {
          createdAt: "asc",
        };
        break;

      case "salaryAsc":
        orderBy = {
          salaryMin: "asc",
        };
        break;

      case "salaryDesc":
        orderBy = {
          salaryMax: "desc",
        };
        break;
    }

    return prisma.job.findMany({
      where,

      include: {
        company: true,

        jobSkills: {
          include: {
            skill: true,
          },
        },
      },

      orderBy,

      skip: (page - 1) * limit,

      take: limit,
    });
  }

  /**
   * Count Search Jobs
   */
  async countSearchJobs(filters: JobSearchDto) {
    const {
      search,
      location,
      employmentType,
      experienceLevel,
      salaryMin,
      salaryMax,
    } = filters;

    const where: Prisma.JobWhereInput = {
      status: JobStatus.OPEN,
    };

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    if (employmentType) {
      where.employmentType = employmentType;
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    if (salaryMin || salaryMax) {
      where.AND = [];

      if (salaryMin) {
        where.AND.push({
          salaryMax: {
            gte: salaryMin,
          },
        });
      }

      if (salaryMax) {
        where.AND.push({
          salaryMin: {
            lte: salaryMax,
          },
        });
      }
    }

    return prisma.job.count({
      where,
    });
  }
}

export const jobRepository = new JobRepository();
