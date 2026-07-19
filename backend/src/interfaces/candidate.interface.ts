import { Candidate } from "@prisma/client";

import { CreateCandidateDto, UpdateCandidateDto } from "../dto/candidate.dto";

/**
 * Repository Interface
 */
export interface ICandidateRepository {
  create(userId: string, data: CreateCandidateDto): Promise<Candidate>;

  findByUserId(userId: string): Promise<Candidate | null>;

  update(userId: string, data: UpdateCandidateDto): Promise<Candidate>;

  delete(userId: string): Promise<Candidate>;

  exists(userId: string): Promise<boolean>;

  getFullProfile(userId: string): Promise<Candidate | null>;
}

/**
 * Service Interface
 */
export interface ICandidateService {
  createProfile(userId: string, data: CreateCandidateDto): Promise<Candidate>;

  getMyProfile(userId: string): Promise<any>;

  updateProfile(userId: string, data: UpdateCandidateDto): Promise<Candidate>;

  deleteProfile(userId: string): Promise<Candidate>;

  updateResume(userId: string, resumeUrl: string): Promise<Candidate>;

  updateATSScore(userId: string, score: number): Promise<Candidate>;

  updateProfileCompletion(
    userId: string,
    percentage: number,
  ): Promise<Candidate>;

  getProfileStats(userId: string): Promise<any>;
}
