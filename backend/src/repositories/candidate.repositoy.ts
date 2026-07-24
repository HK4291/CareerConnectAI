import { Candidate, Prisma } from "@prisma/client";

import { prisma } from "../config/prisma";
import { CreateCandidateDto, UpdateCandidateDto } from "../dto/candidate.dto";
import { ICandidateRepository } from "../interfaces/candidate.interface";

type PrismaExecutor = Prisma.TransactionClient;

class CandidateRepository implements ICandidateRepository {
  /**
   * Create Candidate Profile
   */
  async create(userId: string, data: CreateCandidateDto): Promise<Candidate> {
    return prisma.candidate.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  /**
   * Find Candidate By User ID
   */
  async findByUserId(userId: string): Promise<Candidate | null> {
    return prisma.candidate.findUnique({
      where: {
        userId,
      },
    });
  }

  /**
   * Check Candidate Exists
   */
  async exists(userId: string): Promise<boolean> {
    const candidate = await prisma.candidate.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    return !!candidate;
  }

  /**
   * Update Candidate Profile
   */
  async update(userId: string, data: UpdateCandidateDto): Promise<Candidate> {
    return prisma.candidate.update({
      where: {
        userId,
      },
      data,
    });
  }

  /**
   * Delete Candidate Profile
   */
  async delete(userId: string): Promise<Candidate> {
    return prisma.candidate.delete({
      where: {
        userId,
      },
    });
  }

  /**
   * Complete Candidate Profile
   */
  async getFullProfile(userId: string) {
    return prisma.candidate.findUnique({
      where: {
        userId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            isVerified: true,
            createdAt: true,
          },
        },

        educations: {
          orderBy: {
            startDate: "desc",
          },
        },

        experiences: {
          orderBy: {
            startDate: "desc",
          },
        },

        projects: {
          orderBy: {
            createdAt: "desc",
          },
        },

        certificates: {
          orderBy: {
            issueDate: "desc",
          },
        },

        candidateSkills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }

  /**
   * Update ATS Score
   */
  async updateATSScore(userId: string, score: number): Promise<Candidate> {
    return prisma.candidate.update({
      where: {
        userId,
      },
      data: {
        ATSScore: score,
      },
    });
  }

  /**
   * Update Resume URL
   */
  async updateResume(
    userId: string,
    resumeUrl: string,
    tx?: PrismaExecutor,
  ): Promise<Candidate> {
    const db = tx ?? prisma;
    return prisma.candidate.update({
      where: {
        userId,
      },
      data: {
        resumeUrl,
      },
    });
  }

  /**
   * Count Candidate Stats
   */
  async getProfileStats(userId: string) {
    const candidate = await prisma.candidate.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!candidate) {
      return null;
    }

    const [
      educationCount,
      experienceCount,
      projectCount,
      certificateCount,
      skillCount,
    ] = await Promise.all([
      prisma.education.count({
        where: {
          candidateId: candidate.id,
        },
      }),

      prisma.experience.count({
        where: {
          candidateId: candidate.id,
        },
      }),

      prisma.project.count({
        where: {
          candidateId: candidate.id,
        },
      }),

      prisma.certificate.count({
        where: {
          candidateId: candidate.id,
        },
      }),

      prisma.candidateSkill.count({
        where: {
          candidateId: candidate.id,
        },
      }),
    ]);

    return {
      educationCount,
      experienceCount,
      projectCount,
      certificateCount,
      skillCount,
    };
  }

  /**
   * Update Profile Completion
   */
  async updateProfileCompletion(
    candidateId: string,
    profileCompletion: number,
  ) {
    return prisma.candidate.update({
      where: {
        id: candidateId,
      },
      data: {
        profileCompletion,
      },
    });
  }

  /**
   * Find Candidate By Id
   */
  async findById(candidateId: string): Promise<Candidate | null> {
    return prisma.candidate.findUnique({
      where: {
        id: candidateId,
      },
    });
  }
}

export const candidateRepository = new CandidateRepository();
