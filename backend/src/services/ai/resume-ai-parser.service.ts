import ApiError from "../../utils/ApiError";

import { ParsedResume } from "../../types/parsed-resume";

import { parsedResumeSchema } from "../../schemas/parsed-resume.schema";

import { openAIService } from "./openai.service";

class ResumeAIParserService {
  private readonly systemPrompt = `
You are an expert ATS Resume Parser.

Extract the resume into structured JSON.

Rules:

- Return ONLY valid JSON.
- Do not wrap response inside markdown.
- Do not explain anything.
- If any field is missing, return null or [].
- Never invent information.
- Preserve dates exactly as written.
- Keep descriptions concise.

Return JSON in the following schema:

{
  "rawText": "",
  "personal": {
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "portfolio": ""
  },
  "summary": "",
  "skills": [
    {
      "name": "",
      "level": "",
      "experienceYears": 0
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "fieldOfStudy": "",
      "startDate": "",
      "endDate": "",
      "grade": "",
      "description": ""
    }
  ],
  "experience": [
    {
      "company": "",
      "position": "",
      "startDate": "",
      "endDate": "",
      "isCurrent": false,
      "description": ""
    }
  ],
  "projects": [
    {
      "title": "",
      "description": "",
      "technologies": [],
      "githubUrl": "",
      "liveUrl": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "issueDate": "",
      "credentialId": ""
    }
  ],
  "languages": [],
  "achievements": []
}
`;

  async parse(rawText: string): Promise<ParsedResume> {
    if (!rawText.trim()) {
      throw new ApiError(400, "Resume text is empty.");
    }

    const aiResponse = await openAIService.generateJson<
      Omit<ParsedResume, "rawText">
    >(this.systemPrompt, rawText);

    const validation = parsedResumeSchema.safeParse({
      ...aiResponse,
      rawText,
    });

    if (!validation.success) {
      throw new ApiError(500, "OpenAI returned an invalid resume structure.");
    }

    return validation.data;
  }
}

export const resumeAIParserService = new ResumeAIParserService();
