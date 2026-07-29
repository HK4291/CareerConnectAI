import { z } from "zod";

import {
  EmploymentType,
  ExperienceLevel,
  JobStatus,
  SkillImportance,
} from "@prisma/client";

const skillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Skill name must be at least 2 characters.")
    .max(100, "Skill name cannot exceed 100 characters."),

  importance: z.nativeEnum(SkillImportance).optional(),
});

const jobSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Job title must be at least 3 characters.")
    .max(150, "Job title cannot exceed 150 characters."),

  description: z
    .string()
    .trim()
    .min(20, "Job description must be at least 20 characters."),

  salaryMin: z
    .number()
    .positive("Minimum salary must be greater than 0.")
    .optional(),

  salaryMax: z
    .number()
    .positive("Maximum salary must be greater than 0.")
    .optional(),

  employmentType: z.nativeEnum(EmploymentType).optional(),

  experienceLevel: z.nativeEnum(ExperienceLevel).optional(),

  location: z
    .string()
    .trim()
    .max(100, "Location cannot exceed 100 characters.")
    .optional(),

  deadline: z.coerce.date().optional(),

  status: z.nativeEnum(JobStatus).optional(),

  skills: z.array(skillSchema).min(1, "At least one skill is required."),
});

export const createJobSchema = jobSchema
  .refine(
    (data) =>
      !data.salaryMin || !data.salaryMax || data.salaryMin <= data.salaryMax,
    {
      message: "Minimum salary cannot be greater than maximum salary.",
      path: ["salaryMin"],
    },
  )
  .refine((data) => !data.deadline || data.deadline.getTime() > Date.now(), {
    message: "Deadline must be a future date.",
    path: ["deadline"],
  });

export const updateJobSchema = jobSchema
  .partial()
  .extend({
    skills: z.array(skillSchema).optional(),
  })
  .refine(
    (data) =>
      !data.salaryMin || !data.salaryMax || data.salaryMin <= data.salaryMax,
    {
      message: "Minimum salary cannot be greater than maximum salary.",
      path: ["salaryMin"],
    },
  )
  .refine((data) => !data.deadline || data.deadline.getTime() > Date.now(), {
    message: "Deadline must be a future date.",
    path: ["deadline"],
  });

export const jobSearchSchema = z
  .object({
    search: z.string().trim().optional(),

    location: z.string().trim().optional(),

    employmentType: z.nativeEnum(EmploymentType).optional(),

    experienceLevel: z.nativeEnum(ExperienceLevel).optional(),

    salaryMin: z.coerce
      .number()
      .positive("Minimum salary must be greater than 0.")
      .optional(),

    salaryMax: z.coerce
      .number()
      .positive("Maximum salary must be greater than 0.")
      .optional(),

    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),

    sort: z
      .enum(["newest", "oldest", "salaryAsc", "salaryDesc"])
      .default("newest"),
  })
  .refine(
    (data) =>
      !data.salaryMin || !data.salaryMax || data.salaryMin <= data.salaryMax,
    {
      message: "Minimum salary cannot be greater than maximum salary.",
      path: ["salaryMin"],
    },
  );

export const savedJobQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1, "Page must be greater than or equal to 1.")
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be greater than or equal to 1.")
    .max(100, "Limit cannot exceed 100.")
    .default(10),
});

const paginationSchema = {
  page: z.coerce
    .number()
    .int()
    .min(1, "Page must be greater than or equal to 1.")
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be greater than or equal to 1.")
    .max(100, "Limit cannot exceed 100.")
    .default(10),
};
