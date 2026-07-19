import { Experience } from "@prisma/client";

import { prisma } from "../config/prisma";

import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from "../dto/experience.dto";

class ExperienceRepository {
  /**
   * Create Experience
   */
  async create(
    candidateId: string,
    data: CreateExperienceDto,
  ): Promise<Experience> {
    return prisma.experience.create({
      data: {
        candidateId,
        ...data,
      },
    });
  }

  /**
   * Get All Experiences
   */
  async findAllByCandidate(candidateId: string): Promise<Experience[]> {
    return prisma.experience.findMany({
      where: {
        candidateId,
      },
      orderBy: {
        startDate: "desc",
      },
    });
  }

  /**
   * Find Experience By Id
   */
  async findById(experienceId: string): Promise<Experience | null> {
    return prisma.experience.findUnique({
      where: {
        id: experienceId,
      },
    });
  }

  async findByIdOrCandidate(
    candidateId: string,
    experienceId: string,
  ): Promise<Experience | null> {
    return prisma.experience.findFirst({
      where: {
        OR: [{ id: experienceId }, { candidateId: experienceId }],
        candidateId,
      },
    });
  }

  /**
   * Update Experience
   */
  async update(
    experienceId: string,
    data: UpdateExperienceDto,
  ): Promise<Experience> {
    return prisma.experience.update({
      where: {
        id: experienceId,
      },
      data,
    });
  }

  /**
   * Delete Experience
   */
  async delete(experienceId: string): Promise<Experience> {
    return prisma.experience.delete({
      where: {
        id: experienceId,
      },
    });
  }

  /**
   * Check Ownership
   */
  async belongsToCandidate(
    experienceId: string,
    candidateId: string,
  ): Promise<boolean> {
    const experience = await prisma.experience.findFirst({
      where: {
        id: experienceId,
        candidateId,
      },
      select: {
        id: true,
      },
    });

    return !!experience;
  }

  /**
   * Count Experience Records
   */
  async count(candidateId: string): Promise<number> {
    return prisma.experience.count({
      where: {
        candidateId,
      },
    });
  }
}

export const experienceRepository = new ExperienceRepository();
