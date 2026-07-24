import { z } from "zod";

export const parsedResumeSchema = z.object({
  rawText: z.string(),

  personal: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional(),
  }),

  summary: z.string().optional(),

  skills: z.array(
    z.object({
      name: z.string(),
      level: z.string().optional(),
      experienceYears: z.number().optional(),
    }),
  ),

  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string().optional(),
      fieldOfStudy: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      grade: z.string().optional(),
      description: z.string().optional(),
    }),
  ),

  experience: z.array(
    z.object({
      company: z.string(),
      position: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      isCurrent: z.boolean().optional(),
      description: z.string().optional(),
    }),
  ),

  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      technologies: z.array(z.string()).optional(),
      githubUrl: z.string().optional(),
      liveUrl: z.string().optional(),
    }),
  ),

  certifications: z.array(
    z.object({
      name: z.string(),
      issuer: z.string().optional(),
      issueDate: z.string().optional(),
      credentialId: z.string().optional(),
    }),
  ),

  languages: z.array(z.string()),

  achievements: z.array(z.string()),
});

export type ParsedResumeSchema = z.infer<typeof parsedResumeSchema>;
