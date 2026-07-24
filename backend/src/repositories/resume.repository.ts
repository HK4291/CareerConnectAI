import { Resume, ResumeSyncStatus, ResumeParseStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";

type PrismaExecutor = Prisma.TransactionClient | typeof prisma;

import { prisma } from "../config/prisma";

class ResumeRepository {
  /**
   * Create Resume
   */
  async create(
    data: {
      candidateId: string;
      originalFileName: string;
      fileName: string;
      mimeType: string;
      fileSize: number;
      storageProvider: any;
      storagePath: string;
      syncStatus: ResumeSyncStatus;

      rawText?: string | null;

      parsedData?: Prisma.InputJsonValue | null;

      parseStatus?: ResumeParseStatus;
    },
    tx: PrismaExecutor = prisma,
  ) {
    return tx.resume.create({
      data,
    });
  }

  /**
   * Find Active Resume
   */
  async findActiveResume(candidateId: string) {
    return prisma.resume.findFirst({
      where: {
        candidateId,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Find Resume By Id
   */
  async findById(id: string) {
    return prisma.resume.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * Get Candidate Resumes
   */
  async getCandidateResumes(candidateId: string) {
    return prisma.resume.findMany({
      where: {
        candidateId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Mark Resume Inactive
   */
  async markInactive(candidateId: string, tx: PrismaExecutor = prisma) {
    return tx.resume.updateMany({
      where: {
        candidateId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  }

  /**
   * Delete Resume
   */
  async delete(id: string, tx: PrismaExecutor = prisma) {
    return tx.resume.delete({
      where: {
        id,
      },
    });
  }

  /**
   * Pending Sync Resumes
   */
  async getPendingSyncResumes() {
    return prisma.resume.findMany({
      where: {
        syncStatus: ResumeSyncStatus.PENDING,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  /**
   * Update Sync Status
   */
  async updateSyncStatus(
    id: string,
    syncStatus: ResumeSyncStatus,
    retryCount?: number,
    tx: PrismaExecutor = prisma,
  ) {
    return tx.resume.update({
      where: {
        id,
      },
      data: {
        syncStatus,
        retryCount,
      },
    });
  }
}

export const resumeRepository = new ResumeRepository();
