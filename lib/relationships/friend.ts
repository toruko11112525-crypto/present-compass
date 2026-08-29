import type { RelationshipConfig } from "./types";

export const friendConfig: RelationshipConfig = {
  id: "friend",
  label: "友達・親友",
  description: "友達や親友へのプレゼントを一緒に考えます",
  fields: [
    {
      id: "ageRange",
      label: "相手の年代",
      type: "select",
      required: true,
      options: [
        { value: "10s", label: "10代" },
        { value: "20s", label: "20代" },
        { value: "30s", label: "30代" },
        { value: "40s", label: "40代" },
        { value: "50s_over", label: "50代以上" },
        { value: "unknown", label: "わからない・回答しない" },
      ],
    },
    {
      id: "gender",
      label: "相手の性別（任意）",
      type: "select",
      required: false,
      options: [
        { value: "unspecified", label: "回答しない" },
        { value: "female", label: "女性" },
        { value: "male", label: "男性" },
        { value: "other", label: "その他" },
      ],
    },
    {
      id: "hobby",
      label: "趣味・好きなもの",
      type: "text",
      required: false,
      maxLength: 100,
      placeholder: "例：カフェ巡り、キャンプ、K-POP",
    },
    {
      id: "episode",
      label: "相手との思い出・エピソード",
      type: "textarea",
      required: true,
      minLength: 10,
      maxLength: 500,
      placeholder:
        "例：一緒に旅行した時、道に迷って大笑いしたことがある。いつも誰かのために動いてくれる優しい人。",
    },
    {
      id: "budget",
      label: "予算感",
      type: "select",
      required: true,
      options: [
        { value: "under_3000", label: "〜3,000円" },
        { value: "under_5000", label: "〜5,000円" },
        { value: "under_10000", label: "〜10,000円" },
        { value: "flexible", label: "こだわらない" },
      ],
    },
    {
      id: "scene",
      label: "シーン",
      type: "select",
      required: true,
      options: [
        { value: "birthday", label: "誕生日" },
        { value: "anniversary", label: "記念日" },
        { value: "thanks", label: "お礼" },
        { value: "no_reason", label: "特に理由なし" },
      ],
    },
  ],
  promptContext:
    "ユーザーは「友達」または「親友」に贈るプレゼントを探しています。日常的な友人関係の温度感を踏まえて提案してください。",
  toneGuideline:
    "カジュアルで親しみやすく、少しポップな言葉遣いで提案してください。堅苦しい敬語や高級ギフトの押し付けは避けてください。",
};
