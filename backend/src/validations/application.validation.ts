import { z } from "zod";

export const applyJobBodySchema = z.object({
  coverLetter: z
    .string()
    .trim()
    .max(5000, "Cover letter cannot exceed 5000 characters")
    .optional(),
});

export const applyJobParamsSchema = z.object({
  jobId: z.string().cuid("Invalid job id"),
});
