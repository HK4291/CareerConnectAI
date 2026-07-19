import { EmploymentType } from "@prisma/client";
import { z } from "zod";

/**
 * Create Experience
 */
export const createExperienceSchema = z.object({
  company: z.string().trim().min(2, "Company name is required.").max(150),

  designation: z.string().trim().min(2, "Designation is required.").max(100),

  employmentType: z.nativeEnum(EmploymentType).optional(),

  location: z.string().trim().max(100).optional(),

  isCurrent: z.boolean().default(false),

  startDate: z.coerce.date(),

  endDate: z.coerce.date().optional(),

  description: z.string().trim().max(2000).optional(),
});

/**
 * Update Experience
 */
export const updateExperienceSchema = createExperienceSchema.partial();

/**
 * Params
 */
export const experienceIdParamSchema = z.object({
  id: z.string().cuid("Invalid experience id."),
});

/**
 * Types
 */
export type CreateExperienceDto = z.infer<typeof createExperienceSchema>;

export type UpdateExperienceDto = z.infer<typeof updateExperienceSchema>;

export type ExperienceIdParamDto = z.infer<typeof experienceIdParamSchema>;
