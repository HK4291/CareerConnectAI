import { Education } from "@prisma/client";

import { prisma } from "../config/prisma";

import { CreateEducationDto, UpdateEducationDto } from "../dto/education.dto";

class EducationRepository {
  /**
   * Add Education
   */
  async create(
    candidateId: string,
    data: CreateEducationDto,
  ): Promise<Education> {
    return prisma.education.create({
      data: {
        candidateId,
        ...data,
      },
    });
  }

  /**
   * Get Education By Candidate
   */
  async findAllByCandidate(candidateId: string): Promise<Education[]> {
    return prisma.education.findMany({
      where: {
        candidateId,
      },
      orderBy: {
        startDate: "desc",
      },
    });
  }

  /**
   * Find Education By Id
   */
  async findById(educationId: string): Promise<Education | null> {
    return prisma.education.findUnique({
      where: {
        id: educationId,
      },
    });
  }

  async findByIdOrCandidate(
    candidateId: string,
    educationId: string,
  ): Promise<Education | null> {
    return prisma.education.findFirst({
      where: {
        OR: [{ id: educationId }, { candidateId: educationId }],
        candidateId,
      },
    });
  }

  /**
   * Update Education
   */
  async update(
    educationId: string,
    data: UpdateEducationDto,
  ): Promise<Education> {
    return prisma.education.update({
      where: {
        id: educationId,
      },
      data,
    });
  }

  /**
   * Delete Education
   */
  async delete(educationId: string): Promise<Education> {
    return prisma.education.delete({
      where: {
        id: educationId,
      },
    });
  }

  /**
   * Verify Ownership
   */
  async belongsToCandidate(
    educationId: string,
    candidateId: string,
  ): Promise<boolean> {
    const education = await prisma.education.findFirst({
      where: {
        id: educationId,
        candidateId,
      },
      select: {
        id: true,
      },
    });

    return !!education;
  }

  /**
   * Count Education Records
   */
  async count(candidateId: string): Promise<number> {
    return prisma.education.count({
      where: {
        candidateId,
      },
    });
  }
}

export const educationRepository = new EducationRepository();
