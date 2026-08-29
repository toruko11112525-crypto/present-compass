import { z } from "zod";

export const giftSuggestionSchema = z.object({
  name: z.string().min(1),
  reason: z.string().min(1),
  priceRange: z.string().min(1),
});

export const generateGiftsResponseSchema = z.object({
  suggestions: z.array(giftSuggestionSchema).min(3).max(5),
});

export type GenerateGiftsAiResponse = z.infer<typeof generateGiftsResponseSchema>;
