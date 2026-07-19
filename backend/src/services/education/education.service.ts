import { Education } from "@prisma/client";

import ApiError from "../../utils/ApiError";

import {
  CreateEducationDto,
  UpdateEducationDto,
} from "../../dto/education.dto";

import { IEducationService } from "../../interfaces/education.interface";

import { educationRepository } from "../../repositories/education.repository";
import { candidateRepository } from "../../repositories/candidate.repositoy";
import { profileCompletionService } from "../profile/profile-Completion.service";

class EducationService implements IEducationService {
  /**
   * Add Education
   */
  async createEducation(
    userId: string,
    data: CreateEducationDto,
  ): Promise<Education> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const education = await educationRepository.create(candidate.id, data);

    await profileCompletionService.updateProfileCompletion(candidate.id);

    return education;
  }

  /**
   * Get All Educations
   */
  async getEducations(userId: string): Promise<Education[]> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    return educationRepository.findAllByCandidate(candidate.id);
  }

  /**
   * Update Education
   */
  async updateEducation(
    userId: string,
    educationId: string,
    data: UpdateEducationDto,
  ): Promise<Education> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const education = await educationRepository.findByIdOrCandidate(
      candidate.id,
      educationId,
    );

    if (!education) {
      throw new ApiError(404, "Education not found.");
    }

    const ownsEducation = await educationRepository.belongsToCandidate(
      education.id,
      candidate.id,
    );

    if (!ownsEducation) {
      throw new ApiError(
        403,
        "You are not authorized to update this education.",
      );
    }

    const updatedEducation = await educationRepository.update(
      education.id,
      data,
    );

    await profileCompletionService.updateProfileCompletion(candidate.id);

    return updatedEducation;
  }

  /**
   * Delete Education
   */
  async deleteEducation(
    userId: string,
    educationId: string,
  ): Promise<Education> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const education = await educationRepository.findByIdOrCandidate(
      candidate.id,
      educationId,
    );

    if (!education) {
      throw new ApiError(404, "Education not found.");
    }

    const ownsEducation = await educationRepository.belongsToCandidate(
      education.id,
      candidate.id,
    );

    if (!ownsEducation) {
      throw new ApiError(
        403,
        "You are not authorized to delete this education.",
      );
    }

    const deleteEducation = await educationRepository.delete(education.id);

    await profileCompletionService.updateProfileCompletion(candidate.id);

    return deleteEducation;
  }
}

export const educationService = new EducationService();
