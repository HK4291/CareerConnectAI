import { Prisma } from "@prisma/client";

import { prisma } from "../config/prisma";

type PrismaExecutor = Prisma.TransactionClient | typeof prisma;

class ResumeVersionRepository {
  /**
   * Get latest version number of a resume
   */
  async getLatestVersion(
    resumeId: string,
    tx: PrismaExecutor = prisma,
  ): Promise<number> {
    const latestVersion = await tx.resumeVersion.findFirst({
      where: {
        resumeId,
      },
      orderBy: {
        version: "desc",
      },
      select: {
        version: true,
      },
    });

    return latestVersion?.version ?? 0;
  }

  /**
   * Create Resume Version
   */
  async create(
    data: {
      resumeId: string;
      version: number;
      storagePath: string;
    },
    tx: PrismaExecutor = prisma,
  ) {
    return tx.resumeVersion.create({
      data,
    });
  }

  /**
   * Get all versions of a resume
   */
  async findAllByResume(resumeId: string) {
    return prisma.resumeVersion.findMany({
      where: {
        resumeId,
      },
      orderBy: {
        version: "desc",
      },
    });
  }

  /**
   * Find specific version
   */
  async findByVersion(resumeId: string, version: number) {
    return prisma.resumeVersion.findUnique({
      where: {
        resumeId_version: {
          resumeId,
          version,
        },
      },
    });
  }

  /**
   * Delete versions
   */
  async deleteByResume(resumeId: string, tx: PrismaExecutor = prisma) {
    return tx.resumeVersion.deleteMany({
      where: {
        resumeId,
      },
    });
  }
}

export const resumeVersionRepository = new ResumeVersionRepository();
