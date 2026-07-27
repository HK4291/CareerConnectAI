import { Prisma, Job } from "@prisma/client";
import { prisma } from "../config/prisma";

class JobRepository {
  async create(data: Prisma.JobCreateInput): Promise<Job> {
    return prisma.job.create({
      data,
    });
  }

  async findById(id: string): Promise<Job | null> {
    return prisma.job.findUnique({
      where: { id },
    });
  }

  async findByRecruiterAndId(
    jobId: string,
    recruiterId: string,
  ): Promise<Job | null> {
    return prisma.job.findFirst({
      where: {
        id: jobId,
        recruiterId,
      },
    });
  }

  async findRecruiterJobs(recruiterId: string): Promise<Job[]> {
    return prisma.job.findMany({
      where: {
        recruiterId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async update(jobId: string, data: Prisma.JobUpdateInput): Promise<Job> {
    return prisma.job.update({
      where: {
        id: jobId,
      },
      data,
    });
  }

  async delete(jobId: string): Promise<Job> {
    return prisma.job.delete({
      where: {
        id: jobId,
      },
    });
  }
}

export default new JobRepository();
