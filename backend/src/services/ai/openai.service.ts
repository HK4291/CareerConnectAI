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
          provider: "openai",
          model: this.model,
          characters: userPrompt.length,
        },
        "OpenAI request started",
      );

      const response = await this.client.chat.completions.create({
        model: this.model,

        temperature: 0.2,

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      const output = response.choices?.[0]?.message?.content?.trim();

      if (!output) {
        throw new ApiError(502, "OpenAI returned an empty response.");
      }

      const cleanedOutput = output
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      let parsed: T;

      try {
        parsed = JSON.parse(cleanedOutput) as T;
      } catch {
        logger.error(
          {
            provider: "openai",
            output: cleanedOutput,
          },
          "Invalid JSON received from OpenAI",
        );

        throw new ApiError(502, "OpenAI returned an invalid JSON response.");
      }

      logger.info(
        {
          provider: "openai",
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
          provider: "openai",
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
