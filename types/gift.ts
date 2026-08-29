export type PresentSuggestion = {
  name: string;
  reason: string;
  priceRange: string;
  amazonUrl: string;
  rakutenUrl: string;
};

export type GenerateGiftsResponse = {
  suggestions: PresentSuggestion[];
};

export type GenerateGiftsErrorResponse = {
  error: string;
};
