import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import { generateGiftsResponseSchema, type GenerateGiftsAiResponse } from "./schema";

export type AiErrorCode = "MISSING_API_KEY" | "API_ERROR" | "PARSE_ERROR" | "RATE_LIMIT";

export class AiGenerationError extends Error {
  code: AiErrorCode;

  constructor(code: AiErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "AiGenerationError";
  }
}

const RESPONSE_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    suggestions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          reason: { type: SchemaType.STRING },
          priceRange: { type: SchemaType.STRING },
        },
        required: ["name", "reason", "priceRange"],
      },
    },
  },
  required: ["suggestions"],
};

const MODEL_NAME = "gemini-3.6-flash";

export async function generateGiftSuggestions(
  systemPrompt: string,
  userPrompt: string,
): Promise<GenerateGiftsAiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AiGenerationError(
      "MISSING_API_KEY",
      "GEMINI_API_KEY が設定されていません。.env.local を確認してください。",
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: systemPrompt,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  let text: string;
  try {
    const result = await model.generateContent(userPrompt);
    text = result.response.text();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("429") || message.toLowerCase().includes("rate limit") || message.toLowerCase().includes("quota")) {
      throw new AiGenerationError("RATE_LIMIT", "APIの利用上限に達しました。しばらくしてから再度お試しください。");
    }
    throw new AiGenerationError("API_ERROR", `AI APIの呼び出しに失敗しました: ${message}`);
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(text);
  } catch {
    throw new AiGenerationError("PARSE_ERROR", "AIの応答をJSONとして解釈できませんでした。");
  }

  const validated = generateGiftsResponseSchema.safeParse(parsedJson);
  if (!validated.success) {
    throw new AiGenerationError("PARSE_ERROR", "AIの応答が想定した形式と一致しませんでした。");
  }

  return validated.data;
}
