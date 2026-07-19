import { Experience } from "@prisma/client";

import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from "../dto/experience.dto";

export interface IExperienceRepository {
  create(candidateId: string, data: CreateExperienceDto): Promise<Experience>;

  findAllByCandidate(candidateId: string): Promise<Experience[]>;

  findById(experienceId: string): Promise<Experience | null>;

  update(experienceId: string, data: UpdateExperienceDto): Promise<Experience>;

  delete(experienceId: string): Promise<Experience>;

  belongsToCandidate(
    experienceId: string,
    candidateId: string,
  ): Promise<boolean>;
}

export interface IExperienceService {
  createExperience(
    userId: string,
    data: CreateExperienceDto,
  ): Promise<Experience>;

  getExperiences(userId: string): Promise<Experience[]>;

  updateExperience(
    userId: string,
    experienceId: string,
    data: UpdateExperienceDto,
  ): Promise<Experience>;

  deleteExperience(userId: string, experienceId: string): Promise<Experience>;
}
