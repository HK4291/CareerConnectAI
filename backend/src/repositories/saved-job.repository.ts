import { Prisma } from "@prisma/client";

import { prisma } from "../config/prisma";

type PrismaExecutor = Prisma.TransactionClient | typeof prisma;

class SavedJobRepository {
  /**
   * Save Job
   */
  async create(
    candidateId: string,
    jobId: string,
    tx: PrismaExecutor = prisma,
  ) {
    return tx.savedJob.create({
      data: {
        candidateId,
        jobId,
      },
    });
  }

  /**
   * Find Saved Job
   */
  async findByCandidateAndJob(candidateId: string, jobId: string) {
    return prisma.savedJob.findUnique({
      where: {
        candidateId_jobId: {
          candidateId,
          jobId,
        },
      },
    });
  }

  /**
   * Get Saved Jobs
   */
  async findSavedJobs(candidateId: string, page: number, limit: number) {
    return prisma.savedJob.findMany({
      where: {
        candidateId,
      },

      include: {
        job: {
          include: {
            company: true,

            recruiter: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },

            jobSkills: {
              include: {
                skill: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      skip: (page - 1) * limit,

      take: limit,
    });
  }

  /**
   * Count Saved Jobs
   */
  async countSavedJobs(candidateId: string) {
    return prisma.savedJob.count({
      where: {
        candidateId,
      },
    });
  }

  /**
   * Delete Saved Job
   */
  async delete(id: string, tx: PrismaExecutor = prisma) {
    return tx.savedJob.delete({
      where: {
        id,
      },
    });
  }
}

export const savedJobRepository = new SavedJobRepository();
