import pdfParse from "pdf-parse";

import ApiError from "../../utils/ApiError";
import logger from "../../utils/logger";

import { ParsedResume } from "../../types/parsed-resume";
import { IResumeParser } from "../../interfaces/resume-parser.interface";
import { TextCleaner } from "./text-cleaner";
import { resumeAIParserService } from "../../services/ai/resume-ai-parser.service";

export class PdfParser implements IResumeParser {
  async parse(file: Express.Multer.File): Promise<ParsedResume> {
    if (!file) {
      throw new ApiError(400, "No PDF file provided.");
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new ApiError(400, "PDF file is empty.");
    }

    try {
      logger.info(
        {
          fileName: file.originalname,
          fileSize: file.size,
        },
        "Starting PDF parsing",
      );

      const result = await pdfParse(file.buffer);

      const rawText = TextCleaner.clean(result.text);

      if (!rawText) {
        throw new ApiError(
          422,
          "Unable to extract text from the provided PDF.",
        );
      }

      const parsedResume = await resumeAIParserService.parse(rawText);

      logger.info(
        {
          fileName: file.originalname,
          characters: rawText.length,
          pages: result.numpages,
        },
        "PDF parsed successfully",
      );

      return parsedResume;
    } catch (error) {
      logger.error(
        {
          fileName: file.originalname,
          error,
        },
        "Failed to parse PDF",
      );

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(500, "Failed to parse PDF document.");
    }
  }
}
