import { Express } from "express";

export interface UploadOptions {
  folder?: string;

  fileName?: string;
}

export interface UploadResult {
  fileName: string;

  originalFileName: string;

  mimeType: string;

  fileSize: number;

  storagePath: string;

  publicUrl: string;
}

export interface IStorageProvider {
  upload(
    file: Express.Multer.File,
    options?: UploadOptions,
  ): Promise<UploadResult>;

  delete(storagePath: string): Promise<void>;

  exists(storagePath: string): Promise<boolean>;

  getPublicUrl(storagePath: string): string;
}
