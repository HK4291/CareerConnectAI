import { AIATSResponse } from "../../types/ats.types";
import { ParsedResume } from "../../types/parsed-resume";

import {
  ATS_SYSTEM_PROMPT,
  buildATSPrompt,
} from "../../utils/prompts/ats.prompt";

import { nvidiaAIService } from "../ai/nvidia-ai.service";

class AtsAIService {
  /**
   * Analyze Resume using NVIDIA AI
   */
  async analyze(
    parsedResume: ParsedResume,
    rawText?: string,
  ): Promise<AIATSResponse> {
    const prompt = buildATSPrompt(parsedResume, rawText);

    return nvidiaAIService.generateJson<AIATSResponse>(
      ATS_SYSTEM_PROMPT,
      prompt,
    );
  }
}

export const atsAIService = new AtsAIService();
