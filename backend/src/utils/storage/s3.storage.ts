import path from "path";

import { Express } from "express";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { env } from "../../config/env";

import { IStorageProvider, UploadResult } from "./storage.provider";

export class S3StorageProvider implements IStorageProvider {
  private readonly bucket = env.AWS_S3_BUCKET;

  private readonly client = new S3Client({
    region: env.AWS_REGION,

    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  public async upload(file: Express.Multer.File): Promise<UploadResult> {
    const extension = path.extname(file.originalname);

    const fileName = `${Date.now()}-${crypto.randomUUID()}${extension}`;

    const key = `resumes/${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      fileName,
      originalFileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      storagePath: key,
      publicUrl: this.getPublicUrl(key),
    };
  }

  public async delete(storagePath: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: storagePath,
      }),
    );
  }

  public async exists(storagePath: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: storagePath,
        }),
      );

      return true;
    } catch {
      return false;
    }
  }

  public getPublicUrl(storagePath: string): string {
    return `https://${this.bucket}.s3.${env.AWS_REGION}.amazonaws.com/${storagePath}`;
  }
}
