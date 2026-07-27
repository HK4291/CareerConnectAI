import { Prisma, Resume, ResumeAnalysis } from "@prisma/client";

import { prisma } from "../config/prisma";

export class AtsRepository {
  async findResumeById(
    resumeId: string,
  ): Promise<(Resume & { analysis: ResumeAnalysis | null }) | null> {
    return prisma.resume.findUnique({
      where: {
        id: resumeId,
      },
      include: {
        analysis: true,
      },
    });
  }

  async findAnalysisByResumeId(
    resumeId: string,
  ): Promise<ResumeAnalysis | null> {
    return prisma.resumeAnalysis.findUnique({
      where: {
        resumeId,
      },
    });
  }

  async createAnalysis(
    data: Prisma.ResumeAnalysisCreateInput,
  ): Promise<ResumeAnalysis> {
    return prisma.resumeAnalysis.create({
      data,
    });
  }

  async upsertAnalysis(
    resumeId: string,
    data: {
      ATSScore: number;
      ATSBreakdown: Prisma.InputJsonValue;
      suggestions: Prisma.InputJsonValue;
      parsedData: Prisma.InputJsonValue;
    },
  ): Promise<ResumeAnalysis> {
    return prisma.resumeAnalysis.upsert({
      where: {
        resumeId,
      },
      update: {
        ATSScore: data.ATSScore,
        ATSBreakdown: data.ATSBreakdown,
        suggestions: data.suggestions,
        parsedData: data.parsedData,
      },
      create: {
        resume: {
          connect: {
            id: resumeId,
          },
        },
        ATSScore: data.ATSScore,
        ATSBreakdown: data.ATSBreakdown,
        suggestions: data.suggestions,
        parsedData: data.parsedData,
      },
    });
  }
}

export const atsRepository = new AtsRepository();
