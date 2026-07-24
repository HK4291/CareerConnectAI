import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),

  PORT: z.coerce.number().default(5000),

  APP_URL: z.coerce.string().min(1),

  DATABASE_URL: z.string().min(1),

  STORAGE_PROVIDER: z.string().min(1),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),

  CLOUDINARY_API_KEY: z.string().min(1),

  CLOUDINARY_API_SECRET: z.string().min(1),

  AWS_S3_BUCKET: z.string().min(1),

  AWS_REGION: z.string().min(1),

  AWS_ACCESS_KEY_ID: z.string().min(1),

  AWS_SECRET_ACCESS_KEY: z.string().min(1),

  DIRECT_URL: z.string().min(1).optional(),

  JWT_ACCESS_SECRET: z.string().min(10),

  JWT_REFRESH_SECRET: z.string().min(10),

  JWT_ACCESS_EXPIRES_IN: z.string(),

  JWT_REFRESH_EXPIRES_IN: z.string(),

  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),

  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),

  API_VERSION: z.string().default("v1"),

  MAIL_HOST: z.string().min(1),

  MAIL_PORT: z.coerce.number().default(587),

  MAIL_USER: z.string().email(),

  MAIL_PASSWORD: z.string().min(1),

  MAIL_FROM_NAME: z.string().min(1),

  MAIL_FROM_EMAIL: z.string().email(),

  CLIENT_URL: z.string().url(),

  OPENAI_API_KEY: z.string().min(1),

  OPENAI_MODEL: z.string().default("gpt-5-mini"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
