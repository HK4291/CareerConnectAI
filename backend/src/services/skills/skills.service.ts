import { CandidateSkill } from "@prisma/client";

import ApiError from "../../utils/ApiError";

import { CreateSkillDto, UpdateSkillDto } from "../../dto/skills.dto";

import { ISkillService } from "../../interfaces/skills.interface";

import { candidateRepository } from "../../repositories/candidate.repositoy";
import { skillRepository } from "../../repositories/skills.repository";

import { profileCompletionService } from "../profile/profile-Completion.service";

class SkillService implements ISkillService {
  /**
   * Add Skill
   */
  async createSkill(
    userId: string,
    data: CreateSkillDto,
  ): Promise<CandidateSkill> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    let skill = await skillRepository.findSkillByName(data.name);

    if (!skill) {
      skill = await skillRepository.createSkill(data.name, data.category);
    }

    const alreadyExists = await skillRepository.candidateAlreadyHasSkill(
      candidate.id,
      skill.id,
    );

    if (alreadyExists) {
      throw new ApiError(409, "Candidate already has this skill.");
    }

    const skillData = {
      candidateId: candidate.id,
      skillId: skill.id,
      level: data.level,
      experienceYears: data.experienceYears,
    };

    const candidateSkill = await skillRepository.addCandidateSkill(skillData);

    await profileCompletionService.updateProfileCompletion(candidate.id);

    return candidateSkill;
  }

  /**
   * Get Candidate Skills
   */
  async getSkills(userId: string) {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    return skillRepository.getCandidateSkills(candidate.id);
  }

  /**
   * Update Skill
   */
  async updateSkill(
    userId: string,
    candidateSkillId: string,
    data: UpdateSkillDto,
  ) {
    const candidate = await candidateRepository.findByUserId(userId);
    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const candidateSkill = await skillRepository.getCandidateSkillByIdOrSkillId(
      candidate.id,
      candidateSkillId,
    );

    if (!candidateSkill) {
      throw new ApiError(404, "Skill not found.");
    }

    if (candidateSkill.candidateId !== candidate.id) {
      throw new ApiError(403, "You are not authorized to update this skill.");
    }

    const updatedSkill = await skillRepository.updateCandidateSkill(
      candidateSkill.id,
      data,
    );

    await profileCompletionService.updateProfileCompletion(candidate.id);

    return updatedSkill;
  }

  /**
   * Delete Skill
   */
  async deleteSkill(userId: string, candidateSkillId: string) {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const candidateSkill = await skillRepository.getCandidateSkillByIdOrSkillId(
      candidate.id,
      candidateSkillId,
    );

    if (!candidateSkill) {
      throw new ApiError(404, "Skill not found.");
    }

    if (candidateSkill.candidateId !== candidate.id) {
      throw new ApiError(403, "You are not authorized to delete this skill.");
    }

    const deletedSkill = await skillRepository.deleteCandidateSkill(
      candidateSkill.id,
    );

    await profileCompletionService.updateProfileCompletion(candidate.id);

    return deletedSkill;
  }
}

export const skillService = new SkillService();
