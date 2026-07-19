import { Candidate } from "@prisma/client";

import ApiError from "../../utils/ApiError";

import {
  CreateCandidateDto,
  UpdateCandidateDto,
} from "../../dto/candidate.dto";
import { ICandidateService } from "../../interfaces/candidate.interface";
import { candidateRepository } from "../../repositories/candidate.repositoy";
import { profileCompletionService } from "../profile/profile-Completion.service";

class CandidateService implements ICandidateService {
  /**
   * Create Candidate Profile
   */
  async createProfile(
    userId: string,
    data: CreateCandidateDto,
  ): Promise<Candidate> {
    const profileExists = await candidateRepository.exists(userId);

    if (profileExists) {
      throw new ApiError(409, "Candidate profile already exists.");
    }

    return candidateRepository.create(userId, data);
  }

  /**
   * Get Logged In User Profile
   */
  async getMyProfile(userId: string) {
    const profile = await candidateRepository.getFullProfile(userId);

    if (!profile) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    return profile;
  }

  /**
   * Update Candidate Profile
   */
  async updateProfile(
    userId: string,
    data: UpdateCandidateDto,
  ): Promise<Candidate> {
    const profileExists = await candidateRepository.exists(userId);

    if (!profileExists) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    return candidateRepository.update(userId, data);
  }

  /**
   * Delete Candidate Profile
   */
  async deleteProfile(userId: string): Promise<Candidate> {
    const profileExists = await candidateRepository.exists(userId);

    if (!profileExists) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    return candidateRepository.delete(userId);
  }

  /**
   * Update Resume URL
   */
  async updateResume(userId: string, resumeUrl: string): Promise<Candidate> {
    const profileExists = await candidateRepository.exists(userId);

    if (!profileExists) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    return candidateRepository.updateResume(userId, resumeUrl);
  }

  /**
   * Update ATS Score
   */
  async updateATSScore(userId: string, score: number): Promise<Candidate> {
    const profileExists = await candidateRepository.exists(userId);

    if (!profileExists) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    return candidateRepository.updateATSScore(userId, score);
  }

  /**
   * Update Profile Completion
   */
  async updateProfileCompletion(
    userId: string,
    percentage: number,
  ): Promise<Candidate> {
    const profileExists = await candidateRepository.exists(userId);

    if (!profileExists) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    return candidateRepository.updateProfileCompletion(userId, percentage);
  }

  /**
   * Dashboard Stats
   */
  async getProfileStats(userId: string) {
    const profileExists = await candidateRepository.exists(userId);

    if (!profileExists) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    return candidateRepository.getProfileStats(userId);
  }
}

export const candidateService = new CandidateService();
