import ApiError from "../ApiError";

import { env } from "../../config/env";

import { LocalStorageProvider } from "./local.storage";
import { IStorageProvider } from "./storage.provider";
import { S3StorageProvider } from "./s3.storage";
import { CloudinaryStorageProvider } from "./cloudinary.storage";

class StorageFactory {
  public static create(): IStorageProvider {
    switch (env.STORAGE_PROVIDER.toLowerCase()) {
      case "local":
        return new LocalStorageProvider();

      case "s3":
        throw new ApiError(500, "S3 storage provider is not configured yet.");

      case "cloudinary":
        throw new ApiError(
          500,
          "Cloudinary storage provider is not configured yet.",
        );

      default:
        throw new ApiError(
          500,
          `Unsupported storage provider: ${env.STORAGE_PROVIDER}`,
        );
    }
  }
}

export const storageProvider = StorageFactory.create();
