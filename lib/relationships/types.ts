export type FieldType = "text" | "textarea" | "select";

export type FieldOption = {
  value: string;
  label: string;
};

export type FieldDefinition = {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  options?: FieldOption[];
};

/**
 * 関係性ごとの設定。友達・親友以外（恋人など）を追加する際は
 * この型に沿った設定ファイルを lib/relationships/ に追加し、
 * index.ts のレジストリに登録するだけで拡張できる。
 */
export type RelationshipConfig = {
  id: string;
  label: string;
  description: string;
  fields: FieldDefinition[];
  /** システムプロンプトに注入する関係性固有の文脈説明 */
  promptContext: string;
  /** 提案のトーン・言葉遣いの指示 */
  toneGuideline: string;
};
