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

export interface JobSearchDto {
  search?: string;

  location?: string;

  employmentType?: EmploymentType;

  experienceLevel?: ExperienceLevel;

  salaryMin?: number;

  salaryMax?: number;

  page?: number;

  limit?: number;

  sort?: "newest" | "oldest" | "salaryAsc" | "salaryDesc";
}

export interface SavedJobQueryDto {
  page?: number;
  limit?: number;
}
