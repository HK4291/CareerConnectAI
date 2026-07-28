import { Resume, ResumeAnalysis, ResumeParseStatus } from "@prisma/client";
import fs from "node:fs/promises";

import ApiError from "../../utils/ApiError";
import { Prisma } from "@prisma/client";

import { atsAIService } from "./ats-ai.service";
import { AIATSResponse } from "../../types/ats.types";
import { candidateRepository } from "../../repositories/candidate.repositoy";
import { atsRepository } from "../../repositories/ats.repository";
import { ResumeParser } from "../../parsers/resume/resume.parser";

class AtsService {
  private readonly resumeParser = new ResumeParser();
  /**
   * Get Resume Ready For ATS Analysis
   */
  async analyzeResume(
    userId: string,
    resumeId: string,
  ): Promise<AIATSResponse> {
    /**
     * Candidate Validation
     */
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    /**
     * Resume Validation
     */
    const resume = await atsRepository.findResumeById(resumeId);

    if (!resume) {
      throw new ApiError(404, "Resume not found.");
    }

    /**
     * Ownership Validation
     */
    if (resume.candidateId !== candidate.id) {
      throw new ApiError(403, "You are not authorized to analyze this resume.");
    }

    /**
     * Resume Parse Validation
     */
    if (resume.parseStatus !== ResumeParseStatus.SUCCESS) {
      throw new ApiError(409, "Resume parsing has not completed successfully.");
    }

    /**
     * Raw Text Validation
     */
    if (!resume.rawText || resume.rawText.trim().length === 0) {
      throw new ApiError(
        409,
        "Resume text is unavailable. Please upload the resume again.",
      );
    }

    /**
     * Parsed Data Validation
     */
    if (!resume.parsedData) {
      throw new ApiError(
        409,
        "Parsed resume data is unavailable. Please upload the resume again.",
      );
    }

    /**
     * Ready For ATS Processing
     */
    const aiAnalysis = await atsAIService.analyze(
      resume.parsedData as any,
      resume.rawText,
    );

    await atsRepository.upsertAnalysis(resume.id, {
      ATSScore: aiAnalysis.overallScore,

      ATSBreakdown: aiAnalysis.breakdown as unknown as Prisma.InputJsonValue,

      suggestions: aiAnalysis.suggestions as unknown as Prisma.InputJsonValue,

      parsedData: aiAnalysis as unknown as Prisma.InputJsonValue,
    });

    return aiAnalysis;
  }

  async quickAnalyzeResume(
    userId: string,
    file: Express.Multer.File,
  ): Promise<AIATSResponse> {
    /**
     * Candidate Validation
     */
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    try {
      /**
       * Parse Uploaded Resume
       */
      const parsedResume = await this.resumeParser.parse(file);

      /**
       * Analyze Resume
       */
      const aiAnalysis = await atsAIService.analyze(
        parsedResume,
        parsedResume.rawText,
      );

      return aiAnalysis;
    } finally {
      /**
       * Delete Temporary Uploaded File
       */
      if (file.path) {
        try {
          await fs.unlink(file.path);
        } catch (error) {
          console.warn("Failed to delete temporary resume:", error);
        }
      }
    }
  }
}

export const atsService = new AtsService();
