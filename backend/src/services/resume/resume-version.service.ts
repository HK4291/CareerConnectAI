import ApiError from "../../utils/ApiError";

import { candidateRepository } from "../../repositories/candidate.repositoy";
import { resumeRepository } from "../../repositories/resume.repository";
import { resumeVersionRepository } from "../../repositories/resume-version.repository";

class ResumeVersionService {
  /**
   * Get Resume Version History
   */
  async getResumeVersions(userId: string, resumeId: string) {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const resume = await resumeRepository.findById(resumeId);

    if (!resume) {
      throw new ApiError(404, "Resume not found.");
    }

    if (resume.candidateId !== candidate.id) {
      throw new ApiError(403, "You are not authorized to access this resume.");
    }

    return resumeVersionRepository.findAllByResume(resumeId);
  }
}

export const resumeVersionService = new ResumeVersionService();
