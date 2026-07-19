import path from "path";

import { Express } from "express";
import { v2 as cloudinary } from "cloudinary";

import { env } from "../../config/env";

import { IStorageProvider, UploadResult } from "./storage.provider";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export class CloudinaryStorageProvider implements IStorageProvider {
  public async upload(file: Express.Multer.File): Promise<UploadResult> {
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "careerpilot/resumes",
          resource_type: "raw",
          public_id: `${Date.now()}-${path.parse(file.originalname).name}`,
        },
        (error, response) => {
          if (error) {
            return reject(error);
          }

          resolve(response);
        },
      );

      stream.end(file.buffer);
    });

    return {
      fileName: result.public_id,
      originalFileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      storagePath: result.public_id,
      publicUrl: result.secure_url,
    };
  }

  public async delete(storagePath: string): Promise<void> {
    await cloudinary.uploader.destroy(storagePath, {
      resource_type: "raw",
    });
  }

  public async exists(): Promise<boolean> {
    // Cloudinary me direct lightweight exists check nahi hai.
    return true;
  }

  public getPublicUrl(storagePath: string): string {
    return `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/raw/upload/${storagePath}`;
  }
}
