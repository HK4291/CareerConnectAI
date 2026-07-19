import { z } from "zod";

/**
 * Create Candidate Profile
 */
export const createCandidateSchema = z.object({
  headline: z
    .string()
    .trim()
    .min(3, "Headline must be at least 3 characters.")
    .max(120, "Headline cannot exceed 120 characters.")
    .optional(),

  bio: z
    .string()
    .trim()
    .min(20, "Bio must be at least 20 characters.")
    .max(2000, "Bio cannot exceed 2000 characters.")
    .optional(),

  preferredRole: z
    .string()
    .trim()
    .min(2, "Preferred role is required.")
    .max(100)
    .optional(),

  preferredLocation: z
    .string()
    .trim()
    .min(2, "Preferred location is required.")
    .max(100)
    .optional(),

  expectedSalary: z
    .number({
      error: "Expected salary must be a number.",
    })
    .positive("Expected salary must be greater than 0.")
    .optional(),

  experienceYears: z
    .number({
      error: "Experience must be a number.",
    })
    .min(0, "Experience cannot be negative.")
    .max(60, "Invalid experience.")
    .optional(),
});

/**
 * Update Candidate Profile
 */
export const updateCandidateSchema = createCandidateSchema.partial();

/**
 * Params
 */
export const candidateIdParamSchema = z.object({
  id: z.string().cuid("Invalid candidate id."),
});

/**
 * Types
 */
export type CreateCandidateDto = z.infer<typeof createCandidateSchema>;

export type UpdateCandidateDto = z.infer<typeof updateCandidateSchema>;

export type CandidateIdParamDto = z.infer<typeof candidateIdParamSchema>;
