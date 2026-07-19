import { Certificate } from "@prisma/client";

import ApiError from "../../utils/ApiError";

import {
  CreateCertificateDto,
  UpdateCertificateDto,
} from "../../dto/certificate.dto";

import { ICertificateService } from "../../interfaces/certificate.interface";

import { candidateRepository } from "../../repositories/candidate.repositoy";
import { certificateRepository } from "../../repositories/certificate.repository";
import { profileCompletionService } from "../profile/profile-Completion.service";

class CertificateService implements ICertificateService {
  /**
   * Add Certificate
   */
  async createCertificate(
    userId: string,
    data: CreateCertificateDto,
  ): Promise<Certificate> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const certificate = await certificateRepository.create(candidate.id, data);

    await profileCompletionService.updateProfileCompletion(candidate.id);

    return certificate;
  }

  /**
   * Get All Certificates
   */
  async getCertificates(userId: string): Promise<Certificate[]> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    return certificateRepository.findAllByCandidate(candidate.id);
  }

  /**
   * Update Certificate
   */
  async updateCertificate(
    userId: string,
    certificateId: string,
    data: UpdateCertificateDto,
  ): Promise<Certificate> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const certificate = await certificateRepository.findById(certificateId);

    if (!certificate) {
      throw new ApiError(404, "Certificate not found.");
    }

    const ownsCertificate = await certificateRepository.belongsToCandidate(
      certificateId,
      candidate.id,
    );

    if (!ownsCertificate) {
      throw new ApiError(
        403,
        "You are not authorized to update this certificate.",
      );
    }

    return certificateRepository.update(certificateId, data);
  }

  /**
   * Delete Certificate
   */
  async deleteCertificate(
    userId: string,
    certificateId: string,
  ): Promise<Certificate> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const certificate = await certificateRepository.findById(certificateId);

    if (!certificate) {
      throw new ApiError(404, "Certificate not found.");
    }

    const ownsCertificate = await certificateRepository.belongsToCandidate(
      certificateId,
      candidate.id,
    );

    if (!ownsCertificate) {
      throw new ApiError(
        403,
        "You are not authorized to delete this certificate.",
      );
    }

    const deletedCertificate =
      await certificateRepository.delete(certificateId);

    await profileCompletionService.updateProfileCompletion(candidate.id);

    return deletedCertificate;
  }
}

export const certificateService = new CertificateService();
