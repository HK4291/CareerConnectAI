import {
  EmploymentType,
  ExperienceLevel,
  JobStatus,
  SkillImportance,
} from "@prisma/client";

export interface CreateJobSkillDto {
  name: string;
  importance?: SkillImportance;
}

export interface CreateJobDto {
  title: string;
  description: string;

  salaryMin?: number;
  salaryMax?: number;

  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel;

  location?: string;

  deadline?: Date;

  status?: JobStatus;

  skills: CreateJobSkillDto[];
}

export interface UpdateJobDto {
  title?: string;
  description?: string;

  salaryMin?: number;
  salaryMax?: number;

  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel;

  location?: string;

  deadline?: Date;

  status?: JobStatus;

  skills?: CreateJobSkillDto[];
}
