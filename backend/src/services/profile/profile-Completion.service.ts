import { Candidate } from "@prisma/client";

import {
  PROFILE_COMPLETION,
  BASIC_PROFILE_FIELDS,
} from "../../constants/profileCompletion.constants";

import { candidateRepository } from "../../repositories/candidate.repositoy";
import { educationRepository } from "../../repositories/education.repository";
import { experienceRepository } from "../../repositories/experience.repository";
import { skillRepository } from "../../repositories/skills.repository";
import { projectRepository } from "../../repositories/project.repository";
import { certificateRepository } from "../../repositories/certificate.repository";

class ProfileCompletionService {
  /**
   * Update Profile Completion
   */
  async updateProfileCompletion(candidateId: string): Promise<number> {
    const candidate = await candidateRepository.findById(candidateId);

    if (!candidate) {
      return 0;
    }

    const [
      educationCount,
      experienceCount,
      skillCount,
      projectCount,
      certificateCount,
    ] = await Promise.all([
      educationRepository.count(candidateId),
      experienceRepository.count(candidateId),
      skillRepository.count(candidateId),
      projectRepository.count(candidateId),
      certificateRepository.count(candidateId),
    ]);

    const completion =
      this.calculateBasicProfile(candidate) +
      this.calculateEducation(educationCount) +
      this.calculateExperience(experienceCount) +
      this.calculateSkills(skillCount) +
      this.calculateProjects(projectCount) +
      this.calculateCertificates(certificateCount);

    await candidateRepository.updateProfileCompletion(candidateId, completion);

    return completion;
  }

  /**
   * Calculate Basic Profile
   */
  private calculateBasicProfile(candidate: Candidate): number {
    let score = 0;

    if (candidate.headline?.trim()) {
      score += BASIC_PROFILE_FIELDS.HEADLINE;
    }

    if (candidate.bio?.trim()) {
      score += BASIC_PROFILE_FIELDS.BIO;
    }

    if (candidate.resumeUrl?.trim()) {
      score += BASIC_PROFILE_FIELDS.RESUME;
    }

    if (
      candidate.experienceYears !== null &&
      candidate.experienceYears !== undefined
    ) {
      score += BASIC_PROFILE_FIELDS.EXPERIENCE;
    }

    return score;
  }

  /**
   * Calculate Education
   */
  private calculateEducation(count: number): number {
    return count > 0 ? PROFILE_COMPLETION.EDUCATION : 0;
  }

  /**
   * Calculate Experience
   */
  private calculateExperience(count: number): number {
    return count > 0 ? PROFILE_COMPLETION.EXPERIENCE : 0;
  }

  /**
   * Calculate Skills
   */
  private calculateSkills(count: number): number {
    return count > 0 ? PROFILE_COMPLETION.SKILLS : 0;
  }

  /**
   * Calculate Projects
   */
  private calculateProjects(count: number): number {
    return count > 0 ? PROFILE_COMPLETION.PROJECTS : 0;
  }

  /**
   * Calculate Certificates
   */
  private calculateCertificates(count: number): number {
    return count > 0 ? PROFILE_COMPLETION.CERTIFICATES : 0;
  }
}

export const profileCompletionService = new ProfileCompletionService();
