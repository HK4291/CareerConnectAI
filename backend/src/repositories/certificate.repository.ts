import { Certificate } from "@prisma/client";

import { prisma } from "../config/prisma";

import {
  CreateCertificateDto,
  UpdateCertificateDto,
} from "../dto/certificate.dto";

class CertificateRepository {
  /**
   * Create Certificate
   */
  async create(
    candidateId: string,
    data: CreateCertificateDto,
  ): Promise<Certificate> {
    return prisma.certificate.create({
      data: {
        candidateId,
        ...data,
      },
    });
  }

  /**
   * Get Certificates By Candidate
   */
  async findAllByCandidate(candidateId: string): Promise<Certificate[]> {
    return prisma.certificate.findMany({
      where: {
        candidateId,
      },
      orderBy: {
        issueDate: "desc",
      },
    });
  }

  /**
   * Find Certificate By Id
   */
  async findById(certificateId: string): Promise<Certificate | null> {
    return prisma.certificate.findUnique({
      where: {
        id: certificateId,
      },
    });
  }

  /**
   * Update Certificate
   */
  async update(
    certificateId: string,
    data: UpdateCertificateDto,
  ): Promise<Certificate> {
    return prisma.certificate.update({
      where: {
        id: certificateId,
      },
      data,
    });
  }

  /**
   * Delete Certificate
   */
  async delete(certificateId: string): Promise<Certificate> {
    return prisma.certificate.delete({
      where: {
        id: certificateId,
      },
    });
  }

  /**
   * Verify Ownership
   */
  async belongsToCandidate(
    certificateId: string,
    candidateId: string,
  ): Promise<boolean> {
    const certificate = await prisma.certificate.findFirst({
      where: {
        id: certificateId,
        candidateId,
      },
      select: {
        id: true,
      },
    });

    return !!certificate;
  }

  /**
   * Count Certificates
   */
  async count(candidateId: string): Promise<number> {
    return prisma.certificate.count({
      where: {
        candidateId,
      },
    });
  }
}

export const certificateRepository = new CertificateRepository();
