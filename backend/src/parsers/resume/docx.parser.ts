import mammoth from "mammoth";

import ApiError from "../../utils/ApiError";
import logger from "../../utils/logger";

import { ParsedResume } from "../../types/parsed-resume";
import { IResumeParser } from "../../interfaces/resume-parser.interface";
import { TextCleaner } from "./text-cleaner";
import { resumeAIParserService } from "../../services/ai/resume-ai-parser.service";

export class DocxParser implements IResumeParser {
  async parse(file: Express.Multer.File): Promise<ParsedResume> {
    if (!file) {
      throw new ApiError(400, "No DOCX file provided.");
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new ApiError(400, "DOCX file is empty.");
    }

    try {
      logger.info(
        {
          fileName: file.originalname,
          fileSize: file.size,
        },
        "Starting DOCX parsing",
      );

      const result = await mammoth.extractRawText({
        buffer: file.buffer,
      });

      const rawText = TextCleaner.clean(result.value);

      if (!rawText) {
        throw new ApiError(
          422,
          "Unable to extract text from the provided DOCX document.",
        );
      }

      if (result.messages.length > 0) {
        logger.warn(
          {
            fileName: file.originalname,
            warnings: result.messages,
          },
          "DOCX parsed with warnings",
        );
      }

      const parsedResume = await resumeAIParserService.parse(rawText);

      logger.info(
        {
          fileName: file.originalname,
          characters: rawText.length,
        },
        "DOCX parsed successfully",
      );

      return parsedResume;
    } catch (error) {
      logger.error(
        {
          fileName: file.originalname,
          error,
        },
        "Failed to parse DOCX",
      );

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(500, "Failed to parse DOCX document.");
    }
  }
}
