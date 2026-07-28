import { Prisma, SkillLevel, SkillImportance } from "@prisma/client";

import { prisma } from "../config/prisma";

class SkillRepository {
  async findSkillByName(name: string, tx: Prisma.TransactionClient = prisma) {
    return tx.skill.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
      },
    });
  }

  async createSkill(
    name: string,
    category?: string,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.skill.create({
      data: {
        name: name.trim(),
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

  // job skills
  async createJobSkills(
    data: {
      jobId: string;
      skillId: string;
      importance?: SkillImportance;
    }[],
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.jobSkill.createMany({
      data,
      skipDuplicates: true,
    });
  }
}

export const skillRepository = new SkillRepository();
