import { Prisma } from "@prisma/client";

import { ParsedResume } from "../types/parsed-resume";

export class ResumeMapper {
  static toParsedData(parsedResume: ParsedResume): Prisma.InputJsonValue {
    return {
      rawText: parsedResume.rawText,

      personal: parsedResume.personal,

      summary: parsedResume.summary ?? null,

      skills: parsedResume.skills,

      education: parsedResume.education,

      experience: parsedResume.experience,

      projects: parsedResume.projects,

      certifications: parsedResume.certifications,

      languages: parsedResume.languages,

      achievements: parsedResume.achievements,
    };
  }
}
