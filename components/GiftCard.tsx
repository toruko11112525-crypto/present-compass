import type { PresentSuggestion } from "@/types/gift";

const ACCENT_ICONS = ["🎁", "✨", "💝", "🎀", "🌟"];

type GiftCardProps = {
  suggestion: PresentSuggestion;
  index: number;
};

export function GiftCard({ suggestion, index }: GiftCardProps) {
  const icon = ACCENT_ICONS[index % ACCENT_ICONS.length];

  return (
    <div className="flex flex-col gap-3 rounded-3xl border-2 border-pink-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-orange-100 text-2xl">
          {icon}
        </span>
        <h3 className="text-lg font-bold text-zinc-800">{suggestion.name}</h3>
      </div>
      <p className="text-sm leading-relaxed text-zinc-600">{suggestion.reason}</p>
      <span className="w-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
        目安 {suggestion.priceRange}
      </span>
      <div className="flex gap-2 pt-1">
        <a
          href={suggestion.amazonUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex-1 rounded-full border-2 border-zinc-200 py-2 text-center text-xs font-bold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
        >
          Amazonで探す
        </a>
        <a
          href={suggestion.rakutenUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex-1 rounded-full border-2 border-zinc-200 py-2 text-center text-xs font-bold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
        >
          楽天で探す
        </a>
      </div>
    </div>
  );
}
