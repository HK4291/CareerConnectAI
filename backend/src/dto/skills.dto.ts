import { SkillLevel } from "@prisma/client";
import { z } from "zod";

/**
 * Create Skill
 */
export const createSkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Skill name must be at least 2 characters.")
    .max(100, "Skill name cannot exceed 100 characters."),

  category: z.string().trim().max(100).optional(),

  level: z.nativeEnum(SkillLevel).optional(),

  experienceYears: z.number().min(0).max(60).optional(),
});

export type CreateSkillDto = z.infer<typeof createSkillSchema>;

/**
 * Update Skill
 */
export const updateSkillSchema = z.object({
  level: z.nativeEnum(SkillLevel).optional(),

  experienceYears: z.number().min(0).max(60).optional(),
});

export type UpdateSkillDto = z.infer<typeof updateSkillSchema>;

/**
 * Params
 */
export const skillIdSchema = z.object({
  id: z.string().cuid(),
});
