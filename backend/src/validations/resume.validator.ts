import { z } from "zod";

export const uploadResumeSchema = z.object({});

export const deleteResumeSchema = z.object({
  resumeId: z
    .string({
      error: "Resume id is required.",
    })
    .cuid("Invalid resume id."),
});

export type UploadResumeDto = z.infer<typeof uploadResumeSchema>;

export type DeleteResumeDto = z.infer<typeof deleteResumeSchema>;
