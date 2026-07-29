import { Application, ApplicationStatus, Prisma } from "@prisma/client";

import { prisma } from "../config/prisma";

class ApplicationRepository {
  async create(data: Prisma.ApplicationCreateInput): Promise<Application> {
    return prisma.application.create({
      data,
    });
  }

  async findById(id: string): Promise<Application | null> {
    return prisma.application.findUnique({
      where: { id },
    });
  }

  async findByJobAndCandidate(
    jobId: string,
    candidateId: string,
  ): Promise<Application | null> {
    return prisma.application.findUnique({
      where: {
        jobId_candidateId: {
          jobId,
          candidateId,
        },
      },
    });
  }

  async findManyByCandidate(candidateId: string) {
    return prisma.application.findMany({
      where: { candidateId },
      include: {
        job: true,
      },
      orderBy: {
        appliedAt: "desc",
      },
    });
  }

  async findManyByJob(jobId: string) {
    return prisma.application.findMany({
      where: { jobId },
      include: {
        candidate: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });
  }

  async updateStatus(
    id: string,
    status: ApplicationStatus,
  ): Promise<Application> {
    return prisma.application.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string): Promise<Application> {
    return prisma.application.delete({
      where: { id },
    });
  }
}

export default new ApplicationRepository();
