import OpenAI from "openai";

import { env } from "../../config/env";

import ApiError from "../../utils/ApiError";
import logger from "../../utils/logger";

class OpenAIService {
  private readonly client: OpenAI;

  private readonly model: string;

  constructor() {
    if (!env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }

    this.client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });

    this.model = env.OPENAI_MODEL;
  }

  getClient(): OpenAI {
    return this.client;
  }

  getModel(): string {
    return this.model;
  }

  async generateJson<T>(systemPrompt: string, userPrompt: string): Promise<T> {
    const startedAt = Date.now();

    try {
      logger.info(
        {
          model: this.model,
          characters: userPrompt.length,
        },
        "OpenAI request started",
      );

      const response = await this.client.responses.create(
        {
          model: this.model,

          input: [
            {
              role: "system",
              content: [
                {
                  type: "input_text",
                  text: systemPrompt,
                },
              ],
            },
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: userPrompt,
                },
              ],
            },
          ],
        },
        {
          timeout: 30000,
        },
      );

      const output = response.output_text?.trim();

      if (!output) {
        throw new ApiError(502, "OpenAI returned an empty response.");
      }

      let parsed: T;

      try {
        parsed = JSON.parse(output) as T;
      } catch {
        logger.error(
          {
            output,
          },
          "Invalid JSON received from OpenAI",
        );

        throw new ApiError(502, "OpenAI returned an invalid JSON response.");
      }

      logger.info(
        {
          model: this.model,
          duration: `${Date.now() - startedAt} ms`,
          usage: response.usage,
        },
        "OpenAI request completed",
      );

      return parsed;
    } catch (error: any) {
      logger.error(
        {
          model: this.model,
          duration: `${Date.now() - startedAt} ms`,
          error,
        },
        "OpenAI request failed",
      );

      if (error instanceof ApiError) {
        throw error;
      }

      if (error?.status === 401) {
        throw new ApiError(500, "Invalid OpenAI API key.");
      }

      if (error?.status === 429) {
        throw new ApiError(
          429,
          "OpenAI rate limit exceeded. Please try again later.",
        );
      }

      if (error?.status >= 500) {
        throw new ApiError(502, "OpenAI service is temporarily unavailable.");
      }

      throw new ApiError(500, "Failed to communicate with OpenAI.");
    }
  }
}

export const openAIService = new OpenAIService();
