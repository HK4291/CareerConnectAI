import { z } from "zod";

/**
 * Create Education
 */
export const createEducationSchema = z.object({
  institution: z
    .string()
    .trim()
    .min(2, "Institution name is required.")
    .max(150),

  degree: z.string().trim().min(2, "Degree is required.").max(100),

  fieldOfStudy: z
    .string()
    .trim()
    .min(2, "Field of study is required.")
    .max(100),

  grade: z.string().trim().max(20).optional(),

  startDate: z.coerce.date(),

  endDate: z.coerce.date().optional(),

  currentlyStudying: z.boolean().default(false),

  description: z.string().trim().max(1000).optional(),
});

/**
 * Update Education
 */
export const updateEducationSchema = createEducationSchema.partial();

/**
 * Params
 */
export const educationIdParamSchema = z.object({
  id: z.string().cuid("Invalid education id."),
});

/**
 * Types
 */
export type CreateEducationDto = z.infer<typeof createEducationSchema>;

export type UpdateEducationDto = z.infer<typeof updateEducationSchema>;

export type EducationIdParamDto = z.infer<typeof educationIdParamSchema>;
