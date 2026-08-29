import { z } from "zod";
import type { RelationshipConfig } from "@/lib/relationships/types";

/**
 * RelationshipConfig の fields 定義から、その関係性専用の入力検証スキーマを組み立てる。
 * 関係性を追加しても、この関数を変更する必要はない。
 */
export function buildInputSchema(config: RelationshipConfig) {
  const shape: Record<string, z.ZodTypeAny> = {
    relationshipId: z.literal(config.id),
  };

  for (const field of config.fields) {
    let schema: z.ZodTypeAny = z.string();

    if (field.type === "select" && field.options) {
      const values = field.options.map((o) => o.value) as [string, ...string[]];
      schema = z.enum(values);
    } else {
      let strSchema = z.string();
      if (field.maxLength) strSchema = strSchema.max(field.maxLength);
      if (field.required && field.minLength) {
        strSchema = strSchema.min(field.minLength);
      }
      schema = strSchema;
    }

    if (!field.required) {
      schema = schema.optional().or(z.literal(""));
    }

    shape[field.id] = schema;
  }

  return z.object(shape);
}
