import { Candidate } from "@prisma/client";

import { PROFILE_COMPLETION } from "../../constants/profileCompletion.constants";

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
    return 0;
  }

  /**
   * Calculate Basic Profile
   */
  private calculateBasicProfile(candidate: Candidate): number {
    return 0;
  }

  /**
   * Calculate Education
   */
  private calculateEducation(count: number): number {
    return 0;
  }

  /**
   * Calculate Experience
   */
  private calculateExperience(count: number): number {
    return 0;
  }

  /**
   * Calculate Skills
   */
  private calculateSkills(count: number): number {
    return 0;
  }

  /**
   * Calculate Projects
   */
  private calculateProjects(count: number): number {
    return 0;
  }

  /**
   * Calculate Certificates
   */
  private calculateCertificates(count: number): number {
    return 0;
  }
}

export const profileCompletionService = new ProfileCompletionService();
