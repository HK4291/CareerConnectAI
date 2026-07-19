import { SkillLevel } from "@prisma/client";

import { prisma } from "../config/prisma";

class SkillRepository {
  async findSkillByName(name: string) {
    return prisma.skill.findUnique({
      where: {
        name,
      },
    });
  }

  async createSkill(name: string, category?: string) {
    return prisma.skill.create({
      data: {
        name,
        category,
      },
    });
  }

  async addCandidateSkill(data: {
    candidateId: string;
    skillId: string;
    level?: SkillLevel;
    experienceYears?: number;
  }) {
    return prisma.candidateSkill.create({
      data,
      include: {
        skill: true,
      },
    });
  }

  async getCandidateSkills(candidateId: string) {
    return prisma.candidateSkill.findMany({
      where: {
        candidateId,
      },
      include: {
        skill: true,
      },
      orderBy: {
        skill: {
          name: "asc",
        },
      },
    });
  }

  async getCandidateSkillById(id: string) {
    return prisma.candidateSkill.findUnique({
      where: {
        id,
      },
      include: {
        skill: true,
      },
    });
  }

  async getCandidateSkillByIdOrSkillId(candidateId: string, id: string) {
    return prisma.candidateSkill.findFirst({
      where: {
        OR: [{ id }, { candidateId, skillId: id }],
      },
      include: {
        skill: true,
      },
    });
  }

  async updateCandidateSkill(
    id: string,
    data: {
      level?: SkillLevel;
      experienceYears?: number;
    },
  ) {
    return prisma.candidateSkill.update({
      where: {
        id,
      },
      data,
      include: {
        skill: true,
      },
    });
  }

  async deleteCandidateSkill(id: string) {
    return prisma.candidateSkill.delete({
      where: {
        id,
      },
    });
  }

  async candidateAlreadyHasSkill(candidateId: string, skillId: string) {
    return prisma.candidateSkill.findUnique({
      where: {
        candidateId_skillId: {
          candidateId,
          skillId,
        },
      },
    });
  }

  /**
   * Count Skills
   */
  async count(candidateId: string): Promise<number> {
    return prisma.candidateSkill.count({
      where: {
        candidateId,
      },
    });
  }
}

export const skillRepository = new SkillRepository();
