import type { RelationshipConfig } from "./types";
import { friendConfig } from "./friend";

/**
 * 関係性レジストリ。将来「恋人向け」等を追加する場合は、
 * 新しい設定ファイル（例: romantic.ts）を作成し、ここに登録する。
 */
export const relationshipRegistry: Record<string, RelationshipConfig> = {
  [friendConfig.id]: friendConfig,
};

export const defaultRelationshipId = friendConfig.id;

export function getRelationshipConfig(id: string): RelationshipConfig | undefined {
  return relationshipRegistry[id];
}

export function listRelationships(): RelationshipConfig[] {
  return Object.values(relationshipRegistry);
}

export type { RelationshipConfig, FieldDefinition, FieldOption, FieldType } from "./types";
