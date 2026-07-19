import fs from "fs/promises";
import path from "path";

import { Express } from "express";

import { env } from "../../config/env";

import {
  IStorageProvider,
  UploadResult,
} from "./storage.provider";

export class LocalStorageProvider implements IStorageProvider {
  private readonly uploadDirectory = path.join(
    process.cwd(),
    "uploads",
    "resumes",
  );

  public async upload(
    file: Express.Multer.File,
  ): Promise<UploadResult> {
    await fs.mkdir(this.uploadDirectory, { recursive: true });

    const fileExtension = path.extname(file.originalname);

    const fileName = `${Date.now()}-${crypto.randomUUID()}${fileExtension}`;

    const filePath = path.join(this.uploadDirectory, fileName);

    await fs.writeFile(filePath, file.buffer);

    const storagePath = path.join("uploads", "resumes", fileName);

    return {
      fileName,
      originalFileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      storagePath,
      publicUrl: this.getPublicUrl(storagePath),
    };
  }

  public async delete(storagePath: string): Promise<void> {
    const absolutePath = path.join(process.cwd(), storagePath);

    try {
      await fs.unlink(absolutePath);
    } catch {
      // Ignore if file doesn't exist
    }
  }

  public async exists(storagePath: string): Promise<boolean> {
    try {
      await fs.access(path.join(process.cwd(), storagePath));

      return true;
    } catch {
      return false;
    }
  }

  public getPublicUrl(storagePath: string): string {
    return `${env.APP_URL}/${storagePath.replace(/\\/g, "/")}`;
  }
}