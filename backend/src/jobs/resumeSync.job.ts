import { ResumeSyncStatus, StorageProvider } from "@prisma/client";

import { resumeRepository } from "../repositories/resume.repository";

import { S3StorageProvider } from "../utils/storage/s3.storage";
import { CloudinaryStorageProvider } from "../utils/storage/cloudinary.storage";

class ResumeSyncJob {
  async syncPendingResumes() {
    const resumes = await resumeRepository.getPendingSyncResumes();

    if (!resumes.length) {
      return;
    }

    for (const resume of resumes) {
      try {
        const provider =
          process.env.STORAGE_PROVIDER === "s3"
            ? new S3StorageProvider()
            : new CloudinaryStorageProvider();

        /**
         * Upload implementation
         *
         * Final implementation
         * will upload local file to cloud.
         */

        await resumeRepository.updateSyncStatus(
          resume.id,
          ResumeSyncStatus.SYNCED,
          resume.retryCount,
        );
      } catch {
        await resumeRepository.updateSyncStatus(
          resume.id,
          resume.syncStatus,
          resume.retryCount + 1,
        );
      }
    }
  }
}

export const resumeSyncJob = new ResumeSyncJob();
