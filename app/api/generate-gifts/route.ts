import { NextResponse } from "next/server";
import { getRelationshipConfig } from "@/lib/relationships";
import { buildInputSchema } from "@/lib/validation/inputSchema";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai/promptBuilder";
import { generateGiftSuggestions, AiGenerationError } from "@/lib/ai/client";
import { buildAmazonSearchUrl, buildRakutenSearchUrl } from "@/lib/affiliate/links";
import type { GenerateGiftsResponse } from "@/types/gift";

export const maxDuration = 60;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が不正です。" }, { status: 400 });
  }

  const relationshipId =
    typeof body === "object" && body !== null && "relationshipId" in body
      ? String((body as Record<string, unknown>).relationshipId)
      : undefined;

  const config = relationshipId ? getRelationshipConfig(relationshipId) : undefined;
  if (!config) {
    return NextResponse.json({ error: "指定された関係性はサポートされていません。" }, { status: 400 });
  }

  const inputSchema = buildInputSchema(config);
  const parsedInput = inputSchema.safeParse(body);
  if (!parsedInput.success) {
    return NextResponse.json(
      { error: "入力内容に不備があります。もう一度ご確認ください。" },
      { status: 400 },
    );
  }

  const values = parsedInput.data as unknown as Record<string, string>;
  const systemPrompt = buildSystemPrompt(config);
  const userPrompt = buildUserPrompt({ config, values });

  try {
    const result = await generateGiftSuggestions(systemPrompt, userPrompt);
    const response: GenerateGiftsResponse = {
      suggestions: result.suggestions.map((s) => ({
        ...s,
        amazonUrl: buildAmazonSearchUrl(s.name),
        rakutenUrl: buildRakutenSearchUrl(s.name),
      })),
    };
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    if (err instanceof AiGenerationError) {
      const status = err.code === "RATE_LIMIT" ? 429 : err.code === "MISSING_API_KEY" ? 500 : 502;
      return NextResponse.json({ error: err.message }, { status });
    }
    return NextResponse.json({ error: "予期しないエラーが発生しました。" }, { status: 500 });
  }
}
