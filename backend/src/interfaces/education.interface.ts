import { Education } from "@prisma/client";

import { CreateEducationDto, UpdateEducationDto } from "../dto/education.dto";

export interface IEducationRepository {
  create(candidateId: string, data: CreateEducationDto): Promise<Education>;

  findAllByCandidate(candidateId: string): Promise<Education[]>;

  findById(educationId: string): Promise<Education | null>;

  update(educationId: string, data: UpdateEducationDto): Promise<Education>;

  delete(educationId: string): Promise<Education>;

  belongsToCandidate(
    educationId: string,
    candidateId: string,
  ): Promise<boolean>;
}

export interface IEducationService {
  createEducation(userId: string, data: CreateEducationDto): Promise<Education>;

  getEducations(userId: string): Promise<Education[]>;

  updateEducation(
    userId: string,
    educationId: string,
    data: UpdateEducationDto,
  ): Promise<Education>;

  deleteEducation(userId: string, educationId: string): Promise<Education>;
}
