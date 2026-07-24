import { Prisma, Resume, ResumeParseStatus } from "@prisma/client";

import { prisma } from "../../config/prisma";

import ApiError from "../../utils/ApiError";

import { storageManager } from "../../utils/storage/storage.manager";

import { candidateRepository } from "../../repositories/candidate.repositoy";
import { resumeRepository } from "../../repositories/resume.repository";
import { ResumeParser } from "../../parsers/resume/resume.parser";
import { ResumeMapper } from "../../mappers/resume.mapper";
import { resumeVersionRepository } from "../../repositories/resume-version.repository";

import { profileCompletionService } from "../profile/profile-Completion.service";

class ResumeService {
  private readonly resumeParser = new ResumeParser();
  /**
   * Upload Resume
   */
  async uploadResume(
    userId: string,
    file: Express.Multer.File,
  ): Promise<Resume> {
    if (!file) {
      throw new ApiError(400, "Resume file is required.");
    }

    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    /**
     * Upload through Storage Manager.
     *
     * Storage Manager automatically decides:
     *
     * Local
     * S3
     * Cloudinary
     * Local Fallback
     */

    const parsedResume = await this.resumeParser.parse(file);

    const upload = await storageManager.upload(file, {
      folder: "resumes",
    });

    /**
     * Everything below should either
     * completely succeed
     * or rollback.
     */
    const resume = await prisma.$transaction(
      async (tx) => {
        /**
         * Check existing active resume
         */
        const activeResume = await resumeRepository.findActiveResume(
          candidate.id,
        );

        /**
         * Create version snapshot of old resume
         */
        if (activeResume) {
          const latestVersion = await resumeVersionRepository.getLatestVersion(
            activeResume.id,
            tx,
          );

          await resumeVersionRepository.create(
            {
              resumeId: activeResume.id,

              version: latestVersion + 1,

              storagePath: activeResume.storagePath,
            },
            tx,
          );
        }

        /**
         * Mark previous resume inactive
         */
        await resumeRepository.markInactive(candidate.id, tx);

        /**
         * Create new active resume
         */
        const createdResume = await resumeRepository.create(
          {
            candidateId: candidate.id,

            originalFileName: upload.originalFileName,

            fileName: upload.fileName,

            mimeType: upload.mimeType,

            fileSize: upload.fileSize,

            storageProvider: upload.storageProvider,

            storagePath: upload.storagePath,

            syncStatus: upload.syncStatus,

            rawText: parsedResume.rawText,

            parsedData: ResumeMapper.toParsedData(parsedResume),

            parseStatus: ResumeParseStatus.SUCCESS,
          },
          tx,
        );

        /**
         * Update Candidate Resume URL
         */
        await candidateRepository.updateResume(userId, upload.publicUrl, tx);

        return createdResume;
      },
      {
        timeout: 20000,
      },
    );

    /**
     * Profile completion is intentionally
     * outside transaction.
     *
     * Resume already exists.
     */
    await profileCompletionService.updateProfileCompletion(candidate.id);

    return resume;
  }

  /**
   * Get All Candidate Resumes
   */
  async getResumes(userId: string) {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    return resumeRepository.getCandidateResumes(candidate.id);
  }

  /**
   * Get Active Resume
   */
  async getActiveResume(userId: string) {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const resume = await resumeRepository.findActiveResume(candidate.id);

    if (!resume) {
      throw new ApiError(404, "Resume not found.");
    }

    return resume;
  }

  /**
   * Delete Resume
   */
  async deleteResume(userId: string, resumeId: string) {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const resume = await resumeRepository.findById(resumeId);

    if (!resume) {
      throw new ApiError(404, "Resume not found.");
    }

    if (resume.candidateId !== candidate.id) {
      throw new ApiError(403, "You are not authorized to delete this resume.");
    }

    try {
      const exists = await storageManager.exists(
        resume.storageProvider,
        resume.storagePath,
      );

      if (exists) {
        await storageManager.delete(resume.storageProvider, resume.storagePath);
      }
    } catch {
      /**
       * Ignore Storage Errors.
       *
       * Resume record should still be removed.
       */
    }

    const deletedResume = await resumeRepository.delete(resume.id);

    return deletedResume;
  }

  /**
   * Replace Resume
   *
   * Future Versioning Module
   */
  async replaceResume(userId: string, file: Express.Multer.File) {
    return this.uploadResume(userId, file);
  }
}

export const resumeService = new ResumeService();
