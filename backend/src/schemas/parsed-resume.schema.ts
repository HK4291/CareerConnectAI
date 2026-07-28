import { z } from "zod";

const nullToUndefined = (value: unknown) =>
  value === null ? undefined : value;

const optionalString = z.preprocess(nullToUndefined, z.string().optional());

const requiredString = z.preprocess(
  (value) => (value === null || value === undefined ? "" : value),
  z.string(),
);

const optionalNumber = z.preprocess((value) => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return value;
}, z.number().optional());

const optionalBoolean = z.preprocess((value) => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return value;
}, z.boolean().optional());

const stringArray = z.preprocess((value) => {
  if (value === null || value === undefined || value === "") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string");
  }

  if (typeof value === "string") {
    return [value];
  }

  return [];
}, z.array(z.string()));

const arrayOf = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => {
    if (value === null || value === undefined || value === "") {
      return [];
    }

    return Array.isArray(value) ? value : [];
  }, z.array(schema));

export const parsedResumeSchema = z.object({
  rawText: z.string(),

  personal: z
    .preprocess(
      (value) => value ?? {},
      z.object({
        name: optionalString,
        email: optionalString,
        phone: optionalString,
        location: optionalString,
        linkedin: optionalString,
        github: optionalString,
        portfolio: optionalString,
      }),
    )
    .default({}),

  summary: optionalString,

  skills: arrayOf(
    z.object({
      name: requiredString,
      level: optionalString,
      experienceYears: optionalNumber,
    }),
  ),

  education: arrayOf(
    z.object({
      institution: requiredString,
      degree: optionalString,
      fieldOfStudy: optionalString,
      startDate: optionalString,
      endDate: optionalString,
      grade: optionalString,
      description: optionalString,
    }),
  ),

  experience: arrayOf(
    z.object({
      company: requiredString,
      position: optionalString,
      startDate: optionalString,
      endDate: optionalString,
      isCurrent: optionalBoolean,
      description: optionalString,
    }),
  ),

  projects: arrayOf(
    z.object({
      title: requiredString,
      description: optionalString,
      technologies: stringArray.optional(),
      githubUrl: optionalString,
      liveUrl: optionalString,
    }),
  ),

  certifications: arrayOf(
    z.object({
      name: requiredString,
      issuer: optionalString,
      issueDate: optionalString,
      credentialId: optionalString,
    }),
  ),

  languages: stringArray,

  achievements: stringArray,
});

export type ParsedResumeSchema = z.infer<typeof parsedResumeSchema>;
