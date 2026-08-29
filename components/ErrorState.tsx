type ErrorStateProps = {
  message: string;
  onRetry: () => void;
  onBack: () => void;
};

export function ErrorState({ message, onRetry, onBack }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
      <span className="text-5xl">😵</span>
      <div className="space-y-1">
        <p className="text-lg font-bold text-zinc-800">うまく提案を作れませんでした</p>
        <p className="max-w-sm text-sm text-zinc-500">{message}</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90"
        >
          もう一度試す
        </button>
        <button
          onClick={onBack}
          className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-bold text-zinc-600 transition hover:bg-zinc-100"
        >
          入力に戻る
        </button>
      </div>
    </div>
  );
}
