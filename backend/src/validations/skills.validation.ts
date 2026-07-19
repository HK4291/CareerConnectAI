import { SkillLevel } from "@prisma/client";
import { z } from "zod";

export const createSkillSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Skill name must be at least 2 characters.")
      .max(60),

    category: z.string().trim().optional(),

    level: z.nativeEnum(SkillLevel).optional(),

    experienceYears: z.number().min(0).max(60).optional(),
  }),
});

export const updateSkillSchema = z.object({
  body: z.object({
    level: z.nativeEnum(SkillLevel).optional(),

    experienceYears: z.number().min(0).max(60).optional(),
  }),
});

export const skillIdSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
});
