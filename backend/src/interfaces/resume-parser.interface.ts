import { ParsedResume } from "../types/parsed-resume";

export interface IResumeParser {
  parse(file: Express.Multer.File): Promise<ParsedResume>;
}
