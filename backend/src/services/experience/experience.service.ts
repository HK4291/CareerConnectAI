import { Experience } from "@prisma/client";

import ApiError from "../../utils/ApiError";

import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from "../../dto/experience.dto";

import { IExperienceService } from "../../interfaces/experience.interface";

import { experienceRepository } from "../../repositories/experience.repository";
import { candidateRepository } from "../../repositories/candidate.repositoy";
import { profileCompletionService } from "../profile/profile-Completion.service";

class ExperienceService implements IExperienceService {
  /**
   * Add Experience
   */
  async createExperience(
    userId: string,
    data: CreateExperienceDto,
  ): Promise<Experience> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const experience = await experienceRepository.create(candidate.id, data);

    await profileCompletionService.updateProfileCompletion(candidate.id);

    return experience;
  }

  /**
   * Get All Experiences
   */
  async getExperiences(userId: string): Promise<Experience[]> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    return experienceRepository.findAllByCandidate(candidate.id);
  }

  /**
   * Update Experience
   */
  async updateExperience(
    userId: string,
    experienceId: string,
    data: UpdateExperienceDto,
  ): Promise<Experience> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const experience = await experienceRepository.findByIdOrCandidate(
      candidate.id,
      experienceId,
    );

    if (!experience) {
      throw new ApiError(404, "Experience not found.");
    }

    const ownsExperience = await experienceRepository.belongsToCandidate(
      experience.id,
      candidate.id,
    );

    if (!ownsExperience) {
      throw new ApiError(
        403,
        "You are not authorized to update this experience.",
      );
    }

    const updatedExperience = await experienceRepository.update(
      experience.id,
      data,
    );

    await profileCompletionService.updateProfileCompletion(candidate.id);

    return updatedExperience;
  }

  /**
   * Delete Experience
   */
  async deleteExperience(
    userId: string,
    experienceId: string,
  ): Promise<Experience> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const experience = await experienceRepository.findByIdOrCandidate(
      candidate.id,
      experienceId,
    );

    if (!experience) {
      throw new ApiError(404, "Experience not found.");
    }

    const ownsExperience = await experienceRepository.belongsToCandidate(
      experience.id,
      candidate.id,
    );

    if (!ownsExperience) {
      throw new ApiError(
        403,
        "You are not authorized to delete this experience.",
      );
    }

    const deletedExperience = await experienceRepository.delete(experience.id);

    await profileCompletionService.updateProfileCompletion(candidate.id);

    return deletedExperience;
  }
}

export const experienceService = new ExperienceService();
