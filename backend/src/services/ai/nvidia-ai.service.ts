import OpenAI from "openai";

import { env } from "../../config/env";

import ApiError from "../../utils/ApiError";
import logger from "../../utils/logger";

class NvidiaAIService {
  private readonly client: OpenAI;

  private readonly model: string;

  private readonly maxTokens = 4096;

  constructor() {
    if (!env.NVIDIA_API_KEY) {
      throw new Error("NVIDIA_API_KEY is not configured.");
    }

    this.client = new OpenAI({
      apiKey: env.NVIDIA_API_KEY,
      baseURL: "https://integrate.api.nvidia.com/v1",
      timeout: env.NVIDIA_REQUEST_TIMEOUT_MS,
    });

    this.model = env.NVIDIA_MODEL;
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
          provider: "nvidia",
          model: this.model,
          characters: userPrompt.length,
        },
        "NVIDIA AI request started",
      );

      const response = await this.client.chat.completions.create({
        model: this.model,

        temperature: 0.2,

        top_p: 1,

        max_tokens: this.maxTokens,

        stream: false,

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

      const choice = response.choices?.[0];
      const message = choice?.message;
      const output = this.extractTextContent(message?.content).trim();
      const reasoningContent = this.extractReasoningContent(message);

      if (!output) {
        logger.error(
          {
            provider: "nvidia",
            model: this.model,
            choice,
            reasoningContent,
            usage: response.usage,
          },
          "Empty response received from NVIDIA AI",
        );

        throw new ApiError(
          502,
          "NVIDIA AI returned an empty response. Check model availability and token limits.",
        );
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
            provider: "nvidia",
            output: cleanedOutput,
          },
          "Invalid JSON received from NVIDIA AI",
        );

        throw new ApiError(502, "NVIDIA AI returned an invalid JSON response.");
      }

      logger.info(
        {
          provider: "nvidia",
          model: this.model,
          duration: `${Date.now() - startedAt} ms`,
          finishReason: choice?.finish_reason,
          reasoningCharacters: reasoningContent.length,
          usage: response.usage,
        },
        "NVIDIA AI request completed",
      );

      return parsed;
    } catch (error: any) {
      logger.error(
        {
          provider: "nvidia",
          model: this.model,
          duration: `${Date.now() - startedAt} ms`,
          error,
        },
        "NVIDIA AI request failed",
      );

      if (error instanceof ApiError) {
        throw error;
      }

      if (error?.status === 401) {
        throw new ApiError(500, "Invalid NVIDIA API key.");
      }

      if (error?.status === 429) {
        throw new ApiError(
          429,
          "NVIDIA AI rate limit exceeded. Please try again later.",
        );
      }

      if (error?.status >= 500) {
        throw new ApiError(
          502,
          "NVIDIA AI service is temporarily unavailable.",
        );
      }

      if (error?.status >= 400) {
        const message =
          error?.message || "NVIDIA AI rejected the request configuration.";

        throw new ApiError(502, `NVIDIA AI request failed: ${message}`);
      }

      throw new ApiError(500, "Failed to communicate with NVIDIA AI.");
    }
  }

  private extractReasoningContent(message: unknown): string {
    if (!message || typeof message !== "object") {
      return "";
    }

    if (
      "reasoning_content" in message &&
      typeof message.reasoning_content === "string"
    ) {
      return message.reasoning_content;
    }

    return "";
  }

  private extractTextContent(content: unknown): string {
    if (!content) {
      return "";
    }

    if (typeof content === "string") {
      return content;
    }

    if (!Array.isArray(content)) {
      return "";
    }

    return content
      .map((part) => {
        if (
          part &&
          typeof part === "object" &&
          "text" in part &&
          typeof part.text === "string"
        ) {
          return part.text;
        }

        return "";
      })
      .join("")
      .trim();
  }
}

export const nvidiaAIService = new NvidiaAIService();
