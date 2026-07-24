import { ResumeSyncStatus, StorageProvider } from "@prisma/client";
import { Express } from "express";

import ApiError from "../ApiError";

import { env } from "../../config/env";

import { LocalStorageProvider } from "./local.storage";
import { S3StorageProvider } from "./s3.storage";
import { CloudinaryStorageProvider } from "./cloudinary.storage";

import {
  IStorageProvider,
  UploadOptions,
  UploadResult,
} from "./storage.provider";

export interface ManagedUploadResult extends UploadResult {
  storageProvider: StorageProvider;

  syncStatus: ResumeSyncStatus;

  isFallback: boolean;
}

class StorageManager {
  private localProvider?: LocalStorageProvider;

  private s3Provider?: S3StorageProvider;

  private cloudinaryProvider?: CloudinaryStorageProvider;

  /**
   * Lazy Initialization
   */

  private getLocalProvider(): LocalStorageProvider {
    if (!this.localProvider) {
      this.localProvider = new LocalStorageProvider();
    }

    return this.localProvider;
  }

  private getS3Provider(): S3StorageProvider {
    if (!this.s3Provider) {
      this.s3Provider = new S3StorageProvider();
    }

    return this.s3Provider;
  }

  private getCloudinaryProvider(): CloudinaryStorageProvider {
    if (!this.cloudinaryProvider) {
      this.cloudinaryProvider = new CloudinaryStorageProvider();
    }

    return this.cloudinaryProvider;
  }

  /**
   * Get Primary Provider
   */

  private getPrimaryProvider(): {
    provider: IStorageProvider;

    type: StorageProvider;
  } {
    switch (env.STORAGE_PROVIDER.toLowerCase()) {
      case "local":
        return {
          provider: this.getLocalProvider(),

          type: StorageProvider.LOCAL,
        };

      case "s3":
        return {
          provider: this.getS3Provider(),

          type: StorageProvider.S3,
        };

      case "cloudinary":
        return {
          provider: this.getCloudinaryProvider(),

          type: StorageProvider.CLOUDINARY,
        };

      default:
        throw new ApiError(
          500,
          `Unsupported Storage Provider : ${env.STORAGE_PROVIDER}`,
        );
    }
  }

  /**
   * Upload File
   */

  async upload(
    file: Express.Multer.File,
    options?: UploadOptions,
  ): Promise<ManagedUploadResult> {
    /**
     * Local Only
     */

    if (env.STORAGE_PROVIDER === "local") {
      const result = await this.getLocalProvider().upload(file, options);

      return {
        ...result,

        storageProvider: StorageProvider.LOCAL,

        syncStatus: ResumeSyncStatus.SYNCED,

        isFallback: false,
      };
    }

    /**
     * Cloud Upload
     */

    try {
      const { provider, type } = this.getPrimaryProvider();

      const result = await provider.upload(file, options);

      return {
        ...result,

        storageProvider: type,

        syncStatus: ResumeSyncStatus.SYNCED,

        isFallback: false,
      };
    } catch (error) {
      console.error("Cloud Upload Failed :", error);

      /**
       * Local Fallback
       */

      const result = await this.getLocalProvider().upload(file, options);

      return {
        ...result,

        storageProvider: StorageProvider.LOCAL,

        syncStatus: ResumeSyncStatus.PENDING,

        isFallback: true,
      };
    }
  }

  /**
   * Delete File
   */

  async delete(
    storageProvider: StorageProvider,
    storagePath: string,
  ): Promise<void> {
    switch (storageProvider) {
      case StorageProvider.LOCAL:
        return this.getLocalProvider().delete(storagePath);

      case StorageProvider.S3:
        return this.getS3Provider().delete(storagePath);

      case StorageProvider.CLOUDINARY:
        return this.getCloudinaryProvider().delete(storagePath);

      default:
        throw new ApiError(500, "Invalid Storage Provider.");
    }
  }

  /**
   * Check File Exists
   */

  async exists(
    storageProvider: StorageProvider,
    storagePath: string,
  ): Promise<boolean> {
    switch (storageProvider) {
      case StorageProvider.LOCAL:
        return this.getLocalProvider().exists(storagePath);

      case StorageProvider.S3:
        return this.getS3Provider().exists(storagePath);

      case StorageProvider.CLOUDINARY:
        return this.getCloudinaryProvider().exists(storagePath);

      default:
        return false;
    }
  }

  /**
   * Public URL
   */

  getPublicUrl(storageProvider: StorageProvider, storagePath: string): string {
    switch (storageProvider) {
      case StorageProvider.LOCAL:
        return this.getLocalProvider().getPublicUrl(storagePath);

      case StorageProvider.S3:
        return this.getS3Provider().getPublicUrl(storagePath);

      case StorageProvider.CLOUDINARY:
        return this.getCloudinaryProvider().getPublicUrl(storagePath);

      default:
        throw new ApiError(500, "Invalid Storage Provider.");
    }
  }
}

export const storageManager = new StorageManager();
