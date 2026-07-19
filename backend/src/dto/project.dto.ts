import { z } from "zod";

/**
 * Create Project
 */
export const createProjectSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Project title must be at least 2 characters.")
      .max(150, "Project title cannot exceed 150 characters."),

    description: z.string().trim().max(5000).optional(),

    githubUrl: z.string().trim().url("Invalid GitHub URL.").optional(),

    liveUrl: z.string().trim().url("Invalid Live URL.").optional(),

    technologies: z.array(z.string().trim().min(1)).optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return data.startDate <= data.endDate;
    },
    {
      message: "End date cannot be before start date.",
      path: ["endDate"],
    },
  );

export type CreateProjectDto = z.infer<typeof createProjectSchema>;

/**
 * Update Project
 */
export const updateProjectSchema = z
  .object({
    title: z.string().trim().min(2).max(150).optional(),

    description: z.string().trim().max(5000).optional(),

    githubUrl: z.string().trim().url().optional(),

    liveUrl: z.string().trim().url().optional(),

    technologies: z.array(z.string().trim().min(1)).optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return data.startDate <= data.endDate;
    },
    {
      message: "End date cannot be before start date.",
      path: ["endDate"],
    },
  );

export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;

/**
 * Params
 */
export const projectIdParamSchema = z.object({
  id: z.string().cuid(),
});
