import path from "path";

import ApiError from "../../utils/ApiError";

import { ParsedResume } from "../../types/parsed-resume";

import { IResumeParser } from "../../interfaces/resume-parser.interface";
import { PdfParser } from "./pdf.parser";
import { DocxParser } from "./docx.parser";

export class ResumeParser {
  private readonly pdfParser: IResumeParser;
  private readonly docxParser: IResumeParser;

  constructor() {
    this.pdfParser = new PdfParser();
    this.docxParser = new DocxParser();
  }

  async parse(file: Express.Multer.File): Promise<ParsedResume> {
    if (!file) {
      throw new ApiError(400, "No resume file provided.");
    }

    const extension = path.extname(file.originalname).toLowerCase();

    switch (extension) {
      case ".pdf":
        return this.pdfParser.parse(file);

      case ".docx":
        return this.docxParser.parse(file);

      default:
        throw new ApiError(
          400,
          `Unsupported resume format: ${extension}. Only PDF and DOCX files are supported.`,
        );
    }
  }
}
